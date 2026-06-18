import { FileText } from "lucide-react";

interface DocumentItem {
  id: string;

  filename: string;
}

interface Props {
  documents: DocumentItem[];
}

export function DocumentList({ documents }: Props) {
  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <div
          key={document.id}
          className="
            bg-zinc-900
            rounded-xl
            p-3
            flex
            gap-3
          "
        >
          <FileText size={18} />

          <span>{document.filename}</span>
        </div>
      ))}
    </div>
  );
}
