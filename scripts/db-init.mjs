import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL не задано (див. .env.example)')
  process.exit(1)
}

const sql = neon(url)
const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')
await sql.query(schema)
console.log('OK: таблицю leads створено (або вона вже існує).')
