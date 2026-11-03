// =====================================================================
// Library promo card — one golden card, text only:
//   "تصفح المكتبة" (Arabic) / "Browse the Library" (English)
// Click → the site's books.html. Blinks gently 7 times on page open,
// then stays still (no blinking with prefers-reduced-motion).
//
// A page uses it by:
//   1) <link rel="stylesheet" href="<root>/shared/library-promo/library-promo.css">
//   2) one empty element where the card goes, either
//        <div class="lib-promo-row" data-lib-promo></div>      own row under the top bar
//      or, inside the top bar itself:
//        <div class="lib-promo-bar" data-lib-promo="bar"></div>
//   3) <script src="<root>/shared/library-promo/library-promo.js" defer></script>
//
// Language: follows <html lang="..."> (watched, so the page's own language
// button switches the text live). Anything not "en" shows Arabic.
// Optional attribute on the slot: data-href="..." to override the link.
//
// Height (own-row mode only): the row's height is published as the CSS variable --lib-promo-h
// on <html>, so a full-height page layout can subtract it
// (e.g. height: calc(100dvh - var(--tb-h) - var(--lib-promo-h, 0px))).
// =====================================================================
(function () {
  'use strict';

  var TXT = { ar: 'تصفح المكتبة', en: 'Browse the Library' };

  var script = document.currentScript;
  // .../shared/library-promo/library-promo.js → site root
  var root = script ? script.src.replace(/shared\/library-promo\/[^\/]*$/, '') : '/';
  var BOOKS_URL = root + 'books.html';

  function lang() {
    return (document.documentElement.lang || 'ar').slice(0, 2).toLowerCase() === 'en' ? 'en' : 'ar';
  }

  function build(slot) {
    if (slot.querySelector('.lib-promo')) return slot.querySelector('.lib-promo');
    var a = document.createElement('a');
    a.className = 'lib-promo';
    a.href = slot.getAttribute('data-href') || BOOKS_URL;
    a.addEventListener('click', function () {
      try { if (typeof window.gtag === 'function') window.gtag('event', 'library_promo_click', { page_path: location.pathname }); } catch (e) {}
    });
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (!reduce) {
      a.classList.add('lp-blink');
      a.addEventListener('animationend', function () { a.classList.remove('lp-blink'); });
    }
    slot.appendChild(a);
    return a;
  }

  function setText(cards) {
    var l = lang();
    cards.forEach(function (a) {
      a.textContent = TXT[l];
      a.setAttribute('lang', l);
      a.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    });
  }

  function publishHeight(slot) {
    var set = function () {
      try { document.documentElement.style.setProperty('--lib-promo-h', slot.offsetHeight + 'px'); } catch (e) {}
    };
    set();
    if (window.ResizeObserver) { try { new ResizeObserver(set).observe(slot); } catch (e) {} }
    else window.addEventListener('resize', set);
  }

  function init() {
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-lib-promo]'));
    if (!slots.length) return;
    var rows = [];
    slots.forEach(function (s) {
      if (s.getAttribute('data-lib-promo') === 'bar') s.classList.add('lib-promo-bar');
      else { s.classList.add('lib-promo-row'); rows.push(s); }
    });
    var cards = slots.map(build);
    setText(cards);
    if (rows.length) publishHeight(rows[0]);
    try {
      new MutationObserver(function () { setText(cards); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
