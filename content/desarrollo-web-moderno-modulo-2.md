# COA — Cursos Online Avanzados

## Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial

# Módulo 2. JavaScript moderno en el navegador

**Duración aproximada:** 6 horas y 30 minutos  
**Modalidad:** práctica guiada, ejercicios, mini proyecto y proyecto de módulo  
**Tecnologías:** JavaScript ES6+, HTML5, CSS3, Git, GitHub, ChatGPT o Claude  
**Resultado principal:** una landing page de COA convertida en un explorador interactivo de cursos

---

## Bienvenida

En el módulo anterior construiste una interfaz profesional con HTML y CSS. La página ya tiene contenido, estructura, estilos y una distribución adaptable, pero todavía no responde a las acciones de sus usuarios.

En este módulo añadirás comportamiento real con JavaScript:

- crearás contenido a partir de datos;
- escucharás acciones como clics, escritura y envíos de formularios;
- actualizarás la página sin recargarla;
- cargarás información con `fetch`;
- controlarás estados de carga, éxito, ausencia de resultados y error;
- guardarás preferencias en el navegador;
- depurarás problemas con las herramientas de desarrollo.

No volverás a estudiar desde cero variables, tipos de datos, condicionales, bucles, funciones, listas u objetos. Ya conoces esos fundamentos. Ahora los aplicarás dentro del navegador y aprenderás las API que permiten conectar tu lógica con una interfaz web.

> **Principio del módulo:** una interfaz interactiva es el resultado de tres elementos conectados: datos, estado y representación visual.

```text
Datos iniciales
      │
      ▼
Estado actual de la interfaz
      │
      ▼
Representación en el DOM
      ▲
      │
Eventos de la persona usuaria
```

Este modelo será especialmente importante cuando comiences React en el próximo módulo.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Conectar JavaScript moderno a una página mediante módulos.
- Utilizar la consola del navegador para comprobar valores y detectar errores.
- Explicar qué es el DOM y cómo representa el documento HTML.
- Seleccionar, consultar y actualizar elementos.
- Crear elementos de forma segura a partir de datos.
- Renderizar una colección de objetos como tarjetas.
- Escuchar eventos con `addEventListener`.
- Utilizar el objeto `event` y evitar comportamientos predeterminados cuando sea necesario.
- Aplicar delegación de eventos en contenido creado dinámicamente.
- Construir búsquedas y filtros que actualizan la interfaz.
- Manejar formularios y aprovechar la validación incorporada de HTML.
- Leer formularios mediante `FormData`.
- Consumir datos JSON con `fetch`, `async` y `await`.
- Diseñar estados de carga, éxito, vacío y error.
- Guardar preferencias no sensibles con `localStorage`.
- Depurar código con consola, puntos de interrupción y el panel de red.
- Utilizar IA para diagnosticar y revisar código sin aceptar cambios a ciegas.
- Organizar JavaScript en funciones pequeñas y comprensibles.

---

## Producto que construirás

Transformarás la landing page del Módulo 1 en una aplicación interactiva:

```text
┌─────────────────────────────────────────────────────────────────┐
│ COA        Cursos   Beneficios   Preguntas         [Menú móvil] │
├─────────────────────────────────────────────────────────────────┤
│                     Sección principal                           │
├─────────────────────────────────────────────────────────────────┤
│ Buscar: [________________]   Categoría: [Todas ▼]                │
│ Mostrando 6 cursos                                              │
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ Curso        │ │ Curso        │ │ Curso        │              │
│ │ [Favorito ☆] │ │ [Favorito ★] │ │ [Favorito ☆] │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    Preguntas frecuentes                         │
│ [¿Necesito experiencia previa?                         +]       │
├─────────────────────────────────────────────────────────────────┤
│                  Formulario de inscripción                      │
└─────────────────────────────────────────────────────────────────┘
```

La aplicación permitirá:

- cargar los cursos desde un archivo JSON;
- buscar por texto;
- filtrar por categoría;
- marcar cursos favoritos;
- conservar favoritos al cerrar y volver a abrir el navegador;
- abrir y cerrar preguntas frecuentes;
- validar un formulario;
- informar resultados sin recargar la página.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Preparación, módulos y depuración inicial | 25 minutos |
| 2. DOM y representación de datos | 55 minutos |
| 3. Eventos e interacción | 45 minutos |
| 4. Formularios y validación | 40 minutos |
| 5. Datos asíncronos con Fetch | 45 minutos |
| 6. Estado y persistencia con localStorage | 25 minutos |
| 7. Diagnóstico asistido por IA | 15 minutos |
| 8. Mini proyecto: preguntas frecuentes accesibles | 30 minutos |
| 9. Proyecto del módulo: explorador de cursos COA | 95 minutos |
| 10. Evaluación y cierre | 15 minutos |
| **Total** | **6 horas y 30 minutos** |

Los tiempos son orientativos. La comprensión y la calidad del proyecto son más importantes que terminar cada etapa exactamente dentro del tiempo indicado.

---

# 1. Preparación, módulos y depuración inicial

## 1.1 Continúa el proyecto anterior

Trabaja sobre una copia aprobada de la landing page del Módulo 1. Conserva el proyecto original en Git y crea una rama para este módulo:

```bash
git switch -c modulo-2-interactividad
```

Si tu versión de Git no reconoce `switch`, puedes utilizar:

```bash
git checkout -b modulo-2-interactividad
```

Añade estas carpetas y archivos:

```text
coa-landing/
├── assets/
│   └── images/
├── data/
│   └── courses.json
├── js/
│   └── main.js
├── index.html
├── styles.css
└── README.md
```

## 1.2 Ejecuta el proyecto mediante un servidor local

En este módulo utilizarás `fetch` para leer un archivo JSON. Por razones de seguridad, algunos navegadores bloquean esa lectura cuando el documento se abre directamente como un archivo.

La dirección no debe comenzar así:

```text
file:///...
```

Debe abrirse desde una dirección local semejante a:

```text
http://localhost:3000
```

Una opción es instalar la versión LTS actual de Node.js y ejecutar dentro de la carpeta:

```bash
npx serve .
```

La primera ejecución puede solicitar permiso para descargar la herramienta `serve`. Después mostrará una dirección local. Ábrela en el navegador.

Node.js se utilizará aquí únicamente como herramienta para servir archivos. La programación de servidores no forma parte de este módulo.

## 1.3 Conecta el archivo JavaScript

Antes de cerrar `body`, añade:

```html
<script type="module" src="js/main.js"></script>
```

`type="module"` aporta varias ventajas:

- permite dividir el código mediante `import` y `export`;
- evita que las variables se conviertan automáticamente en propiedades globales;
- aplica reglas estrictas de JavaScript;
- espera a que el HTML sea procesado antes de ejecutar el módulo.

En `js/main.js`, escribe:

```js
console.log("Módulo 2 conectado");
```

Abre las herramientas de desarrollo, entra en **Console** y comprueba el mensaje.

## 1.4 La consola es una herramienta de observación

La consola permite:

- comprobar si el archivo se cargó;
- observar valores;
- leer errores y su línea de origen;
- ejecutar pequeñas expresiones;
- verificar el flujo de una función.

```js
console.log("Cursos cargados:", courses);
console.table(courses);
console.warn("No se encontraron resultados");
console.error("No fue posible cargar los datos");
```

No dejes decenas de mensajes sin propósito en la versión entregada. Conserva solamente los que aporten información útil.

## 1.5 Lee un error antes de modificar código

