// 사용법: PC / 안드로이드 탭. 주소 #android 로 바로 열 수 있고, 안드로이드 폰이면 처음엔 안드로이드 탭
(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const show = (id, focus) => {
    for (const t of tabs) {
      const on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      const id = t.getAttribute('aria-controls');
      show(id);
      history.replaceState(null, '', '#' + id);
    });
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const next = tabs[(i + d + tabs.length) % tabs.length];
      show(next.getAttribute('aria-controls'), true);
    });
  });
  const hash = location.hash.slice(1);
  if (hash === 'android' || hash === 'pc') show(hash);
  else if (/Android/i.test(navigator.userAgent)) show('android');
})();
