import { DateTime } from "luxon";
import { z } from "zod";

// Price data from ENTSO-E API
export const ApiPriceDataSchema = z.object({
  timeInterval: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  Point: z.array(
    z.object({
      position: z.number(),
      "price.amount": z.number(),
    }),
  ),
});

export type ApiPriceData = z.infer<typeof ApiPriceDataSchema>;

///////////////////////////////////////////////////////////////////////////

// Price data in database
export const PriceDataSchema = z.object({
  id: z.number(),
  timestamp: z.date(),
  price: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Price must be a valid floating point number",
  }),
  added_on: z.date(),
});
export type PriceData = z.infer<typeof PriceDataSchema>;

// Array schema for multiple rows
export const PriceDataArraySchema = z.array(PriceDataSchema);
export type PriceDataArray = z.infer<typeof PriceDataArraySchema>;

///////////////////////////////////////////////////////////////////////////

// Types for processing price data in frontend
export type PriceDataInFrontend = {
  id: number;
  timestamp: DateTime<true> | DateTime<false>;
  price: number
  priceString: string;
};

export type PriceDataGrouped = {
  date?: string;
  weekNumber?: number;
  year?: number
  dateTitle?: string;
  prices: PriceDataInFrontend[];
};
