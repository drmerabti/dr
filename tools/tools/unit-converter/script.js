/* ==========================================================
   محوّل الوحدات — منطق الأداة
   لإضافة وحدة: أضف سطرًا في units داخل الفئة المناسبة
   f = المعامل للتحويل إلى الوحدة الأساسية للفئة
   ========================================================== */

const CATS = [
  { id:'length', ar:'الطول', en:'Length', def:['m','ft'], units:[
    { id:'m',   ar:'متر',        en:'Meter',          s:'m',   f:1 },
    { id:'km',  ar:'كيلومتر',    en:'Kilometer',      s:'km',  f:1000 },
    { id:'cm',  ar:'سنتيمتر',    en:'Centimeter',     s:'cm',  f:0.01 },
    { id:'mm',  ar:'ملّيمتر',    en:'Millimeter',     s:'mm',  f:0.001 },
    { id:'um',  ar:'ميكرومتر',   en:'Micrometer',     s:'µm',  f:1e-6 },
    { id:'nm',  ar:'نانومتر',    en:'Nanometer',      s:'nm',  f:1e-9 },
    { id:'mi',  ar:'ميل',        en:'Mile',           s:'mi',  f:1609.344 },
    { id:'yd',  ar:'ياردة',      en:'Yard',           s:'yd',  f:0.9144 },
    { id:'ft',  ar:'قدم',        en:'Foot',           s:'ft',  f:0.3048 },
    { id:'in',  ar:'إنش',        en:'Inch',           s:'in',  f:0.0254 },
    { id:'nmi', ar:'ميل بحري',   en:'Nautical mile',  s:'nmi', f:1852 }
  ]},
  { id:'mass', ar:'الوزن', en:'Mass', def:['kg','lb'], units:[
    { id:'kg', ar:'كيلوغرام', en:'Kilogram', s:'kg', f:1 },
    { id:'g',  ar:'غرام',     en:'Gram',     s:'g',  f:0.001 },
    { id:'mg', ar:'ملّيغرام', en:'Milligram',s:'mg', f:1e-6 },
    { id:'t',  ar:'طن',       en:'Tonne',    s:'t',  f:1000 },
    { id:'q',  ar:'قنطار',    en:'Quintal',  s:'q',  f:100 },
    { id:'lb', ar:'رطل',      en:'Pound',    s:'lb', f:0.45359237 },
    { id:'oz', ar:'أونصة',    en:'Ounce',    s:'oz', f:0.028349523125 }
  ]},
  { id:'temp', ar:'الحرارة', en:'Temperature', def:['C','F'], units:[
    { id:'C', ar:'سيلسيوس',   en:'Celsius',    s:'°C', to:v=>v+273.15,             from:k=>k-273.15 },
    { id:'F', ar:'فهرنهايت',  en:'Fahrenheit', s:'°F', to:v=>(v-32)*5/9+273.15,   from:k=>(k-273.15)*9/5+32 },
    { id:'K', ar:'كلفن',      en:'Kelvin',     s:'K',  to:v=>v,                    from:k=>k }
  ]},
  { id:'area', ar:'المساحة', en:'Area', def:['m2','ft2'], units:[
    { id:'m2',  ar:'متر مربع',      en:'Square meter',     s:'m²',  f:1 },
    { id:'km2', ar:'كيلومتر مربع',  en:'Square kilometer', s:'km²', f:1e6 },
    { id:'cm2', ar:'سنتيمتر مربع',  en:'Square centimeter',s:'cm²', f:1e-4 },
    { id:'ha',  ar:'هكتار',         en:'Hectare',          s:'ha',  f:1e4 },
    { id:'ac',  ar:'أكر',           en:'Acre',             s:'ac',  f:4046.8564224 },
    { id:'ft2', ar:'قدم مربع',      en:'Square foot',      s:'ft²', f:0.09290304 },
    { id:'in2', ar:'إنش مربع',      en:'Square inch',      s:'in²', f:6.4516e-4 },
    { id:'yd2', ar:'ياردة مربعة',   en:'Square yard',      s:'yd²', f:0.83612736 },
    { id:'mi2', ar:'ميل مربع',      en:'Square mile',      s:'mi²', f:2589988.110336 }
  ]},
  { id:'volume', ar:'الحجم', en:'Volume', def:['L','galUS'], units:[
    { id:'m3',    ar:'متر مكعب',       en:'Cubic meter',     s:'m³',    f:1 },
    { id:'L',     ar:'لتر',            en:'Liter',           s:'L',     f:0.001 },
    { id:'mL',    ar:'ملّيلتر',        en:'Milliliter',      s:'mL',    f:1e-6 },
    { id:'cm3',   ar:'سنتيمتر مكعب',   en:'Cubic centimeter',s:'cm³',   f:1e-6 },
    { id:'galUS', ar:'غالون أمريكي',   en:'US gallon',       s:'gal US',f:0.003785411784 },
    { id:'galUK', ar:'غالون بريطاني',  en:'UK gallon',       s:'gal UK',f:0.00454609 },
    { id:'qt',    ar:'كوارت',          en:'US quart',        s:'qt',    f:0.000946352946 },
    { id:'pt',    ar:'باينت',          en:'US pint',         s:'pt',    f:0.000473176473 },
    { id:'cup',   ar:'كوب',            en:'US cup',          s:'cup',   f:0.0002365882365 },
    { id:'floz',  ar:'أونصة سائلة',    en:'US fluid ounce',  s:'fl oz', f:2.95735295625e-5 },
    { id:'ft3',   ar:'قدم مكعب',       en:'Cubic foot',      s:'ft³',   f:0.028316846592 },
    { id:'in3',   ar:'إنش مكعب',       en:'Cubic inch',      s:'in³',   f:1.6387064e-5 },
    { id:'bbl',   ar:'برميل نفط',      en:'Oil barrel',      s:'bbl',   f:0.158987294928 }
  ]},
  { id:'speed', ar:'السرعة', en:'Speed', def:['kmh','mph'], units:[
    { id:'ms',   ar:'متر/ثانية',  en:'Meter/second',  s:'m/s',  f:1 },
    { id:'kmh',  ar:'كم/ساعة',    en:'Kilometer/hour',s:'km/h', f:1/3.6 },
    { id:'mph',  ar:'ميل/ساعة',   en:'Mile/hour',     s:'mph',  f:0.44704 },
    { id:'kn',   ar:'عقدة',       en:'Knot',          s:'kn',   f:1852/3600 },
    { id:'fts',  ar:'قدم/ثانية',  en:'Foot/second',   s:'ft/s', f:0.3048 },
    { id:'mach', ar:'ماخ',        en:'Mach',          s:'Ma',   f:340.29 }
  ]},
  { id:'pressure', ar:'الضغط', en:'Pressure', def:['bar','psi'], units:[
    { id:'Pa',    ar:'باسكال',        en:'Pascal',            s:'Pa',     f:1 },
    { id:'kPa',   ar:'كيلوباسكال',    en:'Kilopascal',        s:'kPa',    f:1e3 },
    { id:'MPa',   ar:'ميغاباسكال',    en:'Megapascal',        s:'MPa',    f:1e6 },
    { id:'bar',   ar:'بار',           en:'Bar',               s:'bar',    f:1e5 },
    { id:'mbar',  ar:'ميلي بار',      en:'Millibar',          s:'mbar',   f:100 },
    { id:'atm',   ar:'ضغط جوي',       en:'Atmosphere',        s:'atm',    f:101325 },
    { id:'psi',   ar:'باوند/إنش²',    en:'PSI',               s:'psi',    f:6894.757293168 },
    { id:'mmHg',  ar:'ملم زئبق',      en:'mmHg',              s:'mmHg',   f:133.322387415 },
    { id:'kgfcm2',ar:'كغ‑ق/سم²',      en:'Kilogram-force/cm²',s:'kgf/cm²',f:98066.5 }
  ]},
  { id:'energy', ar:'الطاقة', en:'Energy', def:['kWh','MJ'], units:[
    { id:'J',    ar:'جول',              en:'Joule',           s:'J',    f:1 },
    { id:'kJ',   ar:'كيلوجول',          en:'Kilojoule',       s:'kJ',   f:1e3 },
    { id:'MJ',   ar:'ميغاجول',          en:'Megajoule',       s:'MJ',   f:1e6 },
    { id:'GJ',   ar:'غيغاجول',          en:'Gigajoule',       s:'GJ',   f:1e9 },
    { id:'Wh',   ar:'واط‑ساعة',         en:'Watt-hour',       s:'Wh',   f:3600 },
    { id:'kWh',  ar:'كيلوواط‑ساعة',     en:'Kilowatt-hour',   s:'kWh',  f:3.6e6 },
    { id:'cal',  ar:'سعرة حرارية',      en:'Calorie',         s:'cal',  f:4.184 },
    { id:'kcal', ar:'كيلو سعرة',        en:'Kilocalorie',     s:'kcal', f:4184 },
    { id:'BTU',  ar:'وحدة حرارية بريطانية', en:'BTU',         s:'BTU',  f:1055.05585262 }
  ]},
  { id:'power', ar:'القدرة', en:'Power', def:['kW','HP'], units:[
    { id:'W',    ar:'واط',            en:'Watt',              s:'W',     f:1 },
    { id:'kW',   ar:'كيلوواط',        en:'Kilowatt',          s:'kW',    f:1e3 },
    { id:'MW',   ar:'ميغاواط',        en:'Megawatt',          s:'MW',    f:1e6 },
    { id:'HP',   ar:'حصان (HP)',      en:'Horsepower (HP)',   s:'HP',    f:745.69987158227 },
    { id:'PS',   ar:'حصان متري (PS)', en:'Metric horsepower', s:'PS',    f:735.49875 },
    { id:'BTUh', ar:'BTU/ساعة',       en:'BTU/hour',          s:'BTU/h', f:0.29307107017 },
    { id:'kcalh',ar:'كيلو سعرة/ساعة', en:'kcal/hour',         s:'kcal/h',f:1.16222222222 }
  ]},
  { id:'time', ar:'الزمن', en:'Time', def:['h','min'], units:[
    { id:'s',   ar:'ثانية',       en:'Second',      s:'s',    f:1 },
    { id:'ms',  ar:'ملّي ثانية',  en:'Millisecond', s:'ms',   f:0.001 },
    { id:'min', ar:'دقيقة',       en:'Minute',      s:'min',  f:60 },
    { id:'h',   ar:'ساعة',        en:'Hour',        s:'h',    f:3600 },
    { id:'d',   ar:'يوم',         en:'Day',         s:'d',    f:86400 },
    { id:'wk',  ar:'أسبوع',       en:'Week',        s:'wk',   f:604800 },
    { id:'mo',  ar:'شهر',         en:'Month',       s:'mo',   f:2629800 },
    { id:'yr',  ar:'سنة',         en:'Year',        s:'yr',   f:31557600 }
  ]},
  { id:'data', ar:'البيانات', en:'Data', def:['GB','MB'], units:[
    { id:'bit', ar:'بت',        en:'Bit',      s:'bit', f:1 },
    { id:'B',   ar:'بايت',      en:'Byte',     s:'B',   f:8 },
    { id:'KB',  ar:'كيلوبايت',  en:'Kilobyte', s:'KB',  f:8*Math.pow(2,10) },
    { id:'MB',  ar:'ميغابايت',  en:'Megabyte', s:'MB',  f:8*Math.pow(2,20) },
    { id:'GB',  ar:'غيغابايت',  en:'Gigabyte', s:'GB',  f:8*Math.pow(2,30) },
    { id:'TB',  ar:'تيرابايت',  en:'Terabyte', s:'TB',  f:8*Math.pow(2,40) }
  ]},
  { id:'force', ar:'القوة', en:'Force', def:['N','kgf'], units:[
    { id:'N',   ar:'نيوتن',            en:'Newton',          s:'N',   f:1 },
    { id:'kN',  ar:'كيلونيوتن',        en:'Kilonewton',      s:'kN',  f:1000 },
    { id:'kgf', ar:'كيلوغرام‑قوة',     en:'Kilogram-force',  s:'kgf', f:9.80665 },
    { id:'lbf', ar:'رطل‑قوة',          en:'Pound-force',     s:'lbf', f:4.4482216152605 },
    { id:'dyn', ar:'داين',             en:'Dyne',            s:'dyn', f:1e-5 }
  ]},
  { id:'angle', ar:'الزاوية', en:'Angle', def:['deg','rad'], units:[
    { id:'deg',  ar:'درجة',         en:'Degree',     s:'°',    f:Math.PI/180 },
    { id:'rad',  ar:'راديان',       en:'Radian',     s:'rad',  f:1 },
    { id:'grad', ar:'غراد',         en:'Gradian',    s:'grad', f:Math.PI/200 },
    { id:'amin', ar:'دقيقة قوسية',  en:'Arcminute',  s:'′',    f:Math.PI/10800 },
    { id:'asec', ar:'ثانية قوسية',  en:'Arcsecond',  s:'″',    f:Math.PI/648000 },
    { id:'turn', ar:'دورة كاملة',   en:'Turn',       s:'turn', f:2*Math.PI }
  ]}
];

