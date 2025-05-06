import postgres from "postgres";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not defined.");
}

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function runMigrations() {
  const currentFile = fileURLToPath(import.meta.url);
  const migrationsDirectory = path.join(dirname(currentFile), "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"));

  for (const file of migrationFiles) {
    await sql.file(`${migrationsDirectory}/${file}`);
  }
}

export default sql;
