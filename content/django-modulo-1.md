# Módulo 1. Django y la arquitectura de una aplicación web

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 5 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Versión utilizada:** Django 5.2 LTS  
**Proyecto del módulo:** Portal de Operaciones COA

---

# Introducción

Hasta este momento has desarrollado programas que se ejecutan directamente en una computadora. Esos programas pueden mostrar menús, leer archivos, trabajar con bases de datos, automatizar procesos y administrar información.

En una aplicación web, la lógica sigue escribiéndose con Python, pero cambia la forma en que las personas utilizan el programa.

La interfaz ya no aparece en una terminal o ventana de escritorio. Ahora aparece en un navegador.

```text
Aplicación de escritorio

Usuario
   ↓
Programa instalado
   ↓
Lógica de Python
   ↓
Archivos o base de datos
```

```text
Aplicación web

Usuario
   ↓
Navegador
   ↓
Solicitud HTTP
   ↓
Servidor Django
   ↓
Lógica de Python
   ↓
Base de datos
   ↓
Respuesta HTML
   ↓
Navegador
```

Django será el puente entre los conocimientos adquiridos durante la Ruta Python y el desarrollo de aplicaciones web profesionales.

En este primer módulo no se utilizarán todavía modelos, formularios ni operaciones de base de datos. Antes de trabajar con esas herramientas es indispensable comprender:

- cómo llega una solicitud al servidor;
- cómo Django decide qué código ejecutar;
- qué diferencia existe entre un proyecto y una aplicación;
- cómo una URL se conecta con una vista;
- cómo una vista produce una respuesta;
- cómo Python envía información hacia una página HTML.

El objetivo no es memorizar comandos. El objetivo es comprender el recorrido completo de una solicitud web.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- explicar cómo se comunica un navegador con un servidor;
- diferenciar una aplicación web de una aplicación de escritorio;
- comprender la función de Django dentro de una aplicación;
- crear y configurar un entorno virtual;
- instalar una versión compatible de Django;
- crear un proyecto Django;
- interpretar la estructura generada por el framework;
- diferenciar un proyecto de una aplicación;
- crear y registrar aplicaciones;
- comprender la arquitectura MVT;
- crear rutas generales y rutas por aplicación;
- utilizar `path()` e `include()`;
- desarrollar vistas basadas en funciones;
- devolver respuestas mediante `HttpResponse`;
- renderizar páginas mediante `render()`;
- enviar información desde Python hacia un template;
- recibir parámetros dinámicos desde una URL;
- utilizar nombres y espacios de nombres en las rutas;
- reconocer errores comunes de configuración;
- organizar el proyecto con Git;
- utilizar Inteligencia Artificial para analizar y depurar código sin depender de ella.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Conceptos y laboratorio guiado | 2 horas |
| Ejercicios individuales | 45 minutos |
| Mini proyecto | 40 minutos |
| Proyecto del módulo | 1 hora y 10 minutos |
| Evaluación y revisión final | 25 minutos |
| **Total estimado** | **5 horas** |

La duración es una referencia, no un límite. Si necesitas repetir un ejercicio o reconstruir una parte del proyecto, hazlo antes de continuar.

---

# 1. ¿Qué sucede cuando visitas una página web?

Cuando escribes una dirección en el navegador, el navegador realiza una solicitud a otro programa que se encuentra preparado para recibirla.

Ese otro programa se llama servidor.

Por ejemplo, al visitar:

```text
http://127.0.0.1:8000/servicios/
```

el navegador solicita el recurso `/servicios/`.

Django recibe esa solicitud, busca una ruta coincidente, ejecuta una vista y devuelve una respuesta.

```text
1. El usuario escribe una dirección.
2. El navegador envía una solicitud.
3. Django compara la dirección con sus rutas.
4. Django encuentra una vista.
5. La vista ejecuta lógica de Python.
6. La vista construye una respuesta.
7. El servidor devuelve la respuesta.
8. El navegador muestra el resultado.
```

## Analogía: la recepción de una empresa

Imagina una empresa con una recepción.

Una persona llega y dice:

> Necesito hablar con el departamento de ventas.

La recepción consulta el directorio interno y envía a la persona al departamento correspondiente.

En Django:

| Empresa | Django |
|---|---|
| Persona que llega | Solicitud del navegador |
| Solicitud realizada | URL visitada |
| Directorio interno | Archivo `urls.py` |
| Departamento | Vista |
| Trabajo realizado | Lógica de Python |
| Documento entregado | Respuesta HTTP |
| Persona recibe el resultado | Navegador muestra la página |

El archivo `urls.py` no desarrolla la solución. Su trabajo principal consiste en decidir qué vista debe atender cada dirección.

---

# 2. Cliente, servidor, solicitud y respuesta

## Cliente

El cliente es el programa que solicita información.

En la mayoría de los casos será un navegador como:

- Google Chrome;
- Mozilla Firefox;
- Microsoft Edge;
- Safari.

También podría ser una aplicación móvil, otro servidor o una herramienta de pruebas.

## Servidor

El servidor es el programa que recibe solicitudes y genera respuestas.

Durante el desarrollo, Django proporciona un servidor ligero para probar la aplicación:

```powershell
python manage.py runserver
```

Este servidor es únicamente para desarrollo. No debe utilizarse para publicar una aplicación real en producción.

## Solicitud HTTP

Una solicitud HTTP contiene información como:

- dirección solicitada;
- método utilizado;
- parámetros;
- encabezados;
- cookies;
- datos enviados;
- información de sesión.

En Django, una vista recibe la solicitud mediante un objeto llamado normalmente `request`.

```python
def inicio(request):
    ...
```

`request` no es una palabra reservada de Python. Es el nombre convencional utilizado para representar la solicitud recibida.

## Respuesta HTTP

La vista debe devolver una respuesta.

La respuesta puede contener:

- texto;
- HTML;
- JSON;
- un archivo;
- una redirección;
- un código de error.

En este módulo se trabajará principalmente con texto y HTML.

```python
from django.http import HttpResponse


def inicio(request):
    return HttpResponse("El servidor funciona correctamente.")
```

## Métodos HTTP

Los métodos más frecuentes son:

| Método | Propósito habitual |
|---|---|
| `GET` | Solicitar o consultar información |
| `POST` | Enviar información |
| `PUT` | Sustituir información |
| `PATCH` | Modificar parcialmente información |
| `DELETE` | Eliminar información |

En este módulo se utilizará principalmente `GET`. Los formularios y las operaciones `POST` se estudiarán posteriormente.

## Códigos de estado

Toda respuesta HTTP incluye un código de estado.

| Código | Significado |
|---:|---|
| 200 | La solicitud se procesó correctamente |
| 301 o 302 | La solicitud fue redirigida |
| 400 | La solicitud es incorrecta |
| 403 | No existe permiso para acceder |
| 404 | El recurso no fue encontrado |
| 500 | Ocurrió un error interno en el servidor |

No todos los errores significan lo mismo. Una aplicación profesional debe distinguir entre un recurso inexistente, un acceso prohibido y un fallo interno.

---

# 3. ¿Qué es Django?

Django es un framework de desarrollo web escrito en Python.

Un framework proporciona una estructura, herramientas y convenciones para resolver problemas frecuentes sin tener que construir todo desde cero.

Django incluye, entre otras cosas:

- sistema de rutas;
- vistas;
- templates;
- formularios;
- validaciones;
- ORM;
- migraciones;
- autenticación;
- permisos;
- panel administrativo;
- protección contra vulnerabilidades comunes;
- herramientas de pruebas;
- comandos para administrar el proyecto.

## Analogía: construir una casa

Python es comparable con los conocimientos de construcción.

Django es comparable con un sistema que proporciona:

- planos iniciales;
- normas de organización;
- herramientas;
- componentes reutilizables;
- procedimientos de seguridad.

El framework no construye la aplicación por sí mismo. El desarrollador todavía debe:

- comprender el problema;
- diseñar la solución;
- organizar el código;
- validar la información;
- tomar decisiones;
- probar los resultados.

## ¿Por qué no construir todo con Python puro?

Sería posible crear un servidor utilizando herramientas más básicas de Python, pero habría que desarrollar manualmente muchas funciones que Django ya resuelve.

