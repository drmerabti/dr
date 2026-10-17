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
   Word book page — the preview is shown as a real book (StPageFlip, pages
   drawn with pdf.js). It opens right-to-left: StPageFlip only turns
   left-to-right, so the pages are handed to it in reverse order and the
   book starts on its last index (the Arabic front cover).
   Every page is drawn to a JPEG before it is reached (nearest pages
   first, never during a page turn); until then it shows a spinner.
   Computers: the book turns its pages by itself, slowly, until the
   visitor takes over (pointer on the book, keys, arrows).
   Orders go by e-mail or WhatsApp (order block first, so a failed
   pdf.js load can never take the buttons down with it).
===================================================================== */
(function(){
  var PDF_URL = 'preview/word-book-preview.pdf';
  var TOTAL_PAGES = 202;
  var MAX_PX = 1800;                 /* cap on the rendered bitmap width (computers) */
  var MAX_PX_PHONE = 1000;           /* phones: sharp enough, light to turn */
  var MIN_PAGE = 280;                /* narrower pages → one page at a time */
  var USER_FLIP_MS = 700;            /* page turn by the visitor */
  var AUTO_FLIP_MS = 1300;           /* slow page turn while auto-playing (≈1.2 s on screen) */
  var AUTO_EVERY = 4000;             /* one auto page turn every ~4 s */
  var AUTO_RESUME = 5000;            /* auto-play comes back 5 s after the visitor leaves */

  var previewEl = document.getElementById('preview');
  var stage = document.getElementById('fbStage');
  var bookEl = document.getElementById('fbBook');
  var statusEl = document.getElementById('pvStatus');
  var counterEl = document.getElementById('pvCounter');
  var prevBtn = document.getElementById('fbPrev');
  var nextBtn = document.getElementById('fbNext');
  var soundBtn = document.getElementById('fbSound');
  var fullBtn = document.getElementById('fbFull');
  var desktop = window.matchMedia('(min-width: 861px)');
  var hintEl = document.getElementById('fbHint');
  var coverImg = document.getElementById('bkCover');

  var doc = null, flip = null, ratio = 0.708, n = 0, total = 0;
  var pages = [];                    /* reading order: { el, r, num (0 = end page), width, busy } */
  var busy = false;

  if (!window.pdfjsLib || !window.St){ fail(); return; }
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
    build();
  }).catch(fail);

  function fail(){
    statusEl.innerHTML = 'تعذّر عرض المعاينة هنا. <a href="' + PDF_URL + '" target="_blank" rel="noopener">افتح ملف المعاينة</a>';
  }

  /* ---------- book ---------- */
  function build(){
    for (var r = 0; r < total; r++){
      var el = document.createElement('div');
      el.className = 'fb-page';
      var p = { el: el, r: r, num: r < n ? r + 1 : 0, width: 0, busy: false };
      if (p.num){
        el.innerHTML = '<span class="fb-shade"></span><span class="fb-spin" aria-hidden="true"></span>';
        el.setAttribute('aria-label', 'صفحة ' + p.num + ' من المعاينة');
      } else {
        el.className += ' fb-page-end done';
        el.appendChild(document.getElementById('fbEndTpl').content.cloneNode(true));
        el.insertAdjacentHTML('afterbegin', '<span class="fb-shade"></span>');
        el.querySelector('#pvRest').textContent = 'باقي ' + (TOTAL_PAGES - n) + ' صفحة من الفصول العشرة بانتظارك';
        el.querySelector('#goBuy').addEventListener('click', goBuy);
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
      startPage: total - 1,          /* the front cover */
      flippingTime: USER_FLIP_MS,
      maxShadowOpacity: 0.45,
      mobileScrollSupport: true
    });
    flip.loadFromHTML(libOrder);
    sizeBook();                      /* StPageFlip resets max-width once, at start */
    flip.update();
    flip.on('init', function(){ updateNav(); pump(); });
    flip.on('flip', function(){ updateNav(); });
    flip.on('changeOrientation', function(){ updateNav(); pump(); });
    flip.on('changeState', function(e){
      /* 'flipping' = turned by click / arrows / keys / auto-play; 'user_fold' = lifted by a drag */
      if (e.data === 'flipping' || e.data === 'user_fold'){
        playFlip();
        bookEl.style.transform = '';   /* leaving a lone cover: slide back while the page turns */
      }
      if (e.data === 'user_fold') userActed();
      if (e.data === 'read'){ setFlipTime(USER_FLIP_MS); pump(); }   /* draw only between page turns */
    });
    pump();
  }

  /* width of the book box: two pages side by side on computers, one on phones */
  function sizeBook(){
    var fs = isFull();
    var cs = getComputedStyle(stage);
    var w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var h;
    if (desktop.matches || fs){
      h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    } else {                         /* phones: full width, as long as the page fits on the screen */
      h = window.innerHeight - 56 - 16;
    }
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
    requestAnimationFrame(function(){
      sizeBook();
      if (flip){ flip.update(); updateNav(); pump(); }
    });
  }
  /* phones fire resize while scrolling (address bar): only a width change matters there */
  var resizeT = 0, lastW = window.innerWidth;
  window.addEventListener('resize', function(){
    if (!desktop.matches && !isFull() && window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(resizeT);
    resizeT = setTimeout(relayout, 120);
  });
  if (desktop.addEventListener) desktop.addEventListener('change', relayout);

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
  nextBtn.addEventListener('click', function(){ userActed(); goNext(); });
  prevBtn.addEventListener('click', function(){ userActed(); goPrev(); });
  document.addEventListener('keydown', function(e){
    if (e.altKey || e.ctrlKey || e.metaKey || !flip) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    var ov = document.getElementById('ctOverlay');
    if (ov && !ov.hidden) return;
    if (e.key === 'ArrowLeft'){ e.preventDefault(); userActed(); goNext(); }
    else if (e.key === 'ArrowRight'){ e.preventDefault(); userActed(); goPrev(); }
    else if (e.key === 'Escape' && previewEl.classList.contains('fb-pseudo-fs')) pseudoFs(false);
  });

  function goBuy(){
    if (isFull()) toggleFull();
    var box = document.getElementById('buyBox');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.classList.remove('flash');
    void box.offsetWidth;
    box.classList.add('flash');
  }

  /* ---------- drawing pages, nearest first ---------- */
  function wantedWidth(){
    var b = flip && flip.getBoundsRect();
    var pw = b ? b.pageWidth : parseFloat(bookEl.style.maxWidth) / 2;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    return Math.min(Math.round(pw * dpr), desktop.matches ? MAX_PX : MAX_PX_PHONE);
  }

  function pump(){
    if (busy || !doc) return;
    if (flip && flip.getState() !== 'read') return;   /* resumes on the next 'read' state */
    var want = wantedWidth(), vis = visibleReading(), cur = vis[0], best = null;
    pages.forEach(function(p){
      if (!p.num || p.width >= want * 0.85) return;
      if (!best || Math.abs(p.r - cur) < Math.abs(best.r - cur)) best = p;
    });
    if (!best) return;
    busy = true;
    draw(best, want).then(function(){
      busy = false;
      if (best.r === 0){
        bookEl.classList.add('ready');
        startAuto();
        showHint();
      }
      pump();
    });
  }

  function draw(p, w){
    return doc.getPage(p.num).then(function(page){
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
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.alt = '';
        img.draggable = false;
        img.decoding = 'async';
        img.src = url;
        p.width = canvas.width;
        canvas.width = canvas.height = 0;
        page.cleanup();
        /* decode off the main path, then swap in one go (no half-drawn page) */
        return (img.decode ? img.decode() : Promise.resolve()).catch(function(){}).then(function(){
          var old = p.el.querySelector('img');
          if (old){
            if (coverImg && coverImg.src === old.src) coverImg.src = url;
            else URL.revokeObjectURL(old.src);
            old.remove();
          }
          p.el.insertBefore(img, p.el.firstChild);
          p.el.classList.add('done');
          /* no cover image on the server: show the drawn first page instead */
          if (p.num === 1 && coverImg && coverImg.classList.contains('missing')){
            coverImg.classList.remove('missing');
            coverImg.src = url;
          }
        });
      });
    }).catch(function(){
      p.width = Infinity;            /* don't loop on a broken page; its spinner stays */
    });
  }

  /* ---------- page-turn sound (synthesised, no file to load) ---------- */
  /* browsers block sound before the visitor's first gesture: start silent,
     switch on at the first click / tap / key */
  var audioCtx = null, muted = false, lastSound = 0, gesture = false;
  function unlockAudio(){
    gesture = true;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx || new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { /* ignore */ }
  }
  ['pointerdown', 'touchend', 'keydown'].forEach(function(ev){
    window.addEventListener(ev, unlockAudio, { capture: true, passive: true });
  });
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
    if (muted || !gesture || !audioCtx) return;
    var now = Date.now();
    if (now - lastSound < 250) return;
    lastSound = now;
    if (audioCtx.state === 'suspended') audioCtx.resume().then(swish, function(){});
    else swish();
  }
  function swish(){
    try {
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
      pseudoFs(true);                /* iPhone: no element full screen */
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
  fullBtn.addEventListener('click', function(){ userActed(); toggleFull(); });
  document.addEventListener('fullscreenchange', function(){ setFullUi(); relayout(); });
  document.addEventListener('webkitfullscreenchange', function(){ setFullUi(); relayout(); });
  setFullUi();

  /* ---------- auto-play (computers only) ---------- */
  var autoTimer = 0, hovering = false;
  var autoAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* StPageFlip scales its duration by the distance travelled (full time at 1000 px) */
  function setFlipTime(ms){
    if (!flip) return;
    var b = flip.getBoundsRect();
    var dist = Math.max(200, Math.min(1000, 2 * (b ? b.pageWidth : 500)));
    flip.getSettings().flippingTime = Math.round(ms * 1000 / dist);
  }

  function canAuto(){
    var ov = document.getElementById('ctOverlay');
    return autoAllowed && desktop.matches && flip && !hovering && !document.hidden &&
      !isFull() && !(ov && !ov.hidden);
  }
  function scheduleAuto(delay){
    clearTimeout(autoTimer);
    if (autoAllowed && desktop.matches && flip && !hovering) autoTimer = setTimeout(autoStep, delay);
  }
  function startAuto(){ scheduleAuto(AUTO_EVERY); }
  function autoStep(){
    /* full screen, an open window or a hidden tab: wait and look again */
    if (!canAuto()){ scheduleAuto(AUTO_RESUME); return; }
    if (flip.getState() !== 'read'){ scheduleAuto(800); return; }
    var vis = visibleReading();
    if (vis[vis.length - 1] === total - 1){       /* last page → softly back to the cover */
      bookEl.classList.add('fb-fade');
      setTimeout(function(){
        flip.turnToPage(total - 1);
        updateNav();
        bookEl.classList.remove('fb-fade');
        scheduleAuto(AUTO_EVERY);
      }, 450);
      return;
    }
    setFlipTime(AUTO_FLIP_MS);
    goNext();
    scheduleAuto(AUTO_EVERY);
  }
  /* the visitor is in control: hold auto-play, come back 5 s after the last action */
  function userActed(){
    hideHint();
    setFlipTime(USER_FLIP_MS);
    clearTimeout(autoTimer);
    if (!hovering) scheduleAuto(AUTO_RESUME);
  }
  bookEl.addEventListener('mouseenter', function(){ hovering = true; clearTimeout(autoTimer); });
  bookEl.addEventListener('mouseleave', function(){ hovering = false; scheduleAuto(AUTO_RESUME); });
  bookEl.addEventListener('pointerdown', userActed);
  if (desktop.addEventListener) desktop.addEventListener('change', function(){ scheduleAuto(AUTO_EVERY); });

  /* ---------- hint above the book, gone after a few seconds ---------- */
  var hintT = 0;
  function showHint(){
    if (!desktop.matches) hintEl.textContent = 'اسحب الصفحة يمينًا أو يسارًا للتقليب';
    hintEl.classList.add('on');
    hintT = setTimeout(hideHint, 6000);
  }
  function hideHint(){ clearTimeout(hintT); hintEl.classList.remove('on'); }
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
