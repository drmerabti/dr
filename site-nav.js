/* =====================================================================
   Shared site navigation — loaded at the end of every page.
   - Adds the "Contact us" outline button to the page header, next to the
     login button when the page has one. Headers differ between pages, so
     the button goes into the first slot found in place().
   - Styles the footer links row (about / privacy / contact) that every
     page carries in its HTML.
===================================================================== */
(function(){
  var script = document.currentScript;
  var base = script ? script.src.replace(/[^\/?#]*([?#].*)?$/, '') : '/';
  var CONTACT_URL = base + 'contact.html';
  var LABELS = { ar: 'اتصل بنا', en: 'Contact us', fr: 'Contactez-nous' };
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>';

  var CSS = [
    '.mrb-contact{',
    '  --mrb-h: 40px;',
    '  display:inline-flex; align-items:center; justify-content:center; gap:7px;',
    '  height:var(--mrb-h); min-width:var(--mrb-h); box-sizing:border-box;',
    '  padding:0 14px; flex-shrink:0;',
    '  --mrb-c: var(--ui-brand, var(--accent, #2F5CA8));',
    '  border:1.5px solid var(--mrb-c);',
    '  border-radius:999px; background:transparent;',
    '  color:var(--mrb-c);',
    '  font-family:inherit; font-size:.84rem; font-weight:700; line-height:1;',
    '  text-decoration:none; white-space:nowrap; cursor:pointer;',
    '  transition:background .15s ease, color .15s ease, box-shadow .15s ease;',
    '}',
    '.mrb-contact:hover{ background:var(--ui-brand-soft, rgba(127,127,127,.12)); text-decoration:none; }',
    '.mrb-contact:focus-visible{ outline:2px solid var(--mrb-c); outline-offset:2px; }',
    '.mrb-contact svg{ width:17px; height:17px; flex-shrink:0; }',
    /* next to the login button: same height, and same width where the
       login button has a fixed slot (.ui-v2 pages) */
    '.mrb-contact.mrb-by-auth{ --mrb-h: var(--ui-ctl-h, 42px); }',
    '.ui-v2 .mrb-contact.mrb-by-auth{ width:var(--ui-auth-w, auto); }',
    /* headers without an actions group: push the button to the far end */
    '.mrb-contact.mrb-push{ margin-inline-start:auto; }',
    /* pages without any header */
    '.mrb-contact.mrb-float{ position:fixed; top:12px; inset-inline-end:12px; z-index:60; background:var(--ui-surface, #fff); }',
    /* phones: icon-only circle so the header stays on one row */
    '@media (max-width: 640px){',
    '  .mrb-contact{ padding:0; width:var(--mrb-h) !important; }',
    '  .mrb-contact .mrb-contact-txt{ display:none; }',
    /* same phone spacing the .ui-v2 header already uses, so the extra
       button fits next to the login button on the other pages too */
    '  .topbar-inner:has(> .topbar-actions > #authWrap){ padding-inline:16px; }',
    '  .topbar-actions:has(> #authWrap){ gap:6px; }',
    '  .mrb-compact .ui-v2 .topbar .brand{ font-size:0; gap:0; }',
    '}',
    /* footer links row */
    '.footer-links{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:6px; font-size:.82rem; }',
    '.mrb-footer{ text-align:center; padding:18px 16px 28px; font-size:.82rem; opacity:.85; }',
    '.mrb-footer .footer-links{ margin-top:0; }',
    '.mrb-footer a{ color:inherit; }',
    '@media print{ .mrb-contact, .footer-links, .mrb-footer{ display:none !important; } }'
  ].join('\n');

  function currentLabel(){
    var l = (document.documentElement.lang || 'ar').slice(0, 2).toLowerCase();
    return LABELS[l] || LABELS.ar;
  }

  /* Take the height and text colour of the control the button sits next
     to, so it lines up and stays readable on dark or coloured headers. */
  function matchNeighbour(btn){
    var ref = btn.nextElementSibling || btn.previousElementSibling;
    if (!ref) return;
    var h = ref.getBoundingClientRect().height;
    if (h >= 28 && h <= 52) btn.style.setProperty('--mrb-h', Math.round(h) + 'px');
    /* colour from a plain control, not a highlighted one (white text on a
       filled primary button would vanish on a light header) */
    var sibs = Array.prototype.filter.call(btn.parentNode.children, function(el){
      return el !== btn && !/primary|accent|active|danger|pdf/i.test(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className);
    });
    var plain = sibs.indexOf(ref) >= 0 ? ref : sibs[0];
    var c = plain && getComputedStyle(plain).color;
    if (c) btn.style.setProperty('--mrb-c', c);
  }

  /* Some tool toolbars are already full on narrow phones: there the header
     button steps aside (the footer keeps the contact link) rather than
     pushing the page sideways. */
  function overflow(btn){
    var bar = btn.parentNode && btn.parentNode.closest('header, .topbar, .topbar-inner') || btn.parentNode;
    var out = document.documentElement.scrollWidth - window.innerWidth;
    if (bar){
      out = Math.max(out, bar.scrollWidth - bar.clientWidth);
      var els = bar.querySelectorAll(':scope > *, :scope > * > *');
      for (var i = 0; i < els.length; i++){
        if (els[i] === btn) continue;
        var r = els[i].getBoundingClientRect();
        if (r.width) out = Math.max(out, -r.left, r.right - window.innerWidth);
      }
    }
    return out;
  }
  function fit(btn){
    if (btn.classList.contains('mrb-float')) return;
    var root = document.documentElement;
    root.classList.remove('mrb-compact');
    btn.style.display = 'none';
    var before = Math.max(overflow(btn), 0) + 1;
    btn.style.display = '';
    if (overflow(btn) <= before) return;
    /* first try the homepage's phone header: round logo without the name */
    if (document.querySelector('.ui-v2 .topbar .brand')){
      root.classList.add('mrb-compact');
      if (overflow(btn) <= before) return;
      root.classList.remove('mrb-compact');
    }
    btn.style.display = 'none';
  }

  function place(btn){
    var auth = document.getElementById('authWrap');
    if (auth && auth.parentNode){
      btn.classList.add('mrb-by-auth');
      auth.parentNode.insertBefore(btn, auth);
      /* a page whose own CSS leaves this group as a block would stack them */
      if (!/flex|grid/.test(getComputedStyle(auth.parentNode).display)){
        auth.parentNode.style.cssText += ';display:flex;align-items:center;gap:8px;';
      }
      return;
    }
    var fill = document.querySelector('header.tb > .tb-fill');
    if (fill){
      fill.parentNode.insertBefore(btn, fill.nextSibling);
      matchNeighbour(btn);
      return;
    }
    var actions = document.querySelector('.topbar-actions, .tb-actions, .top-actions, .sf-actions, .uc-actions');
    if (actions){
      actions.insertBefore(btn, actions.firstChild);
      matchNeighbour(btn);
      return;
    }
    var bar = document.querySelector('.topbar-inner') || document.querySelector('.topbar, header');
    if (bar){
      var last = bar.lastElementChild;
      btn.classList.add('mrb-push');
      /* keep a trailing control group (language switch…) at the very end */
      if (last && bar.children.length > 1){
        /* that group may already be pushed to the end by its own auto
           margin: the button now does the pushing for both */
        var pushed = parseFloat(getComputedStyle(last).marginInlineStart) > 24;
        bar.insertBefore(btn, last);
        if (pushed) last.style.marginInlineStart = '0';
      }
      else bar.appendChild(btn);
      matchNeighbour(btn);
      return;
    }
    btn.classList.add('mrb-float');
    document.body.appendChild(btn);
  }

  function init(){
    if (document.querySelector('.mrb-contact')) return;
    var style = document.createElement('style');
    style.id = 'mrbSiteNavStyle';
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('a');
    btn.className = 'mrb-contact';
    btn.href = CONTACT_URL;
    btn.innerHTML = ICON + '<span class="mrb-contact-txt"></span>';
    var txt = btn.querySelector('.mrb-contact-txt');
    function relabel(){
      var label = currentLabel();
      txt.textContent = label;
      btn.setAttribute('aria-label', label);
      btn.title = label;
      if (btn.parentNode) fit(btn);
    }
    relabel();
    place(btn);
    fit(btn);
    var timer;
    window.addEventListener('resize', function(){
      clearTimeout(timer);
      timer = setTimeout(function(){ fit(btn); }, 150);
    });

    /* follow the page's own language switcher */
    if (window.MutationObserver){
      new MutationObserver(relabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
