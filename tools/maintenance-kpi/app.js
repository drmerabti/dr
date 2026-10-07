// ============================================================
// حاسبات مؤشرات الصيانة — OEE/TRS · MTBF · MTTR · التوفرية
// كل الأزمنة تُخزَّن داخليًا بالدقائق، وتُعرض بالوحدة المختارة.
// ============================================================

// الأداة مقفلة ("قريبًا") لكل المستخدمين ما عدا الأدمن حتى يتم تجريبها.
const TOOL_LOCKED = true;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* =====================================================================
   الترجمة
===================================================================== */
const I18N = {
  ar: {
    title: 'حاسبات مؤشرات الصيانة', back: 'العودة إلى الأدوات',
    example: 'مثال', reset: 'مسح', print: 'طباعة', u_min: 'دقائق', u_h: 'ساعات',
    s_min: 'د', s_h: 'سا',
    oee: 'OEE', oee_sub: 'الفعالية الإجمالية للمعدات',
    mtbf_sub: 'متوسط الوقت بين الأعطال', mttr_sub: 'متوسط زمن الإصلاح',
    av: 'التوفرية', av_s: 'التوفرية الذاتية', av_sub: 'MTBF ÷ (MTBF + MTTR)',
    sum: 'لوحة الملخص', sum_sub: 'كل المؤشرات في نظرة واحدة',
    inputs: 'المدخلات', results: 'النتائج', formula: 'المعادلة',
    planned: 'الوقت المخطط للإنتاج', downtime: 'مدة التوقفات',
    cycle: 'زمن الدورة النظري (ثانية/وحدة)', total: 'الإنتاج الكلي (وحدات)', good: 'الإنتاج الجيد (وحدات)',
    optime: 'وقت التشغيل', failures: 'عدد الأعطال',
    repairTime: 'مجموع زمن الإصلاح', repairs: 'عدد الإصلاحات',
    tgtMtbf: 'MTBF المستهدف (اختياري)', tgtMttr: 'MTTR المستهدف (اختياري)',
    avMtbf: 'MTBF', avMttr: 'MTTR', sync: 'استعمال نتائج حاسبتي MTBF و MTTR',
    a: 'التوفر', p: 'الأداء', q: 'الجودة', runTime: 'وقت التشغيل الفعلي',
    worldClass: 'المستوى العالمي 85%', lv_bad: 'ضعيف', lv_mid: 'مقبول', lv_good: 'ممتاز',
    vsTarget: 'مقارنة بالهدف', noTarget: 'بدون هدف',
    chart: 'سلسلة الخسائر: توفر ← أداء ← جودة',
    c_planned: 'الوقت المخطط', c_a: 'بعد خسائر التوفر', c_p: 'بعد خسائر الأداء', c_q: 'الوقت المفيد (OEE)',
    l_a: 'توقفات', l_p: 'بطء / توقفات صغيرة', l_q: 'منتجات معيبة',
    e_nan: 'أدخل رقمًا صالحًا.', e_neg: 'لا يمكن أن تكون القيمة سالبة.',
    e_zero: 'لا يمكن أن تكون صفرًا (قسمة على صفر).',
    e_down: 'مدة التوقفات أكبر من الوقت المخطط.', e_run0: 'وقت التشغيل = 0، لا يمكن حساب الأداء.',
    e_good: 'الإنتاج الجيد أكبر من الإنتاج الكلي.',
    w_perf: 'الأداء يتجاوز 100%: راجع زمن الدورة النظري أو كمية الإنتاج.',
    fill: 'أدخل القيم لتظهر النتائج فورًا.',
    f_oee: 'OEE = التوفر × الأداء × الجودة',
    f_oee_d: 'التوفر = (الوقت المخطط − التوقفات) ÷ الوقت المخطط · الأداء = (زمن الدورة النظري × الإنتاج الكلي) ÷ وقت التشغيل · الجودة = الإنتاج الجيد ÷ الإنتاج الكلي. المستوى العالمي ≈ 85%.',
    f_mtbf: 'MTBF = وقت التشغيل ÷ عدد الأعطال',
    f_mtbf_d: 'يقيس موثوقية المعدة: كلما ارتفع MTBF طالت فترة العمل بين عطلين.',
    f_mttr: 'MTTR = مجموع زمن الإصلاح ÷ عدد الإصلاحات',
    f_mttr_d: 'يقيس قابلية الصيانة: كلما انخفض MTTR كان التدخل أسرع.',
    f_av: 'التوفرية = MTBF ÷ (MTBF + MTTR)',
    f_av_d: 'التوفرية الذاتية: نسبة الوقت الذي تكون فيه المعدة جاهزة للعمل، بالاعتماد على الأعطال والإصلاحات فقط.',
    f_sum: 'ملخص يجمع نتائج كل الحاسبات، جاهز للطباعة أو التصدير PDF.',
    exNote: 'مثال: فرن كلنكر بطاقة 3000 طن/يوم خلال شهر (720 ساعة مخططة، 50 ساعة توقف، 5 أعطال).',
    kpi: 'المؤشر', value: 'القيمة',
    gate_check: 'جاري التحقق…', gate_login: 'سجّل الدخول أولًا', gate_login_t: 'هذه الأداة تتطلب تسجيل الدخول من الصفحة الرئيسية للموقع.',
    gate_btn: 'الذهاب إلى الصفحة الرئيسية', gate_soon: 'قريبًا ✨', gate_soon_t: 'نعمل على تجهيز هذه الأداة بعناية، وستكون متاحة قريبًا.',
    gate_err: 'تعذّر تحميل الأداة، أعد تحميل الصفحة.',
    pdfErr: 'تعذّر إنشاء ملف PDF.', admin: 'وضع الأدمن — الأداة مقفلة لبقية المستخدمين'
  },
  fr: {
    title: 'Calculateurs d’indicateurs de maintenance', back: 'Retour aux outils',
    example: 'Exemple', reset: 'Effacer', print: 'Imprimer', u_min: 'Minutes', u_h: 'Heures',
    s_min: 'min', s_h: 'h',
    oee: 'TRS', oee_sub: 'Taux de rendement synthétique',
    mtbf_sub: 'Temps moyen entre pannes', mttr_sub: 'Temps moyen de réparation',
    av: 'Disponibilité', av_s: 'Disponibilité intrinsèque', av_sub: 'MTBF ÷ (MTBF + MTTR)',
    sum: 'Synthèse', sum_sub: 'Tous les indicateurs en un coup d’œil',
    inputs: 'Données', results: 'Résultats', formula: 'Formule',
    planned: 'Temps requis (planifié)', downtime: 'Temps d’arrêt',
    cycle: 'Temps de cycle théorique (s/unité)', total: 'Production totale (unités)', good: 'Production conforme (unités)',
    optime: 'Temps de fonctionnement', failures: 'Nombre de pannes',
    repairTime: 'Temps total de réparation', repairs: 'Nombre de réparations',
    tgtMtbf: 'MTBF cible (optionnel)', tgtMttr: 'MTTR cible (optionnel)',
    avMtbf: 'MTBF', avMttr: 'MTTR', sync: 'Utiliser les résultats des calculateurs MTBF et MTTR',
    a: 'Disponibilité', p: 'Performance', q: 'Qualité', runTime: 'Temps de fonctionnement réel',
    worldClass: 'Classe mondiale 85 %', lv_bad: 'Faible', lv_mid: 'Moyen', lv_good: 'Excellent',
    vsTarget: 'Par rapport à la cible', noTarget: 'Sans cible',
    chart: 'Cascade des pertes : disponibilité → performance → qualité',
    c_planned: 'Temps requis', c_a: 'Après pertes de disponibilité', c_p: 'Après pertes de performance', c_q: 'Temps utile (TRS)',
    l_a: 'Arrêts', l_p: 'Ralentissements / micro-arrêts', l_q: 'Non-conformes',
    e_nan: 'Saisissez un nombre valide.', e_neg: 'La valeur ne peut pas être négative.',
    e_zero: 'Ne peut pas être zéro (division par zéro).',
    e_down: 'Le temps d’arrêt dépasse le temps requis.', e_run0: 'Temps de fonctionnement = 0 : performance incalculable.',
    e_good: 'La production conforme dépasse la production totale.',
    w_perf: 'Performance > 100 % : vérifiez le temps de cycle ou la production.',
    fill: 'Saisissez les valeurs : les résultats s’affichent aussitôt.',
    f_oee: 'TRS = Disponibilité × Performance × Qualité',
    f_oee_d: 'Disponibilité = (temps requis − arrêts) ÷ temps requis · Performance = (temps de cycle théorique × production totale) ÷ temps de fonctionnement · Qualité = conformes ÷ total. Classe mondiale ≈ 85 %.',
    f_mtbf: 'MTBF = temps de fonctionnement ÷ nombre de pannes',
    f_mtbf_d: 'Mesure la fiabilité : plus le MTBF est élevé, plus l’équipement fonctionne longtemps entre deux pannes.',
    f_mttr: 'MTTR = temps total de réparation ÷ nombre de réparations',
    f_mttr_d: 'Mesure la maintenabilité : plus le MTTR est faible, plus l’intervention est rapide.',
    f_av: 'Disponibilité = MTBF ÷ (MTBF + MTTR)',
    f_av_d: 'Disponibilité intrinsèque : part du temps où l’équipement est apte à fonctionner, compte tenu des pannes et réparations.',
    f_sum: 'Synthèse de tous les calculateurs, prête à imprimer ou exporter en PDF.',
    exNote: 'Exemple : four à clinker de 3 000 t/j sur un mois (720 h requises, 50 h d’arrêt, 5 pannes).',
    kpi: 'Indicateur', value: 'Valeur',
    gate_check: 'Vérification…', gate_login: 'Veuillez vous connecter', gate_login_t: 'Cet outil nécessite une connexion depuis la page d’accueil du site.',
    gate_btn: 'Aller à l’accueil', gate_soon: 'Bientôt ✨', gate_soon_t: 'Nous préparons cet outil avec soin ; il sera bientôt disponible.',
    gate_err: 'Impossible de charger l’outil ; rechargez la page.',
    pdfErr: 'Échec de la création du PDF.', admin: 'Mode admin — outil verrouillé pour les autres utilisateurs'
  },
  en: {
    title: 'Maintenance KPI Calculators', back: 'Back to tools',
    example: 'Example', reset: 'Clear', print: 'Print', u_min: 'Minutes', u_h: 'Hours',
    s_min: 'min', s_h: 'h',
    oee: 'OEE', oee_sub: 'Overall Equipment Effectiveness',
    mtbf_sub: 'Mean Time Between Failures', mttr_sub: 'Mean Time To Repair',
    av: 'Availability', av_s: 'Inherent availability', av_sub: 'MTBF ÷ (MTBF + MTTR)',
    sum: 'Summary', sum_sub: 'Every KPI at a glance',
    inputs: 'Inputs', results: 'Results', formula: 'Formula',
    planned: 'Planned production time', downtime: 'Downtime',
    cycle: 'Ideal cycle time (s/unit)', total: 'Total count (units)', good: 'Good count (units)',
    optime: 'Operating time', failures: 'Number of failures',
    repairTime: 'Total repair time', repairs: 'Number of repairs',
    tgtMtbf: 'Target MTBF (optional)', tgtMttr: 'Target MTTR (optional)',
    avMtbf: 'MTBF', avMttr: 'MTTR', sync: 'Use results from the MTBF & MTTR calculators',
    a: 'Availability', p: 'Performance', q: 'Quality', runTime: 'Actual run time',
    worldClass: 'World class 85%', lv_bad: 'Low', lv_mid: 'Fair', lv_good: 'Excellent',
    vsTarget: 'Against target', noTarget: 'No target',
    chart: 'Loss cascade: availability → performance → quality',
    c_planned: 'Planned time', c_a: 'After availability losses', c_p: 'After performance losses', c_q: 'Valuable time (OEE)',
    l_a: 'Stops', l_p: 'Slow cycles / minor stops', l_q: 'Rejects',
    e_nan: 'Enter a valid number.', e_neg: 'The value cannot be negative.',
    e_zero: 'Cannot be zero (division by zero).',
    e_down: 'Downtime is greater than planned time.', e_run0: 'Run time = 0, performance cannot be computed.',
    e_good: 'Good count is greater than total count.',
    w_perf: 'Performance exceeds 100%: check the ideal cycle time or the count.',
    fill: 'Enter values — results appear instantly.',
    f_oee: 'OEE = Availability × Performance × Quality',
    f_oee_d: 'Availability = (planned time − downtime) ÷ planned time · Performance = (ideal cycle time × total count) ÷ run time · Quality = good count ÷ total count. World class ≈ 85%.',
    f_mtbf: 'MTBF = operating time ÷ number of failures',
    f_mtbf_d: 'Measures reliability: the higher the MTBF, the longer the equipment runs between failures.',
    f_mttr: 'MTTR = total repair time ÷ number of repairs',
    f_mttr_d: 'Measures maintainability: the lower the MTTR, the faster the repair.',
    f_av: 'Availability = MTBF ÷ (MTBF + MTTR)',
    f_av_d: 'Inherent availability: the share of time the equipment is able to run, based on failures and repairs only.',
    f_sum: 'Summary of every calculator, ready to print or export as PDF.',
    exNote: 'Example: a 3,000 t/day clinker kiln over one month (720 planned hours, 50 h downtime, 5 failures).',
    kpi: 'KPI', value: 'Value',
    gate_check: 'Checking…', gate_login: 'Please sign in', gate_login_t: 'This tool requires signing in from the site home page.',
    gate_btn: 'Go to the home page', gate_soon: 'Coming soon ✨', gate_soon_t: 'We are carefully preparing this tool; it will be available soon.',
    gate_err: 'The tool could not load; reload the page.',
    pdfErr: 'Could not create the PDF.', admin: 'Admin mode — tool is locked for other users'
  }
};

