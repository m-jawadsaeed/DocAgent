import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";

import { getSocket } from "../lib/socket";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [conversationId, setConversationId] = useState("");
  const previousRoomRef = useRef("");

  const [streaming, setStreaming] = useState(false);
  const [answer, setAnswer] = useState("");

  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  const { data: conversations = [] } = useConversations();
  const { data: dbMessages = [] } = useMessages(conversationId);

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
   * JOIN / LEAVE ROOMS
   */
 useEffect(() => {
   const socket = getSocket();

   if (!socket || !conversationId) return;

   if (previousRoomRef.current === conversationId) {
     return;
   }

   if (previousRoomRef.current) {
     socket.emit("conversation:leave", previousRoomRef.current);
   }

   socket.emit("conversation:join", conversationId);

   previousRoomRef.current = conversationId;
 }, [conversationId]);
  
  /*
   * SOCKET EVENTS
   */
  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.error("NO SOCKET FOUND");
      return;
    }

    const onStart = () => {
      setAnswer("");
      setStreaming(true);
    };

    const onToken = (data: { token: string }) => {
      setAnswer((prev) => {
        const updated = prev + data.token;

        return updated;
      });
    };

    const onDone = async () => {
      setStreaming(false);

      setOptimisticMessages([]);

      await queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      setAnswer("");
    };

    const onError = (err: unknown) => {
      console.error("CHAT ERROR", err);

      setStreaming(false);
      setAnswer("");
    };

    socket.off("chat:start");
    socket.off("chat:token");
    socket.off("chat:done");
    socket.off("chat:error");

    socket.on("chat:start", onStart);
    socket.on("chat:token", onToken);
    socket.on("chat:done", onDone);
    socket.on("chat:error", onError);

    return () => {
      socket.off("chat:start", onStart);
      socket.off("chat:token", onToken);
      socket.off("chat:done", onDone);
      socket.off("chat:error", onError);
    };
  }, [conversationId, queryClient]);

  const messages: Message[] = [
    ...dbMessages,

    ...optimisticMessages.filter(
      (optimistic) =>
        !dbMessages.some(
          (db) =>
            db.role === optimistic.role && db.content === optimistic.content,
        ),
    ),
  ];
  async function handleSend(question: string) {
    const socket = getSocket();

    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const conversation = await createConversation.mutateAsync();

      activeConversationId = conversation.id;

      setConversationId(activeConversationId);

      navigate(`/chat?id=${activeConversationId}`);
    }

    const optimisticUserMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: activeConversationId,
      role: "USER",
      content: question,
      createdAt: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);

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
      navigate("/chat");
    }
  }

  async function handlePin(id: string) {
    await pinConversation.mutateAsync(id);
  }

  return (
    <div className="h-screen bg-[#212121] text-white flex overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar
          conversations={conversations}
          selected={conversationId}
          onSelect={(id) => {
            setConversationId(id);
            navigate(`/chat?id=${id}`);
          }}
          onRename={handleRename}
          onDelete={handleDelete}
          onPin={handlePin}
        />
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={`
              fixed
              top-0
              left-0
              bottom-0
              z-50
              lg:hidden
              transform
              transition-transform
              duration-300
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <Sidebar
              conversations={conversations}
              selected={conversationId}
              onSelect={(id) => {
                setConversationId(id);
                navigate(`/chat?id=${id}`);
                setSidebarOpen(false);
              }}
              onRename={handleRename}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          </div>
        </>
      )}

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
            messages={messages}
            answer={answer}
            loading={streaming}
            onSend={handleSend}
            onStop={() => {
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
