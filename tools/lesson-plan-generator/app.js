/* =====================================================================
   مولّد مذكرة تحضير الدرس — أكاديمية مرابطي
   تخزين النص: محلي دائمًا (مسودة) + Firestore عند الضغط على "حفظ" فقط
   تخزين الصور (الشعار/الإطار): محلي فقط، لا تتزامن مع الحساب
===================================================================== */

const LOCAL_PLANS_KEY = 'lesson_plans_local_v1';
const LOCAL_ASSETS_KEY = 'lesson_plan_assets_v1';
const DEFAULT_COLOR = '#1A8A72';

/* ---------- قوالب المستويات (محتوى تجريبي كامل قابل للتعديل) ---------- */
const LEVEL_TEMPLATES = {
  'ابتدائي': {
    school: 'مدرسة الأمير عبد القادر الابتدائية',
    subject: 'اللغة العربية',
    klass: 'السنة الرابعة ابتدائي',
    teacher: 'فاطمة الزهراء',
    title: 'حروف الجر',
    unit: 'القواعد اللغوية',
    session: '2',
    duration: '45',
    objectives: [
      'يتعرف التلميذ على حروف الجر الأساسية',
      'يوظف حروف الجر في جمل مفيدة',
      'يميز موقع حرف الجر داخل الجملة',
    ],
    materials: ['السبورة', 'الكتاب المدرسي', 'بطاقات ملونة'],
    stages: [
      { title: 'التمهيد / الوضعية الانطلاقية', time: '5', teacher: 'يطرح أسئلة حول نص مقروء سابقًا', student: 'يجيب شفهيًا عن الأسئلة' },
      { title: 'بناء التعلمات', time: '20', teacher: 'يقدّم أمثلة عن حروف الجر ويشرح استعمالها', student: 'يستخرج حروف الجر من نص ويوظفها' },
      { title: 'التطبيق', time: '10', teacher: 'يوزّع بطاقات تدريبية', student: 'ينجز التمارين فرديًا' },
      { title: 'التقويم والتلخيص', time: '10', teacher: 'يطرح أسئلة ختامية', student: 'يلخص الدرس شفهيًا' },
    ],
    eval: 'إنجاز تمرين صفحة 30 من الكتاب المدرسي',
  },
  'متوسط': {
    school: 'متوسطة الأمير عبد القادر — ورقلة',
    subject: 'الرياضيات',
    klass: 'الأولى متوسط 1',
    teacher: 'محمد بن علي',
    title: 'الأعداد النسبية',
    unit: 'الأعداد والحساب',
    session: '3',
    duration: '45',
    objectives: [
      'يتعرف التلميذ على مفهوم العدد النسبي وكتابته الرمزية',
      'يقارن بين عددين نسبيين ويرتبهما تصاعديًا وتنازليًا',
      'يجري العمليات الأساسية (الجمع والطرح) على الأعداد النسبية',
    ],
    materials: ['السبورة', 'الكتاب المدرسي', 'بطاقات تعليمية', 'المسطرة المدرجة'],
    stages: [
      { title: 'الوضعية الانطلاقية', time: '5', teacher: 'يطرح إشكالية درجة الحرارة تحت الصفر', student: 'يقترح حلولًا أولية شفهيًا' },
      { title: 'بناء التعلمات (نشاط 1)', time: '15', teacher: 'يقدّم تعريف العدد النسبي بأمثلة', student: 'يدوّن التعريف وينجز أمثلة مماثلة' },
      { title: 'بناء التعلمات (نشاط 2)', time: '15', teacher: 'يشرح مقارنة الأعداد النسبية على المستقيم', student: 'يرتّب مجموعة أعداد على المستقيم' },
      { title: 'التقويم', time: '10', teacher: 'يوزّع تمارين تطبيقية قصيرة', student: 'يحل التمارين فرديًا على الدفتر' },
    ],
    eval: 'حل تمارين الصفحة 42 من الكتاب المدرسي (التمارين من 1 إلى 5)',
  },
  'ثانوي': {
    school: 'ثانوية الإخوة أحمد',
    subject: 'الفيزياء',
    klass: 'الثانية علوم تجريبية',
    teacher: 'كريم شريف',
    title: 'قوانين نيوتن',
    unit: 'الميكانيك',
    session: '4',
    duration: '55',
    objectives: [
      'يتعرف التلميذ على قوانين نيوتن الثلاثة',
      'يوظف القانون الثاني لنيوتن في حل تمارين تطبيقية',
      'يحلل حركة جسم خاضع لقوى متعددة',
    ],
    materials: ['السبورة', 'جهاز تجريبي', 'حاسبة علمية'],
    stages: [
      { title: 'وضعية الانطلاق', time: '5', teacher: 'يعرض تجربة استهلالية عن حركة جسم', student: 'يلاحظ ويسجل ملاحظاته' },
      { title: 'بناء التعلمات', time: '25', teacher: 'يشرح قوانين نيوتن الثلاثة بالتفصيل', student: 'يدوّن القوانين وينجز تمارين تطبيقية' },
      { title: 'التطبيق والتقويم', time: '10', teacher: 'يوزّع تمارين حل مسائل', student: 'يحل المسائل باستعمال القوانين' },
      { title: 'التركيب / الخلاصة', time: '5', teacher: 'يلخص أهم النقاط', student: 'يدوّن خلاصة الدرس' },
    ],
    eval: 'حل تمارين الصفحة 58 من الكتاب المدرسي',
  },
};

