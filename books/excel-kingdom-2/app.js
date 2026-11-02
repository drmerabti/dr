/* =====================================================================
   PRICES — the only place to change the price of the book.
   After the launch offer: set offer to false (the badge disappears) and
   put the new price in dzd / usd.
===================================================================== */
var PRICES = {
  offer: false,                     /* true: badge above the prices */
  offerLabel: 'سعر الإطلاق 🔥',
  dzd: 800,                         /* Algerian dinar (دج) */
  usd: 7                            /* US dollar ($) */
};

function fillPrices(root){
  root.querySelectorAll('[data-price]').forEach(function(el){
    var k = el.getAttribute('data-price');
    el.textContent = k === 'usd' ? (PRICES.usd % 1 ? PRICES.usd.toFixed(2) : String(PRICES.usd)) : PRICES.dzd;
  });
  root.querySelectorAll('.offer-badge').forEach(function(el){ el.textContent = PRICES.offerLabel; });
  root.querySelectorAll('[data-offer]').forEach(function(el){ el.hidden = !PRICES.offer; });
  root.querySelectorAll('.buy-prices').forEach(function(el){ el.classList.toggle('has-offer', PRICES.offer); });
}
fillPrices(document);

/* =====================================================================
   Order buttons (same as the Word book page). A bare mailto: does nothing
   for visitors without a mail app, so the e-mail button always opens a
   window with the address written out, a copy button and an "open mail"
   link. WhatsApp opens the app straight away on phones; on computers the
   same window shows the number with copy and a WhatsApp Web link.
===================================================================== */
(function(){
  var EMAIL = 'contact@merabti.com';
  var SUBJECT = 'طلب كتاب مملكة الخلايا (الجزء الثاني)';
  var WA_NUMBER = '213663708148';
  var WA_SHOWN = '+213 663 70 81 48';
  var WA_TEXT = 'السلام عليكم، أريد طلب كتاب مملكة الخلايا — إكسل كأن لم تعرفه من قبل (الجزء الثاني)';

  var mailBtn = document.getElementById('orderMail');
  var waBtn = document.getElementById('orderWa');
  var overlay = document.getElementById('ctOverlay');
  var box = overlay.querySelector('.ct-box');
  var copyBtn = document.getElementById('ctCopy');
  var copyLabel = copyBtn.querySelector('span');
  var openLink = document.getElementById('ctOpen');
  var valueEl = document.getElementById('ctValue');
  var copyValue = '', lastTrigger = null, copyT = 0, bodyOverflow = '';

  var VIEWS = {
    mail: {
      title: 'اطلب الكتاب عبر البريد',
      hint: 'أرسل رسالة إلى هذا العنوان، واكتب في الموضوع «' + SUBJECT + '»:',
      shown: EMAIL, copy: EMAIL,
      open: 'فتح البريد',
      href: 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(SUBJECT),
      icon: mailBtn.querySelector('.order-ico').innerHTML
    },
    wa: {
      title: 'اطلب عبر واتساب',
      hint: 'راسلنا على هذا الرقم، أو افتح واتساب ويب برسالة جاهزة:',
      shown: WA_SHOWN, copy: '+' + WA_NUMBER,
      open: 'فتح واتساب ويب',
      href: 'https://web.whatsapp.com/send?phone=' + WA_NUMBER + '&text=' + encodeURIComponent(WA_TEXT),
      icon: waBtn.querySelector('.order-ico').innerHTML
    }
  };

  function isPhone(){
    return /Android|iPhone|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches);   /* iPadOS */
  }

  function track(method){
    try { if (window.gtag) gtag('event', 'book_order_click', { book: 'excel-kingdom-2', method: method }); } catch (e) { /* ignore */ }
  }

  mailBtn.addEventListener('click', function(e){
    e.preventDefault();
    track('email');
    show('mail', mailBtn);
  });

  waBtn.addEventListener('click', function(e){
    track('whatsapp');
    if (isPhone()) return;            /* wa.me opens the WhatsApp app */
    e.preventDefault();
    show('wa', waBtn);
  });

  function show(kind, trigger){
    var v = VIEWS[kind];
    lastTrigger = trigger;
    box.classList.toggle('is-wa', kind === 'wa');
    document.getElementById('ctIco').innerHTML = v.icon;
    document.getElementById('ctTitle').textContent = v.title;
    document.getElementById('ctHint').textContent = v.hint;
    valueEl.textContent = v.shown;
    copyValue = v.copy;
    openLink.href = v.href;
    openLink.innerHTML = v.icon + '<span>' + v.open + '</span>';
    /* a mailto: in a new tab leaves an empty tab behind */
    if (kind === 'mail') openLink.removeAttribute('target'); else openLink.target = '_blank';
    resetCopy();
    overlay.hidden = false;
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    copyBtn.focus();
  }

  function hide(){
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = bodyOverflow;
    if (lastTrigger) lastTrigger.focus();
  }

  document.getElementById('ctClose').addEventListener('click', hide);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) hide(); });
  document.addEventListener('keydown', function(e){
    if (overlay.hidden) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'Tab'){               /* keep focus inside the window */
      var f = box.querySelectorAll('button, a[href]');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- copy ---------- */
  copyBtn.addEventListener('click', function(){
    copy(copyValue).then(function(ok){
      if (ok){
        copyBtn.classList.add('done');
        copyLabel.textContent = 'تم النسخ ✓';
      } else {
        selectValue();
        copyLabel.textContent = 'النص محدَّد، انسخه يدويًا';
      }
      clearTimeout(copyT);
      copyT = setTimeout(resetCopy, 2500);
    });
  });
  valueEl.addEventListener('click', selectValue);

  function resetCopy(){
    clearTimeout(copyT);
    copyBtn.classList.remove('done');
    copyLabel.textContent = 'نسخ';
  }

  function copy(text){
    if (navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text).then(function(){ return true; }, function(){ return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  /* older browsers / in-app browsers without the Clipboard API */
  function legacyCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    box.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    box.removeChild(ta);
    copyBtn.focus();
    return ok;
  }

  function selectValue(){
    var r = document.createRange();
    r.selectNodeContents(valueEl);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }
})();

/* phones: hide the order shortcut while the order block itself is on screen */
(function(){
  var mCta = document.getElementById('mCta');
  var box = document.getElementById('buyBox');
  if (!mCta || !box || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(entries){
    mCta.classList.toggle('off', entries[0].isIntersecting);
  }).observe(box);
})();
