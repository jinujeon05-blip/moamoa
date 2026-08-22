const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export type PageOrientation = "portrait" | "landscape";

/**
 * containerSelector 안의 각 .a4-page 요소를 캡처해 A4 규격 PDF Blob으로 렌더링한다.
 * html2canvas/jsPDF는 무거운 라이브러리라 실제로 다운로드/저장할 때만 불러온다.
 */
export async function renderPagesToPdfBlob(
  containerEl: HTMLElement,
  orientation: PageOrientation = "portrait"
): Promise<Blob | null> {
  const pages = Array.from(containerEl.querySelectorAll<HTMLElement>(".a4-page"));
  if (pages.length === 0) return null;

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });
  const widthMm = orientation === "portrait" ? A4_WIDTH_MM : A4_HEIGHT_MM;
  const heightMm = orientation === "portrait" ? A4_HEIGHT_MM : A4_WIDTH_MM;

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    // PNG는 무손실이라 스크린샷 한 장에도 수십MB까지 커질 수 있어 JPEG로 압축
    const imgData = canvas.toDataURL("image/jpeg", 0.85);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, widthMm, heightMm);
  }

  return pdf.output("blob");
}

export async function exportPagesToPdf(
  containerEl: HTMLElement,
  fileName = "receipts.pdf",
  orientation: PageOrientation = "portrait"
): Promise<void> {
  const blob = await renderPagesToPdfBlob(containerEl, orientation);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 각 .a4-page를 JPG로 각각 내려받는다 (여러 페이지면 순차적으로 여러 파일 다운로드).
 */
export async function exportPagesToJpg(
  containerEl: HTMLElement,
  baseFileName = "receipts"
): Promise<void> {
  const pages = Array.from(containerEl.querySelectorAll<HTMLElement>(".a4-page"));
  if (pages.length === 0) return;

  const { default: html2canvas } = await import("html2canvas");

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) continue;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = pages.length > 1 ? `${baseFileName}-${i + 1}.jpg` : `${baseFileName}.jpg`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
