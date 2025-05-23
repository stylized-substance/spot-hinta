import endpoints from "@/data/fingrid-endpoints.json";

export function GET() {
  const data = JSON.parse(endpoints);
  interface Endpoint {
    id: number;
    nameFi: string;
    nameEn: string;
    descriptionFi: string;
  }

  const response: Endpoint[] = data.map((item: Endpoint) => ({
    id: item.id,
    nameFi: item.nameFi,
    nameEn: item.nameEn,
    descriptionFi: item.descriptionFi,
  }));

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
