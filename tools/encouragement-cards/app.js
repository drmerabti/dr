/* =========================================================
   مولّد بطاقات التشجيع — Merabti Academy
   v1: تصاميم متعددة، حقول قابلة للتعديل، طباعة فردية وجماعية، PDF
   ========================================================= */
(function () {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const STORE_KEY = 'merabti_encouragement_v1';

/* ---------------------------------------------------------
   Icons (abstract shapes only — no living beings)
--------------------------------------------------------- */
const ICONS = {
  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 1l3.1 6.9L22 9l-5.5 4.9L18 22l-6-3.6L6 22l1.5-8.1L2 9l6.9-1.1z"/></svg>`,
  ribbon: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="8" r="6"/><path d="M8 13L5 22l7-4 7 4-3-9z" opacity=".85"/></svg>`,
  medal: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="15" r="7"/><path d="M9 2l3 6 3-6H9z" opacity=".85"/></svg>`,
  laurel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20c-3-4-3-10 0-16"/><path d="M12 20c3-4 3-10 0-16"/><path d="M9 5c-2 1-2 3-2 3M8 9c-2 1-2 3-2 3M9 15c-2 1-2 3-2 3M15 5c2 1 2 3 2 3M16 9c2 1 2 3 2 3M15 15c2 1 2 3 2 3"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M5 5H3v2a4 4 0 0 0 4 4M19 5h2v2a4 4 0 0 1-4 4"/><path d="M12 13v4M9 21h6M10 17h4v4h-4z"/></svg>`
};
const CORNER = `<svg viewBox="0 0 46 46" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20V2h18"/><circle cx="2" cy="2" r="2" fill="currentColor" stroke="none"/></svg>`;

/* ---------------------------------------------------------
   Templates — 24 designs across subjects
--------------------------------------------------------- */
const T = (id,cat,name,c1,c2,icon,font) => ({id,cat,name,bg:`linear-gradient(150deg,${c1},${c2})`,icon,font});
const TEMPLATES = [
  T('g1','عام','نجمة الفخر','#F6A83C','#E8622C','star','Cairo'),
  T('g2','عام','بريق التميّز','#6C63FF','#3B2E86','sparkle','Tajawal'),
  T('g3','عام','وسام الهمّة','#2FBF71','#0E7A4B','medal','Almarai'),
  T('g4','عام','شريط الإنجاز','#EF5DA8','#B22E74','ribbon','Tajawal'),
  T('g5','عام','كأس النجاح','#2F5770','#16303F','trophy','El Messiri'),
  T('g6','عام','غصن الزيتون','#4C8C6B','#295239','laurel','Amiri'),
  T('ar1','عربية','قلم الفصاحة','#B8542E','#7A3418','star','Amiri'),
  T('ar2','عربية','لؤلؤة البيان','#7A4EAB','#4A2B70','sparkle','El Messiri'),
  T('ma1','رياضيات','عبقري الأرقام','#1E6FA8','#0E3B5C','medal','Cairo'),
  T('ma2','رياضيات','نجم الحساب','#2E86AB','#123A54','star','Tajawal'),
  T('sc1','علوم','مستكشف صغير','#1F9E89','#0B5C50','trophy','Cairo'),
  T('sc2','علوم','عالم المستقبل','#3AAFA9','#144D49','sparkle','Almarai'),
  T('fr1','فرنسية','Étoile de français','#D65A8C','#8C2F5C','star','Tajawal'),
  T('fr2','فرنسية','Plume brillante','#9C6ADE','#5B3593','ribbon','El Messiri'),
  T('en1','إنجليزية','Bright Star','#2F80ED','#1B4C8C','star','Cairo'),
  T('en2','إنجليزية','Rising Talent','#F2994A','#B25E1B','trophy','Tajawal'),
  T('sl1','سلوك وأخلاق','قلب طيّب','#E0607E','#9C3350','ribbon','Almarai'),
  T('sl2','سلوك وأخلاق','ابتسامة اليوم','#F4A259','#C06B22','sparkle','Cairo'),
  T('sl3','سلوك وأخلاق','تعاون رائع','#5B8C5A','#2E5C2D','laurel','Tajawal'),
  T('g7','عام','خطوة واثقة','#4A5FC1','#242F73','medal','El Messiri'),
  T('g8','عام','إشراقة يوم','#F2B807','#C77E00','star','Cairo'),
  T('g9','عام','نبضة تفوق','#C1447A','#6E1F45','sparkle','Tajawal'),
  T('sc3','علوم','فكرة مبتكرة','#0FA3A3','#0B5E5E','trophy','Almarai'),
  T('ma3','رياضيات','معادلة النجاح','#4B4E9E','#282A5C','laurel','El Messiri')
];

const SUBJECTS_DEFAULT = ['عام','اللغة العربية','الرياضيات','العلوم الطبيعية','اللغة الفرنسية','اللغة الإنجليزية','التربية الإسلامية','السلوك والانضباط'];
const PHRASES = [
  'أحسنت! أنت متميّز حقًا 🌟',
  'مجهود رائع، استمر هكذا',
  'فخورون بك اليوم',
  'نجاحك يسعدنا كثيرًا',
  'همّتك عالية، واصل التألق'
];
const SIZE_INFO = { a6:{w:396,h:560,grid:'g-a6'}, bank:{w:340,h:220,grid:'g-bank'}, a5:{w:560,h:396,grid:'g-a5'} };

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
let st = {
  tpl: TEMPLATES[0].id,
  size: 'a6',
  name: '',
  names: '',
  subject: SUBJECTS_DEFAULT[0],
  msg: PHRASES[0],
  teacher: '',
  date: '',
  mode: 'single'
};
let subjects = SUBJECTS_DEFAULT.slice();
let zoom = 1;
let gCat = 'الكل';

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      Object.assign(st, d.st || {});
      if (Array.isArray(d.subjects) && d.subjects.length) subjects = d.subjects;
    }
  } catch (e) {}
}
function saveNow(notify) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ st, subjects }));
    if (notify) toast('تم الحفظ في هذا الجهاز');
  } catch (e) { if (notify) toast('تعذّر الحفظ'); }
}

