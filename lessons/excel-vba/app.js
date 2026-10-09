// ============================================================
// أتمتة إكسل بلغة VBA — صفحة الدروس
// بيانات الدروس في data.js (المصفوفة VBA_LESSONS).
// ============================================================

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* =====================================================================
   الترجمة
===================================================================== */
const I18N = {
  ar: {
    title: 'أتمتة إكسل بلغة VBA', back: 'العودة إلى الدروس', toggleSide: 'إظهار / إخفاء قائمة الدروس',
    lessons: 'الدروس', lesson: 'الدرس', of: 'من', progress: 'الدروس المُشاهَدة',
    fullscreen: 'ملء الشاشة', noVideo: 'الفيديو قريبًا',
    steps: 'خطوات الدرس', codes: 'الأكواد', noCodes: 'لا توجد أكواد لهذا الدرس بعد.',
    copy: 'نسخ', copied: 'تم النسخ ✓', copyAll: 'نسخ كل الأكواد', copyErr: 'تعذّر النسخ، انسخ الكود يدويًا.',
    expand: 'تكبير', shrink: 'تصغير',
    download: 'تحميل ملف التطبيق .xlsm', getFile: 'تحميل الملف الجاهز', downloadNow: 'تحميل',
    prev: 'الدرس السابق', next: 'الدرس التالي',
    watched: 'تمت المشاهدة ✓', markWatched: 'تحديد كمُشاهَد',
    soon: 'قريبًا', soonShort: 'قريبًا', lockedT: 'هذا الدرس قريبًا ✨', lockedP: 'نعمل على تجهيز هذا الدرس بعناية، وسيكون متاحًا قريبًا.',
    admin: 'وضع الأدمن — هذا الدرس مقفل لبقية الزوار',
  },
  en: {
    title: 'Excel Automation with VBA', back: 'Back to lessons', toggleSide: 'Show / hide the lesson list',
    lessons: 'Lessons', lesson: 'Lesson', of: 'of', progress: 'Watched lessons',
    fullscreen: 'Full screen', noVideo: 'Video coming soon',
    steps: 'Lesson steps', codes: 'Code', noCodes: 'No code for this lesson yet.',
    copy: 'Copy', copied: 'Copied ✓', copyAll: 'Copy all code', copyErr: 'Copy failed — please copy the code manually.',
    expand: 'Expand', shrink: 'Shrink',
    download: 'Download the .xlsm file', getFile: 'Get the ready-made file', downloadNow: 'Download',
    prev: 'Previous lesson', next: 'Next lesson',
    watched: 'Watched ✓', markWatched: 'Mark as watched',
    soon: 'Coming soon', soonShort: 'Soon', lockedT: 'This lesson is coming soon ✨', lockedP: 'We are carefully preparing this lesson; it will be available soon.',
    admin: 'Admin mode — this lesson is locked for other visitors',
  },
};

/* =====================================================================
   الحالة + التخزين المحلي (كل وصول محمي بـ try/catch)
===================================================================== */
const LESSONS = (typeof VBA_LESSONS !== 'undefined' && Array.isArray(VBA_LESSONS)) ? VBA_LESSONS : [];

function readLS(k, fallback) {
  try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
}
function writeLS(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
}
function initialLang() {
  let l = null;
  try { l = localStorage.getItem('vba_lang') || localStorage.getItem('site_lang'); } catch (e) {}
  return l === 'en' ? 'en' : 'ar';
}

const S = {
  lang: initialLang(),
  admin: false,
  idx: 0,
  watched: new Set((readLS('vba_watched', []) || []).filter(n => Number.isInteger(n))),
  collapsed: !!readLS('vba_side_collapsed', false),
};
const T = k => (I18N[S.lang][k] ?? I18N.ar[k] ?? k);
const L = (o, k) => (S.lang === 'en' && o[k + '_en']) ? o[k + '_en'] : (o[k] || '');
const textDir = () => (S.lang === 'ar' ? 'rtl' : 'ltr');
const isOpen = i => !LESSONS[i].locked || S.admin;

