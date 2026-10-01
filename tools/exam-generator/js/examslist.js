/* ================= "My exams": cards with a real first-page thumbnail ================= */

const SUBJECT_COLORS = [
  [/رياض|math/i, '#2563EB'], [/فيزي|phys/i, '#DC2626'], [/علوم|طبيع|svt|bio|scien/i, '#16A34A'],
  [/كيمي|chim|chem/i, '#0D9488'], [/عرب|arab/i, '#B45309'], [/فرنس|fran|french/i, '#7C3AED'],
  [/انجل|إنجل|angl|engl/i, '#DB2777'], [/تاريخ|جغراف|hist|géo|geo/i, '#92400E'], [/إسلام|اسلام|islam/i, '#047857'],
  [/مدني|civi/i, '#4B5563'], [/إعلام|اعلام|info/i, '#0891B2'], [/تكنو|techn|هندس/i, '#CA8A04'],
];
function subjectColor(s){
  for(const [re, c] of SUBJECT_COLORS) if(re.test(s || '')) return c;
  return '#6B7280';
}
function fmtDate(ts){
  return new Date(ts).toLocaleDateString(lang==='ar'?'ar-DZ':(lang==='fr'?'fr-FR':'en-GB'), { year:'numeric', month:'short', day:'numeric' });
}

let examSearchTerm = '';
function renderListView(){
  const grid = $('examGrid');
  const term = examSearchTerm.trim().toLowerCase();
  const list = examsCache.filter(e => !term || [e.header.title, e.header.subject, e.header.grade, e.header.institution]
    .some(v => (v || '').toLowerCase().includes(term)));
  $('emptyNote').classList.toggle('hidden', examsCache.length > 0);
  if(examsCache.length && !list.length){
    grid.innerHTML = `<div class="empty-note">${L('لا توجد نتائج لهذا البحث','No results','Aucun résultat')}</div>`; return;
  }
  grid.innerHTML = list.map(e => {
    const h = e.header, col = subjectColor(h.subject);
    return `
    <div class="exam-card2" data-id="${e.id}">
      <div class="ec-thumb" data-open>
        <div class="thumb-inner">${staticPageHTML(e, { maxQuestions: 4 })}</div>
        <span class="ec-subject" style="background:${col}">${escapeHtml(h.subject || L('بدون مادة','No subject','Sans matière'))}</span>
      </div>
      <div class="ec-info" data-open>
        <div class="ec-title">${escapeHtml(h.title || t('untitledExam'))}</div>
        <div class="ec-meta">
          ${h.grade ? `<span class="chip">🎓 ${escapeHtml(h.grade)}</span>` : ''}
          <span class="chip">🧩 ${e.questions.length} ${L('تمارين','exercises','exercices')}</span>
        </div>
        <div class="ec-date">🕒 ${fmtDate(e.updatedAt)}</div>
      </div>
      <div class="ec-actions">
        <button class="ec-btn ec-open" data-act="open">📂 ${L('فتح','Open','Ouvrir')}</button>
        <button class="ec-btn" data-act="dup" title="${L('نسخ','Duplicate','Dupliquer')}">📋 ${L('نسخ','Copy','Copier')}</button>
        <button class="ec-btn ec-del" data-act="del" title="${L('حذف','Delete','Supprimer')}">🗑️</button>
      </div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.exam-card2').forEach(card => {
    const ex = examsCache.find(x => x.id === card.dataset.id);
    hydrateObjects(card.querySelector('.thumb-inner'), ex.objects);
    card.querySelectorAll('[data-open], [data-act="open"]').forEach(el => el.addEventListener('click', () => openExam(ex)));
    card.querySelector('[data-act="dup"]').addEventListener('click', async e => {
      e.stopPropagation();
      const copy = JSON.parse(JSON.stringify(ex));
      copy.id = uid(); copy.createdAt = copy.updatedAt = Date.now(); copy.savedToCloud = false;
      copy.header.title = (copy.header.title || '') + ' — ' + L('نسخة','copy','copie');
      await Store.put('exams', copy);
      examsCache.unshift(copy);
      renderListView();
      toast(L('تم نسخ الامتحان ✓','Exam duplicated ✓','Examen dupliqué ✓'), 'ok');
    });
    card.querySelector('[data-act="del"]').addEventListener('click', async e => {
      e.stopPropagation();
      if(!(await askConfirm(L(`هل تريد حذف «${escapeHtml(ex.header.title || '')}» نهائيًا؟`, `Delete “${escapeHtml(ex.header.title || '')}” permanently?`, `Supprimer « ${escapeHtml(ex.header.title || '')} » définitivement ?`), L('نعم، احذف','Yes, delete','Oui, supprimer'), true))) return;
      await Store.del('exams', ex.id);
      examsCache = examsCache.filter(x => x.id !== ex.id);
      renderListView();
    });
  });
}
$('examSearch').addEventListener('input', e => { examSearchTerm = e.target.value; renderListView(); });
