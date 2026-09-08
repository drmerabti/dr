/* =====================================================================
   تدريب البكالوريا — أكاديمية مرابطي
   لعبة أسئلة بنظام مراحل + أرواح + وقت، مع حفظ التقدم بالحساب (Firestore)
===================================================================== */

const $ = (id) => document.getElementById(id);

/* ============ أيقونات SVG بنمط الموقع (تدرّج + ظل + انعكاس) ============ */
const SVG = {
  heartFilled: (color1, color2) => `
    <svg viewBox="0 0 48 48"><defs><linearGradient id="g${Math.random()}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${color1}"/><stop offset="1" stop-color="${color2}"/></linearGradient></defs>
    <path d="M24 39s-15-9.4-15-19.6C9 12.7 13 9 18 9c2.7 0 5 1.3 6 3.4C25 10.3 27.3 9 30 9c5 0 9 3.7 9 10.4C39 29.6 24 39 24 39z" fill="url(#g0)"/></svg>`,
  star: (filled) => filled
    ? `<svg viewBox="0 0 48 48"><defs><linearGradient id="gs${Math.random()}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset="1" stop-color="#E0A020"/></linearGradient></defs>
       <path d="M24 6l5.4 11 12.1 1.8-8.8 8.5 2 12.1L24 33.6 13.3 39.4l2-12.1-8.8-8.5L18.6 17z" fill="url(#gs1)"/></svg>`
    : `<svg viewBox="0 0 48 48"><path d="M24 6l5.4 11 12.1 1.8-8.8 8.5 2 12.1L24 33.6 13.3 39.4l2-12.1-8.8-8.5L18.6 17z" fill="#E7ECEF"/></svg>`,
  trophy: `<svg viewBox="0 0 48 48"><defs><linearGradient id="gt1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0C56B"/><stop offset="1" stop-color="#B8860B"/></linearGradient></defs>
    <path d="M14 8h20v11c0 6-4.5 10-10 10s-10-4-10-10V8z" fill="url(#gt1)"/>
    <path d="M14 10H8v4c0 4 3 6.5 6 6.8" fill="none" stroke="url(#gt1)" stroke-width="2.4"/>
    <path d="M34 10h6v4c0 4-3 6.5-6 6.8" fill="none" stroke="url(#gt1)" stroke-width="2.4"/>
    <rect x="20" y="29" width="8" height="6" fill="#B8860B"/><path d="M15 38h18l-2 4H17z" fill="#B8860B"/></svg>`,
  lock: `<svg viewBox="0 0 48 48"><defs><linearGradient id="gl1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9CEDA"/><stop offset="1" stop-color="#7A8FA0"/></linearGradient></defs>
    <rect x="12" y="21" width="24" height="18" rx="4" fill="url(#gl1)"/>
    <path d="M17 21v-5a7 7 0 0 1 14 0v5" fill="none" stroke="url(#gl1)" stroke-width="3.4"/>
    <circle cx="24" cy="29" r="3" fill="#fff" opacity=".9"/><rect x="23" y="29" width="2" height="5" fill="#fff" opacity=".9"/></svg>`,
  check: `<svg viewBox="0 0 48 48"><defs><linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DD6C3"/><stop offset="1" stop-color="#1A8A72"/></linearGradient></defs>
    <circle cx="24" cy="24" r="17" fill="url(#gc1)"/><path d="M15 24l6 6 12-12" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  play: (c1, c2) => `<svg viewBox="0 0 48 48"><defs><linearGradient id="gp${Math.random()}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <circle cx="24" cy="24" r="18" fill="url(#gp0)"/><path d="M19 15l14 9-14 9z" fill="#fff"/></svg>`,
  math: `<svg viewBox="0 0 48 48"><defs><linearGradient id="gm1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CEBB2"/><stop offset="1" stop-color="#2E8A5B"/></linearGradient></defs>
    <circle cx="24" cy="24" r="19" fill="url(#gm1)"/><text x="24" y="31" text-anchor="middle" font-family="Tajawal,sans-serif" font-size="17" font-weight="900" fill="#fff">∑</text></svg>`,
  soon: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#E7ECEF"/><text x="24" y="30" text-anchor="middle" font-family="Tajawal,sans-serif" font-size="13" font-weight="800" fill="#9AA7B0">قريبًا</text></svg>`,
};

/* ============ بنك الأسئلة ============ */
const STAGES_MATH = [
  {
    id: 'limits', title: 'النهايات والاتصال', color: '#378ADD', colorDark: '#185FA5',
    questions: [
      { type:'mcq', prompt:'نهاية f(x)=3x²-5x+1 عند x→+∞', options:['+∞','-∞','0','3'], correct:0 },
      { type:'mcq', prompt:'نهاية f(x)=-2x³+x عند x→+∞', options:['+∞','-∞','0','-2'], correct:1 },
      { type:'mcq', prompt:'نهاية (x²-4)/(x-2) عند x→2', options:['0','4','غير معرّفة','+∞'], correct:1 },
      { type:'mcq', prompt:'نهاية (x²-1)/(x-1) عند x→1', options:['2','0','غير معرّفة','+∞'], correct:0 },
      { type:'mcq', prompt:'الشكل ∞-∞ يُعتبر', options:['محدد','مبهم','يساوي صفر دائمًا','يساوي ∞ دائمًا'], correct:1 },
      { type:'mcq', prompt:'نهاية (2x²+1)/(x²-3) عند x→+∞', options:['0','2','+∞','1'], correct:1 },
      { type:'mcq', prompt:'نهاية (3x+1)/(x²+2) عند x→+∞', options:['3','0','+∞','1/2'], correct:1 },
      { type:'mcq', prompt:'نهاية (x³+1)/(x+1) عند x→-1', options:['3','0','غير معرّفة','-1'], correct:0 },
      { type:'mcq', prompt:'إذا كانت lim(x→a)f(x)=f(a) فإن f', options:['متزايدة عند a','متصلة عند a','قابلة للاشتقاق عند a','دورية'], correct:1 },
      { type:'mcq', prompt:'نظرية القيم المتوسطة تُستعمل لإثبات', options:['اتصال الدالة','وجود حل لمعادلة f(x)=0','اشتقاق الدالة','دورية الدالة'], correct:1 },
      { type:'fill', prompt:'نهاية sin(x)/x عند x→0 تساوي ___', answers:['1'] },
      { type:'fill', prompt:'إذا كانت lim(x→+∞)f(x)=l فإن المستقيم y=___ يسمى مقاربًا أفقيًا', answers:['l'] },
      { type:'mcq', prompt:'f(x)=1/(x-3) لها مقارب شاقولي معادلته', options:['x=3','y=3','x=0','y=0'], correct:0 },
      { type:'mcq', prompt:'lim f=5، lim g=-3 عند نفس النقطة، فإن lim(f+g)', options:['2','-15','8','غير معرّفة'], correct:0 },
      { type:'mcq', prompt:'بنفس المعطيات، lim(f×g)', options:['2','-15','8','-8'], correct:1 },
      { type:'mcq', prompt:'نهاية √(x²+1)-x عند x→+∞', options:['+∞','0','1','-∞'], correct:1 },
      { type:'match', prompt:'طابق كل حالة بنوع المقارب المناسب', pairs:[
        { left:'نهاية محدودة عند ∞', right:'مقارب أفقي' },
        { left:'نهاية غير محدودة عند نقطة', right:'مقارب شاقولي' },
        { left:'[f(x)-(ax+b)]→0', right:'مقارب مائل' },
      ]},
      { type:'mcq', prompt:'f(x)=x+1/x لها عند +∞ مقارب مائل معادلته', options:['y=x','y=x+1','y=1/x','x=0'], correct:0 },
      { type:'mcq', prompt:'كل دالة كثيرة حدود هي', options:['متصلة على ℝ','غير متصلة ببعض النقاط','دورية','زوجية دائمًا'], correct:0 },
      { type:'mcq', prompt:'نهاية (√x-2)/(x-4) عند x→4', options:['1/4','0','غير معرّفة','4'], correct:0 },
      { type:'mcq', prompt:'عدم اتصال f عند a يعني', options:['f غير معرّفة عند a أو نهايتها لا تساوي f(a)','f متزايدة','f سالبة','f غير موجودة أصلاً'], correct:0 },
      { type:'mcq', prompt:'نهاية (x²-9)/(x+3) عند x→-3', options:['-6','0','6','غير معرّفة'], correct:0 },
      { type:'mcq', prompt:'نهاية 1/x² عند x→0', options:['0','+∞','-∞','غير موجودة'], correct:1 },
      { type:'mcq', prompt:'نهاية 1/x عند x→0⁺', options:['+∞','-∞','0','1'], correct:0 },
      { type:'mcq', prompt:'نهاية 1/x عند x→0⁻', options:['+∞','-∞','0','-1'], correct:1 },
      { type:'fill', prompt:'لو النهاية من اليمين ≠ النهاية من اليسار عند a، فالنهاية عند a تكون ___', answers:['غير موجودة'] },
      { type:'mcq', prompt:'نهاية دالة ناطقة عند ±∞ تُحسب اعتمادًا على', options:['الحد الأعلى درجة في البسط والمقام فقط','الحد الثابت فقط','كل الحدود بنفس الوزن','لا توجد طريقة عامة'], correct:0 },
      { type:'mcq', prompt:'f(x)=√(x-1) متصلة على', options:['[1,+∞[',']-∞,1]','ℝ',']1,+∞['], correct:0 },
      { type:'mcq', prompt:'نهاية (x³-8)/(x-2) عند x→2', options:['12','0','غير معرّفة','8'], correct:0 },
      { type:'mcq', prompt:'وفق TVI، لو f متصلة على [a,b] وf(a),f(b) مختلفتا الإشارة', options:['يوجد حل واحد على الأقل لـf(x)=0 في ]a,b[','لا يوجد حل','الحل وحيد بالضرورة','f متزايدة بالضرورة'], correct:0 },
    ],
  },
  {
    id: 'functions', title: 'الدوال العددية والدراسة', color: '#F0C56B', colorDark: '#B8860B',
    questions: [
      { type:'mcq', prompt:'مجال تعريف f(x)=1/(x-2)', options:['ℝ','ℝ-{2}',']2,+∞[',']-∞,2['], correct:1 },
      { type:'mcq', prompt:'مجال تعريف f(x)=√(x-3)', options:['ℝ','[3,+∞[',']-∞,3]','ℝ-{3}'], correct:1 },
      { type:'mcq', prompt:'مجال تعريف f(x)=1/√(x-1)', options:['[1,+∞[',']1,+∞[','ℝ-{1}',']-∞,1['], correct:1 },
      { type:'mcq', prompt:'الدالة f(x)=x² هي', options:['فردية','زوجية','لا زوجية ولا فردية','دورية'], correct:1 },
      { type:'mcq', prompt:'الدالة f(x)=x³ هي', options:['زوجية','فردية','لا زوجية ولا فردية','ثابتة'], correct:1 },
      { type:'mcq', prompt:'شرط الدالة الزوجية', options:['f(-x)=f(x)','f(-x)=-f(x)','f(x)=x','f(0)=0'], correct:0 },
      { type:'mcq', prompt:'شرط الدالة الفردية', options:['f(-x)=f(x)','f(-x)=-f(x)','f(x)=-x','f(1)=1'], correct:1 },
      { type:'mcq', prompt:'منحنى الدالة الزوجية متناظر بالنسبة إلى', options:['المبدأ','محور التراتيب (Oy)','محور الفواصل (Ox)','المستقيم y=x'], correct:1 },
      { type:'mcq', prompt:'منحنى الدالة الفردية متناظر بالنسبة إلى', options:['محور التراتيب','المبدأ','محور الفواصل','المستقيم y=-x'], correct:1 },
      { type:'mcq', prompt:'إذا كانت f متزايدة على I، وa,b∈I مع a<b فإن', options:['f(a)<f(b)','f(a)>f(b)','f(a)=f(b)','لا علاقة'], correct:0 },
      { type:'mcq', prompt:'إذا كانت f متناقصة على I وa<b فإن', options:['f(a)<f(b)','f(a)>f(b)','f(a)=f(b)','لا شيء مما ذكر'], correct:1 },
      { type:'fill', prompt:'لإيجاد اتجاه تغيّر دالة، نشتقها ثم ندرس إشارة ___', answers:['المشتقة'] },
      { type:'mcq', prompt:"عند نقطة حرجة f'(x₀)=0 مع تغيّر إشارة f'، فإن f لها عندها", options:['نهاية عظمى أو صغرى محلية','مستقيم مقارب','عدم اتصال','لا شيء'], correct:0 },
      { type:'mcq', prompt:'الدالة f(x)=ax+b (a≠0) تسمى دالة', options:['خطية','تآلفية','تربيعية','جذرية'], correct:1 },
      { type:'mcq', prompt:'منحنى الدالة التآلفية f(x)=ax+b هو', options:['قطع مكافئ','مستقيم','دائرة','قطع زائد'], correct:1 },
      { type:'mcq', prompt:'منحنى الدالة التربيعية f(x)=ax²+bx+c هو', options:['مستقيم','قطع مكافئ','دائرة','قطع زائد'], correct:1 },
      { type:'mcq', prompt:'فاصلة رأس القطع المكافئ لـ f(x)=ax²+bx+c', options:['-b/2a','b/2a','-b/a','c/a'], correct:0 },
      { type:'mcq', prompt:'(f∘g)(x) تعني', options:['f(x)×g(x)','f(g(x))','g(f(x))','f(x)+g(x)'], correct:1 },
      { type:'mcq', prompt:'إذا f(x)=x+1 وg(x)=x² فإن (f∘g)(2)', options:['5','9','4','3'], correct:0 },
      { type:'mcq', prompt:'بنفس المعطيات، (g∘f)(2)', options:['5','9','4','3'], correct:1 },
      { type:'mcq', prompt:'مجال تعريف f(x)=|x|', options:['ℝ','ℝ+','ℝ-',']0,+∞['], correct:0 },
      { type:'mcq', prompt:'الدالة f(x)=|x| هي', options:['فردية','زوجية','تآلفية','دورية'], correct:1 },
      { type:'match', prompt:'طابق كل خاصية بنوعها', pairs:[
        { left:'f(-x)=f(x)', right:'زوجية' },
        { left:'f(-x)=-f(x)', right:'فردية' },
        { left:"f'(x)>0", right:'متزايدة' },
        { left:"f'(x)<0", right:'متناقصة' },
      ]},
      { type:'mcq', prompt:'مجال تعريف f(x)=√(4-x²)', options:['[-2,2]',']-2,2[','ℝ',']-∞,-2]∪[2,+∞['], correct:0 },
      { type:'fill', prompt:'القيمة العظمى للدالة f(x)=-x²+4x-1 تتحقق عند x= ___', answers:['2'] },
      { type:'mcq', prompt:'مشتقة الدالة الثابتة f(x)=k', options:['1','0','k','غير معرّفة'], correct:1 },
      { type:'mcq', prompt:'نقطة تقاطع منحنى f مع محور الفواصل تحقق', options:['f(x)=0','x=0','f(0)=x','f(x)=x'], correct:0 },
    ],
  },
  {
    id: 'derivative', title: 'الاشتقاق', color: '#2E8A5B', colorDark: '#1E5E3D',
    questions: [
      { type:'mcq', prompt:'مشتقة f(x)=xⁿ', options:['n·x^(n-1)','x^(n-1)','n·xⁿ','xⁿ/n'], correct:0 },
      { type:'mcq', prompt:'مشتقة f(x)=c (ثابت)', options:['0','c','1','غير معرّفة'], correct:0 },
      { type:'mcq', prompt:'مشتقة f(x)=x', options:['0','1','x','x²'], correct:1 },
      { type:'mcq', prompt:'مشتقة f(x)=√x', options:['1/√x','1/(2√x)','2√x','√x/2'], correct:1 },
      { type:'mcq', prompt:'مشتقة f(x)=1/x', options:['-1/x²','1/x²','-1/x','ln(x)'], correct:0 },
      { type:'mcq', prompt:"قاعدة مشتقة الجداء (uv)'", options:["u'v'","u'v+uv'","u'v-uv'","u'+v'"], correct:1 },
      { type:'mcq', prompt:"قاعدة مشتقة القسمة (u/v)'", options:["u'/v'","(u'v-uv')/v²","(u'v+uv')/v²","u'v-uv'"], correct:1 },
      { type:'mcq', prompt:"مشتقة الدالة المركبة (u∘v)'", options:["u'(v)×v'","u'×v'","u(v')","u'(v)+v'"], correct:0 },
      { type:'mcq', prompt:'مشتقة f(x)=(2x+1)³', options:['3(2x+1)²','6(2x+1)²','(2x+1)²','6(2x+1)'], correct:1 },
      { type:'mcq', prompt:'مشتقة f(x)=sin(x)', options:['-cos(x)','cos(x)','-sin(x)','tan(x)'], correct:1 },
      { type:'mcq', prompt:'مشتقة f(x)=cos(x)', options:['sin(x)','-sin(x)','cos(x)','-cos(x)'], correct:1 },
      { type:'mcq', prompt:'مشتقة f(x)=eˣ', options:['eˣ','x·e^(x-1)','e','1'], correct:0 },
      { type:'mcq', prompt:'مشتقة f(x)=ln(x)', options:['1/x','x','ln(x)','eˣ'], correct:0 },
      { type:'mcq', prompt:"إذا f'(x₀)=0 وتغيّرت إشارة f' عندها، فـf(x₀)", options:['نهاية محلية (عظمى أو صغرى)','نقطة انعدام','نقطة عدم اتصال','نقطة انعطاف'], correct:0 },
      { type:'mcq', prompt:"العدد المشتق f'(a) يمثّل هندسيًا", options:['ميل المماس عند a','طول المماس','قيمة f عند a','مساحة تحت المنحنى'], correct:0 },
      { type:'mcq', prompt:'معادلة المماس عند النقطة a', options:["y=f'(a)(x-a)+f(a)",'y=f(a)(x-a)',"y=f'(a)x",'y=f(a)+f\'(a)'], correct:0 },
      { type:'fill', prompt:'f قابلة للاشتقاق عند a إذا كانت نهاية معدل التغيّر عند a ___', answers:['موجودة ومنتهية','موجودة و منتهية'] },
      { type:'mcq', prompt:'مشتقة f(x)=3x²-5x+2', options:['6x-5','6x²-5','3x-5','6x-5x'], correct:0 },
      { type:'mcq', prompt:'مشتقة f(x)=(x²+1)(x-3)', options:["2x(x-3)+(x²+1)",'2x','2x(x²+1)','x-3'], correct:0 },
      { type:'mcq', prompt:'مشتقة f(x)=x/(x+1)', options:['1/(x+1)²','-1/(x+1)²','1/(x+1)','x/(x+1)²'], correct:0 },
      { type:'mcq', prompt:"إذا كانت f'(x)>0 على I فإن f", options:['متزايدة على I','متناقصة على I','ثابتة على I','غير متصلة'], correct:0 },
      { type:'mcq', prompt:"إذا كانت f'(x)<0 على I فإن f", options:['متزايدة','متناقصة','ثابتة','دورية'], correct:1 },
      { type:'mcq', prompt:"إذا كانت f'(x)=0 على I بأكملها فإن f", options:['متزايدة','متناقصة','ثابتة على I','غير معرّفة'], correct:2 },
      { type:'match', prompt:'طابق كل دالة بمشتقتها', pairs:[
        { left:'x²', right:'2x' },
        { left:'x³', right:'3x²' },
        { left:'√x', right:'1/(2√x)' },
        { left:'1/x', right:'-1/x²' },
      ]},
      { type:'mcq', prompt:'مشتقة f(x)=(3x-1)²', options:['2(3x-1)','6(3x-1)','3(3x-1)','9(3x-1)'], correct:1 },
      { type:'mcq', prompt:'نقطة الانعطاف تحقق', options:["f''(x)=0 مع تغيّر إشارتها","f'(x)=0 فقط",'f(x)=0',"f'(x)>0 دائمًا"], correct:0 },
      { type:'fill', prompt:'المشتقة الثانية لـ f(x)=x³ هي ___', answers:['6x'] },
    ],
  },
];

const SUBJECTS = [
  { id: 'math', title: 'الرياضيات', available: true, iconSvg: SVG.math, stages: STAGES_MATH },
  { id: 'physics', title: 'الفيزياء', available: false, iconSvg: SVG.soon, stages: [] },
  { id: 'arabic', title: 'اللغة العربية', available: false, iconSvg: SVG.soon, stages: [] },
];

const QUESTIONS_PER_ATTEMPT = 15;
const LIVES_START = 3;
const MCQ_TIME = 15;
const MATCH_TIME = 25;

/* ============ أدوات مساعدة ============ */
function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickRandom(arr, n){
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}
function normalizeAnswer(str){
  return String(str || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه');
}

/* ============ تخزين التقدم (محلي + Firestore) ============ */
const PROGRESS_KEY = 'bac_game_progress_v1';
function loadProgress(){
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveProgressLocal(progress){
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}
let progress = loadProgress();

function getStageProgress(subjectId, stageId){
  return (progress[subjectId] && progress[subjectId][stageId]) || { stars: 0, best: 0 };
}
function setStageProgress(subjectId, stageId, stars, best){
  progress[subjectId] = progress[subjectId] || {};
  const cur = progress[subjectId][stageId] || { stars: 0, best: 0 };
  const improved = stars > cur.stars || best > cur.best;
  progress[subjectId][stageId] = {
    stars: Math.max(stars, cur.stars),
    best: Math.max(best, cur.best),
  };
  saveProgressLocal(progress);
  if (improved && currentUser) syncProgressToCloud();
  return improved;
}
function isStageUnlocked(subjectId, stages, index){
  if (index === 0) return true;
  const prev = stages[index - 1];
  return getStageProgress(subjectId, prev.id).stars >= 1;
}

async function syncProgressToCloud(){
  if (!currentUser) return;
  try {
    await window.fbDb.collection('users').doc(currentUser.uid)
      .collection('bacGameProgress').doc('progress')
      .set(progress, { merge: true });
  } catch(e){ /* تجاهل بصمت لو ما فيه اتصال */ }
}
async function fetchProgressFromCloud(){
  if (!currentUser) return;
  try {
    const doc = await window.fbDb.collection('users').doc(currentUser.uid)
      .collection('bacGameProgress').doc('progress').get();
    if (doc.exists){
      const remote = doc.data() || {};
      // دمج: نأخذ الأعلى بين المحلي والسحابي لكل مرحلة
      Object.keys(remote).forEach(subjId => {
        progress[subjId] = progress[subjId] || {};
        Object.keys(remote[subjId] || {}).forEach(stageId => {
          const r = remote[subjId][stageId];
          const l = progress[subjId][stageId] || { stars:0, best:0 };
          progress[subjId][stageId] = { stars: Math.max(r.stars||0, l.stars||0), best: Math.max(r.best||0, l.best||0) };
        });
      });
      saveProgressLocal(progress);
    }
  } catch(e){ /* تجاهل بصمت */ }
}

/* ============ المصادقة ============ */
let currentUser = null;
let authMode = 'login';
const AUTH_ERR = {
  'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.',
  'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
  'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).',
  'auth/wrong-password': 'كلمة المرور غير صحيحة.',
  'auth/user-not-found': 'لا يوجد حساب بهذا البريد.',
  'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
  'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول.',
  default: 'حدث خطأ، حاول مرة أخرى.',
};
function authErrMsg(code){ return AUTH_ERR[code] || AUTH_ERR.default; }

function openAuthModal(){ $('authOverlay').classList.remove('hidden'); $('authError').classList.add('hidden'); setAuthMode('login'); }
function closeAuthModal(){ $('authOverlay').classList.add('hidden'); }
function setAuthMode(mode){
  authMode = mode;
  const isLogin = mode === 'login';
  $('authModalTitle').textContent = isLogin ? 'تسجيل الدخول' : 'إنشاء حساب';
  $('authSubmitBtn').textContent = isLogin ? 'دخول' : 'إنشاء الحساب';
  $('authNameField').classList.toggle('hidden', isLogin);
  $('authSwitchText').textContent = isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟';
  $('authSwitchBtn').textContent = isLogin ? 'إنشاء حساب' : 'تسجيل الدخول';
  $('authError').classList.add('hidden');
}
function initAuthModal(){
  $('authCloseBtn').addEventListener('click', closeAuthModal);
  $('authOverlay').addEventListener('click', (e) => { if (e.target === $('authOverlay')) closeAuthModal(); });
  $('authSwitchBtn').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));

  $('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('authEmail').value.trim();
    const password = $('authPassword').value;
    const name = $('authName').value.trim();
    const btn = $('authSubmitBtn');
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = '…';
    try {
      if (authMode === 'login'){
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (name) await cred.user.updateProfile({ displayName: name });
      }
      closeAuthModal();
    } catch(err){
      $('authError').textContent = authErrMsg(err.code);
      $('authError').classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });

  $('googleAuthBtn').addEventListener('click', async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.fbAuth.signInWithPopup(provider);
      closeAuthModal();
    } catch(err){
      if (err.code !== 'auth/popup-closed-by-user'){
        $('authError').textContent = authErrMsg(err.code);
        $('authError').classList.remove('hidden');
      }
    }
  });
}
function renderAuthUI(){
  const btn = $('authBtn');
  const menu = $('authMenu');
  if (currentUser){
    const initial = (currentUser.name || currentUser.email || '؟')[0].toUpperCase();
    btn.innerHTML = currentUser.picture
      ? `<img class="auth-avatar-img" src="${currentUser.picture}" alt=""><span>${currentUser.name || currentUser.email}</span>`
      : `<span class="auth-avatar">${initial}</span><span>${currentUser.name || currentUser.email}</span>`;
    menu.innerHTML = `<button type="button" class="auth-menu-item" id="logoutBtn">تسجيل الخروج</button>`;
    $('logoutBtn').addEventListener('click', () => window.fbAuth.signOut());
  } else {
    btn.innerHTML = `<span class="auth-avatar">؟</span><span>تسجيل الدخول</span>`;
    menu.innerHTML = '';
  }
}
function initAuthMenu(){
  const wrap = $('authWrap');
  const btn = $('authBtn');
  const menu = $('authMenu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentUser){ menu.classList.toggle('hidden'); }
    else { openAuthModal(); }
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) menu.classList.add('hidden'); });
}