function initialLang() {
  let l = null;
  try { l = localStorage.getItem('mk_lang') || localStorage.getItem('site_lang'); } catch (e) {}
  return I18N[l] ? l : 'ar';
}
const S = {
  lang: initialLang(),
  unit: 'h',
  panel: 'oee',
  v: {},            // القيم الصالحة (الأزمنة بالدقائق)
  sync: true,
  gateState: 'check'
};
const T = k => (I18N[S.lang][k] ?? I18N.en[k] ?? k);

/* =====================================================================
   تعريف الحقول والحاسبات
===================================================================== */
// kind: time (يتبع وحدة العرض) · sec (ثوانٍ دائمًا) · count
const FIELDS = {
  planned: 'time', downtime: 'time', cycle: 'sec', total: 'count', good: 'count',
  optime: 'time', failures: 'count', tgtMtbf: 'time',
  repairTime: 'time', repairs: 'count', tgtMttr: 'time',
  avMtbf: 'time', avMttr: 'time'
};
const PANELS = [
  { id: 'oee', name: 'oee', sub: 'oee_sub', ic: 'gauge', fields: ['planned', 'downtime', 'cycle', 'total', 'good'], f: 'f_oee', fd: 'f_oee_d' },
  { id: 'mtbf', name: null, label: 'MTBF', sub: 'mtbf_sub', ic: 'pulse', fields: ['optime', 'failures', 'tgtMtbf'], f: 'f_mtbf', fd: 'f_mtbf_d' },
  { id: 'mttr', name: null, label: 'MTTR', sub: 'mttr_sub', ic: 'wrench', fields: ['repairTime', 'repairs', 'tgtMttr'], f: 'f_mttr', fd: 'f_mttr_d' },
  { id: 'av', name: 'av', sub: 'av_sub', ic: 'shield', fields: ['avMtbf', 'avMttr'], f: 'f_av', fd: 'f_av_d' },
  { id: 'sum', name: 'sum', sub: 'sum_sub', ic: 'grid', fields: [], f: null, fd: 'f_sum' }
];

