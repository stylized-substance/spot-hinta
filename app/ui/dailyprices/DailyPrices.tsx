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
    <></>
    // <div className="grid place-items-center">
    //   <h1 className="mb-8 text-2xl font-bold">Average price per week</h1>
    //   <div className="w-full max-w-2xl">
    //     <table className="table">
    //       <thead>
    //         <th>Week number</th>
    //         {allYears.map((year) => (
    //           <th key={year} className="text-right">
    //             {year}
    //           </th>
    //         ))}
    //       </thead>
    //       <tbody>
    //         {allWeeks.map((weekNumber) => (
    //           <tr key={weekNumber}>
    //             <td>{weekNumber}</td>
    //             {allYears.map((year) => (
    //               <td
    //                 key={year}
    //                 className={
    //                   generatePriceColors(weekYearPrice[weekNumber][year]) +
    //                   " text-right"
    //                 }
    //               >
    //                 {weekYearPrice[weekNumber][year]}
    //               </td>
    //             ))}
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}
