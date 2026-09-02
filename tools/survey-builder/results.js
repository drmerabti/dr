const params = new URLSearchParams(location.search);
const surveyId = params.get('id');
const wrap = document.getElementById('resultsWrap');

let RAW = null; // { title, questions, responses }

/* =====================================================================
   ترميز الإجابات الترتيبية إلى أرقام (لأسئلة الاختيار الواحد/القائمة/التقييم)
   الخيار الأول = أعلى قيمة (مثال: "موافق بشدة" = 5)
===================================================================== */
function scoreFor(q, value){
  if (q.type === 'rating') return Number(value) || null;
  if ((q.type === 'radio' || q.type === 'dropdown') && Array.isArray(q.options)){
    const idx = q.options.indexOf(value);
    if (idx === -1) return null;
    return q.options.length - idx;
  }
  return null;
}

function isNumericQuestion(q){
  return q.type === 'rating' || ((q.type === 'radio' || q.type === 'dropdown') && q.options && q.options.length >= 2);
}

/* ============ أدوات إحصائية ============ */
function mean(arr){ return arr.reduce((a,b)=>a+b,0) / arr.length; }
function median(arr){
  const s = [...arr].sort((a,b)=>a-b);
  const mid = Math.floor(s.length/2);
  return s.length % 2 ? s[mid] : (s[mid-1]+s[mid])/2;
}
function mode(arr){
  const freq = {};
  arr.forEach(v => freq[v] = (freq[v]||0)+1);
  let best = null, bestCount = -1;
  Object.entries(freq).forEach(([k,c]) => { if (c > bestCount){ best = k; bestCount = c; } });
  return best;
}
function variance(arr){
  const m = mean(arr);
  return arr.reduce((s,v)=>s+(v-m)**2,0) / (arr.length - 1 || 1);
}
function stdev(arr){ return Math.sqrt(variance(arr)); }
function range(arr){ return Math.max(...arr) - Math.min(...arr); }

function pearson(x, y){
  const n = x.length;
  const mx = mean(x), my = mean(y);
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i=0;i<n;i++){ const dx=x[i]-mx, dy=y[i]-my; num += dx*dy; dx2 += dx*dx; dy2 += dy*dy; }
  const denom = Math.sqrt(dx2*dy2);
  return denom === 0 ? 0 : num/denom;
}

function cronbachAlpha(itemsMatrix){ // مصفوفة: كل عمود = سؤال، كل صف = مستجيب
  const k = itemsMatrix.length;
  if (k < 2) return null;
  const itemVars = itemsMatrix.map(col => variance(col));
  const totals = itemsMatrix[0].map((_, i) => itemsMatrix.reduce((s,col) => s + col[i], 0));
  const totalVar = variance(totals);
  if (totalVar === 0) return null;
  return (k/(k-1)) * (1 - itemVars.reduce((a,b)=>a+b,0) / totalVar);
}

/* =====================================================================
   عرض النتائج
===================================================================== */
function renderTallyQuestion(q, tally, total){
  const entries = Object.entries(tally).sort((a,b)=>b[1]-a[1]);
  const box = document.createElement('div');
  box.className = 'sb-question';
  let bars = entries.map(([label, count]) => {
    const pct = total ? Math.round((count/total)*100) : 0;
    return `<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:4px;">
        <span>${label}</span><span>${count} (${pct}%)</span>
      </div>
      <div style="background:var(--accent-soft);border-radius:8px;height:10px;overflow:hidden;">
        <div style="background:var(--accent);height:100%;width:${pct}%;"></div>
      </div>
    </div>`;
  }).join('');
  box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title}</h3>${bars || '<p style="color:var(--ink-soft);">لا إجابات بعد.</p>'}`;
  return box;
}

function renderTextQuestion(q, texts){
  const box = document.createElement('div');
  box.className = 'sb-question';
  const list = texts.length
    ? `<ul style="margin:0;padding-inline-start:20px;">${texts.map(a=>`<li style="margin-bottom:6px;">${a}</li>`).join('')}</ul>`
    : `<p style="color:var(--ink-soft);">لا إجابات بعد.</p>`;
  box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title}</h3>${list}`;
  return box;
}

