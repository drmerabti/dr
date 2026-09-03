const params = new URLSearchParams(location.search);
const surveyId = params.get('id');
const wrap = document.getElementById('resultsWrap');

let RAW = null;
const PALETTE = ['#2F5770', '#4B8FA8', '#7CB9C9', '#E0A458', '#C2694A', '#8D6FA9', '#5C9E6F', '#B15C86'];

/* ============ ترميز وأدوات إحصائية ============ */
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
function mean(a){ return a.reduce((x,y)=>x+y,0)/a.length; }
function median(a){ const s=[...a].sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2? s[m] : (s[m-1]+s[m])/2; }
function mode(a){ const f={}; a.forEach(v=>f[v]=(f[v]||0)+1); let best=null,bc=-1; Object.entries(f).forEach(([k,c])=>{if(c>bc){best=k;bc=c;}}); return {value:best, count:bc}; }
function variance(a){ const m=mean(a); return a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1||1); }
function stdev(a){ return Math.sqrt(variance(a)); }
function range(a){ return Math.max(...a)-Math.min(...a); }
function pearson(x,y){ const n=x.length,mx=mean(x),my=mean(y); let num=0,dx2=0,dy2=0; for(let i=0;i<n;i++){const dx=x[i]-mx,dy=y[i]-my; num+=dx*dy; dx2+=dx*dx; dy2+=dy*dy;} const d=Math.sqrt(dx2*dy2); return d===0?0:num/d; }
function cronbachAlpha(cols){ const k=cols.length; if(k<2) return null; const itemVars=cols.map(variance); const totals=cols[0].map((_,i)=>cols.reduce((s,c)=>s+c[i],0)); const tv=variance(totals); if(tv===0) return null; return (k/(k-1))*(1-itemVars.reduce((a,b)=>a+b,0)/tv); }

/* ============ مولّد التفاسير (3 أسطر، قواعد ثابتة) ============ */
function interpretFrequency(entries, total){
  if (total === 0) return null;
  const sorted = [...entries].sort((a,b)=>b[1]-a[1]);
  const [topLabel, topCount] = sorted[0];
  const topPct = Math.round((topCount/total)*100);
  const secondPct = sorted[1] ? Math.round((sorted[1][1]/total)*100) : 0;
  let line1 = `اختار ${topPct}% من المشاركين "${topLabel}"، وهي الإجابة الأكثر شيوعًا.`;
  let line2, line3;
  if (topPct >= 60){
    line2 = `الفارق واضح عن باقي الخيارات، حيث لم يتجاوز أقرب خيار آخر ${secondPct}%.`;
    line3 = 'هذا يدل على إجماع قوي حول هذه الإجابة تحديدًا.';
  } else if (topPct >= 40){
    line2 = `يليها خيار آخر بنسبة ${secondPct}%، وهو فارق معتدل وليس حاسمًا.`;
    line3 = 'هناك رأي غالب، لكن التنوع في الإجابات لا يزال ملحوظًا.';
  } else {
    line2 = `الفارق عن باقي الخيارات ضئيل (أقرب خيار: ${secondPct}%).`;
    line3 = 'الآراء متوزعة بشكل كبير، ولا يوجد اتجاه مهيمن واضح.';
  }
  return [line1, line2, line3];
}

function interpretMean(q, m, maxScale){
  const pct = (m / maxScale) * 100;
  let line1 = `الوسط الحسابي لهذا السؤال هو ${m.toFixed(2)} من أصل ${maxScale}.`;
  let line2, line3;
  if (pct >= 70){
    line2 = 'هذه القيمة تقع في الجزء الأعلى من المقياس.';
    line3 = 'يعكس هذا اتجاهًا إيجابيًا عامًا لدى غالبية المشاركين تجاه هذا السؤال.';
  } else if (pct >= 40){
    line2 = 'هذه القيمة تقع في المنطقة الوسطى من المقياس.';
    line3 = 'الاتجاه العام متوازن، بين الرضا والتحفظ، دون ميل حاد لأي جهة.';
  } else {
    line2 = 'هذه القيمة تقع في الجزء الأدنى من المقياس.';
    line3 = 'يشير هذا إلى اتجاه سلبي نسبيًا يستحق الانتباه والمتابعة.';
  }
  return [line1, line2, line3];
}

