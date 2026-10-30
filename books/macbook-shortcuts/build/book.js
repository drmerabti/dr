// Builds the book pages from data.js, flows the shortcut groups into pages
// (a group never splits), then fills the page numbers of the contents.

const SVG = {
  arrow: '<svg viewBox="0 0 24 12"><path d="M23 6H2M7 1 2 6l5 5" fill="none" stroke="#b4b8bf" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg class="star" viewBox="0 0 24 24"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z" fill="#c9a227" stroke="#a8861c" stroke-width=".8" stroke-linejoin="round"/></svg>',
  power: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3v8M7 6.3a8 8 0 1 0 10 0" fill="none" stroke="#1d1d1f" stroke-width="2.1" stroke-linecap="round"/></svg>',
  up: '<svg viewBox="0 0 12 12"><path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  go: '<svg class="go" viewBox="0 0 16 16"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
  fn:    ['fn', 'globe', 'mod'],
  esc:   ['⎋', 'esc', 'mod'],
  del:   ['⌫', 'delete', 'mod'],
  fdel:  ['⌦', 'fwd del', 'mod'],
  ret:   ['↩', 'return', 'mod'],
  tab:   ['⇥', 'tab', 'mod'],
  caps:  ['⇪', 'caps lock', 'mod'],
  eject: ['⏏', 'eject', 'mod'],
  space: ['', 'space', 'wide'],
  power: [SVG.power, 'Touch ID', 'mod'],
  left:  ['←', '', 'char'], right: ['→', '', 'char'], up: ['↑', '', 'char'], down: ['↓', '', 'char'],
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function keyHTML(tok) {
  const k = KEYS[tok];
  if (k) {
    const [sym, nm, cls] = k;
    return `<span class="key ${cls}">${sym ? `<span class="sym">${sym}</span>` : ''}${nm ? `<span class="nm">${nm}</span>` : ''}</span>`;
  }
  return `<span class="key char"><span class="sym">${esc(tok)}</span></span>`;
}

function keysHTML(spec) {
  return spec.split('|').map(alt =>
    alt.trim().split(/\s+/).map(keyHTML).join('<span class="plus">+</span>')
  ).join('<span class="or">أو</span>');
}

function rowHTML([keys, fn, o = {}]) {
  return `<div class="row">
    <div class="keys">${keysHTML(keys)}</div>
    <div class="arrow">${SVG.arrow}</div>
    <div class="fn">${o.star ? SVG.star : ''}<span>${fn}</span>${o.tag ? `<span class="tag">${o.tag}</span>` : ''}</div>
  </div>`;
}

const gid = (c, i) => `ch${c.n}-g${i + 1}`;

function groupHTML(c, g, i) {
  const alert = g.alert
    ? `<div class="alert"><b>تنبيه</b><span>${g.alert.replace(/([⌘⌥⇧⌃⏏⎋⌫])/g, '<span class="sym">$1</span>')}</span></div>` : '';
  return `<section class="group" id="${gid(c, i)}">
    <h3><a href="#toc">${g.title}</a><a class="up" href="#toc">${SVG.up}الفهرس</a></h3>
    ${g.rows.map(rowHTML).join('')}${alert}
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

// 1. cover
{
  const p = document.createElement('div');
  p.className = 'page cover';
  p.innerHTML = '<img src="cover.png" alt="">';
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
  const b = newPage('front');
  b.parentElement.id = 'toc';
  b.innerHTML = `<h1 class="ptitle">الفهرس</h1><div class="prule"></div>
    <ul class="toc">${CHAPTERS.map(c => c.built
      ? `<li><a class="ch" href="#ch${c.n}"><i>${String(c.n).padStart(2, '0')}</i><span class="t">${c.title}</span><span class="pg" data-for="ch${c.n}"></span></a>
         <ul>${c.groups.map((g, i) => `<li><a href="#${gid(c, i)}"><span class="t">${g.title}</span><span class="pg" data-for="${gid(c, i)}"></span></a></li>`).join('')}</ul></li>`
      : `<li class="later"><span class="ch"><i>${String(c.n).padStart(2, '0')}</i><span class="t">${c.title}</span><span class="pg">—</span></span></li>`
    ).join('')}</ul>
    <p class="note-sample">نموذج التصميم: الفصل 2 فقط مكتمل؛ باقي الفصول تُضاف بعد الموافقة.</p>`;
}

// 5. chapters
for (const c of CHAPTERS.filter(c => c.built)) {
  const d = newPage('divider');
  const page = d.parentElement;
  page.id = `ch${c.n}`;
  page.insertAdjacentHTML('afterbegin', `<div class="disc"></div>
    <div class="lbl">الفصل</div><div class="num">${String(c.n).padStart(2, '0')}</div>
    <h2><a href="#toc">${c.title}</a></h2><div class="rule"></div>
    <ol>${c.groups.map((g, i) => `<li><i>${i + 1}</i><a href="#${gid(c, i)}">${g.title}</a></li>`).join('')}</ol>
    <div class="bigkey"><div class="keys">${keyHTML(c.key)}</div></div>`);

  const head = `الفصل ${c.n} · ${c.title}`;
  let body = newPage('content', { runhead: head });
  c.groups.forEach((g, i) => {
    body.insertAdjacentHTML('beforeend', groupHTML(c, g, i));
    const el = body.lastElementChild;
    if (body.scrollHeight > body.clientHeight + 1) {   // does not fit: move the whole group
      el.remove();
      body = newPage('content', { runhead: head });
      body.appendChild(el);
      if (body.scrollHeight > body.clientHeight + 1) console.warn('GROUP TOO TALL: ' + g.title);
    }
  });
}

// page numbers in the contents
for (const s of document.querySelectorAll('.pg[data-for]')) {
  const t = document.getElementById(s.dataset.for);
  s.textContent = pages.indexOf(t.closest('.page')) + 1;
}
document.body.dataset.ready = '1';
