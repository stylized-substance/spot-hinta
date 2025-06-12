import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import {
  findAverageHourPrice,
  formatPriceData,
} from "@/app/lib/priceDataProcessor";
import {
  PriceDataArray,
  PriceDataGrouped,
  PriceDataInFrontend,
} from "@/app/types/priceData";
import { DateTime } from "luxon";

export default async function WeeklyPrices() {
  // Fetch prices for the last week
  const priceData: PriceDataArray | [] = await fetchAllPrices();
  // console.log(priceData);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Group price data by year
  let pricesGroupedByYear: {
    year: number;
    pricesGroupedByWeek: PriceDataInFrontend[];
  }[] = []

  const pricesGroupedByWeek: PriceDataGrouped[] = [];

  for (const object of formattedPriceData) {
    // const weekNumber = object.timestamp.weekNumber;
    const year = object.timestamp.year

    if (object.timestamp) {
      // Find existing group in array, add it if not found
      let group = pricesGroupedByYear.find(
        (entry) => entry.year === year,
      );
      if (!group) {
        group = {
          year,
          pricesGroupedByWeek: [],
        };
        pricesGroupedByYear.push(group);
      }

      group.pricesGroupedByWeek.push(object);
    }
  }

  // Group price data by week
  pricesGroupedByYear = pricesGroupedByYear.map((year) => {
    return {
      year,
      pricesGroupedByWeek: pricesGroupedByWeek.map(())
    }
  })
  // for (const object of pricesGroupedByYear.pricesGroupedByWeek) {

  //   if (object.timestamp) {
  //     // Find existing group in array, add it if not found
  //     let group = pricesGroupedByWeek.find(
  //       (entry) => entry.weekNumber === weekNumber,
  //     );
  //     if (!group) {
  //       group = {
  //         weekNumber,
  //         prices: [],
  //       };
  //       pricesGroupedByWeek.push(group);
  //     }

  //     group.prices.push(object);
  //   }

  console.log(pricesGroupedByYear)

  // Calculate average price for each week
  const averagePriceWeeks = pricesGroupedByWeek.map((week) => ({
    weekNumber: week.weekNumber,
    averagePrice: findAverageHourPrice(week.prices),
  }));

  // Grouup weeks by year
  // const weeksGroupedByYear = averagePriceWeeks.
  // console.log(averagePriceWeeks);

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">Weekly prices</h1>
      <table className="table">
        <thead>
          <th>Week number</th>
          <th>Average price - c/kWh</th>
        </thead>
        <tbody>
          {averagePriceWeeks.map((week) => (
            <tr>
              <td>{week.weekNumber}</td>
              <td>{week.averagePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
