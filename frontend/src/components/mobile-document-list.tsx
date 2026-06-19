import { FileText } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import type { Document } from "../types/document.types";

export function MobileDocumentList() {
  const { data: documents = [] } = useDocuments();

  return (
    <div className="p-3 space-y-2 overflow-y-auto h-full">
      {documents.length === 0 ? (
        <div className="text-center text-zinc-500 text-sm py-10">
          No documents uploaded
        </div>
      ) : (
        documents.map((doc: Document) => (
          <div
            key={doc.id}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-xl
              p-3
            "
          >
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-blue-400 shrink-0" />

              <div className="min-w-0">
                <div className="truncate text-sm">{doc.name}</div>

                <div className="text-xs text-zinc-500">{doc.status}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
