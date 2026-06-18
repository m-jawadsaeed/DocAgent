import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { prisma } from "../config/prisma.js";
import { llm } from "../services/llm.service.js";
import { getToolContext } from "./tool-context.js";

function extractContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item: unknown) => {
        if (typeof item === "object" && item !== null && "text" in item) {
          return String((item as { text: string }).text);
        }

        return "";
      })
      .join("");
  }

  return "";
}

export const summarizeDocumentTool = tool(
  async ({ documentId }) => {
    const context = getToolContext();

    if (!context.userId) {
      throw new Error("User context not available");
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: context.userId,
      },
    });

    if (!document) {
      return "Document not found";
    }

    if (document.status === "PROCESSING") {
      return `Document "${document.filename}" is still processing.`;
    }

    if (document.status === "FAILED") {
      return `Document "${document.filename}" processing failed.`;
    }

    const chunks = await prisma.documentChunk.findMany({
      where: {
        documentId,
      },
      take: 20,
    });

    const text = chunks.map((chunk) => chunk.content).join("\n\n");

    const response = await llm.invoke(`
Summarize the following document.

${text}
`);

    return extractContent(response.content);
  },
  {
    name: "summarize_document",

    description: "Get a summary of a specific document by its ID",

    schema: z.object({
      documentId: z.string(),
    }),
  },
);
