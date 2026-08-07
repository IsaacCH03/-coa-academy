# COA — Cursos Online Avanzados

## SQL y Bases de Datos Relacionales

# Módulo 4. Consultas, funciones y análisis de información

**Duración estimada:** 4 horas y 30 minutos  
**Nivel:** intermedio  
**Modalidad:** autodidacta y práctica  
**Motor de base de datos:** SQLite  
**Herramienta principal:** DB Browser for SQLite  
**Resultado principal:** un informe reproducible de operaciones comerciales construido con consultas SQL

---

## Bienvenida

Una base de datos adquiere valor cuando permite responder preguntas.

Una tienda no necesita saber únicamente que existen 48 operaciones. Necesita descubrir cuánto vendió, qué productos tuvieron mayor movimiento, qué categorías generaron más ingresos, qué operaciones siguen pendientes y en qué meses cambió el comportamiento de sus clientes.

En este módulo convertirás preguntas escritas en lenguaje cotidiano en consultas SQL. Aprenderás a seleccionar, filtrar, ordenar, transformar, agrupar y resumir información sin modificar los datos originales.

El objetivo no consiste en memorizar instrucciones aisladas. La habilidad profesional consiste en comprender una necesidad, identificar los datos que intervienen, construir una consulta correcta y explicar qué significa su resultado.

```text
Pregunta del negocio
        ↓
Datos necesarios
        ↓
Consulta SQL
        ↓
Resultado comprobado
        ↓
Conclusión útil
```

> **Principio del módulo:** una consulta correcta no es la que “se ejecuta sin errores”, sino la que responde exactamente la pregunta planteada.

---

## Conocimientos previos

Antes de comenzar debes haber aprobado los módulos 1, 2 y 3. Necesitarás poder:

- Abrir y ejecutar scripts en DB Browser for SQLite.
- Reconocer tablas, columnas, filas y tipos de datos.
- Crear tablas con restricciones básicas.
- Interpretar claves primarias y foráneas.
- Insertar datos y utilizar `NULL` correctamente.
- Aplicar un `WHERE` sencillo para identificar registros.
- Guardar una base de datos y preparar evidencias.

En este módulo no utilizarás `JOIN`, subconsultas ni vistas. Esos recursos se estudiarán después. Todas las consultas trabajarán con una sola tabla cada vez para dominar primero el razonamiento esencial de `SELECT`.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Traducir preguntas reales a consultas SQL.
- Elegir únicamente las columnas necesarias.
- Asignar alias claros a columnas y resultados calculados.
- Eliminar duplicados con `DISTINCT` cuando la pregunta lo requiera.
- Filtrar filas mediante comparaciones y operadores lógicos.
- Utilizar `IN`, `BETWEEN`, `LIKE` e `IS NULL` correctamente.
- Controlar condiciones complejas con paréntesis.
- Ordenar resultados por una o varias columnas.
- Limitar resultados y construir una paginación básica.
- Crear columnas calculadas sin modificar la tabla.
- Clasificar resultados mediante `CASE`.
- Limpiar y presentar datos con funciones de texto.
- Aplicar funciones numéricas y de fecha útiles.
- Resumir información con `COUNT`, `SUM`, `AVG`, `MIN` y `MAX`.
- Formar grupos con `GROUP BY`.
- Filtrar grupos con `HAVING`.
- Diferenciar con seguridad `WHERE` de `HAVING`.
- Explicar el orden lógico de una consulta.
- Detectar consultas sintácticamente válidas que responden mal una pregunta.
- Escribir SQL claro, comprobable y razonablemente portable.

---

## Producto que construirás

Analizarás un conjunto de 48 operaciones de una tienda. El proyecto incluirá:

- Consultas de exploración.
- Filtros comerciales.
- Rankings y resultados limitados.
- Importes calculados.
- Clasificaciones con `CASE`.
- Limpieza de valores para presentación.
- Indicadores generales.
- Resúmenes por categoría, producto, ciudad y forma de pago.
- Filtros aplicados a grupos.
- Una explicación escrita de los resultados principales.

El archivo de datos contiene una sola tabla preparada para análisis:

```text
operaciones_tienda
├── identificación y fecha
├── producto y categoría
├── cantidad y precio
├── descuento
├── ubicación
├── método de pago
├── estado
└── canal
```

Esta tabla es una fotografía de reporte. En un sistema operativo real, productos, categorías y ventas normalmente estarían separados en tablas relacionadas. Más adelante aprenderás a reunir esas tablas mediante `JOIN`.

---

## Ruta de trabajo y distribución del tiempo

| Actividad | Tiempo aproximado |
|---|---:|
| Explicaciones y demostraciones | 55 minutos |
| Prácticas guiadas | 55 minutos |
| Ejercicios individuales, interpretación y depuración | 40 minutos |
| Mini proyecto: estadísticas de un torneo | 25 minutos |
| Proyecto del módulo: análisis de operaciones de una tienda | 80 minutos |
| Evaluación y preparación de la entrega | 15 minutos |
| **Total** | **4 horas y 30 minutos** |

Los tiempos son orientativos. Si una consulta produce un resultado inesperado, detente, formula la pregunta nuevamente y comprueba cada condición por separado.

---

# 1. De una pregunta a una consulta

## 1.1 Una consulta es una pregunta precisa

Observa estas dos peticiones:

```text
Muéstrame las ventas.
```

```text
Muéstrame el código, el producto y el importe de las operaciones
confirmadas durante marzo de 2026, ordenadas del mayor importe al menor.
```

La segunda petición define:

- Qué columnas necesita.
- Qué filas deben participar.
- Qué cálculo debe realizarse.
- Qué orden debe tener el resultado.

Antes de escribir SQL, completa este análisis:

| Pregunta | Decisión |
|---|---|
| ¿De qué tabla salen los datos? | `FROM` |
| ¿Qué filas cumplen la condición? | `WHERE` |
| ¿Qué columnas o cálculos deben mostrarse? | `SELECT` |
| ¿Cómo debe presentarse el resultado? | `ORDER BY` |
| ¿Se necesitan todos los resultados? | `LIMIT` |
| ¿Se requiere un resumen por grupos? | `GROUP BY` |
| ¿Qué grupos deben conservarse? | `HAVING` |

## 1.2 Anatomía visible de `SELECT`

Una consulta puede contener estas cláusulas:

```sql
SELECT columnas_o_expresiones
FROM tabla
WHERE condicion_de_filas
GROUP BY columnas_de_agrupacion
HAVING condicion_de_grupos
ORDER BY criterio
LIMIT cantidad OFFSET desplazamiento;
```

No todas las cláusulas son obligatorias. La consulta más pequeña puede ser:

```sql
SELECT nombre
FROM productos;
```

## 1.3 Orden de escritura y orden lógico

SQL se escribe comenzando con `SELECT`, pero conceptualmente procesa la información en otro orden simplificado:

```text
1. FROM       → localiza la fuente
2. WHERE      → descarta filas
3. GROUP BY   → forma grupos
4. HAVING     → descarta grupos
5. SELECT     → construye las columnas del resultado
6. DISTINCT   → elimina resultados repetidos
7. ORDER BY   → ordena
8. LIMIT      → conserva una parte
```

Este orden explica muchos errores. Por ejemplo, `WHERE` no puede filtrar el resultado de una función de agregación porque se aplica antes de crear los grupos. Para eso existe `HAVING`.

El modelo es deliberadamente simplificado y suficiente para resolver las consultas del módulo.

## 1.4 Consultar no es modificar

`SELECT` lee información. No cambia las filas almacenadas.

```sql
SELECT codigo, nombre, precio
FROM productos;
```

Puedes ejecutar una consulta varias veces y obtener el mismo resultado mientras los datos no cambien. Esta característica permite explorar y comprobar información con menos riesgo que una operación `UPDATE` o `DELETE`.

---

# 2. Selección de columnas, alias y valores distintos

## 2.1 Seleccionar columnas explícitas

`SELECT *` devuelve todas las columnas:

```sql
SELECT *
FROM productos;
```

Es útil para una exploración rápida durante el aprendizaje. Sin embargo, una consulta final debe indicar qué necesita:

```sql
SELECT codigo, nombre, precio
FROM productos;
```

Ventajas de las columnas explícitas:

- El propósito de la consulta queda claro.
- El resultado contiene menos información innecesaria.
- El orden de las columnas es controlado.
- Un cambio futuro en la tabla afecta menos la salida.
- Se evita exponer datos que no forman parte de la pregunta.

## 2.2 Alias con `AS`

Un alias cambia el encabezado dentro del resultado; no renombra la columna almacenada.

```sql
SELECT
    codigo AS codigo_producto,
    nombre AS producto,
    precio AS precio_unitario
FROM productos;
```

Los alias son especialmente útiles para cálculos:

```sql
SELECT
    nombre,
    precio,
    stock,
    precio * stock AS valor_inventario
FROM productos;
```

Si un alias contiene espacios, SQLite permite comillas dobles:

```sql
SELECT precio * stock AS "Valor del inventario"
FROM productos;
```

Para scripts profesionales y reutilizables, suele ser más práctico utilizar alias sin espacios, escritos en `snake_case`.

## 2.3 Resultados únicos con `DISTINCT`

Imagina una tabla con cientos de operaciones, pero solamente cuatro categorías. Esta consulta repite la categoría de cada fila:

```sql
SELECT categoria
FROM operaciones_tienda;
```

Para conocer qué categorías diferentes existen:

```sql
SELECT DISTINCT categoria
FROM operaciones_tienda;
```

`DISTINCT` se aplica a la combinación completa de columnas seleccionadas:

```sql
SELECT DISTINCT metodo_pago, canal
FROM operaciones_tienda;
```

El resultado contiene cada combinación distinta de método y canal. No significa que cada columna se haga independiente de la otra.

### Pregunta de control

Si se seleccionan `categoria` y `producto` con `DISTINCT`, ¿se obtiene una fila por categoría?

No necesariamente. Se obtiene una fila por cada combinación diferente de categoría y producto.

---

# 3. Filtrado con `WHERE`

## 3.1 Comparaciones básicas

`WHERE` conserva únicamente las filas cuya condición resulta verdadera.

| Operador | Significado |
|---|---|
| `=` | Igual a |
| `<>` o `!=` | Diferente de |
| `>` | Mayor que |
| `<` | Menor que |
| `>=` | Mayor o igual que |
| `<=` | Menor o igual que |

Ejemplo:

```sql
SELECT producto, cantidad, estado
FROM operaciones_tienda
WHERE estado = 'Confirmada';
```

Los textos se escriben entre comillas simples. Los números no:

```sql
SELECT producto, precio_unitario
FROM operaciones_tienda
WHERE precio_unitario >= 20;
```

## 3.2 Operadores lógicos

### `AND`: todas las condiciones deben cumplirse

```sql
SELECT producto, ciudad, estado
FROM operaciones_tienda
WHERE estado = 'Confirmada'
  AND ciudad = 'San Jose';
```

### `OR`: al menos una condición debe cumplirse

```sql
SELECT producto, categoria
FROM operaciones_tienda
WHERE categoria = 'Tecnologia'
   OR categoria = 'Accesorios';
```

### `NOT`: niega una condición

```sql
SELECT producto, estado
FROM operaciones_tienda
WHERE NOT estado = 'Cancelada';
```

También puede escribirse de forma más directa:

```sql
WHERE estado <> 'Cancelada'
```

## 3.3 Los paréntesis protegen la intención

`AND` se evalúa antes que `OR`. Observa:

```sql
WHERE categoria = 'Tecnologia'
   OR categoria = 'Accesorios'
  AND estado = 'Confirmada'
```

SQLite interpreta:

```text
Tecnología
O
(Accesorios Y Confirmada)
```

