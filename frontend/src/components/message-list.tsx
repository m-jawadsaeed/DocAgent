import type { Message } from "../types/chat.types";

import { MessageItem } from "./message-item";

interface Props {
  messages: Message[];

  streamedAnswer?: string;

  onRegenerate?: () => void;
}

export function MessageList({ messages, streamedAnswer, onRegenerate }: Props) {
  const hasDuplicate = messages.some(
    (message) =>
      message.role === "ASSISTANT" && message.content === streamedAnswer,
  );

  const shouldRenderStream = Boolean(streamedAnswer) && !hasDuplicate;

  return (
    <div
      className="
    h-full
    overflow-y-auto
    px-3
    md:px-6
    py-10
  "
    >
      <div
        className="
      max-w-3xl
      mx-auto
    "
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {shouldRenderStream && (
          <div>
            <MessageItem
              message={{
                id: "stream",

                conversationId: "stream",

                role: "ASSISTANT",

                content: streamedAnswer ?? "",

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
