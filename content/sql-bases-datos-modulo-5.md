# COA — Cursos Online Avanzados

## SQL y Bases de Datos Relacionales

# Módulo 5. Consultas multitabla y resolución avanzada con SQL

**Duración estimada:** 4 horas y 30 minutos  
**Nivel:** intermedio  
**Modalidad:** autodidacta y práctica  
**Motor de base de datos:** SQLite  
**Herramienta principal:** DB Browser for SQLite  
**Resultado principal:** un sistema reproducible de reportes académicos que combina seis tablas relacionadas

---

## Bienvenida

Una base relacional evita repetir información. El nombre de una carrera se guarda una vez, el curso se describe una vez y cada matrícula conecta a un estudiante con un curso.

Esa organización protege los datos, pero crea una necesidad: para responder preguntas reales debes volver a reunir las piezas correctas.

```text
¿Qué estudiante cursa qué materia, con cuál docente y qué nota obtuvo?

estudiantes → matriculas → cursos → docentes
                    ↓
             calificaciones
```

En este módulo aprenderás a recorrer relaciones, conservar registros sin coincidencia, detectar multiplicaciones inesperadas y dividir consultas complejas en etapas comprensibles.

También aprenderás que `JOIN`, una subconsulta y una CTE no son premios por escribir SQL “avanzado”. Son herramientas diferentes. La mejor elección es la que expresa con claridad la pregunta y produce un resultado comprobable.

> **Principio del módulo:** antes de unir tablas, dibuja el camino entre sus claves y predice qué representa cada fila del resultado.

---

## Conocimientos previos

Debes haber aprobado los módulos 1 a 4. Necesitarás poder:

- Reconocer claves primarias y foráneas.
- Interpretar relaciones uno a muchos y muchos a muchos.
- Seleccionar, filtrar y ordenar filas.
- Utilizar `NULL` correctamente.
- Crear expresiones y clasificaciones con `CASE`.
- Aplicar funciones de agregación.
- Diferenciar `WHERE` de `HAVING`.
- Leer un diagrama relacional sencillo.

No se estudiarán índices, planes de ejecución, vistas ni optimización avanzada. Esos temas pertenecen al módulo 6.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Trazar el recorrido de claves necesario para responder una pregunta.
- Predecir la granularidad y una cantidad razonable de filas.
- Explicar y evitar un producto cartesiano accidental.
- Combinar coincidencias mediante `INNER JOIN`.
- Conservar filas sin coincidencia mediante `LEFT JOIN`.
- Utilizar `CROSS JOIN` solamente cuando todas las combinaciones sean intencionales.
- Comprender `RIGHT JOIN` y `FULL OUTER JOIN` y reconocer diferencias entre motores.
- Resolver nombres de columnas mediante alias de tablas.
- Unir tres o más tablas de forma legible.
- Recorrer una relación muchos a muchos mediante su tabla intermedia.
- Relacionar una tabla consigo misma mediante una autounión.
- Distinguir filtros colocados en `ON` de filtros colocados en `WHERE`.
- Escribir subconsultas escalares, de lista y correlacionadas.
- Utilizar `IN`, `EXISTS` y `NOT EXISTS` con seguridad.
- Evitar el problema de `NOT IN` cuando una subconsulta contiene `NULL`.
- Organizar consultas mediante CTE ordinarias con `WITH`.
- Combinar resultados compatibles con `UNION` y `UNION ALL`.
- Elegir entre unión, subconsulta y CTE según la necesidad.
- Detectar duplicados causados por una cardinalidad mal comprendida.
- Comprobar que una consulta conserva exactamente las entidades solicitadas.

---

## Producto que construirás

El proyecto obligatorio será un sistema de reportes universitarios:

```text
carreras 1 ─────< estudiantes 1 ─────< matriculas >───── 1 cursos
                                      │                     │
                                      │                     └──── 0..1 docentes
                                      │                                │
                                      └──── 0..1 calificaciones        └── supervisor
```

Construirás reportes sobre:

- Estudiantes y carreras.
- Cursos y docentes.
- Matrículas y calificaciones.
- Entidades que todavía no tienen registros relacionados.
- Relaciones muchos a muchos.
- Promedios generales y por curso.
- Personas por encima del promedio.
- Existencia y ausencia de matrículas.
- Directorios combinados.
- Resultados organizados por etapas mediante CTE.

---

## Ruta de trabajo y distribución del tiempo

| Actividad | Tiempo aproximado |
|---|---:|
| Explicaciones y demostraciones | 55 minutos |
| Prácticas guiadas | 55 minutos |
| Ejercicios individuales, análisis y depuración | 40 minutos |
| Mini proyecto: festival y entradas | 25 minutos |
| Proyecto del módulo: reportes universitarios | 80 minutos |
| Evaluación y preparación de la entrega | 15 minutos |
| **Total** | **4 horas y 30 minutos** |

Los ejercicios adicionales de profundización son opcionales. Prioriza las prácticas guiadas, el mini proyecto, las actividades marcadas como esenciales y el proyecto obligatorio.

---

# 1. Pensar en caminos, no en tablas aisladas

## 1.1 La pregunta define el recorrido

Pregunta:

> ¿En qué carrera está inscrita cada persona estudiante?

Camino:

```text
estudiantes.carrera_id → carreras.id
```

Pregunta:

> ¿Qué cursos matriculó cada estudiante?

Camino:

```text
estudiantes.id
    ↓ matriculas.estudiante_id
matriculas.curso_id
    ↓ cursos.id
cursos
```

La tabla intermedia no es un obstáculo. Representa el hecho real de que muchos estudiantes pueden matricular muchos cursos.

## 1.2 Mapa de consulta

Antes de escribir SQL, completa:

| Decisión | Pregunta |
|---|---|
| Entidad inicial | ¿Qué debe conservarse aunque no tenga coincidencias? |
| Destino | ¿Qué información debe añadirse? |
| Camino | ¿Qué claves conectan las tablas? |
| Cardinalidad | ¿Una fila puede encontrar cero, una o muchas coincidencias? |
| Granularidad | ¿Qué representará cada fila final? |
| Filtros | ¿Afectan coincidencias o eliminan filas completas? |

## 1.3 La granularidad evita falsas sorpresas

Si un estudiante posee tres matrículas, una unión con `matriculas` producirá tres filas para esa persona. Eso no es necesariamente un duplicado incorrecto: cada fila representa una matrícula distinta.

```text
Antes: una fila por estudiante
Después: una fila por matrícula
```

Solo puedes decidir si una repetición es incorrecta después de definir qué representa cada fila.

---

# 2. Producto cartesiano: todas las combinaciones

Si una tabla contiene 4 estudiantes y otra 3 cursos, combinarlas sin condición produce:

```text
4 × 3 = 12 combinaciones
```

Consulta peligrosa:

```sql
SELECT e.nombre, c.nombre
FROM estudiantes AS e, cursos AS c;
```

También es accidental omitir `ON`:

```sql
SELECT e.nombre, c.nombre
FROM estudiantes AS e
JOIN cursos AS c;
```

Una clave foránea no hace que SQLite adivine la unión. Debes expresarla.

## 2.1 Cómo detectar el problema

- La cantidad de filas crece de forma desproporcionada.
- Aparecen combinaciones imposibles.
- Un total se multiplica.
- Cada elemento de una tabla aparece con todos los de la otra.

## 2.2 `CROSS JOIN` intencional

`CROSS JOIN` expresa que sí deseas todas las combinaciones:

```sql
SELECT t.nombre AS turno, a.nombre AS aula
FROM turnos AS t
CROSS JOIN aulas AS a;
```

Puede servir para crear una matriz de turnos y aulas, tallas y colores, o escenarios que después se evaluarán. Si no puedes explicar por qué necesitas `N × M` filas, probablemente no necesitas un `CROSS JOIN`.

---

# 3. `INNER JOIN`: conservar coincidencias

## 3.1 Sintaxis esencial

```sql
SELECT
    e.carnet,
    e.nombre AS estudiante,
    c.nombre AS carrera
FROM estudiantes AS e
INNER JOIN carreras AS c
    ON c.id = e.carrera_id
ORDER BY e.nombre;
```

`INNER JOIN` conserva filas que cumplen la condición de `ON` en ambos lados.

```text
estudiantes       coincidencia       carreras
     A  ───────── carrera_id = id ───── X
     B  ───────── carrera_id = id ───── Y
```

Si no existe coincidencia, la fila no aparece. Una clave foránea obligatoria normalmente garantiza coincidencia, pero la técnica también se utiliza cuando la relación es opcional.

## 3.2 `JOIN` equivale a `INNER JOIN`

En este contexto:

```sql
FROM estudiantes AS e
JOIN carreras AS c ON c.id = e.carrera_id
```

equivale a escribir `INNER JOIN`. Utilizar la palabra `INNER` puede ser útil al comenzar porque hace explícita la intención.

## 3.3 `ON` expresa la relación

Regla correcta:

```sql
ON c.id = e.carrera_id
```

Error común:

```sql
ON c.id = e.id
```

Que dos columnas compartan valores numéricos no significa que estén relacionadas. Sigue la clave foránea, no la coincidencia visual.

---

# 4. Alias de tablas y columnas ambiguas

Varias tablas contienen una columna `id` o `nombre`. Esta consulta es ambigua:

```sql
SELECT id, nombre
FROM estudiantes
JOIN carreras ON carreras.id = estudiantes.carrera_id;
```

