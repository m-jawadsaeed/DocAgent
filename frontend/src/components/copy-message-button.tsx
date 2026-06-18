import { Copy } from "lucide-react";

interface Props {
  text: string;
}

export function CopyMessageButton({ text }: Props) {
  return (
    <button onClick={() => navigator.clipboard.writeText(text)}>
      <Copy size={16} />
    </button>
  );
}
