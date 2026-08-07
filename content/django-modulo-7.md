# Módulo 7. Proyecto Final Integrador

**Curso:** Desarrollo de Aplicaciones Web Profesionales con Django  
**Duración estimada:** 10 horas  
**Modalidad:** Autodidacta  
**Nivel:** Avanzado  
**Proyecto final:** COA Gestión Empresarial Web  
**Resultado:** Aplicación de portafolio y preparación para el Programa de Experiencia Profesional COA

---

# Introducción

Has llegado al último módulo del curso y al cierre de toda la Ruta Python de COA.

En esta etapa no aprenderás otro framework ni agregarás funciones sin propósito. Utilizarás todo lo construido para entregar un producto coherente, probado, documentado y desplegado.

```text
Lógica de Programación
        ↓
Python Nivel 1
        ↓
Python Intermedio
        ↓
Python Práctico
        ↓
Desarrollo de Software con Python
        ↓
SQL y Bases de Datos
        ↓
Desarrollo de Aplicaciones Web Profesionales con Django
        ↓
COA Gestión Empresarial Web
```

El proyecto final debe responder cinco preguntas:

```text
¿Resuelve un problema empresarial definido?
¿Mantiene datos correctos?
¿Protege cada operación según el rol?
¿Puede instalarse, probarse y desplegarse?
¿Puedes explicar y modificar el código?
```

Una gran cantidad de pantallas no compensa una regla incorrecta. Un diseño atractivo no compensa una autorización rota. Una aplicación publicada no compensa un repositorio con secretos.

El objetivo es demostrar dominio, no aparentar complejidad.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- analizar una necesidad empresarial;
- convertir necesidades en requisitos verificables;
- definir alcance y prioridades;
- diseñar un modelo relacional coherente;
- conectar requisitos, reglas, código y pruebas;
- desarrollar un sistema empresarial web completo;
- aplicar arquitectura MVT y separación por responsabilidades;
- implementar autenticación, perfiles, grupos y permisos;
- construir CRUD con validaciones;
- ejecutar operaciones transaccionales;
- mantener un historial confiable de inventario;
- crear paneles y reportes;
- exportar CSV y Excel;
- probar procesos críticos y accesos;
- configurar un entorno seguro;
- desplegar con PostgreSQL;
- documentar instalación y uso;
- preparar datos y usuarios de demostración;
- presentar el proyecto como evidencia de portafolio;
- defender la autoría del código;
- implementar una solicitud de cambio controlada;
- documentar el uso profesional de IA;
- reconocer limitaciones y próximos pasos.

---

# Conocimientos previos

Antes de comenzar debes tener aprobados los seis módulos anteriores y disponer de la versión candidata del sistema.

Debes poder:

- trabajar con Git y GitHub;
- crear y organizar aplicaciones Django;
- diseñar modelos y migraciones;
- utilizar Forms, ModelForms y formsets;
- implementar autenticación y permisos;
- construir servicios y selectores;
- utilizar transacciones;
- optimizar consultas del ORM;
- escribir pruebas automáticas;
- generar reportes;
- configurar PostgreSQL;
- desplegar una aplicación;
- proteger variables y secretos.

Este módulo no está diseñado para comenzar el sistema desde cero. Si tu versión del Módulo 6 todavía tiene observaciones críticas, corrígelas antes de continuar.

---

# Competencias finales

## Análisis

Podrás comprender un proceso empresarial, identificar actores, reglas, datos y excepciones.

## Desarrollo

Podrás transformar requisitos en una aplicación Django funcional y organizada.

## Datos

Podrás diseñar relaciones, conservar integridad y consultar información útil para la empresa.

## Calidad

Podrás comprobar procesos críticos mediante pruebas, revisión de seguridad y criterios de aceptación.

## Entrega profesional

Podrás publicar, documentar, demostrar y modificar una aplicación frente a una revisión técnica.

## Trabajo asistido por IA

Podrás utilizar IA para acelerar tareas sin entregar código que no comprendes ni exponer información sensible.

---

# Resultado obligatorio

Construirás **COA Gestión Empresarial Web**, un sistema para administrar las operaciones principales de una pequeña empresa comercial.

El sistema integrará:

```text
Usuarios y permisos
        ↓
Clientes y proveedores
        ↓
Productos e inventario
        ↓
Ventas transaccionales
        ↓
Panel e indicadores
        ↓
Reportes y exportaciones
        ↓
Administración, pruebas y despliegue
```

Puedes adaptar el nombre comercial, los colores y los datos ficticios. No puedes eliminar módulos funcionales obligatorios ni reemplazar el dominio empresarial por otro proyecto sin autorización.

---

# Distribución recomendada del tiempo

| Fase | Tiempo |
|---|---:|
| Análisis y requisitos | 50 minutos |
| Arquitectura y modelo de datos | 40 minutos |
| Prototipo del flujo crítico | 1 hora y 20 minutos |
| Integración funcional completa | 2 horas y 40 minutos |
| Pruebas, seguridad y revisión técnica | 1 hora y 15 minutos |
| Despliegue final | 45 minutos |
| Documentación y evidencias | 1 hora |
| Solicitud de cambio | 45 minutos |
| Demostración y defensa | 45 minutos |
| **Total estimado** | **10 horas** |

La estimación parte del proyecto aprobado del Módulo 6. Los tiempos de espera del proveedor y las correcciones posteriores a la revisión no cuentan como trabajo activo del módulo.

---

# Metodología de trabajo

No intentes completar todo y revisarlo al final.

```text
Fase 1 → requisitos aprobados
Fase 2 → modelo coherente
Fase 3 → flujo crítico aprobado
Fase 4 → funciones completas
Fase 5 → pruebas y seguridad
Fase 6 → despliegue final
Fase 7 → documentación
Fase 8 → cambio solicitado
Fase 9 → demostración y defensa
```

Cada fase produce evidencia. Si el flujo crítico falla, no continúes agregando reportes o detalles visuales.

---

# 1. Caso empresarial

## Situación

Una pequeña empresa comercial administra clientes, proveedores, productos, inventario y ventas. Actualmente utiliza hojas de cálculo separadas. Esto provoca:

- existencias inconsistentes;
- ventas sin historial completo;
- dificultad para conocer productos disponibles;
- acceso de empleados a funciones que no necesitan;
- reportes preparados manualmente;
- datos duplicados;
- poca trazabilidad cuando se corrige una operación.

## Solución solicitada

Una aplicación web que centralice la operación y permita:

- controlar el acceso por rol;
- administrar catálogos;
- registrar movimientos;
- confirmar ventas sin inventario negativo;
- cancelar operaciones de forma controlada;
- consultar indicadores;
- generar reportes;
- conservar evidencia de operaciones importantes.

## Fuera del alcance

No agregues como requisitos obligatorios:

- pagos reales;
- facturación electrónica;
- integración bancaria;
- tienda pública;
- API REST;
- aplicación móvil;
- microservicios;
- WebSockets;
- Celery;
- Docker avanzado;
- contabilidad completa;
- cálculo fiscal de un país;
- múltiples sucursales;
- múltiples monedas;
- inteligencia empresarial avanzada.

Estas funciones necesitan requisitos, seguridad y tiempo propios. Agregarlas sin profundidad reduce la calidad del proyecto principal.

---

# 2. Actores del sistema

Implementa cuatro roles mediante grupos y permisos de Django.

## Administrador

Puede:

- administrar usuarios, grupos y permisos;
- acceder al panel administrativo;
- consultar todos los módulos;
- realizar operaciones de configuración;
- revisar registros importantes.

No debe utilizarse como cuenta cotidiana para registrar ventas.

## Gerencia

Puede:

- consultar clientes, proveedores, productos y ventas;
- consultar paneles e indicadores;
- generar reportes;
- autorizar descuentos dentro de la política definida;
- cancelar ventas cuando la regla lo permita.

No administra permisos globales salvo que se defina expresamente.

## Ventas

Puede:

- consultar productos disponibles;
- crear y consultar clientes;
- registrar ventas;
- consultar sus operaciones;
- descargar los comprobantes permitidos.

No puede ajustar inventario, administrar usuarios ni consultar información gerencial restringida.

## Inventario

Puede:

- administrar proveedores;
- administrar categorías y productos;
- registrar entradas y ajustes autorizados;
- consultar movimientos y existencias.

No puede confirmar ventas ni administrar usuarios.

## Matriz mínima de permisos

| Función | Administrador | Gerencia | Ventas | Inventario |
|---|:---:|:---:|:---:|:---:|
| Administrar usuarios | Sí | No | No | No |
| Consultar clientes | Sí | Sí | Sí | No |
| Editar clientes | Sí | Sí | Sí | No |
| Consultar proveedores | Sí | Sí | No | Sí |
| Editar proveedores | Sí | No | No | Sí |
| Consultar productos | Sí | Sí | Sí | Sí |
| Registrar movimientos | Sí | No | No | Sí |
| Crear ventas | Sí | Sí | Sí | No |
| Cancelar ventas | Sí | Sí | No | No |
| Ver panel gerencial | Sí | Sí | No | No |
| Exportar reportes gerenciales | Sí | Sí | No | No |
| Acceder al admin | Sí | según autorización | No | No |

Puedes endurecer la matriz. No puedes otorgar más acceso sin justificarlo.

---

# 3. Documento de requisitos

Antes de programar, crea `docs/requisitos.md`.

Cada requisito debe contener:

```text
Identificador:
Nombre:
Actor:
Descripción:
Precondiciones:
Flujo principal:
Excepciones:
Resultado esperado:
Criterios de aceptación:
Pruebas relacionadas:
```

