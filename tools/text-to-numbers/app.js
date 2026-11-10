/* =====================================================================
   CONTENT STORE
   هذا هو المكان الوحيد الذي تعدّل فيه لإضافة دروس / تطبيقات / أدوات.
   لإضافة أداة جديدة: أنشئ مجلدها في tools/اسم-الأداة/ ثم أضف سطرًا هنا
   داخل CONTENT.tools فقط — لا حاجة لتعديل أي صفحة أخرى.
===================================================================== */

const CONTENT = {
  lessons: [
    {
      id: 'lesson-word-move-image',
      title_ar: 'تحريك الصورة بسهولة في وورد',
      title_en: 'Moving images easily in Word',
      desc_ar: 'شرح خطوة بخطوة لتحريك الصور وتموضعها داخل مستند وورد.',
      desc_en: 'A step-by-step guide to positioning and moving images inside a Word document.',
      category: 'Word',
      videoUrl: 'https://www.youtube.com/watch?v=7kxAqiy4ER0',
      relatedTraining: 'training-word-basics',
    },
    {
      id: 'lesson-word-table-move',
      title_ar: 'تحريك الجدول بسهولة في وورد',
      title_en: 'Moving tables easily in Word',
      desc_ar: 'كيفية تحريك وتنظيم الجداول داخل المستند بدون تعقيد.',
      desc_en: 'How to move and organize tables inside a document without hassle.',
      category: 'Word',
      videoUrl: 'https://www.youtube.com/watch?v=zFBEXsB-ZVo',
      relatedTraining: 'training-word-basics',
    },
  ],
  apps: [
    {
      id: 'app-word-shortcuts',
      title_ar: 'اختصارات وورد',
      title_en: 'Word Shortcuts',
      desc_ar: 'تطبيق ثنائي اللغة لتعلّم أهم اختصارات لوحة المفاتيح في مايكروسوفت وورد.',
      desc_en: 'A bilingual app for learning the most useful Microsoft Word keyboard shortcuts.',
      platform_ar: 'أندرويد',
      platform_en: 'Android',
      playStoreUrl: '',
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
      url: 'tools/text-to-numbers/' },
    { id: 'tool-invoice-generator', title_ar: 'مولّد الفواتير', title_en: 'Invoice Generator',
      desc_ar: 'أنشئ فاتورة احترافية مع شعار، توقيع، ضريبة، وتحويل المبلغ إلى حروف — بثلاث لغات.',
      desc_en: 'Generate a professional invoice with logo, signature, VAT, and amount-in-words — in three languages.',
      url: 'https://drmerabti.github.io/dr/invoice-generator/', external: true },
    // لإضافة أداة جديدة أضف سطرًا هنا بنفس الشكل:
    // { id:'tool-distance', title_ar:'حساب المسافة بين منطقتين', title_en:'Distance Calculator',
    //   desc_ar:'احسب المسافة بين نقطتين جغرافيتين بسهولة.', desc_en:'Calculate distance between two locations.',
    //   url:'tools/distance-calculator/' },
  ],
  resources: [],
  services: [],
  trainings: [
    {
      id: 'training-word-basics',
      title_ar: 'تمرين: أساسيات وورد',
      title_en: 'Exercise: Word basics',
      desc_ar: 'تمرين عملي لتثبيت ما تعلمته في دروس وورد الأساسية.',
      desc_en: 'A hands-on exercise to reinforce the basic Word lessons.',
      relatedLesson: 'lesson-word-move-image',
    },
    // لإضافة اختبار جديد (Excel, Word, إعلام آلي...) أضف كائنًا هنا بنفس الشكل:
    // { id:'training-excel-1', title_ar:'اختبار: أساسيات إكسل', title_en:'Quiz: Excel basics',
    //   desc_ar:'وصف الاختبار.', desc_en:'Quiz description.' },
  ],
};

