import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ReceiptBatch } from "../types";

interface Row {
  id: string;
  title: string;
  batch_date: string;
  receipt_count: number;
  total_amount: number;
  pdf_path: string | null;
}

function toBatch(row: Row): ReceiptBatch {
  return {
    id: row.id,
    title: row.title,
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
    const { data } = await supabase
      .from("receipt_batches")
      .select("id, title, batch_date, receipt_count, total_amount, pdf_path")
      .eq("user_id", userId)
      .order("batch_date", { ascending: false });
    setBatches((data ?? []).map(toBatch));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { batches, loading, refetch };
}