Si la intención es obtener operaciones confirmadas de cualquiera de las dos categorías, escribe:

```sql
WHERE (categoria = 'Tecnologia' OR categoria = 'Accesorios')
  AND estado = 'Confirmada';
```

> Cuando una condición combina `AND` y `OR`, utiliza paréntesis aunque conozcas la precedencia. El objetivo no es demostrar memoria, sino comunicar la regla sin ambigüedad.

## 3.4 `IN`: pertenencia a una lista

En lugar de repetir muchos `OR`:

```sql
WHERE categoria = 'Tecnologia'
   OR categoria = 'Accesorios'
   OR categoria = 'Hogar'
```

puedes escribir:

```sql
WHERE categoria IN ('Tecnologia', 'Accesorios', 'Hogar')
```

Para excluirlos:

```sql
WHERE categoria NOT IN ('Tecnologia', 'Accesorios', 'Hogar')
```

## 3.5 `BETWEEN`: intervalo inclusivo

```sql
SELECT fecha, producto, cantidad
FROM operaciones_tienda
WHERE fecha BETWEEN '2026-03-01' AND '2026-03-31';
```

`BETWEEN` incluye ambos extremos. Equivale a:

```sql
WHERE fecha >= '2026-03-01'
  AND fecha <= '2026-03-31'
```

En este curso las fechas se almacenan como texto ISO `AAAA-MM-DD`. Ese formato permite ordenarlas y compararlas cronológicamente cuando todas son fechas válidas y mantienen exactamente la misma estructura.

## 3.6 `LIKE`: búsqueda por patrones

`LIKE` utiliza comodines:

| Comodín | Significado |
|---|---|
| `%` | Cero o más caracteres |
| `_` | Exactamente un carácter |

Ejemplos:

```sql
-- Empieza con "M"
WHERE producto LIKE 'M%'

-- Contiene "escritorio"
WHERE producto LIKE '%escritorio%'

-- Tiene cualquier carácter antes de "able"
WHERE producto LIKE '_able%'
```

La sensibilidad a mayúsculas y minúsculas de `LIKE` puede variar según el motor, la configuración y los caracteres utilizados. No bases una regla crítica en ese comportamiento sin comprobar el motor de destino.

## 3.7 `NULL` requiere `IS NULL`

`NULL` representa ausencia de un valor conocido. No se compara con `=`:

```sql
-- Incorrecto
WHERE ciudad = NULL
```

```sql
-- Correcto
WHERE ciudad IS NULL
```

Para conservar valores conocidos:

```sql
WHERE ciudad IS NOT NULL
```

La expresión `ciudad = NULL` no resulta verdadera, aunque la celda esté vacía. En SQL, una comparación con información desconocida produce un resultado desconocido.

---

# 4. Orden y cantidad de resultados

## 4.1 `ORDER BY`

Sin `ORDER BY`, SQL no garantiza el orden de las filas. El hecho de que hoy aparezcan por `id` no convierte ese orden en una promesa.

Orden ascendente:

```sql
SELECT producto, precio_unitario
FROM operaciones_tienda
ORDER BY precio_unitario ASC;
```

`ASC` es el valor predeterminado, pero escribirlo puede mejorar la claridad.

Orden descendente:

```sql
SELECT producto, precio_unitario
FROM operaciones_tienda
ORDER BY precio_unitario DESC;
```

## 4.2 Orden por varios criterios

```sql
SELECT categoria, producto, precio_unitario
FROM operaciones_tienda
ORDER BY categoria ASC, precio_unitario DESC, producto ASC;
```

El orden se interpreta de izquierda a derecha:

1. Agrupa visualmente por categoría en orden alfabético.
2. Dentro de cada categoría, coloca primero el precio mayor.
3. Si dos precios son iguales, ordena el producto alfabéticamente.

Añadir un criterio estable, como `id`, evita que dos filas empatadas cambien de posición entre ejecuciones:

```sql
ORDER BY fecha DESC, id DESC
```

## 4.3 `LIMIT` y `OFFSET`

Los cinco precios unitarios más altos:

```sql
SELECT DISTINCT producto, precio_unitario
FROM operaciones_tienda
ORDER BY precio_unitario DESC
LIMIT 5;
```

Saltar cinco resultados y mostrar los cinco siguientes:

```sql
SELECT id, fecha, producto
FROM operaciones_tienda
ORDER BY fecha DESC, id DESC
LIMIT 5 OFFSET 5;
```

La paginación puede imaginarse así:

```text
Página 1: LIMIT 5 OFFSET 0
Página 2: LIMIT 5 OFFSET 5
Página 3: LIMIT 5 OFFSET 10
```

No utilices `LIMIT` para elegir “los mejores” sin definir primero `ORDER BY`. Sin orden, solo obtendrías una cantidad arbitraria de filas.

`LIMIT` es común en SQLite, MySQL y PostgreSQL. Otros motores ofrecen variantes como `TOP` u `OFFSET ... FETCH`. El propósito es el mismo, pero la sintaxis puede cambiar.

---

# 5. Expresiones y columnas calculadas

## 5.1 Calcular sin alterar la tabla

Una expresión produce un valor para cada fila del resultado:

```sql
SELECT
    producto,
    cantidad,
    precio_unitario,
    cantidad * precio_unitario AS subtotal
FROM operaciones_tienda;
```

La columna `subtotal` no se guarda. Se calcula cada vez que se ejecuta la consulta.

Para aplicar un descuento porcentual:

```sql
SELECT
    producto,
    cantidad * precio_unitario AS subtotal,
    descuento_porcentaje,
    cantidad * precio_unitario * descuento_porcentaje / 100.0
        AS monto_descuento,
    cantidad * precio_unitario
        * (1 - descuento_porcentaje / 100.0) AS total_neto
FROM operaciones_tienda;
```

El valor `100.0` comunica que la operación utiliza una proporción decimal.

## 5.2 Redondear para presentar

```sql
SELECT
    producto,
    ROUND(
        cantidad * precio_unitario
        * (1 - descuento_porcentaje / 100.0),
        2
    ) AS total_neto
FROM operaciones_tienda;
```

`ROUND(..., 2)` mejora la presentación a dos decimales. No convierte un tipo `REAL` en un sistema contable exacto. Las aplicaciones financieras reales necesitan decisiones explícitas sobre moneda, precisión y redondeo.

## 5.3 Clasificar con `CASE`

`CASE` permite crear una categoría derivada:

```sql
SELECT
    producto,
    cantidad,
    CASE
        WHEN cantidad >= 8 THEN 'Volumen alto'
        WHEN cantidad >= 4 THEN 'Volumen medio'
        ELSE 'Volumen bajo'
    END AS nivel_volumen
FROM operaciones_tienda;
```

Las condiciones se revisan de arriba hacia abajo. La primera verdadera determina el resultado.

```text
cantidad = 10
    ↓
¿cantidad >= 8? Sí
    ↓
'Volumen alto'
```

Por eso el orden importa. Si se colocara primero `cantidad >= 4`, una cantidad de 10 sería clasificada como volumen medio y nunca alcanzaría la condición siguiente.

`CASE` también puede combinar condiciones:

```sql
CASE
    WHEN estado = 'Confirmada' AND descuento_porcentaje >= 15
        THEN 'Confirmada con descuento alto'
    WHEN estado = 'Confirmada'
        THEN 'Confirmada'
    ELSE 'No concretada'
END AS clasificacion
```

---

# 6. Funciones útiles para presentar y transformar datos

## 6.1 Funciones de texto

| Función o expresión | Propósito | Ejemplo |
|---|---|---|
| `UPPER(texto)` | Convertir a mayúsculas | `UPPER(producto)` |
| `LOWER(texto)` | Convertir a minúsculas | `LOWER(categoria)` |
| `LENGTH(texto)` | Contar caracteres | `LENGTH(producto)` |
| `TRIM(texto)` | Quitar espacios en extremos | `TRIM(ciudad)` |
| `REPLACE(texto, viejo, nuevo)` | Sustituir fragmentos | `REPLACE(canal, 'Telefono', 'Teléfono')` |
| `texto1 || texto2` | Concatenar en SQLite | `codigo_producto || ' - ' || producto` |

Ejemplo completo:

```sql
SELECT
    UPPER(categoria) AS categoria_mayuscula,
    codigo_producto || ' - ' || producto AS producto_identificado,
    LENGTH(producto) AS caracteres_nombre
FROM operaciones_tienda;
```

La concatenación varía entre motores. SQLite y PostgreSQL utilizan `||`; MySQL suele utilizar `CONCAT()`; SQL Server suele admitir `+`. Comprueba siempre la documentación del motor.

## 6.2 Sustituir un `NULL` para mostrarlo

`COALESCE` devuelve el primer argumento que no sea `NULL`:

```sql
SELECT
    producto,
    COALESCE(ciudad, 'Ciudad no registrada') AS ciudad_presentada
FROM operaciones_tienda;
```

Esto no cambia el dato almacenado. Solo crea una presentación más comprensible.

```text
COALESCE(ciudad, 'Ciudad no registrada')
       │
       ├── ciudad tiene valor → devuelve ciudad
       └── ciudad es NULL     → devuelve el texto alternativo
```

No confundas “mostrar un reemplazo” con “corregir la base”. Si una ciudad debe conocerse obligatoriamente, el problema debe resolverse en el diseño o en la captura del dato.

## 6.3 Funciones numéricas

```sql
SELECT
    precio_unitario,
    ROUND(precio_unitario, 1) AS precio_redondeado,
    ABS(-precio_unitario) AS valor_absoluto
FROM operaciones_tienda;
```

Funciones frecuentes en SQLite:

- `ROUND(numero, decimales)` redondea.
- `ABS(numero)` obtiene el valor absoluto.
- `MAX(a, b, ...)` y `MIN(a, b, ...)` pueden comparar varios argumentos como funciones escalares en SQLite. No deben confundirse con sus usos agregados sobre muchas filas.

## 6.4 Fechas en SQLite

SQLite no posee un tipo de fecha dedicado. Puede almacenar fechas como texto ISO, números julianos o marcas de tiempo. En este curso se utiliza texto `AAAA-MM-DD`.

Extraer año y mes:

```sql
SELECT
    fecha,
    strftime('%Y', fecha) AS anio,
    strftime('%m', fecha) AS mes
FROM operaciones_tienda;
```

Presentar el primer día del mes:

```sql
SELECT
    fecha,
    date(fecha, 'start of month') AS inicio_mes
FROM operaciones_tienda;
```

Calcular días transcurridos entre la operación y una fecha de referencia:

```sql
SELECT
    fecha,
    CAST(julianday('2026-05-01') - julianday(fecha) AS INTEGER)
        AS dias_transcurridos
FROM operaciones_tienda;
```

Las funciones de fecha son una de las áreas con más diferencias entre motores. `strftime()` y los modificadores de `date()` pertenecen a SQLite. MySQL, PostgreSQL y SQL Server ofrecen herramientas equivalentes con otra sintaxis.

> Guarda las fechas en un formato consistente. Una cadena como `03/04/26` es ambigua y no se ordena de forma segura como una fecha ISO.

---

# 7. Funciones de agregación

## 7.1 De muchas filas a un resumen

Una función de agregación recibe varias filas y produce un valor resumido.

| Función | Responde |
|---|---|
| `COUNT(*)` | ¿Cuántas filas existen? |
| `COUNT(columna)` | ¿Cuántos valores no nulos existen? |
| `SUM(columna)` | ¿Cuál es la suma? |
| `AVG(columna)` | ¿Cuál es el promedio? |
| `MIN(columna)` | ¿Cuál es el menor valor? |
| `MAX(columna)` | ¿Cuál es el mayor valor? |

Ejemplo:

