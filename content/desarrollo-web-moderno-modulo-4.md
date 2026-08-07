# COA — Cursos Online Avanzados

## Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial

# Módulo 4. Next.js: App Router, Tailwind CSS y despliegue

**Duración aproximada:** 6 horas y 30 minutos  
**Modalidad:** práctica guiada, ejercicios, mini proyecto y proyecto de módulo  
**Tecnologías:** Next.js, React, JavaScript ES6+, Tailwind CSS, Git, GitHub, Vercel, ChatGPT o Claude  
**Resultado principal:** un portal multipágina de COA construido con Next.js y publicado en Vercel

---

## Bienvenida

En el módulo anterior reconstruiste el explorador de cursos con React. Aprendiste a dividir una interfaz en componentes, enviar datos mediante propiedades, manejar estado y conectar la aplicación con sistemas externos.

React resuelve la construcción de la interfaz, pero una aplicación profesional también necesita:

- distintas páginas;
- direcciones web claras;
- navegación optimizada;
- contenido compartido entre páginas;
- títulos y descripciones para cada sección;
- imágenes optimizadas;
- una estructura preparada para producción;
- un proceso de publicación.

Next.js incorpora esas capacidades alrededor de React.

```text
React
├── componentes
├── propiedades
├── estado
└── eventos

Next.js
├── utiliza React
├── organiza rutas
├── comparte layouts
├── combina servidor y navegador
├── optimiza recursos
└── prepara el despliegue
```

Durante este módulo transformarás el explorador de una sola pantalla en un portal con varias rutas:

```text
/
├── /cursos
│   └── /cursos/[slug]
├── /nosotros
└── página no encontrada
```

La lista de cursos conservará su búsqueda, filtros y favoritos. Cada curso tendrá una dirección propia con información detallada. El encabezado y el pie se compartirán mediante un layout. El diseño se reconstruirá con Tailwind CSS y el resultado se publicará en Vercel.

No profundizarás en autenticación, bases de datos, caché avanzada, middleware, acciones de servidor ni configuraciones complejas. Esos temas no son necesarios para alcanzar el objetivo de este curso.

> **Principio del módulo:** utiliza el servidor para entregar contenido y el navegador solamente para las partes que necesitan interacción.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Explicar la diferencia práctica entre React y Next.js.
- Crear un proyecto actual de Next.js con JavaScript, App Router y Tailwind CSS.
- Reconocer la estructura esencial de un proyecto.
- Crear rutas mediante carpetas y archivos.
- Utilizar `page.js` para definir una página.
- Utilizar `layout.js` para compartir interfaz.
- Navegar internamente con el componente `Link`.
- Crear rutas dinámicas mediante segmentos como `[slug]`.
- Leer parámetros dinámicos con la forma actual de App Router.
- Generar una página por cada elemento de una colección.
- Mostrar una página 404 cuando un recurso no existe.
- Diferenciar componentes de servidor y componentes de cliente.
- Utilizar `"use client"` solamente en fronteras interactivas.
- Enviar datos serializables del servidor a un componente de cliente.
- Conservar búsqueda, filtros y favoritos dentro de una isla interactiva.
- Diseñar interfaces con utilidades esenciales de Tailwind CSS.
- Aplicar diseño adaptable con un enfoque móvil primero.
- Utilizar estados de foco, interacción y accesibilidad.
- Optimizar imágenes con `next/image`.
- Definir metadatos estáticos y dinámicos.
- Ejecutar análisis, construcción y revisión local de producción.
- Publicar un proyecto de GitHub en Vercel.
- Diferenciar despliegues de vista previa y producción.
- Diagnosticar errores de compilación con ayuda responsable de IA.

---

## Producto que construirás

El resultado será un portal público de COA:

```text
┌──────────────────────────────────────────────────────────────┐
│ COA       Inicio   Cursos   Nosotros                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                  Contenido de la ruta                        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ © COA · Cursos Online Avanzados                              │
└──────────────────────────────────────────────────────────────┘
```

### Mapa de rutas

| Dirección | Propósito |
|---|---|
| `/` | Presentación de la plataforma y cursos destacados |
| `/cursos` | Explorador completo con búsqueda, filtros y favoritos |
| `/cursos/[slug]` | Detalle individual de cada curso |
| `/nosotros` | Propósito, metodología y principios de COA |
| Cualquier ruta inexistente | Página 404 útil y navegable |

### Arquitectura general

```text
RootLayout
├── SiteHeader
├── página correspondiente
│   ├── contenido de servidor
│   └── zonas interactivas de cliente
└── SiteFooter
```

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. De React a Next.js y preparación del proyecto | 30 minutos |
| 2. App Router, páginas y layouts | 45 minutos |
| 3. Navegación y rutas dinámicas | 40 minutos |
| 4. Componentes de servidor y cliente | 40 minutos |
| 5. Diseño práctico con Tailwind CSS | 45 minutos |
| 6. Metadatos, imágenes y estados especiales | 30 minutos |
| 7. Git, construcción y despliegue en Vercel | 20 minutos |
| 8. Diagnóstico asistido por IA | 15 minutos |
| 9. Mini proyecto: directorio de recursos | 25 minutos |
| 10. Proyecto del módulo: portal COA en Next.js | 85 minutos |
| 11. Evaluación y cierre | 15 minutos |
| **Total** | **6 horas y 30 minutos** |

Los tiempos son orientativos. Completa cada comprobación antes de avanzar. Una ruta que “parece funcionar” no está terminada hasta probar acceso directo, recarga, teclado, pantalla pequeña y construcción de producción.

---

# 1. De React a Next.js y preparación del proyecto

## 1.1 React es una biblioteca; Next.js organiza la aplicación

Con React y Vite construiste una interfaz. Next.js utiliza React y añade convenciones para resolver problemas comunes.

| Necesidad | React con Vite | Next.js |
|---|---|---|
| Componentes y estado | Sí | Sí, porque utiliza React |
| Rutas | Requiere una solución adicional | Integradas mediante carpetas |
| Layouts compartidos | Debes organizarlos | Convención `layout.js` |
| Contenido de servidor | Requiere otra arquitectura | Integrado |
| Optimización de imágenes | Manual | Componente `Image` |
| Metadatos por página | Manual | API de metadatos |
| Despliegue | Depende del proveedor | Preparado para múltiples opciones |

Next.js no significa “React mejorado” ni elimina la necesidad de entender React. Un componente interactivo continúa utilizando propiedades, estado, eventos y Hooks.

## 1.2 Modelo mental de App Router

App Router convierte la estructura de carpetas en rutas.

```text
Carpeta dentro de app      ──► segmento de la URL
Archivo page.js            ──► página accesible
Archivo layout.js          ──► interfaz compartida
Carpeta [slug]             ──► segmento dinámico
```

Ejemplo:

```text
src/app/
├── page.js
├── layout.js
├── cursos/
│   ├── page.js
│   └── [slug]/
│       └── page.js
└── nosotros/
    └── page.js
```

Produce:

```text
src/app/page.js                  → /
src/app/cursos/page.js           → /cursos
src/app/cursos/[slug]/page.js    → /cursos/cualquier-slug
src/app/nosotros/page.js         → /nosotros
```

Una carpeta por sí sola no crea una página pública. Necesita un archivo `page.js`.

## 1.3 Requisitos del entorno

Utiliza:

