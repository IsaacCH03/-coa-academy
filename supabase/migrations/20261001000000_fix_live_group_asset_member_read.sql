-- Permite firmar portadas y materiales a miembros reales del grupo.
-- Evita la subconsulta cruzada a live_groups dentro de storage.objects;
-- is_live_group_member() ya valida grupo, miembro y estado como SECURITY DEFINER.

drop policy if exists live_group_assets_authorized_read on storage.objects;

create policy live_group_assets_authorized_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'live-group-assets'
  and (
    (select public.is_admin())
    or (
      array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      and (storage.foldername(name))[2] in ('covers', 'materials')
      and (select public.is_live_group_member((storage.foldername(name))[1]::uuid))
    )
  )
);
