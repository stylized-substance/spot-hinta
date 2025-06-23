import { DateTime } from "luxon";
import { fetchWithRetry } from "./fetchWithRetry";
import {
  ApiElectricityDataArray,
  ApiElectricityDataArraySchema,
} from "../types/fingridData";

// Fetch electricity production data from Fingrid API
export async function fetchFingridDataFromApi(
  apiUrl: string = "https://data.fingrid.fi/api/data",
  startTime: DateTime,
  endTime: DateTime,
  datasetIds: number[],
): Promise<ApiElectricityDataArray | null> {
  if (!process.env.FINGRID_APIKEY) {
    throw new Error("Fingrid API key missing");
  }

  try {
    const response = await fetchWithRetry(
      `${apiUrl}?datasets=${datasetIds}&startTime=${startTime}&endTime=${endTime}&oneRowPerTimePeriod=true&locale=en&pageSize=1000`,
      3,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.FINGRID_APIKEY,
        },
      },
    );

    const { data } = await response.json();

    const parsedData: ApiElectricityDataArray =
      ApiElectricityDataArraySchema.parse(data);

    return parsedData;
  } catch (error) {
    console.error("Error while fetching data from Fingrid API:", error)
    return null;
  }
}
