# COA — Cursos Online Avanzados

## SQL y Bases de Datos Relacionales

# Módulo 6. SQL profesional y proyecto final integrador

**Duración estimada:** 4 horas y 30 minutos  
**Nivel:** intermedio  
**Modalidad:** autodidacta y práctica  
**Motor de base de datos:** SQLite  
**Herramienta principal:** DB Browser for SQLite  
**Resultado principal:** una base de datos profesional y reproducible para la gestión de un hotel

---

## Bienvenida

Conocer instrucciones SQL no basta para entregar una solución profesional. Un proyecto real también debe poder reconstruirse, verificarse, mantenerse y explicarse.

En este módulo integrarás todo el curso. Diseñarás un sistema, protegerás sus reglas, cargarás datos de prueba, ejecutarás operaciones seguras y construirás reportes. Además, aprenderás tres herramientas de cierre:

- **Vistas**, para dar nombre a consultas reutilizables.
- **Índices**, para facilitar determinadas búsquedas con un costo consciente.
- **`EXPLAIN QUERY PLAN`**, para observar la estrategia elegida por SQLite.

```text
Problema real
    ↓
Reglas y modelo
    ↓
Esquema con integridad
    ↓
Datos y operaciones seguras
    ↓
Consultas, vista e índice
    ↓
Verificación y documentación
    ↓
Entrega reproducible
```

> **Principio del módulo:** una solución profesional no solo funciona en tu computadora; otra persona puede reconstruirla, comprobarla y comprender por qué fue diseñada así.

---

## Conocimientos previos

Debes haber aprobado los módulos 1 a 5 y poder:

- Diseñar tablas normalizadas.
- Crear claves, restricciones y relaciones.
- Insertar, actualizar y eliminar datos de forma segura.
- Utilizar transacciones.
- Construir consultas con filtros, funciones y agregaciones.
- Combinar tablas mediante `JOIN`.
- Utilizar subconsultas, `EXISTS`, CTE y operaciones de conjuntos.
- Interpretar valores `NULL` y casos sin coincidencia.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Organizar un proyecto SQL por secciones ejecutables.
- Crear un script que reconstruya una solución desde una base vacía.
- Crear y utilizar vistas.
- Explicar qué problema resuelve un índice.
- Reconocer el costo de mantener índices.
- Elegir columnas razonables para un índice simple o compuesto.
- Evitar índices duplicados o poco útiles.
- Crear y eliminar índices.
- Interpretar `SCAN`, `SEARCH` y búsquedas mediante índice.
- Comparar un plan antes y después de un cambio.
- Entender las limitaciones de `EXPLAIN QUERY PLAN`.
- Explicar consultas parametrizadas e inyección SQL a nivel conceptual.
- Inspeccionar tablas, claves foráneas e índices.
- Verificar la integridad estructural y referencial.
- Preparar un respaldo verificable.
- Identificar diferencias de portabilidad.
- Documentar reglas, decisiones y consultas.
- Auditar una base de datos existente.
- Diseñar y defender un proyecto integrador completo.

---

## Producto final

Construirás un sistema de gestión hotelera con al menos estas entidades:

```text
tipos_habitacion 1 ───< habitaciones 1 ───< reservaciones >─── 1 huespedes
                                               │
                                               ├────< pagos
                                               │
                                               └────< consumos >──── 1 servicios
```

El proyecto demostrará:

- Diseño relacional.
- Integridad y reglas de negocio.
- DDL, DML y transacciones.
- Consultas simples y multitabla.
- Agregaciones, subconsultas y CTE.
- Una vista útil.
- Un índice justificado.
- Evidencia del plan de consulta.
- Seguridad conceptual al conectar una aplicación.
- Portabilidad y documentación.

---

## Ruta de trabajo y distribución del tiempo

| Actividad | Tiempo aproximado |
|---|---:|
| Conceptos y demostraciones | 30 minutos |
| Prácticas guiadas | 35 minutos |
| Ejercicios individuales y diagnóstico | 20 minutos |
| Mini proyecto: auditoría de mensajería | 20 minutos |
| Proyecto final integrador | 150 minutos |
| Evaluación y preparación de la entrega | 15 minutos |
| **Total** | **4 horas y 30 minutos** |

El proyecto final dispone de 150 minutos dentro del curso para construir una primera versión completa. La revisión personal y las correcciones solicitadas pueden requerir tiempo adicional.

---

# 1. Organización profesional de un proyecto SQL

## 1.1 Un archivo debe contar una historia ejecutable

Orden recomendado:

```text
01. Configuración
02. Eliminación segura de objetos anteriores
03. Creación de tablas
04. Creación de índices necesarios
05. Carga de datos
06. Operaciones y transacciones demostrativas
07. Creación de vistas
08. Consultas y reportes
09. Verificaciones finales
```

En un proyecto pequeño puede utilizarse un solo archivo claramente dividido. En un equipo real suele separarse:

```text
sql/
├── 01_esquema.sql
├── 02_datos_prueba.sql
├── 03_operaciones.sql
├── 04_vistas_indices.sql
├── 05_reportes.sql
└── 06_verificacion.sql
```

La entrega del curso utilizará un archivo principal para facilitar la revisión, pero deberá conservar estas secciones.

## 1.2 Encabezado recomendado

```sql
-- ================================================================
-- COA - SQL y Bases de Datos Relacionales
-- Proyecto: Sistema de gestion de hotel
-- Estudiante: Nombre Apellido
-- Version: 1.0
-- Motor: SQLite
-- ================================================================

PRAGMA foreign_keys = ON;
```

## 1.3 Reproducibilidad

Un script reproducible:

- Se ejecuta en una base vacía.
- Crea los objetos en orden válido.
- Carga datos suficientes.
- No depende de clics o correcciones manuales.
- Termina en un estado conocido.
- Puede volver a probarse en una copia.

Si se incluyen instrucciones `DROP`, deben respetar dependencias:

```text
Eliminar primero: vistas y tablas hijas
Eliminar al final: tablas padre

Crear primero: tablas padre
Crear al final: tablas hijas
```

No ejecutes un script destructivo sobre una base con información valiosa. Utiliza una copia de práctica.

---

# 2. Vistas con `CREATE VIEW`

## 2.1 Una consulta con nombre

Una vista guarda la definición de una consulta, no una copia independiente de sus resultados.

```sql
CREATE VIEW vista_reservaciones_activas AS
SELECT
    r.id AS reservacion_id,
    h.nombre AS huesped,
    hb.numero AS habitacion,
    r.fecha_entrada,
    r.fecha_salida,
    r.estado
FROM reservaciones AS r
INNER JOIN huespedes AS h
    ON h.id = r.huesped_id
INNER JOIN habitaciones AS hb
    ON hb.id = r.habitacion_id
WHERE r.estado IN ('Confirmada', 'Hospedada');
```

Después puede consultarse como una tabla:

```sql
SELECT huesped, habitacion, fecha_entrada, fecha_salida
FROM vista_reservaciones_activas
ORDER BY fecha_entrada, habitacion;
```

## 2.2 Qué aporta una vista

- Reutiliza una consulta frecuente.
- Oculta complejidad accidental.
- Presenta nombres claros.
- Ofrece una interfaz de lectura estable.
- Puede exponer solo columnas necesarias.

## 2.3 Qué no hace

- No garantiza un orden. Utiliza `ORDER BY` al consultarla.
- No reemplaza restricciones de las tablas.
- No mejora automáticamente el rendimiento.
- No acepta parámetros.
- No guarda resultados de forma materializada en SQLite.

En SQLite, las vistas son de solo lectura de forma predeterminada. Es posible hacerlas modificables con disparadores `INSTEAD OF`, pero ese tema queda fuera del alcance.

## 2.4 Eliminar y recrear

```sql
DROP VIEW IF EXISTS vista_reservaciones_activas;
```

Define nombres de columnas claros dentro de `SELECT`. Evita `SELECT *`, pues un cambio en las tablas puede alterar inesperadamente la interfaz de la vista.