function renderStatsQuestion(q, scores){
  const box = document.createElement('div');
  box.className = 'sb-question';
  if (scores.length === 0){
    box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title}</h3><p style="color:var(--ink-soft);">لا إجابات بعد.</p>`;
    return box;
  }
  const rows = [
    ['الوسط الحسابي', mean(scores).toFixed(2)],
    ['الوسيط', median(scores).toFixed(2)],
    ['المنوال', mode(scores)],
    ['الانحراف المعياري', stdev(scores).toFixed(2)],
    ['التباين', variance(scores).toFixed(2)],
    ['المدى', range(scores)],
  ];
  box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:.88rem;">
      ${rows.map(([k,v]) => `<tr><td style="padding:6px 0;color:var(--ink-soft);">${k}</td><td style="padding:6px 0;font-weight:700;">${v}</td></tr>`).join('')}
    </table>`;
  return box;
}

function buildCompletionRate(){
  const requiredQs = RAW.questions.filter(q => q.required);
  if (requiredQs.length === 0 || RAW.responses.length === 0) return null;
  let complete = 0;
  RAW.responses.forEach(r => {
    const ok = requiredQs.every(q => {
      const v = r.answers[q.id];
      return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
    });
    if (ok) complete++;
  });
  return Math.round((complete / RAW.responses.length) * 100);
}

