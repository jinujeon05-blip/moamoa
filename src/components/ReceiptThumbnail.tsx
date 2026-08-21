import type { Receipt } from "../types";

interface Props {
  receipt: Receipt;
  onAmountChange: (id: string, amount: number) => void;
  onMemoChange: (id: string, memo: string) => void;
  onRemove: (id: string) => void;
}

export default function ReceiptThumbnail({
  receipt,
  onAmountChange,
  onMemoChange,
  onRemove,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 12,
      }}
    >
      <img
        src={receipt.imageUrl}
        alt={receipt.fileName}
        style={{
          width: 56,
          height: 56,
          objectFit: "cover",
          borderRadius: 8,
          border: "1px solid var(--border)",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--sub)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={receipt.fileName}
        >
          {receipt.fileName}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="금액"
            value={receipt.amount || ""}
            onChange={(e) => onAmountChange(receipt.id, Number(e.target.value))}
            style={{
              width: 110,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 14,
            }}
          />
          <input
            type="text"
            placeholder="메모 (선택)"
            value={receipt.memo}
            onChange={(e) => onMemoChange(receipt.id, e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 14,
            }}
          />
        </div>
      </div>
      <button
        className="btn-ghost"
        onClick={() => onRemove(receipt.id)}
        aria-label="삭제"
        style={{ alignSelf: "flex-start", padding: 4 }}
      >
        <svg className="icon" style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
          <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0v12a2 2 0 002 2h6a2 2 0 002-2V7" />
        </svg>
      </button>
    </div>
  );
}
