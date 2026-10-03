/* =====================================================================
   المصادقة (Firebase Auth)
===================================================================== */
let currentUser = null;

// تهريب النصوص قبل إدراجها في HTML
function esc(v){ return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function setBuilderMode(on){
  document.body.classList.toggle('builder-mode', on);
  document.querySelectorAll('.builder-only').forEach(el => el.classList.toggle('hidden', !on));
}
function showAuthGate(){
  document.getElementById('authGate').classList.remove('hidden');
  document.getElementById('listView').classList.add('hidden');
  document.getElementById('builderView').classList.add('hidden');
  setBuilderMode(false);
}
function hideAuthGate(){
  document.getElementById('authGate').classList.add('hidden');
}

function renderUserBar(){
  const bar = document.getElementById('userBar');
  if (!currentUser){ bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  bar.innerHTML = `<span class="uname">${esc(currentUser.displayName || currentUser.email)}</span> <button id="signOutBtn" class="sb-signout-btn">خروج</button>`;
  document.getElementById('signOutBtn').addEventListener('click', () => window.fbAuth.signOut());
}

function authErrMsg(code){
  const map = {
    'auth/invalid-email': 'بريد إلكتروني غير صالح.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد.',
    'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.',
    'auth/weak-password': 'كلمة المرور ضعيفة جدًا (6 أحرف على الأقل).',
  };
  return map[code] || 'حدث خطأ، حاول مرة أخرى.';
}

function renderAuthForm(mode = 'login', errorMsg = ''){
  const isLogin = mode === 'login';
  const wrap = document.getElementById('authFormWrap');
  wrap.innerHTML = `
    ${errorMsg ? `<p style="color:#c0392b;font-size:.85rem;margin:0 0 10px;text-align:center;">${errorMsg}</p>` : ''}
    <form id="authForm">
      ${!isLogin ? `<input type="text" id="authName" class="sb-input" placeholder="الاسم" style="margin-bottom:10px;">` : ''}
      <input type="email" id="authEmail" class="sb-input" placeholder="البريد الإلكتروني" required style="margin-bottom:10px;">
      <input type="password" id="authPassword" class="sb-input" placeholder="كلمة المرور" required style="margin-bottom:14px;">
      <button type="submit" id="authSubmitBtn" class="sb-publish-btn">${isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</button>
    </form>
    <div class="sb-auth-switch">
      ${isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
      <button type="button" id="authSwitchBtn">${isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}</button>
    </div>`;

  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const nameInput = document.getElementById('authName');
    const btn = document.getElementById('authSubmitBtn');
    btn.disabled = true; btn.textContent = '…';
    try {
      if (isLogin){
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (nameInput && nameInput.value.trim()){
          await cred.user.updateProfile({ displayName: nameInput.value.trim() });
        }
      }
    } catch (err){
      renderAuthForm(mode, authErrMsg(err.code));
    }
  });
  document.getElementById('authSwitchBtn').addEventListener('click', () => renderAuthForm(isLogin ? 'signup' : 'login'));
}

document.getElementById('googleAuthBtn').addEventListener('click', async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await window.fbAuth.signInWithPopup(provider);
  } catch (err){
    if (err.code !== 'auth/popup-closed-by-user') renderAuthForm('login', authErrMsg(err.code));
  }
});

window.fbAuth.onAuthStateChanged((user) => {
  currentUser = user;
  renderUserBar();
  if (user){
    hideAuthGate();
    document.getElementById('builderView').classList.add('hidden');
    setBuilderMode(false);
    document.getElementById('listView').classList.remove('hidden');
    renderSurveysList();
  } else {
    showAuthGate();
    renderAuthForm('login');
  }
});

