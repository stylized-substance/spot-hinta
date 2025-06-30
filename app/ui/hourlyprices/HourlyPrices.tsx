"use client";

import { DateTime } from "luxon";
import { fetchPrices } from "@/app/lib/db/fetchPrices";
import {
  formatPricesForTable,
  localizePriceData,
} from "@/app/lib/priceDataProcessor";
import PriceTable from "@/app/ui/hourlyprices/PriceTable";
import PriceBarChart from "@/app/ui/PriceBarChart";
import {
  PriceDataArray,
  PriceDataInFrontend,
  PriceDataGroupedHourly,
} from "@/app/types/priceData";
import { use, useState } from "react";

// Render hourly electricity price tables grouped by date
export default async function HourlyPrices({
  prices,
}: {
  prices: Promise<PriceDataArray | []>;
}) {
  const [viewType, setViewType] = useState<"table" | "barChart">("table");

  // Read promise passed from parent component
  const priceData = use(prices);

  // Localize price data
  const localizedPriceData: PriceDataInFrontend[] =
    localizePriceData(priceData);

  // Format prices for table
  const pricesForTable = formatPricesForTable(localizedPriceData);

  if (localizedPriceData.length === 0) {
    return <div>No price data found</div>;
  }

  return (
    <section>
      <div className="grid place-items-center gap-8">
        {pricesForTable.map((date) => (
          <div key={date.date} className="w-full max-w-2xl">
            {viewType === "table" ? (
              <PriceTable data={date} />
            ) : (
              <></>
              // <PriceBarChart data={date} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
