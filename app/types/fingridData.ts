import { DateTime } from "luxon";
import { z } from "zod";

// Electricity production data from Fingrid API
// Null values from API are converted to '0' to avoid errors when saving to database
export const ApiElectricityDataSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  "Electricity consumption forecast - updated once a day": z
    .number()
    .nullable()
    .transform((value) => value ?? 0)
    .optional(),
  "Electricity production prediction - updated every 15 minutes": z
    .number()
    .nullable()
    .transform((value) => value ?? 0)
    .optional(),
  "Wind power generation forecast - updated once a day": z
    .number()
    .nullable()
    .transform((value) => value ?? 0)
    .optional(),
  "Solar power generation forecast - updated once a day": z
    .number()
    .nullable()
    .transform((value) => value ?? 0)
    .optional(),
  "Nuclear power production - real time data": z
    .number()
    .nullable()
    .transform((value) => value ?? 0)
    .optional(),
});

export const ApiElectricityDataArraySchema = z.array(ApiElectricityDataSchema);
export type ApiElectricityDataArray = z.infer<
  typeof ApiElectricityDataArraySchema
>;

///////////////////////////////////////////////////////////////////////////

// Electricity production data in database
export const DbElectricityDataSchema = z.object({
  id: z.number(),
  starttime: z.date(),
  endtime: z.date(),
  consumption: z.string(),
  production_total: z.string(),
  production_wind: z.string(),
  production_solar: z.string(),
  added_on: z.date(),
});

// Array schema for multiple rows
export const DbElectricityDataArraySchema = z.array(DbElectricityDataSchema);

export type DbElectricityData = z.infer<typeof DbElectricityDataSchema>;
export type DbElectricityDataArray = DbElectricityData[];

// Database and API data combined
export type CombinedElectricityProductionData = DbElectricityData & {
  production_nuclear: number | null;
};

// Array type for multiple rows
export type CombinedElectricityProductionDataArray =
  CombinedElectricityProductionData[];

// Type for processing price data in frontend
export type ElectricityDataInFrontend = {
  startTime: DateTime<true> | DateTime<false>;
  endTime: DateTime<true> | DateTime<false>;
  consumption: number;
  production_total: number;
  production_wind: number;
  production_solar: number;
  production_nuclear?: number | null;
};
