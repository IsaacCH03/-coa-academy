# COA — Cursos Online Avanzados

## Python Práctico

# Módulo 1. Texto profesional y funciones integradas

**Duración aproximada:** 2 horas y 30 minutos  
**Modalidad:** práctica guiada, actividades obligatorias, proyecto y evaluación  
**Nivel:** intermedio  
**Tecnologías:** Python y biblioteca estándar  
**Resultado principal:** un normalizador y auditor de registros de texto

---

## Bienvenida

Muchos programas reales reciben información escrita por personas, copiada desde formularios o importada desde otros sistemas. Esa información rara vez llega perfecta:

```text
"  ana   solís "
" ANA.SOLIS@EJEMPLO.COM "
"Python, lógica, python"
"coa-0007"
```

Los datos contienen espacios sobrantes, capitalización inconsistente, valores repetidos y formatos que deben comprobarse. Una solución apresurada puede corregir algunos casos y dañar otros. Una solución profesional necesita distinguir tres operaciones:

```text
LIMPIAR             TRANSFORMAR             VALIDAR
Quitar ruido   →    Aplicar un formato   →  Comprobar las reglas
```

En este módulo aprenderás a realizar esas operaciones con métodos de cadenas, funciones integradas y una introducción concreta a las expresiones regulares.

No volverás a estudiar qué es una variable, un condicional, un ciclo o una función. Utilizarás esos conocimientos para escribir soluciones más claras y aprovechar herramientas que Python ya incluye.

> **Principio del módulo:** limpiar un dato no significa adivinarlo. Toda transformación debe responder a una regla clara y debe permitir comprobar qué cambió.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Diferenciar limpieza, transformación y validación.
- Normalizar espacios y capitalización sin perder información útil.
- Dividir texto con `split()`, `rsplit()`, `partition()` y `splitlines()`.
- Reconstruir texto mediante `join()`.
- Validar contenido con métodos de `str`, `any()` y `all()`.
- Presentar datos mediante f-strings, alineación, ancho y formato numérico.
- Utilizar `repr()` para descubrir espacios, tabulaciones y saltos de línea invisibles.
- Aplicar `len()`, `abs()`, `round()`, `divmod()`, `sum()`, `min()`, `max()`, `sorted()` y `reversed()`.
- Personalizar búsquedas y ordenamientos mediante el parámetro `key`.
- Utilizar expresiones regulares sencillas cuando los métodos normales de cadenas no sean suficientes.
- Construir un programa que normalice, valide y audite registros de texto.

---

## Antes de comenzar

Para realizar las prácticas necesitas:

- Python 3.10 o una versión posterior.
- Un editor de código.
- Una carpeta llamada `python_practico_modulo_1`.
- Un archivo inicial llamado `practicas.py`.

Comprueba tu versión desde la terminal:

```text
python --version
```

En algunos sistemas el comando puede ser `python3 --version`.

No copies todas las demostraciones en un único bloque. Separa cada práctica con funciones y nombres claros para que puedas volver a ejecutarla.

---

## Producto que construirás

Al final del módulo desarrollarás un programa que reciba registros como este:

```text
" COA-0001 |  ana   solís | ANA.SOLIS@EJEMPLO.COM | Python, lógica, python "
```

Y produzca información normalizada y auditable:

```text
Código:       COA-0001
Nombre:       Ana Solís
Correo:       ana.solis@ejemplo.com
Etiquetas:    python, lógica
Estado:       CORREGIDO
```

El programa también deberá identificar los registros que no pueden aceptarse:

```text
Código:       COA-00A3
Estado:       INVÁLIDO
Problemas:    el código debe tener el formato COA-0000
```

La meta no es producir la menor cantidad posible de líneas. La meta es construir un flujo que otra persona pueda leer, probar y modificar.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Diagnosticar antes de transformar | 5 min |
| 2. Métodos profesionales de cadenas | 20 min |
| 3. Formato y caracteres invisibles | 10 min |
| 4. Funciones integradas de alto valor | 15 min |
| 5. Expresiones regulares esenciales | 10 min |
| 6. Prácticas guiadas | 20 min |
| 7. Actividades obligatorias | 15 min |
| 8. Proyecto del módulo | 45 min |
| 9. Evaluación y cierre | 10 min |
| **Total** | **2 h 30 min** |

Los tiempos son orientativos. Detén el contenido cuando necesites probar un caso adicional, comparar resultados o corregir un error.

---

# 1. Diagnosticar antes de transformar

## 1.1 Un texto puede ser válido aunque no tenga el formato esperado

Observa estos nombres:

```text
"  ana solís  "
"ANA SOLÍS"
"Ana Solís"
```

Los tres podrían referirse a la misma persona. Sin embargo, no toda diferencia debe eliminarse automáticamente. Por ejemplo:

```text
"María del Mar"
"McDonald"
"COA-Pro"
```

Aplicar `.title()` a cualquier texto produce uniformidad, pero no garantiza que el nombre quede escrito como la persona lo utiliza. Debes conocer la regla del sistema antes de transformar.

Una regla válida para una práctica puede ser:

> En este conjunto de ejemplo, los nombres se mostrarán con iniciales en mayúscula. La regla se documentará porque no representa correctamente todos los nombres posibles.

Una regla profesional debe ser explícita, comprobable y revisable.

## 1.2 Las tres preguntas del proceso

Antes de escribir código, responde:

1. **¿Qué parte es ruido?** Espacios exteriores, separadores repetidos o diferencias irrelevantes de mayúsculas.
2. **¿Qué formato necesita el sistema?** Por ejemplo, códigos en mayúsculas y correos comparados sin distinguir mayúsculas.
3. **¿Cómo se determina si el valor es aceptable?** Por ejemplo, un código que coincida exactamente con `COA-` seguido por cuatro dígitos.

## 1.3 Conserva el valor original

No necesitas destruir el valor recibido para producir una versión normalizada:

```python
valor_original = "  ana   solís "
valor_normalizado = " ".join(valor_original.split()).title()

print(f"Original:    {valor_original!r}")
print(f"Normalizado: {valor_normalizado!r}")
```

Salida:

```text
Original:    '  ana   solís '
Normalizado: 'Ana Solís'
```

El modificador `!r` muestra la representación del texto. Las comillas permiten observar los espacios exteriores.

## 1.4 Flujo recomendado

```text
Dato original
     │
     ├── Guardar original
     │
     ▼
Limpieza segura
     │
     ▼
Transformación documentada
     │
     ▼
Validación
     │
     ├── Válido sin cambios
     ├── Válido corregido
     └── Inválido con explicación
```

Una auditoría útil no responde solamente “válido” o “inválido”. También informa qué regla no se cumplió.

---

# 2. Métodos profesionales de cadenas

## 2.1 Las cadenas son inmutables

Los métodos de texto no modifican la cadena original. Devuelven una nueva:

```python
correo = "  ESTUDIANTE@EJEMPLO.COM  "
correo.strip().lower()

print(correo)
```

El valor de `correo` sigue conteniendo espacios y mayúsculas. Debes guardar el resultado:

```python
correo = correo.strip().lower()
print(correo)
```

Salida:

```text
estudiante@ejemplo.com
```

## 2.2 Limpiar espacios exteriores e interiores

```python
texto = "   Python práctico   "

print(texto.strip())
print(texto.lstrip())
print(texto.rstrip())
```

