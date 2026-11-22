/* =====================================================================
   مولّد مذكرة الأستاذ — قوالب Premium (10 قوالب، $1.99 للقالب، شراء دائم)
   يُحمَّل قبل app.js؛ الدوال تستعمل أدوات app.js (esc, S, dt, tint, shade…) وقت الرسم فقط.
   قواعد التصدير (html2canvas): ألوان SVG حرفية، لا نص داخل SVG (لا تُحمَّل خطوط الويب فيه)،
   لا clip-path ولا filter ولا background-clip:text، ولا letter-spacing على النص العربي.
   الكتالوج والسعر الحقيقيان في الـ Worker فقط (LP_PREMIUM / LP_PRICE في worker.js).
===================================================================== */
(function () {
  'use strict';

  /* ---------- أدوات مشتركة ---------- */
  const mins = s => Math.max(0, parseInt(s && s.time, 10) || 0);
  function shares(p) {
    const ms = p.stages.map(mins), tot = ms.reduce((a, b) => a + b, 0);
    return { ms, tot, pct: ms.map(m => (tot ? m / tot : 1 / Math.max(1, ms.length))) };
  }
  const pctTxt = f => Math.round(f * 100) + '%';
  const two = n => String(n).padStart(2, '0');
  const val = v => (v ? esc(v) : '—');
  const durTxt = p => (p.duration ? esc(p.duration) + ' د' : '—');
  const totalMins = p => { const { tot } = shares(p); return parseInt(p.duration, 10) || tot || 0; };

  /* نوع المرحلة من اسمها (أيقونة تلقائية) */
  function kindOf(s, i, n) {
    const x = (s && s.title) || '';
    if (/تمهيد|انطلاق|استهلال|تهيئة|إشكال|اشكال|استكشاف|تحفيز/.test(x)) return 'start';
    if (/تطبيق|تدريب|تمرين|تمارين|إنجاز|ممارسة|استثمار/.test(x)) return 'practice';
    if (/تقويم|تقييم|إدماج|ادماج/.test(x)) return 'assess';
    if (/خلاصة|تركيب|تلخيص|حوصلة|استنتاج|ختام|إرساء|ارساء/.test(x)) return 'sum';
    if (/بناء|اكتشاف|نشاط|تعلم|عرض|شرح|تقديم/.test(x)) return 'build';
    return i === 0 ? 'start' : i === n - 1 ? 'assess' : 'build';
  }
  const ICON_PATHS = {
    start: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    build: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
    practice: '<path d="M4 20l4-1L19 8l-3-3L5 16l-1 4z"/><path d="M14 7l3 3"/>',
    assess: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16.2 9.6"/>',
    sum: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    book: '<path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/><path d="M12 6v13.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    box: '<path d="M3 7.5l9-4.5 9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
    layers: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16M10 10v10"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    pen: '<path d="M4 20l4-1L19 8l-3-3L5 16l-1 4z"/>',
  };
  function ico(k, color, size, sw) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><g fill="none" stroke="${color}" stroke-width="${sw || 1.8}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[k] || ''}</g></svg>`;
  }

  /* شريط توزيع الزمن (عرض كل مرحلة = نصيبها من الحصة) */
  function tbar(p, colors, cls, txt) {
    if (!p.stages.length) return '';
    const { ms, pct } = shares(p);
    return `<div class="tbar ${cls || ''}">${p.stages.map((s, i) =>
      `<span style="flex:${Math.max(pct[i], 0.05).toFixed(3)} 1 0;background:${colors[i % colors.length]}${txt ? ';color:' + txt[i % txt.length] : ''}">${pct[i] >= 0.1 && ms[i] ? ms[i] + ' د' : ''}</span>`).join('')}</div>`;
  }

  /* حلقة توزيع الزمن (بدون نص داخل SVG) */
  function donut(p, colors, size, w) {
    const { pct } = shares(p), r = (size - w) / 2, C = 2 * Math.PI * r, c = size / 2;
    let off = 0;
    const segs = pct.map((f, i) => {
      const len = f * C;
      const s = `<circle cx="${c}" cy="${c}" r="${r.toFixed(2)}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${w}" stroke-dasharray="${Math.max(len - (pct.length > 1 ? 2.5 : 0), 0.1).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${c} ${c})"/>`;
      off += len; return s;
    }).join('');
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${c}" cy="${c}" r="${r.toFixed(2)}" fill="none" stroke="#EDF0F5" stroke-width="${w}"/>${segs}</svg>`;
  }

  /* خانات التوقيع */
  function signs(p, cls, labels) {
    labels = labels || ['توقيع الأستاذ(ة)', 'تأشيرة المدير(ة)', 'ملاحظات المفتش(ة)'];
    return `<div class="sg ${cls || ''}">${labels.map((l, i) => `<div><small>${l}</small>${i === 0 && p.teacher ? `<b>${esc(p.teacher)}</b>` : ''}<i></i></div>`).join('')}</div>`;
  }
  const logoImg = (p, cls) => (p.logo ? `<img class="${cls}" src="${p.logo}" alt="">` : '');
  const actTS = (s, cls, lt, ls) => `${s.teacher ? `<p class="${cls}"><i>${lt || 'الأستاذ'}</i>${esc(s.teacher)}</p>` : ''}${s.student ? `<p class="${cls}"><i>${ls || 'التلميذ'}</i>${esc(s.student)}</p>` : ''}`;
  const evalOn = p => !!(p.evalEnabled && p.eval);

  /* =================================================================
     1) الملكي الذهبي — كحلي وذهبي، إطار مزدوج وزخارف ركنية وإكليل
  ================================================================= */
  const RY = { n: '#14213D', g: '#B8913A', gl: '#E6CF95', iv: '#FFFDF6' };
  function ryCorner(fx, fy) {
    const tr = `translate(${fx ? 64 : 0},${fy ? 64 : 0}) scale(${fx ? -1 : 1},${fy ? -1 : 1})`;
    return `<svg class="ry-c ${fy ? 'b' : 't'}${fx ? 'r' : 'l'}" viewBox="0 0 64 64" width="52" height="52"><g transform="${tr}">` +
      `<path d="M3 61V16Q3 3 16 3H61" fill="none" stroke="${RY.g}" stroke-width="1.6"/>` +
      `<path d="M10 61V22Q10 10 22 10H61" fill="none" stroke="${RY.n}" stroke-width=".9"/>` +
      `<path d="M19 19q13-3 19 8q-12 0-19-8z" fill="${RY.g}"/><path d="M19 19q-3 13 8 19q0-12-8-19z" fill="${RY.g}"/>` +
      `<path d="M19 19q8 1 11 6" fill="none" stroke="${RY.iv}" stroke-width=".7"/><circle cx="19" cy="19" r="3.2" fill="${RY.n}"/>` +
      `<circle cx="61" cy="3" r="2" fill="${RY.g}"/><circle cx="3" cy="61" r="2" fill="${RY.g}"/><circle cx="46" cy="10" r="1.4" fill="${RY.n}"/><circle cx="10" cy="46" r="1.4" fill="${RY.n}"/></g></svg>`;
  }
  function laurel() {
    let leaves = '';
    [-1, 1].forEach(dir => {
      for (let k = 0; k < 6; k++) {
        const th = (34 + k * 22) * Math.PI / 180;                       // من الأسفل صعودًا
        const ang = Math.atan2(-Math.sin(th), dir * Math.cos(th)) * 180 / Math.PI;   // اتجاه نمو الغصن
        [[37.5, 1], [29.5, -1]].forEach(([r, side]) => {
          const x = 44 + dir * r * Math.sin(th), y = 44 + r * Math.cos(th);
          const rot = ang + 90 + dir * side * 32;
          leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.9" ry="6.6" fill="${side > 0 ? RY.g : '#9C7A2E'}" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
        });
      }
    });
    return `<svg class="ry-crest" viewBox="0 0 88 88" width="88" height="88">` +
      `<path d="M30 76Q44 84 58 76" fill="none" stroke="${RY.g}" stroke-width="1.4"/>${leaves}` +
      `<circle cx="44" cy="44" r="22" fill="${RY.n}"/><circle cx="44" cy="44" r="19" fill="none" stroke="${RY.g}" stroke-width="1"/>` +
      `<g fill="none" stroke="${RY.gl}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 38c4.3-1.9 8.3-1.9 12 .9c3.7-2.8 7.7-2.8 12-.9v13c-4.3-1.9-8.3-1.9-12 .9c-3.7-2.8-7.7-2.8-12-.9z"/><path d="M44 38.9v13"/></g>` +
      `<circle cx="44" cy="9" r="2.4" fill="${RY.g}"/></svg>`;
  }
  const ryRule = `<svg class="ry-rule" viewBox="0 0 320 18" width="320" height="18"><path d="M0 9H132M188 9H320" stroke="${RY.g}" stroke-width="1.2"/><path d="M20 9H120M200 9H300" stroke="${RY.n}" stroke-width=".5" transform="translate(0 3)"/>` +
    `<path d="M160 1l8 8-8 8-8-8z" fill="${RY.n}"/><path d="M160 4.5l4.5 4.5-4.5 4.5-4.5-4.5z" fill="${RY.g}"/><path d="M138 9q6-6 12 0q-6 6-12 0z" fill="${RY.g}"/><path d="M182 9q-6-6-12 0q6 6 12 0z" fill="${RY.g}"/></svg>`;

  const PT = {};

  PT.royal = p => {
    const g = grow(p), sh = shares(p);
    const navy = ['#14213D', '#2A3F6B', '#45608F', '#6B84AE', '#24365E', '#3A5384'];
    return `<div class="paper pr-royal"><div class="ry-o"><div class="ry-i">
    ${ryCorner(0, 0)}${ryCorner(1, 0)}${ryCorner(0, 1)}${ryCorner(1, 1)}
    <header class="ry-h"${S('header')}>
      <div class="ry-a"><small>المؤسسة</small><b>${val(p.school)}</b><span>السنة الدراسية ${val(p.year)}</span></div>
      <div class="ry-m">${p.logo ? `<span class="ry-lg"><img src="${p.logo}" alt=""></span>` : laurel()}</div>
      <div class="ry-a ry-l"><small>المادة</small><b>${val(p.subject)}</b><span>القسم: ${val(p.klass)}</span></div>
    </header>
    <div class="ry-t"${S('lesson')}><div class="ry-k"><i></i><span>مذكرة تحضير درس</span><i></i></div><h1>${val(p.title)}</h1>${ryRule}<div class="ry-u">${p.unit ? 'الوحدة: ' + esc(p.unit) : ''}</div></div>
    <div class="ry-band">
      <div${S('lesson')}><small>رقم الحصة</small><b>${val(p.session)}</b></div>
      <div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div>
      <div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div>
      <div${S('header')}><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
    </div>
    <div class="ry-two">
      <section class="ry-bx"${S('objectives')}><h5><span>الأهداف / الكفاءة المستهدفة</span></h5><ol>${p.objectives.map((o, i) => `<li><em>${i + 1}</em><span>${esc(o)}</span></li>`).join('')}</ol></section>
      <section class="ry-bx ry-mt"${S('materials')}><h5><span>الوسائل التعليمية</span></h5><ul>${p.materials.map(m => `<li><em></em><span>${esc(m)}</span></li>`).join('')}</ul></section>
    </div>
    <div class="ry-tb"${S('stages')}>
      <div class="hd"><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
      ${p.stages.map((s, i) => `<div class="rw" style="--g:${g[i]}"><div class="st"><em>${i + 1}</em><b>${esc(s.title)}</b></div><div class="tm"><b>${mins(s) || '—'}</b><small>${mins(s) ? 'دقيقة' : ''}</small></div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`).join('')}
      <div class="ry-tl"><small>توزيع الزمن</small>${tbar(p, navy, 'ry-bar', ['#F4E7C2'])}<small class="ry-tot">${sh.tot ? sh.tot + ' د' : ''}</small></div>
    </div>
    ${evalOn(p) ? `<div class="ry-ev"${S('eval')}><h5>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div>` : ''}
    ${signs(p, 'ry-sg')}
  </div></div></div>`;
  };

  /* =================================================================
     2) الأندلسي — زليج ونجوم ثمانية، قوس حدوة الفرس، بطاقات مقوّسة
  ================================================================= */
  const AN = { t: '#0E4D4A', r: '#B4532A', s: '#F8F1E4', s2: '#EFE2CB', g: '#C99A3B', ink: '#3A2A1E' };
  function star16(cx, cy, R, r) {
    const pts = [];
    for (let k = 0; k < 16; k++) { const a = Math.PI / 8 * k - Math.PI / 2, d = k % 2 ? r : R; pts.push((cx + d * Math.cos(a)).toFixed(1) + ',' + (cy + d * Math.sin(a)).toFixed(1)); }
    return pts.join(' ');
  }
  function zellige(h) {
    const W = 794, t = h; let s = `<rect width="${W}" height="${h}" fill="${AN.t}"/>`;
    for (let x = t / 2 - 3; x < W + t; x += t) {
      s += `<polygon points="${star16(x, h / 2, h * 0.43, h * 0.2)}" fill="${AN.s2}"/>` +
        `<polygon points="${star16(x, h / 2, h * 0.25, h * 0.12)}" fill="${AN.r}"/><circle cx="${x}" cy="${h / 2}" r="${h * 0.055}" fill="${AN.g}"/>` +
        `<rect x="${x + t / 2 - 4}" y="${h / 2 - 4}" width="8" height="8" transform="rotate(45 ${x + t / 2} ${h / 2})" fill="${AN.g}"/>` +
        `<rect x="${x + t / 2 - 3.5}" y="-3.5" width="7" height="7" transform="rotate(45 ${x + t / 2} 0)" fill="${AN.r}"/>` +
        `<rect x="${x + t / 2 - 3.5}" y="${h - 3.5}" width="7" height="7" transform="rotate(45 ${x + t / 2} ${h})" fill="${AN.r}"/>`;
    }
    return `<svg class="an-z" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" preserveAspectRatio="none">${s}</svg>`;
  }
  const anArch = `<svg class="an-arch" viewBox="0 0 640 214" width="640" height="214">` +
    `<path d="M56 214V150A280 110 0 1 1 584 150V214Z" fill="${AN.s2}"/>` +
    `<path d="M56 214V150A280 110 0 1 1 584 150V214" fill="none" stroke="${AN.r}" stroke-width="3"/>` +
    `<path d="M70 214V152A266 98 0 1 1 570 152V214" fill="none" stroke="${AN.g}" stroke-width="1.2"/>` +
    `<polygon points="${star16(320, 16, 13, 6)}" fill="${AN.t}"/><circle cx="320" cy="16" r="3" fill="${AN.g}"/>` +
    `<polygon points="${star16(42, 206, 9, 4)}" fill="${AN.t}"/><polygon points="${star16(598, 206, 9, 4)}" fill="${AN.t}"/></svg>`;
  const anStar = (c, s) => `<svg viewBox="0 0 20 20" width="${s}" height="${s}"><polygon points="${star16(10, 10, 9.5, 4.6)}" fill="${c}"/><circle cx="10" cy="10" r="2" fill="${AN.s}"/></svg>`;

  PT.andalus = p => {
    const g = grow(p);
    return `<div class="paper pr-andalus">${zellige(46)}
    <div class="an-in">
      <div class="an-top"${S('header')}><span>${val(p.school)}</span>${logoImg(p, 'an-lg')}<span>السنة الدراسية ${val(p.year)}</span></div>
      <div class="an-hero"${S('lesson')}>${anArch}<div class="an-tt"><small>مذكرة تحضير درس</small><h1>${val(p.title)}</h1><span>${p.unit ? esc(p.unit) : ''}</span></div></div>
      <div class="an-tiles">
        <div${S('header')}><small>المادة</small><b>${val(p.subject)}</b></div>
        <div${S('header')}><small>القسم</small><b>${val(p.klass)}</b></div>
        <div${S('lesson')}><small>الحصة</small><b>${val(p.session)}</b></div>
        <div${S('lesson')}><small>المدة</small><b>${durTxt(p)}</b></div>
        <div${S('header')}><small>التاريخ</small><b>${val(dt(p))}</b></div>
      </div>
      <div class="an-two">
        <section${S('objectives')}><h5>${anStar(AN.r, 16)}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${p.objectives.map(o => `<li>${anStar(AN.t, 11)}<span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>${anStar(AN.r, 16)}<span>الوسائل التعليمية</span></h5><ul>${p.materials.map(m => `<li>${anStar(AN.g, 11)}<span>${esc(m)}</span></li>`).join('')}</ul></section>
      </div>
      <div class="an-st"${S('stages')}><h4><i></i><span>سير الدرس</span><i></i></h4>
        ${p.stages.map((s, i) => `<div class="an-r" style="--g:${g[i]}"><div class="an-n"><b>${i + 1}</b></div><div class="an-b"><div class="an-hd"><b>${esc(s.title)}</b><em>${mins(s) ? mins(s) + ' د' : '—'}</em></div><div class="an-ac">${actTS(s, 'an-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="an-ev"${S('eval')}><b>التقويم / الواجب المنزلي:</b> ${evalTxt(p)}</div>` : ''}
      ${signs(p, 'an-sg', ['توقيع الأستاذ(ة)', 'تأشيرة المدير(ة)'])}
    </div>${zellige(26)}</div>`;
  };

  /* =================================================================
     3) لوحة القيادة — بطاقات أرقام، حلقة توزيع الزمن، مراحل بأشرطة نِسَب (لون المذكرة)
  ================================================================= */
  PT.dashboard = p => {
    const c = safeHex(p.color), dk = shade(c, 0.45), g = grow(p), sh = shares(p), n = p.stages.length;
    const cols = STAGE_PAL.map(x => x[0]);
    const kpi = (k, num, lbl, sec) => `<div class="db-k"${S(sec)}><span class="db-ki" style="background:${tint(c, 0.12)}">${ico(k, c, 20, 2)}</span><b>${num}</b><small>${lbl}</small></div>`;
    return `<div class="paper pr-dashboard" style="${cv(c)}">
    <div class="db-hero" style="background:${dk}"${S('lesson')}>
      <svg class="db-dec" viewBox="0 0 300 200" width="300" height="200"><circle cx="40" cy="190" r="120" fill="${shade(c, 0.3)}"/><circle cx="250" cy="20" r="60" fill="${shade(c, 0.58)}"/><circle cx="200" cy="150" r="14" fill="${tint(c, 0.6)}" opacity=".35"/></svg>
      <div class="db-ht"><small>مذكرة تحضير درس${p.unit ? ' · ' + esc(p.unit) : ''}</small><h1>${val(p.title)}</h1>
        <div class="db-chips"${S('header')}><span>${val(p.school)}</span><span>${val(p.year)}</span><span>${val(p.subject)}</span><span>${val(p.klass)}</span><span>${val(p.teacher)}</span><span>${val(dt(p))}</span></div></div>
      <div class="db-sess">${p.logo ? `<img src="${p.logo}" alt="">` : `<small>الحصة</small><b>${val(p.session)}</b>`}</div>
    </div>
    <div class="db-kpis">${kpi('clock', totalMins(p) || '—', 'دقيقة', 'lesson')}${kpi('layers', n, 'مراحل', 'stages')}${kpi('target', p.objectives.length, 'أهداف', 'objectives')}${kpi('box', p.materials.length, 'وسائل', 'materials')}</div>
    <div class="db-row">
      <div class="db-card db-obj"${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5>${p.objectives.map(o => `<div class="db-ck"><i style="border-color:${c}"></i><span>${esc(o)}</span></div>`).join('')}</div>
      <div class="db-card db-time"${S('stages')}><h5>توزيع زمن الحصة</h5><div class="db-dn"><div class="db-ring">${donut(p, cols, 118, 16)}<div class="db-rc"><b>${sh.tot || '—'}</b><small>دقيقة</small></div></div>
        <div class="db-lg">${p.stages.map((s, i) => `<div><i style="background:${cols[i % cols.length]}"></i><span>${esc(s.title)}</span><b>${pctTxt(sh.pct[i])}</b></div>`).join('')}</div></div></div>
    </div>
    <div class="db-st"${S('stages')}>
      ${p.stages.map((s, i) => { const pl = STAGE_PAL[i % STAGE_PAL.length];
        return `<div class="db-s" style="--g:${g[i]};border-right-color:${pl[0]}"><div class="db-sh"><span class="db-si" style="background:${pl[1]}">${ico(kindOf(s, i, n), pl[0], 18, 2)}</span><b>${esc(s.title)}</b><em style="background:${pl[1]};color:${pl[2]}">${mins(s) ? mins(s) + ' د' : '—'}</em><span class="db-pb"><i style="width:${(sh.pct[i] * 100).toFixed(1)}%;background:${pl[0]}"></i></span><small>${pctTxt(sh.pct[i])}</small></div>
          <div class="db-sa"><div><i>نشاط الأستاذ</i><p>${esc(s.teacher)}</p></div><div><i>نشاط التلميذ</i><p>${esc(s.student)}</p></div></div></div>`; }).join('')}
    </div>
    <div class="db-row db-bot">
      <div class="db-card"${S('materials')}><h5>الوسائل التعليمية</h5><div class="db-tags">${p.materials.map(m => `<span style="background:${tint(c, 0.1)};color:${shade(c, 0.25)}">${esc(m)}</span>`).join('')}</div></div>
      ${evalOn(p) ? `<div class="db-card db-ev"${S('eval')} style="border-top-color:${c}"><h5>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div>` : `<div class="db-card"></div>`}
    </div>
    ${signs(p, 'db-sg')}
  </div>`;
  };

  /* =================================================================
     4) المخطط الهندسي — ورق شبكي، إطار بمناطق مرقّمة، مخطط انسيابي وخانة عنوان هندسية
  ================================================================= */
  const BP = { ink: '#0B3D91', mid: '#4A74C9', pale: '#EAF2FD' };
  const bpArrow = `<svg class="bp-ar" viewBox="0 0 20 26" width="20" height="26"><path d="M10 0V20" stroke="${BP.ink}" stroke-width="1.6"/><path d="M4 15l6 8 6-8z" fill="${BP.ink}"/></svg>`;
  PT.blueprint = p => {
    const g = grow(p), sh = shares(p);
    const zone = (arr) => arr.map(x => `<span>${x}</span>`).join('');
    return `<div class="paper pr-blueprint"><div class="bp-grid"></div>
    <div class="bp-zt">${zone(['8', '7', '6', '5', '4', '3', '2', '1'])}</div><div class="bp-zb">${zone(['8', '7', '6', '5', '4', '3', '2', '1'])}</div>
    <div class="bp-zr">${zone(['A', 'B', 'C', 'D', 'E', 'F'])}</div><div class="bp-zl">${zone(['A', 'B', 'C', 'D', 'E', 'F'])}</div>
    <div class="bp-fr">
      <div class="bp-h"${S('lesson')}><div class="bp-k"><span>مذكرة تحضير درس</span><em dir="ltr">LP-${two(esc(p.session || 0))}</em></div><h1>${val(p.title)}</h1>
        <div class="bp-dim"><svg viewBox="0 0 674 16" width="674" height="16"><path d="M1 0V16M673 0V16M3 8H671" stroke="${BP.ink}" stroke-width="1.2"/><path d="M3 8l10-4.5v9z" fill="${BP.ink}"/><path d="M671 8l-10-4.5v9z" fill="${BP.ink}"/></svg><span>المدة الإجمالية ${durTxt(p)}</span></div>
        <div class="bp-u">${p.unit ? 'الوحدة: ' + esc(p.unit) : ''}</div></div>
      <div class="bp-two">
        <section class="bp-bx"${S('objectives')}><h5><em>A</em>المواصفات المطلوبة (الأهداف)</h5>${p.objectives.map((o, i) => `<div class="bp-o"><b dir="ltr">O-${two(i + 1)}</b><span>${esc(o)}</span></div>`).join('')}</section>
        <section class="bp-bx"${S('materials')}><h5><em>B</em>قائمة الأدوات (الوسائل)</h5><div class="bp-bom"><div class="hd"><span>رقم</span><span>الأداة</span><span>العدد</span></div>${p.materials.map((m, i) => `<div><span dir="ltr">${two(i + 1)}</span><span>${esc(m)}</span><span>1</span></div>`).join('')}</div></section>
      </div>
      <div class="bp-flow"${S('stages')}><h5><em>C</em>مخطط سير الدرس</h5>
        ${p.stages.map((s, i) => `${i ? bpArrow : ''}<div class="bp-s" style="--g:${g[i]}"><div class="bp-sh"><b dir="ltr">S${i + 1}</b><strong>${esc(s.title)}</strong><span class="bp-pc">${pctTxt(sh.pct[i])}</span><em>${mins(s) ? mins(s) + ' د' : '—'}</em></div><div class="bp-sb"><div><i>الأستاذ</i><p>${esc(s.teacher)}</p></div><div><i>التلميذ</i><p>${esc(s.student)}</p></div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="bp-ev"${S('eval')}><h5><em>D</em>مراقبة الجودة (التقويم / الواجب)</h5><p>${evalTxt(p)}</p></div>` : ''}
      <div class="bp-tb"${S('header')}>
        <div class="bp-c lg">${p.logo ? `<img src="${p.logo}" alt="">` : `<svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="17" fill="none" stroke="${BP.ink}" stroke-width="1.5"/><path d="M20 3V37M3 20H37" stroke="${BP.ink}" stroke-width=".8"/><circle cx="20" cy="20" r="7" fill="none" stroke="${BP.mid}" stroke-width="1.5"/></svg>`}</div>
        <div class="bp-c w2"><small>المؤسسة</small><b>${val(p.school)}</b></div>
        <div class="bp-c"><small>السنة الدراسية</small><b>${val(p.year)}</b></div>
        <div class="bp-c"><small>رقم المذكرة</small><b dir="ltr">LP-${two(esc(p.session || 0))}</b></div>
        <div class="bp-c w2"><small>الأستاذ(ة)</small><b>${val(p.teacher)}</b></div>
        <div class="bp-c"><small>المادة</small><b>${val(p.subject)}</b></div>
        <div class="bp-c"><small>القسم</small><b>${val(p.klass)}</b></div>
        <div class="bp-c sig"><small>التاريخ</small><b>${val(dt(p))}</b></div>
        <div class="bp-c sig"><small>توقيع الأستاذ(ة)</small><b></b></div>
        <div class="bp-c w2 sig"><small>تأشيرة المدير(ة) / المفتش(ة)</small><b></b></div>
      </div>
    </div></div>`;
  };

  /* =================================================================
     5) الدفتر المدرسي — أسطر الدفتر وهامش أحمر، حلقات، خط الرقعة وأوراق لاصقة
  ================================================================= */
  function spiral() {
    let s = '';
    for (let x = 30; x < 780; x += 34) s += `<circle cx="${x}" cy="30" r="5.2" fill="#3B4252"/><path d="M${x - 6} 31 C ${x - 7} 4, ${x + 7} 4, ${x + 6} 31" fill="none" stroke="#9AA3B2" stroke-width="3.4" stroke-linecap="round"/><path d="M${x - 5} 29 C ${x - 6} 8, ${x + 5} 8, ${x + 4} 27" fill="none" stroke="#E4E8EF" stroke-width="1.1" stroke-linecap="round"/>`;
    return `<svg class="ch-sp" viewBox="0 0 794 40" width="794" height="40">${s}</svg>`;
  }
  const chSquig = `<svg class="ch-sq" viewBox="0 0 300 14" width="300" height="14"><path d="M4 8 C 40 2, 70 12, 110 6 S 190 3, 230 8 S 280 10, 296 5" fill="none" stroke="#C62828" stroke-width="2.4" stroke-linecap="round"/><path d="M30 12 C 80 8, 150 13, 270 10" fill="none" stroke="#C62828" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  const chStar = `<svg viewBox="0 0 30 30" width="30" height="30"><path d="M15 3l3.4 7.4 8 1-5.9 5.4 1.6 8-7.1-4-7.1 4 1.6-8L3.6 11.4l8-1z" fill="none" stroke="#E0A100" stroke-width="2" stroke-linejoin="round"/></svg>`;
  PT.cahier = p => {
    const g = grow(p);
    return `<div class="paper pr-cahier"><div class="ch-lines"></div><div class="ch-mg"></div>${spiral()}
    <div class="ch-in">
      <div class="ch-top"${S('header')}><div><p><i>المؤسسة:</i> ${val(p.school)}</p><p><i>الأستاذ(ة):</i> ${val(p.teacher)}</p></div>${logoImg(p, 'ch-lg')}<div class="ch-dt"><p><i>التاريخ:</i> <bdi>${val(dt(p))}</bdi></p><p><i>السنة:</i> <bdi>${val(p.year)}</bdi></p></div></div>
      <div class="ch-tt"${S('lesson')}><small>مذكرة تحضير درس</small><h1>${val(p.title)}</h1>${chSquig}</div>
      <div class="ch-info"><span${S('header')}><i>المادة:</i> ${val(p.subject)}</span><span${S('header')}><i>القسم:</i> ${val(p.klass)}</span><span${S('lesson')}><i>الوحدة:</i> ${val(p.unit)}</span><span${S('lesson')}><i>الحصة:</i> ${val(p.session)}</span><span${S('lesson')}><i>المدة:</i> ${durTxt(p)}</span></div>
      <div class="ch-notes">
        <div class="ch-note y"${S('objectives')}><span class="ch-tape"></span><h5>الأهداف</h5><ol>${p.objectives.map((o, i) => `<li><em>${i + 1}</em>${esc(o)}</li>`).join('')}</ol></div>
        <div class="ch-note k"${S('materials')}><span class="ch-tape"></span><h5>الوسائل</h5><ul>${p.materials.map(m => `<li><em>✓</em>${esc(m)}</li>`).join('')}</ul></div>
      </div>
      <div class="ch-st"${S('stages')}><h4>سير الدرس</h4>
        ${p.stages.map((s, i) => `<div class="ch-s" style="--g:${g[i]}"><div class="ch-sh"><b>${i + 1}. ${esc(s.title)}</b><em>${mins(s) ? mins(s) + ' د' : '—'}</em></div><div class="ch-sa">${actTS(s, 'ch-p')}</div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="ch-ev"${S('eval')}>${chStar}<div><h5>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div></div>` : ''}
      ${signs(p, 'ch-sg', ['توقيع الأستاذ(ة)', 'ملاحظات المفتش(ة)'])}
    </div></div>`;
  };

  /* =================================================================
     6) المجلة — ترويسة صحفية، عنوان كبير، رقم الحصة كعدد مجلة، عمودان (لون المذكرة)
  ================================================================= */
  PT.editorial = p => {
    const c = safeHex(p.color), g = grow(p), sh = shares(p);
    return `<div class="paper pr-editorial" style="${cv(c)}">
    <div class="ed-mast"${S('header')}><span>${val(p.school)}</span><b>مذكرة تحضير درس</b><span>السنة الدراسية ${val(p.year)}</span></div>
    <div class="ed-hero"${S('lesson')}>
      <div class="ed-ht"><small style="color:${c}">${val(p.subject)} · ${val(p.klass)}</small><h1>${val(p.title)}</h1><p>${p.unit ? 'من وحدة «' + esc(p.unit) + '»' : ''}</p>
        <div class="ed-by"><span>إعداد الأستاذ(ة) <b>${val(p.teacher)}</b></span><span>${val(dt(p))}</span><span>المدة ${durTxt(p)}</span></div></div>
      <div class="ed-no">${p.logo ? `<img src="${p.logo}" alt="">` : ''}<small>الحصة</small><b style="color:${c}" dir="ltr">${two(esc(p.session || 0))}</b></div>
    </div>
    <div class="ed-body">
      <main class="ed-main"${S('stages')}><h4><span style="background:${c}"></span>سير الدرس</h4>
        ${p.stages.map((s, i) => `<article class="ed-a" style="--g:${g[i]}"><b class="ed-n" style="color:${tint(c, 0.45)}" dir="ltr">${two(i + 1)}</b><div><h6>${esc(s.title)}<em style="color:${c}">${mins(s) ? mins(s) + ' دقيقة' : ''}</em></h6><div class="ed-cols">${actTS(s, 'ed-p', 'الأستاذ', 'التلميذ')}</div></div></article>`).join('')}
      </main>
      <aside class="ed-side">
        <section${S('objectives')}><h5 style="border-top-color:${c}">في هذا الدرس</h5><ol>${p.objectives.map((o, i) => `<li><em style="color:${c}">${i + 1}</em><span>${esc(o)}</span></li>`).join('')}</ol></section>
        ${p.objectives[0] ? `<blockquote${S('objectives')}><span style="color:${c}">❝</span>${esc(p.objectives[0])}</blockquote>` : ''}
        <section${S('materials')}><h5 style="border-top-color:${c}">الوسائل</h5><p>${p.materials.map(esc).join(' <i>·</i> ')}</p></section>
        <section class="ed-tm"${S('stages')}><h5 style="border-top-color:${c}">توزيع الزمن</h5>${p.stages.map((s, i) => `<div><span>${esc(s.title)}</span><i><u style="width:${(sh.pct[i] * 100).toFixed(1)}%;background:${c}"></u></i><b>${mins(s) || 0}</b></div>`).join('')}</section>
        ${evalOn(p) ? `<section class="ed-ev"${S('eval')} style="background:${tint(c, 0.08)}"><h5 style="border-top-color:${c}">التقويم / الواجب</h5><p>${evalTxt(p)}</p></section>` : ''}
      </aside>
    </div>
    ${signs(p, 'ed-sg')}
    <div class="ed-foot"><span>${val(p.school)}</span><span>${val(p.subject)} — ${val(p.title)}</span><span>${val(dt(p))}</span></div>
  </div>`;
  };

  /* =================================================================
     7) الواحة — كثبان وشمس ونخلة، مسار الحصة كطريق قافلة
  ================================================================= */
  const OA = { b: '#5A2E14', o: '#D98E4F', s: '#E9B872', t: '#1F7A74', cr: '#FFFBF4', ln: '#EBD9BF' };
  const oaHead = `<svg class="oa-sky" viewBox="0 0 794 236" width="794" height="236" preserveAspectRatio="none">` +
    `<defs><linearGradient id="oaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE9CC"/><stop offset="1" stop-color="#FFF7EA"/></linearGradient></defs>` +
    `<rect width="794" height="236" fill="url(#oaG)"/><circle cx="118" cy="82" r="64" fill="#FBE3B3"/><circle cx="118" cy="82" r="44" fill="#F6C467"/>` +
    `<path d="M0 168C150 128 262 178 402 156C548 134 664 114 794 146V236H0Z" fill="#EFC98F"/>` +
    `<path d="M214 196C210 160 214 128 228 104" fill="none" stroke="#6B4423" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M228 104C210 96 194 100 182 112C198 104 212 104 228 106Z" fill="#2F5D50"/><path d="M228 104C246 92 264 94 276 106C260 100 244 102 228 106Z" fill="#2F5D50"/>` +
    `<path d="M228 104C220 86 206 80 192 82C206 88 216 94 226 106Z" fill="#3E7564"/><path d="M228 104C238 86 254 80 268 84C252 88 240 94 230 106Z" fill="#3E7564"/><path d="M228 104C228 88 236 76 246 72C240 84 234 94 230 106Z" fill="#2F5D50"/>` +
    `<path d="M0 192C124 166 252 206 424 186C566 170 682 196 794 176V236H0Z" fill="#E2A766"/>` +
    `<path d="M0 216C160 202 302 226 482 212C604 203 704 220 794 208V236H0Z" fill="#C97A3D"/></svg>`;
  const oaSun = `<svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="4.5" fill="${OA.o}"/><g stroke="${OA.o}" stroke-width="1.6" stroke-linecap="round"><path d="M10 1.5v2.5M10 16v2.5M1.5 10H4M16 10h2.5M4 4l1.8 1.8M14.2 14.2L16 16M16 4l-1.8 1.8M5.8 14.2L4 16"/></g></svg>`;
  PT.oasis = p => {
    const g = grow(p);
    return `<div class="paper pr-oasis"><div class="oa-h">${oaHead}
      <div class="oa-ht"><small${S('lesson')}>مذكرة تحضير درس${p.unit ? ' · ' + esc(p.unit) : ''}</small><h1${S('lesson')}>${val(p.title)}</h1><p${S('header')}>${val(p.school)} · ${val(p.year)}</p></div>${logoImg(p, 'oa-lg')}</div>
    <div class="oa-in">
      <div class="oa-info"><span${S('header')}><small>المادة</small>${val(p.subject)}</span><span${S('header')}><small>القسم</small>${val(p.klass)}</span><span${S('lesson')}><small>الحصة</small>${val(p.session)}</span><span${S('lesson')}><small>المدة</small>${durTxt(p)}</span><span${S('header')}><small>التاريخ</small>${val(dt(p))}</span><span${S('header')}><small>الأستاذ(ة)</small>${val(p.teacher)}</span></div>
      <div class="oa-two">
        <section${S('objectives')}><h5>${oaSun}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${lis(p.objectives)}</ul></section>
        <section${S('materials')}><h5>${oaSun}<span>الوسائل التعليمية</span></h5><div class="oa-pills">${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div></section>
      </div>
      <div class="oa-path"${S('stages')}><h4>مسار الحصة</h4>
        ${p.stages.map((s, i) => `<div class="oa-s" style="--g:${g[i]}"><div class="oa-wp"><b>${i + 1}</b></div><div class="oa-c"><div class="oa-sh"><b>${esc(s.title)}</b><em>${mins(s) ? mins(s) + ' د' : '—'}</em></div><div class="oa-sa">${actTS(s, 'oa-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="oa-ev"${S('eval')}><b>التقويم / الواجب المنزلي</b><p>${evalTxt(p)}</p></div>` : ''}
      ${signs(p, 'oa-sg', ['توقيع الأستاذ(ة)', 'تأشيرة المدير(ة)', 'ملاحظات المفتش(ة)'])}
    </div>
    <svg class="oa-ft" viewBox="0 0 794 34" width="794" height="34" preserveAspectRatio="none"><path d="M0 14C150 2 300 24 460 12C600 2 700 18 794 8V34H0Z" fill="#EFC98F"/><path d="M0 24C170 14 330 32 500 22C640 14 720 28 794 20V34H0Z" fill="#C97A3D"/></svg></div>`;
  };

  /* =================================================================
     8) الحديقة — أغصان وأوراق في الزوايا، كرمة تربط المراحل
  ================================================================= */
  const BO = { d: '#2F4F3A', s: '#5B7F62', l: '#9DB89A', bl: '#E8C4B0', bg: '#FBFAF5', gd: '#B9975B' };
  function branch(cls, mirror) {
    const P0 = [4, 186], P1 = [14, 70], P2 = [74, 12], P3 = [192, 6];          // تقوّس يحتضن الزاوية
    const at = t => { const u = 1 - t; return [0, 1].map(k => u * u * u * P0[k] + 3 * u * u * t * P1[k] + 3 * u * t * t * P2[k] + t * t * t * P3[k]); };
    const tg = t => { const u = 1 - t; return [0, 1].map(k => 3 * u * u * (P1[k] - P0[k]) + 6 * u * t * (P2[k] - P1[k]) + 3 * t * t * (P3[k] - P2[k])); };
    let s = `<path d="M${P0} C${P1} ${P2} ${P3}" fill="none" stroke="${BO.d}" stroke-width="2" stroke-linecap="round"/>`;
    const cols = [BO.s, BO.l, '#7A9E7E'];
    for (let i = 0; i < 11; i++) {
      const t = 0.06 + i * 0.085, [x, y] = at(t), [dx, dy] = tg(t), a = Math.atan2(dy, dx) * 180 / Math.PI;
      const L = 25 - i * 1.3, side = i % 2 ? 1 : -1;
      s += `<path d="M0 0Q${(L * 0.45).toFixed(1)} ${(-L * 0.4).toFixed(1)} ${L.toFixed(1)} 0Q${(L * 0.45).toFixed(1)} ${(L * 0.4).toFixed(1)} 0 0Z" fill="${cols[i % 3]}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a + side * 52).toFixed(1)})"/>`;
    }
    [[0.3, 7, BO.bl], [0.34, 5, BO.bl], [0.58, 5, BO.gd], [0.8, 4, BO.bl]].forEach(([t, r, c]) => { const [x, y] = at(t); s += `<circle cx="${(x + 9).toFixed(1)}" cy="${(y + 9).toFixed(1)}" r="${r / 1.6}" fill="${c}"/>`; });
    return `<svg class="${cls}" viewBox="0 0 200 200" width="200" height="200"><g${mirror ? ' transform="translate(200 0) scale(-1 1)"' : ''}>${s}</g></svg>`;
  }
  const leaf = (c, s) => `<svg viewBox="0 0 20 20" width="${s}" height="${s}"><path d="M3 17C3 8 9 3 17 3C17 11 12 17 3 17Z" fill="${c}"/><path d="M4 16L14 6" stroke="${BO.bg}" stroke-width="1.1" stroke-linecap="round"/></svg>`;
  const boDiv = `<svg class="bo-div" viewBox="0 0 240 20" width="240" height="20"><path d="M0 10H96M144 10H240" stroke="${BO.gd}" stroke-width="1"/><path d="M120 10Q108 0 100 4Q108 10 120 10Z" fill="${BO.s}"/><path d="M120 10Q132 0 140 4Q132 10 120 10Z" fill="${BO.s}"/><path d="M120 10Q108 20 100 16Q108 10 120 10Z" fill="${BO.l}"/><path d="M120 10Q132 20 140 16Q132 10 120 10Z" fill="${BO.l}"/><circle cx="120" cy="10" r="3" fill="${BO.bl}"/></svg>`;
  PT.botanica = p => {
    const g = grow(p);
    return `<div class="paper pr-botanica">${branch('bo-tl', false)}${branch('bo-tr', true)}
    <div class="bo-in">
      <div class="bo-h"${S('header')}>${logoImg(p, 'bo-lg')}<b>${val(p.school)}</b><span>السنة الدراسية ${val(p.year)}</span></div>
      <div class="bo-t"${S('lesson')}><small>مذكرة تحضير درس</small><h1>${val(p.title)}</h1>${boDiv}<p>${p.unit ? esc(p.unit) : ''}</p></div>
      <div class="bo-info"><span${S('header')}><small>المادة</small>${val(p.subject)}</span><span${S('header')}><small>القسم</small>${val(p.klass)}</span><span${S('lesson')}><small>الحصة</small>${val(p.session)}</span><span${S('lesson')}><small>المدة</small>${durTxt(p)}</span><span${S('header')}><small>التاريخ</small>${val(dt(p))}</span><span${S('header')}><small>الأستاذ(ة)</small>${val(p.teacher)}</span></div>
      <div class="bo-two">
        <section${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5><ul>${p.objectives.map(o => `<li>${leaf(BO.s, 14)}<span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section${S('materials')}><h5>الوسائل التعليمية</h5><div class="bo-pills">${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div></section>
      </div>
      <div class="bo-vine"${S('stages')}><h4>${leaf(BO.s, 16)}<span>سير الدرس</span></h4>
        ${p.stages.map((s, i) => `<div class="bo-s" style="--g:${g[i]}"><div class="bo-nd"><i>${leaf(i % 2 ? BO.l : BO.s, 18)}</i><b>${i + 1}</b></div><div class="bo-c"><div class="bo-sh"><b>${esc(s.title)}</b><em>${mins(s) ? mins(s) + ' د' : '—'}</em></div><div class="bo-sa">${actTS(s, 'bo-p')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="bo-ev"${S('eval')}><h5>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div>` : ''}
      ${signs(p, 'bo-sg', ['توقيع الأستاذ(ة)', 'تأشيرة المدير(ة)'])}
      ${boDiv}
    </div></div>`;
  };

  /* =================================================================
     9) السويسري — شبكة صارمة، أرقام كبيرة، خط واحد ولون واحد (لون المذكرة)
  ================================================================= */
  PT.swiss = p => {
    const c = safeHex(p.color), g = grow(p), sh = shares(p);
    const m = (l, v, sec) => `<div${S(sec)}><small>${l}</small><b>${val(v)}</b></div>`;
    let no = 0; const num = () => two(++no);
    return `<div class="paper pr-swiss" style="${cv(c)}">
    <div class="sw-bar"></div>
    <div class="sw-h"><div class="sw-t"${S('lesson')}><small style="color:${c}">مذكرة تحضير درس</small><h1>${val(p.title)}</h1></div>
      <div class="sw-no"${S('lesson')}><b style="color:${c}" dir="ltr">${two(esc(p.session || 0))}</b><small>رقم الحصة</small>${logoImg(p, 'sw-lg')}</div></div>
    <div class="sw-meta">${m('المؤسسة', p.school, 'header')}${m('السنة الدراسية', p.year, 'header')}${m('المادة', p.subject, 'header')}${m('القسم', p.klass, 'header')}${m('الوحدة / المحور', p.unit, 'lesson')}${m('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}${m('التاريخ', dt(p), 'header')}${m('الأستاذ(ة)', p.teacher, 'header')}</div>
    <div class="sw-sec"${S('objectives')}><h5><em style="color:${c}" dir="ltr">${num()}</em>الأهداف</h5><ol>${p.objectives.map((o, i) => `<li><b dir="ltr">${i + 1}.</b><span>${esc(o)}</span></li>`).join('')}</ol></div>
    <div class="sw-sec"${S('materials')}><h5><em style="color:${c}" dir="ltr">${num()}</em>الوسائل</h5><p>${p.materials.map(esc).join('<i> / </i>')}</p></div>
    <div class="sw-sec sw-st"${S('stages')}><h5><em style="color:${c}" dir="ltr">${num()}</em>سير الدرس</h5>
      <div class="sw-tb"><div class="hd"><div>#</div><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
      ${p.stages.map((s, i) => `<div class="rw" style="--g:${g[i]}"><div class="n" dir="ltr">${two(i + 1)}</div><div class="st">${esc(s.title)}</div><div class="tm"><b>${mins(s) ? mins(s) + ' د' : '—'}</b><i><u style="width:${(sh.pct[i] * 100).toFixed(1)}%;background:${c}"></u></i></div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`).join('')}</div></div>
    ${evalOn(p) ? `<div class="sw-sec"${S('eval')}><h5><em style="color:${c}" dir="ltr">${num()}</em>التقويم</h5><p>${evalTxt(p)}</p></div>` : ''}
    ${signs(p, 'sw-sg')}
  </div>`;
  };

  /* =================================================================
     10) عالم الصغار — سماء وغيوم وقوس قزح، بطاقات ملوّنة بأيقونات للابتدائي
  ================================================================= */
  const KD = ['#FF8A5B', '#4CB5E6', '#8CC63F', '#B07CE0', '#FFC53D', '#F2628C'];
  const KDL = ['#FFF0E8', '#E7F5FC', '#EFF8E3', '#F4ECFC', '#FFF7DE', '#FDE9F0'];
  const kdHead = (() => {
    const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#FFFFFF"><ellipse cx="0" cy="10" rx="34" ry="14"/><circle cx="-14" cy="2" r="14"/><circle cx="8" cy="-4" r="18"/><circle cx="26" cy="6" r="11"/></g>`;
    const rb = ['#F2628C', '#FF8A5B', '#FFC53D', '#8CC63F', '#4CB5E6', '#B07CE0'].map((col, i) => `<path d="M${136 + i * 9} 222A${124 - i * 9} ${124 - i * 9} 0 0 1 ${384 - i * 9} 222" fill="none" stroke="${col}" stroke-width="9"/>`).join('');
    let rays = '';
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; rays += `<path d="M${(70 + 36 * Math.cos(a)).toFixed(1)} ${(64 + 36 * Math.sin(a)).toFixed(1)}L${(70 + 49 * Math.cos(a)).toFixed(1)} ${(64 + 49 * Math.sin(a)).toFixed(1)}"/>`; }
    return `<svg class="kd-sky" viewBox="0 0 794 232" width="794" height="232" preserveAspectRatio="none"><rect width="794" height="232" fill="#DDF2FC"/>${rb}` +
      `<g stroke="#FFC53D" stroke-width="5" stroke-linecap="round">${rays}</g><circle cx="70" cy="64" r="27" fill="#FFD84D"/><circle cx="61" cy="59" r="3" fill="#5A4300"/><circle cx="79" cy="59" r="3" fill="#5A4300"/><path d="M60 71Q70 79 80 71" fill="none" stroke="#5A4300" stroke-width="2.4" stroke-linecap="round"/>` +
      `${cloud(214, 46, 0.85)}${cloud(610, 40, 0.9)}${cloud(470, 150, 0.55)}<path d="M0 214C120 200 220 226 360 214C500 202 640 226 794 210V232H0Z" fill="#8CC63F"/></svg>`;
  })();
  const kdStar = c => `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${c}"/></svg>`;
  PT.kids = p => {
    const g = grow(p), n = p.stages.length;
    let dots = '';
    [[12, 300, '#FFC53D'], [772, 410, '#F2628C'], [10, 640, '#4CB5E6'], [772, 760, '#8CC63F'], [12, 930, '#B07CE0'], [774, 560, '#FF8A5B']].forEach(([x, y, col], i) => {
      dots += `<i class="kd-dot" style="left:${x}px;top:${y}px;background:${col};width:${i % 2 ? 10 : 14}px;height:${i % 2 ? 10 : 14}px"></i>`;
    });
    return `<div class="paper pr-kids">${dots}<div class="kd-h">${kdHead}
      <div class="kd-ht"${S('lesson')}><span class="kd-tag">مذكرة درس${p.session ? ' · الحصة ' + esc(p.session) : ''}</span><h1>${val(p.title)}</h1><small>${p.unit ? esc(p.unit) : ''}</small><p${S('header')}>${val(p.school)} · ${val(p.year)}</p></div></div>
    <div class="kd-in">
      <div class="kd-info">
        <span${S('header')} style="background:${KDL[1]};color:#14648A"><small>المادة</small>${val(p.subject)}</span>
        <span${S('header')} style="background:${KDL[2]};color:#4B7A14"><small>القسم</small>${val(p.klass)}</span>
        <span${S('lesson')} style="background:${KDL[3]};color:#6A3FA6"><small>المدة</small>${durTxt(p)}</span>
        <span${S('header')} style="background:${KDL[4]};color:#8A6200"><small>التاريخ</small>${val(dt(p))}</span>
        <span${S('header')} style="background:${KDL[5]};color:#A72A58"><small>المعلّم(ة)</small>${val(p.teacher)}</span>
      </div>
      <div class="kd-two">
        <section class="kd-obj"${S('objectives')}><h5>ماذا سنتعلّم اليوم؟</h5><ul>${p.objectives.map((o, i) => `<li>${kdStar(KD[(i + 4) % KD.length])}<span>${esc(o)}</span></li>`).join('')}</ul></section>
        <section class="kd-mat"${S('materials')}><h5>أدواتنا</h5><div>${p.materials.map((m, i) => `<span style="background:${KD[i % KD.length]}">${esc(m)}</span>`).join('')}</div></section>
      </div>
      <div class="kd-st"${S('stages')}><h4>رحلة الدرس <small>${shares(p).tot ? shares(p).tot + ' دقيقة' : ''}</small></h4>
        ${tbar(p, KD, 'kd-bar', ['#FFFFFF'])}
        ${p.stages.map((s, i) => `<div class="kd-s" style="--g:${g[i]};background:${KDL[i % KDL.length]};border-color:${KD[i % KD.length]}"><div class="kd-ic" style="background:${KD[i % KD.length]}">${ico(kindOf(s, i, n), '#FFFFFF', 24, 2.2)}</div><div class="kd-c"><div class="kd-sh"><b>${esc(s.title)}</b><em style="color:${KD[i % KD.length]}">${ico('clock', KD[i % KD.length], 15, 2.4)}<span>${mins(s) ? mins(s) + ' د' : '—'}</span></em></div><div class="kd-sa">${actTS(s, 'kd-p', 'المعلّم(ة)', 'التلميذ')}</div></div></div>`).join('')}
      </div>
      ${evalOn(p) ? `<div class="kd-ev"${S('eval')}><span>${ico('home', '#FFFFFF', 22, 2.2)}</span><div><b>مهمّتي في البيت</b><p>${evalTxt(p)}</p></div></div>` : ''}
      ${signs(p, 'kd-sg', ['توقيع المعلّم(ة)', 'توقيع الولي', 'تأشيرة المدير(ة)'])}
    </div>
    <svg class="kd-ft" viewBox="0 0 794 30" width="794" height="30" preserveAspectRatio="none"><path d="M0 12C130 0 260 22 400 10C540 0 670 20 794 8V30H0Z" fill="#8CC63F"/>${[60, 190, 330, 470, 610, 740].map((x, i) => `<circle cx="${x}" cy="${14 + (i % 2) * 4}" r="4" fill="${KD[i % KD.length]}"/><circle cx="${x}" cy="${14 + (i % 2) * 4}" r="1.6" fill="#FFF7DE"/>`).join('')}</svg></div>`;
  };

  /* ---------- البيانات الوصفية (الأسماء، الترتيب، القوالب التي تأخذ لون المذكرة) ---------- */
  window.PREMIUM_TPL = PT;
  window.PREMIUM_KEYS = ['royal', 'andalus', 'dashboard', 'blueprint', 'cahier', 'editorial', 'oasis', 'botanica', 'swiss', 'kids'];
  window.PREMIUM_COLOR = ['dashboard', 'editorial', 'swiss'];
  window.PREMIUM_NAMES = {
    ar: { royal: 'الملكي الذهبي', andalus: 'الأندلسي', dashboard: 'لوحة القيادة', blueprint: 'المخطط الهندسي', cahier: 'الدفتر المدرسي',
      editorial: 'المجلة', oasis: 'الواحة', botanica: 'الحديقة', swiss: 'السويسري', kids: 'عالم الصغار' },
    fr: { royal: 'Royal doré', andalus: 'Andalou', dashboard: 'Tableau de bord', blueprint: 'Plan technique', cahier: 'Cahier d’écolier',
      editorial: 'Éditorial', oasis: 'Oasis', botanica: 'Botanique', swiss: 'Suisse', kids: 'Petits explorateurs' },
    en: { royal: 'Royal gold', andalus: 'Andalusian', dashboard: 'Dashboard', blueprint: 'Blueprint', cahier: 'School notebook',
      editorial: 'Editorial', oasis: 'Oasis', botanica: 'Botanical', swiss: 'Swiss grid', kids: 'Little explorers' },
  };
})();
