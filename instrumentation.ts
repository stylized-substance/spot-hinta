import { runMigrations } from "@/app/lib/db";

export async function register() {
  await runMigrations();
}
