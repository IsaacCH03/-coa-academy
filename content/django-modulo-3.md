# Módulo 3. Modelos, relaciones, ORM y administración

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 7 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Tecnologías:** Django 5.2 LTS, SQLite y Django ORM  
**Mini proyecto:** Biblioteca Administrable  
**Proyecto del módulo:** Núcleo de Inventario Empresarial

---

# Introducción

En los módulos anteriores construiste el recorrido web y la capa visual de una aplicación:

```text
URL → vista → contexto → template → respuesta
```

Los datos todavía provenían de listas y diccionarios escritos dentro de Python. Esa solución permite practicar vistas y templates, pero no sirve para una aplicación empresarial real:

```python
productos = [
    {"nombre": "Teclado", "precio": 25, "existencias": 8},
    {"nombre": "Monitor", "precio": 180, "existencias": 3},
]
```

Al detener el servidor, modificar el archivo o trabajar con cientos de registros aparecen problemas:

- la información no puede administrarse con seguridad;
- no existen relaciones confiables;
- dos registros pueden contradecirse;
- buscar o actualizar datos se vuelve difícil;
- el programa mezcla datos, lógica y presentación;
- varias personas no pueden trabajar con la misma información.

En este módulo reemplazarás los datos temporales por una estructura persistente:

```text
Interfaz Django
      ↓
     ORM
      ↓
Modelos y relaciones
      ↓
Base de datos SQLite
```

El ORM de Django permite trabajar con la base de datos mediante objetos y métodos de Python. No elimina la necesidad de comprender SQL. Al contrario: los conocimientos de tablas, claves, relaciones e integridad permiten diseñar mejores modelos y comprender lo que el ORM ejecuta.

La meta no es memorizar todos los campos ni todas las consultas posibles. La meta es aprender a:

- diseñar antes de programar;
- transformar entidades en modelos;
- proteger la integridad de los datos;
- cambiar el esquema mediante migraciones;
- consultar información con intención;
- detectar consultas innecesarias;
- administrar datos desde una herramienta interna.

Al finalizar, el sitio del módulo anterior dejará de ser una demostración visual y tendrá el núcleo de datos de un sistema empresarial.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- identificar entidades, atributos y relaciones;
- crear un diagrama entidad-relación;
- convertir tablas SQL en modelos Django;
- seleccionar campos y opciones adecuados;
- distinguir `null` de `blank`;
- utilizar valores predeterminados, opciones e índices;
- definir restricciones de unicidad y validaciones básicas;
- crear relaciones uno a muchos, muchos a muchos y uno a uno;
- elegir conscientemente un comportamiento `on_delete`;
- comprender la integridad referencial;
- configurar un modelo de usuario personalizado desde el inicio;
- crear, leer e interpretar migraciones;
- aplicar cambios al esquema sin editar la base directamente;
- utilizar la consola de Django de forma responsable;
- crear, consultar, modificar y eliminar registros mediante el ORM;
- utilizar `get`, `filter`, `exclude` y `order_by`;
- realizar búsquedas con `Q`;
- actualizar valores con `F`;
- calcular agregaciones iniciales;
- recorrer relaciones desde ambos sentidos;
- reconocer y corregir el problema N+1;
- crear datos de prueba reproducibles;
- registrar y personalizar modelos en Django Admin;
- diferenciar el panel administrativo de la aplicación pública;
- revisar diseños y consultas con IA sin delegar decisiones críticas.

---

# Conocimientos previos

Antes de comenzar debes poder:

- crear y ejecutar un proyecto Django;
- crear aplicaciones y conectarlas al proyecto;
- utilizar URLs, vistas y templates;
- trabajar con clases y objetos de Python;
- comprender tablas, filas y columnas;
- reconocer una clave primaria y una clave foránea;
- utilizar Git y crear commits.

Si completaste la ruta de COA, estos conocimientos provienen de Programación Orientada a Objetos, SQL y Bases de Datos, Python Práctico y los módulos anteriores de este curso.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Diseño de datos y diagrama entidad-relación | 35 minutos |
| Modelos, campos y migraciones | 1 hora |
| Relaciones e integridad | 50 minutos |
| Consultas y operaciones con el ORM | 1 hora y 10 minutos |
| Administración, datos de prueba y comprobación | 45 minutos |
| Laboratorio y ejercicios obligatorios | 55 minutos |
| Mini proyecto | 35 minutos |
| Proyecto del módulo | 1 hora y 10 minutos |
| **Total estimado** | **7 horas** |

El tiempo es una referencia. Si una relación o una migración no se comprende, detente y compruébala antes de avanzar. Los errores de diseño se vuelven más costosos cuando el sistema ya contiene datos.

---

# 1. De una necesidad empresarial a un modelo de datos

Una base de datos no comienza con `models.py`. Comienza con preguntas sobre el negocio.

Supón que una empresa necesita controlar inventario:

- ¿Qué productos vende?
- ¿Cómo se agrupan?
- ¿Quién los suministra?
- ¿Cuántas unidades existen?
- ¿Qué movimientos aumentan o reducen las existencias?
- ¿Quién registró cada movimiento?
- ¿Qué información debe ser única?
- ¿Qué datos pueden faltar?
- ¿Qué registros deben conservarse como historial?

Las respuestas permiten identificar entidades:

```text
Categoría
Proveedor
Producto
Cliente
Movimiento de inventario
Usuario
```

Después se identifican atributos:

```text
Producto
├── código
├── nombre
├── precio
├── existencias
├── activo
├── categoría
└── proveedor
```

Finalmente se definen reglas:

- el código de producto no se repite;
- el precio no puede ser negativo;
- las existencias no deben quedar por debajo de cero;
- cada producto pertenece a una categoría;
- un proveedor puede suministrar muchos productos;
- cada movimiento pertenece a un producto;
- cada movimiento registra el usuario responsable.

Estas reglas determinan campos, relaciones, restricciones y validaciones.

## Pregunta profesional

Antes de crear un campo, responde:

> ¿Qué regla del negocio representa y qué ocurriría si su valor fuera incorrecto?

Si no puedes responder, todavía falta analizar el requisito.

---

# 2. Entidades, atributos y relaciones

Una **entidad** representa algo que el sistema necesita identificar de forma independiente. Un **atributo** describe esa entidad. Una **relación** conecta entidades.

| Concepto | Ejemplo empresarial | Django |
|---|---|---|
| Entidad | Producto | Clase de modelo |
| Atributo | Nombre del producto | Campo |
| Registro | Un teclado específico | Instancia |
| Clave primaria | Identificador interno | `id` |
| Clave foránea | Categoría del producto | `ForeignKey` |
| Restricción | Código irrepetible | `unique=True` |

No conviertas cada palabra del requisito en un modelo. “Dirección de correo” suele ser un atributo; “Cliente” puede ser una entidad.

Una señal útil para crear una entidad independiente es que:

- tiene varios atributos propios;
- aparece en diferentes procesos;
- debe poder consultarse por separado;
- se relaciona con varios registros;
- posee una identidad o ciclo de vida propio.

---

# 3. Diagrama entidad-relación

El diagrama entidad-relación permite detectar errores antes de escribir migraciones.

Ejemplo simplificado:

```text
┌──────────────┐       1          N       ┌──────────────┐
│  CATEGORÍA   │──────────────────────────│   PRODUCTO   │
├──────────────┤                          ├──────────────┤
│ id PK        │                          │ id PK        │
│ nombre UQ    │                          │ código UQ    │
└──────────────┘                          │ nombre       │
                                        │ categoría FK │
                                        └──────┬───────┘
                                               │ 1
                                               │
                                               │ N
                                        ┌──────▼───────┐
                                        │  MOVIMIENTO  │
                                        ├──────────────┤
                                        │ id PK        │
                                        │ tipo         │
                                        │ cantidad     │
                                        │ producto FK  │
                                        │ usuario FK   │
                                        └──────────────┘
```

Leyenda:

```text
PK = clave primaria
FK = clave foránea
UQ = valor único
1  = un registro
N  = muchos registros
```

Para cada relación indica:

- cardinalidad;
- obligatoriedad;
- nombre desde cada lado;
- comportamiento al eliminar;
- razón empresarial.

Ejemplo:

| Relación | Cardinalidad | Regla |
|---|---|---|
| Categoría–Producto | 1:N | Una categoría agrupa muchos productos |
| Producto–Movimiento | 1:N | Un producto conserva muchos movimientos |
| Usuario–Movimiento | 1:N | Un usuario puede registrar muchos movimientos |

---

# 4. Del diseño SQL al modelo Django

En SQL podrías crear una tabla:

```sql
CREATE TABLE categoria (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    activa BOOLEAN NOT NULL DEFAULT 1
);
```

Su equivalente conceptual en Django es:

```python
from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
```

Django genera por defecto una clave primaria llamada `id` si no defines otra. En proyectos nuevos suele ser un `BigAutoField`, según la configuración `DEFAULT_AUTO_FIELD`.

El modelo no es solamente una copia de la tabla. También puede contener:

- nombres legibles;
- orden predeterminado;
- restricciones;
- índices;
- métodos relacionados con la entidad;
- reglas que ayudan a representar y administrar los datos.

---

# 5. Campos utilizados con mayor frecuencia

| Campo | Uso habitual | Ejemplo |
|---|---|---|
| `CharField` | Texto corto | nombre, código, teléfono |
| `TextField` | Texto largo | descripción, observaciones |
| `IntegerField` | Enteros | cantidad |
| `PositiveIntegerField` | Enteros no negativos a nivel de formulario | existencias |
| `DecimalField` | Dinero o decimales exactos | precio |
| `BooleanField` | Estado verdadero o falso | activo |
| `DateField` | Fecha | vencimiento |
| `DateTimeField` | Fecha y hora | creación |
| `EmailField` | Correo con validación de formulario | correo |
| `URLField` | Dirección web | sitio |
| `SlugField` | Texto apto para URL | slug |
| `FileField` | Archivo | documento |
| `ImageField` | Imagen | fotografía |
| `ForeignKey` | Relación muchos a uno | categoría |
| `ManyToManyField` | Relación muchos a muchos | etiquetas |
| `OneToOneField` | Relación uno a uno | perfil |

