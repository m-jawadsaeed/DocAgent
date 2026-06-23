import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { getToolContext } from "./tool-context.js";

import { EmbeddingService } from "../services/embedding.service.js";
import { DocumentChunkRepository } from "../repositories/documentChunk.repository.js";

const embeddingService = new EmbeddingService();
const chunkRepository = new DocumentChunkRepository();

export const documentSearchTool = tool(
  async ({ question }) => {
    const context = getToolContext();

    if (!context?.userId) {
      throw new Error("User context not available");
    }

    try {
      // Create embedding for user query
      const queryEmbedding = await embeddingService.createEmbedding(question);

      // Search similar chunks from pgvector
      const chunks = await chunkRepository.similaritySearch(
        context.userId,
        queryEmbedding,
        8,
      );

      if (chunks.length === 0) {
        return JSON.stringify({
          context: "No relevant document content found",
          citations: [],
        });
      }

      return JSON.stringify({
        context: chunks
          .map(
            (chunk) =>
              `DOCUMENT: ${chunk.filename}\n${chunk.content.slice(0, 1500)}`,
          )
          .join("\n\n"),

        citations: chunks.map((chunk) => ({
          filename: chunk.filename,
          similarity: Number(chunk.similarity),
          excerpt: chunk.content.slice(0, 500),
        })),
      });
    } catch (error) {
      console.error("Document search failed:", error);

      return JSON.stringify({
        context: "Document search failed",
        citations: [],
      });
    }
  },
  {
    name: "document_search",

    description:
      "Search uploaded documents using semantic vector similarity search",

    schema: z.object({
      question: z.string(),
    }),
  },
);
