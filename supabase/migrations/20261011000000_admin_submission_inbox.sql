-- Bandeja administrativa de entregas: archivado organizativo sin alterar el estado académico.
alter table public.submissions
  add column admin_archived_at timestamptz;

create index submissions_admin_archive_submitted_idx
  on public.submissions(admin_archived_at, submitted_at desc);

create index submissions_activity_submitted_idx
  on public.submissions(activity_id, submitted_at desc);

create index activities_live_group_idx
  on public.activities(live_group_id)
  where live_group_id is not null;

create or replace function public.reactivate_resubmitted_submission()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.submitted_at is distinct from old.submitted_at and new.status = 'submitted' then
    new.admin_archived_at := null;
  end if;
  return new;
end;
$$;

create trigger submissions_reactivate_on_resubmit
  before update of submitted_at on public.submissions
  for each row execute procedure public.reactivate_resubmitted_submission();

-- La política submissions_admin_manage existente limita updates a administradores.
-- Los registros previos quedan activos porque admin_archived_at inicia en NULL.
