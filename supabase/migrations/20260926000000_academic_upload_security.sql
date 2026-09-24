-- Hardening incremental de entregas académicas. No modifica migraciones aplicadas.

revoke execute on function public.upsert_submission_metadata(text, text, text, text, integer, text) from authenticated;
revoke execute on function public.submit_activity_files(text, jsonb) from authenticated;

create table public.submission_upload_intents (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_id text not null references public.activities(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  stored_filename text not null,
  size_bytes integer not null check (size_bytes > 0),
  mime_type text not null,
  position smallint not null check (position between 1 and 20),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (batch_id, storage_path)
);
create index submission_upload_intents_lookup_idx on public.submission_upload_intents(user_id, activity_id, expires_at);
alter table public.submission_upload_intents enable row level security;
revoke all on public.submission_upload_intents from anon, authenticated;

create or replace function public.prepare_activity_upload(p_activity_id text, p_files jsonb)
returns table (batch_id uuid, files jsonb)
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid(); v_course uuid; v_batch uuid := gen_random_uuid();
  v_max_files integer; v_max_bytes integer; v_allowed text[]; v_files jsonb;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if p_activity_id !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'invalid activity'; end if;
  select a.course_id,
    case when a.use_global_settings then s.max_files else a.max_files end,
    case when a.use_global_settings then s.max_total_size_bytes else coalesce(a.max_total_size_bytes, s.max_total_size_bytes) end,
    case when a.use_global_settings then s.allowed_file_types else a.allowed_file_types end
  into v_course, v_max_files, v_max_bytes, v_allowed
  from public.activities a cross join public.academic_submission_settings s
  where a.id=p_activity_id and a.status='active' and s.id=true;
  if v_course is null then raise exception 'activity unavailable'; end if;
  if not exists (select 1 from public.profiles p where p.id=v_user and p.role='student') then raise exception 'student required'; end if;
  if not exists (select 1 from public.enrollments e where e.student_id=v_user and e.course_id=v_course and e.status='active') then raise exception 'active enrollment required'; end if;
  if jsonb_typeof(p_files)<>'array' or jsonb_array_length(p_files)<1 or jsonb_array_length(p_files)>v_max_files then raise exception 'invalid file count'; end if;
  if exists (select 1 from jsonb_array_elements(p_files) f where
      char_length(f->>'original_filename') not between 1 and 255 or (f->>'size_bytes')::integer<1
      or (v_allowed is not null and not (coalesce(nullif(f->>'mime_type',''),'application/octet-stream')=any(v_allowed)))) then raise exception 'invalid file metadata'; end if;
  if (select sum((f->>'size_bytes')::bigint) from jsonb_array_elements(p_files) f)>v_max_bytes then raise exception 'total size exceeded'; end if;

  delete from public.submission_upload_intents i where i.user_id=v_user and i.expires_at<=now();
  if exists (select 1 from public.submission_upload_intents i where i.user_id=v_user and i.activity_id=p_activity_id and i.expires_at>now()) then raise exception 'upload already prepared'; end if;
  if exists (
    select 1 from storage.objects o where o.bucket_id='academic-submissions'
      and o.name like (v_user::text||'/'||p_activity_id||'/%')
      and not exists (select 1 from public.submission_files sf join public.submissions sub on sub.id=sf.submission_id
        where sf.storage_path=o.name and sf.file_deleted_at is null and sub.student_id=v_user and sub.activity_id=p_activity_id)
  ) then raise exception 'unresolved upload objects'; end if;

  insert into public.submission_upload_intents(batch_id,user_id,activity_id,storage_path,original_filename,stored_filename,size_bytes,mime_type,position,expires_at)
  select v_batch,v_user,p_activity_id,v_user::text||'/'||p_activity_id||'/'||x.file_id::text,
    x.item->>'original_filename',x.file_id::text,(x.item->>'size_bytes')::integer,
    coalesce(nullif(x.item->>'mime_type',''),'application/octet-stream'),x.position,now()+interval '10 minutes'
  from (select f.item,f.position::smallint,gen_random_uuid() file_id from jsonb_array_elements(p_files) with ordinality f(item,position)) x;
  select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'original_filename',i.original_filename,'stored_filename',i.stored_filename,'size_bytes',i.size_bytes,'mime_type',i.mime_type) order by i.position)
    into v_files from public.submission_upload_intents i where i.batch_id=v_batch;
  return query select v_batch,v_files;
