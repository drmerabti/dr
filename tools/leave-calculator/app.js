/* =====================================================================
   حاسبة العطل — Merabti Academy
   تاريخ الرجوع إلى العمل، أيام العمل، العطل الرسمية الجزائرية، التقويم الهجري
===================================================================== */
// الأداة "قريبًا": مقفلة للجميع ما عدا الأدمن. اجعلها false عند الإطلاق.
const TOOL_LOCKED = true;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* =====================================================================
   الترجمة
===================================================================== */
const I18N = {
  ar: {
    title: 'حاسبة العطل', subtitle: 'أدخل تاريخ بداية العطلة وعدد أيامها لتعرف فورًا يوم رجوعك إلى العمل.',
    back: 'العودة إلى الأدوات', reset: 'إعادة تعيين',
    start: 'تاريخ بداية العطلة', days: 'عدد أيام العطلة', returnDate: 'تاريخ الرجوع إلى العمل',
    empty: 'اختر تاريخ البداية وعدد الأيام لتظهر النتيجة هنا',
    returnOn: 'تاريخ الرجوع إلى العمل',
    hint_cal: 'تُحتسب أيامًا تقويمية', hint_work: 'تُحتسب أيام عمل فقط',
    st_last: 'آخر يوم في العطلة', st_span: 'المدة الفعلية (أيام)', st_counted: 'أيام محتسبة',
    st_wk: 'أيام نهاية الأسبوع', st_hol: 'عطل رسمية',
    hols_in: 'عطل رسمية خلال الفترة:',
    shift_t: 'تم ترحيل تاريخ الرجوع إلى أول يوم عمل:',
    shift_row: '{d} — {r}',
    r_wk: 'نهاية الأسبوع',
    acc_settings: 'إعدادات الحساب', acc_settings_s: 'نوع الأيام، نهاية الأسبوع، العطل الرسمية',
    acc_types: 'أنواع العطل', acc_types_s: 'مدد جاهزة: سنوية، مرضية، أمومة، استثنائية',
    acc_reverse: 'الحساب العكسي', acc_reverse_s: 'من تاريخ البداية وتاريخ الرجوع إلى عدد الأيام',
    acc_balance: 'رصيد العطلة السنوية', acc_balance_s: '2.5 يوم عن كل شهر عمل، 30 يومًا في السنة',
    acc_calendar: 'التقويم المرئي', acc_calendar_s: 'أيام العطلة والعطل الرسمية ونهايات الأسبوع بالألوان',
    mode: 'نوع الحساب', mode_cal: 'أيام تقويمية', mode_work: 'أيام عمل فقط',
    weekend: 'نهاية الأسبوع', wk_fs: 'الجمعة والسبت', wk_ss: 'السبت والأحد', wk_f: 'الجمعة فقط',
    holidays: 'استثناء العطل الرسمية الجزائرية تلقائيًا',
    holidays_note: 'العطل الدينية محسوبة حسب التقويم الهجري (أم القرى) وقد تختلف بيوم واحد حسب رؤية الهلال في الجزائر.',
    hol_year: 'العطل الرسمية لسنة {y}',
    sum_holOn: 'العطل الرسمية مستثناة', sum_holOff: 'العطل الرسمية غير مستثناة',
    t_annual: 'سنوية', t_sick: 'مرضية', t_mat: 'أمومة', t_marriage: 'زواج', t_birth: 'ازدياد مولود', t_death: 'وفاة',
    u_cal: '{n} يوم تقويمي', u_work: '{n} أيام عمل',
    n_annual: 'العطلة السنوية: 30 يومًا تقويميًا كحد أقصى (2.5 يوم عن كل شهر عمل).',
    n_sick: 'العطلة المرضية: المدة حسب الشهادة الطبية — عدّل عدد الأيام حسب الحاجة.',
    n_mat: 'عطلة الأمومة: 14 أسبوعًا متتالية (98 يومًا).',
    n_marriage: 'عطلة استثنائية مدفوعة الأجر: 3 أيام عمل لزواج العامل.',
    n_birth: 'عطلة استثنائية مدفوعة الأجر: 3 أيام عمل لازدياد مولود.',
    n_death: 'عطلة استثنائية مدفوعة الأجر: 3 أيام عمل لوفاة أحد الأقارب المباشرين.',
    rev_days: 'يوم عطلة', rev_detail: 'المدة الإجمالية: {span} يوم تقويمي · نهايات أسبوع: {wk} · عطل رسمية: {hol}',
    rev_err: 'يجب أن يكون تاريخ الرجوع بعد تاريخ البداية.',
    months: 'عدد الأشهر المعمولة خلال السنة المرجعية',
    bal_days: 'يوم', bal_detail: '{m} شهر × 2.5 يوم = {r} يوم',
    bal_cap: '(الحد الأقصى 30 يومًا)',
    useBal: 'استعمل هذا الرصيد في الحساب',
    balance_note: 'حسب القانون 90-11: يومان ونصف عن كل شهر عمل، دون أن تتجاوز المدة 30 يومًا تقويميًا في السنة. السنة المرجعية من 1 جويلية إلى 30 جوان.',
    lg_leave: 'يوم عطلة', lg_hol: 'عطلة رسمية', lg_wk: 'نهاية الأسبوع', lg_ret: 'يوم الرجوع',
    cal_empty: 'أدخل التاريخ وعدد الأيام لعرض التقويم.',
    applied: 'تم تطبيق: {t}', balApplied: 'تم استعمال رصيد {n} يوم',
    reset_done: 'تمت إعادة التعيين',
    h_newyear: 'رأس السنة الميلادية', h_yennayer: 'رأس السنة الأمازيغية (يناير)', h_labour: 'عيد العمال',
    h_indep: 'عيد الاستقلال والشباب', h_rev: 'عيد اندلاع الثورة', h_hijri: 'رأس السنة الهجرية',
    h_ashura: 'عاشوراء', h_mawlid: 'المولد النبوي الشريف', h_fitr: 'عيد الفطر', h_adha: 'عيد الأضحى',
    day_n: 'اليوم {n}',
    gate_check: 'جاري التحقق…', gate_login: 'سجّل الدخول أولًا', gate_login_t: 'هذه الأداة تتطلب تسجيل الدخول من الصفحة الرئيسية للموقع.',
    gate_btn: 'الذهاب إلى الصفحة الرئيسية', gate_soon: 'قريبًا ✨', gate_soon_t: 'نعمل على تجهيز هذه الأداة بعناية، وستكون متاحة قريبًا.',
    gate_err: 'تعذّر تحميل الأداة، أعد تحميل الصفحة.',
    admin: 'وضع الأدمن — الأداة مقفلة لبقية المستخدمين'
  },
  fr: {
    title: 'Calculateur de congés', subtitle: 'Saisissez la date de début et le nombre de jours pour connaître aussitôt votre date de reprise.',
    back: 'Retour aux outils', reset: 'Réinitialiser',
    start: 'Date de début du congé', days: 'Nombre de jours', returnDate: 'Date de reprise',
    empty: 'Choisissez la date de début et le nombre de jours pour voir le résultat ici',
    returnOn: 'Date de reprise du travail',
    hint_cal: 'Comptés en jours calendaires', hint_work: 'Comptés en jours ouvrables uniquement',
    st_last: 'Dernier jour de congé', st_span: 'Durée réelle (jours)', st_counted: 'Jours décomptés',
    st_wk: 'Jours de week-end', st_hol: 'Jours fériés',
    hols_in: 'Jours fériés pendant la période :',
    shift_t: 'La reprise est reportée au premier jour ouvrable :',
    shift_row: '{d} — {r}',
    r_wk: 'week-end',
    acc_settings: 'Paramètres du calcul', acc_settings_s: 'Type de jours, week-end, jours fériés',
    acc_types: 'Types de congé', acc_types_s: 'Durées prêtes : annuel, maladie, maternité, exceptionnel',
    acc_reverse: 'Calcul inverse', acc_reverse_s: 'Début + reprise = nombre de jours',
    acc_balance: 'Solde de congé annuel', acc_balance_s: '2,5 jours par mois travaillé, 30 jours par an',
    acc_calendar: 'Calendrier visuel', acc_calendar_s: 'Congé, jours fériés et week-ends en couleurs',
    mode: 'Type de calcul', mode_cal: 'Jours calendaires', mode_work: 'Jours ouvrables',
    weekend: 'Week-end', wk_fs: 'Vendredi–samedi', wk_ss: 'Samedi–dimanche', wk_f: 'Vendredi seul',
    holidays: 'Exclure automatiquement les jours fériés algériens',
    holidays_note: 'Les fêtes religieuses suivent le calendrier hégirien (Umm al-Qura) et peuvent varier d’un jour selon l’observation du croissant en Algérie.',
    hol_year: 'Jours fériés {y}',
    sum_holOn: 'jours fériés exclus', sum_holOff: 'jours fériés non exclus',
    t_annual: 'Annuel', t_sick: 'Maladie', t_mat: 'Maternité', t_marriage: 'Mariage', t_birth: 'Naissance', t_death: 'Décès',
    u_cal: '{n} jours calendaires', u_work: '{n} jours ouvrables',
    n_annual: 'Congé annuel : 30 jours calendaires au maximum (2,5 jours par mois travaillé).',
    n_sick: 'Congé de maladie : durée fixée par le certificat médical — ajustez le nombre de jours.',
    n_mat: 'Congé de maternité : 14 semaines consécutives (98 jours).',
    n_marriage: 'Absence exceptionnelle payée : 3 jours ouvrables pour le mariage du travailleur.',
    n_birth: 'Absence exceptionnelle payée : 3 jours ouvrables pour une naissance.',
    n_death: 'Absence exceptionnelle payée : 3 jours ouvrables pour le décès d’un proche direct.',
    rev_days: 'jours de congé', rev_detail: 'Durée totale : {span} jours calendaires · week-ends : {wk} · fériés : {hol}',
    rev_err: 'La date de reprise doit être après la date de début.',
    months: 'Mois travaillés pendant la période de référence',
    bal_days: 'jours', bal_detail: '{m} mois × 2,5 jours = {r} jours',
    bal_cap: '(plafond : 30 jours)',
    useBal: 'Utiliser ce solde dans le calcul',
    balance_note: 'Loi 90-11 : deux jours et demi par mois de travail, sans dépasser 30 jours calendaires par an. Période de référence : du 1er juillet au 30 juin.',
    lg_leave: 'Jour de congé', lg_hol: 'Jour férié', lg_wk: 'Week-end', lg_ret: 'Jour de reprise',
    cal_empty: 'Saisissez la date et le nombre de jours pour afficher le calendrier.',
    applied: 'Appliqué : {t}', balApplied: 'Solde de {n} jours utilisé',
    reset_done: 'Réinitialisé',
    h_newyear: 'Nouvel An', h_yennayer: 'Yennayer (Nouvel An amazigh)', h_labour: 'Fête du Travail',
    h_indep: 'Fête de l’Indépendance', h_rev: 'Anniversaire de la Révolution', h_hijri: 'Nouvel An hégirien',
    h_ashura: 'Achoura', h_mawlid: 'Mawlid Ennabaoui', h_fitr: 'Aïd el-Fitr', h_adha: 'Aïd el-Adha',
    day_n: 'jour {n}',
    gate_check: 'Vérification…', gate_login: 'Veuillez vous connecter', gate_login_t: 'Cet outil nécessite une connexion depuis la page d’accueil du site.',
    gate_btn: 'Aller à l’accueil', gate_soon: 'Bientôt ✨', gate_soon_t: 'Nous préparons cet outil avec soin ; il sera bientôt disponible.',
    gate_err: 'Impossible de charger l’outil ; rechargez la page.',
    admin: 'Mode admin — outil verrouillé pour les autres utilisateurs'
  },
  en: {
    title: 'Leave Calculator', subtitle: 'Enter the leave start date and number of days to instantly see your return-to-work date.',
    back: 'Back to tools', reset: 'Reset',
    start: 'Leave start date', days: 'Number of leave days', returnDate: 'Return-to-work date',
    empty: 'Pick a start date and number of days to see the result here',
    returnOn: 'Back to work on',
    hint_cal: 'Counted as calendar days', hint_work: 'Counted as working days only',
    st_last: 'Last day of leave', st_span: 'Actual span (days)', st_counted: 'Days counted',
    st_wk: 'Weekend days', st_hol: 'Public holidays',
    hols_in: 'Public holidays in this period:',
    shift_t: 'The return date was moved to the first working day:',
    shift_row: '{d} — {r}',
    r_wk: 'weekend',
    acc_settings: 'Calculation settings', acc_settings_s: 'Day type, weekend, public holidays',
    acc_types: 'Leave types', acc_types_s: 'Ready durations: annual, sick, maternity, special',
    acc_reverse: 'Reverse calculation', acc_reverse_s: 'Start + return date = number of days',
    acc_balance: 'Annual leave balance', acc_balance_s: '2.5 days per month worked, 30 days a year',
    acc_calendar: 'Visual calendar', acc_calendar_s: 'Leave, public holidays and weekends in color',
    mode: 'Calculation type', mode_cal: 'Calendar days', mode_work: 'Working days only',
    weekend: 'Weekend', wk_fs: 'Friday–Saturday', wk_ss: 'Saturday–Sunday', wk_f: 'Friday only',
    holidays: 'Automatically exclude Algerian public holidays',
    holidays_note: 'Religious holidays follow the Hijri (Umm al-Qura) calendar and may differ by one day depending on the moon sighting in Algeria.',
    hol_year: 'Public holidays {y}',
    sum_holOn: 'public holidays excluded', sum_holOff: 'public holidays not excluded',
    t_annual: 'Annual', t_sick: 'Sick', t_mat: 'Maternity', t_marriage: 'Marriage', t_birth: 'Birth', t_death: 'Bereavement',
    u_cal: '{n} calendar days', u_work: '{n} working days',
    n_annual: 'Annual leave: up to 30 calendar days (2.5 days per month worked).',
    n_sick: 'Sick leave: length set by the medical certificate — adjust the number of days.',
    n_mat: 'Maternity leave: 14 consecutive weeks (98 days).',
    n_marriage: 'Paid special leave: 3 working days for the worker’s marriage.',
    n_birth: 'Paid special leave: 3 working days for the birth of a child.',
    n_death: 'Paid special leave: 3 working days for the death of a close relative.',
    rev_days: 'leave days', rev_detail: 'Total span: {span} calendar days · weekends: {wk} · holidays: {hol}',
    rev_err: 'The return date must be after the start date.',
    months: 'Months worked in the reference year',
    bal_days: 'days', bal_detail: '{m} months × 2.5 days = {r} days',
    bal_cap: '(capped at 30 days)',
    useBal: 'Use this balance in the calculation',
    balance_note: 'Law 90-11: two and a half days per month of work, up to 30 calendar days a year. Reference year: July 1 to June 30.',
    lg_leave: 'Leave day', lg_hol: 'Public holiday', lg_wk: 'Weekend', lg_ret: 'Return day',
    cal_empty: 'Enter the date and number of days to show the calendar.',
    applied: 'Applied: {t}', balApplied: 'Using a balance of {n} days',
    reset_done: 'Reset done',
    h_newyear: 'New Year’s Day', h_yennayer: 'Yennayer (Amazigh New Year)', h_labour: 'Labour Day',
    h_indep: 'Independence Day', h_rev: 'Revolution Day', h_hijri: 'Islamic New Year',
    h_ashura: 'Ashura', h_mawlid: 'Mawlid (Prophet’s Birthday)', h_fitr: 'Eid al-Fitr', h_adha: 'Eid al-Adha',
    day_n: 'day {n}',
    gate_check: 'Checking…', gate_login: 'Please sign in', gate_login_t: 'This tool requires signing in from the site home page.',
    gate_btn: 'Go to the home page', gate_soon: 'Coming soon ✨', gate_soon_t: 'We are carefully preparing this tool; it will be available soon.',
    gate_err: 'The tool could not load; reload the page.',
    admin: 'Admin mode — tool is locked for other users'
  }
};
const LOCALE = { ar: 'ar-DZ', fr: 'fr-FR', en: 'en-GB' };

