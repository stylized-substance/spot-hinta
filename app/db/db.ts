import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not defined.");
}
const migrations = [
  {
    name: "Create price_data table",
    content: `
    CREATE TABLE IF NOT EXISTS price_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP UNIQUE NOT NULL,
    price INTEGER
    );
  `,
  },
];

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function runMigrations() {
  console.log("Running database migrations");
  for (const migration of migrations) {
    console.log(migration.name);
    await sql.unsafe(migration.content)
    console.log('Done');
  }
}

export default sql;
