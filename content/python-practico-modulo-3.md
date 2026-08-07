# COA — Cursos Online Avanzados

## Python Práctico

# Módulo 3. Colecciones especializadas e iteradores

**Duración aproximada:** 2 horas  
**Modalidad:** práctica guiada, actividades obligatorias, proyecto y evaluación  
**Nivel:** intermedio  
**Tecnologías:** Python y biblioteca estándar  
**Resultado principal:** un centro de análisis y cola de atención

---

## Bienvenida

Las listas, los diccionarios, los conjuntos y las tuplas resuelven una gran cantidad de problemas. Sin embargo, algunas tareas frecuentes obligan a escribir siempre el mismo código auxiliar:

```python
conteos = {}

for categoria in categorias:
    if categoria not in conteos:
        conteos[categoria] = 0

    conteos[categoria] += 1
```

Python incluye una colección creada específicamente para contar:

```python
from collections import Counter

conteos = Counter(categorias)
```

La segunda solución no sustituye tu razonamiento. Primero debes reconocer que el problema es un conteo. Después eliges una estructura cuya operación principal coincide con esa necesidad.

En este módulo trabajarás con tres colecciones especializadas:

```text
Necesito contar o crear un ranking     → Counter
Necesito agrupar sin inicializar       → defaultdict
Necesito una cola eficiente            → deque
```

También utilizarás herramientas seleccionadas de `itertools` para encadenar, limitar, combinar y agrupar recorridos sin construir estructuras intermedias innecesarias.

> **Principio del módulo:** una estructura especializada merece utilizarse cuando simplifica una operación central del problema, no solamente porque existe.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Reconocer cuándo una colección común exige demasiado código auxiliar.
- Contar elementos y crear rankings mediante `Counter`.
- Actualizar, combinar y consultar conteos.
- Agrupar registros y acumular valores con `defaultdict`.
- Comparar `defaultdict` con `dict.get()` y `setdefault()`.
- Administrar colas FIFO mediante `deque`.
- Insertar y retirar elementos eficientemente en ambos extremos.
- Conservar historiales limitados mediante `deque(maxlen=...)`.
- Encadenar recorridos con `itertools.chain()`.
- Obtener una parte de un iterable con `islice()`.
- Crear productos cartesianos, combinaciones y permutaciones cuando el problema lo requiera.
- Agrupar elementos consecutivos mediante `groupby()` después de ordenar por la misma clave.
- Identificar iteradores consumibles y decidir cuándo materializarlos.
- Construir un sistema de análisis y priorización de solicitudes.

---

## Conocimientos que utilizarás

Necesitas poder:

- recorrer listas y diccionarios;
- crear funciones;
- trabajar con comprensiones;
- utilizar expresiones generadoras;
- ordenar mediante `sorted(..., key=...)`;
- utilizar `enumerate()`, `zip()`, `any()` y `all()`.

Estos conocimientos se aplicarán desde el inicio y no volverán a explicarse desde cero.

---

## Producto que construirás

Desarrollarás un centro local que combine solicitudes pendientes y nuevas, analice su contenido y organice la atención según prioridad:

```text
CENTRO DE SOLICITUDES
============================================================================
Solicitudes recibidas:       14
Categorías líderes:          acceso, contenido
Prioridad más frecuente:     normal
Responsables con más casos:  Ana, Carlos

PRÓXIMAS SOLICITUDES
----------------------------------------------------------------------------
1. SOP-004 | urgente | Error al iniciar sesión
2. SOP-011 | urgente | Cobro duplicado
3. SOP-013 | urgente | Cuenta bloqueada antes de evaluación

HISTORIAL RECIENTE
----------------------------------------------------------------------------
Últimas cinco solicitudes atendidas: ...
```

El programa deberá preservar el orden de llegada dentro de cada prioridad, conservar un historial limitado, agrupar información y generar parejas de revisión.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Elegir una colección especializada | 5 min |
| 2. Conteos y rankings con `Counter` | 8 min |
| 3. Agrupaciones con `defaultdict` | 8 min |
| 4. Colas e historiales con `deque` | 8 min |
| 5. Herramientas prácticas de `itertools` | 16 min |
| 6. Prácticas guiadas | 15 min |
| 7. Actividades obligatorias | 10 min |
| 8. Proyecto del módulo | 40 min |
| 9. Evaluación y cierre | 10 min |
| **Total** | **2 horas** |

Los recursos complementarios y los retos opcionales pueden ampliar el tiempo de estudio.

---

# 1. Elegir una colección especializada

## 1.1 La operación principal orienta la elección

No preguntes primero “¿qué estructura nueva puedo utilizar?”. Pregunta:

- ¿Qué operación se repite?
- ¿Cuál es el costo de escribirla manualmente?
- ¿La estructura especializada comunica mejor la intención?
- ¿Otra persona reconocerá fácilmente su comportamiento?

Ejemplos:

| Problema | Estructura apropiada |
|---|---|
| Conservar elementos en orden | `list` |
| Consultar un registro por clave | `dict` |
| Eliminar duplicados | `set` |
| Contar categorías | `Counter` |
| Agrupar registros por responsable | `defaultdict(list)` |
| Acumular totales por categoría | `defaultdict(int)` |
| Añadir y retirar por ambos extremos | `deque` |
| Conservar solo los últimos cinco eventos | `deque(maxlen=5)` |

## 1.2 Especializada no significa siempre mejor

Para tres elementos que solo se recorren una vez, una lista continúa siendo adecuada. Para un único acceso con valor predeterminado, `dict.get()` puede ser suficiente.

Evita introducir una estructura que:

- no simplifica la operación principal;
- obliga a convertir constantemente a otro tipo;
- oculta una regla de negocio;
- resulta más difícil de explicar que la solución común;
- se utiliza una sola vez sin beneficio apreciable.

## 1.3 Importaciones explícitas

```python
from collections import Counter, defaultdict, deque
from itertools import chain, combinations, groupby, islice, product
```

Importa únicamente lo que utilizas. Evita:

```python
from collections import *
```

Las importaciones con `*` dificultan saber de dónde procede cada nombre y pueden producir colisiones.

---

# 2. Conteos y rankings con `Counter`

## 2.1 Contar elementos

```python
from collections import Counter

categorias = [
    "acceso",
    "contenido",
    "acceso",
    "facturación",
    "acceso",
    "contenido",
]

conteo = Counter(categorias)
print(conteo)
```

Salida aproximada:

```text
Counter({'acceso': 3, 'contenido': 2, 'facturación': 1})
```

`Counter` es una subclase de `dict`. Sus claves son los elementos contados y sus valores son las frecuencias.

```python
print(conteo["acceso"])
print(conteo["desconocida"])
```

Una clave ausente devuelve `0` en lugar de generar `KeyError`. Eso es conveniente para conteos, pero no significa que la clave exista:

```python
print("desconocida" in conteo)
```

## 2.2 Normaliza antes de contar

```python
categorias = ["Acceso", "acceso", " ACCESO ", "Contenido"]

conteo = Counter(
    categoria.strip().casefold()
    for categoria in categorias
)
```

