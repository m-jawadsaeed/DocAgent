import { prisma } from "../config/prisma.js";

import { EmbeddingService } from "./embedding.service.js";

import { DocumentChunkRepository } from "../repositories/documentChunk.repository.js";

export interface Citation {
  filename: string;
  similarity: number;
  excerpt: string;
}

export interface RetrievalResult {
  context: string;
  citations: Citation[];
}

interface SearchResult {
  content: string;
  filename: string;
  similarity: number;
}

export class HybridRetrievalService {
  private readonly embeddings = new EmbeddingService();

  private readonly chunks = new DocumentChunkRepository();

  public async retrieve(
    userId: string,
    question: string,
  ): Promise<RetrievalResult> {
    const embedding = await this.embeddings.createEmbedding(question);

    const vectorResults = await this.chunks.similaritySearch(userId, embedding);

    const keywordResults = await prisma.documentChunk.findMany({
      where: {
        document: {
          userId,
        },

        content: {
          contains: question,
          mode: "insensitive",
        },
      },

      include: {
        document: true,
      },

      take: 5,
    });

    const merged: SearchResult[] = [
      ...vectorResults.map((item: SearchResult) => ({
        content: item.content,
        filename: item.filename,
        similarity: item.similarity,
      })),

      ...keywordResults.map((item) => ({
        content: item.content,
        filename: item.document.filename,
        similarity: 1,
      })),
    ];

    const unique = merged.filter(
      (item: SearchResult, index: number, self: SearchResult[]) =>
        index ===
        self.findIndex((i: SearchResult) => i.content === item.content),
    );

    return {
      context: unique.map((item: SearchResult) => item.content).join("\n\n"),

      citations: unique.map((item: SearchResult) => ({
        filename: item.filename,

        similarity: item.similarity,

        excerpt:
          item.content.length > 300 ? item.content.slice(0, 300) : item.content,
      })),
    };
  }
}
