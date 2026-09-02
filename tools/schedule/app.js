/* ================= I18N ================= */
const I18N = {
  ar: {
    backHome: 'الرئيسية', backToList: 'القائمة',
    title: 'مولّد جدول زمني',
    subtitleList: 'اختر قسمًا أو أنشئ جدولًا جديدًا',
    subtitleEditor: 'اضغط أي خانة لإضافة مهمة',
    createLabel: 'إنشاء جدول جديد',
    daysLabel: 'عدد الأيام', startLabel: 'من الساعة', endLabel: 'إلى الساعة', stepLabel: 'مدة الخانة',
    clearBtn: 'مسح الكل', printBtn: 'طباعة / تصدير', shareBtn: 'مشاركة', applyBtn: 'تحديث الجدول',
    emptyHint: 'يُحفظ جدولك تلقائيًا في هذا المتصفح',
    popoverTitle: 'إضافة مهمة', taskNameLabel: 'اسم المهمة', taskNoteLabel: 'ملاحظة (اختياري)',
    cancelBtn: 'إلغاء', saveBtn: 'حفظ',
    createTitle: 'إنشاء جدول جديد', sectionNameLabel: 'اسم القسم', createBtn: 'إنشاء',
    shareTitle: 'رابط المشاركة', shareNote: 'من يفتح هذا الرابط يشاهد الجدول فقط ولا يستطيع تعديله.',
    closeBtn: 'إغلاق', copyBtn: 'نسخ الرابط', copiedBtn: 'تم النسخ ✓',
    readonlyBadge: 'عرض فقط — بدون تعديل',
    days: ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'],
    cats: { study:'دراسة', work:'عمل', personal:'شخصي', rest:'راحة', sport:'رياضة', other:'أخرى' },
    confirmClear: 'هل تريد مسح مهام هذا الجدول؟',
    confirmDeleteSection: 'حذف هذا القسم نهائيًا؟',
    sectionMeta: (n) => `${n} أيام`,
  },
  en: {
    backHome: 'Home', backToList: 'Sections',
    title: 'Schedule Generator',
    subtitleList: 'Pick a section or create a new schedule',
    subtitleEditor: 'Click any cell to add a task',
    createLabel: 'Create new schedule',
    daysLabel: 'Days', startLabel: 'Start time', endLabel: 'End time', stepLabel: 'Slot length',
    clearBtn: 'Clear all', printBtn: 'Print / Export', shareBtn: 'Share', applyBtn: 'Update schedule',
    emptyHint: 'Your schedule is saved automatically in this browser',
    popoverTitle: 'Add task', taskNameLabel: 'Task name', taskNoteLabel: 'Note (optional)',
    cancelBtn: 'Cancel', saveBtn: 'Save',
    createTitle: 'Create new schedule', sectionNameLabel: 'Section name', createBtn: 'Create',
    shareTitle: 'Share link', shareNote: 'Anyone with this link can only view the schedule, not edit it.',
    closeBtn: 'Close', copyBtn: 'Copy link', copiedBtn: 'Copied ✓',
    readonlyBadge: 'View only — no editing',
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    cats: { study:'Study', work:'Work', personal:'Personal', rest:'Rest', sport:'Sport', other:'Other' },
    confirmClear: 'Clear this schedule\u2019s tasks?',
    confirmDeleteSection: 'Delete this section permanently?',
    sectionMeta: (n) => `${n} days`,
  }
};
let lang = localStorage.getItem('schedule_lang') || 'ar';
function t(k){ return I18N[lang][k]; }

const CATS = [
  { key:'study',    varName:'--cat-study' },
  { key:'work',      varName:'--cat-work' },
  { key:'personal',  varName:'--cat-personal' },
  { key:'rest',      varName:'--cat-rest' },
  { key:'sport',     varName:'--cat-sport' },
  { key:'other',     varName:'--cat-other' },
];
function catColor(key){
  return getComputedStyle(document.documentElement).getPropertyValue(CATS.find(c=>c.key===key).varName).trim();
}

