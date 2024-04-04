import { Hono } from "hono";
import { logger } from "hono/logger";
import NewsRouter from "./projects/news-nest/index.ts";
import VibeifyRouter from "./projects/vibeify/index.ts";

const app = new Hono();

app.use("*", logger());
app.route("/news", NewsRouter);
app.route("/vibeify", VibeifyRouter);

Bun.serve({
  fetch: app.fetch,

  port: process.env.PORT || 3000,
});
