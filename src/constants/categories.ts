import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";

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

// 카테고리는 DB에 한국어 값으로 저장되므로, 화면 표시용 라벨만 언어별로 바꿔준다
export function getCategoryLabel(category: string, language: Language): string {
  const key = `category.${category}`;
  return translations[language][key] ?? category;
}
