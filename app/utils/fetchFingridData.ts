import { fetchWithRetry } from "@/app/utils/fetchWithRetry";
import endpoints from "@/data/interesting-fingrid-endpoints.json";

// Fetch electricity data from Fingrid API
export async function fetchFingridData() {
  const datasetIds = endpoints.map((endpoint) => endpoint.id);

  const results = [];

  if (!process.env.FINGRID_APIKEY) {
    throw new Error("Fingrid API key missing");
  }

  const baseUrl = "https://data.fingrid.fi/api/datasets";

  const multipleEndpointsUrl = "https://data.fingrid.fi/api/data";

  // Build date strings that comply with API
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayYear = today.getFullYear().toString();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const todayDate = today.getDate().toString().padStart(2, "0");
  const yesterdayYear = yesterday.getFullYear().toString();
  const yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, "0");
  const yesterdayDate = yesterday.getDate().toString().padStart(2, "0");

  // Set beginning and end time to fetch
  const startTime = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}T00:00`;
  const endTime = `${todayYear}-${todayMonth}-${todayDate}T23:59`;
  console.log(startTime);
  console.log(endTime);

  console.log("Fetching data from Fingrid API");

  const multipleEndpoints = await fetchWithRetry(
    `${multipleEndpointsUrl}?datasets=${datasetIds}&startTime=${startTime}&endTime=${endTime}&oneRowPerTimePeriod=true&pageSize=1000`,
    3,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.FINGRID_APIKEY,
      },
    },
  );

  const json = await multipleEndpoints.json();
  results.push(json);
  
  // for (const datasetId of datasetIds) {
  //   try {
  //     const endpointInfo = await fetchWithRetry(
  //       `${baseUrl}/${datasetId}`,
  //       3,
  //       {
  //         method: "GET",
  //         headers: {
  //           "x-api-key": process.env.FINGRID_APIKEY,
  //         },
  //       },
  //     );

  //     const data = await fetchWithRetry(
  //       `${baseUrl}/${datasetId}/data?startTime=${startTime}&endTime=${endTime}&pageSize=1000`,
  //       3,
  //       {
  //         method: "GET",
  //         headers: {
  //           "x-api-key": process.env.FINGRID_APIKEY,
  //         },
  //       },
  //     );

  //     const json = await endpointInfo.json()
  //     console.log({
  //       id: json.id,
  //       name: json.nameFi,
  //       description: json.descriptionFi,
  //       dataperiod: json.dataperiodFi,
  //       unit: json.unitFi
  //     })
  //     // console.log(await data.json())

  //     // console.log({
  //     //   datasetId: datasetId,
  //     //   response: (await response.json()).data,
  //     // });

  //     results.push({ datasetId: datasetId, status: "Success" });

  //     // Add delay between requests to prevent throttling
  //     await new Promise(resolve => setTimeout(resolve, 1500))
  //   } catch (error) {
  //     results.push({ datasetId: datasetId, status: "Failure", error: error });
  //   }
  // }

  return results;
}
