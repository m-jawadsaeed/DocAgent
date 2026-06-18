interface Props {
  filename: string;
  similarity: number;
  excerpt: string;
}

export function CitationCard({ filename, similarity, excerpt }: Props) {
  return (
    <div
      className="
      rounded-xl
      border
      border-zinc-800
      bg-zinc-900
      p-4
      mt-3
    "
    >
      <div className="font-medium">{filename}</div>

      <div className="text-xs text-zinc-500 mt-1">
        Similarity: {(similarity * 100).toFixed(1)}%
      </div>

      <p className="mt-3 text-sm text-zinc-300">{excerpt}</p>
    </div>
  );
}
