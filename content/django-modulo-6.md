# Módulo 6. Arquitectura, pruebas, reportes y despliegue

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 7 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Tecnologías:** Django 5.2 LTS, PostgreSQL, Gunicorn, WhiteNoise, OpenPyXL y Render  
**Mini proyecto:** Centro de Reportes Empresariales  
**Proyecto del módulo:** Versión Candidata del Sistema Empresarial

---

# Introducción

Una aplicación que “funciona en mi computadora” todavía no es un producto entregable.

Antes de publicar un sistema empresarial debes responder:

```text
¿La arquitectura permite modificarlo?
¿Las reglas críticas están separadas?
¿Las pruebas detectan regresiones?
¿Las consultas escalan razonablemente?
¿Los reportes muestran datos correctos?
¿Los secretos están protegidos?
¿La configuración de producción es segura?
¿La base de datos persiste?
¿Los archivos sobreviven un despliegue?
¿Otra persona puede instalar el proyecto?
```

En los módulos anteriores construiste:

```text
Módulo 1 → proyecto, aplicaciones, URLs y vistas
Módulo 2 → templates e interfaz responsive
Módulo 3 → modelos, relaciones, ORM y admin
Módulo 4 → formularios y CRUD
Módulo 5 → autenticación, permisos, ventas y transacciones
```

Ahora convertirás ese sistema funcional en una **versión candidata**:

```text
Código organizado
      ↓
Pruebas automáticas
      ↓
Consultas revisadas
      ↓
Reportes y exportaciones
      ↓
Configuración de producción
      ↓
PostgreSQL
      ↓
Despliegue verificable
```

Una versión candidata no significa que el sistema esté listo para cualquier empresa. Significa que cumple los requisitos del curso, puede desplegarse, puede revisarse y está preparado para recibir la evaluación final del Módulo 7.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- organizar una aplicación Django por responsabilidades;
- relacionar MVT con una arquitectura por capas;
- mantener vistas delgadas;
- extraer lógica empresarial a servicios;
- crear funciones reutilizables sin sobrearquitectura;
- evitar lógica de negocio en templates;
- separar configuración por entorno;
- leer variables de entorno;
- proteger secretos;
- gestionar dependencias;
- configurar logs sin exponer datos sensibles;
- crear páginas 403, 404 y 500;
- escribir pruebas de modelos;
- escribir pruebas de formularios;
- escribir pruebas de vistas;
- utilizar el cliente de pruebas;
- probar autenticación y permisos;
- probar transacciones y procesos críticos;
- organizar una carpeta de pruebas;
- detectar consultas N+1;
- utilizar `select_related` y `prefetch_related`;
- comprobar cantidad de consultas;
- crear agregaciones e indicadores;
- justificar índices básicos;
- filtrar reportes por fecha;
- exportar CSV;
- exportar Excel;
- proteger exportaciones contra fórmulas no deseadas;
- configurar PostgreSQL;
- diferenciar SQLite de una base de producción;
- gestionar static y media;
- configurar `DEBUG`, `ALLOWED_HOSTS` y `SECRET_KEY`;
- utilizar un servidor de producción WSGI o ASGI;
- ejecutar `check --deploy`;
- desplegar en una plataforma compatible;
- documentar un repositorio profesional;
- utilizar IA para revisar código, pruebas y documentación bajo supervisión.

---

# Conocimientos previos

Debes poder:

- trabajar con aplicaciones, URLs, vistas y templates;
- crear modelos y migraciones;
- utilizar Forms, ModelForms y formsets;
- implementar autenticación y permisos;
- utilizar el ORM;
- trabajar con transacciones;
- crear servicios;
- utilizar Git y GitHub;
- ejecutar comandos desde el entorno virtual.

Este módulo parte del proyecto aprobado en el Módulo 5.

---

# Competencias que desarrollarás

## Competencia técnica

Podrás preparar una aplicación Django para ser probada, optimizada y publicada con PostgreSQL.

## Competencia arquitectónica

Podrás separar coordinación HTTP, reglas empresariales, consultas y generación de archivos.

## Competencia de calidad

Podrás diseñar pruebas que detecten regresiones en permisos, transacciones y reportes.

## Competencia de operación

Podrás configurar entornos, proteger secretos, interpretar logs y verificar un despliegue.

## Competencia profesional

Podrás entregar un repositorio reproducible, explicar decisiones y reconocer los límites entre una demostración y un servicio empresarial.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Arquitectura, configuración y observabilidad | 35 minutos |
| Pruebas automáticas | 55 minutos |
| Optimización e indicadores | 30 minutos |
| Reportes y exportaciones | 45 minutos |
| Producción, PostgreSQL y despliegue | 1 hora |
| Laboratorio y ejercicios obligatorios | 35 minutos |
| Mini proyecto | 35 minutos |
| Proyecto del módulo | 1 hora y 30 minutos |
| Evaluación práctica | 35 minutos |
| **Total estimado** | **7 horas** |

Esta estimación supone que partes del proyecto aprobado del Módulo 5. El tiempo de espera del proveedor, la creación de cuentas y una corrección solicitada después de la revisión no forman parte de las siete horas activas. Aprende el proceso y consulta siempre la documentación actual.

---

# 1. Organización profesional del proyecto

Una estructura posible:

```text
gestion_empresarial/
├── manage.py
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── build.sh
├── render.yaml
├── config/
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── cuentas/
├── clientes/
├── inventario/
├── ventas/
├── reportes/
├── templates/
├── static/
└── documentacion/
```

Cada aplicación debe representar una responsabilidad del dominio, no una clase o una pantalla.

Evita aplicaciones como:

```text
formularios
modelos
vistas
utilidades_de_todo
```

Esos nombres agrupan por tipo técnico y suelen mezclar dominios.

---

# 2. MVT y capas

Django utiliza el patrón MVT:

```text
Model    → datos
View     → coordina la solicitud
Template → presentación
```

Una operación empresarial necesita responsabilidades adicionales:

```text
HTTP
 ↓
Vista
 ↓
Formulario
 ↓
Servicio o caso de uso
 ↓
Modelos y ORM
 ↓
Base de datos
```

Para lecturas complejas:

```text
Vista
 ↓
Selector o consulta reutilizable
 ↓
QuerySet optimizado
```

No es obligatorio crear una capa formal para cada consulta. Extrae cuando:

- la lógica se reutiliza;
- la vista se vuelve difícil de leer;
- existe una regla crítica;
- varias tablas cambian juntas;
- necesitas probar el comportamiento sin HTTP.

---

# 3. Vistas delgadas

Una vista debe coordinar:

```python
@permission_required(
    "ventas.add_venta",
    raise_exception=True,
)
def venta_crear(request):
    form = VentaForm(request.POST or None)
    lineas = LineaVentaFormSet(
        request.POST or None,
        prefix="lineas",
    )

    if (
        request.method == "POST"
        and form.is_valid()
        and lineas.is_valid()
    ):
        try:
            venta = registrar_venta(
                cliente=form.cleaned_data["cliente"],
                vendedor=request.user,
                lineas=[
                    item.cleaned_data
                    for item in lineas.forms
                    if item.cleaned_data
                ],
            )
        except ValidationError as error:
            form.add_error(None, " ".join(error.messages))
        else:
            messages.success(request, "Venta registrada.")
            return redirect("ventas:detalle", pk=venta.pk)

    return render(
        request,
        "ventas/formulario.html",
        {"form": form, "lineas": lineas},
    )
```

La vista:

- comprueba acceso;
- recibe datos;
- ejecuta validación;
- llama al servicio;
- transforma el resultado en respuesta.

No contiene el algoritmo de inventario.

---

# 4. Servicios y casos de uso

`ventas/services.py`:

```text
registrar_venta()
cancelar_venta()
```

Un servicio debe:

- tener una operación clara;
- recibir datos explícitos;
- aplicar reglas empresariales;
- controlar la transacción;
- devolver un resultado;
- lanzar errores del dominio comprensibles;
- no depender de templates;
- no construir mensajes visuales.

Evita una clase genérica llamada `Service` con decenas de métodos no relacionados.

---

# 5. Consultas reutilizables

`ventas/selectors.py`:

```python
from .models import Venta


def ventas_visibles_para(usuario):
    queryset = (
        Venta.objects
        .select_related("cliente", "vendedor")
        .prefetch_related("detalles__producto")
        .order_by("-creada_en")
    )

    if usuario.has_perm("ventas.ver_todas_las_ventas"):
        return queryset

    return queryset.filter(vendedor=usuario)
```

El nombre comunica el resultado. La función no devuelve HTML ni decide una redirección.

No crees un selector para `Producto.objects.all()` si solo se utiliza una vez y no existe una regla.

---

# 6. Funciones reutilizables

Una función merece extraerse cuando representa una idea:

```python
def normalizar_texto(texto):
    return " ".join(texto.split())
```

```python
def intervalo_valido(desde, hasta):
    return not (desde and hasta and desde > hasta)
```

Evita archivos `utils.py` que se convierten en depósitos sin responsabilidad. Prefiere nombres:

```text
reportes/exporters.py
ventas/services.py
inventario/validators.py
cuentas/permissions.py
```

---

# 7. Lo que no pertenece al template

Evita:

```html
{% if venta.total > 1000 and user.groups.first.name == "Administradores" %}
    ...
{% endif %}
```

El template no debe decidir:

- permisos empresariales;
- descuentos;
- stock;
- cancelación;
- totales;
- propiedad;
- estados complejos.

Prepara una variable en la vista o utiliza permisos:

```html
{% if puede_cancelar %}
    ...
{% endif %}
```

El servidor sigue validando la operación.

---

# 8. Configuración por entorno

```text
base.py
├── aplicaciones
├── middleware
├── templates
├── internacionalización
└── configuración compartida

development.py
├── DEBUG = True
├── SQLite
└── correo de consola

production.py
├── DEBUG = False
├── PostgreSQL
├── cookies seguras
└── almacenamiento de producción
```

`config/settings/development.py`:

```python
from .base import *


DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

EMAIL_BACKEND = (
    "django.core.mail.backends.console.EmailBackend"
)
```

