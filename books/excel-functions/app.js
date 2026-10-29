/* =====================================================================
   PRICES — the only place to change the price of the book.
   After the launch offer: set offer to false (the badge disappears) and
   put the new price in dzd / usd.
===================================================================== */
var PRICES = {
  offer: false,                     /* true: launch badge above the prices */
  offerLabel: 'سعر الإطلاق 🔥',
  dzd: 500,                         /* Algerian dinar (دج) */
  usd: 3.99                         /* US dollar ($) */
};

function fillPrices(root){
  root.querySelectorAll('[data-price]').forEach(function(el){
    var k = el.getAttribute('data-price');
    el.textContent = k === 'usd' ? PRICES.usd.toFixed(2) : PRICES.dzd;
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
  var SUBJECT = 'طلب كتاب موسوعة دوال إكسل';
  var WA_NUMBER = '213663708148';
  var WA_SHOWN = '+213 663 70 81 48';
  var WA_TEXT = 'السلام عليكم، أريد طلب كتاب موسوعة دوال إكسل';

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
    try { if (window.gtag) gtag('event', 'book_order_click', { book: 'excel-functions', method: method }); } catch (e) { /* ignore */ }
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
   Free preview (files/excel-functions-preview.pdf: the first chapter), drawn with pdf.js. Two
   reading modes on every screen:
     book = a real book that opens right-to-left (StPageFlip),
     pdf  = pages one under the other, as in a PDF reader.
   The whole book is sent as a PDF after the order; it is not on the site.
===================================================================== */
(function(){
  'use strict';

  var previewEl = document.getElementById('preview');
  var PREVIEW_URL = previewEl.getAttribute('data-pdf');
  var TOTAL_PAGES = +previewEl.getAttribute('data-total') || 261;

  function track(name, params){
    try { if (window.gtag) gtag('event', name, Object.assign({ book: 'excel-functions' }, params || {})); } catch (e) { /* ignore */ }
  }

  /* end page of the preview: "order the book" → the order block */
  var mCta = document.getElementById('mCta');
  function goBuy(){
    var box = document.getElementById('buyBox');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.classList.remove('flash');
    void box.offsetWidth;
    box.classList.add('flash');
  }

  /* =================================================================
     Reader
  ================================================================= */
  var Reader = (function(){
    var MAX_PX = 1800, MAX_PX_LIST = 1400, MIN_PAGE = 280;
    var stage = document.getElementById('fbStage');
    var statusEl = document.getElementById('pvStatus');
    var statusTx = document.getElementById('pvStatusTx');
    var listEl = document.getElementById('pvList');
    var counterEl = document.getElementById('pvCounter');
    var prevBtn = document.getElementById('fbPrev');
    var nextBtn = document.getElementById('fbNext');
    var soundBtn = document.getElementById('fbSound');
    var fullBtn = document.getElementById('fbFull');
    var labelEl = document.getElementById('pvLabel');
    var desktop = window.matchMedia('(min-width: 861px)');
    var modeBtns = previewEl.querySelectorAll('.md-btn');

    var doc = null, ratio = 0.708, n = 0, total = 0, gen = 0;
    var drawn = {};
    var mode = 'book';
    try { mode = localStorage.getItem('merabti:excelVbaMode') || ''; } catch (e) { /* ignore */ }
    if (mode !== 'book' && mode !== 'pdf') mode = desktop.matches ? 'book' : 'pdf';

    if (!window.pdfjsLib){ statusTx.textContent = 'تعذّر عرض الكتاب هنا.'; return { load: function(){} }; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    function load(src){
      var my = ++gen;
      teardown();
      loading('جارٍ تحميل الكتاب…');
      return pdfjsLib.getDocument(src).promise.then(function(pdf){
        if (my !== gen){ pdf.destroy(); return; }
        doc = pdf;
        return pdf.getPage(1).then(function(first){
          if (my !== gen) return;
          var vp = first.getViewport({ scale: 1 });
          ratio = vp.width / vp.height;
          n = doc.numPages;
          total = n + 1;                 /* + the end page */
          if (total % 2) total++;        /* + a plain back cover, so the front cover opens alone */
          labelEl.innerHTML = '<span class="pv-label-long">المعاينة المجانية: </span><b>' + n + '</b> من ' + TOTAL_PAGES + ' صفحة';
          setMode(mode, true);
          Zoom.init();
        });
      }).catch(function(){
        if (my !== gen) return;
        message('تعذّر عرض الكتاب هنا. <a href="' + PREVIEW_URL + '" target="_blank" rel="noopener">افتح ملف المعاينة</a>');
      });
    }

    function teardown(){
      Book.destroy();
      List.destroy();
      Object.keys(drawn).forEach(function(k){ URL.revokeObjectURL(drawn[k].url); });
      drawn = {};
      if (doc){ try { doc.destroy(); } catch (e) { /* ignore */ } }
      doc = null; n = 0;
    }

    function loading(text){
      statusEl.hidden = false;
      statusEl.innerHTML = '<span class="fb-spin" aria-hidden="true"></span><span>' + text + '</span>';
      listEl.innerHTML = '<p class="pv-list-status">' + text + '</p>';
    }
    function message(html){
      statusEl.hidden = false;
      statusEl.innerHTML = html;
      listEl.innerHTML = '<p class="pv-list-status">' + html + '</p>';
    }

    /* ---------- reading mode ---------- */
    function setMode(m, force){
      if (m === mode && !force) return;
      mode = m;
      try { localStorage.setItem('merabti:excelVbaMode', m); } catch (e) { /* ignore */ }
      previewEl.classList.toggle('mode-book', m === 'book');
      previewEl.classList.toggle('mode-pdf', m === 'pdf');
      modeBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
      if (!doc) return;
      if (m === 'book'){ List.pause(); Book.init(); }
      else { List.init(); }
      track('book_mode', { mode: m });
    }
    modeBtns.forEach(function(b){
      b.addEventListener('click', function(){ setMode(b.getAttribute('data-mode')); });
    });
    previewEl.classList.add(mode === 'book' ? 'mode-book' : 'mode-pdf');
    modeBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false'); });

    /* ---------- one page to a JPEG (reused when sharp enough) ---------- */
    function drawPage(num, w){
      var have = drawn[num], my = gen;
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
          if (my !== gen) throw new Error('stale');
          var res = { url: URL.createObjectURL(blob), width: canvas.width };
          var old = drawn[num];
          drawn[num] = res;
          if (old) setTimeout(function(){ URL.revokeObjectURL(old.url); }, 4000);
          canvas.width = canvas.height = 0;
          page.cleanup();
          return res;
        });
      });
    }

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
      var frag = document.getElementById('endPreviewTpl').content.cloneNode(true);
      var btn = frag.querySelector('[data-buy]');
      if (btn) btn.addEventListener('click', function(){
        if (Book.isFull()) Book.toggleFull();
        track('book_preview_end_order');
        goBuy();
      });
      fillPrices(frag);
      return frag;
    }

    /* =================================================================
       PDF mode: pages one under the other
    ================================================================= */
    var List = (function(){
      var built = false, items = [], observer = null, queue = Promise.resolve(), zoomF = 1;

      function init(){
        if (!built){
          built = true;
          listEl.innerHTML = '';
          items = [];
          for (var i = 1; i <= n; i++){
            var box = document.createElement('div');
            box.className = 'pv-pg';
            box.style.aspectRatio = ratio.toFixed(4);
            box.setAttribute('role', 'img');
            box.setAttribute('aria-label', 'صفحة ' + i);
            listEl.appendChild(box);
            items.push({ el: box, num: i, width: 0, queued: false });
          }
          var end = document.createElement('div');
          end.className = 'pv-list-end';
          end.appendChild(endPage());
          listEl.appendChild(end);
        }
        watch();
      }

      /* computers: the list scrolls inside the reader; phones: the page scrolls */
      function watch(){
        if (observer) observer.disconnect();
        if (!built) return;
        observer = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if (e.isIntersecting) load(items[e.target.dataset.i]); });
        }, { root: desktop.matches ? listEl : null, rootMargin: '1200px 0px' });
        items.forEach(function(it, i){ it.el.dataset.i = i; observer.observe(it.el); });
      }

      function load(it){
        if (!it || mode !== 'pdf') return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.min(Math.round(it.el.clientWidth * dpr), Math.round(MAX_PX_LIST * Math.min(zoomF, 2.4)));
        if (!w || it.queued || it.width >= w * 0.85) return;
        it.queued = true;
        var my = gen;
        queue = queue.then(function(){
          if (my !== gen) return;
          return drawPage(it.num, w).then(function(res){
            it.width = res.width;
            return showImg(it.el, res.url);
          });
        }).catch(function(){}).then(function(){ it.queued = false; });
      }

      function zoom(f){
        zoomF = f;
        listEl.style.setProperty('--z', f);
        listEl.classList.toggle('zoomed', f > 1);
        if (built && mode === 'pdf') watch();
      }

      function pause(){ if (observer) observer.disconnect(); }
      function destroy(){
        pause();
        observer = null; built = false; items = [];
        listEl.innerHTML = '';
      }
      return { init: init, zoom: zoom, pause: pause, destroy: destroy, relayout: function(){ if (built && mode === 'pdf') watch(); } };
    })();

    /* =================================================================
       Book mode: the flipbook (StPageFlip turns left-to-right only, so the
       pages are handed to it in reverse order and it starts on its last
       index, the Arabic front cover)
    ================================================================= */
    var Book = (function(){
      var flip = null, pages = [], busy = false, built = false, zoomF = 1;
      var bookEl = document.getElementById('fbBook');

      function init(){
        if (built){ relayout(); return; }
        if (!window.St){ message('تعذّر عرض الكتاب على شكل كتاب. اختر PDF.'); return; }
        built = true;
        pages = [];
        for (var r = 0; r < total; r++){
          var el = document.createElement('div');
          el.className = 'fb-page';
          var p = { el: el, r: r, num: r < n ? r + 1 : 0, width: 0 };
          if (p.num){
            el.innerHTML = '<span class="fb-shade"></span><span class="fb-spin" aria-hidden="true"></span>';
            el.setAttribute('aria-label', 'صفحة ' + p.num);
          } else if (r === n){
            el.className += ' fb-page-end done';
            el.appendChild(endPage());
            el.insertAdjacentHTML('afterbegin', '<span class="fb-shade"></span>');
          } else {
            el.className += ' fb-page-end done';
            el.innerHTML = '<span class="fb-shade"></span>';
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
          startPage: total - 1,
          flippingTime: 700,
          maxShadowOpacity: 0.45,
          mobileScrollSupport: true
        });
        flip.loadFromHTML(libOrder);
        sizeBook();
        flip.update();
        flip.on('init', function(){ updateNav(); pump(); });
        flip.on('flip', function(){ updateNav(); pump(); });
        flip.on('changeOrientation', function(){ updateNav(); pump(); });
        flip.on('changeState', function(e){
          if (e.data === 'flipping' || e.data === 'user_fold'){
            playFlip();
            bookEl.style.transform = '';
          }
          if (e.data === 'read') pump();
        });
        pump();
      }

      /* StPageFlip removes its element on destroy: put a fresh one back */
      function destroy(){
        if (flip){ try { flip.destroy(); } catch (e) { /* ignore */ } }
        flip = null; built = false; pages = []; busy = false;
        if (!document.getElementById('fbBook')){
          bookEl = document.createElement('div');
          bookEl.className = 'fb-book';
          bookEl.id = 'fbBook';
          bookEl.setAttribute('dir', 'ltr');
          stage.insertBefore(bookEl, statusEl);
        } else {
          bookEl = document.getElementById('fbBook');
          bookEl.innerHTML = '';
          bookEl.className = 'fb-book';
          bookEl.removeAttribute('style');
        }
        counterEl.innerHTML = '&nbsp;';
      }

      function sizeBook(){
        var fs = isFull();
        var cs = getComputedStyle(stage);
        var w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        var h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        var two = Math.min(w / 2, h * ratio);
        var one = Math.min(w, h * ratio);
        var wantTwo = (desktop.matches || (fs && window.innerWidth > window.innerHeight)) && two >= MIN_PAGE;
        var bookW = wantTwo ? two * 2 : Math.min(one, MIN_PAGE * 2 - 2);
        bookW = Math.floor(Math.max(Math.floor(bookW), MIN_PAGE) * zoomF);
        bookEl.style.width = zoomF > 1 ? bookW + 'px' : '100%';
        bookEl.style.maxWidth = bookW + 'px';
      }

      function relayout(){
        if (!flip || mode !== 'book') return;
        requestAnimationFrame(function(){
          if (!flip) return;
          sizeBook();
          flip.update();
          updateNav();
          pump();
        });
      }

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
        nextBtn.disabled = vis[vis.length - 1] >= n;
        var shift = '';
        if (flip && flip.getOrientation() === 'landscape' && vis.length === 1){
          shift = vis[0] === 0 ? 'translateX(25%)' : 'translateX(-25%)';
        }
        bookEl.style.transform = shift;
      }

      function goNext(){ if (flip) flip.flipPrev('bottom'); }
      function goPrev(){ if (flip) flip.flipNext('bottom'); }
      nextBtn.addEventListener('click', goNext);
      prevBtn.addEventListener('click', goPrev);
      document.addEventListener('keydown', function(e){
        if (e.altKey || e.ctrlKey || e.metaKey || !flip || mode !== 'book') return;
        var t = e.target.tagName;
        if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
        var ov = document.getElementById('ctOverlay');
        if (ov && !ov.hidden) return;                                          /* order window open */
        if (e.key === 'ArrowLeft'){ e.preventDefault(); goNext(); }
        else if (e.key === 'ArrowRight'){ e.preventDefault(); goPrev(); }
        else if (e.key === 'Escape' && previewEl.classList.contains('fb-pseudo-fs')) pseudoFs(false);
      });

      function wantedWidth(){
        var b = flip && flip.getBoundsRect();
        var pw = b ? b.pageWidth : parseFloat(bookEl.style.maxWidth) / 2;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        return Math.min(Math.round(pw * dpr), zoomF > 1 ? 3200 : MAX_PX);
      }

      function pump(){
        if (busy || !doc || !flip || mode !== 'book') return;
        if (flip.getState() !== 'read') return;
        var want = wantedWidth(), vis = visibleReading(), cur = vis[0], best = null, bestW = 0;
        var base = Math.min(want, Math.round(want / zoomF));
        pages.forEach(function(p){
          if (!p.num) return;
          var w = Math.abs(p.r - cur) <= 3 ? want : base;
          if (p.width >= w * 0.85) return;
          if (!best || Math.abs(p.r - cur) < Math.abs(best.r - cur)){ best = p; bestW = w; }
        });
        if (!best) return;
        busy = true;
        var my = gen;
        drawPage(best.num, bestW).then(function(res){
          if (my !== gen) return;
          best.width = res.width;
          return showImg(best.el, res.url);
        }).catch(function(){
          best.width = Infinity;
        }).then(function(){
          if (my !== gen) return;
          busy = false;
          if (best.r === 0) bookEl.classList.add('ready');
          pump();
        });
      }

      /* ---------- page-turn sound (synthesised) ---------- */
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
          pseudoFs(true);
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
      document.addEventListener('fullscreenchange', function(){ setFullUi(); relayout(); List.relayout(); });
      document.addEventListener('webkitfullscreenchange', function(){ setFullUi(); relayout(); List.relayout(); });
      setFullUi();

      function zoom(f){
        var cx = 0.5, cy = 0.5;
        if (zoomF > 1){
          cx = (stage.scrollLeft + stage.clientWidth / 2) / stage.scrollWidth;
          cy = (stage.scrollTop + stage.clientHeight / 2) / stage.scrollHeight;
        }
        zoomF = f;
        stage.classList.toggle('zoomed', f > 1);
        if (!flip || mode !== 'book') return;
        sizeBook();
        flip.update();
        updateNav();
        if (f > 1){
          stage.scrollLeft = cx * stage.scrollWidth - stage.clientWidth / 2;
          stage.scrollTop = cy * stage.scrollHeight - stage.clientHeight / 2;
        }
        pump();
      }

      return { init: init, destroy: destroy, relayout: relayout, isFull: isFull, toggleFull: toggleFull, zoom: zoom };
    })();

    var resizeT = 0, lastW = window.innerWidth;
    window.addEventListener('resize', function(){
      clearTimeout(resizeT);
      resizeT = setTimeout(function(){
        Book.relayout();
        if (window.innerWidth !== lastW){ lastW = window.innerWidth; List.relayout(); }   /* phones: the address bar changes the height only */
      }, 120);
    });
    if (desktop.addEventListener) desktop.addEventListener('change', function(){ List.relayout(); Book.relayout(); });

    /* =================================================================
       Zoom bar as in Word / Excel: − [slider] + 100 %
    ================================================================= */
    var Zoom = (function(){
      var MIN = 100, MAX = 300, STEP = 10;
      var z = 100, ready = false, outB, inB, range, pct;

      function init(){
        if (ready) return;
        var ui = document.getElementById('pvZoom');
        if (!ui) return;
        ready = true;
        ui.hidden = false;
        outB = ui.querySelector('.zb-out');
        inB = ui.querySelector('.zb-in');
        range = ui.querySelector('.zb-range');
        pct = ui.querySelector('.zb-pct');
        range.min = MIN; range.max = MAX; range.step = STEP;
        outB.addEventListener('click', function(){ set(z - STEP); });
        inB.addEventListener('click', function(){ set(z + STEP); });
        range.addEventListener('input', function(){ set(+range.value); });
        pct.addEventListener('click', function(){ set(100); });
        previewEl.addEventListener('wheel', function(e){
          if (!e.ctrlKey) return;
          e.preventDefault();
          set(z + (e.deltaY < 0 ? STEP : -STEP));
        }, { passive: false });
        sync();
      }
      function set(v){
        v = Math.min(MAX, Math.max(MIN, Math.round(v / STEP) * STEP));
        if (v === z) return;
        z = v;
        sync();
        Book.zoom(z / 100);
        List.zoom(z / 100);
      }
      function sync(){
        range.value = z;
        range.style.setProperty('--fill', ((z - MIN) / (MAX - MIN) * 100) + '%');
        pct.textContent = z + '%';
        pct.title = z === 100 ? 'التكبير' : 'العودة إلى 100%';
        outB.disabled = z <= MIN;
        inB.disabled = z >= MAX;
      }
      return { init: init };
    })();

    return { load: load };
  })();

  Reader.load(PREVIEW_URL);

  /* =================================================================
     Phones: fixed "order" button, hidden while the order block is on screen
  ================================================================= */
  (function(){
    var box = document.getElementById('buyBox');
    mCta.addEventListener('click', function(e){
      e.preventDefault();
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      box.classList.remove('flash');
      void box.offsetWidth;
      box.classList.add('flash');
    });
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(entries){
        mCta.classList.toggle('off', entries[0].isIntersecting);
      }, { threshold: 0.25 }).observe(box);
    }
  })();
})();
