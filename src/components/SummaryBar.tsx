import { useState } from "react";
import { formatWon } from "../utils/format";

interface Props {
  count: number;
  total: number;
  onDownload: () => Promise<void>;
  disabled: boolean;
}

export default function SummaryBar({ count, total, onDownload, disabled }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleClick = async () => {
    setDownloading(true);
    try {
      await onDownload();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 13, color: "var(--sub)" }}>
          영수증 {count}장
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700 }}>
          합계 <span style={{ color: "var(--primary)" }}>{formatWon(total)}</span>
        </p>
      </div>
      <button className="btn" onClick={handleClick} disabled={disabled || downloading}>
        <svg className="icon" style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
          <path d="M12 4v12M12 16l-4-4M12 16l4-4" />
          <path d="M4 20h16" />
        </svg>
        {downloading ? "PDF 생성 중..." : "A4로 다운로드"}
      </button>
    </div>
  );
}
