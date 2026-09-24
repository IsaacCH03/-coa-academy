-- Fase 2: cursos, datos académicos mínimos y matrículas.
-- Ejecutar después de 20260921000000_create_profiles.sql.

alter table public.profiles
  add column if not exists identification text,
  add column if not exists country text,
  add column if not exists phone text;

alter table public.profiles drop constraint if exists profiles_identification_length;
alter table public.profiles add constraint profiles_identification_length
  check (identification is null or char_length(trim(identification)) between 4 and 40);
alter table public.profiles drop constraint if exists profiles_country_length;
alter table public.profiles add constraint profiles_country_length
  check (country is null or char_length(trim(country)) between 2 and 80);
alter table public.profiles drop constraint if exists profiles_phone_length;
alter table public.profiles add constraint profiles_phone_length
  check (phone is null or char_length(trim(phone)) between 7 and 30);

revoke update (full_name) on public.profiles from authenticated;
grant update (full_name, identification, country, phone) on public.profiles to authenticated;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create index if not exists enrollments_course_id_idx on public.enrollments(course_id);
create index if not exists enrollments_student_id_idx on public.enrollments(student_id);

alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

drop policy if exists "courses_read_published" on public.courses;
create policy "courses_read_published"
on public.courses for select
to anon, authenticated
using (status = 'published');

drop policy if exists "courses_admin_read_all" on public.courses;
create policy "courses_admin_read_all"
on public.courses for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "courses_admin_insert" on public.courses;
create policy "courses_admin_insert"
on public.courses for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "courses_admin_update" on public.courses;
create policy "courses_admin_update"
on public.courses for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "courses_admin_delete" on public.courses;
create policy "courses_admin_delete"
on public.courses for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "enrollments_read_own_or_admin" on public.enrollments;
create policy "enrollments_read_own_or_admin"
on public.enrollments for select
to authenticated
using ((select auth.uid()) = student_id or (select public.is_admin()));

drop policy if exists "enrollments_insert_own_published_course" on public.enrollments;
create policy "enrollments_insert_own_published_course"
on public.enrollments for insert
to authenticated
with check (
  (select auth.uid()) = student_id
  and status = 'active'
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'student'
  )
  and exists (
    select 1 from public.courses
    where id = course_id and status = 'published'
  )
);

drop policy if exists "enrollments_admin_update" on public.enrollments;
create policy "enrollments_admin_update"
on public.enrollments for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "enrollments_admin_delete" on public.enrollments;
create policy "enrollments_admin_delete"
on public.enrollments for delete
to authenticated
using ((select public.is_admin()));

revoke all on table public.courses from anon, authenticated;
grant select (id, title, slug, description, status) on public.courses to anon, authenticated;
grant insert, update, delete on table public.courses to authenticated;

revoke all on table public.enrollments from anon, authenticated;
grant select on table public.enrollments to authenticated;
grant insert (student_id, course_id) on public.enrollments to authenticated;
grant update (status) on public.enrollments to authenticated;
grant delete on public.enrollments to authenticated;

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
before update on public.courses
for each row execute procedure public.set_profile_updated_at();

insert into public.courses (title, slug, description, status) values
  ('Python Nivel 1', 'python-nivel-1', 'Aprende programación desde cero con Python mediante explicaciones claras, ejercicios prácticos y un proyecto final.', 'published'),
  ('Lógica de Programación', 'logica-de-programacion', 'Aprende pensamiento computacional mediante algoritmos, diagramas de flujo, pseudocódigo y resolución de problemas.', 'published'),
  ('Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial', 'desarrollo-web-moderno', 'Construye aplicaciones web modernas con HTML, CSS, JavaScript, React, Next.js e Inteligencia Artificial.', 'published'),
  ('Python Intermedio', 'python-intermedio', 'Avanza en Python con programación orientada a objetos, automatización, interfaces gráficas y bases de datos.', 'published'),
  ('Python Práctico', 'python-practico', 'Domina herramientas nativas de Python para transformar datos, trabajar con archivos y crear programas confiables.', 'published'),
  ('SQL y Bases de Datos Relacionales', 'sql-bases-datos', 'Aprende SQL desde cero y diseña bases de datos relacionales mediante SQLite y proyectos prácticos.', 'published'),
  ('Desarrollo de Software con Python', 'desarrollo-software-python', 'Construye, prueba, documenta y distribuye aplicaciones empresariales completas utilizando Python.', 'published'),
  ('Desarrollo de Aplicaciones Web con Django', 'desarrollo-web-django', 'Construye aplicaciones web profesionales con Django, bases de datos, autenticación, pruebas y despliegue.', 'published'),
  ('Programación Asistida por Inteligencia Artificial', 'programacion-con-ia', 'Aprende a utilizar Inteligencia Artificial para desarrollar software con productividad, calidad y criterio profesional.', 'draft')
on conflict (slug) do nothing;