---

# 3. Índices: una ruta adicional hacia los datos

## 3.1 Analogía

Un libro puede leerse página por página para encontrar un concepto. El índice permite localizar una referencia y saltar a la página adecuada.

```text
Sin índice: revisar muchas filas
Con índice: buscar una clave y localizar un subconjunto
```

Un índice es una estructura adicional mantenida por el motor. Puede acelerar determinadas lecturas, pero consume espacio y debe actualizarse al insertar, modificar o eliminar datos.

## 3.2 Índices que ya existen

SQLite crea estructuras automáticamente para:

- Una clave `INTEGER PRIMARY KEY`, integrada con el identificador interno.
- Restricciones `UNIQUE`, mediante índices automáticos cuando son necesarios.

Por eso este índice suele ser redundante:

```sql
CREATE TABLE huespedes (
    id INTEGER PRIMARY KEY,
    correo TEXT NOT NULL UNIQUE
);

-- Generalmente innecesario: UNIQUE ya protege y apoya la búsqueda
CREATE INDEX idx_huespedes_correo ON huespedes(correo);
```

SQLite no crea automáticamente un índice para cada clave foránea hija. Una columna foránea utilizada con frecuencia en uniones puede ser candidata, pero debe justificarse.

## 3.3 Crear un índice

```sql
CREATE INDEX idx_reservaciones_habitacion_fechas
ON reservaciones (habitacion_id, fecha_entrada, fecha_salida);
```

Nombre recomendado:

```text
idx_<tabla>_<columnas>
```

## 3.4 Índice compuesto y orden de columnas

Un índice `(habitacion_id, fecha_entrada)` ayuda especialmente a consultas que comienzan por:

```sql
WHERE habitacion_id = ?
  AND fecha_entrada >= ?
```

También puede ayudar con `habitacion_id` por sí solo. Normalmente no equivale a un índice que comience solamente por `fecha_entrada`. El orden debe reflejar los filtros y órdenes más frecuentes.

## 3.5 Candidatos razonables

- Columnas buscadas frecuentemente con igualdad o rangos selectivos.
- Claves foráneas usadas en uniones frecuentes.
- Combinaciones que apoyan filtro y orden.
- Columnas utilizadas para localizar pocas filas dentro de muchas.

## 3.6 Cuándo no añadir un índice

- La tabla es muy pequeña.
- La consulta recupera gran parte de las filas.
- La columna posee muy pocos valores distintos, como un indicador binario.
- La columna cambia constantemente y casi no se consulta.
- Ya existe un índice equivalente por `PRIMARY KEY` o `UNIQUE`.
- No existe una consulta real que lo necesite.

> No crees índices para todas las columnas. Cada índice debe responder: ¿qué consulta frecuente y concreta se beneficiará?

## 3.7 Eliminar un índice

```sql
DROP INDEX IF EXISTS idx_reservaciones_habitacion_fechas;
```

Eliminar un índice no elimina filas ni columnas, pero puede cambiar el rendimiento de consultas.

---

# 4. `EXPLAIN QUERY PLAN`

## 4.1 Observar la estrategia

```sql
EXPLAIN QUERY PLAN
SELECT id, codigo, fecha_registro
FROM paquetes
WHERE ruta_id = 3
  AND fecha_registro BETWEEN '2026-07-01' AND '2026-07-31';
```

Dos palabras esenciales:

| Resultado | Lectura inicial |
|---|---|
| `SCAN paquetes` | Se recorren todas o muchas entradas de la fuente |
| `SEARCH paquetes USING INDEX ...` | Se utiliza un índice para localizar un subconjunto |

Después de crear:

```sql
CREATE INDEX idx_paquetes_ruta_fecha
ON paquetes (ruta_id, fecha_registro);
```

repite exactamente el mismo plan. Puede aparecer:

```text
SEARCH paquetes USING INDEX idx_paquetes_ruta_fecha
    (ruta_id=? AND fecha_registro>? AND fecha_registro<?)
```

## 4.2 `SCAN` no significa automáticamente “error”

Un recorrido completo puede ser razonable cuando:

- La tabla es pequeña.
- Se necesitan casi todas las filas.
- No existe un filtro selectivo.
- Mantener otro índice cuesta más de lo que aporta.

El objetivo no es eliminar cada palabra `SCAN`, sino comprender el plan.

## 4.3 Árbol temporal para ordenar

Puede aparecer:

```text
USE TEMP B-TREE FOR ORDER BY
```

Significa que SQLite necesita una estructura temporal para ordenar. Un índice compatible puede evitarla en algunos casos, pero no debes crear uno sin una consulta frecuente y una mejora justificada.

## 4.4 Limitaciones

`EXPLAIN QUERY PLAN`:

- Describe una estrategia de alto nivel.
- No mide por sí solo el tiempo real.
- Puede cambiar según datos, estadísticas, versión e índices.
- Tiene un formato de salida que SQLite puede modificar entre versiones.
- Sirve para análisis interactivo; una aplicación no debe depender del texto exacto.

En una base con 30 filas, una diferencia de velocidad será imperceptible. La evidencia del curso demuestra comprensión del plan, no una afirmación de rendimiento a gran escala.

---

# 5. Mejoras básicas antes de añadir índices

Un índice no corrige una consulta mal planteada.

## 5.1 Selecciona lo necesario

```sql
-- Evita en un reporte final
SELECT * FROM reservaciones;

-- Expresa la necesidad
SELECT id, huesped_id, habitacion_id, fecha_entrada, fecha_salida
FROM reservaciones;
```

## 5.2 Filtra temprano y con precisión

Aplica condiciones que pertenecen a las filas antes de agregar. No cargues datos que luego serán descartados.

## 5.3 No envuelvas sin necesidad la columna indexada

Un índice sobre `fecha_entrada` puede no ayudar de la misma forma si la consulta transforma cada valor:

```sql
WHERE strftime('%Y', fecha_entrada) = '2026'
```

Una alternativa con intervalo suele expresar mejor el rango:

```sql
WHERE fecha_entrada >= '2026-01-01'
  AND fecha_entrada < '2027-01-01'
```

## 5.4 Comprueba antes y después

Proceso mínimo:

```text
1. Define la consulta real.
2. Guarda el plan inicial.
3. Crea un índice justificado.
4. Ejecuta el mismo plan.
5. Describe el cambio.
6. Conserva o elimina el índice según la evidencia y el costo.
```

---

# 6. Consultas parametrizadas e inyección SQL

## 6.1 El riesgo de concatenar datos externos

Una aplicación no debe construir una consulta uniendo texto recibido:

```text
"SELECT * FROM huespedes WHERE correo = '" + correo_ingresado + "'"
```

Un valor malicioso podría cambiar la estructura de la instrucción. Eso se conoce como inyección SQL.

## 6.2 Separar instrucción y valor

Conceptualmente, una consulta parametrizada mantiene dos elementos separados:

```sql
SELECT id, nombre, correo
FROM huespedes
WHERE correo = ?;
```

```text
Instrucción SQL: SELECT ... WHERE correo = ?
Valores:        ['persona@correo.test']
```

La biblioteca del lenguaje envía la estructura y los datos mediante su API. No debes añadir comillas manuales ni utilizar reemplazos de texto como protección.

Los marcadores varían: `?`, `:nombre`, `%s` o `$1`, según biblioteca y motor. El principio es el mismo.

## 6.3 Límites de los parámetros

Los parámetros representan valores. Normalmente no sustituyen nombres de tabla, nombres de columna ni palabras clave. Si una aplicación permite elegir una columna de orden, debe validarla contra una lista controlada.

Las consultas parametrizadas son necesarias, pero la seguridad también requiere permisos mínimos, validación, manejo de errores, protección de credenciales y actualizaciones. Este módulo prepara el concepto para conectar posteriormente un lenguaje.

---

# 7. Inspección y verificación de SQLite

