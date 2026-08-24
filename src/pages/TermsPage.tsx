import { usePageMeta } from "../hooks/usePageMeta";
import { useLanguage } from "../context/LanguageContext";

const sectionStyle = { marginBottom: 24 };
const headingStyle = { fontSize: 16, marginBottom: 8 };
const textStyle = { fontSize: 14, lineHeight: 1.7, color: "var(--text)", margin: 0 };

function KoContent() {
  return (
    <>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>이용약관</h1>
      <p style={{ fontSize: 13, color: "var(--sub)", marginBottom: 28 }}>시행일: 2026년 8월 22일</p>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제1조 (목적)</h2>
        <p style={textStyle}>
          이 약관은 모아모아(이하 "서비스")를 이용함에 있어 서비스 운영자(이하 "운영자")와 이용자 간의
          권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제2조 (운영자 정보)</h2>
        <p style={textStyle}>
          모아모아는 사업자 등록이 되어 있지 않은 개인 개발자가 운영하는 서비스입니다. 문의는 아래
          이메일로 받고 있습니다.
          <br />
          문의: jinujeon05@gmail.com
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제3조 (서비스의 내용)</h2>
        <p style={textStyle}>
          서비스는 이용자가 업로드한 영수증 이미지를 A4 용지 형태로 정렬하여 PDF로 다운로드하고, 원할
          경우 계정에 저장하여 지출 내역·통계를 조회할 수 있는 기능을 제공합니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제4조 (약관의 효력 및 변경)</h2>
        <p style={textStyle}>
          이 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 운영자는 필요한 경우 관련 법령을
          위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 적용됩니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제5조 (회원가입 및 계정)</h2>
        <p style={textStyle}>
          이용자는 이메일/비밀번호 또는 Google 계정을 통해 회원가입을 할 수 있습니다. 이용자는 본인의
          계정 정보를 안전하게 관리할 책임이 있으며, 계정 정보 유출로 인한 불이익에 대해 운영자는
          고의 또는 중과실이 없는 한 책임을 지지 않습니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제6조 (이용자의 의무)</h2>
        <p style={textStyle}>
          이용자는 관계 법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 사항을 준수하여야
          하며, 다음 행위를 하여서는 안 됩니다.
        </p>
        <ul style={{ ...textStyle, paddingLeft: 20, marginTop: 8 }}>
          <li>타인의 정보를 도용하여 서비스를 이용하는 행위</li>
          <li>서비스의 안정적 운영을 방해할 수 있는 행위</li>
          <li>법령 또는 공서양속에 위반되는 콘텐츠를 업로드하는 행위</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제7조 (콘텐츠의 소유권)</h2>
        <p style={textStyle}>
          이용자가 업로드한 영수증 이미지 및 그로부터 생성된 PDF에 대한 권리는 이용자에게 있습니다.
          운영자는 서비스 제공 목적 범위 내에서만 해당 콘텐츠를 처리하며, 별도 동의 없이 다른 목적으로
          이용하지 않습니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제8조 (면책조항)</h2>
        <p style={textStyle}>
          서비스는 무료로 제공되며, 운영자는 관련 법령에 특별한 규정이 없는 한 서비스 이용과 관련하여
          발생한 손해에 대해 책임을 지지 않습니다. 서비스가 계산·정렬한 금액 합계는 이용자가 직접 입력한
          값을 기반으로 하며, 그 정확성에 대한 최종 확인 책임은 이용자에게 있습니다. 운영자는 천재지변,
          시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제9조 (서비스 중단 및 데이터)</h2>
        <p style={textStyle}>
          운영자는 서비스 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 수정, 중단할 수
          있습니다. 서비스 중단이 예정된 경우 사전에 공지합니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>제10조 (문의)</h2>
        <p style={textStyle}>
          서비스 이용과 관련한 문의는 jinujeon05@gmail.com 으로 연락해주시기 바랍니다.
        </p>
      </section>
    </>
  );
}

