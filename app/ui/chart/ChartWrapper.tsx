import LineChart from "@/app/ui/chart/LineChart";
import { PriceDataArray, PriceDataInFrontend } from "@/app/types/priceData";
import { fetchPrices } from "@/app/lib/db/fetchPrices";
import { fetchFingridDataFromApi } from "@/app/lib/fetchFingridDataFromApi";
import {
  formatPriceData,
  formatPricesForChart,
} from "@/app/lib/priceDataProcessor";
import { fetchFingridDataFromDb } from "@/app/lib/db/fetchFingridDataFromDb";
import {
  formatDbElectricityData,
  formatDbElectricityDataForChart,
} from "@/app/lib/dElectricityDataProcessor";
import { ChartData } from "@/app/types/chart/chart";
import {
  ApiElectricityDataArray,
  DbElectricityDataArray,
  ElectricityDataInFrontend,
} from "@/app/types/fingridData";
import { DateTime } from "luxon";
import { dataCombiner, filterTo15Minutes } from "@/app/lib/apiElectricityDataProcessor";

export default async function ChartWrapper() {
  // Fetch prices for the last day
  const priceData: PriceDataArray = await fetchPrices(0);

  // Localize price data
  const formattedPriceData: PriceDataInFrontend[] = formatPriceData(priceData);

  // Format price data for chart
  const pricesForChart: ChartData = formatPricesForChart(formattedPriceData);

  // Fetch electricity production data from database for the last day
  const fingridDataFromDb: DbElectricityDataArray =
    await fetchFingridDataFromDb(0);

  // Fetch realtime nuclear energy production data from Fingrid API, starting from midnight today
  // Current UTC time
  const utcTime = DateTime.utc();
  const nuclearEnergyProduction: ApiElectricityDataArray =
    await fetchFingridDataFromApi(
      undefined,
      utcTime.setZone("Europe/Helsinki").startOf("day").toUTC(),
      utcTime,
      [188],
    );

  // Filter API data to 15 minute intervals to coincide with data from database
  const filteredTo15minutes = filterTo15Minutes(nuclearEnergyProduction);

  // Combine data from database and from API
  const combinedElectricityData = dataCombiner(
    fingridDataFromDb,
    filteredTo15minutes,
  );

  // Localize electricity production data
  const formattedDbElectricityData: ElectricityDataInFrontend[] =
  formatDbElectricityData(combinedElectricityData);
  
  // Format electricity production data for chart
  const dbElectricityDataForChart: ChartData = formatDbElectricityDataForChart(
    formattedDbElectricityData,
  );

  return (
    <>
      <LineChart data={pricesForChart} type={"price"} />
      <LineChart
        data={dbElectricityDataForChart}
        type={"electricityProduction"}
      />
    </>
  );
}
