import { query } from "../../connect";
import { WordSchema } from "../../schema";

export async function InsertWords() {
  const fakePromises = [...Array(5).keys()].map(async () => {
    return await generateWord(true);
  });

  const realPromises = [...Array(5).keys()].map(async () => {
    return await generateWord(false);
  });

  let fakeWords = await Promise.all(fakePromises);
  let realWords = await Promise.all(realPromises);

  console.log("GENERATED WORDS");

  fakeWords = fakeWords.filter((word) => word.word !== "FAIL");
  realWords = realWords.filter((word) => word.word !== "FAIL");

  const fakeDBPromises = fakeWords.map(async (word) => {
    return await query(
      "INSERT INTO `fake_words` (word, definition) VALUES (?, ?)",
      [word.word, word.definition]
    );
  });

  const realDBPromises = realWords.map(async (word) => {
    return await query(
      "INSERT INTO `real_words` (word, definition) VALUES (?, ?)",
      [word.word, word.definition]
    );
  });

  await Promise.all(fakeDBPromises);
  await Promise.all(realDBPromises);

  console.log("VALUES INSERTED");
}
let count = 0;
async function generateWord(fake: boolean) {
  count++;
  console.log("Generating Word", fake);
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
            content: `Take a word from the english language, modify it in a way so that the new word is a fake made up word  but sounds like a real word. Modify the definition of the old word to make it match the new word and compress it to a maximum of 6 words. Respond with the new word and the definition in a line separated by a semicolon. Seed: ${Math.random().toFixed(
              5
            )}`,
          }
        : {
            role: "user",
            content: `Generate a random word with its definition from the English Dictionary. Edit the definition of the word by compressing it to a maximum of 6 words . Respond with the word and the definition in a line separated by a semicolon. The word must be of a level of difficulty suitable for university professors. Seed: ${Math.random().toFixed(
              5
            )}`,
          },
    ]),
  });
  try {
    const data = await res.json();

    if (data.message === "Rate Limit Exceeded") {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      return await generateWord(fake);
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

    if (word.includes("<")) return await generateWord(fake);
    if (definition.includes("<")) return await generateWord(fake);

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

    if (word.split(" ").length > 1) return await generateWord(fake);
    if (definition.split(" ").length > 10) return await generateWord(fake);

    const parse = WordSchema.safeParse({ word, definition });

    if (!parse.success) {
      if (count >= 10) {
        return {
          word: "FAIL",
          definition: "FAIL",
        };
      }
      return await generateWord(fake);
    } else {
      count = 0;
      return parse.data;
    }
  } catch (error) {
    // console.log("ERROR", error);
    if (count >= 10) {
      return {
        word: "FAIL",
        definition: "FAIL",
      };
    }

    return await generateWord(fake);
  }
}
