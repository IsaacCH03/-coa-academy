# COA — Cursos Online Avanzados

## Python Práctico

# Módulo 5. Fechas, cálculos y simulaciones confiables

**Duración aproximada:** 2 horas  
**Modalidad:** práctica guiada, actividades obligatorias, proyecto y evaluación  
**Nivel:** intermedio  
**Tecnologías:** Python y biblioteca estándar  
**Resultado principal:** un planificador de vencimientos con métricas y costos precisos

---

## Bienvenida

Muchos errores de software no aparecen porque el programa desconozca una fórmula. Aparecen porque utiliza la herramienta incorrecta:

```text
"15/08/2026" se compara como texto
              ↓
el orden puede ser incorrecto

0.1 + 0.2 se calcula con float
              ↓
0.30000000000000004

una selección aleatoria cambia en cada prueba
              ↓
el error no puede reproducirse
```

Python incluye módulos especializados para resolver estos problemas sin reinventar calendarios, fórmulas estadísticas, generadores pseudoaleatorios ni aritmética monetaria.

En este módulo aprenderás a escoger entre:

- `datetime` para fechas, horas y duraciones;
- `math` para cálculos matemáticos concretos;
- `statistics` para describir colecciones numéricas;
- `random` para muestras y simulaciones reproducibles;
- `Decimal` para cálculos decimales que exigen exactitud controlada.

> **Principio del módulo:** un cálculo confiable comienza al representar correctamente el dato.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Diferenciar `date`, `time`, `datetime` y `timedelta`.
- Crear, comparar y modificar fechas sin operar manualmente con días o meses.
- Interpretar texto con `strptime()` y presentar fechas con `strftime()`.
- Calcular vencimientos, antigüedades y duraciones.
- Reconocer la diferencia entre objetos temporales con y sin zona horaria.
- Utilizar `zoneinfo` únicamente cuando el problema requiere zonas horarias reales.
- Elegir entre operadores, funciones integradas y el módulo `math`.
- Aplicar `ceil()`, `floor()`, `sqrt()` e `isclose()` en situaciones concretas.
- Calcular media, mediana, moda y dispersión con `statistics`.
- Distinguir una población completa de una muestra.
- Seleccionar datos con y sin reemplazo mediante `random`.
- Reproducir una simulación mediante una semilla controlada.
- Reconocer cuándo debe utilizarse `secrets` en lugar de `random`.
- Explicar por qué algunos decimales no se representan exactamente con `float`.
- Construir valores `Decimal` correctamente a partir de texto.
- Aplicar una política explícita de redondeo con `quantize()`.
- Crear un reporte que combine vencimientos, métricas, muestras y dinero.

---

## Conocimientos que utilizarás

Necesitas poder:

- crear funciones y recorrer colecciones;
- trabajar con diccionarios;
- convertir texto a `int` y `float`;
- ordenar mediante `key`;
- utilizar comprensiones;
- capturar errores específicos básicos;
- importar módulos de la biblioteca estándar;
- leer archivos de datos sencillos si decides ampliar el proyecto.

No se enseñará nuevamente la lógica de condicionales, ciclos o funciones. El objetivo es utilizar herramientas especializadas sobre problemas reales.

---

## Producto que construirás

Desarrollarás un **Planificador de vencimientos y reporte de métricas**. El programa recibirá tareas con fecha límite, duración, prioridad y costo estimado.

```text
Tareas recibidas
      │
      ├─ interpretar fechas
      ├─ validar duración y costo
      ├─ calcular días restantes
      ├─ clasificar vencimientos
      ├─ resumir duraciones
      ├─ calcular costos exactos
      └─ elegir muestra reproducible
               ↓
        Reporte profesional
```

El reporte responderá preguntas útiles:

- ¿Qué tareas están vencidas?
- ¿Cuáles vencen durante los próximos siete días?
- ¿Cuántas sesiones de trabajo requiere cada tarea?
- ¿Cuál es la duración media y mediana?
- ¿Qué tan dispersas son las estimaciones?
- ¿Cuál es el subtotal, el impuesto y el total?
- ¿Qué tareas forman la muestra de revisión?
- ¿Puede otra persona obtener exactamente la misma muestra?

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Fechas, horas y duraciones con `datetime` | 18 min |
| 2. Cálculos útiles con `math` | 7 min |
| 3. Estadística descriptiva con `statistics` | 8 min |
| 4. Aleatoriedad reproducible con `random` | 7 min |
| 5. Precisión monetaria con `Decimal` | 10 min |
| 6. Prácticas guiadas | 15 min |
| 7. Actividades obligatorias | 10 min |
| 8. Proyecto del módulo | 35 min |
| 9. Evaluación y cierre | 10 min |
| **Total** | **2 horas** |

Los retos opcionales requieren tiempo adicional.

---

# 1. Fechas, horas y duraciones con `datetime`

## 1.1. Cuatro conceptos diferentes

El módulo se llama `datetime`, pero contiene varios tipos:

| Tipo | Representa | Ejemplo de uso |
|---|---|---|
| `date` | Una fecha sin hora | Fecha límite de una tarea |
| `time` | Una hora sin fecha | Hora habitual de apertura |
| `datetime` | Fecha y hora juntas | Momento de creación de un reporte |
| `timedelta` | Una duración o diferencia | Siete días, dos horas o 30 minutos |

```python
from datetime import date, datetime, time, timedelta


fecha_limite = date(2026, 8, 22)
hora_apertura = time(8, 30)
momento_revision = datetime(2026, 8, 15, 14, 45)
duracion = timedelta(days=7, hours=2)

print(fecha_limite)
print(hora_apertura)
print(momento_revision)
print(duracion)
```

No utilices una cadena cuando el programa necesita comparar, ordenar o calcular fechas. El texto `"2026-08-22"` describe una fecha para una persona; un objeto `date` permite trabajar con ella.

## 1.2. Crear una fecha válida

```python
from datetime import date


inicio = date(2026, 8, 15)
fin = date(2026, 8, 22)

print(inicio.year)      # 2026
print(inicio.month)     # 8
print(inicio.day)       # 15
print(inicio.weekday()) # 5: sábado
```

`weekday()` utiliza el rango de 0 a 6:

```text
0 lunes
1 martes
2 miércoles
3 jueves
4 viernes
5 sábado
6 domingo
```

Python valida el calendario:

```python
from datetime import date


fecha_imposible = date(2026, 2, 30)  # ValueError
```

No necesitas escribir reglas manuales para recordar cuántos días tiene febrero.

## 1.3. Obtener la fecha actual según la necesidad

```python
from datetime import date, datetime


hoy = date.today()
ahora_local = datetime.now()
```

- Usa `date.today()` si solo importa el día.
- Usa `datetime.now()` si también importa la hora local.
- No obtengas `datetime.now()` para después ignorar la hora si `date.today()` expresa mejor la intención.

En programas que deben probarse, conviene recibir la fecha de referencia como argumento:

```python
from datetime import date


def dias_hasta(fecha_limite, referencia=None):
    if referencia is None:
        referencia = date.today()

    return (fecha_limite - referencia).days


referencia_prueba = date(2026, 8, 15)
limite = date(2026, 8, 22)

print(dias_hasta(limite, referencia_prueba))  # 7
```

Esta función puede utilizar la fecha real en producción y una fecha fija durante las pruebas.

## 1.4. Comparar fechas

Los objetos del mismo tipo pueden compararse directamente:

```python
from datetime import date


hoy = date(2026, 8, 15)
limite = date(2026, 8, 12)

if limite < hoy:
    print("La tarea está vencida.")
elif limite == hoy:
    print("La tarea vence hoy.")
else:
    print("La tarea continúa vigente.")
```

Evita comparar cadenas con formatos distintos:

```python
"30/01/2026" < "02/02/2026"  # compara caracteres, no fechas
```

## 1.5. Aritmética mediante `timedelta`

Restar fechas produce una duración:

```python
from datetime import date, timedelta


inicio = date(2026, 8, 15)
limite = date(2026, 8, 22)

diferencia = limite - inicio
print(diferencia)       # 7 days, 0:00:00
print(diferencia.days)  # 7

nueva_fecha = inicio + timedelta(days=30)
print(nueva_fecha)      # 2026-09-14
```

