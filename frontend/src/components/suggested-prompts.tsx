interface Props {
  onSelect: (prompt: string) => void;
}

const prompts = [
  "Summarize my uploaded documents",
  "What important decisions were made?",
  "Show document insights",
  "What do you remember about this chat?",
];

export function SuggestedPrompts({ onSelect }: Props) {
  return (
    <div
      className="
      grid
      grid-cols-2
      gap-3
      mt-4
    "
    >
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="
          rounded-xl
          bg-zinc-900
          p-4
          text-left
          hover:bg-zinc-800
          transition
        "
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
