import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSaveBatch } from "../hooks/useSaveBatch";
import { CATEGORIES, DEFAULT_CATEGORY } from "../constants/categories";

interface Props {
  receiptCount: number;
  totalAmount: number;
  disabled: boolean;
  onSaved: () => void;
  getPdfBlob: () => Promise<Blob | null>;
}

export default function SaveBatchPanel({
  receiptCount,
  totalAmount,
  disabled,
  onSaved,
  getPdfBlob,
}: Props) {
  const { user } = useAuth();
  const { saveBatch, saving } = useSaveBatch();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "var(--sub)" }}>
          로그인하면 이 정리 내역을 마이페이지에 저장할 수 있어요
        </p>
        <Link to="/login" className="btn" style={{ textDecoration: "none", textAlign: "center" }}>
          로그인하고 저장하기
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }
    setError("");
    const pdfBlob = await getPdfBlob();
    const errorMessage = await saveBatch({
      userId: user.id,
      title: title.trim(),
      category,
      receiptCount,
      totalAmount,
      pdfBlob,
    });
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setTitle("");
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <input
        type="text"
        placeholder="예: 8월 셋째 주 식비 정리"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          fontFamily: "inherit",
          fontSize: 14,
        }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          fontFamily: "inherit",
          fontSize: 14,
          background: "var(--surface)",
        }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        className="btn-secondary btn"
        onClick={handleSave}
        disabled={disabled || saving}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {saving ? "저장 중..." : "마이페이지에 저장"}
      </button>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#F04452" }}>{error}</p>}
      {saved && <p style={{ margin: 0, fontSize: 12, color: "var(--primary)" }}>저장했어요!</p>}
    </div>
  );
}
