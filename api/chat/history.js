// GET /api/chat/history?sid=...&limit=...
// Вся переписка одной сессии из Supabase: ответы поддержки + реплики гостя
// (виджет их раньше показывал только до перезагрузки страницы).
// Всё, что было до последней отметки закрытия темы, отсекается: после /end
// диалог начинается заново. lastId — id самого свежего сообщения в БД, с него
// виджет продолжает живое poll, не показывая историю дважды.
import { dbSelect, sendJson, SID_RE, CLOSED_SENTINEL, decodeMessage } from '../../lib/tg.js';

export const maxDuration = 15;

const e = encodeURIComponent;
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://local');
  const sid = String(url.searchParams.get('sid') || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  const wanted = Number(url.searchParams.get('limit'));
  const limit = Number.isFinite(wanted) && wanted > 0 ? Math.min(MAX_LIMIT, Math.floor(wanted)) : DEFAULT_LIMIT;

  try {
    // самые свежие сообщения, затем разворот — виджету нужен прямой порядок
    const rows = (await dbSelect(
      'chat_messages',
      'select=id,text,ts&sid=eq.' + e(sid) + '&order=id.desc&limit=' + limit
    )) || [];
    const list = rows.slice().reverse();
    const lastId = list.length ? Number(list[list.length - 1].id) || 0 : 0;

    // ищем самый свежий маркер закрытия — всё до него в историю не попадает
    let start = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] && list[i].text === CLOSED_SENTINEL) { start = i + 1; break; }
    }
    const closed = start > 0 && start >= list.length;

    return sendJson(res, 200, {
      ok: true,
      messages: list.slice(start).map(decodeMessage).filter(Boolean),
      lastId: lastId,
      closed: closed,
      truncated: list.length >= limit
    });
  } catch (err) {
    return sendJson(res, 502, { ok: false, error: String(err.message || err) });
  }
}
