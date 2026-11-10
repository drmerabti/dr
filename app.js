/* ================= Google Analytics (GA4) ================= */
(function () {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6PKBD7XR0M';
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-6PKBD7XR0M');
})();

/* =====================================================================
   CONTENT STORE
   هذا هو المكان الوحيد الذي تعدّل فيه لإضافة دروس / تطبيقات / أدوات.
   لإضافة أداة جديدة: أنشئ مجلدها في tools/اسم-الأداة/ ثم أضف سطرًا هنا
   داخل CONTENT.tools فقط — لا حاجة لتعديل أي صفحة أخرى.
===================================================================== */

const ICONS = {
  memoOrganizerApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12h12l4 5h26a3 3 0 0 1 3 3v6H7v-11a3 3 0 0 1 3-3Z" fill="url(#miD) #064b79"/><path d="M8 20h13l4 5h29a3 3 0 0 1 3 3v6H5v-11a3 3 0 0 1 3-3Z" fill="url(#miM) #2389b8"/><path d="M7 28h14l4 5h31a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V31a3 3 0 0 1 2-3Z" fill="url(#miL) #b8ddf5"/><rect x="24" y="43" width="16" height="4" rx="2" fill="#f5fbff" stroke="none"/></g></svg>`,
  favorites: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14a4 4 0 0 1 4-4h13l5 6h26a4 4 0 0 1 4 4v4H6Z" fill="url(#miD) #064b79"/><rect x="12" y="14" width="34" height="18" rx="2" fill="#f5fbff"/><path d="M17 20h18" stroke="#75c6ed" stroke-width="2"/><path d="M4 24h56l-3 28a4 4 0 0 1-4 3.6H11A4 4 0 0 1 7 52Z" fill="url(#miM) #2389b8"/><path d="M32 28L35.17 34.63L42.46 35.6L37.14 40.67L38.47 47.9L32 44.4L25.53 47.9L26.86 40.67L21.54 35.6L28.83 34.63Z" fill="url(#miA) #f0b23e"/></g></svg>`,
  cvApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4H46L55 13V57Q55 60 52 60H12Q9 60 9 57V7Q9 4 12 4Z" fill="url(#miP) #e2f2fc"/><path d="M46 4V11Q46 13 48 13H55" fill="url(#miL) #b8ddf5"/><rect x="14" y="10" width="15" height="17" rx="3.5" fill="url(#miL) #b8ddf5"/><circle cx="21.5" cy="14.9" r="2.9" fill="url(#miM) #2389b8"/><path d="M16.22 24.8V22.16Q16.22 18.86 19.52 18.86H23.48Q26.78 18.86 26.78 22.16V24.8Z" fill="url(#miM) #2389b8"/><path d="M33 13.5h14" stroke="#064b79" stroke-width="3"/><path d="M33 19.5h11M33 24h8" stroke="#75c6ed" stroke-width="2.2"/><rect x="14" y="32" width="10" height="3.6" rx="1.8" fill="url(#miM) #2389b8" stroke="none"/><path d="M14 39h34M14 44h28" stroke="#75c6ed" stroke-width="2.2"/><rect x="14" y="49" width="10" height="3.6" rx="1.8" fill="url(#miM) #2389b8" stroke="none"/><circle cx="32" cy="51" r="1.5" fill="url(#miA) #f0b23e" stroke="none"/><circle cx="37.5" cy="51" r="1.5" fill="url(#miA) #f0b23e" stroke="none"/><circle cx="43" cy="51" r="1.5" fill="url(#miL) #b8ddf5" stroke="none"/></g></svg>`,
     attendanceApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="46" height="46" rx="6" fill="url(#miP) #e2f2fc"/><path d="M4 17v-5a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v5Z" fill="url(#miM) #2389b8"/><path d="M17 17v35M37 17v35" stroke="#b8ddf5" stroke-width="1.5"/><path d="M4 29h46M4 40.5h46" stroke="#b8ddf5" stroke-width="1.5"/><circle cx="10.5" cy="11.5" r="1.5" fill="#f5fbff" stroke="none"/><path d="M23 11.5h8M41 11.5h4" stroke="#f5fbff" stroke-width="2"/><circle cx="10.5" cy="23" r="3.4" fill="url(#miM) #2389b8" stroke="none"/><path d="M21 23h11" stroke="#75c6ed" stroke-width="2.2"/><path d="M40.2 23.2l1.96 1.96l3.64-3.92" stroke="#2f9e6e" stroke-width="2.4"/><circle cx="10.5" cy="34.7" r="3.4" fill="url(#miH) #75c6ed" stroke="none"/><path d="M21 34.7h11" stroke="#75c6ed" stroke-width="2.2"/><path d="M40.2 34.9l1.96 1.96l3.64-3.92" stroke="#2f9e6e" stroke-width="2.4"/><circle cx="10.5" cy="46.2" r="3.4" fill="url(#miM) #2389b8" stroke="none"/><path d="M21 46.2h11" stroke="#75c6ed" stroke-width="2.2"/><path d="M40.5 46.2h5" stroke="#e2694f" stroke-width="2.4"/><circle cx="51" cy="50" r="10" fill="url(#miA) #f0b23e"/><path d="M54.25 46.75C53.5 45.12 47 45 47 48C47 50.5 55 49.75 55 52.38C55 55.38 48.5 55.25 47.5 53.38M51 43V57" stroke="#f5fbff" stroke-width="1.7"/></g></svg>`,
  invoiceApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5h36a3 3 0 0 1 3 3v51l-4.6-3-4.6 3-4.6-3-4.6 3-4.6-3-4.6 3-4.6-3L8 59V8a3 3 0 0 1 3-3Z" fill="url(#miP) #e2f2fc"/><rect x="14" y="10" width="16" height="7" rx="2" fill="url(#miM) #2389b8" stroke="none"/><path d="M14 20.5h10" stroke="#75c6ed" stroke-width="2"/><path d="M14 25h20M14 31h16M14 37h20" stroke="#75c6ed" stroke-width="2.2"/><path d="M40 25h5M40 31h5M40 37h5" stroke="#2389b8" stroke-width="2.2"/><path d="M14 43.5h31" stroke="#b8ddf5" stroke-width="1.6"/><rect x="26" y="46" width="19" height="6" rx="2" fill="url(#miD) #064b79" stroke="none"/><circle cx="49" cy="13" r="9" fill="url(#miA) #f0b23e"/><path d="M51.92 10.07C51.25 8.61 45.4 8.5 45.4 11.2C45.4 13.45 52.6 12.78 52.6 15.14C52.6 17.84 46.75 17.73 45.85 16.04M49 6.7V19.3" stroke="#f5fbff" stroke-width="1.7"/></g></svg>`,
  numbersApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="54" height="48" rx="7" fill="url(#miP) #e2f2fc"/><path d="M11 17.38l2.47-2.38v11.4M17.08 17.85a3.04 3.04 0 0 1 6.08 0c0 3.23-6.08 5.32-6.08 8.55h6.27M26.58 15h5.7l-3.23 4.18a3.61 3.61 0 1 1-2.66 6.46" stroke="#2389b8" stroke-width="2.8"/><rect x="37" y="13" width="17" height="17" rx="4" fill="url(#miM) #2389b8"/><path d="M45.5 17.5v8M41.5 21.5h8" stroke="#f5fbff" stroke-width="2.4"/><rect x="10" y="35" width="17" height="15" rx="4" fill="url(#miL) #b8ddf5"/><path d="M14.5 39.5l8 6M22.5 39.5l-8 6" stroke="#064b79" stroke-width="2.4"/><rect x="31" y="35" width="23" height="15" rx="4" fill="url(#miA) #f0b23e"/><path d="M36.5 40.5h12M36.5 45h12" stroke="#f5fbff" stroke-width="2.4"/></g></svg>`,
  wordApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M27 7H47L56 16V54Q56 57 53 57H27Q24 57 24 54V10Q24 7 27 7Z" fill="url(#miP) #e2f2fc"/><path d="M47 7V14Q47 16 49 16H56" fill="url(#miL) #b8ddf5"/><path d="M37 21h13M37 27h13M37 33h13M37 39h13M37 45h7.8" stroke="#75c6ed" stroke-width="2.4"/><rect x="8" y="20" width="25" height="25" rx="5" fill="url(#miM) #2389b8"/><path d="M15 27.5l2.4 10l3.1-7l3.1 7l2.4-10" stroke="#f5fbff" stroke-width="2.6"/></g></svg>`,
  /* Word page + a "Ctrl" key: the Word shortcuts book */
  wordShortcutsApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="20" width="24" height="28" rx="5" fill="url(#miL) #b8ddf5"/><rect x="4.5" y="22" width="19" height="20" rx="3.5" fill="#f5fbff"/><path d="M9 32h10" stroke="#2389b8" stroke-width="2.8"/><path d="M32 33v8M28 37h8" stroke="#07547f" stroke-width="2.4"/><rect x="38" y="20" width="24" height="28" rx="5" fill="url(#miL) #b8ddf5"/><rect x="40.5" y="22" width="19" height="20" rx="3.5" fill="#f5fbff"/><path d="M45.6 28l1.92 8l2.48-5.6l2.48 5.6l1.92-8" stroke="#2389b8" stroke-width="2.6"/></g></svg>`,
  /* two speech bubbles, "EN" and "ع": the English with Claudio book */
  englishClaudioApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8h28a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5H21l-7 6v-6h-4a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z" fill="url(#miP) #e2f2fc"/><path d="M14 27l5-13 5 13M15.8 22.6h6.4" stroke="#2389b8" stroke-width="2.6"/><circle cx="31" cy="23.5" r="3.6" fill="none" stroke="#2389b8" stroke-width="2.6"/><path d="M34.6 19.5V27" stroke="#2389b8" stroke-width="2.6"/><path d="M54 30H31a5 5 0 0 0-5 5v11a5 5 0 0 0 5 5h13l7 6v-6h3a5 5 0 0 0 5-5V35a5 5 0 0 0-5-5Z" fill="url(#miM) #2389b8"/><circle cx="35" cy="40.5" r="2" fill="#f5fbff" stroke="none"/><circle cx="42" cy="40.5" r="2" fill="#f5fbff" stroke="none"/><circle cx="49" cy="40.5" r="2" fill="#f5fbff" stroke="none"/></g></svg>`,
  pcSolutionsApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="50" height="34" rx="4" fill="url(#miD) #064b79"/><rect x="7.5" y="10.5" width="43" height="27" rx="1.5" fill="url(#miP) #e2f2fc" stroke="none"/><path d="M24 41l-1.5 6h13l-1.5-6Z" fill="url(#miM) #2389b8"/><rect x="18" y="47" width="22" height="3.6" rx="1.8" fill="url(#miM) #2389b8"/><path d="M13 18h20M13 24h28M13 30h14" stroke="#75c6ed" stroke-width="2.4"/><circle cx="49" cy="45" r="11" fill="url(#miM) #2389b8"/><path d="M54.18 45L55.97 45.66L55.69 47.06L53.79 46.98L52.66 48.66L52.66 48.66L53.46 50.39L52.28 51.19L50.98 49.79L49 50.18L49 50.18L48.34 51.97L46.94 51.69L47.02 49.79L45.34 48.66L45.34 48.66L43.61 49.46L42.81 48.28L44.21 46.98L43.82 45L43.82 45L42.03 44.34L42.31 42.94L44.21 43.02L45.34 41.34L45.34 41.34L44.54 39.61L45.72 38.81L47.02 40.21L49 39.82L49 39.82L49.66 38.03L51.06 38.31L50.98 40.21L52.66 41.34L52.66 41.34L54.39 40.54L55.19 41.72L53.79 43.02L54.18 45Z M51.52 45a2.52 2.52 0 1 0 -5.04 0a2.52 2.52 0 1 0 5.04 0Z" fill="#f5fbff" fill-rule="evenodd" stroke="none"/></g></svg>`,
  excelApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M27 7H47L56 16V54Q56 57 53 57H27Q24 57 24 54V10Q24 7 27 7Z" fill="url(#miP) #e2f2fc"/><path d="M47 7V14Q47 16 49 16H56" fill="url(#miL) #b8ddf5"/><path d="M26 22h30M26 31h30M26 40h30M26 49h30M40 15v42" stroke="#75c6ed" stroke-width="1.8"/><rect x="8" y="20" width="25" height="25" rx="5" fill="url(#miG) #2f9e6e"/><path d="M16.2 27.55l8.6 9.89M24.8 27.55l-8.6 9.89" stroke="#f5fbff" stroke-width="2.8"/></g></svg>`,
  accessApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M28 14c0-3 6-5.5 13-5.5s13 2.5 13 5.5v34c0 3-6 5.5-13 5.5s-13-2.5-13-5.5Z" fill="url(#miP) #e2f2fc"/><path d="M28 14c0 3 6 5.5 13 5.5s13-2.5 13-5.5" fill="none"/><path d="M28 26c0 3 6 5.5 13 5.5s13-2.5 13-5.5M28 38c0 3 6 5.5 13 5.5s13-2.5 13-5.5" fill="none" stroke="#75c6ed" stroke-width="2"/><rect x="8" y="22" width="25" height="25" rx="5" fill="url(#miV) #7b5fc4"/><path d="M15.9 39.5L20.5 29.5L25.1 39.5M17.9 35.9h5.2" stroke="#f5fbff" stroke-width="2.8"/></g></svg>`,
  aiDetectorApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6H33L42 15V49Q42 52 39 52H11Q8 52 8 49V9Q8 6 11 6Z" fill="url(#miP) #e2f2fc"/><path d="M33 6V13Q33 15 35 15H42" fill="url(#miL) #b8ddf5"/><path d="M14 19h20M14 25h20M14 31h20M14 37h20M14 43h12" stroke="#75c6ed" stroke-width="2.4"/><circle cx="40" cy="38" r="12" fill="url(#miL) #b8ddf5"/><path d="M40 31Q41.96 36.04 47 38Q41.96 39.96 40 45Q38.04 39.96 33 38Q38.04 36.04 40 31Z" fill="url(#miA) #f0b23e" stroke="none"/><path d="M48.8 46.8L57 55" stroke="#07547f" stroke-width="5.5"/><path d="M48.8 46.8L57 55" stroke="#064b79" stroke-width="3.2"/></g></svg>`,
  humanizerApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6v5" stroke="#07547f" stroke-width="1.6"/><circle cx="17" cy="5" r="2" fill="url(#miA) #f0b23e"/><rect x="6" y="11" width="22" height="19" rx="5" fill="url(#miL) #b8ddf5"/><circle cx="13" cy="20" r="2.4" fill="url(#miM) #2389b8" stroke="none"/><circle cx="21" cy="20" r="2.4" fill="url(#miM) #2389b8" stroke="none"/><path d="M13 25.5h8" stroke="#2389b8" stroke-width="2"/><path d="M18 36c0 10 6 15 14 15" fill="none" stroke="#2389b8" stroke-width="2.6"/><path d="M29 46.5l5 4.5-5 4.5" fill="none" stroke="#2389b8" stroke-width="2.6"/><circle cx="46" cy="19.06" r="5.06" fill="url(#miM) #2389b8"/><path d="M36.8 36.31V31.71Q36.8 25.96 42.55 25.96H49.45Q55.2 25.96 55.2 31.71V36.31Z" fill="url(#miM) #2389b8"/><path d="M36 9Q37.12 11.88 40 13Q37.12 14.12 36 17Q34.88 14.12 32 13Q34.88 11.88 36 9Z" fill="url(#miA) #f0b23e" stroke="none"/></g></svg>`,
  budgetApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="14" r="9" fill="url(#miP) #e2f2fc"/><path d="M18 14V5a9 9 0 0 1 8.6 11.7Z" fill="url(#miA) #f0b23e"/><path d="M18 14l8.6 2.7A9 9 0 0 1 13 21.5Z" fill="url(#miH) #75c6ed"/><rect x="6" y="20" width="48" height="36" rx="6" fill="url(#miM) #2389b8"/><path d="M10 20l26-11 4 11" fill="url(#miL) #b8ddf5"/><path d="M60 31H44a6 6 0 0 0 0 12h16Z" fill="url(#miD) #064b79"/><circle cx="45" cy="37" r="2.4" fill="#f5fbff" stroke="none"/></g></svg>`,
  certGenApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="56" height="38" rx="4" fill="url(#miP) #e2f2fc"/><rect x="8.5" y="14.5" width="47" height="29" rx="2" fill="none" stroke="#75c6ed" stroke-width="1.4"/><path d="M20 22h24" stroke="#2389b8" stroke-width="3"/><path d="M15 30h22M15 36h16" stroke="#75c6ed" stroke-width="2.2"/><path d="M42 42l-3 14 6-3 6 3-3-14" fill="url(#miC) #e2694f"/><circle cx="48" cy="38" r="8" fill="url(#miA) #f0b23e"/><path d="M48 34L49.11 36.48L51.8 36.76L49.79 38.58L50.35 41.24L48 39.88L45.65 41.24L46.21 38.58L44.2 36.76L46.89 36.48Z" fill="#f5fbff" stroke="none"/></g></svg>`,
  brochureApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14l18-6v46l-18 6Z" fill="url(#miL) #b8ddf5"/><path d="M23 8l18 6v46l-18-6Z" fill="url(#miP) #e2f2fc"/><path d="M41 14l18-6v46l-18 6Z" fill="url(#miL) #b8ddf5"/><rect x="27" y="20" width="10" height="8" rx="1.5" fill="url(#miM) #2389b8" stroke="none"/><path d="M27 34h10M27 39h10M27 44h7" stroke="#75c6ed" stroke-width="2"/><path d="M9 22l10-3.4M9 28l10-3.4M45 22l10-3.4M45 28l10-3.4" stroke="#2389b8" stroke-width="2"/><circle cx="50" cy="41" r="4.5" fill="url(#miA) #f0b23e" stroke="none"/></g></svg>`,
  encouragementApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10l38-4a4 4 0 0 1 4.4 3.6l3.6 38a4 4 0 0 1-3.6 4.4l-38 4a4 4 0 0 1-4.4-3.6L8.4 14.4A4 4 0 0 1 12 10Z" fill="url(#miP) #e2f2fc"/><path d="M32.5 16L36.14 23.98L44.86 24.98L38.4 30.92L40.14 39.52L32.5 35.2L24.86 39.52L26.6 30.92L20.14 24.98L28.86 23.98Z" fill="url(#miA) #f0b23e"/><path d="M22 47l20-2" stroke="#75c6ed" stroke-width="2.4"/><path d="M52 5.5Q53.26 8.74 56.5 10Q53.26 11.26 52 14.5Q50.74 11.26 47.5 10Q50.74 8.74 52 5.5Z" fill="url(#miA) #f0b23e" stroke="none"/><path d="M10 48.8Q10.9 51.1 13.2 52Q10.9 52.9 10 55.2Q9.1 52.9 6.8 52Q9.1 51.1 10 48.8Z" fill="url(#miH) #75c6ed" stroke="none"/></g></svg>`,
  coverPageApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="4" width="42" height="56" rx="4" fill="url(#miP) #e2f2fc"/><rect x="15.5" y="8.5" width="33" height="47" rx="2" fill="none" stroke="#75c6ed" stroke-width="1.4"/><circle cx="32" cy="22" r="6.5" fill="url(#miL) #b8ddf5"/><path d="M32 18.5L32.97 20.67L35.33 20.92L33.56 22.51L34.06 24.83L32 23.64L29.94 24.83L30.44 22.51L28.67 20.92L31.03 20.67Z" fill="url(#miM) #2389b8" stroke="none"/><rect x="19" y="33" width="26" height="6" rx="2" fill="url(#miM) #2389b8" stroke="none"/><path d="M23 45h18M26 50h12" stroke="#75c6ed" stroke-width="2.2"/></g></svg>`,
  leaveCalcApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="44" height="42" rx="4" fill="url(#miP) #e2f2fc"/><path d="M4 23V16Q4 12 8 12H44Q48 12 48 16V23Z" fill="url(#miM) #2389b8"/><rect x="14.72" y="8.5" width="3.2" height="8" rx="1.6" fill="url(#miD) #064b79"/><rect x="34.08" y="8.5" width="3.2" height="8" rx="1.6" fill="url(#miD) #064b79"/><path d="M11 31h2.2M18 31h2.2M25 31h2.2M32 31h2.2M39 31h2.2M11 38h2.2M18 38h2.2M25 38h2.2M32 38h2.2M39 38h2.2M11 45h2.2M18 45h2.2M25 45h2.2M32 45h2.2M39 45h2.2" stroke="#75c6ed" stroke-width="2.4"/><rect x="31.5" y="35.5" width="9" height="9" rx="2" fill="url(#miC) #e2694f" stroke="none"/><circle cx="51" cy="15" r="6.5" fill="url(#miA) #f0b23e"/><path d="M60.5 15L63 15M57.72 21.72L59.49 23.49M51 24.5L51 27M44.28 21.72L42.51 23.49M41.5 15L39 15M44.28 8.28L42.51 6.51M51 5.5L51 3M57.72 8.28L59.49 6.51" stroke="#f0b23e" stroke-width="2"/></g></svg>`,
  maintKpiApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 42a26 26 0 0 1 52 0v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" fill="url(#miP) #e2f2fc"/><path d="M12 42a20 20 0 0 1 6-14.1" fill="none" stroke="#2f9e6e" stroke-width="5" stroke-linecap="butt"/><path d="M20.3 26a20 20 0 0 1 23.4 0" fill="none" stroke="#f0b23e" stroke-width="5" stroke-linecap="butt"/><path d="M46 27.9A20 20 0 0 1 52 42" fill="none" stroke="#e2694f" stroke-width="5" stroke-linecap="butt"/><path d="M32 42l10-12" stroke="#064b79" stroke-width="3"/><circle cx="32" cy="42" r="4" fill="url(#miD) #064b79"/><circle cx="32" cy="42" r="1.4" fill="#f5fbff" stroke="none"/><circle cx="50" cy="52" r="9" fill="url(#miM) #2389b8"/><path d="M54.29 52L55.77 52.55L55.54 53.71L53.97 53.64L53.03 55.03L53.03 55.03L53.7 56.47L52.71 57.13L51.64 55.97L50 56.29L50 56.29L49.45 57.77L48.29 57.54L48.36 55.97L46.97 55.03L46.97 55.03L45.53 55.7L44.87 54.71L46.03 53.64L45.71 52L45.71 52L44.23 51.45L44.46 50.29L46.03 50.36L46.97 48.97L46.97 48.97L46.3 47.53L47.29 46.87L48.36 48.03L50 47.71L50 47.71L50.55 46.23L51.71 46.46L51.64 48.03L53.03 48.97L53.03 48.97L54.47 48.3L55.13 49.29L53.97 50.36L54.29 52Z M52.09 52a2.09 2.09 0 1 0 -4.18 0a2.09 2.09 0 1 0 4.18 0Z" fill="#f5fbff" fill-rule="evenodd" stroke="none"/></g></svg>`,
  adminReqApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H37L46 13V57Q46 60 43 60H9Q6 60 6 57V7Q6 4 9 4Z" fill="url(#miP) #e2f2fc"/><path d="M37 4V11Q37 13 39 13H46" fill="url(#miL) #b8ddf5"/><rect x="11" y="10" width="12" height="3.4" rx="1.7" fill="url(#miM) #2389b8" stroke="none"/><path d="M36 11.5h5" stroke="#75c6ed" stroke-width="2"/><path d="M11 19h30" stroke="#b8ddf5" stroke-width="1.6"/><path d="M11 25h29M11 30.6h29M11 36.2h29M11 41.8h17.4" stroke="#75c6ed" stroke-width="2.4"/><circle cx="19" cy="50" r="7.5" fill="none" stroke="#e2694f" stroke-width="2"/><circle cx="19" cy="50" r="4.6" fill="none" stroke="#e2694f" stroke-width="1.2"/><path d="M19 47.4L19.72 49.01L21.47 49.2L20.16 50.38L20.53 52.1L19 51.22L17.47 52.1L17.84 50.38L16.53 49.2L18.28 49.01Z" fill="url(#miC) #e2694f" stroke="none"/><path d="M31 52c2.4-3.4 4-3.4 5 0s2.6 2.6 5-1" fill="none" stroke="#2389b8" stroke-width="1.8"/><path d="M59.6 20.6l-4.2-4.2a2 2 0 0 0-2.8 0L35 34l-2.4 9.2L41.8 41l17.8-17.6a2 2 0 0 0 0-2.8Z" fill="url(#miM) #2389b8"/><path d="M35 34l-2.4 9.2L41.8 41Z" fill="url(#miA) #f0b23e"/><path d="M50 18.8l7.2 7.2" stroke="#07547f" stroke-width="1.6"/></g></svg>`,
  salaryApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="42" height="26" rx="4" fill="#cfe9d9"/><rect x="8" y="16" width="34" height="18" rx="2.5" fill="none" stroke="#f5fbff" stroke-width="1.6"/><circle cx="25" cy="25" r="6.5" fill="url(#miG) #2f9e6e"/><path d="M26.95 23.05C26.5 22.07 22.6 22 22.6 23.8C22.6 25.3 27.4 24.85 27.4 26.43C27.4 28.23 23.5 28.15 22.9 27.02M25 20.8V29.2" stroke="#f5fbff" stroke-width="1.7"/><path d="M38 39v14c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5V39" fill="url(#miA) #f0b23e"/><path d="M38 44c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5M38 49c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5" fill="none"/><path d="M38 39c0-2 4.5-3.5 10-3.5S58 37 58 39s-4.5 3.5-10 3.5S38 41 38 39Z" fill="#f7cc72"/><rect x="6" y="44" width="22" height="14" rx="3" fill="url(#miP) #e2f2fc"/><path d="M6 49v-2a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v2Z" fill="url(#miM) #2389b8"/><path d="M11 53.5h12" stroke="#75c6ed" stroke-width="2"/></g></svg>`,
  dateDiffApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="52" height="44" rx="4" fill="url(#miP) #e2f2fc"/><path d="M6 21V14Q6 10 10 10H54Q58 10 58 14V21Z" fill="url(#miM) #2389b8"/><rect x="18.96" y="6.5" width="3.2" height="8" rx="1.6" fill="url(#miD) #064b79"/><rect x="41.84" y="6.5" width="3.2" height="8" rx="1.6" fill="url(#miD) #064b79"/><path d="M13 28h2.2M20.6 28h2.2M28.2 28h2.2M35.8 28h2.2M43.4 28h2.2M51 28h2.2M13 35h2.2M20.6 35h2.2M28.2 35h2.2M35.8 35h2.2M43.4 35h2.2M51 35h2.2M13 42h2.2M20.6 42h2.2M28.2 42h2.2M35.8 42h2.2M43.4 42h2.2M51 42h2.2" stroke="#75c6ed" stroke-width="2.4"/><rect x="12" y="32" width="40" height="7" rx="3.5" fill="url(#miL) #b8ddf5" stroke="none"/><circle cx="15.5" cy="35.5" r="4.6" fill="url(#miM) #2389b8" stroke="none"/><circle cx="48.5" cy="35.5" r="4.6" fill="url(#miC) #e2694f" stroke="none"/><path d="M22 47h20m-4-3.5 4 3.5-4 3.5M26 43.5L22 47l4 3.5" stroke="#064b79" stroke-width="2"/></g></svg>`,
  receiptApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l4 3 4-3 4 3 4-3 4 3 4-3 4 3 4-3v53l-4-3-4 3-4-3-4 3-4-3-4 3-4-3-4 3Z" fill="url(#miP) #e2f2fc"/><rect x="17" y="11" width="14" height="5" rx="1.8" fill="url(#miM) #2389b8" stroke="none"/><path d="M17 22h14M17 28h18M17 34h11" stroke="#75c6ed" stroke-width="2.2"/><path d="M38 22h4M38 28h4" stroke="#2389b8" stroke-width="2.2"/><path d="M17 41h25" stroke="#b8ddf5" stroke-width="1.5"/><rect x="17" y="44" width="13" height="5" rx="1.8" fill="url(#miD) #064b79" stroke="none"/><circle cx="47" cy="47" r="11" fill="url(#miG) #2f9e6e"/><path d="M42.6 47.3l3.08 3.08l5.72-6.16" stroke="#f5fbff" stroke-width="2.6"/></g></svg>`,
  unitConvApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="41" width="54" height="15" rx="3" fill="url(#miL) #b8ddf5"/><path d="M12 41v6M19 41v4M26 41v6M33 41v4M40 41v6M47 41v4M54 41v6" stroke="#07547f" stroke-width="1.6"/><path d="M14 14h32m-5-5 5 5-5 5" stroke="#2389b8" stroke-width="3"/><path d="M50 28H18m5-5-5 5 5 5" stroke="#f0b23e" stroke-width="3"/><circle cx="54" cy="14" r="3.2" fill="url(#miD) #064b79" stroke="none"/><circle cx="10" cy="28" r="3.2" fill="url(#miD) #064b79" stroke="none"/></g></svg>`,
  sciCalcApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="4" width="40" height="56" rx="7" fill="url(#miM) #2389b8"/><rect x="17" y="9" width="30" height="12" rx="2.5" fill="url(#miP) #e2f2fc"/><path d="M35 15h7" stroke="#064b79" stroke-width="2.2"/><path d="M18.0 26.0h5.2v5.2h-5.2ZM25.6 26.0h5.2v5.2h-5.2ZM33.2 26.0h5.2v5.2h-5.2ZM40.8 26.0h5.2v5.2h-5.2ZM18.0 33.6h5.2v5.2h-5.2ZM25.6 33.6h5.2v5.2h-5.2ZM33.2 33.6h5.2v5.2h-5.2ZM40.8 33.6h5.2v5.2h-5.2ZM18.0 41.2h5.2v5.2h-5.2ZM25.6 41.2h5.2v5.2h-5.2ZM33.2 41.2h5.2v5.2h-5.2ZM40.8 41.2h5.2v5.2h-5.2ZM18.0 48.8h5.2v5.2h-5.2ZM25.6 48.8h5.2v5.2h-5.2ZM33.2 48.8h5.2v5.2h-5.2Z" fill="#f5fbff" stroke="none"/><rect x="40.8" y="48.8" width="5.2" height="5.2" rx="1.2" fill="url(#miA) #f0b23e" stroke="none"/><path d="M19.3 28.6h2.6M20.6 27.3v2.6" stroke="#2389b8" stroke-width="1.4"/></g></svg>`,
  qrApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V8a4 4 0 0 1 4-4h7M49 4h7a4 4 0 0 1 4 4v7M60 49v7a4 4 0 0 1-4 4h-7M15 60H8a4 4 0 0 1-4-4v-7" stroke="#2389b8" stroke-width="3"/><rect x="11" y="11" width="42" height="42" rx="5" fill="url(#miP) #e2f2fc"/><rect x="15" y="15" width="13" height="13" rx="2.5" fill="url(#miD) #064b79" stroke="none"/><rect x="17.6" y="17.6" width="7.8" height="7.8" rx="1.4" fill="#f5fbff" stroke="none"/><rect x="19.4" y="19.4" width="4.2" height="4.2" rx="0.8" fill="url(#miD) #064b79" stroke="none"/><rect x="36" y="15" width="13" height="13" rx="2.5" fill="url(#miD) #064b79" stroke="none"/><rect x="38.6" y="17.6" width="7.8" height="7.8" rx="1.4" fill="#f5fbff" stroke="none"/><rect x="40.4" y="19.4" width="4.2" height="4.2" rx="0.8" fill="url(#miD) #064b79" stroke="none"/><rect x="15" y="36" width="13" height="13" rx="2.5" fill="url(#miD) #064b79" stroke="none"/><rect x="17.6" y="38.6" width="7.8" height="7.8" rx="1.4" fill="#f5fbff" stroke="none"/><rect x="19.4" y="40.4" width="4.2" height="4.2" rx="0.8" fill="url(#miD) #064b79" stroke="none"/><path d="M36 36h4v4h-4ZM44 36h5v4h-5ZM40 40h4v5h-4ZM36 45h4v4h-4ZM44 44h5v5h-5Z" fill="url(#miM) #2389b8" stroke="none"/><path d="M7 32h50" stroke="#f0b23e" stroke-width="2.6"/></g></svg>`,
  supplierApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="16" width="34" height="28" rx="3" fill="url(#miM) #2389b8"/><path d="M21 16v6" stroke="#f5fbff" stroke-width="2.2"/><path d="M26.18 32L27.97 32.66L27.69 34.06L25.79 33.98L24.66 35.66L24.66 35.66L25.46 37.39L24.28 38.19L22.98 36.79L21 37.18L21 37.18L20.34 38.97L18.94 38.69L19.02 36.79L17.34 35.66L17.34 35.66L15.61 36.46L14.81 35.28L16.21 33.98L15.82 32L15.82 32L14.03 31.34L14.31 29.94L16.21 30.02L17.34 28.34L17.34 28.34L16.54 26.61L17.72 25.81L19.02 27.21L21 26.82L21 26.82L21.66 25.03L23.06 25.31L22.98 27.21L24.66 28.34L24.66 28.34L26.39 27.54L27.19 28.72L25.79 30.02L26.18 32Z M23.52 32a2.52 2.52 0 1 0 -5.04 0a2.52 2.52 0 1 0 5.04 0Z" fill="#f5fbff" fill-rule="evenodd" stroke="none"/><path d="M38 24h11l8 10v10H38Z" fill="url(#miL) #b8ddf5"/><path d="M41 27h7l5 7H41Z" fill="#f5fbff"/><path d="M4 44h53" stroke="#07547f" stroke-width="1.6"/><circle cx="15" cy="47" r="6" fill="url(#miD) #064b79"/><circle cx="15" cy="47" r="2.2" fill="#f5fbff" stroke="none"/><circle cx="47" cy="47" r="6" fill="url(#miD) #064b79"/><circle cx="47" cy="47" r="2.2" fill="#f5fbff" stroke="none"/></g></svg>`,
  teacherNoteApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="40" height="50" rx="5" fill="url(#miL) #b8ddf5"/><rect x="12" y="13" width="32" height="41" rx="2" fill="#f5fbff"/><rect x="19" y="4" width="18" height="9" rx="3" fill="url(#miD) #064b79"/><path d="M16 19h14" stroke="#064b79" stroke-width="2.6"/><rect x="16" y="24.4" width="5.2" height="5.2" rx="1.2" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M25 27h13" stroke="#75c6ed" stroke-width="2.4"/><rect x="16" y="33.4" width="5.2" height="5.2" rx="1.2" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M25 36h13" stroke="#75c6ed" stroke-width="2.4"/><rect x="16" y="42.4" width="5.2" height="5.2" rx="1.2" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M25 45h13" stroke="#75c6ed" stroke-width="2.4"/><path d="M16.12 26.6l1.74 1.74l3.22-3.47" stroke="#2f9e6e" stroke-width="2.2"/><path d="M16.12 35.6l1.74 1.74l3.22-3.47" stroke="#2f9e6e" stroke-width="2.2"/><path d="M57 30l-4-4-14.5 14.5-1.8 5.8 5.8-1.8Z" fill="url(#miA) #f0b23e"/><path d="M53 26l4 4 2-2a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0Z" fill="url(#miC) #e2694f"/></g></svg>`,
  idCardApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-8 34 30)"><rect x="10" y="8" width="50" height="34" rx="5" fill="url(#miL) #b8ddf5"/><rect x="10" y="8" width="50" height="7" rx="3" fill="url(#miH) #75c6ed" stroke="none"/></g><rect x="4" y="20" width="52" height="36" rx="5" fill="url(#miP) #e2f2fc"/><path d="M4 30v-5a5 5 0 0 1 5-5h42a5 5 0 0 1 5 5v5Z" fill="url(#miM) #2389b8"/><rect x="9" y="34" width="15" height="17" rx="2.5" fill="url(#miL) #b8ddf5"/><circle cx="16.5" cy="38.55" r="2.55" fill="url(#miM) #2389b8"/><path d="M11.86 47.25V44.93Q11.86 42.03 14.76 42.03H18.24Q21.14 42.03 21.14 44.93V47.25Z" fill="url(#miM) #2389b8"/><path d="M29 37h20" stroke="#064b79" stroke-width="2.6"/><path d="M29 43h16M29 48.5h11" stroke="#75c6ed" stroke-width="2.2"/><rect x="24" y="23.5" width="12" height="3" rx="1.5" fill="#f5fbff" stroke="none"/></g></svg>`,
  reportApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4H45L54 13V57Q54 60 51 60H13Q10 60 10 57V7Q10 4 13 4Z" fill="url(#miP) #e2f2fc"/><path d="M45 4V11Q45 13 47 13H54" fill="url(#miL) #b8ddf5"/><path d="M16 12h18" stroke="#064b79" stroke-width="2.8"/><path d="M24 32v-10a10 10 0 1 0 10 10Z" fill="url(#miH) #75c6ed"/><path d="M27 19a10 10 0 0 1 10 10H27Z" fill="url(#miA) #f0b23e"/><rect x="41" y="25" width="4" height="9" rx="1" fill="url(#miM) #2389b8" stroke="none"/><rect x="46" y="19" width="4" height="15" rx="1" fill="url(#miD) #064b79" stroke="none"/><path d="M16 42h30M16 47.5h30M16 53h18" stroke="#75c6ed" stroke-width="2.4"/></g></svg>`,
  hoursApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="30" cy="34" r="24" fill="url(#miP) #e2f2fc"/><circle cx="30" cy="34" r="19" fill="#f5fbff" stroke="none"/><path d="M46 34L49 34M43.86 42L46.45 43.5M38 47.86L39.5 50.45M30 50L30 53M22 47.86L20.5 50.45M16.14 42L13.55 43.5M14 34L11 34M16.14 26L13.55 24.5M22 20.14L20.5 17.55M30 18L30 15M38 20.14L39.5 17.55M43.86 26L46.45 24.5" stroke="#75c6ed" stroke-width="2"/><path d="M30 34V15a19 19 0 0 1 16.5 28.5Z" fill="#d9eefb" stroke="none"/><path d="M30 34V20M30 34l9 6" stroke="#064b79" stroke-width="3"/><circle cx="30" cy="34" r="2.6" fill="url(#miM) #2389b8" stroke="none"/><rect x="26" y="5" width="8" height="5" rx="1.5" fill="url(#miM) #2389b8"/><circle cx="51" cy="50" r="9" fill="url(#miA) #f0b23e"/><path d="M51 46v8M47 50h8" stroke="#f5fbff" stroke-width="2.4"/></g></svg>`,
  ageApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="24" width="36" height="12" rx="3" fill="url(#miP) #e2f2fc"/><rect x="8" y="34" width="48" height="20" rx="4" fill="url(#miL) #b8ddf5"/><path d="M8 41c4 3 8 3 12 0s8-3 12 0 8 3 12 0 8-3 12 0" fill="none" stroke="#2389b8" stroke-width="2.4"/><rect x="30" y="13" width="4" height="11" rx="1.2" fill="url(#miM) #2389b8"/><path d="M32 4c3 3.5 3 6.5 0 8-3-1.5-3-4.5 0-8Z" fill="url(#miA) #f0b23e"/><path d="M4 56h56" stroke="#07547f" stroke-width="1.6"/></g></svg>`,
  hijriApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="12" width="44" height="40" rx="4" fill="url(#miP) #e2f2fc"/><path d="M6 23V16Q6 12 10 12H46Q50 12 50 16V23Z" fill="url(#miM) #2389b8"/><rect x="16.72" y="8.5" width="3.2" height="8" rx="1.6" fill="url(#miD) #064b79"/><rect x="36.08" y="8.5" width="3.2" height="8" rx="1.6" fill="url(#miD) #064b79"/><path d="M13 30h2.2M20 30h2.2M27 30h2.2M34 30h2.2M41 30h2.2M13 37h2.2M20 37h2.2M27 37h2.2M34 37h2.2M41 37h2.2M13 44h2.2M20 44h2.2M27 44h2.2M34 44h2.2M41 44h2.2" stroke="#75c6ed" stroke-width="2.4"/><circle cx="49" cy="45" r="11.5" fill="#f5fbff" stroke="none"/><path d="M55 38a10 10 0 1 0 0 14 8 8 0 1 1 0-14Z" fill="url(#miA) #f0b23e"/><path d="M56 37.6L56.66 39.09L58.28 39.26L57.07 40.35L57.41 41.94L56 41.13L54.59 41.94L54.93 40.35L53.72 39.26L55.34 39.09Z" fill="url(#miA) #f0b23e" stroke="none"/></g></svg>`,
  gradeApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="22" width="48" height="36" rx="5" fill="url(#miP) #e2f2fc"/><rect x="15" y="42" width="6" height="10" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="24" y="37" width="6" height="15" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="33" y="32" width="6" height="20" rx="1.2" fill="url(#miM) #2389b8" stroke="none"/><path d="M13 38h33" stroke="#f0b23e" stroke-width="1.6" stroke-dasharray="3 3"/><path d="M30 3L6 12.5l24 9.5 24-9.5Z" fill="url(#miD) #064b79"/><path d="M17 17v6c0 3 6 5 13 5s13-2 13-5v-6l-13 5Z" fill="url(#miM) #2389b8"/><path d="M50 14v9" stroke="#f0b23e" stroke-width="2"/><circle cx="50" cy="24.5" r="2.2" fill="url(#miA) #f0b23e" stroke="none"/><circle cx="47.5" cy="44" r="6.5" fill="url(#miG) #2f9e6e"/><path d="M44.5 44l2.2 2.2 4-4.4" stroke="#f5fbff" stroke-width="2"/></g></svg>`,
  scheduleApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="54" height="48" rx="6" fill="url(#miP) #e2f2fc"/><path d="M5 19v-5a6 6 0 0 1 6-6h42a6 6 0 0 1 6 6v5Z" fill="url(#miM) #2389b8"/><path d="M19 19v37M33 19v37M47 19v37" stroke="#b8ddf5" stroke-width="1.5"/><rect x="9" y="24" width="22" height="6" rx="3" fill="url(#miM) #2389b8" stroke="none"/><rect x="23" y="34" width="26" height="6" rx="3" fill="url(#miA) #f0b23e" stroke="none"/><rect x="37" y="44" width="18" height="6" rx="3" fill="url(#miG) #2f9e6e" stroke="none"/><path d="M11 13.5h5M24 13.5h5M38 13.5h5M51 13.5h3" stroke="#f5fbff" stroke-width="2"/></g></svg>`,
  textCleanApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6H31L40 15V51Q40 54 37 54H9Q6 54 6 51V9Q6 6 9 6Z" fill="url(#miP) #e2f2fc"/><path d="M31 6V13Q31 15 33 15H40" fill="url(#miL) #b8ddf5"/><path d="M12 19h22M12 25h22M12 31h22M12 37h22" stroke="#75c6ed" stroke-width="2.4"/><path d="M12 43h8" stroke="#b8ddf5" stroke-width="2.4"/><path d="M38.5 50.5L32 44a2.8 2.8 0 0 1 0-4l15-15a2.8 2.8 0 0 1 4 0l6.5 6.5a2.8 2.8 0 0 1 0 4L45 48.2" fill="url(#miC) #e2694f"/><path d="M38.5 50.5L32 44a2.8 2.8 0 0 1 0-4l6.5-6.5 11 11-5 5Z" fill="#f5fbff"/><path d="M38.5 50.5H56" stroke="#07547f" stroke-width="1.6"/><path d="M55 7.5Q56.26 10.74 59.5 12Q56.26 13.26 55 16.5Q53.74 13.26 50.5 12Q53.74 10.74 55 7.5Z" fill="url(#miA) #f0b23e" stroke="none"/><path d="M47 3.9Q47.73 5.77 49.6 6.5Q47.73 7.23 47 9.1Q46.27 7.23 44.4 6.5Q46.27 5.77 47 3.9Z" fill="url(#miH) #75c6ed" stroke="none"/></g></svg>`,
  summarizeApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6H31L40 15V51Q40 54 37 54H9Q6 54 6 51V9Q6 6 9 6Z" fill="url(#miP) #e2f2fc"/><path d="M31 6V13Q31 15 33 15H40" fill="url(#miL) #b8ddf5"/><path d="M12 18h22M12 23.5h22M12 29h22M12 34.5h22M12 40h22M12 45.5h22" stroke="#b8ddf5" stroke-width="2.4"/><path d="M12 23.5h22M12 34.5h16" stroke="#f0b23e" stroke-width="3.2"/><circle cx="46" cy="44" r="12" fill="url(#miM) #2389b8"/><path d="M46 36.5Q48.1 41.9 53.5 44Q48.1 46.1 46 51.5Q43.9 46.1 38.5 44Q43.9 41.9 46 36.5Z" fill="#f5fbff" stroke="none"/></g></svg>`,
  mailAssistApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 26l6-5h36l6 5v26a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="url(#miD) #064b79"/><rect x="13" y="6" width="30" height="30" rx="3" fill="#f5fbff"/><path d="M18 13h14M18 19h20M18 25h16" stroke="#75c6ed" stroke-width="2.2"/><path d="M4 27l24 16 24-16v25a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="url(#miM) #2389b8"/><path d="M6.5 54l15-14M49.5 54l-15-14" stroke="#75c6ed" stroke-width="1.6"/><path d="M50 7Q51.68 11.32 56 13Q51.68 14.68 50 19Q48.32 14.68 44 13Q48.32 11.32 50 7Z" fill="url(#miA) #f0b23e" stroke="none"/><path d="M57.5 19Q58.34 21.16 60.5 22Q58.34 22.84 57.5 25Q56.66 22.84 54.5 22Q56.66 21.16 57.5 19Z" fill="url(#miH) #75c6ed" stroke="none"/><path d="M58 33.5l3 3-16.5 16.5-4.3 1.3 1.3-4.3Z" fill="url(#miA) #f0b23e"/><path d="M58 33.5l3 3" fill="none"/><path d="M55.5 36l3 3" stroke="#07547f" stroke-width="1.2"/></g></svg>`,
  excelCourseApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M25 7H45L54 16V50Q54 53 51 53H25Q22 53 22 50V10Q22 7 25 7Z" fill="url(#miP) #e2f2fc"/><path d="M45 7V14Q45 16 47 16H54" fill="url(#miL) #b8ddf5"/><path d="M24 22h28M24 31h28M24 40h28M38 15v34" stroke="#75c6ed" stroke-width="1.8"/><rect x="6" y="18" width="24" height="24" rx="4.8" fill="url(#miG) #2f9e6e"/><path d="M13.7 25.05l8.6 9.89M22.3 25.05l-8.6 9.89" stroke="#f5fbff" stroke-width="2.8"/><circle cx="48" cy="48" r="10" fill="url(#miM) #2389b8"/><path d="M45.5 43.5v9l7.5-4.5Z" fill="#f5fbff" stroke="none"/></g></svg>`,
  pythonApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="54" height="44" rx="4" fill="url(#miP) #e2f2fc"/><path d="M5 18V14Q5 10 9 10H55Q59 10 59 14V18Z" fill="url(#miD) #064b79"/><circle cx="10" cy="14" r="1.3" fill="#f5fbff" stroke="none"/><circle cx="14.5" cy="14" r="1.3" fill="#f5fbff" stroke="none"/><path d="M17 27l-6 6 6 6M41 27l6 6-6 6" stroke="#2389b8" stroke-width="2.8"/><path d="M32 24l-6 18" stroke="#064b79" stroke-width="2.8"/><rect x="40" y="38" width="12" height="12" rx="3.5" fill="url(#miM) #2389b8"/><rect x="46" y="44" width="12" height="12" rx="3.5" fill="url(#miA) #f0b23e"/><circle cx="44" cy="42" r="1.3" fill="#f5fbff" stroke="none"/><circle cx="54" cy="52" r="1.3" fill="#f5fbff" stroke="none"/></g></svg>`,
  pptApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M27 7H47L56 16V54Q56 57 53 57H27Q24 57 24 54V10Q24 7 27 7Z" fill="url(#miP) #e2f2fc"/><path d="M47 7V14Q47 16 49 16H56" fill="url(#miL) #b8ddf5"/><rect x="36" y="17" width="14" height="11" rx="1.5" fill="url(#miL) #b8ddf5"/><path d="M43 40v-7a7 7 0 1 1-7 7Z" fill="url(#miH) #75c6ed" stroke="none"/><path d="M45 31.5a7 7 0 0 1 7 7h-7Z" fill="url(#miC) #e2694f" stroke="none"/><rect x="8" y="20" width="25" height="25" rx="5" fill="url(#miC) #e2694f"/><path d="M17.5 37.5V27.5h4a3.2 3.2 0 0 1 0 6.4h-4" stroke="#f5fbff" stroke-width="2.8"/></g></svg>`,
  spssApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="54" height="44" rx="4" fill="url(#miP) #e2f2fc"/><path d="M5 17V13Q5 9 9 9H55Q59 9 59 13V17Z" fill="url(#miD) #064b79"/><circle cx="10" cy="13" r="1.3" fill="#f5fbff" stroke="none"/><circle cx="14.5" cy="13" r="1.3" fill="#f5fbff" stroke="none"/><rect x="13" y="35" width="5.2" height="12" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="20" y="27" width="5.2" height="20" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="27" y="19" width="5.2" height="28" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="34" y="23" width="5.2" height="24" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="41" y="32" width="5.2" height="15" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><rect x="48" y="39" width="5.2" height="8" rx="1.2" fill="url(#miH) #75c6ed" stroke="none"/><path d="M11 46C20 46 22 22 31 22S42 46 53 46" fill="none" stroke="#064b79" stroke-width="2.2"/><path d="M10 47.5h45" stroke="#07547f" stroke-width="1.6"/></g></svg>`,
  powerbiApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="52" height="48" rx="6" fill="url(#miP) #e2f2fc"/><rect x="15" y="32" width="9" height="16" rx="2.5" fill="#f6cf7a"/><rect x="27.5" y="23" width="9" height="25" rx="2.5" fill="url(#miA) #f0b23e"/><rect x="40" y="14" width="9" height="34" rx="2.5" fill="#d8941f"/><path d="M12 48h40" stroke="#07547f" stroke-width="1.6"/></g></svg>`,
  refManagerApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="6" width="34" height="44" rx="3" fill="url(#miL) #b8ddf5"/><path d="M19 12H43L52 21V55Q52 58 49 58H19Q16 58 16 55V15Q16 12 19 12Z" fill="url(#miP) #e2f2fc"/><path d="M43 12V19Q43 21 45 21H52" fill="url(#miL) #b8ddf5"/><path d="M22 22h16" stroke="#75c6ed" stroke-width="2.4"/><g transform="rotate(180 32 34.5)"><path d="M22 31.5a4.5 4.5 0 1 1 9 0c0 4.5-3 7.5-7 8.5l-.8-2.2c2-.8 3-2 3.3-3.6A4.5 4.5 0 0 1 22 31.5Z" fill="url(#miM) #2389b8" stroke="none"/><path d="M33 31.5a4.5 4.5 0 1 1 9 0c0 4.5-3 7.5-7 8.5l-.8-2.2c2-.8 3-2 3.3-3.6A4.5 4.5 0 0 1 33 31.5Z" fill="url(#miM) #2389b8" stroke="none"/></g><path d="M22 47h22M22 52.5h13.2" stroke="#75c6ed" stroke-width="2.4"/><path d="M42 4h9v18l-4.5-3.5L42 22Z" fill="url(#miA) #f0b23e"/></g></svg>`,
  pdfToImgApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5H34L43 14V48Q43 51 40 51H12Q9 51 9 48V8Q9 5 12 5Z" fill="url(#miP) #e2f2fc"/><path d="M34 5V12Q34 14 36 14H43" fill="url(#miL) #b8ddf5"/><rect x="6" y="26" width="26.52" height="10" rx="2.5" fill="url(#miC) #e2694f"/><path d="M9.5 33.5V28.5h2.2a1.6 1.6 0 0 1 0 3.2H9.5M15.5 33.5V28.5h1.4a2.5 2.5 0 0 1 0 5ZM23.1 28.5h-2.8v5M20.3 30.9h2.2" stroke="#f5fbff" stroke-width="1.5"/><path d="M15 40h22M15 45h22" stroke="#75c6ed" stroke-width="2.4"/><rect x="34" y="30" width="26" height="26" rx="4" fill="url(#miL) #b8ddf5"/><path d="M38 51l7-9 5 6 3-3.5 4 6.5Z" fill="url(#miM) #2389b8"/><circle cx="53" cy="37" r="2.8" fill="url(#miA) #f0b23e" stroke="none"/><path d="M17.81 54L19.47 54.61L19.21 55.91L17.44 55.84L16.4 57.4L16.4 57.4L17.14 59.01L16.04 59.74L14.84 58.44L13 58.81L13 58.81L12.39 60.47L11.09 60.21L11.16 58.44L9.6 57.4L9.6 57.4L7.99 58.14L7.26 57.04L8.56 55.84L8.19 54L8.19 54L6.53 53.39L6.79 52.09L8.56 52.16L9.6 50.6L9.6 50.6L8.86 48.99L9.96 48.26L11.16 49.56L13 49.19L13 49.19L13.61 47.53L14.91 47.79L14.84 49.56L16.4 50.6L16.4 50.6L18.01 49.86L18.74 50.96L17.44 52.16L17.81 54Z M15.34 54a2.34 2.34 0 1 0 -4.68 0a2.34 2.34 0 1 0 4.68 0Z" fill="url(#miD) #064b79" fill-rule="evenodd" stroke="none"/></g></svg>`,
  excelToPdfApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="22" height="22" rx="4.4" fill="url(#miG) #2f9e6e"/><path d="M10.7 14.05l8.6 9.89M19.3 14.05l-8.6 9.89" stroke="#f5fbff" stroke-width="2.8"/><path d="M9 41h14m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="#f0b23e" stroke-width="2.8"/><path d="M33 8H51L60 17V55Q60 58 57 58H33Q30 58 30 55V11Q30 8 33 8Z" fill="url(#miP) #e2f2fc"/><path d="M51 8V15Q51 17 53 17H60" fill="url(#miL) #b8ddf5"/><rect x="27" y="31" width="23.4" height="10" rx="2.5" fill="url(#miC) #e2694f"/><path d="M30.5 38.5V33.5h2.2a1.6 1.6 0 0 1 0 3.2H30.5M36.5 38.5V33.5h1.4a2.5 2.5 0 0 1 0 5ZM44.1 33.5h-2.8v5M41.3 35.9h2.2" stroke="#f5fbff" stroke-width="1.5"/><path d="M36 45h18M36 50h18" stroke="#75c6ed" stroke-width="2.4"/></g></svg>`,
  wordToPdfApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="22" height="22" rx="4.4" fill="url(#miM) #2389b8"/><path d="M10.05 14.5l2.16 9l2.79-6.3l2.79 6.3l2.16-9" stroke="#f5fbff" stroke-width="2.6"/><path d="M9 41h14m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="#f0b23e" stroke-width="2.8"/><path d="M33 8H51L60 17V55Q60 58 57 58H33Q30 58 30 55V11Q30 8 33 8Z" fill="url(#miP) #e2f2fc"/><path d="M51 8V15Q51 17 53 17H60" fill="url(#miL) #b8ddf5"/><rect x="27" y="31" width="23.4" height="10" rx="2.5" fill="url(#miC) #e2694f"/><path d="M30.5 38.5V33.5h2.2a1.6 1.6 0 0 1 0 3.2H30.5M36.5 38.5V33.5h1.4a2.5 2.5 0 0 1 0 5ZM44.1 33.5h-2.8v5M41.3 35.9h2.2" stroke="#f5fbff" stroke-width="1.5"/><path d="M36 45h18M36 50h18" stroke="#75c6ed" stroke-width="2.4"/></g></svg>`,
  liveRoomApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="46" height="34" rx="5" fill="url(#miP) #e2f2fc"/><circle cx="27" cy="20.18" r="4.18" fill="url(#miM) #2389b8"/><path d="M19.4 34.43V30.63Q19.4 25.88 24.15 25.88H29.85Q34.6 25.88 34.6 30.63V34.43Z" fill="url(#miM) #2389b8"/><path d="M50 22l10-6v24l-10-6Z" fill="url(#miD) #064b79"/><rect x="8" y="14" width="15" height="7" rx="3.5" fill="url(#miC) #e2694f" stroke="none"/><circle cx="12" cy="17.5" r="1.6" fill="#f5fbff" stroke="none"/><path d="M15.5 17.5h4.5" stroke="#f5fbff" stroke-width="1.6"/><path d="M18 54h18M27 44v10" stroke="#07547f" stroke-width="1.6"/></g></svg>`,
  keyboardApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="17" width="56" height="32" rx="6" fill="url(#miL) #b8ddf5"/><path d="M9 22h3.4v3.4h-3.4ZM16 22h3.4v3.4h-3.4ZM23 22h3.4v3.4h-3.4ZM30 22h3.4v3.4h-3.4ZM37 22h3.4v3.4h-3.4ZM44 22h3.4v3.4h-3.4ZM51 22h3.4v3.4h-3.4ZM12 29h3.4v3.4h-3.4ZM19 29h3.4v3.4h-3.4ZM26 29h3.4v3.4h-3.4ZM33 29h3.4v3.4h-3.4ZM40 29h3.4v3.4h-3.4ZM47 29h3.4v3.4h-3.4Z" fill="#f5fbff" stroke="none"/><rect x="18" y="37" width="28" height="5" rx="2" fill="#f5fbff" stroke="none"/><rect x="9" y="37" width="6" height="5" rx="2" fill="url(#miM) #2389b8" stroke="none"/><rect x="49" y="37" width="6" height="5" rx="2" fill="url(#miM) #2389b8" stroke="none"/></g></svg>`,
  lessons: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="19" width="46" height="29" rx="4" fill="url(#miD) #064b79"/><rect x="13" y="23" width="38" height="21" rx="1.5" fill="url(#miP) #e2f2fc" stroke="none"/><path d="M3 50h58l-3 5a3 3 0 0 1-2.6 1.5H8.6A3 3 0 0 1 6 55Z" fill="url(#miM) #2389b8"/><circle cx="25" cy="33.5" r="6.5" fill="url(#miM) #2389b8" stroke="none"/><path d="M23 30v7l5.5-3.5Z" fill="#f5fbff" stroke="none"/><path d="M36 30h11M36 35h11M36 40h7" stroke="#75c6ed" stroke-width="2.2"/><path d="M38 3L22 9.5 38 16l16-6.5Z" fill="url(#miD) #064b79"/><path d="M30 13v4.5c0 1.8 3.6 3 8 3s8-1.2 8-3V13l-8 3Z" fill="url(#miM) #2389b8"/><path d="M51 10.5v7" stroke="#f0b23e" stroke-width="1.8"/><circle cx="51" cy="18.5" r="1.8" fill="url(#miA) #f0b23e" stroke="none"/></g></svg>`,
  apps: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="5" width="50" height="38" rx="5" fill="url(#miD) #064b79"/><rect x="14" y="9" width="42" height="30" rx="2" fill="url(#miP) #e2f2fc" stroke="none"/><path d="M31 43l-1.5 6h11l-1.5-6Z" fill="url(#miM) #2389b8"/><rect x="25" y="49" width="20" height="3.6" rx="1.8" fill="url(#miM) #2389b8"/><rect x="27" y="12" width="11" height="11" rx="2.5" fill="url(#miM) #2389b8" stroke="none"/><rect x="41" y="12" width="11" height="11" rx="2.5" fill="url(#miH) #75c6ed" stroke="none"/><rect x="27" y="26" width="11" height="10" rx="2.5" fill="url(#miH) #75c6ed" stroke="none"/><rect x="41" y="26" width="11" height="10" rx="2.5" fill="url(#miA) #f0b23e" stroke="none"/><path d="M31.5 15.2v4.6l4-2.3Z" fill="#f5fbff" stroke="none"/><rect x="4" y="20" width="20" height="38" rx="4" fill="url(#miL) #b8ddf5"/><rect x="7" y="25" width="14" height="25" rx="1.5" fill="#f5fbff" stroke="none"/><path d="M11 22.6h6" stroke="#07547f" stroke-width="1.4"/><rect x="9" y="28" width="4.4" height="4.4" rx="1" fill="url(#miM) #2389b8" stroke="none"/><rect x="14.6" y="28" width="4.4" height="4.4" rx="1" fill="url(#miA) #f0b23e" stroke="none"/><rect x="9" y="34" width="4.4" height="4.4" rx="1" fill="url(#miH) #75c6ed" stroke="none"/><rect x="14.6" y="34" width="4.4" height="4.4" rx="1" fill="url(#miM) #2389b8" stroke="none"/><circle cx="14" cy="54" r="1.4" fill="#07547f" stroke="none"/></g></svg>`,
  tools: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g transform="scale(.08205) translate(-228 -245)" stroke="none"><g stroke-linejoin="round" stroke-linecap="round"><path d="M364 553H865L948 711H270Z" fill="url(#miD) #07486f" stroke="#187cac" stroke-width="28"/><g transform="rotate(-16 468 451)"><rect x="382" y="282" width="181" height="413" rx="30" fill="url(#miL) #b8def5" stroke="#07547f" stroke-width="16"/><path d="M410 337h48m-48 41h28m-28 42h48m-48 42h28m-28 42h48m-48 42h28m-28 42h48" fill="none" stroke="#07547f" stroke-width="14"/></g><path d="M535 398h157q17 0 29 13l29 31v296H496V437q0-39 39-39Z" fill="url(#miP) #e2f2fc" stroke="#07547f" stroke-width="14"/><path d="M706 400v63q0 17 17 17h28" fill="url(#miH) #87c4ec" stroke="#07547f" stroke-width="12"/><path d="M601.6 474.7L610.0 472.0L608.9 456.0L631.1 456.0L630.0 472.0L638.4 474.7L638.4 474.7L646.1 478.7L656.7 466.6L672.4 482.3L660.3 492.9L664.3 500.6L664.3 500.6L667.0 509.0L683.0 507.9L683.0 530.1L667.0 529.0L664.3 537.4L664.3 537.4L660.3 545.1L672.4 555.7L656.7 571.4L646.1 559.3L638.4 563.3L638.4 563.3L630.0 566.0L631.1 582.0L608.9 582.0L610.0 566.0L601.6 563.3L601.6 563.3L593.9 559.3L583.3 571.4L567.6 555.7L579.7 545.1L575.7 537.4L575.7 537.4L573.0 529.0L557.0 530.1L557.0 507.9L573.0 509.0L575.7 500.6L575.7 500.6L579.7 492.9L567.6 482.3L583.3 466.6L593.9 478.7L601.6 474.7ZM643 519a23 23 0 1 0 -46 0a23 23 0 1 0 46 0Z" fill="#07547f" fill-rule="evenodd" stroke="#07547f" stroke-width="5"/><path d="M542 611h142m-142 33h120m-120 33h96" stroke="#07547f" stroke-width="15"/><g transform="rotate(-29 375 558)"><path d="M349 366h49l29 61-24 53v100h-52V480l-26-53Z" fill="url(#miP) #d7edfc" stroke="#07547f" stroke-width="13"/><path d="M335 574q0-20 20-20h45q20 0 20 20v151h-85Z" fill="url(#miM) #267eaf" stroke="#07547f" stroke-width="13"/><path d="M351 579h53" stroke="#b9dff5" stroke-width="17"/><path d="M357 607v90m22-90v90m22-90v90" stroke="#9dd4f6" stroke-width="12"/></g><path d="M671 718L756 542Q728 501 738 453Q750 390 819 348Q849 332 864 348L827 409Q809 438 833 461Q855 485 880 472Q895 466 906 447L932 400Q943 384 953 400Q989 457 956 513Q928 557 875 568Q857 572 844 596L775 721Z" fill="url(#miL) #b8ddf5" stroke="#07547f" stroke-width="15"/><path d="M270 728H945L924 936Q918 998 859 998H357Q293 998 283 936Z" fill="url(#miD) #064b79"/><path d="M286 704H927Q949 704 955 726V765Q955 793 926 800H290Q258 793 258 765V729Q258 710 286 704Z" fill="url(#miM) #2389b8"/><path d="M273 709H936" stroke="#75c6ed" stroke-width="20"/><path d="M578.6 788.2L593.0 783.8L591.1 756.7L628.9 756.7L627.0 783.8L641.4 788.2L641.4 788.2L654.7 795.2L672.5 774.7L699.3 801.5L678.8 819.3L685.8 832.6L685.8 832.6L690.2 847.0L717.3 845.1L717.3 882.9L690.2 881.0L685.8 895.4L685.8 895.4L678.8 908.7L699.3 926.5L672.5 953.3L654.7 932.8L641.4 939.8L641.4 939.8L627.0 944.2L628.9 971.3L591.1 971.3L593.0 944.2L578.6 939.8L578.6 939.8L565.3 932.8L547.5 953.3L520.7 926.5L541.2 908.7L534.2 895.4L534.2 895.4L529.8 881.0L502.7 882.9L502.7 845.1L529.8 847.0L534.2 832.6L534.2 832.6L541.2 819.3L520.7 801.5L547.5 774.7L565.3 795.2L578.6 788.2ZM658 864a48 48 0 1 0 -96 0a48 48 0 1 0 96 0Z" fill="#edf7ff" fill-rule="evenodd" stroke="#edf7ff" stroke-width="7"/></g></g></g></svg>`,
  training: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="8" width="38" height="28" rx="3" fill="url(#miP) #e2f2fc"/><rect x="20" y="5" width="42" height="5" rx="2.5" fill="url(#miM) #2389b8"/><path d="M34 36l-4 14M48 36l4 14" stroke="#064b79" stroke-width="2.4"/><rect x="28" y="25" width="5" height="6" rx="1" fill="url(#miH) #75c6ed" stroke="none"/><rect x="35" y="21" width="5" height="10" rx="1" fill="url(#miH) #75c6ed" stroke="none"/><rect x="42" y="17" width="5" height="14" rx="1" fill="url(#miM) #2389b8" stroke="none"/><rect x="49" y="14" width="5" height="17" rx="1" fill="url(#miM) #2389b8" stroke="none"/><path d="M28 21l8-5 6 2 10-6" stroke="#2f9e6e" stroke-width="2"/><circle cx="13" cy="22.4" r="4.4" fill="url(#miD) #064b79"/><path d="M5 37.4V33.4Q5 28.4 10 28.4H16Q21 28.4 21 33.4V37.4Z" fill="url(#miD) #064b79"/><path d="M18 32l8-8" stroke="#07547f" stroke-width="2"/><circle cx="22" cy="47" r="4" fill="url(#miH) #75c6ed"/><path d="M15 59v-2.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V59Z" fill="url(#miM) #2389b8"/><circle cx="34" cy="47" r="4" fill="url(#miH) #75c6ed"/><path d="M27 59v-2.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V59Z" fill="url(#miM) #2389b8"/><circle cx="46" cy="47" r="4" fill="url(#miH) #75c6ed"/><path d="M39 59v-2.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V59Z" fill="url(#miM) #2389b8"/></g></svg>`,
  services: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="46" width="30" height="9" rx="2.5" fill="url(#miL) #b8ddf5"/><path d="M8 50.5h20" stroke="#f5fbff" stroke-width="1.8"/><rect x="6" y="37" width="28" height="9" rx="2.5" fill="url(#miM) #2389b8"/><path d="M10 41.5h18" stroke="#75c6ed" stroke-width="1.8"/><path d="M34 8h20a4 4 0 0 1 4 4v40a4 4 0 0 1-4 4H34Z" fill="url(#miD) #064b79"/><path d="M34 8h-2a4 4 0 0 0-4 4v42a2 2 0 0 0 2 2h4Z" fill="url(#miM) #2389b8"/><path d="M38 25c3-2 6-2 8 0 2-2 5-2 8 0v13c-3-2-6-2-8 0-2-2-5-2-8 0Z" fill="#f5fbff"/><path d="M46 25v13" stroke="#07547f" stroke-width="1.2"/><path d="M38 15h12" stroke="#75c6ed" stroke-width="2"/></g></svg>`,
  about: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="27" fill="url(#miP) #e2f2fc"/><circle cx="32" cy="32" r="21" fill="url(#miL) #b8ddf5" stroke="none"/><circle cx="32" cy="20.94" r="5.94" fill="url(#miM) #2389b8"/><path d="M21.2 41.19V35.79Q21.2 29.04 27.95 29.04H36.05Q42.8 29.04 42.8 35.79V41.19Z" fill="url(#miM) #2389b8"/><circle cx="50" cy="49" r="8.5" fill="url(#miA) #f0b23e"/><path d="M50 46.5v6" stroke="#f5fbff" stroke-width="2.6"/><circle cx="50" cy="43.4" r="1.5" fill="#f5fbff" stroke="none"/></g></svg>`,
  numToTextApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="30" height="22" rx="5" fill="url(#miM) #2389b8"/><path d="M7.2 16.3l2.39-2.3v11.04M13.09 16.76a2.94 2.94 0 0 1 5.89 0c0 3.13-5.89 5.15-5.89 8.28h6.07M22.29 14h5.52l-3.13 4.05a3.5 3.5 0 1 1-2.58 6.26" stroke="#f5fbff" stroke-width="2.6"/><path d="M18 35c0 9 5 14 14 14" fill="none" stroke="#f0b23e" stroke-width="2.8"/><path d="M28.5 44.5L33 49l-4.5 4.5" stroke="#f0b23e" stroke-width="2.8"/><path d="M37 7H52L60 15V54Q60 57 57 57H37Q34 57 34 54V10Q34 7 37 7Z" fill="url(#miP) #e2f2fc"/><path d="M52 7V13Q52 15 54 15H60" fill="url(#miL) #b8ddf5"/><path d="M39 21h15M39 28h15M39 35h15M39 42h10" stroke="#2389b8" stroke-width="2.4"/><path d="M39 49h13" stroke="#75c6ed" stroke-width="2.4"/></g></svg>`,
  surveyApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="7" width="40" height="51" rx="5" fill="url(#miL) #b8ddf5"/><rect x="13" y="12" width="32" height="42" rx="2" fill="#f5fbff"/><rect x="20" y="3" width="18" height="9" rx="3" fill="url(#miD) #064b79"/><circle cx="19" cy="20" r="3" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M26 20h13" stroke="#75c6ed" stroke-width="2.2"/><circle cx="19" cy="30" r="3" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M26 30h13" stroke="#75c6ed" stroke-width="2.2"/><circle cx="19" cy="30" r="1.6" fill="url(#miM) #2389b8" stroke="none"/><circle cx="19" cy="40" r="3" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M26 40h13" stroke="#75c6ed" stroke-width="2.2"/><rect x="41" y="38" width="20" height="20" rx="4" fill="url(#miP) #e2f2fc"/><rect x="45" y="49" width="3.4" height="5" rx="0.8" fill="url(#miH) #75c6ed" stroke="none"/><rect x="49.5" y="45" width="3.4" height="9" rx="0.8" fill="url(#miM) #2389b8" stroke="none"/><rect x="54" y="42" width="3.4" height="12" rx="0.8" fill="url(#miA) #f0b23e" stroke="none"/></g></svg>`,
  examApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H40L49 13V57Q49 60 46 60H10Q7 60 7 57V7Q7 4 10 4Z" fill="url(#miP) #e2f2fc"/><path d="M40 4V11Q40 13 42 13H49" fill="url(#miL) #b8ddf5"/><path d="M13 12h16" stroke="#064b79" stroke-width="2.8"/><rect x="12.5" y="19" width="6" height="6" rx="1.6" fill="url(#miM) #2389b8"/><path d="M13.3 22.2l1.54 1.54l2.86-3.08" stroke="#f5fbff" stroke-width="1.8"/><path d="M23 20.5h19M23 24.5h12" stroke="#75c6ed" stroke-width="2"/><rect x="12.5" y="31" width="6" height="6" rx="1.6" fill="url(#miM) #2389b8"/><path d="M13.3 34.2l1.54 1.54l2.86-3.08" stroke="#f5fbff" stroke-width="1.8"/><path d="M23 32.5h19M23 36.5h12" stroke="#75c6ed" stroke-width="2"/><rect x="12.5" y="43" width="6" height="6" rx="1.6" fill="none" stroke="#2389b8" stroke-width="1.6"/><path d="M23 44.5h19M23 48.5h12" stroke="#75c6ed" stroke-width="2"/><g transform="translate(-5 6)"><path d="M58.5 27l3.5 3.5-15.5 15.5-5 1.5 1.5-5Z" fill="url(#miA) #f0b23e"/><path d="M58.5 27l2-2a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8l-2 2Z" fill="url(#miC) #e2694f"/></g></g></svg>`,
  aiExamApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H40L49 13V57Q49 60 46 60H10Q7 60 7 57V7Q7 4 10 4Z" fill="url(#miP) #e2f2fc"/><path d="M40 4V11Q40 13 42 13H49" fill="url(#miL) #b8ddf5"/><path d="M13 12h16" stroke="#064b79" stroke-width="2.8"/><rect x="12.5" y="19" width="6" height="6" rx="1.6" fill="url(#miM) #2389b8"/><path d="M13.3 22.2l1.54 1.54l2.86-3.08" stroke="#f5fbff" stroke-width="1.8"/><path d="M23 20.5h19M23 24.5h12" stroke="#75c6ed" stroke-width="2"/><rect x="12.5" y="31" width="6" height="6" rx="1.6" fill="url(#miM) #2389b8"/><path d="M13.3 34.2l1.54 1.54l2.86-3.08" stroke="#f5fbff" stroke-width="1.8"/><path d="M23 32.5h19M23 36.5h12" stroke="#75c6ed" stroke-width="2"/><path d="M13 45h20M13 50h14" stroke="#75c6ed" stroke-width="2"/><circle cx="47" cy="46" r="12" fill="url(#miD) #064b79"/><path d="M47 38.5Q49.1 43.9 54.5 46Q49.1 48.1 47 53.5Q44.9 48.1 39.5 46Q44.9 43.9 47 38.5Z" fill="url(#miA) #f0b23e" stroke="none"/><path d="M53 37.1Q53.67 38.83 55.4 39.5Q53.67 40.17 53 41.9Q52.33 40.17 50.6 39.5Q52.33 38.83 53 37.1Z" fill="#f5fbff" stroke="none"/></g></svg>`,
  distanceApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14l17-6 22 6 17-6v42l-17 6-22-6-17 6Z" fill="url(#miP) #e2f2fc"/><path d="M21 8v42M43 14v42" stroke="#b8ddf5" stroke-width="1.5"/><path d="M15 41c6-12 22 4 30-14" fill="none" stroke="#2389b8" stroke-width="2.4" stroke-dasharray="1 5"/><path d="M15 47c-5-6-7-9-7-12a7 7 0 0 1 14 0c0 3-2 6-7 12Z" fill="url(#miC) #e2694f"/><circle cx="15" cy="35" r="2.4" fill="#f5fbff" stroke="none"/><path d="M46 31c-5-6-7-9-7-12a7 7 0 0 1 14 0c0 3-2 6-7 12Z" fill="url(#miG) #2f9e6e"/><circle cx="46" cy="19" r="2.4" fill="#f5fbff" stroke="none"/></g></svg>`,
  bacMathApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6h38a4 4 0 0 1 4 4v42a4 4 0 0 1-4 4H14Z" fill="url(#miD) #064b79"/><path d="M14 6h-2a4 4 0 0 0-4 4v44a2 2 0 0 0 2 2h4Z" fill="url(#miM) #2389b8"/><path d="M25 22h20M30 22v16M40 22v14a3 3 0 0 0 3 3" stroke="#f5fbff" stroke-width="3"/><path d="M24 48h4l3 4 5-10h10" stroke="#f0b23e" stroke-width="2.2"/><path d="M25 13h12" stroke="#75c6ed" stroke-width="2"/></g></svg>`,
  pdfToWordApp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6H23L32 15V49Q32 52 29 52H7Q4 52 4 49V9Q4 6 7 6Z" fill="url(#miP) #e2f2fc"/><path d="M23 6V13Q23 15 25 15H32" fill="url(#miL) #b8ddf5"/><rect x="1" y="27" width="21.84" height="10" rx="2.5" fill="url(#miC) #e2694f"/><path d="M4.5 34.5V29.5h2.2a1.6 1.6 0 0 1 0 3.2H4.5M10.5 34.5V29.5h1.4a2.5 2.5 0 0 1 0 5ZM18.1 29.5h-2.8v5M15.3 31.9h2.2" stroke="#f5fbff" stroke-width="1.5"/><path d="M10 41h16M10 46h16" stroke="#75c6ed" stroke-width="2.4"/><path d="M36 22h14m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="#f0b23e" stroke-width="2.8"/><rect x="36" y="34" width="24" height="24" rx="4.8" fill="url(#miM) #2389b8"/><path d="M42.77 41.75l2.28 9.5l2.94-6.65l2.94 6.65l2.28-9.5" stroke="#f5fbff" stroke-width="2.6"/></g></svg>`
};
/* ---- icon gradients ---- */
// Every icon fill is  url(#miX) <flat colour> : the flat colour shows if these defs are missing.
const ICON_DEFS = '<defs><linearGradient id="miD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f69a0"/><stop offset="1" stop-color="#054372"/></linearGradient><linearGradient id="miM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#41a8d8"/><stop offset="1" stop-color="#1d79a7"/></linearGradient><linearGradient id="miH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9bd9f6"/><stop offset="1" stop-color="#5db4e2"/></linearGradient><linearGradient id="miL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7eefc"/><stop offset="1" stop-color="#a5d1f0"/></linearGradient><linearGradient id="miP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fafdff"/><stop offset="1" stop-color="#d8ebf8"/></linearGradient><linearGradient id="miG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#47ba86"/><stop offset="1" stop-color="#26875b"/></linearGradient><linearGradient id="miA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9cd66"/><stop offset="1" stop-color="#e29b27"/></linearGradient><linearGradient id="miC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef8b6d"/><stop offset="1" stop-color="#d3563e"/></linearGradient><linearGradient id="miV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#977dd9"/><stop offset="1" stop-color="#694db3"/></linearGradient></defs>';
(function addIconDefs(){
  const add = () => {
    if (document.getElementById('mi-defs')) return;
    const box = document.createElement('div');
    box.innerHTML = '<svg id="mi-defs" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' + ICON_DEFS + '</svg>';
    document.body.prepend(box.firstChild);
  };
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();


const CONTENT = {
  trainingCourses: [
    {
      id: 'course-word',
      title_ar: 'دورة Word التفاعلية',
      title_en: 'Interactive Word Course',
      desc_ar: 'دروس مصوّرة خطوة بخطوة، مع ألعاب تفاعلية بعد كل درس — اشتراك شهري 750 دج.',
      desc_en: 'Step-by-step video lessons with interactive games after each one — 750 DA/month.',
      url: 'courses/word-course/index.html',
      icon: ICONS.wordApp,
      comingSoon: true,
    },
    {
      id: 'course-excel',
      title_ar: 'دورة Excel التفاعلية',
      title_en: 'Interactive Excel Course',
      desc_ar: 'دروس مصوّرة خطوة بخطوة، مع تمارين وألعاب تفاعلية بعد كل درس — اشتراك شهري 1000 دج.',
      desc_en: 'Step-by-step video lessons with interactive exercises after each one — 1000 DA/month.',
      url: 'courses/excel-course/index.html',
      icon: ICONS.excelApp,
      comingSoon: true,
    },
    {
      id: 'course-access',
      title_ar: 'دورة Access التفاعلية',
      title_en: 'Interactive Access Course',
      desc_ar: 'دروس مصوّرة خطوة بخطوة لبناء قواعد بيانات احترافية باستخدام Access.',
      desc_en: 'Step-by-step video lessons to build professional databases using Access.',
      icon: ICONS.accessApp,
      comingSoon: true,
    },
    {
      id: 'course-spss',
      title_ar: 'دورة SPSS التفاعلية',
      title_en: 'Interactive SPSS Course',
      desc_ar: 'دروس مصوّرة خطوة بخطوة لتعلّم التحليل الإحصائي للبيانات باستخدام SPSS.',
      desc_en: 'Step-by-step video lessons to learn statistical data analysis using SPSS.',
      icon: ICONS.spssApp,
      comingSoon: true,
    },
    {
      id: 'course-ppt',
      title_ar: 'دورة PowerPoint التفاعلية',
      title_en: 'Interactive PowerPoint Course',
      desc_ar: 'دروس مصوّرة خطوة بخطوة لتصميم عروض تقديمية احترافية.',
      desc_en: 'Step-by-step video lessons to design professional presentations.',
      icon: ICONS.pptApp,
      comingSoon: true,
    },
    {
      id: 'course-powerbi',
      title_ar: 'دورة Power BI التفاعلية',
      title_en: 'Interactive Power BI Course',
      desc_ar: 'دروس مصوّرة خطوة بخطوة لبناء لوحات تحليل بيانات تفاعلية احترافية.',
      desc_en: 'Step-by-step video lessons to build professional interactive data dashboards.',
      icon: ICONS.powerbiApp,
      comingSoon: true,
    },
  ],
  lessons: [
    {
      id: 'lesson-pc-solutions',
      title_ar: 'حلول عملية للحاسوب',
      title_en: 'Practical PC Solutions',
      desc_ar: '10 دروس فيديو قصيرة مع ملفات جاهزة للتحميل — من نقل الملفات بين الهاتف والحاسوب بدون إنترنت إلى إصلاح الفلاشة ونقل البرامج إلى حاسوب جديد.',
      desc_en: '10 short video lessons with ready-to-download files — from moving files between your phone and PC without internet to fixing a flash drive and moving to a new PC.',
      url: 'lessons/pc-solutions/',
      icon: ICONS.pcSolutionsApp,
      badge: 'جديد',
      badge_en: 'New',
    },
    {
      id: 'lesson-excel-vba',
      title_ar: 'أتمتة إكسل بلغة VBA: من الصفر إلى الاحتراف',
      title_en: 'Excel Automation with VBA: From Zero to Pro',
      desc_ar: '10 دروس فيديو عملية مع أكواد جاهزة للنسخ وملفات تطبيقية — من نموذج UserForm إلى الفواتير وPDF وOutlook.',
      desc_en: '10 hands-on video lessons with copy-ready code and practice files — from UserForms to invoices, PDF, and Outlook.',
      category: 'Excel',
      url: 'lessons/excel-vba/',
      icon: ICONS.excelApp,
      badge: 'VBA',
    },
    {
      id: 'lesson-word-shortcuts',
      title_ar: 'اختصارات لوحة المفاتيح في وورد',
      title_en: 'Word Keyboard Shortcuts',
      desc_ar: 'أكثر من 100 اختصار مصنّف لتسريع عملك اليومي في مايكروسوفت وورد.',
      desc_en: '100+ categorized shortcuts to speed up your everyday work in Microsoft Word.',
      category: 'Word',
      url: 'lessons/word-shortcuts/',
      icon: ICONS.wordApp,
    },
    {
      id: 'lesson-excel-shortcuts',
      title_ar: 'اختصارات لوحة المفاتيح في إكسل',
      title_en: 'Excel Keyboard Shortcuts',
      desc_ar: 'أكثر من 100 اختصار مصنّف لتسريع عملك اليومي في مايكروسوفت إكسل.',
      desc_en: '100+ categorized shortcuts to speed up your everyday work in Microsoft Excel.',
      category: 'Excel',
      url: 'lessons/excel-shortcuts/',
      icon: ICONS.excelApp,
    },
    {
      id: 'lesson-access-database',
      title_ar: 'قاعدة بيانات Access خطوة بخطوة',
      title_en: 'Access Database Step by Step',
      desc_ar: '8 دروس تبني معك قاعدة بيانات مكتبة فعلية من الصفر — جداول، علاقات، استعلامات، نماذج، وتقارير.',
      desc_en: '8 lessons building a real library database from scratch — tables, relationships, queries, forms, and reports.',
      category: 'Access',
      url: 'lessons/access-database/',
      icon: ICONS.accessApp,
      comingSoon: true,
    },
    {
      id: 'lesson-word-full',
      title_ar: 'دورة Word الشاملة (مبتدئ إلى محترف)',
      title_en: 'Complete Word Course (Beginner to Advanced)',
      desc_ar: 'دورة كاملة بأيقونات حقيقية وشرح مبسّط، من أول فتحة للبرنامج إلى الاحتراف الكامل.',
      desc_en: 'A complete course with real icons and simple explanations, from opening the program for the first time to full mastery.',
      category: 'Word',
      url: 'lessons/word-full/',
      icon: ICONS.wordApp,
      comingSoon: true,
    },
    { id: 'lesson-excel-full', title_ar: 'دورة Excel الشاملة (مبتدئ إلى محترف)', title_en: 'Complete Excel Course (Beginner to Advanced)',
      desc_ar: 'دورة كاملة تغطي إكسل من الأساسيات إلى الدوال المتقدمة وPower Query وVBA.', desc_en: 'A complete course covering Excel from basics to advanced functions, Power Query, and VBA.',
      icon: ICONS.excelCourseApp, comingSoon: true },
    { id: 'lesson-ppt-full', title_ar: 'دورة PowerPoint الشاملة', title_en: 'Complete PowerPoint Course',
      desc_ar: 'تعلّم تصميم عروض تقديمية احترافية خطوة بخطوة.', desc_en: 'Learn to design professional presentations step by step.',
      icon: ICONS.pptApp, comingSoon: true },
    { id: 'lesson-spss-full', title_ar: 'دورة SPSS الشاملة', title_en: 'Complete SPSS Course',
      desc_ar: 'تعلّم التحليل الإحصائي للبيانات باستخدام SPSS.', desc_en: 'Learn statistical data analysis using SPSS.',
      icon: ICONS.spssApp, comingSoon: true },
    { id: 'lesson-powerbi-full', title_ar: 'دورة Power BI الشاملة', title_en: 'Complete Power BI Course',
      desc_ar: 'تعلّم بناء لوحات تحليل بيانات تفاعلية احترافية.', desc_en: 'Learn to build professional interactive data dashboards.',
      icon: ICONS.powerbiApp, comingSoon: true },
    { id: 'lesson-ref-manager', title_ar: 'إدارة المراجع (Mendeley / Zotero / EndNote)', title_en: 'Reference Management (Mendeley / Zotero / EndNote)',
      desc_ar: 'تعلّم تنظيم مصادرك البحثية وتوثيقها آليًا.', desc_en: 'Learn to organize and automatically cite your research sources.',
      icon: ICONS.refManagerApp, comingSoon: true },
  ],
  apps: [
    { id: 'app-ai-detector', title_ar: 'كاشف النص الآلي', title_en: 'AI Text Detector', title_fr: 'Détecteur de texte IA',
      desc_ar: 'تقدير استرشادي بمساعدة الذكاء الاصطناعي لاحتمال أن يكون نص معين مولّدًا آليًا — يتطلب تسجيل الدخول.',
      desc_en: 'AI-assisted indicative estimate of how likely a text was AI-generated — requires login.',
      url: 'tools/ai-detector/', icon: ICONS.aiDetectorApp },
    { id: 'app-humanizer', title_ar: 'تحويل النص من آلي إلى بشري', title_en: 'AI to Humane', title_fr: 'IA vers Humain',
      desc_ar: 'أعد صياغة نصك بأسلوب أكثر طبيعية مع الحفاظ التام على المعنى — يتطلب تسجيل الدخول.',
      desc_en: 'Rewrite your text in a more natural style while fully preserving its meaning — requires login.',
      url: 'tools/humanizer/', icon: ICONS.humanizerApp },
    {
      id: 'app-summarizer',
      title_ar: 'AI Summarizer',
      title_en: 'AI Summarizer',
      desc_ar: 'لخّص أي نص طويل تلقائيًا بمساعدة الذكاء الاصطناعي.',
      desc_en: 'Automatically summarize any long text with AI assistance.',
      icon: ICONS.summarizeApp,
      comingSoon: true,
    },
    {
      id: 'app-text-cleaner',
      title_ar: 'Text Cleaner',
      title_en: 'Text Cleaner',
      desc_ar: 'نظّف النص من المسافات والرموز الزائدة تلقائيًا.',
      desc_en: 'Automatically clean text from extra spaces and symbols.',
      icon: ICONS.textCleanApp,
      comingSoon: true,
    },
  ],
  /* ============ الأدوات ============
     كل عنصر هنا = أداة قائمة بذاتها لها مجلدها ورابطها الخاص.
     لإضافة أداة جديدة أضف كائنًا جديدًا هنا بنفس الشكل:
     {
       id: 'tool-xxx',
       title_ar: '...', title_en: '...',
       desc_ar: '...', desc_en: '...',
       url: 'tools/xxx/'
     }
  ============================== */
  tools: [
    { id: 'tool-text-to-numbers', title_ar: 'تحويل الأرقام إلى نص', title_en: 'Number to Words',
      desc_ar: 'حوّل أي رقم إلى نص مكتوب بالعربية أو الإنجليزية أو الفرنسية، مع إمكانية إضافة اسم العملة.', desc_en: 'Convert any number into written words in Arabic, English, or French, with an optional currency name.',
      url: 'tools/text-to-numbers/', icon: ICONS.numToTextApp, family: ['admin', 'calc'], tier: 'free' },
    { id: 'tool-invoice-generator', title_ar: 'مولّد الفواتير', title_en: 'Invoice Generator',
      desc_ar: 'أنشئ فاتورة احترافية مع شعار، توقيع، ضريبة، وتحويل المبلغ إلى حروف — بثلاث لغات.',
      desc_en: 'Generate a professional invoice with logo, signature, VAT, and amount-in-words — in three languages.',
      url: 'tools/invoice-generator/', icon: ICONS.invoiceApp, family: 'admin', tier: 'pro' },
    { id: 'tool-maintenance-kpi', title_ar: 'حاسبات مؤشرات الصيانة', title_en: 'Maintenance KPI Calculators',
      desc_ar: 'احسب OEE و MTBF و MTTR والتوفرية فورًا أثناء الكتابة، مع عدادات ملونة ورسم لسلسلة الخسائر — بثلاث لغات.',
      desc_en: 'Compute OEE, MTBF, MTTR and availability instantly as you type, with colored gauges and a loss-cascade chart — in three languages.',
      url: 'tools/maintenance-kpi/', icon: ICONS.maintKpiApp, family: 'admin', tier: 'free', comingSoon: true },
    { id: 'tool-leave-calculator', title_ar: 'حاسبة العطل', title_en: 'Leave Calculator',
      desc_ar: 'احسب تاريخ الرجوع إلى العمل فورًا، مع أيام العمل ونهاية الأسبوع والعطل الرسمية الجزائرية والتقويم الهجري — بثلاث لغات.',
      desc_en: 'Instantly find your return-to-work date, with working days, weekends, Algerian public holidays and the Hijri calendar — in three languages.',
      url: 'tools/leave-calculator/', icon: ICONS.leaveCalcApp, family: ['admin', 'calc'], tier: 'free', comingSoon: true },
    { id: 'tool-cv-builder', title_ar: 'منشئ السيرة الذاتية', title_en: 'CV Builder',
      desc_ar: 'أنشئ سيرة ذاتية احترافية بمعاينة حية وتصدير PDF — يتطلب تسجيل الدخول.',
      desc_en: 'Build a professional CV with live preview and PDF export — requires login.',
      url: 'tools/cv-builder/', icon: ICONS.cvApp, family: 'admin', tier: 'pro' },
    { id: 'tool-exam-generator', title_ar: 'مولّد الامتحانات', title_en: 'Exam Generator',
      desc_ar: 'أنشئ ورقة امتحان احترافية بثمانية أنواع تمارين، ترويسة رسمية، وتصدير PDF — بدون الحاجة لإتقان Word.',
      desc_en: 'Create a professional exam paper with eight exercise types, an official header, and PDF export — no Word skills needed.',
      url: 'tools/exam-generator/', icon: ICONS.examApp, family: 'edu', tier: 'pro' },
    { id: 'tool-ai-exam-generator', title_ar: 'مولّد الامتحانات بالذكاء الاصطناعي', title_en: 'AI Exam Generator',
      desc_ar: 'ارفع درسك واختر الوحدات ونوع التمارين، فيولّد لك الذكاء الاصطناعي امتحانًا كاملًا مع التصحيح، جاهزًا بصيغتي PDF و Word.',
      desc_en: 'Upload your lesson, pick the units and exercise types, and AI builds a complete exam with its answer key, ready as PDF and Word.',
      url: 'tools/ai-exam-generator/', icon: ICONS.aiExamApp, family: 'edu', tier: 'free', comingSoon: true },
    { id: 'tool-brochure-generator', title_ar: 'مولّد المطويات', title_en: 'Brochure Maker',
      desc_ar: 'اختر قالبًا جاهزًا واملأ مطويتك الثلاثية بسهولة، مع معاينة ثلاثية الأبعاد وطباعة وتحميل PDF — بثلاث لغات.',
      desc_en: 'Pick a ready template and fill in your tri-fold brochure easily, with a 3D preview, printing and PDF export — in three languages.',
      url: 'tools/brochure-generator/', icon: ICONS.brochureApp, family: 'edu', tier: 'free' },
    { id: 'tool-encouragement-cards', title_ar: 'مولّد بطاقات التشجيع', title_en: 'Encouragement Card Generator',
      desc_ar: 'أنشئ بطاقات تشجيع جميلة للتلاميذ حسب المادة، بحقول قابلة للتعديل، وطباعة فردية أو جماعية لقائمة أسماء، وتحميل PDF.',
      desc_en: 'Create beautiful encouragement cards for students by subject, with editable fields, single or batch printing from a name list, and PDF export.',
      url: 'tools/encouragement-cards/', icon: ICONS.encouragementApp, family: 'edu', tier: 'free' },
     { id: 'tool-survey-builder', title_ar: 'مولّد الاستبيان', title_en: 'Survey Builder',
  desc_ar: 'أنشئ استبيانك الخاص وشاركه واحصل على تحليل النتائج تلقائيًا.', desc_en: 'Build your own survey, share it, and get automatic results analysis.',
  url: 'tools/survey-builder/', icon: ICONS.surveyApp, family: 'edu', tier: 'promax', comingSoon: true },
    { id: 'tool-budget', title_ar: 'تسيير الميزانية الشهرية', title_en: 'Monthly Budget Tracker',
      desc_ar: 'وزّع دخلك على أظرف ذكية، تتبّع مصاريفك اليومية، واعرف المتاح لك كل يوم — يتطلب تسجيل الدخول.', desc_en: 'Split your income into smart envelopes, track daily spending, and see your daily allowance — requires login.',
      url: 'tools/budget/', icon: ICONS.budgetApp, family: 'home', tier: 'pro' },
    { id: 'tool-certificate-generator', title_ar: 'مولّد الشهادات', title_en: 'Certificate Generator',
      desc_ar: 'اختر من 12 قالبًا جميلًا وأنشئ شهادات تكريم ومشاركة وتكوين وعمل بثلاث لغات، مع إصدار جماعي من Excel ورمز QR وتحميل PDF.',
      desc_en: 'Choose from 12 beautiful templates to create honor, participation, training and employment certificates in three languages, with batch issuing from Excel, a QR code and PDF export.',
      url: 'tools/certificate-generator/', icon: ICONS.certGenApp, family: 'edu', tier: 'pro' },
    { id: 'tool-cover-page', title_ar: 'مولّد صفحات الغلاف', title_en: 'Cover Page Generator',
      desc_ar: 'أنشئ غلافًا احترافيًا لتقاريرك وبحوثك — 10 قوالب وإطارات اختيارية — يتطلب تسجيل الدخول.', desc_en: 'Create a professional cover page for your reports and research — 10 templates and optional frames — requires login.',
      url: 'tools/cover-page/', icon: ICONS.coverPageApp, family: 'edu', tier: 'pro', comingSoon: true },
    { id: 'tool-admin-request', title_ar: 'مولّد الطلب الإداري', title_en: 'Administrative Request Generator',
      desc_ar: 'أنشئ طلبات رسمية جاهزة بمساعدة الذكاء الاصطناعي (إجازة، توظيف، استفادة...) — يتطلب تسجيل الدخول.', desc_en: 'Generate ready official requests with AI assistance (leave, employment, benefit...) — requires login.',
      url: 'tools/admin-request/', icon: ICONS.adminReqApp, family: 'admin', tier: 'pro' },
    { id: 'tool-salary-calc', title_ar: 'حاسبة الراتب', title_en: 'Salary Calculator',
      desc_ar: 'احسب الراتب الصافي مع IRG وCNAS والمنح العائلية، مع كشف راتب مفصل قابل للطباعة.', desc_en: 'Calculate net salary with IRG, CNAS, and family allowances, with a detailed printable payslip.',
      url: 'tools/salary-calc/', icon: ICONS.salaryApp, family: 'home', tier: 'free', comingSoon: true },
    { id: 'tool-date-diff', title_ar: 'حاسبة الفرق بين تاريخين', title_en: 'Date Difference Calculator',
      desc_ar: 'احسب الفرق بالأيام والأشهر والسنوات بين تاريخين، أو استخدمها لمعرفة سنّك بالضبط.', desc_en: 'Calculate the difference in days, months, and years between two dates, or use it to find your exact age.',
      url: 'tools/date-diff/', icon: ICONS.dateDiffApp, family: 'calc', tier: 'free' },
{ id: 'tool-receipt', title_ar: 'مولّد وصل استلام', title_en: 'Receipt Generator',
  desc_ar: 'أنشئ وصل استلام رسمي جاهز للطباعة، مع تحويل المبلغ إلى حروف تلقائيًا.', desc_en: 'Generate an official, print-ready receipt, with automatic amount-to-words.',
  url: 'tools/receipt-generator/', icon: ICONS.receiptApp, family: 'admin', tier: 'pro' },
    { id: 'tool-unit-convert', title_ar: 'محوّل الوحدات', title_en: 'Unit Converter',
      desc_ar: 'حوّل بين وحدات الطول والوزن والحرارة والمساحة والحجم.', desc_en: 'Convert between units of length, weight, temperature, area, and volume.',
      url: 'tools/unit-converter/', icon: ICONS.unitConvApp, family: 'calc', tier: 'free' },
    { id: 'tool-sci-calc', title_ar: 'حاسبة هندسية', title_en: 'Scientific Calculator',
      desc_ar: 'عمليات رياضية وهندسية متقدمة (جذور، أسس، دوال مثلثية).', desc_en: 'Advanced math and engineering operations (roots, powers, trig functions).',
      icon: ICONS.sciCalcApp, family: 'calc', comingSoon: true, tier: 'free' },
    { id: 'tool-qr', title_ar: 'مولّد QR Code', title_en: 'QR Code Generator',
      desc_ar: 'أنشئ رمز QR لبطاقة تعريفك الشخصية بسهولة، ونزّله كصورة.', desc_en: 'Easily generate a QR code for your personal contact card and download it as an image.',
      url: 'tools/qr-generator/', icon: ICONS.qrApp, family: 'admin', tier: 'free' },
    { id: 'tool-supplier-finder', title_ar: 'دليل الموردين وقطع الغيار', title_en: 'Suppliers & Spare Parts Finder',
      desc_ar: 'اكتب اسم القطعة فتظهر لك قائمة الموردين مع الهاتف والبريد والسعر، أو ارفع ملف Excel الخاص بموردينك — مع فلاتر وطلب عرض سعر.',
      desc_en: 'Type a part name to see suppliers with phone, email and price, or upload your own suppliers Excel file — with filters and quotation requests.',
      url: 'tools/supplier-finder/', icon: ICONS.supplierApp, family: 'admin', tier: 'pro', comingSoon: true },
{ id: 'tool-teacher-note', title_ar: 'مولّد مذكرة أستاذ', title_en: 'Lesson Plan Generator',
  desc_ar: 'أنشئ مذكرة تحضير دروس منظمة وجاهزة للأساتذة.', desc_en: 'Create organized, ready lesson-preparation notes for teachers.',
  url: 'tools/lesson-plan-generator/', icon: ICONS.teacherNoteApp, family: 'edu', tier: 'pro' },
    { id: 'tool-id-card', title_ar: 'مولّد بطاقات الهوية', title_en: 'ID Card Generator',
      desc_ar: 'أنشئ بطاقة هوية احترافية بوجهين، بعدة ثيمات ورمز QR حقيقي — يتطلب تسجيل الدخول.', desc_en: 'Generate a professional two-sided ID card with multiple themes and a real QR code — requires login.',
      url: 'tools/id-cards/', icon: ICONS.idCardApp, family: 'admin', tier: 'pro' },
    { id: 'tool-attendance-payroll', title_ar: 'إدارة الحضور والرواتب', title_en: 'Attendance & Payroll Manager',
      desc_ar: 'نظام متكامل لإدارة المصالح والمناصب والموظفين — يتطلب تسجيل الدخول.', desc_en: 'A complete system for managing departments, positions, and employees — requires login.',
      url: 'tools/attendance-payroll/', icon: ICONS.attendanceApp, family: 'admin', tier: 'promax' },
{ id: 'tool-report-gen', title_ar: 'مولّد تقرير مهني', title_en: 'Professional Report Generator',
  desc_ar: 'أنشئ تقارير عمل احترافية بقوالب جاهزة (عام، حادثة، أداء دوري، محضر اجتماع)، فهرس تلقائي، وتصدير PDF متعدد الصفحات — بثلاث لغات.',
  desc_en: 'Generate professional work reports from ready templates (general, incident, periodic performance, meeting minutes), with auto table of contents and multi-page PDF export — in three languages.',
  url: 'tools/tool-report-gen/', icon: ICONS.reportApp, family: 'admin', tier: 'pro', comingSoon: true },
    { id: 'tool-hours-calc', title_ar: 'حاسبة عدد الساعات', title_en: 'Hours Calculator',
      desc_ar: 'احسب عدد ساعات العمل بين وقتين.', desc_en: 'Calculate the number of work hours between two times.',
      icon: ICONS.hoursApp, family: 'calc', comingSoon: true, tier: 'free' },
    { id: 'tool-hijri', title_ar: 'محوّل هجري/ميلادي', title_en: 'Hijri/Gregorian Converter',
      desc_ar: 'حوّل أي تاريخ بالاتجاهين بضغطة واحدة.', desc_en: 'Convert any date both ways in one click.',
      url: 'tools/hijri/', icon: ICONS.hijriApp, family: 'calc', tier: 'free' },
    { id: 'tool-grade-avg', title_ar: 'حاسبة المعدل', title_en: 'Grade Average Calculator',
      desc_ar: 'احسب معدلك بمرونة كاملة — مواد ومعاملات خاصة بك، بأي عدد ولأي مستوى دراسي.', desc_en: 'Calculate your average with full flexibility — your own subjects and weights, for any education level.',
      url: 'tools/grade-calculator/', icon: ICONS.gradeApp, family: 'edu', tier: 'free', comingSoon: true },
    { id: 'tool-memo-organizer', title_ar: 'تنظيم المذكرات', title_en: 'Memo Organizer',
      desc_ar: 'ارفع مذكرتك الفوضوية، وخلّها تنظّم تلقائيًا بالذكاء الاصطناعي — معاينة مجانية، والتحميل بدفعة واحدة — يتطلب تسجيل الدخول.',
      desc_en: 'Upload your messy memo and let AI organize it automatically — free preview, one-time payment to download — requires login.',
      url: 'tools/memo-organizer/', icon: ICONS.memoOrganizerApp, family: 'edu', tier: 'free', comingSoon: true },
{ id: 'tool-schedule', title_ar: 'مولّد جدول زمني', title_en: 'Schedule Generator',
  desc_ar: 'صمّم جدولك الأسبوعي بمهام ملوّنة، احفظه تلقائيًا، واطبعه بضغطة واحدة.', desc_en: 'Design your weekly schedule with color-coded tasks, auto-saved, and print it in one click.',
  url: 'tools/schedule/', icon: ICONS.scheduleApp, family: 'edu', tier: 'pro' },
    { id: 'tool-mail-assist', title_ar: 'مساعد البريد المهني', title_en: 'Professional Email Assistant',
      desc_ar: 'اكتب نقاطك ودع الذكاء الاصطناعي يصيغ لك إيميلًا احترافيًا كاملًا — يتطلب تسجيل الدخول.', desc_en: 'Write your key points and let AI draft a full professional email for you — requires login.',
      url: 'tools/mail-assistant/', icon: ICONS.mailAssistApp, family: 'admin', tier: 'promax' },
    { id: 'tool-pdf-services', title_ar: 'خدمات PDF', title_en: 'PDF Services',
      desc_ar: 'حوّل Word إلى PDF، ادمج أو قسّم ملفات PDF، أو حوّل بين PDF والصور — كل شي بأداة واحدة.',
      desc_en: 'Convert Word to PDF, merge or split PDF files, or convert between PDF and images — all in one tool.',
      url: 'tools/pdf-toolkit/', icon: ICONS.pdfToImgApp, family: 'pdf', tier: 'free', comingSoon: true },
    { id: 'tool-pdf-to-word', title_ar: 'تحويل PDF إلى Word', title_en: 'PDF to Word',
      desc_ar: 'حوّل ملف PDF إلى مستند Word قابل للتعديل مباشرة.',
      desc_en: 'Convert a PDF file into an editable Word document.',
      icon: ICONS.pdfToWordApp, family: 'pdf', tier: 'pro', comingSoon: true },
    // لإضافة أداة جديدة أضف سطرًا هنا بنفس الشكل:
    // { id:'tool-distance', title_ar:'حساب المسافة بين منطقتين', title_en:'Distance Calculator',
    //   desc_ar:'احسب المسافة بين نقطتين جغرافيتين بسهولة.', desc_en:'Calculate distance between two locations.',
    //   url:'tools/distance-calculator/', icon: ICONS.distanceApp },
  ],
  resources: [],
  // الكتب: soon = بطاقة «قريبًا» ظاهرة للجميع لكنها غير قابلة للضغط
  services: [
    { id: 'book-bac-math-summary', title_ar: 'الملخص الشامل لبكالوريا الرياضيات', title_en: 'The Complete Bac Maths Summary',
      desc_ar: 'كتاب مجاني في 39 صفحة: كل قوانين بكالوريا الرياضيات في 10 أبواب و34 درسًا، من قواعد الحساب إلى الاحتمالات والحسابيات، مع نصائح للنجاح — اقرأه أو حمّله PDF.',
      desc_en: 'A free 39-page book: every Bac maths rule in 10 chapters and 34 lessons, from algebra rules to probability and number theory, with tips for success — read it or download the PDF.',
      url: 'books/bac-math-summary/', icon: ICONS.services, badge: 'مجاني', badge_en: 'Free' },
    { id: 'book-bac-math-100', title_ar: 'بكالوريا — 100 تمرين نحو العشرين', title_en: 'Bac Maths — 100 Exercises Towards 20/20',
      desc_ar: 'كتاب PDF: 100 تمرين مختار بعناية في 10 فصول وفق نمط البكالوريا، يشمل جميع محاور البرنامج، مع حلول مفصّلة وواضحة. اقرأ أول 25 صفحة مجانًا وادفع لتحصل على الكتاب فورًا.',
      desc_en: 'A PDF book: 100 carefully chosen exercises in 10 chapters in the Bac exam style, covering the whole programme, with detailed, clear solutions. Read the first 25 pages free and pay to get the book straight away.',
      url: 'books/bac-math-100/', icon: ICONS.bacMathApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-word', title_ar: 'حتى لو كنت من قوم ثمود ستفهم برنامج وورد', title_en: 'Even a Thamud Could Understand Word',
      desc_ar: 'دليل مصوّر خطوة بخطوة في 10 فصول و202 صفحة، من أول نقرة إلى أول مشروع حقيقي.',
      desc_en: 'An illustrated step-by-step guide in 10 chapters and 202 pages, from the first click to a real project.',
      url: 'books/word/', icon: ICONS.wordApp, badge: 'PDF' },
    { id: 'book-excel-vba', title_ar: 'الإبداع مع Excel VBA — برمج أعمالك بنفسك', title_en: 'Creativity with Excel VBA — Automate Your Own Work',
      desc_ar: 'كتاب PDF في 229 صفحة لتعلّم برمجة VBA من الصفر: 12 فصلًا، كود مشروح سطرًا بسطر و6 مشاريع كاملة. اقرأ المعاينة المجانية واطلب الكتاب.',
      desc_en: 'A 229-page PDF book to learn VBA from scratch: 12 chapters, code explained line by line and 6 complete projects. Read the free preview and order the book.',
      url: 'books/excel-vba/', icon: ICONS.excelApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-excel', title_ar: 'موسوعة دوال إكسل – الجزء 1', title_en: 'Excel Functions Encyclopedia – Part 1',
      desc_ar: 'كتاب PDF في 261 صفحة: 226 دالة من القائمة الرسمية لـ Microsoft 365، لكل دالة شرح ومثال على شكل ورقة إكسل. اقرأ الفصل الأول مجانًا واطلب الكتاب.',
      desc_en: 'A 261-page PDF book: 226 functions from the official Microsoft 365 list, each explained with a worked example on an Excel sheet. Read the first chapter free and order the book.',
      url: 'books/excel-functions/', icon: ICONS.excelApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-excel-shortcuts', title_ar: 'الفأرة أكلها القط — كل اختصارات إكسل', title_en: 'The Cat Ate the Mouse — All Excel Shortcuts',
      desc_ar: 'كتاب PDF في 124 صفحة: قرابة 150 اختصارًا في إكسل بمفاتيح مرسومة وأمثلة على شكل ورقة إكسل، تمارين وبطاقة ملخص. اقرأ أول 20 صفحة مجانًا واطلب الكتاب.',
      desc_en: 'A 124-page PDF book: about 150 Excel keyboard shortcuts with drawn keys and worked examples on Excel sheets, exercises and a summary card. Read the first 20 pages free and order the book.',
      url: 'books/excel-shortcuts/', icon: ICONS.excelApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-word-shortcuts', title_ar: 'دليل اختصارات برنامج وورد', title_en: 'Microsoft Word Shortcuts Guide',
      desc_ar: 'كتاب مجاني: أكثر من 60 اختصارًا في وورد، مصوّرة ومشروحة في 8 أبواب — اقرأه أو حمّله PDF.',
      desc_en: 'A free book: over 60 Word shortcuts, illustrated and explained in 8 sections — read it or download the PDF.',
      url: 'books/word-shortcuts/', icon: ICONS.wordShortcutsApp, badge: 'مجاني', badge_en: 'Free' },
    { id: 'book-python', title_ar: 'برمجة بايثون كأن لم تعرفها من قبل', title_en: 'Python Programming as if You Never Knew It',
      desc_ar: 'كتاب مجاني: تعلّم بايثون من الصفر في 14 فصلًا و114 صفحة ملوّنة، من أول سطر برمجي إلى أول مشروع حقيقي.',
      desc_en: 'A free book: learn Python from scratch in 14 chapters and 114 colourful pages, from the first line of code to a real project.',
      url: 'books/python/', icon: ICONS.pythonApp, badge: 'مجاني', badge_en: 'Free' },
    { id: 'book-english-claudio', title_ar: 'تعلم الإنجليزية مع Claudio', title_en: 'Learn English with Claudio',
      desc_ar: 'كتاب مجاني: كتاب بسيط وممتع يعلّمك خطوة بخطوة كيف تحوّل كلود إلى أستاذ إنجليزية خاص بك: يشرح بالعربية، يصحّح أخطاءك، يحاورك بالصوت، ويصنع لك التمارين. مناسب للكبار والصغار ولكل من يبدأ من الصفر.',
      desc_en: 'A free book: a simple, fun step-by-step guide to turning Claude into your own English teacher — it explains in Arabic, corrects your mistakes, talks with you by voice and makes your exercises. For adults, children and complete beginners.',
      url: 'books/english-claudio/', icon: ICONS.englishClaudioApp, badge: 'مجاني', badge_en: 'Free' },
    { id: 'book-computer', title_ar: 'كل ما يعرفه المحترفون عن الحاسوب', title_en: 'Everything Pros Know About Computers',
      desc_ar: 'كتاب مجاني في 184 صفحة و17 فصلًا: المعالج، اللوحة الأم، الذاكرة DDR، أقراص SSD وNVMe، مزود الطاقة، الشاشات، لوحات المفاتيح، التركيب خطوة بخطوة، أنظمة التشغيل ودليل الشراء — برسومات دقيقة وشرح بسيط.',
      desc_en: 'A free 184-page book in 17 chapters: CPUs, motherboards, DDR memory, SSD and NVMe drives, power supplies, monitors, keyboards, step-by-step assembly, operating systems and a buying guide — with precise drawings and simple explanations.',
      url: 'books/computer/', icon: ICONS.pcSolutionsApp, badge: 'مجاني', badge_en: 'Free' },
    { id: 'book-research', title_ar: 'من الفكرة إلى النشر — منهجية البحث العلمي', title_en: 'From Idea to Publication — Research Methodology',
      desc_ar: 'كتاب PDF في 183 صفحة و14 فصلًا: من اختيار الموضوع والبحث في قواعد البيانات إلى تصنيف المجلات، كتابة المقال، الرد على المحكّمين وبراءة الاختراع — بمعلومات محقَّقة ونماذج جاهزة. اقرأ أول 20 صفحة مجانًا واطلب الكتاب.',
      desc_en: 'A 183-page PDF book in 14 chapters: from choosing a topic and searching databases to journal rankings, writing the paper, answering reviewers and patents — with verified facts and ready templates. Read the first 20 pages free and order the book.',
      url: 'books/research/', icon: ICONS.refManagerApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-shortcuts-wiki', title_ar: 'موسوعة الاختصارات — Wiki Shortcuts', title_en: 'Wiki Shortcuts — The Shortcuts Encyclopedia',
      desc_ar: 'كتاب PDF مرجعي في 144 صفحة: نحو 970 اختصارًا بمفاتيح مرسومة في ويندوز، أوفيس، المتصفحات، فوتوشوب، كانفا وبريمير، يوتيوب وواتساب ويب، ماك، وإيماءات الهاتف، مع 12 بطاقة ملخص للطباعة. اقرأ أول 20 صفحة مجانًا واطلب الكتاب.',
      desc_en: 'A 144-page PDF reference: about 970 shortcuts with drawn keys for Windows, Office, browsers, Photoshop, Canva and Premiere, YouTube and WhatsApp Web, Mac and phone gestures, plus 12 printable summary cards. Read the first 20 pages free and order the book.',
      url: 'books/shortcuts-wiki/', icon: ICONS.keyboardApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-excel-kingdom-1', title_ar: 'مملكة الخلايا — إكسل كأن لم تعرفه من قبل (الجزء الأول)', title_en: 'The Kingdom of Cells — Excel Part 1',
      desc_ar: 'الجزء الأول: كتاب PDF في 187 صفحة، إكسل من الصفر في 12 فصلًا و67 درسًا، بصور حقيقية من إكسل 365 وزر تدريب في كل فصل. اقرأ أول 20 صفحة مجانًا واطلب الكتاب.',
      desc_en: 'Part 1: a 187-page PDF book, Excel from scratch in 12 chapters and 67 lessons, with real Excel 365 screenshots and a training link in every chapter. Read the first 20 pages free and order the book.',
      url: 'books/excel-kingdom-1/', icon: ICONS.excelApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-excel-kingdom-2', title_ar: 'مملكة الخلايا — إكسل كأن لم تعرفه من قبل (الجزء الثاني)', title_en: 'The Kingdom of Cells — Excel Part 2',
      desc_ar: 'الجزء الثاني: كتاب PDF في 170 صفحة، إكسل للمحترفين في 11 فصلًا و67 درسًا: XLOOKUP والدوال الحديثة، الجداول المحورية، المخططات، Power Query والماكرو، مع مشروعي مخزون ولوحة تحكم. اقرأ أول 20 صفحة مجانًا واطلب الكتاب.',
      desc_en: 'Part 2: a 170-page PDF book, Excel for professionals in 11 chapters and 67 lessons: XLOOKUP and modern functions, PivotTables, charts, Power Query and macros, with an inventory and a dashboard project. Read the first 20 pages free and order the book.',
      url: 'books/excel-kingdom-2/', icon: ICONS.excelApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-macbook-shortcuts', title_ar: 'كل اختصارات ماكبوك في مكان واحد', title_en: 'All MacBook Shortcuts in One Place',
      desc_ar: 'مرجع سريع بصيغة PDF في 81 صفحة و12 فصلًا: أكثر من 400 اختصار للماك بمفاتيح مرسومة كأنها حقيقية — النظام، لقطات الشاشة، Finder، Safari، Pages و Numbers و Keynote، Word و Excel و PowerPoint، إيماءات لوحة اللمس و11 بطاقة للطباعة. اقرأ أول 20 صفحة مجانًا واطلب الكتاب.',
      desc_en: 'An 81-page PDF quick reference in 12 chapters: over 400 Mac shortcuts with keys drawn like real ones — system, screenshots, Finder, Safari, Pages, Numbers and Keynote, Word, Excel and PowerPoint, trackpad gestures and 11 printable cards. Read the first 20 pages free and order the book.',
      url: 'books/macbook-shortcuts/', icon: ICONS.keyboardApp, badge: 'جديد', badge_en: 'New' },
    { id: 'book-bem-math', title_ar: 'الملخص الشامل — شهادة التعليم المتوسط (رياضيات)', title_en: 'The Complete Summary — BEM Mathematics',
      desc_ar: 'ملخص مجاني في 32 صفحة لكل دروس الرياضيات للسنة الرابعة متوسط في 6 أبواب: الأعداد والجذور، الحساب الحرفي والمعادلات، الدوال، الإحصاء والاحتمالات، الهندسة المستوية وهندسة الفضاء — تعاريف وطرق وأمثلة محلولة ونصائح للنجاح في الشهادة. اقرأه أو حمّله PDF.',
      desc_en: 'A free 32-page summary of all 4th-year middle-school maths for the BEM exam in 6 parts: numbers and roots, algebra and equations, functions, statistics and probability, plane and solid geometry — definitions, methods, worked examples and exam tips. Read it or download the PDF.',
      url: 'books/bem-math/', icon: ICONS.numbersApp, badge: 'مجاني', badge_en: 'Free' },
    { id: 'book-access', title_ar: 'كتاب Access', title_en: 'Access Book',
      desc_ar: 'كتاب مصوّر في قواعد بيانات Access.', desc_en: 'An illustrated book on Access databases.',
      icon: ICONS.accessApp, comingSoon: true, soon: true },
    { id: 'book-powerbi', title_ar: 'كتاب Power BI', title_en: 'Power BI Book',
      desc_ar: 'كتاب مصوّر في تحليل البيانات بـ Power BI.', desc_en: 'An illustrated book on data analysis with Power BI.',
      icon: ICONS.powerbiApp, comingSoon: true, soon: true },
    { id: 'book-spss', title_ar: 'كتاب SPSS', title_en: 'SPSS Book',
      desc_ar: 'كتاب مصوّر في التحليل الإحصائي بـ SPSS.', desc_en: 'An illustrated book on statistical analysis with SPSS.',
      icon: ICONS.spssApp, comingSoon: true, soon: true },
  ],
  trainings: [
    {
      id: 'training-word-basics',
      title_ar: 'تدريب شامل في وورد',
      title_en: 'Complete Word Training',
      desc_ar: '5 مستويات، 30 سؤال لكل مستوى (اختصارات ومعلومات عامة)، بصعوبة تصاعدية.',
      desc_en: '5 levels, 30 questions each (shortcuts and general knowledge), increasing difficulty.',
      url: 'trainings/word-training/',
      icon: ICONS.wordApp,
    },
    {
      id: 'training-excel',
      title_ar: 'تدريب شامل في إكسل',
      title_en: 'Complete Excel Training',
      desc_ar: '5 مستويات، 30 سؤال لكل مستوى: من الواجهة إلى VLOOKUP والجداول المحورية والماكرو، مع شرح بعد كل إجابة.',
      desc_en: '5 levels, 30 questions each: from the interface to VLOOKUP, PivotTables and macros, with an explanation after every answer.',
      url: 'trainings/excel-training/',
      icon: ICONS.excelCourseApp,
    },
    {
      id: 'training-keyboard-typing',
      title_ar: 'التدريب على لوحة المفاتيح',
      title_en: 'Keyboard Typing Training',
      desc_ar: '8 مراحل تصاعدية للكتابة بالعشر أصابع بالعربية والفرنسية والإنجليزية، والزر المطلوب يضيء أمامك.',
      desc_en: '8 progressive stages to learn touch typing in Arabic, French and English, with the key you need lighting up.',
      url: 'trainings/keyboard-typing/',
      icon: ICONS.keyboardApp,
    },
    {
      id: 'training-live-room',
      title_ar: 'غرفة التدريب المباشر',
      title_en: 'Live Training Room',
      desc_ar: 'مسابقة حيّة أثناء الدرس: ادخل الغرفة برمز المدرّب، أجب أسرع من زملائك، وتابع ترتيبك لحظة بلحظة.',
      desc_en: 'A live in-class contest: join with the trainer\'s code, answer faster than your classmates and follow your rank in real time.',
      url: 'trainings/live-room/',
      icon: ICONS.liveRoomApp,
    },
    { id: 'training-ppt', title_ar: 'تدريب شامل في PowerPoint', title_en: 'Complete PowerPoint Training',
      desc_ar: '5 مستويات بصعوبة تصاعدية لاختبار معلوماتك في PowerPoint.', desc_en: '5 levels of increasing difficulty to test your PowerPoint knowledge.',
      icon: ICONS.pptApp, comingSoon: true },
    { id: 'training-access', title_ar: 'تدريب شامل في Access', title_en: 'Complete Access Training',
      desc_ar: '5 مستويات بصعوبة تصاعدية لاختبار معلوماتك في Access.', desc_en: '5 levels of increasing difficulty to test your Access knowledge.',
      icon: ICONS.accessApp, comingSoon: true },
    { id: 'training-spss', title_ar: 'تدريب شامل في SPSS', title_en: 'Complete SPSS Training',
      desc_ar: '5 مستويات بصعوبة تصاعدية لاختبار معلوماتك في SPSS.', desc_en: '5 levels of increasing difficulty to test your SPSS knowledge.',
      icon: ICONS.spssApp, comingSoon: true },
    { id: 'training-powerbi', title_ar: 'تدريب شامل في Power BI', title_en: 'Complete Power BI Training',
      desc_ar: '5 مستويات بصعوبة تصاعدية لاختبار معلوماتك في Power BI.', desc_en: '5 levels of increasing difficulty to test your Power BI knowledge.',
      icon: ICONS.powerbiApp, comingSoon: true },
    // لإضافة اختبار جديد (Excel, Word, إعلام آلي...) أضف كائنًا هنا بنفس الشكل:
    // { id:'training-excel-1', title_ar:'اختبار: أساسيات إكسل', title_en:'Quiz: Excel basics',
    //   desc_ar:'وصف الاختبار.', desc_en:'Quiz description.' },
  ],
};

/* ============ أيقونات SVG (ستايل شبه ثلاثي الأبعاد: ظلال + انعكاسات ضوء) ============ */
// big = shown as a large frameless icon on the home page, glow = its hover / tap halo colour
// Home order (right to left in RTL, top to bottom on phones): tools, books, lessons, then the rest.
const SECTIONS_ROW1 = [
  { key: 'tools',      icon: ICONS.tools,     badge: 'badge-tools',     href: 'tools.html',     big: true,     glow: '#3D7BC0' },
  { key: 'services',  icon: ICONS.services, badge: 'badge-services',  href: 'books.html',     big: true,    glow: '#3D7BC0' },
  { key: 'lessons',   icon: ICONS.lessons,  badge: 'badge-lessons',   href: 'lessons.html',   big: true,  glow: '#3D7BC0' },
];
const SECTIONS_ROW2 = [
  { key: 'apps',       icon: ICONS.apps,      badge: 'badge-apps',      href: 'apps.html',      big: true,      glow: '#3D7BC0' },
  { key: 'favorites',  icon: ICONS.favorites, badge: 'badge-favorites', href: 'favorites.html', big: true, glow: '#3D7BC0' },
  { key: 'trainings', icon: ICONS.training, badge: 'badge-training',  href: 'resources.html', big: true, glow: '#3D7BC0' },
];
const SECTIONS = [...SECTIONS_ROW1, ...SECTIONS_ROW2];

// Items still "coming soon" or without a page of their own stay out of every
// list for visitors (admins still see them, to preview).
function isListed(item){ return !item.comingSoon && !!item.url; }
let homeAdmin = false; // admins can open the "coming soon" home cards

/* =====================================================================
   I18N
===================================================================== */
const I18N = {
  ar: {
    site_title: 'Merabti 🎒',
    brand: 'د. سفيان مرابطي',
    search_placeholder: 'ابحث عن درس، تطبيق، أداة...',
    home: 'الرئيسية',
    footer_text: '© 2026 د. سفيان مرابطي',
    section_lessons: 'الدروس', section_apps: 'التطبيقات', section_tools: 'الأدوات',
    courses_title: 'دورات تكوينية',
    section_trainings: 'تدريب', section_services: 'الكتب', section_favorites: 'المفضلة',
    section_lessons_desc: 'دروس مصورة خطوة بخطوة', section_apps_desc: 'تطبيقات عملية للتنزيل',
    section_tools_desc: 'أدوات مساعدة سريعة', section_trainings_desc: 'اختبارات وتمارين تفاعلية',
    section_services_desc: 'كتب ومؤلفات',
    section_favorites_desc: 'أدواتك وتطبيقاتك المفضّلة',
    go_to_training: 'الذهاب إلى التمرين', review_lesson: 'مراجعة الدرس',
    watch_video: 'مشاهدة الفيديو', open_app: 'فتح على Google Play',
    open_tool: 'فتح الأداة',
    no_results: 'لا نتائج مطابقة', empty_section: 'لا يوجد محتوى هنا بعد.',
    type_lessons: 'درس', type_apps: 'تطبيق', type_tools: 'أداة',
    type_trainings: 'تدريب', type_services: 'كتاب',
    back_to_list: 'رجوع للقائمة',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب', logout: 'تسجيل الخروج',
    login_with_google: 'المتابعة عبر Google',
    email_label: 'البريد الإلكتروني', password_label: 'كلمة المرور', name_label: 'الاسم',
    or_divider: 'أو',
    no_account: 'ليس لديك حساب؟', have_account: 'لديك حساب بالفعل؟',
    my_account: 'حسابي',
  },
  en: {
    site_title: 'Merabti 🎒',
    brand: 'Dr. Sofiane Merabti',
    search_placeholder: 'Search lessons, apps, tools...',
    home: 'Home',
    footer_text: '© 2026 Dr. Sofiane Merabti',
    section_lessons: 'Lessons', section_apps: 'Apps', section_tools: 'Tools',
    courses_title: 'Training Courses',
    section_trainings: 'Training', section_services: 'Books', section_favorites: 'Favorites',
    section_lessons_desc: 'Step-by-step video lessons', section_apps_desc: 'Practical apps to download',
    section_tools_desc: 'Quick helper tools', section_trainings_desc: 'Interactive quizzes and exercises',
    section_services_desc: 'Books and publications',
    section_favorites_desc: 'Your favorite tools and apps',
    go_to_training: 'Go to training', review_lesson: 'Review lesson',
    watch_video: 'Watch video', open_app: 'Open on Google Play',
    open_tool: 'Open tool',
    no_results: 'No matching results', empty_section: 'No content here yet.',
    type_lessons: 'Lesson', type_apps: 'App', type_tools: 'Tool',
    type_trainings: 'Training', type_services: 'Book',
    back_to_list: 'Back to list',
    login: 'Log in', signup: 'Sign up', logout: 'Log out',
    login_with_google: 'Continue with Google',
    email_label: 'Email', password_label: 'Password', name_label: 'Name',
    or_divider: 'or',
    no_account: "Don't have an account?", have_account: 'Already have an account?',
    my_account: 'My account',
  },
};

let lang = localStorage.getItem('site_lang') || 'ar';

function t(key){ return I18N[lang][key] || key; }

function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) toggleBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  localStorage.setItem('site_lang', lang);
}

/* =====================================================================
   SHARE
===================================================================== */
/* =====================================================================
   HOME GRID
===================================================================== */
function renderHomeGrid(){
  const grid = document.getElementById('sectionGrid');
  const grid2 = document.getElementById('sectionGridRow2');
  if (!grid) return;
  grid.innerHTML = '';
  if (grid2) grid2.innerHTML = '';
  SECTIONS_ROW1.forEach(s => grid.appendChild(sectionCard(s)));
  SECTIONS_ROW2.forEach(s => (grid2 || grid).appendChild(sectionCard(s)));
}

// A "coming soon" section shows its badge; for visitors it is a plain,
// faded card that does not open, admins still get the link.
function sectionCard(s){
  const locked = s.comingSoon && !homeAdmin;
  const card = document.createElement(locked ? 'div' : 'a');
  card.className = 'section-card' + (s.big ? ' icon-card' : '') + (locked ? ' coming-soon-card' : '');
  if (!locked){
    card.href = s.href;
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
  }
  card.style.display = 'block';
  if (s.glow) card.style.setProperty('--glow', s.glow);
  const visual = s.big
    ? `<span class="section-icon" aria-hidden="true">${s.icon}</span>`
    : `<span class="icon-badge ${s.badge}">${s.icon}</span>`;
  card.innerHTML = `
      ${visual}
      <h3>${t('section_' + s.key)}</h3>
      <p>${t('section_' + s.key + '_desc')}</p>
      ${s.comingSoon ? `<span class="coming-soon-badge" style="position:absolute; top:8px; inset-inline-start:8px; margin:0; font-size:.62rem; padding:2px 8px;">${lang === 'ar' ? 'قريبًا' : 'Coming soon'}</span>` : ''}
    `;
  if (s.big && !locked) addTapEffect(card);
  return card;
}

// Touch screens: the icon pops and glows on tap, and the page opens once the
// pop has played (a short delay) so the effect is actually seen.
function addTapEffect(card){
  let touched = false;
  card.addEventListener('touchstart', () => {
    touched = true;
    card.classList.remove('tapped');
    void card.offsetWidth; // restart the animation
    card.classList.add('tapped');
  }, { passive: true });
  card.addEventListener('animationend', () => card.classList.remove('tapped'));
  card.addEventListener('click', e => {
    if (!touched || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    touched = false;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    setTimeout(() => { window.location.href = card.href; }, 260);
  });
}

/* =====================================================================
   SECTION LIST + DETAIL (lessons / apps / tools / resources / services)
===================================================================== */
const FAMILY_LABELS = {
  ar: { admin: 'إدارية', edu: 'تعليمية', calc: 'حاسبات', home: 'منزلية', pdf: 'خدمات PDF' },
  en: { admin: 'Admin', edu: 'Educational', calc: 'Calculators', home: 'Home', pdf: 'PDF Services' },
};
let activeFamily = null;
try {
  const savedFamily = sessionStorage.getItem('merabti:activeFamily');
  if (savedFamily) activeFamily = savedFamily;
} catch (e) { /* ignore */ }

function renderFamilyFilter(items){
  const bar = document.getElementById('familyFilter');
  if (!bar) return;
  const families = Array.from(new Set(items.flatMap(i => Array.isArray(i.family) ? i.family : [i.family]).filter(Boolean)));
  if (families.length === 0){ bar.classList.add('hidden'); return; }
  if (!activeFamily || !families.includes(activeFamily)) activeFamily = families[0];
  bar.classList.remove('hidden');
  const labels = FAMILY_LABELS[lang] || FAMILY_LABELS.ar;
  bar.innerHTML = families.map(f => `<button type="button" class="family-btn ${f === activeFamily ? 'active' : ''}" data-family="${f}">${labels[f] || f}</button>`).join('');
  bar.querySelectorAll('.family-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFamily = btn.getAttribute('data-family');
      try { sessionStorage.setItem('merabti:activeFamily', activeFamily); } catch (e) { /* ignore */ }
      renderSectionItems();
      renderCoursesSection();
    });
  });
}

/* =====================================================================
   نافذة "قريبًا" الخاصة بالدفع مقابل الدورات التكوينية
   (البطاقة الذهبية / Visa) — أيقونات أصلية بسيطة، بدون أي شعار رسمي.
===================================================================== */
function showTrainingCoursePaymentModal(){
  if (document.getElementById('coursePaymentOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'coursePaymentOverlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(21,36,49,.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000; opacity: 0; transition: opacity .2s ease;
  `;
  overlay.innerHTML = `
    <div id="coursePaymentCard" style="
      background: #fff; border-radius: 22px; padding: 32px 28px;
      max-width: 380px; width: calc(100% - 40px); text-align: center;
      box-shadow: 0 20px 60px rgba(21,36,49,.25);
      transform: scale(.9); transition: transform .2s ease;
      font-family: inherit;
    ">
      <h3 style="margin: 0 0 8px; font-size: 1.3rem; font-weight: 900; color: #1E2F40;">قريبًا ✨</h3>
      <p style="margin: 0 0 22px; font-size: 1rem; line-height: 1.8; color: #4A5A6B;">
        هذه الدورة قيد الإعداد بعناية فائقة لتصل إليكم بأفضل صورة. سيُتاح الدفع قريبًا عبر البطاقة الذهبية أو بطاقة Visa. تابعونا!
      </p>
      <div style="display:flex; gap:14px; justify-content:center; margin-bottom:24px;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <svg viewBox="0 0 48 32" width="60" height="40">
            <defs><linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#F7D989"/><stop offset="1" stop-color="#C9861B"/>
            </linearGradient></defs>
            <rect x="1" y="1" width="46" height="30" rx="5" fill="url(#gGold)" stroke="#B8790E"/>
            <rect x="5" y="8" width="10" height="7" rx="1.5" fill="#fff" opacity=".85"/>
            <rect x="5" y="21" width="22" height="2.5" rx="1.2" fill="#fff" opacity=".7"/>
          </svg>
          <span style="font-size:.8rem; font-weight:700; color:#8A6510;">الذهبية</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <svg viewBox="0 0 48 32" width="60" height="40">
            <defs><linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#5C8DE0"/><stop offset="1" stop-color="#1A3E7A"/>
            </linearGradient></defs>
            <rect x="1" y="1" width="46" height="30" rx="5" fill="url(#gBlue)" stroke="#12305F"/>
            <rect x="5" y="8" width="10" height="7" rx="1.5" fill="#fff" opacity=".85"/>
            <rect x="5" y="21" width="22" height="2.5" rx="1.2" fill="#fff" opacity=".7"/>
          </svg>
          <span style="font-size:.8rem; font-weight:700; color:#1A3E7A;">Visa</span>
        </div>
      </div>
      <button type="button" id="coursePaymentClose" style="
        background: #2F5CA8; color: #fff; border: none; border-radius: 999px;
        padding: 12px 30px; font-family: inherit; font-weight: 700; font-size: .95rem;
        cursor: pointer;
      ">تمام</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    overlay.querySelector('#coursePaymentCard').style.transform = 'scale(1)';
  });
  function close(){
    overlay.style.opacity = '0';
    overlay.querySelector('#coursePaymentCard').style.transform = 'scale(.9)';
    setTimeout(() => overlay.remove(), 200);
  }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('#coursePaymentClose').addEventListener('click', close);
}

async function renderCoursesSection(){
  const wrap = document.getElementById('coursesSection');
  if (!wrap) return; // only present on lessons.html
  const admin = await isAdminUser();
  const items = (CONTENT.trainingCourses || []).filter(i => admin || !i.comingSoon);
  // no course open to visitors yet: hide the block and its title
  const title = wrap.previousElementSibling;
  wrap.classList.toggle('hidden', items.length === 0);
  if (title && title.classList.contains('view-title')) title.classList.toggle('hidden', items.length === 0);
  wrap.innerHTML = items.map((item) => `
    <div class="item-card course-card" data-course-id="${item.id}" style="cursor:pointer;">
      ${item.icon ? `<span class="icon-badge badge-lessons">${item.icon}</span>` : ''}
      <h3>${lang === 'ar' ? item.title_ar : item.title_en}</h3>
      <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
    </div>
  `).join('');
  wrap.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', async () => {
      // Admins open the course directly; everyone else still sees the "قريبًا" modal.
      // The course pages themselves re-check access (courses/course-guard.js).
      if (await isAdminUser()){
        const item = items.find(i => i.id === card.dataset.courseId);
        if (item) window.location.href = courseUrlFor(item);
        return;
      }
      showTrainingCoursePaymentModal();
    });
  });
}

// Courses with a dedicated page keep their own url; the rest open in the
// shared player (courses/player.html?course=word for id "course-word").
function courseUrlFor(item){
  if (item.url) return item.url;
  return 'courses/player.html?course=' + encodeURIComponent(item.id.replace(/^course-/, ''));
}

async function renderSectionItems(){
  const wrap = document.getElementById('sectionItems');
  if (!wrap) return;
  const key = document.body.dataset.section;
  const admin = await isAdminUser();
  const allItems = (CONTENT[key] || []).filter(i => admin || isListed(i) || i.soon);

  if (key === 'tools'){
    renderFamilyFilter(allItems);
  }
  let items = (key === 'tools' && activeFamily)
    ? allItems.filter(i => Array.isArray(i.family) ? i.family.includes(activeFamily) : i.family === activeFamily)
    : allItems;

  // Ready items stay pinned above "coming soon" ones, in each section, without
  // otherwise disturbing the order authors set in CONTENT.
  items = [...items].sort((a, b) => (a.comingSoon ? 1 : 0) - (b.comingSoon ? 1 : 0));

  await loadUserOrder();
  const orderKey = key === 'tools' && activeFamily ? `${key}:${activeFamily}` : key;
  items = applyUserOrder(orderKey, items);

  wrap.innerHTML = '';
  // Books: the cover alone, at book proportions (no card, icon or text)
  wrap.classList.toggle('book-grid', key === 'services');
  if (items.length === 0){
    wrap.innerHTML = `<p>${t('empty_section')}</p>`;
    return;
  }

  items.forEach(item => {
    if (key === 'services'){
      wrap.appendChild(bookCover(item, admin));
    } else if (item.soon){
      // announced but no page yet: same card, faded, not clickable
      const card = document.createElement('div');
      card.className = 'item-card coming-soon-card';
      card.innerHTML = `
        ${item.icon ? `<span class="icon-badge badge-${key}">${item.icon}</span>` : ''}
        <h3>${lang === 'ar' ? item.title_ar : item.title_en}</h3>
        <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
        <span class="coming-soon-badge">${lang === 'ar' ? 'قريبًا' : 'Coming soon'}</span>
      `;
      wrap.appendChild(card);
    } else if (item.url){
      const card = document.createElement('a');
      card.className = 'item-card';
      card.href = item.url;
      card.style.textDecoration = 'none';
      card.style.color = 'inherit';
      card.style.display = 'block';
      card.style.position = 'relative';
      if (item.external){
        card.target = '_blank';
        card.rel = 'noopener';
      }
      const showFav = (key === 'tools' || key === 'apps');
      const tierBadge = item.tier === 'pro' ? `<span class="tier-badge tier-pro">Pro</span>`
        : item.tier === 'promax' ? `<span class="tier-badge tier-promax">Pro Max</span>`
        : item.badge ? `<span class="tier-badge tier-tag">${(lang === 'en' && item.badge_en) || item.badge}</span>` : '';
      // Admin previewing a not-yet-launched item: keep the same "coming soon" look
      // everyone else sees, but this instance is a real, clickable link underneath.
      const comingSoonBadge = (item.comingSoon && admin) ? `<span class="coming-soon-badge">${lang === 'ar' ? 'قريبًا' : 'Coming soon'}</span>` : '';
      card.innerHTML = `
        ${tierBadge}
        ${showFav ? `<button type="button" class="fav-star-btn ${userFavorites.has(item.id) ? 'active' : ''}" data-fav-id="${item.id}" data-fav-type="${key}" aria-label="favorite">
          <svg viewBox="0 0 24 24" fill="${userFavorites.has(item.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2l-5-4.9 6.9-1z"/></svg>
        </button>` : ''}
        ${item.icon ? `<span class="icon-badge badge-${key}">${item.icon}</span>` : ''}
        <h3>${lang === 'ar' ? item.title_ar : item.title_en}</h3>
        <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
        ${comingSoonBadge}
        `;
      wrap.appendChild(card);
      if (showFav){
        const favBtn = card.querySelector('.fav-star-btn');
        favBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(item.id, key, favBtn);
        });
      }
    } else {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <h3>${lang === 'ar' ? item.title_ar : item.title_en}</h3>
        <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
        <div class="item-meta">${item.category ? `<span class="tag">${item.category}</span>` : ''}</div>
      `;
      card.addEventListener('click', () => { location.hash = item.id; });
      wrap.appendChild(card);
    }
  });

  enableDragReorder(wrap, orderKey, items);
}

// One book on the books page. The cover lives next to the book page
// (books/<name>/cover.webp, cover.jpg as fallback); a book announced without
// a page yet has no cover, so it shows a plain book outline marked "coming soon".
// Keeps the .item-card class so drag-to-reorder still works.
function bookCover(item, admin){
  const title = lang === 'ar' ? item.title_ar : item.title_en;
  const soonTxt = lang === 'ar' ? 'قريبًا' : 'Coming soon';
  if (item.soon || !item.url){
    const el = document.createElement('div');
    el.className = 'item-card book-item book-soon';
    el.innerHTML = `${item.icon ? `<span class="book-soon-ico">${item.icon}</span>` : ''}
      <span class="book-soon-title">${title}</span><span class="coming-soon-badge">${soonTxt}</span>`;
    return el;
  }
  const a = document.createElement('a');
  a.className = 'item-card book-item';
  a.href = item.url;
  a.title = title;
  if (item.external){ a.target = '_blank'; a.rel = 'noopener'; }
  const src = item.cover || item.url + 'cover.webp';
  a.innerHTML = `<img class="book-cover-img" src="${src}" alt="${title}" loading="lazy" decoding="async"
      onerror="if(!this.dataset.f){this.dataset.f=1;this.src=this.src.replace(/\\.webp$/,'.jpg');}">
    ${(item.comingSoon && admin) ? `<span class="coming-soon-badge">${soonTxt}</span>` : ''}`;
  return a;
}

function findItem(listKey, id){
  return (CONTENT[listKey] || []).find(i => i.id === id);
}

function renderItemDetail(listKey, id){
  const item = findItem(listKey, id);
  const listWrap = document.getElementById('sectionItems');
  const detailWrap = document.getElementById('itemDetailWrap');
  const el = document.getElementById('itemDetail');
  if (!item || !detailWrap || !el){
    if (listWrap) listWrap.classList.remove('hidden');
    if (detailWrap) detailWrap.classList.add('hidden');
    return;
  }

  let extra = '';
  if (listKey === 'lessons'){
    if (item.videoUrl) extra += `<a class="store-btn" href="${item.videoUrl}" target="_blank" rel="noopener">${t('watch_video')}</a>`;
    if (item.relatedTraining) extra += `<button class="related-btn" id="relatedBtn" data-list="trainings" data-id="${item.relatedTraining}">${t('go_to_training')}</button>`;
  }
  if (listKey === 'trainings' && item.relatedLesson){
    extra += `<button class="related-btn" id="relatedBtn" data-list="lessons" data-id="${item.relatedLesson}">${t('review_lesson')}</button>`;
  }
  if (listKey === 'apps' && item.playStoreUrl){
    extra += `<a class="store-btn" href="${item.playStoreUrl}" target="_blank" rel="noopener">${t('open_app')}</a>`;
  }
  extra += `<button class="related-btn" id="backToListBtn">${t('back_to_list')}</button>`;

  el.innerHTML = `
    <h2>${lang === 'ar' ? item.title_ar : item.title_en}</h2>
    <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
    ${extra}
  `;

  const relBtn = document.getElementById('relatedBtn');
  if (relBtn){
    relBtn.addEventListener('click', () => {
      renderItemDetail(relBtn.dataset.list, relBtn.dataset.id);
    });
  }
  const backBtn = document.getElementById('backToListBtn');
  if (backBtn){
    backBtn.addEventListener('click', () => { location.hash = ''; });
  }

  if (listWrap) listWrap.classList.add('hidden');
  detailWrap.classList.remove('hidden');
}

function handleHash(){
  const key = document.body.dataset.section;
  if (!key) return;
  const id = location.hash.replace('#', '');
  const listWrap = document.getElementById('sectionItems');
  const detailWrap = document.getElementById('itemDetailWrap');
  if (!id){
    if (listWrap) listWrap.classList.remove('hidden');
    if (detailWrap) detailWrap.classList.add('hidden');
    return;
  }
  renderItemDetail(key, id);
}

/* =====================================================================
   SEARCH (على الصفحة الرئيسية فقط)
===================================================================== */
function buildSearchIndex(){
  const index = [];
  Object.keys(CONTENT).forEach(key => {
    (CONTENT[key] || []).filter(isListed).forEach(item => {
      index.push({ listKey: key, id: item.id, title_ar: item.title_ar, title_en: item.title_en, url: item.url });
    });
  });
  return index;
}

function initSearch(){
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  if (!searchInput || !searchResults) return;

  const searchIndex = buildSearchIndex();
  const pageByKey = {
    lessons: 'lessons.html', apps: 'apps.html', tools: 'tools.html',
    trainings: 'resources.html', services: 'books.html',
  };

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q){ searchResults.classList.add('hidden'); return; }

    const matches = searchIndex.filter(i =>
      i.title_ar.toLowerCase().includes(q) || i.title_en.toLowerCase().includes(q)
    );

    searchResults.innerHTML = matches.length
      ? matches.map(m => {
          const href = m.url ? m.url : `${pageByKey[m.listKey]}#${m.id}`;
          return `
            <div class="result-item" data-href="${href}">
              <span>${lang === 'ar' ? m.title_ar : m.title_en}</span>
              <span class="result-type">${t('type_' + m.listKey)}</span>
            </div>`;
        }).join('')
      : `<div class="result-item">${t('no_results')}</div>`;

    searchResults.classList.remove('hidden');
  });

  searchResults.addEventListener('click', (e) => {
    const row = e.target.closest('.result-item');
    if (!row || !row.dataset.href) return;
    window.location.href = row.dataset.href;
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) searchResults.classList.add('hidden');
  });
}

/* =====================================================================
   THEME (dark / light)
===================================================================== */
/* =====================================================================
   AUTH (Firebase — Google + Email/Password)
===================================================================== */
/* =====================================================================
   FAVORITES
===================================================================== */
let userFavorites = new Set();

async function loadFavorites(){
  const user = getCurrentUser();
  userFavorites = new Set();
  if (!user || !window.firebase || !firebase.firestore) return;
  try {
    const snap = await firebase.firestore().collection('users').doc(user.uid).collection('favorites').get();
    snap.forEach(doc => userFavorites.add(doc.id));
  } catch (e) { /* ignore */ }
}

/* =====================================================================
   CUSTOM ITEM ORDER (drag-and-drop reordering, per user/section)
===================================================================== */
let userOrder = {}; // { [sectionKey]: [id, id, ...] }
let userOrderLoaded = false;

async function loadUserOrder(){
  if (userOrderLoaded) return;
  userOrderLoaded = true;
  const user = getCurrentUser();
  if (user && window.firebase && firebase.firestore){
    try {
      const doc = await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('itemOrder').get();
      if (doc.exists) userOrder = doc.data() || {};
    } catch (e) { /* ignore */ }
  } else {
    try {
      const raw = localStorage.getItem('merabti:order');
      if (raw) userOrder = JSON.parse(raw);
    } catch (e) { /* ignore */ }
  }
}

async function saveUserOrder(key, orderedIds){
  userOrder[key] = orderedIds;
  const user = getCurrentUser();
  if (user && window.firebase && firebase.firestore){
    try {
      await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('itemOrder')
        .set({ [key]: orderedIds }, { merge: true });
    } catch (e) { /* ignore */ }
  } else {
    try { localStorage.setItem('merabti:order', JSON.stringify(userOrder)); } catch (e) { /* ignore */ }
  }
}

function applyUserOrder(key, items){
  const savedOrder = userOrder[key];
  if (!savedOrder || !savedOrder.length) return items;
  const byId = new Map(items.map(i => [i.id, i]));
  const ordered = [];
  savedOrder.forEach(id => { if (byId.has(id)){ ordered.push(byId.get(id)); byId.delete(id); } });
  // Anything not in the saved order (new items added later) keeps its default
  // relative position, appended after the items the user explicitly ordered.
  items.forEach(i => { if (byId.has(i.id)) ordered.push(i); });
  return ordered;
}

function enableDragReorder(wrap, key, items){
  let dragEl = null;
  wrap.querySelectorAll('.item-card').forEach((card, idx) => {
    card.draggable = true;
    card.dataset.itemId = items[idx].id;
    card.addEventListener('dragstart', () => {
      dragEl = card;
      card.classList.add('dragging');
      card.style.opacity = '0.4';
    });
    card.addEventListener('dragend', async () => {
      card.classList.remove('dragging');
      card.style.opacity = '';
      dragEl = null;
      const newOrder = Array.from(wrap.querySelectorAll('.item-card')).map(c => c.dataset.itemId);
      await saveUserOrder(key, newOrder);
    });
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dragEl || dragEl === card) return;
      const rect = card.getBoundingClientRect();
      const after = (e.clientX - rect.left) > rect.width / 2;
      wrap.insertBefore(dragEl, after ? card.nextSibling : card);
    });
  });
}

async function toggleFavorite(itemId, itemType, btnEl){
  const user = getCurrentUser();
  if (!user){
    alert(lang === 'ar' ? 'سجّل دخولك أولًا لإضافة المفضلة.' : 'Please sign in first to add favorites.');
    return;
  }
  const ref = firebase.firestore().collection('users').doc(user.uid).collection('favorites').doc(itemId);
  const isFav = userFavorites.has(itemId);
  try {
    if (isFav){
      await ref.delete();
      userFavorites.delete(itemId);
    } else {
      await ref.set({ type: itemType, addedAt: firebase.firestore.FieldValue.serverTimestamp() });
      userFavorites.add(itemId);
    }
    if (btnEl){
      btnEl.classList.toggle('active', !isFav);
      btnEl.querySelector('svg').setAttribute('fill', !isFav ? 'currentColor' : 'none');
    }
    if (document.body.dataset.section === 'favorites') renderFavoritesPage();
  } catch (e) { /* ignore */ }
}

async function renderFavoritesPage(){
  const wrap = document.getElementById('sectionItems');
  if (!wrap) return;
  const user = getCurrentUser();
  if (!user){
    wrap.innerHTML = `<p>${lang === 'ar' ? 'سجّل دخولك لعرض مفضلتك.' : 'Sign in to view your favorites.'}</p>`;
    return;
  }
  await loadFavorites();
  const allItems = [...CONTENT.tools.map(i => Object.assign({}, i, { _key: 'tools' })), ...CONTENT.apps.map(i => Object.assign({}, i, { _key: 'apps' }))];
  const favItems = allItems.filter(i => userFavorites.has(i.id));
  wrap.innerHTML = '';
  if (favItems.length === 0){
    wrap.innerHTML = `<p>${lang === 'ar' ? 'ما فيه أدوات أو تطبيقات بمفضلتك بعد.' : "You don't have any favorites yet."}</p>`;
    return;
  }
  favItems.forEach(item => {
    const key = item._key;
    const card = document.createElement('a');
    card.className = 'item-card';
    card.href = item.url;
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    card.style.display = 'block';
    card.style.position = 'relative';
    if (item.external){ card.target = '_blank'; card.rel = 'noopener'; }
    card.innerHTML = `
      <button type="button" class="fav-star-btn active" data-fav-id="${item.id}" aria-label="favorite">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2l-5-4.9 6.9-1z"/></svg>
      </button>
      ${item.icon ? `<span class="icon-badge badge-${key}">${item.icon}</span>` : ''}
      <h3>${lang === 'ar' ? item.title_ar : item.title_en}</h3>
      <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
    `;
    wrap.appendChild(card);
    const favBtn = card.querySelector('.fav-star-btn');
    favBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(item.id, key, null);
      card.remove();
      if (!wrap.querySelector('.item-card')) renderFavoritesPage();
    });
  });
}


function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('site_user')); } catch(e){ return null; }
}
function cacheCurrentUser(user){
  if (user) localStorage.setItem('site_user', JSON.stringify(user));
  else localStorage.removeItem('site_user');
}

const AUTH_ERR = {
  ar: {
    'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.',
    'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
    'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).',
    'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد.',
    'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
    'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول.',
    default: 'حدث خطأ، حاول مرة أخرى.',
  },
  en: {
    'auth/email-already-in-use': 'This email is already in use.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/weak-password': 'Password is too weak (min 6 characters).',
    'auth/wrong-password': 'Incorrect password.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/popup-closed-by-user': 'Sign-in window was closed.',
    default: 'Something went wrong, please try again.',
  },
};
function authErrMsg(code){
  const dict = AUTH_ERR[lang] || AUTH_ERR.en;
  return dict[code] || dict.default;
}

function renderAuthForm(mode, errorMsg){
  const menu = document.getElementById('authMenu');
  if (!menu) return;
  const isLogin = mode === 'login';
  menu.innerHTML = `
    <div class="auth-form">
      <h4>${isLogin ? t('login') : t('signup')}</h4>
      ${errorMsg ? `<p class="auth-error">${errorMsg}</p>` : ''}
      <form id="authForm">
        ${!isLogin ? `<input type="text" id="authName" placeholder="${t('name_label')}" required>` : ''}
        <input type="email" id="authEmail" placeholder="${t('email_label')}" required>
        <input type="password" id="authPassword" placeholder="${t('password_label')}" required minlength="6">
        <button type="submit" class="auth-submit" id="authSubmitBtn">${isLogin ? t('login') : t('signup')}</button>
      </form>
      <div class="auth-divider">${t('or_divider')}</div>
      <button type="button" class="auth-google-btn" id="googleAuthBtn">
        <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.6 0-14.1 4.3-17.7 10.7z"/><path fill="#4CAF50" d="M24 45c5.3 0 10.2-2 13.9-5.3l-6.4-5.4C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.1-11.4-7.6l-6.6 5.1C9.8 40.6 16.3 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.4 5.4C40.5 36.6 43 30.8 43 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
        ${t('login_with_google')}
      </button>
      <div class="auth-switch">
        ${isLogin ? t('no_account') : t('have_account')}
        <button type="button" id="authSwitchBtn">${isLogin ? t('signup') : t('login')}</button>
      </div>
    </div>`;

  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const nameInput = document.getElementById('authName');
    const submitBtn = document.getElementById('authSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '…';
    try {
      if (isLogin) {
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (nameInput && nameInput.value.trim()) {
          await cred.user.updateProfile({ displayName: nameInput.value.trim() });
        }
      }
      // onAuthStateChanged will handle closing/rendering
    } catch (err) {
      renderAuthForm(mode, authErrMsg(err.code));
    }
  });

  document.getElementById('authSwitchBtn').addEventListener('click', () => renderAuthForm(isLogin ? 'signup' : 'login'));

  document.getElementById('googleAuthBtn').addEventListener('click', async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.fbAuth.signInWithPopup(provider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        renderAuthForm(mode, authErrMsg(err.code));
      }
    }
  });
}

