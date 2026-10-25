# Auditoría de seguridad — Proyectos COA y migración Supabase

Fecha: 25 de octubre de 2026  
Alcance: implementación de Proyectos COA y `20261012000000_project_submission_idempotency_and_archiving.sql`.

## Resumen ejecutivo

La primera versión auditada **no debía ejecutarse en producción**. Se encontraron cuatro problemas comprobables: escritura directa de `upload_state` concedida a cualquier usuario autenticado; pérdida de referencias cuando fallaba la compensación de Storage; imposibilidad de recuperar ciertos intentos `failed`; y una carrera que permitía moderar una solicitud ya archivada mediante un formulario obsoleto. También era inseguro reejecutar el SQL después de una aplicación parcial y una violación única ajena a la clave de intento podía diagnosticarse incorrectamente como duplicado.

Estos problemas fueron corregidos en el repositorio. El estado de carga ahora solo cambia mediante una función `SECURITY DEFINER` restringida al autor, el archivado continúa siendo exclusivamente administrativo y una restricción impide que un proyecto archivado deje de estar pendiente. La compensación conserva referencias si Storage no confirma la eliminación y los reintentos recuperan intentos fallidos o abandonados. La migración se hizo reejecutable y mantiene compatibilidad durante una implantación migración-primero mediante un trigger: inserciones antiguas sin `submission_key` quedan `ready`; intentos nuevos con clave comienzan `uploading`.

No se tuvo acceso a la base de producción ni a un Postgres/Supabase local. Por ello no se verificaron el esquema desplegado, el propietario real de las funciones, el historial remoto de migraciones, los datos reales ni la ejecución SQL contra el motor. La recomendación final queda condicionada a un ensayo en staging y a los preflight indicados abajo.

**Veredicto: APTO CON CONDICIONES.**

## Archivos revisados

- `supabase/migrations/20260921000000_create_profiles.sql`
- `supabase/migrations/20261007000000_course_demand_and_coa_projects.sql`
- `supabase/migrations/20261009000000_fix_anonymous_public_discovery.sql`
- `supabase/migrations/20261010000000_student_project_saves.sql`
- `supabase/migrations/20261012000000_project_submission_idempotency_and_archiving.sql`
- `app/phase3-actions.ts`
- `app/admin/proyectos/page.tsx`
- `app/mi-coa/proyectos/page.tsx`
- `app/proyectos/page.tsx`, detalle, autores y guardados
- `components/projects/project-create-form.tsx`
- `components/projects/admin-project-moderation.tsx`
- Pruebas asociadas a acciones, formularios, moderación y migración

## Hallazgos y correcciones

### Críticos

No queda un hallazgo crítico demostrado en el código corregido. No se declara ausencia de riesgos críticos en producción porque el esquema remoto no fue inspeccionado.

### Altos

1. **Escritura directa del estado interno por estudiantes.** La versión inicial concedía `insert(upload_state)` y `update(upload_state)` a `authenticated`. Aunque RLS limitaba la fila al autor, un estudiante podía marcar manualmente su proyecto como `ready`. Se revocaron ambos privilegios. `set_own_project_upload_state()` valida sesión, autor, `submission_key`, transición desde `uploading` y estados permitidos.

2. **Pérdida de trazabilidad y objetos huérfanos durante compensación.** Antes se eliminaba el proyecto aunque Storage no confirmara la eliminación. Ahora se marca `failed`, se conservan proyecto y filas de imágenes si falla Storage, y un reintento usa esas rutas para una recuperación segura. No se realiza limpieza global ni histórica.

3. **Moderación obsoleta o prematura.** La definición productiva confirmada actualiza por `id` sin comprobar archivo ni estado de carga. Un administrador —desde una interfaz obsoleta o invocando directamente el RPC— puede publicar o rechazar una fila `uploading`/`failed`. La migración conserva firma, validaciones y mutaciones existentes, y añade `upload_state='ready'` y `admin_archived_at IS NULL` al mismo `UPDATE`. La restricción `student_projects_archived_pending_check` mantiene además una defensa independiente para archivados.

### Medios

1. **Migración no reejecutable.** `ADD COLUMN` e índices sin guardas fallaban al reintentar. Se añadieron `IF NOT EXISTS`, restricciones nombradas y bloques de comprobación. Las funciones nuevas usan `CREATE OR REPLACE` y el trigger se reemplaza de forma determinista.

2. **Intentos fallidos bloqueados.** Un proyecto `failed` no podía reutilizar su clave. El servidor ahora limpia únicamente las rutas registradas del mismo proyecto y autor, elimina el intento y lo recrea una sola vez. También recupera `uploading` con más de 30 minutos.

