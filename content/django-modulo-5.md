# Módulo 5. Autenticación, permisos y operaciones empresariales

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 7 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Tecnologías:** Django 5.2 LTS, SQLite, Django Auth y Django ORM  
**Mini proyecto:** Portal Privado por Roles  
**Proyecto del módulo:** Sistema Seguro de Ventas e Inventario

---

# Introducción

El sistema creado hasta ahora permite administrar clientes, categorías y productos. Sin embargo, una aplicación empresarial no puede permitir que todas las personas realicen todas las operaciones.

La pregunta deja de ser únicamente:

```text
¿Funciona el botón?
```

Ahora debes responder:

```text
¿Quién inició sesión?
¿Qué operación intenta realizar?
¿Tiene permiso?
¿Puede acceder a este registro específico?
¿La operación mantiene la base de datos consistente?
¿Queda evidencia de lo ocurrido?
```

En este módulo integrarás dos áreas inseparables:

```text
Control de acceso
├── autenticación
├── grupos
├── permisos
└── propiedad de registros

Operaciones empresariales
├── venta
├── detalles
├── existencias
├── movimientos
├── cancelación
└── auditoría
```

Registrar una venta no consiste en crear una fila:

```text
Venta
├── crear encabezado
├── crear detalles
├── comprobar existencias
├── descontar productos
├── registrar movimientos
└── calcular total
```

Si uno de esos pasos falla, ninguno debe quedar aplicado parcialmente. Para lograrlo utilizarás transacciones.

Este módulo no pretende formar a un especialista en ciberseguridad ni cubrir todos los riesgos de producción. Enseña las protecciones esenciales que una aplicación empresarial debe aplicar antes de considerarse utilizable.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- explicar autenticación y autorización;
- utilizar el modelo de usuario personalizado del proyecto;
- crear usuarios sin almacenar contraseñas en texto;
- implementar un registro controlado;
- utilizar inicio y cierre de sesión;
- configurar cambio y recuperación de contraseña;
- crear y editar un perfil;
- proteger vistas funcionales y basadas en clases;
- diseñar grupos y permisos;
- construir una matriz de acceso;
- aplicar roles de administrador, vendedor e inventario;
- comprender por qué ocultar un botón no protege una operación;
- validar permisos en el servidor;
- limitar consultas según propietario;
- responder con 403 cuando corresponda;
- aplicar el principio de mínimo privilegio;
- modelar ventas y detalles;
- ejecutar operaciones con `transaction.atomic()`;
- actualizar existencias mediante expresiones `F`;
- prevenir inventario negativo;
- registrar movimientos;
- cancelar ventas sin eliminar historial;
- registrar creador, fechas y responsables;
- reconocer riesgos de CSRF, XSS e inyección SQL;
- manejar contraseñas, datos sensibles y archivos con prudencia;
- utilizar IA para auditar permisos y generar pruebas negativas.

---

# Conocimientos previos

Antes de comenzar debes poder:

- utilizar el usuario personalizado configurado en el Módulo 3;
- crear modelos, relaciones y migraciones;
- consultar y actualizar con el ORM;
- utilizar `Q`, `F` y agregaciones;
- crear Forms, ModelForms y formsets;
- implementar CRUD;
- trabajar con CSRF y métodos HTTP;
- conservar historial mediante desactivación;
- utilizar Git.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Autenticación, registro y contraseñas | 55 minutos |
| Roles, grupos y permisos | 55 minutos |
| Propiedad de registros y respuestas 403 | 35 minutos |
| Ventas, transacciones e inventario | 1 hora y 25 minutos |
| Seguridad esencial y auditoría | 40 minutos |
| Laboratorio y ejercicios obligatorios | 50 minutos |
| Mini proyecto | 40 minutos |
| Proyecto del módulo | 1 hora |
| **Total estimado** | **7 horas** |

Las transacciones y los permisos deben comprenderse antes de continuar. Un error en estas áreas puede exponer datos o dejar el inventario inconsistente.

---

# 1. Autenticación y autorización

**Autenticación** responde:

```text
¿Quién eres?
```

**Autorización** responde:

```text
¿Qué puedes hacer?
```

Ejemplo:

```text
Ana inicia sesión correctamente        → autenticada
Ana intenta cancelar una venta         → requiere autorización
Ana no posee ese permiso               → respuesta 403
```

Iniciar sesión no concede automáticamente acceso a todo.

---

# 2. Sistema de autenticación de Django

Django incluye:

- modelo de usuario;
- almacenamiento seguro de contraseñas;
- sesiones;
- autenticación;
- grupos;
- permisos;
- vistas para login, logout y contraseñas;
- decoradores y mixins;
- integración con el admin.

El proyecto ya utiliza:

```python
AUTH_USER_MODEL = "cuentas.Usuario"
```

Obtén el modelo activo sin importarlo directamente:

```python
from django.contrib.auth import get_user_model


Usuario = get_user_model()
```

En relaciones:

```python
from django.conf import settings


usuario = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.PROTECT,
)
```

No cambies `AUTH_USER_MODEL` nuevamente.

---

# 3. Contraseñas

Django no guarda la contraseña original. Guarda una representación derivada mediante un algoritmo de hashing y datos auxiliares.

Nunca hagas:

```python
usuario.password = "Clave123"
usuario.save()
```

Utiliza:

```python
usuario.set_password("una-clave-segura")
usuario.save()
```

O:

```python
Usuario.objects.create_user(
    username="vendedor1",
    email="vendedor1@example.com",
    password="una-clave-segura",
)
```

Para comprobar:

```python
usuario.check_password("una-clave-segura")
```

No registres contraseñas en:

- código;
- repositorio;
- capturas;
- logs;
- datos de prueba compartidos;
- documentación;
- mensajes de error.

---

# 4. Registro controlado de usuarios

En un sistema empresarial, el registro suele ser interno o por invitación. Una persona no debe elegir “Administrador” desde un formulario público.

```python
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model


Usuario = get_user_model()


class RegistroUsuarioForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
        )

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()

        if Usuario.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                "Ya existe una cuenta asociada a este correo."
            )

        return email
```

El formulario:

- utiliza los validadores de contraseña configurados;
- confirma ambas contraseñas;
- no expone grupos;
- no expone permisos;
- no permite elegir `is_staff` o `is_superuser`.

La asignación de rol ocurre en un flujo administrativo autorizado.

---

# 5. Registro interno con rol controlado

```python
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Group
from django.contrib import messages
from django.shortcuts import redirect, render


@permission_required(
    "cuentas.add_usuario",
    raise_exception=True,
)
def usuario_crear(request):
    formulario = RegistroUsuarioForm(
        request.POST or None
    )

    if request.method == "POST" and formulario.is_valid():
        usuario = formulario.save()

        grupo = Group.objects.get(name="Vendedores")
        usuario.groups.add(grupo)

        messages.success(
            request,
            "La cuenta de vendedor fue creada.",
        )
        return redirect("cuentas:usuario_lista")

    return render(
        request,
        "cuentas/usuarios/formulario.html",
        {"form": formulario},
    )
```

Este ejemplo asigna un rol fijo. Si el formulario permite seleccionar un grupo, la lista también debe limitarse según los permisos del administrador.

---

# 6. Inicio de sesión

Puedes utilizar las vistas integradas:

```python
# urls.py principal
from django.urls import include, path


urlpatterns = [
    path(
        "cuentas/",
        include("django.contrib.auth.urls"),
    ),
]
```

Esto registra rutas como:

```text
cuentas/login/
cuentas/logout/
cuentas/password_change/
cuentas/password_reset/
```

Template esperado para login:

```text
templates/registration/login.html
```

```html
{% extends "base.html" %}

{% block title %}Iniciar sesión{% endblock %}

{% block content %}
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-12 col-md-7 col-lg-5">
            <h1>Iniciar sesión</h1>

            {% if form.errors %}
                <div class="alert alert-danger" role="alert">
                    No fue posible iniciar sesión con esos datos.
                </div>
            {% endif %}

            <form method="post" class="card card-body shadow-sm">
                {% csrf_token %}
                {{ form.as_p }}

                {% if next %}
                    <input type="hidden" name="next" value="{{ next }}">
                {% endif %}

                <button class="btn btn-primary" type="submit">
                    Iniciar sesión
                </button>
            </form>
        </div>
    </div>
</div>
{% endblock %}
```

Configuración:

```python
LOGIN_REDIRECT_URL = "/panel/"
LOGOUT_REDIRECT_URL = "/cuentas/login/"
```

Valida el parámetro `next` mediante las vistas integradas; no redirijas manualmente hacia cualquier URL recibida.

---

# 7. Cierre de sesión

Utiliza POST:

```html
{% if user.is_authenticated %}
    <form
        method="post"
        action="{% url 'logout' %}"
        class="d-inline"
    >
        {% csrf_token %}
        <button class="btn btn-link nav-link" type="submit">
            Cerrar sesión
        </button>
    </form>
{% endif %}
```

No coloques el cierre como un enlace GET. Cerrar la sesión modifica el estado y debe ser una acción intencional.

---

# 8. Cambio de contraseña

La ruta integrada utiliza:

```text
registration/password_change_form.html
registration/password_change_done.html
```

El cambio:

- requiere sesión;
- solicita contraseña actual;
- aplica validadores;
- actualiza la sesión correctamente mediante la vista integrada.

No crees un formulario que cambie directamente el campo `password`.

---

# 9. Recuperación de contraseña

Flujo:

```text
Solicitar recuperación
        ↓
mensaje enviado
        ↓
enlace con identificador y token
        ↓
definir nueva contraseña
        ↓
confirmación
```

Templates:

```text
registration/password_reset_form.html
registration/password_reset_done.html
registration/password_reset_email.html
registration/password_reset_subject.txt
registration/password_reset_confirm.html
registration/password_reset_complete.html
```

Durante desarrollo usa el backend de consola:

```python
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "no-responder@coa.local"
```

El correo aparecerá en la terminal. No necesitas credenciales reales.

La respuesta de recuperación no debe confirmar públicamente si un correo existe. Esto reduce la enumeración de cuentas.

---

# 10. Perfil de usuario

La autenticación y el perfil tienen responsabilidades diferentes.

```python
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="perfil",
    )
    telefono = models.CharField(max_length=25, blank=True)
    puesto = models.CharField(max_length=80, blank=True)
    fotografia = models.ImageField(
        upload_to="perfiles/%Y/%m/",
        blank=True,
    )

    def __str__(self):
        return f"Perfil de {self.usuario.username}"
```

No necesitas una señal para crearlo:

```python
perfil, _ = PerfilUsuario.objects.get_or_create(
    usuario=request.user
)
```

Un `ModelForm` del perfil no debe permitir cambiar:

- usuario;
- grupos;
- permisos;
- estado de personal;
- estado de superusuario.

---

# 11. Proteger vistas funcionales

## Requerir sesión

```python
from django.contrib.auth.decorators import login_required


@login_required
def panel(request):
    ...
```

## Requerir permiso

```python
from django.contrib.auth.decorators import permission_required


@permission_required(
    "inventario.change_producto",
    raise_exception=True,
)
def producto_editar(request, slug):
    ...
```

El formato es:

```text
app_label.codename
```

Ejemplos:

```text
inventario.view_producto
inventario.add_producto
inventario.change_producto
inventario.delete_producto
```

---

# 12. Proteger vistas basadas en clases

```python
from django.contrib.auth.mixins import (
    LoginRequiredMixin,
    PermissionRequiredMixin,
)


class ProductoUpdateView(
    LoginRequiredMixin,
    PermissionRequiredMixin,
    UpdateView,
):
    permission_required = "inventario.change_producto"
    raise_exception = True
```

Ordena primero los mixins de acceso y después la vista genérica.

Varios permisos:

```python
permission_required = (
    "inventario.view_producto",
    "inventario.change_producto",
)
```

Por defecto se requieren todos los permisos de la colección.

---

# 13. Grupos y permisos

Django crea normalmente cuatro permisos por modelo:

```text
add
change
delete
view
```

Un grupo reúne permisos:

```text
Grupo Vendedores
├── view_cliente
├── view_producto
├── add_venta
└── view_venta
```

Asignar:

```python
from django.contrib.auth.models import Group


grupo = Group.objects.get(name="Vendedores")
usuario.groups.add(grupo)
```

Comprobar:

```python
usuario.has_perm("ventas.add_venta")
```

Un usuario recibe permisos:

- directamente;
- por sus grupos;
- por su condición de superusuario.

Prefiere grupos para roles estables y evita administrar decenas de permisos individuales.

---

# 14. Permisos personalizados

En el modelo:

```python
class Venta(models.Model):
    # campos

    class Meta:
        permissions = [
            (
                "cancelar_venta",
                "Puede cancelar ventas confirmadas",
            ),
            (
                "ver_todas_las_ventas",
                "Puede consultar todas las ventas",
            ),
        ]
```

Después:

```bash
python manage.py makemigrations
python manage.py migrate
```

Los permisos se crean al aplicar migraciones.

No inventes un permiso para cada botón. Crea permisos que representen capacidades empresariales relevantes.

---

# 15. Matriz de roles

Diseña la matriz antes de configurar grupos:

| Operación | Administrador | Vendedor | Inventario |
|---|:---:|:---:|:---:|
| Ver panel | Sí | Sí | Sí |
| Ver clientes | Sí | Sí | No |
| Crear/editar clientes | Sí | Sí | No |
| Ver productos | Sí | Sí | Sí |
| Crear/editar productos | Sí | No | Sí |
| Registrar venta | Sí | Sí | No |
| Ver ventas propias | Sí | Sí | No |
| Ver todas las ventas | Sí | No | No |
| Cancelar venta | Sí | No | No |
| Ver movimientos | Sí | No | Sí |
| Administrar usuarios | Sí | No | No |

La matriz debe responder a requisitos reales. No concedas permisos “por si acaso”.

---

# 16. Crear grupos de forma reproducible

Un comando evita configurar roles manualmente en cada entorno:

```python
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand


ROLES = {
    "Administradores": [
        "cuentas.view_usuario",
        "cuentas.add_usuario",
        "cuentas.change_usuario",
        "cuentas.view_perfilusuario",
        "cuentas.change_perfilusuario",
        "inventario.view_producto",
        "inventario.add_producto",
        "inventario.change_producto",
        "inventario.view_cliente",
        "inventario.add_cliente",
        "inventario.change_cliente",
        "ventas.view_venta",
        "ventas.add_venta",
        "ventas.cancelar_venta",
        "ventas.ver_todas_las_ventas",
    ],
    "Vendedores": [
        "cuentas.view_perfilusuario",
        "cuentas.change_perfilusuario",
        "inventario.view_producto",
        "inventario.view_cliente",
        "inventario.add_cliente",
        "inventario.change_cliente",
        "ventas.view_venta",
        "ventas.add_venta",
    ],
    "Inventario": [
        "cuentas.view_perfilusuario",
        "cuentas.change_perfilusuario",
        "inventario.view_producto",
        "inventario.add_producto",
        "inventario.change_producto",
        "inventario.view_movimientoinventario",
    ],
}


class Command(BaseCommand):
    help = "Crea o actualiza los roles empresariales"

    def handle(self, *args, **options):
        for nombre, etiquetas in ROLES.items():
            grupo, _ = Group.objects.get_or_create(name=nombre)
            permisos = []

            for etiqueta in etiquetas:
                app_label, codename = etiqueta.split(".", 1)
                permiso = Permission.objects.get(
                    content_type__app_label=app_label,
                    codename=codename,
                )
                permisos.append(permiso)

            grupo.permissions.set(permisos)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Rol actualizado: {nombre}"
                )
            )
```

El comando debe verificar que encontró todos los permisos esperados. Si falta uno, no debe fingir que la configuración quedó completa.

---

# 17. Ocultar no significa proteger

En un template:

```html
{% if perms.ventas.add_venta %}
    <a class="btn btn-primary" href="{% url 'ventas:crear' %}">
        Registrar venta
    </a>
{% endif %}
```

Esto mejora la interfaz, pero no protege la URL.

Una persona puede escribir la dirección directamente o enviar una solicitud manual. La vista también debe comprobar:

```python
@permission_required("ventas.add_venta", raise_exception=True)
def venta_crear(request):
    ...
```

Regla:

```text
Template → muestra opciones apropiadas
Servidor  → decide si la operación está autorizada
```

---

# 18. Propiedad de registros

Un vendedor puede tener permiso para ver ventas, pero únicamente las que registró.

```python
class VentaListView(
    LoginRequiredMixin,
    PermissionRequiredMixin,
    ListView,
):
    model = Venta
    permission_required = "ventas.view_venta"
    raise_exception = True

    def get_queryset(self):
        queryset = (
            Venta.objects
            .select_related("cliente", "vendedor")
            .order_by("-creada_en")
        )

        if self.request.user.has_perm(
            "ventas.ver_todas_las_ventas"
        ):
            return queryset

        return queryset.filter(vendedor=self.request.user)
```

La restricción debe aplicarse al `QuerySet`, no solo al template.

Detalle protegido:

```python
def get_queryset(self):
    queryset = super().get_queryset()

    if self.request.user.has_perm(
        "ventas.ver_todas_las_ventas"
    ):
        return queryset

    return queryset.filter(vendedor=self.request.user)
```

Si intenta abrir otra venta, obtendrá 404. Esta respuesta evita confirmar que el registro existe. Para una operación reconocida pero no autorizada, puede utilizarse 403.

---

# 19. Permisos de objeto

El sistema básico de permisos de Django trabaja principalmente a nivel de modelo:

```text
Puede cambiar productos
Puede ver ventas
```

La propiedad añade una regla por registro:

```text
Puede ver esta venta porque la creó
```

Implementa esa regla con:

- `get_queryset`;
- una condición explícita;
- `UserPassesTestMixin`;
- una función de servicio;
- una solución especializada si el proyecto crece.

No asumas que `has_perm("ventas.view_venta")` limita automáticamente cada objeto.

---

# 20. Respuesta 403

`raise_exception=True` produce una respuesta 403 cuando existe sesión pero falta permiso.

Template:

```text
templates/403.html
```

```html
{% extends "base.html" %}

{% block title %}Acceso denegado{% endblock %}

{% block content %}
<main class="container py-5">
    <h1>No tienes permiso para realizar esta operación</h1>
    <p>
        Si consideras que necesitas acceso, comunícate con la
        persona responsable del sistema.
    </p>
    <a class="btn btn-primary" href="{% url 'panel' %}">
        Volver al panel
    </a>
</main>
{% endblock %}
```

No muestres:

- reglas internas;
- nombres de permisos sensibles;
- datos del objeto;
- trazas;
- detalles de seguridad.

---

# 21. Principio de mínimo privilegio

