# Verificación del IDE COA contra el requerimiento original

Esta revisión conserva la implementación previa y contrasta las 44 partes del documento original. La configuración externa de GitHub es la única activación pendiente de credenciales; COA IA permanece intencionalmente como «Próximamente».

Al retomar ya estaban implementados la ruta, el acceso desde la portada, el editor, el runtime, Builder, ejercicios, persistencia y la integración GitHub. Se completaron los selectores nativos, la preferencia de consola contraída, el autocompletado básico y la explicación visual de while. Se corrigieron la inserción a mitad de línea, la conservación de cambios concurrentes, los límites de las solicitudes GitHub y la compatibilidad del cargador de Monaco. Se ampliaron las pruebas de los flujos existentes sin reemplazarlos.

| Requisitos originales | Implementación y evidencia |
| --- | --- |
| 1, 35: botón en el hero | Tercer enlace `/ide`, blanco con azul, badge Nuevo, responsive y sin precargar runtimes. Playwright comprueba la navegación desde la portada. |
| 2–4, 10, 27–28, 34: interfaz/editor | Monaco con Python, autocompletado básico, pestañas, barra de acciones en español, volver a COA, paneles, colores de COA, bienvenida descartable, estados y vistas móviles. |
| 5–6, 36, 38–39: ejecución/consola | Pyodide en Worker, entrada integrada mediante memoria compartida, stdout/stderr como texto, errores reales, detener/recrear, consola ajustable, maximizable y contraíble. Pruebas reales de Python, input vacío/Unicode, bucles e imports. |
| 7–9, 26: archivos/guardado/descargas | Archivos/carpetas, rutas anidadas, edición, renombrado, eliminación confirmada, selectores nativos de solo lectura y fallback, IndexedDB, preferencias, nuevo proyecto confirmado, archivo y ZIP. Se conservan imports/cambios que terminan después de iniciar una ejecución. |
| 11–18, 31–33: Builder | Catálogo modular de 21 acciones, búsqueda/categorías, formularios, nombres validados, texto escapado, detección de variables, operadores explicados, if/else/elif/match, ciclos, listas y funciones. Vista previa e inserción con selección/indentación; no rompe una expresión si el cursor está a mitad de línea. Compilación de los generadores predeterminados en Python real. |
| 19: niveles de ayuda | Guiado (formularios), Asistido (plantillas) y Libre (editor sin intervención). Preferencia persistida y verificada al recargar. |
| 20–21, 29, 36–37: ayudas | Explicaciones por reglas, fallback honesto para sintaxis desconocida, sugerencias de posibles errores, mensajes sobre Tkinter y errores reales sin ocultarlos ni corregir automáticamente. |
| 22–23: ejercicios | Tres ejercicios demo configurables, archivos nuevos, pruebas con entrada/stdout, resultados por caso, límite de tiempo y pistas progresivas sin revelar soluciones. |
| 24: IA | Panel y contrato de servicio preparados; no hay llamadas ni botones de IA simulados. |
| 25: GitHub | OAuth/PKCE, cookie de sesión cifrada HttpOnly, creación público/privado, subida con commit y sin force-push, importación, desconexión y UI sin configurar. Pruebas con servicios simulados para no escribir en cuentas reales. El consentimiento/callback con una cuenta real requiere las credenciales indicadas en `.env.example`. |
| 30, 40–44: arquitectura/calidad | Responsabilidades separadas en componentes, servicios y generadores; pruebas unitarias, navegador, lint, typecheck y build. Documentación en `docs/ide.md`. Se conservan páginas y funcionalidades existentes. |

## Límites explícitos de esta versión

- La detección de variables y las explicaciones son aproximaciones por patrones; no son un analizador completo de Python ni IA.
- Persistencia local no equivale a copia de seguridad en la nube. La interfaz informa cuando el navegador no puede guardar.
- Solo se editan/importan archivos de texto compatibles; el selector comunica las omisiones de archivos binarios y carpetas de herramientas.
- Se necesita conexión inicial para descargar Python y Monaco. Pyodide no proporciona Tkinter ni un sistema operativo de escritorio.
- Las operaciones reales de GitHub se activan al configurar la OAuth App; no se han publicado archivos durante la implementación.

Los comandos reproducibles y las variables de despliegue están en `docs/ide.md`. Los tests del navegador están en `e2e/`, separados de Vitest.

## Resultado de la verificación

- Vitest: 13 suites, 63 tests aprobados, incluidos los tests anteriores del sitio.
- Playwright sobre `next start` tras el build: 5 pruebas completas aprobadas con Chromium y Pyodide reales. Se comprobaron los tres ejercicios, los 21 generadores, errores educativos, entrada vacía/Unicode, cancelación, archivos y preferencias, descargas, portada y móvil.
- `npm run lint`, `npm run typecheck` y `npm run build`: aprobados. Build con 61 páginas generadas.
- Revisión visual de capturas de escritorio y móvil: editor y consola visibles, sin desbordamiento horizontal.
- OAuth y GitHub remoto: pruebas locales de endpoints con respuestas simuladas; pendiente únicamente la configuración y comprobación con una cuenta real del propietario.
