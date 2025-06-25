import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import { generatePriceColors } from "@/app/lib/generatePriceColors";
import { formatPriceData } from "@/app/lib/priceDataProcessor";
import { findAverageHourPrice } from "@/app/lib/priceDataProcessor";
import { GroupedAndAveraged } from "@/app/types/dailyprices/DailyPrices";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";
import clsx from "clsx";
import { DateTime } from "luxon";

export default async function DailyPrices() {
  // Create DateTime object from current time in Finland. Used for highlighting current day in table
  const currentTimeInFinland: DateTime =
    DateTime.now().setZone("Europe/Helsinki");

  // Fetch all price data from database
  const priceData: PriceDataArray | [] = await fetchAllPrices();

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Group prices by year, month and day and find average hourly price for each day
  const groupedAndAveraged = formattedPriceData.reduce(
    (acc: GroupedAndAveraged, current: PriceDataInFrontend) => {
      const { year, day } = current.timestamp;
      const month = current.timestamp.monthLong ?? "Unknown";

      // Find or create year, month, day
      const yearObject = acc.find((y) => y.year === year);
      if (!yearObject) {
        acc.push({
          year: year,
          data: [],
        });
      }

      const monthObject = yearObject?.data.find((m) => m.month === month);
      if (!monthObject) {
        yearObject?.data.push({
          month: month,
          data: [],
        });
      }

      const dayObject = monthObject?.data.find((d) => d.day === day);
      if (!dayObject) {
        monthObject?.data.push({
          day: day,
          data: {
            prices: [],
            averagePrice: "",
          },
        });
      }

      if (dayObject) {
        dayObject.data.prices.push(current);
        dayObject.data.averagePrice = findAverageHourPrice(
          dayObject?.data.prices,
        );
      }

      return acc;
    },
    [] as GroupedAndAveraged, // Initial acc
  );

  return (
    <div className="grid place-items-center">
      <h1 className="mb-8 text-2xl font-bold">Average price per day</h1>
      <div className="w-full max-w-2xl">
        {groupedAndAveraged.map((year) => {
          // Get unique months and years for this day
          const months = year.data.map((m) => m.month);
          const allDaysSet = new Set<number>();
          for (const month of year.data) {
            for (const day of month.data) {
              allDaysSet.add(day.day);
            }
          }

          const allDays = Array.from(allDaysSet).sort((a, b) => a - b);

          return (
            <div key={year.year}>
              <h2 className="mb-4 text-center text-2xl font-bold">
                {year.year}
              </h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Day</th>
                    {months.map((month) => (
                      <th key={month} className="text-right">
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allDays.map((dayNumber) => {
                    const isCurrentDay = dayNumber === currentTimeInFinland.day;
                    return (
                      <tr
                        className={clsx(
                          isCurrentDay && "border-info border-2 border-dotted",
                        )}
                        key={dayNumber}
                      >
                        <td>{dayNumber}</td>
                        {months.map((month) => {
                          const monthObject = year.data.find(
                            (m) => m.month === month,
                          );
                          const dayObject = monthObject?.data.find(
                            (d) => d.day === dayNumber,
                          );
                          return (
                            <td
                              key={month}
                              className={
                                dayObject
                                  ? generatePriceColors(
                                      dayObject.data.averagePrice,
                                    ) + " text-right"
                                  : "text-right"
                              }
                            >
                              {dayObject?.data.averagePrice}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
