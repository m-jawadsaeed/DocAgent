import type { ChangeEvent } from "react";

import { Upload, FileText, CheckCircle2 } from "lucide-react";

import type { UploadDocumentResponse } from "../hooks/useUploadDocument";

interface Props {
  uploading: boolean;
  progress: number;
  onUpload: (file: File) => Promise<UploadDocumentResponse>;
}

export function DocumentUpload({ uploading, progress, onUpload }: Props) {
  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await onUpload(file);

    event.target.value = "";
  }

  const uploaded = !uploading && progress === 100;

  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        p-4
        transition-all
      "
    >
      <label
        className="
          flex
          items-center
          gap-4
          cursor-pointer
        "
      >
        <div
          className="
            h-12
            w-12
            rounded-xl
            bg-zinc-800
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          {uploading ? (
            <FileText
              className="
                h-5
                w-5
                text-blue-400
                animate-pulse
              "
            />
          ) : uploaded ? (
            <CheckCircle2
              className="
                h-5
                w-5
                text-green-400
              "
            />
          ) : (
            <Upload
              className="
                h-5
                w-5
                text-zinc-300
              "
            />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            Upload PDF Document
          </p>

          <p className="text-xs text-zinc-400">Click to upload PDF files</p>

          {(uploading || progress > 0) && (
            <div className="mt-3">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-1
                "
              >
                <span
                  className="
                    text-[11px]
                    text-zinc-400
                  "
                >
                  {uploading ? "Uploading..." : "Completed"}
                </span>

                <span
                  className="
                    text-[11px]
                    text-blue-400
                    font-medium
                  "
                >
                  {progress}%
                </span>
              </div>

              <div
                className="
                  w-full
                  h-2
                  bg-zinc-800
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-blue-500
                    transition-all
                    duration-300
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
