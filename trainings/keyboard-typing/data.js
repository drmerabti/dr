/* =====================================================================
   Keyboard typing trainer — data (layouts, texts, translations)
   ===================================================================== */
(function (root) {
  'use strict';

  /* ---------- Physical key codes (KeyboardEvent.code) ---------- */
  var R0 = ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal'];
  var R1 = ['KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight'];
  var R2 = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote'];
  var R3 = ['KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash'];

  /* Fingers: L5 = left pinky … L2 = left index, T = thumbs, R2 = right index … R5 = right pinky */
  var F0 = ['L5','L5','L4','L3','L2','L2','R2','R2','R3','R4','R5','R5','R5'];
  var F1 = ['L5','L4','L3','L2','L2','R2','R2','R3','R4','R5','R5','R5'];
  var F2 = ['L5','L4','L3','L2','L2','R2','R2','R3','R4','R5','R5'];
  var F3 = ['L5','L4','L3','L2','L2','R2','R2','R3','R4','R5'];

  function keys(codes, base, shift, fingers) {
    return codes.map(function (c, i) {
      return { code: c, base: base[i] || '', shift: shift[i] || '', finger: fingers[i] };
    });
  }
  function sp(code, label, w, finger) { return { code: code, special: true, label: label, w: w, finger: finger || '' }; }
  function split(s) { return Array.from(s); }

  var SPACE_ROW = [sp('ControlLeft', 'Ctrl', 1.75), sp('AltLeft', 'Alt', 1.5), { code: 'Space', base: ' ', shift: '', finger: 'T', w: 8.5, space: true }, sp('AltRight', 'Alt', 1.5), sp('ControlRight', 'Ctrl', 1.75)];

  /* ---------- English (US QWERTY) ---------- */
  var EN = {
    id: 'en', dir: 'ltr', dead: [],
    rows: [
      keys(R0, split('`1234567890-='), split('~!@#$%^&*()_+'), F0).concat([sp('Backspace', '⌫', 2)]),
      [sp('Tab', 'Tab', 1.5)].concat(keys(R1, split('qwertyuiop[]'), split('QWERTYUIOP{}'), F1), [{ code: 'Backslash', base: '\\', shift: '|', finger: 'R5', w: 1.5 }]),
      [sp('CapsLock', 'Caps', 1.75)].concat(keys(R2, split("asdfghjkl;'"), split('ASDFGHJKL:"'), F2), [sp('Enter', 'Enter', 2.25)]),
      [sp('ShiftLeft', '⇧', 2.25, 'L5')].concat(keys(R3, split('zxcvbnm,./'), split('ZXCVBNM<>?'), F3), [sp('ShiftRight', '⇧', 2.75, 'R5')]),
      SPACE_ROW
    ]
  };

  /* ---------- French (AZERTY) ---------- */
  var FR = {
    id: 'fr', dir: 'ltr', dead: ['BracketLeft', 'Backquote'],
    rows: [
      keys(R0, ['²','&','é','"',"'",'(','-','è','_','ç','à',')','='], ['','1','2','3','4','5','6','7','8','9','0','°','+'], F0).concat([sp('Backspace', '⌫', 2)]),
      [sp('Tab', 'Tab', 1.5)].concat(keys(R1, split('azertyuiop^$'), split('AZERTYUIOP¨£'), F1), [sp('Enter', 'Entrée', 1.5)]),
      [sp('CapsLock', 'Maj', 1.75)].concat(keys(R2.concat(['Backslash']), split('qsdfghjklmù*'), split('QSDFGHJKLM%µ'), F2.concat(['R5'])), [sp('EnterLow', '', 1.25)]),
      [sp('ShiftLeft', '⇧', 1.25, 'L5')].concat(keys(['IntlBackslash'].concat(R3), split('<wxcvbn,;:!'), split('>WXCVBN?./§'), ['L5'].concat(F3)), [sp('ShiftRight', '⇧', 2.75, 'R5')]),
      SPACE_ROW
    ]
  };

  /* ---------- Arabic (101, on a standard physical keyboard) ---------- */
  var AR = {
    id: 'ar', dir: 'rtl', dead: [],
    rows: [
      keys(R0, ['ذ','1','2','3','4','5','6','7','8','9','0','-','='], ['ّ','!','@','#','$','%','^','&','*',')','(','_','+'], F0).concat([sp('Backspace', '⌫', 2)]),
      [sp('Tab', 'Tab', 1.5)].concat(keys(R1, ['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د'], ['َ','ً','ُ','ٌ','لإ','إ','‘','÷','×','؛','<','>'], F1), [{ code: 'Backslash', base: '\\', shift: '|', finger: 'R5', w: 1.5 }]),
      [sp('CapsLock', 'Caps', 1.75)].concat(keys(R2, ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'], ['ِ','ٍ',']','[','لأ','أ','ـ','،','/',':','"'], F2), [sp('Enter', 'Enter', 2.25)]),
      [sp('ShiftLeft', '⇧', 2.25, 'L5')].concat(keys(R3, ['ئ','ء','ؤ','ر','لا','ى','ة','و','ز','ظ'], ['~','ْ','}','{','لآ','آ','’',',','.','؟'], F3), [sp('ShiftRight', '⇧', 2.75, 'R5')]),
      SPACE_ROW
    ]
  };

  /* ---------- Word lists (base keys only, no Shift) ---------- */
  var WORDS = {
    ar: ('بيت بنت كتب كتاب سمك ملك مال كلمات مكتب نبات سلام يمين كيس بنك سليم بسيط بساتين تسلم لبنان سماء ' +
         'قلم باب شمس قمر بحر جبل مدينة طريق سيارة شجرة صديق عمل وقت يوم ليلة ماء خبز حليب مدرسة ' +
         'محرك كهرباء صيانة مصنع طاقة تيار جهد مقاومة مولد قاطع محول ضغط حرارة زيت مضخة فرن طاحونة ' +
         'مهندس مكتب دراسة مشروع تقرير لوحة مفاتيح حرف كلمة جملة نص سرعة دقة يد اصبع شاشة ضوء صوت ' +
         'فريق سلامة جودة مراقبة نظام قياس صمام كابل حساس دائرة تشغيل توقف انتاج خزان رمل حجر').split(' '),
    en: ('ask sad dad lad fall hall glass flask salad gala half flash shall add all has had lass ' +
         'machine motor power energy plant cement pump valve cable wire sensor circuit current voltage ' +
         'filter water steam heat speed rotor bearing shaft kiln mill silo engineer project study office ' +
         'report keyboard letter word typing practice quick slow hand finger screen light sound time day ' +
         'night work team safety quality control system first hour tower stone paper write your trip ' +
         'quiet type route output price route tutor quote pure').split(' '),
    fr: ('salut soupe tapis sirop outil faute plaque route poste stylo papier tarte ' +
         'maison travail moteur courant tension usine ciment pompe machine piston filtre vanne ' +
         'entretien bureau projet ligne circuit capteur puissance contrôle soudure rotor stator arbre ' +
         'roulement vitesse pression chaleur four broyeur silo clinker argile calcaire sable eau air gaz ' +
         'feu jour nuit main clavier lettre mot phrase texte lire apprendre rapide lent bien avec pour ' +
         'dans sur sous école étude énergie sécurité électrique réseau débit équipe qualité').split(' ')
  };

  var SHIFT_TEXT = {
    ar: ['أحمد مهندس في المصنع.', 'إنتاج الإسمنت يحتاج إلى طاقة كبيرة.', 'هل أنت مستعد للتدريب؟',
         'آلة جديدة، ومحرك قوي.', 'أين دفتر الصيانة؟', 'أسرع قليلا، وحافظ على الدقة.',
         'إذا ارتفعت الحرارة أوقف الآلة.', 'أمل وأسماء في المكتب.'],
    en: ['Paris, London, Algiers and Cairo.', 'John and Sara work in Oran.', 'Is the pump ready?',
         'Stop the machine now!', 'Monday, Tuesday and Friday.', 'The CEO visited the plant.',
         'Keep Calm and Type Fast.', 'Dr Merabti teaches Word and Excel.'],
    fr: ['Paris, Alger et Oran.', 'Karim et Sara travaillent à Béchar.', 'La pompe est-elle en marche ?',
         'Stop, coupe la machine !', 'Lundi, Mardi et Vendredi.', 'Bonjour Madame Benali.',
         'Le Dr Merabti enseigne Word et Excel.', 'Vive la Pratique !']
  };

  var NUM_TEXT = {
    ar: ['المحرك يعمل على 380 فولط و50 هرتز.', 'وزن الكيس 50 كلغ.', 'الفرن يصل إلى 1450 درجة.',
         'بدأ التدريب يوم 15 من الشهر 9 سنة 2026.', 'اتصل بالرقم 0555 12 34 56.', 'المضخة تدفع 120 مترا مكعبا في الساعة.'],
    en: ['The motor runs at 380 V and 50 Hz.', 'Each bag weighs 50 kg.', 'The kiln reaches 1450 degrees.',
         'Training started on 15/09/2026.', 'Call 0555 12 34 56 today.', 'The pump moves 120 m3 per hour.'],
    fr: ['Le moteur tourne sous 380 V et 50 Hz.', 'Chaque sac pèse 50 kg.', 'Le four atteint 1450 degrés.',
         'La formation commence le 15/09/2026.', 'Appelle le 0555 12 34 56.', 'La pompe débite 120 m3 par heure.']
  };

  var SENTENCES = {
    ar: ['الصيانة الدورية تحمي المحرك من الأعطال.', 'الكتابة السريعة مهارة يحتاجها كل موظف.',
         'تدرب كل يوم عشر دقائق وسترى الفرق.', 'المصنع يعمل ليلا ونهارا دون توقف.',
         'قبل تشغيل الآلة تأكد من شروط السلامة.', 'الطاقة الكهربائية تتحول إلى حركة داخل المحرك.',
         'انظر إلى الشاشة ولا تنظر إلى يديك.', 'الدقة أهم من السرعة في البداية.',
         'يقيس المهندس التيار والجهد قبل التدخل.', 'الفرن يحتاج إلى مراقبة مستمرة للحرارة.',
         'اكتب ببطء ثم زد سرعتك تدريجيا.', 'العمل الجماعي يصنع النجاح في المؤسسة.',
         'المحول يرفع الجهد أو يخفضه حسب الحاجة.', 'كل خطأ صغير اليوم درس مفيد للغد.',
         'يجب تسجيل كل تدخل في دفتر الصيانة.', 'التدريب المنتظم يجعل الأصابع تحفظ مكان الحروف.'],
    en: ['Regular maintenance keeps the motor running smoothly.', 'Fast typing is a useful skill for every engineer.',
         'Practice ten minutes every day and you will see progress.', 'Look at the screen and not at your hands.',
         'Accuracy comes first, speed will follow.', 'The plant works day and night without stopping.',
         'Check the safety rules before starting the machine.', 'Electrical energy becomes motion inside the motor.',
         'The engineer measures current and voltage first.', 'The kiln needs constant temperature monitoring.',
         'Type slowly at first, then increase your speed.', 'Teamwork builds success in every company.',
         'A transformer raises or lowers the voltage.', 'Every small mistake today is a lesson for tomorrow.',
         'Write every repair in the maintenance log.', 'Regular training teaches your fingers where the keys are.'],
    fr: ['La maintenance régulière protège le moteur.', 'Taper vite est une compétence utile pour chaque ingénieur.',
         'Pratique dix minutes par jour et tu verras la différence.', "Regarde l'écran et non tes mains.",
         "La précision d'abord, la vitesse viendra ensuite.", "L'usine travaille jour et nuit sans pause.",
         'Vérifie les règles de sécurité avant de démarrer la machine.', "L'énergie électrique devient mouvement dans le moteur.",
         "L'ingénieur mesure le courant et la tension.", 'Le four demande une surveillance constante de la température.',
         'Tape lentement au début, puis augmente ta vitesse.', "Le travail d'équipe construit la réussite.",
         'Le transformateur élève ou abaisse la tension.', 'Chaque petite erreur est une leçon pour demain.',
         'Note chaque intervention dans le cahier de maintenance.', 'Avec la pratique, tes doigts trouvent seuls les touches.']
  };

  /* ---------- Translations ---------- */
  var I18N = {
    ar: {
      finishPrev: 'أكمل المرحلة السابقة أولا',
      layoutNames: { ar: 'العربية', fr: 'الفرنسية AZERTY', en: 'الإنجليزية QWERTY' },
      certHeading: 'شهادة إتمام', certCertifies: 'تشهد أكاديمية مرابطي بأن',
      certBody: 'أتمّ بنجاح المرحلة {n}: {s}', certBody2: 'في التدريب على لوحة المفاتيح ({l})',
      certStats: 'بمعدل سرعة {w} كلمة في الدقيقة ودقة {a}%', certDate: 'التاريخ', certSign: 'د. سفيان مرابطي',
      pageTitle: 'التدريب على لوحة المفاتيح — أكاديمية مرابطي',
      title: 'التدريب على لوحة المفاتيح',
      back: 'رجوع',
      stagesTitle: 'اختر المرحلة',
      stagesSub: '8 مراحل تصاعدية، تمارين قصيرة، والزر المطلوب يضيء أمامك',
      layoutHint: 'اختر لغة الكتابة، وتأكد أن لوحة المفاتيح في جهازك على نفس اللغة (Alt + Shift)',
      mobileNote: 'هذه الأداة تحتاج لوحة مفاتيح حقيقية، استعملها من الحاسوب للحصول على أفضل نتيجة.',
      stage: 'المرحلة', exercise: 'تمرين', exercises: 'تمارين',
      lockedStage: 'مقفلة', loginToOpen: 'سجّل الدخول لفتحها',
      stageNames: ['صف الارتكاز', 'الصف العلوي', 'الصف السفلي', 'الكلمات', 'Shift والهمزات', 'الأرقام والرموز', 'الجمل', 'السرعة والكتابة العمياء'],
      stageNamesLatin: ['صف الارتكاز', 'الصف العلوي', 'الصف السفلي', 'الكلمات', 'Shift والحروف الكبيرة', 'الأرقام والرموز', 'الجمل', 'السرعة والكتابة العمياء'],
      stageIntro: [
        'ضع أصابعك على صف الارتكاز، والسبابتان على الزرين اللذين عليهما نتوء صغير.',
        'اصعد بالإصبع إلى الصف العلوي ثم أرجعه مباشرة إلى مكانه في صف الارتكاز.',
        'انزل بالإصبع إلى الصف السفلي ثم أرجعه إلى صف الارتكاز.',
        'الآن كلمات كاملة من كل الصفوف. حافظ على الإيقاع.',
        'اضغط Shift بخنصر اليد الأخرى، ثم الحرف المطلوب.',
        'الأرقام في الصف الأعلى. مدّ الإصبع ثم أرجعه إلى صف الارتكاز.',
        'جمل كاملة مع المسافات وعلامات الترقيم.',
        'نصوص أطول. في التمارين الأخيرة لا تضيء الأزرار، اكتب من ذاكرتك.'
      ],
      newKeys: 'مفاتيح جديدة', review: 'مراجعة', words: 'كلمات', sentences: 'جمل', capitals: 'Shift',
      numbers: 'أرقام', symbols: 'رموز', paragraph: 'فقرة', blind: 'بدون إضاءة', practiceText: 'نص',
      start: 'ابدأ', pressToStart: 'أو اضغط على Space للبدء',
      wpm: 'كلمة/دقيقة', accuracy: 'الدقة', time: 'الوقت',
      resGreat: 'ممتاز!', resGood: 'أحسنت!', resRetry: 'حاول مرة أخرى',
      resMsgPass: 'انتقل إلى التمرين التالي.', resMsgFail: 'تحتاج دقة 90% على الأقل للانتقال.',
      resMsgStage: 'أتممت المرحلة كاملة، يمكنك الحصول على شهادتك.',
      next: 'التمرين التالي', nextStage: 'المرحلة التالية', retry: 'إعادة التمرين', backToStages: 'رجوع للمراحل', backToExercises: 'رجوع للتمارين',
      kbdTip: 'Enter للتالي · Esc للخروج',
      shareLabel: 'شارك إنجازك:',
      shareText: 'حققت {w} كلمة في الدقيقة بدقة {a}% في التدريب على لوحة المفاتيح — أكاديمية مرابطي',
      lockedTitle: 'هذه المرحلة تتطلب تسجيل الدخول', lockedMsg: 'سجّل دخولك من الصفحة الرئيسية لفتح المراحل من 3 إلى 8 وحفظ تقدمك.',
      goLogin: 'الذهاب لتسجيل الدخول',
      lookScreen: 'انظر إلى الشاشة لا إلى يديك',
      useFinger: 'استعمل: {f}', withShift: '+ Shift',
      wrongLayout: 'لغة لوحة المفاتيح في جهازك لا تطابق التمرين. غيّرها بـ Alt + Shift أو Win + Space',
      capsOn: 'زر Caps Lock مفعّل، أوقفه',
      fingers: { L5: 'الخنصر الأيسر', L4: 'البنصر الأيسر', L3: 'الوسطى اليسرى', L2: 'السبابة اليسرى', T: 'الإبهام', R2: 'السبابة اليمنى', R3: 'الوسطى اليمنى', R4: 'البنصر الأيمن', R5: 'الخنصر الأيمن' },
      tut: ['هنا يظهر ما يجب أن تكتبه، والحرف الحالي مُعلَّم.', 'الزر المطلوب يضيء على اللوحة، ويتلوّن الإصبع الذي يضغطه.', 'هنا ترى سرعتك ودقتك وتقدمك في التمرين.'],
      tutNext: 'التالي', tutDone: 'فهمت، لنبدأ',
      tKeyboard: 'إظهار/إخفاء اللوحة', tHands: 'إظهار/إخفاء اليدين', tSound: 'الصوت', tFull: 'ملء الشاشة',
      getCert: 'احصل على شهادتك', certNameTitle: 'بيانات الشهادة', certNameHint: 'هذه البيانات تُستخدم لإصدار شهادتك عند إتمام أي مرحلة.',
      firstName: 'الاسم', lastName: 'اللقب', cont: 'متابعة', certReady: 'شهادتك جاهزة!', close: 'إغلاق', share: 'مشاركة', download: 'تحميل'
    },
    en: {
      finishPrev: 'Complete the previous stage first',
      layoutNames: { ar: 'Arabic', fr: 'French AZERTY', en: 'English QWERTY' },
      certHeading: 'Certificate of Completion', certCertifies: 'Merabti Academy certifies that',
      certBody: 'has successfully completed Stage {n}: {s}', certBody2: 'of the Keyboard Typing Training ({l})',
      certStats: 'with an average speed of {w} WPM and {a}% accuracy', certDate: 'Date', certSign: 'Dr Soufiane Merabti',
      pageTitle: 'Keyboard Typing Training — Merabti Academy',
      title: 'Keyboard Typing Training',
      back: 'Back',
      stagesTitle: 'Choose a stage',
      stagesSub: '8 progressive stages, short exercises, and the key you need lights up',
      layoutHint: 'Pick the typing language and make sure your computer keyboard uses the same one (Alt + Shift)',
      mobileNote: 'This tool needs a real keyboard. Use it on a computer for the best result.',
      stage: 'Stage', exercise: 'Exercise', exercises: 'exercises',
      lockedStage: 'Locked', loginToOpen: 'Log in to unlock',
      stageNames: ['Home row', 'Top row', 'Bottom row', 'Words', 'Shift & hamza', 'Numbers & symbols', 'Sentences', 'Speed & touch typing'],
      stageNamesLatin: ['Home row', 'Top row', 'Bottom row', 'Words', 'Shift & capitals', 'Numbers & symbols', 'Sentences', 'Speed & touch typing'],
      stageIntro: [
        'Rest your fingers on the home row, with both index fingers on the keys with a small bump.',
        'Reach up to the top row, then bring the finger straight back to the home row.',
        'Reach down to the bottom row, then return to the home row.',
        'Now full words from every row. Keep a steady rhythm.',
        'Press Shift with the pinky of the other hand, then the key.',
        'Numbers are on the top row. Stretch the finger, then come back home.',
        'Full sentences with spaces and punctuation.',
        'Longer texts. In the last exercises the keys do not light up — type from memory.'
      ],
      newKeys: 'New keys', review: 'Review', words: 'Words', sentences: 'Sentences', capitals: 'Shift',
      numbers: 'Numbers', symbols: 'Symbols', paragraph: 'Paragraph', blind: 'No highlight', practiceText: 'Text',
      start: 'Start', pressToStart: 'or press Space to begin',
      wpm: 'WPM', accuracy: 'Accuracy', time: 'Time',
      resGreat: 'Excellent!', resGood: 'Well done!', resRetry: 'Try again',
      resMsgPass: 'Move on to the next exercise.', resMsgFail: 'You need at least 90% accuracy to move on.',
      resMsgStage: 'You completed the whole stage — get your certificate.',
      next: 'Next exercise', nextStage: 'Next stage', retry: 'Retry', backToStages: 'Back to stages', backToExercises: 'Back to exercises',
      kbdTip: 'Enter for next · Esc to exit',
      shareLabel: 'Share your result:',
      shareText: 'I typed {w} WPM with {a}% accuracy in Keyboard Typing Training — Merabti Academy',
      lockedTitle: 'This stage requires login', lockedMsg: 'Log in from the home page to unlock stages 3 to 8 and save your progress.',
      goLogin: 'Go to login',
      lookScreen: 'Look at the screen, not at your hands',
      useFinger: 'Use: {f}', withShift: '+ Shift',
      wrongLayout: 'Your computer keyboard language does not match this exercise. Switch it with Alt + Shift or Win + Space',
      capsOn: 'Caps Lock is on — turn it off',
      fingers: { L5: 'Left pinky', L4: 'Left ring finger', L3: 'Left middle finger', L2: 'Left index finger', T: 'Thumb', R2: 'Right index finger', R3: 'Right middle finger', R4: 'Right ring finger', R5: 'Right pinky' },
      tut: ['This is what you type. The current character is marked.', 'The key lights up on the keyboard, and the finger to use is colored.', 'Here you see your speed, accuracy and progress.'],
      tutNext: 'Next', tutDone: 'Got it, let\'s start',
      tKeyboard: 'Show/hide keyboard', tHands: 'Show/hide hands', tSound: 'Sound', tFull: 'Full screen',
      getCert: 'Get your certificate', certNameTitle: 'Certificate details', certNameHint: 'These details are used for your certificate whenever you complete a stage.',
      firstName: 'First name', lastName: 'Last name', cont: 'Continue', certReady: 'Your certificate is ready!', close: 'Close', share: 'Share', download: 'Download'
    },
    fr: {
      finishPrev: "Termine d'abord l'étape précédente",
      layoutNames: { ar: 'Arabe', fr: 'Français AZERTY', en: 'Anglais QWERTY' },
      pageTitle: 'Entraînement au clavier — Académie Merabti',
      title: 'Entraînement au clavier',
      back: 'Retour',
      stagesTitle: 'Choisis une étape',
      stagesSub: '8 étapes progressives, des exercices courts, et la touche à frapper s\'allume',
      layoutHint: 'Choisis la langue de frappe et vérifie que le clavier de ton ordinateur est dans la même langue (Alt + Maj)',
      mobileNote: 'Cet outil nécessite un vrai clavier. Utilise-le sur un ordinateur.',
      stage: 'Étape', exercise: 'Exercice', exercises: 'exercices',
      lockedStage: 'Verrouillée', loginToOpen: 'Connecte-toi pour débloquer',
      stageNames: ['Rangée de base', 'Rangée du haut', 'Rangée du bas', 'Mots', 'Shift et hamza', 'Chiffres et symboles', 'Phrases', 'Vitesse et frappe à l\'aveugle'],
      stageNamesLatin: ['Rangée de base', 'Rangée du haut', 'Rangée du bas', 'Mots', 'Majuscules (Shift)', 'Chiffres et symboles', 'Phrases', 'Vitesse et frappe à l\'aveugle'],
      stageIntro: [
        'Pose tes doigts sur la rangée de base, les index sur les touches avec un petit relief.',
        'Monte vers la rangée du haut puis reviens aussitôt à la rangée de base.',
        'Descends vers la rangée du bas puis reviens à la rangée de base.',
        'Maintenant des mots complets de toutes les rangées. Garde un rythme régulier.',
        'Appuie sur Shift avec l\'auriculaire de l\'autre main, puis sur la touche.',
        'Les chiffres sont sur la rangée du haut. En AZERTY, ils demandent Shift.',
        'Des phrases complètes avec espaces et ponctuation.',
        'Des textes plus longs. Dans les derniers exercices, les touches ne s\'allument plus.'
      ],
      newKeys: 'Nouvelles touches', review: 'Révision', words: 'Mots', sentences: 'Phrases', capitals: 'Shift',
      numbers: 'Chiffres', symbols: 'Symboles', paragraph: 'Paragraphe', blind: 'Sans aide', practiceText: 'Texte',
      start: 'Commencer', pressToStart: 'ou appuie sur Espace',
      wpm: 'mots/min', accuracy: 'Précision', time: 'Temps',
      resGreat: 'Excellent !', resGood: 'Bravo !', resRetry: 'Réessaie',
      resMsgPass: 'Passe à l\'exercice suivant.', resMsgFail: 'Il faut au moins 90 % de précision pour avancer.',
      resMsgStage: 'Tu as terminé toute l\'étape, récupère ton certificat.',
      next: 'Exercice suivant', nextStage: 'Étape suivante', retry: 'Recommencer', backToStages: 'Retour aux étapes', backToExercises: 'Retour aux exercices',
      kbdTip: 'Entrée pour continuer · Échap pour quitter',
      shareLabel: 'Partage ton résultat :',
      shareText: 'J\'ai tapé {w} mots/min avec {a}% de précision — Académie Merabti',
      lockedTitle: 'Cette étape nécessite une connexion', lockedMsg: 'Connecte-toi depuis la page d\'accueil pour débloquer les étapes 3 à 8 et sauvegarder ta progression.',
      goLogin: 'Aller à la connexion',
      lookScreen: 'Regarde l\'écran, pas tes mains',
      useFinger: 'Utilise : {f}', withShift: '+ Shift',
      wrongLayout: 'La langue du clavier de ton ordinateur ne correspond pas à l\'exercice. Change-la avec Alt + Maj ou Win + Espace',
      capsOn: 'Verr. Maj est activé, désactive-le',
      fingers: { L5: 'Auriculaire gauche', L4: 'Annulaire gauche', L3: 'Majeur gauche', L2: 'Index gauche', T: 'Pouce', R2: 'Index droit', R3: 'Majeur droit', R4: 'Annulaire droit', R5: 'Auriculaire droit' },
      tut: ['Voici ce que tu dois taper. Le caractère actuel est marqué.', 'La touche s\'allume sur le clavier et le doigt à utiliser se colore.', 'Ici tu vois ta vitesse, ta précision et ta progression.'],
      tutNext: 'Suivant', tutDone: 'Compris, on commence',
      tKeyboard: 'Afficher/masquer le clavier', tHands: 'Afficher/masquer les mains', tSound: 'Son', tFull: 'Plein écran',
      getCert: 'Obtenir ton certificat', certNameTitle: 'Informations du certificat', certNameHint: 'Ces informations servent à ton certificat à la fin de chaque étape.',
      firstName: 'Prénom', lastName: 'Nom', cont: 'Continuer', certReady: 'Ton certificat est prêt !', close: 'Fermer', share: 'Partager', download: 'Télécharger'
    }
  };

  root.TT_DATA = {
    LAYOUTS: { ar: AR, fr: FR, en: EN },
    WORDS: WORDS, SHIFT_TEXT: SHIFT_TEXT, NUM_TEXT: NUM_TEXT, SENTENCES: SENTENCES, I18N: I18N
  };
})(typeof window !== 'undefined' ? window : globalThis);
