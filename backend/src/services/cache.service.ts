import { redis } from "../config/redis.js";

export class CacheService {
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  }

  async set(key: string, value: string, ttl = 3600): Promise<void> {
    await redis.set(key, value, "EX", ttl);
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }
}
