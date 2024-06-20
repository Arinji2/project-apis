import z from "zod";
export const WordSchema = z.object({
  word: z.string(),
  definition: z.string(),
});

export const StoredWordSchema = z.object({
  word: z.string(),
  definition: z.string(),
  last_used: z.date(),
  created_on: z.date(),
});
