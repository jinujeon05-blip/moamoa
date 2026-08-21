import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signUp, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요");
      return;
    }
    setSubmitting(true);
    setError("");
    const errorMessage = await signUp(email, password);
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
