import 'dotenv/config'
import pg from 'pg'
import { readFile } from 'fs/promises'

const { Pool } = pg

const useSSL = process.env.PGSSL === 'true'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error', err)
})

export const query = (text, params) => pool.query(text, params)

export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is missing. Example: postgresql://postgres:password@localhost:5432/snapmeals'
    )
  }

  const schemaUrl = new URL('../database/schema.sql', import.meta.url)
  const schema = await readFile(schemaUrl, 'utf8')
  const client = await pool.connect()

  try {
    await client.query('SELECT 1')
    await client.query(schema)
    console.log('PostgreSQL connected')
  } finally {
    client.release()
  }
}
