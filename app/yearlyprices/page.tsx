export const experimental_ppr = true

import { Suspense } from "react";
import YearlyPrices from "@/app/ui/yearlyprices/YearlyPrices";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <YearlyPrices />
    </Suspense>
  );
}
