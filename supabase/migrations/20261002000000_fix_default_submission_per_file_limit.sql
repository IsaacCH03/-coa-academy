-- El valor histórico de 10 MB en max_total_size_bytes convertía el límite
-- predeterminado de 10 MB por archivo en un límite de 10 MB para toda la entrega.
-- Solo se amplía la configuración que aún conserva ese valor predeterminado;
-- los límites personalizados del administrador permanecen intactos.

alter table public.academic_submission_settings
  alter column max_total_size_bytes set default 52428800;

update public.academic_submission_settings
set max_total_size_bytes = max_files * 10485760,
    updated_at = now()
where id = true
  and max_total_size_bytes = 10485760;
