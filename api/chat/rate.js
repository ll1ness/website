// POST /api/chat/rate  { sid, score }
// Оценка работы поддержки (1–5) после закрытия темы.
// Сохраняется в chat_ratings и дублируется в группу (общая тема форума, id=1),
// чтобы админ видел оценки. Промах при отправке в группу — не критичен.
import { dbSelect, dbInsert, telegram, readBody, sendJson, SID_RE } from '../../lib/tg.js';

const e = encodeURIComponent;

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method' });

  let body;
  try { body = JSON.parse((await readBody(req)) || '{}'); }
  catch (err) { return sendJson(res, 400, { ok: false, error: 'bad json' }); }

  const sid = String(body.sid || '').trim();
  const score = Number(body.score);
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return sendJson(res, 400, { ok: false, error: 'bad score' });
  }

  const chatId = process.env.TELEGRAM_CHAT_ID;
  try {
    await dbInsert('chat_ratings', { sid: sid, score: score, ts: Date.now() });

    let name = 'Гость';
    try {
      const rows = await dbSelect('chat_sessions', 'select=guest_name&sid=eq.' + e(sid));
      if (rows && rows.length && rows[0].guest_name) name = rows[0].guest_name;
    } catch (err2) {}

    if (chatId) {
      try {
        const stars = '★'.repeat(score) + '☆'.repeat(5 - score);
        await telegram('sendMessage', {
          chat_id: chatId,
          message_thread_id: 1, // общая тема форума («General»)
          text: name + ' оценил(а) поддержку: ' + stars + ' (' + score + '/5)'
        });
      } catch (err3) {}
    }
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    return sendJson(res, 502, { ok: false, error: String(err.message || err) });
  }
}