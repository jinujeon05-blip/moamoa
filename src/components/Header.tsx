import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Header() {
  const { user } = useAuth();

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "16px 24px",
      }}
    >
      <div
        className="header-inner"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "inherit",
            minWidth: 0,
            flexShrink: 1,
          }}
        >
          <Logo size={32} />
          <h1 style={{ fontSize: 20, whiteSpace: "nowrap" }}>모아모아</h1>
          <span
            className="header-caption"
            style={{
              color: "var(--sub)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            MoaMoa
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <Link
                to="/stats"
                className="btn-ghost btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                통계
              </Link>
              <Link
                to="/mypage"
                className="btn-secondary btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                마이페이지
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-ghost btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
