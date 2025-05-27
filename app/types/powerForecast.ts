import { z } from "zod";

// Power forecast data from Fingrid API
// Null values from API are converted to '0' to avoid errors when saving to database
export const ApiForecastDataSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  "Electricity consumption forecast - updated once a day": z
    .number()
    .transform((value) => value ?? 0),
  "Electricity production prediction - updated every 15 minutes": z
    .number()
    .transform((value) => value ?? 0),
  "Wind power generation forecast - updated once a day": z
    .number()
    .transform((value) => value ?? 0),
  "Solar power generation forecast - updated once a day": z
    .number()
    .transform((value) => value ?? 0),
});

export const ApiForecastDataArraySchema = z.array(ApiForecastDataSchema);
export type ApiForecastDataArray = z.infer<typeof ApiForecastDataArraySchema>;

///////////////////////////////////////////////////////////////////////////

// Power forecast data in database
export const ForecastDataSchema = z.object({
  id: z.number().optional(),
  startTime: z.date(),
  endTime: z.date(),
  "Electricity consumption forecast - updated once a day": z.number(),
  "Electricity production prediction - updated every 15 minutes": z.number(),
  "Wind power generation forecast - updated once a day": z.number(),
  "Solar power generation forecast - updated once a day": z.number(),
  added_on: z.date(),
});

export const ForecastDataArraySchema = z.array(ForecastDataSchema);
export type ForecastDataArray = z.infer<typeof ForecastDataArraySchema>;