```sql
SELECT
    COUNT(*) AS total_operaciones,
    SUM(cantidad) AS unidades_registradas,
    AVG(precio_unitario) AS precio_promedio,
    MIN(precio_unitario) AS precio_minimo,
    MAX(precio_unitario) AS precio_maximo
FROM operaciones_tienda;
```

## 7.2 `COUNT(*)` no es igual a `COUNT(columna)`

```sql
SELECT
    COUNT(*) AS filas,
    COUNT(ciudad) AS ciudades_registradas
FROM operaciones_tienda;
```

`COUNT(*)` cuenta las 48 filas. `COUNT(ciudad)` ignora las filas donde `ciudad` es `NULL`.

Esta diferencia puede medir calidad de datos:

```sql
SELECT
    COUNT(*) - COUNT(ciudad) AS operaciones_sin_ciudad
FROM operaciones_tienda;
```

## 7.3 Agregar una expresión

Para calcular ingresos confirmados no basta sumar precios unitarios. Cada fila posee cantidad y descuento:

```sql
SELECT
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_confirmado
FROM operaciones_tienda
WHERE estado = 'Confirmada';
```

El orden conceptual es:

```text
WHERE conserva operaciones confirmadas
        ↓
la expresión calcula el total de cada fila
        ↓
SUM reúne esos totales
        ↓
ROUND presenta el resultado
```

## 7.4 Los agregados y `NULL`

En general, `SUM`, `AVG`, `MIN` y `MAX` ignoran valores `NULL`. Esto puede ser correcto o puede ocultar un problema, según la pregunta.

Si una calificación desconocida aparece como `NULL`, el promedio de las conocidas no es igual a tratar la desconocida como cero. Antes de utilizar `COALESCE` dentro de una agregación, decide qué significa realmente la ausencia.

---

# 8. Agrupación con `GROUP BY`

## 8.1 Crear un resumen por categoría

Sin agrupación, la agregación resume toda la tabla. Con `GROUP BY`, se obtiene un resumen independiente por cada valor:

```sql
SELECT
    categoria,
    COUNT(*) AS operaciones,
    SUM(cantidad) AS unidades
FROM operaciones_tienda
GROUP BY categoria
ORDER BY unidades DESC;
```

Puedes imaginar que SQL separa temporalmente las filas:

```text
Papelería  ──────┐
Tecnología ──────┼── cada grupo recibe COUNT y SUM
Accesorios ──────┤
Hogar ───────────┘
```

## 8.2 Agrupar por varias columnas

```sql
SELECT
    categoria,
    estado,
    COUNT(*) AS operaciones
FROM operaciones_tienda
GROUP BY categoria, estado
ORDER BY categoria, estado;
```

Cada grupo representa una combinación distinta de categoría y estado.

## 8.3 Regla de portabilidad

En una consulta agrupada, cada columna mostrada que no esté dentro de una función de agregación debe aparecer en `GROUP BY`.

Consulta clara y portable:

```sql
SELECT
    categoria,
    estado,
    COUNT(*) AS operaciones
FROM operaciones_tienda
GROUP BY categoria, estado;
```

Consulta problemática:

```sql
SELECT
    categoria,
    producto,
    COUNT(*) AS operaciones
FROM operaciones_tienda
GROUP BY categoria;
```

En el segundo caso hay varios productos dentro de cada categoría. ¿Cuál debería mostrarse? SQLite puede escoger el valor de una fila del grupo, pero otros motores rechazan la consulta y el resultado no responde una regla clara.

> No aproveches las “columnas sueltas” permitidas por SQLite. Si una columna no está agregada, inclúyela en `GROUP BY` o retírala del resultado.

## 8.4 Agrupar por mes

```sql
SELECT
    strftime('%Y-%m', fecha) AS periodo,
    COUNT(*) AS operaciones,
    SUM(cantidad) AS unidades
FROM operaciones_tienda
GROUP BY strftime('%Y-%m', fecha)
ORDER BY periodo;
```

Agrupar por una expresión permite transformar el dato y utilizar esa transformación como criterio del grupo.

---

# 9. Filtrado de grupos con `HAVING`

## 9.1 `WHERE` filtra filas; `HAVING` filtra grupos

Pregunta:

> ¿Qué categorías tienen al menos ocho operaciones confirmadas?

Primero se eliminan las operaciones no confirmadas. Después se forman categorías. Finalmente se conservan los grupos cuyo conteo cumple la condición:

```sql
SELECT
    categoria,
    COUNT(*) AS operaciones_confirmadas
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY categoria
HAVING COUNT(*) >= 8
ORDER BY operaciones_confirmadas DESC;
```

```text
Filas originales
    ↓ WHERE estado = 'Confirmada'
Filas confirmadas
    ↓ GROUP BY categoria
Grupos por categoría
    ↓ HAVING COUNT(*) >= 8
Categorías que cumplen
```

## 9.2 Decidir entre `WHERE` y `HAVING`

| Necesidad | Cláusula |
|---|---|
| Excluir operaciones canceladas antes de agrupar | `WHERE` |
| Conservar productos de Tecnología | `WHERE` |
| Mostrar categorías con más de 20 unidades | `HAVING` |
| Mostrar meses cuyo ingreso supera un monto | `HAVING` |
| Considerar solo fechas de marzo | `WHERE` |

Regla práctica:

```text
¿La condición se puede evaluar en una fila individual?
    ├── Sí → WHERE
    └── No, necesita COUNT/SUM/AVG o el grupo → HAVING
```

## 9.3 Error frecuente

```sql
SELECT categoria, COUNT(*) AS total
FROM operaciones_tienda
WHERE COUNT(*) >= 8
GROUP BY categoria;
```

`COUNT(*)` todavía no existe cuando se aplica `WHERE`. La versión correcta usa `HAVING`:

```sql
SELECT categoria, COUNT(*) AS total
FROM operaciones_tienda
GROUP BY categoria
HAVING COUNT(*) >= 8;
```

---

# 10. Método profesional para construir una consulta

## 10.1 Los seis pasos

Utiliza este procedimiento:

1. **Reescribe la pregunta.** Elimina palabras ambiguas.
2. **Identifica la granularidad.** Decide si el resultado necesita filas individuales o un resumen por grupo.
3. **Enumera las columnas.** Incluye únicamente datos necesarios.
4. **Separa filtros.** Distingue condiciones de filas y condiciones de grupos.
5. **Define cálculos y orden.** Especifica fórmulas, alias y criterios de desempate.
6. **Comprueba el resultado.** Verifica casos límite y explica una fila.

## 10.2 Ejemplo razonado

Petición original:

> Necesitamos saber las categorías más importantes.

La palabra “importantes” es ambigua. Debe convertirse en una regla medible:

> Mostrar el ingreso neto de operaciones confirmadas por categoría. Conservar solamente categorías con ingresos de al menos 150 y ordenar de mayor a menor ingreso.

Diseño:

| Decisión | Resultado |
|---|---|
| Fuente | `operaciones_tienda` |
| Filas | Solo `estado = 'Confirmada'` |
| Grupos | `categoria` |
| Medida | Suma de cantidad × precio × descuento |
| Filtro de grupos | Ingreso de al menos 150 |
| Orden | Ingreso descendente |

Consulta:

```sql
SELECT
    categoria,
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY categoria
HAVING SUM(
    cantidad * precio_unitario
    * (1 - descuento_porcentaje / 100.0)
) >= 150
ORDER BY ingreso_neto DESC;
```

## 10.3 Cómo comprobar una consulta

- Ejecuta primero una versión sin agregación y observa las filas participantes.
- Comprueba los extremos del intervalo de fechas.
- Verifica si `NULL` debe incluirse o excluirse.
- Calcula manualmente una fila o un grupo pequeño.
- Confirma el número de resultados.
- Busca empates y añade un criterio de orden secundario.
- Lee la pregunta nuevamente y compara cada palabra con una cláusula.

---

# 11. Prácticas guiadas

Para estas prácticas utiliza `operaciones_tienda`. Puedes crearla ejecutando el archivo `datos_tienda_m04.sql` incluido con el módulo.

## Práctica guiada 1 — Explorar y filtrar

### Situación

El equipo comercial necesita revisar operaciones confirmadas de Tecnología y Accesorios realizadas por Web durante marzo de 2026.

### Construcción

1. Selecciona `id`, `fecha`, `producto`, `categoria`, `cantidad` y `estado`.
2. Conserva dos categorías con `IN`.
3. Exige que el estado sea confirmado.
4. Exige el canal Web.
5. Limita el intervalo a marzo.
6. Ordena desde la fecha más reciente; utiliza `id` para desempatar.

```sql
SELECT
    id,
    fecha,
    producto,
    categoria,
    cantidad,
    estado
FROM operaciones_tienda
WHERE categoria IN ('Tecnologia', 'Accesorios')
  AND estado = 'Confirmada'
  AND canal = 'Web'
  AND fecha BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY fecha DESC, id DESC;
```

### Comprobación

- Ninguna fila debe pertenecer a Papelería o Hogar.
- Ninguna fila puede estar pendiente o cancelada.
- Todas las fechas deben comenzar con `2026-03`.
- Todos los canales deben ser Web.

### Modificación

Cambia el intervalo a febrero y sustituye `IN` por una condición equivalente con `OR` y paréntesis. El resultado debe conservar la misma lógica.

## Práctica guiada 2 — Calcular y clasificar importes

### Situación

Cada operación necesita mostrar subtotal, descuento, total neto y nivel de importe.

```sql
SELECT
    id,
    producto,
    cantidad,
    precio_unitario,
    descuento_porcentaje,
    ROUND(cantidad * precio_unitario, 2) AS subtotal,
    ROUND(
        cantidad * precio_unitario * descuento_porcentaje / 100.0,
        2
    ) AS monto_descuento,
    ROUND(
        cantidad * precio_unitario
        * (1 - descuento_porcentaje / 100.0),
        2
    ) AS total_neto,
    CASE
        WHEN cantidad * precio_unitario
             * (1 - descuento_porcentaje / 100.0) >= 50
            THEN 'Alto'
        WHEN cantidad * precio_unitario
             * (1 - descuento_porcentaje / 100.0) >= 25
            THEN 'Medio'
        ELSE 'Bajo'
    END AS nivel_importe
FROM operaciones_tienda
ORDER BY total_neto DESC, id ASC;
```

### Comprobación manual

Para una operación de dos unidades a 18.90 con 10 % de descuento:

```text
subtotal = 2 × 18.90 = 37.80
descuento = 37.80 × 10 / 100 = 3.78
total neto = 37.80 - 3.78 = 34.02
clasificación = Medio
```

Busca esa operación en el resultado y comprueba los cuatro valores.

## Práctica guiada 3 — Preparar una salida legible

### Situación

Un reporte necesita una identificación compacta, categoría en mayúsculas y una ciudad visible incluso cuando el dato falta.

```sql
SELECT
    codigo_producto || ' - ' || producto AS producto_identificado,
    UPPER(categoria) AS categoria,
    COALESCE(ciudad, 'Ciudad no registrada') AS ciudad,
    REPLACE(canal, 'Telefono', 'Teléfono') AS canal_presentado,
    LENGTH(producto) AS longitud_nombre
FROM operaciones_tienda
ORDER BY categoria, producto_identificado;
```

### Preguntas

1. ¿Cuántas filas muestran `Ciudad no registrada`?
2. ¿`COALESCE` modificó la tabla original?
3. ¿Por qué `REPLACE` es una decisión de presentación y no una corrección permanente?

## Práctica guiada 4 — Construir indicadores

### Situación

La administración solicita un resumen de operaciones confirmadas.

