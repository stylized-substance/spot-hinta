import { DateTime } from "luxon";
import { XMLParser } from "fast-xml-parser";
import sql from "@/app/lib/db/db";
import { fetchWithRetry } from "@/app/lib/fetchWithRetry";
import { ApiPriceDataSchema, ApiPriceData } from "@/app/types/priceData";

// Fetch price data from ENTSO-E
export async function updatePrices(
  apiUrl: string = "https://web-api.tp.entsoe.eu/api",
): Promise<{
  sentryData: {
    timestamp: string;
    added_on: string;
    price: number;
  }[];
}> {
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
  const firstHour = DateTime.fromISO(priceData.timeInterval.start);
  if (!firstHour.isValid) {
    throw new Error("Invalid timestamp on electricity production data");
  }

  const priceArray = priceData.Point.map((hour) => ({
    // Increment time by 1 hour for each datapoint in sequence
    // Add added_on timestatmp
    timestamp: firstHour.plus({ hours: hour.position - 1 }),
    price: hour["price.amount"] / 10, // Convert price to cents/kWh
    added_on: utcTime,
  }));

  // Transform price data DateTimes to strings for logging into Sentry
  const sentryData = priceArray.map((hour) => ({
    ...hour,
    timestamp: hour.timestamp.toISO(),
    added_on: hour.added_on.toISO(),
  }));

  // Datetime objects are converted to strings for batch database insert to work
  const valuesForDb = priceArray.map((hour) => [
    hour.timestamp.toISO(),
    hour.price,
    hour.added_on.toISO(),
  ]);

  await sql`
  INSERT INTO price_data (timestamp, price, added_on)
  VALUES ${sql(valuesForDb)}
  ON CONFLICT (timestamp) DO NOTHING;
  `;

  console.log("Price data inserted into database");

  // Price data is returned for logging into Sentry
  return { sentryData };
}
