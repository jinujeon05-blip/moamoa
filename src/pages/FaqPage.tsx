import { usePageMeta } from "../hooks/usePageMeta";
import { useLanguage } from "../context/LanguageContext";

const sectionStyle = { marginBottom: 20 };
const textStyle = { fontSize: 14, lineHeight: 1.7, color: "var(--text)", margin: 0 };

interface QA {
  q: string;
  a: string;
}

const faqsKo: QA[] = [
  {
    q: "모아모아는 무료인가요?",
    a: "네, 모든 기능을 무료로 이용할 수 있어요. 영수증 업로드, A4 정리, PDF 다운로드, 마이페이지 저장, 통계, 엑셀 다운로드까지 별도 비용 없이 사용하실 수 있습니다.",
  },
  {
    q: "회원가입 없이도 사용할 수 있나요?",
    a: "영수증을 업로드해서 A4로 정리하고 PDF로 다운로드하는 기본 기능은 로그인 없이도 사용할 수 있어요. 다만 정리한 내역을 저장해두고 나중에 다시 찾아보려면 회원가입이 필요합니다.",
  },
  {
    q: "영수증 이미지는 몇 장까지 올릴 수 있나요?",
    a: "장수 제한은 없어요. 여러 장을 한 번에 업로드하면 A4 용지 한 장에 6장씩 자동으로 나뉘어 정렬되고, 필요한 만큼 페이지가 자동으로 늘어납니다.",
  },
  {
    q: "금액 자동 인식(OCR)은 얼마나 정확한가요?",
    a: "영수증 사진 속 글자를 인식해서 합계·결제금액처럼 총액을 나타내는 부분을 우선적으로 찾아 금액을 채워드려요. 다만 사진 화질이나 영수증 형태에 따라 정확하지 않을 수 있어서, 인식된 금액은 항상 한 번 확인하고 필요하면 직접 수정해주세요.",
  },
  {
    q: "업로드한 영수증 이미지는 안전하게 보관되나요?",
    a: "로그인해서 저장한 정리 내역은 본인 계정으로만 접근할 수 있도록 암호화된 통신과 접근 제어를 적용해 보관합니다. 자세한 내용은 개인정보처리방침에서 확인하실 수 있어요.",
  },
  {
    q: "여러 기기에서 이용할 수 있나요?",
    a: "네. 로그인 후 저장한 정리 내역은 같은 계정으로 로그인하면 PC, 모바일 어디서든 확인할 수 있어요. 모바일 브라우저에서 '홈 화면에 추가'로 앱처럼 설치해서 쓸 수도 있습니다.",
  },
  {
    q: "잘못 저장한 내역은 어떻게 하나요?",
    a: "마이페이지의 영수증 정리 내역에서 각 항목의 '수정'으로 제목·카테고리·금액을 바꾸거나, 휴지통 아이콘으로 삭제할 수 있어요.",
  },
  {
    q: "카카오 로그인은 지원하지 않나요?",
    a: "현재는 이메일/비밀번호와 Google 로그인만 지원하고 있어요. 카카오 로그인은 준비 중입니다.",
  },
  {
    q: "회원 탈퇴하면 데이터는 어떻게 되나요?",
    a: "마이페이지 하단의 '회원 탈퇴'를 누르면 계정과 저장된 모든 정리 내역, PDF 파일이 즉시 삭제되며 되돌릴 수 없어요.",
  },
];