function renderAuth(){
  const wrap = document.getElementById('authWrap');
  const btn = document.getElementById('authBtn');
  const menu = document.getElementById('authMenu');
  if (!wrap || !btn || !menu) return;
  const user = getCurrentUser();

  if (user){
    const initial = (user.name || user.email || '?')[0].toUpperCase();
    btn.innerHTML = user.picture
      ? `<img class="auth-avatar-img" src="${user.picture}" alt="">${'<span class="auth-name-text">' + (user.name || user.email) + '</span>'}`
      : `<span class="auth-avatar">${initial}</span><span class="auth-name-text">${user.name || user.email}</span>`;
    menu.innerHTML = `
      <button type="button" class="auth-menu-item" id="logoutBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
        ${t('logout')}
      </button>`;
    document.getElementById('logoutBtn').addEventListener('click', () => window.fbAuth.signOut());
  } else {
    btn.innerHTML = `
      <span class="auth-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
      <span>${t('login')}</span>`;
    renderAuthForm('login');
  }
}

function showProComingSoonModal(){
  if (document.getElementById('proComingSoonOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'proComingSoonOverlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(21,36,49,.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000; opacity: 0; transition: opacity .2s ease;
  `;
  const isAr = lang === 'ar';
  overlay.innerHTML = `
    <div id="proComingSoonCard" style="
      background: #fff; border-radius: 22px; padding: 36px 30px;
      max-width: 360px; width: calc(100% - 40px); text-align: center;
      box-shadow: 0 20px 60px rgba(21,36,49,.25);
      transform: scale(.9); transition: transform .2s ease;
      font-family: inherit;
    ">
      <svg width="64" height="46" viewBox="0 0 64 46" style="margin-bottom: 14px;">
        <defs>
          <linearGradient id="goldCardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F7D989"/>
            <stop offset="1" stop-color="#C9861B"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="42" rx="8" fill="url(#goldCardGrad)" stroke="#B8790E" stroke-width="1"/>
        <rect x="8" y="12" width="12" height="9" rx="2" fill="#fff" opacity=".85"/>
        <rect x="8" y="30" width="30" height="3.5" rx="1.75" fill="#fff" opacity=".7"/>
        <rect x="8" y="36" width="18" height="3" rx="1.5" fill="#fff" opacity=".5"/>
      </svg>
      <h3 style="margin: 0 0 12px; font-size: 1.3rem; font-weight: 900; color: #1E2F40;">
        ${isAr ? 'قريبًا' : 'Coming soon'}
      </h3>
      <p style="margin: 0 0 24px; font-size: 1.05rem; line-height: 1.8; color: #4A5A6B;">
        ${isAr
          ? 'أدوات Pro قيّمة على الأبواب، بدفع سهل عبر البطاقة الذهبية أو Visa.'
          : 'Valuable Pro tools are on the way, with easy payment via Edahabia or Visa.'}
      </p>
      <button type="button" id="proComingSoonClose" style="
        background: #2F5CA8; color: #fff; border: none; border-radius: 999px;
        padding: 12px 30px; font-family: inherit; font-weight: 700; font-size: .95rem;
        cursor: pointer;
      ">${isAr ? 'تمام' : 'Got it'}</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    overlay.querySelector('#proComingSoonCard').style.transform = 'scale(1)';
  });
  function close(){
    overlay.style.opacity = '0';
    overlay.querySelector('#proComingSoonCard').style.transform = 'scale(.9)';
    setTimeout(() => overlay.remove(), 200);
  }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('#proComingSoonClose').addEventListener('click', close);
}

function initProBtn(){
  const proBtn = document.getElementById('proBtn');
  if (!proBtn) return;
  proBtn.addEventListener('click', () => {
    if (proBtn.classList.contains('subscribed')) return; // already active, nothing to do on click
    showProComingSoonModal();
  });
}

let cachedIsAdmin = null; // cached per page load, reset on each auth state change
async function isAdminUser(){
  const user = getCurrentUser();
  if (!user || !window.firebase || !firebase.firestore) return false;
  if (cachedIsAdmin !== null) return cachedIsAdmin;
  try {
    const doc = await firebase.firestore().collection('users').doc(user.uid).get();
    cachedIsAdmin = !!(doc.exists && doc.data().isAdmin === true);
  } catch (e) {
    cachedIsAdmin = false;
  }
  return cachedIsAdmin;
}

function applyCachedSubscription(){
  const proBtn = document.getElementById('proBtn');
  const user = getCurrentUser();
  if (!proBtn || !user) return;
  try {
    const s = JSON.parse(localStorage.getItem('site_sub'));
    if (s && s.uid === user.uid){
      proBtn.classList.toggle('subscribed', !!s.subscribed);
      proBtn.classList.toggle('pro-max', !!s.proMax);
    }
  } catch (e) { /* ignore */ }
}

async function refreshSubscriptionStatus(){
  const proBtn = document.getElementById('proBtn');
  if (!proBtn) return;
  const user = getCurrentUser();
  if (!user || !window.firebase || !firebase.firestore){
    proBtn.classList.remove('subscribed', 'pro-max');
    try { localStorage.removeItem('site_sub'); } catch (e) { /* ignore */ }
    return;
  }
  const saveSub = (subscribed, proMax) => {
    try { localStorage.setItem('site_sub', JSON.stringify({ uid: user.uid, subscribed, proMax })); } catch (e) { /* ignore */ }
  };
  if (await isAdminUser()){
    // Admin accounts always see the fully-unlocked (Pro Max) state, bypassing
    // subscription checks entirely — this is the single shared bypass point
    // every future locked feature should also call isAdminUser() to honor.
    proBtn.classList.add('subscribed', 'pro-max');
    saveSub(true, true);
    return;
  }
  try {
    const doc = await firebase.firestore().collection('users').doc(user.uid).get();
    const sub = doc.exists ? doc.data().subscription : null;
    const isActive = !!(sub && sub.active && sub.expiresAt && sub.expiresAt.toMillis() > Date.now());
    proBtn.classList.toggle('subscribed', isActive);
    // Note: only the "Pro" tier is purchasable today — "Pro Max" has no separate
    // checkout yet, so this class is never set (for non-admins) until that tier is built.
    proBtn.classList.toggle('pro-max', false);
    saveSub(isActive, false);
  } catch (e) {
    proBtn.classList.remove('subscribed', 'pro-max');
  }
}

function initAuth(){
  const wrap = document.getElementById('authWrap');
  const btn = document.getElementById('authBtn');
  const menu = document.getElementById('authMenu');
  if (!wrap || !btn || !menu) return;

  // First paint straight from cached data, without waiting for Firebase,
  // so the header buttons keep a stable size and don't jump on load.
  renderAuth();
  applyCachedSubscription();
  wrap.classList.remove('auth-pending');
  const proBtnInit = document.getElementById('proBtn');
  if (proBtnInit) proBtnInit.classList.remove('auth-pending');

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (fbUser) => {
      cachedIsAdmin = null;
      if (fbUser) {
        cacheCurrentUser({
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          picture: fbUser.photoURL || null,
        });
      } else {
        cacheCurrentUser(null);
      }
      renderAuth();
      menu.classList.add('hidden');
      await loadFavorites();
      const section = document.body.dataset.section;
      if (section === 'favorites') renderFavoritesPage();
      else if (section) renderSectionItems();
      renderCoursesSection();
      homeAdmin = await isAdminUser();
      renderHomeGrid();
      await refreshSubscriptionStatus();
      wrap.classList.remove('auth-pending');
      const proBtnEl = document.getElementById('proBtn');
      if (proBtnEl) proBtnEl.classList.remove('auth-pending');
    });
  } else {
    renderAuth();
    wrap.classList.remove('auth-pending');
    const proBtnEl = document.getElementById('proBtn');
    if (proBtnEl) proBtnEl.classList.remove('auth-pending');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) menu.classList.add('hidden');
  });
}

/* =====================================================================
   INIT
===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn){
    toggleBtn.addEventListener('click', () => {
      lang = lang === 'ar' ? 'en' : 'ar';
      applyLanguage();
      renderHomeGrid();
      if (document.body.dataset.section === 'favorites') renderFavoritesPage();
      else renderSectionItems();
      renderCoursesSection();
      handleHash();
      renderAuth();
    });
  }
  initAuth();
  initProBtn();
  renderHomeGrid();
  if (document.body.dataset.section === 'favorites') renderFavoritesPage();
  else renderSectionItems();
  renderCoursesSection();
  initSearch();
  handleHash();
});
window.addEventListener('hashchange', handleHash);