Si cuentas antes de normalizar, valores equivalentes aparecerán como categorías separadas.

## 2.3 Obtener los más frecuentes

```python
print(conteo.most_common())
print(conteo.most_common(2))
```

`most_common(2)` devuelve las dos parejas con mayor frecuencia:

```text
[('acceso', 3), ('contenido', 1)]
```

Si existe un empate, no debes inventar que una categoría es “más importante”. Puedes mostrar todas las empatadas:

```python
if conteo:
    frecuencia_maxima = max(conteo.values())
    categorias_lideres = sorted(
        categoria
        for categoria, frecuencia in conteo.items()
        if frecuencia == frecuencia_maxima
    )
else:
    categorias_lideres = []
```

## 2.4 Actualizar conteos

```python
conteo = Counter(["acceso", "contenido"])
conteo.update(["acceso", "facturación", "acceso"])

print(conteo)
```

`update()` suma frecuencias. No reemplaza el contador completo.

También acepta un mapeo de incrementos:

```python
conteo.update({"acceso": 2, "contenido": 1})
```

## 2.5 Restar y limpiar conteos

```python
disponibles = Counter({"licencia": 5, "cuenta": 3})
asignadas = Counter({"licencia": 2, "cuenta": 4})

resultado = disponibles - asignadas
print(resultado)
```

La operación `-` conserva únicamente conteos positivos. Si necesitas observar ceros o negativos, utiliza `subtract()` y revisa el resultado:

```python
disponibles.subtract(asignadas)
print(disponibles)
```

No utilices operaciones aritméticas sin decidir qué significa un conteo negativo en tu dominio.

## 2.6 Combinar contadores

```python
turno_manana = Counter({"acceso": 4, "contenido": 2})
turno_tarde = Counter({"acceso": 1, "facturación": 3})

total_dia = turno_manana + turno_tarde
print(total_dia)
```

Otras operaciones permiten intersección y unión de frecuencias, pero no deben confundirse con sumar. Consulta su significado antes de usarlas.

## 2.7 Recuperar elementos

```python
conteo = Counter({"urgente": 2, "normal": 3})
print(list(conteo.elements()))
```

`elements()` repite cada elemento según su frecuencia positiva. No representa necesariamente el orden original de llegada; utiliza una cola si ese orden importa.

---

# 3. Agrupaciones con `defaultdict`

## 3.1 El patrón de inicialización repetida

Con un diccionario común:

```python
por_responsable = {}

for solicitud in solicitudes:
    responsable = solicitud["responsable"]

    if responsable not in por_responsable:
        por_responsable[responsable] = []

    por_responsable[responsable].append(solicitud)
```

Con `defaultdict(list)`:

```python
from collections import defaultdict

por_responsable = defaultdict(list)

for solicitud in solicitudes:
    por_responsable[solicitud["responsable"]].append(solicitud)
```

`list` se entrega sin paréntesis porque es la fábrica que `defaultdict` llamará cuando falte una clave.

## 3.2 La fábrica predeterminada

```python
grupos = defaultdict(list)
totales = defaultdict(int)
etiquetas = defaultdict(set)
```

Comportamiento al acceder a una clave ausente:

| Fábrica | Valor creado |
|---|---|
| `list` | `[]` |
| `int` | `0` |
| `set` | `set()` |

Ejemplos:

```python
duracion_por_categoria = defaultdict(int)

for solicitud in solicitudes:
    categoria = solicitud["categoria"]
    duracion_por_categoria[categoria] += solicitud["minutos_estimados"]
```

```python
etiquetas_por_categoria = defaultdict(set)

for solicitud in solicitudes:
    etiquetas_por_categoria[solicitud["categoria"]].update(
        solicitud["etiquetas"]
    )
```

## 3.3 Diferencia frente a `dict.get()`

`get()` devuelve un valor, pero no lo inserta:

```python
datos = {}
lista = datos.get("acceso", [])
lista.append("SOP-001")

print(datos)
```

Salida:

```text
{}
```

Esto es un error común:

```python
datos.get("acceso", []).append("SOP-001")
```

La lista temporal se pierde. Para una consulta aislada, `get()` es apropiado. Para agrupar repetidamente, `defaultdict(list)` comunica mejor la intención.

## 3.4 Diferencia frente a `setdefault()`

```python
por_categoria = {}

for solicitud in solicitudes:
    categoria = solicitud["categoria"]
    por_categoria.setdefault(categoria, []).append(solicitud)
```

Esta solución es correcta. `defaultdict` suele ser más claro cuando toda la estructura comparte el mismo valor predeterminado. `setdefault()` puede ser conveniente para una operación localizada dentro de un diccionario común.

## 3.5 Leer una clave puede modificar el diccionario

```python
grupos = defaultdict(list)
print(grupos["inexistente"])
print(grupos)
```

El acceso mediante corchetes crea la clave:

```text
defaultdict(<class 'list'>, {'inexistente': []})
```

Si solo quieres comprobar, utiliza:

```python
if "inexistente" in grupos:
    ...
```

o:

```python
valor = grupos.get("inexistente")
```

## 3.6 Convertir para presentar o entregar

La representación de `defaultdict` incluye la fábrica. Si necesitas un diccionario común:

```python
resultado_final = dict(por_responsable)
```

Las listas y objetos internos continúan siendo los mismos. Esta conversión no crea una copia profunda.

## 3.7 Fábricas personalizadas

Una función puede crear estructuras más completas:

```python
def crear_resumen():
    return {
        "cantidad": 0,
        "minutos": 0,
        "identificadores": [],
    }


resumen_por_categoria = defaultdict(crear_resumen)

for solicitud in solicitudes:
    resumen = resumen_por_categoria[solicitud["categoria"]]
    resumen["cantidad"] += 1
    resumen["minutos"] += solicitud["minutos_estimados"]
    resumen["identificadores"].append(solicitud["id"])
```

Utiliza una fábrica personalizada solo cuando la estructura repetida lo justifique.

---

# 4. Colas e historiales con `deque`

## 4.1 Una lista puede funcionar como cola, pero tiene un costo

```python
cola = ["SOP-001", "SOP-002", "SOP-003"]
primero = cola.pop(0)
```

Al retirar el primer elemento, los restantes deben desplazarse. Para una cola con muchas operaciones en ambos extremos, utiliza `deque`:

```python
from collections import deque

cola = deque(["SOP-001", "SOP-002", "SOP-003"])
primero = cola.popleft()
```

## 4.2 Operaciones principales

```python
cola = deque()

cola.append("SOP-001")
cola.append("SOP-002")
cola.appendleft("SOP-URGENTE")

primero = cola.popleft()
ultimo = cola.pop()
```

| Operación | Efecto |
|---|---|
| `append(x)` | Añade a la derecha. |
| `appendleft(x)` | Añade a la izquierda. |
| `pop()` | Retira de la derecha. |
| `popleft()` | Retira de la izquierda. |

## 4.3 FIFO y LIFO

Cola FIFO: el primero en entrar es el primero en salir.

```python
cola.append(solicitud)
solicitud_actual = cola.popleft()
```

Pila LIFO: el último en entrar es el primero en salir.

