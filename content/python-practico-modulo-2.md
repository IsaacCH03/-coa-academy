# COA — Cursos Online Avanzados

## Python Práctico

# Módulo 2. Iteración y transformación expresiva

**Duración aproximada:** 2 horas y 15 minutos  
**Modalidad:** práctica guiada, actividades obligatorias, proyecto y evaluación  
**Nivel:** intermedio  
**Tecnologías:** Python y biblioteca estándar  
**Resultado principal:** un analizador de inventario y pedidos

---

## Bienvenida

En Python casi todos los programas recorren colecciones: productos, estudiantes, tareas, pedidos, archivos o resultados. Saber utilizar un ciclo `for` es suficiente para resolver muchos problemas, pero no siempre produce la solución más clara.

Observa este recorrido:

```python
posicion = 1

for producto in productos:
    print(posicion, producto)
    posicion += 1
```

Python ya incluye una herramienta que expresa directamente la intención:

```python
for posicion, producto in enumerate(productos, start=1):
    print(posicion, producto)
```

La segunda solución no es mejor simplemente porque tenga menos líneas. Es mejor porque evita administrar manualmente un contador y comunica que cada elemento necesita una posición.

En este módulo aprenderás a reconocer patrones parecidos:

```text
Necesito posiciones                 → enumerate()
Necesito recorrer datos paralelos  → zip()
Necesito transformar una colección → comprensión
Necesito sumar sin crear una lista → expresión generadora
Necesito ordenar por una regla     → sorted(..., key=...)
Necesito una función muy breve     → lambda, si sigue siendo legible
```

> **Principio del módulo:** escribir código expresivo no significa comprimirlo. Significa elegir una estructura que revele con claridad qué transformación se está realizando.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Recorrer colecciones con posiciones útiles mediante `enumerate()`.
- Procesar varias colecciones en paralelo con `zip()`.
- Detectar longitudes incompatibles y utilizar `zip(..., strict=True)` cuando la relación lo requiera.
- Desempaquetar pares, tuplas y registros con claridad.
- Crear listas, diccionarios y conjuntos mediante comprensiones.
- Incorporar transformación y filtrado sin producir expresiones difíciles de leer.
- Utilizar expresiones generadoras cuando no sea necesario construir una lista completa.
- Aplicar `sum()`, `any()`, `all()`, `min()` y `max()` directamente sobre generadores.
- Ordenar registros por uno o varios criterios mediante `key` y `reverse`.
- Comprender el comportamiento de `map()` y `filter()`.
- Utilizar funciones `lambda` únicamente cuando mantengan la claridad.
- Comparar varias soluciones correctas y justificar cuál es más mantenible.
- Construir un analizador de inventario y pedidos utilizando transformaciones expresivas.

---

## Conocimientos que utilizarás

Este módulo supone que ya puedes:

- recorrer listas y diccionarios con ciclos;
- crear y llamar funciones;
- acceder a valores mediante índices y claves;
- utilizar condicionales;
- trabajar con tuplas, conjuntos y diccionarios;
- aplicar las herramientas de texto y validación del Módulo 1.

No volverás a estudiar esos fundamentos. Los utilizarás para comparar soluciones y elegir mejores formas de expresar una operación.

---

## Producto que construirás

Desarrollarás un programa que reciba datos de inventario y pedidos, combine colecciones relacionadas, compruebe su consistencia y produzca un reporte como este:

```text
ANÁLISIS DE PEDIDOS
============================================================================
N.º  PEDIDO     CLIENTE              ESTADO       TOTAL       PRIORIDAD
----------------------------------------------------------------------------
1    PED-005    Panadería Central    COMPLETO     ₡28,500.00  urgente
2    PED-002    Librería Norte       FALTANTES    ₡17,250.00  alta
...

RESUMEN
----------------------------------------------------------------------------
Pedidos procesados:       8
Pedidos completos:        5
Pedidos con faltantes:    3
Valor aceptado:           ...
¿Existen códigos desconocidos?: Sí
Pedido de mayor valor:    PED-005
```

El programa deberá transformar los datos sin modificar las colecciones originales y explicar por qué un pedido no puede completarse.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Recorridos con `enumerate()` y `zip()` | 12 min |
| 2. Comprensiones y legibilidad | 15 min |
| 3. Expresiones generadoras | 8 min |
| 4. Ordenamiento y selección con `key` | 8 min |
| 5. `lambda`, `map()` y `filter()` con criterio | 7 min |
| 6. Prácticas guiadas | 25 min |
| 7. Actividades obligatorias | 10 min |
| 8. Proyecto del módulo | 40 min |
| 9. Evaluación y cierre | 10 min |
| **Total** | **2 h 15 min** |

Los tiempos corresponden al recorrido esencial. Si decides añadir retos opcionales o crear el proyecto desde una estructura completamente distinta, necesitarás tiempo adicional.

---

# 1. Recorridos con intención

## 1.1 `enumerate()` evita contadores manuales

Cuando necesitas el elemento y su posición, evita administrar un contador por separado:

```python
cursos = ["Python Básico", "Python Intermedio", "Python Práctico"]

for posicion, curso in enumerate(cursos, start=1):
    print(f"{posicion}. {curso}")
```

Salida:

```text
1. Python Básico
2. Python Intermedio
3. Python Práctico
```

Sin `start=1`, la numeración comienza en cero:

```python
for indice, curso in enumerate(cursos):
    print(indice, curso)
```

Utiliza el nombre adecuado:

- `indice` cuando accederás a una posición real de la colección;
- `numero`, `fila` o `posicion` cuando solo mostrarás una numeración.

No utilices el índice para volver a buscar el elemento que `enumerate()` ya entregó:

```python
# Evita esta redundancia
for indice, curso in enumerate(cursos):
    print(cursos[indice])
```

La forma directa es más clara:

```python
for indice, curso in enumerate(cursos):
    print(curso)
```

## 1.2 Modificar una lista mientras se recorre

Tener un índice no convierte en segura cualquier modificación:

```python
for indice, producto in enumerate(productos):
    if producto["existencia"] == 0:
        productos.pop(indice)
```

Eliminar elementos desplaza las posiciones y puede provocar que algunos no se revisen. Para filtrar, crea una nueva colección:

```python
disponibles = [
    producto
    for producto in productos
    if producto["existencia"] > 0
]
```

Las comprensiones se estudiarán en la siguiente sección.

## 1.3 `zip()` recorre colecciones relacionadas

Supón que un sistema entrega nombres y precios en colecciones separadas:

```python
nombres = ["Teclado", "Ratón", "Monitor"]
precios = [18000, 9500, 85000]

for nombre, precio in zip(nombres, precios):
    print(f"{nombre:<12} ₡{precio:>10,.2f}")
```

En cada iteración, `zip()` produce una tupla con los elementos correspondientes:

```text
("Teclado", 18000)
("Ratón", 9500)
("Monitor", 85000)
```

También puede combinar más de dos colecciones:

```python
codigos = ["PRD-01", "PRD-02", "PRD-03"]
existencias = [8, 15, 3]

for codigo, nombre, precio, existencia in zip(
    codigos,
    nombres,
    precios,
    existencias,
):
    print(codigo, nombre, precio, existencia)
```

## 1.4 El truncamiento silencioso de `zip()`

