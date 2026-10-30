// Builds the book pages from data.js + content.js, flows the groups into pages
// (a group never splits), then fills the page numbers of the contents.

const SVG = {
  arrow: '<svg viewBox="0 0 24 12"><path d="M23 6H2M7 1 2 6l5 5" fill="none" stroke="#b4b8bf" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg class="star" viewBox="0 0 24 24"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z" fill="#c9a227" stroke="#a8861c" stroke-width=".8" stroke-linejoin="round"/></svg>',
  power: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3v8M7 6.3a8 8 0 1 0 10 0" fill="none" stroke="#1d1d1f" stroke-width="2.1" stroke-linecap="round"/></svg>',
  globe: '<svg class="ico" viewBox="0 0 24 24"><g fill="none" stroke="#1d1d1f" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/></g></svg>',
  bright: '<svg class="ico" viewBox="0 0 24 24"><g fill="none" stroke="#1d1d1f" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>',
  vol: '<svg class="ico" viewBox="0 0 24 24"><g fill="none" stroke="#1d1d1f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5h3.8L12 5.5v13l-4.7-4H3.5z" fill="#1d1d1f"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></g></svg>',
  mc: '<svg class="ico" viewBox="0 0 24 24"><g fill="none" stroke="#1d1d1f" stroke-width="1.6"><rect x="2.5" y="4" width="8" height="6.5" rx="1"/><rect x="13.5" y="4" width="8" height="6.5" rx="1"/><rect x="2.5" y="13.5" width="19" height="6.5" rx="1"/></g></svg>',
  pointer: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 3l12 9.2-5.3.8 3 6.3-2.6 1.2-3-6.3L6 18z" fill="#1d1d1f" stroke="#1d1d1f" stroke-width="1" stroke-linejoin="round"/></svg>',
  up: '<svg viewBox="0 0 12 12"><path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  go: '<svg class="go" viewBox="0 0 16 16"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  scissors: '<svg class="cut" viewBox="0 0 24 24"><g fill="none" stroke="#8e8e93" stroke-width="1.6"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 7.8 20 18M8.2 16.2 20 6"/></g></svg>',
  brush: `<svg viewBox="0 0 220 64" preserveAspectRatio="none">
    <path d="M6 40C24 26 70 19 128 15c30-2 62-4 82 1 4 1 4 4 0 6-22 7-52 9-80 14-38 7-74 13-104 15-12 1-20-3-20-11z" fill="#d3d7dc"/>
    <path d="M14 46c40-6 92-14 150-20" stroke="#e6e8eb" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30 24c34-5 80-9 120-10" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M168 13c14-1 30-1 42 2" stroke="#d3d7dc" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M4 49c3 4 9 5 16 4" stroke="#d3d7dc" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`,
};

