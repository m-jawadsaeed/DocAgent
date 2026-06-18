import { tool } from "@langchain/core/tools";

import { z } from "zod";

import { ConversationMemoryService } from "../services/conversation-memory.service.js";

import { getToolContext } from "./tool-context.js";

const memory = new ConversationMemoryService();

export const getConversationMemoryTool = tool(
  async () => {
    const { conversationId } = getToolContext();

    return memory.getMemory(conversationId);
  },

  {
    name: "get_conversation_memory",

    description: "Get long term memory",

    schema: z.object({}),
  },
);
