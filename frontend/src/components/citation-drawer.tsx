import type { Citation } from "../types/chat.types";

interface Props {
  citations: Citation[];
}

export function CitationDrawer({ citations }: Props) {
  return (
    <div
      className="
      space-y-3
      mt-4
    "
    >
      {citations.map((citation) => (
        <div
          key={`${citation.filename}-${citation.excerpt}`}
          className="
            rounded-xl
            bg-zinc-900
            p-3
          "
        >
          <div className="font-medium">{citation.filename}</div>

          <div
            className="
              text-xs
              text-zinc-500
              mt-2
            "
          >
            Score: {(citation.similarity * 100).toFixed(1)}%
          </div>

          <div
            className="
              text-xs
              mt-2
            "
          >
            {citation.excerpt}
          </div>
        </div>
      ))}
    </div>
  );
}