/* ---------- تخزين محلي ---------- */
function loadLocalPlans(){
  try { return JSON.parse(localStorage.getItem(LOCAL_PLANS_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveLocalPlans(plans){
  localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(plans));
}
function loadLocalAssets(){
  try { return JSON.parse(localStorage.getItem(LOCAL_ASSETS_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveLocalAssets(assets){
  try { localStorage.setItem(LOCAL_ASSETS_KEY, JSON.stringify(assets)); }
  catch(e){ /* قد تمتلئ المساحة المحلية بصور كبيرة؛ نتجاهل بصمت */ }
}

let plansCache = loadLocalPlans();
let assetsCache = loadLocalAssets();

function newPlanId(){
  return 'plan_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function makeNewPlan(level){
  const tpl = LEVEL_TEMPLATES[level];
  const now = new Date();
  const iso = now.toISOString();
  const dateStr = now.toISOString().slice(0, 10);
  return {
    id: newPlanId(),
    level: level,
    template: 't1',
    color: DEFAULT_COLOR,
    school: tpl.school,
    yearSelect: currentAcademicYears()[0],
    yearManual: '',
    subject: tpl.subject,
    klass: tpl.klass,
    date: dateStr,
    teacher: tpl.teacher,
    title: tpl.title,
    unit: tpl.unit,
    session: tpl.session,
    duration: tpl.duration,
    objectives: tpl.objectives.slice(),
    materials: tpl.materials.slice(),
    stages: tpl.stages.map(s => ({...s})),
    evalEnabled: true,
    eval: tpl.eval,
    createdAt: iso,
    updatedAt: iso,
  };
}

function currentAcademicYears(){
  const base = new Date().getFullYear();
  const list = [];
  for (let i = 0; i < 5; i++){ list.push(`${base + i}/${base + i + 1}`); }
  return list;
}

/* ---------- حالة عامة ---------- */
let currentUser = null; // { uid, name, email, picture } | null
let currentPlanId = null;
let pendingSaveAfterLogin = false;
let saveStatusTimer = null;

const $ = (id) => document.getElementById(id);

/* ---------- المصادقة ---------- */
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

let authMode = 'login';

function openAuthModal(){
  $('authOverlay').classList.remove('hidden');
  $('authError').classList.add('hidden');
  setAuthMode('login');
}
function closeAuthModal(){
  $('authOverlay').classList.add('hidden');
  pendingSaveAfterLogin = false;
}
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
    const originalLabel = btn.textContent;
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
      btn.textContent = originalLabel;
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
  renderGuestNote();
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

/* ---------- تبديل الشاشات ---------- */
function showGallery(){
  $('galleryView').classList.remove('hidden');
  $('editorView').classList.add('hidden');
  document.body.classList.remove('in-editor');
  currentPlanId = null;
  renderGallery();
}
function showEditor(planId){
  currentPlanId = planId;
  $('galleryView').classList.add('hidden');
  $('editorView').classList.remove('hidden');
  document.body.classList.add('in-editor');
  loadPlanIntoEditor(planId);
}

/* ---------- المعرض ---------- */
function relativeDate(iso){
  if (!iso) return '';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays <= 0) return 'اليوم';
  if (diffDays === 1) return 'أمس';
  if (diffDays < 7) return `قبل ${diffDays} أيام`;
  return d.toLocaleDateString('ar');
}

function renderGuestNote(){
  $('guestNote').classList.toggle('hidden', !!currentUser);
}

function renderGallery(){
  renderGuestNote();
  const grid = $('plansGrid');
  const ids = Object.keys(plansCache).sort((a, b) => {
    const ta = new Date(plansCache[a].updatedAt || 0).getTime();
    const tb = new Date(plansCache[b].updatedAt || 0).getTime();
    return tb - ta;
  });
  grid.innerHTML = '';
  $('emptyNote').classList.toggle('hidden', ids.length > 0);

  ids.forEach(id => {
    const plan = plansCache[id];
    const card = document.createElement('div');
    card.className = 'plan-card';
    card.innerHTML = `
      <button type="button" class="plan-delete-btn" title="حذف">×</button>
      <div class="plan-level-badge">${plan.level}</div>
      <div class="plan-card-title">${escapeHtml(plan.title || 'مذكرة بدون عنوان')}</div>
      <div class="plan-card-sub">${escapeHtml(plan.subject || '')} ${plan.klass ? '· ' + escapeHtml(plan.klass) : ''}</div>
      <div class="plan-card-date">آخر تعديل: ${relativeDate(plan.updatedAt)}</div>
    `;
    card.addEventListener('click', () => showEditor(id));
    card.querySelector('.plan-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deletePlan(id);
    });
    grid.appendChild(card);
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function deletePlan(id){
  if (!confirm('سيتم حذف هذه المذكرة نهائيًا. متابعة؟')) return;
  delete plansCache[id];
  saveLocalPlans(plansCache);
  delete assetsCache[id];
  saveLocalAssets(assetsCache);
  if (currentUser){
    window.fbDb.collection('users').doc(currentUser.uid).collection('lessonPlans').doc(id).delete().catch(() => {});
  }
  renderGallery();
}

$('newPlanBtn').addEventListener('click', () => {
  const level = 'ابتدائي';
  const plan = makeNewPlan(level);
  plansCache[plan.id] = plan;
  saveLocalPlans(plansCache);
  showEditor(plan.id);
});
$('guestLoginBtn').addEventListener('click', openAuthModal);

/* =====================================================================
   القوالب الثمانية — كلها تقرأ نفس بيانات المذكرة (الشكل فقط يختلف)
===================================================================== */
/* ---------- أدوات مساعدة للقوالب ---------- */
const grow = p => p.stages.map(s => Math.max(parseInt(s.time) || 5, 5));
const objText = p => p.objectives.join('، ');
const act = s => `${s.teacher ? `<div><b>الأستاذ:</b> ${esc(s.teacher)}</div>` : ''}${s.student ? `<div><b>التلميذ:</b> ${esc(s.student)}</div>` : ''}`;
const evalTxt = p => (p.evalEnabled && p.eval) ? esc(p.eval) : '';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const V = s => s ? `<span class="v">${esc(s)}</span>` : '';
const tm = t => t ? esc(t) + ' د' : '—';
const dur = d => d ? esc(d) + ' د' : '—';
const lg = (p, c) => p.logo ? `<img class="lg ${c}" src="${p.logo}" alt="">` : '';
const dt = p => p.date ? p.date.split('-').reverse().join('-') : '';
const lis = a => a.map(x => `<li>${esc(x)}</li>`).join('');

function cv(c){
  const h = c.replace('#',''), r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  const mix = a => '#' + [r,g,b].map(x => Math.round(x * a + 255 * (1 - a)).toString(16).padStart(2,'0')).join('');
  return `--c:${c};` + [5,7,10,12,14,30].map(k => `--t${k}:${mix(k/100)}`).join(';');
}

/* ---------- القوالب الثمانية: كلها تقرأ نفس البيانات ---------- */
const NAMES = {t1:'أسود كلاسيكي',t2:'أزرق مؤطّر',t3:'أخضر بالمقاطع',t4:'أحمر أنيق',t5:'الافتراضي',t6:'بسيط رسمي',t7:'شريط ملوّن',t8:'خط زمني'};
const T = {
t1: p => { const g = grow(p), n = p.stages.length;
 return `<div class="paper t1">
  <div class="box r1"><span><b>المادة:</b> ${V(p.subject)}</span><span><b>المقطع:</b> <i class="blank"></i></span><span><b>المحور:</b> ${V(p.unit)}</span>${lg(p,'lg-s')}</div>
  <div class="box b2"><div><b>النشاط:</b> <i class="blank"></i></div><div><b>الموضوع:</b> ${V(p.title)}</div><div><b>الهدف التعلمي:</b> ${V(objText(p))}</div></div>
  <div class="tbl"><div class="hd"><div>المراحل</div><div>الوضعية التعلمية التعليمية</div><div>التقويم</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="sit ruled">${act(s)}</div><div class="ev ruled">${i === n-1 ? evalTxt(p) : ''}</div></div>`).join('')}
  </div></div>`; },

t2: p => { const g = grow(p);
 return `<div class="paper t2"><div class="fr">
  <div class="top">
   <div class="cd"><div><span class="lb">الأستاذ:</span> ${V(p.teacher)}</div><div><span class="lb">المستوى:</span> ${V(p.klass)}</div><div><span class="lb">السنة الدراسية:</span> ${V(p.year)}</div><div><span class="lb">المدة:</span> ${V(p.duration ? p.duration + ' د' : '')}</div></div>
   <div class="mid"><div class="pl"><b>نموذج مذكرة رقم:</b> ${V(p.session)}</div><div class="pl"><span class="lb">المحور:</span> ${V(p.unit)}</div><div class="pl"><span class="lb">الموضوع:</span> ${V(p.title)}</div></div>
   <div class="cd"><h4>الوسائل التعليمية</h4>${p.materials.map(m => `<div>• ${esc(m)}</div>`).join('')}</div>
  </div>
  <div class="band"><span class="lb">الكفاءات المستهدفة:</span> ${V(objText(p))}</div>
  <div class="tbl"><div class="hd"><div>المراحل</div><div>المحتوى المعرفي</div><div>المدة</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div>${act(s)}</div><div class="tm">${tm(s.time)}</div></div>`).join('')}</div>
  ${evalTxt(p) ? `<div class="ftr"><span class="lb">التقويم / الواجب:</span> ${V(p.eval)}</div>` : ''}
 </div></div>`; },

t3: p => { const g = grow(p), n = p.stages.length;
 const it = (l, v, cls, w) => `<div class="it${w ? ' w' : ''}"><b class="${cls}">${l}:</b> ${v ? V(v) : ''}</div>`;
 return `<div class="paper t3">
  <div class="top">
   ${it('الميدان', p.subject, 'g')}${it('المقطع التعلمي', '', 'r')}
   ${it('المحتوى', p.title, 'r')}${it('النشاط', '', 'r')}
   ${it('الأسبوع', dt(p), 'p')}${it('الحصة / المدة', [p.session, p.duration ? p.duration + ' د' : ''].filter(Boolean).join(' / '), 'p')}
   ${it('مؤشرات الكفاءة', objText(p), 'r', 1)}
   ${it('القيم والمواقف', '', 'g', 1)}
   ${it('الوسائل', p.materials.join('، '), 'r', 1)}
  </div>
  <div class="tbl"><div class="hd"><div>المراحل</div><div>الوضعية التعلمية والنشاط المقترح</div><div>مؤشرات التقويم</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="sit ruled">${act(s)}</div><div class="ev ruled">${i === n-1 ? evalTxt(p) : ''}</div></div>`).join('')}
  </div></div>`; },

t4: p => { const g = grow(p), n = p.stages.length;
 return `<div class="paper t4"><div class="fr"><div class="pill">مذكرة رقم ${esc(p.session)}</div>${lg(p,'lg-c')}
  <div class="info">
   <div><b>المؤسسة:</b> ${V(p.school)}</div><div><b>المستوى:</b> ${V(p.klass)}</div>
   <div><b>ميدان التعلم:</b> ${V(p.subject)}</div><div><b>المادة:</b> ${V(p.subject)}</div>
   <div><b>الوحدة التعلمية:</b> ${V(p.unit)}</div><div><b>المدة:</b> ${V(p.duration ? p.duration + ' د' : '')}</div>
   <div><b>المحتوى المعرفي:</b> ${V(p.title)}</div><div><b>الأستاذ:</b> ${V(p.teacher)}</div>
  </div>
  <div class="cmp"><div><h5>الكفاءات القبلية:</h5></div><div><h5>الكفاءات المستهدفة:</h5>${V(objText(p))}</div></div>
  <div class="tbl"><div class="hd"><div>مراحل الحصة</div><div>سير الحصة</div><div>المدة</div><div>توجيهات وتعاليق</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="sit">${act(s)}</div><div class="tm">${esc(s.time)}</div><div class="nt">${i === n-1 ? V(evalTxt(p) ? p.eval : '') : ''}</div></div>`).join('')}
  </div></div></div>`; },

t5: p => `<div class="paper t5" style="${cv(p.color)}">
  <div class="h">${lg(p,'lg-h')}<div><div class="sc">${esc(p.school)}</div><div class="sb">${esc(p.year)} · ${esc(p.subject)} · ${esc(p.klass)}</div></div></div>
  <div class="ti">${esc(p.title)}</div>
  <div class="meta"><span><b>الوحدة:</b> ${esc(p.unit)}</span><span><b>الحصة:</b> ${esc(p.session)}</span><span><b>المدة:</b> ${dur(p.duration)}</span><span><b>التاريخ:</b> ${esc(dt(p))}</span><span><b>الأستاذ:</b> ${esc(p.teacher)}</span></div>
  <div class="bt">الأهداف / الكفاءة المستهدفة</div><ul>${lis(p.objectives)}</ul>
  <div class="bt">الوسائل التعليمية</div><div class="tags">${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div>
  <div class="bt">سير الدرس</div>
  <table><thead><tr><th>المرحلة</th><th>الزمن</th><th>نشاط الأستاذ</th><th>نشاط التلميذ</th></tr></thead><tbody>
  ${p.stages.map(s => `<tr><td><b>${esc(s.title)}</b></td><td>${tm(s.time)}</td><td>${esc(s.teacher)}</td><td>${esc(s.student)}</td></tr>`).join('')}</tbody></table>
  ${evalTxt(p) ? `<div class="bt">التقويم / الواجب المنزلي</div><p>${evalTxt(p)}</p>` : ''}
 </div>`,

t6: p => `<div class="paper t6">
  <div class="hd6">${lg(p,'lg-m')}<b>${esc(p.school)}</b><span>السنة الدراسية ${esc(p.year)}</span></div>
  <div class="tl">مذكرة تحضير درس</div>
  <div class="kv"><div><b>المادة:</b> ${esc(p.subject)}</div><div><b>القسم:</b> ${esc(p.klass)}</div><div><b>عنوان الدرس:</b> ${esc(p.title)}</div><div><b>الوحدة:</b> ${esc(p.unit)}</div><div><b>الحصة / المدة:</b> ${esc(p.session)} / ${dur(p.duration)}</div><div><b>الأستاذ:</b> ${esc(p.teacher)}</div></div>
  <div class="sec"><h5>الأهداف / الكفاءة المستهدفة</h5><div class="bd">${p.objectives.map(o => `<div>— ${esc(o)}</div>`).join('')}</div></div>
  <div class="sec"><h5>الوسائل التعليمية</h5><div class="bd">${esc(p.materials.join('، '))}</div></div>
  <div class="tbw"><table><thead><tr><th style="width:150px">المراحل</th><th>نشاط الأستاذ</th><th>نشاط التلميذ</th></tr></thead><tbody>
  ${p.stages.map(s => `<tr><td><b>${esc(s.title)}</b><br><small>${tm(s.time)}</small></td><td>${esc(s.teacher)}</td><td>${esc(s.student)}</td></tr>`).join('')}</tbody></table></div>
  ${evalTxt(p) ? `<div class="sec"><h5>التقويم / الواجب المنزلي</h5><div class="bd">${evalTxt(p)}</div></div>` : ''}
 </div>`,

t7: p => `<div class="paper t7" style="${cv(p.color)}">
  <div class="band7">${lg(p,'lg-b')}<small>${esc(p.school)} · ${esc(p.year)}</small><h1>${esc(p.title)}</h1>
   <div class="chips7"><span>${esc(p.subject)}</span><span>${esc(p.klass)}</span><span>الوحدة: ${esc(p.unit)}</span><span>الحصة ${esc(p.session)}</span><span>${dur(p.duration)}</span><span>${esc(p.teacher)}</span></div></div>
  <div class="bd7">
   <div class="two"><div class="cd7"><h5>الأهداف / الكفاءة المستهدفة</h5><ul>${lis(p.objectives)}</ul></div><div class="cd7"><h5>الوسائل التعليمية</h5><ul>${lis(p.materials)}</ul></div></div>
   <table><thead><tr><th style="width:170px">المرحلة</th><th style="width:70px">الزمن</th><th>نشاط الأستاذ</th><th>نشاط التلميذ</th></tr></thead><tbody>
   ${p.stages.map(s => `<tr><td><b>${esc(s.title)}</b></td><td>${tm(s.time)}</td><td>${esc(s.teacher)}</td><td>${esc(s.student)}</td></tr>`).join('')}</tbody></table>
   ${evalTxt(p) ? `<div class="ft7"><b>التقويم / الواجب:</b> ${evalTxt(p)}</div>` : ''}
  </div></div>`,

t8: p => `<div class="paper t8" style="${cv(p.color)}">
  <div class="side">${lg(p,'lg-s2')}
   <div class="kv8"><h5>المعلومات</h5><div>${esc(p.school)}</div><div>${esc(p.year)}</div><div><b>المادة:</b> ${esc(p.subject)}</div><div><b>القسم:</b> ${esc(p.klass)}</div><div><b>الأستاذ:</b> ${esc(p.teacher)}</div><div><b>الحصة:</b> ${esc(p.session)} · ${dur(p.duration)}</div></div>
   <div><h5>الأهداف</h5><ul>${lis(p.objectives)}</ul></div>
   <div><h5>الوسائل</h5><ul>${lis(p.materials)}</ul></div>
  </div>
  <div class="main"><small>${esc(p.unit)} · ${esc(dt(p))}</small><h1>${esc(p.title)}</h1>
   <div class="tlw">${p.stages.map((s,i) => `<div class="stp"><div class="nm">${i+1}</div><h6><span>${esc(s.title)}</span><em>${tm(s.time)}</em></h6><div><b>الأستاذ:</b> ${esc(s.teacher)}</div><div><b>التلميذ:</b> ${esc(s.student)}</div></div>`).join('')}</div>
   ${evalTxt(p) ? `<div class="ev8"><b>التقويم / الواجب:</b> ${evalTxt(p)}</div>` : ''}
  </div></div>`
};


/* ---------- المحرر: مراجع العناصر ---------- */
const els = {
  levelSelect: $('levelSelect'), loadPresetBtn: $('loadPresetBtn'),
  fSchool: $('fSchool'), fYearSelect: $('fYearSelect'), fYearManualWrap: $('fYearManualWrap'), fYearManual: $('fYearManual'),
  fSubject: $('fSubject'), fClass: $('fClass'), fDate: $('fDate'), fTeacher: $('fTeacher'),
  fTitle: $('fTitle'), fUnit: $('fUnit'), fSession: $('fSession'), fDuration: $('fDuration'),
  objectivesList: $('objectivesList'), objectiveInput: $('objectiveInput'), addObjectiveBtn: $('addObjectiveBtn'),
  materialsList: $('materialsList'), materialInput: $('materialInput'), addMaterialBtn: $('addMaterialBtn'),
  stagesList: $('stagesList'), addStageBtn: $('addStageBtn'),
  evalToggle: $('evalToggle'), fEval: $('fEval'),
  logoInput: $('logoInput'), logoBox: $('logoBox'), logoPreview: $('logoPreview'),
  logoPlaceholderIcon: $('logoPlaceholderIcon'), logoRemoveBtn: $('logoRemoveBtn'),
  frameDrop: $('frameDrop'), frameInput: $('frameInput'), frameRemoveBtn: $('frameRemoveBtn'),
  colorPicker: $('colorPicker'), colorResetBtn: $('colorResetBtn'),
  saveBtn: $('saveBtn'), exportPdfBtn: $('exportPdfBtn'), printBtn: $('printBtn'), deletePlanBtn: $('deletePlanBtn'),
  saveStatus: $('saveStatus'),
};

function currentPlan(){ return plansCache[currentPlanId]; }

function populateYearSelect(plan){
  const years = currentAcademicYears();
  els.fYearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('') + `<option value="__manual__">إدخال يدوي…</option>`;
  const isManual = plan.yearSelect === '__manual__' || (plan.yearManual && !years.includes(plan.yearSelect));
  if (isManual){
    els.fYearSelect.value = '__manual__';
    els.fYearManualWrap.classList.remove('hidden');
    els.fYearManual.value = plan.yearManual || '';
  } else {
    els.fYearSelect.value = years.includes(plan.yearSelect) ? plan.yearSelect : years[0];
    els.fYearManualWrap.classList.add('hidden');
  }
}

function effectiveYear(plan){
  return plan.yearSelect === '__manual__' ? (plan.yearManual || '') : plan.yearSelect;
}

/* ---------- تحميل مذكرة في المحرر ---------- */
function loadPlanIntoEditor(id){
  const plan = plansCache[id];
  els.levelSelect.value = plan.level;
  els.fSchool.value = plan.school || '';
  populateYearSelect(plan);
  els.fSubject.value = plan.subject || '';
  els.fClass.value = plan.klass || '';
  els.fDate.value = plan.date || '';
  els.fTeacher.value = plan.teacher || '';
  els.fTitle.value = plan.title || '';
  els.fUnit.value = plan.unit || '';
  els.fSession.value = plan.session || '';
  els.fDuration.value = plan.duration || '';
  els.evalToggle.checked = plan.evalEnabled !== false;
  els.fEval.value = plan.eval || '';
  els.colorPicker.value = plan.color || DEFAULT_COLOR;

  renderChips();
  renderStages();
  renderLogo();
  renderFrame();
  applyColor();
  renderPreviewNow();
  setSaveStatus('');
}

function setSaveStatus(text){
  els.saveStatus.textContent = text;
  clearTimeout(saveStatusTimer);
  if (text){ saveStatusTimer = setTimeout(() => { els.saveStatus.textContent = ''; }, 3000); }
}

function touchPlan(){
  const plan = currentPlan();
  if (!plan) return;
  plan.updatedAt = new Date().toISOString();
  saveLocalPlans(plansCache);
}

/* ---------- ربط الحقول البسيطة ---------- */
function bindSimple(el, key, transform){
  el.addEventListener('input', () => {
    const plan = currentPlan();
    plan[key] = transform ? transform(el.value) : el.value;
    touchPlan();
    renderPreview();
  });
}
bindSimple(els.fSchool, 'school');
bindSimple(els.fSubject, 'subject');
bindSimple(els.fClass, 'klass');
bindSimple(els.fDate, 'date');
bindSimple(els.fTeacher, 'teacher');
bindSimple(els.fTitle, 'title');
bindSimple(els.fUnit, 'unit');
bindSimple(els.fSession, 'session');
bindSimple(els.fDuration, 'duration');
bindSimple(els.fEval, 'eval');
bindSimple(els.fYearManual, 'yearManual');

els.fYearSelect.addEventListener('change', () => {
  const plan = currentPlan();
  plan.yearSelect = els.fYearSelect.value;
  els.fYearManualWrap.classList.toggle('hidden', plan.yearSelect !== '__manual__');
  touchPlan();
  renderPreview();
});

els.levelSelect.addEventListener('change', () => {
  const plan = currentPlan();
  plan.level = els.levelSelect.value;
  touchPlan();
  renderPreview();
});
els.loadPresetBtn.addEventListener('click', () => {
  const plan = currentPlan();
  const tpl = LEVEL_TEMPLATES[plan.level];
  Object.assign(plan, {
    school: tpl.school, subject: tpl.subject, klass: tpl.klass, teacher: tpl.teacher,
    title: tpl.title, unit: tpl.unit, session: tpl.session, duration: tpl.duration,
    objectives: tpl.objectives.slice(), materials: tpl.materials.slice(),
    stages: tpl.stages.map(s => ({...s})), eval: tpl.eval,
  });
  touchPlan();
  loadPlanIntoEditor(currentPlanId);
});

els.evalToggle.addEventListener('change', () => {
  const plan = currentPlan();
  plan.evalEnabled = els.evalToggle.checked;
  touchPlan();
  renderPreview();
});

/* ---------- الأهداف / الوسائل (قوائم قابلة للإضافة) ---------- */
function renderChips(){
  renderOneChipList(els.objectivesList, currentPlan().objectives, 'objectives');
  renderOneChipList(els.materialsList, currentPlan().materials, 'materials');
}
function renderOneChipList(listEl, items, key){
  listEl.innerHTML = '';
  items.forEach((text, idx) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    const span = document.createElement('span');
    span.textContent = text;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '×';
    btn.addEventListener('click', () => {
      currentPlan()[key].splice(idx, 1);
      touchPlan();
      renderOneChipList(listEl, currentPlan()[key], key);
      renderPreview();
    });
    chip.appendChild(span);
    chip.appendChild(btn);
    listEl.appendChild(chip);
  });
}
function bindAddChip(inputEl, btnEl, key, listEl){
  const add = () => {
    const val = inputEl.value.trim();
    if (!val) return;
    currentPlan()[key].push(val);
    inputEl.value = '';
    touchPlan();
    renderOneChipList(listEl, currentPlan()[key], key);
    renderPreview();
  };
  btnEl.addEventListener('click', add);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter'){ e.preventDefault(); add(); } });
}
bindAddChip(els.objectiveInput, els.addObjectiveBtn, 'objectives', els.objectivesList);
bindAddChip(els.materialInput, els.addMaterialBtn, 'materials', els.materialsList);

/* ---------- سير الدرس ---------- */
function renderStages(){
  const plan = currentPlan();
  els.stagesList.innerHTML = '';
  plan.stages.forEach((stage, idx) => {
    const item = document.createElement('div');
    item.className = 'stage-item';

    const top = document.createElement('div');
    top.className = 'stage-row-top';

    const titleInput = document.createElement('input');
    titleInput.type = 'text'; titleInput.className = 'field-input stage-title';
    titleInput.placeholder = 'اسم المرحلة'; titleInput.value = stage.title || '';
    titleInput.addEventListener('input', () => { stage.title = titleInput.value; touchPlan(); renderPreview(); });

    const timeInput = document.createElement('input');
    timeInput.type = 'number'; timeInput.min = '0'; timeInput.className = 'field-input stage-time';
    timeInput.placeholder = 'الزمن'; timeInput.value = stage.time || '';
    timeInput.addEventListener('input', () => { stage.time = timeInput.value; touchPlan(); renderPreview(); });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button'; removeBtn.className = 'stage-remove'; removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      plan.stages.splice(idx, 1);
      touchPlan();
      renderStages();
      renderPreview();
    });

    top.appendChild(titleInput); top.appendChild(timeInput); top.appendChild(removeBtn);

    const grid = document.createElement('div');
    grid.className = 'stage-grid';

    const teacherArea = document.createElement('textarea');
    teacherArea.className = 'field-input'; teacherArea.placeholder = 'نشاط الأستاذ'; teacherArea.value = stage.teacher || '';
    teacherArea.addEventListener('input', () => { stage.teacher = teacherArea.value; touchPlan(); renderPreview(); });

    const studentArea = document.createElement('textarea');
    studentArea.className = 'field-input'; studentArea.placeholder = 'نشاط التلميذ'; studentArea.value = stage.student || '';
    studentArea.addEventListener('input', () => { stage.student = studentArea.value; touchPlan(); renderPreview(); });

    grid.appendChild(teacherArea); grid.appendChild(studentArea);
    item.appendChild(top); item.appendChild(grid);
    els.stagesList.appendChild(item);
  });
}
els.addStageBtn.addEventListener('click', () => {
  currentPlan().stages.push({ title: '', time: '', teacher: '', student: '' });
  touchPlan();
  renderStages();
  renderPreview();
});

/* ---------- الشعار (محلي فقط) ---------- */
function renderLogo(){
  const asset = assetsCache[currentPlanId];
  const logo = asset && asset.logo;
  els.logoPreview.classList.toggle('hidden', !logo);
  els.logoPlaceholderIcon.classList.toggle('hidden', !!logo);
  els.logoRemoveBtn.classList.toggle('hidden', !logo);
  if (logo) els.logoPreview.src = logo;
}
els.logoBox.addEventListener('click', (e) => { if (e.target !== els.logoRemoveBtn) els.logoInput.click(); });
els.logoInput.addEventListener('change', () => {
  const file = els.logoInput.files[0];
  if (!file) return;
  readImageResized(file, 240, (dataUrl) => {
    assetsCache[currentPlanId] = assetsCache[currentPlanId] || {};
    assetsCache[currentPlanId].logo = dataUrl;
    saveLocalAssets(assetsCache);
    renderLogo();
    renderPreview();
  });
});
els.logoRemoveBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (assetsCache[currentPlanId]) delete assetsCache[currentPlanId].logo;
  saveLocalAssets(assetsCache);
  els.logoInput.value = '';
  renderLogo();
  renderPreview();
});

