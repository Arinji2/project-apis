import { Hono } from "hono";
import { logger } from "hono/logger";
import NewsRouter from "./projects/news-nest/index.ts";
import VibeifyRouter from "./projects/vibeify/index.ts";
import WordOrNotRouter from "./projects/word-or-not/index.ts";

const app = new Hono();

app.use("*", logger());
app.route("/news", NewsRouter);
app.route("/vibeify", VibeifyRouter);
app.route("/word-or-not", WordOrNotRouter);

Bun.serve({
  fetch: app.fetch,

  port: process.env.PORT || 3000,
});
