# COA — Cursos Online Avanzados

## Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial

# Módulo 6. Proyecto Final Integrador

**Duración aproximada:** 6 horas y 30 minutos  
**Modalidad:** proyecto profesional individual  
**Tecnologías:** HTML5, CSS3, JavaScript ES6+, React, Next.js, Tailwind CSS, Git, GitHub, Vercel y herramientas de inteligencia artificial  
**Resultado principal:** una aplicación web moderna, funcional, accesible, documentada y publicada

---

## Bienvenida

Este módulo no introduce una nueva tecnología. Su propósito es demostrar que puedes combinar lo aprendido para resolver un problema completo.

Durante el curso construiste:

- interfaces semánticas con HTML;
- diseños adaptables con CSS;
- comportamiento con JavaScript;
- componentes e interacción con React;
- rutas, layouts y páginas con Next.js;
- estilos con Tailwind CSS;
- historial y publicación con Git, GitHub y Vercel;
- un proceso profesional de desarrollo asistido por inteligencia artificial.

Ahora reunirás esas capacidades en una aplicación propia.

```text
Problema real
     ↓
Alcance y requisitos
     ↓
Diseño de la experiencia
     ↓
Arquitectura
     ↓
Implementación
     ↓
Pruebas y revisión
     ↓
Publicación
     ↓
Defensa técnica
```

El proyecto final no consiste en seguir un tutorial paso a paso. Recibirás requisitos, restricciones, ejemplos y criterios de evaluación, pero las decisiones concretas serán tuyas.

No se evaluará cuántas líneas escribiste ni qué herramienta produjo cada fragmento. Se evaluará si:

- la aplicación resuelve un problema comprensible;
- las funciones principales operan;
- la arquitectura tiene sentido;
- puedes explicar el código;
- utilizaste IA con criterio;
- comprobaste el resultado;
- el proyecto está disponible públicamente.

> **Principio del proyecto final:** una aplicación profesional no es la que contiene más funciones, sino la que cumple con claridad un alcance útil, estable y verificable.

---

## Objetivos del Proyecto Final

Al completar este proyecto demostrarás que puedes:

- Elegir un problema apropiado para una aplicación web.
- Definir un usuario y una necesidad concreta.
- Reducir una idea amplia a un producto mínimo viable.
- Redactar requisitos y criterios de aceptación.
- Organizar contenido, rutas y componentes.
- Crear una aplicación con Next.js App Router.
- Mantener componentes de servidor por defecto.
- Utilizar componentes de cliente solamente donde exista interacción.
- Crear rutas estáticas y dinámicas.
- Representar colecciones de datos.
- Implementar búsqueda, filtros y estados vacíos.
- Mantener estado de React sin mutación.
- Crear valores derivados.
- Persistir una preferencia mediante `localStorage`.
- Diseñar un formulario controlado y validarlo.
- Utilizar Tailwind CSS con enfoque móvil primero.
- Construir navegación semántica y accesible.
- Optimizar imágenes y metadatos.
- Manejar contenido inexistente.
- Probar funciones nuevas y regresiones.
- Diagnosticar errores a partir de evidencias.
- Trabajar mediante ramas y commits significativos.
- Utilizar inteligencia artificial como acelerador.
- Rechazar o modificar sugerencias incorrectas.
- Documentar la aplicación en GitHub.
- Revisar una vista previa antes de producción.
- Publicar en Vercel.
- Presentar y defender decisiones técnicas.

---

# El desafío

Construye una aplicación web moderna que ayude a una persona a **explorar una colección, consultar detalles y tomar una decisión**.

La colección puede estar formada por:

- cursos;
- eventos;
- experiencias turísticas;
- servicios profesionales;
- recursos educativos;
- actividades culturales;
- libros;
- proyectos comunitarios;
- espacios de trabajo;
- rutas de aprendizaje;
- oportunidades de voluntariado;
- otra propuesta aprobada que pueda resolverse dentro del alcance.

La aplicación debe tener datos propios, varias páginas, una experiencia interactiva y una función personal persistente.

## Fórmula del proyecto

```text
Colección
   +
Búsqueda y filtros
   +
Detalles dinámicos
   +
Espacio personal
   +
Formulario validado
   +
Diseño accesible
   +
Publicación
   =
Proyecto Final Integrador
```

## Lo que no es este proyecto

No es:

- una página estática de una sola pantalla;
- un clon visual sin problema definido;
- una aplicación generada completa en un solo prompt;
- un sistema con autenticación;
- una tienda con pagos reales;
- una red social;
- una aplicación con base de datos;
- una integración con una API privada;
- un proyecto que necesita un servidor propio;
- una demostración de una biblioteca de componentes;
- una colección de efectos visuales sin utilidad;
- una versión idéntica del portal construido durante el curso.

Puedes continuar con COA, pero deberás agregar una experiencia final distinta y demostrar decisiones propias.

---

# Opciones de proyecto

Elige una opción. Todas se evalúan con la misma rúbrica.

## Opción A. Planificador de rutas de aprendizaje COA

Amplía el portal COA con una experiencia para:

- explorar cursos;
- filtrar por categoría, nivel o duración;
- consultar detalles;
- seleccionar cursos;
- construir una ruta ordenada;
- calcular duración total;
- eliminar o reordenar decisiones mediante controles sencillos;
- completar un formulario simulado de interés.

Rutas posibles:

```text
/
├── /cursos
│   └── /cursos/[slug]
├── /mi-ruta
├── /metodologia
└── /contacto
```

No basta con entregar el portal del Módulo 5. La ruta personal, sus reglas, sus estados y el formulario deben constituir una experiencia nueva.

## Opción B. Explorador de experiencias y creador de itinerario

Construye una aplicación para:

- explorar lugares o experiencias;
- filtrar por región, tipo y duración;
- consultar detalles;
- agregar experiencias a un itinerario;
- calcular duración o costo estimado;
- limitar el itinerario mediante una regla documentada;
- completar un formulario simulado de consulta.

Rutas posibles:

```text
/
├── /experiencias
│   └── /experiencias/[slug]
├── /mi-itinerario
├── /acerca
└── /consulta
```

No utilices reservas, pagos ni datos reales.

## Opción C. Agenda de eventos

Construye una aplicación para:

- explorar eventos;
- buscar por nombre;
- filtrar por categoría, fecha o modalidad;
- consultar detalles;
- guardar eventos en una agenda personal;
- detectar o explicar un límite sencillo;
- mostrar un resumen;
- completar una inscripción simulada.

Rutas posibles:

```text
/
├── /eventos
│   └── /eventos/[slug]
├── /mi-agenda
├── /organizacion
└── /inscripcion
```

La inscripción no debe enviar datos a ningún servicio.

## Opción D. Catálogo de servicios y creador de solicitud

Construye una aplicación para:

- explorar servicios;
- filtrar por categoría, modalidad o precio;
- consultar detalles;
- seleccionar servicios;
- obtener un resumen o estimación;
- quitar y limpiar selecciones;
- completar un formulario simulado de solicitud.

Rutas posibles:

```text
/
├── /servicios
│   └── /servicios/[slug]
├── /mi-solicitud
├── /proceso
└── /contacto
```