Cada usuario recibe únicamente lo necesario para su trabajo.

Ejemplo:

```text
Vendedor
✓ consultar productos
✓ administrar clientes
✓ registrar ventas
✓ ver ventas propias
✗ editar existencias directamente
✗ cancelar ventas
✗ administrar usuarios
```

Evita:

- convertir a todo el personal en superusuario;
- conceder permisos de eliminación sin necesidad;
- entregar permisos individuales sin documentar;
- compartir cuentas;
- utilizar una sola cuenta para todo el equipo.

Una cuenta representa a una persona o proceso identificable.

---

# 22. Modelar una venta

```python
import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Venta(models.Model):
    class Estado(models.TextChoices):
        BORRADOR = "BORRADOR", "Borrador"
        CONFIRMADA = "CONFIRMADA", "Confirmada"
        CANCELADA = "CANCELADA", "Cancelada"

    numero = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    cliente = models.ForeignKey(
        "inventario.Cliente",
        on_delete=models.PROTECT,
        related_name="ventas",
    )
    vendedor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="ventas_registradas",
    )
    estado = models.CharField(
        max_length=12,
        choices=Estado.choices,
        default=Estado.BORRADOR,
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
    )
    creada_en = models.DateTimeField(auto_now_add=True)
    actualizada_en = models.DateTimeField(auto_now=True)
    cancelada_en = models.DateTimeField(null=True, blank=True)
    cancelada_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="ventas_canceladas",
    )
    motivo_cancelacion = models.CharField(
        max_length=250,
        blank=True,
    )

    class Meta:
        ordering = ["-creada_en"]
        permissions = [
            (
                "cancelar_venta",
                "Puede cancelar ventas confirmadas",
            ),
            (
                "ver_todas_las_ventas",
                "Puede consultar todas las ventas",
            ),
        ]

    def __str__(self):
        return str(self.numero)
```

La referencia UUID evita depender de un número secuencial visible como identificador público. Si la empresa requiere numeración fiscal, necesita reglas específicas que no deben improvisarse.

---

# 23. Detalle de venta

```python
class DetalleVenta(models.Model):
    venta = models.ForeignKey(
        Venta,
        on_delete=models.CASCADE,
        related_name="detalles",
    )
    producto = models.ForeignKey(
        "inventario.Producto",
        on_delete=models.PROTECT,
        related_name="detalles_venta",
    )
    cantidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["venta", "producto"],
                name="venta_producto_no_repetido",
            ),
            models.CheckConstraint(
                condition=models.Q(cantidad__gt=0),
                name="detalle_cantidad_positiva",
            ),
            models.CheckConstraint(
                condition=models.Q(precio_unitario__gte=0),
                name="detalle_precio_no_negativo",
            ),
        ]

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.venta} - {self.producto}"
```

`precio_unitario` conserva el precio de la venta. No debes calcular una venta histórica usando el precio actual del producto.

---

# 24. Relacionar movimientos con ventas

Agrega una referencia opcional:

```python
class MovimientoInventario(models.Model):
    # campos existentes

    venta = models.ForeignKey(
        "ventas.Venta",
        on_delete=models.PROTECT,
        related_name="movimientos",
        null=True,
        blank=True,
    )
```

El movimiento conserva:

- producto;
- tipo;
- cantidad;
- motivo;
- usuario;
- fecha;
- venta relacionada.

No reemplaces el historial con el valor actual de existencias. Ambos responden preguntas distintas:

```text
Producto.existencias → ¿cuánto hay ahora?
Movimientos          → ¿por qué cambió?
```

---

# 25. Qué es una transacción

Una transacción agrupa operaciones:

```text
Todas se confirman
o
Todas se revierten
```

Sin transacción:

```text
✓ venta creada
✓ primer detalle creado
✗ segundo producto sin stock
? venta parcial
? inventario parcialmente descontado
```

Con transacción:

```text
falla cualquier paso
        ↓
rollback completo
        ↓
no queda venta parcial
```

Django utiliza autocommit normalmente: cada consulta se confirma por separado, salvo que exista una transacción activa.

---

# 26. `transaction.atomic()`

Como decorador:

```python
from django.db import transaction


@transaction.atomic
def operacion():
    ...
```

Como bloque:

```python
with transaction.atomic():
    ...
```

Mantén la transacción corta. No realices dentro:

- envío de correo lento;
- llamadas a APIs;
- generación pesada de reportes;
- espera de entrada humana.

Para acciones posteriores:

```python
transaction.on_commit(
    lambda: notificar_venta(venta.pk)
)
```

La notificación se programa únicamente después de confirmar.

---

# 27. Formset de líneas de venta

```python
from django import forms
from django.forms import BaseFormSet, formset_factory

from inventario.models import Cliente, Producto


class VentaForm(forms.Form):
    cliente = forms.ModelChoiceField(
        queryset=Cliente.objects.filter(activo=True),
        label="Cliente",
    )


class LineaVentaForm(forms.Form):
    producto = forms.ModelChoiceField(
        queryset=Producto.objects.filter(activo=True),
        label="Producto",
    )
    cantidad = forms.IntegerField(
        min_value=1,
        max_value=9999,
        label="Cantidad",
    )


class BaseLineaVentaFormSet(BaseFormSet):
    def clean(self):
        super().clean()

        if any(self.errors):
            return

        productos = set()

        for formulario in self.forms:
            if not formulario.cleaned_data:
                continue

            producto = formulario.cleaned_data.get("producto")

            if producto in productos:
                raise forms.ValidationError(
                    "No repitas un producto. Ajusta su cantidad."
                )

            productos.add(producto)


LineaVentaFormSet = formset_factory(
    LineaVentaForm,
    formset=BaseLineaVentaFormSet,
    extra=3,
    min_num=1,
    validate_min=True,
    max_num=20,
    validate_max=True,
)
```

El formset valida la entrada. El servicio vuelve a proteger las reglas críticas.

---

# 28. Servicio para registrar una venta

```python
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import F

from inventario.models import (
    Cliente,
    MovimientoInventario,
    Producto,
)
from .models import DetalleVenta, Venta


@transaction.atomic
def registrar_venta(*, cliente, vendedor, lineas):
    if not lineas:
        raise ValidationError("La venta necesita productos.")

    try:
        cliente = Cliente.objects.get(
            pk=cliente.pk,
            activo=True,
        )
    except Cliente.DoesNotExist as error:
        raise ValidationError(
            "El cliente ya no está disponible."
        ) from error

    venta = Venta.objects.create(
        cliente=cliente,
        vendedor=vendedor,
        estado=Venta.Estado.BORRADOR,
    )

    total = Decimal("0.00")
    productos_utilizados = set()

    for linea in lineas:
        producto_id = linea["producto"].pk
        cantidad = linea["cantidad"]

        if not isinstance(cantidad, int) or cantidad <= 0:
            raise ValidationError(
                "Todas las cantidades deben ser positivas."
            )

        if producto_id in productos_utilizados:
            raise ValidationError(
                "Un producto aparece más de una vez."
            )
        productos_utilizados.add(producto_id)

        try:
            producto = (
                Producto.objects
                .select_for_update()
                .get(pk=producto_id, activo=True)
            )
        except Producto.DoesNotExist as error:
            raise ValidationError(
                "Uno de los productos ya no está disponible."
            ) from error

        actualizados = Producto.objects.filter(
            pk=producto.pk,
            activo=True,
            existencias__gte=cantidad,
        ).update(
            existencias=F("existencias") - cantidad
        )

        if actualizados != 1:
            raise ValidationError(
                f"No hay existencias suficientes de {producto.nombre}."
            )

        DetalleVenta.objects.create(
            venta=venta,
            producto=producto,
            cantidad=cantidad,
            precio_unitario=producto.precio,
        )

        MovimientoInventario.objects.create(
            producto=producto,
            tipo=MovimientoInventario.Tipo.SALIDA,
            cantidad=cantidad,
            motivo=f"Venta {venta.numero}",
            registrado_por=vendedor,
            venta=venta,
        )

        total += producto.precio * cantidad

    venta.total = total
    venta.estado = Venta.Estado.CONFIRMADA
    venta.save(
        update_fields=[
            "total",
            "estado",
            "actualizada_en",
        ]
    )

    return venta
```

La actualización condicional:

```python
existencias__gte=cantidad
```

impide descontar si no existe stock suficiente en el momento de actualizar.

---

# 29. Concurrencia y SQLite

`select_for_update()` bloquea filas compatibles en motores como PostgreSQL. SQLite no ofrece el mismo bloqueo por fila y `select_for_update()` no aporta esa garantía.

Por eso el servicio también utiliza una actualización condicional y comprueba cuántas filas fueron afectadas:

```python
actualizados = Producto.objects.filter(
    pk=producto.pk,
    existencias__gte=cantidad,
).update(
    existencias=F("existencias") - cantidad
)

if actualizados != 1:
    raise ValidationError("Existencias insuficientes.")
```

La transacción mantiene la operación como unidad, pero SQLite tiene limitaciones de concurrencia. Antes de desplegar un sistema con muchas ventas simultáneas, utiliza un motor adecuado, prueba condiciones de carrera y revisa el nivel de aislamiento.

---

# 30. Vista para registrar la venta

