import path from "node:path";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import staticFiles from "@fastify/static";
import { env } from "./env.js";
import { menuRoutes } from "./routes/menu.routes.js";
import { receiptRoutes } from "./routes/receipt.routes.js";
import { roomRoutes } from "./routes/room.routes.js";
import { ensureDataDirs, resumePendingScans } from "./services/menu.service.js";
import { hydrateStore } from "./store.js";

export async function buildApp() {
  await ensureDataDirs();
  hydrateStore();
  resumePendingScans();
  const app = fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  await app.register(staticFiles, {
    root: env.dataDir,
    prefix: "/files/",
    decorateReply: false
  });
  await app.register(menuRoutes);
  await app.register(roomRoutes);
  await app.register(receiptRoutes);

  app.get("/api/health", async () => ({
    ok: true,
    geminiConfigured: Boolean(env.geminiApiKey),
    filesRoot: path.relative(process.cwd(), env.dataDir)
  }));

  return app;
}
