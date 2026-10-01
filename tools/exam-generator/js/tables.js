/* ================= Tables: regular, values, student-fill, variation & sign tables ================= */

/* ---------- Regular tables (kind 'table'): HTML output, equations allowed inside cells as $...$ ---------- */
function tcell(v, h){ return { v: v || '', rs: 1, cs: 1, m: false, h: !!h }; }
function tableDefaults(r, c){
  return { rows: Array.from({ length: r || 3 }, (_, i) => Array.from({ length: c || 4 }, () => tcell('', i === 0))), headRow: true, headCol: false, tall: false, align: 'center', student: false };
}
async function cellHtml(v){
  const parts = String(v || '').split(/(\$[^$]+\$)/g);
  let out = '';
  for(const p of parts){
    if(/^\$[^$]+\$$/.test(p)){ const r = await latexToSvg(p.slice(1, -1), false); out += `<span class="eq-svg" dir="ltr">${r.svg}</span>`; }
    else out += escapeHtml(p).replace(/\n/g, '<br>');
  }
  return out;
}
async function tableHtml(d){
  const needsMath = d.rows.some(r => r.some(c => /\$[^$]+\$/.test(c.v)));
  if(needsMath) await loadMathJax();
  let rows = '';
  for(let r = 0; r < d.rows.length; r++){
    let cells = '';
    for(let c = 0; c < d.rows[r].length; c++){
      const cell = d.rows[r][c]; if(cell.m) continue;
      const head = (d.headRow && r === 0) || (d.headCol && c === 0) || cell.h;
      const attrs = (cell.rs > 1 ? ` rowspan="${cell.rs}"` : '') + (cell.cs > 1 ? ` colspan="${cell.cs}"` : '');
      cells += `<td${attrs} class="${head ? 'th' : ''}">${await cellHtml(cell.v)}</td>`;
    }
    rows += `<tr>${cells}</tr>`;
  }
  return `<table class="obj-table al-${d.align || 'center'} ${d.tall ? 'tall' : ''} ${d.student ? 'student' : ''}" ${d.dir ? `dir="${d.dir}"` : ''}>${rows}</table>`;
}

registerKind('table', {
  label: () => L('جدول','Table','Tableau'), icon: '▦', color: '#7C3AED',
  render: (obj) => obj.html || '',
  edit: (obj, done, opts) => {
    if(obj && obj.data && obj.data.rows) return openTableEditor(obj, done, opts);
    openTableChooser(done, opts);
  },
});
registerKind('vartab', {
  label: () => L('جدول تغيرات','Variation table','Tableau de variations'), icon: '↗', color: '#7C3AED',
  render: (obj) => `<span class="g-box">${obj.svg || ''}</span>`,
  edit: (obj, done, opts) => openVarTabEditor(obj, done, opts),
});

function openTableChooser(done, opts){
  const cards = [
    { k:'grid', ic:'▦', c:'#7C3AED', n:L('جدول عادي','Regular table','Tableau simple'), d:L('اختر عدد الأسطر والأعمدة، واكتب، وادمج الخانات','Pick rows and columns, type, merge cells','Lignes, colonnes, fusion') },
    { k:'values', ic:'x|y', c:'#2563EB', n:L('جدول قيم','Table of values','Tableau de valeurs'), d:L('قيم x وصورها f(x) — تُحسب تلقائيًا أو تُترك فارغة','x values and f(x) — computed or left empty','Valeurs de x et f(x)') },
    { k:'var', ic:'↗↘', c:'#DC2626', n:L('جدول تغيرات','Variation table','Tableau de variations'), d:L('إشارة المشتقة والأسهم مع القيم','Derivative sign, arrows and values','Signe de f′ et flèches') },
    { k:'sign', ic:'±', c:'#059669', n:L('جدول إشارة','Sign table','Tableau de signes'), d:L('إشارة عبارة أو جداء عوامل','Sign of an expression','Signe d’une expression') },
    { k:'student', ic:'✍️', c:'#D97706', n:L('جدول يملؤه التلميذ','Table for students to fill','Tableau à compléter'), d:L('عناوين في الأعلى وخانات فارغة واسعة للكتابة','Headings with large empty cells','En-têtes et cases vides') },
  ];
  const m = openModal({ size: 'medium', icon: '▦', color: '#7C3AED', title: L('أي نوع من الجداول تريد؟','Which kind of table?','Quel type de tableau ?'),
    body: `<div class="tbl-choose">${cards.map(c => `<button class="tc-card" data-k="${c.k}" style="--c:${c.c}"><span class="tc-ic">${c.ic}</span><span class="tc-n">${c.n}</span><span class="tc-d">${c.d}</span></button>`).join('')}</div>` });
  m.body.querySelectorAll('.tc-card').forEach(b => b.onclick = () => {
    const k = b.dataset.k; m.close();
    if(k === 'grid') openTableEditor(null, done, opts);
    if(k === 'student'){
      const d = tableDefaults(4, 4); d.tall = true; d.student = true;
      d.rows[0] = [L('العنوان 1','Heading 1','Titre 1'), L('العنوان 2','Heading 2','Titre 2'), L('العنوان 3','Heading 3','Titre 3'), L('العنوان 4','Heading 4','Titre 4')].map(v => tcell(v, true));
      openTableEditor({ data: d }, done, opts);
    }
    if(k === 'values') openValuesDialog(done, opts);
    if(k === 'var') openVarTabEditor(null, (o) => done(Object.assign(o, { kind: 'vartab' })), Object.assign({}, opts, { kindOverride: 'vartab' }), 'var');
    if(k === 'sign') openVarTabEditor(null, (o) => done(Object.assign(o, { kind: 'vartab' })), Object.assign({}, opts, { kindOverride: 'vartab' }), 'sign');
  });
}

