# Módulo 4. Formularios, validaciones y CRUD profesional

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 7 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Tecnologías:** Django 5.2 LTS, SQLite, Django Forms y Bootstrap 5.3.8  
**Mini proyecto:** Agenda Profesional de Clientes  
**Proyecto del módulo:** Gestor Web de Clientes y Productos

---

# Introducción

En el Módulo 3 construiste la capa de datos del sistema empresarial:

```text
Modelos → relaciones → migraciones → SQLite → ORM
```

También utilizaste Django Admin para administrar información internamente. El admin es una herramienta valiosa para personal autorizado, pero no reemplaza las pantallas que necesita una aplicación real.

Un usuario de la aplicación no debería:

- conocer la estructura completa de los modelos;
- editar campos de auditoría;
- ver opciones que no corresponden a su tarea;
- recibir mensajes técnicos;
- eliminar historial accidentalmente;
- depender del panel administrativo para cada operación.

En este módulo construirás flujos propios:

```text
Usuario
   ↓
Formulario HTML
   ↓
Validación de Django
   ↓
Reglas del negocio
   ↓
ORM
   ↓
Mensaje y redirección
```

Implementarás las cuatro operaciones fundamentales:

```text
Create  → crear
Read    → consultar
Update  → actualizar
Delete  → eliminar o desactivar conscientemente
```

Estas operaciones forman un **CRUD**, pero un CRUD profesional es más que cuatro botones. Debe:

- validar datos;
- proteger solicitudes;
- mostrar errores comprensibles;
- evitar duplicados;
- conservar información histórica;
- confirmar acciones sensibles;
- manejar archivos;
- permitir búsqueda y filtros;
- funcionar con muchos registros;
- conservar una interfaz accesible y responsive.

La autenticación y los permisos empresariales se desarrollarán en el Módulo 5. Por eso, las operaciones de este módulo deben ejecutarse únicamente en el entorno educativo local. No publiques un CRUD modificable sin control de acceso.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- explicar el ciclo completo de un formulario web;
- distinguir solicitudes GET y POST;
- crear formularios con `Form`;
- crear formularios vinculados a modelos con `ModelForm`;
- seleccionar explícitamente los campos editables;
- personalizar widgets, etiquetas y textos de ayuda;
- aplicar validaciones automáticas;
- crear validaciones de campo y validaciones cruzadas;
- mostrar errores accesibles y comprensibles;
- proteger formularios con CSRF;
- aplicar Post/Redirect/Get;
- utilizar el sistema de mensajes;
- crear un CRUD completo mediante vistas funcionales;
- utilizar vistas genéricas de listado, detalle, creación, edición y eliminación;
- decidir entre vistas funcionales y vistas basadas en clases;
- construir URLs con identificadores y slugs;
- implementar confirmaciones;
- buscar, filtrar y ordenar con parámetros GET;
- limitar opciones de ordenamiento;
- paginar resultados;
- evitar duplicados en el formulario y la base;
- cargar imágenes y documentos;
- configurar archivos multimedia en desarrollo;
- validar tamaño, extensión y contenido esperado;
- reemplazar y eliminar archivos conscientemente;
- utilizar formsets básicos para registros relacionados;
- reutilizar templates de formularios;
- diseñar casos de prueba manual;
- utilizar IA para revisar flujos y validaciones sin confiar ciegamente.

---

# Conocimientos previos

Antes de comenzar debes poder:

- trabajar con URLs, vistas y templates;
- utilizar herencia de templates y componentes;
- crear modelos y migraciones;
- consultar mediante el ORM;
- comprender claves y relaciones;
- utilizar Django Admin;
- trabajar con Git.

El proyecto principal parte del núcleo de inventario aprobado en el Módulo 3.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Ciclo de formularios, Forms y ModelForms | 55 minutos |
| Validaciones, errores, CSRF, mensajes y PRG | 50 minutos |
| CRUD con vistas funcionales y genéricas | 1 hora |
| Búsqueda, filtros, orden y paginación | 40 minutos |
| Archivos multimedia y formsets | 45 minutos |
| Laboratorio y ejercicios obligatorios | 1 hora |
| Mini proyecto | 40 minutos |
| Proyecto del módulo | 1 hora y 10 minutos |
| **Total estimado** | **7 horas** |

El tiempo supone que los modelos del Módulo 3 ya están aprobados. Si debes corregir el diseño de datos, realiza esa corrección antes de construir formularios encima.

---

# 1. El ciclo completo de un formulario

Una pantalla de registro normalmente utiliza dos solicitudes:

```text
1. GET /productos/nuevo/
   ↓
   Django crea formulario vacío
   ↓
   Navegador muestra campos

2. POST /productos/nuevo/
   ↓
   Django recibe datos
   ↓
   valida
   ├── inválido → muestra formulario con errores
   └── válido   → guarda, crea mensaje y redirige
```

El formulario que llega al navegador es HTML. La validación y el guardado ocurren en el servidor.

Nunca confíes únicamente en:

- `required` de HTML;
- límites de JavaScript;
- campos ocultos;
- controles visuales;
- validación generada por el navegador.

Una persona puede enviar una solicitud sin utilizar tu página. Django debe validar siempre en el servidor.

---

# 2. GET y POST

## GET

Se utiliza para consultar o mostrar información:

```text
GET /productos/
GET /productos/?q=teclado
GET /productos/42/
```

Sus parámetros aparecen en la URL. Una solicitud GET no debería modificar datos.

## POST

Se utiliza para operaciones que cambian el estado:

```text
POST /productos/nuevo/
POST /productos/42/editar/
POST /productos/42/desactivar/
```

Los datos se reciben en:

```python
request.POST
request.FILES
```

## Regla

No implementes eliminaciones así:

```text
GET /productos/42/eliminar/
```

Un enlace, un bot o una previsualización podría activar la URL. La operación debe requerir una solicitud POST y una confirmación.

---

# 3. Formularios de Django con `Form`

Un `Form` es apropiado cuando los datos no corresponden directamente a un modelo:

- formulario de búsqueda;
- filtro;
- contacto que envía un mensaje;
- confirmación;
- importación;
- operación sobre varios modelos.

Ejemplo:

```python
from django import forms


class BusquedaProductoForm(forms.Form):
    q = forms.CharField(
        required=False,
        max_length=100,
        label="Buscar",
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Código o nombre",
            }
        ),
    )
    solo_activos = forms.BooleanField(
        required=False,
        initial=True,
        label="Mostrar solo activos",
        widget=forms.CheckboxInput(
            attrs={"class": "form-check-input"}
        ),
    )
```

Uso:

```python
formulario = BusquedaProductoForm(request.GET)

if formulario.is_valid():
    termino = formulario.cleaned_data["q"]
    solo_activos = formulario.cleaned_data["solo_activos"]
```

`cleaned_data` solo debe utilizarse después de `is_valid()`.

---

# 4. `ModelForm`

Un `ModelForm` crea campos y validaciones a partir de un modelo:

```python
from django import forms

from .models import Producto


class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "categoria",
            "proveedores",
            "precio",
            "existencias",
            "stock_minimo",
            "activo",
            "imagen",
        ]
```

Declara los campos explícitamente. Evita:

```python
fields = "__all__"
```

Si el modelo recibe después un campo interno, `__all__` podría exponerlo sin revisar el formulario.

No incluyas campos como:

- `creado_por`;
- fechas automáticas;
- totales calculados;
- indicadores internos;
- permisos;
- información que la persona no debe decidir.

---

# 5. Personalizar widgets

```python
class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "categoria",
            "proveedores",
            "precio",
            "existencias",
            "stock_minimo",
            "activo",
            "imagen",
        ]
        labels = {
            "codigo": "Código interno",
            "stock_minimo": "Existencias mínimas",
        }
        help_texts = {
            "codigo": "Utiliza un código único, por ejemplo TEC-001.",
        }
        widgets = {
            "codigo": forms.TextInput(
                attrs={"class": "form-control"}
            ),
            "nombre": forms.TextInput(
                attrs={"class": "form-control"}
            ),
            "descripcion": forms.Textarea(
                attrs={"class": "form-control", "rows": 4}
            ),
            "categoria": forms.Select(
                attrs={"class": "form-select"}
            ),
            "proveedores": forms.SelectMultiple(
                attrs={"class": "form-select", "size": 5}
            ),
            "precio": forms.NumberInput(
                attrs={"class": "form-control", "step": "0.01"}
            ),
            "existencias": forms.NumberInput(
                attrs={"class": "form-control", "min": 0}
            ),
            "stock_minimo": forms.NumberInput(
                attrs={"class": "form-control", "min": 0}
            ),
            "activo": forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            ),
            "imagen": forms.ClearableFileInput(
                attrs={"class": "form-control", "accept": "image/*"}
            ),
        }
```

Los atributos del widget mejoran la interfaz. No reemplazan la validación del servidor.

---

# 6. Formulario enlazado y no enlazado

Formulario vacío:

```python
formulario = ProductoForm()
```

Formulario con datos enviados:

```python
formulario = ProductoForm(request.POST, request.FILES)
```

Formulario para editar:

```python
formulario = ProductoForm(
    request.POST or None,
    request.FILES or None,
    instance=producto,
)
```

Un formulario **enlazado** conoce los datos enviados y puede validarlos. Un formulario no enlazado se utiliza para mostrar valores iniciales.

---

# 7. Validación automática

Un `ModelForm` puede aprovechar:

- tipo del campo;
- obligatoriedad;
- longitud;
- opciones;
- unicidad;
- validadores;
- restricciones compatibles;
- validación del modelo.

```python
if formulario.is_valid():
    producto = formulario.save()
```

No interpretes `is_valid()` como “el flujo completo es seguro”. Todavía debes revisar:

