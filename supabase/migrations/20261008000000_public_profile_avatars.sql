-- Avatares opcionales para el perfil público. El bucket permanece privado.
create policy phase3_profile_avatar_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'phase3-media'
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] = 'avatars'
  );

create policy phase3_profile_avatar_read
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'phase3-media'
    and (
      exists (
        select 1
        from public.profiles p
        where p.avatar_path = name
      )
      or (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.is_admin())
    )
  );
