import { connectToPB } from "../../connect";
import { StoredWordSchema } from "../../schema";
import type { StoredWordSchemaType } from "../../types";

const wordsToDelete = 150;

async function DeleteWords(words: StoredWordSchemaType[], table: string) {
  const pb = await connectToPB();
  let deletePromises: Promise<any>[] = [];
  const numberOfEasyWords = words.filter((word) => word.level === 1).length;
  const numberOfMediumWords = words.filter((word) => word.level === 2).length;
  const numberOfHardWords = words.filter((word) => word.level === 3).length;

  if (numberOfEasyWords >= wordsToDelete) {
    deletePromises = [
      ...deletePromises,
      ...words
        .filter((word) => word.level === 1)
        .slice(0, 30)
        .map(async (word) => {
          return await pb.collection(table).delete(word.id);
        }),
    ];
  }

  if (numberOfMediumWords >= wordsToDelete) {
    deletePromises = [
      ...deletePromises,
      ...words
        .filter((word) => word.level === 2)
        .slice(0, 30)
        .map(async (word) => {
          return await pb.collection(table).delete(word.id);
        }),
    ];
  }

  if (numberOfHardWords >= wordsToDelete) {
    deletePromises = [
      ...deletePromises,
      ...words
        .filter((word) => word.level === 3)
        .slice(0, 30)
        .map(async (word) => {
          return await pb.collection(table).delete(word.id);
        }),
    ];
  }

  return Promise.all(deletePromises);
}

export async function ResetWords() {
  const pb = await connectToPB();
  const rawFakeWords = await pb.collection("fake_words").getFullList({
    batch: wordsToDelete + 500,
  });
  const rawRealWords = await pb.collection("real_words").getFullList({
    batch: wordsToDelete + 500,
  });

  let parsedFakeWords = rawFakeWords
    .map((word) => {
      const parse = StoredWordSchema.safeParse(word);
      if (parse.success) return parse.data as StoredWordSchemaType;
      else {
        return null;
      }
    })
    .filter((word) => word !== null) as unknown as StoredWordSchemaType[];

  parsedFakeWords = parsedFakeWords.sort((a, b) => {
    const aDate = new Date(a.created).getTime();
    const bDate = new Date(b.created).getTime();
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
    const aDate = new Date(a.created).getTime();
    const bDate = new Date(b.created).getTime();
    return aDate - bDate;
  });

  const fakeDeletePromises = await DeleteWords(parsedFakeWords, "fake_words");
  const realDeletePromises = await DeleteWords(parsedRealWords, "real_words");

  await Promise.all(fakeDeletePromises);
  await Promise.all(realDeletePromises);
}
