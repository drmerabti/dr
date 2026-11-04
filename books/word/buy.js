/* =====================================================================
   Word book — the two purchase buttons and their windows.
   "ادفع بالدولار" (#payUsd)  → #usdModal: PayPal buttons (paypal.js).
   "ادفع بالدينار" (#payDzd)  → #dzdModal: order by e-mail / WhatsApp
     (#orderMail / #orderWa, still handled by app.js).
   Each window: centred, dark overlay, X button, Escape / click outside
   closes it, focus stays inside while open. Opening fires "pm:open" on
   the window (paypal.js draws its buttons on the first one).
===================================================================== */
(function(){
  var current = null, lastTrigger = null, bodyOverflow = '';

  function track(method){
    try { if (window.gtag) gtag('event', 'book_order_click', { book: 'word', method: method }); } catch (e) { /* ignore */ }
  }

  function open(modal, trigger){
    if (current) close(true);
    current = modal;
    lastTrigger = trigger || null;
    modal.hidden = false;
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('.pm-close');
    if (first) first.focus();
    try { modal.dispatchEvent(new CustomEvent('pm:open')); } catch (e) { /* very old browsers */ }
  }

  function close(keepFocus){
    if (!current) return;
    current.hidden = true;
    current = null;
    document.body.style.overflow = bodyOverflow;
    if (!keepFocus && lastTrigger) lastTrigger.focus();
  }

  function wire(btnId, modalId, method){
    var btn = document.getElementById(btnId), modal = document.getElementById(modalId);
    if (!btn || !modal) return;
    btn.addEventListener('click', function(){ track(method); open(modal, btn); });
    modal.querySelector('.pm-close').addEventListener('click', function(){ close(); });
    modal.addEventListener('click', function(e){ if (e.target === modal) close(); });
  }

  wire('payUsd', 'usdModal', 'usd');
  wire('payDzd', 'dzdModal', 'dzd');

  /* e-mail / WhatsApp inside the dinar window: close it first (capture phase,
     before app.js opens its own window), so only one window is ever open. */
  var dzd = document.getElementById('dzdModal');
  if (dzd) dzd.addEventListener('click', function(e){
    if (e.target.closest && e.target.closest('#orderMail, #orderWa')) close(true);
  }, true);

  document.addEventListener('keydown', function(e){
    if (!current) return;
    if (e.key === 'Escape'){ close(); return; }
    if (e.key === 'Tab'){
      var f = Array.prototype.filter.call(
        current.querySelectorAll('button, a[href], iframe'),
        function(el){ return el.offsetParent !== null; }
      );
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  window.WordBuy = { open: function(id){ var m = document.getElementById(id); if (m) open(m); }, close: close };
})();
