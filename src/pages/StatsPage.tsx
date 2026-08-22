import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useReceiptBatches } from "../hooks/useReceiptBatches";
import { CATEGORY_COLORS } from "../constants/categoryColors";
import { formatWon } from "../utils/format";
import { toLocalMonthStr } from "../utils/date";
import ExpenseCalendar from "../components/ExpenseCalendar";

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // YYYY-MM
}

function monthLabel(key: string): string {
  const [, m] = key.split("-");
  return `${Number(m)}월`;
}

export default function StatsPage() {
  const { user } = useAuth();
  const { batches, loading } = useReceiptBatches(user?.id);
  const [view, setView] = useState<"summary" | "calendar">("summary");

  const now = new Date();
  const thisMonthKey = toLocalMonthStr(now);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = toLocalMonthStr(lastMonthDate);

  const thisMonthTotal = useMemo(
    () => batches.filter((b) => monthKey(b.batchDate) === thisMonthKey).reduce((s, b) => s + b.totalAmount, 0),
    [batches, thisMonthKey]
  );
  const lastMonthTotal = useMemo(
    () => batches.filter((b) => monthKey(b.batchDate) === lastMonthKey).reduce((s, b) => s + b.totalAmount, 0),
    [batches, lastMonthKey]
  );
  const delta = lastMonthTotal === 0 ? null : Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of batches) map.set(b.category, (map.get(b.category) ?? 0) + b.totalAmount);
    return Array.from(map.entries())
      .filter(([, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [batches]);

  const categoryMax = categoryTotals[0]?.[1] ?? 0;
  const categoryGrandTotal = categoryTotals.reduce((sum, [, amount]) => sum + amount, 0);

  const monthlyTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      map.set(toLocalMonthStr(d), 0);
    }
    for (const b of batches) {
      const key = monthKey(b.batchDate);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + b.totalAmount);
    }
    return Array.from(map.entries());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batches]);

  const monthlyMax = Math.max(...monthlyTotals.map(([, v]) => v), 1);

  if (loading) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <p style={{ color: "var(--sub)", fontSize: 14, textAlign: "center", padding: "60px 0" }}>
          불러오는 중...
        </p>
      </main>
    );
  }

  if (batches.length === 0) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>통계</h1>
        <p style={{ color: "var(--sub)", fontSize: 14, textAlign: "center", padding: "60px 0" }}>
          아직 정리한 영수증 내역이 없어요. 내역을 저장하면 통계가 여기에 표시돼요.
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>통계</h1>
        <div style={{ display: "flex", gap: 4, background: "var(--bg)", padding: 4, borderRadius: 999 }}>
          <button
            type="button"
            onClick={() => setView("summary")}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: view === "summary" ? "var(--surface)" : "transparent",
              color: view === "summary" ? "var(--primary)" : "var(--sub)",
              boxShadow: view === "summary" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            요약
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: view === "calendar" ? "var(--surface)" : "transparent",
              color: view === "calendar" ? "var(--primary)" : "var(--sub)",
              boxShadow: view === "calendar" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            달력
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <ExpenseCalendar batches={batches} />
      ) : (
        <>
      {/* 이번 달 지출 - 스탯 타일 */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "var(--sub)" }}>이번 달 지출</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#191f28" }}>
            {formatWon(thisMonthTotal)}
          </span>
          {delta !== null && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: delta > 0 ? "#d03b3b" : delta < 0 ? "#006300" : "var(--sub)",
              }}
            >
              지난달 대비 {delta > 0 ? "+" : ""}
              {delta}%
            </span>
          )}
        </div>
      </section>

      {/* 카테고리별 지출 */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 15, marginBottom: 16 }}>카테고리별 지출</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {categoryTotals.map(([category, amount]) => {
            const pct = categoryGrandTotal === 0 ? 0 : Math.round((amount / categoryGrandTotal) * 100);
            const widthPct = categoryMax === 0 ? 0 : (amount / categoryMax) * 100;
            return (
              <div key={category}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text)" }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: CATEGORY_COLORS[category] ?? "var(--sub)",
                        flexShrink: 0,
                      }}
                    />
                    {category}
                  </span>
                  <span style={{ color: "var(--sub)" }}>
                    {formatWon(amount)} · {pct}%
                  </span>
                </div>
                <div style={{ height: 10, background: "var(--bg)", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${widthPct}%`,
                      height: "100%",
                      background: CATEGORY_COLORS[category] ?? "var(--sub)",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 최근 6개월 추이 */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 20,
        }}
      >
        <h2 style={{ fontSize: 15, marginBottom: 16 }}>최근 6개월 추이</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
          {monthlyTotals.map(([key, amount]) => {
            const heightPct = monthlyMax === 0 ? 0 : (amount / monthlyMax) * 100;
            const isCurrent = key === thisMonthKey;
            return (
              <div
                key={key}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: `${Math.max(heightPct, amount > 0 ? 3 : 0)}%`,
                      background: isCurrent ? "var(--primary)" : "#cde2fb",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.2s",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "var(--sub)", marginTop: 6 }}>{monthLabel(key)}</span>
              </div>
            );
          })}
        </div>
      </section>
        </>
      )}
    </main>
  );
}
