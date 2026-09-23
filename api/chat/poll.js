// GET /api/chat/poll?sid=...&lastId=...
// Возвращает ответы из Telegram для сессии (новые сообщения, id > lastId).
import { dbSelect, sendJson, SID_RE } from '../../lib/tg.js';

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://local');
  const sid = String(url.searchParams.get('sid') || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  const lastId = Math.max(0, Number(url.searchParams.get('lastId') || 0) || 0);

  try {
    const messages = await dbSelect(
      'chat_messages',
      'select=id,text,ts&sid=eq.' + encodeURIComponent(sid) + '&id=gt.' + lastId + '&order=id.asc&limit=20'
    );
    return sendJson(res, 200, { ok: true, messages: messages || [] });
  } catch (err) {
    return sendJson(res, 502, { ok: false, error: String(err.message || err) });
  }
}