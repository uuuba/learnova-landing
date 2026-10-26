import type { Lang } from './validate'

export type { Lang }
export const LANGS: Lang[] = ['uk', 'en']

const uk = {
  meta: {
    title: 'Skill Nova — персоналізовані освітні рекомендації',
    description:
      'Skill Nova підбирає курси за інтересами, компетенціями та навчальними потребами і пояснює, чому саме вони.',
  },
  nav: [
    { id: 'features', label: 'Можливості' },
    { id: 'how', label: 'Як це працює' },
    { id: 'courses', label: 'Курси' },
    { id: 'faq', label: 'Питання' },
  ],
  headerCta: 'Залишити email',
  themeToLight: 'Увімкнути світлу тему',
  themeToDark: 'Увімкнути темну тему',
  hero: {
    heading: 'Курси, підібрані під твої інтереси та прогалини в навичках',
    lead: 'Skill Nova порівнює твій профіль із каталогом, показує оцінку збігу від 0 до 100 і пояснює, з чого вона складається.',
    primary: 'Залишити email',
    secondary: 'Як це працює',
    cardTitle: 'Основи Python',
    cardMeta: 'Початковий рівень, відео та практика',
    cardMatch: 'збіг',
    cardWhy: 'Чому рекомендовано',
    cardWhyText: 'Збігається з двома твоїми інтересами і закриває прогалину в Python.',
  },
  parts: [
    { key: 'interests', label: 'Інтереси', max: 40, text: 'Яка частка тегів курсу збігається з твоїми інтересами.' },
    { key: 'gaps', label: 'Прогалини', max: 30, text: 'У скількох навичках курсу бажаний рівень вищий за поточний.' },
    { key: 'level', label: 'Рівень', max: 20, text: 'Наскільки рівень курсу підходить до твого рівня основної навички.' },
    { key: 'format', label: 'Формат', max: 10, text: 'Чи збігається курс із бажаним форматом навчання.' },
  ],
  stats: [
    { value: '8', label: 'курсів у демо-каталозі' },
    { value: '4', label: 'складники оцінки збігу' },
    { value: '2', label: 'мови інтерфейсу: UA та EN' },
  ],
  features: {
    title: 'Усе, щоб вибрати курс і дійти до кінця',
    items: [
      {
        icon: 'target',
        title: 'Рекомендації з поясненням',
        text: 'Блок «Чому рекомендовано» формується з тих самих складників, що й оцінка збігу, тому нічого не береться нізвідки.',
      },
      {
        icon: 'gap',
        title: 'Прогалини в навичках',
        text: 'Skill Nova порівнює поточний і бажаний рівень навички та підказує, що підтягнути в першу чергу.',
      },
      {
        icon: 'trend',
        title: 'План і прогрес',
        text: 'Відмічай пройдені модулі. Години навчання, серія днів і діаграма тижня рахуються з твоїх відміток.',
      },
      {
        icon: 'bot',
        title: '«ШІ-агент» без нейромережі',
        text: 'Відповідає лише з бази даних: визначає намір, робить запити до таблиць і шукає у базі знань.',
      },
    ],
  },
  how: {
    title: 'Від профілю до прогресу за чотири кроки',
    items: [
      { title: 'Заповни профіль', text: 'Обери інтереси, рівні навичок і бажаний формат навчання.' },
      { title: 'Дивись рекомендації', text: 'Отримай курси, відсортовані за оцінкою збігу, з поясненням.' },
      { title: 'Почни курс', text: 'Відкрий сторінку курсу, перевір передумови та натисни «Почати».' },
      { title: 'Відмічай модулі', text: 'План, навички та прогрес оновлюються після кожного модуля.' },
    ],
  },
  courses: {
    title: 'Каталог із різних напрямів',
    lead: 'У демо-каталозі вісім курсів. Ось декілька напрямів.',
    items: [
      { img: '/img/ai.jpg', title: 'Штучний інтелект', text: 'Основи машинного навчання та роботи з моделями.' },
      { img: '/img/data.jpg', title: 'Дані та аналітика', text: 'Збір, очищення й візуалізація даних.' },
      { img: '/img/db.jpg', title: 'Бази даних', text: 'Проєктування схем, SQL та транзакції.' },
      { img: '/img/eng.jpg', title: 'Програмування', text: 'Python і практики інженерії програмного забезпечення.' },
    ],
  },
  faq: {
    title: 'Часті питання',
    items: [
      {
        q: 'Це справжній штучний інтелект?',
        a: 'Ні. «ШІ-агент» у Skill Nova пародійний: він визначає намір запитання, збирає відповідь із бази даних через ORM, а якщо наміру немає, шукає у базі знань. Нейромережі там немає.',
      },
      {
        q: 'Як рахується оцінка збігу?',
        a: 'Максимум 100 балів: інтереси до 40, прогалини до 30, рівень до 20 і формат до 10. Завершені курси зі списку рекомендацій прибираються.',
      },
      {
        q: 'Що зберігається, коли я лишаю email?',
        a: 'Лише адреса, імʼя (якщо вказали) та мова сторінки. Дані лежать у Neon Postgres, а повторно ту саму адресу додати не вийде.',
      },
      {
        q: 'Чи є темна тема та англійська мова?',
        a: 'Так. Інтерфейс працює українською та англійською, а тема перемикається між світлою й темною.',
      },
      {
        q: 'На чому зроблено сам застосунок?',
        a: 'Skill Nova працює на Django 5.2 і MySQL 8. Цей лендинг написано на Next.js і TypeScript, дані зберігаються в Neon, а розгортання виконано на Vercel.',
      },
    ],
  },
  form: {
    title: 'Дізнайся першим про запуск',
    lead: 'Залиш email, і ми повідомимо, коли Skill Nova відкриється для всіх.',
    name: 'Імʼя (необовʼязково)',
    email: 'Email',
    submit: 'Залишити email',
    sending: 'Надсилаємо…',
    ok: 'Дякуємо! Email збережено.',
    duplicate: 'Цей email уже є в списку.',
    invalid: 'Перевір email: він має виглядати як name@example.com.',
    error: 'Не вдалося зберегти. Спробуй ще раз за хвилину.',
  },
  footer: 'Інтелектуальна система персоналізованих освітніх рекомендацій.',
}