/* ---------- إطار الخلفية (محلي فقط) ---------- */
function renderFrame(){
  const asset = assetsCache[currentPlanId];
  const frame = asset && asset.frame;
  els.frameRemoveBtn.classList.toggle('hidden', !frame);
  document.documentElement.style.setProperty('--frame', frame ? `url("${frame}")` : 'none');
}
els.frameDrop.addEventListener('click', () => els.frameInput.click());
els.frameInput.addEventListener('change', () => {
  const file = els.frameInput.files[0];
  if (!file) return;
  readImageResized(file, 1400, (dataUrl) => {
    assetsCache[currentPlanId] = assetsCache[currentPlanId] || {};
    assetsCache[currentPlanId].frame = dataUrl;
    saveLocalAssets(assetsCache);
    renderFrame();
  });
});
els.frameRemoveBtn.addEventListener('click', () => {
  if (assetsCache[currentPlanId]) delete assetsCache[currentPlanId].frame;
  saveLocalAssets(assetsCache);
  els.frameInput.value = '';
  renderFrame();
});

function readImageResized(file, maxDim, cb){
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim){
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      cb(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/* ---------- لون المذكرة ---------- */
function applyColor(){
  const color = currentPlan().color || DEFAULT_COLOR;
  document.documentElement.style.setProperty('--tool', color);
  document.documentElement.style.setProperty('--tool-soft', hexToSoft(color));
}
function hexToSoft(hex){
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}
els.colorPicker.addEventListener('input', () => {
  currentPlan().color = els.colorPicker.value;
  touchPlan();
  applyColor();
});
els.colorResetBtn.addEventListener('click', () => {
  currentPlan().color = DEFAULT_COLOR;
  els.colorPicker.value = DEFAULT_COLOR;
  touchPlan();
  applyColor();
});

/* ---------- المعاينة الحيّة: القوالب الثمانية تقرأ نفس البيانات ---------- */
function planView(plan){
  const a = assetsCache[currentPlanId] || {};
  return Object.assign({}, plan, {
    year: effectiveYear(plan),
    logo: a.logo || '',
    template: T[plan.template] ? plan.template : 't5', // المذكرات القديمة تبقى بتصميمها الأصلي
  });
}

function renderThumbs(vm){
  $('thumbs').innerHTML = Object.keys(T).map(k =>
    `<button type="button" class="thumb${k === vm.template ? ' active' : ''}" data-t="${k}" aria-label="${NAMES[k]}">` +
    `<div class="thumb-frame"><div class="thumb-scale">${T[k](vm)}</div></div>` +
    `<span>${k.slice(1)}. ${NAMES[k]}</span></button>`).join('');
  scaleThumbs();
}
function scaleThumbs(){
  document.querySelectorAll('.thumb-frame').forEach(f => {
    const w = f.clientWidth;
    if (w) f.firstElementChild.style.transform = `scale(${w / 794})`;
  });
}

let pvRaf = null;
function renderPreview(){
  cancelAnimationFrame(pvRaf);
  pvRaf = requestAnimationFrame(renderPreviewNow);
}
function renderPreviewNow(){
  const plan = currentPlan();
  if (!plan) return;
  const vm = planView(plan);
  $('pvScale').innerHTML = T[vm.template](vm);
  renderThumbs(vm);
  applyZoom();
}

function initTemplates(){
  $('thumbs').addEventListener('click', (e) => {
    const b = e.target.closest('.thumb');
    if (!b || !currentPlanId) return;
    currentPlan().template = b.dataset.t;
    touchPlan();
    renderPreviewNow();
  });
}

/* ---------- التكبير والتصغير (مثل وورد) ---------- */
const ZOOM_KEY = 'lesson_plan_zoom_v1';
let zoom = 1;
let zoomAuto = true; // يلائم عرض العمود إلى أن يغيّره الأستاذ يدويًا

function initZoom(){
  try {
    const z = parseFloat(localStorage.getItem(ZOOM_KEY));
    if (z >= 0.3 && z <= 1.5){ zoom = z; zoomAuto = false; }
  } catch(e){}
  $('zoomOut').addEventListener('click', () => setZoom(zoom - 0.05));
  $('zoomIn').addEventListener('click', () => setZoom(zoom + 0.05));
  $('zoomRange').addEventListener('input', (e) => setZoom(e.target.value / 100));
  window.addEventListener('resize', () => { applyZoom(); scaleThumbs(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { applyZoom(); });
}
function setZoom(z){
  zoom = Math.min(1.5, Math.max(0.3, Math.round(z * 20) / 20));
  zoomAuto = false;
  try { localStorage.setItem(ZOOM_KEY, String(zoom)); } catch(e){}
  applyZoom();
}
function applyZoom(){
  const box = $('pvBox'), wrap = $('pvWrap'), sc = $('pvScale');
  const paper = sc.firstElementChild;
  if (!paper || !box.clientWidth) return;
  if (zoomAuto) zoom = Math.max(0.3, Math.min(1, (box.clientWidth - 16) / 794));
  sc.style.transform = `scale(${zoom})`;
  wrap.style.width = Math.round(794 * zoom) + 'px';
  wrap.style.height = Math.round(paper.offsetHeight * zoom) + 'px';
  $('zoomRange').value = Math.round(zoom * 100);
  $('zoomPct').textContent = Math.round(zoom * 100) + '%';
}

/* ---------- بطاقات الملء القابلة للطيّ ---------- */
const COLLAPSE_KEY = 'lesson_plan_collapsed_v1';
function initCollapsibles(){
  let state = {};
  try { state = JSON.parse(localStorage.getItem(COLLAPSE_KEY)) || {}; } catch(e){}
  const cards = Array.from(document.querySelectorAll('.panel-card[data-card]'));
  const save = () => { try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state)); } catch(e){} };
  const setCard = (card, collapsed) => {
    card.classList.toggle('collapsed', collapsed);
    card.querySelector('.panel-head').setAttribute('aria-expanded', String(!collapsed));
    state[card.dataset.card] = collapsed;
  };
  const updateAllBtn = () => {
    const anyOpen = cards.some(c => !c.classList.contains('collapsed'));
    $('collapseAllBtn').textContent = anyOpen ? 'طيّ الكل' : 'فتح الكل';
  };
  cards.forEach(card => {
    setCard(card, !!state[card.dataset.card]);
    const head = card.querySelector('.panel-head');
    const toggle = (e) => {
      if (e.target.closest('.switch')) return; // مفتاح التقويم لا يطوي البطاقة
      setCard(card, !card.classList.contains('collapsed'));
      save(); updateAllBtn();
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === head){ e.preventDefault(); toggle(e); }
    });
  });
  $('collapseAllBtn').addEventListener('click', () => {
    const collapse = cards.some(c => !c.classList.contains('collapsed'));
    cards.forEach(c => setCard(c, collapse));
    save(); updateAllBtn();
  });
  updateAllBtn();
}