La estimación debe identificarse como demostrativa. No implementes cobros.

## Opción E. Propuesta propia

Puedes proponer otro tema si cumple estas condiciones:

- existe una colección de al menos ocho elementos;
- cada elemento tiene una página de detalle;
- existe una decisión o selección personal;
- la selección produce un resumen útil;
- existe un formulario relacionado con el problema;
- no requiere autenticación, base de datos ni API privada;
- puede completarse con las tecnologías del curso;
- cumple todos los requisitos comunes.

La originalidad del tema no otorga puntos adicionales. Elige un problema que puedas terminar y explicar.

---

# Requisitos comunes obligatorios

## 1. Problema y usuario

El proyecto debe definir:

- nombre de la aplicación;
- problema;
- usuario principal;
- necesidad;
- solución propuesta;
- límite del producto;
- resultado esperado.

Ejemplo:

```text
Nombre:
Ruta COA

Usuario:
Persona que desea comenzar una formación tecnológica.

Problema:
Encuentra varios cursos, pero no sabe en qué orden estudiarlos
ni cuánto tiempo requiere completar su selección.

Solución:
Explorador con detalles y una ruta personal que calcula
la duración total y conserva la selección.

Fuera del alcance:
Matrícula real, pagos, cuentas y seguimiento académico.
```

## 2. Datos

La colección debe contener al menos ocho elementos.

Cada elemento debe incluir:

```js
{
  id: "item-01",
  slug: "identificador-legible",
  title: "Nombre visible",
  category: "Categoría",
  summary: "Descripción breve",
  description: "Descripción completa",
  image: "/images/example.webp",
  // tres o más propiedades específicas del proyecto
}
```

Requisitos:

- identificadores únicos;
- slugs únicos;
- contenido realista;
- categorías coherentes;
- imágenes propias, libres o correctamente acreditadas;
- datos almacenados en un módulo separado;
- ninguna credencial;
- ningún dato personal real;
- ningún texto de relleno.

## 3. Rutas

La aplicación debe tener como mínimo:

| Ruta | Responsabilidad |
|---|---|
| `/` | Presentar el producto y conducir a la acción principal |
| Ruta de colección | Mostrar búsqueda, filtros y resultados |
| Ruta dinámica `[slug]` | Mostrar el detalle de un elemento |
| Ruta de espacio personal | Mostrar selección, resumen y acciones |
| Ruta informativa | Explicar organización, metodología o proceso |
| Ruta de formulario | Recoger una solicitud simulada |
| Ruta inexistente | Mostrar una página 404 útil |

La ruta de formulario puede integrarse en el espacio personal si la experiencia continúa siendo clara.

## 4. Página de inicio

Debe incluir:

- un único `h1`;
- nombre y propuesta de valor;
- explicación breve del problema;
- llamada a la acción;
- al menos tres elementos destacados;
- enlace a la colección;
- contenido real;
- metadatos específicos.

No llenes la página con secciones repetidas para hacerla parecer extensa.

## 5. Colección

Debe permitir:

- ver todos los elementos;
- buscar por al menos dos campos;
- filtrar por al menos dos criterios;
- combinar búsqueda y filtros;
- conocer la cantidad de resultados;
- limpiar los controles;
- reconocer un estado vacío;
- abrir detalles;
- agregar o quitar elementos del espacio personal.

Los filtros deben resolver el problema del proyecto. No agregues un filtro que siempre produce el mismo resultado.

## 6. Detalles dinámicos

Cada detalle debe:

- obtener el elemento mediante el slug;
- utilizar App Router;
- leer `params` con la forma vigente;
- utilizar `notFound()` cuando no existe;
- mostrar información suficiente;
- utilizar al menos una imagen optimizada;
- enlazar hacia la colección;
- permitir una acción personal;
- generar título y descripción propios;
- funcionar mediante acceso directo y recarga.

Debe existir `generateStaticParams` cuando los datos sean locales y conocidos durante la construcción.

## 7. Espacio personal

El nombre depende del proyecto:

- mi ruta;
- mi agenda;
- mi itinerario;
- mi solicitud;
- mi selección.

Debe:

- guardar identificadores estables;
- impedir duplicados;
- permitir quitar un elemento;
- permitir limpiar;
- persistir mediante `localStorage`;
- restaurar la información al recargar;
- obtener elementos completos como valor derivado;
- mostrar un resumen;
- tener al menos una regla o límite;
- explicar estados vacío, parcial, completo y límite;
- funcionar con teclado.

Ejemplos de resumen:

- duración total;
- costo estimado;
- cantidad por categoría;
- número de actividades;
- modalidad;
- nivel de avance.

No almacenes dos copias de la misma información.

```text
Datos originales + identificadores guardados
                     ↓
               selección derivada
                     ↓
                  resumen
```

## 8. Formulario controlado

El formulario debe incluir:

- al menos tres campos;
- etiquetas visibles;
- un campo requerido;
- validación propia;
- mensajes de error;
- estado de envío simulado;
- confirmación útil;
- botón con tipo correcto;
- funcionamiento mediante teclado;
- prevención del envío si existen errores.

El formulario no debe transmitir datos.

Incluye una indicación visible:

> Formulario demostrativo. La información no será enviada.

Utiliza datos ficticios durante las pruebas.

## 9. React

La aplicación debe demostrar:

- componentes reutilizables;
- propiedades;
- estado;
- eventos;
- renderizado condicional;
- listas con claves estables;
- formulario controlado;
- actualización inmutable;
- valores derivados;
- efectos solamente cuando se sincroniza con un sistema externo;
- persistencia en `localStorage`.

No utilices:

- manipulación directa del DOM;
- índices como claves permanentes;
- mutación del estado;
- efectos para calcular valores que pueden derivarse;
- estado duplicado;
- componentes gigantes sin responsabilidad clara.

## 10. Next.js

Debe utilizar:

- proyecto actual de Next.js;
- App Router;
- JavaScript;
- `page.js`;
- `layout.js`;
- `Link`;
- ruta dinámica;
- componentes de servidor por defecto;
- fronteras de cliente limitadas;
- `not-found.js`;
- `loading.js` donde aporte valor;
- API de metadatos;
- `next/image`;
- construcción de producción.

No utilices:

- Pages Router;
- carpeta `pages`;
- `getServerSideProps`;
- `getStaticProps`;
- React Router;
- todo el sitio como componente de cliente.

## 11. Tailwind CSS

Debe demostrar:

- enfoque móvil primero;
- escala consistente de espacios;
- jerarquía tipográfica;
- colores coherentes;
- estados `hover` y `focus`;
- diseño adaptable;
- grillas o Flexbox cuando corresponda;
- componentes visualmente relacionados;
- estado vacío;
- mensajes de error y confirmación;
- diseño desde 320 píxeles.

No construyas clases mediante fragmentos como:

```jsx
className={`bg-${color}-600`}
```

Utiliza nombres completos que puedan detectarse durante la construcción.

## 12. Accesibilidad

Requisitos mínimos:

