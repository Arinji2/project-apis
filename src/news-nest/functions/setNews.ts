import { CategoryType, CountryType, NewsItemType } from "../types.js";
import Pocketbase from "pocketbase";
import dotenv from "dotenv";
dotenv.config();

type Props = {
  liveNews: NewsItemType[] | null;
  categoryNews: CategoryType | null;
  countryNews: CountryType | null;
};
export async function setNews(data: Props) {
  const pb = new Pocketbase("https://db-news.arinji.com/");
  pb.autoCancellation(false);

  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  if (data.liveNews) {
    await Promise.all(
      data.liveNews.map(async (newsItem) => {
        const jsonData = JSON.stringify(newsItem);
        await pb.collection("live").create({
          data: jsonData,
        });
      })
    );
  }
  if (data.categoryNews) {
    await Promise.all(
      Object.keys(data.categoryNews).map(async (category) => {
        await Promise.all(
          data.categoryNews![category as keyof CategoryType].map(
            async (newsItem) => {
              const jsonData = JSON.stringify(newsItem);
              await pb.collection("category").create({
                data: jsonData,
                category: category,
              });
            }
          )
        );
      })
    );
  }

  console.log(data.countryNews);
  if (data.countryNews) {
    await Promise.all(
      Object.keys(data.countryNews).map(async (country) => {
        await Promise.all(
          data.countryNews![country as keyof CountryType].map(
            async (newsItem) => {
              const jsonData = JSON.stringify(newsItem);
              await pb.collection("country").create({
                data: jsonData,
                country: country,
              });
            }
          )
        );
      })
    );
  }
}