Ejemplo:

```text
Identificador: RF-VEN-01
Nombre: Confirmar una venta
Actor: Ventas
Descripción: Registrar una venta con uno o más productos disponibles.
Precondiciones: Usuario autenticado, permiso vigente y cliente activo.
Flujo principal:
1. Seleccionar cliente.
2. Agregar productos y cantidades.
3. Validar existencias.
4. Calcular subtotales y total.
5. Confirmar la operación.
6. Actualizar el inventario.
Excepciones:
- Cliente inactivo.
- Producto inactivo.
- Cantidad no positiva.
- Existencias insuficientes.
Resultado esperado: Venta confirmada y movimientos registrados.
Criterios de aceptación:
- No existe inventario negativo.
- La venta y sus detalles se guardan completamente.
- Un error no deja cambios parciales.
Pruebas relacionadas: test_confirmar_venta, test_rollback_stock_insuficiente.
```

---

# 4. Requisitos funcionales obligatorios

## RF-USU. Usuarios y seguridad

El sistema debe incluir:

- usuario personalizado definido desde el inicio del proyecto;
- inicio y cierre de sesión;
- recuperación de contraseña;
- perfil de usuario;
- grupos y permisos;
- rutas protegidas;
- páginas 403, 404 y 500;
- registro de operaciones importantes.

La recuperación debe utilizar el flujo seguro de Django. En desarrollo puede enviar el enlace a la consola. En una demostración pública solo se presenta como funcional si existe un servicio de correo correctamente configurado.

## RF-CLI. Clientes

Debe permitir:

- crear clientes;
- buscar por nombre o identificador empresarial ficticio;
- consultar detalle;
- modificar información;
- activar o desactivar;
- consultar historial de compras;
- impedir una nueva venta a un cliente inactivo;
- conservar las ventas anteriores aunque el cliente se desactive.

Los documentos adjuntos son opcionales. Si se habilitan, requieren almacenamiento privado persistente y autorización por objeto.

## RF-PROV. Proveedores

Debe permitir:

- crear proveedores;
- consultar y buscar;
- modificar;
- activar o desactivar;
- asociar productos;
- registrar información de contacto ficticia;
- conservar referencias históricas.

## RF-PRD. Productos y categorías

Debe permitir:

- administrar categorías;
- crear productos con código único;
- registrar nombre, descripción, precio, existencias y cantidad mínima;
- cargar una imagen cuando exista almacenamiento persistente;
- activar o desactivar;
- buscar y filtrar;
- mostrar alerta de stock bajo;
- evitar que un producto inactivo se agregue a una nueva venta.

## RF-INV. Inventario

Debe permitir:

- registrar entradas;
- registrar salidas justificadas;
- registrar ajustes positivos o negativos controlados;
- asociar cada movimiento con usuario, fecha, tipo y motivo;
- consultar historial por producto;
- impedir existencias negativas;
- mantener vínculo con la venta cuando el movimiento fue automático.

No permitas editar directamente el stock sin crear un movimiento.

## RF-VEN. Ventas

Debe permitir:

- seleccionar un cliente activo;
- agregar uno o más productos activos;
- indicar cantidades positivas;
- conservar el precio aplicado a cada detalle;
- calcular subtotal y total en el servidor;
- aplicar un descuento opcional controlado;
- validar existencias;
- confirmar en una transacción;
- disminuir inventario una sola vez;
- consultar detalle;
- cancelar de forma controlada;
- devolver inventario una sola vez al cancelar;
- impedir editar arbitrariamente una venta confirmada.

## RF-PAN. Panel empresarial

Debe mostrar:

- ventas recientes;
- total vendido en el periodo;
- productos con stock bajo;
- productos más vendidos;
- clientes frecuentes;
- indicadores filtrados por fecha;
- periodo y moneda visibles;
- estado vacío cuando no hay datos.

## RF-REP. Reportes

Debe incluir:

- reporte de ventas;
- reporte de inventario;
- reporte de movimientos;
- reporte de clientes;
- filtros válidos;
- exportación CSV;
- exportación Excel;
- autorización por reporte;
- protección contra fórmulas en texto exportado.

## RF-ADM. Administración

El panel administrativo debe incluir:

- modelos necesarios;
- columnas útiles;
- búsqueda;
- filtros;
- ordenamiento;
- acciones administrativas seguras;
- acceso restringido.

El admin complementa el sistema. No sustituye la interfaz empresarial principal.

---

# 5. Reglas empresariales obligatorias

Documenta estas reglas con identificadores y crea pruebas para las críticas.

| ID | Regla |
|---|---|
| RN-01 | Un código de producto no puede repetirse. |
| RN-02 | Precio, cantidad y existencias no pueden ser negativos. |
| RN-03 | Un producto inactivo no participa en ventas nuevas. |
| RN-04 | Un cliente inactivo conserva historial, pero no genera ventas nuevas. |
| RN-05 | Una venta requiere al menos un detalle. |
| RN-06 | La cantidad de cada detalle debe ser mayor que cero. |
| RN-07 | El servidor calcula subtotales, descuento y total. |
| RN-08 | El total no puede ser negativo. |
| RN-09 | Una venta no puede confirmar más unidades que las disponibles. |
| RN-10 | Confirmación, detalles y movimientos forman una sola transacción. |
| RN-11 | Cada venta confirmada descuenta inventario una sola vez. |
| RN-12 | Una cancelación devuelve inventario una sola vez. |
| RN-13 | Una venta cancelada no cuenta como ingreso. |
| RN-14 | El precio del detalle conserva el valor aplicado al vender. |
| RN-15 | Todo ajuste manual registra responsable y motivo. |
| RN-16 | Los usuarios solo ejecutan funciones autorizadas. |
| RN-17 | Desactivar un registro histórico no elimina sus relaciones. |
| RN-18 | Los reportes respetan filtros, permisos y estados. |
| RN-19 | No se eliminan físicamente ventas confirmadas desde la interfaz normal. |
| RN-20 | Los datos mostrados y exportados representan la misma consulta. |

## Política de descuento

Define una política concreta. Ejemplo:

```text
Ventas puede aplicar de 0 % a 5 %.
Gerencia puede aplicar de 0 % a 15 %.
Un valor superior se rechaza.
El descuento se calcula en el servidor.
```

Si utilizas otra política, documéntala y pruébala.

## Estados mínimos de venta

```text
BORRADOR → todavía no afecta inventario
CONFIRMADA → afecta inventario y reportes
CANCELADA → conserva historial y revierte inventario una vez
```

Define transiciones permitidas. No cambies estados mediante un campo libre.

---

# 6. Requisitos no funcionales

## Seguridad

- permisos aplicados en servidor;
- protección CSRF;
- contraseñas gestionadas por Django;
- secretos fuera del repositorio;
- `DEBUG=False` en público;
- mensajes sin información interna;
- validación de archivos;
- logs sin datos sensibles.

## Usabilidad

- navegación consistente;
- formularios con etiquetas y errores;
- confirmaciones para acciones delicadas;
- estados vacíos;
- mensajes de éxito y error;
- interfaz responsive;
- contraste y foco visibles.

## Rendimiento

- listas paginadas;
- ausencia de N+1 en pantallas principales;
- rangos de reporte limitados;
- consultas agregadas en la base;
- índices justificados.

## Mantenibilidad

- aplicaciones por responsabilidad;
- vistas delgadas;
- servicios para reglas críticas;
- selectores reutilizables;
- nombres claros;
- migraciones versionadas;
- pruebas organizadas.

## Portabilidad

- dependencias registradas;
- variables documentadas;
- instalación reproducible;
- SQLite para desarrollo permitido;
- PostgreSQL para despliegue final.

---

# 7. Modelo de datos mínimo

El diagrama final debe reflejar tu implementación. Esta estructura es una guía, no un archivo para copiar sin revisar.

```text
Usuario ──────── Perfil
   │
   ├──────────── Venta ─────────── Cliente
   │                │
   │                └──────────── DetalleVenta ───── Producto
   │
   └──────────── MovimientoInventario ──────────────┘

Proveedor ────── ProductoProveedor ───── Producto

Categoría ─────< Producto
```

## Entidades sugeridas

### Usuario y perfil

- identificador;
- nombre de usuario o correo;
- datos de perfil no sensibles;
- estado;
- grupos y permisos.

### Cliente

- identificador;
- nombre;
- documento ficticio opcional;
- correo;
- teléfono;
- dirección;
- estado;
- fechas de auditoría.

### Proveedor

- identificador;
- nombre;
- contacto;
- correo;
- teléfono;
- estado.

### Categoría

- identificador;
- nombre único;
- estado.

### Producto

- identificador;
- código único;
- categoría;
- nombre;
- descripción;
- precio;
- stock;
- stock mínimo;
- imagen opcional;
- estado.

### Relación producto-proveedor

Si un producto puede tener varios proveedores, utiliza una relación explícita cuando necesites guardar datos adicionales, como código del proveedor o costo de referencia.

### Venta

- identificador;
- cliente;
- vendedor;
- fecha;
- estado;
- subtotal;
- descuento;
- total;
- fecha de cancelación;
- usuario que canceló;
- motivo de cancelación.

### Detalle de venta

- venta;
- producto;
- cantidad;
- precio unitario histórico;
- subtotal.

### Movimiento de inventario

- producto;
- tipo;
- cantidad;
- existencia anterior;
- existencia posterior;
- fecha;
- usuario;
- motivo;
- venta relacionada cuando corresponda.

### Registro de operación

Puede representar eventos importantes sin almacenar secretos:

