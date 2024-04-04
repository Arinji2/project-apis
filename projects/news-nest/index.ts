import chalk from "chalk";
import { Hono } from "hono";
import cron from "node-cron";
import { DeleteNews } from "./functions/deleteNews.ts";
import { getNews } from "./functions/getNews.ts";
import { setNews } from "./functions/setNews.ts";

const app = new Hono();
const getNewsTask = cron.schedule("0 0 */14 * *", async () => {
  const news = await getNews();

  await setNews({
    liveNews: news.liveNews,
    categoryNews: news.categoryNews,
    countryNews: news.countryNews,
  });

  await fetch("https://news.arinji.com/api/revalidate", {
    method: "POST",
  });
  console.log(chalk.green("NEWS-NEST: NEWS UPDATED"));
});
const deleteOldNewsTask = cron.schedule("0 0 * * 0", async () => {
  await DeleteNews();
  console.log(chalk.green("NEWS-NEST: NEWS DELETED"));
});

getNewsTask.start();
deleteOldNewsTask.start();

app.get("/", async (c) => {
  console.log(chalk.blue("NEWS-NEST: REQUEST RECEIVED"));

  c.status(200);
  return c.text("NEWS-NEST: REQUEST RECEIVED");
});

export default app;
