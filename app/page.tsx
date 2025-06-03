import { Suspense } from "react";
import { fetchPrices } from "@/app/lib/fetchPrices";
import { formatPriceData, findHourPrices } from "@/app/lib/priceDataProcessor";
import { PriceDataArray, PriceDataInFrontend } from "./types/priceData";

export default async function Page() {
  // Fetch electricity prices for last day
  const priceData: PriceDataArray | [] = await fetchPrices(1);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Find prices for previous, current and next hour
  const { previousHourPrice, currentHourPrice, nextHourPrice } = findHourPrices(formattedPriceData);

  return (
    <div className="m-6 grid grid-cols-6 justify-items-center">
      <div className="stat">
        <div className="stat-title">Price now</div>
        <div className="stat-value">{currentHourPrice}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Price last hour</div>
        <div className="stat-value">{previousHourPrice}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Price next hour</div>
        <div className="stat-value">{nextHourPrice}</div>
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
