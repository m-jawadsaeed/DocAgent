import { api } from "../api/client";

export function useUploadDocument() {
  async function upload(files: FileList) {
    const form = new FormData();

    if (files.length > 0) {
      form.append("file", files[0]);
    }

    await api.post("/documents/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return {
    upload,
  };
}
