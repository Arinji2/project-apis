import Pocketbase from "pocketbase";

import chalk from "chalk";

export async function DeleteNews() {
  const pb = new Pocketbase("https://db-news.arinji.com/");
  pb.autoCancellation(false);

  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  const live = await pb.collection("live").getFullList({
    filter: `created < "${new Date(Date.now() - 2592000000).toISOString()}"`,
  });
  await Promise.all(
    live.map(async (item) => {
      try {
        await pb
          .collection("saved")
          .getFirstListItem(`articleCategory="live" && articleID="${item.id}"`);
      } catch (e) {
        await pb.collection("live").delete(item.id);
      }
    })
  );

  const category = await pb.collection("category").getFullList({
    filter: `created < "${new Date(Date.now() - 2592000000).toISOString()}"`,
  });
  await Promise.all(
    category.map(async (item) => {
      try {
        await pb
          .collection("saved")
          .getFirstListItem(
            `articleCategory="category" && articleID="${item.id}"`
          );
      } catch (e) {
        await pb.collection("category").delete(item.id);
      }
    })
  );

  const country = await pb.collection("country").getFullList({
    filter: `created < "${new Date(Date.now() - 2592000000).toISOString()}"`,
  });
  await Promise.all(
    country.map(async (item) => {
      try {
        await pb
          .collection("saved")
          .getFirstListItem(
            `articleCategory="country" && articleID="${item.id}"`
          );
      } catch (e) {
        await pb.collection("country").delete(item.id);
      }
    })
  );

  console.log(chalk.blue("NEWS-NEST: OLD NEWS DELETED"));
}
