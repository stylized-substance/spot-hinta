import { runMigrations } from '@/app/db/db'

export async function register() {
  await runMigrations()
}