- `strip()` elimina espacios de ambos extremos.
- `lstrip()` elimina espacios del extremo izquierdo.
- `rstrip()` elimina espacios del extremo derecho.

No eliminan los espacios interiores:

```python
nombre = "  ana    solís  "
print(nombre.strip())
```

Salida:

```text
ana    solís
```

Para reducir cualquier grupo de espacios interiores a uno solo combina `split()` y `join()`:

```python
nombre_limpio = " ".join(nombre.split())
print(nombre_limpio)
```

Salida:

```text
ana solís
```

`split()` sin argumento trata secuencias de espacios, tabulaciones o saltos de línea como separadores. Después, `" ".join(...)` reconstruye el texto con un solo espacio.

## 2.3 Normalizar mayúsculas para comparar

```python
texto = "PyThOn PRÁCTICO"

print(texto.lower())
print(texto.upper())
print(texto.title())
print(texto.capitalize())
print(texto.casefold())
```

| Método | Uso principal |
|---|---|
| `lower()` | Convertir a minúsculas para presentación o reglas simples. |
| `upper()` | Convertir a mayúsculas, por ejemplo códigos. |
| `title()` | Aplicar iniciales en mayúscula; requiere una regla documentada. |
| `capitalize()` | Poner en mayúscula el primer carácter y reducir el resto. |
| `casefold()` | Comparar texto ignorando mayúsculas de forma más completa. |

Para comparar categorías escritas de formas diferentes:

```python
categoria_recibida = "PYTHON"
categoria_buscada = "python"

coinciden = categoria_recibida.casefold() == categoria_buscada.casefold()
print(coinciden)
```

No necesitas modificar el valor que mostrarás. Puedes crear una clave normalizada solo para comparar.

## 2.4 Prefijos y sufijos

```python
archivo = "reporte_final.txt"
codigo = "TEMP-COA-0042"

print(archivo.removesuffix(".txt"))
print(codigo.removeprefix("TEMP-"))
```

No confundas estos métodos con `strip()`:

```python
print("texto.txt".rstrip(".txt"))
```

`rstrip(".txt")` elimina del final cualquier combinación de `.`, `t` y `x`; no un sufijo exacto. Para un sufijo conocido utiliza `removesuffix()`.

Para comprobar sin eliminar:

```python
codigo = "COA-0042"
archivo = "reporte.csv"

print(codigo.startswith("COA-"))
print(archivo.endswith(".csv"))
print(archivo.endswith((".csv", ".json", ".txt")))
```

Una tupla de sufijos es más clara que varias comparaciones con `or`.

## 2.5 Sustituir con cuidado

```python
telefono = "8888-1234"
telefono_sin_guion = telefono.replace("-", "")
print(telefono_sin_guion)
```

`replace()` sustituye todas las coincidencias de forma predeterminada. Puede limitarse:

```python
texto = "uno, dos, tres"
print(texto.replace(",", ";", 1))
```

Antes de utilizarlo, comprueba si la sustitución puede cambiar una parte válida. Esta operación es peligrosa:

```python
correo = correo.replace(" ", "")
```

Un correo con un espacio interno puede ser un dato inválido que debe rechazarse. Si eliminas el espacio automáticamente, ocultas el problema y quizá creas otra dirección existente.

## 2.6 Dividir texto con `split()` y `rsplit()`

```python
registro = "COA-0001|Ana Solís|ana@ejemplo.com"
partes = registro.split("|")

print(partes)
```

Salida:

```text
['COA-0001', 'Ana Solís', 'ana@ejemplo.com']
```

Puedes limitar la cantidad de divisiones:

```python
ruta = "carpeta/subcarpeta/reporte.txt"
inicio, nombre = ruta.rsplit("/", 1)
```

`rsplit()` comienza por la derecha. Es útil cuando solo necesitas aislar la última parte.

No desempaques sin pensar en entradas incompletas:

```python
partes = registro.split("|")

if len(partes) == 3:
    codigo, nombre, correo = partes
else:
    print("El registro no contiene exactamente tres campos")
```

## 2.7 Separar una vez con `partition()`

`partition()` siempre devuelve tres elementos:

```python
correo = "ana@ejemplo.com"
usuario, separador, dominio = correo.partition("@")

print(usuario)
print(separador)
print(dominio)
```

Si el separador no existe, la segunda y tercera parte quedan vacías:

```python
usuario, separador, dominio = "correo-invalido".partition("@")
print((usuario, separador, dominio))
```

Salida:

```text
('correo-invalido', '', '')
```

Esto permite validar un correo básico sin arriesgar un error de desempaquetado:

```python
correo = "ana@ejemplo.com"
usuario, separador, dominio = correo.partition("@")

estructura_basica_valida = all([
    separador == "@",
    correo.count("@") == 1,
    bool(usuario),
    "." in dominio,
    not dominio.startswith("."),
    not dominio.endswith("."),
    " " not in correo,
])

print(estructura_basica_valida)
```

Esta validación es deliberadamente sencilla. Comprobar todos los casos permitidos por los estándares de correo es un problema más amplio. En un proyecto real debes definir el nivel de validación que realmente necesitas.

## 2.8 Procesar varias líneas con `splitlines()`

```python
bloque = """COA-0001|Ana
COA-0002|Luis
COA-0003|María"""

for linea in bloque.splitlines():
    print(linea)
```

`splitlines()` reconoce distintos tipos de salto de línea y comunica mejor la intención que `split("\n")`.

## 2.9 Reconstruir con `join()`

```python
etiquetas = ["python", "texto", "validación"]
resultado = ", ".join(etiquetas)

print(resultado)
```

Salida:

```text
python, texto, validación
```

El separador llama a `join()` porque es lo que se coloca entre las partes:

```python
" | ".join(["COA-0001", "Ana Solís", "VÁLIDO"])
```

Todos los elementos deben ser cadenas. Si tienes números, conviértelos explícitamente:

```python
numeros = [10, 20, 30]
texto = " - ".join(str(numero) for numero in numeros)
print(texto)
```

La expresión generadora aparece aquí únicamente como apoyo de `join()`. Se estudiará con mayor profundidad en el Módulo 2.

## 2.10 Buscar texto: `in`, `find()` e `index()`

Si solo necesitas saber si un texto existe, utiliza `in`:

```python
correo = "ana@ejemplo.com"

if "@" in correo:
    print("Contiene arroba")
```

Si necesitas la posición, utiliza `find()`:

```python
posicion = correo.find("@")
print(posicion)
```

`find()` devuelve `-1` cuando no encuentra el texto. `index()` genera una excepción. Elige según el flujo que necesitas.

## 2.11 Métodos de validación

```python
print("2026".isdigit())
print("Python".isalpha())
print("COA2026".isalnum())
print("   \t".isspace())
```

Estos métodos responden preguntas concretas, pero no sustituyen una regla completa. Por ejemplo, algunos dígitos Unicode también producen `True` con `isdigit()`. Si una regla exige exactamente caracteres del `0` al `9`, un patrón `[0-9]` puede ser más preciso.

---

# 3. Formato y caracteres invisibles

## 3.1 F-strings con intención

Una f-string puede hacer más que insertar valores:

```python
nombre = "Ana Solís"
progreso = 0.875
puntos = 12345

print(f"{nombre:<20} {progreso:>7.1%} {puntos:>10,}")
```

