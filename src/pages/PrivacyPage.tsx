import { usePageMeta } from "../hooks/usePageMeta";
import { useLanguage } from "../context/LanguageContext";

const sectionStyle = { marginBottom: 24 };
const headingStyle = { fontSize: 16, marginBottom: 8 };
const textStyle = { fontSize: 14, lineHeight: 1.7, color: "var(--text)", margin: 0 };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const, fontSize: 13, marginTop: 8 };
const thStyle = {
  textAlign: "left" as const,
  padding: "8px 10px",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--sub)",
  fontWeight: 600,
};
const tdStyle = { padding: "8px 10px", border: "1px solid var(--border)" };

function KoContent() {
  return (
    <>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>개인정보처리방침</h1>
      <p style={{ fontSize: 13, color: "var(--sub)", marginBottom: 28 }}>시행일: 2026년 8월 22일</p>

      <section style={sectionStyle}>
        <p style={textStyle}>
          모아모아(이하 "서비스")를 운영하는 개인 개발자(이하 "운영자")는 이용자의 개인정보를
          중요하게 생각하며, 「개인정보보호법」 등 관련 법령을 준수하기 위해 노력합니다. 본
          방침은 서비스가 어떤 개인정보를 수집하고, 어떻게 이용·보관하는지 안내합니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>1. 수집하는 개인정보 항목</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>구분</th>
              <th style={thStyle}>수집 항목</th>
              <th style={thStyle}>수집 방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>회원가입(이메일)</td>
              <td style={tdStyle}>이메일 주소, 비밀번호(암호화 저장)</td>
              <td style={tdStyle}>이용자 직접 입력</td>
            </tr>
            <tr>
              <td style={tdStyle}>회원가입(Google)</td>
              <td style={tdStyle}>Google 계정 이메일 주소</td>
              <td style={tdStyle}>Google OAuth 인증 시 제공</td>
            </tr>
            <tr>
              <td style={tdStyle}>서비스 이용</td>
              <td style={tdStyle}>
                업로드한 영수증 이미지, 정리 제목·카테고리·금액·메모, 생성된 PDF 파일
              </td>
              <td style={tdStyle}>이용자 직접 업로드·입력</td>
            </tr>
            <tr>
              <td style={tdStyle}>자동 수집</td>
              <td style={tdStyle}>접속 기록, 서비스 이용 기록</td>
              <td style={tdStyle}>서비스 이용 과정에서 자동 생성</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>2. 개인정보의 수집 및 이용 목적</h2>
        <ul style={{ ...textStyle, paddingLeft: 20 }}>
          <li>회원 식별 및 로그인 인증</li>
          <li>영수증 정리, PDF 생성·저장, 지출 통계 등 서비스 제공</li>
          <li>서비스 문의 응대</li>
          <li>서비스 부정 이용 방지</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>3. 개인정보의 보유 및 이용 기간</h2>
        <p style={textStyle}>
          이용자의 개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시 지체 없이 파기합니다.
          마이페이지 하단의 &apos;회원 탈퇴&apos; 메뉴에서 직접 계정과 저장된 정리 내역을 즉시
          삭제할 수 있으며, 그 외 문의는 아래 이메일로 요청해주시면 처리해드립니다. 관계 법령에
          따라 보존이 필요한 경우 해당 기간 동안 별도 보관 후 파기합니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>4. 개인정보의 제3자 제공</h2>
        <p style={textStyle}>
          운영자는 이용자의 개인정보를 본 방침에서 고지한 범위를 초과하여 제3자에게 제공하지
          않습니다. 다만 법령에 근거가 있거나 수사기관이 적법한 절차에 따라 요청하는 경우는
          예외로 합니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>5. 개인정보 처리 위탁 (해외 포함)</h2>
        <p style={textStyle}>
          서비스는 아래와 같은 외부 서비스를 이용해 개인정보를 처리하고 있습니다.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>수탁업체</th>
              <th style={thStyle}>위탁 업무</th>
              <th style={thStyle}>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Supabase (Supabase Inc.)</td>
              <td style={tdStyle}>회원 인증, 데이터베이스, 파일(PDF) 저장</td>
              <td style={tdStyle}>국외 서버 운영</td>
            </tr>
            <tr>
              <td style={tdStyle}>Vercel (Vercel Inc.)</td>
              <td style={tdStyle}>웹사이트 호스팅</td>
              <td style={tdStyle}>국외 서버 운영</td>
            </tr>
            <tr>
              <td style={tdStyle}>Google LLC</td>
              <td style={tdStyle}>Google 소셜 로그인 인증</td>
              <td style={tdStyle}>이용자가 선택한 경우에 한함</td>
            </tr>
            <tr>
              <td style={tdStyle}>Google LLC (AdSense)</td>
              <td style={tdStyle}>광고 게재 및 맞춤 광고 제공</td>
              <td style={tdStyle}>광고 도입 시 적용</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. 쿠키 및 광고</h2>
        <p style={textStyle}>
          서비스는 Google AdSense 등 제3자 광고 서비스를 이용해 광고를 게재할 수 있습니다. Google을
          비롯한 광고 사업자는 쿠키를 사용하여 이용자가 이 사이트 및 다른 사이트를 방문한 기록을
          바탕으로 관심 기반 맞춤 광고를 게재할 수 있습니다.
        </p>
        <ul style={{ ...textStyle, paddingLeft: 20, marginTop: 8 }}>
          <li>
            이용자는{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
              Google 광고 설정
            </a>
            에서 맞춤 광고를 비활성화할 수 있습니다.
          </li>
          <li>
            웹 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있으며, 이 경우 서비스 일부 기능
            이용에 제한이 있을 수 있습니다.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>7. 정보주체의 권리와 행사 방법</h2>
        <p style={textStyle}>
          이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴(개인정보
          삭제)를 요청할 수 있습니다. 마이페이지에서 이름을 직접 수정할 수 있고, 그 외 권리 행사는
          아래 문의 이메일을 통해 요청할 수 있습니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>8. 개인정보의 안전성 확보 조치</h2>
        <ul style={{ ...textStyle, paddingLeft: 20 }}>
          <li>비밀번호는 인증 제공자(Supabase Auth)를 통해 암호화되어 저장되며, 운영자도 원문을 알 수 없습니다.</li>
          <li>모든 통신 구간에 HTTPS 암호화를 적용합니다.</li>
          <li>데이터베이스는 행 단위 접근 제어(Row Level Security)를 적용해 본인의 데이터만 조회·수정할 수 있도록 제한합니다.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>9. 개인정보 보호책임자</h2>
        <p style={textStyle}>
          모아모아는 사업자 등록이 되어 있지 않은 개인 개발자가 운영하는 서비스로, 아래 연락처를
          통해 개인정보 관련 문의를 받고 있습니다.
          <br />
          이메일: jinujeon05@gmail.com
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>10. 고지의 의무</h2>
        <p style={textStyle}>
          본 방침은 법령·정책 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내
          공지사항을 통해 안내합니다.
        </p>
      </section>
    </>
  );
}

function ViContent() {
  return (
    <>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Chính sách bảo mật</h1>
      <p style={{ fontSize: 13, color: "var(--sub)", marginBottom: 28 }}>Ngày hiệu lực: 22/08/2026</p>

      <section style={sectionStyle}>
        <p style={textStyle}>
          Lập trình viên cá nhân (sau đây gọi là "Nhà điều hành") vận hành MoaMoa (sau đây gọi là
          "Dịch vụ") coi trọng thông tin cá nhân của người dùng và nỗ lực tuân thủ các quy định
          pháp luật liên quan. Chính sách này giải thích Dịch vụ thu thập những thông tin cá nhân
          nào và sử dụng, lưu trữ chúng ra sao.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>1. Thông tin cá nhân được thu thập</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Phân loại</th>
              <th style={thStyle}>Thông tin thu thập</th>
              <th style={thStyle}>Cách thu thập</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Đăng ký (Email)</td>
              <td style={tdStyle}>Địa chỉ email, mật khẩu (lưu dưới dạng mã hóa)</td>
              <td style={tdStyle}>Người dùng nhập trực tiếp</td>
            </tr>
            <tr>
              <td style={tdStyle}>Đăng ký (Google)</td>
              <td style={tdStyle}>Địa chỉ email tài khoản Google</td>
              <td style={tdStyle}>Cung cấp khi xác thực Google OAuth</td>
            </tr>
            <tr>
              <td style={tdStyle}>Sử dụng dịch vụ</td>
              <td style={tdStyle}>
                Ảnh hóa đơn đã tải lên, tiêu đề/danh mục/số tiền/ghi chú, file PDF đã tạo
              </td>
              <td style={tdStyle}>Người dùng tải lên/nhập trực tiếp</td>
            </tr>
            <tr>
              <td style={tdStyle}>Thu thập tự động</td>
              <td style={tdStyle}>Nhật ký truy cập, nhật ký sử dụng dịch vụ</td>
              <td style={tdStyle}>Tự động tạo trong quá trình sử dụng dịch vụ</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>2. Mục đích thu thập và sử dụng thông tin cá nhân</h2>
        <ul style={{ ...textStyle, paddingLeft: 20 }}>
          <li>Xác định thành viên và xác thực đăng nhập</li>
          <li>Cung cấp dịch vụ sắp xếp hóa đơn, tạo/lưu PDF, thống kê chi tiêu</li>
          <li>Phản hồi các thắc mắc về dịch vụ</li>
          <li>Ngăn chặn việc sử dụng dịch vụ trái phép</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>3. Thời gian lưu giữ và sử dụng thông tin cá nhân</h2>
        <p style={textStyle}>
          Thông tin cá nhân của người dùng được lưu giữ cho đến khi xóa tài khoản, và sẽ bị hủy
          ngay khi có yêu cầu xóa tài khoản. Bạn có thể tự xóa ngay tài khoản và lịch sử đã lưu tại
          mục "Xóa tài khoản" ở cuối Trang cá nhân; các yêu cầu khác vui lòng gửi qua email bên
          dưới để được xử lý. Trường hợp pháp luật yêu cầu lưu trữ, thông tin sẽ được lưu riêng
          trong thời hạn đó rồi hủy.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>4. Cung cấp thông tin cá nhân cho bên thứ ba</h2>
        <p style={textStyle}>
          Nhà điều hành không cung cấp thông tin cá nhân của người dùng cho bên thứ ba ngoài phạm
          vi đã thông báo trong chính sách này, trừ trường hợp có căn cứ pháp luật hoặc cơ quan
          điều tra yêu cầu theo đúng thủ tục pháp lý.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>5. Ủy thác xử lý thông tin cá nhân (bao gồm nước ngoài)</h2>
        <p style={textStyle}>
          Dịch vụ sử dụng các dịch vụ bên ngoài sau đây để xử lý thông tin cá nhân.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Đơn vị được ủy thác</th>
              <th style={thStyle}>Công việc ủy thác</th>
              <th style={thStyle}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Supabase (Supabase Inc.)</td>
              <td style={tdStyle}>Xác thực thành viên, cơ sở dữ liệu, lưu trữ file (PDF)</td>
              <td style={tdStyle}>Vận hành máy chủ ở nước ngoài</td>
            </tr>
            <tr>
              <td style={tdStyle}>Vercel (Vercel Inc.)</td>
              <td style={tdStyle}>Lưu trữ website</td>
              <td style={tdStyle}>Vận hành máy chủ ở nước ngoài</td>
            </tr>
            <tr>
              <td style={tdStyle}>Google LLC</td>
              <td style={tdStyle}>Xác thực đăng nhập bằng Google</td>
              <td style={tdStyle}>Chỉ áp dụng khi người dùng lựa chọn</td>
            </tr>
            <tr>
              <td style={tdStyle}>Google LLC (AdSense)</td>
              <td style={tdStyle}>Hiển thị quảng cáo và quảng cáo tùy chỉnh</td>
              <td style={tdStyle}>Áp dụng khi triển khai quảng cáo</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. Cookie và quảng cáo</h2>
        <p style={textStyle}>
          Dịch vụ có thể hiển thị quảng cáo thông qua dịch vụ quảng cáo bên thứ ba như Google
          AdSense. Google và các đơn vị quảng cáo khác có thể sử dụng cookie để hiển thị quảng cáo
          tùy chỉnh dựa trên lịch sử truy cập trang này và các trang khác của người dùng.
        </p>
        <ul style={{ ...textStyle, paddingLeft: 20, marginTop: 8 }}>
          <li>
            Người dùng có thể tắt quảng cáo tùy chỉnh tại{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
              Cài đặt quảng cáo của Google
            </a>
            .
          </li>
          <li>
            Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt, tuy nhiên điều này có thể
            hạn chế một số tính năng của dịch vụ.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>7. Quyền của chủ thể thông tin và cách thực hiện</h2>
        <p style={textStyle}>
          Người dùng có thể xem hoặc chỉnh sửa thông tin cá nhân của mình bất cứ lúc nào, và có thể
          yêu cầu xóa tài khoản (xóa thông tin cá nhân). Bạn có thể tự sửa tên trong Trang cá nhân;
          các quyền khác có thể yêu cầu qua email liên hệ bên dưới.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>8. Biện pháp bảo đảm an toàn thông tin cá nhân</h2>
        <ul style={{ ...textStyle, paddingLeft: 20 }}>
          <li>Mật khẩu được mã hóa và lưu trữ thông qua nhà cung cấp xác thực (Supabase Auth); ngay cả Nhà điều hành cũng không thể biết nội dung gốc.</li>
          <li>Áp dụng mã hóa HTTPS cho toàn bộ đường truyền.</li>
          <li>Cơ sở dữ liệu áp dụng kiểm soát truy cập theo hàng (Row Level Security), giới hạn chỉ chủ tài khoản mới xem/sửa được dữ liệu của mình.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>9. Người phụ trách bảo vệ thông tin cá nhân</h2>
        <p style={textStyle}>
          MoaMoa là dịch vụ do một lập trình viên cá nhân không có đăng ký kinh doanh vận hành, và
          tiếp nhận các thắc mắc về thông tin cá nhân qua liên hệ bên dưới.
          <br />
          Email: jinujeon05@gmail.com
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>10. Nghĩa vụ thông báo</h2>
        <p style={textStyle}>
          Chính sách này có thể được sửa đổi theo pháp luật, chính sách hoặc thay đổi của dịch vụ,
          và sẽ được thông báo qua mục thông báo trong dịch vụ khi có thay đổi.
        </p>
      </section>
    </>
  );
}

export default function PrivacyPage() {
  const { language } = useLanguage();
  usePageMeta(language === "vi" ? "Chính sách bảo mật · MoaMoa" : "개인정보처리방침 · 모아모아");
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      {language === "vi" ? <ViContent /> : <KoContent />}
    </main>
  );
}
