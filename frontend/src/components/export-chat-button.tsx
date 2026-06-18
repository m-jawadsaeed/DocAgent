import { Download } from "lucide-react";

interface Props {
  content: string;
}

export function ExportChatButton({ content }: Props) {
  function exportChat() {
    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "chat.txt";

    link.click();
  }

  return (
    <button
      onClick={exportChat}
      className="
      flex
      gap-2
      items-center
      text-zinc-400
    "
    >
      <Download size={16} />
      Export
    </button>
  );
}
