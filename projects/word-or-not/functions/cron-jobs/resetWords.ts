import { query } from "../../connect";
import { StoredWordSchema } from "../../schema";
import type { StoredWordSchemaType } from "../../types";

function DeleteWords(words: StoredWordSchemaType[], table: string) {
  // if (words.length > 100) {
  //   const deletePromises = words.slice(0, 30).map(async (word) => {
  //     return await query(`DELETE FROM \`${table}\` WHERE word = ?`, [
  //       word.word,
  //     ]);
  //   });

  //   return Promise.all(deletePromises);
  // }
  let deletePromises: Promise<any>[] = [];
  const numberOfEasyWords = words.filter((word) => word.level === 1).length;
  const numberOfMediumWords = words.filter((word) => word.level === 2).length;
  const numberOfHardWords = words.filter((word) => word.level === 3).length;

  if (numberOfEasyWords >= 100) {
    deletePromises = [
      ...deletePromises,
      ...words
        .filter((word) => word.level === 1)
        .slice(0, 30)
        .map(async (word) => {
          return await query(`DELETE FROM ${table} WHERE word = ?`, [
            word.word,
          ]);
        }),
    ];
  }

  if (numberOfMediumWords >= 100) {
    deletePromises = [
      ...deletePromises,
      ...words
        .filter((word) => word.level === 2)
        .slice(0, 30)
        .map(async (word) => {
          return await query(`DELETE FROM ${table} WHERE word = ?`, [
            word.word,
          ]);
        }),
    ];
  }

  if (numberOfHardWords >= 100) {
    deletePromises = [
      ...deletePromises,
      ...words
        .filter((word) => word.level === 3)
        .slice(0, 30)
        .map(async (word) => {
          return await query(`DELETE FROM ${table} WHERE word = ?`, [
            word.word,
          ]);
        }),
    ];
  }

  return Promise.all(deletePromises);
}

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

  const fakeDeletePromises = await DeleteWords(parsedFakeWords, "fake_words");
  const realDeletePromises = await DeleteWords(parsedRealWords, "real_words");

  await Promise.all(fakeDeletePromises);
  await Promise.all(realDeletePromises);
}