Por defecto, `zip()` se detiene cuando se agota la colección más corta:

```python
codigos = ["PRD-01", "PRD-02", "PRD-03"]
precios = [18000, 9500]

print(list(zip(codigos, precios)))
```

Salida:

```text
[('PRD-01', 18000), ('PRD-02', 9500)]
```

`PRD-03` desaparece sin producir un error. Esto puede ser correcto cuando deseas procesar únicamente pares disponibles, pero es peligroso si las colecciones representan columnas que deben coincidir.

Desde Python 3.10 puedes exigir longitudes iguales:

```python
pares = zip(codigos, precios, strict=True)
```

Al consumir `pares`, Python genera `ValueError` si las longitudes son diferentes. El manejo completo de excepciones se estudiará en el Módulo 6. Por ahora, comprueba las longitudes antes de utilizarlo:

```python
colecciones = [codigos, nombres, precios, existencias]
misma_longitud = len({len(coleccion) for coleccion in colecciones}) == 1

if misma_longitud:
    for datos in zip(codigos, nombres, precios, existencias, strict=True):
        print(datos)
else:
    print("Las columnas del inventario tienen longitudes diferentes")
```

El conjunto contiene las longitudes distintas. Si su tamaño es uno, todas coinciden.

## 1.5 Desempaquetado

Python permite asignar los elementos de una secuencia a nombres separados:

```python
producto = ("PRD-01", "Teclado", 18000)
codigo, nombre, precio = producto
```

También puedes capturar una parte variable:

```python
primero, *intermedios, ultimo = [10, 20, 30, 40, 50]

print(primero)
print(intermedios)
print(ultimo)
```

Salida:

```text
10
[20, 30, 40]
50
```

El desempaquetado es útil cuando la estructura es conocida. Si la cantidad de elementos puede variar por errores de entrada, valida antes.

## 1.6 Crear un diccionario con `zip()`

```python
codigos = ["PRD-01", "PRD-02", "PRD-03"]
precios = [18000, 9500, 85000]

precios_por_codigo = dict(zip(codigos, precios, strict=True))
print(precios_por_codigo)
```

Salida:

```text
{'PRD-01': 18000, 'PRD-02': 9500, 'PRD-03': 85000}
```

Esta técnica es adecuada cuando cada clave aparece una sola vez. Si existen códigos duplicados, el último valor reemplazará al anterior. Valida la unicidad cuando el dominio la requiera.

---

# 2. Comprensiones y legibilidad

## 2.1 De un ciclo a una comprensión de lista

Solución tradicional:

```python
precios = [18000, 9500, 85000, 42000]
precios_con_impuesto = []

for precio in precios:
    precios_con_impuesto.append(precio * 1.13)
```

Comprensión equivalente:

```python
precios_con_impuesto = [precio * 1.13 for precio in precios]
```

Lee una comprensión en este orden:

```text
[resultado          for elemento in colección]
 precio * 1.13      for precio   in precios
```

Una comprensión construye una colección nueva. No modifica `precios`.

## 2.2 Transformar y filtrar

Para conservar únicamente precios mayores a 10 000:

```python
precios_altos = [precio for precio in precios if precio > 10000]
```

Para filtrar y transformar:

```python
precios_altos_con_impuesto = [
    precio * 1.13
    for precio in precios
    if precio > 10000
]
```

La lectura es:

```text
Para cada precio de precios,
si el precio supera 10 000,
guarda el precio multiplicado por 1.13.
```

El salto de líneas mejora la legibilidad cuando la expresión no cabe cómodamente en una sola.

## 2.3 Condición como parte del resultado

No confundas filtrar con elegir entre dos resultados:

```python
estados = [
    "sin existencia" if existencia == 0 else "disponible"
    for existencia in [4, 0, 8, 0]
]
```

Aquí cada entrada produce una salida. La condición aparece antes de `for` porque forma parte de la transformación.

Comparación:

```python
# Filtra: algunos elementos no aparecen
[numero for numero in numeros if numero > 0]

# Transforma: todos producen una salida
["positivo" if numero > 0 else "no positivo" for numero in numeros]
```

## 2.4 Comprensiones de diccionario

```python
productos = [
    {"codigo": "PRD-01", "nombre": "Teclado"},
    {"codigo": "PRD-02", "nombre": "Ratón"},
    {"codigo": "PRD-03", "nombre": "Monitor"},
]

productos_por_codigo = {
    producto["codigo"]: producto
    for producto in productos
}
```

La parte anterior a `for` contiene `clave: valor`.

También puedes transformar claves o valores:

```python
nombres_por_codigo = {
    producto["codigo"]: producto["nombre"].casefold()
    for producto in productos
}
```

Si dos elementos producen la misma clave, el último reemplaza al anterior. Una comprensión no detecta automáticamente duplicados.

## 2.5 Comprensiones de conjunto

```python
categorias = ["Accesorios", "pantallas", "ACCESORIOS", "Audio"]

categorias_unicas = {
    categoria.casefold()
    for categoria in categorias
}
```

El conjunto elimina duplicados normalizados. No conserva un orden contractual para presentación. Si necesitas mostrar categorías ordenadas:

```python
categorias_ordenadas = sorted(categorias_unicas)
```

## 2.6 Comprensiones anidadas

Puedes recorrer colecciones internas:

```python
pedidos = [
    {"id": "PED-01", "lineas": [("PRD-01", 2), ("PRD-02", 1)]},
    {"id": "PED-02", "lineas": [("PRD-03", 1)]},
]

codigos_solicitados = [
    codigo
    for pedido in pedidos
    for codigo, cantidad in pedido["lineas"]
]
```

Esta expresión aún puede leerse con facilidad. Pero agregar varias transformaciones y condiciones la volvería difícil de revisar.

## 2.7 Cuándo regresar a un ciclo normal

Evita una comprensión cuando:

- modifica objetos existentes;
- contiene varios niveles de condiciones;
- necesita registrar errores diferentes;
- realiza efectos secundarios como imprimir o escribir archivos;
- requiere comentarios para descifrar la expresión;
- produce una línea muy extensa;
- sería más clara como una función con nombre.

Ejemplo difícil de mantener:

```python
resultado = [
    (p["codigo"], p["precio"] * 1.13 if p["activo"] else 0)
    for p in productos
    if p.get("codigo") and p.get("precio") is not None and p.get("categoria") != "oculta"
]
```

Una alternativa más clara:

```python
def producto_publicable(producto):
    return all([
        producto.get("codigo"),
        producto.get("precio") is not None,
        producto.get("categoria") != "oculta",
    ])


resultado = []

for producto in productos:
    if not producto_publicable(producto):
        continue

    precio_publicado = producto["precio"] * 1.13 if producto["activo"] else 0
    resultado.append((producto["codigo"], precio_publicado))
```

La comprensión más corta no siempre es la solución más expresiva.

## 2.8 No utilices comprensiones solo por sus efectos

Evita:

```python
[print(producto) for producto in productos]
```

La comprensión crea una lista llena de valores `None` que no necesitas. Si quieres ejecutar una acción por elemento, utiliza un ciclo:

```python
for producto in productos:
    print(producto)
```

---

# 3. Expresiones generadoras

## 3.1 Producir valores bajo demanda

Una comprensión de lista construye todos sus resultados:

```python
cuadrados = [numero ** 2 for numero in range(1, 6)]
```

Una expresión generadora utiliza paréntesis y produce valores conforme se solicitan:

```python
cuadrados = (numero ** 2 for numero in range(1, 6))
```

La diferencia se vuelve importante con grandes cantidades de datos o cuando una función puede consumir los valores directamente.

## 3.2 Uso directo con funciones integradas

No necesitas crear una lista solo para sumarla:

```python
lineas = [
    {"precio": 18000, "cantidad": 2},
    {"precio": 9500, "cantidad": 1},
]

total = sum(
    linea["precio"] * linea["cantidad"]
    for linea in lineas
)
```

También puedes utilizar generadores con `any()`, `all()`, `min()` y `max()`:

```python
hay_faltantes = any(
    linea["solicitada"] > linea["disponible"]
    for linea in lineas
)

todos_validos = all(
    linea["cantidad"] > 0
    for linea in lineas
)
```

Cuando una expresión generadora es el único argumento, no necesitas dos pares de paréntesis:

```python
total = sum(numero for numero in numeros)
```

## 3.3 Un generador se consume

```python
valores = (numero * 2 for numero in range(3))

print(list(valores))
print(list(valores))
```

Salida:

```text
[0, 2, 4]
[]
```

Después del primer recorrido no quedan valores pendientes. Si necesitas recorrer los resultados varias veces, crea una lista o vuelve a construir el generador.

## 3.4 Evaluación perezosa y cortocircuito

`any()` se detiene al encontrar el primer valor verdadero. `all()` se detiene al encontrar el primer valor falso. Una expresión generadora permite aprovechar ese comportamiento sin calcular los elementos restantes.

```python
hay_codigo_desconocido = any(
    codigo not in inventario
    for codigo, cantidad in pedido["lineas"]
)
```

Esta expresión comunica una pregunta y puede finalizar tan pronto como encuentre un código desconocido.

---

# 4. Ordenamiento y selección con `key`

## 4.1 Ordenar valores simples

```python
precios = [18000, 9500, 85000, 42000]

ascendente = sorted(precios)
descendente = sorted(precios, reverse=True)
```

`sorted()` devuelve una lista nueva y acepta cualquier iterable. `.sort()` modifica una lista existente y devuelve `None`.

## 4.2 Ordenar registros

```python
productos = [
    {"codigo": "PRD-01", "precio": 18000},
    {"codigo": "PRD-02", "precio": 9500},
    {"codigo": "PRD-03", "precio": 85000},
]

por_precio = sorted(
    productos,
    key=lambda producto: producto["precio"],
)
```

`key` no transforma el resultado. Solo produce el valor utilizado para comparar.

## 4.3 Ordenar por varios criterios

```python
pedidos = [
    {"estado": "FALTANTES", "total": 15000, "id": "PED-03"},
    {"estado": "COMPLETO", "total": 25000, "id": "PED-02"},
    {"estado": "COMPLETO", "total": 12000, "id": "PED-01"},
]

ordenados = sorted(
    pedidos,
    key=lambda pedido: (
        pedido["estado"],
        -pedido["total"],
        pedido["id"],
    ),
)
```

Python compara la primera parte de la tupla, después la segunda si existe empate y finalmente la tercera. El signo negativo ordena el total de mayor a menor dentro de un orden general ascendente.

Para prioridades que no siguen el orden alfabético, crea un mapa:

```python
ORDEN_PRIORIDAD = {
    "urgente": 0,
    "alta": 1,
    "normal": 2,
}

ordenados = sorted(
    pedidos,
    key=lambda pedido: ORDEN_PRIORIDAD[pedido["prioridad"]],
)
```

## 4.4 Seleccionar extremos

```python
pedido_mayor = max(
    pedidos,
    key=lambda pedido: pedido["total"],
    default=None,
)
```

El resultado es el pedido completo. `default=None` evita un error si no hay pedidos.

Si solo necesitas el total mayor, puedes generar los números:

```python
total_mayor = max(
    (pedido["total"] for pedido in pedidos),
    default=0,
)
```

La elección depende de lo que necesites después: el registro o únicamente su valor.

## 4.5 No ocultes reglas complejas dentro de `lambda`

Si el criterio necesita varias decisiones, utiliza una función con nombre:

```python
def clave_de_orden(pedido):
    prioridad = ORDEN_PRIORIDAD.get(pedido["prioridad"], 99)
    esta_incompleto = pedido["estado"] != "COMPLETO"
    return esta_incompleto, prioridad, -pedido["total"], pedido["id"]


ordenados = sorted(pedidos, key=clave_de_orden)
```

El nombre permite probar y explicar la regla por separado.

---

# 5. `lambda`, `map()` y `filter()` con criterio

## 5.1 Funciones `lambda`

Una `lambda` crea una función anónima de una sola expresión:

```python
calcular_subtotal = lambda precio, cantidad: precio * cantidad
```

Aunque funciona, una función normal suele ser más apropiada si necesita nombre, documentación o reutilización:

```python
def calcular_subtotal(precio, cantidad):
    return precio * cantidad
```

Las `lambda` resultan útiles como argumentos breves:

```python
productos_ordenados = sorted(
    productos,
    key=lambda producto: producto["precio"],
)
```

## 5.2 Transformar con `map()`

```python
precios = [1000, 2500, 4000]
precios_con_impuesto = map(lambda precio: precio * 1.13, precios)
```

`map()` devuelve un iterador. Puedes consumirlo directamente o convertirlo:

```python
print(list(precios_con_impuesto))
```

Comprensión equivalente:

```python
precios_con_impuesto = [precio * 1.13 for precio in precios]
```

La comprensión suele ser más directa cuando la transformación es específica. `map()` puede ser especialmente claro cuando ya existe una función con nombre:

```python
def normalizar_codigo(codigo):
    return codigo.strip().upper()


codigos_limpios = list(map(normalizar_codigo, codigos))
```

## 5.3 Filtrar con `filter()`

```python
def tiene_existencia(producto):
    return producto["existencia"] > 0


disponibles = list(filter(tiene_existencia, productos))
```

Comprensión equivalente:

```python
disponibles = [
    producto
    for producto in productos
    if producto["existencia"] > 0
]
```

Ambas son correctas. Elige la que exprese mejor la regla dentro del contexto.

## 5.4 Evita `filter(None, datos)` sin explicar la intención

```python
datos = ["Python", "", None, "SQL", 0]
resultado = list(filter(None, datos))
```

Esto elimina todos los valores falsos, no solo cadenas vacías. Puede borrar `0` aunque sea válido. Una regla explícita es más segura:

```python
resultado = [dato for dato in datos if dato is not None]
```

## 5.5 Comparación práctica

| Situación | Opción normalmente más clara |
|---|---|
| Transformación breve y específica | Comprensión |
| Filtrado breve | Comprensión |
| Aplicar una función existente a cada elemento | `map(funcion, datos)` puede ser claro |
| Aplicar un predicado existente | `filter(predicado, datos)` puede ser claro |
| Criterio corto para ordenar | `lambda` |
| Regla con varias decisiones | Función con nombre |
| Solo consumir una vez | Iterador o generador |
| Recorrer varias veces | Lista u otra colección materializada |

