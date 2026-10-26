# Skill Nova — лендинг

Next.js 15 + TypeScript. Заявки з форми зберігаються в Neon Postgres, розгортання на Vercel.

## Локальний запуск

```bash
npm install
cp .env.example .env.local      # вставте DATABASE_URL з Neon
npm run db:init                 # створює таблицю leads (необовʼязково, API створить її сам)
npm run dev                     # http://localhost:3000
```

## Деплой

1. Neon: створіть проєкт, у Connect скопіюйте pooled connection string.
2. GitHub: запуште репозиторій.
3. Vercel: Add New -> Project -> оберіть репозиторій, Framework = Next.js.
4. Environment Variables: `DATABASE_URL` = рядок з Neon.
5. Deploy. Перевірте `/api/health` (має повернути `{"ok":true,"db":"up"}`).

## API

| Метод | Шлях | Опис |
|---|---|---|
| POST | `/api/subscribe` | `{email, name?, lang}` -> 201 / 400 / 409 (дубль) / 500 |
| GET | `/api/health` | перевірка зʼєднання з Neon |
