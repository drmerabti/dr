let questions = [];
let qCounter = 0;

const TYPE_META = {
  short:    { icon: '📝', label: 'نص قصير' },
  long:     { icon: '📄', label: 'نص طويل' },
  radio:    { icon: '⚪', label: 'اختيار واحد' },
  checkbox: { icon: '☑️', label: 'اختيار متعدد' },
  dropdown: { icon: '🔽', label: 'قائمة منسدلة' },
  rating:   { icon: '⭐', label: 'تقييم نجوم' },
  yesno:    { icon: '👍', label: 'نعم / لا' },
};

function addQuestion(type){
  qCounter++;
  const q = {
    key: 'q' + qCounter,
    type,
    title: '',
    required: false,
    options: (type === 'radio' || type === 'checkbox' || type === 'dropdown') ? ['خيار 1', 'خيار 2'] : [],
  };
  questions.push(q);
  renderQuestions();
}

function removeQuestion(key){
  questions = questions.filter(q => q.key !== key);
  renderQuestions();
}

function moveQuestion(key, dir){
  const i = questions.findIndex(q => q.key === key);
  const j = i + dir;
  if (j < 0 || j >= questions.length) return;
  [questions[i], questions[j]] = [questions[j], questions[i]];
  renderQuestions();
}

function renderQuestions(){
  const wrap = document.getElementById('questionsList');
  wrap.innerHTML = '';
  questions.forEach((q, idx) => {
    const meta = TYPE_META[q.type];
    const card = document.createElement('div');
    card.className = 'sb-question';
    card.innerHTML = `
      <div class="sb-q-head">
        <span class="sb-q-icon">${meta.icon}</span>
        <span class="sb-q-type-label">${meta.label}</span>
        <div class="sb-q-actions">
          <button data-act="up" title="أعلى">↑</button>
          <button data-act="down" title="أسفل">↓</button>
          <button data-act="del" title="حذف">✕</button>
        </div>
      </div>
      <input type="text" class="sb-input q-title" placeholder="اكتب نص السؤال هنا..." value="${q.title.replace(/"/g,'&quot;')}">
      <div class="sb-q-options-wrap"></div>
      <label class="sb-q-required">
        <input type="checkbox" class="q-required" ${q.required ? 'checked' : ''}>
        إجابة إلزامية
      </label>
    `;

    card.querySelector('.q-title').addEventListener('input', e => { q.title = e.target.value; });
    card.querySelector('.q-required').addEventListener('change', e => { q.required = e.target.checked; });
    card.querySelector('[data-act="del"]').addEventListener('click', () => removeQuestion(q.key));
    card.querySelector('[data-act="up"]').addEventListener('click', () => moveQuestion(q.key, -1));
    card.querySelector('[data-act="down"]').addEventListener('click', () => moveQuestion(q.key, 1));

    if (['radio', 'checkbox', 'dropdown'].includes(q.type)){
      const optWrap = card.querySelector('.sb-q-options-wrap');
      const optList = document.createElement('div');
      optList.className = 'sb-q-options';
      renderOptions(optList, q);
      optWrap.appendChild(optList);
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'sb-add-option-btn';
      addBtn.textContent = '+ إضافة خيار';
      addBtn.addEventListener('click', () => {
        q.options.push('خيار ' + (q.options.length + 1));
        renderOptions(optList, q);
      });
      optWrap.appendChild(addBtn);
    }

    wrap.appendChild(card);
  });
}

function renderOptions(optList, q){
  optList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const row = document.createElement('div');
    row.className = 'sb-q-option-row';
    row.innerHTML = `<input type="text" class="sb-input" value="${opt.replace(/"/g,'&quot;')}"><button type="button">✕</button>`;
    row.querySelector('input').addEventListener('input', e => { q.options[i] = e.target.value; });
    row.querySelector('button').addEventListener('click', () => {
      q.options.splice(i, 1);
      renderOptions(optList, q);
    });
    optList.appendChild(row);
  });
}

document.querySelectorAll('.sb-type-btn').forEach(btn => {
  btn.addEventListener('click', () => addQuestion(btn.dataset.type));
});

document.getElementById('publishBtn').addEventListener('click', async () => {
  const title = document.getElementById('surveyTitle').value.trim();
  const description = document.getElementById('surveyDesc').value.trim();

  if (!title){ alert('يرجى كتابة عنوان للاستبيان.'); return; }
  if (questions.length === 0){ alert('أضف سؤالاً واحدًا على الأقل.'); return; }
  for (const q of questions){
    if (!q.title.trim()){ alert('يرجى ملء نص كل سؤال.'); return; }
  }

  const payload = {
    title, description,
    questions: questions.map(q => ({
      id: q.key, type: q.type, title: q.title, required: q.required, options: q.options,
    })),
  };

  const btn = document.getElementById('publishBtn');
  btn.disabled = true;
  btn.textContent = 'جارٍ النشر...';

  try {
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'خطأ غير معروف');

    const shareUrl = `${location.origin}/tools/survey-builder/fill.html?id=${data.id}`;
    const resultsUrl = `${location.origin}/tools/survey-builder/results.html?id=${data.id}`;

    document.getElementById('shareLink').value = shareUrl;
    document.getElementById('resultsLink').value = resultsUrl;
    document.getElementById('openResultsBtn').href = resultsUrl;
    document.getElementById('publishResult').classList.remove('hidden');
    document.getElementById('publishResult').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert('حدث خطأ أثناء النشر: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'نشر الاستبيان ومشاركته';
  }
});

document.getElementById('copyShareBtn').addEventListener('click', () => {
  document.getElementById('shareLink').select();
  document.execCommand('copy');
});
document.getElementById('copyResultsBtn').addEventListener('click', () => {
  document.getElementById('resultsLink').select();
  document.execCommand('copy');
});

// سؤالان افتراضيان للبداية
addQuestion('short');
addQuestion('radio');