function initialLang() {
  let l = null;
  try { l = localStorage.getItem('lc_lang') || localStorage.getItem('site_lang'); } catch (e) {}
  return I18N[l] ? l : 'ar';
}
const S = {
  lang: initialLang(),
  start: null,       // 'YYYY-MM-DD'
  days: 30,
  mode: 'cal',       // cal | work
  weekend: 'fs',     // fs | ss | f
  holidays: true,
  type: 'annual',
  revStart: null, revEnd: null,
  months: 12,
  open: null,
  gateState: 'check'
};
const T = (k, vars) => {
  let s = I18N[S.lang][k] ?? I18N.en[k] ?? k;
  if (vars) Object.keys(vars).forEach(v => { s = s.split('{' + v + '}').join(vars[v]); });
  return s;
};

/* =====================================================================
   التواريخ (نستعمل منتصف النهار لتفادي مشاكل التوقيت الصيفي)
===================================================================== */
const mk = (y, m, d) => new Date(y, m, d, 12);
const addDays = (d, n) => mk(d.getFullYear(), d.getMonth(), d.getDate() + n);
const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function parse(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  if (!m) return null;
  const d = mk(+m[1], +m[2] - 1, +m[3]);
  return isNaN(d) ? null : d;
}
const dayDiff = (a, b) => Math.round((b - a) / 86400000);