function interpretStd(std){
  let line1 = `الانحراف المعياري لهذا السؤال هو ${std.toFixed(2)}.`;
  let line2, line3;
  if (std < 0.7){
    line2 = 'هذه قيمة منخفضة، تعني أن إجابات المشاركين متقاربة جدًا.';
    line3 = 'بمعنى آخر: هناك شبه إجماع، وليس انقسامًا في وجهات النظر.';
  } else if (std <= 1.3){
    line2 = 'هذه قيمة متوسطة، تعني تفاوتًا معتدلًا بين الإجابات.';
    line3 = 'غالبية المشاركين متقاربون في الرأي، مع وجود بعض الاختلاف الطبيعي.';
  } else {
    line2 = 'هذه قيمة مرتفعة، تعني تشتتًا واضحًا بين الإجابات.';
    line3 = 'يدل هذا على انقسام حقيقي في وجهات النظر بين المشاركين.';
  }
  return [line1, line2, line3];
}

function interpretMode(modeInfo, total){
  const pct = total ? Math.round((modeInfo.count/total)*100) : 0;
  let line1 = `الإجابة الأكثر تكرارًا (المنوال) اختارها ${pct}% من المشاركين.`;
  let line2, line3;
  if (pct >= 60){
    line2 = 'هذه نسبة مرتفعة، تدل على إجماع قوي حول رأي واحد محدد.';
    line3 = 'يمكن اعتماد هذه الإجابة كممثل موثوق لرأي أغلبية المشاركين.';
  } else if (pct >= 35){
    line2 = 'هذا رأي غالب، لكنه ليس شبه إجماع.';
    line3 = 'يُفضَّل قراءته جنبًا إلى جنب مع الوسط الحسابي لفهم الصورة كاملة.';
  } else {
    line2 = 'هذه نسبة منخفضة نسبيًا مقارنة بإجمالي المشاركين.';
    line3 = 'الآراء متوزعة، ولا يوجد رأي مهيمن بوضوح في هذا السؤال.';
  }
  return [line1, line2, line3];
}

function interpretCronbach(alpha, n){
  let quality, line2, line3;
  if (alpha >= 0.9){ quality='ممتازة'; line2='الأسئلة الرقمية تقيس نفس المفهوم بتماسك عالٍ جدًا.'; line3='يمكن الوثوق بنتائج هذا الاستبيان لأغراض التحليل والقرار.'; }
  else if (alpha >= 0.8){ quality='جيدة جدًا'; line2='هناك تماسك داخلي قوي بين الأسئلة الرقمية.'; line3='النتائج موثوقة بدرجة عالية.'; }
  else if (alpha >= 0.7){ quality='مقبولة'; line2='هناك تماسك معقول، لكنه ليس مثاليًا.'; line3='النتائج قابلة للاستخدام، مع ضرورة الحذر عند التعميم.'; }
  else if (alpha >= 0.6){ quality='ضعيفة'; line2='التماسك الداخلي بين الأسئلة محدود.'; line3='يُنصح بمراجعة صياغة الأسئلة الرقمية لتحسين الاتساق.'; }
  else { quality='غير كافية'; line2='الأسئلة الرقمية لا تبدو متماسكة كمجموعة واحدة.'; line3='يُنصح بشدة بإعادة النظر في هذه الأسئلة قبل الاعتماد على النتيجة.'; }
  return { quality, lines: [`قيمة كرونباخ ألفا هي ${alpha.toFixed(2)}، محسوبة من ${n} أسئلة رقمية.`, line2, line3] };
}

