import { Hono } from "hono";
import { logger } from "hono/logger";
import NewsRouter from "./projects/news-nest/index.ts";

const app = new Hono();

app.use("*", logger());
app.route("/news", NewsRouter);

Bun.serve({
  fetch: app.fetch,

  port: process.env.PORT || 3000,
});
