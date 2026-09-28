-- Grupos en vivo sobre cursos, matrículas y entregas existentes.
alter table public.courses add column delivery_mode text not null default 'self_paced' check(delivery_mode in ('self_paced','live_group'));
update public.courses set delivery_mode='live_group' where slug in ('python-nivel-1','python-nivel-2');
create table public.live_groups (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) between 2 and 120),
  image_path text,
  starts_on date,
  status text not null default 'preparation' check (status in ('preparation','active','finished')),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.live_group_members (
  group_id uuid not null references public.live_groups(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  joined_at timestamptz not null default now(),
  primary key (group_id, student_id)
);
create table public.live_group_sections (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.live_groups(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160), display_order integer not null check (display_order > 0),
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(group_id,display_order)
);
create table public.live_group_items (
  id uuid primary key default gen_random_uuid(), section_id uuid not null references public.live_group_sections(id) on delete cascade,
  item_type text not null check (item_type in ('text','file','link','assignment')),
  title text, content text, url text, storage_path text, original_filename text,
  activity_id text unique references public.activities(id) on delete restrict,
  due_at timestamptz, max_files smallint check (max_files between 1 and 20),
  max_file_size_bytes integer check (max_file_size_bytes between 1 and 52428800),
  display_order integer not null check (display_order > 0), status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(section_id,display_order),
  check ((item_type='text' and content is not null) or (item_type='file' and storage_path is not null and original_filename is not null) or (item_type='link' and url is not null) or (item_type='assignment' and activity_id is not null and due_at is not null and max_files is not null and max_file_size_bytes is not null))
);
create table public.live_group_announcements (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.live_groups(id) on delete cascade,
  title text, message text not null check (char_length(trim(message)) between 2 and 2000), published_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id) on delete restrict, created_at timestamptz not null default now()
);
create index live_groups_course_status_idx on public.live_groups(course_id,status);
create index live_group_members_student_idx on public.live_group_members(student_id,group_id);
create index live_group_sections_group_idx on public.live_group_sections(group_id,display_order);
create index live_group_items_section_idx on public.live_group_items(section_id,display_order);
create index live_group_announcements_group_idx on public.live_group_announcements(group_id,published_at desc);
alter table public.activities add column live_group_id uuid references public.live_groups(id) on delete restrict;
alter table public.activities add column due_at timestamptz;

create or replace function public.is_live_group_member(p_group uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.live_group_members m join public.live_groups g on g.id=m.group_id where m.group_id=p_group and m.student_id=(select auth.uid()) and g.status in ('active','finished'));
$$;
revoke all on function public.is_live_group_member(uuid) from public,anon; grant execute on function public.is_live_group_member(uuid) to authenticated;
create or replace function public.get_live_group_participants(p_group uuid) returns table(student_id uuid,full_name text)
language sql stable security definer set search_path='' as $$
 select m.student_id,p.full_name from public.live_group_members m join public.profiles p on p.id=m.student_id
 where m.group_id=p_group and (public.is_admin() or public.is_live_group_member(p_group)) order by p.full_name;
$$;
revoke all on function public.get_live_group_participants(uuid) from public,anon;grant execute on function public.get_live_group_participants(uuid) to authenticated;

alter table public.live_groups enable row level security; alter table public.live_group_members enable row level security;
alter table public.live_group_sections enable row level security; alter table public.live_group_items enable row level security; alter table public.live_group_announcements enable row level security;
create policy live_groups_member_read on public.live_groups for select to authenticated using ((select public.is_admin()) or (status in ('active','finished') and (select public.is_live_group_member(id))));
create policy live_groups_admin_manage on public.live_groups for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy live_group_members_member_read on public.live_group_members for select to authenticated using ((select public.is_admin()) or (select public.is_live_group_member(group_id)));
create policy live_group_members_admin_manage on public.live_group_members for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()) and exists(select 1 from public.live_groups g join public.enrollments e on e.course_id=g.course_id where g.id=group_id and e.student_id=student_id and e.status='active'));
create policy live_group_sections_member_read on public.live_group_sections for select to authenticated using ((select public.is_admin()) or (status='published' and (select public.is_live_group_member(group_id))));
create policy live_group_sections_admin_manage on public.live_group_sections for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy live_group_items_member_read on public.live_group_items for select to authenticated using ((select public.is_admin()) or (status='published' and exists(select 1 from public.live_group_sections s where s.id=section_id and s.status='published' and (select public.is_live_group_member(s.group_id)))));
create policy live_group_items_admin_manage on public.live_group_items for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy live_group_announcements_member_read on public.live_group_announcements for select to authenticated using ((select public.is_admin()) or (select public.is_live_group_member(group_id)));
create policy live_group_announcements_admin_manage on public.live_group_announcements for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
revoke all on public.live_groups,public.live_group_members,public.live_group_sections,public.live_group_items,public.live_group_announcements from anon,authenticated;
grant select,insert,update,delete on public.live_groups,public.live_group_members,public.live_group_sections,public.live_group_items,public.live_group_announcements to authenticated;
create trigger live_groups_updated before update on public.live_groups for each row execute procedure public.set_profile_updated_at();
create trigger live_group_sections_updated before update on public.live_group_sections for each row execute procedure public.set_profile_updated_at();
create trigger live_group_items_updated before update on public.live_group_items for each row execute procedure public.set_profile_updated_at();

