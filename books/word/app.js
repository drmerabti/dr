/* =====================================================================
   Word book page — preview pages rendered with pdf.js, one under the
   other. Each page is drawn only when it scrolls near view, then kept as
   a JPEG <img> (lighter than a live canvas on phones).
   Payment buttons stay disabled until Chargily / Gumroad are wired.
===================================================================== */
(function(){
  var PDF_URL = 'preview/word-book-preview.pdf';
  var TOTAL_PAGES = 202;
  var MAX_PX = 1700;                 /* cap on the rendered bitmap width */

  var pagesEl = document.getElementById('pages');
  var statusEl = document.getElementById('pvStatus');
  var previewEl = document.getElementById('preview');
  var counterEl = document.getElementById('pvCounter');
  var desktop = window.matchMedia('(min-width: 861px)');

  /* ---------- "get the full book" button under the last page ---------- */
  document.getElementById('goBuy').addEventListener('click', function(){
    var box = document.getElementById('buyBox');
    box.scrollIntoView({ behavior: 'smooth', block: desktop.matches ? 'end' : 'center' });
    box.classList.remove('flash');
    void box.offsetWidth;
    box.classList.add('flash');
  });

  if (!window.pdfjsLib){ fail(); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var doc = null;
  var slots = [];                    /* { el, num, width (rendered px), busy } */
  var observer = null;

  pdfjsLib.getDocument(PDF_URL).promise.then(function(pdf){
    doc = pdf;
    return pdf.getPage(1);
  }).then(function(first){
    var vp = first.getViewport({ scale: 1 });
    var ratio = (vp.width / vp.height).toFixed(4);
    var n = doc.numPages;

    document.getElementById('pvCount').textContent = n;
    document.getElementById('pvRest').textContent = 'باقي ' + (TOTAL_PAGES - n) + ' صفحة من الفصول العشرة بانتظارك';
    statusEl.remove();

    for (var i = 1; i <= n; i++){
      var el = document.createElement('div');
      el.className = 'pv-page';
      el.style.setProperty('--ar', ratio);
      el.dataset.num = i;
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'صفحة ' + i + ' من المعاينة');
      pagesEl.appendChild(el);
      slots.push({ el: el, num: i, width: 0, busy: false });
    }
    watch();
    updateCounter();
  }).catch(fail);

  function fail(){
    statusEl.innerHTML = 'تعذّر عرض المعاينة هنا. <a href="' + PDF_URL + '" target="_blank" rel="noopener">افتح ملف المعاينة</a>';
  }

  /* ---------- lazy rendering ---------- */
  function watch(){
    if (observer) observer.disconnect();
    /* on desktop the preview column is the scroller; on phones the page is */
    observer = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) render(slots[+e.target.dataset.num - 1]);
      });
    }, { root: desktop.matches ? previewEl : null, rootMargin: '900px 0px' });
    slots.forEach(function(s){ observer.observe(s.el); });
  }

  function wantedWidth(s){
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    return Math.min(Math.round(s.el.clientWidth * dpr), MAX_PX);
  }

  function render(s){
    var w = wantedWidth(s);
    if (s.busy || !w || s.width >= w * 0.85) return;
    s.busy = true;
    doc.getPage(s.num).then(function(page){
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
        var img = s.el.querySelector('img') || document.createElement('img');
        var old = img.src;
        img.alt = '';
        img.draggable = false;
        img.src = URL.createObjectURL(blob);
        if (old) URL.revokeObjectURL(old);
        if (!img.parentNode) s.el.appendChild(img);
        s.el.classList.add('done');
        s.width = canvas.width;
        canvas.width = canvas.height = 0;
        page.cleanup();
      });
    }).catch(function(){ /* leave the placeholder; it retries when seen again */ })
      .then(function(){ s.busy = false; });
  }

  /* wider window (or phone ↔ desktop switch): sharpen what is near view */
  var resizeT = 0;
  window.addEventListener('resize', function(){
    clearTimeout(resizeT);
    resizeT = setTimeout(function(){ if (doc) watch(); }, 250);
  });
  if (desktop.addEventListener) desktop.addEventListener('change', function(){ if (doc) watch(); });

  /* ---------- "page x / n" pill ---------- */
  var counterT = 0, ticking = false;
  function updateCounter(){
    ticking = false;
    if (!slots.length) return;
    var mid = window.innerHeight / 2, cur = 1;
    for (var i = 0; i < slots.length; i++){
      var r = slots[i].el.getBoundingClientRect();
      if (r.top <= mid) cur = i + 1; else break;
    }
    counterEl.textContent = cur + ' / ' + slots.length;
  }
  function onScroll(){
    if (previewEl.getBoundingClientRect().top > window.innerHeight / 2) return;
    if (!ticking){ ticking = true; requestAnimationFrame(updateCounter); }
    counterEl.classList.add('on');
    clearTimeout(counterT);
    counterT = setTimeout(function(){ counterEl.classList.remove('on'); }, 1200);
  }
  previewEl.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
