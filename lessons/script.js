// ============================================================
// script.js — Word Shortcuts lesson page logic
// ============================================================

(function () {
  "use strict";

  const STR = {
    ar: {
      dir: "rtl",
      pageTitleTag: "اختصارات لوحة المفاتيح في وورد — أكاديمية مرابطي",
      pageTitle: "اختصارات لوحة المفاتيح في وورد",
      pageSub: "أكثر من 100 اختصار مصنّف لتسريع عملك اليومي في مايكروسوفت وورد",
      searchPlaceholder: "ابحث عن اختصار...",
      noResults: "لا توجد اختصارات مطابقة لبحثك",
      trainingCta: "جرّب معلوماتك في تدريب وورد",
      catAll: "الكل",
    },
    en: {
      dir: "ltr",
      pageTitleTag: "Word Keyboard Shortcuts — Merabti Academy",
      pageTitle: "Word Keyboard Shortcuts",
      pageSub: "100+ categorized shortcuts to speed up your everyday work in Microsoft Word",
      searchPlaceholder: "Search a shortcut...",
      noResults: "No shortcuts match your search",
      trainingCta: "Test your knowledge in the Word training",
      catAll: "All",
    },
  };

  let lang = localStorage.getItem("wsl_lang") || "ar";
  let activeCat = "all";
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
    const dict = STR[lang];
    let html = `<button type="button" class="cat-tab ${activeCat === "all" ? "active" : ""}" data-cat="all">${dict.catAll}</button>`;
    CATS.forEach((c) => {
      html += `<button type="button" class="cat-tab ${activeCat === c.id ? "active" : ""}" data-cat="${c.id}">${c.name[lang]}</button>`;
    });
    els.catTabs.innerHTML = html;

    els.catTabs.querySelectorAll(".cat-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCat = btn.getAttribute("data-cat");
        renderTabs();
        renderList();
        const target = els.catTabs;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
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
    const filtered = SC.filter((s) => (activeCat === "all" || s.cat === activeCat) && matchesQuery(s));

    if (filtered.length === 0) {
      els.shortcutsList.innerHTML = "";
      els.noResults.classList.remove("hidden");
      return;
    }
    els.noResults.classList.add("hidden");

    const catsToRender = activeCat === "all" ? CATS : CATS.filter((c) => c.id === activeCat);
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
            <div class="sc-card">
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
  }

  els.searchInput.addEventListener("input", () => {
    query = els.searchInput.value.trim();
    renderList();
  });

  applyLanguage();
})();