`manage.py`:

```python
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings.development",
)
```

En producción, la variable de entorno reemplaza ese valor.

---

# 9. Variables de entorno

```python
import os


SECRET_KEY = os.environ["SECRET_KEY"]
```

Para listas:

```python
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        "ALLOWED_HOSTS",
        "",
    ).split(",")
    if host.strip()
]
```

Para booleanos:

```python
def env_bool(nombre, predeterminado=False):
    valor = os.environ.get(nombre)

    if valor is None:
        return predeterminado

    return valor.strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
```

No conviertas así:

```python
DEBUG = bool(os.environ.get("DEBUG"))
```

`bool("False")` es `True`.

---

# 10. `.env.example`

El archivo de ejemplo documenta nombres, no valores reales:

```dotenv
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=replace-with-a-generated-secret
ALLOWED_HOSTS=example.onrender.com
DATABASE_URL=postgresql://user:password@host:5432/database
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

Reglas:

- `.env.example` sí se incluye;
- `.env` no se incluye;
- secretos no aparecen en README;
- producción utiliza el panel seguro del proveedor;
- cada entorno tiene su propia clave.

---

# 11. Gestión de dependencias

Genera un archivo reproducible:

```bash
python -m pip freeze > requirements.txt
```

Después revísalo. Debe contener las dependencias necesarias, por ejemplo:

```text
Django
gunicorn
psycopg
dj-database-url
whitenoise
openpyxl
Pillow
```

No copies versiones de este documento. Instala versiones compatibles en tu entorno, ejecuta las pruebas y conserva las versiones exactas generadas.

Para instalar:

```bash
python -m pip install -r requirements.txt
```

No incluyas paquetes que el proyecto no utiliza.

---

# 12. Registro de eventos

Utiliza `logging`, no `print`, para eventos de ejecución:

```python
import logging


logger = logging.getLogger(__name__)


def venta_crear(request):
    logger.info(
        "Inicio de registro de venta",
        extra={"usuario_id": request.user.pk},
    )
```

Configuración básica:

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
```

No registres:

- contraseñas;
- tokens;
- cookies;
- documentos;
- números sensibles;
- formularios completos.

Un log debe ayudar a operar el sistema sin convertirse en una fuga de datos.

---

# 13. Errores y eventos

Clasifica:

```text
DEBUG    → diagnóstico detallado local
INFO     → operación normal relevante
WARNING  → situación recuperable inesperada
ERROR    → operación fallida
CRITICAL → servicio comprometido
```

No conviertas cada visita en `ERROR`. El nivel debe representar impacto.

Captura excepciones únicamente cuando:

- puedes responder de forma controlada;
- agregas contexto útil;
- mantienes el traceback con `logger.exception`;
- no escondes el fallo.

```python
try:
    resultado = proceso_externo()
except ExternalServiceError:
    logger.exception(
        "Falló el servicio de archivos",
        extra={"usuario_id": request.user.pk},
    )
    raise
```

---

# 14. Páginas 403, 404 y 500

Templates:

```text
templates/403.html
templates/404.html
templates/500.html
```

Cada página debe:

- mantener identidad visual;
- explicar en lenguaje sencillo;
- ofrecer una ruta segura;
- no mostrar código;
- no revelar rutas internas;
- no afirmar que una operación terminó si falló.

La página 500 debe ser especialmente simple, porque puede mostrarse cuando otras partes no funcionan.

Prueba con `DEBUG=False` en un entorno local controlado.

---

# 15. Ruta de salud

Una ruta de salud permite que la plataforma compruebe si el proceso responde:

```python
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({"status": "ok"})
```

```python
path("health/", health_check, name="health_check")
```

No incluyas:

- versiones;
- variables;
- estado de usuarios;
- secretos;
- detalles internos.

Una comprobación avanzada de base de datos puede ser útil, pero debe diseñarse sin generar carga ni exponer información.

---

# 16. Pruebas automáticas: una red de seguridad

Probar manualmente sigue siendo útil, pero no basta. Cada cambio puede romper una función que ya funcionaba. Una prueba automática prepara una situación, ejecuta el código y comprueba un resultado esperado.

```text
Preparar datos → ejecutar comportamiento → comprobar resultado
```

Django crea una base de datos de prueba separada. No debes ejecutar pruebas contra la base de datos de producción.

```powershell
python manage.py test
```

Ejecutar una aplicación o una clase concreta ahorra tiempo durante el desarrollo:

```powershell
python manage.py test ventas
python manage.py test ventas.tests.test_services.RegistrarVentaTests
```

Una buena prueba debe ser:

- repetible;
- independiente de otras pruebas;
- rápida en proporción a lo que verifica;
- clara cuando falla;
- centrada en un comportamiento observable.

No pruebes que Django funciona internamente. Prueba tus reglas, permisos, formularios, consultas y procesos críticos.

---

# 17. Organización de las pruebas

Cuando una aplicación crece, sustituye el archivo único `tests.py` por un paquete:

```text
ventas/
├── services.py
├── selectors.py
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_forms.py
    ├── test_services.py
    ├── test_selectors.py
    └── test_views.py
```

Convenciones recomendadas:

- los archivos comienzan con `test_`;
- las clases terminan en `Tests`;
- los métodos describen el comportamiento;
- cada prueba verifica una idea principal.

```python
def test_no_permite_vender_mas_unidades_que_el_stock(self):
    ...
```

El nombre anterior informa mucho más que `test_venta_1`.

---

# 18. Pruebas de modelos y restricciones

Ejemplo de una regla sencilla:

```python
from django.core.exceptions import ValidationError
from django.test import TestCase

from productos.models import Producto


class ProductoTests(TestCase):
    def test_stock_no_puede_ser_negativo(self):
        producto = Producto(nombre="Teclado", precio=25, stock=-1)

        with self.assertRaises(ValidationError):
            producto.full_clean()
```

`full_clean()` ejecuta validaciones del modelo, pero `save()` no lo llama automáticamente. Si la regla debe protegerse incluso ante operaciones directas, utiliza además una restricción de base de datos cuando corresponda.

```python
from django.db import IntegrityError, transaction


def test_restriccion_de_base_de_datos_impide_stock_negativo(self):
    with self.assertRaises(IntegrityError):
        with transaction.atomic():
            Producto.objects.create(
                nombre="Teclado",
                precio=25,
                stock=-1,
            )
```

El bloque `atomic()` interior contiene el error y evita dejar inutilizable la transacción de la prueba.

Comprueba especialmente:

- restricciones únicas;
- cantidades y precios no negativos;
- estados permitidos;
- métodos propios;
- representaciones legibles;
- reglas que la empresa no puede permitirse romper.

---

# 19. Pruebas de formularios

```python
from django.test import TestCase

from productos.forms import ProductoForm


class ProductoFormTests(TestCase):
    def test_formulario_valido(self):
        formulario = ProductoForm(
            data={
                "nombre": "Teclado mecánico",
                "precio": "49.90",
                "stock": "12",
                "activo": True,
            }
        )

        self.assertTrue(formulario.is_valid())

    def test_rechaza_nombre_compuesto_solo_por_espacios(self):
        formulario = ProductoForm(
            data={
                "nombre": "   ",
                "precio": "49.90",
                "stock": "12",
            }
        )

        self.assertFalse(formulario.is_valid())
        self.assertIn("nombre", formulario.errors)
```

No compruebes únicamente `is_valid()`. Cuando una regla sea importante, verifica también el campo afectado y, si aporta claridad, el código del error. Evita depender del texto completo de un mensaje si puede cambiar por traducción.

---

# 20. Pruebas de vistas con el cliente de Django

El cliente de pruebas simula solicitudes sin abrir un navegador:

```python
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse


Usuario = get_user_model()


class ProductoListViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.usuario = Usuario.objects.create_user(
            username="operador",
            password="Clave-Segura-123",
        )

    def test_usuario_anonimo_es_enviado_al_login(self):
        respuesta = self.client.get(reverse("productos:lista"))

        self.assertEqual(respuesta.status_code, 302)
        self.assertIn(reverse("login"), respuesta.url)

    def test_usuario_autenticado_puede_ver_la_lista(self):
        self.client.force_login(self.usuario)

        respuesta = self.client.get(reverse("productos:lista"))

        self.assertEqual(respuesta.status_code, 200)
        self.assertTemplateUsed(respuesta, "productos/producto_list.html")
```

`force_login()` es apropiado cuando la prueba no estudia el formulario de acceso. Para comprobar el login real, utiliza `self.client.post()` con credenciales.

También puedes revisar:

```python
self.assertContains(respuesta, "Productos")
self.assertNotContains(respuesta, "Eliminar")
self.assertRedirects(respuesta, reverse("productos:lista"))
```

---

# 21. Pruebas de permisos

Ocultar un botón no protege una operación. La prueba debe solicitar directamente la URL.

```python
from django.contrib.auth.models import Permission


def test_usuario_sin_permiso_no_puede_crear_producto(self):
    self.client.force_login(self.usuario)

    respuesta = self.client.get(reverse("productos:crear"))

    self.assertEqual(respuesta.status_code, 403)


def test_usuario_con_permiso_puede_abrir_formulario(self):
    permiso = Permission.objects.get(
        content_type__app_label="productos",
        codename="add_producto",
    )
    self.usuario.user_permissions.add(permiso)
    self.client.force_login(self.usuario)

    respuesta = self.client.get(reverse("productos:crear"))

    self.assertEqual(respuesta.status_code, 200)
```

La matriz mínima de seguridad debe incluir:

| Estado | Resultado esperado |
|---|---|
| Anónimo | redirección al login |
| Autenticado sin permiso | respuesta 403 |
| Autenticado con permiso | operación permitida |
| Método HTTP incorrecto | rechazo de la solicitud |
| Objeto inexistente | respuesta 404 |

---

# 22. Pruebas de procesos críticos y transacciones

Una venta puede crear encabezado, detalles y movimientos de inventario. Debes comprobar tanto el éxito como el retroceso completo ante un error.

