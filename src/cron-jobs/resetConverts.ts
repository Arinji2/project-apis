import cron from "node-cron";
import Pocketbase from "pocketbase";
import dotenv from "dotenv";
dotenv.config();
export const resetConvertsJob = cron.schedule("0 * * * *", async () => {
  console.log("Resetting Converts");
  const pb = new Pocketbase("https://db-listify.arinji.com");
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  await pb.admins.authWithPassword(email, password);
  const ids = await pb.collection("convertLimit").getFullList();
  let idsChanged = 0;
  ids.forEach(async (id) => {
    if (id.uses == 0) return;
    idsChanged++;
    await pb.collection("convertLimit").update(id.id, {
      uses: 0,
    });
  });

  console.log(`Reset Converts, (${idsChanged} Reset)`);
});
