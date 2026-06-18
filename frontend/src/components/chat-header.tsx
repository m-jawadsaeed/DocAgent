import { BrainCircuit } from "lucide-react";

export function ChatHeader() {
  return (
    <div
      className="
      h-16
      border-b
      border-zinc-800
      flex
      items-center
      justify-between
      px-6
    "
    >
      <div className="flex items-center gap-3">
        <BrainCircuit size={20} />

        <div>
          <div className="font-semibold">AI Document Assistant</div>

          <div className="text-xs text-zinc-500">LangGraph + RAG + Memory</div>
        </div>
      </div>

      <div className="text-xs text-zinc-500">Production Assistant</div>
    </div>
  );
}
