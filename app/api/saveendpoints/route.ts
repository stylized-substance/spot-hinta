import { fetchAllData } from "@/app/utils/fetch-fingrid-endpoints";
import fs from "fs";

export async function GET() {
  const endpoints = await fetchAllData();
  fs.writeFileSync(
    "data/fingrid-endpoints.json",
    JSON.stringify(endpoints, null, 2),
  );
  
  return new Response("Endpoints written to file");
}
