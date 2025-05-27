import { DateTime } from "luxon";
import { fetchPrices } from "@/app/lib/fetchPrices";
import { PriceDataArray } from "@/app/lib/types";

export default async function PriceTable() {
  // Fetch prices for the last week
  const priceData: PriceDataArray | [] = await fetchPrices(7);
  console.log(priceData);

  // Add Finnish VAT to prices and round to two decimals
  // Convert timestamps to Finnish timezone
  const localizedPriceData = priceData.map((dataRow) => {
    const price = (Number(dataRow.price) * 1.255).toFixed(2).toString();
    return {
      ...dataRow,
      price: price,
      timestamp: DateTime.fromJSDate(dataRow.timestamp).setZone(
        "Europe/Helsinki",
      ),
    };
  });
  console.log(localizedPriceData);

  function formatTitle() {
    const { timestamp }: { timestamp: Date } = priceData[0];
    return timestamp.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatHours(timestamp: DateTime): string {
    const startHour = timestamp.toFormat("HH:00");
    const endHour = timestamp.plus({ hours: 1 }).toFormat("HH:00");
    return `${startHour} - ${endHour}`;
  }

  if (localizedPriceData.length === 0) {
    return <div>No price data found</div>;
  }

  return (
    <div>
      <h1>{formatTitle()}</h1>
      <h1>Prices include 25.5% VAT</h1>
      <table className="table-zebra table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price - c/kWh</th>
          </tr>
        </thead>
        <tbody>
          {localizedPriceData.map((row) => (
            <tr key={row.id}>
              <td>{formatHours(row.timestamp)}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
