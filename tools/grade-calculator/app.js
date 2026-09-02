// ============================================================
// app.js — Grade Average Calculator (ar / en / fr, no login)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'حاسبة المعدل — أكاديمية مرابطي',
      pageTitle: 'حاسبة المعدل', pageSubtitle: 'أضف موادك، عدّل المعاملات كما تريد، وشوف معدلك يتحدّث فورًا',
      openWeightsBtnText: 'معاملات الفروض', addSubjectBtnText: 'إضافة مادة', resultLabel: 'المعدل العام',
      weightsModalTitle: 'معاملات المكوّنات (عام لكل المواد)',
      labelTest1: 'فرض 1', labelTest2: 'فرض 2', labelContinuous: 'مراقبة مستمرة', labelExam: 'اختبار الفصل',
      saveWeightsBtn: 'حفظ',
      compTest1: 'فرض 1', compTest2: 'فرض 2', compContinuous: 'مراقبة', compExam: 'اختبار',
      subjectAvgLabel: 'معدل المادة', coefLabel: 'المعامل',
      addExtraBtn: 'إضافة مكوّن', extraNamePh: 'اسم المكوّن',
      newSubjectName: 'مادة جديدة',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Grade Average Calculator — Merabti Academy',
      pageTitle: 'Grade Average Calculator', pageSubtitle: 'Add your subjects, adjust weights freely, and watch your average update live',
      openWeightsBtnText: 'Component weights', addSubjectBtnText: 'Add subject', resultLabel: 'Overall average',
      weightsModalTitle: 'Component weights (applies to all subjects)',
      labelTest1: 'Test 1', labelTest2: 'Test 2', labelContinuous: 'Continuous assessment', labelExam: 'Final exam',
      saveWeightsBtn: 'Save',
      compTest1: 'Test 1', compTest2: 'Test 2', compContinuous: 'Assessment', compExam: 'Exam',
      subjectAvgLabel: 'Subject average', coefLabel: 'Coefficient',
      addExtraBtn: 'Add component', extraNamePh: 'Component name',
      newSubjectName: 'New subject',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Calculateur de moyenne — Académie Merabti',
      pageTitle: 'Calculateur de moyenne', pageSubtitle: 'Ajoutez vos matières, ajustez les coefficients librement, votre moyenne se met à jour en direct',
      openWeightsBtnText: 'Coefficients des devoirs', addSubjectBtnText: 'Ajouter une matière', resultLabel: 'Moyenne générale',
      weightsModalTitle: 'Coefficients des composantes (pour toutes les matières)',
      labelTest1: 'Devoir 1', labelTest2: 'Devoir 2', labelContinuous: 'Contrôle continu', labelExam: 'Examen',
      saveWeightsBtn: 'Enregistrer',
      compTest1: 'Devoir 1', compTest2: 'Devoir 2', compContinuous: 'Contrôle', compExam: 'Examen',
      subjectAvgLabel: 'Moyenne matière', coefLabel: 'Coefficient',
      addExtraBtn: 'Ajouter une composante', extraNamePh: 'Nom de la composante',
      newSubjectName: 'Nouvelle matière',
    },
  };

  let lang = localStorage.getItem('gradecalc:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  /* ================= Subject icons (auto-guessed by keyword) ================= */
  const ICONS = {
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5c2-1 5-1 8 1 3-2 6-2 8-1v13c-2-1-5-1-8 1-3-2-6-2-8-1V5z"/><path d="M12 6v13"/></svg>`,
    math: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h14l-6 8 6 8H5l6-8-6-8z"/></svg>`,
    flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7.5 15h9"/></svg>`,
    atom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/></svg>`,
    landmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 21h18M4 21V10M20 21V10M2 10l10-6 10 6M6 10v7M10 10v7M14 10v7M18 10v7"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3-4.8-4.3 6.4-.6z"/></svg>`,
    ball: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7l3.5 2.5-1.3 4.1H9.8L8.5 9.5z"/><path d="M12 3v4M4.5 8l3 1.5M4.5 16l3-1.5M19.5 8l-3 1.5M19.5 16l-3-1.5M12 21v-4"/></svg>`,
    monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3a9 8 0 1 0 0 16c1 0 1.5-.5 1.5-1.3 0-.4-.2-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4H16a5 5 0 0 0 5-5c0-3.6-4-6.3-9-6.3z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  };

  const ICON_KEYWORDS = [
    { icon: 'book', words: ['عربية', 'عربي', 'arabic', 'arabe', 'أدب', 'فلسفة', 'philosophy', 'philosophie'] },
    { icon: 'math', words: ['رياضيات', 'رياضة الحساب', 'math', 'maths', 'mathématiques', 'algebre', 'algèbre'] },
    { icon: 'flask', words: ['علوم', 'كيمياء', 'science', 'chimie', 'chemistry', 'biologie', 'biology'] },
    { icon: 'atom', words: ['فيزياء', 'physique', 'physics'] },
    { icon: 'landmark', words: ['تاريخ', 'جغرافيا', 'history', 'geography', 'histoire', 'géographie', 'اجتماعيات'] },
    { icon: 'globe', words: ['فرنسية', 'انجليزية', 'إنجليزية', 'french', 'english', 'اسبانية', 'ألمانية'] },
    { icon: 'star', words: ['اسلامية', 'إسلامية', 'ديني', 'دين', 'islamic', 'religion', 'religieuse'] },
    { icon: 'ball', words: ['رياضة', 'بدنية', 'sport', 'physical', 'éducation physique', 'eps'] },
    { icon: 'monitor', words: ['إعلام', 'اعلام', 'معلوماتية', 'حاسوب', 'computer', 'informatique', 'برمجة'] },
    { icon: 'palette', words: ['رسم', 'فنية', 'فن', 'art', 'arts plastiques'] },
  ];

  function guessIcon(name) {
    const n = (name || '').toLowerCase();
    for (const entry of ICON_KEYWORDS) {
      if (entry.words.some((w) => n.includes(w.toLowerCase()))) return entry.icon;
    }
    return 'book';
  }

  /* ================= Data ================= */
  const DEFAULT_WEIGHTS = { test1: 1, test2: 1, continuous: 1, exam: 3 };
  let weights = Object.assign({}, DEFAULT_WEIGHTS);

  function defaultSubjects() {
    const names = [
      'اللغة العربية', 'الرياضيات', 'العلوم الطبيعية', 'الفيزياء', 'التاريخ والجغرافيا',
      'اللغة الفرنسية', 'اللغة الإنجليزية', 'التربية الإسلامية', 'التربية البدنية', 'الإعلام الآلي', 'التربية الفنية',
    ];
    return names.map((name, i) => ({
      id: 'gc-' + Date.now() + '-' + i,
      name, icon: guessIcon(name), coef: 2,
      test1: '', test2: '', continuous: '', exam: '',
      extra: [],
    }));
  }

  let subjects = [];

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    openWeightsBtn: $('openWeightsBtn'), openWeightsBtnText: $('openWeightsBtnText'),
    subjectsList: $('subjectsList'),
    addSubjectBtn: $('addSubjectBtn'), addSubjectBtnText: $('addSubjectBtnText'),
    resultLabel: $('resultLabel'), resultValue: $('resultValue'),
    weightsModalOverlay: $('weightsModalOverlay'), weightsModalTitle: $('weightsModalTitle'),
    labelTest1: $('labelTest1'), labelTest2: $('labelTest2'), labelContinuous: $('labelContinuous'), labelExam: $('labelExam'),
    weightTest1: $('weightTest1'), weightTest2: $('weightTest2'), weightContinuous: $('weightContinuous'), weightExam: $('weightExam'),
    saveWeightsBtn: $('saveWeightsBtn'),
  };

  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }

  /* ================= Persistence (local only) ================= */
  const STORAGE_KEY = 'gradecalc:data';
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ weights, subjects })); } catch (e) { /* ignore */ }
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  /* ================= Calculation ================= */
  function num(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }

  function subjectAverage(s) {
    const parts = [
      { val: num(s.test1), w: weights.test1 },
      { val: num(s.test2), w: weights.test2 },
      { val: num(s.continuous), w: weights.continuous },
      { val: num(s.exam), w: weights.exam },
    ].concat((s.extra || []).map((e) => ({ val: num(e.value), w: num(e.weight) || 0 })));

    let sumWeighted = 0, sumWeights = 0;
    parts.forEach((p) => {
      if (p.val !== null && p.w > 0) { sumWeighted += p.val * p.w; sumWeights += p.w; }
    });
    if (sumWeights === 0) return null;
    return sumWeighted / sumWeights;
  }

  function overallAverage() {
    let sumWeighted = 0, sumCoef = 0;
    subjects.forEach((s) => {
      const avg = subjectAverage(s);
      const coef = num(s.coef) || 0;
      if (avg !== null && coef > 0) { sumWeighted += avg * coef; sumCoef += coef; }
    });
    if (sumCoef === 0) return 0;
    return sumWeighted / sumCoef;
  }

  /* ================= Render ================= */
  function renderSubjects() {
    els.subjectsList.innerHTML = subjects.map((s) => {
      const avg = subjectAverage(s);
      const avgText = avg === null ? '—' : avg.toFixed(2);
      const extraHtml = (s.extra || []).map((e, ei) => `
        <div class="gc-extra-row">
          <input type="text" class="gc-extra-name" data-id="${s.id}" data-ei="${ei}" placeholder="${t('extraNamePh')}" value="${escapeAttr(e.name)}">
          <input type="number" class="gc-extra-value" data-id="${s.id}" data-ei="${ei}" data-field="value" placeholder="20" value="${escapeAttr(e.value)}">
          <input type="number" class="gc-extra-weight" data-id="${s.id}" data-ei="${ei}" data-field="weight" placeholder="1" value="${escapeAttr(e.weight)}">
          <button type="button" class="gc-extra-remove" data-id="${s.id}" data-ei="${ei}" data-action="remove-extra">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>`).join('');

      return `
      <div class="gc-subject-card" data-id="${s.id}">
        <div class="gc-subject-head">
          <span class="gc-subject-icon">${ICONS[s.icon] || ICONS.book}</span>
          <input type="text" class="gc-subject-name" data-id="${s.id}" data-field="name" value="${escapeAttr(s.name)}">
          <span class="gc-subject-coef-wrap">${t('coefLabel')} <input type="number" class="gc-coef-input" data-id="${s.id}" data-field="coef" min="0" step="0.5" value="${escapeAttr(s.coef)}"></span>
          <button type="button" class="gc-subject-delete" data-id="${s.id}" data-action="delete-subject">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
        <div class="gc-components-grid">
          <div class="gc-comp-cell"><span class="gc-comp-label">${t('compTest1')}</span><input type="number" class="gc-comp-input" data-id="${s.id}" data-field="test1" value="${escapeAttr(s.test1)}"></div>
          <div class="gc-comp-cell"><span class="gc-comp-label">${t('compTest2')}</span><input type="number" class="gc-comp-input" data-id="${s.id}" data-field="test2" value="${escapeAttr(s.test2)}"></div>
          <div class="gc-comp-cell"><span class="gc-comp-label">${t('compContinuous')}</span><input type="number" class="gc-comp-input" data-id="${s.id}" data-field="continuous" value="${escapeAttr(s.continuous)}"></div>
          <div class="gc-comp-cell"><span class="gc-comp-label">${t('compExam')}</span><input type="number" class="gc-comp-input" data-id="${s.id}" data-field="exam" value="${escapeAttr(s.exam)}"></div>
        </div>
        ${extraHtml}
        <button type="button" class="gc-add-extra-btn" data-id="${s.id}" data-action="add-extra">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
          ${t('addExtraBtn')}
        </button>
        <div class="gc-subject-avg-row">
          <span class="gc-subject-avg-label">${t('subjectAvgLabel')}</span>
          <span class="gc-subject-avg-value">${avgText}</span>
        </div>
      </div>`;
    }).join('');

    attachSubjectListeners();
  }

  function renderResult() {
    els.resultValue.textContent = overallAverage().toFixed(2);
  }

  function renderAll() {
    renderSubjects();
    renderResult();
    saveState();
  }

  function findSubject(id) { return subjects.find((s) => s.id === id); }

  function attachSubjectListeners() {
    els.subjectsList.querySelectorAll('[data-field]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const s = findSubject(inp.getAttribute('data-id'));
        if (!s) return;
        const field = inp.getAttribute('data-field');
        const ei = inp.getAttribute('data-ei');
        if (ei !== null) {
          const extraField = field || 'name';
          s.extra[+ei][extraField] = inp.value;
        } else if (field === 'name') {
          s.name = inp.value;
          s.icon = guessIcon(inp.value);
        } else {
          s[field] = inp.value;
        }
        renderResult();
        saveState();
        if (field === 'name') renderSubjects(); // refresh icon
      });
    });

    els.subjectsList.querySelectorAll('.gc-extra-name').forEach((inp) => {
      inp.addEventListener('input', () => {
        const s = findSubject(inp.getAttribute('data-id'));
        const ei = +inp.getAttribute('data-ei');
        if (s && s.extra[ei]) { s.extra[ei].name = inp.value; saveState(); }
      });
    });

    els.subjectsList.querySelectorAll('[data-action="delete-subject"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        subjects = subjects.filter((s) => s.id !== btn.getAttribute('data-id'));
        renderAll();
      });
    });
    els.subjectsList.querySelectorAll('[data-action="add-extra"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = findSubject(btn.getAttribute('data-id'));
        if (!s) return;
        s.extra.push({ name: '', value: '', weight: 1 });
        renderAll();
      });
    });
    els.subjectsList.querySelectorAll('[data-action="remove-extra"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = findSubject(btn.getAttribute('data-id'));
        if (!s) return;
        s.extra.splice(+btn.getAttribute('data-ei'), 1);
        renderAll();
      });
    });
  }

  els.addSubjectBtn.addEventListener('click', () => {
    subjects.push({
      id: 'gc-' + Date.now(), name: t('newSubjectName'), icon: 'book', coef: 1,
      test1: '', test2: '', continuous: '', exam: '', extra: [],
    });
    renderAll();
  });

  /* ================= Weights modal ================= */
  function openWeightsModal() {
    els.weightTest1.value = weights.test1;
    els.weightTest2.value = weights.test2;
    els.weightContinuous.value = weights.continuous;
    els.weightExam.value = weights.exam;
    els.weightsModalOverlay.classList.remove('hidden');
  }
  function closeWeightsModal() { els.weightsModalOverlay.classList.add('hidden'); }

  els.openWeightsBtn.addEventListener('click', openWeightsModal);
  els.weightsModalOverlay.addEventListener('click', (e) => { if (e.target === els.weightsModalOverlay) closeWeightsModal(); });
  els.saveWeightsBtn.addEventListener('click', () => {
    weights.test1 = num(els.weightTest1.value) || 0;
    weights.test2 = num(els.weightTest2.value) || 0;
    weights.continuous = num(els.weightContinuous.value) || 0;
    weights.exam = num(els.weightExam.value) || 0;
    closeWeightsModal();
    renderAll();
  });

  /* ================= i18n apply ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.pageTitle.textContent = dict.pageTitle;
    els.pageSubtitle.textContent = dict.pageSubtitle;
    els.openWeightsBtnText.textContent = dict.openWeightsBtnText;
    els.addSubjectBtnText.textContent = dict.addSubjectBtnText;
    els.resultLabel.textContent = dict.resultLabel;
    els.weightsModalTitle.textContent = dict.weightsModalTitle;
    els.labelTest1.textContent = dict.labelTest1;
    els.labelTest2.textContent = dict.labelTest2;
    els.labelContinuous.textContent = dict.labelContinuous;
    els.labelExam.textContent = dict.labelExam;
    els.saveWeightsBtn.textContent = dict.saveWeightsBtn;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('gradecalc:lang', lang);
    renderSubjects();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  /* ================= Init ================= */
  function init() {
    const saved = loadState();
    if (saved && saved.subjects && saved.subjects.length) {
      weights = Object.assign({}, DEFAULT_WEIGHTS, saved.weights || {});
      subjects = saved.subjects;
    } else {
      subjects = defaultSubjects();
    }
    applyLanguage();
    renderAll();
  }

  init();
})();
