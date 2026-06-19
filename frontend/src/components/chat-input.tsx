import { useState } from "react";
import type { KeyboardEvent } from "react";
import { SendHorizontal, Square, Paperclip } from "lucide-react";

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
    <div
      className="
        px-3
        md:px-6
        pb-5
        bg-[#212121]
      "
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="
            rounded-[30px]
            border
            border-zinc-700
            bg-[#2f2f2f]
            shadow-xl
          "
        >
          <textarea
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="
              w-full
              bg-transparent
              resize-none
              outline-none
              px-5
              pt-4
              pb-2
              text-white
              max-h-48
              placeholder:text-zinc-500
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
              p-3
            "
          >
            <button
              className="
                h-10
                w-10
                rounded-full
                hover:bg-zinc-700
                flex
                items-center
                justify-center
                text-zinc-400
                transition
              "
            >
              <Paperclip size={18} />
            </button>

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
                disabled={disabled}
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
                  transition
                "
              >
                <SendHorizontal size={18} />
              </button>
            )}
          </div>
        </div>

        <p
          className="
            text-center
            text-xs
            text-zinc-500
            mt-2
          "
        >
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