Salida:

```text
Ana Solís              87.5%     12,345
```

| Expresión | Significado |
|---|---|
| `<20` | Alinear a la izquierda en un ancho de 20. |
| `>7` | Alinear a la derecha en un ancho de 7. |
| `^20` | Centrar en un ancho de 20. |
| `.1%` | Mostrar porcentaje con un decimal. |
| `,` | Mostrar separador de miles. |
| `.2f` | Mostrar un número con dos decimales. |
| `04d` | Rellenar un entero con ceros hasta un ancho de 4. |

Ejemplo:

```python
numero = 42
codigo = f"COA-{numero:04d}"
print(codigo)
```

Salida:

```text
COA-0042
```

## 3.2 Construir una tabla de terminal

```python
encabezado = f"{'CÓDIGO':<12} {'NOMBRE':<22} {'ESTADO':<12}"
separador = "-" * len(encabezado)

print(encabezado)
print(separador)
print(f"{'COA-0001':<12} {'Ana Solís':<22} {'VÁLIDO':<12}")
print(f"{'COA-0002':<12} {'Luis Méndez':<22} {'CORREGIDO':<12}")
```

El ancho no limita el texto. Si un nombre supera 22 caracteres, desplazará las columnas. En este módulo puedes definir anchos para el conjunto de práctica. En un sistema real podrías calcularlos o truncar solo si la especificación lo permite.

## 3.3 Descubrir caracteres invisibles con `repr()`

```python
valor = "  Ana\tSolís\n"

print(valor)
print(repr(valor))
print(f"Valor recibido: {valor!r}")
```

La representación revela espacios exteriores, `\t` como tabulación y `\n` como salto de línea. Utiliza `repr()` para diagnosticar; normalmente no es el formato final para el usuario.

---

# 4. Funciones integradas de alto valor

Las funciones integradas están disponibles sin importar módulos. Conocer las más útiles evita volver a programar operaciones que Python ya resuelve.

## 4.1 `len()`, `abs()` y `round()`

```python
codigo = "COA-0042"
campos = ["código", "nombre", "correo", "etiquetas"]

print(len(codigo))
print(len(campos))
print(abs(-4))
print(round(87.456, 2))
```

`abs()` devuelve la magnitud de una diferencia. No lo utilices para ocultar un signo que comunica información importante.

`round()` no siempre “sube el cinco”:

```python
print(round(1.5))
print(round(2.5))
```

Salida:

```text
2
2
```

Python utiliza redondeo al par en empates y los valores `float` pueden contener aproximaciones internas. Para cálculos monetarios se utilizará `Decimal` en el Módulo 5.

## 4.2 `divmod()`

`divmod(a, b)` devuelve el cociente y el residuo:

```python
segundos_totales = 3670
minutos_totales, segundos = divmod(segundos_totales, 60)
horas, minutos = divmod(minutos_totales, 60)

print(f"{horas:02d}:{minutos:02d}:{segundos:02d}")
```

Salida:

```text
01:01:10
```

Es equivalente a calcular `a // b` y `a % b`, pero comunica que necesitas ambos resultados.

## 4.3 `sum()`

```python
correcciones_por_registro = [2, 0, 3, 1]
total = sum(correcciones_por_registro)
print(total)
```

No utilices `sum()` para concatenar texto. `join()` comunica mejor esa intención y es más eficiente.

## 4.4 `min()` y `max()`

```python
registros = [
    {"codigo": "COA-0001", "errores": 2},
    {"codigo": "COA-0002", "errores": 0},
    {"codigo": "COA-0003", "errores": 4},
]

mas_problematico = max(registros, key=lambda registro: registro["errores"])
menos_problematico = min(registros, key=lambda registro: registro["errores"])

print(mas_problematico)
print(menos_problematico)
```

El parámetro `key` indica qué valor debe compararse. La función devuelve el registro completo, no solamente la cantidad de errores.

Una colección vacía no tiene mínimo ni máximo. Puedes definir un valor predeterminado:

```python
resultado = max([], default=None)
```

## 4.5 `any()` y `all()`

`any()` responde si al menos una condición es verdadera. `all()` responde si todas son verdaderas:

```python
print(any([False, False, True]))
print(all([True, True, True]))
```

Aplicación práctica:

```python
codigo = "COA-0042"

codigo_valido = all([
    codigo.startswith("COA-"),
    len(codigo) == 8,
    codigo[4:].isdigit(),
])

print(codigo_valido)
```

Ten presente dos resultados que pueden sorprenderte:

```python
print(any([]))
print(all([]))
```

Salida:

```text
False
True
```

`all([])` devuelve `True` porque no existe ningún elemento que incumpla la condición. Si una lista vacía debe ser inválida, comprueba también que contenga elementos:

```python
etiquetas_validas = bool(etiquetas) and all(
    etiqueta.strip() for etiqueta in etiquetas
)
```

## 4.6 `sorted()` y `reversed()`

```python
nombres = ["Sofía", "ana", "Luis", "maría"]
ordenados = sorted(nombres, key=str.casefold)

print(nombres)
print(ordenados)
```

`sorted()` devuelve una lista nueva. No modifica la colección original.

Para ordenar registros por más de un criterio, devuelve una tupla desde `key`:

```python
registros = [
    {"estado": "INVÁLIDO", "nombre": "Sofía"},
    {"estado": "VÁLIDO", "nombre": "Ana"},
    {"estado": "INVÁLIDO", "nombre": "Carlos"},
]

ordenados = sorted(
    registros,
    key=lambda registro: (
        registro["estado"],
        registro["nombre"].casefold(),
    ),
)
```

Las funciones `lambda` se utilizarán aquí solamente cuando sean breves y claras. Se estudiarán con mayor profundidad en el Módulo 2.

`reversed()` produce un recorrido inverso:

```python
codigos = ["COA-0001", "COA-0002", "COA-0003"]

for codigo in reversed(codigos):
    print(codigo)
```

No confundas invertir el recorrido con ordenar de mayor a menor. Para ordenar utiliza `sorted(..., reverse=True)`.

---

# 5. Expresiones regulares esenciales

## 5.1 Cuándo utilizarlas

Una expresión regular describe un patrón de texto. Es apropiada cuando la regla depende de posiciones, cantidades o grupos de caracteres.

Regla:

```text
El código debe comenzar con COA- y terminar con exactamente cuatro dígitos del 0 al 9.
```

Patrón:

```text
COA-[0-9]{4}
```

Para comprobar el valor completo utiliza `fullmatch()`:

```python
import re

codigo = "COA-0042"
coincidencia = re.fullmatch(r"COA-[0-9]{4}", codigo)

print(coincidencia is not None)
```

La letra `r` crea una cadena cruda. Es la forma recomendada de escribir patrones porque evita que Python interprete muchas barras invertidas antes de que lleguen al módulo `re`.

## 5.2 Cuatro operaciones útiles

### `re.fullmatch()`

Comprueba que todo el texto coincida:

```python
es_valido = re.fullmatch(r"COA-[0-9]{4}", "COA-0042") is not None
```

### `re.search()`

Busca una coincidencia en cualquier parte:

```python
texto = "El código asignado es COA-0042"
resultado = re.search(r"COA-[0-9]{4}", texto)

if resultado:
    print(resultado.group())
```

