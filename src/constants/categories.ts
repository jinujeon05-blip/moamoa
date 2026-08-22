export const CATEGORIES = [
  "식비",
  "교통비",
  "생활용품",
  "의료/건강",
  "문화/여가",
  "업무/사무용품",
  "기타",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DEFAULT_CATEGORY: Category = "기타";
