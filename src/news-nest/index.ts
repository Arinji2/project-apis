import { getNews } from "./functions/getNews";
import { setNews } from "./functions/setNews";

import cron from "node-cron";

const task = cron.schedule("0 0 */2 * *", async () => {
  const news = await getNews();
  await setNews({
    liveNews: news.liveNews,
    categoryNews: news.categoryNews,
    countryNews: news.countryNews,
  });
  await fetch("https://news.arinji.com/api/revalidate", {
    method: "POST",
  });
  console.log("NEWS-NEST: News updated!");
});

task.start();