Utiliza alias breves y consistentes:

```sql
SELECT
    e.id AS estudiante_id,
    e.nombre AS estudiante,
    c.nombre AS carrera
FROM estudiantes AS e
INNER JOIN carreras AS c
    ON c.id = e.carrera_id;
```

Un buen alias recuerda la tabla:

| Tabla | Alias sugerido |
|---|---|
| `estudiantes` | `e` |
| `carreras` | `ca` |
| `cursos` | `cu` |
| `docentes` | `d` |
| `matriculas` | `m` |
| `calificaciones` | `cl` |

No uses letras que cambien de significado dentro del mismo script.

---

# 5. `LEFT JOIN`: conservar el lado izquierdo

## 5.1 La pregunta decide la izquierda

Pregunta:

> Mostrar todos los cursos, aunque todavía no tengan docente.

```sql
SELECT
    cu.codigo,
    cu.nombre AS curso,
    COALESCE(d.nombre, 'Sin asignar') AS docente
FROM cursos AS cu
LEFT JOIN docentes AS d
    ON d.id = cu.docente_id
ORDER BY cu.codigo;
```

Todos los cursos se conservan porque están a la izquierda. Cuando no hay docente, las columnas de `d` contienen `NULL`.

```text
cursos (se conservan todos)
    ├── coincide con docente → datos del docente
    └── no coincide          → NULL en columnas del docente
```

## 5.2 Encontrar elementos sin relación

Cursos sin matrícula:

```sql
SELECT cu.codigo, cu.nombre
FROM cursos AS cu
LEFT JOIN matriculas AS m
    ON m.curso_id = cu.id
WHERE m.id IS NULL;
```

Este patrón significa:

1. Conserva todos los cursos.
2. Intenta encontrar matrículas.
3. Quédate con aquellos donde la tabla derecha no produjo una fila.

## 5.3 Contar correctamente después de un `LEFT JOIN`

```sql
SELECT
    cu.codigo,
    cu.nombre,
    COUNT(m.id) AS matriculas
FROM cursos AS cu
LEFT JOIN matriculas AS m
    ON m.curso_id = cu.id
GROUP BY cu.id, cu.codigo, cu.nombre;
```

Utiliza `COUNT(m.id)`, no `COUNT(*)`. Un curso sin matrícula todavía produce una fila extendida con valores `NULL`; `COUNT(*)` la contaría como uno. `COUNT(m.id)` devuelve cero porque ignora el valor nulo del lado derecho.

---

# 6. `ON` y `WHERE` no siempre son intercambiables

Pregunta:

> Mostrar todos los estudiantes y, si poseen una matrícula activa en 2026-I, mostrarla.

Versión que conserva a todos:

```sql
SELECT
    e.carnet,
    e.nombre,
    m.id AS matricula_id
FROM estudiantes AS e
LEFT JOIN matriculas AS m
    ON m.estudiante_id = e.id
   AND m.periodo = '2026-I'
   AND m.estado = 'Activa'
ORDER BY e.nombre;
```

Las condiciones dentro de `ON` deciden qué filas de `matriculas` cuentan como coincidencia. Quienes no poseen esa coincidencia siguen apareciendo con `NULL`.

Versión que elimina a quienes no coinciden:

```sql
SELECT
    e.carnet,
    e.nombre,
    m.id AS matricula_id
FROM estudiantes AS e
LEFT JOIN matriculas AS m
    ON m.estudiante_id = e.id
WHERE m.periodo = '2026-I'
  AND m.estado = 'Activa';
```

`WHERE` se aplica después de construir la unión. Las filas sin matrícula poseen `m.periodo = NULL`; no cumplen la condición y desaparecen. En la práctica, esa parte de la consulta se comporta como una unión interna.

> En una unión externa, coloca en `ON` los filtros del lado opcional cuando quieras conservar las filas principales sin coincidencia.

---

# 7. Unir tres o más tablas

## 7.1 Una fila por matrícula

```sql
SELECT
    e.carnet,
    e.nombre AS estudiante,
    cu.codigo AS codigo_curso,
    cu.nombre AS curso,
    m.periodo,
    m.estado
FROM matriculas AS m
INNER JOIN estudiantes AS e
    ON e.id = m.estudiante_id
INNER JOIN cursos AS cu
    ON cu.id = m.curso_id
ORDER BY e.nombre, cu.nombre;
```

La entidad que define la granularidad es `matriculas`: cada fila representa una matrícula.

## 7.2 Añadir docente y calificación

```sql
SELECT
    e.nombre AS estudiante,
    cu.nombre AS curso,
    COALESCE(d.nombre, 'Sin docente') AS docente,
    m.periodo,
    m.estado AS estado_matricula,
    cl.nota
FROM matriculas AS m
INNER JOIN estudiantes AS e
    ON e.id = m.estudiante_id
INNER JOIN cursos AS cu
    ON cu.id = m.curso_id
LEFT JOIN docentes AS d
    ON d.id = cu.docente_id
LEFT JOIN calificaciones AS cl
    ON cl.matricula_id = m.id
ORDER BY e.nombre, cu.nombre;
```

Los primeros `INNER JOIN` exigen estudiante y curso, pues las claves son obligatorias. Los `LEFT JOIN` conservan matrículas aunque el curso no tenga docente o la nota todavía no exista.

## 7.3 Uniones y agregaciones

Promedio por curso, conservando cursos sin notas:

```sql
SELECT
    cu.codigo,
    cu.nombre,
    COUNT(cl.id) AS notas_registradas,
    ROUND(AVG(cl.nota), 2) AS promedio
FROM cursos AS cu
LEFT JOIN matriculas AS m
    ON m.curso_id = cu.id
LEFT JOIN calificaciones AS cl
    ON cl.matricula_id = m.id
GROUP BY cu.id, cu.codigo, cu.nombre
ORDER BY promedio DESC, cu.nombre;
```

Antes de sumar o promediar, comprueba que una fila de calificación no se haya multiplicado por otra relación uno a muchos añadida innecesariamente.

---

# 8. Relaciones muchos a muchos

Estudiantes y cursos tienen una relación muchos a muchos:

```text
estudiantes 1 ─────< matriculas >───── 1 cursos
```

`matriculas` contiene datos propios de la relación: período, estado y fecha.

Lista de estudiantes por curso:

```sql
SELECT
    cu.codigo,
    cu.nombre AS curso,
    e.carnet,
    e.nombre AS estudiante,
    m.periodo,
    m.estado
FROM cursos AS cu
INNER JOIN matriculas AS m
    ON m.curso_id = cu.id
INNER JOIN estudiantes AS e
    ON e.id = m.estudiante_id
ORDER BY cu.codigo, e.nombre;
```

No unas directamente `estudiantes` con `cursos`: no existe una clave que describa esa relación sin pasar por la matrícula.

---

# 9. Autounión: una tabla se relaciona consigo misma

`docentes.supervisor_id` apunta a `docentes.id`.

```text
docente ── supervisor_id ──> otro docente
```

La misma tabla participa con dos papeles:

```sql
SELECT
    d.nombre AS docente,
    d.especialidad,
    COALESCE(s.nombre, 'Sin supervisor') AS supervisor
FROM docentes AS d
LEFT JOIN docentes AS s
    ON s.id = d.supervisor_id
ORDER BY d.nombre;
```

Los alias `d` y `s` no representan tablas diferentes. Representan dos funciones dentro de la misma relación.

---

# 10. Otros tipos de unión

## 10.1 `RIGHT JOIN`

Conserva todas las filas del lado derecho. Una consulta puede reescribirse normalmente como `LEFT JOIN` intercambiando los lados:

```sql
-- Conserva todos los cursos
SELECT d.nombre, cu.nombre
FROM docentes AS d
RIGHT JOIN cursos AS cu
    ON cu.docente_id = d.id;
```

```sql
-- Mismo propósito expresado con LEFT JOIN
SELECT d.nombre, cu.nombre
FROM cursos AS cu
LEFT JOIN docentes AS d
    ON d.id = cu.docente_id;
```

Las versiones modernas de SQLite admiten `RIGHT JOIN`, pero `LEFT JOIN` continúa siendo más reconocible y fácil de adaptar a entornos antiguos.

## 10.2 `FULL OUTER JOIN`

Conserva coincidencias, filas sin pareja del lado izquierdo y filas sin pareja del lado derecho. SQLite moderno lo admite, pero otros entornos o versiones antiguas pueden requerir una combinación alternativa.

En este módulo debes comprender qué filas conserva. No es necesario utilizarlo en el proyecto.

## 10.3 Evita `NATURAL JOIN`

`NATURAL JOIN` decide automáticamente qué columnas con el mismo nombre debe comparar. Un nuevo campo compartido puede cambiar el resultado sin modificar la consulta. Para aprendizaje profesional, utiliza `JOIN ... ON` y expresa las claves.

---

# 11. Subconsultas

Una subconsulta es un `SELECT` dentro de otra instrucción.

## 11.1 Subconsulta escalar

Devuelve un solo valor. Estudiantes con nota superior al promedio general:

```sql
SELECT
    e.nombre AS estudiante,
    cu.nombre AS curso,
    cl.nota
FROM calificaciones AS cl
INNER JOIN matriculas AS m
    ON m.id = cl.matricula_id
INNER JOIN estudiantes AS e
    ON e.id = m.estudiante_id
INNER JOIN cursos AS cu
    ON cu.id = m.curso_id
WHERE cl.nota > (
    SELECT AVG(nota)
    FROM calificaciones
)
ORDER BY cl.nota DESC, e.nombre;
```

