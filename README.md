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

현재 관리자 페이지는 프론트엔드 전용 프로토타입입니다. 입력/수정 데이터는 `localStorage`에 저장되며, 백엔드 개발 시 `assets/js/cms-store.js`의 저장 계층을 API 연동 방식으로 교체하면 됩니다.

## 주요 구조

- `index.html`: 국문 메인 페이지
- `kr/`: 국문 서브 페이지
- `en/`: 영문 진입용 페이지
- `admin/`: 관리자 로그인, 목록, 입력 페이지
- `assets/css/`: 사이트 및 관리자 스타일
- `assets/js/`: 사이트 인터랙션, CMS 데이터/렌더러/관리자 스크립트
- `assets/images/`: 프론트 및 관리자에서 사용하는 이미지/비디오 자산
- `assets/downloads/`: 자료실 다운로드 파일
- `assets/fonts/`: SUIT, Remix Icon 폰트

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

