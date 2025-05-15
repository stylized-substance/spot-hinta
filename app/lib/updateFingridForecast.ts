import { z } from "zod";
import sql from "@/app/lib/db";
import { fetchWithRetry } from "@/app/lib/fetchWithRetry";

// Fetch electricity data from Fingrid API
export async function fetchFingridData(
  apiUrl: string = "https://data.fingrid.fi/api/data",
) {
  if (!process.env.FINGRID_APIKEY) {
    throw new Error("Fingrid API key missing");
  }

  const ApiForecastData = z.array(
    z.object({
      startTime: z.string().datetime(),
      endTime: z.string(),
      "Electricity consumption forecast - next 24 hours": z.number(),
      "Electricity production prediction - updated every 15 minutes":
        z.number(),
      "Wind power generation forecast - updated once a day": z.number(),
      "Solar power generation forecast - updated once a day": z.number(),
    }),
  );

  type ApiForecastData = z.infer<typeof ApiForecastData>;
  type EntryForDb = [string, number, number, number, number];

  // Build date strings that comply with API
  const today = new Date();
  const todayYear = today.getFullYear().toString();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const todayDate = today.getDate().toString().padStart(2, "0");

  // Set beginning and end time to fetch
  const startTime = `${todayYear}-${todayMonth}-${todayDate}T00:00`;
  const endTime = `${todayYear}-${todayMonth}-${todayDate}T23:59`;

  console.log(today.toLocaleString(), "- Fetching data from Fingrid API");

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

  const { data }: { data: ApiForecastData } = await response.json();

  ApiForecastData.parse(data);

  //Build data rows and save to database
  const values: EntryForDb[] = data.map((entry) => [
    entry.startTime,
    entry["Electricity consumption forecast - next 24 hours"],
    entry["Electricity production prediction - updated every 15 minutes"],
    entry["Wind power generation forecast - updated once a day"],
    entry["Solar power generation forecast - updated once a day"],
  ]);

  await sql`
    INSERT INTO power_forecast (
    timestamp,
    consumption,
    production_total,
    production_wind,
    production_solar
    )
    VALUES ${sql(values)}
  `;

  console.log("Power forecast data inserted into database");

  return data;
}
