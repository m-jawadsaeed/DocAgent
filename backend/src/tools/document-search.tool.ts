import { tool } from "@langchain/core/tools";

import { z } from "zod";

import { RetrievalService } from "../services/retrieval.service.js";

import { getToolContext } from "./tool-context.js";

const retrieval = new RetrievalService();

export const documentSearchTool = tool(
  async ({ question }) => {
    const context = getToolContext();
    
    if (!context?.userId) {
      throw new Error("User context not available");
    }

    const result = await retrieval.retrieve(context.userId, question);

    return JSON.stringify({
      context: result.context,

      citations: result.citations,
    });
  },

  {
    name: "document_search",

    description: "Search uploaded documents for relevant information to answer the user's question",

    schema: z.object({
      question: z.string().describe("The question to search for in documents"),
    }),
  },
);
