import { DateTime } from "luxon";
import {
  ApiElectricityDataArray,
  CombinedElectricityProductionDataArray,
  DbElectricityDataArray,
} from "../types/fingridData";

// Filter API data to timestamps that correspond with 15 minute intervals inside an hour
export function filterTo15Minutes(
  data: ApiElectricityDataArray,
): ApiElectricityDataArray {
  return data.filter((entry) =>
    [0, 15, 30, 45].includes(DateTime.fromISO(entry.startTime).minute),
  );
}

// Combine data from database and from API
export function dataCombiner(
  dataFromDb: DbElectricityDataArray,
  dataFromApi: ApiElectricityDataArray,
): CombinedElectricityProductionDataArray {
  const combinedElectricityData = dataFromDb.map((dbObject) => {
    // Find matching timetamps in arrays
    const nuclearProductionForTimestamp = dataFromApi.find((apiObject) => {
      const apiTimestamp = DateTime.fromISO(apiObject.startTime);
      const dbTimestamp = DateTime.fromJSDate(dbObject.starttime);
      if (apiTimestamp.equals(dbTimestamp)) {
        return apiObject;
      }
    });

    const nuclearProduction = nuclearProductionForTimestamp?.["Nuclear power production - real time data"] ?? null

    return {
      ...dbObject,
      production_nuclear: nuclearProduction,
    };
  });

  return combinedElectricityData;
}
