import { forwardRef } from "react";
import type { CSSProperties } from "react";
import type { Receipt } from "../types";
import { formatCurrency } from "../utils/format";
import type { PageOrientation } from "../utils/pdfExport";
import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";

const A4_PORTRAIT = { width: 794, height: 1123 };
const PAGE_GAP_PX = 24;

const GRID_LAYOUT: Record<number, { cols: number; rows: number }> = {
  4: { cols: 2, rows: 2 },
  6: { cols: 2, rows: 3 },
  9: { cols: 3, rows: 3 },
};

const MEMO_KEYS = [
  "식사",
  "카페/음료",
  "교통비",
  "주유",
  "숙박",
  "간식",
  "회식",
  "문구/사무용품",
  "택배/배송",
  "주차",
];

function getMemoSuggestions(language: Language): string[] {
  return MEMO_KEYS.map((key) => translations[language][`a4Sheet.memo.${key}`] ?? key);
}

const MEMO_DATALIST_ID = "receipt-memo-suggestions";

interface Props {
  receipts: Receipt[];
  total: number;
  orientation: PageOrientation;
  itemsPerPage: number;
  onAmountChange: (id: string, amount: number) => void;
  onMemoChange: (id: string, memo: string) => void;
  onRemove: (id: string) => void;
  onRecognize: (id: string) => void;
  recognizingId: string | null;
  onAddClick: () => void;
}

function paginate<T>(items: T[], perPage: number): T[][] {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  return pages;
}

function pageDims(orientation: PageOrientation) {
  return orientation === "portrait"
    ? A4_PORTRAIT
    : { width: A4_PORTRAIT.height, height: A4_PORTRAIT.width };
}

/* ===== 다운로드용 정적 렌더링 (화면 밖, 항상 고정 해상도) ===== */

function StaticPageContent({
  pageItems,
  pageIndex,
  pageCount,
  isLastPage,
  total,
  cols,
  rows,
  t,
  language,
}: {
  pageItems: Receipt[];
  pageIndex: number;
  pageCount: number;
  isLastPage: boolean;
  total: number;
  cols: number;
  rows: number;
  t: (key: string) => string;
  language: Language;
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>{t("a4Sheet.staticHeading")}</h2>
        <span style={{ fontSize: 12, color: "var(--sub)" }}>
          {pageIndex + 1} / {pageCount}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 12,
        }}
      >
        {pageItems.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <img
              src={r.imageUrl}
              alt={r.fileName}
              style={{ width: "100%", flex: 1, objectFit: "contain", minHeight: 0 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
              <span style={{ color: "var(--sub)" }}>{r.memo || r.fileName}</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(r.amount || 0, language)}</span>
            </div>
          </div>
        ))}
        {pageItems.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              gridRow: "1 / -1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--sub)",
              fontSize: 14,
            }}
          >
            {t("a4Sheet.emptyMessage")}
          </div>
        )}
      </div>

      {isLastPage && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <span style={{ color: "var(--sub)", fontWeight: 500 }}>{t("a4Sheet.total")}</span>
          <span style={{ color: "var(--primary)" }}>{formatCurrency(total, language)}</span>
        </div>
      )}
    </>
  );
}

/* ===== 화면에 보이는 편집 가능한 카드 ===== */

const iconPath = {
  x: "M18 6 6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  wand: "M13 2 3 14h7l-1 8 10-12h-7l1-8z",
};

function FilledCell({
  item,
  onAmountChange,
  onMemoChange,
  onRemove,
  onRecognize,
  recognizing,
  t,
  language,
}: {
  item: Receipt;
  onAmountChange: (id: string, amount: number) => void;
  onMemoChange: (id: string, memo: string) => void;
  onRemove: (id: string) => void;
  onRecognize: (id: string) => void;
  recognizing: boolean;
  t: (key: string) => string;
  language: Language;
}) {
  return (
    <div
      style={{
        position: "relative",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
      }}
    >
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={t("a4Sheet.deleteAria")}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.85)",
          color: "var(--sub)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <svg className="icon" style={{ width: 14, height: 14 }} viewBox="0 0 24 24">
          <path d={iconPath.x} />
        </svg>
      </button>
      <img
        src={item.imageUrl}
        alt={item.fileName}
        style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", flexShrink: 0 }}
      />
      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <input
          type="text"
          list={MEMO_DATALIST_ID}
          placeholder={t("a4Sheet.memoPlaceholder")}
          value={item.memo}
          onChange={(e) => onMemoChange(item.id, e.target.value)}
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid var(--border)",
            fontFamily: "inherit",
            fontSize: 12.5,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 12, color: "var(--sub)", flexShrink: 0 }}>
            {language === "vi" ? "₫" : "₩"}
          </span>
          <input
            type="number"
            placeholder={t("a4Sheet.amountPlaceholder")}
            value={item.amount || ""}
            onChange={(e) => onAmountChange(item.id, Number(e.target.value))}
            style={{
              flex: 1,
              minWidth: 0,
              boxSizing: "border-box",
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 12.5,
            }}
          />
          <button
            type="button"
            onClick={() => onRecognize(item.id)}
            disabled={recognizing}
            title={t("a4Sheet.recognizeTitle")}
            style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg className="icon" style={{ width: 13, height: 13 }} viewBox="0 0 24 24">
              <path d={iconPath.wand} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCell({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "1.5px dashed var(--border)",
        borderRadius: 10,
        background: "transparent",
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--sub)",
        cursor: "pointer",
      }}
    >
      <svg className="icon" style={{ width: 22, height: 22 }} viewBox="0 0 24 24">
        <path d={iconPath.plus} />
      </svg>
    </button>
  );
}

