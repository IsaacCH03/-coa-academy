# Módulo 2. Interfaces profesionales con templates y Bootstrap

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 5 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Tecnologías:** Django 5.2 LTS, Django Template Language y Bootstrap 5.3.8  
**Mini proyecto:** Catálogo Visual Responsive  
**Proyecto del módulo:** Sitio Empresarial Reutilizable

---

# Introducción

En el Módulo 1 aprendiste a crear un proyecto Django y comprendiste el recorrido de una solicitud:

```text
URL → vista → contexto → template → respuesta
```

También construiste páginas HTML iniciales. Esas páginas funcionaban, pero todavía no estaban preparadas para formar parte de una aplicación empresarial completa.

Una aplicación real puede contener decenas o cientos de páginas. Si cada página repitiera el encabezado, la navegación, el pie de página y las importaciones de estilos, cualquier cambio produciría trabajo innecesario.

Imagina que una empresa cambia su número telefónico y este aparece en 40 archivos:

```text
Página 1  ─┐
Página 2   │
Página 3   │
...        ├── mismo pie de página repetido
Página 40 ─┘
```

Modificar 40 archivos no es una solución mantenible. El sistema de templates de Django permite definir una estructura común:

```text
base.html
├── navegación
├── contenido variable
└── pie de página

inicio.html ───────┐
servicios.html ────┼── heredan de base.html
contacto.html ─────┘
```

En este módulo transformarás las páginas iniciales en una interfaz:

- organizada;
- reutilizable;
- responsive;
- accesible;
- coherente;
- fácil de mantener.

No estudiarás diseño gráfico avanzado ni desarrollo frontend completo. Aprenderás exactamente el HTML, CSS, Django Templates y Bootstrap necesarios para construir interfaces profesionales dentro de una aplicación Django.

Todavía no se utilizarán modelos, formularios de Django ni base de datos. La información continuará almacenada temporalmente en estructuras de Python.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- comprender la función del sistema de templates;
- diferenciar HTML estático de contenido dinámico;
- utilizar HTML semántico;
- mostrar variables enviadas desde una vista;
- acceder a diccionarios, listas y atributos;
- utilizar filtros de Django;
- utilizar condicionales y ciclos dentro de templates;
- manejar colecciones vacías;
- crear una plantilla base;
- utilizar herencia mediante `extends` y `block`;
- crear componentes reutilizables mediante `include`;
- generar enlaces mediante nombres de rutas;
- organizar templates globales y templates por aplicación;
- configurar y utilizar archivos estáticos;
- integrar CSS propio;
- integrar Bootstrap 5.3.8;
- utilizar contenedores, filas, columnas y breakpoints;
- construir barras de navegación responsive;
- utilizar tarjetas, tablas, botones, badges y alertas;
- crear estados vacíos comprensibles;
- aplicar principios básicos de accesibilidad;
- comprobar una interfaz en teléfonos, tabletas y computadoras;
- utilizar IA para crear y revisar interfaces sin perder el control del código.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Templates, herencia y componentes | 1 hora y 10 minutos |
| Bootstrap, responsive y accesibilidad | 50 minutos |
| Laboratorio guiado | 50 minutos |
| Ejercicios obligatorios | 40 minutos |
| Mini proyecto | 35 minutos |
| Proyecto del módulo | 45 minutos |
| Evaluación y revisión | 10 minutos |
| **Total estimado** | **5 horas** |

La duración es una referencia. No continúes si todavía necesitas copiar una estructura sin comprender cómo se relacionan la vista, el contexto y el template.

---

# 1. La responsabilidad de un template

Un template se encarga de presentar información.

Debe contener principalmente:

- estructura HTML;
- elementos visuales;
- variables recibidas;
- condiciones sencillas de presentación;
- ciclos para mostrar colecciones;
- enlaces;
- componentes reutilizables.

No debe contener:

- reglas empresariales complejas;
- cálculos extensos;
- credenciales;
- acceso directo a archivos;
- lógica que debería encontrarse en Python.

## Separación de responsabilidades

```text
Vista
├── recibe la solicitud
├── prepara los datos
├── toma decisiones de aplicación
└── envía un contexto

Template
├── recibe el contexto
├── organiza el contenido
├── decide cómo mostrarlo
└── produce HTML
```

## Ejemplo incorrecto

No conviene construir toda la página dentro de la vista:

```python
def inicio(request):
    html = """
    <html>
        <body>
            <h1>Portal empresarial</h1>
        </body>
    </html>
    """
    return HttpResponse(html)
```

## Ejemplo correcto

Vista:

```python
from django.shortcuts import render


def inicio(request):
    contexto = {
        "titulo": "Portal empresarial",
    }
    return render(request, "portal/inicio.html", contexto)
```

Template:

```html
<h1>{{ titulo }}</h1>
```

---

# 2. Django Template Language

Django utiliza de manera predeterminada su propio lenguaje de templates, llamado **Django Template Language** o **DTL**.

DTL no es Python incrustado en HTML. Su objetivo es ofrecer únicamente las herramientas necesarias para presentar información.

Los cuatro elementos principales son:

| Elemento | Sintaxis | Función |
|---|---|---|
| Variable | `{{ variable }}` | Mostrar un valor |
| Etiqueta | `{% etiqueta %}` | Ejecutar una instrucción de template |
| Filtro | `{{ valor\|filtro }}` | Transformar un valor para mostrarlo |
| Comentario | `{# comentario #}` | Agregar una nota no visible |

## Variable

```html
<h1>{{ empresa }}</h1>
```

## Etiqueta

```html
{% if disponible %}
    <p>El servicio está disponible.</p>
{% endif %}
```

## Filtro

```html
<h2>{{ nombre|title }}</h2>
```

## Comentarios

```html
{# Este comentario no aparecerá en el navegador. #}
```

Para varias líneas:

```html
{% comment %}
Este bloque explica una decisión del template.
No será enviado al navegador.
{% endcomment %}
```

---

# 3. Variables y acceso mediante punto

La vista puede enviar un diccionario:

```python
contexto = {
    "empresa": {
        "nombre": "COA",
        "descripcion": "Cursos Online Avanzados",
        "activa": True,
    },
}
```

En el template se utiliza la notación de punto:

```html
<h1>{{ empresa.nombre }}</h1>
<p>{{ empresa.descripcion }}</p>
```

Aunque en Python utilizarías:

```python
empresa["nombre"]
```

en DTL debes utilizar:

```html
{{ empresa.nombre }}
```

La misma notación permite acceder a:

- claves de diccionarios;
- atributos de objetos;
- posiciones de listas;
- métodos sin argumentos permitidos por el template.

## Posición de una lista

```html
{{ categorias.0 }}
```

No escribas:

```html
{{ categorias[0] }}
```

## Variable inexistente

Si una variable no existe, Django normalmente muestra una cadena vacía. Esto puede ocultar errores:

```html
{{ servico.nombre }}
```

Si el nombre correcto era `servicio`, la página podría quedar vacía sin mostrar un error evidente.

Comprueba siempre:

1. el nombre utilizado en el contexto;
2. el nombre utilizado en el template;
3. la estructura del objeto enviado.

---

# 4. Filtros útiles

Los filtros transforman un valor para presentarlo. No modifican el dato original.

## Texto

```html
{{ nombre|upper }}
{{ nombre|lower }}
{{ nombre|title }}
{{ descripcion|capfirst }}
```

## Limitar texto

```html
{{ descripcion|truncatechars:120 }}
{{ descripcion|truncatewords:20 }}
```

## Valores predeterminados

```html
{{ telefono|default:"No disponible" }}
{{ telefono|default_if_none:"No disponible" }}
```

## Números y fechas

```html
{{ precio|floatformat:2 }}
{{ fecha|date:"d/m/Y" }}
```

## Cantidad

```html
{{ servicios|length }}
```

## Combinar filtros

```html
{{ descripcion|default:"Sin descripción"|truncatechars:100 }}
```

Los filtros deben resolver presentación sencilla. Si necesitas calcular impuestos, validar descuentos o decidir si una operación empresarial puede ejecutarse, realiza esa lógica en Python.

---

# 5. Condicionales

