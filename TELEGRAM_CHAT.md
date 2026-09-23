# Чат на сайте → Telegram (супергруппа-форум, темы)

Кнопка чата на главной странице реально отправляет сообщение в Telegram:
каждому новому гостю (сессия в `localStorage`) бот создаёт тему **«Гость #N»**
в супергруппе-форуме и пишет сообщение туда. Ответы из этой темы возвращаются
гостю прямо в виджет на сайте (поллинг раз в 3 секунды).

## Архитектура

```
Виджет ──POST──▶ /api/chat/send   (createForumTopic «Гость #N» + sendMessage)
   ▲                │
   │           Supabase (PostgREST): chat_sessions / chat_threads / chat_messages
   │                │
   ◀── /api/chat/poll  ◀── /api/chat/webhook ◀── Telegram (webhook бота)
```

- `api/chat/send.js` — принимает `{sid, text}`, создаёт тему и шлёт сообщение.
- `api/chat/poll.js` — `GET ?sid=&lastId=` — отдаёт новые ответы из Telegram.
- `api/chat/webhook.js` — приём апдейтов от Telegram, кладёт ответы гостю.
- `lib/tg.js` — Telegram Bot API + Supabase через `fetch` (без npm-зависимостей).
- `scripts/set-webhook.js` — регистрация вебхука (один раз локально).

## Настройка

### 1. Бот и группа

1. У @BotFather создаёшь бота (`/newbot`) → получаешь токен.
2. Супергруппа в режиме форума («Темы» включены — уже сделано).
3. Бота добавляешь в группу **админом** (право управления темами).
4. **У BotFather: `/setprivacy` → Disable.** Иначе бот в группе видит только
   упоминания и ответы на свои сообщения — письмо в тему без reply не долетит
   до чата на сайте.

### 2. ID группы

После добавления бота напиши в группу любое сообщение, затем:

```powershell
$env:TELEGRAM_BOT_TOKEN = "<токен>"
Invoke-RestMethod "https://api.telegram.org/bot$env:TELEGRAM_BOT_TOKEN/getUpdates" | ConvertTo-Json -Depth 5
```

В выводе `chat.id` (число вида `-100...`) — это `TELEGRAM_CHAT_ID`.

### 3. Supabase (хранилище)

Создай проект Supabase (если нет) → **SQL Editor** → вставь и выполни:

```sql
create table if not exists chat_rate (
  sid text primary key,
  ts bigint not null
);

create table if not exists chat_sessions (
  sid text primary key,
  thread_id text,
  guest_name text,
  created_at timestamptz default now()
);

create table if not exists chat_threads (
  thread_id text primary key,
  sid text not null
);

create table if not exists chat_messages (
  id bigint generated always as identity primary key,
  sid text not null,
  text text not null,
  ts bigint not null
);
create index if not exists chat_messages_sid_idx on chat_messages (sid, id);

create table if not exists chat_counters (
  name text primary key,
  value bigint not null default 0
);
insert into chat_counters (name, value) values ('guestCount', 0) on conflict (name) do nothing;

create or replace function next_val(cname text)
returns bigint
language plpgsql
as $$
declare v bigint;
begin
  update chat_counters set value = value + 1 where name = cname returning value into v;
  return v;
end;
$$;
```

**Миграции — опциональные.** Базовое закрытие тем работает и без них
(событие «закрыто» передаётся служебным текстом `\u0001closed\u0001`, а новая
тема создаётся по разрыву привязки).

1. Колонка `closed_at` — только для аналитики, на работу чата не влияет:

```sql
alter table chat_sessions add column if not exists closed_at bigint;
```

2. Автоудаление сообщений закрытых диалогов через 30 дней. Без этой функции
старые сообщения скрываются в виджете сразу, но остаются в БД до ручной очистки.
Функция вызывается лениво из `api/chat/poll.js` (раз в сутки, без cron):

