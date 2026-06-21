import { useEffect, useRef, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  MoreHorizontal,
  Eye,
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
        <CheckCircle2 size={12} />
        Ready
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
        <AlertCircle size={12} />
        Failed
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
      <Loader2 size={12} className="animate-spin" />
      Processing
    </div>
  );
}

interface ActionProps {
  onDelete: () => void;
  onViewSummary?: () => void;
}

function DocumentActions({ onDelete, onViewSummary }: ActionProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="
          p-1.5
          rounded-lg
          text-zinc-400
          hover:text-white
          hover:bg-zinc-800
          transition
        "
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-9
            z-50
            w-44
            overflow-hidden
            rounded-xl
            border
            border-zinc-700
            bg-[#2b2b2b]
            shadow-2xl
          "
        >
          <button
            onClick={() => {
              setOpen(false);
              onViewSummary?.();
            }}
            className="
              flex
              items-center
              gap-3
              w-full
              px-4
              py-3
              text-sm
              text-white
              hover:bg-zinc-800
            "
          >
            <Eye size={15} />
            View Summary
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="
              flex
              items-center
              gap-3
              w-full
              px-4
              py-3
              text-sm
              text-red-400
              hover:bg-red-500/10
            "
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function DocumentList({ documents }: Props) {
  const deleteMutation = useDeleteDocument();

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this document?");

    if (!confirmed) return;

    await deleteMutation.mutateAsync(id);
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-12 w-12 text-zinc-700 mb-4" />

        <h3 className="text-white font-medium">No documents uploaded</h3>

        <p className="text-zinc-500 text-sm mt-2">
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
            group
            rounded-2xl
            border
            border-zinc-800
            bg-[#262626]
            p-4
            hover:border-zinc-700
            transition-all
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 min-w-0 flex-1">
              <div
                className="
                  h-11
                  w-11
                  rounded-xl
                  bg-blue-500/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FileText size={20} className="text-blue-400" />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    text-sm
                    font-medium
                    text-white
                    truncate
                  "
                >
                  {document.filename || document.name}
                </h3>

                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(document.createdAt).toLocaleString()}
                </p>

                {document.summary && (
                  <p
                    className="
                      text-sm
                      text-zinc-400
                      mt-3
                      line-clamp-2
                    "
                  >
                    {document.summary}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <StatusBadge status={document.status} />

              <div
                className="
                  opacity-0
                  group-hover:opacity-100
                  transition
                "
              >
                <DocumentActions
                  onDelete={() => handleDelete(document.id)}
                  onViewSummary={() => console.log(document.summary)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