3. **Colisión única mal clasificada.** El código trataba cualquier error `23505` como repetición del intento, aunque podía ser una colisión de `slug`. Ahora exige encontrar el registro del mismo autor y `submission_key`; en caso contrario devuelve un error de creación normal.

4. **Ventana incompatible de despliegue.** Un default global `uploading` habría dejado incompletos los proyectos creados temporalmente por el código anterior. El default final es `ready` y un trigger asigna `uploading` únicamente cuando existe `submission_key`, permitiendo aplicar primero la migración y después desplegar la aplicación.

### Bajos

1. La detección visual de posibles duplicados usa equivalencia normalizada de título/descripción, mismo autor y ventana de diez minutos. Es deliberadamente informativa y puede producir falsos positivos; no ejecuta cambios.
2. Crear índices normales puede bloquear brevemente escrituras sobre `student_projects`. El volumen real no se pudo medir. Debe revisarse el tamaño y aplicarse en una ventana de bajo tráfico.

## Compatibilidad y efectos sobre datos existentes

- `submission_key`, `admin_archived_at` y `admin_archived_by` quedan nulos para filas existentes.
- Las filas existentes reciben `upload_state='ready'`; no se modifica su `status`, contenido, autor, moderación ni imágenes.
- `admin_archived_by` es `uuid` y referencia `profiles(id)`, también `uuid` en las migraciones revisadas.
- El índice único es parcial y solo incluye claves no nulas, por lo que no colisiona con publicaciones históricas.
- El índice de archivo no transforma registros.
- No se eliminan proyectos, imágenes ni notificaciones durante la migración.
- El trigger mantiene operativa la versión anterior mientras se despliega el código nuevo.
- La restricción de archivado es compatible con las 82 filas actuales porque las columnas de archivo nacen nulas.

## Seguridad, RLS y funciones

- Las políticas existentes impiden que un estudiante actualice filas ajenas mediante `author_id = auth.uid()`.
- No se concede acceso de columna a `admin_archived_at` ni `admin_archived_by`.
- Archivar/restaurar solo ocurre dentro de `set_student_projects_archived()`, que exige sesión y `public.is_admin()` antes de procesar identificadores.
- `public.is_admin()` es `SECURITY DEFINER`, consulta `profiles.id = auth.uid()` y su ejecución está concedida a `authenticated`.
- Todas las nuevas funciones privilegiadas fijan `search_path=''` y califican `auth`/`public`, evitando resolución desde esquemas manipulables. PostgreSQL recomienda excluir esquemas escribibles del `search_path` de funciones `SECURITY DEFINER`: [CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html).
- Los parámetros no se concatenan en SQL dinámico.
- Archivar/restaurar no llama a moderación ni inserta notificaciones.
- La migración reemplaza `moderate_student_project()` con el cuerpo productivo ya confirmado, conservando firma y comportamiento y añadiendo únicamente las dos precondiciones de integridad.
- Las políticas de Storage mantienen el bucket privado y limitan escritura/eliminación por prefijo de usuario o administración.

## Consistencia frontend/backend

- El estado React de imágenes es la única fuente enviada; no depende de `DataTransfer`.
- Selección acumulativa, selección múltiple, drag/drop, eliminación, reselección, MIME, 5 MiB y máximo cinco se validan en cliente.
- El servidor repite MIME, tamaño y cantidad.
- El bloqueo local ocurre antes de iniciar la Server Action; la clave permanece estable al reintentar.
- Solo `ready` aparece en Mi COA y moderación.
- La confirmación usa `enviado=1` consistentemente.
- Operaciones masivas son repetibles, autorizadas en servidor y reportan resultados parciales.

## Pruebas realizadas

- TypeScript: `tsc --noEmit --incremental false`, correcto.
- ESLint: `eslint .`, correcto.
- Pruebas focales: 44/44 correctas en 5 archivos (incluidas dentro de la ejecución final).
- Suite completa: 669/669 correctas en 100 archivos.
- `git diff --check`: correcto; solo avisos informativos LF/CRLF.
- Se añadieron pruebas para acumulación, drag/drop, eliminación/reselección, archivos inválidos, clics repetidos, concurrencia, reintento, títulos iguales, compensación fallida de Storage, recuperación, archivado, restauración, permisos y propiedades de la migración.
- Los cuatro escenarios de moderación (`uploading`, `failed`, `ready` y archivado) están cubiertos como contrato estático del SQL. No equivalen a ejecutar la función dentro de PostgreSQL.

No se ejecutó la migración contra PostgreSQL. El entorno no contiene Supabase CLI, `psql` ni Docker, y no se usaron credenciales remotas.

## Preflight obligatorio

