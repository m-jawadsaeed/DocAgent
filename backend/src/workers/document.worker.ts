import { Worker, Job } from "bullmq";
import { PDFParse } from "pdf-parse";

import { bullmqConnection } from "../config/bullmq.js";

import { splitText } from "../utils/chunking.js";

import { DocumentRepository } from "../repositories/document.repository.js";
import { DocumentChunkRepository } from "../repositories/documentChunk.repository.js";

import { EmbeddingService } from "../services/embedding.service.js";

interface DocumentJobData {
  documentId: string;
  pdfBase64: string;
}

const documents = new DocumentRepository();

const chunksRepo = new DocumentChunkRepository();

const embeddingService = new EmbeddingService();

async function processDocument(job: Job<DocumentJobData>): Promise<void> {
  const { documentId, pdfBase64 } = job.data;

  console.log("Processing document:", documentId);

  const document = await documents.findById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  try {
    const buffer = Buffer.from(pdfBase64, "base64");

    const parser = new PDFParse({
      data: buffer,
    });

    const parsed = await parser.getText();

    await parser.destroy();

    const rawText = parsed.text ?? "";

    if (!rawText.trim()) {
      throw new Error("PDF text extraction failed");
    }

    await documents.updateExtractedText(documentId, rawText);

    const chunks = (await splitText(rawText)).filter(
      (chunk) => chunk.trim().length > 0,
    );

    if (chunks.length === 0) {
      throw new Error("No valid chunks generated");
    }

    console.log(`Generated ${chunks.length} chunks`);

    console.log("Generating embeddings...");

    const embeddings = await embeddingService.createEmbeddings(chunks);

    console.log(`Generated ${embeddings.length} embeddings`);

    await chunksRepo.createMany(
      chunks.map((content, index) => ({
        documentId,

        content,

        embedding: embeddings[index],

        metadata: {
          filename: document.filename,

          chunkIndex: index,
        },
      })),
    );

    await documents.updateStatus(documentId, "READY");

    console.log("Document processed successfully:", documentId);
  } catch (error) {
    console.error("Document processing failed:", error);

    await documents.updateStatus(documentId, "FAILED");

    throw error;
  }
}

export const documentWorker = new Worker<DocumentJobData>(
  "document-processing",
  processDocument,
  {
    connection: bullmqConnection,
    concurrency: 2,
  },
);

documentWorker.on("ready", () => {
  console.log("Document worker ready");
});

documentWorker.on("completed", (job) => {
  console.log(`Document processed successfully: ${job.id}`);
});

documentWorker.on("failed", (job, error) => {
  console.error(`Document processing failed: ${job?.id}`, error);
});

documentWorker.on("error", (error) => {
  console.error("Document worker error:", error);
});
