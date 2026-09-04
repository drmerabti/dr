/* =====================================================================
   المصادقة (Firebase Auth)
===================================================================== */
let currentUser = null;

function showAuthGate(){
  document.getElementById('authGate').classList.remove('hidden');
  document.getElementById('listView').classList.add('hidden');
  document.getElementById('builderView').classList.add('hidden');
}
function hideAuthGate(){
  document.getElementById('authGate').classList.add('hidden');
}

function renderUserBar(){
  const bar = document.getElementById('userBar');
  if (!currentUser){ bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  bar.innerHTML = `${currentUser.displayName || currentUser.email} <button id="signOutBtn" class="sb-signout-btn">خروج</button>`;
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
const LOCAL_DRAFTS_KEY = 'sb_local_drafts_v1';
function loadLocalDrafts(){ try { return JSON.parse(localStorage.getItem(LOCAL_DRAFTS_KEY)) || []; } catch(e){ return []; } }
function saveLocalDrafts(list){ localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(list)); }
function upsertLocalDraft(rec){
  const list = loadLocalDrafts();
  const i = list.findIndex(s => s.localId === rec.localId);
  if (i >= 0) list[i] = rec; else list.unshift(rec);
  saveLocalDrafts(list);
}
function deleteLocalDraft(localId){ saveLocalDrafts(loadLocalDrafts().filter(s => s.localId !== localId)); }

let current = null;

function newSurveyFromTemplate(tplKey){
  const tpl = TEMPLATES[tplKey] || TEMPLATES.blank;
  current = {
    localId: 'ls_' + Date.now(), publishedId: null,
    title: tpl.title, description: tpl.description, color: '#2F5770', thanksMessage: '',
    sections: JSON.parse(JSON.stringify(tpl.sections)),
  };
  openBuilder();
}

function openBuilder(){
  document.getElementById('listView').classList.add('hidden');
  document.getElementById('builderView').classList.remove('hidden');
  fillBuilderFromCurrent();
}
function backToList(){
  document.getElementById('builderView').classList.add('hidden');
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
  if (!current || current.publishedId) return; // بعد النشر، التعديلات تُحفظ فقط بالضغط على "تحديث"
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
    wrap.innerHTML = `<p class="sb-empty-msg">تعذّر تحميل استبياناتك: ${err.message}</p>`;
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
        <p class="sb-draft-title">${rec.title}</p>
        <p class="sb-draft-meta">منشور</p>
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
        sections: rebuildSectionsFromFlatQuestions(rec.questions),
      };
      openBuilder();
    });
    card.querySelector('[data-act="results"]').addEventListener('click', () => {
      location.href = `results.html?id=${rec.id}`;
    });
    card.querySelector('[data-act="del"]').addEventListener('click', async () => {
      if (!confirm('حذف هذا الاستبيان نهائيًا (والإجابات المرتبطة به)؟')) return;
      try {
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
        <p class="sb-draft-title">${rec.title}</p>
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

function rebuildSectionsFromFlatQuestions(flatQuestions){
  const bySection = {};
  const order = [];
  (flatQuestions || []).forEach(q => {
    const sTitle = q.section || 'المحور الأول';
    if (!bySection[sTitle]){ bySection[sTitle] = []; order.push(sTitle); }
    bySection[sTitle].push({ key: q.id, type: q.type, title: q.title, required: q.required, options: q.options || [] });
  });
  if (order.length === 0) return [{ id: 's1', title: 'المحور الأول', questions: [] }];
  return order.map((t, i) => ({ id: 's' + i, title: t, questions: bySection[t] }));
}

/* =====================================================================
   المحاور والأسئلة (بناء الواجهة)
===================================================================== */
function escapeAttr(s){ return (s || '').replace(/"/g, '&quot;'); }
const TYPE_META = {
  short: { icon: '📝', label: 'نص قصير' }, long: { icon: '📄', label: 'نص طويل' },
  radio: { icon: '⚪', label: 'اختيار واحد' }, checkbox: { icon: '☑️', label: 'اختيار متعدد' },
  dropdown: { icon: '🔽', label: 'قائمة منسدلة' }, rating: { icon: '⭐', label: 'تقييم نجوم' }, yesno: { icon: '👍', label: 'نعم / لا' },
};

function renderSections(){
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
    </label>`;

  card.querySelector('.q-title').addEventListener('input', e => { q.title = e.target.value; autosave(); });
  card.querySelector('.q-required').addEventListener('change', e => { q.required = e.target.checked; autosave(); });
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
      if (n){ q.options = likertOptions(n); renderSections(); autosave(); }
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
  const title = current.title.trim();
  if (!title){ alert('يرجى كتابة عنوان للاستبيان.'); return; }

  const allQuestions = [];
  for (const section of current.sections){
    for (const q of section.questions){
      if (!q.title.trim()){ alert('يرجى ملء نص كل سؤال قبل النشر.'); return; }
      allQuestions.push({ id: q.key, type: q.type, title: q.title, required: q.required, options: q.options, section: section.title });
    }
  }
  if (allQuestions.length === 0){ alert('أضف سؤالاً واحدًا على الأقل.'); return; }

  const payload = {
    owner: currentUser.uid, title, description: current.description || '', color: current.color || '#2F5770',
    thanksMessage: current.thanksMessage || '', questions: allQuestions,
  };

  const btn = document.getElementById('publishBtn');
  btn.disabled = true; btn.textContent = 'جارٍ النشر...';

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

    const shareUrl = `${location.origin}/tools/survey-builder/fill.html?id=${docId}`;
    const resultsUrl = `${location.origin}/tools/survey-builder/results.html?id=${docId}`;
    document.getElementById('shareLink').value = shareUrl;
    document.getElementById('resultsLink').value = resultsUrl;
    document.getElementById('openResultsBtn').href = resultsUrl;
    document.getElementById('publishResult').classList.remove('hidden');
    document.getElementById('publishResult').scrollIntoView({ behavior: 'smooth' });
  } catch (err){
    alert('حدث خطأ أثناء النشر: ' + err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'نشر الاستبيان ومشاركته';
  }
});

function flashCopyBtn(btn, textToCopy){
  navigator.clipboard.writeText(textToCopy);
  const original = btn.textContent;
  btn.textContent = '✅'; btn.disabled = true;
  setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
}
document.getElementById('copyShareBtn').addEventListener('click', function(){ flashCopyBtn(this, document.getElementById('shareLink').value); });
document.getElementById('copyResultsBtn').addEventListener('click', function(){ flashCopyBtn(this, document.getElementById('resultsLink').value); });