- permisos;
- reglas entre varios modelos;
- concurrencia;
- archivos;
- operaciones que requieren transacción;
- campos que el formulario no expone.

---

# 8. Validación de un campo

Para validar y normalizar un campo utiliza `clean_<campo>`:

```python
from django import forms


class ProductoForm(forms.ModelForm):
    def clean_codigo(self):
        codigo = self.cleaned_data["codigo"]
        codigo = codigo.strip().upper()

        if " " in codigo:
            raise forms.ValidationError(
                "El código no puede contener espacios."
            )

        return codigo
```

Debes devolver el valor limpio.

Otro ejemplo:

```python
def clean_nombre(self):
    nombre = " ".join(self.cleaned_data["nombre"].split())

    if len(nombre) < 3:
        raise forms.ValidationError(
            "El nombre debe contener al menos 3 caracteres."
        )

    return nombre
```

Normalizar no significa corregir silenciosamente cualquier dato. Transforma únicamente lo que tenga una regla clara.

---

# 9. Validación entre campos

Utiliza `clean()` cuando una regla depende de varios campos:

```python
def clean(self):
    datos = super().clean()
    existencias = datos.get("existencias")
    stock_minimo = datos.get("stock_minimo")
    activo = datos.get("activo")

    if (
        activo
        and existencias is not None
        and stock_minimo is not None
        and existencias < stock_minimo
    ):
        self.add_error(
            "existencias",
            "Un producto activo no puede iniciar por debajo del mínimo.",
        )

    return datos
```

Utiliza `.get()` porque un campo con error puede no existir en `cleaned_data`.

Si el error pertenece al conjunto completo:

```python
raise forms.ValidationError(
    "La combinación de datos no es válida."
)
```

Ese mensaje aparecerá en los errores no asociados a un campo.

---

# 10. Dónde debe vivir una regla

| Tipo de regla | Lugar principal |
|---|---|
| Apariencia del campo | Widget/template |
| Entrada requerida | Formulario/modelo |
| Formato de un campo | Validador o `clean_<campo>` |
| Relación entre campos del mismo formulario | `clean()` |
| Invariante de un modelo | Modelo/restricción |
| Operación sobre varios modelos | Servicio transaccional |
| Acceso según usuario | Permiso/vista |

Una regla importante puede existir en varias capas:

```text
HTML → ayuda inmediata
Form → mensaje comprensible
Modelo → consistencia reutilizable
Base → última barrera de integridad
```

No dupliques reglas sin propósito. Decide qué protege cada capa.

---

# 11. Mostrar errores correctamente

Template reutilizable:

```html
{% if form.non_field_errors %}
    <div class="alert alert-danger" role="alert">
        <h2 class="h6">Revisa la información general</h2>
        {{ form.non_field_errors }}
    </div>
{% endif %}

{% for field in form %}
    <div class="mb-3">
        {% if field.field.widget.input_type == "checkbox" %}
            <div class="form-check">
                {{ field }}
                {{ field.label_tag }}
            </div>
        {% else %}
            {{ field.label_tag }}
            {{ field }}
        {% endif %}

        {% if field.help_text %}
            <div class="form-text">{{ field.help_text }}</div>
        {% endif %}

        {% for error in field.errors %}
            <div class="invalid-feedback d-block">
                {{ error }}
            </div>
        {% endfor %}
    </div>
{% endfor %}
```

Un buen error:

- aparece cerca del campo;
- explica qué debe corregirse;
- conserva los datos válidos;
- no muestra detalles internos;
- puede percibirse sin depender solo del color;
- no culpa a la persona.

Evita mensajes como:

```text
Valor inválido.
Error 500.
IntegrityError.
```

---

# 12. Protección CSRF

Dentro de cada formulario POST:

```html
<form method="post">
    {% csrf_token %}
    ...
</form>
```

CSRF significa falsificación de solicitud entre sitios. El token permite comprobar que el formulario proviene de una interacción legítima con el sitio.

Si falta, Django responde normalmente con un error 403.

No desactives la protección para “hacer funcionar” el formulario. Encuentra la causa:

- falta `{% csrf_token %}`;
- la cookie no se envió;
- el formulario se publica hacia otro origen;
- la vista fue excluida de forma insegura.

---

# 13. Post/Redirect/Get

Después de guardar correctamente:

```text
POST /productos/nuevo/
   ↓
guardar
   ↓
REDIRECT /productos/42/
   ↓
GET /productos/42/
```

Esto evita que recargar la página repita el envío.

Vista funcional:

```python
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render


@login_required
def producto_crear(request):
    if request.method == "POST":
        formulario = ProductoForm(request.POST, request.FILES)

        if formulario.is_valid():
            producto = formulario.save(commit=False)
            producto.creado_por = request.user
            producto.save()
            formulario.save_m2m()

            messages.success(
                request,
                "El producto se registró correctamente.",
            )
            return redirect(
                "inventario:producto_detalle",
                slug=producto.slug,
            )
    else:
        formulario = ProductoForm()

    return render(
        request,
        "inventario/productos/formulario.html",
        {"form": formulario, "titulo": "Registrar producto"},
    )
```

`save_m2m()` es necesario después de `commit=False` cuando el formulario contiene relaciones muchos a muchos.

En este módulo `request.user` puede provenir de una sesión administrativa de prueba. La protección formal de la vista se añadirá en el Módulo 5.

---

# 14. Sistema de mensajes

En la vista:

```python
messages.success(request, "El producto se actualizó.")
messages.warning(request, "El producto quedó inactivo.")
messages.error(request, "No fue posible completar la operación.")
```

En `base.html`:

```html
{% if messages %}
    <div class="container mt-3" aria-live="polite">
        {% for message in messages %}
            <div
                class="alert alert-{{ message.tags|default:'info' }} alert-dismissible fade show"
                role="status"
            >
                {{ message }}
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Cerrar mensaje"
                ></button>
            </div>
        {% endfor %}
    </div>
{% endif %}
```

El mensaje confirma el resultado real. No muestres “guardado” antes de que la operación termine.

---

# 15. CRUD con vistas funcionales

Las vistas funcionales muestran explícitamente cada paso. Son apropiadas cuando el flujo tiene operaciones especiales o cuando la claridad es más importante que reducir líneas.

## Listar

```python
def producto_lista(request):
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

## Consultar detalle

```python
from django.shortcuts import get_object_or_404


def producto_detalle(request, slug):
    producto = get_object_or_404(
        Producto.objects.select_related("categoria"),
        slug=slug,
    )
    return render(
        request,
        "inventario/productos/detalle.html",
        {"producto": producto},
    )
```

## Actualizar

```python
@login_required
def producto_editar(request, slug):
    producto = get_object_or_404(Producto, slug=slug)
    formulario = ProductoForm(
        request.POST or None,
        request.FILES or None,
        instance=producto,
    )

    if request.method == "POST" and formulario.is_valid():
        producto = formulario.save()
        messages.success(request, "El producto se actualizó.")
        return redirect(
            "inventario:producto_detalle",
            slug=producto.slug,
        )

    return render(
        request,
        "inventario/productos/formulario.html",
        {
            "form": formulario,
            "titulo": "Editar producto",
            "producto": producto,
        },
    )
```

## Desactivar

```python
from django.views.decorators.http import require_POST


@login_required
@require_POST
def producto_desactivar(request, slug):
    producto = get_object_or_404(Producto, slug=slug)
    producto.activo = False
    producto.save(update_fields=["activo", "actualizado_en"])

    messages.warning(
        request,
        "El producto fue desactivado y su historial se conservó.",
    )
    return redirect("inventario:producto_lista")
```

Para información empresarial, desactivar suele ser más seguro que eliminar.

---

# 16. Vistas genéricas basadas en clases

Django ofrece vistas para patrones repetidos. No son “más profesionales” por sí solas; son útiles cuando el flujo coincide con el patrón.

## ListView

```python
from django.views.generic import ListView


class ProductoListView(ListView):
    model = Producto
    template_name = "inventario/productos/lista.html"
    context_object_name = "productos"
    paginate_by = 10

    def get_queryset(self):
        return (
            Producto.objects
            .select_related("categoria")
            .filter(activo=True)
            .order_by("nombre")
        )
```

## DetailView

```python
from django.views.generic import DetailView


class ProductoDetailView(DetailView):
    model = Producto
    template_name = "inventario/productos/detalle.html"
    context_object_name = "producto"
    slug_field = "slug"
    slug_url_kwarg = "slug"
```

## CreateView

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic import CreateView


class ProductoCreateView(
    LoginRequiredMixin,
    SuccessMessageMixin,
    CreateView,
):
    model = Producto
    form_class = ProductoForm
    template_name = "inventario/productos/formulario.html"
    success_message = "El producto se registró correctamente."

    def form_valid(self, form):
        form.instance.creado_por = self.request.user
        return super().form_valid(form)
```

`LoginRequiredMixin` se utiliza aquí como barrera mínima porque el modelo necesita un usuario responsable. El sistema completo de acceso, redirecciones, grupos y permisos se desarrolla en el Módulo 5.

Durante este módulo puedes dirigir temporalmente esa barrera al acceso del admin:

```python
# settings.py — configuración educativa temporal
LOGIN_URL = "/admin/login/"
```

El Módulo 5 reemplazará esta solución temporal por el flujo completo de autenticación de la aplicación.

## UpdateView

```python
from django.views.generic import UpdateView


class ProductoUpdateView(
    LoginRequiredMixin,
    SuccessMessageMixin,
    UpdateView,
):
    model = Producto
    form_class = ProductoForm
    template_name = "inventario/productos/formulario.html"
    slug_field = "slug"
    slug_url_kwarg = "slug"
    success_message = "El producto se actualizó correctamente."
```

## DeleteView