```sql
SELECT
    COUNT(*) AS operaciones_confirmadas,
    SUM(cantidad) AS unidades_confirmadas,
    ROUND(AVG(descuento_porcentaje), 2) AS descuento_promedio,
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada';
```

El resultado contiene una sola fila porque no existe `GROUP BY`.

### Ampliación

Añade:

- El precio unitario mínimo.
- El precio unitario máximo.
- La cantidad de ciudades registradas con `COUNT(ciudad)`.
- La cantidad de ubicaciones ausentes mediante una resta de conteos.

## Práctica guiada 5 — Resumir y filtrar grupos

### Situación

Se necesitan categorías con al menos ocho operaciones confirmadas, incluyendo unidades e ingreso.

```sql
SELECT
    categoria,
    COUNT(*) AS operaciones,
    SUM(cantidad) AS unidades,
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY categoria
HAVING COUNT(*) >= 8
ORDER BY ingreso_neto DESC, categoria ASC;
```

### Transformación

Convierte el reporte para que agrupe por mes en vez de categoría. Utiliza:

```sql
strftime('%Y-%m', fecha)
```

Conserva solamente los meses con 9 o más operaciones confirmadas.

---

# 12. Errores comunes y cómo corregirlos

## Error 1 — Usar `= NULL`

```sql
WHERE ciudad = NULL
```

Corrección:

```sql
WHERE ciudad IS NULL
```

## Error 2 — Olvidar comillas en texto

```sql
WHERE estado = Confirmada
```

Corrección:

```sql
WHERE estado = 'Confirmada'
```

## Error 3 — Mezclar `AND` y `OR` sin expresar la agrupación

```sql
WHERE categoria = 'Hogar'
   OR categoria = 'Papeleria'
  AND estado = 'Confirmada'
```

Corrección si ambas categorías deben estar confirmadas:

```sql
WHERE categoria IN ('Hogar', 'Papeleria')
  AND estado = 'Confirmada'
```

## Error 4 — Confundir `%` con una palabra literal

```sql
WHERE producto LIKE 'USB'
```

La consulta encuentra solamente el texto exacto `USB`. Para encontrar productos que lo contienen:

```sql
WHERE producto LIKE '%USB%'
```

## Error 5 — Confiar en un orden no solicitado

```sql
SELECT id, fecha, producto
FROM operaciones_tienda
LIMIT 5;
```

Si se buscan las cinco más recientes:

```sql
SELECT id, fecha, producto
FROM operaciones_tienda
ORDER BY fecha DESC, id DESC
LIMIT 5;
```

## Error 6 — Sumar precios en lugar de ingresos

```sql
SELECT SUM(precio_unitario)
FROM operaciones_tienda;
```

Esta suma ignora cantidades, descuentos y estados. La fórmula debe corresponder a la definición de ingreso.

## Error 7 — Filtrar un agregado con `WHERE`

```sql
WHERE SUM(cantidad) > 20
```

Si la condición depende del grupo:

```sql
HAVING SUM(cantidad) > 20
```

## Error 8 — Mostrar columnas ambiguas en una agrupación

```sql
SELECT categoria, producto, SUM(cantidad)
FROM operaciones_tienda
GROUP BY categoria;
```

El producto no representa a todo el grupo. Retíralo o agrupa también por producto.

## Error 9 — Utilizar `DISTINCT` para esconder un diseño incorrecto

`DISTINCT` es correcto cuando la pregunta solicita valores o combinaciones únicas. No debe agregarse automáticamente para ocultar filas que no se comprenden.

## Error 10 — Confundir redondeo con precisión almacenada

`ROUND` controla el resultado presentado. No corrige decisiones de diseño sobre dinero ni elimina por sí solo las particularidades de los números decimales en coma flotante.

---

# 13. Buenas prácticas de consultas

1. Escribe una pregunta concreta antes de cada consulta.
2. Selecciona columnas explícitas en resultados finales.
3. Utiliza alias que describan el significado, no solamente la operación.
4. Divide cada cláusula en líneas para facilitar la lectura.
5. Sangra expresiones largas y condiciones relacionadas.
6. Utiliza paréntesis en reglas con `AND` y `OR`.
7. Añade `ORDER BY` cuando el orden tenga significado.
8. Define criterios de desempate para rankings y paginación.
9. Comprueba extremos de `BETWEEN`.
10. Trata `NULL` según su significado, no como una cadena vacía.
11. Filtra filas con `WHERE` antes de agrupar cuando sea posible.
12. Filtra resultados agregados con `HAVING`.
13. Incluye en `GROUP BY` toda columna seleccionada que no esté agregada.
14. Nombra fórmulas comerciales: `subtotal`, `monto_descuento`, `ingreso_neto`.
15. Verifica manualmente al menos un resultado calculado.
16. Documenta cualquier función dependiente de SQLite.
17. No interpretes correlación como una causa. SQL resume datos; no demuestra por qué ocurrió algo.
18. Conserva las consultas en un script reproducible.

---

# 14. Ejercicios individuales

Utiliza la tabla `operaciones_tienda`. Cada solución debe incluir un comentario con la pregunta y una consulta formateada. Antes de consultar las soluciones sugeridas, intenta resolver y comprobar cada ejercicio.

## Nivel 1 — Seleccionar, filtrar y ordenar

### Ejercicio 1 — Catálogo sin repeticiones

La persona encargada del catálogo necesita conocer los productos disponibles en el conjunto de datos. Muestra `codigo_producto`, `producto`, `categoria` y `precio_unitario` sin repetir el mismo producto. Ordena por categoría y luego por producto.

### Ejercicio 2 — Operaciones no concretadas

Muestra `id`, `fecha`, `producto`, `estado` y `canal` de las operaciones pendientes o canceladas. Utiliza `IN` y ordena primero por estado y después por fecha ascendente.

### Ejercicio 3 — Intervalo exacto

Obtén las operaciones registradas entre el 10 y el 20 de febrero de 2026, incluyendo ambos días. Muestra `id`, `fecha`, `producto` y `cantidad`. Ordena cronológicamente.

### Ejercicio 4 — Búsqueda textual

Encuentra los productos cuyo nombre contiene la palabra `escritorio`. Muestra el código, el producto y la categoría. La solución debe utilizar `LIKE`.

### Ejercicio 5 — Ubicación ausente

Muestra `id`, `fecha`, `producto` y `canal` de todas las operaciones cuya ciudad no fue registrada. No utilices una comparación con `=`.

### Ejercicio 6 — Condición combinada

Obtén las operaciones confirmadas de Papelería o Hogar realizadas en Tienda. Muestra `fecha`, `producto`, `categoria`, `cantidad` y `ciudad`. Utiliza paréntesis o `IN` para que la condición no sea ambigua.

### Ejercicio 7 — Ranking estable

Muestra los cinco productos distintos con mayor precio unitario. Si dos productos tienen el mismo precio, ordénalos alfabéticamente. El resultado debe contener `producto` y `precio_unitario`.

### Ejercicio 8 — Segunda página

Ordena todas las operaciones desde la más reciente hasta la más antigua, usando `id` como desempate. Muestra la segunda página si cada página tiene seis filas. Incluye `id`, `fecha`, `producto` y `estado`.

## Nivel 2 — Calcular y transformar

### Ejercicio 9 — Totales por operación

Para operaciones confirmadas, muestra `id`, `producto`, `cantidad`, `precio_unitario`, `descuento_porcentaje`, `subtotal`, `monto_descuento` y `total_neto`. Redondea los tres importes a dos decimales y ordena de mayor a menor total neto.

### Ejercicio 10 — Etiqueta comercial

Clasifica cada operación según su total neto: `Premium` si es al menos 60, `Estándar` si es al menos 25 y `Básica` en cualquier otro caso. Muestra el `id`, producto, total neto y etiqueta. Asegúrate de colocar las condiciones en el orden correcto.

### Ejercicio 11 — Presentación de ubicación

Crea un resultado con una columna `referencia` que una el código y el producto mediante ` - `. Presenta la ciudad en mayúsculas y sustituye los valores `NULL` por `SIN REGISTRO`. No modifiques la tabla.

### Ejercicio 12 — Período mensual

Muestra `id`, `fecha`, `producto`, `anio` y `mes` de cada operación. Obtén el año y el mes con `strftime` y ordena por fecha.

## Nivel 3 — Resumir y analizar

### Ejercicio 13 — Calidad del dato de ciudad

Produce una sola fila con tres indicadores: cantidad total de operaciones, cantidad con ciudad registrada y cantidad sin ciudad registrada. La tercera medida debe calcularse a partir de las dos primeras ideas de conteo.

### Ejercicio 14 — Indicadores de operaciones confirmadas

Calcula para operaciones confirmadas: número de operaciones, unidades vendidas, descuento promedio e ingreso neto. Redondea el promedio y el ingreso a dos decimales.

### Ejercicio 15 — Unidades por producto

Muestra cada producto y el total de unidades presentes en operaciones confirmadas. Ordena desde el mayor total de unidades y, en caso de empate, por nombre del producto.

### Ejercicio 16 — Resumen por método de pago

Para operaciones confirmadas, muestra cada método de pago, número de operaciones, descuento promedio e ingreso neto. Ordena por ingreso neto descendente.

### Ejercicio 17 — Categorías con volumen suficiente

Muestra las categorías que acumulan al menos 25 unidades en operaciones confirmadas. Incluye la categoría, cantidad de operaciones y total de unidades. Utiliza `WHERE`, `GROUP BY` y `HAVING` con propósitos diferentes.

### Ejercicio 18 — Análisis mensual

Agrupa las operaciones confirmadas por período `AAAA-MM`. Muestra el período, cantidad de operaciones, unidades e ingreso neto. Conserva solamente meses con ingreso neto superior a 250. Ordena cronológicamente.

## Nivel 4 — Interpretar y depurar

### Ejercicio 19 — Consulta que responde otra pregunta

Una consulta pretende mostrar el ingreso confirmado, pero contiene:

```sql
SELECT SUM(precio_unitario) AS ingreso
FROM operaciones_tienda;
```

Explica por escrito al menos tres razones por las que el resultado no representa el ingreso confirmado. Después escribe la consulta corregida.

### Ejercicio 20 — Precedencia equivocada

Se necesitan operaciones confirmadas de Tecnología o Accesorios:

```sql
SELECT id, categoria, estado
FROM operaciones_tienda
WHERE categoria = 'Tecnologia'
   OR categoria = 'Accesorios'
  AND estado = 'Confirmada';
```

Predice qué filas incorrectas podrían entrar, explica la causa y corrige la condición de dos maneras: una con paréntesis y otra con `IN`.

### Ejercicio 21 — Agregado en el lugar incorrecto

Corrige la consulta y explica por qué falla:

```sql
SELECT categoria, SUM(cantidad) AS unidades
FROM operaciones_tienda
WHERE SUM(cantidad) >= 20
GROUP BY categoria;
```

### Ejercicio 22 — Columna suelta

La siguiente consulta puede ejecutarse en SQLite, pero su columna `producto` no tiene un significado estable dentro de cada categoría:

```sql
SELECT categoria, producto, SUM(cantidad) AS unidades
FROM operaciones_tienda
GROUP BY categoria;
```

Escribe dos correcciones válidas que respondan preguntas distintas:

1. Total de unidades por categoría.
2. Total de unidades por categoría y producto.

Explica por qué ambas versiones son portables y la consulta original no lo es.

---

# 15. Soluciones sugeridas de los ejercicios

No existe una única forma de formatear una consulta, pero el resultado y la lógica deben coincidir.

## Solución 1

```sql
SELECT DISTINCT
    codigo_producto,
    producto,
    categoria,
    precio_unitario
FROM operaciones_tienda
ORDER BY categoria ASC, producto ASC;
```

## Solución 2

