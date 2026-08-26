// ============================================================
// script.js — Number to Words tool UI logic
// ============================================================

(function () {
  "use strict";

  const I18N = {
    ar: {
      dir: "rtl", pageTitle: "تحويل الأرقام إلى نص — أكاديمية مرابطي",
      title: "تحويل الأرقام إلى نص",
      inputPlaceholder: "اكتب الرقم هنا... (مثال: 1500.50)",
      currMainLabel: "اسم العملة (اختياري)", currMainPlaceholder: "مثال: دينار جزائري",
      currSubLabel: "اسم الوحدة الفرعية (اختياري)", currSubPlaceholder: "مثال: سنتيم",
      generate: "توليد", copy: "نسخ", copied: "تم النسخ!",
      outputPlaceholder: "النص سيظهر هنا...",
      hint: "اكتب أي رقم (صحيح أو عشري) وسيتحول إلى نص مكتوب — أضف اسم العملة إن أردت.",
      invalid: "يرجى كتابة رقم صحيح.",
    },
    en: {
      dir: "ltr", pageTitle: "Number to Words — Merabti Academy",
      title: "Number to Words",
      inputPlaceholder: "Type a number here... (e.g. 1500.50)",
      currMainLabel: "Currency name (optional)", currMainPlaceholder: "e.g. US Dollar",
      currSubLabel: "Sub-unit name (optional)", currSubPlaceholder: "e.g. Cent",
      generate: "Generate", copy: "Copy", copied: "Copied!",
      outputPlaceholder: "The text will appear here...",
      hint: "Type any number (whole or decimal) to convert it to written words — add a currency name if you like.",
      invalid: "Please enter a valid number.",
    },
    fr: {
      dir: "ltr", pageTitle: "Nombre en Lettres — Académie Merabti",
      title: "Nombre en Lettres",
      inputPlaceholder: "Écrivez un nombre ici... (ex. 1500.50)",
      currMainLabel: "Nom de la devise (optionnel)", currMainPlaceholder: "ex. Dinar Algérien",
      currSubLabel: "Nom de la sous-unité (optionnel)", currSubPlaceholder: "ex. Centime",
      generate: "Générer", copy: "Copier", copied: "Copié !",
      outputPlaceholder: "Le texte apparaîtra ici...",
      hint: "Écrivez un nombre (entier ou décimal) pour le convertir en lettres — ajoutez le nom d'une devise si vous le souhaitez.",
      invalid: "Veuillez saisir un nombre valide.",
    },
  };

  let lang = localStorage.getItem("t2n_lang") || "ar";

  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $("htmlRoot"),
    pageTitle: $("pageTitle"),
    titleText: $("titleText"),
    inputNumber: $("inputNumber"),
    currMainLabel: $("currMainLabel"),
    currencyMain: $("currencyMain"),
    currSubLabel: $("currSubLabel"),
    currencySub: $("currencySub"),
    genLabel: $("genLabel"),
    convertBtn: $("convertBtn"),
    outputText: $("outputText"),
    copyBtn: $("copyBtn"),
    copyLabel: $("copyLabel"),
    hintText: $("hintText"),
    backBtn: $("backBtn"),
    langBtns: document.querySelectorAll(".lang-btn"),
  };

  let outputIsPlaceholder = true;

  function applyLanguage() {
    const dict = I18N[lang];
    els.htmlRoot.setAttribute("lang", lang);
    els.htmlRoot.setAttribute("dir", dict.dir);
    document.title = dict.pageTitle;
    els.titleText.textContent = dict.title;
    els.inputNumber.placeholder = dict.inputPlaceholder;
    els.currMainLabel.textContent = dict.currMainLabel;
    els.currencyMain.placeholder = dict.currMainPlaceholder;
    els.currSubLabel.textContent = dict.currSubLabel;
    els.currencySub.placeholder = dict.currSubPlaceholder;
    els.genLabel.textContent = dict.generate;
    els.copyLabel.textContent = dict.copy;
    els.hintText.textContent = dict.hint;

    if (outputIsPlaceholder) {
      els.outputText.textContent = dict.outputPlaceholder;
      els.outputText.classList.add("is-placeholder");
    }

    els.langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem("t2n_lang", lang);
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = btn.getAttribute("data-lang");
      applyLanguage();
    });
  });

  els.convertBtn.addEventListener("click", () => {
    const raw = els.inputNumber.value.trim().replace(",", ".");
    const num = parseFloat(raw);

    if (raw === "" || isNaN(num)) {
      els.outputText.textContent = I18N[lang].invalid;
      els.outputText.classList.remove("is-placeholder");
      els.outputText.classList.add("is-error");
      outputIsPlaceholder = false;
      return;
    }

    const main = els.currencyMain.value.trim();
    const sub = els.currencySub.value.trim();
    const words = numberToWords(num, lang, main || null, sub || null);

    els.outputText.textContent = words;
    els.outputText.classList.remove("is-placeholder", "is-error");
    outputIsPlaceholder = false;
  });

  els.inputNumber.addEventListener("keydown", (e) => {
    if (e.key === "Enter") els.convertBtn.click();
  });

  els.copyBtn.addEventListener("click", async () => {
    if (outputIsPlaceholder) return;
    try {
      await navigator.clipboard.writeText(els.outputText.textContent);
      const original = els.copyLabel.textContent;
      els.copyLabel.textContent = I18N[lang].copied;
      setTimeout(() => { els.copyLabel.textContent = I18N[lang].copy; }, 1400);
    } catch (e) {
      // clipboard unavailable — silently ignore
    }
  });

  applyLanguage();
})();
