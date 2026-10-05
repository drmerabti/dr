/* ============================================================
   draftEmail — Cloud Function (callable) — REFERENCE VERSION
   Matches what tools/mail-assistant/app.js sends.

   Use it only if you want the new options handled by the server:
   longer / fix mistakes / translate, the "firm" and "concise" tones,
   the length setting, and the sender's name in the signature.
   The page also keeps working with the existing draftEmail function:
   it still sends the same fields as before (mode, recipient, subject,
   purpose, points, tone, language / action, currentDraft, language).

   Add it to the same index.js as your other functions (it uses the
   same GROQ_API_KEY secret). If admin.initializeApp() is already called
   at the top of that file, do not call it again.
============================================================ */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const GROQ_API_KEY = defineSecret("GROQ_API_KEY");

const LANG_NAME = { ar: "Arabic (Modern Standard Arabic)", fr: "French", en: "English" };
const TONE = {
  formal_high: "very formal and respectful",
  formal: "formal and professional",
  friendly: "warm, friendly but still professional",
  firm: "firm, clear and assertive, while remaining polite",
  concise: "concise and direct, no filler",
};
const LENGTH = { short: "short (about 60–90 words)", medium: "medium (about 120–180 words)", long: "detailed (about 220–320 words)" };
const PURPOSE = {
  request: "a request", complaint: "an administrative complaint", followup: "a follow-up",
  apology: "an apology", thanks: "a thank-you message", intro: "an introduction of oneself", other: "a professional message",
};
const ACTIONS = {
  rewrite: "Rephrase the email with different wording, keeping the same meaning, facts and tone.",
  shorten: "Make the email noticeably shorter (about half), keeping every key fact.",
  lengthen: "Make the email a little longer and more complete, adding polite context but no invented facts.",
  more_formal: "Make the email more formal and respectful.",
  more_friendly: "Make the email warmer and friendlier while staying professional.",
  fix: "Correct spelling, grammar and punctuation only. Do not change the wording otherwise.",
  translate: "Translate the email faithfully, adapting greetings and closing formulas to the target language's conventions.",
};
const clip = (v, n) => String(v || "").slice(0, n);

function buildPrompt(d) {
  const lang = LANG_NAME[d.language] || LANG_NAME.en;
  if (d.mode === "revise") {
    return `You edit professional emails. ${ACTIONS[d.action]}
Write the result in ${lang}. Output ONLY the email body (greeting, text and closing formula), with no subject line, no signature block and no comments.

Email:
"""
${d.currentDraft}
"""`;
  }
  return `You write professional emails. Write ${PURPOSE[d.purpose] || PURPOSE.other} email in ${lang}.
Tone: ${TONE[d.tone] || TONE.formal}. Length: ${LENGTH[d.length] || LENGTH.medium}.
${d.recipient ? `Recipient: ${d.recipient}.` : ""}
${d.subject ? `Subject: ${d.subject}.` : ""}
${d.senderName ? `Sender: ${d.senderName}${d.senderJob ? ", " + d.senderJob : ""}${d.senderOrg ? ", " + d.senderOrg : ""}.` : ""}
What the sender wants to say (in their own words):
"""
${d.points}
"""
${d.subject ? "" : "Start with one line \"Subject: ...\" (in the email language), then a blank line, then the email."}
Output the greeting, the body and the closing formula only. Do not add a signature block (it is added separately), no placeholders in brackets, no comments.`;
}

exports.draftEmail = onCall({ secrets: [GROQ_API_KEY] }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
  const b = request.data || {};
  const mode = b.mode === "revise" ? "revise" : "generate";
  const language = ["ar", "fr", "en"].includes(b.language) ? b.language : "ar";
  const d = {
    mode, language,
    action: ACTIONS[b.action] ? b.action : "rewrite",
    currentDraft: clip(b.currentDraft, 6000),
    purpose: clip(b.purpose, 30), tone: clip(b.tone, 30), length: clip(b.length, 10),
    recipient: clip(b.recipient, 300), subject: clip(b.subject, 300), points: clip(b.points, 3000),
    senderName: clip(b.senderName, 120), senderJob: clip(b.senderJob, 160), senderOrg: clip(b.senderOrg, 160),
  };
  if (mode === "generate" && !d.points.trim()) throw new HttpsError("invalid-argument", "points required");
  if (mode === "revise" && !d.currentDraft.trim()) throw new HttpsError("invalid-argument", "currentDraft required");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY.value()}` },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: buildPrompt(d) }],
      temperature: d.action === "fix" ? 0.1 : 0.5,
    }),
  });
  if (!res.ok) throw new HttpsError("unavailable", "AI service error");
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new HttpsError("internal", "empty response");
  return { text };
});
