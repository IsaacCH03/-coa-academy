-- Beta académica: múltiples archivos, expediente, revisiones y notificaciones.
-- Ejecutar después de 20260924000000_phase3b_submissions.sql.

create table if not exists public.academic_submission_settings (
  id boolean primary key default true check (id),
  max_files smallint not null default 5 check (max_files between 1 and 20),
  max_total_size_bytes integer not null default 10485760 check (max_total_size_bytes > 0),
  allowed_file_types text[],
  updated_at timestamptz not null default now()
);
insert into public.academic_submission_settings (id) values (true) on conflict (id) do nothing;

alter table public.activities alter column max_files set default 5;
alter table public.activities drop constraint if exists activities_max_files_check;
alter table public.activities add constraint activities_max_files_check check (max_files between 1 and 20);
alter table public.activities add column if not exists use_global_settings boolean not null default true;
alter table public.activities add column if not exists max_total_size_bytes integer;
alter table public.activities drop constraint if exists activities_max_total_size_bytes_check;
alter table public.activities add constraint activities_max_total_size_bytes_check check (max_total_size_bytes is null or max_total_size_bytes > 0);
update public.activities set max_files = 5, use_global_settings = true where max_files = 1;

create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  stored_filename text not null,
  size_bytes integer not null check (size_bytes > 0),
  mime_type text not null default 'application/octet-stream',
  created_at timestamptz not null default now(),
  file_deleted_at timestamptz
);
create index if not exists submission_files_submission_idx on public.submission_files(submission_id, created_at);

insert into public.submission_files (submission_id, storage_path, original_filename, stored_filename, size_bytes, mime_type, created_at, file_deleted_at)
select id, storage_path, original_filename, coalesce(stored_filename, 'submission'), file_size,
       coalesce(mime_type, 'application/octet-stream'), created_at, file_deleted_at
from public.submissions
where storage_path is not null and original_filename is not null and file_size is not null
on conflict (storage_path) do nothing;

create table if not exists public.student_activity_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  activity_id text not null references public.activities(id) on delete restrict,
  submission_id uuid references public.submissions(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'approved', 'correction', 'convalidated')),
  feedback text,
  convalidation_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, activity_id)
);
create index if not exists student_activity_records_student_idx on public.student_activity_records(student_id, activity_id);

insert into public.student_activity_records (student_id, activity_id, submission_id, status, feedback, convalidation_note, reviewed_at, reviewed_by, created_at, updated_at)
select student_id, activity_id, id,
       case when convalidated then 'convalidated' when status = 'reviewed' then 'approved' else 'under_review' end,
       feedback, convalidation_note, reviewed_at, reviewed_by, created_at, updated_at
from public.submissions
on conflict (student_id, activity_id) do nothing;

create table if not exists public.activity_review_history (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.student_activity_records(id) on delete cascade,
  status text not null check (status in ('under_review', 'approved', 'correction', 'convalidated')),
  feedback text,
  convalidation_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('activity_approved', 'activity_correction', 'activity_convalidated')),
  title text not null check (char_length(trim(title)) between 2 and 160),
  message text not null check (char_length(trim(message)) between 2 and 500),
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

alter table public.academic_submission_settings enable row level security;
alter table public.submission_files enable row level security;
alter table public.student_activity_records enable row level security;
alter table public.activity_review_history enable row level security;
alter table public.notifications enable row level security;

create policy "settings_authenticated_read" on public.academic_submission_settings for select to authenticated using (true);
create policy "settings_admin_manage" on public.academic_submission_settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "submission_files_own_or_admin_read" on public.submission_files for select to authenticated using (
  (select public.is_admin()) or exists (select 1 from public.submissions s where s.id = submission_id and s.student_id = (select auth.uid()))
);
create policy "submission_files_admin_manage" on public.submission_files for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "activity_records_own_or_admin_read" on public.student_activity_records for select to authenticated using (student_id = (select auth.uid()) or (select public.is_admin()));
create policy "activity_records_admin_manage" on public.student_activity_records for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "review_history_admin_read" on public.activity_review_history for select to authenticated using ((select public.is_admin()));
create policy "notifications_own_read" on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy "notifications_own_mark_read" on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

revoke all on public.academic_submission_settings, public.submission_files, public.student_activity_records, public.activity_review_history, public.notifications from anon, authenticated;
grant select on public.academic_submission_settings, public.submission_files, public.student_activity_records, public.notifications to authenticated;
grant select on public.activity_review_history to authenticated;
grant insert, update, delete on public.academic_submission_settings, public.submission_files, public.student_activity_records, public.activity_review_history to authenticated;
grant update (read_at) on public.notifications to authenticated;

create trigger student_activity_records_set_updated_at before update on public.student_activity_records for each row execute procedure public.set_profile_updated_at();