const ICON = {
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  unlock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
  expand: '<svg viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>',
  shrink: '<svg viewBox="0 0 24 24"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>',
  full: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
  prev: '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>',
  play: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></svg>',
  code: '<svg viewBox="0 0 24 24"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  steps: '<svg viewBox="0 0 24 24"><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="M4 6h.01"/><path d="M4 12h.01"/><path d="M4 18h.01"/></svg>',
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* =====================================================================
   القائمة الجانبية
===================================================================== */
function renderSide() {
  $('#sideNav').innerHTML = LESSONS.map((l, i) => {
    const done = S.watched.has(i + 1);
    return `<button type="button" class="nav-item${i === S.idx ? ' on' : ''}${l.locked && !S.admin ? ' locked' : ''}" data-i="${i}">
      <span class="nav-num${done ? ' done' : ''}">${done ? ICON.check : i + 1}</span>
      <b class="nav-txt tx" dir="${textDir()}">${esc(L(l, 'title'))}</b>
      ${l.locked ? `<small class="nav-soon">${S.admin ? ICON.unlock : ICON.lock}<span>${T('soonShort')}</span></small>` : ''}
    </button>`;
  }).join('');
  $('#mobNum').textContent = S.idx + 1;
  $('#mobTitle').textContent = LESSONS[S.idx] ? L(LESSONS[S.idx], 'title') : '';
  $('#mobTitle').setAttribute('dir', textDir());
  $('#progressTxt').textContent = `${S.watched.size}/${LESSONS.length}`;
}

/* =====================================================================
   الدرس الحالي
===================================================================== */
// يقبل رابط يوتيوب كاملًا (watch?v= / youtu.be / embed / shorts / live) أو المعرّف وحده
function youtubeIdOf(l) {
  const v = String(l.youtubeUrl || l.youtubeId || '').trim();
  if (!v) return '';
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    const host = u.hostname.replace(/^(www|m|music)\./, '');
    let id = '';
    if (host === 'youtu.be') id = u.pathname.split('/')[1] || '';
    else if (/(^|\.)youtube(-nocookie)?\.com$/.test(host)) {
      id = u.searchParams.get('v') || '';
      const m = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(u.pathname);
      if (!id && m) id = m[1];
    }
    return /^[\w-]{11}$/.test(id) ? id : '';
  } catch (e) { return ''; }
}

