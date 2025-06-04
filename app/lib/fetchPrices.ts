import sql from "@/app/lib/db";
import { PriceDataArraySchema, PriceDataArray } from "@/app/types/priceData";

// Fetch price data from database
// Fetching with days = 0 returns prices from beginning of today to end of today
export async function fetchPrices(days = 0): Promise<PriceDataArray> {
  if (days < 0) {
    throw new Error("Interval for price query must be a positive number");
  }

  const interval = sql.unsafe(`'${days} days'`);
  
  try {
    const priceData = await sql`
    SELECT *
    FROM price_data
    WHERE timestamp >= DATE_TRUNC('day', NOW() AT TIME ZONE 'Europe/Helsinki') - INTERVAL ${interval}
    AND timestamp < DATE_TRUNC('day', NOW() AT TIME ZONE 'Europe/Helsinki') + INTERVAL '1 day'
    ORDER BY TIMESTAMP ASC
    `;

    return PriceDataArraySchema.parse(priceData);
  } catch (error) {
    console.error("Error while fetching prices:", error);
    throw error;
  }
}