## 7.1 Tablas y columnas

```sql
PRAGMA table_info('reservaciones');
```

Permite revisar nombres, tipos, `NOT NULL`, valores predeterminados y clave primaria.

## 7.2 Claves foráneas

```sql
PRAGMA foreign_key_list('reservaciones');
```

Comprueba tabla y columna referenciadas y acciones `ON UPDATE` y `ON DELETE`.

## 7.3 Índices

```sql
PRAGMA index_list('reservaciones');
```

Después inspecciona uno:

```sql
PRAGMA index_info('idx_reservaciones_habitacion_fechas');
```

## 7.4 Integridad

```sql
PRAGMA integrity_check;
PRAGMA foreign_key_check;
```

Resultado esperado:

```text
integrity_check  → ok
foreign_key_check → cero filas
```

`integrity_check` revisa la estructura de la base. `foreign_key_check` localiza incumplimientos referenciales. Ninguno sustituye las pruebas de reglas comerciales.

## 7.5 Inspeccionar objetos

```sql
SELECT type, name, tbl_name, sql
FROM sqlite_schema
WHERE type IN ('table', 'view', 'index')
ORDER BY type, name;
```

Los índices automáticos pueden aparecer sin una definición SQL escrita por ti.

---

# 8. Respaldo y recuperación básica

Una base no está respaldada solo porque “existe en la computadora”.

## Opción 1 — Copia desde DB Browser

Guarda una copia con otro nombre después de confirmar todos los cambios y cerrar operaciones pendientes. Abre la copia y ejecuta verificaciones.

## Opción 2 — Comando de SQLite

En la interfaz de línea de comandos:

```text
.backup hotel_respaldo.db
```

`.backup` es un comando de la herramienta, no una instrucción SQL.

## Opción 3 — `VACUUM INTO`

En versiones compatibles:

```sql
VACUUM INTO 'hotel_respaldo.db';
```

No sobrescribas un archivo existente. Conserva respaldos fuera de la carpeta de trabajo y prueba que puedan abrirse.

Una política profesional define frecuencia, versiones, ubicación, acceso y pruebas de restauración. La administración avanzada de respaldos queda fuera del alcance.

---

# 9. Portabilidad

| Tema | SQLite | Revisión al migrar |
|---|---|---|
| Identificador | `INTEGER PRIMARY KEY` | `IDENTITY`, `SERIAL`, secuencia o autoincremento del motor |
| Tipos | Afinidad flexible | Tipos más estrictos y longitudes |
| Booleanos | Frecuentemente `INTEGER` con `CHECK` | Tipo `BOOLEAN` o equivalente |
| Fechas | Texto ISO y funciones SQLite | Tipos `DATE`/`TIMESTAMP` y funciones propias |
| Concatenación | `||` | `CONCAT()` o `+` |
| Paginación | `LIMIT/OFFSET` | `TOP` o `OFFSET/FETCH` |
| Modificar esquema | `ALTER TABLE` limitado | Capacidades y sintaxis diferentes |
| Vista | De solo lectura por defecto | Reglas de actualización variables |
| Plan | `EXPLAIN QUERY PLAN` | `EXPLAIN`, planes gráficos y herramientas propias |
| Parámetros | Dependen de la biblioteca | Marcadores y API diferentes |

No reescribas el proyecto para todos los motores. Documenta qué puntos revisarías.

---

# 10. Prácticas guiadas

Utiliza `datos_mensajeria_m06.sql`.

## Práctica 1 — Crear una vista

```sql
CREATE VIEW vista_seguimiento_paquetes AS
SELECT
    p.codigo,
    c.nombre AS cliente,
    r.codigo AS codigo_ruta,
    r.nombre AS ruta,
    p.fecha_registro,
    p.peso_kg,
    p.costo,
    p.estado,
    e.fecha_entrega,
    e.recibido_por
FROM paquetes AS p
INNER JOIN clientes AS c ON c.id = p.cliente_id
INNER JOIN rutas AS r ON r.id = p.ruta_id
LEFT JOIN entregas AS e ON e.paquete_id = p.id;
```

Consulta la vista para mostrar paquetes no entregados, ordenados por fecha y código. Comprueba que la vista conserve paquetes sin fila en `entregas`.

## Práctica 2 — Detectar un índice duplicado

```sql
PRAGMA index_list('paquetes');
```

Localiza:

- El índice automático asociado a `UNIQUE(codigo)`.
- `idx_paquetes_codigo_repetido`.

Ambos comienzan por la misma columna y protegen o apoyan la misma búsqueda. Elimina el índice manual:

```sql
DROP INDEX idx_paquetes_codigo_repetido;
```

La restricción `UNIQUE` permanece activa.

## Práctica 3 — Plan antes y después

Plan inicial:

```sql
EXPLAIN QUERY PLAN
SELECT id, codigo, fecha_registro, estado
FROM paquetes
WHERE ruta_id = 3
  AND fecha_registro BETWEEN '2026-07-01' AND '2026-07-31';
```

Crea:

```sql
CREATE INDEX idx_paquetes_ruta_fecha
ON paquetes (ruta_id, fecha_registro);
```

Repite el plan. Registra el texto de detalle y señala `SCAN` o `SEARCH`. Ejecuta también la consulta normal para confirmar que el resultado no cambió.

## Práctica 4 — Auditar una restricción

Inspecciona:

```sql
PRAGMA table_info('paquetes');
SELECT sql FROM sqlite_schema WHERE name = 'paquetes';
```

`peso_kg` es obligatorio, pero no impide cero o valores negativos. Redacta la definición correcta:

```sql
peso_kg REAL NOT NULL CHECK (peso_kg > 0)
```

No reconstruyas la tabla durante esta práctica. Documenta una migración segura: respaldo, tabla nueva corregida, copia validada, reemplazo dentro de una transacción y verificación final.

---

# 11. Ejercicios y diagnóstico

Los ejercicios 1 al 8 son obligatorios. Los retos 9 y 10 son opcionales.

## Ejercicio 1 — Vista de entregas

Crea `vista_entregas_completadas` con código del paquete, cliente, ruta, fecha de registro, fecha de entrega y persona receptora. Debe contener solamente paquetes entregados.

## Ejercicio 2 — Uso de la vista

Consulta la vista anterior para mostrar entregas de la Ruta Central durante julio de 2026. Ordena por fecha de entrega y código.

## Ejercicio 3 — Índices existentes

Ejecuta `PRAGMA index_list` sobre `paquetes`, `clientes` y `entregas`. Clasifica cada índice como automático o creado manualmente y explica la restricción o consulta que apoya.

## Ejercicio 4 — Candidato razonable

Una consulta frecuente filtra paquetes por `ruta_id` y rango de `fecha_registro`. Propón nombre y definición del índice. Explica por qué `ruta_id` aparece primero.

## Ejercicio 5 — Candidato débil

Evalúa un índice únicamente sobre `rutas.activa`, cuyos valores son 0 o 1 y cuya tabla tiene cinco filas. Explica dos razones para no crearlo en este proyecto.

## Ejercicio 6 — Plan

Guarda el resultado de `EXPLAIN QUERY PLAN` para el ejercicio 4 antes y después del índice. Identifica la tabla, el tipo de acceso y el nombre del índice.

## Ejercicio 7 — Consulta parametrizada

Escribe la plantilla conceptual para buscar un paquete por código mediante un parámetro. Explica por qué el valor no debe concatenarse.

## Ejercicio 8 — Revisión final

Ejecuta `integrity_check`, `foreign_key_check`, `table_info`, `foreign_key_list` e `index_list`. Escribe una conclusión breve para cada comprobación.

## Reto 9 — Orden apoyado

Analiza un reporte por `ruta_id` ordenado por `fecha_registro`. Comprueba si el índice compuesto evita una estructura temporal de orden en tu versión y conjunto de datos. No prometas que ocurrirá en todos los escenarios.

## Reto 10 — Índice alternativo

