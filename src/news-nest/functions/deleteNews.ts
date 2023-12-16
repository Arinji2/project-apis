import Pocketbase from "pocketbase";
import dotenv from "dotenv";
import chalk from "chalk";
import cron from "node-cron";
dotenv.config();
async function DeleteNews() {
  const pb = new Pocketbase("https://db-news.arinji.com/");
  pb.autoCancellation(false);

  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  const res = await pb.collection("live").getFullList({
    filter: `created < "${new Date(Date.now() - 2592000000).toISOString()}"`,
  });
  await Promise.all(
    res.map(async (item) => {
      await pb.collection("live").delete(item.id);
    })
  );

  console.log(chalk.blue("NEWS-NEST: OLD NEWS DELETED"));
}

export const deleteOldNewsTask = cron.schedule(
  "0 0 * * 0",
  async () => await DeleteNews()
);
