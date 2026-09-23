// GET /api/chat/config — публичные настройки виджета.
// Отдаёт только Site Key Cloudflare Turnstile (публичный по дизайну).
// Secret Key наружу не попадает: он нужен только серверу (send.js → siteverify).
import { sendJson } from '../../lib/tg.js';

export default async function handler(req, res) {
  return sendJson(res, 200, { ok: true, sitekey: process.env.TURNSTILE_SITE_KEY || '' });
}