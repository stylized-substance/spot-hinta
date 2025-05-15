import { z } from "zod";

// Price data from ENTSO-E API
export const ApiPriceData = z.object({
  timeInterval: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  resolution: z.string(),
  Point: z.array(
    z.object({
      position: z.number(),
      "price.amount": z.number(),
    }),
  ),
});

// Price data from database
export const PriceDataSchema = z.array(
  z.object({
    id: z.number(),
    timestamp: z.date(),
    price: z.string(),
  }),
);

export type PriceData = z.infer<typeof PriceDataSchema>;
