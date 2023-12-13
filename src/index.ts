import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
