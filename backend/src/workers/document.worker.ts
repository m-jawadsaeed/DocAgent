import { Worker, Job } from "bullmq";

import { PDFParse } from "pdf-parse";

import { bullmqConnection } from "../config/bullmq.js";

import { splitText } from "../utils/chunking.js";

import { EmbeddingService } from "../services/embedding.service.js";

import { DocumentRepository } from "../repositories/document.repository.js";

import { DocumentChunkRepository } from "../repositories/documentChunk.repository.js";

interface DocumentJobData {
  documentId: string;

  pdfBase64: string;
}

const embeddings = new EmbeddingService();

const documents = new DocumentRepository();

const chunksRepo = new DocumentChunkRepository();

async function processDocument(job: Job<DocumentJobData>): Promise<void> {
  const { documentId, pdfBase64 } = job.data;

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

    const chunks = await splitText(parsed.text);

    const vectors = await embeddings.createEmbeddings(chunks);

    await chunksRepo.createMany(
      chunks.map((content, index) => ({
        documentId,

        content,

        embedding: vectors[index],

        metadata: {
          filename: document.filename,

          chunkIndex: index,
        },
      })),
    );

    await documents.updateStatus(documentId, "READY");
  } catch (error) {
    await documents.updateStatus(documentId, "FAILED");

    throw error;
  }
}

export const documentWorker = new Worker<DocumentJobData>(
  "document-processing",

  processDocument,

  {
    connection: bullmqConnection,

    concurrency: 5,
  },
);