```python
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.core.exceptions import ValidationError
from django.shortcuts import redirect, render


@permission_required(
    "ventas.add_venta",
    raise_exception=True,
)
def venta_crear(request):
    venta_form = VentaForm(request.POST or None)
    lineas_formset = LineaVentaFormSet(
        request.POST or None,
        prefix="lineas",
    )

    if (
        request.method == "POST"
        and venta_form.is_valid()
        and lineas_formset.is_valid()
    ):
        lineas = [
            formulario.cleaned_data
            for formulario in lineas_formset.forms
            if formulario.cleaned_data
        ]

        try:
            venta = registrar_venta(
                cliente=venta_form.cleaned_data["cliente"],
                vendedor=request.user,
                lineas=lineas,
            )
        except ValidationError as error:
            venta_form.add_error(
                None,
                " ".join(error.messages),
            )
        else:
            messages.success(
                request,
                "La venta se registró correctamente.",
            )
            return redirect("ventas:detalle", pk=venta.pk)

    return render(
        request,
        "ventas/formulario.html",
        {
            "form": venta_form,
            "lineas": lineas_formset,
        },
    )
```

Captura la excepción fuera del bloque `atomic` del servicio. No ocultes una excepción de base de datos dentro de una transacción rota.

---

# 31. Template del formset de venta

```html
<form method="post" class="card card-body shadow-sm">
    {% csrf_token %}
    {{ lineas.management_form }}

    {% if form.non_field_errors %}
        <div class="alert alert-danger" role="alert">
            {{ form.non_field_errors }}
        </div>
    {% endif %}

    {{ form.as_p }}

    <fieldset>
        <legend class="h4">Productos</legend>

        {% for linea in lineas %}
            <div class="row g-3 border-bottom py-3">
                <div class="col-12 col-md-8">
                    {{ linea.producto.label_tag }}
                    {{ linea.producto }}
                    {{ linea.producto.errors }}
                </div>
                <div class="col-12 col-md-4">
                    {{ linea.cantidad.label_tag }}
                    {{ linea.cantidad }}
                    {{ linea.cantidad.errors }}
                </div>
            </div>
        {% endfor %}

        {{ lineas.non_form_errors }}
    </fieldset>

    <button class="btn btn-primary mt-4" type="submit">
        Confirmar venta
    </button>
</form>
```

El precio mostrado en la interfaz es informativo. El servicio vuelve a consultar el producto y toma el precio del servidor.

No confíes en un total calculado en JavaScript o enviado por un campo oculto.

---

# 32. Cancelación controlada

Una venta confirmada no debe eliminarse. La cancelación:

- cambia el estado;
- devuelve existencias;
- registra movimientos inversos;
- conserva detalles;
- registra responsable, fecha y motivo;
- impide una segunda cancelación.

```python
from django.utils import timezone


@transaction.atomic
def cancelar_venta(*, venta_id, usuario, motivo):
    motivo = motivo.strip()

    if len(motivo) < 10:
        raise ValidationError(
            "Explica el motivo con al menos 10 caracteres."
        )

    venta = (
        Venta.objects
        .select_for_update()
        .prefetch_related("detalles__producto")
        .get(pk=venta_id)
    )

    ahora = timezone.now()

    actualizadas = Venta.objects.filter(
        pk=venta.pk,
        estado=Venta.Estado.CONFIRMADA,
    ).update(
        estado=Venta.Estado.CANCELADA,
        cancelada_en=ahora,
        cancelada_por=usuario,
        motivo_cancelacion=motivo,
        actualizada_en=ahora,
    )

    if actualizadas != 1:
        raise ValidationError(
            "La venta ya no puede cancelarse."
        )

    for detalle in venta.detalles.all():
        Producto.objects.filter(
            pk=detalle.producto_id
        ).update(
            existencias=F("existencias") + detalle.cantidad
        )

        MovimientoInventario.objects.create(
            producto_id=detalle.producto_id,
            tipo=MovimientoInventario.Tipo.ENTRADA,
            cantidad=detalle.cantidad,
            motivo=f"Cancelación de venta {venta.numero}",
            registrado_por=usuario,
            venta=venta,
        )

    venta.refresh_from_db()
    return venta
```

El filtro por estado impide aplicar la devolución dos veces.

---

# 33. Formulario y vista de cancelación

```python
class CancelarVentaForm(forms.Form):
    motivo = forms.CharField(
        min_length=10,
        max_length=250,
        widget=forms.Textarea(attrs={"rows": 4}),
        help_text="Explica por qué se cancela la operación.",
    )
```

```python
@permission_required(
    "ventas.cancelar_venta",
    raise_exception=True,
)
def venta_cancelar(request, pk):
    venta = get_object_or_404(Venta, pk=pk)
    formulario = CancelarVentaForm(request.POST or None)

    if request.method == "POST" and formulario.is_valid():
        try:
            cancelar_venta(
                venta_id=venta.pk,
                usuario=request.user,
                motivo=formulario.cleaned_data["motivo"],
            )
        except ValidationError as error:
            formulario.add_error(
                None,
                " ".join(error.messages),
            )
        else:
            messages.success(
                request,
                "La venta fue cancelada y el inventario se restauró.",
            )
            return redirect("ventas:detalle", pk=venta.pk)

    return render(
        request,
        "ventas/confirmar_cancelacion.html",
        {"form": formulario, "venta": venta},
    )
```

La página de confirmación puede mostrarse mediante GET, pero la cancelación solo se ejecuta con POST, CSRF y permiso. El template no sustituye ninguna de esas barreras.

---

# 34. Auditoría básica

Para operaciones importantes registra:

- quién creó;
- cuándo creó;
- cuándo modificó;
- quién canceló;
- cuándo canceló;
- motivo;
- movimientos relacionados.

Ejemplo reutilizable:

```python
class AuditoriaModel(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_creados",
    )

    class Meta:
        abstract = True
```

No agregues una clase abstracta si complica migraciones existentes sin beneficio. Puede aplicarse a modelos nuevos o introducirse mediante un plan.

La auditoría básica no reemplaza un sistema de trazabilidad inmutable para industrias reguladas.

---

# 35. Panel personalizado por rol

La misma ruta puede preparar datos diferentes:

```python
@login_required
def panel(request):
    contexto = {}

    if request.user.has_perm("ventas.add_venta"):
        contexto["ventas_propias_hoy"] = Venta.objects.filter(
            vendedor=request.user,
            creada_en__date=timezone.localdate(),
        ).count()

    if request.user.has_perm(
        "inventario.view_movimientoinventario"
    ):
        contexto["productos_bajo_minimo"] = Producto.objects.filter(
            activo=True,
            existencias__lte=F("stock_minimo"),
        ).count()

    if request.user.has_perm(
        "ventas.ver_todas_las_ventas"
    ):
        contexto["ventas_totales_hoy"] = Venta.objects.filter(
            creada_en__date=timezone.localdate(),
            estado=Venta.Estado.CONFIRMADA,
        ).count()

    return render(request, "panel/inicio.html", contexto)
```

El template puede mostrar tarjetas según permisos. No construyas el panel comprobando únicamente el nombre del grupo si lo que realmente importa es la capacidad.

---

# 36. CSRF

CSRF protege solicitudes que dependen de la sesión del navegador.

Mantén:

- `{% csrf_token %}` en POST;
- middleware de CSRF;
- métodos apropiados;
- cookies seguras en producción;
- orígenes confiables configurados correctamente.

No uses `csrf_exempt` para corregir un formulario normal.

CSRF no autoriza una operación. Un token válido no significa que la persona tenga permiso.

---

# 37. XSS

XSS ocurre cuando contenido no confiable se interpreta como código en el navegador.

Django escapa variables de templates de forma predeterminada:

```html
{{ cliente.nombre }}
```

Evita:

```html
{{ comentario|safe }}
```

con contenido de usuario.

También debes:

- evitar construir HTML con datos no confiables;
- validar URLs;
- revisar JavaScript que inserta contenido;
- no permitir archivos HTML activos sin una política;
- aplicar una política de seguridad de contenido cuando el proyecto lo requiera.

Escapar datos no reemplaza la autorización.

---

# 38. Inyección SQL

El ORM parametriza valores:

```python
Producto.objects.filter(nombre__icontains=termino)
```

No construyas SQL concatenando entrada:

```python
# Evitar
sql = f"SELECT * FROM producto WHERE nombre = '{termino}'"
```

Si una consulta SQL manual es imprescindible, utiliza parámetros:

```python
Producto.objects.raw(
    "SELECT * FROM inventario_producto WHERE nombre = %s",
    [termino],
)
```

Los nombres de columnas no se parametrizan igual que los valores. Por eso el ordenamiento utiliza una lista permitida.

---

# 39. Sesiones, cookies y HTTPS

Durante producción:

```python
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
```

Estas opciones requieren HTTPS correctamente configurado. Se aplicarán y comprobarán en el Módulo 6.

Además:

- no almacenes información sensible innecesaria en sesión;
- cierra sesiones en equipos compartidos;
- rota claves comprometidas;
- define una duración apropiada;
- no confíes en ocultar cookies desde la interfaz;
- utiliza `HttpOnly` y `SameSite` según la configuración segura de Django.

No actives redirección HTTPS en desarrollo sin comprender el entorno, porque puede impedir el acceso local.

---

# 40. Datos sensibles y registros

Clasifica antes de almacenar:

```text
Público
Interno
Confidencial
Restringido
```

No registres en logs:

- contraseñas;
- tokens;
- cookies;
- documentos completos;
- números financieros completos;
- datos personales innecesarios.

Principios:

- recopila lo mínimo;
- limita acceso;
- define retención;
- protege respaldos;
- permite corrección;
- elimina según una política;
- cumple la normativa aplicable.

