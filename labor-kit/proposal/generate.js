// 고객사 제안서(PPTX) 생성기
// 사용법:  node generate.js data/clients/<고객사>.json      (한 곳)
//         node generate.js --all                         (data/clients 폴더 전체)
// 공통 회사 정보는 data/company.json 에서 읽습니다.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, "output");

// ---- 디자인 토큰 --------------------------------------------------------
const C = {
  navy: "12305B",   // 주색 (신뢰)
  teal: "1E8C7E",   // 보조색
  gold: "E0A100",   // 강조색 (소량만)
  ink: "1F2937",
  muted: "6B7280",
  line: "D6DEE8",
  tint: "EEF3F8",
  white: "FFFFFF",
};
const FONT = "Malgun Gothic";
const W = 10;
const H = 5.625;
const MX = 0.5; // 좌우 여백

const fmt = (n) => Number(n).toLocaleString("en-US");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function text(slide, value, opts) {
  slide.addText(value, { fontFace: FONT, color: C.ink, margin: 0, isTextBox: true, ...opts });
}

function numberBadge(slide, n, x, y, d = 0.42, fill = C.teal) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  text(slide, String(n), { x, y, w: d, h: d, fontSize: d > 0.45 ? 16 : 13, bold: true, color: C.white, align: "center", valign: "middle" });
}

function header(slide, kicker, title) {
  text(slide, kicker, { x: MX, y: 0.32, w: 6, h: 0.25, fontSize: 10, bold: true, color: C.teal, charSpacing: 2 });
  text(slide, title, { x: MX, y: 0.55, w: W - 2 * MX, h: 0.55, fontSize: 24, bold: true, color: C.navy });
}

function footer(slide, company, page) {
  text(slide, `${company.name}  |  ${page}`, { x: W - MX - 4, y: H - 0.38, w: 4, h: 0.22, fontSize: 8, color: C.muted, align: "right" });
}

function card(slide, x, y, w, h, fill = C.tint) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } });
}

// ---- 슬라이드 -----------------------------------------------------------
function cover(pres, co, cl) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  // 모티프: 겹친 원
  s.addShape("ellipse", { x: 6.6, y: -0.9, w: 4.6, h: 4.6, fill: { color: C.teal, transparency: 35 }, line: { color: C.teal, transparency: 100 } });
  s.addShape("ellipse", { x: 7.9, y: 2.6, w: 3.2, h: 3.2, fill: { color: C.white, transparency: 88 }, line: { color: C.white, transparency: 100 } });
  s.addShape("ellipse", { x: 6.2, y: 3.5, w: 0.5, h: 0.5, fill: { color: C.gold }, line: { color: C.gold } });

  text(s, "BUSINESS PROPOSAL  ·  인력공급 제안서", { x: MX, y: 1.0, w: 6, h: 0.3, fontSize: 11, bold: true, color: "9FD8CF", charSpacing: 2 });
  text(s, [
    { text: `${cl.client.name} 귀중`, options: { fontSize: 18, color: "CFE0F2", breakLine: true } },
    { text: "단기 근로자 인력 공급 제안", options: { fontSize: 34, bold: true, color: C.white } },
  ], { x: MX, y: 1.45, w: 6.3, h: 1.5, valign: "top", paraSpaceAfter: 6 });
  text(s, co.tagline, { x: MX, y: 3.05, w: 6, h: 0.35, fontSize: 14, italic: true, color: "9FD8CF" });
  text(s, [
    { text: co.name, options: { bold: true, fontSize: 13, color: C.white, breakLine: true } },
    { text: `${cl.proposalDate}  |  ${co.contact.person} ${co.contact.title}`, options: { fontSize: 11, color: "CFE0F2" } },
  ], { x: MX, y: 4.4, w: 6, h: 0.6 });
}

