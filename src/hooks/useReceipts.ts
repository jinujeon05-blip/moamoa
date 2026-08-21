import { useCallback, useState } from "react";
import type { Receipt } from "../types";

let nextId = 1;

export function useReceipts(initial: Receipt[] = []) {
  const [receipts, setReceipts] = useState<Receipt[]>(initial);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newReceipts: Receipt[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `r-${nextId++}`,
        fileName: file.name,
        imageUrl: URL.createObjectURL(file),
        amount: 0,
        memo: "",
      }));
    if (newReceipts.length > 0) {
      setReceipts((prev) => [...prev, ...newReceipts]);
    }
  }, []);

  const updateAmount = useCallback((id: string, amount: number) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, amount } : r))
    );
  }, []);

  const updateMemo = useCallback((id: string, memo: string) => {
    setReceipts((prev) => prev.map((r) => (r.id === id ? { ...r, memo } : r)));
  }, []);

  const removeReceipt = useCallback((id: string) => {
    setReceipts((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target) URL.revokeObjectURL(target.imageUrl);
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setReceipts((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.imageUrl));
      return [];
    });
  }, []);

  const total = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);

  return { receipts, addFiles, updateAmount, updateMemo, removeReceipt, clearAll, total };
}
