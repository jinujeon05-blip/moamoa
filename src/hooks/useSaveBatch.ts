import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface SaveBatchInput {
  userId: string;
  title: string;
  category: string;
  receiptCount: number;
  totalAmount: number;
  pdfBlob: Blob | null;
}

export function useSaveBatch() {
  const [saving, setSaving] = useState(false);

  const saveBatch = useCallback(
    async ({ userId, title, category, receiptCount, totalAmount, pdfBlob }: SaveBatchInput) => {
      setSaving(true);

      let pdfPath: string | null = null;
      if (pdfBlob) {
        const path = `${userId}/${crypto.randomUUID()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("receipt-pdfs")
          .upload(path, pdfBlob, { contentType: "application/pdf" });
        if (uploadError) {
          setSaving(false);
          return uploadError.message;
        }
        pdfPath = path;
      }

      const { error } = await supabase.from("receipt_batches").insert({
        user_id: userId,
        title,
        category,
        batch_date: new Date().toISOString().slice(0, 10),
        receipt_count: receiptCount,
        total_amount: totalAmount,
        pdf_path: pdfPath,
      });
      setSaving(false);
      return error?.message ?? null;
    },
    []
  );

  return { saveBatch, saving };
}