function about(pres, co) {
  const s = pres.addSlide();
  header(s, "ABOUT US", "회사 소개");
  text(s, co.nameLocal, { x: MX, y: 1.35, w: 4.4, h: 0.3, fontSize: 11, bold: true, color: C.teal });
  text(s, co.intro, { x: MX, y: 1.7, w: 4.3, h: 1.9, fontSize: 13, color: C.ink, valign: "top", lineSpacingMultiple: 1.3 });
  text(s, co.license, { x: MX, y: 4.55, w: 4.4, h: 0.3, fontSize: 9, color: C.muted });

  const gx = 5.2, gy = 1.35, cw = 2.1, ch = 1.5, gap = 0.2;
  co.stats.slice(0, 4).forEach((st, i) => {
    const x = gx + (i % 2) * (cw + gap);
    const y = gy + Math.floor(i / 2) * (ch + gap);
    card(s, x, y, cw, ch);
    text(s, st.value, { x: x + 0.15, y: y + 0.28, w: cw - 0.3, h: 0.6, fontSize: 24, bold: true, color: C.navy });
    text(s, st.label, { x: x + 0.2, y: y + 0.95, w: cw - 0.4, h: 0.3, fontSize: 11, color: C.muted });
  });
  return s;
}

function needs(pres, cl) {
  const s = pres.addSlide();
  header(s, "UNDERSTANDING", `${cl.client.name}의 과제와 해결 방향`);
  const items = cl.needs.slice(0, 4);
  const top = 1.45, rowH = Math.min(0.85, 3.3 / items.length);
  text(s, "현재 과제", { x: MX + 0.6, y: top - 0.3, w: 3.5, h: 0.25, fontSize: 10, bold: true, color: C.muted });
  text(s, "제안 해결 방향", { x: 5.3, y: top - 0.3, w: 3.5, h: 0.25, fontSize: 10, bold: true, color: C.teal });
  items.forEach((n, i) => {
    const y = top + i * (rowH + 0.1);
    numberBadge(s, i + 1, MX, y + (rowH - 0.42) / 2, 0.42, C.navy);
    card(s, MX + 0.6, y, 3.95, rowH, C.tint);
    text(s, n.issue, { x: MX + 0.8, y, w: 3.6, h: rowH, fontSize: 12, valign: "middle" });
    s.addShape("rightArrow", { x: 4.7, y: y + rowH / 2 - 0.13, w: 0.45, h: 0.26, fill: { color: C.gold }, line: { color: C.gold } });
    card(s, 5.3, y, W - MX - 5.3, rowH, "E3F2EF");
    text(s, n.solution, { x: 5.5, y, w: W - MX - 5.7, h: rowH, fontSize: 12, bold: true, color: C.teal, valign: "middle" });
  });
  return s;
}

function planSlide(pres, cl) {
  const s = pres.addSlide();
  header(s, "SUPPLY PLAN", "인력 공급 계획");
  const total = cl.plan.reduce((a, p) => a + Number(p.headcount), 0);
  const hdr = ["직무", "교대", "인원(명)", "기간"].map((t) => ({
    text: t, options: { bold: true, color: C.white, fill: { color: C.navy }, align: "center" },
  }));
  const rows = cl.plan.map((p) => [
    { text: p.role }, { text: p.shift, options: { align: "center" } },
    { text: fmt(p.headcount), options: { align: "center", bold: true } }, { text: p.period, options: { align: "center" } },
  ]);
  rows.push([
    { text: "합계", options: { bold: true, fill: { color: C.tint } } }, { text: "", options: { fill: { color: C.tint } } },
    { text: fmt(total), options: { bold: true, align: "center", fill: { color: C.tint }, color: C.navy } }, { text: "", options: { fill: { color: C.tint } } },
  ]);
  s.addTable([hdr, ...rows], {
    x: MX, y: 1.4, w: 6.0, colW: [1.9, 0.9, 1.1, 2.1], fontFace: FONT, fontSize: 11, color: C.ink,
    border: { type: "solid", pt: 0.75, color: C.line }, rowH: 0.38, valign: "middle",
  });

  card(s, 6.9, 1.4, 2.6, 3.4, C.navy);
  text(s, "투입 예정 인원", { x: 7.1, y: 1.65, w: 2.2, h: 0.3, fontSize: 11, color: "CFE0F2" });
  text(s, [
    { text: fmt(total), options: { fontSize: 48, bold: true, color: C.white } },
    { text: " 명", options: { fontSize: 16, color: C.white } },
  ], { x: 7.1, y: 2.0, w: 2.2, h: 0.9 });
  text(s, [
    { text: `월 ${cl.workDaysPerMonth || 26}일 운영 기준`, options: { breakLine: true } },
    { text: `월 연인원 약 ${fmt(total * (cl.workDaysPerMonth || 26))}명`, options: { bold: true, color: "9FD8CF" } },
  ], { x: 7.1, y: 3.2, w: 2.2, h: 0.8, fontSize: 11, color: "CFE0F2", paraSpaceAfter: 4 });
  return s;
}

