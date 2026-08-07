# COA — Cursos Online Avanzados

## Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial

# Módulo 3. React: componentes, propiedades y estado

**Duración aproximada:** 7 horas  
**Modalidad:** práctica guiada, ejercicios, mini proyecto y proyecto de módulo  
**Tecnologías:** React, JavaScript ES6+, Vite, HTML5, CSS3, Git, GitHub, ChatGPT o Claude  
**Resultado principal:** el explorador interactivo de cursos COA reconstruido como una aplicación React

---

## Bienvenida

En el módulo anterior construiste una interfaz interactiva con JavaScript. Aprendiste a consultar el DOM, escuchar eventos, cargar datos, aplicar filtros, guardar favoritos y representar distintos estados de la aplicación.

Ese proyecto funciona, pero conforme una interfaz crece también aumenta la cantidad de elementos que deben mantenerse sincronizados. Si cambia la lista de cursos, deben actualizarse las tarjetas. Si cambia un filtro, debe cambiar el contador. Si se marca un favorito, deben actualizarse el botón, la lista visible y el almacenamiento local.

React propone una manera diferente de organizar ese trabajo:

> **La interfaz se describe como una función del estado.**

En lugar de indicar manualmente cada cambio que debe hacerse en el DOM, se conservan los datos importantes en el estado y React actualiza la representación visual.

```text
Datos + estado actual
         │
         ▼
 Componentes de React
         │
         ▼
 Interfaz actualizada
```

Durante este módulo reconstruirás el explorador del Módulo 2 con React. No se trata de copiar el proyecto anterior dentro de una herramienta nueva. El objetivo es comprender qué problemas resuelven los componentes, las propiedades y el estado, y aprender a tomar decisiones correctas sobre la organización de una aplicación.

No estudiarás características avanzadas ni bibliotecas adicionales. Trabajarás únicamente con lo necesario para crear interfaces modernas:

- componentes;
- JSX;
- propiedades;
- listas y condiciones;
- eventos;
- estado con `useState`;
- formularios controlados;
- comunicación entre componentes;
- efectos necesarios con `useEffect`;
- carga de datos con `fetch`;
- persistencia con `localStorage`;
- depuración y revisión asistida por IA.

> **Principio del módulo:** React no reemplaza tu conocimiento de JavaScript, HTML o CSS. Los organiza para construir interfaces mediante componentes reutilizables y estado predecible.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Explicar qué problema resuelve React en una interfaz.
- Crear un proyecto React moderno con Vite.
- Reconocer la función de `index.html`, `main.jsx` y `App.jsx`.
- Escribir JSX válido y diferenciarlo de HTML.
- Diseñar componentes pequeños con una responsabilidad clara.
- Enviar información a un componente mediante propiedades.
- Representar listas con `map` y claves estables.
- Aplicar renderizado condicional.
- Responder a eventos sin manipular el DOM directamente.
- Crear estado con `useState`.
- Actualizar listas y objetos sin mutarlos.
- Diferenciar estado, propiedades y valores derivados.
- Elevar el estado cuando varios componentes necesitan compartirlo.
- Construir formularios controlados.
- Utilizar `useEffect` solamente para sincronizar la aplicación con sistemas externos.
- Cargar datos JSON y representar estados de carga, error, vacío y éxito.
- Guardar preferencias no sensibles en `localStorage`.
- Interpretar errores frecuentes de React.
- Utilizar las herramientas de desarrollo del navegador y React Developer Tools.
- Pedir ayuda a una IA con contexto suficiente y comprobar cada propuesta.
- Organizar una aplicación React sin depender de bibliotecas innecesarias.

---

## Producto que construirás

El proyecto aprobado del módulo anterior se convertirá en una aplicación organizada mediante componentes:

```text
App
├── SiteHeader
├── Hero
├── CourseExplorer
│   ├── CourseFilters
│   ├── StatusMessage
│   └── CourseList
│       └── CourseCard
├── Faq
│   └── FaqItem
├── EnrollmentForm
└── Footer
```

La aplicación conservará las funciones principales:

- cargar cursos desde un archivo JSON;
- buscar cursos por texto;
- filtrar por categoría;
- mostrar el número de resultados;
- marcar y desmarcar favoritos;
- conservar los favoritos en el navegador;
- abrir y cerrar preguntas frecuentes;
- validar un formulario de inscripción;
- mostrar estados de carga, error y ausencia de resultados;
- funcionar correctamente en pantallas pequeñas y grandes.

La diferencia estará en la arquitectura. Cada parte de la interfaz tendrá una responsabilidad clara y recibirá solamente los datos que necesita.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Modelo mental de React y preparación con Vite | 30 minutos |
| 2. Componentes y JSX | 50 minutos |
| 3. Propiedades, listas y renderizado condicional | 45 minutos |
| 4. Eventos y estado con `useState` | 55 minutos |
| 5. Estado compartido y formularios controlados | 45 minutos |
| 6. Efectos, carga de datos y persistencia | 45 minutos |
| 7. Depuración y uso responsable de IA | 15 minutos |
| 8. Mini proyecto: selector de cursos | 30 minutos |
| 9. Proyecto del módulo: explorador COA en React | 90 minutos |
| 10. Evaluación y cierre | 15 minutos |
| **Total** | **7 horas** |

Los tiempos son orientativos. Detente cuando un concepto no esté claro, ejecuta cada ejemplo y completa los ejercicios antes de continuar.

---

# 1. Modelo mental de React y preparación con Vite

## 1.1 ¿Por qué utilizar React?

Imagina un tablero de llegadas en un aeropuerto. El tablero debe cambiar cuando:

- llega nueva información;
- un vuelo se retrasa;
- cambia una puerta;
- se aplica un filtro;
- una persona busca un destino.

Una opción sería localizar manualmente cada texto de la pantalla y modificarlo. Otra opción sería conservar una fuente de datos y declarar cómo debe verse cada vuelo. Cuando los datos cambian, el tablero vuelve a representarse correctamente.

React utiliza la segunda idea.

En JavaScript tradicional realizaste acciones como estas:

```js
const title = document.querySelector(".course-title");
title.textContent = course.title;
```

En React describes el resultado esperado:

```jsx
function CourseTitle({ title }) {
  return <h3 className="course-title">{title}</h3>;
}
```

Cuando `title` cambia, React actualiza la parte necesaria de la interfaz.

React aporta tres ideas fundamentales:

1. **Componentes:** la interfaz se divide en piezas con responsabilidades claras.
2. **Datos declarativos:** describes cómo debe verse la interfaz según los datos.
3. **Estado:** React conserva información que puede cambiar y actualiza la interfaz cuando cambia.

React no sustituye:

- la estructura semántica de HTML;
- el diseño adaptable de CSS;
- la lógica de JavaScript;
- la accesibilidad;
- la validación;
- el razonamiento del desarrollador.

## 1.2 Declarativo e imperativo

Una instrucción imperativa describe los pasos exactos:

```text
1. Busca el contenedor.
2. Borra sus elementos.
3. Crea una tarjeta por curso.
4. Agrega cada tarjeta al contenedor.
5. Cambia el contador.
```

Una descripción declarativa expresa el resultado:

```text
Para cada curso visible, muestra una CourseCard.
Muestra como contador la cantidad de cursos visibles.
```

React no elimina la lógica. Todavía debes calcular cuáles cursos son visibles, decidir dónde vive el estado y controlar qué ocurre ante un error.

## 1.3 Preparación del entorno

Necesitas:

