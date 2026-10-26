import { NextResponse } from 'next/server'
import { ensureLeadsTable, getSql } from '@/lib/db'
import { parseLead } from '@/lib/validate'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 })
  }

  // honeypot: бот заповнив приховане поле — вдаємо успіх і нічого не пишемо
  if (typeof raw === 'object' && raw !== null && (raw as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const lead = parseLead(raw)
  if (!lead) return NextResponse.json({ ok: false, code: 'validation' }, { status: 400 })

  try {
    await ensureLeadsTable()
    const sql = getSql()
    const rows = await sql`
      INSERT INTO leads (email, name, lang)
      VALUES (${lead.email}, ${lead.name}, ${lead.lang})
      ON CONFLICT (email) DO NOTHING
      RETURNING id`
    if (rows.length === 0) return NextResponse.json({ ok: false, code: 'duplicate' }, { status: 409 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('[subscribe]', error)
    return NextResponse.json({ ok: false, code: 'server' }, { status: 500 })
  }
}
