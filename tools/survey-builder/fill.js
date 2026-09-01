const params = new URLSearchParams(location.search);
const surveyId = params.get('id');
const wrap = document.getElementById('fillWrap');

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
    inner += `<div class="sb-q-options">` + opts.map((o, i) => `
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="radio" name="${q.id}" value="${o}" data-type="radio"> ${o}
      </label>`).join('') + `</div>`;
  } else if (q.type === 'checkbox'){
    inner += `<div class="sb-q-options">` + q.options.map(o => `
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" name="${q.id}" value="${o}" data-type="checkbox"> ${o}
      </label>`).join('') + `</div>`;
  } else if (q.type === 'dropdown'){
    inner += `<select class="sb-input" data-qid="${q.id}" data-type="dropdown">
      <option value="">اختر...</option>
      ${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}
    </select>`;
  } else if (q.type === 'rating'){
    inner += `<div class="sb-q-options" style="flex-direction:row;gap:6px;font-size:1.6rem;" data-qid="${q.id}" data-type="rating">
      ${[1,2,3,4,5].map(n => `<span class="rating-star" data-val="${n}" style="cursor:pointer;">☆</span>`).join('')}
    </div>`;
  }

  box.innerHTML = inner;
  return box;
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

    wrap.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'sb-card';
    header.innerHTML = `<h2 style="margin:0 0 8px;">${survey.title}</h2>${survey.description ? `<p style="color:var(--ink-soft);margin:0;">${survey.description}</p>` : ''}`;
    wrap.appendChild(header);

    survey.questions.forEach(q => wrap.appendChild(renderQuestionField(q)));

    // نجوم التقييم
    wrap.querySelectorAll('[data-type="rating"]').forEach(group => {
      group.addEventListener('click', e => {
        if (!e.target.classList.contains('rating-star')) return;
        const val = e.target.dataset.val;
        group.dataset.value = val;
        group.querySelectorAll('.rating-star').forEach(s => {
          s.textContent = s.dataset.val <= val ? '★' : '☆';
        });
      });
    });

    const submitBtn = document.createElement('button');
    submitBtn.className = 'sb-publish-btn';
    submitBtn.textContent = 'إرسال الإجابات';
    submitBtn.addEventListener('click', () => submitAnswers(survey));
    wrap.appendChild(submitBtn);

  } catch (err) {
    wrap.innerHTML = `<div class="sb-card"><p>تعذّر تحميل الاستبيان: ${err.message}</p></div>`;
  }
}

async function submitAnswers(survey){
  const answers = {};

  for (const q of survey.questions){
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('فشل الإرسال');
    wrap.innerHTML = `<div class="sb-card"><h2>شكرًا لك 🙏</h2><p>تم إرسال إجاباتك بنجاح.</p></div>`;
  } catch (err) {
    alert('حدث خطأ أثناء الإرسال: ' + err.message);
  }
}

init();