function processSlide(pres, co) {
  const s = pres.addSlide();
  header(s, "OPERATION", "운영 프로세스");
  const steps = co.process.slice(0, 6);
  const n = steps.length, left = MX, span = W - 2 * MX, colW = span / n;
  const cy = 1.9;
  s.addShape("line", { x: left + colW / 2, y: cy + 0.28, w: span - colW, h: 0, line: { color: C.line, width: 2 } });
  steps.forEach((st, i) => {
    const cx = left + i * colW + colW / 2;
    numberBadge(s, i + 1, cx - 0.28, cy, 0.56, i === n - 1 ? C.gold : C.teal);
    text(s, st.title, { x: cx - colW / 2 + 0.05, y: cy + 0.75, w: colW - 0.1, h: 0.35, fontSize: 13, bold: true, color: C.navy, align: "center" });
    text(s, st.desc, { x: cx - colW / 2 + 0.1, y: cy + 1.12, w: colW - 0.2, h: 0.8, fontSize: 10, color: C.muted, align: "center", valign: "top" });
  });
  card(s, MX, 4.15, W - 2 * MX, 0.6);
  text(s, "매일 고객사에 계획/실적(인원·결원·차량 운행)을 공유하고, 매월 달성률·결원 원인·개선안을 리포트로 제출합니다.",
    { x: MX + 0.25, y: 4.15, w: W - 2 * MX - 0.5, h: 0.6, fontSize: 11, color: C.ink, valign: "middle" });
  return s;
}

function vehicleSlide(pres, cl) {
  const v = cl.vehicle || {};
  const s = pres.addSlide();
  header(s, "COMMUTE SUPPORT", "출퇴근 차량 지원 방안");

  // 상태 배지
  const yes = !!v.clientSupport;
  const badge = yes ? `고객사 차량지원: 있음${v.clientSupportType ? ` (${v.clientSupportType})` : ""}` : "고객사 차량지원: 없음 → 당사 운영 제안";
  s.addShape("roundRect", { x: MX, y: 1.3, w: 5.2, h: 0.4, rectRadius: 0.2, fill: { color: yes ? "E3F2EF" : "FFF4D6" }, line: { color: yes ? C.teal : C.gold, width: 1 } });
  text(s, badge, { x: MX + 0.2, y: 1.3, w: 4.9, h: 0.4, fontSize: 12, bold: true, color: yes ? C.teal : "8A6300", valign: "middle" });

  if (yes) {
    const steps = [
      ["탑승 명단 공유", "전일 18시까지 교대별 탑승 명단을 고객사 총무팀에 전달"],
      ["픽업 지점 관리", "당사 현장 관리자가 픽업 지점에서 인원 확인 후 탑승"],
      ["지각·이탈 관리", "미탑승자 즉시 연락, 결원 시 대체 인력 개별 이동"],
    ];
    steps.forEach(([t, d], i) => {
      const y = 2.0 + i * 0.85;
      numberBadge(s, i + 1, MX, y + 0.08);
      text(s, t, { x: MX + 0.6, y, w: 4.5, h: 0.3, fontSize: 13, bold: true, color: C.navy });
      text(s, d, { x: MX + 0.6, y: y + 0.32, w: 4.6, h: 0.45, fontSize: 11, color: C.muted, valign: "top" });
    });
  } else {
    text(s, [
      { text: "운행 차량", options: { bold: true, color: C.navy, breakLine: true } },
      { text: v.ourVehicle || "-", options: { breakLine: true } },
      { text: " ", options: { fontSize: 6, breakLine: true } },
      { text: "운행 노선", options: { bold: true, color: C.navy, breakLine: true } },
      { text: v.route || "-", options: { breakLine: true } },
      { text: " ", options: { fontSize: 6, breakLine: true } },
      { text: "차량 비용", options: { bold: true, color: C.navy, breakLine: true } },
      { text: `${v.costPerDay ? fmt(v.costPerDay) + " VND/일 — " : ""}${v.costBilling || ""}` },
    ], { x: MX, y: 1.95, w: 5.2, h: 2.0, fontSize: 12, color: C.ink, valign: "top" });
    card(s, MX, 4.05, 5.2, 0.7);
    text(s, "교대별 탑승 명단 관리 · 미탑승자 즉시 연락 · 결원 시 대체 인력 개별 이동까지 당사가 책임 운영합니다.",
      { x: MX + 0.2, y: 4.05, w: 4.8, h: 0.7, fontSize: 11, color: C.ink, valign: "middle" });
  }

  // 오른쪽: 픽업 지점 경로
  const pts = (v.pickupPoints && v.pickupPoints.length ? v.pickupPoints : ["픽업 지점", "공장"]).slice(0, 5);
  card(s, 6.1, 1.3, 3.4, 3.45);
  text(s, "픽업 지점", { x: 6.35, y: 1.45, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.muted });
  const step = Math.min(0.62, 2.6 / pts.length);
  s.addShape("line", { x: 6.55, y: 2.0, w: 0, h: step * (pts.length - 1), line: { color: C.teal, width: 2, dashType: "dash" } });
  pts.forEach((p, i) => {
    const y = 2.0 + i * step;
    const last = i === pts.length - 1;
    s.addShape("ellipse", { x: 6.45, y: y - 0.1, w: 0.2, h: 0.2, fill: { color: last ? C.gold : C.teal }, line: { color: C.white, width: 1.5 } });
    text(s, p, { x: 6.85, y: y - 0.16, w: 2.5, h: 0.32, fontSize: 12, bold: last, color: C.ink, valign: "middle" });
  });
  return s;
}

