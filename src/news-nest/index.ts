import express, { Router } from "express";
import { getNews } from "./functions/getNews.js";
import { setNews } from "./functions/setNews.js";

import chalk from "chalk";
import cron from "node-cron";

const task = cron.schedule("0 0 */12 * *", async () => {
  const news = await getNews();
  await setNews({
    liveNews: news.liveNews,
    categoryNews: news.categoryNews,
    countryNews: news.countryNews,
  });
  await fetch("https://news.arinji.com/api/revalidate", {
    method: "POST",
  });
  console.log(chalk.blue("NEWS-NEST: NEWS UPDATED"));
});

task.start();
export const defaultRoute = Router();

defaultRoute.get("/", async (req, res) => {
  console.log(chalk.blue("NEWS-NEST: REQUEST RECEIVED"));
  const news = await getNews();
  await setNews({
    liveNews: news.liveNews,
    categoryNews: news.categoryNews,
    countryNews: news.countryNews,
  });
  res.send("NEWS-NEST: REQUEST RECEIVED");
});
export const routes = express.Router();
routes.use(defaultRoute);