Si una subconsulta escalar devuelve varias filas, la intención es ambigua y otros motores pueden generar un error. Diseña la consulta para producir exactamente un valor.

## 11.2 Subconsulta de lista con `IN`

Estudiantes que poseen alguna matrícula en 2026-I:

```sql
SELECT carnet, nombre
FROM estudiantes
WHERE id IN (
    SELECT estudiante_id
    FROM matriculas
    WHERE periodo = '2026-I'
)
ORDER BY nombre;
```

`IN` es expresivo cuando la pregunta es “pertenece a este conjunto”. Si además necesitas columnas de la tabla interna, utiliza un `JOIN`.

## 11.3 Subconsulta correlacionada

La subconsulta utiliza una fila de la consulta externa:

```sql
SELECT
    cu.codigo,
    cu.nombre
FROM cursos AS cu
WHERE (
    SELECT COUNT(*)
    FROM matriculas AS m
    WHERE m.curso_id = cu.id
) >= 3
ORDER BY cu.codigo;
```

Conceptualmente, la subconsulta se relaciona con cada curso mediante `m.curso_id = cu.id`. Para conteos y reportes completos, una agrupación puede ser más clara. La correlación es especialmente útil con `EXISTS`.

---

# 12. `EXISTS`, `NOT EXISTS` y la trampa de `NOT IN`

## 12.1 `EXISTS`

Comprueba si la subconsulta produce al menos una fila:

```sql
SELECT e.carnet, e.nombre
FROM estudiantes AS e
WHERE EXISTS (
    SELECT 1
    FROM matriculas AS m
    WHERE m.estudiante_id = e.id
      AND m.estado = 'Activa'
)
ORDER BY e.nombre;
```

`SELECT 1` comunica que solo importa la existencia, no las columnas internas.

## 12.2 `NOT EXISTS`

Estudiantes sin ninguna matrícula:

```sql
SELECT e.carnet, e.nombre
FROM estudiantes AS e
WHERE NOT EXISTS (
    SELECT 1
    FROM matriculas AS m
    WHERE m.estudiante_id = e.id
)
ORDER BY e.nombre;
```

Este patrón expresa ausencia sin depender de cómo se traten los valores nulos en una lista.

## 12.3 `NOT IN` y `NULL`

Si la subconsulta utilizada por `NOT IN` devuelve al menos un `NULL`, el resultado puede volverse desconocido para todas las filas:

```sql
WHERE id NOT IN (1, 2, NULL)
```

No puede afirmarse que un valor sea distinto de una identidad desconocida. Para antirrelaciones, prefiere `NOT EXISTS`.

---

# 13. CTE ordinarias con `WITH`

Una expresión común de tabla asigna un nombre temporal al resultado de una consulta durante una sola instrucción.

```sql
WITH promedios_curso AS (
    SELECT
        cu.id AS curso_id,
        cu.codigo,
        cu.nombre AS curso,
        COUNT(cl.id) AS notas,
        AVG(cl.nota) AS promedio
    FROM cursos AS cu
    LEFT JOIN matriculas AS m
        ON m.curso_id = cu.id
    LEFT JOIN calificaciones AS cl
        ON cl.matricula_id = m.id
    GROUP BY cu.id, cu.codigo, cu.nombre
)
SELECT
    codigo,
    curso,
    notas,
    ROUND(promedio, 2) AS promedio
FROM promedios_curso
WHERE notas >= 2
  AND promedio >= 85
ORDER BY promedio DESC, curso;
```

```text
WITH construye un resultado intermedio con nombre
        ↓
SELECT final lo consulta como si fuera una tabla temporal
```

La CTE no queda almacenada y no sustituye una vista permanente. En este módulo utilizarás CTE ordinarias para mejorar claridad. Las CTE recursivas quedan fuera del alcance.

## 13.1 Cuándo una CTE aporta valor

- La consulta posee una etapa lógica con nombre propio.
- Un cálculo largo se utilizará en el resultado final.
- Una subconsulta anidada resulta difícil de leer.
- Necesitas revisar el resultado intermedio por separado.

No crees una CTE que solamente esconda una consulta de dos líneas sin mejorar su significado.

---

# 14. `UNION` y `UNION ALL`

Estas operaciones apilan resultados verticalmente. No relacionan columnas mediante claves.

Directorio de estudiantes y docentes:

```sql
SELECT
    nombre,
    correo,
    'Estudiante' AS tipo_persona
FROM estudiantes

UNION ALL

SELECT
    nombre,
    correo,
    'Docente' AS tipo_persona
FROM docentes
ORDER BY nombre;
```

Reglas:

- Cada `SELECT` debe devolver la misma cantidad de columnas.
- Las columnas en la misma posición deben tener significados y tipos compatibles.
- Los encabezados finales proceden del primer `SELECT`.
- `ORDER BY` se coloca al final del conjunto completo.

`UNION` elimina filas duplicadas. `UNION ALL` las conserva. Utiliza `UNION ALL` cuando cada fila debe mantenerse o cuando ya sabes que no hay duplicados. No elimines datos solo para que el resultado “se vea limpio”.

```text
JOIN        → añade columnas siguiendo una relación
UNION ALL   → añade filas de resultados compatibles
```

---

# 15. Elegir la herramienta adecuada

| Necesidad | Herramienta habitual |
|---|---|
| Mostrar columnas de varias tablas relacionadas | `JOIN` |
| Conservar entidades aunque no tengan relación | `LEFT JOIN` |
| Comprobar si existe una relación | `EXISTS` |
| Encontrar entidades sin relación | `NOT EXISTS` o `LEFT JOIN ... IS NULL` |
| Comparar contra un valor calculado | Subconsulta escalar |
| Dividir una solución compleja en etapas | CTE |
| Apilar directorios compatibles | `UNION ALL` |
| Generar todas las combinaciones intencionales | `CROSS JOIN` |

Dos soluciones pueden ser correctas. Elige la que haga más evidente:

- Qué entidades se conservan.
- Qué claves se recorren.
- Qué representa cada fila.
- Dónde se aplican los filtros.
- Cómo comprobar el resultado.

---

# 16. Método de verificación de una consulta multitabla

1. **Dibuja el camino de claves.** No comiences por la sintaxis.
2. **Define la fila final.** Persona, matrícula, curso, carrera u otra unidad.
3. **Predice coincidencias.** Cero, una o muchas por cada paso.
4. **Elige qué debe conservarse.** Esa entidad suele quedar a la izquierda de un `LEFT JOIN`.
5. **Une una tabla cada vez.** Ejecuta y cuenta filas después de cada paso.
6. **Añade columnas explícitas.** Evita `SELECT *`.
7. **Aplica filtros conscientemente.** Revisa `ON` frente a `WHERE`.
8. **Agrega al final.** Comprueba que ninguna medida se multiplicó.
9. **Busca casos sin coincidencia.** Deben aparecer o desaparecer según la pregunta.
10. **Explica una fila.** Señala de qué registro procede cada valor.

## Señal de alerta: `DISTINCT` como parche

Si una unión genera repeticiones inesperadas, no añadas `DISTINCT` de inmediato. Primero pregunta:

- ¿La relación es uno a muchos?
- ¿Cada fila representa una matrícula diferente?
- ¿Se añadió una tabla innecesaria?
- ¿Falta una parte de la condición de unión?

`DISTINCT` puede ocultar el síntoma sin corregir la causa.

---

# 17. Prácticas guiadas

Utiliza el archivo `datos_universidad_m05.sql` incluido con el módulo.

## Práctica guiada 1 — Seguir el camino completo

### Pregunta

Mostrar estudiante, carrera, curso, docente y nota de cada matrícula.

```sql
SELECT
    e.carnet,
    e.nombre AS estudiante,
    ca.nombre AS carrera,
    cu.codigo AS codigo_curso,
    cu.nombre AS curso,
    COALESCE(d.nombre, 'Sin docente') AS docente,
    m.periodo,
    m.estado AS estado_matricula,
    cl.nota
FROM matriculas AS m
INNER JOIN estudiantes AS e
    ON e.id = m.estudiante_id
INNER JOIN carreras AS ca
    ON ca.id = e.carrera_id
INNER JOIN cursos AS cu
    ON cu.id = m.curso_id
LEFT JOIN docentes AS d
    ON d.id = cu.docente_id
LEFT JOIN calificaciones AS cl
    ON cl.matricula_id = m.id
ORDER BY e.nombre, m.periodo, cu.nombre;
```

Comprueba que el resultado posea una fila por matrícula y que una nota ausente no elimine la matrícula.

## Práctica guiada 2 — Conservar cursos sin matrículas

```sql
SELECT
    cu.codigo,
    cu.nombre,
    COUNT(m.id) AS matriculas
FROM cursos AS cu
LEFT JOIN matriculas AS m
    ON m.curso_id = cu.id
GROUP BY cu.id, cu.codigo, cu.nombre
ORDER BY matriculas DESC, cu.codigo;
```

Localiza el curso cuyo conteo es cero. Cambia `COUNT(m.id)` por `COUNT(*)`, ejecuta y explica por qué el resultado de ese curso se vuelve incorrecto.

## Práctica guiada 3 — Proteger un `LEFT JOIN`

Construye dos versiones del reporte de estudiantes y matrículas activas de 2026-I:

