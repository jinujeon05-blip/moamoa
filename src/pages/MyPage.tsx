import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useReceiptBatches } from "../hooks/useReceiptBatches";
import { supabase } from "../lib/supabaseClient";
import { formatWon } from "../utils/format";
import { highlightMatch } from "../utils/highlightText";
import PdfPreviewModal from "../components/PdfPreviewModal";
import { CATEGORIES } from "../constants/categories";
import { toLocalDateStr as toDateStr } from "../utils/date";
import { exportBatchesToExcel } from "../utils/excelExport";

type SortKey = "latest" | "amount";

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
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateName } = useProfile(user?.id, user?.email);
  const { batches, loading: batchesLoading, deleteBatch, updateBatch } = useReceiptBatches(user?.id);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  const hasActiveFilters = Boolean(dateFrom || dateTo || amountMin || amountMax || categoryFilter);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setAmountMin("");
    setAmountMax("");
    setCategoryFilter("");
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
      if (categoryFilter && item.category !== categoryFilter) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sortKey === "latest"
        ? b.batchDate.localeCompare(a.batchDate)
        : b.totalAmount - a.totalAmount
    );
    return list;
  }, [batches, query, sortKey, dateFrom, dateTo, amountMin, amountMax, categoryFilter]);

  const [openingId, setOpeningId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ blobUrl: string; title: string } | null>(null);

  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteAccountError("");
    const errorMessage = await deleteAccount();
    setDeletingAccount(false);
    if (errorMessage) {
      setDeleteAccountError(errorMessage);
      return;
    }
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

  const openPdf = async (batchId: string, pdfPath: string, title: string) => {
    setOpeningId(batchId);
    const { data, error } = await supabase.storage.from("receipt-pdfs").createSignedUrl(pdfPath, 60);
    if (error || !data?.signedUrl) {
      setOpeningId(null);
      alert("PDF를 여는 중 문제가 발생했어요: " + (error?.message ?? "알 수 없는 오류"));
      return;
    }

    const res = await fetch(data.signedUrl);
    setOpeningId(null);
    if (!res.ok) {
      alert("PDF를 불러오지 못했어요");
      return;
    }
    const blob = await res.blob();
    setPreview({ blobUrl: URL.createObjectURL(blob), title });
  };

  const closePreview = () => {
    if (preview) URL.revokeObjectURL(preview.blobUrl);
    setPreview(null);
  };

  const startEditingBatch = (id: string, title: string, category: string, totalAmount: number) => {
    setEditingBatchId(id);
    setEditTitle(title);
    setEditCategory(category);
    setEditAmount(String(totalAmount));
    setEditError("");
  };

  const saveBatchEdit = async (id: string) => {
    if (!editTitle.trim()) {
      setEditError("제목을 입력해주세요");
      return;
    }
    const amount = Number(editAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      setEditError("금액을 확인해주세요");
      return;
    }
    setSavingEditId(id);
    const errorMessage = await updateBatch(id, {
      title: editTitle.trim(),
      category: editCategory,
      totalAmount: amount,
    });
    setSavingEditId(null);
    if (errorMessage) {
      setEditError(errorMessage);
      return;
    }
    setEditingBatchId(null);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportBatchesToExcel(filtered, `모아모아_영수증정리내역_${toDateStr(new Date())}.xlsx`);
    } finally {
      setExporting(false);
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 16,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile?.name}
                </p>
                <button
                  className="btn-ghost"
                  onClick={startEditingName}
                  style={{ fontSize: 12, flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  수정
                </button>
              </div>
            )}
            <p
              style={{
                margin: "2px 0 0",
                color: "var(--sub)",
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile?.email}
            </p>
          </div>
        </div>
        <button className="btn-secondary btn" onClick={handleLogout} style={{ flexShrink: 0 }}>
          로그아웃
        </button>
      </section>

      {/* 활동 내역 */}
      <section>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18 }}>영수증 정리 내역</h2>
          <button
            type="button"
            className="btn-secondary btn"
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={handleExportExcel}
            disabled={exporting || filtered.length === 0}
          >
            {exporting ? "내보내는 중..." : "엑셀 다운로드"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="내역 검색 (제목)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
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
              flexShrink: 0,
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

          <span style={{ color: "var(--sub)", marginLeft: 8 }}>카테고리</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: 13,
              background: "var(--surface)",
            }}
          >
            <option value="">전체</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

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
                  flexDirection: editingBatchId === item.id ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: editingBatchId === item.id ? "stretch" : "center",
                  gap: 8,
                }}
              >
              {editingBatchId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontFamily: "inherit",
                      fontSize: 14,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        fontFamily: "inherit",
                        fontSize: 14,
                        background: "var(--surface)",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      style={{
                        width: 120,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        fontFamily: "inherit",
                        fontSize: 14,
                      }}
                    />
                  </div>
                  {editError && <p style={{ margin: 0, fontSize: 12, color: "#F04452" }}>{editError}</p>}
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: "6px 14px", fontSize: 13 }}
                      onClick={() => saveBatchEdit(item.id)}
                      disabled={savingEditId === item.id}
                    >
                      {savingEditId === item.id ? "저장 중..." : "저장"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn"
                      style={{ padding: "6px 14px", fontSize: 13 }}
                      onClick={() => setEditingBatchId(null)}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--primary)",
                        background: "#EAF2FF",
                        borderRadius: 999,
                        padding: "2px 8px",
                        flexShrink: 0,
                      }}
                    >
                      {item.category}
                    </span>
                    <p style={{ margin: 0, fontWeight: 600 }}>{highlightMatch(item.title, query)}</p>
                  </div>
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
                        onClick={() => openPdf(item.id, item.pdfPath!, item.title)}
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
                      style={{ fontSize: 13 }}
                      onClick={() => startEditingBatch(item.id, item.title, item.category, item.totalAmount)}
                    >
                      수정
                    </button>
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
                </>
              )}
              </div>
            ))}
          </div>
        )}
      </section>

      {preview && (
        <PdfPreviewModal blobUrl={preview.blobUrl} title={preview.title} onClose={closePreview} />
      )}

      {/* 회원 탈퇴 */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginTop: 40,
          paddingTop: 20,
          textAlign: "center",
        }}
      >
        {confirmDeleteAccount ? (
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--sub)" }}>
              탈퇴하면 저장된 모든 정리 내역과 PDF가 영구 삭제돼요. 계속할까요?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn"
                style={{ padding: "6px 12px", fontSize: 13, background: "#F04452" }}
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? "탈퇴 중..." : "탈퇴하기"}
              </button>
              <button
                type="button"
                className="btn-secondary btn"
                style={{ padding: "6px 12px", fontSize: 13 }}
                onClick={() => setConfirmDeleteAccount(false)}
                disabled={deletingAccount}
              >
                취소
              </button>
            </div>
            {deleteAccountError && (
              <p style={{ margin: 0, fontSize: 12, color: "#F04452" }}>{deleteAccountError}</p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDeleteAccount(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--sub)",
              fontSize: 13,
              cursor: "pointer",
              padding: 0,
            }}
          >
            회원 탈퇴
          </button>
        )}
      </div>
    </main>
  );
}