Para dinero utiliza `DecimalField`, no `FloatField`:

```python
precio = models.DecimalField(max_digits=10, decimal_places=2)
```

`max_digits=10` representa la cantidad total de dígitos y `decimal_places=2` reserva dos posiciones decimales.

## El tipo más específico

Selecciona el campo que comunique mejor la intención. Un correo podría almacenarse en `CharField`, pero `EmailField` expresa mejor la regla y aporta validación cuando se usa mediante formularios.

---

# 6. Opciones de los campos

## 6.1 `blank`

Controla si un campo puede quedar vacío durante la validación de formularios y modelos:

```python
telefono = models.CharField(max_length=25, blank=True)
```

## 6.2 `null`

Controla si la base de datos almacena `NULL`:

```python
fecha_baja = models.DateField(null=True, blank=True)
```

En campos de texto normalmente se prefiere `blank=True` sin `null=True`, para evitar dos representaciones de “sin texto”: cadena vacía y `NULL`.

```text
Texto opcional  → blank=True
Fecha opcional  → null=True, blank=True
```

## 6.3 `default`

Proporciona un valor inicial:

```python
activo = models.BooleanField(default=True)
```

Para valores calculados usa una función, no su resultado:

```python
from django.utils import timezone

fecha_registro = models.DateTimeField(default=timezone.now)
```

No escribas `timezone.now()` si deseas que la fecha se calcule al crear cada registro.

## 6.4 `unique`

Evita valores repetidos:

```python
codigo = models.CharField(max_length=30, unique=True)
```

Usa `unique=True` solo cuando la regla empresarial lo exige. Dos personas pueden tener el mismo nombre; dos productos no deberían tener el mismo código interno.

## 6.5 `choices`

Limita un campo a opciones conocidas:

```python
class Movimiento(models.Model):
    class Tipo(models.TextChoices):
        ENTRADA = "ENTRADA", "Entrada"
        SALIDA = "SALIDA", "Salida"
        AJUSTE = "AJUSTE", "Ajuste"

    tipo = models.CharField(max_length=10, choices=Tipo.choices)
```

El valor guardado es estable y la etiqueta puede mostrarse con:

```python
movimiento.get_tipo_display()
```

## 6.6 `db_index`

Crea un índice para búsquedas frecuentes:

```python
nombre = models.CharField(max_length=150, db_index=True)
```

Un índice puede acelerar lecturas, pero ocupa espacio y añade trabajo a las escrituras. No indexes todos los campos sin medir una necesidad.

---

# 7. Representación y metadatos

## 7.1 `__str__`

Una representación clara mejora la consola, el admin y los selectores:

```python
def __str__(self):
    return f"{self.codigo} - {self.nombre}"
```

No debe realizar consultas costosas ni exponer información sensible.

## 7.2 Clase `Meta`

```python
class Meta:
    ordering = ["nombre"]
    verbose_name = "producto"
    verbose_name_plural = "productos"
```

También puede definir restricciones e índices:

```python
class Meta:
    constraints = [
        models.CheckConstraint(
            condition=models.Q(precio__gte=0),
            name="producto_precio_no_negativo",
        ),
    ]
    indexes = [
        models.Index(fields=["activo", "nombre"]),
    ]
```

El nombre de una restricción debe describir la regla y mantenerse estable.

## 7.3 Orden predeterminado

`ordering` es útil cuando existe un orden natural, pero cada consulta ordenada tiene un costo. También puedes ordenar únicamente cuando lo necesitas:

```python
Producto.objects.order_by("nombre")
```

---

# 8. Claves primarias: identidad interna y código empresarial

Django crea un identificador interno:

```text
id = 42
```

El negocio puede utilizar otro código:

```text
SKU-2026-0042
```

No son necesariamente lo mismo.

- La clave primaria identifica internamente el registro.
- El código empresarial representa una regla visible del negocio.

Una estrategia simple:

```python
codigo = models.CharField(max_length=30, unique=True)
```

Conserva el `id` automático y añade el código como campo único. Evita convertir un dato modificable en clave primaria sin una razón técnica sólida.

---

# 9. Relaciones uno a muchos

Una categoría puede tener muchos productos, mientras cada producto pertenece a una categoría:

```python
class Categoria(models.Model):
    nombre = models.CharField(max_length=80, unique=True)


class Producto(models.Model):
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="productos",
    )
```

Recorrido directo:

```python
producto.categoria
```

Recorrido inverso:

```python
categoria.productos.all()
```

`related_name` debe ser claro, plural cuando devuelve una colección y consistente con el dominio.

---

# 10. Relaciones muchos a muchos

Un libro puede tener varios autores y un autor puede escribir varios libros:

```python
class Autor(models.Model):
    nombre = models.CharField(max_length=120)


class Libro(models.Model):
    titulo = models.CharField(max_length=180)
    autores = models.ManyToManyField(
        Autor,
        related_name="libros",
    )
```

Uso:

```python
libro.autores.add(autor)
autor.libros.all()
```

Django crea una tabla intermedia. Si la relación necesita datos propios, crea un modelo explícito:

```python
class Participacion(models.Model):
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE)
    rol = models.CharField(max_length=50)
    orden = models.PositiveIntegerField(default=1)
```

La relación deja de ser solo “libro–autor” y se convierte en una entidad con atributos.

---

# 11. Relaciones uno a uno

Una relación uno a uno amplía una entidad sin permitir varios registros asociados:

```python
from django.conf import settings


class Perfil(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="perfil",
    )
    telefono = models.CharField(max_length=25, blank=True)
```

Uso:

```python
usuario.perfil
perfil.usuario
```

No crees un perfil únicamente para evitar agregar campos al usuario. Utilízalo cuando la información tenga un propósito y ciclo de vida claramente separado.

---

# 12. Integridad referencial y `on_delete`

Una clave foránea no es solamente un enlace cómodo. Protege la coherencia entre registros relacionados.

Cuando se intenta eliminar el registro principal, Django necesita una política.

| Opción | Comportamiento | Uso posible |
|---|---|---|
| `CASCADE` | Elimina también los dependientes | Detalles que no tienen sentido sin su padre |
| `PROTECT` | Impide la eliminación | Historial o catálogos todavía utilizados |
| `RESTRICT` | Restringe según las dependencias involucradas | Reglas de eliminación relacional |
| `SET_NULL` | Conserva el dependiente y deja la relación en `NULL` | Relación verdaderamente opcional |
| `SET_DEFAULT` | Coloca el valor predeterminado | Existe un registro sustituto válido |
| `DO_NOTHING` | No realiza una acción desde Django | Casos controlados externamente |

Ejemplo:

```python
categoria = models.ForeignKey(
    Categoria,
    on_delete=models.PROTECT,
    related_name="productos",
)
```

`PROTECT` comunica que una categoría utilizada no puede desaparecer sin resolver primero sus productos.

Para `SET_NULL`, el campo debe aceptar `NULL`:

```python
proveedor = models.ForeignKey(
    Proveedor,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="productos",
)
```

## Preguntas antes de elegir

1. ¿El registro dependiente conserva valor histórico sin su relación?
2. ¿Eliminar el principal debe borrar información empresarial?
3. ¿El usuario debe corregir dependencias antes de eliminar?
4. ¿La ausencia de relación es válida?
5. ¿Una eliminación accidental sería recuperable?

No elijas `CASCADE` solo porque aparece con frecuencia en ejemplos.

---

# 13. Modelo de usuario personalizado desde el inicio

Django recomienda considerar un modelo de usuario personalizado al comenzar un proyecto. Aunque inicialmente no tenga campos adicionales, cambiarlo después de crear tablas y relaciones puede ser complejo.

## Punto de control del curso

El proyecto empresarial que continuará hasta el final comienza en este módulo. Configura el usuario antes de ejecutar las primeras migraciones de este nuevo núcleo.

Estructura:

```text
gestion_empresarial/
├── manage.py
├── gestion_empresarial/
├── cuentas/
└── inventario/
```

Crea la aplicación:

```bash
python manage.py startapp cuentas
```

`cuentas/models.py`:

```python
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    pass
```

`gestion_empresarial/settings.py`:

```python
INSTALLED_APPS = [
    # Aplicaciones de Django
    "cuentas",
    "inventario",
]

AUTH_USER_MODEL = "cuentas.Usuario"
```

`cuentas/admin.py`:

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    pass
```

Para relacionar otros modelos con el usuario:

```python
from django.conf import settings
from django.db import models


creado_por = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.PROTECT,
    related_name="productos_creados",
)
```

No importes directamente `Usuario` dentro de modelos de otras aplicaciones.

## Si ya ejecutaste migraciones

En un proyecto educativo sin datos importantes puedes iniciar una copia limpia y reutilizar los templates del módulo anterior. No borres bases de datos ni migraciones de un sistema real para “arreglarlo rápido”. Una migración de usuario en producción requiere un plan específico, respaldo y pruebas.

---

# 14. Modelos del núcleo empresarial

Una primera versión organizada puede ser:

```python
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "categoría"
        verbose_name_plural = "categorías"

    def __str__(self):
        return self.nombre