- actor;
- acción;
- entidad;
- identificador del objeto;
- fecha;
- contexto mínimo permitido.

No guardes contraseñas, tokens, cookies ni formularios completos.

---

# 8. Integridad y decisiones de datos

Cada regla importante debe ubicarse conscientemente.

| Regla | Formulario | Servicio | Modelo/base de datos | Prueba |
|---|:---:|:---:|:---:|:---:|
| Cantidad positiva | Sí | Sí | restricción cuando aplica | Sí |
| Código único | mensaje amigable | validación opcional | unicidad | Sí |
| Stock suficiente | No basta | Sí | bloqueo/transacción | Sí |
| Permiso para cancelar | No | vista/servicio | no aplica | Sí |
| Total correcto | no confiar | Sí | campos coherentes | Sí |

No uses señales para esconder el flujo principal de ventas. Una operación empresarial explícita es más fácil de comprender, probar y mantener.

---

# 9. Trazabilidad

Crea `docs/trazabilidad.md`:

| Requisito | Regla | Implementación | Prueba | Evidencia |
|---|---|---|---|---|
| RF-VEN-01 | RN-09, RN-10 | `ventas/services.py` | `test_services.py` | captura 12 |

La trazabilidad permite responder:

```text
¿Dónde se implementó este requisito?
¿Qué prueba lo verifica?
¿Qué evidencia demuestra el resultado?
```

No necesitas registrar cada línea. Concéntrate en los requisitos y reglas críticos.

---

# 10. Definition of Done

Una función solo está terminada cuando:

- cumple el requisito;
- respeta permisos;
- valida entradas;
- conserva datos consistentes;
- maneja errores esperados;
- tiene pruebas proporcionales al riesgo;
- funciona en interfaz responsive;
- no genera consultas evitables;
- está documentada cuando lo necesita;
- fue confirmada en Git;
- puede explicarse.

“La pantalla abre” no significa “la función está terminada”.

---

# 11. Preparación del repositorio final

Crea una rama de trabajo final:

```powershell
git switch -c proyecto-final
```

Antes de cambiar código:

1. ejecuta todas las pruebas;
2. registra el resultado inicial;
3. crea una etiqueta de la versión candidata;
4. revisa observaciones pendientes;
5. crea una lista priorizada.

```powershell
git tag -a v0.9.0 -m "Versión candidata aprobada"
```

No uses una etiqueta si todavía no puedes identificar con claridad la versión que representa.

Organiza el trabajo:

```text
CRÍTICO  → seguridad, datos, transacciones, despliegue
ALTO     → requisito obligatorio incompleto
MEDIO    → experiencia o documentación importante
BAJO     → mejora visual sin impacto funcional
```

Resuelve primero los riesgos, no los detalles más entretenidos.

---

# 12. Fase 1: análisis y alcance

## Paso 1. Identifica el proceso actual

Describe cómo trabaja la empresa ficticia antes del sistema:

```text
¿Quién registra una venta?
¿De dónde obtiene el stock?
¿Quién puede corregir una operación?
¿Cómo se conoce el total vendido?
¿Qué ocurre cuando una venta se cancela?
```

## Paso 2. Define el problema

Evita una descripción genérica como “la empresa necesita modernizarse”.

Ejemplo:

```text
La empresa mantiene ventas e inventario en archivos separados.
Una venta puede registrarse sin actualizar existencias y no existe
una forma confiable de identificar quién corrigió una cantidad.
```

## Paso 3. Define el éxito

El proyecto tendrá éxito si:

- ninguna venta confirmada deja inventario negativo;
- cada rol ve únicamente funciones permitidas;
- una cancelación conserva historial y devuelve stock una vez;
- gerencia obtiene indicadores sin cálculos manuales;
- otra persona instala el sistema con el README;
- las reglas críticas tienen pruebas;
- la aplicación funciona desplegada.

## Paso 4. Escribe historias de usuario

Formato:

```text
Como [rol]
quiero [capacidad]
para [beneficio].
```

Ejemplo:

```text
Como responsable de inventario
quiero consultar los movimientos de un producto
para explicar por qué cambió su existencia.
```

Cada historia debe tener criterios observables:

```text
Dado un producto con existencia 10
cuando se confirma una venta de 3 unidades
entonces la existencia final es 7
y existe un movimiento asociado con la venta.
```

## Paso 5. Congela el alcance

Crea tres listas:

| Obligatorio | Deseable | Fuera del alcance |
|---|---|---|
| Confirmar ventas | tema oscuro | pagos reales |

No muevas un elemento a “obligatorio” durante la construcción sin ajustar tiempo y riesgo.

---

# 13. Fase 2: arquitectura y datos

## Mapa de aplicaciones

Una organización posible:

```text
config/        → configuración global
usuarios/      → usuario, perfil y acceso
clientes/      → clientes e historial
proveedores/   → proveedores
productos/     → categorías y productos
inventario/    → movimientos y existencias
ventas/        → ventas, detalles y transacciones
reportes/      → panel, consultas y exportadores
core/          → inicio, errores y utilidades verdaderamente compartidas
```

No crees una aplicación `utils` para depositar código sin dueño. Una función compartida debe tener un propósito estable.

## Flujo de una operación crítica

```text
URL
 ↓
Vista protegida
 ↓
Formulario / formset
 ↓
Servicio transaccional
 ├── valida cliente
 ├── bloquea productos necesarios
 ├── valida existencias
 ├── crea venta y detalles
 ├── registra movimientos
 └── confirma todo
 ↓
Redirección al detalle
```

## Revisión del diagrama

Antes de modificar modelos, comprueba:

- cardinalidades;
- obligatoriedad de relaciones;
- comportamiento de `on_delete`;
- unicidad;
- restricciones;
- datos históricos;
- campos derivados;
- estados;
- auditoría;
- índices.

No elimines un modelo con datos sin revisar las migraciones y el impacto.

## Diagrama de componentes

Incluye una vista sencilla:

```text
Navegador
   ↓
Django URLs y Views
   ↓
Forms ─ Services ─ Selectors
   ↓
Models y ORM
   ↓
PostgreSQL

Archivos estáticos → WhiteNoise
Imágenes públicas → almacenamiento persistente
```

---

# 14. Mini proyecto obligatorio: Prototipo del flujo crítico

El prototipo es una puerta de aprobación. Demuestra el proceso principal antes de cerrar el sistema completo.

## Flujo

```text
Inicio de sesión
        ↓
Selección del cliente
        ↓
Creación de la venta
        ↓
Registro de detalles
        ↓
Validación de existencias
        ↓
Confirmación transaccional
        ↓
Actualización del inventario
        ↓
Consulta del reporte
```

## Escenario base

Prepara:

- un usuario del grupo Ventas;
- un cliente activo;
- un cliente inactivo;
- tres productos activos;
- un producto inactivo;
- existencias conocidas;
- dos cantidades válidas;
- una cantidad superior al stock.

## Prueba guiada del flujo exitoso

1. Inicia sesión como Ventas.
2. Selecciona el cliente activo.
3. Agrega dos productos.
4. Confirma la venta.
5. Comprueba el total en servidor.
6. Comprueba el detalle guardado.
7. Comprueba la reducción del stock.
8. Comprueba los movimientos.
9. Abre el reporte del periodo con Gerencia.
10. Confirma que la venta aparece una sola vez.

## Prueba guiada del fallo

1. Anota existencias y conteos iniciales.
2. Intenta vender más unidades de las disponibles.
3. Comprueba el mensaje.
4. Comprueba que no existe una venta parcial.
5. Comprueba que no existe un detalle parcial.
6. Comprueba que el inventario no cambió.
7. Comprueba que no existe un movimiento falso.

## Prueba guiada de autorización

1. Inicia sesión como Inventario.
2. Escribe directamente la URL para crear una venta.
3. Comprueba que la respuesta es 403.
4. Inicia sesión como Ventas.
5. Escribe directamente la URL del panel gerencial.
6. Comprueba que la respuesta es 403.

## Pruebas automáticas mínimas del prototipo

- venta exitosa;
- stock insuficiente;
- rollback completo;
- cliente inactivo;
- producto inactivo;
- usuario sin permiso;
- precio histórico;
- movimiento vinculado;
- reporte incluye confirmada;
- reporte excluye cancelada.

## Entregable del prototipo

```text
prototipo_flujo_critico/
├── escenario.md
├── matriz_pruebas.md
├── resultado_pruebas.txt
├── diagrama_flujo.png o .pdf
└── capturas/
```

## Aprobación

El prototipo debe cumplir todos estos puntos:

- transacción completa;
- stock correcto;
- autorización en servidor;
- pruebas exitosas;
- reporte coherente;
- explicación del servicio;
- ausencia de condiciones críticas.

No avances a la integración final hasta que el prototipo sea aprobado.

---

# 15. Fase 3: integración funcional

Cuando el flujo crítico esté aprobado, completa el resto mediante recorridos verticales.

```text
Requisito
   ↓
Modelo y regla
   ↓
Formulario
   ↓
Vista y permiso
   ↓
Template
   ↓
Prueba
   ↓
Evidencia
```

No construyas todos los modelos, luego todas las vistas y finalmente todas las pruebas. Completar un recorrido permite detectar antes los problemas de diseño.

## Recorrido A. Cliente

Comprueba:

- alta válida;
- duplicado o identificador inválido;
- búsqueda;
- edición;
- desactivación;
- historial;
- bloqueo de nueva venta si está inactivo;
- acceso según rol.

## Recorrido B. Proveedor y producto

Comprueba:

