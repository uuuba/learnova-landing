import { cmsEnabled, getCms } from '@/cms/client'
import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (cmsEnabled()) {
      const payload = await getCms()
      await payload.find({ collection: 'pages', limit: 1, overrideAccess: true })
      return NextResponse.json({ ok: true, db: 'up' })
    }
    const sql = getSql()
    await sql`SELECT 1`
    return NextResponse.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('[health] Database unavailable; check DATABASE_URL and CMS migrations')
    return NextResponse.json({ ok: false, db: 'down' }, { status: 503 })
  }
}