1. Coloca período y estado dentro de `ON`.
2. Colócalos dentro de `WHERE`.

Cuenta las personas distintas de cada resultado. Identifica quién desaparece en la segunda versión y explica la etapa que causó la pérdida.

## Práctica guiada 4 — Comparar con el promedio

```sql
SELECT
    e.nombre AS estudiante,
    cu.nombre AS curso,
    cl.nota
FROM calificaciones AS cl
INNER JOIN matriculas AS m
    ON m.id = cl.matricula_id
INNER JOIN estudiantes AS e
    ON e.id = m.estudiante_id
INNER JOIN cursos AS cu
    ON cu.id = m.curso_id
WHERE cl.nota > (
    SELECT AVG(nota)
    FROM calificaciones
)
ORDER BY cl.nota DESC, e.nombre;
```

Ejecuta primero `SELECT AVG(nota) FROM calificaciones;`. Utiliza ese valor para comprobar manualmente los límites del resultado.

## Práctica guiada 5 — Informe por etapas con CTE

```sql
WITH carga_estudiante AS (
    SELECT
        e.id AS estudiante_id,
        e.carnet,
        e.nombre AS estudiante,
        COUNT(m.id) AS matriculas_activas,
        COALESCE(SUM(cu.creditos), 0) AS creditos_activos
    FROM estudiantes AS e
    LEFT JOIN matriculas AS m
        ON m.estudiante_id = e.id
       AND m.periodo = '2026-I'
       AND m.estado = 'Activa'
    LEFT JOIN cursos AS cu
        ON cu.id = m.curso_id
    GROUP BY e.id, e.carnet, e.nombre
)
SELECT
    carnet,
    estudiante,
    matriculas_activas,
    creditos_activos,
    CASE
        WHEN creditos_activos >= 8 THEN 'Carga alta'
        WHEN creditos_activos >= 4 THEN 'Carga media'
        ELSE 'Sin carga o carga baja'
    END AS nivel_carga
FROM carga_estudiante
ORDER BY creditos_activos DESC, estudiante;
```

La CTE produce una fila por estudiante. La consulta final se concentra en presentación y clasificación.

---

# 18. Errores comunes

## Error 1 — Unir identificadores que no representan la relación

```sql
ON e.id = cu.id
```

Corrección: recorrer `matriculas` y sus dos claves foráneas.

## Error 2 — Omitir `ON`

Produce todas las combinaciones. Escribe la condición de clave de manera explícita.

## Error 3 — Convertir un `LEFT JOIN` en interno

Filtrar una columna opcional en `WHERE` elimina sus filas `NULL`. Coloca la condición en `ON` si necesitas conservar el lado izquierdo.

## Error 4 — Contar con `COUNT(*)` después de una unión externa

Para contar coincidencias reales del lado derecho, utiliza una columna no nula de esa tabla: `COUNT(m.id)`.

## Error 5 — Multiplicar medidas

Unir dos relaciones uno a muchos puede combinar cada detalle con cada otro detalle. Comprueba conteos antes de sumar.

## Error 6 — Usar `DISTINCT` sin comprender las repeticiones

Cada matrícula puede ser legítimamente una fila. Define la granularidad antes de eliminar resultados.

## Error 7 — Elegir `INNER JOIN` cuando deben aparecer ausencias

Si la pregunta contiene “todos, incluso quienes no...”, considera `LEFT JOIN` o `NOT EXISTS`.

## Error 8 — Utilizar `NOT IN` con una fuente que puede contener `NULL`

Prefiere `NOT EXISTS` para expresar ausencia.

## Error 9 — Subconsulta escalar con varias filas

Una comparación con `=` necesita un solo valor. Agrega, filtra o utiliza `IN`, según la pregunta.

## Error 10 — Unir resultados incompatibles

`UNION` requiere la misma cantidad de columnas y significados compatibles en la misma posición.

## Error 11 — Ordenar cada parte de un `UNION`

Para ordenar el resultado compuesto, coloca `ORDER BY` al final.

## Error 12 — Crear CTE sin propósito

Una CTE debe nombrar una etapa útil. Más niveles no significan mejor SQL.

---

# 19. Buenas prácticas

1. Dibuja las claves antes de escribir el `JOIN`.
2. Comienza desde la entidad que define la granularidad.
3. Utiliza alias cortos y consistentes.
4. Califica las columnas: `e.nombre`, `cu.nombre`.
5. Escribe cada `JOIN` en un bloque separado.
6. Usa `ON` para expresar relaciones y filtros del lado opcional.
7. Conserva en `WHERE` los filtros del resultado completo.
8. Cuenta claves del lado derecho después de `LEFT JOIN`.
9. Prueba cada unión de forma incremental.
10. Compara el conteo antes y después de añadir una tabla.
11. Prefiere `NOT EXISTS` para encontrar ausencia.
12. Utiliza CTE para nombrar etapas, no para impresionar.
13. Usa `UNION ALL` si no necesitas eliminar duplicados.
14. Evita `NATURAL JOIN` y uniones con comas.
15. No dependas de extensiones extrañas aceptadas por SQLite.
16. Revisa el comportamiento en el motor de destino.
17. Documenta qué representa cada fila del reporte.
18. Explica por qué elegiste cada técnica.

---

# 20. Ejercicios individuales

Los ejercicios 1 al 12 son esenciales. Los ejercicios 13 al 16 son de profundización. Utiliza la base universitaria y escribe la pregunta como comentario antes de cada solución.

## Ejercicios esenciales

### Ejercicio 1 — Estudiantes y carreras

Muestra carnet, estudiante, carrera y sede. Ordena por carrera y estudiante. La fila debe representar a una persona estudiante.

### Ejercicio 2 — Cursos y docentes

Muestra todos los cursos, incluso los que no poseen docente. Presenta `Sin asignar` cuando corresponda.

### Ejercicio 3 — Matrículas detalladas

Muestra estudiante, curso, período y estado de cada matrícula. Recorre la tabla intermedia y ordena por estudiante y curso.

### Ejercicio 4 — Calificaciones disponibles

Muestra estudiante, curso y nota únicamente cuando exista una calificación. Ordena de mayor a menor nota.

### Ejercicio 5 — Matrículas sin nota

Muestra estudiante, curso, período y estado de las matrículas que todavía no tienen calificación. Utiliza `LEFT JOIN` e `IS NULL`.

### Ejercicio 6 — Cursos sin estudiantes

Muestra código y nombre de los cursos sin ninguna matrícula. Resuelve con `NOT EXISTS`.

### Ejercicio 7 — Conteo por curso

Muestra todos los cursos y su cantidad de matrículas. Los cursos sin matrículas deben indicar cero.

### Ejercicio 8 — Carga activa

Muestra cada estudiante y la cantidad de matrículas activas que posee en 2026-I. Conserva estudiantes sin matrícula activa. Los filtros del lado opcional deben estar en `ON`.

### Ejercicio 9 — Supervisión docente

Muestra docente, especialidad y supervisor. Conserva a quienes no poseen supervisor y presenta un texto alternativo.

### Ejercicio 10 — Sobre el promedio

Muestra las calificaciones superiores al promedio general junto con estudiante y curso. Utiliza una subconsulta escalar.

### Ejercicio 11 — Existencia de actividad

Muestra estudiantes que poseen al menos una matrícula finalizada. Utiliza `EXISTS` y evita duplicados sin recurrir a `DISTINCT`.

### Ejercicio 12 — Directorio institucional

Crea un directorio con nombre, correo y tipo de persona para estudiantes y docentes. Utiliza `UNION ALL`.

## Profundización

### Ejercicio 13 — Promedios por curso

Construye una CTE con código, curso, cantidad de notas y promedio. En la consulta final conserva cursos con al menos dos notas y promedio igual o superior a 85.

### Ejercicio 14 — Carreras sin estudiantes

Resuelve la pregunta de dos maneras: `LEFT JOIN ... IS NULL` y `NOT EXISTS`. Compara la claridad.

### Ejercicio 15 — Error de filtro

Corrige esta consulta para conservar a todos los cursos y mostrar únicamente matrículas activas de 2026-I cuando existan:

```sql
SELECT cu.nombre, COUNT(m.id)
FROM cursos AS cu
LEFT JOIN matriculas AS m ON m.curso_id = cu.id
WHERE m.periodo = '2026-I' AND m.estado = 'Activa'
GROUP BY cu.id, cu.nombre;
```

### Ejercicio 16 — Multiplicación prevista

Antes de ejecutar, predice cuántas filas produce:

```sql
SELECT e.nombre, cu.nombre
FROM estudiantes AS e
CROSS JOIN cursos AS cu;
```

Comprueba el cálculo usando las cantidades de cada tabla y explica por qué el resultado no representa matrículas.

---

# 21. Soluciones sugeridas

## Solución 1

```sql
SELECT e.carnet, e.nombre AS estudiante, ca.nombre AS carrera, ca.sede
FROM estudiantes AS e
INNER JOIN carreras AS ca ON ca.id = e.carrera_id
ORDER BY ca.nombre, e.nombre;
```

## Solución 2

```sql
SELECT cu.codigo, cu.nombre AS curso,
       COALESCE(d.nombre, 'Sin asignar') AS docente
FROM cursos AS cu
LEFT JOIN docentes AS d ON d.id = cu.docente_id
ORDER BY cu.codigo;
```

## Solución 3

