import type { Message } from "../types/chat.types";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";

interface Props {
  messages: Message[];
  answer: string;
  loading: boolean;

  onSend: (question: string) => Promise<void>;
  onStop: () => void;
  onRegenerate: () => void;
}

export function ChatWindow({
  messages,
  answer,
  loading,
  onSend,
  onStop,
  onRegenerate,
}: Props) {
  return (
    <div className="h-full flex flex-col bg-[#212121]">
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          streamedAnswer={answer}
          onRegenerate={onRegenerate}
        />
      </div>

      {loading && <TypingIndicator />}

      <ChatInput
        disabled={false}
        loading={loading}
        onSend={onSend}
        onStop={onStop}
      />
    </div>
  );
}
