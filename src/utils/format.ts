import type { Language } from "../i18n/translations";

export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatCurrency(amount: number, language: Language): string {
  if (language === "vi") {
    return `${amount.toLocaleString("vi-VN")}₫`;
  }
  return formatWon(amount);
}