```html
{% if servicio.disponible %}
    <span>Disponible</span>
{% else %}
    <span>No disponible</span>
{% endif %}
```

## Varias opciones

```html
{% if servicio.estado == "Disponible" %}
    <span class="badge text-bg-success">Disponible</span>
{% elif servicio.estado == "Mantenimiento" %}
    <span class="badge text-bg-warning">Mantenimiento</span>
{% else %}
    <span class="badge text-bg-danger">No disponible</span>
{% endif %}
```

DTL permite utilizar:

- `==`, `!=`, `>`, `<`, `>=` y `<=`;
- `in` y `not in`;
- `and`, `or` y `not`.

Ejemplo:

```html
{% if servicio.destacado and servicio.estado == "Disponible" %}
    <span class="badge text-bg-primary">Recomendado</span>
{% endif %}
```

## Evita condiciones difíciles de leer

Si un condicional requiere muchas reglas, prepara el resultado en la vista.

En lugar de:

```html
{% if servicio.estado == "Disponible" and servicio.precio > 0 and servicio.categoria != "Interno" %}
```

envía una propiedad como:

```python
servicio["se_puede_solicitar"] = (
    servicio["estado"] == "Disponible"
    and servicio["precio"] > 0
    and servicio["categoria"] != "Interno"
)
```

Y muestra:

```html
{% if servicio.se_puede_solicitar %}
```

---

# 6. Ciclos y estados vacíos

La vista puede enviar una colección:

```python
contexto = {
    "servicios": [
        {"id": 1, "nombre": "Soporte", "disponible": True},
        {"id": 2, "nombre": "Capacitación", "disponible": True},
        {"id": 3, "nombre": "Consultoría", "disponible": False},
    ],
}
```

El template puede recorrerla:

```html
{% for servicio in servicios %}
    <article>
        <h2>{{ servicio.nombre }}</h2>
    </article>
{% endfor %}
```

## Estado vacío

```html
{% for servicio in servicios %}
    <article>
        <h2>{{ servicio.nombre }}</h2>
    </article>
{% empty %}
    <section>
        <h2>No hay servicios disponibles</h2>
        <p>Vuelve a intentarlo más tarde.</p>
    </section>
{% endfor %}
```

Un estado vacío profesional debe explicar:

- qué sucedió;
- si es un error o una situación normal;
- qué puede hacer la persona.

## Variables de `forloop`

| Variable | Significado |
|---|---|
| `forloop.counter` | Posición comenzando en 1 |
| `forloop.counter0` | Posición comenzando en 0 |
| `forloop.first` | Verdadero en el primer elemento |
| `forloop.last` | Verdadero en el último elemento |

---

# 7. Herencia de templates

La herencia permite construir una estructura general que las demás páginas reutilizan.

## Estructura recomendada

```text
proyecto/
├── templates/
│   ├── base.html
│   └── components/
│       ├── navbar.html
│       └── footer.html
├── portal/
│   └── templates/
│       └── portal/
│           ├── inicio.html
│           ├── servicios.html
│           ├── servicio_detalle.html
│           └── contacto.html
└── manage.py
```

## Configurar la carpeta general

En `config/settings.py`:

```python
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
```

La modificación importante es:

```python
"DIRS": [BASE_DIR / "templates"],
```

`APP_DIRS = True` permite buscar templates dentro de aplicaciones instaladas.

## Plantilla base

```html
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}Portal empresarial{% endblock %}</title>
</head>
<body>
    <header>
        <nav>
            <a href="{% url 'portal:inicio' %}">Inicio</a>
            <a href="{% url 'portal:servicios' %}">Servicios</a>
            <a href="{% url 'portal:contacto' %}">Contacto</a>
        </nav>
    </header>

    <main>
        {% block content %}{% endblock %}
    </main>

    <footer>
        <p>COA - Cursos Online Avanzados</p>
    </footer>
</body>
</html>
```

## Template hijo

```html
{% extends "base.html" %}

{% block title %}Inicio | Portal empresarial{% endblock %}

{% block content %}
    <h1>Portal empresarial</h1>
    <p>Bienvenido al sistema.</p>
{% endblock %}
```

`extends` debe ser la primera etiqueta de template. El archivo hijo define solamente aquello que cambia.

La plantilla base puede ofrecer puntos de extensión:

```html
{% block extra_css %}{% endblock %}
{% block content %}{% endblock %}
{% block extra_js %}{% endblock %}
```

No agregues bloques sin una necesidad concreta.

---

# 8. Componentes reutilizables con `include`

La herencia resuelve la estructura general. `include` resuelve fragmentos reutilizables:

- navegación;
- pie de página;
- tarjeta;
- alerta;
- estado vacío.

## Navegación

```html
<nav aria-label="Navegación principal">
    <a href="{% url 'portal:inicio' %}">Inicio</a>
    <a href="{% url 'portal:servicios' %}">Servicios</a>
    <a href="{% url 'portal:contacto' %}">Contacto</a>
</nav>
```

Desde `base.html`:

```html
{% include "components/navbar.html" %}
```

## Tarjeta reutilizable

Archivo:

```text
portal/templates/portal/components/service_card.html
```

```html
<article class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
        <h2 class="h5 card-title">{{ servicio.nombre }}</h2>

        <p class="card-text">
            {{ servicio.descripcion|truncatechars:110 }}
        </p>

        <div class="mt-auto">
            <a
                class="btn btn-primary"
                href="{% url 'portal:servicio_detalle' servicio.id %}"
            >
                Ver servicio
            </a>
        </div>
    </div>
</article>
```

Uso:

```html
{% include "portal/components/service_card.html" with servicio=servicio only %}
```

`only` limita el componente a las variables enviadas explícitamente y reduce dependencias ocultas.

Crea un componente cuando:

- se repite;
- tiene una responsabilidad clara;
- puede comprenderse de forma independiente;
- evita duplicación real.

---

# 9. Enlaces mediante nombres de rutas

No escribas:

```html
<a href="/servicios/">Servicios</a>
```

Utiliza:

```html
<a href="{% url 'portal:servicios' %}">Servicios</a>
```

Con parámetro:

```html
<a href="{% url 'portal:servicio_detalle' servicio.id %}">
    Ver detalle
</a>
```

Esto permite cambiar la dirección sin modificar todos los templates.

## Enlace activo

```html
{% with current=request.resolver_match.url_name %}
    <a
        class="nav-link {% if current == 'inicio' %}active{% endif %}"
        href="{% url 'portal:inicio' %}"
        {% if current == "inicio" %}aria-current="page"{% endif %}
    >
        Inicio
    </a>
{% endwith %}
```

El proyecto debe identificar visualmente la página actual.

---

# 10. Archivos estáticos

Los archivos estáticos son recursos que Django no genera dinámicamente:

- CSS;
- JavaScript;
- imágenes de interfaz;
- iconos;
- fuentes locales.

## Estructura

```text
portal/
└── static/
    └── portal/
        ├── css/
        │   └── styles.css
        └── img/
            └── logo.svg
```

Se repite `portal` para evitar conflictos con archivos de otras aplicaciones.

## Cargar y utilizar

```html
{% load static %}

<link
    rel="stylesheet"
    href="{% static 'portal/css/styles.css' %}"
>

<img
    src="{% static 'portal/img/logo.svg' %}"
    alt="COA - Cursos Online Avanzados"
>
```

El proyecto generado por Django incluye:

```python
STATIC_URL = "static/"
```

Durante desarrollo, `django.contrib.staticfiles` y `runserver` sirven estos archivos cuando `DEBUG=True`.

Si un template hijo utiliza directamente `static`, debe cargar la biblioteca:

```html
{% extends "base.html" %}
{% load static %}
```

Que la plantilla base la haya cargado no la hace disponible automáticamente en todos los hijos.

---

# 11. HTML semántico indispensable

| Elemento | Uso |
|---|---|
| `header` | Encabezado |
| `nav` | Navegación |
| `main` | Contenido principal |
| `section` | Agrupación temática |
| `article` | Contenido independiente |
| `aside` | Contenido complementario |
| `footer` | Pie de página |

