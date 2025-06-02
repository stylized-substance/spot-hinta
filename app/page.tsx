import { Suspense } from "react";
import { fetchPrices } from "@/app/lib/fetchPrices";
import { PriceDataArray, PriceDataInFrontend } from "./types/priceData";
import { DateTime } from "luxon";

export default async function Page() {
  // Create DateTime object from current time in Finland. Used for highlighting current hour in PriceTable component
  const currentTimeInFinland = DateTime.now().setZone("Europe/Helsinki");

  // Fetch electricity prices for last day
  const priceData: PriceDataArray | [] = await fetchPrices(1);

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

  // Find price for the current hour
  const currentHour = localizedPriceData.find((hour) =>
    hour.timestamp.equals(currentTimeInFinland.startOf("hour")),
  );
  const currentPrice = currentHour ? String(currentHour.price) : "NaN";

  return (
    <div className="m-6 grid grid-cols-6 justify-items-center">
      <div className="stat">
        <div className="stat-title">Price now</div>
        <div className="stat-value">{currentPrice}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Price last hour</div>
        <div className="stat-value">123</div>
      </div>
      <div className="stat">
        <div className="stat-title">Price next hour</div>
        <div className="stat-value">123</div>
      </div>
      <div className="stat">
        <div className="stat-title">Average price today</div>
        <div className="stat-value">123</div>
      </div>
      <div className="stat">
        <div className="stat-title">Highest price today</div>
        <div className="stat-value">123</div>
      </div>
      <div className="stat">
        <div className="stat-title">Lowest price today</div>
        <div className="stat-value">123</div>
      </div>
    </div>
  );
}
