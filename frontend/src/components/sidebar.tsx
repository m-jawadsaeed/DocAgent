import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  LogOut,
  MessageSquare,
  Files,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import axios from "axios";

import { useAuthStore } from "../store/auth.store";

import { ConversationList } from "./conversation-list";
import { DocumentUpload } from "./document-upload";
import { DocumentList } from "./document-list";

import { useDocuments } from "../hooks/useDocuments";
import { useUploadDocument } from "../hooks/useUploadDocument";

import type { Conversation } from "../types/chat.types";

interface Props {
  conversations: Conversation[];
  selected: string;
  onSelect: (id: string) => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
}

export function Sidebar({
  conversations,
  selected,
  onSelect,
  onRename,
  onDelete,
  onPin,
}: Props) {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"chats" | "documents">("chats");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const { data: documents = [] } = useDocuments();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { uploadDocument, uploading, progress } = useUploadDocument();

  async function createChat() {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/conversations`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    navigate(`/chat?id=${response.data.id}`);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside
      className={`
      h-screen
      bg-[#171717]
      border-r
      border-zinc-800
      flex
      flex-col
      shrink-0
      transition-all
      duration-300
      ${sidebarOpen ? "w-70" : "w-17.5"}
    `}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="
              h-9
              w-9
              rounded-xl
              bg-white
              text-black
              flex
              items-center
              justify-center
            "
          >
            <MessageSquare size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-white">DocAgent</h2>

            <p className="text-[11px] text-zinc-500">AI Assistant</p>
          </div>
        </div>

        <button
          onClick={createChat}
          className="
            w-full
            h-11
            rounded-2xl
            bg-[#2f2f2f]
            hover:bg-[#3a3a3a]
            border
            border-zinc-700
            text-white
            flex
            items-center
            justify-center
            gap-2
            transition
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Mobile Tabs */}
      <div className="px-4 pb-3 lg:hidden">
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          <button
            onClick={() => setTab("chats")}
            className={`
              flex-1
              py-2
              rounded-lg
              flex
              items-center
              justify-center
              gap-2
              text-sm
              transition
              ${tab === "chats" ? "bg-zinc-800 text-white" : "text-zinc-500"}
            `}
          >
            <MessageSquare size={15} />
            Chats
          </button>

          <button
            onClick={() => setTab("documents")}
            className={`
              flex-1
              py-2
              rounded-lg
              flex
              items-center
              justify-center
              gap-2
              text-sm
              transition
              ${
                tab === "documents" ? "bg-zinc-800 text-white" : "text-zinc-500"
              }
            `}
          >
            <Files size={15} />
            Documents
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop */}
        <div className="hidden lg:block h-full">
          <ConversationList
            conversations={conversations}
            selected={selected}
            onSelect={onSelect}
            onRename={onRename}
            onDelete={onDelete}
            onPin={onPin}
          />
        </div>

        {/* Mobile */}
        <div className="lg:hidden h-full">
          {tab === "chats" ? (
            <ConversationList
              conversations={conversations}
              selected={selected}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onPin={onPin}
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-zinc-800">
                <DocumentUpload
                  uploading={uploading}
                  progress={progress}
                  onUpload={uploadDocument}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <DocumentList documents={documents} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User */}
      {/* User */}
      <div
        className="
    border-t
    border-zinc-800
    p-3
  "
      >
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="
        w-full
        flex
        items-center
        justify-between
        gap-3
        p-2
        rounded-xl
        hover:bg-zinc-800
        transition
      "
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
            h-10
            w-10
            rounded-full
            bg-zinc-700
            flex
            items-center
            justify-center
            text-white
            font-semibold
            shrink-0
          "
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="min-w-0 text-left">
                <p className="text-sm text-white truncate">
                  {user?.email || "User"}
                </p>

                <p className="text-xs text-zinc-500">Free Plan</p>
              </div>
            </div>

            <ChevronDown
              size={16}
              className={`
          text-zinc-500
          transition-transform
          ${userMenuOpen ? "rotate-180" : ""}
        `}
            />
          </button>

          {userMenuOpen && (
            <div
              className="
          absolute
          bottom-full
          left-0
          mb-2
          w-full
          bg-[#202020]
          border
          border-zinc-700
          rounded-xl
          overflow-hidden
          shadow-xl
          z-50
        "
            >
              <button
                onClick={handleLogout}
                className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            text-red-400
            hover:bg-zinc-800
            transition
          "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