- `<html lang="es">`;
- encabezados en orden lógico;
- un `h1` por página;
- navegación semántica;
- enlaces para navegación;
- botones para acciones;
- campos con etiquetas;
- texto alternativo correcto;
- controles con nombre accesible;
- foco visible;
- orden de tabulación lógico;
- ausencia de trampas de teclado;
- contraste suficiente;
- información no dependiente solamente del color;
- mensajes comprensibles;
- zoom sin pérdida esencial;
- interfaz utilizable a 320 píxeles.

Una puntuación automática no sustituye la prueba manual.

## 13. Estados de la experiencia

La aplicación debe representar:

- carga cuando corresponda;
- colección completa;
- resultados filtrados;
- búsqueda sin resultados;
- espacio personal vacío;
- espacio personal con elementos;
- límite alcanzado;
- formulario con errores;
- formulario confirmado;
- elemento inexistente;
- ruta inexistente.

Una interfaz profesional explica qué ocurre y qué puede hacer el usuario.

## 14. Imágenes

- Utiliza `Image` para imágenes de contenido.
- Incluye dimensiones o una estrategia de tamaño apropiada.
- Evita deformación.
- Utiliza texto alternativo que describa propósito.
- Usa texto alternativo vacío para imágenes puramente decorativas.
- No marques todas las imágenes como prioritarias.
- Comprime los archivos.
- Documenta procedencia y licencia cuando no sean propias.

## 15. Metadatos

- Título base y plantilla.
- Descripción general.
- Títulos diferentes por ruta.
- Descripciones específicas.
- Metadatos dinámicos en los detalles.
- Título útil para página inexistente cuando corresponda.

No repitas la misma descripción en todas las páginas.

## 16. Calidad del código

- Nombres claros.
- Responsabilidades identificables.
- Datos separados de la interfaz.
- Componentes organizados por función.
- Sin código muerto.
- Sin registros de depuración en producción.
- Sin comentarios que contradigan el código.
- Sin dependencias innecesarias.
- Sin advertencias evitables.
- ESLint correcto.
- Construcción correcta.

## 17. Git y GitHub

- Repositorio disponible.
- Rama principal estable.
- Al menos una rama de trabajo.
- Mínimo diez commits significativos.
- Mensajes claros.
- Sin `node_modules`.
- Sin `.env`.
- README completo.
- Historial que muestre etapas.
- Enlace público de producción.

## 18. Vercel

- Vista previa de una rama.
- Pruebas en vista previa.
- Producción desplegada.
- Dirección pública funcional.
- Rutas directas comprobadas.
- Recargas comprobadas.
- Sin errores activos.
- Versión de producción identificable.

## 19. Uso profesional de inteligencia artificial

Debes utilizar ChatGPT, Claude o GitHub Copilot durante el proyecto.

La IA debe apoyar al menos seis tareas:

1. Revisión del alcance.
2. Revisión de arquitectura.
3. Implementación acotada.
4. Diagnóstico de un problema real.
5. Revisión de código o accesibilidad.
6. Apoyo para documentación basada en hechos.

Debes:

- escribir primero tu problema y criterios;
- entregar contexto seguro;
- dividir las solicitudes;
- revisar los cambios;
- comprobar el código;
- registrar decisiones;
- modificar o rechazar al menos dos propuestas;
- identificar al menos una limitación de la herramienta.

No debes:

- solicitar la aplicación completa;
- entregar código que no entiendes;
- inventar pruebas;
- publicar conversaciones con datos privados;
- compartir credenciales;
- aceptar una dependencia sin justificarla;
- usar IA como sustituto de la defensa técnica.

---

# Restricciones generales

El proyecto final no debe incluir:

- TypeScript;
- Redux;
- Bootstrap;
- jQuery;
- PHP;
- base de datos;
- autenticación;
- pagos;
- panel administrativo;
- correo real;
- API de inteligencia artificial;
- APIs privadas;
- secretos;
- bibliotecas de componentes;
- configuraciones avanzadas de Next.js;
- animaciones que bloqueen la interacción;
- funciones fuera de los contenidos del curso.

Si una idea requiere alguna de estas tecnologías, reduce el alcance.

---

# Distribución de las 6 horas y 30 minutos

| Fase | Tiempo aproximado |
|---|---:|
| 1. Selección del problema y alcance | 30 minutos |
| 2. Requisitos, contenido y experiencia | 35 minutos |
| 3. Arquitectura y preparación | 30 minutos |
| 4. Rutas, datos e interfaz principal | 110 minutos |
| 5. Interacción, persistencia y formulario | 65 minutos |
| 6. Accesibilidad, pruebas y correcciones | 40 minutos |
| 7. Documentación, vista previa y producción | 45 minutos |
| 8. Verificación final y defensa | 35 minutos |
| **Total** | **6 horas y 30 minutos** |

El tiempo comienza cuando ya tienes instaladas las herramientas utilizadas durante el curso. Si necesitas más tiempo para corregir, prioriza completar el núcleo antes de agregar mejoras.

---

# Fase 1. Selección del problema y alcance

## 1.1 Redacta el resumen del producto

Completa:

```text
NOMBRE:

USUARIO:

PROBLEMA:

SOLUCIÓN:

ACCIÓN PRINCIPAL:

COLECCIÓN:

ESPACIO PERSONAL:

RESUMEN QUE GENERA:

FORMULARIO:

FUERA DEL ALCANCE:
```

## 1.2 Define el producto mínimo viable

Clasifica ideas:

| Esencial | Deseable | Fuera del alcance |
|---|---|---|
| Necesario para resolver el problema | Mejora si queda tiempo | No se construirá |

Ejemplo:

| Esencial | Deseable | Fuera del alcance |
|---|---|---|
| Buscar cursos | Ordenar selección | Cuentas de usuario |
| Filtrar por nivel | Compartir por texto | Pagos |
| Abrir detalles | Tema oscuro | Certificados automáticos |
| Crear ruta | Pequeña animación | Base de datos |

Todo elemento “deseable” puede eliminarse sin invalidar el proyecto.

## 1.3 Historias de usuario

Escribe al menos cinco:

```text
Como [tipo de usuario],
quiero [acción],
para [beneficio].
```

Ejemplo:

```text
Como persona que inicia en tecnología,
quiero filtrar cursos por nivel,
para evitar opciones que todavía no corresponden a mi experiencia.
```

## 1.4 Criterios de aceptación

Escribe al menos doce.

Utiliza:

```text
Dado [estado],
cuando [acción],
entonces [resultado].
```

Ejemplo:

```text
Dado que existen tres elementos en mi ruta,
cuando intento agregar un cuarto que supera el límite definido,
entonces la selección se conserva y aparece una explicación.
```

## 1.5 Revisión asistida

Después de redactar el alcance, pide a una IA:

```text
Revisa este alcance para una aplicación final de 6 horas y 30 minutos.
No agregues funciones.

Identifica:
- requisito ambiguo;
- función demasiado grande;
- caso límite ausente;
- parte que requiere una tecnología fuera del curso;
- criterio difícil de comprobar.

Propón solamente reducciones o aclaraciones.

[alcance]
```

La decisión final es tuya. Registra qué aceptaste y qué rechazaste.

## Salida de la fase

- resumen del producto;
- tabla de alcance;
- cinco historias;
- doce criterios;
- primera interacción de IA;
- lista de datos necesarios.

---

# Fase 2. Requisitos, contenido y experiencia

