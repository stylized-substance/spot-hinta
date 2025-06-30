import LineChart from "@/app/ui/chart/LineChart";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/db/fetchPrices";
import { fetchFingridDataFromApi } from "@/app/lib/fetchFingridDataFromApi";
import {
  localizePriceData,
  formatPricesForLineChart,
} from "@/app/lib/priceDataProcessor";
import { fetchFingridDataFromDb } from "@/app/lib/db/fetchFingridDataFromDb";
import {
  formatElectricityData,
  formatElectricityDataForChart,
} from "@/app/lib/electricityDataProcessor";
import { LineChartData } from "@/app/types/chart/chart";
import {
  DbElectricityDataArray,
  ElectricityDataInFrontend,
} from "@/app/types/fingridData";
import { DateTime } from "luxon";
import {
  dataCombiner,
  filterTo15Minutes,
} from "@/app/lib/apiElectricityDataProcessor";

export default async function ChartWrapper() {
  // Fetch prices for the last day
  const priceData: PriceDataArray = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] =
    localizePriceData(priceData);

  // Format price data for chart
  const pricesForChart: LineChartData =
    formatPricesForLineChart(formattedPriceData);

  // Fetch electricity production data from database for the last day
  const fingridDataFromDb: DbElectricityDataArray =
    await fetchFingridDataFromDb(0);

  // Fetch realtime nuclear energy production data from Fingrid API, starting from midnight today
  // Current UTC time
  const utcTime = DateTime.utc();

  let nuclearEnergyProduction = await fetchFingridDataFromApi(
    undefined,
    utcTime.setZone("Europe/Helsinki").startOf("day").toUTC(),
    utcTime,
    [188],
  );

  // Filter API data to 15 minute intervals to coincide with data from database
  if (nuclearEnergyProduction) {
    nuclearEnergyProduction = filterTo15Minutes(nuclearEnergyProduction);
  }

  // Combine data from database and from API
  const electricityData = nuclearEnergyProduction
    ? dataCombiner(fingridDataFromDb, nuclearEnergyProduction)
    : fingridDataFromDb;

  // Localize electricity production data
  const formattedElectricityData: ElectricityDataInFrontend[] =
    formatElectricityData(electricityData);

  // Format electricity production data for chart
  const electricityDataForChart: LineChartData = formatElectricityDataForChart(
    formattedElectricityData,
  );

  return (
    <>
      <LineChart data={pricesForChart} type={"price"} />
      <LineChart
        data={electricityDataForChart}
        type={"electricityProduction"}
      />
    </>
  );
}