```python
from django.urls import reverse_lazy
from django.views.generic import DeleteView


class CategoriaDeleteView(LoginRequiredMixin, DeleteView):
    model = Categoria
    template_name = "inventario/categorias/confirmar_eliminacion.html"
    success_url = reverse_lazy("inventario:categoria_lista")

    def form_valid(self, form):
        messages.success(
            self.request,
            "La categoría se eliminó correctamente.",
        )
        return super().form_valid(form)
```

Utiliza `DeleteView` únicamente cuando eliminar sea correcto. Para productos y clientes con historial, crea una operación de desactivación.

---

# 17. Elegir entre función y clase

| Situación | Opción inicial |
|---|---|
| Listado estándar | `ListView` |
| Detalle estándar | `DetailView` |
| Formulario directo de un modelo | `CreateView` o `UpdateView` |
| Confirmación de eliminación simple | `DeleteView` |
| Operación con varios modelos | Vista funcional o clase especializada |
| Flujo con pasos particulares | Vista funcional |
| Equipo ya utiliza genéricas consistentemente | Clase genérica |
| La personalización oculta demasiado el flujo | Vista funcional |

La pregunta no es “¿cuál escribe menos código?”, sino:

> ¿Cuál permite que el siguiente desarrollador comprenda y modifique el flujo con menor riesgo?

No crees jerarquías de mixins complejas para evitar cinco líneas explícitas.

---

# 18. URLs con identificadores y slugs

## Identificador

```python
path(
    "clientes/<int:pk>/",
    ClienteDetailView.as_view(),
    name="cliente_detalle",
)
```

Ventajas:

- simple;
- estable;
- único.

## Slug

```python
path(
    "productos/<slug:slug>/",
    ProductoDetailView.as_view(),
    name="producto_detalle",
)
```

Modelo:

```python
slug = models.SlugField(max_length=180, unique=True)
```

Ejemplo:

```text
/productos/teclado-ergonomico-tec-001/
```

Un slug mejora la lectura de la URL, pero necesita unicidad y una estrategia de cambio.

## Agregar slug a registros existentes

No agregues de inmediato un campo obligatorio y único a una tabla con datos.

Proceso seguro:

```text
1. agregar slug temporalmente opcional
2. crear migración de datos
3. generar un slug único por registro
4. comprobar duplicados
5. convertirlo en obligatorio y único
```

No borres la base para evitar pensar la migración.

## `get_absolute_url`

```python
from django.urls import reverse


def get_absolute_url(self):
    return reverse(
        "inventario:producto_detalle",
        kwargs={"slug": self.slug},
    )
```

Las vistas genéricas pueden redirigir al objeto sin repetir la ruta.

---

# 19. URLs completas del CRUD

```python
from django.urls import path

from . import views


app_name = "inventario"

urlpatterns = [
    path(
        "productos/",
        views.ProductoListView.as_view(),
        name="producto_lista",
    ),
    path(
        "productos/nuevo/",
        views.ProductoCreateView.as_view(),
        name="producto_crear",
    ),
    path(
        "productos/<slug:slug>/",
        views.ProductoDetailView.as_view(),
        name="producto_detalle",
    ),
    path(
        "productos/<slug:slug>/editar/",
        views.ProductoUpdateView.as_view(),
        name="producto_editar",
    ),
    path(
        "productos/<slug:slug>/desactivar/",
        views.producto_desactivar,
        name="producto_desactivar",
    ),
]
```

Coloca `nuevo/` antes de la ruta dinámica para evitar ambigüedades conceptuales. Usa nombres consistentes:

```text
entidad_accion
producto_lista
producto_detalle
producto_crear
producto_editar
producto_desactivar
```

---

# 20. Confirmaciones para acciones sensibles

No uses un enlace GET para desactivar:

```html
<form
    method="post"
    action="{% url 'inventario:producto_desactivar' producto.slug %}"
>
    {% csrf_token %}
    <p>
        Desactivarás <strong>{{ producto.nombre }}</strong>.
        El producto dejará de aparecer en los listados activos,
        pero su historial se conservará.
    </p>
    <button class="btn btn-warning" type="submit">
        Confirmar desactivación
    </button>
    <a
        class="btn btn-outline-secondary"
        href="{% url 'inventario:producto_detalle' producto.slug %}"
    >
        Cancelar
    </a>
</form>
```

La confirmación debe indicar:

- objeto afectado;
- resultado de la acción;
- posibilidad de recuperación;
- alternativa para cancelar.

Evita mensajes genéricos como “¿Está seguro?” sin contexto.

---

# 21. Búsqueda con parámetros GET

```python
from django.db.models import Q


termino = request.GET.get("q", "").strip()

productos = Producto.objects.select_related("categoria")

if termino:
    productos = productos.filter(
        Q(codigo__icontains=termino)
        | Q(nombre__icontains=termino)
        | Q(descripcion__icontains=termino)
    )
```

Template:

```html
<form method="get" role="search" class="row g-3">
    <div class="col-12 col-md-8">
        <label class="form-label" for="id_q">Buscar productos</label>
        <input
            class="form-control"
            id="id_q"
            name="q"
            type="search"
            value="{{ request.GET.q }}"
            placeholder="Código, nombre o descripción"
        >
    </div>
    <div class="col-12 col-md-4 align-self-end">
        <button class="btn btn-primary w-100" type="submit">
            Buscar
        </button>
    </div>
</form>
```

La búsqueda usa GET porque no modifica datos y debe poder compartirse mediante URL.

---

# 22. Filtros combinados

```python
categoria = request.GET.get("categoria", "")
estado = request.GET.get("estado", "activos")

if categoria.isdigit():
    productos = productos.filter(categoria_id=int(categoria))

if estado == "activos":
    productos = productos.filter(activo=True)
elif estado == "inactivos":
    productos = productos.filter(activo=False)
```

No confíes en el valor recibido. Define opciones permitidas.

Formulario:

```html
<select class="form-select" name="estado">
    <option value="activos">Activos</option>
    <option value="inactivos">Inactivos</option>
    <option value="todos">Todos</option>
</select>
```

Para proyectos más grandes conviene representar filtros mediante un `Form`, porque centraliza tipos, opciones y errores.

---

# 23. Ordenamiento seguro

No pases directamente un parámetro recibido a `order_by()`:

```python
# Evitar
productos.order_by(request.GET.get("orden"))
```

Utiliza una lista permitida:

```python
ORDENES_PERMITIDOS = {
    "nombre": "nombre",
    "-nombre": "-nombre",
    "precio": "precio",
    "-precio": "-precio",
    "recientes": "-creado_en",
}

orden_solicitado = request.GET.get("orden", "nombre")
orden = ORDENES_PERMITIDOS.get(orden_solicitado, "nombre")
productos = productos.order_by(orden)
```

Además de seguridad, esto evita errores por nombres de campos inexistentes.

---

# 24. Paginación

La paginación evita cargar cientos de registros en una sola respuesta.

## En una vista funcional

```python
from django.core.paginator import Paginator


paginador = Paginator(productos, 10)
pagina = request.GET.get("page")
page_obj = paginador.get_page(pagina)
```

## En `ListView`

```python
paginate_by = 10
```

Template:

```html
{% if page_obj.paginator.num_pages > 1 %}
    <nav aria-label="Paginación de productos">
        <ul class="pagination justify-content-center">
            {% if page_obj.has_previous %}
                <li class="page-item">
                    <a
                        class="page-link"
                        href="?page={{ page_obj.previous_page_number }}&q={{ request.GET.q|urlencode }}&estado={{ request.GET.estado|urlencode }}"
                    >
                        Anterior
                    </a>
                </li>
            {% endif %}

            <li class="page-item active" aria-current="page">
                <span class="page-link">
                    Página {{ page_obj.number }} de {{ page_obj.paginator.num_pages }}
                </span>
            </li>

            {% if page_obj.has_next %}
                <li class="page-item">
                    <a
                        class="page-link"
                        href="?page={{ page_obj.next_page_number }}&q={{ request.GET.q|urlencode }}&estado={{ request.GET.estado|urlencode }}"
                    >
                        Siguiente
                    </a>
                </li>
            {% endif %}
        </ul>
    </nav>
{% endif %}
```

La paginación debe conservar búsqueda, filtros y orden. En un proyecto grande conviene crear una utilidad que reconstruya la cadena de consulta sin duplicar parámetros.

---

# 25. ListView con búsqueda, filtros y orden

```python
class ProductoListView(ListView):
    model = Producto
    template_name = "inventario/productos/lista.html"
    context_object_name = "productos"
    paginate_by = 10

    def get_queryset(self):
        queryset = Producto.objects.select_related("categoria")

        termino = self.request.GET.get("q", "").strip()
        categoria = self.request.GET.get("categoria", "")
        estado = self.request.GET.get("estado", "activos")
        orden_solicitado = self.request.GET.get("orden", "nombre")

        if termino:
            queryset = queryset.filter(
                Q(codigo__icontains=termino)
                | Q(nombre__icontains=termino)
            )

        if categoria.isdigit():
            queryset = queryset.filter(categoria_id=int(categoria))

        if estado == "activos":
            queryset = queryset.filter(activo=True)
        elif estado == "inactivos":
            queryset = queryset.filter(activo=False)

        ordenes = {
            "nombre": "nombre",
            "-nombre": "-nombre",
            "precio": "precio",
            "-precio": "-precio",
        }
        orden = ordenes.get(orden_solicitado, "nombre")
        return queryset.order_by(orden)

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto["categorias"] = Categoria.objects.filter(
            activa=True
        ).order_by("nombre")
        return contexto
```

Separa este código en un formulario o servicio de filtros si crece. Una vista de listado no debe convertirse en un archivo de cientos de líneas.

---

# 26. Evitar duplicados

La prevención de duplicados necesita más de una capa.

## Base de datos

```python
codigo = models.CharField(max_length=30, unique=True)
```