/* ============ أيقونات SVG (ستايل شبه ثلاثي الأبعاد: ظلال + انعكاسات ضوء) ============ */
const ICONS = {
  lessons: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="19" width="46" height="29" rx="4" fill="#064b79"/><rect x="13" y="23" width="38" height="21" rx="1.5" fill="#e2f2fc" stroke="none"/><path d="M3 50h58l-3 5a3 3 0 0 1-2.6 1.5H8.6A3 3 0 0 1 6 55Z" fill="#2389b8"/><circle cx="25" cy="33.5" r="6.5" fill="#2389b8" stroke="none"/><path d="M23 30v7l5.5-3.5Z" fill="#f5fbff" stroke="none"/><path d="M36 30h11M36 35h11M36 40h7" stroke="#75c6ed" stroke-width="2.2"/><path d="M38 3L22 9.5 38 16l16-6.5Z" fill="#064b79"/><path d="M30 13v4.5c0 1.8 3.6 3 8 3s8-1.2 8-3V13l-8 3Z" fill="#2389b8"/><path d="M51 10.5v7" stroke="#f0b23e" stroke-width="1.8"/><circle cx="51" cy="18.5" r="1.8" fill="#f0b23e" stroke="none"/></g></svg>`,
  apps: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="5" width="50" height="38" rx="5" fill="#064b79"/><rect x="14" y="9" width="42" height="30" rx="2" fill="#e2f2fc" stroke="none"/><path d="M31 43l-1.5 6h11l-1.5-6Z" fill="#2389b8"/><rect x="25" y="49" width="20" height="3.6" rx="1.8" fill="#2389b8"/><rect x="27" y="12" width="11" height="11" rx="2.5" fill="#2389b8" stroke="none"/><rect x="41" y="12" width="11" height="11" rx="2.5" fill="#75c6ed" stroke="none"/><rect x="27" y="26" width="11" height="10" rx="2.5" fill="#75c6ed" stroke="none"/><rect x="41" y="26" width="11" height="10" rx="2.5" fill="#f0b23e" stroke="none"/><path d="M31.5 15.2v4.6l4-2.3Z" fill="#f5fbff" stroke="none"/><rect x="4" y="20" width="20" height="38" rx="4" fill="#b8ddf5"/><rect x="7" y="25" width="14" height="25" rx="1.5" fill="#f5fbff" stroke="none"/><path d="M11 22.6h6" stroke="#07547f" stroke-width="1.4"/><rect x="9" y="28" width="4.4" height="4.4" rx="1" fill="#2389b8" stroke="none"/><rect x="14.6" y="28" width="4.4" height="4.4" rx="1" fill="#f0b23e" stroke="none"/><rect x="9" y="34" width="4.4" height="4.4" rx="1" fill="#75c6ed" stroke="none"/><rect x="14.6" y="34" width="4.4" height="4.4" rx="1" fill="#2389b8" stroke="none"/><circle cx="14" cy="54" r="1.4" fill="#07547f" stroke="none"/></g></svg>`,
  tools: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g transform="scale(.08205) translate(-228 -245)" stroke="none"><g stroke-linejoin="round" stroke-linecap="round"><path d="M364 553H865L948 711H270Z" fill="#07486f" stroke="#187cac" stroke-width="28"/><g transform="rotate(-16 468 451)"><rect x="382" y="282" width="181" height="413" rx="30" fill="#b8def5" stroke="#07547f" stroke-width="16"/><path d="M410 337h48m-48 41h28m-28 42h48m-48 42h28m-28 42h48m-48 42h28m-28 42h48" fill="none" stroke="#07547f" stroke-width="14"/></g><path d="M535 398h157q17 0 29 13l29 31v296H496V437q0-39 39-39Z" fill="#e2f2fc" stroke="#07547f" stroke-width="14"/><path d="M706 400v63q0 17 17 17h28" fill="#87c4ec" stroke="#07547f" stroke-width="12"/><path d="M601.6 474.7L610.0 472.0L608.9 456.0L631.1 456.0L630.0 472.0L638.4 474.7L638.4 474.7L646.1 478.7L656.7 466.6L672.4 482.3L660.3 492.9L664.3 500.6L664.3 500.6L667.0 509.0L683.0 507.9L683.0 530.1L667.0 529.0L664.3 537.4L664.3 537.4L660.3 545.1L672.4 555.7L656.7 571.4L646.1 559.3L638.4 563.3L638.4 563.3L630.0 566.0L631.1 582.0L608.9 582.0L610.0 566.0L601.6 563.3L601.6 563.3L593.9 559.3L583.3 571.4L567.6 555.7L579.7 545.1L575.7 537.4L575.7 537.4L573.0 529.0L557.0 530.1L557.0 507.9L573.0 509.0L575.7 500.6L575.7 500.6L579.7 492.9L567.6 482.3L583.3 466.6L593.9 478.7L601.6 474.7ZM643 519a23 23 0 1 0 -46 0a23 23 0 1 0 46 0Z" fill="#07547f" fill-rule="evenodd" stroke="#07547f" stroke-width="5"/><path d="M542 611h142m-142 33h120m-120 33h96" stroke="#07547f" stroke-width="15"/><g transform="rotate(-29 375 558)"><path d="M349 366h49l29 61-24 53v100h-52V480l-26-53Z" fill="#d7edfc" stroke="#07547f" stroke-width="13"/><path d="M335 574q0-20 20-20h45q20 0 20 20v151h-85Z" fill="#267eaf" stroke="#07547f" stroke-width="13"/><path d="M351 579h53" stroke="#b9dff5" stroke-width="17"/><path d="M357 607v90m22-90v90m22-90v90" stroke="#9dd4f6" stroke-width="12"/></g><path d="M671 718L756 542Q728 501 738 453Q750 390 819 348Q849 332 864 348L827 409Q809 438 833 461Q855 485 880 472Q895 466 906 447L932 400Q943 384 953 400Q989 457 956 513Q928 557 875 568Q857 572 844 596L775 721Z" fill="#b8ddf5" stroke="#07547f" stroke-width="15"/><path d="M270 728H945L924 936Q918 998 859 998H357Q293 998 283 936Z" fill="#064b79"/><path d="M286 704H927Q949 704 955 726V765Q955 793 926 800H290Q258 793 258 765V729Q258 710 286 704Z" fill="#2389b8"/><path d="M273 709H936" stroke="#75c6ed" stroke-width="20"/><path d="M578.6 788.2L593.0 783.8L591.1 756.7L628.9 756.7L627.0 783.8L641.4 788.2L641.4 788.2L654.7 795.2L672.5 774.7L699.3 801.5L678.8 819.3L685.8 832.6L685.8 832.6L690.2 847.0L717.3 845.1L717.3 882.9L690.2 881.0L685.8 895.4L685.8 895.4L678.8 908.7L699.3 926.5L672.5 953.3L654.7 932.8L641.4 939.8L641.4 939.8L627.0 944.2L628.9 971.3L591.1 971.3L593.0 944.2L578.6 939.8L578.6 939.8L565.3 932.8L547.5 953.3L520.7 926.5L541.2 908.7L534.2 895.4L534.2 895.4L529.8 881.0L502.7 882.9L502.7 845.1L529.8 847.0L534.2 832.6L534.2 832.6L541.2 819.3L520.7 801.5L547.5 774.7L565.3 795.2L578.6 788.2ZM658 864a48 48 0 1 0 -96 0a48 48 0 1 0 96 0Z" fill="#edf7ff" fill-rule="evenodd" stroke="#edf7ff" stroke-width="7"/></g></g></g></svg>`,
  training: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="8" width="38" height="28" rx="3" fill="#e2f2fc"/><rect x="20" y="5" width="42" height="5" rx="2.5" fill="#2389b8"/><path d="M34 36l-4 14M48 36l4 14" stroke="#064b79" stroke-width="2.4"/><rect x="28" y="25" width="5" height="6" rx="1" fill="#75c6ed" stroke="none"/><rect x="35" y="21" width="5" height="10" rx="1" fill="#75c6ed" stroke="none"/><rect x="42" y="17" width="5" height="14" rx="1" fill="#2389b8" stroke="none"/><rect x="49" y="14" width="5" height="17" rx="1" fill="#2389b8" stroke="none"/><path d="M28 21l8-5 6 2 10-6" stroke="#2f9e6e" stroke-width="2"/><circle cx="13" cy="22.4" r="4.4" fill="#064b79"/><path d="M5 37.4V33.4Q5 28.4 10 28.4H16Q21 28.4 21 33.4V37.4Z" fill="#064b79"/><path d="M18 32l8-8" stroke="#07547f" stroke-width="2"/><circle cx="22" cy="47" r="4" fill="#75c6ed"/><path d="M15 59v-2.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V59Z" fill="#2389b8"/><circle cx="34" cy="47" r="4" fill="#75c6ed"/><path d="M27 59v-2.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V59Z" fill="#2389b8"/><circle cx="46" cy="47" r="4" fill="#75c6ed"/><path d="M39 59v-2.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V59Z" fill="#2389b8"/></g></svg>`,
  services: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="46" width="30" height="9" rx="2.5" fill="#b8ddf5"/><path d="M8 50.5h20" stroke="#f5fbff" stroke-width="1.8"/><rect x="6" y="37" width="28" height="9" rx="2.5" fill="#2389b8"/><path d="M10 41.5h18" stroke="#75c6ed" stroke-width="1.8"/><path d="M34 8h20a4 4 0 0 1 4 4v40a4 4 0 0 1-4 4H34Z" fill="#064b79"/><path d="M34 8h-2a4 4 0 0 0-4 4v42a2 2 0 0 0 2 2h4Z" fill="#2389b8"/><path d="M38 25c3-2 6-2 8 0 2-2 5-2 8 0v13c-3-2-6-2-8 0-2-2-5-2-8 0Z" fill="#f5fbff"/><path d="M46 25v13" stroke="#07547f" stroke-width="1.2"/><path d="M38 15h12" stroke="#75c6ed" stroke-width="2"/></g></svg>`,
  about: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="27" fill="#e2f2fc"/><circle cx="32" cy="32" r="21" fill="#b8ddf5" stroke="none"/><circle cx="32" cy="20.94" r="5.94" fill="#2389b8"/><path d="M21.2 41.19V35.79Q21.2 29.04 27.95 29.04H36.05Q42.8 29.04 42.8 35.79V41.19Z" fill="#2389b8"/><circle cx="50" cy="49" r="8.5" fill="#f0b23e"/><path d="M50 46.5v6" stroke="#f5fbff" stroke-width="2.6"/><circle cx="50" cy="43.4" r="1.5" fill="#f5fbff" stroke="none"/></g></svg>`,
};