function fmt(d, opts) {
  try { return new Intl.DateTimeFormat(LOCALE[S.lang], opts).format(d); }
  catch (e) { return key(d); }
}
const fmtLong = d => fmt(d, { day: 'numeric', month: 'long', year: 'numeric' });
const fmtFull = d => fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = d => fmt(d, { weekday: 'short', day: 'numeric', month: 'short' });
const weekday = d => fmt(d, { weekday: 'long' });

// التقويم الهجري (أم القرى)
let HIJRI_NUM = null;
try { HIJRI_NUM = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) {}
function hijriParts(d) {
  if (!HIJRI_NUM) return null;
  try {
    const p = {};
    HIJRI_NUM.formatToParts(d).forEach(x => { if (x.type === 'day' || x.type === 'month' || x.type === 'year') p[x.type] = parseInt(x.value, 10); });
    return p.day && p.month ? p : null;
  } catch (e) { return null; }
}
function fmtHijri(d) {
  try {
    const s = new Intl.DateTimeFormat(LOCALE[S.lang] + '-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    return S.lang === 'ar' && !/هـ/.test(s) ? s + ' هـ' : s;
  } catch (e) { return ''; }
}

/* =====================================================================
   العطل الرسمية الجزائرية (القانون 63-278 المعدّل والمتمّم)
===================================================================== */
const FIXED = [[0, 1, 'h_newyear'], [0, 12, 'h_yennayer'], [4, 1, 'h_labour'], [6, 5, 'h_indep'], [10, 1, 'h_rev']];
// [شهر هجري، يوم، المفتاح، رقم اليوم في العيد]
const RELIGIOUS = [[1, 1, 'h_hijri'], [1, 10, 'h_ashura'], [3, 12, 'h_mawlid'],
  [10, 1, 'h_fitr', 1], [10, 2, 'h_fitr', 2], [12, 10, 'h_adha', 1], [12, 11, 'h_adha', 2], [12, 12, 'h_adha', 3]];
const HOL_CACHE = {};
function holidaysOfYear(y) {
  if (HOL_CACHE[y]) return HOL_CACHE[y];
  const map = {};
  FIXED.forEach(([m, d, k]) => { map[key(mk(y, m, d))] = { k, rel: false }; });
  if (HIJRI_NUM) {
    for (let d = mk(y, 0, 1); d.getFullYear() === y; d = addDays(d, 1)) {
      const h = hijriParts(d);
      if (!h) continue;
      const r = RELIGIOUS.find(x => x[0] === h.month && x[1] === h.day);
      if (r && !map[key(d)]) map[key(d)] = { k: r[2], n: r[3], rel: true };
    }
  }
  return (HOL_CACHE[y] = map);
}
function holidayOf(d) { return holidaysOfYear(d.getFullYear())[key(d)] || null; }
function holName(h) { return T(h.k) + (h.n ? ` (${T('day_n', { n: h.n })})` : ''); }

/* =====================================================================
   قواعد الحساب
===================================================================== */
const WEEKENDS = { fs: [5, 6], ss: [6, 0], f: [5] };
const isWeekend = d => WEEKENDS[S.weekend].includes(d.getDay());
const activeHoliday = d => (S.holidays ? holidayOf(d) : null);
// هل يُحتسب هذا اليوم من رصيد العطلة؟
function counts(d) {
  if (activeHoliday(d)) return false;
  if (S.mode === 'work' && isWeekend(d)) return false;
  return true;
}

function forward(start, n) {
  let d = start, counted = 0, last = null, guard = 0;
  const hols = [];
  let wk = 0;
  while (counted < n && guard++ < 3000) {
    const h = activeHoliday(d);
    if (counts(d)) { counted++; last = d; }
    else if (h) hols.push({ d, h });
    if (isWeekend(d)) wk++;
    d = addDays(d, 1);
  }
  if (!last) return null;
  // ترحيل الرجوع إلى أول يوم عمل
  let ret = addDays(last, 1);
  const shifts = [];
  guard = 0;
  while (guard++ < 60) {
    const h = holidayOf(ret);
    const reasons = [];
    if (isWeekend(ret)) reasons.push(T('r_wk'));
    if (h && S.holidays) reasons.push(holName(h));
    if (!reasons.length) break;
    shifts.push({ d: ret, r: reasons.join(' + ') });
    ret = addDays(ret, 1);
  }
  return { start, last, ret, counted, span: dayDiff(start, last) + 1, wk, hols, shifts };
}

function reverse(start, end) {
  let counted = 0, wk = 0, hol = 0;
  for (let d = start; d < end; d = addDays(d, 1)) {
    if (counts(d)) counted++;
    if (isWeekend(d)) wk++;
    if (activeHoliday(d)) hol++;
  }
  return { counted, span: dayDiff(start, end), wk, hol };
}

/* =====================================================================
   أنواع العطل
===================================================================== */
const ICO = {
  annual: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  sick: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/></svg>',
  mat: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M12 14.5l-1.4-1.3a1.2 1.2 0 0 1 1.4-1.9 1.2 1.2 0 0 1 1.4 1.9z"/></svg>',
  marriage: '<svg viewBox="0 0 24 24"><circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10 4l2 3 2-3"/></svg>',
  birth: '<svg viewBox="0 0 24 24"><circle cx="12" cy="11" r="6"/><path d="M9.5 10h.01M14.5 10h.01"/><path d="M10 13.3a2.5 2.5 0 0 0 4 0"/><path d="M12 5c0-1.5 1-2 2-2"/><path d="M8 21h8"/></svg>',
  death: '<svg viewBox="0 0 24 24"><path d="M20 12.5A8.5 8.5 0 1 1 11.5 4a6.5 6.5 0 0 0 8.5 8.5z"/></svg>'
};
const TYPES = [
  { id: 'annual',   days: 30, mode: 'cal',  c: '#2F6FB0', bg: '#E3EFFB' },
  { id: 'sick',     days: 7,  mode: 'cal',  c: '#DC4C64', bg: '#FCE6EA' },
  { id: 'mat',      days: 98, mode: 'cal',  c: '#C2509A', bg: '#F9E5F1' },
  { id: 'marriage', days: 3,  mode: 'work', c: '#D9731A', bg: '#FCEBDD' },
  { id: 'birth',    days: 3,  mode: 'work', c: '#2E8B57', bg: '#E0F4E8' },
  { id: 'death',    days: 3,  mode: 'work', c: '#5B6B7C', bg: '#E9EDF1' }
];
const tName = { annual: 't_annual', sick: 't_sick', mat: 't_mat', marriage: 't_marriage', birth: 't_birth', death: 't_death' };

function buildTypes() {
  $('#typesGrid').innerHTML = TYPES.map(t => `
    <button type="button" class="type" data-type="${t.id}" style="--t-c:${t.c};--t-bg:${t.bg}">
      <span class="t-ico">${ICO[t.id]}</span>
      <b class="tx" data-t="${tName[t.id]}"></b>
      <small class="tx" data-tu="${t.id}"></small>
    </button>`).join('');
}
function renderTypes() {
  TYPES.forEach(t => {
    const el = $(`[data-tu="${t.id}"]`);
    if (el) el.textContent = T(t.mode === 'work' ? 'u_work' : 'u_cal', { n: t.days });
  });
  $$('.type').forEach(b => b.classList.toggle('on', b.dataset.type === S.type));
  $('#typeNote').textContent = S.type ? T('n_' + S.type) : '';
}
function applyType(id) {
  const t = TYPES.find(x => x.id === id);
  if (!t) return;
  S.type = id; S.days = t.days; S.mode = t.mode;
  $('#daysIn').value = t.days;
  toast(T('applied', { t: `${T(tName[id])} · ${T(t.mode === 'work' ? 'u_work' : 'u_cal', { n: t.days })}` }));
  update();
}

/* =====================================================================
   العرض
===================================================================== */
function renderMain() {
  const start = parse(S.start);
  const days = S.days;
  $('#startHijri').textContent = start ? fmtHijri(start) : '';
  $('#modeHint').textContent = T(S.mode === 'work' ? 'hint_work' : 'hint_cal');
  $('#daysIn').classList.toggle('bad', !(days >= 1 && days <= 366) && $('#daysIn').value !== '');
  $('#summaryChip').textContent = `⚙ ${T(S.mode === 'work' ? 'mode_work' : 'mode_cal')} · ${T('wk_' + S.weekend)} · ${T(S.holidays ? 'sum_holOn' : 'sum_holOff')}`;

  const ok = start && days >= 1 && days <= 366;
  const res = ok ? forward(start, days) : null;
  $('#rEmpty').classList.toggle('hidden', !!res);
  $('#rBody').classList.toggle('hidden', !res);
  if (!res) return null;

  $('#rDay').textContent = weekday(res.ret);
  $('#rDate').textContent = fmtLong(res.ret);
  $('#rHijri').textContent = fmtHijri(res.ret);

  const sh = $('#rShift');
  if (res.shifts.length) {
    sh.classList.remove('hidden');
    sh.innerHTML = `<b>${esc(T('shift_t'))}</b>` + res.shifts.map(s => esc(T('shift_row', { d: fmtShort(s.d), r: s.r }))).join('<br>');
  } else sh.classList.add('hidden');

  const holCount = res.hols.length;
  $('#rStats').innerHTML = [
    ['s-last', fmtShort(res.last), T('st_last')],
    ['s-leave', res.span, T('st_span')],
    ['s-leave', res.counted, T('st_counted')],
    ['s-wk', res.wk, T('st_wk')],
    ['s-hol', holCount, T('st_hol')]
  ].map(([c, v, l]) => `<div class="stat ${c}"><b>${esc(String(v))}</b><small>${esc(l)}</small></div>`).join('');

  const rh = $('#rHols');
  if (holCount) {
    rh.classList.remove('hidden');
    rh.innerHTML = `<span class="chip-t">${esc(T('hols_in'))}</span>` + res.hols.map(x => `<span class="chip">${esc(holName(x.h))} · ${esc(fmtShort(x.d))}</span>`).join('');
  } else rh.classList.add('hidden');
  return res;
}

function renderSettings() {
  $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === S.mode));
  $$('#wkSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === S.weekend));
  $('#holChk').checked = S.holidays;
  const start = parse(S.start);
  const y = start ? start.getFullYear() : new Date().getFullYear();
  const list = Object.entries(holidaysOfYear(y)).sort(([a], [b]) => (a < b ? -1 : 1));
  const hl = $('#holList');
  hl.classList.toggle('off', !S.holidays);
  hl.innerHTML = `<div class="opt-label tx" style="grid-column:1/-1">${esc(T('hol_year', { y }))}</div>` +
    list.map(([k, h]) => `<div class="hol tx${h.rel ? ' rel' : ''}"><b>${esc(holName(h))}</b><span>${esc(fmtShort(parse(k)))}</span></div>`).join('');
}

