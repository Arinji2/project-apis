import { z } from "zod";
import { NewsItemSchema } from "./schema";
export type NewsItemType = z.infer<typeof NewsItemSchema>;
export type CategoryType = {
  business: NewsItemType[];
  entertainment: NewsItemType[];
  science: NewsItemType[];
  sports: NewsItemType[];
  technology: NewsItemType[];
};

export type CountryType = {
  ar: NewsItemType[];
  au: NewsItemType[];
  br: NewsItemType[];
  ca: NewsItemType[];
  fr: NewsItemType[];
  de: NewsItemType[];
  in: NewsItemType[];
  us: NewsItemType[];
};