/* ============ عرض الشاشات ============ */
const views = { subjects: $('subjectsView'), map: $('mapView'), play: $('playView'), result: $('resultView') };
function showView(name){
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
}

let activeSubject = null;
let activeStageIndex = null;

/* ---------- شاشة اختيار المادة ---------- */
function renderSubjects(){
  $('heroIconWrap').innerHTML = SVG.trophy;
  const grid = $('subjectsGrid');
  grid.innerHTML = '';
  SUBJECTS.forEach(subj => {
    const card = document.createElement('div');
    card.className = 'subject-card' + (subj.available ? '' : ' locked');
    card.innerHTML = `
      <div class="subject-icon">${subj.iconSvg}</div>
      <div class="subject-name">${subj.title}</div>
      <div class="subject-status ${subj.available ? '' : 'soon'}">${subj.available ? 'ابدأ الآن' : 'قريبًا'}</div>
    `;
    if (subj.available){
      card.addEventListener('click', () => { activeSubject = subj; showView('map'); renderStageMap(); });
    }
    grid.appendChild(card);
  });
}
$('backToSubjectsBtn').addEventListener('click', () => showView('subjects'));

/* ---------- شاشة خريطة المراحل ---------- */
function renderStageMap(){
  $('mapTitle').textContent = activeSubject.title;
  const path = $('stagePath');
  path.innerHTML = '';
  const stages = activeSubject.stages;

  stages.forEach((stage, i) => {
    const unlocked = isStageUnlocked(activeSubject.id, stages, i);
    const prog = getStageProgress(activeSubject.id, stage.id);
    const isNext = unlocked && prog.stars === 0;

    if (i > 0){
      const connector = document.createElement('div');
      connector.innerHTML = i % 2 === 1
        ? `<svg class="connector-svg" width="60" height="40"><path d="M30 0 Q 10 20 30 40" stroke="#B9CEDA" stroke-width="3" fill="none" stroke-dasharray="6,6"/></svg>`
        : `<svg class="connector-svg" width="60" height="40"><path d="M30 0 Q 50 20 30 40" stroke="#B9CEDA" stroke-width="3" fill="none" stroke-dasharray="6,6"/></svg>`;
      path.appendChild(connector.firstElementChild);
    }

    const row = document.createElement('div');
    row.className = 'stage-node-row ' + (i % 2 === 1 ? 'align-start' : (i % 2 === 0 && i > 0 ? 'align-end' : ''));
    if (!unlocked) row.classList.add('locked');

    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'stage-node' + (isNext ? ' current' : '') + (!unlocked ? ' locked' : '');
    if (!unlocked){
      node.style.background = '#B9CEDA';
      node.innerHTML = SVG.lock;
    } else if (prog.stars > 0){
      node.style.background = stage.color;
      node.style.boxShadow = `0 6px 0 ${stage.colorDark}`;
      node.innerHTML = SVG.check;
    } else {
      node.style.background = stage.color;
      node.style.boxShadow = `0 6px 0 ${stage.colorDark}`;
      node.innerHTML = SVG.play('#fff', '#fff');
    }
    if (unlocked){
      node.addEventListener('click', () => startStage(i));
    }

    const info = document.createElement('div');
    info.className = 'stage-info';
    let starsHtml = '';
    for (let s = 0; s < 3; s++) starsHtml += SVG.star(s < prog.stars);
    info.innerHTML = `
      <div class="stage-name">${stage.title}</div>
      <div class="stage-stars">${starsHtml}</div>
      ${!unlocked ? '<div class="stage-status-text" style="color:var(--ink-soft);">أكمل المرحلة السابقة أولاً</div>' : ''}
    `;

    row.appendChild(node);
    row.appendChild(info);
    path.appendChild(row);
  });
}

