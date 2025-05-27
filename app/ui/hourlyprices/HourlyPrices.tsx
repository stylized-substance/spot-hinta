import { DateTime } from "luxon";
import { fetchPrices } from "@/app/lib/fetchPrices";
import PriceTable from "@/app/ui/hourlyprices/PriceTable";
import {
  PriceDataArray,
  PriceDataInFrontend,
  PriceDataGroupedByDate,
} from "@/app/types/priceData";

// Render hourly electricity price tables grouped by date
export default async function HourlyPrices() {
  // Fetch prices for the last week
  const priceData: PriceDataArray | [] = await fetchPrices(7);

  // Add Finnish VAT to prices and round to two decimals
  // Convert timestamps to Finnish timezone
  const localizedPriceData: PriceDataInFrontend[] = priceData.map((dataRow) => {
    const price = (Number(dataRow.price) * 1.255).toFixed(2).toString();
    return {
      id: dataRow.id,
      timestamp: DateTime.fromJSDate(dataRow.timestamp).setZone(
        "Europe/Helsinki",
      ),
      price: price,
    };
  });

  // Group price data by date and add dateTitle property for comsumption by PriceTable component
  const pricesGroupedByDate: PriceDataGroupedByDate[] = [];

  for (const object of localizedPriceData) {
    const date = object.timestamp.toISODate();
    const dateTitle = object.timestamp.toLocaleString(DateTime.DATE_FULL);

    if (date) {
      // Find existing group in array, add it if not found
      let group = pricesGroupedByDate.find((entry) => entry.date === date);
      if (!group) {
        group = {
          date,
          dateTitle,
          prices: [],
        };
        pricesGroupedByDate.push(group);
      }
      group.prices.push(object);
    }
  }

  if (localizedPriceData.length === 0) {
    return <div>No price data found</div>;
  }

  return (
    <section>
      <h1 className="mt-4 mb-6 me-4 text-end">Prices include 25.5% VAT</h1>
      <div className="grid place-items-center gap-8">
        {pricesGroupedByDate.map((date) => (
          <div key={date.date} className="w-full max-w-2xl">
            <PriceTable data={date} />
          </div>
        ))}
      </div>
    </section>
  );
}
