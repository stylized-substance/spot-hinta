import { XMLParser } from "fast-xml-parser";
import { z } from "zod";
import sql from "@/app/db/db";
import { fetchWithRetry } from "@/app/utils/fetchWithRetry";

const ApiPriceData = z.object({
  timeInterval: z.object({
    start: z.string(),
    end: z.string(),
  }),
  resolution: z.string(),
  Point: z.array(
    z.object({
      position: z.number(),
      "price.amount": z.number(),
    }),
  ),
});

// Fetch price data from ENTSO-E
export async function GET(request: Request) {
  // Check for existence of Vercel cron secret in authorization header
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV !== "development"
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (!process.env.ENTSO_E_APIKEY) {
    throw new Error("ENTSO-E API key missing");
  }

  const xmlParser = new XMLParser();

  // Build date strings that comply with API
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayYear = today.getFullYear().toString();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const todayDate = today.getDate().toString().padStart(2, "0");
  const yesterdayYear = yesterday.getFullYear().toString();
  const yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, "0");
  const yesterdayDate = yesterday.getDate().toString().padStart(2, "0");

  // Set beginning and end time to fetch
  const periodStart = `${yesterdayYear}${yesterdayMonth}${yesterdayDate}2200`;
  const periodEnd = `${todayYear}${todayMonth}${todayDate}2200`;

  console.log(today.toLocaleString(), "- Fetching price data from ENTSO-E");

  const entsoUrl = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YFI-1--------U&in_Domain=10YFI-1--------U&contract_MarketAgreement.type=A01&securityToken=${process.env.ENTSO_E_APIKEY}`;

  const response = await fetchWithRetry(entsoUrl, 3, {
    method: "GET",
  });

  const xmlResponse = await response.text();
  const parsedXml = xmlParser.parse(xmlResponse);

  const timeSeriesData = Array.isArray(
    parsedXml.Publication_MarketDocument.TimeSeries,
  )
    ? parsedXml.Publication_MarketDocument.TimeSeries[0].Period
    : parsedXml.Publication_MarketDocument.TimeSeries.Period;
  const { timeInterval, resolution, Point } = timeSeriesData;

  const priceData = {
    timeInterval,
    resolution,
    Point,
  };

  ApiPriceData.parse(priceData);

  // Build price data rows and save to database
  const hoursArray = [];
  const firstHour = new Date(priceData.timeInterval.start);
  firstHour.setHours(firstHour.getHours() + 2); // Correct time returned by API

  for (const hour of priceData.Point) {
    // Increment time by 1 hour for each datapoint in sequence
    const timestamp = new Date(
      firstHour.getTime() + hour.position * 60 * 60 * 1000,
    );

    hoursArray.push({
      timestamp: timestamp.toISOString(),
      price: (hour["price.amount"] / 10) * 1.255, // Convert price to cents/kWh and add VAT
    });
  }

  const values = hoursArray.map((hour) => [hour.timestamp, hour.price]);

  try {
    await sql`
      INSERT INTO price_data (timestamp, price)
      VALUES ${sql(values)}
    `;

    console.log("Price data inserted into database");
  } catch (error) {
    console.error("Error while inserting price data into database");
    throw error;
  }

  return new Response("Price data updated");
}