Este curso no sustituye asesoría legal.

---

# 41. Archivos cargados

Aplica las reglas del Módulo 4:

- límite de tamaño;
- tipos permitidos;
- validación del contenido esperado;
- nombres controlados;
- almacenamiento no ejecutable;
- política de reemplazo;
- política de eliminación.

Además, los permisos deben proteger la descarga de documentos privados. Una URL difícil de adivinar no es autorización.

Para archivos privados, una vista debe:

1. autenticar;
2. comprobar permiso y propiedad;
3. localizar el archivo;
4. devolverlo con encabezados adecuados;
5. registrar el acceso si corresponde.

Servir archivos privados directamente desde una carpeta pública evita esas comprobaciones.

---

# 42. Inteligencia Artificial para revisar seguridad

La IA ayuda a formular preguntas. No certifica que una aplicación sea segura.

## Matriz de permisos

```text
Te daré roles, operaciones y reglas de propiedad.
Crea una matriz de acceso.

Para cada permiso:
- identifica recurso y acción;
- indica si es global o por propietario;
- propone prueba permitida y denegada;
- señala ambigüedades.

No concedas permisos por conveniencia.
```

## Auditoría de rutas

```text
Revisa estas URLs y vistas de Django 5.2.
Para cada ruta indica:
- método HTTP;
- autenticación;
- permiso;
- propiedad;
- CSRF;
- respuesta si se deniega;
- cambio de estado.

No asumas que ocultar un enlace protege la vista.
```

## Revisión transaccional

```text
Analiza esta operación de venta.
Enumera todas las escrituras y los puntos de fallo.
Comprueba atomicidad, inventario negativo, duplicados,
concurrencia, cancelación y auditoría.
No propongas signals para ocultar la lógica principal.
```

## Pruebas negativas

```text
Genera pruebas negativas para tres roles:
administrador, vendedor e inventario.
Incluye acceso directo por URL, POST manual, objeto ajeno,
doble envío, stock insuficiente y doble cancelación.
No marques ninguna prueba como aprobada sin ejecutarla.
```

## Validación obligatoria

Pregunta:

1. ¿La comprobación ocurre en el servidor?
2. ¿Se valida el objeto específico?
3. ¿La operación utiliza POST?
4. ¿Existe CSRF?
5. ¿La transacción cubre todas las escrituras?
6. ¿Se usa precio del servidor?
7. ¿Puede quedar inventario negativo?
8. ¿Puede repetirse una cancelación?
9. ¿Se conserva historial?
10. ¿SQLite limita la concurrencia?
11. ¿Se filtran datos por propietario?
12. ¿La respuesta revela información?
13. ¿Se registran secretos?
14. ¿Comprendes la solución?

Documenta falsos positivos, omisiones y cambios.

---

# 43. Laboratorio guiado: asegurar el sistema y registrar ventas

## Paso 1. Crear una rama

```bash
git add .
git commit -m "chore: cerrar crud del modulo 4"
git switch -c modulo-5-seguridad-ventas
```

## Paso 2. Crear la aplicación de ventas

```bash
python manage.py startapp ventas
```

Regístrala y crea:

- `Venta`;
- `DetalleVenta`;
- relación entre movimiento y venta;
- permisos personalizados;
- migraciones.

```bash
python manage.py makemigrations
python manage.py migrate --plan
python manage.py migrate
python manage.py check
```

## Paso 3. Configurar autenticación

Incluye las URLs integradas y crea todos los templates de:

- login;
- logout por POST;
- cambio de contraseña;
- recuperación;
- confirmaciones.

Configura el backend de correo de consola y prueba el flujo completo con una cuenta ficticia.

## Paso 4. Crear perfiles

Agrega `PerfilUsuario` y su formulario. Permite editar:

- teléfono;
- puesto;
- fotografía.

No permitas editar rol ni privilegios.

## Paso 5. Crear roles

Implementa el comando de roles. Ejecuta:

```bash
python manage.py configurar_roles
```

Crea tres usuarios de demostración:

```text
admin_demo
vendedor_demo
inventario_demo
```

Asigna cada grupo. No guardes sus contraseñas en el repositorio; entrega credenciales temporales al instructor por el canal autorizado.

## Paso 6. Construir la matriz

Para cada ruta registra:

| Ruta | Método | Sesión | Permiso | Propiedad | Denegación |
|---|---|---|---|---|---|
| Venta nueva | GET/POST | Sí | `add_venta` | No aplica | 403 |
| Venta propia | GET | Sí | `view_venta` | Vendedor | 404 |
| Cancelar | GET/POST | Sí | `cancelar_venta` | No aplica | 403 |

No avances hasta que todas las rutas sensibles tengan una decisión.

## Paso 7. Proteger el CRUD existente

Protege:

- crear y editar clientes;
- crear y editar productos;
- desactivar y reactivar;
- eliminar categorías;
- documentos privados.

Comprueba tanto:

- interfaz;
- acceso directo a URL.

## Paso 8. Crear el panel

Administrador:

- ventas del día;
- ventas totales;
- productos bajo mínimo;
- accesos a usuarios, ventas e inventario.

Vendedor:

- ventas propias;
- acceso a clientes;
- botón de nueva venta;
- sin administración de productos.

Inventario:

- productos;
- bajo mínimo;
- movimientos;
- sin clientes ni ventas.

## Paso 9. Crear el formulario de venta

Incluye:

- cliente;
- entre una y veinte líneas;
- producto;
- cantidad;
- errores de producto repetido;
- CSRF;
- confirmación visible.

El precio y el total finales se calculan en el servidor.

## Paso 10. Implementar el servicio

El servicio debe:

1. validar líneas;
2. crear venta;
3. bloquear o volver a consultar productos;
4. descontar mediante actualización condicional;
5. crear detalles;
6. crear movimientos;
7. calcular total;
8. confirmar venta;
9. devolver el objeto.

Todo dentro de una transacción.

## Paso 11. Probar rollback

En una rama de prueba:

1. prepara una venta con dos productos;
2. provoca una excepción después del primer detalle;
3. ejecuta la operación;
4. comprueba que no quedaron venta, detalle, movimiento ni descuento;
5. elimina la excepción;
6. registra la evidencia.

No dejes código que provoca fallos en la entrega.

## Paso 12. Implementar cancelación

Solo el administrador puede:

- abrir confirmación;
- escribir motivo;
- cancelar por POST;
- devolver existencias;
- crear movimientos inversos;
- registrar responsable y fecha.

Prueba una segunda cancelación y confirma que se rechaza.

## Paso 13. Probar propiedad

Crea dos vendedores y ventas de ambos.

- cada vendedor ve las propias;
- ninguno ve la venta ajena;
- el administrador ve todas;
- inventario no ve ventas.

## Paso 14. Revisar seguridad

Comprueba:

- CSRF;
- autoescape;
- consultas ORM;
- archivos privados;
- contraseñas;
- logs;
- datos de demostración;
- respuestas 403 y 404;
- rutas POST;
- permisos del servidor.

## Paso 15. Registrar commits

```text
feat: integrar autenticacion y perfiles
feat: crear grupos y permisos empresariales
feat: proteger crud por permisos
feat: limitar ventas por propietario
feat: implementar modelos de ventas
feat: registrar ventas de forma atomica
feat: agregar cancelacion y movimientos inversos
fix: impedir inventario negativo y doble cancelacion
docs: crear matriz de permisos y pruebas negativas
```

---

# 44. Ejercicios obligatorios

Completa los doce ejercicios. Incluye código, evidencia permitida, evidencia denegada y explicación.

## Ejercicio 1. Autenticación frente a autorización

Analiza diez acciones de un sistema de clínica:

- abrir login;
- iniciar sesión;
- ver pacientes;
- editar un paciente;
- ver una cita propia;
- ver todas las citas;
- cancelar;
- administrar usuarios;
- cambiar contraseña;
- descargar un documento.

Para cada acción indica:

- si requiere autenticación;
- permiso;
- propiedad;
- método HTTP;
- respuesta si se deniega.

## Ejercicio 2. Flujo completo de cuenta

Implementa y prueba:

- login válido;
- login inválido;
- conservación de `next`;
- logout por POST;
- cambio de contraseña;
- recuperación mediante consola;
- token inválido.

No reveles en capturas contraseñas ni tokens completos.

## Ejercicio 3. Registro sin escalamiento

Crea un formulario interno para registrar vendedores.

Demuestra que:

- usa `UserCreationForm`;
- aplica validadores;
- no expone privilegios;
- asigna un grupo controlado;
- requiere permiso administrativo;
- un vendedor no puede acceder a la ruta.

## Ejercicio 4. Roles reproducibles

Crea grupos para clínica:

- Administradores;
- Recepción;
- Personal médico.

Implementa un comando idempotente con permisos calificados por aplicación. Ejecútalo dos veces y confirma que no duplica grupos.

## Ejercicio 5. Decoradores y mixins

Protege:

- dos vistas funcionales;
- dos vistas genéricas;
- una operación con permiso personalizado.

Prueba usuario anónimo, usuario autenticado sin permiso y usuario autorizado.

## Ejercicio 6. Propiedad de registros

Crea solicitudes de soporte asignadas a usuarios.

Reglas:

- agente ve solicitudes asignadas;
- supervisor ve todas;
- otro agente no puede abrir una ajena;
- el filtro se aplica al `QuerySet`;
- el template no recibe objetos prohibidos.

