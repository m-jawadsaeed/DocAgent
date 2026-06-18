interface Props {
  memory?: string;
}

export function MemoryPanel({ memory }: Props) {
  return (
    <div
      className="
      rounded-xl
      bg-zinc-900
      p-4
    "
    >
      <div className="font-medium mb-2">Conversation Memory</div>

      <div
        className="
        text-sm
        text-zinc-400
        whitespace-pre-wrap
      "
      >
        {memory || "No memory available"}
      </div>
    </div>
  );
}
