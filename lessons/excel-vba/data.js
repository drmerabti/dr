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
//
// ⚠ عند إضافة درس جديد: يأخذ مكان أول درس وهمي مقفل (locked: true) ويُحذف ذلك الدرس،
//   فيبقى عدد الدروس 10.
// ⚠ بعد أي تعديل في هذا الملف غيّر رقم الإصدار ?v=... في index.html (سطر data.js)
//   حتى لا يعرض المتصفح النسخة القديمة المحفوظة.
// ============================================================

const VBA_LESSONS = [
  // ================= الدرس 1 =================
  // 👇 رابط الفيديو: الصق رابط يوتيوب كاملًا بين علامتي '' في السطر youtubeUrl أدناه
  //    (يقبل youtube.com/watch?v=... أو youtu.be/... أو youtube.com/embed/... أو المعرّف وحده)
  // 👇 الأكواد: كل كود عنصر { title: '...', code: `...` } داخل codes
  {
    title: 'نموذج إدراج بيانات شخصية (UserForm)',
    title_en: 'Personal Data Entry Form (UserForm)',
    youtubeUrl: 'https://youtu.be/nKCF6_tTffQ', // ← رابط فيديو يوتيوب للدرس 1
    description:
      'افتح محرر VBA بالضغط على Alt + F11، ثم أدرج نموذجًا جديدًا من Insert ← UserForm وسمِّه frmData من نافذة الخصائص.\n' +
      'انقر مرتين على النموذج والصق "كود النموذج" كاملًا: ينشئ الحقول والأزرار تلقائيًا من عناوين ورقة Data (وينشئ الورقة إن لم تكن موجودة).\n' +
      'أدرج وحدة جديدة من Insert ← Module والصق فيها ماكرو OpenForm الذي يفتح النموذج.\n' +
      'أدرج وحدة كلاس من Insert ← Class Module وسمِّها clsTxt (بنفس الاسم تمامًا)، ثم الصق فيها كود الكلاس: يجعل زر Backspace في حقل فارغ يمسح كل الحقول.\n' +
      'الأزرار: Insert (أو Enter) يحفظ السجل في أول سطر فارغ ويلوّنه بالأصفر مع صوت تنبيه خفيف، ‎+ Add Field لإضافة حقل، Delete Field لحذف حقل وبياناته، Clear للمسح، Close للإغلاق، وزر M يفتح موقع merabti.com.\n' +
      'احفظ الملف بصيغة .xlsm، ثم اربط الماكرو OpenForm بزر على الورقة لفتح النموذج بضغطة واحدة.',
    description_en:
      'Open the VBA editor with Alt + F11, insert a new form from Insert → UserForm and name it frmData in the Properties window.\n' +
      'Double-click the form and paste the whole "form code": it builds the fields and buttons automatically from the headers of the Data sheet (and creates the sheet if missing).\n' +
      'Insert a new module from Insert → Module and paste the OpenForm macro that opens the form.\n' +
      'Insert a class module from Insert → Class Module, name it exactly clsTxt, and paste the class code: pressing Backspace in an empty field clears all fields.\n' +
      'Buttons: Insert (or Enter) saves the record to the first empty row, highlights it in yellow and plays a soft sound; + Add Field adds a field, Delete Field removes a field and its data, Clear empties the fields, Close closes the form, and the M button opens merabti.com.\n' +
      'Save the workbook as .xlsm, then assign the OpenForm macro to a button on the sheet to open the form in one click.',
    codes: [
      {
        title: 'كود النموذج frmData',
        code: `Option Explicit

#If VBA7 Then
    Private Declare PtrSafe Function PlaySound Lib "winmm.dll" Alias "PlaySoundA" _
        (ByVal pszSound As String, ByVal hmod As LongPtr, ByVal fdwSound As Long) As Long
#Else
    Private Declare Function PlaySound Lib "winmm.dll" Alias "PlaySoundA" _
        (ByVal pszSound As String, ByVal hmod As Long, ByVal fdwSound As Long) As Long
#End If

Private ws As Worksheet
Private n As Long
Private tbs As Collection
Private WithEvents bIns As MSForms.CommandButton
Private WithEvents bAdd As MSForms.CommandButton
Private WithEvents bDel As MSForms.CommandButton
Private WithEvents bClear As MSForms.CommandButton
Private WithEvents bClose As MSForms.CommandButton
Private WithEvents lnk As MSForms.CommandButton
Private hdr As MSForms.Label

Private Const TOP0 As Single = 75
Private Const ROWH As Single = 40
Private Const SND_ASYNC As Long = &H1
Private Const SND_NODEFAULT As Long = &H2
Private Const SND_FILENAME As Long = &H20000

Private Sub UserForm_Initialize()
    Dim c As Range
    Set tbs = New Collection
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

    Set lnk = Me.Controls.Add("Forms.CommandButton.1")
    With lnk
        .Caption = "M"
        .Left = 425: .Top = 7: .Width = 36: .Height = 36
        .BackColor = vbWhite
        .ForeColor = RGB(21, 101, 192)
        .Font.Name = "Segoe UI": .Font.Size = 18: .Font.Bold = True
        .ControlTipText = "merabti.com"
        .TakeFocusOnClick = False
        .TabStop = False
    End With

    Set bIns = MakeBtn("Insert", RGB(46, 125, 50))
    bIns.Default = True
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
    Dim h As clsTxt
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
    Set h = New clsTxt
    Set h.tb = Me.Controls("txt" & n)
    Set h.Frm = Me
    tbs.Add h
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
End Sub

Private Sub SoftSound()
    Dim f As String
    f = Environ("windir") & "\\Media\\Windows Navigation Start.wav"
    If Dir(f) <> "" Then
        PlaySound f, 0, SND_FILENAME Or SND_ASYNC Or SND_NODEFAULT
    End If
End Sub

Private Sub lnk_Click()
    On Error Resume Next
    ThisWorkbook.FollowHyperlink "https://merabti.com"
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

    If r > 2 Then ws.Range(ws.Cells(2, 1), ws.Cells(r - 1, n)).Interior.Pattern = xlNone
    ws.Range(ws.Cells(r, 1), ws.Cells(r, n)).Interior.Color = RGB(255, 243, 156)

    SoftSound
    ClearAll
End Sub

Public Sub ClearAll()
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
    Set tbs = New Collection
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
      {
        title: 'كلاس clsTxt (Class Module)',
        code: `Option Explicit
Public WithEvents tb As MSForms.TextBox
Public Frm As Object

Private Sub tb_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    If KeyCode = vbKeyBack And tb.Text = "" Then
        KeyCode = 0
        Frm.ClearAll
    End If
End Sub`,
      },
    ],
    fileUrl: '', // ← ضع هنا رابط ملف .xlsm للدرس 1
    locked: false,
  },
  // ================= الدرس 2 =================
  {
    title: 'إنشاء QR Code في Excel باستخدام VBA',
    title_en: 'Create a QR Code in Excel with VBA',
    youtubeUrl: 'https://youtu.be/wLoZpjCq95c', // ← رابط فيديو يوتيوب للدرس 2
    description:
      'افتح محرر VBA بالضغط على Alt + F11، ثم أدرج نموذجًا جديدًا من Insert ← UserForm وسمِّه frmQR (بنفس الاسم تمامًا) من نافذة الخصائص.\n' +
      'انقر مرتين على النموذج والصق "كود النموذج frmQR" كاملًا: ينشئ الواجهة تلقائيًا (حقل البيانات، الألوان، النمط، وزرَّي Generate و Close).\n' +
      'أدرج وحدة جديدة من Insert ← Module والصق فيها "كود الوحدة": يحتوي محرك QR كاملًا يعمل دون إنترنت، وماكرو OpenQR لفتح النموذج، وماكرو CreateQRButton لإنشاء زر أنيق على الورقة.\n' +
      'شغّل الماكرو CreateQRButton مرة واحدة (Alt + F8) فيظهر زر "QR Code" بجانب الخلية النشطة ومربوطًا بـ OpenQR.\n' +
      'حدّد الخلايا التي تحتوي البيانات ثم اضغط الزر (أو Use selection)، اختر اللون والنمط (Dots أو Rounded)، ثم Generate وانقر الخلية التي سيوضع فيها الرمز.\n' +
      'يُرسم الرمز كمجموعة أشكال باسم QR_ + عنوان الخلية ويتوسّط الخلية (أو الخلايا المدمجة)، ويُستبدل تلقائيًا عند إعادة التوليد في الخلية نفسها. الحد الأقصى نحو 200 حرف، والنص العربي مدعوم (UTF-8).\n' +
      'احفظ الملف بصيغة .xlsm.',
    description_en:
      'Open the VBA editor with Alt + F11, insert a new form from Insert → UserForm and name it exactly frmQR in the Properties window.\n' +
      'Double-click the form and paste the whole "frmQR form code": it builds the interface automatically (data box, colors, style, Generate and Close buttons).\n' +
      'Insert a new module from Insert → Module and paste the "module code": a complete offline QR engine, the OpenQR macro that opens the form, and the CreateQRButton macro that adds a styled button to the sheet.\n' +
      'Run CreateQRButton once (Alt + F8): a "QR Code" button appears next to the active cell, linked to OpenQR.\n' +
      'Select the cells that hold the data, click the button (or Use selection), pick a color and a style (Dots or Rounded), then Generate and click the target cell.\n' +
      'The code is drawn as a shape group named QR_ + the cell address, centred in the cell (or merged cells), and replaced automatically when regenerated in the same cell. Up to about 200 characters; Arabic text is supported (UTF-8).\n' +
      'Save the workbook as .xlsm.',
    codes: [
      {
        title: 'كود النموذج frmQR',
        code: `Option Explicit
Private WithEvents bGen As MSForms.CommandButton
Private WithEvents bClose As MSForms.CommandButton
Private WithEvents bSel As MSForms.CommandButton
Private WithEvents sDots As MSForms.CommandButton
Private WithEvents sRound As MSForms.CommandButton
Private WithEvents c1 As MSForms.Label
Private WithEvents c2 As MSForms.Label
Private WithEvents c3 As MSForms.Label
Private WithEvents c4 As MSForms.Label
Private WithEvents c5 As MSForms.Label
Private sw(1 To 5) As MSForms.Label
Private txtData As MSForms.TextBox
Private lblStatus As MSForms.Label
Private selClr As Long, selSty As Long

Private Sub UserForm_Initialize()
    Dim cols As Variant, i As Long
    Me.Caption = "QR Code Generator"
    Me.Width = 424: Me.Height = 322
    Me.BackColor = RGB(248, 250, 252)

    Lbl "", 0, 0, 424, 58, RGB(37, 99, 235)
    Lbl ChrW(&H25A6), 16, 9, 40, 40, -1, RGB(255, 255, 255), 26, True, "Segoe UI Symbol"
    Lbl "QR Code Generator", 58, 10, 320, 24, -1, RGB(255, 255, 255), 15, True
    Lbl "Offline  " & ChrW(&H2022) & "  Fast  " & ChrW(&H2022) & "  Beautiful", 59, 34, 320, 16, -1, RGB(191, 219, 254), 9, False, "Segoe UI Symbol"

    Lbl "DATA", 18, 72, 100, 14, -1, RGB(100, 116, 139), 8, True
    Set bSel = Btn(ChrW(&H21BB) & "  Use selection", 290, 67, 112, 20, RGB(226, 232, 240), RGB(51, 65, 85), 8.5)
    Set txtData = Me.Controls.Add("Forms.TextBox.1")
    With txtData
        .Left = 18: .Top = 88: .Width = 384: .Height = 62
        .MultiLine = True: .EnterKeyBehavior = True: .WordWrap = True
        .ScrollBars = fmScrollBarsVertical
        .Font.Name = "Segoe UI": .Font.Size = 10
        .BackColor = RGB(241, 245, 249)
        .SpecialEffect = fmSpecialEffectFlat
        .BorderStyle = fmBorderStyleSingle: .BorderColor = RGB(203, 213, 225)
    End With

    Lbl "COLOR", 18, 162, 100, 14, -1, RGB(100, 116, 139), 8, True
    cols = Array(RGB(17, 24, 39), RGB(37, 99, 235), RGB(22, 163, 74), RGB(124, 58, 237), RGB(220, 38, 38))
    For i = 1 To 5
        Set sw(i) = Lbl("", 18 + (i - 1) * 34, 178, 26, 26, CLng(cols(i - 1)), RGB(255, 255, 255), 13, True, "Segoe UI Symbol")
        sw(i).TextAlign = fmTextAlignCenter
        sw(i).Tag = CStr(cols(i - 1))
    Next
    Set c1 = sw(1): Set c2 = sw(2): Set c3 = sw(3): Set c4 = sw(4): Set c5 = sw(5)

    Lbl "STYLE", 206, 162, 100, 14, -1, RGB(100, 116, 139), 8, True
    Set sDots = Btn(ChrW(&H25CF) & "  Dots", 206, 178, 94, 26, RGB(226, 232, 240), RGB(51, 65, 85), 9.5)
    Set sRound = Btn(ChrW(&H25A2) & "  Rounded", 306, 178, 96, 26, RGB(226, 232, 240), RGB(51, 65, 85), 9.5)

    Set bGen = Btn(ChrW(&H2714) & "  Generate", 18, 224, 272, 38, RGB(22, 163, 74), RGB(255, 255, 255), 12)
    Set bClose = Btn(ChrW(&H2716) & "  Close", 298, 224, 104, 38, RGB(100, 116, 139), RGB(255, 255, 255), 11)

    Set lblStatus = Lbl("Ready", 18, 270, 384, 16, -1, RGB(100, 116, 139), 9, False, "Segoe UI Symbol")

    PickColor 1
    PickStyle 1
    LoadSel
End Sub

Private Function Lbl(ByVal cap As String, ByVal l As Single, ByVal t As Single, ByVal w As Single, ByVal h As Single, _
        Optional ByVal back As Long = -1, Optional ByVal fore As Long = 0, Optional ByVal fs As Single = 9, _
        Optional ByVal bold As Boolean = False, Optional ByVal fnt As String = "Segoe UI") As MSForms.Label
    Dim o As MSForms.Label
    Set o = Me.Controls.Add("Forms.Label.1")
    With o
        .Caption = cap: .Left = l: .Top = t: .Width = w: .Height = h
        If back = -1 Then .BackStyle = fmBackStyleTransparent Else .BackColor = back
        .ForeColor = fore
        .Font.Name = fnt: .Font.Size = fs: .Font.Bold = bold
    End With
    Set Lbl = o
End Function

Private Function Btn(ByVal cap As String, ByVal l As Single, ByVal t As Single, ByVal w As Single, ByVal h As Single, _
        ByVal back As Long, ByVal fore As Long, ByVal fs As Single) As MSForms.CommandButton
    Dim o As MSForms.CommandButton
    Set o = Me.Controls.Add("Forms.CommandButton.1")
    With o
        .Caption = cap: .Left = l: .Top = t: .Width = w: .Height = h
        .BackColor = back: .ForeColor = fore
        .Font.Name = "Segoe UI Symbol": .Font.Size = fs: .Font.Bold = True
        .TakeFocusOnClick = False
    End With
    Set Btn = o
End Function

Private Sub PickColor(ByVal k As Long)
    Dim i As Long
    For i = 1 To 5
        If i = k Then sw(i).Caption = ChrW(&H2714) Else sw(i).Caption = ""
    Next
    selClr = CLng(sw(k).Tag)
End Sub

Private Sub PickStyle(ByVal k As Long)
    selSty = k
    StyleBtn sDots, (k = 1)
    StyleBtn sRound, (k = 2)
End Sub

Private Sub StyleBtn(b As MSForms.CommandButton, ByVal act As Boolean)
    If act Then
        b.BackColor = RGB(37, 99, 235): b.ForeColor = RGB(255, 255, 255)
    Else
        b.BackColor = RGB(226, 232, 240): b.ForeColor = RGB(51, 65, 85)
    End If
End Sub

Private Sub LoadSel()
    Dim r As Range, c As Range, s As String, v As String, n As Long
    If TypeName(Selection) <> "Range" Then Exit Sub
    Set r = Intersect(Selection, ActiveSheet.UsedRange)
    If r Is Nothing Then Exit Sub
    For Each c In r.Cells
        v = c.Text
        If Left$(v, 1) = "#" And Not IsError(c.Value) Then v = CStr(c.Value)
        If Len(Trim$(v)) > 0 Then
            If Len(s) > 0 Then s = s & vbCrLf
            s = s & v
            n = n + 1
        End If
    Next
    txtData.Text = s
    lblStatus.Caption = n & " cell(s) loaded"
End Sub

Private Sub c1_Click()
    PickColor 1
End Sub
Private Sub c2_Click()
    PickColor 2
End Sub
Private Sub c3_Click()
    PickColor 3
End Sub
Private Sub c4_Click()
    PickColor 4
End Sub
Private Sub c5_Click()
    PickColor 5
End Sub
Private Sub sDots_Click()
    PickStyle 1
End Sub
Private Sub sRound_Click()
    PickStyle 2
End Sub
Private Sub bSel_Click()
    LoadSel
End Sub
Private Sub bClose_Click()
    Unload Me
End Sub

Private Sub bGen_Click()
    Dim t As String, r As Range, msg As String
    t = Replace(txtData.Text, vbCr, "")
    If Len(Trim$(t)) = 0 Then
        lblStatus.Caption = "Please select cells with data first."
        Exit Sub
    End If
    On Error Resume Next
    Set r = Application.InputBox("Click the cell where the QR code will be placed:", "Target Cell", Type:=8)
    On Error GoTo 0
    If r Is Nothing Then Exit Sub
    lblStatus.Caption = "Generating..."
    DoEvents
    msg = DrawQR(t, r.Cells(1, 1), selClr, selSty)
    If msg = "" Then
        lblStatus.Caption = ChrW(&H2714) & "  QR code created in " & r.Cells(1, 1).Address(False, False)
    Else
        lblStatus.Caption = msg
    End If
End Sub`,
      },
      {
        title: 'كود الوحدة: محرك QR وفتح النموذج (Module)',
        code: `Option Explicit
Private M() As Boolean, F() As Boolean
Private QN As Long, QV As Long
Private Bits() As Long, BN As Long

' ================= Open & Button =================
Public Sub OpenQR()
    frmQR.Show vbModeless
End Sub

Public Sub CreateQRButton()
    Dim s As Shape
    Set s = ActiveSheet.Shapes.AddShape(5, ActiveCell.Left + 4, ActiveCell.Top + 4, 160, 42)
    With s
        .Name = "btnQR_" & Format(Now, "hhnnss")
        .Adjustments(1) = 0.35
        .Fill.ForeColor.RGB = RGB(37, 99, 235)
        .Line.Visible = False
        With .Shadow
            .Visible = True
            .ForeColor.RGB = RGB(0, 0, 0)
            .OffsetX = 0: .OffsetY = 2
            .Blur = 5: .Transparency = 0.65
        End With
        With .TextFrame2
            .VerticalAnchor = msoAnchorMiddle
            With .TextRange
                .Text = ChrW(&H25A6) & "  QR Code"
                .Font.Name = "Segoe UI Symbol"
                .Font.Size = 13
                .Font.Bold = msoTrue
                .Font.Fill.ForeColor.RGB = RGB(255, 255, 255)
                .ParagraphFormat.Alignment = msoAlignCenter
            End With
        End With
        .OnAction = "OpenQR"
    End With
End Sub

' ================= Drawing =================
Public Function DrawQR(ByVal txt As String, ByVal tgt As Range, ByVal clr As Long, ByVal sty As Long) As String
    Dim ws As Worksheet, c As Range, nm() As Variant, cnt As Long, pfx As String
    Dim sz As Double, md As Double, x0 As Double, y0 As Double, ox As Double, oy As Double
    Dim x As Long, y As Long, g As Shape, gname As String

    If Not BuildQR(txt) Then
        DrawQR = "Text is too long (max about 200 characters).": Exit Function
    End If
    Set c = tgt.Cells(1, 1).MergeArea
    Set ws = c.Worksheet
    gname = "QR_" & c.Cells(1, 1).Address(False, False)
    On Error Resume Next
    ws.Shapes(gname).Delete
    On Error GoTo Fail

    sz = c.Width: If c.Height < sz Then sz = c.Height
    sz = sz - 4
    If sz < 60 Then
        sz = 110: x0 = c.Left + 2: y0 = c.Top + 2
    Else
        x0 = c.Left + (c.Width - sz) / 2: y0 = c.Top + (c.Height - sz) / 2
    End If
    md = sz / (QN + 4)
    ox = x0 + 2 * md: oy = y0 + 2 * md
    pfx = "q" & Replace(CStr(Timer), ".", "") & "_"
    ReDim nm(0 To QN * QN + 20)

    Application.ScreenUpdating = False
    Set g = AddRR(ws, x0, y0, sz, RGB(255, 255, 255), 0.12, nm, cnt, pfx)
    g.Line.Visible = True
    g.Line.ForeColor.RGB = RGB(226, 232, 240)
    g.Line.Weight = 0.75

    For y = 0 To QN - 1
        For x = 0 To QN - 1
            If M(y, x) And Not InEye(x, y) Then
                If sty = 1 Then
                    AddDot ws, ox + x * md, oy + y * md, md, clr, nm, cnt, pfx
                Else
                    AddRR ws, ox + x * md + md * 0.04, oy + y * md + md * 0.04, md * 0.92, clr, 0.3, nm, cnt, pfx
                End If
            End If
        Next
    Next
    DrawEye ws, ox, oy, md, clr, nm, cnt, pfx
    DrawEye ws, ox + (QN - 7) * md, oy, md, clr, nm, cnt, pfx
    DrawEye ws, ox, oy + (QN - 7) * md, md, clr, nm, cnt, pfx

    ReDim Preserve nm(0 To cnt - 1)
    Set g = ws.Shapes.Range(nm).Group
    g.Name = gname
    g.LockAspectRatio = msoTrue
    g.Placement = xlMove
    Application.ScreenUpdating = True
    DrawQR = ""
    Exit Function
Fail:
    Application.ScreenUpdating = True
    DrawQR = "Error: " & Err.Description
End Function

Private Function AddRR(ws As Worksheet, ByVal l As Double, ByVal t As Double, ByVal w As Double, _
        ByVal clr As Long, ByVal adj As Single, nm() As Variant, cnt As Long, pfx As String) As Shape
    Dim s As Shape
    Set s = ws.Shapes.AddShape(5, l, t, w, w)
    s.Adjustments(1) = adj
    s.Fill.ForeColor.RGB = clr
    s.Line.Visible = False
    s.Name = pfx & cnt
    nm(cnt) = s.Name: cnt = cnt + 1
    Set AddRR = s
End Function

Private Sub AddDot(ws As Worksheet, ByVal l As Double, ByVal t As Double, ByVal md As Double, _
        ByVal clr As Long, nm() As Variant, cnt As Long, pfx As String)
    Dim s As Shape, g As Double
    g = md * 0.06
    Set s = ws.Shapes.AddShape(9, l + g, t + g, md - 2 * g, md - 2 * g)
    s.Fill.ForeColor.RGB = clr
    s.Line.Visible = False
    s.Name = pfx & cnt
    nm(cnt) = s.Name: cnt = cnt + 1
End Sub

Private Sub DrawEye(ws As Worksheet, ByVal l As Double, ByVal t As Double, ByVal md As Double, _
        ByVal clr As Long, nm() As Variant, cnt As Long, pfx As String)
    AddRR ws, l, t, 7 * md, clr, 0.3, nm, cnt, pfx
    AddRR ws, l + md, t + md, 5 * md, RGB(255, 255, 255), 0.25, nm, cnt, pfx
    AddRR ws, l + 2 * md, t + 2 * md, 3 * md, clr, 0.3, nm, cnt, pfx
End Sub

Private Function InEye(ByVal x As Long, ByVal y As Long) As Boolean
    InEye = (x < 7 And y < 7) Or (x >= QN - 7 And y < 7) Or (x < 7 And y >= QN - 7)
End Function

' ================= QR Engine (Byte mode, EC level M, v1-10) =================
Private Function TblBlocks(ByVal v As Long) As Long
    TblBlocks = Choose(v, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5)
End Function
Private Function TblEcc(ByVal v As Long) As Long
    TblEcc = Choose(v, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26)
End Function
Private Function TblTotal(ByVal v As Long) As Long
    TblTotal = Choose(v, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346)
End Function
Private Function TblAlign(ByVal v As Long) As Variant
    Select Case v
        Case 1: TblAlign = Array()
        Case 2: TblAlign = Array(6, 18)
        Case 3: TblAlign = Array(6, 22)
        Case 4: TblAlign = Array(6, 26)
        Case 5: TblAlign = Array(6, 30)
        Case 6: TblAlign = Array(6, 34)
        Case 7: TblAlign = Array(6, 22, 38)
        Case 8: TblAlign = Array(6, 24, 42)
        Case 9: TblAlign = Array(6, 26, 46)
        Case 10: TblAlign = Array(6, 28, 50)
    End Select
End Function

Private Function BuildQR(ByVal txt As String) As Boolean
    Dim b() As Long, nb As Long, v As Long, dataCW As Long, cc As Long
    Dim i As Long, j As Long, k As Long, t As Long, x As Long, nd As Long, pd As Long
    Dim dat() As Long, nBlk As Long, eccLen As Long, total As Long, nShort As Long, shortLen As Long
    Dim dv() As Long, seg() As Long, ecc() As Long, blk() As Long, cw() As Long, dl As Long, off As Long, p As Long
    Dim msk As Long, best As Long, pn As Long, minP As Long

    b = Utf8(txt): nb = UBound(b) + 1
    For v = 1 To 10
        dataCW = TblTotal(v) - TblBlocks(v) * TblEcc(v)
        If v < 10 Then cc = 8 Else cc = 16
        If 4 + cc + 8 * nb <= dataCW * 8 Then Exit For
    Next
    If v > 10 Then Exit Function
    QV = v

    BN = 0: ReDim Bits(1 To dataCW * 8)
    AddBits 4, 4
    AddBits nb, cc
    For i = 0 To nb - 1
        AddBits b(i), 8
    Next
    t = dataCW * 8 - BN: If t > 4 Then t = 4
    AddBits 0, t
    Do While BN Mod 8 <> 0
        AddBits 0, 1
    Loop
    ReDim dat(0 To dataCW - 1)
    nd = BN \\ 8
    For i = 0 To nd - 1
        x = 0
        For j = 1 To 8
            x = x * 2 + Bits(i * 8 + j)
        Next
        dat(i) = x
    Next
    pd = &HEC
    For i = nd To dataCW - 1
        dat(i) = pd
        If pd = &HEC Then pd = &H11 Else pd = &HEC
    Next

    nBlk = TblBlocks(QV): eccLen = TblEcc(QV): total = TblTotal(QV)
    nShort = nBlk - total Mod nBlk
    shortLen = total \\ nBlk
    dv = RSDivisor(eccLen)
    ReDim blk(0 To nBlk - 1, 0 To shortLen)
    k = 0
    For i = 0 To nBlk - 1
        If i < nShort Then dl = shortLen - eccLen Else dl = shortLen - eccLen + 1
        ReDim seg(0 To dl - 1)
        For j = 0 To dl - 1
            seg(j) = dat(k + j)
            blk(i, j) = seg(j)
        Next
        k = k + dl
        ecc = RSRemainder(seg, dv)
        If i < nShort Then off = dl + 1 Else off = dl
        For j = 0 To eccLen - 1
            blk(i, off + j) = ecc(j)
        Next
    Next
    ReDim cw(0 To total - 1): p = 0
    For j = 0 To shortLen
        For i = 0 To nBlk - 1
            If j <> shortLen - eccLen Or i >= nShort Then
                cw(p) = blk(i, j): p = p + 1
            End If
        Next
    Next

    QN = QV * 4 + 17
    ReDim M(0 To QN - 1, 0 To QN - 1)
    ReDim F(0 To QN - 1, 0 To QN - 1)
    DrawFunctions
    DrawCodewords cw
    minP = 2147483647
    For msk = 0 To 7
        ApplyMask msk
        DrawFormat msk
        pn = Penalty()
        If pn < minP Then minP = pn: best = msk
        ApplyMask msk
    Next
    ApplyMask best
    DrawFormat best
    BuildQR = True
End Function

Private Sub AddBits(ByVal v As Long, ByVal cnt As Long)
    Dim i As Long
    For i = cnt - 1 To 0 Step -1
        BN = BN + 1
        Bits(BN) = (v \\ 2 ^ i) And 1
    Next
End Sub

Private Function Utf8(ByVal s As String) As Long()
    Dim r() As Long, cnt As Long, i As Long, c As Long, c2 As Long
    ReDim r(0 To Len(s) * 4)
    i = 1
    Do While i <= Len(s)
        c = AscW(Mid$(s, i, 1)) And &HFFFF&
        If c >= &HD800& And c <= &HDBFF& And i < Len(s) Then
            c2 = AscW(Mid$(s, i + 1, 1)) And &HFFFF&
            c = &H10000 + (c - &HD800&) * &H400& + (c2 - &HDC00&)
            i = i + 1
        End If
        If c < &H80& Then
            r(cnt) = c: cnt = cnt + 1
        ElseIf c < &H800& Then
            r(cnt) = &HC0& Or (c \\ 64)
            r(cnt + 1) = &H80& Or (c And 63&)
            cnt = cnt + 2
        ElseIf c < &H10000 Then
            r(cnt) = &HE0& Or (c \\ 4096)
            r(cnt + 1) = &H80& Or ((c \\ 64) And 63&)
            r(cnt + 2) = &H80& Or (c And 63&)
            cnt = cnt + 3
        Else
            r(cnt) = &HF0& Or (c \\ 262144)
            r(cnt + 1) = &H80& Or ((c \\ 4096) And 63&)
            r(cnt + 2) = &H80& Or ((c \\ 64) And 63&)
            r(cnt + 3) = &H80& Or (c And 63&)
            cnt = cnt + 4
        End If
        i = i + 1
    Loop
    ReDim Preserve r(0 To cnt - 1)
    Utf8 = r
End Function

Private Function GMul(ByVal x As Long, ByVal y As Long) As Long
    Dim z As Long, i As Long
    For i = 7 To 0 Step -1
        z = (z * 2) Xor ((z \\ 128) * &H11D)
        z = z Xor (((y \\ 2 ^ i) And 1) * x)
    Next
    GMul = z
End Function

Private Function RSDivisor(ByVal deg As Long) As Long()
    Dim r() As Long, i As Long, j As Long, rt As Long
    ReDim r(0 To deg - 1)
    r(deg - 1) = 1
    rt = 1
    For i = 1 To deg
        For j = 0 To deg - 1
            r(j) = GMul(r(j), rt)
            If j + 1 < deg Then r(j) = r(j) Xor r(j + 1)
        Next
        rt = GMul(rt, 2)
    Next
    RSDivisor = r
End Function

Private Function RSRemainder(d() As Long, dv() As Long) As Long()
    Dim r() As Long, cnt As Long, i As Long, j As Long, f As Long
    cnt = UBound(dv) + 1
    ReDim r(0 To cnt - 1)
    For i = 0 To UBound(d)
        f = d(i) Xor r(0)
        For j = 0 To cnt - 2
            r(j) = r(j + 1)
        Next
        r(cnt - 1) = 0
        For j = 0 To cnt - 1
            r(j) = r(j) Xor GMul(dv(j), f)
        Next
    Next
    RSRemainder = r
End Function

Private Sub SetF(ByVal x As Long, ByVal y As Long, ByVal dark As Boolean)
    M(y, x) = dark: F(y, x) = True
End Sub

Private Function GB(ByVal x As Long, ByVal i As Long) As Boolean
    GB = ((x \\ 2 ^ i) And 1) <> 0
End Function

Private Sub DrawFunctions()
    Dim i As Long, j As Long, a As Variant, na As Long
    For i = 0 To QN - 1
        SetF 6, i, (i Mod 2 = 0)
        SetF i, 6, (i Mod 2 = 0)
    Next
    Finder 3, 3: Finder QN - 4, 3: Finder 3, QN - 4
    a = TblAlign(QV): na = UBound(a) + 1
    For i = 0 To na - 1
        For j = 0 To na - 1
            If Not ((i = 0 And j = 0) Or (i = 0 And j = na - 1) Or (i = na - 1 And j = 0)) Then
                AlignPat a(i), a(j)
            End If
        Next
    Next
    DrawFormat 0
    DrawVersion
End Sub

Private Sub Finder(ByVal cx As Long, ByVal cy As Long)
    Dim dx As Long, dy As Long, d As Long, xx As Long, yy As Long
    For dy = -4 To 4
        For dx = -4 To 4
            d = Abs(dx): If Abs(dy) > d Then d = Abs(dy)
            xx = cx + dx: yy = cy + dy
            If xx >= 0 And xx < QN And yy >= 0 And yy < QN Then SetF xx, yy, (d <> 2 And d <> 4)
        Next
    Next
End Sub

Private Sub AlignPat(ByVal cx As Long, ByVal cy As Long)
    Dim dx As Long, dy As Long, d As Long
    For dy = -2 To 2
        For dx = -2 To 2
            d = Abs(dx): If Abs(dy) > d Then d = Abs(dy)
            SetF cx + dx, cy + dy, (d <> 1)
        Next
    Next
End Sub

Private Sub DrawFormat(ByVal msk As Long)
    Dim dat As Long, r As Long, i As Long, bts As Long
    dat = msk
    r = dat
    For i = 1 To 10
        r = (r * 2) Xor ((r \\ 512) * &H537)
    Next
    bts = ((dat * 1024) Or r) Xor &H5412
    For i = 0 To 5
        SetF 8, i, GB(bts, i)
    Next
    SetF 8, 7, GB(bts, 6)
    SetF 8, 8, GB(bts, 7)
    SetF 7, 8, GB(bts, 8)
    For i = 9 To 14
        SetF 14 - i, 8, GB(bts, i)
    Next
    For i = 0 To 7
        SetF QN - 1 - i, 8, GB(bts, i)
    Next
    For i = 8 To 14
        SetF 8, QN - 15 + i, GB(bts, i)
    Next
    SetF 8, QN - 8, True
End Sub

Private Sub DrawVersion()
    Dim r As Long, i As Long, bts As Long, bt As Boolean, a As Long, b As Long
    If QV < 7 Then Exit Sub
    r = QV
    For i = 1 To 12
        r = (r * 2) Xor ((r \\ 2048) * &H1F25)
    Next
    bts = (QV * 4096) Or r
    For i = 0 To 17
        bt = GB(bts, i)
        a = QN - 11 + (i Mod 3)
        b = i \\ 3
        SetF a, b, bt
        SetF b, a, bt
    Next
End Sub

Private Sub DrawCodewords(cw() As Long)
    Dim i As Long, rt As Long, vert As Long, j As Long, x As Long, y As Long, up As Boolean, tot As Long
    tot = (UBound(cw) + 1) * 8
    rt = QN - 1
    Do While rt >= 1
        If rt = 6 Then rt = 5
        For vert = 0 To QN - 1
            For j = 0 To 1
                x = rt - j
                up = ((rt + 1) And 2) = 0
                If up Then y = QN - 1 - vert Else y = vert
                If Not F(y, x) And i < tot Then
                    M(y, x) = ((cw(i \\ 8) \\ 2 ^ (7 - (i Mod 8))) And 1) <> 0
                    i = i + 1
                End If
            Next
        Next
        rt = rt - 2
    Loop
End Sub

Private Sub ApplyMask(ByVal msk As Long)
    Dim x As Long, y As Long, inv As Boolean
    For y = 0 To QN - 1
        For x = 0 To QN - 1
            Select Case msk
                Case 0: inv = ((x + y) Mod 2 = 0)
                Case 1: inv = (y Mod 2 = 0)
                Case 2: inv = (x Mod 3 = 0)
                Case 3: inv = ((x + y) Mod 3 = 0)
                Case 4: inv = ((x \\ 3 + y \\ 2) Mod 2 = 0)
                Case 5: inv = ((x * y) Mod 2 + (x * y) Mod 3 = 0)
                Case 6: inv = (((x * y) Mod 2 + (x * y) Mod 3) Mod 2 = 0)
                Case 7: inv = (((x + y) Mod 2 + (x * y) Mod 3) Mod 2 = 0)
            End Select
            If inv And Not F(y, x) Then M(y, x) = Not M(y, x)
        Next
    Next
End Sub

Private Function Px(ByVal isRow As Long, ByVal a As Long, ByVal b As Long) As Boolean
    If isRow = 1 Then Px = M(a, b) Else Px = M(b, a)
End Function

Private Function PatAt(ByVal isRow As Long, ByVal a As Long, ByVal b As Long, ByVal pat As String) As Boolean
    Dim i As Long
    For i = 0 To 10
        If Px(isRow, a, b + i) <> (Mid$(pat, i + 1, 1) = "1") Then Exit Function
    Next
    PatAt = True
End Function

Private Function Penalty() As Long
    Dim p As Long, a As Long, b As Long, rl As Long, k As Long, dark As Long, isRow As Long
    For isRow = 0 To 1
        For a = 0 To QN - 1
            rl = 1
            For b = 1 To QN - 1
                If Px(isRow, a, b) = Px(isRow, a, b - 1) Then
                    rl = rl + 1
                Else
                    If rl >= 5 Then p = p + rl - 2
                    rl = 1
                End If
            Next
            If rl >= 5 Then p = p + rl - 2
            For b = 0 To QN - 11
                If PatAt(isRow, a, b, "10111010000") Or PatAt(isRow, a, b, "00001011101") Then p = p + 40
            Next
        Next
    Next
    For a = 0 To QN - 2
        For b = 0 To QN - 2
            If M(a, b) = M(a, b + 1) And M(a, b) = M(a + 1, b) And M(a, b) = M(a + 1, b + 1) Then p = p + 3
        Next
    Next
    For a = 0 To QN - 1
        For b = 0 To QN - 1
            If M(a, b) Then dark = dark + 1
        Next
    Next
    k = Int(Abs(dark * 100 / (QN * QN) - 50) / 5)
    Penalty = p + k * 10
End Function`,
      },
    ],
    fileUrl: 'files/lesson-02-qr-code.xlsm', // ← ملف .xlsm للدرس 2
    locked: false,
  },
  // ================= الدرس 3 =================
  {
    title: 'برنامج تسيير نقاط التلاميذ وكشوف النقاط',
    title_en: 'Student Grades & Report Cards Manager',
    youtubeUrl: 'https://youtu.be/TsVqQ0XoOzo', // ← رابط فيديو يوتيوب للدرس 3
    description:
      'افتح مصنفًا جديدًا واحفظه بصيغة .xlsm\n' +
      'اضغط Alt + F11 ثم Insert ← Module، والصق الكود الأول كاملًا\n' +
      'Insert ← UserForm، وغيّر (Name) إلى frmMain، ثم View Code والصق الكود الثاني\n' +
      'ضع المؤشر داخل BuildWorkbook واضغط F5\n' +
      'احفظ الملف وابدأ باستعمال البرنامج',
    description_en:
      'Open a new workbook and save it as .xlsm\n' +
      'Press Alt + F11, then Insert → Module, and paste the whole first code\n' +
      'Insert → UserForm, change (Name) to frmMain, then View Code and paste the second code\n' +
      'Place the cursor inside BuildWorkbook and press F5\n' +
      'Save the file and start using the program',
    codes: [
      {
        title: 'الكود الأول: Module (كل الكود)',
        code: `'==============================================================
'  STUDENT GRADES MANAGER  -  ALL THE CODE IN ONE MODULE
'  1) Insert > Module, paste everything below
'  2) Run BuildWorkbook once (F5)
'  Arabic texts are written with Unicode codes (see TX at the end),
'  so the code can be copied and pasted on any computer.
'  merabti.com
'==============================================================
Option Explicit

Public Const HDR_ROW As Long = 4            ' header row of the grades sheet
Public Const SITE_URL As String = "https://merabti.com"

' ---- Settings sheet rows (values are in column C) ----
Public Const R_SCHOOL As Long = 4
Public Const R_YEAR As Long = 5
Public Const R_TEACHER As Long = 6
Public Const R_SUBJECT As Long = 7
Public Const R_TERM As Long = 8
Public Const R_LEVEL As Long = 9
Public Const R_MAX As Long = 10
Public Const R_TESTS As Long = 11
Public Const R_COEF_CA As Long = 12
Public Const R_COEF_TESTS As Long = 13
Public Const R_COEF_EXAM As Long = 14
Public Const R_PASS As Long = 15

' ---- Remarks table on the Settings sheet (E = From, F = To, G = Remark) ----
Public Const REM_FIRST_ROW As Long = 4
Public Const REM_LAST_ROW As Long = 13
Public Const REM_COL As Long = 5

Public StartTab As Long                     ' tab opened by the main window

'##############################################################
'  PART 1  -  CORE
'##############################################################

' ---- Sheet names ----
Public Function SH_HOME() As String
    SH_HOME = TX("shHome")
End Function

Public Function SH_GR() As String
    SH_GR = TX("shGrades")
End Function

Public Function SH_SET() As String
    SH_SET = TX("shSettings")
End Function

Public Function SH_REP() As String
    SH_REP = TX("shReport")
End Function

Public Function SH_STAT() As String
    SH_STAT = TX("shStats")
End Function

' ---- Colors ----
Public Function ClrDark() As Long
    ClrDark = RGB(18, 38, 72)
End Function

Public Function ClrMain() As Long
    ClrMain = RGB(31, 58, 104)
End Function

Public Function ClrLight() As Long
    ClrLight = RGB(238, 243, 250)
End Function

Public Function ClrAccent() As Long
    ClrAccent = RGB(242, 169, 0)
End Function

' ---- Helpers ----
Public Function WsG() As Worksheet
    Set WsG = ThisWorkbook.Worksheets(SH_GR)
End Function

Public Function S(ByVal r As Long) As Variant
    S = ThisWorkbook.Worksheets(SH_SET).Cells(r, 3).Value
End Function

Public Function NumOr(ByVal v As Variant, ByVal def As Double) As Double
    If Len(v & "") > 0 And IsNumeric(v) Then NumOr = CDbl(v) Else NumOr = def
End Function

Public Function MaxScore() As Double
    MaxScore = NumOr(S(R_MAX), 20)
End Function

Public Function SheetExists(ByVal nm As String) As Boolean
    Dim ws As Worksheet
    On Error Resume Next
    Set ws = ThisWorkbook.Worksheets(nm)
    SheetExists = Not ws Is Nothing
End Function

' Column number of a header in the grades sheet (0 if not found)
Public Function ColOf(ByVal header As String) As Long
    Dim m As Variant
    m = Application.Match(header, WsG.Rows(HDR_ROW), 0)
    If IsError(m) Then ColOf = 0 Else ColOf = CLng(m)
End Function

Public Function LastRow() As Long
    Dim ws As Worksheet
    Set ws = WsG
    LastRow = ws.Cells(ws.Rows.Count, 3).End(xlUp).Row
    If LastRow < HDR_ROW Then LastRow = HDR_ROW
End Function

Public Function ClassOf(ByVal r As Long) As String
    ClassOf = Trim$(CStr(WsG.Cells(r, 2).Value))
End Function

Public Function TestHeader(ByVal i As Long) As String
    TestHeader = TX("hTest") & " " & i
End Function

Public Function CurrentTests() As Long
    Dim c As Long, n As Long
    For c = 1 To ColOf(TX("hRemark"))
        If WsG.Cells(HDR_ROW, c).Value Like TX("hTest") & " *" Then n = n + 1
    Next c
    CurrentTests = n
End Function

Public Function NextID() As Long
    Dim ws As Worksheet
    Set ws = WsG
    NextID = CLng(Application.Max(ws.Range(ws.Cells(HDR_ROW + 1, 1), ws.Cells(LastRow + 1, 1)))) + 1
End Function

' Builds a text from Unicode codes, e.g. U("0645 0645")
Public Function U(ByVal hexCodes As String) As String
    Dim p As Variant, out As String
    For Each p In Split(hexCodes, " ")
        If Len(p) > 0 Then out = out & ChrW(CLng("&H" & p))
    Next p
    U = out
End Function

' Accepts "12", "12.5" or "12,5". Empty text = valid empty score.
Public Function ParseScore(ByVal txt As String, ByRef result As Variant, ByVal maxV As Double) As Boolean
    Dim i As Long, ch As String, dots As Long
    txt = Replace(Trim$(txt), ",", ".")
    result = Empty
    If txt = "" Then ParseScore = True: Exit Function
    For i = 1 To Len(txt)
        ch = Mid$(txt, i, 1)
        If ch = "." Then
            dots = dots + 1
        ElseIf ch < "0" Or ch > "9" Then
            Exit Function
        End If
    Next i
    If dots > 1 Or txt = "." Then Exit Function
    result = Val(txt)
    ParseScore = (result >= 0 And result <= maxV)
End Function

Public Function ClassList() As Collection
    Dim col As New Collection, r As Long, v As String
    On Error Resume Next
    For r = HDR_ROW + 1 To LastRow
        v = ClassOf(r)
        If v <> "" Then col.Add v, v
    Next r
    On Error GoTo 0
    Set ClassList = col
End Function

Public Function CountClass(ByVal cls As String) As Long
    Dim r As Long
    For r = HDR_ROW + 1 To LastRow
        If ClassOf(r) = cls Then CountClass = CountClass + 1
    Next r
End Function

Public Sub FillClassCombo(cbo As Object, ByVal withAll As Boolean)
    Dim v As Variant
    cbo.Clear
    If withAll Then cbo.AddItem TX("all")
    For Each v In ClassList()
        cbo.AddItem v
    Next v
End Sub

' ---- Students ----
Public Function NameExists(ByVal cls As String, ByVal fullName As String) As Boolean
    Dim r As Long
    For r = HDR_ROW + 1 To LastRow
        If ClassOf(r) = cls Then
            If StrComp(Trim$(WsG.Cells(r, 3).Value & ""), Trim$(fullName), vbTextCompare) = 0 Then
                NameExists = True
                Exit Function
            End If
        End If
    Next r
End Function

Public Sub AddStudent(ByVal cls As String, ByVal fullName As String)
    Dim r As Long, id As Long
    id = NextID
    r = LastRow + 1
    With WsG
        .Cells(r, 1).Value = id
        .Cells(r, 2).Value = cls
        .Cells(r, 3).Value = fullName
    End With
End Sub

' ---- Average, remark and rank ----
Public Function CalcAverage(ByVal r As Long) As Variant
    Dim ws As Worksheet, cCA As Long, cEx As Long, c As Long
    Dim total As Double, sumW As Double, w As Double
    Dim tSum As Double, tCnt As Long, v As Variant

    Set ws = WsG
    cCA = ColOf(TX("hCA")): cEx = ColOf(TX("hExam"))

    v = ws.Cells(r, cCA).Value
    If Len(v & "") > 0 And IsNumeric(v) Then
        w = NumOr(S(R_COEF_CA), 1)
        total = total + CDbl(v) * w: sumW = sumW + w
    End If

    For c = cCA + 1 To cEx - 1
        v = ws.Cells(r, c).Value
        If Len(v & "") > 0 And IsNumeric(v) Then tSum = tSum + CDbl(v): tCnt = tCnt + 1
    Next c
    If tCnt > 0 Then
        w = NumOr(S(R_COEF_TESTS), 1)
        total = total + (tSum / tCnt) * w: sumW = sumW + w
    End If

    v = ws.Cells(r, cEx).Value
    If Len(v & "") > 0 And IsNumeric(v) Then
        w = NumOr(S(R_COEF_EXAM), 2)
        total = total + CDbl(v) * w: sumW = sumW + w
    End If

    If sumW > 0 Then CalcAverage = Round(total / sumW, 2) Else CalcAverage = Empty
End Function

' The remarks table is read from the settings sheet (sorted from highest to lowest)
Public Function RemarkFor(ByVal avg As Double) As String
    Dim ws As Worksheet, r As Long, a20 As Double
    Set ws = ThisWorkbook.Worksheets(SH_SET)
    a20 = avg * 20 / MaxScore()
    For r = REM_FIRST_ROW To REM_LAST_ROW
        If Len(ws.Cells(r, REM_COL).Value & "") > 0 Then
            If a20 >= ws.Cells(r, REM_COL).Value Then
                RemarkFor = ws.Cells(r, REM_COL + 2).Value
                Exit Function
            End If
        End If
    Next r
End Function

Public Sub RecalcAll()
    Dim ws As Worksheet, r As Long, r2 As Long, lr As Long, k As Long
    Dim cAvg As Long, cRank As Long, cRem As Long, avg As Variant

    Set ws = WsG
    lr = LastRow
    cAvg = ColOf(TX("hAvg")): cRank = ColOf(TX("hRank")): cRem = ColOf(TX("hRemark"))

    Application.ScreenUpdating = False
    Application.EnableEvents = False

    For r = HDR_ROW + 1 To lr
        avg = CalcAverage(r)
        ws.Cells(r, cAvg).Value = avg
        If IsEmpty(avg) Then
            ws.Cells(r, cRem).Value = ""
        Else
            ws.Cells(r, cRem).Value = RemarkFor(CDbl(avg))
        End If
    Next r

    ' Rank inside each class (equal averages = same rank)
    For r = HDR_ROW + 1 To lr
        If IsEmpty(ws.Cells(r, cAvg).Value) Then
            ws.Cells(r, cRank).Value = ""
        Else
            k = 1
            For r2 = HDR_ROW + 1 To lr
                If ClassOf(r2) = ClassOf(r) Then
                    If Not IsEmpty(ws.Cells(r2, cAvg).Value) Then
                        If ws.Cells(r2, cAvg).Value > ws.Cells(r, cAvg).Value Then k = k + 1
                    End If
                End If
            Next r2
            ws.Cells(r, cRank).Value = k
        End If
    Next r

    FormatDataRows

    Application.EnableEvents = True
    Application.ScreenUpdating = True
End Sub

' ---- Grades sheet design ----
Public Sub StyleGradesSheet()
    Dim ws As Worksheet, lc As Long, c As Long, h As String
    Set ws = WsG
    lc = ColOf(TX("hRemark"))

    For c = 1 To lc
        h = ws.Cells(HDR_ROW, c).Value
        With ws.Columns(c)
            Select Case h
                Case TX("hID")
                    .ColumnWidth = 7: .HorizontalAlignment = xlCenter: .NumberFormat = "0"
                Case TX("hClass")
                    .ColumnWidth = 11: .HorizontalAlignment = xlCenter
                Case TX("hName")
                    .ColumnWidth = 32: .HorizontalAlignment = xlRight: .ReadingOrder = xlRTL
                Case TX("hRank")
                    .ColumnWidth = 8: .HorizontalAlignment = xlCenter: .NumberFormat = "0"
                Case TX("hRemark")
                    .ColumnWidth = 42: .HorizontalAlignment = xlRight: .ReadingOrder = xlRTL
                Case Else
                    .ColumnWidth = 10: .HorizontalAlignment = xlCenter: .NumberFormat = "0.00"
            End Select
        End With
    Next c

    With ws.Range("A1")
        .Value = TX("gTitle")
        .Font.Size = 20: .Font.Bold = True: .Font.Color = ClrMain
    End With
    With ws.Range("A2")
        .Value = TX("gOutOf") & " " & MaxScore() & "   |   " & S(R_SUBJECT) & "   |   " & S(R_TERM)
        .Font.Size = 11: .Font.Color = RGB(110, 120, 115)
    End With
    ws.Range("A1:A2").HorizontalAlignment = xlRight
    ws.Range("A1:A2").ReadingOrder = xlRTL
    ws.Rows(1).RowHeight = 32

    ws.Range(ws.Cells(HDR_ROW, lc + 1), ws.Cells(HDR_ROW, lc + 12)).ClearFormats
    With ws.Range(ws.Cells(HDR_ROW, 1), ws.Cells(HDR_ROW, lc))
        .Interior.Color = ClrMain
        .Font.Color = vbWhite: .Font.Bold = True: .Font.Size = 11
        .HorizontalAlignment = xlCenter: .VerticalAlignment = xlCenter
        .RowHeight = 30
        .Borders.LineStyle = xlContinuous
        .Borders.Color = ClrDark
    End With

    FormatDataRows
End Sub

Public Sub FormatDataRows()
    Dim ws As Worksheet, lr As Long, lc As Long, r As Long, cAvg As Long
    Dim rng As Range, v As Variant, pass As Double, mx As Double

    Set ws = WsG
    lr = LastRow: lc = ColOf(TX("hRemark")): cAvg = ColOf(TX("hAvg"))
    If lr <= HDR_ROW Then Exit Sub
    mx = MaxScore()
    pass = NumOr(S(R_PASS), mx / 2)

    For r = HDR_ROW + 1 To lr
        Set rng = ws.Range(ws.Cells(r, 1), ws.Cells(r, lc))
        If (r - HDR_ROW) Mod 2 = 0 Then rng.Interior.Color = ClrLight Else rng.Interior.Color = vbWhite
        rng.Borders.LineStyle = xlContinuous
        rng.Borders.Color = RGB(205, 215, 232)
        rng.RowHeight = 22
        rng.VerticalAlignment = xlCenter

        v = ws.Cells(r, cAvg).Value
        With ws.Cells(r, cAvg).Font
            .Bold = True
            If IsEmpty(v) Then
                .Color = vbBlack
            ElseIf v < pass Then
                .Color = RGB(200, 30, 30)
            ElseIf v >= mx * 0.8 Then
                .Color = RGB(0, 135, 60)
            Else
                .Color = RGB(30, 70, 150)
            End If
        End With
    Next r
End Sub

' Adds or removes test columns (always placed before the exam column)
Public Sub RebuildTestColumns(ByVal n As Long)
    Dim ws As Worksheet, cur As Long, cEx As Long
    Set ws = WsG
    Application.EnableEvents = False
    cur = CurrentTests()
    Do While cur < n
        cEx = ColOf(TX("hExam"))
        ws.Columns(cEx).Insert Shift:=xlToRight
        cur = cur + 1
        ws.Cells(HDR_ROW, cEx).Value = TestHeader(cur)
    Loop
    Do While cur > n
        ws.Columns(ColOf(TestHeader(cur))).Delete
        cur = cur - 1
    Loop
    StyleGradesSheet
    Application.EnableEvents = True
End Sub

' ---- Buttons ----
Public Sub OpenWebsite()
    On Error Resume Next
    ThisWorkbook.FollowHyperlink SITE_URL
End Sub

Public Sub OpenStudents()
    StartTab = 1
    frmMain.Show
End Sub

Public Sub OpenGrades()
    StartTab = 2
    frmMain.Show
End Sub

Public Sub OpenSettings()
    StartTab = 3
    frmMain.Show
End Sub

Public Sub GoHome()
    ThisWorkbook.Worksheets(SH_HOME).Activate
End Sub

Public Sub GoGrades()
    ThisWorkbook.Worksheets(SH_GR).Activate
End Sub

Public Sub RecalcNow()
    RecalcAll
    MsgBox "Averages, ranks and remarks are up to date.", vbInformation, "Grades Manager"
End Sub

'##############################################################
'  PART 2  -  BUILD AND DESIGN THE WORKBOOK
'##############################################################
Public Sub BuildWorkbook()
    Dim wsH As Worksheet, wsS As Worksheet, wsG2 As Worksheet
    Dim wsR As Worksheet, wsT As Worksheet

    Application.ScreenUpdating = False
    Application.EnableEvents = False

    Set wsH = GetOrAddSheet(SH_HOME)
    Set wsG2 = GetOrAddSheet(SH_GR)
    Set wsS = GetOrAddSheet(SH_SET)
    Set wsR = GetOrAddSheet(SH_REP)
    Set wsT = GetOrAddSheet(SH_STAT)

    BuildSettings wsS
    BuildGrades wsG2
    BuildReport wsR
    BuildStatsSheet wsT
    BuildHome wsH

    wsH.Move Before:=ThisWorkbook.Worksheets(1)
    wsG2.Move After:=wsH
    wsS.Move After:=wsG2
    wsR.Move After:=wsS
    wsT.Move After:=wsR
    DeleteEmptySheets

    Application.EnableEvents = True
    Application.ScreenUpdating = True
    wsH.Activate
    MsgBox "Your workbook is ready.", vbInformation, "Grades Manager"
End Sub

Private Function GetOrAddSheet(ByVal nm As String) As Worksheet
    On Error Resume Next
    Set GetOrAddSheet = ThisWorkbook.Worksheets(nm)
    On Error GoTo 0
    If GetOrAddSheet Is Nothing Then
        Set GetOrAddSheet = ThisWorkbook.Worksheets.Add( _
            After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        GetOrAddSheet.Name = nm
    End If
    GetOrAddSheet.DisplayRightToLeft = True
End Function

Private Sub DeleteEmptySheets()
    Dim ws As Worksheet, names As New Collection, v As Variant
    For Each ws In ThisWorkbook.Worksheets
        Select Case ws.Name
            Case SH_HOME, SH_SET, SH_GR, SH_REP, SH_STAT
            Case Else
                If Application.WorksheetFunction.CountA(ws.Cells) = 0 And ws.Shapes.Count = 0 Then names.Add ws.Name
        End Select
    Next ws
    Application.DisplayAlerts = False
    For Each v In names
        ThisWorkbook.Worksheets(v).Delete
    Next v
    Application.DisplayAlerts = True
End Sub

Private Sub NoGrid(ws As Worksheet)
    ws.Activate
    ActiveWindow.DisplayGridlines = False
End Sub

Private Sub StyleTable(rng As Range)
    With rng
        .Borders.LineStyle = xlContinuous
        .Borders.Color = RGB(205, 215, 232)
        .RowHeight = 24
        .VerticalAlignment = xlCenter
        .Font.Size = 11
    End With
    With rng.Rows(1)
        .Interior.Color = ClrMain
        .Font.Color = vbWhite
        .Font.Bold = True
        .HorizontalAlignment = xlCenter
    End With
End Sub

Private Function AddButton(ws As Worksheet, ByVal nm As String, ByVal cap As String, _
        ByVal l As Single, ByVal t As Single, ByVal w As Single, ByVal h As Single, _
        ByVal macro As String, ByVal clr As Long, Optional ByVal fSize As Single = 16) As Shape
    Dim s As Shape
    On Error Resume Next
    ws.Shapes(nm).Delete
    On Error GoTo 0
    Set s = ws.Shapes.AddShape(msoShapeRoundedRectangle, l, t, w, h)
    With s
        .Name = nm
        .Fill.ForeColor.RGB = clr
        .Line.Visible = msoFalse
        .Shadow.Visible = msoTrue
        .Shadow.OffsetX = 0
        .Shadow.OffsetY = 3
        .Shadow.Blur = 6
        .Shadow.Transparency = 0.65
        .Shadow.ForeColor.RGB = RGB(0, 0, 0)
        .Adjustments(1) = 0.25
        With .TextFrame2
            .VerticalAnchor = msoAnchorMiddle
            .TextRange.Text = cap
            .TextRange.ParagraphFormat.Alignment = msoAlignCenter
            .TextRange.Font.Size = fSize
            .TextRange.Font.Bold = msoTrue
            .TextRange.Font.Name = "Segoe UI"
            .TextRange.Font.Fill.ForeColor.RGB = vbWhite
        End With
        .OnAction = macro
        .Placement = xlFreeFloating
    End With
    Set AddButton = s
End Function

Private Sub AddLogo(ws As Worksheet, ByVal l As Single, ByVal t As Single, ByVal d As Single, _
        ByVal back As Long, ByVal fore As Long)
    Dim s As Shape
    On Error Resume Next
    ws.Shapes("logoM").Delete
    On Error GoTo 0
    Set s = ws.Shapes.AddShape(msoShapeOval, l, t, d, d)
    With s
        .Name = "logoM"
        .Fill.ForeColor.RGB = back
        .Line.ForeColor.RGB = ClrAccent
        .Line.Weight = 2.5
        With .TextFrame2
            .MarginLeft = 0: .MarginRight = 0: .MarginTop = 0: .MarginBottom = 0
            .VerticalAnchor = msoAnchorMiddle
            .TextRange.Text = "M"
            .TextRange.ParagraphFormat.Alignment = msoAlignCenter
            .TextRange.Font.Name = "Segoe UI Black"
            .TextRange.Font.Bold = msoTrue
            .TextRange.Font.Size = d * 0.48
            .TextRange.Font.Fill.ForeColor.RGB = fore
        End With
        .OnAction = "OpenWebsite"
        .AlternativeText = "merabti.com"
        .Placement = xlFreeFloating
    End With
End Sub

' ---- Home ----
Private Sub BuildHome(ws As Worksheet)
    Dim s As Shape, i As Long

    For i = ws.Shapes.Count To 1 Step -1
        ws.Shapes(i).Delete
    Next i
    ws.Cells.Interior.Color = RGB(244, 246, 250)
    NoGrid ws
    ActiveWindow.DisplayHeadings = False

    ' Banner (title centered, logo on the side)
    Set s = ws.Shapes.AddShape(msoShapeRoundedRectangle, 30, 24, 660, 100)
    With s
        .Name = "banner"
        .Line.Visible = msoFalse
        .Adjustments(1) = 0.18
        .Fill.TwoColorGradient msoGradientVertical, 1
        .Fill.ForeColor.RGB = RGB(52, 96, 160)
        .Fill.BackColor.RGB = ClrDark
        .Shadow.Visible = msoTrue
        .Shadow.OffsetY = 4: .Shadow.Blur = 10: .Shadow.Transparency = 0.7
        With .TextFrame2
            .VerticalAnchor = msoAnchorMiddle
            .MarginLeft = 100: .MarginRight = 100
            .TextRange.Text = TX("appTitle") & vbCr & TX("appSub")
            .TextRange.Font.Name = "Segoe UI"
            .TextRange.Font.Fill.ForeColor.RGB = vbWhite
            .TextRange.ParagraphFormat.Alignment = msoAlignCenter
            .TextRange.ParagraphFormat.TextDirection = msoTextDirectionRightToLeft
            .TextRange.Paragraphs(1).Font.Size = 28
            .TextRange.Paragraphs(1).Font.Bold = msoTrue
            .TextRange.Paragraphs(2).Font.Size = 13
        End With
    End With

    ' M logo -> merabti.com
    AddLogo ws, 50, 44, 60, vbWhite, ClrMain

    ' Main buttons
    AddButton ws, "btnStudents", TX("bStudents"), 30, 150, 205, 72, "OpenStudents", ClrMain
    AddButton ws, "btnGradesForm", TX("bGrades"), 257, 150, 205, 72, "OpenGrades", RGB(52, 96, 160)
    AddButton ws, "btnSettings", TX("bSettings"), 485, 150, 205, 72, "OpenSettings", ClrAccent
    AddButton ws, "btnSheet", TX("bSheet"), 30, 242, 205, 72, "GoGrades", RGB(70, 130, 180)
    AddButton ws, "btnStats", TX("bStats"), 257, 242, 205, 72, "ShowStats", RGB(90, 70, 150)
    AddButton ws, "btnRecalc", TX("bRecalc"), 485, 242, 205, 72, "RecalcNow", RGB(110, 120, 115)

    ws.Tab.Color = ClrDark
    ws.Range("A1").Select
End Sub

' ---- Settings ----
Private Sub BuildSettings(ws As Worksheet)
    Dim labels As Variant, defs As Variant, i As Long

    labels = Array(TX("sSchool"), TX("sYear"), TX("sTeacher"), TX("sSubject"), TX("sTerm"), TX("sLevel"), _
                   TX("sMax"), TX("sTests"), TX("sCoefCA"), TX("sCoefTests"), TX("sCoefExam"), TX("sPass"))
    defs = Array(TX("dSchool"), "2026/2027", TX("dTeacher"), TX("dSubject"), TX("term1"), TX("lvl2"), _
                 20, 2, 1, 1, 2, 10)

    ws.Cells.Font.Name = "Segoe UI"
    With ws.Range("B1")
        .Value = TX("shSettings")
        .Font.Size = 20: .Font.Bold = True: .Font.Color = ClrMain
        .HorizontalAlignment = xlRight
    End With
    ws.Rows(1).RowHeight = 34

    ws.Range("B3:C3").Value = Array(TX("sItem"), TX("sValue"))
    For i = 0 To UBound(labels)
        ws.Cells(R_SCHOOL + i, 2).Value = labels(i)
        If Len(ws.Cells(R_SCHOOL + i, 3).Value & "") = 0 Then ws.Cells(R_SCHOOL + i, 3).Value = defs(i)
    Next i
    StyleTable ws.Range("B3:C15")
    With ws.Range("B4:B15")
        .Font.Bold = True
        .Interior.Color = ClrLight
        .HorizontalAlignment = xlRight
    End With
    ws.Range("C4:C15").HorizontalAlignment = xlCenter
    ws.Range("B3:C15").ReadingOrder = xlRTL

    ' Automatic remarks
    ws.Range("E3:G3").Value = Array(TX("rFrom"), TX("rTo"), TX("hRemark"))
    If Len(ws.Cells(REM_FIRST_ROW, REM_COL).Value & "") = 0 Then FillDefaultRemarks ws
    StyleTable ws.Range("E3:G" & REM_LAST_ROW)
    ws.Range("E4:F" & REM_LAST_ROW).HorizontalAlignment = xlCenter
    With ws.Range("G4:G" & REM_LAST_ROW)
        .HorizontalAlignment = xlRight
        .ReadingOrder = xlRTL
        .Font.Size = 12
    End With
    With ws.Range("E15")
        .Value = TX("rNote")
        .Font.Italic = True: .Font.Color = RGB(110, 120, 115)
        .HorizontalAlignment = xlRight
        .ReadingOrder = xlRTL
    End With

    ws.Columns("A").ColumnWidth = 3
    ws.Columns("B").ColumnWidth = 22
    ws.Columns("C").ColumnWidth = 24
    ws.Columns("D").ColumnWidth = 4
    ws.Columns("E:F").ColumnWidth = 12
    ws.Columns("G").ColumnWidth = 46

    NoGrid ws
    AddButton ws, "btnHome", TX("bHome"), ws.Range("G1").Left + 200, 6, 100, 28, "GoHome", ClrMain, 11
    ws.Tab.Color = ClrAccent
End Sub

Private Sub FillDefaultRemarks(ws As Worksheet)
    Dim f As Variant, t As Variant, i As Long
    f = Array(18, 16, 14, 12, 10, 0)
    t = Array(20, 17.99, 15.99, 13.99, 11.99, 9.99)
    For i = 0 To 5
        ws.Cells(REM_FIRST_ROW + i, REM_COL).Value = f(i)
        ws.Cells(REM_FIRST_ROW + i, REM_COL + 1).Value = t(i)
        ws.Cells(REM_FIRST_ROW + i, REM_COL + 2).Value = TX("rem" & (i + 1))
    Next i
End Sub

' ---- Grades ----
Private Sub BuildGrades(ws As Worksheet)
    Dim i As Long, n As Long

    If Len(ws.Cells(HDR_ROW, 1).Value & "") = 0 Then
        n = NumOr(S(R_TESTS), 2)
        ws.Cells(HDR_ROW, 1).Value = TX("hID")
        ws.Cells(HDR_ROW, 2).Value = TX("hClass")
        ws.Cells(HDR_ROW, 3).Value = TX("hName")
        ws.Cells(HDR_ROW, 4).Value = TX("hCA")
        For i = 1 To n
            ws.Cells(HDR_ROW, 4 + i).Value = TestHeader(i)
        Next i
        ws.Cells(HDR_ROW, 5 + n).Value = TX("hExam")
        ws.Cells(HDR_ROW, 6 + n).Value = TX("hAvg")
        ws.Cells(HDR_ROW, 7 + n).Value = TX("hRank")
        ws.Cells(HDR_ROW, 8 + n).Value = TX("hRemark")
    End If

    ws.Cells.Font.Name = "Segoe UI"
    StyleGradesSheet

    NoGrid ws
    ActiveWindow.FreezePanes = False
    ws.Cells(HDR_ROW + 1, 4).Select
    ActiveWindow.FreezePanes = True

    AddButton ws, "btnHome", TX("bHome"), ws.Range("D1").Left + 180, 8, 100, 28, "GoHome", ClrMain, 11
    AddButton ws, "btnRecalcG", TX("bRecalc"), ws.Range("D1").Left + 290, 8, 120, 28, "RecalcNow", RGB(110, 120, 115), 11
    ws.Tab.Color = ClrMain
End Sub

' ---- Report card page ----
Private Sub BuildReport(ws As Worksheet)
    ws.Cells.Font.Name = "Segoe UI"
    ws.Columns("A").ColumnWidth = 3
    ws.Columns("B").ColumnWidth = 28
    ws.Columns("C").ColumnWidth = 18
    ws.Columns("D").ColumnWidth = 18
    ws.Columns("E").ColumnWidth = 3
    NoGrid ws
    On Error Resume Next
    With ws.PageSetup
        .Orientation = xlPortrait
        .CenterHorizontally = True
        .Zoom = False
        .FitToPagesWide = 1
        .FitToPagesTall = 1
    End With
    On Error GoTo 0
    With ws.Range("B2")
        .Value = TX("repEmpty")
        .Font.Color = RGB(130, 130, 130)
        .HorizontalAlignment = xlRight
    End With
    ws.Tab.Color = RGB(60, 90, 160)
End Sub

' ---- Statistics ----
Private Sub BuildStatsSheet(ws As Worksheet)
    ws.Cells.Font.Name = "Segoe UI"
    With ws.Range("B1")
        .Value = TX("shStats")
        .Font.Size = 20: .Font.Bold = True: .Font.Color = RGB(70, 90, 160)
        .HorizontalAlignment = xlRight
    End With
    ws.Rows(1).RowHeight = 34
    ws.Columns("A").ColumnWidth = 3
    ws.Columns("B:G").ColumnWidth = 15
    NoGrid ws
    AddButton ws, "btnHome", TX("bHome"), ws.Range("D1").Left, 6, 100, 28, "GoHome", ClrMain, 11
    AddButton ws, "btnRefresh", TX("bRefresh"), ws.Range("D1").Left + 110, 6, 100, 28, "ShowStats", RGB(90, 70, 150), 11
    ws.Tab.Color = RGB(70, 90, 160)
End Sub

'##############################################################
'  PART 3  -  REPORT CARDS (PDF) AND STATISTICS
'##############################################################
Public Sub FillReport(ByVal r As Long)
    Dim ws As Worksheet, g As Worksheet, c As Long, rw As Long
    Dim cCA As Long, cEx As Long, mx As Double, cls As String

    Set ws = ThisWorkbook.Worksheets(SH_REP)
    Set g = WsG
    mx = MaxScore()
    cls = ClassOf(r)

    ws.Range("A1:F60").Clear
    ws.Range("A1:F60").Font.Name = "Segoe UI"
    ws.Range("A1:F60").ReadingOrder = xlRTL

    With ws.Range("B2:D2")
        .Merge
        .Value = S(R_SCHOOL)
        .Font.Size = 16: .Font.Bold = True: .Font.Color = ClrDark
        .HorizontalAlignment = xlCenter
    End With
    With ws.Range("B3:D3")
        .Merge
        .Value = TX("sYear") & " " & S(R_YEAR) & "   |   " & S(R_TERM)
        .Font.Color = RGB(100, 110, 105)
        .HorizontalAlignment = xlCenter
    End With
    With ws.Range("B5:D5")
        .Merge
        .Value = TX("repTitle")
        .Interior.Color = ClrMain
        .Font.Color = vbWhite: .Font.Size = 18: .Font.Bold = True
        .HorizontalAlignment = xlCenter: .VerticalAlignment = xlCenter
    End With
    ws.Rows(5).RowHeight = 36

    InfoRow ws, 7, TX("hName"), g.Cells(r, 3).Value, True
    InfoRow ws, 8, TX("hClass"), cls, False
    InfoRow ws, 9, TX("sSubject"), S(R_SUBJECT), False
    InfoRow ws, 10, TX("sTeacher"), S(R_TEACHER), False

    ws.Range("B12:D12").Value = Array(TX("repComp"), TX("repScore"), TX("repOutOf"))
    With ws.Range("B12:D12")
        .Interior.Color = ClrMain
        .Font.Color = vbWhite: .Font.Bold = True
        .HorizontalAlignment = xlCenter
    End With

    cCA = ColOf(TX("hCA")): cEx = ColOf(TX("hExam"))
    rw = 12
    For c = cCA To cEx
        rw = rw + 1
        If c = cCA Then
            ws.Cells(rw, 2).Value = TX("repCA")
        Else
            ws.Cells(rw, 2).Value = g.Cells(HDR_ROW, c).Value
        End If
        ws.Cells(rw, 3).Value = g.Cells(r, c).Value
        ws.Cells(rw, 4).Value = mx
    Next c
    BodyStyle ws.Range(ws.Cells(12, 2), ws.Cells(rw, 4))

    rw = rw + 2
    ws.Cells(rw, 2).Value = TX("hAvg")
    ws.Cells(rw, 3).Value = g.Cells(r, ColOf(TX("hAvg"))).Value
    ws.Cells(rw, 4).Value = mx
    BodyStyle ws.Range(ws.Cells(rw, 2), ws.Cells(rw + 2, 4))
    With ws.Range(ws.Cells(rw, 2), ws.Cells(rw, 4))
        .Interior.Color = ClrLight
        .Font.Bold = True: .Font.Size = 13: .Font.Color = ClrDark
    End With

    ws.Cells(rw + 1, 2).Value = TX("hRank")
    ws.Cells(rw + 1, 3).Value = "'" & g.Cells(r, ColOf(TX("hRank"))).Value & " / " & CountClass(cls)

    ws.Cells(rw + 2, 2).Value = TX("hRemark")
    With ws.Range(ws.Cells(rw + 2, 3), ws.Cells(rw + 2, 4))
        .Merge
        .Value = g.Cells(r, ColOf(TX("hRemark"))).Value
        .HorizontalAlignment = xlCenter
        .Font.Size = 12
    End With
    ws.Range(ws.Cells(rw, 2), ws.Cells(rw + 2, 2)).HorizontalAlignment = xlRight
    ws.Range(ws.Cells(rw, 2), ws.Cells(rw + 2, 2)).Font.Bold = True

    With ws.Cells(rw + 5, 4)
        .Value = TX("repSign")
        .Font.Italic = True: .Font.Color = RGB(110, 120, 115)
        .HorizontalAlignment = xlCenter
    End With

    ws.Range("C13:C" & rw).NumberFormat = "0.00"
    ws.Range("D13:D" & rw).NumberFormat = "0"

    On Error Resume Next
    ws.PageSetup.PrintArea = "$A$1:$E$" & (rw + 8)
    On Error GoTo 0
End Sub

Private Sub InfoRow(ws As Worksheet, ByVal rw As Long, ByVal lbl As String, ByVal v As Variant, ByVal bold As Boolean)
    With ws.Cells(rw, 2)
        .Value = lbl
        .Font.Bold = True: .Font.Color = ClrMain
        .Interior.Color = ClrLight
        .HorizontalAlignment = xlRight
    End With
    With ws.Range(ws.Cells(rw, 3), ws.Cells(rw, 4))
        .Merge
        .Value = v
        .Font.Size = 12
        .Font.Bold = bold
        .HorizontalAlignment = xlRight
    End With
    With ws.Range(ws.Cells(rw, 2), ws.Cells(rw, 4))
        .Borders.LineStyle = xlContinuous
        .Borders.Color = RGB(205, 215, 232)
    End With
    ws.Rows(rw).RowHeight = 24
End Sub

Private Sub BodyStyle(rng As Range)
    With rng
        .Borders.LineStyle = xlContinuous
        .Borders.Color = RGB(205, 215, 232)
        .RowHeight = 24
        .VerticalAlignment = xlCenter
    End With
    rng.Columns(1).HorizontalAlignment = xlRight
    rng.Columns(2).HorizontalAlignment = xlCenter
    rng.Columns(3).HorizontalAlignment = xlCenter
End Sub

Private Function SafeName(ByVal t As String) As String
    Dim ch As Variant
    For Each ch In Array("\\", "/", ":", "*", "?", """", "<", ">", "|")
        t = Replace(t, ch, "_")
    Next ch
    SafeName = Trim$(t)
End Function

Private Function SavePDF(ByVal path As String, ByVal openIt As Boolean) As Boolean
    On Error GoTo fail
    ThisWorkbook.Worksheets(SH_REP).ExportAsFixedFormat Type:=xlTypePDF, Filename:=path, _
        Quality:=xlQualityStandard, IgnorePrintAreas:=False, OpenAfterPublish:=openIt
    SavePDF = True
fail:
End Function

Private Function PdfFor(ByVal folder As String, ByVal r As Long, ByVal openIt As Boolean) As Boolean
    Dim base As String
    base = folder & Application.PathSeparator & WsG.Cells(r, 1).Value
    If SavePDF(base & "_" & SafeName(WsG.Cells(r, 3).Value) & ".pdf", openIt) Then
        PdfFor = True
    Else
        PdfFor = SavePDF(base & ".pdf", openIt)
    End If
End Function

Public Sub ExportStudent(ByVal r As Long)
    If ThisWorkbook.Path = "" Then MsgBox "Please save the workbook first.", vbExclamation: Exit Sub
    RecalcAll
    FillReport r
    If Not PdfFor(ThisWorkbook.Path, r, True) Then MsgBox "Could not create the PDF.", vbExclamation
End Sub

Public Sub ExportClass(ByVal cls As String)
    Dim folder As String, r As Long, n As Long

    If cls = "" Then MsgBox "Choose a class first.", vbExclamation: Exit Sub
    If ThisWorkbook.Path = "" Then MsgBox "Please save the workbook first.", vbExclamation: Exit Sub

    folder = ThisWorkbook.Path & Application.PathSeparator & "Reports_" & SafeName(cls)
    If Dir(folder, vbDirectory) = "" Then MkDir folder

    RecalcAll
    Application.ScreenUpdating = False
    For r = HDR_ROW + 1 To LastRow
        If ClassOf(r) = cls Then
            FillReport r
            If PdfFor(folder, r, False) Then n = n + 1
        End If
    Next r
    Application.ScreenUpdating = True

    MsgBox n & " report card(s) saved in:" & vbCrLf & folder, vbInformation, "Grades Manager"
    On Error Resume Next
    ThisWorkbook.FollowHyperlink folder
End Sub

Public Sub ShowStats()
    Dim ws As Worksheet, g As Worksheet, cls As Variant, co As ChartObject, sr As Series
    Dim r As Long, rw As Long, cAvg As Long, n As Long, cnt As Long, ok As Long
    Dim sumA As Double, mx As Double, mn As Double, pass As Double, v As Variant

    RecalcAll
    Set ws = ThisWorkbook.Worksheets(SH_STAT)
    Set g = WsG
    cAvg = ColOf(TX("hAvg"))
    pass = NumOr(S(R_PASS), MaxScore() / 2)

    Application.ScreenUpdating = False
    For Each co In ws.ChartObjects
        co.Delete
    Next co
    ws.Range("B3:H200").Clear
    ws.Range("B3:H200").Font.Name = "Segoe UI"

    ws.Range("B3:G3").Value = Array(TX("hClass"), TX("stAvg"), TX("stCount"), TX("stMax"), TX("stMin"), TX("stPass"))
    rw = 3
    For Each cls In ClassList()
        n = 0: cnt = 0: ok = 0: sumA = 0: mx = -1: mn = 1E+30
        For r = HDR_ROW + 1 To LastRow
            If ClassOf(r) = cls Then
                n = n + 1
                v = g.Cells(r, cAvg).Value
                If Not IsEmpty(v) Then
                    cnt = cnt + 1: sumA = sumA + v
                    If v > mx Then mx = v
                    If v < mn Then mn = v
                    If v >= pass Then ok = ok + 1
                End If
            End If
        Next r
        rw = rw + 1
        ws.Cells(rw, 2).Value = "'" & cls
        ws.Cells(rw, 4).Value = n
        If cnt > 0 Then
            ws.Cells(rw, 3).Value = Round(sumA / cnt, 2)
            ws.Cells(rw, 5).Value = mx
            ws.Cells(rw, 6).Value = mn
            ws.Cells(rw, 7).Value = ok / cnt
        End If
    Next cls

    If rw = 3 Then
        ws.Range("B4").Value = TX("stNoData")
        Application.ScreenUpdating = True
        ws.Activate
        Exit Sub
    End If

    With ws.Range("B3:G" & rw)
        .Borders.LineStyle = xlContinuous
        .Borders.Color = RGB(205, 212, 232)
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .RowHeight = 24
    End With
    With ws.Range("B3:G3")
        .Interior.Color = RGB(70, 90, 160)
        .Font.Color = vbWhite: .Font.Bold = True
    End With
    ws.Range("C4:C" & rw).Font.Bold = True
    ws.Range("C4:C" & rw & ",E4:F" & rw).NumberFormat = "0.00"
    ws.Range("G4:G" & rw).NumberFormat = "0%"

    Set co = ws.ChartObjects.Add(ws.Range("I3").Left, ws.Range("I3").Top, 470, 290)
    With co.Chart
        Set sr = .SeriesCollection.NewSeries
        sr.Name = TX("stAvg")
        sr.Values = ws.Range("C4:C" & rw)
        sr.XValues = ws.Range("B4:B" & rw)
        .ChartType = xlColumnClustered
        .HasTitle = True
        .ChartTitle.Text = TX("stChart")
        .HasLegend = False
        sr.Format.Fill.ForeColor.RGB = ClrMain
        sr.HasDataLabels = True
        .Axes(xlValue).MinimumScale = 0
        .Axes(xlValue).MaximumScale = MaxScore()
    End With

    Application.ScreenUpdating = True
    ws.Activate
End Sub

'##############################################################
'  PART 4  -  ARABIC TEXTS (Unicode codes)
'  To make a French or English version, change only this part.
'##############################################################
Public Function TX(ByVal key As String) As String
    Select Case key
        Case "shHome": TX = U("0627 0644 0631 0626 064A 0633 064A 0629")   ' shHome
        Case "shGrades": TX = U("0627 0644 0646 0642 0627 0637")   ' shGrades
        Case "shSettings": TX = U("0627 0644 0625 0639 062F 0627 062F 0627 062A")   ' shSettings
        Case "shReport": TX = U("0643 0634 0641 0020 0627 0644 0646 0642 0627 0637")   ' shReport
        Case "shStats": TX = U("0627 0644 0625 062D 0635 0627 0626 064A 0627 062A")   ' shStats
        Case "hID": TX = U("0627 0644 0631 0642 0645")   ' hID
        Case "hClass": TX = U("0627 0644 0642 0633 0645")   ' hClass
        Case "hName": TX = U("0627 0644 0627 0633 0645 0020 0648 0627 0644 0644 0642 0628")   ' hName
        Case "hCA": TX = U("0627 0644 062A 0642 0648 064A 0645")   ' hCA
        Case "hTest": TX = U("0641 0631 0636")   ' hTest
        Case "hExam": TX = U("0627 0644 0627 062E 062A 0628 0627 0631")   ' hExam
        Case "hAvg": TX = U("0627 0644 0645 0639 062F 0644")   ' hAvg
        Case "hRank": TX = U("0627 0644 0631 062A 0628 0629")   ' hRank
        Case "hRemark": TX = U("0627 0644 0645 0644 0627 062D 0638 0629")   ' hRemark
        Case "appTitle": TX = U("0628 0631 0646 0627 0645 062C 0020 062A 0633 064A 064A 0631 0020 0646 0642 0627 0637 0020 0627 0644 062A 0644 0627 0645 064A 0630")   ' appTitle
        Case "appSub": TX = U("0627 0644 0646 0642 0627 0637 0020 0020 002D 0020 0020 0627 0644 0645 0639 062F 0644 0627 062A 0020 0020 002D 0020 0020 0627 0644 062A 0631 062A 064A 0628 0020 0020 002D 0020 0020 0643 0634 0648 0641 0020 0627 0644 0646 0642 0627 0637")   ' -    -    -
        Case "bStudents": TX = U("0627 0644 062A 0644 0627 0645 064A 0630")   ' bStudents
        Case "bGrades": TX = U("0625 062F 062E 0627 0644 0020 0627 0644 0646 0642 0627 0637")   ' bGrades
        Case "bSettings": TX = U("0627 0644 0625 0639 062F 0627 062F 0627 062A")   ' bSettings
        Case "bSheet": TX = U("0648 0631 0642 0629 0020 0627 0644 0646 0642 0627 0637")   ' bSheet
        Case "bStats": TX = U("0627 0644 0625 062D 0635 0627 0626 064A 0627 062A")   ' bStats
        Case "bRecalc": TX = U("0625 0639 0627 062F 0629 0020 0627 0644 062D 0633 0627 0628")   ' bRecalc
        Case "bHome": TX = U("0627 0644 0631 0626 064A 0633 064A 0629")   ' bHome
        Case "bRefresh": TX = U("062A 062D 062F 064A 062B")   ' bRefresh
        Case "gTitle": TX = U("0646 0642 0627 0637 0020 0627 0644 062A 0644 0627 0645 064A 0630")   ' gTitle
        Case "gOutOf": TX = U("0627 0644 0646 0642 0627 0637 0020 0645 0646")   ' gOutOf
        Case "sItem": TX = U("0627 0644 0628 0646 062F")   ' sItem
        Case "sValue": TX = U("0627 0644 0642 064A 0645 0629")   ' sValue
        Case "sSchool": TX = U("0627 0644 0645 0624 0633 0633 0629")   ' sSchool
        Case "sYear": TX = U("0627 0644 0633 0646 0629 0020 0627 0644 062F 0631 0627 0633 064A 0629")   ' sYear
        Case "sTeacher": TX = U("0627 0644 0623 0633 062A 0627 0630")   ' sTeacher
        Case "sSubject": TX = U("0627 0644 0645 0627 062F 0629")   ' sSubject
        Case "sTerm": TX = U("0627 0644 0641 0635 0644")   ' sTerm
        Case "sLevel": TX = U("0627 0644 0645 0633 062A 0648 0649")   ' sLevel
        Case "sMax": TX = U("0627 0644 0646 0642 0637 0629 0020 0627 0644 0642 0635 0648 0649")   ' sMax
        Case "sTests": TX = U("0639 062F 062F 0020 0627 0644 0641 0631 0648 0636")   ' sTests
        Case "sCoefCA": TX = U("0645 0639 0627 0645 0644 0020 0627 0644 062A 0642 0648 064A 0645")   ' sCoefCA
        Case "sCoefTests": TX = U("0645 0639 0627 0645 0644 0020 0627 0644 0641 0631 0648 0636")   ' sCoefTests
        Case "sCoefExam": TX = U("0645 0639 0627 0645 0644 0020 0627 0644 0627 062E 062A 0628 0627 0631")   ' sCoefExam
        Case "sPass": TX = U("0639 062A 0628 0629 0020 0627 0644 0646 062C 0627 062D")   ' sPass
        Case "rFrom": TX = U("0645 0646 0020 0028 002F 0032 0030 0029")   ' (/20)
        Case "rTo": TX = U("0625 0644 0649 0020 0028 002F 0032 0030 0029")   ' (/20)
        Case "rNote": TX = U("064A 0645 0643 0646 0643 0020 062A 0639 062F 064A 0644 0020 0627 0644 0645 0644 0627 062D 0638 0627 062A 0020 0628 062D 0631 064A 0629 060C 0020 0645 0639 0020 0625 0628 0642 0627 0626 0647 0627 0020 0645 0631 062A 0628 0629 0020 0645 0646 0020 0627 0644 0623 0639 0644 0649 0020 0625 0644 0649 0020 0627 0644 0623 062F 0646 0649 002E")   ' .
        Case "dSchool": TX = U("0627 0633 0645 0020 0627 0644 0645 0624 0633 0633 0629")   ' dSchool
        Case "dTeacher": TX = U("0627 0633 0645 0020 0627 0644 0623 0633 062A 0627 0630")   ' dTeacher
        Case "dSubject": TX = U("0627 0644 0631 064A 0627 0636 064A 0627 062A")   ' dSubject
        Case "term1": TX = U("0627 0644 0641 0635 0644 0020 0627 0644 0623 0648 0644")   ' term1
        Case "term2": TX = U("0627 0644 0641 0635 0644 0020 0627 0644 062B 0627 0646 064A")   ' term2
        Case "term3": TX = U("0627 0644 0641 0635 0644 0020 0627 0644 062B 0627 0644 062B")   ' term3
        Case "lvl1": TX = U("0627 0628 062A 062F 0627 0626 064A")   ' lvl1
        Case "lvl2": TX = U("0645 062A 0648 0633 0637")   ' lvl2
        Case "lvl3": TX = U("062B 0627 0646 0648 064A")   ' lvl3
        Case "rem1": TX = U("0645 0645 062A 0627 0632 060C 0020 0648 0627 0635 0644 0020 0639 0644 0649 0020 0647 0630 0627 0020 0627 0644 0645 0633 062A 0648 0649")   ' rem1
        Case "rem2": TX = U("062C 064A 062F 0020 062C 062F 0627")   ' rem2
        Case "rem3": TX = U("062C 064A 062F")   ' rem3
        Case "rem4": TX = U("0642 0631 064A 0628 0020 0645 0646 0020 0627 0644 062C 064A 062F")   ' rem4
        Case "rem5": TX = U("0645 0642 0628 0648 0644")   ' rem5
        Case "rem6": TX = U("0636 0639 064A 0641 060C 0020 0639 0644 064A 0643 0020 0628 0628 0630 0644 0020 0627 0644 0645 0632 064A 062F 0020 0645 0646 0020 0627 0644 062C 0647 062F")   ' rem6
        Case "repTitle": TX = U("0643 0634 0641 0020 0627 0644 0646 0642 0627 0637")   ' repTitle
        Case "repComp": TX = U("0627 0644 0639 0646 0635 0631")   ' repComp
        Case "repScore": TX = U("0627 0644 0646 0642 0637 0629")   ' repScore
        Case "repOutOf": TX = U("0645 0646")   ' repOutOf
        Case "repCA": TX = U("0627 0644 062A 0642 0648 064A 0645 0020 0627 0644 0645 0633 062A 0645 0631")   ' repCA
        Case "repSign": TX = U("0625 0645 0636 0627 0621 0020 0627 0644 0623 0633 062A 0627 0630")   ' repSign
        Case "repEmpty": TX = U("064A 0638 0647 0631 0020 0647 0646 0627 0020 0643 0634 0641 0020 0646 0642 0627 0637 0020 0627 0644 062A 0644 0645 064A 0630 0020 0627 0644 0645 062D 062F 062F 002E")   ' .
        Case "stAvg": TX = U("0645 0639 062F 0644 0020 0627 0644 0642 0633 0645")   ' stAvg
        Case "stCount": TX = U("0639 062F 062F 0020 0627 0644 062A 0644 0627 0645 064A 0630")   ' stCount
        Case "stMax": TX = U("0623 0639 0644 0649 0020 0645 0639 062F 0644")   ' stMax
        Case "stMin": TX = U("0623 062F 0646 0649 0020 0645 0639 062F 0644")   ' stMin
        Case "stPass": TX = U("0646 0633 0628 0629 0020 0627 0644 0646 062C 0627 062D")   ' stPass
        Case "stChart": TX = U("0645 0639 062F 0644 0627 062A 0020 0627 0644 0623 0642 0633 0627 0645")   ' stChart
        Case "stNoData": TX = U("0644 0627 0020 062A 0648 062C 062F 0020 0628 064A 0627 0646 0627 062A 0020 0628 0639 062F 002E")   ' .
        Case "fCaption": TX = U("062A 0633 064A 064A 0631 0020 0646 0642 0627 0637 0020 0627 0644 062A 0644 0627 0645 064A 0630")   ' fCaption
        Case "close": TX = U("0625 063A 0644 0627 0642")   ' close
        Case "add": TX = U("0625 0636 0627 0641 0629 0020 0020 0028 0045 006E 0074 0065 0072 0029")   ' (Enter)
        Case "import": TX = U("0627 0633 062A 064A 0631 0627 062F 0020 0645 0646 0020 0627 0644 062D 0627 0641 0638 0629")   ' import
        Case "hint": TX = U("0627 0646 0633 062E 0020 0642 0627 0626 0645 0629 0020 0627 0644 0623 0633 0645 0627 0621 0020 0028 0627 0633 0645 0020 0641 064A 0020 0643 0644 0020 0633 0637 0631 0029 0020 0645 0646 0020 0625 0643 0633 0644 0020 0623 0648 0020 0648 0648 0631 062F 060C 0020 0627 062E 062A 0631 0020 0627 0644 0642 0633 0645 060C 0020 062B 0645 0020 0627 0636 063A 0637 0020 0627 0633 062A 064A 0631 0627 062F 0020 0645 0646 0020 0627 0644 062D 0627 0641 0638 0629 002E")   ' (   )           .
        Case "infoStudents": TX = U("0639 062F 062F 0020 0627 0644 062A 0644 0627 0645 064A 0630 003A")   ' :
        Case "infoClasses": TX = U("0639 062F 062F 0020 0627 0644 0623 0642 0633 0627 0645 003A")   ' :
        Case "all": TX = U("0028 0627 0644 0643 0644 0029")   ' ()
        Case "search": TX = U("0628 062D 062B 0020 0028 0627 0644 0627 0633 0645 0020 0623 0648 0020 0627 0644 0631 0642 0645 0029")   ' (  )
        Case "count": TX = U("0639 062F 062F 0020 0627 0644 062A 0644 0627 0645 064A 0630 003A")   ' :
        Case "select": TX = U("0627 062E 062A 0631 0020 062A 0644 0645 064A 0630 0627 0020 0645 0646 0020 0627 0644 0642 0627 0626 0645 0629")   ' select
        Case "tests": TX = U("0627 0644 0641 0631 0648 0636")   ' tests
        Case "save": TX = U("062D 0641 0638 0020 0627 0644 0643 0644")   ' save
        Case "delete": TX = U("062D 0630 0641")   ' delete
        Case "pdf": TX = U("0643 0634 0641 0020 0627 0644 062A 0644 0645 064A 0630 0020 0050 0044 0046")   ' PDF
        Case "classPdf": TX = U("0643 0634 0648 0641 0020 0627 0644 0642 0633 0645 0020 0050 0044 0046")   ' PDF
        Case "saved": TX = U("062A 0645 0020 0627 0644 062D 0641 0638 003A")   ' :
        Case "coef": TX = U("0627 0644 0645 0639 0627 0645 0644 0627 062A")   ' coef
        Case "saveSet": TX = U("062D 0641 0638 0020 0627 0644 0625 0639 062F 0627 062F 0627 062A")   ' saveSet
        Case "remarks": TX = U("062A 0639 062F 064A 0644 0020 0627 0644 0645 0644 0627 062D 0638 0627 062A")   ' remarks
        Case "scale": TX = U("0633 0644 0645 0020 0627 0644 062A 0646 0642 064A 0637 003A 0020 0645 0646")   ' :
        Case Else: TX = key
    End Select
End Function`,
      },
      {
        title: 'الكود الثاني: النافذة frmMain',
        code: `'==============================================================
'  USERFORM:  frmMain   (one window, three tabs)
'  1) Insert > UserForm
'  2) In Properties, change (Name) to:  frmMain
'  3) Right-click the form > View Code, delete everything, paste this code
'  All buttons and boxes are created by the code itself.
'  merabti.com
'==============================================================
Option Explicit

' ---- Shared ----
Private WithEvents lblM As MSForms.Label
Private WithEvents btnClose As MSForms.CommandButton
Private WithEvents btnTab1 As MSForms.CommandButton
Private WithEvents btnTab2 As MSForms.CommandButton
Private WithEvents btnTab3 As MSForms.CommandButton
Private fraS As MSForms.Frame          ' students tab
Private fraG As MSForms.Frame          ' grades tab
Private fraT As MSForms.Frame          ' settings tab

' ---- Students tab ----
Private WithEvents cboClassS As MSForms.ComboBox
Private WithEvents txtName As MSForms.TextBox
Private WithEvents btnAdd As MSForms.CommandButton
Private WithEvents btnImport As MSForms.CommandButton
Private lblInfo As MSForms.Label

' ---- Grades tab ----
Private WithEvents cboClassG As MSForms.ComboBox
Private WithEvents txtSearch As MSForms.TextBox
Private WithEvents lstStudents As MSForms.ListBox
Private WithEvents txtExam As MSForms.TextBox
Private WithEvents btnSave As MSForms.CommandButton
Private WithEvents btnDelete As MSForms.CommandButton
Private WithEvents btnPDF As MSForms.CommandButton
Private WithEvents btnClassPDF As MSForms.CommandButton
Private WithEvents txtCA As MSForms.TextBox
Private WithEvents txtT1 As MSForms.TextBox     ' test boxes (up to 6)
Private WithEvents txtT2 As MSForms.TextBox
Private WithEvents txtT3 As MSForms.TextBox
Private WithEvents txtT4 As MSForms.TextBox
Private WithEvents txtT5 As MSForms.TextBox
Private WithEvents txtT6 As MSForms.TextBox
Private fraTests As MSForms.Frame
Private lblCount As MSForms.Label
Private lblName As MSForms.Label
Private lblAvg As MSForms.Label
Private lblRemark As MSForms.Label
Private lblStatus As MSForms.Label

' ---- Settings tab ----
Private WithEvents cboLevel As MSForms.ComboBox
Private WithEvents btnSaveSet As MSForms.CommandButton
Private WithEvents btnRemarks As MSForms.CommandButton
Private txtSchool As MSForms.TextBox
Private txtYear As MSForms.TextBox
Private txtTeacher As MSForms.TextBox
Private txtSubject As MSForms.TextBox
Private cboTerm As MSForms.ComboBox
Private cboTests As MSForms.ComboBox
Private txtCoefCA As MSForms.TextBox
Private txtCoefTests As MSForms.TextBox
Private txtCoefExam As MSForms.TextBox
Private lblScale As MSForms.Label

Private mRow As Long        ' sheet row of the selected student
Private mTests As Long      ' number of tests
Private FW As Single        ' width of a tab page
Private FH As Single        ' height of a tab page
Private CW As Single        ' width of one column (two columns per page)

'==============================================================
'  Builder: positions are measured from the RIGHT (Arabic layout)
'==============================================================
Private Function AddCtl(ByVal kind As String, ByVal nm As String, ByVal cap As String, _
        ByVal fromRight As Single, ByVal t As Single, ByVal w As Single, ByVal h As Single, _
        Optional parent As Object) As Object
    Dim c As Object, pw As Single
    If parent Is Nothing Then
        Set parent = Me
        pw = Me.InsideWidth
    Else
        pw = parent.Width
    End If
    Set c = parent.Controls.Add("Forms." & kind & ".1", nm)
    c.Left = pw - fromRight - w
    c.Top = t: c.Width = w: c.Height = h
    If cap <> "" Then c.Caption = cap
    If kind = "Label" Then c.TextAlign = 3          ' right
    If kind = "TextBox" Or kind = "ComboBox" Then c.TextAlign = 3
    Set AddCtl = c
End Function

Private Function AddPage(ByVal nm As String) As MSForms.Frame
    Dim f As MSForms.Frame
    Set f = Me.Controls.Add("Forms.Frame.1", nm)
    f.Left = 0: f.Top = 92: f.Width = FW: f.Height = FH
    f.Caption = ""
    f.BorderStyle = 0
    f.SpecialEffect = 0
    f.BackColor = vbWhite
    Set AddPage = f
End Function

Private Sub UserForm_Initialize()
    Dim ln As Object

    Me.Caption = "Student Grades Manager"   ' the title bar cannot show Arabic
    Me.Width = 660
    Me.Height = 510
    Me.BackColor = vbWhite
    FW = Me.InsideWidth
    FH = Me.InsideHeight - 92
    CW = (FW - 36) / 2

    ' ---- Header ----
    Set lblM = AddCtl("Label", "lblM", "M", 12, 10, 32, 30)
    AddCtl "Label", "lblTitle", TX("appTitle"), 54, 12, 360, 26
    Set btnClose = AddCtl("CommandButton", "btnClose", TX("close"), FW - 12 - 90, 12, 90, 28)

    ' ---- Tabs ----
    Set btnTab1 = AddCtl("CommandButton", "btnTab1", TX("bStudents"), 12, 52, 160, 32)
    Set btnTab2 = AddCtl("CommandButton", "btnTab2", TX("bGrades"), 178, 52, 160, 32)
    Set btnTab3 = AddCtl("CommandButton", "btnTab3", TX("bSettings"), 344, 52, 160, 32)
    Set ln = AddCtl("Label", "lnTabs", "", 0, 86, FW, 3)
    ln.BackStyle = 1: ln.BackColor = ClrMain

    Set fraS = AddPage("fraS")
    Set fraG = AddPage("fraG")
    Set fraT = AddPage("fraT")

    BuildStudentsTab
    BuildGradesTab
    BuildSettingsTab

    StyleAll
    LoadSettings
    FillClassCombo cboClassS, False
    RefreshInfo

    If StartTab < 1 Or StartTab > 3 Then StartTab = 1
    ShowTab StartTab
End Sub

'==============================================================
'  Design
'==============================================================
Private Sub StyleAll()
    Dim ctl As Object
    For Each ctl In Me.Controls
        On Error Resume Next
        ctl.Font.Name = "Tahoma"
        On Error GoTo 0
        Select Case TypeName(ctl)
            Case "CommandButton"
                ctl.BackColor = ClrMain
                ctl.ForeColor = vbWhite
                ctl.Font.Bold = True
                ctl.Font.Size = 10
            Case "Label"
                If ctl.Name Like "chk*" Then
                    StyleCheck ctl
                Else
                    If ctl.Name <> "lnTabs" Then ctl.BackStyle = 0
                    ctl.ForeColor = RGB(55, 65, 85)
                    ctl.Font.Size = 10
                End If
            Case "TextBox", "ComboBox", "ListBox"
                ctl.Font.Size = 11
                ctl.SpecialEffect = 0
                ctl.BorderStyle = 1
                ctl.BorderColor = RGB(170, 188, 215)
        End Select
    Next ctl

    ' Special colors
    btnDelete.BackColor = RGB(200, 55, 55)
    btnPDF.BackColor = RGB(85, 95, 110)
    btnClassPDF.BackColor = RGB(85, 95, 110)
    btnClose.BackColor = RGB(120, 128, 140)
    btnRemarks.BackColor = ClrAccent

    With Me.Controls("lblTitle")
        .ForeColor = ClrMain: .Font.Size = 15: .Font.Bold = True
    End With
    With lblM
        .BackStyle = 1
        .BackColor = ClrMain
        .ForeColor = vbWhite
        .Font.Name = "Segoe UI Black"
        .Font.Size = 16
        .Font.Bold = True
        .TextAlign = 2
        .ControlTipText = "merabti.com"
    End With

    lblName.Font.Size = 13: lblName.Font.Bold = True: lblName.ForeColor = ClrDark
    lblAvg.Font.Size = 13: lblAvg.Font.Bold = True: lblAvg.ForeColor = ClrMain
    lblRemark.Font.Size = 12
    lblStatus.ForeColor = RGB(120, 128, 140)
    lblScale.Font.Bold = True: lblScale.ForeColor = ClrMain
    fraT.Controls("capCoef").Font.Bold = True
    fraT.Controls("capCoef").ForeColor = ClrMain
    fraT.Controls("capCoef").Font.Size = 12

    txtCA.TextAlign = 2: txtExam.TextAlign = 2
    txtCoefCA.TextAlign = 2: txtCoefTests.TextAlign = 2: txtCoefExam.TextAlign = 2
    txtYear.TextAlign = 2
End Sub

Private Sub ShowTab(ByVal n As Long)
    fraS.Visible = (n = 1)
    fraG.Visible = (n = 2)
    fraT.Visible = (n = 3)
    fraTests.Visible = (n = 2)
    TabColor btnTab1, (n = 1)
    TabColor btnTab2, (n = 2)
    TabColor btnTab3, (n = 3)
    If n = 2 Then
        FillClassCombo cboClassG, True
        cboClassG.ListIndex = 0
    End If
    If n = 1 Then RefreshInfo
End Sub

Private Sub TabColor(b As MSForms.CommandButton, ByVal active As Boolean)
    If active Then
        b.BackColor = ClrMain: b.ForeColor = vbWhite
    Else
        b.BackColor = RGB(232, 237, 245): b.ForeColor = RGB(60, 72, 95)
    End If
End Sub

Private Sub btnTab1_Click()
    ShowTab 1
End Sub

Private Sub btnTab2_Click()
    ShowTab 2
End Sub

Private Sub btnTab3_Click()
    ShowTab 3
End Sub

Private Sub lblM_Click()
    OpenWebsite
End Sub

Private Sub btnClose_Click()
    Unload Me
End Sub

'==============================================================
'  TAB 1  -  STUDENTS
'==============================================================
Private Sub BuildStudentsTab()
    Dim hint As Object, r2 As Single
    r2 = 24 + CW                                   ' left column

    AddCtl "Label", "capClassS", TX("hClass"), 12, 16, CW, 16, fraS
    Set cboClassS = AddCtl("ComboBox", "cboClassS", "", 12, 34, CW, 26, fraS)
    AddCtl "Label", "capName", TX("hName"), r2, 16, CW, 16, fraS
    Set txtName = AddCtl("TextBox", "txtName", "", r2, 34, CW, 26, fraS)

    Set btnAdd = AddCtl("CommandButton", "btnAdd", TX("add"), 12, 80, CW, 36, fraS)
    Set btnImport = AddCtl("CommandButton", "btnImport", TX("import"), r2, 80, CW, 36, fraS)

    Set hint = AddCtl("Label", "lblHint", TX("hint"), 12, 136, FW - 24, 36, fraS)
    hint.WordWrap = True
    Set lblInfo = AddCtl("Label", "lblInfo", "", 12, 184, FW - 24, 20, fraS)
End Sub

Private Sub RefreshInfo()
    lblInfo.Caption = TX("infoStudents") & " " & (LastRow - HDR_ROW) & "        " & _
                      TX("infoClasses") & " " & ClassList().Count
End Sub

Private Function ChosenClass() As String
    ChosenClass = Trim$(cboClassS.Text)
    If ChosenClass = "" Then
        MsgBox "Please choose or type a class (e.g. 4AM1).", vbExclamation
        cboClassS.SetFocus
    End If
End Function

Private Sub btnAdd_Click()
    Dim cls As String, nm As String
    cls = ChosenClass(): If cls = "" Then Exit Sub
    nm = Trim$(txtName.Text)
    If nm = "" Then MsgBox "Please type the student's name.", vbExclamation: txtName.SetFocus: Exit Sub

    If NameExists(cls, nm) Then
        If MsgBox("This name already exists in this class." & vbCrLf & "Add it anyway?", _
                  vbYesNo + vbExclamation, "Students") = vbNo Then txtName.SetFocus: Exit Sub
    End If

    Application.EnableEvents = False
    AddStudent cls, nm
    Application.EnableEvents = True
    FormatDataRows

    FillClassCombo cboClassS, False
    cboClassS.Text = cls
    txtName.Text = ""
    txtName.SetFocus
    RefreshInfo
End Sub

Private Sub btnImport_Click()
    Dim cls As String, txt As String, lines As Variant, i As Long, nm As String, n As Long, skipped As Long
    Dim d As New MSForms.DataObject

    cls = ChosenClass(): If cls = "" Then Exit Sub

    On Error Resume Next
    d.GetFromClipboard
    txt = d.GetText
    On Error GoTo 0
    If Trim$(txt) = "" Then MsgBox "The clipboard is empty. Copy the list of names first.", vbExclamation: Exit Sub

    txt = Replace(txt, vbCr, "")
    lines = Split(txt, vbLf)

    Application.EnableEvents = False
    For i = LBound(lines) To UBound(lines)
        nm = Trim$(Split(lines(i) & vbTab, vbTab)(0))      ' first column only
        If nm <> "" Then
            If NameExists(cls, nm) Then
                skipped = skipped + 1
            Else
                AddStudent cls, nm
                n = n + 1
            End If
        End If
    Next i
    Application.EnableEvents = True
    FormatDataRows

    FillClassCombo cboClassS, False
    cboClassS.Text = cls
    RefreshInfo
    MsgBox n & " student(s) imported into " & cls & "." & _
           IIf(skipped > 0, vbCrLf & skipped & " name(s) already existed and were skipped.", ""), _
           vbInformation, "Students"
End Sub

Private Sub txtName_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    If KeyCode = vbKeyReturn Then
        KeyCode = 0
        btnAdd_Click
    End If
End Sub

'==============================================================
'  TAB 2  -  GRADES ENTRY
'==============================================================
Private Sub BuildGradesTab()
    Dim r2 As Single, half As Single, bw As Single, bt As Single
    r2 = 24 + CW
    half = (CW - 10) / 2

    ' Right column: class, search, list
    AddCtl "Label", "capClassG", TX("hClass"), 12, 8, half, 16, fraG
    Set cboClassG = AddCtl("ComboBox", "cboClassG", "", 12, 26, half, 26, fraG)
    AddCtl "Label", "capSearch", TX("search"), 22 + half, 8, half, 16, fraG
    Set txtSearch = AddCtl("TextBox", "txtSearch", "", 22 + half, 26, half, 26, fraG)
    Set lblCount = AddCtl("Label", "lblCount", "", 12, 58, CW, 16, fraG)
    Set lstStudents = AddCtl("ListBox", "lstStudents", "", 12, 76, CW, FH - 76 - 10, fraG)
    With lstStudents
        .ColumnCount = 3
        .ColumnWidths = CLng(CW - 70) & " pt;45 pt;0 pt"
        .TextAlign = 3
    End With

    ' Left column: student, scores, buttons
    Set lblName = AddCtl("Label", "lblName", TX("select"), r2, 26, CW, 26, fraG)
    AddCtl "Label", "capCA", TX("hCA"), r2, 58, half, 16, fraG
    Set txtCA = AddCtl("TextBox", "txtCA", "", r2, 76, half, 26, fraG)
    AddCtl "Label", "capExam", TX("hExam"), r2 + half + 10, 58, half, 16, fraG
    Set txtExam = AddCtl("TextBox", "txtExam", "", r2 + half + 10, 76, half, 26, fraG)
    AddCtl "Label", "chk0", "", r2 + half - 22, 78, 20, 22, fraG
    AddCtl "Label", "chkE", "", r2 + 2 * half - 12, 78, 20, 22, fraG

    ' (a frame cannot be created inside another frame, so it sits on the form)
    Set fraTests = AddCtl("Frame", "fraTests", "", r2, fraG.Top + 112, CW, 104)
    fraTests.BackColor = ClrLight
    fraTests.BorderStyle = 1
    fraTests.BorderColor = RGB(190, 205, 228)
    BuildTestBoxes

    Set lblAvg = AddCtl("Label", "lblAvg", "", r2, 224, CW, 24, fraG)
    Set lblRemark = AddCtl("Label", "lblRemark", "", r2, 250, CW, 22, fraG)
    Set lblStatus = AddCtl("Label", "lblStatus", "", r2, 274, CW, 18, fraG)

    bw = half: bt = FH - 10 - 36
    Set btnSave = AddCtl("CommandButton", "btnSave", TX("save"), r2, bt - 44, bw, 36, fraG)
    Set btnDelete = AddCtl("CommandButton", "btnDelete", TX("delete"), r2 + bw + 10, bt - 44, bw, 36, fraG)
    Set btnPDF = AddCtl("CommandButton", "btnPDF", TX("pdf"), r2, bt, bw, 36, fraG)
    Set btnClassPDF = AddCtl("CommandButton", "btnClassPDF", TX("classPdf"), r2 + bw + 10, bt, bw, 36, fraG)
End Sub

Private Sub BuildTestBoxes()
    Dim i As Long, lb As Object, tb As Object, cap As Object
    Dim bw As Single, fr As Single, t As Single

    Set txtT1 = Nothing: Set txtT2 = Nothing: Set txtT3 = Nothing
    Set txtT4 = Nothing: Set txtT5 = Nothing: Set txtT6 = Nothing
    For i = fraTests.Controls.Count - 1 To 0 Step -1
        fraTests.Controls.Remove fraTests.Controls(i).Name
    Next i

    Set cap = AddCtl("Label", "capTestsBox", TX("tests"), 10, 4, 120, 16, fraTests)
    cap.BackStyle = 0: cap.Font.Name = "Tahoma": cap.Font.Bold = True: cap.ForeColor = ClrMain

    mTests = CurrentTests()
    bw = (CW - 20 - 2 * 10) / 3
    For i = 1 To mTests
        fr = 10 + ((i - 1) Mod 3) * (bw + 10)
        t = 22 + ((i - 1) \\ 3) * 40
        Set lb = AddCtl("Label", "lblT" & i, TestHeader(i), fr, t, bw, 14, fraTests)
        lb.BackStyle = 0: lb.Font.Name = "Tahoma": lb.ForeColor = RGB(55, 65, 85)
        Set tb = AddCtl("TextBox", "txtT" & i, "", fr, t + 14, bw, 22, fraTests)
        With tb
            .Font.Name = "Tahoma": .Font.Size = 11
            .TextAlign = 2
            .SpecialEffect = 0: .BorderStyle = 1
            .BorderColor = RGB(170, 188, 215)
        End With
        StyleCheck AddCtl("Label", "chk" & i, "", fr + bw - 20, t + 15, 18, 20, fraTests)
        Select Case i
            Case 1: Set txtT1 = tb
            Case 2: Set txtT2 = tb
            Case 3: Set txtT3 = tb
            Case 4: Set txtT4 = tb
            Case 5: Set txtT5 = tb
            Case 6: Set txtT6 = tb
        End Select
    Next i
End Sub

' Green check mark shown when a score is saved
Private Sub StyleCheck(lbl As Object)
    With lbl
        .Caption = ChrW(&H2713)
        .BackStyle = 0
        .ForeColor = RGB(0, 150, 70)
        .Font.Name = "Segoe UI Symbol"
        .Font.Size = 12
        .Font.Bold = True
        .TextAlign = 2
        .Visible = False
    End With
End Sub

'--------------------------------------------------------------
'  Score boxes: 0 = CA, 1..mTests = tests, mTests + 1 = exam
'--------------------------------------------------------------
Private Function BoxAt(ByVal k As Long) As Object
    If k = 0 Then
        Set BoxAt = txtCA
    ElseIf k <= mTests Then
        Set BoxAt = TestBox(k)
    Else
        Set BoxAt = txtExam
    End If
End Function

Private Function ChkAt(ByVal k As Long) As Object
    If k = 0 Then
        Set ChkAt = fraG.Controls("chk0")
    ElseIf k <= mTests Then
        Set ChkAt = fraTests.Controls("chk" & k)
    Else
        Set ChkAt = fraG.Controls("chkE")
    End If
End Function

Private Function ColAt(ByVal k As Long) As Long
    If k > mTests Then ColAt = ColOf(TX("hExam")) Else ColAt = ColOf(TX("hCA")) + k
End Function

Private Sub FocusBox(ByVal k As Long)
    With BoxAt(k)
        .SetFocus
        .SelStart = 0
        .SelLength = Len(.Text)
    End With
End Sub

' Saves one score, then shows the green check mark
Private Function SaveBox(ByVal k As Long) As Boolean
    Dim g As Worksheet, v As Variant, a As Variant, mx As Double

    If mRow = 0 Then MsgBox "Select a student first.", vbExclamation: Exit Function
    mx = MaxScore()
    If Not ValidBox(BoxAt(k), mx) Then Exit Function
    ParseScore BoxAt(k).Text, v, mx

    Set g = WsG
    Application.EnableEvents = False
    g.Cells(mRow, ColAt(k)).Value = v
    ' this student's average and remark (ranks are updated with the next student)
    a = CalcAverage(mRow)
    g.Cells(mRow, ColOf(TX("hAvg"))).Value = a
    If IsEmpty(a) Then
        g.Cells(mRow, ColOf(TX("hRemark"))).Value = ""
    Else
        g.Cells(mRow, ColOf(TX("hRemark"))).Value = RemarkFor(CDbl(a))
    End If
    Application.EnableEvents = True

    ChkAt(k).Visible = Not IsEmpty(v)
    ShowResult
    SaveBox = True
End Function

' Enter or Tab: save the score and go to the next box (Shift+Tab: previous box)
Private Sub ScoreKey(ByVal k As Long, ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    Dim key As Long
    key = KeyCode
    If key <> vbKeyReturn And key <> vbKeyTab Then Exit Sub
    KeyCode = 0
    If Not SaveBox(k) Then Exit Sub
    If key = vbKeyTab And (Shift And 1) = 1 Then
        If k > 0 Then FocusBox k - 1
    ElseIf k < mTests + 1 Then
        FocusBox k + 1
    Else
        NextStudent
    End If
End Sub

Private Sub NextStudent()
    Dim idx As Long
    RecalcAll
    lblStatus.Caption = TX("saved") & " " & WsG.Cells(mRow, 3).Value
    idx = lstStudents.ListIndex
    If idx < lstStudents.ListCount - 1 Then
        lstStudents.ListIndex = idx + 1
        lstStudents_Click
        FocusBox 0
    Else
        ShowResult
    End If
End Sub

Private Sub HideChecks()
    Dim k As Long
    For k = 0 To mTests + 1
        ChkAt(k).Visible = False
    Next k
End Sub

Private Sub txtCA_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 0, KeyCode, Shift
End Sub
Private Sub txtT1_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 1, KeyCode, Shift
End Sub
Private Sub txtT2_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 2, KeyCode, Shift
End Sub
Private Sub txtT3_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 3, KeyCode, Shift
End Sub
Private Sub txtT4_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 4, KeyCode, Shift
End Sub
Private Sub txtT5_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 5, KeyCode, Shift
End Sub
Private Sub txtT6_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey 6, KeyCode, Shift
End Sub
Private Sub txtExam_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)
    ScoreKey mTests + 1, KeyCode, Shift
End Sub

' Typing a new value hides the check mark until it is saved
Private Sub txtCA_Change()
    ChkAt(0).Visible = False
End Sub
Private Sub txtT1_Change()
    ChkAt(1).Visible = False
End Sub
Private Sub txtT2_Change()
    ChkAt(2).Visible = False
End Sub
Private Sub txtT3_Change()
    ChkAt(3).Visible = False
End Sub
Private Sub txtT4_Change()
    ChkAt(4).Visible = False
End Sub
Private Sub txtT5_Change()
    ChkAt(5).Visible = False
End Sub
Private Sub txtT6_Change()
    ChkAt(6).Visible = False
End Sub
Private Sub txtExam_Change()
    ChkAt(mTests + 1).Visible = False
End Sub

Private Function TestBox(ByVal i As Long) As Object
    Set TestBox = fraTests.Controls("txtT" & i)
End Function

Private Sub FillList()
    Dim g As Worksheet, r As Long, cls As String, q As String, k As Long
    Set g = WsG
    cls = cboClassG.Text
    If cls = TX("all") Then cls = ""
    q = Trim$(txtSearch.Text)

    lstStudents.Clear
    For r = HDR_ROW + 1 To LastRow
        If cls = "" Or ClassOf(r) = cls Then
            If q = "" Or InStr(1, g.Cells(r, 3).Value, q, vbTextCompare) > 0 Or CStr(g.Cells(r, 1).Value) = q Then
                lstStudents.AddItem g.Cells(r, 3).Value          ' name
                k = lstStudents.ListCount - 1
                lstStudents.List(k, 1) = g.Cells(r, 1).Value     ' ID (on the right)
                lstStudents.List(k, 2) = r                       ' sheet row (hidden)
            End If
        End If
    Next r
    lblCount.Caption = TX("count") & " " & lstStudents.ListCount
End Sub

Private Sub ClearBoxes()
    Dim i As Long
    mRow = 0
    lblName.Caption = TX("select")
    txtCA.Text = "": txtExam.Text = ""
    For i = 1 To mTests
        TestBox(i).Text = ""
    Next i
    lblAvg.Caption = ""
    lblRemark.Caption = ""
    HideChecks
End Sub

Private Function ShowNum(ByVal v As Variant) As String
    If IsEmpty(v) Then ShowNum = "" Else ShowNum = CStr(v)
End Function

Private Sub LoadStudent()
    Dim g As Worksheet, i As Long, cCA As Long
    Set g = WsG
    cCA = ColOf(TX("hCA"))
    lblName.Caption = g.Cells(mRow, 3).Value & "  (" & ClassOf(mRow) & ")"
    txtCA.Text = ShowNum(g.Cells(mRow, cCA).Value)
    For i = 1 To mTests
        TestBox(i).Text = ShowNum(g.Cells(mRow, cCA + i).Value)
        TestBox(i).BackColor = vbWhite
    Next i
    txtExam.Text = ShowNum(g.Cells(mRow, ColOf(TX("hExam"))).Value)
    txtCA.BackColor = vbWhite: txtExam.BackColor = vbWhite
    For i = 0 To mTests + 1
        ChkAt(i).Visible = (BoxAt(i).Text <> "")
    Next i
    ShowResult
End Sub

Private Sub ShowResult()
    Dim g As Worksheet, a As Variant
    Set g = WsG
    a = g.Cells(mRow, ColOf(TX("hAvg"))).Value
    If IsEmpty(a) Then
        lblAvg.Caption = TX("hAvg") & ": -"
        lblRemark.Caption = ""
    Else
        lblAvg.Caption = TX("hAvg") & ": " & Format(a, "0.00") & " / " & MaxScore() & "      " & _
                         TX("hRank") & ": " & g.Cells(mRow, ColOf(TX("hRank"))).Value & " / " & CountClass(ClassOf(mRow))
        lblRemark.Caption = g.Cells(mRow, ColOf(TX("hRemark"))).Value
    End If
End Sub

Private Function ValidBox(tb As Object, ByVal mx As Double) As Boolean
    Dim v As Variant
    If ParseScore(tb.Text, v, mx) Then
        tb.BackColor = vbWhite
        ValidBox = True
    Else
        tb.BackColor = RGB(255, 225, 225)
        MsgBox "Invalid score: " & tb.Text & vbCrLf & "Enter a number between 0 and " & mx & ".", vbExclamation
        tb.SetFocus
    End If
End Function

Private Sub cboClassG_Change()
    ClearBoxes
    FillList
End Sub

Private Sub txtSearch_Change()
    FillList
End Sub

Private Sub lstStudents_Click()
    If lstStudents.ListIndex < 0 Then Exit Sub
    mRow = CLng(lstStudents.List(lstStudents.ListIndex, 2))
    LoadStudent
End Sub

Private Sub btnSave_Click()
    Dim g As Worksheet, v As Variant, i As Long, cCA As Long, mx As Double

    If mRow = 0 Then MsgBox "Select a student first.", vbExclamation: Exit Sub
    Set g = WsG: cCA = ColOf(TX("hCA")): mx = MaxScore()

    ' 1) Check every box before writing anything
    If Not ValidBox(txtCA, mx) Then Exit Sub
    For i = 1 To mTests
        If Not ValidBox(TestBox(i), mx) Then Exit Sub
    Next i
    If Not ValidBox(txtExam, mx) Then Exit Sub

    ' 2) Write the scores
    Application.EnableEvents = False
    ParseScore txtCA.Text, v, mx: g.Cells(mRow, cCA).Value = v
    For i = 1 To mTests
        ParseScore TestBox(i).Text, v, mx: g.Cells(mRow, cCA + i).Value = v
    Next i
    ParseScore txtExam.Text, v, mx: g.Cells(mRow, ColOf(TX("hExam"))).Value = v
    Application.EnableEvents = True

    ' 3) Average, rank and remark, then the next student
    For i = 0 To mTests + 1
        ChkAt(i).Visible = (BoxAt(i).Text <> "")
    Next i
    NextStudent
End Sub

Private Sub btnDelete_Click()
    If mRow = 0 Then MsgBox "Select a student first.", vbExclamation: Exit Sub
    If MsgBox("Delete this student and all of their scores?", vbYesNo + vbQuestion, "Delete") = vbNo Then Exit Sub
    Application.EnableEvents = False
    WsG.Rows(mRow).Delete
    Application.EnableEvents = True
    RecalcAll
    ClearBoxes
    FillList
End Sub

Private Sub btnPDF_Click()
    If mRow = 0 Then MsgBox "Select a student first.", vbExclamation: Exit Sub
    ExportStudent mRow
End Sub

Private Sub btnClassPDF_Click()
    Dim cls As String
    cls = cboClassG.Text
    If cls = "" Or cls = TX("all") Then MsgBox "Choose a class first.", vbExclamation: Exit Sub
    ExportClass cls
End Sub

'==============================================================
'  TAB 3  -  SETTINGS
'==============================================================
Private Sub BuildSettingsTab()
    Dim r2 As Single, third As Single
    r2 = 24 + CW
    third = (FW - 24 - 20) / 3

    AddCtl "Label", "capSchool", TX("sSchool"), 12, 8, CW, 16, fraT
    Set txtSchool = AddCtl("TextBox", "txtSchool", "", 12, 26, CW, 26, fraT)
    AddCtl "Label", "capYear", TX("sYear"), r2, 8, CW, 16, fraT
    Set txtYear = AddCtl("TextBox", "txtYear", "", r2, 26, CW, 26, fraT)

    AddCtl "Label", "capTeacher", TX("sTeacher"), 12, 62, CW, 16, fraT
    Set txtTeacher = AddCtl("TextBox", "txtTeacher", "", 12, 80, CW, 26, fraT)
    AddCtl "Label", "capSubject", TX("sSubject"), r2, 62, CW, 16, fraT
    Set txtSubject = AddCtl("TextBox", "txtSubject", "", r2, 80, CW, 26, fraT)

    AddCtl "Label", "capTerm", TX("sTerm"), 12, 116, CW, 16, fraT
    Set cboTerm = AddCtl("ComboBox", "cboTerm", "", 12, 134, CW, 26, fraT)
    AddCtl "Label", "capLevel", TX("sLevel"), r2, 116, CW, 16, fraT
    Set cboLevel = AddCtl("ComboBox", "cboLevel", "", r2, 134, CW, 26, fraT)

    AddCtl "Label", "capTests", TX("sTests"), 12, 170, CW, 16, fraT
    Set cboTests = AddCtl("ComboBox", "cboTests", "", 12, 188, CW, 26, fraT)
    Set lblScale = AddCtl("Label", "lblScale", "", r2, 192, CW, 20, fraT)

    AddCtl "Label", "capCoef", TX("coef"), 12, 228, FW - 24, 20, fraT
    AddCtl "Label", "capCoefCA", TX("hCA"), 12, 252, third, 16, fraT
    Set txtCoefCA = AddCtl("TextBox", "txtCoefCA", "", 12, 270, third, 26, fraT)
    AddCtl "Label", "capCoefTests", TX("tests"), 22 + third, 252, third, 16, fraT
    Set txtCoefTests = AddCtl("TextBox", "txtCoefTests", "", 22 + third, 270, third, 26, fraT)
    AddCtl "Label", "capCoefExam", TX("hExam"), 32 + 2 * third, 252, third, 16, fraT
    Set txtCoefExam = AddCtl("TextBox", "txtCoefExam", "", 32 + 2 * third, 270, third, 26, fraT)

    Set btnSaveSet = AddCtl("CommandButton", "btnSaveSet", TX("saveSet"), 12, FH - 10 - 36, CW, 36, fraT)
    Set btnRemarks = AddCtl("CommandButton", "btnRemarks", TX("remarks"), r2, FH - 10 - 36, CW, 36, fraT)

    cboTerm.List = Array(TX("term1"), TX("term2"), TX("term3"))
    cboLevel.List = Array(TX("lvl1"), TX("lvl2"), TX("lvl3"))
    cboLevel.Style = fmStyleDropDownList
    cboTests.List = Array("1", "2", "3", "4", "5", "6")
    cboTests.Style = fmStyleDropDownList
End Sub

Private Sub LoadSettings()
    Dim i As Long
    txtSchool.Text = S(R_SCHOOL) & ""
    txtYear.Text = S(R_YEAR) & ""
    txtTeacher.Text = S(R_TEACHER) & ""
    txtSubject.Text = S(R_SUBJECT) & ""
    txtCoefCA.Text = S(R_COEF_CA) & ""
    txtCoefTests.Text = S(R_COEF_TESTS) & ""
    txtCoefExam.Text = S(R_COEF_EXAM) & ""
    cboTerm.Text = S(R_TERM) & ""
    For i = 0 To cboLevel.ListCount - 1
        If cboLevel.List(i) = S(R_LEVEL) & "" Then cboLevel.ListIndex = i
    Next i
    If cboLevel.ListIndex < 0 Then cboLevel.ListIndex = 1
    cboTests.ListIndex = CurrentTests() - 1
    UpdateScale
End Sub

Private Sub UpdateScale()
    If cboLevel.ListIndex = 0 Then
        lblScale.Caption = TX("scale") & " 10"
    Else
        lblScale.Caption = TX("scale") & " 20"
    End If
End Sub

Private Sub cboLevel_Change()
    UpdateScale
End Sub

Private Sub btnSaveSet_Click()
    Dim ws As Worksheet, n As Long, mx As Double
    Dim a As Variant, b As Variant, c As Variant

    If Not ParseScore(txtCoefCA.Text, a, 100) Or Not ParseScore(txtCoefTests.Text, b, 100) _
       Or Not ParseScore(txtCoefExam.Text, c, 100) Then
        MsgBox "Coefficients must be numbers.", vbExclamation: Exit Sub
    End If
    If IsEmpty(a) Or IsEmpty(b) Or IsEmpty(c) Then MsgBox "Please fill in all coefficients.", vbExclamation: Exit Sub
    If cboLevel.ListIndex < 0 Then MsgBox "Please choose a level.", vbExclamation: Exit Sub
    If cboTests.ListIndex < 0 Then MsgBox "Please choose the number of tests.", vbExclamation: Exit Sub

    n = cboTests.ListIndex + 1
    If n < CurrentTests() Then
        If MsgBox("Removing tests will delete the scores of the removed tests." & vbCrLf & "Continue?", _
                  vbYesNo + vbExclamation, "Settings") = vbNo Then Exit Sub
    End If

    If cboLevel.ListIndex = 0 Then mx = 10 Else mx = 20

    Set ws = ThisWorkbook.Worksheets(SH_SET)
    Application.EnableEvents = False
    ws.Cells(R_SCHOOL, 3).Value = txtSchool.Text
    ws.Cells(R_YEAR, 3).Value = "'" & txtYear.Text
    ws.Cells(R_TEACHER, 3).Value = txtTeacher.Text
    ws.Cells(R_SUBJECT, 3).Value = txtSubject.Text
    ws.Cells(R_TERM, 3).Value = cboTerm.Text
    ws.Cells(R_LEVEL, 3).Value = cboLevel.Text
    ws.Cells(R_MAX, 3).Value = mx
    ws.Cells(R_TESTS, 3).Value = n
    ws.Cells(R_COEF_CA, 3).Value = a
    ws.Cells(R_COEF_TESTS, 3).Value = b
    ws.Cells(R_COEF_EXAM, 3).Value = c
    ws.Cells(R_PASS, 3).Value = mx / 2

    RebuildTestColumns n
    Application.EnableEvents = True
    RecalcAll

    ' Refresh the grades tab with the new number of tests
    BuildTestBoxes
    ClearBoxes

    MsgBox "Settings saved.", vbInformation, "Settings"
End Sub

Private Sub btnRemarks_Click()
    Unload Me
    ThisWorkbook.Worksheets(SH_SET).Activate
    ThisWorkbook.Worksheets(SH_SET).Range("G" & REM_FIRST_ROW).Select
End Sub`,
      },
    ],
    fileUrl: 'files/lesson-03-student-grades.xlsm', // ← ملف .xlsm للدرس 3
    locked: false,
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
