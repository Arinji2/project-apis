import { query } from "../../connect";
import { StoredWordSchema } from "../../schema";
import type { StoredWordSchemaType } from "../../types";

export async function ResetWords() {
  const rawFakeWords = await query("SELECT * FROM `fake_words`");
  const rawRealWords = await query("SELECT * FROM `real_words`");

  let parsedFakeWords = rawFakeWords
    .map((word) => {
      const parse = StoredWordSchema.safeParse(word);
      if (parse.success) return parse.data as StoredWordSchemaType;
      else return null;
    })
    .filter((word) => word !== null) as unknown as StoredWordSchemaType[];

  parsedFakeWords = parsedFakeWords.sort((a, b) => {
    const aDate = new Date(a.created_on).getTime();
    const bDate = new Date(b.created_on).getTime();
    return aDate - bDate;
  });

  let parsedRealWords = rawRealWords
    .map((word) => {
      const parse = StoredWordSchema.safeParse(word);
      if (parse.success) return parse.data as StoredWordSchemaType;
      else return null;
    })
    .filter((word) => word !== null) as unknown as StoredWordSchemaType[];

  parsedRealWords = parsedRealWords.sort((a, b) => {
    const aDate = new Date(a.created_on).getTime();
    const bDate = new Date(b.created_on).getTime();
    return aDate - bDate;
  });

  if (parsedFakeWords.length > 100) {
    const deletePromises = parsedFakeWords.slice(0, 30).map(async (word) => {
      return await query("DELETE FROM `fake_words` WHERE word = ?", [
        word.word,
      ]);
    });

    await Promise.all(deletePromises);
  }

  if (parsedRealWords.length > 100) {
    const deletePromises = parsedRealWords.slice(0, 30).map(async (word) => {
      return await query("DELETE FROM `real_words` WHERE word = ?", [
        word.word,
      ]);
    });

    await Promise.all(deletePromises);
  }
}
