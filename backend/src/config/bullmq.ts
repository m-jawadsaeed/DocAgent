import { env } from "./env.js";

const redisUrl = new URL(env.REDIS_URL);

export const bullmqConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  username: redisUrl.username,
  password: redisUrl.password,
  maxRetriesPerRequest: null,
};
