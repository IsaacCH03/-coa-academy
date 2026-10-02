-- Archivado administrativo reversible de grupos en vivo.
-- No modifica el estado académico ni la visibilidad pública del grupo.
alter table public.live_groups
  add column archived_at timestamptz;

create index live_groups_archived_at_idx
  on public.live_groups(archived_at);

