import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
  const { t } = useLanguage();
  const { saveBatch, saving } = useSaveBatch();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <Link to="/login" className="btn-secondary btn" style={{ textDecoration: "none" }}>
        {t("saveBatch.loginPrompt")}
      </Link>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError(t("saveBatch.errorTitleRequired"));
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
        {saving ? t("saveBatch.saving") : t("saveBatch.save")}
      </button>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#F04452" }}>{error}</p>}
      {saved && <p style={{ margin: 0, fontSize: 12, color: "var(--primary)" }}>{t("saveBatch.saved")}</p>}
    </div>
  );
}