/* =====================================================================
   القوالب الجاهزة
===================================================================== */
let qCounter = 0;
function mkQ(type, title, options){
  qCounter++;
  return { key: 'q' + Date.now() + '_' + qCounter, type, title, required: false, options: [...options] };
}
function likertOptions(n){
  const sets = {
    2: ['موافق', 'غير موافق'],
    3: ['موافق', 'محايد', 'غير موافق'],
    4: ['موافق بشدة', 'موافق', 'غير موافق', 'غير موافق بشدة'],
    5: ['موافق بشدة', 'موافق', 'محايد', 'غير موافق', 'غير موافق بشدة'],
  };
  return sets[n] || sets[5];
}
const LIKERT_KEYS = [2,3,4,5].map(n => likertOptions(n).join('|'));
// هل يُعامَل السؤال كمقياس رقمي في التحليل (متوسط، كرونباخ، ارتباط)؟ نفس منطق results.js
function isScaleQuestion(q){
  if (q.type === 'rating') return true;
  if ((q.type !== 'radio' && q.type !== 'dropdown') || !Array.isArray(q.options) || q.options.length < 2) return false;
  if (typeof q.scale === 'boolean') return q.scale;
  return LIKERT_KEYS.includes(q.options.map(o => String(o).trim()).join('|'));
}
function freshKey(){ return 'q' + Date.now() + '_' + (++qCounter); }
const TEMPLATES = {
  blank: { title: '', description: '', sections: [{ id: 's1', title: 'المحور الأول', questions: [] }] },
  employee: {
    title: 'استبيان رضا الموظفين', description: 'رأيك يهمنا لتحسين بيئة العمل. الإجابات تُستخدم لأغراض التحسين فقط.',
    sections: [{ id: 's1', title: 'الرضا الوظيفي', questions: [
      mkQ('radio', 'أشعر بالرضا العام عن بيئة العمل', likertOptions(5)),
      mkQ('radio', 'أشعر أن جهدي مُقدَّر من الإدارة', likertOptions(5)),
      mkQ('long', 'ما الذي تقترح تحسينه في بيئة العمل؟', []),
    ]}],
  },
  course: {
    title: 'استبيان تقييم دورة تدريبية', description: 'ساعدنا في تطوير الدورة من خلال تقييمك الصادق.',
    sections: [{ id: 's1', title: 'تقييم الدورة', questions: [
      mkQ('rating', 'كيف تقيّم محتوى الدورة بشكل عام؟', []),
      mkQ('radio', 'المدرب كان واضحًا في الشرح', likertOptions(5)),
      mkQ('long', 'ما أكثر شيء استفدت منه؟', []),
    ]}],
  },
  opinion: {
    title: 'استطلاع رأي عام', description: 'رأيك يهمنا! يستغرق الاستبيان دقائق قليلة.',
    sections: [{ id: 's1', title: 'أسئلة عامة', questions: [
      mkQ('radio', 'ما مدى موافقتك على الموضوع المطروح؟', likertOptions(5)),
      mkQ('long', 'أضف أي ملاحظات إضافية', []),
    ]}],
  },
};
const PRESET_QUESTIONS = {
  gender:    () => mkQ('radio', 'الجنس', ['ذكر', 'أنثى']),
  age:       () => mkQ('radio', 'الفئة العمرية', ['أقل من 18', '18 - 24', '25 - 34', '35 - 44', '45 - 54', '55 فأكثر']),
  education: () => mkQ('radio', 'المؤهل العلمي', ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'ماجستير', 'دكتوراه']),
  job:       () => mkQ('radio', 'الحالة المهنية', ['طالب', 'موظف', 'عامل حر', 'باحث عن عمل', 'متقاعد']),
};

/* =====================================================================
   التخزين المحلي (مسودات غير منشورة فقط + الحفظ التلقائي أثناء التعديل)
===================================================================== */
// المسودات مرتبطة بالحساب: سابقًا كانت مشتركة بين كل الحسابات على نفس المتصفح
const LEGACY_DRAFTS_KEY = 'sb_local_drafts_v1';
function draftsKey(){ return LEGACY_DRAFTS_KEY + '_' + (currentUser ? currentUser.uid : 'anon'); }
function loadLocalDrafts(){
  try {
    const legacy = localStorage.getItem(LEGACY_DRAFTS_KEY);
    if (legacy && currentUser){
      // ترحيل المسودات القديمة لأول حساب يسجّل الدخول
      const mine = JSON.parse(localStorage.getItem(draftsKey())) || [];
      localStorage.setItem(draftsKey(), JSON.stringify([...mine, ...(JSON.parse(legacy) || [])]));
      localStorage.removeItem(LEGACY_DRAFTS_KEY);
    }
    return JSON.parse(localStorage.getItem(draftsKey())) || [];
  } catch(e){ return []; }
}
function saveLocalDrafts(list){ try { localStorage.setItem(draftsKey(), JSON.stringify(list)); } catch(e){} }
function upsertLocalDraft(rec){
  const list = loadLocalDrafts();
  const i = list.findIndex(s => s.localId === rec.localId);
  if (i >= 0) list[i] = rec; else list.unshift(rec);
  saveLocalDrafts(list);
}
function deleteLocalDraft(localId){ saveLocalDrafts(loadLocalDrafts().filter(s => s.localId !== localId)); }

let current = null;
let dirty = false; // تعديلات غير محفوظة على استبيان منشور

function newSurveyFromTemplate(tplKey){
  const tpl = TEMPLATES[tplKey] || TEMPLATES.blank;
  current = {
    localId: 'ls_' + Date.now(), publishedId: null,
    title: tpl.title, description: tpl.description, color: '#2F5770', thanksMessage: '',
    sections: JSON.parse(JSON.stringify(tpl.sections)),
  };
  // مفاتيح جديدة لكل استبيان بدل مشاركة نفس المفاتيح بين كل الاستبيانات المنشأة من القالب
  current.sections.forEach(sec => sec.questions.forEach(q => { q.key = freshKey(); }));
  openBuilder();
}