// مستويات الألوان (أحمر / برتقالي / أخضر) — عتبات النسب المئوية
const LEVELS = {
  oee: [60, 85], a: [80, 90], p: [80, 95], q: [95, 99], av: [90, 97]
};
const lvl = (key, frac) => {
  if (frac == null) return 'none';
  const pct = frac * 100, [lo, hi] = LEVELS[key];
  return pct >= hi ? 'good' : pct >= lo ? 'mid' : 'bad';
};

const ICONS = {
  gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.4"/>',
  pulse: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.6 17.2a1.9 1.9 0 0 0 2.7 2.7l5.7-5.7a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'
};
const svgIc = k => `<svg viewBox="0 0 24 24">${ICONS[k]}</svg>`;

/* =====================================================================
   بناء الواجهة
===================================================================== */
function gaugeHTML(id, labelKey, withRef) {
  return `<div class="gauge" id="g_${id}">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="g-track" cx="60" cy="60" r="50"/>
      <circle class="g-bar" cx="60" cy="60" r="50" transform="rotate(-90 60 60)"/>
      ${withRef ? refTick(0.85) : ''}
    </svg>
    <div class="g-center"><b class="g-val">—</b><span class="g-lvl tx"></span></div>
    <div class="g-label tx" ${labelKey.startsWith('!') ? '' : `data-t="${labelKey}"`}>${labelKey.startsWith('!') ? labelKey.slice(1) : ''}</div>
  </div>`;
}
function refTick(frac) {
  const a = (frac * 360 - 90) * Math.PI / 180;
  const p = r => `${(60 + r * Math.cos(a)).toFixed(2)} ${(60 + r * Math.sin(a)).toFixed(2)}`;
  return `<path class="g-ref" d="M${p(40)} L${p(60)}"/>`;
}
function fieldHTML(k) {
  const unit = FIELDS[k] === 'time' ? `<span class="f-unit" data-unit-sfx></span>` : FIELDS[k] === 'sec' ? '<span class="f-unit">s</span>' : '';
  return `<label class="field" data-f="${k}">
    <span class="f-label tx" data-t="${k}"></span>
    <span class="f-box"><input id="in_${k}" type="text" inputmode="decimal" autocomplete="off" dir="ltr">${unit}</span>
    <span class="f-err tx" id="err_${k}"></span>
  </label>`;
}
function lossChartHTML(id) {
  return `<div class="card chart-card"><h3 class="card-h tx" data-t="chart"></h3><div class="losses" id="${id}"></div></div>`;
}
function formulaHTML(p) {
  return `<div class="card formula tx"><h3 class="card-h" data-t="formula"></h3>
    ${p.f ? `<div class="f-main" data-t="${p.f}"></div>` : ''}<p class="f-desc" data-t="${p.fd}"></p></div>`;
}

