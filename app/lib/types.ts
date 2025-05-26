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

// Price data in database
export const PriceDataSchema = z.object({
  id: z.number().optional(),
  timestamp: z.date(),
  price: z.string(),
  added_on: z.date().optional(),
});
export type PriceData = z.infer<typeof PriceDataSchema>;

// Array schema for multiple rows
export const PriceDataArraySchema = z.array(PriceDataSchema);
export type PriceDataArray = z.infer<typeof PriceDataArraySchema>;

////////////////////////////////////////////////////////////////////

// Power forecast data from Fingrid API
export const ApiForecastDataSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  "Electricity consumption forecast - updated once a day": z.number(),
  "Electricity production prediction - updated every 15 minutes": z.number(),
  "Wind power generation forecast - updated once a day": z.number(),
  "Solar power generation forecast - updated once a day": z.number(),
});

export const ApiForecastDataArraySchema = z.array(ApiForecastDataSchema);
export type ApiForecastDataArray = z.infer<typeof ApiForecastDataArraySchema>;

// Power forecast data in database
export const ForecastDataSchema = z.object({
  id: z.number().optional(),
  startTime: z.date(),
  endTime: z.date(),
  "Electricity consumption forecast - updated once a day": z.number(),
  "Electricity production prediction - updated every 15 minutes": z.number(),
  "Wind power generation forecast - updated once a day": z.number(),
  "Solar power generation forecast - updated once a day": z.number(),
  added_on: z.date().optional(),
});

export const ForecastDataArraySchema = z.array(ForecastDataSchema);
export type ForecastDataArray = z.infer<typeof ForecastDataArraySchema>;