function openBuilder(){
  document.getElementById('listView').classList.add('hidden');
  document.getElementById('builderView').classList.remove('hidden');
  setBuilderMode(true);
  zoom = 'fit';
  // إخفاء نتيجة نشر استبيان سابق حتى لا تظهر روابط استبيان آخر
  document.getElementById('publishResult').classList.add('hidden');
  updatePublishBtnLabel();
  dirty = false;
  fillBuilderFromCurrent();
}
function updatePublishBtnLabel(){
  document.querySelector('#publishBtn .lbl').textContent = current && current.publishedId ? 'حفظ التعديلات على الاستبيان المنشور' : 'نشر الاستبيان ومشاركته';
}
function backToList(){
  if (dirty && current && current.publishedId && !confirm('لديك تعديلات لم تُحفظ على الاستبيان المنشور. الخروج بدون حفظ؟')) return;
  dirty = false;
  document.getElementById('builderView').classList.add('hidden');
  setBuilderMode(false);
  document.getElementById('listView').classList.remove('hidden');
  renderSurveysList();
}
function fillBuilderFromCurrent(){
  document.getElementById('surveyTitle').value = current.title || '';
  document.getElementById('surveyDesc').value = current.description || '';
  document.getElementById('surveyColor').value = current.color || '#2F5770';
  document.getElementById('thanksMessage').value = current.thanksMessage || '';
  renderSections();
}
function autosave(){
  schedulePreview();
  if (current && current.publishedId){ dirty = true; return; }
  if (!current) return; // بعد النشر، التعديلات تُحفظ فقط بالضغط على "تحديث"
  upsertLocalDraft({ localId: current.localId, title: current.title || '(بدون عنوان)', color: current.color, updatedAt: new Date().toISOString(), data: current });
}

/* =====================================================================
   قائمة الاستبيانات (Firestore للمنشور + محلي للمسودات)
===================================================================== */
async function renderSurveysList(){
  const wrap = document.getElementById('surveysList');
  wrap.innerHTML = `<p class="sb-empty-msg">جارٍ التحميل...</p>`;

  let published = [];
  try {
    const snap = await window.fbDb.collection('surveys').where('owner', '==', currentUser.uid).get();
    snap.forEach(doc => published.push({ id: doc.id, ...doc.data() }));
  } catch (err){
    wrap.innerHTML = `<p class="sb-empty-msg">تعذّر تحميل استبياناتك: ${esc(err.message)}</p>`;
    return;
  }

  const localDrafts = loadLocalDrafts();
  wrap.innerHTML = '';

  if (published.length === 0 && localDrafts.length === 0){
    wrap.innerHTML = `<p class="sb-empty-msg">لا توجد استبيانات بعد. اضغط "+ استبيان جديد" للبدء.</p>`;
    return;
  }

  published.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'sb-draft-card';
    card.innerHTML = `
      <span class="sb-draft-dot" style="background:${rec.color || '#2F5770'}"></span>
      <div class="sb-draft-info">
        <p class="sb-draft-title">${esc(rec.title)}</p>
        <p class="sb-draft-meta">منشور · ${Number(rec.responseCount) || 0} إجابة</p>
      </div>
      <div class="sb-draft-actions">
        <button data-act="edit">تعديل</button>
        <a data-act="results">النتائج</a>
        <button data-act="del" class="danger">حذف</button>
      </div>`;
    card.querySelector('[data-act="edit"]').addEventListener('click', async () => {
      current = {
        localId: 'ls_' + Date.now(), publishedId: rec.id,
        title: rec.title, description: rec.description, color: rec.color, thanksMessage: rec.thanksMessage,
        sections: rebuildSectionsFromFlatQuestions(rec.questions, rec.sections),
      };
      openBuilder();
    });
    card.querySelector('[data-act="results"]').addEventListener('click', () => {
      location.href = `results.html?id=${rec.id}`;
    });
    card.querySelector('[data-act="del"]').addEventListener('click', async () => {
      if (!confirm('حذف هذا الاستبيان نهائيًا (والإجابات المرتبطة به)؟')) return;
      try {
        // حذف الإجابات أولاً (Firestore لا يحذف المجموعات الفرعية تلقائيًا)
        try {
          const respSnap = await window.fbDb.collection('surveys').doc(rec.id).collection('responses').get();
          let batch = window.fbDb.batch(), n = 0;
          for (const d of respSnap.docs){
            batch.delete(d.ref);
            if (++n % 400 === 0){ await batch.commit(); batch = window.fbDb.batch(); }
          }
          if (n % 400) await batch.commit();
        } catch (e){ console.warn('تعذّر حذف الإجابات:', e); }
        await window.fbDb.collection('surveys').doc(rec.id).delete();
        renderSurveysList();
      } catch (err){ alert('تعذّر الحذف: ' + err.message); }
    });
    wrap.appendChild(card);
  });

  localDrafts.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'sb-draft-card';
    card.innerHTML = `
      <span class="sb-draft-dot" style="background:${rec.color || '#2F5770'}"></span>
      <div class="sb-draft-info">
        <p class="sb-draft-title">${esc(rec.title)}</p>
        <p class="sb-draft-meta">مسودة غير منشورة · آخر تعديل ${new Date(rec.updatedAt).toLocaleDateString('ar')}</p>
      </div>
      <div class="sb-draft-actions">
        <button data-act="edit">تعديل</button>
        <button data-act="del" class="danger">حذف</button>
      </div>`;
    card.querySelector('[data-act="edit"]').addEventListener('click', () => { current = rec.data; openBuilder(); });
    card.querySelector('[data-act="del"]').addEventListener('click', () => {
      if (confirm('حذف هذه المسودة؟')){ deleteLocalDraft(rec.localId); renderSurveysList(); }
    });
    wrap.appendChild(card);
  });
}

