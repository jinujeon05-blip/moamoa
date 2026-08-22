const TOTAL_KEYWORDS = ["합계", "총액", "결제금액", "결제 금액", "받을금액", "받을 금액", "합 계", "total"];
const EXCLUDE_LINE_KEYWORDS = ["번호", "no", "승인", "tel", "전화", "사업자"];
const NUMBER_PATTERN = /\d{1,3}(,\d{3})+|\d{4,}/g;

function numbersInLine(line: string): number[] {
  const matches = line.match(NUMBER_PATTERN) ?? [];
  return matches
    .map((m) => Number(m.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n >= 100 && n < 10000000);
}

function guessTotal(text: string): number | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (TOTAL_KEYWORDS.some((k) => lower.includes(k))) {
      const numbers = numbersInLine(line);
      if (numbers.length > 0) return Math.max(...numbers);
    }
  }

  const candidateNumbers = lines
    .filter((line) => {
      const lower = line.toLowerCase();
      if (EXCLUDE_LINE_KEYWORDS.some((k) => lower.includes(k))) return false;
      if (/\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/.test(line)) return false;
      return true;
    })
    .flatMap(numbersInLine);

  if (candidateNumbers.length === 0) return null;
  return Math.max(...candidateNumbers);
}

export async function recognizeAmount(imageUrl: string): Promise<number | null> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("kor+eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(imageUrl);
    return guessTotal(text);
  } finally {
    await worker.terminate();
  }
}