class Proveedor(models.Model):
    nombre = models.CharField(max_length=120)
    identificacion = models.CharField(max_length=30, unique=True)
    correo = models.EmailField(blank=True)
    telefono = models.CharField(max_length=25, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    codigo = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=150, db_index=True)
    descripcion = models.TextField(blank=True)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="productos",
    )
    proveedores = models.ManyToManyField(
        Proveedor,
        related_name="productos",
        blank=True,
    )
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    existencias = models.PositiveIntegerField(default=0)
    stock_minimo = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="productos_creados",
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(precio__gte=0),
                name="producto_precio_no_negativo",
            ),
        ]

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
```

`MinValueValidator` ayuda en validaciones de Django y `CheckConstraint` protege la regla en la base de datos. Son capas complementarias.

## Cliente y movimiento

```python
class Cliente(models.Model):
    nombre = models.CharField(max_length=120)
    identificacion = models.CharField(max_length=30, unique=True)
    correo = models.EmailField(blank=True)
    telefono = models.CharField(max_length=25, blank=True)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class MovimientoInventario(models.Model):
    class Tipo(models.TextChoices):
        ENTRADA = "ENTRADA", "Entrada"
        SALIDA = "SALIDA", "Salida"
        AJUSTE = "AJUSTE", "Ajuste"

    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        related_name="movimientos",
    )
    tipo = models.CharField(max_length=10, choices=Tipo.choices)
    cantidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    motivo = models.CharField(max_length=180)
    registrado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="movimientos_registrados",
    )
    registrado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-registrado_en"]

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.producto.codigo}"
```

En este módulo el modelo representa el historial. La operación transaccional que modificará existencias y creará el movimiento de forma atómica se desarrollará cuando se construyan los servicios y formularios del sistema.

---

# 15. Migraciones: historial del esquema

Una migración describe un cambio versionado en la estructura de la base de datos.

```text
models.py
   ↓ makemigrations
archivo de migración
   ↓ migrate
esquema de la base de datos
```

Comandos principales:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations
```

Proceso recomendado:

1. modifica el modelo;
2. ejecuta las comprobaciones;
3. crea la migración;
4. lee el archivo generado;
5. revisa el plan;
6. aplica la migración;
7. prueba el sistema;
8. incluye el archivo en Git.

## Leer una migración

```python
class Migration(migrations.Migration):
    dependencies = [
        ("inventario", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="producto",
            name="stock_minimo",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
```

`dependencies` indica qué cambios deben existir antes. `operations` describe el cambio.

Puedes revisar el plan sin aplicarlo:

```bash
python manage.py migrate --plan
```

Y observar el SQL aproximado:

```bash
python manage.py sqlmigrate inventario 0001
```

El SQL exacto depende del motor de base de datos.

---

# 16. Reglas profesionales para migraciones

- Incluye las migraciones en el repositorio.
- No edites una base de datos manualmente para evitar una migración.
- No elimines migraciones compartidas sin coordinar.
- No cambies una migración ya aplicada en otros entornos por comodidad.
- Revisa valores predeterminados antes de agregar campos obligatorios.
- Realiza respaldo antes de cambios de alto riesgo.
- Prueba las migraciones en una base diferente antes de producción.
- Separa cambios de esquema de cargas de datos complejas cuando convenga.

## Modelo y base no son lo mismo

Cambiar `models.py` no cambia automáticamente la base:

```text
Código actualizado + base antigua = errores
```

La migración mantiene ambas representaciones sincronizadas.

---

# 17. Consola de Django

La consola carga la configuración del proyecto y permite trabajar con los modelos:

```bash
python manage.py shell
```

Importación:

```python
from inventario.models import Categoria, Producto
```

Úsala para:

- explorar el ORM;
- comprobar una consulta;
- crear pocos datos de prueba;
- inspeccionar una relación;
- reproducir un error.

No la utilices para cambios manuales irrepetibles en producción. Si un proceso debe ejecutarse varias veces o dejar evidencia, crea un comando de administración o una migración de datos.

---

# 18. Crear registros con el ORM

## `create`

```python
categoria = Categoria.objects.create(
    nombre="Periféricos",
    descripcion="Accesorios para equipos de cómputo",
)
```

## Instancia y `save`

```python
categoria = Categoria(
    nombre="Monitores",
    descripcion="Pantallas y accesorios",
)
categoria.save()
```

## `get_or_create`

```python
categoria, creada = Categoria.objects.get_or_create(
    nombre="Periféricos",
    defaults={"descripcion": "Accesorios para computadoras"},
)
```

`get_or_create` es útil en procesos repetibles, siempre que los campos usados para buscar identifiquen correctamente el registro.

## Crear relaciones muchos a muchos

El objeto principal debe existir antes:

```python
producto.proveedores.add(proveedor_a, proveedor_b)
producto.proveedores.remove(proveedor_b)
producto.proveedores.set([proveedor_a])
producto.proveedores.clear()
```

---

# 19. Consultar registros

## Todos los registros

```python
Producto.objects.all()
```

## Un único registro

```python
Producto.objects.get(codigo="TEC-001")
```

`get()` espera exactamente un resultado. Puede producir:

- `Producto.DoesNotExist`;
- `Producto.MultipleObjectsReturned`.

Utilízalo cuando la condición identifica un único registro.

## Filtrar

```python
Producto.objects.filter(activo=True)
```

## Excluir

```python
Producto.objects.exclude(existencias=0)
```

## Ordenar

```python
Producto.objects.order_by("nombre")
Producto.objects.order_by("-creado_en")
```

## Limitar

```python
Producto.objects.order_by("-creado_en")[:5]
```

Un `QuerySet` es perezoso: normalmente Django construye la consulta y la ejecuta cuando necesita los resultados.

---

# 20. Consultas mediante lookups

Los lookups se separan con doble guion bajo:

```python
Producto.objects.filter(nombre__icontains="teclado")
Producto.objects.filter(precio__gte=25)
Producto.objects.filter(precio__lte=200)
Producto.objects.filter(existencias__gt=0)
Producto.objects.filter(codigo__startswith="TEC")
Producto.objects.filter(categoria__nombre="Periféricos")
```

Lookups frecuentes:

| Lookup | Significado |
|---|---|
| `exact` | Igualdad exacta |
| `iexact` | Igualdad sin distinguir mayúsculas |
| `contains` | Contiene |
| `icontains` | Contiene sin distinguir mayúsculas |
| `gt` | Mayor que |
| `gte` | Mayor o igual |
| `lt` | Menor que |
| `lte` | Menor o igual |
| `in` | Pertenece a una colección |
| `isnull` | Es o no es `NULL` |
| `startswith` | Empieza con |
| `endswith` | Termina con |

Puedes encadenar consultas:

```python
Producto.objects.filter(
    activo=True,
    existencias__gt=0,
).order_by("nombre")
```

---

# 21. Consultas a través de relaciones

Productos de una categoría:

```python
Producto.objects.filter(categoria__nombre="Periféricos")
```

Movimientos de productos activos:

```python
MovimientoInventario.objects.filter(producto__activo=True)
```

Recorrido inverso:

```python
Categoria.objects.filter(productos__existencias__lt=5).distinct()
```

`distinct()` evita duplicados cuando una unión puede producir varias filas para la misma categoría.

Desde una instancia:

```python
categoria.productos.filter(activo=True)
producto.movimientos.order_by("-registrado_en")
proveedor.productos.all()
```

Antes de escribir una consulta relacional, dibuja el recorrido:

```text
Movimiento → Producto → Categoría → nombre
```

Se traduce en:

```python
MovimientoInventario.objects.filter(
    producto__categoria__nombre="Periféricos"
)
```

---

# 22. Búsquedas complejas con `Q`

Los argumentos normales de `filter()` se combinan con `AND`. Para expresar `OR`, negación o grupos utiliza `Q`:

```python
from django.db.models import Q


Producto.objects.filter(
    Q(nombre__icontains="teclado")
    | Q(codigo__icontains="teclado")
)
```

Combinar condiciones:

```python
Producto.objects.filter(
    Q(nombre__icontains="pro")
    | Q(descripcion__icontains="pro"),
    activo=True,
)
```

Negación:

```python
Producto.objects.filter(~Q(existencias=0))
```

Usa paréntesis cuando la combinación pueda resultar ambigua:

```python
criterio = (
    Q(nombre__icontains=termino)
    | Q(codigo__icontains=termino)
)
productos = Producto.objects.filter(criterio, activo=True)
```

---

# 23. Operaciones con `F`

Una expresión `F` hace referencia al valor de una columna dentro de la base:

```python
from django.db.models import F


Producto.objects.filter(pk=producto_id).update(
    existencias=F("existencias") + 5
)
```

Esto evita leer el valor, sumarlo en Python y guardarlo en pasos separados.

Comparar columnas:

```python
Producto.objects.filter(existencias__lte=F("stock_minimo"))
```

Después de asignar una expresión `F` a una instancia y guardarla, vuelve a cargar el objeto si necesitas el valor actualizado:

```python
producto.refresh_from_db()
```

`F` ayuda a evitar ciertas condiciones de carrera, pero una operación empresarial con varios cambios todavía puede requerir una transacción. Esa arquitectura se desarrollará más adelante.

---

# 24. Modificar y eliminar

## Modificar una instancia

```python
from decimal import Decimal


producto.precio = Decimal("29.90")
producto.save(update_fields=["precio", "actualizado_en"])
```

## Actualización masiva

```python
Producto.objects.filter(activo=False).update(existencias=0)
```

`update()` trabaja directamente en la base y no llama al método `save()` de cada instancia.

## Eliminar

```python
producto.delete()
```

El resultado depende de las relaciones y de `on_delete`.

## Regla profesional

Antes de ejecutar una actualización o eliminación masiva:

```python
objetivo = Producto.objects.filter(activo=False)
print(objetivo.count())
print(list(objetivo.values("codigo", "nombre")[:10]))
```

Confirma primero el conjunto afectado. En sistemas empresariales puede ser preferible desactivar un registro y conservar el historial.

---

# 25. Agregaciones iniciales

Las agregaciones calculan un resultado sobre un conjunto:

```python
from django.db.models import Avg, Count, Max, Min, Sum


resumen = Producto.objects.aggregate(
    cantidad=Count("id"),
    precio_promedio=Avg("precio"),
    precio_minimo=Min("precio"),
    precio_maximo=Max("precio"),
    unidades=Sum("existencias"),
)
```

Resultado aproximado:

```python
{
    "cantidad": 18,
    "precio_promedio": Decimal("42.75"),
    "precio_minimo": Decimal("3.50"),
    "precio_maximo": Decimal("250.00"),
    "unidades": 126,
}
```

Agrupar con `annotate`:

