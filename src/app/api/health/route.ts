import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sql = getSql()
    await sql`SELECT 1`
    return NextResponse.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('[health]', error)
    return NextResponse.json({ ok: false, db: 'down' }, { status: 503 })
  }
}
