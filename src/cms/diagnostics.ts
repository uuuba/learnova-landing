/** Server-only diagnostics: never serialize errors, SQL, URLs or credentials. */
export function logCmsFailure(stage: string, error: unknown) {
  const reasons: string[] = []
  let current: unknown = error
  for (let depth = 0; depth < 4 && current && typeof current === 'object'; depth++) {
    const item = current as Record<string, unknown>
    const message = typeof item.message === 'string' ? item.message : ''
    if (typeof item.code === 'string' && /^[A-Z0-9_]{2,30}$/.test(item.code)) reasons.push(item.code)
    for (const [pattern, label] of [
      [/DATABASE_URL is not set/, 'missing_database_url'],
      [/PAYLOAD_SECRET is not set|missing secret key/i, 'missing_payload_secret'],
      [/read.only|EROFS/i, 'read_only_filesystem'],
      [/ENOENT|no such file/i, 'missing_file_or_directory'],
      [/password authentication failed/i, 'database_authentication_failed'],
      [/does not exist/i, 'missing_database_object'],
      [/certificate|TLS|SSL/i, 'tls_error'],
      [/CMS page structure is invalid/, 'invalid_page_structure'],
    ] as const) if (pattern.test(message)) reasons.push(label)
    current = item.cause
  }
  let expectedDatabase = false
  try { expectedDatabase = new URL(process.env.DATABASE_URL || '').pathname === '/skill_nova_cms' } catch {}
  console.error('[cms-diagnostic]', JSON.stringify({ stage, reasons: [...new Set(reasons)],
    databaseUrlPresent: Boolean(process.env.DATABASE_URL), payloadSecretPresent: Boolean(process.env.PAYLOAD_SECRET),
    expectedDatabase, websockets: process.env.NEON_WEBSOCKETS === 'true' }))
}
