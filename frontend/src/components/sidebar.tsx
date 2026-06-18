import { useNavigate } from "react-router-dom";
import { Plus, LogOut, MessageSquare } from "lucide-react";
import axios from "axios";

import { useAuthStore } from "../store/auth.store";

export function Sidebar() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const token = useAuthStore((state) => state.accessToken);

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-[#171717] border-r border-zinc-800 flex flex-col">
      <div className="p-4">
        <button
          onClick={createChat}
          className="
            w-full
            rounded-xl
            bg-white
            text-black
            py-3
            font-medium
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

      <div className="px-4 pb-4">
        <div className="text-xs uppercase text-zinc-500 mb-2">Workspace</div>

        <div className="rounded-xl bg-zinc-900 p-3 flex items-center gap-3">
          <MessageSquare size={18} />
          <span>AI Assistant</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="p-4 border-t border-zinc-800">
        <div className="text-sm text-zinc-500 mb-4">
          LangGraph RAG Assistant
        </div>

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-2
            rounded-xl
            px-4
            py-3
            text-red-400
            hover:bg-zinc-800
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
