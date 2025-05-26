import { DateTime } from "luxon";
import { XMLParser } from "fast-xml-parser";
import sql from "@/app/lib/db";
import { fetchWithRetry } from "@/app/lib/fetchWithRetry";
import { ApiPriceDataSchema, ApiPriceData } from "@/app/lib/types";

// Fetch price data from ENTSO-E
export async function updatePrices(
  apiUrl: string = "https://web-api.tp.entsoe.eu/api",
) {
  if (!process.env.ENTSO_E_APIKEY) {
    throw new Error("ENTSO-E API key missing");
  }

  const xmlParser = new XMLParser();

  // Current UTC time
  const utcTime = DateTime.utc();

  // Build date strings that comply with API
  const today = DateTime.utc();
  const yesterday = today.minus({ days: 1 });

  // Set beginning and end time to fetch
  const periodStart = yesterday.toFormat("yyyyLLdd'2200'");
  const periodEnd = today.toFormat("yyyyLLdd'2200'");

  console.log(`${utcTime.toISO()} - Fetching price data from ENTSO-E`);

  const response = await fetchWithRetry(
    `${apiUrl}?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YFI-1--------U&in_Domain=10YFI-1--------U&contract_MarketAgreement.type=A01&securityToken=${process.env.ENTSO_E_APIKEY}`,
    3,
    {
      method: "GET",
    },
  );

  const xmlResponse = await response.text();
  const parsedXml = xmlParser.parse(xmlResponse);

  const timeSeriesData = Array.isArray(
    parsedXml.Publication_MarketDocument.TimeSeries,
  )
    ? parsedXml.Publication_MarketDocument.TimeSeries[0].Period
    : parsedXml.Publication_MarketDocument.TimeSeries.Period;

  const priceData: ApiPriceData = {
    timeInterval: timeSeriesData.timeInterval,
    Point: timeSeriesData.Point,
  };

  ApiPriceDataSchema.parse(priceData);

  // Build price data rows and save to database
  const firstHour = DateTime.fromISO(priceData.timeInterval.start).toUTC();
  if (!firstHour.isValid) {
    throw new Error("Invalid timestamp on power forecast data")
  }
  
  const priceArray = priceData.Point.map((hour) => ({
    // Increment time by 1 hour for each datapoint in sequence and by 1 hour to correct for time zone difference between ENTSO-E data (Central European time) and UTC
    // Example: When API returns "timeInterval: { start: '2025-05-18T22:00Z' }", timestamp for the first hour is "2025-05-19T00:00Z" in UTC
    // Add added_on timestatmp
    timestamp: firstHour.plus({ hours: hour.position + 1 }),
    price: hour["price.amount"] / 10, // Convert price to cents/kWh
    added_on: utcTime,
  }));
  
  // Date objects are converted to strings for batch database insert to work
  // Datetime objects are converted to JS dates
  const valuesForDb = priceArray.map((hour) => [
    hour.timestamp.toISO(),
    hour.price,
    hour.added_on.toISO(),
  ]);
  
  await sql`
      INSERT INTO price_data (timestamp, price, added_on)
      VALUES ${sql(valuesForDb)}
    `;

  console.log("Price data inserted into database");
}