- una versión LTS vigente de [Node.js](https://nodejs.org/en/download);
- Git;
- una cuenta de GitHub;
- una cuenta de Vercel;
- un editor de código;
- un navegador moderno.

Comprueba Node y npm:

```bash
node --version
npm --version
```

Si la herramienta de creación informa una incompatibilidad, actualiza Node. No intentes corregir un problema de versión modificando dependencias al azar.

## 1.4 Crear el proyecto

En este curso se utilizará JavaScript para concentrar el aprendizaje en Next.js. Ejecuta:

```bash
npx create-next-app@latest coa-next --js --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Después:

```bash
cd coa-next
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

El comando configura:

- JavaScript;
- ESLint;
- Tailwind CSS;
- App Router;
- una carpeta `src`;
- el alias `@/*`;
- npm como administrador de paquetes.

No agregues `--yes`, porque los valores predeterminados pueden incluir TypeScript. El comando explícito permite mantener la tecnología elegida para el curso.

## 1.5 Comandos esenciales

| Comando | Propósito |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run lint` | Ejecuta ESLint si el proyecto incluye ese script |
| `npm run build` | Crea la versión de producción |
| `npm run start` | Ejecuta localmente la versión construida |

En las versiones actuales de Next.js, la construcción no sustituye la revisión de ESLint. Ejecuta ambos procesos antes de publicar.

## 1.6 Estructura inicial

```text
coa-next/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.js
│       └── page.js
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
└── postcss.config.mjs
```

### `src/app`

Contiene las rutas, layouts y archivos especiales de App Router.

### `public`

Contiene archivos estáticos. `public/images/coa.webp` se solicita como:

```text
/images/coa.webp
```

### `jsconfig.json`

Permite utilizar el alias:

```jsx
import CourseCard from "@/components/CourseCard";
```

En lugar de:

```jsx
import CourseCard from "../../../components/CourseCard";
```

### `next.config.mjs`

Contiene configuración del framework. No lo modifiques si el proyecto no lo necesita.

### Ejercicio 1. Comparación razonada

Crea `docs/decision-next.md`. Escribe una tabla con cinco funciones del proyecto React anterior y responde:

1. ¿Qué parte seguirá siendo React?
2. ¿Qué parte resolverá App Router?
3. ¿Qué elemento podrá compartirse mediante un layout?
4. ¿Qué zona necesita ejecutarse en el navegador?
5. ¿Qué mejora se obtiene al publicar con Next.js?

No escribas definiciones generales. Relaciona cada respuesta con el explorador de cursos.

---

# 2. App Router, páginas y layouts

## 2.1 Crear una página

`src/app/page.js` representa la ruta principal:

```jsx
export default function HomePage() {
  return (
    <main>
      <h1>Cursos Online Avanzados</h1>
      <p>Aprende mediante proyectos reales.</p>
    </main>
  );
}
```

Para crear `/nosotros`:

```text
src/app/nosotros/page.js
```

```jsx
export default function AboutPage() {
  return (
    <main>
      <h1>Sobre COA</h1>
      <p>
        COA crea cursos prácticos para desarrollar habilidades aplicables.
      </p>
    </main>
  );
}
```

El nombre de la función ayuda a leer el código, pero la ruta depende de las carpetas.

## 2.2 El layout raíz

`src/app/layout.js` envuelve todas las páginas:

```jsx
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: {
    default: "COA — Cursos Online Avanzados",
    template: "%s | COA"
  },
  description:
    "Cursos prácticos de programación y desarrollo web moderno."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
```

El layout raíz:

- es obligatorio;
- contiene `<html>` y `<body>`;
- recibe la página mediante `children`;
- es adecuado para encabezado, pie y estilos globales;
- permanece compartido durante la navegación.

No coloques el encabezado y el pie manualmente en cada página.

## 2.3 Visualizar `children`

Imagina `children` como el espacio reservado:

```text
RootLayout
┌───────────────────────────┐
│ Encabezado                │
├───────────────────────────┤
│                           │
│ {children}                │ ← cambia según la ruta
│                           │
├───────────────────────────┤
│ Pie                       │
└───────────────────────────┘
```

Al visitar `/cursos`, `children` será la página de cursos. Al visitar `/nosotros`, será la página correspondiente.

## 2.4 Layouts anidados

Un layout dentro de `cursos` envuelve solamente esa sección:

```text
src/app/cursos/
├── layout.js
├── page.js
└── [slug]/
    └── page.js
```

```jsx
export default function CoursesLayout({ children }) {
  return (
    <section>
      <div>
        <p>Catálogo COA</p>
      </div>
      {children}
    </section>
  );
}
```

La composición será:

```text
RootLayout
└── CoursesLayout
    └── página de cursos o detalle
```

Utiliza un layout anidado cuando varias páginas de una sección comparten interfaz real. No crees layouts sin una necesidad.

## 2.5 Organizar componentes

Una estructura clara:

```text
src/
├── app/
│   ├── cursos/
│   ├── nosotros/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── courses/
│   │   ├── CourseCard.jsx
│   │   ├── CourseExplorer.jsx
│   │   └── CourseList.jsx
│   ├── layout/
│   │   ├── SiteFooter.jsx
│   │   └── SiteHeader.jsx
│   └── ui/
│       └── SectionTitle.jsx
└── data/
    └── courses.js
```

Las carpetas dentro de `components` no crean rutas. Solamente las carpetas dentro de `app` participan en el enrutamiento.

### Ejercicio 2. Tres páginas y un layout

Crea:

- `/`;
- `/cursos`;
- `/nosotros`;
- `SiteHeader`;
- `SiteFooter`.

Requisitos:

- cada página debe tener un único `h1`;
- el encabezado y el pie deben existir solamente en `layout.js`;
- `<html>` debe utilizar `lang="es"`;
- la estructura debe conservar HTML semántico;
- no debe existir código repetido entre páginas.

Prueba cada dirección escribiéndola directamente en la barra del navegador.

---

# 3. Navegación y rutas dinámicas

## 3.1 Navegar con `Link`

Para enlaces internos utiliza `Link`:

```jsx
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header>
      <nav aria-label="Navegación principal">
        <Link href="/">Inicio</Link>
        <Link href="/cursos">Cursos</Link>
        <Link href="/nosotros">Nosotros</Link>
      </nav>
    </header>
  );
}
```

`Link` genera un enlace accesible y permite navegación optimizada. No reemplaces un enlace por un botón cuando el propósito es visitar otra dirección.

Utiliza:

- `Link` para rutas internas;
- `<a>` para sitios externos, descargas o protocolos especiales;
- `<button>` para ejecutar una acción sin cambiar de página.

## 3.2 Rutas dinámicas

No necesitas crear un archivo por cada curso. La carpeta `[slug]` representa una parte variable:

```text
src/app/cursos/[slug]/page.js
```

Estas direcciones utilizan la misma página:

```text
/cursos/logica-programacion
/cursos/python-nivel-1
/cursos/desarrollo-web-moderno
```

## 3.3 Diseñar slugs

Un `slug` es una parte legible de una dirección:

```js
{
  id: "course-03",
  slug: "desarrollo-web-moderno",
  title: "Desarrollo Web Moderno",
  description: "Construye aplicaciones modernas con React y Next.js."
}
```

Un buen slug:

- es único;
- utiliza minúsculas;
- separa palabras con guiones;
- evita tildes y caracteres especiales;
- no cambia sin necesidad.

No utilices el índice del arreglo como slug.

## 3.4 Enlazar una tarjeta

```jsx
import Link from "next/link";

export default function CourseCard({ course }) {
  return (
    <article>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <Link href={`/cursos/${course.slug}`}>
        Ver detalles de {course.title}
      </Link>
    </article>
  );
}
```

El texto debe explicar el destino. Evita repetir “Ver más” en todas las tarjetas sin contexto accesible.

## 3.5 Leer el parámetro dinámico

En App Router actual, `params` es asíncrono:

```jsx
import { notFound } from "next/navigation";
import courses from "@/data/courses";

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main>
      <p>{course.category}</p>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Duración: {course.duration} horas</p>
    </main>
  );
}
```

Esta forma es importante:

```jsx
const { slug } = await params;
```

Algunos recursos antiguos muestran `params.slug` directamente. Utiliza la forma vigente del curso.

## 3.6 Generar rutas conocidas

Cuando los cursos son datos locales, puedes indicar los slugs disponibles:

```jsx
import courses from "@/data/courses";

