import { tool } from "@langchain/core/tools";

import { z } from "zod";

import { prisma } from "../config/prisma.js";

import { getToolContext } from "./tool-context.js";

export const documentSearchTool = tool(
  async ({ question }) => {
    const context = getToolContext();

    if (!context?.userId) {
      throw new Error("User context not available");
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: context.userId,

        status: "READY",
      },

      select: {
        filename: true,

        extractedText: true,
      },

      take: 5,
    });

    if (documents.length === 0) {
      return JSON.stringify({
        context: "No documents available",

        citations: [],
      });
    }

    const matchedDocs = documents
      .filter((doc) =>
        doc.extractedText?.toLowerCase().includes(question.toLowerCase()),
      )
      .map((doc) => ({
        filename: doc.filename,

        excerpt: doc.extractedText?.slice(0, 2000) ?? "",
      }));

    return JSON.stringify({
      context: matchedDocs
        .map((doc) => `DOCUMENT: ${doc.filename}\n${doc.excerpt}`)
        .join("\n\n"),

      citations: matchedDocs.map((doc) => ({
        filename: doc.filename,

        similarity: 1,

        excerpt: doc.excerpt,
      })),
    });
  },

  {
    name: "document_search",

    description: "Search uploaded documents for relevant information",

    schema: z.object({
      question: z.string(),
    }),
  },
);
