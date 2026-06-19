import { Pencil, Trash2, Pin } from "lucide-react";

interface Props {
  onRename?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}

export function ConversationActions({ onRename, onDelete, onPin }: Props) {
  return (
    <div className="flex gap-2 text-zinc-500">
      <button
        type="button"
        onClick={onPin}
        title="Pin Conversation"
        className="
    p-1.5
    rounded-md
    hover:bg-yellow-500/10
    hover:text-yellow-400
    transition
  "
      >
        <Pin size={14} />
      </button>

      <button type="button" onClick={onRename} className="hover:text-blue-400">
        <Pencil size={14} />
      </button>

      <button type="button" onClick={onDelete} className="hover:text-red-400">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
