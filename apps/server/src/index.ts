import { buildApp } from "./app.js";
import { env } from "./env.js";

const app = await buildApp();
await app.listen({ port: env.port, host: env.host });
