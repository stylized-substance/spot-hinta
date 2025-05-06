import postgres from "postgres";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export async function up(sql: postgres.Sql<{}>) {
  const result = await sql`
    CREATE TABLE IF NOT EXISTS price_data (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP UNIQUE NOT NULL,
      price INTEGER NOT NULL
    )
    `;

  console.log(result);
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export async function down(sql: postgres.Sql<{}>) {
  const result = await sql`DROP TABLE IF EXISTS price_data`;
  console.log(result);
}

const migration = { up, down }

export default migration
