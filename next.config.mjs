import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = { reactStrictMode: true, serverExternalPackages: ['ws', '@neondatabase/serverless', 'https-proxy-agent', 'pg'] }
export default withPayload(nextConfig)
