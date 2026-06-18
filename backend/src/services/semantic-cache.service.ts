import { createHash } from "node:crypto";

import { CacheService } from "./cache.service.js";

export class SemanticCacheService {
  private readonly cache = new CacheService();

  private hash(text: string) {
    return createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
  }

  public async get(question: string) {
    return this.cache.get(`semantic:${this.hash(question)}`);
  }

  public async set(question: string, answer: string) {
    await this.cache.set(`semantic:${this.hash(question)}`, answer, 86400);
  }
}
