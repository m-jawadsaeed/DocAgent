import { api } from "../api/client";

import type{ Document, UploadDocumentResponse } from "../types/document.types";

export class DocumentService {
  public async getDocuments(): Promise<Document[]> {
    const response = await api.get<Document[]>("/documents");

    return response.data;
  }

  public async getDocument(id: string): Promise<Document> {
    const response = await api.get<Document>(`/documents/${id}`);

    return response.data;
  }

  public async uploadDocument(file: File): Promise<UploadDocumentResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<UploadDocumentResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  public async deleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
  }
}

export const documentService = new DocumentService();
