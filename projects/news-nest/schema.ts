import { z } from "zod";

const parseDateString = (dateString: string) => {
  return new Date(dateString);
};

export const NewsItemSchema = z
  .object({
    source_name: z.nullable(z.string()),
    title: z.string(),
    description: z.string(),
    link: z.string().url(),

    image_url: z
      .string()
      .nullable()
      .transform((url) => {
        if (typeof url === "string") {
          if (url.startsWith("http") || url.startsWith("https")) return url;
          else return null;
        }
      }),

    pubDate: z.string().transform(parseDateString),
  })
  .transform((data) => ({
    title: data.title,
    description: data.description,
    publishedAt: data.pubDate,
    author: data.source_name,
    url: data.link,
    urlToImage: data.image_url,
  }));

export const NewsItemsSchema = z.array(NewsItemSchema);