function rebuildSectionsFromFlatQuestions(flatQuestions, savedSections){
  // الاستبيانات الحديثة تحفظ المحاور بترتيبها (حتى الفارغة منها ومكررة العنوان)
  if (Array.isArray(savedSections) && savedSections.length){
    const sections = savedSections.map((t, i) => ({ id: 's' + i, title: t, questions: [] }));
    (flatQuestions || []).forEach(q => {
      const sec = sections[q.sectionIndex] || sections[sections.length - 1];
      sec.questions.push({ key: q.id, type: q.type, title: q.title, required: q.required, options: q.options || [], ...(typeof q.scale === 'boolean' ? { scale: q.scale } : {}) });
    });
    return sections;
  }
  const bySection = {};
  const order = [];
  (flatQuestions || []).forEach(q => {
    const sTitle = q.section || 'المحور الأول';
    if (!bySection[sTitle]){ bySection[sTitle] = []; order.push(sTitle); }
    bySection[sTitle].push({ key: q.id, type: q.type, title: q.title, required: q.required, options: q.options || [], ...(typeof q.scale === 'boolean' ? { scale: q.scale } : {}) });
  });
  if (order.length === 0) return [{ id: 's1', title: 'المحور الأول', questions: [] }];
  return order.map((t, i) => ({ id: 's' + i, title: t, questions: bySection[t] }));
}

/* =====================================================================
   المحاور والأسئلة (بناء الواجهة)
===================================================================== */
function escapeAttr(s){ return esc(s); }
const TYPE_META = {
  short: { icon: '📝', label: 'نص قصير' }, long: { icon: '📄', label: 'نص طويل' },
  radio: { icon: '⚪', label: 'اختيار واحد' }, checkbox: { icon: '☑️', label: 'اختيار متعدد' },
  dropdown: { icon: '🔽', label: 'قائمة منسدلة' }, rating: { icon: '⭐', label: 'تقييم نجوم' }, yesno: { icon: '👍', label: 'نعم / لا' },
};

function renderSections(){
  schedulePreview();
  const wrap = document.getElementById('sectionsList');
  wrap.innerHTML = '';
  current.sections.forEach((section, sIdx) => {
    const sBox = document.createElement('div');
    sBox.className = 'sb-section';
    sBox.innerHTML = `
      <div class="sb-section-head">
        <input type="text" class="sb-section-title-input" value="${escapeAttr(section.title)}">
        ${current.sections.length > 1 ? `<button class="sb-section-del" title="حذف المحور">✕ حذف المحور</button>` : ''}
      </div>
      <div class="sb-questions"></div>`;
    sBox.querySelector('.sb-section-title-input').addEventListener('input', e => { section.title = e.target.value; autosave(); });
    const delBtn = sBox.querySelector('.sb-section-del');
    if (delBtn) delBtn.addEventListener('click', () => { current.sections.splice(sIdx, 1); renderSections(); autosave(); });
    const qWrap = sBox.querySelector('.sb-questions');
    section.questions.forEach((q, qIdx) => qWrap.appendChild(renderQuestionCard(q, qIdx, section)));
    wrap.appendChild(sBox);
  });
}

