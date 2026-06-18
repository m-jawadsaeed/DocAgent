import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { prisma } from "../config/prisma.js";

import { getToolContext } from "./tool-context.js";

export const listUserDocumentsTool = tool(
  async () => {
    const context = getToolContext();

    if (!context.userId) {
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

    if (docs.length === 0) {
      return "No documents uploaded.";
    }

    return docs
      .map(
        (doc) =>
          `Document: ${doc.filename}
Status: ${doc.status}
ID: ${doc.id}`,
      )
      .join("\n\n");
  },

  {
    name: "list_user_documents",

    description: "List all uploaded user documents",

    schema: z.object({}),
  },
);
