import Replicate from "replicate";

export async function GetGenreFromAI({
  songName,
  artistNames,
  genres,
}: {
  songName: string;
  artistNames: string[];
  genres: string[];
}): Promise<string> {
  let finalGenre: string = "";

  await new Promise<void>(async (resolve, reject) => {
    try {
      const genre = await ArinjiAI({ songName, artistNames, genres });

      finalGenre = genre;

      resolve();
    } catch (shuttleError) {
      console.log("ArinjiAI FAILED");
      const replicateGenre = await ReplicateAI({
        songName,
        artistNames,
        genres,
      });
      finalGenre = replicateGenre;
      resolve();
    }
  });

  return finalGenre;
}
async function ReplicateAI({
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
export async function ArinjiAI({
  songName,
  artistNames,
  genres,
}: {
  songName: string;
  artistNames: string[];
  genres: string[];
}) {
  const res = await fetch("https://ai.arinji.com/completions", {
    headers: {
      Authorization: `${process.env.API_ACCESS_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify([
      {
        role: "user",
        content: `Given the song name "${songName}" by artists ${artistNames.join(
          ","
        )}. Your objective is to guess the genre of the song, which is ONLY ${genres.join(
          ","
        )}. Reply with ONLY the genre name, nothing else. `,
      },
    ]),
  });

  if (res.status !== 200) throw new Error("Arinji API Error");

  const data = await res.json();

  try {
    const finalGenre = data.message.content.toLowerCase();

    if (!genres.includes(finalGenre)) throw new Error("Arinji API Error");
    else return finalGenre as string;
  } catch {
    if (data) {
    }
    throw new Error("Arinji API Error");
  }
}