## Ejercicio 7. Ocultar frente a impedir

Oculta un botón de edición según permisos. Después escribe manualmente la URL con un usuario no autorizado.

Entrega:

- evidencia del botón oculto;
- evidencia de 403;
- código de template;
- código de servidor;
- explicación de por qué ambos son necesarios.

## Ejercicio 8. Rollback

Crea una operación que:

1. crea una cabecera;
2. crea un detalle;
3. modifica existencias;
4. provoca una excepción.

Ejecuta sin `atomic` en una base de prueba y registra el estado parcial. Limpia los datos. Ejecuta con `atomic` y demuestra rollback.

Nunca realices esta prueba sobre datos importantes.

## Ejercicio 9. Venta y stock insuficiente

Implementa una venta de dos productos. El segundo no tiene existencias.

Comprueba:

- venta no creada;
- primer producto sin descuento;
- sin detalles;
- sin movimientos;
- mensaje comprensible;
- precio tomado del servidor.

## Ejercicio 10. Cancelación idempotente

Cancela una venta confirmada y comprueba:

- estado;
- stock restaurado;
- movimientos inversos;
- responsable;
- motivo;
- fecha.

Intenta cancelar otra vez. No debe aumentar el inventario nuevamente.

## Ejercicio 11. Auditoría de seguridad

Revisa un proyecto con:

1. contraseña en texto;
2. rol elegido públicamente;
3. botón oculto sin permiso del servidor;
4. eliminación por GET;
5. `safe` sobre comentarios;
6. SQL concatenado;
7. documento privado en media pública;
8. token en log;
9. total enviado por campo oculto;
10. venta sin transacción.

Clasifica riesgo, impacto, corrección y prueba.

## Ejercicio 12. Pruebas negativas por rol

Construye una matriz de al menos 18 casos:

- seis por administrador;
- seis por vendedor;
- seis por inventario.

Incluye:

- ruta permitida;
- ruta denegada;
- POST manual;
- objeto ajeno;
- stock insuficiente;
- doble cancelación.

Ejecuta cada prueba y registra el resultado real.

---

# 45. Retos adicionales

1. **Contraseña temporal:** crea un flujo administrativo que obligue a cambiarla sin almacenarla.
2. **Permiso por sucursal:** limita datos por pertenencia a una sucursal.
3. **Descarga privada:** crea una vista autorizada para documentos.
4. **Número empresarial:** diseña una numeración de venta separada del UUID.
5. **Alerta posconfirmación:** usa `transaction.on_commit()`.
6. **Simulación concurrente:** documenta cómo probarías dos ventas simultáneas en PostgreSQL.
7. **Auditoría adicional:** registra dirección IP solo si existe una necesidad y política legítima.

---

# 46. Mini proyecto: Portal Privado por Roles

## Contexto

Una empresa necesita un portal interno con secciones diferentes para administración, personal operativo y usuarios generales.

## Objetivo

Construir un sistema de acceso basado en capacidades, con pruebas permitidas y denegadas.

## Roles

- Administrador;
- Empleado;
- Usuario general.

## Secciones

- panel común;
- directorio interno;
- tareas;
- reportes administrativos;
- gestión de usuarios;
- perfil personal.

## Reglas mínimas

- todos requieren sesión;
- usuario general ve perfil y tareas propias;
- empleado ve directorio y tareas asignadas;
- administrador ve reportes y usuarios;
- solo administrador crea cuentas;
- nadie elige su rol;
- cada persona edita únicamente su perfil;
- logout utiliza POST;
- acceso denegado muestra 403;
- objetos ajenos no aparecen.

## Requisitos

- usuario personalizado existente;
- login;
- cambio y recuperación de contraseña;
- perfiles;
- tres grupos;
- mínimo ocho permisos;
- comando de configuración;
- matriz;
- decoradores y mixins;
- filtrado por propietario;
- navegación según permisos;
- validación en servidor;
- pruebas negativas.

## Evidencias

- panel de cada rol;
- navegación de cada rol;
- acceso permitido;
- 403;
- objeto ajeno no encontrado;
- creación administrativa;
- recuperación en consola;
- logout POST;
- matriz ejecutada.

## Criterios

| Criterio | Puntos |
|---|---:|
| Autenticación y contraseñas | 4 |
| Roles y permisos | 5 |
| Propiedad de registros | 4 |
| Protección de rutas | 3 |
| Interfaz y respuestas | 2 |
| Pruebas y documentación | 2 |
| **Total** | **20** |

---


<!-- coa-activity:django-m5-mini-proyecto -->

# 47. Proyecto del módulo: Sistema Seguro de Ventas e Inventario

## Situación profesional

La empresa ya administra clientes y productos. Ahora necesita vender sin permitir inventario negativo, conservar historial y limitar cada operación según el puesto.

## Objetivo

Convertir el gestor empresarial en un sistema privado con roles y un proceso transaccional de ventas.

## Funciones obligatorias

```text
Sistema seguro
├── cuentas y perfiles
├── login, logout y contraseñas
├── grupos y permisos
├── panel por capacidad
├── clientes y productos protegidos
├── ventas
│   ├── registro
│   ├── detalle
│   ├── listado propio o global
│   └── cancelación
├── inventario
│   ├── descuento
│   ├── devolución
│   └── historial
└── auditoría
```

## Matriz mínima

### Administrador

- administrar cuentas;
- consultar y modificar clientes;
- consultar y modificar productos;
- registrar ventas;
- ver todas;
- cancelar;
- consultar movimientos.

### Vendedor

- consultar productos;
- administrar clientes;
- registrar ventas;
- ver propias;
- no cancelar;
- no editar stock;
- no administrar usuarios.

### Inventario

- administrar productos;
- consultar movimientos;
- ver bajo mínimo;
- no administrar clientes;
- no registrar ni ver ventas;
- no administrar usuarios.

## Requisitos de autenticación

- login integrado;
- logout por POST;
- cambio de contraseña;
- recuperación con backend de consola;
- perfil editable;
- formulario de usuario sin privilegios expuestos;
- credenciales fuera del repositorio.

## Requisitos de autorización

- comando reproducible de roles;
- permisos estándar;
- `cancelar_venta`;
- `ver_todas_las_ventas`;
- decoradores o mixins;
- propiedad de ventas;
- 403;
- 404 para objeto ajeno cuando corresponda;
- servidor y template protegidos.

## Requisitos de ventas

- cliente activo;
- una a veinte líneas;
- producto activo;
- producto no repetido;
- cantidad positiva;
- precio del servidor;
- detalle como fotografía del precio;
- total calculado en servidor;
- estado confirmado;
- servicio separado de la vista;
- transacción atómica.

## Requisitos de inventario

- actualización condicional;
- expresiones `F`;
- comprobación de filas afectadas;
- sin stock negativo;
- movimiento por línea;
- venta relacionada;
- responsable y fecha;
- limitación de SQLite documentada.

## Requisitos de cancelación

- permiso personalizado;
- confirmación;
- POST;
- motivo;
- venta confirmada;
- un único cambio de estado;
- devolución exacta;
- movimientos inversos;
- responsable y fecha;
- sin eliminación.

## Auditoría

Registra:

- vendedor;
- creación;
- modificación;
- cancelador;
- cancelación;
- motivo;
- movimientos;
- referencia de venta.

No registres contraseñas, tokens ni documentos sensibles.

## Arquitectura esperada

```text
gestion_empresarial/
├── cuentas/
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   ├── views.py
│   └── management/commands/configurar_roles.py
├── ventas/
│   ├── forms.py
│   ├── models.py
│   ├── services.py
│   ├── urls.py
│   ├── views.py
│   └── templates/ventas/
├── inventario/
├── templates/
│   ├── registration/
│   ├── 403.html
│   └── panel/
└── documentacion/
    ├── matriz_permisos.md
    ├── pruebas_negativas.md
    ├── transaccion_venta.md
    ├── riesgos_seguridad.md
    └── uso_ia.md
```

## Pruebas de venta

- venta válida;
- producto inactivo;
- cliente inactivo;
- cantidad cero;
- producto repetido;
- stock exacto;
- stock insuficiente;
- error después del primer detalle;
- doble envío;
- vendedor autorizado;
- inventario denegado.

## Pruebas de cancelación

- administrador autorizado;
- vendedor denegado;
- inventario denegado;
- venta confirmada;
- venta ya cancelada;
- motivo corto;
- stock restaurado;
- movimientos creados;
- segunda solicitud rechazada.

## Evidencias

Incluye:

1. login;
2. panel de cada rol;
3. matriz;
4. usuario administrativo creando vendedor;
5. 403 de vendedor;
6. venta propia;
7. venta ajena oculta;
8. formulario de venta;
9. venta confirmada;
10. detalles y total;
11. existencias antes y después;
12. movimientos;
13. rechazo por stock;
14. evidencia de rollback;
15. cancelación;
16. stock restaurado;
17. doble cancelación rechazada;
18. recuperación en consola;
19. historial de commits;
20. revisión con IA.

## Explicación técnica

Responde:

1. ¿Qué diferencia autenticación de autorización?
2. ¿Por qué los roles se configuran fuera del registro?
3. ¿Qué protege cada permiso?
4. ¿Cómo limitas ventas por propietario?
5. ¿Por qué ocultar un botón es insuficiente?
6. ¿Qué consultas contiene la transacción?
7. ¿Qué provoca rollback?
8. ¿Cómo impides inventario negativo?
9. ¿Qué limitación presenta SQLite?
10. ¿Por qué conservas precio unitario?
11. ¿Cómo impides doble cancelación?
12. ¿Qué datos de auditoría conservas?
13. ¿Qué riesgos esenciales revisaste?
14. ¿Qué propuesta de IA rechazaste?

