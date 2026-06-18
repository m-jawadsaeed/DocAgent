import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { prisma } from "../config/prisma.js";

import { getToolContext } from "./tool-context.js";

export const listUserDocumentsTool = tool(
  async () => {
    const context = getToolContext();
    
    if (!context?.userId) {
      throw new Error("User context not available");
    }

    const docs = await prisma.document.findMany({
      where: {
        userId: context.userId,
      },

      select: {
        id: true,
        filename: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return JSON.stringify(docs);
  },

  {
    name: "list_user_documents",

    description: "List all documents uploaded by the user with their status and metadata",

    schema: z.object({}),
  },
);