const I18N = {
  ar:{
    title:'محوّل الوحدات',
    sub:'حوّل بين الوحدات بسرعة ودقة — النتيجة تظهر فور الكتابة.',
    from:'من', to:'إلى', all:'كل التحويلات', hint:'اضغط على أي نتيجة لنسخها',
    copied:'تم النسخ', invalid:'أدخل رقمًا صحيحًا',
    copy:'نسخ النتيجة', reset:'إعادة ضبط', swap:'تبديل الوحدتين', langBtn:'EN'
  },
  en:{
    title:'Unit Converter',
    sub:'Convert between units quickly and accurately — results update as you type.',
    from:'From', to:'To', all:'All conversions', hint:'Click any result to copy it',
    copied:'Copied', invalid:'Enter a valid number',
    copy:'Copy result', reset:'Reset', swap:'Swap units', langBtn:'AR'
  }
};

/* ---------------- الحالة ---------------- */
const state = {
  lang: localStorage.getItem('site_lang') || 'ar',
  cat: CATS[0],
  from: null,
  to: null
};
if (!I18N[state.lang]) state.lang = 'ar';

const $ = id => document.getElementById(id);
const el = {
  title:$('ucTitle'), sub:$('ucSub'), cats:$('ucCats'),
  input:$('ucIn'), out:$('ucOut'), from:$('ucFrom'), to:$('ucTo'),
  fromLbl:$('ucFromLbl'), toLbl:$('ucToLbl'),
  swap:$('ucSwap'), copy:$('ucCopy'), reset:$('ucReset'), lang:$('ucLang'),
  formula:$('ucFormula'), allTitle:$('ucAllTitle'), hint:$('ucHint'),
  grid:$('ucGrid'), toast:$('ucToast')
};

