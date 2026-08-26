// ============================================================
// script.js — Invoice Generator application logic
// ============================================================

(function () {
  "use strict";

  let itemIdCounter = 0;
  function nextItemId() { return "item-" + (++itemIdCounter); }
  let loadedLang = null;

  const STORAGE_KEYS = {
    draft: "invoiceApp:draft",
    counter: "invoiceApp:invoiceCounter",
    theme: "invoiceApp:theme",
    history: "invoiceApp:history",
    currency: (lang) => "invoiceApp:currency:" + lang,
  };
  const MAX_HISTORY = 20;

  const state = {
    logoDataUrl: null,
    signatureDataUrl: null,
    date: todayISO(),
    invoiceNumber: "010003",
    customer: "",
    items: [
      { id: nextItemId(), article: "", qty: 1, price: 0 },
    ],
    tvaPercent: 19,
    notes: "",
    wordsGenerated: "",
    wordsIsStale: true,
  };

  function todayISO() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  function formatDateDisplay(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }

  function formatMoney(n) {
    const num = isFinite(n) ? n : 0;
    return "$" + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function clampNonNegative(n) {
    const v = parseFloat(n);
    if (isNaN(v) || v < 0) return 0;
    return v;
  }

  /* ---------------- Invoice number counter ---------------- */

  function readCounter() {
    const raw = parseInt(localStorage.getItem(STORAGE_KEYS.counter), 10);
    return isNaN(raw) || raw < 1 ? 1 : raw;
  }

  function nextInvoiceNumber() {
    const n = readCounter();
    localStorage.setItem(STORAGE_KEYS.counter, String(n + 1));
    return String(n).padStart(6, "0");
  }

  /* ---------------- Per-language currency settings ---------------- */

  function readCurrencySettings(lang) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.currency(lang));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeCurrencySettings(lang, main, sub) {
    localStorage.setItem(STORAGE_KEYS.currency(lang), JSON.stringify({ main, sub }));
  }

  /* ---------------- Calculations ---------------- */

  function calcTotals() {
    let ht = 0;
    state.items.forEach((it) => {
      const qty = clampNonNegative(it.qty);
      const price = clampNonNegative(it.price);
      ht += qty * price;
    });
    const tvaPct = clampNonNegative(state.tvaPercent);
    const tvaAmount = ht * (tvaPct / 100);
    const ttc = ht + tvaAmount;
    return { ht, tvaAmount, ttc, tvaPct };
  }

  /* ---------------- DOM refs ---------------- */

  const $ = (sel) => document.querySelector(sel);
  const els = {
    htmlRoot: $("#htmlRoot"),
    langBtns: document.querySelectorAll(".lang-btn"),

    themeToggle: $("#themeToggle"),
    settingsBtn: $("#settingsBtn"),
    settingsOverlay: $("#settingsOverlay"),
    settingsMainCurrency: $("#settingsMainCurrency"),
    settingsSubCurrency: $("#settingsSubCurrency"),
    settingsCancel: $("#settingsCancel"),
    settingsSave: $("#settingsSave"),

    notesInput: $("#notesInput"),
    previewNotesWrap: $("#previewNotesWrap"),
    previewNotes: $("#previewNotes"),

    newInvoiceBtn: $("#newInvoiceBtn"),
    savedBadge: $("#savedBadge"),

    pdfPreviewOverlay: $("#pdfPreviewOverlay"),
    pdfPreviewImg: $("#pdfPreviewImg"),
    pdfPreviewBack: $("#pdfPreviewBack"),
    pdfPreviewDownload: $("#pdfPreviewDownload"),

    logoInput: $("#logoInput"),
    logoUploadBox: $("#logoUploadBox"),
    logoPlaceholder: $("#logoPlaceholder"),
    logoPreview: $("#logoPreview"),

    invoiceDate: $("#invoiceDate"),
    invoiceNumber: $("#invoiceNumber"),
    customerName: $("#customerName"),

    itemsTbody: $("#itemsTbody"),
    addArticleBtn: $("#addArticleBtn"),

    htValue: $("#htValue"),
    tvaPercent: $("#tvaPercent"),
    tvaValue: $("#tvaValue"),
    ttcValue: $("#ttcValue"),

    amountWordsBox: $("#amountWordsBox"),
    generateWordsBtn: $("#generateWordsBtn"),

    signatureInput: $("#signatureInput"),
    signatureUploadBox: $("#signatureUploadBox"),
    signaturePlaceholder: $("#signaturePlaceholder"),
    signaturePreview: $("#signaturePreview"),

    generatePdfBtn: $("#generatePdfBtn"),
    printBtn: $("#printBtn"),
    clearBtn: $("#clearBtn"),

    previewLogo: $("#previewLogo"),
    previewLogoPlaceholder: $("#previewLogoPlaceholder"),
    previewInvoiceNumber: $("#previewInvoiceNumber"),
    previewDate: $("#previewDate"),
    previewCustomer: $("#previewCustomer"),
    previewItemsBody: $("#previewItemsBody"),
    previewHt: $("#previewHt"),
    previewTvaLabel: $("#previewTvaLabel"),
    previewTva: $("#previewTva"),
    previewTtc: $("#previewTtc"),
    previewWords: $("#previewWords"),
    previewSignature: $("#previewSignature"),

    confirmOverlay: $("#confirmOverlay"),
    confirmCancel: $("#confirmCancel"),
    confirmOk: $("#confirmOk"),
  };

  /* ---------------- i18n application ---------------- */

  function applyLanguage(lang) {
    currentLang = lang;
    const dict = I18N[lang];
    els.htmlRoot.setAttribute("lang", lang);
    els.htmlRoot.setAttribute("dir", dict.dir);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (dict[key] !== undefined) node.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) node.setAttribute("placeholder", dict[key]);
    });

    els.langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // amount-in-words placeholder state
    if (state.wordsIsStale) {
      els.amountWordsBox.textContent = t("clickGenerate");
      els.amountWordsBox.classList.add("is-placeholder");
    } else {
      els.amountWordsBox.textContent = state.wordsGenerated;
      els.amountWordsBox.classList.remove("is-placeholder");
    }

    renderItemsForm();
    renderPreview();
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      state.wordsIsStale = true; // amount words depend on language; force regeneration
      applyLanguage(lang);
    });
  });

  /* ---------------- Theme (dark / light) ---------------- */

  function themeIconSvg(theme) {
    return theme === "dark"
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.3 0-.6-.1-.9A7 7 0 0 1 12 3z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke-linecap="round"/></svg>';
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme) || "light";
    document.documentElement.setAttribute("data-theme", saved);
    els.themeToggle.innerHTML = themeIconSvg(saved);
    els.themeToggle.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      localStorage.setItem(STORAGE_KEYS.theme, cur);
      els.themeToggle.innerHTML = themeIconSvg(cur);
    });
  }

  /* ---------------- Currency settings modal ---------------- */

  function openSettings() {
    const saved = readCurrencySettings(currentLang);
    els.settingsMainCurrency.value = saved ? saved.main : t("currencyMain");
    els.settingsSubCurrency.value = saved ? saved.sub : t("currencySub");
    els.settingsOverlay.hidden = false;
  }

  els.settingsBtn.addEventListener("click", openSettings);
  els.settingsCancel.addEventListener("click", () => { els.settingsOverlay.hidden = true; });
  els.settingsSave.addEventListener("click", () => {
    const main = els.settingsMainCurrency.value.trim() || t("currencyMain");
    const sub = els.settingsSubCurrency.value.trim() || t("currencySub");
    writeCurrencySettings(currentLang, main, sub);
    state.wordsIsStale = true; // currency name changed; force regeneration
    els.amountWordsBox.textContent = t("clickGenerate");
    els.amountWordsBox.classList.add("is-placeholder");
    els.settingsOverlay.hidden = true;
    renderPreview();
    saveDraft();
  });

  /* ---------------- Autosave (localStorage) ---------------- */

  let savedBadgeTimeout = null;
  let autosaveDebounce = null;

  function flashSavedBadge() {
    els.savedBadge.classList.add("show");
    clearTimeout(savedBadgeTimeout);
    savedBadgeTimeout = setTimeout(() => els.savedBadge.classList.remove("show"), 1400);
  }

  function serializeState() {
    return {
      logoDataUrl: state.logoDataUrl,
      signatureDataUrl: state.signatureDataUrl,
      date: state.date,
      invoiceNumber: state.invoiceNumber,
      customer: state.customer,
      items: state.items,
      tvaPercent: state.tvaPercent,
      notes: state.notes,
      wordsGenerated: state.wordsGenerated,
      wordsIsStale: state.wordsIsStale,
      lang: currentLang,
    };
  }

  function saveDraft() {
    clearTimeout(autosaveDebounce);
    autosaveDebounce = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(serializeState()));
        flashSavedBadge();
      } catch (e) {
        // storage full or unavailable — silently skip
      }
    }, 500);
  }

  function loadDraft() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEYS.draft);
    } catch (e) {
      return false;
    }
    if (!raw) return false;
    let saved;
    try {
      saved = JSON.parse(raw);
    } catch (e) {
      return false;
    }
    if (!saved) return false;

    state.logoDataUrl = saved.logoDataUrl || null;
    state.signatureDataUrl = saved.signatureDataUrl || null;
    state.date = saved.date || todayISO();
    state.invoiceNumber = saved.invoiceNumber || "";
    state.customer = saved.customer || "";
    state.items = Array.isArray(saved.items) && saved.items.length
      ? saved.items.map((it) => ({ id: nextItemId(), article: it.article || "", qty: it.qty, price: it.price }))
      : [{ id: nextItemId(), article: "", qty: 1, price: 0 }];
    state.tvaPercent = saved.tvaPercent != null ? saved.tvaPercent : 19;
    state.notes = saved.notes || "";
    state.wordsGenerated = saved.wordsGenerated || "";
    state.wordsIsStale = saved.wordsIsStale !== false;
    loadedLang = I18N[saved.lang] ? saved.lang : null;

    return true;
  }

  /* ---------------- Notes ---------------- */

  els.notesInput.addEventListener("input", () => {
    state.notes = els.notesInput.value;
    saveDraft();
    renderPreview();
  });

  /* ---------------- New Invoice (archives current invoice first) ---------------- */

  function archiveCurrentInvoice() {
    const hasContent = state.customer.trim() ||
      state.items.some((it) => it.article || clampNonNegative(it.qty) > 0 || clampNonNegative(it.price) > 0);
    if (!hasContent) return; // nothing meaningful to archive

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
    } catch (e) {
      history = [];
    }
    history.unshift({ ...serializeState(), archivedAt: new Date().toISOString() });
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch (e) {
      // storage full — skip archiving silently
    }
  }

  els.newInvoiceBtn.addEventListener("click", () => {
    archiveCurrentInvoice();
    resetState({ assignNewNumber: true });
  });

  /* ---------------- Uploads ---------------- */

  function bindUpload(box, input, placeholder, previewImg, onLoaded) {
    box.addEventListener("click", () => input.click());
    box.addEventListener("dragover", (e) => { e.preventDefault(); box.style.borderColor = "var(--blue)"; });
    box.addEventListener("dragleave", () => { box.style.borderColor = ""; });
    box.addEventListener("drop", (e) => {
      e.preventDefault();
      box.style.borderColor = "";
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    input.addEventListener("change", () => {
      if (input.files && input.files[0]) handleFile(input.files[0]);
    });

    function handleFile(file) {
      const valid = /\.(png|jpe?g|svg)$/i.test(file.name) || /^image\//.test(file.type);
      if (!valid) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        placeholder.hidden = true;
        previewImg.hidden = false;
        previewImg.src = dataUrl;
        onLoaded(dataUrl);
        renderPreview();
      };
      reader.readAsDataURL(file);
    }
  }

  bindUpload(els.logoUploadBox, els.logoInput, els.logoPlaceholder, els.logoPreview, (url) => {
    state.logoDataUrl = url;
  });

  bindUpload(els.signatureUploadBox, els.signatureInput, els.signaturePlaceholder, els.signaturePreview, (url) => {
    state.signatureDataUrl = url;
  });

  /* ---------------- Basic fields ---------------- */

  els.invoiceDate.addEventListener("input", () => {
    state.date = els.invoiceDate.value;
    renderPreview();
  });

  els.invoiceNumber.addEventListener("input", () => {
    state.invoiceNumber = els.invoiceNumber.value;
    renderPreview();
  });

  els.customerName.addEventListener("input", () => {
    state.customer = els.customerName.value;
    renderPreview();
  });

  els.tvaPercent.addEventListener("input", () => {
    state.tvaPercent = els.tvaPercent.value;
    state.wordsIsStale = true;
    renderTotals();
    renderPreview();
  });

  /* ---------------- Items table ---------------- */

  function renderItemsForm() {
    els.itemsTbody.innerHTML = "";
    state.items.forEach((item) => {
      const tr = document.createElement("tr");
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td><input type="text" class="input article-input" data-field="article" value="${escapeAttr(item.article)}" placeholder="${t("article")}"></td>
        <td><input type="number" class="input qty-input" data-field="qty" min="0" step="1" value="${item.qty}"></td>
        <td><input type="number" class="input price-input" data-field="price" min="0" step="0.01" value="${item.price}"></td>
        <td class="total-cell">${formatMoney(clampNonNegative(item.qty) * clampNonNegative(item.price))}</td>
        <td class="td-action">
          <button type="button" class="delete-row-btn" aria-label="Delete row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </button>
        </td>
      `;
      els.itemsTbody.appendChild(tr);
    });
  }

  function escapeAttr(str) {
    return String(str == null ? "" : str).replace(/"/g, "&quot;");
  }

  els.itemsTbody.addEventListener("input", (e) => {
    const field = e.target.getAttribute("data-field");
    if (!field) return;
    const tr = e.target.closest("tr");
    const id = tr.dataset.id;
    const item = state.items.find((it) => it.id === id);
    if (!item) return;

    if (field === "article") {
      item.article = e.target.value;
    } else if (field === "qty") {
      item.qty = e.target.value === "" ? "" : clampNonNegative(e.target.value);
    } else if (field === "price") {
      item.price = e.target.value === "" ? "" : clampNonNegative(e.target.value);
    }

    const totalCell = tr.querySelector(".total-cell");
    totalCell.textContent = formatMoney(clampNonNegative(item.qty) * clampNonNegative(item.price));

    state.wordsIsStale = true;
    renderTotals();
    renderPreview();
  });

  els.itemsTbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-row-btn");
    if (!btn) return;
    const tr = btn.closest("tr");
    const id = tr.dataset.id;
    state.items = state.items.filter((it) => it.id !== id);
    if (state.items.length === 0) {
      state.items.push({ id: nextItemId(), article: "", qty: 1, price: 0 });
    }
    state.wordsIsStale = true;
    renderItemsForm();
    renderTotals();
    renderPreview();
  });

  els.addArticleBtn.addEventListener("click", () => {
    state.items.push({ id: nextItemId(), article: "", qty: 1, price: 0 });
    state.wordsIsStale = true;
    renderItemsForm();
    renderTotals();
    renderPreview();
  });

  /* ---------------- Totals rendering ---------------- */

  function renderTotals() {
    const { ht, tvaAmount, ttc, tvaPct } = calcTotals();
    els.htValue.textContent = formatMoney(ht);
    els.tvaValue.textContent = formatMoney(tvaAmount);
    els.ttcValue.textContent = formatMoney(ttc);
  }

  /* ---------------- Amount in words ---------------- */

  els.generateWordsBtn.addEventListener("click", () => {
    const { ttc } = calcTotals();
    const customCurrency = readCurrencySettings(currentLang);
    state.wordsGenerated = amountToWords(
      ttc,
      currentLang,
      customCurrency ? customCurrency.main : null,
      customCurrency ? customCurrency.sub : null
    );
    state.wordsIsStale = false;
    els.amountWordsBox.textContent = state.wordsGenerated;
    els.amountWordsBox.classList.remove("is-placeholder");
    renderPreview();
  });

  /* ---------------- Preview rendering ---------------- */

  function renderPreview() {
    // Logo
    if (state.logoDataUrl) {
      els.previewLogo.src = state.logoDataUrl;
      els.previewLogo.hidden = false;
      els.previewLogoPlaceholder.hidden = true;
    } else {
      els.previewLogo.hidden = true;
      els.previewLogoPlaceholder.hidden = false;
    }

    // Meta
    els.previewInvoiceNumber.textContent = state.invoiceNumber || "—";
    els.previewDate.textContent = formatDateDisplay(state.date);
    els.previewCustomer.textContent = state.customer || "—";

    // Items
    els.previewItemsBody.innerHTML = "";
    const validItems = state.items.filter((it) => it.article || clampNonNegative(it.qty) > 0 || clampNonNegative(it.price) > 0);
    if (validItems.length === 0) {
      const tr = document.createElement("tr");
      tr.className = "inv-empty-row";
      tr.innerHTML = `<td colspan="4">—</td>`;
      els.previewItemsBody.appendChild(tr);
    } else {
      state.items.forEach((item) => {
        if (!item.article && clampNonNegative(item.qty) === 0 && clampNonNegative(item.price) === 0) return;
        const qty = clampNonNegative(item.qty);
        const price = clampNonNegative(item.price);
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(item.article) || "—"}</td>
          <td>${qty}</td>
          <td>${formatMoney(price)}</td>
          <td>${formatMoney(qty * price)}</td>
        `;
        els.previewItemsBody.appendChild(tr);
      });
    }

    // Totals
    const { ht, tvaAmount, ttc, tvaPct } = calcTotals();
    els.previewHt.textContent = formatMoney(ht);
    els.previewTvaLabel.textContent = `${t("tva")} (${tvaPct}%)`;
    els.previewTva.textContent = formatMoney(tvaAmount);
    els.previewTtc.textContent = formatMoney(ttc);

    // Words
    els.previewWords.textContent = state.wordsIsStale ? "—" : state.wordsGenerated;

    // Notes
    if (state.notes && state.notes.trim()) {
      els.previewNotes.textContent = state.notes;
      els.previewNotesWrap.hidden = false;
    } else {
      els.previewNotesWrap.hidden = true;
    }

    // Signature
    if (state.signatureDataUrl) {
      els.previewSignature.src = state.signatureDataUrl;
      els.previewSignature.hidden = false;
    } else {
      els.previewSignature.hidden = true;
    }

    saveDraft();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  /* ---------------- Actions: Print / PDF / Clear ---------------- */

  els.printBtn.addEventListener("click", () => {
    window.print();
  });

  let pendingPdfCanvas = null;

  async function buildPdfCanvas() {
    const sheet = document.getElementById("invoiceSheet");
    return html2canvas(sheet, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  }

  function savePdfFromCanvas(canvas) {
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `invoice-${state.invoiceNumber || "draft"}.pdf`;
    pdf.save(filename);
  }

  els.generatePdfBtn.addEventListener("click", async () => {
    const original = els.generatePdfBtn.textContent;
    els.generatePdfBtn.textContent = "…";
    els.generatePdfBtn.disabled = true;
    try {
      pendingPdfCanvas = await buildPdfCanvas();
      els.pdfPreviewImg.src = pendingPdfCanvas.toDataURL("image/png");
      els.pdfPreviewOverlay.hidden = false;
    } catch (err) {
      console.error("PDF preview failed:", err);
      alert("PDF generation failed. Please try the Print option instead.");
    } finally {
      els.generatePdfBtn.textContent = original;
      els.generatePdfBtn.disabled = false;
    }
  });

  els.pdfPreviewBack.addEventListener("click", () => {
    els.pdfPreviewOverlay.hidden = true;
    pendingPdfCanvas = null;
  });

  els.pdfPreviewDownload.addEventListener("click", () => {
    if (!pendingPdfCanvas) return;
    savePdfFromCanvas(pendingPdfCanvas);
    els.pdfPreviewOverlay.hidden = true;
    pendingPdfCanvas = null;
  });

  els.clearBtn.addEventListener("click", () => {
    els.confirmOverlay.hidden = false;
  });

  els.confirmCancel.addEventListener("click", () => {
    els.confirmOverlay.hidden = true;
  });

  els.confirmOk.addEventListener("click", () => {
    els.confirmOverlay.hidden = true;
    resetState({ assignNewNumber: false });
  });

  function resetState(opts) {
    opts = opts || {};
    state.logoDataUrl = null;
    state.signatureDataUrl = null;
    state.date = todayISO();
    state.invoiceNumber = opts.assignNewNumber ? nextInvoiceNumber() : "";
    state.customer = "";
    state.items = [{ id: nextItemId(), article: "", qty: 1, price: 0 }];
    state.tvaPercent = 19;
    state.notes = "";
    state.wordsGenerated = "";
    state.wordsIsStale = true;

    els.logoPreview.hidden = true;
    els.logoPreview.removeAttribute("src");
    els.logoPlaceholder.hidden = false;
    els.logoInput.value = "";

    els.signaturePreview.hidden = true;
    els.signaturePreview.removeAttribute("src");
    els.signaturePlaceholder.hidden = false;
    els.signatureInput.value = "";

    els.invoiceDate.value = state.date;
    els.invoiceNumber.value = state.invoiceNumber;
    els.customerName.value = "";
    els.tvaPercent.value = 19;
    els.notesInput.value = "";

    els.amountWordsBox.textContent = t("clickGenerate");
    els.amountWordsBox.classList.add("is-placeholder");

    renderItemsForm();
    renderTotals();
    renderPreview();
  }

  /* ---------------- Init ---------------- */

  function init() {
    initTheme();

    const hadDraft = loadDraft();
    const initialLang = loadedLang || "en";

    if (!hadDraft) {
      state.invoiceNumber = nextInvoiceNumber();
    }

    els.invoiceDate.value = state.date;
    els.invoiceNumber.value = state.invoiceNumber;
    els.tvaPercent.value = state.tvaPercent;
    els.notesInput.value = state.notes;

    if (state.logoDataUrl) {
      els.logoPreview.src = state.logoDataUrl;
      els.logoPreview.hidden = false;
      els.logoPlaceholder.hidden = true;
    }
    if (state.signatureDataUrl) {
      els.signaturePreview.src = state.signatureDataUrl;
      els.signaturePreview.hidden = false;
      els.signaturePlaceholder.hidden = true;
    }

    applyLanguage(initialLang);
    renderItemsForm();
    renderTotals();
    renderPreview();
  }

  init();
})();