```sql
SELECT e.nombre AS estudiante, cu.nombre AS curso, m.periodo, m.estado
FROM matriculas AS m
INNER JOIN estudiantes AS e ON e.id = m.estudiante_id
INNER JOIN cursos AS cu ON cu.id = m.curso_id
ORDER BY e.nombre, cu.nombre, m.periodo;
```

## Solución 4

```sql
SELECT e.nombre AS estudiante, cu.nombre AS curso, cl.nota
FROM calificaciones AS cl
INNER JOIN matriculas AS m ON m.id = cl.matricula_id
INNER JOIN estudiantes AS e ON e.id = m.estudiante_id
INNER JOIN cursos AS cu ON cu.id = m.curso_id
ORDER BY cl.nota DESC, e.nombre;
```

## Solución 5

```sql
SELECT e.nombre AS estudiante, cu.nombre AS curso, m.periodo, m.estado
FROM matriculas AS m
INNER JOIN estudiantes AS e ON e.id = m.estudiante_id
INNER JOIN cursos AS cu ON cu.id = m.curso_id
LEFT JOIN calificaciones AS cl ON cl.matricula_id = m.id
WHERE cl.id IS NULL
ORDER BY e.nombre, cu.nombre;
```

## Solución 6

```sql
SELECT cu.codigo, cu.nombre
FROM cursos AS cu
WHERE NOT EXISTS (
    SELECT 1 FROM matriculas AS m WHERE m.curso_id = cu.id
)
ORDER BY cu.codigo;
```

## Solución 7

```sql
SELECT cu.codigo, cu.nombre, COUNT(m.id) AS matriculas
FROM cursos AS cu
LEFT JOIN matriculas AS m ON m.curso_id = cu.id
GROUP BY cu.id, cu.codigo, cu.nombre
ORDER BY matriculas DESC, cu.codigo;
```

## Solución 8

```sql
SELECT e.carnet, e.nombre, COUNT(m.id) AS matriculas_activas
FROM estudiantes AS e
LEFT JOIN matriculas AS m
    ON m.estudiante_id = e.id
   AND m.periodo = '2026-I'
   AND m.estado = 'Activa'
GROUP BY e.id, e.carnet, e.nombre
ORDER BY matriculas_activas DESC, e.nombre;
```

## Solución 9

```sql
SELECT d.nombre AS docente, d.especialidad,
       COALESCE(s.nombre, 'Sin supervisor') AS supervisor
FROM docentes AS d
LEFT JOIN docentes AS s ON s.id = d.supervisor_id
ORDER BY d.nombre;
```

## Solución 10

```sql
SELECT e.nombre AS estudiante, cu.nombre AS curso, cl.nota
FROM calificaciones AS cl
INNER JOIN matriculas AS m ON m.id = cl.matricula_id
INNER JOIN estudiantes AS e ON e.id = m.estudiante_id
INNER JOIN cursos AS cu ON cu.id = m.curso_id
WHERE cl.nota > (SELECT AVG(nota) FROM calificaciones)
ORDER BY cl.nota DESC, e.nombre;
```

## Solución 11

```sql
SELECT e.carnet, e.nombre
FROM estudiantes AS e
WHERE EXISTS (
    SELECT 1
    FROM matriculas AS m
    WHERE m.estudiante_id = e.id
      AND m.estado = 'Finalizada'
)
ORDER BY e.nombre;
```

## Solución 12

```sql
SELECT nombre, correo, 'Estudiante' AS tipo_persona FROM estudiantes
UNION ALL
SELECT nombre, correo, 'Docente' AS tipo_persona FROM docentes
ORDER BY nombre;
```

## Solución 13

```sql
WITH resumen AS (
    SELECT cu.id, cu.codigo, cu.nombre AS curso,
           COUNT(cl.id) AS notas, AVG(cl.nota) AS promedio
    FROM cursos AS cu
    LEFT JOIN matriculas AS m ON m.curso_id = cu.id
    LEFT JOIN calificaciones AS cl ON cl.matricula_id = m.id
    GROUP BY cu.id, cu.codigo, cu.nombre
)
SELECT codigo, curso, notas, ROUND(promedio, 2) AS promedio
FROM resumen
WHERE notas >= 2 AND promedio >= 85
ORDER BY promedio DESC, curso;
```

## Solución 14

```sql
SELECT ca.nombre
FROM carreras AS ca
LEFT JOIN estudiantes AS e ON e.carrera_id = ca.id
WHERE e.id IS NULL;
```

```sql
SELECT ca.nombre
FROM carreras AS ca
WHERE NOT EXISTS (
    SELECT 1 FROM estudiantes AS e WHERE e.carrera_id = ca.id
);
```

## Solución 15

```sql
SELECT cu.nombre, COUNT(m.id) AS matriculas_activas
FROM cursos AS cu
LEFT JOIN matriculas AS m
    ON m.curso_id = cu.id
   AND m.periodo = '2026-I'
   AND m.estado = 'Activa'
GROUP BY cu.id, cu.nombre
ORDER BY cu.nombre;
```

## Solución 16

La consulta produce `16 × 11 = 176` filas. Cada estudiante se combina con cada curso sin comprobar matrículas.

---

# 22. Mini proyecto — Gestión de un festival y sus entradas

## Propósito

Recorrer relaciones entre artistas, presentaciones, escenarios, asistentes y entradas. El conjunto incluye entidades sin coincidencias para que puedas elegir conscientemente entre `INNER JOIN`, `LEFT JOIN` y `NOT EXISTS`.

**Tiempo sugerido:** 25 minutos  
**Modalidad:** individual  
**Entrega independiente:** no. Inclúyelo dentro del script consolidado del módulo.

## Preparación

```sql
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS entradas_festival;
DROP TABLE IF EXISTS presentaciones_festival;
DROP TABLE IF EXISTS asistentes_festival;
DROP TABLE IF EXISTS artistas_festival;
DROP TABLE IF EXISTS escenarios_festival;

CREATE TABLE escenarios_festival (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0)
);

CREATE TABLE artistas_festival (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    genero TEXT NOT NULL
);

CREATE TABLE presentaciones_festival (
    id INTEGER PRIMARY KEY,
    artista_id INTEGER NOT NULL,
    escenario_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    FOREIGN KEY (artista_id) REFERENCES artistas_festival(id),
    FOREIGN KEY (escenario_id) REFERENCES escenarios_festival(id)
);

CREATE TABLE asistentes_festival (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE
);

CREATE TABLE entradas_festival (
    id INTEGER PRIMARY KEY,
    asistente_id INTEGER NOT NULL,
    presentacion_id INTEGER NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('Reservada', 'Usada', 'Cancelada')),
    UNIQUE (asistente_id, presentacion_id),
    FOREIGN KEY (asistente_id) REFERENCES asistentes_festival(id),
    FOREIGN KEY (presentacion_id) REFERENCES presentaciones_festival(id)
);

INSERT INTO escenarios_festival VALUES
    (1, 'Escenario Central', 800),
    (2, 'Escenario Norte', 400),
    (3, 'Sala Acustica', 180),
    (4, 'Foro Experimental', 120);

INSERT INTO artistas_festival VALUES
    (1, 'Luz Urbana', 'Pop'),
    (2, 'Ritmo Sur', 'Tropical'),
    (3, 'Codigo Sonoro', 'Electronica'),
    (4, 'Raices', 'Folclor'),
    (5, 'Nube Gris', 'Rock'),
    (6, 'Voz Libre', 'Independiente');

INSERT INTO presentaciones_festival VALUES
    (1, 1, 1, '2026-07-10', '18:00'),
    (2, 2, 1, '2026-07-10', '20:00'),
    (3, 3, 2, '2026-07-10', '19:00'),
    (4, 4, 3, '2026-07-11', '16:00'),
    (5, 5, 2, '2026-07-11', '20:00'),
    (6, 1, 3, '2026-07-11', '18:00'),
    (7, 3, 1, '2026-07-11', '22:00');

INSERT INTO asistentes_festival VALUES
    (1, 'Ana Solis', 'ana@festival.test'),
    (2, 'Bruno Mora', 'bruno@festival.test'),
    (3, 'Carla Rojas', 'carla@festival.test'),
    (4, 'Diego Vega', 'diego@festival.test'),
    (5, 'Elena Ruiz', 'elena@festival.test'),
    (6, 'Fabian Leon', 'fabian@festival.test'),
    (7, 'Gabriela Soto', 'gabriela@festival.test'),
    (8, 'Hugo Araya', 'hugo@festival.test');

INSERT INTO entradas_festival VALUES
    (1, 1, 1, 'Usada'),
    (2, 1, 3, 'Reservada'),
    (3, 2, 1, 'Usada'),
    (4, 3, 2, 'Reservada'),
    (5, 3, 4, 'Usada'),
    (6, 4, 5, 'Cancelada'),
    (7, 5, 3, 'Reservada'),
    (8, 6, 7, 'Reservada'),
    (9, 6, 2, 'Usada'),
    (10, 7, 1, 'Reservada');
```

## Requisitos

1. Muestra cada presentación con artista, género, escenario, fecha, hora y capacidad.
2. Muestra todos los artistas, aunque no posean presentación. Indica `Sin programación` cuando corresponda.
3. Muestra todos los escenarios y la cantidad de presentaciones. El escenario sin actividad debe indicar cero.
4. Construye una lista de entradas con asistente, artista, escenario, fecha y estado.
5. Encuentra asistentes que no poseen ninguna entrada mediante `NOT EXISTS`.
6. Encuentra presentaciones sin entradas mediante `LEFT JOIN ... IS NULL`.
7. Resume por artista la cantidad de entradas no canceladas. Conserva artistas sin entradas.
8. Crea con `UNION ALL` un directorio de artistas y asistentes con columnas `nombre` y `tipo`.