Compara conceptualmente `(ruta_id, fecha_registro)` con `(fecha_registro, ruta_id)`. Indica qué patrón de consulta favorece cada orden.

---

# 12. Soluciones sugeridas

## Solución 1

```sql
CREATE VIEW vista_entregas_completadas AS
SELECT p.codigo, c.nombre AS cliente, r.nombre AS ruta,
       p.fecha_registro, e.fecha_entrega, e.recibido_por
FROM paquetes AS p
INNER JOIN clientes AS c ON c.id = p.cliente_id
INNER JOIN rutas AS r ON r.id = p.ruta_id
INNER JOIN entregas AS e ON e.paquete_id = p.id
WHERE p.estado = 'Entregado';
```

## Solución 2

```sql
SELECT codigo, cliente, ruta, fecha_entrega, recibido_por
FROM vista_entregas_completadas
WHERE ruta = 'Ruta Central'
  AND fecha_entrega >= '2026-07-01'
  AND fecha_entrega < '2026-08-01'
ORDER BY fecha_entrega, codigo;
```

## Solución 3

```sql
PRAGMA index_list('paquetes');
PRAGMA index_list('clientes');
PRAGMA index_list('entregas');
```

Los índices asociados a `UNIQUE` se identifican como automáticos. `idx_paquetes_codigo_repetido` fue creado manualmente y duplica el propósito de la unicidad de `codigo`.

## Solución 4

```sql
CREATE INDEX idx_paquetes_ruta_fecha
ON paquetes (ruta_id, fecha_registro);
```

La igualdad por ruta reduce primero el conjunto; dentro de cada ruta, las fechas permiten recorrer el intervalo.

## Solución 5

La tabla es pequeña y `activa` posee poca selectividad. Una consulta sobre cualquiera de sus dos valores probablemente necesita una proporción grande de las cinco filas. El costo y la complejidad no se justifican.

## Solución 6

```sql
EXPLAIN QUERY PLAN
SELECT id, codigo, fecha_registro, estado
FROM paquetes
WHERE ruta_id = 3
  AND fecha_registro BETWEEN '2026-07-01' AND '2026-07-31';
```

Antes puede aparecer `SCAN paquetes`; después debe comprobarse si aparece `SEARCH paquetes USING INDEX idx_paquetes_ruta_fecha`. El detalle exacto puede variar.

## Solución 7

```sql
SELECT id, codigo, estado
FROM paquetes
WHERE codigo = ?;
```

La aplicación entrega el valor por separado mediante su biblioteca. El marcador no se reemplaza concatenando texto.

## Solución 8

```sql
PRAGMA integrity_check;
PRAGMA foreign_key_check;
PRAGMA table_info('paquetes');
PRAGMA foreign_key_list('paquetes');
PRAGMA index_list('paquetes');
```

La conclusión debe informar resultados reales: `ok` para integridad, cero filas para claves rotas y una revisión explícita de restricciones e índices.

## Errores comunes de cierre

### Confundir una vista con una copia

Una vista vuelve a ejecutar su consulta sobre los datos actuales. No conserva una fotografía ni garantiza orden.

### Crear índices por intuición

Un índice sin consulta asociada añade costo y complejidad. Define primero el patrón de búsqueda y comprueba el plan.

### Considerar todo `SCAN` como fallo

Un recorrido completo puede ser la mejor estrategia para una tabla pequeña o una consulta que necesita muchas filas.

### Comparar planes de consultas diferentes

La evidencia antes y después solo es válida si la instrucción, parámetros y datos se mantienen iguales.

### Duplicar índices automáticos

Revisa `index_list` antes de indexar columnas `PRIMARY KEY` o `UNIQUE`.

### Confundir un índice con integridad referencial

Un índice puede facilitar una unión, pero la clave foránea es la que define y protege la relación.

### Concatenar valores y llamarlo parametrización

Reemplazar manualmente `?` dentro de una cadena no protege la consulta. Los valores deben enviarse por la API de la biblioteca.

### Entregar solamente el archivo `.db`

La base muestra un estado, pero no explica cómo reconstruirlo. El script es obligatorio.

### Confiar en un respaldo no probado

Una copia que nunca se abrió ni verificó no demuestra recuperación.

### Actualizar el esquema sin actualizar el diagrama

El modelo, el script y la documentación deben describir la misma versión.

## Buenas prácticas finales

- Conserva versiones y fecha de los cambios.
- Prueba scripts destructivos únicamente en copias.
- Separa estructura, carga, operaciones, reportes y verificaciones.
- Nombra objetos de forma consistente.
- Documenta reglas cerca del DDL que las protege.
- Utiliza datos de prueba que incluyan ausencias y límites.
- Captura evidencia antes de aplicar una mejora.
- Verifica que el resultado funcional no cambie después de indexar.
- Reconstruye la base completa antes de entregar.
- Abre el respaldo en una sesión independiente.
- Revisa que no existan datos personales reales.
- Registra limitaciones en vez de ocultarlas.

---

# 13. Mini proyecto — Auditoría de una empresa de mensajería

## Propósito

Revisar una base existente, encontrar decisiones mejorables y justificar cada corrección mediante esquema, consulta o plan.

**Tiempo sugerido:** 20 minutos  
**Modalidad:** individual  
**Valor dentro del módulo:** se combina con la evaluación práctica para representar el 20 % de la calificación.

## Material

[`Descargar datos_mensajeria_m06.sql`](/downloads/sql-bases-datos/modulo-6/datos_mensajeria_m06.sql)

La carga correcta contiene:

```text
5 rutas
8 clientes
30 paquetes
18 entregas
```

## Encargo de auditoría

### Hallazgo 1 — Restricción ausente

Identifica la regla que falta en `peso_kg`. Explica qué dato inválido permitiría, redacta la columna corregida y describe una migración segura para SQLite. No alteres la tabla original durante el mini proyecto.

### Hallazgo 2 — Índice redundante

Inspecciona los índices de `paquetes`. Demuestra que `idx_paquetes_codigo_repetido` repite un índice relacionado con `UNIQUE(codigo)`. Elimínalo y verifica que la unicidad continúe activa.

### Hallazgo 3 — Consulta poco clara

Mejora esta consulta:

```sql
SELECT *
FROM paquetes
WHERE estado <> 'Entregado' OR estado IS NULL
ORDER BY 1;
```

Considera que `estado` es `NOT NULL`. Selecciona columnas explícitas, utiliza una condición que comunique los estados pendientes de seguimiento y define un orden significativo.

### Mejora 1 — Vista de seguimiento

Crea `vista_seguimiento_paquetes` con código, cliente, ruta, fecha de registro, peso, costo, estado, fecha de entrega y persona receptora. Debe conservar paquetes sin entrega.

### Mejora 2 — Índice justificado

La consulta frecuente busca paquetes por ruta y rango de fechas. Captura el plan inicial, crea `idx_paquetes_ruta_fecha`, repite el plan y describe el cambio. Ejecuta la consulta normal antes y después para comprobar que las filas no cambian.

### Mejora 3 — Informe operativo

Utiliza la vista para mostrar paquetes que requieren seguimiento: `Registrado`, `En ruta` o `Devuelto`. Presenta primero los devueltos, después los que están en ruta y finalmente los registrados.

## Informe de auditoría

Para cada hallazgo utiliza:

| Campo | Contenido |
|---|---|
| Evidencia | Consulta, `PRAGMA` o plan observado |
| Riesgo | Qué podría ocurrir |
| Corrección | Cambio propuesto o ejecutado |
| Verificación | Cómo comprobaste el resultado |
| Alcance | Qué no demuestra esta prueba |

## Lista de comprobación

- [ ] La base conserva sus cantidades originales.
- [ ] La restricción ausente se identificó sin inventar una regla diferente.
- [ ] El índice manual redundante fue eliminado.
- [ ] La restricción `UNIQUE` continúa rechazando códigos repetidos.
- [ ] La vista conserva paquetes sin entrega.
- [ ] El plan se capturó antes y después con la misma consulta.
- [ ] La consulta devuelve las mismas filas después del índice.
- [ ] No se afirma que 30 filas demuestren una mejora de tiempo a gran escala.

