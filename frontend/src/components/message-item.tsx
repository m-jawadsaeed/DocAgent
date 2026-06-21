import { User, Bot } from "lucide-react";
import type { Message } from "../types/chat.types";

import { MarkdownMessage } from "./markdown-message";
import { CopyMessageButton } from "./copy-message-button";

interface Props {
  message: Message;
}

export function MessageItem({ message }: Props) {
  const isUser = message.role === "USER";

  const content =
    typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content, null, 2);

  return (
    <div
      className={`         w-full
        flex
        mb-6
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`           flex
          items-end
          gap-3
          max-w-[85%]
          ${isUser ? "flex-row-reverse" : ""}
        `}
      >
        {/* Avatar */}
        <div
          className={`             h-8
            w-8
            rounded-full
            flex
            items-center
            justify-center
            shrink-0
            ${isUser ? "bg-zinc-700" : "bg-emerald-600"}
          `}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}{" "}
        </div>
        {/* Message */}
        <div>
          <div
            className={
              isUser
                ? `
              inline-block
              bg-[#2f2f2f]
              rounded-3xl
              rounded-br-md
              px-4
              py-3
              text-white
              break-words
              shadow-sm
              max-w-full
            `
                : `
              inline-block
              bg-[#262626]
              rounded-3xl
              rounded-bl-md
              px-4
              py-3
              text-white
              break-words
              shadow-sm
              max-w-full
            `
            }
          >
            <MarkdownMessage content={content} />
          </div>

          {!isUser && (
            <div className="mt-2 ml-1">
              <CopyMessageButton text={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