`timedelta(days=30)` significa exactamente treinta días. No significa “un mes calendario”. Los meses tienen longitudes distintas y la biblioteca estándar no incluye una duración llamada “un mes”.

### Error común: utilizar `.seconds` como duración total

```python
from datetime import timedelta


duracion = timedelta(days=2, seconds=3600)

print(duracion.seconds)          # 3600
print(duracion.total_seconds())  # 176400.0
```

`.seconds` contiene solo la parte de segundos restante dentro del día. Para convertir la duración completa, utiliza `total_seconds()`.

## 1.6. Convertir texto a fecha con `strptime()`

Los datos externos suelen llegar como texto:

```python
from datetime import datetime


texto = "22/08/2026"
fecha = datetime.strptime(texto, "%d/%m/%Y").date()

print(fecha)        # 2026-08-22
print(type(fecha))  # <class 'datetime.date'>
```

Directivas frecuentes:

| Directiva | Significado | Ejemplo |
|---|---|---|
| `%Y` | Año con cuatro dígitos | `2026` |
| `%m` | Mes con dos dígitos | `08` |
| `%d` | Día con dos dígitos | `22` |
| `%H` | Hora de 00 a 23 | `14` |
| `%M` | Minutos | `45` |
| `%S` | Segundos | `09` |

El patrón debe describir exactamente el texto:

```python
from datetime import datetime


formatos = {
    "2026-08-22": "%Y-%m-%d",
    "22/08/2026": "%d/%m/%Y",
    "22-08-2026 14:30": "%d-%m-%Y %H:%M",
}

for texto, formato in formatos.items():
    valor = datetime.strptime(texto, formato)
    print(valor)
```

Una fecha imposible o un formato distinto producen `ValueError`. Captura ese error cerca del límite donde entra el dato:

```python
from datetime import datetime


def interpretar_fecha(texto, formato="%Y-%m-%d"):
    try:
        return datetime.strptime(texto, formato).date()
    except ValueError:
        return None
```

En un programa profesional conviene conservar también el texto original y explicar por qué fue rechazado.

## 1.7. Convertir una fecha a texto con `strftime()`

```python
from datetime import date


fecha = date(2026, 8, 22)

print(fecha.strftime("%Y-%m-%d"))  # 2026-08-22
print(fecha.strftime("%d/%m/%Y"))  # 22/08/2026
```

La dirección de las operaciones puede recordarse así:

```text
texto  ── strptime() ──> datetime
fecha  ── strftime() ──> string
```

`strptime()` interpreta; `strftime()` formatea.

Para almacenar e intercambiar fechas simples, el formato ISO `AAAA-MM-DD` es una excelente opción porque es inequívoco y se ordena correctamente como texto cuando todas las fechas siguen el mismo formato.

## 1.8. `fromisoformat()` e `isoformat()`

Cuando el texto ya utiliza un formato ISO compatible, no necesitas escribir el patrón:

```python
from datetime import date, datetime


fecha = date.fromisoformat("2026-08-22")
momento = datetime.fromisoformat("2026-08-22T14:30:00")

print(fecha.isoformat())
print(momento.isoformat())
```

Utiliza:

- `fromisoformat()` cuando el contrato de entrada exige ISO;
- `strptime()` cuando debes interpretar otro formato conocido;
- nunca “adivines” formatos ambiguos sin una regla definida.

## 1.9. Reemplazar componentes

Los objetos temporales son inmutables. `replace()` devuelve otro objeto:

```python
from datetime import date


original = date(2026, 8, 22)
corregida = original.replace(day=25)

print(original)   # 2026-08-22
print(corregida)  # 2026-08-25
```

No utilices `replace(month=mes + 1)` para sumar un mes: diciembre, las distintas longitudes de los meses y los días inexistentes requieren reglas de negocio que `replace()` no inventará por ti.

## 1.10. Fechas con y sin zona horaria

Un `datetime` sin zona horaria es **ingenuo** (*naive*):

```python
from datetime import datetime


momento = datetime(2026, 8, 15, 9, 0)
print(momento.tzinfo)  # None
```

Un `datetime` consciente (*aware*) conoce su zona o desplazamiento:

```python
from datetime import datetime
from zoneinfo import ZoneInfo


costa_rica = ZoneInfo("America/Costa_Rica")
momento = datetime(2026, 8, 15, 9, 0, tzinfo=costa_rica)

print(momento.isoformat())
```

Utiliza zonas horarias cuando el significado del problema lo exige, por ejemplo:

- reuniones entre países;
- registros de eventos distribuidos;
- fechas de publicación global;
- vencimientos definidos para una zona específica.

Si una tarea vence por día y no por una hora exacta, un objeto `date` suele ser suficiente y más claro.

> No compares un `datetime` ingenuo con uno consciente. Define primero qué representa cada valor y normaliza la estrategia temporal de la aplicación.

---

# 2. Cálculos útiles con `math`

## 2.1. Antes de importar, elige la herramienta más simple

Python ofrece tres niveles habituales:

| Necesidad | Herramienta |
|---|---|
| Operaciones comunes | `+`, `-`, `*`, `/`, `//`, `%`, `**` |
| Resúmenes de iterables | `sum()`, `min()`, `max()` |
| Funciones matemáticas especializadas | módulo `math` |

No importes `math` para calcular `cantidad * precio`. Sí utilízalo cuando la operación tiene un nombre y una implementación estándar.

## 2.2. `ceil()` y `floor()`

```python
import math


horas = 7.2
capacidad_por_sesion = 2.5

sesiones_necesarias = math.ceil(horas / capacidad_por_sesion)
sesiones_completas = math.floor(horas / capacidad_por_sesion)

print(sesiones_necesarias)  # 3
print(sesiones_completas)   # 2
```

- `ceil(x)` redondea hacia arriba.
- `floor(x)` redondea hacia abajo.

No sustituyas estas reglas con `round()`. Redondear al valor más cercano no responde la pregunta “¿cuántas cajas necesito para guardar todos los objetos?”.

## 2.3. `sqrt()` y `hypot()`

```python
import math


area = 81
lado = math.sqrt(area)
diagonal = math.hypot(3, 4)

print(lado)      # 9.0
print(diagonal)  # 5.0
```

`hypot()` expresa directamente el cálculo de una distancia euclidiana y puede ser más claro que reconstruir manualmente la fórmula.

## 2.4. Igualdad exacta frente a cercanía

```python
resultado = 0.1 + 0.2
print(resultado == 0.3)  # False
```

Para comprobar resultados aproximados de punto flotante:

```python
import math


print(math.isclose(0.1 + 0.2, 0.3))  # True
```

Puedes controlar tolerancias:

```python
math.isclose(valor_obtenido, valor_esperado, rel_tol=1e-9, abs_tol=1e-12)
```

- `rel_tol` compara el error en relación con el tamaño de los valores.
- `abs_tol` establece un margen absoluto, especialmente útil cerca de cero.

`isclose()` no convierte un cálculo monetario inexacto en exacto. Para dinero se utilizará `Decimal`.

## 2.5. Funciones y constantes que merece la pena reconocer

```python
import math


print(math.pi)
print(math.e)
print(math.gcd(24, 36))
print(math.lcm(6, 8))
print(math.fsum([0.1] * 10))
```

No necesitas memorizar todo el módulo. Aprende a reconocer que la herramienta existe y consulta la documentación cuando el problema lo requiera.

---

# 3. Estadística descriptiva con `statistics`

## 3.1. Describir datos sin convertir el módulo en ciencia de datos

El módulo `statistics` resume una colección mediante medidas conocidas. No sustituye el análisis del contexto.

```python
from statistics import mean, median, multimode


duraciones = [2, 2.5, 3, 4, 8]

print(mean(duraciones))       # 3.9
print(median(duraciones))     # 3
print(multimode(duraciones))  # [2, 2.5, 3, 4, 8]
```

En esta colección todos los valores aparecen una sola vez; por eso `multimode()` devuelve todos. No siempre existe una moda útil.

## 3.2. Media y mediana responden preguntas distintas