```python
from django.core.exceptions import ValidationError
from django.test import TestCase

from ventas.models import Venta
from ventas.services import registrar_venta


class RegistrarVentaTests(TestCase):
    def test_error_no_deja_venta_parcial(self):
        stock_inicial = self.producto.stock
        lineas = [
            {"producto_id": self.producto.pk, "cantidad": stock_inicial + 1}
        ]

        with self.assertRaises(ValidationError):
            registrar_venta(usuario=self.usuario, lineas=lineas)

        self.producto.refresh_from_db()
        self.assertEqual(Venta.objects.count(), 0)
        self.assertEqual(self.producto.stock, stock_inicial)
```

Diseña pruebas para confirmar que:

- una venta válida calcula el total correcto;
- cada detalle conserva su precio histórico;
- el inventario disminuye una sola vez;
- una cantidad inválida no crea registros parciales;
- una venta anulada sigue la regla definida;
- dos solicitudes no pueden saltarse la validación crítica.

`TestCase` es suficiente para la mayoría de pruebas. Si necesitas comprobar bloqueos o comportamiento real de confirmación de transacciones, estudia `TransactionTestCase` y ejecuta también la prueba con PostgreSQL.

---

# 23. Datos de prueba e independencia

Usa `setUpTestData()` para datos comunes que no cambian:

```python
@classmethod
def setUpTestData(cls):
    cls.producto = Producto.objects.create(
        nombre="Monitor",
        precio="180.00",
        stock=8,
    )
```

Usa `setUp()` cuando cada prueba necesite una preparación nueva o mutable.

Reglas importantes:

- una prueba no debe depender del orden;
- no uses identificadores fijos como si siempre fueran `1`;
- no consultes servicios externos;
- no uses la fecha actual sin controlarla cuando afecte el resultado;
- crea la cantidad mínima de datos que explique el caso;
- no tapes una falla con demasiadas condiciones dentro de una sola prueba.

La cobertura puede mostrar líneas no ejecutadas, pero no demuestra que las reglas estén bien pensadas. Prioriza escenarios significativos sobre un porcentaje decorativo.

---

# 24. Optimización del ORM y problema N+1

Imagina una lista de 100 ventas. Si la consulta obtiene las ventas y luego solicita por separado el cliente de cada una, el resultado puede ser:

```text
1 consulta de ventas + 100 consultas de clientes = 101 consultas
```

Este es el problema N+1.

Para relaciones `ForeignKey` y `OneToOneField`, utiliza `select_related()`:

```python
ventas = (
    Venta.objects
    .select_related("cliente", "vendedor")
    .order_by("-creada_en")
)
```

Para relaciones múltiples o inversas, utiliza `prefetch_related()`:

```python
ventas = (
    Venta.objects
    .select_related("cliente", "vendedor")
    .prefetch_related("detalles__producto")
)
```

| Herramienta | Uso habitual |
|---|---|
| `select_related()` | una relación directa por fila |
| `prefetch_related()` | colecciones o relaciones múltiples |

No agregues ambas herramientas a todas las consultas. Primero identifica qué datos usa la vista o el reporte.

---

# 25. Selectores para consultas reutilizables

Una consulta compleja utilizada por una vista, un reporte y una exportación puede vivir en `selectors.py`:

```python
from ventas.models import Venta


def ventas_para_reporte(*, desde, hasta, estado=None):
    consulta = (
        Venta.objects
        .select_related("cliente", "vendedor")
        .filter(creada_en__date__range=(desde, hasta))
        .order_by("-creada_en")
    )

    if estado:
        consulta = consulta.filter(estado=estado)

    return consulta
```

La vista controla la solicitud y los permisos. El selector construye la consulta. El exportador transforma el resultado.

```text
Vista → selector → QuerySet → template o exportador
```

---

# 26. Comprobar la cantidad de consultas

Una optimización debe medirse:

```python
def test_lista_no_hace_una_consulta_por_venta(self):
    self.client.force_login(self.usuario)

    with self.assertNumQueries(4):
        respuesta = self.client.get(reverse("ventas:lista"))

    self.assertEqual(respuesta.status_code, 200)
```

La cantidad exacta depende de sesiones, permisos y contexto. No copies el número `4` sin medir tu vista. El objetivo es detectar un crecimiento inesperado: al aumentar las ventas, las consultas no deberían crecer una por cada fila.

Durante el desarrollo también puedes inspeccionar consultas con Django Debug Toolbar, pero no debe habilitarse en producción.

---

# 27. Agregaciones para paneles

No necesitas cargar todas las ventas en Python para sumar sus totales. La base de datos puede hacerlo:

```python
from django.db.models import Count, Sum


resumen = ventas.aggregate(
    cantidad=Count("id"),
    total=Sum("total"),
)

por_vendedor = (
    ventas
    .values("vendedor__username")
    .annotate(
        cantidad=Count("id"),
        total=Sum("total"),
    )
    .order_by("-total")
)
```

Si no existen ventas, `Sum()` puede devolver `None`. Normaliza el valor antes de presentarlo:

```python
total = resumen["total"] or 0
```

El panel del módulo debe mostrar, como mínimo:

- cantidad de ventas del periodo;
- ingresos del periodo;
- productos con stock bajo;
- ventas por estado;
- resultados por vendedor si el usuario tiene permiso.

No conviertas un panel en una colección de números sin contexto. Muestra el periodo y la unidad monetaria.

---

# 28. Índices: optimizar con evidencia

Un índice puede acelerar búsquedas, pero consume espacio y añade trabajo a inserciones y actualizaciones.

```python
class Venta(models.Model):
    creada_en = models.DateTimeField(db_index=True)
    estado = models.CharField(max_length=20)

    class Meta:
        indexes = [
            models.Index(
                fields=["estado", "creada_en"],
                name="venta_estado_fecha_idx",
            )
        ]
```

Después de modificar índices:

```powershell
python manage.py makemigrations
python manage.py migrate
```

No indexes cada campo “por si acaso”. Revisa filtros, ordenamientos, volumen de datos y planes de ejecución. En este módulo basta con justificar uno o dos índices relacionados con consultas reales del sistema.

---

# 29. Formulario de filtros para reportes

Los parámetros de un reporte también deben validarse:

```python
from datetime import timedelta

from django import forms

from ventas.models import Venta


class ReporteVentasForm(forms.Form):
    desde = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    hasta = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    estado = forms.ChoiceField(required=False, choices=Venta.Estado.choices)

    def clean(self):
        datos = super().clean()
        desde = datos.get("desde")
        hasta = datos.get("hasta")

        if desde and hasta and desde > hasta:
            raise forms.ValidationError(
                "La fecha inicial no puede ser posterior a la fecha final."
            )

        if desde and hasta and hasta - desde > timedelta(days=366):
            raise forms.ValidationError(
                "El periodo no puede superar 366 días."
            )

        return datos
```

El límite evita reportes accidentales demasiado grandes. Ajusta la regla según la necesidad real.

---

# 30. Exportación segura a CSV

```python
import csv

from django.contrib.auth.decorators import permission_required
from django.http import HttpResponse


def texto_seguro_para_hoja(valor):
    texto = str(valor or "")
    if texto.startswith(("=", "+", "-", "@", "\t", "\r")):
        return "'" + texto
    return texto


@permission_required("ventas.view_venta", raise_exception=True)
def exportar_ventas_csv(request):
    formulario = ReporteVentasForm(request.GET)
    if not formulario.is_valid():
        return HttpResponse("Filtros inválidos", status=400)

    ventas = ventas_para_reporte(**formulario.cleaned_data)

    respuesta = HttpResponse(content_type="text/csv; charset=utf-8")
    respuesta["Content-Disposition"] = (
        'attachment; filename="reporte_ventas.csv"'
    )
    respuesta.write("\ufeff")

    escritor = csv.writer(respuesta)
    escritor.writerow(["Fecha", "Cliente", "Vendedor", "Estado", "Total"])

    for venta in ventas.iterator(chunk_size=1000):
        escritor.writerow([
            venta.creada_en.strftime("%Y-%m-%d %H:%M"),
            texto_seguro_para_hoja(venta.cliente.nombre),
            texto_seguro_para_hoja(venta.vendedor.get_username()),
            texto_seguro_para_hoja(venta.get_estado_display()),
            venta.total,
        ])

    return respuesta
```

La protección de texto evita que una hoja de cálculo interprete como fórmula un valor escrito por una persona. Conserva los números reales como números. No exportes contraseñas, tokens ni información que el usuario no puede consultar en pantalla.

---

# 31. Exportación a Excel con OpenPyXL

Instala la dependencia y regístrala:

```powershell
pip install openpyxl
pip freeze > requirements.txt
```

Un exportador reutilizable puede vivir en `reportes/exporters.py`:

```python
from django.utils import timezone
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill


def construir_reporte_ventas_excel(ventas):
    libro = Workbook()
    hoja = libro.active
    hoja.title = "Ventas"

    encabezados = ["Fecha", "Cliente", "Vendedor", "Estado", "Total"]
    hoja.append(encabezados)

    for celda in hoja[1]:
        celda.font = Font(bold=True, color="FFFFFF")
        celda.fill = PatternFill("solid", fgColor="1F4E78")

    for venta in ventas.iterator(chunk_size=1000):
        hoja.append([
            timezone.localtime(venta.creada_en).replace(tzinfo=None),
            texto_seguro_para_hoja(venta.cliente.nombre),
            texto_seguro_para_hoja(venta.vendedor.get_username()),
            texto_seguro_para_hoja(venta.get_estado_display()),
            venta.total,
        ])

    hoja.freeze_panes = "A2"
    hoja.auto_filter.ref = hoja.dimensions
    hoja.column_dimensions["A"].width = 20
    hoja.column_dimensions["B"].width = 30
    hoja.column_dimensions["C"].width = 20
    hoja.column_dimensions["D"].width = 16
    hoja.column_dimensions["E"].width = 14

    return libro
```

La vista construye la respuesta:

```python
from django.http import HttpResponse


respuesta = HttpResponse(
    content_type=(
        "application/vnd.openxmlformats-officedocument."
        "spreadsheetml.sheet"
    )
)
respuesta["Content-Disposition"] = (
    'attachment; filename="reporte_ventas.xlsx"'
)

libro = construir_reporte_ventas_excel(ventas)
libro.save(respuesta)
return respuesta
```

