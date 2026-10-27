import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { uk } from '@payloadcms/translations/languages/uk'
import sharp from 'sharp'
import { neonDriver } from './src/cms/neon-driver'
import { Users, Pages, Media, Leads, SiteSettings } from './src/cms/schema'

const dirname = path.dirname(fileURLToPath(import.meta.url))
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  collections: [Users, Pages, Media, Leads], globals: [SiteSettings],
  editor: lexicalEditor(), sharp,
  localization: { locales: ['uk', 'en'], defaultLocale: 'uk', fallback: true },
  i18n: { supportedLanguages: { uk, en }, fallbackLanguage: 'uk' },
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  db: postgresAdapter({ pg: neonDriver(), pool: { connectionString: process.env.DATABASE_URL || '' }, push: false, migrationDir: path.resolve(dirname, 'src/migrations') }),
})
