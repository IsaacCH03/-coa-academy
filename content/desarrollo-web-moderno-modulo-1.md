# COA — Cursos Online Avanzados

## Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial

# Módulo 1. Interfaces web profesionales con HTML y CSS

**Duración aproximada:** 6 horas y 30 minutos  
**Modalidad:** práctica guiada, ejercicios, mini proyecto y proyecto de módulo  
**Tecnologías:** HTML5, CSS3, Git, GitHub, ChatGPT o Claude  
**Resultado principal:** una landing page profesional, adaptable y accesible para presentar un curso de COA

---

## Bienvenida

Toda aplicación creada con React o Next.js termina produciendo una interfaz que el navegador interpreta mediante HTML y CSS. Por eso, antes de trabajar con componentes y frameworks, necesitas comprender la estructura y la presentación de una página web.

En este módulo no vas a memorizar una lista interminable de etiquetas y propiedades. Vas a construir una página real desde el inicio. Cada práctica añadirá o mejorará una parte del mismo proyecto.

Al finalizar podrás observar una interfaz, dividirla en secciones, representar correctamente su contenido con HTML y convertirla en un diseño adaptable con CSS. También comenzarás a utilizar Git y GitHub para conservar el historial del proyecto y una herramienta de inteligencia artificial para revisar tu trabajo sin delegarle tu razonamiento.

> **Principio del módulo:** HTML comunica qué significa el contenido. CSS decide cómo se presenta. La inteligencia artificial ayuda a revisar y acelerar el trabajo, pero tú tomas las decisiones y compruebas el resultado.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Explicar qué función cumplen HTML, CSS y el navegador dentro de una página web.
- Crear la estructura base de un documento HTML5.
- Organizar una página mediante etiquetas semánticas.
- Escribir contenido accesible con encabezados, enlaces, imágenes, botones y formularios correctamente utilizados.
- Conectar una hoja de estilos externa.
- Aplicar selectores, colores, tipografía, espaciado, bordes y estados interactivos.
- Comprender y utilizar el modelo de caja.
- Crear distribuciones de una dimensión con Flexbox.
- Crear cuadrículas de dos dimensiones con CSS Grid.
- Desarrollar interfaces con un enfoque *mobile first*.
- Utilizar Git para registrar cambios y GitHub para publicar un repositorio.
- Pedir ayuda a una inteligencia artificial mediante instrucciones claras.
- Revisar, probar y modificar el código propuesto por una IA antes de aceptarlo.
- Construir una landing page profesional sin utilizar JavaScript.

---

## Producto que construirás

Durante el módulo desarrollarás progresivamente una página para presentar un curso de COA:

```text
┌──────────────────────────────────────────────────────────────┐
│ COA                    Cursos  Beneficios  Contacto  Ingresar │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Aprende desarrollo web moderno          [Vista del curso]   │
│  Construye aplicaciones reales...                            │
│  [Ver programa] [Conocer beneficios]                         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│              Tres beneficios principales                     │
├──────────────────────────────────────────────────────────────┤
│             Contenido organizado en tarjetas                  │
├──────────────────────────────────────────────────────────────┤
│               Resultados y llamada a la acción                │
├──────────────────────────────────────────────────────────────┤
│                  Formulario de contacto                       │
├──────────────────────────────────────────────────────────────┤
│                         Pie de página                         │
└──────────────────────────────────────────────────────────────┘
```

Esta representación no define colores ni detalles decorativos. Su propósito es mostrar la estructura de la información antes de comenzar a diseñarla.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. La web y preparación del proyecto | 15 minutos |
| 2. HTML5 semántico y accesible | 45 minutos |
| 3. Fundamentos prácticos de CSS3 | 50 minutos |
| 4. Distribución con Flexbox y Grid | 55 minutos |
| 5. Diseño adaptable con enfoque *mobile first* | 30 minutos |
| 6. Control de versiones con Git y GitHub | 30 minutos |
| 7. Revisión profesional asistida por IA | 15 minutos |
| 8. Mini proyecto: tarjeta profesional de curso | 35 minutos |
| 9. Proyecto del módulo: landing page de un curso COA | 100 minutos |
| 10. Evaluación y cierre | 15 minutos |
| **Total** | **6 horas y 30 minutos** |

Los tiempos son orientativos. Puedes dedicar más tiempo a una práctica si necesitas experimentar, corregir errores o mejorar el resultado.

---

# 1. La web y la preparación del proyecto

## 1.1 ¿Qué ocurre cuando abres una página?

Una página web puede compararse con un edificio:

- **HTML** es la estructura: paredes, puertas, habitaciones y rótulos.
- **CSS** es la presentación: colores, tamaños, distribución, iluminación y decoración.
- **JavaScript** será el comportamiento: acciones, cambios e interacciones. Se trabajará en el siguiente módulo.
- **El navegador** interpreta esos archivos y dibuja la interfaz.

En este módulo trabajarás con archivos locales. El navegador los leerá directamente desde tu computadora:

```text
index.html ── define el contenido y su estructura ──┐
                                                   ├──> Navegador ──> Página visible
styles.css ── define la apariencia y distribución ─┘
```

Más adelante, esos archivos se publicarán en internet. La base seguirá siendo la misma.

## 1.2 Herramientas necesarias

Prepara las siguientes herramientas:

- Un navegador moderno.
- Un editor de código.
- Git instalado en tu computadora.
- Una cuenta gratuita de GitHub.
- Acceso a ChatGPT o Claude. GitHub Copilot es opcional.

No necesitas instalar React, Next.js ni Tailwind CSS todavía.

## 1.3 Crea la carpeta del proyecto

Crea una carpeta llamada `coa-landing` con esta estructura:

```text
coa-landing/
├── assets/
│   └── images/
├── index.html
├── styles.css
└── README.md
```

Utiliza nombres de archivos en minúsculas, sin espacios ni tildes. Esta convención evita problemas cuando el proyecto se publica en distintos sistemas.

En `index.html`, escribe:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
      name="description"
      content="Curso de desarrollo web moderno de COA."
    >
    <title>Desarrollo Web Moderno | COA</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Desarrollo Web Moderno</h1>
  </body>
</html>
```

Abre el archivo en el navegador. Si puedes ver el título, la primera conexión entre tu código y el navegador funciona.

### ¿Qué hace cada línea importante?

| Código | Función |
|---|---|
| `<!doctype html>` | Indica que el documento utiliza HTML moderno. |
| `<html lang="es">` | Define el idioma principal de la página. |
| `<meta charset="UTF-8">` | Permite representar correctamente tildes, eñes y otros caracteres. |
| `<meta name="viewport"...>` | Permite que la página se adapte correctamente a pantallas móviles. |
| `<title>` | Define el texto de la pestaña del navegador. |
| `<link rel="stylesheet"...>` | Conecta el documento HTML con el archivo CSS. |

### Comprobación rápida

Guarda este código en `styles.css`:

```css
body {
  background-color: #f5f7fb;
}
```

Actualiza el navegador. Si el fondo cambia, HTML y CSS están conectados.

---

# 2. HTML5 semántico y accesible

## 2.1 HTML describe el significado

HTML es un lenguaje de marcado. No se utiliza para decidir si un título será azul o si una tarjeta tendrá sombra. Se utiliza para declarar qué representa cada parte del contenido.

```html
<h1>Desarrollo Web Moderno</h1>
```

En este ejemplo:

- `<h1>` es la etiqueta de apertura.
- `Desarrollo Web Moderno` es el contenido.
- `</h1>` es la etiqueta de cierre.
- El conjunto completo es un elemento.

Algunos elementos incluyen atributos:

```html
<a href="#programa">Ver el programa</a>
```

El atributo `href` indica el destino del enlace.

## 2.2 Anidación correcta

Los elementos pueden contener otros elementos:

```html
<article>
  <h2>Aprendizaje práctico</h2>
  <p>Construirás proyectos desde el primer módulo.</p>
