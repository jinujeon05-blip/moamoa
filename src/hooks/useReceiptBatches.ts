import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ReceiptBatch } from "../types";

interface Row {
  id: string;
  title: string;
  category: string;
  batch_date: string;
  receipt_count: number;
  total_amount: number;
  pdf_path: string | null;
}

function toBatch(row: Row): ReceiptBatch {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    batchDate: row.batch_date,
    receiptCount: row.receipt_count,
    totalAmount: row.total_amount,
    pdfPath: row.pdf_path,
  };
}

export function useReceiptBatches(userId: string | undefined) {
  const [batches, setBatches] = useState<ReceiptBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setBatches([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // 로그인 직후에는 세션 토큰이 아직 완전히 준비되지 않아 첫 요청이 실패할 수 있어 한 번 재시도
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await supabase
        .from("receipt_batches")
        .select("id, title, category, batch_date, receipt_count, total_amount, pdf_path")
        .eq("user_id", userId)
        .order("batch_date", { ascending: false });
      if (!error) {
        setBatches((data ?? []).map(toBatch));
        setLoading(false);
        return;
      }
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setBatches([]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteBatch = useCallback(async (id: string, pdfPath: string | null) => {
    if (pdfPath) {
      await supabase.storage.from("receipt-pdfs").remove([pdfPath]);
    }
    const { error } = await supabase.from("receipt_batches").delete().eq("id", id);
    if (error) return error.message;
    setBatches((prev) => prev.filter((b) => b.id !== id));
    return null;
  }, []);

  return { batches, loading, refetch, deleteBatch };
}
