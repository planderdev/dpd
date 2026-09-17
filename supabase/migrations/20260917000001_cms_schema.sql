-- DPD CMS 스키마
--
-- 지금 assets/js/cms-store.js 가 들고 있는 컬렉션 14개를 테이블로 옮긴다.
-- 설계 기준
--   * id 는 text 다. 현재 데이터의 id("handled-han-drive" 등)가 프론트 DOM id 로도
--     쓰이고 있어 그대로 유지한다. 새 항목은 관리자에서 같은 규칙으로 만든다.
--   * 관리자에 항목 순서 이동 기능이 있어 sort_order 로 순서를 명시한다.
--     배열 순서에 기대던 것을 컬럼으로 드러낸 것이다.
--   * 영문 번역은 en jsonb 한 칸에 모은다. 관리자 영문 탭이 이미 이 구조로
--     저장하므로 데이터가 1:1로 옮겨간다. 비어 있으면 국문이 그대로 노출된다.
--   * 컬럼은 snake_case, 프론트 코드는 camelCase 를 쓴다. 변환은 어댑터가 맡아
--     관리자 입력 필드와 프론트 출력 키는 지금과 똑같이 유지된다.

create extension if not exists "pgcrypto";

-- ── 공통 ────────────────────────────────────────────────────────────────

-- 수정 시각을 자동으로 채운다.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 관리자 계정 목록. auth.users 에 만들어진 사용자 중 여기 등록된 사람만
-- 콘텐츠를 쓸 수 있다. 비밀번호는 Supabase Auth 가 관리하며 이 테이블에 없다.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- RLS 정책에서 쓰는 판별 함수.
-- admins 테이블 자체도 RLS 를 걸기 때문에 security definer 로 우회해 조회한다.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- 콘텐츠 테이블이 공통으로 갖는 컬럼을 붙인다.
create or replace function public.add_cms_columns(table_name text)
returns void
language plpgsql
as $$
begin
  execute format($f$
    alter table public.%I
      add column if not exists enabled boolean not null default true,
      add column if not exists sort_order integer not null default 0,
      add column if not exists en jsonb not null default '{}'::jsonb,
      add column if not exists created_at timestamptz not null default now(),
      add column if not exists updated_at timestamptz not null default now();
  $f$, table_name);

  execute format('drop trigger if exists %I on public.%I', table_name || '_touch', table_name);
  execute format(
    'create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',
    table_name || '_touch', table_name
  );

  execute format(
    'create index if not exists %I on public.%I (sort_order)',
    table_name || '_sort_order_idx', table_name
  );
end;
$$;

-- ── 메인 화면 ───────────────────────────────────────────────────────────

create table if not exists public.main_hero (
  id text primary key,
  eyebrow text not null default '',
  title text not null default '',
  media_type text not null default 'video' check (media_type in ('video', 'image')),
  media text not null default '',
  alt text not null default ''
);
select public.add_cms_columns('main_hero');

-- ── 개발품목 ────────────────────────────────────────────────────────────
-- 목록 카드와 상세페이지를 한 행에서 같이 관리한다. 지금 관리자 구성과 같다.

create table if not exists public.development_items (
  id text primary key,
  eyebrow text not null default '',
  title text not null default '',
  image text not null default '',
  alt text not null default '',
  href text not null default '',
  external boolean not null default false,
  visual_image text not null default '',
  detail_eyebrow text not null default '',
  detail_title text not null default '',
  lead text not null default '',
  summary text not null default '',
  gallery text[] not null default '{}',
  overview_title text not null default '',
  overview_description text not null default '',
  bullets text[] not null default '{}',
  spec_eyebrow text not null default '',
  spec_title text not null default '',
  -- [{ "label": "적용 공정", "value": "2차전지, 반도체 ..." }]
  specs jsonb not null default '[]'::jsonb,
  feature_eyebrow text not null default '',
  feature_title text not null default '',
  -- [{ "title": "고성능 세정", "text": "초음파와 흡입 구조를 ..." }]
  features jsonb not null default '[]'::jsonb
);
select public.add_cms_columns('development_items');

-- ── 공급품목 ────────────────────────────────────────────────────────────
-- country 는 프론트 국가 필터 값, eyebrow 는 "MADE IN CHINA" 표기용 라벨이다.
-- 둘이 어긋나지 않도록 관리자에서 한 선택값으로 함께 채운다.