function renderQuestionCard(q, qIdx, section){
  const meta = TYPE_META[q.type];
  const card = document.createElement('div');
  card.className = 'sb-question';
  card.dataset.key = q.key;
  card.innerHTML = `
    <div class="sb-q-head">
      <span class="sb-q-number">${qIdx + 1}.</span>
      <span class="sb-q-icon">${meta.icon}</span>
      <span class="sb-q-type-label">${meta.label}</span>
      <div class="sb-q-actions">
        <button data-act="dup" title="تكرار">📋</button>
        <button data-act="up" title="أعلى">↑</button>
        <button data-act="down" title="أسفل">↓</button>
        <button data-act="del" title="حذف">✕</button>
      </div>
    </div>
    <input type="text" class="sb-input q-title" placeholder="اكتب نص السؤال هنا..." value="${escapeAttr(q.title)}">
    <div class="sb-likert-wrap"></div>
    <div class="sb-q-options-wrap"></div>
    <label class="sb-q-required">
      <input type="checkbox" class="q-required" ${q.required ? 'checked' : ''}>
      إجابة إلزامية
    </label>
    ${(q.type === 'radio' || q.type === 'dropdown') ? `<label class="sb-q-required" title="فعّلها لأسئلة ليكرت والتقييم المرتبة من الأعلى للأدنى، وعطّلها لأسئلة مثل الجنس أو العمر">
      <input type="checkbox" class="q-scale" ${isScaleQuestion(q) ? 'checked' : ''}>
      سؤال مقياس (يدخل في المتوسط وكرونباخ ألفا والارتباط)
    </label>` : ''}`;

  card.querySelector('.q-title').addEventListener('input', e => { q.title = e.target.value; autosave(); });
  card.querySelector('.q-required').addEventListener('change', e => { q.required = e.target.checked; autosave(); });
  const scaleBox = card.querySelector('.q-scale');
  if (scaleBox) scaleBox.addEventListener('change', e => { q.scale = e.target.checked; autosave(); });
  card.querySelector('[data-act="del"]').addEventListener('click', () => { section.questions.splice(qIdx, 1); renderSections(); autosave(); });
  card.querySelector('[data-act="dup"]').addEventListener('click', () => {
    const copy = JSON.parse(JSON.stringify(q));
    copy.key = 'q' + Date.now() + '_' + (++qCounter);
    section.questions.splice(qIdx + 1, 0, copy);
    renderSections(); autosave();
  });
  card.querySelector('[data-act="up"]').addEventListener('click', () => {
    if (qIdx === 0) return;
    [section.questions[qIdx-1], section.questions[qIdx]] = [section.questions[qIdx], section.questions[qIdx-1]];
    renderSections(); autosave();
  });
  card.querySelector('[data-act="down"]').addEventListener('click', () => {
    if (qIdx === section.questions.length - 1) return;
    [section.questions[qIdx+1], section.questions[qIdx]] = [section.questions[qIdx], section.questions[qIdx+1]];
    renderSections(); autosave();
  });

  if (q.type === 'radio' || q.type === 'checkbox' || q.type === 'dropdown'){
    const likertWrap = card.querySelector('.sb-likert-wrap');
    likertWrap.innerHTML = `<div class="sb-likert-picker"><span>تعبئة سريعة (مقياس):</span>
      <select class="likert-select"><option value="">— بدون —</option>
        <option value="2">خيارين</option><option value="3">3 خيارات</option><option value="4">4 خيارات</option><option value="5">5 خيارات</option>
      </select></div>`;
    likertWrap.querySelector('.likert-select').addEventListener('change', e => {
      const n = parseInt(e.target.value, 10);
      if (n){ q.options = likertOptions(n); q.scale = true; renderSections(); autosave(); }
    });
    const optWrap = card.querySelector('.sb-q-options-wrap');
    const optList = document.createElement('div');
    optList.className = 'sb-q-options';
    renderOptions(optList, q);
    optWrap.appendChild(optList);
    const addBtn = document.createElement('button');
    addBtn.type = 'button'; addBtn.className = 'sb-add-option-btn'; addBtn.textContent = '+ إضافة خيار';
    addBtn.addEventListener('click', () => { q.options.push(''); renderOptions(optList, q); autosave(); });
    optWrap.appendChild(addBtn);
  }
  return card;
}

function renderOptions(optList, q){
  optList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const row = document.createElement('div');
    row.className = 'sb-q-option-row';
    row.innerHTML = `<input type="text" class="sb-input" placeholder="خيار ${i+1}" value="${escapeAttr(opt)}"><button type="button">✕</button>`;
    row.querySelector('input').addEventListener('input', e => { q.options[i] = e.target.value; autosave(); });
    row.querySelector('button').addEventListener('click', () => { q.options.splice(i, 1); renderOptions(optList, q); autosave(); });
    optList.appendChild(row);
  });
}

/* =====================================================================
   ربط الأحداث العامة
===================================================================== */
document.getElementById('newSurveyBtn').addEventListener('click', () => {
  document.getElementById('templateModal').classList.remove('hidden');
  document.body.classList.add('sb-modal-open');
});
document.getElementById('closeTemplateModal').addEventListener('click', () => {
  document.getElementById('templateModal').classList.add('hidden');
  document.body.classList.remove('sb-modal-open');
});
document.querySelectorAll('.sb-template-card').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('templateModal').classList.add('hidden');
    document.body.classList.remove('sb-modal-open');
    newSurveyFromTemplate(btn.dataset.tpl);
  });
});

document.getElementById('backToListBtn').addEventListener('click', backToList);
document.getElementById('surveyTitle').addEventListener('input', e => { current.title = e.target.value; autosave(); });
document.getElementById('surveyDesc').addEventListener('input', e => { current.description = e.target.value; autosave(); });
document.getElementById('surveyColor').addEventListener('input', e => { current.color = e.target.value; autosave(); });
document.getElementById('thanksMessage').addEventListener('input', e => { current.thanksMessage = e.target.value; autosave(); });

