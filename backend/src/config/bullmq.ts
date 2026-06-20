import { env } from "./env.js";

export const bullmqConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
};
