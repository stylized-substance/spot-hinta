import { XMLParser } from "fast-xml-parser";

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

  const startTime = "2200";
  const endTime = "2200";

  // Set beginning and end time to fetch
  const periodStart = `${yesterdayYear}${yesterdayMonth}${yesterdayDate}${startTime}`;
  const periodEnd = `${todayYear}${todayMonth}${todayDate}${endTime}`;

  console.log(today.toLocaleString(), "- Fetching price data from ENTSO-E");

  const entsoUrl = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YFI-1--------U&in_Domain=10YFI-1--------U&securityToken=${process.env.ENTSO_E_APIKEY}`;

  const response = await fetch(entsoUrl, {
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

  const data = {
    timeInterval,
    resolution,
    Point,
  };

  console.log('data', data);

  return new Response("Price data updated");
}