```sql
SELECT id, fecha, producto, estado, canal
FROM operaciones_tienda
WHERE estado IN ('Pendiente', 'Cancelada')
ORDER BY estado ASC, fecha ASC, id ASC;
```

## Solución 3

```sql
SELECT id, fecha, producto, cantidad
FROM operaciones_tienda
WHERE fecha BETWEEN '2026-02-10' AND '2026-02-20'
ORDER BY fecha ASC, id ASC;
```

## Solución 4

```sql
SELECT DISTINCT codigo_producto, producto, categoria
FROM operaciones_tienda
WHERE producto LIKE '%escritorio%'
ORDER BY producto;
```

## Solución 5

```sql
SELECT id, fecha, producto, canal
FROM operaciones_tienda
WHERE ciudad IS NULL
ORDER BY fecha, id;
```

## Solución 6

```sql
SELECT fecha, producto, categoria, cantidad, ciudad
FROM operaciones_tienda
WHERE categoria IN ('Papeleria', 'Hogar')
  AND estado = 'Confirmada'
  AND canal = 'Tienda'
ORDER BY fecha, id;
```

## Solución 7

```sql
SELECT DISTINCT producto, precio_unitario
FROM operaciones_tienda
ORDER BY precio_unitario DESC, producto ASC
LIMIT 5;
```

## Solución 8

```sql
SELECT id, fecha, producto, estado
FROM operaciones_tienda
ORDER BY fecha DESC, id DESC
LIMIT 6 OFFSET 6;
```

## Solución 9

```sql
SELECT
    id,
    producto,
    cantidad,
    precio_unitario,
    descuento_porcentaje,
    ROUND(cantidad * precio_unitario, 2) AS subtotal,
    ROUND(
        cantidad * precio_unitario * descuento_porcentaje / 100.0,
        2
    ) AS monto_descuento,
    ROUND(
        cantidad * precio_unitario
        * (1 - descuento_porcentaje / 100.0),
        2
    ) AS total_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada'
ORDER BY total_neto DESC, id ASC;
```

## Solución 10

```sql
SELECT
    id,
    producto,
    ROUND(
        cantidad * precio_unitario
        * (1 - descuento_porcentaje / 100.0),
        2
    ) AS total_neto,
    CASE
        WHEN cantidad * precio_unitario
             * (1 - descuento_porcentaje / 100.0) >= 60
            THEN 'Premium'
        WHEN cantidad * precio_unitario
             * (1 - descuento_porcentaje / 100.0) >= 25
            THEN 'Estándar'
        ELSE 'Básica'
    END AS etiqueta
FROM operaciones_tienda
ORDER BY total_neto DESC, id;
```

## Solución 11

```sql
SELECT
    codigo_producto || ' - ' || producto AS referencia,
    UPPER(COALESCE(ciudad, 'SIN REGISTRO')) AS ciudad
FROM operaciones_tienda
ORDER BY referencia;
```

## Solución 12

```sql
SELECT
    id,
    fecha,
    producto,
    strftime('%Y', fecha) AS anio,
    strftime('%m', fecha) AS mes
FROM operaciones_tienda
ORDER BY fecha, id;
```

## Solución 13

```sql
SELECT
    COUNT(*) AS total_operaciones,
    COUNT(ciudad) AS con_ciudad,
    COUNT(*) - COUNT(ciudad) AS sin_ciudad
FROM operaciones_tienda;
```

## Solución 14

```sql
SELECT
    COUNT(*) AS operaciones,
    SUM(cantidad) AS unidades,
    ROUND(AVG(descuento_porcentaje), 2) AS descuento_promedio,
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada';
```

## Solución 15

```sql
SELECT
    producto,
    SUM(cantidad) AS unidades_confirmadas
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY producto
ORDER BY unidades_confirmadas DESC, producto ASC;
```

## Solución 16

```sql
SELECT
    metodo_pago,
    COUNT(*) AS operaciones,
    ROUND(AVG(descuento_porcentaje), 2) AS descuento_promedio,
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY metodo_pago
ORDER BY ingreso_neto DESC, metodo_pago;
```

## Solución 17

```sql
SELECT
    categoria,
    COUNT(*) AS operaciones,
    SUM(cantidad) AS unidades
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY categoria
HAVING SUM(cantidad) >= 25
ORDER BY unidades DESC, categoria;
```

## Solución 18

```sql
SELECT
    strftime('%Y-%m', fecha) AS periodo,
    COUNT(*) AS operaciones,
    SUM(cantidad) AS unidades,
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_neto
FROM operaciones_tienda
WHERE estado = 'Confirmada'
GROUP BY strftime('%Y-%m', fecha)
HAVING SUM(
    cantidad * precio_unitario
    * (1 - descuento_porcentaje / 100.0)
) > 250
ORDER BY periodo;
```

## Solución 19

La consulta original:

- Incluye operaciones pendientes y canceladas.
- Ignora la cantidad de unidades.
- Ignora los descuentos.
- Suma precios unitarios que pertenecen a conceptos distintos.

```sql
SELECT
    ROUND(
        SUM(
            cantidad * precio_unitario
            * (1 - descuento_porcentaje / 100.0)
        ),
        2
    ) AS ingreso_confirmado
FROM operaciones_tienda
WHERE estado = 'Confirmada';
```

## Solución 20

Sin paréntesis, `AND` afecta solamente la condición de Accesorios. Podrían entrar operaciones de Tecnología pendientes o canceladas.

```sql
SELECT id, categoria, estado
FROM operaciones_tienda
WHERE (categoria = 'Tecnologia' OR categoria = 'Accesorios')
  AND estado = 'Confirmada';
```

```sql
SELECT id, categoria, estado
FROM operaciones_tienda
WHERE categoria IN ('Tecnologia', 'Accesorios')
  AND estado = 'Confirmada';
```

## Solución 21

```sql
SELECT categoria, SUM(cantidad) AS unidades
FROM operaciones_tienda
GROUP BY categoria
HAVING SUM(cantidad) >= 20
ORDER BY unidades DESC, categoria;
```

`WHERE` se evalúa antes de formar los grupos. `HAVING` puede evaluar la suma producida por cada grupo.

## Solución 22

Total por categoría:

```sql
SELECT categoria, SUM(cantidad) AS unidades
FROM operaciones_tienda
GROUP BY categoria
ORDER BY unidades DESC, categoria;
```

Total por categoría y producto:

```sql
SELECT categoria, producto, SUM(cantidad) AS unidades
FROM operaciones_tienda
GROUP BY categoria, producto
ORDER BY categoria, unidades DESC, producto;
```

En ambas consultas, toda columna no agregada de `SELECT` aparece en `GROUP BY`. Cada fila del resultado tiene un significado definido.

---

# 16. Mini proyecto — Estadísticas de un torneo

## Propósito

Construir un informe de rendimiento a partir de resultados individuales. Practicarás filtros, expresiones, clasificaciones, agregaciones, agrupación y filtrado de grupos antes de iniciar el proyecto obligatorio.

**Tiempo sugerido:** 25 minutos  
**Modalidad:** individual  
**Entrega independiente:** no. Se incorpora al script principal del módulo como evidencia de práctica.

## Situación

Una organización realizó un torneo de juegos de estrategia. Cada fila registra el resultado de una persona en una jornada. La organización necesita un informe breve para reconocer participantes y comparar categorías.

## Base de trabajo

Ejecuta el siguiente bloque en una base nueva:

```sql
DROP TABLE IF EXISTS resultados_torneo;

CREATE TABLE resultados_torneo (
    id INTEGER PRIMARY KEY,
    fecha TEXT NOT NULL,
    jugador TEXT NOT NULL,
    categoria TEXT NOT NULL,
    partidas INTEGER NOT NULL CHECK (partidas > 0),
    puntos INTEGER NOT NULL CHECK (puntos >= 0),
    penalizaciones INTEGER NOT NULL DEFAULT 0
        CHECK (penalizaciones >= 0),
    ciudad TEXT
);

INSERT INTO resultados_torneo (
    id, fecha, jugador, categoria, partidas,
    puntos, penalizaciones, ciudad
) VALUES
    (1,  '2026-05-02', 'Ana Solis',     'Inicial',  4, 31, 0, 'San Jose'),
    (2,  '2026-05-02', 'Bruno Mora',    'Inicial',  4, 24, 2, 'Heredia'),
    (3,  '2026-05-02', 'Carla Rojas',   'Avanzada', 5, 46, 1, 'Cartago'),
    (4,  '2026-05-02', 'Diego Vega',    'Avanzada', 5, 39, 0, NULL),
    (5,  '2026-05-09', 'Elena Castro',  'Inicial',  3, 27, 0, 'Alajuela'),
    (6,  '2026-05-09', 'Fabian Ruiz',   'Avanzada', 4, 35, 3, 'San Jose'),
    (7,  '2026-05-09', 'Gabriela Leon', 'Inicial',  5, 42, 1, 'Heredia'),
    (8,  '2026-05-09', 'Hugo Araya',    'Avanzada', 5, 48, 0, 'Cartago'),
    (9,  '2026-05-16', 'Isabel Soto',   'Inicial',  4, 29, 0, NULL),
    (10, '2026-05-16', 'Javier Campos', 'Avanzada', 4, 33, 1, 'Alajuela'),
    (11, '2026-05-16', 'Karla Jimenez', 'Inicial',  5, 38, 2, 'San Jose'),
    (12, '2026-05-16', 'Luis Mendez',   'Avanzada', 5, 44, 0, 'Heredia');
```

## Fórmula oficial

El puntaje final se calcula así:

```text
puntaje_final = puntos - (penalizaciones × 2)
```

No debes modificar los valores almacenados. La fórmula se calculará en cada consulta.

## Requisitos

Escribe una consulta para cada pregunta:

1. **Participantes:** muestra jugador, categoría y ciudad. Sustituye una ciudad ausente por `Sin registrar` y ordena por categoría y jugador.
2. **Resultados avanzados:** muestra los resultados de categoría Avanzada con puntaje final, ordenados del mayor al menor. Utiliza `id` como último desempate.
3. **Reconocimientos:** clasifica cada resultado como `Oro` si el puntaje final es al menos 42, `Plata` si es al menos 34 y `Participación` en los demás casos.
4. **Sin penalizaciones:** muestra jugador, categoría y puntos de quienes no recibieron penalizaciones.
5. **Podio general:** muestra los tres puntajes finales más altos de todo el torneo.
6. **Indicadores generales:** devuelve una sola fila con cantidad de resultados, puntos brutos, penalizaciones y promedio de puntaje final.
7. **Resumen por categoría:** muestra categoría, participantes, partidas jugadas, puntos brutos y promedio de puntaje final.
8. **Categorías competitivas:** conserva solamente categorías cuyo promedio de puntaje final sea de al menos 34.
9. **Participación por fecha:** muestra fecha, cantidad de participantes y total de partidas. Ordena cronológicamente.
10. **Control de ubicación:** informa cuántos resultados tienen ciudad y cuántos no la tienen.

## Evidencia mínima

- Las diez consultas comentadas.
- Captura del podio general.
- Captura del resumen por categoría.
- Una explicación de dos o tres oraciones sobre la diferencia entre puntos brutos y puntaje final.

## Lista de comprobación

- [ ] La fórmula resta dos puntos por penalización.
- [ ] El podio tiene `ORDER BY` antes de `LIMIT`.
- [ ] La clasificación evalúa primero el umbral más alto.
- [ ] Las columnas no agregadas aparecen en `GROUP BY`.
- [ ] La condición sobre el promedio utiliza `HAVING`.
- [ ] Los valores `NULL` se tratan con `IS NULL`, `COUNT(columna)` o `COALESCE`, según la pregunta.

---

