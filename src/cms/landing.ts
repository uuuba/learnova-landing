import type { Page, SiteSetting } from '@/payload-types'
import type { LandingPage, PageBlock } from '@/lib/types'

export function toLanding(page: Page, site: SiteSetting): LandingPage {
  const blocks: PageBlock[] = (page.blocks ?? []).map(block => {
    switch (block.blockType) {
      case 'hero': {
        const media = typeof block.media === 'object' ? block.media : null
        return { blockType: 'hero', data: block, ...(media?.url ? { image: { url: media.url, alt: media.alt } } : {}) }
      }
      case 'stats': return { blockType: 'stats', data: block.items ?? [] }
      case 'features': return { blockType: 'features', data: { title: block.title, items: block.items ?? [] } }
      case 'steps': return { blockType: 'steps', data: { title: block.title, items: block.items ?? [] } }
      case 'faq': return { blockType: 'faq', data: { title: block.title, items: block.items ?? [] } }
      case 'cta': return { blockType: 'cta', data: block }
      case 'courses': return { blockType: 'courses', data: { title: block.title, lead: block.lead, items: block.items ?? [] } }
    }
  })
  return { title: page.title, slug: page.slug, seo: page.seo, blocks,
    site: { brand: site.brand, nav: site.nav ?? [], footer: site.footer, contacts: site.contacts ?? '', socials: site.socials ?? [] } }
}