```html
<body>
    <header>
        <nav aria-label="Navegación principal">...</nav>
    </header>

    <main id="contenido-principal">
        <section aria-labelledby="titulo-servicios">
            <h1 id="titulo-servicios">Servicios</h1>
        </section>
    </main>

    <footer>...</footer>
</body>
```

Cada página debe tener un título principal claro. No elijas el nivel por su tamaño:

```html
<h2 class="h4">Desarrollo de software</h2>
```

Utiliza un enlace para navegar:

```html
<a href="{% url 'portal:servicios' %}">Ver servicios</a>
```

Utiliza un botón para ejecutar una acción:

```html
<button type="button">Cerrar aviso</button>
```

---

# 12. Integración de Bootstrap 5.3.8

Bootstrap proporciona sistema responsive, utilidades y componentes. No sustituye la comprensión de HTML.

## CSS

```html
<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
    crossorigin="anonymous"
>
```

## JavaScript

```html
<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
    crossorigin="anonymous"
></script>
```

El bundle es necesario para navegación colapsable, dropdowns, modales y otros componentes interactivos.

Carga Bootstrap antes del CSS propio:

```html
<link href="...bootstrap..." rel="stylesheet">
<link href="{% static 'portal/css/styles.css' %}" rel="stylesheet">
```

---

# 13. Diseño mobile first y cuadrícula

Bootstrap utiliza mobile first.

| Breakpoint | Ancho mínimo | Prefijo |
|---|---:|---|
| Extra pequeño | Menos de 576 px | `col-` |
| Pequeño | 576 px | `col-sm-` |
| Mediano | 768 px | `col-md-` |
| Grande | 992 px | `col-lg-` |
| Extra grande | 1200 px | `col-xl-` |
| Extra extra grande | 1400 px | `col-xxl-` |

```html
<div class="col-12 col-md-6 col-lg-4">
    ...
</div>
```

Significa:

- teléfono: ancho completo;
- tableta: mitad;
- computadora: tercio.

Forma compacta:

```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    ...
</div>
```

La cuadrícula utiliza:

```text
container
└── row
    ├── col
    ├── col
    └── col
```

Ejemplo:

```html
<div class="container py-5">
    <div class="row g-4">
        <div class="col-12 col-md-6">Primera sección</div>
        <div class="col-12 col-md-6">Segunda sección</div>
    </div>
</div>
```

Utilidades frecuentes:

| Clase | Significado |
|---|---|
| `p-3` | Padding |
| `py-5` | Padding vertical |
| `px-4` | Padding horizontal |
| `mt-4` | Margen superior |
| `mb-3` | Margen inferior |
| `g-4` | Espacio de cuadrícula |

No llenes el HTML de utilidades sin criterio. Si una combinación se repite constantemente, considera una clase CSS propia o un componente.

---

# 14. Barra de navegación adaptable

Una barra de navegación debe permitir que el estudiante o usuario comprenda:

- en qué sitio se encuentra;
- qué secciones puede visitar;
- cuál es la página actual;
- cómo navegar tanto con ratón como con teclado;
- cómo abrir el menú desde una pantalla pequeña.

Bootstrap permite construir una navegación adaptable sin escribir JavaScript personalizado:

```html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
    <div class="container">
        <a class="navbar-brand" href="{% url 'portal:inicio' %}">
            COA Operaciones
        </a>

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navegacionPrincipal"
            aria-controls="navegacionPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú de navegación"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navegacionPrincipal">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="{% url 'portal:inicio' %}">
                        Inicio
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{% url 'portal:servicios' %}">
                        Servicios
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{% url 'portal:nosotros' %}">
                        Nosotros
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

El valor de `data-bs-target` debe coincidir exactamente con el `id` del menú. El botón móvil también necesita el archivo JavaScript de Bootstrap; el CSS por sí solo no puede abrirlo.

La página activa puede identificarse con `request.resolver_match.url_name`:

```html
<a
    class="nav-link {% if request.resolver_match.url_name == 'inicio' %}active{% endif %}"
    href="{% url 'portal:inicio' %}"
    {% if request.resolver_match.url_name == 'inicio' %}aria-current="page"{% endif %}
>
    Inicio
</a>
```

No uses únicamente un cambio de color difícil de percibir. La clase activa y `aria-current="page"` comunican el estado visual y semánticamente.

---

# 15. Tarjetas reutilizables

Las tarjetas funcionan bien para mostrar productos, servicios, cursos, habitaciones o integrantes de un equipo. Deben conservar una estructura consistente aunque el texto de cada elemento tenga diferente longitud.

```html
<article class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start gap-3">
            <h2 class="h5 card-title">{{ servicio.nombre }}</h2>

            {% if servicio.destacado %}
                <span class="badge text-bg-primary">Destacado</span>
            {% endif %}
        </div>

        <p class="card-text text-body-secondary">
            {{ servicio.descripcion|truncatewords:18 }}
        </p>

        <a
            class="btn btn-outline-primary mt-auto"
            href="{% url 'portal:detalle_servicio' servicio.id %}"
        >
            Ver servicio
        </a>
    </div>
</article>
```

Observa tres decisiones:

1. `h-100` hace que la tarjeta ocupe toda la altura disponible.
2. `d-flex flex-column` organiza el contenido verticalmente.
3. `mt-auto` mantiene el botón al final aunque las descripciones tengan tamaños distintos.

Si esta estructura se repite, debe vivir en un componente:

```html
{% include "portal/components/tarjeta_servicio.html" with servicio=servicio only %}
```

---

# 16. Tablas que funcionan en pantallas pequeñas

Una tabla es adecuada para comparar datos con columnas: inventario, reservas, ventas o usuarios. No es adecuada para maquetar toda una página.

```html
<div class="table-responsive">
    <table class="table table-striped table-hover align-middle">
        <caption class="visually-hidden">
            Lista de productos disponibles
        </caption>
        <thead>
            <tr>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Existencias</th>
                <th scope="col">Estado</th>
            </tr>
        </thead>
        <tbody>
            {% for producto in productos %}
                <tr>
                    <th scope="row">{{ producto.nombre }}</th>
                    <td>{{ producto.categoria }}</td>
                    <td>{{ producto.existencias }}</td>
                    <td>
                        {% if producto.existencias > 0 %}
                            <span class="badge text-bg-success">Disponible</span>
                        {% else %}
                            <span class="badge text-bg-danger">Agotado</span>
                        {% endif %}
                    </td>
                </tr>
            {% empty %}
                <tr>
                    <td colspan="4" class="text-center py-4">
                        Todavía no hay productos registrados.
                    </td>
                </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
```

`table-responsive` permite desplazamiento horizontal cuando la tabla no cabe. Los atributos `scope` ayudan a relacionar encabezados y datos. El estado vacío evita mostrar una estructura confusa sin explicación.

---

# 17. Estados vacíos, avisos y retroalimentación

Una interfaz profesional también diseña lo que sucede cuando no hay información.

Un buen estado vacío debe explicar:

- qué falta;
- por qué la sección está vacía, si se conoce;
- qué acción puede realizar el usuario.

```html
{% if servicios %}
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {% for servicio in servicios %}
            <div class="col">
                {% include "portal/components/tarjeta_servicio.html" with servicio=servicio only %}
            </div>
        {% endfor %}
    </div>
{% else %}
    <section class="border rounded-3 bg-body-tertiary p-5 text-center">
        <h2 class="h4">No hay servicios disponibles</h2>
        <p class="text-body-secondary mb-0">
            El catálogo se encuentra en actualización. Vuelve a intentarlo más tarde.
        </p>
    </section>
{% endif %}
```

Los avisos breves pueden representarse con alertas:

```html
<div class="alert alert-success" role="status">
    La información se cargó correctamente.
</div>
```

Los mensajes asociados a formularios y operaciones reales se trabajarán en módulos posteriores. En este módulo el objetivo es reconocer y diseñar correctamente los estados de la interfaz.

---

# 18. CSS propio sin competir con Bootstrap

Bootstrap resuelve la estructura general, pero el sitio necesita identidad visual. El CSS propio debe complementar el framework.

`portal/static/portal/css/estilos.css`:

```css
:root {
    --coa-primary: #2447d8;
    --coa-dark: #14213d;
    --coa-surface: #f6f8fc;
}

