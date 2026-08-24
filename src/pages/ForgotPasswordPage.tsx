import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  fontFamily: "inherit",
  fontSize: 15,
  boxSizing: "border-box" as const,
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPasswordForEmail } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const errorMessage = await resetPasswordForEmail(email);
    setSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>{t("forgotPassword.sentTitle")}</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
          <strong style={{ color: "var(--text)" }}>{email}</strong>
          {t("forgotPassword.sentBodySuffix")}
        </p>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 28 }}>
          {t("forgotPassword.sentInstruction")}
        </p>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
          {t("forgotPassword.backToLogin")}
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>{t("forgotPassword.title")}</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        {t("forgotPassword.subtitle")}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder={t("forgotPassword.emailPlaceholder")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? t("forgotPassword.sending") : t("forgotPassword.submit")}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--sub)", marginTop: 28 }}>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          {t("forgotPassword.backToLogin")}
        </Link>
      </p>
    </main>
  );
}
