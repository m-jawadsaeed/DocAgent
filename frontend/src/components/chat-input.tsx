import { useState } from "react";
import type { KeyboardEvent } from "react";
import { SendHorizontal, Square } from "lucide-react";

interface Props {
  disabled: boolean;
  loading: boolean;
  onSend: (question: string) => Promise<void>;
  onStop: () => void;
}

export function ChatInput({ onSend, disabled, loading, onStop }: Props) {
  const [value, setValue] = useState("");

  async function submit() {
    const question = value.trim();

    if (!question) return;

    await onSend(question);

    setValue("");
  }

  async function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!loading) {
        await submit();
      }
    }
  }

  return (
    <div className="px-4 md:px-6 pb-5 bg-[#212121] ">
      {" "}
      <div className="max-w-4xl mx-auto">
        {" "}
        <div
          className="
          flex
          justify-center
         border
         border-zinc-700
         bg-[#2b2b2b]
         rounded-[28px]
         overflow-hidden
         shadow-2xl
       "
        >
          <textarea
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message DocAgent..."
            className="
            w-full
            bg-transparent
            resize-none
            outline-none
            text-white
            px-5
            pt-3
            pb-2
            max-h-52
            placeholder:text-zinc-500
            "
          />

          <div className="flex items-center justify-between px-3 py-2">

            {loading ? (
              <button
                onClick={onStop}
                className="
              h-10
              w-10
              rounded-full
              bg-white
              text-black
              flex
              items-center
              justify-center
            "
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={disabled || !value.trim()}
                className="
              h-10
              w-10
              rounded-full
              bg-white
              text-black
              flex
              items-center
              justify-center
              hover:scale-105
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            "
              >
                <SendHorizontal size={18} />
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-2">
          DocAgent can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
