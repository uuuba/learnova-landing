import { getCms, cmsEnabled } from '@/cms/client'
import { toLanding } from '@/cms/landing'
import { failure } from '@/lib/landing-api'
import { isLandingPage } from '@/lib/types'

export const dynamic = 'force-dynamic'
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!cmsEnabled()) return Response.json(failure('not_found', 404, 'CMS is disabled'), { status: 404 })
  const { slug } = await params
  const locale = new URL(request.url).searchParams.get('lang') === 'en' ? 'en' : 'uk'
  try {
    const payload = await getCms()
    const result = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, locale, limit: 1, depth: 1, overrideAccess: true })
    if (!result.docs[0]) return Response.json(failure('not_found', 404, 'Page not found'), { status: 404 })
    const site = await payload.findGlobal({ slug: 'site-settings', locale, overrideAccess: true })
    const data = toLanding(result.docs[0], site)
    if (!isLandingPage(data)) throw new Error('CMS page structure is invalid')
    return Response.json({ ok: true, data })
  } catch {
    console.error('[landing] CMS query failed')
    return Response.json(failure('server', 500, 'Unable to load page'), { status: 500 })
  }
}
