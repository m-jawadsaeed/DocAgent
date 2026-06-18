import { env } from "./env.js";

export const bullmqConnection = {
  host: env.REDIS_HOST,

  port: Number(env.REDIS_PORT),

  maxRetriesPerRequest: null,
};