## Normalización del formulario

```python
def clean_codigo(self):
    return self.cleaned_data["codigo"].strip().upper()
```

## Mensaje comprensible

`ModelForm` convierte normalmente la violación de unicidad detectada durante validación en un error del campo.

## Condición de carrera

Dos solicitudes simultáneas pueden validar el mismo valor antes de que una lo guarde. La restricción de la base sigue siendo la última protección.

No resuelvas duplicados así:

```python
if not Producto.objects.filter(codigo=codigo).exists():
    Producto.objects.create(...)
```

Esa comprobación por sí sola no garantiza exclusión entre solicitudes.

## Duplicados conceptuales

Dos clientes pueden tener el mismo nombre. No conviertas el nombre en único sin una regla. Utiliza una identificación empresarial cuando exista.

---

# 27. Archivos multimedia

Los archivos estáticos pertenecen al código:

```text
CSS, JavaScript, logotipos del sitio
```

Los archivos multimedia son cargados durante el uso:

```text
fotografía del cliente, imagen del producto, documento
```

Modelo:

```python
imagen = models.ImageField(
    upload_to="productos/%Y/%m/",
    blank=True,
)
```

`ImageField` necesita Pillow:

```bash
python -m pip install Pillow
```

Configuración de desarrollo:

```python
# settings.py
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
```

URLs principales:

```python
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # ...
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
```

La ayuda `static()` anterior es solo para desarrollo. En producción los archivos se sirven mediante una estrategia de almacenamiento y servidor apropiada.

---

# 28. Formulario para archivos

HTML:

```html
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form }}
    <button type="submit">Guardar</button>
</form>
```

Vista:

```python
formulario = ProductoForm(
    request.POST or None,
    request.FILES or None,
    instance=producto,
)
```

Si falta `multipart/form-data` o `request.FILES`, el archivo no llegará correctamente al formulario.

Mostrar una imagen opcional:

```html
{% if producto.imagen %}
    <img
        src="{{ producto.imagen.url }}"
        alt="Imagen de {{ producto.nombre }}"
        width="480"
        height="320"
        class="img-fluid rounded"
    >
{% else %}
    <div class="bg-body-tertiary rounded p-4 text-center">
        Producto sin imagen
    </div>
{% endif %}
```

Comprueba que el campo tenga archivo antes de utilizar `.url`.

---

# 29. Validación de archivos

Validador de tamaño:

```python
from django.core.exceptions import ValidationError


def validar_tamano_archivo(archivo):
    limite = 2 * 1024 * 1024

    if archivo.size > limite:
        raise ValidationError(
            "El archivo no puede superar 2 MB."
        )
```

Extensiones permitidas:

```python
from django.core.validators import FileExtensionValidator


imagen = models.ImageField(
    upload_to="productos/%Y/%m/",
    blank=True,
    validators=[
        validar_tamano_archivo,
        FileExtensionValidator(
            allowed_extensions=["jpg", "jpeg", "png", "webp"]
        ),
    ],
)
```

La extensión no demuestra el contenido real. `ImageField` realiza validación de imagen con Pillow, pero un sistema de alto riesgo puede necesitar análisis adicional, almacenamiento aislado y políticas de descarga.

Reglas:

- limita tamaño;
- limita tipos esperados;
- no confíes en el nombre original;
- no ejecutes archivos cargados;
- no guardes secretos en carpetas públicas;
- utiliza nombres generados por el almacenamiento;
- considera cuotas y análisis de malware en producción.

---

# 30. Reemplazo y eliminación responsable de archivos

Django no elimina automáticamente todos los archivos antiguos cuando un registro cambia o desaparece. Ese comportamiento evita borrar archivos compartidos por accidente, pero puede dejar archivos huérfanos.

## Reemplazar una imagen

Captura el nombre anterior antes de validar y guardar:

```python
from django.db import transaction


def producto_editar(request, slug):
    producto = get_object_or_404(Producto, slug=slug)
    nombre_anterior = (
        producto.imagen.name if producto.imagen else ""
    )
    almacenamiento = producto.imagen.storage

    formulario = ProductoForm(
        request.POST or None,
        request.FILES or None,
        instance=producto,
    )

    if request.method == "POST" and formulario.is_valid():
        with transaction.atomic():
            producto_actualizado = formulario.save()
            nombre_nuevo = (
                producto_actualizado.imagen.name
                if producto_actualizado.imagen
                else ""
            )

            if nombre_anterior and nombre_anterior != nombre_nuevo:
                transaction.on_commit(
                    lambda: almacenamiento.delete(nombre_anterior)
                )

        messages.success(request, "El producto se actualizó.")
        return redirect(producto_actualizado)

    return render(
        request,
        "inventario/productos/formulario.html",
        {"form": formulario, "producto": producto},
    )
```

El archivo anterior se elimina después de confirmar la transacción de la base.

La base de datos y el almacenamiento de archivos no comparten necesariamente la misma transacción. Si falla el guardado del archivo o la confirmación, puede ser necesario detectar archivos huérfanos mediante una tarea de mantenimiento.

## Antes de eliminar un archivo

Comprueba:

- que no esté referenciado por otro registro;
- que la operación se haya confirmado;
- que el almacenamiento permita eliminarlo;
- que exista una política de respaldo;
- que la eliminación corresponda a la legislación y al negocio.

No ejecutes una limpieza masiva basándote únicamente en el nombre del archivo.

---

# 31. Formsets básicos

Un formset administra varios formularios semejantes en una misma solicitud. Un inline formset maneja varios registros hijos relacionados con un padre.

Ejemplo: un cliente puede tener varios documentos.

```python
class DocumentoCliente(models.Model):
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name="documentos",
    )
    nombre = models.CharField(max_length=100)
    archivo = models.FileField(
        upload_to="clientes/documentos/%Y/%m/",
        validators=[
            validar_tamano_archivo,
            FileExtensionValidator(
                allowed_extensions=["pdf", "jpg", "jpeg", "png"]
            ),
        ],
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
```

Formulario y formset:

```python
from django.forms import inlineformset_factory


class DocumentoClienteForm(forms.ModelForm):
    class Meta:
        model = DocumentoCliente
        fields = ["nombre", "archivo"]


DocumentoClienteFormSet = inlineformset_factory(
    Cliente,
    DocumentoCliente,
    form=DocumentoClienteForm,
    extra=1,
    can_delete=True,
    max_num=5,
    validate_max=True,
)
```

Vista:

```python
from django.db import transaction


def cliente_editar(request, pk):
    cliente = get_object_or_404(Cliente, pk=pk)
    formulario = ClienteForm(
        request.POST or None,
        instance=cliente,
    )
    documentos = DocumentoClienteFormSet(
        request.POST or None,
        request.FILES or None,
        instance=cliente,
        prefix="documentos",
    )

    if (
        request.method == "POST"
        and formulario.is_valid()
        and documentos.is_valid()
    ):
        with transaction.atomic():
            formulario.save()
            documentos.save()

        messages.success(
            request,
            "El cliente y sus documentos se actualizaron.",
        )
        return redirect("clientes:detalle", pk=cliente.pk)

    return render(
        request,
        "clientes/formulario.html",
        {"form": formulario, "documentos": documentos},
    )
```

Template:

```html
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {{ documentos.management_form }}

    {{ form.as_p }}

    {% for documento_form in documentos %}
        <fieldset class="border rounded p-3 mb-3">
            <legend class="h6">
                Documento {{ forloop.counter }}
            </legend>
            {{ documento_form.as_p }}
        </fieldset>
    {% endfor %}

    <button class="btn btn-primary" type="submit">
        Guardar
    </button>
</form>
```

`management_form` es obligatorio. Contiene la cantidad total e inicial de formularios.

Si el formset elimina un registro que contiene un archivo, aplica también la política de eliminación de archivos. Borrar la fila no garantiza que desaparezca el archivo físico.

## Límites del módulo

Se trabajará con una cantidad fija de formularios adicionales. Agregar y quitar filas dinámicamente con JavaScript necesita sincronizar correctamente los campos de gestión; no es necesario para aprobar este módulo.

---

# 32. Reutilización de templates

No crees un template distinto para cada formulario si comparten estructura.

```text
templates/
└── inventario/
    ├── components/
    │   ├── campo_formulario.html
    │   ├── filtros_productos.html
    │   └── paginacion.html
    ├── productos/
    │   ├── lista.html
    │   ├── detalle.html
    │   ├── formulario.html
    │   └── confirmar_desactivacion.html
    └── categorias/
        ├── lista.html
        └── formulario.html
```

`formulario.html` puede servir para crear y editar:

```html
{% extends "base.html" %}

{% block title %}{{ titulo }} | Gestión empresarial{% endblock %}

{% block content %}
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
            <h1>{{ titulo }}</h1>

            <form
                method="post"
                enctype="multipart/form-data"
                class="card card-body shadow-sm"
                novalidate
            >
                {% csrf_token %}
                {% include "components/formulario_campos.html" with form=form only %}

                <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-primary" type="submit">
                        Guardar
                    </button>
                    <a
                        class="btn btn-outline-secondary"
                        href="{{ url_cancelar }}"
                    >
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>
{% endblock %}
```

`novalidate` permite observar los mensajes del servidor durante el aprendizaje. Si lo utilizas, no significa que debas ignorar la ayuda del navegador en el proyecto final.

---

# 33. Accesibilidad de formularios

Comprueba:

- cada control tiene una etiqueta;
- los campos relacionados se agrupan con `fieldset` y `legend`;
- los errores aparecen junto al campo;
- existe un resumen para errores generales;
- el foco es visible;
- el orden de tabulación es lógico;
- no se depende solo del color;
- los campos obligatorios se explican;
- los botones describen la acción;
- la cancelación no se confunde con el guardado;
- después de un error se conservan los datos válidos;
- la página puede ampliarse sin perder contenido.