create or replace function public.create_live_group_assignment(p_section uuid,p_title text,p_content text,p_due_at timestamptz,p_max_files smallint,p_max_file_size_bytes integer)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_group uuid;v_course uuid;v_item uuid:=gen_random_uuid();v_activity text;v_order integer;v_activity_order integer;
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'admin required'; end if;
 if p_due_at is null or p_max_files not between 1 and 20 or p_max_file_size_bytes not between 1 and 52428800 then raise exception 'invalid assignment settings'; end if;
 select s.group_id,g.course_id into v_group,v_course from public.live_group_sections s join public.live_groups g on g.id=s.group_id where s.id=p_section;
 if v_group is null then raise exception 'section unavailable'; end if;
 select coalesce(max(display_order),0)+1 into v_order from public.live_group_items where section_id=p_section;
 select coalesce(max(display_order),0)+1 into v_activity_order from public.activities where course_id=v_course and module_number=1;
 v_activity:='live-'||replace(v_item::text,'-','');
 insert into public.activities(id,course_id,module_number,title,activity_type,required,display_order,status,original_max_points,normalized_max_points,max_files,max_file_size_bytes,use_global_settings,max_total_size_bytes,live_group_id,due_at)
 values(v_activity,v_course,1,trim(p_title),'assignment',true,v_activity_order,'active',100,100,p_max_files,p_max_file_size_bytes,false,p_max_files*p_max_file_size_bytes,v_group,p_due_at);
 insert into public.live_group_items(id,section_id,item_type,title,content,activity_id,due_at,max_files,max_file_size_bytes,display_order)
 values(v_item,p_section,'assignment',trim(p_title),nullif(trim(p_content),''),v_activity,p_due_at,p_max_files,p_max_file_size_bytes,v_order);
 return v_item;
end $$;
revoke all on function public.create_live_group_assignment(uuid,text,text,timestamptz,smallint,integer) from public,anon; grant execute on function public.create_live_group_assignment(uuid,text,text,timestamptz,smallint,integer) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('live-group-assets','live-group-assets',false,52428800,null) on conflict(id) do update set public=false,file_size_limit=52428800;
create policy live_group_assets_admin_insert on storage.objects for insert to authenticated with check(bucket_id='live-group-assets' and (select public.is_admin()) and array_length(storage.foldername(name),1)>=3);
create policy live_group_assets_admin_update on storage.objects for update to authenticated using(bucket_id='live-group-assets' and (select public.is_admin())) with check(bucket_id='live-group-assets' and (select public.is_admin()));
create policy live_group_assets_admin_delete on storage.objects for delete to authenticated using(bucket_id='live-group-assets' and (select public.is_admin()));
create policy live_group_assets_authorized_read on storage.objects for select to authenticated using(bucket_id='live-group-assets' and ((select public.is_admin()) or ((storage.foldername(name))[1]~'^[0-9a-f-]{36}$' and exists(select 1 from public.live_groups g where g.id=(storage.foldername(name))[1]::uuid and (select public.is_live_group_member(g.id))))));

-- Las actividades de grupo exigen membresía además de matrícula.
drop policy if exists "activities_enrolled_or_admin_read" on public.activities;
create policy activities_enrolled_or_admin_read on public.activities for select to authenticated using ((select public.is_admin()) or exists(select 1 from public.enrollments e where e.course_id=activities.course_id and e.student_id=(select auth.uid()) and e.status='active') and (activities.live_group_id is null or (select public.is_live_group_member(activities.live_group_id))));

