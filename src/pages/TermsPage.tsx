const sectionStyle = { marginBottom: 24 };
const headingStyle = { fontSize: 16, marginBottom: 8 };
const textStyle = { fontSize: 14, lineHeight: 1.7, color: "var(--text)", margin: 0 };

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
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
    </main>
  );
}