- creación;
- asociación;
- código único;
- precio válido;
- estado;
- filtros;
- imagen alternativa;
- permisos.

## Recorrido C. Inventario

Comprueba:

- entrada;
- salida permitida;
- salida mayor al stock rechazada;
- ajuste con motivo;
- historial;
- actor registrado;
- inexistencia de edición directa insegura.

## Recorrido D. Venta

Comprueba:

- cliente y productos válidos;
- formset con al menos una línea;
- cantidades positivas;
- descuento según rol;
- total del servidor;
- transacción;
- detalle histórico;
- cancelación controlada;
- doble cancelación rechazada.

## Recorrido E. Panel y reportes

Comprueba:

- filtros;
- estados;
- totales conocidos;
- periodo visible;
- listas optimizadas;
- CSV;
- Excel;
- fórmulas neutralizadas;
- permisos.

---

# 16. Conexión con toda la Ruta Python

El proyecto debe mostrar conocimientos anteriores de forma natural.

## Lógica de Programación

- descomposición del proceso de venta;
- condiciones de estados;
- manejo de excepciones;
- prueba de casos límite.

## Python Nivel 1 e Intermedio

- funciones;
- clases;
- colecciones;
- excepciones;
- módulos;
- programación orientada a objetos.

## Python Práctico

- fechas;
- manejo de archivos;
- `pathlib`;
- CSV;
- OpenPyXL;
- funciones integradas.

## Desarrollo de Software con Python

- arquitectura por responsabilidades;
- servicios;
- validaciones;
- código reutilizable;
- automatización;
- documentación.

## SQL y Bases de Datos

- claves;
- relaciones;
- integridad;
- filtros;
- agregaciones;
- transacciones;
- índices;
- interpretación de consultas.

## Django

- MVT;
- ORM;
- formularios;
- autenticación;
- permisos;
- templates;
- pruebas;
- despliegue.

No agregues una tecnología solo para mencionarla. Cada herramienta debe resolver una necesidad del proyecto.

---

# 17. Automatizaciones útiles

El proyecto debe incluir al menos un comando propio de Django.

## Comando de datos de demostración

```powershell
python manage.py cargar_demo
```

Debe:

- crear grupos y permisos;
- crear usuarios ficticios cuando no existan;
- crear catálogos y operaciones de demostración;
- evitar duplicaciones al repetirse;
- no imprimir contraseñas;
- negarse a ejecutarse accidentalmente en producción o exigir confirmación explícita.

Una estrategia segura:

```python
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Carga datos ficticios para demostración"

    def add_arguments(self, parser):
        parser.add_argument("--permitir-produccion", action="store_true")

    def handle(self, *args, **options):
        if not settings.DEBUG and not options["permitir_produccion"]:
            raise CommandError(
                "Operación detenida fuera de desarrollo."
            )

        self.stdout.write("Carga de demostración iniciada")
```

El indicador no vuelve segura cualquier carga. Revisa qué crea, actualiza o elimina el comando.

## Otras automatizaciones permitidas

- exportación de reporte;
- carga controlada de catálogos ficticios;
- verificación de configuración;
- limpieza de archivos temporales no referenciados.

No agregues tareas programadas o infraestructura avanzada si el proyecto no la necesita.

---

# 18. Plan maestro de pruebas

Crea `docs/plan_pruebas.md`.

## Matriz mínima

| Área | Caso positivo | Caso negativo | Permiso | Integridad |
|---|:---:|:---:|:---:|:---:|
| Usuarios | Sí | Sí | Sí | No aplica |
| Clientes | Sí | Sí | Sí | Sí |
| Productos | Sí | Sí | Sí | Sí |
| Inventario | Sí | Sí | Sí | Sí |
| Ventas | Sí | Sí | Sí | Sí |
| Reportes | Sí | Sí | Sí | Sí |

## Cantidad mínima

Incluye al menos **30 pruebas automáticas relevantes**:

| Tipo | Mínimo |
|---|---:|
| Modelos y restricciones | 5 |
| Formularios y formsets | 5 |
| Autenticación y permisos | 6 |
| Servicios y transacciones | 6 |
| Vistas, reportes y exportaciones | 6 |
| Comandos y utilidades propias | 2 |
| **Total mínimo** | **30** |

No dividas una comprobación trivial en muchas pruebas para alcanzar la cifra.

## Casos críticos obligatorios

- stock insuficiente;
- rollback;
- doble confirmación o doble cancelación;
- cliente inactivo;
- producto inactivo;
- descuento fuera del límite;
- acceso anónimo;
- acceso sin permiso;
- URL directa;
- reporte sin datos;
- periodo inválido;
- CSV con texto que comienza con `=`;
- comando repetido sin duplicar;
- cancelación excluida de ingresos.

## Pruebas manuales exploratorias

Además de automatizar, intenta:

- volver atrás después de enviar un formulario;
- enviar dos veces;
- abrir dos sesiones con roles diferentes;
- modificar identificadores en la URL;
- usar valores límite;
- eliminar una fila del formset y agregar otra;
- descargar un reporte vacío;
- navegar con pantalla pequeña;
- usar solo teclado en un flujo principal;
- abrir una ruta inexistente.

Registra hallazgos, correcciones y pruebas de regresión.

---

# 19. Revisión de seguridad

## Autenticación

- [ ] El acceso utiliza el sistema de Django.
- [ ] La contraseña no se guarda ni registra manualmente.
- [ ] El logout requiere el método apropiado.
- [ ] La recuperación no revela si una cuenta existe más de lo necesario.

## Autorización

- [ ] Cada URL sensible valida permisos.
- [ ] Los objetos consultados pertenecen al alcance permitido.
- [ ] El admin está restringido.
- [ ] Ocultar botones no es la única protección.

## Entradas

- [ ] Los formularios validan datos.
- [ ] Los identificadores se consultan de forma segura.
- [ ] Los archivos tienen tipo y tamaño controlados.
- [ ] Los filtros tienen límites.
- [ ] Los cálculos no confían en valores del navegador.

## Configuración

- [ ] No hay secretos en Git.
- [ ] `DEBUG=False` en público.
- [ ] HTTPS funciona.
- [ ] Cookies seguras están activas.
- [ ] `ALLOWED_HOSTS` es específico.
- [ ] `check --deploy` fue revisado.

## Datos y logs

- [ ] Los datos de demostración son ficticios.
- [ ] Los logs no contienen credenciales.
- [ ] Las exportaciones respetan permisos.
- [ ] Los documentos privados no tienen URL pública permanente.
- [ ] Se explica la política de respaldo del entorno.

---

# 20. Revisión de experiencia de usuario

## Navegación

- el menú cambia según permisos;
- la página actual se identifica;
- existe una salida clara de cada formulario;
- no hay enlaces rotos.

## Formularios

- cada campo tiene etiqueta;
- los errores aparecen cerca del campo;
- los datos válidos se conservan tras un error;
- las acciones destructivas se confirman;
- el botón evita ambigüedad: “Confirmar venta”, no “Aceptar”.

## Tablas

- encabezados claros;
- filtros visibles;
- paginación;
- estado vacío;
- acciones consistentes;
- adaptación a móvil.

## Accesibilidad básica

- HTML semántico;
- foco visible;
- navegación por teclado;
- contraste legible;
- texto alternativo para imágenes informativas;
- mensajes que no dependen solo del color;
- iconos acompañados por texto o etiqueta accesible.

No afirmes que el sistema es completamente accesible si no realizaste una auditoría formal. Documenta que aplicaste comprobaciones básicas.

---

# 21. Revisión de rendimiento

Selecciona al menos cuatro pantallas:

1. lista de productos;
2. lista de ventas;
3. detalle de venta;
4. panel empresarial.

Para cada una registra:

| Pantalla | Datos de prueba | Consultas iniciales | Consultas finales | Cambio |
|---|---:|---:|---:|---|

Comprueba:

- `select_related()` para relaciones directas usadas;
- `prefetch_related()` para colecciones;
- agregaciones en base de datos;
- paginación;
- índices alineados con filtros;
- ausencia de consultas dentro de ciclos del template.

No necesitas realizar pruebas de carga avanzadas. Debes demostrar que sabes detectar y corregir problemas evidentes.

---

# 22. Despliegue final

La aplicación final debe utilizar:

- Django 5.2 LTS;
- PostgreSQL;
- servidor de producción;
- HTTPS;
- variables de entorno;
- archivos estáticos preparados;
- estrategia persistente de multimedia;
- migraciones aplicadas;
- ruta de salud;
- logs de aplicación.

## Secuencia de publicación

```text
Pruebas locales
      ↓
Revisión de migraciones
      ↓
Revisión de secretos
      ↓
Commit y etiqueta
      ↓
Construcción
      ↓
Migraciones
      ↓
Inicio del servicio
      ↓
Pruebas de humo
```

## Pruebas de humo públicas

Después del despliegue comprueba:

- página principal;
- login y logout;
- acceso de cada rol;
- lista de productos;
- creación de cliente;
- venta de demostración;
- detalle y movimiento;
- panel;
- CSV y Excel;
- 403 y 404;
- persistencia tras un nuevo despliegue.

## Etiqueta final

Cuando la versión revisada sea estable:

```powershell
git tag -a v1.0.0 -m "Proyecto Final COA"
git push origin v1.0.0
```

No etiquetes como `v1.0.0` una versión que todavía contiene una condición crítica conocida.

---

# 23. Datos y cuentas de demostración

Los datos deben contar una historia coherente.

Incluye como mínimo:

