// ============================================================
// بيانات دروس "أتمتة إكسل بلغة VBA: من الصفر إلى الاحتراف"
// ------------------------------------------------------------
// كل درس = كائن واحد في المصفوفة أدناه، بالحقول التالية:
//
//   title        : عنوان الدرس (بالعربية)
//   title_en     : (اختياري) العنوان بالإنجليزية عند تبديل اللغة
//   youtubeUrl   : رابط فيديو يوتيوب كما تنسخه من المتصفح، أو المعرّف وحده — كلها مقبولة:
//                    'https://www.youtube.com/watch?v=AbC123xYz_0'
//                    'https://youtu.be/AbC123xYz_0'
//                    'https://www.youtube.com/embed/AbC123xYz_0'
//                    'AbC123xYz_0'
//                  المعرّف يُستخرج تلقائيًا. اتركه '' فيظهر مكان الفيديو "الفيديو قريبًا".
//                  (الحقل القديم youtubeId ما يزال مدعومًا أيضًا)
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
  // ================= الدرس 1 =================
  // 👇 رابط الفيديو: الصق رابط يوتيوب كاملًا بين علامتي '' في السطر youtubeUrl أدناه
  //    (يقبل youtube.com/watch?v=... أو youtu.be/... أو youtube.com/embed/... أو المعرّف وحده)
  // 👇 الأكواد: كل كود عنصر { title: '...', code: `...` } داخل codes
  {
    title: 'نموذج إدراج بيانات شخصية (UserForm)',
    title_en: 'Personal Data Entry Form (UserForm)',
    youtubeUrl: 'https://youtu.be/TsVqQ0XoOzo', // ← رابط فيديو يوتيوب للدرس 1
    description:
      'افتح محرر VBA بالضغط على Alt + F11، ثم أدرج نموذجًا جديدًا من Insert ← UserForm وسمِّه frmData من نافذة الخصائص.\n' +
      'انقر مرتين على النموذج والصق "كود النموذج" كاملًا: ينشئ الحقول والأزرار تلقائيًا من عناوين ورقة Data (وينشئ الورقة إن لم تكن موجودة).\n' +
      'أدرج وحدة جديدة من Insert ← Module والصق فيها ماكرو OpenForm الذي يفتح النموذج.\n' +
      'الأزرار: Insert لحفظ السجل في أول سطر فارغ، ‎+ Add Field لإضافة حقل جديد، Delete Field لحذف حقل وبياناته، Clear للمسح، Close للإغلاق.\n' +
      'احفظ الملف بصيغة .xlsm، ثم اربط الماكرو OpenForm بزر على الورقة لفتح النموذج بضغطة واحدة.',
    description_en:
      'Open the VBA editor with Alt + F11, insert a new form from Insert → UserForm and name it frmData in the Properties window.\n' +
      'Double-click the form and paste the whole "form code": it builds the fields and buttons automatically from the headers of the Data sheet (and creates the sheet if missing).\n' +
      'Insert a new module from Insert → Module and paste the OpenForm macro that opens the form.\n' +
      'Buttons: Insert saves the record to the first empty row, + Add Field adds a new field, Delete Field removes a field and its data, Clear empties the fields, Close closes the form.\n' +
      'Save the workbook as .xlsm, then assign the OpenForm macro to a button on the sheet to open the form in one click.',
    codes: [
      {
        title: 'كود النموذج frmData',
        code: `Option Explicit
Private ws As Worksheet
Private n As Long
Private WithEvents bIns As MSForms.CommandButton
Private WithEvents bAdd As MSForms.CommandButton
Private WithEvents bDel As MSForms.CommandButton
Private WithEvents bClear As MSForms.CommandButton
Private WithEvents bClose As MSForms.CommandButton
Private hdr As MSForms.Label

Private Const TOP0 As Single = 75
Private Const ROWH As Single = 40

Private Sub UserForm_Initialize()
    Dim c As Range
    On Error Resume Next
    Set ws = ThisWorkbook.Sheets("Data")
    On Error GoTo 0
    If ws Is Nothing Then
        Set ws = ThisWorkbook.Sheets.Add
        ws.Name = "Data"
    End If
    If ws.Range("A1").Value = "" Then
        ws.Range("A1:E1").Value = Array("First Name", "Last Name", "Age", "Date of Birth", "Place of Birth")
    End If

    Me.Caption = "Data Entry"
    Me.BackColor = RGB(248, 250, 253)
    Me.Width = 480

    Set hdr = Me.Controls.Add("Forms.Label.1")
    With hdr
        .Caption = "   Personal Information"
        .Left = 0: .Top = 0: .Width = 480: .Height = 50
        .BackColor = RGB(21, 101, 192): .ForeColor = vbWhite
        .Font.Name = "Segoe UI": .Font.Size = 16: .Font.Bold = True
        .TextAlign = fmTextAlignLeft
    End With

    Set bIns = MakeBtn("Insert", RGB(46, 125, 50))
    Set bAdd = MakeBtn("+ Add Field", RGB(21, 101, 192))
    Set bDel = MakeBtn("Delete Field", RGB(198, 40, 40))
    Set bClear = MakeBtn("Clear", RGB(245, 124, 0))
    Set bClose = MakeBtn("Close", RGB(117, 117, 117))

    For Each c In ws.Range(ws.Cells(1, 1), ws.Cells(1, ws.Columns.Count).End(xlToLeft))
        AddField CStr(c.Value)
    Next
    FormatHeader
End Sub

Private Function MakeBtn(cap As String, col As Long) As MSForms.CommandButton
    Set MakeBtn = Me.Controls.Add("Forms.CommandButton.1")
    With MakeBtn
        .Caption = cap: .Width = 84: .Height = 32
        .BackColor = col: .ForeColor = vbWhite
        .Font.Name = "Segoe UI": .Font.Size = 10: .Font.Bold = True
    End With
End Function

Private Sub AddField(ByVal cap As String)
    Dim t As Single
    n = n + 1
    t = TOP0 + (n - 1) * ROWH
    With Me.Controls.Add("Forms.Label.1", "lbl" & n)
        .Caption = cap
        .Left = 25: .Top = t + 5: .Width = 130: .Height = 22
        .Font.Name = "Segoe UI": .Font.Size = 11: .Font.Bold = True
        .ForeColor = RGB(55, 71, 79): .BackStyle = fmBackStyleTransparent
    End With
    With Me.Controls.Add("Forms.TextBox.1", "txt" & n)
        .Left = 160: .Top = t: .Width = 280: .Height = 28
        .Font.Name = "Segoe UI": .Font.Size = 11
        .SpecialEffect = fmSpecialEffectFlat
        .BorderStyle = fmBorderStyleSingle
        .BorderColor = RGB(176, 190, 197)
    End With
    Arrange
End Sub

Private Sub Arrange()
    Dim t As Single
    t = TOP0 + n * ROWH + 15
    bIns.Top = t: bIns.Left = 20
    bAdd.Top = t: bAdd.Left = 108
    bDel.Top = t: bDel.Left = 196
    bClear.Top = t: bClear.Left = 284
    bClose.Top = t: bClose.Left = 372
    Me.Height = t + 75
End Sub

Private Sub FormatHeader()
    If n = 0 Then Exit Sub
    With ws.Range(ws.Cells(1, 1), ws.Cells(1, n))
        .Font.Bold = True: .Font.Color = vbWhite
        .Interior.Color = RGB(21, 101, 192)
        .HorizontalAlignment = xlCenter
    End With
    ws.Columns.AutoFit
End Sub

Private Sub bIns_Click()
    Dim r As Long, i As Long, v As String
    If Trim(Me.Controls("txt1").Value) = "" Then
        MsgBox "Please fill the first field.", vbExclamation: Exit Sub
    End If
    r = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
    For i = 1 To n
        v = Me.Controls("txt" & i).Value
        If InStr(1, ws.Cells(1, i).Value, "Date", vbTextCompare) > 0 And IsDate(v) Then
            ws.Cells(r, i).Value = CDate(v)
            ws.Cells(r, i).NumberFormat = "dd/mm/yyyy"
        Else
            ws.Cells(r, i).Value = v
        End If
    Next
    ws.Range(ws.Cells(r, 1), ws.Cells(r, n)).Borders.LineStyle = xlContinuous
    ws.Columns.AutoFit
    ClearAll
    MsgBox "Record added successfully.", vbInformation
End Sub

Private Sub ClearAll()
    Dim i As Long
    For i = 1 To n
        Me.Controls("txt" & i).Value = ""
    Next
    If n > 0 Then Me.Controls("txt1").SetFocus
End Sub

Private Sub bClear_Click()
    ClearAll
End Sub

Private Sub bAdd_Click()
    Dim s As String
    s = Trim(InputBox("New field name:", "Add Field"))
    If s = "" Then Exit Sub
    ws.Cells(1, n + 1).Value = s
    AddField s
    FormatHeader
End Sub

Private Sub bDel_Click()
    Dim i As Long, s As String, k As Variant
    If n <= 1 Then MsgBox "At least one field is required.", vbExclamation: Exit Sub
    For i = 1 To n
        s = s & i & " - " & ws.Cells(1, i).Value & vbCrLf
    Next
    k = InputBox("Enter the number of the field to delete:" & vbCrLf & vbCrLf & s, "Delete Field")
    If Not IsNumeric(k) Then Exit Sub
    k = CLng(k)
    If k < 1 Or k > n Then MsgBox "Invalid number.", vbExclamation: Exit Sub
    If MsgBox("Delete field """ & ws.Cells(1, k).Value & """ and all its data?", _
              vbYesNo + vbQuestion, "Confirm") = vbNo Then Exit Sub
    ws.Columns(k).Delete
    Rebuild
End Sub

Private Sub Rebuild()
    Dim i As Long, c As Range
    For i = n To 1 Step -1
        Me.Controls.Remove "lbl" & i
        Me.Controls.Remove "txt" & i
    Next
    n = 0
    For Each c In ws.Range(ws.Cells(1, 1), ws.Cells(1, ws.Columns.Count).End(xlToLeft))
        AddField CStr(c.Value)
    Next
    FormatHeader
End Sub

Private Sub bClose_Click()
    Unload Me
End Sub`,
      },
      {
        title: 'كود فتح النموذج (Module)',
        code: `Sub OpenForm()
    frmData.Show
End Sub`,
      },
    ],
    fileUrl: '', // ← ضع هنا رابط ملف .xlsm للدرس 1
    locked: false,
  },
  {
    title: 'مدخل إلى محرر VBA وتسجيل الماكرو',
    title_en: 'Introduction to the VBA Editor and Recording Macros',
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 2
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 3
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 4
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 5
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 6
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 7
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 8
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 9
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
    youtubeUrl: '', // ← رابط فيديو يوتيوب للدرس 10
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