create table if not exists public.handled_items (
  id text primary key,
  title text not null default '',
  eyebrow text not null default '',
  country text not null default '',
  category text not null default '',
  description text not null default '',
  image text not null default '',
  gallery text[] not null default '{}',
  href text not null default '',
  external boolean not null default false
);
select public.add_cms_columns('handled_items');
create index if not exists handled_items_country_idx on public.handled_items (country);

-- ── 고객사 ──────────────────────────────────────────────────────────────

create table if not exists public.customers (
  id text primary key,
  name text not null default '',
  -- 메인 마퀴에서 위/아래 줄 중 어디에 넣을지
  row_position text not null default 'top' check (row_position in ('top', 'bottom')),
  image text not null default '',
  alt text not null default ''
);
select public.add_cms_columns('customers');

-- ── 자료실 ──────────────────────────────────────────────────────────────
-- file_type 은 첨부 파일명에서 자동 추출한 확장자 배지다. 현재 규칙을 유지한다.

create table if not exists public.resources (
  id text primary key,
  category text not null default 'drawing' check (category in ('drawing', 'catalog')),
  file_type text not null default '',
  title text not null default '',
  summary text not null default '',
  file_url text not null default '',
  file_name text not null default ''
);
select public.add_cms_columns('resources');
create index if not exists resources_category_idx on public.resources (category);

-- ── 공지사항 ────────────────────────────────────────────────────────────

create table if not exists public.notices (
  id text primary key,
  published_on text not null default '',
  title text not null default '',
  summary text not null default '',
  href text not null default '',
  content text not null default ''
);
select public.add_cms_columns('notices');

-- ── 회사소개 ────────────────────────────────────────────────────────────

create table if not exists public.company_profile (
  id text primary key,
  label text not null default '',
  value text not null default '',
  note text not null default ''
);
select public.add_cms_columns('company_profile');

create table if not exists public.company_history (
  id text primary key,
  year text not null default '',
  month text not null default '',
  text text not null default ''
);
select public.add_cms_columns('company_history');
create index if not exists company_history_year_idx on public.company_history (year desc, month desc);

create table if not exists public.certificates (
  id text primary key,
  title text not null default '',
  image text not null default '',
  alt text not null default ''
);
select public.add_cms_columns('certificates');

-- ── 기술지원 ────────────────────────────────────────────────────────────

create table if not exists public.support_steps (
  id text primary key,
  step text not null default '',
  title text not null default '',
  description text not null default '',
  image text not null default '',
  alt text not null default ''
);
select public.add_cms_columns('support_steps');

create table if not exists public.network_partner (
  id text primary key,
  label text not null default '',
  value text not null default ''
);
select public.add_cms_columns('network_partner');

-- 화면의 번호(01, 02 ...)는 sort_order 로 매기므로 컬럼으로 두지 않는다.
create table if not exists public.network_coverage (
  id text primary key,
  region text not null default '',
  description text not null default ''
);
select public.add_cms_columns('network_coverage');

create table if not exists public.network_response (
  id text primary key,
  title text not null default '',
  description text not null default ''
);
select public.add_cms_columns('network_response');

-- ── 문의 접수 ───────────────────────────────────────────────────────────
-- 유일하게 방문자가 직접 행을 만드는 테이블이다. 개인정보가 들어가므로
-- 읽기는 관리자만 가능하도록 RLS 를 따로 잡는다.

create table if not exists public.contact_forms (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'checking', 'done', 'hold')),
  source text not null default 'contact' check (source in ('main', 'contact', 'manual')),
  received_at timestamptz not null default now(),
  name text not null default '',
  company text not null default '',
  phone text not null default '',
  email text not null default '',
  item text not null default '',
  content text not null default '',
  file_name text not null default '',
  file_path text not null default '',
  agree boolean not null default false,
  memo text not null default '',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists contact_forms_touch on public.contact_forms;
create trigger contact_forms_touch
  before update on public.contact_forms
  for each row execute function public.touch_updated_at();

create index if not exists contact_forms_received_at_idx on public.contact_forms (received_at desc);
create index if not exists contact_forms_status_idx on public.contact_forms (status);
