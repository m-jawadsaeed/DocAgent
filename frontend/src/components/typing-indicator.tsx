export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-zinc-400 text-sm">Thinking</div>

      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-100" />
        <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-200" />
      </div>
    </div>
  );
}
