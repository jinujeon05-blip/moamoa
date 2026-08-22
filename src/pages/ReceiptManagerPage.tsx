import { useRef } from "react";
import { Link } from "react-router-dom";
import { useReceipts } from "../hooks/useReceipts";
import ReceiptUploader from "../components/ReceiptUploader";
import ReceiptThumbnail from "../components/ReceiptThumbnail";
import A4Sheet from "../components/A4Sheet";
import SummaryBar from "../components/SummaryBar";
import SaveBatchPanel from "../components/SaveBatchPanel";
import { exportPagesToPdf, renderPagesToPdfBlob } from "../utils/pdfExport";
import { usePageMeta } from "../hooks/usePageMeta";

export default function ReceiptManagerPage() {
  usePageMeta(
    "모아모아 · 영수증 업로드하고 A4로 정리하기",
    "영수증 이미지를 업로드해 A4 용지 형태로 정렬하고 PDF로 다운로드하세요. 지출 합계도 자동으로 계산돼요."
  );
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
    <>
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

    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 24px 40px" }}>
      <h2 style={{ fontSize: 20, marginBottom: 20 }}>모아모아로 영수증 정리가 쉬워져요</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            title: "자동 A4 정렬",
            desc: "영수증 사진을 올리면 A4 용지 형태로 자동 정렬돼서 바로 PDF로 만들 수 있어요.",
          },
          {
            title: "금액 자동 인식",
            desc: "영수증 사진 속 숫자를 읽어와 금액을 자동으로 채워주는 OCR 기능을 제공해요.",
          },
          {
            title: "안전한 저장",
            desc: "로그인 후 정리 내역을 저장하면 언제든 다시 찾아보고, PC·모바일 어디서든 확인할 수 있어요.",
          },
          {
            title: "지출 통계·엑셀",
            desc: "카테고리별 지출과 월별 추이를 통계로 보고, 정리 내역을 엑셀로도 내려받을 수 있어요.",
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 18,
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{f.title}</p>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "var(--text)" }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13.5, color: "var(--sub)", marginTop: 20 }}>
        더 자세한 사용법은{" "}
        <Link to="/guide" style={{ color: "var(--primary)", fontWeight: 600 }}>
          이용 가이드
        </Link>
        와{" "}
        <Link to="/faq" style={{ color: "var(--primary)", fontWeight: 600 }}>
          자주 묻는 질문
        </Link>
        에서 확인해보세요.
      </p>
    </section>
    </>
  );
}
