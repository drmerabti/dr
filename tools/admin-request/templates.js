// ============================================================
// templates.js — Ready request types and layout designs
// Placeholders "……" are left for the user to complete.
// ============================================================
window.ADMINREQ_TYPES = [
  {
    id: 'free', color: '#64748B',
    icon: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>',
    name: { ar: 'طلب حرّ', fr: 'Demande libre', en: 'Free request' },
    subject: { ar: '', fr: '', en: '' },
    body: { ar: '', fr: '', en: '' },
  },
  {
    id: 'leave', color: '#16A34A',
    icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    name: { ar: 'إجازة سنوية', fr: 'Congé annuel', en: 'Annual leave' },
    subject: { ar: 'طلب إجازة سنوية', fr: 'Demande de congé annuel', en: 'Annual leave request' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيشرفني أن أتقدم إلى سيادتكم بطلبي هذا، والمتمثل في الاستفادة من عطلتي السنوية لسنة …… وذلك لمدة …… يومًا، ابتداءً من …… إلى غاية …….\n\nوفي انتظار ردكم الإيجابي، تقبلوا مني فائق عبارات الاحترام والتقدير.',
      fr: "Monsieur,\n\nJ'ai l'honneur de solliciter de votre haute bienveillance l'octroi de mon congé annuel au titre de l'année ……, pour une durée de …… jours, du …… au …….\n\nDans l'attente d'une suite favorable, veuillez agréer, Monsieur, l'expression de mes salutations distinguées.",
      en: 'Dear Sir or Madam,\n\nI am writing to request my annual leave for the year ……, for a period of …… days, from …… to …….\n\nI will make sure that my duties are covered during my absence. Thank you for considering my request.\n\nYours faithfully,',
    },
  },
  {
    id: 'workcert', color: '#2F6F9F',
    icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    name: { ar: 'شهادة عمل', fr: 'Attestation de travail', en: 'Employment certificate' },
    subject: { ar: 'طلب شهادة عمل', fr: "Demande d'attestation de travail", en: 'Request for an employment certificate' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيشرفني أن ألتمس من سيادتكم منحي شهادة عمل تثبت أنني أشتغل لدى مؤسستكم بصفة …… منذ تاريخ ……، وذلك قصد استعمالها في ……….\n\nتقبلوا مني، سيدي، أسمى عبارات التقدير والاحترام.',
      fr: "Monsieur,\n\nJ'ai l'honneur de vous demander de bien vouloir me délivrer une attestation de travail certifiant que j'exerce au sein de votre établissement en qualité de …… depuis le ……, afin de la fournir à ……….\n\nVeuillez agréer, Monsieur, l'expression de ma haute considération.",
      en: 'Dear Sir or Madam,\n\nI kindly request an employment certificate confirming that I have been working at your organization as …… since ……. I need this document for ……….\n\nThank you in advance for your assistance.\n\nYours faithfully,',
    },
  },
  {
    id: 'salary', color: '#0891B2',
    icon: '<circle cx="12" cy="12" r="8"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5"/>',
    name: { ar: 'كشف / شهادة راتب', fr: 'Attestation de salaire', en: 'Salary certificate' },
    subject: { ar: 'طلب شهادة راتب', fr: "Demande d'attestation de salaire", en: 'Request for a salary certificate' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيشرفني أن ألتمس من سيادتكم تسليمي شهادة راتب (أو كشوف الرواتب للأشهر ……)، وذلك لتقديمها إلى …… في إطار ……….\n\nوتفضلوا بقبول فائق الاحترام والتقدير.',
      fr: "Monsieur,\n\nJ'ai l'honneur de vous prier de bien vouloir me délivrer une attestation de salaire (ou les fiches de paie des mois de ……), afin de la présenter à …… dans le cadre de ……….\n\nVeuillez agréer, Monsieur, mes salutations respectueuses.",
      en: 'Dear Sir or Madam,\n\nI would be grateful if you could provide me with a salary certificate (or my payslips for ……). I need to submit it to …… for ……….\n\nThank you for your help.\n\nYours faithfully,',
    },
  },
  {
    id: 'transfer', color: '#D97706',
    icon: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    name: { ar: 'طلب نقل / تحويل', fr: 'Demande de mutation', en: 'Transfer request' },
    subject: { ar: 'طلب نقل', fr: 'Demande de mutation', en: 'Transfer request' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيشرفني أن أتقدم إلى سيادتكم بطلب نقلي من …… إلى ……، وذلك للأسباب التالية: ……….\n\nوإنني ألتزم بمواصلة أداء مهامي بكل جدية إلى حين البت في طلبي.\n\nوفي انتظار ردكم، تقبلوا مني فائق عبارات الاحترام.',
      fr: "Monsieur,\n\nJ'ai l'honneur de solliciter ma mutation de …… vers ……, pour les raisons suivantes : ……….\n\nJe m'engage à poursuivre mes fonctions avec sérieux jusqu'à la décision concernant ma demande.\n\nVeuillez agréer, Monsieur, l'expression de mes sentiments respectueux.",
      en: 'Dear Sir or Madam,\n\nI would like to request a transfer from …… to …… for the following reasons: ……….\n\nI will continue to carry out my duties fully until a decision is made.\n\nThank you for considering my request.\n\nYours faithfully,',
    },
  },
  {
    id: 'absence', color: '#DB2777',
    icon: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    name: { ar: 'تبرير غياب', fr: "Justification d'absence", en: 'Absence justification' },
    subject: { ar: 'تبرير غياب', fr: "Justification d'absence", en: 'Justification of absence' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيشرفني أن أحيط سيادتكم علمًا بأنني تغيبت عن العمل يوم …… (أو من …… إلى ……) بسبب ……، وتجدون مرفقًا بهذا الطلب ما يثبت ذلك.\n\nلذا ألتمس منكم قبول هذا التبرير، مع فائق التقدير والاحترام.',
      fr: "Monsieur,\n\nJ'ai l'honneur de vous informer que j'ai été absent(e) le …… (ou du …… au ……) en raison de ……. Vous trouverez ci-joint le justificatif correspondant.\n\nJe vous prie de bien vouloir accepter cette justification et vous prie d'agréer, Monsieur, mes salutations distinguées.",
      en: 'Dear Sir or Madam,\n\nI would like to inform you that I was absent on …… (or from …… to ……) due to ……. Please find the supporting document attached.\n\nI kindly ask you to accept this justification.\n\nYours faithfully,',
    },
  },
  {
    id: 'internship', color: '#7C3AED',
    icon: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    name: { ar: 'طلب تربص', fr: 'Demande de stage', en: 'Internship request' },
    subject: { ar: 'طلب إجراء تربص', fr: 'Demande de stage', en: 'Internship application' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nأنا الممضي(ة) أسفله، طالب(ة) في تخصص …… بـ ……، يشرفني أن ألتمس من سيادتكم قبولي لإجراء تربص تطبيقي بمؤسستكم لمدة …… ابتداءً من ……، قصد إثراء معارفي واكتساب الخبرة الميدانية.\n\nوفي انتظار ردكم الإيجابي، تقبلوا مني فائق الاحترام والتقدير.',
      fr: "Monsieur,\n\nÉtudiant(e) en …… à ……, j'ai l'honneur de solliciter un stage pratique au sein de votre établissement pour une durée de …… à compter du ……, afin de compléter ma formation et d'acquérir une expérience de terrain.\n\nDans l'attente d'une réponse favorable, veuillez agréer, Monsieur, mes salutations distinguées.",
      en: 'Dear Sir or Madam,\n\nI am a student of …… at …… and I am writing to apply for an internship at your organization for …… starting from ……. This would allow me to put my studies into practice and gain field experience.\n\nThank you for considering my application.\n\nYours faithfully,',
    },
  },
  {
    id: 'resign', color: '#C0392B',
    icon: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
    name: { ar: 'استقالة', fr: 'Démission', en: 'Resignation' },
    subject: { ar: 'طلب استقالة', fr: 'Lettre de démission', en: 'Letter of resignation' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيؤسفني أن أتقدم إلى سيادتكم بطلب استقالتي من منصبي بصفة …… ابتداءً من ……، مع التزامي بمدة الإشعار المسبق المنصوص عليها قانونًا، وتسليم كل المهام العالقة.\n\nأشكركم على الثقة التي منحتموني إياها طوال فترة عملي، وتقبلوا مني فائق الاحترام.',
      fr: "Monsieur,\n\nJe vous informe par la présente de ma décision de démissionner de mon poste de …… à compter du ……. J'effectuerai le préavis prévu et assurerai la passation de mes dossiers en cours.\n\nJe vous remercie pour la confiance accordée et vous prie d'agréer, Monsieur, mes salutations distinguées.",
      en: 'Dear Sir or Madam,\n\nPlease accept this letter as formal notice of my resignation from my position as ……, effective ……. I will serve the required notice period and ensure a smooth handover of my work.\n\nThank you for the trust you have placed in me.\n\nYours faithfully,',
    },
  },
  {
    id: 'docs', color: '#0F766E',
    icon: '<path d="M4 5h6l2 2h8v12H4z"/><path d="M9 13h6"/>',
    name: { ar: 'طلب وثيقة إدارية', fr: 'Demande de document', en: 'Document request' },
    subject: { ar: 'طلب الحصول على وثيقة', fr: "Demande d'un document administratif", en: 'Request for an administrative document' },
    body: {
      ar: 'تحية طيبة وبعد،\n\nيشرفني أن ألتمس من سيادتكم تسليمي نسخة من ……، وذلك لاستعمالها في ……….\n\nوتقبلوا مني فائق عبارات الاحترام والتقدير.',
      fr: "Monsieur,\n\nJ'ai l'honneur de vous demander de bien vouloir me délivrer une copie de ……, dont j'ai besoin pour ……….\n\nVeuillez agréer, Monsieur, l'expression de mes salutations respectueuses.",
      en: 'Dear Sir or Madam,\n\nI kindly request a copy of ……, which I need for ……….\n\nThank you in advance.\n\nYours faithfully,',
    },
  },
];

