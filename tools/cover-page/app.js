// ============================================================
// app.js — Cover Page Generator (full rebuild)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'مولّد صفحات الغلاف — أكاديمية مرابطي', topbarTitle: 'مولّد صفحات الغلاف',
      toolTitle: 'مولّد صفحات الغلاف',
      lockedTitle: 'سجّل دخولك لاستخدام مولّد صفحات الغلاف', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب',
      namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب', or: 'أو', googleBtn: 'المتابعة عبر Google',
      frameSectionLabel: 'الإطار (اختياري)', templateSectionLabel: 'القالب',
      catAll: 'الكل', catAcademic: 'أكاديمي', catInstitutional: 'مؤسسي',
      logosCardTitle: 'الشعارات', textCardTitle: 'النصوص',
      countryPh: 'الجمهورية / الدولة', org1Ph: 'اسم الجهة الأولى', org2Ph: 'اسم الجهة الثانية (اختياري)',
      mainTitlePh: 'العنوان الرئيسي', subtitlePh: 'الموضوع / العنوان الفرعي', datePh: 'السنة / التاريخ',
      studentsCardTitle: 'إعداد الطالب', addStudentText: 'إضافة',
      juryCardTitle: 'لجنة المناقشة', addJuryText: 'إضافة',
      simplePersonCardTitle: 'جهة إضافية', secondPersonPh: 'المشرف / جهة إضافية (اختياري)',
      studentPh: 'اسم الطالب', jurorNamePh: 'الاسم', jurorRankPh: 'الرتبة', jurorUniPh: 'الجامعة',
      roles: ['رئيسًا', 'مشرفًا ومقررًا', 'ممتحنًا', 'مدعوًا'],
      presentedBy: 'من إعداد الطالب(ة):',
      download: 'تحميل PDF', downloading: '…',
      defaultCountry: 'الجمهورية الجزائرية الديمقراطية الشعبية............',
      defaultOrg1: 'وزارة التعليم العالي والبحث العلمي\nجامعة .......................',
      defaultOrg2: 'كلية .......................',
      defaultDate: '2026/2025',
      defaultSubtitleGeneric: 'موضوع البحث أو المشروع يكتب هنا',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Cover Page Generator — Merabti Academy', topbarTitle: 'Cover Page Generator',
      toolTitle: 'Cover Page Generator',
      lockedTitle: 'Sign in to use the Cover Page Generator', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up',
      namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up', or: 'or', googleBtn: 'Continue with Google',
      frameSectionLabel: 'Frame (optional)', templateSectionLabel: 'Template',
      catAll: 'All', catAcademic: 'Academic', catInstitutional: 'Institutional',
      logosCardTitle: 'Logos', textCardTitle: 'Text',
      countryPh: 'Country / Republic', org1Ph: 'Primary institution name', org2Ph: 'Secondary institution (optional)',
      mainTitlePh: 'Main title', subtitlePh: 'Topic / subtitle', datePh: 'Year / date',
      studentsCardTitle: 'Presented by', addStudentText: 'Add',
      juryCardTitle: 'Examination committee', addJuryText: 'Add',
      simplePersonCardTitle: 'Additional party', secondPersonPh: 'Supervisor / additional party (optional)',
      studentPh: 'Student name', jurorNamePh: 'Name', jurorRankPh: 'Rank', jurorUniPh: 'University',
      roles: ['President', 'Supervisor', 'Examiner', 'Guest'],
      presentedBy: 'Presented by:',
      download: 'Download PDF', downloading: '…',
      defaultCountry: 'People\'s Democratic Republic of Algeria............',
      defaultOrg1: 'Ministry of Higher Education and Scientific Research\nUniversity of .......................',
      defaultOrg2: 'Faculty of .......................',
      defaultDate: '2025/2026',
      defaultSubtitleGeneric: 'Research or project topic goes here',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Générateur de page de garde — Académie Merabti', topbarTitle: 'Générateur de page de garde',
      toolTitle: 'Générateur de page de garde',
      lockedTitle: 'Connectez-vous pour utiliser le générateur de page de garde', lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription',
      namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire", or: 'ou', googleBtn: 'Continuer avec Google',
      frameSectionLabel: 'Cadre (optionnel)', templateSectionLabel: 'Modèle',
      catAll: 'Tous', catAcademic: 'Académique', catInstitutional: 'Institutionnel',
      logosCardTitle: 'Logos', textCardTitle: 'Textes',
      countryPh: 'République / Pays', org1Ph: "Nom de l'établissement principal", org2Ph: "Établissement secondaire (optionnel)",
      mainTitlePh: 'Titre principal', subtitlePh: 'Sujet / sous-titre', datePh: 'Année / date',
      studentsCardTitle: 'Présenté par', addStudentText: 'Ajouter',
      juryCardTitle: 'Jury de soutenance', addJuryText: 'Ajouter',
      simplePersonCardTitle: 'Partie additionnelle', secondPersonPh: 'Encadrant / partie additionnelle (optionnel)',
      studentPh: "Nom de l'étudiant(e)", jurorNamePh: 'Nom', jurorRankPh: 'Grade', jurorUniPh: 'Université',
      roles: ['Président', 'Directeur de thèse', 'Examinateur', 'Invité'],
      presentedBy: 'Présentée par :',
      download: 'Télécharger le PDF', downloading: '…',
      defaultCountry: 'République Algérienne Démocratique et Populaire............',
      defaultOrg1: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique\nUniversité de .......................",
      defaultOrg2: "Faculté de .......................",
      defaultDate: '2025/2026',
      defaultSubtitleGeneric: 'Le sujet de recherche ou du projet ici',
    },
  };

  const TEMPLATE_TITLES = {
    ar: ['مذكرة تخرج', 'رسالة دكتوراه', 'مشروع/بحث', 'عرض تقديمي/مناقشة', 'تقرير تربص',
      'التقرير السنوي', 'عرض سعر/مقترح', 'محضر اجتماع', 'خطة عمل/دراسة جدوى', 'دليل/كتيب داخلي'],
    en: ['Graduation Thesis', 'PhD Dissertation', 'Project/Research', 'Presentation/Defense', 'Internship Report',
      'Annual Report', 'Quote/Proposal', 'Meeting Minutes', 'Business Plan', 'Internal Handbook'],
    fr: ['Mémoire de fin d\'études', 'Thèse de doctorat', 'Projet/Recherche', 'Soutenance', 'Rapport de stage',
      'Rapport annuel', 'Devis/Proposition', 'Procès-verbal', 'Plan d\'affaires', 'Guide interne'],
  };

  let lang = localStorage.getItem('coverpage:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  /* ================= Templates (10) ================= */
  const TEMPLATES = [
    { id: 1, cat: 'academic', layout: 'l2', decor: 'deco-corners', accent: '#1B3A6B', boxedTitle: true, jury: true },
    { id: 2, cat: 'academic', layout: 'l1', decor: 'deco-double', accent: '#5A3FA0', boxedTitle: true, jury: true },
    { id: 3, cat: 'academic', layout: 'l1', decor: 'deco-none', accent: '#1E8A52', boxedTitle: false, jury: true },
    { id: 4, cat: 'academic', layout: 'l1', decor: 'deco-thin', accent: '#0F6FC5', boxedTitle: true, jury: true },
    { id: 5, cat: 'academic', layout: 'l2', decor: 'deco-none', accent: '#C9A227', boxedTitle: false, jury: true },
    { id: 6, cat: 'institutional', layout: 'l3', decor: 'deco-none', accent: '#222222', boxedTitle: false, jury: false },
    { id: 7, cat: 'institutional', layout: 'l2', decor: 'deco-thin', accent: '#B1345A', boxedTitle: false, jury: false },
    { id: 8, cat: 'institutional', layout: 'l3', decor: 'deco-none', accent: '#4A5568', boxedTitle: false, jury: false },
    { id: 9, cat: 'institutional', layout: 'l3', decor: 'deco-thin', accent: '#17879E', boxedTitle: false, jury: false },
    { id: 10, cat: 'institutional', layout: 'l3', decor: 'deco-none', accent: '#E8621A', boxedTitle: false, jury: false },
  ];

  const FRAMES = [
    { id: 0, type: 'none' },
    { id: 1, type: 'thin', accent: '#1B3A6B' },
    { id: 2, type: 'double', accent: '#C9A227' },
    { id: 3, type: 'corners', accent: '#1E8A52' },
    { id: 4, type: 'dots', accent: '#5A3FA0' },
    { id: 5, type: 'circles', accent: '#378ADD' },
    { id: 6, type: 'diagonal', accent: '#D85A30' },
    { id: 7, type: 'ribbon', accent: '#534AB7' },
    { id: 8, type: 'dotgrad', accent: '#EF9F27' },
    { id: 9, type: 'upload' },
  ];

  const DEFAULT_LOGO_SVG = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#EEF3F6" stroke="#B7C7D3" stroke-width="1"/>
    <path d="M24 15c-3-2-8-2-11 0v16c3-2 8-2 11 0V15z" fill="#2F5770"/>
    <path d="M24 15c3-2 8-2 11 0v16c-3-2-8-2-11 0V15z" fill="#3A6E8F"/>
  </svg>`;

  let activeCategory = 'all';
  let activeTemplate = TEMPLATES[0];
  let activeFrame = FRAMES[0];
  let customFrameDataUrl = null;
  let logo1DataUrl = null;
  let logo2DataUrl = null;
  let students = [''];
  let jury = [{ name: '', rank: '', uni: '', role: 0 }];

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'), toolTitle: $('toolTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), editorScreen: $('editorScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'),
    authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'), acGoogleBtn: $('acGoogleBtn'),
    frameSectionLabel: $('frameSectionLabel'), templateSectionLabel: $('templateSectionLabel'),
    categoryFilter: $('categoryFilter'), templateFilter: $('templateFilter'),
    frameFilter: $('frameFilter'), customFrameInput: $('customFrameInput'),
    logo1Box: $('logo1Box'), logo1Preview: $('logo1Preview'), logo1Input: $('logo1Input'),
    logo2Box: $('logo2Box'), logo2Preview: $('logo2Preview'), logo2Placeholder: $('logo2Placeholder'), logo2Input: $('logo2Input'),
    logosCardTitle: $('logosCardTitle'), textCardTitle: $('textCardTitle'),
    fCountry: $('fCountry'), fOrg1: $('fOrg1'), fOrg2: $('fOrg2'), fMainTitle: $('fMainTitle'), fSubtitle: $('fSubtitle'), fDate: $('fDate'),
    studentsCard: $('studentsCard'), studentsCardTitle: $('studentsCardTitle'), addStudentBtn: $('addStudentBtn'), addStudentText: $('addStudentText'), studentsList: $('studentsList'),
    juryCard: $('juryCard'), juryCardTitle: $('juryCardTitle'), addJuryBtn: $('addJuryBtn'), addJuryText: $('addJuryText'), juryList: $('juryList'),
    simplePersonCard: $('simplePersonCard'), simplePersonCardTitle: $('simplePersonCardTitle'), fSecondPerson: $('fSecondPerson'),
    downloadPdfBtn: $('downloadPdfBtn'), downloadBtnText: $('downloadBtnText'),
    coverPage: $('coverPage'), frameOverlay: $('frameOverlay'), frameImg: $('frameImg'),
    coverCountry: $('coverCountry'), coverLogosRow: $('coverLogosRow'), coverLogo1: $('coverLogo1'), coverLogo2: $('coverLogo2'),
    coverOrg1: $('coverOrg1'), coverOrg2: $('coverOrg2'),
    coverMainTitle: $('coverMainTitle'), coverTitleBox: $('coverTitleBox'), coverSubtitleBoxed: $('coverSubtitleBoxed'), coverSubtitle: $('coverSubtitle'),
    coverPresentedByLabel: $('coverPresentedByLabel'), coverPresenter: $('coverPresenter'), coverSecond: $('coverSecond'),
    coverJuryTable: $('coverJuryTable'), coverDate: $('coverDate'),
  };

  /* ================= Persistence (localStorage) ================= */
  const STORAGE_KEY = 'coverpage:draft';
  function saveDraft() {
    const draft = {
      lang, activeCategory, activeTemplateId: activeTemplate.id, activeFrameId: activeFrame.id, customFrameDataUrl,
      logo1DataUrl, logo2DataUrl, students, jury,
      fCountry: els.fCountry.value, fOrg1: els.fOrg1.value, fOrg2: els.fOrg2.value,
      fMainTitle: els.fMainTitle.value, fSubtitle: els.fSubtitle.value, fDate: els.fDate.value,
      fSecondPerson: els.fSecondPerson.value,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch (e) { /* ignore quota errors */ }
  }
  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  /* ================= Screens ================= */
  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.editorScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ================= Auth ================= */
  const AUTH_ERR = {
    'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
    'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
    'auth/popup-closed-by-user': '', default: 'حدث خطأ، حاول مرة أخرى.',
  };
  function authErrMsg(code) { return AUTH_ERR[code] || AUTH_ERR.default; }
  function showAuthError(msg) {
    if (!msg) return;
    els.authCardError.textContent = msg;
    els.authCardError.classList.remove('hidden');
  }
  function updateAuthFormMode(mode) {
    const isLogin = mode === 'login';
    els.tabLogin.classList.toggle('active', isLogin);
    els.tabSignup.classList.toggle('active', !isLogin);
    els.acName.classList.toggle('hidden', isLogin);
    els.acSubmitBtn.textContent = isLogin ? t('loginBtn') : t('signupBtn');
    els.authCardError.classList.add('hidden');
  }
  els.tabLogin.addEventListener('click', () => updateAuthFormMode('login'));
  els.tabSignup.addEventListener('click', () => updateAuthFormMode('signup'));
  els.authCardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isLogin = els.tabLogin.classList.contains('active');
    const email = els.acEmail.value.trim();
    const password = els.acPassword.value;
    els.acSubmitBtn.disabled = true;
    try {
      if (isLogin) await window.fbAuth.signInWithEmailAndPassword(email, password);
      else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (els.acName.value.trim()) await cred.user.updateProfile({ displayName: els.acName.value.trim() });
      }
    } catch (err) { showAuthError(authErrMsg(err.code)); }
    els.acSubmitBtn.disabled = false;
  });
  els.acGoogleBtn.addEventListener('click', async () => {
    try { await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
    catch (err) { showAuthError(authErrMsg(err.code)); }
  });

  /* ================= Mini thumbnail renderer (shared for frames + templates) ================= */
  function miniPageHtml(tpl) {
    const dual = tpl.layout === 'l2' ? 'dual' : '';
    const single = tpl.layout === 'l3' ? 'style="justify-content:flex-start;"' : '';
    return `<div class="mini-page">
      <div class="mini-logo-row ${dual}" ${single}>
        <span class="mini-logo-dot"></span>
        ${tpl.layout === 'l2' ? '<span class="mini-logo-dot"></span>' : ''}
      </div>
      <div class="mini-line" style="top:34%;"></div>
      <div class="mini-line" style="top:42%; left:22%; right:22%;"></div>
      ${tpl.boxedTitle ? `<div class="mini-title-box" style="top:58%; border-color:${tpl.accent};"></div>` : `<div class="mini-line" style="top:60%; background:${tpl.accent}; opacity:.5;"></div>`}
      <div class="mini-line" style="top:82%; left:30%; right:30%;"></div>
    </div>`;
  }

  function frameOverlayClass(frame) {
    if (frame.type === 'none' || frame.type === 'upload') return '';
    return 'frame-' + frame.type;
  }

  function miniFrameHtml(frame) {
    if (frame.type === 'none') return `<span class="none-swatch">${lang === 'ar' ? 'بدون' : lang === 'fr' ? 'Aucun' : 'None'}</span>`;
    if (frame.type === 'upload') return `<span class="upload-swatch">📁</span>`;
    let dotgrad = '';
    if (frame.type === 'dotgrad') {
      dotgrad = `<span style="width:12px;height:12px;bottom:2px;right:2px;opacity:.9;"></span>
        <span style="width:8px;height:8px;bottom:6px;right:14px;opacity:.7;"></span>
        <span style="width:6px;height:6px;bottom:16px;right:4px;opacity:.6;"></span>
        <span style="width:4px;height:4px;bottom:20px;right:18px;opacity:.4;"></span>`;
    }
    return `<div class="mini-page">
      <div class="mini-frame-overlay ${frameOverlayClass(frame)}" style="--cv-accent:${frame.accent};">${dotgrad}</div>
    </div>`;
  }

  /* ================= Category + Template filter ================= */
  function renderCategoryFilter() {
    const cats = [
      { key: 'all', label: t('catAll') },
      { key: 'academic', label: t('catAcademic') },
      { key: 'institutional', label: t('catInstitutional') },
    ];
    els.categoryFilter.innerHTML = cats.map((c) =>
      `<button type="button" class="category-btn ${c.key === activeCategory ? 'active' : ''}" data-cat="${c.key}">${c.label}</button>`
    ).join('');
    els.categoryFilter.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        renderCategoryFilter();
        renderTemplateFilter();
      });
    });
  }

  function renderTemplateFilter() {
    const list = activeCategory === 'all' ? TEMPLATES : TEMPLATES.filter((tp) => tp.cat === activeCategory);
    els.templateFilter.innerHTML = list.map((tpl) => `
      <button type="button" class="theme-swatch-btn ${tpl.id === activeTemplate.id ? 'active' : ''}" data-id="${tpl.id}" title="${TEMPLATE_TITLES[lang][tpl.id - 1]}">
        ${miniPageHtml(tpl)}
      </button>
    `).join('');
    els.templateFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTemplate = TEMPLATES.find((tp) => tp.id === parseInt(btn.getAttribute('data-id'), 10));
        renderTemplateFilter();
        syncCardsVisibility();
        renderCover();
        saveDraft();
      });
    });
  }

  /* ================= Frame filter ================= */
  function renderFrameFilter() {
    els.frameFilter.innerHTML = FRAMES.map((f) => `
      <button type="button" class="theme-swatch-btn ${f.id === activeFrame.id ? 'active' : ''}" data-id="${f.id}">
        ${miniFrameHtml(f)}
      </button>
    `).join('');
    els.frameFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = FRAMES.find((fr) => fr.id === parseInt(btn.getAttribute('data-id'), 10));
        if (f.type === 'upload') { els.customFrameInput.click(); return; }
        activeFrame = f;
        renderFrameFilter();
        renderCover();
        saveDraft();
      });
    });
  }
  els.customFrameInput.addEventListener('change', () => {
    const file = els.customFrameInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      customFrameDataUrl = e.target.result;
      activeFrame = FRAMES.find((f) => f.type === 'upload');
      renderFrameFilter();
      renderCover();
      saveDraft();
    };
    reader.readAsDataURL(file);
  });

  /* ================= Logo uploads ================= */
  function setupLogoUpload(box, input, preview, setUrl) {
    box.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setUrl(e.target.result);
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        renderCover();
        saveDraft();
      };
      reader.readAsDataURL(file);
    });
  }
  setupLogoUpload(els.logo1Box, els.logo1Input, els.logo1Preview, (url) => { logo1DataUrl = url; });
  setupLogoUpload(els.logo2Box, els.logo2Input, els.logo2Preview, (url) => { logo2DataUrl = url; });

  /* ================= Students (dynamic add) ================= */
  function renderStudents() {
    els.studentsList.innerHTML = students.map((val, i) => `
      <div class="dyn-row">
        <input type="text" class="cv-input student-input" data-i="${i}" placeholder="${t('studentPh')}" value="${escapeAttr(val)}">
        ${students.length > 1 ? `<button type="button" class="dyn-row-remove" data-i="${i}">×</button>` : ''}
      </div>
    `).join('');
    els.studentsList.querySelectorAll('.student-input').forEach((inp) => {
      inp.addEventListener('input', () => {
        students[parseInt(inp.getAttribute('data-i'), 10)] = inp.value;
        renderCover();
        saveDraft();
      });
    });
    els.studentsList.querySelectorAll('.dyn-row-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        students.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
        renderStudents();
        renderCover();
        saveDraft();
      });
    });
  }
  els.addStudentBtn.addEventListener('click', () => {
    students.push('');
    renderStudents();
    saveDraft();
  });

  /* ================= Jury (dynamic add, academic only) ================= */
  function renderJury() {
    els.juryList.innerHTML = jury.map((row, i) => `
      <div class="jury-row">
        <input type="text" class="cv-input jury-name" data-i="${i}" placeholder="${t('jurorNamePh')}" value="${escapeAttr(row.name)}">
        <input type="text" class="cv-input jury-rank" data-i="${i}" placeholder="${t('jurorRankPh')}" value="${escapeAttr(row.rank)}">
        <input type="text" class="cv-input jury-uni" data-i="${i}" placeholder="${t('jurorUniPh')}" value="${escapeAttr(row.uni)}">
        <select class="cv-input jury-role" data-i="${i}">
          ${t('roles').map((r, ri) => `<option value="${ri}" ${row.role === ri ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
        ${jury.length > 1 ? `<button type="button" class="dyn-row-remove jury-remove" data-i="${i}">×</button>` : '<span></span>'}
      </div>
    `).join('');
    els.juryList.querySelectorAll('.jury-name').forEach((inp) => inp.addEventListener('input', () => { jury[+inp.dataset.i].name = inp.value; renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-rank').forEach((inp) => inp.addEventListener('input', () => { jury[+inp.dataset.i].rank = inp.value; renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-uni').forEach((inp) => inp.addEventListener('input', () => { jury[+inp.dataset.i].uni = inp.value; renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-role').forEach((sel) => sel.addEventListener('change', () => { jury[+sel.dataset.i].role = parseInt(sel.value, 10); renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-remove').forEach((btn) => btn.addEventListener('click', () => {
      jury.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
      renderJury(); renderCover(); saveDraft();
    }));
  }
  els.addJuryBtn.addEventListener('click', () => {
    jury.push({ name: '', rank: '', uni: '', role: 0 });
    renderJury();
    saveDraft();
  });

  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  /* ================= Cards visibility per template ================= */
  function syncCardsVisibility() {
    const tpl = activeTemplate;
    els.logo2Box.classList.toggle('hidden', tpl.layout !== 'l2');
    els.juryCard.classList.toggle('hidden', !tpl.jury);
    els.simplePersonCard.classList.toggle('hidden', !!tpl.jury);
  }

  /* ================= Live preview ================= */
  function renderCover() {
    const tpl = activeTemplate;
    els.coverPage.setAttribute('data-layout', tpl.layout);
    els.coverPage.setAttribute('data-decor', tpl.decor);
    els.coverPage.style.setProperty('--cv-accent', tpl.accent);

    // Frame
    if (activeFrame.type === 'none') {
      els.frameImg.classList.add('hidden');
      els.frameOverlay.className = 'cover-frame-overlay';
      els.frameOverlay.innerHTML = '';
      els.frameOverlay.style.removeProperty('--cv-accent');
    } else if (activeFrame.type === 'upload' && customFrameDataUrl) {
      els.frameImg.src = customFrameDataUrl;
      els.frameImg.classList.remove('hidden');
      els.frameOverlay.className = 'cover-frame-overlay';
      els.frameOverlay.innerHTML = '';
    } else {
      els.frameImg.classList.add('hidden');
      els.frameOverlay.className = 'cover-frame-overlay ' + frameOverlayClass(activeFrame);
      els.frameOverlay.style.setProperty('--cv-accent', activeFrame.accent);
      if (activeFrame.type === 'dotgrad') {
        els.frameOverlay.innerHTML = `
          <span style="position:absolute; width:22px; height:22px; bottom:4%; right:4%; opacity:.9; border-radius:50%; background:var(--cv-accent);"></span>
          <span style="position:absolute; width:14px; height:14px; bottom:10%; right:14%; opacity:.7; border-radius:50%; background:var(--cv-accent);"></span>
          <span style="position:absolute; width:10px; height:10px; bottom:18%; right:6%; opacity:.55; border-radius:50%; background:var(--cv-accent);"></span>
          <span style="position:absolute; width:6px; height:6px; bottom:26%; right:20%; opacity:.4; border-radius:50%; background:var(--cv-accent);"></span>`;
      } else {
        els.frameOverlay.innerHTML = '';
      }
    }

    // Logos
    const logo1Src = logo1DataUrl;
    if (logo1Src) { els.coverLogo1.src = logo1Src; }
    else { els.coverLogo1.removeAttribute('src'); }
    if (logo2DataUrl && tpl.layout === 'l2') { els.coverLogo2.src = logo2DataUrl; els.coverLogo2.classList.remove('hidden'); }
    else { els.coverLogo2.classList.add('hidden'); }

    // Text
    els.coverCountry.textContent = els.fCountry.value.trim();
    els.coverOrg1.innerHTML = escapeHtml(els.fOrg1.value.trim()).replace(/\n/g, '<br>');
    els.coverOrg2.textContent = tpl.layout === 'l2' ? els.fOrg2.value.trim() : '';
    els.coverMainTitle.textContent = els.fMainTitle.value.trim() || TEMPLATE_TITLES[lang][tpl.id - 1];

    if (tpl.boxedTitle) {
      els.coverTitleBox.classList.remove('hidden');
      els.coverSubtitleBoxed.textContent = els.fSubtitle.value.trim();
      els.coverSubtitle.textContent = '';
    } else {
      els.coverTitleBox.classList.add('hidden');
      els.coverSubtitle.textContent = els.fSubtitle.value.trim();
    }

    els.coverPresentedByLabel.textContent = t('presentedBy');
    els.coverPresenter.textContent = students.filter((s) => s.trim()).join('، ');
    els.coverDate.textContent = els.fDate.value.trim();

    if (tpl.jury) {
      els.coverSecond.textContent = '';
      els.coverJuryTable.classList.remove('hidden');
      els.coverJuryTable.innerHTML = jury.filter((r) => r.name.trim()).map((r) =>
        `<div class="jury-table-row"><span>${escapeHtml(r.name)}</span><span>${escapeHtml(r.rank)}</span><span>${escapeHtml(r.uni)}</span><span>${escapeHtml(t('roles')[r.role])}</span></div>`
      ).join('');
    } else {
      els.coverJuryTable.classList.add('hidden');
      els.coverJuryTable.innerHTML = '';
      els.coverSecond.textContent = els.fSecondPerson.value.trim();
    }
  }

  [els.fCountry, els.fOrg1, els.fOrg2, els.fMainTitle, els.fSubtitle, els.fDate, els.fSecondPerson].forEach((input) => {
    input.addEventListener('input', () => { renderCover(); saveDraft(); });
  });

  /* ================= Apply language ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle;
    els.toolTitle.textContent = dict.toolTitle;
    els.lockedTitle.textContent = dict.lockedTitle;
    els.lockedSub.textContent = dict.lockedSub;
    els.tabLogin.textContent = dict.tabLogin;
    els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh;
    els.acEmail.placeholder = dict.emailPh;
    els.acPassword.placeholder = dict.passwordPh;
    els.acGoogleBtn.querySelector('span').textContent = dict.googleBtn;
    els.frameSectionLabel.textContent = dict.frameSectionLabel;
    els.templateSectionLabel.textContent = dict.templateSectionLabel;
    els.logosCardTitle.textContent = dict.logosCardTitle;
    els.textCardTitle.textContent = dict.textCardTitle;
    els.fCountry.placeholder = dict.countryPh;
    els.fOrg1.placeholder = dict.org1Ph;
    els.fOrg2.placeholder = dict.org2Ph;
    els.fMainTitle.placeholder = dict.mainTitlePh;
    els.fSubtitle.placeholder = dict.subtitlePh;
    els.fDate.placeholder = dict.datePh;
    els.studentsCardTitle.textContent = dict.studentsCardTitle;
    els.addStudentText.textContent = dict.addStudentText;
    els.juryCardTitle.textContent = dict.juryCardTitle;
    els.addJuryText.textContent = dict.addJuryText;
    els.simplePersonCardTitle.textContent = dict.simplePersonCardTitle;
    els.fSecondPerson.placeholder = dict.secondPersonPh;
    els.downloadBtnText.textContent = dict.download;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('coverpage:lang', lang);

    updateAuthFormMode(els.tabLogin.classList.contains('active') ? 'login' : 'signup');
    renderCategoryFilter();
    renderTemplateFilter();
    renderFrameFilter();
    renderStudents();
    renderJury();
    syncCardsVisibility();
    renderCover();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); saveDraft(); }));

  /* ================= PDF export ================= */
  els.downloadPdfBtn.addEventListener('click', async () => {
    const original = els.downloadBtnText.textContent;
    els.downloadPdfBtn.disabled = true;
    els.downloadBtnText.textContent = t('downloading');
    try {
      const canvas = await html2canvas(els.coverPage, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('cover-page.pdf');
    } catch (e) {
      alert('---');
    }
    els.downloadPdfBtn.disabled = false;
    els.downloadBtnText.textContent = original;
  });

  /* ================= Init with defaults / draft ================= */
  function applyDefaults() {
    const dict = I18N[lang];
    els.fCountry.value = dict.defaultCountry;
    els.fOrg1.value = dict.defaultOrg1;
    els.fOrg2.value = dict.defaultOrg2;
    els.fSubtitle.value = dict.defaultSubtitleGeneric;
    els.fDate.value = dict.defaultDate;
    students = [lang === 'fr' ? 'Dr. Soufiane Merabti' : lang === 'en' ? 'Dr. Soufiane Merabti' : 'د. سفيان مرابطي'];
    jury = [{ name: students[0], rank: '', uni: '', role: 0 }];
    els.coverLogo1.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(
      `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#EEF3F6" stroke="#B7C7D3" stroke-width="1"/><path d="M24 15c-3-2-8-2-11 0v16c3-2 8-2 11 0V15z" fill="#2F5770"/><path d="M24 15c3-2 8-2 11 0v16c-3-2-8-2-11 0V15z" fill="#3A6E8F"/></svg>`
    )));
  }

  function init() {
    const draft = loadDraft();
    if (draft) {
      lang = draft.lang || lang;
      activeCategory = draft.activeCategory || 'all';
      activeTemplate = TEMPLATES.find((t2) => t2.id === draft.activeTemplateId) || TEMPLATES[0];
      activeFrame = FRAMES.find((f) => f.id === draft.activeFrameId) || FRAMES[0];
      customFrameDataUrl = draft.customFrameDataUrl || null;
      logo1DataUrl = draft.logo1DataUrl || null;
      logo2DataUrl = draft.logo2DataUrl || null;
      students = (draft.students && draft.students.length) ? draft.students : [''];
      jury = (draft.jury && draft.jury.length) ? draft.jury : [{ name: '', rank: '', uni: '', role: 0 }];

      applyLanguage();
      els.fCountry.value = draft.fCountry || '';
      els.fOrg1.value = draft.fOrg1 || '';
      els.fOrg2.value = draft.fOrg2 || '';
      els.fMainTitle.value = draft.fMainTitle || '';
      els.fSubtitle.value = draft.fSubtitle || '';
      els.fDate.value = draft.fDate || '';
      els.fSecondPerson.value = draft.fSecondPerson || '';
      if (logo1DataUrl) { els.coverLogo1.src = logo1DataUrl; els.logo1Preview.src = logo1DataUrl; els.logo1Preview.classList.remove('hidden'); }
      else { els.coverLogo1.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(DEFAULT_LOGO_SVG))); }
      if (logo2DataUrl) { els.logo2Preview.src = logo2DataUrl; els.logo2Preview.classList.remove('hidden'); }
      renderStudents();
      renderJury();
      syncCardsVisibility();
      renderCover();
    } else {
      applyDefaults();
      applyLanguage();
    }
  }

  init();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
      showScreen(fbUser ? 'editorScreen' : 'lockedScreen');
    });
  } else {
    showScreen('lockedScreen');
  }
})();