function qualitySlide(pres, co) {
  const s = pres.addSlide();
  header(s, "QUALITY & COMPLIANCE", "품질 관리와 법규 준수");
  const items = co.quality.slice(0, 6);
  const cols = 3, cw = 2.85, ch = 1.4, gx = 0.225, gy = 0.25;
  items.forEach((q, i) => {
    const x = MX + (i % cols) * (cw + gx);
    const y = 1.4 + Math.floor(i / cols) * (ch + gy);
    card(s, x, y, cw, ch);
    numberBadge(s, i + 1, x + 0.2, y + 0.22, 0.4, C.navy);
    text(s, q.title, { x: x + 0.75, y: y + 0.22, w: cw - 0.9, h: 0.4, fontSize: 13, bold: true, color: C.navy, valign: "middle" });
    text(s, q.desc, { x: x + 0.2, y: y + 0.75, w: cw - 0.4, h: 0.55, fontSize: 10.5, color: C.ink, valign: "top" });
  });
  return s;
}

function performanceSlide(pres, co) {
  const p = co.performance;
  const s = pres.addSlide();
  header(s, "TRACK RECORD", "최근 공급 실적 (계획 대비 실적)");
  s.addChart(pres.charts.BAR, [
    { name: "계획 연인원", labels: p.months, values: p.plan },
    { name: "실적 연인원", labels: p.months, values: p.actual },
  ], {
    x: MX, y: 1.3, w: 6.2, h: 3.6, barDir: "col", barGapWidthPct: 60,
    chartColors: ["B7C4D6", C.navy], showLegend: true, legendPos: "t", legendFontFace: FONT, legendFontSize: 10,
    catAxisLabelFontFace: FONT, valAxisLabelFontFace: FONT, catAxisLabelFontSize: 10, valAxisLabelFontSize: 9,
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted, valAxisLabelFormatCode: "#,##0",
    valGridLine: { color: "E5E7EB", size: 0.5 }, catGridLine: { style: "none" },
    showValue: false,
  });
  const sumP = p.plan.reduce((a, b) => a + b, 0);
  const sumA = p.actual.reduce((a, b) => a + b, 0);
  const rate = sumP ? (sumA / sumP) * 100 : 0;
  card(s, 7.0, 1.3, 2.5, 1.65, C.navy);
  text(s, "기간 평균 달성률", { x: 7.2, y: 1.45, w: 2.1, h: 0.3, fontSize: 11, color: "CFE0F2" });
  text(s, `${rate.toFixed(1)}%`, { x: 7.2, y: 1.8, w: 2.1, h: 0.8, fontSize: 36, bold: true, color: C.white });
  card(s, 7.0, 3.15, 2.5, 1.75);
  text(s, "누적 실적 연인원", { x: 7.2, y: 3.3, w: 2.1, h: 0.3, fontSize: 11, color: C.muted });
  text(s, fmt(sumA), { x: 7.2, y: 3.65, w: 2.1, h: 0.6, fontSize: 28, bold: true, color: C.navy });
  text(s, `${p.months[0]} ~ ${p.months[p.months.length - 1]}`, { x: 7.2, y: 4.3, w: 2.1, h: 0.3, fontSize: 10, color: C.muted });
  return s;
}