export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug
  }));
}
```

No necesitas memorizar estrategias avanzadas de renderizado. En este proyecto basta comprender que Next.js puede preparar las páginas conocidas a partir de los datos.

## 3.7 Página no encontrada

Crea:

```text
src/app/not-found.js
```

```jsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main>
      <p>Error 404</p>
      <h1>No encontramos esa página</h1>
      <p>La dirección puede ser incorrecta o el contenido ya no existe.</p>
      <Link href="/cursos">Explorar cursos</Link>
    </main>
  );
}
```

`notFound()` muestra esta interfaz y devuelve la respuesta adecuada.

### Ejercicio 3. Detalle dinámico

Agrega un `slug` único a cinco cursos. Después:

1. crea `/cursos/[slug]`;
2. enlaza cada tarjeta;
3. busca el curso por `slug`;
4. muestra título, categoría, duración y descripción;
5. implementa `generateStaticParams`;
6. utiliza `notFound()` si no existe;
7. crea una página 404 con un enlace de recuperación.

Prueba:

- los cinco cursos;
- una dirección inventada;
- acceso directo mediante la barra;
- recarga dentro del detalle;
- regreso al catálogo.

---

# 4. Componentes de servidor y cliente

## 4.1 La diferencia esencial

En App Router, las páginas y layouts son componentes de servidor por defecto.

Un componente de servidor puede:

- leer datos del servidor;
- importar datos locales;
- generar contenido;
- reducir JavaScript enviado al navegador;
- conservar secretos del lado del servidor.

Un componente de cliente puede:

- utilizar estado;
- responder a eventos;
- utilizar `useEffect`;
- acceder a `localStorage`, `window` o APIs del navegador.

```text
¿Necesita estado, eventos, Hooks o API del navegador?

Sí  ──► componente de cliente
No  ──► componente de servidor por defecto
```

## 4.2 Crear una frontera de cliente

```jsx
"use client";

import { useState } from "react";

export default function CourseExplorer({ courses }) {
  const [query, setQuery] = useState("");

  const visibleCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section>
      <label htmlFor="search">Buscar cursos</label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <p>{visibleCourses.length} resultados</p>
    </section>
  );
}
```

`"use client"` debe aparecer al inicio, antes de las importaciones.

No significa que todo el sitio se ejecutará exclusivamente en el navegador. Declara una frontera para el conjunto de módulos interactivos que importa ese archivo.

## 4.3 Componer servidor y cliente

Página de servidor:

```jsx
import CourseExplorer from "@/components/courses/CourseExplorer";
import courses from "@/data/courses";

export default function CoursesPage() {
  return (
    <main>
      <h1>Explora nuestros cursos</h1>
      <CourseExplorer courses={courses} />
    </main>
  );
}
```

Componente de cliente:

```jsx
"use client";

export default function CourseExplorer({ courses }) {
  // búsqueda, filtros y favoritos
}
```

```text
CoursesPage — servidor
│
│ entrega datos serializables
▼
CourseExplorer — cliente
├── estado de búsqueda
├── categoría
├── favoritos
└── localStorage
```

## 4.4 Datos serializables

Los datos enviados del servidor al cliente deben poder representarse de forma segura.

Son adecuados:

- cadenas;
- números;
- booleanos;
- arreglos;
- objetos simples;
- valores `null`.

Evita enviar:

- funciones;
- conexiones;
- objetos complejos que dependan del servidor;
- secretos;
- variables de entorno privadas.

## 4.5 No conviertas todo en cliente

Esta solución funciona, pero desperdicia la arquitectura:

```jsx
"use client";

export default function RootLayout({ children }) {
  // ...
}
```

Si el layout no necesita estado ni APIs del navegador, debe permanecer como componente de servidor.

Utiliza una isla interactiva:

```text
RootLayout — servidor
├── SiteHeader — servidor
├── CoursesPage — servidor
│   └── CourseExplorer — cliente
│       ├── CourseFilters
│       ├── FavoriteButton
│       └── CourseList
└── SiteFooter — servidor
```

## 4.6 Migrar favoritos

La lógica de `localStorage` del módulo anterior debe permanecer en un componente de cliente:

```jsx
"use client";

import { useEffect, useState } from "react";

function readFavorites() {
  try {
    const stored = localStorage.getItem("coa-favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function CourseExplorer({ courses }) {
  const [favorites, setFavorites] = useState([]);
  const [favoritesReady, setFavoritesReady] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setFavoritesReady(true);
  }, []);

  useEffect(() => {
    if (favoritesReady) {
      localStorage.setItem("coa-favorites", JSON.stringify(favorites));
    }
  }, [favorites, favoritesReady]);

  // ...
}
```

El primer efecto lee la preferencia después de montar el componente en el navegador. El segundo espera esa lectura antes de guardar; así no reemplaza accidentalmente los favoritos existentes con un arreglo vacío.

No intentes leer `localStorage` desde una página de servidor ni durante el renderizado inicial. Esa API existe solamente en el navegador.

## 4.7 Error de hidratación

La hidratación conecta la interfaz inicial con la interacción del navegador. Puede fallar si el servidor genera un contenido y el primer renderizado del cliente genera otro.

Evita durante el renderizado:

- `Math.random()`;
- fechas cambiantes sin control;
- acceso directo a `window`;
- contenido diferente según datos disponibles solo en el navegador;
- HTML inválido.

No ocultes una advertencia de hidratación. Encuentra la diferencia.

### Ejercicio 4. Clasificar componentes

Clasifica estos componentes como servidor o cliente y justifica cada respuesta:

- `SiteFooter`;
- `CourseDetailPage`;
- `FavoriteButton`;
- `CourseExplorer`;
- `AboutPage`;
- `EnrollmentForm`;
- `CourseCard` sin eventos;
- navegación con un menú móvil que abre y cierra.

Después compara la clasificación con tu árbol real. Elimina `"use client"` de archivos que no lo necesitan.

### Ejercicio 5. Migración de la isla interactiva

Integra en `/cursos`:

- búsqueda;
- categoría;
- favoritos;
- persistencia;
- estado vacío;
- contador de resultados.

La página debe importar los datos en el servidor y entregarlos al explorador mediante propiedades. Conserva el comportamiento probado del Módulo 3 y verifica que no aparezcan errores de hidratación.

---

# 5. Diseño práctico con Tailwind CSS

## 5.1 Qué es Tailwind CSS

Tailwind permite construir estilos combinando clases de utilidad:

```jsx
<h1 className="text-4xl font-bold tracking-tight text-slate-950">
  Aprende desarrollo web moderno
</h1>
```

Cada clase tiene una responsabilidad:

| Clase | Efecto |
|---|---|
| `text-4xl` | Tamaño del texto |
| `font-bold` | Peso |
| `tracking-tight` | Espaciado entre letras |
| `text-slate-950` | Color |

Tailwind no reemplaza tu conocimiento de CSS. Para utilizarlo bien debes comprender caja, espaciado, Flexbox, Grid, adaptación y estados.

## 5.2 Configuración actual

El proyecto creado con `--tailwind` ya incluye la integración necesaria.

En `src/app/globals.css` encontrarás una importación similar:

```css
@import "tailwindcss";
```

No sigas una guía antigua que solicite crear archivos de configuración que tu versión no necesita. Primero revisa el proyecto generado y la documentación vigente.

## 5.3 Contenedor de página

Un patrón frecuente:

```jsx
<main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
  {/* contenido */}
