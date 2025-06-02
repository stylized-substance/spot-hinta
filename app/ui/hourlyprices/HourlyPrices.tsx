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
  // Create DateTime object from current time in Finland. Used for highlighting current hour in PriceTable component
  const currentTimeInFinland = DateTime.now().setZone("Europe/Helsinki");

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

      // Add prices to group and hours in descending order
      group.prices.push(object);
      group.prices.sort(
        (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis(),
      );
    }
  }

  // Sort date groups in descending order
  pricesGroupedByDate.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (localizedPriceData.length === 0) {
    return <div>No price data found</div>;
  }

  return (
    <section>
      <h1 className="me-4 mt-4 mb-6 text-end">Prices include 25.5% VAT</h1>
      <div className="grid place-items-center gap-8">
        {pricesGroupedByDate.map((date) => (
          <div key={date.date} className="w-full max-w-2xl">
            <PriceTable
              data={date}
              currentTimeInFinland={currentTimeInFinland}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