## Evidencias

- Ocho consultas comentadas.
- Captura de artistas sin programación.
- Captura del conteo por escenario.
- Explicación de la granularidad de la consulta 4.

## Comprobación

- [ ] `Voz Libre` aparece sin programación.
- [ ] `Foro Experimental` tiene cero presentaciones.
- [ ] El asistente sin entrada no desaparece de la consulta 5.
- [ ] Los conteos utilizan la clave del lado derecho.
- [ ] Las entradas canceladas no se cuentan en el requisito 7.

---

# 23. Proyecto obligatorio — Sistema de reportes académicos

## Propósito

Construir un conjunto profesional de reportes sobre una base universitaria normalizada. Cada consulta deberá documentar el camino de relaciones, la granularidad y la técnica elegida.

**Tiempo sugerido:** 80 minutos  
**Modalidad:** individual  
**Aprobación requerida:** sí  
**Condición de avance:** el proyecto y la evaluación deben aprobarse antes de continuar al módulo 6.

## Material necesario

[`Descargar datos_universidad_m05.sql`](/downloads/sql-bases-datos/modulo-5/datos_universidad_m05.sql)

El script crea y carga:

| Tabla | Filas esperadas |
|---|---:|
| `carreras` | 6 |
| `estudiantes` | 16 |
| `docentes` | 8 |
| `cursos` | 11 |
| `matriculas` | 27 |
| `calificaciones` | 25 |

No alteres los datos originales. Haz una copia del archivo y escribe las consultas debajo de la línea indicada.

## Mapa relacional obligatorio

Antes de programar, dibuja un diagrama que incluya:

```text
estudiantes.carrera_id       → carreras.id
matriculas.estudiante_id     → estudiantes.id
matriculas.curso_id          → cursos.id
cursos.docente_id            → docentes.id
calificaciones.matricula_id  → matriculas.id
docentes.supervisor_id       → docentes.id
```

Marca en el diagrama:

- La relación muchos a muchos entre estudiantes y cursos.
- Las relaciones opcionales.
- La tabla que funciona como puente.
- La autounión.

Puedes dibujarlo a mano con buena legibilidad o utilizar diagrams.net, dbdiagram.io u otra herramienta equivalente.

## Formato previo a cada consulta

```sql
-- REPORTE 01: Estudiantes y carreras
-- Granularidad: una fila por estudiante
-- Camino: estudiantes.carrera_id -> carreras.id
-- Técnica: INNER JOIN
-- Razón: la carrera es obligatoria para cada estudiante
```

## Reportes obligatorios

### Reporte 1 — Estudiantes y carreras

Muestra carnet, estudiante, estado, ciudad, carrera y sede. Presenta una ciudad ausente como `Sin registrar`. Ordena por carrera y estudiante.

### Reporte 2 — Cobertura de carreras

Muestra todas las carreras y la cantidad de estudiantes activos. Las carreras sin estudiantes activos deben indicar cero. Coloca el filtro de estado donde no elimine carreras sin coincidencia.

### Reporte 3 — Asignación docente

Muestra todos los cursos con código, nombre, créditos, docente y especialidad. Conserva cursos sin docente y presenta textos alternativos.

### Reporte 4 — Historial de matrículas

Muestra una fila por matrícula con estudiante, carrera, curso, período, estado y fecha de matrícula. Debe atravesar al menos cuatro tablas.

### Reporte 5 — Expediente de calificaciones

Muestra estudiante, curso, docente, período, estado de matrícula, nota y observación. Conserva matrículas sin nota, presentando `Pendiente` en una columna textual de estado de calificación. No reemplaces la nota ausente por cero.

### Reporte 6 — Oferta de 2026-I

Muestra todos los cursos y la cantidad de matrículas activas de 2026-I. Conserva cursos sin matrículas y ordena desde el de mayor cantidad.

### Reporte 7 — Estudiantes sin carga activa

Encuentra estudiantes que no poseen matrícula activa en 2026-I. Resuelve con `NOT EXISTS`. Incluye carnet, estudiante y carrera.

### Reporte 8 — Cursos sin demanda histórica

Encuentra cursos que nunca han recibido una matrícula. Resuelve con `LEFT JOIN ... IS NULL` o `NOT EXISTS` y explica por qué la técnica conserva correctamente la ausencia.

### Reporte 9 — Estructura de supervisión

Muestra todos los docentes, especialidad y supervisor. Conserva docentes sin supervisor. Este reporte debe utilizar una autounión.

### Reporte 10 — Rendimiento superior al promedio

Calcula el promedio general de todas las calificaciones mediante una subconsulta escalar. Muestra estudiante, curso y nota de los resultados superiores al promedio, ordenados de mayor a menor.

### Reporte 11 — Participación académica

Muestra estudiantes que poseen al menos una matrícula finalizada y al menos una matrícula activa. Utiliza dos condiciones `EXISTS` independientes. Cada estudiante debe aparecer una sola vez.

### Reporte 12 — Promedios por curso

Crea una CTE que produzca código, curso, cantidad de calificaciones y promedio. En la consulta final conserva cursos con al menos dos notas y promedio de 85 o más. Redondea únicamente para presentar.

### Reporte 13 — Resumen por carrera

Crea una CTE que parta de `carreras` y produzca una fila por combinación carrera-estudiante cuando exista una persona, conservando también la carrera sin estudiantes. Incluye `carrera_id`, carrera, `estudiante_id`, cantidad de matrículas activas en 2026-I y créditos activos. En la consulta final agrupa por carrera y muestra estudiantes activos, matrículas activas y créditos activos. Utiliza `COUNT(estudiante_id)` para que una carrera sin estudiantes indique cero.

### Reporte 14 — Directorio institucional

Combina estudiantes y docentes mediante `UNION ALL`. El resultado debe contener nombre, correo, rol y una cuarta columna de contexto: carrera para estudiantes y especialidad para docentes. Ordena por rol y nombre.

### Reporte 15 — Tablero académico final

Utiliza al menos una CTE y varias uniones para producir una fila por curso con:

- Código y curso.
- Docente o `Sin asignar`.
- Matrículas totales.
- Matrículas activas de 2026-I.
- Calificaciones registradas.
- Promedio de notas.
- Estado del curso: `Sin matrículas`, `Sin calificaciones` o `Con resultados`.

Conserva todos los cursos. Explica por qué `COUNT(*)` sería incorrecto para algunos indicadores.

## Análisis escrito

Responde con evidencia:

1. ¿Qué carrera no tiene estudiantes?
2. ¿Qué cursos no tienen matrícula?
3. ¿Qué curso no tiene docente asignado?
4. ¿Qué estudiantes no poseen carga activa en 2026-I?
5. ¿Qué diferencia hay entre una matrícula sin nota y una nota igual a cero?
6. ¿Qué reporte necesitó `LEFT JOIN` y qué se habría perdido con `INNER JOIN`?
7. ¿Qué reporte utilizó `EXISTS` y por qué fue más claro que añadir columnas con un `JOIN`?
8. ¿Qué etapa nombraste mediante una CTE?
9. Describe una repetición legítima producida por una relación uno a muchos.
10. Explica una limitación del conjunto de datos.

## Restricciones

- No modificar ni eliminar los datos originales.
- No utilizar `NATURAL JOIN` ni uniones separadas por comas.
- No utilizar `SELECT *` en los reportes finales.
- No añadir `DISTINCT` para ocultar una unión incorrecta.
- No utilizar vistas, índices, funciones de ventana ni CTE recursivas.
- No sustituir notas ausentes por cero.
- No omitir el mapa de relaciones ni la granularidad documentada.
- No presentar conteos sin comprobar los casos de cero coincidencias.

## Lista de comprobación

- [ ] La carga devuelve `6, 16, 8, 11, 27, 25`.
- [ ] Existen quince reportes numerados.
- [ ] Cada reporte declara granularidad, camino, técnica y razón.
- [ ] Los alias son consistentes.
- [ ] Las relaciones siguen claves reales.
- [ ] Las entidades sin coincidencia aparecen cuando se solicitan.
- [ ] Los filtros opcionales se colocan en `ON` cuando corresponde.
- [ ] `COUNT(clave_derecha)` permite mostrar ceros.
- [ ] Las uniones muchos a muchos atraviesan `matriculas`.
- [ ] La autounión usa dos alias para `docentes`.
- [ ] Las subconsultas devuelven la forma esperada.
- [ ] La ausencia se resuelve de manera segura.
- [ ] La CTE nombra una etapa útil.
- [ ] Las partes de `UNION ALL` tienen columnas compatibles.
- [ ] Cada resultado fue comprobado con al menos un caso conocido.

---

# 24. Rúbrica del proyecto

