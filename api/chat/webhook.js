// POST /api/chat/webhook  — приём апдейтов от Telegram (вебхук бота).
// Сообщения из тем супергруппы, принадлежащих гостевым сессиям,
// складываются в «входящие» этих сессий для последующего poll'а.
import { kvGet, kvSet, kvIncr, readBody, sendJson } from '../../lib/tg.js';

export default async function handler(req, res) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return sendJson(res, 401, { ok: false });
  }

  let update;
  try { update = JSON.parse((await readBody(req)) || '{}'); }
  catch (e) { return sendJson(res, 400, { ok: false }); }

  const msg = update && update.message;
  if (!msg || !msg.text || !msg.message_thread_id) return sendJson(res, 200, { ok: true });
  if (msg.from && msg.from.is_bot) return sendJson(res, 200, { ok: true });

  const thread = String(msg.message_thread_id);
  try {
    const sid = await kvGet('thread:' + thread);
    if (!sid) return sendJson(res, 200, { ok: true }); // тема не от нашего гостя

    const id = await kvIncr('msgseq');
    const raw = await kvGet('messages:' + sid);
    let list = [];
    if (raw) { try { list = JSON.parse(raw); } catch (e) { list = []; } }
    if (!Array.isArray(list)) list = [];
    list.push({ id: id, text: String(msg.text), ts: Date.now() });
    if (list.length > 100) list = list.slice(-100);
    await kvSet('messages:' + sid, JSON.stringify(list));
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    // молча 200 — иначе Telegram будет ретраить бесконечно
    return sendJson(res, 200, { ok: true });
  }
}