```python
categorias = Categoria.objects.annotate(
    total_productos=Count("productos")
).order_by("-total_productos")
```

Filtrar una anotación:

```python
Categoria.objects.annotate(
    total_productos=Count("productos")
).filter(total_productos__gt=0)
```

No uses ciclos de Python para contar o sumar miles de filas si la base puede realizar la operación eficientemente.

---

# 26. Comprender el SQL generado

El ORM no es magia. Puedes inspeccionar una consulta:

```python
consulta = Producto.objects.filter(
    categoria__nombre="Periféricos",
    activo=True,
).order_by("nombre")

print(consulta.query)
```

La representación ayuda a relacionar:

```text
filter()       → WHERE
order_by()     → ORDER BY
ForeignKey     → JOIN
aggregate()    → COUNT, SUM, AVG...
```

El SQL puede variar entre motores. Lo importante es reconocer la intención, las uniones y los filtros.

---

# 27. Consultas repetidas y problema N+1

Este código parece sencillo:

```python
productos = Producto.objects.all()

for producto in productos:
    print(producto.categoria.nombre)
```

Puede ejecutar:

```text
1 consulta para productos
+ 1 consulta por cada categoría accedida
= N + 1 consultas
```

Para una relación `ForeignKey` o `OneToOneField`:

```python
productos = Producto.objects.select_related("categoria", "creado_por")
```

Para relaciones muchos a muchos o conjuntos inversos:

```python
productos = Producto.objects.prefetch_related("proveedores")
```

Uso combinado:

```python
productos = (
    Producto.objects
    .select_related("categoria", "creado_por")
    .prefetch_related("proveedores")
    .filter(activo=True)
)
```

No agregues optimizaciones al azar. Identifica qué relaciones utiliza la vista y comprueba la cantidad de consultas.

---

# 28. Django Admin: herramienta interna

El panel administrativo permite administrar modelos con poco código. Está pensado como herramienta interna para usuarios autorizados, no como interfaz pública para clientes.

Crear un superusuario:

```bash
python manage.py createsuperuser
```

Registrar un modelo:

```python
from django.contrib import admin

from .models import Categoria


admin.site.register(Categoria)
```

Personalización:

```python
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        "codigo",
        "nombre",
        "categoria",
        "precio",
        "existencias",
        "activo",
    )
    list_filter = ("activo", "categoria")
    search_fields = ("codigo", "nombre")
    ordering = ("nombre",)
    list_select_related = ("categoria",)
    readonly_fields = ("creado_en", "actualizado_en")
```

Cada opción responde a una necesidad:

- `list_display`: columnas importantes;
- `list_filter`: filtros laterales;
- `search_fields`: búsqueda;
- `ordering`: orden;
- `list_select_related`: reduce consultas de claves foráneas;
- `readonly_fields`: información visible que no debe editarse manualmente.

---

# 29. Organización del formulario administrativo

Puedes agrupar campos:

```python
@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ("nombre", "identificacion", "correo", "activo")
    list_filter = ("activo",)
    search_fields = ("nombre", "identificacion", "correo")

    fieldsets = (
        (
            "Identificación",
            {"fields": ("nombre", "identificacion")},
        ),
        (
            "Contacto",
            {"fields": ("correo", "telefono")},
        ),
        (
            "Estado",
            {"fields": ("activo",)},
        ),
    )
```

Una buena pantalla administrativa:

- muestra lo necesario;
- facilita buscar;
- evita editar datos calculados;
- utiliza nombres comprensibles;
- conserva una cantidad razonable de columnas;
- no expone campos sensibles.

---

# 30. Acciones administrativas básicas

Una acción puede modificar varios registros seleccionados:

```python
@admin.action(description="Marcar productos seleccionados como activos")
def activar_productos(modeladmin, request, queryset):
    actualizados = queryset.update(activo=True)
    modeladmin.message_user(
        request,
        f"{actualizados} producto(s) activado(s).",
    )


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    actions = [activar_productos]
```

Una acción debe:

- tener un propósito claro;
- afectar únicamente el conjunto seleccionado;
- informar el resultado;
- respetar permisos;
- evitar operaciones destructivas innecesarias.

No agregues una acción de eliminación irreversible solo porque puede programarse.

---

# 31. Datos de prueba reproducibles

Crear datos manualmente desde el admin es útil para comprobar pantallas, pero no permite reconstruir el escenario con facilidad.

Un comando de administración deja un proceso repetible:

```text
inventario/
└── management/
    └── commands/
        └── cargar_datos_prueba.py
```

`cargar_datos_prueba.py`:

```python
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from inventario.models import Categoria, Producto, Proveedor


class Command(BaseCommand):
    help = "Crea datos de demostración para inventario"

    def handle(self, *args, **options):
        Usuario = get_user_model()
        usuario, usuario_creado = Usuario.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@example.com"},
        )
        if usuario_creado:
            usuario.set_unusable_password()
            usuario.save(update_fields=["password"])

        categoria, _ = Categoria.objects.get_or_create(
            nombre="Periféricos",
            defaults={"descripcion": "Accesorios de cómputo"},
        )
        proveedor, _ = Proveedor.objects.get_or_create(
            identificacion="PROV-001",
            defaults={
                "nombre": "Distribuciones Central",
                "correo": "ventas@example.com",
            },
        )
        producto, creado = Producto.objects.get_or_create(
            codigo="TEC-001",
            defaults={
                "nombre": "Teclado ergonómico",
                "descripcion": "Teclado para oficina",
                "categoria": categoria,
                "precio": Decimal("29.90"),
                "existencias": 12,
                "stock_minimo": 4,
                "creado_por": usuario,
            },
        )
        producto.proveedores.add(proveedor)

        mensaje = "creado" if creado else "ya existía"
        self.stdout.write(
            self.style.SUCCESS(f"Producto {mensaje}: {producto.codigo}")
        )
```

Ejecutar:

```bash
python manage.py cargar_datos_prueba
```

El comando es **idempotente** para esos datos: ejecutarlo otra vez no debe duplicarlos.

Usa datos ficticios y evita copiar información personal real a un entorno de desarrollo.

---

# 32. Laboratorio guiado: construir el núcleo de inventario

En este laboratorio iniciarás el proyecto que continuará durante los siguientes módulos.

## Paso 1. Crear una rama y un punto de control

Conserva el trabajo anterior:

```bash
git add .
git commit -m "chore: cerrar interfaz reutilizable del modulo 2"
git switch -c modulo-3-modelos
```

Si vas a reutilizar templates en un proyecto limpio, copia únicamente el código que comprendes. No copies la base SQLite ni un entorno virtual.

## Paso 2. Crear el proyecto empresarial

```bash
django-admin startproject gestion_empresarial
cd gestion_empresarial
python manage.py startapp cuentas
python manage.py startapp inventario
```

Registra las aplicaciones y configura `AUTH_USER_MODEL` antes de `migrate`.

## Paso 3. Diseñar antes de migrar

Crea un diagrama con:

- Usuario;
- Categoría;
- Proveedor;
- Producto;
- Cliente;
- Movimiento de inventario.

Para cada campo registra:

| Entidad | Campo | Tipo | Obligatorio | Único | Regla |
|---|---|---|---|---|---|
| Producto | código | texto corto | Sí | Sí | Identifica el producto |
| Producto | precio | decimal | Sí | No | No negativo |

No continúes hasta poder justificar las relaciones y los comportamientos de eliminación.

## Paso 4. Crear el usuario personalizado

Implementa `cuentas.Usuario`, agrega `AUTH_USER_MODEL` y registra el modelo con `UserAdmin`.

Ejecuta:

```bash
python manage.py check
```

Todavía no ejecutes migraciones si la configuración produce errores.

## Paso 5. Implementar los modelos

Agrega los modelos del núcleo. Revisa:

- campos obligatorios y opcionales;
- nombres inversos;
- `on_delete`;
- restricciones;
- orden;
- `__str__`;
- fechas de auditoría.

## Paso 6. Crear y revisar migraciones

```bash
python manage.py makemigrations
python manage.py migrate --plan
python manage.py migrate
python manage.py showmigrations
python manage.py check
```

Abre `0001_initial.py` y localiza:

- creación del usuario;
- creación de modelos;
- relaciones;
- restricciones;
- dependencias.

Inspecciona el SQL de la migración de inventario:

```bash
python manage.py sqlmigrate inventario 0001
```

## Paso 7. Crear datos de prueba

Implementa el comando `cargar_datos_prueba`. Debe crear:

- un usuario de demostración sin privilegios;
- tres categorías;
- tres proveedores;
- diez productos;
- cinco clientes;
- doce movimientos.

Ejecuta el comando dos veces y confirma que no duplica los registros base.

## Paso 8. Resolver consultas

Desde la consola:

```python
from django.db.models import Count, F, Q, Sum
from inventario.models import Categoria, MovimientoInventario, Producto
```

Resuelve:

1. productos activos;
2. productos sin existencias;
3. productos con existencias iguales o inferiores al mínimo;
4. productos de una categoría;
5. búsqueda por código o nombre;
6. últimos cinco movimientos;
7. cantidad de productos por categoría;
8. suma total de unidades;
9. categorías que tienen productos;
10. movimientos con producto, categoría y usuario precargados.

Guarda cada consulta y su resultado en `consultas_orm.md`.

## Paso 9. Personalizar el admin

En el admin de productos:

- muestra código, nombre, categoría, precio, existencias y estado;
- permite buscar por código y nombre;
- filtra por categoría y estado;
- precarga la categoría;
- impide editar las fechas;
- asigna automáticamente el usuario creador.

```python
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        "codigo",
        "nombre",
        "categoria",
        "precio",
        "existencias",
        "activo",
    )
    list_filter = ("activo", "categoria")
    search_fields = ("codigo", "nombre")
    list_select_related = ("categoria",)
    readonly_fields = ("creado_en", "actualizado_en")
    exclude = ("creado_por",)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.creado_por = request.user
        super().save_model(request, obj, form, change)
```

Personaliza también categorías, proveedores, clientes y movimientos.

