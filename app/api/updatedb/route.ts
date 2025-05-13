import { updatePrices } from '@/app/utils/updatePrices'

export async function GET(request: Request) {
  // Check for existence of Vercel cron secret in authorization header
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV !== "development"
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const results = [];
  const errors = [];

  try {
    const result = await updatePrices();
    results.push({ updatePrices: result });
  } catch (error) {
    errors.push({ updatePrices: error });
    console.error(`Error while updating price data: ${error}`);
  }

  return Response.json({
    message: "DB operations complete",
    results: results,
    errors: errors,
  });
}