</main>
```

Interpretación:

- `mx-auto`: centra el contenedor;
- `w-full`: utiliza el ancho disponible;
- `max-w-6xl`: limita el ancho máximo;
- `px-4`: agrega espacio horizontal;
- `py-12`: agrega espacio vertical;
- `sm:px-6`: aumenta espacio desde el punto `sm`;
- `lg:px-8`: vuelve a aumentarlo desde `lg`.

## 5.4 Móvil primero

Las clases sin prefijo se aplican desde el tamaño más pequeño:

```jsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {/* tarjetas */}
</div>
```

```text
Pantalla pequeña     → 1 columna
Desde md             → 2 columnas
Desde lg             → 3 columnas
```

No diseñes primero la pantalla grande para después reparar la pequeña. Define una base útil y mejora progresivamente.

## 5.5 Estados de interacción

```jsx
<Link
  href="/cursos"
  className="
    inline-flex items-center rounded-lg bg-indigo-600 px-5 py-3
    font-semibold text-white transition
    hover:bg-indigo-700
    focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-indigo-600
  "
>
  Explorar cursos
</Link>
```

Los prefijos describen estados:

- `hover:`;
- `focus:`;
- `focus-visible:`;
- `disabled:`;
- `group-hover:`.

No elimines el contorno de foco sin reemplazarlo por una alternativa claramente visible.

## 5.6 Tarjeta de curso

```jsx
<article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-semibold text-indigo-700">
    {course.category}
  </p>

  <h2 className="mt-2 text-xl font-bold text-slate-950">
    {course.title}
  </h2>

  <p className="mt-3 flex-1 leading-7 text-slate-600">
    {course.description}
  </p>

  <Link
    href={`/cursos/${course.slug}`}
    className="mt-6 font-semibold text-indigo-700 hover:text-indigo-900"
  >
    Ver detalles de {course.title}
  </Link>
</article>
```

`flex-1` permite que la descripción ocupe el espacio disponible y alinea los enlaces entre tarjetas de alturas diferentes.

## 5.7 Clases condicionales

```jsx
const buttonClasses = isFavorite
  ? "bg-amber-100 text-amber-900"
  : "bg-slate-100 text-slate-700";

return (
  <button className={`rounded-lg px-3 py-2 ${buttonClasses}`}>
    {isFavorite ? "★ Favorito" : "☆ Agregar favorito"}
  </button>
);
```

Utiliza nombres completos de clases. Evita construir nombres dinámicos:

```jsx
// Evita esta forma:
const className = `bg-${color}-600`;
```

Tailwind detecta las clases al analizar el código. Si el nombre completo no aparece, el estilo puede no incluirse en la construcción final.

## 5.8 Evitar una pared de clases

Una lista extensa no siempre es un problema. Si se repite o dificulta entender la interfaz:

- extrae un componente;
- guarda una cadena reutilizable;
- divide las clases por intención;
- utiliza CSS global para reglas verdaderamente globales.

No crees una abstracción para cada combinación de dos clases. Prioriza claridad.

## 5.9 Mantener identidad visual

Tailwind no debe convertir la página en una colección de colores elegidos al azar.

Define una guía breve:

```text
Color principal: índigo
Texto principal: slate-950
Texto secundario: slate-600
Fondos: blanco y slate-50
Bordes: slate-200
Radio de tarjetas: 2xl
Ancho máximo: 6xl
Escala de espacios: 2, 3, 4, 6, 8, 12, 16
```

Utiliza decisiones consistentes en lugar de improvisar cada componente.

### Ejercicio 6. Reconstrucción visual

Elige la sección principal y una tarjeta del proyecto anterior. Recréelas con Tailwind.

Requisitos:

- base móvil;
- mejora en `md` o `lg`;
- ancho máximo;
- contraste suficiente;
- foco visible;
- estados `hover` que no sean indispensables para comprender;
- ninguna pérdida de semántica;
- ninguna clase dinámica incompleta.

Compara ambas versiones y registra qué reglas CSS se convirtieron en utilidades.

---

# 6. Metadatos, imágenes y estados especiales

## 6.1 Metadatos del sitio

En el layout raíz:

```jsx
export const metadata = {
  title: {
    default: "COA — Cursos Online Avanzados",
    template: "%s | COA"
  },
  description:
    "Cursos prácticos de programación, datos y desarrollo web moderno."
};
```

En una página:

```jsx
export const metadata = {
  title: "Cursos",
  description: "Explora los cursos disponibles en la plataforma COA."
};
```

El título resultante será:

```text
Cursos | COA
```

Cada página debe tener un título y una descripción que representen su contenido. No copies la misma descripción en todas.

## 6.2 Metadatos dinámicos

```jsx
import courses from "@/data/courses";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    return {
      title: "Curso no encontrado"
    };
  }

  return {
    title: course.title,
    description: course.description
  };
}
```

No necesitas técnicas avanzadas de posicionamiento. Comienza con títulos únicos, descripciones claras, contenido semántico y direcciones legibles.

## 6.3 Imágenes con `next/image`

```jsx
import Image from "next/image";

export default function CourseHero({ course }) {
  return (
    <Image
      src={course.image}
      alt={course.imageAlt}
      width={1200}
      height={675}
      className="h-auto w-full rounded-2xl object-cover"
      preload
    />
  );
}
```

Datos:

```js
{
  image: "/images/courses/web-modern.webp",
  imageAlt: "Código y componentes de una interfaz web"
}
```

Buenas prácticas:

- utiliza `alt=""` si la imagen es decorativa;
- describe la información visual si es significativa;
- incluye ancho y alto;
- evita imágenes enormes;
- utiliza formatos modernos;
- reserva `preload` para una imagen principal que probablemente sea el elemento visual más importante al cargar;
- no marques todas las imágenes con `preload`; las demás pueden conservar la carga diferida predeterminada.

## 6.4 Página de carga

Puedes crear:

```text
src/app/cursos/loading.js
```

```jsx
export default function CoursesLoading() {
  return (
    <div role="status" className="mx-auto max-w-6xl px-4 py-12">
      Cargando cursos...
    </div>
  );
}
```

El archivo comunica que una sección todavía se está preparando. Evita animaciones que distraigan o provoquen movimiento excesivo.

## 6.5 Errores y 404 no son lo mismo

| Situación | Respuesta |
|---|---|
| El curso solicitado no existe | `notFound()` y `not-found.js` |
| Ocurre una excepción inesperada | Frontera de error |
| El contenido todavía se prepara | `loading.js` |

Para este proyecto es obligatorio manejar recursos inexistentes. Una frontera de error personalizada es una mejora adicional, no un sustituto de corregir errores.

## 6.6 Revisar producción

Antes de publicar:

```bash
npm run lint
npm run build
```

Si la construcción termina correctamente:

```bash
npm run start
```

Revisa nuevamente las rutas en la versión de producción.

### Ejercicio 7. Auditoría de página

Elige el detalle de un curso y comprueba:

- título único en la pestaña;
- descripción específica;
- un solo `h1`;
- imagen optimizada;
- texto alternativo correcto;
- dirección legible;
- 404 para un slug inexistente;
- navegación para regresar;
- construcción sin error.

Guarda el resultado en `docs/page-audit.md`.

---

# 7. Git, construcción y despliegue en Vercel

## 7.1 Preparar el repositorio

Comprueba:

```bash
git status
git log --oneline
```

Antes de subir:

- no incluyas `.next`;
- no incluyas `node_modules`;
- no incluyas secretos;
- confirma que `.gitignore` existe;
- ejecuta análisis y construcción;
- prueba todas las rutas.

## 7.2 Publicar en GitHub

Si el proyecto todavía no tiene repositorio remoto:

```bash
git add .
git commit -m "feat: crear portal COA con Next.js"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Utiliza la dirección exacta proporcionada por GitHub.

