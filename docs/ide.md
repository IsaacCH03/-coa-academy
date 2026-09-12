# COA Python Studio

El acceso está en `/ide`, desde el botón **Abrir IDE Online** del hero. No se descarga Monaco ni Pyodide desde la portada.

## Desarrollo y validación

```sh
npm install
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

Para pruebas reales de navegador, inicia el servidor en `http://127.0.0.1:3000`, instala Chromium con `npx playwright install chromium` y ejecuta `npx playwright test`. Estas pruebas requieren acceso a jsDelivr para descargar Python y Monaco. Las pruebas de Vitest no requieren esas descargas.

## Arquitectura

- `components/ide/ide-app.tsx`: coordinación del espacio de trabajo. Toolbar, editor, consola, explorador, Builder, ejercicios y GitHub son componentes separados.
- `lib/ide/project.ts`: tipos, límites, validación de rutas, creación, renombrado, eliminación y recuperación de proyectos.
- `lib/ide/persistence.ts` y `components/ide/use-project.ts`: IndexedDB, recuperación inicial, guardado tras 250 ms sin cambios, escrituras serializadas y guardado al cambiar de visibilidad. Ctrl+S guarda manualmente. Los fallos se muestran; nunca se afirma que se guardó si IndexedDB falló.
- `lib/ide/runtime.ts`: administra el Worker, estados, entrada y cancelación. `public/ide/python-worker.js` carga Pyodide 0.27.7 desde una URL versionada. Python se ejecuta **en el navegador**, no en el servidor.
- `lib/ide/downloads.ts`: descarga texto y ZIP con JSZip, conservando carpetas.

Antes de cada ejecución se sincroniza el proyecto a `/home/coa`, se restablece el directorio de trabajo y se invalidan los módulos propios importados. La raíz del proyecto y la carpeta del archivo ejecutado están en `sys.path`. Al terminar se recuperan los archivos de texto creados/modificados por Python. Durante la ejecución el editor y las operaciones de archivos están bloqueados para evitar sobrescrituras.

La consola muestra stdout/stderr como texto, limita la salida a 200.000 caracteres y agrupa los mensajes. `input()` utiliza un SharedArrayBuffer; el Worker espera con Atomics mientras la interfaz recibe la respuesta. `/ide` y su Worker reciben COOP/COEP para habilitar ese mecanismo. Se requiere HTTPS o localhost y un navegador moderno. No eliminar esos headers en el hosting. La página principal y los cursos no reciben dichos headers.

**Detener** termina el Worker incluso en un bucle infinito. **Recargar Python** crea un entorno nuevo para volver a ejecutar. La carga tiene un límite de 90 segundos y puede reintentarse. Los casos de ejercicios tienen un máximo de 10 segundos por caso.

## Extender el Builder y los ejercicios

En `lib/ide/builder.ts`, agrega una entrada a `actions` con `id`, título, categoría, explicación, campos, plantilla del modo Asistido y generador del modo Guiado. El formulario, búsqueda, categorías y vista previa se generan desde esos datos. Usa `quote()` para los textos y validaciones de campos para nombres/números. Las expresiones se incorporan como código Python de una línea; no se evalúan en JavaScript. Añade pruebas del generador. `lib/ide/insertion.ts` calcula la edición sobre cursor/selección y la indentación; Monaco conserva el historial para Ctrl+Z.

Los nombres sugeridos se detectan mediante asignaciones de texto, sin ejecutar código. Es una ayuda aproximada, no un analizador de ámbitos. `education.ts` contiene explicaciones y posibles problemas basados en reglas. Nunca corrige automáticamente ni afirma comprender estructuras desconocidas.

Para añadir ejercicios, agrega un objeto a `lib/ide/exercises.ts` con descripción, archivo inicial, pasos, pistas y casos de entrada/stdout esperado. El botón de comprobación ejecuta el archivo activo; se omiten los mensajes de `input()` en esta modalidad para comparar la salida real de `print()`. Se comprueba el resultado completo, no una coincidencia parcial. Las casillas del plan son una autoevaluación del alumno y no una calificación automática. Los ejercicios se crean en un archivo nuevo, conservando el trabajo anterior.

`lib/ide/ai.ts` define el contrato de un tutor futuro. No existe una conexión a IA ni se envía código a un proveedor. El panel muestra **Próximamente**.

## Diseñador visual mínimo

