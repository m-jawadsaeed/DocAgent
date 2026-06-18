import { Client } from "minio";

import { env } from "./env.js";

export const minio = new Client({
  endPoint: env.MINIO_ENDPOINT,

  port: Number(env.MINIO_PORT),

  useSSL: false,

  accessKey: env.MINIO_ACCESS_KEY,

  secretKey: env.MINIO_SECRET_KEY,
});
