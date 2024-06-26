import { z } from "zod";
import { NewsItemSchema } from "./schema";
export type NewsItemType = z.infer<typeof NewsItemSchema>;
export type CategoryType = {
  business: NewsItemType[];
  entertainment: NewsItemType[];
  science: NewsItemType[];
  sports: NewsItemType[];
  technology: NewsItemType[];
  comedy: NewsItemType[];
};
export const country = ["cn", "in", "us", "ru", "sa", "ca"];
export type CountryType = {
  [key in (typeof country)[number]]: NewsItemType[];
};