function openValuesDialog(done, opts){
  const m = openModal({ size: 'medium', icon: 'x|y', color: '#2563EB', title: L('جدول قيم','Table of values','Tableau de valeurs'),
    body: `<div class="vals-form">
      <label>${L('اسم الدالة','Function name','Nom de la fonction')}<input class="big-input" id="vName" value="f" dir="ltr"></label>
      <label>${L('عبارة الدالة (اختياري — لحساب القيم تلقائيًا)','Formula (optional — to compute values)','Formule (facultatif)')}<input class="big-input" id="vExpr" value="x^2-2x" dir="ltr" placeholder="x^2-2x"></label>
      <div class="vals-row">
        <label>${L('x من','x from','x de')}<input class="big-input" id="vFrom" type="number" value="-2"></label>
        <label>${L('إلى','to','à')}<input class="big-input" id="vTo" type="number" value="3"></label>
        <label>${L('بخطوة','step','pas')}<input class="big-input" id="vStep" type="number" value="1"></label>
      </div>
      <label class="chk big"><input type="checkbox" id="vEmpty"> ✍️ ${L('اترك خانات f(x) فارغة ليملأها التلميذ','Leave f(x) empty for students','Laisser f(x) vide pour l’élève')}</label>
    </div>`,
    footer: `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button><button class="big-btn primary" id="vGo">➡ ${L('إنشاء الجدول','Create the table','Créer le tableau')}</button>` });
  m.foot.querySelector('#vGo').onclick = async () => {
    const name = m.body.querySelector('#vName').value || 'f', expr = m.body.querySelector('#vExpr').value.trim();
    const a = +m.body.querySelector('#vFrom').value, b = +m.body.querySelector('#vTo').value, s = Math.abs(+m.body.querySelector('#vStep').value) || 1;
    const empty = m.body.querySelector('#vEmpty').checked;
    const xs = []; for(let x = a; x <= b + 1e-9 && xs.length < 16; x += s) xs.push(Math.round(x * 1000) / 1000);
    let f = null;
    if(expr && !empty){ await loadMathjs(); f = compileExpr(expr); }
    const d = tableDefaults(2, xs.length + 1); d.headRow = false; d.headCol = true;
    d.rows[0] = [tcell('$x$', true)].concat(xs.map(x => tcell(numStr(x))));
    d.rows[1] = [tcell(`$${name}\\left(x\\right)$`, true)].concat(xs.map(x => { const y = f ? f(x) : NaN; return tcell(isFinite(y) ? numStr(y) : ''); }));
    d.student = empty; d.tall = empty; d.dir = 'ltr';
    m.close();
    openTableEditor({ data: d }, done, opts);
  };
}

