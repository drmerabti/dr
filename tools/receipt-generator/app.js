/* =====================================================================
   مولّد وصل استلام — app.js
   No login required. Everything runs client-side.
===================================================================== */

/* ---------------- Amount → words (tested independently) ---------------- */
const AR_ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const AR_TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const AR_TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const AR_HUNDREDS = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];

function arUnder1000(n){
  if (n === 0) return '';
  const h = Math.floor(n/100), rem = n%100;
  const parts = [];
  if (h > 0) parts.push(AR_HUNDREDS[h]);
  if (rem > 0){
    if (rem < 10) parts.push(AR_ONES[rem]);
    else if (rem < 20) parts.push(AR_TEENS[rem-10]);
    else{
      const t = Math.floor(rem/10), o = rem%10;
      parts.push(o > 0 ? (AR_ONES[o] + ' و' + AR_TENS[t]) : AR_TENS[t]);
    }
  }
  return parts.join(' و');
}
function arScale(n, forms){
  if (n === 1) return forms[0];
  if (n === 2) return forms[1];
  if (n >= 3 && n <= 10) return arUnder1000(n) + ' ' + forms[2];
  return arUnder1000(n) + ' ' + forms[3];
}
function numberToArabicWords(num){
  num = Math.floor(num);
  if (num === 0) return 'صفر';
  const billions = Math.floor(num/1e9), millions = Math.floor((num%1e9)/1e6),
        thousands = Math.floor((num%1e6)/1e3), rest = num%1000;
  const parts = [];
  if (billions > 0) parts.push(arScale(billions, ['مليار','ملياران','مليارات','مليار']));
  if (millions > 0) parts.push(arScale(millions, ['مليون','مليونان','ملايين','مليون']));
  if (thousands > 0) parts.push(arScale(thousands, ['ألف','ألفان','آلاف','ألف']));
  if (rest > 0) parts.push(arUnder1000(rest));
  return parts.join(' و');
}

const EN_ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const EN_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
function enUnder1000(n){
  if (n === 0) return '';
  if (n < 20) return EN_ONES[n];
  if (n < 100) return EN_TENS[Math.floor(n/10)] + (n % 10 ? '-' + EN_ONES[n%10].toLowerCase() : '');
  return EN_ONES[Math.floor(n/100)] + ' Hundred' + (n % 100 ? ' ' + enUnder1000(n%100) : '');
}
function numberToEnglishWords(num){
  num = Math.floor(num);
  if (num === 0) return 'Zero';
  const scales = [[1e9,'Billion'],[1e6,'Million'],[1e3,'Thousand']];
  let parts = [], n = num;
  for (const [v, name] of scales){
    if (n >= v){ const c = Math.floor(n/v); parts.push(enUnder1000(c) + ' ' + name); n %= v; }
  }
  if (n > 0) parts.push(enUnder1000(n));
  return parts.join(' ');
}

const FR_ONES = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const FR_TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
function frUnder100(n){
  if (n < 20) return FR_ONES[n];
  if (n < 70){
    const t = Math.floor(n/10), o = n%10;
    if (o === 0) return FR_TENS[t];
    if (o === 1 && t !== 8) return FR_TENS[t] + ' et un';
    return FR_TENS[t] + '-' + FR_ONES[o];
  }
  if (n < 80) return n === 71 ? 'soixante et onze' : 'soixante-' + FR_ONES[n-60];
  if (n === 80) return 'quatre-vingts';
  if (n < 100) return 'quatre-vingt-' + FR_ONES[n-80];
}
function frUnder1000(n){
  if (n === 0) return '';
  const h = Math.floor(n/100), rem = n%100;
  let s = '';
  if (h > 0) s += (h===1 ? 'cent' : FR_ONES[h] + ' cent') + (h>1 && rem===0 ? 's' : '');
  if (rem > 0) s += (s ? ' ' : '') + frUnder100(rem);
  return s;
}
function numberToFrenchWords(num){
  num = Math.floor(num);
  if (num === 0) return 'zéro';
  const billions = Math.floor(num/1e9), millions = Math.floor((num%1e9)/1e6),
        thousands = Math.floor((num%1e6)/1e3), rest = num%1000;
  const parts = [];
  if (billions>0) parts.push(billions===1 ? 'un milliard' : frUnder1000(billions)+' milliards');
  if (millions>0) parts.push(millions===1 ? 'un million' : frUnder1000(millions)+' millions');
  if (thousands>0) parts.push(thousands===1 ? 'mille' : frUnder1000(thousands)+' mille');
  if (rest>0) parts.push(frUnder1000(rest));
  return parts.join(' ');
}