Para conjuntos muy grandes, investiga `Workbook(write_only=True)` o un proceso en segundo plano. El proyecto del curso debe usar un rango limitado y razonable.

---

# 32. Reglas profesionales para reportes

Todo reporte debe indicar:

- título;
- fecha y hora de generación;
- filtros aplicados;
- columnas comprensibles;
- moneda y zona horaria;
- cantidad de registros;
- quién puede generarlo;
- qué ocurre cuando no hay resultados.

Evita:

- cargar millones de filas en memoria;
- duplicar la consulta en HTML, CSV y Excel;
- aceptar campos arbitrarios desde la URL;
- confiar en el nombre de archivo enviado por el usuario;
- exportar más información que la autorizada;
- usar valores de usuarios como fórmulas de hoja de cálculo.

El reporte debe presentar la misma verdad empresarial que el sistema. Si una venta anulada no cuenta como ingreso, tampoco debe contarse en el panel ni en la exportación.

---

# 33. Conexión con la automatización aprendida en la Ruta Python

Un reporte web combina conocimientos de cursos anteriores:

```text
Python Práctico
  └── fechas, archivos, pathlib y OpenPyXL

Desarrollo de Software con Python
  └── servicios, validación, separación de responsabilidades

SQL y Bases de Datos
  └── filtros, agregaciones, relaciones e índices

Django
  └── permisos, ORM, respuestas HTTP y templates
```

La aplicación web no sustituye esos conocimientos: los coordina. El selector obtiene datos autorizados; el exportador crea el archivo; la vista devuelve la descarga; la prueba verifica el resultado.

---

# 34. SQLite en desarrollo y PostgreSQL en producción

SQLite es excelente para aprender y para aplicaciones locales sencillas. En este módulo usarás PostgreSQL como base de datos del despliegue porque representa mejor un entorno web multiusuario.

| Aspecto | SQLite | PostgreSQL |
|---|---|---|
| Instalación local | muy sencilla | requiere servidor o servicio |
| Concurrencia | limitada para muchas escrituras | diseñada para múltiples conexiones |
| Tipado y funciones | más permisivo | más estricto y completo |
| Uso en este curso | desarrollo local | despliegue evaluable |

No asumas que pasar de SQLite a PostgreSQL es solamente cambiar una línea. Debes ejecutar las pruebas con PostgreSQL antes de considerar lista la versión candidata. Pueden aparecer diferencias en restricciones, ordenamientos, búsquedas y comportamiento transaccional.

Instala el controlador moderno y el lector de URL:

```powershell
pip install "psycopg[binary]" dj-database-url
pip freeze > requirements.txt
```

Configuración de producción:

```python
import dj_database_url


DATABASES = {
    "default": dj_database_url.config(
        env="DATABASE_URL",
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=True,
    )
}
```

`DATABASE_URL` debe estar definida en el proveedor. No incluyas usuario, contraseña ni dirección de producción en Git.

---

# 35. Configuración de producción

La configuración de producción debe partir de la base común y sobrescribir lo necesario:

```python
# config/settings/production.py
import os

from .base import *  # noqa: F403


DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("ALLOWED_HOSTS", "").split(",")
    if host.strip()
]

render_hostname = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if render_hostname:
    ALLOWED_HOSTS.append(render_hostname)

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
```

`SECURE_PROXY_SSL_HEADER` solo es correcto cuando controlas o confías en el proxy que establece ese encabezado. En este despliegue se configura de acuerdo con la plataforma utilizada.

Antes de activar HSTS:

1. confirma que todo el sitio funciona por HTTPS;
2. empieza con un valor pequeño;
3. aumenta el tiempo gradualmente;
4. no actives `SECURE_HSTS_PRELOAD` sin comprender su efecto.

```python
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
```

Un valor copiado sin revisar no equivale a seguridad.

---

# 36. Archivos estáticos con WhiteNoise

Los archivos estáticos pertenecen al código del sitio:

```text
CSS, JavaScript, logotipos e iconos del proyecto
```

Instala WhiteNoise:

```powershell
pip install "whitenoise[brotli]"
pip freeze > requirements.txt
```

Colócalo inmediatamente después de `SecurityMiddleware`:

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    # resto del middleware
]
```

```python
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage."
            "CompressedManifestStaticFilesStorage"
        ),
    },
}
```

La configuración anterior utiliza el almacenamiento local predeterminado únicamente si la demostración pública no acepta archivos subidos. Si habilitas multimedia, reemplaza `default` por un backend externo persistente; no conserves `FileSystemStorage` como almacenamiento de producción en un disco efímero.

Prueba la recolección:

```powershell
python manage.py collectstatic --no-input
```

No edites manualmente `staticfiles/`. Es una salida generada y debe excluirse del repositorio.

---

# 37. Archivos multimedia: no son archivos estáticos

Los archivos multimedia son subidos durante el uso:

```text
fotografías de productos, comprobantes y documentos
```

WhiteNoise no es un sistema de almacenamiento para esos archivos. Además, el disco de un servicio web gratuito de Render es efímero: un reinicio o despliegue puede borrar archivos locales.

Para una demostración pública:

- usa almacenamiento externo persistente para las imágenes;
- conserva solo referencias en la base de datos;
- valida tipo y tamaño;
- define una imagen alternativa si falta el archivo;
- elimina archivos de prueba que contengan datos personales.

Cloudinary puede utilizarse para imágenes públicas de demostración. Los documentos privados requieren un almacenamiento privado, control de autorización y URLs firmadas o una vista protegida. Si esa infraestructura no está configurada, desactiva la carga de documentos privados en el despliegue público.

```text
Nunca presentes un archivo empresarial privado mediante una URL pública permanente.
```

---

# 38. Migraciones en el proceso de publicación

Las migraciones forman parte del código y deben estar confirmadas en Git.

Antes de publicar:

```powershell
python manage.py makemigrations --check
python manage.py migrate --plan
python manage.py test
```

Un script de construcción básico:

```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

Guárdalo como `build.sh` y confirma sus finales de línea compatibles con Linux.

En un entorno profesional, las migraciones deberían ejecutarse una sola vez mediante una fase de predespliegue, antes de iniciar la nueva versión. No las ejecutes en el comando de inicio de cada proceso: varios procesos podrían intentar migrar simultáneamente.

La guía de Render utiliza el script de construcción para una configuración inicial sencilla. Revisa el flujo cuando el sistema crezca o el plan permita un comando de predespliegue.

---

# 39. Servidor de producción

`runserver` es para desarrollo. Para esta versión candidata utilizarás Gunicorn:

```powershell
pip install gunicorn uvicorn
pip freeze > requirements.txt
```

Comando de inicio recomendado por la guía actual de Render para un proyecto ASGI:

```text
python -m gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker
```

Sustituye `config` si el paquete principal tiene otro nombre. También puedes usar WSGI para una aplicación tradicional:

```text
gunicorn config.wsgi:application
```

Elige una opción, pruébala y documéntala. No mezcles comandos de distintos tutoriales sin comprender qué módulo están cargando.

---

# 40. Comprobación de despliegue de Django

Ejecuta:

```powershell
python manage.py check
python manage.py check --deploy --settings=config.settings.production
```

El segundo comando necesita las variables exigidas por producción. Puedes proporcionar valores de prueba seguros solo para la comprobación local.

`check --deploy` detecta configuraciones riesgosas, pero no sustituye:

- pruebas funcionales;
- revisión de permisos;
- revisión de secretos;
- copia de seguridad;
- monitoreo;
- revisión de dependencias.

Cada advertencia debe corregirse o documentarse con una justificación concreta.

---

# 41. Despliegue guiado en Render

Render permite conectar un repositorio y publicar una aplicación Django. La ruta principal del módulo es:

```text
Repositorio GitHub
      ↓
Servicio web Django
      ↓
Base PostgreSQL
      ↓
URL HTTPS
```

## 41.1 Archivo `render.yaml`

```yaml
databases:
  - name: coa-gestion-db
    plan: free

services:
  - type: web
    name: coa-gestion-web
    runtime: python
    plan: free
    buildCommand: "./build.sh"
    startCommand: >-
      python -m gunicorn config.asgi:application
      -k uvicorn.workers.UvicornWorker
    healthCheckPath: /health/
    envVars:
      - key: DJANGO_SETTINGS_MODULE
        value: config.settings.production
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: coa-gestion-db
          property: connectionString
      - key: WEB_CONCURRENCY
        value: "2"
```

Los nombres deben coincidir con tu proyecto. Valida siempre la sintaxis contra la documentación actual de la plataforma.

## 41.2 Pasos

1. Confirma el código en un repositorio privado o público sin secretos.
2. Crea una instancia Blueprint desde `render.yaml`, o configura el servicio manualmente.
3. Espera a que termine la construcción.
4. Revisa los logs sin copiar secretos en una entrega.
5. Abre `/health/`.
6. abre la página principal;
7. comprueba login, permisos, CRUD, venta y reportes;
8. provoca de forma controlada un 404;
9. descarga CSV y Excel;
10. reinicia o vuelve a desplegar y confirma que PostgreSQL conserva los datos.

## 41.3 Usuario administrativo inicial

Si tu plan dispone de consola remota, ejecuta:

```text
python manage.py createsuperuser
```

Si la consola no está disponible, crea un comando de administración de una sola ejecución que lea credenciales desde variables secretas, cree el usuario únicamente si no existe y nunca imprima la contraseña. Elimina esas variables después de usarlo. No agregues credenciales predeterminadas al repositorio ni crees un endpoint público para generar administradores.

## 41.4 Limitaciones del plan gratuito

El plan gratuito es apropiado para aprendizaje y demostración, no para operar el sistema real de una empresa:

- el servicio puede suspenderse tras un periodo sin tráfico y tardar al reactivarse;
- el sistema de archivos local es efímero;
- la base PostgreSQL gratuita tiene capacidad y duración limitadas;
- no incluye las garantías ni copias de seguridad de un entorno productivo.

