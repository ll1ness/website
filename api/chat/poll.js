// GET /api/chat/poll?sid=...&lastId=...
// Возвращает ответы из Telegram для сессии (весь журнал, от lastId наверх).
import { kvGet, sendJson, SID_RE } from '../../lib/tg.js';

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://local');
  const sid = String(url.searchParams.get('sid') || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  const lastId = Math.max(0, Number(url.searchParams.get('lastId') || 0) || 0);

  try {
    const raw = await kvGet('messages:' + sid);
    let list = [];
    if (raw) { try { list = JSON.parse(raw); } catch (e) { list = []; } }
    if (!Array.isArray(list)) list = [];
    const messages = list.filter((m) => m && m.text && Number(m.id) > lastId).slice(-20);
    return sendJson(res, 200, { ok: true, messages: messages });
  } catch (err) {
    return sendJson(res, 502, { ok: false, error: String(err.message || err) });
  }
}