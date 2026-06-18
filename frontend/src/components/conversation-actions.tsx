import { Pencil, Trash2, Pin } from "lucide-react";

interface Props {
  onRename?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}

export function ConversationActions({ onRename, onDelete, onPin }: Props) {
  return (
    <div
      className="
      flex
      gap-2
      text-zinc-500
    "
    >
      <button type="button" onClick={onPin}>
        <Pin size={14} />
      </button>

      <button type="button" onClick={onRename}>
        <Pencil size={14} />
      </button>

      <button type="button" onClick={onDelete}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}
