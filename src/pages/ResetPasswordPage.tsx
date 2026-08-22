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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요");
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
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>링크가 유효하지 않아요</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 28 }}>
          비밀번호 재설정 링크가 만료되었거나 이미 사용됐어요.
        </p>
        <Link to="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
          다시 요청하기
        </Link>
      </main>
    );
  }

  if (done) {
    return (
      <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>비밀번호가 변경됐어요</h1>
        <p style={{ color: "var(--sub)", fontSize: 14 }}>잠시 후 마이페이지로 이동해요.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 380, margin: "60px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>새 비밀번호 설정</h1>
      <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>
        새로 사용할 비밀번호를 입력해주세요
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="password"
          placeholder="새 비밀번호 (6자 이상)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={{ color: "#F04452", fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={submitting}>
          {submitting ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </main>
  );
}
