import { DateTime } from "luxon";
import {
  DbElectricityDataArray,
  ElectricityDataInFrontend,
  CombinedElectricityProductionDataArray
} from "../types/fingridData";
import { ChartData } from "@/app/types/chart/chart";

// Utility functions for processing electricity production data
export function formatDbElectricityData(
  powerData: CombinedElectricityProductionDataArray,
): ElectricityDataInFrontend[] {
  // Convert start and end times to Finnish timezone
  const localizedDbElectricityData = powerData.map((dataRow) => ({
    startTime: DateTime.fromJSDate(dataRow.starttime).setZone(
      "Europe/Helsinki",
    ),
    endTime: DateTime.fromJSDate(dataRow.endtime).setZone("Europe/Helsinki"),
    consumption: parseInt(dataRow.consumption),
    production_total: parseInt(dataRow.production_total),
    production_wind: parseInt(dataRow.production_wind),
    production_solar: parseInt(dataRow.production_solar),
    production_nuclear: dataRow.production_nuclear
  }));

  return localizedDbElectricityData;
}

// Format electricity production data for rendering in nivo line chart
export function formatDbElectricityDataForChart(
  powerData: ElectricityDataInFrontend[],
): ChartData {
  console.log(powerData)
  // Loop through electricity production data types and, build ChartData objects for each type and return as an array of arrays

  // Define only the data type keys
  type DatatypeKey =
    | "consumption"
    | "production_total"
    | "production_wind"
    | "production_solar"
    | "production_nuclear"

  const keys: DatatypeKey[] = [
    "consumption",
    "production_total",
    "production_wind",
    "production_solar",
    "production_nuclear"
  ];

  // Map friendly names to electricity production data types
  const friendlyNames: Record<DatatypeKey, string> = {
    consumption: "Total electricity consumption",
    production_total:
      "Total electricity production",
    production_wind: "Wind power generation",
    production_solar: "Solar power generation",
    production_nuclear: "Nuclear power generation"
  };

  const dataArray: ChartData = [];

  for (const key of keys) {
    dataArray.push(
      {
        id: friendlyNames[key],
        data: powerData.map((dataRow) => ({
          x: dataRow.startTime.toJSDate(),
          y: dataRow[key] ?? 0,
        })),
      },
    );
  }

  return dataArray;
}