/* ---------- جلسة اللعب ---------- */
let session = null;

function startStage(stageIndex){
  activeStageIndex = stageIndex;
  const stage = activeSubject.stages[stageIndex];
  const questions = pickRandom(stage.questions, QUESTIONS_PER_ATTEMPT);
  session = {
    stage, questions, index: 0, lives: LIVES_START, correct: 0,
    timerId: null, remaining: 0, failed: false, answered: false,
  };
  showView('play');
  renderLives();
  renderQuestion();
}

function renderLives(){
  const row = $('livesRow');
  row.innerHTML = '';
  for (let i = 0; i < LIVES_START; i++){
    const span = document.createElement('span');
    if (i < session.lives){
      span.innerHTML = SVG.heartFilled('#F0A0A8', '#C0392B');
    } else {
      span.style.opacity = '.25';
      span.innerHTML = SVG.heartFilled('#B9CEDA', '#8A99A6');
    }
    row.appendChild(span);
  }
}

function stopTimer(){
  if (session.timerId){ clearInterval(session.timerId); session.timerId = null; }
}

function startTimer(seconds, onExpire){
  session.remaining = seconds;
  const circle = $('timerCircle');
  const num = $('timerNumber');
  circle.classList.remove('warn');
  num.textContent = session.remaining;
  stopTimer();
  session.timerId = setInterval(() => {
    session.remaining -= 1;
    num.textContent = Math.max(session.remaining, 0);
    if (session.remaining <= 5) circle.classList.add('warn');
    if (session.remaining <= 0){
      stopTimer();
      onExpire();
    }
  }, 1000);
}

