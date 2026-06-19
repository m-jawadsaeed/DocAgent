import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";

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
        w-80
        bg-[#171717]
        border-r
        border-zinc-800
        flex
        flex-col
      "
    >
      <div className="p-4">
        <button
          onClick={createChat}
          className="
              w-full
              rounded-xl
              bg-zinc-900
              border
              border-zinc-700
              hover:border-zinc-600
              hover:bg-zinc-800
              text-white
              py-3
              font-medium
              flex
              items-center
              justify-center
              gap-2
              transition-all
            "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

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

      <div
        className="
          border-t
          border-zinc-800
          px-4
          py-3
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="
    h-9
    w-9
    rounded-full
    bg-blue-500/20
    text-blue-400
    flex
    items-center
    justify-center
    font-semibold
    shrink-0
  "
            >
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">
                User
              </div>

              <div className="text-xs text-zinc-400 truncate">
                {user?.email || "No Email"}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              text-red-400
              hover:text-red-300
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
