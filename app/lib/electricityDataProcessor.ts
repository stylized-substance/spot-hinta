import { DateTime } from "luxon";
import {
  ElectricityDataInFrontend,
  CombinedElectricityProductionDataArray,
} from "../types/fingridData";
import { LineChartData } from "@/app/types/chart/chart";

// Utility functions for processing electricity production data
export function formatElectricityData(
  electricityData: CombinedElectricityProductionDataArray,
): ElectricityDataInFrontend[] {
  // Convert start and end times to Finnish timezone
  const localizedDbElectricityData = electricityData.map((dataRow) => ({
    startTime: DateTime.fromJSDate(dataRow.starttime).setZone(
      "Europe/Helsinki",
    ),
    endTime: DateTime.fromJSDate(dataRow.endtime).setZone("Europe/Helsinki"),
    consumption: parseInt(dataRow.consumption),
    production_total: parseInt(dataRow.production_total),
    production_wind: parseInt(dataRow.production_wind),
    production_solar: parseInt(dataRow.production_solar),
    ...("production_nuclear" in dataRow
      ? { production_nuclear: dataRow.production_nuclear }
      : {}),
  }));

  return localizedDbElectricityData;
}

// Format electricity production data for rendering in nivo line chart
export function formatElectricityDataForChart(
  electricityData: ElectricityDataInFrontend[],
): LineChartData {
  // Loop through electricity production data types and, build LineChartData objects for each type and return as an array of arrays

  // Define only the data type keys
  type DatatypeKey =
    | "consumption"
    | "production_total"
    | "production_wind"
    | "production_solar"
    | "production_nuclear";

  const keys: DatatypeKey[] = [
    "consumption",
    "production_total",
    "production_wind",
    "production_solar",
    "production_nuclear",
  ];

  // Map friendly names to electricity production data types
  const friendlyNames: Record<DatatypeKey, string> = {
    consumption: "Total electricity consumption",
    production_total: "Total electricity production",
    production_wind: "Wind power generation",
    production_solar: "Solar power generation",
    production_nuclear: "Nuclear power generation",
  };

  const dataArray: LineChartData = [];

  for (const key of keys) {
    dataArray.push({
      id: friendlyNames[key],
      data: electricityData
        // Filter out null values
        .filter((dataRow) => dataRow[key] !== null)
        .map((dataRow) => {
          return {
            x: dataRow.startTime.toJSDate(),
            y: dataRow[key] ?? 0,
          };
        }),
    });
  }

  return dataArray;
}
