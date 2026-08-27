# DPD CSS 정리 기준

## 목표

- 새 오버라이드 파일을 추가하지 않고, 현재 사용 중인 규칙을 역할별 파일로 이동한다.
- `:root`, 기본 `html`, 기본 `body`, `::selection`은 `design-system.css`에서만 관리한다.
- 레퍼런스 사이트 파일명과 `common/cm_*` 구조를 DPD 기준 파일명으로 통합한다.
- 외부 라이브러리 CSS와 DPD 작성 CSS를 분리한다.

## 현재 로드 구조

HTML에서 직접 로드:

- `design-system.css`
- `remixicon.css`
- `plugin/swiper.css`
- `dpd-legacy.css`
- `dpd-site.css`

`dpd-legacy.css`에서 간접 로드:

- `default.css`
- `animate.css`
- `layout.css`
- `content.css`
- `content_jy.css`
- `content_responsive.css`
- `main_t(260306).css`
- `main_responsive.css`
- `common/cm_bbs_common.css`
- `common/cm_board.css`
- `common/cm_gallery.css`
- `common/cm_online.css`
- `common/cm_sitemap.css`
- `plugin/slick.css`
- `plugin/magnific-popup.css`
- `plugin/spotlight.css`
- `plugin/jquery.mCustomScrollbar.css`

## 목표 카테고리

1. `design-system.css`
   - 토큰, 폰트, 전역 기본값
   - `:root`, 기본 `html`, 기본 `body`, `::selection`

2. `dpd-foundation.css`
   - reset
   - 접근성
   - 공용 유틸리티
   - 기본 애니메이션

3. `dpd-layout.css`
   - header
   - footer
   - gnb
   - sitemap
   - common layout wrapper
   - sub page title/navigation shell

4. `dpd-pages.css`
   - main page sections
   - sub page content layouts
   - company/business/product/support/customer page content

5. `dpd-board.css`
   - notice/list/view board
   - gallery/download card
   - contact form
   - inquiry/online form

6. `dpd-vendors.css`
   - slick
   - magnific popup
   - spotlight
   - mCustomScrollbar
   - DPD에서 직접 수정하지 않는 플러그인 CSS

7. `dpd-site.css`
   - 새 DPD 컴포넌트
   - 현재 디자인 유지에 필요한 신규 컴포넌트
   - 이전 파일에서 이동 완료된 컴포넌트

## 이동 매핑

| 현재 파일 | 목표 파일 |
| --- | --- |
| `default.css` | `dpd-foundation.css` |
| `animate.css` | `dpd-foundation.css` |
| `layout.css` | `dpd-layout.css` |
| `common/cm_sitemap.css` | `dpd-layout.css` |
| `main_t(260306).css` | `dpd-pages.css` |
| `main_responsive.css` | `dpd-pages.css` |
| `content.css` | `dpd-pages.css` |
| `content_jy.css` | `dpd-pages.css` |
| `content_responsive.css` | `dpd-pages.css` |
| `common/cm_bbs_common.css` | `dpd-board.css` |
| `common/cm_board.css` | `dpd-board.css` |
| `common/cm_gallery.css` | `dpd-board.css` |
| `common/cm_online.css` | `dpd-board.css` |
| `plugin/slick.css` | `dpd-vendors.css` |
| `plugin/magnific-popup.css` | `dpd-vendors.css` |
| `plugin/spotlight.css` | `dpd-vendors.css` |
| `plugin/jquery.mCustomScrollbar.css` | `dpd-vendors.css` |

## 진행 순서

1. 전역 기본값을 `design-system.css`로 이동한다.
2. 간접 로드 CSS를 목표 파일별로 병합한다.
3. 병합 파일 안에서 섹션 주석과 클래스 네이밍을 DPD 기준으로 정리한다.
4. HTML 로드 구조에서 `dpd-legacy.css`를 제거하고 목표 파일을 직접 로드한다.
5. 브라우저에서 메인, 회사소개, 개발품목, 취급품목, 자료실, 공지사항, 문의하기를 확인한다.
6. 연결이 끊긴 레거시 CSS 파일은 삭제가 아니라 `css/archive/`로 이동한 뒤 최종 확인 후 제거한다.