// Layout designs of the sheet (class "d-<id>" on .request-page)
window.ADMINREQ_DESIGNS = [
  { id: 'classic', color: '#1E2F40', name: { ar: 'كلاسيكي', fr: 'Classique', en: 'Classic' } },
  { id: 'official', color: '#1F3A5F', name: { ar: 'رسمي', fr: 'Officiel', en: 'Official' } },
  { id: 'modern', color: '#2F6F9F', name: { ar: 'عصري', fr: 'Moderne', en: 'Modern' } },
  { id: 'framed', color: '#0F766E', name: { ar: 'بإطار', fr: 'Encadré', en: 'Framed' } },
];

// Fonts (same 4 as before; ids are stored in saved requests)
window.ADMINREQ_FONTS = [
  { id: 1, name: { ar: 'عصري', fr: 'Moderne', en: 'Modern' }, ar: "'Tajawal'", en: "'Inter'" },
  { id: 2, name: { ar: 'كلاسيكي', fr: 'Classique', en: 'Classic' }, ar: "'Amiri'", en: "'Georgia'" },
  { id: 3, name: { ar: 'رسمي تقليدي', fr: 'Officiel', en: 'Formal' }, ar: "'Noto Naskh Arabic'", en: "'Georgia'" },
  { id: 4, name: { ar: 'خط اليد', fr: 'Manuscrit', en: 'Handwritten' }, ar: "'Aref Ruqaa', cursive", en: "'Caveat', cursive" },
];