/* ---------- أدوات صغيرة للأزرار (تحافظ على الأيقونة) ---------- */
function getBtnLabel(btn){ const l = btn.querySelector('.lbl'); return l ? l.textContent : btn.textContent; }
function setBtnLabel(btn, text){ const l = btn.querySelector('.lbl'); if (l) l.textContent = text; else btn.textContent = text; }

/* ---------- الحفظ في الحساب (Firestore، نص فقط) ---------- */
function sanitizedForFirestore(plan){
  const { id, level, template, color, school, yearSelect, yearManual, subject, klass, date, teacher,
    title, unit, session, duration, objectives, materials, stages, evalEnabled, eval: evalText,
    createdAt, updatedAt } = plan;
  return { id, level, template, color, school, yearSelect, yearManual, subject, klass, date, teacher,
    title, unit, session, duration, objectives, materials, stages, evalEnabled, eval: evalText,
    createdAt, updatedAt };
}

async function performSave(){
  if (!currentUser){ pendingSaveAfterLogin = true; openAuthModal(); return; }
  const plan = currentPlan();
  touchPlan();
  els.saveBtn.disabled = true;
  const original = getBtnLabel(els.saveBtn);
  setBtnLabel(els.saveBtn, 'جارٍ الحفظ…');
  try {
    await window.fbDb.collection('users').doc(currentUser.uid).collection('lessonPlans').doc(plan.id)
      .set(sanitizedForFirestore(plan), { merge: true });
    setSaveStatus('✓ تم الحفظ في حسابك');
  } catch(err){
    setSaveStatus('تعذّر الحفظ، حاول مجددًا');
  } finally {
    els.saveBtn.disabled = false;
    setBtnLabel(els.saveBtn, original);
  }
}
els.saveBtn.addEventListener('click', performSave);

