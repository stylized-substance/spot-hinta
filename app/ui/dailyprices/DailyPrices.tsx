import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import { formatPriceData } from "@/app/lib/priceDataProcessor";
import { findAverageHourPrice } from "@/app/lib/priceDataProcessor";
import { GroupedAndAveraged } from "@/app/types/dailyprices/DailyPrices";

import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";

export default async function DailyPrices() {
  // Fetch all price data from database
  const priceData: PriceDataArray | [] = await fetchAllPrices();

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Group prices by year, month and day and find average hourly price for each day
  const grouped = formattedPriceData.reduce(
    (acc: GroupedAndAveraged, current: PriceDataInFrontend) => {
      const { year, month, day } = current.timestamp;

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = {};
      }

      if (!acc[year][month][day]) {
        acc[year][month][day] = { prices: [], averagePrice: "" };
      }

      acc[year][month][day].prices.push(current);

      acc[year][month][day].averagePrice = findAverageHourPrice(
        acc[year][month][day].prices,
      );

      return acc;
    },
    {} as GroupedAndAveraged, // Initial acc
  );

  return <></>;
}
