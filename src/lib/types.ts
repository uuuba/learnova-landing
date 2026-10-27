import type { Copy } from './content'
import type { LeadPayload } from './validate'

export type ErrorCode = 'not_found' | 'validation' | 'duplicate' | 'server' | 'network'
export type ApiError = { code: ErrorCode; message: string; status: number }
export type ApiSuccess<T> = { ok: true; data: T }
export type ApiFailure = { ok: false; error: ApiError }
export type ApiResult<T> = ApiSuccess<T> | ApiFailure
export type Hero = { blockType: 'hero'; data: Copy['hero']; image?: { url: string; alt: string } }
export type Features = { blockType: 'features'; data: Copy['features'] }
export type Steps = { blockType: 'steps'; data: Copy['how'] }
export type Stats = { blockType: 'stats'; data: Copy['stats'] }
export type Faq = { blockType: 'faq'; data: Copy['faq'] }
export type Cta = { blockType: 'cta'; data: Copy['form'] }
export type Courses = { blockType: 'courses'; data: Copy['courses'] }
export type PageBlock = Hero | Features | Steps | Stats | Faq | Cta | Courses
export type SiteSettings = { brand: string; nav: { label: string; href: string }[]; footer: string; contacts: string; socials: { label: string; url: string }[] }
export type PageMeta = { title: string; slug: string; seo: { title: string; description: string } }
export type LandingPage = PageMeta & { blocks: PageBlock[]; site: SiteSettings }
export type LoadState<T> = { status: 'loading' } | { status: 'error'; error: ApiError } | { status: 'ready'; data: T }
export type LeadInput = LeadPayload & { website?: string }
export type LeadRecord = LeadPayload & { id: number; source: string; createdAt: string }
export const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const strings = (value: unknown, keys: string[]) => isObject(value) && keys.every(key => typeof value[key] === 'string')
const list = (value: unknown, keys: string[]) => Array.isArray(value) && value.every(item => strings(item, keys))
export function isPageBlock(value: unknown): value is PageBlock {
  if (!isObject(value)) return false
  const d = value.data
  switch (value.blockType) {
    case 'hero': return strings(d, ['heading', 'lead', 'primary', 'secondary', 'cardTitle', 'cardMeta', 'cardMatch', 'cardWhy', 'cardWhyText']) && (value.image === undefined || strings(value.image, ['url', 'alt']) && isObject(value.image) && typeof value.image.url === 'string' && value.image.url.startsWith('/api/media/'))
    case 'stats': return list(d, ['value', 'label'])
    case 'features': return strings(d, ['title']) && isObject(d) && list(d.items, ['title', 'text', 'icon'])
    case 'steps': return strings(d, ['title']) && isObject(d) && list(d.items, ['title', 'text'])
    case 'faq': return strings(d, ['title']) && isObject(d) && list(d.items, ['q', 'a'])
    case 'courses': return strings(d, ['title', 'lead']) && isObject(d) && list(d.items, ['title', 'text', 'img']) && Array.isArray(d.items) && d.items.every(item => isObject(item) && typeof item.img === 'string' && item.img.startsWith('/img/') && !item.img.includes('..'))
    case 'cta': return strings(d, ['title', 'lead', 'name', 'email', 'submit', 'sending', 'ok', 'duplicate', 'invalid', 'error'])
    default: return false
  }
}
export function isLandingPage(value: unknown): value is LandingPage {
  return isObject(value) && strings(value, ['title', 'slug']) && strings(value.seo, ['title', 'description']) &&
    Array.isArray(value.blocks) && value.blocks.every(isPageBlock) && isObject(value.site) &&
    strings(value.site, ['brand', 'footer', 'contacts']) && list(value.site.nav, ['label', 'href']) && list(value.site.socials, ['label', 'url']) &&
    Array.isArray(value.site.nav) && value.site.nav.every(item => isObject(item) && typeof item.href === 'string' && /^#[a-z][a-z0-9-]*$/.test(item.href)) &&
    Array.isArray(value.site.socials) && value.site.socials.every(item => isObject(item) && typeof item.url === 'string' && item.url.startsWith('https://'))
}
export function isLeadInput(value: unknown): value is LeadInput {
  return isObject(value) && typeof value.email === 'string' && (typeof value.name === 'string' || value.name === null) && (value.lang === 'uk' || value.lang === 'en') && (value.website === undefined || typeof value.website === 'string')
}
