import sql from "@/app/lib/db/db";
import {
  DbElectricityDataArraySchema,
  DbElectricityDataArray,
} from "@/app/types/fingridData";
import { DateTime } from "luxon";

// Fetch electricity production data from database
// Fetching with days = 0 returns prices from beginning of today to end of today
export async function fetchFingridDataFromDb(
  days: number,
): Promise<DbElectricityDataArray> {
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
      SELECT * FROM electricity_production
      WHERE starttime >= ${startTime}
      AND endtime < ${endTime}
      ORDER BY starttime ASC
    `;

    return DbElectricityDataArraySchema.parse(fingridData);
  } catch (error) {
    console.error("Error while fetching Fingrid data:", error);
    throw error;
  }
}
