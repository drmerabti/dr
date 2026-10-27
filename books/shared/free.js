/* =====================================================================
   Free book pages (books/word-shortcuts/, books/python/) — loaded after
   ../word/app.js (which builds the book, the phone list and the fixed
   phone button).
   Here: download / share buttons and click counts on the other-books
   banner. The book comes from <body data-book data-share>, the link from
   <link rel="canonical">.
===================================================================== */
(function(){
  var BOOK = document.body.getAttribute('data-book');
  var canon = document.querySelector('link[rel="canonical"]');
  var PAGE_URL = canon ? canon.href : location.href;
  var SHARE_TEXT = document.body.getAttribute('data-share') || document.title;

  function track(name, params){
    try { if (window.gtag) gtag('event', name, params); } catch (e) { /* ignore */ }
  }

  document.getElementById('dlBtn').addEventListener('click', function(){
    track('book_download', { book: BOOK });
  });

  /* banner, last page (cloned from a <template>, so listen on the document) */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-more]');
    if (a) track('book_more_click', { book: BOOK, place: a.getAttribute('data-more') });
  });

  /* ---------- share: the system share sheet, or copy the link ---------- */
  var shareBtn = document.getElementById('shareBtn');
  var label = shareBtn.querySelector('strong');
  var labelText = label.textContent, resetT = 0;

  shareBtn.addEventListener('click', function(){
    track('book_share', { book: BOOK });
    if (navigator.share){
      navigator.share({ title: document.title, text: SHARE_TEXT, url: PAGE_URL }).catch(function(){ /* closed */ });
      return;
    }
    copy(PAGE_URL).then(function(ok){
      say(ok ? 'تم نسخ رابط الكتاب ✓' : PAGE_URL, ok);
    });
  });

  function say(text, ok){
    label.textContent = text;
    shareBtn.classList.toggle('done', !!ok);
    clearTimeout(resetT);
    resetT = setTimeout(function(){
      label.textContent = labelText;
      shareBtn.classList.remove('done');
    }, 3000);
  }

  function copy(text){
    if (navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text).then(function(){ return true; }, function(){ return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    shareBtn.focus();
    return ok;
  }
})();
