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

Проєкт підключений до GitHub і Vercel. Коміт у гілку `main` автоматично запускає production-деплой; інші гілки можуть створювати Preview-деплої.

Змінна `DATABASE_URL` налаштована в Vercel і підключає застосунок до Neon. Neon зберігає дані PostgreSQL, а не код; якщо змінюється схема, застосуйте відповідний SQL/міграцію до потрібної бази окремо.

Після деплою перевірте `/api/health` (має повернути `{"ok":true,"db":"up"}`).

## API

| Метод | Шлях | Опис |
|---|---|---|
| POST | `/api/subscribe` | `{email, name?, lang}` -> 201 / 400 / 409 (дубль) / 500 |
| GET | `/api/health` | перевірка зʼєднання з Neon |