document.getElementById('addSectionBtn').addEventListener('click', () => {
  current.sections.push({ id: 's' + Date.now(), title: 'محور جديد', questions: [] });
  renderSections(); autosave();
});
document.querySelectorAll('.sb-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    current.sections[current.sections.length - 1].questions.push(PRESET_QUESTIONS[btn.dataset.preset]());
    renderSections(); autosave();
  });
});
document.querySelectorAll('.sb-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const q = mkQ(btn.dataset.type, '', ['radio','checkbox','dropdown'].includes(btn.dataset.type) ? ['', ''] : []);
    current.sections[current.sections.length - 1].questions.push(q);
    renderSections(); autosave();
  });
});
document.getElementById('clearSurveyBtn').addEventListener('click', () => {
  if (!confirm('سيتم حذف كل الأسئلة والمحاور في هذا الاستبيان. متأكد؟')) return;
  current.sections = [{ id: 's' + Date.now(), title: 'المحور الأول', questions: [] }];
  renderSections(); autosave();
});

document.getElementById('publishBtn').addEventListener('click', async () => {
  const title = (current.title || '').trim();
  if (!title){ alert('يرجى كتابة عنوان للاستبيان.'); return; }

  const allQuestions = [];
  for (const section of current.sections){
    for (const q of section.questions){
      if (!(q.title || '').trim()){ alert('يرجى ملء نص كل سؤال قبل النشر.'); return; }
      let options = q.options || [];
      if (['radio','checkbox','dropdown'].includes(q.type)){
        options = options.map(o => String(o).trim());
        if (options.some(o => !o)){ alert(`يرجى ملء كل الخيارات (أو حذف الفارغ منها) في السؤال: ${q.title}`); return; }
        if (options.length < 2){ alert(`السؤال "${q.title}" يحتاج خيارين على الأقل.`); return; }
        if (new Set(options).size !== options.length){ alert(`يوجد خيار مكرر في السؤال: ${q.title}`); return; }
      }
      const item = { id: q.key, type: q.type, title: q.title, required: !!q.required, options, section: section.title, sectionIndex: current.sections.indexOf(section) };
      if (typeof q.scale === 'boolean') item.scale = q.scale;
      allQuestions.push(item);
    }
  }
  if (allQuestions.length === 0){ alert('أضف سؤالاً واحدًا على الأقل.'); return; }

  const payload = {
    owner: currentUser.uid, title, description: current.description || '', color: current.color || '#2F5770',
    thanksMessage: current.thanksMessage || '', questions: allQuestions,
    sections: current.sections.map(sec => sec.title),
  };

  const btn = document.getElementById('publishBtn');
  btn.disabled = true; btn.querySelector('.lbl').textContent = 'جارٍ النشر...';

  try {
    let docId = current.publishedId;
    if (docId){
      await window.fbDb.collection('surveys').doc(docId).update(payload);
    } else {
      payload.createdAt = new Date().toISOString();
      payload.responseCount = 0;
      const ref = await window.fbDb.collection('surveys').add(payload);
      docId = ref.id;
      current.publishedId = docId;
      deleteLocalDraft(current.localId); // كان مسودة محلية، صار منشورًا
    }

    dirty = false;
    // روابط نسبية لمكان الصفحة الحالية (تعمل أينما رُفع المجلد)
    const shareUrl = new URL(`fill.html?id=${docId}`, location.href).href;
    const resultsUrl = new URL(`results.html?id=${docId}`, location.href).href;
    document.getElementById('shareLink').value = shareUrl;
    document.getElementById('resultsLink').value = resultsUrl;
    document.getElementById('openResultsBtn').href = resultsUrl;
    document.getElementById('publishResult').classList.remove('hidden');
    document.body.classList.add('sb-modal-open');
  } catch (err){
    alert('حدث خطأ أثناء النشر: ' + err.message);
  } finally {
    btn.disabled = false; updatePublishBtnLabel();
  }
});

