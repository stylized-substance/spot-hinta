import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import {
  findAverageHourPrice,
  formatPriceData,
} from "@/app/lib/priceDataProcessor";
import { generatePriceColors } from "@/app/lib/generatePriceColors";
import {
  PriceDataArray,
  PriceDataGroupedByWeek,
  PriceDataInFrontend,
  PricesWithWeeksAndYears,
} from "@/app/types/priceData";
import clsx from "clsx";
import { DateTime } from "luxon";

export default async function WeeklyPrices() {
  // Create DateTime object from current time in Finland. Used for highlighting current hour in table
  const currentTimeInFinland: DateTime =
    DateTime.now().setZone("Europe/Helsinki");

  // Fetch all prices from database
  const priceData: PriceDataArray | [] = await fetchAllPrices();

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Add week number and year properties
  const withWeeksAndYears: PricesWithWeeksAndYears[] = formattedPriceData.map(
    (priceObject) => ({
      ...priceObject,
      year: priceObject.timestamp.year,
      weekNumber: priceObject.timestamp.weekNumber,
    }),
  );

  // Group price data by week
  const pricesGroupedByWeek: PriceDataGroupedByWeek[] = [];

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

  // Add all unique year numbers in price data to array
  const allYears = Array.from(
    new Set(pricesGroupedByWeek.map((priceObject) => priceObject.year)),
  );

  // Add all unique week numbers in price data to array
  const allWeeks = Array.from(
    new Set(pricesGroupedByWeek.map((priceObject) => priceObject.weekNumber)),
  );

  // Build a lookup that matches week numbers and years in data to table cells. Find average hourly price for each week
  const weekYearPrice: Record<number, Record<number, string>> = {};
  for (const week of pricesGroupedByWeek) {
    if (!weekYearPrice[week.weekNumber]) {
      weekYearPrice[week.weekNumber] = {};
    }
    weekYearPrice[week.weekNumber][week.year] = findAverageHourPrice(
      week.prices,
    );
  }

  return (
    <div className="grid place-items-center">
      <h1 className="mb-8 text-2xl font-bold">Average price per week</h1>
      <div className="w-full max-w-2xl">
        <table className="table">
          <thead>
            <th>Week number</th>
            {allYears.map((year) => (
              <th key={year} className="text-right">
                {year}
              </th>
            ))}
          </thead>
          <tbody>
            {allWeeks.map((weekNumber) => {
              const isCurrentWeek = weekNumber === currentTimeInFinland.weekNumber
              return (
              <tr
                className={clsx(
                  isCurrentWeek && "border-info border-2 border-dotted",
                )}
                key={weekNumber}
              >
                <td>{weekNumber}</td>
                {allYears.map((year) => (
                  <td
                    key={year}
                    className={
                      generatePriceColors(weekYearPrice[weekNumber][year]) +
                      " text-right"
                    }
                  >
                    {weekYearPrice[weekNumber][year]}
                  </td>
                ))}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
