// ============================================================
// app.js — AI Text Detector (ar / en / fr)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'كاشف النص الآلي — أكاديمية مرابطي', topbarTitle: 'كاشف النص الآلي',
      lockedTitle: 'سجّل دخولك لاستخدام كاشف النص الآلي', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب',
      namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب',
      or: 'أو', googleBtn: 'المتابعة عبر Google',
      toolTitle: 'كاشف النص الآلي', toolSub: 'تحليل استرشادي بمساعدة الذكاء الاصطناعي',
      inputPh: 'الصق النص المراد تحليله هنا... (30 حرفًا على الأقل)',
      analyze: 'تحليل النص', analyzing: 'جارِ التحليل...',
      gaugeLabel: 'احتمال أن يكون آليًا',
      confLow: 'مستوى الثقة: منخفض', confMedium: 'مستوى الثقة: متوسط', confHigh: 'مستوى الثقة: مرتفع',
      disclaimer: 'تقدير استرشادي، وليس كشفًا قطعيًا مضمونًا.',
      errTooShort: 'الرجاء إدخال نص لا يقل عن 30 حرفًا.',
      errTooLong: 'النص طويل جدًا (الحد الأقصى 8000 حرف).',
      errGeneric: 'حدث خطأ أثناء التحليل، حاول مرة أخرى.',
      errAuth: 'يجب تسجيل الدخول لاستخدام هذه الأداة.',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'AI Text Detector — Merabti Academy', topbarTitle: 'AI Text Detector',
      lockedTitle: 'Sign in to use the AI text detector', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up',
      namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up',
      or: 'or', googleBtn: 'Continue with Google',
      toolTitle: 'AI Text Detector', toolSub: 'AI-assisted indicative analysis',
      inputPh: 'Paste the text you want to analyze here... (at least 30 characters)',
      analyze: 'Analyze text', analyzing: 'Analyzing...',
      gaugeLabel: 'Probability of being AI-generated',
      confLow: 'Confidence: low', confMedium: 'Confidence: medium', confHigh: 'Confidence: high',
      disclaimer: 'An indicative estimate, not a definitive detection.',
      errTooShort: 'Please enter at least 30 characters.',
      errTooLong: 'Text is too long (maximum 8000 characters).',
      errGeneric: 'Something went wrong during analysis, please try again.',
      errAuth: 'You must be signed in to use this tool.',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Détecteur de texte IA — Académie Merabti', topbarTitle: 'Détecteur de texte IA',
      lockedTitle: 'Connectez-vous pour utiliser le détecteur de texte IA', lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription',
      namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire",
      or: 'ou', googleBtn: 'Continuer avec Google',
      toolTitle: 'Détecteur de texte IA', toolSub: 'Analyse indicative assistée par IA',
      inputPh: 'Collez ici le texte à analyser... (30 caractères minimum)',
      analyze: 'Analyser le texte', analyzing: 'Analyse en cours...',
      gaugeLabel: "Probabilité d'être généré par IA",
      confLow: 'Confiance : faible', confMedium: 'Confiance : moyenne', confHigh: 'Confiance : élevée',
      disclaimer: "Une estimation indicative, pas une détection définitive.",
      errTooShort: 'Veuillez saisir au moins 30 caractères.',
      errTooLong: 'Texte trop long (8000 caractères maximum).',
      errGeneric: "Une erreur s'est produite pendant l'analyse, veuillez réessayer.",
      errAuth: 'Vous devez être connecté pour utiliser cet outil.',
    },
  };

  let lang = localStorage.getItem('aidetector:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), toolScreen: $('toolScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'),
    authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'),
    orDivider: $('orDivider'), acGoogleBtn: $('acGoogleBtn'), acGoogleText: $('acGoogleText'),
    toolTitle: $('toolTitle'), toolSub: $('toolSub'),
    inputText: $('inputText'), charCount: $('charCount'),
    analyzeBtn: $('analyzeBtn'), analyzeText: $('analyzeText'), toolError: $('toolError'),
    resultWrap: $('resultWrap'), gaugeFill: $('gaugeFill'), gaugePct: $('gaugePct'), gaugeLabel: $('gaugeLabel'),
    confidenceBadge: $('confidenceBadge'), reasoningText: $('reasoningText'), toolDisclaimer: $('toolDisclaimer'),
  };

  const GAUGE_CIRCUMFERENCE = 540;

  /* ================= Language ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle;
    els.lockedTitle.textContent = dict.lockedTitle;
    els.lockedSub.textContent = dict.lockedSub;
    els.tabLogin.textContent = dict.tabLogin;
    els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh;
    els.acEmail.placeholder = dict.emailPh;
    els.acPassword.placeholder = dict.passwordPh;
    els.orDivider.textContent = dict.or;
    els.acGoogleText.textContent = dict.googleBtn;
    els.toolTitle.textContent = dict.toolTitle;
    els.toolSub.textContent = dict.toolSub;
    els.inputText.placeholder = dict.inputPh;
    els.analyzeText.textContent = dict.analyze;
    els.gaugeLabel.textContent = dict.gaugeLabel;
    els.toolDisclaimer.textContent = dict.disclaimer;
    updateCharCount();

    const authMode = els.tabLogin.classList.contains('active') ? 'login' : 'signup';
    updateAuthFormMode(authMode);

    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('aidetector:lang', lang);
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

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

  /* ================= Screens ================= */
  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.toolScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ================= Auth ================= */
  const AUTH_ERR = {
    ar: {
      'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
      'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
      'auth/popup-closed-by-user': '', default: 'حدث خطأ، حاول مرة أخرى.',
    },
    en: {
      'auth/email-already-in-use': 'This email is already in use.', 'auth/invalid-email': 'Invalid email format.',
      'auth/weak-password': 'Password too weak (min 6 characters).', 'auth/wrong-password': 'Incorrect password.',
      'auth/user-not-found': 'No account found with this email.', 'auth/invalid-credential': 'Incorrect email or password.',
      'auth/popup-closed-by-user': '', default: 'Something went wrong, please try again.',
    },
    fr: {
      'auth/email-already-in-use': 'Cet e-mail est déjà utilisé.', 'auth/invalid-email': 'Format e-mail invalide.',
      'auth/weak-password': 'Mot de passe trop faible (6 caractères min).', 'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/user-not-found': 'Aucun compte trouvé avec cet e-mail.', 'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
      'auth/popup-closed-by-user': '', default: 'Une erreur est survenue, réessayez.',
    },
  };
  function authErrMsg(code) { return (AUTH_ERR[lang] && AUTH_ERR[lang][code]) || AUTH_ERR[lang].default; }
  function showAuthError(msg) {
    if (!msg) return;
    els.authCardError.textContent = msg;
    els.authCardError.classList.remove('hidden');
  }

  els.authCardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isLogin = els.tabLogin.classList.contains('active');
    const email = els.acEmail.value.trim();
    const password = els.acPassword.value;
    els.acSubmitBtn.disabled = true;
    try {
      if (isLogin) {
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (els.acName.value.trim()) await cred.user.updateProfile({ displayName: els.acName.value.trim() });
      }
    } catch (err) {
      showAuthError(authErrMsg(err.code));
    }
    els.acSubmitBtn.disabled = false;
  });

  els.acGoogleBtn.addEventListener('click', async () => {
    try {
      await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (err) {
      showAuthError(authErrMsg(err.code));
    }
  });

  /* ================= Tool logic ================= */
  function updateCharCount() {
    const len = els.inputText.value.length;
    els.charCount.textContent = `${len} / 8000`;
  }
  els.inputText.addEventListener('input', updateCharCount);

  function resetResult() {
    els.resultWrap.classList.add('hidden');
    els.gaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
    els.toolError.classList.add('hidden');
  }

  function showError(msg) {
    els.toolError.textContent = msg;
    els.toolError.classList.remove('hidden');
  }

  function gaugeColor(pct) {
    if (pct < 35) return '#2E8A5B';
    if (pct < 65) return '#BA7517';
    return '#C0392B';
  }

  function renderResult(percentage, confidence, reasoning) {
    els.resultWrap.classList.remove('hidden');
    const offset = GAUGE_CIRCUMFERENCE - (GAUGE_CIRCUMFERENCE * percentage) / 100;
    els.gaugeFill.style.stroke = gaugeColor(percentage);
    requestAnimationFrame(() => {
      els.gaugeFill.style.strokeDashoffset = offset;
    });
    els.gaugePct.textContent = `${percentage}%`;

    els.confidenceBadge.className = 'confidence-badge ' + confidence;
    const confKey = confidence === 'low' ? 'confLow' : confidence === 'high' ? 'confHigh' : 'confMedium';
    els.confidenceBadge.textContent = t(confKey);

    els.reasoningText.textContent = reasoning;
  }

  els.analyzeBtn.addEventListener('click', async () => {
    const text = els.inputText.value.trim();
    resetResult();

    if (text.length < 30) { showError(t('errTooShort')); return; }
    if (text.length > 8000) { showError(t('errTooLong')); return; }
    if (!window.fbFunctions || !window.fbAuth.currentUser) { showError(t('errAuth')); return; }

    els.analyzeBtn.disabled = true;
    els.analyzeText.textContent = t('analyzing');

    try {
      const callDetect = window.fbFunctions.httpsCallable('detectAiText');
      const res = await callDetect({ text, lang });
      const { percentage, confidence, reasoning } = res.data;
      renderResult(percentage, confidence, reasoning);
    } catch (err) {
      showError(err && err.message ? err.message : t('errGeneric'));
    }

    els.analyzeBtn.disabled = false;
    els.analyzeText.textContent = t('analyze');
  });

  /* ================= Auth state / Init ================= */
  applyLanguage();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
      if (fbUser) {
        showScreen('toolScreen');
      } else {
        showScreen('lockedScreen');
      }
    });
  } else {
    showScreen('lockedScreen');
  }
})();