---

# 14. Proyecto final integrador — Sistema de gestión de un hotel

## Propósito

Diseñar, construir, consultar, verificar y documentar una base relacional completa. Este proyecto demuestra el dominio integrado del curso.

**Tiempo de construcción sugerido:** 150 minutos  
**Modalidad:** individual  
**Valor:** 80 % de la calificación del módulo  
**Aprobación obligatoria:** sí

## Situación profesional

Un hotel necesita administrar huéspedes, habitaciones, reservaciones, pagos y servicios consumidos durante una estancia. Actualmente utiliza hojas separadas y no puede comprobar fácilmente disponibilidad, saldos, ingresos ni historial.

La primera versión tendrá este alcance:

- Una reservación corresponde a una habitación.
- Una habitación pertenece a un tipo.
- Un huésped puede realizar varias reservaciones.
- Una reservación puede recibir varios pagos.
- Una reservación puede consumir varios servicios.
- Un servicio puede aparecer en muchas reservaciones.
- Se conservan tarifas históricas dentro de reservaciones y consumos.

No se incluyen empleados, turnos, contabilidad, facturación fiscal, múltiples monedas, limpieza detallada ni reservas de varias habitaciones bajo un único contrato.

## 14.1 Análisis y reglas de negocio

Documenta al menos estas reglas:

1. Cada huésped posee identificación y correo únicos.
2. La capacidad y tarifa base de un tipo de habitación son positivas.
3. El número de habitación es único.
4. El estado de una habitación pertenece a un conjunto controlado.
5. La salida de una reservación es posterior a la entrada.
6. La cantidad de huéspedes es positiva.
7. La tarifa por noche registrada en la reservación es positiva.
8. Los estados de la reservación pertenecen a un conjunto controlado.
9. Una habitación no debe tener reservaciones activas que se solapen.
10. La cantidad de huéspedes no debe superar la capacidad del tipo de habitación.
11. Un pago tiene monto positivo, método y estado válidos.
12. Un consumo tiene cantidad positiva y conserva el precio aplicado.
13. Una reservación puede existir sin pagos o consumos.
14. Eliminar una reservación debe tratar conscientemente sus pagos y consumos.

Señala cómo se protege cada regla:

- Restricción de columna o tabla.
- Clave foránea.
- Transacción y consulta de validación.
- Lógica futura de aplicación.

Las reglas 9 y 10 dependen de otras filas o tablas. Un `CHECK` de SQLite no debe consultar tablas externas. Protégelas mediante consultas de validación y una transacción; explica que una aplicación real necesitaría aplicar el mismo proceso de forma controlada.

## 14.2 Modelo mínimo

Debes crear al menos siete tablas:

| Tabla | Propósito | Columnas mínimas |
|---|---|---|
| `huespedes` | Personas responsables de reservas | id, identificación, nombre, correo, teléfono, ciudad |
| `tipos_habitacion` | Características y tarifa vigente | id, nombre, capacidad, tarifa_base |
| `habitaciones` | Unidades físicas | id, número, piso, estado, tipo_id |
| `reservaciones` | Estancias solicitadas | id, código, huésped_id, habitación_id, entrada, salida, cantidad_huéspedes, tarifa_noche, estado, fecha_creación |
| `pagos` | Abonos vinculados | id, reservación_id, fecha, monto, método, estado |
| `servicios` | Catálogo de servicios | id, código, nombre, precio_actual, activo |
| `consumos` | Servicios aplicados a una reservación | id, reservación_id, servicio_id, fecha, cantidad, precio_aplicado |

Puedes añadir columnas justificadas, pero no agregues tablas decorativas.

## 14.3 Relaciones esperadas

```text
tipos_habitacion.id ← habitaciones.tipo_id
huespedes.id ← reservaciones.huesped_id
habitaciones.id ← reservaciones.habitacion_id
reservaciones.id ← pagos.reservacion_id
reservaciones.id ← consumos.reservacion_id
servicios.id ← consumos.servicio_id
```

`consumos` resuelve la relación muchos a muchos entre reservaciones y servicios y guarda información propia: fecha, cantidad y precio aplicado.

## 14.4 Decisiones de integridad

Incluye y justifica:

- Claves primarias.
- `NOT NULL` en datos obligatorios.
- `UNIQUE` en identificación, correos, códigos y números correspondientes.
- `CHECK` para cantidades, montos, capacidad, fechas y estados.
- `DEFAULT` solamente donde exista un valor real predeterminado.
- Acciones `ON UPDATE` y `ON DELETE`.

Una estrategia posible:

- Restringir la eliminación de huésped o habitación con reservaciones.
- Eliminar pagos y consumos al eliminar deliberadamente una reservación.
- Restringir la eliminación de servicios con consumos históricos.

No copies estas acciones sin evaluarlas. Documenta por qué preservan o eliminan historia.

## 14.5 Datos de prueba

Carga como mínimo:

| Entidad | Cantidad mínima |
|---|---:|
| Tipos de habitación | 4 |
| Habitaciones | 12 |
| Huéspedes | 10 |
| Reservaciones | 15 |
| Pagos | 12 |
| Servicios | 6 |
| Consumos | 15 |

Incluye casos que permitan comprobar:

- Una habitación sin reservaciones.
- Un huésped sin reservaciones.
- Una reservación sin pago.
- Una reservación sin consumo.
- Un servicio sin consumo.
- Reservaciones confirmadas, hospedadas, finalizadas y canceladas.
- Un pago pendiente o anulado.
- Fechas en al menos tres meses.
- Tarifas y cantidades diferentes.

## 14.6 Operaciones obligatorias

### Inserción

Registra una nueva reservación con lista explícita de columnas.

### Actualización

Actualiza de forma segura el estado de una reservación o habitación. Ejecuta primero un `SELECT` con el mismo `WHERE` y verifica después.

### Eliminación

Crea un servicio de prueba sin consumos, selecciónalo, elimínalo con `WHERE` y verifica su ausencia. No elimines historia real.

### Transacción compuesta

Protege una operación que incluya al menos:

1. Comprobación de solapamiento para la habitación y fechas.
2. Inserción de la reservación.
3. Inserción de un pago inicial.
4. Verificación.
5. `COMMIT` si todo es correcto o `ROLLBACK` en la demostración de prueba.

La consulta de solapamiento debe utilizar esta lógica:

```sql
SELECT id, codigo, fecha_entrada, fecha_salida
FROM reservaciones
WHERE habitacion_id = ?
  AND estado IN ('Confirmada', 'Hospedada')
  AND fecha_entrada < ?
  AND fecha_salida > ?;
```

Los tres parámetros representan habitación, nueva fecha de salida y nueva fecha de entrada. Si devuelve filas, existe intersección.

## 14.7 Consultas obligatorias

Documenta pregunta, granularidad y técnica antes de cada consulta.

### Q01 — Catálogo de habitaciones

Muestra número, piso, estado, tipo, capacidad y tarifa vigente. Ordena por piso y número.

### Q02 — Reservaciones de un intervalo

Muestra código, huésped, habitación, entrada, salida y estado de reservaciones que intersectan un intervalo indicado. No busques solamente entradas dentro del período: utiliza la lógica de solapamiento.

### Q03 — Costo de alojamiento

Para cada reservación no cancelada, calcula noches con `julianday`, tarifa histórica y subtotal de alojamiento.

### Q04 — Historial por huésped

Muestra huésped, reservación, habitación, fechas y estado. Conserva huéspedes sin reservaciones.

### Q05 — Ocupación actual simulada

Utiliza una fecha fija documentada para localizar reservaciones hospedadas o confirmadas que cubren esa fecha. Muestra huésped, habitación y tipo.

### Q06 — Habitaciones sin historial