els.deletePlanBtn.addEventListener('click', () => {
  deletePlan(currentPlanId);
  showGallery();
});

$('backToGalleryBtn').addEventListener('click', showGallery);

/* ---------- تصدير PDF ---------- */
els.exportPdfBtn.addEventListener('click', async () => {
  const btn = els.exportPdfBtn;
  const original = getBtnLabel(btn);
  const sc = $('pvScale');
  const oldTransform = sc.style.transform;
  btn.disabled = true;
  setBtnLabel(btn, 'جارٍ التجهيز…');
  try {
    sc.style.transform = 'none'; // نلتقط الورقة بحجمها الحقيقي مهما كان التكبير
    const canvas = await html2canvas(sc.firstElementChild, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight, position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 1){
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    const plan = currentPlan();
    const fileName = (plan.title || 'مذكرة-درس').replace(/[\\/:*?"<>|]/g, '').trim() || 'مذكرة-درس';
    pdf.save(`${fileName}.pdf`);
  } catch(err){
    alert('تعذّر إنشاء ملف PDF، حاول مجددًا.');
  } finally {
    sc.style.transform = oldTransform;
    btn.disabled = false;
    setBtnLabel(btn, original);
  }
});
els.printBtn.addEventListener('click', () => window.print());

/* ---------- مزامنة Firestore عند تسجيل الدخول ---------- */
function mergeRemotePlans(remotePlans){
  remotePlans.forEach(remote => {
    const local = plansCache[remote.id];
    if (!local || new Date(remote.updatedAt || 0) >= new Date(local.updatedAt || 0)){
      plansCache[remote.id] = Object.assign({}, local, remote);
    }
  });
  saveLocalPlans(plansCache);
}

async function fetchRemotePlans(){
  if (!currentUser) return;
  try {
    const snap = await window.fbDb.collection('users').doc(currentUser.uid).collection('lessonPlans').get();
    const remote = [];
    snap.forEach(doc => remote.push(doc.data()));
    mergeRemotePlans(remote);
    if ($('galleryView') && !$('galleryView').classList.contains('hidden')) renderGallery();
  } catch(err){ /* تجاهل بصمت لو ما فيه اتصال */ }
}

/* ---------- تهيئة ---------- */
function init(){
  initAuthModal();
  initAuthMenu();
  initCollapsibles();
  initZoom();
  initTemplates();

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged((fbUser) => {
      currentUser = fbUser ? {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email,
        email: fbUser.email,
        picture: fbUser.photoURL || null,
      } : null;
      renderAuthUI();
      if (currentUser){
        fetchRemotePlans();
        if (pendingSaveAfterLogin){
          pendingSaveAfterLogin = false;
          if (currentPlanId) performSave();
        }
      }
    });
  } else {
    renderAuthUI();
  }

  showGallery();
}

document.addEventListener('DOMContentLoaded', init);
