import sql from '@/app/db/db'

export async function up() {
  const result = await sql`
    CREATE TABLE IF NOT EXISTS price_data (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP UNIQUE NOT NULL,
      price INTEGER NOT NULL
    )
    `

  console.log(result)
}

export async function down() {
  const result = await sql`DROP TABLE price_data`
  console.log(result)
}