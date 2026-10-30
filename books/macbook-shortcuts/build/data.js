// Book content. A row: [keys, function, options]
//   keys: tokens separated by spaces; "|" separates alternatives ("أو").
//   options: { star: true } (one of the 5 key shortcuts of the chapter),
//            { tag: 'Tahoe' } (differs between macOS versions, one word)
// A group may end with { alert: '...' } — a note in the alert colour.

const BOOK = {
  title: 'كل اختصارات ماكبوك',
  sub: 'في مكان واحد',
  author: 'د. سفيان مرابطي',
};

const OTHER_BOOKS = [
  { cover: 'covers/word.jpg',            title: 'حتى لو كنت من قوم ثمود ستفهم برنامج وورد' },
  { cover: 'covers/excel-vba.jpg',       title: 'الإبداع مع Excel VBA' },
  { cover: 'covers/excel-functions.jpg', title: 'موسوعة دوال إكسل – الجزء 1' },
  { cover: 'covers/excel-shortcuts.jpg', title: 'الفأرة أكلها القط — كل اختصارات إكسل' },
  { cover: 'covers/word-shortcuts.jpg',  title: 'دليل اختصارات برنامج وورد' },
  { cover: 'covers/research.jpg',        title: 'من الفكرة إلى النشر — منهجية البحث العلمي' },
  { cover: 'covers/python.jpg',          title: 'برمجة بايثون كأن لم تعرفها من قبل' },
  { cover: 'covers/computer.jpg',        title: 'كل ما يعرفه المحترفون عن الحاسوب' },
  { cover: 'covers/english-claudio.jpg', title: 'تعلم الإنجليزية مع Claudio' },
];
const BOOKS_URL = 'https://merabti.com/books.html';

const SOCIAL = [
  { name: 'Facebook',  url: 'https://facebook.com/DrMerabti',              show: 'facebook.com/DrMerabti' },
  { name: 'Instagram', url: 'https://instagram.com/DrMerabti',             show: 'instagram.com/DrMerabti' },
  { name: 'YouTube',   url: 'https://youtube.com/mrmerabti',               show: 'youtube.com/mrmerabti' },
  { name: 'TikTok',    url: 'https://tiktok.com/@drmerabti',               show: 'tiktok.com/@drmerabti' },
  { name: 'Threads',   url: 'https://threads.com/@drmerabti',              show: 'threads.com/@drmerabti' },
  { name: 'LinkedIn',  url: 'https://linkedin.com/in/soufiane-merabti',    show: 'linkedin.com/in/soufiane-merabti' },
  { name: 'الموقع',    url: 'https://merabti.com',                         show: 'merabti.com', site: true },
];

// built: false → listed in the contents, not yet written (sample only)
const CHAPTERS = [
  { n: 1,  title: 'تعرّف على لوحة مفاتيح الماك ورموزها', key: 'cmd', built: false },
  { n: 2,  title: 'اختصارات النظام الأساسية', key: 'cmd', built: true, groups: [
    { title: 'النسخ واللصق والتراجع', rows: [
      ['cmd C', 'نسخ', { star: true }],
      ['cmd X', 'قص'],
      ['cmd V', 'لصق', { star: true }],
      ['opt shift cmd V', 'لصق بتنسيق المكان'],
      ['cmd Z', 'تراجع', { star: true }],
      ['shift cmd Z', 'إعادة ما تراجعت عنه'],
      ['cmd A', 'تحديد الكل'],
    ]},
    { title: 'المستندات', rows: [
      ['cmd N', 'مستند أو نافذة جديدة'],
      ['cmd O', 'فتح ملف'],
      ['cmd S', 'حفظ', { star: true }],
      ['cmd P', 'طباعة'],
      ['cmd F', 'بحث'],
      ['cmd G', 'البحث عن النتيجة التالية'],
    ]},
    { title: 'التطبيقات والنوافذ', rows: [
      ['cmd W', 'إغلاق النافذة الأمامية'],
      ['cmd Q', 'إنهاء التطبيق'],
      ['opt cmd esc', 'فرض إنهاء تطبيق عالق', { star: true }],
      ['cmd H', 'إخفاء التطبيق'],
      ['opt cmd H', 'إخفاء كل التطبيقات الأخرى'],
      ['cmd M', 'تصغير النافذة إلى Dock'],
      ['cmd ,', 'إعدادات التطبيق'],
      ['ctrl cmd space', 'الرموز والإيموجي'],
    ]},
    { title: 'القفل والسكون والإيقاف', rows: [
      ['ctrl cmd Q', 'قفل الشاشة'],
      ['shift cmd Q', 'تسجيل الخروج مع التأكيد'],
      ['opt shift cmd Q', 'تسجيل الخروج فورًا'],
      ['ctrl shift power', 'إطفاء الشاشة فقط'],
      ['opt cmd power', 'وضع السكون'],
      ['ctrl cmd power', 'إعادة تشغيل إجبارية دون حفظ'],
      ['ctrl opt cmd power', 'إغلاق التطبيقات ثم الإيقاف'],
    ], alert: 'في لوحات المفاتيح القديمة يقوم مفتاح الإخراج ⏏ مقام زر التشغيل.' },
  ]},
  { n: 3,  title: 'لقطات الشاشة والتسجيل', key: 'shift', built: false },
  { n: 4,  title: 'Finder والملفات', key: 'cmd', built: false },
  { n: 5,  title: 'التحكم في النوافذ والتطبيقات', key: 'tab', built: false },
  { n: 6,  title: 'Spotlight و Mission Control و Launchpad', key: 'space', built: false },
  { n: 7,  title: 'تحرير النصوص والتنقل فيها', key: 'opt', built: false },
  { n: 8,  title: 'Safari', key: 'cmd', built: false },
  { n: 9,  title: 'Pages و Numbers و Keynote', key: 'cmd', built: false },
  { n: 10, title: 'Word و Excel و PowerPoint على الماك', key: 'cmd', built: false },
  { n: 11, title: 'إيماءات لوحة اللمس Trackpad', key: 'cmd', built: false },
  { n: 12, title: 'بطاقات ملخص قابلة للطباعة', key: 'cmd', built: false },
];