```python
pila.append(accion)
ultima_accion = pila.pop()
```

La estructura no decide la política. La combinación de operaciones define el comportamiento.

## 4.4 Prioridad sin invertir el orden de llegada

Insertar cada urgente con `appendleft()` puede invertir el orden entre urgentes:

```python
cola.appendleft("URGENTE-1")
cola.appendleft("URGENTE-2")
```

El segundo quedará antes que el primero. Para preservar FIFO dentro de cada prioridad, utiliza colas separadas:

```python
colas = {
    "urgente": deque(),
    "alta": deque(),
    "normal": deque(),
}

for solicitud in solicitudes:
    colas[solicitud["prioridad"]].append(solicitud)
```

Para atender:

```python
if colas["urgente"]:
    siguiente = colas["urgente"].popleft()
elif colas["alta"]:
    siguiente = colas["alta"].popleft()
elif colas["normal"]:
    siguiente = colas["normal"].popleft()
else:
    siguiente = None
```

Una política que siempre atiende urgentes puede postergar indefinidamente solicitudes normales si continúan llegando urgentes. En un sistema real debes analizar reglas contra la inanición. El proyecto trabajará con un conjunto finito para concentrarse en las estructuras.

## 4.5 Historial limitado con `maxlen`

```python
historial = deque(maxlen=3)

historial.append("SOP-001")
historial.append("SOP-002")
historial.append("SOP-003")
historial.append("SOP-004")

print(historial)
```

Salida:

```text
deque(['SOP-002', 'SOP-003', 'SOP-004'], maxlen=3)
```

Al alcanzar el límite, añadir un elemento descarta automáticamente el más antiguo. Utilízalo solo cuando esa pérdida sea parte explícita del diseño.

## 4.6 Vista previa sin retirar

Puedes consultar el primer elemento:

```python
if cola:
    siguiente = cola[0]
```

Para obtener varios elementos sin retirar, `islice()` resulta útil:

```python
from itertools import islice

proximas_tres = list(islice(cola, 3))
```

Recorrer una `deque` mediante `islice()` no elimina elementos de la cola.

## 4.7 Rotación

```python
turnos = deque(["Ana", "Luis", "María"])
turnos.rotate(-1)
print(turnos)
```

Salida:

```text
deque(['Luis', 'María', 'Ana'])
```

`rotate()` puede apoyar una asignación circular, pero no reemplaza reglas más complejas de carga, disponibilidad o especialidad.

---

# 5. Herramientas prácticas de `itertools`

`itertools` reúne funciones que construyen iteradores eficientes. No necesitas memorizar todo el módulo. Aprende a reconocer los problemas que resuelven las herramientas más útiles.

## 5.1 `chain()` para recorrer fuentes consecutivas

```python
from itertools import chain

pendientes = ["SOP-001", "SOP-002"]
nuevas = ["SOP-003", "SOP-004"]

combinadas = chain(pendientes, nuevas)

for solicitud in combinadas:
    print(solicitud)
```

`chain()` recorre una fuente y después la siguiente sin crear primero una lista combinada.

Si necesitas procesar los datos varias veces, puedes materializarlos una vez:

```python
todas = list(chain(pendientes, nuevas))
```

No confundas esto con ordenar o mezclar. `chain()` conserva el orden de cada fuente y las coloca una después de otra.

### `chain.from_iterable()`

Cuando ya tienes una colección de colecciones:

```python
grupos = [
    ["SOP-001", "SOP-002"],
    ["SOP-003"],
    ["SOP-004", "SOP-005"],
]

todas = chain.from_iterable(grupos)
```

Esto evita tener que conocer cuántos grupos existen para pasarlos como argumentos separados.

## 5.2 `islice()` para limitar un iterable

```python
from itertools import islice

primeras_tres = list(islice(solicitudes, 3))
```

También acepta inicio, fin y paso de forma parecida a un segmento:

```python
seleccion = list(islice(solicitudes, 2, 8, 2))
```

La diferencia es que funciona con iteradores que no permiten índices.

`islice()` consume el iterador que recibe. Si se utiliza sobre una lista o una `deque`, la colección permanece; si se utiliza sobre un generador guardado, ese generador avanzará.

## 5.3 `product()` para combinaciones cartesianas

```python
from itertools import product

equipos = ["Soporte", "Contenido"]
turnos = ["mañana", "tarde"]

asignaciones = list(product(equipos, turnos))
print(asignaciones)
```

Salida:

```text
[
    ('Soporte', 'mañana'),
    ('Soporte', 'tarde'),
    ('Contenido', 'mañana'),
    ('Contenido', 'tarde'),
]
```

`product()` produce todas las parejas posibles tomando un elemento de cada colección. La cantidad de resultados crece multiplicando los tamaños. Antes de materializar, estima:

```python
cantidad = len(equipos) * len(turnos)
```

## 5.4 `combinations()` para grupos sin importar el orden

```python
from itertools import combinations

responsables = ["Ana", "Luis", "María", "Carlos"]
parejas = list(combinations(responsables, 2))
```

Cada pareja aparece una sola vez:

```text
('Ana', 'Luis')
('Ana', 'María')
('Ana', 'Carlos')
('Luis', 'María')
('Luis', 'Carlos')
('María', 'Carlos')
```

`('Ana', 'Luis')` y `('Luis', 'Ana')` representan el mismo grupo y no se repiten.

## 5.5 `permutations()` cuando el orden sí importa

```python
from itertools import permutations

pasos = ["validar", "aprobar", "publicar"]
ordenes = list(permutations(pasos, 3))
```

Las permutaciones crecen muy rápido. Tres elementos producen seis órdenes; diez elementos producen millones. No materialices resultados sin estimar su cantidad.

En procesos reales, la mayoría de los órdenes posibles pueden ser inválidos por dependencias. No utilices `permutations()` si las reglas ya determinan un orden.

## 5.6 Diferencia entre producto, combinaciones y permutaciones

| Necesidad | Herramienta |
|---|---|
| Elegir un elemento de cada colección | `product()` |
| Formar grupos donde el orden no importa | `combinations()` |
| Generar órdenes donde la posición importa | `permutations()` |

## 5.7 `groupby()` agrupa elementos consecutivos

```python
from itertools import groupby

solicitudes_ordenadas = sorted(
    solicitudes,
    key=lambda solicitud: solicitud["categoria"],
)

for categoria, grupo in groupby(
    solicitudes_ordenadas,
    key=lambda solicitud: solicitud["categoria"],
):
    elementos = list(grupo)
    print(categoria, len(elementos))
```

`groupby()` no reúne automáticamente todas las apariciones separadas. Agrupa elementos consecutivos con la misma clave.

Ejemplo incorrecto:

```python
categorias = ["acceso", "contenido", "acceso"]
```

Sin ordenar, `groupby()` produce tres grupos, no dos.

La regla segura es:

> Ordena por la misma clave que utilizarás para agrupar.

## 5.8 El grupo también es un iterador

```python
for categoria, grupo in groupby(datos, key=clave):
    print(list(grupo))
    print(list(grupo))
```

