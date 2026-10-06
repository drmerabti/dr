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
    youtubeUrl: 'https://youtu.be/TsVqQ0XoOzo', // ← رابط مؤقت للدرس 2 (يُستبدل بالرابط الرسمي)
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
