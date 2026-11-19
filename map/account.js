// 별지 계정: 앱과 같은 Firebase 로그인 + 같은 계정 서버 (/v1/progress).
// 웹 Firebase 키는 원래 공개용 (앱 설치 파일에도 들어 있음). 권한은 서버가 토큰으로 확인
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const API = 'https://genshin-overlay-api-483165482465.us-central1.run.app';
const app = initializeApp({ apiKey: 'AIzaSyAp8rs5JtHK0mQkC0gITrGY7YIPPDMwZd4', authDomain: 'genshin-overlay.firebaseapp.com', projectId: 'genshin-overlay' });
const auth = getAuth(app);

const STR = {
  ko: { signIn: '로그인', signOut: '로그아웃', email: '이메일', password: '비밀번호', google: 'Google로 계속', signUp: '새로 가입',
    reset: '비밀번호 재설정 메일', resetSent: '재설정 메일을 보냈어요.', synced: '동기화됨', syncing: '동기화 중…', syncFail: '동기화 실패',
    badLogin: '이메일 또는 비밀번호가 맞지 않아요.', weak: '비밀번호는 6자 이상', exists: '이미 가입된 이메일이에요.', error: '잠시 후 다시 해 주세요.' },
  en: { signIn: 'Sign in', signOut: 'Sign out', email: 'Email', password: 'Password', google: 'Continue with Google', signUp: 'Create account',
    reset: 'Send password reset email', resetSent: 'Reset email sent.', synced: 'Synced', syncing: 'Syncing…', syncFail: 'Sync failed',
    badLogin: 'Wrong email or password.', weak: 'Password must be 6+ characters', exists: 'This email is already registered.', error: 'Please try again later.' },
};
let lang = 'ko';
const t = (k) => (STR[lang] || STR.en)[k];
const $ = (id) => document.getElementById(id);
const mapApi = () => window.ByeoljiMap;

let user = null;
let status = '';
let open = false;
let error = '';
let pushTimer = null;

async function call(method, path, body) {
  const token = await user.getIdToken();
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}`);
  return res.status === 204 ? null : res.json().catch(() => null);
}

// 로그인 직후: 서버 기록과 합집합 (앱과 같음). 로컬에만 있던 것도 올림
async function pullAndMerge() {
  setStatus(t('syncing'));
  try {
    const data = await call('GET', '/v1/progress');
    const remote = new Set(data?.collected || []);
    const local = new Set(mapApi()?.progress() || []);
    const merged = new Set([...remote, ...local]);
    if (merged.size !== local.size) mapApi()?.setProgress([...merged]);
    if (merged.size !== remote.size) await call('PUT', '/v1/progress', { collected: [...merged] });
    setStatus(t('synced'));
  } catch (e) {
    console.warn(e);
    setStatus(t('syncFail'));
  }
}

// 웹은 종료 시점이 없어서 바뀌고 4초 뒤 올림 (탭 숨길 때는 바로)
async function push() {
  clearTimeout(pushTimer);
  pushTimer = null;
  if (!user) return;
  setStatus(t('syncing'));
  try {
    await call('PUT', '/v1/progress', { collected: mapApi()?.progress() || [] });
    setStatus(t('synced'));
  } catch (e) {
    console.warn(e);
    setStatus(t('syncFail'));
  }
}

function setStatus(s) { status = s; render(lang); }

const errText = (e) => {
  const c = e?.code || '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(c)) return t('badLogin');
  if (/weak-password/.test(c)) return t('weak');
  if (/email-already-in-use/.test(c)) return t('exists');
  if (/popup-closed|cancelled-popup/.test(c)) return '';
  return t('error');
};

async function run(fn) {
  error = '';
  try { await fn(); } catch (e) { error = errText(e); }
  render(lang);
}

function render(l) {
  lang = l || lang;
  const btn = $('account');
  if (!btn) return;
  btn.hidden = false;
  btn.textContent = user ? (status || t('synced')) : t('signIn');
  const box = $('account-box');
  box.hidden = !open;
  if (!open) return;
  if (user) {
    box.innerHTML = `<div class="msg">${user.email || ''}</div><div class="msg">${status}</div>
      <button class="ghost" id="acc-out" type="button">${t('signOut')}</button>`;
    $('acc-out').onclick = () => run(async () => { await push(); await signOut(auth); });
    return;
  }
  box.innerHTML = `<input id="acc-email" type="email" autocomplete="email" placeholder="${t('email')}">
    <input id="acc-pw" type="password" autocomplete="current-password" placeholder="${t('password')}">
    <button class="primary" id="acc-in" type="button">${t('signIn')}</button>
    <button class="ghost" id="acc-google" type="button">${t('google')}</button>
    <div style="display:flex;gap:6px;justify-content:space-between">
      <button class="ghost" id="acc-up" type="button">${t('signUp')}</button>
      <button class="ghost" id="acc-reset" type="button">${t('reset')}</button></div>
    ${error ? `<div class="err">${error}</div>` : ''}`;
  const email = () => $('acc-email').value.trim();
  const pw = () => $('acc-pw').value;
  $('acc-in').onclick = () => run(() => signInWithEmailAndPassword(auth, email(), pw()));
  $('acc-up').onclick = () => run(() => createUserWithEmailAndPassword(auth, email(), pw()));
  $('acc-reset').onclick = () => run(async () => { await sendPasswordResetEmail(auth, email()); error = t('resetSent'); });
  $('acc-google').onclick = () => run(() => signInWithPopup(auth, new GoogleAuthProvider()));
}

window.ByeoljiAccount = {
  render,
  localChanged() {
    if (!user) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 4000);
  },
};

document.getElementById('account').addEventListener('click', () => { open = !open; render(lang); });
document.addEventListener('visibilitychange', () => { if (document.hidden && pushTimer) push(); });
onAuthStateChanged(auth, (u) => {
  const was = user;
  user = u;
  if (u && !was) { open = false; pullAndMerge(); }
  if (!u) status = '';
  render(mapApi()?.lang() || lang);
});
render(mapApi()?.lang() || lang);
