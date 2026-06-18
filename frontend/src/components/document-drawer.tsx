import { Database } from "lucide-react";

import { useDocuments } from "../hooks/useDocuments";

import { useUploadDocument } from "../hooks/useUploadDocument";

import { UploadDropzone } from "./upload-dropzone";

import { DocumentList } from "./document-list";

export function DocumentDrawer() {
  const { data: documents = [] } = useDocuments();

  const { upload } = useUploadDocument();

  return (
    <aside
      className="
      w-80
      border-l
      border-zinc-800
      bg-[#171717]
      flex
      flex-col
    "
    >
      <div
        className="
        h-16
        flex
        items-center
        px-4
        border-b
        border-zinc-800
      "
      >
        <div className="flex gap-2">
          <Database size={18} />
          Documents
        </div>
      </div>

      <div className="p-4">
        <UploadDropzone onUpload={upload} />
      </div>

      <div
        className="
        flex-1
        overflow-y-auto
        px-4
        pb-4
      "
      >
        <DocumentList documents={documents} />
      </div>
    </aside>
  );
}