- 4 roles;
- 4 usuarios de demostración;
- 12 clientes;
- 5 proveedores;
- 5 categorías;
- 25 productos;
- 40 movimientos;
- 20 ventas en fechas y estados diferentes;
- productos con stock normal, bajo y agotado;
- clientes activos e inactivos.

## Credenciales

Entrega credenciales de demostración mediante el canal autorizado por COA, no como contraseñas permanentes en un repositorio público.

Las cuentas deben:

- usar contraseñas únicas para la demostración;
- no compartir credenciales reales;
- tener permisos limitados;
- poder rotarse;
- excluir acceso innecesario al admin.

## Privacidad

Utiliza nombres, correos, teléfonos, direcciones e identificadores completamente ficticios. No copies una base real para “hacer el proyecto más creíble”.

---

# 24. Documentación profesional

## README

Debe incluir:

1. nombre y propósito;
2. problema resuelto;
3. funciones principales;
4. tecnologías;
5. arquitectura;
6. capturas;
7. requisitos de instalación;
8. configuración;
9. migraciones;
10. datos de demostración;
11. pruebas;
12. despliegue;
13. roles;
14. seguridad;
15. limitaciones;
16. autoría y licencia si corresponde.

## Manual de instalación

Otra persona debe poder:

```text
clonar
crear entorno
instalar dependencias
configurar variables
migrar
cargar datos
crear administrador
ejecutar pruebas
iniciar el sistema
```

## Manual de usuario

Organiza por tarea, no por archivo técnico:

- iniciar sesión;
- registrar cliente;
- registrar entrada;
- confirmar venta;
- cancelar venta;
- consultar panel;
- generar reporte;
- cerrar sesión.

Incluye permisos y advertencias en cada operación delicada.

## Documento de arquitectura

Explica:

- mapa de aplicaciones;
- responsabilidades;
- flujo crítico;
- modelo de datos;
- servicios;
- selectores;
- decisiones de seguridad;
- estrategia de despliegue;
- limitaciones.

## Registro de cambios

Crea `CHANGELOG.md` con al menos:

```text
v1.0.0
- funciones entregadas;
- correcciones importantes;
- limitaciones conocidas.
```

---

# 25. Presentación de portafolio

El proyecto debe poder comprenderse sin abrir primero el código.

## Resumen de portafolio

Redacta entre 150 y 250 palabras:

```text
Problema
Solución
Responsabilidad personal
Decisión técnica importante
Reto resuelto
Resultado
```

No escribas solamente una lista de tecnologías.

## Capturas obligatorias

- login;
- panel por rol;
- clientes;
- proveedores;
- productos;
- movimiento de inventario;
- creación de venta;
- detalle de venta;
- reporte filtrado;
- Excel o CSV;
- admin configurado;
- aplicación publicada.

No muestres secretos, correos reales ni paneles del proveedor con credenciales.

## Guion de demostración

Duración recomendada: 6 a 8 minutos.

```text
0:00 Problema y objetivo
0:45 Roles
1:30 Cliente y producto
2:15 Entrada de inventario
3:00 Venta completa
4:30 Panel y reporte
5:30 Pruebas y arquitectura
6:30 Despliegue y limitaciones
```

Demuestra un flujo, no todas las pantallas.

---

# 26. Solicitud de cambio del instructor

Después de la entrega inicial recibirás una modificación pequeña y limitada. Su objetivo es comprobar que entiendes la arquitectura y puedes cambiarla sin romper lo existente.

## Posibles solicitudes

- agregar filtro de categoría al reporte de inventario;
- limitar descuento por grupo;
- mostrar motivo de cancelación;
- agregar un campo empresarial validado;
- cambiar un permiso;
- incluir una columna en CSV y Excel;
- agregar un indicador al panel;
- impedir una transición de estado;
- crear una prueba de regresión;
- modificar el comando de datos de demostración.

## Proceso

1. Repite el requisito con tus palabras.
2. Identifica archivos afectados.
3. Explica el riesgo.
4. Escribe o ajusta la prueba.
5. Implementa el cambio mínimo.
6. Ejecuta la batería completa.
7. Confirma en un commit separado.
8. Actualiza documentación.

## Evidencia

```text
docs/cambio_instructor.md
```

Debe contener:

- solicitud recibida;
- análisis;
- archivos modificados;
- prueba añadida;
- resultado;
- commit;
- evidencia visual cuando aplique.

No se evaluará la velocidad aislada. Se evaluará comprensión, control del impacto y calidad.

---

# 27. Defensa de autoría

La defensa confirma que el proyecto representa tu aprendizaje.

Debes poder explicar:

## Solicitud web

```text
URL → vista → formulario o selector → servicio o modelo → template/respuesta
```

## ORM

- una consulta con filtro;
- una agregación;
- una optimización de relaciones;
- el motivo de un índice.

## Validación

- una regla de formulario;
- una regla del servicio;
- una restricción de datos.

## Seguridad

- autenticación;
- permiso por URL;
- protección de secretos;
- separación de roles.

## Transacción

- qué operaciones agrupa;
- qué ocurre ante un error;
- cómo se evita una venta parcial;
- cómo se prueba.

## Prueba automática

- preparación;
- acción;
- resultado esperado;
- razón empresarial.

## IA

- dónde la utilizaste;
- qué propuesta rechazaste o modificaste;
- cómo validaste el resultado;
- qué información evitaste compartir.

Si no puedes explicar un fragmento, deberás estudiarlo, corregirlo o retirarlo.

---

# 28. Actividades obligatorias

Estas actividades producen partes del proyecto final. No son ejercicios aislados.

## Actividad 1. Declaración del problema

Redacta una página que explique:

- cómo trabaja la empresa ficticia;
- cuál es el problema principal;
- quiénes se ven afectados;
- qué errores ocurren;
- qué resultado busca el sistema;
- qué no resolverá esta versión.

No menciones Django hasta después de explicar el problema.

## Actividad 2. Historias y criterios

Escribe al menos doce historias:

- dos de usuarios y seguridad;
- dos de clientes o proveedores;
- dos de productos e inventario;
- tres de ventas;
- dos de reportes;
- una de administración.

Cada historia debe incluir al menos dos criterios de aceptación y un caso de error.

## Actividad 3. Matriz de permisos

Implementa la matriz de roles. Crea una prueba automatizada para cinco funciones sensibles y una prueba manual por URL directa. Documenta cualquier diferencia entre la matriz propuesta y la implementada.

## Actividad 4. Modelo de datos

Entrega un diagrama con entidades, claves y cardinalidades. Selecciona cinco decisiones y explica, por ejemplo:

- por qué una venta conserva el cliente desactivado;
- por qué el detalle guarda precio;
- por qué un movimiento referencia usuario;
- por qué no se elimina una venta;
- por qué producto y proveedor requieren relación intermedia o no.

## Actividad 5. Auditoría de migraciones

En una copia segura:

1. crea una base vacía;
2. ejecuta todas las migraciones;
3. carga datos de demostración;
4. ejecuta pruebas;
5. registra el resultado.

No borres migraciones para ocultar un problema de secuencia.

## Actividad 6. Flujo crítico

Completa el mini proyecto de la sección 14. Adjunta evidencia del éxito, del fallo transaccional y del rechazo por permiso.

## Actividad 7. Cancelación segura

Crea y prueba:

- cancelación de venta confirmada;
- devolución exacta de stock;
- movimiento de reversión;
- usuario y motivo;
- exclusión del reporte de ingresos;
- rechazo de una segunda cancelación.

## Actividad 8. Reportes reconciliados

Prepara un conjunto pequeño cuyos totales conozcas. Comprueba que:

- el panel;
- la tabla HTML;
- el CSV;
- el Excel

producen la misma cantidad y total para el mismo periodo.

## Actividad 9. Auditoría de consultas

Mide las cuatro pantallas requeridas. Aumenta los datos y verifica que no aparezca una consulta adicional por cada fila. Registra el antes y el después.

## Actividad 10. Revisión de configuración

Ejecuta:

```powershell
python manage.py check
python manage.py check --deploy --settings=config.settings.production
```

Clasifica cada advertencia:

```text
corregida
no aplica con justificación
pendiente crítico
```

No entregues con un pendiente crítico.

## Actividad 11. Instalación limpia

Prueba el manual en una carpeta o entorno nuevo. No utilices dependencias instaladas globalmente. Si un paso falta, corrige el manual.

## Actividad 12. Ensayo de demostración

Ejecuta el guion sin improvisar datos. Registra:

- duración;
- pasos confusos;
- errores encontrados;
- cambios aplicados;
- versión demostrada.

---

# 29. Ejercicios de diagnóstico

## Diagnóstico 1. Total manipulado

El navegador envía un total menor al calculado. Explica dónde debe ignorarse ese valor, cómo se recalcula y qué prueba demuestra la protección.

## Diagnóstico 2. Doble envío

Una persona pulsa dos veces “Confirmar venta”. Analiza qué podría duplicarse y diseña una protección proporcional. No afirmes que deshabilitar el botón resuelve por sí solo el problema del servidor.

## Diagnóstico 3. Producto eliminado

Un producto tiene ventas históricas. Decide si debe eliminarse, protegerse o desactivarse. Justifica el comportamiento de `on_delete` y la regla empresarial.

## Diagnóstico 4. Cancelación parcial

La venta cambia a cancelada, pero falla la devolución del segundo producto. Explica cómo evitar el estado parcial y escribe el caso de prueba.

## Diagnóstico 5. Permiso heredado

Un usuario cambia de grupo, pero conserva un permiso individual. Revisa la fuente del permiso y define cómo auditarás accesos efectivos.

## Diagnóstico 6. Reportes diferentes

