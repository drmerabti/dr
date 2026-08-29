(function () {
  "use strict";
  const TOTAL = 5; // beginner level lesson count (adjust as more lessons are added)
  const n = window.LESSON_NUM;
  if (!n) return;

  function getProgress() {
    try { return JSON.parse(localStorage.getItem("word_full_progress")) || {}; }
    catch (e) { return {}; }
  }
  function markDone() {
    const p = getProgress();
    p[n] = true;
    localStorage.setItem("word_full_progress", JSON.stringify(p));
  }
  function renderDots() {
    const p = getProgress();
    const wrap = document.getElementById("progressDots");
    if (!wrap) return;
    let html = "";
    for (let i = 1; i <= TOTAL; i++) {
      let cls = "";
      if (i === n) cls = "active";
      else if (p[i]) cls = "done";
      html += `<span class="${cls}"></span>`;
    }
    wrap.innerHTML = html;
  }

  markDone();
  document.addEventListener("DOMContentLoaded", renderDots);
})();
