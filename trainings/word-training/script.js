// ============================================================
// script.js — Word Training quiz engine
// ============================================================

(function () {
  "use strict";

  const QUESTIONS_PER_LEVEL = 30;
  const GENERAL_PER_LEVEL = 15;
  const SHORTCUT_PER_LEVEL = 15;
  const REPEAT_COUNT = 4; // questions repeated from the previous level
  const TIME_PER_QUESTION = 15; // seconds

  const LEVEL_LABELS = {
    1: 'أساسي', 2: 'أساسي متقدم', 3: 'متوسط', 4: 'متقدم', 5: 'احترافي',
  };
  const LEVEL_MIN_LOGIN = 3;

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
  function keysStr(keys) {
    return `<span class="kbd-inline">${keys.join('+')}</span>`;
  }

  function buildShortcutQuestion(shortcut, pool) {
    const direction = Math.random() < 0.5 ? 'keys2func' : 'func2keys';
    const others = pool.filter((s) => s !== shortcut);

    if (direction === 'keys2func') {
      const correctText = shortcut.name.ar;
      const distractorPool = shuffle(others.map((s) => s.name.ar).filter((n) => n !== correctText));
      const options = shuffle([correctText, ...distractorPool.slice(0, 3)]);
      return {
        q: `ماذا يفعل الاختصار ${keysStr(shortcut.keys)} ؟`,
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
        q: `ما هو اختصار: "${shortcut.name.ar}" ؟`,
        options,
        correct: rawOptions.indexOf(correctText),
        isHtml: true,
      };
    }
  }

  function buildGeneralQuestion(item) {
    const correctText = item.options[item.correct];
    const order = shuffle(item.options.map((opt, i) => ({ opt, wasCorrect: i === item.correct })));
    return {
      q: item.q,
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

    // Trim / pad to exactly QUESTIONS_PER_LEVEL, then splice in repeats from previous level
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

  /* ---------------- Auth (reads the main site's login state) ---------------- */
  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('site_user')); } catch (e) { return null; }
  }

  /* ---------------- Progress persistence ---------------- */
  function progressKey() {
    const user = getCurrentUser();
    return user ? `wordTraining:progress:${user.email}` : null;
  }
  function loadProgress() {
    const key = progressKey();
    if (!key) return {};
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
  }
  function saveProgress(level, pct) {
    const key = progressKey();
    if (!key) return;
    const progress = loadProgress();
    const prevBest = progress[level] ? progress[level].best : 0;
    progress[level] = { best: Math.max(prevBest, pct), lastPlayed: Date.now() };
    localStorage.setItem(key, JSON.stringify(progress));
  }

  /* ---------------- DOM refs ---------------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    levelSelectScreen: $('levelSelectScreen'),
    quizScreen: $('quizScreen'),
    resultScreen: $('resultScreen'),
    lockedScreen: $('lockedScreen'),
    levelsGrid: $('levelsGrid'),
    progressFill: $('progressFill'),
    progressLabel: $('progressLabel'),
    timerDisplay: $('timerDisplay'),
    timerText: $('timerText'),
    questionText: $('questionText'),
    optionsGrid: $('optionsGrid'),
    resultEmoji: $('resultEmoji'),
    resultTitle: $('resultTitle'),
    resultMsg: $('resultMsg'),
    resultPct: $('resultPct'),
    resultScore: $('resultScore'),
    backToLevelsBtn: $('backToLevelsBtn'),
    lockedBackBtn: $('lockedBackBtn'),
    shareWhatsapp: $('shareWhatsapp'),
    shareTelegram: $('shareTelegram'),
  };

  function showScreen(name) {
    [els.levelSelectScreen, els.quizScreen, els.resultScreen, els.lockedScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ---------------- Level select screen ---------------- */
  function renderLevels() {
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
          <p class="level-label">${LEVEL_LABELS[lvl]}</p>
          <p class="level-meta">30 سؤال</p>
          ${best !== null ? `<p class="level-best">أفضل نتيجة: ${best}%</p>` : ''}
          ${locked ? '<p class="level-locked-text">يتطلب تسجيل الدخول</p>' : ''}
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

  /* ---------------- Quiz state ---------------- */
  let quizState = null;
  let timerInterval = null;

  function startLevel(level) {
    const questions = buildLevelQuestions(level);
    quizState = {
      level,
      questions,
      idx: 0,
      score: 0,
      locked: false,
    };
    showScreen('quizScreen');
    renderQuestion();
  }

  function renderQuestion() {
    const { questions, idx } = quizState;
    const total = questions.length;
    const q = questions[idx];

    els.progressFill.style.width = `${(idx / total) * 100}%`;
    els.progressLabel.textContent = `سؤال ${idx + 1} من ${total}`;

    if (q.isHtml) {
      els.questionText.innerHTML = q.q;
    } else {
      els.questionText.textContent = q.q;
    }

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
        handleAnswer(-1); // timeout = no answer
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
      if (quizState.idx >= quizState.questions.length) {
        finishLevel();
      } else {
        renderQuestion();
      }
    }, 900);
  }

  function finishLevel() {
    clearInterval(timerInterval);
    const total = quizState.questions.length;
    const pct = Math.round((quizState.score / total) * 100);

    saveProgress(quizState.level, pct);

    let emoji = '🙂', title = 'محاولة جيدة!';
    if (pct >= 90) { emoji = '🏆'; title = 'ممتاز جدًا!'; }
    else if (pct >= 70) { emoji = '🎉'; title = 'أحسنت!'; }
    else if (pct >= 50) { emoji = '👍'; title = 'جيد، واصل التدريب!'; }
    else { emoji = '💪'; title = 'لا بأس، حاول مرة أخرى!'; }

    els.resultEmoji.textContent = emoji;
    els.resultTitle.textContent = title;
    els.resultMsg.textContent = `أنهيت المستوى ${quizState.level} (${LEVEL_LABELS[quizState.level]})`;
    els.resultPct.textContent = `${pct}%`;
    els.resultScore.textContent = `${quizState.score} من ${total} إجابة صحيحة`;

    const shareText = encodeURIComponent(
      `أنهيت المستوى ${quizState.level} من تدريب وورد بنسبة ${pct}%! جرّب أنت كمان في أكاديمية مرابطي.`
    );
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
  renderLevels();
  showScreen('levelSelectScreen');
})();
