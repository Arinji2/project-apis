import { z } from "zod";
const parseDateString = (dateString: string): Date => new Date(dateString);

export const NewsItemSchema = z.object({
  author: z.nullable(z.string()),
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  source: z.string(),
  image: z.string().nullable(),

  category: z.string(),
  language: z.string(),
  country: z.string(),
  published_at: z
    .string()
    .refine((dateString) => !isNaN(Date.parse(dateString)), {
      message: "Invalid date format",
    })
    .transform(parseDateString),
});

export const NewsItemsSchema = z.array(NewsItemSchema);