/* ================= Storage ================= */
const SECTIONS_KEY = 'schedule_sections_v1';

function loadSections(){
  try{
    const raw = localStorage.getItem(SECTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e){ return {}; }
}
function saveSections(sections){
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}
function defaultSectionData(name){
  return { name, daysCount: 7, startTime: '08:00', endTime: '18:00', stepMinutes: 60, tasks: {} };
}
function newSectionId(){
  return 'sec_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ================= App state ================= */
let sections = loadSections();
let currentSectionId = null;
let sharedData = null;      // when in read-only shared mode
let isReadonly = false;

/* ================= Unicode-safe base64 ================= */
function b64Encode(str){
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1)));
}
function b64Decode(str){
  return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}

/* ================= Time helpers ================= */
function timeToMinutes(str){ const [h,m] = str.split(':').map(Number); return h*60+m; }
function minutesToTime(mins){
  const h = Math.floor(mins/60).toString().padStart(2,'0');
  const m = (mins%60).toString().padStart(2,'0');
  return `${h}:${m}`;
}
function buildSlots(data){
  const startM = timeToMinutes(data.startTime);
  const endM = timeToMinutes(data.endTime);
  const step = Number(data.stepMinutes);
  const slots = [];
  for (let m = startM; m + step <= endM; m += step) slots.push(minutesToTime(m));
  return slots;
}
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ================= View switching ================= */
function showView(name){
  document.getElementById('listView').classList.toggle('hidden', name !== 'list');
  document.getElementById('editorView').classList.toggle('hidden', name !== 'editor');
}

/* ================= List view ================= */
function renderListView(){
  document.getElementById('heroSub').setAttribute('data-i18n', 'subtitleList');
  document.getElementById('heroSub').textContent = t('subtitleList');

  const grid = document.getElementById('sectionGrid');
  const ids = Object.keys(sections);
  let html = '';
  ids.forEach(id => {
    const s = sections[id];
    html += `
      <div class="section-item-card" data-id="${id}">
        <button class="section-del" data-id="${id}">✕</button>
        <h3>${escapeHtml(s.name)}</h3>
        <p>${t('sectionMeta')(s.daysCount)}</p>
      </div>`;
  });
  html += `
    <div class="create-card" id="createCard">
      <span class="plus">+</span>
      <span class="label">${t('createLabel')}</span>
    </div>`;
  grid.innerHTML = html;

  grid.querySelectorAll('.section-item-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.section-del')) return;
      openSection(card.dataset.id);
    });
  });
  grid.querySelectorAll('.section-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(t('confirmDeleteSection'))){
        delete sections[btn.dataset.id];
        saveSections(sections);
        renderListView();
      }
    });
  });
  document.getElementById('createCard').addEventListener('click', openCreatePopover);

  showView('list');
}

/* ================= Create section popover ================= */
function openCreatePopover(){
  document.getElementById('newSectionName').value = '';
  document.getElementById('createBackdrop').classList.remove('hidden');
  setTimeout(() => document.getElementById('newSectionName').focus(), 50);
}
function closeCreatePopover(){
  document.getElementById('createBackdrop').classList.add('hidden');
}
document.getElementById('cancelCreateBtn').addEventListener('click', closeCreatePopover);
document.getElementById('createBackdrop').addEventListener('click', (e) => {
  if (e.target.id === 'createBackdrop') closeCreatePopover();
});
document.getElementById('confirmCreateBtn').addEventListener('click', () => {
  const input = document.getElementById('newSectionName');
  const name = input.value.trim() || (lang === 'ar' ? `القسم ${Object.keys(sections).length + 1}` : `Section ${Object.keys(sections).length + 1}`);
  const id = newSectionId();
  sections[id] = defaultSectionData(name);
  saveSections(sections);
  closeCreatePopover();
  openSection(id);
});

/* ================= Editor view ================= */
function currentData(){
  return isReadonly ? sharedData : sections[currentSectionId];
}