Encuentra habitaciones que nunca han recibido reservaciones mediante `NOT EXISTS` o `LEFT JOIN ... IS NULL`.

### Q07 — Servicios consumidos

Muestra reservación, servicio, cantidad, precio aplicado y subtotal. Conserva el valor histórico aunque cambie `precio_actual`.

### Q08 — Resumen por servicio

Conserva todos los servicios y muestra número de consumos, unidades e importe. Un servicio sin consumo debe mostrar cero.

### Q09 — Pagos por mes

Agrupa pagos confirmados por período `AAAA-MM`. Muestra cantidad de pagos e importe recibido. No cuentes pagos pendientes o anulados.

### Q10 — Rendimiento por tipo de habitación

Para reservaciones finalizadas, muestra tipo, reservaciones, noches e ingreso de alojamiento. Conserva solamente tipos con al menos dos reservaciones finalizadas mediante `HAVING`.

### Q11 — Huéspedes con pagos superiores al promedio

Muestra huéspedes cuyo total de pagos confirmados supera el promedio de totales pagados por huésped. Utiliza una subconsulta o CTE y explica las etapas.

### Q12 — Huéspedes sin reservaciones

Utiliza `NOT EXISTS` para localizar huéspedes sin ninguna reservación.

### Q13 — Estado financiero por reservación

Utiliza CTE separadas para calcular:

- Subtotal de alojamiento.
- Total de consumos.
- Total de pagos confirmados.
- Total de la reservación.
- Saldo pendiente.

Conserva reservaciones sin pagos y sin consumos. Evita multiplicar pagos por consumos al unir dos relaciones uno a muchos.

### Q14 — Alertas de consistencia

Crea una consulta que localice al menos:

- Reservaciones con cantidad de huéspedes superior a la capacidad.
- Reservaciones no canceladas con fechas inválidas, si existieran.
- Pagos confirmados que superan el total calculado, si tu política no permite saldos a favor.

Explica que una consulta de auditoría detecta problemas, pero no sustituye la prevención.

### Q15 — Resumen ejecutivo

Produce indicadores generales: reservaciones por estado, noches finalizadas, ingreso de alojamiento, consumo de servicios y pagos confirmados. Puedes utilizar varias consultas claramente identificadas o una CTE que prepare las medidas sin duplicarlas.

## 14.8 Vista obligatoria

Crea una vista útil, por ejemplo `vista_estado_reservaciones`, con:

- Código de reservación.
- Huésped.
- Habitación y tipo.
- Entrada, salida y noches.
- Estado.
- Subtotal de alojamiento.

No incluyas un `ORDER BY` como promesa de presentación. Consulta la vista en al menos dos reportes distintos.

## 14.9 Índice y evidencia

Analiza la consulta de solapamiento de reservaciones.

1. Ejecuta `EXPLAIN QUERY PLAN` antes del índice.
2. Guarda evidencia.
3. Crea un índice razonable, por ejemplo:

```sql
CREATE INDEX idx_reservaciones_habitacion_fechas
ON reservaciones (habitacion_id, fecha_entrada, fecha_salida);
```

4. Repite exactamente el plan.
5. Identifica `SCAN` o `SEARCH` y el índice utilizado.
6. Ejecuta la consulta normal y confirma resultados idénticos.
7. Explica el costo del índice en escrituras.

No se exige demostrar una reducción de milisegundos con una tabla pequeña.

## 14.10 Seguridad conceptual

Incluye tres plantillas parametrizadas:

- Buscar huésped por correo.
- Comprobar solapamiento de fechas.
- Consultar reservación por código.

Explica que la aplicación enviará valores por separado y que los nombres de tabla o columna deben seleccionarse mediante opciones controladas.

## 14.11 Verificación

Incluye al final del script:

```sql
PRAGMA integrity_check;
PRAGMA foreign_key_check;
```

Además, inspecciona:

- Una tabla principal con `table_info`.
- Sus relaciones con `foreign_key_list`.
- Sus índices con `index_list` e `index_info`.
- Los objetos relevantes en `sqlite_schema`.

## 14.12 Respaldo

Crea `hotel_respaldo.db`, ábrelo y ejecuta:

```sql
SELECT COUNT(*) FROM reservaciones;
PRAGMA integrity_check;
PRAGMA foreign_key_check;
```

Documenta fecha, método y resultado. El respaldo no sustituye el script reproducible.

## 14.13 Portabilidad

Documenta como mínimo:

- `INTEGER PRIMARY KEY`.
- Fechas almacenadas como texto ISO.
- `julianday` y `strftime`.
- Concatenación.
- `LIMIT/OFFSET` si se utilizan.
- `EXPLAIN QUERY PLAN`.
- Modificación de tablas en SQLite.
- Marcadores de parámetros dependientes de la biblioteca.

## 14.14 Estructura del script

```text
00 Encabezado y PRAGMA
01 Eliminación controlada
02 Creación de tablas
03 Datos de prueba
04 Operaciones seguras
05 Transacción
06 Vista
07 Plan antes del índice
08 Índice
09 Plan después del índice
10 Consultas Q01-Q15
11 Inspección y verificación
```

## 14.15 Lista de comprobación

### Diseño

- [ ] El alcance está definido.
- [ ] Existen siete tablas necesarias.
- [ ] El diagrama coincide con el script.
- [ ] La relación muchos a muchos está resuelta.
- [ ] No existen campos multivaluados ni datos repetidos innecesariamente.

### Integridad

- [ ] Claves primarias y foráneas correctas.
- [ ] `NOT NULL`, `UNIQUE`, `CHECK` y `DEFAULT` justificados.
- [ ] Acciones referenciales documentadas.
- [ ] Fechas, cantidades, montos y estados están controlados.
- [ ] Las reglas entre filas poseen una estrategia de validación.

### Operaciones

- [ ] Inserción, actualización y eliminación seguras.
- [ ] Una operación compuesta utiliza transacción.
- [ ] Existe evidencia de verificación y reversión.

### Consultas

- [ ] Quince consultas documentadas.
- [ ] Existen filtros, cálculos, agregaciones y `HAVING`.
- [ ] Se utilizan `INNER JOIN` y `LEFT JOIN`.
- [ ] Se utiliza una subconsulta o `EXISTS`.
- [ ] Se utiliza una CTE.
- [ ] No se multiplican medidas.
- [ ] Los casos sin coincidencia se manejan correctamente.

### Profesionalización

- [ ] La vista se utiliza en dos reportes.
- [ ] El índice responde a una consulta real.
- [ ] Existen planes antes y después.
- [ ] Las consultas parametrizadas están explicadas.
- [ ] La integridad y las claves se verificaron.
- [ ] El respaldo fue abierto y probado.
- [ ] La portabilidad está documentada.
- [ ] El script se ejecuta desde cero.

---

# 15. Evaluación práctica y defensa

## Parte A — Diagnóstico: 10 puntos

**Tiempo sugerido:** 8 minutos

Analiza este esquema:

```sql
CREATE TABLE reservas_revision (
    id INTEGER PRIMARY KEY,
    codigo TEXT,
    habitacion_id INTEGER,
    entrada TEXT,
    salida TEXT,
    total REAL,
    estado TEXT
);

CREATE INDEX idx_reservas_estado
ON reservas_revision(estado);
```

Identifica al menos seis problemas o decisiones sin justificar. Debes considerar unicidad, obligatoriedad, relaciones, fechas, montos, estados y utilidad del índice.

Después responde:

1. ¿Qué restricciones añadirías?
2. ¿Qué relación falta?
3. ¿Qué consulta real justificaría o descartaría el índice?
4. ¿Qué no puede resolver un `CHECK` simple respecto a solapamientos?

## Parte B — Interpretación de plan: 4 puntos

Explica la diferencia entre:

```text
SCAN reservaciones
```

y:

```text
SEARCH reservaciones USING INDEX idx_reservaciones_habitacion_fechas
    (habitacion_id=? AND fecha_entrada<?)
```

