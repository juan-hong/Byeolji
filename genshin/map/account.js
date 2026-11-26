// 별지 계정: 앱과 같은 Firebase 로그인 + 같은 계정 서버 (/v1/progress).
// 웹 Firebase 키는 원래 공개용 (앱 설치 파일에도 들어 있음). 권한은 서버가 토큰으로 확인
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// 게임 구분 (서버 /v1/progress?game=)
const GAME = 'genshin';
const API = 'https://genshin-overlay-api-483165482465.us-central1.run.app';
const app = initializeApp({ apiKey: 'AIzaSyAp8rs5JtHK0mQkC0gITrGY7YIPPDMwZd4', authDomain: 'genshin-overlay.firebaseapp.com', projectId: 'genshin-overlay' });
const auth = getAuth(app);

// 문자열은 strings.js (앱 l10n 에서 뽑음). map.js 가 t 를 열어 둠
let lang = 'ko';
const t = (k) => window.ByeoljiMap?.t(k) ?? k;
const $ = (id) => document.getElementById(id);
const mapApi = () => window.ByeoljiMap;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (id) => `<svg><use href="#i-${id}"/></svg>`;

let user = null;
let status = '';
let error = '';
let info = '';
let mode = 'signIn';   // 로그인 / 회원가입 탭
let pushTimer = null;

async function call(method, path, body) {
  const token = await user.getIdToken();
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`${method} ${path} ${res.status}`);
    err.status = res.status;
    err.data = await res.json().catch(() => null);
    throw err;
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

// 마지막으로 서버와 맞춘 updated_at (undefined = 아직 모름). 올릴 때 같이 보내서
// 그 사이 앱·다른 탭이 쓴 기록을 덮어쓰지 않게 함. 409 면 서버 기록과 합쳐서 다시
let serverAt;
async function upload() {
  for (let i = 0; ; i++) {
    const body = { collected: mapApi()?.progress() || [] };
    if (serverAt !== undefined) body.base = serverAt;
    try {
      const res = await call('PUT', `/v1/progress?game=${GAME}`, body);
      serverAt = res?.updated_at ?? null;
      return;
    } catch (e) {
      if (e.status !== 409 || i >= 3) throw e;
      const local = new Set(mapApi()?.progress() || []);
      const merged = new Set([...(e.data?.collected || []), ...local]);
      if (merged.size !== local.size) mapApi()?.setProgress([...merged]);
      serverAt = e.data?.updated_at ?? null;
    }
  }
}

// 로그인 직후: 서버 기록과 합집합 (앱과 같음). 로컬에만 있던 것도 올림
async function pullAndMerge() {
  setStatus(t('syncing'));
  try {
    const data = await call('GET', `/v1/progress?game=${GAME}`);
    serverAt = data?.updated_at ?? null;
    const remote = new Set(data?.collected || []);
    const local = new Set(mapApi()?.progress() || []);
    const merged = new Set([...remote, ...local]);
    if (merged.size !== local.size) mapApi()?.setProgress([...merged]);
    if (merged.size !== remote.size) await upload();
    setStatus(t('synced'));
  } catch (e) {
    console.warn(e);
    setStatus(t('syncError'));
  }
}

// 웹은 종료 시점이 없어서 바뀌고 4초 뒤 올림 (탭 숨길 때는 바로)
async function push() {
  clearTimeout(pushTimer);
  pushTimer = null;
  if (!user) return;
  setStatus(t('syncing'));
  try {
    await upload();
    setStatus(t('synced'));
  } catch (e) {
    console.warn(e);
    setStatus(t('syncError'));
  }
}

// 즐겨찾기: 로그인 때 서버와 로컬 중 나중에 바꾼 쪽을 씀, 바꾸면 2초 뒤 올림
let favTimer = null;
async function pullFavorites() {
  try {
    const data = await call('GET', `/v1/favorites?game=${GAME}`);
    const local = mapApi()?.favorites();
    if (!local) return;
    const remoteAt = data?.updated_at ? Date.parse(data.updated_at) : 0;
    if (!data?.updated_at || (local.dirty && local.at > remoteAt)) {
      if (local.cards.length || local.dirty) await pushFavorites();
      return;
    }
    mapApi()?.setFavorites(data.cards || [], remoteAt);
  } catch (e) {
    console.warn(e);
  }
}
async function pushFavorites() {
  clearTimeout(favTimer);
  favTimer = null;
  if (!user) return;
  try {
    await call('PUT', `/v1/favorites?game=${GAME}`, { cards: mapApi()?.favorites().cards || [] });
    mapApi()?.favoritesPushed();
  } catch (e) {
    console.warn(e);
  }
}

