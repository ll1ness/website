# Чат на сайте → Telegram (супергруппа-форум, темы)

Кнопка чата на главной странице теперь реально отправляет сообщение в Telegram:
каждому новому гостю (сессия в `localStorage`) бот создаёт тему **«Гость #N»**
в супергруппе-форуме и пишет сообщение туда. Ответы из этой темы возвращаются
гостю прямо в виджет на сайте (поллинг раз в 3 секунды).

## Архитектура

```
Виджет ──POST──▶ /api/chat/send   (createForumTopic «Гость #N» + sendMessage)
   ▲                │
   │          Upstash KV: session→thread, thread→session, messages:{sid}
   │                │
   ◀── /api/chat/poll  ◀── /api/chat/webhook ◀── Telegram (webhook бота)
```

- `api/chat/send.js` — принимает `{sid, text}`, создаёт тему и шлёт сообщение.
- `api/chat/poll.js` — `GET ?sid=&lastId=` — отдаёт новые ответы из Telegram.
- `api/chat/webhook.js` — приём апдейтов от Telegram, кладёт ответы гостю.
- `lib/tg.js` — общие хелперы (Telegram Bot API + Upstash KV через `fetch`,
  без npm-зависимостей).
- `scripts/set-webhook.js` — регистрация вебхука (запускается один раз локально).

## Что настроить (один раз)

### 1. Бот и группа

1. У @BotFather создаёшь бота → получаешь токен.
2. Переводишь супергруппу в режим форума (Tемы включены — уже сделано).
3. Добавляешь бота в группу **админом** (включи право управления темами).

### 2. ID группы

После добавления бота в группу выполни один раз (токен из шага 1):

```powershell
$env:TELEGRAM_BOT_TOKEN="<токен>"
Invoke-RestMethod "https://api.telegram.org/bot$env:TELEGRAM_BOT_TOKEN/getUpdates" | ConvertTo-Json -Depth 5
```

Напиши в группу любое сообщение — в выводе появится `chat.id`
(число вида `-100...`). Это `TELEGRAM_CHAT_ID`.

### 3. Vercel

- Создай **KV store** (Upstash, бесплатный тир) и подключи к проекту.
- В Env Variables проекта добавь:

| Переменная | Значение |
|---|---|
| `TELEGRAM_BOT_TOKEN` | токен бота |
| `TELEGRAM_CHAT_ID` | `-100...` из шага 2 |
| `TELEGRAM_WEBHOOK_SECRET` | любая случайная строка (например, `openssl rand -hex 32`) |
| `KV_REST_API_URL` | из настроек KV (Upstash) |
| `KV_REST_API_TOKEN` | из настроек KV (Upstash) |

Ничего из этого в репозиторий не кладём — только в Vercel.

### 4. Вебхук

После деплоя один раз выполни (секрет должен совпадать с Vercel):

```powershell
$env:TELEGRAM_BOT_TOKEN="<токен>"
$env:TELEGRAM_WEBHOOK_SECRET="<тот же секрет>"
node scripts/set-webhook.js https://ТВОЙ-САЙТ.vercel.app/api/chat/webhook
```

## Контракт API

- `POST /api/chat/send` `{sid, text}` → `{ok: true}` (400/429/502 при ошибках).
  `sid` — UUID-подобный (8–64 символа), `text` — 1–500 символов.
- `GET /api/chat/poll?sid=...&lastId=...` → `{ok: true, messages: [{id, text, ts}]}`.
- `POST /api/chat/webhook` — только от Telegram, проверяет
  `X-Telegram-Bot-Api-Secret-Token`.

## Безопасность

- Токен бота и ключи KV — только на сервере (Vercel env).
- Вебхук проверяет секрет, сообщения от ботов игнорируются.
- Троттлинг: не чаще 1 сообщения в 2 секунды на сессию.
- В теме группа видит сообщение с префиксом имени: `Гость #7: текст`.

## Локальный запуск

Vercel-функции локально не работают (нужны env-переменные и деплой).
Локальный `npm run dev` отдаёт сайт, но `/api/chat/*` вернёт 404 — это
нормально: отправка покажет ошибку в чате.