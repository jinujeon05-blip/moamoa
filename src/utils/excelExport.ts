import type { ReceiptBatch } from "../types";

export async function exportBatchesToExcel(batches: ReceiptBatch[], fileName: string) {
  const XLSX = await import("xlsx");

  const rows = batches.map((b) => ({
    날짜: b.batchDate,
    제목: b.title,
    카테고리: b.category,
    "영수증 수": b.receiptCount,
    금액: b.totalAmount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 12 }, { wch: 28 }, { wch: 12 }, { wch: 10 }, { wch: 12 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "영수증 정리 내역");
  XLSX.writeFile(workbook, fileName);
}
