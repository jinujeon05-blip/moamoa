import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPasswordForEmail } = useAuth();

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
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>이메일을 확인해주세요</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
          <strong style={{ color: "var(--text)" }}>{email}</strong>로 비밀번호 재설정 링크를
          보냈어요.
        </p>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 28 }}>
          메일함의 링크를 클릭해서 새 비밀번호를 설정해주세요.
        </p>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
          로그인으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>비밀번호 재설정</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        가입한 이메일로 재설정 링크를 보내드려요
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
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? "전송 중..." : "재설정 링크 보내기"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--sub)", marginTop: 28 }}>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          로그인으로 돌아가기
        </Link>
      </p>
    </main>
  );
}
