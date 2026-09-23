// Регистрация вебхука бота на Vercel-функцию.
//
// Запуск один раз после деплоя (секрет должен совпадать с TELEGRAM_WEBHOOK_SECRET на Vercel):
//   set TELEGRAM_BOT_TOKEN=... & set TELEGRAM_WEBHOOK_SECRET=... & node scripts/set-webhook.js https://ТВОЙ-САЙТ.vercel.app/api/chat/webhook
// (или положить токены в .env рядом и запустить тем же способом)
import { telegram } from '../lib/tg.js';

const url = process.argv[2];
if (!url) { console.error('Usage: node scripts/set-webhook.js <URL>'); process.exit(1); }
if (!process.env.TELEGRAM_WEBHOOK_SECRET) {
  console.error('TELEGRAM_WEBHOOK_SECRET is not set (must be the same as on Vercel)');
  process.exit(1);
}

const result = await telegram('setWebhook', {
  url: url,
  secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
  drop_pending_updates: true,
  allowed_updates: ['message']
});
console.log('Webhook set:', JSON.stringify(result));