drop policy if exists "rubrics_enrolled_or_admin_read" on public.rubrics;
create policy rubrics_enrolled_or_admin_read on public.rubrics for select to authenticated using ((select public.is_admin()) or exists(select 1 from public.activities a join public.enrollments e on e.course_id=a.course_id where a.id=rubrics.activity_id and e.student_id=(select auth.uid()) and e.status='active' and (a.live_group_id is null or (select public.is_live_group_member(a.live_group_id)))));
drop policy if exists "criteria_enrolled_or_admin_read" on public.rubric_criteria;
create policy criteria_enrolled_or_admin_read on public.rubric_criteria for select to authenticated using ((select public.is_admin()) or exists(select 1 from public.rubrics r join public.activities a on a.id=r.activity_id join public.enrollments e on e.course_id=a.course_id where r.id=rubric_criteria.rubric_id and e.student_id=(select auth.uid()) and e.status='active' and (a.live_group_id is null or (select public.is_live_group_member(a.live_group_id)))));

create or replace function public.prepare_activity_upload(p_activity_id text,p_files jsonb)
returns table(batch_id uuid,files jsonb) language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid();v_course uuid;v_group uuid;v_due timestamptz;v_batch uuid:=gen_random_uuid();v_max_files integer;v_max_total integer;v_max_each integer;v_allowed text[];v_files jsonb;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 select a.course_id,a.live_group_id,a.due_at,case when a.use_global_settings then s.max_files else a.max_files end,case when a.use_global_settings then s.max_total_size_bytes else coalesce(a.max_total_size_bytes,s.max_total_size_bytes) end,a.max_file_size_bytes,case when a.use_global_settings then s.allowed_file_types else a.allowed_file_types end
 into v_course,v_group,v_due,v_max_files,v_max_total,v_max_each,v_allowed from public.activities a cross join public.academic_submission_settings s where a.id=p_activity_id and a.status='active' and s.id=true;
 if v_course is null then raise exception 'activity unavailable'; end if;
 if v_due is not null and now()>v_due then raise exception 'deadline passed'; end if;
 if v_group is not null and not public.is_live_group_member(v_group) then raise exception 'live group membership required'; end if;
 if not exists(select 1 from public.enrollments e where e.student_id=v_user and e.course_id=v_course and e.status='active') then raise exception 'active enrollment required'; end if;
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
revoke all on function public.prepare_activity_upload(text,jsonb) from public,anon;grant execute on function public.prepare_activity_upload(text,jsonb) to authenticated;

create or replace function public.submit_activity_files(p_activity_id text,p_files jsonb)
returns table(submission_id uuid,submitted_at timestamptz,old_storage_paths text[]) language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid();v_course uuid;v_group uuid;v_due timestamptz;v_submission uuid;v_time timestamptz:=now();v_max_files integer;v_max_total integer;v_max_each integer;v_old text[];
begin
 select a.course_id,a.live_group_id,a.due_at,case when a.use_global_settings then s.max_files else a.max_files end,case when a.use_global_settings then s.max_total_size_bytes else coalesce(a.max_total_size_bytes,s.max_total_size_bytes) end,a.max_file_size_bytes into v_course,v_group,v_due,v_max_files,v_max_total,v_max_each from public.activities a cross join public.academic_submission_settings s where a.id=p_activity_id and a.status='active' and s.id=true;
 if v_user is null or v_course is null then raise exception 'activity unavailable'; end if;
 if v_due is not null and now()>v_due then raise exception 'deadline passed'; end if;
 if v_group is not null and not public.is_live_group_member(v_group) then raise exception 'live group membership required'; end if;
 if not exists(select 1 from public.enrollments e where e.student_id=v_user and e.course_id=v_course and e.status='active') then raise exception 'active enrollment required'; end if;
 if jsonb_typeof(p_files)<>'array' or jsonb_array_length(p_files)<1 or jsonb_array_length(p_files)>v_max_files or exists(select 1 from jsonb_array_elements(p_files)f where (f->>'size_bytes')::integer>v_max_each) or (select sum((f->>'size_bytes')::bigint) from jsonb_array_elements(p_files)f)>v_max_total then raise exception 'invalid files'; end if;
 select array_agg(sf.storage_path) into v_old from public.submission_files sf join public.submissions sub on sub.id=sf.submission_id where sub.student_id=v_user and sub.activity_id=p_activity_id and sf.file_deleted_at is null;
 insert into public.submissions(student_id,course_id,activity_id,status,submitted_at,created_at,updated_at) values(v_user,v_course,p_activity_id,'submitted',v_time,v_time,v_time) on conflict(student_id,activity_id) do update set status='submitted',submitted_at=v_time,updated_at=v_time,grade=null,feedback=null,reviewed_at=null,reviewed_by=null,convalidated=false,convalidation_note=null returning id into v_submission;
 update public.submission_files sf set file_deleted_at=v_time where sf.submission_id=v_submission and sf.file_deleted_at is null;
 insert into public.submission_files(submission_id,storage_path,original_filename,stored_filename,size_bytes,mime_type) select v_submission,f->>'storage_path',f->>'original_filename',f->>'stored_filename',(f->>'size_bytes')::integer,coalesce(nullif(f->>'mime_type',''),'application/octet-stream') from jsonb_array_elements(p_files)f;
 insert into public.student_activity_records(student_id,activity_id,submission_id,status) values(v_user,p_activity_id,v_submission,'under_review') on conflict(student_id,activity_id) do update set submission_id=v_submission,status='under_review',feedback=null,reviewed_at=null,reviewed_by=null,updated_at=v_time;
 insert into public.activity_review_history(record_id,status) select sar.id,'under_review' from public.student_activity_records sar where sar.student_id=v_user and sar.activity_id=p_activity_id;
 return query select v_submission,v_time,coalesce(v_old,array[]::text[]);