La segunda lista queda vacía porque el grupo ya fue consumido. Además, debes procesar el grupo dentro de la iteración principal. Si necesitas conservarlo, materialízalo una vez.

## 5.9 Herramientas que no necesitas todavía

`itertools` incluye `cycle()`, `repeat()`, `count()`, `tee()`, `takewhile()`, `dropwhile()` y otras funciones. Son útiles en contextos concretos, pero añadirlas sin práctica suficiente convertiría el módulo en un catálogo. Consulta la documentación cuando un problema real sugiera su necesidad.

## 5.10 Decide cuándo materializar

Materializa con `list()` cuando:

- necesitas recorrer varias veces;
- necesitas conocer todos los valores;
- necesitas ordenar;
- necesitas acceder por índice;
- necesitas entregar una estructura concreta.

Mantén el iterador cuando:

- lo consumirás una sola vez;
- una función puede consumirlo directamente;
- la cantidad de resultados puede ser grande;
- producir cada valor bajo demanda es suficiente.

---

# 6. Prácticas guiadas

## Práctica guiada 1 — Ranking de categorías

```python
categorias = [
    "Acceso", "contenido", " ACCESO ", "facturación",
    "Contenido", "acceso", "cuenta", "CONTENIDO",
]
```

Debes:

1. Normalizar antes de contar.
2. Crear un `Counter`.
3. Mostrar todas las frecuencias ordenadas.
4. Mostrar las dos categorías más frecuentes.
5. Detectar todos los líderes si existe empate.

## Práctica guiada 2 — Agrupar por responsable

```python
solicitudes = [
    {"id": "SOP-001", "responsable": "Ana", "minutos": 20},
    {"id": "SOP-002", "responsable": "Luis", "minutos": 35},
    {"id": "SOP-003", "responsable": "Ana", "minutos": 15},
    {"id": "SOP-004", "responsable": "María", "minutos": 40},
]
```

Utiliza `defaultdict` para crear:

- solicitudes por responsable;
- minutos totales por responsable;
- identificadores únicos por responsable.

Convierte los resultados a diccionarios comunes antes de mostrarlos.

## Práctica guiada 3 — Colas por prioridad

```python
entradas = [
    ("SOP-001", "normal"),
    ("SOP-002", "urgente"),
    ("SOP-003", "alta"),
    ("SOP-004", "urgente"),
    ("SOP-005", "normal"),
]
```

Crea tres `deque`, atiende primero urgentes, después altas y finalmente normales. Comprueba que `SOP-002` se atienda antes que `SOP-004`.

Conserva un historial con `maxlen=3` y muestra su contenido al terminar.

## Práctica guiada 4 — Vista previa y fuentes combinadas

```python
pendientes = ["SOP-001", "SOP-002", "SOP-003"]
nuevas = ["SOP-004", "SOP-005"]
```

Utiliza `chain()` para recorrer ambas fuentes y `islice()` para obtener una vista previa de las primeras cuatro. Explica por qué debes materializar una vez si utilizarás la colección combinada para más de un análisis.

## Práctica guiada 5 — Parejas y agrupaciones

Con responsables `Ana`, `Luis`, `María` y `Carlos`:

1. Genera todas las parejas de revisión sin repetir el orden.
2. Combina cada responsable con los turnos `mañana` y `tarde`.
3. Agrupa una lista de solicitudes por categoría utilizando `groupby()`.
4. Demuestra qué ocurre si omites el ordenamiento previo.

---

# 7. Actividades obligatorias

## Actividad 1 — Refactorizar un conteo y una agrupación

Recibe una colección de registros con `categoria` y `responsable`. Escribe primero una solución con diccionarios comunes y luego refactoriza:

- el conteo con `Counter`;
- la agrupación con `defaultdict(list)`.

Compara ambas versiones y explica qué código auxiliar desaparece. No afirmes que la versión especializada es mejor solo por ser más corta.

## Actividad 2 — Corregir una cola que invierte urgentes

Analiza:

```python
cola = deque()

for solicitud in solicitudes:
    if solicitud["prioridad"] == "urgente":
        cola.appendleft(solicitud)
    else:
        cola.append(solicitud)
```

Debes:

1. Demostrar con dos urgentes que el orden se invierte.
2. Implementar colas separadas por prioridad.
3. Preservar FIFO dentro de cada prioridad.
4. Crear una vista previa de tres elementos sin retirarlos.
5. Explicar una limitación de priorizar siempre lo urgente.

## Actividad 3 — Diagnosticar `groupby()`

```python
categorias = ["acceso", "contenido", "acceso", "facturación", "contenido"]
```

Agrupa directamente y registra el resultado. Después ordena por la misma clave, vuelve a agrupar y explica por qué cambió la cantidad de grupos. Incluye una comprobación que materialice cada grupo exactamente una vez.

---

# 8. Proyecto del módulo — Centro de análisis y cola de atención

## Desafío

COA necesita analizar solicitudes de soporte que proceden de dos fuentes: casos pendientes y solicitudes nuevas. El sistema debe producir estadísticas, organizar los casos por responsable, crear colas por prioridad y simular la atención sin perder el orden de llegada dentro de cada nivel.

El programa también deberá conservar únicamente las últimas cinco solicitudes atendidas, crear parejas de revisión y generar un resumen agrupado por categoría.

No utilizarás archivos, bases de datos ni librerías externas. Los datos estarán en un módulo de Python.

## Datos de trabajo

