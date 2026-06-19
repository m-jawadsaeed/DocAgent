import { User, Bot, FileText } from "lucide-react";

import type { Message, Citation } from "../types/chat.types";

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
      className={`
      w-full
      flex
      mb-8
      ${isUser ? "justify-end" : "justify-start"}
    `}
    >
      <div
        className={`
        w-full
        max-w-3xl
        flex
        gap-4
        ${isUser ? "justify-end" : ""}
      `}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Bot size={16} />
          </div>
        )}

        <div className="flex-1">
          <div
            className={
              isUser
                ? `
                ml-auto
                max-w-[80%]
                rounded-3xl
                bg-[#303030]
                px-5
                py-3
              `
                : `
                text-white
                leading-8
              `
            }
          >
            <MarkdownMessage content={content} />
          </div>

          {!isUser && (
            <div className="mt-2">
              <CopyMessageButton text={content} />
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
}