function amountToWords(amount, currencyName, lang){
  amount = parseFloat(amount) || 0;
  const whole = Math.floor(amount);
  const cents = Math.round((amount - whole) * 100);
  const currency = (currencyName || '').trim();

  if (lang === 'en'){
    let s = numberToEnglishWords(whole) + (currency ? ' ' + currency : '');
    if (cents > 0) s += ' and ' + numberToEnglishWords(cents) + ' cents';
    return 'Only ' + s + ' only';
  }
  if (lang === 'fr'){
    let s = numberToFrenchWords(whole) + (currency ? ' ' + currency : '');
    if (cents > 0) s += ' et ' + numberToFrenchWords(cents) + ' centimes';
    return 'Arrêté à la somme de : ' + s;
  }
  // ar
  let s = numberToArabicWords(whole) + (currency ? ' ' + currency : '');
  if (cents > 0) s += ' و' + numberToArabicWords(cents) + ' سنتيم';
  return 'فقط ' + s + ' لا غير';
}

/* ---------------- i18n ---------------- */
const I18N = {
  ar: {
    pageTitle: 'مولّد وصل استلام', topbarTitle: 'مولّد وصل استلام',
    issuerCardTitle: 'بيانات الجهة المُصدِرة', issuerName: 'اسم الجهة أو الشخص',
    detailsCardTitle: 'بيانات الوصل', receiptNo: 'رقم الوصل', receiptDate: 'التاريخ',
    receivedFrom: 'استلمت من', amount: 'المبلغ', currencyName: 'اسم العملة (مثال: دينار جزائري)',
    forWhat: 'وذلك مقابل', paymentMethod: 'طريقة الدفع',
    payCash: 'نقدًا', payCheck: 'شيك', payTransfer: 'تحويل بنكي', payOther: 'أخرى',
    receiverName: 'اسم المستلم (للتوقيع)',
    downloadPdf: 'تحميل PDF', printBtn: 'طباعة',
    receiptTitle: 'وصل استلام', noLabel: 'رقم', dateLabel: 'التاريخ',
    receivedFromLabel: 'استلمت من', amountLabel: 'مبلغ وقدره', forLabel: 'وذلك مقابل',
    methodLabel: 'طريقة الدفع', signLabel: 'توقيع المستلم',
    issuerPlaceholder: 'اسم الجهة', receivedFromPlaceholder: 'الاسم الكامل',
    forWhatPlaceholder: 'وصف مختصر (مثال: دفعة أولى)', receiverPlaceholder: 'الاسم الكامل',
  },
  en: {
    pageTitle: 'Receipt Generator', topbarTitle: 'Receipt Generator',
    issuerCardTitle: 'Issuer Details', issuerName: 'Business or individual name',
    detailsCardTitle: 'Receipt Details', receiptNo: 'Receipt No.', receiptDate: 'Date',
    receivedFrom: 'Received From', amount: 'Amount', currencyName: 'Currency name (e.g. USD)',
    forWhat: 'For', paymentMethod: 'Payment Method',
    payCash: 'Cash', payCheck: 'Check', payTransfer: 'Bank Transfer', payOther: 'Other',
    receiverName: "Receiver's name (for signature)",
    downloadPdf: 'Download PDF', printBtn: 'Print',
    receiptTitle: 'Receipt', noLabel: 'No.', dateLabel: 'Date',
    receivedFromLabel: 'Received from', amountLabel: 'Amount', forLabel: 'For',
    methodLabel: 'Payment method', signLabel: "Receiver's signature",
    issuerPlaceholder: 'Business name', receivedFromPlaceholder: 'Full name',
    forWhatPlaceholder: 'Short description (e.g. First payment)', receiverPlaceholder: 'Full name',
  },
  fr: {
    pageTitle: 'Générateur de reçu', topbarTitle: 'Générateur de reçu',
    issuerCardTitle: "Coordonnées de l'émetteur", issuerName: "Nom de l'entreprise ou de la personne",
    detailsCardTitle: 'Détails du reçu', receiptNo: 'N° du reçu', receiptDate: 'Date',
    receivedFrom: 'Reçu de', amount: 'Montant', currencyName: 'Nom de la devise (ex. Dinar)',
    forWhat: 'Motif', paymentMethod: 'Mode de paiement',
    payCash: 'Espèces', payCheck: 'Chèque', payTransfer: 'Virement bancaire', payOther: 'Autre',
    receiverName: 'Nom du bénéficiaire (signature)',
    downloadPdf: 'Télécharger le PDF', printBtn: 'Imprimer',
    receiptTitle: 'Reçu', noLabel: 'N°', dateLabel: 'Date',
    receivedFromLabel: 'Reçu de', amountLabel: 'Montant reçu', forLabel: 'Motif',
    methodLabel: 'Mode de paiement', signLabel: 'Signature du bénéficiaire',
    issuerPlaceholder: "Nom de l'entreprise", receivedFromPlaceholder: 'Nom complet',
    forWhatPlaceholder: 'Brève description (ex. Premier versement)', receiverPlaceholder: 'Nom complet',
  },
};