function pricingSlide(pres, cl) {
  const s = pres.addSlide();
  header(s, "QUOTATION", "견적 (단가)");
  const hdr = ["직무", "단가 (VND/인·일)", "포함 항목"].map((t) => ({
    text: t, options: { bold: true, color: C.white, fill: { color: C.navy }, align: "center" },
  }));
  const rows = cl.pricing.map((p) => [
    { text: p.role }, { text: fmt(p.unitPrice), options: { align: "right", bold: true, color: C.navy } }, { text: p.includes },
  ]);
  s.addTable([hdr, ...rows], {
    x: MX, y: 1.4, w: 6.0, colW: [1.8, 1.7, 2.5], fontFace: FONT, fontSize: 11, color: C.ink,
    border: { type: "solid", pt: 0.75, color: C.line }, rowH: 0.42, valign: "middle",
  });
  text(s, cl.pricingNote || "", { x: MX, y: 4.45, w: 6.0, h: 0.4, fontSize: 9.5, color: C.muted, valign: "top" });

  // 예상 월 비용 = Σ(계획 인원 × 같은 직무 단가) × 월 운영일
  const days = cl.workDaysPerMonth || 26;
  const priceOf = (role) => (cl.pricing.find((p) => p.role === role) || {}).unitPrice;
  let monthly = 0, matched = true;
  cl.plan.forEach((p) => {
    const u = priceOf(p.role) ?? priceOf(`${p.role}(${p.shift})`);
    if (u == null) matched = false; else monthly += u * p.headcount * days;
  });
  card(s, 6.9, 1.4, 2.6, 2.9, C.navy);
  text(s, "예상 월 비용 (VAT 별도)", { x: 7.1, y: 1.6, w: 2.3, h: 0.3, fontSize: 11, color: "CFE0F2" });
  if (matched && monthly > 0) {
    text(s, (monthly / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 }), { x: 7.1, y: 2.0, w: 2.3, h: 0.7, fontSize: 34, bold: true, color: C.white });
    text(s, "백만 VND / 월", { x: 7.1, y: 2.7, w: 2.3, h: 0.3, fontSize: 13, color: C.white });
    text(s, `공급 계획 인원 × 단가 × 월 ${days}일`, { x: 7.1, y: 3.3, w: 2.3, h: 0.5, fontSize: 10, color: "9FD8CF", valign: "top" });
  } else {
    text(s, "공급 계획의 직무명과 견적의 직무명을 맞추면 자동 계산됩니다.", { x: 7.1, y: 2.0, w: 2.3, h: 1.2, fontSize: 11, color: C.white, valign: "top" });
  }
  return s;
}

