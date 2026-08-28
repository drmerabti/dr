// ============================================================
// app.js — AI to Humane (ar / en / fr)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'تحويل النص من آلي إلى بشري — أكاديمية مرابطي', topbarTitle: 'تحويل النص من آلي إلى بشري',
      lockedTitle: 'سجّل دخولك لاستخدام الأداة', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب',
      namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب',
      or: 'أو', googleBtn: 'المتابعة عبر Google',
      toolTitle: 'تحويل النص من آلي إلى بشري', toolSub: 'أعد صياغة نصك بأسلوب أكثر طبيعية، مع الحفاظ التام على المعنى الأصلي',
      inputLabel: 'النص الأصلي', inputPh: 'الصق النص هنا... (20 حرفًا على الأقل)',
      levelLabel: 'مستوى التغيير', levelLight: 'خفيف', levelMedium: 'متوسط', levelStrong: 'قوي',
      protectedLabel: 'كلمات محمية', optionalTag: '(اختياري)', protectedPh: 'اكتب كلمة واضغط Enter لإضافتها',
      rewrite: 'إعادة الصياغة', rewriting: 'جارِ إعادة الصياغة...',
      outputLabel: 'النص المُعاد صياغته', copy: 'نسخ', copied: 'تم النسخ!',
      compare: 'قارن نسبة الاحتمال قبل وبعد', comparing: 'جارِ الفحص...',
      before: 'قبل', after: 'بعد',
      disclaimer: 'أداة استرشادية لتحسين الأسلوب، تعتمد على الذكاء الاصطناعي وقد لا تكون النتيجة مثالية دائمًا.',
      errTooShort: 'الرجاء إدخال نص لا يقل عن 20 حرفًا.',
      errTooLong: 'النص طويل جدًا (الحد الأقصى 6000 حرف).',
      errGeneric: 'حدث خطأ أثناء إعادة الصياغة، حاول مرة أخرى.',
      errCompare: 'تعذّر إجراء المقارنة، حاول مرة أخرى.',
      errAuth: 'يجب تسجيل الدخول لاستخدام هذه الأداة.',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'AI to Humane — Merabti Academy', topbarTitle: 'AI to Humane',
      lockedTitle: 'Sign in to use the tool', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up',
      namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up',
      or: 'or', googleBtn: 'Continue with Google',
      toolTitle: 'AI to Humane', toolSub: 'Rewrite your text in a more natural style, while fully preserving its original meaning',
      inputLabel: 'Original text', inputPh: 'Paste your text here... (at least 20 characters)',
      levelLabel: 'Level of change', levelLight: 'Light', levelMedium: 'Medium', levelStrong: 'Strong',
      protectedLabel: 'Protected words', optionalTag: '(optional)', protectedPh: 'Type a word and press Enter to add it',
      rewrite: 'Rewrite', rewriting: 'Rewriting...',
      outputLabel: 'Rewritten text', copy: 'Copy', copied: 'Copied!',
      compare: 'Compare AI probability before/after', comparing: 'Checking...',
      before: 'Before', after: 'After',
      disclaimer: 'An indicative style-improvement tool powered by AI — results may not always be perfect.',
      errTooShort: 'Please enter at least 20 characters.',
      errTooLong: 'Text is too long (maximum 6000 characters).',
      errGeneric: 'Something went wrong while rewriting, please try again.',
      errCompare: 'Could not run the comparison, please try again.',
      errAuth: 'You must be signed in to use this tool.',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'IA vers Humain — Académie Merabti', topbarTitle: 'IA vers Humain',
      lockedTitle: "Connectez-vous pour utiliser l'outil", lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription',
      namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire",
      or: 'ou', googleBtn: 'Continuer avec Google',
      toolTitle: 'IA vers Humain', toolSub: 'Réécrivez votre texte dans un style plus naturel, en préservant totalement son sens original',
      inputLabel: 'Texte original', inputPh: 'Collez votre texte ici... (20 caractères minimum)',
      levelLabel: 'Niveau de changement', levelLight: 'Léger', levelMedium: 'Moyen', levelStrong: 'Fort',
      protectedLabel: 'Mots protégés', optionalTag: '(optionnel)', protectedPh: 'Tapez un mot et appuyez sur Entrée pour l\'ajouter',
      rewrite: 'Réécrire', rewriting: 'Réécriture en cours...',
      outputLabel: 'Texte réécrit', copy: 'Copier', copied: 'Copié !',
      compare: 'Comparer la probabilité IA avant/après', comparing: 'Vérification...',
      before: 'Avant', after: 'Après',
      disclaimer: "Un outil indicatif d'amélioration du style assisté par IA — le résultat n'est pas toujours parfait.",
      errTooShort: 'Veuillez saisir au moins 20 caractères.',
      errTooLong: 'Texte trop long (6000 caractères maximum).',
      errGeneric: "Une erreur s'est produite pendant la réécriture, veuillez réessayer.",
      errCompare: "Impossible d'effectuer la comparaison, veuillez réessayer.",
      errAuth: 'Vous devez être connecté pour utiliser cet outil.',
    },
  };

  let lang = localStorage.getItem('humanizer:lang') || 'ar';
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
    inputLabel: $('inputLabel'), inputText: $('inputText'), charCount: $('charCount'),
    levelLabel: $('levelLabel'), levelLight: $('levelLight'), levelMedium: $('levelMedium'), levelStrong: $('levelStrong'),
    levelBtns: document.querySelectorAll('.level-btn'),
    protectedLabel: $('protectedLabel'), optionalTag: $('optionalTag'),
    protectedInput: $('protectedInput'), protectedTags: $('protectedTags'),
    rewriteBtn: $('rewriteBtn'), rewriteText: $('rewriteText'), toolError: $('toolError'),
    outputWrap: $('outputWrap'), outputLabel: $('outputLabel'), outputText: $('outputText'),
    copyBtn: $('copyBtn'), copyText: $('copyText'),
    compareBtn: $('compareBtn'), compareText: $('compareText'), compareError: $('compareError'),
    compareWrap: $('compareWrap'), beforeLabel: $('beforeLabel'), afterLabel: $('afterLabel'),
    beforePct: $('beforePct'), afterPct: $('afterPct'), toolDisclaimer: $('toolDisclaimer'),
  };

  let level = 'medium';
  let protectedWords = [];

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
    els.inputLabel.textContent = dict.inputLabel;
    els.inputText.placeholder = dict.inputPh;
    els.levelLabel.textContent = dict.levelLabel;
    els.levelLight.textContent = dict.levelLight;
    els.levelMedium.textContent = dict.levelMedium;
    els.levelStrong.textContent = dict.levelStrong;
    els.protectedLabel.childNodes[0].textContent = dict.protectedLabel + ' ';
    els.optionalTag.textContent = dict.optionalTag;
    els.protectedInput.placeholder = dict.protectedPh;
    els.rewriteText.textContent = dict.rewrite;
    els.outputLabel.textContent = dict.outputLabel;
    els.copyText.textContent = dict.copy;
    els.compareText.textContent = dict.compare;
    els.beforeLabel.textContent = dict.before;
    els.afterLabel.textContent = dict.after;
    els.toolDisclaimer.textContent = dict.disclaimer;
    updateCharCount();

    const authMode = els.tabLogin.classList.contains('active') ? 'login' : 'signup';
    updateAuthFormMode(authMode);

    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('humanizer:lang', lang);
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

  /* ================= Level selector ================= */
  els.levelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      level = btn.getAttribute('data-level');
      els.levelBtns.forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  /* ================= Protected words ================= */
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function renderProtectedTags() {
    els.protectedTags.innerHTML = protectedWords.map((w, i) =>
      `<span class="tag-chip">${escapeHtml(w)}<button type="button" data-i="${i}">×</button></span>`
    ).join('');
    els.protectedTags.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        protectedWords.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
        renderProtectedTags();
      });
    });
  }
  els.protectedInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && els.protectedInput.value.trim()) {
      e.preventDefault();
      protectedWords.push(els.protectedInput.value.trim());
      els.protectedInput.value = '';
      renderProtectedTags();
    }
  });

  /* ================= Char count ================= */
  function updateCharCount() {
    els.charCount.textContent = `${els.inputText.value.length} / 6000`;
  }
  els.inputText.addEventListener('input', updateCharCount);

  /* ================= Rewrite ================= */
  function showToolError(msg) {
    els.toolError.textContent = msg;
    els.toolError.classList.remove('hidden');
  }

  els.rewriteBtn.addEventListener('click', async () => {
    const text = els.inputText.value.trim();
    els.toolError.classList.add('hidden');
    els.outputWrap.classList.add('hidden');
    els.compareWrap.classList.add('hidden');
    els.compareError.classList.add('hidden');

    if (text.length < 20) { showToolError(t('errTooShort')); return; }
    if (text.length > 6000) { showToolError(t('errTooLong')); return; }
    if (!window.fbFunctions || !window.fbAuth.currentUser) { showToolError(t('errAuth')); return; }

    els.rewriteBtn.disabled = true;
    els.rewriteText.textContent = t('rewriting');

    try {
      const call = window.fbFunctions.httpsCallable('humanizeText');
      const res = await call({ text, level, protectedWords });
      els.outputText.value = res.data.rewritten;
      els.outputWrap.classList.remove('hidden');
    } catch (err) {
      showToolError(err && err.message ? err.message : t('errGeneric'));
    }

    els.rewriteBtn.disabled = false;
    els.rewriteText.textContent = t('rewrite');
  });

  els.copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(els.outputText.value);
      const original = els.copyText.textContent;
      els.copyText.textContent = t('copied');
      setTimeout(() => { els.copyText.textContent = t('copy'); }, 1400);
    } catch (e) { /* ignore */ }
  });

  /* ================= Compare before/after ================= */
  els.compareBtn.addEventListener('click', async () => {
    const original = els.inputText.value.trim();
    const rewritten = els.outputText.value.trim();
    els.compareError.classList.add('hidden');
    els.compareWrap.classList.add('hidden');

    if (!window.fbFunctions || !window.fbAuth.currentUser) return;

    els.compareBtn.disabled = true;
    els.compareText.textContent = t('comparing');

    try {
      const call = window.fbFunctions.httpsCallable('detectAiText');
      const [beforeRes, afterRes] = await Promise.all([
        call({ text: original, lang }),
        call({ text: rewritten, lang }),
      ]);
      els.beforePct.textContent = `${beforeRes.data.percentage}%`;
      els.afterPct.textContent = `${afterRes.data.percentage}%`;
      els.compareWrap.classList.remove('hidden');
    } catch (err) {
      els.compareError.textContent = err && err.message ? err.message : t('errCompare');
      els.compareError.classList.remove('hidden');
    }

    els.compareBtn.disabled = false;
    els.compareText.textContent = t('compare');
  });

  /* ================= Auth state / Init ================= */
  applyLanguage();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
      showScreen(fbUser ? 'toolScreen' : 'lockedScreen');
    });
  } else {
    showScreen('lockedScreen');
  }
})();
