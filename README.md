# Skill Nova

Лендинг Next.js 15 / React 19 / TypeScript із Payload CMS 3 та Neon Postgres. Один пакет, без npm workspaces: адмінка, API та сайт живуть у тому самому застосунку. Це не монорепозиторій.

## Безпечний запуск

Потрібен Node.js 22+ (перевірено 24.19.0).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Не підставляйте демонстраційні реквізити з `.env.example`. Секрети зберігайте лише у змінних середовища або ігнорованому `.env.local`.

За замовчуванням `PAYLOAD_ENABLED=false`: залишається статичний лендинг UA/EN, тема, наявний API форми й попередня таблиця `leads`. Це дозволяє перевірити зміни перед перемиканням робочого сайту на CMS. Не запускайте CMS-міграції на чинній БД. Жоден build не запускає міграції чи seed автоматично.

## Підготовка CMS

1. У Neon створіть окрему гілку `cms-dev` і порожню базу `skill_nova_cms`.
2. Задайте `DATABASE_URL` для цієї бази (`sslmode=require`) і криптографічно випадковий `PAYLOAD_SECRET` щонайменше 32 символи.
3. Для одноразового seed задайте `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.
4. Виконайте:

```bash
npm run generate:types
npm run generate:importmap
npm run migrate
npm run seed
```

5. Установіть `PAYLOAD_ENABLED=true` і перезапустіть застосунок. Відкрийте `/admin`, увійдіть даними seed, відкрийте Pages → home, змініть hero.heading, збережіть і оновіть `/`.

CLI Payload завантажує `.env`/`.env.local`; для seed використовуйте інжектовані змінні або `node --env-file=.env.local --import tsx scripts/seed.ts`. Seed створює адміністратора, локалізовану home і SiteSettings; повторний запуск не перезаписує існуючу home чи пароль. Після seed приберіть SEED_* з постійних налаштувань.

`push:false` діє і локально, і у production: зміни схеми застосовуються лише міграціями. Створення наступної міграції: `npm run migrate:create -- назва`. Початкова міграція лежить у `src/migrations`. Для її генерації не потрібна жива БД, але Payload вимагає секрет. Генерація не означає, що міграцію застосовано.

## Архітектура

- `payload.config.ts`, `src/cms/schema.ts`: Users (auth), Pages (slug, SEO, блоки), Media (зображення й alt), Leads (окрема таблиця `cms_leads`), глобальні SiteSettings. Поля контенту локалізовані uk/en; редактор Lexical, мови адмінки uk/en.
- Блоки: hero, features, steps, stats, faq, cta, courses. Додатковий courses зберігає поточний каталог. Seed переносить обидві мови з `src/lib/content.ts`.
- `src/app/(payload)`: окрема коренева layout адмінки та REST catch-all `/api/[...slug]`. Статичні custom routes мають пріоритет над catch-all.
- `src/app/(site)`: попередній дизайн; CMS-режим завантажує сторінку через API, обробляє loading/error/ready, дозволяє повторити запит. UA/EN, localStorage, тема, IntersectionObserver, honeypot збережені.
- `src/lib/types.ts`: Type Aliases, Union Types, Intersection Types, дискримінант blockType, type guards. `landing-api.ts` перевіряє unknown-відповіді перед використанням; неправильний формат дає server/502, збій мережі — network.
- Згенеровані типи Payload: `src/payload-types.ts`; перегенеровуйте після змін схеми.
- Доступ до Users, Leads, Pages та SiteSettings через REST потребує автентифікації. Публічний landing API повертає лише контент сторінки; subscribe сам валідує вхід і записує через local API. Медіа доступні для читання публічно.

## API

| Метод | Маршрут | Результат |
|---|---|---|
| GET | `/api/landing/home?lang=uk` | `{ok:true,data:LandingPage}` у CMS-режимі |
| GET | `/api/landing/nope` | 404, `error.code=not_found` при доступній БД |
| POST | `/api/subscribe` | `{email,name?,lang}`; 201 / 400 / 409 / 500 |
| GET | `/api/health` | 200 `{ok:true,db:'up'}` або 503 `{ok:false,db:'down'}` |

Форма зберігає існуючий контракт `{ok,code}` для сумісності. Landing API використовує `ApiResult<T>`. У CMS-режимі унікальний індекс email запобігає дублям. Валідні запити створюють реальні записи: тестуйте лише на тестовій БД. Health у CMS-режимі перевіряє доступність колекції pages; без DATABASE_URL/PAYLOAD_SECRET CMS не ініціалізується.

## Медіа та Vercel

Локально файли зберігаються в `media/` (ігнорується Git). Файлова система Vercel тимчасова, тому завантаження Media там навмисно заборонено, доки не підключене постійне об'єктне сховище. Не використовується Vercel Blob. Вбудовані зображення `/public/img` працюють без сховища; для публікації CMS із новими медіа потрібен сумісний storage adapter або сервер із постійним диском. Це відкрите обмеження, а не реалізована підтримка хмарних uploads.

## Деплой

Спочатку окрема Git-гілка та Vercel Preview з тестовою Neon БД. Не push у main до перевірки: README попереднього проєкту описував автоматичний production-деплой з main.

Порядок: резервна копія БД → встановлення залежностей → `npm run migrate` як окрема контрольована команда на цільовій CMS БД → одноразовий seed → `PAYLOAD_ENABLED=true`, DATABASE_URL, PAYLOAD_SECRET → `npm run build` → деплой → перевірка адмінки, home, UA/EN, теми, API. Не додавайте seed або міграції до кожної serverless-функції. Не використовуйте CMS DATABASE_URL для rollback у legacy-режим: збережіть попередню конфігурацію та БД.

Вимоги CMS до БД відрізняються від попередньої ручної таблиці leads. Існуючі заявки автоматично не переносяться; їх перенесення потребує окремої міграції даних. Не видаляйте стару БД.

## Перевірки й звіт

```bash
npm ci
npm run generate:types
npm run generate:importmap
npm run typecheck
npm run build
PLAYWRIGHT_BROWSERS_PATH=/tmp/learnova-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/tmp/learnova-browsers npm run test:e2e
```

Не запускайте build і dev паралельно: вони використовують `.next`. UI-тести запускають production-сервер на 3100 у legacy-режимі, не пишуть у БД. Контрольні сценарії та чесний стан перевірок: [docs/report.md](docs/report.md). Реальна перевірка CMS вимагає заповнених секретів, міграції і seed; скріншот редактора слід робити лише після справжнього входу в адмінку.

### Хмарне середовище Codex

Прямий TCP 5432 тут недоступний; перевірено `NEON_WEBSOCKETS=true`, що підключає офіційний Neon Pool через TLS WebSocket і HTTPS proxy, коли він заданий. Adapter залишається @payloadcms/db-postgres, схема та міграції ті самі. На Vercel можна залишити звичайний TCP або ввімкнути той самий транспорт. Приклад перевіреного браузера середовища: `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e`.
