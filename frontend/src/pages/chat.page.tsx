import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Sidebar } from "../components/sidebar";
import { ChatWindow } from "../components/chat-window";
import { DocumentDrawer } from "../components/document-drawer";

import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { useStreamChat } from "../hooks/useStreamChat";
import { useCreateConversation } from "../hooks/useCreateConversations";
import { useDeleteConversation } from "../hooks/useDeleteConversation";
import { useRenameConversation } from "../hooks/useRenameConversation";
import { usePinConversation } from "../hooks/usePinConversation";

import type { Message } from "../types/chat.types";

export default function ChatPage() {
  const [searchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [conversationId, setConversationId] = useState("");

  const { data: conversations = [] } = useConversations();

  const { data: messages = [] } = useMessages(conversationId);

  const { answer, stream, streaming, stop, regenerate } = useStreamChat();

  const createConversation = useCreateConversation();

  const renameConversation = useRenameConversation();

  const deleteConversation = useDeleteConversation();

  const pinConversation = usePinConversation();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setConversationId(id);
    }
  }, [searchParams]);

  const streamedMessages = useMemo<Message[]>(() => {
    if (!answer.trim()) {
      return messages;
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "ASSISTANT" && lastMessage.content === answer) {
      return messages;
    }

    return [
      ...messages,
      {
        id: "streaming-message",
        conversationId,
        role: "ASSISTANT",
        content: answer,
        createdAt: new Date().toISOString(),
      },
    ];
  }, [messages, answer, conversationId]);

  async function handleSend(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const conversation = await createConversation.mutateAsync();

      activeConversationId = conversation.id;

      setConversationId(activeConversationId);
    }

    await stream(activeConversationId, trimmedQuestion);
  }

  async function handleRename(id: string) {
    const title = window.prompt("Enter new conversation title");

    if (!title?.trim()) return;

    await renameConversation.mutateAsync({
      conversationId: id,
      title,
    });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this conversation?");

    if (!confirmed) return;

    await deleteConversation.mutateAsync(id);

    if (conversationId === id) {
      setConversationId("");
    }
  }

  async function handlePin(id: string) {
    await pinConversation.mutateAsync(id);
  }

  return (
    <div
      className="
        h-screen
        bg-[#212121]
        text-white
        flex
        overflow-hidden
      "
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          conversations={conversations}
          selected={conversationId}
          onSelect={(id) => {
            setConversationId(id);
          }}
          onRename={handleRename}
          onDelete={handleDelete}
          onPin={handlePin}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="
              fixed
              inset-0
              bg-black/70
              z-40
              lg:hidden
            "
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className="
              fixed
              top-0
              left-0
              bottom-0
              z-50
              lg:hidden
            "
          >
            <Sidebar
              conversations={conversations}
              selected={conversationId}
              onSelect={(id) => {
                setConversationId(id);
                setSidebarOpen(false);
              }}
              onRename={handleRename}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="
            h-14
            border-b
            border-zinc-800
            px-4
            flex
            items-center
            justify-between
            shrink-0
            bg-[#212121]
          "
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="
                lg:hidden
                p-2
                rounded-lg
                hover:bg-zinc-800
              "
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <h1
              className="
                text-sm
                md:text-base
                font-medium
              "
            >
              DocAgent
            </h1>
          </div>

          <div
            className="
              text-xs
              text-zinc-500
              hidden
              sm:block
            "
          >
            AI Document Assistant
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={streamedMessages}
            answer={answer}
            loading={streaming}
            onSend={handleSend}
            onStop={stop}
            onRegenerate={() => regenerate(conversationId)}
          />
        </div>
      </div>

      {/* Right Knowledge Panel */}
      <DocumentDrawer />
    </div>
  );
}
