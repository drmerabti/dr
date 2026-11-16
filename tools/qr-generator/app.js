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
        'اختر تصميمًا من الشريط تحت المعاينة: اسحبه يمينًا أو يسارًا أو اضغط على التصميم، فيظهر فورًا بالحجم الكبير.',
        'اضغط «تحميل الصورة» لحفظ الرمز صورة PNG، ثم ضعه على بطاقة أعمالك أو سيرتك الذاتية أو أي ملصق.',
      ],
      guideFaqTitle: 'أسئلة شائعة',
      guideFaq: [
        ['هل يجب ملء كل الخانات؟', 'لا، يكفي ملء خانة واحدة ليظهر الرمز، وكل خانة تتركها فارغة لا تُضاف إلى بطاقة الاتصال.'],
        ['هل تُرسل بياناتي إلى أي خادم؟', 'لا، يُنشأ الرمز داخل متصفحك مباشرة، ولا تُحفظ بياناتك ولا تُرسل إلى أي مكان.'],
        ['كيف أمسح الرمز بالهاتف؟', 'افتح كاميرا الهاتف ووجّهها نحو الرمز، أو استعمل تطبيقًا لقراءة QR، ثم اختر «إضافة جهة اتصال» لحفظ البيانات.'],
        ['هل التصاميم الملوّنة مجانية؟', 'نعم، يمكنك تحميل أي تصميم مجانًا، ويظهر اسم الموقع merabti.com ضمن إطاره. لإزالته ادفع 1.99$ عبر PayPal، فتحصل على صورة PNG عالية الدقة وملف SVG بدون اسم الموقع.'],
      ],
      guideVideo: 'شاهد شرح الأداة بالفيديو',
      designsLabel: 'التصاميم', free: 'مجاني', premium: 'Premium',
      noticeFree: 'تصميم مجاني بدون أي علامة',
      noticeRemove: 'لإزالة اسم الموقع ادفع 1.99$',
      noticeOff: 'التحميل المجاني يتضمن اسم الموقع ضمن الإطار',
      noticePaid: 'تم الدفع: الملف نظيف بدون اسم الموقع',
      downloadClean: 'تحميل PNG + SVG', downloadShort: 'تحميل مجاني', payAria: 'ادفع 1.99$ عبر PayPal لإزالة اسم الموقع',
      payTitle: 'إزالة اسم الموقع', payOnce: 'دفعة واحدة لهذا التصميم',
      payB1: 'صورة PNG عالية الدقة (2400 بكسل)', payB2: 'ملف SVG متجه للطباعة بأي حجم', payB3: 'التصميم كاملًا بدون اسم الموقع',
      paySecure: 'الدفع عبر PayPal ويتم التحقق منه على خادمنا', payClose: 'إغلاق',
      payDemo: 'وضع تجريبي (رابط المعاينة): لا يُدفع أي مبلغ.', payDemoBtn: 'محاكاة الدفع',
      paySandbox: 'وضع الاختبار (Sandbox): استعمل حساب PayPal تجريبيًا.',
      payOff: 'الدفع غير متاح حاليًا.', payErr: 'تعذّر الاتصال بـ PayPal، حاول مرة أخرى.',
      paying: 'جارٍ التحقق من الدفع…', payDone: 'تم الدفع بنجاح', payDoneT: 'أُزيل اسم الموقع، وبدأ تحميل الملفين. يمكنك تحميلهما مجددًا من هنا:',
      payOrder: 'رقم الطلب', payUnlockNote: 'يبقى هذا التصميم مفتوحًا 24 ساعة على هذا الجهاز إن أردت تعديل بياناتك.',
      payResumed: 'تم تأكيد دفعتك السابقة: التصميم بدون اسم الموقع.',
      downloading: 'جارٍ التحضير…',
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
        'Pick a design from the strip under the preview: swipe it or tap a design, and it shows up large at once.',
        'Click “Download Image” to save the code as a PNG, then put it on your business card, CV or any poster.',
      ],
      guideFaqTitle: 'Frequently asked questions',
      guideFaq: [
        ['Do I have to fill in every field?', 'No. One field is enough for the code to appear, and any field you leave empty is simply left out of the contact card.'],
        ['Is my data sent to a server?', 'No. The code is created right in your browser; your details are not stored or sent anywhere.'],
        ['How do I scan the code with my phone?', 'Point your phone camera at the code, or use a QR reader app, then choose “Add contact” to save the details.'],
        ['Are the coloured designs free?', 'Yes. Every design can be downloaded for free, with the site name merabti.com in its frame. To remove it, pay $1.99 with PayPal and get a high-resolution PNG and an SVG file without the site name.'],
      ],
      guideVideo: 'Watch the video tutorial',
      designsLabel: 'Designs', free: 'Free', premium: 'Premium',
      noticeFree: 'Free design, no branding',
      noticeRemove: 'Remove the site name for $1.99',
      noticeOff: 'The free download includes the site name in the frame',
      noticePaid: 'Paid: clean file without the site name',
      downloadClean: 'Download PNG + SVG', downloadShort: 'Free download', payAria: 'Pay $1.99 with PayPal to remove the site name',
      payTitle: 'Remove the site name', payOnce: 'One payment for this design',
      payB1: 'High-resolution PNG (2400 px)', payB2: 'Vector SVG, prints at any size', payB3: 'The full design, without the site name',
      paySecure: 'Paid with PayPal, verified on our server', payClose: 'Close',
      payDemo: 'Demo mode (preview link): nothing is paid.', payDemoBtn: 'Simulate the payment',
      paySandbox: 'Test mode (Sandbox): use a PayPal test account.',
      payOff: 'Payment is not available right now.', payErr: 'Could not reach PayPal, please try again.',
      paying: 'Verifying the payment…', payDone: 'Payment complete', payDoneT: 'The site name is removed and both files are downloading. You can download them again here:',
      payOrder: 'Order ID', payUnlockNote: 'This design stays unlocked for 24 hours on this device if you need to edit your details.',
      payResumed: 'Your earlier payment is confirmed: the design is now without the site name.',
      downloading: 'Preparing…',
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
        "Choisissez un design dans la bande sous l'aperçu : faites-la glisser ou touchez un design, il s'affiche aussitôt en grand.",
        "Cliquez sur « Télécharger l'image » pour enregistrer le code en PNG, puis placez-le sur votre carte de visite, votre CV ou une affiche.",
      ],
      guideFaqTitle: 'Questions fréquentes',
      guideFaq: [
        ['Dois-je remplir tous les champs ?', "Non. Un seul champ suffit pour faire apparaître le code, et tout champ laissé vide n'est pas ajouté à la carte de contact."],
        ['Mes données sont-elles envoyées à un serveur ?', "Non. Le code est créé directement dans votre navigateur ; vos informations ne sont ni enregistrées ni envoyées nulle part."],
        ['Comment scanner le code avec mon téléphone ?', "Pointez l'appareil photo de votre téléphone vers le code, ou utilisez une application de lecture QR, puis choisissez « Ajouter un contact »."],
        ['Les designs en couleur sont-ils gratuits ?', 'Oui. Chaque design se télécharge gratuitement, avec le nom du site merabti.com dans son cadre. Pour le retirer, payez 1,99 $ avec PayPal et recevez un PNG haute résolution et un fichier SVG sans le nom du site.'],
      ],
      guideVideo: "Regarder la vidéo explicative",
      designsLabel: 'Designs', free: 'Gratuit', premium: 'Premium',
      noticeFree: 'Design gratuit, sans marque',
      noticeRemove: 'Retirez le nom du site pour 1,99 $',
      noticeOff: 'Le téléchargement gratuit inclut le nom du site dans le cadre',
      noticePaid: 'Payé : fichier propre, sans le nom du site',
      downloadClean: 'Télécharger PNG + SVG', downloadShort: 'Télécharger', payAria: 'Payer 1,99 $ avec PayPal pour retirer le nom du site',
      payTitle: 'Retirer le nom du site', payOnce: 'Un seul paiement pour ce design',
      payB1: 'PNG haute résolution (2400 px)', payB2: 'SVG vectoriel, imprimable à toute taille', payB3: 'Le design complet, sans le nom du site',
      paySecure: 'Paiement PayPal, vérifié sur notre serveur', payClose: 'Fermer',
      payDemo: "Mode démo (lien d'aperçu) : aucun paiement.", payDemoBtn: 'Simuler le paiement',
      paySandbox: 'Mode test (Sandbox) : utilisez un compte PayPal de test.',
      payOff: "Le paiement n'est pas disponible pour le moment.", payErr: 'Impossible de joindre PayPal, réessayez.',
      paying: 'Vérification du paiement…', payDone: 'Paiement réussi', payDoneT: 'Le nom du site est retiré et les deux fichiers se téléchargent. Vous pouvez les retélécharger ici :',
      payOrder: 'N° de commande', payUnlockNote: 'Ce design reste débloqué 24 heures sur cet appareil si vous devez modifier vos informations.',
      payResumed: 'Votre paiement précédent est confirmé : le design est sans le nom du site.',
      downloading: 'Préparation…',
    },
  };

  let lang = localStorage.getItem('qrgen:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    qName: $('qName'), qPhone: $('qPhone'), qJob: $('qJob'), qEmail: $('qEmail'), qNote: $('qNote'),
    qrCanvasWrap: $('qrCanvasWrap'), downloadBtn: $('downloadBtn'), downloadBtnText: $('downloadBtnText'), payBtn: $('payBtn'),
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


  /* ================= QR content (vCard) ================= */
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

  // shown (faded, with the hint on top) while the fields are empty, so the designs can be browsed
  const SAMPLE_VCARD = 'BEGIN:VCARD\nVERSION:3.0\nFN:merabti.com\nEND:VCARD';

  /* ================= Designs: strip + big preview =================
     Every item of the strip is a real QR of the user's data (designs.js). The centred item is the
     selected design; it is shown large in the preview right away (same image, nothing redrawn). */
  const D = window.QRDesigns;
  const DESIGNS = D.list;
  const DESIGN_KEY = 'qrgen:design';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };
  let current = Math.max(0, DESIGNS.findIndex((d) => d.id === store.get(DESIGN_KEY)));
  const unlocked = new Set();          // designs paid in this session (checked by the server)
  const rendered = {};                 // id → { key, svg, w, h, url }
  let renderToken = 0;

  const isPremium = (i) => DESIGNS[i].premium;
  const branded = (i) => isPremium(i) && !unlocked.has(DESIGNS[i].id);
  const dataNow = () => (hasAnyData() ? buildVCard() : SAMPLE_VCARD);
  const keyFor = (i, data) => [data, lang, branded(i) ? 'b' : 'c'].join('\u0001');

  const track = $('qdTrack');
  const strip = $('qdStrip');
  const items = DESIGNS.map((d, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'qd-item';
    b.setAttribute('role', 'option');
    b.dataset.i = i;
    b.innerHTML = `<span class="qd-card" style="aspect-ratio:${d.w} / ${d.h}"><img alt="" draggable="false">` +
      (d.premium ? '<span class="qd-crown" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor"/></svg></span>' : '') + '</span>';
    track.appendChild(b);
    return b;
  });

  async function renderOne(i, data, token) {
    const d = DESIGNS[i];
    const key = keyFor(i, data);
    if (rendered[d.id] && rendered[d.id].key === key) return rendered[d.id];
    const r = await D.render(d.id, data, { branded: branded(i), lang });
    if (token !== renderToken) return null;
    const old = rendered[d.id];
    const url = URL.createObjectURL(new Blob([r.svg], { type: 'image/svg+xml' }));
    rendered[d.id] = { key, svg: r.svg, w: r.w, h: r.h, url };
    items[i].querySelector('img').src = url;
    if (old && old.url) setTimeout(() => URL.revokeObjectURL(old.url), 1000);
    return rendered[d.id];
  }

  function showPreview() {
    const d = DESIGNS[current];
    const r = rendered[d.id];
    const empty = !hasAnyData();
    let img = els.qrCanvasWrap.querySelector('img.qr-preview-img');
    if (!img) {
      els.qrCanvasWrap.innerHTML = '<img class="qr-preview-img" alt=""><p class="qr-empty-hint"></p>';
      img = els.qrCanvasWrap.querySelector('img');
    }
    if (r) { img.src = r.url; img.style.aspectRatio = `${r.w} / ${r.h}`; }
    img.alt = d.name[lang] + ' — QR';
    els.qrCanvasWrap.classList.toggle('is-empty', empty);
    els.qrCanvasWrap.querySelector('.qr-empty-hint').textContent = empty ? t('emptyHint') : '';
    $('qrFrame').classList.toggle('is-classic', !d.premium);
  }

  let renderTimer = null;
  function renderQr() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderAll, 90);
    updateUi();
  }
  async function renderAll() {
    const token = ++renderToken;
    const data = dataNow();
    try {
      await renderOne(current, data, token);       // the selected design first: the big preview
      if (token !== renderToken) return;
      showPreview();
      // then the strip, nearest designs first, one per frame so typing stays smooth
      const order = DESIGNS.map((_, i) => i).filter((i) => i !== current).sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
      for (const i of order) {
        await new Promise((ok) => requestAnimationFrame(ok));
        if (token !== renderToken) return;
        await renderOne(i, data, token);
        if (i === current) showPreview();
      }
    } catch (e) { console.warn('[qr] render', e); }
  }

  /* ---------- strip: coverflow, swipe (touch + mouse), snap, tap to centre ---------- */
  function itemCenter(i) { const it = items[i]; return it.offsetLeft + it.offsetWidth / 2; }
  function nearest() {
    const c = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    items.forEach((it, i) => { const dd = Math.abs(itemCenter(i) - c); if (dd < dist) { dist = dd; best = i; } });
    return best;
  }
  function paintCoverflow() {
    const c = track.scrollLeft + track.clientWidth / 2;
    const step = items[1] ? itemCenter(1) - itemCenter(0) : 80;
    items.forEach((it, i) => {
      const off = (itemCenter(i) - c) / step;          // signed distance in items
      const a = Math.abs(off);
      const scale = a <= 1 ? 1 - 0.2 * a : Math.max(0.6, 0.8 - 0.1 * (a - 1));
      const op = a <= 1 ? 1 : Math.max(0.35, 1 - 0.35 * (a - 1));
      const shift = -Math.sign(off) * Math.min(a, 3) * step * 0.12;   // neighbours tuck in towards the centre
      const card = it.firstElementChild;
      card.style.transform = `translateX(${shift.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      it.style.opacity = op.toFixed(2);
      it.style.zIndex = String(100 - Math.round(a * 10));
      it.classList.toggle('is-center', a < 0.5);
    });
  }
  function select(i, fromScroll) {
    if (i === current && fromScroll) return;
    current = i;
    store.set(DESIGN_KEY, DESIGNS[i].id);
    items.forEach((it, k) => it.setAttribute('aria-selected', k === i ? 'true' : 'false'));
    if (rendered[DESIGNS[i].id] && rendered[DESIGNS[i].id].key === keyFor(i, dataNow())) showPreview();
    else renderQr();
    updateUi();
    clearTimeout(select.ga);
    select.ga = setTimeout(() => { try { if (window.gtag) gtag('event', 'select_content', { content_type: 'qr_design', item_id: DESIGNS[current].id }); } catch (e) { /* ignore */ } }, 1500);
  }
  function centreOn(i, smooth) {
    const left = itemCenter(i) - track.clientWidth / 2;
    track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  }

  let rafPending = false;
  track.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      paintCoverflow();
      const n = nearest();
      if (n !== current) select(n, true);
    });
  }, { passive: true });

  // mouse: drag to scroll, release snaps; a click without a drag centres the item
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      track.classList.add('dragging');
      try { track.setPointerCapture(drag.id); } catch (err) { /* ignore */ }
    }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  function endDrag() {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    track.classList.remove('dragging');          // snapping back on: settle on the nearest design
    centreOn(nearest(), true);
    endDrag.justDragged = true;
    setTimeout(() => { endDrag.justDragged = false; }, 50);
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  track.addEventListener('click', (e) => {
    if (endDrag.justDragged) return;
    const it = e.target.closest('.qd-item');
    if (!it) return;
    const i = +it.dataset.i;
    centreOn(i, true);
    select(i);
  });
  strip.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = Math.min(DESIGNS.length - 1, Math.max(0, current + (e.key === 'ArrowRight' ? 1 : -1)));
    centreOn(i, true);
    select(i);
    items[i].focus({ preventScroll: true });
  });
  window.addEventListener('resize', () => { centreOn(current, false); paintCoverflow(); });

  /* ---------- notice line + buttons ---------- */
  function updateUi() {
    const d = DESIGNS[current];
    const prem = d.premium, paid = unlocked.has(d.id), on = salesOn();
    $('qdName').innerHTML = `<b></b><span class="qd-tag ${prem ? 'is-premium' : 'is-free'}"></span>`;
    $('qdName').firstChild.textContent = d.name[lang];
    $('qdName').lastChild.textContent = prem ? (paid ? '✓ ' + t('premium') : t('premium')) : t('free');
    const notice = $('qdNotice');
    notice.textContent = !prem ? t('noticeFree') : paid ? t('noticePaid') : on ? t('noticeRemove') : t('noticeOff');
    notice.classList.toggle('is-paid', prem && paid);
    notice.classList.toggle('is-offer', prem && !paid && on);
    const showPay = prem && !paid && on;
    // next to the PayPal button the label is short, so that both buttons stay on one row
    els.downloadBtnText.textContent = prem && paid ? t('downloadClean') : showPay ? t('downloadShort') : t('download');
    els.payBtn.hidden = false;
    els.payBtn.classList.toggle('is-off', !showPay);
    els.payBtn.disabled = !showPay;
    els.payBtn.setAttribute('aria-hidden', showPay ? 'false' : 'true');
    els.payBtn.tabIndex = showPay ? 0 : -1;
    els.payBtn.setAttribute('aria-label', t('payAria'));
    strip.setAttribute('aria-label', t('designsLabel'));
    items.forEach((it, i) => { it.setAttribute('aria-label', DESIGNS[i].name[lang] + ' — ' + (DESIGNS[i].premium ? t('premium') : t('free'))); });
  }

  /* ---------- downloads ---------- */
  function saveBlob(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  async function fileFor(i, clean) {
    const d = DESIGNS[i];
    return D.render(d.id, buildVCard(), { branded: d.premium && !clean, lang });
  }
  async function downloadFree() {
    const d = DESIGNS[current];
    const r = await fileFor(current, false);
    saveBlob(await D.toPngBlob(r.svg, r.w, r.h, 2), d.premium ? `qr-${d.id}.png` : 'qr-code.png');
    trackEvent('qr_download', { design: d.id, clean: false });
  }
  async function downloadClean(i, which) {
    const d = DESIGNS[i];
    const r = await fileFor(i, true);
    if (!which || which === 'png') saveBlob(await D.toPngBlob(r.svg, r.w, r.h, 4), `qr-${d.id}-hd.png`);
    if (!which || which === 'svg') {
      if (!which) await new Promise((ok) => setTimeout(ok, 700));   // two files: let the browser take the first one
      saveBlob(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + r.svg], { type: 'image/svg+xml' }), `qr-${d.id}-hd.svg`);
    }
    trackEvent('qr_download', { design: d.id, clean: true });
  }
  function trackEvent(name, extra) { try { if (window.gtag) gtag('event', name, Object.assign({ tool: 'qr-generator' }, extra || {})); } catch (e) { /* ignore */ } }

  els.downloadBtn.addEventListener('click', async () => {
    if (!hasAnyData()) { alert(t('alertEmpty')); return; }
    if (els.downloadBtn.disabled) return;
    const label = els.downloadBtnText.textContent;
    els.downloadBtn.disabled = true;
    els.downloadBtnText.textContent = t('downloading');
    try {
      if (isPremium(current) && unlocked.has(DESIGNS[current].id)) await downloadClean(current);
      else await downloadFree();
    } catch (e) { console.warn('[qr] download', e); }
    els.downloadBtn.disabled = false;
    els.downloadBtnText.textContent = label;
  });

  /* ================= Paid download: $1.99 through PayPal =================
     The price and the check of the payment are on the Worker (worker.js, "/api/qr/*"): create-order makes
     the PayPal order there, capture-order captures it and checks status, amount and currency before it
     answers ok. Only then is the site name removed and the clean files made. No secret in this page.
     Modes from GET /api/qr/config: live / sandbox (sales on) · demo (preview links and localhost:
     simulated payment, nothing paid) · off (the free download stays). */
  const PAY_LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const PAY_API = (/\.workers\.dev$/.test(location.hostname) || PAY_LOCAL) ? '' : 'https://dr.merabti.workers.dev';
  const PAY_DEMO_HOST = PAY_LOCAL || /\.vercel\.app$/.test(location.hostname) || location.hostname === 'claude-test-dr.merabti.workers.dev';
  const PAY_KEY = 'qrgen:orders';      // { design: { id, at } } — order IDs only, checked again by the server
  const PAY = { mode: 'loading', cfg: null, sdk: null, busy: false, design: null };
  const salesOn = () => PAY.mode === 'live' || PAY.mode === 'sandbox' || PAY.mode === 'demo';
  const price = () => '$' + ((PAY.cfg && PAY.cfg.price) || '1.99');

  async function payFetch(path, body) {
    const r = await fetch(PAY_API + path, {
      method: body ? 'POST' : 'GET', cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    d._status = r.status;
    return d;
  }
  function savedOrders() { try { return JSON.parse(store.get(PAY_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveOrder(design, id, pending) {
    const all = savedOrders();
    if (id) all[design] = { id, at: Date.now(), pending: !!pending }; else delete all[design];
    store.set(PAY_KEY, Object.keys(all).length ? JSON.stringify(all) : null);
  }
  async function capture(orderId) {
    let d = {};
    for (let i = 0; i < 3; i++) {
      d = await payFetch('/api/qr/capture-order', { orderId }).catch(() => ({}));
      if (d._status && d._status < 500) break;        // answered (ok or a final refusal): no retry
      await new Promise((ok) => setTimeout(ok, 1200 * (i + 1)));
    }
    return d;
  }
  function unlock(id) {
    unlocked.add(id);
    const i = DESIGNS.findIndex((d) => d.id === id);
    if (i >= 0) { delete rendered[id]; renderQr(); }
    updateUi();
  }

  async function loadPayConfig() {
    try {
      const d = await payFetch('/api/qr/config');
      if (d && d.price) PAY.cfg = d;
      PAY.mode = d && (d.sales === 'live' || d.sales === 'sandbox') ? d.sales : (PAY_DEMO_HOST ? 'demo' : 'off');
    } catch (e) { PAY.mode = PAY_DEMO_HOST ? 'demo' : 'off'; }
    updateUi();
    // orders paid on this device in the last 24 h (closed tab, lost connection, page reloaded): asked again
    if (PAY.mode === 'live' || PAY.mode === 'sandbox') {
      const all = savedOrders();
      for (const [design, o] of Object.entries(all)) {
        if (!o || !o.id || Date.now() - o.at > 24 * 3600 * 1000) { saveOrder(design, null); continue; }
        const d = await capture(o.id);
        if (d.ok && d.design) { unlock(d.design); if (o.pending) { saveOrder(design, o.id); toast(t('payResumed')); } }
        else if (d._status && d._status < 500 && d.error !== 'NOT_COMPLETED') saveOrder(design, null);
      }
    }
  }

  function toast(text) {
    let el = $('qdToast');
    if (!el) { el = document.createElement('div'); el.id = 'qdToast'; el.className = 'qd-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 4200);
  }

  /* ---------- payment sheet ---------- */
  const modal = $('payModal');
  const sheet = $('paySheet');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function openPay() {
    if (!hasAnyData()) { alert(t('alertEmpty')); return; }
    if (!isPremium(current) || !salesOn()) return;
    PAY.design = DESIGNS[current].id;
    modal.hidden = false;
    document.body.classList.add('qd-lock');
    renderSheet();
    trackEvent('view_item', { design: PAY.design, value: 1.99, currency: 'USD' });
  }
  function closePay() {
    if (PAY.busy) return;
    modal.hidden = true;
    document.body.classList.remove('qd-lock');
    sheet.innerHTML = '';
    els.payBtn.focus({ preventScroll: true });
  }
  function payMsg(text, err) { const el = $('payMsg'); if (el) { el.textContent = text || ''; el.classList.toggle('err', !!err); } }
  function payBusy(on) { PAY.busy = on; sheet.classList.toggle('busy', on); }

  async function renderSheet() {
    const i = DESIGNS.findIndex((d) => d.id === PAY.design);
    const d = DESIGNS[i];
    sheet.innerHTML = `<button type="button" class="qd-x" data-pay="close" aria-label="${esc(t('payClose'))}">${X}</button>
      <div class="qd-sheet-main">
        <div class="qd-sheet-thumb"><img alt="" id="payThumb"></div>
        <div class="qd-sheet-info">
          <span class="qd-tag is-premium">${esc(t('premium'))}</span>
          <h3>${esc(t('payTitle'))}</h3>
          <p class="qd-sheet-sub">${esc(d.name[lang])}</p>
          <div class="qd-price"><b dir="ltr">${esc(price())}</b><span>${esc(t('payOnce'))}</span></div>
        </div>
      </div>
      <ul class="qd-list"><li>${CHECK}<span>${esc(t('payB1'))}</span></li><li>${CHECK}<span>${esc(t('payB2'))}</span></li><li>${CHECK}<span>${esc(t('payB3'))}</span></li></ul>
      <div class="qd-pay-area" id="payArea"></div>
      <p class="qd-msg" id="payMsg" role="status"></p>
      <p class="qd-secure">${LOCK}<span>${esc(t('paySecure'))}</span></p>`;
    // what they get: the clean design with their data
    D.render(d.id, buildVCard(), { branded: false, lang }).then((r) => { const im = $('payThumb'); if (im) im.src = D.svgUrl(r.svg); }).catch(() => {});
    renderPayArea();
  }

  function renderPayArea() {
    const area = $('payArea');
    if (!area) return;
    if (PAY.mode === 'demo') {
      area.innerHTML = `<div class="qd-note">${esc(t('payDemo'))}</div>
        <button type="button" class="qd-pp" data-pay="demo"><img src="../../books/word/img/paypal.svg" alt="PayPal"><small>${esc(t('payDemoBtn'))} · <bdi dir="ltr">${esc(price())}</bdi></small></button>`;
      return;
    }
    if (!(PAY.mode === 'live' || PAY.mode === 'sandbox')) { area.innerHTML = `<div class="qd-note off">${esc(t('payOff'))}</div>`; return; }
    area.innerHTML = (PAY.mode === 'sandbox' ? `<div class="qd-note">${esc(t('paySandbox'))}</div>` : '') + '<div class="qd-ppbox" id="payPP"><div class="qd-spin"></div></div>';
    loadSdk().then(paypalButtons).catch(() => { const h = $('payPP'); if (h) h.innerHTML = `<div class="qd-note off">${esc(t('payErr'))}</div>`; });
  }
  function loadSdk() {
    if (window.paypal && window.paypal.Buttons) return Promise.resolve();
    if (PAY.sdk) return PAY.sdk;
    PAY.sdk = new Promise((ok, no) => {
      const sc = document.createElement('script');
      sc.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(PAY.cfg.clientId) + '&currency=USD&intent=capture&components=buttons';
      sc.onload = () => (window.paypal && window.paypal.Buttons ? ok() : no());
      sc.onerror = () => { PAY.sdk = null; sc.remove(); no(); };
      document.head.appendChild(sc);
    });
    return PAY.sdk;
  }
  function paypalButtons() {
    const host = $('payPP');
    if (!host) return;
    host.innerHTML = '';
    const design = PAY.design;
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 44 },
      createOrder: async () => {
        payMsg('');
        const d = await payFetch('/api/qr/create-order', { design });
        if (!d.id) { payMsg(d.message || t('payErr'), true); throw new Error(d.error || 'create'); }
        trackEvent('begin_checkout', { design, value: 1.99, currency: 'USD' });
        return d.id;
      },
      onApprove: async (data, actions) => {
        payBusy(true); payMsg(t('paying'));
        saveOrder(design, data.orderID, true);       // paid but not confirmed yet: asked again on the next visit
        const d = await capture(data.orderID);
        payBusy(false);
        if (d.error === 'INSTRUMENT_DECLINED') { saveOrder(design, null); payMsg(d.message, true); return actions.restart(); }
        if (!d.ok) { payMsg(d.message || t('payErr'), true); return; }
        saveOrder(design, data.orderID);             // confirmed: kept 24 h so a reload keeps the design unlocked (re-checked)
        trackEvent('purchase', { transaction_id: d.orderId, design, value: 1.99, currency: 'USD' });
        paid(d.design || design, d.orderId);
      },
      onCancel: () => payMsg(''),
      onError: () => payMsg(t('payErr'), true),
    }).render(host).catch(() => { host.innerHTML = `<div class="qd-note off">${esc(t('payErr'))}</div>`; });
  }
  async function demoPay() {
    if (PAY.busy) return;
    payBusy(true); payMsg(t('paying'));
    await new Promise((ok) => setTimeout(ok, 900));
    payBusy(false);
    paid(PAY.design, 'DEMO-' + Date.now().toString(36).toUpperCase());
  }
  function paid(design, orderId) {
    unlock(design);
    sheet.innerHTML = `<button type="button" class="qd-x" data-pay="close" aria-label="${esc(t('payClose'))}">${X}</button>
      <div class="qd-done"><div class="qd-ok">${CHECK}</div><h3>${esc(t('payDone'))}</h3>
        <p>${esc(t('payDoneT'))}</p>
        <div class="qd-done-btns"><button type="button" class="generate-btn" data-pay="png">PNG</button><button type="button" class="generate-btn alt" data-pay="svg">SVG</button></div>
        ${orderId ? `<p class="qd-order">${esc(t('payOrder'))}: <b dir="ltr">${esc(orderId)}</b></p>` : ''}
        <p class="qd-small">${esc(t('payUnlockNote'))}</p></div>`;
    const i = DESIGNS.findIndex((d) => d.id === design);
    downloadClean(i).catch((e) => console.warn('[qr] download', e));
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) { closePay(); return; }
    const b = e.target.closest('[data-pay]');
    if (!b || b.disabled || PAY.busy) return;
    const a = b.dataset.pay;
    const i = DESIGNS.findIndex((d) => d.id === PAY.design);
    if (a === 'close') closePay();
    else if (a === 'demo') demoPay();
    else if (a === 'png' || a === 'svg') downloadClean(i, a).catch((err) => console.warn('[qr] download', err));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closePay(); });
  els.payBtn.addEventListener('click', openPay);

  [els.qName, els.qPhone, els.qJob, els.qEmail, els.qNote].forEach((el) => el.addEventListener('input', renderQr));

  /* ---------- start ---------- */
  items.forEach((it, k) => it.setAttribute('aria-selected', k === current ? 'true' : 'false'));
  applyLanguage();
  requestAnimationFrame(() => { centreOn(current, false); paintCoverflow(); });
  loadPayConfig();
})();