```python
from statistics import mean, median


duraciones = [2, 2, 3, 3, 20]

print(mean(duraciones))    # 6
print(median(duraciones))  # 3
```

La tarea de 20 horas eleva la media. La mediana permanece cerca del centro de la mayoría de observaciones.

- **Media:** utiliza todos los valores; es sensible a extremos.
- **Mediana:** representa el centro después de ordenar; resiste mejor valores extremos.

No elijas una medida solo porque su función es fácil de llamar. Explica cuál describe mejor el problema.

## 3.3. `mode()` y `multimode()`

```python
from statistics import mode, multimode


prioridades = ["alta", "media", "alta", "media", "baja"]

print(mode(prioridades))       # alta: la primera entre las empatadas
print(multimode(prioridades))  # ['alta', 'media']
```

Cuando un empate importa, `multimode()` evita ocultarlo.

## 3.4. Dispersión: no basta con conocer el promedio

Estas colecciones tienen la misma media:

```text
A = [4, 4, 4, 4, 4]
B = [1, 2, 4, 6, 7]
```

Sin embargo, B está mucho más dispersa. La desviación estándar resume cuánto tienden a alejarse los valores del centro.

```python
from statistics import pstdev, stdev


datos = [1, 2, 4, 6, 7]

print(pstdev(datos))  # desviación de una población completa
print(stdev(datos))   # estimación a partir de una muestra
```

Utiliza:

- `pstdev()` cuando los datos representan toda la población que deseas describir;
- `stdev()` cuando los datos son una muestra usada para estimar una población mayor.

En el proyecto se analizarán todas las tareas aceptadas del conjunto recibido, por lo que se utilizará `pstdev()`.

## 3.5. Colecciones vacías y tamaños insuficientes

```python
from statistics import StatisticsError, mean, stdev


try:
    print(mean([]))
except StatisticsError:
    print("No hay datos para calcular la media.")

try:
    print(stdev([5]))
except StatisticsError:
    print("Se necesitan al menos dos observaciones.")
```

Valida el tamaño antes de calcular. Un reporte debe decir “sin datos suficientes”, no inventar un cero estadístico.

---

# 4. Aleatoriedad reproducible con `random`

## 4.1. Pseudoaleatoriedad

`random` genera valores mediante un algoritmo determinista cuyo estado inicial puede controlarse. Es adecuado para:

- simulaciones;
- juegos no relacionados con dinero real;
- selección de casos de prueba;
- muestras educativas;
- datos ficticios.

No es adecuado para contraseñas, enlaces de recuperación, tokens o claves. Para seguridad utiliza `secrets`.

## 4.2. Elegir la función correcta

```python
import random


opciones = ["alta", "media", "baja"]

print(random.randint(1, 6))
print(random.choice(opciones))
print(random.choices(opciones, weights=[2, 5, 3], k=4))
print(random.sample(opciones, k=2))
```

| Función | Resultado | ¿Puede repetir? |
|---|---|---|
| `randint(a, b)` | Entero entre `a` y `b`, ambos incluidos | Sí entre llamadas |
| `choice(datos)` | Un elemento | Sí entre llamadas |
| `choices(datos, k=n)` | Lista de `n` elecciones | Sí |
| `sample(datos, k=n)` | Muestra de `n` elementos | No |

`sample()` produce un error si `k` supera el tamaño de la población. Valida el tamaño o limita la muestra de forma explícita.

## 4.3. `shuffle()` modifica la lista

```python
import random


original = ["A", "B", "C", "D"]
copia = original.copy()

random.shuffle(copia)

print(original)  # conserva el orden
print(copia)     # orden mezclado
```

`shuffle()` trabaja en el lugar y devuelve `None`. Si necesitas conservar el orden inicial, mezcla una copia.

## 4.4. Semillas y pruebas reproducibles

```python
import random


random.seed(42)
print(random.sample(range(1, 11), k=3))
```

La misma semilla permite reproducir la secuencia dentro de condiciones equivalentes. Esto ayuda a:

- repetir un error;
- comparar dos implementaciones;
- comprobar resultados educativos;
- documentar una simulación.

Sin embargo, `random.seed()` cambia el generador global del módulo. En una función o aplicación compartida, una instancia independiente suele ser más segura:

```python
import random


generador = random.Random(42)
muestra = generador.sample(range(1, 11), k=3)
```

El proyecto utilizará `random.Random(semilla)` para no alterar otras operaciones aleatorias del programa.

## 4.5. Reproducible no significa seguro

Una semilla conocida permite reconstruir la secuencia. Para crear un token:

```python
import secrets


token = secrets.token_urlsafe(24)
print(token)
```

No se profundizará en criptografía. La decisión importante es clara:

```text
simulación, juego o muestra  → random
contraseña, token o seguridad → secrets
```

---

# 5. Precisión decimal

## 5.1. El problema no es exclusivo de Python

Muchos valores decimales no tienen una representación binaria finita:

```python
print(0.1 + 0.2)
print((0.1 + 0.2) == 0.3)
```

Resultado:

```text
0.30000000000000004
False
```

Para mediciones aproximadas, gráficos o cálculos científicos, `float` suele ser apropiado y `math.isclose()` permite comparar tolerancias. Para dinero y otras reglas decimales exactas, utiliza `Decimal`.

## 5.2. Construir `Decimal` correctamente

```python
from decimal import Decimal


precio = Decimal("0.10")
impuesto = Decimal("0.20")

print(precio + impuesto)  # 0.30
```

Evita construirlo desde un `float` ya aproximado:

```python
from decimal import Decimal


incorrecto = Decimal(0.1)
correcto = Decimal("0.1")

print(incorrecto)
print(correcto)
```

Si el dato externo llega como texto, pásalo directamente a `Decimal` después de validarlo.

Si ya tienes un entero, es seguro construir desde él:

```python
cantidad = Decimal(3)
```

## 5.3. No mezclar `Decimal` y `float`

```python
from decimal import Decimal


precio = Decimal("10.50")
# total = precio * 1.13  # TypeError
total = precio * Decimal("1.13")
```

Mantén toda la cadena monetaria en `Decimal`: valores, tasas, subtotales, impuestos y totales.

## 5.4. Redondear con una política explícita

`quantize()` ajusta el número de posiciones decimales:

```python
from decimal import Decimal, ROUND_HALF_UP


CENTAVO = Decimal("0.01")
valor = Decimal("10.125")
redondeado = valor.quantize(CENTAVO, rounding=ROUND_HALF_UP)

print(redondeado)  # 10.13
```

La política de redondeo pertenece al problema. `ROUND_HALF_UP` es frecuente en ejemplos comerciales, pero una organización puede exigir otra regla. No la elijas silenciosamente.

## 5.5. Ejemplo monetario completo

```python
from decimal import Decimal, ROUND_HALF_UP


CENTAVO = Decimal("0.01")
TASA_IMPUESTO = Decimal("0.13")

costos = [Decimal("18.50"), Decimal("25.00"), Decimal("42.75")]
subtotal = sum(costos, start=Decimal("0.00"))
impuesto = (subtotal * TASA_IMPUESTO).quantize(
    CENTAVO,
    rounding=ROUND_HALF_UP,
)
total = subtotal + impuesto

print(f"Subtotal: ₡{subtotal:,.2f}")
print(f"Impuesto: ₡{impuesto:,.2f}")
print(f"Total:    ₡{total:,.2f}")
```

Se redondea el impuesto después de calcularlo sobre el subtotal. Si una regla exige redondear el impuesto de cada línea por separado, el resultado podría cambiar. Documenta siempre el momento del redondeo.

## 5.6. Validar entradas decimales

```python
from decimal import Decimal, InvalidOperation


def convertir_decimal(texto):
    try:
        valor = Decimal(texto.strip())
    except InvalidOperation:
        return None

    if not valor.is_finite():
        return None

    return valor
```

`Decimal` también reconoce valores especiales como `NaN` e `Infinity`. En un costo normal deben rechazarse mediante `is_finite()`.

> El texto `"48,90"` no utiliza el punto esperado por `Decimal`. Decide si el contrato lo rechaza o si existe una normalización autorizada; no reemplaces toda coma sin conocer el formato de entrada.

