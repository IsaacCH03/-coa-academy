# COA — Cursos Online Avanzados

## SQL y Bases de Datos Relacionales

# Módulo 1. Fundamentos relacionales y primeros pasos con SQL

**Duración estimada:** 3 horas  
**Nivel:** inicial  
**Modalidad:** autodidacta y práctica  
**Motor de base de datos:** SQLite  
**Herramienta principal:** DB Browser for SQLite  
**Resultado principal:** una base de datos funcional para administrar el catálogo digital de una biblioteca

---

## Bienvenida

Casi todas las aplicaciones necesitan conservar información. Una tienda registra productos y ventas; una clínica registra pacientes y citas; una universidad registra estudiantes y cursos; una plataforma educativa registra usuarios, avances y certificados.

Guardar datos no consiste solamente en escribirlos en cualquier lugar. También es necesario organizarlos, encontrarlos, modificarlos y protegerlos para que continúen siendo útiles.

En este módulo comenzarás desde cero. Aprenderás qué es una base de datos relacional, qué función cumple SQL y cómo crear una base de datos real con SQLite. Al finalizar tendrás un archivo de base de datos que podrás abrir, consultar y reconstruir mediante instrucciones escritas por ti.

No necesitas conocer Python ni otro lenguaje de programación. SQL será el protagonista.

> **Principio del módulo:** una base de datos útil no es un montón de datos. Es información organizada con una estructura que otras personas y programas pueden comprender.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Distinguir entre dato e información.
- Explicar la diferencia entre una base de datos, un sistema gestor y SQL.
- Reconocer tablas, filas, columnas, valores y esquemas.
- Explicar qué caracteriza a una base de datos relacional.
- Crear y abrir una base de datos con SQLite.
- Utilizar DB Browser for SQLite para ejecutar instrucciones SQL.
- Elegir entre `INTEGER`, `REAL` y `TEXT` en casos sencillos.
- Representar información ausente mediante `NULL`.
- Crear una tabla mediante `CREATE TABLE`.
- Insertar registros mediante `INSERT`.
- Consultar todas o algunas columnas mediante `SELECT`.
- Asignar nombres claros a las columnas de un resultado mediante alias.
- Organizar un script SQL mediante comentarios y secciones.
- Reconocer qué conocimientos se transfieren a otros motores de bases de datos.

---

## Producto que construirás

El proyecto principal será un catálogo digital de biblioteca almacenado en una base de datos SQLite.

```text
biblioteca.db
└── tabla: libros
    ├── id
    ├── titulo
    ├── autor
    ├── genero
    ├── anio_publicacion
    ├── editorial
    ├── paginas
    └── estado
```

El archivo `.db` conservará los datos. El archivo `.sql` conservará las instrucciones necesarias para reconstruir la tabla, insertar los libros y consultar el catálogo.

En este primer módulo trabajarás con una sola tabla. En el siguiente aprenderás a separar correctamente la información y relacionar varias tablas.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Datos, información y bases de datos | 10 minutos |
| 2. Modelo relacional, gestores y SQL | 10 minutos |
| 3. Preparación de SQLite y DB Browser | 15 minutos |
| 4. Tablas, tipos de datos y `NULL` | 15 minutos |
| 5. Primer script con `CREATE TABLE`, `INSERT` y `SELECT` | 25 minutos |
| 6. Ejercicios individuales | 30 minutos |
| 7. Mini proyecto: agenda de contactos | 20 minutos |
| 8. Proyecto del módulo: catálogo de biblioteca | 40 minutos |
| 9. Evaluación, revisión y entrega | 15 minutos |
| **Total** | **3 horas** |

Los tiempos son orientativos. Puedes dedicar más tiempo a instalar la herramienta, experimentar, corregir errores o mejorar la presentación de la entrega.

---

# 1. Datos, información y bases de datos

## 1.1 Activación inicial

Imagina una biblioteca que registra sus libros en mensajes de texto como estos:

```text
El libro Senderos del Norte es de Elena Campos y tiene 280 páginas.
Marcos prestó el libro ayer.
Hay otro libro de Elena, creo que es de aventuras.
Código 17, disponible.
La editorial puede ser Horizonte o quizá Horizontes.
```

Responde antes de continuar:

1. ¿Cuántos libros aparecen realmente?
2. ¿A qué libro corresponde el código 17?
3. ¿Cuál es el título del libro prestado?
4. ¿Cómo comprobarías el nombre correcto de la editorial?
5. ¿Qué datos faltan?

La dificultad no está en leer las frases. El problema es que la información no posee una estructura consistente.

Una base de datos intenta evitar precisamente esa situación.

## 1.2 ¿Qué es un dato?

Un **dato** es una representación elemental de algo. Puede ser un nombre, un número, una fecha, una respuesta o un código.

Ejemplos:

- `280`
- `Disponible`
- `2024-08-15`
- `Elena Campos`
- `A-017`

Un dato aislado puede carecer de contexto. El número `280` no indica por sí solo si representa páginas, libros, estudiantes o colones.

## 1.3 ¿Qué es información?

La **información** aparece cuando los datos están organizados y tienen contexto.

```text
Dato aislado: 280
Contexto: cantidad de páginas
Entidad: libro Senderos del Norte
Información: Senderos del Norte tiene 280 páginas.
```

Una base de datos permite conservar el dato junto con la estructura que explica qué significa.

## 1.4 Analogía: un archivo de expedientes

Imagina un archivador físico:

- Cada gaveta almacena documentos de un mismo tipo.
- Cada carpeta representa una persona, producto o evento.
- Cada espacio del formulario tiene un propósito definido.
- Las etiquetas permiten localizar la información.

Una base de datos relacional utiliza una idea parecida:

| Archivo físico | Base de datos |
|---|---|
| Gaveta de expedientes | Tabla |
| Una carpeta | Fila o registro |
| Campo del formulario | Columna |
| Contenido de un campo | Valor |
| Diseño del formulario | Esquema |

La analogía ayuda a comenzar, pero una base de datos ofrece mucho más: permite ejecutar instrucciones, encontrar datos, validar reglas y trabajar desde aplicaciones.

## 1.5 Una hoja de cálculo no es lo mismo que una base de datos

Las hojas de cálculo son excelentes para cálculos, análisis rápido y presentación de información. Una base de datos está diseñada para almacenar, relacionar, consultar y proteger datos de forma estructurada.

| Hoja de cálculo | Base de datos relacional |
|---|---|
| Prioriza celdas y cálculos | Prioriza registros y relaciones |
| Permite mucha libertad visual | Mantiene una estructura definida |
| Es cómoda para análisis manual | Es apropiada para aplicaciones y consultas repetibles |
| Puede mezclar títulos, notas y datos | Separa la estructura de los datos |
| Las fórmulas suelen depender de posiciones | Las consultas trabajan con tablas y columnas |

No se trata de decidir que una herramienta es siempre mejor. Se trata de elegirla según el problema.

### Práctica guiada 1 — De datos sueltos a una estructura

Una tienda anotó lo siguiente:

```text
Cuaderno Azul, código C01, 1.75, quedan 20
Lápiz HB, 0.50, código L04, quedan 65
Mochila gris, código M12, quedan 8, cuesta 19.90
```

### Paso 1. Identifica qué representa cada línea

Cada línea describe un producto.

### Paso 2. Identifica las propiedades repetidas

- Código.
- Nombre.
- Precio.
- Cantidad disponible.

### Paso 3. Organiza la información

| codigo | nombre | precio | stock |
|---|---|---:|---:|
| C01 | Cuaderno Azul | 1.75 | 20 |
| L04 | Lápiz HB | 0.50 | 65 |
| M12 | Mochila gris | 19.90 | 8 |