No uses el placeholder como única etiqueta. El texto desaparece cuando la persona escribe.

---

# 34. Laboratorio guiado: CRUD de productos

## Paso 1. Crear una rama

```bash
git add .
git commit -m "chore: cerrar nucleo de datos del modulo 3"
git switch -c modulo-4-crud
```

## Paso 2. Ajustar el modelo

Agrega de forma planificada:

- `slug` único;
- imagen opcional;
- cualquier restricción aprobada;
- modelo de documentos de cliente si lo utilizarás.

Si existen registros, realiza una migración por etapas para el slug. No borres la base.

```bash
python manage.py makemigrations
python manage.py migrate --plan
python manage.py migrate
python manage.py check
```

## Paso 3. Crear `forms.py`

Construye:

- `ProductoForm`;
- `ClienteForm`;
- `CategoriaForm`;
- `BusquedaProductoForm`;
- `DocumentoClienteForm`;
- inline formset.

Declara los campos editables y añade estilos Bootstrap.

## Paso 4. Implementar validaciones

Producto:

- código normalizado;
- nombre con espacios normalizados;
- precio no negativo;
- stock mínimo no negativo;
- imagen de máximo 2 MB;
- extensión permitida;
- combinación de estado y existencias.

Cliente:

- identificación normalizada;
- correo válido;
- teléfono opcional con longitud razonable;
- documento de tamaño y tipo permitido.

Categoría:

- nombre normalizado;
- duplicados evitados;
- eliminación protegida si tiene productos.

## Paso 5. Crear listado y detalle

Listado:

- tabla o tarjetas responsive;
- búsqueda;
- filtro de categoría;
- filtro de estado;
- orden;
- diez registros por página;
- estado vacío;
- enlaces con nombre.

Detalle:

- información principal;
- imagen o estado sin imagen;
- categoría y proveedores;
- botones de editar y desactivar;
- confirmación antes de la acción sensible.

## Paso 6. Crear y editar

Utiliza un template compartido. Comprueba:

- GET muestra formulario;
- POST inválido conserva datos;
- POST válido guarda;
- muchos a muchos se conserva;
- mensaje aparece;
- redirección evita reenvío;
- cancelar regresa a un lugar seguro.

## Paso 7. Desactivar

La desactivación:

- requiere POST;
- incluye CSRF;
- solicita confirmación;
- conserva historial;
- muestra mensaje;
- retira el producto del listado activo;
- permite verlo en el filtro de inactivos.

## Paso 8. Manejar imágenes

Comprueba:

- imagen válida;
- archivo demasiado grande;
- extensión no permitida;
- producto sin imagen;
- reemplazo de imagen;
- archivo anterior según la política definida.

## Paso 9. Crear CRUD de categorías

Incluye listado, creación, edición y eliminación controlada. Si la categoría tiene productos, muestra un mensaje comprensible y no un error técnico.

Ejemplo con `ProtectedError`:

```python
from django.db.models.deletion import ProtectedError


class CategoriaDeleteView(LoginRequiredMixin, DeleteView):
    model = Categoria
    template_name = "inventario/categorias/confirmar_eliminacion.html"
    success_url = reverse_lazy("inventario:categoria_lista")

    def form_valid(self, form):
        try:
            respuesta = super().form_valid(form)
        except ProtectedError:
            messages.error(
                self.request,
                "No puedes eliminar una categoría que contiene productos.",
            )
            return redirect("inventario:categoria_lista")

        messages.success(
            self.request,
            "La categoría se eliminó.",
        )
        return respuesta
```

## Paso 10. Crear CRUD de clientes

Incluye:

- listado;
- detalle;
- registro;
- edición;
- desactivación;
- búsqueda;
- paginación;
- documentos mediante formset.

## Paso 11. Probar

Crea una matriz con:

- operación;
- entrada;
- resultado esperado;
- resultado obtenido;
- evidencia;
- corrección.

Prueba datos válidos, inválidos, límites, duplicados, archivos y acciones repetidas.

## Paso 12. Registrar commits

```text
feat: crear formularios y validaciones de inventario
feat: implementar crud de productos
feat: agregar busqueda filtros y paginacion
feat: configurar imagenes de productos
feat: implementar crud controlado de categorias
feat: crear gestion de clientes y documentos
fix: conservar filtros durante paginacion
docs: registrar casos de prueba del crud
```

---

# 35. Inteligencia Artificial para revisar un CRUD

## Usos adecuados

- generar un borrador de `ModelForm`;
- enumerar casos límite;
- detectar campos que no deberían exponerse;
- explicar por qué un formulario no es válido;
- comparar una vista funcional con una genérica;
- encontrar duplicación en templates;
- revisar el flujo GET–POST–redirect;
- proponer pruebas manuales;
- detectar validaciones exclusivamente visuales;
- analizar el manejo de archivos.

## Prompt para revisar un formulario

```text
Revisa este ModelForm de Django 5.2.
Primero enumera los campos del modelo que el usuario puede modificar
y los que deben permanecer internos.

Después revisa:
- campos expuestos;
- normalización;
- validaciones de campo;
- validaciones cruzadas;
- mensajes;
- archivos;
- duplicados;
- accesibilidad del template.

No agregues reglas empresariales inventadas. Formula preguntas.
```

## Prompt para diagnosticar un CRUD

```text
Analiza este flujo de creación:
URL, vista, formulario, modelo y template.

Síntoma:
[describe el resultado exacto]

Indica el recorrido de la solicitud, propone una hipótesis por vez
y diseña una prueba mínima. No reescribas todos los archivos.
```

## Prompt para casos de prueba

```text
Genera una matriz de pruebas manuales para este formulario.
Incluye casos válidos, vacíos, límites, duplicados,
archivos incorrectos, reenvío y cancelación.
Para cada caso indica precondición, pasos y resultado esperado.
No afirmes que el sistema está probado hasta ejecutar los casos.
```

## Validación obligatoria

Comprueba:

1. ¿La IA incluyó `csrf_token`?
2. ¿Utilizó POST para cambios?
3. ¿Pasó `request.FILES`?
4. ¿Agregó `multipart/form-data`?
5. ¿Expuso campos internos?
6. ¿Guardó muchos a muchos después de `commit=False`?
7. ¿Redirigió después del POST válido?
8. ¿Manejó errores sin ocultarlos?
9. ¿Limitó archivos en el servidor?
10. ¿Propuso eliminar datos históricos?
11. ¿La vista genérica realmente simplifica?
12. ¿Puedes explicar cada cambio?

Registra qué aceptaste, modificaste y rechazaste.

---

# 36. Ejercicios obligatorios

Completa los doce ejercicios en orden. Cada solución debe incluir código, prueba y explicación.

## Ejercicio 1. Seguir una solicitud

Dibuja el recorrido de:

1. abrir un formulario de cliente;
2. enviarlo con datos inválidos;
3. corregirlo;
4. guardarlo;
5. recargar la página final.

Para cada paso indica:

- método HTTP;
- URL;
- datos recibidos;
- estado del formulario;
- consulta o guardado;
- respuesta;
- mensaje.

Explica cómo Post/Redirect/Get evita un registro duplicado al recargar.

## Ejercicio 2. Formulario de búsqueda

Crea un `Form` no vinculado a modelo con:

- término opcional de máximo 80 caracteres;
- categoría opcional;
- estado con opciones controladas;
- precio mínimo y máximo opcionales;
- ordenamiento permitido.

Valida que el precio mínimo no sea mayor que el máximo. Utiliza `cleaned_data` para construir un `QuerySet`.

## Ejercicio 3. ModelForm explícito

Crea un `ClienteForm` que permita editar únicamente:

- identificación;
- nombre;
- correo;
- teléfono;
- estado.

Agrega etiquetas, textos de ayuda y clases Bootstrap. Demuestra que la fecha de creación no puede modificarse desde el formulario.

## Ejercicio 4. Validaciones

Implementa:

- identificación sin espacios exteriores y en mayúsculas;
- nombre con espacios repetidos eliminados;
- teléfono opcional;
- correo obligatorio cuando el teléfono esté vacío;
- mensaje asociado al campo correcto;
- prueba con al menos seis combinaciones.

Entrega una tabla con entrada y resultado.

## Ejercicio 5. Errores accesibles y CSRF

Construye un template que:

- muestre errores generales;
- muestre errores junto a cada campo;
- conserve etiquetas;
- incluya ayuda;
- tenga un botón descriptivo;
- incluya CSRF;
- permita cancelar.

Después elimina temporalmente el token, observa la respuesta 403 y vuelve a colocarlo. No desactives la protección.

## Ejercicio 6. CRUD funcional de proveedores

Mediante vistas funcionales crea:

- listado;
- detalle;
- registro;
- edición;
- desactivación por POST.

Usa un único template para crear y editar, mensajes y redirección después de guardar. Documenta por qué elegiste funciones.

## Ejercicio 7. CRUD genérico de categorías

Implementa:

- `ListView`;
- `DetailView`;
- `CreateView`;
- `UpdateView`;
- `DeleteView`.

Maneja una categoría protegida sin mostrar `ProtectedError`. Explica qué métodos y atributos configuraste.

## Ejercicio 8. Búsqueda, filtros y orden

Sobre productos permite:

- buscar por código o nombre;
- filtrar por categoría;
- filtrar por activos, inactivos o todos;
- ordenar por nombre o precio en ambos sentidos;
- combinar todas las opciones.

Utiliza una lista permitida para `order_by`. Prueba un parámetro de orden inexistente y confirma que se usa el valor predeterminado.

## Ejercicio 9. Paginación persistente

Crea 27 registros de prueba y pagina de diez en diez.

Comprueba:

- tres páginas;
- anterior y siguiente;
- filtro conservado al cambiar de página;
- búsqueda conservada;
- estado vacío;
- número de página no válido;
- página mayor que el máximo.

