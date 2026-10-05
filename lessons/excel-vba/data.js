// ============================================================
// بيانات دروس "أتمتة إكسل بلغة VBA: من الصفر إلى الاحتراف"
// ------------------------------------------------------------
// كل درس = كائن واحد في المصفوفة أدناه، بالحقول التالية:
//
//   title        : عنوان الدرس (بالعربية)
//   title_en     : (اختياري) العنوان بالإنجليزية عند تبديل اللغة
//   youtubeId    : معرّف فيديو يوتيوب فقط، وليس الرابط كاملًا
//                  مثال: https://www.youtube.com/watch?v=AbC123xYz  ←  youtubeId: 'AbC123xYz'
//                  اتركه '' فيظهر مكان الفيديو "الفيديو قريبًا".
//   description  : شرح مختصر لخطوات الدرس (كل سطر جديد \n يظهر كخطوة مستقلة)
//   description_en : (اختياري) الشرح بالإنجليزية
//   codes        : قائمة الأكواد، كل كود له عنوان خاص:
//                  codes: [
//                    { title: 'كود زر الحفظ', code: `Private Sub btnSave_Click()
//                        ' ...
//                    End Sub` },
//                    { title: 'كود زر المسح', code: `...` }
//                  ]
//                  اكتب الكود بين علامتي ` (الموجودة تحت مفتاح Esc) حتى يبقى على عدة أسطر كما هو.
//                  اتركها [] فتظهر رسالة "لا توجد أكواد بعد".
//   fileUrl      : رابط ملف التطبيق .xlsm (مثال: 'files/lesson-01.xlsm' داخل هذا المجلد)
//                  اتركه '' فيختفي زر التحميل تلقائيًا.
//   locked       : true = الدرس مقفل بشارة "قريبًا" لكل الزوار، ومفتوح للأدمن فقط.
//                  اجعله false عند نشر الدرس.
// ============================================================