Un mensaje puede verse así:

```text
TypeError: Cannot read properties of null (reading 'addEventListener')
    at main.js:18
```

Interprétalo:

- **Tipo:** `TypeError`.
- **Problema:** se intentó utilizar `addEventListener` en un valor `null`.
- **Ubicación:** línea 18 de `main.js`.
- **Causa probable:** el selector no encontró el elemento esperado.

Un diagnóstico útil comienza con el mensaje real, no con cambios al azar.

### Práctica guiada 1 — Verificar la conexión

1. Conecta `main.js` mediante `type="module"`.
2. Muestra un mensaje en la consola.
3. Cambia temporalmente la ruta a `js/app.js`.
4. Observa el error de carga en **Console** o **Network**.
5. Corrige la ruta.
6. Crea un commit:

```bash
git add .
git commit -m "Configura JavaScript como módulo"
```

---

# 2. DOM y representación de datos

## 2.1 El DOM no es el archivo HTML

El navegador lee HTML y construye una representación en memoria llamada **Document Object Model**:

```html
<main>
  <section>
    <h1>Cursos de programación</h1>
    <p>Aprende mediante proyectos.</p>
  </section>
</main>
```

Se representa conceptualmente como:

```text
document
└── html
    └── body
        └── main
            └── section
                ├── h1
                │   └── "Cursos de programación"
                └── p
                    └── "Aprende mediante proyectos."
```

JavaScript puede consultar y modificar ese árbol. El archivo HTML original no cambia; cambia la representación que la persona ve durante esa sesión.

## 2.2 Selecciona elementos

```js
const pageTitle = document.querySelector("h1");
const catalog = document.querySelector("[data-course-list]");
const cards = document.querySelectorAll(".course-card");
```

`querySelector` devuelve:

- el primer elemento que coincide;
- `null` si no existe.

`querySelectorAll` devuelve una colección con todas las coincidencias.

Los atributos `data-*` crean puntos de conexión claros entre HTML y JavaScript:

```html
<section data-course-list></section>
```

```js
const catalog = document.querySelector("[data-course-list]");
```

Las clases pueden cambiar por decisiones visuales. Un atributo como `data-course-list` comunica que el elemento participa en un comportamiento.

## 2.3 Comprueba los elementos necesarios

Si una parte esencial no existe, informa el problema pronto:

```js
const catalog = document.querySelector("[data-course-list]");

if (!catalog) {
  throw new Error("No se encontró el contenedor del catálogo");
}
```

Esto produce un error específico y evita fallos más confusos después.

## 2.4 Lee y actualiza contenido

```js
const resultCount = document.querySelector("[data-result-count]");

resultCount.textContent = "Mostrando 6 cursos";
```

También puedes trabajar con atributos y clases:

```js
const menuButton = document.querySelector("[data-menu-button]");

menuButton.setAttribute("aria-expanded", "true");
menuButton.classList.add("is-open");
menuButton.classList.remove("is-open");
menuButton.classList.toggle("is-open");
```

Para mostrar u ocultar contenido:

```js
const message = document.querySelector("[data-empty-message]");

message.hidden = false;
```

Prefiere:

- `textContent` para cambiar texto;
- `classList` para cambiar estados visuales;
- propiedades o atributos apropiados para accesibilidad;
- `hidden` para contenido que debe dejar de mostrarse.

Evita cambiar directamente muchos estilos:

```js
// Evita convertir JavaScript en una segunda hoja CSS
card.style.backgroundColor = "#2563eb";
card.style.padding = "24px";
card.style.borderRadius = "16px";
```

Define una clase en CSS y actívala desde JavaScript:

```css
.course-card.is-favorite {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card);
}
```

```js
card.classList.toggle("is-favorite");
```

## 2.5 Evita insertar datos no confiables con innerHTML

Este código interpreta el contenido como HTML:

```js
catalog.innerHTML = course.description;
```

Si el texto proviene de una persona o una fuente externa, podría insertar código no deseado. Utiliza `textContent`:

```js
description.textContent = course.description;
```

Durante este módulo crearás tarjetas mediante elementos o plantillas y asignarás los textos con `textContent`.

## 2.6 Usa una plantilla HTML

Añade al final de `main`, antes del script:

```html
<template id="course-card-template">
  <article class="course-card">
    <p class="course-card__category" data-course-category></p>
    <h3 data-course-title></h3>
    <p data-course-description></p>

    <ul class="course-card__meta" aria-label="Información del curso">
      <li data-course-duration></li>
      <li data-course-level></li>
    </ul>

    <button
      class="favorite-button"
      type="button"
      data-action="toggle-favorite"
      aria-pressed="false"
    >
      Añadir a favoritos
    </button>
  </article>
</template>
```

El contenido de `<template>` no se muestra hasta que JavaScript lo clona.

```js
const template = document.querySelector("#course-card-template");

function createCourseCard(course) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".course-card");

  card.dataset.courseId = course.id;
  fragment.querySelector("[data-course-category]").textContent = course.category;
  fragment.querySelector("[data-course-title]").textContent = course.title;
  fragment.querySelector("[data-course-description]").textContent =
    course.description;
  fragment.querySelector("[data-course-duration]").textContent =
    `${course.duration} horas`;
  fragment.querySelector("[data-course-level]").textContent = course.level;

  return fragment;
}
```

La función recibe datos y devuelve una representación visual. Este patrón anticipa la idea de componentes que utilizarás en React.

## 2.7 Renderiza una colección

```js
function renderCourses(courses) {
  catalog.replaceChildren();

  const fragment = document.createDocumentFragment();

  courses.forEach((course) => {
    fragment.append(createCourseCard(course));
  });

  catalog.append(fragment);
  resultCount.textContent =
    `Mostrando ${courses.length} ${courses.length === 1 ? "curso" : "cursos"}`;
}
```

`DocumentFragment` permite preparar varios elementos antes de incorporarlos al documento.

`replaceChildren()` elimina la representación anterior. Después la función dibuja el estado más reciente.

## 2.8 Los datos no deben mezclarse con la presentación

Un curso puede representarse así:

```js
const course = {
  id: "web-moderno",
  title: "Desarrollo Web Moderno",
  category: "Desarrollo web",
  description: "Construye aplicaciones con React, Next.js e IA.",
  duration: 40,
  level: "Intermedio",
};
```

Los datos no contienen etiquetas HTML ni colores. La plantilla decide cómo mostrarlos y CSS decide su apariencia.

### Práctica guiada 2 — Consultar y modificar

1. Añade `data-result-count` a un elemento.
2. Selecciónalo desde JavaScript.
3. Cambia su texto.
4. Añade una clase con `classList`.
5. Comprueba el resultado en el panel **Elements**.
6. Escribe un selector incorrecto y observa el valor `null`.
7. Corrige el selector.

### Práctica guiada 3 — Crear una tarjeta desde datos

1. Añade la plantilla anterior.
2. Crea un objeto que represente un curso.
3. Implementa `createCourseCard`.
4. Añade la tarjeta al catálogo.
5. Cambia el título en el objeto y vuelve a ejecutar la página.
6. Confirma que no necesitaste modificar el HTML de la tarjeta.

### Práctica guiada 4 — Renderizar seis cursos

Crea una lista con seis objetos. Incluye al menos tres categorías. Renderiza la lista completa y muestra el contador correcto.

Comprueba:

- el catálogo se limpia antes de dibujarse;
- los textos se asignan mediante `textContent`;
- cada tarjeta conserva su identificador en `data-course-id`;
- el singular y el plural del contador son correctos.