---

# 6. Prácticas guiadas

## Práctica guiada 1 — Interpretar y clasificar fechas

Recibes:

```python
fechas = [
    "2026-08-10",
    "2026-08-15",
    "2026-08-18",
    "2026-02-30",
    "18/08/2026",
]
```

Utiliza como referencia `date(2026, 8, 15)`. Para cada texto:

1. interprétalo únicamente como `%Y-%m-%d`;
2. conserva el texto original;
3. registra `"fecha inválida"` si no cumple el contrato;
4. calcula la diferencia en días;
5. clasifica el valor válido como `vencida`, `vence_hoy`, `próxima` o `vigente`;
6. considera próxima una fecha entre 1 y 7 días inclusive.

Resultado esperado:

| Texto | Resultado |
|---|---|
| `2026-08-10` | vencida, 5 días de atraso |
| `2026-08-15` | vence hoy |
| `2026-08-18` | próxima, faltan 3 días |
| `2026-02-30` | fecha inválida |
| `18/08/2026` | formato inválido para este contrato |

## Práctica guiada 2 — Capacidad y tolerancia

Una sesión permite trabajar 2.5 horas. Calcula con `math.ceil()` cuántas sesiones completas deben reservarse para duraciones de:

```python
duraciones = [1, 2.5, 2.6, 5, 7.2]
```

Después comprueba con `math.isclose()` si estos pares pueden considerarse equivalentes con `abs_tol=0.001`:

```python
pares = [
    (2.0001, 2.0),
    (2.01, 2.0),
    (0.1 + 0.2, 0.3),
]
```

Explica por qué `round()` no sustituye a `ceil()` en la reserva de sesiones.

## Práctica guiada 3 — Elegir estadísticas útiles

Compara estas dos colecciones:

```python
equipo_a = [4, 4, 4, 4, 4]
equipo_b = [1, 2, 4, 6, 7]
```

Para cada equipo calcula:

- media;
- mediana;
- rango con `max() - min()`;
- desviación estándar poblacional.

Responde:

1. ¿Cuál tiene estimaciones más consistentes?
2. ¿Por qué la media no permite descubrir por sí sola la diferencia?
3. ¿Por qué corresponde `pstdev()` y no `stdev()` si esas listas contienen todas las tareas de cada equipo?

## Práctica guiada 4 — Muestras reproducibles

```python
tareas = ["T-001", "T-002", "T-003", "T-004", "T-005", "T-006"]
```

1. Crea una instancia `random.Random(25)`.
2. Obtén una muestra de tres tareas sin reemplazo.
3. Crea una segunda instancia con la misma semilla y repite.
4. Comprueba que ambas muestras son iguales.
5. Cambia la semilla y observa el resultado.
6. Intenta solicitar siete elementos y explica el `ValueError`.

No utilices la muestra como mecanismo de seguridad o de autorización.

## Práctica guiada 5 — Corregir un cálculo monetario

Parte de este código:

```python
precios = [19.99, 4.95, 0.10]
subtotal = sum(precios)
impuesto = subtotal * 0.13
total = subtotal + impuesto
```

Reescríbelo con:

- valores `Decimal` construidos desde texto;
- suma iniciada con `Decimal("0.00")`;
- impuesto del 13 %;
- redondeo del impuesto a dos decimales mediante `ROUND_HALF_UP`;
- total calculado después del redondeo;
- presentación con dos decimales.

Explica por qué formatear un `float` con dos decimales solo cambia la presentación y no corrige su representación interna.

---

# 7. Actividades obligatorias

## Actividad 1 — Contratos de fecha

Recibes estas entradas:

```text
2026-09-03
03/09/2026
03-09-26
2026-13-01
texto
```

Define dos contratos independientes:

- contrato A: `%Y-%m-%d`;
- contrato B: `%d/%m/%Y`.

Procesa cada entrada contra ambos contratos y construye una tabla que indique:

- texto original;
- contrato utilizado;
- fecha resultante o motivo de rechazo.

No aceptes `03-09-26` mediante adivinación automática.

## Actividad 2 — Clasificador de vencimientos

Crea una función que reciba una fecha límite y una fecha de referencia. Debe devolver:

- `"vencida"` si la diferencia es negativa;
- `"vence_hoy"` si es cero;
- `"próxima"` si está entre 1 y 7;
- `"vigente"` si supera 7.

Entrega pruebas para los límites `-1`, `0`, `1`, `7` y `8` días. Explica por qué probar únicamente un valor central no sería suficiente.

## Actividad 3 — Comparaciones numéricas

Para cada caso decide si corresponde `==`, `math.isclose()` o `Decimal`:

1. comprobar si dos contadores enteros son iguales;
2. comparar el resultado aproximado de una medición física;
3. verificar el total de una factura;
4. comprobar que tres porcentajes calculados suman aproximadamente 100;
5. comparar dos códigos escritos como texto.

Incluye un ejemplo ejecutable de los casos 2, 3 y 4.

## Actividad 4 — Informe estadístico responsable

Utiliza:

```python
duraciones = [2, 2.5, 3, 3.5, 4, 20]
```

Calcula media, mediana, rango y `pstdev()`. Redacta tres conclusiones:

- cómo afecta el valor 20 a la media;
- qué medida central representa mejor la duración habitual;
- qué no puede concluirse únicamente con esas cifras.

No afirmes causas que los datos no contienen.

## Actividad 5 — Aleatoriedad con intención

Implementa estos tres casos:

1. seleccionar un ganador donde una persona puede aparecer una sola vez;
2. simular 20 elecciones ponderadas entre tres resultados;
3. crear un token de recuperación.

Utiliza `sample()` o `choice()` según corresponda, `choices()` para la simulación y `secrets` para el token. Justifica cada elección y demuestra que la simulación puede reproducirse con una semilla.

## Actividad 6 — Política monetaria

Una factura contiene tres líneas:

```text
2 × 12.35
3 × 4.10
1 × 0.99
```

Calcula:

- subtotal;
- impuesto del 13 % redondeado a dos decimales;
- total final.

Utiliza exclusivamente `Decimal` para los valores monetarios. Indica:

- cómo construiste cada decimal;
- qué política de redondeo aplicaste;
- en qué momento redondeaste;
- por qué esa decisión debe formar parte del contrato del sistema.

---

# 8. Proyecto del módulo — Planificador de vencimientos y reporte de métricas

## 8.1. Situación profesional

Un equipo administra tareas con fechas límite, duraciones estimadas, prioridades y costos. La información necesita transformarse en un reporte útil para tomar decisiones.

El equipo no desea un programa que solo imprima los datos recibidos. Necesita conocer:

- tareas vencidas y próximas;
- días de atraso o días restantes;
- sesiones necesarias para completar el trabajo;
- comportamiento general de las duraciones;
- costo total con una política decimal definida;
- una muestra reproducible para revisión de calidad;
- registros que no pudieron analizarse y todos sus problemas.

## 8.2. Producto que debes construir

Desarrolla un programa de consola llamado **Planificador de vencimientos y reporte de métricas**.

Debe procesar `TAREAS` desde el material descargable y generar un reporte ordenado. Durante las pruebas utilizará:

```python
FECHA_REFERENCIA = "2026-08-15"
SEMILLA_MUESTRA = 20260815
TAMANIO_MUESTRA = 3
HORAS_POR_SESION = 2.5
TASA_IMPUESTO = "0.13"
```

Estos valores controlados permiten comparar resultados. La fecha de referencia no debe obtenerse automáticamente durante la evaluación.

## 8.3. Estructura de cada tarea

```python
{
    "id": "T-001",
    "titulo": "Renovar dominio",
    "fecha_limite": "2026-08-10",
    "duracion_horas": "1.5",
    "prioridad": "alta",
    "costo_estimado": "18.50",
}
```

Todos los valores llegan como texto porque podrían provenir de un CSV, un JSON o un formulario. El programa debe convertirlos explícitamente.

## 8.4. Reglas de validación

### Identificador

- Debe respetar el patrón `T-` seguido por tres dígitos.
- No puede repetirse.

### Título

- Debe contener texto después de eliminar espacios exteriores.