## Fuera del alcance

No agregues todavía:

- pagos en línea;
- facturación fiscal;
- API;
- múltiples monedas;
- impuestos complejos;
- múltiples almacenes;
- auditoría regulatoria;
- despliegue;
- permisos externos especializados.

No conviertas un proyecto educativo en un sistema fiscal sin requisitos legales y pruebas profesionales.

---

# 48. Matriz mínima de pruebas

| Área | Caso | Resultado esperado |
|---|---|---|
| Login | Credenciales válidas | Crea sesión y redirige |
| Login | Datos inválidos | Mensaje genérico |
| Logout | GET | No ejecuta cierre |
| Logout | POST | Cierra sesión |
| Usuario | Vendedor crea administrador | 403 |
| Producto | Vendedor intenta editar | 403 |
| Venta | Vendedor registra | Permitido |
| Venta | Inventario registra | 403 |
| Propiedad | Vendedor abre venta ajena | 404 o denegación definida |
| Stock | Cantidad exacta | Confirma y deja cero |
| Stock | Cantidad superior | Rollback |
| Total | Campo alterado en navegador | Se ignora y recalcula |
| Venta | Producto repetido | Formset inválido |
| Transacción | Falla segundo detalle | Sin cambios parciales |
| Cancelación | Administrador confirma | Restaura y audita |
| Cancelación | Vendedor intenta | 403 |
| Cancelación | Segundo intento | Sin nueva devolución |
| XSS | Texto con etiqueta script | Se muestra escapado |
| SQL | Término con caracteres especiales | ORM lo trata como dato |
| Recuperación | Correo inexistente | Respuesta no revela cuenta |

---

# 49. Rúbrica del proyecto

El proyecto principal aporta **50 puntos**.

| Criterio | Puntos | Evidencia |
|---|---:|---|
| Autenticación y contraseñas | 5 | Flujos integrados y seguros |
| Roles, grupos y permisos | 7 | Matriz y configuración reproducible |
| Protección en servidor | 5 | Decoradores, mixins, POST y CSRF |
| Propiedad de registros | 4 | Consultas limitadas y pruebas |
| Modelos de ventas | 4 | Encabezado, detalles, historial y restricciones |
| Servicio transaccional | 8 | Atomicidad, rollback y separación |
| Integridad de inventario | 6 | Actualización condicional, F y movimientos |
| Cancelación controlada | 4 | Estado, devolución, motivo y responsable |
| Seguridad y auditoría | 3 | Riesgos revisados y datos apropiados |
| Interfaz por rol | 2 | Paneles, 403 y navegación |
| Pruebas, Git, documentación e IA | 2 | Evidencia verificable |
| **Total** | **50** | |

## Condiciones críticas

El proyecto no puede aprobarse si:

- se almacenan contraseñas en texto;
- un usuario elige privilegios públicamente;
- una operación sensible carece de permiso del servidor;
- se modifica mediante GET;
- la venta no es atómica;
- puede existir inventario negativo;
- el total depende del navegador;
- se puede cancelar dos veces;
- se elimina historial de ventas;
- un vendedor ve ventas ajenas;
- se incluyen secretos o datos reales;
- el estudiante no explica el código de IA.

---

# 50. Evaluación práctica

La evaluación aporta **15 puntos**.

## Parte 1. Acceso — 5 puntos

Debes:

- completar una matriz;
- proteger una función y una clase;
- filtrar por propietario;
- demostrar acceso permitido y denegado.

## Parte 2. Transacción — 5 puntos

Debes corregir una operación que:

- crea cabecera;
- descuenta sin validar;
- toma precio del navegador;
- falla parcialmente.

Implementa `atomic`, `F`, filtro condicional y rollback.

## Parte 3. Seguridad — 5 puntos

Identifica y corrige:

- eliminación GET;
- salida con `safe`;
- SQL concatenado;
- contraseña mal guardada;
- documento privado público.

Duración recomendada: **55 minutos**.

---

# 51. Calificación y punto de entrega

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
- condiciones críticas corregidas.

Utiliza **un solo punto de entrega**.

## Nombre

```text
COA_DJANGO_M5_APELLIDO_NOMBRE
```

## Estructura

```text
COA_DJANGO_M5_APELLIDO_NOMBRE/
├── ejercicios/
├── mini_proyecto/
├── proyecto_modulo/
├── evaluacion_practica/
├── evidencias/
└── explicacion_tecnica.pdf
```

Comprime:

```text
COA_DJANGO_M5_APELLIDO_NOMBRE.zip
```

Incluye:

- código o repositorio;
- migraciones;
- comando de roles;
- matriz de permisos;
- usuarios de demostración sin contraseñas en el repositorio;
- pruebas permitidas y denegadas;
- venta válida y rechazada;
- rollback;
- cancelación;
- auditoría;
- revisión de seguridad;
- registro de IA.

Las credenciales temporales se entregan únicamente mediante el canal autorizado por COA.

