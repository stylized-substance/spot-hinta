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

export function findHourPrices(
  priceData: PriceDataInFrontend[],
): {
  previousHourPrice: string;
  currentHourPrice: string;
  nextHourPrice: string;
} {
  // Create DateTime object from current time in Finland.
  const currentTimeInFinland = DateTime.now().setZone("Europe/Helsinki");

  // Find price for previous hour
  const previousHour = priceData.find((hour) =>
    hour.timestamp.equals(
      currentTimeInFinland.startOf("hour").minus({ hours: 1 }),
    ),
  );

  // Find price for current hour
  const currentHour = priceData.find((hour) =>
    hour.timestamp.equals(currentTimeInFinland.startOf("hour")),
  );

  // Find price for next hour
  const nextHour = priceData.find((hour) =>
    hour.timestamp.equals(
      currentTimeInFinland.startOf("hour").plus({ hours: 1 }),
    ),
  );

  return {
    previousHourPrice: previousHour ? String(previousHour.price) : "NaN",
    currentHourPrice: currentHour ? String(currentHour.price) : "NaN",
    nextHourPrice: nextHour ? String(nextHour.price) : "NaN",
  };
}
