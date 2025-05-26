import { fetchPrices } from "@/app/lib/fetchPrices";
import { PriceDataArray } from "@/app/lib/types";
import { Suspense } from "react";

async function PriceTable() {
  // Fetch prices for the last week
  const priceData: PriceDataArray | [] = await fetchPrices(7);

  // Add Finnish VAT to prices and round to two decimals
  const pricesWithVAT: PriceDataArray = priceData.map((dataRow) => {
    const price = (Number(dataRow.price) * 1.255).toFixed(2).toString();
    return {
      ...dataRow,
      price: price,
    };
  });

  function formatTitle() {
    const { timestamp }: { timestamp: Date } = priceData[0];
    return timestamp.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatHours(timestamp: Date): string {
    const startHour = `${timestamp.getUTCHours().toString().padStart(2, "0")}:00`;
    // Hour is wrapped  with modulo to hack hour number '24' into '00'
    const endHour = `${((timestamp.getUTCHours() + 1) % 24).toString().padStart(2, "0")}:00`;
    return `${startHour} - ${endHour}`;
  }

  if (pricesWithVAT.length === 0) {
    return <div>No price data found</div>;
  }

  return (
    <div>
      <h1>{formatTitle()}</h1>
      <table className="table-zebra table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price with 25.5% VAT - c/kWh</th>
          </tr>
        </thead>
        <tbody>
          {pricesWithVAT.map((row) => (
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

export default async function HourlyPrices() {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <div>Loading...</div>
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        }
      >
        <PriceTable />
      </Suspense>
    </div>
  );
}
