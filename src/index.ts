import express from "express";
import { AddNewTaskSchema } from "../schema.js";
import { AddNewTask } from "../types.js";
import { deleteConvertsJob } from "./cron-jobs/deletePlaylists.js";
import { resetConvertsJob } from "./cron-jobs/resetConverts.js";
import { performTask } from "./performTask.js";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(express.json());

//
const tasks: AddNewTask[] = [];

const processTasksAutomatically = () => {
  console.log("Checking for tasks...");
  let taskInProgress = false;
  if (tasks.length > 0) {
    console.log("Tasks in queue: " + tasks.length + ".");
    const oldestTask = tasks.shift();
    if (!oldestTask) return;
    if (taskInProgress) return;
    taskInProgress = true;
    performTask(taskInProgress, oldestTask);
  } else console.log("No tasks in queue.");
};

setInterval(processTasksAutomatically, 5000);

app.post("/addTask", (req: any, res: any) => {
  const { spotifyURL, userToken, genres } = req.body;
  const inputDATA = {
    spotifyURL: spotifyURL,
    userToken: userToken,
    genres: genres,
  };

  const parsedInput = AddNewTaskSchema.safeParse(inputDATA);
  if (!parsedInput.success) {
    res.status(400).json({ message: "Invalid input." });
    return;
  }
  tasks.push(parsedInput.data);
  res.status(200).json({ message: "Task added to the queue." });
});
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
  if (!process.env.ADMIN_PASSWORD) throw new Error("ENV FILE NOT FOUND");
  console.log("Found env file, starting cron jobs...");
  resetConvertsJob.start();
  deleteConvertsJob.start();
});
