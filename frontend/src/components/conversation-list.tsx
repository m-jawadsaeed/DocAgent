import { useMemo, useState } from "react";

import { Search, MessageSquare, Pencil, Trash2, Pin } from "lucide-react";

import type { Conversation } from "../types/chat.types";

interface Props {
  conversations: Conversation[];
  selected: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selected, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return conversations.filter((item) =>
      item.title?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [conversations, query]);

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
        <div
          className="
          flex
          items-center
          gap-2
          bg-zinc-900
          rounded-xl
          px-3
          py-2
        "
        >
          <Search size={16} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats..."
            className="
            bg-transparent
            outline-none
            text-sm
            w-full
          "
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`
              w-full
              text-left
              rounded-xl
              px-3
              py-3
              mb-2
              transition

              ${
                selected === conversation.id
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-900"
              }
            `}
          >
            <div className="flex justify-between">
              <div className="flex gap-3 min-w-0">
                <MessageSquare size={16} />

                <div className="min-w-0">
                  <div
                    className="
                    truncate
                    text-sm
                    font-medium
                  "
                  >
                    {conversation.title ?? "New Chat"}
                  </div>

                  <div
                    className="
                    text-xs
                    text-zinc-500
                    mt-1
                  "
                  >
                    {new Date(conversation.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div
                className="
                flex
                gap-2
                text-zinc-500
              "
              >
                <Pin size={14} />

                <Pencil size={14} />

                <Trash2 size={14} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