Por ejemplo:

- interpretar solicitudes;
- relacionar URLs con funciones;
- manejar sesiones;
- validar formularios;
- proteger contraseñas;
- trabajar con bases de datos;
- prevenir ataques comunes;
- generar respuestas;
- administrar usuarios.

Utilizar Django permite concentrarse en el problema empresarial, sin reconstruir constantemente la infraestructura básica de una aplicación web.

---

# 4. Arquitectura MVT

Django organiza las aplicaciones principalmente mediante el patrón MVT:

```text
Model – View – Template
Modelo – Vista – Plantilla
```

## Modelo

Representa los datos y las reglas relacionadas con esos datos.

Ejemplos:

- cliente;
- producto;
- venta;
- categoría;
- proveedor.

Los modelos se estudiarán en el Módulo 3.

## Vista

Recibe una solicitud, ejecuta la lógica necesaria y produce una respuesta.

Una vista puede:

- consultar información;
- validar permisos;
- realizar cálculos;
- preparar datos;
- seleccionar un template;
- devolver una respuesta.

En Django, la vista cumple una función similar a la de un controlador en otros frameworks.

## Template

Es la presentación que finalmente recibirá el navegador.

Generalmente contiene HTML y marcadores que Django sustituye con información dinámica.

## El enrutador de URLs

Aunque no forma parte de las tres letras de MVT, el sistema de URLs es esencial.

Su trabajo consiste en conectar una dirección con una vista.

```text
Navegador
    ↓
URL
    ↓
Vista
    ↓
Modelo o datos
    ↓
Template
    ↓
Respuesta HTML
```

Durante este módulo todavía no se utilizará el modelo:

```text
Navegador
    ↓
URL
    ↓
Vista
    ↓
Datos temporales de Python
    ↓
Template
    ↓
Respuesta HTML
```

## Ejemplo conceptual

Una persona visita:

```text
/productos/15/
```

Django podría realizar el siguiente proceso:

1. Identificar que la dirección corresponde a un detalle de producto.
2. Extraer el número `15`.
3. Ejecutar la vista de detalle.
4. Buscar el producto número 15.
5. Enviar el producto a un template.
6. Generar HTML.
7. Devolver el resultado al navegador.

En este módulo se simulará ese proceso mediante diccionarios de Python. En módulos posteriores, los datos procederán de la base de datos.

---

# 5. Preparación del entorno

## Requisitos

Antes de comenzar, verifica que cuentas con:

- Python 3.10 o posterior;
- Visual Studio Code, PyCharm o un editor equivalente;
- terminal;
- Git;
- navegador web;
- conexión a Internet para consultar documentación.

Comprueba Python:

```powershell
python --version
```

En algunos equipos con Windows puede ser necesario utilizar:

```powershell
py --version
```

Comprueba Git:

```powershell
git --version
```

## ¿Por qué utilizar un entorno virtual?

Un entorno virtual mantiene separadas las dependencias de cada proyecto.

Imagina dos aplicaciones:

```text
Proyecto A → Django 5.2
Proyecto B → Otra versión de Django
```

Sin entornos virtuales, ambas aplicaciones podrían competir por una misma instalación.

Con entornos virtuales:

```text
Proyecto A
└── .venv
    └── dependencias del Proyecto A

Proyecto B
└── .venv
    └── dependencias del Proyecto B
```

Cada proyecto controla sus propias dependencias.

---

# 6. Laboratorio guiado: creación del entorno

## Paso 1. Crear la carpeta del laboratorio

```powershell
mkdir laboratorio_django
cd laboratorio_django
```

## Paso 2. Crear el entorno virtual

```powershell
python -m venv .venv
```

Si el comando `python` no está disponible en Windows:

```powershell
py -m venv .venv
```

## Paso 3. Activar el entorno virtual

### PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

### Símbolo del sistema de Windows

```text
.venv\Scripts\activate.bat
```

### Linux o macOS

```bash
source .venv/bin/activate
```

Cuando el entorno esté activo, la terminal normalmente mostrará:

```text
(.venv)
```

Si PowerShell impide ejecutar el archivo de activación, utiliza el símbolo del sistema de Windows y ejecuta `activate.bat`. No es necesario modificar permanentemente las políticas de seguridad del equipo.

## Paso 4. Actualizar `pip`

```powershell
python -m pip install --upgrade pip
```

## Paso 5. Instalar Django 5.2 LTS

```powershell
python -m pip install "Django>=5.2,<5.3"
```

Este comando permite instalar la actualización más reciente de la serie 5.2, pero evita cambiar automáticamente a Django 6.

## Paso 6. Verificar la instalación

```powershell
python -m django --version
```

El resultado debe comenzar con:

```text
5.2
```

También puedes comprobar la instalación desde Python:

```powershell
python
```

```python
import django

print(django.get_version())
```

Para salir:

```python
exit()
```

## Paso 7. Registrar las dependencias

```powershell
python -m pip freeze > requirements.txt
```

El archivo `requirements.txt` permitirá instalar exactamente las mismas dependencias en otro equipo.

Para reinstalarlas posteriormente:

```powershell
python -m pip install -r requirements.txt
```

---

# 7. Creación del primer proyecto

Ejecuta:

```powershell
python -m django startproject config .
```

El punto final es importante:

```text
.
```

Significa que el proyecto debe crearse dentro de la carpeta actual.

La estructura será similar a esta:

```text
laboratorio_django/
├── .venv/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── requirements.txt
```

## ¿Por qué se utiliza `config`?

La carpeta `config` contiene la configuración general del proyecto.

No representa una función empresarial. Por eso resulta más claro llamarla `config` que utilizar nombres como:

- sistema;
- inventario;
- ventas;
- portal.

Las funciones empresariales se organizarán posteriormente mediante aplicaciones.

---

# 8. El archivo `manage.py`

`manage.py` permite ejecutar tareas administrativas dentro del proyecto.

Algunos comandos que se utilizarán durante el curso son:

```powershell
python manage.py runserver
python manage.py startapp nombre
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py shell
python manage.py test
```

No es necesario memorizar todos los comandos ahora. Es importante comprender que `manage.py` ejecuta las tareas utilizando la configuración del proyecto actual.

---

# 9. Estructura de la configuración

## `settings.py`

Contiene la configuración general.

Entre sus responsabilidades se encuentran:

- aplicaciones instaladas;
- base de datos;
- idioma;
- zona horaria;
- templates;
- archivos estáticos;
- seguridad;
- middleware;
- clave secreta;
- modo de depuración.

No cambies configuraciones que todavía no comprendas. Django genera valores iniciales que permiten ejecutar el proyecto.

## `urls.py`

Contiene las rutas principales.

Puede compararse con el índice general de la aplicación.

## `asgi.py` y `wsgi.py`

Son puntos de entrada utilizados por servidores compatibles con ASGI o WSGI.

No será necesario modificarlos en este módulo.

## `__init__.py`

Indica que la carpeta puede funcionar como un paquete de Python.

---

# 10. Ejecutar el servidor de desarrollo

Ejecuta:

```powershell
python manage.py runserver
```

La terminal mostrará una dirección similar a:

```text
http://127.0.0.1:8000/
```

Abre esa dirección en el navegador.

Si aparece la página de bienvenida de Django, el proyecto funciona.

Para detener el servidor:

```text
Ctrl + C
```

## Advertencia sobre migraciones

Es posible que aparezca un mensaje indicando que existen migraciones pendientes.

No es un error que impida completar este módulo. Las migraciones se estudiarán junto con los modelos y la base de datos.

## Cambiar el puerto

Si el puerto 8000 está ocupado:

```powershell
python manage.py runserver 8001
```

La dirección será:

```text
http://127.0.0.1:8001/
```

---


# 11. Proyecto y aplicación: no son lo mismo

Esta diferencia es fundamental.

## Proyecto

El proyecto representa la aplicación web completa.

Puede contener:

- configuración;
- rutas generales;
- varias aplicaciones;
- conexión con la base de datos;
- archivos generales;
- configuración de despliegue.

## Aplicación

Una aplicación representa una responsabilidad o conjunto de funciones relacionadas.

Un sistema empresarial podría organizarse así:

```text
Proyecto empresarial
├── usuarios
├── clientes
├── productos
├── inventario
├── ventas
└── reportes
```

Cada aplicación puede contener:

- vistas;
- modelos;
- rutas;
- templates;
- pruebas;
- administración.

## Analogía: centro comercial

```text
Proyecto Django = centro comercial completo

Aplicaciones:
├── supermercado
├── farmacia
├── restaurante
└── banco
```

El centro comercial contiene y organiza diferentes negocios. Cada negocio tiene una responsabilidad propia.

## Una aplicación no equivale a una página

No es recomendable crear aplicaciones como:

```text
inicio
contacto
acerca_de
```

si todas pertenecen a una misma responsabilidad.

Una aplicación debe representar una función coherente del sistema, no necesariamente una página individual.

---

# 12. Crear la primera aplicación

Detén el servidor si está en ejecución y escribe:

```powershell
python manage.py startapp laboratorio
```

La nueva estructura será:

```text
laboratorio/
├── migrations/
│   └── __init__.py
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
└── views.py
```

## Función inicial de cada archivo

| Archivo | Propósito |
|---|---|
| `admin.py` | Configuración del panel administrativo |
| `apps.py` | Configuración de la aplicación |
| `models.py` | Definición de datos y reglas relacionadas |
| `tests.py` | Pruebas automáticas |
| `views.py` | Vistas que procesan solicitudes |
| `migrations/` | Historial de cambios de la base de datos |

En este módulo se utilizarán principalmente:

- `apps.py`;
- `views.py`;
- un nuevo archivo `urls.py`;
- una nueva carpeta `templates`.

---

# 13. Registrar la aplicación

Crear una aplicación no significa que Django la utilice automáticamente.

Abre:

```text
config/settings.py
```

Busca `INSTALLED_APPS` y agrega:

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "laboratorio.apps.LaboratorioConfig",
]
```

La línea nueva es:

```python
"laboratorio.apps.LaboratorioConfig",
```

Después ejecuta:

```powershell
python manage.py check
```

Si aparece:

```text
System check identified no issues
```

la configuración es válida.

---

# 14. Primera vista con `HttpResponse`

Abre:

```text
laboratorio/views.py
```

Escribe:

```python
from django.http import HttpRequest, HttpResponse