Documenta el resultado de `Paginator.get_page()`.

## Ejercicio 10. Imagen de producto

Agrega carga opcional de imagen:

- máximo 2 MB;
- JPG, PNG o WebP;
- formulario multipart;
- estado sin imagen;
- reemplazo;
- política de eliminación.

Prueba un PDF renombrado con extensión `.jpg` y explica por qué una extensión no basta para confiar en el contenido.

## Ejercicio 11. Documentos relacionados

Crea un inline formset para que un cliente administre hasta cinco documentos.

Debe:

- incluir `management_form`;
- guardar cliente y documentos en una transacción;
- aceptar PDF, JPG y PNG;
- permitir marcar un documento para eliminación;
- conservar errores;
- evitar más de cinco.

Adjunta pruebas con cero, uno, tres y seis documentos.

## Ejercicio 12. Diagnóstico de un CRUD roto

Corrige un proyecto con estos defectos:

1. una eliminación utiliza GET;
2. falta CSRF;
3. el formulario usa `fields = "__all__"`;
4. se utiliza `request.POST` sin `request.FILES`;
5. falta `multipart/form-data`;
6. el POST válido renderiza directamente y se repite al recargar;
7. el orden se pasa sin lista permitida;
8. la paginación pierde filtros;
9. una imagen anterior queda huérfana;
10. un `get()` no maneja registro inexistente;
11. el formset no incluye `management_form`;
12. un error técnico se muestra al usuario.

Para cada problema registra:

| Síntoma | Causa | Riesgo | Corrección | Prueba |
|---|---|---|---|---|

---

# 37. Retos adicionales

1. **Cadena de consulta reutilizable:** conserva todos los filtros al paginar sin copiar cada parámetro manualmente.
2. **Slug por etapas:** crea una migración de datos para registros existentes.
3. **Filtro validado:** mueve búsqueda, filtros y orden a un `Form`.
4. **Archivo huérfano:** crea un comando que detecte archivos no referenciados sin eliminarlos.
5. **Reactivación:** agrega una operación POST para reactivar productos.
6. **Prueba automatizada:** escribe pruebas de formulario para límites y duplicados.
7. **Vista comparada:** implementa el mismo flujo con función y clase; justifica cuál conservarías.

---

# 38. Mini proyecto: Agenda Profesional de Clientes

## Contexto

Una empresa necesita una agenda interna para consultar clientes, mantener sus datos actualizados y adjuntar documentación básica.

## Objetivo

Construir un módulo CRUD responsive con validaciones, búsqueda, paginación y archivos.

## Funciones obligatorias

- listado de clientes;
- detalle;
- registro;
- edición;
- desactivación;
- reactivación;
- búsqueda por identificación, nombre o correo;
- filtro por estado;
- orden por nombre o fecha;
- paginación de ocho registros;
- fotografía opcional o documento;
- hasta tres documentos relacionados;
- mensajes;
- confirmaciones.

## Reglas

- identificación única y normalizada;
- nombre obligatorio;
- correo válido;
- teléfono opcional;
- debe existir correo o teléfono;
- cliente inactivo se conserva;
- desactivar requiere POST;
- archivos limitados a tipos y tamaño definidos;
- errores se muestran junto al campo;
- ningún campo interno se expone.

## Páginas

```text
/clientes/
/clientes/nuevo/
/clientes/<int:pk>/
/clientes/<int:pk>/editar/
/clientes/<int:pk>/desactivar/
/clientes/<int:pk>/reactivar/
```

## Evidencias

- listado responsive;
- búsqueda;
- filtro;
- tres páginas de resultados;
- registro válido;
- cinco errores de validación;
- edición;
- confirmación;
- cliente inactivo;
- carga de archivo válida e inválida;
- documentos relacionados;
- mensajes;
- navegación con teclado.

## Entregables

- código;
- migraciones;
- casos de prueba;
- capturas;
- explicación de desactivación;
- explicación de archivos;
- registro de IA.

## Criterios del mini proyecto

| Criterio | Puntos |
|---|---:|
| CRUD y navegación | 5 |
| Formularios y validaciones | 5 |
| Búsqueda, filtros y paginación | 3 |
| Archivos y formset | 3 |
| Diseño y accesibilidad | 2 |
| Pruebas y documentación | 2 |
| **Total** | **20** |

---

# 39. Proyecto del módulo: Gestor Web de Clientes y Productos

## Situación profesional

El núcleo de datos del Módulo 3 ya fue aprobado. La empresa necesita dejar de depender de Django Admin para las operaciones cotidianas y utilizar pantallas diseñadas para sus procesos.

## Objetivo

Ampliar el sistema empresarial con módulos web completos para administrar clientes, categorías y productos.

## Alcance

```text
Gestión empresarial
├── Clientes
│   ├── lista, detalle, crear y editar
│   ├── desactivar y reactivar
│   ├── buscar, filtrar, ordenar y paginar
│   └── documentos
├── Categorías
│   ├── lista, detalle, crear y editar
│   └── eliminación protegida
└── Productos
    ├── lista, detalle, crear y editar
    ├── desactivar y reactivar
    ├── buscar, filtrar, ordenar y paginar
    ├── imagen
    └── proveedores
```

## Requisitos generales

- interfaz heredada del Módulo 2;
- modelos aprobados del Módulo 3;
- URLs con nombre;
- slugs para productos;
- identificadores para clientes y categorías;
- formularios con campos explícitos;
- errores comprensibles;
- CSRF en todos los POST;
- Post/Redirect/Get;
- mensajes;
- confirmaciones;
- estados vacíos;
- diseño mobile first;
- navegación con teclado.

## Módulo de clientes

Debe incluir:

- listado con identificación, nombre, contacto y estado;
- detalle;
- registro;
- edición;
- desactivación y reactivación mediante POST;
- búsqueda por identificación, nombre, correo o teléfono;
- filtro de estado;
- orden permitido;
- paginación;
- carga de documentos mediante inline formset;
- máximo cinco documentos;
- validación de archivo;
- conservación de historial.

## Módulo de categorías

Debe incluir:

- listado;
- detalle con cantidad de productos;
- creación;
- edición;
- búsqueda;
- eliminación con confirmación;
- manejo comprensible de categoría protegida;
- prevención de duplicados.

Una categoría utilizada no debe desaparecer.

## Módulo de productos

Debe incluir:

- listado responsive;
- detalle;
- creación;
- edición;
- desactivación y reactivación;
- búsqueda por código, nombre o descripción;
- filtro por categoría;
- filtro por estado;
- filtro de existencias bajo mínimo;
- orden por nombre, precio o fecha;
- paginación;
- imagen opcional;
- selección de proveedores;
- código y slug únicos;
- validaciones de precio, existencias e imagen.

## Estrategia de eliminación

Entrega una matriz:

| Entidad | Acción | Motivo | Recuperable | Historial |
|---|---|---|---|---|
| Cliente | Desactivar | Puede tener operaciones futuras | Sí | Se conserva |
| Producto | Desactivar | Puede tener movimientos | Sí | Se conserva |
| Categoría sin productos | Eliminar | Catálogo no utilizado | No | No aplica |
| Categoría con productos | Proteger | Mantiene integridad | No se ejecuta | Se conserva |

Adapta la matriz a tus decisiones reales.

## Archivos

- `MEDIA_ROOT` y `MEDIA_URL`;
- Pillow instalado;
- formulario multipart;
- tamaño máximo documentado;
- extensiones permitidas;
- imagen predeterminada visual sin archivo falso;
- política de reemplazo;
- política de eliminación;
- ninguna carga ejecutable.

## Formsets

Utiliza un inline formset para documentos de cliente:

- prefijo estable;
- `management_form`;
- máximo cinco;
- eliminación controlada;
- transacción junto al cliente;
- errores visibles.

## Vistas

Utiliza al menos:

- una vista funcional de operación especial;
- una `ListView`;
- una `DetailView`;
- una `CreateView`;
- una `UpdateView`;
- una `DeleteView` donde eliminar sea válido.

Justifica cada elección. No es necesario implementar cada entidad dos veces.

## Arquitectura sugerida

```text
gestion_empresarial/
├── clientes/
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   ├── views.py
│   ├── templates/clientes/
│   └── tests/
├── inventario/
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   ├── views.py
│   ├── templates/inventario/
│   └── tests/
├── templates/
│   ├── base.html
│   └── components/
├── media/
├── documentacion/
│   ├── matriz_pruebas.md
│   ├── estrategia_eliminacion.md
│   ├── politica_archivos.md
│   ├── decisiones_vistas.md
│   └── uso_ia.md
└── README.md
```

Puedes conservar clientes dentro de una aplicación existente si la estructura sigue siendo clara. No dividas una aplicación únicamente para crear más carpetas.

## Estados obligatorios

Cada listado debe probar:

- datos disponibles;
- búsqueda sin coincidencias;
- filtro sin resultados;
- primera página;
- última página;
- registro inactivo;
- error controlado.

Cada formulario debe probar:

- GET inicial;
- POST válido;
- POST inválido;
- duplicado;
- límite;
- cancelación;
- reenvío;
- archivo válido e inválido, cuando corresponda.

## Evidencias

Incluye al menos:

1. listado de clientes en teléfono;
2. búsqueda combinada;
3. paginación con filtros;
4. detalle de cliente;
5. validaciones de cliente;
6. documentos;
7. listado de categorías;
8. categoría protegida;
9. listado de productos;
10. producto con imagen;
11. producto sin imagen;
12. validaciones de producto;
13. reemplazo de imagen;
14. confirmación de desactivación;
15. filtro de inactivos;
16. navegación con teclado;
17. mensajes;
18. historial de commits.

## Explicación técnica

Responde:

