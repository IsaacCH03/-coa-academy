# COA — Cursos Online Avanzados

## SQL y Bases de Datos Relacionales

# Módulo 3. Gestión segura de datos y transacciones

**Duración estimada:** 3 horas y 30 minutos  
**Nivel:** intermedio inicial  
**Modalidad:** autodidacta y práctica  
**Motor de base de datos:** SQLite  
**Herramienta principal:** DB Browser for SQLite  
**Resultado principal:** un sistema de inventario capaz de registrar, corregir y eliminar datos mediante operaciones controladas y transacciones

---

## Bienvenida

Una base de datos correctamente diseñada todavía necesita operaciones seguras. Los productos cambian de precio, los pacientes actualizan su teléfono, las existencias aumentan y disminuyen, y algunos registros deben retirarse.

Modificar datos es una tarea de mayor riesgo que consultarlos. Una consulta incorrecta puede mostrar un resultado equivocado; una actualización incorrecta puede alterar miles de filas. Una eliminación ejecutada sin cuidado puede destruir información que no se puede reconstruir.

En este módulo aprenderás a trabajar con datos de forma controlada. Antes de ejecutar un cambio, comprobarás qué filas serán afectadas. Cuando varias instrucciones formen una sola operación, las protegerás mediante una transacción.

> **Principio del módulo:** una modificación profesional se prepara, se comprueba, se ejecuta y se verifica. Nunca se lanza a ciegas.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Explicar el ciclo CRUD y diferenciar sus cuatro operaciones.
- Insertar uno o varios registros mediante `INSERT`.
- Utilizar listas explícitas de columnas en las inserciones.
- Aplicar correctamente valores predeterminados y `NULL`.
- Interpretar errores producidos por restricciones.
- Modificar una o varias columnas mediante `UPDATE`.
- Utilizar `WHERE` para dirigir un cambio a filas concretas.
- Eliminar registros específicos mediante `DELETE`.
- Diferenciar `DELETE` de `DROP TABLE`.
- Comprobar el alcance de una modificación antes y después de ejecutarla.
- Respetar el orden de las operaciones cuando existen claves foráneas.
- Explicar el propósito de una transacción.
- Utilizar `BEGIN`, `COMMIT` y `ROLLBACK`.
- Probar operaciones peligrosas sin conservar los cambios.
- Agrupar varias instrucciones como una unidad indivisible.
- Recuperar el estado anterior cuando una operación no debe confirmarse.
- Preparar scripts reproducibles de carga y mantenimiento.
- Crear evidencias claras de una operación confirmada y una revertida.

---

## Producto que construirás

El proyecto principal será un inventario con historial de movimientos:

```text
inventario.db
├── categorias
├── productos
└── movimientos
```

```text
categorias ||────o{ productos ||────o{ movimientos
```

La tabla `productos` conservará la existencia actual. La tabla `movimientos` registrará por qué cambió esa existencia.

Una entrada o salida de inventario requerirá dos cambios relacionados:

```text
1. Actualizar la existencia del producto.
2. Registrar el movimiento.
```

Si una de las dos instrucciones falla, ninguna debe conservarse. Esa necesidad se resolverá mediante una transacción.

---

## Ruta de trabajo y distribución del tiempo

| Actividad | Tiempo aproximado |
|---|---:|
| Explicaciones y demostraciones | 35 minutos |
| Prácticas guiadas | 40 minutos |
| Ejercicios individuales y corrección de errores | 30 minutos |
| Mini proyecto: caja diaria de una cafetería | 20 minutos |
| Proyecto del módulo: inventario y movimientos de existencias | 70 minutos |
| Evaluación y preparación de la entrega | 15 minutos |
| **Total** | **3 horas y 30 minutos** |

Los tiempos son orientativos. Una práctica de modificación puede repetirse en una copia de la base hasta comprender exactamente qué ocurrió.

---

# 1. El ciclo CRUD

## 1.1 Los datos tienen un ciclo de vida

Un registro no permanece necesariamente igual desde que se crea.

Ejemplo de un producto:

```text
Se registra
    ↓
Se consulta
    ↓
Se corrige o actualiza
    ↓
Puede retirarse
```

Las cuatro operaciones se conocen como CRUD:

| Letra | Palabra | Operación SQL principal | Propósito |
|---|---|---|---|
| C | Create | `INSERT` | Crear un registro |
| R | Read | `SELECT` | Leer registros |
| U | Update | `UPDATE` | Modificar registros |
| D | Delete | `DELETE` | Eliminar registros |

En CRUD, “Create” significa crear datos mediante `INSERT`. No debe confundirse con `CREATE TABLE`, que crea una estructura.

## 1.2 CRUD no define por sí solo un procedimiento seguro

Saber la instrucción no basta. Antes de cambiar datos debes responder:

1. ¿Cuál es la base correcta?
2. ¿Cuál es la tabla correcta?
3. ¿Qué fila o filas deben cambiar?
4. ¿Cuál debe ser el estado final?
5. ¿Qué reglas podrían rechazar el cambio?
6. ¿Hay otras tablas relacionadas?
7. ¿Cómo se comprobará el resultado?
8. ¿Cómo se recuperará el estado anterior si algo sale mal?

## 1.3 Escenario de práctica

