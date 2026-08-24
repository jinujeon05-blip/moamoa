import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReceipts } from "../hooks/useReceipts";
import A4Sheet from "../components/A4Sheet";
import SaveBatchPanel from "../components/SaveBatchPanel";
import { exportPagesToPdf, exportPagesToJpg, renderPagesToPdfBlob } from "../utils/pdfExport";
import type { PageOrientation } from "../utils/pdfExport";
import { recognizeAmount } from "../utils/ocr";
import { CATEGORIES, DEFAULT_CATEGORY, getCategoryLabel } from "../constants/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLanguage } from "../context/LanguageContext";

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
  const { t, language } = useLanguage();
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
            placeholder={t("receiptManager.titlePlaceholder")}
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
                {getCategoryLabel(c, language)}
              </option>
            ))}
          </select>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as PageOrientation)}
            style={{ ...controlStyle, flex: "1 1 120px", minWidth: 0 }}
          >
            <option value="portrait">{t("receiptManager.orientationPortrait")}</option>
            <option value="landscape">{t("receiptManager.orientationLandscape")}</option>
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{ ...controlStyle, flex: "1 1 130px", minWidth: 0 }}
          >
            <option value={4}>{t("receiptManager.itemsPerPage4")}</option>
            <option value={6}>{t("receiptManager.itemsPerPage6")}</option>
            <option value={9}>{t("receiptManager.itemsPerPage9")}</option>
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
            {t("receiptManager.countSheets")} {receipts.length}{t("receiptManager.countSheetsUnit")} · {pageCount}{t("receiptManager.countPagesUnit")}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" className="btn-secondary btn" onClick={triggerAdd}>
              {t("receiptManager.addButton")}
            </button>
            <button
              type="button"
              className="btn-secondary btn"
              onClick={handleDownloadPdf}
              disabled={disabled || downloading !== null}
            >
              {downloading === "pdf" ? t("receiptManager.generating") : t("receiptManager.downloadPdf")}
            </button>
            <button
              type="button"
              className="btn-secondary btn"
              onClick={handleDownloadJpg}
              disabled={disabled || downloading !== null}
            >
              {downloading === "jpg" ? t("receiptManager.generating") : t("receiptManager.downloadJpg")}
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
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t("receiptManager.heading")}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              title: t("receiptManager.feature1Title"),
              desc: t("receiptManager.feature1Desc"),
            },
            {
              title: t("receiptManager.feature2Title"),
              desc: t("receiptManager.feature2Desc"),
            },
            {
              title: t("receiptManager.feature3Title"),
              desc: t("receiptManager.feature3Desc"),
            },
            {
              title: t("receiptManager.feature4Title"),
              desc: t("receiptManager.feature4Desc"),
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
          {t("receiptManager.guidePrefix")}{" "}
          <Link to="/guide" style={{ color: "var(--primary)", fontWeight: 600 }}>
            {t("receiptManager.guideLink")}
          </Link>
          {t("receiptManager.guideMid")}{" "}
          <Link to="/faq" style={{ color: "var(--primary)", fontWeight: 600 }}>
            {t("receiptManager.faqLink")}
          </Link>
          {t("receiptManager.guideSuffix")}
        </p>
      </section>
    </>
  );
}
