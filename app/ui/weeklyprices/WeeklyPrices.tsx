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

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Add week number and year properties
  const withWeeksAndYears = formattedPriceData.map((priceObject) => ({
    ...priceObject,
    year: priceObject.timestamp.year,
    weekNumber: priceObject.timestamp.weekNumber,
  }));

  // Group price data by week
  const pricesGroupedByWeek: PriceDataGrouped[] = [];

  for (const object of withWeeksAndYears) {
    // Find existing week group
    let weekGroup = pricesGroupedByWeek.find(
      (entry) => entry.weekNumber === object.weekNumber,
    );

    // If week group doesn't exist, create it and push to array
    if (!weekGroup) {
      weekGroup = {
        year: object.year,
        weekNumber: object.weekNumber,
        prices: [],
      };
      pricesGroupedByWeek.push(weekGroup);
    }

    // Add prices to week group
    weekGroup.prices.push(object);
  }

  // Calculate average price for each week
  const averagePriceWeeks = pricesGroupedByWeek.map((week) => ({
    year: week.year,
    weekNumber: week.weekNumber,
    averagePrice: findAverageHourPrice(week.prices),
  }));

  // Add week numbers 1-52 to array
  const allWeekNumbers = [...Array(52).keys()].map((i) => i + 1);

  // Add all year numbers in data to array
  const allYears: number[] = [];

  for (const week of averagePriceWeeks) {
    if (week.year && !allYears.includes(week.year)) {
      allYears.push(week.year);
    }
  }
  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">Weekly prices</h1>
      <table className="table">
        <thead>
          {allYears.map((year) => (
            <th key={year}>{year}</th>
          ))}
        </thead>
        <tbody>
          {allWeekNumbers.map((number) => (
            <tr key={number}>
              <td>{number}</td>
            </tr>
          ))}
          {/* {averagePriceWeeks.map((week) => (
            <tr>
              <td>{week.weekNumber}</td>
              <td>{week.averagePrice}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </>
  );
}
