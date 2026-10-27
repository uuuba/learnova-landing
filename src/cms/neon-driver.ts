import pg from 'pg'
import { Pool, Client, neonConfig } from '@neondatabase/serverless'
import WebSocket from 'ws'
import { HttpsProxyAgent } from 'https-proxy-agent'

// Neon implements the node-postgres Pool/Client interface over TLS WebSockets.
// Opt in for environments that allow HTTPS but not outbound PostgreSQL TCP.
export function neonDriver(): typeof pg | undefined {
  if (process.env.NEON_WEBSOCKETS !== 'true') return undefined
  const proxy = process.env.HTTPS_PROXY
  neonConfig.webSocketConstructor = proxy
    ? class extends WebSocket {
      constructor(address: string, protocols?: string | string[]) {
        super(address, protocols, { agent: new HttpsProxyAgent(proxy!) })
      }
    }
    : WebSocket
  return { ...pg, Pool, Client } as unknown as typeof pg
}