end; $$;
revoke all on function public.prepare_activity_upload(text,jsonb) from public, anon;
grant execute on function public.prepare_activity_upload(text,jsonb) to authenticated;

create or replace function public.finalize_activity_upload(p_activity_id text,p_batch_id uuid)
returns table (submission_id uuid, submitted_at timestamptz, old_storage_paths text[])
language plpgsql security definer set search_path = '' as $$
declare v_user uuid:=auth.uid(); v_files jsonb; v_result record;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not exists (select 1 from public.submission_upload_intents i where i.batch_id=p_batch_id and i.user_id=v_user and i.activity_id=p_activity_id and i.expires_at>now()) then raise exception 'invalid upload batch'; end if;
  if exists (
    select 1 from public.submission_upload_intents i left join storage.objects o
      on o.bucket_id='academic-submissions' and o.name=i.storage_path
    where i.batch_id=p_batch_id and (o.id is null or coalesce((o.metadata->>'size')::bigint,-1)<>i.size_bytes)
  ) then raise exception 'uploaded object verification failed'; end if;
  select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'original_filename',i.original_filename,'stored_filename',i.stored_filename,'size_bytes',i.size_bytes,'mime_type',i.mime_type))
    into v_files from public.submission_upload_intents i where i.batch_id=p_batch_id;
  select * into v_result from public.submit_activity_files(p_activity_id,v_files);
  delete from public.submission_upload_intents i where i.batch_id=p_batch_id;
  return query select v_result.submission_id,v_result.submitted_at,v_result.old_storage_paths;
end; $$;
revoke all on function public.finalize_activity_upload(text,uuid) from public, anon;
grant execute on function public.finalize_activity_upload(text,uuid) to authenticated;

create or replace function public.cancel_activity_upload(p_batch_id uuid) returns text[]
language plpgsql security definer set search_path = '' as $$
declare v_user uuid:=auth.uid(); v_paths text[];
begin
  if v_user is null then raise exception 'authentication required'; end if;
  select array_agg(i.storage_path) into v_paths from public.submission_upload_intents i where i.batch_id=p_batch_id and i.user_id=v_user;
  delete from public.submission_upload_intents i where i.batch_id=p_batch_id and i.user_id=v_user;
  return coalesce(v_paths,array[]::text[]);
end; $$;
revoke all on function public.cancel_activity_upload(uuid) from public, anon;
grant execute on function public.cancel_activity_upload(uuid) to authenticated;

create or replace function public.can_upload_submission_object(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.submission_upload_intents i
    where i.storage_path=p_name and i.user_id=(select auth.uid()) and i.expires_at>now());
$$;
revoke all on function public.can_upload_submission_object(text) from public, anon;
grant execute on function public.can_upload_submission_object(text) to authenticated;

create or replace function public.can_delete_submission_object(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.submission_upload_intents i where i.storage_path=p_name and i.user_id=(select auth.uid())
  ) or exists (
    select 1 from public.submission_files sf join public.submissions sub on sub.id=sf.submission_id
    where sf.storage_path=p_name and sf.file_deleted_at is not null and sub.student_id=(select auth.uid())
  );
$$;
revoke all on function public.can_delete_submission_object(text) from public, anon;
grant execute on function public.can_delete_submission_object(text) to authenticated;

drop policy if exists "academic_files_student_insert_v2" on storage.objects;
drop policy if exists "academic_files_own_or_admin_delete_v2" on storage.objects;
create policy "academic_files_intent_insert" on storage.objects for insert to authenticated with check (
  bucket_id='academic-submissions' and (select public.can_upload_submission_object(name))
);
create policy "academic_files_replaced_or_admin_delete" on storage.objects for delete to authenticated using (
  bucket_id='academic-submissions' and (select public.can_delete_submission_object(name))
);
