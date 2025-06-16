import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import { formatPriceData } from "@/app/lib/priceDataProcessor";
import {
  findAverageHourPrice,
} from "@/app/lib/priceDataProcessor";

import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";

export default async function DailyPrices() {
  // Fetch all price data from database
  const priceData: PriceDataArray | [] = await fetchAllPrices();

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  console.log(formattedPriceData);

  const groupedByYear = Object.groupBy(
    formattedPriceData,
    (object) => object.timestamp.year,
  );
  const groupedByDay = Object.groupBy(
    formattedPriceData,
    (object) => object.timestamp.day,
  );

  const dailyAverages: { year: string; month: string; day: string } = [];

  for (let [key, value] of Object.entries(groupedByYear)) {
    if (value) {
      const groupedByMonths = Object.groupBy(
        value,
        (object) => object.timestamp.month,
      );
      for (const [key, value] of Object.entries(groupedByMonths)) {
        if (value) {
          const groupedByDays = Object.groupBy(
            value,
            (object) => object.timestamp.day,
          );
          for (let [key, value] of Object.entries(groupedByDays)) {
            if (value) {
              const averagePrice = findAverageHourPrice(value)
            }
          }
          console.log(groupedByDays);
        }
      }
    }
  }

  // console.log(groupedByYear);
  // console.log(groupedByDay);

  return <></>;
}
