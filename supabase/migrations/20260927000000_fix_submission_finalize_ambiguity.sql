-- Corrige una referencia ambigua al finalizar entregas sin modificar el hardening aplicado.

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
  update public.submission_files as sf set file_deleted_at = v_time where sf.submission_id = v_submission and sf.file_deleted_at is null;
  insert into public.submission_files (submission_id, storage_path, original_filename, stored_filename, size_bytes, mime_type)
  select v_submission, f->>'storage_path', f->>'original_filename', f->>'stored_filename', (f->>'size_bytes')::integer, coalesce(nullif(f->>'mime_type',''),'application/octet-stream')
  from jsonb_array_elements(p_files) f;
  insert into public.student_activity_records (student_id, activity_id, submission_id, status, feedback, convalidation_note, reviewed_at, reviewed_by)
  values (v_user, p_activity_id, v_submission, 'under_review', null, null, null, null)
  on conflict (student_id, activity_id) do update set submission_id = v_submission, status = 'under_review', feedback = null,
    convalidation_note = null, reviewed_at = null, reviewed_by = null, updated_at = v_time;
  insert into public.activity_review_history (record_id, status)
    select sar.id, 'under_review' from public.student_activity_records as sar where sar.student_id = v_user and sar.activity_id = p_activity_id;
  return query select v_submission, v_time, coalesce(v_old, array[]::text[]);
end; $$;

revoke all on function public.submit_activity_files(text, jsonb) from public, anon, authenticated;