body {
    min-height: 100vh;
    background-color: var(--coa-surface);
}

.hero {
    color: #ffffff;
    background:
        linear-gradient(135deg, rgba(20, 33, 61, 0.97), rgba(36, 71, 216, 0.9));
}

.service-card {
    transition: transform 180ms ease, box-shadow 180ms ease;
}

.service-card:hover,
.service-card:focus-within {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.75rem 1.5rem rgba(20, 33, 61, 0.14);
}

.skip-link {
    position: absolute;
    top: -4rem;
    left: 1rem;
    z-index: 2000;
}

.skip-link:focus {
    top: 1rem;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }
}
```

Principios:

- define variables para los colores repetidos;
- crea clases con nombres relacionados con el componente;
- evita copiar estilos que Bootstrap ya ofrece;
- evita abusar de `!important`;
- conserva contraste suficiente;
- no conviertas cada elemento en una clase distinta sin reutilización.

---

# 19. Accesibilidad básica desde el inicio

La accesibilidad no es un adorno que se agrega al final. Es parte de la calidad del software.

## 19.1 Estructura semántica

Utiliza los elementos por su significado:

```html
<header>...</header>
<nav aria-label="Navegación principal">...</nav>
<main id="contenido-principal">...</main>
<footer>...</footer>
```

Debe existir un solo contenido principal por página y una jerarquía lógica de encabezados. No elijas `h1`, `h2` o `h3` por su tamaño visual.

## 19.2 Enlace para saltar al contenido

```html
<a class="btn btn-primary skip-link" href="#contenido-principal">
    Saltar al contenido principal
</a>
```

Este enlace permite que una persona que navega con teclado evite recorrer toda la barra de navegación en cada página.

## 19.3 Imágenes

- Imagen informativa: `alt` describe su propósito.
- Imagen decorativa: `alt=""`.
- No empieces con “imagen de”, salvo que ese dato sea relevante.
- No repitas en `alt` exactamente el texto que está al lado.

## 19.4 Enlaces y botones

- Un enlace lleva a otro lugar.
- Un botón ejecuta una acción.
- Evita textos ambiguos como “clic aquí”.
- El foco del teclado debe ser visible.
- No desactives `outline` sin proporcionar un reemplazo.

## 19.5 Prueba mínima con teclado

Recorre cada página usando:

- `Tab` para avanzar;
- `Shift + Tab` para retroceder;
- `Enter` para activar enlaces;
- `Espacio` para activar botones cuando corresponda;
- `Esc` para cerrar componentes que lo admitan.

Si no puedes identificar dónde está el foco, la interfaz necesita corrección.

---

# 20. Seguridad básica en los templates

Django escapa automáticamente gran parte del contenido que se imprime con `{{ variable }}`. Esto ayuda a evitar que texto no confiable se interprete como HTML.

No desactives esa protección por comodidad:

```html
<!-- Evitar con datos ingresados por usuarios -->
{{ comentario|safe }}
```

El filtro `safe` indica que confías en el contenido. Utilizarlo con información no validada puede permitir que se inserte código malicioso.

Reglas:

- conserva el autoescape predeterminado;
- no permitas que usuarios escriban templates;
- evita `safe` si no puedes justificarlo;
- no incluyas secretos, contraseñas o claves en el HTML;
- recuerda que ocultar un botón no reemplaza una autorización del servidor.

Los permisos reales se desarrollarán en el módulo de autenticación. Por ahora, debes comprender que el template presenta información, pero no protege por sí solo las operaciones.

---

# 21. Laboratorio guiado: transformar el portal del Módulo 1

En este laboratorio convertirás el portal funcional del módulo anterior en una interfaz reutilizable, adaptable y accesible.

## Paso 1. Crear la estructura

```text
portal_empresa/
├── manage.py
├── portal_empresa/
│   └── settings.py
├── templates/
│   ├── base.html
│   └── components/
│       ├── navbar.html
│       └── footer.html
└── portal/
    ├── static/
    │   └── portal/
    │       └── css/
    │           └── estilos.css
    └── templates/
        └── portal/
            ├── inicio.html
            ├── servicios.html
            ├── detalle_servicio.html
            ├── nosotros.html
            ├── 404.html
            └── components/
                └── tarjeta_servicio.html
```

En `settings.py`, habilita el directorio global:

```python
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
```

## Paso 2. Construir `base.html`

```html
{% load static %}
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta
        name="description"
        content="{% block meta_description %}Portal empresarial desarrollado con Django{% endblock %}"
    >
    <title>{% block title %}COA Operaciones{% endblock %}</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
        crossorigin="anonymous"
    >
    <link rel="stylesheet" href="{% static 'portal/css/estilos.css' %}">
    {% block extra_css %}{% endblock %}
</head>
<body>
    <a class="btn btn-primary skip-link" href="#contenido-principal">
        Saltar al contenido principal
    </a>

    {% include "components/navbar.html" %}

    <main id="contenido-principal">
        {% block content %}{% endblock %}
    </main>

    {% include "components/footer.html" %}

    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"
    ></script>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

## Paso 3. Crear la navegación y el pie

Usa una barra `navbar-expand-lg`, enlaces construidos con `{% url %}` y un indicador de página activa. En el pie, Django puede calcular el año:

```html
<footer class="bg-dark text-white py-4 mt-5">
    <div class="container">
        <p class="mb-0">
            © {% now "Y" %} COA Operaciones. Proyecto educativo.
        </p>
    </div>
</footer>
```

## Paso 4. Actualizar la vista

La vista prepara los datos. El template decide cómo presentarlos:

```python
def inicio(request):
    servicios = [
        {
            "id": 1,
            "nombre": "Control de inventario",
            "descripcion": "Organización de productos y existencias.",
            "destacado": True,
        },
        {
            "id": 2,
            "nombre": "Gestión de clientes",
            "descripcion": "Seguimiento ordenado de información comercial.",
            "destacado": False,
        },
        {
            "id": 3,
            "nombre": "Reportes operativos",
            "descripcion": "Resumen visual para apoyar decisiones.",
            "destacado": True,
        },
    ]

    contexto = {
        "servicios": servicios,
        "servicios_destacados": [
            servicio for servicio in servicios if servicio["destacado"]
        ],
    }
    return render(request, "portal/inicio.html", contexto)
```

No necesitas una base de datos todavía. Los modelos y el ORM se trabajarán en el siguiente módulo.

## Paso 5. Construir la página de inicio

```html
{% extends "base.html" %}

{% block title %}Inicio | COA Operaciones{% endblock %}

{% block meta_description %}
Soluciones digitales para mejorar las operaciones de pequeñas empresas.
{% endblock %}

{% block content %}
    <section class="hero py-5">
        <div class="container py-lg-4">
            <div class="row align-items-center g-4">
                <div class="col-12 col-lg-7">
                    <p class="text-uppercase fw-semibold mb-2">Soluciones empresariales</p>
                    <h1 class="display-5 fw-bold">
                        Organiza tu empresa con herramientas sencillas
                    </h1>
                    <p class="lead">
                        Centraliza información, controla operaciones y consulta resultados.
                    </p>
                    <a class="btn btn-light btn-lg" href="{% url 'portal:servicios' %}">
                        Conocer servicios
                    </a>
                </div>
                <div class="col-12 col-lg-5">
                    <div class="bg-white text-dark rounded-4 p-4 shadow">
                        <span class="display-6 fw-bold">
                            {{ servicios|length }}
                        </span>
                        <p class="mb-0">soluciones disponibles</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="container py-5" aria-labelledby="titulo-destacados">
        <div class="d-flex justify-content-between align-items-end gap-3 mb-4">
            <div>
                <p class="text-primary fw-semibold mb-1">Selección principal</p>
                <h2 id="titulo-destacados" class="mb-0">Servicios destacados</h2>
            </div>
            <a href="{% url 'portal:servicios' %}">Ver catálogo completo</a>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {% for servicio in servicios_destacados %}
                <div class="col">
                    {% include "portal/components/tarjeta_servicio.html" with servicio=servicio only %}
                </div>
            {% empty %}
                <div class="col-12">
                    <p class="alert alert-info mb-0">
                        Todavía no hay servicios destacados.
                    </p>
                </div>
            {% endfor %}
        </div>
    </section>
{% endblock %}
```

