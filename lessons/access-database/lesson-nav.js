(function () {
  "use strict";
  const TOTAL = 8;
  const n = window.LESSON_NUM;
  if (!n) return;

  function getProgress() {
    try { return JSON.parse(localStorage.getItem("access_lessons_progress")) || {}; }
    catch (e) { return {}; }
  }
  function markDone() {
    const p = getProgress();
    p[n] = true;
    localStorage.setItem("access_lessons_progress", JSON.stringify(p));
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
