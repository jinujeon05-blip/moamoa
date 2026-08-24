import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { user, loading, updatePassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError(t("resetPassword.errors.mismatch"));
      return;
    }
    setSubmitting(true);
    setError("");
    const errorMessage = await updatePassword(password);
    setSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/mypage"), 1500);
  };

  if (loading) return null;

  if (!user) {
    return (
      <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>{t("resetPassword.invalidTitle")}</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 28 }}>
          {t("resetPassword.invalidBody")}
        </p>
        <Link to="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
          {t("resetPassword.requestAgain")}
        </Link>
      </main>
    );
  }

  if (done) {
    return (
      <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>{t("resetPassword.doneTitle")}</h1>
        <p style={{ color: "var(--sub)", fontSize: 14 }}>{t("resetPassword.doneBody")}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>{t("resetPassword.title")}</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        {t("resetPassword.subtitle")}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="password"
          placeholder={t("resetPassword.newPasswordPlaceholder")}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder={t("resetPassword.confirmPlaceholder")}
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? t("resetPassword.submitting") : t("resetPassword.submit")}
        </button>
      </form>
    </main>
  );
}