- una versión LTS vigente de [Node.js](https://nodejs.org/en/download);
- Visual Studio Code u otro editor;
- Git;
- un navegador moderno;
- acceso a una terminal.

Comprueba Node y npm:

```bash
node --version
npm --version
```

Si Vite informa que la versión de Node no es compatible, instala la versión LTS actual y vuelve a ejecutar el comando. No ignores una advertencia de compatibilidad.

## 1.4 Crear el proyecto

Abre la terminal en la carpeta donde guardas tus proyectos y ejecuta:

```bash
npm create vite@latest coa-react -- --template react
cd coa-react
npm install
npm run dev
```

La terminal mostrará una dirección local. Ábrela en el navegador.

`npm` es el administrador de paquetes incluido con Node. Vite prepara el entorno de desarrollo y el proceso de construcción. React es la biblioteca con la que crearás la interfaz.

| Comando | Propósito |
|---|---|
| `npm install` | Instala las dependencias declaradas por el proyecto. |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión optimizada del proyecto. |
| `npm run preview` | Permite revisar localmente la versión construida. |

No edites archivos dentro de `node_modules`. Esa carpeta contiene dependencias administradas por npm.

## 1.5 Archivos esenciales

La plantilla contiene varios archivos. En este módulo debes comprender especialmente:

```text
coa-react/
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

### `index.html`

Contiene el punto donde React insertará la aplicación:

```html
<div id="root"></div>
```

### `src/main.jsx`

Conecta React con ese elemento:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Esta conexión inicial es una excepción necesaria. Dentro de los componentes no utilizarás `querySelector` para controlar la interfaz.

### `src/App.jsx`

Es el componente principal:

```jsx
function App() {
  return <h1>Explorador de cursos COA</h1>;
}

export default App;
```

### `package.json`

Registra dependencias y comandos del proyecto. No es necesario memorizarlo, pero sí reconocer que describe cómo se ejecuta la aplicación.

## 1.6 Primera limpieza

Elimina del contenido de `App.jsx` los elementos demostrativos que no utilizarás. Conserva una estructura mínima y reemplaza los estilos de ejemplo.

No borres archivos sin comprender si todavía están importados. Si eliminas un archivo, elimina también su importación.

### Comprobación

La preparación está completa si:

- el servidor inicia sin errores;
- el navegador muestra tu propio título;
- la consola no contiene errores;
- puedes modificar `App.jsx` y observar el cambio;
- comprendes la relación entre `index.html`, `main.jsx` y `App.jsx`.

### Ejercicio 1. Inspección del proyecto

Abre `main.jsx`, `App.jsx` y `package.json`. Escribe en un archivo `notas-modulo-3.md` una explicación de una o dos frases para cada archivo. Después cambia temporalmente el nombre del componente importado en `main.jsx`, observa el error que aparece y restaura el nombre correcto. Registra qué parte del mensaje te permitió localizar el problema.

---

# 2. Componentes y JSX

## 2.1 ¿Qué es un componente?

Un componente es una función de JavaScript que devuelve una parte de la interfaz.

```jsx
function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio">
        COA
      </a>
      <nav aria-label="Navegación principal">
        <a href="#cursos">Cursos</a>
        <a href="#preguntas">Preguntas</a>
      </nav>
    </header>
  );
}
```

Para utilizarlo:

```jsx
function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <h1>Aprende desarrollo web moderno</h1>
      </main>
    </>
  );
}
```

Los nombres de componentes comienzan con mayúscula. Así React diferencia un componente propio, como `<SiteHeader />`, de un elemento HTML, como `<header>`.

## 2.2 Componentes como piezas de una interfaz

Una página no debe convertirse en un único componente de cientos de líneas. Tampoco conviene crear un componente para cada párrafo.

Una parte suele merecer un componente cuando:

- tiene una responsabilidad reconocible;
- se repite;
- recibe datos;
- contiene interacción propia;
- puede probarse de manera separada;
- su nombre ayuda a comprender la página.

```text
Pregunta útil:

¿Puedo nombrar esta parte por lo que hace?

Sí  ──► probablemente puede ser un componente.
No  ──► quizá todavía es solo una parte del marcado.
```

## 2.3 JSX no es HTML

JSX permite escribir una estructura parecida a HTML dentro de JavaScript. Vite transforma esa sintaxis para que React pueda interpretarla.

Reglas esenciales:

### Devolver un único elemento raíz

Esto no es válido:

```jsx
return (
  <h2>Cursos</h2>
  <p>Selecciona una opción.</p>
);
```

Puedes utilizar un contenedor:

```jsx
return (
  <section>
    <h2>Cursos</h2>
    <p>Selecciona una opción.</p>
  </section>
);
```

O un fragmento:

```jsx
return (
  <>
    <h2>Cursos</h2>
    <p>Selecciona una opción.</p>
  </>
);
```

### Cerrar todas las etiquetas

```jsx
<img src="/images/course.webp" alt="" />
<input type="search" />
```

### Utilizar `className`

```jsx
<article className="course-card">...</article>
```

### Utilizar `htmlFor` en las etiquetas de formulario

```jsx
<label htmlFor="search">Buscar cursos</label>
<input id="search" type="search" />
```

### Escribir atributos y eventos con la forma esperada por React

```jsx
<button onClick={handleClick}>Guardar</button>
```

## 2.4 Expresiones dentro de llaves

Las llaves permiten utilizar expresiones de JavaScript:

```jsx
function CourseSummary() {
  const title = "React";
  const duration = 7;

  return (
    <article>
      <h3>{title}</h3>
      <p>Duración: {duration} horas</p>
      <p>{duration >= 6 ? "Curso completo" : "Curso breve"}</p>
    </article>
  );
}
```

Dentro de las llaves puedes utilizar:

- nombres de variables;
- acceso a propiedades;
- llamadas a funciones que devuelven un valor;
- operaciones;
- operadores condicionales;
- métodos como `map`.

No puedes colocar directamente una instrucción completa como `if` o `for` dentro del JSX. Puedes calcular el resultado antes del `return`.

## 2.5 Mantener componentes predecibles

Un componente debe producir el mismo resultado cuando recibe los mismos datos. Evita:

- modificar variables externas durante el renderizado;
- escribir en `localStorage` directamente en el cuerpo del componente;
- realizar una petición de red durante el renderizado;
- cambiar el DOM manualmente;
- llamar a una función que actualiza estado mientras se está renderizando.

El cuerpo del componente describe la interfaz. Las acciones externas se manejan mediante eventos o efectos.

## 2.6 Organización inicial

Una estructura suficiente para este módulo es:

```text
src/
├── components/
│   ├── CourseCard.jsx
│   ├── CourseFilters.jsx
│   ├── CourseList.jsx
│   ├── EnrollmentForm.jsx
│   ├── Faq.jsx
│   ├── FaqItem.jsx
│   ├── Hero.jsx
│   ├── SiteHeader.jsx
│   └── StatusMessage.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

No existe una única estructura correcta. Para una aplicación pequeña, evita crear carpetas profundas que dificulten encontrar los archivos.

### Ejercicio 2. Componentizar una sección

Convierte el encabezado y la sección principal de tu landing en los componentes `SiteHeader` y `Hero`. Cada componente debe:

- comenzar con mayúscula;
- devolver marcado semántico;
- estar en su propio archivo;
- exportarse como valor predeterminado;
- importarse y utilizarse desde `App.jsx`;
- conservar el diseño adaptable del Módulo 1.

Al terminar, verifica que la página se vea igual antes y después de la separación. La componentización no debe alterar el diseño.

### Reto breve

Dibuja el árbol de componentes de tu página actual. Si encuentras un componente cuyo nombre sería `Section` o `Box`, busca un nombre que describa su propósito, como `CourseList`, `Benefits` o `EnrollmentForm`.

---

# 3. Propiedades, listas y renderizado condicional

## 3.1 Propiedades: información que recibe un componente

Un molde de tarjeta no debe contener siempre el mismo curso. Necesita recibir datos:

```jsx
function CourseCard({ title, category, duration }) {
  return (
    <article className="course-card">
      <span className="course-card__category">{category}</span>
      <h3>{title}</h3>
      <p>{duration} horas</p>
    </article>
  );
}
```

Uso:

```jsx
<CourseCard
  title="Desarrollo Web Moderno"
  category="Desarrollo web"
  duration={40}
/>
```

Las propiedades, conocidas como *props*, son datos que el componente padre entrega al componente hijo.

```text
App
 │
 │ props: title, category, duration
 ▼
CourseCard
```

Las propiedades son de solo lectura. Un componente no debe modificarlas.

## 3.2 Enviar un objeto completo o propiedades separadas

Estas dos opciones son posibles:

```jsx
<CourseCard
  title={course.title}
  category={course.category}
  duration={course.duration}
/>
```

