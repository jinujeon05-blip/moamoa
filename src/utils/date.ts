function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 로컬 타임존 기준 YYYY-MM-DD (toISOString은 UTC라 자정 근처에 날짜가 하루 밀릴 수 있음) */
export function toLocalDateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 로컬 타임존 기준 YYYY-MM */
export function toLocalMonthStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}
