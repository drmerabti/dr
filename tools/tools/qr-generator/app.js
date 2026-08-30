// ============================================================
// app.js — QR Code Generator (ar / en / fr, no login required)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'مولّد QR Code — أكاديمية مرابطي',
      pageTitle: 'مولّد QR Code',
      pageSubtitle: 'أدخل بياناتك، وشاهد رمز QR يتحدّث فورًا — يمكن مسحه وحفظه كجهة اتصال كاملة',
      namePh: 'الاسم واللقب', phonePh: 'رقم الهاتف', jobPh: 'المهنة', emailPh: 'البريد الإلكتروني', notePh: 'ملاحظة حرة (اختياري)',
      download: 'تحميل الصورة', emptyHint: 'أدخل بياناتك ليظهر الرمز هنا',
      alertEmpty: 'الرجاء إدخال بياناتك أولًا لإنشاء الرمز.',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'QR Code Generator — Merabti Academy',
      pageTitle: 'QR Code Generator',
      pageSubtitle: 'Enter your details and watch the QR code update instantly — it can be scanned and saved as a full contact card',
      namePh: 'Full name', phonePh: 'Phone number', jobPh: 'Job title', emailPh: 'Email', notePh: 'Free note (optional)',
      download: 'Download Image', emptyHint: 'Enter your details for the code to appear here',
      alertEmpty: 'Please enter your details first to generate the code.',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Générateur de QR Code — Académie Merabti',
      pageTitle: 'Générateur de QR Code',
      pageSubtitle: 'Saisissez vos informations et regardez le code QR se mettre à jour instantanément — il peut être scanné et enregistré comme contact complet',
      namePh: 'Nom complet', phonePh: 'Numéro de téléphone', jobPh: 'Profession', emailPh: 'E-mail', notePh: 'Note libre (optionnel)',
      download: "Télécharger l'image", emptyHint: 'Saisissez vos informations pour voir le code apparaître ici',
      alertEmpty: "Veuillez d'abord saisir vos informations pour générer le code.",
    },
  };

  let lang = localStorage.getItem('qrgen:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    qName: $('qName'), qPhone: $('qPhone'), qJob: $('qJob'), qEmail: $('qEmail'), qNote: $('qNote'),
    qrCanvasWrap: $('qrCanvasWrap'), downloadBtn: $('downloadBtn'), downloadBtnText: $('downloadBtnText'),
  };

  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.pageTitle.textContent = dict.pageTitle;
    els.pageSubtitle.textContent = dict.pageSubtitle;
    els.qName.placeholder = dict.namePh;
    els.qPhone.placeholder = dict.phonePh;
    els.qJob.placeholder = dict.jobPh;
    els.qEmail.placeholder = dict.emailPh;
    els.qNote.placeholder = dict.notePh;
    els.downloadBtnText.textContent = dict.download;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('qrgen:lang', lang);
    renderQr();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  /* ================= QR logic ================= */
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
      els.qrCanvasWrap.innerHTML = `<p class="qr-empty-hint">${t('emptyHint')}</p>`;
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
    if (!src) { alert(t('alertEmpty')); return; }

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

  applyLanguage();
})();
