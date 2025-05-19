import sql from "@/app/lib/db";
import { PriceDataArraySchema, PriceDataArray } from "@/app/lib/types";

export async function fetchPrices(days = 7): Promise<PriceDataArray> {
  const interval = sql.unsafe(`'${days} days'`);
  //TODO: fix sql
  //TODO: add VAT to prices
  try {
    const priceData = await sql`
    SELECT id, timestamp, price
    FROM price_data
    WHERE timestamp BETWEEN
      (DATE_TRUNC('day', NOW() AT TIME ZONE 'Europe/Helsinki') - INTERVAL ${interval})
      AND NOW() AT TIME ZONE 'Europe/Helsinki'
    ORDER BY TIMESTAMP ASC
    `;

    const parsed = PriceDataArraySchema.parse(priceData);
    return parsed;
  } catch (error) {
    console.error("Error while fetching prices:", error);
    throw error;
  }
}
