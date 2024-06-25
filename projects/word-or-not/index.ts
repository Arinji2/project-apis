import chalk from "chalk";
import { Hono } from "hono";
import cron from "node-cron";
import { InsertWords } from "./functions/cron-jobs/insertWords";
import { ResetWords } from "./functions/cron-jobs/resetWords";

const app = new Hono();

const tasks = cron.schedule("0 */2 * * *", async () => {
  await ResetWords();
  await InsertWords();
});

app.get("/", async (c) => {
  console.log(chalk.blue("WORD OR NOT: REQUEST RECEIVED"));
  c.status(200);
  return c.text("WORD OR NOT: REQUEST RECEIVED");
});

tasks.start();

export default app;