**Puntaje total:** 100 puntos  
**Puntaje mínimo:** 70 puntos  
**Condición adicional:** todos los criterios críticos deben cumplirse.

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Caminos y uniones | Todas las relaciones siguen claves correctas y la granularidad está documentada | Uno o dos detalles menores | Varios caminos requieren corrección | Existen productos cartesianos o claves inventadas | 25 |
| Conservación y ausencia | `LEFT JOIN`, `ON`, `NOT EXISTS` y conteos conservan exactamente las entidades solicitadas | Un caso menor necesita ajuste | Se pierden o cuentan mal varias ausencias | Los reportes omiten entidades esenciales | 20 |
| Consultas avanzadas | Subconsultas, `EXISTS`, CTE y `UNION ALL` se usan con propósito y exactitud | Una técnica necesita ajuste menor | Varias técnicas son confusas | Faltan o no funcionan | 20 |
| Agregaciones multitabla | Conteos y promedios no se multiplican; grupos y nulos se manejan correctamente | Existe un detalle menor | Varios indicadores son dudosos | Los indicadores principales son incorrectos | 15 |
| Análisis y validación | Explicaciones citan evidencia, comprueban casos y reconocen límites | Explicaciones correctas pero breves | Hay afirmaciones poco justificadas | El análisis contradice los resultados | 10 |
| Calidad y reproducibilidad | Script legible, explícito, comentado y ejecutable desde cero | Pequeñas inconsistencias | Requiere intervención para ejecutarse | No puede reproducirse | 5 |
| Entrega | Diagrama, evidencias y nombres completos y legibles | Falta un detalle menor | Faltan varias evidencias | No puede revisarse | 5 |
| **Total** |  |  |  |  | **100** |

## Criterios críticos

El proyecto debe corregirse si:

- El script no reconstruye la base o altera la carga.
- Existe un producto cartesiano accidental.
- Se unen columnas que no representan una relación.
- Faltan cuatro o más reportes.
- Un `LEFT JOIN` elimina las entidades que debía conservar.
- Los conteos de ausencia muestran uno en lugar de cero.
- Se inventan notas para matrículas sin calificación.
- Los promedios o conteos se multiplican por una unión incorrecta.
- No existe mapa relacional o no se documenta la granularidad.
- Las conclusiones no coinciden con los resultados.

| Puntaje | Resultado |
|---:|---|
| 90–100 | Dominio sólido |
| 80–89 | Buen desempeño |
| 70–79 | Aprobado con aspectos por reforzar |
| 0–69 | Requiere corrección y nueva entrega |

---

# 25. Evaluación práctica

## Instrucciones

Utiliza la base universitaria. No se indica qué técnica debes usar salvo cuando la decisión forma parte de la evaluación.

**Tiempo sugerido:** 15 minutos  
**Puntaje:** 20 puntos  
**Mínimo para aprobar:** 14 puntos

## Parte A — Resolver: 10 puntos

### 1. Oferta completa — 3 puntos

Muestra todos los cursos y el nombre de su docente, aunque falte la asignación. Incluye la cantidad de matrículas finalizadas. Los cursos sin coincidencias deben mostrar cero.

### 2. Ausencia — 3 puntos

Muestra estudiantes que nunca han tenido una matrícula. Elige entre `NOT EXISTS` y `LEFT JOIN ... IS NULL` y justifica la elección en una oración.

### 3. Comparación — 4 puntos

Muestra las notas superiores al promedio del curso al que pertenecen. Puedes utilizar una subconsulta correlacionada o una CTE. Cada fila debe incluir estudiante, curso, nota y promedio del curso.

## Parte B — Diagnosticar: 6 puntos

### 4. Multiplicación accidental — 3 puntos

Explica por qué esta consulta no muestra matrículas reales y calcula cuántas filas produce con la carga original:

```sql
SELECT e.nombre, cu.nombre
FROM estudiantes AS e
JOIN cursos AS cu;
```

### 5. Pérdida de cursos — 3 puntos

Corrige la consulta para conservar cursos sin matrículas activas:

```sql
SELECT cu.nombre, COUNT(m.id)
FROM cursos AS cu
LEFT JOIN matriculas AS m ON m.curso_id = cu.id
WHERE m.estado = 'Activa'
GROUP BY cu.id, cu.nombre;
```

## Parte C — Elegir: 4 puntos

Para cada necesidad, indica la herramienta principal y justifica:

1. Añadir el nombre de carrera a cada estudiante.
2. Saber si una persona posee alguna matrícula activa sin mostrar datos de esa matrícula.
3. Comparar una nota contra el promedio general.
4. Unir un directorio de estudiantes con otro de docentes.

Opciones: `JOIN`, `EXISTS`, subconsulta escalar, `UNION ALL`.

## Aprobación

- Las consultas deben ejecutarse.
- Deben conservarse correctamente los casos sin relación.
- La consulta 3 debe comparar contra el promedio del curso correcto.
- Los diagnósticos deben explicar la causa, no solo mostrar código corregido.
- Las elecciones deben relacionar la necesidad con la herramienta.

---

# 26. Punto de entrega

Utiliza un único punto de entrega para el mini proyecto, el proyecto obligatorio y la evaluación.

## Nombre

```text
COA_SQL_M05_Apellido_Nombre.zip
```

## Estructura

```text
COA_SQL_M05_Apellido_Nombre/
├── COA_SQL_M05_Apellido_Nombre.sql
├── COA_SQL_M05_Apellido_Nombre.db
├── informe_relacional.pdf
├── mapa_relaciones.png
└── evidencias/
    ├── 01_carga.png
    ├── 02_left_join.png
    ├── 03_muchos_a_muchos.png
    ├── 04_subconsulta.png
    ├── 05_cte.png
    ├── 06_union.png
    └── 07_evaluacion.png
```

## Script

Debe contener, en orden:

1. Creación y carga de la base universitaria.
2. Quince reportes documentados.
3. Creación y carga del mini proyecto.
4. Ocho consultas del mini proyecto.
5. Respuestas SQL y comentarios de la evaluación.

El archivo completo debe ejecutarse desde una base vacía.

## Informe

Incluye:

- Identificación y nombre del módulo.
- Diez respuestas del análisis escrito.
- Justificación de tres técnicas elegidas.
- Comparación de `INNER JOIN` y `LEFT JOIN` con un caso del proyecto.
- Explicación de `ON` frente a `WHERE`.
- Resultado de la evaluación.
- Reflexión final de cinco a ocho líneas.

## Evidencias

Cada captura debe mostrar consulta y resultado legibles. Incluye como mínimo:

- Conteo de carga.
- Una ausencia conservada con `LEFT JOIN`.
- Una relación muchos a muchos.
- Una subconsulta.
- Una CTE.
- Un `UNION ALL`.
- Una respuesta de evaluación.

## Texto para el formulario

```text
Curso: SQL y Bases de Datos Relacionales
Módulo: 5 - Consultas multitabla y resolución avanzada con SQL
Nombre completo: [tu nombre]
Archivo: COA_SQL_M05_Apellido_Nombre.zip
Confirmo que el script se ejecuta desde una base vacía: Sí
```

Si recibes correcciones, actualiza el script, las evidencias afectadas y una sección `Correcciones realizadas` en el informe. No continúes al módulo 6 hasta obtener la aprobación.

