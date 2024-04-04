import chalk from "chalk";
import { Hono } from "hono";
import { deleteConvertsJob } from "./functions/cron-jobs/deletePlaylists.ts";
import { resetConvertsJob } from "./functions/cron-jobs/resetConverts.ts";
import { performTask } from "./functions/performTask.ts";
import { AddNewTaskSchema } from "./schema.ts";
import type { AddNewTask } from "./types.ts";

const app = new Hono();
const tasks: AddNewTask[] = [];

const processTasksAutomatically = () => {
  let taskInProgress = false;
  if (tasks.length > 0) {
    const oldestTask = tasks.shift();
    if (!oldestTask) return;
    if (taskInProgress) return;
    taskInProgress = true;
    performTask(taskInProgress, oldestTask);
  }
};

setInterval(processTasksAutomatically, 5000);

app.post("/addTask", async (c) => {
  const { spotifyURL, userToken, genres } = await c.req.json();
  const inputDATA = {
    spotifyURL: spotifyURL,
    userToken: userToken,
    genres: genres,
  };

  const parsedInput = AddNewTaskSchema.safeParse(inputDATA);
  if (!parsedInput.success) {
    c.status(400);
    return c.json({ message: "Invalid input." });
  }
  tasks.push(parsedInput.data);
  c.status(200);
  return c.json({ message: "Task added to the queue." });
});

resetConvertsJob.start();
deleteConvertsJob.start();

app.get("/", async (c) => {
  console.log(chalk.magenta("VIBEFIY: REQUEST RECEIVED"));

  c.status(200);
  return c.text("VIBEFIY: REQUEST RECEIVED");
});

export default app;