### `re.findall()`

Devuelve todas las coincidencias:

```python
texto = "Revisar COA-0001, COA-0007 y COA-0042"
codigos = re.findall(r"COA-[0-9]{4}", texto)
print(codigos)
```

### `re.sub()`

Sustituye coincidencias:

```python
texto = "Ana     Solís"
texto_limpio = re.sub(r"\s+", " ", texto).strip()
```

Para este último caso, `" ".join(texto.split())` es probablemente más fácil de leer. La expresión regular aporta valor si la regla crece o necesita distinguir tipos concretos de caracteres.

## 5.3 Símbolos utilizados

| Patrón | Significado |
|---|---|
| `[0-9]` | Un dígito ASCII del 0 al 9. |
| `{4}` | Exactamente cuatro repeticiones. |
| `\s` | Un espacio, tabulación o salto de línea. |
| `+` | Una o más repeticiones. |
| `.` | Cualquier carácter, salvo ciertas excepciones. |
| `\.` | Un punto literal. |

No necesitas aprender expresiones regulares avanzadas. Utiliza patrones breves, documentados y acompañados por ejemplos válidos e inválidos.

## 5.4 La herramienta más sencilla que exprese la regla

| Necesidad | Herramienta preferida |
|---|---|
| Eliminar espacios exteriores | `strip()` |
| Comprobar un prefijo fijo | `startswith()` |
| Comprobar varias extensiones | `endswith((...))` |
| Separar una vez por `@` | `partition()` |
| Unir etiquetas | `join()` |
| Comprobar `COA-` + cuatro dígitos | `re.fullmatch()` |
| Encontrar todos los códigos en un párrafo | `re.findall()` |

Una solución profesional no es la que utiliza la herramienta más compleja. Es la que expresa la regla con claridad y se comporta correctamente.

---

# 6. Prácticas guiadas

Realiza cada práctica antes de consultar las soluciones. Puedes llegar a una respuesta diferente si produce el resultado solicitado y puedes explicar tus decisiones.

## Práctica guiada 1 — Normalizar un nombre

Recibes:

```python
nombre_original = "\t  ana    maría   solís \n"
```

Resultado esperado:

```text
Original:    '\t  ana    maría   solís \n'
Normalizado: 'Ana María Solís'
Cambió:      Sí
```

Pasos:

1. Conserva `nombre_original`.
2. Divide sin indicar un separador.
3. Reconstruye con un espacio.
4. Aplica la regla de presentación con `title()`.
5. Compara original y normalizado.
6. Muestra ambos con `!r`.

Prueba también `"Luis Méndez"`, `"   SOFÍA VARGAS"`, `""` y una cadena formada solo por espacios. Un valor vacío debe permanecer vacío; no inventes un nombre.

## Práctica guiada 2 — Validar un correo básico

Define `validar_correo_basico(correo)`. Para esta práctica el correo será aceptable cuando:

- no contenga espacios;
- contenga exactamente una arroba;
- tenga texto antes de la arroba;
- el dominio contenga al menos un punto;
- el dominio no comience ni termine con un punto.

| Valor | Resultado esperado |
|---|---|
| `ana@ejemplo.com` | `True` |
| `ANA@EJEMPLO.COM` | `True` |
| `ana ejemplo@ejemplo.com` | `False` |
| `anaejemplo.com` | `False` |
| `@ejemplo.com` | `False` |
| `ana@ejemplo` | `False` |
| `ana@@ejemplo.com` | `False` |

Utiliza `partition()` y `all()`. No uses una expresión regular.

## Práctica guiada 3 — Construir un reporte alineado

```python
resultados = [
    ("COA-0001", "Ana Solís", "VÁLIDO"),
    ("COA-0002", "Luis Méndez", "CORREGIDO"),
    ("COA-00A3", "María Rojas", "INVÁLIDO"),
]
```

Resultado aproximado:

```text
CÓDIGO       NOMBRE                   ESTADO
------------------------------------------------
COA-0001     Ana Solís                VÁLIDO
COA-0002     Luis Méndez              CORREGIDO
COA-00A3     María Rojas              INVÁLIDO
```

Requisitos:

- código con ancho de 12;
- nombre con ancho de 24;
- estado con ancho de 12;
- separador calculado con `len()`;
- un ciclo para imprimir los registros.

## Práctica guiada 4 — Resumir errores

```python
auditoria = [
    {"codigo": "COA-0001", "errores": 0, "corregido": True},
    {"codigo": "COA-0002", "errores": 2, "corregido": False},
    {"codigo": "COA-0003", "errores": 1, "corregido": True},
    {"codigo": "COA-0004", "errores": 0, "corregido": False},
]
```

Obtén:

- total de errores;
- si existe al menos un registro con errores;
- si todos están libres de errores;
- el registro con mayor cantidad de errores;
- una lista nueva ordenada de mayor a menor cantidad de errores.

Utiliza `sum()`, `any()`, `all()`, `max()` y `sorted()`.

## Práctica guiada 5 — Validar un código exacto

Crea:

```python
def validar_codigo(codigo):
    ...
```

Debe aceptar únicamente `COA-` seguido por cuatro dígitos ASCII.

| Código | Resultado esperado |
|---|---|
| `COA-0001` | `True` |
| `COA-9999` | `True` |
| `coa-0001` | `False` antes de normalizar |
| `COA-001` | `False` |
| `COA-00001` | `False` |
| `COA-00A1` | `False` |
| `XCOA-0001` | `False` |

Utiliza `re.fullmatch()` y convierte el resultado en un booleano claro.

---

# 7. Actividades obligatorias

Estas actividades forman parte de la evaluación. Deben realizarse antes del proyecto y entregarse junto con él en un único punto de entrega.

## Actividad 1 — Limpieza controlada de contactos

```python
contactos = [
    "  ANA   SOLÍS | ANA.SOLIS@EJEMPLO.COM  ",
    "Luis Méndez| luis.mendez@ejemplo.com",
    "  maría josé   rojas|maria.rojas@ejemplo.com ",
    "Carlos Núñez | carlos.nunez @ejemplo.com",
    " |sin.nombre@ejemplo.com",
]
```

Desarrolla un programa que:

1. Separe cada contacto en nombre y correo.
2. Detecte una cantidad incorrecta de campos.
3. Normalice espacios interiores del nombre.
4. Aplique la regla de presentación acordada.
5. Normalice el correo con `strip()` y `casefold()`.
6. Valide nombre y correo.
7. No elimine espacios internos del correo para convertirlo artificialmente en válido.
8. Muestre el original, el normalizado y los problemas encontrados.

Incluye al menos dos casos adicionales creados por ti.

## Actividad 2 — Refactorizar una solución manual

Analiza:

```python
numeros = [12, 8, 21, 5, 17]

total = 0
mayor = numeros[0]
hay_negativos = False

for numero in numeros:
    total = total + numero

    if numero > mayor:
        mayor = numero

    if numero < 0:
        hay_negativos = True

print(total)
print(mayor)
print(hay_negativos)
```

Realiza lo siguiente:

1. Reescribe los cálculos con funciones integradas.
2. Conserva el resultado original.
3. Añade una comprobación que determine si todos los números son positivos.
4. Crea una versión que funcione correctamente si la colección está vacía.
5. Explica en cuatro a seis líneas qué partes resultaron más claras y qué validación adicional fue necesaria.

