import express from "express";

import dotenv from "dotenv";
import { routes } from "./news-nest/index.js";
import chalk from "chalk";

const app = express();

dotenv.config();

app.use(express.json());

app.set("json spaces", 2);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
  app.use("/news", routes);
  console.log(chalk.red("NEWS-NEST: API STARTED"));
});
