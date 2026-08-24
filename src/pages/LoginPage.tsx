import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { usePageMeta } from "../hooks/usePageMeta";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  fontFamily: "inherit",
  fontSize: 15,
  boxSizing: "border-box" as const,
};

export default function LoginPage() {
  usePageMeta("로그인 · 모아모아");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signInWithProvider } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const errorMessage = await signIn(email, password);
    setSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    navigate("/mypage");
  };

  const handleProvider = async (provider: "google" | "kakao") => {
    setError("");
    const errorMessage = await signInWithProvider(provider);
    if (errorMessage) setError(errorMessage);
  };

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>{t("login.title")}</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        {t("login.subtitle")}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder={t("login.emailPlaceholder")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder={t("login.passwordPlaceholder")}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <div style={{ textAlign: "right" }}>
          <Link to="/forgot-password" style={{ color: "var(--sub)", fontSize: 13 }}>
            {t("login.forgotPassword")}
          </Link>
        </div>
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? t("login.submitting") : t("login.submit")}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: 12, color: "var(--sub)" }}>{t("common.or")}</span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button type="button" className="btn-secondary btn" onClick={() => handleProvider("google")}>
          {t("common.continueGoogle")}
        </button>
        {/* 카카오 로그인: 사업자 등록 후 동의항목(이메일) 설정 완료되면 다시 노출 */}
      </div>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--sub)", marginTop: 28 }}>
        {t("login.noAccount")}{" "}
        <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>
          {t("login.signupLink")}
        </Link>
      </p>
    </main>
  );
}