No existe una obligación profesional de utilizar `map()` o `filter()`. La habilidad importante es comprenderlos, leer código que los utilice y escoger con criterio.

---

# 6. Prácticas guiadas

Resuelve cada práctica antes de consultar las soluciones del final.

## Práctica guiada 1 — Numerar alertas de inventario

```python
alertas = [
    "PRD-04 tiene existencia cero",
    "PRD-07 está por debajo del mínimo",
    "PRD-09 no tiene precio",
]
```

Muestra:

```text
Alerta 101: PRD-04 tiene existencia cero
Alerta 102: PRD-07 está por debajo del mínimo
Alerta 103: PRD-09 no tiene precio
```

Utiliza `enumerate()` con el inicio apropiado. Después añade una cuarta alerta sin modificar la lógica.

## Práctica guiada 2 — Construir un catálogo desde columnas

```python
codigos = ["PRD-01", "PRD-02", "PRD-03"]
nombres = ["Teclado", "Ratón", "Monitor"]
precios = [18000, 9500, 85000]
existencias = [8, 15, 3]
```

Construye:

```python
{
    "PRD-01": {"nombre": "Teclado", "precio": 18000, "existencia": 8},
    "PRD-02": {"nombre": "Ratón", "precio": 9500, "existencia": 15},
    "PRD-03": {"nombre": "Monitor", "precio": 85000, "existencia": 3},
}
```

Requisitos:

- comprueba que las cuatro colecciones tengan la misma longitud;
- utiliza `zip(..., strict=True)` después de comprobar;
- utiliza una comprensión de diccionario;
- prueba una copia de los datos donde falte un precio y muestra un mensaje en lugar de construir un catálogo incompleto.

## Práctica guiada 3 — Transformar y filtrar productos

```python
productos = [
    {"codigo": "PRD-01", "categoria": "Accesorios", "precio": 18000, "activo": True},
    {"codigo": "PRD-02", "categoria": "accesorios", "precio": 9500, "activo": True},
    {"codigo": "PRD-03", "categoria": "Pantallas", "precio": 85000, "activo": False},
    {"codigo": "PRD-04", "categoria": "Audio", "precio": 42000, "activo": True},
]
```

Crea mediante comprensiones:

1. Una lista de códigos activos.
2. Un diccionario de precios por código para productos activos.
3. Un conjunto de categorías normalizadas.
4. Una lista de códigos cuyo precio sea mayor a 15 000.

No modifiques `productos`.

## Práctica guiada 4 — Analizar líneas de un pedido

```python
inventario = {
    "PRD-01": {"precio": 18000, "existencia": 8},
    "PRD-02": {"precio": 9500, "existencia": 2},
}

lineas = [("PRD-01", 2), ("PRD-02", 3)]
```

Obtén mediante expresiones generadoras:

- si todos los códigos existen;
- si todas las cantidades son mayores que cero;
- si al menos una línea supera la existencia disponible;
- el total solicitado, suponiendo que todos los códigos existen.

El pedido no está completo porque solicita tres unidades de `PRD-02` y solo existen dos.

## Práctica guiada 5 — Ordenar pedidos por negocio

```python
pedidos = [
    {"id": "PED-01", "prioridad": "normal", "total": 25000},
    {"id": "PED-02", "prioridad": "urgente", "total": 18000},
    {"id": "PED-03", "prioridad": "alta", "total": 42000},
    {"id": "PED-04", "prioridad": "urgente", "total": 35000},
]
```

Ordena primero por prioridad de negocio y, cuando coincida, por total de mayor a menor:

```text
urgente → alta → normal
```

Después encuentra el pedido de mayor valor. Utiliza una función con nombre como `key` y explica por qué resulta más clara que una `lambda` extensa.

---

# 7. Actividades obligatorias

Entrega estas actividades junto con el proyecto en un único punto de entrega.

## Actividad 1 — Reparar una combinación peligrosa

```python
estudiantes = ["Ana", "Luis", "María", "Carlos"]
calificaciones = [95, 82, 90]

for estudiante, calificacion in zip(estudiantes, calificaciones):
    print(estudiante, calificacion)
```

Realiza lo siguiente:

1. Explica qué dato se pierde y por qué no aparece ningún error.
2. Crea una comprobación previa de longitudes.
3. Utiliza `zip(..., strict=True)` cuando los datos sean válidos.
4. Genera una lista de diccionarios con nombre y calificación.
5. Crea un segundo caso válido y demuestra el resultado.

## Actividad 2 — Refactorizar transformaciones

```python
numeros = [8, -3, 12, 0, 7, -1, 20]
positivos_al_cuadrado = []

for numero in numeros:
    if numero > 0:
        positivos_al_cuadrado.append(numero ** 2)
```

Debes:

1. Crear una comprensión equivalente.
2. Calcular la suma mediante una expresión generadora sin construir otra lista.
3. Comprobar si existe algún número negativo.
4. Comprobar si todos los valores son enteros.
5. Explicar por qué no conviene combinar las cinco operaciones en una sola expresión.

## Actividad 3 — Comparar tres estilos

Normaliza esta colección mediante:

```python
codigos = [" coa-0001 ", "COA-0002", " coa-0003"]
```

Crea tres versiones:

1. ciclo tradicional;
2. comprensión de lista;
3. `map()` con una función llamada `normalizar_codigo`.

Las tres deben producir el mismo resultado. Compara:

- claridad;
- facilidad de depuración;
- posibilidad de reutilizar la función;
- tipo de objeto devuelto antes de convertirlo a lista.

Concluye cuál utilizarías en este caso y por qué.

---

# 8. Proyecto del módulo — Analizador de inventario y pedidos

## Desafío

Un negocio conserva el inventario en varias colecciones paralelas porque los datos proceden de un sistema anterior. También recibe pedidos con productos y cantidades solicitadas.

Debes crear un programa que:

- compruebe la consistencia de las columnas del inventario;
- construya una estructura práctica para consultar productos;
- analice cada pedido;
- detecte códigos desconocidos, cantidades inválidas y faltantes;
- calcule totales;
- ordene los pedidos según reglas de negocio;
- genere un reporte numerado y un resumen global.

No utilizarás archivos, bases de datos ni librerías externas. Los datos estarán en un módulo de Python proporcionado.

## Datos del inventario

```python
CODIGOS = [
    "PRD-001", "PRD-002", "PRD-003", "PRD-004",
    "PRD-005", "PRD-006", "PRD-007", "PRD-008",
]

NOMBRES = [
    "Teclado mecánico", "Ratón inalámbrico", "Monitor 24 pulgadas",
    "Base para portátil", "Auriculares USB", "Cámara web",
    "Memoria USB 64 GB", "Cable HDMI",
]

PRECIOS = [32000, 14500, 89000, 18500, 27000, 22500, 8500, 6000]
EXISTENCIAS = [8, 3, 2, 0, 5, 4, 20, 12]
CATEGORIAS = [
    "Accesorios", "Accesorios", "Pantallas", "Accesorios",
    "Audio", "Video", "Almacenamiento", "Cables",
]
```

## Datos de pedidos

