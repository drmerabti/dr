const params = new URLSearchParams(location.search);
const surveyId = params.get('id');
const wrap = document.getElementById('resultsWrap');

function renderTallyQuestion(q, total){
  const entries = Object.entries(q.tally).sort((a, b) => b[1] - a[1]);
  const box = document.createElement('div');
  box.className = 'sb-question';
  let bars = entries.map(([label, count]) => {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:4px;">
          <span>${label}</span><span>${count} (${pct}%)</span>
        </div>
        <div style="background:var(--accent-soft);border-radius:8px;height:10px;overflow:hidden;">
          <div style="background:var(--accent);height:100%;width:${pct}%;"></div>
        </div>
      </div>`;
  }).join('');
  box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title}</h3>${bars || '<p style="color:var(--ink-soft);">لا إجابات بعد.</p>'}`;
  return box;
}

function renderTextQuestion(q){
  const box = document.createElement('div');
  box.className = 'sb-question';
  const list = q.textAnswers.length
    ? `<ul style="margin:0;padding-inline-start:20px;">${q.textAnswers.map(a => `<li style="margin-bottom:6px;">${a}</li>`).join('')}</ul>`
    : `<p style="color:var(--ink-soft);">لا إجابات بعد.</p>`;
  box.innerHTML = `<h3 style="margin:0 0 12px;">${q.title}</h3>${list}`;
  return box;
}

async function init(){
  if (!surveyId){
    wrap.innerHTML = `<div class="sb-card"><p>رابط غير صالح.</p></div>`;
    return;
  }
  wrap.innerHTML = `<div class="sb-card"><p>جارٍ التحميل...</p></div>`;

  try {
    const res = await fetch(`/api/surveys/${surveyId}/results`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'خطأ');

    wrap.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'sb-card';
    header.innerHTML = `
      <h2 style="margin:0 0 8px;">${data.title}</h2>
      <p style="color:var(--ink-soft);margin:0;">عدد الإجابات: <strong>${data.totalResponses}</strong></p>
    `;
    wrap.appendChild(header);

    data.questions.forEach(q => {
      if (q.type === 'short' || q.type === 'long'){
        wrap.appendChild(renderTextQuestion(q));
      } else {
        wrap.appendChild(renderTallyQuestion(q, data.totalResponses));
      }
    });

  } catch (err) {
    wrap.innerHTML = `<div class="sb-card"><p>تعذّر تحميل النتائج: ${err.message}</p></div>`;
  }
}

init();
