-- Таблиця заявок з форми на лендингу (Neon Postgres)
CREATE TABLE IF NOT EXISTS leads (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT        NOT NULL UNIQUE,
  name       TEXT,
  lang       TEXT        NOT NULL DEFAULT 'uk' CHECK (lang IN ('uk', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
