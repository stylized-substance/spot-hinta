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
    price NUMERIC(7, 3) NOT NULL,
    added_on TIMESTAMPTZ NOT NULL
    );
  `,
  },
  {
    name: "Create electricity_production table",
    content: `
    CREATE TABLE IF NOT EXISTS electricity_production (
    id SERIAL PRIMARY KEY,
    starttime TIMESTAMPTZ UNIQUE NOT NULL,
    endtime TIMESTAMPTZ UNIQUE NOT NULL,
    consumption NUMERIC(6, 0) NOT NULL,
    production_total NUMERIC(6, 0) NOT NULL,
    production_wind NUMERIC(6, 0) NOT NULL,
    production_solar NUMERIC(6, 0) NOT NULL,
    added_on TIMESTAMPTZ NOT NULL
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
