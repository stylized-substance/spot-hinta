import { PriceDataInFrontend } from "../priceData";

// Price data grouped by year, month and day and average hourly price for each day
type Year = {
  year: number,
  data: Month[]
}

type Month = {
  month: string,
  data: Day[]
}

type Day = {
  day: number, // Day
  data: {
    prices: PriceDataInFrontend[];
    averagePrice: string;
  }
}
export type GroupedAndAveraged = Year[]