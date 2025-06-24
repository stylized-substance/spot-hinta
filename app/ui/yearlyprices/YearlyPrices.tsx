import { fetchAllPrices } from "@/app/lib/db/fetchPrices";
import {
  findAverageHourPrice,
  formatPriceData,
} from "@/app/lib/priceDataProcessor";
import { generatePriceColors } from "@/app/lib/generatePriceColors";
import {
  PriceDataArray,
  PriceDataInFrontend,
} from "@/app/types/priceData";

export default async function YearlyPrices() {
  // Fetch all price data from database
  const priceData: PriceDataArray | [] = await fetchAllPrices();

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Group prices by year
  const groupedByYear = Object.groupBy(
    formattedPriceData,
    (object) => object.timestamp.year,
  );

  // Calculate average price for each year and push to array
  const yearlyAverages: { year: string; averagePrice: string }[] = [];

  for (const [key, values] of Object.entries(groupedByYear)) {
    if (values) {
      yearlyAverages.push({
        year: key,
        averagePrice: findAverageHourPrice(values),
      });
    }
  }

  return (
    <div className="grid place-items-center">
      <h1 className="mb-8 text-2xl font-bold">Average price per year</h1>
      <div className="w-full max-w-2xl">
        <table className="table">
          <thead>
            <tr>
              <th>Year</th>
              <th className="text-right">Average Price</th>
            </tr>
          </thead>
          <tbody>
            {yearlyAverages.map(({ year, averagePrice }) => (
              <tr key={year}>
                <td>{year}</td>
                <td
                  className={
                    generatePriceColors(averagePrice) + " text-right"
                  }
                >
                  {averagePrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
