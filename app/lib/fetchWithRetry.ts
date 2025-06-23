export async function fetchWithRetry(
  url: string,
  retries: number,
  options?: object,
): Promise<Response> {
  const backoff = 1000;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`${url}:\n HTTP error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      console.error(`${url}:\nFetch error:`, error);
      console.warn(`${url}:\n Fetch failed, retrying`);
      await new Promise((resolve) => setTimeout(resolve, backoff));

      return fetchWithRetry(url, retries - 1, options);
    } else {
      console.error(
        `${url}:\n: Fetch failed, maximum retries reached`,
      );

      throw error;
    }
  }
}
