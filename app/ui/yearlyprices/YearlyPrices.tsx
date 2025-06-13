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

  const calculateYearlyAverages = (
    formattedPriceData: PriceDataInFrontend[],
  ) => {
    const averages = Object.values(
      formattedPriceData.reduce(
        (acc, item) => {
          const year = item.timestamp.year;
          if (!acc[year]) {
            acc[year] = { year, total: 0, count: 0 };
          }
          acc[year].total += item.price;
          acc[year].count += 1;
          return acc;
        },
        {} as Record<number, { year: number; total: number; count: number }>,
      ),
    ).map(({ year, total, count }) => ({
      year,
      averagePrice: (total / count).toFixed(2),
    }));

    return averages;
  };

  const averages = calculateYearlyAverages(formattedPriceData);
  console.log(formattedPriceData);
  console.log(averages);

  return (
    <div className="grid place-items-center">
      <h1 className="mb-8 text-2xl font-bold">Average price per year</h1>
      <div className="w-full max-w-2xl">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Average Price</th>
            </tr>
          </thead>
          <tbody>
            {averages.map(({ year, averagePrice }) => (
              <tr key={year}>
                <td>{year}</td>
                <td>{averagePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