function videoHTML(l) {
  const id = youtubeIdOf(l);
  if (id) {
    const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
    return `<iframe src="${src}" title="${esc(l.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }
  return `<div class="video-empty">${ICON.play}<span class="tx" dir="${textDir()}">${T('noVideo')}</span></div>`;
}

// أكثر من كود: كل كود في بطاقة قابلة للطي (الأول مفتوح والباقي مطوي)
function codeCardHTML(c, k, all) {
  const lines = String(c.code || '').replace(/\r\n?/g, '\n').replace(/\n+$/, '').split('\n').length;
  const nums = Array.from({ length: lines }, (_, n) => n + 1).join('\n');
  const acc = all.length > 1;
  const open = !acc || k === 0;
  return `<div class="code-card${acc ? ' acc' : ''}${open ? ' open' : ''}" data-k="${k}" dir="ltr">
    <div class="code-top"${acc ? ` role="button" tabindex="0" aria-expanded="${open}"` : ''}>
      <button type="button" class="code-btn copy-btn" data-k="${k}">${ICON.copy}<span>${T('copy')}</span></button>
      <button type="button" class="code-btn icon-only max-btn" data-k="${k}" title="${T('expand')}" aria-label="${T('expand')}">${ICON.expand}</button>
      <span class="code-title" dir="auto">${esc(c.title || `${T('codes')} ${k + 1}`)}</span>
      <span class="code-lang">VBA</span>
      ${acc ? `<span class="acc-chev">${ICON.chev}</span>` : ''}
    </div>
    <div class="code-fold"><div class="code-body"><pre class="ln" aria-hidden="true">${nums}</pre><pre class="code language-vba"><code class="language-vba"></code></pre></div></div>
  </div>`;
}

function renderLesson() {
  const l = LESSONS[S.idx];
  const box = $('#lesson');
  if (!l) { box.innerHTML = ''; return; }
  const n = S.idx + 1;
  const open = isOpen(S.idx);
  const done = S.watched.has(n);
  const d = textDir();

  const head = `<div class="lesson-head">
      <span class="lesson-badge"><small>${T('lesson')}</small>${n}</span>
      <div class="lesson-hd-txt">
        <div class="lesson-meta tx" dir="${d}">
          <span class="lesson-n">${T('lesson')} ${n} ${T('of')} ${LESSONS.length}</span>
          ${l.locked ? `<span class="soon-badge">${T('soon')}</span>` : ''}
        </div>
        <h1 class="lesson-title tx" dir="${d}">${esc(L(l, 'title'))}</h1>
      </div>
      ${open ? `<button type="button" class="watch-btn${done ? ' on' : ''}" id="watchBtn">${ICON.check}<span>${T(done ? 'watched' : 'markWatched')}</span></button>` : ''}
    </div>`;

  const pager = `<nav class="pager">
      <button type="button" class="pg-btn" id="prevBtn" ${S.idx === 0 ? 'disabled' : ''}>${ICON.prev}<span>${T('prev')}</span></button>
      <button type="button" class="pg-btn pg-next" id="nextBtn" ${S.idx === LESSONS.length - 1 ? 'disabled' : ''}><span>${T('next')}</span>${ICON.next}</button>
    </nav>`;

  if (!open) {
    box.innerHTML = `${head}
      <div class="card locked-card tx" dir="${d}">
        <div class="locked-ic">${ICON.lock}</div>
        <h2>${T('lockedT')}</h2>
        <p>${T('lockedP')}</p>
        ${descHTML(l)}
      </div>
      ${pager}`;
    bindLesson();
    return;
  }

  const codes = Array.isArray(l.codes) ? l.codes.filter(c => c && c.code) : [];
  box.innerHTML = `${head}
    <div class="video-wrap">
      <div class="video" id="video">${videoHTML(l)}</div>
      ${youtubeIdOf(l) ? `<button type="button" class="full-btn" id="fullBtn">${ICON.full}<span>${T('fullscreen')}</span></button>` : ''}
    </div>

    <!-- الخطوات (يمين) والأكواد (يسار) جنبًا إلى جنب على الشاشات الكبيرة، وتحت بعضها على الهاتف -->
    <div class="split">
      <section class="card steps-card">
        <h2 class="card-h">${ICON.steps}<span class="tx" dir="${d}">${T('steps')}</span></h2>
        ${descHTML(l)}
      </section>

      <section class="card codes-card">
        <div class="card-h codes-h">
          <h2>${ICON.code}<span class="tx" dir="${d}">${T('codes')}</span>${codes.length ? `<small>${codes.length}</small>` : ''}</h2>
          ${codes.length ? `<button type="button" class="code-btn copy-all" id="copyAllBtn">${ICON.copy}<span>${T('copyAll')}</span></button>` : ''}
        </div>
        ${codes.length ? `<div class="codes">${codes.map(codeCardHTML).join('')}</div>`
          : `<p class="empty tx" dir="${d}">${T('noCodes')}</p>`}
      </section>
    </div>

    ${l.product ? `<button type="button" class="dl-btn" id="buyBtn">${ICON.download}<span>${T(canGet(l.product) ? 'downloadNow' : 'getFile')}</span></button>`
      : l.fileUrl ? `<a class="dl-btn" href="${esc(l.fileUrl)}" download>${ICON.download}<span>${T('download')}</span></a>` : ''}

    ${pager}`;

  // الكود يُكتب كنص (وليس HTML) ثم يُلوَّن بـ Prism إن توفّر
  $$('#lesson .code-card').forEach(card => {
    const c = codes[+card.dataset.k];
    const el = card.querySelector('code');
    el.textContent = String(c.code).replace(/\r\n?/g, '\n').replace(/\n+$/, '');
    try { if (window.Prism && Prism.languages && Prism.languages.vba) Prism.highlightElement(el); } catch (e) {}
  });
  bindLesson(codes);
}

function descHTML(l) {
  const steps = L(l, 'description').split('\n').map(s => s.trim()).filter(Boolean);
  if (!steps.length) return '';
  if (steps.length === 1) return `<p class="desc tx" dir="${textDir()}">${esc(steps[0])}</p>`;
  return `<ol class="desc steps tx" dir="${textDir()}">${steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
}

function bindLesson(codes = []) {
  const w = $('#watchBtn');
  if (w) w.addEventListener('click', toggleWatched);
  $('#prevBtn').addEventListener('click', () => go(S.idx - 1));
  $('#nextBtn').addEventListener('click', () => go(S.idx + 1));
  const f = $('#fullBtn');
  if (f) f.addEventListener('click', () => toggleFull($('#video')));
  // أزرار رأس البطاقة لا تفتح ولا تطوي البطاقة (stopPropagation)
  $$('#lesson .copy-btn').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); copyText(codes[+b.dataset.k].code, b); }));
  $$('#lesson .code-card.acc .code-top').forEach(h => {
    h.addEventListener('click', () => toggleAcc(h.closest('.code-card')));
    h.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === h) { e.preventDefault(); toggleAcc(h.closest('.code-card')); } });
  });
  const buy = $('#buyBtn');
  if (buy) buy.addEventListener('click', () => getFile(LESSONS[S.idx].product));
  const all = $('#copyAllBtn');
  if (all) all.addEventListener('click', () => copyText(codes.map(c => `' ===== ${c.title || ''} =====\n${String(c.code).replace(/\s+$/, '')}`).join('\n\n'), all));
  $$('#lesson .max-btn').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); toggleCodeMax(b.closest('.code-card'), b); }));
}