/* ---------------------------------------------------------
   Card rendering
--------------------------------------------------------- */
function tplById(id) { return TEMPLATES.find(t => t.id === id) || TEMPLATES[0]; }

function cardHTML(tpl, size, name, opts) {
  opts = opts || {};
  const subject = opts.subject !== undefined ? opts.subject : st.subject;
  const msg = opts.msg !== undefined ? opts.msg : st.msg;
  const teacher = opts.teacher !== undefined ? opts.teacher : st.teacher;
  const date = opts.date !== undefined ? opts.date : st.date;
  return `
    <div class="ecard size-${size}" style="background:${tpl.bg};font-family:'${tpl.font}',sans-serif">
      <div class="e-frame"></div>
      <span class="e-corner tl">${CORNER}</span>
      <span class="e-corner tr">${CORNER}</span>
      <span class="e-corner bl">${CORNER}</span>
      <span class="e-corner br">${CORNER}</span>
      <div class="e-icon">${ICONS[tpl.icon]}</div>
      <div class="e-title">شهادة تشجيع</div>
      <div class="e-name">${esc(name || 'اسم التلميذ')}</div>
      ${msg ? `<div class="e-msg">${esc(msg)}</div>` : ''}
      ${subject ? `<div class="e-subject">${esc(subject)}</div>` : ''}
      ${(teacher || date) ? `<div class="e-footer"><span>${esc(teacher||'')}</span><span>${esc(date||'')}</span></div>` : ''}
    </div>`;
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function renderStage() {
  const tpl = tplById(st.tpl);
  const holder = $('#cardHolder');
  if (st.mode === 'single') {
    holder.innerHTML = cardHTML(tpl, st.size, st.name);
    $('#batchCount').classList.add('hidden');
  } else {
    const names = st.names.split('\n').map(s => s.trim()).filter(Boolean);
    holder.innerHTML = names.length ? names.map(n => cardHTML(tpl, st.size, n)).join('') : cardHTML(tpl, st.size, '');
    $('#batchCount').textContent = names.length ? `${names.length} بطاقة` : '';
    $('#batchCount').classList.toggle('hidden', !names.length);
  }
  applyZoom();
  renderCurrentThumb();
}
function renderCurrentThumb() {
  const tpl = tplById(st.tpl);
  $('#currentThumb').innerHTML = cardHTML(tpl, 'a6', st.name || '');
  $('#currentThumb').firstElementChild.style.cssText += 'transform:scale(.11);transform-origin:top right;width:396px;height:560px;';
  $('#currentTplName').textContent = tpl.name;
}

/* ---------------------------------------------------------
   Zoom
--------------------------------------------------------- */
function applyZoom() {
  $('#cardHolder').style.transform = `scale(${zoom})`;
  $('#zoomVal').textContent = Math.round(zoom * 100) + '%';
}
$('#zoomIn').addEventListener('click', () => { zoom = Math.min(2, zoom + .1); applyZoom(); });
$('#zoomOut').addEventListener('click', () => { zoom = Math.max(.3, zoom - .1); applyZoom(); });
$('#zoomFit').addEventListener('click', () => { zoom = 1; applyZoom(); });

/* ---------------------------------------------------------
   Mode toggle (single / batch)
--------------------------------------------------------- */
$('#modeSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-mode]'); if (!b) return;
  st.mode = b.dataset.mode;
  $$('#modeSeg button').forEach(x => x.classList.toggle('on', x === b));
  $('.single-only').classList.toggle('hidden', st.mode === 'batch');
  $('.batch-only').classList.toggle('hidden', st.mode === 'single');
  renderStage();
});

