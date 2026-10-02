-- Permite firmar únicamente portadas de grupos públicos activos y visibles.
-- El helper evita consultar live_groups directamente desde la policy de Storage,
-- el mismo patrón seguro usado para comprobar membresía en assets privados.

create or replace function public.is_public_live_group_cover(p_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.live_groups g
    where g.id = p_group
      and g.access_type = 'public'
      and g.status = 'active'
      and (g.show_banner or g.show_catalog)
  );
$$;

revoke all on function public.is_public_live_group_cover(uuid) from public;
grant execute on function public.is_public_live_group_cover(uuid) to anon, authenticated;

drop policy if exists live_group_assets_public_cover_read on storage.objects;
create policy live_group_assets_public_cover_read
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'live-group-assets'
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] = 'covers'
    and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and (select public.is_public_live_group_cover((storage.foldername(name))[1]::uuid))
  );