## 7.3 Importar en Vercel

1. Inicia sesión en Vercel.
2. Selecciona **New Project**.
3. Importa el repositorio de GitHub.
4. Confirma que Vercel detectó Next.js.
5. Revisa la carpeta raíz.
6. No agregues variables de entorno que el proyecto no utiliza.
7. Inicia el despliegue.
8. Abre la dirección generada.

Vercel crea normalmente:

- un despliegue de producción para la rama principal;
- una vista previa para cambios realizados en otras ramas o propuestas de cambio.

```text
Rama de trabajo
      │
      └── push ──► vista previa

Rama principal
      │
      └── push ──► producción
```

## 7.4 La publicación no termina con una pantalla verde

Prueba en la dirección pública:

- `/`;
- `/cursos`;
- al menos tres detalles;
- `/nosotros`;
- una ruta inexistente;
- búsqueda y filtros;
- persistencia después de recargar;
- navegación con teclado;
- pantalla pequeña;
- imágenes;
- títulos de pestaña.

Un sitio que funciona solamente en `localhost` no está completamente verificado.

### Ejercicio 8. Corrección mediante vista previa

Crea una rama:

```bash
git switch -c mejora/metadatos-cursos
```

Mejora el título o la descripción de una ruta, realiza un commit y sube la rama. Si tu integración genera una vista previa, comprueba el cambio allí antes de incorporarlo a la rama principal. Registra la dirección de vista previa y el resultado.

---

# 8. Diagnóstico asistido por IA

## 8.1 La IA necesita la versión y el contexto correctos

Next.js cambia con rapidez. Una respuesta basada en Pages Router o en una versión anterior puede recomendar:

- `pages/` en lugar de `app/`;
- `getServerSideProps`;
- acceso sincrónico a `params`;
- configuraciones antiguas de Tailwind;
- convertir innecesariamente todo en componente de cliente.

Incluye siempre:

- que utilizas App Router;
- JavaScript, no TypeScript;
- el error completo;
- la versión indicada en `package.json`;
- la estructura de archivos;
- el componente mínimo;
- el resultado esperado.

## 8.2 Prompt para diagnosticar

```text
Estoy trabajando con Next.js App Router y JavaScript.
El proyecto usa la configuración actual creada con create-next-app.

Ruta afectada:
src/app/cursos/[slug]/page.js

Resultado esperado:
mostrar el curso cuyo slug aparece en la URL.

Resultado actual:
[descripción]

Primer error completo:
[error]

Código mínimo:
[código]

Explícame primero la causa. Verifica que la solución corresponda a
App Router actual y que params se maneje de forma asíncrona. Propón
el cambio mínimo. No conviertas toda la página en componente de cliente.
```

## 8.3 Prompt para revisar una frontera

```text
Clasifica estos componentes de Next.js como servidor o cliente.
Para cada uno indica qué capacidad concreta exige "use client".
Si no necesita estado, eventos, Hooks ni APIs del navegador, mantenlo
como componente de servidor. No agregues bibliotecas.

[árbol y fragmentos]
```

## 8.4 Prompt para Tailwind

```text
Convierte este bloque CSS a Tailwind CSS actual.
Conserva HTML semántico, enfoque móvil primero, foco visible y contraste.
Explica cada grupo de utilidades. No uses clases dinámicas construidas
con fragmentos y no agregues una biblioteca de componentes.

[HTML y CSS]
```

## 8.5 Comprobar la propuesta

Después de aplicar una sugerencia:

1. explica qué cambió;
2. revisa la documentación oficial;
3. ejecuta ESLint;
4. ejecuta la construcción;
5. prueba la ruta directa;
6. prueba la navegación interna;
7. revisa la consola;
8. confirma que no aumentó innecesariamente el código de cliente.

### Ejercicio 9. Detectar una recomendación antigua

Pide a una IA dos formas de crear una ruta dinámica en Next.js. Indica expresamente que una de las respuestas debe representar una práctica antigua. Después:

- identifica cuál corresponde a App Router;
- explica por qué la otra no pertenece a este proyecto;
- corrige el manejo de `params` si es necesario;
- enlaza la documentación oficial utilizada para verificar.

El objetivo no es copiar ninguna respuesta, sino practicar la verificación.

---

# 9. Mini proyecto: directorio de recursos

## Objetivo

Construir un pequeño directorio multipágina para practicar rutas, navegación, layouts, datos locales y Tailwind antes de modificar el portal completo.

## Resultado esperado

```text
/recursos
├── Tarjeta: Documentación de React
├── Tarjeta: Documentación de Next.js
├── Tarjeta: Documentación de Tailwind CSS
└── cada tarjeta conduce a /recursos/[slug]
```

## Datos mínimos

Cada recurso debe tener:

```js
{
  id: "resource-01",
  slug: "documentacion-react",
  title: "Documentación de React",
  category: "Documentación",
  summary: "Guía oficial para aprender React.",
  externalUrl: "https://es.react.dev/"
}
```

## Requisitos

1. Crear `/recursos`.
2. Crear `/recursos/[slug]`.
3. Representar al menos cuatro recursos.
4. Utilizar un layout anidado para la sección.
5. Enlazar las tarjetas mediante `Link`.
6. Leer el `slug` con `await params`.
7. Utilizar `notFound()` para un recurso inexistente.
8. Incluir `generateStaticParams`.
9. Agregar metadatos al índice.
10. Generar metadatos dinámicos en el detalle.
11. Diseñar con Tailwind y enfoque móvil primero.
12. Conservar foco visible y enlaces externos identificables.
13. Mantener los componentes como servidor porque no necesitan interacción.

## Árbol sugerido

```text
src/app/recursos/
├── layout.js
├── page.js
└── [slug]/
    └── page.js
```

## Comprobaciones

- ¿Cada tarjeta abre el detalle correcto?
- ¿Una dirección inventada muestra la página 404?
- ¿La recarga mantiene el contenido?
- ¿Los títulos de pestaña cambian?
- ¿El diseño funciona a 320 píxeles?
- ¿Algún archivo utiliza `"use client"` sin necesidad?
- ¿La construcción finaliza?

## Entrega del mini proyecto

Incluye:

- enlace al repositorio o carpeta indicada;
- mapa de rutas;
- captura del índice;
- captura de un detalle;
- captura de la página 404;
- explicación de por qué los componentes permanecen en el servidor.

