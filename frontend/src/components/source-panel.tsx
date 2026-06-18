interface Citation {
  filename: string;
  similarity: number;
  excerpt: string;
}

interface Props {
  citations: Citation[];
}

export function SourcePanel({ citations }: Props) {
  return (
    <div
      className="
     space-y-3
     overflow-y-auto
     max-h-[400px]
   "
    >
      {citations.map((citation, index) => (
        <div
          key={`${citation.filename}-${index}`}
          className="rounded-xl bg-zinc-900 p-4"
        >
          {" "}
          <div className="font-medium">{citation.filename} </div>
          <div className="text-xs text-zinc-500 mt-2">
            Similarity: {(citation.similarity * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-zinc-400 mt-2">{citation.excerpt}</div>
        </div>
      ))}
    </div>
  );
}
