import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSaveBatch } from "../hooks/useSaveBatch";

interface Props {
  title: string;
  category: string;
  receiptCount: number;
  totalAmount: number;
  disabled: boolean;
  onSaved: () => void;
  getPdfBlob: () => Promise<Blob | null>;
}

export default function SaveBatchPanel({
  title,
  category,
  receiptCount,
  totalAmount,
  disabled,
  onSaved,
  getPdfBlob,
}: Props) {
  const { user } = useAuth();
  const { saveBatch, saving } = useSaveBatch();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <Link to="/login" className="btn-secondary btn" style={{ textDecoration: "none" }}>
        로그인하고 저장하기
      </Link>
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
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <button
        type="button"
        className="btn-secondary btn"
        onClick={handleSave}
        disabled={disabled || saving}
      >
        {saving ? "저장 중..." : "마이페이지에 저장"}
      </button>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#F04452" }}>{error}</p>}
      {saved && <p style={{ margin: 0, fontSize: 12, color: "var(--primary)" }}>저장했어요!</p>}
    </div>
  );
}
