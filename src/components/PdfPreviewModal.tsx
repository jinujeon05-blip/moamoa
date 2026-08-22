import { useEffect, useRef, useState } from "react";

interface Props {
  blobUrl: string;
  title: string;
  onClose: () => void;
}

export default function PdfPreviewModal({ blobUrl, title, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).href;

        const doc = await pdfjsLib.getDocument({ url: blobUrl }).promise;
        const container = containerRef.current;
        if (cancelled || !container) return;
        container.innerHTML = "";

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          const page = await doc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.marginBottom = "12px";
          canvas.style.borderRadius = "4px";
          canvas.style.boxShadow = "0 1px 6px rgba(0,0,0,0.12)";
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          if (cancelled) return;
          container.appendChild(canvas);
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blobUrl]);

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
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 16, background: "var(--bg)" }}>
          {status === "loading" && (
            <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, padding: "40px 0" }}>
              불러오는 중...
            </p>
          )}
          {status === "error" && (
            <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 14, padding: "40px 0" }}>
              미리보기를 불러오지 못했어요. 다운로드해서 확인해주세요.
            </p>
          )}
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
}
