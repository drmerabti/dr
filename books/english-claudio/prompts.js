/* =====================================================================
   English with Claudio — prompts page: one tap on «نسخ» copies the text
   of its frame exactly as written (placeholders [..] included), and the
   button says «تم النسخ ✓» for 2 seconds.
===================================================================== */
(function(){
  var BOOK = document.body.getAttribute('data-book');

  function track(name, params){
    try { if (window.gtag) gtag('event', name, params); } catch (e) { /* ignore */ }
  }

  document.querySelectorAll('.pr-copy').forEach(function(btn){
    var box = btn.closest('.pr-box');
    var label = btn.querySelector('span');
    var labelText = label.textContent, resetT = 0;

    btn.addEventListener('click', function(){
      var text = box.querySelector('.pr-text').textContent;
      copy(text, btn).then(function(ok){
        if (!ok){ selectText(box.querySelector('.pr-text')); return; }   /* let the reader copy it by hand */
        label.textContent = 'تم النسخ ✓';
        btn.classList.add('done');
        box.classList.add('copied');
        clearTimeout(resetT);
        resetT = setTimeout(function(){
          label.textContent = labelText;
          btn.classList.remove('done');
          box.classList.remove('copied');
        }, 2000);
        track('prompt_copy', { book: BOOK, prompt: box.id });
      });
    });
  });

  var dl = document.getElementById('prDl');
  if (dl) dl.addEventListener('click', function(){ track('book_download', { book: BOOK, place: 'prompts' }); });

  /* ---------- copy: Clipboard API, or the old way (older phones, http) ---------- */
  function copy(text, focusBack){
    if (navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text).then(function(){ return true; }, function(){ return legacyCopy(text, focusBack); });
    }
    return Promise.resolve(legacyCopy(text, focusBack));
  }

  function legacyCopy(text, focusBack){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px;';   /* 16px: no zoom on iPhone */
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    focusBack.focus();
    return ok;
  }

  function selectText(el){
    var sel = window.getSelection(), range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();