function renderQuestion(){
  if (session.answered) return;
  const q = session.questions[session.index];
  $('progressCount').textContent = `${session.index + 1}/${session.questions.length}`;
  $('progressFill').style.width = `${(session.index / session.questions.length) * 100}%`;
  $('feedbackBubble').classList.add('hidden');
  $('questionPrompt').textContent = q.prompt;

  const area = $('answerArea');
  area.innerHTML = '';

  if (q.type === 'mcq'){
    const longText = q.options.some(o => o.length > 8);
    const grid = document.createElement('div');
    grid.className = 'mcq-grid' + (longText ? ' single-col' : '');
    const letters = ['أ', 'ب', 'ج', 'د'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mcq-option';
      btn.innerHTML = `<span class="opt-letter">${letters[idx]}</span><span class="opt-text">${opt}</span>`;
      btn.addEventListener('click', () => handleMcqAnswer(idx, grid));
      grid.appendChild(btn);
    });
    area.appendChild(grid);
    startTimer(MCQ_TIME, () => handleMcqAnswer(-1, grid));
  }

  else if (q.type === 'fill'){
    const row = document.createElement('div');
    row.className = 'fill-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-input';
    input.placeholder = 'اكتب الإجابة هنا';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fill-check-btn';
    btn.textContent = 'تحقق';
    const submit = () => handleFillAnswer(input.value);
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    row.appendChild(input);
    row.appendChild(btn);
    area.appendChild(row);
    setTimeout(() => input.focus(), 50);
    startTimer(MCQ_TIME, () => handleFillAnswer(''));
  }

  else if (q.type === 'match'){
    renderMatchQuestion(q, area);
    startTimer(MATCH_TIME, () => handleMatchTimeout());
  }
}

