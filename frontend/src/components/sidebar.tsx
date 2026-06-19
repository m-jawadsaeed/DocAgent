import { useNavigate } from "react-router-dom";
import { Plus, LogOut, MessageSquare } from "lucide-react";
import axios from "axios";

import { useAuthStore } from "../store/auth.store";
import { ConversationList } from "./conversation-list";

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

  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

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
      className="
        w-[260px]
        h-screen
        bg-[#171717]
        border-r
        border-zinc-800
        flex
        flex-col
        shrink-0
      "
    >
      {/* Logo */}
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
            text-white
            border
            border-zinc-700
            transition
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-hidden">
        <ConversationList
          conversations={conversations}
          selected={selected}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onPin={onPin}
        />
      </div>

      {/* User Section */}
      <div
        className="
          border-t
          border-zinc-800
          p-3
          bg-[#171717]
        "
      >
        <div className="flex items-center justify-between gap-3">
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

            <div className="min-w-0">
              <p className="text-sm text-white truncate">
                {user?.email || "User"}
              </p>

              <p className="text-xs text-zinc-500">Free Plan</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              p-2
              rounded-lg
              hover:bg-zinc-800
              text-zinc-400
              hover:text-red-400
              transition
            "
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
