import { DateTime } from "luxon";
import { PriceDataArray, PriceDataInFrontend } from "../types/priceData";

export function formatPriceData(
  priceData: PriceDataArray,
): PriceDataInFrontend[] {
  // Add Finnish VAT to prices and round to two decimals
  // Convert timestamps to Finnish timezone
  const localizedPriceData: PriceDataInFrontend[] = priceData.map((dataRow) => {
    const priceString: string = (Number(dataRow.price) * 1.255)
      .toFixed(2)
      .toString();
    return {
      id: dataRow.id,
      timestamp: DateTime.fromJSDate(dataRow.timestamp).setZone(
        "Europe/Helsinki",
      ),
      price: parseFloat(priceString),
      priceString: priceString,
    };
  });

  return localizedPriceData;
}

export function findHourPrices(priceData: PriceDataInFrontend[]): {
  previousHourPrice: string;
  currentHourPrice: string;
  nextHourPrice: string;
} {
  // Create DateTime object from current time in Finland.
  const currentTimeInFinland: DateTime =
    DateTime.now().setZone("Europe/Helsinki");

  // Find price for previous hour
  const previousHour: PriceDataInFrontend | undefined = priceData.find((hour) =>
    hour.timestamp.equals(
      currentTimeInFinland.startOf("hour").minus({ hours: 1 }),
    ),
  );

  // Find price for current hour
  const currentHour: PriceDataInFrontend | undefined = priceData.find((hour) =>
    hour.timestamp.equals(currentTimeInFinland.startOf("hour")),
  );

  // Find price for next hour
  const nextHour: PriceDataInFrontend | undefined = priceData.find((hour) =>
    hour.timestamp.equals(
      currentTimeInFinland.startOf("hour").plus({ hours: 1 }),
    ),
  );

  return {
    previousHourPrice: previousHour ? previousHour.priceString : "NaN",
    currentHourPrice: currentHour ? currentHour.priceString : "NaN",
    nextHourPrice: nextHour ? nextHour.priceString : "NaN",
  };
}

export function findHighestHourPrice(priceData: PriceDataInFrontend[]): string {
  if (priceData.length === 0) {
    return "NaN";
  }

  const highestPriceHour: PriceDataInFrontend = priceData.reduce(
    (acc, hour) => {
      if (hour.price > acc.price) {
        return hour;
      }

      return acc;
    },
  );

  return highestPriceHour ? highestPriceHour.priceString : "NaN";
}

export function findLowestHourPrice(priceData: PriceDataInFrontend[]): string {
  if (priceData.length === 0) {
    return "NaN";
  }

  const lowestPriceHour: PriceDataInFrontend = priceData.reduce((acc, hour) => {
    if (hour.price < acc.price) {
      return hour;
    }

    return acc;
  });

  return lowestPriceHour ? lowestPriceHour.priceString : "NaN";
}

export function findAverageHourPrice(priceData: PriceDataInFrontend[]): string {
  if (priceData.length === 0) {
    return "NaN";
  }

  const totalHourPrices: number = priceData.reduce((acc, hour) => {
    return acc + hour.price;
  }, 0);

  const averagePrice = totalHourPrices / priceData.length;

  const priceString: string = averagePrice.toFixed(2).toString();

  return priceString ?? "NaN";
}
