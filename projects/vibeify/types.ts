import z from "zod";
import { AddNewTaskSchema } from "./schema";
export type AddNewTask = z.infer<typeof AddNewTaskSchema>;
export type GenreArrays = Record<string, { uri: string }[]>;
