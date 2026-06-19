import { useState } from "react";

import axios from "axios";
import  type { AxiosProgressEvent } from "axios";

import { useAuthStore } from "../store/auth.store";

export interface UploadDocumentResponse {
  id: string;

  filename: string;

  status: "PROCESSING" | "READY" | "FAILED";

  createdAt: string;
}

export function useUploadDocument() {
  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  async function uploadDocument(file: File): Promise<UploadDocumentResponse> {
    const token = useAuthStore.getState().accessToken;

    if (!token) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    setProgress(0);

    try {
      const response = await axios.post<UploadDocumentResponse>(
        `${import.meta.env.VITE_API_URL}/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          onUploadProgress: (event: AxiosProgressEvent) => {
            if (!event.total) {
              return;
            }

            const percent = Math.round((event.loaded * 100) / event.total);

            setProgress(percent);
          },
        },
      );

      return response.data;
    } finally {
      setUploading(false);

      setProgress(0);
    }
  }

  return {
    uploadDocument,

    uploading,

    progress,
  };
}