const VBA_LESSONS = [
  {
    title: 'نموذج إدراج بيانات شخصية (UserForm)',
    title_en: 'Personal Data Entry Form (UserForm)',
    youtubeId: '', // ← ضع هنا معرّف فيديو يوتيوب للدرس 1
    description:
      'افتح محرر VBA بالضغط على Alt + F11 ثم أدرج نموذجًا جديدًا من Insert ← UserForm.\n' +
      'أضف مربعات النص (TextBox) للاسم واللقب وتاريخ الميلاد والهاتف، وقائمة منسدلة (ComboBox) للجنس.\n' +
      'أضف زر "حفظ" يكتب البيانات في أول سطر فارغ في ورقة قاعدة البيانات، وزر "مسح" لتفريغ الحقول.\n' +
      'أضف التحقق من الحقول الإجبارية قبل الحفظ، ثم اربط النموذج بزر على الورقة لفتحه بضغطة واحدة.',
    description_en:
      'Open the VBA editor with Alt + F11, then insert a new form from Insert → UserForm.\n' +
      'Add TextBoxes for first name, last name, birth date and phone, and a ComboBox for gender.\n' +
      'Add a "Save" button that writes the data to the first empty row of the database sheet, and a "Clear" button to empty the fields.\n' +
      'Validate required fields before saving, then link the form to a button on the sheet to open it in one click.',
    codes: [
      // ← أضف أكواد الدرس 1 هنا، مثال:
      // { title: 'كود زر الحفظ', code: `Private Sub btnSave_Click()
      //     ...
      // End Sub` },
    ],
    fileUrl: '', // ← ضع هنا رابط ملف .xlsm للدرس 1
    locked: false,
  },
  {
    title: 'مدخل إلى محرر VBA وتسجيل الماكرو',
    title_en: 'Introduction to the VBA Editor and Recording Macros',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 2
    description:
      'تفعيل تبويب المطور (Developer) وحفظ الملف بصيغة .xlsm.\n' +
      'تسجيل ماكرو بسيط ثم قراءة الكود الناتج داخل محرر VBA.\n' +
      'التعرف على نوافذ المحرر: المشروع، الخصائص، والوحدات (Modules).',
    description_en:
      'Enable the Developer tab and save the workbook as .xlsm.\n' +
      'Record a simple macro, then read the generated code in the VBA editor.\n' +
      'Get to know the editor windows: Project, Properties and Modules.',
    codes: [ /* ← أكواد الدرس 2 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 2
    locked: true,
  },
  {
    title: 'المتغيرات والشروط والحلقات',
    title_en: 'Variables, Conditions and Loops',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 3
    description:
      'تعريف المتغيرات بأنواعها (Dim … As) وأهمية Option Explicit.\n' +
      'كتابة الشروط بـ If … Then … Else و Select Case.\n' +
      'تكرار العمليات على الخلايا بحلقات For و For Each و Do While.',
    description_en:
      'Declaring typed variables (Dim … As) and why Option Explicit matters.\n' +
      'Writing conditions with If … Then … Else and Select Case.\n' +
      'Looping over cells with For, For Each and Do While.',
    codes: [ /* ← أكواد الدرس 3 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 3
    locked: true,
  },
  {
    title: 'البحث والتعديل والحذف في قاعدة بيانات إكسل',
    title_en: 'Search, Edit and Delete in an Excel Database',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 4
    description:
      'البحث عن سجل برقم أو اسم باستخدام Range.Find.\n' +
      'تحميل بيانات السجل في النموذج لتعديلها ثم حفظ التعديل في نفس السطر.\n' +
      'حذف السجل بعد رسالة تأكيد.',
    description_en:
      'Find a record by ID or name with Range.Find.\n' +
      'Load the record into the form, edit it, then save it back to the same row.\n' +
      'Delete the record after a confirmation message.',
    codes: [ /* ← أكواد الدرس 4 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 4
    locked: true,
  },
  {
    title: 'إنشاء فاتورة تلقائية وترقيمها',
    title_en: 'Automatic Invoice Creation and Numbering',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 5
    description:
      'تصميم قالب الفاتورة وتوليد رقم تسلسلي تلقائي لكل فاتورة جديدة.\n' +
      'حفظ الفاتورة في سجل الفواتير ثم تفريغ القالب لفاتورة جديدة.',
    description_en:
      'Design the invoice template and generate an automatic serial number for each new invoice.\n' +
      'Save the invoice to the invoice log, then clear the template for the next one.',
    codes: [ /* ← أكواد الدرس 5 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 5
    locked: true,
  },
  {
    title: 'تصدير الأوراق إلى PDF بضغطة زر',
    title_en: 'Export Sheets to PDF with One Click',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 6
    description:
      'تصدير الورقة الحالية أو مجموعة أوراق إلى PDF باستخدام ExportAsFixedFormat.\n' +
      'تسمية الملف تلقائيًا بالتاريخ أو برقم الفاتورة وحفظه في مجلد محدد.',
    description_en:
      'Export the active sheet or a group of sheets to PDF with ExportAsFixedFormat.\n' +
      'Name the file automatically by date or invoice number and save it to a chosen folder.',
    codes: [ /* ← أكواد الدرس 6 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 6
    locked: true,
  },
  {
    title: 'دمج عدة ملفات إكسل في ملف واحد',
    title_en: 'Merge Multiple Excel Files into One',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 7
    description:
      'اختيار مجلد وقراءة كل ملفات إكسل داخله باستخدام Dir.\n' +
      'نسخ بيانات كل ملف إلى ورقة واحدة مجمّعة دون تكرار العناوين.',
    description_en:
      'Pick a folder and read every Excel file inside it with Dir.\n' +
      'Copy each file’s data into one combined sheet without repeating headers.',
    codes: [ /* ← أكواد الدرس 7 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 7
    locked: true,
  },
  {
    title: 'إرسال بريد إلكتروني من إكسل عبر Outlook',
    title_en: 'Send Emails from Excel via Outlook',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 8
    description:
      'إنشاء رسالة Outlook من إكسل وتعبئة المرسل إليه والموضوع والنص.\n' +
      'إرفاق ملف (مثل فاتورة PDF) وإرسال رسائل متعددة من قائمة عناوين.',
    description_en:
      'Create an Outlook message from Excel and fill in the recipient, subject and body.\n' +
      'Attach a file (such as a PDF invoice) and send multiple emails from an address list.',
    codes: [ /* ← أكواد الدرس 8 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 8
    locked: true,
  },
  {
    title: 'شاشة تسجيل دخول بكلمة مرور',
    title_en: 'Password Login Screen',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 9
    description:
      'تصميم نموذج تسجيل دخول باسم مستخدم وكلمة مرور عند فتح الملف.\n' +
      'إخفاء الأوراق حتى نجاح الدخول، وتحديد عدد المحاولات المسموح بها.',
    description_en:
      'Build a username/password login form that opens with the workbook.\n' +
      'Hide the sheets until login succeeds and limit the number of attempts.',
    codes: [ /* ← أكواد الدرس 9 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 9
    locked: true,
  },
  {
    title: 'قوائم منسدلة مترابطة بالكود',
    title_en: 'Dependent Drop-down Lists with Code',
    youtubeId: '', // ← معرّف فيديو يوتيوب للدرس 10
    description:
      'تعبئة قائمة منسدلة أولى من ورقة البيانات تلقائيًا.\n' +
      'تحديث القائمة الثانية حسب اختيار الأولى (مثل: الولاية ← البلدية).',
    description_en:
      'Fill a first drop-down list automatically from the data sheet.\n' +
      'Update the second list based on the first choice (e.g. province → town).',
    codes: [ /* ← أكواد الدرس 10 */ ],
    fileUrl: '', // ← ملف .xlsm للدرس 10
    locked: true,
  },
];