La opción **Diseñador**, debajo de Ejercicios, abre una vista propia dentro del Studio. `components/ide/gui-designer.tsx` contiene la paleta, el lienzo y las propiedades; `lib/ide/gui-designer.ts` define el modelo sencillo, los límites y la generación de código. Permite únicamente Label, Entry, Button y Frame, con posición absoluta, tamaño, nombre y texto cuando corresponde. Los botones generan código COA GUI o Tkinter y permiten copiarlo. La sincronización es solo del diseño hacia el código; no analiza archivos Python ni implementa eventos, estilos, ventanas adicionales o una librería `coa_gui` ejecutable.

## GitHub (opcional)

El IDE funciona sin configurar GitHub. Para activar la integración:

1. Registra una **OAuth App** en GitHub con callback `https://cursoscoa.com/api/ide/github/callback` (para desarrollo, usa una app separada con `http://localhost:3000/api/ide/github/callback`).
2. Copia `.env.example` a `.env.local` y completa `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `COA_APP_URL` y `COA_SESSION_SECRET`. En producción, configúralas como secretos del hosting; ninguna lleva prefijo `NEXT_PUBLIC_`.
3. Genera `COA_SESSION_SECRET` con al menos 32 caracteres aleatorios; por ejemplo `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. Reinicia el servidor y conecta una cuenta desde el panel GitHub. La URL configurada debe coincidir con el origen donde se abre el IDE.

La integración usa OAuth con `state` y PKCE S256, intercambio del código exclusivamente en servidor, token cifrado con AES-256-GCM en cookie HttpOnly/SameSite=Lax/Secure en HTTPS (caduca en 8 horas) y verificación de Origin en escrituras. No guarda tokens en IndexedDB, localStorage ni JavaScript del cliente. El Worker tiene CSP que impide acceder a los endpoints del mismo origen. El scope `repo` permite trabajar con repositorios públicos/privados; el consentimiento se muestra en GitHub.

Se permite crear un repositorio privado o público, subir/actualizar archivos mediante un commit atómico sin force-push e importar archivos de texto de la rama por defecto. La subida pide confirmación y **conserva archivos remotos que no están en el proyecto local**; no sincroniza eliminaciones. Los conflictos concurrentes no se sobrescriben. Los repositorios existentes deben tener al menos un commit. Un fallo después de crear un repositorio puede dejarlo creado: vuelve a intentar usando ese repositorio existente. Desconectar elimina la sesión local; para revocar la autorización completa, usa las aplicaciones autorizadas de GitHub.

La conexión a una cuenta y las escrituras reales se deben verificar con las credenciales del propietario; no se realizan automáticamente durante las pruebas. Las pruebas cubren cifrado, caducidad, CSRF, inicio OAuth/PKCE, importación, commits que conservan archivos remotos, conflictos y el estado sin configurar mediante respuestas simuladas de GitHub.

## Límites conocidos

- Proyecto de texto: `.py`, `.txt`, `.csv`, `.json`, `.md`; máximo 300 entradas, 1 MB por archivo y 8 MB por proyecto. Importación GitHub: hasta 200 archivos. El ZIP incluye carpetas vacías; GitHub no representa carpetas vacías.
- Se usan `showOpenFilePicker` y `showDirectoryPicker` cuando están disponibles, con selectores de archivos y `webkitdirectory` como alternativa. La lectura es local y no modifica los originales. Se comunican las omisiones de archivos incompatibles y carpetas de herramientas; se rechazan rutas repetidas sin reemplazar parcialmente el proyecto.
- IndexedDB pertenece al navegador y dispositivo actuales. No es una copia de seguridad en la nube: borrar los datos del sitio o el modo privado puede eliminarlo. Un cierre abrupto antes de completar el guardado puede perder los últimos cambios. Usa ZIP o GitHub para respaldos.
- Pyodide ofrece la biblioteca estándar compatible con WebAssembly; no equivale a una instalación de escritorio. Tkinter, subprocess, servidores TCP y paquetes nativos de sistema no se soportan. No se instala automáticamente ningún paquete de terceros. Los archivos binarios generados no se recuperan en el explorador.
- Se recomienda computadora para editar cómodamente; móvil mantiene acceso, paneles superpuestos, acciones compactas y consola ajustable.
- El Worker mantiene la interfaz independiente y restringe la red al CDN mediante CSP. No es una máquina virtual de seguridad para código hostil ni una protección contra agotar la memoria del navegador: ejecuta código propio o de confianza.

Referencias: [Pyodide streams](https://pyodide.org/en/0.27.7/usage/streams.html), [Pyodide Worker](https://pyodide.org/en/0.27.7/usage/webworker.html), [Monaco React](https://github.com/suren-atoyan/monaco-react), [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), [Git trees](https://docs.github.com/en/rest/git/trees).
