import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import {
  findAverageHourPrice,
  formatPriceData,
} from "@/app/lib/priceDataProcessor";
import { generatePriceColors } from "@/app/lib/generatePriceColors";
import {
  PriceDataArray,
  PriceDataGroupedByTimespan,
  PriceDataInFrontend,
  PricesWithWeeksAndYears,
} from "@/app/types/priceData";

export default async function YearlyPrices() {
  // Fetch all price data from database
  const priceData: PriceDataArray | [] = await fetchAllPrices();

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  function addWeeksAndYears(formattedPriceData: PriceDataInFrontend[]) {
    return formattedPriceData.map((priceObject) => ({
      ...priceObject,
      year: priceObject.timestamp.year,
      weekNumber: priceObject.timestamp.weekNumber,
    }));
  }

  // Group price data by year
  function groupPrices(
    prices: PricesWithWeeksAndYears[],
    timespan: "week" | "year",
  ) {
    // Group price data by timespan
    const pricesGrouped: PriceDataGroupedByTimespan[] = [];

    for (const object of prices) {
      // Find existing price group
      let group;

      // Define timespna to group prices by
      switch (timespan) {
        case "week":
          group = pricesGrouped.find(
            (entry) => entry.weekNumber === object.weekNumber,
          );
          break;
        case "year":
          group = pricesGrouped.find((entry) => entry.year === object.year);
          break;
        default:
          const _exhaustiveCheck: never = timespan;
          return _exhaustiveCheck;
      }

      // If price group doesn't exist, create it and push to array
      if (!group) {
        group = {
          year: object.year,
          weekNumber: object.weekNumber,
          prices: [],
        };
        pricesGrouped.push(group);
      }

      // Add prices to price group
      group.prices.push(object);
    }
    return pricesGrouped;
    //   switch (timespan) {
    //     // Group price data by week
    //     case "week": {
    //       const pricesGroupedByWeek: PriceDataGroupedByTimespan[] = [];
    //       for (const object of prices) {
    //         // Find existing week group
    //         let weekGroup = pricesGroupedByWeek.find(
    //           (entry) => entry.weekNumber === object.weekNumber,
    //         );

    //         // If week group doesn't exist, create it and push to array
    //         if (!weekGroup) {
    //           weekGroup = {
    //             year: object.year,
    //             weekNumber: object.weekNumber,
    //             prices: [],
    //           };
    //           pricesGroupedByWeek.push(weekGroup);
    //         }

    //         // Add prices to week group
    //         weekGroup.prices.push(object);
    //       }
    //       return pricesGroupedByWeek;
    //     }
    //     // Group price data by year
    //     case "year": {
    //       const pricesGroupedByYear: PriceDataGroupedByTimespan[] = [];
    //       for (const object of prices) {
    //         // Find existing year group
    //         let yearGroup = pricesGroupedByYear.find(
    //           (entry) => entry.year === object.year,
    //         );

    //         // If year group doesn't exist, create it and push to array
    //         if (!yearGroup) {
    //           yearGroup = {
    //             year: object.year,
    //             weekNumber: object.weekNumber,
    //             prices: [],
    //           };
    //           pricesGroupedByYear.push(yearGroup);
    //         }

    //         // Add prices to year group
    //         yearGroup.prices.push(object);
    //       }
    //       return pricesGroupedByYear;
    //     }
    //     default: {
    //       const _exhaustiveCheck: never = timespan;
    //       return _exhaustiveCheck;
    //     }
    //   }
  }

  // Add week number and year properties
  const withWeeksAndYears: PricesWithWeeksAndYears[] =
    addWeeksAndYears(formattedPriceData);

  // Group price data by year
  const pricesGrouped: PriceDataGroupedByTimespan[] = groupPrices(
    withWeeksAndYears,
    "week",
  );

  // Add all unique year numbers in price data to array
  const allYears = Array.from(
    new Set(pricesGrouped.map((priceObject) => priceObject.year)),
  );

  // Add all unique week numbers in price data to array
  const allWeeks = Array.from(
    new Set(pricesGrouped.map((priceObject) => priceObject.weekNumber)),
  );

  // Build a lookup that matches week numbers and years in data to table cells. Find average hourly price for each year
  const weekYearPrice: Record<number, Record<number, string>> = {};
  for (const year of pricesGrouped) {
    if (!weekYearPrice[year.weekNumber]) {
      weekYearPrice[year.weekNumber] = {};
    }
    weekYearPrice[year.weekNumber][year.year] = findAverageHourPrice(
      year.prices,
    );
  }

  return (
    <div className="grid place-items-center">
      <h1 className="mb-8 text-2xl font-bold">Average price per year</h1>
      <div className="w-full max-w-2xl">
        <table className="table">
          <thead>
            <th>Year</th>
            <th>Price - c/kWh</th>
          </thead>
          <tbody>
            {allYears.map((year) => (
              <tr key={year}>
                <td>{year}</td>
                {/* {allYears.map((year) => (
                  <td
                    key={year}
                    className={
                      generatePriceColors(
                        Number(weekYearPrice[weekNumber][year]),
                      ) + " text-right"
                    }
                  >
                    {weekYearPrice[weekNumber][year]}
                  </td>
                ))} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