/* ---------------------------------------------------------
   Size toggle
--------------------------------------------------------- */
$('#sizeSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-size]'); if (!b) return;
  st.size = b.dataset.size;
  $$('#sizeSeg button').forEach(x => x.classList.toggle('on', x === b));
  renderStage();
});

/* ---------------------------------------------------------
   Accordion
--------------------------------------------------------- */
$$('.acc-item').forEach(item => {
  if (item.dataset.open) item.classList.add('open');
  $('.acc-head', item).addEventListener('click', () => item.classList.toggle('open'));
});

/* ---------------------------------------------------------
   Subjects (editable list)
--------------------------------------------------------- */
function buildSubjectSelect() {
  const sel = $('#fSubject');
  sel.innerHTML = subjects.map(s => `<option ${s===st.subject?'selected':''}>${esc(s)}</option>`).join('');
}
$('#fSubject').addEventListener('change', e => { st.subject = e.target.value; renderStage(); });
$('#btnAddSubject').addEventListener('click', () => {
  const v = prompt('اسم المادة الجديدة:');
  if (v && v.trim() && !subjects.includes(v.trim())) {
    subjects.push(v.trim());
    buildSubjectSelect();
    $('#fSubject').value = v.trim();
    st.subject = v.trim();
    renderStage();
  }
});

/* ---------------------------------------------------------
   Phrase chips
--------------------------------------------------------- */
function buildPhraseChips() {
  $('#phraseChips').innerHTML = PHRASES.map(p => `<button type="button" class="phrase-chip">${esc(p)}</button>`).join('');
}
$('#phraseChips').addEventListener('click', e => {
  const b = e.target.closest('.phrase-chip'); if (!b) return;
  st.msg = b.textContent; $('#fMsg').value = st.msg; renderStage();
});

/* ---------------------------------------------------------
   Fields wiring
--------------------------------------------------------- */
function bindField(id, key) {
  $(id).addEventListener('input', e => { st[key] = e.target.value; renderStage(); });
}
bindField('#fName', 'name');
bindField('#fNames', 'names');
bindField('#fMsg', 'msg');
bindField('#fTeacher', 'teacher');
bindField('#fDate', 'date');