El panel muestra 1 000, el CSV 1 150 y Excel 900. Propón un método para localizar la diferencia entre estados, fechas, zona horaria y consultas duplicadas.

## Diagnóstico 7. Archivo perdido

Una imagen desaparece después del despliegue. Identifica por qué el disco local no era persistente y diseña una estrategia coherente sin confundir static con media.

## Diagnóstico 8. Migración riesgosa

Debes convertir un campo opcional en obligatorio con registros existentes. Describe una migración en etapas que conserve datos.

## Diagnóstico 9. Código sugerido por IA

La IA propone desactivar CSRF para “corregir” un formulario. Rechaza o modifica la propuesta, identifica la causa real y explica qué evidencia necesitas.

## Diagnóstico 10. Secreto en historial

Una clave fue confirmada y luego borrada del archivo actual. Describe por qué sigue comprometida y qué acciones debes tomar antes de publicar.

---

# 30. Retos adicionales

No son obligatorios para aprobar. Solo realízalos cuando todos los requisitos y pruebas críticas estén completos.

## Reto 1. Comprobante imprimible

Crea una vista de impresión de la venta sin agregar una dependencia pesada. Debe mostrar datos ficticios, detalle, total y estado.

## Reto 2. Indicador comparativo

Compara el total del periodo actual con el periodo anterior. Explica límites y evita afirmar causalidad.

## Reto 3. Historial de cambios de producto

Registra cambios seleccionados de precio o estado con actor y fecha, sin duplicar un sistema completo de auditoría.

## Reto 4. Prueba end-to-end manual documentada

Documenta un recorrido completo desde entrada de inventario hasta reporte, con datos iniciales y finales.

## Reto 5. Página pública de estado mínimo

Mejora la ruta de salud sin exponer versiones, secretos o conteos privados.

---

# 31. Proyecto Final: COA Gestión Empresarial Web

## Misión

Entregar una aplicación web empresarial que centralice usuarios, clientes, proveedores, productos, inventario, ventas y reportes, con datos consistentes y control de acceso.

## Alcance funcional mínimo

| Área | Resultado demostrable |
|---|---|
| Usuarios | acceso, recuperación, perfil, grupos y permisos |
| Clientes | CRUD lógico, búsqueda, estado e historial |
| Proveedores | gestión, estado y productos asociados |
| Productos | categorías, precios, existencias, imagen y alertas |
| Inventario | entradas, salidas, ajustes e historial |
| Ventas | detalle, cálculos, descuento, transacción y cancelación |
| Panel | indicadores y filtros |
| Reportes | cuatro reportes, CSV y Excel |
| Admin | búsqueda, filtros, acciones y acceso restringido |
| Operación | pruebas, PostgreSQL, despliegue y documentación |

## Alcance técnico mínimo

- Django 5.2 LTS;
- Python compatible;
- Bootstrap 5 y HTML semántico;
- PostgreSQL desplegado;
- SQLite local permitido;
- Git y GitHub;
- arquitectura por aplicaciones;
- servicios y selectores;
- transacciones;
- al menos 30 pruebas relevantes;
- variables de entorno;
- servidor de producción;
- HTTPS;
- CSV y Excel;
- documentación completa.

## Restricciones

- no usar `raw SQL` para reemplazar el ORM sin necesidad y explicación;
- no confiar en cálculos del cliente;
- no guardar contraseñas manualmente;
- no eliminar controles de seguridad para resolver errores;
- no incluir datos reales;
- no entregar dependencias o funciones que no puedas explicar;
- no cambiar Django por otro framework;
- no reemplazar la interfaz principal con el admin;
- no omitir pruebas críticas por falta de tiempo.

---

# 32. Matriz de aceptación final

Marca un elemento como aprobado solo si existe evidencia.

## Usuarios y seguridad

- [ ] Existe usuario personalizado.
- [ ] Login y logout funcionan.
- [ ] Recuperación está configurada según el entorno.
- [ ] Existe perfil.
- [ ] Los cuatro roles están implementados.
- [ ] Las rutas validan permisos.
- [ ] Las páginas de error no revelan detalles.
- [ ] Los eventos importantes registran contexto permitido.

## Clientes

- [ ] CRUD permitido según rol.
- [ ] Búsqueda funcional.
- [ ] Estado activo/inactivo.
- [ ] Historial de compras.
- [ ] Cliente inactivo no crea venta.
- [ ] Historial no se pierde al desactivar.

## Proveedores

- [ ] CRUD permitido según rol.
- [ ] Búsqueda y filtros.
- [ ] Estado.
- [ ] Productos asociados.
- [ ] Contacto ficticio.

## Productos e inventario

- [ ] Código único.
- [ ] Precio y cantidades válidos.
- [ ] Categorías.
- [ ] Imagen o alternativa.
- [ ] Stock mínimo y alerta.
- [ ] Entradas, salidas y ajustes.
- [ ] Historial con actor y motivo.
- [ ] No existe edición directa insegura.
- [ ] Nunca queda stock negativo.

## Ventas

- [ ] Cliente activo.
- [ ] Uno o más detalles.
- [ ] Cantidades positivas.
- [ ] Precio histórico.
- [ ] Cálculos de servidor.
- [ ] Descuento controlado.
- [ ] Transacción completa.
- [ ] Movimiento automático.
- [ ] Cancelación controlada.
- [ ] Doble cancelación rechazada.

## Panel y reportes

- [ ] Indicadores correctos.
- [ ] Periodo visible.
- [ ] Estados correctos.
- [ ] Cuatro reportes.
- [ ] Filtros válidos.
- [ ] CSV y Excel.
- [ ] Protección de texto.
- [ ] Permisos.
- [ ] Resultados reconciliados.

## Calidad y operación

- [ ] Pruebas completas.
- [ ] No hay N+1 evidente.
- [ ] Listas paginadas.
- [ ] Índices justificados.
- [ ] Migraciones desde cero.
- [ ] Datos demo idempotentes.
- [ ] No hay secretos.
- [ ] `check --deploy` revisado.
- [ ] PostgreSQL persiste.
- [ ] HTTPS funciona.
- [ ] Static y media tienen estrategia correcta.
- [ ] README y manuales están completos.

---

# 33. Entregables finales

Debes entregar:

1. repositorio del proyecto;
2. enlace de la aplicación desplegada;
3. código fuente comprimido;
4. `requirements.txt`;
5. `.env.example` sin secretos;
6. documento de requisitos;
7. matriz de trazabilidad;
8. diagrama entidad-relación;
9. diagrama de arquitectura;
10. plan y evidencia de pruebas;
11. evidencia de reportes;
12. README profesional;
13. manual de instalación;
14. manual de usuario;
15. datos y usuarios de demostración;
16. capturas principales;
17. historial de commits y etiqueta final;
18. bitácora de IA;
19. presentación escrita para portafolio;
20. evidencia del prototipo crítico;
21. implementación del cambio solicitado;
22. documento de limitaciones conocidas;
23. evidencia de defensa.

---

# 34. Estructura de la entrega

Nombre:

```text
COA_DJANGO_PROYECTO_FINAL_Nombre_Apellido.zip
```

Estructura:

```text
COA_DJANGO_PROYECTO_FINAL_Nombre_Apellido/
├── README_ENTREGA.md
├── enlaces/
│   ├── repositorio.txt
│   └── aplicacion.txt
├── docs/
│   ├── requisitos.md
│   ├── trazabilidad.md
│   ├── arquitectura.md
│   ├── modelo_datos.pdf
│   ├── plan_pruebas.md
│   ├── instalacion.md
│   ├── manual_usuario.pdf
│   ├── limitaciones.md
│   ├── cambio_instructor.md
│   └── uso_ia.md
├── evidencias/
│   ├── capturas/
│   ├── pruebas.txt
│   ├── check_deploy.txt
│   ├── reportes/
│   └── prototipo_flujo_critico/
└── proyecto/
```

No incluyas:

- `.env`;
- credenciales reales;
- entorno virtual;
- `__pycache__`;
- archivos generados innecesarios;
- `db.sqlite3` con datos personales;
- media privada;
- paneles con secretos;
- dependencias copiadas dentro del proyecto.

---

# 35. Bitácora de Inteligencia Artificial

Registra cada uso material:

| Fecha | Herramienta | Objetivo | Propuesta | Riesgo revisado | Verificación | Decisión |
|---|---|---|---|---|---|---|

## Uso permitido

- analizar requisitos;
- proponer casos límite;
- explicar errores;
- revisar una consulta;
- generar un borrador de prueba;
- comparar código con criterios;
- mejorar documentación;
- detectar duplicación.

## Uso no aceptable

- subir datos privados;
- copiar secretos;
- aceptar código sin leer;
- solicitar el proyecto completo y entregarlo sin comprensión;
- desactivar controles de seguridad;
- inventar pruebas no ejecutadas;
- ocultar qué partes fueron asistidas.

## Preguntas de verificación

Antes de integrar una propuesta responde:

```text
¿Qué problema resuelve?
¿Qué archivos afecta?
¿Qué supuesto realiza?
¿Qué riesgo introduce?
¿Qué documentación lo respalda?
¿Qué prueba lo verifica?
¿Podría explicarlo sin la IA?
```

---

# 36. Rúbrica final de evaluación

La calificación del Módulo 7 corresponde completamente al Proyecto Final Integrador.

