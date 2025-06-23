export const experimental_ppr = true;

import { Suspense } from "react";
import PriceStats from "@/app/ui/chart/PriceStats";
import ChartWrapper from "@/app/ui/chart/ChartWrapper";
import { DateTime } from "luxon";

const now = DateTime.utc().toISO();

export default async function Page() {
  return (
    <>
      <div className="me-4 text-end text-xs md:text-base">
        Page rendered at {now}
      </div>
      <div className="grid justify-items-center">
        <Suspense
          fallback={
            <div>
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          }
        >
          <div className="me-4 text-xs md:text-base">Rendered at {now}</div>
          <PriceStats />
        </Suspense>
        <Suspense
          fallback={
            <div>
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          }
        >
          <div className="me-4 text-xs md:text-base">Rendered at {now}</div>
          <ChartWrapper />
        </Suspense>
      </div>
    </>
  );
}
