-- Public discovery and secure self-enrollment for live groups.
alter table public.live_groups
  add column access_type text not null default 'private'
    check (access_type in ('private', 'public')),
  add column show_banner boolean not null default false,
  add column show_catalog boolean not null default false,
  add column public_summary text
    check (public_summary is null or char_length(trim(public_summary)) between 2 and 500),
  add constraint live_groups_private_not_publicly_listed
    check (access_type = 'public' or (not show_banner and not show_catalog));

create index live_groups_public_discovery_idx
  on public.live_groups(status, access_type, show_banner, show_catalog);

drop policy if exists live_groups_member_read on public.live_groups;
create policy live_groups_member_read
  on public.live_groups for select to authenticated
  using (
    (select public.is_admin())
    or (status in ('active', 'finished') and (select public.is_live_group_member(id)))
  );
create policy live_groups_public_read
  on public.live_groups for select to anon, authenticated
  using (access_type = 'public' and status = 'active');
grant select (id, course_id, slug, name, image_path, starts_on, status, access_type, show_banner, show_catalog, public_summary)
  on public.live_groups to anon;

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
  if not exists (
    select 1 from public.profiles p where p.id = v_user and p.role = 'student'
  ) then raise exception 'student account required'; end if;

  select g.course_id, g.slug into v_course, v_slug
  from public.live_groups g
  where g.id = p_group and g.access_type = 'public' and g.status = 'active'
  for update;

  if v_course is null then raise exception 'public group unavailable'; end if;

  insert into public.enrollments(student_id, course_id, status)
  values(v_user, v_course, 'active')
  on conflict(student_id, course_id) do update set status = 'active';

  insert into public.live_group_members(group_id, student_id)
  values(p_group, v_user)
  on conflict(group_id, student_id) do nothing;

  return v_slug;
end;
$$;
revoke all on function public.join_public_live_group(uuid) from public, anon;
grant execute on function public.join_public_live_group(uuid) to authenticated;

drop policy if exists live_group_assets_public_cover_read on storage.objects;
create policy live_group_assets_public_cover_read
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'live-group-assets'
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] = 'covers'
    and (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and exists (
      select 1 from public.live_groups g
      where g.id = (storage.foldername(name))[1]::uuid
        and g.access_type = 'public'
        and g.status = 'active'
        and (g.show_banner or g.show_catalog)
    )
  );
