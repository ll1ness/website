// POST /api/chat/webhook  — приём апдейтов от Telegram (вебхук бота).
// 1) Письмо админа в теме гостя → chat_messages → долетает в виджет на сайте.
// 2) Команда /end (в теме гостя, только от админа) → тема закрывается,
//    гость видит «тема закрыта» + окно оценки; привязка thread→session удаляется,
//    следующий вопрос гостя создаст новую тему.
import { telegram, dbSelect, dbInsert, dbDelete, dbUpsert, readBody, sendJson } from '../../lib/tg.js';

const e = encodeURIComponent;

function isAdmin(status) {
  return status === 'administrator' || status === 'creator';
}

export default async function handler(req, res) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return sendJson(res, 401, { ok: false });
  }

  let update;
  try { update = JSON.parse((await readBody(req)) || '{}'); }
  catch (err) { return sendJson(res, 400, { ok: false }); }

  const msg = update && update.message;
  if (!msg || !msg.message_thread_id) return sendJson(res, 200, { ok: true });

  const thread = String(msg.message_thread_id);
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    // ── команда /end: закрыть тему гостя (только админ группы) ──
    const cmd = (msg.text || '').trim().split(/[\s@]/)[0].toLowerCase();
    if (cmd === '/end') {
      if (msg.from && msg.from.id) {
        let member = null;
        try { member = await telegram('getChatMember', { chat_id: chatId, user_id: msg.from.id }); }
        catch (err2) { member = null; }
        if (member && isAdmin(member.status)) {
          const rows = await dbSelect('chat_threads', 'select=sid&thread_id=eq.' + e(thread));
          if (rows && rows.length) {
            const sid = rows[0].sid;
            try {
              await telegram('closeForumTopic', { chat_id: chatId, message_thread_id: Number(thread) });
            } catch (err3) {}
            await Promise.all([
              dbInsert('chat_messages', { sid: sid, text: '', ts: Date.now(), kind: 'closed' }),
              dbDelete('chat_threads', 'thread_id=eq.' + e(thread))
            ]);
            try { await dbUpsert('chat_sessions', { sid: sid, closed_at: Date.now() }, 'sid'); } catch (err4) {}
          }
        }
      }
      return sendJson(res, 200, { ok: true });
    }

    // ── обычное сообщение в теме ──
    if (!msg.text || (msg.from && msg.from.is_bot)) return sendJson(res, 200, { ok: true });

    const owner = await dbSelect('chat_threads', 'select=sid&thread_id=eq.' + e(thread));
    if (!owner || !owner.length) return sendJson(res, 200, { ok: true }); // тема не от нашего гостя
    await dbInsert('chat_messages', { sid: owner[0].sid, text: String(msg.text), ts: Date.now() });
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    // молча 200 — иначе Telegram будет ретраить бесконечно
    return sendJson(res, 200, { ok: true });
  }
}