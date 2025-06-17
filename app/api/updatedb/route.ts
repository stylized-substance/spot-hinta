import { updatePrices } from "@/app/lib/db/updatePrices";
import { updateFingridData } from "@/app/lib/db/updateFingridData";
import { captureException, captureMessage } from "@sentry/nextjs";

export async function GET(request: Request) {
  // Check for existence of Vercel or Github cron secret in authorization header
  const authHeader = request.headers.get("authorization");
  if (
    (authHeader !== `Bearer ${process.env.CRON_SECRET}` ||
      authHeader !== `Bearer ${process.env.CRON_SECRET_GITHUB}`) &&
    process.env.NODE_ENV !== "development"
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let updatePricesResult;
  let updateFingridDataResult;

  try {
    const { sentryData } = await updatePrices();
    updatePricesResult = { status: "Success" };
    captureMessage("Price data inserted into DB", {
      extra: { priceData: sentryData },
    });
  } catch (error) {
    console.error(`Error while updating price data: ${error}`);
    captureException(error);
    updatePricesResult = { status: "Failure", error: String(error) };
  }

  try {
    await updateFingridData();
    updateFingridDataResult = { status: "Success" };
  } catch (error) {
    console.error("Error while updating Fingrid data:", error);
    captureException(error);
    updateFingridDataResult = { status: "Failure", error: error };
  }

  return Response.json({
    message: "DB operations complete",
    updatePricesResult: updatePricesResult,
    updateFingridDataResult: updateFingridDataResult,
  });
}