## 2.1 Mapa de rutas

Dibuja:

```text
/
├── /coleccion
│   └── /coleccion/[slug]
├── /mi-seleccion
├── /informacion
└── /formulario
```

Reemplaza los nombres según el proyecto.

Para cada ruta anota:

| Ruta | Objetivo | Contenido | Interacción | Servidor o cliente |
|---|---|---|---|---|

La página puede ser de servidor y contener una isla de cliente.

## 2.2 Inventario de contenido

Prepara antes de diseñar:

- nombre;
- logotipo textual si corresponde;
- propuesta de valor;
- textos de navegación;
- ocho elementos;
- categorías;
- descripciones;
- imágenes;
- mensajes vacíos;
- mensajes de límite;
- errores del formulario;
- confirmación;
- texto de la página informativa.

No diseñes alrededor de `Lorem ipsum`.

## 2.3 Flujos principales

Dibuja tres flujos.

### Explorar

```text
Inicio
  ↓
Colección
  ↓
Búsqueda o filtro
  ↓
Detalle
```

### Decidir

```text
Tarjeta o detalle
       ↓
Agregar
       ↓
Espacio personal
       ↓
Resumen
```

### Solicitar

```text
Espacio personal
       ↓
Formulario
       ↓
Validación
       ↓
Confirmación simulada
```

## 2.4 Bocetos

Crea bocetos sencillos para:

- inicio;
- colección;
- detalle;
- espacio personal;
- formulario;
- móvil.

Ejemplo:

```text
┌────────────────────────────────────────────┐
│ Marca       Inicio  Explorar  Mi selección │
├────────────────────────────────────────────┤
│                                            │
│ Título del producto                        │
│ Explicación breve        [Explorar]        │
│                                            │
├────────────────────────────────────────────┤
│ Destacados                                 │
│ [Tarjeta] [Tarjeta] [Tarjeta]              │
├────────────────────────────────────────────┤
│ Pie                                        │
└────────────────────────────────────────────┘
```

El boceto define jerarquía, no colores finales.

## 2.5 Matriz de estados

| Experiencia | Estado | Mensaje o interfaz |
|---|---|---|
| Colección | Sin filtros | Todos los resultados |
| Colección | Sin coincidencias | Explicación y limpiar |
| Selección | Vacía | Instrucción |
| Selección | Parcial | Resumen provisional |
| Selección | Límite | Explicación |
| Formulario | Error | Mensaje junto al campo |
| Formulario | Correcto | Confirmación |
| Detalle | Inexistente | Página 404 |

## Salida de la fase

- mapa de rutas;
- inventario;
- tres flujos;
- seis bocetos;
- matriz de estados;
- datos completos.

---

# Fase 3. Arquitectura y preparación

## 3.1 Árbol sugerido

```text
src/
├── app/
│   ├── coleccion/
│   │   ├── [slug]/
│   │   │   └── page.js
│   │   ├── loading.js
│   │   └── page.js
│   ├── mi-seleccion/
│   │   └── page.js
│   ├── informacion/
│   │   └── page.js
│   ├── formulario/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   ├── not-found.js
│   └── page.js
├── components/
│   ├── collection/
│   ├── layout/
│   ├── selection/
│   └── ui/
├── data/
│   └── items.js
└── lib/
    └── helpers.js
```

No crees carpetas vacías ni una abstracción que no utilices.

## 3.2 Clasificación servidor-cliente

Ejemplo:

```text
RootLayout — servidor
├── SiteHeader — servidor
├── HomePage — servidor
├── CollectionPage — servidor
│   └── CollectionExplorer — cliente
├── DetailPage — servidor
│   └── PersonalAction — cliente
├── PersonalPage — servidor
│   └── PersonalWorkspace — cliente
├── InformationPage — servidor
└── FormPage — servidor
    └── RequestForm — cliente
```

Una página de servidor puede importar un componente de cliente y entregarle datos serializables.

## 3.3 Flujo de datos

```text
items.js
   │
   ├──► páginas de servidor
   │       ├── destacados
   │       └── detalles
   │
   └──► componentes de cliente
           ├── búsqueda
           ├── filtros
           └── selección

localStorage
   │
   └──► identificadores personales
             │
             └──► elementos derivados
```

## 3.4 Preparación del repositorio

1. Crea o prepara el proyecto.
2. Confirma App Router, JavaScript y Tailwind.
3. Inicializa Git.
4. Crea el repositorio.
5. Realiza una construcción inicial.
6. Crea la rama:

```bash
git switch -c feature/final-project
```

7. Agrega:

```text
docs/
├── PROJECT_BRIEF.md
├── TEST_PLAN.md
└── AI_LOG.md
```

## 3.5 Revisión de arquitectura con IA

Solicita:

```text
Revisa esta arquitectura para Next.js App Router.
El proyecto utiliza JavaScript, Tailwind y datos locales.

No escribas código.
No agregues dependencias.

Comprueba:
- responsabilidad de rutas;
- frontera servidor-cliente;
- ubicación del estado;
- valores derivados;
- persistencia;
- riesgo de duplicación;
- funciones fuera del alcance.

[árbol, flujo y requisitos]
```

Registra tu decisión.

## Salida de la fase

- árbol;
- clasificación;
- flujo;
- repositorio;
- rama;
- construcción inicial;
- documentos;
- segunda interacción de IA.

---

# Fase 4. Rutas, datos e interfaz principal

## 4.1 Construye en vertical

No crees primero todas las páginas vacías.

Completa una experiencia:

```text
Datos
  ↓
Colección
  ↓
Detalle
  ↓
Navegación
  ↓
Prueba
```

Después agrega el espacio personal.

## 4.2 Orden recomendado

1. Datos y utilidades.
2. Layout, encabezado y pie.
3. Inicio.
4. Colección sin interacción.
5. Detalle dinámico.
6. Página informativa.
7. Página 404.
8. Metadatos.
9. Imágenes.
10. Búsqueda y filtros.

## 4.3 Primera versión navegable

Antes de agregar persistencia, confirma:

- todas las rutas abren;
- la navegación utiliza `Link`;
- los detalles corresponden al slug;
- un slug inventado muestra 404;
- la recarga funciona;
- existe contenido real;
- la estructura semántica es correcta.

## 4.4 Implementación asistida limitada

La tercera interacción de IA puede utilizarse para una unidad:

```text
Crea solamente [nombre del componente].

Contexto:
[proyecto y arquitectura]

Entrada:
[propiedades]

Criterios:
[lista]

Restricciones:
- JavaScript;
- sin dependencias;
- no modificar otros archivos;
- HTML semántico;
- Tailwind móvil primero;
- explicar supuestos.

Devuelve:
1. componente;
2. explicación;
3. riesgos;
4. pruebas.
```

Debes revisar:

- importaciones;
- nombres;
- propiedades;
- APIs;
- Tailwind;
- accesibilidad;
- alcance;
- pruebas.

## Punto de control 1. Esqueleto funcional

No continúes hasta comprobar:

- [ ] Inicio completo.
- [ ] Colección visible.
- [ ] Ocho elementos.
- [ ] Detalles dinámicos.
- [ ] Navegación.
- [ ] Página informativa.
- [ ] 404.
- [ ] Metadatos básicos.
- [ ] Diseño móvil básico.
- [ ] Construcción correcta.