```python
PEDIDOS = [
    {
        "id": "PED-001",
        "cliente": "Café Horizonte",
        "prioridad": "normal",
        "lineas": [("PRD-001", 1), ("PRD-008", 2)],
    },
    {
        "id": "PED-002",
        "cliente": "Librería Norte",
        "prioridad": "alta",
        "lineas": [("PRD-002", 5), ("PRD-007", 4)],
    },
    {
        "id": "PED-003",
        "cliente": "Estudio Creativo",
        "prioridad": "urgente",
        "lineas": [("PRD-003", 1), ("PRD-005", 2), ("PRD-006", 1)],
    },
    {
        "id": "PED-004",
        "cliente": "Academia Central",
        "prioridad": "normal",
        "lineas": [("PRD-004", 1), ("PRD-008", 3)],
    },
    {
        "id": "PED-005",
        "cliente": "Clínica del Este",
        "prioridad": "urgente",
        "lineas": [("PRD-999", 2), ("PRD-006", 1)],
    },
    {
        "id": "PED-006",
        "cliente": "Taller Rivera",
        "prioridad": "alta",
        "lineas": [("PRD-007", 0), ("PRD-008", 2)],
    },
    {
        "id": "PED-007",
        "cliente": "Hotel Mirador",
        "prioridad": "normal",
        "lineas": [],
    },
    {
        "id": "PED-008",
        "cliente": "Diseño Sur",
        "prioridad": "alta",
        "lineas": [("PRD-001", 2), ("PRD-002", 1), ("PRD-005", 1)],
    },
]
```

## Reglas del inventario

1. Todas las columnas deben tener la misma longitud.
2. Los códigos deben ser únicos.
3. Los precios no pueden ser negativos.
4. Las existencias deben ser números enteros iguales o mayores que cero.
5. Si una regla estructural falla, no se construye el inventario y el programa muestra una explicación.
6. Cuando las columnas sean consistentes, utiliza `zip(..., strict=True)`.

El inventario final debe permitir consultar un producto por código:

```python
{
    "PRD-001": {
        "nombre": "Teclado mecánico",
        "precio": 32000,
        "existencia": 8,
        "categoria": "Accesorios",
    },
    ...
}
```

## Estados de un pedido

| Estado | Regla |
|---|---|
| `COMPLETO` | Tiene líneas válidas, todos los códigos existen y hay existencia suficiente. |
| `FALTANTES` | La estructura es válida, pero al menos una cantidad supera la existencia. |
| `INVÁLIDO` | No tiene líneas, contiene un código desconocido, una cantidad que no es un entero positivo o una prioridad no reconocida. |

Un pedido inválido debe conservarse en el reporte con sus problemas. No calcules un total definitivo utilizando productos desconocidos.

## Reglas de orden

El reporte debe ordenar:

1. `COMPLETO`;
2. `FALTANTES`;
3. `INVÁLIDO`.

Dentro del mismo estado:

1. prioridad `urgente`;
2. prioridad `alta`;
3. prioridad `normal`;
4. total de mayor a menor;
5. identificador como desempate final.

Expresa este criterio mediante mapas de orden y una función `key` con nombre.

## Requisitos funcionales

El programa deberá:

1. Comprobar las longitudes de las cinco columnas.
2. Comprobar que los códigos sean únicos.
3. Construir el inventario mediante `zip()` y una comprensión de diccionario.
4. Obtener las categorías únicas normalizadas mediante una comprensión de conjunto.
5. Analizar todos los pedidos sin modificar `PEDIDOS` ni las existencias.
6. Conservar la información original de cada pedido.
7. Comprobar que cada pedido contenga al menos una línea.
8. Comprobar que la prioridad sea `urgente`, `alta` o `normal`.
9. Comprobar que todos los códigos existan.
10. Comprobar que las cantidades sean enteros positivos.
11. Detectar los productos con existencia insuficiente.
12. Calcular el total solicitado cuando todas las líneas sean calculables.
13. Asignar el estado correcto y una lista de problemas.
14. Crear listas de pedidos completos, con faltantes e inválidos.
15. Ordenar el reporte según las reglas de negocio.
16. Numerar las filas desde uno con `enumerate()`.
17. Calcular el valor total de los pedidos completos.
18. Localizar el pedido calculable de mayor y menor valor.
19. Informar si existe algún código desconocido.
20. Informar si todos los pedidos completos cumplen todas las reglas.
21. Mostrar las categorías solicitadas por pedidos calculables.

## Herramientas obligatorias

La solución debe utilizar correctamente:

- `enumerate()` con `start`;
- `zip(..., strict=True)` después de validar longitudes;
- desempaquetado de tuplas;
- una comprensión de lista;
- una comprensión de diccionario;
- una comprensión de conjunto;
- una expresión generadora con `sum()`;
- una expresión generadora con `any()` o `all()`;
- `sorted()` con `key`;
- `min()` y `max()` con `key` y `default` cuando corresponda;
- una función `lambda` breve o una justificación de por qué una función con nombre es más clara.

No es obligatorio utilizar `map()` y `filter()` dentro del proyecto. Ya los comparaste en las actividades; no deben incluirse a la fuerza si una comprensión comunica mejor la intención.

## Estructura de funciones recomendada

```python
def columnas_consistentes(*columnas):
    ...


def codigos_unicos(codigos):
    ...


def construir_inventario(codigos, nombres, precios, existencias, categorias):
    ...


def validar_lineas(lineas, inventario):
    ...


def calcular_total(lineas, inventario):
    ...


def buscar_faltantes(lineas, inventario):
    ...


def analizar_pedido(pedido, inventario):
    ...


def clave_orden_pedido(resultado):
    ...


def crear_resumen(resultados):
    ...


def mostrar_reporte(resultados, resumen):
    ...


def main():
    ...


if __name__ == "__main__":
    main()
```

Puedes cambiar la estructura si mantienes responsabilidades claras.

## Estructura sugerida de un resultado

```python
{
    "original": pedido,
    "id": "PED-002",
    "cliente": "Librería Norte",
    "prioridad": "alta",
    "estado": "FALTANTES",
    "total": 106500,
    "faltantes": [
        {
            "codigo": "PRD-002",
            "solicitada": 5,
            "disponible": 3,
        }
    ],
    "problemas": [],
}
```

Para un pedido inválido, `total` puede ser `None` si no es posible calcularlo de manera confiable.

La función de orden debe contemplar ese `None`. Puedes utilizar un valor numérico sustituto únicamente dentro de la clave de orden, sin reemplazar el valor original del resultado.

## Flujo recomendado

### Fase 1. Comprueba las columnas

Utiliza un conjunto de longitudes. Si no contiene exactamente un valor, informa cuáles son las longitudes y detén la construcción.

### Fase 2. Construye el inventario

Combina las columnas con `zip(..., strict=True)` y crea un diccionario indexado por código.

### Fase 3. Analiza un pedido válido

Comienza con `PED-001`. Comprueba códigos, cantidades, faltantes y total.

### Fase 4. Analiza casos problemáticos

Prueba un pedido con faltantes, uno con código desconocido, uno con cantidad cero y uno vacío.

### Fase 5. Procesa la colección

Construye una lista nueva de resultados. No añadas claves nuevas a los pedidos originales.

### Fase 6. Ordena

Crea mapas numéricos para estados y prioridades. Utiliza una función con nombre para devolver la clave compuesta.

### Fase 7. Resume