```sql
create or replace function cleanup_closed_messages(days int default 30)
returns bigint
language plpgsql
as $$
declare
  cutoff bigint;
  deleted bigint := 0;
  rc bigint;
  r record;
begin
  cutoff := (extract(epoch from now())::bigint - days * 86400) * 1000;
  for r in
    select sid, max(id) as mid
    from chat_messages
    where text = E'\x01closed\x01'
    group by sid
  loop
    delete from chat_messages
    where sid = r.sid and id <= r.mid and ts < cutoff;
    get diagnostics rc = row_count;
    deleted := deleted + rc;
  end loop;
  return deleted;
end;
$$;
```

### 4. Vercel: переменные окружения

В Project → Settings → Environment Variables добавь:

| Переменная | Значение |
|---|---|
| `TELEGRAM_BOT_TOKEN` | токен бота (шаг 1) |
| `TELEGRAM_CHAT_ID` | `-100...` (шаг 2) |
| `TELEGRAM_WEBHOOK_SECRET` | случайная строка (`openssl rand -hex 32`) |
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` (secret) |

**Внимание:** `service_role` даёт полный доступ к БД — только на сервере (Vercel env),
никогда во фронтенд. `SUPABASE_URL` в Supabase — как `https://xxxx.supabase.co`.

После добавления переменных — **Redeploy** (Deployments → ⋯ → Redeploy),
иначе функции их не увидят.

### 5. Вебхук (после деплоя свежего кода!)

```powershell
$env:TELEGRAM_BOT_TOKEN = "<токен>"
$env:TELEGRAM_WEBHOOK_SECRET = "<тот же секрет>"
node scripts/set-webhook.js https://ll1ness.vercel.app/api/chat/webhook
```

Ожидаемый вывод: `Webhook set: {"ok":true, ...}`.

### 6. Тест

Открой `https://ll1ness.vercel.app` → чат → перед первым сообщением нужно
принять политику конфиденциальности (кнопки «Принять»/«Отклонить» в виджете,
текст политики открывается модалом на сайте) → напиши → в группе появится тема
**«Гость #1»** → просто напиши в тему (без reply) → сообщение прилетит в виджет.
Напиши в теме `/end` (от имени админа) → тема закроется, у гостя из чата
удалятся все сообщения — останется только уведомление о закрытии; новое
сообщение гостя создаст новую тему. Из БД сообщения закрытого диалога
автоматически удаляются через 30 дней (миграция 2).

## Контракт API

- `POST /api/chat/send` `{sid, text}` → `{ok: true}` (400/429/502 при ошибках).
  `sid` — UUID-подобный (8–64 символа), `text` — 1–500 символов.
  Если тему поддержка закрыла — следующий запрос создаёт **новую** тему «Гость #N».
- `GET /api/chat/poll?sid=...&lastId=...` → `{ok: true, messages: [{id, text, ts}]}`.
  Сообщение со служебным текстом `\u0001closed\u0001` — поддержка закрыла тему:
  виджет очищает чат и показывает только уведомление о закрытии.
- `POST /api/chat/webhook` — только от Telegram, проверяет
  `X-Telegram-Bot-Api-Secret-Token`. Понимает обычные сообщения в темах
  и команду `/end`: админ пишет её в теме гостя → тема закрывается
  (жёстко через `closeForumTopic`), гость получает уведомление, его старые
  сообщения в чате удаляются. Для не-админов команда игнорируется.

## Безопасность

- Токен бота и `service_role` — только на сервере (Vercel env).
- Вебхук проверяет секрет, сообщения от ботов игнорируются.
- Троттлинг: не чаще 1 сообщения в 2 секунды на сессию.
- Тема называется «Гость #N», сообщения внутри — без префикса.

## Локальный запуск

Vercel-функции локально не работают (нужны env-переменные и деплой).
Локальный `npm run dev` отдаёт сайт, но `/api/chat/*` вернёт 404 — это
нормально: отправка покажет ошибку в чате.