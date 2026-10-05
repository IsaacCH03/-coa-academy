-- Guardados privados de Proyectos COA. Solo el propietario puede administrarlos.
create table public.student_project_saves (
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.student_projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

create index student_project_saves_user_created_idx
  on public.student_project_saves(user_id, created_at desc);

alter table public.student_project_saves enable row level security;

create policy student_project_saves_own_read
  on public.student_project_saves for select to authenticated
  using (user_id = (select auth.uid()));

create policy student_project_saves_own_insert
  on public.student_project_saves for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.student_projects p
      where p.id = project_id and p.status = 'published'
    )
  );

create policy student_project_saves_own_delete
  on public.student_project_saves for delete to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.student_project_saves from anon, authenticated;
grant select, insert, delete on public.student_project_saves to authenticated;
