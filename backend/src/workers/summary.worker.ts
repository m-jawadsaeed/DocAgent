import { Worker } from "bullmq";

import { ChatOpenAI } from "@langchain/openai";

import { DocumentChunk } from "@prisma/client";

import { prisma } from "../config/prisma.js";

import { bullmqConnection } from "../config/bullmq.js";

import { logger } from "../utils/logger.js";

interface SummaryJobData {
  documentId: string;
}

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",

  temperature: 0,
});

export const summaryWorker = new Worker<SummaryJobData>(
  "document-summary",

  async (job) => {
    const { documentId } = job.data;

    const chunks: DocumentChunk[] = await prisma.documentChunk.findMany({
      where: {
        documentId,
      },

      take: 50,
    });

    const content = chunks
      .map((chunk: DocumentChunk) => chunk.content)
      .join("\n");

    const response = await llm.invoke(`
You are a document summarization assistant.

Generate a concise but complete summary of the document.

DOCUMENT:

${content}
`);

    await prisma.document.update({
      where: {
        id: documentId,
      },

      data: {
        summary: response.content.toString(),
      },
    });

    logger.info(
      {
        documentId,
      },
      "Summary generated",
    );
  },

  {
    connection: bullmqConnection,

    concurrency: 2,
  },
);

summaryWorker.on("failed", (job, error) => {
  logger.error(
    {
      err: error,

      jobId: job?.id,
    },
    "Summary worker failed",
  );
});

summaryWorker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "Summary worker completed",
  );
});
