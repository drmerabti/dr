// ============================================================
// script.js — Invoice Generator application logic
// Shell (topbar, right-hand panel, accordion, gallery, "My invoices",
// login, toasts) mirrors tools/brochure-generator.
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
  const MAX_HISTORY = 60;

  /* ---------------- Templates & colors ---------------- */

  const TEMPLATES = [
    { id: "classic", color: "#2F5770" },
    { id: "modern", color: "#2563EB" },
    { id: "elegant", color: "#8A6D3B" },
    { id: "minimal", color: "#111827" },
    { id: "sidebar", color: "#0D9488" },
    { id: "corporate", color: "#B91C1C" },
  ];
  const TPL = Object.fromEntries(TEMPLATES.map((x) => [x.id, x]));
  const SWATCHES = ["#2F5770", "#2563EB", "#0D9488", "#16A34A", "#7C3AED", "#DB2777", "#B91C1C", "#D97706", "#111827"];
  const SEC_COLORS = { style: "#64748B", org: "#16A34A", client: "#0891B2", meta: "#7C3AED", items: "#D97706", totals: "#2563EB", notes: "#DB2777" };

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
    tpl: "classic",
    color: null,
    localId: null,
    cloudId: null,
    legacyId: null,
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

  function newLocalId() { return "L" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function accentColor() { return state.color || (TPL[state.tpl] || TPL.classic).color; }

  // Mix a hex color with white/black — plain hex so html2canvas (no color-mix support) can render it.
  function mixHex(hex, other, weight) {
    const p = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); };
    const a = p(hex), b = p(other);
    return "#" + a.map((v, i) => Math.round(v * weight + b[i] * (1 - weight)).toString(16).padStart(2, "0")).join("");
  }
  function setAccentVars(el, color) {
    el.style.setProperty("--ac", color);
    el.style.setProperty("--ac-soft", mixHex(color, "#ffffff", 0.11));
    el.style.setProperty("--ac-dark", mixHex(color, "#000000", 0.78));
  }

  /* ---------------- Invoice number counter ---------------- */

  function readCounter() {
    const raw = parseInt(localStorage.getItem(STORAGE_KEYS.counter), 10);
    return isNaN(raw) || raw < 1 ? 1 : raw;
  }

  function nextInvoiceNumber() {
    const n = readCounter();
    localStorage.setItem(STORAGE_KEYS.counter, String(n + 1));
    return String(n).padStart(3, "0");
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

  function calcTotals(src) {
    src = src || state;
    let ht = 0;
    (src.items || []).forEach((it) => {
      const qty = clampNonNegative(it.qty);
      const price = clampNonNegative(it.price);
      ht += qty * price;
    });
    const tvaPct = clampNonNegative(src.tvaPercent);
    const tvaAmount = ht * (tvaPct / 100);
    const ttc = ht + tvaAmount;
    return { ht, tvaAmount, ttc, tvaPct };
  }

  /* ---------------- DOM refs ---------------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
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

    saveBtn: $("#saveBtn"),
    typeFactureBtn: $("#typeFactureBtn"),
    typeProformaBtn: $("#typeProformaBtn"),
    invoiceListBody: $("#invoiceListBody"),
    issuerContactList: $("#issuerContactList"),
    addContactBtn: $("#addContactBtn"),
    addContactMenu: $("#addContactMenu"),
    previewIssuerContacts: $("#previewIssuerContacts"),

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
    itemsHt: $("#itemsHt"),

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

    sheet: $("#invoiceSheet"),
    sheetHolder: $("#sheetHolder"),
    previewLogo: $("#previewLogo"),
    previewLogoWrap: $("#previewLogoWrap"),
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

  const show = (el) => el.classList.remove("hidden");
  const hide = (el) => el.classList.add("hidden");

  /* ---------------- Toast ---------------- */

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

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
    document.querySelectorAll("[data-tip]").forEach((node) => {
      node.setAttribute("data-tiptext", t(node.getAttribute("data-tip")));
      node.setAttribute("aria-label", t(node.getAttribute("data-tip")));
    });

    els.langBtns.forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-lang") === lang);
    });
    $("#langToggle").textContent = lang.toUpperCase();
    document.title = t("appTitle") + " — Merabti Academy";

    // amount-in-words placeholder state
    if (state.wordsIsStale) {
      els.amountWordsBox.textContent = t("clickGenerate");
      els.amountWordsBox.classList.add("is-placeholder");
    } else {
      els.amountWordsBox.textContent = state.wordsGenerated;
      els.amountWordsBox.classList.remove("is-placeholder");
    }

    buildStyleControls();
    renderItemsForm();
    renderPreview();
    if (!$("#mine").classList.contains("hidden")) renderMine();
    if (!$("#gallery").classList.contains("hidden")) buildGallery();
  }

  function switchLanguage(lang) {
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
  }

  $("#langToggle").addEventListener("click", (e) => { e.stopPropagation(); $("#langMenu").classList.toggle("hidden"); });
  els.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      hide($("#langMenu"));
      switchLanguage(btn.getAttribute("data-lang"));
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".lang-wrap")) hide($("#langMenu")); });

  /* ---------------- Currency settings modal ---------------- */

  function currencyNames() {
    const saved = readCurrencySettings(currentLang);
    return { main: saved ? saved.main : t("currencyMain"), sub: saved ? saved.sub : t("currencySub") };
  }

  function openSettings() {
    const c = currencyNames();
    els.settingsMainCurrency.value = c.main;
    els.settingsSubCurrency.value = c.sub;
    show(els.settingsOverlay);
    els.settingsMainCurrency.focus();
  }

  els.settingsBtn.addEventListener("click", openSettings);
  els.settingsCancel.addEventListener("click", () => hide(els.settingsOverlay));
  els.settingsOverlay.addEventListener("click", (e) => { if (e.target === els.settingsOverlay) hide(els.settingsOverlay); });
  els.settingsSave.addEventListener("click", () => {
    const main = els.settingsMainCurrency.value.trim() || t("currencyMain");
    const sub = els.settingsSubCurrency.value.trim() || t("currencySub");
    writeCurrencySettings(currentLang, main, sub);
    state.wordsIsStale = true; // currency name changed; force regeneration
    els.amountWordsBox.textContent = t("clickGenerate");
    els.amountWordsBox.classList.add("is-placeholder");
    hide(els.settingsOverlay);
    renderPreview();
    saveDraft();
  });

  /* ---------------- Autosave (localStorage) ---------------- */

  let autosaveDebounce = null;

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
      tpl: state.tpl,
      color: state.color,
      localId: state.localId,
      cloudId: state.cloudId,
      legacyId: state.legacyId,
    };
  }

  function hasContent(src) {
    src = src || state;
    return !!((src.customer || "").trim() ||
      (src.items || []).some((it) => it.article || clampNonNegative(it.qty) > 0 && clampNonNegative(it.price) > 0));
  }

  // Writes the draft and keeps the invoice in the on-device "My invoices" list.
  function commitLocal() {
    try {
      localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(serializeState()));
    } catch (e) {
      return false;
    }
    if (usingExampleData || !hasContent()) return true;
    if (!state.localId) state.localId = newLocalId();
    const history = getHistory();
    const entry = { ...serializeState(), archivedAt: new Date().toISOString() };
    const idx = history.findIndex((h) => h.localId === state.localId);
    if (idx >= 0) history.splice(idx, 1);
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
    return setHistory(history);
  }

  function saveDraft() {
    clearTimeout(autosaveDebounce);
    autosaveDebounce = setTimeout(commitLocal, 500);
  }
  // never lose the last keystrokes when the tab is closed or reloaded
  window.addEventListener("pagehide", () => { clearTimeout(autosaveDebounce); commitLocal(); });

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

    applyEntryToState(saved);
    state.wordsIsStale = saved.wordsIsStale !== false;
    loadedLang = I18N[saved.lang] ? saved.lang : null;

    return true;
  }

  function applyEntryToState(entry) {
    state.logoDataUrl = entry.logoDataUrl || null;
    state.signatureDataUrl = entry.signatureDataUrl || null;
    state.docType = entry.docType || "facture";
    state.issuerContacts = Array.isArray(entry.issuerContacts)
      ? entry.issuerContacts.map((c) => ({ id: nextContactId(), type: c.type, value: c.value || "" }))
      : [];
    state.date = entry.date || todayISO();
    state.invoiceNumber = entry.invoiceNumber || "";
    state.customer = entry.customer || "";
    state.items = Array.isArray(entry.items) && entry.items.length
      ? entry.items.map((it) => ({ id: nextItemId(), article: it.article || "", qty: it.qty, price: it.price }))
      : [{ id: nextItemId(), article: "", qty: 1, price: 0 }];
    state.tvaPercent = entry.tvaPercent != null ? entry.tvaPercent : 19;
    state.notes = entry.notes || "";
    state.wordsGenerated = entry.wordsGenerated || "";
    state.tpl = TPL[entry.tpl] ? entry.tpl : "classic";
    state.color = entry.color || null;
    state.localId = entry.localId || null;
    state.cloudId = entry.cloudId || null;
    state.legacyId = entry.legacyId || null;
  }

  /* ---------------- Notes ---------------- */

  els.notesInput.addEventListener("input", () => {
    state.notes = els.notesInput.value;
    saveDraft();
    renderPreview();
  });

  /* ---------------- Document type ---------------- */

  function setDocType(type) {
    state.docType = type;
    els.typeFactureBtn.classList.toggle("on", type === "facture");
    els.typeProformaBtn.classList.toggle("on", type === "proforma");
    renderDocTypeHeading();
    updateSummaries();
    saveDraft();
  }
  els.typeFactureBtn.addEventListener("click", () => setDocType("facture"));
  els.typeProformaBtn.addEventListener("click", () => setDocType("proforma"));

  /* ---------------- On-device history ---------------- */

  function getHistory() {
    try {
      const h = JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
      // older entries (from the previous version) had no id
      h.forEach((e, i) => { if (!e.localId) e.localId = "old-" + i + "-" + (e.archivedAt || ""); });
      return h;
    } catch (e) {
      return [];
    }
  }
  function setHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
      return true;
    } catch (e) {
      return false; // storage full
    }
  }

  /* ---------------- Account (Firebase): users/{uid}/invoices ---------------- */

  const hasFb = () => typeof firebase !== "undefined" && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
  let currentUser = null;
  const invoicesCol = (uid) => firebase.firestore().collection("users").doc(uid).collection("invoices");
  const legacyCol = () => firebase.firestore().collection("invoices");
  let pendingAfterLogin = null;

  if (hasFb()) {
    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
      if (!$("#mine").classList.contains("hidden")) loadMine();
    });
  }

  function openLogin(after) {
    pendingAfterLogin = after || null;
    show($("#login"));
  }
  function closeLogin() { hide($("#login")); }
  $("#loginCancel").addEventListener("click", () => { pendingAfterLogin = null; closeLogin(); });
  $("#login").addEventListener("click", (e) => { if (e.target.id === "login") { pendingAfterLogin = null; closeLogin(); } });
  $("#loginGoogle").addEventListener("click", async () => {
    if (!hasFb()) { toast(t("t_cloud_err")); return; }
    try {
      await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
      currentUser = firebase.auth().currentUser;
      closeLogin();
      const fn = pendingAfterLogin; pendingAfterLogin = null;
      if (fn) fn();
    } catch (e) { console.error(e); }
  });

  function cloudPayload(src) {
    const copy = { ...src };
    delete copy.cloudId; delete copy.legacyId;
    return {
      title: ((src.customer || "").split("\n")[0] || "").slice(0, 200),
      invoiceNumber: src.invoiceNumber || "",
      docType: src.docType || "facture",
      ttc: calcTotals(src).ttc,
      tpl: src.tpl || "classic",
      lang: src.lang || currentLang,
      state: JSON.stringify(copy),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
  }

  async function saveToAccount() {
    clearTimeout(autosaveDebounce);
    usingExampleData = false;
    const localOk = commitLocal();
    if (!currentUser) {
      toast(localOk ? t("t_saved_local") : t("t_too_big"));
      if (hasFb()) openLogin(saveToAccount);
      return;
    }
    try {
      const data = cloudPayload(serializeState());
      if (data.state.length > 950000) { toast(t("t_too_big")); return; }
      const col = invoicesCol(currentUser.uid);
      if (state.cloudId) {
        await col.doc(state.cloudId).set(data, { merge: true });
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const ref = await col.add(data);
        state.cloudId = ref.id;
      }
      // An invoice opened from the old top-level collection is moved to the new path.
      if (state.legacyId) {
        const old = state.legacyId;
        state.legacyId = null;
        legacyCol().doc(old).delete().catch((err) => console.warn("Legacy cleanup failed:", err));
      }
      commitLocal();
      toast(t("t_saved_cloud"));
    } catch (e) {
      console.error("Cloud save failed:", e);
      toast(t("t_cloud_err"));
    }
  }

  els.saveBtn.addEventListener("click", saveToAccount);

  /* ---------------- My invoices ---------------- */

  const IC_OPEN = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  const IC_DUP = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
  const IC_DEL = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  const IC_PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const IC_DOC = '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/></svg>';

  let currentInvoiceList = [];
  let mineSrc = "all";
  let cloudLoading = false;

  function openMine() {
    show($("#mine"));
    loadMine();
  }
  function closeMine() { hide($("#mine")); }

  async function fetchCloudInvoices() {
    if (!currentUser || !hasFb()) return [];
    const out = [];
    try {
      const snap = await invoicesCol(currentUser.uid).get();
      snap.docs.forEach((d) => {
        const data = d.data();
        let parsed = null;
        try { parsed = JSON.parse(data.state); } catch (e) { /* ignore */ }
        if (!parsed) return;
        out.push({ ...parsed, _source: "cloud", _cloudId: d.id, _ts: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 });
      });
    } catch (e) {
      console.error("Fetching cloud invoices failed:", e);
      toast(t("t_cloud_err"));
    }
    try {
      // invoices saved by the previous version (top-level "invoices" collection)
      const snap = await legacyCol().where("owner", "==", currentUser.uid).get();
      snap.docs.forEach((d) => {
        const data = d.data();
        out.push({ ...data, _source: "legacy", _cloudId: d.id, _ts: data.savedAt && data.savedAt.toMillis ? data.savedAt.toMillis() : 0 });
      });
    } catch (e) {
      console.warn("Legacy invoices unavailable:", e);
    }
    return out;
  }

  async function loadMine() {
    const loggedIn = !!currentUser;
    $("#mineLogin").classList.toggle("hidden", loggedIn || !hasFb());
    let cloud = [];
    if (loggedIn) {
      cloudLoading = true;
      renderMine();
      cloud = await fetchCloudInvoices();
      cloudLoading = false;
    }
    const cloudIds = new Set(cloud.map((c) => c._cloudId));
    const local = getHistory()
      .filter((inv) => !(inv.cloudId && cloudIds.has(inv.cloudId)))
      .map((inv) => ({ ...inv, _source: "local", _ts: new Date(inv.archivedAt || 0).getTime() }));
    currentInvoiceList = [...local, ...cloud].sort((a, b) => b._ts - a._ts);
    renderMine();
  }

  function renderMine() {
    const grid = els.invoiceListBody;
    const fmt = (ms) => { try { return ms ? new Date(ms).toLocaleDateString(currentLang === "ar" ? "ar-DZ" : currentLang) : ""; } catch (e) { return ""; } };
    const list = currentInvoiceList
      .map((inv, idx) => ({ inv, idx }))
      .filter(({ inv }) => mineSrc === "all" || (mineSrc === "local" ? inv._source === "local" : inv._source !== "local"));
    const cards = list.map(({ inv, idx }) => {
      const isCurrent = (inv._source === "local" && inv.localId && inv.localId === state.localId) ||
        (inv._source === "cloud" && inv._cloudId === state.cloudId) ||
        (inv._source === "legacy" && inv._cloudId === state.legacyId);
      const title = ((inv.customer || "").split("\n")[0] || "").trim() || t("untitled");
      const docLabel = inv.docType === "proforma" ? t("typeProforma") : t("typeFacture");
      const color = inv.color || (TPL[inv.tpl] || TPL.classic).color;
      const srcLabel = inv._source === "local" ? t("src_local") : inv._source === "cloud" ? t("src_cloud") : t("legacy");
      return `<div class="g-card m-card" data-idx="${idx}">
        ${isCurrent ? `<span class="m-tag">${t("current")}</span>` : ""}
        <div class="m-top">
          <span class="m-ico" style="--c:${escapeAttr(color)}">${IC_DOC}</span>
          <div class="m-info"><b>${escapeHtml(title)}</b><small>${escapeHtml(docLabel)} · ${escapeHtml(inv.invoiceNumber || "—")}</small></div>
        </div>
        <div class="m-row"><span class="m-amount">${formatMoney(calcTotals(inv).ttc)}</span><span class="m-src ${inv._source === "local" ? "" : "cloud"}">${srcLabel}</span></div>
        <div class="m-date">${fmt(inv._ts)}</div>
        <div class="m-actions">
          <button type="button" class="primary" data-action="restore">${IC_OPEN}${t("open_b")}</button>
          <button type="button" data-action="dup">${IC_DUP}${t("dup_b")}</button>
          <button type="button" class="danger icon" data-action="delete" title="${t("del_b")}" aria-label="${t("del_b")}">${IC_DEL}</button>
        </div></div>`;
    }).join("");
    const tail = cloudLoading ? `<div class="g-empty">${t("loading")}</div>` : (cards ? "" : `<div class="g-empty">${t("mine_empty")}</div>`);
    grid.innerHTML = `<button type="button" class="g-card m-new" data-action="new">${IC_PLUS}<span>${t("new_b")}</span></button>` + cards + tail;
  }

  function restoreInvoice(entry) {
    usingExampleData = false;
    applyEntryToState(entry);
    if (entry._source === "cloud") { state.cloudId = entry._cloudId; state.legacyId = null; }
    if (entry._source === "legacy") { state.cloudId = null; state.legacyId = entry._cloudId; }
    if (entry._source !== "local") {
      const match = getHistory().find((h) => (entry._source === "cloud" && h.cloudId === entry._cloudId) || (entry._source === "legacy" && h.legacyId === entry._cloudId));
      state.localId = match ? match.localId : newLocalId();
    }
    state.wordsIsStale = true;
    syncFormFromState();
    if (entry.lang && I18N[entry.lang] && entry.lang !== currentLang) applyLanguage(entry.lang);
    renderPreview();
    saveDraft();
  }

  $("#btnMine").addEventListener("click", openMine);
  $("#mClose").addEventListener("click", closeMine);
  $("#mineLoginBtn").addEventListener("click", () => openLogin(loadMine));
  $("#mineTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-src]");
    if (!b) return;
    mineSrc = b.dataset.src;
    $$("#mineTabs .chip").forEach((x) => x.classList.toggle("on", x === b));
    renderMine();
  });
  $("#mine").addEventListener("click", async (e) => {
    if (e.target.id === "mine") { closeMine(); return; }
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "new") {
      clearTimeout(autosaveDebounce);
      commitLocal(); // current invoice stays in "My invoices"
      resetState({ assignNewNumber: true });
      closeMine();
      toggleSec(null);
      toast(t("t_new"));
      return;
    }

    const card = btn.closest("[data-idx]");
    const entry = card && currentInvoiceList[parseInt(card.dataset.idx, 10)];
    if (!entry) return;

    if (action === "restore") {
      clearTimeout(autosaveDebounce);
      commitLocal();
      restoreInvoice(entry);
      closeMine();
      toggleSec(null);
      toast(t("t_opened"));
      return;
    }

    if (action === "dup") {
      const copy = { ...entry };
      ["_source", "_cloudId", "_ts", "owner", "savedAt"].forEach((k) => delete copy[k]);
      copy.localId = newLocalId();
      copy.cloudId = null;
      copy.legacyId = null;
      copy.invoiceNumber = nextInvoiceNumber();
      copy.archivedAt = new Date().toISOString();
      const history = getHistory();
      history.unshift(copy);
      if (setHistory(history)) toast(t("t_dup")); else toast(t("t_too_big"));
      loadMine();
      return;
    }

    if (action === "delete") {
      if (!confirm(t("confirm_del"))) return;
      if (entry._source === "local") {
        setHistory(getHistory().filter((h) => h.localId !== entry.localId));
        if (entry.localId === state.localId) state.localId = null;
      } else {
        try {
          if (entry._source === "cloud") await invoicesCol(currentUser.uid).doc(entry._cloudId).delete();
          else await legacyCol().doc(entry._cloudId).delete();
        } catch (err) {
          console.error(err);
          toast(t("t_cloud_err"));
          return;
        }
        if (state.cloudId === entry._cloudId) state.cloudId = null;
        if (state.legacyId === entry._cloudId) state.legacyId = null;
        // forget the link in on-device copies so they show up again as local
        const history = getHistory();
        history.forEach((h) => { if (h.cloudId === entry._cloudId) h.cloudId = null; if (h.legacyId === entry._cloudId) h.legacyId = null; });
        setHistory(history);
      }
      commitLocal();
      toast(t("t_deleted"));
      loadMine();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeMine(); closeLogin(); closeGallery();
    hide(els.settingsOverlay); hide(els.confirmOverlay);
  });

  /* ---------------- Issuer contact fields ---------------- */

  const CONTACT_ICONS = {
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
    address: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    website: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    other: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  };
  let contactIdCounter = 0;
  function nextContactId() { return "contact-" + (++contactIdCounter); }

  function renderIssuerContactsPreview() {
    const dict = I18N[currentLang] || I18N.en;
    els.previewIssuerContacts.innerHTML = state.issuerContacts
      .filter((c) => c.value && c.value.trim())
      .map((c) => {
        const label = dict["contact" + capitalize(c.type)] || "";
        return `<div class="inv-contact-line"><span class="contact-label">${escapeHtml(label)}:</span><bdi class="contact-value">${escapeHtml(c.value)}</bdi></div>`;
      })
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
        <input type="text" class="contact-value-input" ${c.type === "phone" || c.type === "website" || c.type === "email" ? 'dir="ltr"' : 'dir="auto"'} value="${escapeAttr(c.value)}" placeholder="${escapeAttr(dict["contact" + capitalize(c.type) + "Placeholder"] || "")}">
        <button type="button" class="contact-remove" title="${escapeAttr(t("delete"))}">
          <svg viewBox="0 0 24 24"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>
      `;
      els.issuerContactList.appendChild(row);
    });

    renderIssuerContactsPreview();
    updateSummaries();
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  els.addContactBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    els.addContactMenu.hidden = !els.addContactMenu.hidden;
  });
  document.addEventListener("click", (e) => {
    if (!els.addContactMenu.hidden && !els.addContactMenu.contains(e.target) && !els.addContactBtn.contains(e.target)) {
      els.addContactMenu.hidden = true;
    }
  });
  els.addContactMenu.querySelectorAll("button[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      usingExampleData = false;
      state.issuerContacts.push({ id: nextContactId(), type: btn.getAttribute("data-type"), value: "" });
      els.addContactMenu.hidden = true;
      renderIssuerContacts();
      const inputs = els.issuerContactList.querySelectorAll("input");
      if (inputs.length) inputs[inputs.length - 1].focus();
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
      updateSummaries();
      afterPreviewChange();
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
    box.addEventListener("dragover", (e) => { e.preventDefault(); box.style.borderColor = "var(--sc)"; });
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

  els.removeLogoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.logoDataUrl = null;
    els.logoInput.value = "";
    els.logoPreview.hidden = true;
    els.logoPlaceholder.hidden = false;
    renderPreview();
    saveDraft();
  });

  els.removeSignatureBtn.addEventListener("click", (e) => {
    e.stopPropagation();
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

  const IC_TRASH = '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

  function renderItemsForm() {
    els.itemsTbody.innerHTML = "";
    state.items.forEach((item, i) => {
      const tr = document.createElement("div");
      tr.className = "item-row";
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <span class="row-num">${i + 1}</span>
        <div class="c-desc"><input type="text" class="article-input" dir="auto" data-field="article" value="${escapeAttr(item.article)}" placeholder="${escapeAttr(t("article"))}"></div>
        <div class="c-qty" data-label="${escapeAttr(t("quantity"))}"><input type="number" class="qty-input" data-field="qty" min="0" step="1" value="${escapeAttr(item.qty)}"></div>
        <div class="c-price" data-label="${escapeAttr(t("unitPrice"))}"><input type="number" class="price-input" data-field="price" min="0" step="1" value="${escapeAttr(item.price)}"></div>
        <div class="total-cell" data-label="${escapeAttr(t("totalPrice"))}">${formatMoney(clampNonNegative(item.qty) * clampNonNegative(item.price))}</div>
        <div class="td-action">
          <button type="button" class="delete-row-btn" aria-label="${escapeAttr(t("delete"))}" title="${escapeAttr(t("delete"))}">${IC_TRASH}</button>
        </div>
      `;
      els.itemsTbody.appendChild(tr);
    });
  }

  function escapeAttr(str) {
    return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  els.itemsTbody.addEventListener("input", (e) => {
    const field = e.target.getAttribute("data-field");
    if (!field) return;
    usingExampleData = false;
    const tr = e.target.closest(".item-row");
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

  // Enter in the last row adds a new line
  els.itemsTbody.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const tr = e.target.closest(".item-row");
    if (tr && tr === els.itemsTbody.lastElementChild) { e.preventDefault(); addItem(); }
  });

  els.itemsTbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-row-btn");
    if (!btn) return;
    const tr = btn.closest(".item-row");
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

  function addItem() {
    state.items.push({ id: nextItemId(), article: "", qty: 1, price: 0 });
    state.wordsIsStale = true;
    renderItemsForm();
    renderTotals();
    renderPreview();
    const last = els.itemsTbody.lastElementChild;
    if (last) last.querySelector(".article-input").focus();
  }
  els.addArticleBtn.addEventListener("click", addItem);

  /* ---------------- Totals rendering ---------------- */

  function renderTotals() {
    const { ht, tvaAmount, ttc } = calcTotals();
    els.htValue.textContent = formatMoney(ht);
    els.itemsHt.textContent = formatMoney(ht);
    els.tvaValue.textContent = formatMoney(tvaAmount);
    els.ttcValue.textContent = formatMoney(ttc);
    if (state.wordsIsStale) {
      els.amountWordsBox.textContent = t("clickGenerate");
      els.amountWordsBox.classList.add("is-placeholder");
    }
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
    toast(t("t_words"));
  });

  /* ---------------- Preview rendering ---------------- */

  function renderDocTypeHeading() {
    const dict = I18N[currentLang] || I18N.en;
    els.previewDocTypeHeading.textContent = state.docType === "proforma"
      ? dict.docHeadingProforma : dict.docHeadingFacture;
    els.previewDocTypeRef.textContent = state.invoiceNumber || "—";
  }

  function renderInvoiceDensity() {
    const sheet = els.sheet;
    const count = state.items.length;
    sheet.classList.remove("density-compact", "density-tight", "density-extra-tight");
    if (count >= 13) sheet.classList.add("density-extra-tight");
    else if (count >= 9) sheet.classList.add("density-tight");
    else if (count >= 6) sheet.classList.add("density-compact");
  }

  function applyTemplate() {
    const sheet = els.sheet;
    TEMPLATES.forEach((x) => sheet.classList.remove("tpl-" + x.id));
    sheet.classList.add("tpl-" + state.tpl);
    setAccentVars(sheet, accentColor());
  }

  function renderPreview() {
    applyTemplate();

    // Logo
    if (state.logoDataUrl) {
      els.previewLogo.src = state.logoDataUrl;
      els.previewLogo.hidden = false;
      els.previewLogoPlaceholder.hidden = true;
      els.removeLogoBtn.hidden = false;
      els.previewLogoWrap.classList.add("has-logo");
    } else {
      els.previewLogo.hidden = true;
      els.previewLogoPlaceholder.hidden = false;
      els.removeLogoBtn.hidden = true;
      els.previewLogoWrap.classList.remove("has-logo");
    }

    // Meta
    els.previewInvoiceNumber.textContent = state.invoiceNumber || "—";
    els.previewDate.textContent = formatDateDisplay(state.date);
    els.previewCustomer.innerHTML = state.customer ? `<bdi>${escapeHtml(state.customer)}</bdi>` : "—";
    renderDocTypeHeading();
    renderInvoiceDensity();

    // Items
    els.previewItemsBody.innerHTML = "";
    const validItems = state.items.filter((it) => it.article || clampNonNegative(it.qty) > 0 || clampNonNegative(it.price) > 0);
    if (validItems.length === 0) {
      const tr = document.createElement("tr");
      tr.className = "inv-empty-row";
      tr.innerHTML = `<td colspan="5">—</td>`;
      els.previewItemsBody.appendChild(tr);
    } else {
      let rowNum = 0;
      state.items.forEach((item) => {
        if (!item.article && clampNonNegative(item.qty) === 0 && clampNonNegative(item.price) === 0) return;
        rowNum++;
        const qty = clampNonNegative(item.qty);
        const price = clampNonNegative(item.price);
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="inv-num-col">${rowNum}</td>
          <td><bdi>${escapeHtml(item.article) || "—"}</bdi></td>
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
      els.previewNotes.innerHTML = `<bdi>${escapeHtml(state.notes)}</bdi>`;
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

    updateSummaries();
    afterPreviewChange();
    saveDraft();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  /* ---------------- Stage: zoom & highlight ---------------- */

  const SHEET_W = 794, SHEET_H = 1123;
  let zoom = "fit";

  function stageFitScale() {
    const stage = $("#stage");
    const w = (stage.clientWidth - 60) / SHEET_W;
    const h = (stage.clientHeight - 100) / SHEET_H;
    return Math.max(0.2, Math.min(w, h, 1.5));
  }
  function applyZoom() {
    const s = zoom === "fit" ? stageFitScale() : zoom;
    els.sheet.style.transform = `scale(${s})`;
    els.sheetHolder.style.width = (SHEET_W * s) + "px";
    els.sheetHolder.style.height = (els.sheet.offsetHeight * s) + "px";
    $("#zoomVal").textContent = Math.round(s * 100) + "%";
  }
  function setZoom(dir) {
    let s = zoom === "fit" ? stageFitScale() : zoom;
    s = Math.round((s + dir * 0.1) * 10) / 10;
    zoom = Math.max(0.2, Math.min(2, s));
    applyZoom();
  }
  $("#zoomIn").addEventListener("click", () => setZoom(1));
  $("#zoomOut").addEventListener("click", () => setZoom(-1));
  $("#zoomFit").addEventListener("click", () => { zoom = "fit"; applyZoom(); });
  window.addEventListener("resize", () => applyZoom());

  function highlight() {
    $$("[data-sec]", els.sheet).forEach((p) => {
      const on = !!openSec && p.dataset.sec === openSec;
      p.classList.toggle("hl", on);
      if (on) p.style.setProperty("--hl", SEC_COLORS[openSec]);
    });
  }

  let thumbTimer = null;
  function afterPreviewChange() {
    applyZoom();
    highlight();
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(() => {
      renderCurrentThumb();
      if (openSec === "style") renderTplStrip();
    }, 350);
  }

  // clicking a part of the invoice opens its section
  els.sheet.addEventListener("click", (e) => {
    if (e.target.closest(".inv-remove-btn")) return;
    const part = e.target.closest("[data-sec]");
    if (!part) return;
    const k = part.dataset.sec;
    $("#workspace").classList.remove("collapsed");
    toggleSec(k, true);
    setTimeout(() => { const a = $(`.acc[data-sec="${k}"]`); if (a) a.scrollIntoView({ behavior: "smooth", block: "nearest" }); applyZoom(); }, 300);
  });

  /* ---------------- Accordion ---------------- */

  let openSec = null;
  function toggleSec(id, force) {
    openSec = (force === undefined ? openSec !== id : force) ? id : null;
    $$(".acc").forEach((a) => a.classList.toggle("open", a.dataset.sec === openSec));
    if (openSec === "style") renderTplStrip();
    highlight();
  }

  $("#accordion").addEventListener("click", (e) => {
    const head = e.target.closest(".acc-head");
    if (head) { toggleSec(head.closest(".acc").dataset.sec); return; }
    const nx = e.target.closest("[data-next]");
    if (nx) {
      const cur = nx.closest(".acc");
      const next = cur.nextElementSibling;
      if (next && next.classList.contains("acc")) {
        toggleSec(next.dataset.sec, true);
        setTimeout(() => next.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      } else {
        toggleSec(null);
      }
    }
  });

  function cut(x, n) { x = String(x || "").replace(/\s+/g, " ").trim(); n = n || 52; return x.length > n ? x.slice(0, n - 2) + "…" : x; }
  function updateSummaries() {
    const set = (k, v) => { const el = $(`[data-sum="${k}"]`); if (el) el.textContent = v; };
    const c = currencyNames();
    set("style", [t("tpl_" + state.tpl), state.docType === "proforma" ? t("typeProforma") : t("typeFacture"), c.main].join(" · "));
    const contacts = state.issuerContacts.map((x) => x.value).filter((v) => (v || "").trim());
    set("org", contacts.length ? cut(contacts.slice(0, 2).join(" · ")) : t("d_org"));
    set("client", cut((state.customer || "").trim()) || t("d_client"));
    set("meta", (state.invoiceNumber || state.date) ? cut(`${t("reference")} ${state.invoiceNumber || "—"} · ${formatDateDisplay(state.date)}`) : t("d_meta"));
    const n = state.items.filter((it) => it.article || clampNonNegative(it.qty) > 0 && clampNonNegative(it.price) > 0).length;
    const tot = calcTotals();
    set("items", n ? `${n} ${t("lines")} · ${t("ht")} ${formatMoney(tot.ht)}` : t("d_items"));
    set("totals", `${t("tva")} ${tot.tvaPct}% · ${t("ttc")} ${formatMoney(tot.ttc)}`);
    set("notes", cut(state.notes) || t("d_notes"));
    $("#currencySummary").textContent = `${c.main} / ${c.sub}`;
  }

  /* ---------------- Templates: thumbnails, strip, gallery ---------------- */

  // A scaled, id-free copy of the live sheet rendered in another template.
  function miniSheet(tplId, color, width) {
    const clone = els.sheet.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.transform = "";
    $$("[id]", clone).forEach((n) => n.removeAttribute("id"));
    $$(".hl", clone).forEach((n) => n.classList.remove("hl"));
    $$(".inv-remove-btn", clone).forEach((n) => n.remove());
    TEMPLATES.forEach((x) => clone.classList.remove("tpl-" + x.id));
    clone.classList.add("tpl-" + tplId);
    setAccentVars(clone, color);
    const wrap = document.createElement("div");
    wrap.className = "mini";
    wrap.style.width = SHEET_W + "px";
    wrap.style.transform = `scale(${width / SHEET_W})`;
    wrap.appendChild(clone);
    return wrap;
  }

  function renderCurrentThumb() {
    const box = $("#currentThumb");
    box.innerHTML = "";
    box.appendChild(miniSheet(state.tpl, accentColor(), 52));
    $("#currentTplName").textContent = t("tpl_" + state.tpl);
  }

  function renderTplStrip() {
    const strip = $("#tplStrip");
    strip.innerHTML = TEMPLATES.map((x) => `<button type="button" class="tpl-chip ${x.id === state.tpl ? "on" : ""}" data-tpl="${x.id}"><span class="t-thumb"></span><span>${t("tpl_" + x.id)}</span></button>`).join("");
    requestAnimationFrame(() => {
      $$(".tpl-chip", strip).forEach((b) => {
        const th = b.querySelector(".t-thumb");
        const id = b.dataset.tpl;
        th.appendChild(miniSheet(id, id === state.tpl ? accentColor() : TPL[id].color, th.clientWidth || 70));
      });
    });
  }

  function buildStyleControls() {
    const sw = $("#swatches");
    const cur = state.color;
    sw.innerHTML =
      `<button type="button" class="sw auto ${!cur ? "on" : ""}" data-color="" style="--c-a:${TPL[state.tpl].color}" title="${escapeAttr(t("color_auto"))}"></button>` +
      SWATCHES.map((c) => `<button type="button" class="sw ${cur === c ? "on" : ""}" data-color="${c}" style="background:${c}"></button>`).join("") +
      `<label class="sw custom ${cur && !SWATCHES.includes(cur) ? "on" : ""}"><input type="color" id="customColor" value="${cur || TPL[state.tpl].color}"></label>`;
    if (openSec === "style") renderTplStrip();
  }

  function setTemplate(id, fromGallery) {
    state.tpl = id;
    state.color = null;
    buildStyleControls();
    renderPreview();
    renderCurrentThumb();
    if (fromGallery) toast(t("t_tpl"));
  }

  $("#tplStrip").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tpl]");
    if (b) setTemplate(b.dataset.tpl);
  });
  $("#swatches").addEventListener("click", (e) => {
    const b = e.target.closest(".sw[data-color]");
    if (!b) return;
    state.color = b.dataset.color || null;
    buildStyleControls();
    renderPreview();
  });
  $("#swatches").addEventListener("input", (e) => {
    if (e.target.id !== "customColor") return;
    state.color = e.target.value;
    $$("#swatches .sw").forEach((x) => x.classList.toggle("on", x.classList.contains("custom")));
    renderPreview();
  });

  function buildGallery() {
    const grid = $("#gGrid");
    grid.innerHTML = TEMPLATES.map((x) => `<button type="button" class="g-card ${x.id === state.tpl ? "on" : ""}" data-tpl="${x.id}">
        <div class="g-thumb"></div>
        <div class="g-meta"><b>${t("tpl_" + x.id)}</b><span>A4</span></div></button>`).join("");
    requestAnimationFrame(() => {
      $$(".g-card", grid).forEach((card) => {
        const th = card.querySelector(".g-thumb");
        th.appendChild(miniSheet(card.dataset.tpl, card.dataset.tpl === state.tpl ? accentColor() : TPL[card.dataset.tpl].color, th.clientWidth));
      });
    });
  }
  function openGallery() { show($("#gallery")); buildGallery(); }
  function closeGallery() { hide($("#gallery")); }
  $("#btnGallery").addEventListener("click", openGallery);
  $("#gClose").addEventListener("click", closeGallery);
  $("#gallery").addEventListener("click", (e) => {
    if (e.target.id === "gallery") { closeGallery(); return; }
    const card = e.target.closest("[data-tpl]");
    if (card) { closeGallery(); setTemplate(card.dataset.tpl, true); }
  });

  /* ---------------- Actions: Print / PDF / Clear ---------------- */

  // A clean, unscaled copy of the sheet used for printing and PDF capture.
  function buildPrintCopy() {
    const root = $("#printRoot");
    const clone = els.sheet.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.transform = "";
    $$("[id]", clone).forEach((n) => n.removeAttribute("id"));
    $$(".hl", clone).forEach((n) => n.classList.remove("hl"));
    $$(".inv-remove-btn", clone).forEach((n) => n.remove());
    const logoWrap = clone.querySelector(".inv-logo-wrap");
    if (logoWrap && !logoWrap.classList.contains("has-logo")) logoWrap.style.visibility = "hidden";
    root.innerHTML = "";
    root.appendChild(clone);
    return clone;
  }

  els.printBtn.addEventListener("click", () => {
    buildPrintCopy();
    toast(t("t_print"));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(() => setTimeout(() => window.print(), 250));
  });
  window.addEventListener("afterprint", () => { $("#printRoot").innerHTML = ""; });

  let pendingPdfCanvas = null;

  async function buildPdfCanvas() {
    // Wait for web fonts (Tajawal, etc.) to finish loading — otherwise html2canvas
    // can snapshot before Arabic glyphs are ready, rendering them as disconnected/garbled text.
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const copy = buildPrintCopy();
    await new Promise((r) => setTimeout(r, 60));
    const opts = {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
      width: SHEET_W, height: copy.offsetHeight, windowWidth: SHEET_W, scrollX: 0, scrollY: 0,
      // the hidden frame html2canvas renders in reloads the web fonts; drawing before they
      // are ready misplaces Arabic word spacing, so wait for them
      onclone: function (doc) {
        // load, in the hidden copy, every font face the page itself already uses (all weights, Arabic + Latin subsets)
        const loads = [];
        if (document.fonts && doc.fonts) {
          document.fonts.forEach((f) => {
            if (f.status !== "loaded") return;
            const fam = String(f.family).replace(/^["']|["']$/g, "");
            loads.push(doc.fonts.load(`${f.style} ${f.weight} 16px "${fam}"`, "ابتث abc 123").catch(() => {}));
          });
        }
        doc.body && doc.body.getBoundingClientRect();
        const wait = Promise.all(loads).then(() => (doc.fonts && doc.fonts.ready ? doc.fonts.ready : null));
        // never block the export on a slow network: give up waiting after 4 s
        return Promise.race([wait, new Promise((r) => setTimeout(r, 4000))]).then(() => new Promise((r) => setTimeout(r, 80)));
      },
    };
    try {
      return await html2canvas(copy, opts);
    } finally {
      $("#printRoot").innerHTML = "";
    }
  }

  function savePdfFromCanvas(canvas) {
    const imgData = canvas.toDataURL("image/jpeg", 0.93);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0.5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `invoice-${state.invoiceNumber || "draft"}.pdf`;
    pdf.save(filename);
  }

  els.generatePdfBtn.addEventListener("click", async () => {
    if (typeof html2canvas === "undefined" || !window.jspdf) { toast(t("t_pdf_err")); return; }
    els.generatePdfBtn.disabled = true;
    toast(t("t_pdf"));
    try {
      pendingPdfCanvas = await buildPdfCanvas();
      els.pdfPreviewImg.src = pendingPdfCanvas.toDataURL("image/jpeg", 0.9);
      show(els.pdfPreviewOverlay);
    } catch (err) {
      console.error("PDF preview failed:", err);
      toast(t("t_pdf_err"));
    } finally {
      els.generatePdfBtn.disabled = false;
    }
  });

  els.pdfPreviewBack.addEventListener("click", () => {
    hide(els.pdfPreviewOverlay);
    pendingPdfCanvas = null;
  });

  els.pdfPreviewDownload.addEventListener("click", () => {
    if (!pendingPdfCanvas) return;
    savePdfFromCanvas(pendingPdfCanvas);
    hide(els.pdfPreviewOverlay);
    pendingPdfCanvas = null;
    toast(t("t_pdf_ok"));
  });

  els.clearBtn.addEventListener("click", () => show(els.confirmOverlay));
  els.confirmCancel.addEventListener("click", () => hide(els.confirmOverlay));
  els.confirmOverlay.addEventListener("click", (e) => { if (e.target === els.confirmOverlay) hide(els.confirmOverlay); });

  els.confirmOk.addEventListener("click", () => {
    hide(els.confirmOverlay);
    resetState({ assignNewNumber: false });
    toast(t("t_cleared"));
  });

  // Push the state into every form control (used after load / restore / reset).
  function syncFormFromState() {
    els.invoiceDate.value = state.date;
    els.invoiceNumber.value = state.invoiceNumber;
    els.customerName.value = state.customer;
    els.tvaPercent.value = state.tvaPercent;
    els.notesInput.value = state.notes;

    els.logoPreview.hidden = !state.logoDataUrl;
    els.logoPlaceholder.hidden = !!state.logoDataUrl;
    if (state.logoDataUrl) els.logoPreview.src = state.logoDataUrl; else els.logoPreview.removeAttribute("src");
    els.logoInput.value = "";

    els.signaturePreview.hidden = !state.signatureDataUrl;
    els.signaturePlaceholder.hidden = !!state.signatureDataUrl;
    if (state.signatureDataUrl) els.signaturePreview.src = state.signatureDataUrl; else els.signaturePreview.removeAttribute("src");
    els.signatureInput.value = "";

    if (state.wordsIsStale) {
      els.amountWordsBox.textContent = t("clickGenerate");
      els.amountWordsBox.classList.add("is-placeholder");
    } else {
      els.amountWordsBox.textContent = state.wordsGenerated;
      els.amountWordsBox.classList.remove("is-placeholder");
    }

    els.typeFactureBtn.classList.toggle("on", state.docType !== "proforma");
    els.typeProformaBtn.classList.toggle("on", state.docType === "proforma");
    buildStyleControls();
    renderIssuerContacts();
    renderItemsForm();
    renderTotals();
  }

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
    state.localId = opts.assignNewNumber ? newLocalId() : state.localId;
    state.cloudId = opts.assignNewNumber ? null : state.cloudId;
    state.legacyId = opts.assignNewNumber ? null : state.legacyId;

    syncFormFromState();
    renderPreview();
  }

  /* ---------------- Toolbar ---------------- */

  $("#btnFullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $("#panelToggle").addEventListener("click", () => {
    $("#workspace").classList.toggle("collapsed");
    setTimeout(applyZoom, 320);
  });

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
    let siteLang = null;
    try { siteLang = localStorage.getItem("site_lang"); } catch (e) { /* ignore */ }
    const initialLang = loadedLang || (I18N[siteLang] ? siteLang : "ar");
    currentLang = initialLang;

    if (!hadDraft) {
      state.invoiceNumber = nextInvoiceNumber();
      state.localId = newLocalId();
      applyExampleData(initialLang);
      usingExampleData = true;
    }

    syncFormFromState();
    applyLanguage(initialLang);
    if (!hadDraft) generateAmountWords();
    renderTotals();
    renderPreview();
    // every section starts collapsed
    toggleSec(null);
    if (document.fonts) document.fonts.ready.then(() => { applyZoom(); renderCurrentThumb(); });
  }

  init();
})();
