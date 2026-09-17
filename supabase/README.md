# DPD CMS 백엔드

관리자 데이터를 브라우저 `localStorage` 에서 Supabase 로 옮기기 위한 스키마입니다.
프론트는 지금처럼 정적 호스팅에 두고, 브라우저가 publishable(anon) 키로 직접 붙습니다.

## 적용 순서

Supabase 대시보드의 **SQL Editor** 에 순서대로 붙여넣고 실행합니다.

1. `migrations/20260917000001_cms_schema.sql` — 테이블과 공통 컬럼
2. `migrations/20260917000002_rls_policies.sql` — 접근 정책
3. `migrations/20260917000003_storage.sql` — 파일 버킷과 정책
4. `seed.sql` — 지금 사이트에 보이는 내용 그대로 초기 데이터

`seed.sql` 은 다시 실행해도 안전합니다. 같은 id 가 있으면 덮어씁니다.

## 관리자 계정 만들기

비밀번호는 Supabase Auth 가 관리하며 저장소 어디에도 두지 않습니다.
지금처럼 `cms-store.js` 에 평문으로 들어가는 일이 없어집니다.

1. 대시보드 **Authentication → Users → Add user** 에서 관리자 이메일과 비밀번호를 만듭니다.
   비밀번호는 계정 주인이 직접 정합니다.
2. 만들어진 사용자의 UUID 를 복사해 관리자 목록에 넣습니다.

```sql
insert into public.admins (user_id, email)
values ('붙여넣은-uuid', 'admin@example.com')
on conflict (user_id) do nothing;
```

`public.admins` 에 없는 계정은 로그인에 성공해도 콘텐츠를 쓸 수 없습니다.
관리자가 스스로 관리자를 늘릴 수 없도록, 이 테이블은 대시보드에서만 관리합니다.

## 접근 정책 요약

| 대상 | 읽기 | 쓰기 |
|---|---|---|
| 콘텐츠 13종 | 노출 중인 항목은 누구나 / 숨긴 항목은 관리자만 | 관리자만 |
| 문의 접수 (`contact_forms`) | **관리자만** | 접수는 누구나, 수정·삭제는 관리자만 |
| 파일 (`cms-media`, `cms-downloads`) | 누구나 | 관리자만 |

문의 접수에는 이름·연락처·이메일이 들어가므로 읽기를 열지 않습니다.
접수 시에도 방문자가 처리 상태나 관리자 메모를 임의로 채우지 못하도록 막고,
길이 제한을 둬 과도한 입력을 걸러냅니다.

publishable 키는 공개되는 값입니다. 실제 보호는 전적으로 위 RLS 가 합니다.

## 데이터 구조에서 알아둘 것

- **id 는 text 입니다.** 지금 데이터의 id(`handled-han-drive` 등)가 프론트 DOM id 로도
  쓰이고 있어 그대로 옮겼습니다. 새 항목도 같은 규칙으로 만듭니다.
- **순서는 `sort_order` 로 정합니다.** 관리자의 항목 이동 기능이 이 값을 바꿉니다.
  배열 순서에 기대던 것을 컬럼으로 드러낸 것입니다.
- **영문은 `en jsonb` 한 칸입니다.** 관리자 영문 탭이 이미 이 구조로 저장하므로
  데이터가 1:1로 옮겨갑니다. 비어 있으면 국문이 그대로 노출됩니다.
- **컬럼은 snake_case, 프론트 코드는 camelCase 입니다.** 변환은 어댑터가 맡아
  관리자 입력 필드와 프론트 출력 키는 지금과 똑같이 유지됩니다.

## 아직 남은 것

- 프론트 연동 어댑터 (`assets/js/cms-api-adapter.js` 를 Supabase 용으로 교체)
- 관리자 로그인 화면을 Supabase Auth 로 교체
- 파일 첨부를 실제 업로드로 교체
- 기존 `assets/images`, `assets/downloads` 파일을 버킷으로 옮길지 결정
  (그대로 두고 새로 올리는 것만 버킷에 넣어도 됩니다)

## 검증 상태

이 SQL 은 **아직 실제 데이터베이스에서 실행해 보지 않았습니다.** 작업 환경에
Postgres 와 Docker 가 없어 구문 검사만 했습니다. 첫 적용 때 SQL Editor 의
오류 메시지를 확인하면서 진행해야 합니다.
