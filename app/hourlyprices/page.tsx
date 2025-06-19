export const experimental_ppr = true

import { Suspense } from "react";
import HourlyPrices from "@/app/ui/hourlyprices/HourlyPrices";

export default async function Page() {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        }
      >
        <HourlyPrices />
      </Suspense>
    </div>
  );
}
