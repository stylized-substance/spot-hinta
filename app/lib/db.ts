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
    timestamp TIMESTAMPTZ UNIQUE NOT NULL,
    price NUMERIC(7, 3),
    added_on TIMESTAMPTZ
    );
  `,
  },
  {
    name: "Create power_forecast table",
    content: `
    CREATE TABLE IF NOT EXISTS power_forecast (
    id SERIAL PRIMARY KEY,
    startTime TIMESTAMPTZ UNIQUE NOT NULL,
    endTime TIMESTAMPTZ UNIQUE NOT NULL,
    consumption NUMERIC(6, 0),
    production_total NUMERIC(6, 0),
    production_wind NUMERIC(6, 0),
    production_solar NUMERIC(6, 0),
    added_on TIMESTAMPTZ
    );
    `,
  },
];

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function runMigrations() {
  console.log("Running database migrations");
  for (const migration of migrations) {
    console.log(migration.name);
    await sql.unsafe(migration.content);
    console.log("Done");
  }
}

export default sql;
