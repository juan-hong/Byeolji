// 첫 화면: 실제 지도 위 투명 시트. 시트를 끌면 덮인 쪽에만 마커가 보임 (앱의 마커 켜기/끄기와 같은 느낌)
(() => {
  const plate = document.getElementById('plate');
  const film = document.getElementById('film');
  const edge = document.getElementById('edge');
  const box = document.getElementById('markers');
  const data = window.MOND;
  if (!plate || !data) return;

  for (const [x, y, k] of data.m) {
    const kind = data.kinds[k];
    const el = document.createElement('span');
    el.className = 'mk';
    el.style.left = x + '%';
    el.style.top = y + '%';
    el.style.setProperty('--c', kind.color);
    el.innerHTML = `<img src="icons/${kind.icon}.png" alt="">`;
    box.appendChild(el);
  }

  let cut = 40;
  const set = (v) => {
    cut = Math.max(0, Math.min(100, v));
    plate.style.setProperty('--cut', cut + '%');
    edge.setAttribute('aria-valuenow', Math.round(cut));
  };
  // 처음 들어오는 움직임은 CSS(sheet-in). 손을 대면 그 자리부터 직접 조절
  const touch = () => {
    if (plate.classList.contains('touched')) return;
    const now = parseFloat(getComputedStyle(plate).getPropertyValue('--cut'));
    plate.classList.add('touched');
    if (!Number.isNaN(now)) set(now);
  };

  const toPct = (clientX) => {
    const r = plate.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };
  let dragging = false;
  const start = (e) => {
    dragging = true;
    touch();
    edge.classList.add('dragging');
    edge.setPointerCapture?.(e.pointerId);
    set(toPct(e.clientX));
  };
  edge.addEventListener('pointerdown', start);
  plate.addEventListener('pointerdown', (e) => { if (e.target === plate || e.target.closest('.film')) start(e); });
  window.addEventListener('pointermove', (e) => { if (dragging) set(toPct(e.clientX)); });
  window.addEventListener('pointerup', () => { dragging = false; edge.classList.remove('dragging'); });
  edge.addEventListener('keydown', (e) => {
    const d = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 }[e.key];
    if (d === undefined) return;
    e.preventDefault();
    touch();
    set(cut + d);
  });
})();

// 내려받기 버튼: 최신 릴리스의 설치 파일로 바로 (못 읽으면 릴리스 페이지 그대로)
(() => {
  const dl = document.getElementById('dl');
  const fine = document.getElementById('fine');
  fetch('https://api.github.com/repos/juan-hong/Byeolji-releases/releases/latest')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rel) => {
      const asset = (rel.assets || []).find((a) => /\.exe$/i.test(a.name));
      if (!asset) return;
      dl.href = asset.browser_download_url;
      const v = String(rel.tag_name || '').replace(/^v/i, '');
      const mb = Math.round(asset.size / 1048576);
      // 버전·크기 + 그 언어의 안내 문장 (언어를 바꾸면 다시)
      const render = () => { fine.textContent = `${v} · ${mb}MB · ${window.t ? window.t('hero.fine') : ''}`; };
      render();
      document.addEventListener('langchange', render);
    })
    .catch(() => {});
})();
