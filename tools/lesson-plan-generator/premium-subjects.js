/* =====================================================================
   مولّد مذكرة الأستاذ — قوالب Premium حسب المادة (10 قوالب، $1.99 للقالب، شراء دائم)
   الرياضيات (الجبر والدوال، الهندسة)، الميكانيك، الكهرباء، الذرّة، التاريخ (المخطوطة، سجل الأحداث)،
   الفلسفة (الأغورا)، اللغة (الخط العربي، القاموس).
   يُحمَّل بعد premium.js وقبل app.js، ويستعمل أدوات premium.js (PREMIUM_KIT) وأدوات app.js وقت الرسم فقط.
   نفس قواعد التصدير: ألوان SVG حرفية، لا نص داخل SVG (الرموز والأرقام نصوص HTML فوقه)،
   لا clip-path ولا filter ولا background-clip:text، ولا letter-spacing على العربية.
   الكتالوج والسعر الحقيقيان في الـ Worker (LP_PREMIUM / LP_PRICE).
===================================================================== */
(function () {
  'use strict';
  const K = window.PREMIUM_KIT;
  if (!K || !window.PREMIUM_TPL) return;
  const { mins, shares, pctTxt, two, val, durTxt, kindOf, ico, tbar, donut, signs, logoImg, actTS, evalOn } = K;
  const PT = {};

  /* بدايات المراحل ونهاياتها بالدقائق (تراكمي) */
  function marks(p) {
    const { ms } = shares(p); let acc = 0;
    return ms.map(m => { const a = acc; acc += m; return [a, acc]; });
  }
  const ORD = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة', 'الحادية عشرة', 'الثانية عشرة'];
  const ABJAD = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل'];
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const at = (a, i) => a[i % a.length];
  const mm = s => (mins(s) ? mins(s) + ' د' : '—');

  /* =================================================================
     1) الجبر والدوال — ورق مليمتري، معلم متعامد ومنحنيات، مستقيم مدرّج لزمن الحصة
  ================================================================= */
  const AL = { ink: '#1B2A4A', c: '#E4572E', t: '#17A398', y: '#F3A712', v: '#6A4C93' };
  const alPlot = (() => {
    let grid = '';
    for (let x = 20; x <= 240; x += 20) grid += `<path d="M${x} 8V164" stroke="#E3EAF4" stroke-width="1"/>`;
    for (let y = 12; y <= 164; y += 19) grid += `<path d="M14 ${y}H246" stroke="#E3EAF4" stroke-width="1"/>`;
    let sin = 'M14 96', par = '';
    for (let x = 14; x <= 246; x += 4) sin += `L${x} ${(96 - 34 * Math.sin((x - 14) / 26)).toFixed(1)}`;
    for (let x = 52; x <= 208; x += 4) { const u = (x - 130) / 34; par += `${par ? 'L' : 'M'}${x} ${(152 - 26 * u * u * 1.15).toFixed(1)}`; }
    return `<svg class="al-svg" viewBox="0 0 260 172" width="260" height="172"><rect width="260" height="172" rx="10" fill="#FFFFFF"/>${grid}` +
      `<path d="M14 96H246" stroke="${AL.ink}" stroke-width="1.6"/><path d="M246 96l-8-4v8z" fill="${AL.ink}"/>` +
      `<path d="M130 166V10" stroke="${AL.ink}" stroke-width="1.6"/><path d="M130 6l-4 9h8z" fill="${AL.ink}"/>` +
      `<path d="${par}" fill="none" stroke="${AL.t}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="${sin}" fill="none" stroke="${AL.c}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M60 150L210 42" stroke="${AL.v}" stroke-width="1.4" stroke-dasharray="5 4"/>` +
      `<circle cx="130" cy="96" r="3.5" fill="${AL.ink}"/><circle cx="96" cy="${(96 - 34 * Math.sin(82 / 26)).toFixed(1)}" r="4.5" fill="${AL.c}"/><circle cx="164" cy="${(152 - 26 * 1.15).toFixed(1)}" r="4.5" fill="${AL.t}"/></svg>`;
  })();
  PT.algebra = p => {
    const g = grow(p), mk = marks(p), tot = (mk.length ? mk[mk.length - 1][1] : 0) || 1;
    const cols = [AL.c, AL.t, AL.y, AL.v, '#1982C4', '#8AC926'];
    const W = 706, X = f => (10 + f * (W - 20)).toFixed(1);
    let line = `<path d="M2 20H${W - 2}" stroke="${AL.ink}" stroke-width="1.4"/><path d="M${W} 20l-8-4v8z" fill="${AL.ink}"/>`;
    mk.forEach(([a, b], i) => { line += `<path d="M${X(a / tot)} 20H${X(b / tot)}" stroke="${at(cols, i)}" stroke-width="7" stroke-linecap="butt"/>`; });
    const ticks = [0].concat(mk.map(x => x[1]));
    ticks.forEach(v => { line += `<path d="M${X(v / tot)} 11V29" stroke="${AL.ink}" stroke-width="1.6"/>`; });
    const sym = ['∫', 'π', '√', 'Σ', '∞', 'Δ'].map((c, i) => `<i class="al-sy s${i}">${c}</i>`).join('');
    return `<div class="paper pr-algebra"><div class="al-grid"></div>
    <div class="al-in">
      <header class="al-h">${sym}
        <div class="al-ht"><small${S('header')}>مذكرة تحضير درس · ${val(p.subject)}</small><h1${S('lesson')}>${val(p.title)}</h1>
          <div class="al-u"${S('lesson')}><span>الوحدة</span><b>${val(p.unit)}</b></div>
          <p${S('header')}>${val(p.school)} · ${val(p.year)}</p>${logoImg(p, 'al-lg')}</div>
        <div class="al-plot">${alPlot}<i class="al-l lx" dir="ltr">x</i><i class="al-l ly" dir="ltr">y</i><i class="al-l lo" dir="ltr">O</i>
          <i class="al-l lf" dir="ltr">f(x) = sin x</i><i class="al-l lg2" dir="ltr">g(x) = x²</i></div>
      </header>
      <div class="al-info">
        <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div><div${S('lesson')}><small>رقم الحصة</small><b dir="ltr">n = ${val(p.session)}</b></div>
        <div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div><div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
      </div>
      <div class="al-two">
        <section${S('objectives')}><h5><em>∴</em>الأهداف / الكفاءة المستهدفة</h5><ul>${p.objectives.map((o, i) => `<li><i dir="ltr">H${i + 1}</i><span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5><em>{ }</em>مجموعة الوسائل</h5><p class="al-set"><b>{</b> ${p.materials.map(esc).join(' <i>؛</i> ')} <b>}</b></p></section>
      </div>
      <div class="al-nl"${S('stages')}><h5>المستقيم المدرّج لزمن الحصة <small>(بالدقيقة)</small></h5>
        <div class="al-line" dir="ltr"><svg viewBox="0 0 ${W} 34" width="${W}" height="34">${line}</svg>
          ${ticks.map(v => `<span style="left:${X(v / tot)}px">${v}</span>`).join('')}</div></div>
      <div class="al-st"${S('stages')}>
        ${p.stages.map((s, i) => `<div class="al-s" style="--g:${g[i]};border-right-color:${at(cols, i)}"><div class="al-n" style="color:${at(cols, i)}" dir="ltr">[${i + 1}]</div>
          <div class="al-c"><div class="al-sh"><b>${esc(s.title)}</b><em dir="ltr">t ∈ [${mk[i][0]} ; ${mk[i][1]}]</em></div><div class="al-sa">${actTS(s, 'al-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="al-ev"${S('eval')}><b>⟸ التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      ${signs(p, 'al-sg')}
    </div></div>`;
  };

  /* =================================================================
     2) الهندسة — مسطرة مدرّجة، إنشاء هندسي بالمدور، مضلعات مرقّمة، منقلة
  ================================================================= */
  const GE = { ink: '#2E3440', b: '#3D5A99', y: '#F2C14E', r: '#C8553D', pale: '#EEF2FA' };
  const geRuler = (() => {
    let t = '';
    for (let k = 0; k <= 200; k++) {
      const x = 20 + k * 3.78, h = k % 10 === 0 ? 14 : k % 5 === 0 ? 9 : 5;
      if (x > 790) break;
      t += `<path d="M${x.toFixed(2)} 0V${h}" stroke="#5C4B2E" stroke-width="${k % 10 === 0 ? 1.1 : 0.7}"/>`;
    }
    return `<svg class="ge-rsvg" viewBox="0 0 794 30" width="794" height="30" preserveAspectRatio="none"><rect width="794" height="30" fill="#F3E3B5"/><path d="M0 29.5H794" stroke="#C9AE6E" stroke-width="1"/>${t}</svg>`;
  })();
  const geFig = `<svg class="ge-svg" viewBox="0 0 240 180" width="240" height="180">` +
    `<circle cx="120" cy="98" r="72" fill="none" stroke="${GE.b}" stroke-width="1.2" stroke-dasharray="5 4"/>` +
    `<path d="M58 134L184 134L104 30Z" fill="#F7EBC8" stroke="${GE.ink}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M121 134V60" stroke="${GE.r}" stroke-width="1.2" stroke-dasharray="4 3"/><path d="M121 134h-8v-8h8" fill="none" stroke="${GE.r}" stroke-width="1.2"/>` +
    `<path d="M80 134A22 22 0 0 0 70 115" fill="none" stroke="${GE.b}" stroke-width="1.6"/>` +
    `<path d="M150 150A40 40 0 0 0 170 118" fill="none" stroke="#9AA5B8" stroke-width="1"/><path d="M30 120A40 40 0 0 1 52 92" fill="none" stroke="#9AA5B8" stroke-width="1"/>` +
    `<circle cx="58" cy="134" r="3.5" fill="${GE.ink}"/><circle cx="184" cy="134" r="3.5" fill="${GE.ink}"/><circle cx="104" cy="30" r="3.5" fill="${GE.ink}"/><circle cx="120" cy="98" r="2.8" fill="${GE.b}"/>` +
    `<g transform="translate(196 8) rotate(18)"><path d="M10 0L14 6L5 66L2 64Z" fill="#7B8798"/><path d="M14 6L28 64L25 66L11 8Z" fill="#5A6576"/><circle cx="12" cy="4" r="5" fill="${GE.y}" stroke="${GE.ink}" stroke-width="1"/><path d="M3 64l-2 8" stroke="${GE.ink}" stroke-width="1.4"/></g></svg>`;
  function poly(n, size, fill) {
    const c = size / 2, r = size / 2 - 2; let pts = [];
    if (n >= 12) return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${c}" cy="${c}" r="${r}" fill="${fill}"/></svg>`;
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / n; pts.push((c + r * Math.cos(a)).toFixed(1) + ',' + (c + r * Math.sin(a) + (n === 3 ? 3 : 0)).toFixed(1)); }
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><polygon points="${pts.join(' ')}" fill="${fill}" stroke="${GE.ink}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  }
  const geProt = (() => {
    let t = '';
    for (let d = 0; d <= 180; d += 10) { const a = Math.PI - d * Math.PI / 180, r1 = 58, r2 = d % 30 === 0 ? 48 : 52; t += `<path d="M${(70 + r1 * Math.cos(a)).toFixed(1)} ${(66 - r1 * Math.sin(a)).toFixed(1)}L${(70 + r2 * Math.cos(a)).toFixed(1)} ${(66 - r2 * Math.sin(a)).toFixed(1)}" stroke="${GE.b}" stroke-width="1"/>`; }
    return `<svg class="ge-prot" viewBox="0 0 140 70" width="140" height="70"><path d="M8 66A62 62 0 0 1 132 66Z" fill="#E7EEF9" stroke="${GE.b}" stroke-width="1.4"/><path d="M34 66A36 36 0 0 1 106 66" fill="none" stroke="${GE.b}" stroke-width=".8"/>${t}<path d="M70 66L118 30" stroke="${GE.r}" stroke-width="1.6"/><circle cx="70" cy="66" r="3" fill="${GE.ink}"/></svg>`;
  })();
  const geComp = `<svg viewBox="0 0 20 20" width="17" height="17"><g fill="none" stroke="${GE.b}" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="4" r="2"/><path d="M9 6L4 18M11 6l5 12M6 13h8"/></g></svg>`;
  PT.geometry = p => {
    const g = grow(p), pal = ['#F7EBC8', '#DCE6F7', '#F6D8D0', '#DDEFE3', '#EDE3F6', '#FCE9C5'];
    const nums = []; for (let k = 0; k <= 20; k++) nums.push(`<span style="left:${(20 + k * 37.8).toFixed(1)}px">${k}</span>`);
    return `<div class="paper pr-geometry"><div class="ge-ruler">${geRuler}<div class="ge-rn" dir="ltr">${nums.join('')}</div></div>
    <div class="ge-in">
      <header class="ge-h">
        <div class="ge-ht"><small${S('header')}>${val(p.school)} · ${val(p.year)}</small><span class="ge-k"${S('lesson')}>مذكرة تحضير درس</span><h1${S('lesson')}>${val(p.title)}</h1>
          <div class="ge-dim"><i></i><span${S('lesson')}>${val(p.unit)}</span><i></i></div>${logoImg(p, 'ge-lg')}</div>
        <div class="ge-fig">${geFig}<i class="ge-p pa" dir="ltr">A</i><i class="ge-p pb" dir="ltr">B</i><i class="ge-p pc" dir="ltr">C</i><i class="ge-p po" dir="ltr">O</i></div>
      </header>
      <div class="ge-info">
        <div${S('header')}><small>المادة</small><b>${val(p.subject)}</b></div><div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div>
        <div${S('lesson')}><small>الحصة</small><b>${val(p.session)}</b></div><div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div>
        <div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
      </div>
      <div class="ge-two">
        <section${S('objectives')}><h5>${geComp}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${p.objectives.map((o, i) => `<li><i>${poly(3 + (i % 4), 16, at(pal, i))}</i><span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>${geComp}<span>الأدوات والوسائل</span></h5><ul>${p.materials.map(m => `<li><i class="ge-dot"></i><span>${esc(m)}</span></li>`).join('')}</ul></section>
      </div>
      <div class="ge-st"${S('stages')}><h4><span>سير الدرس</span><i></i></h4>
        ${p.stages.map((s, i) => `<div class="ge-s" style="--g:${g[i]}"><div class="ge-n">${poly(3 + i, 44, at(pal, i))}<b>${i + 1}</b></div>
          <div class="ge-c"><div class="ge-sh"><b>${esc(s.title)}</b><em>${mm(s)}</em></div><div class="ge-sa">${actTS(s, 'ge-p2')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="ge-ev"${S('eval')}><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      <div class="ge-foot">${signs(p, 'ge-sg', ['توقيع الأستاذ(ة)'])}${geProt}${signs(p, 'ge-sg', ['تأشيرة المدير(ة) / المفتش(ة)'])}</div>
    </div></div>`;
  };

  /* =================================================================
     3) الميكانيك — تروس متعشّقة، لوحة مواصفات معدنية، عدّاد الزمن، مخطط قوى
  ================================================================= */
  const ME = { d: '#263238', s: '#37474F', o: '#F57C00', l: '#ECEFF1', y: '#FFC107', g: '#90A4AE' };
  function gear(cx, cy, r, teeth, fill, hole) {
    const ri = r * 0.8, st = 2 * Math.PI / teeth; let d = '';
    for (let k = 0; k < teeth; k++) {
      const a = k * st;
      [[ri, a], [r, a + st * 0.18], [r, a + st * 0.48], [ri, a + st * 0.66]].forEach(([rr, aa], j) => {
        d += (k === 0 && j === 0 ? 'M' : 'L') + (cx + rr * Math.cos(aa)).toFixed(1) + ' ' + (cy + rr * Math.sin(aa)).toFixed(1);
      });
    }
    return `<path d="${d}Z" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.52).toFixed(1)}" fill="none" stroke="${hole}" stroke-width="${(r * 0.1).toFixed(1)}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.18).toFixed(1)}" fill="${hole}"/>`;
  }
  const meHead = `<svg class="me-gears" viewBox="0 0 300 200" width="300" height="200">${gear(96, 104, 70, 16, ME.o, ME.d)}${gear(204, 60, 46, 11, ME.g, ME.d)}${gear(214, 160, 34, 9, '#607D8B', ME.d)}</svg>`;
  const meStripes = h => { let s = ''; for (let x = -h; x < 794 + h; x += 2 * h) s += `<path d="M${x} ${h}L${x + h} 0H${x + 2 * h}L${x + h} ${h}Z" fill="${ME.y}"/>`; return `<svg class="me-str" viewBox="0 0 794 ${h}" width="794" height="${h}" preserveAspectRatio="none"><rect width="794" height="${h}" fill="#212121"/>${s}</svg>`; };
  const meFbd = `<svg class="me-fbd" viewBox="0 0 150 96" width="150" height="96"><path d="M4 90H146L4 40Z" fill="#CFD8DC" stroke="${ME.s}" stroke-width="1.4"/>` +
    `<g transform="rotate(-19.4 62 62)"><rect x="46" y="40" width="34" height="22" fill="${ME.o}" stroke="${ME.d}" stroke-width="1.2"/></g>` +
    `<path d="M63 52V90" stroke="#C62828" stroke-width="2"/><path d="M63 94l-4-8h8z" fill="#C62828"/>` +
    `<path d="M63 52L48 10" stroke="#1565C0" stroke-width="2"/><path d="M46 5l-1 9 7-3z" fill="#1565C0"/>` +
    `<path d="M63 52L30 64" stroke="#2E7D32" stroke-width="2"/><path d="M25 66l8-6 2 7z" fill="#2E7D32"/><circle cx="63" cy="52" r="2.6" fill="${ME.d}"/></svg>`;
  function gauge(p, cols) {
    const { pct } = shares(p), R = 52, C = Math.PI * R; let off = 0;
    const segs = pct.map((f, i) => { const len = f * C, s = `<circle cx="64" cy="64" r="${R}" fill="none" stroke="${at(cols, i)}" stroke-width="14" stroke-dasharray="${Math.max(len - 2, 0.1).toFixed(2)} ${(2 * Math.PI * R).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(180 64 64)"/>`; off += len; return s; }).join('');
    return `<svg viewBox="0 0 128 70" width="128" height="70"><circle cx="64" cy="64" r="${R}" fill="none" stroke="#CFD8DC" stroke-width="14" stroke-dasharray="${C.toFixed(2)} ${(2 * Math.PI * R).toFixed(2)}" transform="rotate(180 64 64)"/>${segs}<circle cx="64" cy="64" r="5" fill="${ME.d}"/></svg>`;
  }
  PT.mechanics = p => {
    const g = grow(p), sh = shares(p), cols = [ME.o, '#546E7A', ME.y, '#8D6E63', '#26A69A', '#78909C'];
    return `<div class="paper pr-mechanics">
    <div class="me-h">${meHead}
      <div class="me-ht"><small${S('header')}>${val(p.school)} · ${val(p.year)}</small><span${S('lesson')}>مذكرة تحضير درس · ${val(p.subject)}</span><h1${S('lesson')}>${val(p.title)}</h1><p${S('lesson')}>${val(p.unit)}</p></div>${logoImg(p, 'me-lg')}
    </div>${meStripes(14)}
    <div class="me-in">
      <div class="me-plate"><i class="rv a"></i><i class="rv b"></i><i class="rv c"></i><i class="rv d"></i>
        <div class="me-cells">
          <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div><div${S('lesson')}><small>رقم الحصة</small><b>${val(p.session)}</b></div>
          <div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
        </div>
        <div class="me-gauge"${S('lesson')}>${gauge(p, cols)}<b>${sh.tot || val(p.duration)}</b><small>دقيقة</small></div>
      </div>
      <div class="me-two">
        <section${S('objectives')}><h5><svg viewBox="0 0 40 40" width="18" height="18">${gear(20, 20, 18, 8, ME.o, '#FFFFFF')}</svg><span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${p.objectives.map((o, i) => `<li><i>${i + 1}</i><span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section class="me-mat"${S('materials')}><h5><svg viewBox="0 0 40 40" width="18" height="18">${gear(20, 20, 18, 8, ME.g, '#FFFFFF')}</svg><span>الوسائل</span></h5><ul>${p.materials.map(m => `<li><i></i><span>${esc(m)}</span></li>`).join('')}</ul>
          <div class="me-fb">${meFbd}<em class="fp" dir="ltr">P</em><em class="fr" dir="ltr">R</em><em class="ff" dir="ltr">f</em></div></section>
      </div>
      <div class="me-st"${S('stages')}><h4>سير الدرس <small>${p.stages.map((s, i) => `<i style="background:${at(cols, i)}"></i>`).join('')}</small></h4>
        ${p.stages.map((s, i) => `<div class="me-s" style="--g:${g[i]}"><div class="me-n"><svg viewBox="0 0 50 50" width="48" height="48">${gear(25, 25, 23, 10, at(cols, i), ME.l)}</svg><b>${i + 1}</b></div>
          <div class="me-c" style="border-right-color:${at(cols, i)}"><div class="me-sh"><b>${esc(s.title)}</b><em>${mm(s)} · ${pctTxt(sh.pct[i])}</em></div><div class="me-sa">${actTS(s, 'me-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="me-ev"${S('eval')}><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      ${signs(p, 'me-sg')}
    </div>${meStripes(10)}</div>`;
  };

  /* =================================================================
     4) الدارة الكهربائية — العنوان داخل دارة (مولد، ناقل أومي، مصباح، قاطعة، مكثفة)، مراحل على التسلسل
  ================================================================= */
  const CI = { w: '#263238', b: '#1565C0', y: '#FFC400', r: '#D84315', pale: '#E3F2FD' };
  function ciCircuit() {
    const W = 714, H = 196, cut = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFFFF"/>`, yb = H - 14;
    let s = `<rect x="12" y="14" width="${W - 24}" height="${H - 28}" rx="6" fill="none" stroke="${CI.w}" stroke-width="2.2"/>`;
    s += cut(4, 84, 18, 30) + `<path d="M0 92H24" stroke="${CI.w}" stroke-width="2.4"/><path d="M6 104H18" stroke="${CI.w}" stroke-width="5"/>`;
    s += cut(170, 6, 100, 16) + `<path d="M170 14H184L190 6L200 22L210 6L220 22L230 6L240 22L246 14H270" fill="none" stroke="${CI.w}" stroke-width="2.2" stroke-linejoin="round"/>`;
    s += cut(448, 0, 48, 30) + `<g stroke="${CI.y}" stroke-width="2.2" stroke-linecap="round"><path d="M472 -2v-8M494 4l7-5M450 4l-7-5"/></g><circle cx="472" cy="14" r="14" fill="#FFF8E1" stroke="${CI.w}" stroke-width="2.2"/><path d="M462 4L482 24M482 4L462 24" stroke="${CI.w}" stroke-width="2"/>`;
    s += cut(330, yb - 16, 70, 24) + `<path d="M318 ${yb}H336M392 ${yb}H412" stroke="${CI.w}" stroke-width="2.2"/><circle cx="338" cy="${yb}" r="3.5" fill="${CI.w}"/><circle cx="390" cy="${yb}" r="3.5" fill="${CI.w}"/><path d="M338 ${yb}L386 ${yb - 6}" stroke="${CI.w}" stroke-width="2.4" stroke-linecap="round"/>`;
    s += cut(W - 22, 82, 20, 34) + `<path d="M${W - 24} 92H${W}M${W - 24} 104H${W}" stroke="${CI.w}" stroke-width="2.6"/>`;
    s += `<path d="M560 ${yb}l-12-6v12z" fill="${CI.r}"/><path d="M140 ${yb}l-12-6v12z" fill="${CI.r}"/>`;
    s += `<circle cx="12" cy="14" r="3.5" fill="${CI.w}"/><circle cx="${W - 12}" cy="14" r="3.5" fill="${CI.w}"/><circle cx="12" cy="${yb}" r="3.5" fill="${CI.w}"/><circle cx="${W - 12}" cy="${yb}" r="3.5" fill="${CI.w}"/>`;
    return `<svg class="ci-svg" viewBox="0 -14 ${W} ${H + 14}" width="${W}" height="${H + 14}">${s}</svg>`;
  }
  const ciBolt = (c, s) => `<svg viewBox="0 0 20 20" width="${s}" height="${s}"><path d="M11.5 1L3 11.5h6L7.5 19 17 7.5h-6.2z" fill="${c}" stroke="${CI.w}" stroke-width="1" stroke-linejoin="round"/></svg>`;
  PT.circuit = p => {
    const g = grow(p), sh = shares(p), cols = [CI.b, '#00897B', '#F9A825', '#6A1B9A', CI.r, '#2E7D32'];
    return `<div class="paper pr-circuit"><div class="ci-in">
      <header class="ci-h">${ciCircuit()}<i class="ci-l li" dir="ltr">I</i><i class="ci-l lr" dir="ltr">R</i><i class="ci-l lk" dir="ltr">K</i><i class="ci-l lc" dir="ltr">C</i><i class="ci-l lp" dir="ltr">+</i><i class="ci-l lm" dir="ltr">−</i>
        <div class="ci-ht"><small${S('header')}>${val(p.school)} · ${val(p.year)}</small><span${S('lesson')}>مذكرة تحضير درس · ${val(p.subject)}</span><h1${S('lesson')}>${val(p.title)}</h1><p${S('lesson')}>${val(p.unit)}</p></div>${logoImg(p, 'ci-lg')}
      </header>
      <div class="ci-info">
        <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div><div${S('lesson')}><small>الحصة</small><b>${val(p.session)}</b></div>
        <div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div><div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
      </div>
      <div class="ci-two">
        <section${S('objectives')}><h5>${ciBolt(CI.y, 17)}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${p.objectives.map(o => `<li>${ciBolt(CI.y, 13)}<span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>${ciBolt(CI.y, 17)}<span>الوسائل التعليمية</span></h5><ul>${p.materials.map((m, i) => `<li><i class="${i % 2 ? 'mn' : 'pl'}">${i % 2 ? '−' : '+'}</i><span>${esc(m)}</span></li>`).join('')}</ul></section>
      </div>
      <div class="ci-bat"${S('stages')}><small>شحن الحصة</small><div class="ci-cell">${tbar(p, cols, 'ci-bar', ['#FFFFFF'])}</div><i class="ci-nub"></i><b>${sh.tot ? sh.tot + ' د' : ''}</b></div>
      <div class="ci-st"${S('stages')}>
        ${p.stages.map((s, i) => `<div class="ci-s" style="--g:${g[i]}"><div class="ci-node"><i style="border-color:${at(cols, i)}">${ico(kindOf(s, i, p.stages.length), at(cols, i), 18, 2)}</i></div>
          <div class="ci-c" style="border-color:${at(cols, i)}"><div class="ci-sh"><b>${esc(s.title)}</b><em style="background:${at(cols, i)}">${mm(s)}</em></div><div class="ci-sa">${actTS(s, 'ci-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="ci-ev"${S('eval')}>${ciBolt(CI.y, 22)}<div><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div></div>` : ''}
      ${signs(p, 'ci-sg')}
      <svg class="ci-gnd" viewBox="0 0 60 30" width="60" height="30"><path d="M30 0V12M14 12H46M20 19H40M26 26H34" stroke="${CI.w}" stroke-width="2.2" stroke-linecap="round"/></svg>
    </div></div>`;
  };

  /* =================================================================
     5) الذرّة — نموذج ذري بمدارات، بطاقة «عنصر الحصة» كالجدول الدوري، طبقات إلكترونية للمراحل
  ================================================================= */
  const AT = { v: '#5E35B1', c: '#00ACC1', m: '#D81B60', d: '#1A237E', pale: '#F3EFFB' };
  const atAtom = (() => {
    const nuc = [[0, 0, AT.m], [9, -4, '#78909C'], [-8, -5, AT.m], [4, 9, '#78909C'], [-6, 8, AT.m], [11, 6, AT.m], [-11, 3, '#78909C'], [1, -11, '#78909C'], [-2, 3, AT.m]]
      .map(([x, y, c]) => `<circle cx="${110 + x}" cy="${92 + y}" r="7" fill="${c}" stroke="#FFFFFF" stroke-width="1.2"/>`).join('');
    const orb = [0, 60, 120].map((a, i) => `<ellipse cx="110" cy="92" rx="96" ry="32" fill="none" stroke="${[AT.v, AT.c, '#7E57C2'][i]}" stroke-width="2" transform="rotate(${a} 110 92)"/>`).join('');
    const el = [[0, 96, 0], [60, -70, 21], [120, 30, -30], [0, -96, 0], [60, 60, -20], [120, -40, 26]].map(([a, x, y]) => {
      const r = a * Math.PI / 180, X = 110 + x * Math.cos(r) - y * Math.sin(r), Y = 92 + x * Math.sin(r) + y * Math.cos(r);
      return `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="5.5" fill="${AT.c}" stroke="#FFFFFF" stroke-width="1.5"/>`;
    }).join('');
    return `<svg class="at-svg" viewBox="0 0 220 184" width="220" height="184">${orb}${nuc}${el}</svg>`;
  })();
  const hexMol = (cls) => {
    const hx = (cx, cy) => { let s = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; s.push((cx + 22 * Math.cos(a)).toFixed(1) + ',' + (cy + 22 * Math.sin(a)).toFixed(1)); } return `<polygon points="${s.join(' ')}" fill="none" stroke="#D1C4E9" stroke-width="2"/>`; };
    return `<svg class="${cls}" viewBox="0 0 120 110" width="120" height="110">${hx(30, 30)}${hx(68, 52)}${hx(30, 74)}<circle cx="68" cy="52" r="10" fill="none" stroke="#D1C4E9" stroke-width="1.5"/><path d="M87 41L108 29" stroke="#D1C4E9" stroke-width="2"/></svg>`;
  };
  const atMini = c => `<svg viewBox="0 0 20 20" width="15" height="15"><ellipse cx="10" cy="10" rx="9" ry="3.6" fill="none" stroke="${c}" stroke-width="1.4"/><ellipse cx="10" cy="10" rx="9" ry="3.6" fill="none" stroke="${c}" stroke-width="1.4" transform="rotate(60 10 10)"/><ellipse cx="10" cy="10" rx="9" ry="3.6" fill="none" stroke="${c}" stroke-width="1.4" transform="rotate(120 10 10)"/><circle cx="10" cy="10" r="2.2" fill="${AT.m}"/></svg>`;
  const SHELL = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
  PT.atom = p => {
    const g = grow(p), sh = shares(p), cols = [AT.v, AT.c, AT.m, '#3949AB', '#00897B', '#8E24AA'];
    const sym = (String(p.subject || '').trim().replace(/^ال/, '')[0]) || '؟';
    return `<div class="paper pr-atom">${hexMol('at-hx a')}${hexMol('at-hx b')}<div class="at-in">
      <header class="at-h">
        <div class="at-ht"><small${S('header')}>${val(p.school)} · ${val(p.year)}</small><span${S('lesson')}>مذكرة تحضير درس</span><h1${S('lesson')}>${val(p.title)}</h1><p${S('lesson')}>${val(p.unit)}</p>${logoImg(p, 'at-lg')}</div>
        <div class="at-el"${S('header')}><i dir="ltr">${val(p.session)}</i><b>${esc(sym)}</b><span>${val(p.subject)}</span><em>${durTxt(p)}</em><small>عنصر الحصة</small></div>
        <div class="at-atom">${atAtom}</div>
      </header>
      <div class="at-info">
        <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div><div${S('lesson')}><small>الحصة</small><b>${val(p.session)}</b></div>
        <div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div><div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
      </div>
      <div class="at-two">
        <section${S('objectives')}><h5>${atMini(AT.v)}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${p.objectives.map(o => `<li>${atMini(AT.c)}<span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>${atMini(AT.v)}<span>الوسائل التعليمية</span></h5><div class="at-pills">${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div></section>
      </div>
      <div class="at-st"${S('stages')}><h4>سير الدرس <small>الطبقات الإلكترونية للحصة</small></h4>
        ${p.stages.map((s, i) => `<div class="at-s" style="--g:${g[i]}"><div class="at-sh2"><svg viewBox="0 0 48 48" width="48" height="48"><circle cx="24" cy="24" r="21" fill="none" stroke="${at(cols, i)}" stroke-width="2" stroke-dasharray="${i % 2 ? '4 3' : '0'}"/><circle cx="24" cy="3" r="4" fill="${at(cols, i)}"/><circle cx="24" cy="24" r="13" fill="${at(cols, i)}"/></svg><b>${at(SHELL, i)}</b></div>
          <div class="at-c"><div class="at-hd"><b>${esc(s.title)}</b><em style="color:${at(cols, i)}">${mm(s)}</em></div><div class="at-sa">${actTS(s, 'at-p')}</div></div></div>`).join('')}
      </div>
      <div class="at-row">
        <div class="at-dn"${S('stages')}><div class="at-ring">${donut(p, cols, 96, 14)}<div><b>${sh.tot || '—'}</b><small>دقيقة</small></div></div>
          <div class="at-lgd">${p.stages.map((s, i) => `<div><i style="background:${at(cols, i)}"></i><span>${at(SHELL, i)} · ${esc(s.title)}</span><b>${pctTxt(sh.pct[i])}</b></div>`).join('')}</div></div>
        ${evalOn(p) ? `<div class="at-ev"${S('eval')}><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      </div>
      ${signs(p, 'at-sg')}
    </div></div>`;
  };

  /* =================================================================
     6) المخطوطة التاريخية — رَقّ عتيق، شريط عنوان، ختم شمعي، عناوين حمراء ومراحل بالترتيب
  ================================================================= */
  const MS = { ink: '#3E2723', r: '#8E2C1F', g: '#A07A2C', pa: '#F3E6C8' };
  const msSeal = (() => {
    let pts = []; for (let k = 0; k < 28; k++) { const a = k * Math.PI / 14, r = k % 2 ? 34 : 38; pts.push((40 + r * Math.cos(a)).toFixed(1) + ',' + (40 + r * Math.sin(a)).toFixed(1)); }
    let st = []; for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + k * Math.PI / 8, r = k % 2 ? 7 : 16; st.push((40 + r * Math.cos(a)).toFixed(1) + ',' + (40 + r * Math.sin(a)).toFixed(1)); }
    return `<svg viewBox="0 0 80 80" width="80" height="80"><polygon points="${pts.join(' ')}" fill="#A3241B"/><circle cx="40" cy="40" r="27" fill="#8B1A13"/><circle cx="40" cy="40" r="23" fill="none" stroke="#C84A3A" stroke-width="1.5"/><polygon points="${st.join(' ')}" fill="#C84A3A"/></svg>`;
  })();
  const msTail = flip => `<svg class="ms-tail ${flip ? 'l' : 'r'}" viewBox="0 0 50 60" width="50" height="60"><g${flip ? ' transform="translate(50 0) scale(-1 1)"' : ''}><path d="M0 10H50L38 32L50 54H0Z" fill="#6E1F14"/><path d="M0 10L12 0V10Z" fill="#4A120B"/></g></svg>`;
  const msOrn = `<svg class="ms-orn" viewBox="0 0 260 16" width="260" height="16"><path d="M0 8H100M160 8H260" stroke="${MS.g}" stroke-width="1"/><path d="M130 1C122 8 122 8 130 15C138 8 138 8 130 1Z" fill="${MS.r}"/><circle cx="112" cy="8" r="3" fill="${MS.g}"/><circle cx="148" cy="8" r="3" fill="${MS.g}"/><circle cx="104" cy="8" r="1.6" fill="${MS.g}"/><circle cx="156" cy="8" r="1.6" fill="${MS.g}"/></svg>`;
  PT.manuscript = p => {
    const g = grow(p), sep = '<i>۞</i>';
    return `<div class="paper pr-manuscript"><i class="ms-v t"></i><i class="ms-v b"></i><i class="ms-v r"></i><i class="ms-v l"></i>
    <div class="ms-o"><div class="ms-i">
      <div class="ms-seal"${S('header')}>${msSeal}${p.logo ? `<img src="${p.logo}" alt="">` : ''}</div>
      <div class="ms-top"${S('header')}><span>${val(p.school)}</span><span>السنة الدراسية ${val(p.year)}</span></div>
      <div class="ms-t"${S('lesson')}><small>مذكرة تحضير درس</small><div class="ms-band">${msTail(false)}<h1>${val(p.title)}</h1>${msTail(true)}</div>${msOrn}<p>${p.unit ? 'من وحدة: ' + esc(p.unit) : ''}</p></div>
      <div class="ms-info"><span${S('header')}><b>المادة:</b> ${val(p.subject)}</span>${sep}<span${S('header')}><b>القسم:</b> ${val(p.klass)}</span>${sep}<span${S('lesson')}><b>الحصة:</b> ${val(p.session)}</span>${sep}<span${S('lesson')}><b>المدة:</b> ${durTxt(p)}</span>${sep}<span${S('header')}><b>الأستاذ(ة):</b> ${val(p.teacher)}</span></div>
      <div class="ms-two">
        <section${S('objectives')}><h5>۞ الأهداف / الكفاءة المستهدفة</h5><ol>${p.objectives.map((o, i) => `<li><em>${at(ORD, i).replace(/ة$/, '')}ًا:</em> ${esc(o)}</li>`).join('')}</ol></section>
        <section${S('materials')}><h5>۞ الوسائل التعليمية</h5><p>${p.materials.map(esc).join('، ')}.</p></section>
      </div>
      <div class="ms-st"${S('stages')}><h4>${msOrn}<span>سير الدرس</span>${msOrn}</h4>
        ${p.stages.map((s, i) => `<div class="ms-s" style="--g:${g[i]}"><div class="ms-sh"><b>المرحلة ${at(ORD, i)}: ${esc(s.title)}</b><em>(${mm(s)})</em></div><div class="ms-sa">${actTS(s, 'ms-p')}</div></div>`).join('')}
      </div>
      ${tbar(p, ['#8E2C1F', '#A07A2C', '#5D4037', '#B5651D', '#6D4C41', '#9E7B4F'], 'ms-bar', ['#FFF4DD'])}
      ${evalOn(p) ? `<div class="ms-ev"${S('eval')}><b>۞ التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      <div class="ms-foot"><span>حُرِّرت في: <b>${val(dt(p))}</b></span>${signs(p, 'ms-sg', ['توقيع الأستاذ(ة)', 'تأشيرة المدير(ة)'])}</div>
    </div></div></div>`;
  };

  /* =================================================================
     7) سجل الأحداث — شريط زمني تاريخي للحصة، بطاقات متحف بالطوابع الزمنية
  ================================================================= */
  const CR = { k: '#111418', r: '#9B2226', s: '#E9D8A6', n: '#005F73', o: '#CA6702' };
  const crGlass = `<svg viewBox="0 0 40 56" width="34" height="48"><path d="M4 2H36M4 54H36" stroke="${CR.k}" stroke-width="3" stroke-linecap="round"/><path d="M8 4C8 20 18 22 20 28C22 22 32 20 32 4ZM8 52C8 36 18 34 20 28C22 34 32 36 32 52Z" fill="#FFFFFF" stroke="${CR.k}" stroke-width="2"/><path d="M12 10H28C26 18 22 20 20 24C18 20 14 18 12 10Z" fill="${CR.s}"/><path d="M11 50C12 42 18 40 20 34C22 40 28 42 29 50Z" fill="${CR.o}"/></svg>`;
  const crDoc = `<svg viewBox="0 0 28 34" width="24" height="30"><path d="M3 2H19L25 8V32H3Z" fill="#FFFFFF" stroke="${CR.k}" stroke-width="1.8" stroke-linejoin="round"/><path d="M19 2V8H25" fill="none" stroke="${CR.k}" stroke-width="1.8"/><path d="M8 14H20M8 19H20M8 24H16" stroke="${CR.r}" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  PT.chronicle = p => {
    const g = grow(p), mk = marks(p), tot = (mk.length ? mk[mk.length - 1][1] : 0) || 1, cols = [CR.r, CR.n, CR.o, '#6A4C93', '#0A9396', '#AE2012'];
    const T = v => two(v) + '′';
    return `<div class="paper pr-chronicle"><div class="cr-bar"></div><div class="cr-in">
      <header class="cr-h">
        <div class="cr-ht"><small${S('header')}>${val(p.school)} · ${val(p.year)}</small><span${S('lesson')}>مذكرة تحضير درس · ${val(p.subject)}</span><h1${S('lesson')}>${val(p.title)}</h1><p${S('lesson')}>${val(p.unit)}</p></div>
        <div class="cr-tag">${p.logo ? `<img src="${p.logo}" alt="">` : crGlass}<small>الحصة</small><b dir="ltr">${two(esc(p.session || 0))}</b></div>
      </header>
      <div class="cr-tl"${S('stages')}><div class="cr-axis">
        ${mk.map(([a, b], i) => `<i class="cr-seg" style="right:${(a / tot * 100).toFixed(2)}%;width:${((b - a) / tot * 100).toFixed(2)}%;background:${at(cols, i)}"></i>`).join('')}
        ${mk.map(([a], i) => `<span class="cr-ev ${i % 2 ? 'dn' : 'up'}" style="right:${(a / tot * 100).toFixed(2)}%"><b style="background:${at(cols, i)}"></b><em dir="ltr">${T(a)}</em><small>${esc(p.stages[i].title)}</small></span>`).join('')}
        <span class="cr-end"><em dir="ltr">${T(tot)}</em></span>
      </div></div>
      <div class="cr-info">
        <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div><div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div>
        <div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
      </div>
      <div class="cr-two">
        <section${S('objectives')}><h5>محاور الدرس وأهدافه</h5><ul>${p.objectives.map(o => `<li><i></i><span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>الأرشيف والوسائل</h5><ul>${p.materials.map(m => `<li><i></i><span>${esc(m)}</span></li>`).join('')}</ul></section>
      </div>
      <div class="cr-st"${S('stages')}>
        ${p.stages.map((s, i) => `<div class="cr-s" style="--g:${g[i]}"><div class="cr-time" style="border-color:${at(cols, i)}"><b dir="ltr">${T(mk[i][0])}</b><i>↓</i><b dir="ltr">${T(mk[i][1])}</b></div>
          <div class="cr-c"><h6><span style="color:${at(cols, i)}">${two(i + 1)}</span>${esc(s.title)}</h6><div class="cr-sa">${actTS(s, 'cr-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="cr-doc"${S('eval')}>${crDoc}<div><b>وثيقة للدراسة · التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div></div>` : ''}
      ${signs(p, 'cr-sg')}
    </div></div>`;
  };

  /* =================================================================
     8) الأغورا الفلسفية — واجهة معبد إغريقي، أعمدة أيونية، إفريز المتاهة، بومة الحكمة
  ================================================================= */
  const AG = { k: '#2B2B2B', t: '#A44A3F', o: '#6B705C', g: '#B89A5E', m: '#F7F5F0' };
  const meander = (w, h) => {
    const u = h; let d = '';
    for (let x = 0; x < w; x += u) d += `M${x} ${h - 2}V2H${x + u * 0.8}V${h * 0.72}H${x + u * 0.35}V${h * 0.42}H${x + u * 0.55}`;
    return `<svg class="ag-mq" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${AG.t}" stroke-width="2"/><path d="M0 0.8H${w}M0 ${h - 0.8}H${w}" stroke="${AG.t}" stroke-width="1.6"/></svg>`;
  };
  const agColumn = cls => `<svg class="${cls}" viewBox="0 0 56 200" width="46" height="164"><rect x="2" y="2" width="52" height="8" fill="#E2DCCF" stroke="${AG.k}" stroke-width="1"/>` +
    `<path d="M6 10H50Q50 20 40 20H16Q6 20 6 10Z" fill="#EDE8DC" stroke="${AG.k}" stroke-width="1"/><circle cx="10" cy="16" r="5" fill="none" stroke="${AG.k}" stroke-width="1.2"/><circle cx="46" cy="16" r="5" fill="none" stroke="${AG.k}" stroke-width="1.2"/>` +
    `<rect x="12" y="22" width="32" height="160" fill="#F1ECE1" stroke="${AG.k}" stroke-width="1"/>` + [17, 22, 28, 34, 39].map(x => `<path d="M${x} 24V180" stroke="#CFC6B4" stroke-width="1.4"/>`).join('') +
    `<rect x="8" y="182" width="40" height="7" fill="#E2DCCF" stroke="${AG.k}" stroke-width="1"/><rect x="4" y="189" width="48" height="9" fill="#D8D0BF" stroke="${AG.k}" stroke-width="1"/></svg>`;
  const agPed = `<svg class="ag-ped" viewBox="0 0 714 64" width="714" height="64" preserveAspectRatio="none"><path d="M10 60L357 6L704 60Z" fill="#EDE8DC" stroke="${AG.k}" stroke-width="1.6" stroke-linejoin="round"/><path d="M60 54L357 14L654 54Z" fill="none" stroke="${AG.g}" stroke-width="1"/><circle cx="357" cy="38" r="9" fill="none" stroke="${AG.t}" stroke-width="1.6"/><path d="M0 60H714" stroke="${AG.k}" stroke-width="2"/></svg>`;
  const agOwl = `<svg viewBox="0 0 40 44" width="34" height="38"><path d="M6 14Q4 4 10 6L14 10Q20 8 26 10L30 6Q36 4 34 14Q38 26 30 36Q20 44 10 36Q2 26 6 14Z" fill="${AG.o}"/><circle cx="14" cy="18" r="6" fill="#F7F5F0"/><circle cx="26" cy="18" r="6" fill="#F7F5F0"/><circle cx="14" cy="18" r="2.6" fill="${AG.k}"/><circle cx="26" cy="18" r="2.6" fill="${AG.k}"/><path d="M18 24l2 4 2-4z" fill="${AG.g}"/><path d="M12 32Q20 36 28 32" fill="none" stroke="#F7F5F0" stroke-width="1.2"/></svg>`;
  PT.agora = p => {
    const g = grow(p);
    return `<div class="paper pr-agora"><div class="ag-in">
      <header class="ag-h">${agPed}<div class="ag-fr">${meander(714, 16)}</div>
        <div class="ag-body">${agColumn('ag-col r')}
          <div class="ag-ht"><div class="ag-k">${agOwl}<small${S('header')}>${val(p.school)} · ${val(p.year)}</small></div><span${S('lesson')}>مذكرة تحضير درس · ${val(p.subject)}</span><h1${S('lesson')}>${val(p.title)}</h1><p${S('lesson')}>${val(p.unit)}</p>${logoImg(p, 'ag-lg')}</div>
          ${agColumn('ag-col l')}</div>
      </header>
      <div class="ag-info">
        <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div><div${S('lesson')}><small>الحصة</small><b>${val(p.session)}</b></div>
        <div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div><div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div><div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
      </div>
      <div class="ag-two">
        <section${S('objectives')}><h5>أطروحات الدرس (الأهداف)</h5><ol>${p.objectives.map((o, i) => `<li><em dir="ltr">${at(ROMAN, i)}</em><span>${esc(o)}</span></li>`).join('')}</ol></section>
        <section${S('materials')}><h5>الوسائل والسندات</h5><ul>${p.materials.map(m => `<li><i></i><span>${esc(m)}</span></li>`).join('')}</ul></section>
      </div>
      <div class="ag-st"${S('stages')}><h4><i></i><span>سير الدرس</span><i></i></h4>
        ${p.stages.map((s, i) => `<div class="ag-s" style="--g:${g[i]}"><div class="ag-n" dir="ltr">${at(ROMAN, i)}</div>
          <div class="ag-c"><div class="ag-sh"><b>${esc(s.title)}</b><em>${mm(s)}</em></div><div class="ag-sa">${actTS(s, 'ag-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="ag-ev"${S('eval')}><span>?</span><div><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div></div>` : ''}
      ${signs(p, 'ag-sg')}
      <div class="ag-fr">${meander(714, 14)}</div>
    </div></div>`;
  };

  /* =================================================================
     9) الخط العربي — لغة الضاد: نقاط القلم، قصبة وحبر، حروف أبجدية للمراحل، إطار مذهّب
  ================================================================= */
  const CA = { k: '#1A1A1A', b: '#1F3A93', g: '#C9A227', r: '#B22222', c: '#FBF7EE' };
  const caRh = (c, s) => `<svg viewBox="0 0 12 12" width="${s}" height="${s}"><path d="M6 0L12 6L6 12L0 6Z" fill="${c}"/></svg>`;
  const caPen = `<svg class="ca-pen" viewBox="0 0 90 190" width="90" height="190">` +
    [0, 1, 2, 3, 4].map(k => `<path d="M14 ${18 + k * 16}l7 7-7 7-7-7z" fill="${CA.k}"/>`).join('') +
    `<path d="M14 18V114" stroke="${CA.g}" stroke-width=".8" stroke-dasharray="2 3"/>` +
    `<g transform="rotate(28 60 90)"><rect x="52" y="10" width="14" height="136" rx="6" fill="#A0522D"/><path d="M52 20H66M52 60H66M52 100H66" stroke="#7A3E1F" stroke-width="1.4"/><path d="M52 146H66L60 172Z" fill="#E8D3A9" stroke="#7A3E1F" stroke-width="1"/><path d="M59 164L60 172" stroke="${CA.k}" stroke-width="2"/></g>` +
    `<path d="M22 150C22 140 50 140 50 150V176C50 186 22 186 22 176Z" fill="${CA.b}"/><ellipse cx="36" cy="150" rx="14" ry="4" fill="#0F1F5C"/></svg>`;
  PT.calligraphy = p => {
    const g = grow(p), dots = `<span class="ca-dots">${caRh(CA.g, 9)}${caRh(CA.b, 11)}${caRh(CA.g, 9)}</span>`;
    return `<div class="paper pr-calligraphy"><div class="ca-o"><div class="ca-i">
      <i class="ca-c tl">${caRh(CA.g, 14)}</i><i class="ca-c tr">${caRh(CA.g, 14)}</i><i class="ca-c bl">${caRh(CA.g, 14)}</i><i class="ca-c br">${caRh(CA.g, 14)}</i>
      <header class="ca-h"><span class="ca-wm">ض</span>
        <div class="ca-ht"><small${S('header')}>${val(p.school)} · ${val(p.year)}</small><span${S('lesson')}>مذكرة تحضير درس · ${val(p.subject)}</span><h1${S('lesson')}>${val(p.title)}</h1><p${S('lesson')}>${val(p.unit)}</p>${logoImg(p, 'ca-lg')}</div>
        ${caPen}
      </header>
      <div class="ca-info"><span${S('header')}><small>القسم</small>${val(p.klass)}</span><span${S('lesson')}><small>الحصة</small>${val(p.session)}</span><span${S('lesson')}><small>المدة</small>${durTxt(p)}</span><span${S('header')}><small>التاريخ</small>${val(dt(p))}</span><span${S('header')}><small>الأستاذ(ة)</small>${val(p.teacher)}</span></div>
      <div class="ca-two">
        <section${S('objectives')}><h5>${dots}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${p.objectives.map(o => `<li>${caRh(CA.b, 8)}<span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>${dots}<span>الوسائل التعليمية</span></h5><ul>${p.materials.map(m => `<li>${caRh(CA.g, 8)}<span>${esc(m)}</span></li>`).join('')}</ul></section>
      </div>
      <div class="ca-st"${S('stages')}><h4>${dots}<span>سير الدرس</span>${dots}</h4>
        ${p.stages.map((s, i) => `<div class="ca-s" style="--g:${g[i]}"><div class="ca-n"><svg viewBox="0 0 44 44" width="44" height="44"><path d="M22 1L43 22L22 43L1 22Z" fill="${i % 2 ? CA.g : CA.b}"/><path d="M22 6L38 22L22 38L6 22Z" fill="none" stroke="#FFFFFF" stroke-width="1"/></svg><b>${at(ABJAD, i)}</b></div>
          <div class="ca-cc"><div class="ca-sh"><b>${esc(s.title)}</b><em>${mm(s)}</em></div><div class="ca-sa">${actTS(s, 'ca-p')}</div></div></div>`).join('')}
      </div>
      ${tbar(p, [CA.b, CA.g, '#3B5BB5', '#A8861E', '#16296B', '#D9B748'], 'ca-bar', ['#FFFFFF'])}
      ${evalOn(p) ? `<div class="ca-ev"${S('eval')}><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      ${signs(p, 'ca-sg', ['توقيع الأستاذ(ة)', 'تأشيرة المدير(ة)'])}
    </div></div></div>`;
  };

  /* =================================================================
     10) القاموس — مدخل معجمي، فهرس حروف على الحافة، فقاعات تحية بثلاث لغات، مراحل في عمودين
  ================================================================= */
  const LX = { k: '#111111', b: '#0057B8', y: '#FFD500', gr: '#6B7280' };
  const AR_LETTERS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
  const lxBub = `<svg class="lx-bub" viewBox="0 0 230 150" width="230" height="150">` +
    `<path d="M18 10H140Q152 10 152 22V62Q152 74 140 74H52L32 92L36 74H18Q6 74 6 62V22Q6 10 18 10Z" fill="${LX.b}"/>` +
    `<path d="M90 62H212Q224 62 224 74V112Q224 124 212 124H196L200 144L176 124H90Q78 124 78 112V74Q78 62 90 62Z" fill="${LX.y}" stroke="#FFFFFF" stroke-width="3"/>` +
    `<path d="M34 98H96Q104 98 104 106V128Q104 136 96 136H48L38 146L40 136H34Q26 136 26 128V106Q26 98 34 98Z" fill="#E8EEF7" stroke="#FFFFFF" stroke-width="3"/></svg>`;
  PT.lexicon = p => {
    const g = grow(p), first = (String(p.title || '').trim().replace(/^ال/, '').replace(/^[أإآ]/, 'ا')[0]) || '';
    const n = p.stages.length;
    return `<div class="paper pr-lexicon"><div class="lx-idx">${AR_LETTERS.map(l => `<span class="${l === first ? 'on' : ''}">${l}</span>`).join('')}</div>
    <div class="lx-in">
      <div class="lx-guide"><b>${n ? esc(p.stages[0].title) : ''}</b><span${S('header')}>${val(p.school)} · ${val(p.year)}</span><b>${n ? esc(p.stages[n - 1].title) : ''}</b></div>
      <header class="lx-h">
        <div class="lx-ht"><small${S('lesson')}>مذكرة تحضير درس · ${val(p.subject)}</small><h1${S('lesson')}>${val(p.title)}</h1>
          <p${S('lesson')}><span class="lx-pos">درس</span> ‹ ${val(p.unit)} › <i>|</i> الحصة ${val(p.session)} <i>|</i> ${durTxt(p)}</p>${logoImg(p, 'lx-lg')}</div>
        <div class="lx-bb">${lxBub}<span class="b1">مرحبا</span><span class="b2" dir="ltr">Hello!</span><span class="b3" dir="ltr">Bonjour</span></div>
      </header>
      <div class="lx-info"><span${S('header')}><small>القسم</small>${val(p.klass)}</span><span${S('header')}><small>التاريخ</small>${val(dt(p))}</span><span${S('header')}><small>الأستاذ(ة)</small>${val(p.teacher)}</span></div>
      <div class="lx-two">
        <section${S('objectives')}><h5>المعاني (الأهداف)</h5><ol>${p.objectives.map((o, i) => `<li><b>${i + 1}.</b> ${esc(o)}</li>`).join('')}</ol></section>
        <section${S('materials')}><h5>انظر أيضًا (الوسائل)</h5><ul>${p.materials.map(m => `<li><i>←</i> ${esc(m)}</li>`).join('')}</ul></section>
      </div>
      <div class="lx-st"${S('stages')}><h4>سير الدرس</h4><div class="lx-grid">
        ${p.stages.map((s, i) => `<div class="lx-e" style="--g:${g[i]}"><p class="lx-w"><b>${esc(s.title)}</b> <span>‹${mm(s)}›</span> <small>${i + 1}</small></p>
          ${s.teacher ? `<p class="lx-d"><i>أ.</i> <u>الأستاذ:</u> ${esc(s.teacher)}</p>` : ''}${s.student ? `<p class="lx-d"><i>ب.</i> <u>التلميذ:</u> ${esc(s.student)}</p>` : ''}</div>`).join('')}
      </div></div>
      ${tbar(p, [LX.b, '#F2B705', '#3B82F6', '#0F766E', '#7C3AED', '#E11D48'], 'lx-bar', ['#FFFFFF', '#111111'])}
      ${evalOn(p) ? `<div class="lx-ev"${S('eval')}><b>تمرين · التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      ${signs(p, 'lx-sg')}
    </div></div>`;
  };

  /* ---------- التسجيل: القوالب الجديدة تُعرض أولًا ---------- */
  const KEYS = ['algebra', 'geometry', 'mechanics', 'circuit', 'atom', 'manuscript', 'chronicle', 'agora', 'calligraphy', 'lexicon'];
  Object.assign(window.PREMIUM_TPL, PT);
  window.PREMIUM_KEYS = KEYS.concat(window.PREMIUM_KEYS || []);
  window.PREMIUM_SUBJECT = KEYS;
  const N = window.PREMIUM_NAMES;
  Object.assign(N.ar, { algebra: 'الجبر والدوال', geometry: 'الهندسة', mechanics: 'الميكانيك', circuit: 'الدارة الكهربائية', atom: 'الذرّة',
    manuscript: 'المخطوطة التاريخية', chronicle: 'سجل الأحداث', agora: 'الأغورا الفلسفية', calligraphy: 'الخط العربي', lexicon: 'القاموس' });
  Object.assign(N.fr, { algebra: 'Algèbre & fonctions', geometry: 'Géométrie', mechanics: 'Mécanique', circuit: 'Circuit électrique', atom: 'Atome',
    manuscript: 'Manuscrit historique', chronicle: 'Chronique', agora: 'Agora philosophique', calligraphy: 'Calligraphie arabe', lexicon: 'Lexique' });
  Object.assign(N.en, { algebra: 'Algebra & functions', geometry: 'Geometry', mechanics: 'Mechanics', circuit: 'Electric circuit', atom: 'Atom',
    manuscript: 'Historic manuscript', chronicle: 'Chronicle', agora: 'Philosophy agora', calligraphy: 'Arabic calligraphy', lexicon: 'Lexicon' });
})();
