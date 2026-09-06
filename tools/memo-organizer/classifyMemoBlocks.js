// Add this function to your existing index.js (functions project)
// Reuses the same groqApiKey secret already used by detectAiText/humanizeText/generateAdminRequest

exports.classifyMemoBlocks = functions
  .runWith({ secrets: ["groqApiKey"] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "يجب تسجيل الدخول.");
    }

    const blocks = data.blocks || [];
    const lang = data.lang || "ar";
    if (!blocks.length) return { classifications: {} };

    const listText = blocks
      .map((b) => `[${b.id}] (حجم:${b.fontSize}, غامق:${b.bold ? "نعم" : "لا"}) ${b.text}`)
      .join("\n");

    const prompt = `فيما يلي فقرات من مذكرة أكاديمية، مع تلميحات تنسيقها الأصلية (حجم الخط، هل هي غامقة). صنّف كل فقرة إلى واحدة من: h1 (عنوان رئيسي)، h2 (عنوان فرعي)، body (فقرة عادية). اعتمد على حجم الخط، الغموق، وطول النص ومعناه (العناوين عادة قصيرة).

أعد النتيجة بصيغة JSON فقط، بدون أي نص إضافي، بالشكل التالي بالضبط:
{"classifications": {"id1": "h1", "id2": "body", ...}}

الفقرات:
${listText}`;

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.groqApiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      throw new functions.https.HttpsError("internal", "فشل الاتصال بخدمة التصنيف.");
    }

    const json = await resp.json();
    let parsed;
    try {
      parsed = JSON.parse(json.choices[0].message.content);
    } catch (e) {
      throw new functions.https.HttpsError("internal", "تعذّر فهم نتيجة التصنيف.");
    }

    return { classifications: parsed.classifications || {} };
  });
