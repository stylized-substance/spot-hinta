export function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const currentDate = new Date().toLocaleString();
  console.log(currentDate, "- Vercel cron job running");
  return new Response("Price data updated");
}
