---
name: proposal
description: 베트남 단기 근로자 인력공급 고객사 제안서(PPTX)를 만든다. 사용자가 고객사 이름·인원·직무·차량지원·단가 등을 주면 labor-kit/proposal/data/clients/에 JSON을 작성하고 generate.js로 제안서를 생성한다. "제안서 만들어줘", "/proposal <고객사 정보>" 에 사용.
---

# 고객사 제안서 생성

작업 폴더: `labor-kit/proposal` (사용법 전체는 `labor-kit/README.md`)

## 순서

1. `data/clients/예시_대성섬유.json`(차량 미지원) 또는 `예시_한빛전자.json`(차량 지원)을 읽어 형식을 확인한다.
2. 사용자가 준 정보로 `data/clients/<고객사명>.json`을 만든다.
   - 필수: `client.name`, `proposalDate`(오늘 날짜), `needs`, `plan`, `vehicle.clientSupport`, `pricing`, `terms`
   - 사용자가 주지 않은 값(과제·해결 방향·조건 문구 등)은 업종에 맞게 합리적으로 채우되, **단가·인원·차량비 같은 숫자는 지어내지 말고** 사용자에게 묻거나 비워둔 사실을 보고한다.
   - `pricing[].role`은 `plan[].role`과 같게 (야간 등 구분이 필요하면 `직무(교대)` 형식) 써야 예상 월 비용이 계산된다.
   - needs ≤ 4, pickupPoints ≤ 5.
3. `node_modules`가 없으면 `npm install`을 먼저 실행한다.
4. `node generate.js data/clients/<고객사명>.json` 실행.
5. 검수: 가능하면 PDF/이미지로 렌더링해 글자 넘침을 확인하고, 불가능하면 `markitdown`으로 텍스트를 확인한다.
6. 생성된 파일 경로와, 예시 값이 남아 있는 항목(`company.json`의 예시 수치 등)을 사용자에게 알린다.

## 주의

- `data/company.json`은 모든 제안서 공통이다. 특정 고객사를 위해 수정하지 않는다.
- 생성물(`output/`)은 git에 올라가지 않는다.
- 배포 규칙(CLAUDE.md): 이 키트는 웹앱 배포와 무관하다. 배포 설정을 건드리지 않는다.
