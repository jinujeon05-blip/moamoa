interface Props {
  blobUrl: string;
  title: string;
  onClose: () => void;
}

export default function PdfPreviewModal({ blobUrl, title, onClose }: Props) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${title}.pdf`;
    link.click();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          width: "100%",
          maxWidth: 820,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{title}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" style={{ padding: "8px 16px" }} onClick={handleDownload}>
              다운로드
            </button>
            <button className="btn-secondary btn" style={{ padding: "8px 16px" }} onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
        <iframe
          src={blobUrl}
          title={title}
          style={{ flex: 1, border: "none", minHeight: 0 }}
        />
      </div>
    </div>
  );
}