function loseLife(){
  session.lives -= 1;
  renderLives();
  return session.lives <= 0;
}

function showFeedback(isCorrect, extraText){
  const bubble = $('feedbackBubble');
  bubble.className = 'feedback-bubble ' + (isCorrect ? 'correct' : 'wrong');
  bubble.innerHTML = `<span class="feedback-icon">${isCorrect ? '✓' : '✕'}</span><span>${extraText}</span>`;
  bubble.classList.remove('hidden');
}

function nextQuestionOrEnd(){
  session.index += 1;
  session.answered = false;
  if (session.lives <= 0){
    session.failed = true;
    setTimeout(() => endStage(), 900);
    return;
  }
  if (session.index >= session.questions.length){
    setTimeout(() => endStage(), 900);
    return;
  }
  setTimeout(() => renderQuestion(), 1100);
}

function handleMcqAnswer(idx, grid){
  if (session.answered) return;
  session.answered = true;
  stopTimer();
  const q = session.questions[session.index];
  const buttons = grid.querySelectorAll('.mcq-option');
  buttons.forEach(b => b.disabled = true);
  const isCorrect = idx === q.correct;
  if (idx >= 0) buttons[idx].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect && q.correct >= 0) buttons[q.correct].classList.add('correct');

  if (isCorrect){
    session.correct += 1;
    showFeedback(true, 'أحسنت! إجابة صحيحة');
  } else {
    showFeedback(false, idx === -1 ? 'انتهى الوقت!' : 'إجابة خاطئة');
    loseLife();
  }
  nextQuestionOrEnd();
}

