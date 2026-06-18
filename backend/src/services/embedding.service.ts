import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class EmbeddingService {
  private readonly model = genAI.getGenerativeModel({
    model: "embedding-001",
  });

  public async createEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.model.embedContent(text);

      const embedding = result.embedding.values;

      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("Invalid embedding returned");
      }

      return embedding;
    } catch (error) {
      console.error("Embedding generation failed:", error);

      return new Array(768).fill(0);
    }
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings = await Promise.all(
      texts.map((text) => this.createEmbedding(text)),
    );

    return embeddings.map((embedding) => {
      if (embedding.length === 768) {
        return embedding;
      }

      if (embedding.length > 768) {
        return embedding.slice(0, 768);
      }

      return [...embedding, ...new Array(768 - embedding.length).fill(0)];
    });
  }
}
