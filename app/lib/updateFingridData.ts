import { DateTime } from "luxon";
import sql from "@/app/lib/db";
import { fetchWithRetry } from "@/app/lib/fetchWithRetry";
import {
  ApiForecastDataArraySchema,
  ApiForecastDataArray,
} from "@/app/types/fingridData";

// Fetch electricity data from Fingrid API
export async function fetchFingridData(
  apiUrl: string = "https://data.fingrid.fi/api/data",
) {
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

  console.log(utcTime.toISO(), "- Fetching data from Fingrid API");

  const datasetIds = [165, 241, 246, 247];

  const response = await fetchWithRetry(
    `${apiUrl}?datasets=${datasetIds}&startTime=${startTime}&endTime=${endTime}&oneRowPerTimePeriod=true&locale=en&pageSize=1000`,
    3,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.FINGRID_APIKEY,
      },
    },
  );

  const { data } = await response.json();
  const parsedData: ApiForecastDataArray = ApiForecastDataArraySchema.parse(data)

  //Build data rows and save to database
  const valuesForDb = parsedData.map((entry) => [
    entry.startTime,
    entry.endTime,
    entry["Electricity consumption forecast - updated once a day"],
    entry["Electricity production prediction - updated every 15 minutes"],
    entry["Wind power generation forecast - updated once a day"],
    entry["Solar power generation forecast - updated once a day"],
    utcTime.toISO(),
  ]);

  await sql`
    INSERT INTO power_forecast (
    startTime,
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

  console.log("Power forecast data inserted into database");

  return data;
}
