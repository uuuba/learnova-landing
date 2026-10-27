import type { Block, CollectionConfig, Field, GlobalConfig } from 'payload'

const text = (name: string): Field => ({ name, type: 'text', required: true, localized: true })
const items = (fields: Field[]): Field => ({ name: 'items', type: 'array', required: true, minRows: 1, fields })
const titled = (slug: string, fields: Field[]): Block => ({ slug, fields: [text('title'), ...fields] })
export const blocks: Block[] = [
  { slug: 'hero', fields: [
    ...['heading', 'lead', 'primary', 'secondary', 'cardTitle', 'cardMeta', 'cardMatch', 'cardWhy', 'cardWhyText'].map(text),
    { name: 'media', type: 'upload', relationTo: 'media' },
  ] },
  titled('features', [items([text('title'), text('text'), { name: 'icon', type: 'select', required: true, options: ['target', 'gap', 'trend', 'bot', 'spark'] }])]),
  titled('steps', [items([text('title'), text('text')])]),
  { slug: 'stats', fields: [items([text('value'), text('label')])] },
  titled('faq', [items([text('q'), text('a')])]),
  titled('cta', ['lead', 'name', 'email', 'submit', 'sending', 'ok', 'duplicate', 'invalid', 'error'].map(text)),
  titled('courses', [text('lead'), items([text('title'), text('text'), { name: 'img', type: 'text', required: true, validate: (value: unknown) => typeof value === 'string' && value.startsWith('/img/') && !value.includes('..') || 'Use a bundled /img/ image path' }])]),
]
const admin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)
const protectedAccess = { create: admin, read: admin, update: admin, delete: admin }
export const Users: CollectionConfig = { slug: 'users', auth: true, admin: { useAsTitle: 'email' }, access: protectedAccess, fields: [] }
export const Pages: CollectionConfig = {
  slug: 'pages', admin: { useAsTitle: 'title' }, access: protectedAccess,
  fields: [text('title'), { name: 'slug', type: 'text', unique: true, required: true, index: true },
    { name: 'seo', type: 'group', fields: [text('title'), text('description')] },
    { name: 'blocks', type: 'blocks', required: true, blocks }],
}
export const Media: CollectionConfig = {
  slug: 'media', access: { ...protectedAccess, read: () => true },
  upload: { staticDir: process.env.VERCEL ? '/tmp/skill-nova-media' : 'media', mimeTypes: ['image/*'] },
  hooks: { beforeOperation: [({ operation }) => { if (process.env.VERCEL && (operation === 'create' || operation === 'update')) throw new Error('Media uploads require durable storage on Vercel. Upload locally or configure an object-storage adapter first.') }] },
  fields: [text('alt')],
}
export const Leads: CollectionConfig = {
  slug: 'leads', dbName: 'cms_leads', access: protectedAccess,
  fields: [{ name: 'email', type: 'email', required: true, unique: true },
    { name: 'name', type: 'text', maxLength: 100 },
    { name: 'lang', type: 'select', required: true, options: ['uk', 'en'] },
    { name: 'source', type: 'text', required: true, defaultValue: 'landing' }],
}
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings', access: { read: admin, update: admin },
  fields: [{ name: 'brand', type: 'text', required: true, defaultValue: 'Skill Nova' },
    { name: 'nav', type: 'array', fields: [text('label'), { name: 'href', type: 'text', required: true, validate: (value: unknown) => typeof value === 'string' && /^#[a-z][a-z0-9-]*$/.test(value) || 'Use a section anchor such as #features' }] },
    text('footer'), { name: 'contacts', type: 'text', localized: true },
    { name: 'socials', type: 'array', fields: [text('label'), { name: 'url', type: 'text', required: true, validate: (value: unknown) => typeof value === 'string' && value.startsWith('https://') || 'Use an HTTPS URL' }] }],
}