```jsx
<CourseCard course={course} />
```

Para una tarjeta que utiliza muchas propiedades del curso, enviar el objeto completo puede ser claro:

```jsx
function CourseCard({ course }) {
  return (
    <article>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </article>
  );
}
```

Evita entregar un objeto enorme a un componente que necesita un solo valor. Las propiedades deben mostrar con claridad de qué depende el componente.

## 3.3 Representar listas

Supón que tienes estos datos:

```js
const courses = [
  {
    id: "logic",
    title: "Lógica de Programación",
    category: "Fundamentos",
    duration: 16
  },
  {
    id: "python-1",
    title: "Python Nivel 1",
    category: "Programación",
    duration: 20
  },
  {
    id: "web-modern",
    title: "Desarrollo Web Moderno",
    category: "Desarrollo web",
    duration: 40
  }
];
```

Puedes generar las tarjetas con `map`:

```jsx
function CourseList({ courses }) {
  return (
    <div className="course-grid">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

## 3.4 La clave de cada elemento

`key` permite que React identifique cada elemento de una lista entre actualizaciones.

Una buena clave:

- es única entre los elementos de esa lista;
- permanece estable;
- proviene de los datos.

Utiliza:

```jsx
key={course.id}
```

Evita:

```jsx
key={Math.random()}
```

También evita utilizar la posición como clave si la lista puede filtrarse, reordenarse, agregar o eliminar elementos:

```jsx
key={index}
```

`key` es información para React y no llega como propiedad normal. Si el componente necesita el identificador, envíalo dentro de `course` o mediante una propiedad adicional.

## 3.5 Renderizado condicional

Una interfaz real no siempre muestra las tarjetas. Puede estar cargando, fallar o no encontrar resultados.

### Retorno temprano

```jsx
function CourseList({ courses, isLoading, error }) {
  if (isLoading) {
    return <p role="status">Cargando cursos...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (courses.length === 0) {
    return <p>No se encontraron cursos con esos filtros.</p>;
  }

  return (
    <div className="course-grid">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### Operador condicional

```jsx
<span>{isFavorite ? "★ Favorito" : "☆ Agregar a favoritos"}</span>
```

### Operador `&&`

```jsx
{isNew && <span className="badge">Nuevo</span>}
```

Elige la forma que haga más fácil leer el caso. Evita acumular condiciones anidadas dentro del JSX.

### Ejercicio 3. Lista reutilizable

Crea un arreglo con al menos cuatro cursos y representa una tarjeta por elemento. Cada objeto debe contener:

- un identificador estable;
- nombre;
- categoría;
- duración;
- descripción breve.

Después:

1. Crea `CourseCard`.
2. Crea `CourseList`.
3. Envía la lista desde `App`.
4. Utiliza el identificador como `key`.
5. Prueba la lista con un arreglo vacío.
6. Muestra un mensaje claro cuando no existan cursos.

### Ejercicio 4. Auditoría de propiedades

Revisa todos los componentes creados. Escribe una tabla con tres columnas: componente, propiedades que recibe y responsabilidad. Si un componente recibe un dato que no utiliza, elimínalo. Si realiza dos trabajos claramente diferentes, considera dividirlo.

---

# 4. Eventos y estado con `useState`

## 4.1 Eventos en React

En React, una función puede ejecutarse cuando ocurre una acción:

```jsx
function FavoriteButton() {
  function handleClick() {
    console.log("Favorito actualizado");
  }

  return (
    <button type="button" onClick={handleClick}>
      Agregar a favoritos
    </button>
  );
}
```

Entrega la función:

```jsx
onClick={handleClick}
```

No la ejecutes durante el renderizado:

```jsx
onClick={handleClick()}
```

La primera forma indica “ejecuta esta función cuando ocurra el clic”. La segunda la ejecuta inmediatamente.

## 4.2 El estado es la memoria del componente

Una variable normal puede cambiar, pero React no sabe que debe actualizar la interfaz:

```jsx
let isFavorite = false;
```

Para conservar un valor entre renderizados y solicitar una actualización visual, utiliza `useState`:

```jsx
import { useState } from "react";

function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  function handleClick() {
    setIsFavorite(!isFavorite);
  }

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      onClick={handleClick}
    >
      {isFavorite ? "★ Favorito" : "☆ Agregar a favoritos"}
    </button>
  );
}
```

`useState(false)` devuelve:

1. el valor actual;
2. una función para solicitar su actualización.

```text
Estado actual ──► renderizado ──► interfaz
      ▲                              │
      └──── función actualizadora ◄──┘
```

## 4.3 Reglas prácticas de los Hooks

`useState` y `useEffect` son Hooks.

Debes:

- llamarlos en el nivel superior de un componente;
- llamarlos siempre en el mismo orden;
- utilizarlos dentro de componentes o Hooks personalizados.

No hagas esto:

```jsx
if (userIsLoggedIn) {
  const [menuOpen, setMenuOpen] = useState(false);
}
```

En este curso no necesitas crear Hooks personalizados. Primero domina el uso directo y correcto de los Hooks esenciales.

## 4.4 Las actualizaciones no cambian el valor inmediatamente

La función actualizadora solicita un nuevo renderizado:

```jsx
function handleClick() {
  setIsFavorite(true);
  console.log(isFavorite);
}
```

El `console.log` todavía puede mostrar el valor perteneciente al renderizado actual. No interpretes esto como un fallo. Cada renderizado trabaja con una instantánea del estado.

Cuando el nuevo valor depende del anterior, utiliza una actualización funcional:

```jsx
setCount((previousCount) => previousCount + 1);
```

## 4.5 Actualizar arreglos sin mutarlos

No modifiques directamente un arreglo guardado en estado:

```jsx
favorites.push(courseId);
setFavorites(favorites);
```

Crea un arreglo nuevo:

```jsx
function toggleFavorite(courseId) {
  setFavorites((previousFavorites) => {
    const alreadyExists = previousFavorites.includes(courseId);

    if (alreadyExists) {
      return previousFavorites.filter((id) => id !== courseId);
    }

    return [...previousFavorites, courseId];
  });
}
```

## 4.6 Actualizar objetos sin mutarlos

Evita:

```jsx
formData.name = "Ana";
setFormData(formData);
```

Utiliza una copia:

```jsx
setFormData((previousData) => ({
  ...previousData,
  name: "Ana"
}));
```

La inmutabilidad permite que las actualizaciones sean predecibles y evita errores difíciles de rastrear.

## 4.7 Propiedades de función

Un componente hijo puede informar una acción al padre mediante una función recibida por propiedades:

```jsx
function CourseCard({ course, isFavorite, onToggleFavorite }) {
  return (
    <article className="course-card">
      <h3>{course.title}</h3>
      <button
        type="button"
        aria-pressed={isFavorite}
        onClick={() => onToggleFavorite(course.id)}
      >
        {isFavorite ? "★ Quitar favorito" : "☆ Agregar favorito"}
      </button>
    </article>
  );
}
```

El componente no necesita saber cómo se guarda la lista. Solamente comunica qué curso cambió.

```text
App entrega datos
      │
      ▼
CourseCard
      │
      └── comunica una acción mediante onToggleFavorite
```

### Ejercicio 5. Favoritos sin mutación

Amplía la lista del ejercicio anterior:

1. Guarda en `App` un arreglo con los identificadores favoritos.
2. Entrega a cada tarjeta un valor booleano `isFavorite`.
3. Entrega una función `onToggleFavorite`.
4. Permite agregar y quitar favoritos.
5. Cambia el texto y `aria-pressed` del botón.
6. Muestra arriba de la lista la cantidad de favoritos.
7. Comprueba que no utilizaste `push`, `splice` ni asignaciones directas sobre el estado.

### Reto breve

Agrega un botón “Mostrar solo favoritos”. Decide qué valor debe guardarse en estado y qué lista puede calcularse a partir de otros valores.

---

# 5. Estado compartido y formularios controlados

## 5.1 ¿Dónde debe vivir el estado?

El estado debe pertenecer al componente común más cercano que necesita:

- mostrar el valor;
- modificarlo;
- distribuirlo a otros componentes.

Para el explorador:

```text
CourseExplorer
├── CourseFilters  ── cambia búsqueda y categoría
└── CourseList     ── muestra los resultados
```

Si `CourseFilters` cambia la búsqueda y `CourseList` necesita el resultado, el estado debe vivir en `CourseExplorer` o en un componente superior.

```jsx
function CourseExplorer({ courses }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // ...
}
```

Esta decisión se conoce como **elevar el estado**.

## 5.2 Estado mínimo y valores derivados

No todo valor que cambia necesita su propio `useState`.

Estado necesario:

```jsx
const [query, setQuery] = useState("");
const [category, setCategory] = useState("all");
const [favorites, setFavorites] = useState([]);
```

Valor derivado:

```jsx
const normalizedQuery = query.trim().toLowerCase();

const visibleCourses = courses.filter((course) => {
  const matchesText =
    course.title.toLowerCase().includes(normalizedQuery) ||
    course.description.toLowerCase().includes(normalizedQuery);

  const matchesCategory =
    category === "all" || course.category === category;

  return matchesText && matchesCategory;
});
```

No guardes `visibleCourses` en estado si puede calcularse durante el renderizado. Duplicar información produce desincronización.

```text
query ───────┐
category ────┼──► cálculo ──► visibleCourses
courses ─────┘
```

## 5.3 Formularios controlados

En un campo controlado, React conserva el valor:

```jsx
function SearchInput({ query, onQueryChange }) {
  return (
    <div className="field">
      <label htmlFor="course-search">Buscar cursos</label>
      <input
        id="course-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Ejemplo: React"
      />
    </div>
  );
}
```

El ciclo es:

```text
La persona escribe
        │
        ▼
      onChange
        │
        ▼
Actualización del estado
        │
        ▼
Nuevo valor entregado al input
```

No necesitas consultar el elemento con `querySelector` para conocer su valor.

## 5.4 Varios campos

Para un formulario breve puedes utilizar un objeto:

```jsx
const [formData, setFormData] = useState({
  name: "",
  email: "",
  course: ""
});

function handleChange(event) {
  const { name, value } = event.target;

  setFormData((previousData) => ({
    ...previousData,
    [name]: value
  }));
}
```

Los controles deben tener un atributo `name` correspondiente:

```jsx
<input
  id="name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
/>
```

## 5.5 Envío y validación

```jsx
function handleSubmit(event) {
  event.preventDefault();

  const cleanName = formData.name.trim();
  const cleanEmail = formData.email.trim();

  if (!cleanName || !cleanEmail) {
    setMessage("Completa los campos obligatorios.");
    return;
  }

  setMessage(`Solicitud preparada para ${cleanName}.`);
}
```

Continúa utilizando las capacidades de HTML:

- `required`;
- `type="email"`;
- `minLength`;
- etiquetas asociadas;
- instrucciones visibles;
- mensajes claros.

React no convierte automáticamente un formulario en accesible ni lo conecta a un servidor. En este módulo simularás la confirmación. La integración con un servicio real está fuera del alcance actual.

## 5.6 Estado local o compartido

No todo estado debe subir hasta `App`.

| Situación | Ubicación razonable |
|---|---|
| Búsqueda utilizada por filtros y lista | Ancestro común |
| Favoritos utilizados por varias tarjetas | Ancestro común |
| Campo del formulario de inscripción | `EnrollmentForm` |
| Pregunta abierta si cada elemento es independiente | `FaqItem` |
| Pregunta abierta si solo una puede permanecer abierta | `Faq` |

Colocar todo en `App` crea un componente difícil de mantener. Colocar el mismo dato en varios componentes crea versiones contradictorias. Busca la fuente única de verdad más cercana.

### Ejercicio 6. Buscador controlado

Construye `CourseFilters` con:

- un campo de búsqueda;
- un selector de categoría;
- un botón para limpiar filtros;
- etiquetas visibles;
- valores controlados;
- funciones recibidas por propiedades.

El resultado debe actualizarse mientras escribes. El botón para limpiar debe restaurar la búsqueda vacía y la categoría “Todas”. Si no hay coincidencias, muestra un mensaje que explique cómo recuperar resultados.

### Ejercicio 7. Formulario de interés

Crea un formulario controlado con nombre, correo y curso de interés. Debe:

- impedir el envío predeterminado;
- limpiar espacios al validar;
- utilizar validación HTML;
- mostrar un mensaje de confirmación;
- no imprimir datos personales en la consola;
- conservar valores si existe un error;
- limpiar el formulario solamente después de un envío válido.

---

# 6. Efectos, carga de datos y persistencia

## 6.1 ¿Qué es un efecto?

Un efecto permite sincronizar un componente con algo externo a React, por ejemplo:

- una petición de red;
- `localStorage`;
- un temporizador;
- una API del navegador;
- una biblioteca externa.

No utilices `useEffect` para cualquier cálculo.

### No necesita efecto

```jsx
const visibleCourses = courses.filter(matchesFilters);
```

### Sí puede necesitar efecto

```jsx
useEffect(() => {
  localStorage.setItem("coa-favorites", JSON.stringify(favorites));
}, [favorites]);
```

Regla práctica:

> Si un valor puede calcularse a partir de propiedades y estado durante el renderizado, probablemente no necesita un efecto.

## 6.2 Cargar cursos con `fetch`

Guarda el archivo del módulo anterior en:

```text
public/data/courses.json
```

Los archivos dentro de `public` se sirven desde la raíz. La dirección será:

```text
/data/courses.json
```

En `App.jsx`:

```jsx
import { useEffect, useState } from "react";

function App() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/data/courses.json");

        if (!response.ok) {
          throw new Error(`No se pudieron cargar los cursos: ${response.status}`);
        }

        const data = await response.json();

        if (!ignore) {
          setCourses(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError("No fue posible cargar los cursos. Intenta nuevamente.");
          console.error(loadError);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, []);

  // ...
}
```

El arreglo vacío indica que este efecto se configura al montar el componente. La función de limpieza evita actualizar el estado si el componente deja de estar activo antes de finalizar la petición.

No conviertas directamente la función entregada a `useEffect` en `async`. Declara una función asíncrona dentro del efecto.

## 6.3 Estados de una petición

Una petición no tiene solamente éxito o fracaso:

```text
Inicio
  │
  ▼
Cargando
  ├──► Éxito con datos
  ├──► Éxito sin datos
  └──► Error
```

La interfaz debe representar cada estado:

| Estado | Respuesta visual |
|---|---|
| Cargando | Mensaje o indicador con `role="status"` |
| Error | Explicación clara y opción de intentar nuevamente |
| Vacío | Mensaje útil, no un espacio en blanco |
| Éxito | Lista de cursos |

Para permitir un reintento puedes guardar un contador:

```jsx
const [retryCount, setRetryCount] = useState(0);
```

Y utilizarlo como dependencia del efecto:

```jsx
useEffect(() => {
  // cargar datos
}, [retryCount]);
```

El botón:

```jsx
<button type="button" onClick={() => setRetryCount((count) => count + 1)}>
  Intentar nuevamente
</button>
```

## 6.4 Modo estricto durante el desarrollo

En desarrollo, `StrictMode` puede provocar una configuración y limpieza adicional de ciertos efectos. Esto ayuda a encontrar efectos que no están preparados para ejecutarse nuevamente.

No elimines `StrictMode` solamente para ocultar una petición duplicada observada durante el desarrollo. Revisa que el efecto:

- tenga dependencias correctas;
- incluya limpieza cuando sea necesaria;
- no produzca cambios irreversibles;
- no se utilice para un cálculo que debería hacerse durante el renderizado.

La versión construida para producción no repite esa comprobación de desarrollo.

## 6.5 Leer favoritos al iniciar

Puedes utilizar una función inicial para leer una sola vez:

```jsx
function readStoredFavorites() {
  try {
    const storedValue = localStorage.getItem("coa-favorites");
    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
}

const [favorites, setFavorites] = useState(readStoredFavorites);
```

No escribas:

```jsx
useState(readStoredFavorites())
```

La forma con la referencia de función permite que React utilice esa lógica como inicialización.

## 6.6 Guardar cuando cambian los favoritos

```jsx
useEffect(() => {
  localStorage.setItem("coa-favorites", JSON.stringify(favorites));
}, [favorites]);
```

`localStorage` es adecuado para preferencias no sensibles. No guardes:

- contraseñas;
- datos bancarios;
- tokens que no comprendes;
- información privada innecesaria.

## 6.7 Dependencias del efecto

Las dependencias son valores reactivos utilizados dentro del efecto. No elijas el arreglo solamente para controlar cuántas veces quieres que “corra” el código.

Si una herramienta de análisis indica una dependencia faltante:

1. identifica qué valor se utiliza;
2. decide si el efecto realmente es necesario;
3. reorganiza la lógica si corresponde;
4. no desactives la advertencia sin comprenderla.

### Ejercicio 8. Los cuatro estados

Implementa la carga del archivo JSON. Después prueba deliberadamente:

1. **Carga:** agrega temporalmente un retraso mediante las herramientas de red del navegador.
2. **Éxito:** utiliza la ruta correcta.
3. **Vacío:** reemplaza temporalmente el JSON por `[]`.
4. **Error:** cambia temporalmente la ruta por una inexistente.

Toma una captura de cada estado y restaura la ruta y los datos correctos.

### Ejercicio 9. Persistencia verificable

Marca dos cursos favoritos, recarga la página y comprueba que permanezcan seleccionados. Luego borra manualmente la clave desde el panel de almacenamiento del navegador y recarga nuevamente. La aplicación debe iniciar con una lista vacía sin fallar.

---

# 7. Depuración y uso responsable de IA

## 7.1 Herramientas de diagnóstico

Cuando una aplicación no funciona, revisa:

1. el primer error de la consola;
2. el archivo y la línea indicados;
3. la pestaña de red si falló una petición;
4. las propiedades y el estado del componente;
5. React Developer Tools;
6. el último cambio realizado.

React Developer Tools permite inspeccionar:

- el árbol de componentes;
- las propiedades recibidas;
- el estado actual;
- qué componente contiene determinado elemento.

No utilices la IA antes de leer el error. Un mensaje como `courses.map is not a function` ya contiene una pista: `courses` no es un arreglo en ese momento.

## 7.2 Errores frecuentes

### “Each child in a list should have a unique key prop”

Algún elemento generado con `map` no tiene una clave estable.

### “Too many re-renders”

Probablemente se actualiza estado durante el renderizado o se ejecuta una función en lugar de entregarla a un evento.

### “Invalid hook call”

Puede haberse llamado un Hook fuera de un componente, dentro de una condición o existir un problema de dependencias.

### La pantalla queda en blanco

Revisa el primer error de la consola. Una importación incorrecta o el acceso a una propiedad de `undefined` puede impedir el renderizado.

### La interfaz no cambia

Comprueba que utilizaste la función actualizadora y que no mutaste el arreglo u objeto anterior.

### La petición devuelve 404

Revisa la ruta en la pestaña de red. Un archivo guardado en `public/data/courses.json` se solicita como `/data/courses.json`.

## 7.3 Cómo pedir ayuda a una IA

Un mensaje útil contiene:

- comportamiento esperado;
- comportamiento actual;
- error exacto;
- componente mínimo relacionado;
- datos de ejemplo;
- intentos realizados;
- restricciones del proyecto.

Ejemplo:

```text
Estoy construyendo un explorador de cursos con React y Vite.
Espero que al pulsar el botón se agregue o quite el id del arreglo
favorites. La interfaz no cambia y no aparece un error.

Este es el componente y esta es la función:
[código mínimo]

No quiero agregar bibliotecas ni utilizar manipulación directa del DOM.
Ayúdame a identificar la causa. Explica primero el error y propone el
cambio mínimo. No reescribas todo el componente.
```

## 7.4 Verificar una respuesta

Antes de aceptar código generado:

- explica con tus palabras qué cambia;
- identifica qué componente posee el estado;
- confirma que no muta arreglos u objetos;
- comprueba que no añade una dependencia innecesaria;
- revisa accesibilidad y semántica;
- ejecuta la aplicación;
- prueba el caso normal y los casos límite;
- revisa la consola;
- realiza un commit separado si el cambio es importante.

### Práctica de IA

Entrega a ChatGPT o Claude dos componentes de tu proyecto y solicita una revisión de responsabilidades. Utiliza este formato:

```text
Revisa la separación de responsabilidades de estos componentes React.
No cambies el comportamiento ni agregues bibliotecas.

Para cada problema:
1. indica la línea o fragmento;
2. explica por qué dificulta el mantenimiento;
3. propone el cambio mínimo;
4. señala qué pruebas debo repetir.

No generes una solución completa hasta explicar el diagnóstico.
```

Acepta solamente las recomendaciones que puedas justificar.

---

# 8. Mini proyecto: selector de cursos

## Objetivo

Construir un pequeño selector que permita comparar opciones y elegir un curso. El proyecto practicará componentes, propiedades, listas, eventos, estado compartido y renderizado condicional.

## Resultado esperado

```text
┌──────────────────────────────────────────────────────────┐
│ Elige tu próximo curso                                   │
│                                                          │
│ [Lógica]        [Python]        [Desarrollo web]          │
│ 16 horas        20 horas        40 horas                  │
│ [Seleccionar]   [Seleccionar]   [Seleccionado]            │
│                                                          │
│ Selección actual: Desarrollo Web Moderno                  │
│ Duración: 40 horas · Categoría: Desarrollo web            │
└──────────────────────────────────────────────────────────┘
```

## Requisitos

El selector debe:

1. utilizar un arreglo con al menos cuatro cursos;
2. representar una tarjeta mediante `CourseOption`;
3. representar la colección mediante `CourseSelector`;
4. guardar en el componente padre solamente el identificador seleccionado;
5. permitir una sola selección a la vez;
6. entregar datos y funciones mediante propiedades;
7. utilizar una clave estable;
8. mostrar un resumen del curso seleccionado;
9. mostrar una instrucción antes de seleccionar;
10. aplicar `aria-pressed` a cada botón;
11. cambiar visualmente la tarjeta seleccionada;
12. funcionar con teclado;
13. no utilizar `querySelector`, `innerHTML` ni manipulación directa del DOM.

## Pasos recomendados

1. Define los datos.
2. Dibuja el árbol de componentes.
3. Crea primero la versión estática.
4. Decide dónde debe vivir `selectedCourseId`.
5. Entrega `isSelected` y `onSelect` a cada tarjeta.
6. Agrega el resumen condicional.
7. Prueba cambios repetidos de selección.
8. Revisa la consola y el diseño adaptable.

## Comprobaciones

- ¿Puede seleccionarse cualquier curso?
- ¿Se desmarca automáticamente el anterior?
- ¿El resumen coincide con la selección?
- ¿Qué ocurre antes de seleccionar?
- ¿La selección visual también se comunica con texto o atributos?
- ¿Existen advertencias de claves?

## Entrega del mini proyecto

Incluye:

- enlace al repositorio o carpeta indicada en la plataforma;
- una captura en pantalla grande;
- una captura en pantalla pequeña;
- dibujo del árbol de componentes;
- explicación de por qué el estado vive en el componente elegido.

[Entregar el mini proyecto del Módulo 3](https://forms.gle/BayPBDiXAGurWjnL6)

---

# 9. Proyecto del módulo: explorador de cursos COA en React

## Descripción

Reconstruye el explorador aprobado en el Módulo 2 como una aplicación React creada con Vite. Conserva su identidad visual y funciones principales, pero reemplaza la manipulación manual del DOM por componentes, propiedades y estado.

No copies la lógica anterior sin analizarla. Primero identifica:

- cuáles son los datos;
- cuáles valores cambian;
- cuáles valores se derivan;
- qué componentes necesitan cada valor;
- qué acciones viajan desde los componentes hijos;
- qué sincronizaciones externas requieren efectos.

## Propósito profesional

Este proyecto demuestra que puedes:

- migrar una interfaz existente;
- dividirla en componentes;
- diseñar el flujo de datos;
- manejar interacción con estado;
- integrar una fuente de datos;
- conservar preferencias;
- validar formularios;
- depurar una aplicación;
- documentar decisiones;
- utilizar IA sin perder el control del código.

## Arquitectura mínima

La aplicación debe incluir, como mínimo:

```text
App
├── SiteHeader
├── Hero
├── CourseExplorer
│   ├── CourseFilters
│   ├── StatusMessage
│   └── CourseList
│       └── CourseCard
├── Faq
│   └── FaqItem
├── EnrollmentForm
└── Footer
```

Puedes mejorar la estructura si cada componente tiene un propósito claro. No crees componentes vacíos únicamente para aumentar la cantidad de archivos.

## Requisitos funcionales obligatorios

### 1. Proyecto React

- Debe crearse con Vite y la plantilla de React.
- Debe iniciar mediante `npm run dev`.
- Debe generar la versión optimizada mediante `npm run build`.
- No debe contener errores ni advertencias evitables en la consola.

### 2. Cursos cargados desde JSON

- Los datos deben estar en `public/data/courses.json`.
- Deben cargarse con `fetch`.
- Debe comprobarse `response.ok`.
- Deben manejarse carga, error, vacío y éxito.
- El mensaje de error debe permitir reintentar.

### 3. Tarjetas mediante componentes

- Cada curso debe representarse con `CourseCard`.
- La lista debe usar `map`.
- Cada elemento debe utilizar una clave estable.
- La tarjeta debe recibir datos mediante propiedades.
- La tarjeta no debe modificar directamente el arreglo de favoritos.

### 4. Búsqueda

- Debe buscar por nombre y descripción.
- Debe ignorar diferencias entre mayúsculas y minúsculas.
- Debe actualizar la lista mientras se escribe.
- El campo debe ser controlado.

### 5. Filtro por categoría

- Debe incluir la opción “Todas”.
- Debe combinarse con la búsqueda.
- Debe ser un control asociado a una etiqueta.
- Debe conservar una única fuente de verdad.

### 6. Resultados

- Debe mostrarse la cantidad de cursos visibles.
- Debe existir un mensaje cuando no haya coincidencias.
- Debe incluirse una acción para limpiar los filtros.
- La lista filtrada debe calcularse; no debe duplicarse innecesariamente en estado.

### 7. Favoritos

- Debe ser posible agregar y quitar favoritos.
- El botón debe comunicar el estado visualmente y con `aria-pressed`.
- Los identificadores deben guardarse en `localStorage`.
- La aplicación debe recuperarlos al iniciar.
- Un valor dañado o ausente en el almacenamiento no debe romper la aplicación.

### 8. Preguntas frecuentes

- Deben crearse mediante componentes.
- Los controles deben ser botones reales.
- Debe comunicarse el estado con `aria-expanded`.
- La interacción debe funcionar con teclado.
- Puede permitirse una sola pregunta abierta o varias, siempre que la decisión sea consistente.

### 9. Formulario

- Debe contener nombre, correo y curso de interés.
- Sus campos deben ser controlados.
- Debe utilizar etiquetas y validación HTML.
- Debe impedir envíos incompletos.
- Debe mostrar una confirmación en la propia página.
- No debe almacenar datos personales en `localStorage`.
- No necesita conectarse a un servidor.

### 10. Diseño y accesibilidad

- Debe conservar o mejorar el diseño del Módulo 1.
- Debe funcionar desde 320 píxeles de ancho.
- Debe conservar HTML semántico.
- Debe mostrar un indicador de foco visible.
- Debe mantener contraste legible.
- Ninguna función debe depender únicamente del color.

### 11. Restricciones técnicas

No utilices:

- `querySelector` para controlar la interfaz;
- `innerHTML`;
- manipulación manual de clases para representar estado;
- mutación directa del estado;
- Redux u otra biblioteca de estado;
- React Router;
- un framework CSS;
- Hooks avanzados;
- componentes de clase;
- una API remota que pueda dejar de funcionar durante la evaluación.

La navegación y Next.js se estudiarán en el módulo siguiente.

## Organización recomendada del estado

Esta tabla es una guía de razonamiento, no una plantilla que debas copiar sin analizar:

| Valor | ¿Estado? | Ubicación posible | Motivo |
|---|---|---|---|
| Cursos cargados | Sí | `App` o `CourseExplorer` | Llegan de una fuente externa |
| Cargando | Sí | Junto a los cursos | Cambia durante la petición |
| Error | Sí | Junto a los cursos | Depende del resultado |
| Búsqueda | Sí | `CourseExplorer` | La cambia un control |
| Categoría | Sí | `CourseExplorer` | La cambia un control |
| Cursos visibles | No | Cálculo durante renderizado | Se deriva de cursos y filtros |
| Cantidad visible | No | `visibleCourses.length` | Se deriva de la lista |
| Favoritos | Sí | Ancestro de las tarjetas | Varias tarjetas lo consultan |
| Campos del formulario | Sí | `EnrollmentForm` | Solo pertenecen al formulario |

## Secuencia recomendada

### Fase 1. Planificación

- Conserva el proyecto aprobado del Módulo 2.
- Crea un proyecto React separado.
- Dibuja el árbol de componentes.
- Enumera el estado mínimo.
- Identifica los valores derivados.

### Fase 2. Migración visual

- Crea los componentes estáticos.
- Traslada los estilos necesarios.
- Conserva semántica y comportamiento adaptable.
- Comprueba que la página todavía no contiene interacción.

### Fase 3. Datos y tarjetas

- Traslada el JSON a `public/data`.
- Implementa la carga.
- Representa la lista.
- Agrega los cuatro estados de la petición.

### Fase 4. Interacción

- Implementa búsqueda.
- Implementa categoría.
- Calcula la lista visible.
- Implementa favoritos.
- Implementa preguntas frecuentes.

### Fase 5. Formulario

- Controla sus campos.
- Mantén validación nativa.
- Agrega mensajes claros.
- Prueba casos inválidos.

### Fase 6. Persistencia y revisión

- Recupera favoritos.
- Sincronízalos con `localStorage`.
- Revisa dependencias de efectos.
- Comprueba accesibilidad.
- Ejecuta la construcción de producción.

## Pruebas mínimas

Registra el resultado de estas pruebas:

| Caso | Acción | Resultado esperado |
|---|---|---|
| Carga normal | Abrir la aplicación | Se muestran todos los cursos |
| Búsqueda existente | Escribir parte de un nombre | Solo aparecen coincidencias |
| Búsqueda inexistente | Escribir texto sin coincidencias | Aparece un estado vacío |
| Categoría | Elegir una categoría | Solo aparecen cursos de esa categoría |
| Filtros combinados | Buscar y elegir categoría | Se cumplen ambos criterios |
| Limpiar | Pulsar “Limpiar filtros” | Regresan todos los cursos |
| Favorito | Marcar un curso | Cambian texto, estado y contador |
| Persistencia | Recargar la página | El favorito permanece |
| Almacenamiento dañado | Guardar temporalmente un valor inválido | La aplicación no se bloquea |
| Error de red | Utilizar temporalmente una ruta incorrecta | Aparece error y botón de reintento |
| Reintento | Restaurar la ruta y reintentar | Aparecen los cursos |
| Formulario vacío | Intentar enviarlo | Se impide el envío |
| Formulario válido | Completarlo y enviarlo | Aparece confirmación |
| Teclado | Recorrer controles con Tab | Todo control es visible y operable |
| Pantalla pequeña | Revisar a 320 px | No existe desplazamiento horizontal |

## Uso obligatorio de IA

Utiliza ChatGPT o Claude en al menos tres momentos distintos:

1. **Planificación:** revisión del árbol de componentes.
2. **Diagnóstico:** explicación de un error real o caso límite.
3. **Revisión:** búsqueda de mutaciones, estados duplicados o efectos innecesarios.

Conserva una bitácora:

| Situación | Prompt utilizado | Respuesta resumida | Decisión tomada | Cómo se verificó |
|---|---|---|---|---|

No incluyas información privada, credenciales ni datos sensibles en los mensajes.

## Git y GitHub

El repositorio debe mostrar el proceso. Realiza al menos ocho commits significativos. Ejemplo:

```text
chore: crear proyecto React con Vite
feat: agregar estructura visual de COA
feat: crear componentes de cursos
feat: cargar cursos desde JSON
feat: agregar búsqueda y filtro
feat: implementar favoritos persistentes
feat: convertir preguntas y formulario a React
fix: manejar estados vacío y error
docs: agregar pruebas y bitácora de IA
```

No utilices mensajes como `cambios`, `final` o `arreglo`.

## Entrega

Entrega en el punto indicado por la plataforma:

- nombre completo;
- enlace público al repositorio de GitHub;
- instrucciones para ejecutar el proyecto;
- captura en pantalla grande;
- captura a 320 o 375 píxeles;
- captura del estado de error;
- árbol de componentes;
- tabla de pruebas completada;
- bitácora de uso de IA;
- reflexión de 150 a 250 palabras.

La reflexión debe responder:

1. ¿Qué manipulación manual del proyecto anterior desapareció al utilizar estado?
2. ¿Cuál fue la decisión más difícil sobre la ubicación del estado?
3. ¿Qué propuesta de IA aceptaste, modificaste o rechazaste y por qué?
4. ¿Qué mejorarías con más tiempo?

[Entregar el proyecto del Módulo 3](https://forms.gle/BayPBDiXAGurWjnL6)

## Lista de comprobación antes de entregar

- [ ] El repositorio puede clonarse.
- [ ] `npm install` finaliza correctamente.
- [ ] `npm run dev` inicia la aplicación.
- [ ] `npm run build` termina sin errores.
- [ ] No existen errores en la consola.
- [ ] Los cursos se cargan desde JSON.
- [ ] Se representan carga, error, vacío y éxito.
- [ ] La búsqueda y la categoría funcionan juntas.
- [ ] Los favoritos permanecen después de recargar.
- [ ] No existe mutación directa del estado.
- [ ] No existe manipulación directa del DOM.
- [ ] Los campos del formulario son controlados.
- [ ] Todos los controles funcionan con teclado.
- [ ] El diseño funciona desde 320 píxeles.
- [ ] Los commits muestran el proceso.
- [ ] La bitácora de IA contiene tres usos verificables.

---

## Rúbrica de evaluación del proyecto

**Puntuación total:** 100 puntos  
**Puntuación mínima de aprobación:** 70 puntos y cumplimiento de todos los requisitos críticos

| Criterio | Excelente | Competente | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Funcionalidad | Todas las funciones y casos límite operan correctamente | Funciones principales completas con fallos menores | Varias funciones incompletas | La aplicación no cumple su propósito | 25 |
| Componentes y propiedades | Responsabilidades claras, propiedades precisas y buena reutilización | Estructura adecuada con oportunidades menores de mejora | Componentes muy grandes o separación confusa | No existe una arquitectura real de componentes | 15 |
| Estado y flujo de datos | Estado mínimo, fuente única de verdad y actualizaciones inmutables | Flujo correcto con alguna duplicación menor | Estado mal ubicado o difícil de seguir | Mutación directa o interfaz desincronizada | 15 |
| Efectos y datos asíncronos | Efectos necesarios, dependencias correctas y cuatro estados completos | Carga y errores correctos con detalles menores pendientes | Manejo parcial de petición o persistencia | Peticiones en renderizado o fallos graves | 15 |
| Formularios y accesibilidad | Controles completos, accesibles, controlados y mensajes claros | Requisitos principales satisfechos | Etiquetas, foco o validación incompletos | Formulario o controles inaccesibles | 10 |
| Código, diseño y adaptación | Código claro, diseño consistente y funcionamiento desde 320 px | Buena calidad con detalles menores | Duplicación o problemas visuales perceptibles | Código desorganizado o diseño roto | 10 |
| Git y documentación | Historial significativo y entrega completa | Historial y documentos suficientes | Historial pobre o documentos incompletos | No existe evidencia del proceso | 5 |
| Uso responsable de IA | Tres usos documentados, razonados y verificados | Tres usos con verificación básica | Evidencia incompleta o aceptación poco crítica | Sin bitácora o código no comprendido | 5 |
| **Total** |  |  |  |  | **100** |

### Requisitos críticos

El proyecto debe corregirse antes de aprobarse si ocurre cualquiera de estas situaciones:

- `npm run build` falla;
- la aplicación no inicia;
- no se utilizan componentes de React;
- se controla la interfaz mediante manipulación directa del DOM;
- el estado se muta directamente;
- búsqueda, filtros o favoritos no funcionan;
- los cursos no se cargan desde JSON;
- no existe manejo de error;
- hay errores activos en la consola;
- los controles principales no pueden utilizarse con teclado;
- no existe repositorio accesible;
- el estudiante no puede explicar una parte importante del código entregado.

El proyecto debe ser aprobado antes de continuar al Módulo 4. Si recibe correcciones, aplica los cambios solicitados y entrega una nueva versión.

---

# 10. Evaluación del módulo

Responde sin ejecutar el proyecto. Después comprueba tus respuestas mediante ejemplos pequeños.

## Pregunta 1

¿Qué describe mejor un componente React?

A. Un archivo CSS que solamente puede utilizarse una vez.  
B. Una función que devuelve una parte de la interfaz.  
C. Una copia automática de un elemento del DOM.  
D. Una base de datos local.

## Pregunta 2

¿Por qué se utiliza `className` en JSX?

A. Porque JSX utiliza la propiedad correspondiente de JavaScript.  
B. Porque React no admite clases CSS.  
C. Porque solamente funciona con Vite.  
D. Porque `class` crea estado.

## Pregunta 3

¿Cuál es la mejor clave para una tarjeta de curso?

A. `Math.random()`.  
B. La fecha actual.  
C. El identificador estable del curso.  
D. La posición, aunque la lista cambie.

## Pregunta 4

¿Qué ocurre al llamar correctamente una función actualizadora de estado?

A. React solicita un nuevo renderizado con el nuevo estado.  
B. React recarga toda la página.  
C. El navegador modifica automáticamente el JSON.  
D. El componente se convierte en HTML estático.

## Pregunta 5

Si una lista filtrada puede calcularse con `courses`, `query` y `category`, ¿qué conviene hacer?

A. Duplicarla siempre en otro estado.  
B. Calcularla durante el renderizado.  
C. Guardarla en `localStorage`.  
D. Modificar el arreglo original.

## Pregunta 6

¿Dónde debe vivir un estado utilizado por dos componentes hermanos?

A. Duplicado en ambos.  
B. En el archivo CSS.  
C. En el ancestro común más cercano.  
D. Dentro de `index.html`.

## Pregunta 7

¿Cuál es una actualización inmutable para agregar un identificador?

A. `favorites.push(id)`.  
B. `favorites[id] = true`.  
C. `return [...favorites, id]`.  
D. `favorites.splice(0, 1)`.

## Pregunta 8

¿Para cuál tarea es apropiado `useEffect`?

A. Calcular la cantidad de elementos de un arreglo.  
B. Concatenar nombre y apellido para mostrarlos.  
C. Sincronizar favoritos con `localStorage`.  
D. Elegir una clase con un operador condicional.

## Pregunta 9

¿Qué debe hacerse antes de procesar el JSON de una petición?

A. Comprobar `response.ok`.  
B. Recargar la página.  
C. Mutar el estado.  
D. Eliminar el modo estricto.

## Pregunta 10

Una IA propone guardar `visibleCourses` en estado y actualizarlo con un efecto cada vez que cambian los filtros. ¿Cuál es la mejor respuesta?

A. Aceptarlo porque todo valor visible debe ser estado.  
B. Rechazarlo sin leer la explicación.  
C. Preguntar si puede calcularse directamente y evitar estado duplicado.  
D. Agregar otra biblioteca de estado.

## Actividad de explicación

Explica con tus palabras, sin leer el código:

1. la diferencia entre propiedad y estado;
2. por qué React necesita claves en una lista;
3. qué significa elevar el estado;
4. por qué no debe mutarse un arreglo guardado en estado;
5. cuándo sí y cuándo no utilizarías `useEffect`.

La evaluación se aprueba cuando alcanzas al menos un 70 % y puedes explicar los cinco conceptos sin depender de una definición memorizada.

---

# Videos recomendados

Los videos complementan la práctica. No reemplazan la documentación ni los ejercicios. Todos los enlaces fueron revisados y corresponden al tema indicado.

| Tema | Video | Canal | Duración aproximada | Motivo de la recomendación |
|---|---|---|---:|---|
| Inicio con React y Vite | [React + Vite Curso #1: Inicio](https://www.youtube.com/watch?v=IIbYX19L4dI) | Ángel Software Dev | 11 min | Presenta la preparación inicial de un proyecto con React y Vite. |
| JSX | [React + Vite Curso #3: JSX](https://www.youtube.com/watch?v=ldAfYgrjTi4) | Ángel Software Dev | 13 min | Explica específicamente la sintaxis JSX con ejemplos breves. |
| Componentes, props y estado | [React desde cero: useState, eventos, props y componentes](https://www.youtube.com/watch?v=6QzKFF_Bvfg) | Comandos de Programación | 37 min | Reúne el modelo básico del módulo en una explicación progresiva. |
| Estado con `useState` | [Aprende a usar useState en React con ejemplos prácticos](https://www.youtube.com/watch?v=e4h5KmpH-oU) | DevGuardian Code | 16 min | Se concentra en cambios de estado mediante ejemplos. |
| Formularios | [React: cómo crear y enviar formularios](https://www.youtube.com/watch?v=8OQHGp6peSY) | AMazaing Code | 13 min | Practica `onChange`, `onSubmit` y manejo de datos de formulario. |
| `fetch` y `useEffect` | [Cómo hacer una petición usando fetch y useEffect](https://www.youtube.com/watch?v=VkN96ZkyxzA) | AMazaing Code | 6 min | Muestra la conexión entre una petición y el ciclo del componente. |

## Reproductores de video

[React + Vite Curso #1: Inicio](https://www.youtube.com/watch?v=IIbYX19L4dI)

[React + Vite Curso #3: JSX](https://www.youtube.com/watch?v=ldAfYgrjTi4)

[React desde cero: useState, eventos, props y componentes](https://www.youtube.com/watch?v=6QzKFF_Bvfg)

[Aprende a usar useState en React con ejemplos prácticos](https://www.youtube.com/watch?v=e4h5KmpH-oU)

[React: cómo crear y enviar formularios](https://www.youtube.com/watch?v=8OQHGp6peSY)

[Cómo hacer una petición usando fetch y useEffect](https://www.youtube.com/watch?v=VkN96ZkyxzA)

## Ruta recomendada de visualización

1. Mira el video de inicio antes de crear el proyecto.
2. Mira el video de JSX antes del Ejercicio 2.
3. Utiliza el video de componentes, propiedades y estado como repaso antes del Ejercicio 5.
4. Mira el video de `useState` antes del mini proyecto.
5. Mira los videos de formularios y `fetch` antes de integrar esas funciones en el proyecto del módulo.

> Si un video utiliza una versión visual ligeramente distinta de Vite o React, conserva los conceptos y utiliza los comandos actuales indicados en la documentación.

---

# Documentación y lecturas

## Nivel esencial

- [Inicio rápido de React en español](https://es.react.dev/learn)
- [Tu primer componente](https://es.react.dev/learn/your-first-component)
- [Escribir marcado con JSX](https://es.react.dev/learn/writing-markup-with-jsx)
- [Pasar propiedades a un componente](https://es.react.dev/learn/passing-props-to-a-component)
- [Renderizar listas](https://es.react.dev/learn/rendering-lists)
- [El estado: la memoria de un componente](https://es.react.dev/learn/state-a-components-memory)

## Nivel de aplicación

- [Responder a eventos](https://es.react.dev/learn/responding-to-events)
- [Actualizar arreglos en el estado](https://es.react.dev/learn/updating-arrays-in-state)
- [Actualizar objetos en el estado](https://es.react.dev/learn/updating-objects-in-state)
- [Compartir estado entre componentes](https://es.react.dev/learn/sharing-state-between-components)
- [Sincronizar con efectos](https://es.react.dev/learn/synchronizing-with-effects)
- [Quizá no necesites un efecto](https://es.react.dev/learn/you-might-not-need-an-effect)

## Referencia y herramientas

- [Referencia de `useState`](https://es.react.dev/reference/react/useState)
- [Referencia de `useEffect`](https://es.react.dev/reference/react/useEffect)
- [Referencia del elemento `input` en React](https://es.react.dev/reference/react-dom/components/input)
- [Guía oficial de Vite en español](https://es.vite.dev/guide/)
- [Descarga oficial de Node.js](https://nodejs.org/en/download)

## Cómo leer la documentación

Para cada concepto:

1. lee la explicación inicial;
2. ejecuta el ejemplo;
3. cambia un valor;
4. provoca un error pequeño;
5. explica por qué ocurrió;
6. aplícalo al explorador.

No intentes memorizar toda la referencia. Aprende a localizar la parte que resuelve tu problema.

---

# Glosario

**Aplicación de una sola página:** interfaz que puede actualizar su contenido sin recargar por completo el documento. No implica que deba tener varias rutas.

**Componente:** función que describe una parte de la interfaz.

**Componente controlado:** control de formulario cuyo valor se conserva en estado y se actualiza mediante eventos.

**Dependencia:** valor reactivo utilizado por un efecto y declarado en su arreglo de dependencias.

**Efecto:** sincronización de un componente con un sistema externo a React.

**Elevar el estado:** mover un estado al ancestro común más cercano para compartirlo.

**Estado:** memoria de un componente que puede cambiar y provocar una nueva representación.

**Fragmento:** agrupador que permite devolver varios elementos sin agregar un nodo innecesario al documento.

**Hook:** función de React que permite utilizar capacidades como estado y efectos.

**Inmutabilidad:** práctica de crear un nuevo arreglo u objeto en lugar de modificar el existente.

**JSX:** sintaxis que permite describir una estructura de interfaz dentro de JavaScript.

**Key:** identificador estable que React utiliza para reconocer elementos de una lista.

**Propiedad o prop:** información entregada por un componente padre a un componente hijo.

**Renderizado:** proceso mediante el cual React calcula cómo debe verse la interfaz.

**Renderizado condicional:** presentación de contenido diferente según una condición.

**StrictMode:** herramienta de desarrollo que ayuda a detectar ciertos problemas en los componentes.

**Valor derivado:** dato calculado a partir de propiedades o estado existente y que normalmente no necesita estado propio.

**Vite:** herramienta de desarrollo y construcción utilizada para preparar el proyecto React.

---

# Resumen final

En este módulo aprendiste a pensar una interfaz como un conjunto de componentes conectados por datos:

```text
Propiedades bajan
      │
      ▼
Componentes representan la interfaz
      │
      ▼
Eventos comunican acciones
      │
      ▼
Estado se actualiza
      │
      └────────► nuevo renderizado
```

Ahora puedes:

- crear una aplicación React con Vite;
- escribir JSX;
- diseñar componentes;
- entregar información mediante propiedades;
- representar listas con claves estables;
- controlar eventos;
- conservar estado;
- actualizar arreglos y objetos sin mutarlos;
- compartir estado entre componentes;
- construir formularios controlados;
- calcular valores derivados;
- cargar datos mediante un efecto;
- manejar carga, error, vacío y éxito;
- conservar preferencias;
- diagnosticar errores;
- revisar propuestas de IA con criterio.

El logro principal no es haber convertido una página a React. Es comprender por qué la interfaz puede organizarse alrededor del estado y cómo dividir responsabilidades sin perder el control del código.

---

# Cierre y requisito de avance

Antes de continuar:

- completa los ejercicios;
- entrega el mini proyecto;
- alcanza al menos un 70 % en la evaluación;
- entrega el explorador COA en React;
- aplica las correcciones solicitadas;
- obtiene la aprobación del proyecto.

El siguiente módulo se habilita únicamente después de aprobar el proyecto de este módulo.
