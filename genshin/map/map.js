// 별지 웹 지도. 데이터는 별지 저장소 tools/build_web_map.py 가 만든 map/data, map/tiles, map/icons.
// 좌표 = 앱 지도 캔버스 px (티바트 옆에 별도 지도 붙인 판). 줌 0 = 원본 1:1, -1 = 1/2 ...
(() => {
  const STR = {
    ko: { search: '이름으로 찾기', allRegions: '모든 지역', hideDone: '획득한 곳 숨기기', hideAll: '모두 끄기', showing: '{n}개 표시 중',
      syncNote: '로그인하면 별지 PC·안드로이드 앱과 기록이 이어집니다.', getApp: '앱 받기', signIn: '로그인', signOut: '로그아웃',
      collected: '획득', uncollected: '미획득' },
    en: { search: 'Find by name', allRegions: 'All regions', hideDone: 'Hide found spots', hideAll: 'Hide all', showing: 'Showing {n}',
      syncNote: 'Sign in to sync with the Byeolji PC and Android apps.', getApp: 'Get the app', signIn: 'Sign in', signOut: 'Sign out',
      collected: 'Found', uncollected: 'Not found' },
    ja: { search: '名前で検索', allRegions: 'すべての地域', hideDone: '取得済みを隠す', hideAll: 'すべてオフ', showing: '{n}件 表示中',
      syncNote: 'ログインすると Byeolji の PC・Android アプリと記録が同期されます。', getApp: 'アプリ', signIn: 'ログイン', signOut: 'ログアウト',
      collected: '取得', uncollected: '未取得' },
    zh: { search: '按名称查找', allRegions: '所有地区', hideDone: '隐藏已获取', hideAll: '全部关闭', showing: '显示 {n} 项',
      syncNote: '登录后可与 Byeolji PC、安卓应用同步记录。', getApp: '下载应用', signIn: '登录', signOut: '退出',
      collected: '已获取', uncollected: '未获取' },
  };
  const LANGS = ['ko', 'en', 'ja', 'zh', 'ru', 'id', 'es'];
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
  const t = (k) => (STR[lang] || STR.en)[k] ?? STR.en[k];
  const nameOf = (o) => (o.names && o.names[lang]) || o.name;

  const state = {
    cards: new Set(store.get('cards', [])),
    region: store.get('region', null),
    hideDone: store.get('hideDone', false),
    folded: new Set(store.get('folded', [])),
    query: '',
  };
  // 획득 기록 (point id). 로그인하면 account.js 가 서버와 합침
  const progress = new Set(store.get('progress', []));
  const saveProgress = () => store.set('progress', [...progress]);

  let data;      // {layout, cats, points}
  let map, markerLayer;
  let visible = [];       // [{p, card, group}]
  let clusterCache = { key: null, list: [] };

  const $ = (id) => document.getElementById(id);

  async function load() {
    const [layout, cats, points] = await Promise.all(
      ['layout', 'categories', 'points'].map((f) => fetch(`data/${f}.json`).then((r) => r.json())),
    );
    data = { layout, cats, points };
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
    // 밑그림: 확대·이동 중 타일이 늦어도 빈칸 안 보이게
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
    });
  }

  // --- 표시할 지점 ---
  function cardPoints(card) {
    const out = [];
    for (const label of card.label_ids) {
      for (const p of data.points[label] || []) {
        if (card.area_id != null && p[1] !== card.area_id) continue;
        if (state.region != null && p[1] !== state.region) continue;
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
        for (const p of cardPoints(card)) {
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
      const icon = L.divIcon({
        className: '', iconSize: [30, 30], iconAnchor: [15, 15],
        html: `<div class="${cls}" style="background:${first.card.color}"><img src="icons/${first.card.icon}.png" alt="">${n}</div>`,
      });
      const m = L.marker([c.y, c.x], { icon, keyboard: false, title: nameOf(first.card) });
      m.on('click', () => {
        if (single) toggle(first.p[0]);
        else map.setView([c.y, c.x], Math.min(map.getZoom() + 2, 0.5));
      });
      markerLayer.addLayer(m);
    }
  }

  function toggle(id) {
    progress.has(id) ? progress.delete(id) : progress.add(id);
    saveProgress();
    window.ByeoljiAccount?.localChanged([...progress]);
    toast(progress.has(id) ? t('collected') : t('uncollected'));
    if (state.hideDone) updateVisible(); else { drawMarkers(); renderCounts(); }
  }

  let toastTimer;
  function toast(text) {
    const el = $('toast');
    el.textContent = text; el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 1200);
  }

  // --- 패널 ---
  function renderStatic() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    $('lang').value = lang;
    $('search').placeholder = t('search');
    document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    const region = $('region');
    region.innerHTML = `<option value="">${t('allRegions')}</option>` +
      data.cats.regions.map((r) => `<option value="${r.area_id}">${nameOf(r)}</option>`).join('');
    region.value = state.region == null ? '' : String(state.region);
    $('hide-done').checked = state.hideDone;
    window.ByeoljiAccount?.render(lang);
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderSections() {
    const q = state.query.trim().toLowerCase();
    const html = [];
    for (const sec of data.cats.sections) {
      const cards = sec.cards.filter((c) => {
        if (state.region != null && c.count_by_area && !c.count_by_area[state.region]) return false;
        if (!q) return true;
        return nameOf(c).toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      });
      if (!cards.length) continue;
      const on = cards.filter((c) => state.cards.has(c.name)).length;
      const closed = state.folded.has(sec.name) && !q;
      html.push(`<section class="sec${closed ? ' closed' : ''}" data-sec="${esc(sec.name)}">
        <h3>${esc(nameOf(sec))} <small>${on ? on + ' / ' : ''}${cards.length}</small><span class="fold">${closed ? '▸' : '▾'}</span></h3>
        <div class="cards">${cards.map((c) => `<button type="button" class="card${state.cards.has(c.name) ? ' on' : ''}" data-card="${esc(c.name)}">
          <img src="icons/${c.icon}.png" alt="" loading="lazy" style="background:${c.color}"><span class="name">${esc(nameOf(c))}</span><span class="count" data-count="${esc(c.name)}"></span></button>`).join('')}</div>
      </section>`);
    }
    $('sections').innerHTML = html.join('');
    renderCounts();
  }

  // 카드별 획득/전체 (지역 필터 반영)
  function renderCounts() {
    const byName = new Map();
    for (const sec of data.cats.sections) for (const c of sec.cards) byName.set(c.name, c);
    document.querySelectorAll('[data-count]').forEach((el) => {
      const pts = cardPoints(byName.get(el.dataset.count));
      el.textContent = `${pts.filter((p) => progress.has(p[0])).length}/${pts.length}`;
    });
    $('sel-count').textContent = t('showing').replace('{n}', state.cards.size);
  }

  function bindPanel() {
    $('sections').addEventListener('click', (e) => {
      const card = e.target.closest('[data-card]');
      if (card) {
        const name = card.dataset.card;
        state.cards.has(name) ? state.cards.delete(name) : state.cards.add(name);
        store.set('cards', [...state.cards]);
        card.classList.toggle('on');
        updateVisible(); renderCounts();
        return;
      }
      const h = e.target.closest('h3');
      if (h) {
        const sec = h.parentElement.dataset.sec;
        state.folded.has(sec) ? state.folded.delete(sec) : state.folded.add(sec);
        store.set('folded', [...state.folded]);
        renderSections();
      }
    });
    $('search').addEventListener('input', (e) => { state.query = e.target.value; renderSections(); });
    $('region').addEventListener('change', (e) => {
      state.region = e.target.value === '' ? null : Number(e.target.value);
      store.set('region', state.region);
      renderSections(); updateVisible();
    });
    $('hide-done').addEventListener('change', (e) => { state.hideDone = e.target.checked; store.set('hideDone', state.hideDone); updateVisible(); });
    $('clear').addEventListener('click', () => { state.cards.clear(); store.set('cards', []); renderSections(); updateVisible(); });
    $('lang').addEventListener('change', (e) => {
      lang = e.target.value;
      try { localStorage.setItem('lang', lang); } catch {}
      renderStatic(); renderSections(); drawMarkers();
    });
    $('open-panel').addEventListener('click', () => $('panel').classList.add('open'));
    $('close-panel').addEventListener('click', () => $('panel').classList.remove('open'));
  }

  // account.js 가 서버 기록을 합친 뒤 부름
  window.ByeoljiMap = {
    progress: () => [...progress],
    setProgress(ids) {
      progress.clear(); ids.forEach((id) => progress.add(id));
      saveProgress();
      if (data) { updateVisible(); renderCounts(); }
    },
    lang: () => lang,
  };

  load().then(() => {
    initMap(); bindPanel(); renderStatic(); renderSections(); updateVisible();
    // 처음 온 사람: 패널부터 (좁은 화면)
    if (!state.cards.size && innerWidth <= 720) $('panel').classList.add('open');
  });
})();
