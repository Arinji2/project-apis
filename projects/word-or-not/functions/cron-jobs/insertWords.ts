import { connectToPB } from "../../connect";
import { StoredWordSchema, WordSchema } from "../../schema";
import type { StoredWordSchemaType } from "../../types";

async function getLevel(table: string) {
  const pb = await connectToPB();

  const rawWords = await pb.collection(table).getFullList();
  const parsedWords = rawWords
    .map((word) => {
      const parse = StoredWordSchema.safeParse(word);
      if (parse.success) return parse.data as StoredWordSchemaType;
      else return null;
    })
    .filter((word) => word !== null) as unknown as StoredWordSchemaType[];

  const numberOfEasyWords = parsedWords.filter(
    (word) => word.level === 1
  ).length;
  const numberOfMediumWords = parsedWords.filter(
    (word) => word.level === 2
  ).length;
  const numberOfHardWords = parsedWords.filter(
    (word) => word.level === 3
  ).length;

  const minimum = Math.min(
    numberOfEasyWords,
    numberOfMediumWords,
    numberOfHardWords
  );
  const level =
    minimum === numberOfEasyWords ? 1 : minimum === numberOfMediumWords ? 2 : 3;

  return level;
}

export async function InsertWords() {
  const pb = await connectToPB();
  const fakeLevel = await getLevel("fake_words");
  const realLevel = await getLevel("real_words");
  const fakePromises = [...Array(6).keys()].map(async (i) => {
    return await generateWord(true, fakeLevel);
  });

  const realPromises = [...Array(6).keys()].map(async () => {
    return await generateWord(false, realLevel);
  });

  let fakeWords = await Promise.all(fakePromises);
  let realWords = await Promise.all(realPromises);

  fakeWords = fakeWords.filter((word) => word.word !== "FAIL");
  realWords = realWords.filter((word) => word.word !== "FAIL");

  for (const word of fakeWords) {
    try {
      await pb.collection("fake_words").getFirstListItem(`word="${word.word}"`);
    } catch (e) {
      await pb.collection("fake_words").create({
        word: word.word,
        definition: word.definition,
        level: fakeLevel,
        created_on: new Date(),
      });
    }
  }
  for (const word of realWords) {
    try {
      await pb.collection("real_words").getFirstListItem(`word="${word.word}"`);
    } catch (e) {
      await pb.collection("real_words").create({
        word: word.word,
        definition: word.definition,
        level: realLevel,
        created_on: new Date(),
      });
    }
  }
}
let count = 0;
async function generateWord(fake: boolean, level: 1 | 2 | 3) {
  count++;

  const res = await fetch("https://ai.arinji.com/completions", {
    method: "POST",
    headers: {
      Authorization: `${process.env.ACCESS_KEY}`,
      FROM: "WORD-OR-NOT",
      ALERT: "IGNORE",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify([
      {
        role: "system",
        content:
          "Make sure every response is unique and not similar to previous responses.",
      },
      fake
        ? {
            role: "user",
            content: `Take a word from the english language, modify it in a way so that the new word is a fake made up word  but sounds like a real word. Modify the definition of the old word to make it match the new word and compress it to a maximum of 6 words. Respond with the new word and the definition in a line separated by a semicolon. The amount of modifications must be of a level of difficulty suitable for ${
              level === 3
                ? "PHD Researchers"
                : level === 2
                ? "University Professors"
                : "Secondary Education Teachers"
            } Seed: ${Math.random().toFixed(5)}`,
          }
        : {
            role: "user",
            content: `Generate a random word with its definition from the English Dictionary. Edit the definition of the word by compressing it to a maximum of 6 words . Respond with the word and the definition in a line separated by a semicolon. The word must be of a level of difficulty suitable for ${
              level === 3
                ? "PHD Researchers"
                : level === 2
                ? "University Professors"
                : "Secondary Education Teachers"
            }. Seed: ${Math.random().toFixed(5)}`,
          },
    ]),
  });
  try {
    const data = await res.json();

    if (data.message === "Rate Limit Exceeded") {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      return await generateWord(fake, level);
    }

    let word: string = data.message.content.split(";")[0].trim().toLowerCase();
    let definition: string = data.message.content
      .split(";")[1]
      .trim()
      .toLowerCase();

    //check for weird : in the word
    if (word.includes(":")) word = word.split(":")[1];
    if (definition.includes(":")) definition = definition.split(":")[1];

    //check for weird chars like html in the word

    if (word.includes("<")) return await generateWord(fake, level);
    if (definition.includes("<")) return await generateWord(fake, level);

    if (word.includes("(")) {
      const before = word.split("(")[0];
      const after = word.split(")")[1];

      word = before + after;
    }

    if (definition.includes("(")) {
      const before = definition.split("(")[0];
      const after = definition.split(")")[1];

      definition = before + after;
    }

    definition = definition.replace(" - ", "");

    if (word.split(" ").length > 1) return await generateWord(fake, level);
    if (definition.split(" ").length > 10)
      return await generateWord(fake, level);

    const parse = WordSchema.safeParse({ word, definition });

    if (!parse.success) {
      if (count >= 10) {
        return {
          word: "FAIL",
          definition: "FAIL",
        };
      }
      return await generateWord(fake, level);
    } else {
      count = 0;
      return parse.data;
    }
  } catch (error) {
    if (count >= 10) {
      return {
        word: "FAIL",
        definition: "FAIL",
      };
    }

    return await generateWord(fake, level);
  }
}