const SECTIONS = [
  { key: 'lessons',   icon: ICONS.lessons,  badge: 'badge-lessons',   href: 'lessons.html' },
  { key: 'apps',      icon: ICONS.apps,     badge: 'badge-apps',      href: 'apps.html' },
  { key: 'tools',     icon: ICONS.tools,    badge: 'badge-tools',     href: 'tools.html' },
  { key: 'trainings', icon: ICONS.training, badge: 'badge-training',  href: 'resources.html' },
  { key: 'services',  icon: ICONS.services, badge: 'badge-services',  href: 'books.html' },
  { key: 'about',     icon: ICONS.about,    badge: 'badge-about',     href: 'about.html' },
];

/* =====================================================================
   I18N
===================================================================== */
const I18N = {
  ar: {
    site_title: 'د. سفيان مرابطي — التعلم الرقمي',
    brand: 'د. سفيان مرابطي',
    search_placeholder: 'ابحث عن درس، تطبيق، أداة...',
    home: 'الرئيسية',
    about_title: 'عن د. سفيان مرابطي',
    about_body: 'أشارك دروسًا وتطبيقات عملية لتسهيل استخدام برامج مايكروسوفت للجميع.',
    footer_text: '© 2026 د. سفيان مرابطي',
    section_lessons: 'الدروس', section_apps: 'التطبيقات', section_tools: 'الأدوات',
    section_trainings: 'تدريب', section_services: 'الخدمات', section_about: 'حول',
    section_lessons_desc: 'دروس مصورة خطوة بخطوة', section_apps_desc: 'تطبيقات عملية للتنزيل',
    section_tools_desc: 'أدوات مساعدة سريعة', section_trainings_desc: 'اختبارات وتمارين تفاعلية',
    section_services_desc: 'خدمات واستشارات', section_about_desc: 'تعرّف علي',
    go_to_training: 'الذهاب إلى التمرين', review_lesson: 'مراجعة الدرس',
    watch_video: 'مشاهدة الفيديو', open_app: 'فتح على Google Play',
    open_tool: 'فتح الأداة',
    no_results: 'لا نتائج مطابقة', empty_section: 'لا يوجد محتوى هنا بعد.',
    type_lessons: 'درس', type_apps: 'تطبيق', type_tools: 'أداة',
    type_trainings: 'تدريب', type_services: 'خدمة',
    back_to_list: 'رجوع للقائمة',
    share_label: 'مشاركة:',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب', logout: 'تسجيل الخروج',
    login_with_google: 'المتابعة عبر Google',
    email_label: 'البريد الإلكتروني', password_label: 'كلمة المرور', name_label: 'الاسم',
    or_divider: 'أو',
    no_account: 'ليس لديك حساب؟', have_account: 'لديك حساب بالفعل؟',
    my_account: 'حسابي',
  },
  en: {
    site_title: 'Dr. Sofiane Merabti — Digital Learning',
    brand: 'Dr. Sofiane Merabti',
    search_placeholder: 'Search lessons, apps, tools...',
    home: 'Home',
    about_title: 'About Dr. Sofiane Merabti',
    about_body: 'I share lessons and practical apps that make Microsoft tools easier for everyone.',
    footer_text: '© 2026 Dr. Sofiane Merabti',
    section_lessons: 'Lessons', section_apps: 'Apps', section_tools: 'Tools',
    section_trainings: 'Training', section_services: 'Services', section_about: 'About',
    section_lessons_desc: 'Step-by-step video lessons', section_apps_desc: 'Practical apps to download',
    section_tools_desc: 'Quick helper tools', section_trainings_desc: 'Interactive quizzes and exercises',
    section_services_desc: 'Services and consulting', section_about_desc: 'Get to know me',
    go_to_training: 'Go to training', review_lesson: 'Review lesson',
    watch_video: 'Watch video', open_app: 'Open on Google Play',
    open_tool: 'Open tool',
    no_results: 'No matching results', empty_section: 'No content here yet.',
    type_lessons: 'Lesson', type_apps: 'App', type_tools: 'Tool',
    type_trainings: 'Training', type_services: 'Service',
    back_to_list: 'Back to list',
    share_label: 'Share:',
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
function shareButtonsHtml(title, url){
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);
  return `
    <div class="share-wrap" onclick="event.stopPropagation()">
      <span class="share-label">${t('share_label')}</span>
      <a class="share-btn" href="https://wa.me/?text=${text}%20${link}" target="_blank" rel="noopener" title="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/></svg>
      </a>
      <a class="share-btn" href="https://t.me/share/url?url=${link}&text=${text}" target="_blank" rel="noopener" title="Telegram">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 2 2 10l6 2 2 7 4-4 5 4 3-17z"/></svg>
      </a>
    </div>`;
}

/* =====================================================================
   HOME GRID
===================================================================== */
function renderHomeGrid(){
  const grid = document.getElementById('sectionGrid');
  if (!grid) return;
  grid.innerHTML = '';
  SECTIONS.forEach(s => {
    const card = document.createElement('a');
    card.className = 'section-card';
    card.href = s.href;
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    card.style.display = 'block';
    card.innerHTML = `
      <span class="icon-badge ${s.badge}">${s.icon}</span>
      <h3>${t('section_' + s.key)}</h3>
      <p>${t('section_' + s.key + '_desc')}</p>
    `;
    grid.appendChild(card);
  });
}

/* =====================================================================
   SECTION LIST + DETAIL (lessons / apps / tools / resources / services)
===================================================================== */
function renderSectionItems(){
  const wrap = document.getElementById('sectionItems');
  if (!wrap) return;
  const key = document.body.dataset.section;
  const items = CONTENT[key] || [];

  wrap.innerHTML = '';
  if (items.length === 0){
    wrap.innerHTML = `<p>${t('empty_section')}</p>`;
    return;
  }

  items.forEach(item => {
    if (key === 'tools' && item.url){
      const card = document.createElement('a');
      card.className = 'item-card';
      card.href = item.url;
      card.style.textDecoration = 'none';
      card.style.color = 'inherit';
      card.style.display = 'block';
      if (item.external){
        card.target = '_blank';
        card.rel = 'noopener';
      }
      card.innerHTML = `
        <h3>${lang === 'ar' ? item.title_ar : item.title_en}</h3>
        <p>${lang === 'ar' ? item.desc_ar : item.desc_en}</p>
        ${shareButtonsHtml(lang === 'ar' ? item.title_ar : item.title_en, item.external ? item.url : (location.origin + location.pathname.replace(/[^/]*$/, '') + item.url))}
      `;
      wrap.appendChild(card);
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
    ${shareButtonsHtml(lang === 'ar' ? item.title_ar : item.title_en, location.href)}
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
    (CONTENT[key] || []).forEach(item => {
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
          const href = m.listKey === 'tools' && m.url ? m.url : `${pageByKey[m.listKey]}#${m.id}`;
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
function themeIcon(theme){
  return theme === 'dark'
    ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.3 0-.6-.1-.9A7 7 0 0 1 12 3z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke-linecap="round"/></svg>`;
}
function initTheme(){
  const saved = localStorage.getItem('site_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = themeIcon(saved);
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('site_theme', cur);
    btn.innerHTML = themeIcon(cur);
  });
}

/* =====================================================================
   AUTH (email + Google)
   ملاحظة: لتفعيل تسجيل الدخول عبر Google فعليًا، ضع Client ID الحقيقي
   من Google Cloud Console هنا واستدعِ Google Identity Services.
===================================================================== */
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('site_user')); } catch(e){ return null; }
}
function setCurrentUser(user){
  if (user) localStorage.setItem('site_user', JSON.stringify(user));
  else localStorage.removeItem('site_user');
  renderAuth();
}

function renderAuthForm(mode){
  const menu = document.getElementById('authMenu');
  if (!menu) return;
  const isLogin = mode === 'login';
  menu.innerHTML = `
    <div class="auth-form">
      <h4>${isLogin ? t('login') : t('signup')}</h4>
      <form id="authForm">
        ${!isLogin ? `<input type="text" id="authName" placeholder="${t('name_label')}" required>` : ''}
        <input type="email" id="authEmail" placeholder="${t('email_label')}" required>
        <input type="password" id="authPassword" placeholder="${t('password_label')}" required minlength="6">
        <button type="submit" class="auth-submit">${isLogin ? t('login') : t('signup')}</button>
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

  document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const nameInput = document.getElementById('authName');
    const name = nameInput ? nameInput.value : email.split('@')[0];
    setCurrentUser({ name, email });
  });
  document.getElementById('authSwitchBtn').addEventListener('click', () => renderAuthForm(isLogin ? 'signup' : 'login'));
  document.getElementById('googleAuthBtn').addEventListener('click', () => {
    alert('لإتمام تسجيل الدخول عبر Google: ضع Google Client ID الخاص بك في app.js داخل متغير GOOGLE_CLIENT_ID، ثم فعّل مكتبة Google Identity Services.');
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
    btn.innerHTML = `<span class="auth-avatar">${initial}</span><span>${user.name || user.email}</span>`;
    menu.innerHTML = `
      <button type="button" class="auth-menu-item" id="logoutBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
        ${t('logout')}
      </button>`;
    document.getElementById('logoutBtn').addEventListener('click', () => setCurrentUser(null));
  } else {
    btn.innerHTML = `
      <span class="auth-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
      <span>${t('login')}</span>`;
    renderAuthForm('login');
  }
}

function initAuth(){
  const wrap = document.getElementById('authWrap');
  const btn = document.getElementById('authBtn');
  const menu = document.getElementById('authMenu');
  if (!wrap || !btn || !menu) return;
  renderAuth();
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
      renderSectionItems();
      handleHash();
      renderAuth();
    });
  }
  initTheme();
  initAuth();
  renderHomeGrid();
  renderSectionItems();
  initSearch();
  handleHash();
});
window.addEventListener('hashchange', handleHash);