# 17. Proyecto obligatorio del módulo — Análisis de operaciones de una tienda

## Propósito

Construir un reporte SQL reproducible que convierta preguntas comerciales en resultados verificables. Este proyecto demuestra que puedes utilizar consultas para explorar, filtrar, transformar y resumir datos sin depender de consultas ya resueltas.

**Tiempo sugerido:** 80 minutos  
**Modalidad:** individual  
**Aprobación requerida:** sí  
**Condición de avance:** el proyecto y la evaluación práctica deben aprobarse antes de continuar al módulo 5.

## Situación profesional

Una tienda vende artículos de Papelería, Tecnología, Accesorios y Hogar mediante tres canales. La administración posee un extracto de operaciones entre enero y abril de 2026, pero todavía no dispone de un informe que permita interpretar la actividad.

Tu responsabilidad consiste en:

1. Cargar y comprobar el conjunto de datos.
2. Escribir consultas que respondan preguntas concretas.
3. Validar cálculos y filtros.
4. Presentar resultados en un orden útil.
5. Redactar conclusiones basadas exclusivamente en la evidencia.

## Material necesario

Utiliza el archivo incluido con el módulo:

[`datos_tienda_m04.sql`](/downloads/sql-bases-datos/modulo-4/datos_tienda_m04.sql)

El archivo crea `operaciones_tienda`, inserta 48 filas, ejecuta una consulta de control e incluye una sección final para escribir tus consultas.

Haz una copia, renómbrala según el formato de entrega y escribe debajo de la línea indicada. No alteres ni elimines las 48 filas originales.

## Diccionario de datos

| Columna | Significado |
|---|---|
| `id` | Identificador de la operación |
| `fecha` | Fecha ISO de la operación |
| `codigo_producto` | Código comercial del producto |
| `producto` | Nombre del producto |
| `categoria` | Familia comercial |
| `cantidad` | Unidades registradas en la operación |
| `precio_unitario` | Precio por unidad |
| `descuento_porcentaje` | Porcentaje de descuento aplicado |
| `ciudad` | Ubicación reportada; puede ser `NULL` |
| `metodo_pago` | Efectivo, Tarjeta o Transferencia |
| `estado` | Confirmada, Pendiente o Cancelada |
| `canal` | Tienda, Web o Telefono |

## Definiciones obligatorias

Utiliza estas fórmulas en todo el proyecto:

```text
subtotal = cantidad × precio_unitario

monto_descuento = subtotal × descuento_porcentaje / 100

total_neto = subtotal - monto_descuento
```

Una operación genera ingreso solamente si su estado es `Confirmada`. Las operaciones pendientes y canceladas pueden analizarse como actividad, pero no deben sumarse como ingreso confirmado.

## Fase 1 — Comprobar y explorar

### Consulta 1. Integridad de la carga

Devuelve una sola fila con el total de registros, la fecha más antigua, la fecha más reciente, la cantidad de ciudades registradas y la cantidad de ciudades ausentes. La carga correcta debe contener 48 registros y fechas entre enero y abril de 2026.

### Consulta 2. Catálogo único

Muestra cada combinación única de código, producto, categoría y precio unitario. Ordena por categoría y producto. No debe aparecer el mismo producto repetido por cada operación.

### Consulta 3. Combinaciones comerciales

Muestra las combinaciones diferentes de canal y método de pago presentes en los datos. Ordena primero por canal y después por método.

## Fase 2 — Filtrar y localizar operaciones

### Consulta 4. Pendientes de seguimiento

Muestra `id`, fecha, producto, cantidad, ciudad, método de pago y canal de las operaciones pendientes. Presenta la ciudad ausente como `No registrada`. Coloca primero la operación pendiente más antigua.

### Consulta 5. Campaña de marzo

Muestra las operaciones confirmadas de Tecnología o Accesorios realizadas durante marzo de 2026. Incluye `id`, fecha, producto, categoría, cantidad y canal. Ordena por fecha e `id`.

### Consulta 6. Compras presenciales seleccionadas

Muestra operaciones de Papelería o Hogar realizadas por el canal Tienda, siempre que no estén canceladas. La lógica debe utilizar `IN` o paréntesis de forma explícita.

### Consulta 7. Búsqueda de productos

Encuentra operaciones cuyo nombre de producto contenga `escritorio`. Muestra código, producto, categoría, fecha y estado. Ordena por producto y fecha.

### Consulta 8. Control de datos ausentes

Muestra todas las operaciones sin ciudad registrada. Incluye `id`, fecha, producto, estado y canal. Ordena primero las confirmadas, después las pendientes y finalmente las canceladas mediante un `CASE` utilizado como criterio de orden.

## Fase 3 — Ordenar, limitar y calcular

### Consulta 9. Productos de mayor precio

Muestra los cinco productos distintos con mayor precio unitario. Si hay empate, utiliza el nombre del producto en orden alfabético.

### Consulta 10. Actividad reciente

Muestra las diez operaciones más recientes con `id`, fecha, producto, estado y canal. El resultado debe ser estable incluso si dos operaciones comparten fecha.

### Consulta 11. Importe de cada operación confirmada

Muestra `id`, producto, cantidad, precio, descuento, subtotal, monto de descuento y total neto de las operaciones confirmadas. Redondea importes a dos decimales. Ordena del mayor al menor total neto y utiliza `id` para desempatar.

### Consulta 12. Clasificación de importes

Clasifica las operaciones confirmadas como:

- `Alta`: total neto mayor o igual a 60.
- `Media`: total neto mayor o igual a 25 y menor que 60.
- `Baja`: total neto menor que 25.

Muestra el identificador, producto, total neto y clasificación. La regla debe implementarse con `CASE`.

### Consulta 13. Etiqueta para reporte

Crea una columna `referencia_producto` con el código, un separador ` - ` y el nombre. Presenta la categoría en mayúsculas, reemplaza `Telefono` por `Teléfono` en el canal y sustituye una ciudad ausente por `Sin registro`. No modifiques los datos almacenados.

### Consulta 14. Período de cada operación

Muestra el identificador, fecha, producto, año y mes. Obtén año y mes con funciones de fecha de SQLite. Ordena cronológicamente.

## Fase 4 — Construir indicadores y grupos

### Consulta 15. Tablero de operaciones confirmadas

Devuelve una sola fila con cantidad de operaciones confirmadas, unidades confirmadas, ingreso neto confirmado, descuento promedio, menor total neto y mayor total neto. Contrasta el primer conteo con las 48 filas obtenidas en la consulta 1. No utilices subconsultas ni `JOIN`.

### Consulta 16. Rendimiento por categoría

Para cada categoría y considerando solo operaciones confirmadas, muestra cantidad de operaciones, unidades, ingreso neto y total neto promedio por operación. Ordena desde la categoría con mayor ingreso.

### Consulta 17. Demanda por producto

Muestra el total de unidades confirmadas por producto. Incluye producto y categoría. Conserva solamente productos con al menos 10 unidades confirmadas y ordena desde el de mayor cantidad.

### Consulta 18. Métodos de pago

Compara los métodos de pago en operaciones confirmadas. Muestra método, cantidad de operaciones, descuento promedio e ingreso neto. Ordena de mayor a menor ingreso.

### Consulta 19. Comportamiento mensual

Agrupa las operaciones confirmadas por período `AAAA-MM`. Muestra período, operaciones, unidades e ingreso neto. Ordena desde enero hasta abril.

### Consulta 20. Ciudades con actividad suficiente

Considera solamente operaciones confirmadas con ciudad conocida. Muestra las ciudades que poseen al menos cuatro operaciones confirmadas. Incluye ciudad, operaciones, unidades e ingreso neto. Ordena por ingreso descendente y luego por ciudad.

## Fase 5 — Interpretar resultados

Redacta un informe breve. Cada conclusión debe citar la consulta que la respalda.

Responde:

1. ¿Qué categoría generó el mayor ingreso confirmado?
2. ¿Qué producto acumuló más unidades confirmadas?
3. ¿Qué método de pago produjo mayor ingreso confirmado?
4. ¿Qué mes produjo mayor ingreso confirmado?
5. ¿Cuántas operaciones no tienen ciudad y por qué no sería correcto inventar una ubicación?
6. ¿Por qué las operaciones pendientes y canceladas se excluyeron del ingreso?
7. Describe una diferencia entre “mayor cantidad de operaciones” y “mayor ingreso”.
8. Explica una limitación del análisis. Por ejemplo: el conjunto contiene solamente cuatro meses, no incluye costos ni identifica clientes.

No escribas afirmaciones causales como “la categoría vendió más porque los clientes la prefieren” si los datos no demuestran la causa. Puedes describir lo observado y señalar qué información faltaría para investigar el motivo.

## Formato del script

Utiliza comentarios numerados:

```sql
-- ================================================================
-- CONSULTA 01: Integridad de la carga
-- Pregunta: ¿Cuántas filas existen y cuál es el rango de fechas?
-- ================================================================

SELECT ...;
```

Cada consulta debe poder ejecutarse por separado. No dependas de un orden visual accidental ni de una selección manual incompleta.

## Restricciones del proyecto

- No modificar ni eliminar las 48 filas originales.
- No utilizar `UPDATE` ni `DELETE` para “preparar” el análisis.
- No utilizar `JOIN`, subconsultas, CTE, vistas ni funciones de ventana.
- No utilizar `SELECT *` en las veinte consultas finales.
- No utilizar una columna no agregada fuera de `GROUP BY`.
- No contar pendientes o canceladas como ingreso confirmado.
- No presentar un ranking sin `ORDER BY`.
- No reemplazar `NULL` con una suposición que cambie su significado.

## Lista de comprobación antes de entregar

### Datos

- [ ] La consulta de control devuelve 48 filas.
- [ ] La fecha mínima y máxima coinciden con el período indicado.
- [ ] El conjunto original no fue alterado.

### Consultas

- [ ] Existen veinte consultas numeradas.
- [ ] Cada consulta responde una pregunta específica.
- [ ] Se utilizan columnas explícitas.
- [ ] Los alias explican el resultado.
- [ ] `AND` y `OR` no producen ambigüedad.
- [ ] `BETWEEN` incluye los extremos correctos.
- [ ] `IS NULL` se usa para buscar datos ausentes.
- [ ] Rankings y páginas poseen un orden estable.
- [ ] Los cálculos usan la fórmula oficial.
- [ ] Los importes se presentan con dos decimales.
- [ ] `WHERE` filtra filas y `HAVING` filtra grupos.
- [ ] Toda columna no agregada está agrupada.

### Interpretación

- [ ] Las ocho respuestas citan consultas.
- [ ] Las conclusiones coinciden con los resultados.
- [ ] No se inventan causas ni datos.
- [ ] Se reconoce al menos una limitación.

### Reproducibilidad

- [ ] El script se ejecuta desde el principio en una base vacía.
- [ ] Las consultas terminan en punto y coma.
- [ ] El código está comentado y ordenado.
- [ ] Las capturas son legibles.

---

# 18. Rúbrica del proyecto obligatorio

