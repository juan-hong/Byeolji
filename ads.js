// 구글 애드센스 광고. 값은 tools/set_adsense.py 가 채움 (직접 고쳐도 됨)
// CLIENT 가 비어 있으면 아무것도 안 불러오고 광고 자리(.ad-slot)도 지움.
// 광고 단위 id(SLOTS)가 빈 자리는 그 자리만 지움 -> 승인 전엔 스크립트만 붙어 있어 심사·확인용으로 충분
(() => {
  const CLIENT = '';
  const SLOTS = { home: '', guide: '', download: '', map: '' };

  const boxes = [...document.querySelectorAll('.ad-slot')];
  if (!CLIENT) {
    boxes.forEach((b) => b.remove());
    return;
  }
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
  document.head.appendChild(s);

  for (const box of boxes) {
    const slot = SLOTS[box.dataset.ad];
    if (!slot) {
      box.remove();
      continue;
    }
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.dataset.adClient = CLIENT;
    ins.dataset.adSlot = slot;
    ins.dataset.adFormat = 'auto';
    ins.dataset.fullWidthResponsive = 'true';
    box.appendChild(ins);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
})();