Por estas razones, la URL entregada demuestra que sabes desplegar. No demuestra que exista un acuerdo de operación, respaldo o soporte para una empresa.

---

# 42. Repositorio profesional

El repositorio debe incluir:

```text
README.md
.env.example
.gitignore
requirements.txt
build.sh
render.yaml
manage.py
config/
aplicaciones/
templates/
static/
```

Y debe excluir:

```text
.env
venv/
__pycache__/
*.pyc
db.sqlite3
media/
staticfiles/
.coverage
htmlcov/
```

El `README.md` debe explicar:

- propósito;
- funciones principales;
- roles de prueba sin contraseñas públicas sensibles;
- requisitos;
- instalación local;
- variables necesarias;
- migraciones;
- ejecución de pruebas;
- creación segura del superusuario;
- estrategia de archivos;
- despliegue;
- limitaciones conocidas.

---

# 43. Uso profesional de IA en esta etapa

La IA puede ayudarte a:

- proponer casos de prueba que no habías considerado;
- explicar un traceback;
- detectar consultas N+1;
- revisar una configuración;
- generar una primera versión de un exportador;
- comparar un cambio con los requisitos;
- redactar un checklist de despliegue.

No debes delegarle:

- secretos reales;
- datos de clientes;
- decisiones de autorización;
- aceptación automática de cambios de seguridad;
- confirmación de que una migración es segura sin revisarla;
- acceso directo a producción sin supervisión.

Prompt útil:

```text
Revisa esta vista Django como revisor de código.

Contexto:
- Django 5.2.
- La operación requiere el permiso ventas.view_venta.
- El reporte acepta desde, hasta y estado.
- La salida puede ser HTML o CSV.

Busca únicamente:
1. fallos de autorización;
2. consultas N+1;
3. entradas sin validar;
4. exposición de datos;
5. inyección de fórmulas en CSV;
6. casos de prueba faltantes.

No reescribas todo. Explica cada riesgo y propón el cambio mínimo.
```

Proceso obligatorio:

```text
Propuesta de IA
      ↓
Comprensión línea por línea
      ↓
Comparación con documentación
      ↓
Pruebas automáticas
      ↓
Prueba manual
      ↓
Decisión documentada
```

Si no puedes explicar un cambio, todavía no debes incorporarlo.

---

# 44. Laboratorio guiado: de vista grande a flujo probado

## Situación

La vista de reporte consulta ventas, calcula totales, crea Excel y decide permisos dentro de una sola función de más de cien líneas.

## Resultado esperado

```text
reportes/
├── forms.py       → validación de filtros
├── selectors.py   → consulta reutilizable
├── exporters.py   → CSV y Excel
├── views.py       → HTTP, permisos y respuesta
└── tests/         → comportamiento verificable
```

## Pasos

1. Escribe una prueba del permiso antes de mover código.
2. Extrae la validación a `ReporteVentasForm`.
3. Extrae la consulta a `ventas_para_reporte()`.
4. Añade `select_related()` donde corresponda.
5. Mide la cantidad de consultas.
6. Extrae los exportadores.
7. Protege campos de texto contra fórmulas.
8. Prueba filtros válidos e inválidos.
9. Prueba una descarga autorizada.
10. Comprueba que el resultado HTML y el archivo usan el mismo conjunto de datos.

## Criterio de éxito

La funcionalidad debe permanecer igual para el usuario, pero cada responsabilidad tendrá un lugar claro y pruebas que detecten regresiones.

---

# 45. Ejercicios guiados

Realiza estos ejercicios en orden. Confirma cada cambio en Git con un mensaje descriptivo.

## Ejercicio guiado 1. Diagnóstico de arquitectura

Abre una vista del sistema que mezcle consultas, reglas, mensajes, exportación o escritura de varios modelos.

1. Identifica qué líneas pertenecen a HTTP.
2. Identifica qué líneas representan una regla empresarial.
3. Identifica qué líneas construyen una consulta.
4. Identifica qué líneas generan una salida.
5. Dibuja la separación propuesta.
6. No refactorices todavía.

Entrega una tabla:

| Responsabilidad | Ubicación actual | Ubicación propuesta | Razón |
|---|---|---|---|
| Autorización | `views.py` | `views.py` | pertenece al acceso HTTP |

## Ejercicio guiado 2. Extraer un selector

Elige la lista de ventas o productos.

1. Mueve la consulta reutilizable a `selectors.py`.
2. Conserva en la vista la lectura de parámetros.
3. Agrega `select_related()` o `prefetch_related()` solo si la pantalla usa esas relaciones.
4. Ejecuta las pruebas existentes.
5. Confirma manualmente que el resultado no cambió.

## Ejercicio guiado 3. Primera prueba de permiso

Escribe tres pruebas para una operación protegida:

1. un usuario anónimo debe ir al login;
2. un usuario autenticado sin permiso debe recibir 403;
3. un usuario con permiso debe recibir 200.

Después elimina temporalmente la protección de la vista y confirma que al menos una prueba falla. Restaura la protección y vuelve a ejecutar las pruebas.

## Ejercicio guiado 4. Detectar N+1

Crea diez ventas con cliente y vendedor. Abre una lista que muestre ambos datos.

1. mide las consultas;
2. anota la cantidad inicial;
3. aplica la optimización adecuada;
4. vuelve a medir;
5. explica por qué elegiste `select_related()` o `prefetch_related()`.

No evalúes la mejora solamente por la velocidad visual en una base pequeña.

## Ejercicio guiado 5. Reporte por periodo

Crea un formulario GET con `desde`, `hasta` y `estado`.

1. valida que las fechas existan;
2. rechaza el orden incorrecto;
3. limita el rango;
4. muestra filtros aplicados;
5. muestra un estado vacío si no hay datos;
6. conserva los filtros al enviar el formulario.

## Ejercicio guiado 6. Exportación CSV

A partir del mismo selector del reporte:

1. genera un CSV UTF-8;
2. incluye encabezados;
3. protege texto que empiece con caracteres de fórmula;
4. aplica el permiso correcto;
5. exporta solo el periodo solicitado;
6. abre el archivo en una hoja de cálculo y verifica columnas y acentos.

## Ejercicio guiado 7. Configuración de producción

1. divide la configuración en `base.py`, `development.py` y `production.py`;
2. mueve `SECRET_KEY` a una variable;
3. configura `DEBUG=False` en producción;
4. crea `.env.example` sin valores reales;
5. confirma que `.env` está ignorado;
6. ejecuta `check --deploy`;
7. registra cada advertencia y su solución.

## Ejercicio guiado 8. Simulación de error

En desarrollo, provoca un error controlado en una ruta temporal.

1. verifica que se registre el traceback en el log;
2. confirma que el mensaje público no revele detalles;
3. activa `DEBUG=False` en un entorno local controlado;
4. comprueba la página 500;
5. elimina la ruta temporal antes de confirmar el código.

---

# 46. Ejercicios individuales obligatorios

## Ejercicio 1. Vista delgada

Recibes una vista que valida stock, crea una venta, actualiza productos y prepara mensajes. Refactorízala para que la vista se limite a autorización, validación del formulario, llamada al servicio y respuesta. Entrega el antes, el después y una explicación de cinco a ocho líneas.

## Ejercicio 2. Excepción empresarial

Crea una excepción propia para un caso empresarial real, por ejemplo `StockInsuficiente`. Haz que el servicio la lance y que la vista la transforme en un mensaje comprensible. No muestres información interna ni captures todas las excepciones con `except Exception`.

## Ejercicio 3. Restricción probada

Elige una restricción crítica de un modelo. Escribe una prueba válida y una inválida. Si la regla existe solo en un formulario, explica por qué debe o no debe reforzarse en el modelo o la base de datos.

## Ejercicio 4. Transacción completa

Escribe una prueba que obligue a fallar el segundo paso de una operación con varios registros. Comprueba que el primer paso tampoco permanezca guardado. Adjunta el nombre exacto de la prueba y el resultado de ejecución.

## Ejercicio 5. Autorización directa

Elige una URL cuyo botón ya se oculte a usuarios sin permiso. Solicita esa URL directamente en una prueba y verifica 403. Si la prueba revela una vulnerabilidad, corrige la vista y documenta el hallazgo.

## Ejercicio 6. Consulta creciente

Crea una prueba o medición con una venta y otra con veinte. Comprueba que la cantidad de consultas para la lista no crezca una por cada venta. Explica qué relación causaba o podía causar N+1.

## Ejercicio 7. Agregación

Construye una consulta que calcule cantidad de ventas e ingresos por estado. Crea datos conocidos y verifica manualmente tres resultados. No sumes en un bucle de Python si la base puede realizar la operación.

## Ejercicio 8. Índice justificado

Propón un índice para un filtro real del sistema. Entrega la consulta que lo utiliza, el modelo, la migración y una justificación. También explica por qué no conviene indexar todos los campos.

## Ejercicio 9. CSV malicioso

Crea un cliente de prueba cuyo nombre sea `=2+2`. Exporta el reporte y comprueba que la celda se trate como texto. Incluye una prueba automática del helper o del exportador.

## Ejercicio 10. Excel profesional

Genera un archivo `.xlsx` con título de hoja, encabezado, filtros, panel congelado, formato de fecha y ancho legible. Debe contener únicamente el periodo autorizado y abrir sin advertencias de archivo dañado.

## Ejercicio 11. Auditoría de secretos

Revisa el historial actual y los archivos versionados en busca de `.env`, claves, contraseñas, URLs con credenciales y tokens. Si encuentras un secreto real, revócalo o rótalo; borrarlo del archivo actual no es suficiente. Entrega una lista de comprobación sin mostrar el valor.

## Ejercicio 12. Prueba de despliegue repetido

Publica una versión, crea datos de demostración en PostgreSQL y vuelve a desplegar. Comprueba que los datos permanezcan. Explica por qué los archivos locales subidos no ofrecen la misma garantía en el plan utilizado.

---

# 47. Retos adicionales

Estos retos no son obligatorios para aprobar, pero preparan un proyecto más sólido.

## Reto 1. Prueba del archivo descargado

