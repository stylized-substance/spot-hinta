import sql from "@/app/lib/db/db";
import {
  ForecastDataArraySchema,
  ForecastDataArray,
} from "@/app/types/fingridData";
import { DateTime } from "luxon";

// Fetch power forecast data from database
// Fetching with days = 0 returns prices from beginning of today to end of today
export async function fetchFingridData(
  days: number,
): Promise<ForecastDataArray> {
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
    const fingridData = await sql`
      SELECT * FROM power_forecast
      WHERE starttime >= ${startTime}
      AND endtime < ${endTime}
      ORDER BY starttime ASC
    `;

    return ForecastDataArraySchema.parse(fingridData);
  } catch (error) {
    console.error("Error while fetching Fingrid data:", error);
    throw error;
  }
}
