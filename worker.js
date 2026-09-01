/* =====================================================================
   الخادم الخلفي: يخدم ملفات الموقع كما هي، ويضيف مسارات API
   لأداة مولّد الاستبيان (إنشاء / جلب / إرسال إجابة / نتائج).
===================================================================== */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function uid() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

async function ensureTables(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS surveys (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      questions TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      survey_id TEXT NOT NULL,
      answers TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
  ]);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ============ API: إنشاء استبيان ============
    if (path === '/api/surveys' && request.method === 'POST') {
      await ensureTables(env.DB);
      const body = await request.json();
      if (!body.title || !Array.isArray(body.questions) || body.questions.length === 0) {
        return json({ error: 'بيانات ناقصة' }, 400);
      }
      const id = uid();
      await env.DB.prepare(
        `INSERT INTO surveys (id, title, description, questions, created_at) VALUES (?, ?, ?, ?, ?)`
      ).bind(id, body.title, body.description || '', JSON.stringify(body.questions), new Date().toISOString()).run();
      return json({ id });
    }

    // ============ API: جلب استبيان ============
    const getMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)$/);
    if (getMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const row = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(getMatch[1]).first();
      if (!row) return json({ error: 'غير موجود' }, 404);
      return json({
        id: row.id,
        title: row.title,
        description: row.description,
        questions: JSON.parse(row.questions),
      });
    }

    // ============ API: إرسال إجابة ============
    const respMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/responses$/);
    if (respMatch && request.method === 'POST') {
      await ensureTables(env.DB);
      const body = await request.json();
      const survey = await env.DB.prepare(`SELECT id FROM surveys WHERE id = ?`).bind(respMatch[1]).first();
      if (!survey) return json({ error: 'الاستبيان غير موجود' }, 404);
      await env.DB.prepare(
        `INSERT INTO responses (id, survey_id, answers, created_at) VALUES (?, ?, ?, ?)`
      ).bind(uid(), respMatch[1], JSON.stringify(body.answers || {}), new Date().toISOString()).run();
      return json({ ok: true });
    }

    // ============ API: النتائج والتحليل ============
    const resultsMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/results$/);
    if (resultsMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const survey = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(resultsMatch[1]).first();
      if (!survey) return json({ error: 'غير موجود' }, 404);
      const questions = JSON.parse(survey.questions);
      const { results: rows } = await env.DB.prepare(
        `SELECT answers FROM responses WHERE survey_id = ?`
      ).bind(resultsMatch[1]).all();

      const totalResponses = rows.length;
      const tally = {};
      questions.forEach(q => { tally[q.id] = {}; });
      const textAnswers = {};

      rows.forEach(r => {
        const answers = JSON.parse(r.answers);
        questions.forEach(q => {
          const val = answers[q.id];
          if (val === undefined || val === null || val === '') return;
          if (q.type === 'checkbox' && Array.isArray(val)) {
            val.forEach(v => { tally[q.id][v] = (tally[q.id][v] || 0) + 1; });
          } else if (['radio', 'dropdown', 'yesno', 'rating'].includes(q.type)) {
            tally[q.id][val] = (tally[q.id][val] || 0) + 1;
          } else {
            (textAnswers[q.id] = textAnswers[q.id] || []).push(val);
          }
        });
      });

      return json({
        title: survey.title,
        description: survey.description,
        totalResponses,
        questions: questions.map(q => ({
          id: q.id, title: q.title, type: q.type,
          tally: tally[q.id],
          textAnswers: textAnswers[q.id] || [],
        })),
      });
    }

    // ============ خلاف ذلك: خدمة ملفات الموقع كما هي ============
    return env.ASSETS.fetch(request);
  },
};