**Puntaje total:** 100 puntos  
**Puntaje mínimo para aprobar:** 70 puntos  
**Condición adicional:** deben cumplirse todos los criterios críticos.

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Selección y filtrado | Todas las preguntas se traducen a filtros precisos; `NULL`, intervalos y lógica combinada se manejan correctamente | Existe uno o dos detalles menores sin cambiar la mayoría de resultados | Varios filtros son incompletos o ambiguos | Las consultas no responden las preguntas | 20 |
| Orden, unicidad y límites | `DISTINCT`, `ORDER BY`, desempates, `LIMIT` y `OFFSET` se utilizan exactamente donde corresponden | Hay un detalle menor de presentación u orden | Algunos rankings o límites no son estables | Se limitan filas sin criterio o faltan resultados esenciales | 15 |
| Expresiones, funciones y `CASE` | Cálculos, redondeo, texto, fecha, `COALESCE` y clasificaciones son correctos y legibles | Existe un error menor de presentación | Varias fórmulas o clasificaciones necesitan corrección | Los cálculos principales son incorrectos | 20 |
| Agregación, `GROUP BY` y `HAVING` | Todos los indicadores y grupos representan correctamente la pregunta; no hay columnas ambiguas | Uno de los resúmenes necesita un ajuste menor | Se confunden filas y grupos en varias consultas | Los agregados no producen análisis válido | 20 |
| Interpretación y validación | Las conclusiones citan evidencia, reconocen límites y no inventan causas | Las conclusiones son correctas pero poco justificadas | Hay afirmaciones vagas o una interpretación incorrecta | El informe contradice los resultados o no existe | 15 |
| Calidad y portabilidad del SQL | Código claro, comentado, explícito y portable dentro del alcance; diferencias de SQLite identificadas | Código comprensible con pequeñas inconsistencias | Código difícil de revisar o dependiente de comportamientos ambiguos | Script desordenado o no reproducible | 5 |
| Entrega y evidencias | Todos los archivos abren, siguen el nombre solicitado y muestran resultados legibles | Falta un detalle menor | Faltan varias evidencias | La entrega no puede revisarse | 5 |
| **Total** |  |  |  |  | **100** |

## Criterios críticos

El proyecto requiere corrección antes de aprobarse si ocurre cualquiera de estas situaciones:

- El script no crea y carga la tabla en una base vacía.
- El conjunto original fue modificado o contiene una cantidad diferente de filas.
- Faltan cinco o más consultas obligatorias.
- Los ingresos incluyen operaciones pendientes o canceladas.
- La fórmula de total neto es incorrecta en varias consultas.
- Se confunden repetidamente `WHERE` y `HAVING`.
- Se utilizan columnas sueltas en consultas agrupadas y el resultado es ambiguo.
- Se utilizan temas fuera del alcance para evitar resolver la lógica solicitada.
- Las conclusiones no corresponden a los resultados.
- La entrega no permite ejecutar o comprobar el trabajo.

## Interpretación del resultado

| Puntaje | Resultado |
|---:|---|
| 90–100 | Dominio sólido del módulo |
| 80–89 | Buen desempeño con mejoras menores |
| 70–79 | Aprobado; conviene reforzar los criterios señalados |
| 0–69 | Requiere corrección y nueva entrega |

Una calificación de 70 o más no elimina un criterio crítico. Si existe uno, debe corregirse antes de continuar.

---

# 19. Evaluación práctica del módulo

## Instrucciones

Esta evaluación utiliza un conjunto pequeño que no aparece en los ejercicios. Debes construir, predecir y corregir consultas. Ejecuta primero el bloque de preparación.

**Tiempo sugerido:** 15 minutos  
**Puntaje total:** 20 puntos  
**Puntaje mínimo:** 14 puntos

```sql
DROP TABLE IF EXISTS envios_evaluacion;

CREATE TABLE envios_evaluacion (
    id INTEGER PRIMARY KEY,
    fecha TEXT NOT NULL,
    ruta TEXT NOT NULL,
    paquetes INTEGER NOT NULL CHECK (paquetes > 0),
    costo_unitario REAL NOT NULL CHECK (costo_unitario > 0),
    estado TEXT NOT NULL
        CHECK (estado IN ('Entregado', 'En ruta', 'Cancelado')),
    observacion TEXT
);

INSERT INTO envios_evaluacion (
    id, fecha, ruta, paquetes, costo_unitario, estado, observacion
) VALUES
    (1, '2026-06-01', 'Norte',  8, 2.50, 'Entregado', NULL),
    (2, '2026-06-01', 'Sur',    4, 3.10, 'En ruta', 'Lluvia'),
    (3, '2026-06-02', 'Norte',  6, 2.50, 'Entregado', NULL),
    (4, '2026-06-02', 'Este',  10, 2.80, 'Entregado', 'Prioritario'),
    (5, '2026-06-03', 'Oeste',  3, 3.40, 'Cancelado', 'Dirección incorrecta'),
    (6, '2026-06-03', 'Sur',    7, 3.10, 'Entregado', NULL),
    (7, '2026-06-04', 'Este',   5, 2.80, 'En ruta', NULL),
    (8, '2026-06-04', 'Norte',  9, 2.50, 'Entregado', 'Recibido'),
    (9, '2026-06-05', 'Oeste',  6, 3.40, 'Entregado', NULL),
    (10,'2026-06-05', 'Sur',   11, 3.10, 'Entregado', 'Prioritario');
```

## Parte A — Construir consultas: 12 puntos

### 1. Seguimiento — 2 puntos

Muestra `id`, fecha, ruta, paquetes y observación de envíos `En ruta`. Si la observación es `NULL`, presenta `Sin observación`. Ordena por fecha e identificador.

### 2. Costo total — 2 puntos

Muestra los envíos entregados con una columna `costo_total`, calculada como paquetes por costo unitario y redondeada a dos decimales. Ordena del costo mayor al menor.

### 3. Resumen por ruta — 4 puntos

Para envíos entregados, muestra ruta, cantidad de envíos, paquetes y costo total acumulado. Conserva únicamente rutas con al menos dos envíos entregados. Ordena por paquetes descendentes.

### 4. Nivel de carga — 2 puntos

Clasifica cada envío como `Carga alta` si transporta al menos 9 paquetes, `Carga media` si transporta al menos 5 y `Carga baja` en los demás casos.

### 5. Fechas de actividad — 2 puntos

Muestra las fechas diferentes que aparecen en la tabla, sin repeticiones y en orden cronológico.

## Parte B — Predecir y explicar: 3 puntos

Sin ejecutar primero, indica cuántas filas esperas en cada resultado. Después ejecútalas y explica cualquier diferencia:

```sql
SELECT COUNT(*)
FROM envios_evaluacion
WHERE observacion IS NULL;
```

```sql
SELECT ruta, COUNT(*)
FROM envios_evaluacion
WHERE estado = 'Entregado'
GROUP BY ruta;
```

```sql
SELECT id, paquetes
FROM envios_evaluacion
ORDER BY paquetes DESC, id ASC
LIMIT 3;
```

## Parte C — Corregir: 5 puntos

### Error 1 — 2 puntos

La intención es buscar registros sin observación:

```sql
SELECT id, ruta
FROM envios_evaluacion
WHERE observacion = NULL;
```

Explica y corrige.

### Error 2 — 3 puntos

La intención es mostrar rutas con al menos 15 paquetes entregados:

```sql
SELECT ruta, SUM(paquetes) AS total_paquetes
FROM envios_evaluacion
WHERE estado = 'Entregado'
  AND SUM(paquetes) >= 15
GROUP BY ruta;
```

Explica por qué cada filtro pertenece a una etapa diferente y escribe la versión correcta.

## Criterios de aprobación de la evaluación

- Las consultas deben ejecutarse sin errores.
- La fórmula de costo debe ser correcta.
- La consulta agrupada debe usar `WHERE` para las filas y `HAVING` para el grupo.
- Las predicciones deben incluir una explicación, no únicamente números corregidos después de ejecutar.
- Las dos consultas defectuosas deben quedar reparadas.

---

# 20. Punto de entrega del módulo

Utiliza **un solo punto de entrega** para el proyecto, la evaluación y las evidencias del módulo. No envíes un formulario por cada ejercicio.

## Nombre del archivo comprimido

```text
COA_SQL_M04_Apellido_Nombre.zip
```

Ejemplo:

```text
COA_SQL_M04_Cerna_Victor.zip
```

## Estructura de la entrega

```text
COA_SQL_M04_Apellido_Nombre/
├── COA_SQL_M04_Apellido_Nombre.sql
├── COA_SQL_M04_Apellido_Nombre.db
├── informe_analisis.pdf
└── evidencias/
    ├── 01_carga.png
    ├── 02_filtro.png
    ├── 03_calculo.png
    ├── 04_agrupacion.png
    ├── 05_having.png
    └── 06_evaluacion.png
```

## Contenido de cada archivo

### Script SQL

El archivo `COA_SQL_M04_Apellido_Nombre.sql` debe contener, en este orden:

1. El bloque original de creación y carga de `operaciones_tienda`.
2. Las veinte consultas del proyecto, numeradas y comentadas.
3. El bloque de creación y carga de `resultados_torneo`.
4. Las diez consultas del mini proyecto.
5. El bloque de creación y carga de `envios_evaluacion`.
6. Las respuestas SQL de la evaluación práctica.
7. Comentarios breves con las explicaciones de predicción y depuración.

De esta forma, una persona podrá ejecutar un único archivo desde el principio y reconstruir las tres tablas utilizadas en el módulo.

### Base de datos

La base `.db` debe contener:

- `operaciones_tienda` con 48 registros.
- `resultados_torneo` con 12 registros.
- `envios_evaluacion` con 10 registros.

No es necesario guardar resultados de consultas como tablas nuevas.

### Informe

El PDF debe incluir:

- Nombre completo.
- Nombre del curso y módulo.
- Las ocho respuestas de interpretación del proyecto.
- Una explicación de una consulta con `WHERE` y `HAVING`.
- Una comprobación manual de un total neto.
- El resultado obtenido en la evaluación.
- Una reflexión final de cinco a ocho líneas: qué pregunta fue más difícil de convertir a SQL y cómo la resolviste.

No es necesario diseñar un documento complejo. El objetivo es que la explicación sea clara y legible.

### Evidencias

Las capturas deben mostrar:

1. La carga de 48 registros.
2. Una consulta con condiciones combinadas.
3. Una consulta con importes calculados y `CASE`.
4. Un resumen con funciones de agregación y `GROUP BY`.
5. Un filtro de grupos con `HAVING`.
6. Una consulta completa de la evaluación.

Cada captura debe mostrar la consulta ejecutada y su resultado. No incluyas información personal ajena al curso ni captures toda la pantalla si el texto queda ilegible.

## Texto para el formulario de entrega

En el campo de descripción puedes escribir:

```text
Curso: SQL y Bases de Datos Relacionales
Módulo: 4 - Consultas, funciones y análisis de información
Nombre completo: [tu nombre]
Archivo: COA_SQL_M04_Apellido_Nombre.zip
Confirmo que el script se ejecuta desde el inicio en una base vacía: Sí
```

Si la plataforma solicita un enlace en lugar de un archivo, comparte una carpeta con permiso de lectura y verifica el acceso desde una ventana privada antes de enviarla.

## Después de enviar

El proyecto será revisado con la rúbrica. Si recibes correcciones:

1. Lee cada observación.
2. Corrige el script y vuelve a ejecutarlo desde el inicio.
3. Actualiza las capturas afectadas.
4. Añade al informe una sección breve llamada `Correcciones realizadas`.
5. Envía nuevamente el archivo con el mismo nombre.

No continúes al módulo 5 hasta que el proyecto y la evaluación aparezcan como aprobados.