Indica dos razones por las que `SCAN` podría ser aceptable.

## Parte C — Defensa del proyecto: 6 puntos

Responde por escrito:

1. ¿Qué representa cada fila de `consumos`?
2. ¿Por qué guardaste `tarifa_noche` y `precio_aplicado`?
3. ¿Cómo evitas multiplicar pagos por consumos?
4. ¿Qué entidad conserva tu vista y por qué?
5. ¿Qué evidencia justifica el índice?
6. ¿Qué regla necesita apoyo de la aplicación?

**Puntaje mínimo:** 14 de 20.

---

# 16. Rúbrica del proyecto final

**Puntaje del proyecto:** 100 puntos  
**Puntaje mínimo:** 70 puntos  
**Peso en el módulo:** 80 %  
**Condición adicional:** todos los criterios críticos deben cumplirse.

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Alcance y reglas | Alcance claro; reglas completas y protección identificada | Faltan detalles menores | Varias reglas ambiguas | No existe análisis suficiente | 10 |
| Diseño relacional | Modelo normalizado, relaciones y granularidades correctas | Un ajuste menor | Redundancias o relaciones dudosas | Diseño no representa el hotel | 15 |
| Integridad | Restricciones y acciones protegen datos con justificación | Uno o dos controles menores faltantes | Varias reglas quedan desprotegidas | Existen fallos críticos de integridad | 15 |
| Datos y operaciones | Datos variados; DML y transacción seguros y verificables | Falta un caso menor | Operaciones poco demostradas | Cambios inseguros o no reproducibles | 10 |
| Consultas | Quince reportes exactos, variados y sin multiplicar medidas | Uno o dos ajustes menores | Varias consultas incompletas | Reportes esenciales incorrectos | 20 |
| Vista, índice y plan | Vista reutilizada; índice justificado con evidencia antes/después y límites explicados | Evidencia correcta con detalle menor | Justificación débil o incompleta | Índice arbitrario o sin análisis | 15 |
| Calidad del script | Ordenado, comentado y ejecutable desde cero | Pequeñas inconsistencias | Requiere pasos manuales | No puede reconstruirse | 5 |
| Documentación y defensa | Diagrama, decisiones, seguridad, respaldo, portabilidad y defensa claros | Falta un detalle menor | Documentación parcial | No permite comprender o defender la solución | 10 |
| **Total** |  |  |  |  | **100** |

## Criterios críticos

Se requiere corrección si:

- El script no se ejecuta desde una base vacía.
- El diagrama y el esquema se contradicen.
- Faltan claves primarias o relaciones esenciales.
- Se permiten fechas, cantidades o montos inválidos sin explicación.
- La transacción no protege una operación compuesta real.
- Faltan cinco o más consultas.
- Los totales se multiplican por uniones incorrectas.
- Datos de otro proyecto sustituyen el modelo hotelero solicitado.
- No existe vista, índice o evidencia del plan.
- Se afirma una mejora de rendimiento sin evidencia adecuada.
- Las consultas externas se concatenan como texto en vez de parametrizarse conceptualmente.
- `integrity_check` falla o existen claves foráneas rotas.
- El respaldo o los archivos no pueden abrirse.

| Puntaje | Resultado |
|---:|---|
| 90–100 | Dominio integral sólido |
| 80–89 | Proyecto profesional con mejoras menores |
| 70–79 | Aprobado con aspectos por reforzar |
| 0–69 | Requiere corrección y nueva entrega |

## Calificación total del módulo

| Evidencia | Peso |
|---|---:|
| Mini proyecto de auditoría y evaluación práctica | 20 % |
| Proyecto final integrador | 80 % |

Para aprobar debes obtener al menos 70 de 100 en el módulo, aprobar el proyecto final y corregir todos los criterios críticos.

---

# 17. Punto de entrega final

Utiliza un único punto de entrega para el mini proyecto, la evaluación y el proyecto final.

## Nombre

```text
COA_SQL_M06_Apellido_Nombre.zip
```

## Estructura

```text
COA_SQL_M06_Apellido_Nombre/
├── COA_SQL_M06_Apellido_Nombre.sql
├── hotel.db
├── hotel_respaldo.db
├── documentacion_hotel.pdf
├── diagrama_hotel.png
├── auditoria_mensajeria.sql
├── evaluacion_m06.pdf
└── evidencias/
    ├── 01_reconstruccion.png
    ├── 02_diagrama_modelo.png
    ├── 03_restricciones.png
    ├── 04_transaccion_commit.png
    ├── 05_transaccion_rollback.png
    ├── 06_consulta_multitabla.png
    ├── 07_cte_financiera.png
    ├── 08_vista.png
    ├── 09_plan_antes.png
    ├── 10_plan_despues.png
    ├── 11_integridad.png
    └── 12_respaldo.png
```

## Script principal

Debe reconstruir el hotel completo e incluir:

1. Configuración.
2. Creación de siete o más tablas.
3. Datos de prueba.
4. DML seguro.
5. Transacción.
6. Vista.
7. Plan anterior al índice.
8. Índice.
9. Plan posterior.
10. Consultas Q01 a Q15.
11. Inspección y verificaciones.

El archivo `hotel.db` demuestra el estado final, pero nunca sustituye el script.

## Documento profesional

Utiliza la plantilla incluida o crea un documento equivalente:

[`Descargar plantilla_documentacion_hotel.md`](/downloads/sql-bases-datos/modulo-6/plantilla_documentacion_hotel.md)

El PDF debe contener:

- Alcance y reglas.
- Diagrama y modelo relacional.
- Restricciones y acciones referenciales.
- Datos de prueba.
- Operaciones y transacción.
- Catálogo de consultas.
- Vista.
- Índice y comparación de planes.
- Integridad y respaldo.
- Seguridad parametrizada.
- Portabilidad.
- Limitaciones y reflexión.

## Auditoría y evaluación

`auditoria_mensajeria.sql` debe incluir la carga original, hallazgos, correcciones, vista, planes y consulta operativa. `evaluacion_m06.pdf` debe contener respuestas de diagnóstico, interpretación y defensa.

## Evidencias

Las capturas deben mostrar consulta e información suficiente para entender el resultado. No captures cada instrucción: selecciona pruebas que demuestren requisitos críticos.

## Texto para el formulario

```text
Curso: SQL y Bases de Datos Relacionales
Módulo: 6 - SQL profesional y proyecto final integrador
Nombre completo: [tu nombre]
Archivo: COA_SQL_M06_Apellido_Nombre.zip
Confirmo que el script reconstruye la base desde cero: Sí
Confirmo que el respaldo fue abierto y verificado: Sí
```

## Correcciones

Si recibes observaciones:

1. Crea una copia antes de modificar.
2. Corrige el script, no solamente la base `.db`.
3. Reconstruye desde cero.
4. Ejecuta todas las verificaciones.
5. Actualiza diagrama, documentación y evidencias afectadas.
6. Añade una sección `Correcciones realizadas`.
7. Envía el archivo con el mismo nombre.