function buildUI() {
  $('#sideNav').innerHTML = PANELS.map(p => `
    <button type="button" class="nav-item" data-panel="${p.id}">
      <span class="nav-ic">${svgIc(p.ic)}</span>
      <span class="nav-txt tx"><b ${p.name ? `data-t="${p.name}"` : ''}>${p.label || ''}</b><small data-t="${p.sub}"></small></span>
    </button>`).join('');

  const html = [];
  // OEE / TRS
  html.push(`<section class="panel" data-panel="oee">
    <div class="calc">
      <div class="col-in">
        <div class="card"><h3 class="card-h tx" data-t="inputs"></h3>${PANELS[0].fields.map(fieldHTML).join('')}</div>
        ${formulaHTML(PANELS[0])}
      </div>
      <div class="col-out">
        <div class="card"><h3 class="card-h tx"><span data-t="results"></span><span class="wc-legend"><i></i><span data-t="worldClass"></span></span></h3>
          <div class="gauges">
            <div class="gauge-main">${gaugeHTML('oee', 'oee', true)}</div>
            <div class="gauges-sub">${gaugeHTML('a', 'a')}${gaugeHTML('p', 'p')}${gaugeHTML('q', 'q')}</div>
          </div>
          <div class="msg tx" id="msg_oee"></div>
        </div>
        ${lossChartHTML('loss_oee')}
      </div>
    </div></section>`);
  // MTBF
  html.push(`<section class="panel" data-panel="mtbf">
    <div class="calc">
      <div class="col-in"><div class="card"><h3 class="card-h tx" data-t="inputs"></h3>${PANELS[1].fields.map(fieldHTML).join('')}</div>${formulaHTML(PANELS[1])}</div>
      <div class="col-out"><div class="card"><h3 class="card-h tx" data-t="results"></h3>
        <div class="gauges single">${gaugeHTML('mtbf', '!MTBF')}</div><div class="msg tx" id="msg_mtbf"></div></div></div>
    </div></section>`);
  // MTTR
  html.push(`<section class="panel" data-panel="mttr">
    <div class="calc">
      <div class="col-in"><div class="card"><h3 class="card-h tx" data-t="inputs"></h3>${PANELS[2].fields.map(fieldHTML).join('')}</div>${formulaHTML(PANELS[2])}</div>
      <div class="col-out"><div class="card"><h3 class="card-h tx" data-t="results"></h3>
        <div class="gauges single">${gaugeHTML('mttr', '!MTTR')}</div><div class="msg tx" id="msg_mttr"></div></div></div>
    </div></section>`);
  // التوفرية
  html.push(`<section class="panel" data-panel="av">
    <div class="calc">
      <div class="col-in"><div class="card"><h3 class="card-h tx" data-t="inputs"></h3>
        <label class="check tx"><input type="checkbox" id="syncChk" checked><span data-t="sync"></span></label>
        ${PANELS[3].fields.map(fieldHTML).join('')}</div>${formulaHTML(PANELS[3])}</div>
      <div class="col-out"><div class="card"><h3 class="card-h tx" data-t="results"></h3>
        <div class="gauges single">${gaugeHTML('av', 'av')}</div><div class="msg tx" id="msg_av"></div></div></div>
    </div></section>`);
  // الملخص
  html.push(`<section class="panel" data-panel="sum">
    <div class="sum-head card tx"><h2 data-t="title"></h2><p data-t="f_sum"></p></div>
    <div class="sum-grid">
      <div class="card sum-gauges">
        ${gaugeHTML('s_oee', 'oee', true)}${gaugeHTML('s_a', 'a')}${gaugeHTML('s_p', 'p')}${gaugeHTML('s_q', 'q')}
        ${gaugeHTML('s_av', 'av_s')}${gaugeHTML('s_mtbf', '!MTBF')}${gaugeHTML('s_mttr', '!MTTR')}
      </div>
      ${lossChartHTML('loss_sum')}
      <div class="card"><table class="sum-table tx" id="sumTable"></table></div>
    </div></section>`);
  $('#panels').innerHTML = html.join('');
}

