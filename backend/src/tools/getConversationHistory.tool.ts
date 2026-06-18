import { tool } from "@langchain/core/tools";

import { z } from "zod";

import { prisma } from "../config/prisma.js";

import { getToolContext } from "./tool-context.js";

export const getConversationHistoryTool = tool(
  async () => {
    const { conversationId } = getToolContext();

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: "asc",
      },

      take: 50,
    });

    return JSON.stringify(messages);
  },

  {
    name: "get_conversation_history",

    description: "Get conversation history",

    schema: z.object({}),
  },
);
