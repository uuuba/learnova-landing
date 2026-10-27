import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { notFound } from 'next/navigation'
import { importMap } from '../importMap'
import { cmsEnabled } from '@/cms/client'

type Props = { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }
export const dynamic = 'force-dynamic'
export function generateMetadata(props: Props) {
  if (!cmsEnabled()) return { title: 'CMS disabled' }
  return generatePageMetadata({ config, ...props })
}
export default function Page(props: Props) {
  if (!cmsEnabled()) notFound()
  return RootPage({ config, importMap, ...props })
}
