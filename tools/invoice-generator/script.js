// ============================================================
// script.js — Invoice Generator application logic
// ============================================================

(function () {
  "use strict";

  let itemIdCounter = 0;
  function nextItemId() { return "item-" + (++itemIdCounter); }
  let loadedLang = null;
  let usingExampleData = false;

  const STORAGE_KEYS = {
    draft: "invoiceApp:draft",
    counter: "invoiceApp:invoiceCounter",
    history: "invoiceApp:history",
    currency: (lang) => "invoiceApp:currency:" + lang,
  };
  const MAX_HISTORY = 20;

  const state = {
    docType: "facture",
    issuerContacts: [],
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
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    saveBtn: $("#saveBtn"),
    typeFactureBtn: $("#typeFactureBtn"),
    typeProformaBtn: $("#typeProformaBtn"),
    mobileActionsToggle: $("#mobileActionsToggle"),
    toolbarActionsGroup: $("#toolbarActionsGroup"),
    savedInvoicesBtn: $("#savedInvoicesBtn"),
    savedInvoicesOverlay: $("#savedInvoicesOverlay"),
    savedInvoicesList: $("#savedInvoicesList"),
    savedInvoicesClose: $("#savedInvoicesClose"),
    issuerContactList: $("#issuerContactList"),
    addContactBtn: $("#addContactBtn"),
    addContactMenu: $("#addContactMenu"),
    previewIssuerContacts: $("#previewIssuerContacts"),
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
    removeLogoBtn: $("#removeLogoBtn"),
    previewInvoiceNumber: $("#previewInvoiceNumber"),
    previewDocTypeHeading: $("#previewDocTypeHeading"),
    previewDocTypeRef: $("#previewDocTypeRef"),
    previewDate: $("#previewDate"),
    previewCustomer: $("#previewCustomer"),
    previewItemsBody: $("#previewItemsBody"),
    previewHt: $("#previewHt"),
    previewTvaLabel: $("#previewTvaLabel"),
    previewTva: $("#previewTva"),
    previewTtc: $("#previewTtc"),
    previewWords: $("#previewWords"),
    previewSignature: $("#previewSignature"),
    removeSignatureBtn: $("#removeSignatureBtn"),

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
      if (usingExampleData) {
        applyExampleData(lang);
        els.customerName.value = state.customer;
        els.notesInput.value = state.notes;
        renderItemsForm();
        renderTotals();
      }
      applyLanguage(lang);
      if (usingExampleData) generateAmountWords();
      renderIssuerContacts();
      renderPreview();
    });
  });

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
      docType: state.docType,
      issuerContacts: state.issuerContacts,
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
    state.docType = saved.docType || "facture";
    state.issuerContacts = Array.isArray(saved.issuerContacts)
      ? saved.issuerContacts.map((c) => ({ id: nextContactId(), type: c.type, value: c.value || "" }))
      : [];
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

  els.saveBtn.addEventListener("click", () => {
    saveDraft();
    flashSavedBadge();
  });

  function setDocType(type) {
    state.docType = type;
    els.typeFactureBtn.classList.toggle("active", type === "facture");
    els.typeProformaBtn.classList.toggle("active", type === "proforma");
    renderDocTypeHeading();
    saveDraft();
  }
  els.typeFactureBtn.addEventListener("click", () => setDocType("facture"));
  els.typeProformaBtn.addEventListener("click", () => setDocType("proforma"));

  /* ---------------- Mobile actions dropdown ---------------- */

  els.mobileActionsToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    els.toolbarActionsGroup.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (els.toolbarActionsGroup.classList.contains("open") &&
        !els.toolbarActionsGroup.contains(e.target) && e.target !== els.mobileActionsToggle) {
      els.toolbarActionsGroup.classList.remove("open");
    }
  });
  els.toolbarActionsGroup.querySelectorAll(".tbtn").forEach((btn) => {
    btn.addEventListener("click", () => els.toolbarActionsGroup.classList.remove("open"));
  });

  /* ---------------- Saved invoices ---------------- */

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
    } catch (e) {
      return [];
    }
  }
  function setHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch (e) {
      // storage full — skip silently
    }
  }

  function renderSavedInvoices() {
    const dict = I18N[currentLang] || I18N.en;
    const history = getHistory();
    if (history.length === 0) {
      els.savedInvoicesList.innerHTML = `<p style="color:var(--text-faint); text-align:center; padding:20px 0;">${dict.noSavedInvoices}</p>`;
      return;
    }
    els.savedInvoicesList.innerHTML = history.map((inv, idx) => {
      const d = new Date(inv.archivedAt);
      const dateStr = isNaN(d) ? "" : d.toLocaleString();
      return `
        <div class="saved-invoice-row" data-idx="${idx}">
          <div class="saved-invoice-info">
            <div class="num">${escapeAttr(inv.invoiceNumber || "—")} — ${escapeAttr(inv.customer || "")}</div>
            <div class="date">${dateStr}</div>
          </div>
          <div class="saved-invoice-actions">
            <button type="button" class="restore-btn" data-action="restore">${dict.restore}</button>
            <button type="button" class="delete-btn" data-action="delete">${dict.delete}</button>
          </div>
        </div>
      `;
    }).join("");
  }

  els.savedInvoicesBtn.addEventListener("click", () => {
    renderSavedInvoices();
    els.savedInvoicesOverlay.hidden = false;
  });
  els.savedInvoicesClose.addEventListener("click", () => {
    els.savedInvoicesOverlay.hidden = true;
  });
  els.savedInvoicesList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const row = btn.closest(".saved-invoice-row");
    const idx = parseInt(row.dataset.idx, 10);
    const history = getHistory();
    const entry = history[idx];
    if (!entry) return;

    if (btn.dataset.action === "delete") {
      history.splice(idx, 1);
      setHistory(history);
      renderSavedInvoices();
      return;
    }

    // Restore
    usingExampleData = false;
    state.docType = entry.docType || "facture";
    state.issuerContacts = Array.isArray(entry.issuerContacts)
      ? entry.issuerContacts.map((c) => ({ id: nextContactId(), type: c.type, value: c.value || "" }))
      : [];
    state.logoDataUrl = entry.logoDataUrl || null;
    state.signatureDataUrl = entry.signatureDataUrl || null;
    state.date = entry.date || todayISO();
    state.invoiceNumber = entry.invoiceNumber || "";
    state.customer = entry.customer || "";
    state.items = Array.isArray(entry.items) && entry.items.length
      ? entry.items.map((it) => ({ id: nextItemId(), article: it.article || "", qty: it.qty, price: it.price }))
      : [{ id: nextItemId(), article: "", qty: 1, price: 0 }];
    state.tvaPercent = entry.tvaPercent != null ? entry.tvaPercent : 19;
    state.notes = entry.notes || "";
    state.wordsGenerated = entry.wordsGenerated || "";
    state.wordsIsStale = true;

    els.invoiceDate.value = state.date;
    els.invoiceNumber.value = state.invoiceNumber;
    els.customerName.value = state.customer;
    els.tvaPercent.value = state.tvaPercent;
    els.notesInput.value = state.notes;

    els.logoPreview.hidden = !state.logoDataUrl;
    els.logoPlaceholder.hidden = !!state.logoDataUrl;
    if (state.logoDataUrl) els.logoPreview.src = state.logoDataUrl;

    els.signaturePreview.hidden = !state.signatureDataUrl;
    els.signaturePlaceholder.hidden = !!state.signatureDataUrl;
    if (state.signatureDataUrl) els.signaturePreview.src = state.signatureDataUrl;

    els.typeFactureBtn.classList.toggle("active", state.docType !== "proforma");
    els.typeProformaBtn.classList.toggle("active", state.docType === "proforma");

    renderIssuerContacts();
    renderItemsForm();
    renderTotals();
    renderPreview();
    saveDraft();
    els.savedInvoicesOverlay.hidden = true;
  });

  /* ---------------- Issuer contact fields ---------------- */

  const CONTACT_ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
    address: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  };
  let contactIdCounter = 0;
  function nextContactId() { return "contact-" + (++contactIdCounter); }

  function renderIssuerContactsPreview() {
    els.previewIssuerContacts.innerHTML = state.issuerContacts
      .filter((c) => c.value && c.value.trim())
      .map((c) => `<div class="inv-contact-line">${escapeAttr(c.value)}</div>`)
      .join("");
  }

  function renderIssuerContacts() {
    const dict = I18N[currentLang] || I18N.en;

    // Form side
    els.issuerContactList.innerHTML = "";
    state.issuerContacts.forEach((c) => {
      const row = document.createElement("div");
      row.className = "issuer-contact-row";
      row.dataset.id = c.id;
      row.innerHTML = `
        <span class="contact-icon">${CONTACT_ICONS[c.type] || CONTACT_ICONS.other}</span>
        <input type="text" class="input contact-value-input" value="${escapeAttr(c.value)}" placeholder="${dict["contact" + capitalize(c.type) + "Placeholder"] || ""}">
        <button type="button" class="contact-remove" title="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>
      `;
      els.issuerContactList.appendChild(row);
    });

    renderIssuerContactsPreview();
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  els.addContactBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    els.addContactMenu.hidden = !els.addContactMenu.hidden;
  });
  document.addEventListener("click", (e) => {
    if (!els.addContactMenu.hidden && !els.addContactMenu.contains(e.target) && e.target !== els.addContactBtn) {
      els.addContactMenu.hidden = true;
    }
  });
  els.addContactMenu.querySelectorAll("button[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      usingExampleData = false;
      state.issuerContacts.push({ id: nextContactId(), type: btn.getAttribute("data-type"), value: "" });
      els.addContactMenu.hidden = true;
      renderIssuerContacts();
      saveDraft();
    });
  });
  els.issuerContactList.addEventListener("input", (e) => {
    if (!e.target.classList.contains("contact-value-input")) return;
    usingExampleData = false;
    const id = e.target.closest(".issuer-contact-row").dataset.id;
    const c = state.issuerContacts.find((x) => x.id === id);
    if (c) {
      c.value = e.target.value;
      renderIssuerContactsPreview(); // preview only — avoids stealing focus from the input
      saveDraft();
    }
  });
  els.issuerContactList.addEventListener("click", (e) => {
    const btn = e.target.closest(".contact-remove");
    if (!btn) return;
    const id = btn.closest(".issuer-contact-row").dataset.id;
    state.issuerContacts = state.issuerContacts.filter((x) => x.id !== id);
    renderIssuerContacts();
    renderPreview();
    saveDraft();
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
    usingExampleData = false;
    state.logoDataUrl = url;
    saveDraft();
  });

  bindUpload(els.signatureUploadBox, els.signatureInput, els.signaturePlaceholder, els.signaturePreview, (url) => {
    usingExampleData = false;
    state.signatureDataUrl = url;
    saveDraft();
  });

  els.removeLogoBtn.addEventListener("click", () => {
    state.logoDataUrl = null;
    els.logoInput.value = "";
    els.logoPreview.hidden = true;
    els.logoPlaceholder.hidden = false;
    renderPreview();
    saveDraft();
  });

  els.removeSignatureBtn.addEventListener("click", () => {
    state.signatureDataUrl = null;
    els.signatureInput.value = "";
    els.signaturePreview.hidden = true;
    els.signaturePlaceholder.hidden = false;
    renderPreview();
    saveDraft();
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
    usingExampleData = false;
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
    usingExampleData = false;
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

  function generateAmountWords() {
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
  }

  els.generateWordsBtn.addEventListener("click", () => {
    generateAmountWords();
    renderPreview();
  });

  /* ---------------- Preview rendering ---------------- */

  function renderDocTypeHeading() {
    const dict = I18N[currentLang] || I18N.en;
    els.previewDocTypeHeading.textContent = state.docType === "proforma"
      ? dict.docHeadingProforma : dict.docHeadingFacture;
    els.previewDocTypeRef.textContent = (dict.reference || "Reference") + ": " + (state.invoiceNumber || "—");
  }

  function renderPreview() {
    // Logo
    if (state.logoDataUrl) {
      els.previewLogo.src = state.logoDataUrl;
      els.previewLogo.hidden = false;
      els.previewLogoPlaceholder.hidden = true;
      els.removeLogoBtn.hidden = false;
    } else {
      els.previewLogo.hidden = true;
      els.previewLogoPlaceholder.hidden = false;
      els.removeLogoBtn.hidden = true;
    }

    // Meta
    els.previewInvoiceNumber.textContent = state.invoiceNumber || "—";
    els.previewDate.textContent = formatDateDisplay(state.date);
    els.previewCustomer.textContent = state.customer || "—";
    renderDocTypeHeading();

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
      els.removeSignatureBtn.hidden = false;
    } else {
      els.previewSignature.hidden = true;
      els.removeSignatureBtn.hidden = true;
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
    // Wait for web fonts (Tajawal, etc.) to finish loading — otherwise html2canvas
    // can snapshot before Arabic glyphs are ready, rendering them as disconnected/garbled text.
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
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
    usingExampleData = false;
    state.docType = "facture";
    state.issuerContacts = [];
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

    els.typeFactureBtn.classList.add("active");
    els.typeProformaBtn.classList.remove("active");
    renderIssuerContacts();

    renderItemsForm();
    renderTotals();
    renderPreview();
  }

  /* ---------------- Init ---------------- */

  const EXAMPLE_DATA = {
    en: {
      customer: "Atlas Trading Co.\n45 Independence Blvd, Algiers",
      items: [
        { article: "Website design & development", qty: 1, price: 45000 },
        { article: "Monthly hosting & maintenance", qty: 3, price: 1500 },
        { article: "Logo & brand identity package", qty: 1, price: 8000 },
        { article: "SEO optimization (one-time)", qty: 1, price: 12000 },
        { article: "Content writing (per page)", qty: 6, price: 800 },
      ],
      notes: "Payment due within 15 days of invoice date. Bank transfer or check accepted. Late payments subject to a 2% monthly fee.",
      contacts: [
        { type: "phone", value: "+213 555 12 34 56" },
        { type: "email", value: "contact@yourcompany.com" },
        { type: "address", value: "12 Rue des Frères Bouadou, Algiers 16000" },
      ],
    },
    fr: {
      customer: "Atlas Trading Co.\n45 Boulevard de l'Indépendance, Alger",
      items: [
        { article: "Conception et développement de site web", qty: 1, price: 45000 },
        { article: "Hébergement et maintenance mensuelle", qty: 3, price: 1500 },
        { article: "Pack logo et identité visuelle", qty: 1, price: 8000 },
        { article: "Optimisation SEO (unique)", qty: 1, price: 12000 },
        { article: "Rédaction de contenu (par page)", qty: 6, price: 800 },
      ],
      notes: "Paiement exigible sous 15 jours à compter de la date de facture. Virement bancaire ou chèque acceptés. Pénalité de 2% par mois de retard.",
      contacts: [
        { type: "phone", value: "+213 555 12 34 56" },
        { type: "email", value: "contact@votreentreprise.com" },
        { type: "address", value: "12 Rue des Frères Bouadou, Alger 16000" },
      ],
    },
    ar: {
      customer: "شركة أطلس للتجارة\n45 شارع الاستقلال، الجزائر العاصمة",
      items: [
        { article: "تصميم وتطوير موقع إلكتروني", qty: 1, price: 45000 },
        { article: "استضافة وصيانة شهرية", qty: 3, price: 1500 },
        { article: "باقة شعار وهوية بصرية", qty: 1, price: 8000 },
        { article: "تحسين محركات البحث (مرة واحدة)", qty: 1, price: 12000 },
        { article: "كتابة محتوى (للصفحة الواحدة)", qty: 6, price: 800 },
      ],
      notes: "الدفع مستحق خلال 15 يومًا من تاريخ الفاتورة. يُقبل التحويل البنكي أو الشيك. تُطبَّق غرامة تأخير 2% شهريًا.",
      contacts: [
        { type: "phone", value: "+213 555 12 34 56" },
        { type: "email", value: "contact@yourcompany.com" },
        { type: "address", value: "12 شارع الإخوة بوعدو، الجزائر العاصمة 16000" },
      ],
    },
  };

  function applyExampleData(lang) {
    const ex = EXAMPLE_DATA[lang] || EXAMPLE_DATA.en;
    state.customer = ex.customer;
    state.items = ex.items.map((it) => ({ id: nextItemId(), article: it.article, qty: it.qty, price: it.price }));
    state.notes = ex.notes || "";
    state.issuerContacts = (ex.contacts || []).map((c) => ({ id: nextContactId(), type: c.type, value: c.value }));
  }

  function init() {

    const hadDraft = loadDraft();
    const initialLang = loadedLang || "en";

    if (!hadDraft) {
      state.invoiceNumber = nextInvoiceNumber();
      applyExampleData(initialLang);
      usingExampleData = true;
    }

    els.invoiceDate.value = state.date;
    els.invoiceNumber.value = state.invoiceNumber;
    els.customerName.value = state.customer;
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

    els.typeFactureBtn.classList.toggle("active", state.docType !== "proforma");
    els.typeProformaBtn.classList.toggle("active", state.docType === "proforma");
    renderIssuerContacts();

    applyLanguage(initialLang);
    if (!hadDraft) generateAmountWords();
    renderItemsForm();
    renderTotals();
    renderPreview();
  }

  init();
})();
