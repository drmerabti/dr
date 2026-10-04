// ============================================================
// examples.js — complete example cover per language, plus the
// themed examples some designs use. Shown only while the matching
// section is empty; nothing here is stored in the user's data.
// jury rows: [name, rank, institution, role index]
// ============================================================
window.COVER_EXAMPLES = {
  base: {
    ar: {
      country: 'الجمهورية الجزائرية الديمقراطية الشعبية', ministry: 'وزارة التعليم العالي والبحث العلمي',
      uni: 'جامعة سعد دحلب البليدة 1', faculty: 'كلية التكنولوجيا', dept: 'قسم الإلكترونيك', host: '', website: '',
      workType: 'مذكرة تخرج لنيل شهادة الماستر', title: 'دراسة وتحسين أداء منظومة كهروضوئية موصولة بالشبكة الكهربائية',
      subtitle: 'حالة محطة الطاقة الشمسية بالأغواط',
      students: ['أمينة بن علي', 'يوسف قاسمي'], supervisor: 'د. سفيان مرابطي', coSup: '',
      jury: [['أ.د. محمد بلقاسم', 'أستاذ', 'جامعة البليدة 1', 1], ['د. سفيان مرابطي', 'أستاذ محاضر أ', 'جامعة البليدة 1', 0], ['د. نادية حمدي', 'أستاذة محاضرة ب', 'جامعة البليدة 1', 2]],
      level: 'السنة الثانية ماستر', specialty: 'الإلكترونيك الصناعية',
      year: 'السنة الجامعية 2025 / 2026', place: 'البليدة', date: '',
    },
    fr: {
      country: 'République Algérienne Démocratique et Populaire', ministry: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
      uni: 'Université Saad Dahlab Blida 1', faculty: 'Faculté de Technologie', dept: "Département d'Électronique", host: '', website: '',
      workType: "Mémoire de fin d'études en vue de l'obtention du diplôme de Master", title: "Étude et optimisation des performances d'un système photovoltaïque connecté au réseau",
      subtitle: 'Cas de la centrale solaire de Laghouat',
      students: ['Amina Benali', 'Youcef Kacimi'], supervisor: 'Dr Sofiane Merabti', coSup: '',
      jury: [['Pr Mohamed Belkacem', 'Professeur', 'Université Blida 1', 1], ['Dr Sofiane Merabti', 'MCA', 'Université Blida 1', 0], ['Dr Nadia Hamdi', 'MCB', 'Université Blida 1', 2]],
      level: 'Master 2', specialty: 'Électronique industrielle',
      year: 'Année universitaire 2025 / 2026', place: 'Blida', date: '',
    },
    en: {
      country: "People's Democratic Republic of Algeria", ministry: 'Ministry of Higher Education and Scientific Research',
      uni: 'Saad Dahlab University of Blida 1', faculty: 'Faculty of Technology', dept: 'Department of Electronics', host: '', website: '',
      workType: "Master's thesis submitted in partial fulfilment of the Master's degree", title: 'Study and Performance Optimization of a Grid-Connected Photovoltaic System',
      subtitle: 'Case study: the Laghouat solar power plant',
      students: ['Amina Benali', 'Youcef Kacimi'], supervisor: 'Dr Sofiane Merabti', coSup: '',
      jury: [['Prof. Mohamed Belkacem', 'Professor', 'University of Blida 1', 1], ['Dr Sofiane Merabti', 'Associate Professor', 'University of Blida 1', 0], ['Dr Nadia Hamdi', 'Assistant Professor', 'University of Blida 1', 2]],
      level: 'Second year of Master', specialty: 'Industrial Electronics',
      year: 'Academic year 2025 / 2026', place: 'Blida', date: '',
    },
  },
  // per design (only the fields that differ from base)
  phd: {
    ar: { workType: 'أطروحة مقدمة لنيل شهادة الدكتوراه في العلوم', title: 'نمذجة وتحكم أمثل في منظومات الطاقة المتجددة الهجينة المرتبطة بالشبكة', subtitle: '', students: ['سفيان مرابطي'], level: 'دكتوراه علوم', specialty: 'أنظمة الطاقة المتجددة', date: '12 جوان 2026',
      jury: [['أ.د. محمد بلقاسم', 'أستاذ', 'جامعة البليدة 1', 1], ['أ.د. عبد الرحمن زيان', 'أستاذ', 'جامعة البليدة 1', 0], ['د. نادية حمدي', 'أستاذة محاضرة أ', 'جامعة الجزائر 1', 2], ['د. كريم بن عيسى', 'أستاذ محاضر أ', 'جامعة المدية', 2], ['أ.د. ليلى عمراني', 'أستاذة', 'المدرسة الوطنية المتعددة التقنيات', 2]], supervisor: 'أ.د. عبد الرحمن زيان' },
    fr: { workType: 'Thèse présentée en vue de l’obtention du diplôme de Doctorat en Sciences', title: 'Modélisation et commande optimale des systèmes hybrides à énergies renouvelables connectés au réseau', subtitle: '', students: ['Sofiane Merabti'], level: 'Doctorat en Sciences', specialty: 'Systèmes à énergies renouvelables', date: '12 juin 2026',
      jury: [['Pr Mohamed Belkacem', 'Professeur', 'Université Blida 1', 1], ['Pr Abderrahmane Ziane', 'Professeur', 'Université Blida 1', 0], ['Dr Nadia Hamdi', 'MCA', 'Université Alger 1', 2], ['Dr Karim Benaissa', 'MCA', 'Université de Médéa', 2], ['Pr Leila Amrani', 'Professeure', 'École Nationale Polytechnique', 2]], supervisor: 'Pr Abderrahmane Ziane' },
    en: { workType: 'Dissertation submitted for the degree of Doctor of Science', title: 'Modelling and Optimal Control of Grid-Connected Hybrid Renewable Energy Systems', subtitle: '', students: ['Sofiane Merabti'], level: 'Doctor of Science', specialty: 'Renewable Energy Systems', date: '12 June 2026',
      jury: [['Prof. Mohamed Belkacem', 'Professor', 'University of Blida 1', 1], ['Prof. Abderrahmane Ziane', 'Professor', 'University of Blida 1', 0], ['Dr Nadia Hamdi', 'Associate Professor', 'University of Algiers 1', 2], ['Dr Karim Benaissa', 'Associate Professor', 'University of Medea', 2], ['Prof. Leila Amrani', 'Professor', 'National Polytechnic School', 2]], supervisor: 'Prof. Abderrahmane Ziane' },
  },
  project: {
    ar: { workType: 'مشروع دراسي في مقياس الطاقات المتجددة', title: 'تصميم منظومة ضخ شمسي لري مستثمرة فلاحية', subtitle: '', level: 'السنة الأولى ماستر', specialty: 'الطاقات المتجددة', students: ['أمينة بن علي', 'يوسف قاسمي', 'رانية سعيدي'] },
    fr: { workType: "Projet d'étude — module Énergies renouvelables", title: "Conception d'un système de pompage solaire pour l'irrigation d'une exploitation agricole", subtitle: '', level: 'Master 1', specialty: 'Énergies renouvelables', students: ['Amina Benali', 'Youcef Kacimi', 'Rania Saidi'] },
    en: { workType: 'Study project — Renewable Energy module', title: 'Design of a Solar Pumping System for Farm Irrigation', subtitle: '', level: 'First year of Master', specialty: 'Renewable Energy', students: ['Amina Benali', 'Youcef Kacimi', 'Rania Saidi'] },
  },
  corporate: {
    ar: { country: '', ministry: '', uni: 'مصنع الإسمنت', faculty: 'مكتب الدراسات والصيانة', dept: '', website: 'www.ciment.dz', workType: 'التقرير السنوي', title: 'تقرير النشاط والإنجازات لسنة 2025', subtitle: 'الصيانة، الطاقة، والسلامة الصناعية', students: ['المديرية العامة'], supervisor: '', level: '', specialty: '', year: 'جانفي 2026', place: 'بشار' },
    fr: { country: '', ministry: '', uni: 'Cimenterie', faculty: "Bureau d'études et maintenance", dept: '', website: 'www.ciment.dz', workType: 'Rapport annuel', title: "Rapport d'activité et réalisations 2025", subtitle: 'Maintenance, énergie et sécurité industrielle', students: ['Direction générale'], supervisor: '', level: '', specialty: '', year: 'Janvier 2026', place: 'Béchar' },
    en: { country: '', ministry: '', uni: 'Cement Plant', faculty: 'Engineering & Maintenance Office', dept: '', website: 'www.ciment.dz', workType: 'Annual report', title: 'Activity and Achievements Report 2025', subtitle: 'Maintenance, energy and industrial safety', students: ['General Management'], supervisor: '', level: '', specialty: '', year: 'January 2026', place: 'Béchar' },
  },
  internship: {
    ar: { host: 'سونلغاز — مديرية التوزيع بالبليدة', workType: 'تقرير تربص ميداني', title: 'صيانة المحولات الكهربائية في مراكز التوزيع', subtitle: 'من 2 مارس إلى 30 أفريل 2026', level: 'السنة الثالثة ليسانس', specialty: 'الكهروتقني', students: ['يوسف قاسمي'], coSup: 'م. كريم بن عيسى (مؤطر المؤسسة)' },
    fr: { host: 'Sonelgaz — Direction de distribution de Blida', workType: 'Rapport de stage pratique', title: 'Maintenance des transformateurs électriques dans les postes de distribution', subtitle: 'Du 2 mars au 30 avril 2026', level: 'Licence 3', specialty: 'Électrotechnique', students: ['Youcef Kacimi'], coSup: 'Ing. Karim Benaissa (encadrant entreprise)' },
    en: { host: 'Sonelgaz — Blida Distribution Directorate', workType: 'Field internship report', title: 'Maintenance of Electrical Transformers in Distribution Substations', subtitle: 'From 2 March to 30 April 2026', level: 'Third year of Bachelor', specialty: 'Electrical Engineering', students: ['Youcef Kacimi'], coSup: 'Eng. Karim Benaissa (company supervisor)' },
  },
  kids: {
    ar: { ministry: 'وزارة التربية الوطنية', uni: 'مدرسة الشهيد عبد الحميد بن باديس الابتدائية', faculty: '', dept: '', workType: 'بحث مدرسي', title: 'الماء سرّ الحياة', subtitle: 'كيف نحافظ على الماء في بيتنا ومدرستنا؟', students: ['ريم بوعلام', 'آدم سعيدي'], supervisor: 'المعلمة: سعاد بن يوسف', level: 'السنة الخامسة ابتدائي', specialty: 'التربية العلمية والتكنولوجية', year: 'السنة الدراسية 2025 / 2026', place: 'البليدة' },
    fr: { ministry: "Ministère de l'Éducation Nationale", uni: 'École primaire Abdelhamid Ben Badis', faculty: '', dept: '', workType: 'Exposé scolaire', title: "L'eau, source de vie", subtitle: "Comment économiser l'eau à la maison et à l'école ?", students: ['Rim Boualem', 'Adam Saidi'], supervisor: 'Maîtresse : Souad Benyoucef', level: '5e année primaire', specialty: 'Éducation scientifique', year: 'Année scolaire 2025 / 2026', place: 'Blida' },
    en: { ministry: 'Ministry of National Education', uni: 'Abdelhamid Ben Badis Primary School', faculty: '', dept: '', workType: 'School project', title: 'Water Is Life', subtitle: 'How can we save water at home and at school?', students: ['Rim Boualem', 'Adam Saidi'], supervisor: 'Teacher: Souad Benyoucef', level: 'Year 5, primary', specialty: 'Science and technology', year: 'School year 2025 / 2026', place: 'Blida' },
  },
  islamic: {
    ar: { uni: 'جامعة الأمير عبد القادر للعلوم الإسلامية', faculty: 'كلية الشريعة والاقتصاد', dept: 'قسم الفقه وأصوله', workType: 'بحث في مقياس مقاصد الشريعة', title: 'مقاصد الشريعة في حفظ المال وأثرها في المعاملات المعاصرة', subtitle: '', students: ['عبد الله بلحاج'], supervisor: 'د. محمد الأمين بوزيد', level: 'السنة الأولى ماستر', specialty: 'الفقه المقارن', place: 'قسنطينة' },
    fr: { uni: "Université Émir Abdelkader des Sciences Islamiques", faculty: 'Faculté de Charia et d’Économie', dept: 'Département de Fiqh', workType: 'Recherche — module Maqasid al-Charia', title: 'Les finalités de la Charia dans la préservation des biens et leur impact sur les transactions contemporaines', subtitle: '', students: ['Abdallah Belhadj'], supervisor: 'Dr Mohamed Lamine Bouzid', level: 'Master 1', specialty: 'Fiqh comparé', place: 'Constantine' },
    en: { uni: 'Emir Abdelkader University of Islamic Sciences', faculty: 'Faculty of Sharia and Economics', dept: 'Department of Fiqh', workType: 'Research paper — Maqasid al-Sharia module', title: 'The Objectives of Sharia in Preserving Wealth and Their Impact on Contemporary Transactions', subtitle: '', students: ['Abdallah Belhadj'], supervisor: 'Dr Mohamed Lamine Bouzid', level: 'First year of Master', specialty: 'Comparative Fiqh', place: 'Constantine' },
  },
  literary: {
    ar: { faculty: 'كلية الآداب واللغات', dept: 'قسم اللغة والأدب العربي', workType: 'مذكرة ماستر في الأدب العربي الحديث', title: 'جماليات المكان في الرواية الجزائرية المعاصرة', subtitle: 'دراسة في نماذج مختارة', students: ['سارة مزيان'], supervisor: 'د. فاطمة الزهراء رحماني', level: 'السنة الثانية ماستر', specialty: 'أدب حديث ومعاصر' },
    fr: { faculty: 'Faculté des Lettres et des Langues', dept: 'Département de Langue et Littérature Françaises', workType: 'Mémoire de Master en littérature', title: "Poétique de l'espace dans le roman algérien contemporain", subtitle: "Étude d'un corpus choisi", students: ['Sara Meziane'], supervisor: 'Dr Fatima Zohra Rahmani', level: 'Master 2', specialty: 'Littérature moderne et contemporaine' },
    en: { faculty: 'Faculty of Letters and Languages', dept: 'Department of English Literature', workType: "Master's thesis in literature", title: 'The Poetics of Place in the Contemporary Algerian Novel', subtitle: 'A study of selected works', students: ['Sara Meziane'], supervisor: 'Dr Fatima Zohra Rahmani', level: 'Second year of Master', specialty: 'Modern and Contemporary Literature' },
  },
  science: {
    ar: { faculty: 'كلية العلوم', dept: 'قسم الكيمياء', workType: 'بحث علمي', title: 'تحضير ودراسة خصائص مركبات نانوية لمعالجة المياه الملوثة', subtitle: '', students: ['إيمان بوقرة', 'رياض حمادي'], supervisor: 'د. ليلى عمراني', level: 'السنة الثالثة ليسانس', specialty: 'كيمياء المواد' },
    fr: { faculty: 'Faculté des Sciences', dept: 'Département de Chimie', workType: 'Travail de recherche', title: 'Synthèse et caractérisation de nanocomposites pour le traitement des eaux polluées', subtitle: '', students: ['Imane Bouguerra', 'Riad Hamadi'], supervisor: 'Dr Leila Amrani', level: 'Licence 3', specialty: 'Chimie des matériaux' },
    en: { faculty: 'Faculty of Science', dept: 'Department of Chemistry', workType: 'Research paper', title: 'Synthesis and Characterization of Nanocomposites for Polluted Water Treatment', subtitle: '', students: ['Imane Bouguerra', 'Riad Hamadi'], supervisor: 'Dr Leila Amrani', level: 'Third year of Bachelor', specialty: 'Materials Chemistry' },
  },
  tech: {
    ar: { dept: 'قسم الهندسة الميكانيكية', workType: 'مشروع نهاية الدراسة', title: 'تصميم ونمذجة نظام مراقبة الاهتزازات للمطاحن الصناعية', subtitle: 'تطبيق على مطحنة الإسمنت', students: ['رياض حمادي'], specialty: 'الصيانة الصناعية' },
    fr: { dept: 'Département de Génie Mécanique', workType: "Projet de fin d'études", title: "Conception et modélisation d'un système de surveillance vibratoire pour broyeurs industriels", subtitle: 'Application au broyeur à ciment', students: ['Riad Hamadi'], specialty: 'Maintenance industrielle' },
    en: { dept: 'Department of Mechanical Engineering', workType: 'Final-year project', title: 'Design and Modelling of a Vibration Monitoring System for Industrial Mills', subtitle: 'Applied to the cement mill', students: ['Riad Hamadi'], specialty: 'Industrial Maintenance' },
  },
};