| Criterio | Puntos |
|---|---:|
| Análisis, requisitos y trazabilidad | 8 |
| Modelo de datos e integridad | 10 |
| Usuarios, roles y seguridad | 10 |
| Clientes, proveedores y productos | 8 |
| Inventario y movimientos | 10 |
| Ventas, cálculos y transacciones | 15 |
| Panel, reportes y exportaciones | 8 |
| Arquitectura y calidad del código | 8 |
| Pruebas y manejo de errores | 8 |
| Diseño, usabilidad y accesibilidad básica | 4 |
| Despliegue y operación | 4 |
| Documentación, Git y portafolio | 3 |
| Solicitud de cambio | 2 |
| Defensa de autoría y uso de IA | 2 |
| **Total** | **100** |

## Descriptores

### Excelente

Cumple el requisito, cubre errores, conserva integridad, tiene pruebas y puede explicarse.

### Aceptable

Cumple el flujo principal con detalles menores que no comprometen seguridad ni datos.

### Insuficiente

Está incompleto, contradice reglas, carece de evidencia o depende de comportamiento manual no controlado.

---

# 37. Condiciones críticas de rechazo

El proyecto no se aprueba, aunque alcance 80 puntos, si presenta cualquiera de estas condiciones:

- secreto real en código, historial o entrega;
- `DEBUG=True` en la aplicación pública;
- acceso sensible sin autorización;
- contraseña almacenada o comparada manualmente;
- venta parcial después de un error;
- inventario negativo por un flujo permitido;
- doble descuento o devolución de inventario;
- reportes con resultados empresariales incorrectos;
- datos personales reales sin autorización;
- aplicación o repositorio inaccesible para revisión;
- imposibilidad de instalar desde las instrucciones;
- ausencia de pruebas críticas;
- código principal que no puedes explicar;
- evidencia o resultados de pruebas falsificados;
- proyecto generado por IA sin comprensión demostrable;
- cambio del instructor no implementado ni justificado.

---

# 38. Requisitos de aprobación

Para aprobar debes:

- obtener al menos **80 de 100 puntos**;
- aprobar el prototipo del flujo crítico;
- entregar todos los archivos obligatorios;
- eliminar condiciones críticas;
- completar la solicitud de cambio;
- aprobar la defensa de autoría;
- realizar las correcciones solicitadas;
- mantener la aplicación disponible durante la revisión.

La primera entrega puede recibir observaciones. El proyecto solo se considera aprobado después de la confirmación del instructor.

---

# 39. Punto de entrega único

Utiliza un único punto de entrega para el Módulo 7.

Identificación:

```text
Proyecto Final Django — Nombre completo — COA Gestión Empresarial Web
```

Adjunta:

1. `COA_DJANGO_PROYECTO_FINAL_Nombre_Apellido.zip`;
2. enlace del repositorio;
3. enlace de la aplicación;
4. credenciales de demostración por el canal autorizado;
5. resultado de pruebas;
6. documentos y diagramas;
7. presentación del proyecto;
8. bitácora de IA;
9. evidencia del cambio;
10. evidencia de defensa cuando sea solicitada.

Comprueba todos los enlaces en una sesión privada antes de enviar.