## Actividad 3 — Elegir la herramienta

Para cada situación, escribe la herramienta que utilizarías y justifica la elección:

1. Comprobar si un archivo termina en `.csv`, `.json` o `.txt`.
2. Quitar el prefijo exacto `TEMP-`.
3. Separar un correo una sola vez por la arroba.
4. Comprobar si un código completo cumple `COA-` seguido por cuatro dígitos.
5. Eliminar espacios exteriores.
6. Encontrar todos los códigos COA dentro de un párrafo.
7. Construir una cadena con etiquetas separadas por coma.
8. Saber si al menos una regla de validación falló.

No basta con escribir el nombre de la herramienta. La justificación demuestra que comprendes el criterio de selección.

---


<!-- coa-activity:python-practico-m1-actividades-obligatorias -->

# 8. Proyecto del módulo — Normalizador y auditor de registros

## Desafío

Una plataforma educativa recibió registros creados manualmente. Antes de utilizarlos, necesita normalizarlos y generar un informe de calidad.

Cada registro utiliza esta estructura:

```text
código | nombre | correo | etiquetas
```

Pueden existir espacios sobrantes, códigos en minúscula, correos con mayúsculas, etiquetas repetidas, campos vacíos, formatos incorrectos, campos adicionales y códigos duplicados.

Tu programa debe conservar el texto original, producir una versión normalizada y explicar cualquier rechazo.

## Datos de trabajo

Utiliza el archivo descargable `datos_registros.py` o esta colección:

```python
REGISTROS = [
    " COA-0001 |  ana   solís | ANA.SOLIS@EJEMPLO.COM | Python, lógica, python ",
    "coa-0002|Luis Méndez| luis.mendez@ejemplo.com|archivos, utilidades",
    "COA-00A3|María José Rojas|maria.rojas@ejemplo.com|texto, validación",
    "COA-0004| |persona@ejemplo.com|python",
    "COA-0005|Diego Mora|diego.moraejemplo.com|reportes",
    "COA-0006|Sofía Vargas|sofia.vargas@ejemplo|Python, ",
    " COA-0007|carlos   núñez| carlos.nunez@ejemplo.com | ",
    "COA-0008|Elena Quesada|elena.quesada @ejemplo.com|cadenas",
    "COA-0009|Javier Ruiz|javier.ruiz@ejemplo.com|Python,Archivos,REPORTES",
    "COA-0010|Lucía Fernández|lucia.fernandez@ejemplo.com|datos, datos, texto",
    "COA-0011|Andrés Soto|andres.soto@ejemplo.com|lógica|campo_extra",
    "COA-0012|Paula Jiménez|@ejemplo.com|validación",
    "COA-0013|Óscar Arias|oscar.arias@.com|texto",
    "COA-0014|Natalia León|natalia.leon@ejemplo.com|  Python ,  lógica ",
    "COA-0014|Ernesto Vega|ernesto.vega@ejemplo.com|duplicado",
    "COA-0015|Marta López|marta.lopez@ejemplo.com|",
]
```

## Reglas de normalización

### Código

- Elimina espacios exteriores.
- Convierte a mayúsculas.
- Después de normalizar debe coincidir exactamente con `COA-` y cuatro dígitos ASCII.
- Un código repetido se considera inválido, aunque el formato sea correcto.

### Nombre

- Elimina espacios exteriores.
- Reduce grupos de espacios, tabulaciones o saltos internos a un espacio.
- Para este conjunto aplica `title()` como regla de presentación.
- Un nombre vacío es inválido.
- Conserva el valor original para auditar la transformación.

### Correo

- Elimina únicamente espacios exteriores.
- Convierte a una forma comparable con `casefold()`.
- No elimines espacios internos.
- Debe contener exactamente una arroba.
- Debe tener contenido antes de la arroba.
- El dominio debe contener un punto y no puede comenzar ni terminar con él.
- Un correo con espacios internos es inválido.

Esta es una validación didáctica, no una implementación completa de todos los estándares de correo electrónico.

### Etiquetas

- Separa por comas.
- Elimina espacios exteriores de cada etiqueta.
- Compara sin distinguir mayúsculas.
- Elimina etiquetas vacías.
- Elimina duplicados conservando la primera aparición.
- Muestra las etiquetas unidas por `, `.
- Son opcionales; un registro puede ser válido sin etiquetas.

## Estados del registro

| Estado | Significado |
|---|---|
| `VÁLIDO` | Cumple todas las reglas y no necesitó cambios. |
| `CORREGIDO` | Cumple todas las reglas después de una normalización permitida. |
| `INVÁLIDO` | Incumple una o más reglas que no deben corregirse adivinando. |

Un registro inválido puede contener campos normalizados para diagnóstico, pero no debe presentarse como aceptado.

## Requisitos funcionales

El programa deberá:

1. Procesar todos los registros sin detenerse ante el primero inválido.
2. Conservar cada registro original.
3. Comprobar que existan exactamente cuatro campos.
4. Normalizar cada campo según las reglas.
5. Validar código, nombre y correo.
6. Detectar códigos duplicados.
7. Acumular una explicación por cada regla incumplida.
8. Determinar si el registro quedó válido, corregido o inválido.
9. Mostrar una tabla ordenada primero por estado y luego por código.
10. Mostrar un detalle de errores para los registros inválidos.
11. Calcular el total de registros válidos, corregidos e inválidos.
12. Informar si existe al menos un registro inválido.
13. Informar si todos los registros aceptados tienen correo válido.
14. Mostrar el registro con mayor cantidad de problemas.

## Herramientas obligatorias

La solución debe utilizar correctamente:

- `strip()`, `split()`, `join()` y `casefold()`;
- `startswith()` o `endswith()` en una comprobación útil;
- una f-string con especificadores de ancho;
- `len()`, `sum()`, `any()` y `all()`;
- `min()` o `max()` con `key`;
- `sorted()` con `key`;
- `re.fullmatch()`.

No es necesario forzar todas las herramientas dentro de una misma función.

## Estructura de funciones recomendada

```python
def normalizar_espacios(texto):
    ...


def normalizar_codigo(codigo):
    ...


def validar_codigo(codigo):
    ...


def normalizar_nombre(nombre):
    ...


def normalizar_correo(correo):
    ...


def validar_correo(correo):
    ...


def normalizar_etiquetas(texto_etiquetas):
    ...


def procesar_registro(texto_original, codigos_utilizados):
    ...


def ordenar_resultados(resultados):
    ...


def mostrar_reporte(resultados):
    ...


def main():
    ...


if __name__ == "__main__":
    main()
```

El punto de entrada se profundizará en el Módulo 6. Puedes utilizarlo desde ahora como una convención que evita ejecutar `main()` cuando el archivo se importa desde otro programa.

Cada resultado puede representarse con un diccionario:

```python
{
    "original": " COA-0001 |  ana   solís | ...",
    "codigo": "COA-0001",
    "nombre": "Ana Solís",
    "correo": "ana.solis@ejemplo.com",
    "etiquetas": ["python", "lógica"],
    "estado": "CORREGIDO",
    "problemas": [],
}
```

Puedes utilizar otra estructura si conserva la misma información y resulta clara.

## Flujo recomendado

### Fase 1. Define las reglas

