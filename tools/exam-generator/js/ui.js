/* ================= Shared UI helpers: translation, modals, toasts, lazy loading ================= */

/* Inline translation: L('عربي', 'English', 'Français') */
function L(ar, en, fr){ return lang === 'ar' ? ar : (lang === 'fr' ? (fr || en) : en); }

function escAttr(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ---------- Lazy script loader ---------- */
const _scriptCache = {};
function loadScript(src){
  if(_scriptCache[src]) return _scriptCache[src];
  _scriptCache[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { delete _scriptCache[src]; reject(new Error('load failed: ' + src)); };
    document.head.appendChild(s);
  });
  return _scriptCache[src];
}

/* MathJax (SVG output, standalone glyph paths so every SVG works alone in print/PDF/Word) */
let _mjReady = null;
function loadMathJax(){
  if(_mjReady) return _mjReady;
  window.MathJax = {
    tex: {
      packages: { '[+]': ['mhchem', 'cancel', 'color'] },
      macros: {
        exponentialE: 'e', differentialD: '\\mathrm{d}', imaginaryI: 'i', degree: '^{\\circ}',
        mleft: '\\left', mright: '\\right', R: '\\mathbb{R}', N: '\\mathbb{N}', Z: '\\mathbb{Z}', Q: '\\mathbb{Q}', C: '\\mathbb{C}',
        placeholder: ['{\\square}', 1, ''], ohm: '\\Omega'
      }
    },
    svg: { fontCache: 'none', scale: 1 },
    startup: { typeset: false }
  };
  _mjReady = loadScript('vendor/mathjax-tex-svg.js').then(() => window.MathJax.startup.promise);
  return _mjReady;
}
function loadMathLive(){ return loadScript('vendor/mathlive/mathlive.min.js'); }
function loadMathjs(){ return loadScript('vendor/math.min.js'); }
function loadFabric(){ return loadScript('vendor/fabric.min.js'); }
function loadDocx(){ return loadScript('vendor/docx.js'); }

/* ---------- Toast ---------- */
function toast(msg, kind){
  let box = document.getElementById('toastBox');
  if(!box){ box = document.createElement('div'); box.id = 'toastBox'; document.body.appendChild(box); }
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ---------- Big modal shell ----------
   openModal({ title, icon, color, size:'full'|'medium'|'small', body (html), footer (html), onClose })
   returns { root, body, foot, close } */
const _modalStack = [];
function openModal(opts){
  const root = document.createElement('div');
  root.className = 'eg-modal-backdrop';
  root.innerHTML = `
    <div class="eg-modal eg-modal-${opts.size || 'full'} ${opts.cls || ''}" style="--accent:${opts.color || 'var(--primary)'}">
      <div class="eg-modal-head">
        <div class="eg-modal-title"><span class="eg-modal-ic">${opts.icon || ''}</span><span>${opts.title || ''}</span></div>
        <button class="eg-modal-x" data-close title="${L('إغلاق','Close','Fermer')}">✕</button>
      </div>
      <div class="eg-modal-body">${opts.body || ''}</div>
      ${opts.footer ? `<div class="eg-modal-foot">${opts.footer}</div>` : ''}
    </div>`;
  document.body.appendChild(root);
  document.body.classList.add('modal-open');
  const m = { root, body: root.querySelector('.eg-modal-body'), foot: root.querySelector('.eg-modal-foot'), closed: false };
  m.close = () => {
    if(m.closed) return; m.closed = true;
    root.remove();
    const i = _modalStack.indexOf(m); if(i >= 0) _modalStack.splice(i, 1);
    if(!_modalStack.length) document.body.classList.remove('modal-open');
    if(opts.onClose) opts.onClose();
  };
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => m.close()));
  if(opts.size === 'small' || opts.size === 'medium'){
    root.addEventListener('mousedown', e => { if(e.target === root) m.close(); });
  }
  _modalStack.push(m);
  return m;
}
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && _modalStack.length){
    const top = _modalStack[_modalStack.length - 1];
    if(!top.root.querySelector('.eg-modal-full')) top.close();
  }
});

/* Friendly confirm dialog (big buttons) */
function askConfirm(message, okLabel, danger){
  return new Promise(resolve => {
    const m = openModal({
      size: 'small', icon: danger ? '⚠️' : '❓', title: L('تأكيد','Confirm','Confirmation'),
      color: danger ? 'var(--danger)' : 'var(--primary)',
      body: `<p class="confirm-msg">${message}</p>`,
      footer: `<button class="big-btn ghost" data-no>${L('إلغاء','Cancel','Annuler')}</button>
               <button class="big-btn ${danger ? 'danger' : 'primary'}" data-yes>${okLabel || L('نعم','Yes','Oui')}</button>`,
      onClose: () => resolve(false)
    });
    m.foot.querySelector('[data-no]').onclick = () => m.close();
    m.foot.querySelector('[data-yes]').onclick = () => { resolve(true); m.close(); };
  });
}

/* Prompt with a text field */
function askText(title, value, placeholder){
  return new Promise(resolve => {
    let done = false;
    const m = openModal({
      size: 'small', icon: '✏️', title,
      body: `<input class="big-input" id="askTextInp" value="${escAttr(value || '')}" placeholder="${escAttr(placeholder || '')}">`,
      footer: `<button class="big-btn ghost" data-no>${L('إلغاء','Cancel','Annuler')}</button>
               <button class="big-btn primary" data-yes>${L('حفظ','Save','Enregistrer')}</button>`,
      onClose: () => { if(!done) resolve(null); }
    });
    const inp = m.body.querySelector('input');
    setTimeout(() => { inp.focus(); inp.select(); }, 30);
    const ok = () => { done = true; resolve(inp.value); m.close(); };
    m.foot.querySelector('[data-no]').onclick = () => m.close();
    m.foot.querySelector('[data-yes]').onclick = ok;
    inp.addEventListener('keydown', e => { if(e.key === 'Enter') ok(); });
  });
}

/* Loading overlay inside an element */
function showLoading(el, msg){
  const d = document.createElement('div');
  d.className = 'eg-loading';
  d.innerHTML = `<div class="spinner"></div><div>${msg || L('جارٍ التحميل...','Loading...','Chargement...')}</div>`;
  el.appendChild(d);
  return () => d.remove();
}