function referencesSlide(pres, co) {
  const s = pres.addSlide();
  header(s, "REFERENCES", "주요 공급 사례");
  const refs = co.references.slice(0, 4);
  const cw = (W - 2 * MX - 0.3) / 2, ch = 1.45;
  refs.forEach((r, i) => {
    const x = MX + (i % 2) * (cw + 0.3);
    const y = 1.4 + Math.floor(i / 2) * (ch + 0.25);
    card(s, x, y, cw, ch);
    s.addShape("roundRect", { x: x + 0.25, y: y + 0.25, w: 0.9, h: 0.32, rectRadius: 0.16, fill: { color: C.teal }, line: { color: C.teal } });
    text(s, r.industry, { x: x + 0.25, y: y + 0.25, w: 0.9, h: 0.32, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle" });
    text(s, r.name, { x: x + 1.3, y: y + 0.22, w: cw - 1.5, h: 0.38, fontSize: 13, bold: true, color: C.navy, valign: "middle" });
    text(s, r.detail, { x: x + 0.25, y: y + 0.72, w: cw - 0.5, h: 0.6, fontSize: 11, color: C.ink, valign: "top" });
  });
  return s;
}

function closing(pres, co, cl) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape("ellipse", { x: 7.4, y: -1.2, w: 3.6, h: 3.6, fill: { color: C.teal, transparency: 40 }, line: { color: C.teal, transparency: 100 } });
  text(s, "TERMS & NEXT STEPS", { x: MX, y: 0.35, w: 6, h: 0.25, fontSize: 10, bold: true, color: "9FD8CF", charSpacing: 2 });
  text(s, "계약 조건과 다음 단계", { x: MX, y: 0.6, w: 6.5, h: 0.55, fontSize: 24, bold: true, color: C.white });

  text(s, cl.terms.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < cl.terms.length - 1 } })),
    { x: MX, y: 1.45, w: 4.6, h: 2.2, fontSize: 12, color: "E5EEF8", valign: "top", paraSpaceAfter: 8 });

  const steps = (cl.nextSteps || []).slice(0, 4);
  steps.forEach((st, i) => {
    const y = 1.45 + i * 0.62;
    numberBadge(s, i + 1, 5.5, y, 0.42, C.gold);
    text(s, st, { x: 6.1, y, w: 3.4, h: 0.42, fontSize: 12, bold: true, color: C.white, valign: "middle" });
  });

  const ct = co.contact;
  s.addShape("roundRect", { x: MX, y: 3.95, w: W - 2 * MX, h: 1.05, rectRadius: 0.08, fill: { color: C.white, transparency: 90 }, line: { color: C.white, transparency: 70 } });
  text(s, [
    { text: `${co.name}  ${ct.person} ${ct.title}`, options: { bold: true, fontSize: 13, color: C.white, breakLine: true } },
    { text: `Tel ${ct.phone}   ·   Zalo ${ct.zalo}   ·   ${ct.email}   ·   ${ct.address}`, options: { fontSize: 11, color: "CFE0F2" } },
  ], { x: MX + 0.3, y: 3.95, w: W - 2 * MX - 0.6, h: 1.05, valign: "middle", paraSpaceAfter: 4 });
}

// ---- 조립 --------------------------------------------------------------
async function build(clientFile) {
  const co = readJson(path.join(ROOT, "data", "company.json"));
  const cl = readJson(clientFile);
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = co.name;
  pres.company = co.name;
  pres.title = `${cl.client.name} 인력공급 제안서`;

  cover(pres, co, cl);
  const pages = [
    about(pres, co), needs(pres, cl), planSlide(pres, cl), processSlide(pres, co),
    vehicleSlide(pres, cl), qualitySlide(pres, co), performanceSlide(pres, co),
    pricingSlide(pres, cl), referencesSlide(pres, co),
  ];
  pages.forEach((s, i) => footer(s, co, i + 2));
  closing(pres, co, cl);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const safe = cl.client.name.replace(/[\\/:*?"<>|]/g, "_");
  const out = path.join(OUT_DIR, `제안서_${safe}_${cl.proposalDate}.pptx`);
  await pres.writeFile({ fileName: out });
  console.log(`생성 완료: ${path.relative(process.cwd(), out)}`);
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.log("사용법: node generate.js data/clients/<고객사>.json  |  node generate.js --all");
    process.exit(1);
  }
  const files = arg === "--all"
    ? fs.readdirSync(path.join(ROOT, "data", "clients")).filter((f) => f.endsWith(".json")).map((f) => path.join(ROOT, "data", "clients", f))
    : [path.resolve(arg)];
  for (const f of files) await build(f);
})().catch((e) => { console.error(e); process.exit(1); });
