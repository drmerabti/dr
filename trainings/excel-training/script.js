// ============================================================
// script.js — Excel Training quiz engine (ar / en / fr)
// Same structure as trainings/word-training/script.js, plus:
// explanation after every answer, progress dots, review of
// wrong answers, retry, and time per question by level.
// ============================================================

(function () {
  "use strict";

  const QUESTIONS_PER_LEVEL = 30;
  const TIME_BY_LEVEL = { 1: 15, 2: 15, 3: 20, 4: 25, 5: 25 }; // seconds per question
  const LEVEL_MIN_LOGIN = 3;
  const CERT_MIN_PCT = 90;
  const PROGRESS_FIELD = 'excelTraining'; // users/{uid}.excelTraining.{level} = { best, lastPlayed }
  const LANG_KEY = 'excelTraining:lang';

  const UI = {
    ar: {
      dir: 'rtl', pageTitleTag: 'اختبار وتدريب مايكروسوفت إكسل Excel بالعربية — أكاديمية مرابطي', topbarTitle: 'تدريب شامل في إكسل',
      back: 'رجوع للموقع',
      pageTitle: 'اختر المستوى', pageSub: '5 مستويات، 30 سؤالًا لكل مستوى — من 15 إلى 25 ثانية للسؤال حسب المستوى، مع شرح بعد كل إجابة',
      formulaNote: '',
      levelLabels: { 1: 'أساسي', 2: 'أساسي متقدم', 3: 'متوسط', 4: 'متقدم', 5: 'احترافي' },
      levelTopics: {
        1: 'الواجهة، الخلايا، الإدخال والحفظ',
        2: 'التنسيق، الأرقام والتواريخ، SUM وAVERAGE',
        3: 'المراجع $، IF، COUNTIF، SUMIF، الفرز والتصفية',
        4: 'VLOOKUP وXLOOKUP، INDEX/MATCH، المخططات، التحقق',
        5: 'الجداول المحورية، الدوال المتداخلة، الحماية، الماكرو',
      },
      questionsCount: 'سؤال', secShort: 'ث', bestScore: 'أفضل نتيجة', loginRequired: 'يتطلب تسجيل الدخول',
      levelChip: (lvl) => `المستوى ${lvl}`,
      progressLabel: (i, n) => `سؤال ${i} من ${n}`,
      correct: '✓ إجابة صحيحة!', wrong: '✗ إجابة خاطئة', timeout: '⏰ انتهى الوقت',
      rightAnswer: 'الإجابة الصحيحة:', next: 'التالي', seeResult: 'عرض النتيجة', quit: 'إنهاء المحاولة',
      quitConfirm: 'هل تريد إنهاء هذه المحاولة؟ لن تُحفظ النتيجة.',
      lockedTitle: 'هذا المستوى يتطلب تسجيل الدخول',
      lockedMsg: 'سجّل دخولك من الصفحة الرئيسية لفتح المستويات 3، 4، و5، ولحفظ تقدمك.',
      goLogin: 'الذهاب لتسجيل الدخول', backToLevels: 'رجوع للمستويات', retry: 'أعد المحاولة',
      reviewShow: (n) => `راجع أخطاءك (${n})`, reviewHide: 'إخفاء المراجعة', reviewTitle: 'مراجعة الأسئلة الخاطئة',
      yourAnswer: 'إجابتك:', noAnswer: 'لم تُجب (انتهى الوقت)',
      resultLevel: (lvl, label) => `أنهيت المستوى ${lvl} (${label})`,
      resultScore: (score, total) => `${score} من ${total} إجابة صحيحة`,
      shareLabel: 'شارك إنجازك:',
      shareText: (lvl, pct) => `أنهيت المستوى ${lvl} من تدريب إكسل الشامل بنسبة ${pct}%! جرّب أنت كمان في أكاديمية مرابطي.`,
      titles: { excellent: 'ممتاز جدًا!', great: 'أحسنت!', good: 'جيد، واصل التدريب!', tryAgain: 'لا بأس، حاول مرة أخرى!' },
      certHintLogin: 'سجّل دخولك لتحصل على شهادة عند النجاح بنسبة 90% أو أكثر.',
      certHintPrev: 'للحصول على شهادة هذا المستوى، انجح أيضًا بنسبة 90% في كل المستويات السابقة.',
      getCertBtn: 'احصل على شهادتك',
      certModalTitle: 'بيانات الشهادة',
      certModalHint: 'هذه البيانات تُستخدم لإصدار شهادتك عند إنهاء أي مستوى بنجاح.',
      certFirstNamePh: 'الاسم الأول', certLastNamePh: 'اللقب',
      certContinue: 'متابعة',
      certPreviewTitle: 'شهادتك جاهزة!',
      certClose: 'إغلاق', certShare: 'مشاركة', certDownload: 'تحميل',
      certLevelLine: (lvl, label, pct) => `لإتمامه بتفوّق المستوى ${lvl} (${label}) من تدريب إكسل الشامل، بنسبة نجاح ${pct}٪`,
      footer: { copy: '© 2026 د. سفيان مرابطي', about: 'من نحن', contact: 'اتصل بنا', privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام' },
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Complete Excel Training & Quiz — Merabti Academy', topbarTitle: 'Complete Excel Training',
      back: 'Back to site',
      pageTitle: 'Choose a Level', pageSub: '5 levels, 30 questions each — 15 to 25 seconds per question depending on the level, with an explanation after every answer',
      formulaNote: '',
      levelLabels: { 1: 'Basic', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' },
      levelTopics: {
        1: 'Interface, cells, data entry & saving',
        2: 'Formatting, numbers & dates, SUM, AVERAGE',
        3: '$ references, IF, COUNTIF, SUMIF, sort & filter',
        4: 'VLOOKUP, XLOOKUP, INDEX/MATCH, charts, validation',
        5: 'PivotTables, nested functions, protection, macros',
      },
      questionsCount: 'questions', secShort: 's', bestScore: 'Best score', loginRequired: 'Requires login',
      levelChip: (lvl) => `Level ${lvl}`,
      progressLabel: (i, n) => `Question ${i} of ${n}`,
      correct: '✓ Correct!', wrong: '✗ Wrong answer', timeout: '⏰ Time is up',
      rightAnswer: 'Correct answer:', next: 'Next', seeResult: 'See result', quit: 'Quit attempt',
      quitConfirm: 'Quit this attempt? The score will not be saved.',
      lockedTitle: 'This level requires login',
      lockedMsg: 'Sign in from the homepage to unlock levels 3, 4, and 5, and to save your progress.',
      goLogin: 'Go to login', backToLevels: 'Back to levels', retry: 'Try again',
      reviewShow: (n) => `Review your mistakes (${n})`, reviewHide: 'Hide review', reviewTitle: 'Review of wrong answers',
      yourAnswer: 'Your answer:', noAnswer: 'No answer (time ran out)',
      resultLevel: (lvl, label) => `You finished Level ${lvl} (${label})`,
      resultScore: (score, total) => `${score} out of ${total} correct`,
      shareLabel: 'Share your achievement:',
      shareText: (lvl, pct) => `I finished Level ${lvl} of the Complete Excel Training with ${pct}%! Try it yourself at Merabti Academy.`,
      titles: { excellent: 'Excellent!', great: 'Well done!', good: 'Good, keep practicing!', tryAgain: 'No worries, try again!' },
      certHintLogin: 'Sign in to get a certificate when you score 90% or more.',
      certHintPrev: 'To get this level\'s certificate, also pass every previous level with 90% or more.',
      getCertBtn: 'Get your certificate',
      certModalTitle: 'Certificate details',
      certModalHint: 'This info is used to issue your certificate whenever you pass a level.',
      certFirstNamePh: 'First name', certLastNamePh: 'Last name',
      certContinue: 'Continue',
      certPreviewTitle: 'Your certificate is ready!',
      certClose: 'Close', certShare: 'Share', certDownload: 'Download',
      certLevelLine: (lvl, label, pct) => `For successfully completing Level ${lvl} (${label}) of the Complete Excel Training, with a score of ${pct}%`,
      footer: { copy: '© 2026 Dr Soufiane Merabti', about: 'About', contact: 'Contact', privacy: 'Privacy policy', terms: 'Terms of service' },
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Formation complète Excel & quiz — Académie Merabti', topbarTitle: 'Formation complète Excel',
      back: 'Retour au site',
      pageTitle: 'Choisissez un niveau', pageSub: '5 niveaux, 30 questions chacun — de 15 à 25 secondes par question selon le niveau, avec une explication après chaque réponse',
      formulaNote: 'Les formules sont écrites avec les noms anglais d\'Excel et la virgule comme séparateur. Dans Excel en français : SUM = SOMME, IF = SI, COUNTIF = NB.SI, VLOOKUP = RECHERCHEV, XLOOKUP = RECHERCHEX, MATCH = EQUIV… et le point-virgule « ; » sépare les arguments.',
      levelLabels: { 1: 'Basique', 2: 'Élémentaire', 3: 'Intermédiaire', 4: 'Avancé', 5: 'Expert' },
      levelTopics: {
        1: 'Interface, cellules, saisie et enregistrement',
        2: 'Mise en forme, nombres et dates, SUM, AVERAGE',
        3: 'Références $, IF, COUNTIF, SUMIF, tri et filtre',
        4: 'VLOOKUP, XLOOKUP, INDEX/MATCH, graphiques, validation',
        5: 'TCD, fonctions imbriquées, protection, macros',
      },
      questionsCount: 'questions', secShort: 's', bestScore: 'Meilleur score', loginRequired: 'Connexion requise',
      levelChip: (lvl) => `Niveau ${lvl}`,
      progressLabel: (i, n) => `Question ${i} sur ${n}`,
      correct: '✓ Bonne réponse !', wrong: '✗ Mauvaise réponse', timeout: '⏰ Temps écoulé',
      rightAnswer: 'Bonne réponse :', next: 'Suivant', seeResult: 'Voir le résultat', quit: 'Abandonner',
      quitConfirm: 'Abandonner cette tentative ? Le score ne sera pas enregistré.',
      lockedTitle: 'Ce niveau nécessite une connexion',
      lockedMsg: "Connectez-vous depuis la page d'accueil pour débloquer les niveaux 3, 4 et 5, et sauvegarder votre progression.",
      goLogin: 'Aller à la connexion', backToLevels: 'Retour aux niveaux', retry: 'Réessayer',
      reviewShow: (n) => `Revoir vos erreurs (${n})`, reviewHide: 'Masquer la révision', reviewTitle: 'Révision des mauvaises réponses',
      yourAnswer: 'Votre réponse :', noAnswer: 'Pas de réponse (temps écoulé)',
      resultLevel: (lvl, label) => `Vous avez terminé le niveau ${lvl} (${label})`,
      resultScore: (score, total) => `${score} sur ${total} bonnes réponses`,
      shareLabel: 'Partagez votre réussite :',
      shareText: (lvl, pct) => `J'ai terminé le niveau ${lvl} de la formation complète Excel avec ${pct} % ! Essayez à votre tour sur Académie Merabti.`,
      titles: { excellent: 'Excellent !', great: 'Bien joué !', good: 'Bien, continuez à vous entraîner !', tryAgain: 'Pas grave, réessayez !' },
      certHintLogin: 'Connectez-vous pour obtenir un certificat avec un score de 90 % ou plus.',
      certHintPrev: 'Pour obtenir le certificat de ce niveau, réussissez aussi chaque niveau précédent avec 90 % ou plus.',
      getCertBtn: 'Obtenir votre certificat',
      certModalTitle: 'Informations du certificat',
      certModalHint: 'Ces informations servent à établir votre certificat chaque fois que vous réussissez un niveau.',
      certFirstNamePh: 'Prénom', certLastNamePh: 'Nom',
      certContinue: 'Continuer',
      certPreviewTitle: 'Votre certificat est prêt !',
      certClose: 'Fermer', certShare: 'Partager', certDownload: 'Télécharger',
      footer: { copy: '© 2026 Dr Soufiane Merabti', about: 'À propos', contact: 'Contact', privacy: 'Confidentialité', terms: 'Conditions' },
    },
  };

  let lang = 'ar';
  try { lang = localStorage.getItem(LANG_KEY) || 'ar'; } catch (e) { /* storage blocked */ }
  if (!UI[lang]) lang = 'ar';

  /* ---------------- Helpers ---------------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  // Escapes the text, then shows {{formula}} as left-to-right code.
  function fmt(s) {
    return esc(s).replace(/\{\{(.+?)\}\}/g, '<span class="f" dir="ltr">$1</span>');
  }
  // Options that are pure formulas / keys / extensions read better left-to-right.
  function fmtOption(s) {
    if (/^\{\{.*\}\}$/.test(s)) return fmt(s);
    if (/^[\x20-\x7E→←↑↓]+$/.test(s) && /[=+$#.:!<>^]|^[A-Z]{1,3}\d*$|^\d/.test(s)) return `<span dir="ltr">${esc(s)}</span>`;
    return fmt(s);
  }
  function safeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

  function buildLevelQuestions(level) {
    const pool = EXCEL_Q.filter((q) => q.level === level);
    return shuffle(pool).slice(0, QUESTIONS_PER_LEVEL).map((item) => {
      const loc = item[lang];
      const order = shuffle(loc.o.map((opt, i) => ({ opt, isCorrect: i === 0 }))); // o[0] is the right answer
      return {
        q: loc.q,
        options: order.map((o) => o.opt),
        correct: order.findIndex((o) => o.isCorrect),
        exp: loc.e,
      };
    });
  }

  /* ---------------- Auth (Firebase, shared with the main site) ---------------- */
  function getCurrentUser() {
    // Instant cache for first paint; kept in sync by onAuthStateChanged below.
    try { return JSON.parse(localStorage.getItem('site_user')); } catch (e) { return null; }
  }
  function isLoggedIn() {
    return !!(window.fbAuth && window.fbAuth.currentUser);
  }
  function userDocRef() {
    const fbUser = window.fbAuth && window.fbAuth.currentUser;
    if (!fbUser || !window.fbDb) return null;
    return window.fbDb.collection('users').doc(fbUser.uid);
  }

  /* ---------------- Progress + certificate name (one Firestore read) ---------------- */
  let progressCache = {}; // { 1: {best, lastPlayed}, ... }
  let certName = null;    // { first, last, lang } — shared with the Word training

  async function loadUserData() {
    const ref = userDocRef();
    if (!ref) { progressCache = {}; certName = null; return; }
    try {
      const doc = await ref.get();
      const data = doc.exists ? doc.data() : {};
      progressCache = data[PROGRESS_FIELD] || {};
      certName = data.certName || null;
    } catch (e) {
      progressCache = {};
      certName = null;
    }
  }

  async function saveProgress(level, pct) {
    const ref = userDocRef();
    if (!ref) return; // not logged in — nothing to save

    const prevBest = progressCache[level] ? progressCache[level].best : 0;
    const best = Math.max(prevBest, pct);
    progressCache[level] = { best, lastPlayed: Date.now() };

    const update = {};
    update[`${PROGRESS_FIELD}.${level}`] = { best, lastPlayed: firebase.firestore.FieldValue.serverTimestamp() };
    try {
      await ref.set(update, { merge: true });
    } catch (e) {
      // Offline or permission issue — progress stays in memory for this session only.
    }
  }

  async function saveCertName(first, last, clang) {
    certName = { first, last, lang: clang };
    const ref = userDocRef();
    if (!ref) return;
    try { await ref.set({ certName }, { merge: true }); } catch (e) { /* ignore */ }
  }

  /* ---------------- DOM refs ---------------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'), backBtn: $('backBtn'),
    langBtns: document.querySelectorAll('.lang-btn'),
    levelSelectScreen: $('levelSelectScreen'), quizScreen: $('quizScreen'),
    resultScreen: $('resultScreen'), lockedScreen: $('lockedScreen'),
    pageTitle: $('pageTitle'), pageSub: $('pageSub'), levelsGrid: $('levelsGrid'), formulaNote: $('formulaNote'),
    levelChip: $('levelChip'), scoreChip: $('scoreChip'),
    timerDisplay: $('timerDisplay'), timerText: $('timerText'), timeFill: $('timeFill'),
    progressDots: $('progressDots'), progressLabel: $('progressLabel'),
    questionText: $('questionText'), optionsGrid: $('optionsGrid'),
    feedback: $('feedback'), fbStatus: $('fbStatus'), fbAnswer: $('fbAnswer'), fbExp: $('fbExp'), nextBtn: $('nextBtn'),
    quitBtn: $('quitBtn'),
    resultEmoji: $('resultEmoji'), resultTitle: $('resultTitle'), resultMsg: $('resultMsg'),
    resultPct: $('resultPct'), resultScore: $('resultScore'), certHint: $('certHint'),
    reviewBtn: $('reviewBtn'), retryBtn: $('retryBtn'), backToLevelsBtn: $('backToLevelsBtn'),
    reviewBox: $('reviewBox'), reviewTitle: $('reviewTitle'), reviewList: $('reviewList'),
    lockedBackBtn: $('lockedBackBtn'), lockedTitle: $('lockedTitle'), lockedMsg: $('lockedMsg'), goLoginBtn: $('goLoginBtn'),
    shareLabel: $('shareLabel'), shareWhatsapp: $('shareWhatsapp'), shareTelegram: $('shareTelegram'),
    getCertBtn: $('getCertBtn'), getCertText: $('getCertText'),
    certNameOverlay: $('certNameOverlay'), certNameTitle: $('certNameTitle'), certNameHint: $('certNameHint'),
    certFirstName: $('certFirstName'), certLastName: $('certLastName'), certLangRow: $('certLangRow'),
    certNameContinueBtn: $('certNameContinueBtn'),
    certPreviewOverlay: $('certPreviewOverlay'), certPreviewTitle: $('certPreviewTitle'), certPreviewImg: $('certPreviewImg'),
    certCloseBtn: $('certCloseBtn'), certShareBtn: $('certShareBtn'), certShareText: $('certShareText'),
    certDownloadBtn: $('certDownloadBtn'), certDownloadText: $('certDownloadText'),
    fCopy: $('fCopy'), fAbout: $('fAbout'), fContact: $('fContact'), fPrivacy: $('fPrivacy'), fTerms: $('fTerms'),
  };

  function showScreen(name) {
    [els.levelSelectScreen, els.quizScreen, els.resultScreen, els.lockedScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  /* ---------------- Language ---------------- */
  function applyLanguage() {
    const t = UI[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', t.dir);
    els.pageTitleTag.textContent = t.pageTitleTag;
    document.title = t.pageTitleTag;
    els.topbarTitle.textContent = t.topbarTitle;
    els.backBtn.setAttribute('aria-label', t.back);
    els.backBtn.setAttribute('title', t.back);
    els.pageTitle.textContent = t.pageTitle;
    els.pageSub.textContent = t.pageSub;
    els.formulaNote.textContent = t.formulaNote;
    els.lockedTitle.textContent = t.lockedTitle;
    els.lockedMsg.textContent = t.lockedMsg;
    els.goLoginBtn.textContent = t.goLogin;
    els.lockedBackBtn.textContent = t.backToLevels;
    els.backToLevelsBtn.textContent = t.backToLevels;
    els.retryBtn.textContent = t.retry;
    els.quitBtn.textContent = t.quit;
    els.shareLabel.textContent = t.shareLabel;
    els.fCopy.textContent = t.footer.copy;
    els.fAbout.textContent = t.footer.about;
    els.fContact.textContent = t.footer.contact;
    els.fPrivacy.textContent = t.footer.privacy;
    els.fTerms.textContent = t.footer.terms;

    els.langBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    safeSet(LANG_KEY, lang);
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-lang');
      if (next === lang) return;
      lang = next;
      stopTimer();
      quizState = null;
      applyLanguage();
      renderLevels();
      showScreen('levelSelectScreen');
    });
  });

  /* ---------------- Level select screen ---------------- */
  function renderLevels() {
    const t = UI[lang];
    const user = getCurrentUser();
    const progress = progressCache;
    let html = '';
    for (let lvl = 1; lvl <= 5; lvl++) {
      const locked = lvl >= LEVEL_MIN_LOGIN && !user;
      const best = progress[lvl] ? progress[lvl].best : null;
      const passed = best !== null && best >= CERT_MIN_PCT;
      html += `
        <button type="button" class="level-card ${locked ? 'locked' : ''} ${passed ? 'passed' : ''}" data-level="${lvl}">
          ${locked ? '<span class="level-lock">🔒</span>' : ''}
          <span class="level-num">${lvl}</span>
          <p class="level-label">${t.levelLabels[lvl]}</p>
          <p class="level-topics">${esc(t.levelTopics[lvl])}</p>
          <p class="level-meta">${QUESTIONS_PER_LEVEL} ${t.questionsCount} · ${TIME_BY_LEVEL[lvl]} ${t.secShort}</p>
          ${best !== null ? `<p class="level-best">${t.bestScore}: ${best}%</p>` : ''}
          ${locked ? `<p class="level-locked-text">${t.loginRequired}</p>` : ''}
        </button>`;
    }
    els.levelsGrid.innerHTML = html;

    els.levelsGrid.querySelectorAll('.level-card').forEach((card) => {
      card.addEventListener('click', () => {
        const lvl = parseInt(card.getAttribute('data-level'), 10);
        if (card.classList.contains('locked')) {
          showScreen('lockedScreen');
          return;
        }
        startLevel(lvl);
      });
    });
  }

  /* ---------------- Certificate ---------------- */
  const CERT_TEMPLATES = {
    ar: {
      src: 'certs/cert-ar.jpg',
      nameY: 0.572, levelY: 0.698, dateY: 0.838, dateX: 0.746,
      nameFont: 'bold 46px Tajawal, sans-serif',
      lineFont: '22px Tajawal, sans-serif',
      dateFont: 'bold 20px Tajawal, sans-serif',
      color: '#1E2F40', dir: 'rtl',
    },
    en: {
      src: 'certs/cert-en.jpg',
      nameY: 0.612, levelY: 0.682, dateY: 0.80, dateX: 0.73,
      nameFont: 'bold 58px "Times New Roman", serif',
      lineFont: '26px Georgia, serif',
      dateFont: 'bold 24px Georgia, serif',
      color: '#1E2F40', dir: 'ltr',
    },
  };

  let certLangChoice = 'ar';
  els.certLangRow.querySelectorAll('.cert-lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      certLangChoice = btn.getAttribute('data-clang');
      els.certLangRow.querySelectorAll('.cert-lang-btn').forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  let certNameDone = null;
  function openCertNameModal(onDone) {
    const t = UI[lang];
    els.certNameTitle.textContent = t.certModalTitle;
    els.certNameHint.textContent = t.certModalHint;
    els.certFirstName.placeholder = t.certFirstNamePh;
    els.certLastName.placeholder = t.certLastNamePh;
    els.certNameContinueBtn.textContent = t.certContinue;
    els.certFirstName.value = certName ? certName.first : '';
    els.certLastName.value = certName ? certName.last : '';
    els.certFirstName.classList.remove('invalid');
    els.certLastName.classList.remove('invalid');
    certLangChoice = (certName && certName.lang) || (lang === 'en' || lang === 'fr' ? 'en' : 'ar');
    els.certLangRow.querySelectorAll('.cert-lang-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-clang') === certLangChoice);
    });
    certNameDone = onDone;
    els.certNameOverlay.classList.remove('hidden');
    els.certFirstName.focus();
  }

  els.certNameContinueBtn.addEventListener('click', async () => {
    const first = els.certFirstName.value.trim();
    const last = els.certLastName.value.trim();
    els.certFirstName.classList.toggle('invalid', !first);
    els.certLastName.classList.toggle('invalid', !last);
    if (!first || !last) return;
    await saveCertName(first, last, certLangChoice);
    els.certNameOverlay.classList.add('hidden');
    const done = certNameDone;
    certNameDone = null;
    if (done) done();
  });

  function previousLevelsPassed(level) {
    for (let i = 1; i < level; i++) {
      const p = progressCache[i];
      if (!p || p.best < CERT_MIN_PCT) return false;
    }
    return true;
  }
  function canGetCertificate(level, pct) {
    return isLoggedIn() && pct >= CERT_MIN_PCT && previousLevelsPassed(level);
  }

  function formatCertDate() {
    const locale = certName && certName.lang === 'en' ? 'en-US' : 'ar';
    return new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    words.forEach((word) => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  }

  let lastCertCanvas = null;

  async function generateCertificate(level, pct) {
    if (!certName) return null;
    const clang = certName.lang === 'en' ? 'en' : 'ar';
    const cfg = CERT_TEMPLATES[clang];
    const t = UI[clang];

    if (document.fonts && document.fonts.load) {
      try { await document.fonts.load(cfg.nameFont); await document.fonts.load(cfg.lineFont); } catch (e) { /* ignore */ }
    }

    const img = await loadImage(cfg.src);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    ctx.direction = cfg.dir;
    ctx.textAlign = 'center';
    ctx.fillStyle = cfg.color;

    ctx.font = cfg.nameFont;
    ctx.fillText(`${certName.first} ${certName.last}`, canvas.width / 2, canvas.height * cfg.nameY);

    ctx.font = cfg.lineFont;
    wrapCanvasText(ctx, t.certLevelLine(level, t.levelLabels[level], pct), canvas.width / 2, canvas.height * cfg.levelY, canvas.width * 0.72, 34);

    ctx.font = cfg.dateFont;
    ctx.fillText(formatCertDate(), canvas.width * cfg.dateX, canvas.height * cfg.dateY);

    lastCertCanvas = canvas;
    return canvas;
  }

  async function showCertificate() {
    const t = UI[lang];
    els.getCertText.textContent = '…';
    els.getCertBtn.disabled = true;
    try {
      const canvas = await generateCertificate(lastResult.level, lastResult.pct);
      if (canvas) {
        els.certPreviewTitle.textContent = t.certPreviewTitle;
        els.certCloseBtn.textContent = t.certClose;
        els.certShareText.textContent = t.certShare;
        els.certDownloadText.textContent = t.certDownload;
        els.certPreviewImg.src = canvas.toDataURL('image/png');
        els.certPreviewOverlay.classList.remove('hidden');
      }
    } catch (e) { /* ignore */ }
    els.getCertText.textContent = t.getCertBtn;
    els.getCertBtn.disabled = false;
  }

  els.getCertBtn.addEventListener('click', () => {
    if (!certName) openCertNameModal(showCertificate);
    else showCertificate();
  });

  els.certCloseBtn.addEventListener('click', () => els.certPreviewOverlay.classList.add('hidden'));

  els.certDownloadBtn.addEventListener('click', () => {
    if (!lastCertCanvas) return;
    const a = document.createElement('a');
    a.download = `excel-certificate-level-${lastResult ? lastResult.level : ''}.png`;
    a.href = lastCertCanvas.toDataURL('image/png');
    a.click();
  });

  els.certShareBtn.addEventListener('click', () => {
    if (!lastCertCanvas) return;
    lastCertCanvas.toBlob(async (blob) => {
      const file = new File([blob], 'excel-certificate.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'Certificate' }); } catch (e) { /* user cancelled */ }
      } else {
        const a = document.createElement('a');
        a.download = 'excel-certificate.png';
        a.href = URL.createObjectURL(blob);
        a.click();
      }
    }, 'image/png');
  });

  /* ---------------- Quiz ---------------- */
  let quizState = null;   // { level, questions, idx, score, answers[], answered }
  let lastResult = null;  // { level, pct, wrong[] }
  let timerInterval = null;

  function startLevel(level) {
    if (level >= LEVEL_MIN_LOGIN && !getCurrentUser() && !isLoggedIn()) {
      showScreen('lockedScreen');
      return;
    }
    if (isLoggedIn() && !certName) {
      openCertNameModal(() => actuallyStartLevel(level));
      return;
    }
    actuallyStartLevel(level);
  }

  function actuallyStartLevel(level) {
    const questions = buildLevelQuestions(level);
    quizState = { level, questions, idx: 0, score: 0, answers: [], answered: false };
    els.levelChip.textContent = UI[lang].levelChip(level);
    els.progressDots.innerHTML = questions.map(() => '<span></span>').join('');
    els.reviewBox.classList.add('hidden');
    showScreen('quizScreen');
    renderQuestion();
  }

  function renderQuestion() {
    const t = UI[lang];
    const { questions, idx } = quizState;
    const total = questions.length;
    const q = questions[idx];

    els.progressLabel.textContent = t.progressLabel(idx + 1, total);
    els.scoreChip.textContent = `✓ ${quizState.score}`;
    const dots = els.progressDots.children;
    for (let i = 0; i < dots.length; i++) dots[i].classList.toggle('cur', i === idx);

    els.questionText.innerHTML = fmt(q.q);
    els.optionsGrid.innerHTML = q.options
      .map((opt, i) => `<button type="button" class="option-btn" data-i="${i}"><span class="option-key">${i + 1}</span><span class="option-txt">${fmtOption(opt)}</span></button>`)
      .join('');
    els.optionsGrid.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.getAttribute('data-i'), 10)));
    });

    els.feedback.classList.add('hidden');
    quizState.answered = false;
    startTimer();
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function startTimer() {
    stopTimer();
    const limit = TIME_BY_LEVEL[quizState.level];
    let remaining = limit;
    const urgentAt = limit >= 20 ? 5 : 3;
    els.timerDisplay.classList.remove('urgent', 'paused');
    els.timeFill.classList.remove('urgent');
    // reset the bar instantly, then let it shrink smoothly
    els.timeFill.style.transition = 'none';
    els.timeFill.style.width = '100%';
    void els.timeFill.offsetWidth;
    els.timeFill.style.transition = '';
    updateTimerDisplay(remaining, limit);

    timerInterval = setInterval(() => {
      remaining--;
      updateTimerDisplay(remaining, limit);
      if (remaining <= urgentAt) {
        els.timerDisplay.classList.add('urgent');
        els.timeFill.classList.add('urgent');
      }
      if (remaining <= 0) {
        stopTimer();
        handleAnswer(-1);
      }
    }, 1000);
  }

  function updateTimerDisplay(seconds, limit) {
    const s = Math.max(0, seconds);
    els.timerText.textContent = `00:${String(s).padStart(2, '0')}`;
    els.timeFill.style.width = `${(s / limit) * 100}%`;
  }

  function handleAnswer(selectedIdx) {
    if (!quizState || quizState.answered) return;
    quizState.answered = true;
    stopTimer();
    els.timerDisplay.classList.remove('urgent');
    els.timerDisplay.classList.add('paused');

    const t = UI[lang];
    const q = quizState.questions[quizState.idx];
    const isRight = selectedIdx === q.correct;
    if (isRight) quizState.score++;
    quizState.answers.push({ q, selected: selectedIdx, isRight });

    els.optionsGrid.querySelectorAll('.option-btn').forEach((btn, i) => {
      if (i === q.correct) btn.classList.add('correct');
      else if (i === selectedIdx) btn.classList.add('wrong');
      else btn.classList.add('dim');
      btn.disabled = true;
    });

    els.progressDots.children[quizState.idx].classList.add(isRight ? 'ok' : 'ko');
    els.scoreChip.textContent = `✓ ${quizState.score}`;

    els.feedback.classList.toggle('is-wrong', !isRight);
    els.fbStatus.textContent = isRight ? t.correct : (selectedIdx === -1 ? t.timeout : t.wrong);
    els.fbAnswer.innerHTML = isRight ? '' : `${esc(t.rightAnswer)} ${fmtOption(q.options[q.correct])}`;
    els.fbExp.innerHTML = fmt(q.exp);
    const isLast = quizState.idx >= quizState.questions.length - 1;
    els.nextBtn.textContent = isLast ? t.seeResult : t.next;
    els.feedback.classList.remove('hidden');
    els.nextBtn.focus({ preventScroll: true });
    if (window.matchMedia('(max-width: 640px)').matches) {
      els.feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function goNext() {
    if (!quizState || !quizState.answered) return;
    quizState.idx++;
    if (quizState.idx >= quizState.questions.length) finishLevel();
    else {
      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  els.nextBtn.addEventListener('click', goNext);

  els.quitBtn.addEventListener('click', () => {
    if (!quizState) return;
    if (quizState.answers.length > 0 && !window.confirm(UI[lang].quitConfirm)) return;
    stopTimer();
    quizState = null;
    renderLevels();
    showScreen('levelSelectScreen');
  });

  // Keyboard: 1-4 to answer, Enter to continue
  document.addEventListener('keydown', (e) => {
    if (!quizState || els.quizScreen.classList.contains('hidden')) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (!quizState.answered) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= quizState.questions[quizState.idx].options.length) {
        e.preventDefault();
        handleAnswer(n - 1);
      }
    } else if (e.key === 'Enter' && document.activeElement !== els.nextBtn) {
      e.preventDefault();
      goNext();
    }
  });

  function finishLevel() {
    stopTimer();
    const t = UI[lang];
    const { level, score, answers } = quizState;
    const total = quizState.questions.length;
    const pct = Math.round((score / total) * 100);
    lastResult = { level, pct, wrong: answers.filter((a) => !a.isRight) };
    quizState = null;

    saveProgress(level, pct);

    let emoji, title;
    if (pct >= 90) { emoji = '🏆'; title = t.titles.excellent; }
    else if (pct >= 70) { emoji = '🎉'; title = t.titles.great; }
    else if (pct >= 50) { emoji = '👍'; title = t.titles.good; }
    else { emoji = '💪'; title = t.titles.tryAgain; }

    els.resultEmoji.textContent = emoji;
    els.resultTitle.textContent = title;
    els.resultMsg.textContent = t.resultLevel(level, t.levelLabels[level]);
    els.resultPct.textContent = `${pct}%`;
    els.resultScore.textContent = t.resultScore(score, total);

    const certOk = canGetCertificate(level, pct);
    els.getCertBtn.classList.toggle('hidden', !certOk);
    els.getCertText.textContent = t.getCertBtn;
    let hint = '';
    if (!certOk && pct >= CERT_MIN_PCT) hint = isLoggedIn() ? t.certHintPrev : t.certHintLogin;
    els.certHint.textContent = hint;
    els.certHint.classList.toggle('hidden', !hint);

    renderReview();

    const shareText = encodeURIComponent(t.shareText(level, pct));
    const shareLink = encodeURIComponent(location.origin + location.pathname);
    els.shareWhatsapp.href = `https://wa.me/?text=${shareText}%20${shareLink}`;
    els.shareTelegram.href = `https://t.me/share/url?url=${shareLink}&text=${shareText}`;

    showScreen('resultScreen');
  }

  /* ---------------- Review of wrong answers ---------------- */
  function renderReview() {
    const t = UI[lang];
    const wrong = lastResult.wrong;
    els.reviewBox.classList.add('hidden');
    els.reviewBtn.classList.toggle('hidden', wrong.length === 0);
    els.reviewBtn.textContent = t.reviewShow(wrong.length);
    els.reviewTitle.textContent = t.reviewTitle;
    els.reviewList.innerHTML = wrong.map(({ q, selected }) => `
      <li class="review-item">
        <p class="review-q">${fmt(q.q)}</p>
        <p class="review-row yours"><b>${esc(t.yourAnswer)}</b> ${selected === -1 ? esc(t.noAnswer) : fmtOption(q.options[selected])}</p>
        <p class="review-row right"><b>${esc(t.rightAnswer)}</b> ${fmtOption(q.options[q.correct])}</p>
        <p class="review-exp">${fmt(q.exp)}</p>
      </li>`).join('');
  }

  els.reviewBtn.addEventListener('click', () => {
    const t = UI[lang];
    const open = els.reviewBox.classList.toggle('hidden') === false;
    els.reviewBtn.textContent = open ? t.reviewHide : t.reviewShow(lastResult.wrong.length);
    if (open) els.reviewBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.retryBtn.addEventListener('click', () => {
    if (lastResult) startLevel(lastResult.level);
  });
  els.backToLevelsBtn.addEventListener('click', () => {
    renderLevels();
    showScreen('levelSelectScreen');
  });
  els.lockedBackBtn.addEventListener('click', () => {
    showScreen('levelSelectScreen');
  });

  /* ---------------- Init ---------------- */
  applyLanguage();
  renderLevels(); // instant paint using cached local user (if any)
  showScreen('levelSelectScreen');

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        safeSet('site_user', JSON.stringify({
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          picture: fbUser.photoURL || null,
        }));
        await loadUserData();
      } else {
        try { localStorage.removeItem('site_user'); } catch (e) { /* ignore */ }
        progressCache = {};
        certName = null;
      }
      // don't repaint the level grid under a running quiz
      if (!els.levelSelectScreen.classList.contains('hidden')) renderLevels();
    });
  }
})();
