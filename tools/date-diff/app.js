// ============================================================
// app.js — Date Difference Calculator (ar / en / fr, no login)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'حاسبة الفرق بين تاريخين — أكاديمية مرابطي',
      pageTitle: 'حاسبة الفرق بين تاريخين',
      pageSubtitle: 'احسب الفرق بين أي تاريخين، أو فعّل "حتى اليوم" لمعرفة سنّك بالضبط',
      labelStart: 'التاريخ الأول', labelEnd: 'التاريخ الثاني',
      untilTodayLabel: 'حتى اليوم (لحساب السن تلقائيًا)',
      calc: 'احسب', emptyHint: 'اختر التاريخين واضغط "احسب"',
      errBothDates: 'الرجاء اختيار التاريخين.',
      errOrder: 'يجب أن يكون التاريخ الأول قبل التاريخ الثاني.',
      resultTemplate: (y, m, d) => {
        const parts = [];
        if (y) parts.push(`${y} ${y === 1 ? 'سنة' : y === 2 ? 'سنتان' : y <= 10 ? 'سنوات' : 'سنة'}`);
        if (m) parts.push(`${m} ${m === 1 ? 'شهر' : m === 2 ? 'شهران' : 'أشهر'}`);
        parts.push(`${d} ${d === 1 ? 'يوم' : d === 2 ? 'يومان' : 'يوم'}`);
        return parts.join('، ');
      },
      resultSub: (totalDays, totalWeeks) => `= ${totalDays.toLocaleString('ar')} يومًا إجمالًا · ${totalWeeks.toLocaleString('ar')} أسبوعًا`,
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Date Difference Calculator — Merabti Academy',
      pageTitle: 'Date Difference Calculator',
      pageSubtitle: 'Calculate the difference between any two dates, or enable "Until today" to know your exact age',
      labelStart: 'First date', labelEnd: 'Second date',
      untilTodayLabel: 'Until today (calculate age automatically)',
      calc: 'Calculate', emptyHint: 'Pick both dates and press "Calculate"',
      errBothDates: 'Please select both dates.',
      errOrder: 'The first date must be before the second date.',
      resultTemplate: (y, m, d) => {
        const parts = [];
        if (y) parts.push(`${y} year${y === 1 ? '' : 's'}`);
        if (m) parts.push(`${m} month${m === 1 ? '' : 's'}`);
        parts.push(`${d} day${d === 1 ? '' : 's'}`);
        return parts.join(', ');
      },
      resultSub: (totalDays, totalWeeks) => `= ${totalDays.toLocaleString('en')} days total · ${totalWeeks.toLocaleString('en')} weeks`,
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Calculateur de différence de dates — Académie Merabti',
      pageTitle: 'Calculateur de différence de dates',
      pageSubtitle: "Calculez la différence entre deux dates, ou activez « Jusqu'à aujourd'hui » pour connaître votre âge exact",
      labelStart: 'Première date', labelEnd: 'Deuxième date',
      untilTodayLabel: "Jusqu'à aujourd'hui (calcul automatique de l'âge)",
      calc: 'Calculer', emptyHint: 'Choisissez les deux dates puis appuyez sur « Calculer »',
      errBothDates: 'Veuillez sélectionner les deux dates.',
      errOrder: 'La première date doit précéder la deuxième.',
      resultTemplate: (y, m, d) => {
        const parts = [];
        if (y) parts.push(`${y} an${y === 1 ? '' : 's'}`);
        if (m) parts.push(`${m} mois`);
        parts.push(`${d} jour${d === 1 ? '' : 's'}`);
        return parts.join(', ');
      },
      resultSub: (totalDays, totalWeeks) => `= ${totalDays.toLocaleString('fr')} jours au total · ${totalWeeks.toLocaleString('fr')} semaines`,
    },
  };

  let lang = localStorage.getItem('ddcalc:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    labelStart: $('labelStart'), labelEnd: $('labelEnd'),
    dateStart: $('dateStart'), dateEnd: $('dateEnd'),
    untilToday: $('untilToday'), untilTodayLabel: $('untilTodayLabel'),
    calcBtn: $('calcBtn'), calcBtnText: $('calcBtnText'), ddError: $('ddError'),
    resultCard: $('resultCard'), resultMain: $('resultMain'), resultSub: $('resultSub'), emptyHint: $('emptyHint'),
  };

  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.pageTitle.textContent = dict.pageTitle;
    els.pageSubtitle.textContent = dict.pageSubtitle;
    els.labelStart.textContent = dict.labelStart;
    els.labelEnd.textContent = dict.labelEnd;
    els.untilTodayLabel.textContent = dict.untilTodayLabel;
    els.calcBtnText.textContent = dict.calc;
    els.emptyHint.textContent = dict.emptyHint;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('ddcalc:lang', lang);
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  /* ================= Until-today toggle ================= */
  function syncUntilToday() {
    const on = els.untilToday.checked;
    els.dateEnd.disabled = on;
    els.dateEnd.style.opacity = on ? '.4' : '1';
    if (on) {
      const today = new Date();
      els.dateEnd.value = today.toISOString().slice(0, 10);
    }
  }
  els.untilToday.addEventListener('change', syncUntilToday);
  syncUntilToday();

  /* ================= Calculation ================= */
  function showError(msg) {
    els.ddError.textContent = msg;
    els.ddError.classList.remove('hidden');
    els.resultCard.classList.add('hidden');
    els.emptyHint.classList.remove('hidden');
  }

  function calcDiff(start, end) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.round((end - start) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);

    return { years, months, days, totalDays, totalWeeks };
  }

  els.calcBtn.addEventListener('click', () => {
    els.ddError.classList.add('hidden');

    if (els.untilToday.checked) {
      const today = new Date();
      els.dateEnd.value = today.toISOString().slice(0, 10);
    }

    if (!els.dateStart.value || !els.dateEnd.value) {
      showError(t('errBothDates'));
      return;
    }

    const start = new Date(els.dateStart.value);
    const end = new Date(els.dateEnd.value);

    if (start > end) {
      showError(t('errOrder'));
      return;
    }

    const { years, months, days, totalDays, totalWeeks } = calcDiff(start, end);
    els.resultMain.textContent = t('resultTemplate')(years, months, days);
    els.resultSub.textContent = t('resultSub')(totalDays, totalWeeks);
    els.resultCard.classList.remove('hidden');
    els.emptyHint.classList.add('hidden');
  });

  applyLanguage();
})();