/* =====================================================================
   الملف الجاهز المدفوع (shared/purchase.js): تحميل مباشر لمن اشترى أو للأدمن،
   وإلا تُفتح نافذة الشراء
===================================================================== */
const canGet = id => S.admin || !!(window.MPurchase && MPurchase.canDownload(id));
function getFile(id) {
  if (!window.MPurchase) return;
  if (canGet(id)) MPurchase.download(id); else MPurchase.open(id);
}
function updateBuyBtn() {
  const b = $('#buyBtn'), l = LESSONS[S.idx];
  if (b && l && l.product) b.querySelector('span').textContent = T(canGet(l.product) ? 'downloadNow' : 'getFile');
}

function toggleAcc(card, force) {
  if (card.classList.contains('max')) return;
  const open = force ?? !card.classList.contains('open');
  card.classList.toggle('open', open);
  card.querySelector('.code-top').setAttribute('aria-expanded', open);
}

/* =====================================================================
   التنقل بين الدروس
===================================================================== */
function go(i, push = true) {
  if (i < 0 || i >= LESSONS.length) return;
  S.idx = i;
  writeLS('vba_last', i + 1);
  if (push) { try { history.replaceState(null, '', `#lesson-${i + 1}`); } catch (e) {} }
  closeDrop();
  renderSide();
  renderLesson();
  $('#work').scrollTop = 0;
  if (LESSONS[i].locked && S.admin) toast(T('admin'));
}
function indexFromHash() {
  const m = /^#lesson-(\d+)$/.exec(location.hash);
  const n = m ? +m[1] : 0;
  return n >= 1 && n <= LESSONS.length ? n - 1 : -1;
}

/* =====================================================================
   علامة "تمت المشاهدة"
===================================================================== */
function toggleWatched() {
  const n = S.idx + 1;
  if (S.watched.has(n)) S.watched.delete(n); else S.watched.add(n);
  writeLS('vba_watched', [...S.watched].sort((a, b) => a - b));
  renderSide();
  const w = $('#watchBtn');
  w.classList.toggle('on', S.watched.has(n));
  w.querySelector('span').textContent = T(S.watched.has(n) ? 'watched' : 'markWatched');
}

/* =====================================================================
   النسخ + التكبير + ملء الشاشة
===================================================================== */
async function copyText(text, btn) {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove();
    } catch (e2) { ok = false; }
  }
  if (!ok) { toast(T('copyErr')); return; }
  const span = btn.querySelector('span');
  const orig = span.textContent;
  btn.classList.add('done');
  span.textContent = T('copied');
  clearTimeout(btn._t);
  btn._t = setTimeout(() => { btn.classList.remove('done'); span.textContent = orig; }, 2000);
}