function openTableEditor(obj, done, opts){
  opts = opts || {};
  const editing = !!(obj && obj.html);
  let d = JSON.parse(JSON.stringify((obj && obj.data) || tableDefaults(3, 4)));
  let sel = null, anchor = null, focusCell = null;
  const m = openModal({ icon: '▦', color: '#7C3AED', title: L('أداة الجداول','Table tool','Outil tableaux'), cls: 'table-modal',
    footer: `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
      <button class="big-btn primary" data-save>${opts.mode === 'library' ? '📚 ' + L('حفظ في مكتبتي','Save to my library','Enregistrer') : editing ? '✔ ' + L('حفظ التعديل','Save changes','Enregistrer') : '⬇ ' + L('إدراج في الامتحان','Insert into the exam','Insérer')}</button>`,
    body: `<div class="tbl-layout">
      <aside class="tbl-side">
        <div class="pr-h">📐 ${L('الحجم — مرّر الفأرة واضغط','Size — hover and click','Taille — survolez et cliquez')}</div>
        <div class="size-pick"></div><div class="size-lbl"></div>
        <div class="tbl-steppers">
          <div><span>${L('الأسطر','Rows','Lignes')}</span><button data-a="delrow">−</button><b class="nrows"></b><button data-a="addrow">+</button></div>
          <div><span>${L('الأعمدة','Columns','Colonnes')}</span><button data-a="delcol">−</button><b class="ncols"></b><button data-a="addcol">+</button></div>
        </div>
        <div class="pr-h">⚙️ ${L('الشكل','Style','Style')}</div>
        <label class="chk"><input type="checkbox" data-o="headRow"> ${L('السطر الأول عناوين (ملوّن)','First row = headings','1re ligne = en-têtes')}</label>
        <label class="chk"><input type="checkbox" data-o="headCol"> ${L('العمود الأول عناوين','First column = headings','1re colonne = en-têtes')}</label>
        <label class="chk"><input type="checkbox" data-o="tall"> ${L('خانات واسعة للكتابة','Tall cells for writing','Cases hautes')}</label>
        <div class="seg" style="--accent:#7C3AED;margin-top:6px"><span>${L('اتجاه الجدول','Direction','Sens')}</span><button data-dir="rtl">${L('من اليمين','Right→left','Droite→gauche')}</button><button data-dir="ltr">${L('من اليسار','Left→right','Gauche→droite')}</button></div>
        <div class="seg" style="--accent:#7C3AED;margin-top:6px"><span>${L('المحاذاة','Align','Align.')}</span><button data-al="right">⇥</button><button data-al="center">↔</button><button data-al="left">⇤</button></div>
      </aside>
      <section class="tbl-main">
        <div class="tbl-actions">
          <button class="mini-btn" data-a="merge">🔗 ${L('دمج الخانات المحددة','Merge selected cells','Fusionner')}</button>
          <button class="mini-btn" data-a="split">✂️ ${L('فصل الخانة','Split cell','Scinder')}</button>
          <button class="mini-btn" data-a="eq">∑ ${L('معادلة في الخانة','Equation in cell','Équation dans la case')}</button>
          <button class="mini-btn" data-a="clear">🧹 ${L('إفراغ المحدد','Clear selected','Vider')}</button>
        </div>
        <div class="draw-help">💡 ${L('اكتب داخل الخانات مباشرة. لتحديد عدة خانات: اضغط على خانة ثم اضغط Shift + خانة أخرى، أو اسحب بالفأرة.','Type directly in the cells. To select several cells: click a cell then Shift+click another, or drag.','Tapez dans les cases. Pour sélectionner : clic puis Maj+clic.')}</div>
        <div class="tbl-grid-wrap"><table class="tbl-grid"></table></div>
        <div class="pr-h" style="margin-top:12px">👁️ ${L('المعاينة كما ستظهر في الورقة','Preview as on the paper','Aperçu')}</div>
        <div class="tbl-preview"></div>
      </section>
    </div>` });
  const grid = m.body.querySelector('.tbl-grid'), prev = m.body.querySelector('.tbl-preview');
  function drawSizePick(){
    const sp = m.body.querySelector('.size-pick');
    sp.innerHTML = Array.from({ length: 8 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<i data-r="${r}" data-c="${c}"></i>`).join('')).join('');
    const lbl = m.body.querySelector('.size-lbl');
    sp.onmouseover = e => { const i = e.target.closest('i'); if(!i) return; const R = +i.dataset.r, C = +i.dataset.c;
      sp.querySelectorAll('i').forEach(x => x.classList.toggle('on', +x.dataset.r <= R && +x.dataset.c <= C)); lbl.textContent = `${R + 1} × ${C + 1}`; };
    sp.onmouseleave = () => { sp.querySelectorAll('i').forEach(x => x.classList.remove('on')); lbl.textContent = ''; };
    sp.onclick = e => { const i = e.target.closest('i'); if(!i) return; resize(+i.dataset.r + 1, +i.dataset.c + 1); };
  }
  function resize(R, C){
    // unmerge everything that would be cut
    while(d.rows.length < R) d.rows.push(Array.from({ length: d.rows[0].length }, () => tcell('')));
    while(d.rows.length > R) d.rows.pop();
    d.rows.forEach(row => { while(row.length < C) row.push(tcell('')); while(row.length > C) row.pop(); });
    d.rows.forEach((row, r) => row.forEach((cell, c) => { if(r + cell.rs > R) cell.rs = R - r; if(c + cell.cs > C) cell.cs = C - c; }));
    fixMerges(); sel = null; draw();
  }
  function fixMerges(){
    d.rows.forEach(row => row.forEach(c => c.m = false));
    d.rows.forEach((row, r) => row.forEach((cell, c) => {
      if(cell.m) return;
      for(let i = r; i < r + (cell.rs || 1); i++) for(let j = c; j < c + (cell.cs || 1); j++) if(i !== r || j !== c){ if(d.rows[i] && d.rows[i][j]) d.rows[i][j].m = true; }
    }));
  }
  function inSel(r, c){ if(!sel) return false; const r1 = Math.min(sel.r1, sel.r2), r2 = Math.max(sel.r1, sel.r2), c1 = Math.min(sel.c1, sel.c2), c2 = Math.max(sel.c1, sel.c2); return r >= r1 && r <= r2 && c >= c1 && c <= c2; }
  function draw(){
    m.body.querySelector('.nrows').textContent = d.rows.length; m.body.querySelector('.ncols').textContent = d.rows[0].length;
    m.body.querySelectorAll('[data-o]').forEach(i => i.checked = !!d[i.dataset.o]);
    m.body.querySelectorAll('[data-al]').forEach(b => b.classList.toggle('on', b.dataset.al === d.align));
    m.body.querySelectorAll('[data-dir]').forEach(b => b.classList.toggle('on', b.dataset.dir === (d.dir || document.documentElement.dir)));
    grid.setAttribute('dir', d.dir || document.documentElement.dir);
    let h = '';
    d.rows.forEach((row, r) => {
      h += '<tr>';
      row.forEach((cell, c) => {
        if(cell.m) return;
        const head = (d.headRow && r === 0) || (d.headCol && c === 0) || cell.h;
        h += `<td ${cell.rs > 1 ? `rowspan="${cell.rs}"` : ''} ${cell.cs > 1 ? `colspan="${cell.cs}"` : ''} class="${head ? 'th' : ''} ${inSel(r, c) ? 'sel' : ''}" data-r="${r}" data-c="${c}"><textarea rows="1" data-r="${r}" data-c="${c}">${escapeHtml(cell.v)}</textarea></td>`;
      });
      h += '</tr>';
    });
    grid.innerHTML = h;
    grid.querySelectorAll('textarea').forEach(ta => {
      const r = +ta.dataset.r, c = +ta.dataset.c;
      ta.oninput = () => { d.rows[r][c].v = ta.value; schedulePrev(); };
      ta.onfocus = () => { focusCell = { r, c, ta }; };
      ta.onmousedown = e => {
        if(e.shiftKey && anchor){ e.preventDefault(); sel = { r1: anchor.r, c1: anchor.c, r2: r, c2: c }; paintSel(); }
        else { anchor = { r, c }; sel = null; paintSel(); }
      };
      ta.onmouseenter = e => { if(e.buttons === 1 && anchor && (anchor.r !== r || anchor.c !== c)){ sel = { r1: anchor.r, c1: anchor.c, r2: r, c2: c }; paintSel(); } };
    });
    schedulePrev(0);
  }
  function paintSel(){ grid.querySelectorAll('td').forEach(td => td.classList.toggle('sel', inSel(+td.dataset.r, +td.dataset.c))); }
  let pt = null;
  function schedulePrev(delay){ clearTimeout(pt); pt = setTimeout(async () => { prev.innerHTML = await tableHtml(d); }, delay == null ? 250 : delay); }
  m.body.querySelectorAll('[data-o]').forEach(i => i.onchange = () => { d[i.dataset.o] = i.checked; draw(); });
  m.body.querySelectorAll('[data-al]').forEach(b => b.onclick = () => { d.align = b.dataset.al; draw(); });
  m.body.querySelectorAll('[data-dir]').forEach(b => b.onclick = () => { d.dir = b.dataset.dir; draw(); });
  m.body.querySelectorAll('[data-a]').forEach(b => b.onmousedown = e => e.preventDefault());
  m.body.querySelector('[data-a="addrow"]').onclick = () => resize(d.rows.length + 1, d.rows[0].length);
  m.body.querySelector('[data-a="delrow"]').onclick = () => d.rows.length > 1 && resize(d.rows.length - 1, d.rows[0].length);
  m.body.querySelector('[data-a="addcol"]').onclick = () => resize(d.rows.length, d.rows[0].length + 1);
  m.body.querySelector('[data-a="delcol"]').onclick = () => d.rows[0].length > 1 && resize(d.rows.length, d.rows[0].length - 1);
  m.body.querySelector('[data-a="merge"]').onclick = () => {
    if(!sel){ toast(L('حدد خانتين أو أكثر أولًا (Shift + ضغط)','Select two or more cells first (Shift+click)','Sélectionnez d’abord des cases'), 'warn'); return; }
    const r1 = Math.min(sel.r1, sel.r2), r2 = Math.max(sel.r1, sel.r2), c1 = Math.min(sel.c1, sel.c2), c2 = Math.max(sel.c1, sel.c2);
    if(r1 === r2 && c1 === c2) return;
    let txt = [];
    for(let r = r1; r <= r2; r++) for(let c = c1; c <= c2; c++){ const cell = d.rows[r][c]; if(cell.v && !cell.m) txt.push(cell.v); cell.v = ''; cell.rs = 1; cell.cs = 1; }
    d.rows[r1][c1].rs = r2 - r1 + 1; d.rows[r1][c1].cs = c2 - c1 + 1; d.rows[r1][c1].v = txt.join(' ');
    fixMerges(); sel = null; draw();
  };
  m.body.querySelector('[data-a="split"]').onclick = () => {
    const f = sel ? { r: Math.min(sel.r1, sel.r2), c: Math.min(sel.c1, sel.c2) } : (focusCell || anchor);
    if(!f) return;
    const cell = d.rows[f.r][f.c]; cell.rs = 1; cell.cs = 1; fixMerges(); draw();
  };
  m.body.querySelector('[data-a="clear"]').onclick = () => { if(!sel && !focusCell) return; d.rows.forEach((row, r) => row.forEach((cell, c) => { if(sel ? inSel(r, c) : (focusCell.r === r && focusCell.c === c)) cell.v = ''; })); draw(); };
  m.body.querySelector('[data-a="eq"]').onclick = () => {
    const f = focusCell; if(!f){ toast(L('اضغط داخل خانة أولًا','Click inside a cell first','Cliquez d’abord dans une case'), 'warn'); return; }
    const pos = f.ta.selectionStart || f.ta.value.length;
    openEquationEditor(null, (res) => {
      const cell = d.rows[f.r][f.c];
      cell.v = cell.v.slice(0, pos) + `$${res.data.latex}$` + cell.v.slice(pos);
      draw();
    }, { mode: 'cell' });
  };
  drawSizePick(); draw();
  m.foot.querySelector('[data-save]').onclick = async () => {
    const html = await tableHtml(d);
    m.close();
    done({ kind: 'table', data: d, html, display: 'block' });
  };
}

/* ---------- Variation & sign tables (kind 'vartab'): SVG output ---------- */
function vartabDefaults(mode){
  if(mode === 'sign') return { mode: 'sign', xs: ['−∞', '-1', '2', '+∞'], rows: [
    { label: 'x+1', marks: ['', '0', '', ''], signs: ['−', '+', '+'] },
    { label: 'x−2', marks: ['', '', '0', ''], signs: ['−', '−', '+'] },
    { label: 'P(x)', marks: ['', '0', '0', ''], signs: ['+', '−', '+'] } ], vrow: null, xname: 'x' };
  return { mode: 'var', xs: ['−∞', '1', '+∞'], rows: [ { label: "f'(x)", marks: ['', '0', ''], signs: ['−', '+'] } ],
    vrow: { label: 'f(x)', pts: [ { v: '+∞', lvl: 'top' }, { v: '−2', lvl: 'bot' }, { v: '+∞', lvl: 'top' } ] }, xname: 'x' };
}
function vartabSvg(d){
  const n = d.xs.length, labW = 92, W = 620, colW = (W - labW - 30) / Math.max(1, n - 1);
  const X = i => labW + 15 + i * colW;
  const hx = 36, hs = 36, hv = d.vrow ? 92 : 0;
  const H = hx + d.rows.length * hs + hv;
  const MF = `font-family="'Times New Roman', Times, serif"`;
  const T = (x, y, s, size, anchor, extra) => `<text x="${x}" y="${y}" ${MF} font-size="${size || 17}" text-anchor="${anchor || 'middle'}" fill="#111" ${extra || ''}>${svgLabelV(s)}</text>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" direction="ltr" style="direction:ltr" viewBox="0 0 ${W} ${H + 2}" width="${W}" height="${H + 2}"><rect width="${W}" height="${H + 2}" fill="#fff"/>
    <defs><marker id="va" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#111"/></marker></defs>`;
  s += `<rect x="1" y="1" width="${W - 2}" height="${H}" fill="none" stroke="#111" stroke-width="1.6"/>`;
  s += `<line x1="${labW}" y1="1" x2="${labW}" y2="${H + 1}" stroke="#111" stroke-width="1.4"/>`;
  // x row
  s += T(labW / 2, hx / 2 + 6, d.xname || 'x', 18, 'middle', 'font-style="italic"');
  d.xs.forEach((v, i) => s += T(X(i), hx / 2 + 6, v, 16));
  let y = hx;
  d.rows.forEach(r => {
    s += `<line x1="1" y1="${y}" x2="${W - 1}" y2="${y}" stroke="#111" stroke-width="1.2"/>`;
    s += T(labW / 2, y + hs / 2 + 6, r.label, 16, 'middle', 'font-style="italic"');
    r.marks.forEach((mk, i) => {
      if(mk === '0'){ s += `<line x1="${X(i)}" y1="${y}" x2="${X(i)}" y2="${y + hs}" stroke="#111" stroke-width="1" stroke-dasharray="3 2"/><rect x="${X(i) - 7}" y="${y + hs / 2 - 9}" width="14" height="18" fill="#fff"/>` + T(X(i), y + hs / 2 + 6, '0', 16); }
      if(mk === '||') s += `<line x1="${X(i) - 2.5}" y1="${y}" x2="${X(i) - 2.5}" y2="${y + hs}" stroke="#111" stroke-width="1.3"/><line x1="${X(i) + 2.5}" y1="${y}" x2="${X(i) + 2.5}" y2="${y + hs}" stroke="#111" stroke-width="1.3"/>`;
    });
    r.signs.forEach((sg, i) => { if(sg) s += T((X(i) + X(i + 1)) / 2, y + hs / 2 + 7, sg, 20, 'middle', 'font-weight="bold"'); });
    y += hs;
  });
  if(d.vrow){
    s += `<line x1="1" y1="${y}" x2="${W - 1}" y2="${y}" stroke="#111" stroke-width="1.2"/>`;
    s += T(labW / 2, y + hv / 2 + 6, d.vrow.label, 16, 'middle', 'font-style="italic"');
    const ly = l => l === 'top' ? y + 20 : l === 'bot' ? y + hv - 10 : y + hv / 2 + 6;
    const pts = d.vrow.pts;
    pts.forEach((p, i) => {
      if(p.bar){
        s += `<line x1="${X(i) - 2.5}" y1="${y}" x2="${X(i) - 2.5}" y2="${y + hv}" stroke="#111" stroke-width="1.3"/><line x1="${X(i) + 2.5}" y1="${y}" x2="${X(i) + 2.5}" y2="${y + hv}" stroke="#111" stroke-width="1.3"/>`;
        if(p.v) s += T(X(i) - 8, ly(p.lvl), p.v, 15, 'end');
        if(p.v2) s += T(X(i) + 8, ly(p.lvl2 || p.lvl), p.v2, 15, 'start');
      } else if(p.v) s += `<rect x="${X(i) - 20}" y="${ly(p.lvl) - 15}" width="40" height="19" fill="#fff"/>` + T(X(i), ly(p.lvl), p.v, 15);
    });
    for(let i = 0; i < pts.length - 1; i++){
      const a = pts[i], b = pts[i + 1];
      const la = a.bar ? (a.lvl2 || a.lvl) : a.lvl, lb = b.lvl;
      if(!la || !lb || la === lb) { if(la && lb && la === lb && la === 'mid'){ /* constant */ s += `<line x1="${X(i) + 22}" y1="${ly(la) - 5}" x2="${X(i + 1) - 22}" y2="${ly(lb) - 5}" stroke="#111" stroke-width="1.4" marker-end="url(#va)"/>`; } continue; }
      const y1 = ly(la) + (la === 'top' ? 6 : -18), y2 = ly(lb) + (lb === 'top' ? 6 : -18);
      s += `<line x1="${X(i) + (a.bar ? 14 : 20)}" y1="${y1}" x2="${X(i + 1) - (b.bar ? 14 : 20)}" y2="${y2}" stroke="#111" stroke-width="1.4" marker-end="url(#va)"/>`;
    }
  }
  return s + '</svg>';
}
function svgLabelV(s){
  s = String(s == null ? '' : s).replace(/-/g, '−');
  return xmlEsc(s).replace(/'/g, '′').replace(/_\{([^}]*)\}|_(\S)/g, (m, a, b) => `<tspan baseline-shift="sub" font-size="75%">${a || b}</tspan>`).replace(/\^\{([^}]*)\}|\^(\S)/g, (m, a, b) => `<tspan baseline-shift="super" font-size="75%">${a || b}</tspan>`);
}

function openVarTabEditor(obj, done, opts, mode){
  opts = opts || {};
  const editing = !!(obj && obj.svg);
  let d = JSON.parse(JSON.stringify((obj && obj.data) || vartabDefaults(mode || 'var')));
  const PRESETS = [
    { n: L('دالة من الدرجة 2','Quadratic','2nd degré'), d: () => vartabDefaults('var') },
    { n: L('دالة تناظرية (قيمة ممنوعة)','Rational (forbidden value)','Homographique'), d: () => ({ mode:'var', xname:'x', xs:['−∞','-1','+∞'], rows:[{ label:"f'(x)", marks:['','||',''], signs:['+','+'] }], vrow:{ label:'f(x)', pts:[{ v:'2', lvl:'bot' }, { bar:true, v:'+∞', lvl:'top', v2:'−∞', lvl2:'bot' }, { v:'2', lvl:'top' }] } }) },
    { n: L('دالة من الدرجة 3','Cubic','3e degré'), d: () => ({ mode:'var', xname:'x', xs:['−∞','-1','1','+∞'], rows:[{ label:"f'(x)", marks:['','0','0',''], signs:['+','−','+'] }], vrow:{ label:'f(x)', pts:[{ v:'−∞', lvl:'bot' }, { v:'2', lvl:'top' }, { v:'−2', lvl:'bot' }, { v:'+∞', lvl:'top' }] } }) },
    { n: L('الدالة الأسية','Exponential','Exponentielle'), d: () => ({ mode:'var', xname:'x', xs:['−∞','+∞'], rows:[{ label:"f'(x)", marks:['',''], signs:['+'] }], vrow:{ label:'f(x)', pts:[{ v:'0', lvl:'bot' }, { v:'+∞', lvl:'top' }] } }) },
    { n: L('جدول إشارة','Sign table','Tableau de signes'), d: () => vartabDefaults('sign') },
  ];
  const m = openModal({ icon: '↗', color: '#DC2626', title: d.mode === 'sign' ? L('جدول الإشارة','Sign table','Tableau de signes') : L('جدول التغيرات','Variation table','Tableau de variations'), cls: 'vartab-modal',
    footer: `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
      <button class="big-btn primary" data-save>${opts.mode === 'library' ? '📚 ' + L('حفظ في مكتبتي','Save to my library','Enregistrer') : editing ? '✔ ' + L('حفظ التعديل','Save changes','Enregistrer') : '⬇ ' + L('إدراج في الامتحان','Insert into the exam','Insérer')}</button>`,
    body: `<div class="vt-presets">${PRESETS.map((p, i) => `<button class="mini-btn" data-p="${i}">✨ ${p.n}</button>`).join('')}</div>
      <div class="vt-preview"></div>
      <div class="vt-form"></div>` });
  const prev = m.body.querySelector('.vt-preview'), form = m.body.querySelector('.vt-form');
  m.body.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { d = PRESETS[+b.dataset.p].d(); draw(); });
  const signBtn = (v, attr) => `<button class="vt-sign ${v === '+' ? 'plus' : v === '−' ? 'minus' : ''}" ${attr}>${v || '·'}</button>`;
  const markSel = (v, attr) => `<select class="pinp sm vt-mark" ${attr}><option value="" ${!v ? 'selected' : ''}>—</option><option value="0" ${v === '0' ? 'selected' : ''}>0</option><option value="||" ${v === '||' ? 'selected' : ''}>||</option></select>`;
  function draw(){
    prev.innerHTML = vartabSvg(d);
    const n = d.xs.length;
    let h = `<div class="vt-sec"><div class="pr-h">1. ${L('قيم x (من اليسار إلى اليمين)','x values (left to right)','Valeurs de x')}</div>
      <div class="vt-xs">${d.xs.map((x, i) => `<input class="pinp vt-x" data-x="${i}" value="${escAttr(x)}" dir="ltr">`).join('')}
      <button class="mini-btn" data-a="delx">−</button><button class="mini-btn" data-a="addx">+ ${L('قيمة','value','valeur')}</button>
      <span class="vt-quick"><button class="mini-btn" data-ins="−∞">−∞</button><button class="mini-btn" data-ins="+∞">+∞</button></span></div></div>`;
    h += `<div class="vt-sec"><div class="pr-h">2. ${L('أسطر الإشارة — اضغط على الإشارة لتغييرها','Sign rows — click a sign to change it','Lignes de signe — cliquez pour changer')}</div>`;
    d.rows.forEach((r, ri) => {
      h += `<div class="vt-row"><input class="pinp vt-lab" data-rl="${ri}" value="${escAttr(r.label)}" dir="ltr">`;
      for(let i = 0; i < n; i++){
        h += markSel(r.marks[i], `data-rm="${ri}" data-i="${i}"`);
        if(i < n - 1) h += signBtn(r.signs[i], `data-rs="${ri}" data-i="${i}"`);
      }
      h += `<button class="x-del" data-delrow="${ri}">✕</button></div>`;
    });
    h += `<button class="add-btn sm" data-a="addrow">+ ${L('سطر إشارة','Sign row','Ligne de signe')}</button></div>`;
    if(d.mode === 'var'){
      h += `<div class="vt-sec"><div class="pr-h">3. ${L('سطر التغيرات — القيم ومكانها (أعلى / أسفل)','Variation row — values and position (top / bottom)','Ligne des variations')}</div>`;
      if(d.vrow){
        h += `<div class="vt-row"><input class="pinp vt-lab" data-vl value="${escAttr(d.vrow.label)}" dir="ltr">`;
        d.vrow.pts.forEach((p, i) => {
          h += `<div class="vt-pt"><input class="pinp sm" data-pv="${i}" value="${escAttr(p.v || '')}" dir="ltr" placeholder="${L('القيمة','value','valeur')}">
            <div class="vt-lvl">${['top','mid','bot'].map(l => `<button data-pl="${i}" data-l="${l}" class="${p.lvl === l ? 'on' : ''}">${l === 'top' ? '⬆' : l === 'bot' ? '⬇' : '•'}</button>`).join('')}</div>
            <label class="chk"><input type="checkbox" data-pb="${i}" ${p.bar ? 'checked' : ''}> ||</label>
            ${p.bar ? `<input class="pinp sm" data-pv2="${i}" value="${escAttr(p.v2 || '')}" dir="ltr" placeholder="${L('يمين ||','right of ||','à droite')}"><div class="vt-lvl">${['top','bot'].map(l => `<button data-pl2="${i}" data-l="${l}" class="${p.lvl2 === l ? 'on' : ''}">${l === 'top' ? '⬆' : '⬇'}</button>`).join('')}</div>` : ''}
          </div>`;
        });
        h += `</div>`;
      }
      h += `</div>`;
    }
    form.innerHTML = h;
    bind();
  }
  function syncN(){
    const n = d.xs.length;
    d.rows.forEach(r => { while(r.marks.length < n) r.marks.push(''); r.marks.length = n; while(r.signs.length < n - 1) r.signs.push('+'); r.signs.length = Math.max(0, n - 1); });
    if(d.vrow){ while(d.vrow.pts.length < n) d.vrow.pts.push({ v: '', lvl: 'top' }); d.vrow.pts.length = n; }
  }
  let lastX = null;
  function bind(){
    form.querySelectorAll('[data-x]').forEach(i => { i.oninput = () => { d.xs[+i.dataset.x] = i.value; prev.innerHTML = vartabSvg(d); }; i.onfocus = () => lastX = i; });
    form.querySelectorAll('[data-ins]').forEach(b => { b.onmousedown = e => e.preventDefault(); b.onclick = () => { if(lastX){ lastX.value = b.dataset.ins; lastX.dispatchEvent(new Event('input')); } }; });
    form.querySelector('[data-a="addx"]').onclick = () => {
      const idx = d.xs.length - 1;
      d.xs.splice(idx, 0, '');
      d.rows.forEach(r => { r.marks.splice(idx, 0, ''); r.signs.splice(idx, 0, '+'); });
      if(d.vrow) d.vrow.pts.splice(idx, 0, { v: '', lvl: 'mid' });
      draw();
    };
    form.querySelector('[data-a="delx"]').onclick = () => {
      if(d.xs.length <= 2) return;
      const idx = d.xs.length - 2;
      d.xs.splice(idx, 1);
      d.rows.forEach(r => { r.marks.splice(idx, 1); r.signs.splice(idx, 1); });
      if(d.vrow) d.vrow.pts.splice(idx, 1);
      draw();
    };
    form.querySelectorAll('[data-rl]').forEach(i => i.oninput = () => { d.rows[+i.dataset.rl].label = i.value; prev.innerHTML = vartabSvg(d); });
    form.querySelectorAll('[data-rm]').forEach(s => s.onchange = () => { d.rows[+s.dataset.rm].marks[+s.dataset.i] = s.value; prev.innerHTML = vartabSvg(d); });
    form.querySelectorAll('[data-rs]').forEach(b => b.onclick = () => { const r = d.rows[+b.dataset.rs], i = +b.dataset.i; r.signs[i] = r.signs[i] === '+' ? '−' : r.signs[i] === '−' ? '' : '+'; draw(); });
    form.querySelectorAll('[data-delrow]').forEach(b => b.onclick = () => { if(d.rows.length > 1 || d.mode === 'var'){ d.rows.splice(+b.dataset.delrow, 1); draw(); } });
    form.querySelector('[data-a="addrow"]').onclick = () => { d.rows.push({ label: '', marks: d.xs.map(() => ''), signs: d.xs.slice(1).map(() => '+') }); draw(); };
    const vl = form.querySelector('[data-vl]'); if(vl) vl.oninput = () => { d.vrow.label = vl.value; prev.innerHTML = vartabSvg(d); };
    form.querySelectorAll('[data-pv]').forEach(i => i.oninput = () => { d.vrow.pts[+i.dataset.pv].v = i.value; prev.innerHTML = vartabSvg(d); });
    form.querySelectorAll('[data-pv2]').forEach(i => i.oninput = () => { d.vrow.pts[+i.dataset.pv2].v2 = i.value; prev.innerHTML = vartabSvg(d); });
    form.querySelectorAll('[data-pl]').forEach(b => b.onclick = () => { d.vrow.pts[+b.dataset.pl].lvl = b.dataset.l; draw(); });
    form.querySelectorAll('[data-pl2]').forEach(b => b.onclick = () => { d.vrow.pts[+b.dataset.pl2].lvl2 = b.dataset.l; draw(); });
    form.querySelectorAll('[data-pb]').forEach(c => c.onchange = () => { const p = d.vrow.pts[+c.dataset.pb]; p.bar = c.checked; if(p.bar && !p.lvl2) p.lvl2 = p.lvl === 'top' ? 'bot' : 'top'; draw(); });
  }
  syncN(); draw();
  m.foot.querySelector('[data-save]').onclick = () => {
    const svg = vartabSvg(d);
    m.close();
    done({ kind: 'vartab', data: d, svg, w: (obj && obj.w) || 520 });
  };
}

/* Word export for HTML tables: read the rendered table from the hidden page */
async function tableObjToDocxAsync(span, ctx){
  const { D, TR, P, allBorders } = ctx;
  const table = span.querySelector('table'); if(!table) return P([]);
  const rows = [];
  for(const tr of table.querySelectorAll('tr')){
    const cells = [];
    for(const td of tr.children){
      const runs = [];
      for(const node of td.childNodes){
        if(node.nodeType === 3){ if(node.textContent) runs.push(TR(node.textContent, { bold: td.classList.contains('th') })); }
        else if(node.tagName === 'BR') runs.push(new D.TextRun({ break: 1 }));
        else if(node.querySelector && node.querySelector('svg')){
          const svg = node.querySelector('svg'), r = svg.getBoundingClientRect();
          const bytes = await svgToPng(svg.outerHTML, r.width, r.height, 4);
          runs.push(new D.ImageRun({ type: 'png', data: bytes, transformation: { width: Math.round(r.width), height: Math.round(r.height) } }));
        } else if(node.textContent) runs.push(TR(node.textContent));
      }
      const th = td.classList.contains('th');
      cells.push(new D.TableCell({ children: [P(runs, { alignment: D.AlignmentType.CENTER, spacing: { before: 60, after: 60 } })],
        rowSpan: td.rowSpan > 1 ? td.rowSpan : undefined, columnSpan: td.colSpan > 1 ? td.colSpan : undefined,
        verticalAlign: D.VerticalAlign.CENTER, shading: th ? { type: D.ShadingType.CLEAR, fill: 'EDE9FE', color: 'auto' } : undefined }));
    }
    rows.push(new D.TableRow({ children: cells, height: table.classList.contains('tall') ? { value: 640, rule: 'atLeast' } : undefined }));
  }
  return new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: allBorders('333333'), rows, visuallyRightToLeft: ctx.rtl && table.getAttribute('dir') !== 'ltr' });
}
