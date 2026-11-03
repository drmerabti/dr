// =====================================================================
// Home page icons (.home-tile, drawn by sectionCard() in app.js):
//  - mouse: the icon tilts toward the cursor and a light follows it
//  - finger: the icon leans toward the touch point and sinks, then pops
//    back when the finger lifts (scrolling cancels it)
//  - first open: the icons pop in one after the other
// Only classes and CSS variables are set here; the look is in home-tiles.css.
// Event delegation, so tiles re-drawn by app.js (language, admin) keep working.
// =====================================================================
(function () {
  'use strict';
  var MAX = 13; // degrees of tilt at the icon's edge
  var reduce = { matches: false };
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) {}

  var hovered = null, pressed = null;

  function tileOf(el) {
    var t = el && el.closest ? el.closest('.home-tile') : null;
    return t && !t.classList.contains('home-tile-soon') ? t : null;
  }

  function aim(tile, e) {
    var art = tile.querySelector('.home-tile-art');
    if (!art) return;
    var r = art.getBoundingClientRect();
    if (!r.width) return;
    var x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    var y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    tile.style.setProperty('--ht-mx', (x * 100).toFixed(1) + '%');
    tile.style.setProperty('--ht-my', (y * 100).toFixed(1) + '%');
    if (reduce.matches) return;
    tile.style.setProperty('--ht-ry', ((x - 0.5) * 2 * MAX).toFixed(2) + 'deg');
    tile.style.setProperty('--ht-rx', ((0.5 - y) * 2 * MAX).toFixed(2) + 'deg');
  }

  function rest(tile) {
    if (!tile) return;
    tile.classList.remove('is-active', 'is-pressed');
    ['--ht-rx', '--ht-ry', '--ht-mx', '--ht-my'].forEach(function (p) { tile.style.removeProperty(p); });
  }

  function pop(tile) {
    if (reduce.matches) return;
    tile.classList.remove('is-pop');
    void tile.offsetWidth; // restart the animation
    tile.classList.add('is-pop');
  }
  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'htPop') { var t = e.target.closest('.home-tile'); if (t) t.classList.remove('is-pop'); }
  });

  // mouse / pen: follow the cursor
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var t = tileOf(e.target);
    if (hovered && hovered !== t && hovered !== pressed) rest(hovered);
    hovered = t;
    if (!t) return;
    t.classList.add('is-active');
    aim(t, e);
  }, { passive: true });

  document.addEventListener('pointerdown', function (e) {
    if (e.button > 0) return;
    var t = tileOf(e.target);
    if (!t) return;
    pressed = t;
    t.classList.add('is-active', 'is-pressed');
    aim(t, e);
  }, { passive: true });

  function release(e, cancelled) {
    var t = pressed;
    pressed = null;
    if (!t) return;
    t.classList.remove('is-pressed');
    if (e.pointerType === 'touch' || cancelled) {
      rest(t);
      if (!cancelled) pop(t);
    } else if (tileOf(e.target) !== t) {
      rest(t);
    }
  }
  document.addEventListener('pointerup', function (e) { release(e, false); }, { passive: true });
  document.addEventListener('pointercancel', function (e) { release(e, true); }, { passive: true });

  // the cursor leaves the window
  document.addEventListener('pointerout', function (e) {
    if (!e.relatedTarget && hovered) { rest(hovered); hovered = null; }
  });
  // back from another page (bfcache): nothing stays pressed
  window.addEventListener('pageshow', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.home-tile'), rest);
    hovered = pressed = null;
  });

  // first open: pop-in, once
  if (!reduce.matches && document.getElementById('sectionGrid')) {
    var root = document.documentElement;
    root.classList.add('ht-intro');
    setTimeout(function () { root.classList.remove('ht-intro'); }, 1400);
  }
})();
