export const dynamic = "force-dynamic"

import { Suspense } from "react";
import WeeklyPrices from "@/app/ui/weeklyprices/WeeklyPrices";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <WeeklyPrices />
    </Suspense>
  );
}
