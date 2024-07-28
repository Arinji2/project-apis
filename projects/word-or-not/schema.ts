import z from "zod";
export const WordSchema = z.object({
  word: z.string(),
  definition: z.string(),
});

export const StoredWordSchema = z.object({
  level: z.number(),
  word: z.string(),
  definition: z.string(),
  deleted: z.boolean(),
  created: z.string().transform((val) => new Date(val)),
  id: z.string(),
});
