// Общие хелперы для интеграции чата с Telegram через супергруппу-форум.
// Telegram Bot API + Upstash KV (REST, fetch). Токены/URL — только из env
// (на Vercel — Env Variables проекта). В репозиторий секреты НЕ попадают.

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error('Missing env: ' + name);
  return v;
}

// Вызов метода Bot API. Все параметры — в query-строке POST-запроса.
export async function telegram(method, params) {
  const token = need('TELEGRAM_BOT_TOKEN');
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null) continue;
    qs.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  const q = qs.toString();
  const res = await fetch(
    'https://api.telegram.org/bot' + token + '/' + method + (q ? '?' + q : ''),
    { method: 'POST' }
  );
  const data = await res.json().catch(() => null);
  if (!data || !data.ok) {
    const desc = data && data.description ? ' (' + data.description + ')' : '';
    throw new Error('Telegram ' + method + ' failed' + desc);
  }
  return data.result;
}

async function kvRaw(command) {
  const base = need('KV_REST_API_URL').replace(/\/+$/, '');
  const token = need('KV_REST_API_TOKEN');
  const res = await fetch(base + command, { headers: { Authorization: 'Bearer ' + token } });
  const data = await res.json().catch(() => null);
  if (!res.ok || (data && data.error)) {
    throw new Error('KV error (' + res.status + '): ' + ((data && data.error) || 'bad response'));
  }
  return data.result;
}

const enc = encodeURIComponent;
export function kvGet(key) { return kvRaw('/get/' + enc(key)); }
export function kvSet(key, value) { return kvRaw('/set/' + enc(key) + '/' + enc(String(value))); }
export function kvIncr(key) {
  return kvRaw('/incr/' + enc(key)).then(Number);
}

// Чтение JSON-тела запроса (с лимитом размера).
export function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 1e6) { reject(new Error('body too large')); req.destroy(); }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

// Валидация идентификатора сессии гостя (UUID-подобный, без спецсимволов).
export const SID_RE = /^[A-Za-z0-9_-]{8,64}$/;