function InteractivePage({
  pageItems,
  itemsPerPage,
  cols,
  pageIndex,
  pageCount,
  isLastPage,
  total,
  orientation,
  onAmountChange,
  onMemoChange,
  onRemove,
  onRecognize,
  recognizingId,
  onAddClick,
  t,
  language,
}: {
  pageItems: Receipt[];
  itemsPerPage: number;
  cols: number;
  pageIndex: number;
  pageCount: number;
  isLastPage: boolean;
  total: number;
  orientation: PageOrientation;
  onAmountChange: (id: string, amount: number) => void;
  onMemoChange: (id: string, memo: string) => void;
  onRemove: (id: string) => void;
  onRecognize: (id: string) => void;
  recognizingId: string | null;
  onAddClick: () => void;
  t: (key: string) => string;
  language: Language;
}) {
  const dims = pageDims(orientation);
  const slotCount = isLastPage ? Math.max(itemsPerPage, pageItems.length) : pageItems.length;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        padding: 20,
        maxWidth: dims.width,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h2 style={{ fontSize: 16 }}>{t("a4Sheet.interactiveHeading")}</h2>
        <span style={{ fontSize: 12, color: "var(--sub)" }}>
          A4 {orientation === "portrait" ? "210×297mm" : "297×210mm"} · page {pageIndex + 1}/{pageCount}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
        {Array.from({ length: slotCount }).map((_, i) => {
          const item = pageItems[i];
          if (item) {
            return (
              <FilledCell
                key={item.id}
                item={item}
                onAmountChange={onAmountChange}
                onMemoChange={onMemoChange}
                onRemove={onRemove}
                onRecognize={onRecognize}
                recognizing={recognizingId === item.id}
                t={t}
                language={language}
              />
            );
          }
          if (isLastPage) return <EmptyCell key={`empty-${i}`} onClick={onAddClick} />;
          return null;
        })}
      </div>

      {isLastPage && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <span style={{ color: "var(--sub)", fontWeight: 500 }}>{t("a4Sheet.grandTotal")}</span>
          <span style={{ color: "var(--primary)" }}>{formatCurrency(total, language)}</span>
        </div>
      )}
    </div>
  );
}

const A4Sheet = forwardRef<HTMLDivElement, Props>(
  (
    {
      receipts,
      total,
      orientation,
      itemsPerPage,
      onAmountChange,
      onMemoChange,
      onRemove,
      onRecognize,
      recognizingId,
      onAddClick,
    },
    forwardedRef
  ) => {
    const { t, language } = useLanguage();
    const { cols, rows } = GRID_LAYOUT[itemsPerPage] ?? GRID_LAYOUT[6];
    const dims = pageDims(orientation);
    const pages = paginate(receipts, itemsPerPage);

    const pageBoxStyle: CSSProperties = {
      width: dims.width,
      height: dims.height,
      background: "#ffffff",
      border: "1px solid var(--border)",
      padding: 60,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    };

    const memoSuggestions = Array.from(
      new Set([...getMemoSuggestions(language), ...receipts.map((r) => r.memo).filter(Boolean)])
    );

    return (
      <div style={{ width: "100%" }}>
        <datalist id={MEMO_DATALIST_ID}>
          {memoSuggestions.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>

        {/* 화면에 보이는 편집 가능한 미리보기 */}
        <div style={{ display: "flex", flexDirection: "column", gap: PAGE_GAP_PX }}>
          {pages.map((pageItems, pageIndex) => (
            <InteractivePage
              key={pageIndex}
              pageItems={pageItems}
              itemsPerPage={itemsPerPage}
              cols={cols}
              pageIndex={pageIndex}
              pageCount={pages.length}
              isLastPage={pageIndex === pages.length - 1}
              total={total}
              orientation={orientation}
              onAmountChange={onAmountChange}
              onMemoChange={onMemoChange}
              onRemove={onRemove}
              onRecognize={onRecognize}
              recognizingId={recognizingId}
              onAddClick={onAddClick}
              t={t}
              language={language}
            />
          ))}
        </div>

        {/* 다운로드용 원본 해상도 렌더링 (화면 밖에 배치) */}
        <div style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden" }}>
          <div
            ref={forwardedRef}
            style={{ position: "absolute", top: 0, left: 0, display: "flex", flexDirection: "column", gap: PAGE_GAP_PX }}
            aria-hidden="true"
          >
            {pages.map((pageItems, pageIndex) => (
              <div key={pageIndex} className="a4-page" style={pageBoxStyle}>
                <StaticPageContent
                  pageItems={pageItems}
                  pageIndex={pageIndex}
                  pageCount={pages.length}
                  isLastPage={pageIndex === pages.length - 1}
                  total={total}
                  cols={cols}
                  rows={rows}
                  t={t}
                  language={language}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

A4Sheet.displayName = "A4Sheet";

export default A4Sheet;
