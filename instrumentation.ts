import { runMigrations } from '@/app/db/db'

export function register() {
  console.log('register function running')
  runMigrations()
}