Escribe un ejemplo válido y uno inválido para cada campo antes de programar.

### Fase 2. Implementa funciones pequeñas

Prueba por separado la normalización de espacios, la validación del código, la validación del correo y la normalización de etiquetas. No esperes a tener el programa completo.

### Fase 3. Procesa un solo registro

Confirma que puedes dividirlo, conservar el original, normalizar los campos y producir una lista de problemas.

### Fase 4. Procesa toda la colección

Utiliza un conjunto para recordar los códigos encontrados. Decide y documenta en qué momento un código se considera utilizado.

### Fase 5. Clasifica

- Si existen problemas, el estado es `INVÁLIDO`.
- Si no existen problemas y algún campo cambió, el estado es `CORREGIDO`.
- Si no existen problemas ni cambios, el estado es `VÁLIDO`.

### Fase 6. Ordena y presenta

Crea una colección nueva con `sorted()`. Conserva la original para demostrar que no fue alterada.

### Fase 7. Resume

Utiliza funciones integradas para calcular totales y comprobaciones globales.

### Fase 8. Prueba casos límite

Añade al menos cinco registros propios. Deben cubrir casos diferentes a los proporcionados.

## Formato mínimo del reporte

```text
AUDITORÍA DE REGISTROS
====================================================================
CÓDIGO       NOMBRE                    ESTADO       PROBLEMAS
--------------------------------------------------------------------
COA-0001     Ana Solís                 CORREGIDO    0
COA-0002     Luis Méndez               CORREGIDO    0
COA-00A3     María José Rojas          INVÁLIDO     1
...

RESUMEN
--------------------------------------------------------------------
Total procesados:      16
Válidos:                ...
Corregidos:             ...
Inválidos:              ...
¿Hay inválidos?:        Sí
Mayor cantidad de problemas: ...

DETALLE DE REGISTROS INVÁLIDOS
--------------------------------------------------------------------
Original: 'COA-00A3|María José Rojas|...'
- El código debe tener el formato COA-0000.
```

Los números son una representación del formato. Tu programa debe calcularlos.

## Plan de pruebas obligatorio

| Caso | Entrada | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| Registro ya válido | Registro sin cambios necesarios | `VÁLIDO` | |
| Normalización permitida | Espacios y mayúsculas inconsistentes | `CORREGIDO` | |
| Código inválido | Código con una letra entre los dígitos | `INVÁLIDO` | |
| Correo inválido | Correo sin arroba | `INVÁLIDO` | |
| Campo vacío | Nombre vacío | `INVÁLIDO` | |
| Campos adicionales | Cinco segmentos separados por `|` | `INVÁLIDO` | |
| Código duplicado | Segundo uso de un código | `INVÁLIDO` | |
| Etiquetas repetidas | Etiqueta repetida con otra capitalización | Etiquetas únicas | |

Añade cinco casos propios. Por lo menos uno debe comprobar un texto completamente vacío.

## Buenas prácticas obligatorias

- Utiliza nombres descriptivos y mantén un solo idioma en el código.
- Cada función debe cumplir una responsabilidad principal.
- Evita variables globales modificables, excepto los datos proporcionados.
- No utilices `replace(" ", "")` para arreglar correos.
- No ocultes problemas con bloques `try/except` generales; las excepciones se estudiarán en el Módulo 6.
- No modifiques la colección original al ordenar.
- No escribas los resultados esperados directamente en el código.
- Incluye comentarios solo cuando expliquen una decisión.

## Entregables

Entrega un único archivo comprimido:

```text
python-practico_modulo-01_nombre-apellido/
├── normalizador_registros.py
├── datos_registros.py
├── README.md
└── evidencia/
    ├── reporte_terminal.txt o captura_reporte.png
    └── plan_pruebas.md
```

El `README.md` debe explicar:

- versión de Python utilizada;
- comando para ejecutar el programa;
- reglas principales de normalización;
- casos que el programa rechaza deliberadamente;
- tres funciones integradas que simplificaron la solución;
- una decisión donde preferiste un método normal de cadena a una expresión regular.

## Preguntas de reflexión

Responde en el `README.md`:

1. ¿Qué transformación podría dañar información válida si se aplica sin una regla clara?
2. ¿Por qué el programa conserva el registro original?
3. ¿Qué diferencia existe entre un registro corregido y uno inválido?
4. ¿Qué ventaja aportó `all()` o `any()`?
5. ¿Qué cambiarías si las reglas del correo fueran más estrictas?

## Punto de entrega obligatorio

Realiza **una sola entrega para todo el módulo**. Incluye las tres actividades obligatorias, el proyecto, el plan de pruebas y las respuestas de reflexión.

Identifica la entrega así:

```text
Curso: Python Práctico
Módulo: 1 — Texto profesional y funciones integradas
Estudiante: nombre completo
Versión: primera entrega o corrección número X
Archivo principal: normalizador_registros.py
Versión de Python: número utilizado
```

Si el proyecto recibe la condición **Pendiente de corrección**, aplica las observaciones y vuelve a enviar el mismo paquete actualizado.

