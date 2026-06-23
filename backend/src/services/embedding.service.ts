import axios from "axios";
import { env } from "../config/env.js";

interface JinaEmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

export class EmbeddingService {
  public async createEmbedding(text: string): Promise<number[]> {
    const response = await axios.post<JinaEmbeddingResponse>(
      "https://api.jina.ai/v1/embeddings",
      {
        model: "jina-embeddings-v3",
        input: [text],
      },
      {
        headers: {
          Authorization: `Bearer ${env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data[0].embedding;
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await axios.post<JinaEmbeddingResponse>(
      "https://api.jina.ai/v1/embeddings",
      {
        model: "jina-embeddings-v3",
        input: texts,
      },
      {
        headers: {
          Authorization: `Bearer ${env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data.map((item) => item.embedding);
  }
}