/* ============ رسم SVG دائري (Donut) ============ */
function svgDonut(entries, total){
  const size = 160, r = 60, cx = 80, cy = 80, strokeW = 24;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let paths = '';
  entries.forEach(([label, count], i) => {
    const frac = total ? count/total : 0;
    const dash = frac * circ;
    paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PALETTE[i % PALETTE.length]}"
      stroke-width="${strokeW}" stroke-dasharray="${dash} ${circ-dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += dash;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="150" height="150">${paths}
    <circle cx="${cx}" cy="${cy}" r="${r-strokeW/2}" fill="var(--card-bg)"/>
    <text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="18" font-weight="800" fill="var(--ink)">${total}</text>
  </svg>`;
}

function svgLegend(entries, total){
  return `<div class="sb-legend">` + entries.map(([label,count], i) => {
    const pct = total ? Math.round((count/total)*100) : 0;
    return `<div class="sb-legend-row">
      <span class="sb-legend-dot" style="background:${PALETTE[i % PALETTE.length]}"></span>
      <span class="sb-legend-label">${label}</span>
      <span class="sb-legend-val">${count} (${pct}%)</span>
    </div>`;
  }).join('') + `</div>`;
}

/* ============ عرض سؤال باختيار (دائرة + تفسير) ============ */
function renderChoiceQuestion(q, tally, total){
  const entries = Object.entries(tally).sort((a,b)=>b[1]-a[1]);
  const box = document.createElement('div');
  box.className = 'sb-question';

  let chartHtml;
  if (entries.length === 0){
    chartHtml = `<p style="color:var(--ink-soft);">لا إجابات بعد.</p>`;
  } else {
    chartHtml = `<div class="sb-chart-row">
      <div class="sb-donut-wrap">${svgDonut(entries, total)}</div>
      ${svgLegend(entries, total)}
    </div>`;
  }

  const interp = entries.length ? interpretFrequency(entries, total) : null;

  box.innerHTML = `
    <h3 style="margin:0 0 14px;">${q.title}</h3>
    ${chartHtml}
    ${interp ? `<div class="sb-interp">${interp.map(l=>`<p>${l}</p>`).join('')}</div>` : ''}
  `;
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
    box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title} — إحصاءات</h3><p style="color:var(--ink-soft);">لا إجابات بعد.</p>`;
    return box;
  }
  const maxScale = q.type === 'rating' ? 5 : q.options.length;
  const m = mean(scores), md = median(scores), mo = mode(scores), sd = stdev(scores), v = variance(scores), rg = range(scores);

  const rows = [
    ['الوسط الحسابي', m.toFixed(2)], ['الوسيط', md.toFixed(2)], ['المنوال', mo.value],
    ['الانحراف المعياري', sd.toFixed(2)], ['التباين', v.toFixed(2)], ['المدى', rg],
  ];

  const meanInterp = interpretMean(q, m, maxScale);
  const stdInterp = interpretStd(sd);
  const modeInterp = interpretMode(mo, scores.length);

  box.innerHTML = `
    <h3 style="margin:0 0 14px;">${q.title} — تحليل إحصائي</h3>
    <table class="sb-stats-table">
      ${rows.map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
    </table>
    <div class="sb-interp-group">
      <p class="sb-interp-h">📊 تفسير الوسط الحسابي</p>
      <div class="sb-interp">${meanInterp.map(l=>`<p>${l}</p>`).join('')}</div>
      <p class="sb-interp-h">📈 تفسير الانحراف المعياري</p>
      <div class="sb-interp">${stdInterp.map(l=>`<p>${l}</p>`).join('')}</div>
      <p class="sb-interp-h">🎯 تفسير المنوال</p>
      <div class="sb-interp">${modeInterp.map(l=>`<p>${l}</p>`).join('')}</div>
    </div>
  `;
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

function overallAverageScore(){
  const numericQs = RAW.questions.filter(isNumericQuestion);
  if (numericQs.length === 0) return null;
  const all = [];
  numericQs.forEach(q => {
    RAW.responses.forEach(r => {
      const s = scoreFor(q, r.answers[q.id]);
      if (s !== null) all.push(s / (q.type === 'rating' ? 5 : q.options.length));
    });
  });
  if (all.length === 0) return null;
  return Math.round(mean(all) * 100);
}

/* ============ لوحة الملخص العلوية ============ */
function renderDashboard(){
  const completion = buildCompletionRate();
  const avgScore = overallAverageScore();
  const box = document.createElement('div');
  box.className = 'sb-dashboard';
  box.innerHTML = `
    <div class="sb-dash-card">
      <p class="sb-dash-num">${RAW.responses.length}</p>
      <p class="sb-dash-label">إجمالي الإجابات</p>
    </div>
    ${avgScore !== null ? `
    <div class="sb-dash-card" style="--dc:${avgScore>=70?'#5C9E6F':avgScore>=40?'#E0A458':'#C2694A'}">
      <p class="sb-dash-num">${avgScore}%</p>
      <p class="sb-dash-label">المؤشر العام للرضا</p>
    </div>` : ''}
    ${completion !== null ? `
    <div class="sb-dash-card">
      <p class="sb-dash-num">${completion}%</p>
      <p class="sb-dash-label">نسبة إكمال الأسئلة الإلزامية</p>
    </div>` : ''}
    <div class="sb-dash-card">
      <p class="sb-dash-num">${RAW.questions.length}</p>
      <p class="sb-dash-label">عدد الأسئلة</p>
    </div>
  `;
  return box;
}

/* ============ مصداقية الاستبيان (بطاقة بارزة ملوّنة) ============ */
function renderCronbach(){
  const numericQs = RAW.questions.filter(isNumericQuestion);
  if (numericQs.length < 2 || RAW.responses.length < 3) return null;
  const matrix = numericQs.map(q => RAW.responses.map(r => scoreFor(q, r.answers[q.id])).filter(v => v !== null));
  const minLen = Math.min(...matrix.map(c => c.length));
  if (minLen < 3) return null;
  const trimmed = matrix.map(c => c.slice(0, minLen));
  const alpha = cronbachAlpha(trimmed);
  if (alpha === null) return null;

  const info = interpretCronbach(alpha, numericQs.length);
  const color = alpha >= 0.8 ? '#5C9E6F' : alpha >= 0.6 ? '#E0A458' : '#C2694A';

  const box = document.createElement('div');
  box.className = 'sb-cronbach-card';
  box.style.setProperty('--cc', color);
  box.innerHTML = `
    <div class="sb-cronbach-head">
      <span class="sb-cronbach-alpha">${alpha.toFixed(2)}</span>
      <div>
        <h3 style="margin:0;">مصداقية الاستبيان (Cronbach's Alpha)</h3>
        <p style="margin:2px 0 0;color:${color};font-weight:800;">${info.quality}</p>
      </div>
    </div>
    <div class="sb-interp">${info.lines.map(l=>`<p>${l}</p>`).join('')}</div>
  `;
  return box;
}

/* ============ الارتباط وجدول التقاطع ============ */
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
  let table = `<table class="sb-corr-table"><tr><td></td>${numericQs.map((q,i)=>`<td>س${i+1}</td>`).join('')}</tr>`;
  numericQs.forEach((qRow, i) => {
    table += `<tr><td class="rowlabel">س${i+1}. ${qRow.title.slice(0,20)}</td>`;
    numericQs.forEach((qCol, j) => {
      const r = i === j ? 1 : pearson(clean[i], clean[j]);
      table += `<td style="background:${Math.abs(r)>0.5 ? 'var(--accent-soft)' : 'transparent'};">${r.toFixed(2)}</td>`;
    });
    table += `</tr>`;
  });
  table += `</table>`;
  box.innerHTML = `<h3 style="margin:0 0 12px;">الارتباط بين الأسئلة الرقمية</h3>${table}
    <p style="font-size:.75rem;color:var(--ink-soft);margin-top:10px;">القيم قريبة من 1 أو -1 تعني ارتباطًا قويًا.</p>`;
  wrap.appendChild(box);
}

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
      if (va !== undefined && vb !== undefined && grid[va] && grid[va][vb] !== undefined) grid[va][vb]++;
    });
    let table = `<table class="sb-corr-table"><tr><td></td>${optsB.map(b=>`<td>${b}</td>`).join('')}</tr>`;
    optsA.forEach(a => {
      table += `<tr><td class="rowlabel">${a}</td>`;
      optsB.forEach(b => { table += `<td>${grid[a][b]}</td>`; });
      table += `</tr>`;
    });
    table += `</table>`;
    box.querySelector('#ctTableWrap').innerHTML = table;
  }
  selA.addEventListener('change', draw); selB.addEventListener('change', draw); draw();
}

