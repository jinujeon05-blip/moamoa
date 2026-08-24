import { usePageMeta } from "../hooks/usePageMeta";
import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../i18n/translations";

interface Step {
  title: string;
  desc: string;
  icon: JSX.Element;
}

function icon(path: string) {
  return (
    <svg className="icon" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}

const basicStepsKo: Omit<Step, "icon">[] = [
  {
    title: "영수증 이미지 업로드",
    desc: "메인 화면의 점선 박스에 영수증 사진을 드래그하거나 클릭해서 올려주세요. 여러 장을 한 번에 선택할 수 있어요.",
  },
  {
    title: "금액 입력 또는 자동 인식",
    desc: "각 영수증 옆의 금액 칸에 직접 입력하거나, '금액 인식' 버튼을 누르면 사진 속 숫자를 자동으로 읽어와요. 인식이 어긋나면 직접 고치면 돼요.",
  },
  {
    title: "오른쪽 A4 미리보기 확인",
    desc: "업로드한 영수증은 오른쪽 A4 용지 미리보기에 자동으로 정렬돼요. 영수증이 6장을 넘으면 다음 페이지로 자동으로 넘어가요.",
  },
  {
    title: "PDF로 다운로드하거나 저장",
    desc: "'A4로 다운로드'를 누르면 정리된 PDF가 바로 저장돼요. 로그인 후 제목과 카테고리를 입력하고 '마이페이지에 저장'을 누르면 나중에 다시 찾아볼 수 있어요.",
  },
];

const basicStepsVi: Omit<Step, "icon">[] = [
  {
    title: "Tải ảnh hóa đơn lên",
    desc: "Kéo thả hoặc nhấp để tải ảnh hóa đơn vào khung nét đứt ở màn hình chính. Có thể chọn nhiều ảnh cùng lúc.",
  },
  {
    title: "Nhập số tiền hoặc nhận diện tự động",
    desc: "Nhập trực tiếp vào ô số tiền bên cạnh mỗi hóa đơn, hoặc nhấn nút \"Nhận diện số tiền\" để tự động đọc số trong ảnh. Nếu nhận diện sai, bạn có thể sửa trực tiếp.",
  },
  {
    title: "Kiểm tra bản xem trước A4",
    desc: "Hóa đơn đã tải lên sẽ tự động được sắp xếp trong bản xem trước khổ A4. Khi vượt quá 6 hóa đơn, hệ thống tự động chuyển sang trang tiếp theo.",
  },
  {
    title: "Tải PDF hoặc lưu lại",
    desc: "Nhấn \"Lưu PDF\" để lưu ngay bản PDF đã sắp xếp. Sau khi đăng nhập, nhập tiêu đề và danh mục rồi nhấn \"Lưu vào trang cá nhân\" để xem lại sau.",
  },
];

const myPageStepsKo: Omit<Step, "icon">[] = [
  {
    title: "정리 내역 검색·필터",
    desc: "마이페이지 → 영수증 정리 내역에서 제목 검색, 최신순/금액순 정렬, 기간·카테고리·금액 범위로 필터링할 수 있어요.",
  },
  {
    title: "저장한 내역 A4 미리보기·다운로드",
    desc: "'A4 보기'를 누르면 저장된 PDF를 먼저 화면에서 확인하고, 다운로드 버튼으로 저장할 수 있어요.",
  },
  {
    title: "제목·카테고리·금액 수정 또는 삭제",
    desc: "각 항목의 '수정'으로 제목·카테고리·금액을 바꾸거나, 휴지통 아이콘으로 잘못 저장한 내역을 삭제할 수 있어요.",
  },
  {
    title: "엑셀로 내보내기",
    desc: "'엑셀 다운로드' 버튼을 누르면 현재 검색·필터 조건에 맞는 내역이 날짜·제목·카테고리·금액이 담긴 엑셀 파일로 저장돼요.",
  },
];

const myPageStepsVi: Omit<Step, "icon">[] = [
  {
    title: "Tìm kiếm và lọc lịch sử",
    desc: "Trong Trang cá nhân → Lịch sử hóa đơn, bạn có thể tìm theo tiêu đề, sắp xếp theo mới nhất/số tiền, và lọc theo khoảng thời gian, danh mục, số tiền.",
  },
  {
    title: "Xem trước A4 và tải PDF đã lưu",
    desc: "Nhấn \"Xem A4\" để xem trước PDF đã lưu trên màn hình, sau đó dùng nút tải xuống để lưu về máy.",
  },
  {
    title: "Sửa hoặc xóa tiêu đề, danh mục, số tiền",
    desc: "Nhấn \"Sửa\" ở từng mục để đổi tiêu đề, danh mục, số tiền, hoặc dùng biểu tượng thùng rác để xóa mục lưu nhầm.",
  },
  {
    title: "Xuất ra Excel",
    desc: "Nhấn nút \"Tải Excel\" để lưu các mục khớp với điều kiện tìm kiếm/lọc hiện tại thành file Excel gồm ngày, tiêu đề, danh mục, số tiền.",
  },
];

const otherStepsKo: Omit<Step, "icon">[] = [
  {
    title: "통계에서 지출 한눈에 보기",
    desc: "상단 '통계' 메뉴에서 이번 달 지출, 카테고리별 비중, 최근 6개월 추이를 볼 수 있어요.",
  },
  {
    title: "홈 화면에 앱으로 설치하기",
    desc: "모바일 브라우저 메뉴의 '홈 화면에 추가'(안드로이드) 또는 '홈 화면에 추가'(iOS 사파리 공유 버튼), PC 크롬은 주소창의 설치 아이콘을 누르면 앱처럼 설치해서 쓸 수 있어요.",
  },
  {
    title: "비밀번호를 잊었을 때",
    desc: "로그인 화면의 '비밀번호를 잊으셨나요?'를 누르고 가입한 이메일을 입력하면 재설정 링크를 보내드려요.",
  },
  {
    title: "계정을 더 이상 쓰지 않을 때",
    desc: "마이페이지 화면 맨 아래, '이용약관' 왼쪽의 '회원 탈퇴'를 누르면 계정과 저장된 모든 내역이 삭제돼요. 되돌릴 수 없으니 신중하게 진행해주세요.",
  },
];

const otherStepsVi: Omit<Step, "icon">[] = [
  {
    title: "Xem chi tiêu tổng quan trong Thống kê",
    desc: "Trong menu \"Thống kê\" ở đầu trang, bạn có thể xem chi tiêu tháng này, tỷ trọng theo danh mục, và xu hướng 6 tháng gần đây.",
  },
  {
    title: "Cài đặt như một ứng dụng trên màn hình chính",
    desc: "Trên trình duyệt di động, chọn \"Thêm vào màn hình chính\" (Android) hoặc nút chia sẻ rồi \"Thêm vào màn hình chính\" (Safari trên iOS); trên Chrome máy tính, nhấn biểu tượng cài đặt trên thanh địa chỉ để dùng như một ứng dụng.",
  },
  {
    title: "Khi quên mật khẩu",
    desc: "Nhấn \"Quên mật khẩu?\" ở màn hình đăng nhập, nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.",
  },
  {
    title: "Khi không muốn dùng tài khoản nữa",
    desc: "Ở cuối trang cá nhân, bên trái \"Điều khoản sử dụng\", nhấn \"Xóa tài khoản\" để xóa tài khoản cùng toàn bộ lịch sử đã lưu. Không thể khôi phục nên hãy cân nhắc kỹ trước khi thực hiện.",
  },
];

const iconPaths = [
  "M12 4v12M12 16l-4-4M12 16l4-4 M4 20h16",
  "M9 12l2 2 4-4 M12 3a9 9 0 100 18 9 9 0 000-18z",
  "M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z M14 4v4h4",
  "M12 4v12M12 16l-4-4M12 16l4-4 M4 20h16",
];
const myPageIconPaths = [
  "M11 4a7 7 0 100 14 7 7 0 000-14z M21 21l-4.35-4.35",
  "M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z M14 4v4h4",
  "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0v12a2 2 0 002 2h6a2 2 0 002-2V7",
  "M12 4v12M12 16l-4-4M12 16l4-4 M4 20h16",
];
const otherIconPaths = [
  "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  "M12 3v12m0 0l-4-4m4 4l4-4 M5 21h14",
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z M8 11V7a4 4 0 118 0v4",
  "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0v12a2 2 0 002 2h6a2 2 0 002-2V7",
];

function withIcons(steps: Omit<Step, "icon">[], paths: string[]): Step[] {
  return steps.map((s, i) => ({ ...s, icon: icon(paths[i]) }));
}

function getSteps(language: Language) {
  return {
    basicSteps: withIcons(language === "vi" ? basicStepsVi : basicStepsKo, iconPaths),
    myPageSteps: withIcons(language === "vi" ? myPageStepsVi : myPageStepsKo, myPageIconPaths),
    otherSteps: withIcons(language === "vi" ? otherStepsVi : otherStepsKo, otherIconPaths),
  };
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#EAF2FF",
          color: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {index}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{step.title}</p>
        <p style={{ margin: "4px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "var(--text)" }}>
          {step.desc}
        </p>
      </div>
    </div>
  );
}

function StepSection({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 17, marginBottom: 12 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => (
          <StepCard key={step.title} step={step} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

export default function GuidePage() {
  const { language } = useLanguage();
  const { basicSteps, myPageSteps, otherSteps } = getSteps(language);
  const isVi = language === "vi";
  usePageMeta(
    isVi ? "Hướng dẫn sử dụng · MoaMoa" : "이용 가이드 · 모아모아",
    isVi
      ? "Hướng dẫn tải lên và sắp xếp hóa đơn, nhận diện số tiền tự động, và cách dùng Trang cá nhân trên MoaMoa."
      : "모아모아로 영수증을 업로드하고 정리하는 방법, 금액 자동 인식, 마이페이지 활용법을 안내합니다."
  );
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>{isVi ? "Hướng dẫn sử dụng" : "이용 가이드"}</h1>
      <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 32 }}>
        {isVi
          ? "Đây là những cách cơ bản để sắp xếp hóa đơn bằng MoaMoa."
          : "모아모아로 영수증을 정리하는 기본적인 방법을 안내해드려요."}
      </p>

      <StepSection title={isVi ? "Sắp xếp hóa đơn" : "영수증 정리하기"} steps={basicSteps} />
      <StepSection title={isVi ? "Sử dụng Trang cá nhân" : "마이페이지 활용하기"} steps={myPageSteps} />
      <StepSection title={isVi ? "Những điều nên biết thêm" : "더 알아두면 좋은 것들"} steps={otherSteps} />

      <p style={{ fontSize: 13, color: "var(--sub)", textAlign: "center", marginTop: 8 }}>
        {isVi
          ? "Nếu còn thắc mắc, vui lòng liên hệ jinujeon05@gmail.com."
          : "더 궁금한 점은 jinujeon05@gmail.com 으로 문의해주세요."}
      </p>
    </main>
  );
}
