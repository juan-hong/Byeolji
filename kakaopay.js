// 카카오페이 송금 링크는 PC 브라우저에서 404 남. PC면 QR 띄워서 폰으로 찍게 함
(function () {
  const QR = '/icons/kakaopay-qr.svg';
  const isPhone = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  let dlg = null;

  function open() {
    if (!dlg) {
      dlg = document.createElement('dialog');
      Object.assign(dlg.style, {
        border: 'none', borderRadius: '16px', padding: '20px 22px 16px', textAlign: 'center',
        background: '#fff', color: '#222', maxWidth: '90vw', fontFamily: 'inherit', overflow: 'hidden',
      });
      const img = document.createElement('img');
      img.src = QR; img.alt = '카카오페이 송금 QR';
      Object.assign(img.style, { width: '220px', height: '220px', display: 'block', margin: '0 auto' });
      const p = document.createElement('p');
      p.textContent = '휴대폰 카메라로 QR을 찍으면 카카오페이 송금으로 넘어가요';
      Object.assign(p.style, { margin: '12px 0 10px', fontSize: '.92em' });
      const btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = '닫기';
      Object.assign(btn.style, {
        padding: '6px 22px', borderRadius: '20px', border: '1px solid #bbb', background: '#fff',
        color: '#222', cursor: 'pointer', font: 'inherit',
      });
      btn.addEventListener('click', () => dlg.close());
      // 바깥 누르면 닫음
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
      dlg.append(img, p, btn);
      document.body.appendChild(dlg);
    }
    dlg.showModal();
  }

  // 지도 페이지 링크는 나중에 그려지니까 문서에 한 번만 걸어 둠
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="https://qr.kakaopay.com/"]');
    if (!a || isPhone()) return;
    e.preventDefault();
    open();
  });
})();
