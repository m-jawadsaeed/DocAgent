import { useState } from "react";

import { SendHorizontal } from "lucide-react";

interface Props {
  disabled: boolean;

  loading: boolean;

  onSend: (question: string) => Promise<void>;

  onStop: () => void;
}

export function ChatInput({ onSend, disabled, loading, onStop }: Props) {
  const [value, setValue] = useState("");

  async function submit() {
    if (!value.trim()) {
      return;
    }

    await onSend(value);

    setValue("");
  }

  return (
    <div className="border-t border-zinc-800 p-5 bg-[#171717]">
      {" "}
      <div className="max-w-4xl mx-auto">
        {" "}
        <div className="flex gap-3 items-end bg-[#2a2a2a] rounded-3xl p-3 border border-zinc-700">
          <textarea
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Message AI Assistant..."
            className="flex-1 bg-transparent resize-none outline-none px-2"
          />

          {loading ? (
            <button
              type="button"
              onClick={onStop}
              className="px-5 py-3 rounded-xl bg-red-500 text-white"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={disabled}
              className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center"
            >
              <SendHorizontal size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
