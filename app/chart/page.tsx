import LineChart from "@/app/ui/chart/LineChart";
import { PriceDataArray } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/fetchPrices";
import { formatPricesForChart } from "@/app/lib/priceDataProcessor"

export default async function Page() {
  // Fetch prices for the last week
  const priceData: PriceDataArray | [] = await fetchPrices(1);

  // Format price data for chart
  const formattedData = formatPricesForChart(priceData)

  return (
    <>
      <LineChart data={formattedData} />
    </>
  );
}
