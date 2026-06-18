import { EmbeddingService } from "./embedding.service.js";

import { DocumentChunkRepository } from "../repositories/documentChunk.repository.js";

export interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number;
}

export class RagService {
  private readonly embeddings = new EmbeddingService();

  private readonly chunks = new DocumentChunkRepository();

  public async retrieve(
    userId: string,
    query: string,
    limit = 5,
  ): Promise<RetrievedChunk[]> {
    const embedding = await this.embeddings.createEmbedding(query);

    return this.chunks.similaritySearch(userId, embedding, limit);
  }

  public async buildContext(
    userId: string,
    query: string,
    limit = 5,
  ): Promise<string> {
    const chunks = await this.retrieve(userId, query, limit);

    return chunks
      .map(
        (chunk) =>
          `[SIMILARITY ${chunk.similarity.toFixed(4)}] ${chunk.content}`,
      )
      .join("\n\n---\n\n");
  }
}