---

# Fase 5. Interacción, persistencia y formulario

## 5.1 Búsqueda y filtros

El estado mínimo puede contener:

```js
const [query, setQuery] = useState("");
const [category, setCategory] = useState("all");
const [secondaryFilter, setSecondaryFilter] = useState("all");
```

Los resultados deben derivarse:

```text
items
  ↓ búsqueda
  ↓ categoría
  ↓ segundo filtro
visibleItems
```

No guardes `visibleItems` como estado si se puede calcular.

## 5.2 Selección personal

Guarda identificadores:

```js
const [selectedSlugs, setSelectedSlugs] = useState([]);
```

Deriva:

```js
const selectedItems = items.filter((item) =>
  selectedSlugs.includes(item.slug)
);
```

La actualización debe:

- evitar duplicados;
- no mutar;
- respetar límite;
- permitir quitar;
- utilizar el estado anterior cuando corresponda.

## 5.3 Persistencia

Sincroniza con `localStorage` solamente en cliente.

Decide:

- nombre de la clave;
- formato;
- valor por defecto;
- manejo de datos inválidos;
- momento de lectura;
- momento de escritura.

No guardes información personal del formulario.

## 5.4 Resumen

Ejemplos:

```js
const totalDuration = selectedItems.reduce(
  (total, item) => total + item.durationHours,
  0
);
```

El resumen debe ser:

- correcto;
- derivado;
- comprensible;
- útil para decidir;
- visible en móvil;
- actualizado al quitar.

## 5.5 Formulario

Flujo:

```text
Datos iniciales
      ↓
Escritura
      ↓
Validación
      ├── errores → corregir
      └── correcto
              ↓
      confirmación simulada
```

No utilices alertas como única confirmación.

## 5.6 Diagnóstico asistido

Registra un problema real.

Solicitud:

```text
No propongas una corrección todavía.

Analiza:
- comportamiento esperado;
- comportamiento actual;
- pasos;
- error exacto;
- código mínimo;
- cambio reciente.

Devuelve tres hipótesis ordenadas, evidencia y experimento mínimo.

[información]
```

Confirma la causa antes de pedir la corrección.

Esta será la cuarta interacción obligatoria.

## Punto de control 2. Funciones completas

- [ ] Búsqueda.
- [ ] Dos filtros.
- [ ] Combinación de controles.
- [ ] Estado vacío.
- [ ] Selección estable.
- [ ] Persistencia.
- [ ] Regla o límite.
- [ ] Resumen.
- [ ] Formulario.
- [ ] Validación.
- [ ] Confirmación.
- [ ] Diagnóstico registrado.
- [ ] Funciones anteriores intactas.

---

# Fase 6. Accesibilidad, pruebas y correcciones

## 6.1 No pruebes solamente el camino feliz

Prueba:

- primera visita;
- recarga;
- búsqueda parcial;
- mayúsculas y minúsculas;
- filtros combinados;
- cero resultados;
- selección repetida;
- límite;
- eliminación;
- limpieza;
- datos persistidos;
- formulario vacío;
- formulario inválido;
- formulario correcto;
- slug inexistente;
- ruta inexistente;
- teclado;
- móvil;
- construcción;
- producción.

## 6.2 Plan de pruebas

Crea `docs/TEST_PLAN.md`.

| ID | Área | Estado inicial | Acción | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|---|---|
| NAV-01 | Navegación | Inicio | Abrir colección | Carga sin recarga completa |  |  |
| COL-01 | Búsqueda | Colección | Escribir coincidencia | Filtra resultados |  |  |
| PER-01 | Persistencia | Un elemento | Recargar | Conserva selección |  |  |
| FOR-01 | Formulario | Vacío | Enviar | Muestra errores |  |  |

Incluye al menos veinte casos.

## 6.3 Matriz mínima

### Navegación

| ID | Caso |
|---|---|
| NAV-01 | Inicio a colección |
| NAV-02 | Colección a detalle |
| NAV-03 | Detalle a colección |
| NAV-04 | Acceso directo a detalle |
| NAV-05 | Ruta inexistente |

### Colección

| ID | Caso |
|---|---|
| COL-01 | Búsqueda válida |
| COL-02 | Búsqueda sin resultados |
| COL-03 | Primer filtro |
| COL-04 | Segundo filtro |
| COL-05 | Combinación |
| COL-06 | Limpiar |

### Espacio personal

| ID | Caso |
|---|---|
| PER-01 | Agregar |
| PER-02 | Evitar duplicado |
| PER-03 | Quitar |
| PER-04 | Limpiar |
| PER-05 | Límite |
| PER-06 | Recargar |
| PER-07 | Resumen |

### Formulario

| ID | Caso |
|---|---|
| FOR-01 | Vacío |
| FOR-02 | Dato inválido |
| FOR-03 | Corregir error |
| FOR-04 | Confirmar |

### Calidad

| ID | Caso |
|---|---|
| QUA-01 | Teclado |
| QUA-02 | 320 px |
| QUA-03 | Consola |
| QUA-04 | ESLint |
| QUA-05 | Build |

## 6.4 Prueba de teclado

Sin utilizar el mouse:

1. recorre la navegación;
2. abre la colección;
3. escribe una búsqueda;
4. cambia filtros;
5. abre un detalle;
6. agrega un elemento;
7. abre el espacio personal;
8. quita un elemento;
9. completa el formulario;
10. corrige un error;
11. envía la demostración.

Comprueba:

- foco visible;
- orden lógico;
- ausencia de trampas;
- botones activables;
- enlaces correctos;
- mensajes comprensibles.

## 6.5 Revisión adaptable

Prueba:

- 320 px;
- 375 px;
- 768 px;
- 1024 px;
- escritorio amplio.

Revisa:

- desbordamiento;
- texto cortado;
- controles pequeños;
- tablas imposibles de leer;
- imágenes deformadas;
- navegación;
- formularios;
- tarjetas;
- resumen.

## 6.6 Revisión automática

Puedes utilizar Lighthouse como apoyo para:

- accesibilidad;
- prácticas recomendadas;
- rendimiento;
- SEO.

No es obligatorio alcanzar 100. Debes:

- registrar resultados;
- investigar los hallazgos;
- corregir los relacionados con el alcance;
- explicar los que no correspondan;
- combinar la revisión con pruebas manuales.

## 6.7 Revisión asistida por IA

Entrega un diff o archivos concretos, no todo el proyecto sin necesidad.

```text
Revisa estos archivos.
No los reescribas completos.

Categorías:
- funcionalidad;
- React;
- Next.js;
- accesibilidad;
- Tailwind;
- privacidad;
- mantenibilidad.

Para cada hallazgo:
- gravedad;
- evidencia;
- impacto;
- corrección mínima;
- prueba.

No inventes hallazgos para llenar una cuota.

[archivos]
```

Esta será la quinta interacción obligatoria.

Verifica cada observación. Corrige al menos tres hallazgos reales del proceso completo, incluyendo uno de accesibilidad o experiencia.

## Punto de control 3. Candidato a publicación