/* ============ INIT ============ */
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
    header.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
        <h2 style="margin:0;">${RAW.title}</h2>
        <div class="sb-results-actions">
          <button id="exportBtn" class="sb-action-btn primary"><span class="abtn-icon">⬇️</span> تصدير Excel</button>
          <button id="printBtn" class="sb-action-btn"><span class="abtn-icon">🖨️</span> طباعة / PDF</button>
        </div>
      </div>`;
    wrap.appendChild(header);
    wrap.appendChild(renderDashboard());

    const cronbachBox = renderCronbach();
    if (cronbachBox) wrap.appendChild(cronbachBox);

    RAW.questions.forEach(q => {
      const values = RAW.responses.map(r => r.answers[q.id]).filter(v => v !== undefined && v !== null && v !== '');
      if (q.type === 'short' || q.type === 'long'){
        wrap.appendChild(renderTextQuestion(q, values));
      } else if (q.type === 'checkbox'){
        const tally = {};
        values.forEach(v => (Array.isArray(v)?v:[v]).forEach(o => tally[o] = (tally[o]||0)+1));
        wrap.appendChild(renderChoiceQuestion(q, tally, RAW.responses.length));
      } else {
        const tally = {};
        values.forEach(v => tally[v] = (tally[v]||0)+1);
        wrap.appendChild(renderChoiceQuestion(q, tally, RAW.responses.length));
        if (isNumericQuestion(q)){
          const scores = values.map(v => scoreFor(q, v)).filter(v => v !== null);
          wrap.appendChild(renderStatsQuestion(q, scores));
        }
      }
    });

    renderCorrelation();
    renderCrossTab();

    document.getElementById('exportBtn').addEventListener('click', openExportModal);
    document.getElementById('printBtn').addEventListener('click', () => window.print());

  } catch (err) {
    wrap.innerHTML = `<div class="sb-card"><p>تعذّر تحميل النتائج: ${err.message}</p></div>`;
  }
}

/* ============ تصدير Excel ============ */
function openExportModal(){
  const modal = document.getElementById('exportModal');
  const list = document.getElementById('exportChecklist');
  list.innerHTML = '';
  RAW.questions.forEach((q, i) => {
    list.innerHTML += `<label style="display:flex;align-items:center;gap:8px;">
      <input type="checkbox" class="exp-check" value="${i}" checked> ${q.title}</label>`;
  });
  modal.classList.remove('hidden');
  document.body.classList.add('sb-modal-open');
}
document.getElementById('closeExportModal').addEventListener('click', () => {
  document.getElementById('exportModal').classList.add('hidden');
  document.body.classList.remove('sb-modal-open');
});
document.getElementById('confirmExportBtn').addEventListener('click', exportCSV);

function htmlEscape(v){ return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function exportCSV(){
  const selectedIdx = [...document.querySelectorAll('.exp-check:checked')].map(c => parseInt(c.value, 10));
  const selectedQs = selectedIdx.map(i => RAW.questions[i]);
  const headers = ['الرقم', 'التاريخ'];
  selectedQs.forEach(q => {
    if (q.type === 'checkbox') q.options.forEach(opt => headers.push(`${q.title} - ${opt}`));
    else if (isNumericQuestion(q)) headers.push(q.title, q.title + '_رمز');
    else headers.push(q.title);
  });
  const rows = RAW.responses.map((r, idx) => {
    const row = [idx + 1, new Date(r.created_at).toLocaleString('ar')];
    selectedQs.forEach(q => {
      const val = r.answers[q.id];
      if (q.type === 'checkbox'){ const arr = Array.isArray(val)?val:[]; q.options.forEach(opt => row.push(arr.includes(opt)?1:0)); }
      else if (isNumericQuestion(q)){ row.push(val ?? ''); row.push(val!==undefined ? (scoreFor(q,val) ?? '') : ''); }
      else row.push(val ?? '');
    });
    return row;
  });
  const table = `<table dir="rtl" border="1">
    <thead><tr>${headers.map(h=>`<th style="background:#2F5770;color:#fff;padding:6px 10px;">${htmlEscape(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r=>`<tr>${r.map(v=>`<td style="padding:6px 10px;mso-number-format:'\\@';">${htmlEscape(v)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head><body>${table}</body></html>`;
  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (RAW.title || 'survey') + '.xls';
  a.click();
  document.getElementById('exportModal').classList.add('hidden');
  document.body.classList.remove('sb-modal-open');
}

init();
