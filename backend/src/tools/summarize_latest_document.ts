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

export const summarizeLatestDocumentTool = tool(
  async () => {
    const context = getToolContext();

    if (!context.userId) {
      throw new Error("User context not available");
    }

    const document = await prisma.document.findFirst({
      where: {
        userId: context.userId,
        status: "READY",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!document) {
      return "No completed document found.";
    }

    const chunks = await prisma.documentChunk.findMany({
      where: {
        documentId: document.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 50,
    });

    if (chunks.length === 0) {
      return `No content found for "${document.filename}".`;
    }

    const text = chunks.map((chunk) => chunk.content).join("\n\n");

    const response = await llm.invoke(`
You are a document summarization assistant.

Generate:
1. Executive Summary
2. Key Points
3. Important Findings
4. Conclusion

Document Name: ${document.filename}

Document Content:
${text}
`);

    return `
Document: ${document.filename}

${extractContent(response.content)}
`;
  },
  {
    name: "summarize_latest_document",
    description:
    `Use this tool whenever the user asks for:

    - summary of pdf
    - summarize document
    - summarize uploaded file
    - give me summary
    - summarize latest document

    without providing a document id.

    This automatically finds the latest uploaded document and returns its summary.`,

    schema: z.object({}),
  },
);