1. ¿Cuándo utilizaste `Form` y cuándo `ModelForm`?
2. ¿Qué campos excluiste y por qué?
3. ¿Qué reglas viven en formulario, modelo y base?
4. ¿Cómo funciona Post/Redirect/Get?
5. ¿Qué operaciones requieren POST?
6. ¿Por qué desactivas algunos registros?
7. ¿Cómo evitas ordenamientos no permitidos?
8. ¿Cómo conservas filtros al paginar?
9. ¿Cómo validas y reemplazas archivos?
10. ¿Qué garantiza `management_form`?
11. ¿Por qué elegiste funciones o clases en cada flujo?
12. ¿Qué corrigiste después de revisar código de IA?

## Fuera del alcance

No agregues todavía:

- registro público;
- roles completos;
- permisos por área;
- recuperación de contraseña;
- ventas;
- movimientos transaccionales de inventario;
- reportes;
- API;
- despliegue.

Estos temas pertenecen a los módulos siguientes.

---

# 40. Matriz mínima de pruebas

| Área | Caso | Resultado esperado |
|---|---|---|
| Cliente | Identificación duplicada | Error junto al campo |
| Cliente | Sin correo ni teléfono | Error comprensible |
| Cliente | Desactivar por GET | La operación no se ejecuta |
| Cliente | Desactivar por POST | Estado cambia y aparece mensaje |
| Categoría | Nombre duplicado | No se guarda |
| Categoría | Eliminar con productos | Se protege y se explica |
| Producto | Precio negativo | Se rechaza |
| Producto | Slug duplicado | Se rechaza |
| Producto | Proveedores múltiples | Se guardan las relaciones |
| Búsqueda | Término inexistente | Estado vacío |
| Orden | Valor no permitido | Se usa orden predeterminado |
| Paginación | Página fuera de rango | Respuesta controlada |
| Imagen | Archivo mayor al límite | Error de validación |
| Imagen | Reemplazo | Nueva imagen visible y anterior según política |
| Formset | Falta management form | Formset inválido |
| Formset | Más de cinco documentos | Se rechaza |
| PRG | Recargar detalle | No repite el POST |
| CSRF | Token ausente | Django rechaza la solicitud |

Agrega los casos particulares de tu implementación.

---

# 41. Rúbrica del proyecto del módulo

El proyecto principal aporta **50 puntos**.

| Criterio | Puntos | Evidencia |
|---|---:|---|
| CRUD de clientes | 6 | Flujos completos y desactivación segura |
| CRUD de categorías | 5 | Operaciones y eliminación protegida |
| CRUD de productos | 7 | Flujos, relaciones, estados e imagen |
| Formularios y campos expuestos | 5 | Forms/ModelForms claros y mínimos |
| Validaciones y duplicados | 6 | Reglas, mensajes y restricciones |
| Búsqueda, filtros, orden y paginación | 5 | Combinación estable y parámetros seguros |
| Archivos multimedia | 4 | Configuración, límites, reemplazo y política |
| Formset relacionado | 3 | Gestión coherente y transaccional |
| Seguridad del flujo | 3 | POST, CSRF, confirmaciones y PRG |
| Interfaz y accesibilidad | 3 | Responsive, errores, teclado y estados |
| Pruebas, Git, documentación e IA | 3 | Evidencia reproducible |
| **Total** | **50** | |

## Condiciones críticas

El proyecto no puede aprobarse si:

- una modificación sensible utiliza GET;
- falta CSRF;
- se exponen campos internos;
- un POST válido puede repetirse al recargar;
- una eliminación destruye historial sin justificación;
- se aceptan archivos sin límite;
- el CRUD produce errores técnicos visibles;
- no se pueden crear y editar clientes o productos;
- la paginación o los filtros no funcionan;
- el proyecto no inicia siguiendo el README;
- el estudiante no puede explicar código generado por IA.

---

# 42. Evaluación práctica

La evaluación aporta **15 puntos**.

## Parte 1. Formulario y validación — 5 puntos

Recibirás un modelo y un formulario defectuoso. Debes:

- limitar campos;
- normalizar un valor;
- validar dos campos relacionados;
- mostrar el error correctamente;
- demostrar un caso válido e inválido.

## Parte 2. CRUD y solicitud — 5 puntos

Debes corregir:

- una operación GET que modifica;
- falta de CSRF;
- ausencia de redirección;
- registro inexistente;
- mensaje incorrecto.

## Parte 3. Listado y archivo — 5 puntos

Debes:

- crear búsqueda y filtro;
- limitar orden;
- paginar;
- conservar parámetros;
- validar un archivo;
- explicar su política de reemplazo.

Duración recomendada: **50 minutos**.

---

# 43. Calificación y punto de entrega

| Actividad | Valor |
|---|---:|
| 12 ejercicios obligatorios | 15 puntos |
| Mini proyecto | 20 puntos |
| Proyecto del módulo | 50 puntos |
| Evaluación práctica | 15 puntos |
| **Total** | **100 puntos** |

Para aprobar:

- mínimo **80 puntos**;
- proyecto principal aprobado;
- todas las condiciones críticas corregidas.

Utiliza **un solo punto de entrega**.

## Nombre

```text
COA_DJANGO_M4_APELLIDO_NOMBRE
```

## Estructura

```text
COA_DJANGO_M4_APELLIDO_NOMBRE/
├── ejercicios/
├── mini_proyecto/
├── proyecto_modulo/
├── evaluacion_practica/
├── evidencias/
└── explicacion_tecnica.pdf
```

Archivo:

```text
COA_DJANGO_M4_APELLIDO_NOMBRE.zip
```

Incluye:

- proyecto o enlace de repositorio;
- migraciones;
- casos de prueba;
- evidencias CRUD;
- evidencias de validaciones;
- estrategia de eliminación;
- política de archivos;
- decisiones de vistas;
- registro de correcciones con IA;
- nombre y correo.

No incluyas:

- entorno virtual;
- credenciales;
- secretos;
- datos personales reales;
- cachés;
- archivos subidos innecesarios;
- una base de datos con información sensible.

