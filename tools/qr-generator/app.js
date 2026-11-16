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
      download: 'تحميل الصورة',
      alertEmpty: 'الرجاء إدخال بياناتك أولًا لإنشاء الرمز.',
      guideWhatTitle: 'ما هي الأداة؟',
      guideWhat: 'مولّد QR Code يحوّل بيانات اتصالك (الاسم، الهاتف، المهنة، البريد الإلكتروني) إلى رمز QR بصيغة بطاقة اتصال vCard. عند مسح الرمز بالهاتف يقترح حفظ بياناتك مباشرة كجهة اتصال جديدة.',
      guideHowTitle: 'كيف تستعملها؟',
      guideSteps: [
        'أدخل بياناتك في الخانات: الاسم واللقب، رقم الهاتف، المهنة، البريد الإلكتروني، وملاحظة إن أردت.',
        'شاهد الرمز يتحدّث فورًا في المعاينة مع كل حرف تكتبه، دون الحاجة إلى أي زر.',
        'اختر تصميمًا من الشريط تحت المعاينة: اسحبه يمينًا أو يسارًا أو اضغط على التصميم، فيظهر فورًا بالحجم الكبير.',
        'في التصاميم المميزة (Premium) اضغط على وسط الرمز لترفع شعارك أو تكتب حرفًا يظهر في الوسط.',
        'اضغط «تحميل الصورة» لحفظ الرمز صورة PNG، ثم ضعه على بطاقة أعمالك أو سيرتك الذاتية أو أي ملصق.',
      ],
      guideFaqTitle: 'أسئلة شائعة',
      guideFaq: [
        ['هل يجب ملء كل الخانات؟', 'لا، يكفي ملء خانة واحدة ليظهر الرمز، وكل خانة تتركها فارغة لا تُضاف إلى بطاقة الاتصال.'],
        ['هل تُرسل بياناتي إلى أي خادم؟', 'لا، يُنشأ الرمز داخل متصفحك مباشرة، ولا تُحفظ بياناتك ولا تُرسل إلى أي مكان.'],
        ['كيف أمسح الرمز بالهاتف؟', 'افتح كاميرا الهاتف ووجّهها نحو الرمز، أو استعمل تطبيقًا لقراءة QR، ثم اختر «إضافة جهة اتصال» لحفظ البيانات.'],
        ['هل التصاميم الملوّنة مجانية؟', 'التصميم الكلاسيكي مجاني بدون تسجيل. التصاميم المميزة تحتاج تسجيل الدخول، وتحميلها مجاني مع إضافة رابط الموقع merabti.com إلى بيانات الرمز. لإزالته ادفع 1.99$ عبر PayPal: يُحفظ الرمز في حسابك ضمن «أكوادي» وتحمّله بصيغتي PNG وSVG متى شئت، وأي تعديل عليه يصنع رمزًا جديدًا بدفع جديد.'],
      ],
      guideVideo: 'شاهد شرح الأداة بالفيديو',
      designsLabel: 'التصاميم', free: 'مجاني', premium: 'Premium',
      noticeFree: 'تصميم مجاني بدون أي علامة',
      noticeRemove: 'لإزالة اسم الموقع ادفع 1.99$',
      noticeOff: 'التحميل المجاني يضيف رابط الموقع إلى بيانات الرمز',
      noticePaid: 'رمز مدفوع ومحفوظ في حسابك: بدون رابط الموقع',
      downloadClean: 'تحميل PNG + SVG', downloadShort: 'تحميل مجاني', payAria: 'ادفع 1.99$ عبر PayPal لإزالة اسم الموقع',
      payTitle: 'إزالة اسم الموقع', payOnce: 'دفعة واحدة لهذا الرمز',
      payB1: 'صورة PNG عالية الدقة (2400 بكسل)', payB2: 'ملف SVG متجه للطباعة بأي حجم', payB3: 'رمز بدون رابط الموقع: عند المسح تظهر بياناتك فقط',
      paySecure: 'الدفع عبر PayPal ويتم التحقق منه على خادمنا', payClose: 'إغلاق',
      payDemo: 'وضع تجريبي (رابط المعاينة): لا يُدفع أي مبلغ.', payDemoBtn: 'محاكاة الدفع',
      paySandbox: 'وضع الاختبار (Sandbox): استعمل حساب PayPal تجريبيًا.',
      payOff: 'الدفع غير متاح حاليًا.', payErr: 'تعذّر الاتصال بـ PayPal، حاول مرة أخرى.',
      paying: 'جارٍ التحقق من الدفع…', payDone: 'تم الدفع بنجاح', payDoneT: 'حُذف رابط الموقع من رمزك، وبدأ تحميل الملفين. يمكنك تحميلهما مجددًا من هنا:',
      payOrder: 'رقم الطلب',
      payResumed: 'تم تأكيد دفعتك السابقة: التصميم بدون اسم الموقع.',
      downloading: 'جارٍ التحضير…',
      signTitle: 'سجّل الدخول لاستعمال التصاميم المميزة', signText: 'التصميم الكلاسيكي مجاني بدون تسجيل. التصاميم المميزة تحتاج حسابًا، وفيه تُحفظ الرموز التي تدفع ثمنها لتحمّلها متى شئت.',
      signGoogle: 'المتابعة بحساب Google', payStart: 'ادفع 1.99$ واحذف رابط الموقع', signErr: 'تعذّر تسجيل الدخول، حاول مرة أخرى.',
      offerTitle: 'احذف رابط موقعنا من رمزك', offerText: 'التحميل المجاني يضيف رابط merabti.com إلى بيانات الرمز، فيراه كل من يمسحه. ادفع 1.99$ عبر PayPal ليحمل الرمز بياناتك وحدها.',
      offerFree: 'تحميل مجاني مع رابط الموقع', payB4: 'يُحفظ في حسابك: حمّله متى شئت',
      paySavedNote: 'حُفظ هذا الرمز في حسابك ضمن «أكوادي». أي تعديل على البيانات أو التصميم أو الشعار يصنع رمزًا جديدًا يتطلب دفعًا جديدًا.',
      myCodes: 'أكوادي', myCodesTitle: 'أكوادي المدفوعة', myCodesEmpty: 'لا توجد رموز مدفوعة بعد.', myOpen: 'فتح', account: 'الحساب', signOut: 'تسجيل الخروج',
      logoHot: 'شعارك في وسط الرمز', logoTitle: 'شعار في وسط الرمز', logoUpload: 'رفع صورة', logoOr: 'أو اكتب حرفًا', logoLetterPh: 'حرف أو حرفان', logoReset: 'إزالة', logoClose: 'تم',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'QR Code Generator — Merabti Academy',
      pageTitle: 'QR Code Generator',
      pageSubtitle: 'Enter your details and watch the QR code update instantly — it can be scanned and saved as a full contact card',
      namePh: 'Full name', phonePh: 'Phone number', jobPh: 'Job title', emailPh: 'Email', notePh: 'Free note (optional)',
      download: 'Download Image',
      alertEmpty: 'Please enter your details first to generate the code.',
      guideWhatTitle: 'What is this tool?',
      guideWhat: 'The QR Code Generator turns your contact details (name, phone, job title, email) into a QR code in vCard contact format. When the code is scanned, the phone offers to save your details straight away as a new contact.',
      guideHowTitle: 'How to use it',
      guideSteps: [
        'Fill in your details: full name, phone number, job title, email, and a note if you like.',
        'Watch the code update instantly in the preview as you type — no button needed.',
        'Pick a design from the strip under the preview: swipe it or tap a design, and it shows up large at once.',
        'On Premium designs, tap the middle of the code to upload your logo or type a letter to show there.',
        'Click “Download Image” to save the code as a PNG, then put it on your business card, CV or any poster.',
      ],
      guideFaqTitle: 'Frequently asked questions',
      guideFaq: [
        ['Do I have to fill in every field?', 'No. One field is enough for the code to appear, and any field you leave empty is simply left out of the contact card.'],
        ['Is my data sent to a server?', 'No. The code is created right in your browser; your details are not stored or sent anywhere.'],
        ['How do I scan the code with my phone?', 'Point your phone camera at the code, or use a QR reader app, then choose “Add contact” to save the details.'],
        ['Are the coloured designs free?', 'The Classic design is free with no account. Premium designs need a sign-in; they download free with the merabti.com link added to the code. To remove it, pay $1.99 with PayPal: the code is saved in your account under “My codes”, as PNG and SVG, to download any time. Any change to it makes a new code with a new payment.'],
      ],
      guideVideo: 'Watch the video tutorial',
      designsLabel: 'Designs', free: 'Free', premium: 'Premium',
      noticeFree: 'Free design, no branding',
      noticeRemove: 'Remove the site name for $1.99',
      noticeOff: 'The free download adds the site link to the code data',
      noticePaid: 'Paid code, saved in your account: no site link',
      downloadClean: 'Download PNG + SVG', downloadShort: 'Free download', payAria: 'Pay $1.99 with PayPal to remove the site name',
      payTitle: 'Remove the site name', payOnce: 'One payment for this code',
      payB1: 'High-resolution PNG (2400 px)', payB2: 'Vector SVG, prints at any size', payB3: 'No site link in the code: a scan shows only your details',
      paySecure: 'Paid with PayPal, verified on our server', payClose: 'Close',
      payDemo: 'Demo mode (preview link): nothing is paid.', payDemoBtn: 'Simulate the payment',
      paySandbox: 'Test mode (Sandbox): use a PayPal test account.',
      payOff: 'Payment is not available right now.', payErr: 'Could not reach PayPal, please try again.',
      paying: 'Verifying the payment…', payDone: 'Payment complete', payDoneT: 'The site link is removed from your code and both files are downloading. You can download them again here:',
      payOrder: 'Order ID',
      payResumed: 'Your earlier payment is confirmed: the design is now without the site name.',
      downloading: 'Preparing…',
      signTitle: 'Sign in to use the Premium designs', signText: 'The Classic design is free without an account. Premium designs need one: the codes you pay for are saved there, to download any time.',
      signGoogle: 'Continue with Google', payStart: 'Pay $1.99 and remove the site link', signErr: 'Sign-in failed, please try again.',
      offerTitle: 'Remove our site link from your code', offerText: 'The free download adds the merabti.com link to the code, so everyone who scans it sees it. Pay $1.99 with PayPal and the code carries only your details.',
      offerFree: 'Free download with the site link', payB4: 'Saved in your account: download it any time',
      paySavedNote: 'This code is saved in your account under “My codes”. Any change to the details, the design or the logo makes a new code, which needs a new payment.',
      myCodes: 'My codes', myCodesTitle: 'My paid codes', myCodesEmpty: 'No paid codes yet.', myOpen: 'Open', account: 'Account', signOut: 'Sign out',
      logoHot: 'Your logo in the centre', logoTitle: 'Logo in the centre', logoUpload: 'Upload image', logoOr: 'or type a letter', logoLetterPh: '1 or 2 letters', logoReset: 'Remove', logoClose: 'Done',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Générateur de QR Code — Académie Merabti',
      pageTitle: 'Générateur de QR Code',
      pageSubtitle: 'Saisissez vos informations et regardez le code QR se mettre à jour instantanément — il peut être scanné et enregistré comme contact complet',
      namePh: 'Nom complet', phonePh: 'Numéro de téléphone', jobPh: 'Profession', emailPh: 'E-mail', notePh: 'Note libre (optionnel)',
      download: "Télécharger l'image",
      alertEmpty: "Veuillez d'abord saisir vos informations pour générer le code.",
      guideWhatTitle: "Qu'est-ce que cet outil ?",
      guideWhat: "Le générateur de QR Code transforme vos coordonnées (nom, téléphone, profession, e-mail) en code QR au format de carte de contact vCard. Une fois le code scanné, le téléphone propose d'enregistrer directement vos informations comme nouveau contact.",
      guideHowTitle: "Comment l'utiliser ?",
      guideSteps: [
        "Saisissez vos informations : nom complet, numéro de téléphone, profession, e-mail, et une note si vous le souhaitez.",
        "Regardez le code se mettre à jour instantanément dans l'aperçu à chaque caractère, sans aucun bouton.",
        "Choisissez un design dans la bande sous l'aperçu : faites-la glisser ou touchez un design, il s'affiche aussitôt en grand.",
        "Sur les designs Premium, touchez le centre du code pour importer votre logo ou taper une lettre à y afficher.",
        "Cliquez sur « Télécharger l'image » pour enregistrer le code en PNG, puis placez-le sur votre carte de visite, votre CV ou une affiche.",
      ],
      guideFaqTitle: 'Questions fréquentes',
      guideFaq: [
        ['Dois-je remplir tous les champs ?', "Non. Un seul champ suffit pour faire apparaître le code, et tout champ laissé vide n'est pas ajouté à la carte de contact."],
        ['Mes données sont-elles envoyées à un serveur ?', "Non. Le code est créé directement dans votre navigateur ; vos informations ne sont ni enregistrées ni envoyées nulle part."],
        ['Comment scanner le code avec mon téléphone ?', "Pointez l'appareil photo de votre téléphone vers le code, ou utilisez une application de lecture QR, puis choisissez « Ajouter un contact »."],
        ['Les designs en couleur sont-ils gratuits ?', 'Le design Classique est gratuit sans compte. Les designs Premium demandent une connexion ; ils se téléchargent gratuitement avec le lien merabti.com ajouté au code. Pour le retirer, payez 1,99 $ avec PayPal : le code est gardé dans votre compte, dans « Mes codes », en PNG et SVG, à télécharger à tout moment. Toute modification crée un nouveau code, à payer de nouveau.'],
      ],
      guideVideo: "Regarder la vidéo explicative",
      designsLabel: 'Designs', free: 'Gratuit', premium: 'Premium',
      noticeFree: 'Design gratuit, sans marque',
      noticeRemove: 'Retirez le nom du site pour 1,99 $',
      noticeOff: 'Le téléchargement gratuit ajoute le lien du site aux données du code',
      noticePaid: 'Code payé, gardé dans votre compte : sans lien du site',
      downloadClean: 'Télécharger PNG + SVG', downloadShort: 'Télécharger', payAria: 'Payer 1,99 $ avec PayPal pour retirer le nom du site',
      payTitle: 'Retirer le nom du site', payOnce: 'Un seul paiement pour ce code',
      payB1: 'PNG haute résolution (2400 px)', payB2: 'SVG vectoriel, imprimable à toute taille', payB3: 'Sans lien du site dans le code : le scan montre seulement vos infos',
      paySecure: 'Paiement PayPal, vérifié sur notre serveur', payClose: 'Fermer',
      payDemo: "Mode démo (lien d'aperçu) : aucun paiement.", payDemoBtn: 'Simuler le paiement',
      paySandbox: 'Mode test (Sandbox) : utilisez un compte PayPal de test.',
      payOff: "Le paiement n'est pas disponible pour le moment.", payErr: 'Impossible de joindre PayPal, réessayez.',
      paying: 'Vérification du paiement…', payDone: 'Paiement réussi', payDoneT: 'Le lien du site est retiré de votre code et les deux fichiers se téléchargent. Vous pouvez les retélécharger ici :',
      payOrder: 'N° de commande',
      payResumed: 'Votre paiement précédent est confirmé : le design est sans le nom du site.',
      downloading: 'Préparation…',
      signTitle: 'Connectez-vous pour utiliser les designs Premium', signText: 'Le design Classique est gratuit sans compte. Les designs Premium en demandent un : les codes payés y sont gardés, à télécharger à tout moment.',
      signGoogle: 'Continuer avec Google', payStart: 'Payer 1,99 $ et retirer le lien', signErr: 'Connexion impossible, réessayez.',
      offerTitle: 'Retirez le lien de notre site de votre code', offerText: 'Le téléchargement gratuit ajoute le lien merabti.com au code : chaque personne qui le scanne le voit. Payez 1,99 $ avec PayPal et le code ne porte que vos informations.',
      offerFree: 'Téléchargement gratuit avec le lien du site', payB4: 'Gardé dans votre compte : téléchargeable à tout moment',
      paySavedNote: 'Ce code est gardé dans votre compte, dans « Mes codes ». Toute modification des informations, du design ou du logo crée un nouveau code, à payer de nouveau.',
      myCodes: 'Mes codes', myCodesTitle: 'Mes codes payés', myCodesEmpty: 'Aucun code payé pour le moment.', myOpen: 'Ouvrir', account: 'Compte', signOut: 'Se déconnecter',
      logoHot: 'Votre logo au centre', logoTitle: 'Logo au centre', logoUpload: 'Importer une image', logoOr: 'ou tapez une lettre', logoLetterPh: '1 ou 2 lettres', logoReset: 'Retirer', logoClose: 'OK',
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
     Every item of the strip is a real QR of the user's data (designs.js), shown as a small bitmap (light to
     move). The centred item is the selected design; the big preview shows the same design as crisp SVG.
     Classic (free) is always the design selected when the page opens. */
  const D = window.QRDesigns;
  const DESIGNS = D.list;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };
  let current = 0;
  let codes = [];                      // the account's paid codes (from the server: GET /api/qr/codes)
  const ownedByKey = new Map();        // exact code (design + vCard + logo) → paid code
  const rendered = {};                 // id → { key, svg, w, h, hot, url, thumbKey }
  let renderToken = 0;
  let ownLogo = null;                  // Premium centre logo of the visitor: { type: 'text', text } | { type: 'image', src }

  const isPremium = (i) => DESIGNS[i].premium;
  // one paid code = one exact content; the same content again is drawn without the site link
  const logoSig = (l) => (!l ? '' : l.type === 'image' ? 'i' + l.src : 't' + l.text);
  const specKey = (design, data, logo) => [design, data, logoSig(logo)].join('\u0001');
  const ownsCurrent = (i) => !!ownedCode(i);
  const branded = (i) => isPremium(i) && !ownsCurrent(i);
  const dataNow = () => (hasAnyData() ? buildVCard() : SAMPLE_VCARD);
  const logoKey = () => (!ownLogo ? '' : ownLogo.type === 'image' ? 'i' + ownLogo.src.length + ownLogo.src.slice(-24) : 't' + ownLogo.text);
  const keyFor = (i, data) => [data, branded(i) ? 'b' : 'c', isPremium(i) ? logoKey() : ''].join('\u0001');
  const renderOpts = (i, clean) => ({ branded: isPremium(i) && !clean && branded(i), logo: isPremium(i) ? ownLogo : null });

  const track = $('qdTrack');
  const strip = $('qdStrip');
  const items = DESIGNS.map((d, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'qd-item';
    b.setAttribute('role', 'option');
    b.tabIndex = -1;
    b.dataset.i = i;
    b.innerHTML = `<span class="qd-card" style="aspect-ratio:${d.w} / ${d.h}"><img alt="" draggable="false">` +
      (d.premium ? '<span class="qd-crown" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor"/></svg></span>' : '') + '</span>';
    track.appendChild(b);
    return b;
  });

  async function renderOne(i, data, token, withThumb) {
    const d = DESIGNS[i];
    const key = keyFor(i, data);
    let r = rendered[d.id];
    if (!r || r.key !== key) {
      const out = await D.render(d.id, data, renderOpts(i));
      if (token !== renderToken) return null;
      const old = r;
      r = rendered[d.id] = { key, svg: out.svg, w: out.w, h: out.h, hot: out.hot, url: URL.createObjectURL(new Blob([out.svg], { type: 'image/svg+xml' })) };
      if (old && old.url) setTimeout(() => URL.revokeObjectURL(old.url), 1500);
    }
    if (withThumb && r.thumbKey !== key) {
      // small bitmap for the strip: moving 10 bitmaps costs nothing, moving 10 big SVGs is heavy
      const c = await D.toCanvas(r.svg, r.w, r.h, 168 / r.w);
      if (token !== renderToken) return null;
      const blob = await new Promise((ok) => c.toBlob(ok, 'image/png'));
      if (token !== renderToken || !blob) return null;
      const img = items[i].querySelector('img');
      const old = img.dataset.url;
      img.dataset.url = img.src = URL.createObjectURL(blob);
      if (old) setTimeout(() => URL.revokeObjectURL(old), 1500);
      r.thumbKey = key;
    }
    return r;
  }

  /* ---------- big preview + the centre-logo button (Premium) ---------- */
  function showPreview() {
    const d = DESIGNS[current];
    const r = rendered[d.id];
    let stage = els.qrCanvasWrap.querySelector('.qr-stage');
    if (!stage) {
      // .qr-shield: on Premium designs the image itself cannot be saved (right-click / long press): Download only
      els.qrCanvasWrap.innerHTML = '<div class="qr-stage"><img class="qr-preview-img" alt="" draggable="false"><span class="qr-shield" aria-hidden="true"></span>' +
        '<button type="button" class="qd-hot" id="logoHot"><span class="qd-hot-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button></div>';
      stage = els.qrCanvasWrap.querySelector('.qr-stage');
      $('logoHot').addEventListener('click', (e) => { e.stopPropagation(); toggleLogoPop(); });
    }
    const img = stage.querySelector('img');
    if (r) { img.src = r.url; stage.dataset.w = r.w; stage.dataset.h = r.h; fitStage(); }
    img.alt = d.name[lang] + ' — QR';
    $('qrFrame').classList.toggle('is-classic', !d.premium);
    const hot = $('logoHot');
    hot.hidden = !(d.premium && r && r.hot);
    if (!hot.hidden) {
      hot.style.left = (100 * r.hot.x / r.w) + '%';
      hot.style.top = (100 * r.hot.y / r.h) + '%';
      hot.style.width = (100 * r.hot.w / r.w) + '%';
      hot.style.height = (100 * r.hot.h / r.h) + '%';
      hot.setAttribute('aria-label', t('logoHot'));
      hot.title = t('logoHot');
    }
    if (!d.premium) closeLogoPop();
  }
  function fitStage() {
    const stage = els.qrCanvasWrap.querySelector('.qr-stage');
    if (!stage || !stage.dataset.w) return;
    const W = els.qrCanvasWrap.clientWidth * (DESIGNS[current].premium ? 1 : 0.92), H = els.qrCanvasWrap.clientHeight;
    const k = Math.min(W / stage.dataset.w, H / stage.dataset.h);
    stage.style.width = Math.round(stage.dataset.w * k) + 'px';
    stage.style.height = Math.round(stage.dataset.h * k) + 'px';
  }

  let renderTimer = null, stripTimer = null;
  function renderQr() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderAll, 80);
    updateUi();
  }
  async function renderAll() {
    const token = ++renderToken;
    const data = dataNow();
    clearTimeout(stripTimer);
    try {
      await renderOne(current, data, token, true);   // the selected design first: the big preview
      if (token !== renderToken) return;
      showPreview();
    } catch (e) { console.warn('[qr] render', e); return; }
    // the rest of the strip once typing pauses, nearest designs first, one per frame
    stripTimer = setTimeout(async () => {
      const order = DESIGNS.map((_, i) => i).filter((i) => i !== current).sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
      try {
        for (const i of order) {
          await new Promise((ok) => requestAnimationFrame(ok));
          if (token !== renderToken) return;
          await renderOne(i, data, token, true);
        }
      } catch (e) { console.warn('[qr] render', e); }
    }, 260);
  }

  /* ---------- strip: coverflow that follows the finger / mouse, snaps, tap to centre ----------
     No native scrolling: one number (pos, in items) drives the transforms of the 10 cards, so the strip
     follows the pointer 1:1 and only transform / opacity change (cheap for the browser). */
  const N = DESIGNS.length;
  let pos = current, step = 76;
  let target = null;                         // where pos is gliding to (null while the finger / mouse holds it)
  // pointer over the strip (mouse hover, or a finger on the phone): hx = x from the strip centre, hy = 0..1
  const hover = { on: false, x: 0, y: 0.5, amt: 0, sx: 0, sy: 0.5 };
  let loop = 0;
  const clampPos = (p) => Math.max(-0.45, Math.min(N - 1 + 0.45, p));
  function measure() { step = Math.max(58, Math.min(80, strip.clientWidth / 5.4)); }
  function paint() {
    const h = hover.amt;
    for (let i = 0; i < N; i++) {
      const off = i - pos, a = Math.abs(off), sg = Math.sign(off);
      const x = sg * (Math.min(a, 1) * step * 0.95 + Math.max(0, a - 1) * step * 0.72);
      let scale = a <= 1 ? 1 - 0.2 * a : Math.max(0.58, 0.8 - 0.11 * (a - 1));
      let op = a <= 1 ? 1 : Math.max(0, 1 - 0.38 * (a - 1));
      // magnify the card under the pointer / finger (and a little its neighbours), lift it and tilt it towards the pointer
      const d = (hover.sx - x) / step;                                  // pointer → card, in cards
      const boost = h * Math.max(0, 1 - Math.abs(d) / 1.15);
      const lift = boost * boost;
      scale *= 1 + 0.22 * lift;
      if (op > 0) op = Math.min(1, op + 0.5 * boost);
      const ry = Math.max(-1, Math.min(1, d * 1.6)) * 16 * lift;        // turn towards the pointer
      const rx = (0.5 - hover.sy) * 18 * lift;
      const it = items[i];
      it.style.transform = `translate3d(${x.toFixed(1)}px,${(-9 * lift).toFixed(1)}px,0) perspective(420px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      it.style.opacity = op.toFixed(2);
      it.style.zIndex = String(200 - Math.round(a * 10) + Math.round(lift * 50));
      it.style.visibility = op <= 0.01 ? 'hidden' : '';
      it.classList.toggle('is-center', a < 0.5);
      it.classList.toggle('is-hot', lift > 0.35);
    }
    const n = Math.max(0, Math.min(N - 1, Math.round(pos)));
    if (n !== current) select(n);
  }
  // one animation loop for everything that moves (glide to a design, hover in / out, pointer smoothing); stops when still
  function kick() { if (!loop) loop = requestAnimationFrame(frame); }
  function frame() {
    loop = 0;
    let busy = false;
    if (target != null) {
      const d = target - pos;
      if (Math.abs(d) < 0.002) { pos = target; target = null; } else { pos += d * 0.22; busy = true; }
    }
    const ta = hover.on ? 1 : 0;
    if (Math.abs(ta - hover.amt) > 0.004) { hover.amt += (ta - hover.amt) * 0.2; busy = true; } else hover.amt = ta;
    if (Math.abs(hover.x - hover.sx) > 0.3 || Math.abs(hover.y - hover.sy) > 0.003) {
      hover.sx += (hover.x - hover.sx) * 0.35; hover.sy += (hover.y - hover.sy) * 0.35; busy = true;
    }
    paint();
    if (busy) kick();
  }
  function animateTo(t) { target = Math.max(0, Math.min(N - 1, t)); kick(); }
  function select(i) {
    if (i === current) return;
    current = i;
    items.forEach((it, k) => it.setAttribute('aria-selected', k === i ? 'true' : 'false'));
    const r = rendered[DESIGNS[i].id];
    if (r && r.key === keyFor(i, dataNow())) { showPreview(); updateUi(); }
    else renderQr();
    clearTimeout(select.ga);
    select.ga = setTimeout(() => { try { if (window.gtag) gtag('event', 'select_content', { content_type: 'qr_design', item_id: DESIGNS[current].id }); } catch (e) { /* ignore */ } }, 1500);
  }
  function hoverAt(e) {
    const r = strip.getBoundingClientRect();
    hover.x = e.clientX - (r.left + r.width / 2);
    hover.y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    if (!hover.on) { hover.sx = hover.x; hover.sy = hover.y; }
    hover.on = true;
    kick();
  }
  function hoverOff() { hover.on = false; kick(); }

  let drag = null;
  strip.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    target = null;
    hoverAt(e);                               // a finger on the phone "hovers" too: the touched card grows at once
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, p0: pos, moved: false, lx: e.clientX, lt: e.timeStamp, v: 0, item: e.target.closest('.qd-item') };
  });
  strip.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || drag) hoverAt(e);
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0;
    if (!drag.moved) {
      if (Math.abs(dx) < 4) return;
      if (e.pointerType !== 'mouse' && Math.abs(e.clientY - drag.y0) > Math.abs(dx)) { drag = null; hoverOff(); return; }   // the page is being scrolled
      drag.moved = true;
      strip.classList.add('dragging');
      try { strip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    const dt = Math.max(1, e.timeStamp - drag.lt);
    drag.v = 0.7 * drag.v + 0.3 * ((e.clientX - drag.lx) / dt);    // px / ms
    drag.lx = e.clientX; drag.lt = e.timeStamp;
    pos = clampPos(drag.p0 - dx / step);
    kick();
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const dd = drag;
    drag = null;
    strip.classList.remove('dragging');
    if (e && e.pointerType !== 'mouse') setTimeout(hoverOff, 180);    // the finger left: the card settles back
    if (!dd.moved) {                       // a tap / click: centre the card that was touched
      if (dd.item) animateTo(+dd.item.dataset.i);
      return;
    }
    const fling = Math.max(-2.5, Math.min(2.5, -dd.v * 160 / step));   // a quick swipe goes a little further
    animateTo(Math.round(pos + fling));
  }
  strip.addEventListener('pointerup', endDrag);
  strip.addEventListener('pointercancel', (e) => { endDrag(e); hoverOff(); });
  strip.addEventListener('lostpointercapture', (e) => { if (e.target === strip) endDrag(e); });   // not the child's implicit touch capture
  strip.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !drag) hoverOff(); });
  // trackpad / horizontal wheel
  let wheelSnap = 0;
  strip.addEventListener('wheel', (e) => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!dx) return;
    e.preventDefault();
    target = null;
    pos = clampPos(pos + dx / step / 1.4);
    kick();
    clearTimeout(wheelSnap);
    wheelSnap = setTimeout(() => animateTo(Math.round(pos)), 120);
  }, { passive: false });
  strip.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    animateTo(current + (e.key === 'ArrowRight' ? 1 : -1));
  });

  /* ---------- big preview: tilts towards the pointer / finger, with a soft light that follows it ---------- */
  const frameEl = $('qrFrame');
  let tilt = null, tiltLoop = 0;
  const tiltNow = { x: 0, y: 0, a: 0 }, tiltTo = { x: 0, y: 0, a: 0 };
  function tiltFrame() {
    tiltLoop = 0;
    const st = els.qrCanvasWrap.querySelector('.qr-stage');
    if (!st) return;
    let busy = false;
    for (const k of ['x', 'y', 'a']) { const d = tiltTo[k] - tiltNow[k]; if (Math.abs(d) > 0.002) { tiltNow[k] += d * 0.18; busy = true; } else tiltNow[k] = tiltTo[k]; }
    st.style.transform = `perspective(900px) rotateX(${(-tiltNow.y * 7 * tiltNow.a).toFixed(2)}deg) rotateY(${(tiltNow.x * 9 * tiltNow.a).toFixed(2)}deg) scale(${(1 + 0.015 * tiltNow.a).toFixed(4)})`;
    st.style.setProperty('--mx', (50 + tiltNow.x * 50).toFixed(1) + '%');
    st.style.setProperty('--my', (50 + tiltNow.y * 50).toFixed(1) + '%');
    st.style.setProperty('--shine', (0.55 * tiltNow.a).toFixed(3));
    if (busy) tiltLoop = requestAnimationFrame(tiltFrame);
  }
  function tiltAt(e) {
    const st = els.qrCanvasWrap.querySelector('.qr-stage');
    if (!st) return;
    const r = st.getBoundingClientRect();
    tiltTo.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    tiltTo.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    tiltTo.a = 1;
    if (!tiltLoop) tiltLoop = requestAnimationFrame(tiltFrame);
  }
  function tiltOff() { tiltTo.a = 0; tiltTo.x = 0; tiltTo.y = 0; tilt = null; if (!tiltLoop) tiltLoop = requestAnimationFrame(tiltFrame); }
  frameEl.addEventListener('pointerdown', (e) => { if (!e.target.closest('.qd-logo-pop')) { tilt = e.pointerId; tiltAt(e); } });
  frameEl.addEventListener('pointermove', (e) => { if (e.target.closest('.qd-logo-pop')) return; if (e.pointerType === 'mouse' || tilt === e.pointerId) tiltAt(e); });
  frameEl.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') tiltOff(); });
  frameEl.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') tiltOff(); });
  frameEl.addEventListener('pointercancel', tiltOff);

  window.addEventListener('resize', () => { measure(); paint(); fitStage(); });

  /* ---------- centre logo (Premium): tap the middle of the code → upload an image or type a letter ---------- */
  const pop = $('logoPop');
  function toggleLogoPop() { if (pop.hidden) openLogoPop(); else closeLogoPop(); }
  function openLogoPop() {
    if (!isPremium(current)) return;
    $('logoText').value = ownLogo && ownLogo.type === 'text' ? ownLogo.text : '';
    pop.hidden = false;
    $('logoHot').classList.add('is-open');
  }
  function closeLogoPop() {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    const h = $('logoHot');
    if (h) h.classList.remove('is-open');
  }
  function setLogo(l) {
    ownLogo = l;
    $('logoReset').hidden = !ownLogo;
    renderQr();
  }
  $('logoText').addEventListener('input', (e) => {
    const v = [...e.target.value.trim()].slice(0, 2).join('');
    setLogo(v ? { type: 'text', text: v } : null);
  });
  $('logoFile').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || !/^image\//.test(f.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        // kept small (max 320 px, PNG keeps transparency): light to draw, sharp enough at 2400 px
        const k = Math.min(1, 320 / Math.max(im.naturalWidth, im.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(im.naturalWidth * k));
        c.height = Math.max(1, Math.round(im.naturalHeight * k));
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        $('logoText').value = '';
        setLogo({ type: 'image', src: c.toDataURL('image/png') });
      };
      im.src = reader.result;
    };
    reader.readAsDataURL(f);
  });
  $('logoReset').addEventListener('click', () => { $('logoText').value = ''; setLogo(null); });
  $('logoClose').addEventListener('click', closeLogoPop);
  document.addEventListener('pointerdown', (e) => {
    if (pop.hidden || pop.contains(e.target) || e.target.closest('#logoHot')) return;
    closeLogoPop();
  });

  /* ---------- notice line + buttons ---------- */
  function updateUi() {
    const d = DESIGNS[current];
    const prem = d.premium, paid = prem && ownsCurrent(current), on = salesOn();
    $('qdName').innerHTML = `<b></b><span class="qd-tag ${prem ? 'is-premium' : 'is-free'}"></span>`;
    $('qdName').firstChild.textContent = d.name[lang];
    $('qdName').lastChild.textContent = prem ? (paid ? '✓ ' + t('premium') : t('premium')) : t('free');
    const notice = $('qdNotice');
    notice.textContent = !prem ? t('noticeFree') : paid ? t('noticePaid') : on ? t('noticeRemove') : t('noticeOff');
    notice.classList.toggle('is-paid', paid);
    notice.classList.toggle('is-offer', prem && !paid && on);
    const showPay = prem && !paid && on;
    // next to the PayPal button the label is short, so that both buttons stay on one row
    els.downloadBtnText.textContent = paid ? t('downloadClean') : showPay ? t('downloadShort') : t('download');
    els.payBtn.hidden = false;
    els.payBtn.classList.toggle('is-off', !showPay);
    els.payBtn.disabled = !showPay;
    els.payBtn.setAttribute('aria-hidden', showPay ? 'false' : 'true');
    els.payBtn.tabIndex = showPay ? 0 : -1;
    els.payBtn.setAttribute('aria-label', t('payAria'));
    const mc = $('myCodesBtn');
    mc.hidden = !(user() && (PAY.mode === 'live' || PAY.mode === 'sandbox' || PAY.mode === 'demo'));
    $('myCodesText').textContent = t('myCodes') + (codes.length ? ' (' + codes.length + ')' : '');
    strip.setAttribute('aria-label', t('designsLabel'));
    $('logoTitle').textContent = t('logoTitle');
    $('logoUploadText').textContent = t('logoUpload');
    $('logoOr').textContent = t('logoOr');
    $('logoText').placeholder = t('logoLetterPh');
    $('logoReset').textContent = t('logoReset');
    $('logoClose').textContent = t('logoClose');
    $('logoReset').hidden = !ownLogo;
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
  async function downloadFree() {
    const d = DESIGNS[current];
    const r = await D.render(d.id, buildVCard(), renderOpts(current, false));
    saveBlob(await D.toPngBlob(r.svg, r.w, r.h, 2), d.premium ? `qr-${d.id}.png` : 'qr-code.png');
    trackEvent('qr_download', { design: d.id, clean: false });
  }
  /* a paid code (from the account): drawn without the site link, exactly as it was bought */
  async function downloadCode(code, which) {
    const r = await D.render(code.design, code.data, { branded: false, logo: code.logo || null });
    const base = `qr-${code.design}-${String(code.id).slice(-6).toLowerCase()}`;
    if (!which || which === 'png') saveBlob(await D.toPngBlob(r.svg, r.w, r.h, 4), base + '.png');
    if (!which || which === 'svg') {
      if (!which) await new Promise((ok) => setTimeout(ok, 700));   // two files: let the browser take the first one
      saveBlob(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + r.svg], { type: 'image/svg+xml' }), base + '.svg');
    }
    trackEvent('qr_download', { design: code.design, clean: true });
  }
  function trackEvent(name, extra) { try { if (window.gtag) gtag('event', name, Object.assign({ tool: 'qr-generator' }, extra || {})); } catch (e) { /* ignore */ } }

  async function busyDownload(job) {
    if (els.downloadBtn.disabled) return;
    const label = els.downloadBtnText.textContent;
    els.downloadBtn.disabled = true;
    els.downloadBtnText.textContent = t('downloading');
    try { await job(); } catch (e) { console.warn('[qr] download', e); }
    els.downloadBtn.disabled = false;
    els.downloadBtnText.textContent = label;
  }
  els.downloadBtn.addEventListener('click', () => {
    if (!hasAnyData()) { alert(t('alertEmpty')); return; }
    if (!isPremium(current)) { busyDownload(downloadFree); return; }          // Classic: free, no account
    const c = ownedCode(current);                                               // this exact code already paid
    if (c) busyDownload(() => downloadCode(c));
    else openOffer();                       // Premium: the window first — download with the site link, or pay
  });
  els.payBtn.addEventListener('click', () => {
    if (!hasAnyData()) { alert(t('alertEmpty')); return; }
    if (isPremium(current)) openOffer();
  });

  /* ================= Premium: account + $1.99 per code through PayPal =================
     Classic needs nothing. A Premium design needs a sign-in (the site's Firebase account, Google).
     One payment = one code: create-order sends the exact code (design + vCard text + centre logo) to the Worker
     (worker.js, "/api/qr/*"), which makes the PayPal order, captures it, checks status / amount / currency / owner
     and saves the code in the account. Only a code the server returns is drawn without the site link; the
     account's codes (GET /api/qr/codes, "My codes") can be downloaded again at any time. Any change to the details,
     the design or the logo is a new code (new payment). No secret in this page.
     Modes from GET /api/qr/config: live / sandbox (sales on) · demo (localhost: simulated payment, nothing saved
     on a server) · off (the free download with the site link stays). */
  const PAY_LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const PAY_API = (/\.workers\.dev$/.test(location.hostname) || PAY_LOCAL) ? '' : 'https://dr.merabti.workers.dev';
  const PAY_DEMO_HOST = PAY_LOCAL;
  const PENDING_KEY = 'qrgen:pending';     // { id, uid } — a paid order not confirmed yet (asked again, never a proof)
  const PAY = { mode: 'loading', cfg: null, sdk: null, busy: false, design: null, spec: null };
  const salesOn = () => PAY.mode === 'live' || PAY.mode === 'sandbox' || PAY.mode === 'demo';
  const price = () => '$' + ((PAY.cfg && PAY.cfg.price) || '1.99');

  function user() { return window.fbAuth && window.fbAuth.currentUser ? window.fbAuth.currentUser : null; }
  function ownedCode(i) {
    if (!isPremium(i) || !hasAnyData()) return null;
    return ownedByKey.get(specKey(DESIGNS[i].id, buildVCard(), ownLogo)) || null;
  }
  function setCodes(list) {
    codes = (list || []).slice();
    ownedByKey.clear();
    for (const c of codes) ownedByKey.set(specKey(c.design, c.data, c.logo), c);
    for (const id in rendered) delete rendered[id].key;      // free / paid look may have changed
    renderQr();
  }
  function addCode(c) {
    if (!c) return;
    setCodes([c].concat(codes.filter((x) => x.id !== c.id)));
  }

  async function payFetch(path, body) {
    const headers = body ? { 'Content-Type': 'application/json' } : {};
    const u = user();
    if (u) headers.Authorization = 'Bearer ' + await u.getIdToken();
    const r = await fetch(PAY_API + path, { method: body ? 'POST' : 'GET', cache: 'no-store', headers, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({}));
    d._status = r.status;
    return d;
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
  function pending(orderId) {
    const u = user();
    try {
      if (orderId && u) localStorage.setItem(PENDING_KEY, JSON.stringify({ id: orderId, uid: u.uid }));
      else localStorage.removeItem(PENDING_KEY);
    } catch (e) { /* ignore */ }
  }
  /* the account's codes, and an order paid but not confirmed (closed tab, lost connection) asked again */
  async function loadCodes() {
    if (!user() || !(PAY.mode === 'live' || PAY.mode === 'sandbox')) { if (PAY.mode !== 'demo') setCodes([]); updateUi(); return; }
    let p = null;
    try { p = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); } catch (e) { p = null; }
    if (p && p.id && p.uid === user().uid) {
      const d = await capture(p.id);
      if (d.ok) { pending(null); toast(t('payResumed')); }
      else if (d._status && d._status < 500 && d.error !== 'NOT_COMPLETED' && d.error !== 'AUTH_REQUIRED') pending(null);
    }
    const d = await payFetch('/api/qr/codes').catch(() => ({}));
    if (Array.isArray(d.codes)) setCodes(d.codes);
    updateUi();
  }
  async function loadPayConfig() {
    try {
      const d = await payFetch('/api/qr/config');
      if (d && d.price) PAY.cfg = d;
      PAY.mode = d && (d.sales === 'live' || d.sales === 'sandbox') ? d.sales : (PAY_DEMO_HOST ? 'demo' : 'off');
    } catch (e) { PAY.mode = PAY_DEMO_HOST ? 'demo' : 'off'; }
    updateUi();
    if (window.fbAuth) window.fbAuth.onAuthStateChanged(() => { if (!user()) setCodes([]); loadCodes(); });
  }

  function toast(text) {
    let el = $('qdToast');
    if (!el) { el = document.createElement('div'); el.id = 'qdToast'; el.className = 'qd-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 4200);
  }

  /* ---------- the floating window (sign-in, offer + PayPal, success, my codes) ---------- */
  const modal = $('payModal');
  const sheet = $('paySheet');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const GOOGLE = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const closeBtn = () => `<button type="button" class="qd-x" data-pay="close" aria-label="${esc(t('payClose'))}">${X}</button>`;

  function showModal() { modal.hidden = false; document.body.classList.add('qd-lock'); }
  function closePay() {
    if (PAY.busy) return;
    modal.hidden = true;
    document.body.classList.remove('qd-lock');
    sheet.innerHTML = '';
  }
  function payMsg(text, err) { const el = $('payMsg'); if (el) { el.textContent = text || ''; el.classList.toggle('err', !!err); } }
  function payBusy(on) { PAY.busy = on; sheet.classList.toggle('busy', on); }

  /* sign-in (Premium only) */
  let afterSignIn = null;
  function requireUser(next) {
    if (user()) { next(); return; }
    afterSignIn = next;
    if (!window.fbAuth) {                     // the account service did not load (blocked / offline)
      sheet.innerHTML = closeBtn() + `<div class="qd-auth"><h3>${esc(t('signTitle'))}</h3><p class="qd-msg err">${esc(t('signErr'))}</p></div>`;
      showModal();
      return;
    }
    sheet.innerHTML = closeBtn() + `<div class="qd-auth">
        <div class="qd-auth-badge"><svg viewBox="0 0 24 24"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor"/></svg></div>
        <h3>${esc(t('signTitle'))}</h3><p>${esc(t('signText'))}</p>
        <button type="button" class="qd-google" data-pay="google">${GOOGLE}<span>${esc(t('signGoogle'))}</span></button>
        <p class="qd-msg" id="payMsg" role="status"></p></div>`;
    showModal();
  }
  async function signIn() {
    payMsg('');
    try {
      await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const next = afterSignIn;
      afterSignIn = null;
      closePay();
      await loadCodes();
      if (next) next();
    } catch (e) {
      if (e && (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request')) return;
      payMsg(t('signErr'), true);
    }
  }

  /* the offer: pay to remove the site link from this code, or download free with it */
  function openOffer() {
    const i = current, d = DESIGNS[i];
    PAY.design = d.id;
    PAY.spec = { design: d.id, data: buildVCard(), logo: ownLogo };
    sheet.innerHTML = closeBtn() + `
      <div class="qd-sheet-main">
        <div class="qd-sheet-thumb"><img alt="" id="payThumb"></div>
        <div class="qd-sheet-info">
          <span class="qd-tag is-premium">${esc(t('premium'))} · ${esc(d.name[lang])}</span>
          <h3>${esc(t('offerTitle'))}</h3>
          <p class="qd-sheet-sub">${esc(t('offerText'))}</p>
          <div class="qd-price"><b dir="ltr">${esc(price())}</b><span>${esc(t('payOnce'))}</span></div>
        </div>
      </div>
      <ul class="qd-list"><li>${CHECK}<span>${esc(t('payB3'))}</span></li><li>${CHECK}<span>${esc(t('payB1'))} + ${esc(t('payB2'))}</span></li><li>${CHECK}<span>${esc(t('payB4'))}</span></li></ul>
      <div class="qd-pay-area" id="payArea"></div>
      <p class="qd-msg" id="payMsg" role="status"></p>
      <button type="button" class="qd-free" data-pay="free">${esc(t('offerFree'))}</button>
      <p class="qd-secure">${LOCK}<span>${esc(t('paySecure'))}</span></p>
      ${user() ? `<p class="qd-who">${esc(t('account'))}: <b dir="ltr">${esc(user().email || user().displayName || '')}</b> · <button type="button" class="link-btn" data-pay="signout">${esc(t('signOut'))}</button></p>` : ''}`;
    // what they get: this code without the site link
    D.render(d.id, PAY.spec.data, { branded: false, logo: PAY.spec.logo }).then((r) => { const im = $('payThumb'); if (im) im.src = D.svgUrl(r.svg); }).catch(() => {});
    renderPayArea();
    showModal();
    trackEvent('view_item', { design: d.id, value: 1.99, currency: 'USD' });
  }
  function renderPayArea() {
    const area = $('payArea');
    if (!area) return;
    if (PAY.mode === 'demo' && !user()) {
      area.innerHTML = `<button type="button" class="qd-pp" data-pay="paystart"><img src="../../books/word/img/paypal.svg" alt="PayPal"><small>${esc(t('payStart'))}</small></button>`;
      return;
    }
    if (PAY.mode === 'demo') {
      area.innerHTML = `<div class="qd-note">${esc(t('payDemo'))}</div>
        <button type="button" class="qd-pp" data-pay="demo"><img src="../../books/word/img/paypal.svg" alt="PayPal"><small>${esc(t('payDemoBtn'))} · <bdi dir="ltr">${esc(price())}</bdi></small></button>`;
      return;
    }
    if (!(PAY.mode === 'live' || PAY.mode === 'sandbox')) { area.innerHTML = `<div class="qd-note off">${esc(t('payOff'))}</div>`; return; }
    if (!user()) {                            // the choice first; the sign-in comes when the visitor picks "pay"
      area.innerHTML = `<button type="button" class="qd-pp" data-pay="paystart"><img src="../../books/word/img/paypal.svg" alt="PayPal"><small>${esc(t('payStart'))}</small></button>`;
      return;
    }
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
    const spec = PAY.spec;
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 44 },
      createOrder: async () => {
        payMsg('');
        const d = await payFetch('/api/qr/create-order', spec);
        if (d.error === 'ALREADY_OWNED' && d.code) { addCode(d.code); paidView(d.code, ''); throw new Error('owned'); }
        if (!d.id) { payMsg(d.message || t('payErr'), true); throw new Error(d.error || 'create'); }
        trackEvent('begin_checkout', { design: spec.design, value: 1.99, currency: 'USD' });
        return d.id;
      },
      onApprove: async (data, actions) => {
        payBusy(true); payMsg(t('paying'));
        pending(data.orderID);                      // paid but not confirmed yet: asked again on the next visit
        const d = await capture(data.orderID);
        payBusy(false);
        if (d.error === 'INSTRUMENT_DECLINED') { pending(null); payMsg(d.message, true); return actions.restart(); }
        if (!d.ok || !d.code) { payMsg(d.message || t('payErr'), true); return; }
        pending(null);
        trackEvent('purchase', { transaction_id: d.orderId, design: spec.design, value: 1.99, currency: 'USD' });
        addCode(d.code);
        paidView(d.code, d.orderId);
      },
      onCancel: () => payMsg(''),
      onError: () => { if (!sheet.querySelector('.qd-done')) payMsg(t('payErr'), true); },
    }).render(host).catch(() => { host.innerHTML = `<div class="qd-note off">${esc(t('payErr'))}</div>`; });
  }
  async function demoPay() {
    if (PAY.busy) return;
    payBusy(true); payMsg(t('paying'));
    await new Promise((ok) => setTimeout(ok, 900));
    payBusy(false);
    const s = PAY.spec;
    const code = { id: 'DEMO' + Date.now().toString(36).toUpperCase(), design: s.design, data: s.data, logo: s.logo || null, createdAt: new Date().toISOString() };
    addCode(code);
    paidView(code, code.id);
  }
  /* paid: the code is in the account; its two files download at once (drawn without the site link) */
  function paidView(code, orderId) {
    PAY.code = code;
    sheet.innerHTML = closeBtn() + `
      <div class="qd-done"><div class="qd-ok">${CHECK}</div><h3>${esc(t('payDone'))}</h3>
        <p>${esc(t('payDoneT'))}</p>
        <div class="qd-done-btns"><button type="button" class="generate-btn" data-pay="png">PNG</button><button type="button" class="generate-btn alt" data-pay="svg">SVG</button></div>
        ${orderId ? `<p class="qd-order">${esc(t('payOrder'))}: <b dir="ltr">${esc(orderId)}</b></p>` : ''}
        <p class="qd-small">${esc(t('paySavedNote'))}</p></div>`;
    if (modal.hidden) showModal();
    downloadCode(code).catch((e) => console.warn('[qr] download', e));
  }

  /* my codes: every code paid with this account, to download again or open */
  function vcardField(data, key) {
    const lines = String(data).split('\n');
    const i = lines.findIndex((l) => l.indexOf(key + ':') === 0);
    if (i < 0) return '';
    if (key !== 'NOTE') return lines[i].slice(key.length + 1);
    const end = lines.lastIndexOf('END:VCARD');
    return [lines[i].slice(5)].concat(lines.slice(i + 1, end > i ? end : undefined)).join('\n');
  }
  function openMyCodes() {
    const u = user();
    const list = codes.map((c) => {
      const d = DESIGNS.find((x) => x.id === c.design);
      const who = vcardField(c.data, 'FN') || vcardField(c.data, 'TEL') || vcardField(c.data, 'EMAIL') || '—';
      const when = c.createdAt ? new Date(c.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : lang) : '';
      return `<li class="qd-code" data-id="${esc(c.id)}"><span class="qd-code-thumb"><img alt=""></span>
        <span class="qd-code-info"><b dir="auto">${esc(who)}</b><small>${esc(d ? d.name[lang] : c.design)}${when ? ' · ' + esc(when) : ''}</small></span>
        <span class="qd-code-act"><button type="button" data-pay="cpng" data-id="${esc(c.id)}">PNG</button><button type="button" data-pay="csvg" data-id="${esc(c.id)}">SVG</button>
        <button type="button" class="open" data-pay="copen" data-id="${esc(c.id)}">${esc(t('myOpen'))}</button></span></li>`;
    }).join('');
    sheet.innerHTML = closeBtn() + `<h3 class="qd-codes-title">${esc(t('myCodesTitle'))}</h3>
      ${codes.length ? `<ul class="qd-codes">${list}</ul>` : `<p class="qd-codes-empty">${esc(t('myCodesEmpty'))}</p>`}
      <p class="qd-small qd-codes-note">${esc(t('paySavedNote'))}</p>
      <p class="qd-who">${u ? `${esc(t('account'))}: <b dir="ltr">${esc(u.email || u.displayName || '')}</b> · ` : ''}<button type="button" class="link-btn" data-pay="signout">${esc(t('signOut'))}</button></p>`;
    showModal();
    // thumbnails, one after the other
    (async () => {
      for (const c of codes) {
        const li = sheet.querySelector(`.qd-code[data-id="${CSS.escape(c.id)}"] img`);
        if (!li) return;
        try { const r = await D.render(c.design, c.data, { branded: false, logo: c.logo || null }); li.src = D.svgUrl(r.svg); } catch (e) { /* ignore */ }
      }
    })();
  }
  /* open a paid code in the editor: same details, design and logo (any change makes a new code) */
  function openCode(c) {
    els.qName.value = vcardField(c.data, 'FN');
    els.qPhone.value = vcardField(c.data, 'TEL');
    els.qJob.value = vcardField(c.data, 'TITLE');
    els.qEmail.value = vcardField(c.data, 'EMAIL');
    els.qNote.value = vcardField(c.data, 'NOTE');
    ownLogo = c.logo || null;
    $('logoText').value = ownLogo && ownLogo.type === 'text' ? ownLogo.text : '';
    closePay();
    const i = DESIGNS.findIndex((d) => d.id === c.design);
    if (i >= 0) animateTo(i);
    renderQr();
    els.qrCanvasWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) { closePay(); return; }
    const b = e.target.closest('[data-pay]');
    if (!b || b.disabled || PAY.busy) return;
    const a = b.dataset.pay;
    const byId = () => codes.find((c) => c.id === b.dataset.id);
    if (a === 'close') closePay();
    else if (a === 'google') signIn();
    else if (a === 'demo') demoPay();
    else if (a === 'free') requireUser(() => { closePay(); busyDownload(downloadFree); });   // Premium: an account, even free
    else if (a === 'paystart') requireUser(() => {       // after the sign-in: already paid for this exact code? download it
      const c = ownedCode(current);
      if (c) { closePay(); busyDownload(() => downloadCode(c)); } else openOffer();
    });
    else if ((a === 'png' || a === 'svg') && PAY.code) downloadCode(PAY.code, a).catch((err) => console.warn('[qr] download', err));
    else if (a === 'cpng' || a === 'csvg') { const c = byId(); if (c) downloadCode(c, a.slice(1)).catch((err) => console.warn('[qr] download', err)); }
    else if (a === 'copen') { const c = byId(); if (c) openCode(c); }
    else if (a === 'signout') { closePay(); window.fbAuth.signOut().catch(() => {}); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closePay(); });
  $('myCodesBtn').addEventListener('click', () => requireUser(openMyCodes));

  [els.qName, els.qPhone, els.qJob, els.qEmail, els.qNote].forEach((el) => el.addEventListener('input', renderQr));
  // Premium designs leave the page only through Download (account + choice window): no "save image" menu on them
  $('qrFrame').addEventListener('contextmenu', (e) => { if (isPremium(current) && !e.target.closest('.qd-logo-pop')) e.preventDefault(); });
  strip.addEventListener('contextmenu', (e) => e.preventDefault());

  /* ---------- start ---------- */
  items.forEach((it, k) => it.setAttribute('aria-selected', k === current ? 'true' : 'false'));
  applyLanguage();
  requestAnimationFrame(() => { measure(); paint(); });
  loadPayConfig();
})();
