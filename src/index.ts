import express from "express";

import dotenv from "dotenv";
import { app as NewsNestApp } from "./news-nest";

const app = express();

dotenv.config();

app.use(express.json());
app.use(NewsNestApp);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
