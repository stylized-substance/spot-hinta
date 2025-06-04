import LineChart from "@/app/ui/chart/LineChart";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/fetchPrices";
import { formatPriceData, formatPricesForChart } from "@/app/lib/priceDataProcessor";

export default async function Page() {
  // Fetch prices for the last week
  const priceData: PriceDataArray | [] = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Format price data for chart
  const formattedData = formatPricesForChart(formattedPriceData);

  return (
    <div className="grid justify-items-center">
      <LineChart data={formattedData} />
    </div>
  );
}