## Paso 10. Conectar datos reales con los templates

Actualiza temporalmente la vista de catálogo:

```python
from django.shortcuts import render

from .models import Producto


def lista_productos(request):
    productos = (
        Producto.objects
        .select_related("categoria")
        .filter(activo=True)
        .order_by("nombre")
    )
    return render(
        request,
        "inventario/productos/lista.html",
        {"productos": productos},
    )
```

Reutiliza la interfaz del módulo anterior. No construyas todavía formularios CRUD; corresponden al Módulo 4.

## Paso 11. Comprobar el resultado

Verifica:

- migraciones aplicadas;
- relaciones navegables;
- restricciones activas;
- comando repetible;
- consultas correctas;
- admin con búsqueda y filtros;
- catálogo leyendo desde SQLite;
- estado vacío;
- ausencia de consultas N+1 evidentes.

## Paso 12. Registrar el progreso

Ejemplos de commits:

```text
feat: configurar usuario personalizado
feat: crear modelos y relaciones de inventario
feat: agregar restricciones y migraciones iniciales
feat: crear comando de datos de demostracion
feat: personalizar panel administrativo
feat: conectar catalogo con django orm
docs: registrar consultas y decisiones de datos
```

---

# 33. Inteligencia Artificial para revisar datos

La IA puede encontrar posibilidades, pero no conoce por sí sola las reglas verdaderas de una empresa.

## Usos adecuados

- convertir requisitos escritos en una lista inicial de entidades;
- cuestionar una relación;
- explicar una migración generada;
- proponer casos límite;
- revisar nombres de campos;
- generar datos ficticios;
- traducir una consulta ORM a SQL conceptual;
- detectar una posible consulta N+1;
- comparar un modelo con una rúbrica.

## Decisiones que no debes delegar

- qué datos puede eliminar la empresa;
- cuáles datos son sensibles;
- qué campo debe ser único;
- qué historial debe conservarse;
- qué permisos tendrá cada persona;
- si una migración es segura para producción;
- si los datos generados son legales o apropiados.

## Prompt para revisar un modelo

```text
Actúa como revisor de diseño de datos para Django 5.2.
No reescribas el código todavía.

Contexto del negocio:
[reglas reales]

Modelo propuesto:
[código]

Revisa:
1. entidades y responsabilidades;
2. cardinalidades;
3. null y blank;
4. unicidad;
5. on_delete;
6. restricciones;
7. nombres inversos;
8. datos históricos;
9. posibles consultas N+1.

Clasifica cada hallazgo como crítico, importante o mejora.
No inventes reglas empresariales: formula preguntas cuando falte información.
```

## Prompt para explicar una migración

```text
Explica esta migración de Django operación por operación.
Indica qué cambiará en la base, qué datos podrían verse afectados
y qué comprobaciones realizarías antes y después.
No asumas que es segura solo porque fue generada automáticamente.
```

## Prompt para validar una consulta

```text
Compara este requisito, la consulta ORM y el modelo.
Explica si el resultado corresponde al requisito.
Señala duplicados posibles, joins, orden, evaluación del QuerySet
y consultas adicionales al recorrer relaciones.
Propón primero una prueba mínima y después una corrección, si hace falta.
```

## Registro obligatorio

Por cada intervención importante conserva:

| Elemento | Contenido |
|---|---|
| Objetivo | Qué intentabas resolver |
| Prompt | Instrucción enviada |
| Propuesta | Resumen de la respuesta |
| Verificación | Documentación, prueba o consulta utilizada |
| Decisión | Qué aceptaste, cambiaste o rechazaste |
| Aprendizaje | Qué puedes explicar ahora |

---

# 34. Ejercicios obligatorios

Completa los doce ejercicios. Cada entrega debe incluir código, resultado y una explicación breve.

## Ejercicio 1. Identificar entidades

Una clínica pequeña necesita registrar pacientes, médicos, especialidades, citas y consultorios.

Analiza el requisito y entrega:

- entidades;
- atributos principales;
- clave primaria;
- campos únicos;
- relaciones;
- obligatoriedad;
- dos reglas que todavía requieren confirmación.

No escribas modelos hasta terminar el análisis.

## Ejercicio 2. Crear un diagrama relacional

Diseña el diagrama de una universidad con estudiantes, carreras, cursos, matrículas y períodos.

Debes:

- indicar cardinalidades;
- resolver la relación muchos a muchos entre estudiantes y cursos mediante Matrícula;
- colocar al menos dos atributos en Matrícula;
- explicar qué sucede si se intenta eliminar un curso con matrículas.

## Ejercicio 3. Seleccionar campos

Recibe una lista de veinte datos de un producto: código, nombre, costo, precio, descripción, fecha de vencimiento, activo y otros.

Para cada dato selecciona:

- campo de Django;
- longitud o precisión;
- `blank`;
- `null`;
- `default`;
- unicidad;
- justificación.

Detecta al menos dos decisiones que no pueden tomarse sin consultar al negocio.

## Ejercicio 4. Corregir un modelo defectuoso

Corrige este diseño:

```python
class Producto(models.Model):
    nombre = models.TextField(null=True)
    precio = models.FloatField()
    activo = models.CharField(max_length=500)
    categoria = models.CharField(max_length=100)
```

La empresa exige nombre obligatorio, precio no negativo, estado booleano y categorías reutilizables. Entrega el modelo corregido y explica cada cambio.

## Ejercicio 5. Elegir `on_delete`

Analiza estas relaciones:

1. factura–líneas de factura;
2. categoría–productos;
3. empleado–cuenta de acceso;
4. proveedor–productos históricos;
5. cita–consultorio opcional.

Para cada caso selecciona una política `on_delete`, explica el riesgo y menciona una pregunta que confirmarías con el negocio. Puede existir más de una respuesta válida si está bien justificada.

## Ejercicio 6. Crear y leer una migración

Agrega `stock_minimo` a un modelo de producto:

- crea la migración;
- revisa su dependencia;
- identifica la operación;
- observa el plan;
- genera el SQL mediante `sqlmigrate`;
- aplica la migración;
- comprueba el nuevo campo.

Entrega los comandos, un resumen del SQL y una captura de `showmigrations`.

## Ejercicio 7. CRUD desde la consola

Mediante el ORM:

- crea tres categorías;
- crea seis productos;
- consulta uno por código;
- modifica un precio;
- desactiva dos productos;
- elimina únicamente un registro permitido;
- captura las excepciones esperadas de `get()`.

No utilices el panel administrativo en este ejercicio.

## Ejercicio 8. Filtros y relaciones

Escribe consultas para:

- productos activos con existencias;
- productos entre dos precios;
- productos cuyo nombre contiene un término;
- productos de categorías activas;
- categorías con productos bajo mínimo;
- proveedores de un producto;
- movimientos de una categoría.

Explica el recorrido de relaciones en las últimas cuatro.

## Ejercicio 9. `Q` y `F`

Crea:

- una búsqueda por código, nombre o descripción;
- una consulta de productos activos que coincidan con el término;
- una consulta de existencias bajo mínimo;
- una actualización que aumente cinco unidades sin calcular el valor en Python.

Vuelve a cargar el registro y confirma el resultado.

## Ejercicio 10. Agregaciones

Obtén:

- cantidad total de productos;
- suma de existencias;
- precio mínimo, máximo y promedio;
- cantidad de productos por categoría;
- categorías sin productos;
- tres categorías con más productos.

Interpreta los resultados en lenguaje empresarial.

## Ejercicio 11. Detectar N+1

Crea una consulta de movimientos y muestra producto, categoría y usuario.

1. Ejecuta una versión sin precarga.
2. Identifica por qué puede producir consultas repetidas.
3. Corrige con `select_related`.
4. Añade proveedores y utiliza `prefetch_related`.
5. Explica qué relación resuelve cada método.

## Ejercicio 12. Personalizar Django Admin

Configura el admin de una biblioteca:

- columnas para título, categoría, disponibilidad y fecha;
- búsqueda por título e ISBN;
- filtros por categoría y disponibilidad;
- orden por título;
- fechas de auditoría de solo lectura;
- acción para marcar libros como disponibles.

Adjunta capturas de lista, búsqueda, filtro y formulario.

---

# 35. Retos adicionales

1. **Restricción compuesta:** evita que se repita una misma combinación empresarial mediante `UniqueConstraint`.
2. **Modelo intermedio:** representa autores y libros con un rol y orden de aparición.
3. **Consulta reproducible:** crea un comando que imprima un resumen del inventario.
4. **Datos consistentes:** agrega una restricción para que el stock mínimo no sea negativo.
5. **Medición:** compara la cantidad de consultas con y sin `select_related`.
6. **Revisión SQL:** relaciona cinco consultas ORM con su SQL conceptual.

---

# 36. Mini proyecto: Biblioteca Administrable

## Contexto

Una biblioteca comunitaria necesita administrar su catálogo y registrar préstamos. En esta etapa, el personal trabajará desde Django Admin.

## Objetivo

Construir un modelo relacional coherente y una administración interna eficiente.

## Entidades mínimas

- Autor;
- Categoría;
- Libro;
- Ejemplar;
- Lector;
- Préstamo.

## Reglas mínimas

- un libro puede tener varios autores;
- una categoría contiene muchos libros;
- un libro puede tener varios ejemplares físicos;
- cada ejemplar posee un código único;
- un lector puede tener varios préstamos;
- un préstamo identifica un ejemplar;
- la fecha de devolución puede estar vacía;
- un préstamo conserva su historial;
- no se permite eliminar una entidad referenciada si eso destruye historial relevante.

## Requisitos técnicos

- diagrama entidad-relación;
- `__str__` útil en todos los modelos;
- nombres inversos claros;
- al menos una relación 1:N;
- al menos una relación N:M;
- una restricción;
- una migración inicial;
- comando de datos de prueba;
- ocho consultas ORM;
- admin con columnas, filtros y búsqueda;
- una acción administrativa segura.

## Consultas obligatorias

