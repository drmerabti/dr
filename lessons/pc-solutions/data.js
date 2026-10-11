// ============================================================
// بيانات دروس "حلول عملية للحاسوب"
// ------------------------------------------------------------
// كل درس = كائن واحد في المصفوفة أدناه، بالحقول التالية:
//
//   title        : عنوان الدرس (بالعربية)
//   title_en     : (اختياري) العنوان بالإنجليزية عند تبديل اللغة
//   youtubeUrl   : رابط فيديو يوتيوب كما تنسخه من المتصفح، أو المعرّف وحده — كلها مقبولة:
//                    'https://www.youtube.com/watch?v=AbC123xYz_0'
//                    'https://youtu.be/AbC123xYz_0'
//                    'AbC123xYz_0'
//                  اتركه '' فيظهر مكان الفيديو "الفيديو قريبًا".
//   fileUrl      : رابط الملف المضغوط للتحميل، والملفات في المجلد downloads/pc-solutions/ بجذر الموقع
//                  (مثال: '../../downloads/pc-solutions/PC-Phone.zip').
//                  اتركه '' فيختفي زر "تحميل الملفات" تلقائيًا. حجم الملف يُقرأ تلقائيًا ويظهر بجانب الزر.
//   fileSize     : (اختياري) حجم الملف كما يُكتب بجانب الزر (مثال: '24 KB') إن أردت تثبيته يدويًا.
//   note         : (اختياري) ملاحظة قصيرة تحت زر التحميل (كل سطر جديد \n يظهر كنقطة مستقلة)
//   note_en      : (اختياري) الملاحظة بالإنجليزية
//   description  : (اختياري) شرح مختصر يظهر في بطاقة الدرس المقفل
//   locked       : true = الدرس مقفل بشارة "قريبًا" لكل الزوار، ومفتوح للأدمن فقط.
//                  اجعله false عند نشر الدرس.
// ============================================================

const PC_LESSONS = [
  // ================= الدرس 1 =================
  {
    title: 'نقل الملفات بين الهاتف والحاسوب بدون إنترنت',
    title_en: 'Transfer files between your phone and PC without internet',
    youtubeUrl: 'https://youtu.be/mZ6YX5SfcFQ', // ← رابط فيديو يوتيوب للدرس 1
    fileUrl: '../../downloads/pc-solutions/PC-Phone.zip', // ← الملف المضغوط (server.ps1 + Start-Server.bat)
    note: 'يجب أن يكون الحاسوب والهاتف متصلين بنفس الراوتر.\n' +
          'فك الضغط عن الملف، ثم شغّل Start-Server.bat\n' +
          'إذا ظهر تحذير ويندوز اضغط More info ثم Run anyway، واقبل صلاحية المسؤول.\n' +
          'اكتب في متصفح الهاتف العنوان الذي يظهر في النافذة السوداء.',
    note_en: 'The PC and the phone must be connected to the same router.\n' +
             'Unzip the file, then run Start-Server.bat\n' +
             'If a Windows warning appears, click More info, then Run anyway, and accept the administrator prompt.\n' +
             'Type the address shown in the black window into your phone’s browser.',
    locked: false,
  },

  // ================= الدرس 2 =================
  {
    title: 'احذف فيروسات الفلاش USB نهائياً بدون أي برنامج',
    title_en: 'Remove USB flash drive viruses for good, without any software',
    youtubeUrl: 'https://www.youtube.com/embed/K62Ngal9Zlw', fileUrl: '', locked: false,
  },

  // ================= الدرس 3 =================
  {
    title: 'تنظيف الحاسوب من الفيروسات وإصلاح النظام واسترجاع الملفات المفقودة',
    title_en: 'Clean your PC of viruses, repair the system and recover lost files',
    youtubeUrl: 'https://www.youtube.com/embed/KV9XPHBCHMg', fileUrl: '', locked: false,
  },

  // ================= الدرس 4 =================
  {
    title: 'كيفية قراءة الملفات بدون فتحها',
    title_en: 'How to read files without opening them',
    youtubeUrl: 'https://www.youtube.com/embed/aQ0E6iW_eRg', fileUrl: '', locked: false,
  },

  // ================= الدرس 5 =================
  {
    title: 'معرفة الأجهزة المتصلة بشبكة الواي فاي',
    title_en: 'See which devices are connected to your Wi-Fi',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 6 =================
  {
    title: 'فتح الحاسوب بالهاتف عن بعد',
    title_en: 'Control your PC remotely from your phone',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 7 =================
  {
    title: 'حماية مجلد بكلمة سر',
    title_en: 'Protect a folder with a password',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 8 =================
  {
    title: 'تحويل الهاتف إلى كاميرا ويب',
    title_en: 'Turn your phone into a webcam',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 9 =================
  {
    title: 'معرفة سبب بطء الحاسوب',
    title_en: 'Find out why your PC is slow',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 10 =================
  {
    title: 'استعمال الحاسوب كشاشة ثانية',
    title_en: 'Use a computer as a second screen',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 11 =================
  {
    title: 'إصلاح فلاشة لا تفتح',
    title_en: 'Fix a USB flash drive that won’t open',
    youtubeUrl: '', fileUrl: '', locked: true,
  },

  // ================= الدرس 12 =================
  {
    title: 'نقل البرامج والملفات إلى حاسوب جديد',
    title_en: 'Move your programs and files to a new PC',
    youtubeUrl: '', fileUrl: '', locked: true,
  },
];
