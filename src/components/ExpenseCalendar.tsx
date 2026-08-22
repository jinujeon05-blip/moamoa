import { useMemo, useState } from "react";
import type { ReceiptBatch } from "../types";
import { formatWon } from "../utils/format";
import { CATEGORY_COLORS } from "../constants/categoryColors";

interface Props {
  batches: ReceiptBatch[];
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function compactWon(amount: number): string {
  if (amount >= 10000) {
    const man = amount / 10000;
    return `${Number.isInteger(man) ? man : man.toFixed(1)}만`;
  }
  return amount.toLocaleString("ko-KR");
}

export default function ExpenseCalendar({ batches }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, ReceiptBatch[]>();
    for (const b of batches) {
      const list = map.get(b.batchDate) ?? [];
      list.push(b);
      map.set(b.batchDate, list);
    }
    return map;
  }, [batches]);

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goPrevMonth = () => {
    setSelectedDate(null);
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    setSelectedDate(null);
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
  const monthTotal = Array.from(byDate.entries())
    .filter(([date]) => date.startsWith(monthPrefix))
    .reduce((sum, [, items]) => sum + items.reduce((s, b) => s + b.totalAmount, 0), 0);

  const selectedItems = selectedDate ? byDate.get(selectedDate) ?? [] : [];

  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={goPrevMonth}
          aria-label="이전 달"
          style={{ padding: 6 }}
        >
          <svg className="icon" style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <h2 style={{ fontSize: 16, margin: 0 }}>
          {viewYear}년 {viewMonth + 1}월
        </h2>
        <button
          type="button"
          className="btn-ghost"
          onClick={goNextMonth}
          aria-label="다음 달"
          style={{ padding: 6 }}
        >
          <svg className="icon" style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p style={{ textAlign: "center", fontSize: 13, color: "var(--sub)", margin: "4px 0 16px" }}>
        이번 달 합계 {formatWon(monthTotal)}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--sub)",
              fontWeight: 600,
              padding: "4px 0",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const dateKey = toDateKey(viewYear, viewMonth, day);
          const items = byDate.get(dateKey) ?? [];
          const dayTotal = items.reduce((s, b) => s + b.totalAmount, 0);
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const hasData = items.length > 0;
          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => hasData && setSelectedDate(isSelected ? null : dateKey)}
              disabled={!hasData}
              style={{
                width: "100%",
                aspectRatio: "1",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderRadius: 8,
                border: isSelected
                  ? "1.5px solid var(--primary)"
                  : isToday
                  ? "1.5px solid var(--border)"
                  : "1.5px solid transparent",
                background: hasData ? "#EAF2FF" : "transparent",
                cursor: hasData ? "pointer" : "default",
                fontFamily: "inherit",
                padding: 2,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: isToday ? "var(--primary)" : "var(--text)",
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day}
              </span>
              {dayTotal > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)" }}>
                  {compactWon(dayTotal)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && selectedItems.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{selectedDate}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                  gap: 8,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: CATEGORY_COLORS[item.category] ?? "var(--sub)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title}
                  </span>
                </span>
                <span style={{ fontWeight: 600, flexShrink: 0 }}>{formatWon(item.totalAmount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
