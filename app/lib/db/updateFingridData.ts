import { DateTime } from "luxon";
import sql from "@/app/lib/db/db";
import { fetchFingridDataFromApi } from "@/app/lib/fetchFingridDataFromApi";
import { ApiElectricityDataArray } from "@/app/types/fingridData";

// Insert electricity production data to database
export async function updateFingridData() {
  if (!process.env.FINGRID_APIKEY) {
    throw new Error("Fingrid API key missing");
  }

  // Current UTC time
  const utcTime = DateTime.utc();

  // Set beginning and end time to fetch
  const startTime = utcTime.set({
    hour: 12,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const endTime = utcTime
    .plus({ days: 1 })
    .set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

  const datasetIds = [165, 241, 246, 247];

  const data: ApiElectricityDataArray | null = await fetchFingridDataFromApi(
    undefined,
    startTime,
    endTime,
    datasetIds,
  );

  // Skip database operation if data fetching wasn't successful
  if (!data) {
    return
  }

  // Build data rows and save to database
  const valuesForDb = data.map((entry) => [
    entry.startTime,
    entry.endTime,
    entry["Electricity consumption forecast - updated once a day"] ?? 0,
    entry["Electricity production prediction - updated every 15 minutes"] ?? 0,
    entry["Wind power generation forecast - updated once a day"] ?? 0,
    entry["Solar power generation forecast - updated once a day"] ?? 0,
    utcTime.toISO(),
  ]);

  await sql`
    INSERT INTO electricity_production (
    starttime,
    endTime,
    consumption,
    production_total,
    production_wind,
    production_solar,
    added_on
    )
    VALUES ${sql(valuesForDb)}
    ON CONFLICT DO NOTHING;
  `;
}