- [ ] Veinte pruebas registradas.
- [ ] Prueba de teclado.
- [ ] Prueba a 320 px.
- [ ] ESLint.
- [ ] Build.
- [ ] Consola limpia.
- [ ] Revisión asistida.
- [ ] Tres correcciones verificadas.
- [ ] Sin secretos.
- [ ] Sin dependencias innecesarias.

---

# Fase 7. Documentación, vista previa y producción

## 7.1 README obligatorio

El `README.md` debe incluir:

```markdown
# Nombre del proyecto

## Descripción

## Problema que resuelve

## Funciones principales

## Tecnologías

## Rutas

## Arquitectura

## Instalación local

## Comandos

## Pruebas

## Uso de inteligencia artificial

## Decisiones técnicas

## Limitaciones

## Enlaces

## Autor
```

No agregues insignias, estadísticas o decoración que no ayude a comprender el proyecto.

## 7.2 Instrucciones locales

Incluye comandos reales:

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```

Confirma que coincidan con `package.json`.

## 7.3 Arquitectura documentada

Incluye:

```text
Datos locales
   ├── páginas de servidor
   └── islas de cliente
        ├── explorador
        ├── selección
        └── formulario

localStorage
   └── identificadores personales
```

Explica:

- por qué una parte es cliente;
- por qué otra permanece en servidor;
- dónde vive el estado;
- qué se deriva;
- cómo se verifica.

## 7.4 Documentación asistida

La sexta interacción puede ayudar a redactar:

```text
Redacta una sección de README utilizando solamente estos hechos.
No inventes funciones, pruebas, comandos ni resultados.

