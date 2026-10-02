-- Grupos públicos independientes: el curso sigue siendo obligatorio para grupos privados,
-- pero membresía, actividades y entregas de un grupo público pueden funcionar sin curso base.

alter table public.live_groups alter column course_id drop not null;
alter table public.activities alter column course_id drop not null;
alter table public.submissions alter column course_id drop not null;

alter table public.live_groups
  add constraint live_groups_private_course_required
  check (access_type = 'public' or course_id is not null);

drop policy if exists live_group_members_admin_manage on public.live_group_members;
create policy live_group_members_admin_manage
  on public.live_group_members for all to authenticated
  using ((select public.is_admin()))
  with check (
    (select public.is_admin())
    and exists (
      select 1
      from public.live_groups g
      where g.id = group_id
        and (
          (g.access_type = 'public' and g.course_id is null)
          or exists (
            select 1 from public.enrollments e
            where e.course_id = g.course_id and e.student_id = student_id and e.status = 'active'
          )
        )
    )
  );

create or replace function public.join_public_live_group(p_group uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_course uuid;
  v_slug text;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not exists (select 1 from public.profiles p where p.id = v_user and p.role = 'student') then
    raise exception 'student account required';
  end if;

  select g.course_id, g.slug into v_course, v_slug
  from public.live_groups g
  where g.id = p_group and g.access_type = 'public' and g.status = 'active'
  for update;

  if v_slug is null then raise exception 'public group unavailable'; end if;

  if v_course is not null then
    insert into public.enrollments(student_id, course_id, status)
    values(v_user, v_course, 'active')
    on conflict(student_id, course_id) do update set status = 'active';
  end if;

  insert into public.live_group_members(group_id, student_id)
  values(p_group, v_user)
  on conflict(group_id, student_id) do nothing;

  return v_slug;
end;
$$;
revoke all on function public.join_public_live_group(uuid) from public, anon;
grant execute on function public.join_public_live_group(uuid) to authenticated;

create or replace function public.create_live_group_assignment(p_section uuid,p_title text,p_content text,p_due_at timestamptz,p_max_files smallint,p_max_file_size_bytes integer)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_group uuid;v_course uuid;v_item uuid:=gen_random_uuid();v_activity text;v_order integer;v_activity_order integer;
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'admin required'; end if;
 if p_due_at is null or p_max_files not between 1 and 20 or p_max_file_size_bytes not between 1 and 52428800 then raise exception 'invalid assignment settings'; end if;
 select s.group_id,g.course_id into v_group,v_course from public.live_group_sections s join public.live_groups g on g.id=s.group_id where s.id=p_section;
 if v_group is null then raise exception 'section unavailable'; end if;
 select coalesce(max(display_order),0)+1 into v_order from public.live_group_items where section_id=p_section;
 select coalesce(max(display_order),0)+1 into v_activity_order from public.activities where course_id is not distinct from v_course and module_number=1;
 v_activity:='live-'||replace(v_item::text,'-','');
 insert into public.activities(id,course_id,module_number,title,activity_type,required,display_order,status,original_max_points,normalized_max_points,max_files,max_file_size_bytes,use_global_settings,max_total_size_bytes,live_group_id,due_at)
 values(v_activity,v_course,1,trim(p_title),'assignment',true,v_activity_order,'active',100,100,p_max_files,p_max_file_size_bytes,false,p_max_files*p_max_file_size_bytes,v_group,p_due_at);
 insert into public.live_group_items(id,section_id,item_type,title,content,activity_id,due_at,max_files,max_file_size_bytes,display_order)
 values(v_item,p_section,'assignment',trim(p_title),nullif(trim(p_content),''),v_activity,p_due_at,p_max_files,p_max_file_size_bytes,v_order);
 return v_item;
end $$;
revoke all on function public.create_live_group_assignment(uuid,text,text,timestamptz,smallint,integer) from public,anon;
grant execute on function public.create_live_group_assignment(uuid,text,text,timestamptz,smallint,integer) to authenticated;

drop policy if exists activities_enrolled_or_admin_read on public.activities;
create policy activities_enrolled_or_admin_read on public.activities for select to authenticated using (
  (select public.is_admin())
  or (live_group_id is not null and (select public.is_live_group_member(live_group_id)))
  or (live_group_id is null and exists(select 1 from public.enrollments e where e.course_id=activities.course_id and e.student_id=(select auth.uid()) and e.status='active'))
);
drop policy if exists rubrics_enrolled_or_admin_read on public.rubrics;
create policy rubrics_enrolled_or_admin_read on public.rubrics for select to authenticated using (
  (select public.is_admin()) or exists(select 1 from public.activities a where a.id=rubrics.activity_id and ((a.live_group_id is not null and (select public.is_live_group_member(a.live_group_id))) or (a.live_group_id is null and exists(select 1 from public.enrollments e where e.course_id=a.course_id and e.student_id=(select auth.uid()) and e.status='active'))))
);
drop policy if exists criteria_enrolled_or_admin_read on public.rubric_criteria;
create policy criteria_enrolled_or_admin_read on public.rubric_criteria for select to authenticated using (
  (select public.is_admin()) or exists(select 1 from public.rubrics r join public.activities a on a.id=r.activity_id where r.id=rubric_criteria.rubric_id and ((a.live_group_id is not null and (select public.is_live_group_member(a.live_group_id))) or (a.live_group_id is null and exists(select 1 from public.enrollments e where e.course_id=a.course_id and e.student_id=(select auth.uid()) and e.status='active'))))
);

create or replace function public.prepare_activity_upload(p_activity_id text,p_files jsonb)
returns table(batch_id uuid,files jsonb) language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid();v_course uuid;v_group uuid;v_due timestamptz;v_batch uuid:=gen_random_uuid();v_max_files integer;v_max_total integer;v_max_each integer;v_allowed text[];v_files jsonb;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 select a.course_id,a.live_group_id,a.due_at,case when a.use_global_settings then s.max_files else a.max_files end,case when a.use_global_settings then s.max_total_size_bytes else coalesce(a.max_total_size_bytes,s.max_total_size_bytes) end,a.max_file_size_bytes,case when a.use_global_settings then s.allowed_file_types else a.allowed_file_types end
 into v_course,v_group,v_due,v_max_files,v_max_total,v_max_each,v_allowed from public.activities a cross join public.academic_submission_settings s where a.id=p_activity_id and a.status='active' and s.id=true;
 if v_group is null and v_course is null then raise exception 'activity unavailable'; end if;
 if v_due is not null and now()>v_due then raise exception 'deadline passed'; end if;
 if v_group is not null then
   if not public.is_live_group_member(v_group) then raise exception 'live group membership required'; end if;
 elsif not exists(select 1 from public.enrollments e where e.student_id=v_user and e.course_id=v_course and e.status='active') then raise exception 'active enrollment required'; end if;
 if jsonb_typeof(p_files)<>'array' or jsonb_array_length(p_files)<1 or jsonb_array_length(p_files)>v_max_files then raise exception 'invalid file count'; end if;
 if exists(select 1 from jsonb_array_elements(p_files) f where char_length(f->>'original_filename') not between 1 and 255 or (f->>'size_bytes')::integer<1 or (f->>'size_bytes')::integer>v_max_each or lower(f->>'original_filename')!~'\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|csv|py|java|json|md|png|jpe?g|gif|webp|zip)$' or lower(coalesce(f->>'mime_type',''))~'(x-msdownload|x-msdos-program|x-executable|x-sh|x-bat|portable-executable)' or (v_allowed is not null and not(coalesce(nullif(f->>'mime_type',''),'application/octet-stream')=any(v_allowed)))) then raise exception 'invalid file metadata'; end if;
 if (select sum((f->>'size_bytes')::bigint) from jsonb_array_elements(p_files) f)>v_max_total then raise exception 'total size exceeded'; end if;
 delete from public.submission_upload_intents i where i.user_id=v_user and i.expires_at<=now();
 if exists(select 1 from public.submission_upload_intents i where i.user_id=v_user and i.activity_id=p_activity_id and i.expires_at>now()) then raise exception 'upload already prepared'; end if;
 insert into public.submission_upload_intents(batch_id,user_id,activity_id,storage_path,original_filename,stored_filename,size_bytes,mime_type,position,expires_at)
 select v_batch,v_user,p_activity_id,v_user::text||'/'||p_activity_id||'/'||x.file_id::text,x.item->>'original_filename',x.file_id::text,(x.item->>'size_bytes')::integer,coalesce(nullif(x.item->>'mime_type',''),'application/octet-stream'),x.position,now()+interval '10 minutes'
 from(select f.item,f.position::smallint,gen_random_uuid() file_id from jsonb_array_elements(p_files) with ordinality f(item,position))x;
 select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'original_filename',i.original_filename,'stored_filename',i.stored_filename,'size_bytes',i.size_bytes,'mime_type',i.mime_type) order by i.position) into v_files from public.submission_upload_intents i where i.batch_id=v_batch;
 return query select v_batch,v_files;
