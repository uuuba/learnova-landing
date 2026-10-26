import { neon } from '@neondatabase/serverless'

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

let ready: Promise<void> | null = null

// Створює таблицю при першому запиті, якщо `npm run db:init` ще не запускали.
export function ensureLeadsTable(): Promise<void> {
  if (!ready) {
    const sql = getSql()
    ready = sql
      .query(
        `CREATE TABLE IF NOT EXISTS leads (
           id         BIGSERIAL PRIMARY KEY,
           email      TEXT        NOT NULL UNIQUE,
           name       TEXT,
           lang       TEXT        NOT NULL DEFAULT 'uk' CHECK (lang IN ('uk', 'en')),
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         )`,
      )
      .then(() => undefined)
      .catch((error) => {
        ready = null
        throw error
      })
  }
  return ready
}
