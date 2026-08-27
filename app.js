/* =====================================================================
   CONTENT STORE
   هذا هو المكان الوحيد الذي تعدّل فيه لإضافة دروس / تطبيقات / أدوات.
   لإضافة أداة جديدة: أنشئ مجلدها في tools/اسم-الأداة/ ثم أضف سطرًا هنا
   داخل CONTENT.tools فقط — لا حاجة لتعديل أي صفحة أخرى.
===================================================================== */

const ICONS = {
  invoiceApp: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gInvA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8CC9A8"/><stop offset="1" stop-color="#2E8A5B"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <path d="M12 6c-1.7 0-3 1.3-3 3v30c0 1.7 1.3 3 3 3h24c1.7 0 3-1.3 3-3V6H12z" fill="url(#gInvA)"/>
    <path d="M15 14h18M15 20h18M15 26h11" stroke="#EAF6EF" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24" cy="35" r="6.5" fill="#fff"/>
    <path d="M24 31.5v7M21.7 33.2c0-1 1-1.7 2.3-1.7s2.3.6 2.3 1.5c0 2-4.6 1-4.6 3 0 .9 1 1.6 2.3 1.6s2.3-.6 2.3-1.5" stroke="#2E8A5B" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  </svg>`,
  numbersApp: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gNumA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F6BEDA"/><stop offset="1" stop-color="#B15C86"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <rect x="5" y="14" width="16" height="20" rx="5" fill="url(#gNumA)"/>
    <text x="13" y="27" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">123</text>
    <rect x="27" y="14" width="16" height="20" rx="5" fill="#F6E4EE"/>
    <text x="35" y="27" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#B15C86" text-anchor="middle">ABC</text>
    <path d="M22.5 24h3.5m-1.5-1.5 1.5 1.5-1.5 1.5" stroke="#7A4260" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  wordApp: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gWordA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4A9AE8"/><stop offset="1" stop-color="#1857A8"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <path d="M11 6c-1.7 0-3 1.3-3 3v30c0 1.7 1.3 3 3 3h20c1.7 0 3-1.3 3-3V15l-9-9H11z" fill="url(#gWordA)"/>
    <path d="M25 6v7c0 1.1.9 2 2 2h7z" fill="#8FC2F5" opacity=".6"/>
    <path d="M13.5 22.5h3.2l2.1 10.4 2.4-10.4h3.6l2.4 10.4 2.1-10.4h3.2l-3.6 15h-3.6l-2.3-9.7-2.3 9.7h-3.6z" fill="#fff"/>
  </svg>`,
  lessons: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gLessonsL" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7FC4F5"/><stop offset="1" stop-color="#2F6FB0"/>
      </linearGradient>
      <linearGradient id="gLessonsR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F5FAFF"/><stop offset="1" stop-color="#DCEAFB"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="15" ry="2.4" fill="#1E2F40" opacity=".12"/>
    <path d="M6 10.5c0-2 1.7-3.6 3.8-3.6H23v29H9.8C7.7 35.9 6 34.3 6 32.3V10.5z" fill="url(#gLessonsL)"/>
    <path d="M42 10.5c0-2-1.7-3.6-3.8-3.6H25v29h13.2c2.1 0 3.8-1.6 3.8-3.6V10.5z" fill="url(#gLessonsR)"/>
    <path d="M24 6.9v29" stroke="#1E4E78" stroke-width="1.4" opacity=".5"/>
    <path d="M10 13h9M10 18h9M10 23h6" stroke="#EAF4FF" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
    <path d="M27 13h9M27 18h9M27 23h6" stroke="#B9CEE1" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
    <path d="M6.3 10c.4-1.6 1.9-2.8 3.6-2.8h5v1.4h-5c-1.1 0-2 .7-2.3 1.7z" fill="#fff" opacity=".35"/>
  </svg>`,
  apps: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gAppsA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F6BEDA"/><stop offset="1" stop-color="#B15C86"/>
      </linearGradient>
      <linearGradient id="gAppsB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F6E4EE"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <rect x="6" y="6" width="16" height="16" rx="5" fill="url(#gAppsA)"/>
    <rect x="26" y="6" width="16" height="16" rx="5" fill="url(#gAppsB)"/>
    <rect x="6" y="26" width="16" height="16" rx="5" fill="url(#gAppsB)"/>
    <rect x="26" y="26" width="16" height="16" rx="5" fill="url(#gAppsA)"/>
    <path d="M8 8h4a4 4 0 0 1 4 4v1H8z" fill="#fff" opacity=".3"/>
    <path d="M28 28h4a4 4 0 0 1 4 4v1H28z" fill="#fff" opacity=".25"/>
  </svg>`,
  tools: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gToolsA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#D3DAE1"/><stop offset="1" stop-color="#6D7B87"/>
      </linearGradient>
      <linearGradient id="gToolsB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFC978"/><stop offset="1" stop-color="#E08A2B"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <rect x="20.5" y="5" width="7" height="15" rx="2" transform="rotate(45 24 12.5)" fill="url(#gToolsB)"/>
    <path d="M31 5a9 9 0 0 0-11.3 11.3L8 28l5 5 11.7-11.7A9 9 0 0 0 36 10l-6.3 6.3-4.5-4.5L31 5z" fill="url(#gToolsA)"/>
    <path d="M10 27l3 3-1.5 1.5-3-3z" fill="#4B5964"/>
    <path d="M31 5.5a8.9 8.9 0 0 0-9.7 2l1 1a7.5 7.5 0 0 1 7.7-1.9z" fill="#fff" opacity=".35"/>
  </svg>`,
  training: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gTrainA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8CEBB2"/><stop offset="1" stop-color="#2E8A5B"/>
      </linearGradient>
      <linearGradient id="gTrainB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F3FDF6"/><stop offset="1" stop-color="#DDF3E4"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <path d="M24 6 4 15l20 9 20-9-20-9z" fill="url(#gTrainA)"/>
    <path d="M4 15l20 9v9L4 24z" fill="#237049" opacity=".3"/>
    <path d="M13 20.5v9.8c0 3.4 5 6.2 11 6.2s11-2.8 11-6.2v-9.8l-11 5-11-5z" fill="url(#gTrainB)"/>
    <path d="M42 16v11.5" stroke="#2E8A5B" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="42" cy="29.5" r="2" fill="#2E8A5B"/>
    <path d="M24 6.9 6.3 15l1.4.6L24 8.6z" fill="#fff" opacity=".4"/>
  </svg>`,
  services: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gServA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#DCB7F2"/><stop offset="1" stop-color="#7A4FA3"/>
      </linearGradient>
      <linearGradient id="gServB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FBF2FF"/><stop offset="1" stop-color="#F0E3F8"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <path d="M6 26c5-11 31-11 36 0l-3 2c-4.5-9-25.5-9-30 0z" fill="url(#gServA)"/>
    <circle cx="13" cy="31" r="7" fill="url(#gServA)"/>
    <circle cx="35" cy="31" r="7" fill="url(#gServB)"/>
    <path d="M20 31h8" stroke="#7A4FA3" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M9 27.5a6.9 6.9 0 0 1 6-3.4v1.4a5.5 5.5 0 0 0-4.8 2.7z" fill="#fff" opacity=".4"/>
  </svg>`,
  about: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gAboutA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#BCA8F0"/><stop offset="1" stop-color="#4B3F7A"/>
      </linearGradient>
      <linearGradient id="gAboutB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F2EEFB"/><stop offset="1" stop-color="#E7E2F3"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#1E2F40" opacity=".1"/>
    <path d="M8 41c0-8.8 7.2-15.5 16-15.5S40 32.2 40 41z" fill="url(#gAboutB)"/>
    <circle cx="24" cy="15" r="10" fill="url(#gAboutA)"/>
    <path d="M15.5 10.5A10 10 0 0 1 24 5v2a8 8 0 0 0-6.8 3.9z" fill="#fff" opacity=".35"/>
  </svg>`,
};