const T = k => I18N[state.lang][k];
const uName = u => u[state.lang];
const unitById = (cat, id) => cat.units.find(u => u.id === id);

/* ---------------- الحساب ---------------- */
function convert(v, from, to){
  const base = from.to ? from.to(v) : v * from.f;
  return to.from ? to.from(base) : base / to.f;
}

function parseInput(str){
  let s = String(str).trim()
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٫,]/g, '.')
    .replace(/[٬\s]/g, '');
  if (s === '' || s === '-' || s === '+' || s === '.') return NaN;
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

function fmt(n){
  if (!isFinite(n)) return '—';
  if (n === 0) return '0';
  const a = Math.abs(n);
  if (a >= 1e15 || a < 1e-6){
    let [m, e] = n.toExponential(6).split('e');
    m = m.replace(/\.?0+$/, '');
    return m + 'e' + e.replace('+', '');
  }
  return Number(n.toPrecision(12)).toLocaleString('en-US', { maximumFractionDigits: 12 });
}

function rawText(n){
  if (!isFinite(n)) return '';
  return String(Number(n.toPrecision(12)));
}

/* ---------------- العرض ---------------- */
function buildCats(){
  el.cats.innerHTML = '';
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'uc-cat' + (c === state.cat ? ' active' : '');
    b.setAttribute('role', 'tab');
    b.textContent = c[state.lang];
    b.addEventListener('click', () => setCategory(c));
    el.cats.appendChild(b);
  });
}

