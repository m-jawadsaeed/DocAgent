import { Queue, QueueEvents, JobsOptions } from "bullmq";

import { bullmqConnection } from "../config/bullmq.js";

import { logger } from "../utils/logger.js";

export interface DocumentProcessingJob {
  documentId: string;

  pdfBase64: string;
}

export const documentQueue = new Queue<DocumentProcessingJob>(
  "document-processing",
  {
    connection: bullmqConnection,
  },
);

export const documentQueueEvents = new QueueEvents("document-processing", {
  connection: bullmqConnection,
});

documentQueueEvents.on("completed", ({ jobId }) => {
  logger.info(
    {
      jobId,
    },
    "Document job completed",
  );
});

documentQueueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.error(
    {
      jobId,
      failedReason,
    },
    "Document job failed",
  );
});

export const documentJobOptions: JobsOptions = {
  attempts: 5,

  backoff: {
    type: "exponential",
    delay: 3000,
  },

  removeOnComplete: 100,

  removeOnFail: 100,
};

export async function enqueueDocumentProcessing(
  documentId: string,
  pdfBuffer: Buffer,
): Promise<void> {
  await documentQueue.add(
    "process-document",
    {
      documentId,

      pdfBase64: pdfBuffer.toString("base64"),
    },
    documentJobOptions,
  );
}
