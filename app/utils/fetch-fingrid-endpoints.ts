async function fetchAllData(apiUrl: string, maxPages?: number) {
  if (!process.env.FINGRID_APIKEY) {
    throw new Error("Fingrid API key missing");
  }

  let allData: unknown[] = [];
  let page = 1; // Start with the first page
  let hasMoreData = true; // Flag to check if there are more pages

  while (hasMoreData) {
    if (maxPages && page >= maxPages) {
      break;
    }

    try {
      const response = await fetch(`${apiUrl}?page=${page}`, {
        method: "GET",
        headers: {
          "x-api-key": process.env.FINGRID_APIKEY, // Include the API key in the headers
        },
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allData = allData.concat(data); // Adjust based on the actual response structure

      // Check if there is a next page
      hasMoreData = data.pagination.nextPage !== null; // Adjust based on the actual response structure
      if (hasMoreData) {
        console.log(`Currrent page: ${page}`);
        console.log(
          "API has more pages, waiting 2 seconds before sending new request",
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        page++; // Move to the next page
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      hasMoreData = false; // Stop fetching on error
    }
  }

  return allData;
}

// Example usage
const apiUrl = "https://data.fingrid.fi/api/datasets";
fetchAllData(apiUrl)
  .then((allData) => {
    console.log(JSON.stringify(allData, null, 2));
  })
  .catch((error) => {
    console.error("Error:", error);
  });
