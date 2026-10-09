/* =====================================================================
   الخادم الخلفي: يخدم ملفات الموقع كما هي، ويضيف مسارات API
   لأداة مولّد الاستبيان (إنشاء / جلب / إرسال إجابة / نتائج / بيانات خام).
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
      color TEXT,
      thanks_message TEXT,
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
  // ترقية جداول قديمة أُنشئت قبل إضافة عمودي color و thanks_message
  try { await db.prepare(`ALTER TABLE surveys ADD COLUMN color TEXT`).run(); } catch (e) {}
  try { await db.prepare(`ALTER TABLE surveys ADD COLUMN thanks_message TEXT`).run(); } catch (e) {}
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ============ إنشاء استبيان ============
    if (path === '/api/surveys' && request.method === 'POST') {
      await ensureTables(env.DB);
      const body = await request.json();
      if (!body.title || !Array.isArray(body.questions) || body.questions.length === 0) {
        return json({ error: 'بيانات ناقصة' }, 400);
      }
      const id = uid();
      await env.DB.prepare(
        `INSERT INTO surveys (id, title, description, color, thanks_message, questions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, body.title, body.description || '', body.color || '#2F5770',
        body.thanksMessage || '', JSON.stringify(body.questions), new Date().toISOString()
      ).run();
      return json({ id });
    }

    // ============ تحديث استبيان موجود ============
    const updMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)$/);
    if (updMatch && request.method === 'PUT') {
      await ensureTables(env.DB);
      const body = await request.json();
      await env.DB.prepare(
        `UPDATE surveys SET title=?, description=?, color=?, thanks_message=?, questions=? WHERE id=?`
      ).bind(
        body.title, body.description || '', body.color || '#2F5770',
        body.thanksMessage || '', JSON.stringify(body.questions), updMatch[1]
      ).run();
      return json({ ok: true });
    }

    // ============ جلب استبيان ============
    if (updMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const row = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(updMatch[1]).first();
      if (!row) return json({ error: 'غير موجود' }, 404);
      return json({
        id: row.id, title: row.title, description: row.description,
        color: row.color || '#2F5770', thanksMessage: row.thanks_message || '',
        questions: JSON.parse(row.questions),
      });
    }

    // ============ حذف استبيان ============
    if (updMatch && request.method === 'DELETE') {
      await ensureTables(env.DB);
      await env.DB.prepare(`DELETE FROM surveys WHERE id = ?`).bind(updMatch[1]).run();
      await env.DB.prepare(`DELETE FROM responses WHERE survey_id = ?`).bind(updMatch[1]).run();
      return json({ ok: true });
    }

    // ============ إرسال إجابة (يرجع رقم المستجيب) ============
    const respMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/responses$/);
    if (respMatch && request.method === 'POST') {
      await ensureTables(env.DB);
      const body = await request.json();
      const survey = await env.DB.prepare(`SELECT id FROM surveys WHERE id = ?`).bind(respMatch[1]).first();
      if (!survey) return json({ error: 'الاستبيان غير موجود' }, 404);
      await env.DB.prepare(
        `INSERT INTO responses (id, survey_id, answers, created_at) VALUES (?, ?, ?, ?)`
      ).bind(uid(), respMatch[1], JSON.stringify(body.answers || {}), new Date().toISOString()).run();
      const countRow = await env.DB.prepare(
        `SELECT COUNT(*) as c FROM responses WHERE survey_id = ?`
      ).bind(respMatch[1]).first();
      return json({ ok: true, respondentNumber: countRow.c });
    }

    // ============ ملخص النتائج (تكرارات جاهزة) ============
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
        title: survey.title, description: survey.description,
        color: survey.color || '#2F5770', totalResponses,
        questions: questions.map(q => ({
          id: q.id, title: q.title, type: q.type, section: q.section || null,
          tally: tally[q.id], textAnswers: textAnswers[q.id] || [],
        })),
      });
    }

    // ============ بيانات خام (للتصدير والإحصاء المتقدم) ============
    const rawMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/raw$/);
    if (rawMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const survey = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(rawMatch[1]).first();
      if (!survey) return json({ error: 'غير موجود' }, 404);
      const { results: rows } = await env.DB.prepare(
        `SELECT answers, created_at FROM responses WHERE survey_id = ? ORDER BY created_at ASC`
      ).bind(rawMatch[1]).all();
      return json({
        title: survey.title,
        questions: JSON.parse(survey.questions),
        responses: rows.map(r => ({ answers: JSON.parse(r.answers), created_at: r.created_at })),
      });
    }

    // ============ خلاف ذلك: خدمة ملفات الموقع كما هي ============
    return env.ASSETS.fetch(request);
  },
};
