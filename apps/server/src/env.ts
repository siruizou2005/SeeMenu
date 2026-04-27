import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

export const env = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? "0.0.0.0",
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "http://localhost:3001",
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  dataDir: process.env.DATA_DIR ?? path.join(root, "data"),
  uploadsDir: path.join(process.env.DATA_DIR ?? path.join(root, "data"), "uploads"),
  receiptsDir: path.join(process.env.DATA_DIR ?? path.join(root, "data"), "receipts")
};