### Video recomendado

[¿Qué es el DOM? — TodoCode (12 min 59 s)](https://www.youtube.com/watch?v=4ILE0y58J00)

---

# 3. Eventos e interacción

## 3.1 Un evento comunica que algo ocurrió

El navegador produce eventos cuando:

- una persona hace clic;
- escribe en un campo;
- cambia una selección;
- envía un formulario;
- presiona una tecla;
- la página termina de cargar;
- ocurre un error.

Utiliza `addEventListener` para registrar la respuesta:

```js
const button = document.querySelector("[data-menu-button]");

button.addEventListener("click", () => {
  console.log("El botón fue activado");
});
```

Evita controladores dentro del HTML:

```html
<!-- Evita mezclar comportamiento con la estructura -->
<button onclick="openMenu()">Abrir menú</button>
```

## 3.2 El objeto event

El navegador entrega información sobre lo ocurrido:

```js
button.addEventListener("click", (event) => {
  console.log(event.type);
  console.log(event.currentTarget);
});
```

- `event.type`: tipo de evento.
- `event.target`: elemento donde se originó.
- `event.currentTarget`: elemento cuyo manejador se está ejecutando.
- `event.preventDefault()`: evita la acción predeterminada.

No utilices `preventDefault()` por costumbre. Empléalo solamente cuando el comportamiento predeterminado impida la experiencia que estás implementando.

## 3.3 Eventos útiles para este proyecto

| Evento | Uso |
|---|---|
| `click` | Botones, favoritos y preguntas frecuentes. |
| `input` | Búsqueda mientras se escribe. |
| `change` | Cambio de categoría en un `<select>`. |
| `submit` | Envío del formulario. |
| `keydown` | Casos concretos de teclado que no cubre el HTML nativo. |

No construyas un botón con un `<div>` y un evento de teclado manual. Utiliza `<button>`, que ya incluye activación con teclado.

## 3.4 Filtra a partir del estado

```js
const state = {
  courses: [],
  query: "",
  category: "all",
  favorites: [],
};
```

El estado reúne la información que determina qué debe mostrarse.

```js
function getVisibleCourses() {
  const normalizedQuery = state.query.trim().toLowerCase();

  return state.courses.filter((course) => {
    const matchesQuery =
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      state.category === "all" || course.category === state.category;

    return matchesQuery && matchesCategory;
  });
}
```

Conecta los controles:

```js
const searchInput = document.querySelector("[data-search]");
const categorySelect = document.querySelector("[data-category-filter]");

searchInput.addEventListener("input", (event) => {
  state.query = event.currentTarget.value;
  renderCourses(getVisibleCourses());
});

categorySelect.addEventListener("change", (event) => {
  state.category = event.currentTarget.value;
  renderCourses(getVisibleCourses());
});
```

El flujo es consistente:

```text
Evento → actualizar estado → calcular datos visibles → renderizar
```

## 3.5 Representa el estado vacío

Si ninguna tarjeta coincide, no dejes un espacio inexplicable:

```js
function renderCourses(courses) {
  catalog.replaceChildren();
  emptyMessage.hidden = courses.length !== 0;

  if (courses.length === 0) {
    resultCount.textContent = "No se encontraron cursos";
    return;
  }

  const fragment = document.createDocumentFragment();

  courses.forEach((course) => {
    fragment.append(createCourseCard(course));
  });

  catalog.append(fragment);
  resultCount.textContent =
    `Mostrando ${courses.length} ${courses.length === 1 ? "curso" : "cursos"}`;
}
```

HTML:

```html
<p data-empty-message hidden>
  No encontramos cursos con esos filtros. Prueba con otra búsqueda.
</p>
```

## 3.6 Delegación de eventos

Las tarjetas se crean después de cargar los datos. En lugar de añadir un manejador a cada botón, escucha el clic en el contenedor:

```js
catalog.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(
    '[data-action="toggle-favorite"]',
  );

  if (!favoriteButton || !catalog.contains(favoriteButton)) {
    return;
  }

  const card = favoriteButton.closest("[data-course-id]");
  const courseId = card.dataset.courseId;

  toggleFavorite(courseId);
});
```

Los eventos de clic ascienden por el árbol del DOM. Este comportamiento se llama **burbujeo** y permite que el contenedor responda a acciones originadas en sus descendientes.

La delegación es útil cuando:

- los elementos se crean dinámicamente;
- muchos elementos realizan la misma clase de acción;
- el contenedor existe desde el inicio.

No es necesario utilizarla para todos los eventos.

### Práctica guiada 5 — Búsqueda y categoría

Crea:

```html
<label for="course-search">Buscar cursos</label>
<input
  id="course-search"
  type="search"
  data-search
  placeholder="Ejemplo: Python"
>

<label for="course-category">Categoría</label>
<select id="course-category" data-category-filter>
  <option value="all">Todas</option>
  <option value="Desarrollo web">Desarrollo web</option>
  <option value="Datos">Datos</option>
  <option value="Seguridad">Seguridad</option>
</select>
```

Requisitos:

1. La búsqueda debe ignorar diferencias entre mayúsculas y minúsculas.
2. El filtro debe funcionar junto con la búsqueda.
3. El contador debe actualizarse.
4. Debe existir un mensaje cuando no hay resultados.
5. Borrar la búsqueda debe restaurar los resultados correspondientes a la categoría.

### Práctica guiada 6 — Menú adaptable

Crea un botón para mostrar u ocultar la navegación en pantallas estrechas.

Requisitos:

- El botón utiliza `aria-expanded="false"` al inicio.
- El texto accesible describe la acción.
- Al abrir, `aria-expanded` cambia a `"true"`.
- La navegación se muestra mediante una clase o `hidden`.
- El comportamiento no reemplaza la navegación normal en pantallas amplias.

Ejemplo:

```js
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});
```

### Video recomendado

[Eventos en JavaScript: qué son y cómo escucharlos — Navis Code (6 min 42 s)](https://www.youtube.com/watch?v=6ZKl3feb22I)

---

# 4. Formularios y validación

## 4.1 Comienza con HTML

JavaScript debe mejorar un formulario correctamente construido, no reemplazar sus capacidades:

```html
<form data-enrollment-form>
  <div class="form-field">
    <label for="student-name">Nombre completo</label>
    <input
      id="student-name"
      name="name"
      type="text"
      autocomplete="name"
      minlength="3"
      required
    >
  </div>

  <div class="form-field">
    <label for="student-email">Correo electrónico</label>
    <input
      id="student-email"
      name="email"
      type="email"
      autocomplete="email"
      required
    >
  </div>

  <div class="form-field">
    <label for="selected-course">Curso de interés</label>
    <select id="selected-course" name="course" required>
      <option value="">Selecciona un curso</option>
      <option value="web-moderno">Desarrollo Web Moderno</option>
      <option value="python-1">Python Nivel 1</option>
    </select>
  </div>

  <label>
    <input name="terms" type="checkbox" required>
    Confirmo que la información es correcta.
  </label>

  <button type="submit">Enviar solicitud</button>
  <p data-form-status aria-live="polite"></p>
</form>
```

Los atributos `required`, `minlength` y `type="email"` permiten que el navegador realice comprobaciones iniciales.

## 4.2 Escucha el envío

```js
const form = document.querySelector("[data-enrollment-form]");
const formStatus = document.querySelector("[data-form-status]");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const submission = Object.fromEntries(formData);

  console.table(submission);
  formStatus.textContent =
    "Solicitud preparada correctamente. En una aplicación real se enviaría al servidor.";
  form.reset();
});
```

`preventDefault()` evita la navegación o recarga asociada con el envío. En una aplicación real, los datos se enviarían a un servidor.

## 4.3 La validación del navegador no es seguridad

La validación en el cliente:

- ayuda a corregir errores rápidamente;
- mejora la experiencia;
- reduce envíos incompletos.

No puede garantizar seguridad porque una persona puede modificar o evitar el código del navegador. Toda aplicación real debe validar nuevamente los datos en el servidor.

## 4.4 Mensajes comprensibles

Un buen mensaje:

- identifica el problema;
- indica cómo corregirlo;
- aparece cerca del contexto relevante;
- no depende únicamente del color;
- puede ser anunciado por tecnologías de asistencia.

Evita:

```text
Error 14
Datos inválidos
Algo salió mal
```

Prefiere:

```text
Escribe un correo con un formato como nombre@dominio.com.
Selecciona el curso que te interesa.
```

`aria-live="polite"` permite anunciar actualizaciones sin interrumpir abruptamente.

## 4.5 No almacenes datos personales sin necesidad

No guardes en `localStorage`:

- contraseñas;
- tokens;
- números de identificación;
- información financiera;
- datos personales del formulario.

En este proyecto solo persistirás identificadores de cursos favoritos.

### Práctica guiada 7 — Formulario sin recarga

Implementa el formulario anterior:

1. Intenta enviarlo vacío.
2. Comprueba la validación nativa.
3. Completa un correo con formato incorrecto.
4. Corrígelo.
5. Obtén los datos mediante `FormData`.
6. Muestra un mensaje de confirmación.
7. Restablece el formulario solamente después de un envío válido.
8. Comprueba el mensaje con el panel de accesibilidad o un lector de pantalla si está disponible.

### Video recomendado

[Validar formularios con JavaScript y HTML — Parzibyte (9 min 59 s)](https://www.youtube.com/watch?v=bHuL0VvGZO0)

---

# 5. Datos asíncronos con Fetch

## 5.1 ¿Por qué existe la programación asíncrona?

Cargar un archivo o consultar un servicio puede tardar. El navegador no debe congelar toda la interfaz mientras espera.

```text
Iniciar solicitud ─────────────────────────────────────────┐
      │                                                    │
      ├── La página continúa respondiendo                  │
      │                                                    │
      └── Llega la respuesta ◄─────────────────────────────┘
                         │
                         ▼
                  Actualizar interfaz
```

`fetch` inicia una solicitud y devuelve una promesa. `async` y `await` permiten trabajar con ella de forma legible.

## 5.2 Crea los datos del catálogo

Guarda en `data/courses.json`:

```json
[
  {
    "id": "web-moderno",
    "title": "Desarrollo Web Moderno",
    "category": "Desarrollo web",
    "description": "Construye aplicaciones con React, Next.js e IA.",
    "duration": 40,
    "level": "Intermedio"
  },
  {
    "id": "python-1",
    "title": "Python Nivel 1",
    "category": "Programación",
    "description": "Aplica los fundamentos de programación con Python.",
    "duration": 16,
    "level": "Inicial"
  },
  {
    "id": "datos-python",
    "title": "Análisis de Datos con Python",
    "category": "Datos",
    "description": "Transforma datos en información útil.",
    "duration": 24,
    "level": "Intermedio"
  }
]
```

Completa el archivo hasta tener al menos seis cursos.

## 5.3 Carga y convierte la respuesta

```js
async function loadCourses() {
  const response = await fetch("./data/courses.json");

  if (!response.ok) {
    throw new Error(`No fue posible cargar los cursos: ${response.status}`);
  }

  const courses = await response.json();
  return courses;
}
```

`fetch` no considera automáticamente los estados HTTP 404 o 500 como rechazos de la promesa. Comprueba `response.ok`.

## 5.4 Diseña todos los estados

Una solicitud no tiene únicamente éxito o error:

```text
Inicio
  │
  ▼
Cargando
  ├──> Éxito con datos
  ├──> Éxito sin datos
  └──> Error
```

HTML:

```html
<p data-loading-status role="status">Cargando cursos…</p>

<p data-load-error role="alert" hidden>
  No fue posible cargar los cursos.
  <button type="button" data-retry-load>Intentar nuevamente</button>
</p>
```

JavaScript:

```js
const loadingStatus = document.querySelector("[data-loading-status]");
const loadError = document.querySelector("[data-load-error]");

async function initializeCatalog() {
  loadingStatus.hidden = false;
  loadError.hidden = true;

  try {
    state.courses = await loadCourses();
    renderCourses(getVisibleCourses());
  } catch (error) {
    console.error(error);
    loadError.hidden = false;
  } finally {
    loadingStatus.hidden = true;
  }
}

initializeCatalog();
```

## 5.5 Permite reintentar

```js
const retryButton = document.querySelector("[data-retry-load]");

retryButton.addEventListener("click", initializeCatalog);
```

No obligues a recargar toda la página para repetir una solicitud.

## 5.6 Prueba el error deliberadamente

1. Cambia temporalmente la ruta a `./data/course.json`.
2. Actualiza la página.
3. Abre **Network**.
4. Localiza la solicitud con estado 404.
5. Comprueba que el mensaje de error aparece.
6. Corrige la ruta.
7. Utiliza el botón de reintento.

Un estado de error que nunca se prueba probablemente falle cuando sea necesario.

### Práctica guiada 8 — Cuatro estados de carga

Implementa:

- indicador de carga;
- catálogo cuando existen datos;
- mensaje cuando el archivo contiene una lista vacía;
- mensaje de error con botón de reintento.

Comprueba cada estado por separado. No simules el éxito como única prueba.

### Video recomendado

[Fetch API con JavaScript, async y await — Mau Developer (6 min 8 s)](https://www.youtube.com/watch?v=cxbtYhXV78I)

---

# 6. Estado y persistencia con localStorage

## 6.1 El estado describe la interfaz actual

```js
const state = {
  courses: [],
  query: "",
  category: "all",
  favorites: [],
};
```

Ejemplos:

- `courses`: datos disponibles.
- `query`: texto escrito.
- `category`: categoría seleccionada.
- `favorites`: identificadores guardados.

Cuando el estado cambia, vuelve a representar la parte afectada.

## 6.2 localStorage guarda texto

```js
localStorage.setItem("coa-favorites", JSON.stringify(state.favorites));
```

Para recuperarlo:

```js
function loadFavorites() {
  try {
    const storedFavorites = localStorage.getItem("coa-favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("No fue posible leer los favoritos", error);
    return [];
  }
}

state.favorites = loadFavorites();
```

Utiliza un nombre específico como `coa-favorites` para evitar conflictos con otros proyectos.

## 6.3 Alterna un favorito

```js
function toggleFavorite(courseId) {
  const isFavorite = state.favorites.includes(courseId);

  state.favorites = isFavorite
    ? state.favorites.filter((id) => id !== courseId)
    : [...state.favorites, courseId];

  localStorage.setItem(
    "coa-favorites",
    JSON.stringify(state.favorites),
  );

  renderCourses(getVisibleCourses());
}
```

Al crear cada tarjeta, refleja el estado:

```js
const favoriteButton = fragment.querySelector(
  '[data-action="toggle-favorite"]',
);
const isFavorite = state.favorites.includes(course.id);

card.classList.toggle("is-favorite", isFavorite);
favoriteButton.setAttribute("aria-pressed", String(isFavorite));
favoriteButton.textContent = isFavorite
  ? "Quitar de favoritos"
  : "Añadir a favoritos";
```

La apariencia, el texto y `aria-pressed` deben comunicar el mismo estado.

## 6.4 Limitaciones

`localStorage`:

- pertenece al origen del sitio;
- permanece después de cerrar el navegador;
- almacena cadenas;
- es síncrono;
- puede borrarse;
- no es una base de datos segura.

Es adecuado para una pequeña preferencia como los favoritos. No lo utilices para información crítica.

### Práctica guiada 9 — Favoritos persistentes

1. Marca dos cursos como favoritos.
2. Actualiza la página.
3. Comprueba que siguen marcados.
4. Quita uno.
5. Abre **Application** o **Storage** en las herramientas del navegador.
6. Examina `coa-favorites`.
7. Borra manualmente el valor y recarga.
8. Comprueba que la aplicación vuelve a una lista vacía sin fallar.

---

# 7. Diagnóstico asistido por inteligencia artificial

## 7.1 Utiliza evidencia

Antes de consultar a una IA, reúne:

- comportamiento esperado;
- comportamiento observado;
- mensaje exacto de la consola;
- fragmento mínimo de HTML y JavaScript;
- pasos para reproducir;
- pruebas ya realizadas.

Una solicitud débil:

```text
Mi JavaScript no funciona. Arréglalo.
```

Una solicitud útil:

```text
Estoy construyendo un catálogo con JavaScript ES6+ sin frameworks.

Comportamiento esperado:
al escribir "Python", deben mostrarse dos tarjetas.

Comportamiento observado:
el catálogo queda vacío.

La consola no muestra errores.
Incluyo únicamente getVisibleCourses y el manejador del evento input.

No reescribas toda la aplicación.
1. Formula tres hipótesis.
2. Indica cómo comprobar cada una.
3. Propón el cambio mínimo después del diagnóstico.
4. Explica por qué funciona.

[Código relevante]
```

## 7.2 Depura antes de pedir una solución

Utiliza:

1. **Console** para mensajes y errores.
2. **Elements** para comprobar el DOM actual.
3. **Sources** para crear puntos de interrupción.
4. **Network** para revisar solicitudes y respuestas.
5. **Application/Storage** para observar `localStorage`.

Un punto de interrupción pausa la ejecución. Puedes inspeccionar:

- valores actuales;
- ruta tomada por una condición;
- contenido de `state`;
- resultado de un filtro;
- orden de ejecución.

## 7.3 Revisión de código con IA

Utiliza esta solicitud al terminar una función:

```text
Revisa esta función de JavaScript para una aplicación sin frameworks.

Evalúa:
- claridad del nombre;
- responsabilidad única;
- manejo de valores nulos;
- seguridad al insertar contenido;
- accesibilidad de los cambios en el DOM;
- estados no considerados;
- facilidad de prueba.

No propongas patrones avanzados ni dependencias.
Crea una tabla con problema, impacto, cambio mínimo y prueba.
No reescribas la función completa.

[Función]
```

Registra:

| Evidencia | Contenido |
|---|---|
| Problema | Qué fallaba o qué se revisó. |
| Solicitud | Instrucción enviada. |
| Respuesta útil | Recomendación concreta. |
| Decisión | Aceptada, modificada o rechazada. |
| Prueba | Cómo se comprobó. |
| Aprendizaje | Qué puedes explicar ahora. |

### Práctica guiada 10 — Diagnóstico con punto de interrupción

1. Crea temporalmente un error en el filtro de categoría.
2. Coloca un punto de interrupción dentro de `getVisibleCourses`.
3. Observa `state.category` y `course.category`.
4. Identifica la diferencia.
5. Escribe tu hipótesis antes de consultar a la IA.
6. Solicita una revisión usando la evidencia.
7. Corrige y prueba.
8. Registra el proceso en la bitácora.

### Video recomendado

[Debugging profesional en JavaScript con DevTools — Programación en español (23 min)](https://www.youtube.com/watch?v=ps1WhgelV_E)

---

# 8. Mini proyecto — Preguntas frecuentes accesibles

## Objetivo

Construir una sección de preguntas frecuentes que pueda incorporarse al proyecto final del módulo.

## Resultado esperado

```text
Preguntas frecuentes

┌────────────────────────────────────────────┐
│ ¿Necesito experiencia previa?          [+] │
├────────────────────────────────────────────┤
│ ¿Cuánto dura el curso?                 [+] │
├────────────────────────────────────────────┤
│ ¿Recibiré un certificado?              [+] │
└────────────────────────────────────────────┘
```

Al activar una pregunta:

```text
┌────────────────────────────────────────────┐
│ ¿Necesito experiencia previa?          [−] │
├────────────────────────────────────────────┤
│ Debes haber aprobado un curso básico de    │
│ programación.                              │
└────────────────────────────────────────────┘
```

## Requisitos

- Al menos cuatro preguntas.
- Cada encabezado utiliza un `<button>`.
- Cada botón tiene `aria-expanded`.
- Cada botón se relaciona con su respuesta mediante `aria-controls`.
- Las respuestas cerradas utilizan `hidden`.
- Solo una respuesta permanece abierta a la vez.
- Funciona con ratón y teclado sin programar teclas adicionales.
- Utiliza delegación de eventos.
- JavaScript cambia estado; CSS controla la apariencia.

## Estructura recomendada

```html
<section class="faq" aria-labelledby="faq-title">
  <h2 id="faq-title">Preguntas frecuentes</h2>

  <div data-faq-list>
    <article class="faq-item">
      <h3>
        <button
          type="button"
          aria-expanded="false"
          aria-controls="answer-prerequisites"
          data-faq-button
        >
          ¿Necesito experiencia previa?
        </button>
      </h3>

      <div id="answer-prerequisites" hidden>
        <p>Debes haber aprobado un curso básico de programación.</p>
      </div>
    </article>
  </div>
</section>
```

## Proceso

### Paso 1. Construye el HTML

Comprueba que las preguntas se leen incluso sin CSS.

### Paso 2. Define el estado inicial

Todos los botones comienzan con `aria-expanded="false"` y todas las respuestas con `hidden`.

### Paso 3. Escucha en el contenedor

Utiliza `closest("[data-faq-button]")` para identificar el botón.

### Paso 4. Cierra la pregunta anterior

Recorre los botones y cierra los que no correspondan al botón activado.

### Paso 5. Abre o cierra la seleccionada

Actualiza `aria-expanded` y `hidden`.

### Paso 6. Prueba con teclado

Utiliza `Tab`, `Shift + Tab`, `Enter` y la barra espaciadora.

### Paso 7. Revisa con IA

Solicita una auditoría de accesibilidad. Comprueba cada recomendación con documentación.

## Restricciones

- No utilices una biblioteca de componentes.
- No uses un `<div>` como botón.
- No dependas únicamente de un cambio de color.
- No programes manualmente un comportamiento que `<button>` ya ofrece.

## Entregable

Conserva esta sección dentro de la landing. Formará parte del proyecto del módulo.

## Lista de comprobación

- [ ] Cada pregunta utiliza un botón real.
- [ ] `aria-expanded` coincide con el estado visual.
- [ ] `aria-controls` apunta a un identificador existente.
- [ ] Las respuestas cerradas tienen `hidden`.
- [ ] Solo una respuesta permanece abierta.
- [ ] Puedo utilizar toda la sección con teclado.
- [ ] No aparecen errores en la consola.
- [ ] Puedo explicar la delegación de eventos utilizada.

[Entregar el mini proyecto del Módulo 2](https://forms.gle/BayPBDiXAGurWjnL6)

---


<!-- coa-activity:desarrollo-web-m2-mini-proyecto -->

# 9. Proyecto del módulo — Explorador interactivo de cursos COA

## Desafío

Convierte la landing page aprobada en el Módulo 1 en un explorador interactivo de cursos. La aplicación debe cargar sus datos, crear las tarjetas, responder a búsquedas y filtros, conservar favoritos, validar una solicitud de inscripción e informar claramente todos sus estados.

El resultado seguirá utilizando HTML, CSS y JavaScript sin frameworks. En el Módulo 3 reconstruirás ideas semejantes con React.

## Requisitos funcionales

### 1. Catálogo basado en datos

- Los cursos se guardan en `data/courses.json`.
- Existen al menos seis cursos.
- Cada curso tiene identificador, título, categoría, descripción, duración y nivel.
- Las tarjetas se crean desde una plantilla o mediante métodos del DOM.
- Los datos se insertan de forma segura.

### 2. Carga asíncrona

- Los datos se cargan con `fetch`.
- Se comprueba `response.ok`.
- Existe un estado de carga.
- Existe un estado de error.
- El error incluye una acción de reintento.
- Existe un estado vacío.

### 3. Búsqueda

- Busca al menos por título y descripción.
- Ignora mayúsculas, minúsculas y espacios exteriores.
- Actualiza resultados mientras se escribe.
- Muestra la cantidad de resultados.

### 4. Filtro de categoría

- Incluye la opción “Todas”.
- Funciona simultáneamente con la búsqueda.
- No recarga la página.

### 5. Favoritos

- Cada tarjeta contiene un botón.
- El botón utiliza `aria-pressed`.
- El texto cambia según el estado.
- La tarjeta recibe una diferencia visual que no depende solo del color.
- Los identificadores se guardan en `localStorage`.
- Los favoritos permanecen después de actualizar.

### 6. Preguntas frecuentes

Integra el mini proyecto completo.

### 7. Menú adaptable

- El botón existe en pantallas estrechas.
- Utiliza `aria-expanded`.
- La navegación permanece usable sin ratón.
- No afecta el diseño de pantalla amplia.

### 8. Formulario

- Incluye nombre, correo, curso y confirmación.
- Utiliza validación HTML.
- El envío se maneja con JavaScript.
- No recarga la página.
- Muestra confirmación mediante una región `aria-live`.
- No almacena los datos personales.

### 9. Estado vacío

Cuando no existen coincidencias:

- aparece un mensaje claro;
- el contador se actualiza;
- la persona puede modificar o limpiar filtros.

### 10. Manejo de errores

La aplicación no debe quedar en blanco si falla la carga. Debe explicar el problema sin mostrar detalles técnicos innecesarios.

## Requisitos de código

- JavaScript ES6+.
- Script cargado como módulo.
- Ningún evento escrito como atributo HTML.
- Funciones con responsabilidades concretas.
- Un objeto `state` o una estructura equivalente.
- Separación entre datos, estado y representación.
- Selectores claros mediante `data-*` cuando corresponda.
- Inserción de textos externos mediante `textContent`.
- Delegación de eventos en el catálogo.
- `try`, `catch` y `finally` para la carga.
- Lectura segura de `localStorage`.
- Sin variables globales accidentales.
- Sin errores en la consola.
- Sin dependencias ni frameworks.

## Estructura sugerida

```text
coa-landing/
├── assets/
│   └── images/
├── data/
│   └── courses.json
├── js/
│   └── main.js
├── index.html
├── styles.css
└── README.md
```

Puedes dividir `main.js` en archivos adicionales si cada separación tiene una razón clara. No fragmentes el código únicamente para aumentar la cantidad de archivos.

## Flujo recomendado

### Fase 1. Conserva una versión funcional

Crea la rama y confirma que la landing original funciona antes de añadir JavaScript.

### Fase 2. Añade puntos de conexión

Incorpora los atributos `data-*`, plantillas, controles y mensajes de estado.

### Fase 3. Crea datos válidos

Escribe `courses.json` y comprueba su sintaxis. Un JSON no admite comentarios ni comas finales.

### Fase 4. Implementa la carga

Construye primero los estados de carga, éxito y error.

### Fase 5. Renderiza

Crea una tarjeta, después una lista completa.

### Fase 6. Añade búsqueda y categoría

Implementa cada filtro por separado y después combínalos.

### Fase 7. Añade favoritos

Comienza con el estado en memoria. Añade `localStorage` cuando el botón ya funcione.

### Fase 8. Integra el mini proyecto

Añade la sección de preguntas frecuentes sin duplicar manejadores.

### Fase 9. Maneja el formulario

Prueba envíos válidos e inválidos.

### Fase 10. Depura

Prueba los estados difíciles deliberadamente.

### Fase 11. Revisa con IA

Solicita revisiones específicas y conserva evidencia de tus decisiones.

### Fase 12. Limpia y documenta

Elimina pruebas temporales, actualiza README y revisa los commits.

## Plan de pruebas obligatorio

| Caso | Acción | Resultado esperado |
|---|---|---|
| Carga normal | Abrir la aplicación | Aparece el indicador y luego las tarjetas. |
| Error de carga | Cambiar temporalmente la ruta JSON | Aparece el mensaje y el botón de reintento. |
| Búsqueda exacta | Escribir un título | Solo aparece el curso correspondiente. |
| Búsqueda sin coincidencias | Escribir texto inexistente | Aparece el estado vacío. |
| Filtros combinados | Buscar y cambiar categoría | Se cumplen ambas condiciones. |
| Favorito | Activar una tarjeta | Cambian texto, estilo y `aria-pressed`. |
| Persistencia | Actualizar la página | El favorito permanece. |
| Formulario inválido | Enviar vacío | El navegador solicita correcciones. |
| Formulario válido | Completar y enviar | Aparece la confirmación sin recarga. |
| FAQ | Abrir dos preguntas | Solo la última permanece abierta. |
| Teclado | Recorrer controles | El foco es visible y el orden lógico. |
| Pantalla estrecha | Probar a 320 px | No existe desbordamiento horizontal. |

## Uso obligatorio de inteligencia artificial

Documenta al menos tres usos diferentes:

1. Diagnóstico de un error real.
2. Revisión de una función.
3. Auditoría de accesibilidad o estados no considerados.

Por cada uso registra:

- herramienta;
- contexto;
- solicitud;
- recomendación;
- decisión;
- prueba;
- aprendizaje.

No se aceptará como evidencia:

- pedir la aplicación completa;
- copiar una respuesta sin explicación;
- afirmar que funciona sin probarla;
- entregar código que no puedes explicar.

## Historial mínimo de Git

Crea al menos siete commits descriptivos. Ejemplo:

```text
Configura JavaScript como módulo
Carga los cursos desde JSON
Renderiza tarjetas desde una plantilla
Implementa búsqueda y filtro de categoría
Guarda favoritos en el navegador
Integra preguntas frecuentes accesibles
Valida el formulario sin recargar la página
Añade estados de error y reintento
Documenta pruebas y uso de IA
```

## README

Incluye:

- descripción;
- funciones implementadas;
- tecnologías;
- instrucciones para ejecutar con servidor local;
- estructura del proyecto;
- plan de pruebas;
- limitaciones conocidas;
- aprendizajes principales.

## Entrega

Envía en el punto de entrega del módulo:

1. Enlace público al repositorio.
2. Captura del catálogo con resultados.
3. Captura del estado vacío o de error.
4. Captura de un curso favorito después de actualizar la página.
5. Bitácora de uso de IA.
6. Plan de pruebas completado con resultado real.
7. Reflexión de entre 120 y 200 palabras:
   - cómo conectaste datos, estado y DOM;
   - cuál fue el error más importante;
   - qué evidencia permitió resolverlo;
   - qué parte podrás reconocer cuando trabajes con React.

Abre el repositorio en una ventana privada antes de enviar y comprueba que puede consultarse.

[Entregar el proyecto del Módulo 2](https://forms.gle/BayPBDiXAGurWjnL6)

## Condición de avance

El proyecto debe ser aprobado por el instructor. Si recibe observaciones:

1. reproduce cada problema;
2. crea una corrección;
3. prueba el caso;
4. registra un commit descriptivo;
5. actualiza la entrega.

El Módulo 3 permanecerá bloqueado hasta que el proyecto y la evaluación estén aprobados.

---

# 10. Rúbrica de evaluación del proyecto

**Puntaje total:** 100 puntos  
**Puntaje mínimo de aprobación:** 75 puntos

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| **Funcionalidad** | Búsqueda, filtro, favoritos, FAQ, menú y formulario funcionan en todos los casos solicitados. | Existe un problema menor que no bloquea el uso principal. | Varias funciones son inestables o incompletas. | Las funciones principales no operan. | 25 |
| **DOM y representación de datos** | Los datos están separados, las tarjetas se crean de forma segura y la representación es consistente. | La representación funciona con pequeñas repeticiones o detalles mejorables. | Mezcla excesiva de datos y presentación o uso inseguro puntual. | Contenido escrito manualmente o manipulación insegura generalizada. | 15 |
| **Eventos y formularios** | Eventos bien elegidos, delegación correcta y formulario accesible sin recarga. | Funciona con detalles menores de organización o mensajes. | Hay manejadores duplicados, validación débil o estados confusos. | Interacciones inaccesibles o formulario no funcional. | 15 |
| **Carga asíncrona y errores** | Controla carga, éxito, vacío, error y reintento; comprueba la respuesta. | Funciona con un estado secundario mejorable. | Manejo parcial de errores o mensajes insuficientes. | No usa Fetch correctamente o la aplicación queda en blanco. | 15 |
| **Accesibilidad e interfaz** | Foco visible, botones nativos, estados ARIA coherentes y mensajes anunciables. | Presenta uno o dos problemas menores. | Varias barreras requieren corrección. | Las interacciones principales no pueden usarse con teclado o no comunican su estado. | 10 |
| **Calidad y organización** | Funciones claras, estado centralizado, selectores comprensibles y consola limpia. | Código comprensible con repetición menor. | Funciones extensas, nombres confusos o responsabilidades mezcladas. | Código difícil de seguir o con errores constantes. | 10 |
| **Git y documentación** | README completo, repositorio accesible y siete o más commits descriptivos. | Repositorio correcto con documentación o historial mejorable. | README incompleto o commits poco informativos. | Repositorio inaccesible o sin historial útil. | 5 |
| **Uso responsable de IA** | Tres usos documentados con evidencia, decisiones y pruebas propias. | Cumple los usos con análisis breve. | Evidencia parcial o poco razonada. | Código copiado sin comprensión o sin bitácora. | 5 |
|  |  |  |  | **Total** | **100** |

## Requisitos críticos

El proyecto deberá corregirse aunque alcance 75 puntos si:

- el repositorio no puede abrirse;
- el catálogo no carga;
- los errores dejan la interfaz en blanco;
- la búsqueda o el filtro no funcionan;
- se insertan datos externos directamente con `innerHTML`;
- el formulario recarga la página sin intención;
- los favoritos no reflejan su estado de forma accesible;
- las funciones principales no pueden utilizarse con teclado;
- existen errores activos en la consola;
- se incluyen contraseñas, tokens o datos personales en el repositorio;
- se utiliza un framework;
- el estudiante no puede explicar una parte sustancial del código;
- no existe evidencia razonada de IA.

---


<!-- coa-activity:desarrollo-web-m2-proyecto -->

# 11. Evaluación del módulo

**Cantidad de preguntas:** 10  
**Puntaje mínimo:** 70%  
**Intentos:** puedes revisar el módulo antes de volver a intentarlo.

## Pregunta 1

¿Qué representa el DOM?

A. El historial de Git.  
B. La representación del documento que el navegador expone como objetos.  
C. Una base de datos remota.  
D. Una hoja de estilos.

## Pregunta 2

¿Qué devuelve `document.querySelector()` cuando no encuentra coincidencias?

A. Una lista vacía.  
B. `false`.  
C. `null`.  
D. Un elemento nuevo.

## Pregunta 3

¿Cuál es la opción más segura para insertar una descripción recibida como texto?

A. `element.innerHTML = description`.  
B. `element.textContent = description`.  
C. `document.write(description)`.  
D. Convertirla en un evento.

## Pregunta 4

¿Qué secuencia describe mejor el manejo de una interacción?

A. Renderizar, borrar los datos y después escuchar.  
B. Evento, actualizar estado, calcular resultado y representar.  
C. Cambiar CSS, crear un repositorio y cerrar la página.  
D. Guardar todo en localStorage antes de leerlo.

## Pregunta 5

¿Por qué es útil la delegación de eventos en el catálogo?

A. Porque evita utilizar HTML.  
B. Porque un contenedor puede manejar acciones de tarjetas creadas dinámicamente.  
C. Porque convierte eventos en estilos CSS.  
D. Porque envía datos a un servidor.

## Pregunta 6

¿Cuál es el primer nivel recomendado de validación de un correo obligatorio?

A. Una expresión regular extensa generada por IA.  
B. `type="email"` y `required` en HTML.  
C. Guardar el correo en localStorage.  
D. Utilizar un `<div>`.

## Pregunta 7

¿Qué comprobación debe realizarse después de `fetch()`?

A. `response.ok`.  
B. `response.classList`.  
C. `response.localStorage`.  
D. `response.addEventListener`.

## Pregunta 8

¿Qué bloque se ejecuta tanto si la operación tiene éxito como si falla?

A. `try`.  
B. `catch`.  
C. `finally`.  
D. `filter`.

## Pregunta 9

¿Qué dato es apropiado para `localStorage` en este proyecto?

A. Una contraseña.  
B. Un token de acceso.  
C. Una lista de identificadores de cursos favoritos.  
D. Los datos personales del formulario.

## Pregunta 10

¿Cuál es la mejor solicitud para diagnosticar con IA?

A. “No funciona; haz todo de nuevo”.  
B. Enviar todo el repositorio sin explicar el problema.  
C. Proporcionar comportamiento esperado, resultado observado, error, código mínimo y pruebas realizadas.  
D. Pedir que confirme que el código funciona sin ejecutarlo.

---

# 12. Retos adicionales

Realiza estos retos después de cumplir los requisitos obligatorios.

## Reto 1 — Limpiar filtros

Añade un botón “Limpiar filtros” que:

- vacíe la búsqueda;
- seleccione “Todas”;
- actualice el estado;
- represente todos los cursos;
- devuelva el foco al campo de búsqueda.

## Reto 2 — Mostrar solo favoritos

Añade un control para mostrar únicamente favoritos. Debe combinarse con búsqueda y categoría.

## Reto 3 — Ordenar resultados

Permite ordenar por:

- título;
- duración menor a mayor;
- duración mayor a menor.

No modifiques el orden original de `state.courses` directamente.

## Reto 4 — Enlace compartible

Investiga `URLSearchParams` y representa la búsqueda en la dirección:

```text
?query=python&category=Programación
```

Al actualizar, la aplicación debe restaurar esos filtros.

## Reto 5 — Cancelar una solicitud

Investiga `AbortController`. Añádelo únicamente si puedes explicar cuándo evita trabajo innecesario.

---

# 13. Videos recomendados del módulo

| Tema | Video | Canal | Duración |
|---|---|---|---:|
| DOM | [¿Qué es el DOM?](https://www.youtube.com/watch?v=4ILE0y58J00) | TodoCode | 12 min 59 s |
| Eventos | [Eventos en JavaScript: qué son y cómo escucharlos](https://www.youtube.com/watch?v=6ZKl3feb22I) | Navis Code | 6 min 42 s |
| Formularios | [Validar formularios con JavaScript y HTML](https://www.youtube.com/watch?v=bHuL0VvGZO0) | Parzibyte | 9 min 59 s |
| Fetch | [Fetch API con JavaScript, async y await](https://www.youtube.com/watch?v=cxbtYhXV78I) | Mau Developer | 6 min 8 s |
| Depuración | [Debugging profesional en JavaScript con DevTools](https://www.youtube.com/watch?v=ps1WhgelV_E) | Programación en español | 23 min |

Pausa cada video y reproduce sus ideas en tu proyecto. Mirar una explicación sin escribir, probar y modificar código no sustituye la práctica.

---

# 14. Documentación y recursos de lectura

## Nivel esencial

- [Descargar la versión LTS de Node.js — sitio oficial](https://nodejs.org/en/download)
- [¿Qué es JavaScript? — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/What_is_JavaScript)
- [Document.querySelector — MDN](https://developer.mozilla.org/es/docs/Web/API/Document/querySelector)
- [Element.classList — MDN](https://developer.mozilla.org/es/docs/Web/API/Element/classList)
- [Introducción a los eventos — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Events)

## Representación e interacción

- [Document.createElement — MDN](https://developer.mozilla.org/es/docs/Web/API/Document/createElement)
- [EventTarget.addEventListener — MDN](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener)
- [Buenas prácticas de accesibilidad con CSS y JavaScript — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript)

## Formularios

- [Formularios y botones en HTML — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/HTML_forms)
- [Validación de formularios — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/Form_validation)

## Datos asíncronos

- [Uso de Fetch — MDN](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch)
- [Funciones async — MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function)

## Persistencia

- [API de almacenamiento web — MDN](https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API)

La documentación es una herramienta de consulta. Busca primero el método concreto, revisa su sintaxis y modifica los ejemplos para comprobar que los comprendiste.

---

# 15. Errores comunes

## El selector devuelve null

Comprueba:

- ruta del script;
- nombre del atributo o clase;
- existencia del elemento;
- mayúsculas y minúsculas;
- página correcta;
- momento de ejecución.

## El clic no funciona en tarjetas nuevas

Comprueba si:

- los botones se crearon después de registrar manejadores individuales;
- puedes utilizar delegación en el contenedor;
- el selector de `closest()` coincide;
- otro elemento cubre visualmente el botón.

## La página se recarga al enviar

Comprueba:

- evento `submit`;
- llamada a `event.preventDefault()`;
- errores ocurridos antes de esa línea;
- botón con `type="submit"`.

## Fetch muestra error

Comprueba:

- servidor local activo;
- ruta y nombre del JSON;
- sintaxis JSON;
- panel Network;
- `response.ok`;
- diferencia entre 404, error de red y JSON inválido.

## Los favoritos desaparecen

Comprueba:

- llamada a `localStorage.setItem`;
- uso de `JSON.stringify`;
- lectura durante la inicialización;
- uso de la misma clave;
- identificadores iguales a los del JSON.

## El estado visual y ARIA no coinciden

Actualiza desde una sola función:

- clase visual;
- texto del botón;
- `aria-pressed` o `aria-expanded`;
- contenido visible u oculto.

---

# 16. Glosario

**API del navegador:** conjunto de objetos y métodos que el navegador pone a disposición de JavaScript.

**Asincronía:** capacidad de iniciar una operación y continuar trabajando mientras se espera su resultado.

**Burbujeo:** propagación de un evento desde el elemento donde se originó hacia sus ancestros.

**Callback:** función que se entrega para que otra operación la ejecute en un momento determinado.

**DOM:** representación en forma de objetos y árbol del documento cargado.

**Delegación de eventos:** estrategia que permite manejar eventos de descendientes desde un contenedor.

**Estado:** información actual que determina qué debe mostrar y cómo debe comportarse la interfaz.

**Evento:** señal que informa que ocurrió una acción o cambio.

**Fetch:** API del navegador para solicitar recursos.

**FormData:** interfaz que permite leer los valores de un formulario.

**JSON:** formato textual utilizado para intercambiar datos estructurados.

**localStorage:** almacenamiento persistente de cadenas asociado con el origen de un sitio.

**Módulo JavaScript:** archivo con ámbito propio que puede importar y exportar funcionalidades.

**Promise:** objeto que representa el resultado futuro de una operación asíncrona.

**Representar o renderizar:** convertir datos y estado en elementos visibles de la interfaz.

**Selector:** expresión utilizada para localizar elementos del DOM.

**Estado vacío:** representación explícita de una colección sin resultados.

**Punto de interrupción:** marca que pausa la ejecución para inspeccionar valores y flujo.

---

# 17. Resumen del módulo

En este módulo transformaste una página estática en una aplicación interactiva.

Aprendiste que:

- el DOM es la representación que JavaScript puede consultar y modificar;
- los datos deben permanecer separados de la presentación;
- una plantilla puede convertirse en muchas tarjetas;
- los eventos actualizan el estado;
- el estado determina qué se representa;
- la delegación simplifica acciones en contenido dinámico;
- HTML ofrece una primera capa de validación;
- `fetch`, `async` y `await` permiten cargar información sin congelar la interfaz;
- toda carga necesita estados de espera, éxito, vacío y error;
- `localStorage` sirve para preferencias pequeñas y no sensibles;
- la consola, el panel de red y los puntos de interrupción aportan evidencia;
- una IA resulta más útil cuando recibe un problema reproducible y una solicitud limitada.

## Habilidades obtenidas

Al aprobar el módulo podrás:

- construir interfaces desde colecciones de datos;
- conectar controles con lógica;
- implementar filtros y búsquedas;
- manejar formularios sin recargar;
- cargar JSON y responder a errores;
- conservar preferencias;
- crear interacciones accesibles;
- diagnosticar problemas;
- revisar propuestas de IA con criterio propio.

## Antes de continuar

Confirma que completaste:

- [ ] Las diez prácticas guiadas.
- [ ] El mini proyecto.
- [ ] El explorador interactivo de cursos.
- [ ] Los cuatro estados de carga.
- [ ] El plan de pruebas.
- [ ] La bitácora de tres usos de IA.
- [ ] El repositorio y el README.
- [ ] La evaluación.
- [ ] Las correcciones solicitadas.
- [ ] La aprobación del instructor.

Cuando el proyecto esté aprobado, estarás preparado para trabajar con componentes, propiedades y estado en el Módulo 3: React.