1. libros disponibles;
2. libros por categoría;
3. libros de un autor;
4. préstamos activos;
5. préstamos vencidos según una fecha definida;
6. cantidad de ejemplares por libro;
7. lectores con préstamos;
8. búsqueda por título o ISBN.

## Entregables

- código;
- diagrama;
- migraciones;
- comando de datos;
- `consultas_orm.md`;
- cinco capturas del admin;
- explicación de `on_delete`;
- registro de IA.

## Restricciones

No construyas todavía formularios públicos, autenticación propia ni un CRUD visual. El propósito es dominar la capa de datos y la administración.

---

# 37. Proyecto del módulo: Núcleo de Inventario Empresarial

## Situación profesional

Una pequeña empresa comercial necesita transformar su sitio informativo en un sistema de gestión. Antes de crear formularios y operaciones públicas, requiere una base de datos coherente, datos de prueba y un panel interno para validar el diseño.

Este proyecto continuará en los módulos siguientes. Las decisiones tomadas aquí afectarán formularios, permisos, reportes y despliegue.

## Objetivo

Diseñar e implementar el núcleo persistente del sistema empresarial mediante modelos, relaciones, migraciones, ORM y Django Admin.

## Entidades obligatorias

1. Usuario personalizado;
2. Categoría;
3. Proveedor;
4. Producto;
5. Cliente;
6. Movimiento de inventario.

Puedes agregar entidades cuando exista una regla real, pero no para aumentar artificialmente el tamaño del proyecto.

## Reglas empresariales mínimas

### Usuario

- parte de `AbstractUser`;
- se configura mediante `AUTH_USER_MODEL`;
- queda preparado para futuras relaciones y permisos.

### Categoría

- nombre único;
- descripción opcional;
- estado activo;
- no puede eliminarse mientras tenga productos.

### Proveedor

- identificación única;
- datos de contacto;
- estado activo;
- puede suministrar varios productos;
- un producto puede tener varios proveedores.

### Producto

- código único;
- nombre obligatorio;
- descripción opcional;
- categoría obligatoria;
- proveedores opcionales;
- precio decimal no negativo;
- existencias y stock mínimo no negativos;
- estado activo;
- usuario creador;
- fechas de creación y actualización.

### Cliente

- identificación única;
- nombre obligatorio;
- contacto opcional;
- estado activo;
- fecha de registro.

### Movimiento

- producto obligatorio;
- tipo limitado a entrada, salida o ajuste;
- cantidad mayor que cero;
- motivo;
- usuario responsable;
- fecha inalterable;
- conservación del historial.

## Decisión sobre existencias

En este módulo diseñarás el campo de existencias y el historial de movimientos, pero no implementarás señales que modifiquen existencias automáticamente.

```text
Formulario validado
      ↓
Servicio transaccional
      ├── actualiza existencias
      └── registra movimiento
```

Esa operación debe construirse como una unidad atómica en la capa de lógica empresarial. Mientras no exista, los datos de prueba deben mantener ambos valores coherentes de forma controlada.

No uses señales para ocultar una regla central del inventario.

## Diagrama mínimo

```text
USUARIO 1 ─────────────── N PRODUCTO
   │
   └─────────────── 1:N MOVIMIENTO N:1 ───── PRODUCTO
                                                  │
CATEGORÍA 1 ───────────────────────────────── N ──┤
                                                  │
PROVEEDOR N ───────────────────────────────── N ──┘

CLIENTE
└── preparado para operaciones de ventas posteriores
```

Debes elaborar tu propio diagrama con campos y obligatoriedad. El esquema anterior solo muestra las relaciones principales.

## Arquitectura esperada

```text
gestion_empresarial/
├── manage.py
├── README.md
├── gestion_empresarial/
│   ├── settings.py
│   └── urls.py
├── cuentas/
│   ├── admin.py
│   ├── models.py
│   └── migrations/
├── inventario/
│   ├── admin.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── migrations/
│   ├── management/
│   │   └── commands/
│   │       └── cargar_datos_prueba.py
│   ├── templates/
│   └── static/
├── documentacion/
│   ├── diagrama_entidad_relacion.pdf
│   ├── diccionario_datos.md
│   ├── decisiones_diseno.md
│   ├── consultas_orm.md
│   ├── comprobaciones.md
│   └── uso_ia.md
└── requirements.txt
```

## Requisitos de diseño

- diagrama entidad-relación;
- diccionario de datos;
- cardinalidades justificadas;
- obligatoriedad definida;
- `on_delete` explicado por relación;
- datos históricos identificados;
- nombres coherentes;
- ausencia de datos multivaluados dentro de un texto;
- separación entre código interno e identificador empresarial.

## Requisitos de modelos

- usuario personalizado configurado antes de migrar;
- tipos de campo apropiados;
- `blank` y `null` utilizados conscientemente;
- al menos tres campos únicos justificados;
- `choices` para tipo de movimiento;
- valores predeterminados razonables;
- `related_name` claros;
- relaciones 1:N y N:M;
- mínimo dos restricciones de base de datos;
- mínimo un índice justificado;
- `__str__` útil;
- `Meta` donde aporte valor;
- fechas de auditoría.

## Requisitos de migraciones

- migraciones incluidas en Git;
- archivos revisados;
- plan comprobado;
- SQL de la migración inicial inspeccionado;
- ningún cambio manual en SQLite;
- proyecto reconstruible desde una base vacía.

## Datos de prueba

El comando debe crear como mínimo:

- dos usuarios sin contraseñas conocidas o con credenciales exclusivamente educativas;
- cuatro categorías;
- cuatro proveedores;
- veinte productos;
- diez clientes;
- treinta movimientos.

Debe poder ejecutarse dos veces sin duplicar los datos identificables.

No incluyas información personal real.

## Consultas ORM obligatorias

Documenta requisito, consulta, resultado e interpretación:

1. todos los productos activos;
2. productos agotados;
3. productos bajo stock mínimo;
4. productos de una categoría;
5. productos de un proveedor;
6. búsqueda por código, nombre o descripción;
7. productos dentro de un rango de precios;
8. últimos diez movimientos;
9. movimientos registrados por un usuario;
10. movimientos de una categoría;
11. cantidad de productos por categoría;
12. total de unidades;
13. precio mínimo, máximo y promedio;
14. categorías sin productos;
15. proveedores con productos activos;
16. actualización de existencias mediante `F`;
17. consulta con relaciones precargadas;
18. una consulta traducida a SQL conceptual.

## Requisitos de Django Admin

Todos los modelos deben estar registrados. Además:

- columnas relevantes;
- filtros útiles;
- búsqueda por identificadores y nombres;
- orden coherente;
- fechas de auditoría de solo lectura;
- relaciones optimizadas en listados;
- formularios agrupados cuando aporten claridad;
- mínimo dos acciones seguras;
- usuario creador asignado automáticamente;
- títulos del panel personalizados.

Personalización opcional:

```python
admin.site.site_header = "COA Gestión Empresarial"
admin.site.site_title = "Administración COA"
admin.site.index_title = "Operaciones internas"
```

## Integración con la interfaz

La página pública de productos debe:

- consultar productos activos desde el ORM;
- precargar la categoría;
- conservar la plantilla responsive del Módulo 2;
- mostrar categoría, precio, existencias y estado;
- manejar una colección vacía;
- no permitir todavía crear, editar ni eliminar.

## Comprobaciones obligatorias

Ejecuta:

```bash
python manage.py check
python manage.py makemigrations --check
python manage.py migrate --plan
python manage.py showmigrations
```

Después reconstruye el proyecto:

1. crea una base de datos de desarrollo nueva;
2. aplica las migraciones;
3. ejecuta el comando de datos;
4. crea un superusuario;
5. abre el admin;
6. abre el catálogo;
7. ejecuta las consultas documentadas.

La reconstrucción no debe depender de pasos ocultos.

## Evidencias

Incluye:

1. diagrama entidad-relación;
2. migraciones aplicadas;
3. ejecución doble del comando;
4. lista administrativa de productos;
5. búsqueda administrativa;
6. filtros administrativos;
7. formulario organizado;
8. relación muchos a muchos;
9. consulta de productos bajo mínimo;
10. agregación por categoría;
11. catálogo público con datos de SQLite;
12. estado vacío;
13. historial de commits;
14. comprobaciones sin errores.

## Explicación técnica

Responde:

1. ¿Por qué cada entidad necesita existir?
2. ¿Qué campos son únicos y por qué?
3. ¿Cómo distinguiste `blank` de `null`?
4. ¿Qué política de eliminación elegiste para cada relación?
5. ¿Qué información debe conservarse como historial?
6. ¿Por qué configuraste el usuario antes de migrar?
7. ¿Qué migraciones creó Django?
8. ¿Qué consulta podría producir N+1 y cómo la corregiste?
9. ¿Qué tarea corresponde al admin y cuál a la aplicación pública?
10. ¿Qué sugerencia de IA rechazaste o modificaste?

## Fuera del alcance

No agregues todavía:

- formularios públicos;
- CRUD visual;
- registro o login personalizado;
- permisos empresariales;
- API REST;
- reportes avanzados;
- PostgreSQL;
- señales para actualizar inventario;
- librerías externas de datos ficticios.

Cada uno corresponde a una etapa posterior o no es necesario para el objetivo.

---

# 38. Pruebas del proyecto

Completa esta matriz:

| Prueba | Procedimiento | Resultado esperado |
|---|---|---|
| Configuración | Ejecutar `check` | No existen errores |
| Migraciones pendientes | Ejecutar `makemigrations --check` | No detecta cambios sin migración |
| Base limpia | Aplicar migraciones en una base nueva | El esquema se crea completamente |
| Datos repetibles | Ejecutar dos veces el comando | No duplica registros identificables |
| Categoría protegida | Intentar eliminar una categoría utilizada | La operación se impide |
| Código único | Crear dos productos con el mismo código | La base rechaza el duplicado |
| Precio inválido | Intentar guardar un precio negativo de forma validada | La regla se rechaza |
| Relación inversa | Consultar productos de una categoría | Devuelve los registros correctos |
| Muchos a muchos | Asociar varios proveedores | Las relaciones se conservan |
| Búsqueda | Buscar por código o nombre | Encuentra coincidencias válidas |
| Bajo mínimo | Comparar existencias con `F` | Devuelve solo productos correspondientes |
| Agregación | Contar productos por categoría | Los totales coinciden con los datos |
| Admin | Buscar, filtrar y ordenar | La herramienta funciona sin errores |
| Catálogo | Abrir la página pública | Lee productos desde SQLite |
| Estado vacío | Consultar sin datos activos | Muestra una explicación |
| Relaciones | Revisar consultas del listado | No existe N+1 evitable |

