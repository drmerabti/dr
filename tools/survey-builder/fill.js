const params = new URLSearchParams(location.search);
const surveyId = params.get('id');
const wrap = document.getElementById('fillWrap');
const progressWrap = document.getElementById('progressWrap');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');

let surveyData = null;
let allQuestionsFlat = [];

const PRESET_ICONS = {
  'الجنس': { type: 'gender' },
};

function updateProgress(){
  const inputs = allQuestionsFlat;
  let answered = 0;
  inputs.forEach(q => {
    if (isAnswered(q)) answered++;
  });
  const pct = inputs.length ? Math.round((answered / inputs.length) * 100) : 0;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = `${answered} من ${inputs.length} أسئلة`;
}

function isAnswered(q){
  if (q.type === 'short' || q.type === 'long' || q.type === 'dropdown'){
    const el = wrap.querySelector(`[data-qid="${q.id}"]`);
    return el && el.value.trim() !== '';
  }
  if (q.type === 'radio' || q.type === 'yesno'){
    return !!wrap.querySelector(`input[name="${q.id}"]:checked`);
  }
  if (q.type === 'checkbox'){
    return wrap.querySelectorAll(`input[name="${q.id}"]:checked`).length > 0;
  }
  if (q.type === 'rating'){
    const group = wrap.querySelector(`[data-qid="${q.id}"]`);
    return group && !!group.dataset.value;
  }
  return false;
}

const GENDER_ICONS = { 'ذكر': { icon: '🧑', bg: '#E3EEF4', color: '#2F5770' }, 'أنثى': { icon: '👩', bg: '#F6E4EE', color: '#B15C86' } };

function renderChoicePills(q, opts, inputType){
  if (q.title.trim() === 'الجنس' && opts.length === 2 && opts.every(o => GENDER_ICONS[o])){
    return `<div class="sb-icon-choice-row" data-qid="${q.id}">` + opts.map(o => {
      const meta = GENDER_ICONS[o];
      return `<label class="sb-icon-choice" style="background:${meta.bg};color:${meta.color};">
        <input type="${inputType}" name="${q.id}" value="${o}" data-type="${inputType}" style="display:none;">
        <span class="sic-icon">${meta.icon}</span><span class="sic-label">${o}</span>
      </label>`;
    }).join('') + `</div>`;
  }
  return `<div class="sb-pill-choice" data-qid="${q.id}">` + opts.map(o => `
    <label class="sb-pill">
      <input type="${inputType}" name="${q.id}" value="${o}" data-type="${inputType}" style="display:none;">
      <span>${o}</span>
    </label>`).join('') + `</div>`;
}

function renderQuestionField(q){
  const box = document.createElement('div');
  box.className = 'sb-card';
  let inner = `<label class="sb-label">${q.title}${q.required ? ' *' : ''}</label>`;

  if (q.type === 'short'){
    inner += `<input type="text" class="sb-input" data-qid="${q.id}" data-type="short">`;
  } else if (q.type === 'long'){
    inner += `<textarea class="sb-input" rows="3" data-qid="${q.id}" data-type="long"></textarea>`;
  } else if (q.type === 'radio' || q.type === 'yesno'){
    const opts = q.type === 'yesno' ? ['نعم', 'لا'] : q.options;
    inner += renderChoicePills(q, opts, 'radio');
  } else if (q.type === 'checkbox'){
    inner += renderChoicePills(q, q.options, 'checkbox');
  } else if (q.type === 'dropdown'){
    inner += `<select class="sb-input" data-qid="${q.id}" data-type="dropdown">
      <option value="">اختر...</option>
      ${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}
    </select>`;
  } else if (q.type === 'rating'){
    inner += `<div class="sb-q-options" style="flex-direction:row;gap:8px;font-size:2rem;" data-qid="${q.id}" data-type="rating">
      ${[1,2,3,4,5].map(n => `<span class="rating-star" data-val="${n}" style="cursor:pointer;">☆</span>`).join('')}
    </div>`;
  }

  box.innerHTML = inner;
  box.addEventListener('input', updateProgress);
  box.addEventListener('change', () => { syncPillSelection(box); updateProgress(); });
  box.addEventListener('click', () => setTimeout(() => { syncPillSelection(box); updateProgress(); }, 0));
  return box;
}

function syncPillSelection(box){
  box.querySelectorAll('.sb-pill, .sb-icon-choice').forEach(label => {
    const input = label.querySelector('input');
    label.classList.toggle('selected', input.checked);
  });
}

