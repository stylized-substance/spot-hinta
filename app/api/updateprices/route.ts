import { XMLParser } from 'fast-xml-parser'

// Fetch price data from ENTSO-E
export async function GET(request: Request) {
  // Check for existence of Vercel cron secret in authorization header
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //     return new Response('Unauthorized', {
  //         status: 401,
  //       });
  //     }

  if (!process.env.ENTSO_E_APIKEY) {
    throw new Error('ENTSO-E API key missing')
  }
  
  const currentDate = new Date().toLocaleString();
  console.log(currentDate, "- Fetching price data from ENTSO-E");

  const xmlParser = new XMLParser

  // Set beginning and end time to fetch
  const periodStart = '202504300000'
  const periodEnd = '202504302300'

  const entsoUrl = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YFI-1--------U&in_Domain=10YFI-1--------U&securityToken=${process.env.ENTSO_E_APIKEY}`
  
  const response = await fetch(
    entsoUrl,
    {
      method: 'GET',
    }
  )

  const xmlResponse = await response.text()
  
  const parsedXml = xmlParser.parse(xmlResponse)

  const { timeInterval, resolution, Point } = parsedXml.Publication_MarketDocument.TimeSeries[0].Period

  const data = {
    timeInterval,
    resolution,
    Point
  }

  console.log(data)

  return new Response("Price data updated");
}
