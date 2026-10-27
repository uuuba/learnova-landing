import { isLandingPage, isObject, type ApiFailure, type ApiResult } from './types'
const codes = ['not_found', 'validation', 'duplicate', 'server', 'network']
export const failure = (code: ApiFailure['error']['code'], status: number, message: string): ApiFailure => ({ ok: false, error: { code, status, message } })
export function parseApiResult<T>(raw: unknown, guard: (value: unknown) => value is T): ApiResult<T> {
  if (isObject(raw) && raw.ok === true && guard(raw.data)) return { ok: true, data: raw.data }
  if (isObject(raw) && raw.ok === false && isObject(raw.error) && typeof raw.error.code === 'string' && codes.includes(raw.error.code) && typeof raw.error.message === 'string' && Number.isInteger(raw.error.status) && Number(raw.error.status) >= 400 && Number(raw.error.status) <= 599) {
    return failure(raw.error.code as ApiFailure['error']['code'], Number(raw.error.status), raw.error.message)
  }
  return failure('server', 502, 'Invalid API response')
}
export async function fetchLanding(slug: string, lang: 'uk' | 'en', signal?: AbortSignal) {
  let response: Response
  try { response = await fetch(`/api/landing/${encodeURIComponent(slug)}?lang=${lang}`, { signal, cache: 'no-store' }) }
  catch { return failure('network', 503, 'Unable to connect') }
  try {
    const result = parseApiResult(await response.json(), isLandingPage)
    if (!response.ok && result.ok) return failure('server', response.status, 'Unable to load page')
    return result
  } catch { return failure('server', 502, 'Invalid API response') }
}
