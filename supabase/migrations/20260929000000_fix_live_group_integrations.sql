-- Correcciones incrementales para grupos en vivo.
-- 20260928000000_live_groups.sql ya fue aplicada: no modificarla en remoto.

-- courses usa privilegios SELECT por columna. La columna agregada en la
-- migración anterior debe concederse explícitamente para las consultas públicas.
grant select (delivery_mode) on public.courses to anon, authenticated;

-- El slug canónico existente de Nivel 2 es python-intermedio.
update public.courses
set delivery_mode = 'live_group'
where slug in ('python-nivel-1', 'python-intermedio');

-- storage.foldername('uuid/covers/file-id') devuelve dos carpetas:
-- [uuid, covers]. La política anterior exigía tres y rechazaba todo INSERT.
drop policy if exists live_group_assets_admin_insert on storage.objects;
create policy live_group_assets_admin_insert
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'live-group-assets'
  and (select public.is_admin())
  and array_length(storage.foldername(name), 1) = 2
  and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] in ('covers', 'materials')
  and exists (
    select 1
    from public.live_groups g
    where g.id = (storage.foldername(name))[1]::uuid
  )
);