const CONTENT = {
  lessons: [
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
      url: 'tools/text-to-numbers/', icon: ICONS.numbersApp },
    { id: 'tool-invoice-generator', title_ar: 'مولّد الفواتير', title_en: 'Invoice Generator',
      desc_ar: 'أنشئ فاتورة احترافية مع شعار، توقيع، ضريبة، وتحويل المبلغ إلى حروف — بثلاث لغات.',
      desc_en: 'Generate a professional invoice with logo, signature, VAT, and amount-in-words — in three languages.',
      url: 'https://drmerabti.github.io/dr/invoice-generator/', external: true, icon: ICONS.invoiceApp },
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
      title_ar: 'تدريب شامل في وورد',
      title_en: 'Complete Word Training',
      desc_ar: '5 مستويات، 30 سؤال لكل مستوى (اختصارات ومعلومات عامة)، بصعوبة تصاعدية.',
      desc_en: '5 levels, 30 questions each (shortcuts and general knowledge), increasing difficulty.',
      url: 'trainings/word-training/',
      icon: ICONS.wordApp,
    },
    // لإضافة اختبار جديد (Excel, Word, إعلام آلي...) أضف كائنًا هنا بنفس الشكل:
    // { id:'training-excel-1', title_ar:'اختبار: أساسيات إكسل', title_en:'Quiz: Excel basics',
    //   desc_ar:'وصف الاختبار.', desc_en:'Quiz description.' },
  ],
};

/* ============ أيقونات SVG (ستايل شبه ثلاثي الأبعاد: ظلال + انعكاسات ضوء) ============ */
const SECTIONS = [
  { key: 'lessons',   icon: ICONS.lessons,  badge: 'badge-lessons',   href: 'lessons.html' },
  { key: 'apps',      icon: ICONS.apps,     badge: 'badge-apps',      href: 'apps.html' },
  { key: 'tools',     icon: ICONS.tools,    badge: 'badge-tools',     href: 'tools.html' },
  { key: 'trainings', icon: ICONS.training, badge: 'badge-training',  href: 'resources.html' },
  { key: 'services',  icon: ICONS.services, badge: 'badge-services',  href: 'services.html' },
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
    if (item.url){
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
        ${item.icon ? `<span class="icon-badge badge-${key}">${item.icon}</span>` : ''}
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
    trainings: 'resources.html', services: 'services.html',
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
   AUTH (Firebase — Google + Email/Password)
===================================================================== */
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
      ? `<img class="auth-avatar-img" src="${user.picture}" alt="">${'<span>' + (user.name || user.email) + '</span>'}`
      : `<span class="auth-avatar">${initial}</span><span>${user.name || user.email}</span>`;
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

function initAuth(){
  const wrap = document.getElementById('authWrap');
  const btn = document.getElementById('authBtn');
  const menu = document.getElementById('authMenu');
  if (!wrap || !btn || !menu) return;

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
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
    });
  } else {
    renderAuth();
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