Escribe una prueba que confirme el tipo de contenido, el nombre del archivo, los encabezados y al menos una fila del CSV.

## Reto 2. Libro Excel de varias hojas

Crea una hoja de resumen y otra de detalle. Ambas deben derivarse del mismo periodo y respetar permisos.

## Reto 3. Presupuesto de consultas

Define un máximo razonable de consultas para el panel y crea una prueba que falle si una modificación lo supera.

## Reto 4. Registro estructurado

Agrega a un evento crítico el identificador del usuario, el identificador de la operación y el estado, sin guardar datos personales ni secretos.

## Reto 5. PostgreSQL local

Configura un entorno local separado con PostgreSQL y ejecuta toda la batería de pruebas. Documenta cualquier diferencia encontrada frente a SQLite.

## Reto 6. Exportación de gran tamaño

Investiga el modo de escritura de OpenPyXL y explica cuándo una exportación debería ejecutarse fuera de una solicitud web. No agregues infraestructura innecesaria al proyecto del módulo.

---

# 48. Mini proyecto: Centro de Reportes Empresariales

## Situación

La gerencia necesita consultar resultados sin revisar registros uno por uno. Crearás un centro de reportes para el sistema construido durante el curso.

## Objetivo

Construir un área protegida con indicadores, filtros y exportaciones reutilizando las reglas existentes.

## Requisitos funcionales

El centro debe incluir:

1. acceso exclusivo para usuarios con permiso;
2. filtro por fecha inicial y final;
3. filtro opcional por estado;
4. cantidad de ventas del periodo;
5. total vendido según la regla de estados;
6. productos con stock bajo;
7. resultados por vendedor cuando el rol pueda verlos;
8. tabla de resultados paginada;
9. exportación CSV;
10. exportación Excel;
11. estado vacío;
12. mensajes de filtros inválidos.

## Requisitos técnicos

- formulario de filtros;
- selector reutilizable;
- agregaciones del ORM;
- optimización de relaciones;
- protección contra fórmulas en archivos;
- nombres de archivo claros;
- mínimo seis pruebas relevantes;
- interfaz responsive;
- sin lógica empresarial en templates.

## Datos de prueba obligatorios

Prepara como mínimo:

- dos vendedores;
- cinco productos;
- doce ventas en fechas diferentes;
- dos estados de venta;
- dos productos con stock bajo;
- un periodo sin resultados;
- un texto que comience con `=` para comprobar la exportación.

## Entregable del mini proyecto

Incluye dentro de la entrega principal:

```text
mini_proyecto_reportes/
├── capturas/
├── casos_probados.md
└── evidencia_exportaciones/
```

## Criterios de aprobación

| Criterio | Puntos |
|---|---:|
| Filtros y resultados correctos | 5 |
| Permisos y validaciones | 4 |
| CSV y Excel seguros | 4 |
| ORM y organización | 4 |
| Pruebas y presentación | 3 |
| **Total** | **20** |

El mini proyecto se aprueba con al menos **16 de 20 puntos** y sin fallos críticos de autorización o datos.

---

# 49. Proyecto del módulo: Versión Candidata del Sistema Empresarial

## Contexto

Una pequeña empresa ha probado las funciones principales del sistema. Antes de presentarlo como proyecto final, necesita una versión candidata instalada en un entorno web, con pruebas, reportes, configuración segura y documentación reproducible.

## Objetivo

Transformar el sistema acumulado de los módulos anteriores en una aplicación revisable y desplegada.

## Requisitos funcionales

La versión candidata debe conservar:

- autenticación;
- roles y permisos;
- gestión de clientes;
- gestión de productos;
- inventario;
- ventas con detalles;
- reglas transaccionales;
- panel o centro de reportes;
- CSV y Excel;
- páginas de error coherentes.

## Requisitos de arquitectura

1. aplicaciones separadas por dominio;
2. vistas delgadas;
3. servicios para operaciones con reglas o varios modelos;
4. selectores para consultas complejas reutilizadas;
5. formularios para validar entradas;
6. templates sin reglas empresariales;
7. nombres claros;
8. ausencia de duplicación importante;
9. dependencias justificadas;
10. migraciones confirmadas.

## Requisitos de pruebas

Incluye al menos **18 pruebas automáticas** distribuidas así:

| Área | Mínimo |
|---|---:|
| Modelos y restricciones | 3 |
| Formularios | 3 |
| Autenticación y permisos | 4 |
| Servicios y transacciones | 4 |
| Vistas y reportes | 4 |

La cantidad mínima no sustituye la calidad. Deben cubrir al menos:

- una ruta anónima;
- una ruta sin permiso;
- una operación autorizada;
- una transacción exitosa;
- una transacción con retroceso;
- una validación empresarial;
- un reporte filtrado;
- una exportación protegida.

## Requisitos de rendimiento

- revisar al menos dos vistas contra N+1;
- usar `select_related()` o `prefetch_related()` con justificación;
- medir una vista importante;
- implementar al menos un índice justificado;
- paginar listas que puedan crecer;
- limitar el rango de reportes.

## Requisitos de producción

- configuración separada por entorno;
- `DEBUG=False`;
- `SECRET_KEY` externa;
- `ALLOWED_HOSTS` correcto;
- cookies seguras bajo HTTPS;
- PostgreSQL desplegado;
- archivos estáticos funcionales;
- estrategia persistente para imágenes o carga deshabilitada en la demo;
- `check --deploy` revisado;
- ruta de salud;
- logs sin secretos;
- servicio iniciado con servidor de producción;
- URL HTTPS funcional.

## Requisitos de documentación

El `README.md` debe permitir que otra persona:

1. entienda el problema;
2. conozca los roles;
3. instale el proyecto;
4. configure variables;
5. ejecute migraciones;
6. cargue datos de demostración;
7. ejecute pruebas;
8. publique la aplicación;
9. conozca limitaciones.

Incluye un diagrama breve:

```text
Navegador
   ↓
URLs y vistas
   ↓
Formularios / servicios / selectores
   ↓
Modelos y ORM
   ↓
PostgreSQL
```

## Datos de demostración

Usa datos ficticios. No subas información real de personas o empresas.

Incluye un comando propio:

```powershell
python manage.py cargar_demo
```

El comando debe ser seguro al repetirse o explicar claramente si borra datos. No debe ejecutarse en producción sin una decisión consciente.

## Definición de terminado

El proyecto se considera listo para revisión cuando:

```text
✓ instala desde cero
✓ aplica migraciones
✓ carga datos ficticios
✓ supera las pruebas
✓ supera la revisión de despliegue
✓ funciona por HTTPS
✓ conserva datos en PostgreSQL tras un despliegue
✓ respeta permisos por URL
✓ exporta CSV y Excel
✓ no contiene secretos
✓ explica sus limitaciones
```

---

# 50. Estructura de la entrega

Nombre del archivo:

```text
COA_DJANGO_M6_Nombre_Apellido.zip
```

Estructura:

```text
COA_DJANGO_M6_Nombre_Apellido/
├── README_ENTREGA.md
├── enlace_repositorio.txt
├── enlace_aplicacion.txt
├── evidencia_pruebas.txt
├── evidencia_check_deploy.txt
├── decisiones_arquitectura.md
├── estrategia_archivos.md
├── uso_ia.md
├── capturas/
│   ├── 01_login.png
│   ├── 02_permisos.png
│   ├── 03_dashboard.png
│   ├── 04_reporte_filtrado.png
│   ├── 05_csv.png
│   ├── 06_excel.png
│   ├── 07_error_404.png
│   └── 08_aplicacion_publicada.png
└── proyecto/
```

No incluyas:

- entorno virtual;
- `.env`;
- contraseñas;
- base de datos con datos reales;
- carpetas generadas;
- archivos privados de usuarios;
- capturas que revelen secretos.

`uso_ia.md` debe indicar:

| Tarea | Herramienta | Propuesta recibida | Cómo se verificó | Decisión final |
|---|---|---|---|---|

Si no utilizaste IA, indícalo. No inventes interacciones.

---

# 51. Rúbrica del proyecto del módulo

| Criterio | Excelente | Aceptable | Insuficiente | Puntos |
|---|---|---|---|---:|
| Funcionalidad | flujos completos, consistentes y sin errores críticos | funciones principales operan con detalles menores | flujos incompletos o datos incorrectos | 10 |
| Arquitectura | responsabilidades claras y reutilización justificada | separación general con algunas mezclas | vista monolítica, duplicación o reglas dispersas | 8 |
| Pruebas | casos críticos, permisos y fallos bien cubiertos | cumple mínimos con casos relevantes | pruebas decorativas, frágiles o ausentes | 8 |
| Seguridad | secretos externos, permisos por URL y configuración revisada | protección principal correcta con mejoras menores | secretos, `DEBUG=True` o acceso indebido | 7 |
| ORM y rendimiento | N+1 medido, consultas e índices justificados | optimización básica correcta | consultas repetidas o cargas sin límite | 5 |
| Reportes | filtros, métricas y archivos correctos y seguros | reportes funcionales con detalles menores | resultados incorrectos o exportación insegura | 4 |
| Despliegue | HTTPS, PostgreSQL, estáticos y salud verificables | despliegue funcional con limitación documentada | no inicia, pierde datos o no es verificable | 4 |
| Documentación y Git | instalación reproducible, historial claro y limitaciones | documentación suficiente | no se puede instalar o revisar | 3 |
| Diseño y experiencia | interfaz coherente, responsive y con estados claros | usable con detalles visuales menores | confusa, rota o sin retroalimentación | 1 |
| **Total** |  |  |  | **50** |

## Condiciones críticas

El proyecto no se aprueba aunque alcance el puntaje si:

- contiene un secreto real;
- funciona con `DEBUG=True` públicamente;
- permite una operación sensible sin autorización;
- guarda datos parcialmente tras una operación fallida;
- utiliza información real sin permiso;
- no puede instalarse o ejecutarse;
- no tiene pruebas de los procesos críticos;
- presenta datos del reporte que contradicen las reglas del sistema.

---

# 52. Evaluación práctica del módulo

## Modalidad