create or replace function public.submit_activity_files(p_activity_id text, p_files jsonb)
returns table (submission_id uuid, submitted_at timestamptz, old_storage_paths text[])
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid(); v_course uuid; v_submission uuid; v_time timestamptz := now();
  v_max_files integer; v_max_bytes integer; v_allowed text[]; v_old text[];
begin
  if v_user is null then raise exception 'authentication required'; end if;
  select a.course_id,
    case when a.use_global_settings then s.max_files else a.max_files end,
    case when a.use_global_settings then s.max_total_size_bytes else coalesce(a.max_total_size_bytes, s.max_total_size_bytes) end,
    case when a.use_global_settings then s.allowed_file_types else a.allowed_file_types end
  into v_course, v_max_files, v_max_bytes, v_allowed
  from public.activities a cross join public.academic_submission_settings s
  where a.id = p_activity_id and a.status = 'active' and s.id = true;
  if v_course is null then raise exception 'activity unavailable'; end if;
  if not exists (select 1 from public.profiles p where p.id = v_user and p.role = 'student') then raise exception 'student required'; end if;
  if not exists (select 1 from public.enrollments e where e.student_id = v_user and e.course_id = v_course and e.status = 'active') then raise exception 'active enrollment required'; end if;
  if jsonb_typeof(p_files) <> 'array' or jsonb_array_length(p_files) < 1 or jsonb_array_length(p_files) > v_max_files then raise exception 'invalid file count'; end if;
  if (select sum((f->>'size_bytes')::bigint) from jsonb_array_elements(p_files) f) > v_max_bytes then raise exception 'total size exceeded'; end if;
  if exists (select 1 from jsonb_array_elements(p_files) f where
      (f->>'storage_path') !~ ('^' || v_user::text || '/' || p_activity_id || '/[0-9a-f-]{36}$')
      or char_length(f->>'original_filename') not between 1 and 255
      or (f->>'size_bytes')::integer < 1
      or (v_allowed is not null and not ((f->>'mime_type') = any(v_allowed)))) then raise exception 'invalid file metadata'; end if;

  select array_agg(sf.storage_path) into v_old from public.submission_files sf
    join public.submissions sub on sub.id = sf.submission_id
    where sub.student_id = v_user and sub.activity_id = p_activity_id and sf.file_deleted_at is null;
  insert into public.submissions (student_id, course_id, activity_id, status, submitted_at, created_at, updated_at)
  values (v_user, v_course, p_activity_id, 'submitted', v_time, v_time, v_time)
  on conflict (student_id, activity_id) do update set status = 'submitted', submitted_at = v_time, updated_at = v_time,
    grade = null, feedback = null, reviewed_at = null, reviewed_by = null, convalidated = false, convalidation_note = null
  returning id into v_submission;
  update public.submission_files set file_deleted_at = v_time where submission_id = v_submission and file_deleted_at is null;
  insert into public.submission_files (submission_id, storage_path, original_filename, stored_filename, size_bytes, mime_type)
  select v_submission, f->>'storage_path', f->>'original_filename', f->>'stored_filename', (f->>'size_bytes')::integer, coalesce(nullif(f->>'mime_type',''),'application/octet-stream')
  from jsonb_array_elements(p_files) f;
  insert into public.student_activity_records (student_id, activity_id, submission_id, status, feedback, convalidation_note, reviewed_at, reviewed_by)
  values (v_user, p_activity_id, v_submission, 'under_review', null, null, null, null)
  on conflict (student_id, activity_id) do update set submission_id = v_submission, status = 'under_review', feedback = null,
    convalidation_note = null, reviewed_at = null, reviewed_by = null, updated_at = v_time;
  insert into public.activity_review_history (record_id, status)
    select id, 'under_review' from public.student_activity_records where student_id = v_user and activity_id = p_activity_id;
  return query select v_submission, v_time, coalesce(v_old, array[]::text[]);
end; $$;
revoke all on function public.submit_activity_files(text, jsonb) from public, anon;
grant execute on function public.submit_activity_files(text, jsonb) to authenticated;