Ahora todos los productos siguen la misma estructura. Esa regularidad permitirá almacenarlos en una tabla.

---

# 2. Modelo relacional, gestores y SQL

## 2.1 ¿Qué es una base de datos?

Una **base de datos** es una colección organizada de datos que pueden almacenarse, consultarse y mantenerse.

El archivo `biblioteca.db` que crearás será una base de datos. Podrá contener tablas, datos y otros objetos que se estudiarán más adelante.

## 2.2 ¿Qué es una base de datos relacional?

Una base de datos relacional organiza la información principalmente en tablas.

Cada tabla representa un tema reconocible:

- Libros.
- Productos.
- Pacientes.
- Habitaciones.
- Cursos.

Las tablas pueden relacionarse mediante identificadores. Esa parte se desarrollará en el Módulo 2.

Por ahora, observa una tabla sencilla:

```text
TABLA: productos

┌────┬──────────────────┬────────┬───────┐
│ id │ nombre           │ precio │ stock │
├────┼──────────────────┼────────┼───────┤
│ 1  │ Cuaderno Azul    │ 1.75   │ 20    │
│ 2  │ Lápiz HB         │ 0.50   │ 65    │
│ 3  │ Mochila gris     │ 19.90  │ 8     │
└────┴──────────────────┴────────┴───────┘
```

Todos los registros de la tabla representan productos. Cada columna describe una propiedad común.

## 2.3 Base de datos, sistema gestor y SQL

Estos tres conceptos no significan lo mismo.

### Base de datos

Es la colección organizada de información.

Ejemplo: `biblioteca.db`.

### Sistema gestor de bases de datos

Es el software que permite crear, abrir, modificar y consultar una base de datos.

Ejemplos:

- SQLite.
- PostgreSQL.
- MySQL.
- MariaDB.
- SQL Server.
- Oracle Database.

La sigla habitual es **SGBD**: sistema gestor de bases de datos. También encontrarás **DBMS**, su equivalente en inglés.

### SQL

SQL es el lenguaje utilizado para expresar instrucciones dirigidas a una base de datos relacional.

Por ejemplo:

```sql
SELECT titulo, autor
FROM libros;
```

La instrucción solicita dos columnas de la tabla `libros`.

### Analogía completa

```text
Base de datos  → el archivo organizado de la biblioteca
SGBD           → el bibliotecario que administra el archivo
SQL            → el lenguaje utilizado para hacerle solicitudes
```

## 2.4 SQL no es el nombre de una base de datos

SQL es un lenguaje. SQLite, PostgreSQL y MySQL son motores o sistemas gestores que comprenden SQL.

Una comparación útil:

```text
Idioma: español
Personas que lo utilizan: muchas
Variaciones: vocabulario y acento según el país

Lenguaje: SQL
Motores que lo utilizan: SQLite, PostgreSQL, MySQL y otros
Variaciones: tipos, funciones y algunas instrucciones según el motor
```

El núcleo que aprenderás se transfiere entre motores. Cuando exista una diferencia importante, se indicará expresamente.

## Video recomendado

