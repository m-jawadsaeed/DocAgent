import { Database, FileText } from "lucide-react";

import { useDocuments } from "../hooks/useDocuments";
import { useUploadDocument } from "../hooks/useUploadDocument";

import { DocumentUpload } from "./document-upload";
import { DocumentList } from "./document-list";

export function DocumentDrawer() {
  const { data: documents = [] } = useDocuments();

  const { uploadDocument, uploading, progress } = useUploadDocument();

  return (
    <aside
      className="
        hidden
        xl:flex
        w-72
        border-l
        border-zinc-800
        bg-[#171717]
        flex-col
        shrink-0
      "
    >
      {/* Header */}
      <div
        className="
          h-14
          px-4
          border-b
          border-zinc-800
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-2">
          <Database size={18} className="text-zinc-400" />

          <span className="font-medium">Knowledge Base</span>
        </div>

        <span
          className="
            text-xs
            px-2
            py-1
            rounded-full
            bg-zinc-800
            text-zinc-400
          "
        >
          {documents.length}
        </span>
      </div>

      {/* Upload Section */}
      <div
        className="
          p-4
          border-b
          border-zinc-800
        "
      >
        <div className="mb-3">
          <h3 className="text-sm font-medium">Upload Documents</h3>

          <p className="text-xs text-zinc-500 mt-1">
            PDF, DOCX and text files for AI search
          </p>
        </div>

        <DocumentUpload
          uploading={uploading}
          progress={progress}
          onUpload={uploadDocument}
        />
      </div>

      {/* Documents */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-zinc-400" />

            <span className="text-sm font-medium">Documents</span>
          </div>
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            px-4
            pb-4
          "
        >
          {documents.length === 0 ? (
            <div
              className="
                h-full
                flex
                items-center
                justify-center
                text-center
              "
            >
              <div>
                <FileText
                  size={40}
                  className="
                    mx-auto
                    mb-3
                    text-zinc-700
                  "
                />

                <p className="text-sm text-zinc-500">No documents uploaded</p>

                <p className="text-xs text-zinc-600 mt-1">
                  Upload files to enable RAG search
                </p>
              </div>
            </div>
          ) : (
            <DocumentList documents={documents} />
          )}
        </div>
      </div>
    </aside>
  );
}