function handleFillAnswer(value){
  if (session.answered) return;
  session.answered = true;
  stopTimer();
  const q = session.questions[session.index];
  const isCorrect = q.answers.some(a => normalizeAnswer(a) === normalizeAnswer(value));
  if (isCorrect){
    session.correct += 1;
    showFeedback(true, 'أحسنت! إجابة صحيحة');
  } else {
    showFeedback(false, `الإجابة الصحيحة: ${q.answers[0]}`);
    loseLife();
  }
  const input = document.querySelector('.fill-input');
  if (input) input.disabled = true;
  nextQuestionOrEnd();
}

function renderMatchQuestion(q, area){
  const leftItems = shuffle(q.pairs.map((p, i) => ({ text: p.left, pairIndex: i })));
  const rightItems = shuffle(q.pairs.map((p, i) => ({ text: p.right, pairIndex: i })));
  let selectedLeft = null;
  let matchedCount = 0;

  const grid = document.createElement('div');
  grid.className = 'match-grid';

  const leftCol = document.createElement('div');
  const rightCol = document.createElement('div');
  leftCol.style.display = 'flex'; leftCol.style.flexDirection = 'column'; leftCol.style.gap = '8px';
  rightCol.style.display = 'flex'; rightCol.style.flexDirection = 'column'; rightCol.style.gap = '8px';

  leftItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'match-item left-item';
    el.textContent = item.text;
    el.dataset.pairIndex = item.pairIndex;
    el.addEventListener('click', () => {
      if (el.classList.contains('matched')) return;
      leftCol.querySelectorAll('.match-item').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      selectedLeft = el;
    });
    leftCol.appendChild(el);
  });

  rightItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'match-item right-item';
    el.textContent = item.text;
    el.dataset.pairIndex = item.pairIndex;
    el.addEventListener('click', () => {
      if (el.classList.contains('matched') || !selectedLeft) return;
      const correct = String(selectedLeft.dataset.pairIndex) === String(item.dataset.pairIndex);
      if (correct){
        selectedLeft.classList.add('matched');
        selectedLeft.classList.remove('selected');
        el.classList.add('matched');
        selectedLeft = null;
        matchedCount += 1;
        if (matchedCount === q.pairs.length){
          if (!session.answered){
            session.answered = true;
            stopTimer();
            session.correct += 1;
            showFeedback(true, 'أحسنت! طابقت الكل بنجاح');
            nextQuestionOrEnd();
          }
        }
      } else {
        el.classList.add('wrong-flash');
        selectedLeft.classList.add('wrong-flash');
        const outOfLives = loseLife();
        setTimeout(() => {
          el.classList.remove('wrong-flash');
          if (selectedLeft) selectedLeft.classList.remove('wrong-flash', 'selected');
          selectedLeft = null;
        }, 500);
        if (outOfLives && !session.answered){
          session.answered = true;
          stopTimer();
          showFeedback(false, 'نفدت أرواحك');
          nextQuestionOrEnd();
        }
      }
    });
    rightCol.appendChild(el);
  });

  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  area.appendChild(grid);
}