end $$;
revoke all on function public.submit_activity_files(text,jsonb) from public,anon,authenticated;

create or replace function public.review_live_group_activity(p_student_id uuid,p_activity_id text,p_status text,p_feedback text,p_grade numeric)
returns public.student_activity_records language plpgsql security definer set search_path='' as $$
declare v_record public.student_activity_records;v_group_slug text;
begin
 if p_grade is not null and (p_grade<0 or p_grade>100) then raise exception 'invalid grade'; end if;
 v_record:=public.review_student_activity(p_student_id,p_activity_id,p_status,p_feedback,null);
 update public.submissions s set grade=p_grade where s.student_id=p_student_id and s.activity_id=p_activity_id;
 select g.slug into v_group_slug from public.activities a join public.live_groups g on g.id=a.live_group_id where a.id=p_activity_id;
 if v_group_slug is not null then
  update public.notifications n set href='/mi-coa/grupos/'||v_group_slug||'?tab=calificaciones'
  where n.id=(select n2.id from public.notifications n2 where n2.user_id=p_student_id order by n2.created_at desc limit 1);
 end if;
 return v_record;
end $$;
revoke all on function public.review_live_group_activity(uuid,text,text,text,numeric) from public,anon;grant execute on function public.review_live_group_activity(uuid,text,text,text,numeric) to authenticated;

create or replace function public.move_live_group_section(p_id uuid,p_direction integer) returns void language plpgsql security definer set search_path='' as $$
declare v_group uuid;v_order integer;v_other uuid;v_other_order integer;v_temp integer;
begin if auth.uid() is null or not public.is_admin() or p_direction not in(-1,1) then raise exception 'admin required';end if;
 select group_id,display_order into v_group,v_order from public.live_group_sections where id=p_id;
 select id,display_order into v_other,v_other_order from public.live_group_sections where group_id=v_group and ((p_direction=-1 and display_order<v_order)or(p_direction=1 and display_order>v_order)) order by case when p_direction=-1 then -display_order else display_order end limit 1;
 if v_other is null then return;end if;select max(display_order)+1 into v_temp from public.live_group_sections where group_id=v_group;
 update public.live_group_sections set display_order=v_temp where id=p_id;update public.live_group_sections set display_order=v_order where id=v_other;update public.live_group_sections set display_order=v_other_order where id=p_id;end $$;
create or replace function public.move_live_group_item(p_id uuid,p_direction integer) returns void language plpgsql security definer set search_path='' as $$
declare v_section uuid;v_order integer;v_other uuid;v_other_order integer;v_temp integer;
begin if auth.uid() is null or not public.is_admin() or p_direction not in(-1,1) then raise exception 'admin required';end if;
 select section_id,display_order into v_section,v_order from public.live_group_items where id=p_id;select id,display_order into v_other,v_other_order from public.live_group_items where section_id=v_section and ((p_direction=-1 and display_order<v_order)or(p_direction=1 and display_order>v_order)) order by case when p_direction=-1 then -display_order else display_order end limit 1;
 if v_other is null then return;end if;select max(display_order)+1 into v_temp from public.live_group_items where section_id=v_section;update public.live_group_items set display_order=v_temp where id=p_id;update public.live_group_items set display_order=v_order where id=v_other;update public.live_group_items set display_order=v_other_order where id=p_id;end $$;
revoke all on function public.move_live_group_section(uuid,integer),public.move_live_group_item(uuid,integer) from public,anon;grant execute on function public.move_live_group_section(uuid,integer),public.move_live_group_item(uuid,integer) to authenticated;
