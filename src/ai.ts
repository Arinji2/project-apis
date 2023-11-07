import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();
export async function GetGenreFromAI({
  songName,
  artistNames,
  genres,
}: {
  songName: string;
  artistNames: string[];
  genres: string[];
}) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_KEY,
  });

  const output = await replicate.run(
    "replicate/flan-t5-xl:1457f256622cd45415aa70c02105a917b39dc96e58601d7c2df5a30d2e3092e7",
    {
      input: {
        top_p: 0.95,
        prompt: `You will be given a song name and its artists, and you will have to guess the genre of the song out of the following genres,${genres.join(
          ", "
        )} . Respond with only the genre name. You will not be given any other information.\n\nSong Name:${songName}\nArtist: ${artistNames.join(
          ", "
        )}`,
        max_length: 300,
        temperature: 0.01,
        repetition_penalty: 1,
      },
    }
  );

  const formmatedOutput: string[] = output as string[];

  return formmatedOutput[0].toLowerCase();
}