```python
SOLICITUDES_PENDIENTES = [
    {
        "id": "SOP-001",
        "titulo": "Video de una lección no carga",
        "categoria": "contenido",
        "prioridad": "normal",
        "responsable": "Ana",
        "etiquetas": ["curso", "video"],
        "minutos_estimados": 25,
    },
    {
        "id": "SOP-002",
        "titulo": "Factura con datos incorrectos",
        "categoria": "facturación",
        "prioridad": "alta",
        "responsable": "Luis",
        "etiquetas": ["pago", "factura"],
        "minutos_estimados": 20,
    },
    {
        "id": "SOP-003",
        "titulo": "No puedo cambiar mi nombre",
        "categoria": "cuenta",
        "prioridad": "normal",
        "responsable": "María",
        "etiquetas": ["perfil", "datos"],
        "minutos_estimados": 15,
    },
    {
        "id": "SOP-004",
        "titulo": "Error al iniciar sesión",
        "categoria": "acceso",
        "prioridad": "urgente",
        "responsable": "Carlos",
        "etiquetas": ["inicio de sesión", "bloqueo"],
        "minutos_estimados": 10,
    },
    {
        "id": "SOP-005",
        "titulo": "Ejercicio marcado como incompleto",
        "categoria": "contenido",
        "prioridad": "alta",
        "responsable": "Ana",
        "etiquetas": ["curso", "ejercicio"],
        "minutos_estimados": 30,
    },
    {
        "id": "SOP-006",
        "titulo": "No aparece el certificado",
        "categoria": "certificado",
        "prioridad": "normal",
        "responsable": "Luis",
        "etiquetas": ["certificado", "finalización"],
        "minutos_estimados": 20,
    },
]

SOLICITUDES_NUEVAS = [
    {
        "id": "SOP-007",
        "titulo": "Correo de recuperación no llega",
        "categoria": "acceso",
        "prioridad": "normal",
        "responsable": "María",
        "etiquetas": ["correo", "recuperación"],
        "minutos_estimados": 15,
    },
    {
        "id": "SOP-008",
        "titulo": "La página se cierra inesperadamente",
        "categoria": "técnico",
        "prioridad": "alta",
        "responsable": "Carlos",
        "etiquetas": ["navegador", "error"],
        "minutos_estimados": 35,
    },
    {
        "id": "SOP-009",
        "titulo": "Certificado muestra un curso incompleto",
        "categoria": "certificado",
        "prioridad": "alta",
        "responsable": "Ana",
        "etiquetas": ["certificado", "curso"],
        "minutos_estimados": 25,
    },
    {
        "id": "SOP-010",
        "titulo": "Texto de una lección está cortado",
        "categoria": "contenido",
        "prioridad": "normal",
        "responsable": "Luis",
        "etiquetas": ["curso", "texto"],
        "minutos_estimados": 15,
    },
    {
        "id": "SOP-011",
        "titulo": "Cobro duplicado",
        "categoria": "facturación",
        "prioridad": "urgente",
        "responsable": "María",
        "etiquetas": ["pago", "duplicado"],
        "minutos_estimados": 20,
    },
    {
        "id": "SOP-012",
        "titulo": "El editor no guarda el progreso",
        "categoria": "técnico",
        "prioridad": "normal",
        "responsable": "Carlos",
        "etiquetas": ["editor", "progreso"],
        "minutos_estimados": 30,
    },
    {
        "id": "SOP-013",
        "titulo": "Cuenta bloqueada antes de evaluación",
        "categoria": "acceso",
        "prioridad": "urgente",
        "responsable": "Ana",
        "etiquetas": ["bloqueo", "evaluación"],
        "minutos_estimados": 10,
    },
    {
        "id": "SOP-014",
        "titulo": "Preferencias de cuenta no se actualizan",
        "categoria": "cuenta",
        "prioridad": "normal",
        "responsable": "Carlos",
        "etiquetas": ["perfil", "preferencias"],
        "minutos_estimados": 20,
    },
]

RESPONSABLES = ["Ana", "Luis", "María", "Carlos"]
TURNOS = ["mañana", "tarde"]
```

## Reglas del proyecto

1. Combina las dos fuentes conservando primero los pendientes y después los nuevos.
2. Materializa la combinación una sola vez porque será utilizada en varios análisis.
3. Normaliza categorías, prioridades y etiquetas antes de contarlas.
4. Las prioridades admitidas son `urgente`, `alta` y `normal`.
5. La atención debe respetar ese orden de prioridad.
6. Dentro de cada prioridad se conserva FIFO.
7. El historial conserva únicamente las últimas cinco solicitudes atendidas.
8. Los datos originales no deben modificarse.
9. Los grupos creados con `groupby()` deben ordenarse previamente por la misma clave.

## Requisitos funcionales

El programa deberá:

1. Combinar las fuentes mediante `chain()`.
2. Calcular solicitudes por categoría, prioridad y responsable con `Counter`.
3. Crear un ranking de las tres categorías más frecuentes.
4. Detectar todos los líderes si existe empate en el primer lugar.
5. Contar etiquetas a partir de todas las listas internas.
6. Agrupar solicitudes por responsable mediante `defaultdict(list)`.
7. Agrupar solicitudes por categoría.
8. Acumular minutos estimados por responsable con `defaultdict(int)`.
9. Construir tres colas `deque`, una por prioridad.
10. Crear una vista previa global de las próximas tres solicitudes sin retirarlas.
11. Simular la atención de todas las solicitudes.
12. Preservar FIFO dentro de cada prioridad.
13. Mantener un historial `deque(maxlen=5)`.
14. Mostrar el orden completo de atención.
15. Crear todas las parejas de responsables mediante `combinations()`.
16. Crear la matriz responsable-turno mediante `product()`.
17. Agrupar solicitudes por categoría mediante `groupby()`.
18. Generar un reporte con estadísticas, grupos, vista previa, orden de atención e historial.

## Herramientas obligatorias

- `Counter` y `most_common()`;
- `Counter.update()` en un conteo útil;
- `defaultdict(list)`;
- `defaultdict(int)`;
- `deque`;
- `deque(maxlen=5)`;
- `chain()` o `chain.from_iterable()`;
- `islice()`;
- `combinations()`;
- `product()`;
- `groupby()` después de `sorted()`;
- `enumerate()` para numerar el reporte;
- al menos una comprensión o expresión generadora del Módulo 2.

## Estructura de funciones recomendada

```python
def combinar_solicitudes(pendientes, nuevas):
    ...


def crear_conteos(solicitudes):
    ...


def contar_etiquetas(solicitudes):
    ...


def crear_agrupaciones(solicitudes):
    ...


def crear_colas(solicitudes):
    ...


def obtener_vista_previa(colas, cantidad=3):
    ...


def extraer_siguiente(colas):
    ...


def simular_atencion(colas, limite_historial=5):
    ...


def agrupar_con_groupby(solicitudes):
    ...


def crear_parejas_revision(responsables):
    ...


def crear_matriz_turnos(responsables, turnos):
    ...


def mostrar_reporte(resultado):
    ...


def main():
    ...


if __name__ == "__main__":
    main()
```

## Flujo recomendado

### Fase 1. Combina y conserva

```python
solicitudes = list(chain(SOLICITUDES_PENDIENTES, SOLICITUDES_NUEVAS))
```

Comprueba que la lista contiene 14 solicitudes y que las fuentes originales no cambiaron.

### Fase 2. Analiza frecuencias

Crea contadores separados para categorías, prioridades y responsables. Para etiquetas, puedes actualizar un contador mientras recorres las solicitudes o encadenar las listas internas.

### Fase 3. Agrupa

Construye agrupaciones y acumulaciones mediante `defaultdict`. Convierte a `dict` únicamente al preparar la salida si lo necesitas.

### Fase 4. Prepara las colas

Crea una `deque` por prioridad y añade cada solicitud con `append()`. No utilices `appendleft()` para urgentes.

### Fase 5. Obtén una vista previa

La vista previa global debe observar primero urgentes, luego altas y normales:

```python
orden_global = chain(
    colas["urgente"],
    colas["alta"],
    colas["normal"],
)
vista_previa = list(islice(orden_global, cantidad))
```

Este recorrido no retira elementos de las colas.

### Fase 6. Simula la atención

Retira mediante `popleft()` de la primera cola no vacía según el orden de prioridad. Añade cada solicitud al historial limitado y a una lista completa de atención.

### Fase 7. Crea combinaciones

Genera parejas de revisión sin invertir el orden y todas las asignaciones responsable-turno.

### Fase 8. Agrupa con `groupby()`

Ordena por categoría y materializa cada grupo una sola vez dentro del ciclo.

### Fase 9. Presenta y prueba

Muestra todos los resultados sin recalcular o consumir iteradores ya agotados.

## Formato mínimo del reporte