Calcula totales y comprobaciones globales mediante funciones integradas y generadores.

### Fase 8. Presenta y prueba

Numera el reporte con `enumerate(start=1)`. Ejecuta el plan de pruebas antes de preparar la entrega.

## Formato mínimo del reporte

```text
ANÁLISIS DE PEDIDOS
================================================================================
N.º  PEDIDO     CLIENTE                 ESTADO       TOTAL          PRIORIDAD
--------------------------------------------------------------------------------
1    PED-003    Estudio Creativo        COMPLETO     ₡165,500.00    urgente
2    PED-001    Café Horizonte          COMPLETO     ₡44,000.00     normal
...

RESUMEN
--------------------------------------------------------------------------------
Pedidos procesados:                 8
Pedidos completos:                  ...
Pedidos con faltantes:              ...
Pedidos inválidos:                  ...
Valor de pedidos completos:         ...
¿Existen códigos desconocidos?:     ...
Pedido calculable de mayor valor:   ...
Pedido calculable de menor valor:   ...
Categorías solicitadas:             ...

DETALLE DE PEDIDOS NO COMPLETOS
--------------------------------------------------------------------------------
PED-002 — Librería Norte
- PRD-002: solicitadas 5, disponibles 3
```

Los valores incompletos deben ser calculados por el programa. No necesitas descontar existencia ni simular el despacho.

## Plan de pruebas obligatorio

| Caso | Modificación o entrada | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| Columnas correctas | Datos originales | Inventario construido | |
| Longitudes diferentes | Eliminar un precio en una copia | Construcción rechazada | |
| Código duplicado | Repetir un código en una copia | Construcción rechazada | |
| Pedido completo | `PED-001` | `COMPLETO` | |
| Existencia insuficiente | `PED-002` | `FALTANTES` | |
| Código desconocido | `PED-005` | `INVÁLIDO` | |
| Cantidad cero | `PED-006` | `INVÁLIDO` | |
| Pedido vacío | `PED-007` | `INVÁLIDO` | |
| Colección de pedidos vacía | `[]` | Resumen sin errores | |

Añade al menos tres casos propios: una cantidad negativa, una prioridad no reconocida que debe resultar `INVÁLIDO` y un empate de total que demuestre el último criterio de orden.

## Buenas prácticas obligatorias

- Conserva las colecciones originales.
- Valida las longitudes antes de `zip(..., strict=True)`.
- No ocultes la pérdida de datos utilizando `zip()` sin analizarla.
- No conviertas cada generador en lista sin necesidad.
- No utilices comprensiones para imprimir o modificar objetos.
- Separa los criterios complejos de ordenamiento en funciones con nombre.
- No repitas búsquedas lineales cuando ya puedes consultar el inventario por código.
- Utiliza `default` con `min()` y `max()` cuando la colección pueda estar vacía.
- Mantén los mensajes de problemas separados del estado.

## Entregables

```text
python-practico_modulo-02_nombre-apellido/
├── analizador_pedidos.py
├── datos_inventario.py
├── README.md
└── evidencia/
    ├── reporte_terminal.txt o captura_reporte.png
    └── plan_pruebas.md
```

El `README.md` debe explicar:

- versión de Python y comando de ejecución;
- cómo se comprueba la consistencia de las columnas;
- diferencia entre `COMPLETO`, `FALTANTES` e `INVÁLIDO`;
- por qué se construyó un diccionario indexado por código;
- dónde se utilizaron comprensiones y generadores;
- por qué la regla de ordenamiento se implementó con `lambda` o función con nombre;
- una comparación concreta entre ciclo, comprensión y `map()`.

## Preguntas de reflexión

1. ¿Qué problema evita `strict=True`?
2. ¿Cuándo una comprensión deja de ser legible?
3. ¿Por qué el total puede calcularse con un generador?
4. ¿Qué riesgo existe al consumir dos veces un generador?
5. ¿Por qué el inventario indexado evita búsquedas repetidas?

## Punto de entrega obligatorio

Realiza **una sola entrega para todo el módulo**. Incluye actividades, proyecto, pruebas y reflexión.

```text
Curso: Python Práctico
Módulo: 2 — Iteración y transformación expresiva
Estudiante: nombre completo
Versión: primera entrega o corrección número X
Archivo principal: analizador_pedidos.py
Versión de Python: número utilizado
```

