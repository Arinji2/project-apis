import chalk from "chalk";
import { Hono } from "hono";

const app = new Hono();

const processTasksAutomatically = () => {};

setInterval(processTasksAutomatically, 5000);

app.get("/", async (c) => {
  console.log(chalk.blue("WORD OR NOT: REQUEST RECEIVED"));

  c.status(200);
  return c.text("WORD OR NOT: REQUEST RECEIVED");
});

export default app;
