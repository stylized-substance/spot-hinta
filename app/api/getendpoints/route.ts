import endpoints from "@/data/fingrid-endpoints.json";

export function GET(request: Request) {
  const data = JSON.parse(endpoints);
  const response: object = data.map((item) => ({
    id: item.id,
    nameFi: item.nameFi,
    descriptionFi: item.descriptionFi
  }));

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
