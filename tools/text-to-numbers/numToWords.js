// ============================================================
// numToWords.js — converts a number into words
// Supports: English (en), French (fr), Arabic (ar)
// Adapted for the standalone "Number to Words" tool
// ============================================================

const ZERO_WORDS = { en: "Zero", fr: "Zéro", ar: "صفر" };
const AND_WORDS  = { en: "and", fr: "et", ar: "و" };

/* ---------------------- ENGLISH ---------------------- */

const EN_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const EN_SCALES = ["", "Thousand", "Million", "Billion", "Trillion"];

function en_threeDigits(n) {
  let str = "";
  if (n >= 100) {
    str += EN_ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    str += EN_TENS[Math.floor(n / 10)] + " ";
    n %= 10;
  }
  if (n > 0) {
    str += EN_ONES[n] + " ";
  }
  return str.trim();
}

function en_integerToWords(num) {
  if (num === 0) return ZERO_WORDS.en;
  const groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }
  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) {
      parts.push(en_threeDigits(groups[i]) + (EN_SCALES[i] ? " " + EN_SCALES[i] : ""));
    }
  }
  return parts.join(" ").trim();
}

/* ---------------------- FRENCH ---------------------- */

const FR_ONES = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const FR_TENS_WORDS = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante" };
const FR_SCALES = ["", "mille", "million", "milliard"];

function fr_twoDigits(n) {
  if (n === 0) return "";
  if (n < 20) return FR_ONES[n];
  const tensDigit = Math.floor(n / 10);
  const unit = n % 10;

  if (tensDigit === 7 || tensDigit === 9) {
    const base = tensDigit === 7 ? "soixante" : "quatre-vingt";
    const teenPart = FR_ONES[10 + unit];
    if (tensDigit === 7 && unit === 1) return base + " et " + teenPart;
    return base + "-" + teenPart;
  }
  if (tensDigit === 8) {
    if (unit === 0) return "quatre-vingts";
    return "quatre-vingt-" + FR_ONES[unit];
  }
  const base = FR_TENS_WORDS[tensDigit];
  if (unit === 0) return base;
  if (unit === 1) return base + " et un";
  return base + "-" + FR_ONES[unit];
}

function fr_threeDigits(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let str = "";
  if (h > 0) {
    if (h === 1) str = "cent";
    else str = FR_ONES[h] + " cent" + (r === 0 && h > 1 ? "s" : "");
  }
  if (r > 0) str += (str ? " " : "") + fr_twoDigits(r);
  return str.trim();
}

function fr_integerToWords(num) {
  if (num === 0) return ZERO_WORDS.fr;
  const groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }
  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    if (i === 1 && g === 1) {
      parts.push("mille");
    } else {
      const word = fr_threeDigits(g);
      let scaleWord = FR_SCALES[i];
      if (i >= 2 && g > 1) scaleWord += "s";
      parts.push(word + (scaleWord ? " " + scaleWord : ""));
    }
  }
  return parts.join(" ").trim();
}

/* ---------------------- ARABIC ---------------------- */

const AR_ONES = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
  "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const AR_TENS = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const AR_HUNDREDS = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
const AR_SCALES = [
  null,
  { singular: "ألف", dual: "ألفان", plural: "آلاف" },
  { singular: "مليون", dual: "مليونان", plural: "ملايين" },
  { singular: "مليار", dual: "ملياران", plural: "مليارات" },
];

function ar_twoDigits(n) {
  if (n === 0) return "";
  if (n < 20) return AR_ONES[n];
  const tensDigit = Math.floor(n / 10);
  const unit = n % 10;
  if (unit === 0) return AR_TENS[tensDigit];
  return AR_ONES[unit] + " و" + AR_TENS[tensDigit];
}

function ar_threeDigits(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let str = "";
  if (h > 0) str = AR_HUNDREDS[h];
  if (r > 0) str += (str ? " و" : "") + ar_twoDigits(r);
  return str;
}

function ar_integerToWords(num) {
  if (num === 0) return ZERO_WORDS.ar;
  const groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }
  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    if (i === 0) {
      parts.push(ar_threeDigits(g));
      continue;
    }
    const scale = AR_SCALES[i];
    if (g === 1) {
      parts.push(scale.singular);
    } else if (g === 2) {
      parts.push(scale.dual);
    } else if (g >= 3 && g <= 10) {
      parts.push(ar_threeDigits(g) + " " + scale.plural);
    } else {
      parts.push(ar_threeDigits(g) + " " + scale.singular);
    }
  }
  return parts.join(" و").trim();
}

/* ---------------------- MAIN ENTRY ---------------------- */

/**
 * Converts a number into words in the given language, with optional currency names.
 * @param {number} amount - e.g. 1500.5
 * @param {string} lang - 'en' | 'fr' | 'ar'
 * @param {string} [currencyMain] - optional main currency name (e.g. "دينار جزائري")
 * @param {string} [currencySub] - optional sub-unit name (e.g. "سنتيم")
 * @returns {string}
 */
function numberToWords(amount, lang, currencyMain, currencySub) {
  const safeAmount = isFinite(amount) ? Math.abs(amount) : 0;
  const intPart = Math.floor(safeAmount);
  const decPart = Math.round((safeAmount - intPart) * 100);

  let intWords, decWords;
  if (lang === "fr") {
    intWords = fr_integerToWords(intPart);
    decWords = decPart > 0 ? fr_integerToWords(decPart) : "";
  } else if (lang === "ar") {
    intWords = ar_integerToWords(intPart);
    decWords = decPart > 0 ? ar_integerToWords(decPart) : "";
  } else {
    intWords = en_integerToWords(intPart);
    decWords = decPart > 0 ? en_integerToWords(decPart) : "";
  }

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  if (lang !== "ar") intWords = cap(intWords);

  // No currency: plain number in words
  if (!currencyMain) {
    if (decPart > 0) {
      return `${intWords} ${lang === "ar" ? "فاصلة" : lang === "fr" ? "virgule" : "point"} ${decWords}`.trim();
    }
    return intWords;
  }

  // With currency
  let sentence = `${intWords} ${currencyMain}`;
  if (decPart > 0) {
    sentence += ` ${AND_WORDS[lang]} ${decWords}${currencySub ? " " + currencySub : ""}`;
  }
  return sentence.trim();
}
