import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  PORT: z.string(),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_PORT: z.string(),
  MINIO_ENDPOINT: z.string(),
});

export const env = schema.parse(process.env);