const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
function toggleFull(el) {
  if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (req) { try { const p = req.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
}

function toggleCodeMax(card, btn) {
  const on = !card.classList.contains('max');
  if (on && card.classList.contains('acc')) toggleAcc(card, true);
  card.classList.toggle('max', on);
  document.body.classList.toggle('code-max', on);
  btn.innerHTML = on ? ICON.shrink : ICON.expand;
  btn.title = T(on ? 'shrink' : 'expand');
  btn.setAttribute('aria-label', btn.title);
  // ملء الشاشة الحقيقي إن كان المتصفح يدعمه، وإلا يبقى التكبير داخل النافذة
  if (on) { const req = card.requestFullscreen || card.webkitRequestFullscreen; if (req) { try { const p = req.call(card); if (p && p.catch) p.catch(() => {}); } catch (e) {} } }
  else if (fsEl() === card) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
}
function onFsChange() {
  // عند الخروج من ملء الشاشة بزر Esc نعيد بطاقة الكود لحجمها
  if (fsEl()) return;
  const card = $('.code-card.max');
  if (card) toggleCodeMax(card, card.querySelector('.max-btn'));
}

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.setAttribute('dir', textDir());
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2800);
}

/* =====================================================================
   طي القائمة (سطح المكتب) / القائمة المنسدلة (الهاتف)
===================================================================== */
const isMobile = () => window.matchMedia('(max-width: 820px)').matches;
function toggleSide() {
  if (isMobile()) { $('#side').classList.contains('drop') ? closeDrop() : openDrop(); return; }
  S.collapsed = !S.collapsed;
  writeLS('vba_side_collapsed', S.collapsed);
  $('#app').classList.toggle('collapsed', S.collapsed);
}
function openDrop() { $('#side').classList.add('drop'); $('#mobBar').classList.add('open'); }
function closeDrop() { $('#side').classList.remove('drop'); $('#mobBar').classList.remove('open'); }

/* =====================================================================
   اللغة
===================================================================== */
function applyLang() {
  document.documentElement.lang = S.lang;
  // الهيكل يبقى LTR (لا يتحرك أي زر)، والنصوص فقط تأخذ اتجاه اللغة
  $$('.tx').forEach(el => el.setAttribute('dir', textDir()));
  $$('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
  $$('[data-t-title]').forEach(el => { el.title = T(el.dataset.tTitle); el.setAttribute('aria-label', T(el.dataset.tTitle)); });
  $$('#langs button').forEach(b => b.classList.toggle('on', b.dataset.l === S.lang));
  document.title = `${T('title')} | Dr Soufiane Merabti`;
  renderSide();
  renderLesson();
}
function setLang(l) {
  S.lang = l;
  try { localStorage.setItem('vba_lang', l); localStorage.setItem('site_lang', l); } catch (e) {}
  applyLang();
}

/* =====================================================================
   الأدمن (نفس منطق الموقع: users/{uid}.isAdmin === true)
===================================================================== */
function watchAdmin() {
  try {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) return;
    firebase.auth().onAuthStateChanged(async user => {
      let admin = false;
      if (user) {
        try {
          const d = await firebase.firestore().collection('users').doc(user.uid).get();
          admin = !!(d.exists && d.data().isAdmin === true);
        } catch (e) { admin = false; }
      }
      if (admin === S.admin) return;
      S.admin = admin;
      renderSide();
      renderLesson();
      if (admin && LESSONS[S.idx] && LESSONS[S.idx].locked) toast(T('admin'));
    });
  } catch (e) {}
}

/* =====================================================================
   التشغيل
===================================================================== */
function init() {
  const fromHash = indexFromHash();
  const last = readLS('vba_last', 1);
  S.idx = fromHash >= 0 ? fromHash : (Number.isInteger(last) && last >= 1 && last <= LESSONS.length ? last - 1 : 0);
  $('#app').classList.toggle('collapsed', S.collapsed);

  $('#sideNav').addEventListener('click', e => { const b = e.target.closest('.nav-item'); if (b) go(+b.dataset.i); });
  $('#sideBtn').addEventListener('click', toggleSide);
  $('#mobBar').addEventListener('click', e => { e.stopPropagation(); toggleSide(); });
  document.addEventListener('click', e => {
    if ($('#side').classList.contains('drop') && !e.target.closest('#side') && !e.target.closest('#sideBtn')) closeDrop();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const card = $('.code-card.max');
    if (card && !fsEl()) toggleCodeMax(card, card.querySelector('.max-btn'));
    closeDrop();
  });
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
  window.addEventListener('hashchange', () => { const i = indexFromHash(); if (i >= 0 && i !== S.idx) go(i, false); });
  window.addEventListener('resize', () => { if (!isMobile()) closeDrop(); });
  $$('#langs button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));

  applyLang();
  watchAdmin();
  if (window.MPurchase) MPurchase.onChange(updateBuyBtn);
}
init();
