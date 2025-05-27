import { Suspense } from "react";
import PriceTable from "@/app/ui/hourlyprices/PriceTable";

export default async function HourlyPrices() {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        }
      >
        <PriceTable />
      </Suspense>
    </div>
  );
}
