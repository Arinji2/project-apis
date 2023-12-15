import dotenv from "dotenv";
import { NewsItemsSchema } from "../schema.js";
import { CategoryType, CountryType, NewsItemType } from "../types";
dotenv.config();
console.log();

export async function getNews() {
  const liveNews = await getLiveNews();
  const categoryNews = await getCategoryNews();
  const countryNews = await getCountryNews();

  return {
    liveNews: liveNews,
    categoryNews: categoryNews,
    countryNews: countryNews,
  };
}

async function getLiveNews() {
  try {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=in&language=en&pageSize=5",
      {
        headers: {
          "X-Api-Key": `${process.env.NEWS_KEY}`,
        },
      }
    );
    const data = await response.json();

    if (data.length !== 0) {
      data.articles = data.articles.filter(
        (article: any) => article.description && article.url && article.title
      );
    }
    const parsedData: NewsItemType[] = NewsItemsSchema.parse(data.articles);
    console.log(parsedData);

    return parsedData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getCategoryNews() {
  try {
    const categories = [
      "sports",
      "business",
      "entertainment",
      "science",
      "technology",
    ];
    let categoryNews: CategoryType = {
      business: [],
      entertainment: [],
      science: [],
      sports: [],
      technology: [],
    };
    await Promise.all(
      categories.map(async (category) => {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${category}&language=en&pageSize=5`,
          {
            headers: {
              "X-Api-Key": `${process.env.NEWS_KEY}`,
            },
          }
        );
        const data = await response.json();

        if (data.length !== 0) {
          data.articles = data.articles.filter(
            (article: any) =>
              article.description && article.url && article.title
          );
          const parsedData: NewsItemType[] = NewsItemsSchema.parse(
            data.articles
          );

          categoryNews[category as keyof CategoryType] = parsedData;
        }
      })
    );

    return categoryNews;
  } catch (error) {
    return null;
  }
}

async function getCountryNews() {
  try {
    const country = ["cn", "in", "us", "id", "pk", "br", "ng"];
    let countryNews: CountryType = {
      ar: [],
      au: [],
      br: [],
      ca: [],
      fr: [],
      de: [],
      in: [],
      us: [],
    };
    await Promise.all(
      country.map(async (country) => {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=5`,
          {
            headers: {
              "X-Api-Key": `${process.env.NEWS_KEY}`,
            },
          }
        );
        const data = await response.json();

        if (data.length !== 0) {
          data.articles = data.articles.filter(
            (article: any) =>
              article.description && article.url && article.title
          );
          const parsedData: NewsItemType[] = NewsItemsSchema.parse(
            data.articles
          );

          countryNews[country as keyof CountryType] = parsedData;
        }
      })
    );

    return countryNews;
  } catch (error) {
    console.log(error);
    return null;
  }
}
