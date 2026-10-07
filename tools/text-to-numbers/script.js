// ============================================================
// script.js — Number to Words tool UI logic
// ============================================================

(function () {
  "use strict";

  const I18N = {
    ar: {
      dir: "rtl", pageTitle: "تحويل الأرقام إلى حروف بالعربية والفرنسية — أكاديمية مرابطي",
      title: "تحويل الأرقام إلى نص",
      inputPlaceholder: "اكتب الرقم هنا... (مثال: 1500.50)",
      currMainLabel: "اسم العملة (اختياري)", currMainPlaceholder: "مثال: دينار جزائري",
      currSubLabel: "اسم الوحدة الفرعية (اختياري)", currSubPlaceholder: "مثال: سنتيم",
      generate: "توليد", copy: "نسخ", copied: "تم النسخ!",
      outputPlaceholder: "النص سيظهر هنا...",
      hint: "اكتب أي رقم (صحيح أو عشري) وسيتحول إلى نص مكتوب — أضف اسم العملة إن أردت.",
      invalid: "يرجى كتابة رقم صحيح.",
      guideWhatTitle: "ما هي الأداة؟",
      guideWhat: "أداة تحويل الأرقام إلى نص تكتب أي رقم أو مبلغ بالحروف بالعربية أو الفرنسية أو الإنجليزية، مع اسم العملة ووحدتها الفرعية إن أردت. تفيدك في كتابة المبالغ في الشيكات والفواتير والعقود والوصولات دون أخطاء.",
      guideHowTitle: "كيف تستعملها؟",
      guideSteps: [
        "اكتب الرقم في الخانة الكبيرة، صحيحًا أو عشريًا (مثال: 1500.50).",
        "أضف اسم العملة ووحدتها الفرعية إن أردت (مثال: دينار جزائري، سنتيم)، ثم اضغط «توليد» أو زر Enter.",
        "اضغط «نسخ» لنسخ النص المكتوب بالحروف، ثم ألصقه في الشيك أو الفاتورة أو أي مستند.",
      ],
      guideFaqTitle: "أسئلة شائعة",
      guideFaq: [
        ["كيف أحصل على النص بالفرنسية أو الإنجليزية؟", "اختر FR أو EN من أعلى الصفحة ثم اضغط «توليد» من جديد، فيُكتب الرقم بلغة الواجهة التي اخترتها."],
        ["كيف تُكتب الأرقام بعد الفاصلة؟", "تُحسب إلى رقمين بعد الفاصلة، وتُكتب بعد كلمة «فاصلة»، أو كوحدة فرعية مثل «خمسون سنتيم» إذا أضفت اسم العملة."],
        ["هل أكتب الفاصلة أم النقطة في الرقم العشري؟", "كلاهما يصلح: اكتب 1500.50 أو 1500,50 وستحصل على النتيجة نفسها."],
      ],
      guideVideo: "شاهد شرح الأداة بالفيديو",
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
      guideWhatTitle: "What is this tool?",
      guideWhat: "Number to Words writes any number or amount out in words in Arabic, French or English, with a currency name and its sub-unit if you wish. It helps you write amounts on cheques, invoices, contracts and receipts without mistakes.",
      guideHowTitle: "How to use it",
      guideSteps: [
        "Type the number in the large field, whole or decimal (e.g. 1500.50).",
        "Add a currency name and its sub-unit if you like (e.g. Dollar, Cent), then click “Generate” or press Enter.",
        "Click “Copy” to copy the text in words, then paste it into your cheque, invoice or any document.",
      ],
      guideFaqTitle: "Frequently asked questions",
      guideFaq: [
        ["How do I get the text in French or Arabic?", "Choose FR or عربي at the top of the page and click “Generate” again: the number is written in the interface language you picked."],
        ["How are decimals written?", "They are rounded to two decimal places and written after the word “point”, or as a sub-unit such as “Fifty cents” when you add a currency name."],
        ["Should I type a comma or a dot for decimals?", "Either works: type 1500.50 or 1500,50 and you will get the same result."],
      ],
      guideVideo: "Watch the video tutorial",
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
      guideWhatTitle: "Qu'est-ce que cet outil ?",
      guideWhat: "L'outil Nombre en Lettres écrit n'importe quel nombre ou montant en toutes lettres en arabe, en français ou en anglais, avec le nom de la devise et de sa sous-unité si vous le souhaitez. Il vous aide à rédiger les montants des chèques, factures, contrats et reçus sans erreur.",
      guideHowTitle: "Comment l'utiliser ?",
      guideSteps: [
        "Saisissez le nombre dans le grand champ, entier ou décimal (ex. 1500.50).",
        "Ajoutez le nom de la devise et de sa sous-unité si vous le souhaitez (ex. Dinar Algérien, Centime), puis cliquez sur « Générer » ou appuyez sur Entrée.",
        "Cliquez sur « Copier » pour copier le texte en lettres, puis collez-le dans votre chèque, votre facture ou tout autre document.",
      ],
      guideFaqTitle: "Questions fréquentes",
      guideFaq: [
        ["Comment obtenir le texte en arabe ou en anglais ?", "Choisissez عربي ou EN en haut de la page puis cliquez de nouveau sur « Générer » : le nombre est écrit dans la langue de l'interface choisie."],
        ["Comment les décimales sont-elles écrites ?", "Elles sont arrondies à deux chiffres après la virgule et écrites après le mot « virgule », ou comme sous-unité, par exemple « cinquante centimes », si vous ajoutez une devise."],
        ["Faut-il taper une virgule ou un point ?", "Les deux fonctionnent : tapez 1500.50 ou 1500,50 et vous obtiendrez le même résultat."],
      ],
      guideVideo: "Regarder la vidéo explicative",
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
    applyGuide(dict);

    if (outputIsPlaceholder) {
      els.outputText.textContent = dict.outputPlaceholder;
      els.outputText.classList.add("is-placeholder");
    }

    els.langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem("t2n_lang", lang);
  }

  // قسم الشرح أسفل الأداة: ما هي، كيف تستعملها، أسئلة شائعة، رابط الفيديو
  function applyGuide(dict) {
    $("guideWhatTitle").textContent = dict.guideWhatTitle;
    $("guideWhat").textContent = dict.guideWhat;
    $("guideHowTitle").textContent = dict.guideHowTitle;
    $("guideSteps").replaceChildren(...dict.guideSteps.map((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      return li;
    }));
    $("guideFaqTitle").textContent = dict.guideFaqTitle;
    $("guideFaq").replaceChildren(...dict.guideFaq.map(([q, a]) => {
      const item = document.createElement("details");
      const summary = document.createElement("summary");
      const answer = document.createElement("p");
      summary.textContent = q;
      answer.textContent = a;
      item.append(summary, answer);
      return item;
    }));
    const videoText = $("guideVideoText");
    if (videoText) videoText.textContent = dict.guideVideo;
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
