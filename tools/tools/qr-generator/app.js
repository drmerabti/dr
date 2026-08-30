// ============================================================
// app.js — QR Code Generator (vCard, no login required)
// ============================================================

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {
    qName: $('qName'), qPhone: $('qPhone'), qJob: $('qJob'), qEmail: $('qEmail'), qNote: $('qNote'),
    qrCanvasWrap: $('qrCanvasWrap'), downloadBtn: $('downloadBtn'),
  };

  let qrInstance = null;

  function buildVCard() {
    const name = els.qName.value.trim();
    const phone = els.qPhone.value.trim();
    const job = els.qJob.value.trim();
    const email = els.qEmail.value.trim();
    const note = els.qNote.value.trim();

    const parts = name.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      name ? `N:${lastName};${firstName}` : '',
      name ? `FN:${name}` : '',
      job ? `TITLE:${job}` : '',
      phone ? `TEL:${phone}` : '',
      email ? `EMAIL:${email}` : '',
      note ? `NOTE:${note}` : '',
      'END:VCARD',
    ].filter(Boolean);
    return lines.join('\n');
  }

  function hasAnyData() {
    return [els.qName, els.qPhone, els.qJob, els.qEmail, els.qNote].some((el) => el.value.trim());
  }

  function renderQr() {
    els.qrCanvasWrap.innerHTML = '';
    if (!hasAnyData()) {
      els.qrCanvasWrap.innerHTML = '<p class="qr-empty-hint">عبّي بياناتك وشوف الرمز يظهر هنا</p>';
      return;
    }
    try {
      qrInstance = new QRCode(els.qrCanvasWrap, {
        text: buildVCard(),
        width: 220,
        height: 220,
        colorDark: '#1E2F40',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
    } catch (e) { /* ignore */ }
  }

  [els.qName, els.qPhone, els.qJob, els.qEmail, els.qNote].forEach((el) => {
    el.addEventListener('input', renderQr);
  });

  els.downloadBtn.addEventListener('click', () => {
    const img = els.qrCanvasWrap.querySelector('img');
    const canvas = els.qrCanvasWrap.querySelector('canvas');
    const src = img ? img.src : (canvas ? canvas.toDataURL('image/png') : null);
    if (!src) { alert('عبّي بياناتك أول لإنشاء الرمز.'); return; }

    // Draw onto a padded rounded canvas for a clean downloadable frame
    const source = new Image();
    source.onload = () => {
      const pad = 30, size = 220, radius = 24, total = size + pad * 2;
      const out = document.createElement('canvas');
      out.width = total; out.height = total;
      const ctx = out.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.arcTo(total, 0, total, total, radius);
      ctx.arcTo(total, total, 0, total, radius);
      ctx.arcTo(0, total, 0, 0, radius);
      ctx.arcTo(0, 0, total, 0, radius);
      ctx.closePath();
      ctx.fill();
      ctx.drawImage(source, pad, pad, size, size);
      const a = document.createElement('a');
      a.download = 'qr-code.png';
      a.href = out.toDataURL('image/png');
      a.click();
    };
    source.src = src;
  });

  renderQr();
})();