function openSection(id){
  currentSectionId = id;
  isReadonly = false;
  sharedData = null;
  history.replaceState(null, '', location.pathname);
  renderEditor();
}

function backToList(){
  currentSectionId = null;
  renderListView();
}
document.getElementById('backToListBtn').addEventListener('click', backToList);

function renderEditor(){
  const data = currentData();

  document.getElementById('heroSub').textContent = isReadonly ? '' : t('subtitleEditor');
  document.getElementById('sectionName').textContent = data.name;
  document.getElementById('readonlyBadge').classList.toggle('hidden', !isReadonly);
  document.getElementById('backToListBtn').classList.toggle('hidden', isReadonly);
  document.getElementById('controlsBar').classList.toggle('hidden', isReadonly);
  document.getElementById('shareBtn').classList.toggle('hidden', isReadonly);
  document.getElementById('clearBtn').classList.toggle('hidden', isReadonly);
  document.getElementById('applyBtn').classList.toggle('hidden', isReadonly);
  document.getElementById('emptyHint').classList.toggle('hidden', isReadonly);

  if (!isReadonly){
    document.getElementById('daysCount').value = data.daysCount;
    document.getElementById('startTime').value = data.startTime;
    document.getElementById('endTime').value = data.endTime;
    document.getElementById('stepMinutes').value = data.stepMinutes;
  }

  renderLegend();
  renderTable();
  showView('editor');
}

