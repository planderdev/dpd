-- DPD CMS 파일 저장소
--
-- 지금 관리자의 파일 첨부는 UI 만 있고 실제 업로드가 없다. 두 버킷으로 나눈다.
--   cms-media     : 화면에 바로 보이는 이미지·비디오 (히어로, 품목, 로고, 인증서)
--   cms-downloads : 자료실에서 내려받는 도면·카탈로그 파일
--
-- 둘 다 공개 읽기다. 사이트 방문자가 로그인 없이 봐야 하기 때문이고,
-- 지금 assets/ 에 평문으로 올라가 있는 것과 같은 수준이다.
-- 업로드·교체·삭제는 관리자만 가능하다.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  20971520, -- 20MB. 히어로 비디오가 가장 크다.
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-downloads',
  'cms-downloads',
  true,
  52428800, -- 50MB. 카탈로그 PDF 와 도면 zip 기준.
  array['application/pdf', 'application/zip', 'application/x-zip-compressed',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 읽기: 누구나.
drop policy if exists "public reads cms files" on storage.objects;
create policy "public reads cms files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('cms-media', 'cms-downloads'));

-- 업로드·교체·삭제: 관리자만.
drop policy if exists "admin uploads cms files" on storage.objects;
create policy "admin uploads cms files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('cms-media', 'cms-downloads') and public.is_admin());

drop policy if exists "admin updates cms files" on storage.objects;
create policy "admin updates cms files"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('cms-media', 'cms-downloads') and public.is_admin())
  with check (bucket_id in ('cms-media', 'cms-downloads') and public.is_admin());

drop policy if exists "admin deletes cms files" on storage.objects;
create policy "admin deletes cms files"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('cms-media', 'cms-downloads') and public.is_admin());