async function init(){
  if (!surveyId){ wrap.innerHTML = `<div class="sb-card"><p>رابط غير صالح.</p></div>`; return; }
  wrap.innerHTML = `<div class="sb-card"><p>جارٍ التحميل...</p></div>`;

  try {
    const res = await fetch(`/api/surveys/${surveyId}/raw`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'خطأ');
    RAW = data;

    wrap.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'sb-card';
    const completion = buildCompletionRate();
    header.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <h2 style="margin:0 0 6px;">${RAW.title}</h2>
          <p style="color:var(--ink-soft);margin:0;">عدد الإجابات: <strong>${RAW.responses.length}</strong>
          ${completion !== null ? ` · نسبة إكمال الأسئلة الإلزامية: <strong>${completion}%</strong>` : ''}</p>
        </div>
        <div class="sb-results-actions">
          <button id="exportBtn" class="sb-action-btn primary"><span class="abtn-icon">⬇️</span> تصدير Excel</button>
          <button id="printBtn" class="sb-action-btn"><span class="abtn-icon">🖨️</span> طباعة / PDF</button>
        </div>
      </div>`;
    wrap.appendChild(header);

    RAW.questions.forEach(q => {
      const values = RAW.responses.map(r => r.answers[q.id]).filter(v => v !== undefined && v !== null && v !== '');
      if (q.type === 'short' || q.type === 'long'){
        wrap.appendChild(renderTextQuestion(q, values));
      } else if (q.type === 'checkbox'){
        const tally = {};
        values.forEach(v => (Array.isArray(v)?v:[v]).forEach(o => tally[o] = (tally[o]||0)+1));
        wrap.appendChild(renderTallyQuestion(q, tally, RAW.responses.length));
      } else {
        const tally = {};
        values.forEach(v => tally[v] = (tally[v]||0)+1);
        wrap.appendChild(renderTallyQuestion(q, tally, RAW.responses.length));
        if (isNumericQuestion(q)){
          const scores = values.map(v => scoreFor(q, v)).filter(v => v !== null);
          wrap.appendChild(renderStatsQuestion(q, scores));
        }
      }
    });

    renderCronbach();
    renderCorrelation();
    renderCrossTab();

    document.getElementById('exportBtn').addEventListener('click', openExportModal);
    document.getElementById('printBtn').addEventListener('click', () => window.print());

  } catch (err) {
    wrap.innerHTML = `<div class="sb-card"><p>تعذّر تحميل النتائج: ${err.message}</p></div>`;
  }
}

/* =====================================================================
   مصداقية الاستبيان (Cronbach's Alpha)
===================================================================== */
function renderCronbach(){
  const numericQs = RAW.questions.filter(isNumericQuestion);
  if (numericQs.length < 2 || RAW.responses.length < 3) return;

  const matrix = numericQs.map(q =>
    RAW.responses.map(r => scoreFor(q, r.answers[q.id])).filter(v => v !== null)
  );
  const minLen = Math.min(...matrix.map(c => c.length));
  if (minLen < 3) return;
  const trimmed = matrix.map(c => c.slice(0, minLen));
  const alpha = cronbachAlpha(trimmed);
  if (alpha === null) return;

  const box = document.createElement('div');
  box.className = 'sb-question';
  const quality = alpha >= 0.9 ? 'ممتازة' : alpha >= 0.8 ? 'جيدة جدًا' : alpha >= 0.7 ? 'مقبولة' : alpha >= 0.6 ? 'ضعيفة' : 'غير كافية';
  box.innerHTML = `<h3 style="margin:0 0 8px;">مصداقية الاستبيان (Cronbach's Alpha)</h3>
    <p style="font-size:1.4rem;font-weight:800;color:var(--accent);margin:0 0 4px;">${alpha.toFixed(2)}</p>
    <p style="color:var(--ink-soft);margin:0;">التماسك الداخلي: ${quality} (يُحسب من ${numericQs.length} أسئلة رقمية)</p>`;
  wrap.appendChild(box);
}

/* =====================================================================
   الارتباط بين الأسئلة الرقمية
===================================================================== */
function renderCorrelation(){
  const numericQs = RAW.questions.filter(isNumericQuestion);
  if (numericQs.length < 2 || numericQs.length > 8) return;

  const cols = numericQs.map(q => RAW.responses.map(r => scoreFor(q, r.answers[q.id])));
  const n = RAW.responses.length;
  const validIdx = [];
  for (let i=0;i<n;i++){ if (cols.every(c => c[i] !== null)) validIdx.push(i); }
  if (validIdx.length < 3) return;
  const clean = cols.map(c => validIdx.map(i => c[i]));

  const box = document.createElement('div');
  box.className = 'sb-question';
  let table = `<table style="width:100%;border-collapse:collapse;font-size:.78rem;text-align:center;">
    <tr><td></td>${numericQs.map((q,i)=>`<td style="padding:6px;font-weight:700;">س${i+1}</td>`).join('')}</tr>`;
  numericQs.forEach((qRow, i) => {
    table += `<tr><td style="text-align:right;padding:6px;color:var(--ink-soft);">س${i+1}. ${qRow.title.slice(0,20)}</td>`;
    numericQs.forEach((qCol, j) => {
      const r = i === j ? 1 : pearson(clean[i], clean[j]);
      table += `<td style="padding:6px;background:${Math.abs(r) > 0.5 ? 'var(--accent-soft)' : 'transparent'};">${r.toFixed(2)}</td>`;
    });
    table += `</tr>`;
  });
  table += `</table>`;
  box.innerHTML = `<h3 style="margin:0 0 12px;">الارتباط بين الأسئلة الرقمية</h3>${table}
    <p style="font-size:.75rem;color:var(--ink-soft);margin-top:10px;">القيم قريبة من 1 أو -1 تعني ارتباطًا قويًا.</p>`;
  wrap.appendChild(box);
}

/* =====================================================================
   جدول تقاطع بين سؤالين
===================================================================== */
function renderCrossTab(){
  const catQs = RAW.questions.filter(q => ['radio','dropdown','yesno'].includes(q.type));
  if (catQs.length < 2) return;

  const box = document.createElement('div');
  box.className = 'sb-question';
  box.innerHTML = `<h3 style="margin:0 0 12px;">جدول تقاطع بين سؤالين</h3>
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
      <select id="ctA" class="sb-input" style="flex:1;min-width:150px;"></select>
      <select id="ctB" class="sb-input" style="flex:1;min-width:150px;"></select>
    </div>
    <div id="ctTableWrap"></div>`;
  wrap.appendChild(box);

  const selA = box.querySelector('#ctA'), selB = box.querySelector('#ctB');
  catQs.forEach((q, i) => {
    selA.innerHTML += `<option value="${i}">${q.title}</option>`;
    selB.innerHTML += `<option value="${i}">${q.title}</option>`;
  });
  selB.selectedIndex = catQs.length > 1 ? 1 : 0;

  function draw(){
    const qA = catQs[selA.value], qB = catQs[selB.value];
    const optsA = qA.type === 'yesno' ? ['نعم','لا'] : qA.options;
    const optsB = qB.type === 'yesno' ? ['نعم','لا'] : qB.options;
    const grid = {};
    optsA.forEach(a => { grid[a] = {}; optsB.forEach(b => grid[a][b] = 0); });

    RAW.responses.forEach(r => {
      const va = r.answers[qA.id], vb = r.answers[qB.id];
      if (va !== undefined && vb !== undefined && grid[va] && grid[va][vb] !== undefined){
        grid[va][vb]++;
      }
    });

    let table = `<table style="width:100%;border-collapse:collapse;font-size:.8rem;text-align:center;">
      <tr><td></td>${optsB.map(b=>`<td style="padding:6px;font-weight:700;">${b}</td>`).join('')}</tr>`;
    optsA.forEach(a => {
      table += `<tr><td style="text-align:right;padding:6px;font-weight:700;color:var(--ink-soft);">${a}</td>`;
      optsB.forEach(b => { table += `<td style="padding:6px;">${grid[a][b]}</td>`; });
      table += `</tr>`;
    });
    table += `</table>`;
    box.querySelector('#ctTableWrap').innerHTML = table;
  }
  selA.addEventListener('change', draw);
  selB.addEventListener('change', draw);
  draw();
}

/* =====================================================================
   تصدير Excel (CSV) بمعيار SPSS
===================================================================== */
function openExportModal(){
  const modal = document.getElementById('exportModal');
  const list = document.getElementById('exportChecklist');
  list.innerHTML = '';
  RAW.questions.forEach((q, i) => {
    list.innerHTML += `
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" class="exp-check" value="${i}" checked> ${q.title}
      </label>`;
  });
  modal.classList.remove('hidden');
}
document.getElementById('closeExportModal').addEventListener('click', () => {
  document.getElementById('exportModal').classList.add('hidden');
});
document.getElementById('confirmExportBtn').addEventListener('click', exportCSV);

function htmlEscape(v){
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* نصدّر كجدول HTML بامتداد xls — يفتحه Excel دائمًا منظمًا بأعمدة صحيحة
   بغض النظر عن إعدادات فاصلة اللغة (على عكس CSV العادي). */
function exportCSV(){
  const selectedIdx = [...document.querySelectorAll('.exp-check:checked')].map(c => parseInt(c.value, 10));
  const selectedQs = selectedIdx.map(i => RAW.questions[i]);

  const headers = ['الرقم', 'التاريخ'];
  selectedQs.forEach(q => {
    if (q.type === 'checkbox'){
      q.options.forEach(opt => headers.push(`${q.title} - ${opt}`));
    } else if (isNumericQuestion(q)){
      headers.push(q.title, q.title + '_رمز');
    } else {
      headers.push(q.title);
    }
  });

  const rows = RAW.responses.map((r, idx) => {
    const row = [idx + 1, new Date(r.created_at).toLocaleString('ar')];
    selectedQs.forEach(q => {
      const val = r.answers[q.id];
      if (q.type === 'checkbox'){
        const arr = Array.isArray(val) ? val : [];
        q.options.forEach(opt => row.push(arr.includes(opt) ? 1 : 0));
      } else if (isNumericQuestion(q)){
        row.push(val ?? '');
        row.push(val !== undefined ? (scoreFor(q, val) ?? '') : '');
      } else {
        row.push(val ?? '');
      }
    });
    return row;
  });

  const table = `
    <table dir="rtl" border="1">
      <thead><tr>${headers.map(h => `<th style="background:#2F5770;color:#fff;padding:6px 10px;">${htmlEscape(h)}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map(r => `<tr>${r.map(v => `<td style="padding:6px 10px;mso-number-format:'\\@';">${htmlEscape(v)}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>`;

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body>${table}</body></html>`;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (RAW.title || 'survey') + '.xls';
  a.click();

  document.getElementById('exportModal').classList.add('hidden');
}

init();