### Fecha límite

- Debe utilizar exactamente `%Y-%m-%d`.
- Debe representar una fecha posible.

### Duración

- Debe convertirse a `float`.
- Debe ser finita y mayor que cero.

### Prioridad

- Debe ser `alta`, `media` o `baja` después de normalizarla.

### Costo

- Debe construirse como `Decimal` directamente desde el texto.
- Debe ser finito e igual o mayor que cero.
- No normalices una coma decimal a menos que el contrato lo permita. En este proyecto, `"48,90"` es inválido.

Una tarea con varios problemas debe registrar todos los que puedan detectarse en una sola revisión.

## 8.5. Clasificación temporal

Después de convertir la fecha, calcula:

```python
diferencia = fecha_limite - fecha_referencia
dias = diferencia.days
```

Clasifica así:

| Diferencia | Estado |
|---:|---|
| Menor que 0 | `vencida` |
| Igual a 0 | `vence_hoy` |
| De 1 a 7 | `próxima` |
| Mayor que 7 | `vigente` |

Para una tarea vencida, el reporte debe mostrar los días de atraso como un valor positivo. Conserva también la diferencia con signo dentro del registro procesado.

## 8.6. Sesiones de trabajo

Cada sesión admite 2.5 horas. Calcula:

```python
sesiones = math.ceil(duracion_horas / HORAS_POR_SESION)
```

No utilices `round()`: incluso una fracción pequeña de sesión adicional exige reservar otra sesión.

## 8.7. Estadísticas requeridas

Con las duraciones de todas las tareas aceptadas calcula:

- cantidad de observaciones;
- suma total de horas;
- media;
- mediana;
- mínimo;
- máximo;
- rango;
- desviación estándar poblacional mediante `pstdev()`.

Calcula además las prioridades más frecuentes mediante `multimode()`. El conjunto de prueba contiene un empate que debe preservarse.

Si no existen tareas válidas, el programa debe informar que no hay métricas disponibles. No debe presentar ceros como si fueran estadísticas observadas.

## 8.8. Cálculos monetarios

Utiliza estas constantes:

```python
from decimal import Decimal, ROUND_HALF_UP


CENTAVO = Decimal("0.01")
TASA_IMPUESTO = Decimal("0.13")
```

Calcula:

1. subtotal como suma de todos los costos aceptados;
2. impuesto sobre el subtotal;
3. impuesto redondeado a dos decimales con `ROUND_HALF_UP`;
4. total como `subtotal + impuesto_redondeado`.

No conviertas los valores a `float` en ninguna parte del cálculo monetario.

## 8.9. Muestra de revisión

Selecciona tres identificadores entre las tareas aceptadas:

```python
generador = random.Random(SEMILLA_MUESTRA)
muestra = generador.sample(identificadores, k=TAMANIO_MUESTRA)
```

La lista de candidatos debe conservar el orden original de las tareas aceptadas. No la construyas desde un `set`, porque su orden no representa el orden de entrada.

Si existen menos tareas que el tamaño solicitado, el proyecto debe tomar una decisión explícita:

- reducir `k` mediante `min()` e informarlo; o
- rechazar la solicitud con un mensaje claro.

Documenta la estrategia elegida.

## 8.10. Reporte obligatorio

El reporte de consola debe contener seis bloques.

### Bloque 1 — Contexto

- fecha de referencia;
- formato de fecha aceptado;
- horas por sesión;
- tasa de impuesto;
- semilla y tamaño de muestra.

### Bloque 2 — Resumen de procesamiento

- registros recibidos;
- tareas aceptadas;
- tareas rechazadas;
- cantidad por estado temporal.

### Bloque 3 — Agenda ordenada

Ordena las tareas aceptadas por:

1. fecha límite ascendente;
2. prioridad, con el orden `alta`, `media`, `baja`;
3. identificador.

Muestra como mínimo:

```text
ID     FECHA        ESTADO       DÍAS   SESIONES   PRIORIDAD   COSTO
```

Para `DÍAS`, presenta `5 de atraso`, `vence hoy` o `faltan 7` según corresponda.

### Bloque 4 — Métricas

- total de horas;
- media y mediana;
- mínimo, máximo y rango;
- desviación estándar poblacional;
- prioridades más frecuentes;
- total de sesiones.

### Bloque 5 — Costos y muestra

- subtotal;
- impuesto;
- total;
- semilla utilizada;
- identificadores seleccionados.

### Bloque 6 — Rechazos

Por cada tarea rechazada muestra:

- posición original;
- identificador original;
- registro original;
- lista completa de problemas.

## 8.11. Arquitectura mínima recomendada

```python
def interpretar_fecha(texto):
    ...


def interpretar_duracion(texto):
    ...


def interpretar_costo(texto):
    ...


def validar_y_transformar_tarea(tarea, posicion, ids_vistos, referencia):
    ...


def clasificar_vencimiento(dias):
    ...


def calcular_sesiones(duracion, capacidad):
    ...


def procesar_tareas(tareas, referencia):
    ...


def calcular_estadisticas(tareas_aceptadas):
    ...


def calcular_costos(tareas_aceptadas):
    ...


def seleccionar_muestra(tareas_aceptadas, semilla, cantidad):
    ...


def ordenar_agenda(tareas_aceptadas):
    ...


def construir_reporte(...):
    ...


def main():
    ...
```

Puedes adaptar los nombres, pero cada función debe tener una responsabilidad reconocible.

## 8.12. Flujo recomendado

```text
INICIO
  │
  ├─ Interpretar fecha de referencia
  ├─ Recorrer tareas
  │    ├─ conservar original
  │    ├─ normalizar campos
  │    ├─ convertir fecha, duración y costo
  │    ├─ acumular problemas
  │    └─ aceptar o rechazar
  │
  ├─ Ordenar agenda aceptada
  ├─ Calcular estadísticas
  ├─ Calcular subtotal, impuesto y total
  ├─ Crear muestra con generador local
  ├─ Verificar resultados esperados
  └─ Presentar reporte
```

## 8.13. Resultados esperados

Con los materiales originales debes obtener:

| Resultado | Valor esperado |
|---|---:|
| Tareas recibidas | 12 |
| Tareas aceptadas | 8 |
| Tareas rechazadas | 4 |
| Vencidas | 1 |
| Vencen hoy | 1 |
| Próximas | 3 |
| Vigentes | 3 |
| Horas totales | 37.5 |
| Media de horas | 4.6875 |
| Mediana de horas | 4.25 |
| Desviación poblacional aproximada | 3.0279 |
| Sesiones totales | 18 |
| Prioridades más frecuentes | alta y media |
| Subtotal | 836.04 |
| Impuesto redondeado | 108.69 |
| Total | 944.73 |

La muestra reproducible, manteniendo el orden original de candidatos, debe ser:

```python
["T-002", "T-001", "T-006"]
```

## 8.14. Requisitos funcionales obligatorios

1. Utilizar `date`, `datetime` o ambos de manera justificada.
2. Convertir fechas con `strptime()` o `date.fromisoformat()`.
3. Recibir la fecha de referencia; no ocultarla dentro de una función.
4. Calcular diferencias mediante resta de fechas.
5. Utilizar `math.ceil()` para sesiones.
6. Utilizar `statistics.mean()`, `median()`, `multimode()` y `pstdev()`.
7. Manejar correctamente la ausencia de datos estadísticos.
8. Crear un generador local `random.Random(semilla)`.
9. Utilizar `sample()` sin reemplazo.
10. Construir los valores monetarios desde texto con `Decimal`.
11. Rechazar decimales no finitos.
12. Aplicar `quantize()` con una política explícita.
13. No mezclar `float` y `Decimal` en dinero.
14. Acumular todos los problemas detectables por registro.
15. Conservar el registro original en los rechazos.
16. Ordenar la agenda con criterios claros.
17. Separar procesamiento, cálculo y presentación.
18. Obtener todos los resultados de control esperados.

## 8.15. Pruebas obligatorias