[Entregar el Módulo 5](https://forms.gle/nTx97JRkFkbH5Vfr6)

---


<!-- coa-activity:django-m5-proyecto -->

# 52. Errores comunes y soluciones

| Problema | Causa | Solución |
|---|---|---|
| Contraseña no funciona | Se asignó directamente a `password` | Usa `set_password` o `create_user` |
| Login redirige a ruta inexistente | `LOGIN_REDIRECT_URL` incorrecta | Configura una URL válida |
| Logout por enlace falla | La vista espera POST | Utiliza formulario con CSRF |
| Recuperación no envía correo real | Backend de consola | Revisa la terminal; es correcto en desarrollo |
| Usuario elige rol | Grupo expuesto en registro | Retíralo y asigna desde flujo autorizado |
| Botón oculto pero URL accesible | Solo existe condición de template | Protege la vista |
| Usuario autenticado recibe 302 | Falta permiso y no se usa 403 | Configura `raise_exception=True` según el caso |
| Vendedor ve ventas ajenas | QuerySet no filtra propietario | Limita en lista y detalle |
| Grupo no recibe permiso | Permiso aún no creado o etiqueta incorrecta | Aplica migraciones y usa aplicación + codename |
| Superusuario ignora pruebas | Tiene todos los permisos | Prueba también usuarios normales |
| Venta queda parcial | Escrituras fuera de `atomic` | Mueve la operación completa al servicio |
| Stock queda negativo | Se restó después de leer sin condición | Usa filtro `existencias__gte` y comprueba filas |
| Precio fue alterado | Se aceptó dato del navegador | Obtén precio desde el producto |
| `F()` queda en la instancia | No se recargó | Usa `refresh_from_db()` cuando necesites el valor |
| Segunda cancelación devuelve stock | No se comprobó el estado al actualizar | Actualización condicional por `CONFIRMADA` |
| Error de base oculto dentro de atomic | Excepción capturada demasiado pronto | Captura fuera del bloque |
| Movimiento no coincide | Se actualizó stock sin registrar historial | Incluye ambas escrituras en la transacción |
| `select_for_update` no bloquea en SQLite | Limitación del motor | Usa actualización condicional y documenta el límite |
| 403 revela detalles | Template demasiado técnico | Muestra mensaje general |
| XSS | Se usó `safe` con datos no confiables | Conserva autoescape |
| SQL injection | Se concatenó entrada | Utiliza ORM o parámetros |
| Archivo privado es público | Se sirve directamente desde media | Autoriza mediante vista y almacenamiento apropiado |

---

# 53. Consejos profesionales

- Diseña permisos antes de crear botones.
- Concede capacidades mediante grupos.
- Prueba con usuarios normales, no solo superusuario.
- Protege el `QuerySet`.
- Usa 404 para objetos que no deben revelarse.
- Usa 403 para operaciones conocidas pero denegadas.
- Mantén las contraseñas fuera del código.
- No permitas elegir roles privilegiados.
- Realiza cambios de estado con POST.
- Conserva CSRF.
- Calcula precios y totales en el servidor.
- Mantén servicios transaccionales independientes de la interfaz.
- No captures errores de base dentro de un bloque roto.
- Mantén transacciones cortas.
- Usa `on_commit` para efectos externos.
- Conserva ventas y movimientos.
- Cancela mediante estado y operación inversa.
- Documenta limitaciones de SQLite.
- Ejecuta pruebas negativas.
- No trates una respuesta de IA como auditoría de seguridad.

---

# 54. Videos recomendados

Los videos son recursos complementarios. Utiliza la documentación de Django 5.2 como referencia definitiva.

## Login y logout

[Login y Logout en Django desde cero](https://www.youtube.com/watch?v=4cYEcvYkHpg)

LaOtraEscuelita

Video reciente en español de un canal pequeño. Refuerza las vistas integradas, las URLs y los templates.

## Autenticación completa

[Autenticación en Django](https://www.youtube.com/watch?v=FN7cKzNshJY)

luisjoseprofesor

Canal pequeño. Repasa creación de usuarios, login, logout y protección de secciones.

## Permisos y `PermissionRequiredMixin`

[Permisos de usuario y PermissionRequiredMixin](https://www.youtube.com/watch?v=cqCs-YYYCP0)

Neunapp

Refuerza la protección de vistas basadas en clases. Comprueba nombres y comportamiento con Django 5.2.

## Usuarios, permisos y grupos

[Django: usuarios, permisos y grupos](https://www.youtube.com/watch?v=uBu-FhFUbUw)

Ider Delzo

Video de un canal pequeño centrado en la configuración de grupos y permisos.

## Recurso audiovisual adicional

[Administración de grupos de permisos en Django Admin](https://learn.microsoft.com/es-es/shows/beginners-series-to-django/managing-permission-groups-in-the-django-admin-site-15-of-24--beginners-series-to-django) — Microsoft Learn

Recurso gratuito en español que muestra la administración de grupos desde el panel.

## Forma de estudio

1. Selecciona un flujo.
2. Observa la explicación.
3. Reprodúcelo con un usuario normal.
4. Intenta acceder sin permiso.
5. Comprueba el servidor.
6. Consulta la documentación.
7. Registra lo aprendido.

Las transacciones se estudian principalmente con documentación y experimentos controlados, porque los videos encontrados en español no sustituyen una explicación correcta de concurrencia y rollback.

---

# 55. Documentación oficial

## Autenticación

- [Sistema de autenticación de Django](https://docs.djangoproject.com/es/5.2/topics/auth/)
- [Uso de autenticación](https://docs.djangoproject.com/es/5.2/topics/auth/default/)
- [Personalización del usuario](https://docs.djangoproject.com/es/5.2/topics/auth/customizing/)
- [Administración de contraseñas](https://docs.djangoproject.com/es/5.2/topics/auth/passwords/)
- [Validación de contraseñas](https://docs.djangoproject.com/es/5.2/topics/auth/passwords/#password-validation)
- [Sesiones](https://docs.djangoproject.com/es/5.2/topics/http/sessions/)

## Permisos

- [Permisos y autorización](https://docs.djangoproject.com/es/5.2/topics/auth/default/#permissions-and-authorization)
- [Decorador `permission_required`](https://docs.djangoproject.com/es/5.2/topics/auth/default/#the-permission-required-decorator)
- [Mixins de acceso](https://docs.djangoproject.com/es/5.2/topics/auth/default/#the-permissionrequiredmixin-mixin)

## Transacciones y ORM

- [Transacciones de base de datos](https://docs.djangoproject.com/es/5.2/topics/db/transactions/)
- [Expresiones `F`](https://docs.djangoproject.com/es/5.2/ref/models/expressions/)
- [`select_for_update`](https://docs.djangoproject.com/es/5.2/ref/models/querysets/#select-for-update)
- [Consultas SQL directas seguras](https://docs.djangoproject.com/es/5.2/topics/db/sql/)

## Seguridad

- [Seguridad en Django](https://docs.djangoproject.com/es/5.2/topics/security/)
- [Protección CSRF](https://docs.djangoproject.com/es/5.2/howto/csrf/)
- [Configuración de seguridad](https://docs.djangoproject.com/es/5.2/ref/settings/#security)
- [Archivos cargados](https://docs.djangoproject.com/es/5.2/topics/http/file-uploads/)
- [Checklist de despliegue](https://docs.djangoproject.com/es/5.2/howto/deployment/checklist/)

---

# 56. Material complementario

El módulo puede acompañarse con:

1. **Plantilla de matriz de permisos**

| Rol | Recurso | Acción | Global/propio | Método | Denegación |
|---|---|---|---|---|---|

2. **Mapa de autenticación**

```text
registro controlado
→ login
→ sesión
→ permiso
→ objeto
→ operación
→ auditoría
```

3. **Checklist transaccional**
   - escrituras identificadas;
   - bloque atómico;
   - fallo intermedio;
   - rollback;
   - concurrencia;
   - efectos externos;
   - cancelación;
   - auditoría.

4. **Plantilla de pruebas negativas**

| Usuario | Precondición | Solicitud | Resultado esperado | Resultado |
|---|---|---|---|---|

5. **Diagrama de venta**

```text
Venta 1 ── N Detalles N ── 1 Producto
  │                         │
  └──────── N Movimientos ──┘
```

6. **Checklist de seguridad esencial**
   - contraseñas;
   - permisos;
   - propiedad;
   - métodos;
   - CSRF;
   - XSS;
   - SQL;
   - archivos;
   - secretos;
   - logs.

Estos documentos pueden publicarse juntos como una guía breve. No es necesario duplicar la teoría en varios PDFs.

---

# 57. Glosario

**Autenticación:** comprobación de identidad.

**Autorización:** decisión sobre una operación.

**Sesión:** estado asociado a un usuario entre solicitudes.

**Hash de contraseña:** representación no reversible utilizada para verificar una contraseña.

**Grupo:** conjunto de permisos asignable a usuarios.

**Permiso:** capacidad para realizar una acción.

**Rol:** conjunto empresarial de responsabilidades, representado normalmente con un grupo.

**Propiedad:** relación entre un registro y el usuario que puede accederlo.

**Mínimo privilegio:** concesión exclusiva del acceso necesario.

**403:** respuesta de acceso prohibido.

**404:** respuesta de recurso no encontrado.

**Escalamiento de privilegios:** obtención de capacidades no autorizadas.

**Transacción:** conjunto de operaciones confirmadas o revertidas como unidad.

**Atomicidad:** propiedad de aplicar todo o nada.

**Commit:** confirmación de una transacción.

**Rollback:** reversión de una transacción.

**Autocommit:** confirmación automática de consultas individuales.

**Bloqueo:** mecanismo para coordinar accesos concurrentes.

**Condición de carrera:** resultado dependiente del orden de operaciones simultáneas.

**`select_for_update`:** consulta que solicita bloqueo de filas en motores compatibles.

**Actualización condicional:** cambio que solo ocurre si el registro todavía cumple una condición.

**Auditoría:** evidencia sobre responsable, momento y operación.

**CSRF:** solicitud forjada que aprovecha una sesión.

**XSS:** ejecución de contenido no confiable en el navegador.

**Inyección SQL:** alteración de una consulta mediante entrada no parametrizada.

**Token:** valor temporal utilizado para comprobar un flujo.

**Dato sensible:** información que necesita protección adicional.

**Prueba negativa:** comprobación de que una operación inválida o no autorizada se rechaza.

**Idempotencia:** propiedad que evita efectos adicionales indebidos al repetir una operación.

---

# 58. Resumen del módulo

En este módulo protegiste la aplicación y construiste su primera operación empresarial crítica.

Aprendiste a:

- autenticar;
- gestionar contraseñas;
- crear perfiles;
- organizar grupos;
- asignar permisos;
- proteger funciones y clases;
- limitar objetos por propietario;
- diferenciar interfaz y seguridad;
- aplicar mínimo privilegio;
- modelar ventas;
- guardar precios históricos;
- utilizar transacciones;
- prevenir stock negativo;
- registrar movimientos;
- cancelar sin borrar;
- auditar responsables;
- reconocer CSRF, XSS e inyección SQL;
- proteger datos y archivos;
- revisar riesgos con IA.

El sistema ya realiza una venta como unidad coherente y conserva evidencia de cada cambio de inventario.

---

# 59. Lista de comprobación final

## Comprensión

- [ ] Distingo autenticación de autorización.
- [ ] Comprendo cómo se guardan contraseñas.
- [ ] Puedo explicar grupos y permisos.
- [ ] Sé por qué ocultar no protege.
- [ ] Puedo limitar registros por propietario.
- [ ] Distingo 403 y 404.
- [ ] Comprendo atomicidad y rollback.
- [ ] Puedo explicar la actualización condicional.
- [ ] Comprendo la limitación de SQLite.
- [ ] Puedo explicar la cancelación.
- [ ] Reconozco CSRF, XSS e inyección SQL.

## Implementación

- [ ] Completé los doce ejercicios.
- [ ] Completé el mini proyecto.
- [ ] Completé el proyecto principal.
- [ ] Completé la evaluación.
- [ ] Login y logout funcionan.
- [ ] Cambio y recuperación funcionan.
- [ ] Los perfiles no exponen privilegios.
- [ ] Los roles se crean por comando.
- [ ] Las rutas están protegidas.
- [ ] Las ventas se filtran por propietario.
- [ ] El panel cambia por capacidades.
- [ ] La venta es atómica.
- [ ] El stock no queda negativo.
- [ ] El total se calcula en servidor.
- [ ] Los movimientos se registran.
- [ ] La cancelación es única.
- [ ] Ejecuté pruebas negativas.

## Entrega

- [ ] Incluí la matriz.
- [ ] Incluí usuarios de demostración.
- [ ] Las contraseñas no están en el repositorio.
- [ ] Incluí evidencias permitidas y denegadas.
- [ ] Documenté rollback.
- [ ] Documenté SQLite.
- [ ] Documenté seguridad.
- [ ] Registré uso de IA.
- [ ] No incluí datos reales.
- [ ] El ZIP tiene el nombre correcto.
- [ ] Utilicé el único punto de entrega.

---

# 60. Finalización del módulo

El Módulo 5 se considera completado cuando:

- obtienes mínimo 80 puntos;
- el proyecto principal es aprobado;
- corriges todas las condiciones críticas;
- cada rol puede realizar únicamente sus tareas;
- una venta incorrecta no deja cambios parciales;
- el inventario y el historial permanecen coherentes;
- puedes explicar cada protección sin depender de IA.

Cuando recibas la aprobación, estarás preparado para reorganizar la arquitectura, crear pruebas automatizadas, generar reportes y desplegar el proyecto final.

**No avances al Módulo 6 hasta recibir la aprobación del proyecto.**
