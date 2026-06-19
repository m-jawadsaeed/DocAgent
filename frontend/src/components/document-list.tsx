import {
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";

import { useDeleteDocument } from "../hooks/useDeleteDocument";

export interface DocumentItem {
  id: string;
  filename?: string;
  name?: string;

  status: "PROCESSING" | "READY" | "FAILED" | "PENDING";

  createdAt: string;

  summary?: string | null;
}

interface Props {
  documents: DocumentItem[];
}

function StatusBadge({ status }: { status: DocumentItem["status"] }) {
  if (status === "READY") {
    return (
      <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="h-3 w-3" />
        Ready
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
        <AlertCircle className="h-3 w-3" />
        Failed
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
      <Loader2 className="h-3 w-3 animate-spin" />
      Processing
    </div>
  );
}

export function DocumentList({ documents }: Props) {
  const deleteMutation = useDeleteDocument();

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) return;

    await deleteMutation.mutateAsync(id);
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <FileText className="h-12 w-12 text-zinc-700 mb-4" />

        <h3 className="text-sm font-medium text-white">
          No documents uploaded
        </h3>

        <p className="text-xs text-zinc-500 mt-2">
          Upload your first PDF document
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-4
            hover:border-zinc-700
            transition-all
          "
        >
          <div className="flex justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {document.filename || document.name}
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(document.createdAt).toLocaleString()}
                </p>

                {document.summary && (
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3">
                    {document.summary}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <StatusBadge status={document.status} />

              <button
                onClick={() => handleDelete(document.id)}
                disabled={deleteMutation.isPending}
                className="
                  text-red-400
                  hover:text-red-300
                  transition
                "
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
