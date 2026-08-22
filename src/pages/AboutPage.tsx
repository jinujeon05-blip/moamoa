import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

const sectionStyle = { marginBottom: 28 };
const headingStyle = { fontSize: 17, marginBottom: 8 };
const textStyle = { fontSize: 14, lineHeight: 1.75, color: "var(--text)", margin: 0 };

export default function AboutPage() {
  usePageMeta(
    "소개 · 모아모아",
    "영수증 정리가 귀찮아서 만든 개인 개발자의 무료 서비스, 모아모아를 소개합니다."
  );
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>모아모아 소개</h1>
      <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 32 }}>
        영수증을 모으고 정리하는 가장 쉬운 방법을 만들고 있어요.
      </p>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>왜 모아모아를 만들었나요</h2>
        <p style={textStyle}>
          지출 증빙이나 정산을 위해 영수증을 모아야 할 때, 사진을 따로 저장해두고 나중에 하나하나
          금액을 옮겨 적는 일이 늘 번거로웠어요. 모아모아는 그 과정을 단순하게 만들기 위해
          시작됐어요. 영수증 사진 몇 장을 올리기만 하면 A4 용지 형태로 자동 정렬되고, 금액도 사진
          속 글자를 읽어와 자동으로 채워줘요.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>무엇을 제공하나요</h2>
        <p style={textStyle}>
          영수증 이미지를 업로드해 A4로 정리하고 PDF로 내려받는 핵심 기능은 회원가입 없이도 바로
          사용할 수 있어요. 로그인하면 정리한 내역을 저장해두고 검색·수정·삭제할 수 있고, 카테고리별
          지출 통계와 지출 달력, 엑셀 내보내기까지 함께 이용할 수 있어요. 자세한 사용법은{" "}
          <Link to="/guide" style={{ color: "var(--primary)", fontWeight: 600 }}>
            이용 가이드
          </Link>
          에서 확인하실 수 있어요.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>어떻게 운영되나요</h2>
        <p style={textStyle}>
          모아모아는 사업자 등록 없이 개인 개발자 한 명이 만들고 운영하는 서비스예요. 모든 기능은
          무료로 제공되며, 이용자의 데이터는 암호화된 통신과 계정별 접근 제어를 통해 보관돼요.
          자세한 내용은{" "}
          <Link to="/privacy" style={{ color: "var(--primary)", fontWeight: 600 }}>
            개인정보처리방침
          </Link>
          에서 확인하실 수 있어요.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>문의</h2>
        <p style={textStyle}>
          궁금한 점이나 개선하면 좋겠다고 생각되는 부분이 있다면 언제든 아래 이메일로 알려주세요.
          <br />
          이메일: jinujeon05@gmail.com
        </p>
      </section>
    </main>
  );
}