/* =====================================================================
   اللغة والوحدة
===================================================================== */
function applyLang() {
  const d = S.lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = S.lang;
  // الهيكل يبقى LTR (لا يتحرك أي زر)، والنصوص فقط تأخذ اتجاه اللغة
  $$('.tx').forEach(el => el.setAttribute('dir', d));
  $$('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
  $$('[data-t-title]').forEach(el => { el.title = T(el.dataset.tTitle); el.setAttribute('aria-label', T(el.dataset.tTitle)); });
  $$('#langs button').forEach(b => b.classList.toggle('on', b.dataset.l === S.lang));
  document.title = S.lang === 'ar' ? 'حساب مؤشرات الصيانة OEE و MTBF و MTTR — أكاديمية مرابطي' : `${T('title')} | Dr Soufiane Merabti`;
  if (!$('#exampleNote').classList.contains('hidden')) $('#exampleNote').textContent = T('exNote');
  if (S.gateState !== 'open') gate(S.gateState);
  applyUnitLabels();
  update();
}
function setLang(l) {
  S.lang = l;
  try { localStorage.setItem('mk_lang', l); if (l === 'ar' || l === 'en') localStorage.setItem('site_lang', l); } catch (e) {}
  applyLang();
}
function applyUnitLabels() {
  $$('[data-unit-sfx]').forEach(el => { el.textContent = T(S.unit === 'h' ? 's_h' : 's_min'); });
  $$('#unitSeg button').forEach(b => b.classList.toggle('on', b.dataset.unit === S.unit));
}
function setUnit(u) {
  if (u === S.unit) return;
  S.unit = u;
  // إعادة كتابة حقول الزمن الصالحة بالوحدة الجديدة
  Object.keys(FIELDS).forEach(k => { if (FIELDS[k] === 'time') writeInput(k); });
  applyUnitLabels();
  save();
  update();
}

/* =====================================================================
   قراءة وكتابة المدخلات
===================================================================== */
const toDisp = min => S.unit === 'h' ? min / 60 : min;
const fromDisp = x => S.unit === 'h' ? x * 60 : x;
const round = (x, n = 4) => Math.round(x * 10 ** n) / 10 ** n;

function writeInput(k) {
  const el = $('#in_' + k);
  if (!el || el.classList.contains('bad')) return;
  const v = S.v[k];
  el.value = v == null ? '' : String(round(FIELDS[k] === 'time' ? toDisp(v) : v));
}
// تُرجع {empty} أو {err} أو {val}
function readInput(k) {
  const el = $('#in_' + k);
  const s = (el ? el.value : '').trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return { empty: true };
  if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(s)) return { err: 'e_nan' };
  const n = Number(s);
  if (!isFinite(n)) return { err: 'e_nan' };
  if (n < 0) return { err: 'e_neg' };
  return { val: FIELDS[k] === 'time' ? fromDisp(n) : n };
}

