// POST /api/chat/webhook  — приём апдейтов от Telegram (вебхук бота).
// Ответы из тем, принадлежащих гостевым сессиям, складываются в chat_messages.
import { dbSelect, dbInsert, readBody, sendJson } from '../../lib/tg.js';

export default async function handler(req, res) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return sendJson(res, 401, { ok: false });
  }

  let update;
  try { update = JSON.parse((await readBody(req)) || '{}'); }
  catch (err) { return sendJson(res, 400, { ok: false }); }

  const msg = update && update.message;
  if (!msg || !msg.text || !msg.message_thread_id) return sendJson(res, 200, { ok: true });
  if (msg.from && msg.from.is_bot) return sendJson(res, 200, { ok: true });

  const thread = String(msg.message_thread_id);
  try {
    const rows = await dbSelect('chat_threads', 'select=sid&thread_id=eq.' + encodeURIComponent(thread));
    if (!rows || !rows.length) return sendJson(res, 200, { ok: true }); // тема не от нашего гостя
    await dbInsert('chat_messages', { sid: rows[0].sid, text: String(msg.text), ts: Date.now() });
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    // молча 200 — иначе Telegram будет ретраить бесконечно
    return sendJson(res, 200, { ok: true });
  }
}