</article>
```

Los elementos deben cerrarse en el orden inverso al que fueron abiertos:

```html
<!-- Correcto -->
<p>Aprende <strong>creando proyectos</strong>.</p>

<!-- Incorrecto -->
<p>Aprende <strong>creando proyectos</p></strong>
```

Utiliza sangría para que la relación entre elementos sea visible. El navegador puede interpretar código sin sangría, pero una persona tendrá más dificultad para revisarlo.

## 2.3 Estructura semántica de una página

Una página profesional no debe convertirse en una colección de `<div>` sin significado. HTML5 incluye elementos que describen las regiones principales:

```text
body
├── header
│   └── nav
├── main
│   ├── section
│   │   └── article
│   ├── section
│   └── section
└── footer
```

| Elemento | Uso principal |
|---|---|
| `<header>` | Encabezado de una página o sección. |
| `<nav>` | Grupo principal de enlaces de navegación. |
| `<main>` | Contenido central y único de la página. |
| `<section>` | Agrupación temática que normalmente necesita un encabezado. |
| `<article>` | Contenido independiente o reutilizable, como una tarjeta de curso. |
| `<footer>` | Información final de la página o de una sección. |
| `<div>` | Contenedor sin significado semántico, útil únicamente cuando no existe un elemento más apropiado. |

Ejemplo:

```html
<body>
  <header class="site-header">
    <a class="logo" href="#">COA</a>

    <nav aria-label="Navegación principal">
      <ul class="nav-list">
        <li><a href="#beneficios">Beneficios</a></li>
        <li><a href="#programa">Programa</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div>
        <p class="eyebrow">Curso práctico de 40 horas</p>
        <h1>Desarrollo Web Moderno con React, Next.js e IA</h1>
        <p>
          Aprende a construir interfaces modernas, comprender el código
          y utilizar inteligencia artificial como herramienta profesional.
        </p>
        <a class="button" href="#programa">Ver programa</a>
      </div>
    </section>

    <section id="beneficios" aria-labelledby="titulo-beneficios">
      <h2 id="titulo-beneficios">Aprenderás mediante proyectos reales</h2>

      <article>
        <h3>Práctica constante</h3>
        <p>Cada concepto se aplica en una interfaz real.</p>
      </article>
    </section>
  </main>

  <footer>
    <p>© COA — Cursos Online Avanzados</p>
  </footer>
</body>
```

## 2.4 Jerarquía de encabezados

Los encabezados organizan el documento:

```text
h1  Título principal de la página
├── h2  Sección: Beneficios
│   ├── h3  Beneficio: Práctica constante
│   └── h3  Beneficio: Revisión profesional
└── h2  Sección: Programa
    ├── h3  Módulo 1
    └── h3  Módulo 2
```

Buenas prácticas:

- Utiliza un `<h1>` que describa el propósito principal de la página.
- Continúa con `<h2>` para las secciones principales.
- Utiliza `<h3>` dentro de esas secciones cuando exista una subdivisión.
- No elijas un nivel por su tamaño visual. El tamaño se cambia con CSS.
- Evita saltar de `<h2>` a `<h4>` sin una razón estructural.

## 2.5 Enlaces y botones no son lo mismo

Utiliza un enlace cuando la acción lleva a otro lugar:

```html
<a href="#contacto">Ir al formulario</a>
```

Utiliza un botón cuando la acción cambia algo en la interfaz:

```html
<button type="button">Abrir menú</button>
```

En este módulo la mayoría de las llamadas a la acción serán enlaces, porque conducen a otra sección. Los comportamientos de los botones se programarán con JavaScript en el siguiente módulo.

No utilices `<div>` o `<span>` para imitar un botón. Los elementos correctos incluyen comportamientos de teclado y significado que benefician a todos los usuarios.

## 2.6 Imágenes accesibles

Toda imagen necesita una decisión consciente sobre su texto alternativo:

```html
<img
  src="assets/images/estudiante-programando.webp"
  alt="Estudiante construyendo una interfaz web en su computadora"
>
```

El atributo `alt` describe la información relevante de la imagen. No debe comenzar con “imagen de”, porque el lector de pantalla ya anuncia que se trata de una imagen.

Si una imagen es puramente decorativa, utiliza un texto alternativo vacío:

```html
<img src="assets/images/decoracion.svg" alt="">
```

No coloques información indispensable únicamente dentro de una imagen.

## 2.7 Formularios comprensibles

Cada campo necesita una etiqueta asociada:

```html
<form id="contacto">
  <div class="form-field">
    <label for="nombre">Nombre completo</label>
    <input id="nombre" name="nombre" type="text" autocomplete="name" required>
  </div>

  <div class="form-field">
    <label for="correo">Correo electrónico</label>
    <input id="correo" name="correo" type="email" autocomplete="email" required>
  </div>

  <div class="form-field">
    <label for="mensaje">¿Qué deseas aprender?</label>
    <textarea id="mensaje" name="mensaje" rows="5"></textarea>
  </div>

  <button type="submit">Enviar solicitud</button>
</form>
```

En este módulo el formulario se evaluará por su estructura y diseño. Todavía no enviará información a un servidor.

## 2.8 Lista esencial de accesibilidad

Antes de considerar terminado el HTML, comprueba:

- El documento declara `lang="es"`.
- Existe un orden lógico de encabezados.
- Los enlaces describen su destino. Evita textos aislados como “haz clic aquí”.
- Las imágenes tienen un `alt` útil o vacío cuando son decorativas.
- Cada campo del formulario tiene un `<label>`.
- Los elementos interactivos pueden recibir foco con la tecla `Tab`.
- No se utiliza el color como único medio para comunicar información.
- La estructura sigue siendo comprensible sin CSS.

### Práctica guiada 1 — Reparar una estructura

El siguiente código funciona visualmente, pero no representa bien el contenido:

```html
<div>
  <div>COA</div>
  <div>
    <span>Inicio</span>
    <span>Programa</span>
  </div>
</div>

<div>
  <div>Desarrollo Web Moderno</div>
  <div>Aprende creando proyectos reales.</div>
  <div>Ver programa</div>
</div>

<div>Todos los derechos reservados.</div>
```

Realiza estas mejoras:

1. Sustituye los contenedores genéricos por `header`, `nav`, `main`, `section` y `footer` cuando corresponda.
2. Convierte el nombre del curso en el encabezado principal.
3. Convierte “Inicio” y “Programa” en enlaces dentro de una lista.
4. Convierte “Ver programa” en un enlace hacia `#programa`.
5. Mantén un `<div>` solamente si lo necesitas para agrupar contenido sin significado propio.

<details>
<summary>Ver una posible solución</summary>

