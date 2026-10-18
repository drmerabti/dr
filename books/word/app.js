/* =====================================================================
   PRICES — the only place to change the price of the book.
   After the launch offer: set offer to false (only the "now" prices are
   shown, without the badge and the struck-through prices), and put the
   new price in "now".
===================================================================== */
var PRICES = {
  offer: true,                      /* launch offer on: badge + struck-through old prices */
  offerLabel: 'عرض الإطلاق 🔥',
  dzd: { was: 1200, now: 800 },     /* Algerian dinar (دج) */
  usd: { was: 8, now: 6 }           /* US dollar ($) */
};

(function(){
  document.querySelectorAll('[data-price]').forEach(function(el){
    var path = el.getAttribute('data-price').split('.');
    el.textContent = PRICES[path[0]][path[1]];
  });
  document.querySelectorAll('.offer-badge').forEach(function(el){ el.textContent = PRICES.offerLabel; });
  document.querySelectorAll('[data-offer]').forEach(function(el){ el.hidden = !PRICES.offer; });
  document.querySelectorAll('.buy-prices').forEach(function(el){ el.classList.toggle('has-offer', PRICES.offer); });
})();

/* =====================================================================
   Order buttons. A bare mailto: does nothing for visitors without a mail
   app, so the e-mail button always opens a window with the address
   written out, a copy button and an "open mail" link. WhatsApp opens the
   app straight away on phones; on computers the same window shows the
   number with copy and a WhatsApp Web link.
===================================================================== */
(function(){
  var EMAIL = 'contact@merabti.com';
  var SUBJECT = 'طلب كتاب وورد';
  var WA_NUMBER = '213663708148';
  var WA_SHOWN = '+213 663 70 81 48';
  var WA_TEXT = 'السلام عليكم، أريد طلب كتاب وورد';

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
    try { if (window.gtag) gtag('event', 'book_order_click', { book: 'word', method: method }); } catch (e) { /* ignore */ }
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

/* =====================================================================
   Word book page — preview pages drawn with pdf.js.
   Computers (≥ 861 px): a real book (StPageFlip) that opens right-to-left.
     StPageFlip only turns left-to-right, so the pages are handed to it in
     reverse order and the book starts on its last index (the Arabic front
     cover). Pages are drawn nearest first; a spinner holds their place.
   Phones: a plain PDF-style list, pages one under the other, drawn as they
     scroll near; no book, no animation.
   Each mode is built the first time its screen size is met.
   Orders go by e-mail or WhatsApp (order block first, so a failed
   pdf.js load can never take the buttons down with it).
===================================================================== */
(function(){
  var PDF_URL = 'preview/word-book-preview.pdf';
  var TOTAL_PAGES = 202;
  var MAX_PX = 1800;                 /* cap on the rendered bitmap width (computers) */
  var MAX_PX_PHONE = 1000;           /* phones: sharp enough, light to scroll */
  var MIN_PAGE = 280;                /* narrower pages → one page at a time */

  var previewEl = document.getElementById('preview');
  var stage = document.getElementById('fbStage');
  var bookEl = document.getElementById('fbBook');
  var statusEl = document.getElementById('pvStatus');
  var listEl = document.getElementById('pvList');
  var counterEl = document.getElementById('pvCounter');
  var prevBtn = document.getElementById('fbPrev');
  var nextBtn = document.getElementById('fbNext');
  var soundBtn = document.getElementById('fbSound');
  var fullBtn = document.getElementById('fbFull');
  var coverImg = document.getElementById('bkCover');
  var desktop = window.matchMedia('(min-width: 861px)');

  var doc = null, ratio = 0.708, n = 0, total = 0;
  var drawn = {};                    /* page number → { url, width } */

  if (!window.pdfjsLib){ fail(); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  pdfjsLib.getDocument(PDF_URL).promise.then(function(pdf){
    doc = pdf;
    return pdf.getPage(1);
  }).then(function(first){
    var vp = first.getViewport({ scale: 1 });
    ratio = vp.width / vp.height;
    n = doc.numPages;
    total = n + 1;                   /* + the "rest after purchase" page */
    document.getElementById('pvCount').textContent = n;
    pickMode();
    if (desktop.addEventListener) desktop.addEventListener('change', pickMode);
  }).catch(fail);

  function fail(){
    var msg = 'تعذّر عرض المعاينة هنا. <a href="' + PDF_URL + '" target="_blank" rel="noopener">افتح ملف المعاينة</a>';
    statusEl.innerHTML = msg;
    listEl.innerHTML = '<p class="pv-list-status">' + msg + '</p>';
  }

  function pickMode(){
    if (desktop.matches){
      if (window.St) Book.init(); else fail();
    } else {
      List.init();
    }
  }

  /* ---------- shared: draw one page to a JPEG (reused when sharp enough) ---------- */
  function drawPage(num, w){
    var have = drawn[num];
    if (have && have.width >= w * 0.85) return Promise.resolve(have);
    return doc.getPage(num).then(function(page){
      var vp = page.getViewport({ scale: 1 });
      var viewport = page.getViewport({ scale: w / vp.width });
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function(){
        return new Promise(function(done){ canvas.toBlob(done, 'image/jpeg', 0.9); });
      }).then(function(blob){
        var res = { url: URL.createObjectURL(blob), width: canvas.width };
        drawn[num] = res;
        canvas.width = canvas.height = 0;
        page.cleanup();
        /* no cover image on the server: show the drawn first page instead */
        if (num === 1 && coverImg && coverImg.classList.contains('missing')){
          coverImg.classList.remove('missing');
          coverImg.src = res.url;
        }
        return res;
      });
    });
  }

  /* put a drawn page into its box once the image is decoded (no half-drawn page) */
  function showImg(box, url){
    var img = new Image();
    img.alt = '';
    img.draggable = false;
    img.src = url;
    return (img.decode ? img.decode() : Promise.resolve()).catch(function(){}).then(function(){
      var old = box.querySelector('img');
      if (old) old.remove();
      box.insertBefore(img, box.firstChild);
      box.classList.add('done');
    });
  }

  function endPage(){
    var frag = document.getElementById('fbEndTpl').content.cloneNode(true);
    frag.querySelector('.pv-end-sub').textContent = 'باقي ' + (TOTAL_PAGES - n) + ' صفحة من الفصول العشرة بانتظارك';
    frag.querySelector('.pv-end-btn').addEventListener('click', goBuy);
    return frag;
  }

  function goBuy(){
    if (Book.isFull()) Book.toggleFull();
    var box = document.getElementById('buyBox');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.classList.remove('flash');
    void box.offsetWidth;
    box.classList.add('flash');
  }

  /* =================================================================
     Phones: pages one under the other
  ================================================================= */
  var List = (function(){
    var built = false, items = [], observer = null, queue = Promise.resolve();

    function init(){
      if (built){ watch(); return; }
      built = true;
      listEl.innerHTML = '';
      for (var i = 1; i <= n; i++){
        var box = document.createElement('div');
        box.className = 'pv-pg';
        box.style.aspectRatio = ratio.toFixed(4);
        box.setAttribute('role', 'img');
        box.setAttribute('aria-label', 'صفحة ' + i + ' من المعاينة');
        listEl.appendChild(box);
        items.push({ el: box, num: i, width: 0, queued: false });
      }
      var end = document.createElement('div');
      end.className = 'pv-list-end';
      end.appendChild(endPage());
      listEl.appendChild(end);
      watch();
      var lastW = window.innerWidth;
      window.addEventListener('resize', function(){
        if (window.innerWidth === lastW) return;   /* address bar while scrolling */
        lastW = window.innerWidth;
        if (!desktop.matches) watch();
      });
    }

    function watch(){
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting) load(items[e.target.dataset.i]);
        });
      }, { rootMargin: '1200px 0px' });
      items.forEach(function(it, i){ it.el.dataset.i = i; observer.observe(it.el); });
    }

    function load(it){
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.min(Math.round(it.el.clientWidth * dpr), MAX_PX_PHONE);
      if (!w || it.queued || it.width >= w * 0.85) return;
      it.queued = true;
      /* one page at a time, in the order they come into reach */
      queue = queue.then(function(){
        return drawPage(it.num, w).then(function(res){
          it.width = res.width;
          return showImg(it.el, res.url);
        });
      }).catch(function(){}).then(function(){ it.queued = false; });
    }

    return { init: init };
  })();

  /* =================================================================
     Computers: the flipbook
  ================================================================= */
  var Book = (function(){
    var flip = null, pages = [], busy = false, built = false;

    function init(){
      if (built){ relayout(); return; }
      built = true;
      for (var r = 0; r < total; r++){
        var el = document.createElement('div');
        el.className = 'fb-page';
        var p = { el: el, r: r, num: r < n ? r + 1 : 0, width: 0 };
        if (p.num){
          el.innerHTML = '<span class="fb-shade"></span><span class="fb-spin" aria-hidden="true"></span>';
          el.setAttribute('aria-label', 'صفحة ' + p.num + ' من المعاينة');
        } else {
          el.className += ' fb-page-end done';
          el.appendChild(endPage());
          el.insertAdjacentHTML('afterbegin', '<span class="fb-shade"></span>');
        }
        pages.push(p);
      }
      var libOrder = pages.slice().reverse().map(function(p){ return p.el; });
      libOrder.forEach(function(el){ bookEl.appendChild(el); });

      sizeBook();
      flip = new St.PageFlip(bookEl, {
        width: 708, height: Math.round(708 / ratio),
        size: 'stretch',
        minWidth: MIN_PAGE, maxWidth: 2000, minHeight: 100, maxHeight: 4000,
        showCover: true,
        usePortrait: true,
        startPage: total - 1,        /* the front cover */
        flippingTime: 700,
        maxShadowOpacity: 0.45,
        mobileScrollSupport: true
      });
      flip.loadFromHTML(libOrder);
      sizeBook();                    /* StPageFlip resets max-width once, at start */
      flip.update();
      flip.on('init', function(){ updateNav(); pump(); });
      flip.on('flip', function(){ updateNav(); pump(); });
      flip.on('changeOrientation', function(){ updateNav(); pump(); });
      flip.on('changeState', function(e){
        /* 'flipping' = turned by click / arrows / keys; 'user_fold' = the page is lifted by a drag */
        if (e.data === 'flipping' || e.data === 'user_fold'){
          playFlip();
          bookEl.style.transform = '';   /* leaving a lone cover: slide back while the page turns */
        }
        if (e.data === 'read') pump();   /* draw only between page turns */
      });
      pump();

      var resizeT = 0;
      window.addEventListener('resize', function(){ clearTimeout(resizeT); resizeT = setTimeout(relayout, 120); });
    }

    /* width of the book box: two pages side by side, one if the space is narrow */
    function sizeBook(){
      var fs = isFull();
      var cs = getComputedStyle(stage);
      var w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      var two = Math.min(w / 2, h * ratio);
      var one = Math.min(w, h * ratio);
      var wantTwo = (desktop.matches || (fs && window.innerWidth > window.innerHeight)) && two >= MIN_PAGE;
      /* one page must stay under 2 × minWidth, or StPageFlip switches back to two */
      var bookW = wantTwo ? two * 2 : Math.min(one, MIN_PAGE * 2 - 2);
      /* StPageFlip keeps the box at width:100%, so the size goes through max-width */
      bookEl.style.width = '100%';
      bookEl.style.maxWidth = Math.max(Math.floor(bookW), MIN_PAGE) + 'px';
    }

    function relayout(){
      if (!flip || !desktop.matches) return;   /* hidden on phones */
      requestAnimationFrame(function(){
        sizeBook();
        flip.update();
        updateNav();
        pump();
      });
    }

    /* ---------- which pages are open (in reading order) ---------- */
    function visibleReading(){
      if (!flip) return [0];
      var i = flip.getCurrentPageIndex(), lib;
      if (flip.getOrientation() === 'portrait' || i === 0) lib = [i];
      else {
        var a = (i % 2 === 1) ? i : i - 1;
        lib = a + 1 <= total - 1 ? [a, a + 1] : [a];
      }
      return lib.map(function(x){ return total - 1 - x; }).sort(function(x, y){ return x - y; });
    }

    function updateNav(){
      var vis = visibleReading();
      var nums = vis.filter(function(r){ return r < n; }).map(function(r){ return r + 1; });
      counterEl.textContent = nums.length
        ? (nums.length > 1 ? nums[0] + '–' + nums[nums.length - 1] : nums[0]) + ' / ' + n
        : 'نهاية المعاينة';
      prevBtn.disabled = vis[0] === 0;
      nextBtn.disabled = vis[vis.length - 1] === total - 1;
      /* a lone cover sits on one half of the open book: slide it to the middle */
      var shift = '';
      if (flip && flip.getOrientation() === 'landscape' && vis.length === 1){
        shift = vis[0] === 0 ? 'translateX(25%)' : 'translateX(-25%)';
      }
      bookEl.style.transform = shift;
    }

    /* reading forward = StPageFlip backward */
    function goNext(){ if (flip) flip.flipPrev('bottom'); }
    function goPrev(){ if (flip) flip.flipNext('bottom'); }
    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);
    document.addEventListener('keydown', function(e){
      if (e.altKey || e.ctrlKey || e.metaKey || !flip || !desktop.matches) return;
      var t = e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      var ov = document.getElementById('ctOverlay');
      if (ov && !ov.hidden) return;
      if (e.key === 'ArrowLeft'){ e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowRight'){ e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape' && previewEl.classList.contains('fb-pseudo-fs')) pseudoFs(false);
    });

    /* ---------- drawing pages, nearest first ---------- */
    function wantedWidth(){
      var b = flip && flip.getBoundsRect();
      var pw = b ? b.pageWidth : parseFloat(bookEl.style.maxWidth) / 2;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      return Math.min(Math.round(pw * dpr), MAX_PX);
    }

    function pump(){
      if (busy || !doc || !desktop.matches) return;
      if (flip && flip.getState() !== 'read') return;   /* resumes on the next 'read' state */
      var want = wantedWidth(), vis = visibleReading(), cur = vis[0], best = null;
      pages.forEach(function(p){
        if (!p.num || p.width >= want * 0.85) return;
        if (!best || Math.abs(p.r - cur) < Math.abs(best.r - cur)) best = p;
      });
      if (!best) return;
      busy = true;
      drawPage(best.num, want).then(function(res){
        best.width = res.width;
        return showImg(best.el, res.url);
      }).catch(function(){
        best.width = Infinity;       /* don't loop on a broken page; its spinner stays */
      }).then(function(){
        busy = false;
        if (best.r === 0) bookEl.classList.add('ready');
        pump();
      });
    }

    /* ---------- page-turn sound (synthesised, no file to load) ---------- */
    var audioCtx = null, muted = false, lastSound = 0;
    try { muted = localStorage.getItem('merabti:flipSound') === 'off'; } catch (e) { /* ignore */ }
    setSoundUi();
    soundBtn.addEventListener('click', function(){
      muted = !muted;
      try { localStorage.setItem('merabti:flipSound', muted ? 'off' : 'on'); } catch (e) { /* ignore */ }
      setSoundUi();
    });
    function setSoundUi(){
      var label = muted ? 'تشغيل صوت التقليب' : 'كتم صوت التقليب';
      soundBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      soundBtn.title = label;
      soundBtn.setAttribute('aria-label', label);
    }
    function playFlip(){
      if (muted) return;
      var now = Date.now();
      if (now - lastSound < 250) return;
      lastSound = now;
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = audioCtx || new AC();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        var t = audioCtx.currentTime, dur = 0.3, rate = audioCtx.sampleRate;
        var buf = audioCtx.createBuffer(1, Math.floor(rate * dur), rate);
        var d = buf.getChannelData(0);
        for (var k = 0; k < d.length; k++){
          var x = k / d.length;
          d[k] = (Math.random() * 2 - 1) * Math.pow(1 - x, 1.6) * (0.65 + 0.35 * Math.sin(x * 38));
        }
        var src = audioCtx.createBufferSource();
        src.buffer = buf;
        var band = audioCtx.createBiquadFilter();
        band.type = 'bandpass';
        band.Q.value = 0.9;
        band.frequency.setValueAtTime(3400, t);
        band.frequency.exponentialRampToValueAtTime(800, t + dur);
        var gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(band); band.connect(gain); gain.connect(audioCtx.destination);
        src.start(t);
        src.stop(t + dur);
      } catch (e) { /* no sound, no problem */ }
    }

    /* ---------- full screen ---------- */
    function fsElement(){ return document.fullscreenElement || document.webkitFullscreenElement || null; }
    function isFull(){ return !!fsElement() || previewEl.classList.contains('fb-pseudo-fs'); }
    function toggleFull(){
      if (fsElement()){
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else if (previewEl.classList.contains('fb-pseudo-fs')){
        pseudoFs(false);
      } else if (previewEl.requestFullscreen){
        previewEl.requestFullscreen().catch(function(){ pseudoFs(true); });
      } else if (previewEl.webkitRequestFullscreen){
        previewEl.webkitRequestFullscreen();
      } else {
        pseudoFs(true);              /* no element full screen in this browser */
      }
    }
    function pseudoFs(on){
      previewEl.classList.toggle('fb-pseudo-fs', on);
      document.body.classList.toggle('fb-lock', on);
      setFullUi();
      relayout();
    }
    function setFullUi(){
      var on = isFull();
      fullBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      fullBtn.querySelector('span').textContent = on ? 'خروج من ملء الشاشة' : 'ملء الشاشة';
      fullBtn.title = on ? 'خروج من ملء الشاشة' : 'ملء الشاشة';
    }
    fullBtn.addEventListener('click', toggleFull);
    document.addEventListener('fullscreenchange', function(){ setFullUi(); relayout(); });
    document.addEventListener('webkitfullscreenchange', function(){ setFullUi(); relayout(); });
    setFullUi();

    return { init: init, isFull: isFull, toggleFull: toggleFull };
  })();
})();

/* =====================================================================
   Phones: fixed "order" button at the bottom of the screen, hidden while
   the order block itself is on screen.
===================================================================== */
(function(){
  var cta = document.getElementById('mCta');
  var box = document.getElementById('buyBox');
  if (!cta || !box) return;
  cta.addEventListener('click', function(e){
    e.preventDefault();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    box.classList.remove('flash');
    void box.offsetWidth;
    box.classList.add('flash');
  });
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      cta.classList.toggle('off', entries[0].isIntersecting);
    }, { threshold: 0.25 }).observe(box);
  }
})();