function setStatus(s) { status = s; render(lang); }

// Firebase 오류 코드 -> 앱과 같은 문구 (err_*)
const errText = (e) => {
  const c = e?.code || '';
  if (/popup-closed|cancelled-popup/.test(c)) return '';
  if (/invalid-credential|wrong-password|user-not-found/.test(c)) return t('err_wrongCredentials');
  if (/invalid-email|missing-email/.test(c)) return t('err_invalidEmail');
  if (/weak-password|missing-password/.test(c)) return t('err_weakPassword');
  if (/email-already-in-use/.test(c)) return t('err_emailExists');
  if (/too-many-requests/.test(c)) return t('err_tooManyAttempts');
  if (/user-disabled/.test(c)) return t('err_userDisabled');
  if (/network/.test(c)) return t('err_network');
  return t('err_unknown');
};

async function run(fn) {
  error = ''; info = '';
  try { await fn(); } catch (e) { error = errText(e); }
  render(lang);
}

// 계정 화면 (앱 계정 화면과 같은 배치: 안내 · 로그인/회원가입 탭 · 입력 · 버튼 · 또는 · Google)
function render(l) {
  lang = l || lang;
  const dot = document.querySelector('#btn-account .dot');
  if (dot) dot.hidden = !user;
  const box = $('account-box');
  if (!box) return;
  if (user) {
    box.innerHTML = `<div class="who"><b>${esc(user.email || '')}</b><span class="msg">${esc(status || t('synced'))}</span></div>
      <button class="outline" id="acc-out" type="button">${esc(t('signOut'))}</button>
      ${error ? `<div class="err">${esc(error)}</div>` : ''}`;
    $('acc-out').onclick = () => run(async () => { await push(); if (favTimer) await pushFavorites(); await signOut(auth); });
    return;
  }
  const up = mode === 'signUp';
  const keep = { e: $('acc-email')?.value || '', p: $('acc-pw')?.value || '' };
  box.innerHTML = `<p class="hint">${esc(t('accountHint'))}</p>
    <div class="chips" style="margin-bottom:12px">
      <button type="button" class="chip${up ? '' : ' on'}" data-mode="signIn">${esc(t('signIn'))}</button>
      <button type="button" class="chip${up ? ' on' : ''}" data-mode="signUp">${esc(t('signUp'))}</button></div>
    <label class="field">${icon('mail')}<input id="acc-email" type="email" autocomplete="email" placeholder="${esc(t('email'))}"></label>
    <label class="field">${icon('lock')}<input id="acc-pw" type="password" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="${esc(t('password'))}"></label>
    <button class="primary" id="acc-go" type="button">${esc(t(up ? 'signUp' : 'signIn'))}</button>
    ${up ? '' : `<div class="right"><button class="link" id="acc-reset" type="button">${esc(t('forgotPassword'))}</button></div>`}
    ${error ? `<div class="err">${esc(error)}</div>` : ''}${info ? `<div class="msg">${esc(info)}</div>` : ''}
    <div class="or">${esc(t('or'))}</div>
    <button class="outline" id="acc-google" type="button">${icon('user')}${esc(t('google'))}</button>`;
  $('acc-email').value = keep.e;
  $('acc-pw').value = keep.p;
  const email = () => $('acc-email').value.trim();
  const pw = () => $('acc-pw').value;
  box.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => { mode = b.dataset.mode; error = ''; info = ''; render(lang); }; });
  $('acc-go').onclick = () => run(() => (up ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, email(), pw()));
  $('acc-pw').onkeydown = (e) => { if (e.key === 'Enter') $('acc-go').click(); };
  if (!up) $('acc-reset').onclick = () => run(async () => { await sendPasswordResetEmail(auth, email()); info = t('resetSent'); });
  $('acc-google').onclick = () => run(() => signInWithPopup(auth, new GoogleAuthProvider()));
}

window.ByeoljiAccount = {
  render,
  localChanged() {
    if (!user) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 4000);
  },
  favoritesChanged() {
    if (!user) return;
    clearTimeout(favTimer);
    favTimer = setTimeout(pushFavorites, 2000);
  },
};

document.addEventListener('visibilitychange', () => {
  if (document.hidden && pushTimer) push();
  if (document.hidden && favTimer) pushFavorites();
});
onAuthStateChanged(auth, (u) => {
  const was = user;
  user = u;
  if (u && !was) { pullAndMerge(); pullFavorites(); }
  if (!u) { status = ''; serverAt = undefined; }
  render(mapApi()?.lang() || lang);
});
render(mapApi()?.lang() || lang);
