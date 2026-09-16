# DPD Website

주식회사 디피디 웹사이트 정적 프론트엔드 프로젝트입니다. 프론트 화면과 관리자 화면은 모두 HTML, CSS, JavaScript 기반으로 구성되어 있으며, 백엔드 연결 전까지 관리자 데이터는 브라우저 저장소를 사용합니다.

## 로컬 실행

```powershell
py -3 -m http.server 4174
```

브라우저에서 아래 주소로 확인합니다.

- 프론트: `http://127.0.0.1:4174/index.html`
- 관리자: `http://127.0.0.1:4174/admin/login.html`

## 관리자 로그인

- ID: `admin`
- Password: `dpd2026`

현재 관리자 페이지는 프론트엔드 전용 프로토타입입니다. 입력/수정 데이터는 `localStorage`에 저장됩니다.

저장 위치에 관한 코드는 `assets/js/cms-store.js`의 저장 어댑터 한 곳에만 있습니다. 백엔드가 준비되면 `assets/js/cms-api-adapter.js`의 엔드포인트를 채우고 관리자/프론트 페이지에서 `cms-store.js` 다음에 불러오면 됩니다. 화면 코드는 고치지 않습니다.

## 주요 구조

- `index.html`: 국문 메인 페이지
- `kr/`: 국문 서브 페이지
- `en/`: 영문 진입용 페이지
- `admin/`: 관리자 로그인, 목록, 입력 페이지
- `assets/css/`: 사이트 및 관리자 스타일
- `assets/js/`: 사이트 인터랙션, CMS 데이터/렌더러/관리자 스크립트, 다국어 스크립트
- `assets/images/`: 프론트 및 관리자에서 사용하는 이미지/비디오 자산
- `assets/downloads/`: 자료실 다운로드 파일
- `assets/fonts/`: SUIT, Remix Icon 폰트

## 다국어

국문 페이지 하나로 국·영문을 모두 보여줍니다. `?lang=en`이 붙으면 `assets/js/i18n.js`가 `assets/js/content-data.js`의 번역을 적용합니다.

번역은 두 층입니다.

- `pages`: 페이지별 CSS 셀렉터에 붙는 번역. 같은 문구를 페이지마다 다르게 쓸 때 사용합니다.
- `manual`: 사이트 전체 공용 사전. `text`(본문), `attrs`(title/aria-label/alt/placeholder), `titles`(문서 제목), `attrPatterns`(품목명이 끼어드는 접근성 문구용 패턴)로 나뉩니다.

`pages` 항목은 저장된 한국어 원문과 화면의 실제 문구가 같을 때만 적용됩니다. 마크업이 바뀌어 셀렉터가 다른 노드를 가리키면 번역이 적용되지 않은 채로 드러나며, 엉뚱한 영문이 들어가지 않습니다.

`en/` 폴더는 구버전 잔재이며 `i18n.js`가 `kr/<경로>?lang=en`으로 넘깁니다.

## CSS 구조

프론트 CSS는 역할별로 분리되어 있습니다.

- `tokens.css`: 디자인 토큰, 폰트, 전역 기본값
- `foundation.css`: 리셋, 접근성, 공통 유틸리티
- `layout.css`: 헤더, 푸터, 네비게이션, 공통 레이아웃
- `pages.css`: 메인/서브 페이지 콘텐츠
- `components.css`: DPD 사이트 컴포넌트와 인터랙션
- `board.css`: 게시판, 자료실, 문의 폼
- `vendors.css`: 외부 플러그인 스타일
- `icons.css`: Remix Icon
- `swiper.css`: Swiper 스타일

관리자 CSS는 프론트 CSS와 분리되어 있습니다.

- `admin-system.css`: 관리자 전용 디자인 토큰
- `admin-icons.css`: 관리자 Remix Icon
- `admin.css`: 관리자 레이아웃, 목록, 입력폼, 토스트, 페이지네이션

## 관리자 데이터 관리 범위

관리자에서 관리하는 데이터는 프론트와 1:1로 연결되는 것을 기준으로 구성되어 있습니다.

- 메인 히어로
- 개발품목
- 공급품목
- 고객사
- 자료실
- 공지사항
- 컨택폼

이미지 및 파일 입력은 주소 직접 입력이 아니라 파일 첨부 UX를 기준으로 구성되어 있습니다. 단, 현재는 프론트엔드 전용 단계이므로 실제 파일 업로드 서버 저장은 백엔드 연결 후 구현해야 합니다.

## 배포 체크

1. 로컬 서버를 실행합니다.
2. `index.html`, 주요 `kr/` 페이지, `admin/login.html`을 확인합니다.
3. 관리자에서 콘텐츠 목록, 입력폼, 파일 첨부 UI, 토스트 메시지를 확인합니다.
4. 정적 호스팅에 업로드할 때는 루트 기준으로 전체 폴더 구조를 유지합니다.

## 점검 스크립트

Node 18 이상에서 프로젝트 루트 기준으로 실행합니다.

```bash
node scripts/audit-local-links.mjs && node scripts/audit-navigation-state.mjs && node scripts/audit-css-tokens.mjs && node scripts/audit-i18n.mjs
```

- `audit-local-links.mjs`: HTML/CSS의 로컬 경로가 실제 파일을 가리키는지 확인합니다. 이전 템플릿에서 넘어온 미사용 이미지 경로는 `legacyTemplate` 경고로만 보고합니다.
- `audit-navigation-state.mjs`: 모든 국문 페이지의 헤더 GNB와 `dep1`/`dep2` 값이 기준과 같은지 확인합니다.
- `audit-css-tokens.mjs`: 프론트/관리자 CSS에 색·폰트·여백 원시값이 남아 있는지 확인합니다.
- `audit-i18n.mjs`: 번역 데이터에 한국어가 영문 값으로 남아 있는지, 원문과 번역이 같아 무의미한 항목이 있는지 확인합니다. 셀렉터가 실제 DOM과 맞는지는 브라우저에서 확인해야 합니다.

