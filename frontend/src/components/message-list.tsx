import { useEffect, useRef } from "react";
import type { Message } from "../types/chat.types";
import { MessageItem } from "./message-item";

interface Props {
  messages: Message[];
  streamedAnswer?: string;
  onRegenerate?: () => void;
}

export function MessageList({ messages, streamedAnswer, onRegenerate }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasDuplicate = messages.some(
    (message) =>
      message.role === "ASSISTANT" && message.content === streamedAnswer,
  );

  const shouldRenderStream = Boolean(streamedAnswer) && !hasDuplicate;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, streamedAnswer]);

  return (
    <div className="h-full overflow-y-auto">
      {" "}
      <div
        className="
       min-h-full
       flex
       flex-col
       justify-end
       px-3
       md:px-6
       py-6
     "
      >
        {" "}
        <div className="max-w-4xl w-full mx-auto">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          {shouldRenderStream && (
            <MessageItem
              message={{
                id: "stream",
                conversationId: "stream",
                role: "ASSISTANT",
                content: streamedAnswer ?? "",
                createdAt: new Date().toISOString(),
              }}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