| # | Prueba | Resultado esperado |
|---:|---|---|
| 1 | Conjunto original | 8 aceptadas y 4 rechazadas |
| 2 | Fecha igual a la referencia | `vence_hoy` |
| 3 | Fechas a 1, 7 y 8 días | `próxima`, `próxima`, `vigente` |
| 4 | Fecha imposible | Registro rechazado sin detener el lote |
| 5 | Duración cero, negativa, infinita y texto | Todas rechazadas |
| 6 | Costo `NaN`, negativo y con coma | Todos rechazados |
| 7 | Colección sin tareas válidas | Reporte sin estadísticas inventadas |
| 8 | Una sola tarea válida | `pstdev()` produce 0 y la muestra se adapta o se rechaza claramente |
| 9 | Misma semilla dos veces | Misma muestra |
| 10 | Semilla diferente | La muestra puede cambiar |
| 11 | Tareas en orden alterado | La agenda final respeta el criterio definido |
| 12 | Cálculo monetario | No aparece ningún `float` en costos, impuesto o total |

## 8.16. Entrega

Realiza **una sola entrega** con esta estructura:

```text
apellido_nombre_modulo_5/
├── planificador.py
├── datos_tareas.py
├── reporte.txt
├── pruebas.md
├── README.md
└── evidencias/
    ├── reporte_completo.png
    └── muestra_reproducible.png
```

El `README.md` debe explicar:

- cómo ejecutar el programa;
- qué fecha de referencia utiliza;
- cuál es el contrato de fechas;
- cómo trata las tareas inválidas;
- por qué utiliza `pstdev()`;
- cómo garantiza la reproducibilidad;
- cómo construye y redondea los importes;
- cómo trata una muestra mayor que la población.

`pruebas.md` debe registrar los doce casos obligatorios con entrada, resultado esperado, resultado obtenido y estado.