Resolverás un cambio solicitado sobre una copia limpia del proyecto. Tiempo sugerido: **35 minutos**.

## Caso

La gerencia solicita un reporte de productos con stock bajo. Solo el rol autorizado puede verlo y descargarlo. La entrega actual realiza una consulta por cada categoría y exporta cualquier texto sin protección.

## Tareas

1. crea un formulario con límite de stock y categoría opcional;
2. valida que el límite sea positivo y razonable;
3. protege la vista con permiso;
4. construye un selector optimizado;
5. muestra producto, categoría, stock y fecha de actualización;
6. crea una descarga CSV segura;
7. escribe una prueba sin permiso;
8. escribe una prueba del filtro;
9. escribe una prueba del CSV;
10. explica una decisión de rendimiento.

## Rúbrica

| Criterio | Puntos |
|---|---:|
| Validación y resultado correcto | 4 |
| Permiso aplicado en servidor | 3 |
| Consulta sin N+1 | 2 |
| CSV seguro | 2 |
| Pruebas relevantes | 3 |
| Explicación técnica | 1 |
| **Total** | **15** |

La evaluación se aprueba con al menos **12 de 15 puntos** y sin fallo de autorización.

---

# 53. Distribución de la calificación

| Componente | Puntos |
|---|---:|
| Ejercicios obligatorios | 15 |
| Mini proyecto | 20 |
| Proyecto del módulo | 50 |
| Evaluación práctica | 15 |
| **Total** | **100** |

Para aprobar:

- obtén al menos **80 de 100 puntos**;
- aprueba el proyecto del módulo;
- aprueba la evaluación práctica;
- corrige todas las condiciones críticas;
- entrega una URL y un repositorio revisables.

---

# 54. Punto de entrega único

Utiliza un solo punto de entrega para todo el Módulo 6.

En el campo de identificación escribe:

```text
Módulo 6 — Nombre completo — Versión Candidata
```

Adjunta:

1. `COA_DJANGO_M6_Nombre_Apellido.zip`;
2. enlace del repositorio;
3. enlace de la aplicación;
4. evidencia del resultado de pruebas;
5. evidencia de `check --deploy`;
6. capturas solicitadas;
7. explicación de arquitectura;
8. estrategia de archivos;
9. registro de uso de IA.

Si el formulario no acepta el tamaño del ZIP, sube el archivo a un servicio autorizado y entrega un enlace con permiso de lectura. Comprueba el acceso desde una sesión privada.

No envíes un formulario por ejercicio. Todos los ejercicios, mini proyecto, evaluación y proyecto se agrupan en esta entrega.

