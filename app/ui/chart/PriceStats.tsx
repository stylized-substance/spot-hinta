export const dynamic = "force-dynamic"

import { formatHours } from "@/app/lib/formatHours";
import { fetchPrices } from "@/app/lib/db/fetchPrices";
import { generatePriceColors } from "@/app/lib/generatePriceColors"
import {
  formatPriceData,
  findHourPrices,
  findHighestPricedHour,
  findLowestPricedHour,
  findAverageHourPrice,
} from "@/app/lib/priceDataProcessor";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";

export default async function PriceStats({}) {
  // Fetch electricity prices for last day
  const priceData: PriceDataArray | [] = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Find prices for previous, current and next hour
  const { previousHourPrice, currentHourPrice, nextHourPrice } = findHourPrices(
    formattedPriceData,
  ) as {
    previousHourPrice: string;
    currentHourPrice: string;
    nextHourPrice: string;
  };

  // Find highest, lowest and average hour price today
  const highestPricedHour: PriceDataInFrontend | undefined =
    findHighestPricedHour(formattedPriceData);
  const lowestPricedHour: PriceDataInFrontend | undefined =
    findLowestPricedHour(formattedPriceData);
  const averageHourPrice: string = findAverageHourPrice(formattedPriceData);
  return (
    <>
      <div className="grid grid-cols-3 justify-items-center md:grid-cols-6">
        <div className="stat">
          <div className="stat-title text-xs md:text-base">Price last hour</div>
          <div className={generatePriceColors(previousHourPrice) + " stat-value"}>{previousHourPrice}</div>
        </div>
        <div className="stat">
          <b className="stat-title text-base-content text-xs md:text-base">
            Price now
          </b>
          <div className={generatePriceColors(currentHourPrice) + " stat-value"}>{currentHourPrice}</div>
        </div>
        <div className="stat">
          <div className="stat-title text-xs md:text-base">Price next hour</div>
          <div className={generatePriceColors(nextHourPrice) + " stat-value"}>{nextHourPrice}</div>
        </div>
        {/* Lowest and highest price stat element contents are dynamically rendered. "NaN" is used as fallback*/}
        <div className="stat">
          <div className="stat-title text-xs md:text-base">Lowest today</div>
          {lowestPricedHour ? (
            <>
              <div className={generatePriceColors(lowestPricedHour.priceString) + " stat-value mt-4"}>
                {lowestPricedHour.priceString}
              </div>
              <div className="stat-desc text-xs md:text-base">
                {formatHours(lowestPricedHour.timestamp)}
              </div>
            </>
          ) : (
            <>
              <div className="stat-value text-xs md:text-base">NaN</div>
            </>
          )}
        </div>
        <div className="stat">
          <div className="stat-title text-xs md:text-base">Highest today</div>
          {highestPricedHour ? (
            <>
              <div className={generatePriceColors(highestPricedHour.priceString) + " stat-value mt-4"}>
                {highestPricedHour.priceString}
              </div>
              <div className="stat-desc text-xs md:text-base">
                {formatHours(highestPricedHour.timestamp)}
              </div>
            </>
          ) : (
            <>
              <div className="stat-value text-xs md:text-base">NaN</div>
            </>
          )}
        </div>

        <div className="stat">
          <div className="stat-title text-xs md:text-base">Average today</div>
          <div className={generatePriceColors(averageHourPrice) + " stat-value"}>{averageHourPrice}</div>
        </div>
      </div>
    </>
  );
}