end $$;
revoke all on function public.prepare_activity_upload(text,jsonb) from public,anon;
grant execute on function public.prepare_activity_upload(text,jsonb) to authenticated;

create or replace function public.submit_activity_files(p_activity_id text,p_files jsonb)
returns table(submission_id uuid,submitted_at timestamptz,old_storage_paths text[]) language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid();v_course uuid;v_group uuid;v_due timestamptz;v_submission uuid;v_time timestamptz:=now();v_max_files integer;v_max_total integer;v_max_each integer;v_old text[];
begin
 select a.course_id,a.live_group_id,a.due_at,case when a.use_global_settings then s.max_files else a.max_files end,case when a.use_global_settings then s.max_total_size_bytes else coalesce(a.max_total_size_bytes,s.max_total_size_bytes) end,a.max_file_size_bytes into v_course,v_group,v_due,v_max_files,v_max_total,v_max_each from public.activities a cross join public.academic_submission_settings s where a.id=p_activity_id and a.status='active' and s.id=true;
 if v_user is null or (v_group is null and v_course is null) then raise exception 'activity unavailable'; end if;
 if v_due is not null and now()>v_due then raise exception 'deadline passed'; end if;
 if v_group is not null then
   if not public.is_live_group_member(v_group) then raise exception 'live group membership required'; end if;
 elsif not exists(select 1 from public.enrollments e where e.student_id=v_user and e.course_id=v_course and e.status='active') then raise exception 'active enrollment required'; end if;
 if jsonb_typeof(p_files)<>'array' or jsonb_array_length(p_files)<1 or jsonb_array_length(p_files)>v_max_files or exists(select 1 from jsonb_array_elements(p_files)f where (f->>'size_bytes')::integer>v_max_each) or (select sum((f->>'size_bytes')::bigint) from jsonb_array_elements(p_files)f)>v_max_total then raise exception 'invalid files'; end if;
 select array_agg(sf.storage_path) into v_old from public.submission_files sf join public.submissions sub on sub.id=sf.submission_id where sub.student_id=v_user and sub.activity_id=p_activity_id and sf.file_deleted_at is null;
 insert into public.submissions(student_id,course_id,activity_id,status,submitted_at,created_at,updated_at) values(v_user,v_course,p_activity_id,'submitted',v_time,v_time,v_time) on conflict(student_id,activity_id) do update set course_id=excluded.course_id,status='submitted',submitted_at=v_time,updated_at=v_time,grade=null,feedback=null,reviewed_at=null,reviewed_by=null,convalidated=false,convalidation_note=null returning id into v_submission;
 update public.submission_files sf set file_deleted_at=v_time where sf.submission_id=v_submission and sf.file_deleted_at is null;
 insert into public.submission_files(submission_id,storage_path,original_filename,stored_filename,size_bytes,mime_type) select v_submission,f->>'storage_path',f->>'original_filename',f->>'stored_filename',(f->>'size_bytes')::integer,coalesce(nullif(f->>'mime_type',''),'application/octet-stream') from jsonb_array_elements(p_files)f;
 insert into public.student_activity_records(student_id,activity_id,submission_id,status) values(v_user,p_activity_id,v_submission,'under_review') on conflict(student_id,activity_id) do update set submission_id=v_submission,status='under_review',feedback=null,reviewed_at=null,reviewed_by=null,updated_at=v_time;
 insert into public.activity_review_history(record_id,status) select sar.id,'under_review' from public.student_activity_records sar where sar.student_id=v_user and sar.activity_id=p_activity_id;
 return query select v_submission,v_time,coalesce(v_old,array[]::text[]);
