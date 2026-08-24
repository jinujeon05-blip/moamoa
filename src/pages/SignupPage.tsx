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

export default function SignupPage() {
  usePageMeta("회원가입 · 모아모아");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signUp, signInWithProvider } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError(t("signup.errors.agree"));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t("signup.errors.mismatch"));
      return;
    }
    setSubmitting(true);
    setError("");
    const { error: errorMessage, needsConfirmation } = await signUp(email, password);
    setSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    if (needsConfirmation) {
      setConfirmationSent(true);
      return;
    }
    navigate("/mypage");
  };

  const handleProvider = async (provider: "google" | "kakao") => {
    if (!agreed) {
      setError(t("signup.errors.agree"));
      return;
    }
    setError("");
    const errorMessage = await signInWithProvider(provider);
    if (errorMessage) setError(errorMessage);
  };

  if (confirmationSent) {
    return (
      <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>{t("signup.confirmTitle")}</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
          <strong style={{ color: "var(--text)" }}>{email}</strong>
          {t("signup.confirmSentSuffix")}
        </p>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 28 }}>
          {t("signup.confirmInstruction")}
        </p>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
          {t("signup.backToLogin")}
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>{t("signup.title")}</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        {t("signup.subtitle")}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder={t("signup.emailPlaceholder")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder={t("signup.passwordPlaceholder")}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder={t("signup.passwordConfirmPlaceholder")}
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          style={inputStyle}
        />
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 13,
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <span>
            <Link to="/terms" target="_blank" style={{ color: "var(--primary)", fontWeight: 600 }}>
              {t("signup.agreeTerms")}
            </Link>
            {t("signup.agreeAnd")}
            <Link to="/privacy" target="_blank" style={{ color: "var(--primary)", fontWeight: 600 }}>
              {t("signup.agreePrivacy")}
            </Link>
            {t("signup.agreeSuffix")}
          </span>
        </label>
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? t("signup.submitting") : t("signup.submit")}
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
        {t("signup.haveAccount")}{" "}
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          {t("signup.loginLink")}
        </Link>
      </p>
    </main>
  );
}
