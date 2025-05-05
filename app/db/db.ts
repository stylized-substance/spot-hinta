import postgres from "postgres";
import fs from "fs";
import path from 'path';
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function runMigrations() {
  console.log('Running database migrations')
  const currentFile = fileURLToPath(import.meta.url)
  const migrationsDirectory = path.join(dirname(currentFile), 'migrations')
  
  const files = fs.readdirSync(migrationsDirectory);
  console.log('dirname', migrationsDirectory)
  console.log('files', files)

  for (const file of files) {
    const migrationPath = path.join(migrationsDirectory, file);
    console.log('migrationPath', migrationPath)
    const migration = await import(migrationPath);
    console.log('migration', migration)
    await migration.up();
  }

  console.log('Migrations done')
}

export default sql;