Durante las demostraciones utilizarás:

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL CHECK (precio > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    descripcion TEXT,
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

Carga inicial:

```sql
INSERT INTO categorias (id, nombre)
VALUES
    (1, 'Papelería'),
    (2, 'Tecnología'),
    (3, 'Accesorios');

INSERT INTO productos (
    id,
    codigo,
    nombre,
    precio,
    stock,
    descripcion,
    categoria_id
) VALUES
    (1, 'PAP-001', 'Cuaderno profesional', 4.50, 20, 'Cuaderno de 100 páginas', 1),
    (2, 'TEC-010', 'Memoria USB 32 GB', 9.90, 12, NULL, 2),
    (3, 'ACC-006', 'Soporte para teléfono', 7.25, 8, 'Soporte ajustable', 3),
    (4, 'PAP-014', 'Marcador negro', 1.20, 35, NULL, 1);
```

Conserva una copia de esta base para repetir las prácticas.

---

# 2. Insertar datos profesionalmente

## 2.1 Inserción de una fila

```sql
INSERT INTO productos (
    id,
    codigo,
    nombre,
    precio,
    stock,
    descripcion,
    categoria_id
) VALUES (
    5,
    'TEC-021',
    'Teclado compacto',
    24.90,
    6,
    'Teclado con conexión USB',
    2
);
```

La lista de columnas y la lista de valores deben tener la misma cantidad y el mismo orden.

## 2.2 Por qué debes escribir las columnas

Evita:

```sql
INSERT INTO productos
VALUES (5, 'TEC-021', 'Teclado compacto', 24.90, 6, 1, NULL, 2);
```

Aunque pueda funcionar si conoces exactamente el orden del esquema, resulta difícil de leer y puede romperse si la estructura cambia.

Prefiere:

```sql
INSERT INTO productos (
    id,
    codigo,
    nombre,
    precio,
    stock,
    categoria_id
) VALUES (
    5,
    'TEC-021',
    'Teclado compacto',
    24.90,
    6,
    2
);
```

Las columnas omitidas utilizarán su valor predeterminado o `NULL` cuando la estructura lo permita.

En este caso:

- `activo` recibe 1 por `DEFAULT`.
- `descripcion` recibe `NULL`.

## 2.3 Inserción de varias filas

```sql
INSERT INTO productos (
    id,
    codigo,
    nombre,
    precio,
    stock,
    categoria_id
) VALUES
    (6, 'PAP-020', 'Carpeta azul', 2.10, 18, 1),
    (7, 'ACC-011', 'Cable organizador', 3.75, 25, 3),
    (8, 'TEC-030', 'Ratón inalámbrico', 16.50, 10, 2);
```

La inserción múltiple es útil para datos iniciales. Si una fila viola una restricción, la instrucción puede fallar; revisa todo el conjunto antes de ejecutarlo.

## 2.4 Valores predeterminados

Un valor predeterminado se utiliza cuando la columna se omite:

```sql
activo INTEGER NOT NULL DEFAULT 1
```

```sql
INSERT INTO productos (
    id,
    codigo,
    nombre,
    precio,
    categoria_id
) VALUES (
    9,
    'PAP-025',
    'Regla de 30 cm',
    1.10,
    1
);
```

Resultado esperado:

```text
stock  = 0
activo = 1
descripcion = NULL
```

`DEFAULT` no se utiliza si proporcionas explícitamente otro valor.

## 2.5 `NULL` debe representar una ausencia legítima

Utiliza `NULL` si una descripción todavía no existe:

```sql
descripcion = NULL
```

No utilices `NULL` para evitar investigar datos obligatorios como código, nombre o categoría.

## 2.6 Orden de inserción con claves foráneas

```text
1. Insertar categoría.
2. Insertar producto que la referencia.
```

Una fila hija no puede hacer referencia a una fila padre inexistente.

Incorrecto:

```sql
INSERT INTO productos (
    id,
    codigo,
    nombre,
    precio,
    stock,
    categoria_id
) VALUES (
    10,
    'MOB-001',
    'Silla ergonómica',
    85.00,
    2,
    99
);
```

Si no existe la categoría 99 y las claves foráneas están activas, SQLite rechaza la inserción.

## 2.7 Los errores de integridad protegen los datos

Posibles mensajes:

```text
UNIQUE constraint failed
NOT NULL constraint failed
CHECK constraint failed
FOREIGN KEY constraint failed
```

No intentes “resolver” el error desactivando la restricción. Busca la causa:

- ¿Se repitió un código?
- ¿Falta un valor obligatorio?
- ¿El precio es inválido?
- ¿La categoría no existe?

### Práctica guiada 1 — Inserciones válidas e inválidas

1. Crea una copia de la base de práctica.
2. Inserta el producto con `id` 5.
3. Comprueba los valores predeterminados.
4. Intenta repetir `TEC-021` con otro identificador.
5. Intenta insertar un precio negativo.
6. Intenta utilizar una categoría inexistente.
7. Registra qué restricción rechazó cada caso.
8. Conserva solamente los datos válidos.

---

# 3. Modificar datos con `UPDATE`

## 3.1 Anatomía de una actualización

```sql
UPDATE productos
SET precio = 5.25
WHERE id = 1;
```

Lectura:

```text
En la tabla productos,
establece precio en 5.25,
solamente para la fila cuyo id es 1.
```

## 3.2 `WHERE` define qué filas cambian

Sin `WHERE`:

```sql
UPDATE productos
SET precio = 5.25;
```

La instrucción modifica el precio de todas las filas.

En este módulo no ejecutarás actualizaciones sin `WHERE` sobre datos del proyecto.

## 3.3 Procedimiento seguro de actualización

### Paso 1. Describe el cambio

> Cambiar el precio del producto con `id` 1 de 4.50 a 5.25.

### Paso 2. Consulta la fila objetivo

```sql
SELECT id, codigo, nombre, precio
FROM productos
WHERE id = 1;
```

### Paso 3. Comprueba el identificador

Verifica que el resultado corresponda al producto correcto.

### Paso 4. Ejecuta el cambio

```sql
UPDATE productos
SET precio = 5.25
WHERE id = 1;
```

### Paso 5. Vuelve a consultar

```sql
SELECT id, codigo, nombre, precio
FROM productos
WHERE id = 1;
```

### Paso 6. Comprueba otras filas

Revisa la tabla y confirma que no cambió otro producto.

```text
Consultar → comprobar → actualizar → volver a consultar
```

## 3.4 Modificar varias columnas

```sql
UPDATE productos
SET
    precio = 8.50,
    descripcion = 'Soporte metálico ajustable'
WHERE id = 3;
```

Las asignaciones se separan mediante comas.

## 3.5 Utilizar el valor actual

```sql
UPDATE productos
SET stock = stock + 5
WHERE id = 2;
```

La expresión toma el valor actual y le suma cinco.

Si el stock era 12, el resultado será 17.

Para una salida:

```sql
UPDATE productos
SET stock = stock - 3
WHERE id = 2;
```

La restricción `CHECK (stock >= 0)` evita una existencia negativa, pero no sustituye la revisión previa.

## 3.6 Actualizar a `NULL`

```sql
UPDATE productos
SET descripcion = NULL
WHERE id = 3;
```

Solo es válido si la columna permite `NULL` y la ausencia representa una situación real.

## 3.7 Una condición puede afectar cero filas

```sql
UPDATE productos
SET precio = 12.00
WHERE id = 999;
```

No siempre aparece un error. Si no existe la fila 999, no se actualiza ninguna fila.

Por eso debes consultar y comprobar antes y después.

## 3.8 Actualizar una clave relacionada

Modificar claves primarias no debe ser una operación habitual. Si una relación declara `ON UPDATE CASCADE`, el cambio puede propagarse. Si utiliza `RESTRICT`, puede rechazarse.

Los datos descriptivos se actualizan con frecuencia. Las identidades deberían permanecer estables.

### Práctica guiada 2 — Corregir un producto

Situación:

> El producto `ACC-006` conserva el mismo código, pero su nombre correcto es “Soporte metálico para teléfono”, su precio es 8.50 y la descripción anterior ya no es válida.

Realiza:

1. Consulta la fila por su identificador.
2. Confirma el código.
3. Actualiza nombre y precio.
4. Coloca `NULL` en descripción.
5. Consulta nuevamente.
6. Explica por qué el código no fue modificado.

---

# 4. Eliminar datos con `DELETE`

## 4.1 Anatomía de una eliminación

```sql
DELETE FROM productos
WHERE id = 8;
```

Elimina la fila cuyo identificador es 8.

## 4.2 El peligro de omitir `WHERE`

```sql
DELETE FROM productos;
```

La instrucción elimina todas las filas de la tabla. La estructura permanece, pero los datos desaparecen.

No la ejecutes sobre el proyecto.

## 4.3 Procedimiento seguro de eliminación

### Paso 1. Justifica la eliminación

No elimines un registro solamente porque “ya no se usa”. Puede existir un historial relacionado.

### Paso 2. Consulta la fila

```sql
SELECT id, codigo, nombre
FROM productos
WHERE id = 8;
```

### Paso 3. Comprueba relaciones

Si existen movimientos del producto, la clave foránea puede impedir la eliminación.

### Paso 4. Ejecuta dentro de una transacción

Primero prueba el efecto con `ROLLBACK`.

### Paso 5. Verifica ausencia y estado de las relaciones

```sql
SELECT id, codigo, nombre
FROM productos
WHERE id = 8;
```

## 4.4 `DELETE` no es `DROP TABLE`

| Instrucción | Elimina | Conserva |
|---|---|---|
| `DELETE FROM productos WHERE id = 8` | Una o varias filas | Tabla y demás filas |
| `DELETE FROM productos` | Todas las filas | Tabla vacía |
| `DROP TABLE productos` | Tabla y sus filas | Nada de esa estructura |

`DROP TABLE` modifica el esquema. `DELETE` modifica los datos.

## 4.5 Eliminación lógica

Algunos sistemas no borran físicamente un producto. Cambian su estado:

```sql
UPDATE productos
SET activo = 0
WHERE id = 8;
```

Esto se conoce como eliminación lógica o desactivación. Permite conservar historial.

No siempre es la solución correcta. Si la información no necesita conservarse y no tiene dependencias, una eliminación física puede ser válida.

## 4.6 Las claves foráneas pueden impedir eliminaciones

Si un producto tiene movimientos y la relación utiliza `ON DELETE RESTRICT`, SQLite rechazará la eliminación.

Ese error protege el historial.

No desactives las claves foráneas para forzar el borrado. Decide si corresponde:

- Conservar y desactivar el producto.
- Eliminar primero datos dependientes autorizados.
- Cambiar la regla del modelo mediante una migración planificada.

### Práctica guiada 3 — Eliminar o desactivar

Para cada caso, decide entre eliminación física, desactivación o conservación obligatoria:

1. Producto de prueba creado por error y sin movimientos.
2. Producto real retirado de venta con historial de movimientos.
3. Categoría sin productos creada con un nombre equivocado.
4. Paciente con citas históricas.
5. Registro duplicado que nunca fue referenciado.

Justifica cada respuesta antes de escribir SQL.

---

# 5. Transacciones: todo o nada

## 5.1 El problema de las operaciones parciales

Una salida de inventario necesita:

1. Reducir el stock.
2. Registrar el movimiento.

Supón que la primera instrucción funciona y la segunda falla:

```text
Stock reducido       ✓
Movimiento registrado ✗
```

El inventario queda sin explicación. La operación está incompleta.

Una transacción agrupa instrucciones para tratarlas como una unidad.

```text
BEGIN
  instrucción 1
  instrucción 2
  verificación
COMMIT   → conservar todo

o

ROLLBACK → deshacer todo
```

## 5.2 Analogía: una transferencia bancaria

Transferir dinero implica restar de una cuenta y sumar en otra. No sería aceptable conservar solamente una mitad.

```text
Cuenta A: -100
Cuenta B: +100
```

Ambos cambios deben confirmarse juntos o deshacerse juntos.

## 5.3 `BEGIN`

```sql
BEGIN TRANSACTION;
```

Inicia una transacción explícita.

## 5.4 `COMMIT`

```sql
COMMIT;
```

Confirma los cambios realizados desde `BEGIN`.

## 5.5 `ROLLBACK`

```sql
ROLLBACK;
```

Deshace los cambios no confirmados de la transacción.

## 5.6 Primera prueba con `ROLLBACK`

Estado inicial:

```sql
SELECT id, nombre, stock
FROM productos
WHERE id = 2;
```

Transacción de prueba:

```sql
BEGIN TRANSACTION;

UPDATE productos
SET stock = stock - 3
WHERE id = 2;

SELECT id, nombre, stock
FROM productos
WHERE id = 2;

ROLLBACK;
```

Consulta final:

```sql
SELECT id, nombre, stock
FROM productos
WHERE id = 2;
```

Durante la transacción observarás el valor reducido. Después de `ROLLBACK`, el stock regresará al valor inicial.

## 5.7 Operación confirmada

```sql
BEGIN TRANSACTION;

UPDATE productos
SET stock = stock + 5
WHERE id = 2;

SELECT id, nombre, stock
FROM productos
WHERE id = 2;

COMMIT;
```

Después de `COMMIT`, el nuevo valor permanece.

## 5.8 Varias instrucciones en una transacción

Primero crea la tabla de movimientos en una base de práctica:

```sql
CREATE TABLE movimientos (
    id INTEGER PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    tipo TEXT NOT NULL
        CHECK (tipo IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    stock_anterior INTEGER NOT NULL CHECK (stock_anterior >= 0),
    stock_nuevo INTEGER NOT NULL CHECK (stock_nuevo >= 0),
    fecha TEXT NOT NULL,
    motivo TEXT NOT NULL,
    FOREIGN KEY (producto_id)
        REFERENCES productos(id)
        ON DELETE RESTRICT
);
```

Salida de tres unidades del producto 2, cuyo stock inicial es 12:

```sql
BEGIN TRANSACTION;

UPDATE productos
SET stock = stock - 3
WHERE id = 2;

INSERT INTO movimientos (
    id,
    producto_id,
    tipo,
    cantidad,
    stock_anterior,
    stock_nuevo,
    fecha,
    motivo
) VALUES (
    1,
    2,
    'SALIDA',
    3,
    12,
    9,
    '2026-08-02 10:30',
    'Entrega de pedido interno'
);

SELECT id, nombre, stock
FROM productos
WHERE id = 2;

SELECT *
FROM movimientos
WHERE id = 1;

COMMIT;
```

Las dos instrucciones se conservan juntas.

## 5.9 Qué hacer si algo falla

1. No ejecutes `COMMIT`.
2. Lee el mensaje de error.
3. Ejecuta `ROLLBACK` si la transacción continúa abierta.
4. Consulta el estado final.
5. Corrige la causa.
6. Inicia una transacción nueva.

No intentes continuar agregando instrucciones al azar.

## 5.10 Una transacción no reemplaza las restricciones

Las restricciones y las transacciones cumplen funciones diferentes:

| Herramienta | Protege |
|---|---|
| Restricción | Validez de cada estado o relación |
| Transacción | Unidad completa de varias operaciones |

Necesitas ambas.

## 5.11 Propiedades ACID a nivel inicial

### Atomicidad

La operación se completa entera o no se conserva.

### Consistencia

Las reglas de integridad deben seguir cumpliéndose.

### Aislamiento

Las operaciones simultáneas no deberían mezclarse de forma incorrecta. El estudio detallado de concurrencia queda fuera de este módulo.

### Durabilidad

Después de confirmar, los cambios deben permanecer incluso si el programa termina.

## 5.12 Transacciones y DB Browser

DB Browser puede mantener cambios pendientes mediante sus botones **Write Changes** y **Revert Changes**. Cuando utilices `BEGIN`, `COMMIT` y `ROLLBACK` explícitos:

1. Guarda o revierte cualquier cambio pendiente antes de comenzar.
2. Ejecuta el bloque desde `BEGIN` hasta `COMMIT` o `ROLLBACK`.
3. No ejecutes un segundo `BEGIN` dentro de una transacción abierta.
4. Si aparece “cannot start a transaction within a transaction”, termina o revierte la transacción pendiente y vuelve a empezar.
5. Cierra siempre una transacción con `COMMIT` o `ROLLBACK`.

## Video recomendado

[Transacciones en SQL: concurrencia, `COMMIT` y `ROLLBACK`](https://www.youtube.com/watch?v=ZUX28_Iwjv0)

**Propósito:** reforzar por qué una transacción agrupa cambios y cómo se confirman o revierten.

### Práctica guiada 4 — Confirmar y revertir

1. Consulta el stock del producto 4.
2. Inicia una transacción.
3. Suma diez unidades.
4. Consulta el valor dentro de la transacción.
5. Ejecuta `ROLLBACK`.
6. Comprueba que el valor original regresó.
7. Repite la operación.
8. Esta vez utiliza `COMMIT`.
9. Comprueba que el nuevo valor permaneció.
10. Explica la diferencia mediante una frase.

### Práctica guiada 5 — Recuperar una operación inválida

1. Selecciona un producto con stock menor que 20.
2. Inicia una transacción.
3. Intenta restar 20 unidades.
4. Observa la respuesta de `CHECK (stock >= 0)`.
5. Ejecuta `ROLLBACK`.
6. Comprueba que el stock original permanece.
7. Corrige la cantidad y repite en una transacción nueva.
8. Confirma solamente si el resultado es válido.

---

# 6. Método COA para cambios seguros

Utiliza esta secuencia en cada modificación manual:

```text
1. IDENTIFICAR
   Base, tabla y objetivo.

2. RESPALDAR
   Trabajar con una copia si el riesgo lo justifica.

3. CONSULTAR
   Mostrar las filas objetivo mediante SELECT.

4. PREDECIR
   Escribir el estado esperado.

5. INICIAR
   BEGIN TRANSACTION.

6. MODIFICAR
   UPDATE, DELETE o varias instrucciones.

7. VERIFICAR
   Consultar dentro de la transacción.

8. DECIDIR
   COMMIT si es correcto; ROLLBACK si no lo es.

9. COMPROBAR
   Consultar nuevamente y revisar integridad.

10. DOCUMENTAR
    Registrar el propósito y resultado.
```

## 6.1 Respaldo de una base SQLite

Para una práctica local sencilla:

1. Asegúrate de que no existan cambios pendientes.
2. Cierra DB Browser.
3. Copia el archivo `.db`.
4. Nombra la copia con propósito y fecha.

Ejemplo:

```text
inventario_antes_ajuste_2026-08-02.db
```

Una copia no sustituye una estrategia profesional de respaldo, pero permite recuperar una práctica local.

## 6.2 Script reproducible

Organiza el proyecto:

```text
1. Configuración
2. Creación de tablas
3. Datos iniciales
4. Operaciones CRUD demostrativas
5. Transacciones confirmadas
6. Transacciones de prueba revertidas
7. Consultas de comprobación
8. Pruebas inválidas comentadas
```

Las transacciones demostrativas deben partir de un estado conocido para que sus resultados puedan explicarse.

## 6.3 Datos de prueba frente a datos reales

Utiliza datos inventados. No practiques eliminaciones o modificaciones sobre información personal o sobre una base compartida.

---

# 7. Buenas prácticas y errores frecuentes

## 7.1 Ejecutar `UPDATE` o `DELETE` sin consultar primero

La condición puede ser sintácticamente correcta y seleccionar una fila equivocada.

## 7.2 Omitir `WHERE`

Sin `WHERE`, todas las filas pueden cambiar o desaparecer.

## 7.3 Utilizar un nombre cuando existe un identificador

Dos productos podrían compartir una descripción similar. Para cambios exactos, utiliza una clave única comprobada.

## 7.4 Confirmar antes de verificar

Después de `COMMIT`, `ROLLBACK` ya no deshace esa transacción. Verifica primero.

## 7.5 Dejar una transacción abierta

Puede bloquear escrituras o generar confusión sobre qué cambios están pendientes.

## 7.6 Confiar solamente en el mensaje “sin errores”

Una instrucción puede afectar cero filas y no producir error. Consulta el resultado.

## 7.7 Desactivar claves foráneas

Evitar el error no corrige la relación. Mantén:

```sql
PRAGMA foreign_keys = ON;
```

## 7.8 Borrar historial cuando bastaba desactivar

Analiza si el registro debe conservarse para explicar operaciones pasadas.

## 7.9 Registrar un movimiento sin actualizar el saldo

El historial y el estado actual quedarían en desacuerdo. Agrupa ambos cambios en una transacción.

## 7.10 Modificar el archivo `.db` desde un editor de texto

Utiliza SQLite o una herramienta compatible. El archivo no es un documento SQL legible.

---

# 8. Ejercicios individuales

Intenta resolverlos antes de consultar las soluciones.

## Ejercicio 1 — Clasificar CRUD

Clasifica cada necesidad como crear, leer, actualizar o eliminar:

1. Registrar un paciente nuevo.
2. Mostrar el teléfono de un paciente.
3. Corregir un correo.
4. Retirar un registro de prueba sin historial.
5. Consultar un producto antes de cambiar su precio.
6. Desactivar un empleado.

Indica la instrucción SQL principal que utilizarías.

## Ejercicio 2 — Completar una inserción

Tabla:

```sql
CREATE TABLE proveedores (
    id INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    telefono TEXT,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);
```

Escribe una inserción para el proveedor 1, código `PRO-001`, nombre `Suministros Delta`, teléfono desconocido y estado activo predeterminado. Omite las columnas que deban recibir su valor automáticamente.

## Ejercicio 3 — Detectar el error de integridad

Indica qué restricción fallará:

1. Repetir `PRO-001`.
2. Insertar un proveedor sin nombre.
3. Utilizar activo igual a 3.
4. Insertar `NULL` como código.

## Ejercicio 4 — Reparar una actualización peligrosa

Se desea cambiar únicamente el teléfono del proveedor 4:

```sql
UPDATE proveedores
SET telefono = '2222-4455';
```

Escribe el procedimiento completo: consulta previa, actualización segura y consulta posterior.

## Ejercicio 5 — Actualizar varias columnas

El producto 3 debe cambiar su precio a 8.75, su descripción a `Soporte reforzado` y su estado a activo. Escribe una sola instrucción dirigida por identificador.

## Ejercicio 6 — Predecir el resultado

El producto 2 posee stock 12. Predice el valor después de cada instrucción si se ejecutan consecutivamente:

```sql
UPDATE productos SET stock = stock + 8 WHERE id = 2;
UPDATE productos SET stock = stock - 5 WHERE id = 2;
UPDATE productos SET stock = stock + 2 WHERE id = 999;
```

Explica por qué la última instrucción no produce necesariamente un error.

## Ejercicio 7 — Eliminar o desactivar

Decide y justifica:

1. Producto vendido durante años que ya no se ofrece.
2. Producto de prueba sin movimientos.
3. Movimiento de inventario confirmado.
4. Categoría vacía creada por error.
5. Paciente con citas históricas.

## Ejercicio 8 — Reparar una eliminación

Se quiere eliminar el producto con código `TMP-009`:

```sql
DELETE FROM productos;
```

Escribe el procedimiento seguro utilizando primero una consulta y después una eliminación dirigida por una clave única.

## Ejercicio 9 — Elegir `COMMIT` o `ROLLBACK`

Decide:

1. La actualización produjo exactamente el resultado esperado.
2. Se modificó la fila equivocada.
3. Una de dos instrucciones relacionadas falló.
4. El resultado es correcto, pero todavía no se verificaron las relaciones.
5. La operación era solamente una prueba.

## Ejercicio 10 — Ordenar una transacción

Ordena:

```text
COMMIT
SELECT de verificación
BEGIN TRANSACTION
UPDATE
SELECT previo
```

Añade dónde utilizarías `ROLLBACK` si la verificación falla.

## Ejercicio 11 — Corregir una operación parcial

Una salida de inventario redujo el stock, pero no registró el movimiento. Explica:

1. Qué inconsistencia aparece.
2. Qué dos instrucciones debieron agruparse.
3. Qué habría ocurrido si el error aparecía antes de `COMMIT`.
4. Qué debes hacer si el cambio ya fue confirmado y no existe transacción abierta.

## Ejercicio 12 — Diseñar una prueba de recuperación

Escribe un bloque que:

1. Consulte el stock del producto 1.
2. Inicie una transacción.
3. Sume 100 unidades.
4. Muestre el valor temporal.
5. Revierta el cambio.
6. Muestre el valor final.

---

# 9. Soluciones explicadas de los ejercicios

## Solución del ejercicio 1

| Necesidad | CRUD | SQL principal |
|---|---|---|
| Registrar paciente | Create | `INSERT` |
| Mostrar teléfono | Read | `SELECT` |
| Corregir correo | Update | `UPDATE` |
| Retirar prueba | Delete | `DELETE` |
| Consultar antes de cambiar | Read | `SELECT` |
| Desactivar empleado | Update | `UPDATE` |

Desactivar no elimina físicamente; actualiza un estado.

## Solución del ejercicio 2

```sql
INSERT INTO proveedores (
    id,
    codigo,
    nombre,
    telefono
) VALUES (
    1,
    'PRO-001',
    'Suministros Delta',
    NULL
);
```

`activo` se omite y recibe 1.

## Solución del ejercicio 3

1. `UNIQUE`.
2. `NOT NULL`.
3. `CHECK`.
4. `NOT NULL`.

## Solución del ejercicio 4

```sql
SELECT id, codigo, nombre, telefono
FROM proveedores
WHERE id = 4;

UPDATE proveedores
SET telefono = '2222-4455'
WHERE id = 4;

SELECT id, codigo, nombre, telefono
FROM proveedores
WHERE id = 4;
```

## Solución del ejercicio 5

```sql
UPDATE productos
SET
    precio = 8.75,
    descripcion = 'Soporte reforzado',
    activo = 1
WHERE id = 3;
```

## Solución del ejercicio 6

```text
Inicial: 12
Después de +8: 20
Después de -5: 15
Después de actualizar id 999: 15
```

La última condición no encuentra filas. Afectar cero filas no es necesariamente un error de SQL.

## Solución orientativa del ejercicio 7

1. Desactivar para conservar historial.
2. Eliminar físicamente si se comprobó que no tiene dependencias.
3. Conservar; explica el historial.
4. Eliminar físicamente si no tiene dependencias.
5. Conservar; forma parte del historial clínico.

## Solución del ejercicio 8

```sql
SELECT id, codigo, nombre
FROM productos
WHERE codigo = 'TMP-009';

DELETE FROM productos
WHERE codigo = 'TMP-009';

SELECT id, codigo, nombre
FROM productos
WHERE codigo = 'TMP-009';
```

La eliminación debería probarse primero dentro de una transacción.

## Solución del ejercicio 9

1. `COMMIT`, después de verificar todo.
2. `ROLLBACK`.
3. `ROLLBACK`.
4. Todavía no confirmar; verificar y decidir.
5. `ROLLBACK`.

## Solución del ejercicio 10

```text
1. SELECT previo
2. BEGIN TRANSACTION
3. UPDATE
4. SELECT de verificación
5. COMMIT si es correcto
   o ROLLBACK si falla
```

## Solución del ejercicio 11

1. El stock cambia sin una explicación en el historial.
2. El `UPDATE` del producto y el `INSERT` del movimiento.
3. `ROLLBACK` habría deshecho los cambios pendientes.
4. Un cambio confirmado no se revierte mediante `ROLLBACK`; se necesita una nueva operación correctiva autorizada y documentada.

## Solución del ejercicio 12

```sql
SELECT id, nombre, stock
FROM productos
WHERE id = 1;

BEGIN TRANSACTION;

UPDATE productos
SET stock = stock + 100
WHERE id = 1;

SELECT id, nombre, stock
FROM productos
WHERE id = 1;

ROLLBACK;

SELECT id, nombre, stock
FROM productos
WHERE id = 1;
```

---

# 10. Mini proyecto — Caja diaria de una cafetería

## Objetivo

Practicar inserciones, correcciones, anulaciones lógicas y transacciones mediante operaciones pequeñas y verificables.

## Situación

Una cafetería registra ventas y sus líneas de detalle. Cada venta posee un estado. Una venta confirmada no debe quedar sin detalles y un detalle no puede existir sin su venta.

## Tablas mínimas

```text
productos_cafeteria
ventas
detalle_venta
```

## Reglas

- Los códigos de producto son únicos.
- Precio y cantidad deben ser positivos.
- Una venta comienza con estado `ABIERTA`.
- Estados permitidos: `ABIERTA`, `PAGADA`, `ANULADA`.
- Cada detalle pertenece a una venta y un producto existentes.
- La combinación de venta y producto no puede repetirse en esta versión sencilla.
- Las ventas con detalles no se eliminan físicamente; se anulan mediante `UPDATE`.

## Actividades obligatorias

1. Crea tres productos.
2. Crea una venta abierta.
3. Dentro de una transacción, inserta dos detalles y cambia la venta a `PAGADA`.
4. Verifica y utiliza `COMMIT`.
5. Inicia otra transacción para una venta de prueba.
6. Inserta un detalle con cantidad incorrecta o producto equivocado.
7. Verifica el problema y utiliza `ROLLBACK`.
8. Corrige el teléfono o una observación opcional mediante `UPDATE` dirigido.
9. Anula lógicamente una venta mediante su identificador.
10. Intenta eliminar una venta con detalles y observa la protección referencial.

## Evidencias internas

- Estado anterior y posterior de la venta confirmada.
- Detalles conservados después de `COMMIT`.
- Ausencia de la venta de prueba después de `ROLLBACK`.
- Mensaje de una restricción rechazando una operación inválida.

## Lista de comprobación

- [ ] Las claves foráneas están activas.
- [ ] Las inserciones utilizan columnas explícitas.
- [ ] Cada `UPDATE` y `DELETE` contiene `WHERE`.
- [ ] Existe una transacción confirmada.
- [ ] Existe una transacción revertida.
- [ ] Las consultas de verificación aparecen antes de confirmar.
- [ ] No se eliminó historial válido.

El mini proyecto es obligatorio, pero se conserva dentro de la evidencia del módulo y no necesita un punto de entrega independiente.

---

# 11. Proyecto del módulo — Sistema de inventario y movimientos

## Desafío

Una empresa necesita conocer la existencia actual de cada producto y conservar la explicación de cada cambio. Actualmente las cantidades se modifican manualmente y no existe un historial confiable.

Construirás una base que permita:

- Registrar categorías y productos.
- Corregir información.
- Desactivar productos.
- Registrar entradas, salidas y ajustes.
- Proteger la existencia contra valores negativos.
- Mantener juntos el cambio de stock y su movimiento.
- Probar una operación y revertirla.

## Tablas obligatorias

### `categorias`

- `id`.
- `nombre` obligatorio y único.
- `descripcion` opcional.

### `productos`

- `id`.
- `codigo` obligatorio y único.
- `nombre` obligatorio.
- `precio` positivo.
- `stock` no negativo y con valor inicial 0.
- `activo` limitado a 0 y 1, con valor inicial 1.
- `descripcion` opcional.
- `categoria_id` obligatorio y válido.

### `movimientos`

- `id`.
- `producto_id` obligatorio y válido.
- `tipo` limitado a `ENTRADA`, `SALIDA` y `AJUSTE`.
- `cantidad` positiva.
- `stock_anterior` no negativo.
- `stock_nuevo` no negativo.
- `fecha` obligatoria.
- `motivo` obligatorio.
- `referencia` opcional.

## Reglas de integridad

1. Una categoría con productos no puede eliminarse.
2. Un producto con movimientos no puede eliminarse.
3. Un producto retirado se desactiva con `activo = 0`.
4. El stock nunca puede ser negativo.
5. Cada movimiento pertenece a un producto existente.
6. La cantidad del movimiento debe ser mayor que cero.
7. El tipo debe pertenecer al conjunto permitido.
8. El cambio de stock y el registro del movimiento se confirman o revierten juntos.
9. El estado final del producto debe coincidir con `stock_nuevo`.

## Datos iniciales mínimos

- Cuatro categorías.
- Doce productos.
- Por lo menos dos productos con stock inicial cero.
- Precios y existencias variadas.
- Por lo menos tres descripciones `NULL` legítimas.

## Operaciones CRUD obligatorias

### Inserciones

1. Inserción múltiple de categorías.
2. Inserción múltiple de productos.
3. Inserción de por lo menos seis movimientos válidos.

### Actualizaciones

1. Corregir nombre y descripción de un producto.
2. Corregir el precio de otro producto.
3. Desactivar un producto con historial.
4. Actualizar stock dentro de cada movimiento transaccional.

### Eliminaciones

1. Crear y eliminar un producto temporal sin movimientos.
2. Intentar eliminar un producto con movimientos y demostrar que se rechaza.
3. Intentar eliminar una categoría utilizada y demostrar que se rechaza.

Cada actualización y eliminación debe incluir consulta previa, `WHERE` y consulta posterior.

## Transacciones obligatorias

### Transacción 1 — Entrada confirmada

1. Consulta el stock inicial.
2. Inicia la transacción.
3. Aumenta el stock.
4. Inserta el movimiento `ENTRADA`.
5. Comprueba producto y movimiento.
6. Ejecuta `COMMIT`.
7. Comprueba que los cambios permanecen.

### Transacción 2 — Salida confirmada

1. Consulta el stock inicial.
2. Verifica que existen unidades suficientes.
3. Inicia la transacción.
4. Reduce el stock.
5. Inserta el movimiento `SALIDA`.
6. Comprueba el resultado.
7. Ejecuta `COMMIT`.

### Transacción 3 — Ajuste revertido

1. Consulta el stock inicial.
2. Inicia la transacción.
3. Aplica un ajuste de prueba.
4. Inserta un movimiento temporal.
5. Muestra el estado provisional.
6. Ejecuta `ROLLBACK`.
7. Demuestra que producto y movimiento regresaron al estado inicial.

### Transacción 4 — Error recuperado

1. Inicia una salida que produciría stock negativo o un movimiento inválido.
2. Observa el error de restricción.
3. Ejecuta `ROLLBACK` si la transacción continúa abierta.
4. Comprueba que no quedó un cambio parcial.
5. Corrige la cantidad y repite en una transacción nueva.

## Pruebas inválidas obligatorias

Demuestra que se rechaza:

1. Código de producto duplicado.
2. Precio igual o menor que cero.
3. Stock negativo.
4. Producto con categoría inexistente.
5. Movimiento con producto inexistente.
6. Tipo de movimiento no permitido.
7. Cantidad igual a cero.
8. Eliminación de producto con historial.

Las pruebas inválidas deben quedar comentadas al final del script para no impedir su ejecución completa.

## Orden recomendado del script

```text
1. Encabezado
2. PRAGMA foreign_keys = ON
3. Creación de tablas
4. Inserción de datos iniciales
5. Consultas de comprobación
6. Actualizaciones seguras
7. Eliminación segura del registro temporal
8. Transacciones confirmadas
9. Transacción revertida
10. Recuperación de error
11. Verificación final
12. Pruebas inválidas comentadas
```

## Proceso de construcción

### Fase 1. Define los estados iniciales

Escribe los productos y cantidades antes de aplicar movimientos.

### Fase 2. Diseña y crea las tablas

Aplica las relaciones y restricciones del Módulo 2.

### Fase 3. Inserta datos en orden

Primero categorías, después productos y finalmente movimientos.

### Fase 4. Comprueba los valores predeterminados

Verifica `stock` y `activo` cuando se omiten.

### Fase 5. Ejecuta correcciones

Utiliza el procedimiento consultar–actualizar–consultar.

### Fase 6. Prueba eliminaciones con `ROLLBACK`

No confirmes hasta comprobar el efecto.

### Fase 7. Implementa cada transacción

Ejecuta una operación a la vez. Conserva evidencia antes, durante y después.

### Fase 8. Reconstruye desde cero

El script debe producir siempre el mismo estado final cuando se ejecuta una vez sobre una base vacía.

### Fase 9. Documenta

Explica el objetivo de cada operación y por qué se confirmó o revirtió.

## Restricciones del proyecto

- No utilices Python ni otro lenguaje.
- No utilices `JOIN`, agrupaciones ni consultas analíticas.
- No ejecutes `UPDATE` o `DELETE` sin `WHERE`.
- No desactives claves foráneas.
- No elimines movimientos confirmados.
- No sustituyas la desactivación por borrado cuando exista historial.
- No confirmes una transacción antes de comprobarla.
- No dejes transacciones abiertas.
- No utilices datos reales de una empresa.

## Lista de comprobación

- [ ] Las tres tablas se crean correctamente.
- [ ] Las claves foráneas están activas.
- [ ] Las restricciones protegen precios, stock, tipos y cantidades.
- [ ] Existen cuatro categorías y doce productos.
- [ ] Se comprobaron los valores predeterminados.
- [ ] Las inserciones declaran columnas.
- [ ] Todas las actualizaciones tienen consulta previa y posterior.
- [ ] Todas las eliminaciones contienen `WHERE`.
- [ ] El producto con historial se desactiva.
- [ ] Existen dos transacciones confirmadas.
- [ ] Existe un ajuste revertido.
- [ ] Existe un error recuperado sin cambios parciales.
- [ ] Existen al menos seis movimientos válidos.
- [ ] Las ocho pruebas inválidas son rechazadas.
- [ ] `PRAGMA foreign_key_check` no devuelve filas.
- [ ] El script reconstruye la base desde cero.
- [ ] La documentación explica cada decisión.

## Condición de avance

El proyecto debe alcanzar al menos 70 puntos, cumplir los requisitos críticos y ser aprobado. Si recibe observaciones, deberás corregirlo antes de comenzar el Módulo 4.

---

# 12. Rúbrica de evaluación del proyecto

| Criterio | Evidencia esperada | Puntos |
|---|---|---:|
| Funcionamiento e integridad | Tablas, datos y restricciones funcionan sin referencias inválidas | 20 |
| Inserciones | Datos suficientes, columnas explícitas, orden correcto y uso coherente de valores predeterminados | 15 |
| Actualizaciones y eliminaciones | Cambios dirigidos, comprobados y coherentes con el historial | 20 |
| Transacciones | Operaciones agrupadas correctamente, dos confirmadas, una revertida y un error recuperado | 25 |
| Organización del SQL | Script reproducible, comentado, ordenado y sin transacciones abiertas | 10 |
| Documentación y evidencias | Explicaciones claras y capturas antes, durante y después | 10 |
| **Total** |  | **100** |

## Requisitos críticos

El proyecto no puede aprobarse si:

- No se entrega el script SQL.
- El script no funciona sobre una base vacía.
- Existe un `UPDATE` o `DELETE` sin `WHERE` dentro de las operaciones del proyecto.
- Las claves foráneas están desactivadas.
- El stock puede quedar negativo.
- El cambio de stock y su movimiento no se agrupan en una transacción.
- No se demuestra `COMMIT` y `ROLLBACK`.
- Queda una transacción abierta.
- Se elimina historial válido para evitar un error.
- No se incluyen las pruebas y evidencias obligatorias.
- Se utiliza contenido copiado sin comprensión demostrable.

---

# 13. Evaluación práctica del módulo

## Situación

Una base de datos de inventario contiene estos incidentes:

- El precio del producto 4 es incorrecto.
- Un producto retirado conserva historial y debe desactivarse.
- Deben ingresar siete unidades del producto 2 y registrarse el movimiento.
- Se solicitó probar una salida de cien unidades sin conservarla.

## Tareas

1. Consulta el producto 4 antes del cambio.
2. Actualiza únicamente su precio.
3. Comprueba el resultado.
4. Consulta y desactiva el producto retirado mediante `UPDATE`.
5. Construye una transacción para la entrada de siete unidades.
6. Registra el movimiento correspondiente.
7. Comprueba y confirma la entrada.
8. Construye otra transacción para la salida de cien unidades.
9. Comprueba el error o resultado inválido.
10. Revierte la operación.
11. Demuestra que el stock y los movimientos quedaron correctos.

## Tiempo sugerido

**15 minutos**

## Criterios de dominio

- Cada fila objetivo se consulta antes de modificarse.
- Cada `UPDATE` utiliza `WHERE`.
- La entrada y su movimiento se confirman juntos.
- La prueba peligrosa se revierte.
- No queda un cambio parcial.
- El estudiante puede explicar por qué eligió `COMMIT` o `ROLLBACK`.

---

# 14. Punto de entrega obligatorio

Todo el módulo se entrega mediante un único punto. Los ejercicios, el mini proyecto y las capturas no requieren formularios separados.

## Nombre del archivo

```text
COA_SQL_M03_Apellido_Nombre.zip
```

Ejemplo:

```text
COA_SQL_M03_Cerna_Victor.zip
```

## Contenido obligatorio

```text
COA_SQL_M03_Apellido_Nombre/
├── COA_SQL_M03_Apellido_Nombre.sql
├── inventario.db
├── explicacion_operaciones.pdf
└── evidencias/
    ├── 01_datos_iniciales.png
    ├── 02_actualizacion_segura.png
    ├── 03_eliminacion_temporal.png
    ├── 04_entrada_antes.png
    ├── 05_entrada_durante.png
    ├── 06_entrada_confirmada.png
    ├── 07_ajuste_durante.png
    ├── 08_ajuste_revertido.png
    ├── 09_error_recuperado.png
    ├── 10_restriccion_rechazada.png
    ├── 11_foreign_key_check.png
    └── 12_prueba_script_vacio.png
```

## Contenido de `explicacion_operaciones.pdf`

1. Descripción del inventario.
2. Reglas de integridad.
3. Estado inicial de los productos utilizados.
4. Explicación de cada actualización.
5. Justificación de cada eliminación o desactivación.
6. Explicación paso a paso de las cuatro transacciones.
7. Razón para utilizar `COMMIT` o `ROLLBACK`.
8. Resultado de las pruebas inválidas.
9. Confirmación de que no quedaron cambios parciales.

Toda la explicación se reúne en un único PDF.

## Evidencias

- Las capturas de una transacción deben mostrar estado anterior, provisional y final.
- La evidencia de `ROLLBACK` debe demostrar que el cambio temporal desapareció.
- La evidencia de error debe mostrar que no quedó una actualización parcial.
- `PRAGMA foreign_key_check` debe ejecutarse sobre la versión final.
- La prueba del script debe utilizar una base vacía.

## Antes de enviar

1. Abre el archivo comprimido.
2. Comprueba los nombres.
3. Ejecuta el script sobre una base vacía.
4. Confirma que no exista una transacción abierta.
5. Revisa el stock final y los movimientos.
6. Comprueba que las pruebas inválidas estén comentadas.
7. Ejecuta `PRAGMA foreign_key_check`.
8. Confirma que todas las capturas correspondan a la versión final.

[Entregar el Módulo 3](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 15. Retos adicionales

## Reto 1 — Corrección múltiple controlada

Crea tres productos de prueba con una descripción incorrecta. Diseña una actualización para cada uno y explica por qué no utilizaste una instrucción general sin identificar las filas.

## Reto 2 — Desactivación reversible

Desactiva un producto dentro de una transacción, comprueba el resultado y utiliza `ROLLBACK`. Después repite y confirma. Compara ambos estados.

## Reto 3 — Movimiento incompleto

Simula una transacción en la que el `UPDATE` funciona, pero el `INSERT` viola un `CHECK`. Demuestra que `ROLLBACK` conserva el stock original.

## Reto 4 — Auditoría de seguridad

Revisa el script y marca cada `UPDATE` y `DELETE`. Comprueba que todos incluyan condición, consulta previa, verificación y una decisión consciente de transacción.

---

# 16. Videos recomendados del módulo

## Video esencial 1

[SQL: `INSERT`, `UPDATE` y `DELETE` — Universitat Politècnica de València](https://www.youtube.com/watch?v=KkEzKNaQVvA)

**Tema exacto:** operaciones para insertar, modificar y eliminar datos.  
**Momento recomendado:** después de estudiar CRUD.  
**Objetivo:** reforzar la sintaxis y el riesgo de modificar filas sin una condición adecuada.

## Video esencial 2

[Transacciones en SQL: concurrencia, `COMMIT` y `ROLLBACK`](https://www.youtube.com/watch?v=ZUX28_Iwjv0)

**Tema exacto:** agrupación, confirmación y reversión de cambios.  
**Momento recomendado:** antes de construir las transacciones del proyecto.  
**Objetivo:** comprender por qué varias instrucciones deben tratarse como una unidad.

Los videos no sustituyen las pruebas. Debes observar el estado de la base antes, durante y después de cada transacción.

---

# 17. Documentación y recursos de lectura

## Instrucciones de manipulación

- [`INSERT` — documentación oficial de SQLite](https://sqlite.org/lang_insert.html)
- [`UPDATE` — documentación oficial de SQLite](https://sqlite.org/lang_update.html)
- [`DELETE` — documentación oficial de SQLite](https://sqlite.org/lang_delete.html)

## Transacciones e integridad

- [Transacciones — documentación oficial de SQLite](https://sqlite.org/lang_transaction.html)
- [Claves foráneas — documentación oficial de SQLite](https://sqlite.org/foreignkeys.html)
- [Restricciones de `CREATE TABLE` — documentación oficial de SQLite](https://sqlite.org/lang_createtable.html)

La documentación muestra variantes más avanzadas que no son necesarias en este módulo. Concéntrate en:

- `INSERT ... VALUES`.
- `UPDATE ... SET ... WHERE`.
- `DELETE FROM ... WHERE`.
- `BEGIN`, `COMMIT` y `ROLLBACK`.

---

# 18. Glosario

| Término | Significado |
|---|---|
| ACID | Conjunto de propiedades de las transacciones |
| Atomicidad | Una operación se conserva completa o se deshace completa |
| Cambio parcial | Estado en el que solo se ejecutó una parte de una operación |
| `COMMIT` | Confirma los cambios de una transacción |
| Consistencia | Conservación de las reglas de integridad |
| Create de CRUD | Creación de un registro mediante `INSERT` |
| CRUD | Crear, leer, actualizar y eliminar datos |
| Delete de CRUD | Eliminación de registros mediante `DELETE` |
| Desactivación | Cambio de estado que conserva el registro |
| Durabilidad | Permanencia de los cambios confirmados |
| Eliminación física | Borrado real de una fila |
| Eliminación lógica | Conservación del registro con un estado inactivo |
| `INSERT` | Instrucción para añadir filas |
| Integridad | Condición de datos válidos y relaciones coherentes |
| `BEGIN` | Inicia una transacción explícita |
| `ROLLBACK` | Deshace cambios no confirmados |
| Read de CRUD | Lectura de datos mediante `SELECT` |
| Transacción | Grupo de operaciones tratado como una unidad |
| `UPDATE` | Instrucción para modificar filas |
| Update de CRUD | Modificación de datos mediante `UPDATE` |
| `WHERE` | Condición que determina qué filas cumplen una operación |

---

# 19. Resumen del módulo

CRUD representa las operaciones fundamentales sobre los datos:

```text
Create → INSERT
Read   → SELECT
Update → UPDATE
Delete → DELETE
```

Una actualización o eliminación segura utiliza una condición y se verifica:

```text
SELECT previo
    ↓
BEGIN TRANSACTION
    ↓
UPDATE o DELETE
    ↓
SELECT de verificación
    ↓
COMMIT o ROLLBACK
```

`COMMIT` conserva los cambios. `ROLLBACK` recupera el estado anterior mientras la transacción no haya sido confirmada.

Las transacciones evitan operaciones parciales, pero no reemplazan las restricciones. Una base profesional combina claves, `CHECK`, `NOT NULL`, integridad referencial y transacciones.

## Habilidades obtenidas

Ahora puedes:

- Insertar datos respetando columnas, tipos y relaciones.
- Interpretar errores de integridad.
- Corregir registros mediante actualizaciones dirigidas.
- Eliminar filas específicas mediante un procedimiento seguro.
- Decidir cuándo conservar historial mediante desactivación.
- Actualizar valores a partir de su estado actual.
- Crear y verificar transacciones.
- Confirmar operaciones válidas.
- Revertir pruebas o cambios incorrectos.
- Proteger operaciones compuestas contra estados parciales.
- Documentar el estado anterior y posterior de una modificación.

## Antes de continuar

Comprueba que puedes explicar y demostrar:

- La diferencia entre `CREATE TABLE` y Create dentro de CRUD.
- Por qué las inserciones deben declarar columnas.
- Qué ocurre si un `UPDATE` no contiene `WHERE`.
- Qué diferencia existe entre `DELETE` y `DROP TABLE`.
- Cuándo conviene desactivar en lugar de eliminar.
- Por qué debes consultar antes y después de modificar.
- Qué diferencia existe entre una restricción y una transacción.
- Cuándo utilizar `COMMIT`.
- Cuándo utilizar `ROLLBACK`.
- Por qué un cambio confirmado no se deshace con un `ROLLBACK` posterior.
- Cómo impedir que el stock cambie sin registrar el movimiento.

No continúes con el Módulo 4 hasta que el proyecto de inventario haya sido aprobado. El siguiente módulo se concentrará en convertir preguntas reales en consultas, filtros, expresiones, funciones y resúmenes de información.