Una captura no sustituye una explicación. Registra el resultado obtenido y cualquier corrección.

---

# 39. Rúbrica del proyecto del módulo

El proyecto principal aporta **50 puntos**.

| Criterio | Puntos | Evidencia esperada |
|---|---:|---|
| Análisis, diagrama y diccionario | 7 | Entidades, atributos, reglas y cardinalidades coherentes |
| Usuario personalizado | 4 | Configuración inicial y referencias correctas |
| Modelos y tipos de campo | 7 | Campos apropiados, opciones justificadas y representaciones útiles |
| Relaciones e integridad | 8 | Cardinalidades, `related_name`, `on_delete` y restricciones correctas |
| Migraciones y reconstrucción | 5 | Historial incluido y base reconstruible |
| Datos de prueba | 4 | Comando reproducible, seguro y suficiente |
| Consultas ORM | 7 | Operaciones, relaciones, `Q`, `F` y agregaciones correctas |
| Optimización inicial | 2 | N+1 identificado y precargas justificadas |
| Django Admin | 4 | Búsqueda, filtros, columnas, acciones y organización |
| Git, documentación y uso de IA | 2 | Proceso verificable y decisiones explicadas |
| **Total** | **50** | |

## Condiciones críticas

El proyecto no puede aprobarse si:

- no inicia desde una base limpia;
- el usuario personalizado se configuró después de migrar sin un plan válido;
- faltan migraciones;
- existe una relación principal representada como texto;
- una eliminación destruye historial empresarial sin justificación;
- el comando duplica datos en cada ejecución;
- las consultas obligatorias no funcionan;
- el admin no permite revisar los datos;
- se incluyeron datos personales reales;
- el estudiante no puede explicar el modelo o el código generado por IA.

---

# 40. Evaluación práctica

La evaluación aporta **15 puntos** y se resuelve sobre un caso proporcionado por COA.

## Parte 1. Corregir el diseño — 5 puntos

Recibirás modelos con:

- relación almacenada como texto;
- dinero en `FloatField`;
- uso incorrecto de `null`;
- falta de unicidad;
- `CASCADE` riesgoso.

Debes detectar, corregir y justificar los cambios.

## Parte 2. Migración y consultas — 5 puntos

Debes:

- crear una migración para un requisito nuevo;
- revisar el plan;
- consultar registros mediante una relación;
- construir una búsqueda con `Q`;
- comparar columnas con `F`;
- generar una agregación.

## Parte 3. Administración y rendimiento — 5 puntos

Debes:

- agregar columnas, búsqueda y filtros;
- corregir una consulta N+1;
- explicar la diferencia entre admin e interfaz pública;
- mostrar evidencia del resultado.

Duración recomendada: **50 minutos**.

---

# 41. Calificación y punto de entrega

| Actividad | Valor |
|---|---:|
| 12 ejercicios obligatorios | 15 puntos |
| Mini proyecto | 20 puntos |
| Proyecto del módulo | 50 puntos |
| Evaluación práctica | 15 puntos |
| **Total** | **100 puntos** |

Para aprobar:

- obtén mínimo **80 puntos**;
- aprueba el proyecto principal;
- corrige todas las condiciones críticas.

Todo el módulo utiliza **un solo punto de entrega**.

## Nombre

```text
COA_DJANGO_M3_APELLIDO_NOMBRE
```

## Estructura

```text
COA_DJANGO_M3_APELLIDO_NOMBRE/
├── ejercicios/
│   ├── ejercicio_01/
│   └── ...
├── mini_proyecto/
├── proyecto_modulo/
├── evaluacion_practica/
├── evidencias/
└── explicacion_tecnica.pdf
```

Comprime:

```text
COA_DJANGO_M3_APELLIDO_NOMBRE.zip
```

La entrega debe contener:

- código y repositorio;
- archivos de migración;
- diagramas;
- diccionario de datos;
- comando de datos de prueba;
- consultas ORM;
- capturas ordenadas;
- explicación técnica;
- registro de IA;
- nombre y correo del estudiante.

No incluyas:

- entorno virtual;
- bases con datos personales;
- credenciales;
- secretos;
- archivos de caché;
- carpetas ajenas al proyecto.

