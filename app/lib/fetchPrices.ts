import sql from "@/app/lib/db";
import { PriceDataSchema } from "@/app/lib/types";

export async function fetchPrices() {
  try {
    const priceData = await sql`SELECT id, timestamp, price FROM price_data`;
    console.log(priceData);
    const parsed = PriceDataSchema.parse(priceData);
    return parsed;
  } catch (error) {
    console.error("Error while fetching prices:", error);
    throw error;
  }
}
