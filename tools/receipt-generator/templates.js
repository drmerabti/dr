// ============================================================
// templates.js — Receipt types, layout designs, fonts and the
// complete example receipt shown for each type (ar / fr / en).
// Nothing here is stored in the user's data.
// ============================================================

// layout: 'combined' (transmittal note + acknowledgment), 'bordereau', 'ack', 'receipt'
window.RCPT_TYPES = [
  {
    id: 'combined', layout: 'combined', color: '#2F6F9F',
    icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 12h14" stroke-dasharray="2 2"/><path d="M8 7h8M9 16l2 2 4-4"/>',
    name: { ar: 'بيان إرسال مع إشعار استلام', fr: 'Bordereau + accusé de réception', en: 'Transmittal note + acknowledgment' },
    title: { ar: 'بيان إرسال', fr: "Bordereau d'envoi", en: 'Transmittal Note' },
  },
  {
    id: 'bordereau', layout: 'bordereau', color: '#0F766E',
    icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    name: { ar: 'بيان إرسال فقط', fr: "Bordereau d'envoi seul", en: 'Transmittal note only' },
    title: { ar: 'بيان إرسال', fr: "Bordereau d'envoi", en: 'Transmittal Note' },
  },
  {
    id: 'ack', layout: 'ack', color: '#16A34A',
    icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 12l2 2 4-4"/>',
    name: { ar: 'إشعار استلام فقط', fr: 'Accusé de réception seul', en: 'Acknowledgment only' },
    title: { ar: 'إشعار استلام', fr: 'Accusé de réception', en: 'Acknowledgment of Receipt' },
  },
  {
    id: 'docs', layout: 'receipt', color: '#7C3AED',
    icon: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    name: { ar: 'وصل استلام وثائق', fr: 'Reçu de documents', en: 'Document receipt' },
    title: { ar: 'وصل استلام وثائق', fr: 'Reçu de dépôt de documents', en: 'Document Receipt' },
  },
  {
    id: 'cash', layout: 'receipt', color: '#D97706',
    icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9v.01M18 15v.01"/>',
    name: { ar: 'وصل استلام مبلغ مالي', fr: 'Reçu de paiement', en: 'Payment receipt' },
    title: { ar: 'وصل استلام مبلغ مالي', fr: 'Reçu de paiement', en: 'Payment Receipt' },
  },
  {
    id: 'equipment', layout: 'receipt', color: '#0891B2',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    name: { ar: 'وصل استلام عتاد وقطع غيار', fr: 'Réception de matériel', en: 'Goods received note' },
    title: { ar: 'وصل استلام عتاد وقطع غيار', fr: 'Bon de réception de matériel', en: 'Goods Received Note' },
  },
  {
    id: 'handover', layout: 'receipt', color: '#DB2777',
    icon: '<path d="M4 12l4-4 4 4M8 8v10M20 12l-4 4-4-4M16 16V6"/>',
    name: { ar: 'وصل تسليم واستلام', fr: 'Bon de remise et réception', en: 'Handover receipt' },
    title: { ar: 'وصل تسليم واستلام', fr: 'Bon de remise et de réception', en: 'Handover Receipt' },
  },
];

window.RCPT_DESIGNS = [
  { id: 'classic', color: '#1E2F40', name: { ar: 'كلاسيكي', fr: 'Classique', en: 'Classic' } },
  { id: 'official', color: '#1F3A5F', name: { ar: 'رسمي', fr: 'Officiel', en: 'Official' } },
  { id: 'modern', color: '#2F6F9F', name: { ar: 'عصري', fr: 'Moderne', en: 'Modern' } },
  { id: 'framed', color: '#0F766E', name: { ar: 'بإطار', fr: 'Encadré', en: 'Framed' } },
];

// Same 4 fonts as the admin request (ids are stored in saved receipts)
window.RCPT_FONTS = [
  { id: 1, name: { ar: 'عصري', fr: 'Moderne', en: 'Modern' }, ar: "'Tajawal'", en: "'Inter'" },
  { id: 2, name: { ar: 'كلاسيكي', fr: 'Classique', en: 'Classic' }, ar: "'Amiri'", en: "'Georgia'" },
  { id: 3, name: { ar: 'رسمي تقليدي', fr: 'Officiel', en: 'Formal' }, ar: "'Noto Naskh Arabic'", en: "'Georgia'" },
  { id: 4, name: { ar: 'خط اليد', fr: 'Manuscrit', en: 'Handwritten' }, ar: "'Aref Ruqaa', cursive", en: "'Caveat', cursive" },
];

