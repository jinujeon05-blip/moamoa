import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReceipts } from "../hooks/useReceipts";
import A4Sheet from "../components/A4Sheet";
import SaveBatchPanel from "../components/SaveBatchPanel";
import { exportPagesToPdf, exportPagesToJpg, renderPagesToPdfBlob } from "../utils/pdfExport";
import type { PageOrientation } from "../utils/pdfExport";
import { recognizeAmount } from "../utils/ocr";
import { CATEGORIES, DEFAULT_CATEGORY } from "../constants/categories";
import { usePageMeta } from "../hooks/usePageMeta";

const controlStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontFamily: "inherit",
  fontSize: 14,
  background: "var(--surface)",
};

export default function ReceiptManagerPage() {
  usePageMeta(
    "모아모아 · 영수증 업로드하고 A4로 정리하기",
    "영수증 이미지를 업로드해 A4 용지 형태로 정렬하고 PDF로 다운로드하세요. 지출 합계도 자동으로 계산돼요."
  );
  const { receipts, addFiles, updateAmount, updateMemo, removeReceipt, clearAll, total } =
    useReceipts();
  const a4ContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [recognizingId, setRecognizingId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"pdf" | "jpg" | null>(null);

  const pageCount = Math.max(1, Math.ceil(receipts.length / itemsPerPage));

  const triggerAdd = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleRecognize = async (id: string) => {
    const receipt = receipts.find((r) => r.id === id);
    if (!receipt) return;
    setRecognizingId(id);
    try {
      const amount = await recognizeAmount(receipt.imageUrl);
      if (amount) updateAmount(id, amount);
    } catch {
      // 인식 실패 시 조용히 무시 — 사용자가 직접 입력하면 됨
    } finally {
      setRecognizingId(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!a4ContainerRef.current) return;
    setDownloading("pdf");
    try {
      await exportPagesToPdf(a4ContainerRef.current, "moamoa-receipts.pdf", orientation);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadJpg = async () => {
    if (!a4ContainerRef.current) return;
    setDownloading("jpg");
    try {
      await exportPagesToJpg(a4ContainerRef.current, "moamoa-receipts");
    } finally {
      setDownloading(null);
    }
  };

  const getPdfBlob = async () => {
    if (!a4ContainerRef.current) return null;
    return renderPagesToPdfBlob(a4ContainerRef.current, orientation);
  };

  const handleSaved = () => {
    clearAll();
    setTitle("");
  };

  const disabled = receipts.length === 0;

  return (
    <>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        {/* 상단 설정 바 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <input
            type="text"
            placeholder="예: 2026년 6월 경비 영수증"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ ...controlStyle, flex: "2 1 220px", minWidth: 0 }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...controlStyle, flex: "1 1 120px", minWidth: 0 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as PageOrientation)}
            style={{ ...controlStyle, flex: "1 1 120px", minWidth: 0 }}
          >
            <option value="portrait">A4 (세로)</option>
            <option value="landscape">A4 (가로)</option>
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{ ...controlStyle, flex: "1 1 130px", minWidth: 0 }}
          >
            <option value={4}>4개 (2×2)</option>
            <option value={6}>6개 (2×3)</option>
            <option value={9}>9개 (3×3)</option>
          </select>
        </div>

        {/* 상태 + 액션 바 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--sub)" }}>
            영수증 {receipts.length}장 · {pageCount}페이지
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" className="btn-secondary btn" onClick={triggerAdd}>
              + 영수증 추가
            </button>
            <button
              type="button"
              className="btn-secondary btn"
              onClick={handleDownloadPdf}
              disabled={disabled || downloading !== null}
            >
              {downloading === "pdf" ? "생성 중..." : "PDF로 저장"}
            </button>
            <button
              type="button"
              className="btn-secondary btn"
              onClick={handleDownloadJpg}
              disabled={disabled || downloading !== null}
            >
              {downloading === "jpg" ? "생성 중..." : "JPG로 저장"}
            </button>
            <SaveBatchPanel
              title={title}
              category={category}
              receiptCount={receipts.length}
              totalAmount={total}
              disabled={disabled}
              onSaved={handleSaved}
              getPdfBlob={getPdfBlob}
            />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />

        <A4Sheet
          ref={a4ContainerRef}
          receipts={receipts}
          total={total}
          orientation={orientation}
          itemsPerPage={itemsPerPage}
          onAmountChange={updateAmount}
          onMemoChange={updateMemo}
          onRemove={removeReceipt}
          onRecognize={handleRecognize}
          recognizingId={recognizingId}
          onAddClick={triggerAdd}
        />
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
