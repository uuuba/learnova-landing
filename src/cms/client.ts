import 'server-only'
import { logCmsFailure } from './diagnostics'
import { getPayload } from 'payload'
import config from '../../payload.config'

export function cmsEnabled() { return process.env.PAYLOAD_ENABLED === 'true' }
export async function getCms() {
  if (!cmsEnabled()) throw new Error('CMS is disabled. Set PAYLOAD_ENABLED=true only for a migrated CMS database.')
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
  if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET is not set')
  try { return await getPayload({ config }) }
  catch (error) { logCmsFailure('initialize', error); throw error }
}
