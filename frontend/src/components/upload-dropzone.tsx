import { UploadCloud } from "lucide-react";

interface Props {
  onUpload: (files: FileList) => void;
}

export function UploadDropzone({ onUpload }: Props) {
  return (
    <label
      className="
      border-2
      border-dashed
      border-zinc-700
      rounded-xl
      p-8
      flex
      flex-col
      items-center
      justify-center
      cursor-pointer
      hover:border-white
      transition
    "
    >
      <UploadCloud size={32} />

      <div className="mt-3">Upload PDF Documents</div>

      <input
        type="file"
        accept=".pdf"
        hidden
        onChange={(e) => {
          if (e.target.files?.length) {
            onUpload(e.target.files);
          }
        }}
      />
    </label>
  );
}
