import type { ReceiptBatch } from "../types";
import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";
import { getCategoryLabel } from "../constants/categories";

export async function exportBatchesToExcel(batches: ReceiptBatch[], fileName: string, language: Language) {
  const XLSX = await import("xlsx");
  const t = (key: string) => translations[language][key] ?? key;

  const rows = batches.map((b) => ({
    [t("excel.date")]: b.batchDate,
    [t("excel.title")]: b.title,
    [t("excel.category")]: getCategoryLabel(b.category, language),
    [t("excel.receiptCount")]: b.receiptCount,
    [t("excel.amount")]: b.totalAmount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 12 }, { wch: 28 }, { wch: 12 }, { wch: 10 }, { wch: 12 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, t("excel.sheetName"));
  XLSX.writeFile(workbook, fileName);
}