```html
<header>
  <a href="#">COA</a>
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="#">Inicio</a></li>
      <li><a href="#programa">Programa</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h1>Desarrollo Web Moderno</h1>
    <p>Aprende creando proyectos reales.</p>
    <a href="#programa">Ver programa</a>
  </section>
</main>

<footer>
  <p>Todos los derechos reservados.</p>
</footer>
```

</details>

### Práctica guiada 2 — Diseñar primero el contenido

Antes de escribir CSS, crea en tu `index.html`:

1. Un encabezado con la marca COA y tres enlaces.
2. Una sección principal con una frase breve, un `<h1>`, un párrafo y dos llamadas a la acción.
3. Una sección de beneficios con un `<h2>` y tres artículos.
4. Una sección de programa con un `<h2>` y al menos cuatro módulos.
5. Un formulario de contacto con nombre, correo y mensaje.
6. Un pie de página.

Abre la página sin CSS. Si el contenido está ordenado, es legible y se entiende qué representa cada parte, tienes una base correcta.

### Video recomendado

[HTML SEMÁNTICO y etiquetas semánticas — Carpi Coder (22 min)](https://www.youtube.com/watch?v=wx92etmlHtc)

Mientras observas el video, identifica cuáles de tus elementos podrían ser más semánticos.

---

# 3. Fundamentos prácticos de CSS3

## 3.1 La anatomía de una regla

```css
.course-card {
  background-color: #ffffff;
  border-radius: 1rem;
}
```

| Parte | Ejemplo | Función |
|---|---|---|
| Selector | `.course-card` | Elige qué elementos recibirán los estilos. |
| Propiedad | `background-color` | Indica qué característica se modificará. |
| Valor | `#ffffff` | Define el resultado de esa propiedad. |
| Declaración | `border-radius: 1rem;` | Combina una propiedad y su valor. |

Utiliza clases para la mayoría de los estilos:

```html
<article class="course-card">...</article>
```

```css
.course-card {
  padding: 1.5rem;
}
```

Evita depender de identificadores para diseñar:

```css
/* Evita esta práctica como estrategia habitual de estilos */
#tarjeta-principal {
  padding: 1.5rem;
}
```

Los identificadores son útiles para destinos de enlaces, asociaciones accesibles y usos concretos. Las clases son más fáciles de reutilizar.

## 3.2 La cascada sin complicaciones innecesarias

Cuando varias reglas afectan la misma propiedad, el navegador decide cuál aplicar. Para este módulo conserva tres reglas prácticas:

1. Una regla más específica puede imponerse sobre una más general.
2. Entre reglas de especificidad similar, suele ganar la que aparece después.
3. Algunos valores, como el color del texto y la tipografía, se heredan desde el elemento padre.

```css
p {
  color: #475569;
}

.hero-description {
  color: #1e293b;
}
```

Un párrafo con la clase `hero-description` utilizará el segundo color.

No utilices `!important` para resolver conflictos durante este módulo. Primero revisa el selector, el orden y la herencia.

## 3.3 Una base CSS consistente

Añade al inicio de `styles.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-text: #172033;
  --color-muted: #5f6b7a;
  --color-surface: #ffffff;
  --color-background: #f5f7fb;
  --color-border: #dbe2ea;
  --shadow-card: 0 1rem 2.5rem rgba(15, 23, 42, 0.1);
  --radius-small: 0.6rem;
  --radius-medium: 1rem;
  --radius-large: 1.5rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family:
    Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
}

button,
input,
textarea {
  font: inherit;
}
```

Las propiedades personalizadas declaradas en `:root` funcionan como variables de diseño. Permiten reutilizar decisiones visuales:

```css
.button {
  background-color: var(--color-primary);
}
```

Si el color principal cambia, solo necesitas actualizarlo en un lugar.

## 3.4 El modelo de caja

Cada elemento visual se comporta como una caja:

```text
┌──────────────────────────── margen ───────────────────────────┐
│  ┌──────────────────────── borde ──────────────────────────┐  │
│  │  ┌──────────────────── relleno ──────────────────────┐  │  │
│  │  │                                                   │  │  │
│  │  │                    contenido                      │  │  │
│  │  │                                                   │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

- `padding`: espacio interior entre contenido y borde.
- `border`: línea que rodea el relleno y el contenido.
- `margin`: espacio exterior que separa una caja de otras.
- `width` y `height`: dimensiones de la caja.

```css
.course-card {
  max-width: 24rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  margin: 1rem;
}
```

El valor global `box-sizing: border-box` hace que el ancho declarado incluya el relleno y el borde. Esto vuelve el dimensionamiento más predecible.

## 3.5 Unidades que utilizarás

| Unidad | Uso recomendado |
|---|---|
| `px` | Bordes finos y valores pequeños que necesitan precisión. |
| `rem` | Tipografía, espacios, radios y tamaños relacionados con la escala del documento. |
| `%` | Tamaños relativos al contenedor. |
| `fr` | Repartir el espacio disponible dentro de CSS Grid. |
| `vw` | Casos puntuales relacionados con el ancho de la ventana. |

No existe una unidad correcta para todos los casos. En este módulo utiliza principalmente `rem`, `%`, `fr`, `max-width` y algunos `px` para bordes o puntos de interrupción.

## 3.6 Contenedores y espacio vertical

Un patrón útil para controlar el ancho del contenido:

```css
.container {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}

.section {
  padding-block: 4rem;
}
```

`width: min(100% - 2rem, 70rem)` permite que el contenido:

- conserve un espacio lateral en pantallas estrechas;
- crezca con la pantalla;
- deje de crecer al llegar a `70rem`.

## 3.7 Botones visuales y estados de foco

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.7rem 1.1rem;
  border: 1px solid transparent;
  border-radius: var(--radius-small);
  color: #ffffff;
  background-color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 160ms ease,
    transform 160ms ease;
}

.button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
}

.button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 3px;
}

.button--secondary {
  color: var(--color-primary);
  background-color: transparent;
  border-color: var(--color-primary);
}
```

El estado `:hover` ayuda a quien utiliza un puntero. El estado `:focus-visible` ayuda a quien navega con teclado. No elimines el contorno de foco sin proporcionar una alternativa claramente visible.

## 3.8 Errores comunes en CSS

- Olvidar el punto antes del nombre de una clase.
- Escribir el nombre de una clase de forma diferente en HTML y CSS.
- Olvidar el punto y coma o una llave de cierre.
- Intentar aplicar estilos a un archivo CSS que no está correctamente enlazado.
- Utilizar anchos fijos grandes que producen desplazamiento horizontal.
- Repetir los mismos colores y espacios en muchas reglas en lugar de reutilizar variables.
- Usar `!important` para ocultar un problema de cascada.
- Diseñar solamente el estado normal y olvidar `hover`, `focus-visible` o los campos inválidos.

### Práctica guiada 3 — Convertir contenido en una sección visual

Aplica estilos a tu sección principal para conseguir:

1. Fondo claro y texto oscuro.
2. Un ancho máximo de contenido.
3. Espacio vertical suficiente.
4. Una frase breve en mayúsculas o con peso destacado.
5. Un título que se adapte sin utilizar un ancho fijo.
6. Un botón principal y otro secundario.
7. Un foco visible para ambos enlaces.

Puedes utilizar:

```css
.hero {
  padding-block: 5rem;
}

.hero h1 {
  max-width: 18ch;
  margin: 0;
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  line-height: 1.05;
}

.hero-description {
  max-width: 60ch;
  color: var(--color-muted);
}
```

`ch` ayuda a limitar la longitud de una línea según el ancho aproximado de los caracteres. `clamp()` permite indicar un tamaño mínimo, uno flexible y uno máximo.

### Práctica guiada 4 — Investigar con las herramientas del navegador

1. Abre tu página.
2. Haz clic derecho sobre una tarjeta y selecciona **Inspeccionar**.
3. Cambia temporalmente su `padding`.
4. Desactiva una propiedad CSS desde el panel.
5. Identifica el modelo de caja mostrado por el navegador.
6. Regresa al archivo `styles.css` y realiza allí el cambio definitivo.

Los cambios hechos en el inspector desaparecen al actualizar la página. Utilízalo para experimentar y diagnosticar, no como sustituto del archivo CSS.

---

# 4. Distribución con Flexbox y CSS Grid

## 4.1 Flujo normal

Antes de utilizar un sistema de distribución, recuerda que el navegador ya organiza los elementos:

- Los elementos de bloque suelen ocupar una línea completa.
- Los elementos en línea ocupan solo el espacio necesario.
- El contenido aparece en el mismo orden en que fue escrito.

Mantener un orden lógico en HTML es importante. CSS puede modificar la apariencia, pero no debe convertir un orden confuso en una interfaz aparentemente correcta.

## 4.2 Flexbox: distribuir en una dimensión

Flexbox es apropiado cuando necesitas distribuir elementos principalmente en una fila o en una columna:

```css
.site-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
```

```text
Eje principal  ──────────────────────────────────────────────>

┌──────────┐        ┌──────────┐        ┌──────────┐
│ Elemento │        │ Elemento │        │ Elemento │
└──────────┘        └──────────┘        └──────────┘
      ↑
      │ Eje transversal
      ↓
```

Propiedades fundamentales:

| Propiedad | Pregunta que responde |
|---|---|
| `display: flex` | ¿Este contenedor utilizará Flexbox? |
| `flex-direction` | ¿Los elementos irán en fila o columna? |
| `justify-content` | ¿Cómo se reparten sobre el eje principal? |
| `align-items` | ¿Cómo se alinean sobre el eje transversal? |
| `gap` | ¿Qué separación existe entre ellos? |
| `flex-wrap` | ¿Pueden pasar a otra línea si no hay espacio? |

Ejemplo para las llamadas a la acción:

```css
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
```

Ejemplo para la navegación:

```css
.nav-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list a {
  color: var(--color-muted);
  font-weight: 600;
  text-decoration: none;
}

.nav-list a:hover {
  color: var(--color-primary);
}
```

### Video recomendado

[Aprende CSS Flexbox en 10 minutos — The Coder Cave (13 min 38 s)](https://www.youtube.com/watch?v=rOQTEQkM96A)

## 4.3 CSS Grid: distribuir en dos dimensiones

Grid es apropiado cuando necesitas controlar filas y columnas:

```css
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
```

```text
             Columna 1       Columna 2       Columna 3
           ┌───────────┬───────────────┬───────────────┐
Fila 1     │ Tarjeta 1 │ Tarjeta 2     │ Tarjeta 3     │
           ├───────────┼───────────────┼───────────────┤
Fila 2     │ Tarjeta 4 │ Tarjeta 5     │ Tarjeta 6     │
           └───────────┴───────────────┴───────────────┘
```

Una cuadrícula flexible puede decidir cuántas columnas caben:

```css
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1.5rem;
}
```

Lee esta regla de adentro hacia afuera:

- Cada columna intenta medir al menos `16rem`.
- Nunca será más ancha que el contenedor en una pantalla estrecha.
- Cada columna puede crecer hasta ocupar una fracción del espacio disponible.
- `auto-fit` coloca tantas columnas como puedan caber.

Este patrón reduce la cantidad de consultas de medios necesarias, pero siempre debes probar el resultado.

### Video recomendado

[CSS Grid Crash Course para principiantes — Developeando (11 min 9 s)](https://www.youtube.com/watch?v=Bb7bUNu76gM)

## 4.4 ¿Flexbox o Grid?

| Necesidad | Herramienta recomendada |
|---|---|
| Alinear logo, navegación y botón en una fila | Flexbox |
| Distribuir dos botones con separación | Flexbox |
| Alinear icono y texto dentro de una tarjeta | Flexbox |
| Crear un catálogo de tarjetas en filas y columnas | Grid |
| Crear una sección con contenido e imagen | Grid |
| Diseñar la estructura general de varias filas y columnas | Grid |

No son herramientas rivales. Una cuadrícula puede contener tarjetas que internamente utilizan Flexbox.

### Práctica guiada 5 — Encabezado adaptable

Construye un encabezado que contenga:

- La marca COA.
- Una lista de tres enlaces.
- Un enlace visual con el texto “Ingresar”.

Requisitos:

1. Utiliza Flexbox.
2. Permite que los elementos pasen a otra línea si el espacio es insuficiente.
3. Conserva una separación clara mediante `gap`.
4. No cambies el orden visual con la propiedad `order`.
5. Comprueba la navegación con la tecla `Tab`.

### Práctica guiada 6 — Cuadrícula de beneficios

Crea tres artículos con:

- Un número o icono decorativo.
- Un `<h3>`.
- Un párrafo de una o dos líneas.

Requisitos:

1. Utiliza Grid en el contenedor.
2. Utiliza una sola columna en pantallas estrechas.
3. Permite que la cuadrícula cree más columnas cuando haya espacio.
4. Mantén el mismo espaciado interno en todas las tarjetas.
5. Añade un borde o una sombra sutil, sin reducir la legibilidad.

Una base posible:

```css
.benefit-card {
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  background-color: var(--color-surface);
}

.benefit-card h3 {
  margin-top: 0;
}
```

---

# 5. Diseño adaptable con enfoque mobile first

## 5.1 Una web, muchos tamaños

Diseño adaptable no significa crear una página para teléfono y otra para computadora. Significa crear una interfaz flexible que responda al espacio disponible.

El enfoque *mobile first* comienza con la versión más estrecha y añade mejoras cuando el contenido tiene espacio suficiente:

```css
.hero-layout {
  display: grid;
  gap: 2rem;
}

@media (min-width: 48rem) {
  .hero-layout {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
  }
}
```

Antes de `48rem`, la sección utiliza una columna. Después, utiliza dos. El punto de interrupción debe responder a una necesidad del contenido, no al nombre de un dispositivo específico.

## 5.2 Reglas prácticas

- Incluye siempre la etiqueta `meta viewport`.
- Evita anchos fijos grandes.
- Utiliza `max-width: 100%` para imágenes.
- Permite que botones y grupos de elementos se envuelvan.
- Diseña primero una columna clara.
- Añade columnas cuando exista espacio real.
- No ocultes contenido importante para resolver un problema de distribución.
- Comprueba que no aparezca desplazamiento horizontal.

## 5.3 Prueba en varios anchos

Utiliza el modo de dispositivos del navegador y prueba, como mínimo:

- **320 px:** pantalla estrecha.
- **768 px:** pantalla mediana.
- **1024 px o más:** pantalla amplia.

En cada tamaño comprueba:

- ¿Se puede leer el texto sin ampliar?
- ¿Los botones tienen suficiente espacio?
- ¿Las tarjetas conservan una anchura útil?
- ¿La navegación sigue siendo comprensible?
- ¿Las imágenes mantienen su proporción?
- ¿Existe algún elemento cortado?
- ¿Aparece una barra horizontal inesperada?

### Práctica guiada 7 — Detectar el punto de ruptura

1. Abre tu página con una anchura grande.
2. Reduce lentamente la ventana.
3. Detente cuando la sección principal se vea comprimida.
4. Anota ese ancho aproximado.
5. Crea una consulta de medios para añadir la segunda columna solamente a partir de ese punto.
6. Repite la prueba después del cambio.

No copies automáticamente un punto de interrupción sugerido por otra persona o por una IA. Primero observa cuándo tu contenido necesita cambiar.

### Video recomendado

[Fundamentos de Responsive Design: Mobile First y Media Queries — Appdelante (8 min 32 s)](https://www.youtube.com/watch?v=X5qFxPsVL4c)

---

# 6. Control de versiones con Git y GitHub

## 6.1 Git y GitHub cumplen funciones diferentes

- **Git** registra cambios en el proyecto desde tu computadora.
- **GitHub** aloja repositorios y permite compartirlos por internet.
- **Un repositorio** es un proyecto cuyo historial administra Git.
- **Un commit** es un registro intencional de un conjunto de cambios.

```text
Archivos modificados
        │
        ▼
Área de preparación: git add
        │
        ▼
Historial local: git commit
        │
        ▼
Repositorio remoto: git push
```

## 6.2 Configuración inicial

La primera vez que utilices Git en tu computadora, configura tu nombre y correo:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

Utiliza el correo asociado con tu cuenta de GitHub si deseas que los commits se vinculen a tu perfil.

## 6.3 Inicia el repositorio

Abre una terminal dentro de la carpeta `coa-landing`:

```bash
git init
git status
git add .
git commit -m "Crea la estructura inicial de la landing"
```

Comprueba el estado con frecuencia:

```bash
git status
```

No esperes hasta el final para crear un único commit. Registra avances que representen una unidad de trabajo:

```text
Crea la estructura semántica de la página
Diseña la sección principal y sus botones
Agrega la cuadrícula de beneficios
Adapta la navegación a pantallas estrechas
Mejora el foco visible del formulario
```

Mensajes como `cambios`, `prueba` o `final final 2` no explican el historial.

## 6.4 Publica el repositorio

Crea un repositorio vacío en GitHub. No añadas desde GitHub un README, una licencia o un archivo `.gitignore` si esos archivos ya existen localmente.

Después conecta ambos repositorios:

```bash
git branch -M main
git remote add origin URL-DE-TU-REPOSITORIO
git push -u origin main
```

Sustituye `URL-DE-TU-REPOSITORIO` por la dirección que proporciona GitHub.

Para los siguientes cambios:

```bash
git add .
git commit -m "Describe el cambio realizado"
git push
```

## 6.5 El archivo README

Escribe en `README.md`:

```md
# Landing page de un curso COA

Página desarrollada como proyecto del Módulo 1 del curso
Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial.

## Tecnologías

- HTML5
- CSS3

## Características

- Estructura semántica
- Diseño adaptable
- Uso de Flexbox y CSS Grid
- Controles con foco visible

## Cómo abrir el proyecto

Abre el archivo `index.html` en un navegador.
```

No publiques contraseñas, claves privadas, tokens ni información personal sensible. Un repositorio público puede ser visto y copiado por cualquier persona.

### Práctica guiada 8 — Crear un historial comprensible

Realiza tres mejoras pequeñas en la página y crea un commit después de cada una:

1. Mejora la estructura HTML.
2. Mejora la presentación de una sección.
3. Corrige un problema adaptable o de accesibilidad.

Al terminar, ejecuta:

```bash
git log --oneline
```

Lee el historial. Los mensajes deben permitir comprender la evolución del proyecto sin abrir los archivos.

### Video recomendado

[Aprende Git y GitHub práctico en 20 minutos — DevOpsea (22 min 40 s)](https://www.youtube.com/watch?v=mbqXrtDbPIA)

---

# 7. Revisión profesional asistida por inteligencia artificial

## 7.1 La IA no reemplaza la comprobación

ChatGPT, Claude o GitHub Copilot pueden:

- explicar una regla de CSS;
- detectar posibles errores;
- proponer una estructura inicial;
- sugerir nombres de clases;
- revisar accesibilidad;
- comparar dos alternativas;
- ayudar a localizar la causa de un comportamiento inesperado.

También pueden:

- inventar propiedades;
- proponer código innecesario;
- cambiar requisitos sin avisar;
- generar una solución que parece correcta pero falla en algunos tamaños;
- utilizar etiquetas sin considerar su significado;
- afirmar que algo es accesible sin haberlo probado.

Por eso utilizarás este ciclo:

```text
Comprender el objetivo
        ↓
Pedir una ayuda concreta
        ↓
Leer y explicar la respuesta
        ↓
Probar en el navegador
        ↓
Aceptar, modificar o rechazar
        ↓
Registrar un cambio con Git
```

## 7.2 Cómo redactar una solicitud útil

Una buena solicitud incluye:

1. **Contexto:** qué estás construyendo.
2. **Objetivo:** qué resultado necesitas.
3. **Código relevante:** solo la parte necesaria.
4. **Restricciones:** qué tecnologías o decisiones deben conservarse.
5. **Formato esperado:** explicación, diagnóstico, lista o fragmento de código.

Ejemplo:

```text
Estoy construyendo una landing page únicamente con HTML5 y CSS3.
La cuadrícula de tarjetas produce desplazamiento horizontal a 320 px.

Analiza el HTML y el CSS que incluyo abajo.
No reescribas toda la página y no uses JavaScript ni frameworks.

1. Identifica la causa más probable.
2. Explica por qué ocurre.
3. Propón el cambio mínimo.
4. Indica cómo puedo comprobar la corrección en el navegador.

[Pega únicamente el código relevante]
```

## 7.3 Práctica guiada 9 — Auditoría, no generación ciega

Entrega a ChatGPT o Claude una sección de tu HTML con esta solicitud:

```text
Actúa como revisor de HTML semántico y accesibilidad.
No reescribas el código todavía.

Analiza la sección que incluyo y crea una tabla con:
- problema detectado;
- por qué puede afectar a una persona usuaria;
- cambio mínimo recomendado;
- nivel de prioridad: alto, medio o bajo.

Revisa especialmente encabezados, enlaces, botones, imágenes,
etiquetas de formulario y orden del contenido.

[Pega aquí una sola sección de tu HTML]
```

Después:

1. Lee cada recomendación.
2. Decide si es aplicable.
3. Rechaza cualquier cambio que no puedas explicar.
4. Implementa solamente los cambios comprobados.
5. Prueba la sección con teclado y en el navegador.
6. Registra en tu bitácora qué aceptaste y qué rechazaste.

Utiliza esta tabla:

| Herramienta | Solicitud realizada | Recomendación recibida | Decisión | Comprobación |
|---|---|---|---|---|
| ChatGPT o Claude | Revisión semántica de la sección… | Cambiar… | Aceptada/rechazada porque… | Probé… |

> Nunca pegues en una herramienta pública contraseñas, tokens, datos privados de usuarios ni código confidencial que no estés autorizado a compartir.

---

# 8. Mini proyecto — Tarjeta profesional de un curso

## Objetivo

Construir un componente visual completo que presente un curso de COA y funcione correctamente en pantallas estrechas y amplias.

## Resultado esperado

```text
┌──────────────────────────────────────┐
│ [Categoría]                          │
│                                      │
│ Desarrollo Web Moderno               │
│ Aprende React, Next.js e IA          │
│ mediante proyectos reales.           │
│                                      │
│ 40 horas    6 módulos    Proyectos   │
│                                      │
│ [Ver detalles]                       │
└──────────────────────────────────────┘
```

## Requisitos obligatorios

La tarjeta debe incluir:

- Un `<article>` como contenedor semántico.
- Una categoría.
- Un encabezado.
- Una descripción breve.
- Una lista con duración, cantidad de módulos y modalidad.
- Un enlace de llamada a la acción.
- Al menos un estado `:hover`.
- Un foco visible mediante `:focus-visible`.
- Espaciado consistente.
- Un ancho flexible sin desbordamiento a 320 px.

## Proceso recomendado

### Paso 1. Escribe el contenido

Redacta primero la información real. Evita textos de relleno como “Lorem ipsum”.

### Paso 2. Crea el HTML

Comprueba que la tarjeta se entienda sin CSS.

### Paso 3. Aplica el modelo de caja

Define fondo, borde, relleno, separación y radio.

### Paso 4. Organiza la información

Utiliza Flexbox para los datos breves si se distribuyen en una fila. Permite que pasen a otra línea.

### Paso 5. Diseña la interacción

El enlace debe mostrar cambios visibles al pasar el puntero y al recibir foco con teclado.

### Paso 6. Prueba

Comprueba la tarjeta a 320 px, 768 px y 1024 px.

### Paso 7. Revisa con IA

Solicita una revisión de accesibilidad y claridad. No pidas que genere nuevamente toda la tarjeta.

## Restricciones

- No utilices JavaScript.
- No utilices Bootstrap, Tailwind CSS ni otro framework.
- No copies una tarjeta completa sin comprender cada elemento y propiedad.
- No cambies el orden del contenido únicamente con CSS.

## Entregable

Conserva la tarjeta dentro del proyecto. Se reutilizará en la landing page del proyecto de módulo.

## Lista de comprobación

- [ ] Puedo explicar por qué utilicé `<article>`.
- [ ] El encabezado conserva el nivel correcto dentro de la página.
- [ ] La tarjeta se entiende sin CSS.
- [ ] No existe desplazamiento horizontal.
- [ ] El enlace se distingue del texto normal.
- [ ] El foco del teclado es visible.
- [ ] Puedo explicar cada propiedad CSS utilizada.
- [ ] Probé el resultado en tres anchos.

[Entregar el mini proyecto del Módulo 1](https://forms.gle/BayPBDiXAGurWjnL6)

---


<!-- coa-activity:desarrollo-web-m1-mini-proyecto -->

# 9. Proyecto del módulo — Landing page profesional de un curso COA

## Desafío

Construye una landing page profesional para presentar un curso de COA. La página debe comunicar con claridad qué ofrece el curso, a quién está dirigido, qué aprenderá el estudiante y cómo puede solicitar más información.

El proyecto integrará las prácticas realizadas durante el módulo. No necesitas comenzar desde una carpeta vacía: mejora, organiza y completa la página que ya construiste.

## Requisitos funcionales y de contenido

### 1. Encabezado

Debe incluir:

- Marca o logotipo textual de COA.
- Navegación con al menos tres enlaces internos.
- Una llamada a la acción.

### 2. Sección principal

Debe incluir:

- Una frase de contexto.
- Un único `<h1>` que describa el curso.
- Una propuesta de valor clara.
- Dos llamadas a la acción.
- Una imagen relevante con texto alternativo o un recurso decorativo correctamente marcado.

### 3. Beneficios

Debe incluir:

- Un `<h2>`.
- Al menos tres beneficios.
- Una estructura de tarjetas creada con Grid.

### 4. Programa

Debe incluir:

- Un `<h2>`.
- Al menos cuatro módulos o etapas.
- La tarjeta creada en el mini proyecto o una adaptación de ella.

### 5. Resultados de aprendizaje

Debe explicar qué podrá construir o realizar el estudiante al finalizar.

### 6. Llamada a la acción

Debe presentar una razón clara para continuar y un enlace hacia el formulario.

### 7. Formulario

Debe incluir:

- Nombre completo.
- Correo electrónico.
- Mensaje o interés principal.
- Etiquetas asociadas correctamente.
- Campos obligatorios cuando corresponda.
- Botón de envío.

El formulario no necesita enviar datos todavía.

### 8. Pie de página

Debe incluir:

- Nombre de COA.
- Una frase breve o información de derechos.
- Al menos un enlace útil.

## Requisitos técnicos

- HTML5 semántico.
- Hoja CSS externa.
- Uso correcto de encabezados.
- Clases con nombres comprensibles.
- Variables CSS para las decisiones visuales principales.
- Uso de Flexbox en al menos dos grupos de elementos.
- Uso de Grid en al menos una sección.
- Enfoque *mobile first*.
- Al menos una consulta de medios basada en las necesidades del contenido.
- Página usable desde 320 px.
- Sin desplazamiento horizontal inesperado.
- Imágenes flexibles.
- Estados `hover` y `focus-visible`.
- Formulario con etiquetas visibles.
- Repositorio de Git con al menos cinco commits descriptivos.
- Repositorio publicado en GitHub.
- Archivo `README.md`.
- Bitácora de al menos dos usos de IA.

## Uso obligatorio de inteligencia artificial

Utiliza ChatGPT, Claude o GitHub Copilot en al menos dos tareas diferentes. Algunas opciones:

- revisar la semántica de una sección;
- encontrar la causa de un desbordamiento;
- comparar dos alternativas de Grid;
- revisar el contraste de una paleta;
- mejorar los nombres de clases;
- explicar una regla que no comprendes.

Por cada uso registra:

1. La herramienta.
2. La solicitud.
3. La recomendación principal.
4. Lo que aceptaste, modificaste o rechazaste.
5. La prueba realizada.
6. Lo aprendido.

No se aprobará como evidencia una respuesta copiada sin análisis.

## Proceso de construcción

### Fase 1. Define el contenido

Responde antes de diseñar:

- ¿Cuál es el curso?
- ¿Para quién es?
- ¿Qué problema ayuda a resolver?
- ¿Qué resultado promete de forma realista?
- ¿Cuál es la acción principal de la página?

### Fase 2. Crea un esquema

Dibuja la página en papel o con cajas simples. Decide el orden de las secciones sin pensar todavía en colores.

### Fase 3. Construye el HTML

Escribe toda la estructura y compruébala sin CSS.

### Fase 4. Define el sistema visual

Elige:

- un color principal;
- un color de fondo;
- colores de texto legibles;
- una escala pequeña de espacios;
- radios consistentes;
- una sombra sutil;
- una tipografía del sistema o una fuente web correctamente configurada.

### Fase 5. Diseña desde la pantalla estrecha

Comienza con una sola columna. Añade distribuciones más amplias únicamente cuando exista espacio.

### Fase 6. Integra Flexbox y Grid

Utiliza cada herramienta por la necesidad que resuelve, no solo para cumplir el requisito.

### Fase 7. Prueba

Realiza pruebas:

- a 320 px, 768 px y 1024 px;
- con teclado;
- con CSS temporalmente desactivado;
- con una imagen que tarde en cargar o no esté disponible;
- con textos un poco más largos.

### Fase 8. Revisa con IA

Solicita revisiones pequeñas y específicas. Comprueba cada recomendación.

### Fase 9. Limpia el código

Elimina reglas no utilizadas, corrige nombres confusos y revisa la sangría.

### Fase 10. Publica

Actualiza el README, revisa el historial de Git y envía los cambios a GitHub.

## Entrega

Envía en el punto de entrega del módulo:

1. Enlace público al repositorio de GitHub.
2. Captura de la página en pantalla estrecha.
3. Captura de la página en pantalla amplia.
4. Bitácora de uso de IA.
5. Breve reflexión de entre 100 y 180 palabras:
   - qué decisión de HTML o CSS fue la más importante;
   - qué problema encontraste;
   - cómo lo comprobaste;
   - qué puedes explicar ahora que antes no comprendías.

Antes de enviar, abre el enlace del repositorio en una ventana privada para comprobar que el instructor podrá acceder.

[Entregar el proyecto del Módulo 1](https://forms.gle/BayPBDiXAGurWjnL6)

## Condición de avance

El proyecto debe ser aprobado por el instructor. Si recibe observaciones, corrige el repositorio, crea commits que describan las correcciones y vuelve a entregar.

El Módulo 2 permanecerá bloqueado hasta que:

- el proyecto alcance el puntaje mínimo;
- se cumplan los requisitos críticos;
- la evaluación del módulo esté aprobada.

---

# 10. Rúbrica de evaluación del proyecto

**Puntaje total:** 100 puntos  
**Puntaje mínimo de aprobación:** 75 puntos

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| **Cumplimiento y contenido** | Incluye todas las secciones, el contenido es claro y las acciones tienen propósito. | Falta un detalle menor o existe contenido poco preciso. | Faltan varios elementos o el mensaje resulta confuso. | No cumple la estructura mínima. | 20 |
| **HTML semántico** | Utiliza correctamente regiones, encabezados, listas, enlaces, botones y formulario. | Presenta uno o dos usos semánticos mejorables. | Depende demasiado de contenedores genéricos o tiene una jerarquía irregular. | La estructura carece de significado o contiene errores graves. | 15 |
| **CSS y calidad del código** | Estilos organizados, reutilizables, legibles y sin reglas innecesarias. | Código funcional con repetición o pequeñas inconsistencias. | Organización débil, nombres confusos o conflictos frecuentes. | CSS difícil de mantener o incompleto. | 15 |
| **Distribución y diseño adaptable** | Flexbox y Grid están bien elegidos; la página funciona desde 320 px y no se desborda. | Funciona en los tamaños principales con detalles menores. | Presenta problemas visibles en uno o más tamaños. | No es adaptable o impide utilizar la página. | 15 |
| **Accesibilidad básica** | Orden lógico, foco visible, etiquetas, textos alternativos y controles correctos. | Presenta uno o dos problemas menores. | Varias barreras requieren corrección. | Faltan requisitos esenciales de accesibilidad. | 15 |
| **Diseño y experiencia visual** | Jerarquía, contraste, espaciado y consistencia comunican profesionalismo. | El diseño es claro con pequeñas inconsistencias. | La página es comprensible pero visualmente irregular. | El diseño dificulta leer o completar acciones. | 10 |
| **Git, GitHub y documentación** | Repositorio accesible, README claro y cinco o más commits descriptivos. | Repositorio correcto con historial o README mejorable. | Historial poco útil o documentación incompleta. | No existe repositorio accesible o no hay historial válido. | 5 |
| **Uso responsable de IA** | Dos o más usos documentados con decisiones y pruebas propias. | Cumple los usos, pero el análisis es breve. | Evidencia incompleta o poco razonada. | Copia respuestas sin revisión o no entrega bitácora. | 5 |
|  |  |  |  | **Total** | **100** |

## Requisitos críticos

Aunque el puntaje alcance 75, el proyecto deberá corregirse si ocurre alguno de estos casos:

- El repositorio no puede abrirse.
- La página no contiene un `<h1>`.
- El formulario no tiene etiquetas asociadas.
- La interfaz no puede utilizarse a 320 px.
- Existe desplazamiento horizontal que impide acceder al contenido.
- El foco del teclado no es visible.
- El proyecto utiliza un framework no permitido.
- No existe evidencia de uso razonado de IA.
- El estudiante no puede explicar una parte sustancial del código entregado.

---


<!-- coa-activity:desarrollo-web-m1-proyecto -->

# 11. Evaluación del módulo

**Cantidad de preguntas:** 10  
**Puntaje mínimo:** 70%  
**Intentos:** puedes revisar el contenido antes de volver a intentarlo.

## Pregunta 1

¿Cuál es la función principal de HTML?

A. Administrar versiones del proyecto.  
B. Describir la estructura y el significado del contenido.  
C. Crear todas las interacciones de la página.  
D. Publicar automáticamente un sitio.

## Pregunta 2

¿Cuál es la mejor opción para el grupo principal de enlaces de una página?

A. `<div>`  
B. `<span>`  
C. `<nav>`  
D. `<article>`

## Pregunta 3

¿Cuándo debe utilizarse un enlace en lugar de un botón?

A. Cuando la acción lleva a otra página o sección.  
B. Cuando se desea aplicar un color de fondo.  
C. Cuando el texto debe aparecer en negrita.  
D. Cuando el elemento está dentro de un formulario.

## Pregunta 4

¿Qué representa `padding` en el modelo de caja?

A. El espacio exterior entre una caja y otras.  
B. El espacio interior entre el contenido y el borde.  
C. El ancho total de la pantalla.  
D. La sombra de un elemento.

## Pregunta 5

¿Qué herramienta es más apropiada para alinear tres botones principalmente en una fila?

A. Flexbox.  
B. Git.  
C. HTML semántico.  
D. Una imagen.

## Pregunta 6

¿Qué herramienta es más apropiada para organizar un catálogo en filas y columnas?

A. Un encabezado.  
B. CSS Grid.  
C. Un atributo `alt`.  
D. GitHub.

## Pregunta 7

¿Qué caracteriza a un enfoque *mobile first*?

A. Diseñar únicamente para teléfonos.  
B. Crear una página independiente para cada dispositivo.  
C. Comenzar con el espacio estrecho y añadir mejoras cuando exista más espacio.  
D. Ocultar todo el contenido en pantallas pequeñas.

## Pregunta 8

¿Qué comando crea un registro de los cambios preparados?

A. `git status`  
B. `git add .`  
C. `git commit -m "mensaje"`  
D. `git init`

## Pregunta 9

¿Cuál es el uso profesional más adecuado de una IA durante este módulo?

A. Copiar una landing completa y entregarla sin leerla.  
B. Aceptar cualquier sugerencia porque la IA ya la verificó.  
C. Solicitar una revisión específica, comprenderla y probar cada cambio.  
D. Sustituir HTML por una descripción escrita.

## Pregunta 10

Una cuadrícula se desborda a 320 px. ¿Cuál es el primer paso más útil?

A. Ocultar la cuadrícula completa.  
B. Observar el elemento con las herramientas del navegador e identificar qué regla impone el ancho.  
C. Añadir `!important` a todas las reglas.  
D. Convertir toda la página en una imagen.

---

# 12. Retos adicionales

Estos retos son opcionales. Realízalos después de cumplir todos los requisitos del proyecto.

## Reto 1 — Tema alternativo

Crea una segunda combinación de colores modificando únicamente las variables de `:root`. Comprueba nuevamente el contraste y no dupliques toda la hoja CSS.

## Reto 2 — Cuadrícula sin consulta de medios

Intenta que una sección de tarjetas se adapte mediante:

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
```

Explica cuándo este patrón funciona y cuándo todavía necesitarías una consulta de medios.

## Reto 3 — Prueba con contenido extremo

Duplica temporalmente la longitud de los títulos y descripciones. Corrige cualquier desbordamiento sin recortar información importante.

## Reto 4 — Navegación de salto

Investiga cómo añadir un enlace al inicio de la página que permita saltar directamente al contenido principal. Debe aparecer al recibir foco y funcionar con teclado.

---

# 13. Videos recomendados del módulo

| Tema | Video | Canal | Duración |
|---|---|---|---:|
| HTML semántico | [HTML SEMÁNTICO y etiquetas semánticas](https://www.youtube.com/watch?v=wx92etmlHtc) | Carpi Coder | 22 min |
| Flexbox | [Aprende CSS Flexbox en 10 minutos](https://www.youtube.com/watch?v=rOQTEQkM96A) | The Coder Cave | 13 min 38 s |
| CSS Grid | [CSS Grid Crash Course para principiantes](https://www.youtube.com/watch?v=Bb7bUNu76gM) | Developeando | 11 min 9 s |
| Diseño adaptable | [Fundamentos de Responsive Design: Mobile First y Media Queries](https://www.youtube.com/watch?v=X5qFxPsVL4c) | Appdelante | 8 min 32 s |
| Git y GitHub | [Aprende Git y GitHub práctico en 20 minutos](https://www.youtube.com/watch?v=mbqXrtDbPIA) | DevOpsea | 22 min 40 s |

No mires los videos de forma pasiva. Pausa, reproduce los ejemplos y compara cada explicación con tu proyecto.

---

# 14. Documentación y recursos de lectura

## Nivel esencial

- [Primeros pasos con HTML — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax)
- [Estructura web y documentación — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Structuring_documents)
- [Empezar con CSS — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Getting_started)
- [HTML como base de la accesibilidad — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Accessibility/HTML)

## Nivel de práctica

- [Modelo de caja de CSS — MDN](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Box_model)
- [Flexbox — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Flexbox)
- [Cuadrículas — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Grids)
- [Diseño receptivo — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)

## Git y GitHub

- [Configuración de Git — Documentación de GitHub](https://docs.github.com/es/get-started/getting-started-with-git/set-up-git)
- [Acerca de Git — Documentación de GitHub](https://docs.github.com/es/get-started/using-git/about-git)
- [Libro Pro Git en español](https://git-scm.com/book/es/v2.html)

## Inteligencia artificial

- [Prácticas recomendadas para redactar instrucciones en ChatGPT — OpenAI](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

La documentación es una herramienta de consulta. No necesitas leerla completa antes de continuar. Utilízala para confirmar comportamientos, buscar propiedades y ampliar los temas que necesites reforzar.

---

# 15. Glosario

**Accesibilidad:** práctica de crear productos que puedan utilizar personas con distintas capacidades, tecnologías y formas de interacción.

**Atributo:** información adicional incluida en la etiqueta de apertura de un elemento HTML.

**Cascada:** conjunto de reglas que utiliza el navegador para decidir qué estilos se aplican cuando existen conflictos.

**Clase:** atributo HTML reutilizable que permite seleccionar elementos, especialmente desde CSS.

**Commit:** registro de un conjunto intencional de cambios en el historial de Git.

**CSS:** lenguaje que define la presentación y distribución de un documento.

**Diseño adaptable:** enfoque que permite que una interfaz responda a diferentes anchos, resoluciones y condiciones de uso.

**Elemento HTML:** conjunto formado normalmente por una etiqueta de apertura, contenido y una etiqueta de cierre.

**Flexbox:** sistema de distribución principalmente unidimensional.

**Git:** sistema de control de versiones distribuido.

**GitHub:** plataforma que aloja repositorios Git y facilita su colaboración y publicación.

**Grid:** sistema CSS de distribución en filas y columnas.

**HTML:** lenguaje de marcado que estructura y describe el significado del contenido web.

**Media query:** regla CSS que aplica estilos cuando se cumple una condición del medio, como un ancho mínimo.

**Mobile first:** estrategia que comienza con el diseño para espacios estrechos y añade mejoras progresivas cuando existe más espacio.

**Modelo de caja:** representación de un elemento mediante contenido, relleno, borde y margen.

**Repositorio:** carpeta de proyecto cuyo historial es administrado por Git.

**Semántica:** significado que una etiqueta aporta a la estructura del contenido.

**Selector:** patrón utilizado por CSS para elegir los elementos que recibirán estilos.

**Viewport:** área visible de una página dentro del navegador.

---

# 16. Resumen del módulo

En este módulo construiste la base visual y estructural del desarrollo web moderno.

Aprendiste que:

- HTML no existe para decorar, sino para describir correctamente el contenido.
- Una buena semántica mejora la comprensión, el mantenimiento y la accesibilidad.
- CSS controla presentación, espaciado, tipografía, estados y distribución.
- El modelo de caja explica gran parte de los problemas de tamaño y separación.
- Flexbox resuelve distribuciones principalmente lineales.
- Grid permite organizar filas y columnas.
- El diseño adaptable comienza con contenido flexible, no con una colección infinita de tamaños de dispositivo.
- Git conserva un historial útil cuando los commits representan cambios claros.
- GitHub permite compartir el proyecto.
- La IA aporta valor cuando recibe una tarea concreta y sus respuestas son comprendidas, probadas y evaluadas.

## Habilidades obtenidas

Al aprobar el módulo podrás:

- convertir un esquema visual en HTML semántico;
- diseñar una interfaz coherente con CSS;
- construir tarjetas y secciones adaptables;
- detectar problemas básicos con las herramientas del navegador;
- publicar el código en un repositorio;
- solicitar y evaluar ayuda de una IA;
- entregar una landing page profesional como base para futuras aplicaciones.

## Antes de continuar

Confirma que completaste:

- [ ] Las nueve prácticas guiadas.
- [ ] El mini proyecto.
- [ ] La landing page profesional.
- [ ] La bitácora de uso de IA.
- [ ] El repositorio y el README.
- [ ] La evaluación del módulo.
- [ ] Las correcciones solicitadas por el instructor.
- [ ] La aprobación del proyecto.

Cuando el proyecto esté aprobado, estarás preparado para añadir comportamiento real a la interfaz en el Módulo 2: JavaScript moderno en el navegador.
