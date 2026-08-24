import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Logo from "./Logo";

export default function Header() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg)",
              borderRadius: 999,
              padding: 2,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => setLanguage("ko")}
              aria-label="한국어"
              style={{
                padding: "4px 9px",
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                background: language === "ko" ? "var(--surface)" : "transparent",
                color: language === "ko" ? "var(--primary)" : "var(--sub)",
                boxShadow: language === "ko" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              KR
            </button>
            <button
              type="button"
              onClick={() => setLanguage("vi")}
              aria-label="Tiếng Việt"
              style={{
                padding: "4px 9px",
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                background: language === "vi" ? "var(--surface)" : "transparent",
                color: language === "vi" ? "var(--primary)" : "var(--sub)",
                boxShadow: language === "vi" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              VN
            </button>
          </div>
          {user ? (
            <>
              <Link
                to="/stats"
                className="btn-ghost btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                {t("header.stats")}
              </Link>
              <Link
                to="/mypage"
                className="btn-secondary btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                {t("header.mypage")}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-ghost btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                {t("header.login")}
              </Link>
              <Link
                to="/signup"
                className="btn header-nav-btn"
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              >
                {t("header.signup")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
