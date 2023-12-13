import z from "zod";

export const AddNewTaskSchema = z.object({
  spotifyURL: z.string(),
  userToken: z.string(),
  genres: z.array(z.string()),
});
