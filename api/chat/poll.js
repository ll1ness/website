// GET /api/chat/poll?sid=...&lastId=...
// Возвращает ответы из Telegram для сессии (новые сообщения, id > lastId).
import { dbSelect, dbUpsert, dbRpc, sendJson, SID_RE } from '../../lib/tg.js';

// Ленивая уборка: раз в сутки удаляем сообщения закрытых диалогов старше 30 дней.
// RPC `cleanup_closed_messages` опционален — если функция не создана, пропускаем.
async function maybeCleanup() {
  try {
    const row = await dbSelect('chat_counters', 'select=value&name=eq.' + encodeURIComponent('cleanup'));
    const last = row && row.length ? Number(row[0].value) || 0 : 0;
    if (Date.now() - last <= 24 * 3600 * 1000) return;
    // сначала метим, чтобы параллельные вызовы не дублировали работу
    await dbUpsert('chat_counters', { name: 'cleanup', value: Date.now() }, 'name');
    try { await dbRpc('cleanup_closed_messages', { days: 30 }); } catch (err2) {}
  } catch (err) {}
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://local');
  const sid = String(url.searchParams.get('sid') || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid' });
  const lastId = Math.max(0, Number(url.searchParams.get('lastId') || 0) || 0);

  maybeCleanup(); // fire-and-forget

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