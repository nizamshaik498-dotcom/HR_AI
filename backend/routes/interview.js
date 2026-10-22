const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { pick, getById, ROUNDS } = require('../services/questions');
const { evaluateAnswer, buildReport } = require('../services/evaluator');

const WEIGHTS = { hr: 0.3, technical: 0.4, communication: 0.3 };
const pub = (q) => ({
  id: q.id, type: q.type, question: q.question,
  options: q.options, difficulty: q.difficulty, target_words: q.target_words,
});

router.use(auth);

function validateStart(body) {
  const { round, count } = body || {};
  if (!ROUNDS.includes(round)) return 'Invalid round';
  if (count !== undefined && (typeof count !== 'number' || count < 3 || count > 10)) return 'Count must be 3-10';
  return null;
}

function validateSubmit(body) {
  const { answers } = body || {};
  if (!Array.isArray(answers)) return 'Answers array required';
  for (const a of answers) {
    if (!a.questionId || typeof a.questionId !== 'string') return 'Each answer needs questionId';
    if (a.answer !== undefined && typeof a.answer !== 'string') return 'Answer must be string';
    if (a.durationSec !== undefined && (typeof a.durationSec !== 'number' || a.durationSec < 0 || a.durationSec > 3600)) {
      return 'durationSec must be 0-3600';
    }
  }
  return null;
}

router.post('/start', (req, res) => {
  const err = validateStart(req.body);
  if (err) return res.status(400).json({ error: err });
  const body = req.body || {};
  const count = Math.min(10, Math.max(3, Number(body.count) || 5));
  const qs = pick(body.round, count);
  if (!qs.length) return res.status(404).json({ error: 'No questions for this round' });
  const info = db
    .prepare('INSERT INTO sessions(user_id,round,question_ids) VALUES (?,?,?)')
    .run(req.user.id, body.round, JSON.stringify(qs.map((q) => q.id)));
  res.json({ sessionId: Number(info.lastInsertRowid), questions: qs.map(pub) });
});

router.get('/stats/summary', (req, res) => {
  const rows = db
    .prepare("SELECT id, round, score, created_at FROM sessions WHERE user_id=? AND status='completed' ORDER BY id DESC")
    .all(req.user.id);
  const latest = {};
  rows.forEach((r) => { if (!(r.round in latest)) latest[r.round] = r.score; });
  let sum = 0, w = 0;
  for (const [r, s] of Object.entries(latest)) { sum += s * WEIGHTS[r]; w += WEIGHTS[r]; }
  res.json({ history: rows.reverse(), latest, overall: w ? Math.round(sum / w) : null });
});

router.post('/:id/submit', async (req, res) => {
  try {
    const err = validateSubmit(req.body);
    if (err) return res.status(400).json({ error: err });

    const s = db.prepare('SELECT * FROM sessions WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
    if (!s) return res.status(404).json({ error: 'Session not found' });
    if (s.status === 'completed') return res.status(400).json({ error: 'Already submitted' });

    const questions = JSON.parse(s.question_ids).map(getById);
    const given = Array.isArray(req.body?.answers) ? req.body.answers : [];
    const byId = Object.fromEntries(given.map((a) => [a.questionId, a]));
    const answers = questions.map((q) => ({
      answer: String(byId[q.id]?.answer ?? '').slice(0, 4000),
      durationSec: Math.max(0, Number(byId[q.id]?.durationSec) || 0),
    }));

    const results = await Promise.all(questions.map((q, i) => evaluateAnswer(q, answers[i].answer, answers[i].durationSec)));
    const report = buildReport(s.round, questions, results, answers);

    db.transaction(() => {
      const ins = db.prepare(
        'INSERT INTO answers(session_id,question_id,answer_text,duration_sec,score,feedback_json) VALUES (?,?,?,?,?,?)'
      );
      questions.forEach((q, i) =>
        ins.run(s.id, q.id, answers[i].answer, answers[i].durationSec, results[i].score, JSON.stringify(results[i]))
      );
      db.prepare("UPDATE sessions SET status='completed', score=?, report_json=?, completed_at=CURRENT_TIMESTAMP WHERE id=?")
        .run(report.score, JSON.stringify(report), s.id);
    })();

    res.json({ sessionId: s.id, score: report.score });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Evaluation failed. Please try again.' });
  }
});

router.get('/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM sessions WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
  if (!s || s.status !== 'completed') return res.status(404).json({ error: 'Report not found' });
  res.json({ round: s.round, score: s.score, createdAt: s.created_at, report: JSON.parse(s.report_json) });
});

module.exports = router;