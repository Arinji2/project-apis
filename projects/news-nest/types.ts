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
export const country = ["cn", "in", "us", "ru", "za", "ca"];
export type CountryType = {
  [key in (typeof country)[number]]: NewsItemType[];
};
