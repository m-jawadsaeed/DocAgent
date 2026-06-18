import { useDropzone } from "react-dropzone";

import axios from "axios";

import { UploadCloud } from "lucide-react";

import { useAuthStore } from "../store/auth.store";

export function DocumentUpload() {
  const token = useAuthStore((state) => state.accessToken);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },

    multiple: false,

    onDrop: async (files) => {
      if (!files.length) {
        return;
      }

      const formData = new FormData();

      formData.append("file", files[0]);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
      rounded-xl
      border-2
      border-dashed
      p-6
      text-center
      cursor-pointer
      transition

      ${isDragActive ? "border-white bg-zinc-900" : "border-zinc-700"}
    `}
    >
      <input {...getInputProps()} />

      <UploadCloud size={28} className="mx-auto mb-3" />

      <div className="font-medium">Upload PDF</div>

      <div className="text-sm text-zinc-500 mt-1">Drag & drop or click</div>
    </div>
  );
}