function buildSelects(){
  [el.from, el.to].forEach(sel => {
    sel.innerHTML = '';
    state.cat.units.forEach(u => {
      const o = document.createElement('option');
      o.value = u.id;
      o.textContent = uName(u) + '  (' + u.s + ')';
      sel.appendChild(o);
    });
  });
  el.from.value = state.from.id;
  el.to.value = state.to.id;
}

function currentValue(){ return parseInput(el.input.value); }
let lastResult = NaN;

function update(){
  const v = currentValue();
  const valid = !isNaN(v);

  // النتيجة الرئيسية
  lastResult = valid ? convert(v, state.from, state.to) : NaN;
  el.out.textContent = valid ? fmt(lastResult) : '—';

  // سطر المعادلة
  const one = convert(1, state.from, state.to);
  el.formula.textContent = '1 ' + state.from.s + '  =  ' + fmt(one) + ' ' + state.to.s;

  // شبكة كل التحويلات
  el.grid.innerHTML = '';
  state.cat.units.forEach(u => {
    if (u.id === state.from.id) return;
    const r = valid ? convert(v, state.from, u) : NaN;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'uc-item' + (u.id === state.to.id ? ' target' : '');
    const n = document.createElement('span'); n.className = 'uc-item-name'; n.textContent = uName(u);
    const val = document.createElement('span'); val.className = 'uc-item-val'; val.textContent = valid ? fmt(r) : '—';
    const s = document.createElement('span'); s.className = 'uc-item-sym'; s.textContent = u.s;
    b.append(n, val, s);
    b.addEventListener('click', () => { if (valid) copyText(rawText(r)); });
    el.grid.appendChild(b);
  });
}