[Entregar el Módulo 4](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 44. Errores comunes y soluciones

| Problema | Causa probable | Solución |
|---|---|---|
| Formulario siempre vacío | No se enviaron `request.POST` o la condición del método está mal | Revisa GET, POST y formulario enlazado |
| `cleaned_data` produce error | Se usó antes de `is_valid()` | Valida primero |
| Edición crea otro registro | Falta `instance=producto` | Vincula el formulario al objeto |
| Muchos a muchos no se guarda | Se utilizó `commit=False` sin `save_m2m()` | Guarda la instancia y luego la relación |
| Error 403 | Falta token CSRF | Agrega `{% csrf_token %}` y conserva la protección |
| Recargar repite el envío | La vista renderiza después del POST válido | Redirige |
| Imagen no llega | Falta `request.FILES` o multipart | Corrige vista y formulario HTML |
| `.url` produce error | El campo no contiene archivo | Comprueba `{% if objeto.archivo %}` |
| Archivo demasiado grande llega al almacenamiento | No existe validador del servidor | Agrega límite y pruébalo |
| Imagen anterior permanece | No existe política de reemplazo | Elimina después de confirmar y registra la decisión |
| Slug duplicado | No existe estrategia de unicidad | Agrega restricción y generación controlada |
| `NoReverseMatch` | Nombre o argumento de URL incorrecto | Revisa namespace, `name`, `pk` o `slug` |
| `ProtectedError` visible | Se intentó borrar una relación protegida | Captura el caso y explica por qué no se elimina |
| Filtro se pierde al paginar | Enlaces solo incluyen `page` | Conserva la cadena de consulta |
| Orden genera error | Parámetro no validado | Usa un diccionario permitido |
| Formset inválido | Falta `management_form` o prefijo inconsistente | Conserva ambos en GET y POST |
| Errores desaparecen | Se crea un formulario vacío después del POST inválido | Renderiza la instancia enlazada |
| Mensaje afirma éxito sin guardar | Se creó antes del resultado | Genera el mensaje después de la operación |
| Cliente duplicado por nombre | Se eligió un campo incorrecto como único | Revisa la regla empresarial |
| Operación pública modifica datos | Falta protección de acceso | Mantén el proyecto local y añade permisos en el Módulo 5 |

---

# 45. Consejos profesionales

- Escribe primero el flujo GET–POST–redirect.
- Expón únicamente los campos necesarios.
- Valida en el servidor.
- Utiliza restricciones para reglas de integridad.
- No uses GET para modificar.
- Confirma acciones sensibles.
- Prefiere desactivar cuando existe historial.
- Conserva mensajes claros.
- No muestres excepciones al usuario.
- Limita archivos antes de almacenarlos.
- Diferencia media de static.
- Prueba reemplazo y eliminación de archivos.
- Conserva filtros durante la paginación.
- Limita opciones recibidas para ordenar.
- No conviertas cada vista en una clase por obligación.
- Reutiliza templates sin ocultar el flujo.
- Usa transacciones cuando padre e hijos deben guardarse juntos.
- Prueba datos vacíos, límites, duplicados y operaciones repetidas.
- Crea commits por funcionalidad.
- Revisa el código de IA línea por línea.

---

# 46. Videos recomendados

Los videos complementan el módulo. Cuando una versión o interfaz difiera, utiliza Django 5.2 y consulta la documentación oficial.

## Formularios en Django

[Formularios en Django 4.1 — introducción práctica](https://www.youtube.com/watch?v=l-YAKHa34pQ)

Código para Principiantes

Canal pequeño en español. Utilízalo como inicio de la serie para observar el recorrido de un formulario.

## Form y ModelForm

[Introducción a Form y ModelForm](https://www.youtube.com/watch?v=s4zuc13x_Aw)

DesarrolloLibre

Refuerza la diferencia entre formularios independientes y formularios vinculados a modelos.

## Vistas genéricas de edición y eliminación

[UpdateView y DeleteView en Django](https://www.youtube.com/watch?v=vrc07eDgjyE)

Código para Principiantes

Estudia la estructura de las vistas genéricas y compárala con las vistas funcionales del laboratorio.

## CRUD, búsqueda, paginación e imágenes

[Aplicación Django con CRUD, búsqueda, paginación y subida de imágenes](https://www.youtube.com/watch?v=EQ-kqDmfUoM)

Todotic

El video integra varios contenidos del módulo. Utiliza los capítulos relevantes en lugar de copiar el proyecto completo.

## Carga de imágenes

[Subir imágenes en Django](https://www.youtube.com/watch?v=D94NBN4bO1g)

Moisés Sepúlveda

Refuerza la configuración de media y el formulario multipart. Verifica cualquier diferencia con Django 5.2.

## Forma de estudio

1. Selecciona el concepto.
2. Mira una sección breve.
3. Implementa una versión mínima.
4. Cambia nombres y reglas.
5. Prueba un caso inválido.
6. Consulta la documentación.
7. Integra solo lo comprendido.

---

# 47. Documentación oficial

## Formularios

- [Trabajar con formularios](https://docs.djangoproject.com/es/5.2/topics/forms/)
- [API de formularios](https://docs.djangoproject.com/es/5.2/ref/forms/api/)
- [Campos de formulario](https://docs.djangoproject.com/es/5.2/ref/forms/fields/)
- [Widgets](https://docs.djangoproject.com/es/5.2/ref/forms/widgets/)
- [ModelForm](https://docs.djangoproject.com/es/5.2/topics/forms/modelforms/)
- [Validación de formularios y campos](https://docs.djangoproject.com/es/5.2/ref/forms/validation/)
- [Validadores](https://docs.djangoproject.com/es/5.2/ref/validators/)

## Solicitudes y protección

- [Protección CSRF](https://docs.djangoproject.com/es/5.2/howto/csrf/)
- [Sistema de mensajes](https://docs.djangoproject.com/es/5.2/ref/contrib/messages/)
- [Atajos como `get_object_or_404`](https://docs.djangoproject.com/es/5.2/topics/http/shortcuts/)

## Vistas

- [Vistas genéricas de visualización](https://docs.djangoproject.com/es/5.2/topics/class-based-views/generic-display/)
- [Vistas genéricas de edición](https://docs.djangoproject.com/es/5.2/topics/class-based-views/generic-editing/)
- [Referencia de vistas genéricas](https://docs.djangoproject.com/es/5.2/ref/class-based-views/)
- [Decoradores de métodos HTTP](https://docs.djangoproject.com/es/5.2/topics/http/decorators/)

## Listados

- [Paginación](https://docs.djangoproject.com/es/5.2/topics/pagination/)
- [Consultas con `Q`](https://docs.djangoproject.com/es/5.2/topics/db/queries/)

## Archivos

- [Carga de archivos](https://docs.djangoproject.com/es/5.2/topics/http/file-uploads/)
- [Administración de archivos](https://docs.djangoproject.com/es/5.2/topics/files/)
- [Configuración de media](https://docs.djangoproject.com/es/5.2/howto/static-files/)
- [Contenido cargado por usuarios y seguridad](https://docs.djangoproject.com/es/5.2/topics/security/)

## Formsets

- [Formsets](https://docs.djangoproject.com/es/5.2/topics/forms/formsets/)
- [Model formsets e inline formsets](https://docs.djangoproject.com/es/5.2/topics/forms/modelforms/)

---

# 48. Material complementario

Este módulo puede acompañarse con cinco recursos breves:

1. **Mapa del ciclo de formulario**

```text
GET → mostrar
POST → enlazar → validar
                 ├── error → mostrar
                 └── éxito → guardar → mensaje → redirect
```

2. **Plantilla de matriz de validaciones**

| Regla | Entrada válida | Entrada inválida | Capa | Mensaje |
|---|---|---|---|---|

3. **Lista de comprobación de CRUD**
   - rutas;
   - métodos;
   - CSRF;
   - campos;
   - validación;
   - mensajes;
   - redirección;
   - confirmación;
   - estados.

4. **Plantilla de política de archivos**
   - propósito;
   - extensiones;
   - tamaño;
   - almacenamiento;
   - reemplazo;
   - eliminación;
   - respaldo;
   - acceso.

5. **Matriz de pruebas manuales**
   - precondición;
   - pasos;
   - datos;
   - resultado esperado;
   - resultado obtenido;
   - evidencia;
   - corrección.

Estos materiales pueden publicarse como páginas o reunirse en un PDF breve. No es necesario generar documentos que repitan toda la teoría.

---

# 49. Glosario

**Formulario:** estructura que recibe, convierte y valida datos.

**Formulario enlazado:** formulario creado con datos enviados.

**`cleaned_data`:** valores convertidos y validados.

**Widget:** representación HTML de un campo.

**Validador:** función que acepta o rechaza un valor.

**Error de campo:** problema asociado a un control específico.

**Error general:** problema relacionado con varios campos o con todo el formulario.

**CSRF:** ataque que intenta ejecutar una solicitud utilizando la sesión de otra persona.

**Token CSRF:** valor usado por Django para comprobar el origen esperado de un POST.

**Post/Redirect/Get:** patrón que redirige después de procesar un POST.

**CRUD:** crear, consultar, actualizar y eliminar.

**Vista funcional:** vista implementada como función.

**Vista basada en clase:** vista implementada mediante una clase.

**Vista genérica:** clase de Django para un patrón frecuente.

**Slug:** texto legible utilizado en una URL.

**Parámetro GET:** valor enviado dentro de la cadena de consulta.

**Lista permitida:** conjunto explícito de opciones aceptadas.

**Paginación:** división de resultados en páginas.

**Archivo estático:** recurso del código, como CSS.

**Archivo multimedia:** archivo cargado durante el uso.

**`MEDIA_ROOT`:** ubicación de archivos multimedia.

**`MEDIA_URL`:** prefijo URL para media.

**Multipart:** codificación necesaria para enviar archivos.

**Almacenamiento:** sistema responsable de guardar y recuperar archivos.

**Archivo huérfano:** archivo que permanece sin un registro que lo utilice.

**Formset:** conjunto de formularios semejantes.

**Inline formset:** conjunto de formularios de registros hijos relacionados con un padre.

**`management_form`:** campos internos que permiten administrar la cantidad de formularios de un formset.

**Desactivación:** cambio reversible que oculta un registro sin eliminar su historial.

---

# 50. Resumen del módulo

En este módulo transformaste modelos administrables en funciones utilizables desde la aplicación.

Aprendiste a:

- comprender solicitudes GET y POST;
- crear Forms y ModelForms;
- limitar campos editables;
- normalizar y validar;
- mostrar errores;
- proteger con CSRF;
- redirigir después de guardar;
- utilizar mensajes;
- crear CRUD con funciones y clases;
- trabajar con identificadores y slugs;
- confirmar operaciones;
- buscar, filtrar y ordenar;
- paginar;
- evitar duplicados;
- recibir y validar archivos;
- definir una política de reemplazo;
- administrar registros relacionados con formsets;
- reutilizar templates;
- probar casos reales;
- revisar código con IA.

El sistema ya puede administrar clientes, categorías y productos. En el siguiente módulo se protegerán estas capacidades mediante autenticación, roles y permisos, y se construirán operaciones empresariales transaccionales.

---

# 51. Lista de comprobación final

## Comprensión

- [ ] Distingo GET de POST.
- [ ] Puedo explicar Post/Redirect/Get.
- [ ] Distingo Form de ModelForm.
- [ ] Sé cuándo usar `clean_<campo>` y `clean()`.
- [ ] Comprendo la función de CSRF.
- [ ] Puedo elegir entre vista funcional y genérica.
- [ ] Sé por qué un orden recibido necesita lista permitida.
- [ ] Comprendo la diferencia entre static y media.
- [ ] Puedo explicar `management_form`.
- [ ] Puedo justificar eliminar o desactivar.

## Implementación

- [ ] Completé los doce ejercicios.
- [ ] Completé el mini proyecto.
- [ ] Completé el proyecto principal.
- [ ] Completé la evaluación práctica.
- [ ] Los formularios exponen solo campos necesarios.
- [ ] Los errores son comprensibles.
- [ ] Todos los cambios utilizan POST.
- [ ] Todos los POST incluyen CSRF.
- [ ] Los POST válidos redirigen.
- [ ] Búsqueda, filtros y orden se combinan.
- [ ] La paginación conserva parámetros.
- [ ] Los archivos tienen límites.
- [ ] El formset funciona.
- [ ] Los estados vacíos están diseñados.
- [ ] La interfaz funciona con teclado y teléfono.

## Entrega

- [ ] El README permite ejecutar el proyecto.
- [ ] Incluí migraciones.
- [ ] Incluí casos y evidencias.
- [ ] Documenté la estrategia de eliminación.
- [ ] Documenté la política de archivos.
- [ ] Justifiqué funciones y clases.
- [ ] Registré el uso de IA.
- [ ] No incluí datos sensibles.
- [ ] El ZIP tiene el nombre solicitado.
- [ ] Utilicé el único punto de entrega.

---

# 52. Finalización del módulo

El Módulo 4 se considera completado cuando:

- obtienes al menos 80 puntos;
- el proyecto principal es aprobado;
- corriges todas las condiciones críticas;
- los CRUD funcionan con datos válidos e inválidos;
- las operaciones sensibles son controladas;
- puedes explicar el flujo completo sin depender de IA.

Cuando recibas la aprobación, estarás preparado para implementar autenticación, permisos, roles y operaciones empresariales seguras.

**No avances al Módulo 5 hasta recibir la aprobación del proyecto.**
