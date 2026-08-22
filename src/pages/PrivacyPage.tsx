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

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
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
          이용자의 개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시 지체 없이 파기합니다. 현재
          서비스에는 별도의 탈퇴 기능이 준비되어 있지 않아, 계정 삭제를 원하실 경우 아래 문의
          이메일로 요청해주시면 처리해드립니다. 관계 법령에 따라 보존이 필요한 경우 해당 기간
          동안 별도 보관 후 파기합니다.
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
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. 정보주체의 권리와 행사 방법</h2>
        <p style={textStyle}>
          이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴(개인정보
          삭제)를 요청할 수 있습니다. 마이페이지에서 이름을 직접 수정할 수 있고, 그 외 권리 행사는
          아래 문의 이메일을 통해 요청할 수 있습니다.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>7. 개인정보의 안전성 확보 조치</h2>
        <ul style={{ ...textStyle, paddingLeft: 20 }}>
          <li>비밀번호는 인증 제공자(Supabase Auth)를 통해 암호화되어 저장되며, 운영자도 원문을 알 수 없습니다.</li>
          <li>모든 통신 구간에 HTTPS 암호화를 적용합니다.</li>
          <li>데이터베이스는 행 단위 접근 제어(Row Level Security)를 적용해 본인의 데이터만 조회·수정할 수 있도록 제한합니다.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>8. 개인정보 보호책임자</h2>
        <p style={textStyle}>
          모아모아는 사업자 등록이 되어 있지 않은 개인 개발자가 운영하는 서비스로, 아래 연락처를
          통해 개인정보 관련 문의를 받고 있습니다.
          <br />
          이메일: jinujeon05@gmail.com
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>9. 고지의 의무</h2>
        <p style={textStyle}>
          본 방침은 법령·정책 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내
          공지사항을 통해 안내합니다.
        </p>
      </section>
    </main>
  );
}
