import { Suspense } from "react";
import PriceStats from "@/app/ui/chart/PriceStats";
import ChartWrapper from "@/app/ui/chart/ChartWrapper";

export default async function Page() {
  return (
    <div className="grid justify-items-center gap-12">
      <Suspense
        fallback={
          <div>
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        }
      >
        <PriceStats />
      </Suspense>
      <Suspense
        fallback={
          <div>
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        }
      >
        <ChartWrapper />
      </Suspense>
    </div>
  );
}
