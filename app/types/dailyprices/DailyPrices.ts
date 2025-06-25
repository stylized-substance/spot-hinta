import { PriceDataInFrontend } from "../priceData";

// Price data grouped by year, month and day and average hourly price for each day
type Day = {
  day:number, // Day
  data: {
    prices: PriceDataInFrontend[];
    averagePrice: string;
  }
}

type Month = {
  month: number,
  data: Day[]
}

type Year = {
  year: number,
  data: Month[]
}

export type GroupedAndAveraged = Year[]