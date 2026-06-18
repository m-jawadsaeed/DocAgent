import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { ConversationList } from "../components/conversation-list";
import { ChatWindow } from "../components/chat-window";
import { DocumentDrawer } from "../components/document-drawer";

import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { useStreamChat } from "../hooks/useStreamChat";
import { useCreateConversation } from "../hooks/useCreateConversations";

export default function ChatPage() {
  const [searchParams] = useSearchParams();

  const [conversationId, setConversationId] = useState("");

  const { data: conversations = [] } = useConversations();

  const { answer, stream, streaming, stop, regenerate } = useStreamChat();

  const createConversation = useCreateConversation();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setConversationId(id);
    }
  }, [searchParams]);

  const { data: messages = [] } = useMessages(conversationId);

  async function handleSend(question: string) {
    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const conversation = await createConversation.mutateAsync();

      activeConversationId = conversation.id;

      setConversationId(activeConversationId);
    }

    await stream(activeConversationId, question);
  }

  return (
    <div className="h-screen flex bg-[#212121] text-white">
      <ConversationList
        conversations={conversations}
        selected={conversationId}
        onSelect={setConversationId}
      />

      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
          <div className="font-semibold text-lg">AI Document Assistant</div>

          <div className="text-sm text-zinc-500">RAG + Memory + Tools</div>
        </div>

        <ChatWindow
          messages={messages}
          answer={answer}
          loading={streaming}
          onSend={handleSend}
          onStop={stop}
          onRegenerate={() => regenerate(conversationId)}
        />
      </div>

      <DocumentDrawer />
    </div>
  );
}