```text
CENTRO DE SOLICITUDES
================================================================================
Solicitudes recibidas:        14
Urgentes:                     ...
Altas:                        ...
Normales:                     ...
Categorías líderes:           ...
Responsable con más casos:    ...
Minutos estimados totales:    ...

RANKING DE CATEGORÍAS
--------------------------------------------------------------------------------
1. acceso          ...
2. contenido       ...
3. ...             ...

PRÓXIMAS SOLICITUDES
--------------------------------------------------------------------------------
1. SOP-004 | urgente | Error al iniciar sesión
2. SOP-011 | urgente | Cobro duplicado
3. SOP-013 | urgente | Cuenta bloqueada antes de evaluación

ORDEN DE ATENCIÓN
--------------------------------------------------------------------------------
1. SOP-004 | urgente | Carlos
2. SOP-011 | urgente | María
3. SOP-013 | urgente | Ana
...

HISTORIAL RECIENTE
--------------------------------------------------------------------------------
Últimas cinco solicitudes atendidas: ...

PAREJAS DE REVISIÓN
--------------------------------------------------------------------------------
Ana + Luis
Ana + María
...
```

El programa debe calcular todos los valores. La vista previa anterior permite comprobar que el orden entre urgentes respeta su llegada a las fuentes combinadas.

## Plan de pruebas obligatorio

| Caso | Preparación | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| Fuentes originales | Datos proporcionados | 14 solicitudes combinadas | |
| Frecuencia | Contar categorías | Ranking correcto | |
| FIFO urgente | `SOP-004`, `SOP-011`, `SOP-013` | Se conserva ese orden | |
| Vista previa | Obtener tres próximas | Las colas no cambian | |
| Historial limitado | Atender las 14 | Solo quedan las últimas 5 | |
| Parejas | 4 responsables | 6 parejas únicas | |
| Matriz | 4 responsables y 2 turnos | 8 asignaciones | |
| `groupby()` | Ordenar por categoría | Un grupo por categoría | |
| Colección vacía | Sin solicitudes | Reporte vacío sin error | |

Añade tres casos propios: empate en la categoría más frecuente, una sola prioridad con datos y un historial con menos de cinco atenciones.

## Buenas prácticas obligatorias

- Normaliza antes de contar o agrupar.
- No accedas a una clave ausente de `defaultdict` solo para comprobarla.
- No uses `appendleft()` para cada urgente si necesitas preservar FIFO.
- No dependas de `Counter.elements()` para reconstruir el orden original.
- No consumas dos veces un iterador o grupo.
- Ordena por la misma clave antes de `groupby()`.
- Estima la cantidad de resultados antes de materializar productos o permutaciones.
- No utilices `list.pop(0)` como operación principal de una cola.
- Conserva las fuentes originales.

## Entregables

```text
python-practico_modulo-03_nombre-apellido/
├── centro_solicitudes.py
├── datos_solicitudes.py
├── README.md
└── evidencia/
    ├── reporte_terminal.txt o captura_reporte.png
    └── plan_pruebas.md
```

El `README.md` debe explicar:

- versión de Python y comando de ejecución;
- por qué `Counter` es apropiado para frecuencias;
- por qué se eligió `defaultdict` para agrupaciones;
- cómo se preserva FIFO dentro de cada prioridad;
- por qué se materializó el resultado de `chain()`;
- diferencia entre `combinations()` y `product()`;
- requisito de ordenamiento de `groupby()`;
- una situación donde una lista o un diccionario común sería suficiente.

## Preguntas de reflexión

1. ¿Qué código auxiliar eliminó `Counter`?
2. ¿Qué efecto secundario puede producir leer una clave ausente de `defaultdict` con corchetes?
3. ¿Por qué no se añaden urgentes siempre con `appendleft()`?
4. ¿Qué información descarta un historial con `maxlen=5`?
5. ¿Qué ocurriría si se utiliza `groupby()` sin ordenar?

## Punto de entrega obligatorio

Realiza **una sola entrega para todo el módulo**.

```text
Curso: Python Práctico
Módulo: 3 — Colecciones especializadas e iteradores
Estudiante: nombre completo
Versión: primera entrega o corrección número X
Archivo principal: centro_solicitudes.py
Versión de Python: número utilizado
```

