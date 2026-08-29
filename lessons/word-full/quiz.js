(function () {
  "use strict";

  const questions = window.QUIZ_QUESTIONS || [];
  if (!questions.length) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    launchBtn: $("quizLaunchBtn"),
    overlay: $("quizOverlay"),
    closeBtn: $("quizCloseBtn"),
    questionView: $("quizQuestionView"),
    progress: $("quizProgress"),
    question: $("quizQuestion"),
    options: $("quizOptions"),
    doneView: $("quizDoneView"),
    doneEmoji: $("quizDoneEmoji"),
    doneTitle: $("quizDoneTitle"),
    doneMsg: $("quizDoneMsg"),
    restartBtn: $("quizRestartBtn"),
  };

  const ENCOURAGEMENT = [
    { emoji: "🌱", title: "بداية جيدة!", msg: "استمر بالتدرب، كل خطوة تقربك من الاحتراف." },
    { emoji: "👍", title: "أحسنت!", msg: "فهمت أغلب الأفكار، راجع الدرس مرة ثانية لو حبيت تتأكد أكثر." },
    { emoji: "🎉", title: "ممتاز!", msg: "أجبت صح على كل الأسئلة! جاهز تنتقل للدرس التالي." },
  ];

  let idx = 0;
  let score = 0;
  let locked = false;

  function openQuiz() {
    idx = 0;
    score = 0;
    els.doneView.classList.add("hidden");
    els.questionView.classList.remove("hidden");
    renderQuestion();
    els.overlay.classList.remove("hidden");
  }

  function closeQuiz() {
    els.overlay.classList.add("hidden");
  }

  function renderQuestion() {
    const q = questions[idx];
    els.progress.textContent = `سؤال ${idx + 1} من ${questions.length}`;
    els.question.textContent = q.q;
    els.options.innerHTML = q.options
      .map((opt, i) => `<button type="button" class="quiz-option-btn" data-i="${i}">${opt}</button>`)
      .join("");
    locked = false;
    els.options.querySelectorAll(".quiz-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(parseInt(btn.getAttribute("data-i"), 10)));
    });
  }

  function handleAnswer(selected) {
    if (locked) return;
    locked = true;
    const q = questions[idx];
    const buttons = els.options.querySelectorAll(".quiz-option-btn");
    buttons.forEach((btn, i) => {
      if (i === q.correct) btn.classList.add("correct");
      else if (i === selected) btn.classList.add("wrong");
      btn.disabled = true;
    });
    if (selected === q.correct) score++;

    setTimeout(() => {
      idx++;
      if (idx >= questions.length) finishQuiz();
      else renderQuestion();
    }, 800);
  }

  function finishQuiz() {
    els.questionView.classList.add("hidden");
    const ratio = score / questions.length;
    const tier = ratio >= 0.9 ? 2 : ratio >= 0.5 ? 1 : 0;
    const e = ENCOURAGEMENT[tier];
    els.doneEmoji.textContent = e.emoji;
    els.doneTitle.textContent = e.title;
    els.doneMsg.textContent = `${e.msg} (${score} من ${questions.length})`;
    els.doneView.classList.remove("hidden");
  }

  if (els.launchBtn) els.launchBtn.addEventListener("click", openQuiz);
  if (els.closeBtn) els.closeBtn.addEventListener("click", closeQuiz);
  if (els.restartBtn) els.restartBtn.addEventListener("click", openQuiz);
  if (els.overlay) {
    els.overlay.addEventListener("click", (e) => {
      if (e.target === els.overlay) closeQuiz();
    });
  }
})();