function renderReverse() {
  const a = parse(S.revStart), b = parse(S.revEnd);
  const el = $('#revRes');
  if (!a || !b) { el.innerHTML = ''; return; }
  if (b <= a) { el.innerHTML = `<p class="err">${esc(T('rev_err'))}</p>`; return; }
  const r = reverse(a, b);
  el.innerHTML = `<div class="big">${r.counted} <small>${esc(T('rev_days'))}</small></div>
    <p>${esc(T(S.mode === 'work' ? 'mode_work' : 'mode_cal'))} · ${esc(T('rev_detail', { span: r.span, wk: r.wk, hol: r.hol }))}</p>
    <p>${esc(fmtFull(a))} ${S.lang === 'ar' ? '←' : '→'} ${esc(fmtFull(b))}</p>`;
}

function balanceDays() {
  const m = Math.max(0, Math.min(12, S.months || 0));
  return { m, raw: m * 2.5, days: Math.min(30, m * 2.5) };
}
function renderBalance() {
  const b = balanceDays();
  const num = v => (S.lang === 'en' ? String(v) : String(v).replace('.', ','));
  $('#balRes').innerHTML = `<div class="big">${num(b.days)} <small>${esc(T('bal_days'))}</small></div>
    <p>${esc(T('bal_detail', { m: b.m, r: num(b.raw) }))} ${b.raw > 30 ? esc(T('bal_cap')) : ''}</p>`;
  $('#useBal').disabled = b.days <= 0;
}

