import { FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export interface DocumentItem {
  id: string;

  filename: string;

  status: "PROCESSING" | "READY" | "FAILED";

  createdAt: string;
}

interface Props {
  documents: DocumentItem[];
}

function StatusBadge({ status }: { status: DocumentItem["status"] }) {
  if (status === "READY") {
    return (
      <div
        className="
          flex
          items-center
          gap-1
          text-emerald-400
          text-xs
          font-medium
        "
      >
        <CheckCircle2 className="h-3 w-3" />
        Ready
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div
        className="
          flex
          items-center
          gap-1
          text-red-400
          text-xs
          font-medium
        "
      >
        <AlertCircle className="h-3 w-3" />
        Failed
      </div>
    );
  }

  return (
    <div
      className="
        flex
        items-center
        gap-1
        text-yellow-400
        text-xs
        font-medium
      "
    >
      <Loader2
        className="
          h-3
          w-3
          animate-spin
        "
      />
      Processing
    </div>
  );
}

export function DocumentList({ documents }: Props) {
  if (documents.length === 0) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          py-14
          text-center
        "
      >
        <FileText
          className="
            h-12
            w-12
            text-zinc-700
            mb-4
          "
        />

        <h3
          className="
            text-sm
            font-medium
            text-white
          "
        >
          No documents uploaded
        </h3>

        <p
          className="
            text-xs
            text-zinc-500
            mt-2
          "
        >
          Upload your first PDF document
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-3
      "
    >
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
            transition-colors
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
                min-w-0
              "
            >
              <div
                className="
                  h-10
                  w-10
                  rounded-xl
                  bg-zinc-800
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FileText
                  className="
                    h-5
                    w-5
                    text-blue-400
                  "
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-medium
                    text-white
                    truncate
                  "
                >
                  {document.filename}
                </p>

                <p
                  className="
                    text-xs
                    text-zinc-500
                    mt-1
                  "
                >
                  {new Date(document.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <StatusBadge status={document.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
