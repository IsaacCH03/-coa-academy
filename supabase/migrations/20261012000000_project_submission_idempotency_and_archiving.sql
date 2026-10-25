-- Publicaciones idempotentes y archivado administrativo reversible.
-- Esta migración es reejecutable para facilitar una recuperación segura si el SQL
-- se interrumpe fuera del runner transaccional de migraciones de Supabase.

alter table public.student_projects
  add column if not exists submission_key uuid,
  add column if not exists upload_state text,
  add column if not exists admin_archived_at timestamptz,
  add column if not exists admin_archived_by uuid;

-- Todos los registros anteriores a esta migración ya eran publicaciones completas.
update public.student_projects set upload_state = 'ready' where upload_state is null;
-- El valor por defecto mantiene compatible el código anterior durante el despliegue.
-- El trigger cambia a uploading solo los intentos idempotentes de la versión nueva.
alter table public.student_projects alter column upload_state set default 'ready';
alter table public.student_projects alter column upload_state set not null;

do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.student_projects'::regclass
      and conname = 'student_projects_upload_state_check'
  ) then
    alter table public.student_projects
      add constraint student_projects_upload_state_check
      check (upload_state in ('uploading', 'ready', 'failed'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.student_projects'::regclass
      and conname = 'student_projects_admin_archived_by_fkey'
  ) then
    alter table public.student_projects
      add constraint student_projects_admin_archived_by_fkey
      foreign key (admin_archived_by) references public.profiles(id);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.student_projects'::regclass
      and conname = 'student_projects_archived_pending_check'
  ) then
    alter table public.student_projects
      add constraint student_projects_archived_pending_check
      check (admin_archived_at is null or status = 'pending');
  end if;
end $$;

create unique index if not exists student_projects_author_submission_key_idx
  on public.student_projects(author_id, submission_key)
  where submission_key is not null;

create index if not exists student_projects_admin_archive_idx
  on public.student_projects(admin_archived_at, status, created_at desc);

create or replace function public.set_student_project_initial_upload_state()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.upload_state := case when new.submission_key is null then 'ready' else 'uploading' end;
  return new;
end $$;
revoke all on function public.set_student_project_initial_upload_state() from public,anon,authenticated;
drop trigger if exists student_projects_initial_upload_state on public.student_projects;
create trigger student_projects_initial_upload_state
before insert on public.student_projects
for each row execute function public.set_student_project_initial_upload_state();

-- El cliente puede proponer la identidad del intento, pero no alterar su estado.
grant insert(submission_key) on public.student_projects to authenticated;
revoke insert(upload_state), update(upload_state)
  on public.student_projects from authenticated;

create or replace function public.set_own_project_upload_state(
  p_project uuid,
  p_submission_key uuid,
  p_state text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if p_state not in ('ready', 'failed') then raise exception 'invalid upload state'; end if;

  update public.student_projects
  set upload_state = p_state, updated_at = now()
  where id = p_project
    and author_id = auth.uid()
    and submission_key = p_submission_key
    and upload_state = 'uploading';
  return found;
end $$;
revoke all on function public.set_own_project_upload_state(uuid,uuid,text) from public,anon;
grant execute on function public.set_own_project_upload_state(uuid,uuid,text) to authenticated;

create or replace function public.set_student_projects_archived(p_projects uuid[], p_archived boolean)
returns table(project_id uuid, changed boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare v_project uuid;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'admin required'; end if;
  foreach v_project in array coalesce(p_projects, array[]::uuid[]) loop
    if p_archived then
      update public.student_projects
      set admin_archived_at=coalesce(admin_archived_at,now()),
          admin_archived_by=coalesce(admin_archived_by,auth.uid()),
          updated_at=now()
      where id=v_project and status='pending' and upload_state='ready';
    else
      update public.student_projects
      set admin_archived_at=null, admin_archived_by=null, updated_at=now()
      where id=v_project and admin_archived_at is not null;
    end if;
    project_id:=v_project; changed:=found; return next;
  end loop;
end $$;
revoke all on function public.set_student_projects_archived(uuid[],boolean) from public,anon;
grant execute on function public.set_student_projects_archived(uuid[],boolean) to authenticated;

-- Conserva la firma y el comportamiento productivo de moderación, añadiendo
-- únicamente las precondiciones de integridad introducidas por esta migración.
create or replace function public.moderate_student_project(
  p_project uuid,
  p_status text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin required';
  end if;

  if p_status not in ('published', 'rejected', 'pending') then
    raise exception 'invalid status';
  end if;

  update public.student_projects
  set status = p_status,
      rejection_reason = case
        when p_status = 'rejected' then nullif(trim(p_reason), '')
        else null
      end,
      moderated_by = auth.uid(),
      moderated_at = now(),
      updated_at = now()
  where id = p_project
    and upload_state = 'ready'
    and admin_archived_at is null;

  if not found then
    raise exception 'project unavailable';
  end if;
end $$;
revoke all on function public.moderate_student_project(uuid,text,text) from public,anon;
grant execute on function public.moderate_student_project(uuid,text,text) to authenticated;
