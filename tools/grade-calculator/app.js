// ============================================================
// app.js — Grade Average Calculator v2 (dynamic components, no modal)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'حاسبة المعدل — أكاديمية مرابطي',
      pageTitle: 'حاسبة المعدل', pageSubtitle: 'أضف موادك، عدّل المكوّنات والمعاملات كما تريد، وشوف معدلك يتحدّث فورًا',
      componentsSectionLabel: 'المكوّنات (تنطبق على كل المواد)', addComponentBtnText: 'إضافة مكوّن',
      addSubjectBtnText: 'إضافة مادة', resultLabel: 'المعدل العام',
      subjectAvgLabel: 'معدل المادة', coefLabel: 'المعامل',
      newSubjectName: 'مادة جديدة', newComponentName: 'مكوّن جديد', scaleLabel: 'من أصل',
      ratingExcellent: 'ممتاز', ratingVeryGood: 'جيد جدًا', ratingGood: 'جيد',
      ratingPass: 'مقبول', ratingWeak: 'ضعيف', ratingVeryWeak: 'ضعيف جدًا',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Grade Average Calculator — Merabti Academy',
      pageTitle: 'Grade Average Calculator', pageSubtitle: 'Add your subjects, adjust components and weights freely, watch your average update live',
      componentsSectionLabel: 'Components (apply to all subjects)', addComponentBtnText: 'Add component',
      addSubjectBtnText: 'Add subject', resultLabel: 'Overall average',
      subjectAvgLabel: 'Subject average', coefLabel: 'Coefficient',
      newSubjectName: 'New subject', newComponentName: 'New component', scaleLabel: 'out of',
      ratingExcellent: 'Excellent', ratingVeryGood: 'Very good', ratingGood: 'Good',
      ratingPass: 'Pass', ratingWeak: 'Weak', ratingVeryWeak: 'Very weak',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Calculateur de moyenne — Académie Merabti',
      pageTitle: 'Calculateur de moyenne', pageSubtitle: 'Ajoutez vos matières, ajustez les composantes et coefficients librement, votre moyenne se met à jour en direct',
      componentsSectionLabel: 'Composantes (pour toutes les matières)', addComponentBtnText: 'Ajouter une composante',
      addSubjectBtnText: 'Ajouter une matière', resultLabel: 'Moyenne générale',
      subjectAvgLabel: 'Moyenne matière', coefLabel: 'Coefficient',
      newSubjectName: 'Nouvelle matière', newComponentName: 'Nouvelle composante', scaleLabel: 'sur',
      ratingExcellent: 'Excellent', ratingVeryGood: 'Très bien', ratingGood: 'Bien',
      ratingPass: 'Passable', ratingWeak: 'Faible', ratingVeryWeak: 'Très faible',
    },
  };

  let lang = localStorage.getItem('gradecalc:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  /* ================= Subject icons (colored, auto-guessed by keyword) ================= */
  const ICON_PATHS = {
    book: `<path d="M4 5c2-1 5-1 8 1 3-2 6-2 8-1v13c-2-1-5-1-8 1-3-2-6-2-8-1V5z"/><path d="M12 6v13"/>`,
    math: `<path d="M5 4h14l-6 8 6 8H5l6-8-6-8z"/>`,
    flask: `<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7.5 15h9"/>`,
    atom: `<circle cx="12" cy="12" r="1.6" fill="#fff" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/>`,
    landmark: `<path d="M3 21h18M4 21V10M20 21V10M2 10l10-6 10 6M6 10v7M10 10v7M14 10v7M18 10v7"/>`,
    globe: `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"/>`,
    star: `<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3-4.8-4.3 6.4-.6z"/>`,
    ball: `<circle cx="12" cy="12" r="9"/><path d="M12 7l3.5 2.5-1.3 4.1H9.8L8.5 9.5z"/><path d="M12 3v4M4.5 8l3 1.5M4.5 16l3-1.5M19.5 8l-3 1.5M19.5 16l-3-1.5M12 21v-4"/>`,
    monitor: `<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>`,
    palette: `<path d="M12 3a9 8 0 1 0 0 16c1 0 1.5-.5 1.5-1.3 0-.4-.2-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4H16a5 5 0 0 0 5-5c0-3.6-4-6.3-9-6.3z"/><circle cx="7.5" cy="10.5" r="1" fill="#fff" stroke="none"/><circle cx="11" cy="7.5" r="1" fill="#fff" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="#fff" stroke="none"/>`,
  };

  const ICON_COLORS = {
    book: '#B1345A', math: '#2F5CA8', flask: '#1E8A52', atom: '#7A3FA8', landmark: '#C9A227',
    globe: '#17879E', star: '#D4A017', ball: '#D85A30', monitor: '#4A5568', palette: '#B15C86',
  };

  function iconSvg(key) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7">${ICON_PATHS[key] || ICON_PATHS.book}</svg>`;
  }

  const ICON_KEYWORDS = [
    { icon: 'book', words: ['عربية', 'عربي', 'arabic', 'arabe', 'أدب', 'فلسفة', 'philosophy', 'philosophie'] },
    { icon: 'math', words: ['رياضيات', 'math'] },
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
  function defaultComponents() {
    return [
      { id: 'c1', name: 'فرض 1', weight: 1 },
      { id: 'c2', name: 'فرض 2', weight: 1 },
      { id: 'c3', name: 'مراقبة مستمرة', weight: 1 },
      { id: 'c4', name: 'اختبار الفصل', weight: 3 },
    ];
  }
  let components = [];

  function defaultSubjects() {
    const names = [
      'اللغة العربية', 'الرياضيات', 'العلوم الطبيعية', 'الفيزياء', 'التاريخ والجغرافيا',
      'اللغة الفرنسية', 'اللغة الإنجليزية', 'التربية الإسلامية', 'التربية البدنية', 'الإعلام الآلي', 'التربية الفنية',
    ];
    return names.map((name, i) => ({
      id: 'gc-' + Date.now() + '-' + i,
      name, icon: guessIcon(name), coef: 2, grades: {},
    }));
  }
  let subjects = [];

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    componentsSectionLabel: $('componentsSectionLabel'), componentsRow: $('componentsRow'),
    addComponentBtn: $('addComponentBtn'), addComponentBtnText: $('addComponentBtnText'),
    subjectsList: $('subjectsList'),
    addSubjectBtn: $('addSubjectBtn'), addSubjectBtnText: $('addSubjectBtnText'),
    resultLabel: $('resultLabel'), resultValue: $('resultValue'), resultRating: $('resultRating'),
    scaleLabel: $('scaleLabel'), scaleInput: $('scaleInput'),
  };

  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }

  /* ================= Persistence (local only) ================= */
  const STORAGE_KEY = 'gradecalc:data:v2';
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ components, subjects, scale: els.scaleInput.value })); } catch (e) { /* ignore */ }
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
    let sumWeighted = 0, sumWeights = 0;
    components.forEach((c) => {
      const val = num(s.grades[c.id]);
      const w = num(c.weight) || 0;
      if (val !== null && w > 0) { sumWeighted += val * w; sumWeights += w; }
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

  /* ================= Render: components row ================= */
  function renderComponents() {
    els.componentsRow.innerHTML = components.map((c) => `
      <div class="gc-component-chip" data-id="${c.id}">
        <input type="text" class="gc-comp-name-input" data-id="${c.id}" data-field="name" value="${escapeAttr(c.name)}">
        <input type="number" class="gc-comp-weight-input" data-id="${c.id}" data-field="weight" min="0" step="0.5" value="${escapeAttr(c.weight)}">
        ${components.length > 1 ? `<button type="button" class="gc-comp-remove" data-id="${c.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>` : ''}
      </div>`).join('');

    els.componentsRow.querySelectorAll('[data-field="weight"]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const c = components.find((x) => x.id === inp.getAttribute('data-id'));
        if (!c) return;
        c.weight = inp.value;
        updateAllAverages();
        saveState();
      });
    });
    els.componentsRow.querySelectorAll('[data-field="name"]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const c = components.find((x) => x.id === inp.getAttribute('data-id'));
        if (!c) return;
        c.name = inp.value;
        updateComponentLabels(c.id, inp.value);
        saveState();
      });
    });
    els.componentsRow.querySelectorAll('.gc-comp-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        components = components.filter((c) => c.id !== btn.getAttribute('data-id'));
        renderAll();
      });
    });
  }

  // Lightweight targeted updates (no full re-render, so inputs never lose focus mid-typing)
  function updateAllAverages() {
    subjects.forEach((s) => {
      const card = els.subjectsList.querySelector(`.gc-subject-card[data-id="${s.id}"]`);
      if (!card) return;
      const avg = subjectAverage(s);
      const valueEl = card.querySelector('.gc-subject-avg-value');
      if (valueEl) valueEl.textContent = avg === null ? '—' : avg.toFixed(2);
    });
    renderResult();
  }

  function updateComponentLabels(componentId, newName) {
    els.subjectsList.querySelectorAll(`.gc-comp-label[data-cid="${componentId}"]`).forEach((el) => {
      el.textContent = newName;
    });
  }

  els.addComponentBtn.addEventListener('click', () => {
    components.push({ id: 'c-' + Date.now(), name: t('newComponentName'), weight: 1 });
    renderAll();
  });

  /* ================= Render: subjects ================= */
  function renderSubjects() {
    els.subjectsList.innerHTML = subjects.map((s) => {
      const avg = subjectAverage(s);
      const avgText = avg === null ? '—' : avg.toFixed(2);
      const gradesHtml = components.map((c) => `
        <div class="gc-comp-cell">
          <span class="gc-comp-label" data-cid="${c.id}">${escapeAttr(c.name)}</span>
          <input type="number" class="gc-comp-input" data-id="${s.id}" data-cid="${c.id}" value="${escapeAttr(s.grades[c.id] || '')}">
        </div>`).join('');

      return `
      <div class="gc-subject-card" data-id="${s.id}">
        <div class="gc-subject-head">
          <span class="gc-subject-icon" data-icon-for="${s.id}" style="background:${ICON_COLORS[s.icon] || ICON_COLORS.book};">${iconSvg(s.icon)}</span>
          <input type="text" class="gc-subject-name" data-id="${s.id}" data-field="name" value="${escapeAttr(s.name)}">
          <span class="gc-subject-coef-wrap">${t('coefLabel')} <input type="number" class="gc-coef-input" data-id="${s.id}" data-field="coef" min="0" step="0.5" value="${escapeAttr(s.coef)}"></span>
          <button type="button" class="gc-subject-delete" data-id="${s.id}" data-action="delete-subject">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
        <div class="gc-components-grid">${gradesHtml}</div>
        <div class="gc-subject-avg-row">
          <span class="gc-subject-avg-label">${t('subjectAvgLabel')}</span>
          <span class="gc-subject-avg-value">${avgText}</span>
        </div>
      </div>`;
    }).join('');

    attachSubjectListeners();
  }

  function findSubject(id) { return subjects.find((s) => s.id === id); }

  function attachSubjectListeners() {
    els.subjectsList.querySelectorAll('[data-field="name"]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const s = findSubject(inp.getAttribute('data-id'));
        if (!s) return;
        s.name = inp.value;
        s.icon = guessIcon(inp.value);
        const iconEl = els.subjectsList.querySelector(`[data-icon-for="${s.id}"]`);
        if (iconEl) {
          iconEl.style.background = ICON_COLORS[s.icon] || ICON_COLORS.book;
          iconEl.innerHTML = iconSvg(s.icon);
        }
        saveState();
      });
    });
    els.subjectsList.querySelectorAll('[data-field="coef"]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const s = findSubject(inp.getAttribute('data-id'));
        if (!s) return;
        s.coef = inp.value;
        renderResult(); saveState();
      });
    });
    els.subjectsList.querySelectorAll('.gc-comp-input[data-cid]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const s = findSubject(inp.getAttribute('data-id'));
        if (!s) return;
        s.grades[inp.getAttribute('data-cid')] = inp.value;
        updateAllAverages();
        saveState();
      });
    });
    els.subjectsList.querySelectorAll('[data-action="delete-subject"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        subjects = subjects.filter((s) => s.id !== btn.getAttribute('data-id'));
        renderAll();
      });
    });
  }

  els.addSubjectBtn.addEventListener('click', () => {
    subjects.push({ id: 'gc-' + Date.now(), name: t('newSubjectName'), icon: 'book', coef: 1, grades: {} });
    renderAll();
  });

  function getRatingText(percentage) {
    if (percentage >= 80) return t('ratingExcellent');
    if (percentage >= 70) return t('ratingVeryGood');
    if (percentage >= 60) return t('ratingGood');
    if (percentage >= 50) return t('ratingPass');
    if (percentage >= 25) return t('ratingWeak');
    return t('ratingVeryWeak');
  }

  function renderResult() {
    const avg = overallAverage();
    els.resultValue.textContent = avg.toFixed(2);
    const scale = num(els.scaleInput.value) || 20;
    const percentage = (avg / scale) * 100;
    els.resultRating.textContent = getRatingText(percentage);
  }
  els.scaleInput.addEventListener('input', () => { renderResult(); saveState(); });

  function renderAll() {
    renderComponents();
    renderSubjects();
    renderResult();
    saveState();
  }

  /* ================= i18n apply ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.pageTitle.textContent = dict.pageTitle;
    els.pageSubtitle.textContent = dict.pageSubtitle;
    els.componentsSectionLabel.textContent = dict.componentsSectionLabel;
    els.addComponentBtnText.textContent = dict.addComponentBtnText;
    els.addSubjectBtnText.textContent = dict.addSubjectBtnText;
    els.resultLabel.textContent = dict.resultLabel;
    els.scaleLabel.textContent = dict.scaleLabel;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('gradecalc:lang', lang);
    renderSubjects();
    renderResult();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  /* ================= Init ================= */
  function init() {
    const saved = loadState();
    if (saved && saved.subjects && saved.subjects.length && saved.components && saved.components.length) {
      components = saved.components;
      subjects = saved.subjects;
      if (saved.scale) els.scaleInput.value = saved.scale;
    } else {
      components = defaultComponents();
      subjects = defaultSubjects();
    }
    applyLanguage();
    renderAll();
  }

  init();
})();
