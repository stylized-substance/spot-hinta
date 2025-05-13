import { updatePrices } from "@/app/utils/updatePrices";
import { fetchFingridData } from "@/app/utils/fetchFingridData";

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

  let updatePricesResult;
  let fetchFingridDataResult;

  try {
    await updatePrices();
    updatePricesResult = { status: "Success" };
  } catch (error) {
    console.error(`Error while updating price data: ${error}`);
    updatePricesResult = { status: "Failure", error: String(error) };
  }

  try {
    fetchFingridDataResult = await fetchFingridData();
  } catch (error) {
    fetchFingridDataResult = error;
  }

  return Response.json({
    message: "DB operations complete",
    updatePricesResult: updatePricesResult,
    fetchFingridDataResult: fetchFingridDataResult,
  });
}