[Entregar el Módulo 3](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 42. Errores comunes y soluciones

| Problema | Causa probable | Comprobación o solución |
|---|---|---|
| `no such table` | Migración no aplicada | Revisa `showmigrations` y ejecuta `migrate` |
| `AUTH_USER_MODEL` causa dependencias | Se configuró después de las migraciones iniciales | En un proyecto nuevo configúralo antes; en uno real crea un plan de migración |
| Django propone un valor para filas existentes | Se agregó un campo obligatorio | Decide un valor válido o realiza el cambio por etapas |
| `IntegrityError` por duplicado | Se violó una restricción única | Identifica el dato repetido y corrige el proceso, no la restricción sin analizar |
| `ProtectedError` al eliminar | La relación usa `PROTECT` | Resuelve conscientemente los registros relacionados |
| Una relación inversa no existe | `related_name` incorrecto | Revisa el nombre definido en el campo |
| `get()` produce `DoesNotExist` | No existe una coincidencia | Captura el caso o usa una herramienta adecuada en la vista |
| `get()` produce múltiples resultados | El criterio no era único | Usa una clave única o un `filter()` |
| Un `QuerySet` parece no ejecutar nada | Evaluación perezosa | Itera, lista, cuenta o inspecciona el uso final |
| Aparecen registros duplicados | Uniones sobre relaciones múltiples | Revisa la cardinalidad y considera `distinct()` |
| El valor con `F` sigue mostrando el anterior | La instancia no se recargó | Ejecuta `refresh_from_db()` |
| El admin realiza muchas consultas | Acceso repetido a relaciones | Usa `list_select_related` o ajusta el queryset |
| El comando duplica datos | Usa `create()` sin identificadores estables | Utiliza `get_or_create` o `update_or_create` conscientemente |
| La validación no se ejecuta con `save()` | `save()` no llama automáticamente a `full_clean()` | Valida mediante formularios o llama al proceso de validación apropiado |
| La base acepta un dato que el formulario rechaza | La regla solo existe en validación | Evalúa una restricción de base de datos |
| Se perdió historial | Eliminación en cascada incorrecta | Revisa `on_delete` y conserva registros empresariales |

## Secuencia de diagnóstico

```text
Requisito
   ↓
Modelo
   ↓
Migración
   ↓
Esquema
   ↓
Datos
   ↓
Consulta
   ↓
Presentación
```

Identifica en qué capa aparece la diferencia. No cambies el template si la consulta devuelve datos incorrectos, ni edites SQLite si falta una migración.

---

# 43. Recomendaciones profesionales

- Diseña las entidades antes de escribir modelos.
- Conserva un diccionario de datos.
- Pregunta por las reglas de eliminación.
- Distingue identidad interna de código empresarial.
- Utiliza `DecimalField` para dinero.
- Evita `null=True` en texto sin una razón.
- Usa `settings.AUTH_USER_MODEL` en relaciones.
- Configura el usuario personalizado al iniciar el proyecto.
- Lee cada migración.
- Incluye migraciones en Git.
- No modifiques manualmente el esquema.
- Confirma el conjunto antes de actualizar o eliminar en masa.
- Usa el admin como herramienta interna.
- Crea datos de prueba ficticios y reproducibles.
- Inspecciona el SQL cuando una consulta no se comprende.
- Corrige N+1 según las relaciones utilizadas.
- No optimices sin observar una necesidad.
- No coloques reglas centrales en señales para ocultar su ejecución.
- Registra las decisiones sugeridas por IA.
- Conserva la base de desarrollo fuera del repositorio si contiene datos sensibles.

---

# 44. Videos recomendados

Los siguientes videos son apoyo práctico. La documentación oficial de Django 5.2 es la referencia principal cuando una interfaz o sintaxis difiera.

## Crear un modelo y aplicar migraciones

[Cómo crear y migrar un modelo en Django](https://www.youtube.com/watch?v=2ZrAdNFUYc8)

LatamCode

Video breve en español de un canal pequeño. Úsalo para reforzar el ciclo `models.py → makemigrations → migrate`.

## Comprender las migraciones

[Cómo funcionan las migraciones en Django](https://www.youtube.com/watch?v=rgyXZYyPTe4)

OpenWebinars

Refuerza el propósito de las migraciones. Comprueba los comandos con la documentación de Django 5.2.

## Consultas avanzadas con `Q` y `F`

[ORM Django: consultas con Q, F y relaciones](https://www.youtube.com/watch?v=yjRl-tnlwyY)

Raul Torres

Úsalo para observar consultas combinadas, comparación de columnas y relaciones. El video incluye temas posteriores; estudia únicamente las secciones relacionadas con este módulo.

## Personalizar Django Admin

[Personalizando la vista de modelos en Django Admin](https://www.youtube.com/watch?v=IzaxiWdtP3s)

Developer.pe

Refuerza columnas y personalización administrativa. La apariencia puede corresponder a una versión anterior, pero los principios seleccionados continúan vigentes.

## Usuario personalizado

[Usuario personalizado en Django: modelo](https://www.youtube.com/watch?v=lNxQkW1kjto)

Developer.pe

Úsalo para reforzar la sustitución del usuario. Sigue la documentación 5.2 para la implementación del proyecto.

## Método de estudio

1. Define qué concepto deseas reforzar.
2. Mira únicamente la sección pertinente.
3. Reproduce el ejemplo en un proyecto de prueba.
4. Comprueba la versión.
5. consulta la documentación.
6. Adapta el concepto al dominio empresarial.
7. Explica el resultado sin el video.

---

# 45. Documentación oficial

## Modelos y campos

- [Modelos de Django 5.2](https://docs.djangoproject.com/es/5.2/topics/db/models/)
- [Referencia de campos](https://docs.djangoproject.com/es/5.2/ref/models/fields/)
- [Opciones de `Meta`](https://docs.djangoproject.com/es/5.2/ref/models/options/)
- [Restricciones de modelos](https://docs.djangoproject.com/es/5.2/ref/models/constraints/)
- [Índices de modelos](https://docs.djangoproject.com/es/5.2/ref/models/indexes/)

## Relaciones

- [Relaciones muchos a uno](https://docs.djangoproject.com/es/5.2/topics/db/examples/many_to_one/)
- [Relaciones muchos a muchos](https://docs.djangoproject.com/es/5.2/topics/db/examples/many_to_many/)
- [Relaciones uno a uno](https://docs.djangoproject.com/es/5.2/topics/db/examples/one_to_one/)

## Migraciones

- [Migraciones](https://docs.djangoproject.com/es/5.2/topics/migrations/)
- [Comandos `makemigrations`, `migrate` y `sqlmigrate`](https://docs.djangoproject.com/es/5.2/ref/django-admin/)

## ORM

- [Realizar consultas](https://docs.djangoproject.com/es/5.2/topics/db/queries/)
- [API de `QuerySet`](https://docs.djangoproject.com/es/5.2/ref/models/querysets/)
- [Expresiones de consulta](https://docs.djangoproject.com/es/5.2/ref/models/expressions/)
- [Agregaciones](https://docs.djangoproject.com/es/5.2/topics/db/aggregation/)
- [Optimización del acceso a la base de datos](https://docs.djangoproject.com/es/5.2/topics/db/optimization/)

## Usuarios y administración

- [Personalización de autenticación](https://docs.djangoproject.com/es/5.2/topics/auth/customizing/)
- [Sitio administrativo de Django](https://docs.djangoproject.com/es/5.2/ref/contrib/admin/)
- [Acciones del admin](https://docs.djangoproject.com/es/5.2/ref/contrib/admin/actions/)

## Comandos propios

- [Crear comandos de administración](https://docs.djangoproject.com/es/5.2/howto/custom-management-commands/)

## SQLite

- [Documentación oficial de SQLite](https://www.sqlite.org/docs.html)
- [Claves foráneas en SQLite](https://www.sqlite.org/foreignkeys.html)

---

# 46. Cómo consultar la documentación

No intentes memorizar la referencia completa de campos o `QuerySet`.

Ejemplo de búsqueda profesional:

```text
Necesidad:
Evitar precio negativo incluso fuera del formulario.

Responsable:
Modelo y base de datos.

Documentación:
CheckConstraint + Q.

Prueba:
Intentar crear un registro inválido.

Resultado:
La base rechaza la operación.
```

Para cada consulta:

1. escribe el resultado esperado en lenguaje natural;
2. dibuja el recorrido entre modelos;
3. busca el método oficial;
4. crea tres datos controlados;
5. ejecuta la consulta;
6. compara resultado y expectativa;
7. inspecciona el SQL si existe duda;
8. agrega el caso a tu documentación.

---

# 47. Material complementario

Este módulo necesita pocos materiales, pero algunos documentos ayudan a evitar errores:

1. **Plantilla de diagrama entidad-relación**
   - entidades;
   - campos;
   - claves;
   - cardinalidades;
   - obligatoriedad.

2. **Plantilla de diccionario de datos**

| Modelo | Campo | Tipo | Obligatorio | Único | Predeterminado | Regla |
|---|---|---|---|---|---|---|

3. **Lista de comprobación de migraciones**
   - cambio revisado;
   - migración creada;
   - archivo leído;
   - plan inspeccionado;
   - respaldo cuando corresponda;
   - aplicación probada;
   - migración incluida en Git.

4. **Guía rápida de consultas ORM**
   - CRUD;
   - lookups;
   - relaciones;
   - `Q`;
   - `F`;
   - agregaciones;
   - precarga.

5. **Plantilla de decisión `on_delete`**
   - registro principal;
   - dependiente;
   - valor histórico;
   - política;
   - riesgo;
   - aprobación.

6. **Matriz de pruebas de datos**
   - regla;
   - dato válido;
   - dato inválido;
   - operación;
   - resultado.

Estos recursos pueden mostrarse como páginas de consulta o PDFs breves. No es necesario crear un PDF separado para cada tema.

---

# 48. Glosario

**Modelo:** clase de Django que representa datos y su comportamiento relacionado.

**Entidad:** elemento del dominio con identidad propia.

**Atributo:** dato que describe una entidad.

**Registro:** instancia almacenada de un modelo.

**Esquema:** estructura de tablas, campos, relaciones y restricciones.

**ORM:** herramienta que permite consultar una base relacional mediante objetos y métodos.

**Clave primaria:** valor que identifica un registro de forma única.

**Clave foránea:** referencia a un registro de otra tabla.

**Cardinalidad:** cantidad de registros que pueden relacionarse entre dos entidades.

**Integridad referencial:** reglas que mantienen válidas las relaciones entre registros.

**Restricción:** regla protegida por la base de datos.

**Índice:** estructura que puede acelerar determinadas búsquedas.

**Migración:** cambio versionado en el esquema.

**Dependencia de migración:** cambio que debe existir antes de aplicar otro.

**`QuerySet`:** representación perezosa de una consulta y sus resultados.

**Manager:** interfaz de acceso al ORM, normalmente `objects`.

**Lookup:** operación de comparación usada en un filtro.

**`Q`:** objeto para combinar condiciones complejas.

**`F`:** referencia a un campo dentro de una expresión de base de datos.

**Agregación:** cálculo sobre un conjunto, como suma o promedio.

**Anotación:** valor calculado agregado a cada elemento de una consulta.

**N+1:** problema de rendimiento causado por una consulta inicial y consultas repetidas por registro.

**`select_related`:** precarga mediante unión para relaciones simples.

**`prefetch_related`:** precarga separada para colecciones y relaciones múltiples.

**Django Admin:** interfaz interna generada para administrar modelos.

**Comando de administración:** tarea ejecutable mediante `manage.py`.

**Idempotencia:** propiedad de una operación que puede repetirse sin producir duplicaciones o efectos adicionales indebidos.

**Dato de prueba:** información ficticia utilizada para comprobar el sistema.

**Historial:** registros que documentan operaciones pasadas y deben conservarse.

---

# 49. Resumen del módulo

En este módulo convertiste una interfaz en el núcleo de una aplicación persistente.

Aprendiste a:

- analizar necesidades empresariales;
- diseñar entidades y relaciones;
- representar el diseño mediante un diagrama;
- crear modelos y seleccionar campos;
- diferenciar validación y restricción;
- configurar relaciones y comportamientos de eliminación;
- crear un usuario personalizado desde el inicio;
- generar, leer y aplicar migraciones;
- reconstruir una base desde el historial;
- crear datos de prueba repetibles;
- realizar operaciones CRUD con el ORM;
- filtrar y recorrer relaciones;
- utilizar `Q`, `F` y agregaciones;
- relacionar el ORM con SQL;
- detectar N+1;
- personalizar Django Admin;
- conectar los datos persistentes con templates;
- usar IA como herramienta de revisión verificable.

El resultado es la base sobre la que se construirán los formularios, el CRUD, los permisos, los reportes y el proyecto final.

---

# 50. Lista de comprobación final

## Comprensión

- [ ] Puedo identificar entidades, atributos y relaciones.
- [ ] Puedo explicar mi diagrama.
- [ ] Distingo `blank` de `null`.
- [ ] Sé cuándo usar `DecimalField`.
- [ ] Puedo justificar cada `on_delete`.
- [ ] Comprendo el propósito de una migración.
- [ ] Puedo explicar la evaluación perezosa.
- [ ] Distingo `get` de `filter`.
- [ ] Puedo utilizar `Q`, `F` y agregaciones.
- [ ] Comprendo `select_related` y `prefetch_related`.
- [ ] Distingo el admin de la interfaz pública.

## Implementación

- [ ] Configuré el usuario personalizado antes de migrar.
- [ ] Implementé los modelos requeridos.
- [ ] Agregué restricciones e índices justificados.
- [ ] Incluí todas las migraciones.
- [ ] Reconstruí una base limpia.
- [ ] Creé datos ficticios reproducibles.
- [ ] Ejecuté las consultas obligatorias.
- [ ] Personalicé Django Admin.
- [ ] Conecté el catálogo con el ORM.
- [ ] Probé estados llenos y vacíos.
- [ ] Completé los doce ejercicios.
- [ ] Completé el mini proyecto.
- [ ] Completé el proyecto principal.
- [ ] Completé la evaluación práctica.

## Entrega

- [ ] El repositorio no contiene secretos.
- [ ] No utilicé datos personales reales.
- [ ] El README permite ejecutar el proyecto.
- [ ] El diagrama y el diccionario están incluidos.
- [ ] Las consultas están explicadas.
- [ ] Las capturas están ordenadas.
- [ ] El uso de IA está documentado.
- [ ] La carpeta y el archivo comprimido tienen el nombre solicitado.
- [ ] Todo se envió en el único punto de entrega.

---

# 51. Finalización del módulo

El Módulo 3 se considera completado cuando:

- obtienes al menos 80 puntos;
- el proyecto principal es aprobado;
- corriges todas las condiciones críticas;
- el sistema puede reconstruirse desde una base vacía;
- las relaciones, migraciones y consultas funcionan;
- puedes explicar las decisiones sin depender de la IA.

Cuando recibas la aprobación, estarás preparado para construir formularios, validaciones y un CRUD profesional sobre estos modelos.

**No avances al Módulo 4 hasta recibir la aprobación del proyecto.**
