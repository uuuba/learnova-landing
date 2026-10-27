import { getPayload } from 'payload'
import config from '../payload.config'
import { COPY } from '../src/lib/content'
import type { Copy, Lang } from '../src/lib/content'
import type { Page } from '../src/payload-types'

function blocks(t: Copy): Page['blocks'] {
  return [
    { blockType: 'hero', ...t.hero }, { blockType: 'stats', items: t.stats },
    { blockType: 'features', ...t.features, items: t.features.items.map(item => ({ ...item, icon: item.icon as 'target' | 'gap' | 'trend' | 'bot' })) },
    { blockType: 'steps', ...t.how }, { blockType: 'courses', ...t.courses }, { blockType: 'faq', ...t.faq }, { blockType: 'cta', ...t.form },
  ]
}
async function main() {
  for (const key of ['DATABASE_URL', 'PAYLOAD_SECRET', 'SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD']) {
    if (!process.env[key]) throw new Error(`${key} is not set`)
  }
  const payload = await getPayload({ config })
  try {
    const email = process.env.SEED_ADMIN_EMAIL!
    const users = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
    if (!users.totalDocs) await payload.create({ collection: 'users', data: { email, password: process.env.SEED_ADMIN_PASSWORD! } })
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
    if (existing.totalDocs) { console.log('Home already exists; editorial content preserved.'); return }
    let id: number | undefined
    for (const locale of ['uk', 'en'] as Lang[]) {
      const t = COPY[locale]
      const data = { title: t.meta.title, slug: 'home', seo: t.meta, blocks: blocks(t) }
      if (id === undefined) id = (await payload.create({ collection: 'pages', data, locale })).id
      else {
        const original = await payload.findByID({ collection: 'pages', id, locale: 'uk' })
        const localized = data.blocks.map((block, index) => ({ ...block, id: original.blocks[index].id,
          ...('items' in block ? { items: block.items?.map((item, row) => ({ ...item, id: 'items' in original.blocks[index] ? original.blocks[index].items?.[row]?.id : undefined })) } : {}) }))
        await payload.update({ collection: 'pages', id, data: { ...data, blocks: localized }, locale })
      }
      const settings = await payload.findGlobal({ slug: 'site-settings', locale: 'uk' })
      await payload.updateGlobal({ slug: 'site-settings', locale, data: { brand: 'Skill Nova', footer: t.footer,
        nav: t.nav.map((item, index) => ({ id: settings.nav?.[index]?.id, label: item.label, href: `#${item.id}` })), contacts: '', socials: [] } })
    }
    console.log('Seed complete: administrator, home (uk/en), site settings.')
  } finally { void payload.destroy() }
}
main().then(() => process.exit(0)).catch(() => { console.error('Seed failed. Check required variables and run migrations against a dedicated CMS database.'); process.exit(1) })
