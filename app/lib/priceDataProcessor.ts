import { DateTime } from "luxon";
import { PriceDataArray, PriceDataInFrontend } from "../types/priceData";

export function formatPriceData(
  priceData: PriceDataArray,
): PriceDataInFrontend[] {
  // Add Finnish VAT to prices and round to two decimals
  // Convert timestamps to Finnish timezone
  const localizedPriceData: PriceDataInFrontend[] = priceData.map((dataRow) => {
    const price = (Number(dataRow.price) * 1.255).toFixed(2).toString();
    return {
      id: dataRow.id,
      timestamp: DateTime.fromJSDate(dataRow.timestamp).setZone(
        "Europe/Helsinki",
      ),
      price: price,
    };
  });

  return localizedPriceData;
}

export function findHourPrice(priceData: PriceDataInFrontend[]): string {
  // Create DateTime object from current time in Finland.
  const currentTimeInFinland = DateTime.now().setZone("Europe/Helsinki");

  console.log(priceData.find((hour) => 
    hour.timestamp.equals(currentTimeInFinland.startOf("hour")),
  ))

  // Find price for the current hour
  const currentHour = priceData.find((hour) =>
    hour.timestamp.equals(currentTimeInFinland.startOf("hour")),
  );

  return currentHour ? String(currentHour.price) : "NaN";
}
