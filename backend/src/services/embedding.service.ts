import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class EmbeddingService {
  private readonly model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  public async createEmbedding(text: string): Promise<number[]> {
    const result = await this.model.embedContent(text);

    const embedding = result.embedding.values;

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("Invalid embedding returned");
    }

    if (embedding.length === 768) {
      return embedding;
    }

    if (embedding.length > 768) {
      return embedding.slice(0, 768);
    }

    return [...embedding, ...new Array(768 - embedding.length).fill(0)];
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.createEmbedding(text)));
  }
}
