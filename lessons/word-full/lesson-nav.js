(function () {
  "use strict";
  const TOTAL = window.UNIT_TOTAL || 7;
  const n = window.LESSON_NUM;
  const unitKey = window.UNIT_KEY || "u1";
  if (!n) return;

  function getProgress() {
    try { return JSON.parse(localStorage.getItem("word_full_progress")) || {}; }
    catch (e) { return {}; }
  }
  function markDone() {
    const p = getProgress();
    if (!p[unitKey]) p[unitKey] = {};
    p[unitKey][n] = true;
    localStorage.setItem("word_full_progress", JSON.stringify(p));
  }
  function renderDots() {
    const p = getProgress();
    const done = p[unitKey] || {};
    const wrap = document.getElementById("progressDots");
    if (!wrap) return;
    let html = "";
    for (let i = 1; i <= TOTAL; i++) {
      let cls = "";
      if (i === n) cls = "active";
      else if (done[i]) cls = "done";
      html += `<span class="${cls}"></span>`;
    }
    wrap.innerHTML = html;
  }

  markDone();
  document.addEventListener("DOMContentLoaded", renderDots);
})();
