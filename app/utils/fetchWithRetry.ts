export async function fetchWithRetry(
  url: string,
  retries: number,
  options?: object,
): Promise<Response> {
  const backoff = 60000;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn("Fetch failed, retrying in 60 seconds");
      await new Promise((res) => setTimeout(res, backoff));
      return fetchWithRetry(url, retries - 1, options);
    } else {
      console.error(
        "Fetch failed, maximum retries reached, throwing last error.",
      );
      throw error;
    }
  }
}