## Paso 6. Probar la interfaz

Comprueba al menos:

- ancho aproximado de `375 px`;
- ancho aproximado de `768 px`;
- ancho aproximado de `1440 px`;
- navegación completa con teclado;
- menú móvil abierto y cerrado;
- enlaces internos;
- contenido con lista llena;
- estado vacío temporal;
- página 404;
- consola del navegador sin errores.

No basta con reducir la ventana y observar rápidamente. Recorre la interfaz y utiliza sus controles.

## Paso 7. Registrar el progreso

Crea commits breves y descriptivos:

```text
feat: agregar plantilla base y navegación
feat: crear tarjetas reutilizables de servicios
style: adaptar portal a pantallas pequeñas
fix: mejorar foco y textos alternativos
```

---

# 22. Inteligencia Artificial como asistente de interfaz

La IA puede acelerar una interfaz, pero no conoce automáticamente la arquitectura, las rutas ni los requisitos del proyecto.

## Uso recomendado

- proponer una primera estructura Bootstrap;
- detectar HTML duplicado;
- sugerir un componente reutilizable;
- explicar una expresión DTL;
- revisar semántica y accesibilidad;
- buscar la causa de una ruta o archivo estático roto;
- comparar la interfaz con una lista de requisitos.

## Prompts útiles

### Refactorizar duplicación

```text
Actúa como revisor de Django 5.2. Te daré tres templates.
Identifica únicamente el HTML repetido que conviene mover a base.html
o a un include. Propón la estructura de archivos y explica cada cambio.
No inventes rutas ni variables de contexto.
```

### Revisar adaptación responsive

```text
Revisa este template con Bootstrap 5.3.
Debe funcionar a 375, 768 y 1440 px.
Indica problemas concretos de cuadrícula, desbordamiento, navegación
y legibilidad. Devuelve primero una lista de hallazgos y después
el fragmento mínimo corregido.
```

### Revisar accesibilidad

```text
Audita este HTML renderizado. Revisa estructura semántica,
jerarquía de encabezados, nombres accesibles, texto alternativo,
uso de enlaces y botones, foco visible y navegación por teclado.
No afirmes que cumple totalmente WCAG solo por revisar el código.
```

## Validación obligatoria

Antes de conservar una respuesta de IA, comprueba:

1. ¿Usa Django Template Language o confundió el proyecto con Jinja2?
2. ¿Las variables existen en el contexto?
3. ¿Las rutas tienen el nombre y namespace correctos?
4. ¿Los `include` apuntan a archivos existentes?
5. ¿Usa Bootstrap 5.3 y no clases de Bootstrap 4?
6. ¿El menú móvil carga el bundle JavaScript?
7. ¿La página funciona sin depender de texto o datos inventados?
8. ¿La propuesta conserva accesibilidad básica?
9. ¿Comprendes cada línea antes de integrarla?

Si no puedes explicar una solución, todavía no está lista para formar parte del proyecto.

---

# 23. Ejercicios obligatorios

Completa los doce ejercicios. Guarda cada solución en una carpeta separada y añade una breve explicación de lo que practicaste.

## Ejercicio 1. Presentación de datos y filtros

Crea una vista que envíe al template:

- nombre de una empresa;
- descripción extensa;
- correo de contacto;
- fecha de actualización;
- cantidad de servicios.

Presenta la información usando, como mínimo, los filtros `title`, `truncatewords`, `default`, `date` y `length`. Después elimina temporalmente uno de los valores opcionales y verifica que la página continúe mostrando un mensaje comprensible.

**Resultado esperado:** una página legible que transforme los datos sin alterar la vista.

## Ejercicio 2. Estados visuales con condiciones

Construye una lista de cuatro servicios. Cada servicio tendrá un campo `estado` con uno de estos valores: `activo`, `pausado` o `agotado`.

En el template:

- muestra una insignia diferente para cada estado;
- agrega el texto “Recomendado” cuando `destacado` sea verdadero;
- muestra un aviso especial si el precio es igual a cero;
- evita escribir lógica de negocio compleja.

**Resultado esperado:** el usuario puede reconocer el estado sin depender únicamente del color.

## Ejercicio 3. Recorrido y estado vacío

Envía una colección de integrantes de un equipo. Por cada persona muestra nombre, puesto y antigüedad. Utiliza:

- `forloop.counter`;
- `{% for %}`;
- `{% empty %}`;
- una cuadrícula responsive.

Prueba primero con datos y después con una lista vacía. Adjunta una captura de cada estado.

## Ejercicio 4. Eliminar duplicación con herencia

Crea las páginas `inicio.html`, `servicios.html` y `contacto.html`. Las tres deben extender una única plantilla base.

La base debe contener:

- estructura HTML completa;
- título configurable;
- descripción configurable;
- navegación;
- contenido principal;
- pie;
- bloques opcionales para CSS y JavaScript adicional.

No se permite repetir `<!doctype html>`, `<head>` o la navegación en las páginas hijas.

## Ejercicio 5. Componentes con `include`

Crea componentes para:

- una tarjeta de servicio;
- una métrica empresarial;
- un aviso de estado.

Renderízalos con `{% include %}` y utiliza `with ... only` al menos una vez. Demuestra que una modificación del componente actualiza todas sus apariciones.

## Ejercicio 6. Rutas con nombre

Crea cinco rutas con `app_name` y nombres únicos. Genera todos los enlaces mediante `{% url %}`.

Después cambia la dirección visible de una ruta, por ejemplo de `servicios/` a `soluciones/`, sin cambiar su nombre. Verifica que los templates continúen funcionando sin editarlos.

## Ejercicio 7. Archivos estáticos

Crea una hoja CSS en la carpeta estática de la aplicación. Debe incluir:

- tres variables de color;
- una clase para el hero;
- una clase para tarjetas;
- un estilo de foco visible;
- una regla para reducir movimiento.

Carga el archivo con `{% static %}`. No se permite colocar estilos extensos dentro del template.

## Ejercicio 8. Cuadrícula responsive

Construye un catálogo de seis elementos:

- una columna en teléfonos;
- dos columnas desde el tamaño mediano;
- tres columnas desde el tamaño grande.

Las tarjetas deben conservar alturas visualmente equilibradas y sus botones deben alinearse en la parte inferior. Comprueba los tres anchos establecidos en el laboratorio.

## Ejercicio 9. Navegación móvil

Construye una barra de navegación Bootstrap con:

- marca;
- cuatro enlaces;
- página activa;
- botón desplegable en pantallas pequeñas;
- nombre accesible del botón;
- navegación identificada con `aria-label`.

Prueba con teclado y confirma que el botón abre y cierra el menú.

## Ejercicio 10. Tabla empresarial adaptable

Presenta una lista de al menos ocho productos con nombre, categoría, existencias y estado.

La tabla debe incluir:

- encabezados correctamente asociados;
- caption;
- filas alternadas;
- indicador de disponibilidad;
- contenedor responsive;
- mensaje cuando no existan productos.

Prueba la tabla a `375 px` y evita que toda la página genere desplazamiento horizontal.

## Ejercicio 11. Auditoría de accesibilidad

Selecciona una página realizada anteriormente y revisa:

- idioma del documento;
- regiones semánticas;
- jerarquía de encabezados;
- textos alternativos;
- enlaces y botones;
- foco;
- navegación por teclado;
- contraste;
- adaptación responsive.

Registra al menos cinco hallazgos reales en una tabla con las columnas `problema`, `impacto`, `corrección` y `evidencia`. Implementa todas las correcciones.

## Ejercicio 12. Diagnóstico de errores

Recibe o crea un proyecto con estos siete defectos:

1. `{% extends %}` apunta al archivo equivocado.
2. Un bloque no se cierra.
3. El template utiliza una variable que la vista no envía.
4. Una ruta no tiene el nombre esperado.
5. No se cargó `{% load static %}`.
6. Un `include` apunta a una carpeta incorrecta.
7. La navegación usa clases antiguas de Bootstrap 4.

Para cada defecto documenta:

| Error observado | Hipótesis | Verificación | Corrección | Resultado |
|---|---|---|---|---|

