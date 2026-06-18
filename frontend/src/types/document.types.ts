export interface Document {
  id: string;
  name: string;
  status: "PENDING" | "PROCESSING" | "READY" | "FAILED";

  summary: string | null;

  createdAt: string;
}

export interface UploadDocumentResponse {
  id: string;
  name: string;
}
