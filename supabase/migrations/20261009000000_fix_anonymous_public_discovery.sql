-- Corrige la lectura anónima de contenido expresamente público.
-- Las ramas públicas no invocan is_admin(), que solo está concedida a authenticated.

drop policy if exists proposals_public_read on public.course_proposals;
create policy proposals_anon_read
  on public.course_proposals for select to anon
  using (status = 'open');
create policy proposals_authenticated_read
  on public.course_proposals for select to authenticated
  using (status = 'open' or (select public.is_admin()));

drop policy if exists proposal_options_public_read on public.course_proposal_options;
create policy proposal_options_anon_read
  on public.course_proposal_options for select to anon
  using (
    exists (
      select 1 from public.course_proposals p
      where p.id = proposal_id and p.status = 'open'
    )
  );
create policy proposal_options_authenticated_read
  on public.course_proposal_options for select to authenticated
  using (
    exists (
      select 1 from public.course_proposals p
      where p.id = proposal_id
        and (p.status = 'open' or (select public.is_admin()))
    )
  );

drop policy if exists projects_visible on public.student_projects;
create policy projects_anon_read
  on public.student_projects for select to anon
  using (status = 'published');
create policy projects_authenticated_read
  on public.student_projects for select to authenticated
  using (
    status = 'published'
    or author_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists project_images_visible on public.student_project_images;
create policy project_images_anon_read
  on public.student_project_images for select to anon
  using (
    exists (
      select 1 from public.student_projects p
      where p.id = project_id and p.status = 'published'
    )
  );
create policy project_images_authenticated_read
  on public.student_project_images for select to authenticated
  using (
    exists (
      select 1 from public.student_projects p
      where p.id = project_id
        and (
          p.status = 'published'
          or p.author_id = (select auth.uid())
          or (select public.is_admin())
        )
    )
  );

create or replace function public.is_public_profile_avatar(p_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.avatar_path = p_path
  );
$$;
revoke all on function public.is_public_profile_avatar(text) from public;
grant execute on function public.is_public_profile_avatar(text) to anon, authenticated;

drop policy if exists phase3_media_read on storage.objects;
drop policy if exists phase3_profile_avatar_read on storage.objects;

create policy phase3_media_anon_read
  on storage.objects for select to anon
  using (
    bucket_id = 'phase3-media'
    and (
      exists (
        select 1
        from public.student_project_images i
        join public.student_projects p on p.id = i.project_id
        where i.storage_path = name and p.status = 'published'
      )
      or exists (
        select 1
        from public.course_proposals p
        where p.image_path = name and p.status = 'open'
      )
      or (select public.is_public_profile_avatar(name))
    )
  );

create policy phase3_media_authenticated_read
  on storage.objects for select to authenticated
  using (
    bucket_id = 'phase3-media'
    and (
      exists (
        select 1
        from public.student_project_images i
        join public.student_projects p on p.id = i.project_id
        where i.storage_path = name
          and (
            p.status = 'published'
            or p.author_id = (select auth.uid())
            or (select public.is_admin())
          )
      )
      or exists (
        select 1
        from public.course_proposals p
        where p.image_path = name
          and (p.status = 'open' or (select public.is_admin()))
      )
      or (select public.is_public_profile_avatar(name))
      or (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.is_admin())
    )
  );