[hechos verificados]
```

Revisa cada afirmación.

## 7.5 Bitácora final de IA

`docs/AI_LOG.md`:

| ID | Objetivo | Herramienta | Contexto | Propuesta | Decisión | Verificación | Commit |
|---|---|---|---|---|---|---|---|
| IA-01 | Alcance |  |  |  |  |  |  |
| IA-02 | Arquitectura |  |  |  |  |  |  |
| IA-03 | Implementación |  |  |  |  |  |  |
| IA-04 | Diagnóstico |  |  |  |  |  |  |
| IA-05 | Revisión |  |  |  |  |  |  |
| IA-06 | Documentación |  |  |  |  |  |  |

Incluye al menos:

- dos propuestas aceptadas;
- dos modificadas o rechazadas;
- una limitación;
- una decisión tomada sin IA.

## 7.6 Historial sugerido

```text
chore: initialize final project
docs: define project scope and acceptance criteria
feat: add application layout and navigation
feat: add collection data and cards
feat: add dynamic detail routes
feat: add search and filters
feat: add personal selection
feat: persist personal selection
feat: add validated demonstration form
style: complete responsive accessible interface
fix: resolve verified interaction issue
test: document final test matrix
docs: complete README and AI log
```

No copies exactamente los mensajes si no describen tus cambios.

## 7.7 Vista previa

Antes de producción:

1. sube la rama;
2. abre la vista previa de Vercel;
3. prueba rutas directas;
4. recarga detalles;
5. prueba persistencia;
6. prueba teclado;
7. prueba móvil;
8. revisa consola;
9. comprueba metadatos;
10. registra la URL.

## 7.8 Producción

Después de aprobar la vista previa:

1. integra la rama;
2. espera el despliegue;
3. repite las pruebas críticas;
4. confirma que la URL pública funciona;
5. actualiza el README;
6. crea una etiqueta opcional:

```bash
git tag v1.0.0
```

No cambies la aplicación después de registrar las evidencias sin volver a probar.

---

# Fase 8. Verificación final y defensa

## 8.1 Lista de verificación técnica

### Producto

- [ ] Problema definido.
- [ ] Usuario definido.
- [ ] Alcance realista.
- [ ] Ocho elementos.
- [ ] Contenido propio.
- [ ] Acción principal clara.

### HTML y accesibilidad

- [ ] HTML semántico.
- [ ] Un `h1` por página.
- [ ] Encabezados lógicos.
- [ ] Enlaces y botones correctos.
- [ ] Etiquetas en formularios.
- [ ] Texto alternativo.
- [ ] Foco visible.
- [ ] Teclado completo.
- [ ] Contraste.
- [ ] Idioma.

### React

- [ ] Componentes reutilizables.
- [ ] Propiedades claras.
- [ ] Estado mínimo.
- [ ] Actualización inmutable.
- [ ] Valores derivados.
- [ ] Listas con claves.
- [ ] Estados condicionales.
- [ ] Formulario controlado.
- [ ] Persistencia.

### Next.js

- [ ] App Router.
- [ ] Layout.
- [ ] Páginas.
- [ ] Rutas dinámicas.
- [ ] `Link`.
- [ ] Componentes de servidor.
- [ ] Fronteras de cliente.
- [ ] `notFound()`.
- [ ] `not-found.js`.
- [ ] `loading.js`.
- [ ] Metadatos.
- [ ] `Image`.

### Tailwind

- [ ] Móvil primero.
- [ ] 320 px.
- [ ] Espaciado consistente.
- [ ] Tipografía.
- [ ] Estados de interacción.
- [ ] Sin clases dinámicas incompletas.

### Calidad

- [ ] Sin errores de consola.
- [ ] Sin código muerto.
- [ ] Sin secretos.
- [ ] Sin dependencias innecesarias.
- [ ] ESLint correcto.
- [ ] Build correcto.
- [ ] Veinte pruebas.
- [ ] Tres correcciones.

### Proceso

- [ ] Rama.
- [ ] Diez commits.
- [ ] README.
- [ ] Brief.
- [ ] Plan de pruebas.
- [ ] Bitácora de IA.
- [ ] Vista previa.
- [ ] Producción.

## 8.2 Demostración

Prepara una demostración de 7 a 10 minutos.

Orden recomendado:

```text
0:00 — problema y usuario
1:00 — mapa de la aplicación
2:00 — colección, búsqueda y filtros
3:30 — detalle dinámico
4:30 — espacio personal y persistencia
6:00 — formulario y estados
7:00 — móvil y teclado
8:00 — arquitectura y uso de IA
9:00 — pruebas, limitaciones y cierre
```

No leas el README completo. Demuestra.

## 8.3 Defensa técnica

Debes poder responder:

### Producto

1. ¿Qué problema resuelve?
2. ¿Qué decidiste dejar fuera?
3. ¿Cuál es el camino principal?

### React

4. ¿Dónde vive el estado?
5. ¿Qué valor se deriva?
6. ¿Cómo evitas mutación y duplicados?
7. ¿Por qué utilizaste un efecto?

### Next.js

8. ¿Cómo se crea una ruta?
9. ¿Cómo funciona `[slug]`?
10. ¿Qué componente es servidor?
11. ¿Cuál necesita `"use client"` y por qué?

### Calidad

12. ¿Qué error real diagnosticabas?
13. ¿Qué prueba detectaría una regresión?
14. ¿Qué problema de accesibilidad corregiste?

### IA

15. ¿Qué propuesta rechazaste?
16. ¿Qué contexto produjo una respuesta útil?
17. ¿Qué limitación detectaste?
18. ¿Qué parte decidiste sin IA?

Si no puedes responder una pregunta, revisa el proyecto antes de la entrega.

---

# Un único punto de entrega

Este módulo utiliza una sola entrega final.

No envíes cada fase por separado. Conserva las evidencias durante el desarrollo y reúne todo al terminar.

La entrega debe incluir:

- nombre completo;
- nombre del proyecto;
- opción elegida;
- descripción de 100 a 150 palabras;
- enlace al repositorio de GitHub;
- enlace a vista previa;
- enlace de producción;
- enlace o archivo de demostración;
- mapa de rutas;
- árbol de componentes;
- diagrama servidor-cliente;
- captura de inicio;
- captura de colección;
- captura de detalle;
- captura del espacio personal;
- captura del formulario;
- captura móvil a 320 o 375 píxeles;
- `PROJECT_BRIEF.md`;
- `TEST_PLAN.md`;
- `AI_LOG.md`;
- README;
- resultado de ESLint;
- resultado de construcción;
- tabla de veinte pruebas;
- evidencia de tres correcciones;
- reflexión final.

## Nombre de archivos

Utiliza nombres claros:

```text
apellido-nombre-proyecto-final/
├── 01-inicio.png
├── 02-coleccion.png
├── 03-detalle.png
├── 04-seleccion.png
├── 05-formulario.png
├── 06-movil.png
└── reflexion-final.pdf o reflexion-final.md
```

No incluyas:

- `node_modules`;
- archivos `.env`;
- claves;
- conversaciones completas con información privada;
- duplicados innecesarios;
- un archivo comprimido si el repositorio y los documentos ya son accesibles.

## Reflexión final

Escribe entre 400 y 600 palabras.

Responde:

1. ¿Qué problema elegiste y por qué?
2. ¿Cómo redujiste el alcance?
3. ¿Cuál fue la decisión de arquitectura más importante?
4. ¿Qué parte resultó más difícil?
5. ¿Qué error diagnosticabas y cómo confirmaste su causa?
6. ¿Qué propuesta de IA rechazaste o modificaste?
7. ¿Cómo verificaste que el proyecto funciona?
8. ¿Qué mejorarías en una segunda versión?
9. ¿Qué puedes construir ahora que no podías construir al iniciar?

[Entregar el Proyecto Final Integrador](https://forms.gle/BayPBDiXAGurWjnL6)

---

# Rúbrica del Proyecto Final

**Puntuación total:** 100 puntos  
**Puntuación mínima para aprobar:** 70 puntos, sin incumplir un requisito crítico

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Problema, alcance y contenido | Problema claro, alcance realista, contenido completo y criterios comprobables | Propósito claro con omisiones menores | Idea amplia o contenido incompleto | No existe problema ni alcance defendible | 10 |
| Funcionalidad | Colección, búsqueda, filtros, detalles, selección, persistencia, resumen y formulario funcionan en todos los estados | Núcleo completo con fallos menores | Varias funciones parciales | La experiencia principal no funciona | 20 |
| React y JavaScript | Estado mínimo, valores derivados, inmutabilidad, formularios y componentes bien resueltos | Implementación correcta con mejoras menores | Duplicación, efectos o componentes problemáticos | Mutación, DOM directo o código no comprendido | 15 |
| Next.js y arquitectura | App Router, rutas, servidor-cliente, metadatos, imágenes y estados especiales correctamente aplicados | Arquitectura sólida con detalles menores | Separación o rutas incompletas | Arquitectura incorrecta o sitio convertido completamente a cliente | 15 |
| Diseño y accesibilidad | Diseño coherente, móvil primero, teclado completo, foco, contraste y estados claros | Buena experiencia con detalles menores | Problemas adaptables o accesibles | Interfaz rota o inaccesible | 15 |
| Calidad y pruebas | Veinte casos, regresiones, tres correcciones, lint, build y producción verificados | Pruebas principales completas | Evidencia parcial o superficial | Sin pruebas o construcción fallida | 10 |
| Uso profesional de IA | Seis usos documentados, contexto seguro, dos rechazos o modificaciones y criterio demostrable | Uso razonado con documentación suficiente | Bitácora superficial o verificación incompleta | Copia total, resultados inventados o código no explicado | 10 |
| Git, documentación, despliegue y defensa | Historial claro, README completo, vista previa, producción y defensa precisa | Entrega completa con detalles menores | Historial, documentación o presentación incompletos | Sin trazabilidad, publicación o defensa | 5 |
| **Total** |  |  |  |  | **100** |

## Requisitos críticos

El proyecto debe corregirse antes de aprobarse si:

- la URL pública no funciona;
- `npm run build` falla;
- no utiliza App Router;
- no existe ruta dinámica;
- no existe una colección de al menos ocho elementos;
- búsqueda y filtros no funcionan;
- el espacio personal no funciona;
- no existe persistencia;
- el formulario no valida;
- el proyecto depende de una tecnología fuera del curso;
- se publicaron credenciales o datos personales;
- existen errores activos que impiden la experiencia;
- la aplicación no puede utilizarse con teclado;
- falla a 320 píxeles;
- no existe repositorio;
- faltan pruebas;
- falta la bitácora de IA;
- el estudiante no puede explicar el código;
- el proyecto fue generado completo y copiado sin proceso verificable;
- no existe una demostración o defensa;
- la entrega presenta como reales funciones simuladas.

## Proceso de corrección

Si el proyecto recibe observaciones:

1. revisa cada criterio;
2. corrige en una rama;
3. registra commits;
4. repite pruebas;
5. actualiza la evidencia;
6. publica una nueva vista previa;
7. entrega la versión corregida.

No es necesario comenzar de nuevo salvo que la aplicación no corresponda al alcance del curso.

---


<!-- coa-activity:desarrollo-web-m6-proyecto-final-integrador -->

# Videos recomendados

Los videos apoyan etapas concretas. No necesitas reproducir todos antes de empezar.

| Etapa | Video | Canal | Duración aproximada | Motivo |
|---|---|---|---:|---|
| Alcance y MVP | [¿Cómo programar un software MVP?](https://www.youtube.com/watch?v=pdZquGJGh0o) | Hdeleon Clips | 5 min | Explica de forma breve por qué conviene construir primero el núcleo útil. |
| Proceso de proyecto | [Mi paso a paso para desarrollar proyectos de software](https://www.youtube.com/watch?v=uCq7XP9CNag) | Fazt | 15 min | Presenta un flujo completo desde requisitos hasta publicación. |
| Accesibilidad y rendimiento | [Analiza la accesibilidad y performance de tu web como un profesional](https://www.youtube.com/watch?v=2ln694n-j1E) | Programación en español | 32 min | Revisa WAVE, estructura, ARIA, Lighthouse y una aplicación de Next.js. |
| README | [Crea tu primer README para un proyecto profesional](https://www.youtube.com/watch?v=ErMT3ShkOL4) | Dani Code | 14 min | Muestra cómo presentar propósito, uso y estructura en GitHub. |
| Despliegue | [Cómo desplegar en Vercel proyectos de React y Next.js](https://www.youtube.com/watch?v=sxcKVwURuhk) | CleanKoder | 10 min | Canal pequeño con un recorrido directo de GitHub y Vercel. |
| Presentación | [Crea tu portafolio y consigue trabajo como programador](https://www.youtube.com/watch?v=oYBC7r5oSzk) | MoureDev TV | 10 min | Ayuda a pensar cómo mostrar proyectos y explicar su valor. |

## Reproductores de video

[¿Cómo programar un software MVP?](https://www.youtube.com/watch?v=pdZquGJGh0o)

[Mi paso a paso para desarrollar proyectos de software](https://www.youtube.com/watch?v=uCq7XP9CNag)

[Analiza la accesibilidad y performance de tu web como un profesional](https://www.youtube.com/watch?v=2ln694n-j1E)

[Crea tu primer README para un proyecto profesional](https://www.youtube.com/watch?v=ErMT3ShkOL4)

[Cómo desplegar en Vercel proyectos de React y Next.js](https://www.youtube.com/watch?v=sxcKVwURuhk)

[Crea tu portafolio y consigue trabajo como programador](https://www.youtube.com/watch?v=oYBC7r5oSzk)

## Orden recomendado

1. Mira MVP antes de cerrar la Fase 1.
2. Consulta el proceso de proyecto durante la planificación.
3. Revisa accesibilidad antes de la Fase 6.
4. Mira README al comenzar la Fase 7.
5. Consulta despliegue antes de publicar.
6. Mira presentación antes de preparar la defensa.

> Los videos de despliegue pueden mostrar una interfaz anterior de Vercel. Utiliza la documentación oficial para confirmar el flujo actual.

---

# Documentación y lecturas

## Planificación y repositorio

- [Acerca del archivo README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Sintaxis básica de Markdown en GitHub](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [Documentación de Git](https://git-scm.com/doc)

## Next.js

- [Instalación](https://nextjs.org/docs/app/getting-started/installation)
- [Estructura del proyecto](https://nextjs.org/docs/app/getting-started/project-structure)
- [Layouts y páginas](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Navegación](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [Componentes de servidor y cliente](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Rutas dinámicas](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Página no encontrada](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Imágenes](https://nextjs.org/docs/app/getting-started/images)
- [Metadatos](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Lista de producción](https://nextjs.org/docs/app/guides/production-checklist)

## React

- [Pensar en React](https://react.dev/learn/thinking-in-react)
- [Elegir la estructura del estado](https://react.dev/learn/choosing-the-state-structure)
- [Actualizar arreglos en el estado](https://react.dev/learn/updating-arrays-in-state)
- [Sincronizar con efectos](https://react.dev/learn/synchronizing-with-effects)
- [No siempre necesitas un efecto](https://react.dev/learn/you-might-not-need-an-effect)

## Tailwind CSS

- [Estilos mediante utilidades](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Diseño adaptable](https://tailwindcss.com/docs/responsive-design)
- [Estados de interacción](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Detección de clases](https://tailwindcss.com/docs/detecting-classes-in-source-files)

## Accesibilidad

- [Revisión inicial de accesibilidad de W3C](https://www.w3.org/WAI/test-evaluate/preliminary/)
- [Formularios accesibles](https://www.w3.org/WAI/tutorials/forms/)
- [Imágenes accesibles](https://www.w3.org/WAI/tutorials/images/)
- [Estructura de páginas](https://www.w3.org/WAI/tutorials/page-structure/)

## Vercel

- [Desplegar repositorios Git](https://vercel.com/docs/git)
- [Entornos local, vista previa y producción](https://vercel.com/docs/deployments/environments)
- [Integración de GitHub y Vercel](https://vercel.com/docs/git/vercel-for-github)

## Inteligencia artificial

- [Buenas prácticas para GitHub Copilot](https://docs.github.com/en/copilot/get-started/best-practices)
- [Ingeniería de instrucciones para GitHub Copilot](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [Buenas prácticas de instrucciones para ChatGPT](https://help.openai.com/en/articles/10032626-pompt-engenneering-best-practices-for-chatgpt)

## Orden para resolver una duda

```text
1. Reproducir
2. Leer el código
3. Consultar documentación oficial
4. Preparar una reproducción mínima
5. Solicitar ayuda con contexto
6. Probar la propuesta
7. Registrar la decisión
```

---

# Glosario del Proyecto Final

**Alcance:** conjunto de funciones que se construirán y límites que se respetarán.

**Aplicación web:** producto interactivo utilizado mediante un navegador.

**Candidato a publicación:** versión que contiene el alcance completo y está lista para pruebas finales.

**Criterio de aceptación:** resultado observable que permite decidir si un requisito se cumplió.

**Defensa técnica:** explicación oral o grabada de decisiones, código, pruebas y proceso.

**Definición de terminado:** lista de condiciones que debe cumplir una función antes de considerarse completa.

**Despliegue:** versión de la aplicación disponible en un entorno.

**Espacio personal:** área que representa las decisiones guardadas por el usuario.

**Historia de usuario:** descripción de una necesidad desde la perspectiva de una persona.

**Iteración:** ciclo breve de construcción, revisión y mejora.

**Matriz de estados:** tabla que enumera situaciones posibles y su representación.

**MVP:** versión mínima que resuelve el problema principal de forma útil.

**Prueba crítica:** comprobación de una función cuya falla impide aprobar o publicar.

**Regresión:** fallo introducido en una función que antes operaba.

**Resumen derivado:** información calculada a partir de los datos y la selección existentes.

**Trazabilidad:** capacidad de relacionar requisitos, cambios, pruebas y decisiones.

**Vista previa:** despliegue utilizado para revisar cambios antes de producción.

---

# Cierre del curso

El Proyecto Final reúne el recorrido completo:

```text
HTML
└── estructura y significado

