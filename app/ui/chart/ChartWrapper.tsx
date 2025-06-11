import LineChart from "@/app/ui/chart/LineChart";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/db/fetchPrices";
import {
  formatPriceData,
  formatPricesForChart,
} from "@/app/lib/priceDataProcessor";
import { fetchFingridDataFromDb } from "@/app/lib/db/fetchFingridDataFromDb";
import {
  formatDbElectricityData,
  formatDbElectricityDataForChart,
} from "@/app/lib/DbElectricityDataProcessor";
import { ChartData } from "@/app/types/chart/chart";
import {
  DbElectricityDataArray,
  ElectricityDataInFrontend,
} from "@/app/types/fingridData";

export default async function ChartWrapper() {
  // Fetch prices for the last day
  const priceData: PriceDataArray = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Format price data for chart
  const pricesForChart: ChartData = formatPricesForChart(formattedPriceData);

  // Fetch electricity production data for the last day
  const fingridData: DbElectricityDataArray = await fetchFingridDataFromDb(0);

  // Localize electricity production data
  const formattedDbElectricityData: ElectricityDataInFrontend[] =
    formatDbElectricityData(fingridData);

  // Format electricity production data for chart
  const DbElectricityDataForChart: ChartData = formatDbElectricityDataForChart(
    formattedDbElectricityData,
  );

  return (
    <>
      <LineChart data={pricesForChart} type={"price"} />
      <LineChart data={DbElectricityDataForChart} type={"electricityProduction"} />
    </>
  );
}
