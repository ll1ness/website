// POST /api/chat/send  { sid, text, captcha }
// Первое сообщение сессии создаёт в супергруппе-форуме тему «Гость #N».
// Если прошлую тему поддержка закрыла командой /end (привязка thread>sid удалена) —
// следующий вопрос уходит в НОВУЮ тему. Работает и без колонки closed_at.
// Ошибки возвращаются с кодом для человеческого отображения в виджете:
//   bad (400), captcha (403), rate_limit (429), no_chat (500),
//   busy/timeout/thread/server (502).
import { telegram, dbSelect, dbInsert, dbDelete, dbUpsert, dbRpc, readBody, sendJson, SID_RE } from '../../lib/tg.js';

const RATE_MS = 2000; // не чаще одного сообщения в 2 секунды на сессию
const e = encodeURIComponent;
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Капча Cloudflare Turnstile. Включена, когда задан TURNSTILE_SECRET_KEY;
// без него (до настройки) пропускаем, чтобы не ломать чат.
async function verifyTurnstile(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true;
  if (!token) return false;
  const form = new URLSearchParams();
  form.set('secret', secretKey);
  form.set('response', token);
  const res = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: form });
  const data = await res.json().catch(() => null);
  return !!(data && data.success === true);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method', code: 'bad' });

  let body;
  try { body = JSON.parse((await readBody(req)) || '{}'); }
  catch (err) { return sendJson(res, 400, { ok: false, error: 'bad json', code: 'bad' }); }

  const sid = String(body.sid || '').trim();
  const text = String(body.text || '').trim();
  if (!SID_RE.test(sid)) return sendJson(res, 400, { ok: false, error: 'bad sid', code: 'bad' });
  if (!text || text.length > 500) return sendJson(res, 400, { ok: false, error: 'bad text', code: 'bad' });

  // капча проверяется до троттлинга: неудачная попытка не съедает «слот» отправки
  let captchaOk = false;
  try { captchaOk = await verifyTurnstile(String(body.captcha || '')); } catch (errC) { captchaOk = false; }
  if (!captchaOk) return sendJson(res, 403, { ok: false, error: 'captcha', code: 'captcha' });

  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return sendJson(res, 500, { ok: false, error: 'no chat', code: 'no_chat' });

  try {
    // throttle: не чаще одного сообщения в 2 секунды на сессию
    const rl = await dbSelect('chat_rate', 'select=ts&sid=eq.' + e(sid));
    if (rl && rl.length && Date.now() - Number(rl[0].ts) < RATE_MS) {
      return sendJson(res, 429, { ok: false, error: 'slow down', code: 'rate_limit' });
    }
    await dbUpsert('chat_rate', { sid: sid, ts: Date.now() }, 'sid');

    const sess = await dbSelect('chat_sessions', 'select=thread_id,guest_name&sid=eq.' + e(sid));
    let thread = sess && sess.length ? sess[0].thread_id : null;
    let name = sess && sess.length ? sess[0].guest_name : null;

    // тема считается закрытой, если её привязка thread>sid удалена командой /end
    let mapped = true;
    if (thread) {
      try {
        const m = await dbSelect('chat_threads', 'select=sid&thread_id=eq.' + e(thread));
        mapped = !!(m && m.length);
      } catch (err2) { mapped = true; }
    }

    // новая тема: при первом сообщении или если прошлая тема закрыта
    if (!thread || !mapped) {
      if (thread && !mapped) {
        try { await dbDelete('chat_threads', 'thread_id=eq.' + e(thread)); } catch (err3) {}
      }
      const n = await dbRpc('next_val', { cname: 'guestCount' });
      name = 'Гость #' + n;
      const created = await telegram('createForumTopic', { chat_id: chatId, name: name });
      thread = String(created.message_thread_id);
      await Promise.all([
        dbUpsert('chat_sessions', { sid: sid, thread_id: thread, guest_name: name }, 'sid'),
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
    const msg = String(err.message || err);
    let code = 'server';
    if (/Telegram .*?(Too Many Requests|retry after)/i.test(msg)) code = 'busy';
    else if (/timed?\s?out|ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN/i.test(msg)) code = 'timeout';
    else if (/message thread not found|thread not found|chat not found/i.test(msg)) code = 'thread';
    return sendJson(res, 502, { ok: false, error: msg, code: code });
  }
}