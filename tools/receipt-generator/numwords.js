// ============================================================
// numwords.js — amount in words (Arabic / French / English)
// window.RCPT_AMOUNT_WORDS(amount, currencyId, lang) -> string
// ============================================================
(function () {
  "use strict";

  const CURRENCIES = {
    DZD: { sym: { ar: 'دج', fr: 'DA', en: 'DZD' },
      ar: ['دينار جزائري', 'سنتيم'],
      fr: [['dinar algérien', 'dinars algériens'], ['centime', 'centimes']],
      en: [['Algerian dinar', 'Algerian dinars'], ['centime', 'centimes']] },
    EUR: { sym: { ar: '€', fr: '€', en: '€' },
      ar: ['يورو', 'سنت'],
      fr: [['euro', 'euros'], ['centime', 'centimes']],
      en: [['euro', 'euros'], ['cent', 'cents']] },
    USD: { sym: { ar: '$', fr: '$', en: '$' },
      ar: ['دولار أمريكي', 'سنت'],
      fr: [['dollar américain', 'dollars américains'], ['cent', 'cents']],
      en: [['US dollar', 'US dollars'], ['cent', 'cents']] },
    MAD: { sym: { ar: 'درهم', fr: 'MAD', en: 'MAD' },
      ar: ['درهم مغربي', 'سنتيم'],
      fr: [['dirham marocain', 'dirhams marocains'], ['centime', 'centimes']],
      en: [['Moroccan dirham', 'Moroccan dirhams'], ['centime', 'centimes']] },
  };

  /* ---------- Arabic ---------- */
  const AR_ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const AR_TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const AR_HUND = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  const AR_SCALES = [null, ['ألف', 'ألفان', 'آلاف', 'ألف'], ['مليون', 'مليونان', 'ملايين', 'مليون'], ['مليار', 'ملياران', 'مليارات', 'مليار']];
  function ar999(n) {
    const h = Math.floor(n / 100), r = n % 100, parts = [];
    if (h) parts.push(AR_HUND[h]);
    if (r) {
      if (r < 20) parts.push(AR_ONES[r]);
      else { const o = r % 10, t = Math.floor(r / 10); parts.push(o ? AR_ONES[o] + ' و' + AR_TENS[t] : AR_TENS[t]); }
    }
    return parts.join(' و');
  }
  function arGroup(n, s) {
    if (!s) return ar999(n);
    const [one, two, pl, acc] = AR_SCALES[s];
    if (n === 1) return one;
    if (n === 2) return two;
    const r = n % 100;
    const w = ar999(n);
    if (n <= 10 || (r >= 3 && r <= 10)) return w + ' ' + pl;
    if (r >= 11) return w + ' ' + acc;
    return w.replace(/مائتان$/, 'مائتا') + ' ' + one;
  }
  function arInt(n) {
    if (!n) return 'صفر';
    const parts = [];
    for (let s = 3; s >= 0; s--) {
      const g = Math.floor(n / Math.pow(1000, s)) % 1000;
      if (g) parts.push(arGroup(g, s));
    }
    return parts.join(' و');
  }

  /* ---------- French ---------- */
  const FR_U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze',
    'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const FR_T = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  function fr99(n) {
    if (n < 20) return FR_U[n];
    const t = Math.floor(n / 10), u = n % 10;
    if (t === 7 || t === 9) return FR_T[t] + (t === 7 && u === 1 ? ' et ' : '-') + FR_U[10 + u];
    if (u === 0) return t === 8 ? 'quatre-vingts' : FR_T[t];
    if (u === 1 && t !== 8) return FR_T[t] + ' et un';
    return FR_T[t] + '-' + FR_U[u];
  }
  function fr999(n) {
    const h = Math.floor(n / 100), r = n % 100;
    let s = '';
    if (h) { s = h === 1 ? 'cent' : FR_U[h] + ' cent'; if (!r && h > 1) s += 's'; }
    if (r) s += (s ? ' ' : '') + fr99(r);
    return s;
  }
  function frInt(n) {
    if (!n) return 'zéro';
    const parts = [];
    const bil = Math.floor(n / 1e9) % 1000, mil = Math.floor(n / 1e6) % 1000, th = Math.floor(n / 1000) % 1000, u = n % 1000;
    if (bil) parts.push(fr999(bil) + ' milliard' + (bil > 1 ? 's' : ''));
    if (mil) parts.push(fr999(mil) + ' million' + (mil > 1 ? 's' : ''));
    if (th) parts.push(th === 1 ? 'mille' : fr999(th).replace(/(cent|vingt)s$/, '$1') + ' mille');
    if (u) parts.push(fr999(u));
    return parts.join(' ');
  }

  /* ---------- English ---------- */
  const EN_U = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const EN_T = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function en99(n) { if (n < 20) return EN_U[n]; const t = Math.floor(n / 10), u = n % 10; return EN_T[t] + (u ? '-' + EN_U[u] : ''); }
  function en999(n) {
    const h = Math.floor(n / 100), r = n % 100;
    if (!h) return en99(r);
    return EN_U[h] + ' hundred' + (r ? ' and ' + en99(r) : '');
  }
  function enInt(n) {
    if (!n) return 'zero';
    const names = ['', ' thousand', ' million', ' billion'];
    const parts = [];
    for (let s = 3; s >= 0; s--) {
      const g = Math.floor(n / Math.pow(1000, s)) % 1000;
      if (g) parts.push(en999(g) + names[s]);
    }
    const last = n % 1000;
    if (parts.length > 1 && last > 0 && last < 100) return parts.slice(0, -1).join(' ') + ' and ' + parts[parts.length - 1];
    return parts.join(' ');
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // "12 500,50" / "12500.5" / "12,500.50" -> 12500.5 (null when not a positive number)
  function parseAmount(v) {
    let s = String(v == null ? '' : v).trim().replace(/[\s\u00A0\u202F']/g, '');
    if (!s) return null;
    if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    const n = Number(s);
    return isFinite(n) && n > 0 && n < 1e12 ? Math.round(n * 100) / 100 : null;
  }

  function amountWords(value, cur, lang) {
    const n = parseAmount(value);
    if (n == null) return '';
    const c = CURRENCIES[cur] || CURRENCIES.DZD;
    const int = Math.floor(n), cents = Math.round((n - int) * 100);
    if (lang === 'ar') {
      let s = int === 1 ? c.ar[0] + ' واحد' : arInt(int) + ' ' + c.ar[0];
      if (cents) s += ' و' + ar999(cents) + ' ' + c.ar[1];
      return 'فقط ' + s + ' لا غير';
    }
    if (lang === 'fr') {
      const [main, sub] = c.fr;
      let s = frInt(int) + (int >= 1e6 && int % 1e6 === 0 ? ' de ' : ' ') + (int > 1 ? main[1] : main[0]);
      if (cents) s += ' et ' + frInt(cents) + ' ' + (cents > 1 ? sub[1] : sub[0]);
      return cap(s);
    }
    const [main, sub] = c.en;
    let s = enInt(int) + ' ' + (int === 1 ? main[0] : main[1]);
    if (cents) s += ' and ' + enInt(cents) + ' ' + (cents === 1 ? sub[0] : sub[1]);
    return cap(s);
  }

  function formatAmount(value, cur, lang) {
    const n = parseAmount(value);
    if (n == null) return '';
    const c = CURRENCIES[cur] || CURRENCIES.DZD;
    const loc = lang === 'en' ? 'en-GB' : 'fr-FR';
    const num = n.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[\s\u00A0\u202F]/g, '\u00A0'); // no-break space keeps the number in one bidi run
    return lang === 'en' ? `${c.sym.en}\u00A0${num}` : `${num}\u00A0${c.sym[lang] || c.sym.fr}`;
  }

  window.RCPT_CURRENCIES = CURRENCIES;
  window.RCPT_PARSE_AMOUNT = parseAmount;
  window.RCPT_AMOUNT_WORDS = amountWords;
  window.RCPT_FORMAT_AMOUNT = formatAmount;
})();
