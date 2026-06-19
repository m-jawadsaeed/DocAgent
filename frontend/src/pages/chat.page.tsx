import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Sparkles } from "lucide-react";

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

    if (!trimmedQuestion) {
      return;
    }

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

    if (!title?.trim()) {
      return;
    }

    await renameConversation.mutateAsync({
      conversationId: id,
      title,
    });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this conversation?");

    if (!confirmed) {
      return;
    }

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
        flex
        bg-[#181818]
        text-white
        overflow-hidden
      "
    >
      <Sidebar
        conversations={conversations}
        selected={conversationId}
        onSelect={setConversationId}
        onRename={handleRename}
        onDelete={handleDelete}
        onPin={handlePin}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="
            h-16
            border-b
            border-zinc-800
            bg-[#202020]
            px-6
            flex
            items-center
            justify-between
            shrink-0
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                h-10
                w-10
                rounded-xl
                bg-blue-500/20
                flex
                items-center
                justify-center
              "
            >
              <Sparkles
                className="
                  h-5
                  w-5
                  text-blue-400
                "
              />
            </div>

            <div>
              <h1 className="text-base font-semibold">AI Document Assistant</h1>

              <p className="text-xs text-zinc-400">RAG + Memory + Tools</p>
            </div>
          </div>

          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
            "
          >
            <div
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
                animate-pulse
              "
            />

            <span
              className="
                text-xs
                text-zinc-400
              "
            >
              AI Connected
            </span>
          </div>
        </div>

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

      <DocumentDrawer />
    </div>
  );
}
