import { User, Bot } from "lucide-react";
import type { Message } from "../types/chat.types";
import { MarkdownMessage } from "./markdown-message";
import { CopyMessageButton } from "./copy-message-button";

interface Props {
  message: Message;
}

export function MessageItem({ message }: Props) {
  const isUser = message.role === "USER";

  return (
    <div
      className={`w-full flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-4xl flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
        {" "}
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
          {isUser ? <User size={18} /> : <Bot size={18} />}{" "}
        </div>
        <div className="flex flex-col gap-3">
          <div
            className={`
          rounded-2xl
          px-4
          py-3
          text-sm
          leading-7
          ${isUser ? "bg-white text-black" : "bg-zinc-900 text-white"}
        `}
          >
            <MarkdownMessage content={message.content} />
          </div>

          {!isUser && <CopyMessageButton text={message.content} />}

          {!!message.citations?.length && (
            <div className="space-y-2">
              {message.citations.map((citation, index) => (
                <div
                  key={`${citation.filename}-${index}`}
                  className="
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900
                p-3
              "
                >
                  <div className="text-sm font-medium">{citation.filename}</div>

                  <div className="text-xs text-zinc-500 mt-2">
                    Similarity: {(citation.similarity * 100).toFixed(1)}%
                  </div>

                  <div className="text-xs text-zinc-400 mt-2">
                    {citation.excerpt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