/* ---------------------------------------------------------
   Gallery
--------------------------------------------------------- */
function buildGalleryCats() {
  const cats = ['الكل', ...Array.from(new Set(TEMPLATES.map(t => t.cat)))];
  $('#gCats').innerHTML = cats.map(c => `<button type="button" data-cat="${esc(c)}" class="${c===gCat?'on':''}">${esc(c)}</button>`).join('');
}
$('#gCats').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  gCat = b.dataset.cat;
  $$('#gCats button').forEach(x => x.classList.toggle('on', x === b));
  buildGalleryGrid();
});
function buildGalleryGrid() {
  const list = TEMPLATES.filter(t => gCat === 'الكل' || t.cat === gCat);
  $('#gGrid').innerHTML = list.map(t => `
    <div class="g-card ${t.id===st.tpl?'on':''}" data-id="${t.id}">
      <div class="g-thumb">${cardHTML(t,'a6','اسم التلميذ')}</div>
      <div class="g-name">${esc(t.name)}</div>
    </div>`).join('');
}
$('#gGrid').addEventListener('click', e => {
  const c = e.target.closest('[data-id]'); if (!c) return;
  st.tpl = c.dataset.id;
  $$('.g-card', $('#gGrid')).forEach(x => x.classList.toggle('on', x === c));
  renderStage();
});
function openGallery() { buildGalleryCats(); buildGalleryGrid(); $('#gallery').classList.remove('hidden'); }
function closeGallery() { $('#gallery').classList.add('hidden'); }
$('#btnGallery').addEventListener('click', openGallery);
$('#gClose').addEventListener('click', closeGallery);
$('#gallery').addEventListener('click', e => { if (e.target.id === 'gallery') closeGallery(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGallery(); });

/* ---------------------------------------------------------
   Panel toggle / fullscreen
--------------------------------------------------------- */
$('#panelToggle').addEventListener('click', () => $('#workspace').classList.toggle('collapsed'));
$('#btnFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function(){}).call(document.documentElement);
  else document.exitFullscreen && document.exitFullscreen();
});
$('#btnSave').addEventListener('click', () => saveNow(true));

/* ---------------------------------------------------------
   Print
--------------------------------------------------------- */
function buildPrintPages(namesOverride) {
  const tpl = tplById(st.tpl);
  const info = SIZE_INFO[st.size];
  const names = namesOverride || (st.mode === 'batch'
    ? st.names.split('\n').map(s => s.trim()).filter(Boolean)
    : [st.name]);
  const perPage = st.size === 'a6' ? 4 : st.size === 'bank' ? 10 : 2;
  const root = $('#printRoot');
  root.innerHTML = '';
  for (let i = 0; i < names.length; i += perPage) {
    const chunk = names.slice(i, i + perPage);
    const page = document.createElement('div');
    page.className = `print-page ${info.grid}`;
    page.innerHTML = chunk.map(n => cardHTML(tpl, st.size, n)).join('');
    root.appendChild(page);
  }
  return root;
}
$('#btnPrint').addEventListener('click', () => {
  const names = st.mode === 'batch' ? st.names.split('\n').map(s=>s.trim()).filter(Boolean) : [st.name];
  if (!names.length) { toast('أدخل اسمًا واحدًا على الأقل'); return; }
  buildPrintPages(names);
  window.print();
});

/* ---------------------------------------------------------
   PDF
--------------------------------------------------------- */
async function doPdf() {
  const names = st.mode === 'batch' ? st.names.split('\n').map(s=>s.trim()).filter(Boolean) : [st.name];
  if (!names.length) { toast('أدخل اسمًا واحدًا على الأقل'); return; }
  toast('جاري تجهيز ملف PDF...');
  const root = buildPrintPages(names);
  root.style.position = 'static'; root.style.left = '0';
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pages = $$('.print-page', root);
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
      const img = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) doc.addPage();
      doc.addImage(img, 'JPEG', 0, 0, 210, 297);
    }
    doc.save('بطاقات_التشجيع.pdf');
    toast('تم تحميل الملف');
  } catch (e) {
    console.error(e);
    toast('تعذّر إنشاء PDF، استعمل زر الطباعة');
  } finally {
    root.style.position = 'fixed'; root.style.left = '-9999px';
  }
}
$('#btnPdf').addEventListener('click', doPdf);

/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
load();
buildSubjectSelect();
buildPhraseChips();
$('#fMsg').value = st.msg;
$('#fName').value = st.name;
$('#fNames').value = st.names;
$('#fTeacher').value = st.teacher;
$('#fDate').value = st.date;
$$('#sizeSeg button').forEach(b => b.classList.toggle('on', b.dataset.size === st.size));
$$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === st.mode));
renderStage();

})();