const en: typeof uk = {
  meta: {
    title: 'Skill Nova — personalized learning recommendations',
    description:
      'Skill Nova matches courses to your interests, skills and learning needs, and explains why they fit.',
  },
  nav: [
    { id: 'features', label: 'Features' },
    { id: 'how', label: 'How it works' },
    { id: 'courses', label: 'Courses' },
    { id: 'faq', label: 'FAQ' },
  ],
  headerCta: 'Join the list',
  themeToLight: 'Switch to light theme',
  themeToDark: 'Switch to dark theme',
  hero: {
    heading: 'Courses picked for your interests and skill gaps',
    lead: 'Skill Nova compares your profile with the catalog, gives each course a match score from 0 to 100 and shows what the score is made of.',
    primary: 'Join the list',
    secondary: 'How it works',
    cardTitle: 'Python basics',
    cardMeta: 'Beginner level, video and practice',
    cardMatch: 'match',
    cardWhy: 'Why recommended',
    cardWhyText: 'Matches two of your interests and closes your Python skill gap.',
  },
  parts: [
    { key: 'interests', label: 'Interests', max: 40, text: 'How many of the course tags match your interests.' },
    { key: 'gaps', label: 'Skill gaps', max: 30, text: 'In how many course skills your target level is above your current one.' },
    { key: 'level', label: 'Level', max: 20, text: 'How well the course level fits your level in the main skill.' },
    { key: 'format', label: 'Format', max: 10, text: 'Whether the course matches your preferred learning format.' },
  ],
  stats: [
    { value: '8', label: 'courses in the demo catalog' },
    { value: '4', label: 'parts of the match score' },
    { value: '2', label: 'interface languages: UA and EN' },
  ],
  features: {
    title: 'Everything you need to pick a course and finish it',
    items: [
      {
        icon: 'target',
        title: 'Recommendations with reasons',
        text: 'The “Why recommended” block is built from the same parts as the match score, so nothing comes from nowhere.',
      },
      {
        icon: 'gap',
        title: 'Skill gaps',
        text: 'Skill Nova compares your current and target skill levels and points to what to improve first.',
      },
      {
        icon: 'trend',
        title: 'Plan and progress',
        text: 'Mark finished modules. Study hours, day streak and the weekly chart are calculated from your marks.',
      },
      {
        icon: 'bot',
        title: '“AI agent” without a neural network',
        text: 'It answers only from the database: it detects the intent, queries the tables and searches the knowledge base.',
      },
    ],
  },
  how: {
    title: 'From profile to progress in four steps',
    items: [
      { title: 'Fill in your profile', text: 'Choose interests, skill levels and your preferred learning format.' },
      { title: 'See recommendations', text: 'Get courses sorted by match score, each with an explanation.' },
      { title: 'Start a course', text: 'Open the course page, check prerequisites and press “Start”.' },
      { title: 'Mark modules', text: 'Your plan, skills and progress update after every module.' },
    ],
  },
  courses: {
    title: 'A catalog across different fields',
    lead: 'The demo catalog has eight courses. Here are a few fields.',
    items: [
      { img: '/img/ai.jpg', title: 'Artificial intelligence', text: 'Machine learning basics and working with models.' },
      { img: '/img/data.jpg', title: 'Data and analytics', text: 'Collecting, cleaning and visualizing data.' },
      { img: '/img/db.jpg', title: 'Databases', text: 'Schema design, SQL and transactions.' },
      { img: '/img/eng.jpg', title: 'Programming', text: 'Python and software engineering practices.' },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Is it real artificial intelligence?',
        a: 'No. The Skill Nova “AI agent” is a parody: it detects the intent of your question, builds an answer from the database through the ORM, and falls back to a knowledge base. There is no neural network.',
      },
      {
        q: 'How is the match score calculated?',
        a: 'Up to 100 points: interests up to 40, skill gaps up to 30, level up to 20 and format up to 10. Completed courses are removed from recommendations.',
      },
      {
        q: 'What is stored when I leave my email?',
        a: 'Only the address, your name (if you give it) and the page language. The data is stored in Neon Postgres and the same address cannot be added twice.',
      },
      {
        q: 'Is there a dark theme and English?',
        a: 'Yes. The interface works in Ukrainian and English, and the theme switches between light and dark.',
      },
      {
        q: 'What is the app built with?',
        a: 'Skill Nova runs on Django 5.2 and MySQL 8. This landing page is written in Next.js and TypeScript, stores data in Neon and is deployed on Vercel.',
      },
    ],
  },
  form: {
    title: 'Be the first to know about the launch',
    lead: 'Leave your email and we will let you know when Skill Nova opens to everyone.',
    name: 'Name (optional)',
    email: 'Email',
    submit: 'Join the list',
    sending: 'Sending…',
    ok: 'Thank you! Your email is saved.',
    duplicate: 'This email is already on the list.',
    invalid: 'Check your email: it should look like name@example.com.',
    error: 'Could not save. Please try again in a minute.',
  },
  footer: 'An intelligent system for personalized learning recommendations.',
}

export type Copy = typeof uk
export const COPY: Record<Lang, Copy> = { uk, en }
