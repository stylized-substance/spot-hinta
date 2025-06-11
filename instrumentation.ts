import * as Sentry from "@sentry/nextjs";
import { runMigrations } from "@/app/lib/db/db";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }

  await runMigrations();
}

export const onRequestError = Sentry.captureRequestError;