[Entregar el Módulo 6](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 55. Proceso de revisión y corrección

```text
Entrega
   ↓
Revisión del instructor
   ↓
¿Cumple requisitos y condiciones críticas?
   ├── Sí → Módulo 6 aprobado
   └── No → retroalimentación y corrección
                    ↓
               nueva revisión
```

Una corrección debe incluir:

- requisito observado;
- causa del problema;
- cambio aplicado;
- prueba añadida o ejecutada;
- evidencia nueva.

No borres evidencia de la primera versión. Registra el cambio en Git.

---

# 56. Errores comunes y cómo corregirlos

## Error 1. Crear carpetas de arquitectura sin separar responsabilidades

Mover una función a `services.py` no mejora el diseño si sigue mezclando solicitud HTTP, reglas y presentación.

**Corrección:** define primero la responsabilidad y después decide el archivo.

## Error 2. Probar solo el camino exitoso

Una venta válida no demuestra que la transacción retroceda cuando falla el último detalle.

**Corrección:** prueba éxito, límites, permisos y fallos intermedios.

## Error 3. Ocultar botones como única autorización

El usuario puede escribir la URL.

**Corrección:** protege la vista y crea una prueba directa.

## Error 4. Optimizar sin medir

Agregar precargas innecesarias también consume memoria y puede complicar consultas.

**Corrección:** observa la pantalla, mide y optimiza la relación utilizada.

## Error 5. Calcular reportes con ciclos innecesarios

Cargar todas las ventas y sumarlas en Python desperdicia trabajo que la base puede hacer.

**Corrección:** usa `aggregate()` y `annotate()`.

## Error 6. Exportar un QuerySet diferente al mostrado

El usuario filtra un periodo, pero el CSV contiene todos los registros.

**Corrección:** reutiliza el mismo selector validado.

## Error 7. Confiar en texto de usuarios dentro de Excel

Un valor que comienza con `=` puede interpretarse como fórmula.

**Corrección:** neutraliza los campos de texto y prueba el caso.

## Error 8. Confirmar `.env` por accidente

Agregarlo después a `.gitignore` no borra el secreto del historial.

**Corrección:** rota la credencial y sigue un proceso seguro de limpieza del historial si es necesario.

## Error 9. Publicar con `DEBUG=True`

Una página de error puede revelar configuración y rutas.

**Corrección:** configuración separada, variable de entorno y comprobación real de producción.

## Error 10. Usar `runserver` públicamente

El servidor de desarrollo no es el servidor de producción.

**Corrección:** utiliza Gunicorn con la aplicación WSGI o ASGI correcta.

## Error 11. Guardar archivos subidos en disco efímero

Las imágenes desaparecen tras un reinicio o despliegue.

**Corrección:** almacenamiento externo persistente o carga deshabilitada en la demo.

## Error 12. Creer que desplegar equivale a operar profesionalmente

Un plan gratuito no ofrece automáticamente respaldo, disponibilidad, soporte o cumplimiento.

**Corrección:** declara el alcance de demostración y diseña un plan operativo antes de vender el sistema.

## Error 13. Ejecutar migraciones al iniciar cada proceso

Varios procesos pueden competir o bloquear el arranque.

**Corrección:** una fase única de migración o predespliegue.

## Error 14. Copiar configuración de una versión antigua

Los proveedores, paquetes y recomendaciones cambian.

**Corrección:** usa el video para comprender el flujo y la documentación oficial para aplicar la configuración actual.

---

# Recomendaciones del instructor

1. **Escribe la prueba antes de una refactorización crítica.** Así podrás comprobar que el comportamiento se conserva.
2. **Publica una primera versión pequeña temprano.** Detectar un problema de entorno al final suele costar más tiempo.
3. **No persigas una arquitectura perfecta.** Extrae aquello que ya tiene una responsabilidad clara o se reutiliza.
4. **Prueba la autorización escribiendo la URL.** La interfaz nunca debe ser la única barrera.
5. **Usa datos de demostración diseñados.** Incluye límites, estados vacíos y errores; no solo registros felices.
6. **Lee el primer error real del log.** Los mensajes posteriores pueden ser consecuencias.
7. **Cambia una cosa por vez durante el despliegue.** Confirma el resultado antes de agregar otra configuración.
8. **Conserva una lista de decisiones.** En una revisión profesional importa tanto el resultado como poder explicarlo.
9. **No prometas operación empresarial con una demo gratuita.** Presenta con claridad persistencia, respaldo, soporte y límites.
10. **Cuando la IA proponga una solución extensa, solicita el cambio mínimo.** Será más sencillo entenderlo, probarlo y revertirlo.

---

# 57. Buenas prácticas del módulo

- Refactoriza en pasos pequeños respaldados por pruebas.
- Mantén las reglas empresariales fuera del template.
- Nombra servicios con verbos: `registrar_venta`, `anular_venta`.
- Nombra selectores por el resultado que ofrecen.
- Valida todos los parámetros de reportes.
- Autoriza tanto la vista HTML como cada exportación.
- No registres contraseñas, tokens ni contenido privado.
- Mide consultas sobre datos representativos.
- Limita rangos y pagina resultados.
- Usa la base para filtrar y agregar.
- Prueba las restricciones en la capa donde realmente se aplican.
- Ejecuta pruebas antes de publicar.
- Ejecuta la revisión de despliegue con la configuración real.
- Mantén las migraciones en Git.
- Usa PostgreSQL para la validación final.
- Conserva archivos subidos en almacenamiento persistente.
- Documenta limitaciones y decisiones.
- Revisa cada sugerencia de IA antes de integrarla.
- Mantén un historial Git entendible.
- Trata la URL pública como una demostración hasta disponer de operación profesional.

---

# 58. Videos recomendados

Los videos son apoyo visual. La documentación oficial enlazada después es la referencia para Django 5.2 y para la configuración actual del proveedor.

## 1. Fundamentos de pruebas unitarias en Django

**Canal:** DesarrolloLibre Software Development Blog  
**Tema:** estructura básica de pruebas en Django  
[Ver video en YouTube](https://www.youtube.com/watch?v=NrtCcdfQC5M)

Úsalo antes de escribir la primera clase de pruebas.

## 2. Uso de `TestCase` en Django

**Canal:** Developer.pe  
**Tema:** clase `TestCase` y preparación de datos  
[Ver video en YouTube](https://www.youtube.com/watch?v=1eF7A6wAFPE)

El video utiliza una versión anterior de Django. La idea de `TestCase` sigue siendo útil, pero adapta el código a la documentación de Django 5.2 y no instales Factory Boy para completar este módulo.

## 3. Variables de entorno y seguridad

**Canal:** Código para Principiantes  
**Tema:** retirar información sensible de la configuración  
[Ver video en YouTube](https://www.youtube.com/watch?v=bJdASa5-Fw0)

Aplica el concepto con la estructura de configuración indicada en este módulo.

## 4. Escribir CSV con Django

**Canal:** Andrés Cruz  
**Tema:** respuesta descargable en formato CSV  
[Ver video en YouTube](https://www.youtube.com/watch?v=Ejgd6ZIluO8)

Complementa el ejemplo con permisos, filtros y protección contra fórmulas.

## 5. OpenPyXL: crear e insertar datos en Excel

**Canal:** MATHS AND CODES  
**Tema:** fundamentos de libros, hojas y celdas con OpenPyXL  
[Ver video en YouTube](https://www.youtube.com/watch?v=RzI8n9HHbts)

El canal es pequeño y el video se concentra en la biblioteca. En Django, el libro debe guardarse en una respuesta HTTP.

## 6. Conectar PostgreSQL con Django

**Canal:** Código Facilito  
**Tema:** relación entre la configuración de Django y PostgreSQL  
[Ver video en YouTube](https://www.youtube.com/watch?v=RNFrlYO4_6g)

Es un recurso conceptual de una versión anterior. En este módulo utiliza `psycopg` 3, `DATABASE_URL` y la documentación actual.

## 7. Desplegar Django en Render

**Canal:** XAVII07  
**Tema:** flujo completo de publicación en Render  
[Ver video en YouTube](https://www.youtube.com/watch?v=Bfu-HqcRoRs)

El proveedor puede cambiar su interfaz y sus planes. Contrasta cada paso con la guía oficial de Render antes de publicar.

---

# 59. Documentación oficial y recursos confiables

## Pruebas

- [Descripción general de pruebas en Django 5.2](https://docs.djangoproject.com/en/5.2/topics/testing/overview/)
- [Herramientas de pruebas de Django](https://docs.djangoproject.com/en/5.2/topics/testing/tools/)
- [Pruebas avanzadas](https://docs.djangoproject.com/en/5.2/topics/testing/advanced/)
- [Tutorial de pruebas de Django en español — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Server-side/Django/Testing)

## Base de datos y rendimiento

- [Optimización del acceso a la base de datos](https://docs.djangoproject.com/en/5.2/topics/db/optimization/)
- [Referencia de `QuerySet`](https://docs.djangoproject.com/en/5.2/ref/models/querysets/)
- [Agregaciones](https://docs.djangoproject.com/en/5.2/topics/db/aggregation/)
- [Índices de modelos](https://docs.djangoproject.com/en/5.2/ref/models/indexes/)
- [Transacciones](https://docs.djangoproject.com/en/5.2/topics/db/transactions/)
- [Notas de PostgreSQL en Django](https://docs.djangoproject.com/en/5.2/ref/databases/#postgresql-notes)

## Reportes y archivos

- [Crear archivos CSV con Django](https://docs.djangoproject.com/en/5.2/howto/outputting-csv/)
- [Documentación de OpenPyXL](https://openpyxl.readthedocs.io/en/stable/)
- [Archivos estáticos de Django](https://docs.djangoproject.com/en/5.2/ref/contrib/staticfiles/)
- [Publicar archivos estáticos](https://docs.djangoproject.com/en/5.2/howto/static-files/deployment/)
- [WhiteNoise para Django](https://whitenoise.readthedocs.io/en/stable/django.html)
- [Integración de Cloudinary con Django](https://cloudinary.com/documentation/django_integration)

## Configuración, registros y despliegue

- [Referencia de configuración de Django](https://docs.djangoproject.com/en/5.2/ref/settings/)
- [Comprobaciones del sistema](https://docs.djangoproject.com/en/5.2/ref/checks/)
- [Checklist oficial de despliegue](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
- [Logging en Django](https://docs.djangoproject.com/en/5.2/howto/logging/)
- [Reportes de errores de Django](https://docs.djangoproject.com/en/5.2/howto/error-reporting/)
- [Guía oficial para desplegar Django en Render](https://render.com/docs/deploy-django)
- [Servicios web de Render](https://render.com/docs/web-services)
- [PostgreSQL en Render](https://render.com/docs/postgresql)
- [Limitaciones de recursos gratuitos de Render](https://render.com/docs/free)
- [Infraestructura como código con `render.yaml`](https://render.com/docs/infrastructure-as-code)

## Cómo estudiar estos recursos

1. localiza el problema concreto;
2. lee la sección vinculada;
3. confirma que corresponde a Django 5.2 o a la versión actual del servicio;
4. implementa el cambio mínimo;
5. crea una prueba;
6. registra la decisión.

No copies un archivo completo de configuración si solo necesitas comprender una opción.

---

# 60. Material complementario

Este módulo necesita pocos materiales descargables. Se recomiendan únicamente:

## 1. Plantilla de matriz de pruebas

| Identificador | Requisito | Preparación | Acción | Resultado esperado | Resultado real |
|---|---|---|---|---|---|

## 2. Checklist de despliegue

Una copia imprimible del checklist final de este módulo.

## 3. Plantilla `.env.example`

```dotenv
DJANGO_SETTINGS_MODULE=config.settings.development
SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://localhost:8000
DATABASE_URL=
```

## 4. Plantilla de decisiones técnicas

```text
Decisión:
Problema:
Opciones consideradas:
Opción elegida:
Razón:
Riesgos:
Cómo se verificó:
```

No necesitas un PDF que repita todo el contenido. Estas plantillas pueden aparecer en la página y descargarse como texto editable.

---

# 61. Glosario

**Agregación:** cálculo resumido sobre un conjunto de registros, como suma o cantidad.

**ASGI:** interfaz moderna entre servidores y aplicaciones Python, compatible con capacidades asíncronas.

**Build:** fase que instala dependencias y prepara el proyecto para ejecutarse.

**Cobertura:** medida de qué partes del código fueron ejecutadas por pruebas; no garantiza calidad por sí sola.

**CSV:** formato de texto tabular separado por delimitadores.

**Despliegue:** proceso de publicar una versión ejecutable en un entorno.

**Entorno:** conjunto de configuración y recursos para desarrollo, prueba o producción.

**HSTS:** política del navegador que obliga a usar HTTPS durante un periodo.

**Índice:** estructura de base de datos que acelera ciertas consultas con un costo de almacenamiento y escritura.

**Log:** registro técnico de eventos de la aplicación.

**Migración:** cambio versionado en el esquema o estado estructural de la base de datos.

**N+1:** patrón de consultas donde una consulta inicial provoca otra consulta por cada resultado.

**PostgreSQL:** motor de base de datos relacional utilizado en el despliegue del módulo.

**Producción:** entorno accesible para el uso previsto, con configuración y operación controladas.

**Prueba de integración:** prueba que verifica la colaboración entre varias partes.

**Prueba de regresión:** prueba creada para impedir que un error corregido reaparezca.

**QuerySet:** representación perezosa de una consulta del ORM de Django.

**Rollback:** reversión completa de una transacción fallida.

**Selector:** función que encapsula una consulta de lectura reutilizable.

**Servicio:** función o clase que representa una operación empresarial.

**Static files:** archivos que forman parte del código visual o frontend del proyecto.

**Media files:** archivos subidos durante el uso de la aplicación.

**Versión candidata:** versión que cumple requisitos y está lista para revisión final, no necesariamente para operar una empresa real.

**WhiteNoise:** herramienta para servir archivos estáticos desde una aplicación Python.

**WSGI:** interfaz tradicional entre servidores web y aplicaciones Python.

---

# 62. Resumen del módulo

En este módulo convertiste una aplicación funcional en una versión candidata profesional.

Aprendiste a:

- organizar por responsabilidades;
- mantener vistas delgadas;
- extraer servicios y selectores;
- escribir pruebas de modelos, formularios, vistas, permisos y transacciones;
- detectar N+1;
- optimizar relaciones;
- crear agregaciones e índices justificados;
- construir reportes HTML, CSV y Excel;
- proteger exportaciones;
- separar configuración por entorno;
- proteger secretos;
- configurar logs y páginas de error;
- utilizar PostgreSQL;
- preparar estáticos y multimedia;
- ejecutar comprobaciones de despliegue;
- publicar con HTTPS;
- documentar el proyecto;
- validar propuestas de IA.

El cambio principal puede resumirse así:

```text
Antes: “la aplicación funciona en mi computadora”

Ahora: “la aplicación se instala, se prueba, se publica y se puede revisar”
```

---

# 63. Checklist final del estudiante

## Arquitectura

- [ ] Las aplicaciones tienen responsabilidades claras.
- [ ] Las vistas coordinan y no concentran reglas.
- [ ] Las operaciones críticas están en servicios.
- [ ] Las consultas reutilizables están separadas.
- [ ] Los templates no deciden reglas empresariales.

## Pruebas

- [ ] Todas las pruebas terminan correctamente.
- [ ] Existen pruebas de modelos y formularios.
- [ ] Existen pruebas de permisos por URL.
- [ ] Existen pruebas de transacciones y rollback.
- [ ] Existen pruebas de reportes y exportaciones.
- [ ] Las pruebas no dependen de producción ni de su orden.

## Rendimiento y reportes

- [ ] Revisé al menos dos vistas contra N+1.
- [ ] Medí la cantidad de consultas.
- [ ] Justifiqué al menos un índice.
- [ ] Los reportes validan el periodo.
- [ ] CSV y Excel respetan los filtros.
- [ ] Los textos se protegen contra fórmulas.

## Seguridad y configuración

- [ ] No hay secretos en Git ni en la entrega.
- [ ] `DEBUG=False` en la aplicación pública.
- [ ] `ALLOWED_HOSTS` y orígenes confiables están configurados.
- [ ] Los permisos se aplican en servidor.
- [ ] Los logs no exponen datos sensibles.
- [ ] `check --deploy` fue revisado.

## Despliegue

- [ ] La aplicación funciona por HTTPS.
- [ ] PostgreSQL está conectado.
- [ ] Las migraciones están aplicadas.
- [ ] Los archivos estáticos cargan.
- [ ] Existe una estrategia persistente para multimedia.
- [ ] La ruta de salud responde.
- [ ] Los datos permanecen tras un nuevo despliegue.
- [ ] Las limitaciones del plan están documentadas.

## Entrega

- [ ] El ZIP tiene el nombre solicitado.
- [ ] El repositorio puede abrirse.
- [ ] La URL puede abrirse.
- [ ] El README permite instalar el proyecto.
- [ ] Las capturas no muestran secretos.
- [ ] El uso de IA está documentado con honestidad.

---

# Cierre del módulo

La versión candidata es la base del **Proyecto Final Integrador**. Todavía no avances al Módulo 7.

Primero debes:

1. enviar el punto de entrega único;
2. recibir la revisión del instructor;
3. corregir observaciones;
4. obtener la aprobación del proyecto del módulo.

Cuando el Módulo 6 esté aprobado, podrás comenzar el cierre completo de la Ruta Python de COA.
