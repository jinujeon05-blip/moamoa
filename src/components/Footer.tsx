import { Link } from "react-router-dom";

export default function Footer() {
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
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/terms" style={{ color: "var(--sub)" }}>
            이용약관
          </Link>
          <Link to="/privacy" style={{ color: "var(--sub)" }}>
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
