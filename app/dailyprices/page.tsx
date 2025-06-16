import { Suspense } from "react";
import DailyPrices from "@/app/ui/dailyprices/DailyPrices";

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
        <DailyPrices />
      </Suspense>
    </div>
  );
}