function renderCalendar(res) {
  $('#legend').innerHTML = [['lg-leave', 'lg_leave'], ['lg-hol', 'lg_hol'], ['lg-wk', 'lg_wk'], ['lg-ret', 'lg_ret']]
    .map(([c, k]) => `<span><i class="${c}"></i>${esc(T(k))}</span>`).join('');
  const box = $('#months');
  if (!res) { box.innerHTML = `<p class="note-s tx" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${esc(T('cal_empty'))}</p>`; return; }

  const firstDow = S.weekend === 'ss' ? 1 : (S.weekend === 'f' ? 6 : 0); // بداية الأسبوع
  const heads = [];
  for (let i = 0; i < 7; i++) heads.push(fmt(mk(2024, 0, 7 + ((firstDow + i) % 7)), { weekday: 'short' })); // 7 جانفي 2024 = أحد
  const startK = key(res.start), retK = key(res.ret);
  const out = [];
  let y = res.start.getFullYear(), m = res.start.getMonth();
  const endY = res.ret.getFullYear(), endM = res.ret.getMonth();
  let guard = 0;
  while ((y < endY || (y === endY && m <= endM)) && guard++ < 14) {
    const first = mk(y, m, 1);
    const lead = (first.getDay() - firstDow + 7) % 7;
    const dim = new Date(y, m + 1, 0).getDate();
    let cells = heads.map(h => `<div class="wd">${esc(h)}</div>`).join('');
    for (let i = 0; i < lead; i++) cells += '<div class="dc empty"></div>';
    for (let day = 1; day <= dim; day++) {
      const d = mk(y, m, day), k = key(d);
      const inLeave = d >= res.start && d <= res.last;
      const h = holidayOf(d);
      const cls = ['dc'];
      if (isWeekend(d)) cls.push('wk');
      if (inLeave && counts(d)) cls.push('leave');
      if (h && S.holidays) cls.push('hol'); if (h && S.holidays && !inLeave) cls.push('out');
      if (k === retK) cls.push('ret');
      if (k === startK) cls.push('start');
      const hp = hijriParts(d);
      const title = [fmtFull(d), h ? holName(h) : '', fmtHijri(d)].filter(Boolean).join(' · ');
      cells += `<div class="${cls.join(' ')}" title="${esc(title)}">${day}${hp ? `<small>${hp.day}</small>` : ''}</div>`;
    }
    out.push(`<div class="month"><h4 class="tx">${esc(fmt(first, { month: 'long', year: 'numeric' }))}</h4><div class="grid7" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${cells}</div></div>`);
    if (++m > 11) { m = 0; y++; }
  }
  box.innerHTML = out.join('');
}

