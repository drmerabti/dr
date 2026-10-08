/* =====================================================================
   form-clarity.js — companion of /shared/form-clarity.css.
   Presentation only: adds the class "fc-filled" to every text field
   inside a section (.acc-body) that has a value, so the CSS can show a
   green tick even on fields without a placeholder. It never reads or
   changes a value and does not touch the tool's own logic.
   ===================================================================== */
(function () {
  "use strict";
  var SEL = '.acc-body input:not([type]), .acc-body input[type=text], .acc-body input[type=email], .acc-body input[type=tel], .acc-body input[type=url], .acc-body textarea';
  function mark(el) {
    var filled = !!(el.value && el.value.trim());
    if (el.classList.contains('fc-filled') !== filled) el.classList.toggle('fc-filled', filled);
  }
  function scan() { var list = document.querySelectorAll(SEL); for (var i = 0; i < list.length; i++) mark(list[i]); }
  var queued = false;
  function soon() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; scan(); }); }
  document.addEventListener('input', function (e) { if (e.target.matches && e.target.matches(SEL)) mark(e.target); }, true);
  document.addEventListener('change', function (e) { if (e.target.matches && e.target.matches(SEL)) mark(e.target); }, true);
  document.addEventListener('focusout', function (e) { if (e.target.matches && e.target.matches(SEL)) mark(e.target); }, true);
  function start() {
    scan();
    // sections are often (re)built by the tool's script: rescan after DOM changes
    new MutationObserver(soon).observe(document.body, { childList: true, subtree: true });
    // values filled in by code (restoring a draft, opening a saved file) fire no event
    setInterval(scan, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