Ejecutar primero en staging o una rama de Supabase. Supabase recomienda probar migraciones en un entorno local/aislado y desplegarlas mediante su sistema de migraciones, no mediante cambios manuales desconectados del historial: [Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations) y [Deployment & Branching](https://supabase.com/docs/guides/deployment).

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema='public' and table_name in ('student_projects','profiles')
  and column_name in ('id','author_id','status','created_at','updated_at');

select proname, prosecdef, proconfig
from pg_proc join pg_namespace n on n.oid=pronamespace
where n.nspname='public' and proname in ('is_admin','moderate_student_project');

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname='public' and tablename in ('student_projects','student_project_images');

select count(*) as projects, pg_size_pretty(pg_total_relation_size('public.student_projects')) as total_size
from public.student_projects;
```

Confirmar que `profiles.id`, `student_projects.id` y `author_id` son `uuid`; que `updated_at` existe; que los estados actuales son compatibles; y que no existe una modificación remota no reflejada en las migraciones.

## Auditoría de la base de datos real de producción

### Fuente y alcance de la evidencia

Las consultas fueron ejecutadas manualmente por el propietario desde el SQL Editor de Supabase y sus resultados fueron proporcionados para esta revisión. El asistente **no se conectó a producción**. Por tanto, lo siguiente distingue resultados comprobados por el usuario, comprobaciones locales e inferencias.

### Resultados comprobados manualmente en producción

- `student_projects` tiene 15 columnas y todavía no contiene las cuatro columnas nuevas.
- `profiles.id`, `student_projects.id` y `student_projects.author_id` son `uuid NOT NULL`.
- `status` es `text NOT NULL`; `created_at` y `updated_at` son `timestamptz NOT NULL`.
- Existen `is_admin()` y `moderate_student_project()`, ambas propiedad de `postgres`, `SECURITY DEFINER` y con `search_path=""`. Sus definiciones completas fueron aportadas posteriormente y coinciden con las migraciones base del repositorio.
- Existen las nueve políticas RLS esperadas entre proyectos e imágenes.
- La política UPDATE limita la fila al autor, permite como estado de origen `draft`, `pending` o `rejected`, y exige como resultado `draft` o `pending` con `moderated_by IS NULL`.
- `authenticated` solo tiene UPDATE sobre `course_id`, `description`, `github_url`, `rejection_reason`, `status`, `technologies`, `title` y `youtube_id`; no sobre autor ni columnas de moderación.
- Existen los cuatro índices históricos esperados y ninguno de la migración nueva.
- Las restricciones y claves foráneas informadas coinciden con el esquema base del repositorio.
- Hay 82 proyectos y la relación completa, incluidos índices, ocupa aproximadamente 152 KB.

### Comparación y conclusiones

- Los tipos reales son compatibles con `submission_key uuid`, `admin_archived_by uuid references profiles(id)` y los parámetros UUID de las funciones nuevas.
- `updated_at` existe, por lo que las funciones pueden actualizarlo.
- No hay colisiones de nombres detectadas para columnas o índices nuevos.
- El resultado aportado dice “nueve restricciones”, pero enumera diez nombres. La discrepancia parece de conteo, no de estructura, y debe confirmarse con la consulta de `pg_constraint` indicada abajo.
- El índice único parcial no incluye filas históricas porque todas tendrán `submission_key IS NULL`.
- El backfill de 82 filas a `upload_state='ready'`, la validación de restricciones y la construcción de índices sobre 152 KB deberían ser operaciones breves. Esto es una inferencia técnica, no una medición en producción.
- La política UPDATE existente es compatible con el flujo porque el cambio de `upload_state` ocurre mediante una función restringida y `SECURITY DEFINER`; la recuperación elimina únicamente una fila propia mediante la política DELETE ya existente.
- El permiso histórico sobre `status` permite al autor alternar entre `draft` y `pending` mientras `moderated_by` sea nulo, pero no publicar. Un proyecto realmente moderado normalmente tiene `moderated_by`, por lo que no puede ser reabierto mediante esa política. Es un comportamiento preexistente, no ampliado por la migración.
- `rejection_reason` puede ser escrito por el autor solamente cuando el `WITH CHECK` completo se cumple. Esto puede permitir texto propio en un proyecto no moderado, pero no concede publicación, archivo, cambio de autor ni modificación de moderación. Es un riesgo preexistente de integridad semántica, de gravedad baja/media, fuera del cambio solicitado.
- El cuerpo real de `moderate_student_project()` no filtra por `upload_state` ni `admin_archived_at`. Esto permite moderación directa de proyectos incompletos por cualquier administrador autorizado a ejecutar el RPC. La migración la reemplaza conservando exactamente su firma, validación de administrador, estados admitidos, tratamiento del motivo y campos de auditoría; solo restringe el `WHERE` a proyectos `ready` no archivados.
- Un proyecto `uploading`, `failed` o archivado provoca `project unavailable`; un proyecto `ready` no archivado conserva el comportamiento productivo anterior.

### Diferencias no resueltas y consultas pendientes

Los cuerpos y propietarios de `is_admin()` y `moderate_student_project()` ya fueron comprobados manualmente. Falta confirmar ACL efectivas, definición de la política DELETE y grants INSERT/DELETE. Ejecutar manualmente, en solo lectura:

```sql
select n.nspname as schema_name,
       p.proname,
       pg_get_userbyid(p.proowner) as owner,
       p.prosecdef,
       p.proconfig,
       pg_get_functiondef(p.oid) as definition,
       aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) as acl
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname in ('is_admin','moderate_student_project');

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname='public'
  and tablename in ('student_projects','student_project_images')