[Entregar el Módulo 3](https://forms.gle/nTx97JRkFkbH5Vfr6)

## Condición de avance

Para continuar al Módulo 4 necesitas:

- obtener al menos 70% en la evaluación;
- completar las actividades obligatorias;
- obtener `Aprobado` en el proyecto;
- corregir cualquier requisito crítico señalado.

---

# 9. Rúbrica de evaluación del proyecto

| Criterio | Ponderación | Desempeño esperado |
|---|---:|---|
| Funcionalidad | 35% | Combina, analiza, agrupa, prioriza, atiende y presenta correctamente. |
| Herramientas del módulo | 25% | Utiliza `collections` e `itertools` de acuerdo con el problema. |
| Claridad y organización | 20% | Mantiene funciones enfocadas, políticas explícitas e iteradores controlados. |
| Robustez | 10% | Maneja colecciones vacías, empates, historiales cortos y orden de prioridad. |
| Documentación y evidencia | 10% | Incluye README, pruebas, resultados y reflexión. |
| **Total** | **100%** | |

## Escala de interpretación

| Resultado | Condición |
|---|---|
| 90–100 | Dominio sobresaliente |
| 80–89 | Dominio sólido |
| 70–79 | Dominio suficiente |
| Menos de 70 | Pendiente de corrección |

## Requisitos críticos

El proyecto no puede aprobarse si:

- el programa no se ejecuta;
- altera las fuentes originales;
- invierte el orden de solicitudes dentro de una prioridad;
- mezcla prioridades sin aplicar la política definida;
- `groupby()` produce grupos incorrectos por no ordenar;
- consume un iterador antes de generar un resultado requerido;
- no conserva únicamente las últimas cinco atenciones;
- omite herramientas obligatorias;
- faltan archivos de entrega;
- el estudiante no puede explicar el código.

---

# 10. Evaluación del módulo

Responde primero sin ejecutar el código. Después comprueba tus respuestas.

## Pregunta 1

¿Qué devuelve un `Counter` cuando se consulta una clave ausente con corchetes?

A. `None`  
B. `0`  
C. `KeyError`  
D. Una lista vacía

## Pregunta 2

¿Qué hace `most_common(2)`?

A. Elimina los dos valores menos frecuentes.  
B. Devuelve los dos elementos con mayor frecuencia y sus conteos.  
C. Ordena alfabéticamente todas las claves.  
D. Devuelve únicamente dos números.

## Pregunta 3

¿Qué crea `defaultdict(list)` cuando se accede con corchetes a una clave ausente?

A. `None`  
B. `0`  
C. Una lista vacía insertada en el diccionario.  
D. Un conjunto vacío sin insertarlo.

## Pregunta 4

¿Por qué `datos.get("clave", []).append(valor)` suele ser incorrecto para agrupar?

A. `get()` no acepta listas.  
B. Si la clave falta, se modifica una lista temporal que no se guarda.  
C. `append()` elimina el diccionario.  
D. Solo funciona con números.

## Pregunta 5

¿Qué combinación implementa una cola FIFO con `deque`?

A. `append()` y `popleft()`  
B. `append()` y `pop()`  
C. `appendleft()` y `popleft()`  
D. `rotate()` y `pop()`

## Pregunta 6

¿Qué ocurre cuando una `deque(maxlen=3)` llena recibe un cuarto elemento con `append()`?

A. Genera un error.  
B. Aumenta automáticamente su límite.  
C. Descarta el elemento más antiguo del extremo izquierdo.  
D. Descarta el nuevo elemento.

## Pregunta 7

¿Qué herramienta forma todas las parejas únicas donde el orden no importa?

A. `product()`  
B. `permutations()`  
C. `combinations()`  
D. `chain()`

## Pregunta 8

¿Qué hace `chain(fuente_a, fuente_b)`?

A. Ordena ambas fuentes.  
B. Recorre primero una fuente y después la otra.  
C. Elimina duplicados.  
D. Agrupa por una clave.

## Pregunta 9

¿Cuál es el requisito esencial antes de utilizar `groupby()` para reunir todas las categorías iguales?

A. Convertir los datos en conjunto.  
B. Invertir la colección.  
C. Ordenar por la misma clave utilizada para agrupar.  
D. Utilizar `Counter` primero.

## Pregunta 10

¿Qué afirmación sobre un grupo devuelto por `groupby()` es correcta?

A. Es un iterador y puede consumirse.  
B. Siempre es una lista.  
C. Puede recorrerse infinitas veces.  
D. Modifica automáticamente la colección original.

## Criterio de aprobación

Necesitas al menos 7 respuestas correctas. Si no alcanzas el resultado, vuelve a ejecutar las prácticas de agrupación, colas e iteradores antes de intentarlo nuevamente.

---

# 11. Soluciones de las prácticas guiadas

Consulta estas soluciones únicamente después de completar tu intento.

## Solución 1

```python
from collections import Counter

categorias = [
    "Acceso", "contenido", " ACCESO ", "facturación",
    "Contenido", "acceso", "cuenta", "CONTENIDO",
]

conteo = Counter(
    categoria.strip().casefold()
    for categoria in categorias
)
ranking = conteo.most_common()
dos_primeras = conteo.most_common(2)

if conteo:
    frecuencia_maxima = max(conteo.values())
    lideres = sorted(
        categoria
        for categoria, frecuencia in conteo.items()
        if frecuencia == frecuencia_maxima
    )
else:
    lideres = []
```

## Solución 2

```python
from collections import defaultdict

por_responsable = defaultdict(list)
minutos_por_responsable = defaultdict(int)
ids_por_responsable = defaultdict(set)

for solicitud in solicitudes:
    responsable = solicitud["responsable"]
    por_responsable[responsable].append(solicitud)
    minutos_por_responsable[responsable] += solicitud["minutos"]
    ids_por_responsable[responsable].add(solicitud["id"])

por_responsable = dict(por_responsable)
minutos_por_responsable = dict(minutos_por_responsable)
ids_por_responsable = dict(ids_por_responsable)
```

## Solución 3

```python
from collections import deque

colas = {
    "urgente": deque(),
    "alta": deque(),
    "normal": deque(),
}
historial = deque(maxlen=3)
orden = []

for identificador, prioridad in entradas:
    colas[prioridad].append(identificador)

for prioridad in ("urgente", "alta", "normal"):
    while colas[prioridad]:
        actual = colas[prioridad].popleft()
        orden.append(actual)
        historial.append(actual)
```

La solución conserva FIFO dentro de cada `deque`.

## Solución 4

```python
from itertools import chain, islice

combinadas = list(chain(pendientes, nuevas))
vista_previa = list(islice(combinadas, 4))
```

Se materializa una vez porque la colección combinada será recorrida para la vista previa y otros análisis.

## Solución 5

```python
from itertools import combinations, groupby, product

responsables = ["Ana", "Luis", "María", "Carlos"]
turnos = ["mañana", "tarde"]

parejas = list(combinations(responsables, 2))
asignaciones = list(product(responsables, turnos))

solicitudes_ordenadas = sorted(
    solicitudes,
    key=lambda solicitud: solicitud["categoria"],
)

grupos = {}

for categoria, grupo in groupby(
    solicitudes_ordenadas,
    key=lambda solicitud: solicitud["categoria"],
):
    grupos[categoria] = list(grupo)
```

Sin el ordenamiento, categorías iguales separadas producen grupos diferentes.

---

# 12. Retos adicionales

## Reto 1 — Asignación circular

Utiliza una `deque` de responsables y `rotate(-1)` para asignar nuevas solicitudes por turnos. Explica por qué esta regla no considera especialidad ni carga real.

## Reto 2 — Ventana de actividad

Conserva los últimos cinco tiempos de atención en una `deque(maxlen=5)` y calcula su promedio después de cada caso.

## Reto 3 — Subconjuntos de revisión

Genera grupos de tres responsables con `combinations()`. Calcula primero cuántos grupos se producirán y evita materializar si la lista de responsables crece demasiado.

## Reto 4 — Comparar agrupaciones

Resuelve el resumen por categoría con `defaultdict` y con `groupby()`. Explica cuál elegirías si los datos ya están ordenados y cuál si llegan desordenados continuamente.

## Reto 5 — Política contra inanición

Diseña una regla donde, después de atender tres urgentes consecutivas, se atienda una solicitud alta o normal si existe. Conserva FIFO dentro de cada cola.

---

# 13. Videos recomendados

Ejecuta los ejemplos y adapta al menos uno al proyecto.

- [`Counter` del módulo `collections` — The Dojo MX](https://www.youtube.com/watch?v=_a_q6QAY62Y)
- [`defaultdict` del módulo `collections` — The Dojo MX](https://www.youtube.com/watch?v=DrhHkPI7spU)
- [Procesar recorridos con `itertools` — Juan Bosh García](https://www.youtube.com/watch?v=DoPChNy4NIc)

## Reproductores de video

[Counter del módulo collections — The Dojo MX](https://www.youtube.com/watch?v=_a_q6QAY62Y)

[defaultdict del módulo collections — The Dojo MX](https://www.youtube.com/watch?v=DrhHkPI7spU)

[Procesar recorridos con itertools — Juan Bosh García](https://www.youtube.com/watch?v=DoPChNy4NIc)

Para `deque`, utiliza la documentación oficial y reproduce las operaciones con una cola pequeña antes de integrarlas.

---

# 14. Documentación y recursos de lectura

## Nivel esencial

- [`collections`: contenedores especializados](https://docs.python.org/3/library/collections.html)
- [`Counter`](https://docs.python.org/3/library/collections.html#collections.Counter)
- [`defaultdict`](https://docs.python.org/3/library/collections.html#collections.defaultdict)
- [`deque`](https://docs.python.org/3/library/collections.html#collections.deque)

## Iteradores

- [`itertools`: funciones para crear iteradores](https://docs.python.org/3/library/itertools.html)
- [Recetas de `itertools`](https://docs.python.org/3/library/itertools.html#itertools-recipes)
- [Guía oficial de programación funcional](https://docs.python.org/3/howto/functional.html)

## Lectura gratuita

- [Guía del módulo `collections` — Real Python](https://realpython.com/python-collections-module/)
- [Python Tutor: ejecución paso a paso](https://pythontutor.com/python.html)

## Práctica de documentación

Busca `deque` y responde:

1. ¿Qué complejidad aproximada tienen `append()` y `popleft()`?
2. ¿Qué ocurre al añadir a una `deque` llena con `maxlen`?
3. ¿Qué diferencia existe entre `extend()` y `extendleft()`?
4. ¿Qué signo de `rotate()` mueve elementos hacia la izquierda?
5. ¿Qué operaciones de lista no son la fortaleza principal de `deque`?

---

# 15. Material descargable

El módulo incluye:

- `datos_solicitudes.py`: fuentes, responsables y turnos.
- `plantilla_proyecto.py`: estructura funcional sin solución.
- `GUIA_COLECCIONES_ITERTOOLS.md`: mapa de decisión y advertencias.
- `CHECKLIST_PROYECTO.md`: comprobación previa a la entrega.

`raise NotImplementedError` funciona únicamente como marcador en la plantilla. Sustituye cada marcador antes de ejecutar el proyecto completo.

## Descargas

[Descargar todos los materiales del Módulo 3](/downloads/python-practico/modulo-3/python-practico-modulo-3-materiales.zip)

[Descargar datos_solicitudes.py](/downloads/python-practico/modulo-3/datos_solicitudes.py)

[Descargar plantilla_proyecto.py](/downloads/python-practico/modulo-3/plantilla_proyecto.py)

[Descargar GUIA_COLECCIONES_ITERTOOLS.md](/downloads/python-practico/modulo-3/GUIA_COLECCIONES_ITERTOOLS.md)

[Descargar CHECKLIST_PROYECTO.md](/downloads/python-practico/modulo-3/CHECKLIST_PROYECTO.md)

---

# 16. Errores comunes

## Contar antes de normalizar

`"Acceso"`, `"acceso"` y `" ACCESO "` se convierten en claves diferentes si no se normalizan.

## Suponer que `most_common(1)` resuelve empates

Devuelve un elemento, aunque varias claves compartan la frecuencia máxima. Detecta líderes si el empate importa.

## Confundir `Counter.update()` con reemplazo

`update()` suma frecuencias a las existentes.

## Utilizar `Counter.elements()` como historial

Reconstruye repeticiones positivas, no el orden de llegada original.

## Pasar `list()` en lugar de `list` a `defaultdict`

```python
defaultdict(list)    # correcto
defaultdict(list())  # incorrecto
```

La fábrica debe ser invocable.

## Crear claves al consultar

`grupos["ausente"]` crea una clave en `defaultdict`. Utiliza `in` o `get()` si solo necesitas comprobar.

## Perder una lista temporal con `get()`

`datos.get(clave, []).append(valor)` no guarda la lista cuando la clave falta.

## Utilizar `pop(0)` repetidamente

Para una cola con muchas retiradas al inicio, utiliza `deque.popleft()`.

## Invertir urgentes con `appendleft()`

Cada nueva inserción queda antes de las urgentes anteriores. Utiliza colas separadas si necesitas FIFO por prioridad.

## Olvidar la pérdida automática de `maxlen`

El elemento más antiguo se descarta sin confirmación cuando la `deque` está llena.

## Consumir un iterador dos veces

`chain()`, `islice()` y los grupos de `groupby()` producen iteradores consumibles.

## Utilizar `groupby()` sin ordenar

Solo agrupa coincidencias consecutivas. Ordena por la misma clave.

## Confundir combinaciones con permutaciones

En combinaciones el orden no crea un grupo nuevo; en permutaciones sí.

## Materializar un producto enorme

Estima el número de resultados antes de llamar a `list()`.

---

# 17. Glosario

| Término | Significado |
|---|---|
| Colección especializada | Estructura diseñada para operaciones frecuentes concretas. |
| `Counter` | Diccionario especializado en frecuencias. |
| Frecuencia | Cantidad de apariciones de un elemento. |
| `defaultdict` | Diccionario que crea valores mediante una fábrica para claves ausentes. |
| Fábrica | Función o tipo invocable que produce el valor predeterminado. |
| `deque` | Cola de doble extremo con operaciones eficientes en ambos lados. |
| FIFO | Primero en entrar, primero en salir. |
| LIFO | Último en entrar, primero en salir. |
| `maxlen` | Longitud máxima de una `deque`. |
| Inanición | Espera indefinida de elementos de baja prioridad. |
| Iterador | Objeto que produce valores secuencialmente y puede agotarse. |
| `chain()` | Iterador que recorre varias fuentes consecutivamente. |
| `islice()` | Herramienta que selecciona una parte de un iterable. |
| Producto cartesiano | Conjunto de combinaciones tomando un elemento de cada colección. |
| Combinación | Grupo donde el orden no crea un resultado distinto. |
| Permutación | Orden posible donde la posición sí importa. |
| `groupby()` | Herramienta que agrupa elementos consecutivos con la misma clave. |
| Materializar | Convertir un recorrido en una colección almacenada. |

---

# 18. Resumen del módulo

Aprendiste que una colección especializada resulta útil cuando su operación central coincide con el problema:

- `Counter` elimina código auxiliar de conteo y facilita rankings;
- `defaultdict` simplifica agrupaciones y acumulaciones;
- `deque` permite colas, pilas e historiales limitados;
- `itertools` permite encadenar, limitar, combinar y agrupar recorridos.

También identificaste los riesgos: contar datos sin normalizar, crear claves accidentalmente, invertir una prioridad, perder historial por `maxlen`, consumir iteradores y utilizar `groupby()` sin ordenar.

## Habilidades obtenidas

- Conteo y ranking de datos.
- Agrupación y acumulación por claves.
- Diseño de colas FIFO con prioridades.
- Conservación de ventanas e historiales limitados.
- Combinación eficiente de fuentes.
- Formación de parejas y matrices de posibilidades.
- Agrupación correcta de datos ordenados.
- Selección razonada de estructuras especializadas.

## Antes de continuar

- [ ] Puedo explicar cuándo `Counter` aporta valor.
- [ ] Sé agrupar con `defaultdict(list)`.
- [ ] Comprendo cuándo una lectura crea una clave.
- [ ] Puedo implementar FIFO con `deque`.
- [ ] Sé preservar el orden dentro de prioridades.
- [ ] Comprendo la pérdida automática de `maxlen`.
- [ ] Puedo utilizar `chain()` e `islice()` sin consumir resultados necesarios.
- [ ] Distingo producto, combinación y permutación.
- [ ] Sé ordenar antes de `groupby()`.
- [ ] Completé las actividades obligatorias.
- [ ] Obtuve al menos 70% en la evaluación.
- [ ] El proyecto fue aprobado.

Cuando cumplas estas condiciones, estarás preparado para el **Módulo 4: Archivos y rutas con la biblioteca estándar**.