// ============================================================
// Complete example requests, one per type, shown in the preview while
// the matching fields are empty. Typing in a field replaces its example.
// Nothing here is stored in the user's data.
// ============================================================
window.ADMINREQ_EXAMPLE_SENDER = {
  ar: {
    firstName: 'سفيان', lastName: 'مرابطي', phone: '0555 12 34 56', email: 'sofiane.merabti@email.com', place: 'الجزائر',
    extras: [['الوظيفة', 'مهندس صيانة'], ['الرقم الوظيفي', '2471']],
  },
  fr: {
    firstName: 'Sofiane', lastName: 'Merabti', phone: '0555 12 34 56', email: 'sofiane.merabti@email.com', place: 'Alger',
    extras: [['Fonction', 'Ingénieur de maintenance'], ['Matricule', '2471']],
  },
  en: {
    firstName: 'Sofiane', lastName: 'Merabti', phone: '0555 12 34 56', email: 'sofiane.merabti@email.com', place: 'Algiers',
    extras: [['Position', 'Maintenance engineer'], ['Employee ID', '2471']],
  },
};

window.ADMINREQ_EXAMPLES = {
  free: {
    ar: {
      to: 'السيد المدير العام المحترم',
      subject: 'طلب الاستفادة من دورة تكوينية',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن أتقدم إلى سيادتكم بطلبي هذا، والمتمثل في الاستفادة من الدورة التكوينية المتخصصة في «صيانة المحركات الكهربائية الصناعية»، المزمع تنظيمها من 12 إلى 16 أكتوبر 2026.\n\nوتندرج هذه الدورة مباشرة في إطار مهامي اليومية بمصلحة الصيانة، إذ ستمكّنني من تحسين جودة التدخلات وتقليص فترات توقف التجهيزات، بما يعود بالفائدة على المؤسسة.\n\nوفي انتظار ردكم الإيجابي، تقبلوا مني فائق عبارات الاحترام والتقدير.',
    },
    fr: {
      to: 'Monsieur le Directeur Général',
      subject: 'Demande de participation à une formation',
      body: "Monsieur le Directeur,\n\nJ'ai l'honneur de solliciter votre accord pour participer à la formation spécialisée « Maintenance des moteurs électriques industriels », prévue du 12 au 16 octobre 2026.\n\nCette formation s'inscrit directement dans le cadre de mes missions quotidiennes au service maintenance : elle me permettra d'améliorer la qualité des interventions et de réduire les temps d'arrêt des équipements, au bénéfice de l'entreprise.\n\nDans l'attente d'une suite favorable, je vous prie d'agréer, Monsieur le Directeur, l'expression de mes salutations distinguées.",
    },
    en: {
      to: 'The General Manager',
      subject: 'Request to attend a training course',
      body: 'Dear Sir or Madam,\n\nI am writing to request your approval to attend the specialised training course "Maintenance of Industrial Electric Motors", to be held from 12 to 16 October 2026.\n\nThis course is directly related to my daily duties in the maintenance department. It will help me improve the quality of our interventions and reduce equipment downtime, to the benefit of the company.\n\nThank you for considering my request. I look forward to your reply.\n\nYours faithfully,',
    },
  },
  leave: {
    ar: {
      to: 'السيد مدير الموارد البشرية المحترم',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن أتقدم إلى سيادتكم بطلبي هذا، والمتمثل في الاستفادة من عطلتي السنوية لسنة 2026، وذلك لمدة 21 يومًا، ابتداءً من 10 أوت 2026 إلى غاية 31 أوت 2026.\n\nوقد حرصت على إتمام المهام الموكلة إليّ وتسليم الملفات الجارية لزميلي في المصلحة قبل تاريخ انطلاق العطلة، ضمانًا لاستمرارية السير الحسن للعمل.\n\nوفي انتظار ردكم الإيجابي، تقبلوا مني فائق عبارات الاحترام والتقدير.',
    },
    fr: {
      to: 'Monsieur le Directeur des Ressources Humaines',
      body: "Monsieur le Directeur,\n\nJ'ai l'honneur de solliciter de votre haute bienveillance l'octroi de mon congé annuel au titre de l'année 2026, pour une durée de 21 jours, du 10 août au 31 août 2026.\n\nJ'ai veillé à achever les tâches qui me sont confiées et à transmettre les dossiers en cours à mon collègue du service avant mon départ, afin d'assurer la continuité du travail.\n\nDans l'attente d'une suite favorable, je vous prie d'agréer, Monsieur le Directeur, l'expression de mes salutations distinguées.",
    },
    en: {
      to: 'The Human Resources Manager',
      body: 'Dear Sir or Madam,\n\nI am writing to request my annual leave for the year 2026, for a period of 21 days, from 10 August to 31 August 2026.\n\nI will complete my current tasks and hand over ongoing files to my colleague in the department before my leave begins, so that the work continues smoothly during my absence.\n\nThank you for considering my request.\n\nYours faithfully,',
    },
  },
  workcert: {
    ar: {
      to: 'السيد مدير الموارد البشرية المحترم',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن ألتمس من سيادتكم منحي شهادة عمل تثبت أنني أشتغل لدى مؤسستكم بصفة مهندس صيانة منذ تاريخ 01 مارس 2019.\n\nوتُطلب هذه الشهادة قصد إرفاقها بملف طلب قرض عقاري لدى البنك.\n\nتقبلوا مني، سيدي، أسمى عبارات التقدير والاحترام.',
    },
    fr: {
      to: 'Monsieur le Directeur des Ressources Humaines',
      body: "Monsieur le Directeur,\n\nJ'ai l'honneur de vous demander de bien vouloir me délivrer une attestation de travail certifiant que j'exerce au sein de votre établissement en qualité d'ingénieur de maintenance depuis le 1er mars 2019.\n\nCe document est destiné à compléter mon dossier de demande de crédit immobilier auprès de ma banque.\n\nVeuillez agréer, Monsieur le Directeur, l'expression de ma haute considération.",
    },
    en: {
      to: 'The Human Resources Manager',
      body: 'Dear Sir or Madam,\n\nI kindly request an employment certificate confirming that I have been working at your organisation as a maintenance engineer since 1 March 2019.\n\nI need this document to complete my mortgage application with my bank.\n\nThank you in advance for your assistance.\n\nYours faithfully,',
    },
  },
  salary: {
    ar: {
      to: 'السيد مدير الموارد البشرية المحترم',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن ألتمس من سيادتكم تسليمي شهادة راتب، مرفقة بكشوف الرواتب للأشهر الثلاثة الأخيرة (جويلية، أوت وسبتمبر 2026).\n\nوذلك لتقديمها إلى البنك في إطار ملف طلب قرض استهلاكي.\n\nوتفضلوا بقبول فائق الاحترام والتقدير.',
    },
    fr: {
      to: 'Monsieur le Directeur des Ressources Humaines',
      body: "Monsieur le Directeur,\n\nJ'ai l'honneur de vous prier de bien vouloir me délivrer une attestation de salaire, accompagnée de mes fiches de paie des trois derniers mois (juillet, août et septembre 2026).\n\nCes documents sont destinés à ma banque dans le cadre d'une demande de crédit.\n\nVeuillez agréer, Monsieur le Directeur, mes salutations respectueuses.",
    },
    en: {
      to: 'The Human Resources Manager',
      body: 'Dear Sir or Madam,\n\nI would be grateful if you could provide me with a salary certificate, together with my payslips for the last three months (July, August and September 2026).\n\nI need to submit these documents to my bank as part of a loan application.\n\nThank you for your help.\n\nYours faithfully,',
    },
  },
  transfer: {
    ar: {
      to: 'السيد المدير العام المحترم',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن أتقدم إلى سيادتكم بطلب نقلي من وحدة الإنتاج بالشلف إلى المديرية الجهوية بالجزائر العاصمة، وذلك لأسباب عائلية تتمثل في انتقال أسرتي للإقامة هناك.\n\nوإنني ألتزم بمواصلة أداء مهامي بكل جدية إلى حين البت في طلبي، وبتسليم ملفاتي الجارية وفق ما تقتضيه مصلحة العمل.\n\nوفي انتظار ردكم، تقبلوا مني فائق عبارات الاحترام.',
    },
    fr: {
      to: 'Monsieur le Directeur Général',
      body: "Monsieur le Directeur Général,\n\nJ'ai l'honneur de solliciter ma mutation de l'unité de production de Chlef vers la direction régionale d'Alger, pour des raisons familiales : ma famille s'installe en effet à Alger.\n\nJe m'engage à poursuivre mes fonctions avec sérieux jusqu'à la décision concernant ma demande et à assurer la passation de mes dossiers en cours.\n\nVeuillez agréer, Monsieur le Directeur Général, l'expression de mes sentiments respectueux.",
    },
    en: {
      to: 'The General Manager',
      body: 'Dear Sir or Madam,\n\nI would like to request a transfer from the Chlef production unit to the regional office in Algiers, for family reasons, as my family is moving there.\n\nI will continue to carry out my duties fully until a decision is made, and I will ensure a proper handover of my ongoing files.\n\nThank you for considering my request.\n\nYours faithfully,',
    },
  },
  absence: {
    ar: {
      to: 'السيد رئيس مصلحة الصيانة المحترم',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن أحيط سيادتكم علمًا بأنني تغيبت عن العمل يومي 14 و15 سبتمبر 2026 بسبب وعكة صحية ألزمتني الراحة بالبيت، وتجدون مرفقًا بهذا الطلب الشهادة الطبية التي تثبت ذلك.\n\nلذا ألتمس منكم قبول هذا التبرير، مع فائق التقدير والاحترام.',
      attach: ['شهادة طبية مؤرخة في 14 سبتمبر 2026'],
    },
    fr: {
      to: 'Monsieur le Chef du service maintenance',
      body: "Monsieur,\n\nJ'ai l'honneur de vous informer que j'ai été absent les 14 et 15 septembre 2026 pour raison de santé, mon état ayant nécessité un repos à domicile. Vous trouverez ci-joint le certificat médical correspondant.\n\nJe vous prie de bien vouloir accepter cette justification et d'agréer, Monsieur, mes salutations distinguées.",
      attach: ['Certificat médical daté du 14 septembre 2026'],
    },
    en: {
      to: 'The Head of the Maintenance Department',
      body: 'Dear Sir or Madam,\n\nI would like to inform you that I was absent on 14 and 15 September 2026 due to illness, which required me to rest at home. Please find the medical certificate attached.\n\nI kindly ask you to accept this justification.\n\nYours faithfully,',
      attach: ['Medical certificate dated 14 September 2026'],
    },
  },
  internship: {
    ar: {
      to: 'السيد مدير المؤسسة المحترم',
      extras: [['التخصص', 'ماستر إلكتروتقني'], ['الجامعة', 'جامعة هواري بومدين']],
      body: 'تحية طيبة وبعد،\n\nأنا الممضي أسفله، طالب في السنة الثانية ماستر تخصص إلكتروتقني بجامعة العلوم والتكنولوجيا هواري بومدين، يشرفني أن ألتمس من سيادتكم قبولي لإجراء تربص تطبيقي بمؤسستكم لمدة شهرين ابتداءً من 01 فيفري 2027.\n\nويهدف هذا التربص إلى إثراء معارفي النظرية واكتساب الخبرة الميدانية، لا سيما في مجال صيانة التجهيزات الكهربائية الصناعية.\n\nوفي انتظار ردكم الإيجابي، تقبلوا مني فائق الاحترام والتقدير.',
      attach: ['شهادة مدرسية', 'اتفاقية التربص'],
    },
    fr: {
      to: "Monsieur le Directeur de l'entreprise",
      extras: [['Spécialité', 'Master en électrotechnique'], ['Université', 'USTHB']],
      body: "Monsieur le Directeur,\n\nÉtudiant en deuxième année de Master en électrotechnique à l'USTHB, j'ai l'honneur de solliciter un stage pratique au sein de votre entreprise pour une durée de deux mois à compter du 1er février 2027.\n\nCe stage me permettra de compléter ma formation théorique et d'acquérir une expérience de terrain, notamment dans la maintenance des équipements électriques industriels.\n\nDans l'attente d'une réponse favorable, veuillez agréer, Monsieur le Directeur, mes salutations distinguées.",
      attach: ['Certificat de scolarité', 'Convention de stage'],
    },
    en: {
      to: 'The Company Director',
      extras: [['Field', 'MSc Electrical Engineering'], ['University', 'USTHB']],
      body: 'Dear Sir or Madam,\n\nI am a second-year MSc student in Electrical Engineering at USTHB, and I am writing to apply for a two-month internship at your company starting from 1 February 2027.\n\nThis internship would allow me to put my studies into practice and gain field experience, particularly in the maintenance of industrial electrical equipment.\n\nThank you for considering my application.\n\nYours faithfully,',
      attach: ['Certificate of enrolment', 'Internship agreement'],
    },
  },
  resign: {
    ar: {
      to: 'السيد المدير العام المحترم',
      body: 'تحية طيبة وبعد،\n\nيؤسفني أن أتقدم إلى سيادتكم بطلب استقالتي من منصبي بصفة مهندس صيانة ابتداءً من 31 ديسمبر 2026، مع التزامي بمدة الإشعار المسبق المنصوص عليها قانونًا، وتسليم كل المهام العالقة.\n\nأشكركم جزيل الشكر على الثقة التي منحتموني إياها طوال فترة عملي، وعلى كل ما اكتسبته من خبرة داخل المؤسسة.\n\nوتقبلوا مني فائق الاحترام والتقدير.',
    },
    fr: {
      to: 'Monsieur le Directeur Général',
      body: "Monsieur le Directeur Général,\n\nJe vous informe par la présente de ma décision de démissionner de mon poste d'ingénieur de maintenance à compter du 31 décembre 2026. J'effectuerai le préavis prévu et assurerai la passation de l'ensemble de mes dossiers en cours.\n\nJe vous remercie sincèrement pour la confiance accordée tout au long de ces années et pour l'expérience acquise au sein de l'entreprise.\n\nVeuillez agréer, Monsieur le Directeur Général, mes salutations distinguées.",
    },
    en: {
      to: 'The General Manager',
      body: 'Dear Sir or Madam,\n\nPlease accept this letter as formal notice of my resignation from my position as maintenance engineer, effective 31 December 2026. I will serve the required notice period and ensure a smooth handover of all my ongoing work.\n\nI sincerely thank you for the trust you have placed in me over the years and for the experience I have gained within the company.\n\nYours faithfully,',
    },
  },
  docs: {
    ar: {
      to: 'السيد مدير الموارد البشرية المحترم',
      body: 'تحية طيبة وبعد،\n\nيشرفني أن ألتمس من سيادتكم تسليمي نسخة طبق الأصل من مقرر تعييني في المنصب، وذلك لاستعمالها في ملف المشاركة في مسابقة الترقية الداخلية.\n\nوتقبلوا مني فائق عبارات الاحترام والتقدير.',
    },
    fr: {
      to: 'Monsieur le Directeur des Ressources Humaines',
      body: "Monsieur le Directeur,\n\nJ'ai l'honneur de vous demander de bien vouloir me délivrer une copie certifiée conforme de ma décision de nomination, dont j'ai besoin pour mon dossier de participation au concours de promotion interne.\n\nVeuillez agréer, Monsieur le Directeur, l'expression de mes salutations respectueuses.",
    },
    en: {
      to: 'The Human Resources Manager',
      body: 'Dear Sir or Madam,\n\nI kindly request a certified copy of my appointment decision, which I need for my application to the internal promotion competition.\n\nThank you in advance.\n\nYours faithfully,',
    },
  },
};
