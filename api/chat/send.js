// POST /api/chat/send  { sid, text }
// Первое сообщение сессии создаёт в супергруппе-форуме тему «Гость #N».
// Если прошлую тему поддержка закрыла — следующий вопрос уходит в НОВУЮ тему.
import { telegram, dbSelect, dbInsert, dbDelete, dbUpsert, dbRpc, readBody, sendJson, SID_RE } from '../../lib/tg.js';

const RATE_MS = 2000; // не чаще одного сообщения в 2 секунды на сессию
const e = encodeURIComponent;

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method' });

  let body;
  try { body = JSON.parse((await readBody(req)) || '{}'); }
  catch (err) { return sendJson(res, 400, { ok: false, error: 'bad json' }); }

  const sid = String(body.sid || '').trim();
  const text = String(body.text || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  if (!text || text.length > 500) return sendJson(res, 400, { ok: false, error: 'bad text' });

  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return sendJson(res, 500, { ok: false, error: 'no chat' });

  try {
    // throttle: не чаще одного сообщения в 2 секунды на сессию
    const rl = await dbSelect('chat_rate', 'select=ts&sid=eq.' + e(sid));
    if (rl && rl.length && Date.now() - Number(rl[0].ts) < RATE_MS) {
      return sendJson(res, 429, { ok: false, error: 'slow down' });
    }
    await dbUpsert('chat_rate', { sid: sid, ts: Date.now() }, 'sid');

    let sess = null;
    try {
      sess = await dbSelect('chat_sessions', 'select=thread_id,guest_name,closed_at&sid=eq.' + e(sid));
    } catch (err1) {
      // миграция с closed_at ещё не применена в БД — работаем без функционала закрытия
      sess = await dbSelect('chat_sessions', 'select=thread_id,guest_name&sid=eq.' + e(sid));
    }
    let thread = sess && sess.length ? sess[0].thread_id : null;
    let name = sess && sess.length ? sess[0].guest_name : null;
    const closed = sess && sess.length ? sess[0].closed_at : null;

    // новая тема: при первом сообщении или после закрытия предыдущей темы
    if (!thread || closed) {
      if (thread && closed) {
        try { await dbDelete('chat_threads', 'thread_id=eq.' + e(thread)); } catch (err2) {}
      }
      const n = await dbRpc('next_val', { cname: 'guestCount' });
      name = 'Гость #' + n;
      const created = await telegram('createForumTopic', { chat_id: chatId, name: name });
      thread = String(created.message_thread_id);
      await Promise.all([
        dbUpsert('chat_sessions', { sid: sid, thread_id: thread, guest_name: name, closed_at: null }, 'sid'),
        dbInsert('chat_threads', { thread_id: thread, sid: sid })
      ]);
    }

    await telegram('sendMessage', {
      chat_id: chatId,
      message_thread_id: thread,
      text: text
    });
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    return sendJson(res, 502, { ok: false, error: String(err.message || err) });
  }
}