No cambies varias cosas al mismo tiempo. Comprueba una hipótesis por intento.

---

# 24. Retos adicionales

Estos retos no sustituyen los ejercicios obligatorios:

1. **Tema centralizado:** mueve colores, radios y sombras repetidas a variables CSS.
2. **Alerta configurable:** crea un componente que reciba texto y tipo visual sin duplicar HTML.
3. **Navegación activa:** identifica automáticamente la página actual con `request.resolver_match`.
4. **Tema oscuro estático:** crea una variante usando `data-bs-theme`, sin añadir un selector dinámico.
5. **Movimiento reducido:** revisa transiciones y respeta `prefers-reduced-motion`.

---

# 25. Mini proyecto: Catálogo Visual Responsive

## Contexto

Una pequeña empresa necesita presentar sus servicios en teléfonos, tabletas y computadoras. Todavía no necesita administrar datos desde una base de datos; necesita una interfaz clara y reutilizable.

## Objetivo

Construir un catálogo visual con Django Templates y Bootstrap 5.3.

## Requisitos funcionales

El proyecto debe incluir:

- página de inicio;
- catálogo de al menos ocho servicios;
- detalle individual accesible por una ruta dinámica;
- navegación completa;
- página 404 personalizada;
- estado vacío comprobable.

## Requisitos de templates

- una plantilla base;
- navegación y pie como componentes;
- tarjeta de servicio reutilizable;
- herencia en todas las páginas;
- variables, filtros, condiciones y ciclos;
- `{% empty %}` o un estado equivalente;
- rutas con nombre;
- archivos estáticos correctamente cargados.

## Requisitos visuales

- una columna en teléfono;
- dos columnas en tableta;
- tres o cuatro columnas en escritorio;
- tarjetas de altura equilibrada;
- identidad visual mediante CSS propio;
- menú funcional en dispositivos pequeños;
- foco visible;
- estructura semántica;
- textos alternativos cuando existan imágenes.

## Restricciones

No se utilizarán:

- modelos;
- formularios funcionales;
- vistas basadas en clases;
- React;
- Tailwind CSS;
- jQuery;
- una plantilla comercial copiada sin comprender.

## Entregables del mini proyecto

- código fuente;
- `README.md` con instrucciones;
- captura de inicio en teléfono y escritorio;
- captura del catálogo en sus tres anchos;
- captura del detalle;
- captura de la página 404;
- explicación breve de la herencia y los componentes;
- registro del apoyo de IA, si se utilizó.

## Criterio de logro

El catálogo debe poder ampliarse agregando datos a la colección sin copiar una nueva tarjeta manualmente.

---


<!-- coa-activity:django-m2-mini-proyecto -->

# 26. Proyecto del módulo: Sitio Empresarial Reutilizable

## Situación profesional

Una empresa de servicios necesita reemplazar su sitio estático por una interfaz Django que pueda crecer en los siguientes módulos. La información aún puede provenir de estructuras de Python, pero la arquitectura visual debe quedar preparada para recibir datos de modelos.

## Objetivo

Construir un sitio empresarial multipágina, responsive, accesible y organizado mediante herencia de templates y componentes reutilizables.

## Páginas obligatorias

1. **Inicio**
   - hero;
   - llamada a la acción;
   - tres métricas;
   - servicios destacados;
   - resumen del equipo.

2. **Servicios**
   - al menos ocho servicios;
   - categorías o estados visibles;
   - cuadrícula responsive;
   - estado vacío.

3. **Detalle de servicio**
   - ruta dinámica;
   - nombre, descripción, características y estado;
   - navegación de regreso;
   - manejo de identificador inexistente.

4. **Nosotros**
   - presentación empresarial;
   - misión;
   - valores;
   - equipo de al menos cuatro personas.

5. **Contacto**
   - información de contacto;
   - horario;
   - ubicación descriptiva;
   - maqueta visual de formulario sin procesamiento.

6. **Vista operativa de ejemplo**
   - tabla de información empresarial;
   - encabezados y caption;
   - estado visual;
   - adaptación a teléfono.

7. **Error 404**
   - diseño coherente;
   - explicación clara;
   - enlace seguro para continuar.

## Arquitectura esperada

```text
sitio_empresarial/
├── manage.py
├── README.md
├── sitio_empresarial/
├── templates/
│   ├── base.html
│   └── components/
│       ├── navbar.html
│       └── footer.html
└── portal/
    ├── static/
    │   └── portal/
    │       └── css/
    │           └── estilos.css
    ├── templates/
    │   └── portal/
    │       ├── components/
    │       │   ├── tarjeta_servicio.html
    │       │   └── metrica.html
    │       ├── inicio.html
    │       ├── servicios.html
    │       ├── detalle_servicio.html
    │       ├── nosotros.html
    │       ├── contacto.html
    │       ├── operaciones.html
    │       └── 404.html
    ├── urls.py
    └── views.py
```

Puedes agregar carpetas si existe una razón clara, pero no elimines la separación entre templates globales, templates de la aplicación y archivos estáticos.

## Requisitos técnicos

### Templates

- `base.html` con al menos cuatro bloques;
- todas las páginas extienden la base;
- navegación y pie incluidos;
- al menos dos componentes de contenido;
- uso de `with ... only` en un componente;
- variables, filtros, condiciones, ciclos y estado vacío;
- `{% url %}` en todos los enlaces internos;
- `{% static %}` para el CSS propio.

### Diseño

- Bootstrap 5.3;
- enfoque mobile first;
- diseño comprobado a `375`, `768` y `1440 px`;
- menú móvil funcional;
- cuadrícula, tarjetas, tabla, botones y alertas usados con propósito;
- identidad visual coherente;
- sin desbordamientos accidentales.

### Accesibilidad

- `lang="es"`;
- enlace para saltar al contenido;
- regiones semánticas;
- un `h1` principal por página;
- jerarquía de encabezados coherente;
- foco visible;
- textos alternativos correctos;
- navegación completa con teclado;
- página activa identificada.

### Organización profesional

- nombres claros;
- sin HTML estructural duplicado;
- sin rutas escritas manualmente;
- sin lógica empresarial compleja en templates;
- mínimo seis commits descriptivos;
- `README.md` con instalación, ejecución, estructura y pruebas;
- lista de pruebas manuales;
- registro transparente del uso de IA.

## Evidencias obligatorias

Incluye:

1. inicio en teléfono;
2. inicio en escritorio;
3. menú móvil abierto;
4. catálogo en tableta;
5. detalle de servicio;
6. estado vacío;
7. tabla en teléfono;
8. página 404;
9. foco visible durante navegación con teclado;
10. historial de commits.

## Explicación técnica

Redacta un documento breve que responda:

1. ¿Qué contenido pertenece a `base.html` y por qué?
2. ¿Qué elementos convertiste en componentes?
3. ¿Cómo evitaste rutas frágiles?
4. ¿Cómo comprobaste el comportamiento responsive?
5. ¿Qué decisiones de accesibilidad implementaste?
6. ¿Qué aportó la IA y cómo validaste sus sugerencias?
7. ¿Qué parte podría conectarse a modelos en el siguiente módulo?

---

# 27. Pruebas manuales del proyecto

Completa la tabla antes de entregar:

| Prueba | Procedimiento | Resultado esperado |
|---|---|---|
| Inicio | Abrir la ruta principal | Carga sin errores y muestra el hero |
| Navegación | Visitar todos los enlaces | Cada enlace lleva a la ruta correcta |
| Página activa | Cambiar de sección | La navegación identifica la sección actual |
| Menú móvil | Probar a 375 px | Abre, cierra y permite visitar enlaces |
| Catálogo | Mostrar ocho servicios | Las tarjetas conservan estructura consistente |
| Estado vacío | Enviar una lista vacía | Aparece una explicación comprensible |
| Detalle válido | Abrir un identificador existente | Se presenta el servicio correcto |
| Detalle inválido | Abrir un identificador inexistente | Se responde de forma controlada |
| Archivos estáticos | Recargar sin caché | El CSS se carga correctamente |
| Tabla | Revisar a 375 px | No desborda toda la página |
| Teclado | Recorrer con Tab | El orden es lógico y el foco es visible |
| 404 | Abrir una ruta inexistente | Aparece la página personalizada |
| Consola | Revisar el navegador | No existen errores relevantes |