order by tablename, policyname;

select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema='public'
  and table_name in ('student_projects','student_project_images')
  and grantee in ('anon','authenticated')
order by table_name, grantee, privilege_type, column_name;

select grantee, privilege_type
from information_schema.role_table_grants
where table_schema='public'
  and table_name in ('student_projects','student_project_images')
  and grantee in ('anon','authenticated')
order by table_name, grantee, privilege_type;

select conname, contype, pg_get_constraintdef(oid, true) as definition
from pg_constraint
where conrelid='public.student_projects'::regclass
order by conname;
```

Estas consultas no prueban la migración: solo completan la comparación del esquema y permisos actuales.

## Aplicación segura

1. Crear backup/snapshot recuperable y verificar Point-in-Time Recovery según el plan.
2. Probar toda la cadena de migraciones en staging con una copia anonimizada o esquema equivalente.
3. Ejecutar `supabase migration list` y resolver divergencias antes de aplicar.
4. Aplicar **primero** la migración versionada con `supabase db push`; no pegar una copia distinta en SQL Editor. Supabase registra qué archivos ya fueron aplicados y advierte que los cambios manuales pueden desincronizar el historial.
5. Verificar columnas, restricciones, índices, funciones, grants y trigger.
6. Desplegar inmediatamente el código de aplicación. El trigger mantiene compatible el código anterior durante ese intervalo.
7. Probar con cuentas separadas de estudiante y administrador: crear con 0/1/5 imágenes, doble envío, archivar, restaurar, aprobar y rechazar.
8. Confirmar que anon solo lee `published`, que un estudiante no ejecuta archivado y que no puede escribir columnas administrativas ni `upload_state`.
9. Vigilar logs `project_insert`, `project_finalize`, `cleanup_storage`, `cleanup_project` y `archiving`.

## Recuperación

Si `supabase db push` falla, no marcar la migración como aplicada sin comparar el esquema real. La documentación de Supabase explica que el runner normal registra migraciones y que ejecuciones sin transacción pueden dejar cambios parciales; este archivo no desactiva transacciones y además es reejecutable: [Local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows) y [partial migrations](https://supabase.com/kb/troubleshooting/partial-migrations-and-schema-inconsistencies-from-embedded-transactions).

Antes de que existan publicaciones nuevas, el rollback lógico es:

1. Revertir el despliegue de aplicación.
2. Restaurar la definición productiva anterior de `moderate_student_project()` documentada en esta auditoría.
3. Eliminar el trigger y las dos funciones nuevas.
4. Eliminar los dos índices y las restricciones nuevas.
5. Eliminar las cuatro columnas nuevas.
6. Verificar recuentos de proyectos e imágenes.

Si ya existen publicaciones creadas con la versión nueva, **no eliminar columnas ni funciones directamente**. Primero detener nuevas publicaciones, exportar las filas afectadas (`submission_key is not null` o `admin_archived_at is not null`), corregir/revertir la aplicación y preparar una migración de rollback específica que preserve dichos registros. Nunca borrar objetos de Storage basándose solo en prefijos sin reconciliarlos con `student_project_images`.

## Verificaciones no realizadas

- Estado y versión reales de PostgreSQL/Supabase en producción.
- ACL efectivas de las funciones desplegadas.
- Ejecución real de la migración y duración de bloqueos.
- Tamaño/volumen real de `student_projects` e índices.
- Políticas o hotfixes creados manualmente fuera del repositorio.
- Pruebas RLS con JWT reales de anon, estudiante y admin.
- Fallos reales de red entre Storage y Postgres.

## Veredicto

**APTO CON CONDICIONES**: la estructura, volumen, índices, restricciones, política UPDATE y funciones reales informadas desde producción son compatibles con la migración corregida. La vulnerabilidad de moderar proyectos incompletos queda cerrada en base de datos. Todavía debe ejecutarse en una base Supabase aislada equivalente y completarse la inspección de ACL y políticas completas antes de producción.