[Entregar el mini proyecto del Módulo 4](https://forms.gle/BayPBDiXAGurWjnL6)

---

# 10. Proyecto del módulo: portal COA en Next.js

## Descripción

Transforma el explorador aprobado en el Módulo 3 en un portal multipágina de Next.js. Conserva sus funciones interactivas, crea páginas de detalle y publica el resultado en Vercel.

El proyecto debe demostrar una migración razonada. No copies todos los componentes dentro de una única página de cliente.

## Resultado profesional

El portal debe:

- comunicar con claridad qué es COA;
- ofrecer navegación entre páginas;
- mostrar un catálogo interactivo;
- proporcionar una dirección propia para cada curso;
- mantener una identidad visual coherente;
- cargar correctamente desde una dirección pública;
- ofrecer metadatos útiles;
- responder bien en móvil y escritorio;
- demostrar una frontera servidor-cliente intencional.

## Mapa obligatorio

```text
/
├── /cursos
│   ├── /cursos/logica-programacion
│   ├── /cursos/python-nivel-1
│   └── /cursos/desarrollo-web-moderno
├── /nosotros
└── /ruta-inexistente → 404
```

Puedes incluir más cursos y páginas. No agregues rutas que no tengan contenido útil.

## Estructura mínima

```text
src/
├── app/
│   ├── cursos/
│   │   ├── [slug]/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   ├── loading.js
│   │   └── page.js
│   ├── nosotros/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   ├── not-found.js
│   └── page.js
├── components/
│   ├── courses/
│   ├── layout/
│   └── ui/
└── data/
    └── courses.js
```

## Requisitos obligatorios

### 1. Configuración

- Proyecto creado con Next.js actual.
- App Router.
- JavaScript.
- Carpeta `src`.
- Tailwind CSS.
- ESLint.
- Alias `@/*`.
- Sin bibliotecas innecesarias.

### 2. Layout raíz

- Contiene `<html lang="es">`.
- Incluye encabezado y pie.
- Recibe `children`.
- Define metadatos generales.
- No utiliza `"use client"` sin necesidad.

### 3. Página de inicio

- Presenta COA.
- Incluye una propuesta de valor.
- Muestra al menos tres cursos destacados.
- Contiene una llamada a explorar el catálogo.
- Utiliza `Link` para navegación interna.
- Tiene un único `h1`.

### 4. Catálogo

- Vive en `/cursos`.
- Recibe los datos desde un componente de servidor.
- Conserva búsqueda por nombre y descripción.
- Conserva filtro por categoría.
- Conserva contador de resultados.
- Conserva favoritos.
- Conserva persistencia en `localStorage`.
- Muestra un estado vacío útil.
- Utiliza un componente de cliente limitado a la zona interactiva.

### 5. Detalles dinámicos

- Utilizan `/cursos/[slug]`.
- Cada curso tiene slug único.
- `params` se espera de forma asíncrona.
- El curso se busca a partir del slug.
- Existe `generateStaticParams`.
- Existe `notFound()` para cursos inexistentes.
- Cada detalle muestra nombre, categoría, duración, descripción y habilidades.
- Existe un enlace para volver al catálogo.

### 6. Página Nosotros

- Explica propósito, metodología y forma de aprendizaje.
- No contiene texto de relleno.
- Utiliza estructura semántica.
- Mantiene el diseño del portal.

### 7. Navegación

- Utiliza `Link`.
- Funciona con teclado.
- Tiene un nombre accesible.
- Permite llegar a las rutas principales.
- No utiliza botones para simular enlaces.
- No produce una recarga completa innecesaria.

### 8. Tailwind CSS

- Diseño móvil primero.
- Funciona desde 320 píxeles.
- Utiliza una escala consistente de espacios.
- Mantiene colores y tipografía coherentes.
- Incluye estados de foco visibles.
- No construye nombres de clases mediante fragmentos dinámicos.
- No depende de `hover` para comunicar información esencial.
- Conserva HTML semántico.

### 9. Imágenes

- Utiliza `next/image` para imágenes de contenido.
- Incluye dimensiones.
- Utiliza texto alternativo correcto.
- No marca todas las imágenes con `preload`.
- No publica archivos innecesariamente pesados.

### 10. Metadatos

- El layout define título base y plantilla.
- `/`, `/cursos` y `/nosotros` tienen descripciones apropiadas.
- Los detalles generan título y descripción dinámicos.
- Los títulos no son idénticos.

### 11. Estados especiales

- Existe `not-found.js`.
- Un slug inexistente muestra la página 404.
- La página 404 permite recuperar la navegación.
- La sección de cursos incluye `loading.js`.
- No existen pantallas vacías sin explicación.

### 12. Calidad

- `npm run lint` finaliza correctamente.
- `npm run build` finaliza correctamente.
- No hay errores en la consola.
- No existen advertencias evitables.
- Los componentes tienen responsabilidades claras.
- No existe manipulación directa del DOM.
- No existe mutación directa del estado.

### 13. Git y publicación

- El repositorio está disponible en GitHub.
- El historial contiene al menos ocho commits significativos.
- El sitio está publicado en Vercel.
- La dirección pública funciona.
- Se ha probado una vista previa antes de producción.

## Restricciones

No utilices:

- Pages Router;
- carpeta `pages`;
- `getServerSideProps`;
- `getStaticProps`;
- React Router;
- Redux;
- Bootstrap;
- una biblioteca de componentes;
- autenticación;
- base de datos;
- API remota inestable;
- middleware;
- acciones de servidor;
- configuraciones avanzadas de caché;
- TypeScript;
- código que no puedas explicar.

## Arquitectura esperada

```text
RootLayout — servidor
├── SiteHeader — servidor
├── HomePage — servidor
├── CoursesPage — servidor
│   └── CourseExplorer — cliente
│       ├── CourseFilters
│       ├── CourseList
│       └── FavoriteButton
├── CourseDetailPage — servidor
├── AboutPage — servidor
└── SiteFooter — servidor
```

Si tu arquitectura es diferente, documenta por qué.

## Plan de migración

### Fase 1. Inventario

- Enumera rutas.
- Dibuja layouts.
- Clasifica componentes.
- Identifica la isla interactiva.
- revisa datos y slugs.

### Fase 2. Estructura

- Crea el proyecto.
- Crea layout raíz.
- Crea rutas estáticas.
- Integra encabezado y pie.
- Comprueba navegación.

### Fase 3. Catálogo

- Importa los datos en la página de servidor.
- Entrega los cursos al explorador.
- Migra búsqueda, filtros y favoritos.
- Prueba persistencia.

### Fase 4. Detalles

- Crea `[slug]`.
- Implementa parámetros.
- Genera rutas.
- Maneja curso inexistente.
- Agrega metadatos.

### Fase 5. Diseño

- Define guía visual.
- Migra estilos a Tailwind.
- Revisa móvil primero.
- Revisa estados de foco.
- Optimiza imágenes.

### Fase 6. Producción

- Ejecuta ESLint.
- Ejecuta construcción.
- prueba la versión construida.
- Publica en GitHub.
- Revisa una vista previa.
- Publica y prueba producción.

## Pruebas mínimas

| Caso | Acción | Resultado esperado |
|---|---|---|
| Inicio | Abrir `/` | Se presenta COA y hay navegación |
| Catálogo | Abrir `/cursos` | Aparecen los cursos |
| Búsqueda | Escribir una coincidencia | La lista se actualiza |
| Filtros | Elegir una categoría | Solo aparecen coincidencias |
| Favorito | Marcar y recargar | La preferencia permanece |
| Detalle | Abrir tres tarjetas | Cada una muestra el curso correcto |
| Acceso directo | Pegar una ruta dinámica | El detalle carga correctamente |
| Slug inexistente | Abrir un slug inventado | Aparece la página 404 |
| Ruta inexistente | Abrir `/no-existe` | Aparece la página 404 |
| Metadatos | Revisar tres pestañas | Los títulos son diferentes |
| Imagen | Desactivar temporalmente CSS | Conserva texto alternativo adecuado |
| Teclado | Recorrer la interfaz | Todos los controles son accesibles |
| Móvil | Revisar a 320 px | No hay desplazamiento horizontal |
| Construcción | Ejecutar `npm run build` | Termina correctamente |
| Producción | Repetir pruebas en Vercel | El resultado coincide con local |

## Uso obligatorio de IA

Utiliza ChatGPT o Claude en al menos tres situaciones:

1. **Arquitectura:** revisar mapa de rutas y frontera servidor-cliente.
2. **Diagnóstico:** explicar un error real de desarrollo o construcción.
3. **Revisión:** comprobar Tailwind, accesibilidad o metadatos.

Bitácora:

| Problema | Contexto entregado | Prompt | Sugerencia | Decisión | Verificación |
|---|---|---|---|---|---|

Debe existir al menos una recomendación que hayas modificado o rechazado con una justificación.

## Historial sugerido

```text
chore: crear proyecto Next.js con App Router
feat: agregar layout y navegación principal
feat: crear páginas de inicio y nosotros
feat: migrar catálogo interactivo
feat: agregar rutas dinámicas de cursos
feat: manejar cursos inexistentes
style: aplicar diseño responsive con Tailwind
feat: agregar metadatos e imágenes optimizadas
docs: documentar pruebas y uso de IA
fix: corregir errores detectados en producción
```

## Entrega

Incluye:

- nombre completo;
- enlace al repositorio;
- enlace de producción en Vercel;
- enlace a una vista previa;
- mapa de rutas;
- árbol servidor-cliente;
- captura del inicio;
- captura del catálogo en móvil;
- captura de un detalle;
- captura de la página 404;
- resultado de `npm run lint`;
- resultado de `npm run build`;
- tabla de pruebas;
- bitácora de IA;
- reflexión de 150 a 250 palabras.

La reflexión debe responder:

1. ¿Qué responsabilidad resolvió Next.js que no resolvía React por sí solo?
2. ¿Qué componente necesitó `"use client"` y por qué?
3. ¿Qué componente mantuviste en el servidor?
4. ¿Qué diferencia encontraste entre desarrollo y producción?
5. ¿Qué recomendación de IA verificaste o rechazaste?

[Entregar el proyecto del Módulo 4](https://forms.gle/BayPBDiXAGurWjnL6)

## Lista de comprobación

- [ ] El proyecto utiliza App Router.
- [ ] El proyecto utiliza JavaScript.
- [ ] El layout raíz es un componente de servidor.
- [ ] Existen las cuatro experiencias de navegación obligatorias.
- [ ] Las tarjetas utilizan `Link`.
- [ ] Cada curso tiene una ruta dinámica.
- [ ] `params` se espera correctamente.
- [ ] Existe `generateStaticParams`.
- [ ] Existe una página 404.
- [ ] La búsqueda, filtros y favoritos funcionan.
- [ ] `localStorage` se utiliza solamente en cliente.
- [ ] Tailwind funciona en desarrollo y producción.
- [ ] No hay clases dinámicas incompletas.
- [ ] El diseño funciona desde 320 píxeles.
- [ ] Las imágenes utilizan `Image`.
- [ ] Los metadatos cambian según la ruta.
- [ ] ESLint finaliza.
- [ ] La construcción finaliza.
- [ ] El repositorio muestra el proceso.
- [ ] El sitio público fue probado.
- [ ] La bitácora contiene tres usos de IA.

---

## Rúbrica de evaluación

**Puntuación total:** 100 puntos  
**Puntuación mínima de aprobación:** 70 puntos y cumplimiento de todos los requisitos críticos

| Criterio | Excelente | Competente | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Rutas y navegación | Mapa completo, rutas directas, dinámicas y 404 funcionan | Funciones principales correctas con detalles menores | Varias rutas o enlaces presentan fallos | La navegación no permite usar el portal | 20 |
| Arquitectura servidor-cliente | Fronteras mínimas, justificadas y datos bien transferidos | Separación adecuada con mejoras menores | Uso excesivo de cliente o decisiones confusas | No comprende o rompe la frontera | 15 |
| Funcionalidad React | Búsqueda, filtros, favoritos y persistencia completos | Funciones principales con fallos menores | Interacción parcial | Funciones esenciales no operan | 15 |
| Tailwind y diseño | Sistema coherente, móvil primero y accesible | Buen diseño con detalles menores | Inconsistencias o problemas adaptables | Diseño roto o inaccesible | 15 |
| Metadatos, imágenes y estados | Implementación completa y específica por ruta | Requisitos principales satisfechos | Implementación parcial | Ausentes o incorrectos | 10 |
| Calidad del código | Componentes claros, ESLint y build correctos | Código sólido con oportunidades menores | Duplicación o advertencias | Errores graves o construcción fallida | 10 |
| Git y despliegue | Historial claro, vista previa y producción verificadas | Repositorio y producción correctos | Historial pobre o publicación incompleta | Sin repositorio o sitio público | 10 |
| Uso responsable de IA | Tres usos razonados, uno rechazado o modificado y todo verificado | Tres usos con verificación suficiente | Evidencia incompleta | Sin bitácora o código no comprendido | 5 |
| **Total** |  |  |  |  | **100** |

### Requisitos críticos

El proyecto debe corregirse antes de aprobarse si:

- no utiliza App Router;
- `npm run build` falla;
- la dirección pública no funciona;
- no existen rutas dinámicas;
- un slug inexistente bloquea la aplicación;
- todo el portal se convirtió en cliente sin justificación;
- búsqueda, filtros o favoritos dejaron de funcionar;
- existe manipulación directa del DOM;
- existen errores activos en la consola;
- la navegación principal no funciona con teclado;
- el diseño falla a 320 píxeles;
- el estudiante no puede explicar su frontera servidor-cliente;
- falta el repositorio o la evidencia del proceso.

El proyecto debe ser aprobado antes de continuar al Módulo 5. Si recibe observaciones, realiza las correcciones y entrega una nueva versión.

---

# 11. Evaluación del módulo

## Pregunta 1

¿Qué archivo hace pública la ruta `/cursos`?

A. `src/components/cursos.js`  
B. `src/app/cursos/page.js`  
C. `public/cursos.html`  
D. `src/app/page/cursos.js`

## Pregunta 2

¿Cuál es la responsabilidad principal de `layout.js`?

A. Guardar contraseñas.  
B. Reemplazar todos los componentes.  
C. Compartir interfaz entre rutas envueltas.  
D. Crear automáticamente una base de datos.

## Pregunta 3

¿Cuál es el elemento adecuado para navegar de `/` a `/cursos`?

A. Un `div` con evento.  
B. Un botón que cambia `window.location`.  
C. El componente `Link`.  
D. Un efecto.

## Pregunta 4

¿Qué representa la carpeta `[slug]`?

A. Una carpeta privada.  
B. Un segmento dinámico de la ruta.  
C. Una variable de CSS.  
D. Un componente de cliente.

## Pregunta 5

¿Cómo se obtiene el slug en la forma actual de App Router?

A. `document.URL.slug`.  
B. `const { slug } = await params`.  
C. `localStorage.getItem("slug")`.  
D. `querySelector("[slug]")`.

## Pregunta 6

¿Qué componente necesita `"use client"`?

A. Un pie estático.  
B. Una página que importa datos locales y muestra texto.  
C. Un buscador que utiliza `useState` y `onChange`.  
D. Un layout sin interacción.

## Pregunta 7

¿Cuál valor puede pasar del servidor al cliente?

A. Una función del servidor.  
B. Una clave privada.  
C. Un arreglo de objetos simples de cursos.  
D. Una conexión de base de datos.

## Pregunta 8

¿Qué significa `md:grid-cols-2`?

A. Dos columnas solamente en móvil.  
B. Dos columnas desde el punto de ruptura `md`.  
C. Dos filas en cualquier tamaño.  
D. Una clase que requiere JavaScript.

## Pregunta 9

¿Qué debe hacerse antes de desplegar?

A. Subir `node_modules`.  
B. Ignorar las advertencias.  
C. Ejecutar ESLint y construcción.  
D. Convertir todos los archivos a cliente.

## Pregunta 10

Una IA propone `getServerSideProps` dentro de `src/app/cursos/page.js`. ¿Qué debes hacer?

A. Aceptarlo porque su nombre incluye servidor.  
B. Verificar la documentación y rechazarlo porque pertenece a Pages Router.  
C. Instalar React Router.  
D. Mover todos los componentes a `public`.

## Actividad de explicación

Explica sin leer:

1. cómo una carpeta se convierte en ruta;
2. qué diferencia existe entre `page.js` y `layout.js`;
3. cuándo utilizarías `"use client"`;
4. por qué `CourseExplorer` puede ser cliente y `CoursesPage` servidor;
5. qué diferencia existe entre vista previa y producción.

La evaluación se aprueba con al menos un 70 % y una explicación clara de los cinco puntos.

---

# Videos recomendados

Los videos complementan la práctica. Utiliza el código y la documentación vigentes del módulo cuando un video muestre una versión anterior.

| Tema | Video | Canal | Duración aproximada | Motivo |
|---|---|---|---:|---|
| Panorama actual | [Todo lo que debes saber de Next.js en 2026](https://www.youtube.com/watch?v=JRsEAhzXHGw) | Fazt Code | 30 min | Presenta el propósito actual del framework y sus capacidades principales. |
| App Router | [Cómo utilizar el App Router en Next.js](https://www.youtube.com/watch?v=nNWV4eJUofg) | Garaje de ideas Tech | 25 min | Explica la organización de páginas, rutas y layouts. |
| Rutas dinámicas | [Next.js App Router: explorando las rutas dinámicas](https://www.youtube.com/watch?v=FAJFMAaV9ao) | Coffee Logic | 7 min | Video breve de un canal pequeño centrado en segmentos dinámicos. |
| Servidor y cliente | [React Server vs Client Components en Next.js](https://www.youtube.com/watch?v=MTkwmy1iizc) | FDLTech | 6 min | Distingue de forma directa las dos clases de componentes. |
| Tailwind CSS actual | [Guía Tailwind CSS v4: qué es y cómo funciona](https://www.youtube.com/watch?v=ZLY6X5u3zWw) | AlexCG Design | 9 min | Introducción reciente a las utilidades y al enfoque de Tailwind 4. |
| Despliegue | [Despliega tu App Next.js con Vercel, GitHub y CLI](https://www.youtube.com/watch?v=eiQY3n8nNlw) | jftics | 15 min | Recorre el flujo de publicación con GitHub y Vercel. |

## Reproductores de video

[Todo lo que debes saber de Next.js en 2026](https://www.youtube.com/watch?v=JRsEAhzXHGw)

[Cómo utilizar el App Router en Next.js](https://www.youtube.com/watch?v=nNWV4eJUofg)

[Next.js App Router: explorando las rutas dinámicas](https://www.youtube.com/watch?v=FAJFMAaV9ao)

[React Server vs Client Components en Next.js](https://www.youtube.com/watch?v=MTkwmy1iizc)

[Guía Tailwind CSS v4: qué es y cómo funciona](https://www.youtube.com/watch?v=ZLY6X5u3zWw)

[Despliega tu App Next.js con Vercel, GitHub y CLI](https://www.youtube.com/watch?v=eiQY3n8nNlw)

## Orden recomendado

1. Mira el panorama antes de crear el proyecto.
2. Revisa App Router antes del Ejercicio 2.
3. Mira rutas dinámicas antes del Ejercicio 3.
4. Revisa servidor y cliente antes del Ejercicio 4.
5. Mira Tailwind antes del Ejercicio 6.
6. Mira despliegue antes de publicar el proyecto.

> Algunos videos pueden mostrar Next.js 14 o 15. Los conceptos seleccionados siguen siendo relevantes, pero utiliza `await params`, la configuración actual de Tailwind y los comandos de este módulo.

---

# Documentación y lecturas

## Nivel esencial

- [Instalación oficial de Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Estructura del proyecto](https://nextjs.org/docs/app/getting-started/project-structure)
- [Layouts y páginas](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Navegación y enlaces](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [Componentes de servidor y cliente](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## Nivel de aplicación

- [Segmentos dinámicos](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Componente Link](https://nextjs.org/docs/app/api-reference/components/link)
- [Archivo not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Imágenes en Next.js](https://nextjs.org/docs/app/getting-started/images)
- [Metadatos e imágenes para compartir](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Despliegue de Next.js](https://nextjs.org/docs/app/getting-started/deploying)

## Tailwind CSS

- [Tailwind CSS con Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Estilos mediante utilidades](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Diseño adaptable](https://tailwindcss.com/docs/responsive-design)
- [Estados hover, focus y otros](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Detección de clases en archivos](https://tailwindcss.com/docs/detecting-classes-in-source-files)

## GitHub y Vercel

- [Desplegar repositorios Git con Vercel](https://vercel.com/docs/deployments/git)
- [Integración de Vercel con GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Entornos de despliegue de Vercel](https://vercel.com/docs/deployments/environments)

## Cómo utilizar la documentación

Cuando encuentres un ejemplo:

1. confirma que pertenece a App Router;
2. cambia la pestaña a JavaScript si aparece TypeScript;
3. revisa la fecha o versión;
4. reproduce el ejemplo mínimo;
5. adapta solamente lo necesario;
6. ejecuta ESLint y construcción.

No mezcles código de Pages Router con App Router.

---

# Glosario

**App Router:** sistema de enrutamiento de Next.js basado en la carpeta `app`.

**Build:** proceso que prepara la aplicación para producción.

**Client Component:** componente incluido en la frontera de cliente y capaz de utilizar estado, eventos, Hooks y APIs del navegador.

**Despliegue:** versión publicada de una aplicación.

**Frontera de cliente:** punto declarado con `"use client"` desde el cual los módulos importados forman parte del código de cliente.

**Hidratación:** proceso mediante el cual React conecta la interfaz inicial con los eventos del navegador.

**Layout:** interfaz compartida que envuelve páginas o layouts hijos.

**Metadatos:** información como título y descripción utilizada por el navegador y otros sistemas.

**Móvil primero:** enfoque que define estilos base para pantallas pequeñas y agrega mejoras para tamaños mayores.

**Página:** interfaz asociada a una ruta mediante `page.js`.

**Parámetro dinámico:** valor variable capturado desde una ruta, como `slug`.

**Producción:** entorno público principal.

**Ruta:** dirección asociada a una página.

**Segmento:** parte individual de una ruta.

**Server Component:** componente renderizado en el servidor por defecto en App Router.

**Slug:** texto legible y estable utilizado dentro de una dirección.

**Tailwind CSS:** herramienta de estilos basada en clases de utilidad.

**Utilidad:** clase pequeña que aplica una regla de estilo concreta.

**Vercel:** plataforma de despliegue utilizada en el curso.

**Vista previa:** despliegue aislado utilizado para revisar cambios antes de producción.

---

# Resumen final

En este módulo convertiste una aplicación React en un portal organizado:

```text
Datos locales
     │
     ▼
Página de servidor
     │
     ├──► contenido y metadatos
     │
     └──► datos serializables
                 │
                 ▼
       Explorador de cliente
       ├── búsqueda
       ├── filtros
       └── favoritos
```

También construiste una navegación basada en archivos:

```text
layout.js
├── page.js
├── cursos/page.js
├── cursos/[slug]/page.js
└── nosotros/page.js
```

Ahora puedes:

- crear un proyecto con App Router;
- definir páginas y layouts;
- navegar con `Link`;
- crear rutas dinámicas;
- leer parámetros actuales;
- manejar contenido inexistente;
- separar servidor y cliente;
- conservar interacción de React;
- diseñar con Tailwind CSS;
- optimizar imágenes;
- definir metadatos;
- ejecutar una construcción de producción;
- publicar con GitHub y Vercel;
- verificar una vista previa;
- detectar recomendaciones antiguas de IA.

El logro principal no es solamente tener varias páginas. Es comprender qué código necesita llegar al navegador, qué contenido puede permanecer en el servidor y cómo convertir un proyecto local en un producto público verificable.

---

# Cierre y requisito de avance

Antes de continuar:

- completa los ejercicios;
- entrega el mini proyecto;
- alcanza al menos un 70 % en la evaluación;
- publica el portal COA;
- entrega repositorio, producción, pruebas y bitácora;
- aplica las correcciones solicitadas;
- obtiene la aprobación del proyecto.

El Módulo 5 se habilita únicamente después de aprobar este proyecto.
