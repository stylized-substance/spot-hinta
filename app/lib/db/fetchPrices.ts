import sql from "@/app/lib/db/db";
import { PriceDataArraySchema, PriceDataArray } from "@/app/types/priceData";
import { DateTime } from "luxon";

// Fetch price data from database
// Fetching with days = 0 returns prices from beginning of today to end of today
export async function fetchPrices(days: number): Promise<PriceDataArray> {
  if (days < 0) {
    throw new Error("Interval for price query must be a positive number");
  }

  // Set start time for query to midnight at $days before today and end date to end of today
  const currentTimeInFinland = DateTime.utc().setZone("Europe/Helsinki");
  const startTime = currentTimeInFinland
    .startOf("day")
    .minus({ days: days })
    .toUTC()
    .toISO();
  const endTime = currentTimeInFinland.endOf("day").toUTC().toISO();

  try {
    const priceData = await sql`
    SELECT *
    FROM price_data
    WHERE timestamp >= ${startTime}
    AND timestamp < ${endTime}
    ORDER BY timestamp ASC
    `;

    return PriceDataArraySchema.parse(priceData);
  } catch (error) {
    console.error("Error while fetching prices:", error);
    throw error;
  }
}

export async function fetchAllPrices(): Promise<PriceDataArray> {
  try {
    const priceData = await sql`
    SELECT *
    FROM price_data
    ORDER BY timestamp ASC
    `;

    return PriceDataArraySchema.parse(priceData);
  } catch (error) {
    console.error("Error while fetching prices:", error);
    throw error;
  }
}
