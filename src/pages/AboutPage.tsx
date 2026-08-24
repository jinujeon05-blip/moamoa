import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLanguage } from "../context/LanguageContext";

const sectionStyle = { marginBottom: 28 };
const headingStyle = { fontSize: 17, marginBottom: 8 };
const textStyle = { fontSize: 14, lineHeight: 1.75, color: "var(--text)", margin: 0 };

const content = {
  ko: {
    pageTitle: "소개 · 모아모아",
    pageDesc: "영수증 정리가 귀찮아서 만든 개인 개발자의 무료 서비스, 모아모아를 소개합니다.",
    h1: "모아모아 소개",
    intro: "영수증을 모으고 정리하는 가장 쉬운 방법을 만들고 있어요.",
    whyTitle: "왜 모아모아를 만들었나요",
    whyBody:
      "지출 증빙이나 정산을 위해 영수증을 모아야 할 때, 사진을 따로 저장해두고 나중에 하나하나 금액을 옮겨 적는 일이 늘 번거로웠어요. 모아모아는 그 과정을 단순하게 만들기 위해 시작됐어요. 영수증 사진 몇 장을 올리기만 하면 A4 용지 형태로 자동 정렬되고, 금액도 사진 속 글자를 읽어와 자동으로 채워줘요.",
    whatTitle: "무엇을 제공하나요",
    whatBodyPrefix:
      "영수증 이미지를 업로드해 A4로 정리하고 PDF로 내려받는 핵심 기능은 회원가입 없이도 바로 사용할 수 있어요. 로그인하면 정리한 내역을 저장해두고 검색·수정·삭제할 수 있고, 카테고리별 지출 통계와 지출 달력, 엑셀 내보내기까지 함께 이용할 수 있어요. 자세한 사용법은",
    guideLink: "이용 가이드",
    whatBodySuffix: "에서 확인하실 수 있어요.",
    howTitle: "어떻게 운영되나요",
    howBodyPrefix:
      "모아모아는 사업자 등록 없이 개인 개발자 한 명이 만들고 운영하는 서비스예요. 모든 기능은 무료로 제공되며, 이용자의 데이터는 암호화된 통신과 계정별 접근 제어를 통해 보관돼요. 자세한 내용은",
    privacyLink: "개인정보처리방침",
    howBodySuffix: "에서 확인하실 수 있어요.",
    contactTitle: "문의",
    contactBody: "궁금한 점이나 개선하면 좋겠다고 생각되는 부분이 있다면 언제든 아래 이메일로 알려주세요.",
    emailLabel: "이메일: jinujeon05@gmail.com",
  },
  vi: {
    pageTitle: "Giới thiệu · MoaMoa",
    pageDesc: "Giới thiệu MoaMoa, dịch vụ miễn phí do một lập trình viên cá nhân tạo ra vì việc sắp xếp hóa đơn quá phiền phức.",
    h1: "Giới thiệu MoaMoa",
    intro: "Chúng tôi đang xây dựng cách đơn giản nhất để thu thập và sắp xếp hóa đơn.",
    whyTitle: "Vì sao MoaMoa ra đời",
    whyBody:
      "Khi cần thu thập hóa đơn để chứng minh chi phí hoặc quyết toán, việc lưu ảnh riêng rồi sau đó ghi lại từng số tiền một luôn rất phiền phức. MoaMoa ra đời để đơn giản hóa quá trình đó. Chỉ cần tải lên vài tấm ảnh hóa đơn, hệ thống sẽ tự động sắp xếp theo khổ A4, và số tiền cũng được đọc tự động từ chữ trong ảnh.",
    whatTitle: "MoaMoa cung cấp những gì",
    whatBodyPrefix:
      "Tính năng chính — tải ảnh hóa đơn lên, sắp xếp theo khổ A4 và tải về dưới dạng PDF — có thể dùng ngay mà không cần đăng ký. Khi đăng nhập, bạn có thể lưu lịch sử, tìm kiếm, sửa và xóa, đồng thời sử dụng thống kê chi tiêu theo danh mục, lịch chi tiêu và xuất Excel. Xem cách sử dụng chi tiết tại",
    guideLink: "Hướng dẫn sử dụng",
    whatBodySuffix: ".",
    howTitle: "MoaMoa được vận hành như thế nào",
    howBodyPrefix:
      "MoaMoa là dịch vụ do một lập trình viên cá nhân xây dựng và vận hành, không có đăng ký kinh doanh. Mọi tính năng đều miễn phí, và dữ liệu của người dùng được lưu trữ qua kết nối mã hóa cùng kiểm soát truy cập theo từng tài khoản. Xem chi tiết tại",
    privacyLink: "Chính sách bảo mật",
    howBodySuffix: ".",
    contactTitle: "Liên hệ",
    contactBody: "Nếu có thắc mắc hoặc góp ý cải thiện, vui lòng liên hệ qua email bên dưới bất cứ lúc nào.",
    emailLabel: "Email: jinujeon05@gmail.com",
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const c = content[language];
  usePageMeta(c.pageTitle, c.pageDesc);
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>{c.h1}</h1>
      <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 32 }}>{c.intro}</p>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>{c.whyTitle}</h2>
        <p style={textStyle}>{c.whyBody}</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>{c.whatTitle}</h2>
        <p style={textStyle}>
          {c.whatBodyPrefix}{" "}
          <Link to="/guide" style={{ color: "var(--primary)", fontWeight: 600 }}>
            {c.guideLink}
          </Link>
          {c.whatBodySuffix}
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>{c.howTitle}</h2>
        <p style={textStyle}>
          {c.howBodyPrefix}{" "}
          <Link to="/privacy" style={{ color: "var(--primary)", fontWeight: 600 }}>
            {c.privacyLink}
          </Link>
          {c.howBodySuffix}
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>{c.contactTitle}</h2>
        <p style={textStyle}>
          {c.contactBody}
          <br />
          {c.emailLabel}
        </p>
      </section>
    </main>
  );
}
