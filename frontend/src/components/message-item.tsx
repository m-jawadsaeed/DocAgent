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
      className={`w-full flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-4xl flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        <div className="flex flex-col gap-3">
          <div
            className={`
              rounded-2xl
              px-4
              py-3
              text-sm
              leading-7
              overflow-hidden
              ${isUser ? "bg-white text-black" : "bg-zinc-900 text-white"}
            `}
          >
            <MarkdownMessage content={content} />
          </div>

          {!isUser && <CopyMessageButton text={content} />}

          {!!message.citations?.length && (
            <div className="space-y-3">
              {message.citations.map((citation: Citation, index) => (
                <div
                  key={`${citation.filename}-${index}`}
                  className="
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-900
                      p-4
                    "
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-blue-400" />

                    <div className="font-medium">{citation.filename}</div>
                  </div>

                  <div className="mt-3">
                    <span
                      className="
                          inline-flex
                          rounded-full
                          bg-green-500/20
                          px-3
                          py-1
                          text-xs
                          text-green-400
                        "
                    >
                      Similarity {(citation.similarity * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div
                    className="
                        mt-3
                        text-sm
                        text-zinc-300
                        leading-6
                      "
                  >
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