/* =====================================================================
   الحساب
===================================================================== */
function compute() {
  const errs = {}, r = {};
  const val = {};
  Object.keys(FIELDS).forEach(k => {
    const x = readInput(k);
    if (x.err) { errs[k] = x.err; S.v[k] = null; }
    else { S.v[k] = x.empty ? null : x.val; val[k] = S.v[k]; }
  });
  const has = k => val[k] != null;

  // OEE / TRS
  if (has('planned') && val.planned === 0) errs.planned = 'e_zero';
  if (has('planned') && has('downtime') && val.downtime > val.planned) errs.downtime = 'e_down';
  if (has('total') && val.total === 0) errs.total = 'e_zero';
  if (has('good') && has('total') && val.good > val.total) errs.good = 'e_good';
  const okA = has('planned') && has('downtime') && !errs.planned && !errs.downtime;
  if (okA) {
    r.run = val.planned - val.downtime;
    r.a = r.run / val.planned;
    if (r.run === 0 && has('cycle') && has('total')) errs.downtime = 'e_run0';
  }
  if (okA && r.run > 0 && has('cycle') && has('total') && !errs.cycle && !errs.total) {
    r.p = (val.cycle / 60 * val.total) / r.run;
  }
  if (has('good') && has('total') && !errs.good && !errs.total) r.q = val.good / val.total;
  if (r.a != null && r.p != null && r.q != null) r.oee = r.a * r.p * r.q;

  // MTBF
  if (has('failures') && val.failures === 0) errs.failures = 'e_zero';
  if (has('optime') && has('failures') && !errs.failures) r.mtbf = val.optime / val.failures;
  // MTTR
  if (has('repairs') && val.repairs === 0) errs.repairs = 'e_zero';
  if (has('repairTime') && has('repairs') && !errs.repairs) r.mttr = val.repairTime / val.repairs;
  r.tgtMtbf = has('tgtMtbf') && val.tgtMtbf > 0 ? val.tgtMtbf : null;
  r.tgtMttr = has('tgtMttr') && val.tgtMttr > 0 ? val.tgtMttr : null;

  // التوفرية
  let m1, m2;
  if (S.sync) { m1 = r.mtbf; m2 = r.mttr; }
  else { m1 = has('avMtbf') ? val.avMtbf : null; m2 = has('avMttr') ? val.avMttr : null; }
  r.avMtbf = m1; r.avMttr = m2;
  if (m1 != null && m2 != null) {
    if (m1 + m2 === 0) { if (!S.sync) errs.avMtbf = 'e_zero'; }
    else r.av = m1 / (m1 + m2);
  }
  return { r, errs };
}

