import z from "zod";
export const WordSchema = z.object({
  word: z.string(),
  definition: z.string(),
});

export const StoredWordSchema = z.object({
  level: z.number(),
  word: z.string(),
  definition: z.string(),
  created_on: z.date(),
});
