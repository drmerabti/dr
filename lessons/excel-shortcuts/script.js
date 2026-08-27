// ============================================================
// script.js — Word Shortcuts lesson page logic
// ============================================================

(function () {
  "use strict";

  const STR = {
    ar: {
      dir: "rtl",
      pageTitleTag: "اختصارات لوحة المفاتيح في إكسل — أكاديمية مرابطي",
      pageTitle: "اختصارات لوحة المفاتيح في إكسل",
      pageSub: "أكثر من 100 اختصار مصنّف لتسريع عملك اليومي في مايكروسوفت إكسل",
      searchPlaceholder: "ابحث عن اختصار...",
      noResults: "لا توجد اختصارات مطابقة لبحثك",
      trainingCta: "جرّب معلوماتك في تدريب إكسل",
      catAll: "الكل",
    },
    en: {
      dir: "ltr",
      pageTitleTag: "Excel Keyboard Shortcuts — Merabti Academy",
      pageTitle: "Excel Keyboard Shortcuts",
      pageSub: "100+ categorized shortcuts to speed up your everyday work in Microsoft Excel",
      searchPlaceholder: "Search a shortcut...",
      noResults: "No shortcuts match your search",
      trainingCta: "Test your knowledge in the Excel training",
      catAll: "All",
    },
  };

  let lang = localStorage.getItem("wsl_lang") || "ar";
  let activeCat = CATS[0].id;
  let query = "";

  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $("htmlRoot"),
    pageTitleTag: $("pageTitleTag"),
    pageTitle: $("pageTitle"),
    pageSub: $("pageSub"),
    searchInput: $("searchInput"),
    catTabs: $("catTabs"),
    shortcutsList: $("shortcutsList"),
    noResults: $("noResults"),
    trainingCtaText: $("trainingCtaText"),
    langBtns: document.querySelectorAll(".lang-btn"),
    kbOverlay: $("kbOverlay"),
    kbCloseBtn: $("kbCloseBtn"),
    kbScName: $("kbScName"),
    kbScDesc: $("kbScDesc"),
    virtualKeyboard: $("virtualKeyboard"),
  };

  function applyLanguage() {
    const dict = STR[lang];
    els.htmlRoot.setAttribute("lang", lang);
    els.htmlRoot.setAttribute("dir", dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.pageTitle.textContent = dict.pageTitle;
    els.pageSub.textContent = dict.pageSub;
    els.searchInput.placeholder = dict.searchPlaceholder;
    els.noResults.textContent = dict.noResults;
    els.trainingCtaText.textContent = dict.trainingCta;

    els.langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem("wsl_lang", lang);
    renderTabs();
    renderList();
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = btn.getAttribute("data-lang");
      applyLanguage();
    });
  });

  function renderTabs() {
    let html = "";
    CATS.forEach((c) => {
      html += `<button type="button" class="cat-tab ${activeCat === c.id ? "active" : ""}" data-cat="${c.id}">${c.name[lang]}</button>`;
    });
    els.catTabs.innerHTML = html;

    els.catTabs.querySelectorAll(".cat-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCat = btn.getAttribute("data-cat");
        renderTabs();
        renderList();
        els.catTabs.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function keyRowHtml(keys) {
    return `<div class="key-row">${keys
      .map((k, i) => (i > 0 ? '<span class="key-plus">+</span>' : "") + `<span class="key">${k}</span>`)
      .join("")}</div>`;
  }

  function matchesQuery(s) {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.name.ar.toLowerCase().includes(q) ||
      s.name.en.toLowerCase().includes(q) ||
      s.desc.ar.toLowerCase().includes(q) ||
      s.desc.en.toLowerCase().includes(q) ||
      s.keys.join("+").toLowerCase().includes(q)
    );
  }

  function renderList() {
    const searching = query.trim().length > 0;
    const filtered = SC.filter((s) => (searching || s.cat === activeCat) && matchesQuery(s));

    if (filtered.length === 0) {
      els.shortcutsList.innerHTML = "";
      els.noResults.classList.remove("hidden");
      return;
    }
    els.noResults.classList.add("hidden");

    const catsToRender = searching ? CATS : CATS.filter((c) => c.id === activeCat);
    let html = "";
    catsToRender.forEach((c) => {
      const items = filtered.filter((s) => s.cat === c.id);
      if (items.length === 0) return;
      html += `<section class="cat-section" id="cat-${c.id}">
        <h2 class="cat-heading">${c.name[lang]}</h2>
        <div class="sc-grid">
          ${items
            .map(
              (s) => `
            <div class="sc-card" data-idx="${SC.indexOf(s)}">
              <div class="sc-body">
                <p class="sc-name">${s.name[lang]}</p>
                <p class="sc-desc">${s.desc[lang]}</p>
              </div>
              ${keyRowHtml(s.keys)}
            </div>`
            )
            .join("")}
        </div>
      </section>`;
    });
    els.shortcutsList.innerHTML = html;

    els.shortcutsList.querySelectorAll(".sc-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 640px)").matches) return; // keyboard modal disabled on mobile
        const idx = parseInt(card.getAttribute("data-idx"), 10);
        openKeyboard(SC[idx]);
      });
    });
  }

  els.searchInput.addEventListener("input", () => {
    query = els.searchInput.value.trim();
    renderList();
  });

  applyLanguage();

  /* ---------------- Virtual keyboard modal ---------------- */

  const KB_ROWS = [
    [{ k: "Esc", w: "wide" }, { k: "F1" }, { k: "F2" }, { k: "F3" }, { k: "F4" }, { k: "F5" }, { k: "F6" }, { k: "F7" }, { k: "F8" }, { k: "F9" }, { k: "F10" }, { k: "F11" }, { k: "F12" }],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", { k: "Backspace", w: "wide", icon: "backspace" }, { k: "Delete", w: "wide", gap: true }],
    [{ k: "Tab", w: "wide" }, "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    [{ k: "CapsLock", w: "wide", icon: "lock" }, "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", { k: "Enter", w: "wide" }],
    [{ k: "Shift", w: "wide" }, "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", { k: "Shift", w: "wide" }],
    [{ k: "Ctrl", w: "wide" }, { k: "Alt", w: "wide" }, { k: "Space", w: "space" }, { k: "Alt", w: "wide" }, { k: "Ctrl", w: "wide" }],
    [{ k: "Home" }, { k: "End" }, { k: "PageUp" }, { k: "PageDown" }, { k: "\u2191" }, { k: "\u2190" }, { k: "\u2193" }, { k: "\u2192" }],
  ];

  function normalizeKey(k) {
    const map = {
      "Page Up": "PageUp",
      "Page Down": "PageDown",
      "→": "→",
      "←": "←",
      "↑": "↑",
      "↓": "↓",
      ">": ".",
      "<": ",",
    };
    if (map[k]) return map[k].toUpperCase();
    return String(k).toUpperCase();
  }

  const VKEY_ICONS = {
    backspace: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M12 9l6 6M18 9l-6 6" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke-linecap="round"/></svg>',
  };

  function openKeyboard(shortcut) {
    els.kbScName.textContent = shortcut.name[lang];
    els.kbScDesc.textContent = shortcut.desc[lang];

    const wanted = new Set(shortcut.keys.map(normalizeKey));
    const alreadyHighlighted = new Set();

    let html = "";
    KB_ROWS.forEach((row) => {
      html += '<div class="kb-row">';
      row.forEach((cell) => {
        const isObj = typeof cell === "object";
        const label = isObj ? cell.k : cell;
        const widthClass = isObj && cell.w ? " " + cell.w : "";
        const gapClass = isObj && cell.gap ? " group-gap" : "";
        const norm = normalizeKey(label);
        const tinyClass = !isObj || !cell.icon ? (label.length >= 6 ? " tiny" : "") : "";
        const content = isObj && cell.icon ? VKEY_ICONS[cell.icon] : label;

        let hlClass = "";
        if (wanted.has(norm) && !alreadyHighlighted.has(norm)) {
          hlClass = " hl";
          alreadyHighlighted.add(norm);
        }

        html += `<span class="vkey${widthClass}${gapClass}${tinyClass}${hlClass}">${content}</span>`;
      });
      html += "</div>";
    });
    els.virtualKeyboard.innerHTML = html;
    els.kbOverlay.classList.remove("hidden");
  }

  function closeKeyboard() {
    els.kbOverlay.classList.add("hidden");
  }

  els.kbCloseBtn.addEventListener("click", closeKeyboard);
  els.kbOverlay.addEventListener("click", (e) => {
    if (e.target === els.kbOverlay) closeKeyboard();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeKeyboard();
  });
})();
