import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { socket } from "../lib/socket";

import { Sidebar } from "../components/sidebar";
import { ChatWindow } from "../components/chat-window";
import { DocumentDrawer } from "../components/document-drawer";

import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { useCreateConversation } from "../hooks/useCreateConversations";
import { useDeleteConversation } from "../hooks/useDeleteConversation";
import { useRenameConversation } from "../hooks/useRenameConversation";
import { usePinConversation } from "../hooks/usePinConversation";

import type { Message } from "../types/chat.types";

export default function ChatPage() {
  const [searchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");

  const [streaming, setStreaming] = useState(false);
  const [answer, setAnswer] = useState("");

  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(conversationId);

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

  /*
   * SOCKET EVENTS
   */
  useEffect(() => {
    socket.on("chat:start", () => {
      setAnswer("");
      setStreaming(true);
    });

    socket.on("chat:chunk", (data) => {
      setAnswer((prev) => prev + data.content);
    });

    socket.on("chat:end", () => {
      setStreaming(false);
    });

    socket.on("chat:error", () => {
      setStreaming(false);
    });

    return () => {
      socket.off("chat:start");
      socket.off("chat:chunk");
      socket.off("chat:end");
      socket.off("chat:error");
    };
  }, []);

  const streamedMessages: Message[] =
    answer.trim().length > 0
      ? [
          ...messages,
          {
            id: "streaming-message",
            conversationId,
            role: "ASSISTANT",
            content: answer,
            createdAt: new Date().toISOString(),
          },
        ]
      : messages;

  async function handleSend(question: string) {
    if (!question.trim()) return;

    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const conversation = await createConversation.mutateAsync();

      activeConversationId = conversation.id;

      setConversationId(activeConversationId);
    }

    setAnswer("");
    setStreaming(true);

    socket.emit("chat:send", {
      conversationId: activeConversationId,
      question,
    });
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
    <div className="h-screen bg-[#212121] text-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          conversations={conversations}
          selected={conversationId}
          onSelect={(id) => setConversationId(id)}
          onRename={handleRename}
          onDelete={handleDelete}
          onPin={handlePin}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="fixed top-0 left-0 bottom-0 z-50 lg:hidden">
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
        <header className="h-14 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 bg-[#212121]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-800"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <h1 className="text-sm md:text-base font-medium">DocAgent</h1>
          </div>

          <div className="hidden sm:block text-xs text-zinc-500">
            AI Document Assistant
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={streamedMessages}
            answer={answer}
            loading={streaming}
            onSend={handleSend}
            onStop={() => {
              socket.emit("chat:stop");
              setStreaming(false);
            }}
            onRegenerate={() => {}}
          />
        </div>
      </div>

      <DocumentDrawer />
    </div>
  );
}
