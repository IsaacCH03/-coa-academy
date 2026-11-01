-- Alinea el límite histórico fijo de 10 MiB con los límites configurables
-- que ya aplican el formulario, el RPC y live_group_items.
alter table public.activities
  drop constraint if exists activities_max_file_size_bytes_check;

alter table public.activities
  add constraint activities_max_file_size_bytes_check
  check (max_file_size_bytes between 1 and 52428800);

-- Es únicamente el techo de transporte. El límite académico efectivo continúa
-- validándose por actividad antes y después de subir cada archivo.
update storage.buckets
set file_size_limit = 52428800
where id = 'academic-submissions'
  and file_size_limit is distinct from 52428800;