create or replace function public.review_student_activity(p_student_id uuid, p_activity_id text, p_status text, p_feedback text default null, p_convalidation_note text default null)
returns public.student_activity_records
language plpgsql security definer set search_path = '' as $$
declare v_record public.student_activity_records; v_admin uuid := auth.uid(); v_title text; v_course_slug text; v_has_submission boolean;
begin
  if v_admin is null or not public.is_admin() then raise exception 'admin required'; end if;
  if p_status not in ('approved','correction','convalidated') then raise exception 'invalid review status'; end if;
  if p_status = 'correction' and nullif(trim(p_feedback),'') is null then raise exception 'feedback required'; end if;
  select a.title, c.slug into v_title, v_course_slug from public.activities a join public.courses c on c.id = a.course_id where a.id = p_activity_id;
  if v_title is null then raise exception 'activity unavailable'; end if;
  select exists(select 1 from public.submissions s where s.student_id = p_student_id and s.activity_id = p_activity_id) into v_has_submission;
  if p_status in ('approved','correction') and not v_has_submission then raise exception 'native submission required'; end if;
  insert into public.student_activity_records (student_id, activity_id, status, feedback, convalidation_note, reviewed_at, reviewed_by)
  values (p_student_id, p_activity_id, p_status, nullif(trim(p_feedback),''), case when p_status='convalidated' then coalesce(nullif(trim(p_convalidation_note),''),'Entregada anteriormente mediante Google Forms.') end, now(), v_admin)
  on conflict (student_id, activity_id) do update set status=excluded.status, feedback=excluded.feedback, convalidation_note=excluded.convalidation_note, reviewed_at=excluded.reviewed_at, reviewed_by=excluded.reviewed_by, updated_at=now()
  returning * into v_record;
  update public.submissions set status='reviewed', feedback=v_record.feedback, reviewed_at=v_record.reviewed_at, reviewed_by=v_admin,
    convalidated=(p_status='convalidated'), convalidation_note=v_record.convalidation_note, updated_at=now()
    where student_id=p_student_id and activity_id=p_activity_id;
  insert into public.activity_review_history(record_id,status,feedback,convalidation_note,reviewed_by) values(v_record.id,p_status,v_record.feedback,v_record.convalidation_note,v_admin);
  insert into public.notifications(user_id,type,title,message,href) values (
    p_student_id,
    case p_status when 'approved' then 'activity_approved' when 'correction' then 'activity_correction' else 'activity_convalidated' end,
    case p_status when 'approved' then 'Actividad aprobada' when 'correction' then 'Corrección solicitada' else 'Actividad convalidada' end,
    case p_status when 'approved' then 'Tu entrega de '||v_title||' fue aprobada.' when 'correction' then 'Tu entrega de '||v_title||' necesita cambios.' else 'Tu actividad '||v_title||' fue convalidada.' end,
    '/mi-coa/cursos/'||v_course_slug||'#'||p_activity_id
  );
  return v_record;
end; $$;
revoke all on function public.review_student_activity(uuid,text,text,text,text) from public, anon;
grant execute on function public.review_student_activity(uuid,text,text,text,text) to authenticated;

create or replace function public.get_admin_student_email(p_student_id uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare v_email text;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'admin required'; end if;
  select email into v_email from auth.users where id = p_student_id;
  return v_email;
end; $$;
revoke all on function public.get_admin_student_email(uuid) from public, anon;
grant execute on function public.get_admin_student_email(uuid) to authenticated;

drop policy if exists "academic_files_student_insert" on storage.objects;
drop policy if exists "academic_files_student_update" on storage.objects;
drop policy if exists "academic_files_own_or_admin_read" on storage.objects;
drop policy if exists "academic_files_own_delete" on storage.objects;
create policy "academic_files_student_insert_v2" on storage.objects for insert to authenticated with check (
  bucket_id='academic-submissions' and (storage.foldername(name))[1]=(select auth.uid())::text
  and array_length(storage.foldername(name),1)=3
  and exists (select 1 from public.activities a join public.enrollments e on e.course_id=a.course_id
    where a.id=(storage.foldername(name))[2] and a.status='active' and e.student_id=(select auth.uid()) and e.status='active')
);
create policy "academic_files_own_or_admin_read_v2" on storage.objects for select to authenticated using (
  bucket_id='academic-submissions' and ((storage.foldername(name))[1]=(select auth.uid())::text or (select public.is_admin()))
);
create policy "academic_files_own_or_admin_delete_v2" on storage.objects for delete to authenticated using (
  bucket_id='academic-submissions' and ((storage.foldername(name))[1]=(select auth.uid())::text or (select public.is_admin()))
);

-- Repara los títulos sembrados con bytes UTF-8 interpretados como Windows-1252.
update public.activities set title = convert_from(convert_to(title, 'WIN1252'), 'UTF8') where title ~ '[Ãâ]';
update public.activities set title = convert_from(convert_to(title, 'WIN1252'), 'UTF8') where title ~ '[Ãâ]';
update public.courses set title = convert_from(convert_to(title, 'WIN1252'), 'UTF8'), description = convert_from(convert_to(description, 'WIN1252'), 'UTF8') where title ~ '[Ãâ]' or description ~ '[Ãâ]';
update public.courses set title = convert_from(convert_to(title, 'WIN1252'), 'UTF8'), description = convert_from(convert_to(description, 'WIN1252'), 'UTF8') where title ~ '[Ãâ]' or description ~ '[Ãâ]';
