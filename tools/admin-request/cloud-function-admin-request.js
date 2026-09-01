/* ============================================================
   generateAdminRequest — Cloud Function
   أضف هذا الكود لملف index.js الحالي (نفس ملف detectAiText وhumanizeText)
   يستخدم نفس GROQ_API_KEY الموجود أصلاً كـ Secret — بدون أي مفتاح جديد.
============================================================ */

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
// ملاحظة: لو admin.initializeApp() مستدعاة أصلاً بأعلى الملف، لا تكررها هنا.

const GROQ_API_KEY = defineSecret("GROQ_API_KEY"); // نفس الـ Secret الموجود أصلاً

const DAILY_LIMIT = 2; // مرتين كل 24 ساعة لكل مستخدم — عدّل الرقم هنا لاحقًا لما تفعّل الدفع

const PROMPTS = {
  generate: {
    ar: (d) => `أنت مساعد كتابة رسائل إدارية رسمية بالفصحى. اكتب طلبًا إداريًا رسميًا ومهذبًا بناءً على المعطيات التالية، بدون مقدمة أو تعليق إضافي، النص فقط جاهز للطباعة:
الاسم الكامل: ${d.firstName} ${d.lastName}
الهاتف: ${d.phone || 'غير محدد'}
البريد: ${d.email || 'غير محدد'}
موجّه إلى: ${d.addressedTo || 'الجهة المعنية'}
${d.extraFields.map(f => `${f.key}: ${f.val}`).join('\n')}
موضوع الطلب: ${d.requestSubject}

اكتب نص الطلب فقط (بدون التاريخ أو التوقيع، هذول موجودين بمكان منفصل)، بأسلوب رسمي مهذب، فقرة تمهيدية + طلب واضح + خاتمة مهذبة.`,
    en: (d) => `You are an assistant writing formal administrative letters. Write a polite, formal administrative request based on the following details, output ONLY the letter body text, ready to print, no preamble:
Full name: ${d.firstName} ${d.lastName}
Phone: ${d.phone || 'N/A'}
Email: ${d.email || 'N/A'}
Addressed to: ${d.addressedTo || 'the concerned department'}
${d.extraFields.map(f => `${f.key}: ${f.val}`).join('\n')}
Request subject: ${d.requestSubject}

Write only the body text (no date or signature, those are placed separately), formal tone, opening + clear request + polite closing.`,
    fr: (d) => `Tu es un assistant de rédaction de lettres administratives formelles. Rédige une demande administrative polie et formelle à partir des informations suivantes, uniquement le corps du texte, prêt à imprimer, sans préambule:
Nom complet: ${d.firstName} ${d.lastName}
Téléphone: ${d.phone || 'N/A'}
E-mail: ${d.email || 'N/A'}
Adressée à: ${d.addressedTo || 'le service concerné'}
${d.extraFields.map(f => `${f.key}: ${f.val}`).join('\n')}
Objet de la demande: ${d.requestSubject}

Rédige uniquement le corps du texte (sans date ni signature, placées séparément), ton formel, ouverture + demande claire + formule de politesse finale.`,
  },
  rephrase: {
    ar: (d) => `أعد صياغة النص التالي بأسلوب إداري رسمي أكثر احترافية، مع الحفاظ التام على نفس المعنى والمعلومات، بدون أي تعليق إضافي، النص فقط:\n\n${d.currentText}`,
    en: (d) => `Rephrase the following text in a more professional, formal administrative tone, keeping the exact same meaning and information. Output ONLY the rewritten text:\n\n${d.currentText}`,
    fr: (d) => `Reformule le texte suivant dans un style administratif plus formel et professionnel, en conservant exactement le même sens et les mêmes informations. Donne uniquement le texte reformulé:\n\n${d.currentText}`,
  },
  shorten: {
    ar: (d) => `اختصر النص التالي للنصف تقريبًا، مع الحفاظ على المعنى الأساسي والأسلوب الرسمي، بدون أي تعليق إضافي، النص فقط:\n\n${d.currentText}`,
    en: (d) => `Shorten the following text to about half its length, keeping the core meaning and formal tone. Output ONLY the shortened text:\n\n${d.currentText}`,
    fr: (d) => `Raccourcis le texte suivant à environ la moitié de sa longueur, en conservant le sens principal et le ton formel. Donne uniquement le texte raccourci:\n\n${d.currentText}`,
  },
};

exports.generateAdminRequest = onRequest(
  { secrets: [GROQ_API_KEY], cors: true },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method-not-allowed" });
      return;
    }

    // ---- 1. التحقق من تسجيل الدخول ----
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }

    let uid;
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch (e) {
      res.status(401).json({ error: "invalid-token" });
      return;
    }

    // ---- 2. التحقق من الحد اليومي (Firestore) ----
    const db = admin.firestore();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const usageRef = db.collection("adminRequestUsage").doc(`${uid}_${today}`);

    let usedToday = 0;
    try {
      const snap = await usageRef.get();
      usedToday = snap.exists ? (snap.data().count || 0) : 0;
    } catch (e) {
      // لو فشل القراءة، نكمل بحذر (usedToday = 0) بدل ما نمنع المستخدم بالغلط
    }

    if (usedToday >= DAILY_LIMIT) {
      res.status(429).json({ error: "limit-reached", usedToday });
      return;
    }

    // ---- 3. بناء الـ Prompt حسب الوضع ----
    const { mode, lang } = req.body || {};
    const validModes = ["generate", "rephrase", "shorten"];
    const validLangs = ["ar", "en", "fr"];
    if (!validModes.includes(mode) || !validLangs.includes(lang)) {
      res.status(400).json({ error: "invalid-params" });
      return;
    }

    const d = {
      firstName: (req.body.firstName || "").slice(0, 100),
      lastName: (req.body.lastName || "").slice(0, 100),
      phone: (req.body.phone || "").slice(0, 50),
      email: (req.body.email || "").slice(0, 100),
      addressedTo: (req.body.addressedTo || "").slice(0, 200),
      requestSubject: (req.body.requestSubject || "").slice(0, 1000),
      extraFields: Array.isArray(req.body.extraFields) ? req.body.extraFields.slice(0, 10) : [],
      currentText: (req.body.currentText || "").slice(0, 4000),
    };

    const promptText = PROMPTS[mode][lang](d);

    // ---- 4. استدعاء Groq ----
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY.value()}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [{ role: "user", content: promptText }],
          temperature: 0.5,
        }),
      });

      if (!groqRes.ok) {
        res.status(502).json({ error: "groq-error" });
        return;
      }

      const groqData = await groqRes.json();
      const text = groqData.choices?.[0]?.message?.content?.trim();
      if (!text) {
        res.status(502).json({ error: "empty-response" });
        return;
      }

      // ---- 5. تحديث عداد الاستخدام (بس لو mode === generate، عشان تعديل/اختصار ما يحسبوا كاستخدام جديد منفصل) ----
      if (mode === "generate") {
        await usageRef.set({ count: usedToday + 1, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        usedToday += 1;
      }

      res.status(200).json({ text, usedToday });
    } catch (e) {
      res.status(500).json({ error: "server-error" });
    }
  }
);
