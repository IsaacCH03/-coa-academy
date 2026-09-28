-- La comprobación cruzada contra public.live_groups dentro de la policy de
-- storage.objects rechazaba el INSERT aun cuando el grupo y el admin existían.
-- La autorización se mantiene en Storage: bucket privado, rol authenticated,
-- administrador real y estructura de ruta limitada a covers/materials.

drop policy if exists live_group_assets_admin_insert on storage.objects;

create policy live_group_assets_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'live-group-assets'
  and (select public.is_admin())
  and array_length(storage.foldername(name), 1) = 2
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (storage.foldername(name))[2] in ('covers', 'materials')
);
