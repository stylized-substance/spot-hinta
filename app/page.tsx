import { Suspense } from "react";
import { fetchPrices } from "@/app/lib/fetchPrices";
import {
  formatPriceData,
  findHourPrices,
  findHighestPricedHour,
  findLowestPricedHour,
  findAverageHourPrice,
} from "@/app/lib/priceDataProcessor";
import { formatHours } from "@/app/lib/formatHours";
import { PriceDataArray, PriceDataInFrontend } from "./types/priceData";

export default async function Page() {
  // Fetch electricity prices for last day
  const priceData: PriceDataArray | [] = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Find prices for previous, current and next hour
  const { previousHourPrice, currentHourPrice, nextHourPrice } =
    findHourPrices(formattedPriceData);

  // Find highest, lowest and average hour price today
  const highestPricedHour = findHighestPricedHour(formattedPriceData);
  const lowestPricedHour = findLowestPricedHour(formattedPriceData);
  const averageHourPrice = findAverageHourPrice(formattedPriceData);

  return (
    <>
      <h1 className="mt-6 text-center">Prices - c/kWh</h1>
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
          <div className="stat-value">{averageHourPrice}</div>
        </div>
        {/* Lowest and highest price stat element contents are dynamically rendered. "NaN" is used as fallback*/}
        <div className="stat">
          <div className="stat-title">Highest price today</div>
          {highestPricedHour ? (
            <>
              <div className="stat-value">{highestPricedHour.priceString}</div>
              <div className="stat-desc">
                {formatHours(highestPricedHour.timestamp)}
              </div>
            </>
          ) : (
            <>
              <div className="stat-value">NaN</div>
            </>
          )}
        </div>
        <div className="stat">
          <div className="stat-title">Lowest price today</div>
          {lowestPricedHour ? (
            <>
              <div className="stat-value">{lowestPricedHour.priceString}</div>
              <div className="stat-desc">
                {formatHours(lowestPricedHour.timestamp)}
              </div>
            </>
          ) : (
            <>
              <div className="stat-value">NaN</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
