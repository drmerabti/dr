// ============================================================
// app.js — Cover Page Generator v3
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'مولّد صفحات الغلاف — أكاديمية مرابطي', topbarTitle: 'مولّد صفحات الغلاف', toolTitle: 'مولّد صفحات الغلاف',
      lockedTitle: 'سجّل دخولك لاستخدام مولّد صفحات الغلاف', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب', namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب', googleBtn: 'المتابعة عبر Google',
      frameSectionLabel: 'الإطار (اختياري)', fontSectionLabel: 'الخط', templateSectionLabel: 'القالب',
      logosCardTitle: 'الشعارات', textCardTitle: 'النصوص', instTextCardTitle: 'النصوص',
      countryPh: 'الجمهورية / الدولة', ministryPh: 'الوزارة', uniPh: 'اسم الجامعة', facultyPh: 'الكلية',
      degreeTypePh: 'نوع الشهادة (أطروحة / مذكرة تخرج...)', specialtyPh: 'التخصص (اختياري)',
      mainTitlePh: 'عنوان المشروع / الأطروحة', datePh: 'السنة الجامعية',
      companyPh: 'اسم الشركة/المؤسسة', categoryPh: 'تصنيف التقرير', instTitlePh: 'عنوان التقرير الكامل',
      preparedByPh: 'إعداد: (جهة الإعداد)', websitePh: 'الموقع الإلكتروني', countrySimplePh: 'البلد',
      studentsCardTitle: 'إعداد الطالب', studentPh: 'اسم الطالب',
      supervisorCardTitle: 'تحت إشراف', supervisorPh: 'اسم المشرف',
      juryCardTitle: 'لجنة المناقشة', addJuryText: 'إضافة',
      jurorNamePh: 'الاسم', jurorRankPh: 'الرتبة', jurorUniPh: 'الجامعة',
      roles: ['مشرفًا', 'رئيسًا', 'مصححًا', 'مدعوًا'],
      presentedLabel: 'من إعداد الطالب(ة):', presentedLabelSimple: 'من إعداد الطالب:', supervisedLabel: 'تحت إشراف:',
      download: 'تحميل PDF', downloading: '…',
      templateNames: ['أطروحة دكتوراه', 'مذكرة تخرج', 'مشروع دراسي', 'تقرير مؤسسي'],
      fontNames: ['عصري', 'كلاسيكي', 'رسمي تقليدي', 'بسيط'],
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Cover Page Generator — Merabti Academy', topbarTitle: 'Cover Page Generator', toolTitle: 'Cover Page Generator',
      lockedTitle: 'Sign in to use the Cover Page Generator', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up', namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up', googleBtn: 'Continue with Google',
      frameSectionLabel: 'Frame (optional)', fontSectionLabel: 'Font', templateSectionLabel: 'Template',
      logosCardTitle: 'Logos', textCardTitle: 'Text', instTextCardTitle: 'Text',
      countryPh: 'Country / Republic', ministryPh: 'Ministry', uniPh: 'University name', facultyPh: 'Faculty',
      degreeTypePh: 'Degree type (Thesis / Dissertation...)', specialtyPh: 'Specialty (optional)',
      mainTitlePh: 'Project / thesis title', datePh: 'Academic year',
      companyPh: 'Company/organization name', categoryPh: 'Report category', instTitlePh: 'Full report title',
      preparedByPh: 'Prepared by:', websitePh: 'Website', countrySimplePh: 'Country',
      studentsCardTitle: 'Presented by', studentPh: 'Student name',
      supervisorCardTitle: 'Supervised by', supervisorPh: 'Supervisor name',
      juryCardTitle: 'Examination committee', addJuryText: 'Add',
      jurorNamePh: 'Name', jurorRankPh: 'Rank', jurorUniPh: 'University',
      roles: ['Supervisor', 'President', 'Examiner', 'Guest'],
      presentedLabel: 'Presented by:', presentedLabelSimple: 'Presented by:', supervisedLabel: 'Supervised by:',
      download: 'Download PDF', downloading: '…',
      templateNames: ['PhD Dissertation', 'Graduation Thesis', 'Study Project', 'Corporate Report'],
      fontNames: ['Modern', 'Classic', 'Traditional Formal', 'Simple'],
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Générateur de page de garde — Académie Merabti', topbarTitle: 'Générateur de page de garde', toolTitle: 'Générateur de page de garde',
      lockedTitle: 'Connectez-vous pour utiliser le générateur de page de garde', lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription', namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire", googleBtn: 'Continuer avec Google',
      frameSectionLabel: 'Cadre (optionnel)', fontSectionLabel: 'Police', templateSectionLabel: 'Modèle',
      logosCardTitle: 'Logos', textCardTitle: 'Textes', instTextCardTitle: 'Textes',
      countryPh: 'République / Pays', ministryPh: 'Ministère', uniPh: "Nom de l'université", facultyPh: 'Faculté',
      degreeTypePh: 'Type de diplôme (Thèse / Mémoire...)', specialtyPh: 'Spécialité (optionnel)',
      mainTitlePh: 'Titre du projet / de la thèse', datePh: 'Année universitaire',
      companyPh: "Nom de l'entreprise", categoryPh: 'Catégorie du rapport', instTitlePh: 'Titre complet du rapport',
      preparedByPh: 'Préparé par :', websitePh: 'Site web', countrySimplePh: 'Pays',
      studentsCardTitle: 'Présenté par', studentPh: "Nom de l'étudiant(e)",
      supervisorCardTitle: 'Encadré par', supervisorPh: "Nom de l'encadrant",
      juryCardTitle: 'Jury de soutenance', addJuryText: 'Ajouter',
      jurorNamePh: 'Nom', jurorRankPh: 'Grade', jurorUniPh: 'Université',
      roles: ['Directeur', 'Président', 'Examinateur', 'Invité'],
      presentedLabel: 'Présentée par :', presentedLabelSimple: 'Présenté par :', supervisedLabel: 'Encadré par :',
      download: 'Télécharger le PDF', downloading: '…',
      templateNames: ['Thèse de doctorat', 'Mémoire de fin d\'études', "Projet d'étude", 'Rapport institutionnel'],
      fontNames: ['Moderne', 'Classique', 'Formel traditionnel', 'Simple'],
    },
  };

  let lang = localStorage.getItem('coverpage:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  /* ================= Templates (4 locked) ================= */
  const TEMPLATES = [
    { id: 1, key: 'l1', dualLogo: false, jury: true, sideBySide: false, type: 'academic' },
    { id: 2, key: 'l2', dualLogo: true, jury: true, sideBySide: false, type: 'academic' },
    { id: 3, key: 'project', dualLogo: false, jury: false, sideBySide: true, type: 'academic' },
    { id: 4, key: 'institutional', type: 'institutional' },
  ];
  let activeTemplate = TEMPLATES[0];

  /* ================= Fonts (4 pairings) ================= */
  const FONTS = [
    { id: 1, ar: "'Tajawal'", en: "'Inter'" },
    { id: 2, ar: "'Amiri'", en: "'Georgia'" },
    { id: 3, ar: "'Noto Naskh Arabic'", en: "'Georgia'" },
    { id: 4, ar: "'Cairo'", en: "'Roboto', 'Inter'" },
  ];
  let activeFont = FONTS[0];

  /* ================= Frames (numbered, extensible) ================= */
  const FRAME_COUNT = 5; // frame-1.png .. frame-5.png — bump this to add more later
  const FRAMES = [{ id: 0, file: null }].concat(
    Array.from({ length: FRAME_COUNT }, (_, i) => ({ id: i + 1, file: `frames/frame-${i + 1}.png` }))
  );
  let activeFrame = FRAMES[0];

  const DEFAULT_LOGO_SVG = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="none" stroke="#B7C7D3" stroke-width="1"/><path d="M24 15c-3-2-8-2-11 0v16c3-2 8-2 11 0V15z" fill="#2F5770"/><path d="M24 15c3-2 8-2 11 0v16c-3-2-8-2-11 0V15z" fill="#3A6E8F"/></svg>`;
  const DEFAULT_LOGO_URL = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(DEFAULT_LOGO_SVG)));

  let logo1DataUrl = null;
  let logo2DataUrl = null;
  let instLogoDataUrl = null;
  let students = [''];
  let jury = [{ name: '', rank: '', uni: '', role: 0 }];

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'), toolTitle: $('toolTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), editorScreen: $('editorScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'), authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'), acGoogleBtn: $('acGoogleBtn'),
    frameSectionLabel: $('frameSectionLabel'), fontSectionLabel: $('fontSectionLabel'), templateSectionLabel: $('templateSectionLabel'),
    frameFilter: $('frameFilter'), fontFilter: $('fontFilter'), templateFilter: $('templateFilter'),
    logo1Box: $('logo1Box'), logo1Preview: $('logo1Preview'), logo1Input: $('logo1Input'),
    logo2Box: $('logo2Box'), logo2Preview: $('logo2Preview'), logo2Input: $('logo2Input'),
    logosCardTitle: $('logosCardTitle'),
    academicTextCard: $('academicTextCard'), textCardTitle: $('textCardTitle'),
    fCountry: $('fCountry'), fMinistry: $('fMinistry'), fUni: $('fUni'), fFaculty: $('fFaculty'),
    fDegreeType: $('fDegreeType'), fSpecialty: $('fSpecialty'), fMainTitle: $('fMainTitle'), fDate: $('fDate'),
    instTextCard: $('instTextCard'), instTextCardTitle: $('instTextCardTitle'),
    fCompany: $('fCompany'), fCategoryLabel: $('fCategoryLabel'), fInstTitle: $('fInstTitle'),
    fPreparedBy: $('fPreparedBy'), fWebsite: $('fWebsite'), fCountrySimple: $('fCountrySimple'),
    studentsCard: $('studentsCard'), studentsCardTitle: $('studentsCardTitle'), studentsList: $('studentsList'),
    supervisorCard: $('supervisorCard'), supervisorCardTitle: $('supervisorCardTitle'), fSupervisor: $('fSupervisor'),
    juryCard: $('juryCard'), juryCardTitle: $('juryCardTitle'), addJuryBtn: $('addJuryBtn'), addJuryText: $('addJuryText'), juryList: $('juryList'),
    downloadPdfBtn: $('downloadPdfBtn'), downloadBtnText: $('downloadBtnText'),
    coverPage: $('coverPage'), frameImg: $('frameImg'),
    tplAcademic: $('tplAcademic'), tplInstitutional: $('tplInstitutional'),
    acCountry: $('acCountry'), acMinistry: $('acMinistry'), acUni: $('acUni'), acFaculty: $('acFaculty'),
    acLogosRow: $('acLogosRow'), acLogo1: $('acLogo1'), acHeaderRow: $('acHeaderRow'), acLogoLeft: $('acLogoLeft'), acLogoRight: $('acLogoRight'),
    acMiddle: $('acMiddle'), acDegreeType: $('acDegreeType'), acSpecialty: $('acSpecialty'), acMainTitle: $('acMainTitle'),
    acPresenterBlock: $('acPresenterBlock'), acPresentedLabel: $('acPresentedLabel'), acPresenterName: $('acPresenterName'),
    acSideBySide: $('acSideBySide'), acStudentLabel2: $('acStudentLabel2'), acPresenterName2: $('acPresenterName2'),
    acSupervisorLabel: $('acSupervisorLabel'), acSupervisorName: $('acSupervisorName'),
    acJuryTable: $('acJuryTable'), acDate: $('acDate'),
    instLogo: $('instLogo'), instCompany: $('instCompany'), instCategory: $('instCategory'), instTitle: $('instTitle'),
    instPrepared: $('instPrepared'), instWebsite: $('instWebsite'), instCountry: $('instCountry'),
  };

  /* ================= Persistence ================= */
  const STORAGE_KEY = 'coverpage:draft:v3';
  function saveDraft() {
    const draft = {
      lang, activeTemplateId: activeTemplate.id, activeFontId: activeFont.id, activeFrameId: activeFrame.id,
      logo1DataUrl, logo2DataUrl, instLogoDataUrl, students, jury,
      fCountry: els.fCountry.value, fMinistry: els.fMinistry.value, fUni: els.fUni.value, fFaculty: els.fFaculty.value,
      fDegreeType: els.fDegreeType.value, fSpecialty: els.fSpecialty.value, fMainTitle: els.fMainTitle.value, fDate: els.fDate.value,
      fCompany: els.fCompany.value, fCategoryLabel: els.fCategoryLabel.value, fInstTitle: els.fInstTitle.value,
      fPreparedBy: els.fPreparedBy.value, fWebsite: els.fWebsite.value, fCountrySimple: els.fCountrySimple.value,
      fSupervisor: els.fSupervisor.value,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch (e) { /* ignore */ }
  }
  function loadDraft() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }

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
  function showAuthError(msg) { if (!msg) return; els.authCardError.textContent = msg; els.authCardError.classList.remove('hidden'); }
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
    const email = els.acEmail.value.trim(); const password = els.acPassword.value;
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

  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }

  /* ================= Filters: Template / Font / Frame ================= */
  function miniTemplateHtml(tpl) {
    if (tpl.type === 'institutional') {
      return `<div class="mini-page">
        <span style="position:absolute; top:10%; left:10%; width:16%; height:16%; background:#eee; border-radius:3px;"></span>
        <span class="mini-line" style="top:44%;"></span>
        <span class="mini-title-box" style="top:52%;"></span>
      </div>`;
    }
    const dual = tpl.dualLogo;
    return `<div class="mini-page">
      ${dual
        ? `<span class="mini-logo-dot" style="left:10%;"></span><span class="mini-logo-dot" style="right:10%;"></span>`
        : `<span class="mini-logo-dot" style="left:46%;"></span>`}
      <span class="mini-line" style="top:22%;"></span>
      <span class="mini-line" style="top:28%; left:26%; right:26%;"></span>
      <span class="mini-title-box" style="top:50%;"></span>
      <span class="mini-line" style="top:${tpl.jury ? '80' : '76'}%; left:30%; right:30%;"></span>
    </div>`;
  }
  function renderTemplateFilter() {
    els.templateFilter.innerHTML = TEMPLATES.map((tpl, i) => `
      <button type="button" class="theme-swatch-btn ${tpl.id === activeTemplate.id ? 'active' : ''}" data-id="${tpl.id}" title="${t('templateNames')[i]}">
        ${miniTemplateHtml(tpl)}
      </button>`).join('');
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

  function renderFontFilter() {
    els.fontFilter.innerHTML = FONTS.map((f, i) => `
      <button type="button" class="theme-swatch-btn ${f.id === activeFont.id ? 'active' : ''}" data-id="${f.id}" style="font-family:${f.ar};">
        <span class="font-swatch-label">${t('fontNames')[i]}</span>
      </button>`).join('');
    els.fontFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFont = FONTS.find((f) => f.id === parseInt(btn.getAttribute('data-id'), 10));
        renderFontFilter();
        applyFont();
        saveDraft();
      });
    });
  }
  function applyFont() {
    els.coverPage.style.setProperty('--cv-font-ar', activeFont.ar);
    els.coverPage.style.setProperty('--cv-font-en', activeFont.en);
  }

  function renderFrameFilter() {
    els.frameFilter.innerHTML = FRAMES.map((f) => `
      <button type="button" class="theme-swatch-btn ${f.id === activeFrame.id ? 'active' : ''}" data-id="${f.id}">
        ${f.file ? `<img src="${f.file}" style="width:100%;height:100%;object-fit:cover;" alt="">` : `<span class="mini-page" style="display:flex;align-items:center;justify-content:center;font-size:.6rem;color:#999;">${lang === 'ar' ? 'بدون' : lang === 'fr' ? 'Aucun' : 'None'}</span>`}
      </button>`).join('');
    els.frameFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFrame = FRAMES.find((f) => f.id === parseInt(btn.getAttribute('data-id'), 10));
        renderFrameFilter();
        renderCover();
        saveDraft();
      });
    });
  }

  /* ================= Logo uploads ================= */
  function setupLogoUpload(box, input, preview, setUrl) {
    box.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { setUrl(e.target.result); preview.src = e.target.result; preview.classList.remove('hidden'); renderCover(); saveDraft(); };
      reader.readAsDataURL(file);
    });
  }
  setupLogoUpload(els.logo1Box, els.logo1Input, els.logo1Preview, (url) => { logo1DataUrl = url; instLogoDataUrl = url; });
  setupLogoUpload(els.logo2Box, els.logo2Input, els.logo2Preview, (url) => { logo2DataUrl = url; });

  /* ================= Students ================= */
  function renderStudents() {
    els.studentsList.innerHTML = students.map((val, i) => `
      <div class="dyn-row">
        <input type="text" class="cv-input student-input" data-i="${i}" placeholder="${t('studentPh')}" value="${escapeAttr(val)}">
        ${students.length > 1 ? `<button type="button" class="dyn-row-remove" data-i="${i}">×</button>` : `<button type="button" class="dyn-row-remove" id="addStudentBtn" style="color:var(--accent);">+</button>`}
      </div>`).join('');
    els.studentsList.querySelectorAll('.student-input').forEach((inp) => inp.addEventListener('input', () => { students[+inp.dataset.i] = inp.value; renderCover(); saveDraft(); }));
    els.studentsList.querySelectorAll('.dyn-row-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.id === 'addStudentBtn') students.push('');
        else students.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
        renderStudents(); renderCover(); saveDraft();
      });
    });
  }

  /* ================= Jury ================= */
  function renderJury() {
    els.juryList.innerHTML = jury.map((row, i) => `
      <div class="jury-row">
        <input type="text" class="cv-input jury-name" data-i="${i}" placeholder="${t('jurorNamePh')}" value="${escapeAttr(row.name)}">
        <input type="text" class="cv-input jury-rank" data-i="${i}" placeholder="${t('jurorRankPh')}" value="${escapeAttr(row.rank)}">
        <input type="text" class="cv-input jury-uni" data-i="${i}" placeholder="${t('jurorUniPh')}" value="${escapeAttr(row.uni)}">
        <select class="cv-input jury-role" data-i="${i}">${t('roles').map((r, ri) => `<option value="${ri}" ${row.role === ri ? 'selected' : ''}>${r}</option>`).join('')}</select>
        ${jury.length > 1 ? `<button type="button" class="dyn-row-remove jury-remove" data-i="${i}">×</button>` : '<span></span>'}
      </div>`).join('');
    els.juryList.querySelectorAll('.jury-name').forEach((inp) => inp.addEventListener('input', () => { jury[+inp.dataset.i].name = inp.value; renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-rank').forEach((inp) => inp.addEventListener('input', () => { jury[+inp.dataset.i].rank = inp.value; renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-uni').forEach((inp) => inp.addEventListener('input', () => { jury[+inp.dataset.i].uni = inp.value; renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-role').forEach((sel) => sel.addEventListener('change', () => { jury[+sel.dataset.i].role = parseInt(sel.value, 10); renderCover(); saveDraft(); }));
    els.juryList.querySelectorAll('.jury-remove').forEach((btn) => btn.addEventListener('click', () => { jury.splice(parseInt(btn.getAttribute('data-i'), 10), 1); renderJury(); renderCover(); saveDraft(); }));
  }
  els.addJuryBtn.addEventListener('click', () => { jury.push({ name: '', rank: '', uni: '', role: 0 }); renderJury(); saveDraft(); });

  /* ================= Cards visibility ================= */
  function syncCardsVisibility() {
    const tpl = activeTemplate;
    const isAcademic = tpl.type === 'academic';
    els.academicTextCard.classList.toggle('hidden', !isAcademic);
    els.instTextCard.classList.toggle('hidden', isAcademic);
    els.logo2Box.classList.toggle('hidden', !(isAcademic && tpl.dualLogo));
    els.juryCard.classList.toggle('hidden', !(isAcademic && tpl.jury));
    els.supervisorCard.classList.toggle('hidden', !(isAcademic && tpl.sideBySide));
    els.studentsCard.classList.toggle('hidden', !isAcademic);
    els.tplAcademic.classList.toggle('hidden', !isAcademic);
    els.tplInstitutional.classList.toggle('hidden', isAcademic);
  }

  /* ================= Live preview ================= */
  function renderCover() {
    const tpl = activeTemplate;

    // Frame
    if (activeFrame.file) { els.frameImg.src = activeFrame.file; els.frameImg.classList.remove('hidden'); }
    else { els.frameImg.classList.add('hidden'); }

    if (tpl.type === 'academic') {
      els.acCountry.textContent = els.fCountry.value.trim();
      els.acMinistry.textContent = els.fMinistry.value.trim();
      els.acUni.textContent = els.fUni.value.trim();
      els.acFaculty.textContent = els.fFaculty.value.trim();

      const logoSrc1 = logo1DataUrl || DEFAULT_LOGO_URL;
      if (tpl.dualLogo) {
        // Dual-logo template: logos flank the country/ministry header row
        els.acLogosRow.classList.add('hidden');
        els.acLogoLeft.src = logoSrc1;
        els.acLogoLeft.classList.remove('hidden');
        els.acLogoRight.src = logo2DataUrl || DEFAULT_LOGO_URL;
        els.acLogoRight.classList.remove('hidden');
      } else {
        // Single-logo templates: one centered logo below university/faculty
        els.acLogoLeft.classList.add('hidden');
        els.acLogoRight.classList.add('hidden');
        els.acLogosRow.classList.remove('hidden');
        els.acLogo1.src = logoSrc1;
      }

      els.acDegreeType.textContent = els.fDegreeType.value.trim();
      els.acSpecialty.textContent = els.fSpecialty.value.trim();
      els.acMainTitle.textContent = els.fMainTitle.value.trim();
      els.acDate.textContent = els.fDate.value.trim();

      const presenterText = students.filter((s) => s.trim()).join('، ');

      if (tpl.sideBySide) {
        els.acPresenterBlock.classList.add('hidden');
        els.acSideBySide.classList.remove('hidden');
        els.acStudentLabel2.textContent = t('presentedLabelSimple');
        els.acPresenterName2.textContent = presenterText;
        els.acSupervisorLabel.textContent = t('supervisedLabel');
        els.acSupervisorName.textContent = els.fSupervisor.value.trim();
        els.acJuryTable.classList.add('hidden');
        els.acJuryTable.innerHTML = '';
      } else {
        els.acPresenterBlock.classList.remove('hidden');
        els.acSideBySide.classList.add('hidden');
        els.acPresentedLabel.textContent = t('presentedLabel');
        els.acPresenterName.textContent = presenterText;
        if (tpl.jury) {
          els.acJuryTable.classList.remove('hidden');
          const head = `<div class="jury-grid-head"><span>${t('jurorNamePh')}</span><span>${t('jurorRankPh')}</span><span>${t('jurorUniPh')}</span><span>—</span></div>`;
          const rows = jury.filter((r) => r.name.trim()).map((r) =>
            `<div class="jury-grid-row"><span>${escapeHtml(r.name)}</span><span>${escapeHtml(r.rank)}</span><span>${escapeHtml(r.uni)}</span><span>${escapeHtml(t('roles')[r.role])}</span></div>`
          ).join('');
          els.acJuryTable.innerHTML = head + rows;
        } else {
          els.acJuryTable.classList.add('hidden');
          els.acJuryTable.innerHTML = '';
        }
      }
    } else {
      els.instLogo.src = instLogoDataUrl || DEFAULT_LOGO_URL;
      els.instCompany.textContent = els.fCompany.value.trim();
      els.instCategory.textContent = els.fCategoryLabel.value.trim();
      els.instTitle.textContent = els.fInstTitle.value.trim();
      els.instPrepared.textContent = els.fPreparedBy.value.trim();
      els.instWebsite.textContent = els.fWebsite.value.trim();
      els.instCountry.textContent = els.fCountrySimple.value.trim();
    }
  }

  [els.fCountry, els.fMinistry, els.fUni, els.fFaculty, els.fDegreeType, els.fSpecialty, els.fMainTitle, els.fDate,
   els.fCompany, els.fCategoryLabel, els.fInstTitle, els.fPreparedBy, els.fWebsite, els.fCountrySimple, els.fSupervisor
  ].forEach((input) => { input.addEventListener('input', () => { renderCover(); saveDraft(); }); });

  /* ================= i18n apply ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag; document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle; els.toolTitle.textContent = dict.toolTitle;
    els.lockedTitle.textContent = dict.lockedTitle; els.lockedSub.textContent = dict.lockedSub;
    els.tabLogin.textContent = dict.tabLogin; els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh; els.acEmail.placeholder = dict.emailPh; els.acPassword.placeholder = dict.passwordPh;
    els.acGoogleBtn.querySelector('span').textContent = dict.googleBtn;
    els.frameSectionLabel.textContent = dict.frameSectionLabel; els.fontSectionLabel.textContent = dict.fontSectionLabel; els.templateSectionLabel.textContent = dict.templateSectionLabel;
    els.logosCardTitle.textContent = dict.logosCardTitle; els.textCardTitle.textContent = dict.textCardTitle; els.instTextCardTitle.textContent = dict.instTextCardTitle;
    els.fCountry.placeholder = dict.countryPh; els.fMinistry.placeholder = dict.ministryPh; els.fUni.placeholder = dict.uniPh; els.fFaculty.placeholder = dict.facultyPh;
    els.fDegreeType.placeholder = dict.degreeTypePh; els.fSpecialty.placeholder = dict.specialtyPh; els.fMainTitle.placeholder = dict.mainTitlePh; els.fDate.placeholder = dict.datePh;
    els.fCompany.placeholder = dict.companyPh; els.fCategoryLabel.placeholder = dict.categoryPh; els.fInstTitle.placeholder = dict.instTitlePh;
    els.fPreparedBy.placeholder = dict.preparedByPh; els.fWebsite.placeholder = dict.websitePh; els.fCountrySimple.placeholder = dict.countrySimplePh;
    els.studentsCardTitle.textContent = dict.studentsCardTitle;
    els.supervisorCardTitle.textContent = dict.supervisorCardTitle; els.fSupervisor.placeholder = dict.supervisorPh;
    els.juryCardTitle.textContent = dict.juryCardTitle; els.addJuryText.textContent = dict.addJuryText;
    els.downloadBtnText.textContent = dict.download;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('coverpage:lang', lang);

    updateAuthFormMode(els.tabLogin.classList.contains('active') ? 'login' : 'signup');
    renderTemplateFilter(); renderFontFilter(); renderFrameFilter();
    renderStudents(); renderJury(); syncCardsVisibility(); applyFont(); renderCover();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); saveDraft(); }));

  /* ================= PDF export ================= */
  els.downloadPdfBtn.addEventListener('click', async () => {
    const original = els.downloadBtnText.textContent;
    els.downloadPdfBtn.disabled = true; els.downloadBtnText.textContent = t('downloading');
    try {
      const canvas = await html2canvas(els.coverPage, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('cover-page.pdf');
    } catch (e) { alert('---'); }
    els.downloadPdfBtn.disabled = false; els.downloadBtnText.textContent = original;
  });

  /* ================= Defaults ================= */
  function applyDefaults() {
    els.fCountry.value = 'الجمهورية الجزائرية الديمقراطية الشعبية............';
    els.fMinistry.value = 'وزارة التعليم العالي والبحث العلمي';
    els.fUni.value = 'جامعة سعد دحلب البليدة 1';
    els.fFaculty.value = 'كلية العلوم والتكنولوجيا';
    els.fDegreeType.value = 'أطروحة مقدمة لنيل شهادة الدكتوراه في العلوم';
    els.fSpecialty.value = 'أنظمة الطاقة المتجددة';
    els.fMainTitle.value = 'دراسة وتحسين أداء منظومة كهروضوئية موصولة بالشبكة';
    els.fDate.value = 'السنة الجامعية: 2025/2026';
    els.fCompany.value = 'اسم الشركة';
    els.fCategoryLabel.value = 'التقرير السنوي';
    els.fInstTitle.value = 'تقرير النشاط والإنجازات لسنة 2025';
    els.fPreparedBy.value = 'إعداد: الإدارة العامة';
    els.fWebsite.value = 'www.company.com';
    els.fCountrySimple.value = 'الجزائر';
    els.fSupervisor.value = 'د. سفيان مرابطي';
    students = ['د. سفيان مرابطي'];
    jury = [
      { name: 'د. سفيان مرابطي', rank: 'أستاذ محاضر', uni: 'البليدة 1', role: 0 },
      { name: 'د. فلان الفلاني', rank: 'أستاذ', uni: 'البليدة 1', role: 1 },
      { name: 'د. فلان الفلاني', rank: 'أستاذ محاضر', uni: 'البليدة 1', role: 2 },
      { name: 'د. فلان الفلاني', rank: 'أستاذ محاضر', uni: 'البليدة 1', role: 2 },
      { name: 'د. فلان الفلاني', rank: 'أستاذ محاضر', uni: 'البليدة 1', role: 2 },
    ];
  }

  function init() {
    const draft = loadDraft();
    if (draft) {
      lang = draft.lang || lang;
      activeTemplate = TEMPLATES.find((tp) => tp.id === draft.activeTemplateId) || TEMPLATES[0];
      activeFont = FONTS.find((f) => f.id === draft.activeFontId) || FONTS[0];
      activeFrame = FRAMES.find((f) => f.id === draft.activeFrameId) || FRAMES[0];
      logo1DataUrl = draft.logo1DataUrl || null;
      logo2DataUrl = draft.logo2DataUrl || null;
      instLogoDataUrl = draft.instLogoDataUrl || null;
      students = (draft.students && draft.students.length) ? draft.students : [''];
      jury = (draft.jury && draft.jury.length) ? draft.jury : [{ name: '', rank: '', uni: '', role: 0 }];

      applyLanguage();
      els.fCountry.value = draft.fCountry || ''; els.fMinistry.value = draft.fMinistry || '';
      els.fUni.value = draft.fUni || ''; els.fFaculty.value = draft.fFaculty || '';
      els.fDegreeType.value = draft.fDegreeType || ''; els.fSpecialty.value = draft.fSpecialty || '';
      els.fMainTitle.value = draft.fMainTitle || ''; els.fDate.value = draft.fDate || '';
      els.fCompany.value = draft.fCompany || ''; els.fCategoryLabel.value = draft.fCategoryLabel || '';
      els.fInstTitle.value = draft.fInstTitle || ''; els.fPreparedBy.value = draft.fPreparedBy || '';
      els.fWebsite.value = draft.fWebsite || ''; els.fCountrySimple.value = draft.fCountrySimple || '';
      els.fSupervisor.value = draft.fSupervisor || '';
      if (logo1DataUrl) { els.logo1Preview.src = logo1DataUrl; els.logo1Preview.classList.remove('hidden'); }
      if (logo2DataUrl) { els.logo2Preview.src = logo2DataUrl; els.logo2Preview.classList.remove('hidden'); }
      renderStudents(); renderJury(); syncCardsVisibility(); renderCover();
    } else {
      applyDefaults();
      applyLanguage();
    }
    els.logo1Preview.src = logo1DataUrl || DEFAULT_LOGO_URL;
    els.logo1Preview.classList.remove('hidden');
  }

  init();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => { showScreen(fbUser ? 'editorScreen' : 'lockedScreen'); });
  } else {
    showScreen('lockedScreen');
  }
})();
