import LineChart from "@/app/ui/chart/LineChart";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/fetchPrices";
import {
  formatPriceData,
  formatPricesForChart,
} from "@/app/lib/priceDataProcessor";
import { fetchFingridData } from "@/app/lib/fetchFingridData";
import {
  formatPowerForecastData,
  formatPowerForecastDataForChart,
} from "@/app/lib/powerForecastDataProcessor";
import { ChartData } from "../types/chart/chart";
import {
  ForecastDataArray,
  ForecastDataInFrontend,
} from "../types/fingridData";

export default async function Page() {
  // Fetch prices for the last day
  const priceData: PriceDataArray = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Format price data for chart
  const pricesForChart: ChartData = formatPricesForChart(formattedPriceData);

  // Fetch power forecast data for the last day
  const fingridData: ForecastDataArray = await fetchFingridData(0);

  // Localize power forecast data
  const formattedPowerForecastData: ForecastDataInFrontend[] =
    formatPowerForecastData(fingridData);

  // Format power forecast data for chart
  const powerForecastDataForChart: ChartData = formatPowerForecastDataForChart(
    formattedPowerForecastData,
  );

  return (
    <div className="grid justify-items-center">
      <LineChart data={pricesForChart} type={"price"} />
      <LineChart data={powerForecastDataForChart} type={"powerForecast"} />
    </div>
  );
}