// key token → [symbol, name, class]
const KEYS = {
  cmd:   ['⌘', 'command', 'mod'],
  opt:   ['⌥', 'option', 'mod'],
  shift: ['⇧', 'shift', 'mod'],
  ctrl:  ['⌃', 'control', 'mod'],
  fn:    [SVG.globe, 'fn', 'mod'],
  esc:   ['⎋', 'esc', 'mod'],
  del:   ['⌫', 'delete', 'mod'],
  ret:   ['↩', 'return', 'mod'],
  tab:   ['⇥', 'tab', 'mod'],
  caps:  ['⇪', 'caps lock', 'mod'],
  eject: ['⏏', 'eject', 'mod'],
  space: ['', 'space', 'wide'],
  power: [SVG.power, 'Touch ID', 'mod'],
  bright:[SVG.bright, 'F2', 'mod'],
  vol:   [SVG.vol, 'F12', 'mod'],
  mc:    [SVG.mc, 'F3', 'mod'],
  click: [SVG.pointer, 'click', 'act'],
  drag:  [SVG.pointer, 'drag', 'act'],
  left:  ['←', '', 'char'], right: ['→', '', 'char'], up: ['↑', '', 'char'], down: ['↓', '', 'char'],
};
const LITERAL = { bar: '|', plus: '+', gt: '>', lt: '<' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pad2 = n => String(n).padStart(2, '0');
// arrows are not in the Arabic font: print them with Inter
const ia = s => String(s).replace(/([↔←→↑↓])/g, '<span class="ia">$1</span>');

function keyHTML(tok) {
  const k = KEYS[tok];
  if (k) {
    const [sym, nm, cls] = k;
    return `<span class="key ${cls}">${sym ? `<span class="sym">${sym}</span>` : ''}${nm ? `<span class="nm">${nm}</span>` : ''}</span>`;
  }
  const t = LITERAL[tok] || tok;
  return `<span class="key char${t.length > 1 ? ' long' : ''}"><span class="sym">${esc(t)}</span></span>`;
}

function keysHTML(spec) {
  return spec.split('|').map(alt =>
    alt.trim().split(/\s+then\s+/).map(step =>
      step.trim().split(/\s+/).map(keyHTML).join('<span class="plus">+</span>')
    ).join('<span class="or">ثم</span>')
  ).join('<span class="or">أو</span>');
}

const winKeys = s => `<span class="win">${s.split(' ').map(k => `<span class="wk">${k.replace('_', ' ')}</span>`).join('<i>+</i>')}</span>`;
const mnWord = w => `<span class="mn"><b>${w[0]}</b>${w.slice(1)}</span><span class="dot">·</span>`;

function rowHTML([keys, fn, o = {}]) {
  return `<div class="row">
    <div class="keys">${keysHTML(keys)}</div>
    <div class="arrow">${SVG.arrow}</div>
    <div class="fn">${o.star ? SVG.star : ''}${o.mn ? mnWord(o.mn) : ''}<span>${ia(fn)}</span>${o.tag ? `<span class="tag">${o.tag}</span>` : ''}${o.win ? winKeys(o.win) : ''}</div>
  </div>`;
}

// ---------- gestures: a trackpad, fingers and arrows ----------
function gestureSVG(g) {
  const out = [];
  const fing = (x, y, r = 7) => out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#eceef1" stroke="#1d1d1f" stroke-width="1.7"/>`);
  const ring = (x, y, r, dash) => out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8e8e93" stroke-width="1.3"${dash ? ' stroke-dasharray="3 2.5"' : ''}/>`);
  const head = (x, y, a) => {
    const s = 6, p = [[x, y], [x - s * Math.cos(a - .5), y - s * Math.sin(a - .5)], [x - s * Math.cos(a + .5), y - s * Math.sin(a + .5)]];
    out.push(`<path d="M${p[0]}L${p[1]}L${p[2]}z" fill="#1d1d1f"/>`);
  };
  const arrow = (x1, y1, x2, y2, both) => {
    out.push(`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#1d1d1f" stroke-width="2.2" stroke-linecap="round"/>`);
    head(x2, y2, Math.atan2(y2 - y1, x2 - x1));
    if (both) head(x1, y1, Math.atan2(y1 - y2, x1 - x2));
  };
  const label = t => out.push(`<text x="18" y="86" font-family="Inter" font-size="9" font-weight="600" fill="#8e8e93">${t}</text>`);
  const row = (n, y, cx = 80) => Array.from({ length: n }, (_, i) => [cx + (i - (n - 1) / 2) * 19, y]);

  switch (g.m) {
    case 'tap':    row(g.f, 48).forEach(([x, y]) => { ring(x, y, 12, 1); fing(x, y); }); label('tap'); break;
    case 'click':  row(g.f, 48).forEach(([x, y]) => { ring(x, y, 12); fing(x, y); }); label('click / tap'); break;
    case 'force':  ring(80, 48, 13); ring(80, 48, 19); fing(80, 48); label('force click'); break;
    case 'dtap':   row(g.f, 48).forEach(([x, y]) => { ring(x, y, 11, 1); ring(x, y, 15, 1); fing(x, y); }); label('tap ×2'); break;
    case 'drag':   ring(52, 60, 12); fing(52, 60); arrow(66, 54, 116, 32); label('click + drag'); break;
    case 'scroll': row(2, 50, 70).forEach(([x, y]) => fing(x, y)); arrow(110, 24, 110, 76, 1); break;
    case 'pinch':  fing(66, 60); fing(94, 36); arrow(56, 69, 42, 81, 1); arrow(104, 28, 118, 16, 1); break;
    case 'rotate': fing(64, 50); fing(96, 50);
      out.push('<path d="M58 30A26 26 0 0 1 104 32" fill="none" stroke="#1d1d1f" stroke-width="2.2" stroke-linecap="round"/>'); head(104, 32, 1.1);
      out.push('<path d="M102 70A26 26 0 0 1 56 68" fill="none" stroke="#1d1d1f" stroke-width="2.2" stroke-linecap="round"/>'); head(56, 68, -2.05); break;
    case 'hswipe': row(g.f, 40).forEach(([x, y]) => fing(x, y)); arrow(38, 68, 122, 68, 1); break;
    case 'edge':   out.push('<path d="M150 18v64" stroke="#1d1d1f" stroke-width="3" stroke-linecap="round"/>');
      row(2, 50, 130).forEach(([x, y]) => fing(x, y)); arrow(108, 50, 60, 50); break;
    case 'up':     row(g.f, 70).forEach(([x, y]) => fing(x, y)); arrow(80, 54, 80, 16); break;
    case 'down':   row(g.f, 28).forEach(([x, y]) => fing(x, y)); arrow(80, 44, 80, 84); break;
    case 'pinch4': case 'spread4': {
      const pts = [[48, 74, 8.5], [78, 26], [97, 22], [116, 28]], c = [84, 52];
      pts.forEach(([x, y, r]) => fing(x, y, r || 7));
      pts.forEach(([x, y]) => {
        const dx = c[0] - x, dy = c[1] - y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
        if (g.m === 'pinch4') arrow(x + ux * 11, y + uy * 11, x + ux * 22, y + uy * 22);
        else arrow(x - ux * 10, y - uy * 10, x - ux * 20, y - uy * 20);
      });
      break;
    }
  }
  return `<svg class="gsvg" viewBox="0 0 160 100">
    <defs><linearGradient id="tp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfbfc"/><stop offset="1" stop-color="#eef0f3"/></linearGradient></defs>
    <rect x="6" y="5" width="148" height="90" rx="11" fill="url(#tp)" stroke="#bfc3c9" stroke-width="1.3"/>
    ${out.join('')}</svg>`;
}

// ---------- chapter 1: keyboard map ----------
function keyboardHTML() {
  const L = (t, u = 1) => ({ t, u });
  const S = (sym, nm, u, n) => ({ sym, nm, u, n });
  const rows = [
    { fx: true, keys: [S('', 'esc', 1.45, 1), ...Array.from({ length: 12 }, (_, i) => ({ t: 'F' + (i + 1), u: 1, n: i === 5 ? 14 : 0, f: 1 })), S(SVG.power, '', 1, 12)] },
    { keys: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map(t => L(t)).concat([S('', 'delete', 1.45, 11)]) },
    { keys: [S('', 'tab', 1.45, 2), ...'QWERTYUIOP[]\\'.split('').map(t => L(t))] },
    { keys: [S('', 'caps lock', 1.75, 3), ...'ASDFGHJKL;\''.split('').map(t => L(t)), S('', 'return', 1.7, 10)] },
    { keys: [S('', 'shift', 2.2, 4), ...'ZXCVBNM,./'.split('').map(t => L(t)), S('', 'shift', 2.25, 4)] },
    { keys: [S(SVG.globe, 'fn', 1, 5), S('⌃', 'control', 1, 6), S('⌥', 'option', 1, 7), S('⌘', 'command', 1.25, 8),
             S('', '', 5.05, 9), S('⌘', 'command', 1.25, 8), S('⌥', 'option', 1, 7), { arrows: true, u: 3, n: 13 }] },
  ];
  const keyEl = k => {
    if (k.arrows) return `<div class="kk arrows" style="flex:${k.u}"><span class="badge">${k.n}</span>
      <div class="ka">←</div><div class="kv"><div class="ka half">↑</div><div class="ka half">↓</div></div><div class="ka">→</div></div>`;
    const inner = k.t !== undefined ? `<span class="kt${k.f ? ' f' : ''}">${esc(k.t)}</span>`
      : `${k.sym ? `<span class="ks">${k.sym}</span>` : ''}${k.nm ? `<span class="kn">${k.nm}</span>` : ''}`;
    return `<div class="kk${k.n && !k.f ? ' hl' : ''}" style="flex:${k.u}">${k.n ? `<span class="badge">${k.n}</span>` : ''}${inner}</div>`;
  };
  const legend = [
    [1, 'esc', '⎋ esc', 'إلغاء وخروج'], [2, 'tab', '⇥ tab', 'الحقل التالي'],
    [3, 'caps', '⇪ caps lock', 'تثبيت الحروف الكبيرة'], [4, 'shift', '⇧ shift', 'الكبيرة وعكس الأمر'],
    [5, 'fn', 'fn / globe', 'مفاتيح F والإضافات'], [6, 'ctrl', '⌃ control', 'مع النقر: النقر الأيمن'],
    [7, 'opt', '⌥ option', 'الأمر البديل'], [8, 'cmd', '⌘ command', 'مفتاح الأوامر'],
    [9, 'space', 'space', 'مسافة ومعاينة'], [10, 'ret', '↩ return', 'إدخال وتأكيد'],
    [11, 'del', '⌫ delete', 'حذف للخلف'], [12, 'power', 'Touch ID', 'تشغيل وبصمة'],
    [13, '', '← ↑ ↓ →', 'تحريك المؤشر'], [14, '', 'F1 – F12', 'السطوع والصوت'],
  ];
  return `<div class="kbd">${rows.map(r => `<div class="krow${r.fx ? ' fx' : ''}">${r.keys.map(keyEl).join('')}</div>`).join('')}</div>
    <div class="legend">${legend.map(([n, , lab, ar]) =>
      `<div><span class="badge">${n}</span><b>${lab}</b><span>${ar}</span></div>`).join('')}</div>`;
}

// ---------- groups ----------
const gid = (c, i) => `ch${c.n}-g${i + 1}`;
const upLink = `<a class="up" href="#toc">${SVG.up}الفهرس</a>`;
const alertHTML = a => a
  ? `<div class="alert"><b>تنبيه</b><span>${ia(a).replace(/([⌘⌥⇧⌃⏏⎋⌫])/g, '<span class="sym">$1</span>')}</span></div>` : '';

function groupHTML(c, g, i) {
  let inner;
  if (g.type === 'keyboard') inner = keyboardHTML();
  else if (g.type === 'gestures') inner = `<div class="gest-grid">${g.items.map(([s, t, cap, o = {}]) =>
      `<div class="gest">${gestureSVG(s)}<div class="gt">${o.star ? SVG.star : ''}<span>${t}</span>${o.tag ? `<span class="tag">${o.tag}</span>` : ''}</div><div class="gc">${cap}</div></div>`).join('')}</div>`;
  else {
    const hasWin = g.rows.some(r => r[2] && r[2].win);
    inner = (hasWin ? '<div class="colhead"><span>ماك</span><span>ويندوز</span></div>' : '') + g.rows.map(rowHTML).join('');
  }
  return `<section class="group${g.type ? ' ' + g.type : ''}" id="${gid(c, i)}">
    <h3><a href="#toc">${ia(g.title)}</a>${upLink}</h3>
    ${inner}${alertHTML(g.alert)}
  </section>`;
}

// chapter 12: one card per chapter — its 5 starred shortcuts, filled up to 8
function cardGroups() {
  return CHAPTERS.filter(c => c.groups).map(c => {
    const gest = c.groups.some(g => g.type === 'gestures');
    const all = gest ? c.groups.flatMap(g => g.items || [])
                     : c.groups.flatMap(g => (g.rows || []).filter(r => !(r[2] && (r[2].win || r[2].mn))));
    const starred = all.filter(r => (r[gest ? 3 : 2] || {}).star);
    const pick = starred.concat(all.filter(r => !starred.includes(r)).slice(0, 8 - starred.length));
    return { title: c.title, n: c.n, gest, rows: pick };
  });
}
function cardHTML(c12, card, i) {
  const rows = card.rows.map(r => card.gest
    ? `<div class="row"><div class="keys">${gestureSVG(r[0])}</div><div class="arrow">${SVG.arrow}</div><div class="fn">${(r[3] || {}).star ? SVG.star : ''}<span>${r[1]}</span></div></div>`
    : rowHTML([r[0], r[1], { star: (r[2] || {}).star, tag: (r[2] || {}).tag }])).join('');
  return `<section class="group card" id="${gid(c12, i)}">${SVG.scissors}
    <div class="cardhead"><span class="cn">${pad2(card.n)}</span><h3><a href="#toc">${card.title}</a></h3><a class="up" href="#toc">${SVG.up}الفهرس</a></div>
    ${rows}<div class="cardfoot">كل اختصارات ماكبوك · د. سفيان مرابطي</div>
  </section>`;
}

// ---------- page factory ----------
const book = document.getElementById('book');
const pages = [];

function newPage(cls = '', { folio = true, runhead = null } = {}) {
  const p = document.createElement('div');
  p.className = 'page ' + cls;
  const no = pages.length + 1;
  p.innerHTML =
    (runhead ? `<div class="runhead"><b>${runhead}</b><span>${BOOK.title}</span></div>` : '') +
    `<div class="body"></div>` +
    (folio ? `<div class="folio">${no}</div><div class="brush">${SVG.brush}<span>Dr Merabti</span></div>` : '');
  book.appendChild(p);
  pages.push(p);
  return p.querySelector('.body');
}
const overflows = b => b.scrollHeight > b.clientHeight + 1;

// adds el to the page body; moves it whole to a new page when it does not fit
function flow(body, el, next) {
  body.appendChild(el);
  if (!overflows(body)) return body;
  el.remove();
  body = next();
  body.appendChild(el);
  if (overflows(body)) console.warn('TOO TALL: ' + (el.id || el.textContent.slice(0, 40)));
  return body;
}
const frag = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// chapter 12 groups are the cards
const C12 = CHAPTERS.find(c => c.cards);
C12.groups = cardGroups().map(k => ({ title: 'بطاقة: ' + k.title, card: k }));

// 1. cover
{
  const p = document.createElement('div');
  p.className = 'page cover';
  p.innerHTML = '<img src="cover.jpg" alt="">';
  book.appendChild(p); pages.push(p);
}

// 2. other books
{
  const b = newPage('front');
  b.innerHTML = `<h1 class="ptitle">كتب أخرى للمؤلف</h1>
    <p class="psub">${BOOK.author} — اضغط على أي غلاف لتصل إلى صفحة الكتب</p>
    <div class="prule"></div>
    <div class="books">${OTHER_BOOKS.map(k =>
      `<a href="${BOOKS_URL}"><img src="${k.cover}" alt=""><span>${k.title}</span></a>`).join('')}</div>
    <a class="cta" href="${BOOKS_URL}">حمّل كتبي من الموقع <small>merabti.com/books.html</small></a>`;
}

// 3. follow me
{
  const b = newPage('front');
  b.innerHTML = `<h1 class="ptitle">تابعني</h1>
    <p class="psub">دروس وكتب وأدوات جديدة كل أسبوع — اضغط على أي سطر</p>
    <div class="prule"></div>
    <ul class="social">${SOCIAL.map(s => `<li><a class="${s.site ? 'site' : ''}" href="${s.url}">
      <span class="nm ${/[a-z]/i.test(s.name) ? 'lat' : ''}">${s.name}</span>
      <span class="url">${s.show}</span>${SVG.go}</a></li>`).join('')}</ul>`;
}

// 4. contents (page numbers filled after pagination)
{
  let b = newPage('front toc');
  b.parentElement.id = 'toc';
  b.innerHTML = `<h1 class="ptitle">الفهرس</h1><div class="prule"></div>`;
  let ul = frag('<ul class="toc"></ul>'); b.appendChild(ul);
  const nextToc = () => {
    const nb = newPage('front toc');
    nb.innerHTML = '<div class="ptitle small">الفهرس <span>(تابع)</span></div>';
    ul = frag('<ul class="toc"></ul>'); nb.appendChild(ul);
    return nb;
  };
  for (const c of CHAPTERS) {
    const li = frag(`<li><a class="ch" href="#ch${c.n}"><i>${pad2(c.n)}</i><span class="t">${c.title}</span><span class="pg" data-for="ch${c.n}"></span></a>
      <ul>${c.groups.map((g, i) => `<li><a href="#${gid(c, i)}"><span class="t">${ia(g.title)}</span><span class="pg" data-for="${gid(c, i)}"></span></a></li>`).join('')}</ul></li>`);
    ul.appendChild(li);
    if (overflows(b)) { li.remove(); b = nextToc(); ul.appendChild(li); }
  }
}

// 5. chapters
for (const c of CHAPTERS) {
  const d = newPage('divider');
  const page = d.parentElement;
  page.id = `ch${c.n}`;
  const big = c.key === 'gesture' ? `<div class="biggest">${gestureSVG({ f: 3, m: 'up' })}</div>`
    : `<div class="bigkey"><div class="keys">${keyHTML(c.key)}</div></div>`;
  page.insertAdjacentHTML('afterbegin', `<div class="disc"></div>
    <div class="lbl">الفصل</div><div class="num">${pad2(c.n)}</div>
    <h2><a href="#toc">${c.title}</a></h2><div class="rule"></div>
    <ol class="${c.groups.length > 8 ? 'dense' : ''}">${c.groups.map((g, i) => `<li><i>${i + 1}</i><a href="#${gid(c, i)}">${ia(g.title)}</a></li>`).join('')}</ol>
    ${big}`);

  const head = `الفصل ${c.n} · ${c.title}`;
  const next = () => newPage('content', { runhead: head });
  let body = next();
  c.groups.forEach((g, i) => {
    body = flow(body, frag(g.card ? cardHTML(c, g.card, i) : groupHTML(c, g, i)), next);
  });
}

// page numbers in the contents
for (const s of document.querySelectorAll('.pg[data-for]')) {
  const t = document.getElementById(s.dataset.for);
  s.textContent = pages.indexOf(t.closest('.page')) + 1;
}
document.body.dataset.ready = '1';
