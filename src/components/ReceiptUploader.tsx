import { useRef, useState } from "react";

interface Props {
  onFiles: (files: FileList | File[]) => void;
}

export default function ReceiptUploader({ onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length > 0) onFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        background: dragOver ? "#EAF2FF" : "var(--surface)",
        padding: "40px 20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.15s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />
      <svg
        className="icon"
        style={{ color: "var(--primary)", width: 32, height: 32, margin: "0 auto 12px" }}
        viewBox="0 0 24 24"
      >
        <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
        <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
      </svg>
      <p style={{ margin: 0, fontWeight: 600 }}>영수증 이미지를 드래그하거나 클릭해서 업로드하세요</p>
      <p style={{ margin: "6px 0 0", color: "var(--sub)", fontSize: 13 }}>
        JPG, PNG 등 이미지 파일 · 여러 장 한 번에 선택 가능
      </p>
    </div>
  );
}
