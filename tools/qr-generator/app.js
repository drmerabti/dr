// ============================================================
// app.js — QR Code Generator (ar / en / fr, no login required)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'مولد QR Code أونلاين لبطاقة الاتصال — أكاديمية مرابطي',
      pageTitle: 'مولّد QR Code',
      pageSubtitle: 'أدخل بياناتك، وشاهد رمز QR يتحدّث فورًا — يمكن مسحه وحفظه كجهة اتصال كاملة',
      namePh: 'الاسم واللقب', phonePh: 'رقم الهاتف', jobPh: 'المهنة', emailPh: 'البريد الإلكتروني', notePh: 'ملاحظة حرة (اختياري)',
      download: 'تحميل الصورة', emptyHint: 'أدخل بياناتك ليظهر الرمز هنا',
      alertEmpty: 'الرجاء إدخال بياناتك أولًا لإنشاء الرمز.',
      guideWhatTitle: 'ما هي الأداة؟',
      guideWhat: 'مولّد QR Code يحوّل بيانات اتصالك (الاسم، الهاتف، المهنة، البريد الإلكتروني) إلى رمز QR بصيغة بطاقة اتصال vCard. عند مسح الرمز بالهاتف يقترح حفظ بياناتك مباشرة كجهة اتصال جديدة.',
      guideHowTitle: 'كيف تستعملها؟',
      guideSteps: [
        'أدخل بياناتك في الخانات: الاسم واللقب، رقم الهاتف، المهنة، البريد الإلكتروني، وملاحظة إن أردت.',
        'شاهد الرمز يتحدّث فورًا في المعاينة مع كل حرف تكتبه، دون الحاجة إلى أي زر.',
        'اضغط «تحميل الصورة» لحفظ الرمز صورة PNG، ثم ضعه على بطاقة أعمالك أو سيرتك الذاتية أو أي ملصق.',
      ],
      guideFaqTitle: 'أسئلة شائعة',
      guideFaq: [
        ['هل يجب ملء كل الخانات؟', 'لا، يكفي ملء خانة واحدة ليظهر الرمز، وكل خانة تتركها فارغة لا تُضاف إلى بطاقة الاتصال.'],
        ['هل تُرسل بياناتي إلى أي خادم؟', 'لا، يُنشأ الرمز داخل متصفحك مباشرة، ولا تُحفظ بياناتك ولا تُرسل إلى أي مكان.'],
        ['كيف أمسح الرمز بالهاتف؟', 'افتح كاميرا الهاتف ووجّهها نحو الرمز، أو استعمل تطبيقًا لقراءة QR، ثم اختر «إضافة جهة اتصال» لحفظ البيانات.'],
      ],
      guideVideo: 'شاهد شرح الأداة بالفيديو',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'QR Code Generator — Merabti Academy',
      pageTitle: 'QR Code Generator',
      pageSubtitle: 'Enter your details and watch the QR code update instantly — it can be scanned and saved as a full contact card',
      namePh: 'Full name', phonePh: 'Phone number', jobPh: 'Job title', emailPh: 'Email', notePh: 'Free note (optional)',
      download: 'Download Image', emptyHint: 'Enter your details for the code to appear here',
      alertEmpty: 'Please enter your details first to generate the code.',
      guideWhatTitle: 'What is this tool?',
      guideWhat: 'The QR Code Generator turns your contact details (name, phone, job title, email) into a QR code in vCard contact format. When the code is scanned, the phone offers to save your details straight away as a new contact.',
      guideHowTitle: 'How to use it',
      guideSteps: [
        'Fill in your details: full name, phone number, job title, email, and a note if you like.',
        'Watch the code update instantly in the preview as you type — no button needed.',
        'Click “Download Image” to save the code as a PNG, then put it on your business card, CV or any poster.',
      ],
      guideFaqTitle: 'Frequently asked questions',
      guideFaq: [
        ['Do I have to fill in every field?', 'No. One field is enough for the code to appear, and any field you leave empty is simply left out of the contact card.'],
        ['Is my data sent to a server?', 'No. The code is created right in your browser; your details are not stored or sent anywhere.'],
        ['How do I scan the code with my phone?', 'Point your phone camera at the code, or use a QR reader app, then choose “Add contact” to save the details.'],
      ],
      guideVideo: 'Watch the video tutorial',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Générateur de QR Code — Académie Merabti',
      pageTitle: 'Générateur de QR Code',
      pageSubtitle: 'Saisissez vos informations et regardez le code QR se mettre à jour instantanément — il peut être scanné et enregistré comme contact complet',
      namePh: 'Nom complet', phonePh: 'Numéro de téléphone', jobPh: 'Profession', emailPh: 'E-mail', notePh: 'Note libre (optionnel)',
      download: "Télécharger l'image", emptyHint: 'Saisissez vos informations pour voir le code apparaître ici',
      alertEmpty: "Veuillez d'abord saisir vos informations pour générer le code.",
      guideWhatTitle: "Qu'est-ce que cet outil ?",
      guideWhat: "Le générateur de QR Code transforme vos coordonnées (nom, téléphone, profession, e-mail) en code QR au format de carte de contact vCard. Une fois le code scanné, le téléphone propose d'enregistrer directement vos informations comme nouveau contact.",
      guideHowTitle: "Comment l'utiliser ?",
      guideSteps: [
        "Saisissez vos informations : nom complet, numéro de téléphone, profession, e-mail, et une note si vous le souhaitez.",
        "Regardez le code se mettre à jour instantanément dans l'aperçu à chaque caractère, sans aucun bouton.",
        "Cliquez sur « Télécharger l'image » pour enregistrer le code en PNG, puis placez-le sur votre carte de visite, votre CV ou une affiche.",
      ],
      guideFaqTitle: 'Questions fréquentes',
      guideFaq: [
        ['Dois-je remplir tous les champs ?', "Non. Un seul champ suffit pour faire apparaître le code, et tout champ laissé vide n'est pas ajouté à la carte de contact."],
        ['Mes données sont-elles envoyées à un serveur ?', "Non. Le code est créé directement dans votre navigateur ; vos informations ne sont ni enregistrées ni envoyées nulle part."],
        ['Comment scanner le code avec mon téléphone ?', "Pointez l'appareil photo de votre téléphone vers le code, ou utilisez une application de lecture QR, puis choisissez « Ajouter un contact »."],
      ],
      guideVideo: "Regarder la vidéo explicative",
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
    applyGuide(dict);
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('qrgen:lang', lang);
    renderQr();
  }
  // قسم الشرح أسفل الأداة: ما هي، كيف تستعملها، أسئلة شائعة، رابط الفيديو
  function applyGuide(dict) {
    $('guideWhatTitle').textContent = dict.guideWhatTitle;
    $('guideWhat').textContent = dict.guideWhat;
    $('guideHowTitle').textContent = dict.guideHowTitle;
    $('guideSteps').replaceChildren(...dict.guideSteps.map((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      return li;
    }));
    $('guideFaqTitle').textContent = dict.guideFaqTitle;
    $('guideFaq').replaceChildren(...dict.guideFaq.map(([q, a]) => {
      const item = document.createElement('details');
      const summary = document.createElement('summary');
      const answer = document.createElement('p');
      summary.textContent = q;
      answer.textContent = a;
      item.append(summary, answer);
      return item;
    }));
    const videoText = $('guideVideoText');
    if (videoText) videoText.textContent = dict.guideVideo;
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