/* =====================================================================
   العرض
===================================================================== */
const C = 2 * Math.PI * 50;
const numLocale = () => S.lang === 'fr' ? 'fr-FR' : 'en-US';
const fmtPct = f => (f * 100).toLocaleString(numLocale(), { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + '%';
const fmtNum = (x, d = 2) => x.toLocaleString(numLocale(), { maximumFractionDigits: d });
const fmtTime = min => `${fmtNum(toDisp(min))} ${T(S.unit === 'h' ? 's_h' : 's_min')}`;

function setGauge(id, frac, level, text, sub) {
  const g = document.getElementById('g_' + id);
  if (!g) return;
  const f = frac == null ? 0 : Math.max(0, Math.min(1, frac));
  const bar = g.querySelector('.g-bar');
  bar.style.strokeDasharray = `${(f * C).toFixed(2)} ${C.toFixed(2)}`;
  g.dataset.lv = level;
  g.querySelector('.g-val').textContent = text ?? '—';
  g.querySelector('.g-lvl').textContent = sub ?? (level !== 'none' ? T('lv_' + level) : '');
}
function pctGauge(id, key, frac) {
  setGauge(id, frac, lvl(key, frac), frac == null ? '—' : fmtPct(frac));
}
// MTBF: كلما كان أكبر كان أفضل — MTTR: كلما كان أصغر كان أفضل
function timeGauge(id, value, target, higherBetter) {
  if (value == null) return setGauge(id, null, 'none', '—', '');
  if (!target) return setGauge(id, 1, 'info', fmtTime(value), T('noTarget'));
  const ratio = higherBetter ? value / target : target / value;
  const level = ratio >= 1 ? 'good' : ratio >= 0.75 ? 'mid' : 'bad';
  setGauge(id, Math.min(1, ratio), level, fmtTime(value), `${T('lv_' + level)} · ${fmtPct(Math.min(9.99, value / target))}`);
}

function renderLosses(id, r) {
  const box = document.getElementById(id);
  if (!box) return;
  if (r.oee == null) { box.innerHTML = `<p class="empty tx" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${T('fill')}</p>`; return; }
  const p = Math.min(1, r.p);
  const s1 = r.a, s2 = r.a * p, s3 = s2 * r.q;
  const rows = [
    { k: 'c_planned', w: 1, loss: 0, cls: 's0' },
    { k: 'c_a', w: s1, loss: 1 - s1, lk: 'l_a', cls: 's1' },
    { k: 'c_p', w: s2, loss: s1 - s2, lk: 'l_p', cls: 's2' },
    { k: 'c_q', w: s3, loss: s2 - s3, lk: 'l_q', cls: 's3', lv: lvl('oee', s3) }
  ];
  const d = S.lang === 'ar' ? 'rtl' : 'ltr';
  box.innerHTML = rows.map(x => `
    <div class="lrow">
      <div class="l-lab" dir="${d}">${T(x.k)}${x.lk ? `<small>−<span dir="ltr">${fmtPct(x.loss)}</span> · ${T(x.lk)}</small>` : ''}</div>
      <div class="l-track">
        <div class="l-fill ${x.cls}" ${x.lv ? `data-lv="${x.lv}"` : ''} style="width:${(x.w * 100).toFixed(2)}%"></div>
        ${x.loss > 0.0001 ? `<div class="l-loss" style="width:${(x.loss * 100).toFixed(2)}%" title="−${fmtPct(x.loss)} · ${T(x.lk)}"></div>` : ''}
        ${x.lv ? `<div class="l-mark" title="${T('worldClass')}"></div>` : ''}
      </div>
      <div class="l-val">${fmtPct(x.w)}</div>
    </div>`).join('') +
    `<div class="l-legend" dir="${d}"><span><i class="lg-loss"></i>${T('l_a')} / ${T('l_p')} / ${T('l_q')}</span><span><i class="lg-mark"></i>${T('worldClass')}</span></div>`;
}

function showErrors(errs) {
  Object.keys(FIELDS).forEach(k => {
    const e = document.getElementById('err_' + k), inp = document.getElementById('in_' + k);
    if (!e) return;
    e.textContent = errs[k] ? T(errs[k]) : '';
    inp.classList.toggle('bad', !!errs[k]);
  });
}

function update() {
  if (!$('#panels').children.length) return;
  const { r, errs } = compute();
  showErrors(errs);

  // مزامنة حقول التوفرية
  if (S.sync) {
    ['avMtbf', 'avMttr'].forEach(k => {
      const el = $('#in_' + k); const v = k === 'avMtbf' ? r.mtbf : r.mttr;
      el.value = v == null ? '' : String(round(toDisp(v)));
      el.readOnly = true; el.classList.remove('bad');
      $('#err_' + k).textContent = '';
    });
  } else ['avMtbf', 'avMttr'].forEach(k => { $('#in_' + k).readOnly = false; });

  // OEE
  pctGauge('oee', 'oee', r.oee); pctGauge('a', 'a', r.a); pctGauge('p', 'p', r.p); pctGauge('q', 'q', r.q);
  let m = '';
  if (r.p != null && r.p > 1) m = `<span class="warn">${T('w_perf')}</span>`;
  else if (r.oee == null) m = T('fill');
  else if (r.run != null) m = `${T('runTime')}: <b dir="ltr">${fmtTime(r.run)}</b>`;
  $('#msg_oee').innerHTML = m;
  renderLosses('loss_oee', r);

  // MTBF / MTTR / التوفرية
  timeGauge('mtbf', r.mtbf, r.tgtMtbf, true);
  timeGauge('mttr', r.mttr, r.tgtMttr, false);
  pctGauge('av', 'av', r.av);
  $('#msg_mtbf').textContent = r.mtbf == null ? T('fill') : '';
  $('#msg_mttr').textContent = r.mttr == null ? T('fill') : '';
  $('#msg_av').innerHTML = r.av == null ? T('fill') :
    `MTBF <b dir="ltr">${fmtTime(r.avMtbf)}</b> · MTTR <b dir="ltr">${fmtTime(r.avMttr)}</b>`;

  // الملخص
  pctGauge('s_oee', 'oee', r.oee); pctGauge('s_a', 'a', r.a); pctGauge('s_p', 'p', r.p); pctGauge('s_q', 'q', r.q);
  pctGauge('s_av', 'av', r.av);
  timeGauge('s_mtbf', r.mtbf, r.tgtMtbf, true);
  timeGauge('s_mttr', r.mttr, r.tgtMttr, false);
  renderLosses('loss_sum', r);
  const dash = '—';
  const rows = [
    [T('oee'), r.oee != null ? fmtPct(r.oee) : dash, lvl('oee', r.oee)],
    [T('a'), r.a != null ? fmtPct(r.a) : dash, lvl('a', r.a)],
    [T('p'), r.p != null ? fmtPct(r.p) : dash, lvl('p', r.p)],
    [T('q'), r.q != null ? fmtPct(r.q) : dash, lvl('q', r.q)],
    [T('runTime'), r.run != null ? fmtTime(r.run) : dash, 'none'],
    ['MTBF', r.mtbf != null ? fmtTime(r.mtbf) : dash, 'none'],
    ['MTTR', r.mttr != null ? fmtTime(r.mttr) : dash, 'none'],
    [T('av_s'), r.av != null ? fmtPct(r.av) : dash, lvl('av', r.av)]
  ];
  $('#sumTable').innerHTML = `<thead><tr><th>${T('kpi')}</th><th>${T('value')}</th></tr></thead><tbody>` +
    rows.map(x => `<tr><td>${x[0]}</td><td dir="ltr" data-lv="${x[2]}">${x[1]}</td></tr>`).join('') + '</tbody>';

  save();
}

/* =====================================================================
   الحفظ المحلي، المثال، التنقل
===================================================================== */
function save() {
  try { localStorage.setItem('mk_state', JSON.stringify({ v: S.v, unit: S.unit, panel: S.panel, sync: S.sync })); } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('mk_state') || 'null');
    if (!d) return;
    if (d.unit === 'min' || d.unit === 'h') S.unit = d.unit;
    if (PANELS.some(p => p.id === d.panel)) S.panel = d.panel;
    if (typeof d.sync === 'boolean') S.sync = d.sync;
    if (d.v && typeof d.v === 'object') Object.keys(FIELDS).forEach(k => {
      const x = d.v[k]; if (typeof x === 'number' && isFinite(x) && x >= 0) S.v[k] = x;
    });
  } catch (e) {}
}
function fillAll() {
  Object.keys(FIELDS).forEach(k => { const el = $('#in_' + k); if (el) el.classList.remove('bad'); writeInput(k); });
  $('#syncChk').checked = S.sync;
}

