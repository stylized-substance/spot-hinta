import postgres from "postgres";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not defined.");
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function runMigrations() {
  console.log("Running database migrations");

  try {
    const currentFile = fileURLToPath(import.meta.url);
    const migrationsDirectory = path.join(dirname(currentFile), "migrations");

    const migrationFiles = fs
      .readdirSync(migrationsDirectory)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    console.log("dirname", migrationsDirectory);
    console.log("migrationFiles", migrationFiles);

    if (migrationFiles.length === 0) {
      console.log('No files found, skipping migrations.')
      return
    }

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDirectory, file);
      console.log("Importing file", migrationPath);
      const migration = await import(migrationPath);

      if (typeof migration.up !== "function") {
        throw new Error(
          `Migration file ${file} does not export an 'up' function.`,
        );
      }

      console.log("migration", migration);
      console.log("Running migration -", file);
      await migration.up(sql);
      console.log("Done");
    }

    console.log("Database migrations done");
  } catch (error) {
    console.error("Error during database migrations:", error);
    throw error;
  }
}

export default sql;