function applyLang(){
  const html = document.documentElement;
  html.lang = state.lang;
  html.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  document.title = T('title') + ' | Dr Soufiane Merabti';
  el.title.textContent = T('title');
  el.sub.textContent = T('sub');
  el.fromLbl.textContent = T('from');
  el.toLbl.textContent = T('to');
  el.allTitle.textContent = T('all');
  el.hint.textContent = T('hint');
  el.lang.textContent = T('langBtn');
  el.copy.title = el.copy.ariaLabel = T('copy');
  el.reset.title = el.reset.ariaLabel = T('reset');
  el.swap.title = el.swap.ariaLabel = T('swap');
  buildCats();
  buildSelects();
  update();
}

/* ---------------- التفاعل ---------------- */
function setCategory(c){
  state.cat = c;
  state.from = unitById(c, c.def[0]);
  state.to = unitById(c, c.def[1]);
  buildCats();
  buildSelects();
  update();
}

function resetAll(){
  el.input.value = '1';
  setCategory(state.cat);
}

let toastTimer;
function toast(msg){
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1600);
}

function copyText(text){
  if (!text) { toast(T('invalid')); return; }
  const done = () => toast(T('copied') + ': ' + text);
  if (navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done){
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (e) {}
  document.body.removeChild(ta);
}

el.input.addEventListener('input', update);
el.input.addEventListener('focus', () => el.input.select());
el.from.addEventListener('change', () => { state.from = unitById(state.cat, el.from.value); update(); });
el.to.addEventListener('change',   () => { state.to   = unitById(state.cat, el.to.value);   update(); });
el.swap.addEventListener('click', () => {
  [state.from, state.to] = [state.to, state.from];
  el.from.value = state.from.id;
  el.to.value = state.to.id;
  update();
});
el.copy.addEventListener('click', () => copyText(rawText(lastResult)));
el.out.addEventListener('click', () => copyText(rawText(lastResult)));
el.out.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyText(rawText(lastResult)); } });
el.reset.addEventListener('click', resetAll);
el.lang.addEventListener('click', () => {
  state.lang = state.lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('site_lang', state.lang);
  applyLang();
});

/* ---------------- البداية ---------------- */
state.from = unitById(state.cat, state.cat.def[0]);
state.to   = unitById(state.cat, state.cat.def[1]);
applyLang();