[Entregar el Módulo 5](https://forms.gle/nTx97JRkFkbH5Vfr6)

---

# 27. Retos adicionales

Estos retos son opcionales.

## Reto 1 — Dos soluciones para la ausencia

Encuentra docentes sin cursos mediante:

1. `LEFT JOIN ... IS NULL`.
2. `NOT EXISTS`.

Comprueba que ambas devuelvan el mismo conjunto y explica cuál comunica mejor la pregunta.

## Reto 2 — Estudiantes por encima de su carrera

Muestra calificaciones superiores al promedio de la carrera de cada estudiante. La solución requiere una subconsulta correlacionada o una CTE con promedios por carrera.

## Reto 3 — Matriz intencional

Crea dos CTE pequeñas mediante `VALUES`: una con turnos `Mañana` y `Tarde`, y otra con tres aulas. Utiliza `CROSS JOIN` para producir las seis combinaciones. Explica por qué no es un error cartesiano.

## Reto 4 — Docentes y carga

Conserva todos los docentes y muestra cursos asignados, matrículas activas de 2026-I y estudiantes distintos. Verifica que un docente sin cursos muestre cero.

## Reto 5 — `UNION` frente a `UNION ALL`

Crea dos consultas compatibles que compartan al menos una fila. Combínalas primero con `UNION` y luego con `UNION ALL`. Predice y comprueba la diferencia de conteo.

## Reto 6 — Auditoría incremental

Construye el reporte 5 del proyecto añadiendo una tabla por vez. Registra el número de filas después de cada unión y explica por qué se mantiene o cambia.

---

# 28. Videos recomendados

## Video 1 — Consultas multitabla

[`LEFT JOIN` y `RIGHT JOIN` — Píldoras Informáticas](https://www.youtube.com/watch?v=N99-7gvjy6o)

**Tema exacto:** conservación de coincidencias y filas sin pareja en consultas multitabla.  
**Momento recomendado:** después de las secciones 3 a 6.  
**Objetivo:** reforzar visualmente qué lado conserva cada unión.  
**Nota:** el curso utiliza principalmente `LEFT JOIN` porque permite colocar a la izquierda la entidad que debe conservarse.

## Video 2 — Subconsultas

[Explicación sencilla de las subconsultas SQL — Tech Portal Formación](https://www.youtube.com/watch?v=lr0DOLueXIA)

**Tema exacto:** consultas dentro de otras consultas.  
**Momento recomendado:** antes de las prácticas 4 y 5.  
**Objetivo:** reconocer cuándo una consulta interior produce un valor, una lista o una comprobación de existencia.

Los videos complementan la práctica. Si un ejemplo utiliza otro motor, conserva el concepto y comprueba la sintaxis en la documentación de SQLite.

---

# 29. Documentación y recursos confiables

## SQLite

- [`SELECT`, cláusula `FROM` y uniones — documentación oficial de SQLite](https://sqlite.org/lang_select.html)  
  Busca `FROM clause processing`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`, `WHERE` y `compound SELECT`.

- [Expresiones y subconsultas — documentación oficial de SQLite](https://sqlite.org/lang_expr.html)  
  Busca `subquery expressions`, `IN`, `EXISTS` y `NOT IN`.

- [Cláusula `WITH` y CTE — documentación oficial de SQLite](https://sqlite.org/lang_with.html)  
  Concéntrate en `ordinary common table expressions`. Las CTE recursivas no son necesarias en este módulo.

- [Sintaxis de cláusulas de unión — documentación oficial de SQLite](https://sqlite.org/syntax/join-clause.html)  
  Úsala como referencia rápida de `JOIN`, `ON` y `USING`.

## Comparación con otro motor

- [Expresiones de tabla y uniones — documentación oficial de PostgreSQL](https://www.postgresql.org/docs/current/queries-table-expressions.html)  
  Compara uniones calificadas, externas y cruzadas. La lógica relacional se transfiere aunque existan diferencias de sintaxis o versión.

## Ruta de lectura recomendada

1. Lee primero el procesamiento de `FROM` en SQLite.
2. Revisa qué filas añade una unión externa.
3. Observa por qué `WHERE` se aplica después de `ON`.
4. Busca la forma de `EXISTS`.
5. Lee la introducción a CTE ordinarias.
6. Consulta las operaciones compuestas `UNION` y `UNION ALL`.

## Preguntas para consultar documentación

| Duda | Sección que debes buscar |
|---|---|
| ¿Qué produce una unión sin condición? | Cartesian product |
| ¿Cuándo se añaden filas con `NULL`? | LEFT/RIGHT/FULL JOIN |
| ¿Por qué cambia un filtro entre `ON` y `WHERE`? | WHERE clause filtering |
| ¿Qué devuelve `EXISTS`? | EXISTS operator |
| ¿Cuánto dura una CTE? | Ordinary common table expressions |
| ¿Dónde se coloca `ORDER BY` en un `UNION`? | Compound SELECT statements |

---

# 30. Portabilidad entre motores

Los conceptos del módulo funcionan en SQLite, MySQL, PostgreSQL, SQL Server, MariaDB y Oracle, pero existen diferencias que debes comprobar.

| Tema | SQLite | Posibles diferencias |
|---|---|---|
| `INNER JOIN` | Compatible | Sintaxis ampliamente compartida |
| `LEFT JOIN` | Compatible | Sintaxis ampliamente compartida |
| `RIGHT JOIN` | Disponible en versiones modernas | Versiones antiguas de SQLite no lo admiten; puede reescribirse como `LEFT JOIN` |
| `FULL OUTER JOIN` | Disponible en versiones modernas | MySQL requiere alternativas; otros motores lo admiten |
| Concatenación | `||` | MySQL suele usar `CONCAT`; SQL Server puede usar `+` |
| CTE ordinaria | `WITH` | Compatible en motores modernos; versiones antiguas pueden variar |
| Valores booleanos | Afinidad numérica | Otros motores poseen tipos booleanos dedicados |
| Alias | `AS` | Algunos motores limitan `AS` para alias de tablas |

Reglas para escribir SQL adaptable:

- Utiliza sintaxis estándar y explícita.
- Prefiere `LEFT JOIN` sobre invertir mentalmente un `RIGHT JOIN`.
- Evita combinaciones de palabras de unión no estándar que SQLite pueda aceptar.
- No mezcles uniones con comas y uniones con `JOIN`.
- Documenta las funciones o construcciones específicas del motor.
- Prueba la consulta en el motor final antes de utilizarla en producción.

---

# 31. Material complementario

Este módulo requiere un solo archivo descargable:

[`datos_universidad_m05.sql`](/downloads/sql-bases-datos/modulo-5/datos_universidad_m05.sql)

El archivo contiene la estructura y los datos del proyecto. El mapa de relaciones, la guía de recorridos, los esquemas de tipos de unión y las listas de comprobación ya están integrados en el contenido; no necesitas PDFs adicionales.

---

# 32. Glosario

| Término | Definición |
|---|---|
| Antirrelación | Búsqueda de entidades para las que no existe una coincidencia |
| Alias de tabla | Nombre breve que identifica el papel de una tabla en la consulta |
| Autounión | Unión de una tabla consigo misma mediante alias diferentes |
| Cardinalidad | Cantidad posible de coincidencias entre entidades |
| CTE | Resultado temporal con nombre, disponible durante una instrucción |
| CTE ordinaria | CTE no recursiva utilizada para dividir una consulta en etapas |
| Columna ambigua | Columna cuyo nombre existe en más de una tabla de la consulta |
| Correlación | Referencia de una subconsulta a una fila de la consulta exterior |
| `CROSS JOIN` | Unión que produce todas las combinaciones entre dos fuentes |
| Entidad conservada | Conjunto cuyas filas deben aparecer aunque no tengan coincidencia |
| `EXISTS` | Operador que comprueba si una subconsulta devuelve al menos una fila |
| Granularidad | Significado y nivel de detalle de cada fila final |
| `INNER JOIN` | Unión que conserva solamente coincidencias |
| `JOIN` | Operación que combina columnas de fuentes relacionadas |
| `LEFT JOIN` | Unión que conserva todas las filas de la fuente izquierda |
| Muchos a muchos | Relación donde varias filas de cada lado pueden vincularse entre sí |
| `NATURAL JOIN` | Unión que infiere columnas comunes; se evita por fragilidad |
| `NOT EXISTS` | Operador que comprueba ausencia de filas relacionadas |
| `ON` | Condición que define coincidencias durante una unión |
| Producto cartesiano | Todas las combinaciones posibles entre dos conjuntos |
| Relación opcional | Relación donde una entidad puede no tener coincidencia |
| `RIGHT JOIN` | Unión que conserva todas las filas de la fuente derecha |
| `FULL OUTER JOIN` | Unión que conserva coincidencias y filas sin pareja de ambos lados |
| Subconsulta | Consulta incluida dentro de otra instrucción |
| Subconsulta escalar | Subconsulta utilizada donde se espera un único valor |
| Subconsulta de lista | Subconsulta que produce un conjunto de valores, por ejemplo para `IN` |
| Tabla intermedia | Tabla que representa una relación muchos a muchos |
| `UNION` | Operación que apila resultados compatibles y elimina duplicados |
| `UNION ALL` | Operación que apila resultados compatibles y conserva duplicados |
| Unión externa | Unión que conserva filas sin coincidencia de uno o ambos lados |

---

# 33. Resumen final

En este módulo pasaste de consultar una tabla a reconstruir información distribuida en un modelo relacional.

```text
Pregunta
   ↓
Camino de claves
   ↓
Granularidad
   ↓
Tipo de unión
   ↓
Filtros en ON o WHERE
   ↓
Subconsulta o CTE si aporta claridad
   ↓
Comprobación de filas y medidas
```

Ahora puedes:

- Evitar productos cartesianos accidentales.
- Combinar coincidencias con `INNER JOIN`.
- Conservar ausencias con `LEFT JOIN`.
- Contar coincidencias reales después de una unión externa.
- Recorrer múltiples tablas con alias claros.
- Consultar relaciones muchos a muchos.
- Construir autouniones.
- Proteger el significado de una unión externa al colocar filtros.
- Comparar valores con subconsultas.
- Comprobar existencia y ausencia.
- Organizar consultas mediante CTE ordinarias.
- Apilar resultados con `UNION` y `UNION ALL`.
- Detectar repeticiones legítimas e incorrectas.
- Elegir una técnica por claridad y no por complejidad aparente.

## Habilidades obtenidas

Al aprobar el módulo habrás demostrado que puedes:

- Diseñar reportes sobre una base normalizada.
- Explicar de dónde procede cada columna.
- Conservar correctamente entidades sin actividad.
- Evitar conteos y promedios multiplicados por uniones defectuosas.
- Dividir un problema complejo en etapas verificables.
- Adaptar conceptos relacionales a otros motores SQL.
- Revisar y corregir consultas multitabla existentes.

## Antes de continuar

Debes poder responder:

1. ¿Qué representa un producto cartesiano?
2. ¿Cuándo elegirías `INNER JOIN` y cuándo `LEFT JOIN`?
3. ¿Por qué `COUNT(*)` puede ser incorrecto después de `LEFT JOIN`?
4. ¿Cómo cambia un filtro del lado derecho al moverlo de `ON` a `WHERE`?
5. ¿Qué tabla se recorre en una relación muchos a muchos?
6. ¿Por qué una repetición puede ser legítima?
7. ¿Cuándo utilizarías `EXISTS` en lugar de `JOIN`?
8. ¿Qué riesgo existe con `NOT IN` y `NULL`?
9. ¿Qué problema resuelve una CTE ordinaria?
10. ¿Cuál es la diferencia entre `JOIN` y `UNION ALL`?

Si no puedes explicar una unión dibujando sus claves y señalando la granularidad, vuelve a las secciones 1, 5, 6 y 16. Esa explicación será esencial en el diseño, auditoría y optimización del módulo final.

Completa el mini proyecto, aprueba la evaluación y entrega el proyecto obligatorio. Continúa únicamente cuando el módulo aparezca como aprobado.
