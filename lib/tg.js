// Общие хелперы для интеграции чата с Telegram через супергруппу-форум.
// Telegram Bot API + Supabase (PostgREST) через fetch — без npm-зависимостей.
// Секреты (токен бота, service_role) — только из env (Vercel). В репо не попадают.

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

const e = encodeURIComponent;

async function supabaseReq(method, path, body, extraHeaders) {
  const base = need('SUPABASE_URL').replace(/\/+$/, '');
  const key = need('SUPABASE_SERVICE_ROLE_KEY');
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    ...(extraHeaders || {})
  };
  const res = await fetch(base + '/rest/v1/' + path, {
    method: method,
    headers: headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await res.text();
  let data = null;
  if (text) { try { data = JSON.parse(text); } catch (err) { data = null; } }
  if (!res.ok) {
    throw new Error('Supabase ' + method + ' /' + path.split('?')[0] + ' (' + res.status + '): ' + text.slice(0, 200));
  }
  return data;
}

// SELECT: /rest/v1/<table>?select=..&sid=eq.x&id=gt.y&order=id.asc&limit=20
export function dbSelect(table, qs) { return supabaseReq('GET', table + '?' + qs); }
export function dbInsert(table, row) { return supabaseReq('POST', table, row); }
export function dbUpsert(table, row, conflictCol) {
  return supabaseReq('POST', table + '?on_conflict=' + e(conflictCol), row, {
    Prefer: 'resolution=merge-duplicates'
  });
}
export function dbRpc(fn, args) { return supabaseReq('POST', 'rpc/' + e(fn), args || {}); }
export function dbDelete(table, qs) {
  return supabaseReq('DELETE', table + '?' + qs, undefined, { Prefer: 'return=minimal' });
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