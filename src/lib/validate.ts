export type Lang = 'uk' | 'en'

export type LeadPayload = {
  email: string
  name: string | null
  lang: Lang
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function parseLead(raw: unknown): LeadPayload | null {
  if (typeof raw !== 'object' || raw === null) return null
  const body = raw as Record<string, unknown>

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (email.length > 254 || !EMAIL_RE.test(email)) return null

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : ''
  const lang: Lang = body.lang === 'en' ? 'en' : 'uk'

  return { email, name: name || null, lang }
}
