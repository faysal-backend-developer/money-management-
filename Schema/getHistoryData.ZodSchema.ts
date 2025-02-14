import { z } from "zod";

export const getHistoryDataZodSchema = z.object({
    TimeFrame: z.enum(["year", "month"]).default("month"),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().max(3000).min(2000)
})