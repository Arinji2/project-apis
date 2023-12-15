import { z } from "zod";
const parseDateString = (dateString: string): Date => new Date(dateString);

export const NewsItemSchema = z.object({
  author: z.nullable(z.string()),
  title: z.string(),
  description: z.string(),
  url: z.string().url(),

  urlToImage: z.string().nullable(),

  publishedAt: z
    .string()

    .transform(parseDateString),
});

export const NewsItemsSchema = z.array(NewsItemSchema);
