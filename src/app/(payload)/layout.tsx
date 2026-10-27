import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
import { importMap } from './admin/importMap'
import { cmsEnabled } from '@/cms/client'

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'
  if (!cmsEnabled()) throw new Error('CMS is disabled')
  return handleServerFunctions({ ...args, config, importMap })
}
export default function Layout({ children }: { children: React.ReactNode }) {
  if (!cmsEnabled()) return <html lang="uk"><body>{children}</body></html>
  return RootLayout({ children, config, importMap, serverFunction })
}