// فرن كلنكر 3000 طن/يوم — شهر واحد (الأزمنة بالدقائق)
const EXAMPLE = {
  planned: 720 * 60, downtime: 50 * 60, cycle: 28.8, total: 75400, good: 74650,
  optime: 670 * 60, failures: 5, tgtMtbf: 150 * 60,
  repairTime: 38 * 60, repairs: 5, tgtMttr: 8 * 60,
  avMtbf: null, avMttr: null
};
function loadExample() {
  S.v = { ...EXAMPLE }; S.sync = true;
  fillAll();
  const n = $('#exampleNote'); n.textContent = T('exNote'); n.classList.remove('hidden');
  update();
}
function resetAll() {
  S.v = {}; S.sync = true;
  Object.keys(FIELDS).forEach(k => { const el = $('#in_' + k); if (el) { el.value = ''; el.classList.remove('bad'); } });
  $('#syncChk').checked = true;
  $('#exampleNote').classList.add('hidden');
  update();
}
function showPanel(id) {
  S.panel = id;
  $$('.panel').forEach(p => p.classList.toggle('on', p.dataset.panel === id));
  $$('.nav-item').forEach(b => b.classList.toggle('on', b.dataset.panel === id));
  $('#work').scrollTop = 0;
  save();
}

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* =====================================================================
   الطباعة و PDF
===================================================================== */
async function exportPdf() {
  const el = document.querySelector('.panel.on');
  if (!el || !window.html2canvas || !window.jspdf) { toast(T('pdfErr')); return; }
  document.body.classList.add('exporting');
  try {
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, windowWidth: 1400 });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'l' : 'p', unit: 'mm', format: 'a4' });
    const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight(), m = 10;
    const ratio = Math.min((pw - 2 * m) / canvas.width, (ph - 2 * m) / canvas.height);
    const w = canvas.width * ratio, h = canvas.height * ratio;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pw - w) / 2, m, w, h);
    pdf.save(`maintenance-kpi-${S.panel}.pdf`);
  } catch (e) { toast(T('pdfErr')); }
  finally { document.body.classList.remove('exporting'); }
}

/* =====================================================================
   بوابة القفل (الأدمن فقط)
===================================================================== */
function gate(state) {
  S.gateState = state;
  const g = $('#gate');
  if (state === 'open') { g.classList.add('hidden'); return; }
  g.classList.remove('hidden');
  $('#gateSpin').classList.toggle('hidden', state !== 'check');
  const map = { check: ['', T('gate_check')], login: [T('gate_login'), T('gate_login_t')], soon: [T('gate_soon'), T('gate_soon_t')], error: ['', T('gate_err')] };
  $('#gateTitle').textContent = map[state][0];
  $('#gateText').textContent = map[state][1];
  const b = $('#gateBtn');
  b.classList.toggle('hidden', !(state === 'login' || state === 'soon'));
  b.textContent = T('gate_btn');
  $('.gate-card').setAttribute('dir', S.lang === 'ar' ? 'rtl' : 'ltr');
}
function startGate() {
  gate('check');
  if (!window.firebase || !firebase.apps || !firebase.apps.length) { gate('error'); return; }
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) { gate(TOOL_LOCKED ? 'soon' : 'open'); return; }
    let isAdmin = false;
    try {
      const d = await firebase.firestore().collection('users').doc(user.uid).get();
      isAdmin = !!(d.exists && d.data().isAdmin === true);
    } catch (e) { isAdmin = false; }
    if (TOOL_LOCKED && !isAdmin) { gate('soon'); return; }
    gate('open');
    if (TOOL_LOCKED) toast(T('admin'));
  });
}

/* =====================================================================
   التشغيل
===================================================================== */
function init() {
  buildUI();
  load();
  fillAll();

  $('#sideNav').addEventListener('click', e => { const b = e.target.closest('.nav-item'); if (b) showPanel(b.dataset.panel); });
  $('#panels').addEventListener('input', e => { if (e.target.matches('input[type=text]')) update(); });
  $('#syncChk').addEventListener('change', e => {
    S.sync = e.target.checked;
    if (!S.sync) {
      // نبدأ من القيم المحسوبة ثم يمكن تعديلها يدويًا
      const { r } = compute();
      S.v.avMtbf = r.mtbf ?? S.v.avMtbf ?? null; S.v.avMttr = r.mttr ?? S.v.avMttr ?? null;
      writeInput('avMtbf'); writeInput('avMttr');
    }
    update();
  });
  $$('#langs button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  $$('#unitSeg button').forEach(b => b.addEventListener('click', () => setUnit(b.dataset.unit)));
  $('#exampleBtn').addEventListener('click', loadExample);
  $('#resetBtn').addEventListener('click', resetAll);
  $('#printBtn').addEventListener('click', () => window.print());
  $('#pdfBtn').addEventListener('click', exportPdf);

  showPanel(S.panel);
  applyLang();
  startGate();
}
init();