[¿Qué es una Base de Datos Relacional? — Fernando Herrera](https://www.youtube.com/watch?v=bqx7uQwUTs8)

**Propósito:** reforzar el concepto de tabla, registro y relación antes de utilizar SQLite.

---

# 3. Preparación de SQLite y DB Browser

## 3.1 ¿Qué es SQLite?

SQLite es un motor de base de datos SQL incorporado en una biblioteca. No necesita un servidor independiente ni una configuración compleja. Una base de datos completa puede almacenarse en un solo archivo.

```text
Aplicación o herramienta
          │
          ▼
        SQLite
          │
          ▼
     biblioteca.db
```

Esta característica permite copiar una base de datos SQLite como se copia un documento. Sin embargo, el contenido del archivo debe manipularse mediante SQLite o una herramienta compatible, no mediante un editor de texto.

SQLite resulta apropiado para:

- Aprendizaje.
- Aplicaciones de escritorio.
- Aplicaciones móviles.
- Prototipos.
- Herramientas locales.
- Dispositivos y programas que necesitan almacenamiento incorporado.

SQLite no intenta reemplazar siempre a un servidor como PostgreSQL o MySQL. Cada motor resuelve necesidades distintas.

## 3.2 ¿Qué es DB Browser for SQLite?

DB Browser for SQLite es una herramienta gráfica gratuita que permite:

- Crear bases de datos SQLite.
- Ejecutar instrucciones SQL.
- Revisar la estructura de las tablas.
- Explorar los datos almacenados.
- Importar y exportar información.

SQLite es el motor. DB Browser es la interfaz que utilizarás para comunicarte con él cómodamente.

## 3.3 Instalación

1. Visita la [página oficial de descargas de DB Browser for SQLite](https://sqlitebrowser.org/dl/).
2. Selecciona la versión correspondiente a tu sistema operativo.
3. Descarga el instalador desde el sitio oficial.
4. Completa la instalación con las opciones predeterminadas.
5. Abre **DB Browser for SQLite**.

No descargues instaladores desde páginas desconocidas. Si el sistema muestra una advertencia, comprueba primero que el archivo procede del sitio oficial.

### Alternativa temporal

Si no puedes instalar la aplicación inmediatamente, puedes experimentar con [SQLite Fiddle](https://sqlite.org/fiddle/), una herramienta oficial que funciona en el navegador. Para el proyecto del módulo se recomienda utilizar DB Browser y conservar el archivo `.db` localmente.

## 3.4 Prepara tu carpeta de trabajo

Crea esta estructura:

```text
COA_SQL/
└── modulo_01/
    ├── bases_datos/
    ├── scripts/
    ├── evidencias/
    └── entrega/
```

Evita guardar los archivos con nombres como `nuevo`, `prueba final` o `base buena 2`. Utiliza nombres que indiquen claramente su propósito.

## 3.5 Crea tu primera base de datos

1. Abre DB Browser for SQLite.
2. Selecciona **New Database** o **Nueva base de datos**.
3. Guarda el archivo como `primer_base.db` dentro de `bases_datos`.
4. Si aparece una ventana para crear una tabla, puedes cerrarla o cancelarla. La tabla se creará mediante SQL.
5. Abre la pestaña **Execute SQL** o **Ejecutar SQL**.

La base de datos ya existe, aunque todavía no tenga tablas.

## Video recomendado

[Tutorial básico de SQLite: instalación en Windows y creación de una base de datos — Frank GP](https://www.youtube.com/watch?v=H8DURhGb53E)

**Propósito:** comprender por qué SQLite funciona sin un servidor y en qué tipos de proyectos se utiliza.

## 3.6 Si algo no funciona

### DB Browser no abre el archivo

- Comprueba que seleccionaste el archivo `.db` correcto.
- Evita cambiar manualmente la extensión.
- Cierra otras aplicaciones que puedan estar utilizando el archivo.

### No aparecen los datos nuevos

- Ejecuta la instrucción completa.
- Selecciona **Write Changes** o **Guardar cambios** si la herramienta muestra cambios pendientes.
- Actualiza la pestaña **Browse Data**.

### La interfaz se ve diferente

Los nombres o la posición de algunos botones pueden variar entre versiones. Busca las funciones equivalentes: crear base, ejecutar SQL, explorar datos y guardar cambios.

---

# 4. Tablas, tipos de datos y valores ausentes

## 4.1 Anatomía de una tabla

Considera esta tabla:

| id | nombre | precio | stock |
|---:|---|---:|---:|
| 1 | Cuaderno Azul | 1.75 | 20 |
| 2 | Lápiz HB | 0.50 | 65 |

### Tabla

La colección completa se llama `productos`.

### Columna

Una columna representa una propiedad compartida por todos los registros. `nombre` indica el nombre de cada producto.

### Fila o registro

Una fila representa una ocurrencia completa. La segunda fila describe un lápiz.

### Valor

Un valor aparece en la intersección entre una fila y una columna. `0.50` es el precio del producto con identificador 2.

### Esquema

El esquema describe la estructura: nombre de la tabla, columnas y tipos definidos.

```text
Esquema de productos
├── id       INTEGER
├── nombre   TEXT
├── precio   REAL
└── stock    INTEGER
```

Los datos pueden cambiar todos los días. El esquema debería cambiar solamente cuando cambien las necesidades del sistema.

## 4.2 Una tabla debe representar un tema reconocible

Un error frecuente consiste en mezclar información sin una idea central:

| nombre_producto | precio | nombre_cliente | fecha_cumpleanos_empleado | color_edificio |
|---|---:|---|---|---|

La tabla no representa un tema claro. Antes de crearla, completa esta frase:

> Cada fila de esta tabla representa ____________.

Si no puedes responder con claridad, el diseño necesita revisión.

## 4.3 Identificadores

Dos libros pueden tener el mismo título. Dos personas pueden llamarse igual. Por eso se utiliza un identificador que distinga cada registro.

```text
id = 1 → primer registro
id = 2 → segundo registro
```

En este módulo utilizarás el patrón:

```sql
id INTEGER PRIMARY KEY
```

`PRIMARY KEY` indica que la columna identifica cada fila. En el Módulo 2 estudiarás cómo elegir claves y cómo utilizarlas para relacionar tablas.

## 4.4 Tipos de datos esenciales

Para comenzar utilizarás tres tipos principales:

| Tipo | Uso | Ejemplos |
|---|---|---|
| `INTEGER` | Números enteros | `7`, `2024`, `0`, `-3` |
| `REAL` | Números con decimales | `19.90`, `3.5`, `0.75` |
| `TEXT` | Texto | `'Libro'`, `'San José'`, `'Disponible'` |

También existe `BLOB`, utilizado para datos binarios. No será necesario en este curso inicial.

### Elecciones correctas

| Dato | Tipo recomendado | Razón |
|---|---|---|
| Cantidad de páginas | `INTEGER` | No requiere decimales |
| Precio | `REAL` | Puede incluir decimales |
| Título | `TEXT` | Contiene caracteres |
| Año de publicación | `INTEGER` | Se utilizará como número entero |
| Número telefónico | `TEXT` | Puede incluir `+`, espacios y ceros iniciales |
| Código postal | `TEXT` | Es un identificador, no una cantidad |

Un valor compuesto solamente por dígitos no siempre debe ser numérico. Pregunta si se utilizará para calcular o para identificar.

## 4.5 SQLite utiliza tipos flexibles

SQLite posee un sistema de tipos más flexible que la mayoría de los motores. El tipo declarado expresa la afinidad o el tipo preferido de una columna, pero SQLite puede aceptar valores inesperados en muchas situaciones.

Eso no significa que debas mezclar datos sin cuidado.

```text
Que SQLite permita algo no significa que sea un buen diseño.
```

En este curso se utilizarán tipos coherentes para que los scripts sean comprensibles y fáciles de adaptar a motores con reglas más estrictas.

## 4.6 ¿Qué significa `NULL`?

`NULL` representa la ausencia de un valor conocido o aplicable.

No es lo mismo que:

- `0`.
- `''`, un texto vacío.
- `'NULL'`, la palabra escrita como texto.
- `'No sé'`.

Ejemplo:

| nombre | telefono_secundario |
|---|---|
| Ana Mora | `NULL` |
| Luis Solano | `'2222-2222'` |

En el primer registro no existe un número secundario conocido. No sería correcto guardar `0`, porque cero podría interpretarse como un número real.

En SQL se escribe sin comillas:

```sql
NULL
```

## 4.7 Fechas en SQLite

SQLite no posee una clase de almacenamiento exclusiva para fechas. Una opción práctica es guardar fechas como texto con el formato:

```text
AAAA-MM-DD
```

Ejemplo:

```text
2026-08-02
```

Este formato ordena los componentes desde el más grande al más pequeño y evita ambigüedades entre día y mes. Las funciones de fecha se estudiarán más adelante.

### Práctica guiada 2 — Diseñar una tabla antes de escribir SQL

Se necesita registrar cursos con estos datos:

- Identificador.
- Nombre.
- Duración en horas.
- Precio.
- Modalidad.
- Descripción opcional.

Completa el diseño:

| Columna | Tipo | Ejemplo |
|---|---|---|
| `id` | `INTEGER` | `1` |
| `nombre` | `TEXT` | `'Lógica de Programación'` |
| `duracion_horas` | `INTEGER` | `16` |
| `precio` | `REAL` | `0.00` |
| `modalidad` | `TEXT` | `'Autodidacta'` |
| `descripcion` | `TEXT` | `NULL` |

Observa que una duración de 16 horas no necesita decimales en este caso. El precio sí podría necesitarlos. La descripción puede estar ausente.

---

# 5. Tu primer script SQL

## 5.1 ¿Qué es una instrucción SQL?

Una instrucción SQL es una orden completa dirigida al motor de base de datos.

```sql
SELECT nombre
FROM productos;
```

Las palabras `SELECT` y `FROM` son parte del lenguaje. `nombre` y `productos` fueron definidos para la base de datos concreta.

## 5.2 Reglas de escritura que utilizarás

1. Escribe las palabras de SQL en mayúsculas para distinguirlas visualmente.
2. Utiliza nombres de tablas y columnas en minúsculas.
3. Separa palabras con guion bajo: `anio_publicacion`.
4. Evita espacios y tildes en nombres técnicos.
5. Escribe textos entre comillas simples: `'Cuaderno Azul'`.
6. No escribas números entre comillas cuando representen cantidades.
7. Finaliza cada instrucción con punto y coma.
8. Utiliza comentarios para explicar secciones, no para repetir lo evidente.

SQL no exige mayúsculas para sus palabras clave, pero esta convención mejora la lectura.

## 5.3 Comentarios

Un comentario de una línea comienza con dos guiones:

```sql
-- Esta sección crea la estructura inicial.
```

El motor ignora el comentario.

## 5.4 Crear una tabla con `CREATE TABLE`

Escribe lo siguiente en la pestaña **Execute SQL** de DB Browser:

```sql
CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    precio REAL,
    stock INTEGER,
    descripcion TEXT
);
```

### Lectura en lenguaje cotidiano

```text
Crea una tabla llamada productos.
La tabla tendrá cinco columnas.
id será un número entero que identifica cada registro.
nombre almacenará texto.
precio almacenará números con decimales.
stock almacenará números enteros.
descripcion almacenará texto.
```

### Anatomía

```text
CREATE TABLE productos (
│            │
│            └── nombre elegido para la tabla
└── acción solicitada

    nombre TEXT,
    │      │
    │      └── tipo de dato
    └── nombre de la columna
);
```

Las comas separan las definiciones de columnas. La última columna no necesita una coma antes del paréntesis de cierre.

### Ejecuta y comprueba

1. Selecciona la instrucción completa.
2. Presiona el botón para ejecutar SQL.
3. Revisa que no aparezca un error.
4. Abre la pestaña **Database Structure**.
5. Comprueba que exista la tabla `productos`.

## 5.5 Insertar un registro con `INSERT`

```sql
INSERT INTO productos (
    id,
    nombre,
    precio,
    stock,
    descripcion
) VALUES (
    1,
    'Cuaderno Azul',
    1.75,
    20,
    'Cuaderno de 100 páginas'
);
```

La lista después del nombre de la tabla indica qué columnas recibirán valores. La lista después de `VALUES` contiene los valores en el mismo orden.

```text
id           → 1
nombre       → 'Cuaderno Azul'
precio       → 1.75
stock        → 20
descripcion  → 'Cuaderno de 100 páginas'
```

Es buena práctica escribir los nombres de las columnas. Así el script es más claro y menos dependiente del orden interno de la tabla.

## 5.6 Insertar varios registros

```sql
INSERT INTO productos (id, nombre, precio, stock, descripcion)
VALUES
    (2, 'Lápiz HB', 0.50, 65, NULL),
    (3, 'Mochila gris', 19.90, 8, 'Mochila con dos compartimentos'),
    (4, 'Borrador blanco', 0.35, 40, NULL);
```

Cada grupo entre paréntesis representa una fila. Las filas se separan mediante comas.

### Comprobación

Después de ejecutar la inserción:

1. Selecciona **Write Changes** si existen cambios pendientes.
2. Abre **Browse Data**.
3. Selecciona la tabla `productos`.
4. Comprueba que existan cuatro filas.

## 5.7 Consultar toda la tabla con `SELECT`

```sql
SELECT *
FROM productos;
```

El asterisco significa “todas las columnas”. Es útil para explorar una tabla pequeña durante el aprendizaje.

Resultado esperado:

| id | nombre | precio | stock | descripcion |
|---:|---|---:|---:|---|
| 1 | Cuaderno Azul | 1.75 | 20 | Cuaderno de 100 páginas |
| 2 | Lápiz HB | 0.50 | 65 | `NULL` |
| 3 | Mochila gris | 19.90 | 8 | Mochila con dos compartimentos |
| 4 | Borrador blanco | 0.35 | 40 | `NULL` |

## 5.8 Seleccionar columnas concretas

```sql
SELECT nombre, precio
FROM productos;
```

El resultado contiene solamente las columnas solicitadas:

| nombre | precio |
|---|---:|
| Cuaderno Azul | 1.75 |
| Lápiz HB | 0.50 |
| Mochila gris | 19.90 |
| Borrador blanco | 0.35 |

En proyectos profesionales es preferible pedir únicamente las columnas necesarias. El resultado es más claro y evita transportar información que no se utilizará.

## 5.9 Cambiar el encabezado del resultado con `AS`

```sql
SELECT
    nombre AS producto,
    precio AS precio_unitario
FROM productos;
```

`AS` crea un alias para mostrar el resultado. No cambia el nombre real de la columna dentro de la tabla.

| producto | precio_unitario |
|---|---:|
| Cuaderno Azul | 1.75 |
| Lápiz HB | 0.50 |
| Mochila gris | 19.90 |
| Borrador blanco | 0.35 |

## 5.10 Orden recomendado de un script

```sql
-- =====================================================
-- COA - SQL y Bases de Datos Relacionales
-- Módulo 1
-- Estudiante: Escribe aquí tu nombre
-- Proyecto: Ejemplo de productos
-- =====================================================

-- 1. CREACIÓN DE LA TABLA

CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    precio REAL,
    stock INTEGER,
    descripcion TEXT
);

-- 2. INSERCIÓN DE DATOS

INSERT INTO productos (id, nombre, precio, stock, descripcion)
VALUES
    (1, 'Cuaderno Azul', 1.75, 20, 'Cuaderno de 100 páginas'),
    (2, 'Lápiz HB', 0.50, 65, NULL),
    (3, 'Mochila gris', 19.90, 8, 'Mochila con dos compartimentos');

-- 3. CONSULTAS

-- Consulta 1: muestra todos los datos.
SELECT *
FROM productos;

-- Consulta 2: muestra el nombre y el precio.
SELECT nombre, precio
FROM productos;
```

Un script bien organizado permite revisar el trabajo y ejecutarlo en el orden correcto.

### Práctica guiada 3 — Construir y ejecutar el script completo

1. Crea una base nueva llamada `tienda_practica.db`.
2. Copia el script anterior en **Execute SQL**.
3. Cambia el nombre del estudiante.
4. Ejecuta primero `CREATE TABLE`.
5. Ejecuta después `INSERT`.
6. Ejecuta cada consulta por separado.
7. Comprueba la tabla mediante **Browse Data**.
8. Guarda el script como `practica_productos.sql` dentro de la carpeta `scripts`.

### Práctica guiada 4 — Explicar una consulta

Observa:

```sql
SELECT
    nombre AS articulo,
    stock AS unidades_disponibles
FROM productos;
```

Antes de ejecutarla, responde:

1. ¿Qué tabla utiliza?
2. ¿Qué columnas reales solicita?
3. ¿Qué encabezados mostrará?
4. ¿Modifica algún dato?
5. ¿Cuántas columnas tendrá el resultado?

Después ejecútala y compara el resultado con tu predicción.

---

# 6. Buenas prácticas y errores frecuentes

## 6.1 Nombres poco claros

Evita:

```text
t1
cosas
dato
x
tabla_final_buena
```

Prefiere:

```text
productos
libros
anio_publicacion
duracion_horas
precio_unitario
```

## 6.2 Espacios y tildes en nombres técnicos

Evita:

```sql
CREATE TABLE "Catálogo de Libros" (
    "Año de Publicación" INTEGER
);
```

Aunque algunos motores permiten identificadores entre comillas, obligan a recordar reglas adicionales.

Prefiere:

```sql
CREATE TABLE libros (
    anio_publicacion INTEGER
);
```

La información visible para una persona sí puede conservar tildes:

```sql
INSERT INTO libros (id, titulo)
VALUES (1, 'Introducción a la programación');
```

## 6.3 Olvidar las comillas del texto

Incorrecto:

```sql
INSERT INTO productos (id, nombre)
VALUES (1, Cuaderno Azul);
```

Correcto:

```sql
INSERT INTO productos (id, nombre)
VALUES (1, 'Cuaderno Azul');
```

## 6.4 Escribir números como texto

Evita:

```sql
INSERT INTO productos (id, precio, stock)
VALUES ('1', '19.90', '8');
```

Prefiere:

```sql
INSERT INTO productos (id, precio, stock)
VALUES (1, 19.90, 8);
```

## 6.5 Confundir `NULL` con texto

```sql
-- Ausencia real de valor
NULL

-- Texto compuesto por cuatro letras
'NULL'
```

## 6.6 Desorden entre columnas y valores

Este ejemplo es sintácticamente válido, pero los valores están intercambiados:

```sql
INSERT INTO productos (id, nombre, precio)
VALUES (1, 19.90, 'Mochila gris');
```

Lee siempre las dos listas en paralelo.

## 6.7 Volver a ejecutar `CREATE TABLE`

Si ejecutas dos veces la misma instrucción sobre la misma base, SQLite puede indicar que la tabla ya existe.

En este módulo, la forma más sencilla de repetir una práctica completa es crear una base de datos vacía y ejecutar el script una sola vez. Más adelante aprenderás instrucciones para modificar y eliminar estructuras de manera controlada.

## 6.8 Olvidar guardar el script

El archivo `.db` conserva la base, pero no reemplaza al script. El instructor necesita comprobar cómo fue construida.

Conserva ambos:

```text
biblioteca.db   → base de datos resultante
biblioteca.sql  → instrucciones que permiten reconstruirla
```

---

# 7. Ejercicios individuales

Intenta resolverlos antes de consultar las soluciones explicadas.

## Ejercicio 1 — Dato o información

Clasifica cada caso como **dato aislado** o **información con contexto**. Justifica cada respuesta en una oración.

1. `42`.
2. “La habitación 42 está disponible”.
3. `2026-08-02`.
4. “El curso comienza el 2 de agosto de 2026”.
5. `'Pendiente'`.
6. “El pedido 18 tiene estado pendiente”.

## Ejercicio 2 — Base de datos, gestor o lenguaje

Relaciona cada elemento con la categoría correcta: **base de datos**, **sistema gestor**, **herramienta gráfica** o **lenguaje**.

1. SQL.
2. SQLite.
3. `inventario.db`.
4. DB Browser for SQLite.
5. PostgreSQL.
6. `hotel.db`.

Después explica cómo colaboran los cuatro conceptos durante una práctica del curso.

## Ejercicio 3 — Anatomía de una tabla

Observa:

| id | mascota | especie | edad |
|---:|---|---|---:|
| 1 | Luna | Gato | 3 |
| 2 | Max | Perro | 5 |
| 3 | Kiwi | Ave | 2 |

Responde:

1. ¿Cuál podría ser el nombre de la tabla?
2. ¿Cuántas columnas tiene?
3. ¿Cuántos registros contiene?
4. ¿Cuál es el valor de `especie` para el registro con `id` 3?
5. ¿Qué representa cada fila?
6. Escribe el esquema utilizando un árbol de texto.

## Ejercicio 4 — Elegir tipos

Selecciona `INTEGER`, `REAL` o `TEXT` para cada columna y explica brevemente la decisión.

1. `nombre_completo`.
2. `cantidad_asistentes`.
3. `precio_entrada`.
4. `telefono`.
5. `anio_nacimiento`.
6. `codigo_estudiante`.
7. `promedio_calificacion`.
8. `ciudad`.

## Ejercicio 5 — Comprender `NULL`

Una agenda permite registrar nombre, teléfono principal y teléfono secundario.

Para una persona que no proporcionó número secundario, decide cuál de estos valores representa correctamente la situación y explica por qué los otros no son equivalentes:

```text
0
''
'No tiene'
'NULL'
NULL
```

## Ejercicio 6 — Reparar una tabla

El siguiente código contiene errores de sintaxis y de claridad:

```sql
CREATE TABLE Cursos COA (
    id INTEGER PRIMARY KEY
    nombre TEXT,
    duración INTEGER,
    precio REAL,
);
```

Realiza estas tareas:

1. Corrige el nombre de la tabla.
2. Corrige la separación entre columnas.
3. Reemplaza el nombre técnico que contiene una tilde.
4. Elimina cualquier coma innecesaria.
5. Añade el punto y coma final.
6. Ejecuta la solución en una base vacía.

## Ejercicio 7 — Reparar inserciones

La tabla correcta es:

```sql
CREATE TABLE materiales (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    precio REAL,
    cantidad INTEGER,
    observacion TEXT
);
```

Corrige las inserciones:

```sql
INSERT INTO materiales (id, nombre, precio, cantidad, observacion)
VALUES (1, Marcador negro, '1.25', 30, NULL);

INSERT INTO materiales (id, nombre, precio, cantidad, observacion)
VALUES (2, 'Papel tamaño carta', 5.90, '10', 'NULL');
```

La observación del segundo material es desconocida. Los precios deben almacenarse como números y las cantidades como enteros.

## Ejercicio 8 — Predecir consultas

Utiliza la tabla `materiales` del ejercicio anterior. Sin ejecutar primero, describe los encabezados que producirá cada consulta:

```sql
SELECT *
FROM materiales;
```

```sql
SELECT nombre, cantidad
FROM materiales;
```

```sql
SELECT
    nombre AS material,
    precio AS precio_unitario
FROM materiales;
```

Después ejecútalas y comprueba tu predicción.

## Ejercicio 9 — Diseñar una tabla de películas

Cada fila representará una película. Se necesita almacenar:

- Identificador.
- Título.
- Director.
- Año de estreno.
- Duración en minutos.
- Clasificación.
- Comentario opcional.

Realiza estas tareas:

1. Propón nombres técnicos para las columnas.
2. Selecciona un tipo para cada columna.
3. Escribe la instrucción `CREATE TABLE`.
4. Inserta tres películas inventadas.
5. Una película debe tener `NULL` como comentario.
6. Escribe una consulta de todas las columnas.
7. Escribe otra consulta que muestre solamente título y director.

## Ejercicio 10 — Organizar un script desordenado

Las siguientes instrucciones aparecen desordenadas:

```sql
SELECT titulo, artista FROM canciones;

INSERT INTO canciones (id, titulo, artista, duracion_segundos)
VALUES (1, 'Luz de invierno', 'Grupo Horizonte', 214);

CREATE TABLE canciones (
    id INTEGER PRIMARY KEY,
    titulo TEXT,
    artista TEXT,
    duracion_segundos INTEGER
);
```

Construye un archivo SQL profesional que incluya:

1. Encabezado con nombre y actividad.
2. Sección de creación.
3. Sección de inserción.
4. Sección de consultas.
5. Comentario que explique qué muestra la consulta.

---

# 8. Soluciones explicadas de los ejercicios

## Solución del ejercicio 1

1. `42`: dato aislado; no existe contexto.
2. “La habitación 42 está disponible”: información; relaciona un número con una habitación y un estado.
3. `2026-08-02`: dato aislado; se reconoce como fecha, pero no se conoce su propósito.
4. “El curso comienza el 2 de agosto de 2026”: información; la fecha tiene significado.
5. `'Pendiente'`: dato aislado; no indica qué está pendiente.
6. “El pedido 18 tiene estado pendiente”: información; relaciona el estado con una entidad identificable.

## Solución del ejercicio 2

| Elemento | Categoría |
|---|---|
| SQL | Lenguaje |
| SQLite | Sistema gestor o motor |
| `inventario.db` | Base de datos |
| DB Browser for SQLite | Herramienta gráfica |
| PostgreSQL | Sistema gestor |
| `hotel.db` | Base de datos |

DB Browser permite escribir instrucciones SQL que SQLite ejecuta sobre un archivo de base de datos.

## Solución del ejercicio 3

1. Un nombre apropiado sería `mascotas`.
2. Tiene cuatro columnas.
3. Contiene tres registros.
4. El valor es `Ave`.
5. Cada fila representa una mascota.
6. Esquema posible:

```text
mascotas
├── id INTEGER
├── mascota TEXT
├── especie TEXT
└── edad INTEGER
```

## Solución del ejercicio 4

| Columna | Tipo sugerido | Razón |
|---|---|---|
| `nombre_completo` | `TEXT` | Contiene caracteres |
| `cantidad_asistentes` | `INTEGER` | Es una cantidad entera |
| `precio_entrada` | `REAL` | Puede incluir decimales |
| `telefono` | `TEXT` | Es un identificador y puede incluir símbolos |
| `anio_nacimiento` | `INTEGER` | Es un año entero |
| `codigo_estudiante` | `TEXT` | Puede contener letras o ceros iniciales |
| `promedio_calificacion` | `REAL` | Puede incluir decimales |
| `ciudad` | `TEXT` | Contiene caracteres |

## Solución del ejercicio 5

El valor correcto es `NULL` sin comillas.

- `0` es un número.
- `''` es un texto de longitud cero.
- `'No tiene'` es una frase.
- `'NULL'` es un texto de cuatro letras.
- `NULL` representa ausencia de valor.

## Solución del ejercicio 6

```sql
CREATE TABLE cursos_coa (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    duracion INTEGER,
    precio REAL
);
```

## Solución del ejercicio 7

```sql
INSERT INTO materiales (id, nombre, precio, cantidad, observacion)
VALUES (1, 'Marcador negro', 1.25, 30, NULL);

INSERT INTO materiales (id, nombre, precio, cantidad, observacion)
VALUES (2, 'Papel tamaño carta', 5.90, 10, NULL);
```

## Solución del ejercicio 8

- La primera consulta muestra `id`, `nombre`, `precio`, `cantidad` y `observacion`.
- La segunda muestra `nombre` y `cantidad`.
- La tercera muestra dos columnas cuyos encabezados son `material` y `precio_unitario`.

## Solución orientativa del ejercicio 9

```sql
CREATE TABLE peliculas (
    id INTEGER PRIMARY KEY,
    titulo TEXT,
    director TEXT,
    anio_estreno INTEGER,
    duracion_minutos INTEGER,
    clasificacion TEXT,
    comentario TEXT
);

INSERT INTO peliculas (
    id,
    titulo,
    director,
    anio_estreno,
    duracion_minutos,
    clasificacion,
    comentario
) VALUES
    (1, 'La ruta invisible', 'Marina Soto', 2023, 102, 'Todo público', 'Aventura familiar'),
    (2, 'Código del océano', 'Diego Rojas', 2024, 118, 'Mayores de 12', NULL),
    (3, 'Una tarde en Marte', 'Laura Méndez', 2022, 95, 'Todo público', 'Ciencia ficción');

SELECT *
FROM peliculas;

SELECT titulo, director
FROM peliculas;
```

## Solución del ejercicio 10

```sql
-- =====================================================
-- COA - Módulo 1
-- Estudiante: Escribe aquí tu nombre
-- Actividad: Catálogo de canciones
-- =====================================================

-- 1. CREACIÓN

CREATE TABLE canciones (
    id INTEGER PRIMARY KEY,
    titulo TEXT,
    artista TEXT,
    duracion_segundos INTEGER
);

-- 2. INSERCIÓN

INSERT INTO canciones (id, titulo, artista, duracion_segundos)
VALUES (1, 'Luz de invierno', 'Grupo Horizonte', 214);

-- 3. CONSULTAS

-- Muestra el título y el artista de las canciones registradas.
SELECT titulo, artista
FROM canciones;
```

---

# 9. Mini proyecto — Agenda de contactos personales

## Objetivo

Crear una base de datos pequeña desde cero para registrar contactos mediante una tabla, insertar información coherente y consultarla de diferentes maneras.

## Situación

Necesitas reemplazar una lista de contactos escrita en notas sueltas. Cada contacto puede tener nombre, teléfono, correo, ciudad y una nota opcional.

## Resultado esperado

```text
agenda_contactos.db
└── contactos
    ├── id
    ├── nombre
    ├── telefono
    ├── correo
    ├── ciudad
    └── nota
```

## Requisitos obligatorios

1. Crea una base denominada `agenda_contactos.db`.
2. Crea una tabla denominada `contactos`.
3. Utiliza los nombres de columna mostrados en el esquema.
4. Selecciona tipos coherentes.
5. Inserta al menos seis contactos inventados.
6. Dos contactos deben tener `NULL` en la columna `nota`.
7. Incluye una consulta que muestre todas las columnas.
8. Incluye una consulta que muestre `nombre` y `telefono`.
9. Incluye una consulta que muestre `nombre`, `correo` y `ciudad`.
10. Incluye una consulta con los alias `contacto` y `numero_telefonico`.
11. Añade comentarios para separar creación, inserción y consultas.
12. Guarda el script como `mini_proyecto_agenda.sql`.

## Proceso recomendado

### Paso 1. Define qué representa cada fila

Completa:

> Cada fila de la tabla `contactos` representa ____________.

### Paso 2. Diseña la estructura

Escribe primero una tabla de planificación:

| Columna | Tipo | Ejemplo |
|---|---|---|
| `id` |  |  |
| `nombre` |  |  |
| `telefono` |  |  |
| `correo` |  |  |
| `ciudad` |  |  |
| `nota` |  |  |

### Paso 3. Crea una base vacía

No reutilices la base de la práctica anterior.

### Paso 4. Escribe y ejecuta `CREATE TABLE`

Comprueba la estructura antes de insertar datos.

### Paso 5. Inserta los seis contactos

Revisa que el orden de columnas coincida con el orden de valores.

### Paso 6. Ejecuta las consultas

Predice los encabezados y compáralos con el resultado.

### Paso 7. Guarda el script

El script debe poder ejecutarse sobre una base vacía.

## Lista de comprobación

- [ ] La base abre correctamente.
- [ ] La tabla se llama `contactos`.
- [ ] Cada fila representa una persona de contacto.
- [ ] Existen seis registros.
- [ ] Los teléfonos se almacenan como texto.
- [ ] Existen dos valores `NULL` reales.
- [ ] Las cuatro consultas funcionan.
- [ ] El script está organizado y comentado.
- [ ] El archivo `.sql` fue guardado.

Este mini proyecto es una actividad obligatoria de práctica. Se conservará como evidencia de trabajo, pero no necesita un formulario independiente.

---

# 10. Proyecto del módulo — Catálogo digital de una biblioteca

## Desafío

Una biblioteca pequeña mantiene su catálogo en documentos separados. La información está repetida, algunos campos aparecen en distinto orden y resulta difícil compartir una vista clara de los libros disponibles.

Tu tarea es construir la primera versión de su catálogo con SQLite.

El objetivo de este módulo no es diseñar todavía un sistema completo de préstamos. Debes demostrar que comprendes la estructura de una tabla, los tipos de datos, la inserción de registros y las consultas básicas.

## Qué representa la tabla

Cada fila debe representar un libro del catálogo.

```text
libros
├── id
├── titulo
├── autor
├── genero
├── anio_publicacion
├── editorial
├── paginas
└── estado
```

## Requisitos de la base de datos

1. La base debe llamarse `biblioteca.db`.
2. Debe contener una tabla llamada `libros`.
3. La tabla debe contener exactamente las ocho columnas indicadas.
4. `id`, `anio_publicacion` y `paginas` deben utilizar un tipo entero.
5. Las demás columnas deben utilizar un tipo de texto.
6. `id` debe definirse como `INTEGER PRIMARY KEY`.
7. No se deben crear tablas adicionales en este módulo.

## Requisitos de los datos

1. Inserta al menos doce libros.
2. Utiliza títulos y autores inventados para demostrar autoría del conjunto de datos.
3. Incluye por lo menos tres géneros diferentes.
4. Incluye años de publicación diferentes.
5. Incluye libros de por lo menos tres editoriales.
6. Utiliza únicamente estos valores para `estado`:

```text
Disponible
Prestado
Mantenimiento
```

7. Dos libros deben tener `NULL` como editorial porque la información no se conoce.
8. Cada identificador debe ser distinto.

## Consultas obligatorias

Incluye y ejecuta estas consultas:

### Consulta 1 — Catálogo completo

Muestra todas las columnas de todos los registros.

### Consulta 2 — Vista de lectura rápida

Muestra solamente `titulo` y `autor`.

### Consulta 3 — Información editorial

Muestra `titulo`, `editorial` y `anio_publicacion`.

### Consulta 4 — Extensión de los libros

Muestra `titulo` y `paginas`.

### Consulta 5 — Estado del catálogo

Muestra `titulo` y `estado`.

### Consulta 6 — Encabezados comprensibles

Muestra:

- `titulo` con el alias `libro`.
- `autor` con el alias `escrito_por`.
- `estado` con el alias `situacion_actual`.

### Consulta 7 — Selección propia

Selecciona tres columnas que consideres útiles para una persona que revisa el catálogo. Añade un comentario que explique por qué elegiste esas columnas.

## Organización obligatoria del script

El archivo deberá seguir esta estructura:

```sql
-- =====================================================
-- COA - SQL y Bases de Datos Relacionales
-- Módulo 1
-- Estudiante: Nombre y apellidos
-- Proyecto: Catálogo digital de una biblioteca
-- Fecha: AAAA-MM-DD
-- =====================================================

-- 1. CREACIÓN DE LA TABLA

-- Escribe aquí CREATE TABLE.

-- 2. INSERCIÓN DE DATOS

-- Escribe aquí INSERT.

-- 3. CONSULTAS OBLIGATORIAS

-- Consulta 1: catálogo completo.

-- Continúa con las demás consultas.
```

No copies los comentarios de instrucción como sustituto del código. Completa cada sección.

## Proceso de construcción

### Fase 1. Analiza la información

Explica qué representa una fila y qué significa cada columna.

### Fase 2. Planifica los tipos

Completa una tabla con columna, tipo y ejemplo antes de escribir SQL.

### Fase 3. Crea una base vacía

Guarda `biblioteca.db` dentro de la carpeta del proyecto.

### Fase 4. Escribe la estructura

Ejecuta `CREATE TABLE` y revisa el esquema en DB Browser.

### Fase 5. Prepara los datos

Escribe los doce registros. Comprueba comillas, números, comas y valores `NULL`.

### Fase 6. Inserta y verifica

Ejecuta `INSERT` y confirma que la tabla contenga doce filas.

### Fase 7. Escribe las consultas

Ejecuta cada consulta por separado y comprueba los encabezados.

### Fase 8. Prueba el script desde cero

1. Crea otra base vacía de prueba.
2. Ejecuta el script completo una sola vez.
3. Comprueba que no necesite correcciones manuales.
4. Conserva como entrega la base y el script definitivos.

### Fase 9. Documenta

Prepara una explicación breve que incluya:

- Qué problema resuelve la base.
- Qué representa cada fila.
- Por qué elegiste cada tipo de dato.
- Por qué dos editoriales utilizan `NULL`.
- Qué consulta consideras más útil y por qué.
- Qué limitaciones posee esta primera versión.

### Fase 10. Revisa la entrega

Utiliza la lista de comprobación y corrige cualquier error antes de enviar.

## Restricciones

- No utilices Python ni otro lenguaje de programación.
- No utilices varias tablas.
- No utilices `JOIN`, filtros, agrupaciones ni funciones que todavía no se han estudiado.
- No sustituyas el script por capturas.
- No entregues únicamente el archivo `.db`.
- No utilices datos personales reales.
- No copies un conjunto de datos de otra persona.

## Lista de comprobación del proyecto

- [ ] El archivo se llama `biblioteca.db`.
- [ ] Existe una sola tabla llamada `libros`.
- [ ] La tabla contiene las ocho columnas obligatorias.
- [ ] Los tipos de datos son coherentes.
- [ ] `id` es `INTEGER PRIMARY KEY`.
- [ ] Existen al menos doce libros inventados.
- [ ] Existen por lo menos tres géneros y tres editoriales.
- [ ] Dos editoriales contienen `NULL` real.
- [ ] Los estados utilizan solamente los valores permitidos.
- [ ] Las siete consultas funcionan.
- [ ] Los alias de la consulta 6 son correctos.
- [ ] El script contiene encabezado, secciones y comentarios.
- [ ] El script fue probado sobre una base vacía.
- [ ] La explicación del diseño está completa.
- [ ] Las capturas son legibles y están numeradas.
- [ ] Los nombres de los archivos siguen el estándar COA.

## Condición de avance

El proyecto debe alcanzar al menos 70 puntos y cumplir todos los requisitos críticos. Si necesita correcciones, deberás realizarlas y enviar una nueva versión antes de comenzar el Módulo 2.

---

# 11. Rúbrica de evaluación del proyecto

| Criterio | Evidencia esperada | Puntos |
|---|---|---:|
| Funcionamiento general | La base abre y el script se ejecuta sobre una base vacía sin errores | 20 |
| Estructura de la tabla | Nombre, columnas, identificador y tipos de datos correctos | 20 |
| Inserción de datos | Doce registros coherentes, originales y completos; `NULL` utilizado correctamente | 20 |
| Consultas | Las siete consultas producen las columnas y alias solicitados | 20 |
| Organización del SQL | Encabezado, comentarios, secciones, formato y nombres claros | 10 |
| Explicación y evidencias | Justificación comprensible y capturas legibles | 10 |
| **Total** |  | **100** |

## Requisitos críticos

El proyecto no puede aprobarse si ocurre cualquiera de estas situaciones:

- No se entrega el script SQL.
- El script no crea la tabla sobre una base vacía.
- La tabla o las inserciones contienen errores que impiden ejecutar el proyecto.
- No existen al menos doce registros.
- No se incluyen las consultas obligatorias.
- Los archivos entregados no corresponden al mismo proyecto.
- La entrega presenta contenido copiado sin comprensión demostrable.

Una presentación visual atractiva no compensa un proyecto que no funciona.

---

# 12. Evaluación práctica del módulo

## Situación

Un centro cultural necesita registrar sus talleres. Cada taller tiene identificador, nombre, instructor, duración en horas, cupo máximo, modalidad y observación opcional.

## Tareas

Sin copiar un ejemplo completo del módulo:

1. Propón nombres técnicos para las siete columnas.
2. Selecciona un tipo coherente para cada columna.
3. Crea una base vacía llamada `evaluacion_m01.db`.
4. Crea una tabla llamada `talleres`.
5. Inserta cinco talleres inventados.
6. Dos talleres deben tener una observación desconocida representada correctamente.
7. Escribe una consulta que muestre todas las columnas.
8. Escribe una consulta que muestre nombre, instructor y modalidad.
9. Escribe una consulta que muestre nombre y duración con los alias `taller` y `horas_totales`.
10. Añade comentarios que separen las secciones.

## Tiempo sugerido

**15 minutos**

## Criterios de dominio

- La tabla representa un solo tema.
- Los nombres técnicos son claros.
- Los tipos de datos son coherentes.
- Las inserciones respetan la estructura.
- `NULL` se utiliza sin comillas.
- Las tres consultas funcionan.
- El estudiante puede explicar cada instrucción.

La evaluación es práctica. No basta con definir `CREATE TABLE`, `INSERT` o `SELECT`; debes utilizarlos correctamente.

---

# 13. Punto de entrega obligatorio

Todo el módulo se entrega en un único punto. No debes enviar un formulario por cada ejercicio.

## Archivo principal

Comprime la entrega con este nombre:

```text
COA_SQL_M01_Apellido_Nombre.zip
```

Sustituye `Apellido` y `Nombre` por tus datos, sin tildes ni espacios. Ejemplo:

```text
COA_SQL_M01_Cerna_Victor.zip
```

## Contenido de la entrega

```text
COA_SQL_M01_Apellido_Nombre/
├── COA_SQL_M01_Apellido_Nombre.sql
├── biblioteca.db
├── explicacion_diseno.pdf
└── evidencias/
    ├── 01_estructura_tabla.png
    ├── 02_registros_insertados.png
    ├── 03_consulta_catalogo.png
    ├── 04_consulta_alias.png
    └── 05_prueba_script.png
```

## Qué debe mostrar cada evidencia

1. **Estructura:** tabla `libros` y sus ocho columnas.
2. **Registros:** al menos doce filas visibles.
3. **Consulta del catálogo:** resultado de una consulta con columnas explícitas.
4. **Consulta con alias:** encabezados solicitados en la consulta 6.
5. **Prueba del script:** ejecución correcta sobre una base vacía.

Una captura debe ser legible y mostrar solamente la información necesaria. No incluyas fotografías de la pantalla si puedes realizar una captura directa.

## Antes de enviar

1. Abre el archivo comprimido.
2. Comprueba que contiene todos los elementos.
3. Abre el script y verifica que no esté vacío.
4. Abre `biblioteca.db` y comprueba los datos.
5. Revisa que las capturas correspondan a la versión final.
6. Confirma que el nombre del archivo siga el formato COA.

El archivo `.db` facilita la revisión, pero el script SQL es la evidencia principal. Las capturas no sustituyen al código.

[Entregar el Módulo 1](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 14. Retos adicionales

Estos retos son opcionales. Realízalos después de completar el proyecto obligatorio.

## Reto 1 — Catálogo de videojuegos

Crea una tabla con identificador, título, estudio, plataforma, año y duración aproximada. Inserta ocho juegos inventados y crea tres consultas con distintas combinaciones de columnas.

## Reto 2 — Detectar tipos engañosos

Decide si estos datos deberían almacenarse como número o texto: número de pasaporte, talla de camiseta, porcentaje de descuento, placa de vehículo, número de apartamento y monto de una factura. Explica cada decisión.

## Reto 3 — Prueba de portabilidad

Busca en la documentación oficial de PostgreSQL o MySQL cómo se crea una tabla. Identifica qué partes del `CREATE TABLE` del proyecto se mantienen y qué parte del identificador automático podría escribirse de otra manera. No necesitas instalar otro motor.

## Reto 4 — Auditoría de nombres

Revisa todos los nombres de tablas, columnas, archivos y comentarios que utilizaste. Sustituye cualquier nombre ambiguo por uno que otra persona pueda comprender sin preguntarte.

---

# 15. Videos recomendados del módulo

## Video esencial 1

[¿Qué es una Base de Datos Relacional? — Fernando Herrera](https://www.youtube.com/watch?v=bqx7uQwUTs8)

**Tema exacto:** concepto de base de datos relacional.  
**Momento recomendado:** después de la sección 2.  
**Objetivo:** reforzar la diferencia entre información organizada y datos aislados.

## Video esencial 2

[Tutorial básico de SQLite: instalación en Windows y creación de una base de datos — Frank GP](https://www.youtube.com/watch?v=H8DURhGb53E)

**Tema exacto:** funcionamiento y casos de uso de SQLite.  
**Momento recomendado:** antes de crear la primera base.  
**Objetivo:** comprender por qué SQLite no necesita un servidor independiente.

Los videos complementan la práctica, pero no sustituyen la ejecución de los ejercicios.

---

# 16. Documentación y recursos de lectura

## Nivel esencial

- [Acerca de SQLite — documentación oficial](https://sqlite.org/about.html)
- [Inicio rápido de SQLite — documentación oficial](https://sqlite.org/quickstart.html)
- [DB Browser for SQLite — página oficial](https://sqlitebrowser.org/)
- [Descargas de DB Browser for SQLite](https://sqlitebrowser.org/dl/)

## Referencia de las instrucciones estudiadas

- [`CREATE TABLE` — documentación oficial de SQLite](https://sqlite.org/lang_createtable.html)
- [`INSERT` — documentación oficial de SQLite](https://sqlite.org/lang_insert.html)
- [`SELECT` — documentación oficial de SQLite](https://sqlite.org/lang_select.html)
- [Tipos de datos en SQLite — documentación oficial](https://sqlite.org/datatype3.html)

La documentación oficial está escrita principalmente en inglés y puede parecer técnica al inicio. No necesitas leerla completa. Utiliza el índice, busca la instrucción que necesitas, revisa la sintaxis y compara los ejemplos con tu código.

## Cómo leer documentación técnica sin intentar memorizarla

1. Define qué necesitas resolver.
2. Busca el nombre exacto de la instrucción.
3. Identifica un ejemplo mínimo.
4. Ejecuta el ejemplo en una base de prueba.
5. Cambia una parte y observa el resultado.
6. Registra la solución con tus propias palabras.

Consultar documentación es una habilidad profesional, no una señal de que olvidaste algo.

---

# 17. Glosario

| Término | Significado |
|---|---|
| Alias | Nombre temporal mostrado en el resultado de una consulta |
| Base de datos | Colección organizada de datos |
| Columna | Propiedad definida dentro de una tabla |
| Comentario | Texto del script que el motor ignora y que ayuda a documentar |
| Dato | Representación elemental de un hecho o valor |
| DB Browser for SQLite | Herramienta gráfica para trabajar con bases SQLite |
| DBMS | Sigla inglesa de sistema gestor de bases de datos |
| Esquema | Descripción de la estructura de una base o tabla |
| Fila | Conjunto de valores que representa una ocurrencia |
| Información | Datos organizados que poseen contexto y significado |
| `INSERT` | Instrucción utilizada para añadir registros |
| `INTEGER` | Tipo utilizado para números enteros |
| Motor | Software que interpreta instrucciones y administra la base |
| `NULL` | Ausencia de un valor conocido o aplicable |
| Registro | Otro nombre para una fila |
| `REAL` | Tipo utilizado para números con decimales |
| SGBD | Sistema gestor de bases de datos |
| `SELECT` | Instrucción utilizada para consultar datos |
| SQL | Lenguaje utilizado para trabajar con bases de datos relacionales |
| SQLite | Motor SQL ligero, incorporado y sin servidor independiente |
| Tabla | Estructura de filas y columnas que representa un tema |
| `TEXT` | Tipo utilizado para cadenas de caracteres |
| Valor | Contenido de una columna en una fila determinada |

---

# 18. Resumen del módulo

Una base de datos relacional organiza información en tablas. Cada tabla representa un tema, cada fila representa una ocurrencia y cada columna representa una propiedad.

La base de datos, el gestor y SQL cumplen funciones distintas:

```text
Base de datos → conserva la información
Gestor        → administra la base
SQL           → expresa las instrucciones
```

SQLite permite almacenar una base completa en un archivo y trabajar sin configurar un servidor. DB Browser proporciona una interfaz gráfica para crear la base, ejecutar SQL y revisar los resultados.

En este módulo utilizaste:

```sql
CREATE TABLE
INSERT INTO
SELECT
AS
```

También aprendiste a elegir tipos básicos, representar información ausente mediante `NULL` y conservar un script organizado que permita reconstruir el proyecto.

## Habilidades obtenidas

Ahora puedes:

- Explicar los conceptos esenciales de una base de datos relacional.
- Crear una base SQLite.
- Diseñar una tabla sencilla.
- Crear su estructura con SQL.
- Insertar registros coherentes.
- Consultar todas o algunas columnas.
- Utilizar alias en los resultados.
- Detectar errores frecuentes de sintaxis y tipos.
- Organizar y entregar un proyecto SQL reproducible.

## Antes de continuar

Comprueba que puedes responder y demostrar lo siguiente:

- ¿Qué diferencia existe entre SQLite, DB Browser, SQL y un archivo `.db`?
- ¿Qué representa una fila en tu proyecto?
- ¿Por qué un teléfono suele almacenarse como texto?
- ¿Por qué `NULL` no debe escribirse entre comillas?
- ¿Qué hace cada parte de una instrucción `CREATE TABLE`?
- ¿Cómo compruebas que un `INSERT` funcionó?
- ¿Por qué es mejor solicitar columnas concretas en muchas consultas?
- ¿Cómo reconstruirías tu base si solo conservaras el script?

No continúes con el Módulo 2 hasta que el proyecto haya sido aprobado. El siguiente módulo utilizará esta base para introducir claves, relaciones, restricciones y diseño relacional correcto.