const faqsVi: QA[] = [
  {
    q: "MoaMoa có miễn phí không?",
    a: "Có, mọi tính năng đều miễn phí. Bạn có thể tải hóa đơn lên, sắp xếp A4, tải PDF, lưu vào trang cá nhân, xem thống kê và tải Excel mà không mất phí.",
  },
  {
    q: "Có thể dùng mà không cần đăng ký không?",
    a: "Tính năng cơ bản — tải hóa đơn lên, sắp xếp A4 và tải PDF — có thể dùng mà không cần đăng nhập. Tuy nhiên, để lưu lịch sử và xem lại sau, bạn cần đăng ký tài khoản.",
  },
  {
    q: "Có thể tải lên tối đa bao nhiêu hóa đơn?",
    a: "Không giới hạn số lượng. Khi tải nhiều ảnh cùng lúc, hệ thống sẽ tự động chia 6 hóa đơn mỗi trang A4, và số trang sẽ tự động tăng khi cần.",
  },
  {
    q: "Nhận diện số tiền tự động (OCR) chính xác đến mức nào?",
    a: "Hệ thống nhận diện chữ trong ảnh hóa đơn và ưu tiên tìm phần thể hiện tổng số tiền như \"tổng cộng\" hoặc \"số tiền thanh toán\" để tự động điền. Tuy nhiên độ chính xác có thể khác nhau tùy chất lượng ảnh và định dạng hóa đơn, vì vậy hãy luôn kiểm tra lại số tiền được nhận diện và sửa nếu cần.",
  },
  {
    q: "Ảnh hóa đơn đã tải lên có được lưu trữ an toàn không?",
    a: "Lịch sử đã lưu sau khi đăng nhập chỉ có thể truy cập bằng chính tài khoản của bạn, được bảo vệ bằng kết nối mã hóa và kiểm soát truy cập. Xem chi tiết tại Chính sách bảo mật.",
  },
  {
    q: "Có thể dùng trên nhiều thiết bị không?",
    a: "Có. Sau khi đăng nhập, lịch sử đã lưu có thể xem trên máy tính hoặc điện thoại bằng cùng một tài khoản. Bạn cũng có thể thêm vào màn hình chính trên trình duyệt di động để dùng như một ứng dụng.",
  },
  {
    q: "Nếu lưu nhầm thì phải làm sao?",
    a: "Trong lịch sử hóa đơn ở trang cá nhân, bạn có thể nhấn \"Sửa\" ở từng mục để đổi tiêu đề, danh mục, số tiền, hoặc nhấn biểu tượng thùng rác để xóa.",
  },
  {
    q: "Có hỗ trợ đăng nhập bằng Kakao không?",
    a: "Hiện tại chỉ hỗ trợ email/mật khẩu và đăng nhập Google. Đăng nhập Kakao đang được chuẩn bị.",
  },
  {
    q: "Xóa tài khoản thì dữ liệu sẽ ra sao?",
    a: "Khi nhấn \"Xóa tài khoản\" ở cuối trang cá nhân, tài khoản cùng toàn bộ lịch sử và file PDF đã lưu sẽ bị xóa ngay lập tức và không thể khôi phục.",
  },
];

export default function FaqPage() {
  const { language, t } = useLanguage();
  const faqs = language === "vi" ? faqsVi : faqsKo;
  usePageMeta(
    language === "vi" ? "Câu hỏi thường gặp · MoaMoa" : "자주 묻는 질문 · 모아모아",
    language === "vi"
      ? "Tổng hợp câu hỏi thường gặp về phí sử dụng, số lượng hóa đơn tải lên, độ chính xác OCR và lưu trữ dữ liệu của MoaMoa."
      : "모아모아 이용 요금, 영수증 업로드 개수, 금액 자동 인식 정확도, 데이터 보관 등 자주 묻는 질문을 모았어요."
  );
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>{t("footer.faq")}</h1>
      <p style={{ fontSize: 13, color: "var(--sub)", marginBottom: 28 }}>
        {language === "vi"
          ? "Tổng hợp những câu hỏi bạn thường thắc mắc khi sử dụng MoaMoa."
          : "모아모아를 사용하시면서 자주 궁금해하시는 내용을 모았어요."}
      </p>

      {faqs.map((item) => (
        <section key={item.q} style={sectionStyle}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Q. {item.q}</p>
          <p style={textStyle}>A. {item.a}</p>
        </section>
      ))}

      <p style={{ fontSize: 13, color: "var(--sub)", textAlign: "center", marginTop: 20 }}>
        {language === "vi"
          ? "Nếu còn thắc mắc, vui lòng liên hệ jinujeon05@gmail.com."
          : "더 궁금한 점은 jinujeon05@gmail.com 으로 문의해주세요."}
      </p>
    </main>
  );
}
