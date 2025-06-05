import { DateTime } from "luxon";
import { z } from "zod";

// Power forecast data from Fingrid API
// Null values from API are converted to '0' to avoid errors when saving to database
export const ApiForecastDataSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  "Electricity consumption forecast - updated once a day": z
    .number()
    .nullable()
    .transform((value) => value ?? 0),
  "Electricity production prediction - updated every 15 minutes": z
    .number()
    .nullable()
    .transform((value) => value ?? 0),
  "Wind power generation forecast - updated once a day": z
    .number()
    .nullable()
    .transform((value) => value ?? 0),
  "Solar power generation forecast - updated once a day": z
    .number()
    .nullable()
    .transform((value) => value ?? 0),
});

export const ApiForecastDataArraySchema = z.array(ApiForecastDataSchema);
export type ApiForecastDataArray = z.infer<typeof ApiForecastDataArraySchema>;

///////////////////////////////////////////////////////////////////////////

// Power forecast data in database
export const ForecastDataSchema = z.object({
  id: z.number(),
  starttime: z.date(),
  endtime: z.date(),
  "consumption": z.string(),
  "production_total": z.string(),
  "production_wind": z.string(),
  "production_solar": z.string(),
  added_on: z.date(),
});

// Array schema for multiple rows
export const ForecastDataArraySchema = z.array(ForecastDataSchema);
export type ForecastDataArray = z.infer<typeof ForecastDataArraySchema>;

// Type for processing price data in frontend
export type ForecastDataInFrontend ={
  id: number,
  startTime: DateTime<true> | DateTime<false>,
  endTime: DateTime<true> | DateTime<false>,
  consumption: number,
  production_total: number,
  production_wind: number,
  production_solar: number,
}