end $$;
revoke all on function public.submit_activity_files(text,jsonb) from public,anon,authenticated;

create or replace function public.review_student_activity(p_student_id uuid,p_activity_id text,p_status text,p_feedback text default null,p_convalidation_note text default null)
returns public.student_activity_records language plpgsql security definer set search_path='' as $$
declare v_record public.student_activity_records;v_admin uuid:=auth.uid();v_title text;v_course_slug text;v_group_slug text;v_has_submission boolean;v_href text;
begin
 if v_admin is null or not public.is_admin() then raise exception 'admin required'; end if;
 if p_status not in('approved','correction','convalidated') then raise exception 'invalid review status'; end if;
 if p_status='correction' and nullif(trim(p_feedback),'') is null then raise exception 'feedback required'; end if;
 select a.title,c.slug,g.slug into v_title,v_course_slug,v_group_slug from public.activities a left join public.courses c on c.id=a.course_id left join public.live_groups g on g.id=a.live_group_id where a.id=p_activity_id;
 if v_title is null then raise exception 'activity unavailable'; end if;
 select exists(select 1 from public.submissions s where s.student_id=p_student_id and s.activity_id=p_activity_id) into v_has_submission;
 if p_status in('approved','correction') and not v_has_submission then raise exception 'native submission required'; end if;
 insert into public.student_activity_records(student_id,activity_id,status,feedback,convalidation_note,reviewed_at,reviewed_by) values(p_student_id,p_activity_id,p_status,nullif(trim(p_feedback),''),case when p_status='convalidated' then coalesce(nullif(trim(p_convalidation_note),''),'Entregada anteriormente mediante Google Forms.') end,now(),v_admin)
 on conflict(student_id,activity_id) do update set status=excluded.status,feedback=excluded.feedback,convalidation_note=excluded.convalidation_note,reviewed_at=excluded.reviewed_at,reviewed_by=excluded.reviewed_by,updated_at=now() returning * into v_record;
 update public.submissions set status='reviewed',feedback=v_record.feedback,reviewed_at=v_record.reviewed_at,reviewed_by=v_admin,convalidated=(p_status='convalidated'),convalidation_note=v_record.convalidation_note,updated_at=now() where student_id=p_student_id and activity_id=p_activity_id;
 insert into public.activity_review_history(record_id,status,feedback,convalidation_note,reviewed_by) values(v_record.id,p_status,v_record.feedback,v_record.convalidation_note,v_admin);
 v_href:=case when v_group_slug is not null then '/mi-coa/grupos/'||v_group_slug||'?tab=calificaciones' else '/mi-coa/cursos/'||v_course_slug||'#'||p_activity_id end;
 insert into public.notifications(user_id,type,title,message,href) values(p_student_id,case p_status when 'approved' then 'activity_approved' when 'correction' then 'activity_correction' else 'activity_convalidated' end,case p_status when 'approved' then 'Actividad aprobada' when 'correction' then 'Corrección solicitada' else 'Actividad convalidada' end,case p_status when 'approved' then 'Tu entrega de '||v_title||' fue aprobada.' when 'correction' then 'Tu entrega de '||v_title||' necesita cambios.' else 'Tu actividad '||v_title||' fue convalidada.' end,v_href);
 return v_record;
end $$;
revoke all on function public.review_student_activity(uuid,text,text,text,text) from public,anon;
grant execute on function public.review_student_activity(uuid,text,text,text,text) to authenticated;
