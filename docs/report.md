# Матеріали до розділу 3

## 3.1. Архітектура та Payload CMS

Застосунок побудований як один пакет Next.js із вбудованою Payload CMS 3. Монорепозиторій не реалізований: за прикріпленим технічним завданням npm workspaces не використовуються. Серверний конфіг описує Users, Pages, Media, Leads та глобальні SiteSettings. Pages містить дискриміновані блоки hero/features/steps/stats/faq/cta/courses, SEO і slug. Postgres adapter працює з Neon; автоматичний schema push вимкнено. Є початкова міграція. Локальне файлове сховище медіа не підходить для постійних uploads на Vercel — потрібен окремий storage adapter.

Кастомні ендпоінти: landing для публічного контенту, subscribe для заявок і health для перевірки БД. Колекції з обліковими даними й заявками закриті від анонімного REST-доступу. Поточний сайт можна залишити у legacy-режимі до завершення перевірок CMS.

## 3.2. Клієнтська частина та стани UI

У CMS-режимі useLanding асинхронно завантажує вибрану мовну версію. Під час очікування показується loading; при помилці — повідомлення й кнопка повторного запиту; ready передає блоки в BlockRenderer. Застарілі запити скасовуються при зміні мови. Компоненти використовують попередні стилі й структуру адаптивних секцій. Форма обробляє sending/ok/duplicate/invalid/error та зберігає honeypot.

## 3.3. Типізація TypeScript

ApiResult<T> є union успіху та помилки, LoadState<T> — union станів. PageBlock об'єднує різні блоки через blockType. LandingPage використовує intersection PageMeta & {blocks;site}. API приймається як unknown і перевіряється guards; типи Payload генеруються зі схеми. parseLead з попереднього застосунку збережено без змін. Лістинги для звіту: src/lib/types.ts, src/lib/landing-api.ts, src/components/Landing.tsx.

## 3.4. Деплой та контрольний приклад

Порядок деплою й змінні описані в README. Для демонстрації CMS потрібно: застосувати міграції на тестовій базі, запустити seed, увійти в /admin, змінити heading у home, зберегти й показати новий heading на сайті. Контрольний приклад виконано на окремій Neon БД skill_nova_cms: вхід через API автентифікації, зміна hero.heading у браузерному редакторі, перевірка нового заголовка на сайті та відновлення початкового значення. Скріншоти: screenshots/cms-editor.png та screenshots/cms-visitor.png.

Скріншоти відвідувача та валідації генеруються UI-тестами в docs/screenshots. visitor-en.png і validation-error.png підтверджують legacy UI. cms-editor.png та cms-visitor.png отримані на реальній CMS. cms-load-error.png демонструє контрольовану імітацію збою API у браузері; сама БД при цьому не відключалася. Повторний запит після зняття імітації відновив живий контент.

## Журнал перевірок

- generate:types і generate:importmap: виконано успішно.
- typecheck: виконано успішно після додавання декларації import map.
- migrate:create: початкова міграція згенерована без підключення до БД з тимчасовим випадковим секретом.
- NEON_WEBSOCKETS=true npm run migrate: успішно на тестовій БД.
- seed: успішно; повторний запуск зберіг існуючий контент.
- Автентифікація адміністратора 200; зміна hero через браузер підтверджена на сторінці відвідувача.
- API: health 200; home uk/en 200; nope 404/not_found; subscribe 201, повторний 409, некоректний email 400, порожній об’єкт 400. Тест створив одну навчальну заявку з адресою example.com у тестовій БД.
- UI legacy: 2 тести пройшли. Стан помилки CMS та повторний запит до живого API перевірені браузером.
- Звичайний TCP 5432 недоступний із Codex; офіційний Neon Pool через TLS WebSocket працює.
- npm run build: успішно після першої інтеграції; остаточний повторний запуск див. журнал завершення.
- Публікація на Vercel не виконувалась. Поточний production не змінювався.

## Версії

| Пакет | package.json | Встановлено за lockfile |
|---|---|---|
| next | ^15.5.0 | 15.5.28 |
| react / react-dom | ^19.1.0 | 19.3.1 |
| payload | 3.61.0 | 3.61.0 |
| @payloadcms/next | 3.61.0 | 3.61.0 |
| @payloadcms/db-postgres | 3.61.0 | 3.61.0 |
| @payloadcms/richtext-lexical | 3.61.0 | 3.61.0 |
| @payloadcms/translations | 3.61.0 | 3.61.0 |
| typescript | ^5.9.0 | 5.9.3 |

## Обмеження

Production-деплой не виконувався. Монорепозиторій не створений за явною вимогою прикріпленого завдання. Постійне зберігання медіа на Vercel потребує окремого storage adapter; uploads на Vercel заблоковані, щоб не втрачати файли. Email adapter для відновлення паролів не налаштований. Існуючі production-заявки не перенесені; стара таблиця зберігається для legacy-режиму.

## Змінені та додані файли

```text
 M .env.example
 M .gitignore
 M README.md
 M next.config.mjs
 M package-lock.json
 M package.json
 M src/app/api/health/route.ts
 M src/app/api/subscribe/route.ts
 D src/app/layout.tsx
 D src/app/page.tsx
 M src/components/Header.tsx
 M src/components/Hero.tsx
 M src/components/LeadForm.tsx
 M src/components/Sections.tsx
 M tsconfig.json
?? docs/report.md
?? docs/screenshots/cms-editor.png
?? docs/screenshots/cms-load-error.png
?? docs/screenshots/cms-visitor.png
?? docs/screenshots/validation-error.png
?? docs/screenshots/visitor-en.png
?? payload.config.ts
?? playwright.config.ts
?? scripts/check-editor.mjs
?? scripts/seed.ts
?? src/app/(payload)/admin/[[...segments]]/page.tsx
?? src/app/(payload)/admin/importMap.d.ts
?? src/app/(payload)/admin/importMap.js
?? src/app/(payload)/api/[...slug]/route.ts
?? src/app/(payload)/layout.tsx
?? src/app/(site)/layout.tsx
?? src/app/(site)/page.tsx
?? src/app/api/landing/[slug]/route.ts
?? src/cms/client.ts
?? src/cms/landing.ts
?? src/cms/neon-driver.ts
?? src/cms/schema.ts
?? src/components/Landing.tsx
?? src/lib/landing-api.ts
?? src/lib/types.ts
?? src/migrations/20261027_144321_initial.json
?? src/migrations/20261027_144321_initial.ts
?? src/migrations/index.ts
?? src/payload-types.ts
?? tests/landing.spec.ts
```

### Перевірка редактора

`node scripts/check-editor.mjs` завершився успішно: збереження hero через UI, відображення відвідувачу, повернення початкового тексту, контрольована помилка API та відновлення через «Повторити». Спочатку smoke-скрипт мав гонку очікування збереження; виправлено очікування фактичної успішної PATCH-відповіді. Це була проблема перевірочного скрипту, не підтверджена помилка збереження CMS.

### Остаточна перевірка

- `npm ci --cache /tmp/learnova-npm-cache --no-audit --no-fund`: 399 пакетів, успішно.
- `npm run generate:types`, `npm run generate:importmap`: успішно.
- `npm run build`, `npm run typecheck`: успішно після всіх змін конфігурації та драйвера.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e`: 2/2 пройшли на остаточній production-збірці у legacy-режимі.
- Секрети не включені до Git чи цього звіту. Конфігурація install_script/start_skill збережена в чернетці хмарного середовища; публікацію середовища та деплой сайту не виконано.
