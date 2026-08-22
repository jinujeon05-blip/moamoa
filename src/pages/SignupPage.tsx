import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("이용약관과 개인정보처리방침에 동의해주세요");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요");
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
      setError("이용약관과 개인정보처리방침에 동의해주세요");
      return;
    }
    setError("");
    const errorMessage = await signInWithProvider(provider);
    if (errorMessage) setError(errorMessage);
  };

  if (confirmationSent) {
    return (
      <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>이메일을 확인해주세요</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
          <strong style={{ color: "var(--text)" }}>{email}</strong>로 인증 메일을 보냈어요.
        </p>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 28 }}>
          메일함의 링크를 클릭하면 가입이 완료돼요.
        </p>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
          로그인으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>회원가입</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        몇 초면 가입이 끝나요
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="이메일"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
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
              이용약관
            </Link>
            {" 및 "}
            <Link to="/privacy" target="_blank" style={{ color: "var(--primary)", fontWeight: 600 }}>
              개인정보처리방침
            </Link>
            에 동의합니다 (필수)
          </span>
        </label>
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? "가입 처리 중..." : "회원가입"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: 12, color: "var(--sub)" }}>또는</span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button type="button" className="btn-secondary btn" onClick={() => handleProvider("google")}>
          Google로 계속하기
        </button>
        {/* 카카오 로그인: 사업자 등록 후 동의항목(이메일) 설정 완료되면 다시 노출 */}
      </div>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--sub)", marginTop: 28 }}>
        이미 계정이 있으신가요?{" "}
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          로그인
        </Link>
      </p>
    </main>
  );
}