Agrega cualquier prueba específica de tu implementación.

---

# 28. Rúbrica del proyecto del módulo

El proyecto principal aporta **50 puntos** a la calificación del módulo.

| Criterio | Puntos | Evidencia esperada |
|---|---:|---|
| Páginas, contenido y navegación | 8 | Todas las páginas y rutas funcionan |
| Herencia y plantilla base | 10 | Estructura centralizada, bloques útiles y ausencia de duplicación |
| Componentes reutilizables | 6 | Includes claros y correctamente parametrizados |
| Uso de Django Template Language | 6 | Variables, filtros, condiciones, ciclos y estado vacío |
| Bootstrap y diseño responsive | 7 | Interfaz usable en los tres anchos |
| CSS y archivos estáticos | 4 | Identidad visual propia y carga correcta |
| Accesibilidad básica | 4 | Semántica, foco, teclado, alternativas y página activa |
| Estados y manejo de errores | 2 | Estado vacío, detalle inexistente y 404 |
| Git, README, pruebas y uso de IA | 3 | Proceso verificable y documentación suficiente |
| **Total** | **50** | |

## Condiciones críticas

El proyecto no puede aprobarse mientras ocurra alguno de estos problemas:

- no inicia siguiendo el `README`;
- una página obligatoria produce un error no controlado;
- las páginas no utilizan herencia;
- la navegación principal está rota;
- el sitio no puede utilizarse en teléfono;
- se entregó código generado por IA que el estudiante no puede explicar;
- faltan el código fuente o las evidencias principales.

Una condición crítica debe corregirse aunque la suma numérica alcance el mínimo.

---

# 29. Evaluación práctica del módulo

La evaluación se realiza sobre un proyecto pequeño proporcionado por la plataforma. No consiste únicamente en preguntas teóricas.

## Parte 1. Refactorizar duplicación — 5 puntos

Recibirás tres páginas que repiten cabecera, navegación y pie. Debes:

- crear una base;
- definir bloques adecuados;
- convertir las páginas en templates hijos;
- mantener el resultado visual.

## Parte 2. Crear un componente — 5 puntos

Recibirás HTML repetido para mostrar elementos empresariales. Debes:

- convertirlo en un `include`;
- pasar los datos requeridos;
- mostrar una condición;
- conservar un estado vacío.

## Parte 3. Corregir adaptación y accesibilidad — 5 puntos

Recibirás una página con desbordamiento móvil y problemas de navegación por teclado. Debes:

- identificar los defectos;
- corregir la cuadrícula;
- hacer funcional el menú;
- mejorar semántica, foco y nombres accesibles;
- explicar cómo verificaste el resultado.

Duración recomendada: **45 minutos**.

---

# 30. Calificación y punto de entrega

| Actividad | Valor |
|---|---:|
| 12 ejercicios obligatorios | 15 puntos |
| Mini proyecto | 20 puntos |
| Proyecto del módulo | 50 puntos |
| Evaluación práctica | 15 puntos |
| **Total** | **100 puntos** |

Se requiere:

- mínimo **80 puntos de 100**;
- proyecto principal aprobado por el instructor;
- corrección de todas las condiciones críticas.

Existe **un solo punto de entrega** para todo el módulo. No debes enviar un formulario por ejercicio.

## Nombre de la carpeta

```text
COA_DJANGO_M2_APELLIDO_NOMBRE
```

## Estructura de entrega

```text
COA_DJANGO_M2_APELLIDO_NOMBRE/
├── ejercicios/
│   ├── ejercicio_01/
│   ├── ejercicio_02/
│   └── ...
├── mini_proyecto/
├── proyecto_modulo/
├── evaluacion_practica/
├── evidencias/
│   ├── 01_inicio_movil.png
│   ├── 02_inicio_escritorio.png
│   └── ...
└── explicacion_tecnica.pdf
```

Comprime la carpeta como:

```text
COA_DJANGO_M2_APELLIDO_NOMBRE.zip
```

El formulario de entrega debe solicitar:

- nombre completo;
- correo utilizado en COA;
- módulo;
- archivo comprimido o enlace autorizado;
- enlace al repositorio, si la plataforma lo permite;
- confirmación de autoría;
- comentario opcional para el instructor.

No incluyas el entorno virtual, secretos, archivos temporales ni carpetas de caché.