function update() {
  const res = renderMain();
  renderSettings();
  renderTypes();
  renderReverse();
  renderBalance();
  renderCalendar(res);
  applyDir();
  save();
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* =====================================================================
   اللغة والاتجاه
===================================================================== */
function applyDir() {
  const d = S.lang === 'ar' ? 'rtl' : 'ltr';
  // الهيكل ثابت، النصوص فقط تأخذ اتجاه اللغة
  $$('.tx').forEach(el => el.setAttribute('dir', d));
}
function applyLang() {
  document.documentElement.lang = S.lang;
  $$('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
  $$('[data-t-title]').forEach(el => { el.title = T(el.dataset.tTitle); el.setAttribute('aria-label', T(el.dataset.tTitle)); });
  $$('#langs button').forEach(b => b.classList.toggle('on', b.dataset.l === S.lang));
  document.title = `${T('title')} | Dr Soufiane Merabti`;
  if (S.gateState !== 'open') gate(S.gateState);
  update();
}
function setLang(l) {
  S.lang = l;
  try { localStorage.setItem('lc_lang', l); if (l === 'ar' || l === 'en') localStorage.setItem('site_lang', l); } catch (e) {}
  applyLang();
}

/* =====================================================================
   الأكورديون
===================================================================== */
function openAcc(id, scroll) {
  S.open = S.open === id && !scroll ? null : id;
  $$('.acc').forEach(a => a.classList.toggle('open', a.dataset.acc === S.open));
  if (scroll && S.open) {
    const el = $(`.acc[data-acc="${id}"]`);
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }
  save();
}

/* =====================================================================
   الحفظ
===================================================================== */
function save() {
  try {
    localStorage.setItem('lc_state', JSON.stringify({
      start: S.start, days: S.days, mode: S.mode, weekend: S.weekend, holidays: S.holidays, type: S.type,
      revStart: S.revStart, revEnd: S.revEnd, months: S.months
    }));
  } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('lc_state') || 'null');
    if (!d) return;
    ['start', 'revStart', 'revEnd', 'type'].forEach(k => { if (typeof d[k] === 'string' || d[k] === null) S[k] = d[k]; });
    if (Number.isFinite(d.days)) S.days = d.days;
    if (Number.isFinite(d.months)) S.months = d.months;
    if (d.mode === 'cal' || d.mode === 'work') S.mode = d.mode;
    if (WEEKENDS[d.weekend]) S.weekend = d.weekend;
    if (typeof d.holidays === 'boolean') S.holidays = d.holidays;
  } catch (e) {}
}
function fillInputs() {
  $('#startDate').value = S.start || '';
  $('#daysIn').value = Number.isFinite(S.days) ? S.days : '';
  $('#revStart').value = S.revStart || '';
  $('#revEnd').value = S.revEnd || '';
  $('#monthsIn').value = S.months;
}
function resetAll() {
  try { localStorage.removeItem('lc_state'); } catch (e) {}
  Object.assign(S, { start: key(mk(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())), days: 30, mode: 'cal', weekend: 'fs', holidays: true, type: 'annual', revStart: null, revEnd: null, months: 12 });
  fillInputs();
  update();
  toast(T('reset_done'));
}

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2400);
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
  if (!window.firebase || !firebase.apps || !firebase.apps.length) { gate(TOOL_LOCKED ? 'error' : 'open'); return; }
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
  load();
  if (!S.start) { const n = new Date(); S.start = key(mk(n.getFullYear(), n.getMonth(), n.getDate())); }
  buildTypes();
  fillInputs();

  $('#startDate').addEventListener('input', e => { S.start = e.target.value || null; update(); });
  $('#daysIn').addEventListener('input', e => {
    const v = parseInt(e.target.value, 10);
    S.days = Number.isFinite(v) ? v : NaN;
    S.type = null;
    update();
  });
  $$('[data-step]').forEach(b => b.addEventListener('click', () => {
    const cur = Number.isFinite(S.days) ? S.days : 0;
    S.days = Math.max(1, Math.min(366, cur + +b.dataset.step));
    S.type = null;
    $('#daysIn').value = S.days;
    update();
  }));
  $$('#modeSeg button').forEach(b => b.addEventListener('click', () => { S.mode = b.dataset.v; update(); }));
  $$('#wkSeg button').forEach(b => b.addEventListener('click', () => { S.weekend = b.dataset.v; update(); }));
  $('#holChk').addEventListener('change', e => { S.holidays = e.target.checked; update(); });
  $('#typesGrid').addEventListener('click', e => { const b = e.target.closest('.type'); if (b) applyType(b.dataset.type); });
  $('#revStart').addEventListener('input', e => { S.revStart = e.target.value || null; update(); });
  $('#revEnd').addEventListener('input', e => { S.revEnd = e.target.value || null; update(); });
  $('#monthsIn').addEventListener('input', e => { const v = parseInt(e.target.value, 10); S.months = Number.isFinite(v) ? Math.max(0, Math.min(12, v)) : 0; update(); });
  $$('[data-mstep]').forEach(b => b.addEventListener('click', () => {
    S.months = Math.max(0, Math.min(12, (S.months || 0) + +b.dataset.mstep));
    $('#monthsIn').value = S.months;
    update();
  }));
  $('#useBal').addEventListener('click', () => {
    const b = balanceDays();
    if (b.days <= 0) return;
    // الرصيد قد يحتوي على نصف يوم: نأخذ الجزء الصحيح
    S.days = Math.floor(b.days); S.mode = 'cal'; S.type = 'annual';
    $('#daysIn').value = S.days;
    update();
    toast(T('balApplied', { n: S.days }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $$('.acc-head').forEach(h => h.addEventListener('click', () => openAcc(h.closest('.acc').dataset.acc)));
  $$('[data-open]').forEach(b => b.addEventListener('click', () => openAcc(b.dataset.open, true)));
  $$('#langs button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  $('#resetBtn').addEventListener('click', resetAll);

  applyLang();
  startGate();
}
init();
