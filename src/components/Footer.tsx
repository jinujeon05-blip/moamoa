import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user, deleteAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const showDeleteAccount = Boolean(user) && location.pathname === "/mypage";

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    const errorMessage = await deleteAccount();
    setDeleting(false);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    navigate("/");
  };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 24px",
        marginTop: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          color: "var(--sub)",
        }}
      >
        <span>© 2026 모아모아</span>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
          <Link to="/guide" style={{ color: "var(--sub)" }}>
            이용가이드
          </Link>
          {showDeleteAccount &&
            (confirming ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>탈퇴하면 모든 데이터가 삭제돼요. 계속할까요?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#F04452",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {deleting ? "탈퇴 중..." : "탈퇴"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--sub)",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  취소
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--sub)",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                회원 탈퇴
              </button>
            ))}
          <Link to="/terms" style={{ color: "var(--sub)" }}>
            이용약관
          </Link>
          <Link to="/privacy" style={{ color: "var(--sub)" }}>
            개인정보처리방침
          </Link>
        </div>
      </div>
      {error && (
        <p style={{ maxWidth: 1200, margin: "8px auto 0", fontSize: 12, color: "#F04452", textAlign: "right" }}>
          {error}
        </p>
      )}
    </footer>
  );
}