[Entregar el Módulo 1](https://forms.gle/nTx97JRkFkbH5Vfr6)

## Condición de avance

Para continuar al Módulo 2 necesitas:

- obtener al menos 70% en la evaluación;
- entregar todas las actividades obligatorias;
- obtener la condición `Aprobado` en el proyecto;
- corregir cualquier requisito crítico señalado.

---

# 9. Rúbrica de evaluación del proyecto

| Criterio | Ponderación | Desempeño esperado |
|---|---:|---|
| Funcionalidad | 35% | Procesa todos los registros, normaliza, valida, clasifica y genera el reporte. |
| Uso de herramientas | 25% | Aplica métodos de cadenas, funciones integradas y `re.fullmatch()` con criterio. |
| Claridad y organización | 20% | Divide responsabilidades, utiliza nombres claros y evita repetición. |
| Robustez | 10% | Contempla campos vacíos, campos incorrectos, duplicados y casos límite. |
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
- no conserva los registros originales;
- acepta un registro con campos faltantes;
- corrige datos mediante suposiciones no autorizadas;
- escribe manualmente los resultados en lugar de calcularlos;
- omite la explicación de los registros inválidos;
- no utiliza las herramientas obligatorias;
- el estudiante no puede explicar el código;
- faltan archivos necesarios para la revisión.

---


<!-- coa-activity:python-practico-m1-proyecto -->

# 10. Evaluación del módulo

Responde sin ejecutar el código primero. Después utiliza Python para comprobar y analizar tus errores.

## Pregunta 1

¿Qué imprime?

```python
texto = "  Ana   Solís  "
print(" ".join(texto.split()))
```

A. `"Ana   Solís"`  
B. `"Ana Solís"`  
C. `"  Ana Solís  "`  
D. Genera un error

## Pregunta 2

¿Por qué esto no modifica `correo`?

```python
correo = " ANA@EJEMPLO.COM "
correo.strip().lower()
```

A. `strip()` solo funciona con números.  
B. `lower()` necesita un argumento.  
C. Las cadenas son inmutables y el resultado no se guardó.  
D. Ambos métodos se cancelan.

## Pregunta 3

¿Cuál es la opción más clara para comprobar si un archivo termina en `.csv` o `.json`?

A. `archivo.find("csv")`  
B. `archivo.endswith((".csv", ".json"))`  
C. `archivo.replace(".csv", "")`  
D. `archivo.split(".")`

## Pregunta 4

¿Qué devuelve `partition("@")` cuando el separador no existe?

A. Una lista vacía.  
B. Dos elementos.  
C. El texto original, una cadena vacía y otra cadena vacía.  
D. Siempre genera una excepción.

## Pregunta 5

¿Qué resultado produce `all([])`?

A. `True`  
B. `False`  
C. `None`  
D. `ValueError`

## Pregunta 6

¿Qué expresión encuentra el registro completo con más errores?

```python
registros = [
    {"codigo": "COA-1", "errores": 2},
    {"codigo": "COA-2", "errores": 5},
]
```

A. `max(registros["errores"])`  
B. `max(registros, key=lambda r: r["errores"])`  
C. `sorted(registros["errores"])`  
D. `sum(registros, key="errores")`

## Pregunta 7

¿Cuál es la diferencia principal entre `sorted(datos)` y `datos.sort()`?

A. `sorted()` devuelve una lista nueva; `.sort()` modifica la lista.  
B. `.sort()` funciona con cualquier iterable y `sorted()` no.  
C. `sorted()` solo ordena números.  
D. No existe diferencia.

## Pregunta 8

¿Cuál opción comprueba que todo el código coincide con `COA-` y cuatro dígitos ASCII?

A. `re.search(r"COA-[0-9]{4}", codigo)`  
B. `re.findall(r"COA", codigo)`  
C. `re.fullmatch(r"COA-[0-9]{4}", codigo)`  
D. `codigo.replace("COA-", "")`

## Pregunta 9

¿Por qué no conviene ejecutar `correo.replace(" ", "")` sobre cualquier correo?

A. `replace()` no admite cadenas vacías.  
B. Puede ocultar un dato inválido y transformarlo en otra dirección.  
C. Siempre modifica la cadena original.  
D. Elimina también la arroba.

## Pregunta 10

Un registro cumple todas las reglas después de normalizarse, pero cambió respecto al original. ¿Qué estado recibe?

A. `VÁLIDO`  
B. `CORREGIDO`  
C. `INVÁLIDO`  
D. `DUPLICADO`

## Criterio de aprobación

Necesitas responder correctamente al menos 7 de las 10 preguntas. Si no alcanzas el resultado, revisa las explicaciones, ejecuta nuevamente las prácticas y realiza otro intento.

---

# 11. Soluciones de las prácticas guiadas

Consulta estas soluciones únicamente después de realizar un intento completo.

## Solución 1

```python
nombre_original = "\t  ana    maría   solís \n"
nombre_normalizado = " ".join(nombre_original.split()).title()
cambio = nombre_original != nombre_normalizado

print(f"Original:    {nombre_original!r}")
print(f"Normalizado: {nombre_normalizado!r}")
print(f"Cambió:      {'Sí' if cambio else 'No'}")
```

La comparación considera también los espacios y la capitalización. Si necesitas distinguir tipos de cambios, calcula cada transformación por separado.

## Solución 2

```python
def validar_correo_basico(correo):
    usuario, separador, dominio = correo.partition("@")

    return all([
        " " not in correo,
        correo.count("@") == 1,
        separador == "@",
        bool(usuario),
        "." in dominio,
        not dominio.startswith("."),
        not dominio.endswith("."),
    ])
```

La función no normaliza. Separar normalización y validación permite probar cada regla con claridad.

## Solución 3

```python
resultados = [
    ("COA-0001", "Ana Solís", "VÁLIDO"),
    ("COA-0002", "Luis Méndez", "CORREGIDO"),
    ("COA-00A3", "María Rojas", "INVÁLIDO"),
]

encabezado = f"{'CÓDIGO':<12} {'NOMBRE':<24} {'ESTADO':<12}"
print(encabezado)
print("-" * len(encabezado))

for codigo, nombre, estado in resultados:
    print(f"{codigo:<12} {nombre:<24} {estado:<12}")
```

## Solución 4

```python
auditoria = [
    {"codigo": "COA-0001", "errores": 0, "corregido": True},
    {"codigo": "COA-0002", "errores": 2, "corregido": False},
    {"codigo": "COA-0003", "errores": 1, "corregido": True},
    {"codigo": "COA-0004", "errores": 0, "corregido": False},
]

total_errores = sum(registro["errores"] for registro in auditoria)
hay_errores = any(registro["errores"] > 0 for registro in auditoria)
todos_sin_errores = all(registro["errores"] == 0 for registro in auditoria)
mas_problematico = max(
    auditoria,
    key=lambda registro: registro["errores"],
    default=None,
)
ordenados = sorted(
    auditoria,
    key=lambda registro: registro["errores"],
    reverse=True,
)
```

`default=None` permite que `max()` funcione si `auditoria` está vacía.

## Solución 5

```python
import re


def validar_codigo(codigo):
    return re.fullmatch(r"COA-[0-9]{4}", codigo) is not None


def normalizar_codigo(codigo):
    return codigo.strip().upper()
```

Separar normalización y validación permite comprobar qué cambió y qué se acepta.

---

# 12. Retos adicionales

Realízalos después de completar el proyecto obligatorio.

## Reto 1 — Explicar cada cambio

Además de marcar `CORREGIDO`, crea mensajes como:

```text
- se eliminaron espacios exteriores del código
- el código se convirtió a mayúsculas
- se redujeron espacios interiores del nombre
- se eliminaron etiquetas duplicadas
```

Diseña pequeñas comprobaciones entre etapas; no escribas una combinación manual para cada caso posible.

## Reto 2 — Anchos calculados

Calcula el ancho de cada columna según los encabezados y datos, con un máximo razonable.

## Reto 3 — Orden configurable

Permite escoger entre estado y código, nombre sin distinguir mayúsculas o cantidad de problemas de mayor a menor. Utiliza funciones `key` separadas si una `lambda` deja de ser breve.

## Reto 4 — Extraer códigos de notas

Recibe un bloque de texto y utiliza `re.findall()` para extraer códigos COA. Elimina duplicados conservando el orden de aparición.

## Reto 5 — Pruebas con `assert`

```python
assert normalizar_codigo(" coa-0001 ") == "COA-0001"
assert validar_codigo("COA-0001") is True
assert validar_codigo("COA-001") is False
```

Las pruebas formales se estudiarán con mayor profundidad en Desarrollo de Software con Python.

---

# 13. Videos recomendados

Detén la reproducción para ejecutar los ejemplos y evita convertir el video en una actividad pasiva.

- [Métodos para cadenas de texto en Python — Aprende a Programar](https://www.youtube.com/watch?v=hcn4Zc1T43A)
- [¿Qué son las f-strings y cómo funcionan? — Enrique Barros](https://www.youtube.com/watch?v=jS01i00n78c)

## Reproductores de video

[Métodos para cadenas de texto en Python — Aprende a Programar](https://www.youtube.com/watch?v=hcn4Zc1T43A)

[¿Qué son las f-strings y cómo funcionan? — Enrique Barros](https://www.youtube.com/watch?v=jS01i00n78c)

Después del video sobre f-strings, modifica un ejemplo para incluir ancho, alineación y dos decimales.

---

# 14. Documentación y recursos de lectura

No intentes leer cada página completa. Busca la firma, los parámetros, el retorno, las excepciones y uno o dos ejemplos.

## Nivel esencial

- [Métodos del tipo `str`](https://docs.python.org/3/library/stdtypes.html#string-methods)
- [Funciones integradas](https://docs.python.org/3/library/functions.html)
- [Formateo de salida](https://docs.python.org/3/tutorial/inputoutput.html#fancier-output-formatting)

## Formato y expresiones regulares

- [Minilenguaje de formato](https://docs.python.org/3/library/string.html#format-specification-mini-language)
- [Módulo `re`](https://docs.python.org/3/library/re.html)
- [Guía oficial de expresiones regulares](https://docs.python.org/3/howto/regex.html)

## Recursos gratuitos

- [Guía de funciones integradas — Real Python](https://realpython.com/python-built-in-functions/)
- [Python Tutor: ejecución paso a paso](https://pythontutor.com/python.html)

## Ruta de lectura recomendada

1. Abre la documentación de `str`.
2. Busca `partition`.
3. Identifica qué devuelve cuando el separador no existe.
4. Ejecuta el ejemplo en un archivo pequeño.
5. Modifica el separador y predice el resultado.
6. Escribe cuándo utilizarías el método.

Este proceso es más útil que memorizar una lista de métodos sin contexto.

---

# 15. Material descargable

El módulo incluye:

- `datos_registros.py`: registros del proyecto.
- `plantilla_proyecto.py`: estructura opcional con funciones pendientes.
- `MATRIZ_VALIDACION.md`: plantilla para definir reglas y casos.
- `CHECKLIST_PROYECTO.md`: comprobación previa a la entrega.

La plantilla no contiene la solución. Puedes empezar desde un archivo vacío si prefieres diseñar tu propia estructura.

## Descargas

[Descargar todos los materiales del Módulo 1](/downloads/python-practico/modulo-1/python-practico-modulo-1-materiales.zip)

[Descargar datos_registros.py](/downloads/python-practico/modulo-1/datos_registros.py)

[Descargar plantilla_proyecto.py](/downloads/python-practico/modulo-1/plantilla_proyecto.py)

[Descargar MATRIZ_VALIDACION.md](/downloads/python-practico/modulo-1/MATRIZ_VALIDACION.md)

[Descargar CHECKLIST_PROYECTO.md](/downloads/python-practico/modulo-1/CHECKLIST_PROYECTO.md)

---

# 16. Errores comunes

## No guardar el resultado de un método

```python
texto.strip()
```

Las cadenas son inmutables. Guarda o devuelve el resultado.

## Utilizar `title()` como verdad universal

`title()` aplica una regla mecánica. Documenta su uso y no asumas que representa correctamente todos los nombres.

## Confundir `removesuffix()` con `rstrip()`

`rstrip()` recibe un conjunto de caracteres finales; no un sufijo exacto.

## Eliminar espacios internos de un dato inválido

Una limpieza agresiva puede ocultar un error. Corrige únicamente las diferencias autorizadas.

## Desempaquetar sin comprobar los campos

```python
codigo, nombre, correo = registro.split("|")
```

La línea falla si el registro contiene otra cantidad. Comprueba `len(partes)` antes.

## Utilizar `find()` como booleano

```python
if texto.find("COA"):
    ...
```

Si la coincidencia comienza en la posición `0`, el resultado se interpreta como falso. Si solo necesitas saber si existe, utiliza `"COA" in texto`.

## Olvidar que `all([])` devuelve `True`

Cuando una colección vacía no sea válida, combina `bool(coleccion)` con `all(...)`.

## Suponer que `sorted()` modifica la lista

Guarda el resultado devuelto o utiliza `.sort()` solo cuando quieras modificar la lista.

## Utilizar `round()` para dinero sin analizar el tipo

Los valores `float` son aproximados. Los cálculos monetarios se realizarán con `Decimal` en el Módulo 5.

## Aplicar una expresión regular a cualquier texto

Un patrón complejo puede ser más difícil de mantener que `strip()`, `partition()` o `startswith()`.

## Mostrar “inválido” sin explicar la causa

Un sistema auditable conserva el valor original y comunica qué regla se incumplió.

---

# 17. Glosario

| Término | Significado |
|---|---|
| Cadena | Secuencia inmutable de caracteres representada por `str`. |
| Inmutabilidad | Propiedad por la que una operación produce otro valor en lugar de modificar el original. |
| Normalización | Transformación de valores equivalentes hacia una representación coherente. |
| Limpieza | Eliminación de ruido definido, como espacios exteriores. |
| Validación | Comprobación de reglas explícitas. |
| Auditoría | Registro del valor recibido, cambios y problemas encontrados. |
| Método | Función asociada a un objeto, como `texto.strip()`. |
| Función integrada | Función disponible sin importar un módulo, como `len()`. |
| Iterable | Objeto cuyos elementos pueden recorrerse. |
| `key` | Función que indica qué valor comparar u ordenar. |
| F-string | Cadena que permite insertar expresiones y aplicar formato. |
| `repr()` | Representación útil para inspección y diagnóstico. |
| Expresión regular | Patrón para buscar, validar o sustituir texto. |
| Coincidencia | Parte de un texto que cumple un patrón. |
| Caso límite | Entrada cercana a los límites de una regla. |
| Refactorización | Mejora de la estructura sin cambiar el comportamiento esperado. |

---

# 18. Resumen del módulo

Trabajar con texto profesionalmente no consiste en encadenar métodos al azar. Primero debes definir qué es ruido, qué transformación se permite y qué regla determina la validez.

Utilizaste métodos de cadenas para:

- limpiar espacios;
- normalizar comparaciones;
- comprobar prefijos y sufijos;
- dividir y reconstruir texto;
- validar características sencillas;
- conservar y mostrar el valor original.

También utilizaste funciones integradas para:

- calcular totales y extremos;
- comprobar reglas individuales y globales;
- ordenar sin modificar los datos originales;
- escribir soluciones más breves sin perder claridad.

Finalmente, aplicaste expresiones regulares a reglas donde un patrón exacto aporta valor y preferiste métodos normales cuando expresaban mejor la intención.

## Habilidades obtenidas

- Limpieza y normalización controlada de texto.
- Validación mediante reglas explícitas.
- Presentación alineada de resultados.
- Selección de funciones integradas.
- Uso esencial de expresiones regulares.
- Conservación de datos originales para auditoría.
- Diseño y prueba de un programa de procesamiento de registros.

## Antes de continuar

- [ ] Puedo explicar la diferencia entre limpiar, transformar y validar.
- [ ] Puedo normalizar espacios sin destruir el valor original.
- [ ] Sé cuándo utilizar `split()` y cuándo `partition()`.
- [ ] Puedo construir una salida alineada con f-strings.
- [ ] Comprendo los casos vacíos de `any()` y `all()`.
- [ ] Puedo utilizar `min()`, `max()` y `sorted()` con `key`.
- [ ] Puedo explicar por qué `round()` puede sorprender.
- [ ] Sé cuándo una expresión regular aporta valor.
- [ ] Completé las actividades obligatorias.
- [ ] Obtuve al menos 70% en la evaluación.
- [ ] El proyecto fue aprobado.

Cuando cumplas estas condiciones, estarás preparado para el **Módulo 2: Iteración y transformación expresiva**.
