import { useMemo, useState } from "react";
import { Search, MessageSquare, Pin } from "lucide-react";

import type { Conversation } from "../types/chat.types";
import { ConversationActions } from "./conversation-actions";

interface Props {
  conversations: Conversation[];
  selected: string;
  onSelect: (id: string) => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
}

export function ConversationList({
  conversations,
  selected,
  onSelect,
  onRename,
  onDelete,
  onPin,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return conversations.filter((item) =>
      (item.title ?? "").toLowerCase().includes(query.toLowerCase()),
    );
  }, [conversations, query]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div
          className="
            flex
            items-center
            gap-2
            bg-zinc-900
            border
            border-zinc-700
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
        {filtered.map((conversation, index) => {
          const isPinned = conversation.pinned;
          const isSelected = selected === conversation.id;

          return (
            <div
              key={conversation.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(conversation.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(conversation.id);
                }
              }}
              className={`
                w-full
                text-left
                rounded-xl
                px-3
                py-3
                mb-2
                cursor-pointer
                transition-all

                ${
                  isSelected
                    ? isPinned
                      ? "bg-zinc-800 border border-yellow-500 shadow-[0_0_0_1px_rgba(234,179,8,.3)]"
                      : "bg-zinc-800 border border-zinc-600"
                    : isPinned
                      ? "bg-yellow-500/5 border border-yellow-500/30 hover:border-yellow-500"
                      : "bg-zinc-900/40 border border-transparent hover:border-zinc-700 hover:bg-zinc-900"
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3 min-w-0">
                  <MessageSquare
                    size={16}
                    className={isPinned ? "text-yellow-400" : "text-zinc-400"}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isPinned && (
                        <Pin
                          size={14}
                          className="
                            text-yellow-400
                            fill-yellow-400
                            shrink-0
                          "
                        />
                      )}

                      <div className="truncate text-sm font-medium">
                        {conversation.title?.trim() || `Chat ${index + 1}`}
                      </div>
                    </div>

                    <div className="text-xs text-zinc-500 mt-1">
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <ConversationActions
                    onPin={() => onPin?.(conversation.id)}
                    onRename={() => onRename?.(conversation.id)}
                    onDelete={() => onDelete?.(conversation.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            className="
              text-center
              text-zinc-500
              text-sm
              py-10
            "
          >
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
}
