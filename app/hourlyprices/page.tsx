export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HourlyPrices from "@/app/ui/hourlyprices/HourlyPrices";
import { PriceDataArray } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/db/fetchPrices";

export default async function Page() {
  // Fetch prices for the last week
  const prices: Promise<PriceDataArray | []> = fetchPrices(7);

  return (
    <div>
      <Suspense
        fallback={
          <div>
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        }
      >
        <HourlyPrices prices={prices} />
      </Suspense>
    </div>
  );
}
