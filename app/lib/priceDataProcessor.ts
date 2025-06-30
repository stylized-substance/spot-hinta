import { DateTime } from "luxon";
import { PriceDataArray, PriceDataGroupedHourly, PriceDataInFrontend } from "../types/priceData";
import { LineChartData } from "@/app/types/chart/chart";

// Utility functions for processing price data
export function localizePriceData(
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
    DateTime.utc().setZone("Europe/Helsinki");

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

export function findHighestPricedHour(
  priceData: PriceDataInFrontend[],
): PriceDataInFrontend | undefined {
  if (priceData.length === 0) {
    return undefined;
  }

  const highestPricedHour: PriceDataInFrontend = priceData.reduce(
    (acc, hour) => {
      if (hour.price > acc.price) {
        return hour;
      }

      return acc;
    },
  );

  return highestPricedHour;
}

export function findLowestPricedHour(
  priceData: PriceDataInFrontend[],
): PriceDataInFrontend | undefined {
  if (priceData.length === 0) {
    return undefined;
  }

  const lowestPricedHour: PriceDataInFrontend = priceData.reduce(
    (acc, hour) => {
      if (hour.price < acc.price) {
        return hour;
      }

      return acc;
    },
  );

  return lowestPricedHour;
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

// Format price data for rendering in nivo line chart
export function formatPricesForLineChart(
  priceData: PriceDataInFrontend[],
): LineChartData {
  return [
    {
      id: "Electricity price",
      data: priceData.map((hour) => ({
        x: hour.timestamp.toJSDate(),
        y: hour.price,
      })),
    },
  ];
}

export function formatPricesForTable(priceData: PriceDataInFrontend[]) {
  // Group price data by date and add dateTitle property for comsumption by PriceTable component
  const pricesForTable: PriceDataGroupedHourly[] = [];

  for (const object of priceData) {
    const date = object.timestamp.toISODate();
    const dateTitle = object.timestamp.toLocaleString(DateTime.DATE_FULL);

    if (date) {
      // Find existing group in array, add it if not found
      let group = pricesForTable.find((entry) => entry.date === date);
      if (!group) {
        group = {
          date,
          dateTitle,
          prices: [],
        };
        pricesForTable.push(group);
      }

      // Add prices to group and hours in descending order
      group.prices.push(object);
      group.prices.sort(
        (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis(),
      );
    }
  }

  // Sort date groups in descending order
  pricesForTable.sort(
    (a, b) =>
      new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
  );

  return pricesForTable
}
