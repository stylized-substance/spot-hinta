export async function GET(request: Request) {
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   });
  // }

  if (!process.env.ENTSO_E_APIKEY) {
    throw new Error('ENTSO-E API key missing')
  }

  const currentDate = new Date().toLocaleString();
  console.log(currentDate, "- Vercel cron job running");

  const entsoUrl = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=202504300000&periodEnd=202504302300&out_Domain=10YFI-1--------U&in_Domain=10YFI-1--------U&securityToken=${process.env.ENTSO_E_APIKEY}`

  const response = await fetch(
    entsoUrl,
    {
      method: 'GET',
    }
  )

  console.log(await response.text())
  return new Response("Price data updated");
}