async function init(){
  if (!surveyId){
    wrap.innerHTML = `<div class="sb-card"><p>رابط غير صالح.</p></div>`;
    return;
  }
  wrap.innerHTML = `<div class="sb-card"><p>جارٍ التحميل...</p></div>`;

  try {
    const res = await fetch(`/api/surveys/${surveyId}`);
    const survey = await res.json();
    if (!res.ok) throw new Error(survey.error || 'خطأ');
    surveyData = survey;
    allQuestionsFlat = survey.questions;

    if (survey.color) document.documentElement.style.setProperty('--accent', survey.color);

    wrap.innerHTML = '';

    // شاشة الترحيب
    const welcome = document.createElement('div');
    welcome.className = 'sb-welcome-card';
    welcome.innerHTML = `
      <h2 style="margin:0 0 10px;">${survey.title}</h2>
      ${survey.description ? `<p style="color:var(--ink-soft);margin:0 0 18px;">${survey.description}</p>` : ''}
      <button id="startBtn" class="sb-publish-btn" style="width:auto;padding:12px 32px;">ابدأ الآن</button>
    `;
    wrap.appendChild(welcome);
    welcome.querySelector('#startBtn').addEventListener('click', showQuestions);

  } catch (err) {
    wrap.innerHTML = `<div class="sb-card"><p>تعذّر تحميل الاستبيان: ${err.message}</p></div>`;
  }
}

function showQuestions(){
  wrap.innerHTML = '';
  progressWrap.classList.remove('hidden');

  surveyData.questions.forEach(q => wrap.appendChild(renderQuestionField(q)));

  wrap.querySelectorAll('[data-type="rating"]').forEach(group => {
    group.addEventListener('click', e => {
      if (!e.target.classList.contains('rating-star')) return;
      const val = e.target.dataset.val;
      group.dataset.value = val;
      group.querySelectorAll('.rating-star').forEach(s => {
        s.textContent = s.dataset.val <= val ? '★' : '☆';
      });
      updateProgress();
    });
  });

  const submitBtn = document.createElement('button');
  submitBtn.className = 'sb-publish-btn';
  submitBtn.textContent = 'إرسال الإجابات';
  submitBtn.addEventListener('click', submitAnswers);
  wrap.appendChild(submitBtn);

  updateProgress();
}

async function submitAnswers(){
  const answers = {};
  for (const q of surveyData.questions){
    if (q.type === 'short' || q.type === 'long' || q.type === 'dropdown'){
      const el = wrap.querySelector(`[data-qid="${q.id}"]`);
      const val = el ? el.value.trim() : '';
      if (q.required && !val){ alert(`يرجى الإجابة على: ${q.title}`); return; }
      if (val) answers[q.id] = val;
    } else if (q.type === 'radio' || q.type === 'yesno'){
      const checked = wrap.querySelector(`input[name="${q.id}"]:checked`);
      if (q.required && !checked){ alert(`يرجى الإجابة على: ${q.title}`); return; }
      if (checked) answers[q.id] = checked.value;
    } else if (q.type === 'checkbox'){
      const checked = [...wrap.querySelectorAll(`input[name="${q.id}"]:checked`)].map(c => c.value);
      if (q.required && checked.length === 0){ alert(`يرجى الإجابة على: ${q.title}`); return; }
      if (checked.length) answers[q.id] = checked;
    } else if (q.type === 'rating'){
      const group = wrap.querySelector(`[data-qid="${q.id}"]`);
      const val = group ? group.dataset.value : '';
      if (q.required && !val){ alert(`يرجى الإجابة على: ${q.title}`); return; }
      if (val) answers[q.id] = val;
    }
  }

  try {
    const res = await fetch(`/api/surveys/${surveyId}/responses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('فشل الإرسال');

    progressWrap.classList.add('hidden');
    const thanks = surveyData.thanksMessage && surveyData.thanksMessage.trim()
      ? surveyData.thanksMessage : 'شكرًا لمشاركتك! 🙏';
    wrap.innerHTML = `
      <div class="sb-card" style="text-align:center;">
        <h2 style="margin:0 0 10px;">${thanks}</h2>
        <p style="color:var(--ink-soft);">أنت المُجيب رقم ${data.respondentNumber}</p>
      </div>`;
  } catch (err) {
    alert('حدث خطأ أثناء الإرسال: ' + err.message);
  }
}

init();