[Entregar el Módulo 2](https://forms.gle/nTx97JRkFkbH5Vfr6)

## Condición de avance

Para continuar al Módulo 3 necesitas:

- obtener al menos 70% en la evaluación;
- completar las actividades obligatorias;
- obtener `Aprobado` en el proyecto;
- corregir cualquier requisito crítico señalado.

---

# 9. Rúbrica de evaluación del proyecto

| Criterio | Ponderación | Desempeño esperado |
|---|---:|---|
| Funcionalidad | 35% | Construye el inventario, analiza pedidos, clasifica, ordena y resume correctamente. |
| Herramientas del módulo | 25% | Aplica `enumerate`, `zip`, comprensiones, generadores y funciones con `key`. |
| Claridad y organización | 20% | Mantiene funciones enfocadas, criterios legibles y datos originales intactos. |
| Robustez | 10% | Contempla columnas incompatibles, datos vacíos, códigos desconocidos y cantidades inválidas. |
| Documentación y evidencia | 10% | Incluye README, plan de pruebas, resultados y reflexión. |
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
- `zip()` descarta información sin advertencia;
- modifica las colecciones originales;
- acepta códigos desconocidos o cantidades no positivas;
- calcula manualmente resultados que deberían surgir de los datos;
- no diferencia faltantes de pedidos inválidos;
- omite herramientas obligatorias;
- faltan archivos para revisar la solución;
- el estudiante no puede explicar el código.

---

# 10. Evaluación del módulo

Responde primero sin ejecutar el código. Después comprueba y explica cualquier diferencia.

## Pregunta 1

¿Qué imprime?

```python
nombres = ["Ana", "Luis"]

for numero, nombre in enumerate(nombres, start=5):
    print(numero, nombre)
```

A. `0 Ana` y `1 Luis`  
B. `1 Ana` y `2 Luis`  
C. `5 Ana` y `6 Luis`  
D. Genera un error

## Pregunta 2

¿Qué ocurre con `zip([1, 2, 3], ["a", "b"])` sin `strict=True`?

A. Genera un error inmediatamente.  
B. Rellena el valor faltante con `None`.  
C. Se detiene al terminar la colección más corta.  
D. Repite `"b"`.

## Pregunta 3

¿Qué ventaja aporta `zip(..., strict=True)`?

A. Ordena las colecciones.  
B. Detecta longitudes diferentes al consumir el recorrido.  
C. Convierte los elementos en diccionarios.  
D. Elimina duplicados.

## Pregunta 4

¿Cuál comprensión conserva números positivos y guarda su cuadrado?

A. `[numero for numero ** 2 in numeros if numero > 0]`  
B. `[numero ** 2 for numero in numeros if numero > 0]`  
C. `[if numero > 0: numero ** 2 for numero in numeros]`  
D. `(numero > 0 for numero ** 2 in numeros)`

## Pregunta 5

¿Qué tipo de comprensión crea claves y valores?

A. `{valor for valor in datos}`  
B. `[clave: valor for dato in datos]`  
C. `{clave: valor for dato in datos}`  
D. `(clave, valor if dato in datos)`

## Pregunta 6

¿Qué ocurre en el segundo `list()`?

```python
valores = (n * 2 for n in range(3))
print(list(valores))
print(list(valores))
```

A. Imprime nuevamente `[0, 2, 4]`.  
B. Imprime `[]` porque el generador ya se consumió.  
C. Genera `TypeError`.  
D. Imprime `[0, 1, 2]`.

## Pregunta 7

¿Qué devuelve `max(productos, key=lambda p: p["precio"])`?

A. El número del precio mayor.  
B. El índice del producto.  
C. El producto completo cuya clave de comparación es mayor.  
D. Una lista ordenada.

## Pregunta 8

¿Cuál afirmación sobre `map()` es correcta en Python 3?

A. Siempre devuelve una lista.  
B. Devuelve un iterador.  
C. Solo funciona con funciones `lambda`.  
D. Elimina elementos falsos.

## Pregunta 9

¿Cuándo conviene reemplazar una `lambda` por una función con nombre?

A. Cuando la regla tiene varias decisiones o necesita explicación.  
B. Siempre que se ordenen números.  
C. Únicamente cuando la colección está vacía.  
D. Nunca; `lambda` siempre es más profesional.

## Pregunta 10

¿Cuál solución evita construir una lista intermedia al sumar subtotales?

A. `sum([precio * cantidad for precio, cantidad in lineas])`  
B. `sum(precio * cantidad for precio, cantidad in lineas)`  
C. `list(sum(precio * cantidad in lineas))`  
D. `map(sum, lineas)`

## Criterio de aprobación

Necesitas al menos 7 respuestas correctas. Si no alcanzas el resultado, repite las prácticas sobre `zip()`, comprensiones, generadores y `key` antes de intentarlo nuevamente.

---

# 11. Soluciones de las prácticas guiadas

Consulta estas soluciones únicamente después de completar tu intento.

## Solución 1

```python
alertas = [
    "PRD-04 tiene existencia cero",
    "PRD-07 está por debajo del mínimo",
    "PRD-09 no tiene precio",
]

for numero, alerta in enumerate(alertas, start=101):
    print(f"Alerta {numero}: {alerta}")
```

## Solución 2

```python
codigos = ["PRD-01", "PRD-02", "PRD-03"]
nombres = ["Teclado", "Ratón", "Monitor"]
precios = [18000, 9500, 85000]
existencias = [8, 15, 3]

columnas = [codigos, nombres, precios, existencias]
misma_longitud = len({len(columna) for columna in columnas}) == 1

if misma_longitud:
    catalogo = {
        codigo: {
            "nombre": nombre,
            "precio": precio,
            "existencia": existencia,
        }
        for codigo, nombre, precio, existencia in zip(
            codigos,
            nombres,
            precios,
            existencias,
            strict=True,
        )
    }
    print(catalogo)
else:
    print("No se puede construir el catálogo: las columnas no coinciden")
```

## Solución 3

```python
codigos_activos = [
    producto["codigo"]
    for producto in productos
    if producto["activo"]
]

precios_activos = {
    producto["codigo"]: producto["precio"]
    for producto in productos
    if producto["activo"]
}

categorias = {
    producto["categoria"].casefold()
    for producto in productos
}

codigos_de_precio_alto = [
    producto["codigo"]
    for producto in productos
    if producto["precio"] > 15000
]
```

## Solución 4

```python
todos_existen = all(
    codigo in inventario
    for codigo, cantidad in lineas
)

cantidades_validas = all(
    type(cantidad) is int and cantidad > 0
    for codigo, cantidad in lineas
)

hay_faltantes = any(
    cantidad > inventario[codigo]["existencia"]
    for codigo, cantidad in lineas
    if codigo in inventario
)

total = sum(
    inventario[codigo]["precio"] * cantidad
    for codigo, cantidad in lineas
)
```

El cálculo del total presupone que todos los códigos existen. En el proyecto debes comprobarlo antes.

Se utiliza `type(cantidad) is int` porque `bool` es una subclase de `int` en Python; `isinstance(True, int)` devolvería `True`, aunque un valor booleano no debe aceptarse como cantidad.

## Solución 5

```python
ORDEN_PRIORIDAD = {
    "urgente": 0,
    "alta": 1,
    "normal": 2,
}


def clave_de_orden(pedido):
    return (
        ORDEN_PRIORIDAD.get(pedido["prioridad"], 99),
        -pedido["total"],
        pedido["id"],
    )


pedidos_ordenados = sorted(pedidos, key=clave_de_orden)
pedido_mayor = max(
    pedidos,
    key=lambda pedido: pedido["total"],
    default=None,
)
```

La función con nombre permite probar la regla compuesta. La `lambda` del máximo contiene una sola operación y continúa siendo clara.

---

# 12. Retos adicionales

## Reto 1 — Reconstruir columnas

A partir de una lista de tuplas, utiliza `zip(*registros)` para recuperar columnas separadas. Explica qué ocurre si la lista está vacía y diseña una comprobación previa.

## Reto 2 — Pedidos destacados

Crea una comprensión que seleccione pedidos completos cuyo total supere un umbral configurable. No escribas el umbral en varios lugares.

## Reto 3 — Tres criterios intercambiables

Permite escoger una función `key` entre prioridad, total o cliente. Guarda las funciones en un diccionario y selecciona una mediante una clave.

## Reto 4 — Resumen por categoría sin `collections`

Calcula el valor solicitado por categoría utilizando diccionarios comunes. En el Módulo 3 compararás esta solución con `defaultdict`.

## Reto 5 — Medir materialización

Utiliza `sys.getsizeof()` para observar el tamaño superficial de una lista y de un generador equivalentes. La medición no representa toda la memoria interna, pero sirve para explorar la diferencia.

---

# 13. Videos recomendados

Los videos son complementarios. Ejecuta los ejemplos y modifica al menos uno después de cada video.

- [For con `enumerate()` y `zip()` — OMES](https://www.youtube.com/watch?v=r2O59Rdcelw)
- [Comprensión de listas en Python — UskoKruM2010](https://www.youtube.com/watch?v=JYmgIMfKjTQ)
- [`lambda`, `map()` y `filter()` en Python — Sklyvan](https://www.youtube.com/watch?v=r4nzoY_NNbk)

## Reproductores de video

[For con enumerate() y zip() — OMES](https://www.youtube.com/watch?v=r2O59Rdcelw)

[Comprensión de listas en Python — UskoKruM2010](https://www.youtube.com/watch?v=JYmgIMfKjTQ)

[lambda, map() y filter() en Python — Sklyvan](https://www.youtube.com/watch?v=r4nzoY_NNbk)

Después del tercer video, reescribe un ejemplo con una comprensión y decide cuál versión leerías con mayor facilidad dentro de seis meses.

---

# 14. Documentación y recursos de lectura

## Nivel esencial

- [Técnicas de iteración: `enumerate()` y `zip()`](https://docs.python.org/3/tutorial/datastructures.html#looping-techniques)
- [Comprensiones de listas](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
- [Funciones integradas: `enumerate`, `zip`, `map`, `filter` y `sorted`](https://docs.python.org/3/library/functions.html)

## Profundización práctica

- [Guía de programación funcional](https://docs.python.org/3/howto/functional.html)
- [Expresiones generadoras](https://docs.python.org/3/reference/expressions.html#generator-expressions)
- [Comprensiones de listas con ejemplos — Real Python](https://realpython.com/list-comprehension-python/)
- [Python Tutor: ejecución paso a paso](https://pythontutor.com/python.html)

## Práctica de documentación

Busca `zip()` en la documentación oficial y responde:

1. ¿Qué devuelve?
2. ¿Cuándo se evalúan las longitudes con `strict=True`?
3. ¿Qué excepción se produce si no coinciden?
4. ¿Desde qué versión existe `strict`?
5. ¿Qué ejemplo ofrece la documentación para agrupar elementos?

No memorices las respuestas. Practica el proceso de localizarlas.

---

# 15. Material descargable

El módulo incluye:

- `datos_inventario.py`: inventario y pedidos del proyecto.
- `plantilla_proyecto.py`: estructura funcional sin solución.
- `GUIA_DECISION_ITERACION.md`: comparación entre ciclos, comprensiones, generadores, `map()` y `filter()`.
- `CHECKLIST_PROYECTO.md`: comprobación previa a la entrega.

En la plantilla, `raise NotImplementedError` funciona únicamente como un marcador visible. Sustituye cada marcador por tu implementación antes de ejecutar el proyecto completo; no necesitas manejar esa excepción.

## Descargas

[Descargar todos los materiales del Módulo 2](/downloads/python-practico/modulo-2/python-practico-modulo-2-materiales.zip)

[Descargar datos_inventario.py](/downloads/python-practico/modulo-2/datos_inventario.py)

[Descargar plantilla_proyecto.py](/downloads/python-practico/modulo-2/plantilla_proyecto.py)

[Descargar GUIA_DECISION_ITERACION.md](/downloads/python-practico/modulo-2/GUIA_DECISION_ITERACION.md)

[Descargar CHECKLIST_PROYECTO.md](/downloads/python-practico/modulo-2/CHECKLIST_PROYECTO.md)

---

# 16. Errores comunes

## Mantener un contador manual innecesario

Si necesitas el elemento y una posición, `enumerate()` evita sincronizar otra variable.

## Utilizar el índice para volver a obtener el elemento

```python
for indice, producto in enumerate(productos):
    print(productos[indice])
```

Utiliza directamente `producto`.

## Ignorar el truncamiento de `zip()`

Cuando las colecciones representan columnas relacionadas, valida longitudes y utiliza `strict=True`.

## Construir un diccionario con claves repetidas

La última clave reemplaza las anteriores. Valida la unicidad si no se permiten duplicados.

## Modificar una lista mientras se recorre

Eliminar elementos desplaza las posiciones. Crea una nueva colección filtrada.

## Crear una comprensión demasiado compleja

Si necesitas descifrarla, utiliza un ciclo o funciones auxiliares.

## Utilizar una comprensión para imprimir

Una comprensión construye una colección. Para efectos como `print()`, utiliza un ciclo.

## Consumir un generador dos veces

Después del primer recorrido puede quedar vacío. Materialízalo solo si necesitas reutilizar los resultados.

## Convertir todo generador en lista automáticamente

La conversión elimina el beneficio de producir valores bajo demanda. Pregunta si realmente necesitas almacenar y recorrer varias veces.

## Confundir transformación con `key`

`key` decide cómo comparar; `sorted()` devuelve los elementos originales ordenados.

## Escribir una `lambda` extensa

Cuando la regla tiene varias decisiones, una función con nombre es más clara y comprobable.

## Suponer que `map()` devuelve una lista

En Python 3 devuelve un iterador. Consúmelo o conviértelo según la necesidad.

## Utilizar `filter(None, datos)` sin analizar valores falsos

Puede eliminar `0`, `False` y cadenas vacías aunque algunos sean datos válidos.

## Olvidar colecciones vacías

Recuerda `all([]) == True` y utiliza `default` con `min()` y `max()` cuando corresponda.

---

# 17. Glosario

| Término | Significado |
|---|---|
| Iteración | Proceso de recorrer elementos de una colección. |
| `enumerate()` | Función que produce pares de posición y elemento. |
| `zip()` | Función que agrupa elementos correspondientes de varios iterables. |
| Truncamiento | Finalización en la colección más corta, descartando elementos restantes. |
| `strict=True` | Opción de `zip()` que exige longitudes iguales. |
| Desempaquetado | Asignación de elementos de una secuencia a nombres separados. |
| Comprensión | Sintaxis para construir una colección mediante recorrido, transformación y filtrado. |
| Expresión generadora | Expresión que produce valores bajo demanda. |
| Evaluación perezosa | Cálculo de un valor únicamente cuando se solicita. |
| Materializar | Construir y almacenar los valores de un iterable, por ejemplo con `list()`. |
| Consumir | Recorrer un iterador hasta agotar sus valores. |
| `key` | Función que produce el criterio utilizado para comparar elementos. |
| `lambda` | Función anónima compuesta por una sola expresión. |
| `map()` | Función que aplica otra función a los elementos de uno o más iterables. |
| `filter()` | Función que conserva elementos aprobados por un predicado. |
| Predicado | Función que responde verdadero o falso para una condición. |
| Criterio compuesto | Tupla u otra clave con varios niveles de comparación. |

---

# 18. Resumen del módulo

Aprendiste a reemplazar recorridos accidentales por estructuras que comunican intención:

- `enumerate()` relaciona posiciones y elementos;
- `zip()` relaciona colecciones paralelas;
- las comprensiones construyen colecciones transformadas o filtradas;
- las expresiones generadoras producen valores bajo demanda;
- `sorted()`, `min()` y `max()` aceptan criterios personalizados;
- `map()`, `filter()` y `lambda` son opciones que deben elegirse por claridad, no por obligación.

También aprendiste que una herramienta breve puede esconder riesgos: `zip()` puede truncar, una comprensión puede volverse ilegible, un generador puede agotarse y `filter(None, ...)` puede descartar datos válidos.

## Habilidades obtenidas

- Recorridos numerados y paralelos.
- Validación de colecciones relacionadas.
- Transformación expresiva de listas, diccionarios y conjuntos.
- Uso de generadores con funciones integradas.
- Ordenamiento por reglas de negocio.
- Comparación razonada entre ciclos, comprensiones y funciones de orden superior.
- Construcción de un analizador de inventario y pedidos.

## Antes de continuar

- [ ] Puedo utilizar `enumerate()` sin administrar un contador manual.
- [ ] Comprendo cuándo `zip()` puede perder información.
- [ ] Sé utilizar `strict=True` después de validar longitudes.
- [ ] Puedo escribir comprensiones legibles de lista, diccionario y conjunto.
- [ ] Sé cuándo regresar a un ciclo normal.
- [ ] Comprendo que un generador se consume.
- [ ] Puedo ordenar por varios criterios con una función `key`.
- [ ] Puedo comparar `map()` y `filter()` con comprensiones.
- [ ] Completé las actividades obligatorias.
- [ ] Obtuve al menos 70% en la evaluación.
- [ ] El proyecto fue aprobado.

Cuando cumplas estas condiciones, estarás preparado para el **Módulo 3: Colecciones especializadas e iteradores**.