[Entregar el Módulo 2](https://forms.gle/nTx97JRkFkbH5Vfr6)

---


<!-- coa-activity:django-m2-proyecto -->

# 31. Errores comunes y cómo resolverlos

| Error | Causa probable | Acción recomendada |
|---|---|---|
| `TemplateDoesNotExist` | Ruta incorrecta o carpeta no configurada | Revisa `DIRS`, `APP_DIRS` y la ruta completa del template |
| `Invalid block tag` | Etiqueta mal escrita o sin cerrar | Revisa `{% endif %}`, `{% endfor %}` y `{% endblock %}` |
| La variable aparece vacía | El nombre no coincide con el contexto | Compara la clave enviada por la vista con la usada en el template |
| `NoReverseMatch` | Nombre, namespace o argumento de ruta incorrecto | Revisa `app_name`, `name` y los parámetros de `{% url %}` |
| El CSS no carga | Falta `load static`, ruta incorrecta o servidor sin reiniciar | Comprueba la ubicación y la URL solicitada en el navegador |
| El menú móvil no abre | Falta el bundle JS o no coincide el identificador | Revisa el script, `data-bs-target` e `id` |
| Bootstrap no aplica | CDN incorrecto, bloqueo de red o clases antiguas | Revisa la pestaña de red y utiliza documentación de la versión 5.3 |
| Todas las páginas repiten HTML | No se aplicó herencia | Mueve la estructura común a `base.html` |
| Un componente depende de variables ocultas | El include recibe demasiado contexto | Pasa datos explícitos y usa `only` cuando sea apropiado |
| La página se desborda en teléfono | Anchos fijos, tabla o contenido largo | Revisa cuadrícula, `table-responsive` y elementos con ancho fijo |
| El foco no se ve | CSS eliminó `outline` | Restaura el foco o crea un indicador visible equivalente |
| El HTML del usuario se interpreta | Se utilizó `safe` sin validación | Elimina `safe` y conserva el escape automático |

## Método de diagnóstico

1. Lee el mensaje completo.
2. Identifica si el problema pertenece a template, contexto, ruta, estático o navegador.
3. Formula una sola hipótesis.
4. Realiza el cambio mínimo.
5. recarga y verifica.
6. Revierte el cambio si no resolvió la causa.
7. Registra la solución si puede repetirse.

---

# 32. Buenas prácticas del módulo

- Mantén la vista responsable de preparar los datos.
- Mantén el template responsable de presentarlos.
- Usa herencia para la estructura general.
- Usa componentes para fragmentos repetibles con una responsabilidad clara.
- Genera enlaces internos con nombres de ruta.
- Separa archivos estáticos por aplicación.
- Diseña primero para una pantalla pequeña.
- Comprueba estados llenos, vacíos y de error.
- Usa HTML semántico antes de agregar atributos ARIA.
- No ocultes información importante únicamente por estética.
- No dependas solo del color para comunicar estados.
- Conserva el foco visible.
- Prueba con teclado.
- Realiza commits pequeños.
- Valida cada propuesta de IA antes de conservarla.

---

# 33. Videos recomendados

Los videos complementan la práctica; no sustituyen la documentación ni el desarrollo de los proyectos.

## Templates y Bootstrap en Django

[Django: Templates y Bootstrap](https://www.youtube.com/watch?v=FxTt1togtj4)

DesarrolloWeb con JP

Úsalo para observar la integración inicial entre Django Templates y Bootstrap.

## Herencia de templates

[Herencia de plantillas en Django](https://www.youtube.com/watch?v=zcBPKBq6v84)

Jon Vadillo

Refuerza el propósito de `extends`, los bloques y la eliminación de HTML duplicado.

## Archivos estáticos

[Archivos estáticos en Django](https://www.youtube.com/watch?v=AKVt1IUvQmw)

neodevsoft

Úsalo como apoyo al configurar CSS, imágenes y la etiqueta `static`.

## Página responsive con Bootstrap 5

[Crear una página web con Bootstrap 5](https://www.youtube.com/watch?v=Za0TdyMcjis)

AyudanTec

Refuerza la cuadrícula, los componentes y la adaptación a diferentes pantallas.

## Forma recomendada de estudiar un video

1. Reproduce una sección breve.
2. Pausa.
3. Implementa la idea sin copiar mecánicamente.
4. Cambia contenido, estructura o estilos.
5. Explica por qué funciona.
6. Consulta la documentación si el video y la versión actual difieren.

---

# 34. Documentación y recursos

## Django 5.2

- [Introducción al sistema de plantillas](https://docs.djangoproject.com/es/5.2/topics/templates/)
- [Lenguaje de plantillas de Django](https://docs.djangoproject.com/es/5.2/ref/templates/language/)
- [Etiquetas y filtros integrados](https://docs.djangoproject.com/es/5.2/ref/templates/builtins/)
- [Administración de archivos estáticos](https://docs.djangoproject.com/es/5.2/howto/static-files/)

## Bootstrap 5.3

- [Introducción oficial](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Sistema de cuadrícula](https://getbootstrap.com/docs/5.3/layout/grid/)
- [Barra de navegación](https://getbootstrap.com/docs/5.3/components/navbar/)
- [Tarjetas](https://getbootstrap.com/docs/5.3/components/card/)
- [Tablas](https://getbootstrap.com/docs/5.3/content/tables/)
- [Accesibilidad en Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/accessibility/)

## HTML y accesibilidad

- [Fundamentos de accesibilidad en HTML — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Accessibility/HTML)
- [HTML: lenguaje de marcado — MDN](https://developer.mozilla.org/es/docs/Web/HTML)

## Cómo leer la documentación

Cuando necesites resolver una duda:

1. define exactamente qué deseas lograr;
2. identifica la tecnología responsable;
3. busca primero en el índice oficial;
4. comprueba la versión;
5. ejecuta el ejemplo mínimo;
6. adáptalo a tu proyecto;
7. registra la solución con tus propias palabras.

No leas toda la documentación de principio a fin. Aprende a consultarla para responder preguntas concretas.

---

# 35. Material complementario

No se necesita una colección extensa de archivos descargables. El módulo puede acompañarse con estos recursos breves:

1. **Guía rápida de Django Template Language**
   - variables;
   - filtros frecuentes;
   - condiciones;
   - ciclos;
   - `url`;
   - `static`;
   - herencia e includes.

2. **Lista de comprobación responsive**
   - anchos de prueba;
   - navegación;
   - cuadrículas;
   - tablas;
   - texto;
   - desbordamientos.

3. **Lista de comprobación de accesibilidad básica**
   - idioma;
   - semántica;
   - encabezados;
   - alternativas;
   - teclado;
   - foco;
   - contraste.

4. **Plantilla de pruebas manuales**
   - prueba;
   - procedimiento;
   - resultado esperado;
   - resultado obtenido;
   - evidencia.

5. **Plantilla de registro de uso de IA**
   - objetivo;
   - prompt;
   - respuesta aprovechada;
   - cambios realizados;
   - validación;
   - aprendizaje.

Estos documentos pueden entregarse como PDF o como páginas de consulta dentro de la plataforma. Su propósito es ahorrar tiempo y orientar la práctica, no duplicar el contenido del módulo.

---

# 36. Glosario

**Template:** archivo que define la presentación de una respuesta HTML.

**Django Template Language (DTL):** lenguaje de plantillas integrado en Django.

**Contexto:** diccionario de datos que una vista envía a un template.

**Variable:** dato mostrado mediante `{{ }}`.

**Etiqueta:** instrucción de template escrita con `{% %}`.

**Filtro:** transformación de presentación aplicada a una variable.

**Herencia:** mecanismo mediante el cual un template hijo reutiliza una plantilla base.

**Bloque:** área reemplazable definida con `{% block %}`.

**Include:** inserción de un fragmento reutilizable dentro de otro template.

**Namespace:** prefijo que evita conflictos entre nombres de rutas de diferentes aplicaciones.

**Archivo estático:** recurso que no se genera dinámicamente, como CSS, JavaScript o una imagen.

**CDN:** red que distribuye archivos desde servidores externos.

**Framework CSS:** conjunto de estilos y componentes reutilizables para interfaces.

**Responsive design:** diseño que se adapta a diferentes tamaños y condiciones de pantalla.

**Mobile first:** estrategia que empieza por la experiencia de pantallas pequeñas y la amplía progresivamente.

**Breakpoint:** ancho a partir del cual cambia una regla responsive.

**Grid:** sistema de filas y columnas para organizar contenido.

**Semántica:** significado estructural de los elementos HTML.

**Accesibilidad:** capacidad de una interfaz para ser utilizada por personas con distintas necesidades y tecnologías de apoyo.

**Foco:** indicador del elemento interactivo seleccionado durante la navegación con teclado.

**Estado vacío:** interfaz mostrada cuando una colección no contiene datos.

**Autoescape:** protección que evita interpretar automáticamente ciertos caracteres de una variable como HTML.

**Componente:** fragmento visual reutilizable con una responsabilidad definida.

---

# 37. Resumen del módulo

En este módulo transformaste páginas aisladas en una interfaz Django organizada.

Aprendiste a:

- diferenciar la preparación de datos de su presentación;
- usar variables, filtros, condiciones y ciclos de DTL;
- manejar colecciones vacías;
- crear una plantilla base;
- extenderla mediante bloques;
- extraer componentes con `include`;
- generar enlaces resistentes con rutas nombradas;
- cargar archivos estáticos;
- utilizar HTML semántico;
- integrar Bootstrap 5.3;
- construir cuadrículas, tarjetas, tablas y navegación responsive;
- complementar Bootstrap con CSS propio;
- aplicar accesibilidad básica;
- conservar el escape automático;
- usar IA como apoyo sometido a validación.

El resultado no es solamente un sitio más atractivo. Es una capa de presentación que puede crecer sin duplicar código y que está preparada para recibir datos persistentes.

---

# 38. Lista de comprobación final

Antes de solicitar la revisión del módulo, confirma:

## Conocimientos

- [ ] Puedo explicar qué hace un template.
- [ ] Comprendo qué información debe preparar una vista.
- [ ] Sé utilizar variables, filtros, condiciones y ciclos.
- [ ] Puedo explicar la diferencia entre herencia e include.
- [ ] Sé generar enlaces mediante nombres de rutas.
- [ ] Comprendo cómo se organizan los archivos estáticos.
- [ ] Puedo explicar el enfoque mobile first.
- [ ] Reconozco prácticas básicas de accesibilidad.

## Implementación

- [ ] Completé los doce ejercicios.
- [ ] Terminé el mini proyecto.
- [ ] Terminé el proyecto principal.
- [ ] Todas las páginas extienden una base.
- [ ] Eliminé el HTML estructural repetido.
- [ ] Probé estados llenos y vacíos.
- [ ] Probé a 375, 768 y 1440 px.
- [ ] Probé la navegación con teclado.
- [ ] Revisé la consola del navegador.
- [ ] Ejecuté la evaluación práctica.

## Entrega

- [ ] El proyecto inicia siguiendo el README.
- [ ] Los archivos tienen nombres claros.
- [ ] No incluí el entorno virtual.
- [ ] Las capturas están ordenadas.
- [ ] Incluí la explicación técnica.
- [ ] Documenté el uso de IA.
- [ ] Generé el archivo comprimido con el nombre solicitado.
- [ ] Envié todo en el único punto de entrega.

---

# 39. Finalización del módulo

El Módulo 2 se considera completado cuando:

- la calificación total es igual o superior a 80;
- el proyecto principal recibe aprobación del instructor;
- todas las condiciones críticas han sido corregidas;
- la entrega puede ejecutarse y revisarse;
- puedes explicar las decisiones principales sin depender de la IA.

Cuando el módulo sea aprobado, estarás preparado para conectar estas interfaces con modelos, relaciones y consultas mediante el ORM de Django.

**No avances al Módulo 3 hasta recibir la aprobación del proyecto.**