CSS + Tailwind
└── presentación y adaptación

JavaScript
└── datos y comportamiento

React
└── componentes, estado e interacción

Next.js
└── rutas, servidor, cliente y producción

Git + GitHub
└── historial y documentación

Inteligencia artificial
└── asistencia revisada y verificada

Vercel
└── aplicación pública
```

Al finalizar debes poder mostrar una aplicación y explicar:

- qué problema resuelve;
- cómo está organizada;
- qué ocurre cuando el usuario interactúa;
- qué código se ejecuta en cliente;
- qué contenido permanece en servidor;
- cómo conservas preferencias;
- cómo validas un formulario;
- cómo manejas errores;
- cómo probaste;
- cómo utilizaste IA;
- qué decisiones tomaste;
- cómo publicaste.

Ese conjunto de capacidades permite continuar aprendiendo:

- consumo de APIs;
- pruebas automatizadas;
- TypeScript;
- autenticación;
- bases de datos;
- desarrollo de aplicaciones de mayor escala.

No forman parte de este curso y no son necesarios para aprobar el proyecto actual.

---

# Requisitos para obtener el certificado

El certificado de participación se entrega cuando:

- completaste los seis módulos;
- aprobaste los proyectos de los Módulos 1 al 5;
- aprobaste las evaluaciones del curso;
- aprobaste el Proyecto Final Integrador;
- realizaste las correcciones solicitadas;
- entregaste todos los enlaces y evidencias.

El certificado representa que completaste satisfactoriamente el proceso formativo y desarrollaste el proyecto requerido.

No representa una licencia profesional ni garantiza dominio experto de todas las tecnologías.

El curso concluye cuando el Proyecto Final recibe aprobación.