[Entregar el Módulo 4](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 21. Retos adicionales

Estos retos son opcionales. Utilizan solamente contenidos del módulo.

## Reto 1 — Primera página y segunda página

Crea dos consultas para mostrar operaciones confirmadas en páginas de ocho filas, ordenadas por fecha e `id` descendentes. Comprueba que ningún identificador aparezca en ambas páginas.

## Reto 2 — Matriz de actividad

Agrupa por categoría y canal. Muestra operaciones, unidades e ingreso confirmado para cada combinación. Ordena por categoría y luego por ingreso descendente.

## Reto 3 — Descuento significativo

Muestra los productos cuyo descuento promedio en operaciones confirmadas sea de al menos 8 %. Incluye producto, cantidad de operaciones y promedio. Explica por qué la condición pertenece a `HAVING`.

## Reto 4 — Datos completos por ciudad

Calcula, en una sola fila, el porcentaje de operaciones que tienen ciudad registrada:

```text
porcentaje = COUNT(ciudad) × 100.0 / COUNT(*)
```

Redondea a dos decimales. Explica por qué se utiliza `100.0`.

## Reto 5 — Semáforo mensual

Agrupa operaciones confirmadas por mes y clasifica el ingreso mensual:

- `Alto` si alcanza 400.
- `Medio` si alcanza 300.
- `Bajo` en los demás casos.

Puedes repetir la expresión agregada dentro del `CASE`. No utilices subconsultas.

## Reto 6 — Auditoría de filtros

Escribe dos consultas:

1. Operaciones de Tecnología o Accesorios que estén confirmadas.
2. Operaciones de Tecnología, o bien operaciones de Accesorios que estén confirmadas.

Utiliza paréntesis para expresar las dos reglas diferentes. Compara el número de filas y explica por qué cambia.

---

# 22. Videos recomendados

Los videos se utilizan en momentos concretos. No es necesario verlos todos antes de practicar.

## Video 1 — Filtros con `WHERE`, `BETWEEN`, `IN` y `LIKE`

[Curso de SQL con MySQL, parte 4: filtros en SQL con `WHERE`, `BETWEEN`, `IN` y `LIKE` — NgTutos 4U](https://www.youtube.com/watch?v=vJKP9kw_KHw)

**Tema exacto:** construcción de condiciones y filtros frecuentes.  
**Momento recomendado:** después de la sección 3.  
**Objetivo:** comparar distintas formas de localizar filas.  
**Nota de portabilidad:** el video utiliza MySQL, pero los filtros estudiados se aplican de la misma forma en las consultas básicas de SQLite.

## Video 2 — Funciones de agregación

[Funciones de agregación en SQL: `SUM`, `AVG`, `COUNT` y más — Data fácil](https://www.youtube.com/watch?v=ZrYr78blpy8)

**Tema exacto:** resumen de conjuntos de filas con funciones agregadas.  
**Momento recomendado:** antes de la práctica guiada 4.  
**Objetivo:** reforzar qué pregunta responde cada función.

## Video 3 — `GROUP BY` y `HAVING`

[`GROUP BY` y `HAVING` en SQL — Rocío Chávez Ciencia de Datos](https://www.youtube.com/watch?v=TZ3G8nZYwfc)

**Tema exacto:** formación de grupos y condiciones sobre resultados agregados.  
**Momento recomendado:** antes de la práctica guiada 5.  
**Objetivo:** diferenciar filtros de filas y filtros de grupos.

Al observar ejemplos con otro motor, identifica dos capas:

```text
Concepto transferible: filtrar, agrupar, sumar, ordenar
Sintaxis del motor: funciones de fecha, concatenación, límites
```

No copies una función específica sin comprobar si existe en SQLite.

---

# 23. Documentación y recursos gratuitos

La documentación oficial de SQLite está en inglés. Puedes utilizar la traducción del navegador, pero conserva los nombres SQL originales para buscar términos con precisión.

## Lectura esencial

- [`SELECT` — documentación oficial de SQLite](https://sqlite.org/lang_select.html)  
  Revisa la estructura general, `WHERE`, `GROUP BY`, `HAVING`, `DISTINCT`, `ORDER BY` y `LIMIT`.

- [Expresiones SQL — documentación oficial de SQLite](https://sqlite.org/lang_expr.html)  
  Consulta operadores de comparación, operadores lógicos, `BETWEEN`, `IN`, `LIKE`, `CASE` e `IS NULL`.

- [Funciones integradas principales — documentación oficial de SQLite](https://sqlite.org/lang_corefunc.html)  
  Busca `abs`, `coalesce`, `length`, `lower`, `replace`, `round`, `trim` y `upper`.

- [Funciones de agregación — documentación oficial de SQLite](https://sqlite.org/lang_aggfunc.html)  
  Compara `avg`, `count`, `max`, `min` y `sum`.

- [Funciones de fecha y hora — documentación oficial de SQLite](https://sqlite.org/lang_datefunc.html)  
  Concéntrate en `date`, `strftime` y `julianday`.

## Cómo leer una página técnica

No intentes memorizarla completa. Utiliza este proceso:

1. Busca el nombre exacto de la cláusula o función.
2. Lee su propósito en una frase.
3. Identifica los argumentos.
4. Observa uno o dos ejemplos.
5. Prueba una variante pequeña en DB Browser.
6. Comprueba qué ocurre con `NULL`.
7. Anota si la sintaxis es propia de SQLite.

## Consultas rápidas en la documentación

| Necesidad | Página | Término que debes buscar |
|---|---|---|
| Saber si `BETWEEN` incluye extremos | Expresiones | `BETWEEN` |
| Comprender `COUNT(X)` | Agregación | `count(X)` |
| Sustituir `NULL` en una salida | Funciones principales | `coalesce` |
| Extraer el mes | Fecha y hora | `strftime` y `%m` |
| Revisar columnas sueltas al agrupar | `SELECT` | `bare columns` |
| Limitar resultados | `SELECT` | `LIMIT` |

---

# 24. Material complementario

Este módulo requiere solamente un archivo descargable:

## Conjunto de datos del proyecto

[`Descargar datos_tienda_m04.sql`](/downloads/sql-bases-datos/modulo-4/datos_tienda_m04.sql)

El archivo evita dedicar tiempo a escribir 48 inserciones y permite que todas las consultas partan del mismo conjunto verificable.

No necesitas una plantilla adicional para el informe. Puedes utilizar cualquier procesador de texto y exportar un PDF sencillo. Las listas de comprobación, el diccionario de datos, las fórmulas y la rúbrica ya están incluidos en este módulo.

---

# 25. Glosario

| Término | Definición |
|---|---|
| Agregación | Operación que resume varias filas en un valor, como una suma o un promedio |
| Alias | Nombre temporal asignado a una columna o expresión del resultado |
| `AND` | Operador lógico que exige que todas las condiciones sean verdaderas |
| `ASC` | Orden ascendente |
| `AVG` | Función que calcula el promedio de valores no nulos |
| Columna calculada | Valor producido por una expresión en la consulta sin almacenarse en la tabla |
| `CASE` | Expresión condicional que devuelve un resultado según reglas ordenadas |
| `COALESCE` | Función que devuelve el primer argumento no nulo |
| `COUNT(*)` | Conteo de filas, incluso cuando algunas columnas contienen `NULL` |
| `COUNT(columna)` | Conteo de valores no nulos de una columna |
| `DESC` | Orden descendente |
| `DISTINCT` | Eliminación de combinaciones repetidas en el resultado |
| Expresión | Combinación de valores, columnas, operadores o funciones que produce un valor |
| Filtro | Condición que decide qué filas o grupos permanecen |
| Función escalar | Función que produce un valor por cada fila, como `UPPER` o `ROUND` |
| Función de agregación | Función que resume un conjunto, como `SUM` o `AVG` |
| Granularidad | Nivel de detalle representado por cada fila del resultado |
| Grupo | Conjunto de filas que comparten los valores indicados en `GROUP BY` |
| `GROUP BY` | Cláusula que forma grupos para calcular resúmenes independientes |
| `HAVING` | Cláusula que filtra grupos después de la agregación |
| `IN` | Operador que comprueba pertenencia a una lista de valores |
| `IS NULL` | Condición que comprueba ausencia de valor |
| `LIKE` | Operador de búsqueda por patrones de texto |
| `LIMIT` | Cláusula que restringe la cantidad de filas devueltas en SQLite |
| `MAX` | Función que obtiene el valor máximo |
| `MIN` | Función que obtiene el valor mínimo |
| `NULL` | Ausencia de un valor conocido |
| `OFFSET` | Cantidad de filas que se omiten antes de devolver resultados limitados |
| `OR` | Operador lógico que exige que al menos una condición sea verdadera |
| Orden estable | Orden definido con suficientes criterios para resolver empates |
| `ORDER BY` | Cláusula que ordena el resultado |
| Portabilidad | Facilidad para adaptar una consulta a distintos motores de bases de datos |
| Predicado | Expresión que puede evaluarse como verdadera, falsa o desconocida |
| `ROUND` | Función que redondea un número para una cantidad de decimales |
| `SELECT` | Instrucción utilizada para consultar datos |
| `strftime` | Función de SQLite que formatea o extrae partes de fechas y horas |
| `SUM` | Función que suma valores no nulos |
| `WHERE` | Cláusula que filtra filas antes de la agrupación |

---

# 26. Resumen final

En este módulo aprendiste a convertir preguntas en consultas SQL.

El recorrido principal fue:

```text
Seleccionar columnas
        ↓
Filtrar filas
        ↓
Ordenar y limitar
        ↓
Calcular y presentar
        ↓
Resumir
        ↓
Agrupar
        ↓
Filtrar grupos
        ↓
Interpretar resultados
```

Ahora puedes:

- Elegir columnas explícitas y asignar alias.
- Obtener combinaciones únicas con `DISTINCT`.
- Construir filtros con comparaciones y lógica booleana.
- Utilizar `IN`, `BETWEEN`, `LIKE` e `IS NULL`.
- Ordenar con criterios de desempate.
- Limitar resultados con una intención definida.
- Crear subtotales, descuentos y totales netos.
- Clasificar filas con `CASE`.
- Presentar textos, valores ausentes y fechas.
- Calcular conteos, sumas, promedios, mínimos y máximos.
- Resumir por categorías, productos, meses y otros grupos.
- Aplicar `WHERE` antes de agrupar y `HAVING` después.
- Evitar columnas ambiguas en consultas agrupadas.
- Validar una consulta en lugar de confiar solamente en que se ejecutó.
- Escribir conclusiones limitadas por la evidencia disponible.

## Habilidades obtenidas

Al aprobar el módulo habrás demostrado que puedes:

- Traducir una necesidad comercial a una consulta verificable.
- Elegir entre filtros, expresiones, agregaciones y agrupaciones según la pregunta.
- Construir reportes ordenados y reproducibles sobre una tabla.
- Detectar resultados incorrectos aunque la consulta no muestre errores de sintaxis.
- Explicar cálculos y conclusiones a una persona que no escribió el SQL.
- Reconocer qué funciones pertenecen a SQLite y buscar equivalentes en otro motor.
- Preparar un script de análisis con calidad suficiente para revisión técnica.

## La idea que debes conservar

```text
SELECT no consiste en pedir datos al azar.

Consiste en definir con precisión:
qué observar,
qué excluir,
qué calcular,
cómo resumir
y cómo comprobar.
```

## Antes de continuar

Debes poder responder sin consultar apuntes:

1. ¿Por qué no existe un orden garantizado sin `ORDER BY`?
2. ¿Cuál es la diferencia entre `COUNT(*)` y `COUNT(columna)`?
3. ¿Por qué `BETWEEN` requiere atención en los extremos?
4. ¿Cómo se busca un valor ausente?
5. ¿Qué diferencia existe entre `WHERE` y `HAVING`?
6. ¿Qué columnas deben aparecer en `GROUP BY`?
7. ¿Por qué una consulta que se ejecuta puede responder una pregunta equivocada?
8. ¿Qué parte de las funciones de fecha puede cambiar al utilizar otro motor?

Si todavía confundes filtros de filas con filtros de grupos, vuelve a la sección 9 y repite la práctica guiada 5. Esa distinción será indispensable cuando varias tablas participen en una misma consulta.

Completa el mini proyecto, aprueba la evaluación práctica y entrega el proyecto obligatorio. Continúa solamente cuando recibas la aprobación del módulo.
