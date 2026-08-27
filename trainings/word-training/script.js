// ============================================================
// script.js — Word Training quiz engine (ar / en / fr)
// ============================================================

(function () {
  "use strict";

  const QUESTIONS_PER_LEVEL = 30;
  const GENERAL_PER_LEVEL = 15;
  const SHORTCUT_PER_LEVEL = 15;
  const REPEAT_COUNT = 4; // questions repeated from the previous level
  const TIME_PER_QUESTION = 15; // seconds
  const LEVEL_MIN_LOGIN = 3;

  const UI = {
    ar: {
      dir: 'rtl', pageTitleTag: 'تدريب شامل في وورد — أكاديمية مرابطي', topbarTitle: 'تدريب شامل في وورد',
      pageTitle: 'اختر المستوى', pageSub: '5 مستويات، 30 سؤال لكل مستوى — كل سؤال 15 ثانية',
      levelLabels: { 1: 'أساسي', 2: 'أساسي متقدم', 3: 'متوسط', 4: 'متقدم', 5: 'احترافي' },
      questionsCount: 'سؤال', bestScore: 'أفضل نتيجة', loginRequired: 'يتطلب تسجيل الدخول',
      progressLabel: (i, n) => `سؤال ${i} من ${n}`,
      lockedTitle: 'هذا المستوى يتطلب تسجيل الدخول',
      lockedMsg: 'سجّل دخولك من الصفحة الرئيسية لفتح المستويات 3، 4، و5، ولحفظ تقدمك.',
      goLogin: 'الذهاب لتسجيل الدخول', backToLevels: 'رجوع للمستويات',
      resultLevel: (lvl, label) => `أنهيت المستوى ${lvl} (${label})`,
      resultScore: (score, total) => `${score} من ${total} إجابة صحيحة`,
      shareLabel: 'شارك إنجازك:',
      shareText: (lvl, pct) => `أنهيت المستوى ${lvl} من تدريب وورد بنسبة ${pct}%! جرّب أنت كمان في أكاديمية مرابطي.`,
      titles: { excellent: 'ممتاز جدًا!', great: 'أحسنت!', good: 'جيد، واصل التدريب!', tryAgain: 'لا بأس، حاول مرة أخرى!' },
      qShortcutFunc: (keys) => `ماذا يفعل الاختصار <span class="kbd-inline">${keys.join('+')}</span> ؟`,
      qShortcutKeys: (name) => `ما هو اختصار: "${name}" ؟`,
      getCertBtn: 'احصل على شهادتك',
      certModalTitle: 'بيانات الشهادة',
      certModalHint: 'هذه البيانات تُستخدم لإصدار شهادتك عند إنهاء أي مستوى بنجاح.',
      certFirstNamePh: 'الاسم الأول', certLastNamePh: 'اللقب',
      certContinue: 'متابعة',
      certPreviewTitle: 'شهادتك جاهزة!',
      certClose: 'إغلاق', certShare: 'مشاركة', certDownload: 'تحميل',
      certName: 'تُمنح هذه الشهادة إلى', certPresented: 'فخورون بمنح هذه الشهادة إلى',
      certLevelLine: (lvl, label, pct) => `لإتمامه بتفوّق المستوى ${lvl} (${label}) من تدريب وورد الشامل، بنسبة نجاح ${pct}٪`,
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Complete Word Training — Merabti Academy', topbarTitle: 'Complete Word Training',
      pageTitle: 'Choose a Level', pageSub: '5 levels, 30 questions each — 15 seconds per question',
      levelLabels: { 1: 'Basic', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' },
      questionsCount: 'questions', bestScore: 'Best score', loginRequired: 'Requires login',
      progressLabel: (i, n) => `Question ${i} of ${n}`,
      lockedTitle: 'This level requires login',
      lockedMsg: 'Sign in from the homepage to unlock levels 3, 4, and 5, and to save your progress.',
      goLogin: 'Go to login', backToLevels: 'Back to levels',
      resultLevel: (lvl, label) => `You finished Level ${lvl} (${label})`,
      resultScore: (score, total) => `${score} out of ${total} correct`,
      shareLabel: 'Share your achievement:',
      shareText: (lvl, pct) => `I finished Level ${lvl} of the Word training with ${pct}%! Try it yourself at Merabti Academy.`,
      titles: { excellent: 'Excellent!', great: 'Well done!', good: 'Good, keep practicing!', tryAgain: 'No worries, try again!' },
      qShortcutFunc: (keys) => `What does <span class="kbd-inline">${keys.join('+')}</span> do?`,
      qShortcutKeys: (name) => `What is the shortcut for: "${name}"?`,
      getCertBtn: 'Get your certificate',
      certModalTitle: 'Certificate details',
      certModalHint: 'This info is used to issue your certificate whenever you pass a level.',
      certFirstNamePh: 'First name', certLastNamePh: 'Last name',
      certContinue: 'Continue',
      certPreviewTitle: 'Your certificate is ready!',
      certClose: 'Close', certShare: 'Share', certDownload: 'Download',
      certName: 'This certificate is proudly presented to', certPresented: 'This certificate is proudly presented to',
      certLevelLine: (lvl, label, pct) => `For successfully completing Level ${lvl} (${label}) of the Complete Word Training, with a score of ${pct}%`,
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Formation complète Word — Académie Merabti', topbarTitle: 'Formation complète Word',
      pageTitle: 'Choisissez un niveau', pageSub: '5 niveaux, 30 questions chacun — 15 secondes par question',
      levelLabels: { 1: 'Basique', 2: 'Élémentaire', 3: 'Intermédiaire', 4: 'Avancé', 5: 'Expert' },
      questionsCount: 'questions', bestScore: 'Meilleur score', loginRequired: 'Connexion requise',
      progressLabel: (i, n) => `Question ${i} sur ${n}`,
      lockedTitle: 'Ce niveau nécessite une connexion',
      lockedMsg: "Connectez-vous depuis la page d'accueil pour débloquer les niveaux 3, 4 et 5, et sauvegarder votre progression.",
      goLogin: 'Aller à la connexion', backToLevels: 'Retour aux niveaux',
      resultLevel: (lvl, label) => `Vous avez terminé le niveau ${lvl} (${label})`,
      resultScore: (score, total) => `${score} sur ${total} bonnes réponses`,
      shareLabel: 'Partagez votre réussite :',
      shareText: (lvl, pct) => `J'ai terminé le niveau ${lvl} de la formation Word avec ${pct} % ! Essayez à votre tour sur Académie Merabti.`,
      titles: { excellent: 'Excellent !', great: 'Bien joué !', good: 'Bien, continuez à vous entraîner !', tryAgain: 'Pas grave, réessayez !' },
      qShortcutFunc: (keys) => `Que fait <span class="kbd-inline">${keys.join('+')}</span> ?`,
      qShortcutKeys: (name) => `Quel est le raccourci pour : « ${name} » ?`,
    },
  };

  let lang = localStorage.getItem('wordTraining:lang') || 'ar';

  /* ---------------- Assign difficulty level to each shortcut ---------------- */
  const SC_WITH_LEVEL = SC.map((s, i) => ({
    ...s,
    level: Math.min(5, Math.ceil(((i + 1) / SC.length) * 5)),
  }));

  function shortcutsForLevel(level) {
    return SC_WITH_LEVEL.filter((s) => s.level === level);
  }
  function generalForLevel(level) {
    return GENERAL_Q.filter((q) => q.level === level);
  }

  /* ---------------- Helpers ---------------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pickN(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function buildShortcutQuestion(shortcut, pool) {
    const direction = Math.random() < 0.5 ? 'keys2func' : 'func2keys';
    const others = pool.filter((s) => s !== shortcut);

    if (direction === 'keys2func') {
      const correctText = shortcut.name[lang];
      const distractorPool = shuffle(others.map((s) => s.name[lang]).filter((n) => n !== correctText));
      const options = shuffle([correctText, ...distractorPool.slice(0, 3)]);
      return {
        q: UI[lang].qShortcutFunc(shortcut.keys),
        options,
        correct: options.indexOf(correctText),
        isHtml: true,
      };
    } else {
      const correctText = shortcut.keys.join('+');
      const distractorPool = shuffle(others.map((s) => s.keys.join('+')).filter((k) => k !== correctText));
      const uniqueDistractors = [...new Set(distractorPool)].slice(0, 3);
      const rawOptions = shuffle([correctText, ...uniqueDistractors]);
      const options = rawOptions.map((k) => `<span class="kbd-inline">${k}</span>`);
      return {
        q: UI[lang].qShortcutKeys(shortcut.name[lang]),
        options,
        correct: rawOptions.indexOf(correctText),
        isHtml: true,
      };
    }
  }

  function buildGeneralQuestion(item) {
    const localized = item[lang];
    const correctText = localized.options[item.correct];
    const order = shuffle(localized.options.map((opt, i) => ({ opt, wasCorrect: i === item.correct })));
    return {
      q: localized.q,
      options: order.map((o) => o.opt),
      correct: order.findIndex((o) => o.wasCorrect),
      isHtml: false,
    };
  }

  let previousLevelQuestions = []; // raw question objects used to build repeats

  function buildLevelQuestions(level) {
    const shortPool = shortcutsForLevel(level);
    const genPool = generalForLevel(level);

    const chosenShortcuts = pickN(shortPool, Math.min(SHORTCUT_PER_LEVEL, shortPool.length));
    const shortcutQs = chosenShortcuts.map((s) => buildShortcutQuestion(s, shortPool));

    const chosenGeneral = pickN(genPool, Math.min(GENERAL_PER_LEVEL, genPool.length));
    const generalQs = chosenGeneral.map(buildGeneralQuestion);

    let all = [...shortcutQs, ...generalQs];

    if (level > 1 && previousLevelQuestions.length > 0) {
      const repeats = pickN(previousLevelQuestions, Math.min(REPEAT_COUNT, previousLevelQuestions.length));
      all = all.slice(0, QUESTIONS_PER_LEVEL - repeats.length).concat(repeats);
    } else {
      all = all.slice(0, QUESTIONS_PER_LEVEL);
    }

    all = shuffle(all);
    previousLevelQuestions = all;
    return all;
  }

  /* ---------------- Auth (Firebase, shared with the main site) ---------------- */
  function getCurrentUser() {
    // Instant cache for first paint; kept in sync by onAuthStateChanged below.
    try { return JSON.parse(localStorage.getItem('site_user')); } catch (e) { return null; }
  }

  /* ---------------- Progress persistence (Firestore) ---------------- */
  let progressCache = {}; // { 1: {best, lastPlayed}, 2: {...}, ... }

  async function loadProgressFromFirestore() {
    const fbUser = window.fbAuth && window.fbAuth.currentUser;
    if (!fbUser || !window.fbDb) { progressCache = {}; return; }
    try {
      const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();
      const data = doc.exists ? doc.data() : {};
      progressCache = data.website || {};
    } catch (e) {
      progressCache = {};
    }
  }

  function loadProgress() {
    return progressCache;
  }

  async function saveProgress(level, pct) {
    const fbUser = window.fbAuth && window.fbAuth.currentUser;
    if (!fbUser || !window.fbDb) return; // not logged in — nothing to save

    const prevBest = progressCache[level] ? progressCache[level].best : 0;
    const best = Math.max(prevBest, pct);
    progressCache[level] = { best, lastPlayed: Date.now() };

    const update = {};
    update[`website.${level}`] = { best, lastPlayed: firebase.firestore.FieldValue.serverTimestamp() };
    try {
      await window.fbDb.collection('users').doc(fbUser.uid).set(update, { merge: true });
    } catch (e) {
      // Offline or permission issue — progress stays in memory for this session only.
    }
  }

  /* ---------------- DOM refs ---------------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'),
    pageTitleTag: $('pageTitleTag'),
    topbarTitle: $('topbarTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    levelSelectScreen: $('levelSelectScreen'),
    quizScreen: $('quizScreen'),
    resultScreen: $('resultScreen'),
    lockedScreen: $('lockedScreen'),
    pageTitle: $('pageTitle'),
    pageSub: $('pageSub'),
    levelsGrid: $('levelsGrid'),
    timerDisplay: $('timerDisplay'),
    timerText: $('timerText'),
    progressFill: $('progressFill'),
    progressLabel: $('progressLabel'),
    questionText: $('questionText'),
    optionsGrid: $('optionsGrid'),
    resultEmoji: $('resultEmoji'),
    resultTitle: $('resultTitle'),
    resultMsg: $('resultMsg'),
    resultPct: $('resultPct'),
    resultScore: $('resultScore'),
    backToLevelsBtn: $('backToLevelsBtn'),
    lockedBackBtn: $('lockedBackBtn'),
    lockedTitle: $('lockedTitle'),
    lockedMsg: $('lockedMsg'),
    goLoginBtn: $('goLoginBtn'),
    shareLabel: $('shareLabel'),
    shareWhatsapp: $('shareWhatsapp'),
    shareTelegram: $('shareTelegram'),
    getCertBtn: $('getCertBtn'), getCertText: $('getCertText'),
    certNameOverlay: $('certNameOverlay'), certNameTitle: $('certNameTitle'), certNameHint: $('certNameHint'),
    certFirstName: $('certFirstName'), certLastName: $('certLastName'), certLangRow: $('certLangRow'),
    certNameContinueBtn: $('certNameContinueBtn'),
    certPreviewOverlay: $('certPreviewOverlay'), certPreviewTitle: $('certPreviewTitle'), certPreviewImg: $('certPreviewImg'),
    certCloseBtn: $('certCloseBtn'), certShareBtn: $('certShareBtn'), certShareText: $('certShareText'),
    certDownloadBtn: $('certDownloadBtn'), certDownloadText: $('certDownloadText'),
  };

  function showScreen(name) {
    [els.levelSelectScreen, els.quizScreen, els.resultScreen, els.lockedScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ---------------- Language ---------------- */
  function applyLanguage() {
    const t = UI[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', t.dir);
    els.pageTitleTag.textContent = t.pageTitleTag;
    document.title = t.pageTitleTag;
    els.topbarTitle.textContent = t.topbarTitle;
    els.pageTitle.textContent = t.pageTitle;
    els.pageSub.textContent = t.pageSub;
    els.lockedTitle.textContent = t.lockedTitle;
    els.lockedMsg.textContent = t.lockedMsg;
    els.goLoginBtn.textContent = t.goLogin;
    els.lockedBackBtn.textContent = t.backToLevels;
    els.backToLevelsBtn.textContent = t.backToLevels;
    els.shareLabel.textContent = t.shareLabel;

    els.langBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    localStorage.setItem('wordTraining:lang', lang);
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lang = btn.getAttribute('data-lang');
      applyLanguage();
      renderLevels();
      showScreen('levelSelectScreen');
    });
  });

  /* ---------------- Level select screen ---------------- */
  function renderLevels() {
    const t = UI[lang];
    const user = getCurrentUser();
    const progress = loadProgress();
    let html = '';
    for (let lvl = 1; lvl <= 5; lvl++) {
      const locked = lvl >= LEVEL_MIN_LOGIN && !user;
      const best = progress[lvl] ? progress[lvl].best : null;
      html += `
        <div class="level-card ${locked ? 'locked' : ''}" data-level="${lvl}">
          ${locked ? '<span class="level-lock">🔒</span>' : ''}
          <span class="level-num">${lvl}</span>
          <p class="level-label">${t.levelLabels[lvl]}</p>
          <p class="level-meta">30 ${t.questionsCount}</p>
          ${best !== null ? `<p class="level-best">${t.bestScore}: ${best}%</p>` : ''}
          ${locked ? `<p class="level-locked-text">${t.loginRequired}</p>` : ''}
        </div>`;
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
  const CERT_MIN_PCT = 90;
  let certName = null; // { first, last, lang }
  let pendingLevelStart = null;

  const CERT_TEMPLATES = {
    ar: {
      src: 'certs/cert-ar.jpg',
      nameY: 0.555, presentedY: 0.478, levelY: 0.698, dateY: 0.81, dateX: 0.746,
      nameFont: 'bold 46px Tajawal, sans-serif',
      lineFont: '22px Tajawal, sans-serif',
      dateFont: 'bold 20px Tajawal, sans-serif',
      color: '#1E2F40', dir: 'rtl',
    },
    en: {
      src: 'certs/cert-en.jpg',
      nameY: 0.513, levelY: 0.601, dateY: 0.688, dateX: 0.638,
      nameFont: 'bold 58px "Times New Roman", serif',
      lineFont: '26px Georgia, serif',
      dateFont: 'bold 24px Georgia, serif',
      color: '#1E2F40', dir: 'ltr',
    },
  };

  function certDocRef() {
    const fbUser = window.fbAuth && window.fbAuth.currentUser;
    if (!fbUser || !window.fbDb) return null;
    return window.fbDb.collection('users').doc(fbUser.uid);
  }

  async function loadCertName() {
    const ref = certDocRef();
    if (!ref) { certName = null; return; }
    try {
      const doc = await ref.get();
      const data = doc.exists ? doc.data() : {};
      certName = data.certName || null;
    } catch (e) {
      certName = null;
    }
  }

  async function saveCertName(first, last, clang) {
    certName = { first, last, lang: clang };
    const ref = certDocRef();
    if (!ref) return;
    try { await ref.set({ certName }, { merge: true }); } catch (e) { /* ignore */ }
  }

  let certLangChoice = 'ar';
  els.certLangRow.querySelectorAll('.cert-lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      certLangChoice = btn.getAttribute('data-clang');
      els.certLangRow.querySelectorAll('.cert-lang-btn').forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  function openCertNameModal(onDone) {
    const t = UI[lang];
    els.certNameTitle.textContent = t.certModalTitle;
    els.certNameHint.textContent = t.certModalHint;
    els.certFirstName.placeholder = t.certFirstNamePh;
    els.certLastName.placeholder = t.certLastNamePh;
    els.certNameContinueBtn.textContent = t.certContinue;
    els.certFirstName.value = certName ? certName.first : '';
    els.certLastName.value = certName ? certName.last : '';
    certLangChoice = (certName && certName.lang) || (lang === 'en' ? 'en' : 'ar');
    els.certLangRow.querySelectorAll('.cert-lang-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-clang') === certLangChoice);
    });
    els.certNameOverlay.classList.remove('hidden');

    const submit = async () => {
      const first = els.certFirstName.value.trim();
      const last = els.certLastName.value.trim();
      if (!first || !last) return;
      await saveCertName(first, last, certLangChoice);
      els.certNameOverlay.classList.add('hidden');
      els.certNameContinueBtn.removeEventListener('click', submit);
      onDone();
    };
    els.certNameContinueBtn.addEventListener('click', submit);
  }

  function isLoggedIn() {
    return !!(window.fbAuth && window.fbAuth.currentUser);
  }

  function canGetCertificate(level, pct) {
    if (!isLoggedIn() || pct < CERT_MIN_PCT) return false;
    for (let i = 1; i < level; i++) {
      const p = progressCache[i];
      if (!p || p.best < CERT_MIN_PCT) return false;
    }
    return true;
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

  let lastCertCanvas = null;

  async function generateCertificate(level, pct) {
    if (!certName) return null;
    const clang = certName.lang === 'en' ? 'en' : 'ar';
    const cfg = CERT_TEMPLATES[clang];
    const t = UI[clang === 'en' ? 'en' : 'ar'];

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

    const fullName = `${certName.first} ${certName.last}`;
    ctx.font = cfg.nameFont;
    ctx.fillText(fullName, canvas.width / 2, canvas.height * cfg.nameY);

    if (clang === 'ar' && cfg.presentedY) {
      // Arabic template already prints "فخورون بمنح هذه الشهادة إلى" — nothing extra needed here.
    }

    ctx.font = cfg.lineFont;
    const levelLine = t.certLevelLine(level, t.levelLabels[level], pct);
    wrapCanvasText(ctx, levelLine, canvas.width / 2, canvas.height * cfg.levelY, canvas.width * 0.72, 34);

    ctx.font = cfg.dateFont;
    ctx.textAlign = clang === 'ar' ? 'center' : 'center';
    ctx.fillText(formatCertDate(), canvas.width * cfg.dateX, canvas.height * cfg.dateY);

    lastCertCanvas = canvas;
    return canvas;
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

  els.getCertBtn.addEventListener('click', async () => {
    const t = UI[lang];
    els.getCertText.textContent = '…';
    els.getCertBtn.disabled = true;
    try {
      const canvas = await generateCertificate(quizState.level, Math.round((quizState.score / quizState.questions.length) * 100));
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
  });

  els.certCloseBtn.addEventListener('click', () => els.certPreviewOverlay.classList.add('hidden'));

  els.certDownloadBtn.addEventListener('click', () => {
    if (!lastCertCanvas) return;
    const a = document.createElement('a');
    a.download = `certificate-level-${quizState ? quizState.level : ''}.png`;
    a.href = lastCertCanvas.toDataURL('image/png');
    a.click();
  });

  els.certShareBtn.addEventListener('click', async () => {
    if (!lastCertCanvas) return;
    lastCertCanvas.toBlob(async (blob) => {
      const file = new File([blob], 'certificate.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'Certificate' }); } catch (e) { /* user cancelled */ }
      } else {
        const a = document.createElement('a');
        a.download = 'certificate.png';
        a.href = URL.createObjectURL(blob);
        a.click();
      }
    }, 'image/png');
  });

  /* ---------------- Quiz state ---------------- */
  let quizState = null;
  let timerInterval = null;

  function startLevel(level) {
    if (isLoggedIn() && !certName) {
      pendingLevelStart = level;
      openCertNameModal(() => actuallyStartLevel(level));
      return;
    }
    actuallyStartLevel(level);
  }

  function actuallyStartLevel(level) {
    const questions = buildLevelQuestions(level);
    quizState = { level, questions, idx: 0, score: 0, locked: false };
    showScreen('quizScreen');
    renderQuestion();
  }

  function renderQuestion() {
    const t = UI[lang];
    const { questions, idx } = quizState;
    const total = questions.length;
    const q = questions[idx];

    els.progressFill.style.width = `${(idx / total) * 100}%`;
    els.progressLabel.textContent = t.progressLabel(idx + 1, total);

    if (q.isHtml) els.questionText.innerHTML = q.q;
    else els.questionText.textContent = q.q;

    els.optionsGrid.innerHTML = q.options
      .map((opt, i) => `<button type="button" class="option-btn" data-i="${i}">${opt}</button>`)
      .join('');

    quizState.locked = false;
    els.optionsGrid.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.getAttribute('data-i'), 10)));
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    let remaining = TIME_PER_QUESTION;
    updateTimerDisplay(remaining);
    els.timerDisplay.classList.remove('urgent');

    timerInterval = setInterval(() => {
      remaining--;
      updateTimerDisplay(remaining);
      if (remaining <= 3) els.timerDisplay.classList.add('urgent');
      if (remaining <= 0) {
        clearInterval(timerInterval);
        handleAnswer(-1);
      }
    }, 1000);
  }

  function updateTimerDisplay(seconds) {
    const s = Math.max(0, seconds);
    els.timerText.textContent = `00:${String(s).padStart(2, '0')}`;
  }

  function handleAnswer(selectedIdx) {
    if (quizState.locked) return;
    quizState.locked = true;
    clearInterval(timerInterval);

    const q = quizState.questions[quizState.idx];
    const buttons = els.optionsGrid.querySelectorAll('.option-btn');

    buttons.forEach((btn, i) => {
      if (i === q.correct) btn.classList.add('correct');
      else if (i === selectedIdx) btn.classList.add('wrong');
      btn.disabled = true;
    });

    if (selectedIdx === q.correct) quizState.score++;

    setTimeout(() => {
      quizState.idx++;
      if (quizState.idx >= quizState.questions.length) finishLevel();
      else renderQuestion();
    }, 900);
  }

  function finishLevel() {
    clearInterval(timerInterval);
    const t = UI[lang];
    const total = quizState.questions.length;
    const pct = Math.round((quizState.score / total) * 100);

    saveProgress(quizState.level, pct);

    let emoji = '🙂', title = t.titles.good;
    if (pct >= 90) { emoji = '🏆'; title = t.titles.excellent; }
    else if (pct >= 70) { emoji = '🎉'; title = t.titles.great; }
    else if (pct >= 50) { emoji = '👍'; title = t.titles.good; }
    else { emoji = '💪'; title = t.titles.tryAgain; }

    els.resultEmoji.textContent = emoji;
    els.resultTitle.textContent = title;
    els.resultMsg.textContent = t.resultLevel(quizState.level, t.levelLabels[quizState.level]);
    els.resultPct.textContent = `${pct}%`;
    els.resultScore.textContent = t.resultScore(quizState.score, total);

    els.getCertBtn.classList.toggle('hidden', !canGetCertificate(quizState.level, pct));
    els.getCertText.textContent = t.getCertBtn;

    const shareText = encodeURIComponent(t.shareText(quizState.level, pct));
    const shareLink = encodeURIComponent(location.href);
    els.shareWhatsapp.href = `https://wa.me/?text=${shareText}%20${shareLink}`;
    els.shareTelegram.href = `https://t.me/share/url?url=${shareLink}&text=${shareText}`;

    showScreen('resultScreen');
  }

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
        localStorage.setItem('site_user', JSON.stringify({
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          picture: fbUser.photoURL || null,
        }));
        await loadProgressFromFirestore();
        await loadCertName();
      } else {
        localStorage.removeItem('site_user');
        progressCache = {};
        certName = null;
      }
      renderLevels();
    });
  }
})();
