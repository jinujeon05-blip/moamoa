import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Receipt } from "../types";
import { formatWon } from "../utils/format";

const ITEMS_PER_PAGE = 6; // 2열 x 3행
const PAGE_WIDTH_PX = 794; // A4 210mm @ 96dpi
const PAGE_HEIGHT_PX = 1123; // A4 297mm @ 96dpi
const PAGE_GAP_PX = 24;

interface Props {
  receipts: Receipt[];
  total: number;
}

function paginate(receipts: Receipt[]): Receipt[][] {
  if (receipts.length === 0) return [[]];
  const pages: Receipt[][] = [];
  for (let i = 0; i < receipts.length; i += ITEMS_PER_PAGE) {
    pages.push(receipts.slice(i, i + ITEMS_PER_PAGE));
  }
  return pages;
}

function PageContent({
  pageItems,
  pageIndex,
  pageCount,
  isLastPage,
  total,
}: {
  pageItems: Receipt[];
  pageIndex: number;
  pageCount: number;
  isLastPage: boolean;
  total: number;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 18 }}>모아모아 영수증 정리</h2>
        <span style={{ fontSize: 12, color: "var(--sub)" }}>
          {pageIndex + 1} / {pageCount}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              <span style={{ color: "var(--sub)" }}>{r.memo || r.fileName}</span>
              <span style={{ fontWeight: 600 }}>{formatWon(r.amount || 0)}</span>
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
            업로드한 영수증이 여기에 정렬됩니다
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
          <span style={{ color: "var(--sub)", fontWeight: 500 }}>합계</span>
          <span style={{ color: "var(--primary)" }}>{formatWon(total)}</span>
        </div>
      )}
    </>
  );
}

const pageBoxStyle: CSSProperties = {
  width: PAGE_WIDTH_PX,
  height: PAGE_HEIGHT_PX,
  background: "#ffffff",
  border: "1px solid var(--border)",
  padding: 60,
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
};

const A4Sheet = forwardRef<HTMLDivElement, Props>(({ receipts, total }, forwardedRef) => {
  const exportContainerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useImperativeHandle(forwardedRef, () => exportContainerRef.current as HTMLDivElement);

  // 미리보기 영역 너비에 맞춰 축소 표시할 배율만 계산 (다운로드용 원본은 별도로 항상 원본 해상도 유지)
  useEffect(() => {
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    const observer = new ResizeObserver((entries) => {
      const availableWidth = entries[0].contentRect.width;
      setScale(Math.min(1, availableWidth / PAGE_WIDTH_PX));
    });
    observer.observe(wrapEl);
    return () => observer.disconnect();
  }, []);

  const pages = paginate(receipts);

  return (
    <div ref={wrapRef} style={{ width: "100%", minWidth: 0 }}>
      {/* 화면에 보이는 축소 미리보기 */}
      <div style={{ display: "flex", flexDirection: "column", gap: PAGE_GAP_PX * scale }}>
        {pages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              width: PAGE_WIDTH_PX * scale,
              height: PAGE_HEIGHT_PX * scale,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: PAGE_WIDTH_PX,
                height: PAGE_HEIGHT_PX,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <div style={pageBoxStyle}>
                <PageContent
                  pageItems={pageItems}
                  pageIndex={pageIndex}
                  pageCount={pages.length}
                  isLastPage={pageIndex === pages.length - 1}
                  total={total}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 다운로드용 원본 해상도 렌더링 (화면 밖에 배치, 항상 794x1123 고정) */}
      <div style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden" }}>
        <div
          ref={exportContainerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            gap: PAGE_GAP_PX,
          }}
          aria-hidden="true"
        >
          {pages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className="a4-page" style={pageBoxStyle}>
              <PageContent
                pageItems={pageItems}
                pageIndex={pageIndex}
                pageCount={pages.length}
                isLastPage={pageIndex === pages.length - 1}
                total={total}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

A4Sheet.displayName = "A4Sheet";

export default A4Sheet;
