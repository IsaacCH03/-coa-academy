# Configuración de Supabase — Fase 1

1. Ejecuta `migrations/20260921000000_create_profiles.sql` en el SQL Editor del proyecto de Supabase o mediante Supabase CLI.
2. Comprueba que **Confirm email** esté activo y que las URL permitidas incluyan el dominio local y el de producción.
3. Registra primero la cuenta que administrará COA y confirma su correo.
4. Asigna el rol desde el SQL Editor con la consulta comentada al final de la migración.

La aplicación usa únicamente la clave pública. La migración impide que los clientes anónimos accedan a perfiles y limita a cada usuario a cambiar solo su propio nombre. El campo `role` no tiene permiso de actualización para usuarios autenticados.

## Protección contra abuso

Supabase aplica límites propios, pero deben revisarse antes de producción:

1. Abre **Authentication → Rate Limits** y ajusta registro/login, recuperación, verificación y envío de correos.
2. Configura SMTP propio para producción y revisa su cuota.
3. En Cloudflare Turnstile crea un sitio para `cursoscoa.com` y el dominio local que usarás para pruebas.
4. Copia únicamente la **site key pública** a `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
5. En Supabase abre **Authentication → Bot and Abuse Protection**, habilita CAPTCHA, selecciona Turnstile y guarda allí la **secret key**. La secret key nunca debe guardarse en este repositorio.
6. Activa CAPTCHA en Supabase solamente después de desplegar la site key pública; de lo contrario los formularios de Auth serán rechazados.

La aplicación envía automáticamente `cf-turnstile-response` a Supabase en registro, login y recuperación cuando la site key está configurada.

## Fase 2 — cursos y matrículas

Después de Fase 1, ejecuta completo `migrations/20260923000000_phase2_courses_enrollments.sql` en el SQL Editor. La migración:

- agrega identificación, país y teléfono opcionales a los perfiles existentes;
- crea `courses` y `enrollments` con RLS;
- registra por slug los nueve cursos del catálogo actual;
- deja `programacion-con-ia` en borrador mientras continúa marcado como próximamente;
- no modifica ni elimina datos históricos de formularios externos.

Al terminar deben existir nueve filas en `public.courses`. Las cuentas existentes conservan sus perfiles y completan los nuevos datos únicamente al realizar su primera matrícula.
## Fase 3B — entregas internas

Después de Fase 2, ejecuta completo `migrations/20260924000000_phase3b_submissions.sql`. Esta migración registra las 73 actividades y sus rúbricas, crea las entregas con RLS y configura el bucket privado `academic-submissions` con límite de 10 MB.

La aplicación no usa `service_role`. Estudiantes con matrícula activa pueden consultar y reemplazar únicamente su propia entrega; administradores pueden consultar todas y generar descargas firmadas de corta duración. La migración debe aplicarse en Supabase antes de probar cargas reales.