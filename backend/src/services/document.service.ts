import { enqueueDocumentProcessing } from "../queues/document.queue.js";

import { DocumentRepository } from "../repositories/document.repository.js";

export class DocumentService {
  private readonly documents = new DocumentRepository();

  public async uploadDocument(
    userId: string,
    filename: string,
    pdfBuffer: Buffer,
  ) {
    const document = await this.documents.create(userId, filename);

    await enqueueDocumentProcessing(document.id, pdfBuffer);

    return document;
  }

  public async getDocument(documentId: string) {
    return this.documents.findById(documentId);
  }

  public async getUserDocuments(userId: string) {
    return this.documents.findAllByUser(userId);
  }

  public async deleteDocument(documentId: string, userId: string) {
    return this.documents.delete(documentId, userId);
  }
}
