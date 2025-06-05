import { DateTime } from "luxon";
import {
  ForecastDataArray,
  ForecastDataInFrontend,
} from "../types/fingridData";
import { ChartData } from "@/app/types/chart/chart";

// Utility functions for processing power forecast data
export function formatPowerForecastData(
  powerForecastData: ForecastDataArray,
): ForecastDataInFrontend[] {
  // Convert start and end times to Finnish timezone
  const localizedPowerForecastData = powerForecastData.map((dataRow) => ({
    id: dataRow.id,
    startTime: DateTime.fromJSDate(dataRow.starttime).setZone(
      "Europe/Helsinki",
    ),
    endTime: DateTime.fromJSDate(dataRow.endtime).setZone("Europe/Helsinki"),
    consumption: parseInt(dataRow.consumption),
    production_total: parseInt(dataRow.production_total),
    production_wind: parseInt(dataRow.production_wind),
    production_solar: parseInt(dataRow.production_solar),
  }));

  return localizedPowerForecastData;
}

// Format power forecast data for rendering in nivo line chart
export function formatPowerForecastDataForChart(
  powerForecastData: ForecastDataInFrontend[],
): ChartData[] {
  // Loop through forecast data types and, build ChartData objects for each type and return as an array of arrays

  // Define only the data type keys
  type ForecastKey =
    | "consumption"
    | "production_total"
    | "production_wind"
    | "production_solar";

  const keys: ForecastKey[] = [
    "consumption",
    "production_total",
    "production_wind",
    "production_solar",
  ];

  // Map friendly names to forecast data types
  const friendlyNames: Record<ForecastKey, string> = {
    consumption: "Electricity consumption forecast",
    production_total:
      "Electricity production prediction",
    production_wind: "Wind power generation forecast",
    production_solar: "Solar power generation forecast",
  };

  const dataArray = [];

  for (const key of keys) {
    dataArray.push([
      {
        id: friendlyNames[key],
        data: powerForecastData.map((dataRow) => ({
          x: dataRow.startTime.toJSDate(),
          y: dataRow[key],
        })),
      },
    ]);
  }

  return dataArray;
}
