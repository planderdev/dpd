-- DPD CMS 접근 정책
--
-- 프론트는 정적 호스팅이라 브라우저가 publishable(anon) 키로 직접 붙는다.
-- 그 키는 공개되는 값이므로, 실제 보호는 전적으로 아래 RLS 가 한다.
--
-- 기준
--   * 콘텐츠 읽기 : 노출(enabled) 중인 항목은 누구나. 숨긴 항목은 관리자만.
--   * 콘텐츠 쓰기 : 관리자만.
--   * 문의 접수   : 누구나 넣을 수 있고, 읽기·수정은 관리자만.
--                   개인정보가 들어가므로 읽기를 절대 열지 않는다.

-- ── 관리자 목록 ─────────────────────────────────────────────────────────
-- 로그인한 사람이 자기 행만 확인할 수 있게 하고, 추가·삭제는 대시보드에서
-- 서비스 키로 처리한다. 관리자가 스스로 관리자를 늘릴 수 없게 한다.

alter table public.admins enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- ── 콘텐츠 테이블 공통 정책 ─────────────────────────────────────────────

do $$
declare
  cms_table text;
begin
  foreach cms_table in array array[
    'main_hero',
    'development_items',
    'handled_items',
    'customers',
    'resources',
    'notices',
    'company_profile',
    'company_history',
    'certificates',
    'support_steps',
    'network_partner',
    'network_coverage',
    'network_response'
  ]
  loop
    execute format('alter table public.%I enable row level security', cms_table);

    -- 읽기: 노출 중인 항목은 공개. 관리자는 숨긴 항목까지 본다.
    execute format('drop policy if exists "public read enabled" on public.%I', cms_table);
    execute format($p$
      create policy "public read enabled"
        on public.%I for select
        to anon, authenticated
        using (enabled or private.is_admin())
    $p$, cms_table);

    -- 쓰기: 관리자만.
    execute format('drop policy if exists "admin write" on public.%I', cms_table);
    execute format($p$
      create policy "admin write"
        on public.%I for all
        to authenticated
        using (private.is_admin())
        with check (private.is_admin())
    $p$, cms_table);
  end loop;
end;
$$;

-- ── 문의 접수 ───────────────────────────────────────────────────────────

alter table public.contact_forms enable row level security;

-- 접수는 누구나. 상태나 메모처럼 관리자가 쓰는 값은 기본값으로 들어가야 하므로
-- 방문자가 임의로 채우지 못하게 with check 에서 막는다.
drop policy if exists "anyone can submit inquiry" on public.contact_forms;
create policy "anyone can submit inquiry"
  on public.contact_forms for insert
  to anon, authenticated
  with check (
    status = 'new'
    and memo = ''
    and archived = false
    and agree = true
    and length(name) between 1 and 100
    and length(company) <= 200
    and length(phone) <= 50
    and length(email) <= 200
    and length(item) <= 500
    and length(content) between 1 and 5000
  );

-- 읽기·수정·삭제는 관리자만. 개인정보가 들어 있어 공개 읽기를 열지 않는다.
drop policy if exists "admin reads inquiries" on public.contact_forms;
create policy "admin reads inquiries"
  on public.contact_forms for select
  to authenticated
  using (private.is_admin());

drop policy if exists "admin updates inquiries" on public.contact_forms;
create policy "admin updates inquiries"
  on public.contact_forms for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists "admin deletes inquiries" on public.contact_forms;
create policy "admin deletes inquiries"
  on public.contact_forms for delete
  to authenticated
  using (private.is_admin());
