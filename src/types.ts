export interface Receipt {
  id: string;
  fileName: string;
  imageUrl: string;
  amount: number;
  memo: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
}

export interface ReceiptBatch {
  id: string;
  title: string;
  category: string;
  batchDate: string; // YYYY-MM-DD
  receiptCount: number;
  totalAmount: number;
  pdfPath: string | null;
}
