import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Pin } from "lucide-react";

interface Props {
  onRename?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}

export function ConversationActions({ onRename, onDelete, onPin }: Props) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Three Dots Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="
          p-1.5
          rounded-md
          text-zinc-400
          hover:bg-zinc-700
          hover:text-white
          transition
        "
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-9
            z-50
            w-44
            overflow-hidden
            rounded-xl
            border
            border-zinc-700
            bg-[#2b2b2b]
            shadow-2xl
          "
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onPin?.();
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-sm
              text-white
              hover:bg-zinc-800
            "
          >
            <Pin size={15} />
            Pin Chat
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onRename?.();
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-sm
              text-white
              hover:bg-zinc-800
            "
          >
            <Pencil size={15} />
            Rename
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete?.();
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-sm
              text-red-400
              hover:bg-red-500/10
            "
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
