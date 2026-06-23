import { env } from "../config/env.js";

export class EmbeddingService {
  async createEmbedding(text: string): Promise<number[]> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: {
            parts: [
              {
                text,
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(error);
    }

    const data = await response.json();

    const embedding = data.embedding.values as number[];

    return embedding;
  }

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.createEmbedding(text)));
  }
}