[Entregar el Módulo 6](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 18. Videos recomendados

## Video 1 — Índices y consultas

[`INDEX` en SQL: crear índices y optimizar consultas `SELECT` — CertiDevs](https://www.youtube.com/watch?v=xvVhTN6yK2c)

**Tema exacto:** propósito y creación de índices.  
**Momento recomendado:** antes de la práctica guiada 3.  
**Objetivo:** reforzar la relación entre consulta e índice.  
**Precaución:** no adoptes una regla de rendimiento sin comprobar el plan del motor y el patrón real de datos.

## Video 2 — Vistas

[Vistas SQL y `CREATE VIEW` — Píldoras Informáticas](https://www.youtube.com/watch?v=dfF4WAaUX5c)

**Tema exacto:** creación y consulta de vistas.  
**Momento recomendado:** después de la sección 2.  
**Objetivo:** comprender una vista como una consulta reutilizable con nombre.

---

# 19. Documentación oficial

- [`CREATE VIEW` — SQLite](https://sqlite.org/lang_createview.html)  
  Revisa creación, columnas y naturaleza de solo lectura de las vistas en SQLite.

- [`CREATE INDEX` — SQLite](https://sqlite.org/lang_createindex.html)  
  Consulta índices simples, compuestos y únicos.

- [`EXPLAIN QUERY PLAN` — SQLite](https://sqlite.org/eqp.html)  
  Concéntrate en `SCAN`, `SEARCH`, uso de índices y árboles temporales.

- [Planificador de consultas — SQLite](https://sqlite.org/queryplanner.html)  
  Utilízalo como lectura de ampliación; no necesitas memorizar sus algoritmos.

- [Interfaz de línea de comandos — SQLite](https://sqlite.org/cli.html)  
  Busca `.backup`, `.schema`, `.indexes` y `.eqp`.

- [`VACUUM INTO` — SQLite](https://sqlite.org/lang_vacuum.html#vacuuminto)  
  Revisa condiciones y limitaciones antes de generar una copia.

## Lectura dirigida

| Necesidad | Término |
|---|---|
| Saber si una vista almacena resultados | `CREATE VIEW` description |
| Interpretar acceso completo | `SCAN` |
| Interpretar acceso selectivo | `SEARCH` |
| Identificar índice de cobertura | `COVERING INDEX` |
| Detectar orden temporal | `USE TEMP B-TREE` |
| Revisar costo de índices | Query planner, lookup and sorting |
| Crear copia | `.backup` o `VACUUM INTO` |

La salida exacta de `EXPLAIN QUERY PLAN` puede cambiar entre versiones. Documenta el resultado que observaste, la versión utilizada y su significado general.

---

# 20. Referencias de portabilidad

No deben estudiarse completas. Sirven para ubicar el equivalente cuando cambies de motor.

- [Tutorial SQL oficial de PostgreSQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
- [Sentencias SQL de MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/sql-statements.html)
- [Referencia de Transact-SQL — Microsoft Learn](https://learn.microsoft.com/es-es/sql/t-sql/language-reference)
- [Sentencias SQL de MariaDB](https://mariadb.com/kb/en/sql-statements/)
- [Referencia SQL de Oracle Database](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/)

---

# 21. Material complementario

Este módulo incluye solamente:

1. [`datos_mensajeria_m06.sql`](/downloads/sql-bases-datos/modulo-6/datos_mensajeria_m06.sql), necesario para realizar la auditoría sobre la misma base.
2. [`plantilla_documentacion_hotel.md`](/downloads/sql-bases-datos/modulo-6/plantilla_documentacion_hotel.md), editable y opcional, para organizar la memoria del proyecto.

El enunciado, la rúbrica y la lista técnica ya están dentro del módulo. No necesitas descargar un PDF que duplique el contenido.

---

# 22. Glosario

| Término | Definición |
|---|---|
| Auditoría | Revisión sistemática de diseño, integridad, consultas y evidencia |
| Búsqueda selectiva | Acceso a un subconjunto de filas mediante un criterio |
| Consulta parametrizada | Instrucción cuya estructura se envía separada de sus valores |
| Costo de escritura | Trabajo adicional para mantener índices al cambiar datos |
| Índice | Estructura auxiliar que facilita determinados accesos |
| Índice automático | Índice creado por SQLite para apoyar restricciones como `UNIQUE` |
| Índice compuesto | Índice construido sobre varias columnas en un orden definido |
| Índice redundante | Índice que duplica de forma innecesaria otro acceso existente |
| Inyección SQL | Alteración de una instrucción al incorporar datos externos como código |
| Marcador | Símbolo que reserva el lugar de un valor parametrizado |
| Migración | Cambio controlado de estructura o datos entre versiones |
| Plan de consulta | Estrategia elegida por el motor para ejecutar una instrucción |
| Portabilidad | Capacidad de adaptar una solución a otro motor |
| Reproducibilidad | Capacidad de reconstruir el mismo resultado mediante instrucciones |
| Respaldo | Copia recuperable y verificada de la base |
| `SCAN` | Indicador de recorrido completo o amplio de una fuente en el plan |
| `SEARCH` | Indicador de búsqueda de un subconjunto, normalmente apoyada por índice |
| Selectividad | Proporción de filas descartadas o localizadas por un criterio |
| `sqlite_schema` | Catálogo de tablas, vistas, índices y otros objetos de SQLite |
| Vista | Consulta guardada con nombre, utilizada como fuente de lectura |
| `VACUUM INTO` | Instrucción de SQLite que genera una base compacta en otro archivo |

---

# 23. Resumen final del módulo

En este módulo integraste el curso completo:

```text
Diseñar
  ↓
Proteger
  ↓
Cargar y modificar
  ↓
Consultar y relacionar
  ↓
Reutilizar con vistas
  ↓
Analizar índices y planes
  ↓
Verificar y respaldar
  ↓
Documentar y entregar
```

Ahora puedes:

- Organizar scripts reproducibles.
- Crear vistas útiles.
- Proponer índices con una consulta real como justificación.
- Detectar índices redundantes.
- Interpretar un plan elemental.
- Diferenciar `SCAN` de `SEARCH` sin convertirlos en etiquetas absolutas.
- Explicar parametrización e inyección SQL.
- Inspeccionar esquema, relaciones e índices.
- Verificar integridad estructural y referencial.
- Crear y probar un respaldo.
- Documentar portabilidad.
- Construir y defender una base relacional completa.

## Habilidades obtenidas

Al aprobar habrás demostrado que puedes:

- Pasar de un problema real a un modelo implementado.
- Proteger reglas con la técnica adecuada.
- Resolver reportes sin duplicar medidas.
- Auditar una solución existente mediante evidencia.
- Reconocer los límites de una prueba de rendimiento pequeña.
- Preparar una base para conectarla posteriormente a una aplicación.
- Entregar documentación suficiente para mantenimiento y revisión.

---

# 24. Cierre del curso

Has recorrido:

```text
Fundamentos relacionales
        ↓
Diseño y normalización
        ↓
Gestión segura de datos
        ↓
Consultas y análisis
        ↓
Consultas multitabla
        ↓
Proyecto profesional completo
```

## Requisitos para obtener el certificado de participación

Debes:

- Completar los seis módulos.
- Realizar las actividades obligatorias.
- Aprobar las seis evaluaciones prácticas.
- Aprobar los proyectos de los módulos 1 a 5.
- Aprobar el proyecto final integrador.
- Presentar las correcciones obligatorias.
- Cumplir el formato de entrega y las normas de autoría académica de COA.

El certificado demuestra que completaste satisfactoriamente una ruta práctica de 24 horas. No sustituye una certificación profesional de un fabricante ni afirma experiencia laboral.

## Continuidad recomendada

Ahora estás preparado para continuar con:

- Conexión de Python con SQLite.
- Desarrollo de Software con Python.
- Persistencia de datos en aplicaciones.
- PostgreSQL, MySQL o SQL Server.
- Administración y optimización especializada de bases de datos.

## Preguntas finales de dominio

Debes poder responder y demostrar:

1. ¿Cómo traduces una regla de negocio a una restricción o proceso?
2. ¿Cómo decides las tablas y relaciones?
3. ¿Cómo modificas datos sin ejecutar cambios a ciegas?
4. ¿Cómo diferencias filtros de filas y grupos?
5. ¿Cómo evitas perder entidades en un `LEFT JOIN`?
6. ¿Cómo detectas una medida multiplicada por relaciones?
7. ¿Qué consulta justifica tu índice?
8. ¿Qué cambió en el plan antes y después?
9. ¿Cómo impides que datos externos se conviertan en SQL?
10. ¿Cómo demuestra otra persona que tu solución es reproducible?

Si puedes responder con el script, el diagrama, las consultas y la evidencia de tu proyecto, has alcanzado el objetivo del curso.
