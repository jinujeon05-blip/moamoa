import { useRef } from "react";
import { useReceipts } from "../hooks/useReceipts";
import ReceiptUploader from "../components/ReceiptUploader";
import ReceiptThumbnail from "../components/ReceiptThumbnail";
import A4Sheet from "../components/A4Sheet";
import SummaryBar from "../components/SummaryBar";
import SaveBatchPanel from "../components/SaveBatchPanel";
import { exportPagesToPdf, renderPagesToPdfBlob } from "../utils/pdfExport";

export default function ReceiptManagerPage() {
  const { receipts, addFiles, updateAmount, updateMemo, removeReceipt, clearAll, total } =
    useReceipts();
  const a4ContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (a4ContainerRef.current) {
      await exportPagesToPdf(a4ContainerRef.current, "bboggl-receipts.pdf");
    }
  };

  const getPdfBlob = async () => {
    if (!a4ContainerRef.current) return null;
    return renderPagesToPdfBlob(a4ContainerRef.current);
  };

  return (
    <main className="receipt-layout">
      {/* 왼쪽: 업로드 + 목록 관리 */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ReceiptUploader onFiles={addFiles} />

        {receipts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {receipts.map((r) => (
              <ReceiptThumbnail
                key={r.id}
                receipt={r}
                onAmountChange={updateAmount}
                onMemoChange={updateMemo}
                onRemove={removeReceipt}
              />
            ))}
          </div>
        )}

        <SummaryBar
          count={receipts.length}
          total={total}
          onDownload={handleDownload}
          disabled={receipts.length === 0}
        />

        <SaveBatchPanel
          receiptCount={receipts.length}
          totalAmount={total}
          disabled={receipts.length === 0}
          onSaved={clearAll}
          getPdfBlob={getPdfBlob}
        />
      </section>

      {/* 오른쪽: A4 미리보기 */}
      <section
        style={{
          background: "var(--bg)",
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
        }}
      >
        <A4Sheet ref={a4ContainerRef} receipts={receipts} total={total} />
      </section>
    </main>
  );
}