function ViContent() {
  return (
    <>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Điều khoản sử dụng</h1>
      <p style={{ fontSize: 13, color: "var(--sub)", marginBottom: 28 }}>Ngày hiệu lực: 22/08/2026</p>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 1 (Mục đích)</h2>
        <p style={textStyle}>
          Điều khoản này quy định quyền, nghĩa vụ, trách nhiệm và các vấn đề cần thiết khác giữa
          Nhà điều hành dịch vụ (sau đây gọi là "Nhà điều hành") và người dùng khi sử dụng MoaMoa
          (sau đây gọi là "Dịch vụ").
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 2 (Thông tin Nhà điều hành)</h2>
        <p style={textStyle}>
          MoaMoa là dịch vụ do một lập trình viên cá nhân không có đăng ký kinh doanh vận hành. Mọi
          thắc mắc vui lòng liên hệ qua email bên dưới.
          <br />
          Liên hệ: jinujeon05@gmail.com
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 3 (Nội dung dịch vụ)</h2>
        <p style={textStyle}>
          Dịch vụ cung cấp tính năng sắp xếp ảnh hóa đơn do người dùng tải lên theo khổ giấy A4,
          tải xuống dưới dạng PDF, và nếu muốn, lưu vào tài khoản để xem lịch sử chi tiêu và thống
          kê.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 4 (Hiệu lực và thay đổi điều khoản)</h2>
        <p style={textStyle}>
          Điều khoản này có hiệu lực khi được đăng trên màn hình dịch vụ. Nhà điều hành có thể thay
          đổi điều khoản trong phạm vi không vi phạm pháp luật liên quan khi cần thiết, và điều
          khoản đã thay đổi sẽ được áp dụng sau khi thông báo trong dịch vụ.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 5 (Đăng ký thành viên và tài khoản)</h2>
        <p style={textStyle}>
          Người dùng có thể đăng ký bằng email/mật khẩu hoặc tài khoản Google. Người dùng có trách
          nhiệm quản lý an toàn thông tin tài khoản của mình, và Nhà điều hành không chịu trách
          nhiệm về thiệt hại do rò rỉ thông tin tài khoản, trừ trường hợp do cố ý hoặc lỗi nghiêm
          trọng của Nhà điều hành.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 6 (Nghĩa vụ của người dùng)</h2>
        <p style={textStyle}>
          Người dùng phải tuân thủ pháp luật liên quan, quy định của điều khoản này, hướng dẫn sử
          dụng và các thông báo liên quan đến dịch vụ, và không được thực hiện các hành vi sau.
        </p>
        <ul style={{ ...textStyle, paddingLeft: 20, marginTop: 8 }}>
          <li>Sử dụng dịch vụ bằng cách đánh cắp thông tin của người khác</li>
          <li>Hành vi có thể cản trở hoạt động ổn định của dịch vụ</li>
          <li>Tải lên nội dung vi phạm pháp luật hoặc thuần phong mỹ tục</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 7 (Quyền sở hữu nội dung)</h2>
        <p style={textStyle}>
          Quyền đối với ảnh hóa đơn người dùng tải lên và PDF được tạo ra từ đó thuộc về người
          dùng. Nhà điều hành chỉ xử lý nội dung đó trong phạm vi mục đích cung cấp dịch vụ, và
          không sử dụng cho mục đích khác nếu không có sự đồng ý riêng.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 8 (Điều khoản miễn trừ trách nhiệm)</h2>
        <p style={textStyle}>
          Dịch vụ được cung cấp miễn phí, và trừ khi pháp luật liên quan có quy định đặc biệt, Nhà
          điều hành không chịu trách nhiệm về thiệt hại phát sinh liên quan đến việc sử dụng dịch
          vụ. Tổng số tiền do dịch vụ tính toán và sắp xếp dựa trên giá trị người dùng tự nhập, và
          trách nhiệm xác nhận cuối cùng về độ chính xác thuộc về người dùng. Nhà điều hành không
          chịu trách nhiệm về việc gián đoạn dịch vụ do thiên tai, sự cố hệ thống hoặc các trường
          hợp bất khả kháng khác.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 9 (Ngừng dịch vụ và dữ liệu)</h2>
        <p style={textStyle}>
          Nhà điều hành có thể sửa đổi hoặc ngừng một phần hoặc toàn bộ dịch vụ khi cần thiết vì lý
          do vận hành hoặc kỹ thuật. Nếu việc ngừng dịch vụ được lên kế hoạch trước, thông báo sẽ
          được đưa ra trước.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Điều 10 (Liên hệ)</h2>
        <p style={textStyle}>
          Mọi thắc mắc liên quan đến việc sử dụng dịch vụ vui lòng liên hệ jinujeon05@gmail.com.
        </p>
      </section>
    </>
  );
}

export default function TermsPage() {
  const { language } = useLanguage();
  usePageMeta(language === "vi" ? "Điều khoản sử dụng · MoaMoa" : "이용약관 · 모아모아");
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      {language === "vi" ? <ViContent /> : <KoContent />}
    </main>
  );
}