function renderLegend(){
  document.getElementById('legend').innerHTML = CATS.map(c => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${catColor(c.key)}"></span>
      <span>${t('cats')[c.key]}</span>
    </div>`).join('');
}

function renderTable(){
  const data = currentData();
  const table = document.getElementById('scheduleTable');
  const slots = buildSlots(data);
  const dayNames = t('days').slice(0, data.daysCount);

  let thead = '<thead><tr><th></th>' + dayNames.map(d => `<th>${d}</th>`).join('') + '</tr></thead>';
  let tbody = '<tbody>';
  slots.forEach((slot, slotIndex) => {
    tbody += `<tr><th>${slot}</th>`;
    dayNames.forEach((d, dayIndex) => {
      const key = `${dayIndex}-${slotIndex}`;
      const task = data.tasks[key];
      const roClass = isReadonly ? ' readonly' : '';
      if (task){
        tbody += `<td><div class="cell-inner filled${roClass}" data-key="${key}">
          <div class="task-block" style="background:${catColor(task.cat)}">
            ${!isReadonly ? `<button class="task-del" data-key="${key}">✕</button>` : ''}
            <span>${escapeHtml(task.name)}</span>
            ${task.note ? `<span class="task-note">${escapeHtml(task.note)}</span>` : ''}
          </div>
        </div></td>`;
      } else {
        tbody += `<td><div class="cell-inner${roClass}" data-key="${key}"></div></td>`;
      }
    });
    tbody += '</tr>';
  });
  tbody += '</tbody>';
  table.innerHTML = thead + tbody;

  if (!isReadonly){
    table.querySelectorAll('.cell-inner').forEach(cell => {
      cell.addEventListener('click', (e) => {
        if (e.target.closest('.task-del')) return;
        openTaskPopover(cell.dataset.key);
      });
    });
    table.querySelectorAll('.task-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        delete sections[currentSectionId].tasks[btn.dataset.key];
        saveSections(sections);
        renderTable();
      });
    });
  }
}

/* ================= Task popover ================= */
let activeKey = null;
let selectedCat = 'study';

function renderColorRow(){
  const row = document.getElementById('colorRow');
  row.innerHTML = CATS.map(c => `
    <div class="color-dot ${c.key===selectedCat?'selected':''}" data-cat="${c.key}"
         style="background:${catColor(c.key)}" title="${t('cats')[c.key]}"></div>`).join('');
  row.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => { selectedCat = dot.dataset.cat; renderColorRow(); });
  });
}
function openTaskPopover(key){
  activeKey = key;
  const existing = sections[currentSectionId].tasks[key];
  document.getElementById('taskName').value = existing ? existing.name : '';
  document.getElementById('taskNote').value = existing ? existing.note || '' : '';
  selectedCat = existing ? existing.cat : 'study';
  renderColorRow();
  document.getElementById('popoverBackdrop').classList.remove('hidden');
  setTimeout(() => document.getElementById('taskName').focus(), 50);
}
function closeTaskPopover(){
  document.getElementById('popoverBackdrop').classList.add('hidden');
  activeKey = null;
}
document.getElementById('cancelTaskBtn').addEventListener('click', closeTaskPopover);
document.getElementById('popoverBackdrop').addEventListener('click', (e) => {
  if (e.target.id === 'popoverBackdrop') closeTaskPopover();
});
document.getElementById('saveTaskBtn').addEventListener('click', () => {
  const name = document.getElementById('taskName').value.trim();
  const note = document.getElementById('taskNote').value.trim();
  if (!name){ document.getElementById('taskName').focus(); return; }
  sections[currentSectionId].tasks[activeKey] = { name, note, cat: selectedCat };
  saveSections(sections);
  renderTable();
  closeTaskPopover();
});

/* ================= Controls ================= */
document.getElementById('applyBtn').addEventListener('click', () => {
  const s = sections[currentSectionId];
  s.daysCount = Number(document.getElementById('daysCount').value);
  s.startTime = document.getElementById('startTime').value;
  s.endTime = document.getElementById('endTime').value;
  s.stepMinutes = Number(document.getElementById('stepMinutes').value);
  saveSections(sections);
  renderTable();
});
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm(t('confirmClear'))){
    sections[currentSectionId].tasks = {};
    saveSections(sections);
    renderTable();
  }
});

/* ================= Share ================= */
document.getElementById('shareBtn').addEventListener('click', () => {
  const s = sections[currentSectionId];
  const payload = { n: s.name, d: s.daysCount, st: s.startTime, et: s.endTime, sm: s.stepMinutes, t: s.tasks, l: lang };
  const encoded = b64Encode(JSON.stringify(payload));
  const url = `${location.origin}${location.pathname}#shared=${encoded}`;
  document.getElementById('shareLinkInput').value = url;
  document.getElementById('copyShareBtn').textContent = t('copyBtn');
  document.getElementById('shareBackdrop').classList.remove('hidden');
});
document.getElementById('closeShareBtn').addEventListener('click', () => {
  document.getElementById('shareBackdrop').classList.add('hidden');
});
document.getElementById('shareBackdrop').addEventListener('click', (e) => {
  if (e.target.id === 'shareBackdrop') document.getElementById('shareBackdrop').classList.add('hidden');
});
document.getElementById('copyShareBtn').addEventListener('click', () => {
  const input = document.getElementById('shareLinkInput');
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    document.getElementById('copyShareBtn').textContent = t('copiedBtn');
  }).catch(() => {
    document.execCommand('copy');
    document.getElementById('copyShareBtn').textContent = t('copiedBtn');
  });
});

/* ================= Language ================= */
function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  localStorage.setItem('schedule_lang', lang);
}
document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  applyLanguage();
  if (currentSectionId || isReadonly) renderEditor();
  else renderListView();
});

/* ================= Init: check for shared (read-only) link ================= */
function tryLoadSharedFromHash(){
  const hash = location.hash;
  if (hash.startsWith('#shared=')){
    try{
      const encoded = hash.slice('#shared='.length);
      const payload = JSON.parse(b64Decode(decodeURIComponent(encoded)));
      sharedData = {
        name: payload.n, daysCount: payload.d, startTime: payload.st,
        endTime: payload.et, stepMinutes: payload.sm, tasks: payload.t || {}
      };
      if (payload.l) lang = payload.l;
      isReadonly = true;
      return true;
    } catch(e){ return false; }
  }
  return false;
}

applyLanguage();
if (tryLoadSharedFromHash()){
  renderEditor();
} else {
  renderListView();
}