def inicio(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Laboratorio Django funcionando.")
```

## Análisis de la vista

```python
def inicio(request: HttpRequest) -> HttpResponse:
```

La función:

- se llama `inicio`;
- recibe una solicitud;
- espera un objeto `HttpRequest`;
- devuelve un objeto `HttpResponse`.

```python
return HttpResponse("Laboratorio Django funcionando.")
```

La respuesta contiene texto y utiliza de manera predeterminada el código HTTP 200.

La vista todavía no se puede visitar. Falta crear una ruta.

---

# 15. Crear las rutas de la aplicación

Django no genera automáticamente `urls.py` dentro de una aplicación.

Crea:

```text
laboratorio/urls.py
```

Agrega:

```python
from django.urls import path

from . import views

app_name = "laboratorio"

urlpatterns = [
    path("", views.inicio, name="inicio"),
]
```

## ¿Qué significa cada parte?

```python
from django.urls import path
```

Importa la función utilizada para declarar rutas.

```python
from . import views
```

Importa las vistas de la aplicación actual.

```python
app_name = "laboratorio"
```

Define un espacio de nombres.

Esto permite diferenciar rutas con nombres similares que pertenecen a distintas aplicaciones.

```python
urlpatterns = [
    path("", views.inicio, name="inicio"),
]
```

La ruta vacía representa la dirección base asignada a la aplicación.

`views.inicio` indica qué vista debe ejecutarse.

`name="inicio"` permite identificar la ruta por un nombre estable.

---

# 16. Conectar las rutas con el proyecto

Abre:

```text
config/urls.py
```

Modifica el archivo:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("laboratorio.urls")),
]
```

Ahora el proyecto indica:

```text
Para cualquier ruta que comience desde la raíz,
consulta las rutas de laboratorio.
```

Ejecuta:

```powershell
python manage.py runserver
```

Visita:

```text
http://127.0.0.1:8000/
```

El navegador debe mostrar:

```text
Laboratorio Django funcionando.
```

---

# 17. Recorrido completo de la solicitud

Cuando visitas la página principal ocurre lo siguiente:

```text
GET /
  ↓
config/urls.py
  ↓
include("laboratorio.urls")
  ↓
laboratorio/urls.py
  ↓
views.inicio
  ↓
HttpResponse
  ↓
Código 200
  ↓
Navegador
```

## Pregunta de comprensión

¿Qué sucedería si la vista existiera, pero no estuviera conectada con una ruta?

La función permanecería en el proyecto, pero el navegador no tendría ninguna dirección mediante la cual solicitarla.

## Segunda pregunta

¿Qué sucedería si la ruta indicara `views.inicio`, pero esa función no existiera?

Django no podría importar la vista y mostraría un error durante la carga del proyecto.

---

# 18. Crear varias rutas

Modifica `laboratorio/views.py`:

```python
from django.http import HttpRequest, HttpResponse


def inicio(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Laboratorio Django funcionando.")


def estado(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Estado del sistema: disponible.")


def contacto(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Contacto: soporte@coa.example")
```

Modifica `laboratorio/urls.py`:

```python
from django.urls import path

from . import views

app_name = "laboratorio"

urlpatterns = [
    path("", views.inicio, name="inicio"),
    path("estado/", views.estado, name="estado"),
    path("contacto/", views.contacto, name="contacto"),
]
```

Prueba:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/estado/
http://127.0.0.1:8000/contacto/
```

## La barra final

Django utiliza normalmente rutas que terminan con `/`:

```text
/estado/
```

Mantener esta convención produce direcciones consistentes.

---

# 19. Rutas dinámicas

Una ruta dinámica contiene un valor que puede cambiar.

Agrega esta vista:

```python
def saludar(request: HttpRequest, nombre: str) -> HttpResponse:
    mensaje = f"Bienvenido al portal, {nombre}."
    return HttpResponse(mensaje)
```

Agrega la ruta:

```python
path("saludar/<str:nombre>/", views.saludar, name="saludar"),
```

Prueba:

```text
http://127.0.0.1:8000/saludar/Ana/
http://127.0.0.1:8000/saludar/Carlos/
http://127.0.0.1:8000/saludar/María/
```

Django extrae el valor y lo entrega a la vista.

```text
/saludar/Ana/
          ↓
nombre = "Ana"
          ↓
views.saludar(request, nombre="Ana")
```

## Convertidores frecuentes

| Convertidor | Ejemplo | Resultado |
|---|---|---|
| `str` | `<str:nombre>` | Texto sin `/` |
| `int` | `<int:id>` | Número entero positivo |
| `slug` | `<slug:codigo>` | Texto para direcciones legibles |
| `uuid` | `<uuid:identificador>` | Identificador UUID |
| `path` | `<path:ruta>` | Texto que puede incluir `/` |

## Ejemplo con número

```python
def servicio(request: HttpRequest, servicio_id: int) -> HttpResponse:
    return HttpResponse(f"Consultando el servicio {servicio_id}.")
```

```python
path(
    "servicios/<int:servicio_id>/",
    views.servicio,
    name="servicio",
),
```

Si visitas:

```text
/servicios/15/
```

Django ejecutará:

```python
servicio(request, servicio_id=15)
```

Si visitas:

```text
/servicios/abc/
```

la ruta no coincidirá porque `abc` no es un número entero. Django devolverá un error 404.

---

# 20. Inspeccionar la solicitud

El objeto `request` contiene información útil.

Crea:

```python
def informacion_solicitud(request: HttpRequest) -> HttpResponse:
    contenido = (
        f"Método: {request.method}<br>"
        f"Ruta: {request.path}<br>"
        f"Ruta completa: {request.get_full_path()}"
    )
    return HttpResponse(contenido)
```

Agrega:

```python
path(
    "solicitud/",
    views.informacion_solicitud,
    name="informacion_solicitud",
),
```

Visita:

```text
http://127.0.0.1:8000/solicitud/?origen=curso
```

El resultado será similar a:

```text
Método: GET
Ruta: /solicitud/
Ruta completa: /solicitud/?origen=curso
```

No es necesario memorizar todos los atributos de `request`. Aprende a consultar la documentación cuando necesites información específica.

---

# 21. Devolver HTML con `HttpResponse`

Una respuesta puede contener HTML:

```python
def presentacion(request: HttpRequest) -> HttpResponse:
    contenido = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Presentación</title>
    </head>
    <body>
        <h1>Primera página con Django</h1>
        <p>Esta respuesta contiene HTML.</p>
    </body>
    </html>
    """
    return HttpResponse(contenido)
```

Esto funciona, pero no es una buena organización.

Mezclar una página completa dentro de una función produce varios problemas:

- la vista se vuelve difícil de leer;
- Python y HTML quedan mezclados;
- el diseño no puede reutilizarse fácilmente;
- modificar la interfaz se vuelve incómodo;
- aumenta la duplicación.

La solución es utilizar templates.

---

# 22. Crear el primer template

Dentro de la aplicación crea esta estructura:

```text
laboratorio/
└── templates/
    └── laboratorio/
        └── presentacion.html
```

Se repite el nombre `laboratorio` para evitar conflictos con templates de otras aplicaciones.

La ruta completa será:

```text
laboratorio/templates/laboratorio/presentacion.html
```

Contenido:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentación</title>
</head>
<body>
    <header>
        <h1>Primera página con Django</h1>
    </header>

    <main>
        <p>Este contenido se encuentra en un template.</p>
    </main>
</body>
</html>
```

Modifica la vista:

```python
from django.shortcuts import render


def presentacion(request: HttpRequest) -> HttpResponse:
    return render(request, "laboratorio/presentacion.html")
```

La función `render()`:

1. busca el template;
2. procesa su contenido;
3. crea una respuesta HTTP;
4. devuelve la respuesta.

---

# 23. Enviar datos al template

Una página empresarial necesita mostrar información producida por Python.

Modifica la vista:

```python
def presentacion(request: HttpRequest) -> HttpResponse:
    contexto = {
        "empresa": "COA",
        "descripcion": "Cursos Online Avanzados",
        "estado": "Disponible",
    }

    return render(
        request,
        "laboratorio/presentacion.html",
        contexto,
    )
```

Modifica el template:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ empresa }}</title>
</head>
<body>
    <header>
        <h1>{{ empresa }}</h1>
    </header>

    <main>
        <p>{{ descripcion }}</p>
        <p>Estado actual: {{ estado }}</p>
    </main>
</body>
</html>
```

## El contexto

El contexto es un diccionario.

```python
contexto = {
    "empresa": "COA",
    "descripcion": "Cursos Online Avanzados",
    "estado": "Disponible",
}
```

Las claves se convierten en nombres disponibles dentro del template:

```html
{{ empresa }}
{{ descripcion }}
{{ estado }}
```

El template no conoce directamente las variables internas de Python. Solo recibe aquello que la vista incluye en el contexto.

## Regla profesional

Envía al template únicamente la información que necesita para mostrar la página.

No envíes datos sensibles, objetos innecesarios ni información privada.

---

# 24. Flujo de `render()`

```text
Navegador solicita /presentacion/
              ↓
urls.py encuentra la ruta
              ↓
Django ejecuta views.presentacion
              ↓
La vista prepara el contexto
              ↓
render() busca presentacion.html
              ↓
Django combina template + contexto
              ↓
Se genera una respuesta HTML
              ↓
El navegador muestra la página
```

Código resumido:

```python
def presentacion(request):
    contexto = {"empresa": "COA"}

    return render(
        request,
        "laboratorio/presentacion.html",
        contexto,
    )
```

---

# 25. Introducción a los nombres de rutas

Una dirección puede cambiar.

Por ejemplo:

```text
/contacto/
```

podría cambiar a:

```text
/soporte/contacto/
```

Si el HTML contiene la dirección escrita manualmente en muchos lugares, será necesario modificarla en todos.

Django permite referirse a una ruta mediante su nombre.

Ruta:

```python
path("contacto/", views.contacto, name="contacto"),
```

Enlace desde un template:

```html
<a href="{% url 'laboratorio:contacto' %}">
    Contacto
</a>
```

La parte:

```text
laboratorio
```

corresponde a:

```python
app_name = "laboratorio"
```

La parte:

```text
contacto
```

corresponde a:

```python
name="contacto"
```

## Ruta con parámetro

```python
path(
    "servicios/<int:servicio_id>/",
    views.servicio,
    name="servicio",
)
```

En el template:

```html
<a href="{% url 'laboratorio:servicio' 3 %}">
    Ver servicio 3
</a>
```

Django generará:

```text
/servicios/3/
```

---

# 26. Errores 404

Un error 404 significa que el recurso solicitado no fue encontrado.

Puede aparecer porque:

- la ruta no existe;
- el convertidor no acepta el valor;
- el registro solicitado no existe;
- la dirección fue escrita incorrectamente.

## Lanzar un 404 desde una vista

```python
from django.http import Http404


def servicio(request: HttpRequest, servicio_id: int) -> HttpResponse:
    servicios_disponibles = {1, 2, 3}

    if servicio_id not in servicios_disponibles:
        raise Http404("El servicio solicitado no existe.")

    return HttpResponse(f"Servicio encontrado: {servicio_id}")
```

No conviene devolver un código 200 con un mensaje que diga “no encontrado”. Si el recurso no existe, la respuesta correcta es 404.

---

# 27. Página 404 personalizada

Crea:

```text
laboratorio/templates/laboratorio/404.html
```

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página no encontrada</title>
</head>
<body>
    <main>
        <h1>404</h1>
        <p>La página solicitada no existe.</p>
        <a href="{% url 'laboratorio:inicio' %}">
            Volver al inicio
        </a>
    </main>
</body>
</html>
```

Agrega a `laboratorio/views.py`:

```python
def error_404(
    request: HttpRequest,
    exception: Exception,
) -> HttpResponse:
    return render(
        request,
        "laboratorio/404.html",
        status=404,
    )
```

Agrega al final de `config/urls.py`, fuera de `urlpatterns`:

```python
handler404 = "laboratorio.views.error_404"
```

## Importante

La página personalizada se utiliza cuando:

```python
DEBUG = False
```

Para probarla localmente, configura temporalmente:

```python
DEBUG = False

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]
```

Después de comprobarla, puedes restaurar:

```python
DEBUG = True
```

Nunca se debe publicar una aplicación real con `DEBUG = True`.

---

# 28. Organización inicial con Git

Inicializa el repositorio:

```powershell
git init
```

Crea un archivo llamado:

```text
.gitignore
```

Contenido recomendado:

```gitignore
.venv/
__pycache__/
*.py[cod]
*.log
.env
.vscode/
.idea/
db.sqlite3
```

Comprueba el estado:

```powershell
git status
```

Primer registro:

```powershell
git add .
git commit -m "Configurar proyecto inicial de Django"
```

Después de crear la aplicación:

```powershell
git add .
git commit -m "Agregar aplicación laboratorio"
```

Después de crear rutas y vistas:

```powershell
git add .
git commit -m "Implementar rutas y vistas iniciales"
```

Después de agregar templates:

```powershell
git add .
git commit -m "Agregar templates y contexto dinámico"
```

## Buenas prácticas de Git

- Realiza commits pequeños.
- Describe el cambio realizado.
- No subas `.venv`.
- No subas contraseñas.
- No subas archivos `.env`.
- No esperes hasta el final para crear un único commit.
- Revisa `git status` antes de cada commit.
- Mantén el repositorio privado si todavía contiene configuraciones exclusivamente locales.

---

# 29. Uso profesional de Inteligencia Artificial

La IA puede ayudarte a comprender Django, pero no debe tomar todas las decisiones por ti.

## Un mal prompt

```text
Hazme una página en Django.
```

Este prompt no indica:

- versión;
- estructura;
- alcance;
- archivos permitidos;
- conocimientos actuales;
- resultado esperado;
- restricciones.

La IA podría generar modelos, formularios, librerías o configuraciones que todavía no necesitas.

## Un prompt profesional

```text
Estoy trabajando con Django 5.2 LTS.

Mi proyecto contiene una aplicación llamada laboratorio.

Necesito crear una ruta /estado/ conectada con una vista basada
en función. La vista debe devolver un template y enviar un contexto
con el nombre del sistema y su estado.

No utilices modelos, formularios, vistas basadas en clases,
JavaScript ni librerías externas.

Indica:
1. qué archivo debo modificar;
2. el código necesario;
3. cómo funciona cada parte;
4. cómo comprobarlo manualmente.
```

## Prompt para analizar un error

```text
Estoy utilizando Django 5.2 LTS.

Al visitar /contacto/ aparece un error 404.

Estas son mis rutas principales:
[pegar solamente config/urls.py]

Estas son las rutas de la aplicación:
[pegar solamente aplicacion/urls.py]

Analiza el recorrido de la solicitud.
No reescribas todo el proyecto.
Identifica la causa más probable y explica cómo comprobarla.
```

## Prompt para comprender código

```text
Explica el siguiente código de Django línea por línea.

Después, dibuja el recorrido:
URL → vista → contexto → template → respuesta.

No propongas una versión más avanzada hasta terminar la explicación.
```

## Lista de validación para código generado por IA

Antes de utilizar una respuesta, comprueba:

- ¿Corresponde a Django 5.2?
- ¿Utiliza herramientas que ya se estudiaron?
- ¿Indica correctamente el archivo?
- ¿Importa todo lo que utiliza?
- ¿Mantiene las rutas por aplicación?
- ¿Devuelve una respuesta?
- ¿El nombre del template coincide con su ubicación?
- ¿Puedes explicar cada línea?
- ¿Probaste rutas válidas e inválidas?
- ¿La solución aparece también en la documentación oficial?

## Información que no debes compartir

No pegues en una IA pública:

- contraseñas;
- credenciales;
- claves privadas;
- claves de servicios;
- archivos `.env`;
- datos reales de clientes;
- bases de datos empresariales;
- información personal;
- secretos de producción.

---

# 30. Ejercicio guiado completo

## Objetivo

Construir una pequeña aplicación que muestre el estado de diferentes áreas de una empresa.

## Paso 1. Crear la aplicación

```powershell
python manage.py startapp estado_empresa
```

## Paso 2. Registrarla

En `config/settings.py`:

```python
"estado_empresa.apps.EstadoEmpresaConfig",
```

## Paso 3. Crear una vista general

En `estado_empresa/views.py`:

```python
from django.http import Http404, HttpRequest, HttpResponse
from django.shortcuts import render


AREAS = {
    "ventas": {
        "nombre": "Ventas",
        "estado": "Disponible",
    },
    "inventario": {
        "nombre": "Inventario",
        "estado": "Mantenimiento",
    },
    "clientes": {
        "nombre": "Clientes",
        "estado": "Disponible",
    },
}


def inicio(request: HttpRequest) -> HttpResponse:
    contexto = {
        "nombre_sistema": "Centro de Operaciones",
        "cantidad_areas": len(AREAS),
    }

    return render(
        request,
        "estado_empresa/inicio.html",
        contexto,
    )
```

## Paso 4. Crear una vista dinámica

```python
def detalle_area(
    request: HttpRequest,
    codigo: str,
) -> HttpResponse:
    area = AREAS.get(codigo)

    if area is None:
        raise Http404("El área solicitada no existe.")

    contexto = {
        "codigo": codigo,
        "area": area,
    }

    return render(
        request,
        "estado_empresa/detalle_area.html",
        contexto,
    )
```

## Paso 5. Crear rutas

En `estado_empresa/urls.py`:

```python
from django.urls import path

from . import views

app_name = "estado_empresa"

urlpatterns = [
    path("", views.inicio, name="inicio"),
    path(
        "areas/<slug:codigo>/",
        views.detalle_area,
        name="detalle_area",
    ),
]
```

## Paso 6. Conectar la aplicación

En `config/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "estado/",
        include("estado_empresa.urls"),
    ),
]
```

## Paso 7. Crear templates

Estructura:

```text
estado_empresa/
└── templates/
    └── estado_empresa/
        ├── inicio.html
        └── detalle_area.html
```

`inicio.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ nombre_sistema }}</title>
</head>
<body>
    <main>
        <h1>{{ nombre_sistema }}</h1>
        <p>Áreas registradas: {{ cantidad_areas }}</p>

        <nav>
            <a href="{% url 'estado_empresa:detalle_area' 'ventas' %}">
                Ventas
            </a>

            <a href="{% url 'estado_empresa:detalle_area' 'inventario' %}">
                Inventario
            </a>

            <a href="{% url 'estado_empresa:detalle_area' 'clientes' %}">
                Clientes
            </a>
        </nav>
    </main>
</body>
</html>
```

`detalle_area.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ area.nombre }}</title>
</head>
<body>
    <main>
        <h1>{{ area.nombre }}</h1>
        <p>Código: {{ codigo }}</p>
        <p>Estado: {{ area.estado }}</p>

        <a href="{% url 'estado_empresa:inicio' %}">
            Volver al inicio
        </a>
    </main>
</body>
</html>
```

## Paso 8. Probar

Visita:

```text
http://127.0.0.1:8000/estado/
http://127.0.0.1:8000/estado/areas/ventas/
http://127.0.0.1:8000/estado/areas/inventario/
http://127.0.0.1:8000/estado/areas/clientes/
http://127.0.0.1:8000/estado/areas/desconocida/
```

La última dirección debe producir un error 404.

## Paso 9. Explicar el recorrido

Para:

```text
/estado/areas/ventas/
```

el recorrido es:

```text
config/urls.py
    ↓
include("estado_empresa.urls")
    ↓
estado_empresa/urls.py
    ↓
codigo = "ventas"
    ↓
views.detalle_area
    ↓
AREAS.get("ventas")
    ↓
contexto
    ↓
detalle_area.html
    ↓
respuesta HTML
```

---

# 31. Ejercicios individuales obligatorios

## Ejercicio 1. Primera respuesta

Crea una ruta llamada `/bienvenida/` que muestre mediante `HttpResponse`:

```text
Bienvenido al curso profesional de Django.
```

La ruta debe tener el nombre `bienvenida`.

---

## Ejercicio 2. Información de la solicitud

Crea una ruta `/diagnostico/` que muestre:

- método HTTP;
- ruta solicitada;
- dirección completa;
- nombre de la aplicación.

La información debe obtenerse desde el objeto `request` cuando corresponda.

---

## Ejercicio 3. Ruta dinámica para empleados

Crea una ruta con la siguiente estructura:

```text
/empleados/25/
```

El número debe recibirse como entero.

La respuesta debe mostrar:

```text
Consultando el empleado número 25.
```

Prueba también:

```text
/empleados/abc/
```

Explica por qué la segunda dirección produce un 404.

---

## Ejercicio 4. Ruta con código legible

Crea:

```text
/departamentos/recursos-humanos/
```

La vista debe recibir `recursos-humanos` mediante un convertidor `slug` y mostrarlo en la respuesta.

Prueba con al menos tres departamentos.

---

## Ejercicio 5. Separación de rutas

Crea una aplicación llamada `soporte`.

La aplicación debe tener sus propias rutas:

```text
/soporte/
/soporte/estado/
/soporte/contacto/
```

No declares estas vistas directamente en `config/urls.py`. Utiliza `include()`.

---

## Ejercicio 6. Namespaces

Crea una ruta llamada `inicio` dentro de dos aplicaciones diferentes.

Después, genera enlaces hacia ambas utilizando su espacio de nombres.

Explica por qué el namespace evita una ambigüedad.

---

## Ejercicio 7. Contexto

Crea un template que muestre:

- nombre de una empresa;
- año de fundación;
- cantidad de empleados;
- estado del sistema.

Los datos deben originarse en un diccionario de contexto dentro de la vista.

No escribas esos valores directamente en el HTML.

---

## Ejercicio 8. Recurso inexistente

Crea una colección de tres códigos válidos:

```python
codigos_validos = {
    "web",
    "software",
    "datos",
}
```

Crea una ruta dinámica que reciba un código.

Si el código existe, debe mostrar una respuesta 200.

Si no existe, debe lanzar `Http404`.

Prueba al menos dos casos válidos y dos inválidos.

---

## Ejercicio 9. Corrección de rutas

Analiza este código:

```python
urlpatterns = [
    path("clientes/<int:cliente_id>/", views.cliente),
]
```

La vista fue escrita así:

```python
def cliente(request, id):
    return HttpResponse(f"Cliente: {id}")
```

Ejecuta el ejemplo, identifica el error y corrígelo sin cambiar la URL requerida.

Explica por qué los nombres deben coincidir.

---

## Ejercicio 10. Corrección de `include()`

El proyecto contiene:

```python
path("inventario/", include("productos.urls")),
```

Dentro de `productos/urls.py` existe:

```python
path("lista/", views.lista_productos, name="lista"),
```

Responde:

1. ¿Cuál es la dirección completa?
2. ¿Qué dirección produciría un 404?
3. ¿Qué parte resuelve `config/urls.py`?
4. ¿Qué parte resuelve `productos/urls.py`?

Comprueba las respuestas en el navegador.

---

## Ejercicio 11. Template no encontrado

Crea intencionalmente una vista que solicite:

```python
return render(request, "clientes/listado.html")
```

Coloca inicialmente el archivo en una ubicación incorrecta.

Observa el error, identifica las rutas que Django intentó revisar y mueve el template a la ubicación correcta.

Entrega una captura del error y otra del resultado corregido.

---

## Ejercicio 12. Cambio de dirección sin cambiar enlaces

Crea una ruta con:

```python
name="contacto"
```

Utiliza `{% url %}` para generar el enlace.

Después cambia la dirección:

```text
/contacto/
```

por:

```text
/ayuda/contacto/
```

No modifiques el enlace del template.

Comprueba que continúa funcionando y explica por qué.

---

# 32. Retos adicionales

Los siguientes retos son opcionales y no forman parte de las cinco horas obligatorias.

## Reto 1. Modo de mantenimiento

Crea una ruta dinámica:

```text
/sistemas/<slug:nombre>/
```

La vista debe consultar un diccionario de sistemas.

Cada sistema tendrá:

- nombre;
- estado;
- responsable;
- hora estimada de recuperación.

Si el sistema no existe, debe producir un 404.

---

## Reto 2. Parámetros de consulta

Crea una ruta:

```text
/buscar/?texto=django
```

Obtén el valor con:

```python
request.GET.get("texto")
```

Muestra un mensaje diferente si el parámetro:

- existe;
- está vacío;
- no fue enviado.

No utilices todavía formularios de Django.

---

## Reto 3. Respuestas con estados diferentes

Crea tres rutas:

```text
/respuestas/correcta/
/respuestas/incorrecta/
/respuestas/no-disponible/
```

Devuelve códigos:

- 200;
- 400;
- 503.

Investiga cómo enviar el código mediante `HttpResponse`.

Comprueba el resultado desde las herramientas de desarrollo del navegador.

---

## Reto 4. Segunda aplicación independiente

Crea una aplicación `notificaciones`.

Debe contener sus propias rutas y vistas.

Monta la aplicación bajo:

```text
/notificaciones/
```

Después cambia el prefijo a:

```text
/centro-mensajes/
```

sin modificar el archivo `notificaciones/urls.py`.

Explica qué ventaja ofrece esta independencia.

---

# 33. Mini proyecto

# Directorio Dinámico de Servicios

## Situación

Una pequeña empresa ofrece varios servicios y necesita un portal sencillo para consultarlos.

Todavía no se utilizará una base de datos. La información estará almacenada temporalmente en estructuras de Python.

## Requisitos funcionales

El sistema debe tener:

1. Página principal.
2. Página general de servicios.
3. Página individual para cada servicio.
4. Página de contacto.
5. Al menos cinco servicios.
6. Rutas dinámicas mediante identificadores enteros o slugs.
7. Manejo 404 cuando el servicio no exista.
8. Navegación entre páginas.
9. Información enviada mediante contexto.
10. Templates separados de las vistas.

Cada servicio debe contener:

- identificador;
- nombre;
- descripción;
- precio de referencia;
- disponibilidad.

## Rutas mínimas

```text
/
/servicios/
/servicios/1/
/servicios/2/
/contacto/
```

## Restricciones

No utilices:

- modelos;
- base de datos;
- formularios de Django;
- Bootstrap;
- JavaScript;
- vistas basadas en clases;
- librerías externas.

## Evidencias

Guarda capturas de:

- página principal;
- listado;
- dos detalles;
- contacto;
- servicio inexistente.

## Criterios de aprobación

El mini proyecto debe:

- iniciar sin errores;
- mantener las rutas dentro de la aplicación;
- utilizar `include()`;
- utilizar nombres de rutas;
- recibir parámetros dinámicos;
- utilizar templates;
- manejar recursos inexistentes;
- mantener Python separado del HTML.

---

<!-- coa-activity:django-m1-mini-proyecto -->

# 34. Proyecto del módulo

# Portal de Operaciones COA

## Situación empresarial

COA necesita un portal inicial para mostrar el estado de sus servicios y áreas operativas.

El portal será la primera versión de una futura aplicación empresarial. En este módulo se construirá únicamente la arquitectura inicial.

Los datos se almacenarán temporalmente mediante estructuras de Python. La base de datos se incorporará en módulos posteriores.

## Objetivo

Construir una aplicación Django organizada que demuestre el recorrido completo:

```text
URL → vista → datos → contexto → template → respuesta
```

## Estructura esperada

```text
portal_operaciones_coa/
├── config/
├── portal/
│   ├── templates/
│   │   └── portal/
│   ├── urls.py
│   ├── views.py
│   └── datos.py
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

## Información empresarial

El portal debe trabajar con al menos seis servicios.

Cada servicio debe contener:

- identificador;
- nombre;
- descripción;
- categoría;
- responsable;
- estado;
- horario;
- correo de contacto.

Los estados permitidos serán:

- Disponible.
- Mantenimiento.
- No disponible.

## Páginas obligatorias

### 1. Página principal

Debe mostrar:

- nombre del portal;
- descripción;
- cantidad de servicios;
- cantidad de servicios disponibles;
- enlaces hacia las demás páginas.

Ruta:

```text
/
```

### 2. Listado de servicios

Debe mostrar todos los servicios y permitir abrir el detalle de cada uno.

Ruta:

```text
/servicios/
```

### 3. Detalle de servicio

Debe recibir un identificador dinámico.

Ruta:

```text
/servicios/<int:servicio_id>/
```

Debe mostrar:

- nombre;
- descripción;
- categoría;
- responsable;
- estado;
- horario;
- contacto.

Si el identificador no existe, debe devolver 404.

### 4. Página de áreas

Debe mostrar al menos tres áreas:

- tecnología;
- atención;
- administración.

Ruta:

```text
/areas/
```

### 5. Detalle de área

Debe utilizar un `slug`.

Ejemplo:

```text
/areas/tecnologia/
```

### 6. Página de contacto

Debe mostrar:

- correo;
- horario;
- medio de soporte.

Ruta:

```text
/contacto/
```

### 7. Página 404

Debe incluir:

- código 404;
- mensaje comprensible;
- enlace para volver al inicio.

## Requisitos técnicos

El proyecto debe:

- utilizar Django 5.2;
- utilizar un entorno virtual;
- incluir `requirements.txt`;
- utilizar una aplicación llamada `portal`;
- registrar correctamente la aplicación;
- mantener rutas generales y rutas de aplicación separadas;
- utilizar `include()`;
- utilizar `app_name`;
- asignar un nombre a cada ruta;
- utilizar vistas basadas en funciones;
- utilizar `HttpResponse` al menos una vez;
- utilizar `render()` en las páginas principales;
- enviar información mediante contexto;
- recibir parámetros `int` y `slug`;
- utilizar `Http404`;
- incluir templates organizados por aplicación;
- incluir un archivo independiente para los datos;
- incluir `.gitignore`;
- incluir varios commits;
- incluir un README.

## Archivo de datos

La información no debe quedar mezclada con las vistas.

Puede organizarse en:

```text
portal/datos.py
```

Ejemplo de estructura:

```python
SERVICIOS = {
    1: {
        "id": 1,
        "nombre": "Soporte técnico",
        "descripcion": "Atención de incidencias de la plataforma.",
        "categoria": "Tecnología",
        "responsable": "Equipo de soporte",
        "estado": "Disponible",
        "horario": "Lunes a viernes, 8:00 a. m. a 5:00 p. m.",
        "correo": "soporte@coa.example",
    },
}
```

No copies únicamente este registro. Crea al menos seis servicios coherentes.

## README mínimo

El archivo `README.md` debe incluir:

- nombre del proyecto;
- descripción;
- requisitos;
- instrucciones para crear el entorno;
- instalación de dependencias;
- comando para ejecutar el servidor;
- rutas disponibles;
- estructura general;
- nombre del estudiante;
- explicación del uso de IA.

## Historial de Git

El repositorio debe contener al menos cinco commits significativos.

Ejemplos:

```text
Configurar proyecto Django
Crear aplicación portal
Implementar rutas y vistas
Agregar templates y contexto
Completar manejo de errores
```

No utilices mensajes como:

```text
cambios
prueba
final
arreglo
cosas
```

---

# 35. Pruebas manuales obligatorias

Antes de entregar, completa esta tabla:

| Prueba | Resultado esperado | Completada |
|---|---|---|
| Visitar `/` | Muestra la página principal | ☐ |
| Visitar `/servicios/` | Muestra todos los servicios | ☐ |
| Visitar un servicio válido | Muestra su información | ☐ |
| Visitar un servicio inexistente | Devuelve 404 | ☐ |
| Visitar un área válida | Muestra su detalle | ☐ |
| Visitar un área inexistente | Devuelve 404 | ☐ |
| Abrir contacto | Muestra la información | ☐ |
| Navegar usando enlaces | No produce rutas rotas | ☐ |
| Ejecutar `python manage.py check` | No muestra problemas | ☐ |
| Instalar desde `requirements.txt` | Instala correctamente | ☐ |

No marques una prueba sin ejecutarla.

---

# 36. Rúbrica del proyecto

## Proyecto del módulo: 50 puntos

| Criterio | Puntos |
|---|---:|
| Funcionamiento de todas las páginas | 12 |
| Organización del proyecto y la aplicación | 8 |
| Rutas, `include()`, nombres y namespaces | 8 |
| Vistas, contexto y templates | 8 |
| Parámetros dinámicos y manejo 404 | 5 |
| Calidad y claridad del código | 4 |
| Git, `.gitignore`, dependencias y README | 3 |
| Explicación del uso de IA | 2 |
| **Total** | **50** |

## Condiciones críticas

El proyecto no podrá aprobarse si:

- no inicia;
- faltan rutas obligatorias;
- no utiliza una aplicación;
- todas las rutas se encuentran en `config/urls.py`;
- mezcla páginas completas de HTML dentro de las vistas;
- no utiliza parámetros dinámicos;
- no maneja recursos inexistentes;
- incluye `.venv` en la entrega;
- contiene credenciales reales;
- el estudiante no puede explicar el recorrido de una solicitud;
- el código depende de herramientas no estudiadas;
- el proyecto es una copia sin adaptación ni comprensión.

---

# 37. Evaluación práctica del módulo

**Valor:** 15 puntos  
**Tiempo recomendado:** 25 minutos

## Parte 1. Reparación de rutas — 5 puntos

Un proyecto contiene:

```python
# config/urls.py

from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("servicios/", "portal.urls"),
]
```

Corrige el archivo para conectar correctamente las rutas de `portal`.

Después explica:

- qué importación faltaba;
- por qué una cadena no sustituye a `include()`;
- qué archivo resolverá el resto de la dirección.

## Parte 2. Función nueva — 5 puntos

Agrega una ruta:

```text
/estado/<slug:area>/
```

Debe:

- recibir el área;
- consultar un diccionario;
- renderizar un template;
- mostrar nombre y estado;
- producir 404 si no existe.

No se permite escribir una vista diferente para cada área.

## Parte 3. Explicación del recorrido — 5 puntos

Selecciona una ruta dinámica del proyecto y documenta:

1. dirección visitada;
2. coincidencia en `config/urls.py`;
3. coincidencia en las rutas de la aplicación;
4. parámetro extraído;
5. vista ejecutada;
6. datos consultados;
7. contexto creado;
8. template utilizado;
9. código HTTP producido;
10. resultado visible en el navegador.

---

# 38. Punto de entrega

Utiliza un único punto de entrega para enviar todo el Módulo 1.

## Estructura de la entrega

```text
COA_DJANGO_M1_APELLIDO_NOMBRE/
├── ejercicios/
├── mini_proyecto/
├── proyecto_modulo/
├── evaluacion/
├── evidencias/
└── explicacion.pdf
```

Comprime la carpeta como:

```text
COA_DJANGO_M1_APELLIDO_NOMBRE.zip
```

## No incluyas

- `.venv`;
- `__pycache__`;
- contraseñas;
- claves;
- archivos temporales;
- información personal real.

## Debes enviar

- archivo `.zip`;
- enlace del repositorio;
- capturas;
- tabla de pruebas;
- respuestas de la evaluación;
- explicación del diseño;
- bitácora de uso de IA.

## Capturas mínimas

```text
01_inicio.png
02_servicios.png
03_detalle_servicio.png
04_area.png
05_contacto.png
06_error_404.png
07_manage_check.png
08_historial_git.png
```

## Bitácora de IA

Incluye una tabla como esta:

| Consulta realizada | Herramienta | Respuesta utilizada | Modificación realizada | Cómo se validó |
|---|---|---|---|---|
| Explicación de `include()` | ChatGPT | Parcialmente | Se adaptaron los nombres | Documentación y prueba |
| Diagnóstico de 404 | Claude | Sí | Se corrigió el namespace | Navegador y `check` |

No es necesario copiar conversaciones completas. Registra las decisiones importantes.

[Entregar el Módulo 1](https://forms.gle/nTx97JRkFkbH5Vfr6)

---


<!-- coa-activity:django-m1-proyecto -->

# 39. Errores comunes y soluciones

| Error | Causa probable | Comprobación |
|---|---|---|
| `No module named django` | Entorno desactivado o Django no instalado | Activa `.venv` y ejecuta `python -m django --version` |
| `django-admin` no se reconoce | Ejecutable no disponible en la terminal | Utiliza `python -m django` |
| `TemplateDoesNotExist` | Ruta o carpeta incorrecta | Revisa `aplicacion/templates/aplicacion/archivo.html` |
| Error 404 inesperado | Ruta no incluida o dirección incorrecta | Revisa ambos archivos `urls.py` |
| `NameError: include is not defined` | Falta importar `include` | Usa `from django.urls import include, path` |
| `AttributeError` en `views` | Nombre de vista incorrecto | Compara `urls.py` con `views.py` |
| `NoReverseMatch` | Nombre, namespace o parámetro incorrecto | Revisa `app_name`, `name` y argumentos |
| `DisallowedHost` | Host no permitido con `DEBUG=False` | Agrega `127.0.0.1` y `localhost` a `ALLOWED_HOSTS` |
| El puerto está ocupado | Otro proceso usa el puerto 8000 | Ejecuta `runserver 8001` |
| Django no detecta la aplicación | Aplicación no registrada | Revisa `INSTALLED_APPS` |
| Los cambios no aparecen | Servidor detenido o archivo no guardado | Guarda y reinicia el servidor |
| El parámetro no llega | Nombre diferente entre ruta y vista | Iguala los nombres |
| El template no muestra un dato | Clave ausente en el contexto | Revisa el diccionario enviado |
| Git intenta agregar `.venv` | `.gitignore` incompleto | Agrega `.venv/` antes del commit |

---

# 40. Buenas prácticas del módulo

- Utiliza un entorno virtual por proyecto.
- Ejecuta `python -m pip` para asegurar que `pip` pertenece al Python activo.
- Mantén `requirements.txt` actualizado.
- Utiliza `config` para la configuración general.
- Divide las funciones empresariales en aplicaciones.
- Mantén las rutas de cada aplicación dentro de esa aplicación.
- Utiliza `include()`.
- Asigna nombres a las rutas.
- Utiliza namespaces.
- Separa HTML de Python.
- Mantén las vistas pequeñas.
- Devuelve códigos HTTP coherentes.
- Utiliza 404 para recursos inexistentes.
- Realiza commits frecuentes.
- Comprueba el proyecto con `python manage.py check`.
- Lee los mensajes de error desde la última parte del traceback.
- Consulta la documentación correspondiente a Django 5.2.
- No agregues librerías solamente porque una IA las recomienda.
- No utilices código que no puedas explicar.

---

# 41. Videos recomendados

Los siguientes videos están en español y explican contenidos concretos del módulo.

## 1. Introducción a Django

[Introducción a Django — UskoKruM2010](https://www.youtube.com/watch?v=y7P6ytatRYk)

Duración aproximada: 7 minutos.

Explica qué es Django y cuál es su función en el desarrollo web.

## 2. Instalación dentro de un entorno virtual

[Instalación de Django en un entorno virtual — UskoKruM2010](https://www.youtube.com/watch?v=M4NIs4BM1dk)

Duración aproximada: 7 minutos.

El video utiliza `virtualenv`. En este curso se utilizará `venv`, que forma parte de Python. El objetivo del video es comprender el aislamiento de dependencias; sigue los comandos escritos en este módulo.

## 3. Diferencia entre proyecto y aplicación

[¿Qué es un proyecto y una aplicación en Django? — DesarrolloLibre](https://www.youtube.com/watch?v=sqLoebyzXDA)

Explica una diferencia esencial para organizar correctamente el proyecto.

## 4. Vistas, URLs y templates

[Taller de Django: vistas, URLs y templates — segmento recomendado](https://www.youtube.com/watch?v=P-6AioZhfMc&t=1952s)

Comienza aproximadamente en el minuto 32:32. Observa el recorrido desde la vista hasta la URL y posteriormente hacia el template.

Los videos complementan el contenido. Si un video utiliza otra versión de Django, conserva los conceptos, pero utiliza los comandos y la documentación de Django 5.2 indicados en este módulo.

---

# 42. Documentación y lecturas

## Documentación oficial

- [Guía oficial de instalación de Django 5.2](https://docs.djangoproject.com/es/5.2/intro/install/)
- [Primera aplicación oficial de Django 5.2](https://docs.djangoproject.com/es/5.2/intro/tutorial01/)
- [Sistema de URLs de Django 5.2](https://docs.djangoproject.com/es/5.2/topics/http/urls/)
- [Objetos de solicitud y respuesta](https://docs.djangoproject.com/es/5.2/ref/request-response/)
- [Atajos de Django y función render](https://docs.djangoproject.com/es/5.2/topics/http/shortcuts/)
- [Comandos django-admin y manage.py](https://docs.djangoproject.com/es/5.2/ref/django-admin/)
- [Entornos virtuales con venv](https://docs.python.org/es/3/library/venv.html)

La documentación oficial de Django indica que el servidor incorporado es exclusivamente para desarrollo y que un proyecto puede contener varias aplicaciones. También recomienda consultar siempre la documentación correspondiente a la versión instalada.

## Lecturas complementarias

- [Introducción a Django — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Server-side/Django/Introduction)
- [Entorno de desarrollo de Django — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Server-side/Django/development_environment)

---

# 43. Material complementario

No es necesario descargar un manual extenso para completar este módulo.

Los únicos materiales recomendados son:

- lista de comprobación de instalación;
- plantilla de pruebas manuales;
- plantilla de bitácora de IA;
- rúbrica del proyecto;
- diagrama del recorrido de una solicitud.

Estos materiales pueden conservarse en una sola guía breve del módulo.

---

# 44. Glosario

**Aplicación:** paquete de Django que agrupa una responsabilidad concreta.

**ASGI:** estándar utilizado para conectar aplicaciones Python con servidores que pueden manejar comunicación asíncrona.

**Cliente:** programa que envía una solicitud, normalmente el navegador.

**Código de estado:** número que indica el resultado de una solicitud HTTP.

**Contexto:** diccionario con información que una vista envía a un template.

**Django:** framework web de alto nivel escrito en Python.

**Entorno virtual:** espacio aislado para instalar las dependencias de un proyecto.

**Framework:** conjunto organizado de herramientas, convenciones y componentes para desarrollar software.

**HTTP:** protocolo de comunicación utilizado entre clientes y servidores web.

**`Http404`:** excepción utilizada para indicar que un recurso no existe.

**`HttpRequest`:** objeto que representa una solicitud recibida por Django.

**`HttpResponse`:** objeto que representa una respuesta enviada por Django.

**`include()`:** función que permite delegar una parte de las rutas a otro archivo.

**MVT:** patrón Modelo–Vista–Template utilizado por Django.

**Namespace:** espacio de nombres que permite distinguir rutas de distintas aplicaciones.

**Parámetro de ruta:** valor dinámico extraído desde una URL.

**Proyecto:** configuración y conjunto completo de aplicaciones que forman un sitio.

**`render()`:** función que combina una solicitud, un template y un contexto para producir una respuesta.

**Ruta:** patrón que conecta una dirección con una vista.

**Servidor:** programa que recibe solicitudes y devuelve respuestas.

**Servidor de desarrollo:** servidor ligero incluido en Django para realizar pruebas locales.

**Slug:** texto preparado para utilizarse como parte legible de una URL.

**Template:** archivo de presentación utilizado para generar HTML.

**URL:** dirección mediante la que se solicita un recurso.

**Vista:** función o clase que recibe una solicitud y devuelve una respuesta.

**WSGI:** estándar tradicional para conectar aplicaciones web Python con servidores.

---

# 45. Resumen final

En este módulo aprendiste que Django no reemplaza a Python. Django organiza Python para desarrollar aplicaciones web.

El recorrido esencial es:

```text
Navegador
    ↓
Solicitud HTTP
    ↓
Rutas principales
    ↓
Rutas de la aplicación
    ↓
Vista
    ↓
Datos y contexto
    ↓
Template
    ↓
Respuesta HTTP
    ↓
Navegador
```

También aprendiste a:

- crear un entorno virtual;
- instalar Django;
- crear un proyecto;
- crear una aplicación;
- registrar la aplicación;
- utilizar rutas;
- dividir rutas con `include()`;
- crear vistas;
- devolver respuestas;
- renderizar templates;
- enviar contexto;
- recibir parámetros;
- manejar errores 404;
- organizar el proyecto con Git;
- utilizar IA de forma supervisada.

---

# 46. Lista de comprobación final

Antes de entregar, confirma:

- [ ] Puedo explicar qué es Django.
- [ ] Puedo diferenciar proyecto y aplicación.
- [ ] Comprendo cliente, servidor, solicitud y respuesta.
- [ ] Comprendo el patrón MVT.
- [ ] Sé crear y activar un entorno virtual.
- [ ] Instalé Django 5.2.
- [ ] El proyecto inicia correctamente.
- [ ] La aplicación está registrada.
- [ ] Las rutas generales y las rutas de aplicación están separadas.
- [ ] Utilicé `include()`.
- [ ] Utilicé nombres y namespaces.
- [ ] Creé vistas basadas en funciones.
- [ ] Utilicé `HttpResponse`.
- [ ] Utilicé `render()`.
- [ ] Envié datos mediante contexto.
- [ ] Creé rutas dinámicas.
- [ ] Probé casos válidos e inválidos.
- [ ] Implementé un error 404.
- [ ] Ejecuté `python manage.py check`.
- [ ] Completé los ejercicios.
- [ ] Completé el mini proyecto.
- [ ] Completé el proyecto del módulo.
- [ ] Completé la evaluación práctica.
- [ ] Registré el uso de IA.
- [ ] Puedo explicar todo el código entregado.
- [ ] Envié todo mediante el único punto de entrega del módulo.

---

# Finalización del módulo

El Módulo 1 se considera completado únicamente cuando:

1. todos los ejercicios obligatorios fueron realizados;
2. el mini proyecto funciona;
3. el Portal de Operaciones COA cumple los requisitos;
4. la evaluación práctica fue entregada;
5. la calificación total es de al menos 80 puntos;
6. el proyecto principal fue aprobado;
7. las correcciones solicitadas fueron completadas.

Después de aprobar este módulo podrás continuar con el Módulo 2: **Interfaces profesionales con templates y Bootstrap**.