// Organisation shown on every example
window.RCPT_EXAMPLE_ORG = {
  ar: { issuerName: 'مصنع الإسمنت — مكتب الدراسات والصيانة', issuerContact: 'المنطقة الصناعية، بشار · 049 12 34 56 · etudes@ciment.dz', place: 'بشار' },
  fr: { issuerName: "Cimenterie — Bureau d'études et maintenance", issuerContact: 'Zone industrielle, Béchar · 049 12 34 56 · etudes@ciment.dz', place: 'Béchar' },
  en: { issuerName: 'Cement Plant — Engineering & Maintenance Office', issuerContact: 'Industrial Zone, Béchar · 049 12 34 56 · etudes@ciment.dz', place: 'Béchar' },
};

// items: [designation, quantity, condition, reference]
window.RCPT_EXAMPLES = {
  combined: {
    ar: {
      giverName: 'سفيان مرابطي', giverRole: 'رئيس مكتب الدراسات',
      destinataire: 'السيد مدير الوحدة — مصلحة الموارد البشرية', receiverName: 'كريم بن عيسى', receiverRole: 'رئيس مصلحة المستخدمين',
      objet: 'إرسال ملفات تكوين المستخدمين',
      items: [['ملف التكوين التقني للمستخدمين', 3, 'أصلية', 'RH-114'], ['شهادات المشاركة في الدورة', 12, 'أصلية', 'RH-115'], ['قائمة الحضور الموقّعة', 1, 'نسخة', 'RH-116']],
      ackText: 'أقرّ أنا الموقّع أدناه باستلام كامل الوثائق المذكورة في بيان الإرسال المشار إليه أعلاه، كاملةً وفي حالة جيدة.',
    },
    fr: {
      giverName: 'Sofiane Merabti', giverRole: "Chef du bureau d'études",
      destinataire: "Monsieur le Directeur de l'unité — Service des ressources humaines", receiverName: 'Karim Benaissa', receiverRole: 'Chef du service du personnel',
      objet: 'Envoi des dossiers de formation du personnel',
      items: [['Dossier de formation technique du personnel', 3, 'Originaux', 'RH-114'], ['Attestations de participation', 12, 'Originaux', 'RH-115'], ['Liste de présence signée', 1, 'Copie', 'RH-116']],
      ackText: "Je soussigné(e) reconnais avoir reçu l'ensemble des documents mentionnés dans le bordereau d'envoi référencé ci-dessus, complets et en bon état.",
    },
    en: {
      giverName: 'Sofiane Merabti', giverRole: 'Head of Engineering Office',
      destinataire: 'The Unit Manager — Human Resources Department', receiverName: 'Karim Benaissa', receiverRole: 'Head of Personnel',
      objet: 'Sending staff training files',
      items: [['Staff technical training file', 3, 'Originals', 'RH-114'], ['Course attendance certificates', 12, 'Originals', 'RH-115'], ['Signed attendance sheet', 1, 'Copy', 'RH-116']],
      ackText: 'I, the undersigned, acknowledge receipt of all the documents listed in the transmittal note referenced above, complete and in good condition.',
    },
  },
  bordereau: {
    ar: {
      giverName: 'سفيان مرابطي', giverRole: 'رئيس مكتب الدراسات',
      destinataire: 'السيد المدير التقني المحترم', receiverName: 'نادية حمدي', receiverRole: 'أمانة المديرية التقنية',
      objet: 'إرسال تقارير الصيانة الشهرية',
      items: [['تقرير الصيانة الوقائية — شهر سبتمبر', 1, 'أصلية', 'MNT-09'], ['سجل تدخلات الصيانة التصحيحية', 1, 'أصلية', 'MNT-10'], ['جدول قطع الغيار المستهلكة', 1, 'نسخة', 'MNT-11'], ['محضر توقف الفرن رقم 2', 2, 'نسخة', 'MNT-12']],
      ackText: 'أقرّ أنا الموقّع أدناه باستلام الوثائق المذكورة أعلاه.',
    },
    fr: {
      giverName: 'Sofiane Merabti', giverRole: "Chef du bureau d'études",
      destinataire: 'Monsieur le Directeur technique', receiverName: 'Nadia Hamdi', receiverRole: 'Secrétariat de la direction technique',
      objet: 'Envoi des rapports de maintenance mensuels',
      items: [['Rapport de maintenance préventive — septembre', 1, 'Original', 'MNT-09'], ['Registre des interventions correctives', 1, 'Original', 'MNT-10'], ['Relevé des pièces de rechange consommées', 1, 'Copie', 'MNT-11'], ["PV d'arrêt du four n° 2", 2, 'Copie', 'MNT-12']],
      ackText: 'Je soussigné(e) reconnais avoir reçu les documents mentionnés ci-dessus.',
    },
    en: {
      giverName: 'Sofiane Merabti', giverRole: 'Head of Engineering Office',
      destinataire: 'The Technical Director', receiverName: 'Nadia Hamdi', receiverRole: 'Technical Directorate Office',
      objet: 'Sending the monthly maintenance reports',
      items: [['Preventive maintenance report — September', 1, 'Original', 'MNT-09'], ['Corrective maintenance log', 1, 'Original', 'MNT-10'], ['Spare parts consumption sheet', 1, 'Copy', 'MNT-11'], ['Kiln No. 2 shutdown report', 2, 'Copy', 'MNT-12']],
      ackText: 'I, the undersigned, acknowledge receipt of the documents listed above.',
    },
  },
  ack: {
    ar: {
      giverName: 'سفيان مرابطي', giverRole: 'رئيس مكتب الدراسات',
      destinataire: 'المديرية التقنية', receiverName: 'نادية حمدي', receiverRole: 'أمينة المديرية التقنية',
      objet: 'تقارير الصيانة الشهرية', items: [],
      ackText: 'أقرّ أنا الموقّع(ة) أدناه باستلام كامل الوثائق المذكورة في بيان الإرسال المشار إليه أعلاه، كاملةً وفي حالة جيدة، وذلك بتاريخ استلام هذا الإشعار.',
    },
    fr: {
      giverName: 'Sofiane Merabti', giverRole: "Chef du bureau d'études",
      destinataire: 'Direction technique', receiverName: 'Nadia Hamdi', receiverRole: 'Secrétaire de la direction technique',
      objet: 'Rapports de maintenance mensuels', items: [],
      ackText: "Je soussigné(e) reconnais avoir reçu l'ensemble des documents mentionnés dans le bordereau d'envoi référencé ci-dessus, complets et en bon état, à la date du présent accusé.",
    },
    en: {
      giverName: 'Sofiane Merabti', giverRole: 'Head of Engineering Office',
      destinataire: 'Technical Directorate', receiverName: 'Nadia Hamdi', receiverRole: 'Technical Directorate Secretary',
      objet: 'Monthly maintenance reports', items: [],
      ackText: 'I, the undersigned, acknowledge receipt of all the documents listed in the transmittal note referenced above, complete and in good condition, on the date of this acknowledgment.',
    },
  },
  docs: {
    ar: {
      giverName: 'عبد القادر سعيدي', giverRole: 'مترشح لمنصب تقني صيانة',
      destinataire: 'مصلحة المستخدمين', receiverName: 'سفيان مرابطي', receiverRole: 'رئيس مكتب الدراسات',
      objet: 'إيداع ملف التوظيف',
      items: [['طلب خطي', 1, 'أصلي', ''], ['سيرة ذاتية', 1, 'أصلية', ''], ['نسخة من الشهادة', 1, 'مصادق عليها', 'DIP-2019'], ['شهادة ميلاد', 1, 'أصلية', 'S12']],
      notes: 'يُحتفظ بالملف لمدة ستة أشهر من تاريخ الإيداع.',
      ackText: 'يشهد المستلِم أنه استلم من المسلِّم الوثائق المذكورة أعلاه كاملةً، ويُسلَّم هذا الوصل للمعني للإدلاء به عند الحاجة.',
    },
    fr: {
      giverName: 'Abdelkader Saidi', giverRole: 'Candidat au poste de technicien de maintenance',
      destinataire: 'Service du personnel', receiverName: 'Sofiane Merabti', receiverRole: "Chef du bureau d'études",
      objet: 'Dépôt du dossier de recrutement',
      items: [['Demande manuscrite', 1, 'Original', ''], ['Curriculum vitae', 1, 'Original', ''], ['Copie du diplôme', 1, 'Certifiée conforme', 'DIP-2019'], ['Acte de naissance', 1, 'Original', 'S12']],
      notes: 'Le dossier est conservé six mois à compter de la date de dépôt.',
      ackText: "Le réceptionnaire atteste avoir reçu du remettant l'ensemble des documents ci-dessus. Le présent reçu est remis à l'intéressé pour servir et valoir ce que de droit.",
    },
    en: {
      giverName: 'Abdelkader Saidi', giverRole: 'Applicant, maintenance technician',
      destinataire: 'Personnel Department', receiverName: 'Sofiane Merabti', receiverRole: 'Head of Engineering Office',
      objet: 'Submission of the job application file',
      items: [['Handwritten application', 1, 'Original', ''], ['Curriculum vitae', 1, 'Original', ''], ['Copy of diploma', 1, 'Certified copy', 'DIP-2019'], ['Birth certificate', 1, 'Original', 'S12']],
      notes: 'The file is kept for six months from the date of submission.',
      ackText: 'The receiver certifies having received all the documents listed above from the deliverer. This receipt is given to the person concerned for any legal purpose.',
    },
  },
  cash: {
    ar: {
      giverName: 'مراد قاسمي', giverRole: 'ممثل شركة النقل السريع',
      destinataire: 'مصلحة المحاسبة', receiverName: 'سفيان مرابطي', receiverRole: 'المحاسب الرئيسي',
      objet: 'تسديد مستحقات كراء شاحنة لشهر سبتمبر 2026', items: [],
      amount: '125000', payMethod: 'صك بنكي رقم 0045871',
      notes: 'لا يُعتدّ بهذا الوصل إلا بعد تحصيل الصك.',
      ackText: 'استلمتُ من المسلِّم المذكور أعلاه المبلغ المبيّن في هذا الوصل، وذلك مقابل الموضوع المشار إليه، وبه يُبرّأ ذمّته في حدود هذا المبلغ.',
    },
    fr: {
      giverName: 'Mourad Kacimi', giverRole: 'Représentant de la société Transport Rapide',
      destinataire: 'Service comptabilité', receiverName: 'Sofiane Merabti', receiverRole: 'Comptable principal',
      objet: "Règlement de la location d'un camion — septembre 2026", items: [],
      amount: '125000', payMethod: 'Chèque bancaire n° 0045871',
      notes: "Le présent reçu n'est valable qu'après encaissement du chèque.",
      ackText: 'Je reconnais avoir reçu du remettant ci-dessus la somme indiquée dans le présent reçu, au titre de l’objet mentionné, pour solde de tout compte à concurrence de ce montant.',
    },
    en: {
      giverName: 'Mourad Kacimi', giverRole: 'Representative, Rapid Transport Co.',
      destinataire: 'Accounting Department', receiverName: 'Sofiane Merabti', receiverRole: 'Chief Accountant',
      objet: 'Truck rental payment — September 2026', items: [],
      amount: '125000', payMethod: 'Bank cheque No. 0045871',
      notes: 'This receipt is valid only once the cheque has cleared.',
      ackText: 'I acknowledge having received from the above-named payer the amount shown on this receipt, for the purpose stated, in full settlement up to this amount.',
    },
  },
  equipment: {
    ar: {
      giverName: 'يوسف بلقاسم', giverRole: 'مندوب مؤسسة الأطلس للتجهيزات الصناعية',
      destinataire: 'مخزن قطع الغيار', receiverName: 'سفيان مرابطي', receiverRole: 'رئيس مكتب الدراسات والصيانة',
      objet: 'استلام قطع غيار طلبية الشراء رقم BC-2026-118',
      items: [['محرك كهربائي 75 كيلوواط', 1, 'جديد', 'MOT-75'], ['محمل كروي SKF 6316', 4, 'جديد', '6316-C3'], ['حزام نقل SPC 4000', 6, 'جديد', 'SPC4000'], ['قاطع دارة 250 أمبير', 2, 'جديد', 'NSX250']],
      notes: 'تم الفحص البصري للعتاد عند الاستلام، والاختبار التشغيلي للمحرك مبرمج لاحقًا.',
      ackText: 'أقرّ باستلام العتاد وقطع الغيار المذكورة أعلاه، مطابقةً للكميات المبيّنة وفي حالة جيدة ظاهريًا.',
    },
    fr: {
      giverName: 'Youcef Belkacem', giverRole: 'Délégué de la société Atlas Équipements Industriels',
      destinataire: 'Magasin des pièces de rechange', receiverName: 'Sofiane Merabti', receiverRole: "Chef du bureau d'études et maintenance",
      objet: 'Réception des pièces de la commande n° BC-2026-118',
      items: [['Moteur électrique 75 kW', 1, 'Neuf', 'MOT-75'], ['Roulement à billes SKF 6316', 4, 'Neuf', '6316-C3'], ['Courroie de transmission SPC 4000', 6, 'Neuf', 'SPC4000'], ['Disjoncteur 250 A', 2, 'Neuf', 'NSX250']],
      notes: "Contrôle visuel effectué à la réception ; l'essai de fonctionnement du moteur est programmé ultérieurement.",
      ackText: 'Je reconnais avoir reçu le matériel et les pièces de rechange ci-dessus, conformes aux quantités indiquées et en bon état apparent.',
    },
    en: {
      giverName: 'Youcef Belkacem', giverRole: 'Delegate, Atlas Industrial Equipment',
      destinataire: 'Spare parts store', receiverName: 'Sofiane Merabti', receiverRole: 'Head of Engineering & Maintenance',
      objet: 'Receipt of parts for purchase order BC-2026-118',
      items: [['Electric motor 75 kW', 1, 'New', 'MOT-75'], ['SKF 6316 ball bearing', 4, 'New', '6316-C3'], ['SPC 4000 drive belt', 6, 'New', 'SPC4000'], ['250 A circuit breaker', 2, 'New', 'NSX250']],
      notes: 'Visual inspection done on receipt; the motor run test is scheduled later.',
      ackText: 'I acknowledge receipt of the equipment and spare parts listed above, matching the quantities shown and in apparently good condition.',
    },
  },
  handover: {
    ar: {
      giverName: 'كريم بن عيسى', giverRole: 'تقني صيانة — الفرقة المسائية',
      destinataire: 'ورشة الصيانة الكهربائية', receiverName: 'ياسين عمراني', receiverRole: 'تقني صيانة — الفرقة الليلية',
      objet: 'تسليم عهدة أدوات ورشة الصيانة الكهربائية',
      items: [['جهاز قياس متعدد Fluke 87V', 1, 'صالح', 'EQ-021'], ['كاميرا حرارية', 1, 'صالحة', 'EQ-034'], ['حقيبة مفاتيح عازلة', 1, 'كاملة', 'EQ-040'], ['مفاتيح خزانة اللوحات الكهربائية', 3, '—', 'K-07']],
      notes: 'يتحمّل المستلِم مسؤولية العهدة إلى غاية تسليمها.',
      ackText: 'تم تسليم واستلام العهدة المذكورة أعلاه بحضور الطرفين، وأُثبت ذلك بتوقيعهما على هذا الوصل.',
    },
    fr: {
      giverName: 'Karim Benaissa', giverRole: "Technicien de maintenance — équipe d'après-midi",
      destinataire: 'Atelier de maintenance électrique', receiverName: 'Yacine Amrani', receiverRole: 'Technicien de maintenance — équipe de nuit',
      objet: "Remise de l'outillage de l'atelier de maintenance électrique",
      items: [['Multimètre Fluke 87V', 1, 'Bon état', 'EQ-021'], ['Caméra thermique', 1, 'Bon état', 'EQ-034'], ['Trousse de clés isolées', 1, 'Complète', 'EQ-040'], ['Clés des armoires électriques', 3, '—', 'K-07']],
      notes: "Le réceptionnaire est responsable du matériel jusqu'à sa restitution.",
      ackText: 'La remise et la réception du matériel ci-dessus ont eu lieu en présence des deux parties, qui l’attestent par leur signature.',
    },
    en: {
      giverName: 'Karim Benaissa', giverRole: 'Maintenance technician — evening shift',
      destinataire: 'Electrical maintenance workshop', receiverName: 'Yacine Amrani', receiverRole: 'Maintenance technician — night shift',
      objet: 'Handover of the electrical workshop tools',
      items: [['Fluke 87V multimeter', 1, 'Working', 'EQ-021'], ['Thermal camera', 1, 'Working', 'EQ-034'], ['Insulated tool kit', 1, 'Complete', 'EQ-040'], ['Electrical cabinet keys', 3, '—', 'K-07']],
      notes: 'The receiver is responsible for these items until they are handed back.',
      ackText: 'The items above were handed over and received in the presence of both parties, who confirm it by signing this receipt.',
    },
  },
};