[Entregar el Proyecto Final](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 40. Proceso de revisión

```text
Entrega inicial
      ↓
Validación de accesos y archivos
      ↓
Revisión funcional y técnica
      ↓
Solicitud de cambio y defensa
      ↓
¿Existen observaciones?
   ├── Sí → corrección → nueva revisión
   └── No → proyecto aprobado
                   ↓
           Ruta Python completada
```

## Formato de corrección

| Observación | Causa | Cambio | Prueba | Commit | Evidencia |
|---|---|---|---|---|---|

No respondas “corregido” sin explicar cómo se verificó.

---

# 41. Errores comunes

## Error 1. Agregar funciones para impresionar

Se incorporan pagos, API o notificaciones mientras la venta principal todavía puede dejar datos inconsistentes.

**Corrección:** congela alcance y resuelve primero condiciones críticas.

## Error 2. Escribir requisitos después del código

El documento termina describiendo lo que casualmente se construyó.

**Corrección:** define comportamiento y criterios antes de cerrar la implementación.

## Error 3. Confundir rol con una condición visual

El menú se oculta, pero la URL sigue disponible.

**Corrección:** grupos, permisos en servidor y pruebas directas.

## Error 4. Permitir editar stock

Una edición simple destruye trazabilidad.

**Corrección:** toda variación ocurre mediante un movimiento con responsable y motivo.

## Error 5. Recalcular precios históricos

Una venta antigua cambia cuando cambia el precio actual del producto.

**Corrección:** conserva el precio aplicado en `DetalleVenta`.

## Error 6. Cancelar cambiando solo el estado

El inventario permanece descontado o se devuelve dos veces.

**Corrección:** servicio transaccional, transición válida y pruebas de idempotencia.

## Error 7. Usar borrado físico para todo

Se pierde el historial que explica ventas y movimientos.

**Corrección:** estados, protección de relaciones y política documentada.

## Error 8. Probar solo manualmente

Una corrección rompe otra regla sin ser detectada.

**Corrección:** automatiza procesos críticos y conserva pruebas exploratorias.

## Error 9. Perseguir cobertura sin significado

Existen muchas pruebas que no comprueban riesgos empresariales.

**Corrección:** conecta cada caso crítico con requisito y regla.

## Error 10. Preparar datos aleatorios sin historia

No puedes demostrar totales conocidos ni errores límite.

**Corrección:** crea un escenario de demostración intencional.

## Error 11. Documentar credenciales en público

Una cuenta administrativa queda expuesta.

**Corrección:** entrega credenciales temporales por el canal autorizado y limita permisos.

## Error 12. Modificar producción durante la defensa

Una corrección improvisada rompe la versión revisada.

**Corrección:** implementa el cambio en una rama, prueba y despliega de forma controlada.

## Error 13. Copiar una arquitectura completa de IA

El proyecto gana capas y dependencias que no puedes explicar.

**Corrección:** solicita cambios pequeños, compara con el diseño y elimina lo innecesario.

## Error 14. Presentar solo tecnologías

La audiencia no entiende qué problema resolviste.

**Corrección:** explica problema, flujo, decisión, evidencia y resultado.

## Error 15. Prometer uso empresarial inmediato

La demo no tiene contrato de respaldo, soporte, privacidad ni disponibilidad.

**Corrección:** presenta limitaciones y requisitos para una operación real.

---

# Recomendaciones del instructor

1. **Demuestra primero la venta completa.** Es el proceso que conecta más conocimientos de la ruta.
2. **Usa números que puedas verificar a mano.** Un reporte convincente parte de datos conocidos.
3. **Mantén commits pequeños y descriptivos.** Facilitan la solicitud de cambio y la defensa.
4. **Crea una prueba de regresión por cada error importante.** La corrección no debe depender de memoria.
5. **Ensaya con cada rol.** Una sesión de administrador puede ocultar fallos de permisos.
6. **Prueba una instalación limpia antes de entregar.** Tu computadora puede tener dependencias no documentadas.
7. **No cambies la versión desplegada minutos antes de la revisión.** Etiqueta y conserva una versión estable.
8. **Explica las limitaciones con seguridad.** Reconocer el alcance demuestra criterio profesional.
9. **Si una propuesta de IA parece demasiado extensa, divídela.** Integra solo lo que puedas probar y explicar.
10. **Prioriza la confiabilidad sobre la cantidad de funciones.** Un sistema pequeño y correcto es mejor evidencia que uno enorme e inestable.

---

# 42. Videos recomendados

Estos videos sirven como repaso para organizar y presentar el proyecto. La documentación oficial es la referencia técnica para Django 5.2.

## 1. Historias de usuario

**Canal:** Jorge Ruiz  
**Tema:** estructura y criterios de historias de usuario  
[Ver video en YouTube](https://www.youtube.com/watch?v=FJuq_lrM5Cc)

Utilízalo para redactar necesidades desde el punto de vista del rol. No sustituye los criterios de aceptación.

## 2. Diagrama entidad-relación

**Canal:** May Code  
**Tema:** entidades, atributos, relaciones y cardinalidad  
[Ver video en YouTube](https://www.youtube.com/watch?v=6P1PZY3E4gw)

Contrasta el diagrama con tus modelos y migraciones reales.

## 3. Diseñar casos de prueba

**Canal:** Catch Exception Canal  
**Tema:** selección de casos de prueba útiles  
[Ver video en YouTube](https://www.youtube.com/watch?v=_1YOV8OEglI)

El recurso explica conceptos generales. Implementa los casos con las herramientas de pruebas de Django aprendidas en el Módulo 6.

## 4. Variables de entorno en Django

**Canal:** Código para Principiantes  
**Tema:** separar secretos y configuración  
[Ver video en YouTube](https://www.youtube.com/watch?v=bJdASa5-Fw0)

Úsalo como repaso. La configuración final debe seguir la documentación de Django 5.2 y del proveedor actual.

## 5. Despliegue de Django en Render

**Canal:** XAVII07  
**Tema:** recorrido de publicación  
[Ver video en YouTube](https://www.youtube.com/watch?v=Bfu-HqcRoRs)

La interfaz, los paquetes y las condiciones del plan pueden cambiar. Verifica cada paso con la guía oficial.

## 6. OpenPyXL

**Canal:** MATHS AND CODES  
**Tema:** creación y escritura de archivos Excel con Python  
[Ver video en YouTube](https://www.youtube.com/watch?v=RzI8n9HHbts)

En el proyecto reutilizarás estos fundamentos dentro de una respuesta protegida de Django.

---

# 43. Documentación oficial y recursos confiables

## Django

- [Documentación de Django 5.2](https://docs.djangoproject.com/en/5.2/)
- [Modelos](https://docs.djangoproject.com/en/5.2/topics/db/models/)
- [Restricciones de modelos](https://docs.djangoproject.com/en/5.2/ref/models/constraints/)
- [Consultas del ORM](https://docs.djangoproject.com/en/5.2/topics/db/queries/)
- [Agregaciones](https://docs.djangoproject.com/en/5.2/topics/db/aggregation/)
- [Optimización de base de datos](https://docs.djangoproject.com/en/5.2/topics/db/optimization/)
- [Transacciones](https://docs.djangoproject.com/en/5.2/topics/db/transactions/)
- [Formularios](https://docs.djangoproject.com/en/5.2/topics/forms/)
- [Formsets](https://docs.djangoproject.com/en/5.2/topics/forms/formsets/)
- [Autenticación](https://docs.djangoproject.com/en/5.2/topics/auth/)
- [Permisos](https://docs.djangoproject.com/en/5.2/topics/auth/default/#permissions-and-authorization)
- [Vistas de autenticación](https://docs.djangoproject.com/en/5.2/topics/auth/default/#module-django.contrib.auth.views)
- [Panel administrativo](https://docs.djangoproject.com/en/5.2/ref/contrib/admin/)
- [Comandos propios](https://docs.djangoproject.com/en/5.2/howto/custom-management-commands/)
- [Pruebas](https://docs.djangoproject.com/en/5.2/topics/testing/overview/)
- [Seguridad](https://docs.djangoproject.com/en/5.2/topics/security/)
- [Checklist de despliegue](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)

## PostgreSQL y datos

- [Restricciones en PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Control de concurrencia](https://www.postgresql.org/docs/current/mvcc.html)
- [Transacciones](https://www.postgresql.org/docs/current/tutorial-transactions.html)

## GitHub y documentación

- [Acerca de los README](https://docs.github.com/es/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Acerca de las versiones de GitHub](https://docs.github.com/es/repositories/releasing-projects-on-github/about-releases)
- [Sintaxis básica de Markdown](https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

## Despliegue

- [Desplegar Django en Render](https://render.com/docs/deploy-django)
- [Servicios web de Render](https://render.com/docs/web-services)
- [PostgreSQL en Render](https://render.com/docs/postgresql)
- [Limitaciones de recursos gratuitos](https://render.com/docs/free)
- [WhiteNoise para Django](https://whitenoise.readthedocs.io/en/stable/django.html)

## Seguridad y accesibilidad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Introducción a la accesibilidad web — W3C](https://www.w3.org/WAI/fundamentals/accessibility-intro/)
- [Lista rápida de accesibilidad — W3C](https://www.w3.org/WAI/test-evaluate/preliminary/)

## Herramientas gratuitas

- [diagrams.net](https://app.diagrams.net/) — diagramas de arquitectura y flujo.
- [dbdiagram.io](https://dbdiagram.io/) — diagrama relacional.
- [GitHub](https://github.com/) — repositorio y versiones.
- [Render](https://render.com/) — demostración desplegada según disponibilidad del plan.

---

# 44. Material complementario

Este módulo no necesita un PDF que repita la página. Utiliza plantillas editables.

## Plantilla de requisito

```text
ID:
Nombre:
Actor:
Descripción:
Precondiciones:
Flujo principal:
Excepciones:
Resultado:
Criterios de aceptación:
Pruebas:
```

## Plantilla de caso de prueba

| ID | Requisito | Datos iniciales | Acción | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|---|

## Plantilla de decisión técnica

```text
Decisión:
Contexto:
Opciones:
Opción elegida:
Razón:
Consecuencias:
Prueba o evidencia:
```

## Plantilla de hallazgo

```text
Identificador:
Severidad:
Pasos para reproducir:
Resultado actual:
Resultado esperado:
Causa:
Corrección:
Prueba de regresión:
Commit:
```

## Plantilla de cambio

```text
Solicitud:
Comprensión del requisito:
Impacto:
Archivos afectados:
Riesgos:
Prueba añadida:
Implementación:
Resultado:
Commit:
```

## Checklist de demostración

```text
[ ] versión etiquetada
[ ] aplicación disponible
[ ] usuarios de prueba válidos
[ ] datos preparados
[ ] flujo ensayado
[ ] reportes descargables
[ ] pruebas ejecutadas
[ ] secretos fuera de pantalla
[ ] limitaciones preparadas
[ ] repositorio accesible
```

---

# 45. Glosario

**Actor:** persona o rol que interactúa con el sistema.

**Alcance:** conjunto explícito de funciones incluidas y excluidas.

**Criterio de aceptación:** condición observable que determina si un requisito está cumplido.

**Defensa de autoría:** demostración de que comprendes y puedes modificar el proyecto entregado.

**Definition of Done:** condiciones que debe cumplir una función antes de considerarse terminada.

**Dato histórico:** valor que debe conservarse para interpretar una operación pasada.

**Idempotencia:** propiedad por la que repetir una operación controlada no duplica su efecto.

**Integridad:** garantía de que los datos respetan reglas y relaciones.

**Matriz de permisos:** mapa de funciones disponibles para cada rol.

**Migración de datos:** cambio versionado que transforma datos existentes además del esquema.

**Prueba de humo:** recorrido breve que confirma las funciones esenciales después de publicar.

**Requisito funcional:** comportamiento que el sistema debe ofrecer.

**Requisito no funcional:** condición de calidad, seguridad, rendimiento u operación.

**Regla empresarial:** restricción o decisión propia del proceso de la organización.

**Regresión:** error que reaparece o función que se rompe después de un cambio.

**Release:** versión identificada y preparada para entrega.

**Rollback:** reversión de todos los cambios de una transacción fallida.

**Solicitud de cambio:** modificación controlada realizada después de una versión inicial.

**Trazabilidad:** vínculo entre requisito, regla, implementación, prueba y evidencia.

**Versión estable:** versión que cumple criterios conocidos y no contiene fallos críticos abiertos.

---

# 46. Resumen final

En este módulo integraste toda la Ruta Python en un producto empresarial completo.

Demostraste:

- análisis lógico;
- dominio de Python;
- programación orientada a objetos;
- arquitectura de software;
- diseño relacional;
- SQL y ORM;
- desarrollo web con Django;
- autenticación y permisos;
- transacciones;
- automatización de archivos;
- pruebas;
- seguridad;
- documentación;
- Git;
- despliegue;
- uso responsable de IA.

El resultado no es solamente una colección de pantallas:

```text
Necesidad empresarial
        ↓
Requisitos y reglas
        ↓
Datos y arquitectura
        ↓
Aplicación funcional
        ↓
Pruebas y seguridad
        ↓
Despliegue y documentación
        ↓
Defensa y cambio profesional
```

---

# 47. Checklist final del estudiante

## Alcance y requisitos

- [ ] El problema está definido.
- [ ] El alcance está congelado.
- [ ] Las historias tienen criterios.
- [ ] Las veinte reglas están implementadas o justificadas.
- [ ] Existe trazabilidad.

## Funcionalidad

- [ ] Los cuatro roles funcionan.
- [ ] Clientes y proveedores están completos.
- [ ] Productos e inventario conservan historial.
- [ ] La venta es transaccional.
- [ ] La cancelación devuelve stock una vez.
- [ ] Panel y reportes concuerdan.
- [ ] Admin está configurado y protegido.

## Calidad

- [ ] Existen al menos 30 pruebas relevantes.
- [ ] El flujo crítico está aprobado.
- [ ] Las migraciones funcionan desde cero.
- [ ] La carga demo no duplica.
- [ ] No existe N+1 evidente.
- [ ] Los errores tienen respuesta segura.

## Seguridad

- [ ] No hay secretos.
- [ ] Los permisos se validan en servidor.
- [ ] No hay datos reales.
- [ ] La configuración pública usa `DEBUG=False`.
- [ ] Las exportaciones están protegidas.
- [ ] La multimedia tiene estrategia correcta.

## Despliegue

- [ ] PostgreSQL está conectado.
- [ ] HTTPS funciona.
- [ ] Static funciona.
- [ ] La ruta de salud responde.
- [ ] Los datos sobreviven un despliegue.
- [ ] Las pruebas de humo terminan correctamente.

## Documentación

- [ ] README completo.
- [ ] Manual de instalación probado.
- [ ] Manual de usuario.
- [ ] Diagramas actualizados.
- [ ] Plan de pruebas.
- [ ] Limitaciones conocidas.
- [ ] Bitácora de IA.

## Entrega y defensa

- [ ] ZIP con nombre correcto.
- [ ] Enlaces accesibles.
- [ ] Credenciales entregadas de forma segura.
- [ ] Etiqueta `v1.0.0` correcta.
- [ ] Cambio del instructor implementado.
- [ ] Guion ensayado.
- [ ] Puedes explicar el código crítico.

---

# Cierre de la Ruta Python

Al aprobar el proyecto final habrás completado la formación técnica de la Ruta Python de COA.

El siguiente paso es el **Programa de Experiencia Profesional COA**, donde aplicarás estas competencias en proyectos reales para empresas y emprendimientos.

```text
Curso completado
      ↓
Proyecto final aprobado
      ↓
Correcciones terminadas
      ↓
Defensa aprobada
      ↓
Preparación para Experiencia Profesional COA
```

Lleva al programa:

- disciplina para analizar antes de programar;
- capacidad para leer código existente;
- respeto por datos y permisos;
- hábito de probar;
- comunicación clara;
- uso responsable de IA;
- disposición para recibir y aplicar retroalimentación.

La meta final de la ruta no era memorizar Python ni Django. Era aprender a convertir problemas reales en software confiable que puedas comprender, mantener y mejorar.