function flashCopyBtn(btn, textToCopy){
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(textToCopy).catch(() => {});
  else { const t = document.createElement('textarea'); t.value = textToCopy; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  const original = btn.textContent;
  btn.textContent = '✅'; btn.disabled = true;
  setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
}
document.getElementById('copyShareBtn').addEventListener('click', function(){ flashCopyBtn(this, document.getElementById('shareLink').value); });
document.getElementById('copyResultsBtn').addEventListener('click', function(){ flashCopyBtn(this, document.getElementById('resultsLink').value); });

document.getElementById('closePublishResult').addEventListener('click', () => {
  document.getElementById('publishResult').classList.add('hidden');
  document.body.classList.remove('sb-modal-open');
});

/* =====================================================================
   معاينة الورقة الحية (A4) + التكبير والتصغير
===================================================================== */
const PAGE_W = 794, PAGE_H = 1123, PAGE_LIMIT = PAGE_H - 56 - 26; // حدّ المحتوى قبل تذييل الصفحة
let zoom = 'fit';
let previewTimer = null;
let pageCount = 0;

function schedulePreview(){
  clearTimeout(previewTimer);
  previewTimer = setTimeout(renderPreview, 120);
}

function qTitleHtml(q, num){
  const t = (q.title || '').trim();
  return `<div class="pp-qt"><span class="num">${num}.</span>${t ? esc(t) : '<span class="empty">(سؤال بدون نص)</span>'}${q.required ? ' <span class="req">*</span>' : ''}</div>`;
}
function optsHtml(opts, round){
  return `<div class="pp-opts">${opts.map(o => `<span class="pp-opt"><span class="pp-box${round ? ' round' : ''}"></span>${esc(o || '…')}</span>`).join('')}</div>`;
}
function questionBlock(q, num){
  let body = '';
  if (q.type === 'short') body = `<div class="pp-lines"><div class="pp-line"></div></div>`;
  else if (q.type === 'long') body = `<div class="pp-lines"><div class="pp-line"></div><div class="pp-line"></div><div class="pp-line"></div></div>`;
  else if (q.type === 'radio' || q.type === 'dropdown') body = optsHtml(q.options || [], true);
  else if (q.type === 'checkbox') body = optsHtml(q.options || [], false);
  else if (q.type === 'yesno') body = optsHtml(['نعم', 'لا'], true);
  else if (q.type === 'rating') body = `<div class="pp-stars">☆☆☆☆☆</div>`;
  return `<div class="pp-q" data-key="${esc(q.key)}">${qTitleHtml(q, num)}${body}</div>`;
}
// أسئلة ليكرت المتتالية بنفس الخيارات تُعرض كجدول، كما في الاستبيانات الورقية المعتادة
function likertTableBlock(group, startNum){
  const opts = group[0].options;
  return `<table class="pp-likert"><tr><td class="lb">العبارة</td>${opts.map(o => `<td class="lb">${esc(o)}</td>`).join('')}</tr>` +
    group.map((q, i) => `<tr class="pp-q" data-key="${esc(q.key)}"><td style="text-align:right;">${startNum + i}. ${q.title.trim() ? esc(q.title) : '<span style="color:#a0aab4">(سؤال بدون نص)</span>'}${q.required ? ' <span style="color:#c0392b">*</span>' : ''}</td>${opts.map(() => `<td><span class="pp-box round" style="display:inline-block"></span></td>`).join('')}</tr>`).join('') +
    `</table>`;
}

function buildPreviewBlocks(){
  const blocks = [];
  const d = new Date().toLocaleDateString('ar');
  blocks.push(`<div class="pp-head"><h1 class="pp-title">${esc(current.title || 'عنوان الاستبيان')}</h1>
    ${current.description ? `<p class="pp-desc">${esc(current.description)}</p>` : ''}
    <div class="pp-meta"><span>التاريخ: ${d}</span><span>الأسئلة المعلّمة بـ * إلزامية</span></div></div>`);
  let num = 1;
  const multi = current.sections.length > 1;
  current.sections.forEach(section => {
    if (multi || section.questions.length) blocks.push(`<div class="pp-section">${esc(section.title || 'محور')}</div>`);
    const qs = section.questions;
    for (let i = 0; i < qs.length; ){
      const q = qs[i];
      if (q.type === 'radio' && isScaleQuestion(q)){
        const key = (q.options || []).join('|');
        let j = i;
        while (j < qs.length && qs[j].type === 'radio' && isScaleQuestion(qs[j]) && (qs[j].options || []).join('|') === key) j++;
        if (j - i >= 2){
          // تقسيم الجداول الطويلة حتى تنتقل بين الصفحات بسلاسة
          for (let k = i; k < j; k += 10){ const g = qs.slice(k, Math.min(j, k + 10)); blocks.push(likertTableBlock(g, num)); num += g.length; }
          i = j; continue;
        }
      }
      blocks.push(questionBlock(q, num++));
      i++;
    }
  });
  if (num === 1) blocks.push(`<div class="pp-empty">أضف أسئلة من اللوحة لتظهر هنا على الورقة</div>`);
  return blocks;
}

function newPaper(){
  const paper = document.createElement('div');
  paper.className = 'paper';
  paper.style.setProperty('--pc', current.color || '#2F5770');
  return paper;
}

function renderPreview(){
  if (!current) return;
  const view = document.getElementById('paperView');
  let measure = document.querySelector('.paper-measure');
  if (!measure){ measure = document.createElement('div'); measure.className = 'paper-measure'; document.body.appendChild(measure); }
  measure.innerHTML = '';
  const pages = [];
  let paper = newPaper(); measure.appendChild(paper); pages.push(paper);
  const tmp = document.createElement('div');
  buildPreviewBlocks().forEach(html => {
    tmp.innerHTML = html;
    const el = tmp.firstElementChild;
    paper.appendChild(el);
    if (el.offsetTop + el.offsetHeight > PAGE_LIMIT && paper.children.length > 1){
      paper.removeChild(el);
      paper = newPaper(); measure.appendChild(paper); pages.push(paper);
      paper.appendChild(el);
    }
  });
  pageCount = pages.length;
  const scrollTop = view.scrollTop;
  view.innerHTML = '';
  pages.forEach((pg, i) => {
    const foot = document.createElement('div');
    foot.className = 'pp-foot';
    foot.innerHTML = `<span>${esc(current.title || '')}</span><span>صفحة ${i + 1} من ${pages.length}</span>`;
    pg.appendChild(foot);
    const holder = document.createElement('div');
    holder.className = 'page-holder';
    holder.appendChild(pg);
    view.appendChild(holder);
  });
  measure.innerHTML = '';
  document.getElementById('pagesInfo').textContent = `${pages.length} ${pages.length === 1 ? 'صفحة' : (pages.length === 2 ? 'صفحتان' : 'صفحات')}`;
  applyZoom();
  view.scrollTop = scrollTop;
}

function fitScale(){
  const stage = document.getElementById('stage');
  return Math.max(0.2, Math.min((stage.clientWidth - 60) / PAGE_W, 1.6));
}
function applyZoom(){
  const s = zoom === 'fit' ? fitScale() : zoom;
  document.querySelectorAll('#paperView .page-holder').forEach(h => {
    h.style.width = (PAGE_W * s) + 'px'; h.style.height = (PAGE_H * s) + 'px';
    h.firstElementChild.style.transform = `scale(${s})`;
  });
  document.getElementById('zoomVal').textContent = Math.round(s * 100) + '%';
}
function setZoom(dir){
  let s = zoom === 'fit' ? fitScale() : zoom;
  s = Math.round((s + dir * 0.1) * 10) / 10;
  zoom = Math.max(0.2, Math.min(2.5, s));
  applyZoom();
}
document.getElementById('zoomIn').addEventListener('click', () => setZoom(1));
document.getElementById('zoomOut').addEventListener('click', () => setZoom(-1));
document.getElementById('zoomFit').addEventListener('click', () => { zoom = 'fit'; applyZoom(); });
document.getElementById('stage').addEventListener('wheel', e => {
  if (!e.ctrlKey) return; // Ctrl + عجلة الفأرة للتكبير والتصغير
  e.preventDefault(); setZoom(e.deltaY < 0 ? 1 : -1);
}, { passive: false });
window.addEventListener('resize', () => { if (zoom === 'fit') applyZoom(); });

// النقر على سؤال في الورقة ينقل إلى بطاقته في اللوحة
document.getElementById('paperView').addEventListener('click', e => {
  const q = e.target.closest('.pp-q');
  if (!q) return;
  document.querySelectorAll('#paperView .pp-q.hl').forEach(x => x.classList.remove('hl'));
  q.classList.add('hl');
  const card = document.querySelector(`#sectionsList .sb-question[data-key="${CSS.escape(q.dataset.key)}"]`);
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
  const input = card.querySelector('.q-title'); if (input) setTimeout(() => input.focus({ preventScroll: true }), 400);
});
// التركيز على سؤال في اللوحة يبرزه على الورقة
document.getElementById('sectionsList').addEventListener('focusin', e => {
  const card = e.target.closest('.sb-question'); if (!card) return;
  document.querySelectorAll('#paperView .pp-q.hl').forEach(x => x.classList.remove('hl'));
  const pq = document.querySelector(`#paperView .pp-q[data-key="${CSS.escape(card.dataset.key)}"]`);
  if (pq){ pq.classList.add('hl'); pq.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
});

document.getElementById('panelToggle').addEventListener('click', () => {
  document.getElementById('builderView').classList.toggle('collapsed');
  setTimeout(() => { if (zoom === 'fit') applyZoom(); }, 320);
});
document.getElementById('btnFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
  else document.exitFullscreen();
});
// طباعة النسخة الورقية من الاستبيان (للتوزيع اليدوي)
document.getElementById('btnPrintPaper').addEventListener('click', () => {
  renderPreview();
  const w = window.open('', '_blank');
  if (!w){ toast('اسمح بالنوافذ المنبثقة للطباعة'); return; }
  const css = [...document.styleSheets].map(ss => { try { return [...ss.cssRules].map(r => r.cssText).join('\n'); } catch(e){ return ''; } }).join('\n');
  const pagesHtml = [...document.querySelectorAll('#paperView .paper')].map(p => `<div class="paper" style="--pc:${current.color || '#2F5770'}">${p.innerHTML}</div>`).join('');
  w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${esc(current.title || 'استبيان')}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <style>${css}
    @page{ size:A4; margin:0; } body{ margin:0; background:#fff; } .paper{ break-after:page; box-shadow:none; } .paper:last-child{ break-after:auto; }
    .pp-q.hl{ border-color:transparent !important; background:none !important; }
    *{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }</style></head><body>${pagesHtml}</body></html>`);
  w.document.close();
  w.onload = () => setTimeout(() => w.print(), 300);
});

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
}