let lang = localStorage.getItem('receipt_lang') || 'ar';
let logoDataUrl = null;

function t(key){ return I18N[lang][key] || key; }
function $(id){ return document.getElementById(id); }

const PAY_METHODS = ['cash','check','transfer','other'];
const PAY_LABELS = { cash: 'payCash', check: 'payCheck', transfer: 'payTransfer', other: 'payOther' };

function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  renderPaymentOptions();
  localStorage.setItem('receipt_lang', lang);
  renderPreview();
}

function renderPaymentOptions(){
  const sel = $('paymentMethod');
  if (!sel) return;
  const current = sel.value || 'cash';
  sel.innerHTML = PAY_METHODS.map(m => `<option value="${m}">${t(PAY_LABELS[m])}</option>`).join('');
  sel.value = current;
}

function renderPreview(){
  $('pvIssuer').textContent = $('issuerName').value || t('issuerPlaceholder');
  $('pvLogo').src = logoDataUrl || '';
  $('pvLogo').classList.toggle('hidden', !logoDataUrl);
  $('pvTitle').textContent = t('receiptTitle');

  $('pvNoLabel').textContent = t('noLabel');
  $('pvNo').textContent = $('receiptNo').value || '—';
  $('pvDateLabel').textContent = t('dateLabel');
  $('pvDate').textContent = $('receiptDate').value || '—';

  $('pvFromLabel').textContent = t('receivedFromLabel');
  $('pvFrom').textContent = $('receivedFrom').value || '—';

  const amt = parseFloat($('amountInput').value) || 0;
  $('pvAmountLabel').textContent = t('amountLabel');
  $('pvAmount').textContent = amt ? amt.toLocaleString(lang === 'ar' ? 'ar' : lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (( $('currencyInput').value || '').trim() ? ' ' + $('currencyInput').value.trim() : '') : '—';
  $('pvAmountWords').textContent = amountToWords($('amountInput').value, $('currencyInput').value, lang);

  $('pvForLabel').textContent = t('forLabel');
  $('pvFor').textContent = $('forWhat').value || '—';

  $('pvMethodLabel').textContent = t('methodLabel');
  $('pvMethod').textContent = t(PAY_LABELS[$('paymentMethod').value] || 'payCash');

  $('pvSignLabel').textContent = t('signLabel');
  $('pvSignName').textContent = $('receiverName').value || '';
}

function initLogoUpload(){
  const box = $('logoBox');
  const input = $('logoInput');
  box.addEventListener('click', (e) => {
    if (e.target.closest('.logo-remove')) return;
    input.click();
  });
  input.addEventListener('change', function(){
    const file = this.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { logoDataUrl = e.target.result; renderLogoBox(); renderPreview(); };
    reader.readAsDataURL(file);
  });
}
function renderLogoBox(){
  const box = $('logoBox');
  box.innerHTML = logoDataUrl
    ? `<img class="logo-preview" src="${logoDataUrl}" alt=""><span class="logo-remove" id="logoRemoveBtn">&times;</span>`
    : `<span class="logo-placeholder">🖼️</span>`;
  const rm = $('logoRemoveBtn');
  if (rm) rm.addEventListener('click', (e) => { e.stopPropagation(); logoDataUrl = null; renderLogoBox(); renderPreview(); });
}

async function downloadPdf(){
  const node = $('receiptCard');
  const canvas = await html2canvas(node, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
  const img = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
  pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('receipt.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
  $('backBtn').addEventListener('click', (e) => { e.preventDefault(); window.location.href = '../../tools.html'; });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => { lang = btn.dataset.lang; applyLanguage(); });
  });

  document.querySelectorAll('.live-field').forEach(el => el.addEventListener('input', renderPreview));
  $('paymentMethod').addEventListener('change', renderPreview);

  initLogoUpload();
  renderLogoBox();

  $('downloadBtn').addEventListener('click', downloadPdf);
  $('printBtn').addEventListener('click', () => window.print());

  // sensible default date = today
  const dateInput = $('receiptDate');
  if (dateInput && !dateInput.value) dateInput.valueAsDate = new Date();

  applyLanguage();
});
