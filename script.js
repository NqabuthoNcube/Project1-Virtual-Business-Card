/* Cyber-only behavior: hover-label wide bar, QR modal, vCard, theme invert, compact toggle */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const layoutToggle = document.getElementById('layoutToggle');
  const qrModal = document.getElementById('qrModal');
  const closeQr = document.getElementById('closeQr');
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadQR = document.getElementById('downloadQR');
  const copyLink = document.getElementById('copyLink');
  const downloadVCard = document.getElementById('downloadVCard');
  const PAGE_URL = window.location.href;
  const NAME = 'Nqabutho Ncube';
  const ROLE = 'BCA Final Year Student • Full-Stack Developer';
  const EMAIL = 'nqabuthoncube15@gmail.com';
  const PHONE = '+918744837663';

  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // small invert toggle to let user slightly change controls (keeps cyber look)
  const savedInvert = localStorage.getItem('vb_invert') === 'true';
  if (savedInvert) document.body.classList.add('inverted');
  themeToggle.addEventListener('click', () => {
    const is = document.body.classList.toggle('inverted');
    localStorage.setItem('vb_invert', is);
    themeToggle.innerHTML = is ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // compact layout toggle
  layoutToggle.addEventListener('click', () => {
    document.getElementById('card').classList.toggle('compact');
  });

  // QR modal generator
  function openQR() {
    qrModal.classList.add('show');
    qrModal.setAttribute('aria-hidden','false');
    qrcodeContainer.innerHTML = '';
    new QRCode(qrcodeContainer, { text: PAGE_URL, width:160, height:160, colorDark:"#0b1220", colorLight:"#ffffff", correctLevel: QRCode.CorrectLevel.H });
  }
  function closeQR() {
    qrModal.classList.remove('show');
    qrModal.setAttribute('aria-hidden','true');
    qrcodeContainer.innerHTML = '';
  }

  // optional: open QR on long-press of the name or when ctrl+clicking avatar
  const nameEl = document.querySelector('.name');
  nameEl.addEventListener('contextmenu', (e) => { e.preventDefault(); openQR(); });

  // close handlers
  closeQr.addEventListener('click', closeQR);
  qrModal.addEventListener('click', (e) => { if (e.target === qrModal) closeQR(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQR(); });

  // download QR
  downloadQR.addEventListener('click', () => {
    const canvas = qrcodeContainer.querySelector('canvas');
    const img = qrcodeContainer.querySelector('img');
    let data = '';
    if (canvas) data = canvas.toDataURL('image/png');
    else if (img) data = img.src;
    else { alert('QR not ready.'); return; }
    const a = document.createElement('a'); a.href = data; a.download = 'virtual-card-qr.png'; document.body.appendChild(a); a.click(); a.remove();
  });

  // copy link
  copyLink.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(PAGE_URL); copyLink.textContent = 'Copied!'; setTimeout(()=> copyLink.innerHTML = '<i class="fas fa-link"></i> Copy Link',1200); }
    catch { prompt('Copy this link', PAGE_URL); }
  });

  // vCard
  downloadVCard.addEventListener('click', () => {
    const lines = [
      'BEGIN:VCARD','VERSION:3.0',`FN:${NAME}`,`TITLE:${ROLE}`,
      `TEL;TYPE=CELL:${PHONE}`,`EMAIL;TYPE=INTERNET:${EMAIL}`,`URL:${PAGE_URL}`,'END:VCARD'
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${NAME.replace(/\s+/g,'_')}.vcf`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  // Make wide-item labels accessible via keyboard: focus shows label (CSS handles it)
  // No extra JS required for hover labels.

  // Optional: use navigator.share on mobile when an item is long-pressed (not implemented here)
});
