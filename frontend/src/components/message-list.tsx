import type { Message } from "../types/chat.types";

import { MessageItem } from "./message-item";

interface Props {
  messages: Message[];

  streamedAnswer?: string;

  onRegenerate?: () => void;
}

export function MessageList({ messages, streamedAnswer, onRegenerate }: Props) {
  return (
    <div
      className="
      h-full
      overflow-y-auto
      px-6
      py-8
    "
    >
      <div
        className="
        max-w-4xl
        mx-auto
        space-y-6
      "
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {streamedAnswer && (
          <div>
            <MessageItem
              message={{
                id: "stream",
                role: "ASSISTANT",
                content: streamedAnswer,
                createdAt: new Date().toISOString(),
              }}
            />

            <div className="ml-14 mt-2">
              <button
                onClick={onRegenerate}
                className="
                  text-xs
                  text-zinc-400
                  hover:text-white
                "
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