function handleMatchTimeout(){
  if (session.answered) return;
  session.answered = true;
  showFeedback(false, 'انتهى الوقت!');
  loseLife();
  nextQuestionOrEnd();
}

$('quitPlayBtn').addEventListener('click', () => {
  stopTimer();
  if (confirm('هل تريد الخروج من المحاولة الحالية؟ لن تُحتسب النتيجة.')) showView('map');
});

/* ---------- شاشة النتيجة ---------- */
function endStage(){
  stopTimer();
  const total = session.questions.length;
  const correct = session.correct;
  let stars = 0;
  if (!session.failed){
    const ratio = correct / total;
    if (ratio >= 0.9) stars = 3;
    else if (ratio >= 0.6) stars = 2;
    else stars = 1;
  }

  if (!session.failed){
    setStageProgress(activeSubject.id, session.stage.id, stars, correct);
  }

  $('resultTrophyWrap').innerHTML = SVG.trophy;
  const starsWrap = $('resultStars');
  starsWrap.innerHTML = '';
  for (let i = 0; i < 3; i++){
    const wrapper = document.createElement('span');
    wrapper.className = i === 1 ? 'mid' : '';
    wrapper.innerHTML = SVG.star(i < stars);
    starsWrap.appendChild(wrapper);
  }

  $('resultHeadline').textContent = session.failed
    ? 'نفدت أرواحك — حاول مجددًا'
    : `أحسنت! ${correct} من ${total} صحيحة`;
  $('resultSub').textContent = session.stage.title;

  const stages = activeSubject.stages;
  const hasNext = activeStageIndex < stages.length - 1;
  const nextBtn = $('nextStageBtn');
  nextBtn.classList.toggle('hidden', session.failed || stars === 0 || !hasNext);
  nextBtn.onclick = () => startStage(activeStageIndex + 1);

  $('retryStageBtn').onclick = () => startStage(activeStageIndex);
  $('toMapBtn').onclick = () => { showView('map'); renderStageMap(); };

  showView('result');
}

/* ============ تهيئة ============ */
function init(){
  initAuthModal();
  initAuthMenu();
  renderSubjects();

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged((fbUser) => {
      currentUser = fbUser ? {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email,
        email: fbUser.email,
        picture: fbUser.photoURL || null,
      } : null;
      renderAuthUI();
      if (currentUser) fetchProgressFromCloud().then(() => {
        if (!views.subjects.classList.contains('hidden')) renderSubjects();
        if (!views.map.classList.contains('hidden')) renderStageMap();
      });
    });
  } else {
    renderAuthUI();
  }
}

document.addEventListener('DOMContentLoaded', init);
