import { NewsItemsSchema } from "../schema.js";
import type { CategoryType, CountryType, NewsItemType } from "../types.ts";
import { country } from "../types.ts";

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
      `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_KEY}&image=1&removeduplicate=1&language=en`,
      {
        headers: {
          "X-Api-Key": `${process.env.NEWS_KEY}`,
        },
      }
    );
    const data = await response.json();

    data.results = data.results.map((result: { [key: string]: any }) => {
      if (
        result.source_name &&
        result.title &&
        result.description &&
        result.link &&
        result.pubDate
      ) {
        return result;
      } else return null;
    });

    data.results = data.results.filter((result: any) => result !== null);
    const parsedData: NewsItemType[] = NewsItemsSchema.parse(data.results);

    return parsedData;
  } catch (error) {
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
          `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_KEY}&category=${category}&image=1&removeduplicate=1&language=en`,
          {
            headers: {
              "X-Api-Key": `${process.env.NEWS_KEY}`,
            },
          }
        );
        const data = await response.json();

        data.results = data.results.map((result: { [key: string]: any }) => {
          if (
            result.source_name &&
            result.title &&
            result.description &&
            result.link &&
            result.pubDate
          ) {
            return result;
          } else return null;
        });

        data.results = data.results.filter((result: any) => result !== null);
        const parsedData: NewsItemType[] = NewsItemsSchema.parse(data.results);

        categoryNews[category as keyof CategoryType] = parsedData;
      })
    );

    return categoryNews;
  } catch (error) {
    return null;
  }
}

async function getCountryNews() {
  try {
    let countryNews: CountryType = {};
    await Promise.all(
      country.map(async (country) => {
        const response = await fetch(
          `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_KEY}&country=${country}&image=1&removeduplicate=1`,
          {
            headers: {
              "X-Api-Key": `${process.env.NEWS_KEY}`,
            },
          }
        );
        const data = await response.json();

        data.results = data.results.map((result: { [key: string]: any }) => {
          if (
            result.source_name &&
            result.title &&
            result.description &&
            result.link &&
            result.pubDate
          ) {
            return result;
          } else return null;
        });

        data.results = data.results.filter((result: any) => result !== null);
        const parsedData: NewsItemType[] = NewsItemsSchema.parse(data.results);

        countryNews[country as keyof CountryType] = parsedData;
      })
    );

    return countryNews;
  } catch (error) {
    return null;
  }
}
