// 별지 웹 지도. 데이터는 별지 저장소 tools/build_web_map.py 가 만든 map/data, map/tiles, map/icons.
// 좌표 = 앱 지도 캔버스 px (티바트 옆에 별도 지도 붙인 판). 줌 0 = 원본 1:1, -1 = 1/2 ...
// 패널은 앱 패널(category_panel.dart)과 같은 구성. 앱에서만 되는 것(단축키·미니맵·투명도·업데이트)은 뺌
(() => {
  const API = 'https://genshin-overlay-api-483165482465.us-central1.run.app';
  const S = window.BYEOLJI_STR || {};
  const LANGS = ['en', 'ko', 'ja', 'zh', 'ru', 'id', 'es'];
  const LANG_NAMES = { en: 'English', ko: '한국어', ja: '日本語', zh: '简体中文', ru: 'Русский', id: 'Bahasa Indonesia', es: 'Español' };
  const THEMES = ['d', 'mond', 'liyue', 'inazuma', 'sumeru', 'fontaine', 'natlan', 'nodkrai', 'snezhnaya'];
  const SCALES = [[0.9, 'uiScaleS'], [1, 'uiScaleM'], [1.15, 'uiScaleL'], [1.3, 'uiScaleXL']];

  const store = {
    get(k, d) { try { const v = localStorage.getItem('byeolji.map.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('byeolji.map.' + k, JSON.stringify(v)); } catch {} },
  };
  const pickLang = () => {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    try { const s = localStorage.getItem('lang'); if (LANGS.includes(s)) return s; } catch {}
    for (const l of navigator.languages || ['en']) { const b = l.slice(0, 2).toLowerCase(); if (LANGS.includes(b)) return b; }
    return 'en';
  };

  let lang = pickLang();
  const t = (k) => (S[lang] && S[lang][k]) ?? (S.en && S.en[k]) ?? (S.ko && S.ko[k]) ?? k;
  const nameOf = (o) => (o.names && o.names[lang]) || o.name;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const icon = (id) => `<svg><use href="#i-${id}"/></svg>`;

  const state = {
    cards: new Set(store.get('cards', [])),
    regionAuto: store.get('regionAuto', true),
    region: store.get('region', null),
    hideDone: store.get('hideDone', false),
    folded: new Set(store.get('folded', [])),
    layout: store.get('layout', 'list'),
    ui: store.get('ui', 1),
    txt: store.get('txt', 1),
    theme: store.get('theme', 'd'),
    guideDone: store.get('guideDone', false),
    dismissed: new Set(store.get('dismissed', [])),
    query: '',
    area: null,          // 지금 보고 있는 지역 (자동)
    view: 'main',
  };
  // 획득 기록 (point id). 로그인하면 account.js 가 서버와 합침
  const progress = new Set(store.get('progress', []));
  const saveProgress = () => store.set('progress', [...progress]);

  let data;      // {layout, cats, points}
  let byName;    // 카드 이름 -> 카드
  let allPoints = [];
  let notices = null;
  let map, markerLayer;
  let visible = [];       // [{p, card, group}]
  let clusterCache = { key: null, list: [] };

  const $ = (id) => document.getElementById(id);

  async function load() {
    const [layout, cats, points] = await Promise.all(
      ['layout', 'categories', 'points'].map((f) => fetch(`data/${f}.json`).then((r) => r.json())),
    );
    data = { layout, cats, points };
    byName = new Map();
    for (const sec of cats.sections) for (const c of sec.cards) byName.set(c.name, c);
    for (const list of Object.values(points)) allPoints.push(...list);
  }

  // --- 지도 ---
  function initMap() {
    const { width: W, height: H, tile, levels } = data.layout;
    // 위도=y(아래로 증가), 경도=x. 줌 0 에서 1 = 캔버스 1px
    const crs = L.extend({}, L.CRS.Simple, { transformation: new L.Transformation(1, 0, 1, 0) });
    const bounds = L.latLngBounds([0, 0], [H, W]);
    map = L.map('map', {
      // 최대 0.5: 원본 1px 를 화면 1.4px 까지만 (더 키우면 흐려짐)
      crs, minZoom: -5, maxZoom: 0.5, zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 90,
      maxBounds: bounds.pad(0.25), maxBoundsViscosity: 0.6, attributionControl: true, zoomControl: false,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    map.attributionControl.setPrefix('').addAttribution('Map © HoYoverse · <a href="/">Byeolji</a>');
    // 밑그림 전용 층: 타일(200) 아래. 기본 오버레이 층(400)에 두면 선명한 타일을 덮어 버림
    map.createPane('base').style.zIndex = 150;
    L.imageOverlay('tiles/base.webp', bounds, { interactive: false, pane: 'base' }).addTo(map);
    // 바다뿐인 칸은 파일이 없음: 요청 안 하고 투명
    const have = Object.fromEntries(Object.entries(data.layout.have).map(([lv, list]) => [lv, new Set(list)]));
    const EMPTY = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    const Tiles = L.TileLayer.extend({
      getTileUrl: (c) => (have[-c.z]?.has(`${c.x}_${c.y}`) ? `tiles/${-c.z}/${c.x}_${c.y}.webp` : EMPTY),
    });
    new Tiles('', {
      tileSize: tile, minNativeZoom: -(levels - 1), maxNativeZoom: 0, minZoom: -5,
      // 지도 상한(0.5)보다 커야 함: Leaflet 이 줌을 반올림(0.5 -> 1)해서 타일을 고름
      maxZoom: 2, bounds, noWrap: true,
      keepBuffer: 3, errorTileUrl: EMPTY,
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    const saved = store.get('view', null);
    if (saved) map.setView([saved[1], saved[0]], saved[2]);
    else map.fitBounds(bounds);
    map.on('zoomend moveend', () => {
      const c = map.getCenter();
      store.set('view', [Math.round(c.lng), Math.round(c.lat), map.getZoom()]);
      drawMarkers();
      updateArea();
    });
  }

  // 지도 가운데 가까운 지점들의 지역 다수결 = 지금 보고 있는 지역 (앱 _updateArea)
  let areaAt = null;
  function updateArea() {
    const c = map.getCenter();
    if (areaAt && Math.hypot(c.lng - areaAt[0], c.lat - areaAt[1]) < 80) return;
    areaAt = [c.lng, c.lat];
    const near = [];
    for (const p of allPoints) {
      const d = (p[2] - c.lng) ** 2 + (p[3] - c.lat) ** 2;
      if (d > 600 * 600) continue;
      near.push([d, p[1]]);
    }
    let area = null;
    if (near.length) {
      near.sort((a, b) => a[0] - b[0]);
      const votes = new Map();
      for (const [, a] of near.slice(0, 15)) votes.set(a, (votes.get(a) || 0) + 1);
      area = [...votes].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    }
    if (area === state.area) return;
    state.area = area;
    if (state.regionAuto) { renderRegion(); renderSections(); }
  }

  // 패널 목록·개수의 지역 (자동이면 지금 보는 지역). 지도 마커는 고정 지역일 때만 거름
  const panelRegion = () => (state.regionAuto ? state.area : state.region);
  const markerRegion = () => (state.regionAuto ? null : state.region);

  // --- 표시할 지점 ---
  function cardPoints(card, region) {
    const out = [];
    for (const label of card.label_ids) {
      for (const p of data.points[label] || []) {
        if (card.area_id != null && p[1] !== card.area_id) continue;
        if (region != null && p[1] !== region) continue;
        out.push(p);
      }
    }
    return out;
  }

  function updateVisible() {
    const seen = new Set();
    visible = [];
    for (const sec of data.cats.sections) {
      for (const card of sec.cards) {
        if (!state.cards.has(card.name)) continue;
        for (const p of cardPoints(card, markerRegion())) {
          if (seen.has(p[0])) continue;
          seen.add(p[0]);
          if (state.hideDone && progress.has(p[0])) continue;
          visible.push({ p, card, group: card.name + (p[4] ? '|u' : '') });
        }
      }
    }
    clusterCache.key = null;
    drawMarkers();
  }

  // 같은 카드끼리 화면에서 30px 안이면 묶음. 줌 0 이상이면 하나씩
  function clusters() {
    const zoom = map.getZoom();
    const key = zoom + ':' + visible.length;
    if (clusterCache.key === key) return clusterCache.list;
    let list;
    if (zoom >= 0) {
      list = visible.map((v) => ({ items: [v], x: v.p[2], y: v.p[3] }));
    } else {
      const cell = 30 / Math.pow(2, zoom);
      const grid = new Map();
      list = [];
      for (const v of visible) {
        const gx = Math.floor(v.p[2] / cell), gy = Math.floor(v.p[3] / cell);
        let target = null;
        for (let dx = -1; dx <= 1 && !target; dx++) {
          for (let dy = -1; dy <= 1 && !target; dy++) {
            for (const c of grid.get(`${v.group}|${gx + dx}|${gy + dy}`) || []) {
              const ax = c.items[0].p[2] - v.p[2], ay = c.items[0].p[3] - v.p[3];
              if (ax * ax + ay * ay <= cell * cell) { target = c; break; }
            }
          }
        }
        if (target) target.items.push(v);
        else {
          const c = { items: [v] };
          list.push(c);
          const k = `${v.group}|${gx}|${gy}`;
          (grid.get(k) || grid.set(k, []).get(k)).push(c);
        }
      }
      for (const c of list) {
        c.x = c.items.reduce((s, v) => s + v.p[2], 0) / c.items.length;
        c.y = c.items.reduce((s, v) => s + v.p[3], 0) / c.items.length;
      }
    }
    clusterCache = { key, list };
    return list;
  }

  function drawMarkers() {
    if (!map) return;
    markerLayer.clearLayers();
    const b = map.getBounds().pad(0.15);
    for (const c of clusters()) {
      if (!b.contains([c.y, c.x])) continue;
      const first = c.items[0];
      const done = c.items.filter((v) => progress.has(v.p[0])).length;
      const single = c.items.length === 1;
      const cls = 'mk' + (single && done ? ' done' : '') + (first.p[4] ? ' under' : '');
      const n = single ? '' : `<span class="n">${done}/${c.items.length}</span>`;
      const ic = L.divIcon({
        className: '', iconSize: [30, 30], iconAnchor: [15, 15],
        html: `<div class="${cls}" style="background:${first.card.color}"><img src="icons/${first.card.icon}.png" alt="">${n}</div>`,
      });
      const m = L.marker([c.y, c.x], { icon: ic, keyboard: false, title: nameOf(first.card) });
      m.on('click', () => {
        if (single) toggle(first.p[0]);
        else map.setView([c.y, c.x], Math.min(map.getZoom() + 2, 0.5));
      });
      markerLayer.addLayer(m);
    }
  }

  function changedProgress() {
    saveProgress();
    window.ByeoljiAccount?.localChanged([...progress]);
    if (state.hideDone) updateVisible(); else drawMarkers();
    renderSections();
  }

  function toggle(id) {
    progress.has(id) ? progress.delete(id) : progress.add(id);
    toast(progress.has(id) ? t('collected') : t('uncollected'));
    changedProgress();
  }

  let toastTimer;
  function toast(text) {
    const el = $('toast');
    el.textContent = text; el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 1200);
  }

  // --- 패널: 공통 ---
  function applyLook() {
    const root = document.documentElement;
    root.lang = lang === 'zh' ? 'zh-CN' : lang;
    root.dataset.theme = state.theme;
    root.style.setProperty('--ui', state.ui);
    root.style.setProperty('--txt', state.txt);
    const panel = $('panel');
    panel.classList.toggle('big', state.txt > 1);
    // 기본 테마는 바탕 그림 없음 (앱과 같음)
    panel.classList.toggle('has-backdrop', state.theme !== 'd');
    panel.style.setProperty('--bg-img', state.theme === 'd' ? 'none' : `url("themes/${state.theme}.webp")`);
  }

  function renderStatic() {
    applyLook();
    $('search').placeholder = t('search');
    document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    $('btn-settings').title = t('settings');
    $('btn-account').title = t('account');
    $('close-panel').title = t('closePanel');
    $('privacy').href = API + '/privacy';
    $('hide-done').checked = state.hideDone;
    renderRegion();
    renderSettings();
    renderDonate();
    window.ByeoljiAccount?.render(lang);
  }

  function showView(v) {
    state.view = v;
    for (const id of ['main', 'settings', 'account']) $('view-' + id).hidden = id !== v;
    $('btn-settings').classList.toggle('on', v === 'settings');
    $('btn-account').classList.toggle('on', v === 'account');
  }

  // --- 지역 바 ---
  function regionName(area) {
    if (area == null) return t('allRegions');
    const r = data.cats.regions.find((x) => x.area_id === area);
    return r ? nameOf(r) : t('allRegions');
  }

  function renderRegion() {
    const auto = state.regionAuto;
    const value = auto ? (state.area == null ? t('notLocated') : regionName(state.area)) : regionName(state.region);
    $('region-btn').innerHTML = `<span class="ico">${icon(auto ? 'loc' : 'pin')}</span>
      <span class="lb">${esc(auto ? t('here') : t('region'))}</span><span class="val">${esc(value)}</span>
      <span class="mode">${esc(auto ? t('autoRegion') : t('fixedRegion'))}</span><span class="chev">${icon('down')}</span>`;
    const item = (v, label, on) => `<button type="button" data-region="${v}" class="${on ? 'on' : ''}"><span class="ck">${icon('check')}</span>${esc(label)}</button>`;
    $('region-menu').innerHTML = item('auto', t('autoRegion'), auto) + '<hr>' +
      item('all', t('allRegions'), !auto && state.region == null) +
      data.cats.regions.map((r) => item(r.area_id, nameOf(r), !auto && state.region === r.area_id)).join('');
  }

  function setRegion(v) {
    state.regionAuto = v === 'auto';
    state.region = v === 'auto' || v === 'all' ? null : Number(v);
    store.set('regionAuto', state.regionAuto);
    store.set('region', state.region);
    $('region-menu').hidden = true;
    renderRegion(); renderSections(); updateVisible();
  }

  // --- 사용법·공지 ---
  function renderTop() {
    const out = [];
    if (!state.guideDone) {
      out.push(`<div class="box"><h3>${esc(t('guideTitle'))}</h3><ol>
        ${[1, 2, 3, 4].map((i) => `<li>${esc(t('guide' + i))}</li>`).join('')}</ol>
        <button type="button" class="ok" data-guide-done>${esc(t('guideDone'))}</button></div>`);
    }
    for (const n of notices?.notices || []) {
      // 버전을 정해 둔 공지(앱 전용)와 웹에서 볼 필요 없는 공지는 뺌
      if (n.min_version || n.max_version || n.apps_only || state.dismissed.has(n.id)) continue;
      const pick = (m) => (m && (m[lang] || m.en || m.ko)) || '';
      out.push(`<div class="box"><h3>${icon('mega')}${esc(pick(n.title))}</h3><p>${esc(pick(n.body))}</p>
        <button type="button" class="ib x" data-dismiss="${esc(n.id)}" title="${esc(t('dismiss'))}">${icon('close')}</button></div>`);
    }
    $('top-cards').innerHTML = out.join('');
  }

  async function loadNotices() {
    try {
      // version 을 안 보냄: 앱 실행 횟수에 안 세고 업데이트 안내도 없음
      notices = await (await fetch(API + '/v1/notices')).json();
      renderTop(); renderDonate();
    } catch (e) { console.warn('notices', e); }
  }

  function renderDonate() {
    const box = $('donate');
    const kofi = notices?.donate_url, kakao = lang === 'ko' ? notices?.kakaopay_url : null;
    if (!kofi && !kakao) { box.innerHTML = ''; return; }
    box.innerHTML = `<p>${esc(t('donateHint'))}</p>` +
      (kakao ? `<a href="${esc(kakao)}" target="_blank" rel="noopener">${esc(t('donateKakao'))}</a>` : '') +
      (kofi ? `<a href="${esc(kofi)}" target="_blank" rel="noopener">${esc(t('donateKofi'))}</a>` : '');
  }

  // --- 섹션 ---
  function renderSections() {
    if (!data) return;
    const q = state.query.trim().toLowerCase();
    const region = panelRegion();
    const html = [];
    let any = false;
    for (const sec of data.cats.sections) {
      const cards = sec.cards.filter((c) => {
        if (region != null && c.count_by_area && !c.count_by_area[region]) return false;
        if (!q) return true;
        return nameOf(c).toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      });
      if (!cards.length) continue;
      any = true;
      const on = cards.filter((c) => state.cards.has(c.name)).length;
      const closed = state.folded.has(sec.name) && !q;
      const body = state.layout === 'card'
        ? `<div class="grid">${cards.map((c) => tile(c, region)).join('')}</div>`
        : cards.map((c) => row(c, region)).join('');
      html.push(`<section class="sec${closed ? ' closed' : ''}" data-sec="${esc(sec.name)}">
        <div class="sec-h"><span class="nm">${esc(nameOf(sec))}</span><span class="ct${on ? ' on' : ''}">${on ? on + ' / ' : ''}${cards.length}</span><span class="chev">${icon('down')}</span></div>
        <div class="body">${body}</div></section>`);
    }
    if (!any) {
      html.push(q
        ? `<div class="empty"><b>${esc(t('noMatch').replace('{q}', state.query.trim()))}</b>${esc(t('noMatchHint'))}</div>`
        : `<div class="empty"><b>${esc(t('noCardsInRegion'))}</b><button type="button" class="link" data-region-all>${esc(t('showAllRegions'))}</button></div>`);
    }
    $('sections').innerHTML = html.join('');
    $('sel-count').textContent = t('showing').replace('{n}', state.cards.size);
  }

  function counts(card, region) {
    const pts = cardPoints(card, region);
    return [pts.filter((p) => progress.has(p[0])).length, pts.length];
  }

  const badge = (c) => `<span class="badge" style="background:${c.color}"><img src="icons/${c.icon}.png" alt="" loading="lazy"></span>`;
  const acts = (c) => `<span class="acts"><span data-bulk="1" data-name="${esc(c.name)}" title="${esc(t('collectAll'))}">${icon('all')}</span><span data-bulk="0" data-name="${esc(c.name)}" title="${esc(t('uncollectAll'))}">${icon('none')}</span></span>`;

  // 목록 한 줄: 아이콘 · 이름 · 개수 · 스위치, 아래 획득 막대
  function row(c, region) {
    const on = state.cards.has(c.name);
    const [done, total] = counts(c, region);
    return `<div role="button" tabindex="0" aria-pressed="${on}" class="row${on ? ' on' : ''}" data-card="${esc(c.name)}">${badge(c)}
      <span class="nm">${esc(nameOf(c))}</span>${acts(c)}<span class="ct">${done}/${total}</span>
      <input type="checkbox" class="sw" tabindex="-1" ${on ? 'checked' : ''} aria-hidden="true">
      <span class="bar" style="width:${total ? (done / total) * 100 : 0}%"></span></div>`;
  }

  // 카드 (3열): 아이콘, 고르면 체크, 이름, 곳 수
  function tile(c, region) {
    const on = state.cards.has(c.name);
    const [done, total] = counts(c, region);
    const sub = done > 0 ? t('progress').replace('{done}', done).replace('{total}', total) : t('spots').replace('{n}', total);
    return `<div role="button" tabindex="0" aria-pressed="${on}" class="tile${on ? ' on' : ''}" data-card="${esc(c.name)}">${badge(c)}
      <span class="ck">${icon('check')}</span><span class="nm">${esc(nameOf(c))}</span><span class="ct">${esc(sub)}</span>${acts(c)}</div>`;
  }

  function bulk(name, collected) {
    const c = byName.get(name);
    const pts = cardPoints(c, panelRegion());
    const msg = t(collected ? 'confirmCollectAll' : 'confirmUncollectAll').replace('{name}', nameOf(c)).replace('{n}', pts.length);
    if (!confirm(msg)) return;
    for (const p of pts) collected ? progress.add(p[0]) : progress.delete(p[0]);
    changedProgress();
  }

  // --- 설정 ---
  function renderSettings() {
    const chip = (attr, v, label, on) => `<button type="button" class="chip${on ? ' on' : ''}" ${attr}="${v}">${esc(label)}</button>`;
    $('set-lang').innerHTML = LANGS.map((l) => chip('data-lang', l, LANG_NAMES[l], l === lang)).join('');
    $('set-layout').innerHTML = chip('data-layout', 'list', t('layoutList'), state.layout === 'list') + chip('data-layout', 'card', t('layoutCard'), state.layout === 'card');
    $('set-ui').innerHTML = SCALES.map(([v, k]) => chip('data-ui', v, t(k), v === state.ui)).join('');
    $('set-text').innerHTML = SCALES.map(([v, k]) => chip('data-txt', v, t(k), v === state.txt)).join('');
    // 테마 버튼은 그 테마 색으로 (data-theme 이 그 버튼의 변수를 바꿈)
    $('set-theme').innerHTML = THEMES.map((id) => `<button type="button" class="theme${id === state.theme ? ' on' : ''}" data-theme="${id}" data-set-theme="${id}" style="background:var(--panel);color:var(--text)"><i style="background:var(--accent)"></i>${esc(t('theme_' + id))}</button>`).join('');
  }

  function setSetting(key, value) {
    state[key] = value;
    store.set(key, value);
    applyLook(); renderSettings();
    if (key === 'layout' || key === 'txt') renderSections();
  }

  // --- 이벤트 ---
  function bindPanel() {
    $('sections').addEventListener('click', (e) => {
      const b = e.target.closest('[data-bulk]');
      if (b) { e.stopPropagation(); bulk(b.dataset.name, b.dataset.bulk === '1'); return; }
      const card = e.target.closest('[data-card]');
      if (card) {
        const name = card.dataset.card;
        state.cards.has(name) ? state.cards.delete(name) : state.cards.add(name);
        store.set('cards', [...state.cards]);
        renderSections(); updateVisible();
        return;
      }
      if (e.target.closest('[data-region-all]')) { setRegion('all'); return; }
      const h = e.target.closest('.sec-h');
      if (h) {
        const sec = h.parentElement.dataset.sec;
        state.folded.has(sec) ? state.folded.delete(sec) : state.folded.add(sec);
        store.set('folded', [...state.folded]);
        h.parentElement.classList.toggle('closed');
      }
    });
    // 줄·카드는 div 라서 엔터·스페이스도 누름으로
    $('sections').addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-card]')) { e.preventDefault(); e.target.click(); }
    });
    $('top-cards').addEventListener('click', (e) => {
      if (e.target.closest('[data-guide-done]')) { state.guideDone = true; store.set('guideDone', true); renderTop(); return; }
      const d = e.target.closest('[data-dismiss]');
      if (d) { state.dismissed.add(d.dataset.dismiss); store.set('dismissed', [...state.dismissed]); renderTop(); }
    });
    $('search').addEventListener('input', (e) => { state.query = e.target.value; renderSections(); });
    $('region-btn').addEventListener('click', (e) => { e.stopPropagation(); $('region-menu').hidden = !$('region-menu').hidden; });
    $('region-menu').addEventListener('click', (e) => { const b = e.target.closest('[data-region]'); if (b) setRegion(b.dataset.region); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.region-wrap')) $('region-menu').hidden = true; });
    $('clear').addEventListener('click', () => { state.cards.clear(); store.set('cards', []); renderSections(); updateVisible(); });
    $('view-settings').addEventListener('click', (e) => {
      const el = e.target.closest('button');
      if (!el) return;
      if (el.dataset.lang) {
        lang = el.dataset.lang;
        try { localStorage.setItem('lang', lang); } catch {}
        renderStatic(); renderTop(); renderSections(); drawMarkers();
      } else if (el.dataset.layout) setSetting('layout', el.dataset.layout);
      else if (el.dataset.ui) setSetting('ui', Number(el.dataset.ui));
      else if (el.dataset.txt) setSetting('txt', Number(el.dataset.txt));
      else if (el.dataset.setTheme) setSetting('theme', el.dataset.setTheme);
      else if (el.id === 'show-guide') { state.guideDone = false; store.set('guideDone', false); renderTop(); showView('main'); }
    });
    $('hide-done').addEventListener('change', (e) => { state.hideDone = e.target.checked; store.set('hideDone', state.hideDone); updateVisible(); });
  }

  // 화면 전환·패널 열기는 데이터 받기 전에도 되게 (받는 데 1~2초)
  function bindViews() {
    $('btn-settings').addEventListener('click', () => showView(state.view === 'settings' ? 'main' : 'settings'));
    $('btn-account').addEventListener('click', () => showView(state.view === 'account' ? 'main' : 'account'));
    document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => showView('main')));
    $('open-panel').addEventListener('click', () => $('panel').classList.add('open'));
    $('close-panel').addEventListener('click', () => $('panel').classList.remove('open'));
  }

  // account.js 가 서버 기록을 합친 뒤 부름
  window.ByeoljiMap = {
    progress: () => [...progress],
    setProgress(ids) {
      progress.clear(); ids.forEach((id) => progress.add(id));
      saveProgress();
      if (data) { updateVisible(); renderSections(); }
    },
    lang: () => lang,
    t,
  };

  applyLook(); bindViews();
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
  load().then(() => {
    initMap(); bindPanel(); renderStatic(); renderTop(); updateArea(); renderSections(); updateVisible();
    loadNotices();
    // 처음 온 사람: 패널부터 (좁은 화면)
    if (!state.cards.size && innerWidth <= 720) $('panel').classList.add('open');
  });
})();
