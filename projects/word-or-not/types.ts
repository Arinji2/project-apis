import z from "zod";
import type { StoredWordSchema } from "./schema";
export type StoredWordSchemaType = z.infer<typeof StoredWordSchema>;