[Entregar el Módulo 5](https://forms.gle/nTx97JRkFkbH5Vfr6)

## 8.17. Condición de aprobación

El proyecto debe ser aprobado antes de continuar al Módulo 6.

El proyecto requiere corrección si:

- compara o resta fechas como cadenas;
- obtiene la fecha actual ignorando la referencia de evaluación;
- usa `round()` para calcular sesiones;
- usa `random` sin una forma de reproducir la muestra;
- usa `random` para datos sensibles;
- crea dinero desde `float`;
- mezcla `float` y `Decimal` en cálculos monetarios;
- oculta tareas inválidas o detiene todo el lote por una sola tarea;
- presenta estadísticas inventadas cuando no hay datos.

---

# 9. Rúbrica de evaluación del proyecto

Puntaje total: **100 puntos**. Puntaje mínimo de aprobación: **70 puntos**.

Existen tres requisitos críticos:

1. las fechas se convierten a objetos temporales antes de compararse o calcularse;
2. la muestra puede reproducirse con la misma semilla y el mismo orden de entrada;
3. todos los cálculos monetarios utilizan `Decimal` construido sin pasar por `float`.

El incumplimiento de un requisito crítico exige corrección independientemente del puntaje.

| Criterio | Excelente | Competente | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Fechas y vencimientos | Interpreta, valida, calcula y clasifica correctamente todos los límites | Cumple con errores menores de presentación | Falla en varios límites o formatos | Compara texto o calcula fechas manualmente | 20 |
| Validación de tareas | Acumula problemas, conserva originales y procesa el lote completo | Omite alguna validación menor | Pierde información o informa un solo problema | Acepta registros inválidos o detiene el lote | 15 |
| Métricas y `math` | Usa medidas correctas, explica población y calcula sesiones correctamente | Cálculos correctos con pequeñas omisiones | Confunde medidas o casos sin datos | Resultados incorrectos o reinventados | 15 |
| Aleatoriedad | Muestra sin reemplazo, reproducible, local y bien documentada | Reproducible con detalle menor pendiente | Usa estado global sin necesidad o maneja mal `k` | No puede reproducirse o usa la función incorrecta | 10 |
| Precisión monetaria | Cadena completa en `Decimal`, validación finita y redondeo documentado | Cálculos correctos con pequeña omisión | Conversión o redondeo inconsistente | Usa `float` para dinero | 20 |
| Organización y presentación | Funciones enfocadas, agenda ordenada y reporte claro | Código comprensible con detalles mejorables | Responsabilidades mezcladas o reporte incompleto | Código difícil de revisar | 10 |
| Pruebas y documentación | Evidencia las doce pruebas y explica las decisiones | Evidencia la mayoría | Pruebas o README incompletos | No demuestra el comportamiento | 10 |

## Interpretación del resultado

- **90 a 100:** dominio excelente de las herramientas del módulo.
- **80 a 89:** desempeño sólido con ajustes menores.
- **70 a 79:** desempeño suficiente; pueden solicitarse correcciones puntuales.
- **Menos de 70:** requiere corrección y nueva entrega.
- **Fallo de un requisito crítico:** requiere corrección, aunque el puntaje alcance 70.

---

# 10. Evaluación del módulo

Responde primero sin ejecutar código. Después comprueba tus respuestas.

## Pregunta 1

¿Qué tipo representa mejor la fecha límite de una tarea cuando la hora no importa?

A. `time`  
B. `date`  
C. `timedelta`  
D. `str`

## Pregunta 2

¿Qué devuelve la resta entre dos objetos `date`?

A. Un entero  
B. Un `float`  
C. Un `timedelta`  
D. Otro `date`

## Pregunta 3

¿Cuál operación convierte el texto `"22/08/2026"` usando el formato indicado?

A. `datetime.strftime("22/08/2026", "%d/%m/%Y")`  
B. `datetime.strptime("22/08/2026", "%d/%m/%Y")`  
C. `date.isoformat("22/08/2026")`  
D. `timedelta("22/08/2026")`

## Pregunta 4

Una tarea requiere 5.1 horas y cada sesión admite 2 horas. ¿Qué función calcula las sesiones que deben reservarse?

A. `round(5.1 / 2)`  
B. `math.floor(5.1 / 2)`  
C. `math.ceil(5.1 / 2)`  
D. `int(5.1 / 2)`

## Pregunta 5

¿Cuándo corresponde utilizar `math.isclose()`?

A. Para exigir igualdad exacta de identificadores.  
B. Para comparar resultados aproximados de punto flotante con tolerancia.  
C. Para redondear dinero a dos decimales.  
D. Para validar fechas.

## Pregunta 6

Si los datos representan todas las tareas del proyecto, ¿qué función describe su desviación estándar poblacional?

A. `statistics.stdev()`  
B. `statistics.pstdev()`  
C. `statistics.mean()`  
D. `math.sqrt()`

## Pregunta 7

¿Qué función devuelve todas las modas cuando existe un empate?

A. `mode()`  
B. `median()`  
C. `multimode()`  
D. `Counter.total()`

## Pregunta 8

¿Qué opción selecciona tres elementos diferentes y permite repetir el resultado con una semilla?

A. `random.Random(42).sample(datos, k=3)`  
B. `secrets.choice(datos)` tres veces  
C. `random.choices(datos, k=3)` sin semilla  
D. `random.shuffle(datos)`

## Pregunta 9

¿Cuál construcción conserva correctamente el valor decimal 0.1?

A. `Decimal(0.1)`  
B. `Decimal(str(0.1 + 0.0))` en todos los casos  
C. `Decimal("0.1")`  
D. `float(Decimal("0.1"))`

## Pregunta 10

¿Qué operación aplica explícitamente dos decimales y una política comercial de mitad hacia arriba?

A. `round(valor, 2)`  
B. `valor.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)`  
C. `math.isclose(valor, 2)`  
D. `format(float(valor), ".2f")`

## Aprobación de la evaluación

- Puntaje: 1 punto por respuesta correcta.
- Puntaje mínimo recomendado: **8 de 10**.
- Si obtienes menos de 8, revisa las secciones correspondientes y vuelve a intentarlo.

---

# 11. Soluciones guiadas

Consulta esta sección después de intentar las prácticas.

## Solución de la práctica guiada 1

```python
from datetime import date, datetime


def interpretar_fecha(texto):
    try:
        return datetime.strptime(texto, "%Y-%m-%d").date()
    except ValueError:
        return None


def clasificar(dias):
    if dias < 0:
        return "vencida"
    if dias == 0:
        return "vence_hoy"
    if dias <= 7:
        return "próxima"
    return "vigente"


fechas = [
    "2026-08-10",
    "2026-08-15",
    "2026-08-18",
    "2026-02-30",
    "18/08/2026",
]
referencia = date(2026, 8, 15)

for texto in fechas:
    fecha = interpretar_fecha(texto)

    if fecha is None:
        print(texto, "→ fecha o formato inválido")
        continue

    dias = (fecha - referencia).days
    print(texto, "→", clasificar(dias), dias)
```

El mismo `ValueError` cubre una fecha imposible y un texto que no coincide con el contrato. Si el sistema necesita distinguir ambas causas, debe validar el formato por separado o producir mensajes más específicos.

## Solución de la práctica guiada 2

```python
import math


duraciones = [1, 2.5, 2.6, 5, 7.2]
capacidad = 2.5

for duracion in duraciones:
    sesiones = math.ceil(duracion / capacidad)
    print(duracion, "→", sesiones)

pares = [
    (2.0001, 2.0),
    (2.01, 2.0),
    (0.1 + 0.2, 0.3),
]

for obtenido, esperado in pares:
    print(
        obtenido,
        esperado,
        math.isclose(obtenido, esperado, rel_tol=0.0, abs_tol=0.001),
    )
```

Con `rel_tol=0.0`, la decisión depende únicamente de la tolerancia absoluta indicada por el ejercicio.

## Solución de la práctica guiada 3

```python
from statistics import mean, median, pstdev


equipos = {
    "A": [4, 4, 4, 4, 4],
    "B": [1, 2, 4, 6, 7],
}

for nombre, datos in equipos.items():
    print(f"Equipo {nombre}")
    print("Media:", mean(datos))
    print("Mediana:", median(datos))
    print("Rango:", max(datos) - min(datos))
    print("Desviación poblacional:", pstdev(datos))
```

Ambos equipos tienen media 4. El equipo A tiene dispersión 0; sus valores son completamente consistentes. El equipo B tiene valores distribuidos alrededor de la misma media.

## Solución de la práctica guiada 4

```python
import random


tareas = ["T-001", "T-002", "T-003", "T-004", "T-005", "T-006"]

primera = random.Random(25).sample(tareas, k=3)
segunda = random.Random(25).sample(tareas, k=3)
tercera = random.Random(99).sample(tareas, k=3)

print(primera)
print(segunda)
print(primera == segunda)
print(tercera)

try:
    random.Random(25).sample(tareas, k=7)
except ValueError as error:
    print(error)
```

Crear dos generadores desde la misma semilla reinicia el mismo estado. Llamar dos veces a `sample()` sobre una única instancia avanza el estado y no tiene por qué producir la misma muestra.

## Solución de la práctica guiada 5

```python
from decimal import Decimal, ROUND_HALF_UP


CENTAVO = Decimal("0.01")
TASA = Decimal("0.13")

precios = [Decimal("19.99"), Decimal("4.95"), Decimal("0.10")]
subtotal = sum(precios, start=Decimal("0.00"))
impuesto = (subtotal * TASA).quantize(CENTAVO, rounding=ROUND_HALF_UP)
total = subtotal + impuesto

print(f"Subtotal: {subtotal:.2f}")
print(f"Impuesto: {impuesto:.2f}")
print(f"Total: {total:.2f}")
```

El formato `.2f` controla cómo se presenta el resultado. La exactitud se obtuvo antes, al construir y operar con `Decimal`.

## Respuestas de la evaluación

| Pregunta | Respuesta | Explicación breve |
|---:|:---:|---|
| 1 | B | `date` representa un día sin una hora innecesaria. |
| 2 | C | La diferencia entre fechas es un `timedelta`. |
| 3 | B | `strptime()` interpreta texto según un patrón. |
| 4 | C | Debe reservarse cualquier fracción adicional de sesión. |
| 5 | B | `isclose()` compara valores aproximados mediante tolerancias. |
| 6 | B | `pstdev()` describe la población completa recibida. |
| 7 | C | `multimode()` conserva todos los valores empatados. |
| 8 | A | `sample()` no repite y el generador tiene semilla controlada. |
| 9 | C | El texto conserva la representación decimal indicada. |
| 10 | B | `quantize()` aplica escala y política de redondeo explícitas. |

---

# 12. Retos adicionales

## Reto 1 — Próximo día laborable

Crea una función que reciba una fecha y, si cae sábado o domingo, la traslade al lunes siguiente. No incluyas feriados: esa regla requeriría un calendario externo o una colección definida por el negocio.

## Reto 2 — Fechas y horas entre zonas

Define una reunión en `America/Costa_Rica` y conviértela a `Europe/Madrid` mediante `ZoneInfo`. Muestra ambas con `isoformat()` y explica por qué no debe fijarse manualmente una diferencia de horas durante todo el año.

## Reto 3 — Simulación de revisiones

Ejecuta 1 000 muestras de tres tareas con un generador local. Cuenta cuántas veces aparece cada identificador y presenta los resultados. Utiliza una semilla fija durante las pruebas y otra configurable para experimentar.

## Reto 4 — Dos políticas de redondeo

Compara:

1. calcular el impuesto del subtotal y redondear una vez;
2. calcular y redondear el impuesto de cada tarea antes de sumarlo.

Busca un conjunto donde los resultados difieran y explica por qué una factura debe declarar su política.

## Reto 5 — Exportar el reporte

Aplica lo aprendido en el Módulo 4 para guardar el reporte en UTF-8 y exportar las tareas aceptadas a JSON. Convierte fechas y valores `Decimal` de forma explícita; no uses `default=str` indiscriminadamente.

---

# 13. Videos recomendados

Los videos complementan los ejemplos. La documentación oficial continúa siendo la referencia principal para firmas, límites y comportamiento actual.

## Fechas y horas

[Módulo datetime en Python explicado fácil: fechas y horas — LatamCode](https://www.youtube.com/watch?v=HgXZAeonLQY)

Explica fecha y hora actual, componentes, formato y conversión mediante `strptime()`. Relaciona sus ejemplos con la clasificación de vencimientos del proyecto.

## Estadísticas básicas con Python

[Cómo obtener la media, mediana y moda de una lista en Python — TutorialesEnCincoMinutos](https://www.youtube.com/watch?v=AWbeb-Z4DQg)

Utilízalo para reforzar la selección de las medidas centrales. El proyecto añade dispersión, empates y validación de colecciones.

## Selecciones aleatorias

[Números aleatorios en Python: librería random — Leonardo Kuffo](https://www.youtube.com/watch?v=PoUcplbntYo)

Repasa la generación y selección aleatoria. Para reproducibilidad, muestras sin reemplazo y advertencias de seguridad, conserva como guía las secciones de este módulo y la documentación oficial.

## Precisión decimal

[Por qué los bancos odian Python — BrayanCode](https://www.youtube.com/watch?v=DvXCPC8Z0KA)

El título es provocativo, pero el contenido ilustra el problema de la representación binaria y presenta `Decimal` como solución para cálculos monetarios. Python sí puede utilizarse profesionalmente en sistemas financieros cuando se eligen tipos, reglas y controles adecuados.

---

# 14. Documentación y recursos de lectura

## Documentación oficial de Python

- [`datetime`: tipos básicos de fecha y hora](https://docs.python.org/es/3/library/datetime.html)
- [`zoneinfo`: soporte de zonas horarias de IANA](https://docs.python.org/es/3/library/zoneinfo.html)
- [`math`: funciones matemáticas](https://docs.python.org/es/3/library/math.html)
- [`statistics`: estadística matemática](https://docs.python.org/es/3/library/statistics.html)
- [`random`: números pseudoaleatorios](https://docs.python.org/es/3/library/random.html)
- [`secrets`: números aleatorios para seguridad](https://docs.python.org/es/3/library/secrets.html)
- [`decimal`: aritmética decimal](https://docs.python.org/es/3/library/decimal.html)
- [Tutorial: problemas y limitaciones del punto flotante](https://docs.python.org/es/3/tutorial/floatingpoint.html)

## Ruta de lectura recomendada

### Nivel esencial

1. Revisa las clases disponibles en `datetime`.
2. Consulta las directivas de `strftime()` y `strptime()`.
3. Compara `sample()` con `choices()`.
4. Revisa los ejemplos de `Decimal` y `quantize()`.

### Nivel de profundización

1. Lee la diferencia documentada entre objetos temporales ingenuos y conscientes.
2. Compara `stdev()` con `pstdev()`.
3. Revisa las notas de reproducibilidad de `random`.
4. Consulta los modos de redondeo de `decimal`.

### Preguntas que debes hacer al leer documentación

- ¿Qué tipos recibe la función?
- ¿Qué tipo devuelve?
- ¿Los límites están incluidos?
- ¿Modifica el objeto recibido?
- ¿Qué excepciones puede producir?
- ¿Trabaja con una muestra o una población?
- ¿La operación es exacta o aproximada?
- ¿Existe una advertencia de seguridad?

---

# 15. Material descargable

El módulo incluye:

- `datos_tareas.py` con doce tareas de control;
- `plantilla_proyecto.py` con la arquitectura recomendada;
- `GUIA_SELECCION_NUMERICA.md` para elegir tipos y módulos;
- `CASOS_PRUEBA.md` con los resultados que debes demostrar;
- `CHECKLIST_PROYECTO.md` para revisar la entrega;
- un paquete ZIP con todos los materiales.

Trabaja primero con los valores de referencia. Cuando el proyecto esté aprobado, puedes permitir que el usuario elija otra fecha y otra semilla.

## Descarga

[Descargar todos los materiales del Módulo 5](/downloads/python-practico/modulo-5/materiales_python_practico_modulo_5.zip)

---

# 16. Errores comunes y cómo corregirlos

| Error | Consecuencia | Corrección |
|---|---|---|
| Comparar fechas en formatos distintos como texto | Orden incorrecto | Convierte a `date` o `datetime` |
| Usar la fecha actual dentro de todas las funciones | Pruebas cambiantes | Recibe una fecha de referencia |
| Confundir `strptime()` y `strftime()` | Conversión en dirección incorrecta | `strptime`: texto a tiempo; `strftime`: tiempo a texto |
| Tratar 30 días como un mes calendario | Vencimientos incorrectos | Define la regla de negocio necesaria |
| Usar `.seconds` para una duración completa | Se ignoran días | Utiliza `total_seconds()` |
| Comparar un `datetime` ingenuo con uno consciente | Error o significado temporal incoherente | Normaliza la estrategia de zonas |
| Usar `round()` donde se requiere capacidad completa | Recursos insuficientes | Utiliza `ceil()` |
| Aplicar `isclose()` sin pensar en tolerancias | Comparaciones demasiado estrictas o permisivas | Define `rel_tol` y `abs_tol` según el dominio |
| Calcular media de una colección vacía | `StatisticsError` | Valida el tamaño e informa ausencia de datos |
| Usar `stdev()` para toda la población | Medida distinta de la requerida | Elige entre `stdev()` y `pstdev()` conscientemente |
| Utilizar `mode()` y ocultar un empate | Conclusión incompleta | Usa `multimode()` cuando el empate importa |
| Usar `choices()` cuando no se permiten repeticiones | Elementos duplicados | Utiliza `sample()` |
| Esperar que dos llamadas consecutivas den lo mismo | El estado del generador ya avanzó | Reinicia un generador con la misma semilla |
| Construir candidatos desde un `set` | Orden no contractual | Conserva una lista ordenada |
| Usar `random` para tokens | Valores potencialmente predecibles | Utiliza `secrets` |
| Construir `Decimal` desde `float` | Se conserva la aproximación binaria | Construye desde texto o entero |
| Mezclar `Decimal` con `float` | `TypeError` o decisiones inconsistentes | Mantén una cadena numérica homogénea |
| Formatear con dos decimales y asumir exactitud | Solo cambia la apariencia | Usa el tipo y la política correctos antes de presentar |
| Redondear en momentos no documentados | Totales diferentes entre sistemas | Define cuándo y cómo se redondea |

---

# 17. Glosario

**Fecha de referencia:** día respecto al cual se calculan vencimientos o diferencias.

**`date`:** tipo que representa una fecha sin hora.

**`time`:** tipo que representa una hora sin una fecha asociada.

**`datetime`:** tipo que combina fecha y hora.

**`timedelta`:** duración o diferencia entre valores temporales.

**Formato ISO:** representación estandarizada; para una fecha simple se usa habitualmente `AAAA-MM-DD`.

**`strptime()`:** operación que interpreta una cadena según un formato temporal.

**`strftime()`:** operación que presenta un objeto temporal como cadena.

**Objeto ingenuo:** `datetime` sin información de zona horaria.

**Objeto consciente:** `datetime` con información de zona o desplazamiento.

**Tolerancia:** margen permitido al comparar resultados aproximados.

**Media:** suma de los valores dividida entre su cantidad.

**Mediana:** valor central de una colección ordenada.

**Moda:** valor o valores con mayor frecuencia.

**Dispersión:** grado en que los valores se separan entre sí o respecto al centro.

**Población:** conjunto completo que se desea describir.

**Muestra:** subconjunto utilizado para estudiar una población mayor.

**Pseudoaleatorio:** resultado producido por un algoritmo que parece aleatorio, pero depende de su estado.

**Semilla:** valor utilizado para inicializar un generador pseudoaleatorio.

**Muestreo sin reemplazo:** selección en la que un elemento no puede aparecer dos veces en la misma muestra.

**Punto flotante:** representación binaria aproximada utilizada por `float`.

**`Decimal`:** tipo de aritmética decimal con precisión y redondeo controlables.

**Cuantización:** ajuste de un decimal a un exponente o número de posiciones determinado.

**Política de redondeo:** regla explícita para resolver los dígitos que no se conservarán.

---

# 18. Resumen final

En este módulo aprendiste que el tipo de dato forma parte de la solución. Una fecha no es únicamente texto, una duración no es una resta manual, una muestra aleatoria no es necesariamente irrepetible y un importe no debería depender de aproximaciones binarias ocultas.

Ahora puedes:

- interpretar, presentar, comparar y modificar fechas;
- calcular vencimientos mediante `timedelta`;
- diseñar funciones temporales que admiten pruebas controladas;
- reconocer cuándo una zona horaria aporta valor real;
- reservar recursos mediante `ceil()`;
- comparar aproximaciones mediante `isclose()`;
- describir datos con media, mediana, moda y dispersión;
- distinguir población y muestra;
- seleccionar elementos con o sin reemplazo;
- reproducir simulaciones con un generador local;
- elegir `secrets` para valores sensibles;
- construir importes con `Decimal` desde texto;
- aplicar y documentar una política de redondeo;
- integrar fechas, métricas, muestras y costos en un reporte profesional.

## Lista de comprobación antes de continuar

- [ ] Completé las cinco prácticas guiadas.
- [ ] Entregué las seis actividades obligatorias.
- [ ] Puedo explicar `date`, `datetime` y `timedelta`.
- [ ] Distingo `strptime()` de `strftime()`.
- [ ] Probé los límites temporales `-1`, `0`, `1`, `7` y `8`.
- [ ] Sé por qué `round()` no sustituye a `ceil()`.
- [ ] Distingo `stdev()` de `pstdev()`.
- [ ] Puedo obtener todas las modas de un empate.
- [ ] Distingo `choice()`, `choices()` y `sample()`.
- [ ] La misma semilla y el mismo orden producen la muestra de control.
- [ ] Utilizo `secrets` para valores sensibles.
- [ ] No construyo dinero desde `float`.
- [ ] Documenté la política y el momento del redondeo.
- [ ] Obtuve 8 tareas aceptadas y 4 rechazadas.
- [ ] Obtuve subtotal 836.04, impuesto 108.69 y total 944.73.
- [ ] Documenté las doce pruebas del proyecto.
- [ ] Obtuve al menos 8 de 10 en la evaluación.
- [ ] El proyecto fue aprobado.

Cuando todos los puntos estén completos, estarás preparado para continuar con el Módulo 6 de **Python Práctico**.
