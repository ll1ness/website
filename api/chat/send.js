// POST /api/chat/send  { sid, text }
// Первое сообщение сессии создаёт в супергруппе-форуме тему «Гость #N»
// и запоминает session -> message_thread_id. Дальше всё летит в ту же тему.
import { telegram, kvGet, kvSet, kvIncr, readBody, sendJson, SID_RE } from '../../lib/tg.js';

const RATE_MS = 2000; // не чаще одного сообщения в 2 секунды на сессию

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method' });

  let body;
  try { body = JSON.parse((await readBody(req)) || '{}'); }
  catch (e) { return sendJson(res, 400, { ok: false, error: 'bad json' }); }

  const sid = String(body.sid || '').trim();
  const text = String(body.text || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  if (!text || text.length > 500) return sendJson(res, 400, { ok: false, error: 'bad text' });

  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return sendJson(res, 500, { ok: false, error: 'no chat' });

  try {
    // throttle
    const rl = await kvGet('rl:' + sid);
    if (rl && Date.now() - Number(rl) < RATE_MS) {
      return sendJson(res, 429, { ok: false, error: 'slow down' });
    }
    await kvSet('rl:' + sid, Date.now());

    let thread = await kvGet('session:' + sid);
    let name = await kvGet('name:' + sid);

    if (!thread) {
      const n = await kvIncr('guestCount');
      name = name || ('Гость #' + n);
      const created = await telegram('createForumTopic', { chat_id: chatId, name: name });
      thread = String(created.message_thread_id);
      await Promise.all([
        kvSet('session:' + sid, thread),
        kvSet('thread:' + thread, sid),
        kvSet('name:' + sid, name)
      ]);
    }

    await telegram('sendMessage', {
      chat_id: chatId,
      message_thread_id: thread,
      text: name + ': ' + text
    });
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    return sendJson(res, 502, { ok: false, error: String(err.message || err) });
  }
}