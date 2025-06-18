import { PriceDataInFrontend } from "../priceData";

// Price data grouped by year, month and day and average hourly price for each day
export type GroupedAndAveraged = Record<
  number, // Year
  Record<
    number, // Month
    Record<
      number, // Day
      {
        prices: PriceDataInFrontend[];
        averagePrice: string;
      }
    >
  >
>;
