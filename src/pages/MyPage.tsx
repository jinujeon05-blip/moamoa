import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useReceiptBatches } from "../hooks/useReceiptBatches";
import { supabase } from "../lib/supabaseClient";
import { formatWon } from "../utils/format";
import { highlightMatch } from "../utils/highlightText";

type SortKey = "latest" | "amount";

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function thisMonthRange(): [string, string] {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return [toDateStr(from), toDateStr(now)];
}

function lastMonthRange(): [string, string] {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 0);
  return [toDateStr(from), toDateStr(to)];
}

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateName } = useProfile(user?.id, user?.email);
  const { batches, loading: batchesLoading, deleteBatch } = useReceiptBatches(user?.id);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  const hasActiveFilters = Boolean(dateFrom || dateTo || amountMin || amountMax);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setAmountMin("");
    setAmountMax("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = amountMin ? Number(amountMin) : null;
    const max = amountMax ? Number(amountMax) : null;

    let list = batches.filter((item) => {
      if (!item.title.toLowerCase().includes(q)) return false;
      if (dateFrom && item.batchDate < dateFrom) return false;
      if (dateTo && item.batchDate > dateTo) return false;
      if (min !== null && item.totalAmount < min) return false;
      if (max !== null && item.totalAmount > max) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sortKey === "latest"
        ? b.batchDate.localeCompare(a.batchDate)
        : b.totalAmount - a.totalAmount
    );
    return list;
  }, [batches, query, sortKey, dateFrom, dateTo, amountMin, amountMax]);

  const [openingId, setOpeningId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async (id: string, pdfPath: string | null) => {
    setDeletingId(id);
    const errorMessage = await deleteBatch(id, pdfPath);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (errorMessage) {
      alert("삭제 중 문제가 발생했어요: " + errorMessage);
    }
  };

  const openPdf = async (batchId: string, pdfPath: string) => {
    // 팝업 차단을 피하려면 클릭한 시점(동기)에 탭을 먼저 열고, URL이 준비되면 그 탭을 이동시켜야 함
    const newTab = window.open("", "_blank");
    setOpeningId(batchId);
    const { data, error } = await supabase.storage.from("receipt-pdfs").createSignedUrl(pdfPath, 60);
    setOpeningId(null);

    if (error || !data?.signedUrl) {
      newTab?.close();
      alert("PDF를 여는 중 문제가 발생했어요: " + (error?.message ?? "알 수 없는 오류"));
      return;
    }

    if (newTab) {
      newTab.location.href = data.signedUrl;
    } else {
      window.location.href = data.signedUrl;
    }
  };

  const startEditingName = () => {
    setNameDraft(profile?.name ?? "");
    setNameError("");
    setEditingName(true);
  };

  const saveName = async () => {
    if (!nameDraft.trim()) {
      setNameError("이름을 입력해주세요");
      return;
    }
    setSavingName(true);
    const errorMessage = await updateName(nameDraft.trim());
    setSavingName(false);
    if (errorMessage) {
      setNameError(errorMessage);
      return;
    }
    setEditingName(false);
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      {/* 프로필 카드 */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#EAF2FF",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {(profile?.name ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            {profileLoading ? (
              <p style={{ margin: 0, color: "var(--sub)", fontSize: 14 }}>불러오는 중...</p>
            ) : editingName ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontFamily: "inherit",
                      fontSize: 15,
                    }}
                  />
                  <button className="btn" style={{ padding: "6px 14px" }} onClick={saveName} disabled={savingName}>
                    저장
                  </button>
                  <button
                    className="btn-secondary btn"
                    style={{ padding: "6px 14px" }}
                    onClick={() => setEditingName(false)}
                  >
                    취소
                  </button>
                </div>
                {nameError && <p style={{ margin: 0, fontSize: 12, color: "#F04452" }}>{nameError}</p>}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{profile?.name}</p>
                <button className="btn-ghost" onClick={startEditingName} style={{ fontSize: 12 }}>
                  수정
                </button>
              </div>
            )}
            <p style={{ margin: "2px 0 0", color: "var(--sub)", fontSize: 13 }}>{profile?.email}</p>
          </div>
        </div>
        <button className="btn-secondary btn" onClick={handleLogout} style={{ flexShrink: 0 }}>
          로그아웃
        </button>
      </section>

      {/* 활동 내역 */}
      <section>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>영수증 정리 내역</h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="내역 검색 (제목)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 14,
            }}
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 14,
              background: "var(--surface)",
            }}
          >
            <option value="latest">최신순</option>
            <option value="amount">금액순</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          <button
            type="button"
            className="btn-secondary btn"
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={resetFilters}
          >
            전체
          </button>
          <button
            type="button"
            className="btn-secondary btn"
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => {
              const [from, to] = thisMonthRange();
              setDateFrom(from);
              setDateTo(to);
            }}
          >
            이번 달
          </button>
          <button
            type="button"
            className="btn-secondary btn"
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => {
              const [from, to] = lastMonthRange();
              setDateFrom(from);
              setDateTo(to);
            }}
          >
            지난 달
          </button>

          <span style={{ color: "var(--sub)" }}>기간</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 13,
            }}
          />
          <span style={{ color: "var(--sub)" }}>~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 13,
            }}
          />

          <span style={{ color: "var(--sub)", marginLeft: 8 }}>금액</span>
          <input
            type="number"
            placeholder="최소"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
            style={{
              width: 90,
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 13,
            }}
          />
          <span style={{ color: "var(--sub)" }}>~</span>
          <input
            type="number"
            placeholder="최대"
            value={amountMax}
            onChange={(e) => setAmountMax(e.target.value)}
            style={{
              width: 90,
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 13,
            }}
          />

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: 13 }}
              onClick={resetFilters}
            >
              필터 초기화
            </button>
          )}
        </div>

        {batchesLoading ? (
          <p style={{ color: "var(--sub)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
            불러오는 중...
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "var(--sub)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
            {batches.length === 0 ? "아직 정리한 영수증 내역이 없어요" : "검색 결과가 없어요"}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 16,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{highlightMatch(item.title, query)}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--sub)" }}>
                    {item.batchDate} · 영수증 {item.receiptCount}장
                  </p>
                </div>
                {confirmDeleteId === item.id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, color: "var(--sub)" }}>삭제할까요?</span>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: 13, background: "#F04452" }}
                      onClick={() => handleDelete(item.id, item.pdfPath)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "삭제 중..." : "삭제"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn"
                      style={{ padding: "6px 12px", fontSize: 13 }}
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    {item.pdfPath && (
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ fontSize: 13 }}
                        onClick={() => openPdf(item.id, item.pdfPath!)}
                        disabled={openingId === item.id}
                      >
                        {openingId === item.id ? "여는 중..." : "A4 보기"}
                      </button>
                    )}
                    <p style={{ margin: 0, fontWeight: 700, color: "var(--primary)" }}>
                      {formatWon(item.totalAmount)}
                    </p>
                    <button
                      type="button"
                      className="btn-ghost"
                      aria-label="삭제"
                      style={{ padding: 4 }}
                      onClick={() => setConfirmDeleteId(item.id)}
                    >
                      <svg className="icon" style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
                        <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0v12a2 2 0 002 2h6a2 2 0 002-2V7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
