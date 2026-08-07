# COA — Cursos Online Avanzados

## Python Práctico

# Módulo 4. Archivos y rutas con la biblioteca estándar

**Duración aproximada:** 2 horas y 45 minutos  
**Modalidad:** práctica guiada, actividades obligatorias, proyecto y evaluación  
**Nivel:** intermedio  
**Tecnologías:** Python y biblioteca estándar  
**Resultado principal:** un gestor local de catálogo y respaldos

---

## Bienvenida

Hasta ahora los datos de los proyectos han vivido dentro de archivos `.py`. Los programas reales suelen recibir y producir información fuera del código:

```text
CSV con productos
        ↓
Lectura y conversión
        ↓
Validación y transformación
        ↓
JSON con datos aceptados
        ↓
Reporte de resultados y respaldo
```

Trabajar con archivos no consiste únicamente en llamar a `open()`. Una solución profesional debe responder:

- ¿La ruta funciona en diferentes sistemas operativos?
- ¿Qué codificación utiliza el texto?
- ¿El programa sobrescribirá un archivo existente?
- ¿Cómo se validan los tipos leídos desde CSV?
- ¿Qué ocurre si el JSON está incompleto o mal formado?
- ¿Puede verse una operación antes de copiar o mover?
- ¿Se conserva el archivo original?

En este módulo utilizarás administradores de contexto, `pathlib`, `csv`, `json`, las partes realmente útiles de `os` y operaciones básicas de `shutil`.

> **Principio del módulo:** un programa que trabaja con archivos debe proteger primero los datos y realizar después la operación.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Abrir y cerrar archivos correctamente mediante `with`.
- Elegir entre los modos `r`, `w`, `a` y `x`.
- Indicar codificación UTF-8 de forma explícita.
- Leer texto completo, por líneas y mediante iteración.
- Escribir texto sin producir saltos de línea inesperados.
- Construir rutas portables con `pathlib.Path`.
- Consultar nombres, extensiones, carpetas y metadatos.
- Crear carpetas y localizar archivos con `glob()` y `rglob()`.
- Leer y escribir CSV mediante `DictReader` y `DictWriter`.
- Convertir explícitamente los tipos leídos desde CSV.
- Leer y producir JSON legible con caracteres Unicode.
- Diferenciar `load()`, `loads()`, `dump()` y `dumps()`.
- Utilizar `os.getenv()` para configuración opcional.
- Reconocer `os.path` al leer código existente y preferir `pathlib` en código nuevo.
- Copiar y mover archivos mediante `shutil` con comprobaciones previas.
- Crear respaldos sin sobrescribir versiones anteriores.
- Diseñar un modo de vista previa o *dry run*.
- Construir un gestor local de catálogo completamente basado en la biblioteca estándar.

---

## Conocimientos que utilizarás

Necesitas poder:

- crear funciones y módulos sencillos;
- trabajar con listas y diccionarios;
- normalizar cadenas;
- utilizar comprensiones y generadores;
- aplicar `Counter`, `defaultdict` y otras herramientas anteriores;
- comprender un `try/except` básico.

El manejo completo de excepciones se desarrollará en el Módulo 6. Aquí utilizarás únicamente capturas específicas indispensables para leer archivos externos sin ocultar errores inesperados.

---

## Producto que construirás

Desarrollarás un programa que procese un catálogo CSV dentro de un entorno controlado:

```text
gestor_catalogo/
├── entrada/
│   └── catalogo.csv
├── respaldos/
│   └── catalogo_respaldo_20260802_143000.csv
└── resultados/
    ├── catalogo_limpio.json
    ├── registros_rechazados.json
    └── reporte.txt
```

Antes de escribir, copiar o mover, el programa mostrará una vista previa:

```text
VISTA PREVIA
----------------------------------------------------------------------------
[CREAR CARPETA] resultados
[COPIAR] entrada/catalogo.csv → respaldos/catalogo_respaldo_...
[ESCRIBIR] resultados/catalogo_limpio.json
[ESCRIBIR] resultados/registros_rechazados.json
[ESCRIBIR] resultados/reporte.txt

No se realizó ningún cambio. Ejecuta sin --simular para continuar.
```

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Archivos de texto y administradores de contexto | 15 min |
| 2. Rutas modernas con `pathlib` | 18 min |
| 3. Datos tabulares con CSV | 10 min |
| 4. Datos estructurados con JSON | 8 min |
| 5. Configuración, copias y operaciones seguras | 10 min |
| 6. Lectura de documentación y seguridad | 4 min |
| 7. Prácticas guiadas | 25 min |
| 8. Actividades obligatorias | 10 min |
| 9. Proyecto del módulo | 55 min |
| 10. Evaluación y cierre | 10 min |
| **Total** | **2 h 45 min** |

Los retos opcionales y la personalización visual del reporte requieren tiempo adicional.

---

# 1. Archivos de texto y administradores de contexto

## 1.1 El archivo es un recurso externo

Cuando abres un archivo, el sistema operativo asigna un recurso al programa. Ese recurso debe cerrarse aunque la lectura falle o el código tome otro camino.

Forma manual:

```python
archivo = open("notas.txt", mode="r", encoding="utf-8")
contenido = archivo.read()
archivo.close()
```

Forma recomendada:

```python
with open("notas.txt", mode="r", encoding="utf-8") as archivo:
    contenido = archivo.read()
```

Al salir del bloque `with`, Python cierra el archivo automáticamente.

## 1.2 Modos de apertura

| Modo | Comportamiento principal | Riesgo o uso |
|---|---|---|
| `r` | Lee un archivo existente. | Falla si no existe. |
| `w` | Escribe desde cero. | Trunca un archivo existente. |
| `a` | Añade al final. | Puede acumular duplicados. |
| `x` | Crea un archivo nuevo. | Falla si ya existe; evita sobrescribir. |
| `b` | Abre en modo binario. | Se combina, por ejemplo `rb`. |
| `+` | Permite lectura y escritura. | Añade complejidad; úsalo solo si es necesario. |

No utilices `w` hasta confirmar que sobrescribir es realmente la acción deseada. Para una salida que debe ser nueva, `x` puede ser más seguro.

## 1.3 La codificación debe ser explícita

```python
with open("reporte.txt", "r", encoding="utf-8") as archivo:
    contenido = archivo.read()
```

Sin `encoding`, Python utiliza una configuración dependiente del entorno. Un archivo con `ñ`, tildes o símbolos puede funcionar en un equipo y fallar en otro.

UTF-8 es una elección apropiada para los materiales del curso.

## 1.4 Formas de lectura

### Leer todo

```python
with open("reporte.txt", "r", encoding="utf-8") as archivo:
    contenido = archivo.read()
```

Es apropiado para archivos pequeños cuyo contenido completo necesitas en memoria.

### Leer una línea

```python
with open("reporte.txt", "r", encoding="utf-8") as archivo:
    primera_linea = archivo.readline()
```

La línea suele conservar `\n` al final.

### Leer todas las líneas

```python
with open("reporte.txt", "r", encoding="utf-8") as archivo:
    lineas = archivo.readlines()
```

Construye una lista completa.

### Iterar directamente

```python
with open("reporte.txt", "r", encoding="utf-8") as archivo:
    for numero, linea in enumerate(archivo, start=1):
        print(numero, linea.rstrip("\n"))
```

Esta opción procesa una línea a la vez y suele ser preferible para archivos grandes.

No utilices `strip()` automáticamente si los espacios exteriores forman parte del dato. En este ejemplo solo se retira el salto final con `rstrip("\n")`.

## 1.5 Escritura controlada

```python
lineas = ["Primera línea", "Segunda línea", "Tercera línea"]

with open("salida.txt", "w", encoding="utf-8") as archivo:
    for linea in lineas:
        archivo.write(f"{linea}\n")
```

`write()` no añade un salto automáticamente. `print()` puede escribir en un archivo:

```python
with open("salida.txt", "w", encoding="utf-8") as archivo:
    for linea in lineas:
        print(linea, file=archivo)
```

## 1.6 `writelines()` no añade separadores

```python
with open("salida.txt", "w", encoding="utf-8") as archivo:
    archivo.writelines(["uno", "dos", "tres"])
```

Resultado:

```text
unodostres
```

Debes incluir los saltos:

```python
archivo.writelines(f"{linea}\n" for linea in lineas)
```

## 1.7 Posición del cursor

Después de `read()`, el cursor queda al final:

```python
with open("notas.txt", "r", encoding="utf-8") as archivo:
    print(archivo.read())
    print(archivo.read())
```

La segunda lectura devuelve una cadena vacía. Puedes volver al inicio con `archivo.seek(0)`, pero con frecuencia es más claro guardar el contenido o abrir nuevamente según la necesidad.

## 1.8 Una captura específica indispensable

Los archivos externos pueden desaparecer entre la comprobación y la apertura. Una validación previa ayuda, pero no elimina todos los errores. Cuando debas responder de forma controlada, captura la excepción específica:

```python
ruta = "notas.txt"

try:
    with open(ruta, "r", encoding="utf-8") as archivo:
        contenido = archivo.read()
except FileNotFoundError:
    print(f"No se encontró el archivo: {ruta}")
```

No utilices `except:` ni captures `Exception` solo para ocultar cualquier problema. `try`, `except`, `else`, `finally` y el diseño completo de errores se estudiarán en el Módulo 6.

---

# 2. Rutas modernas con `pathlib`

## 2.1 Una ruta no es solo una cadena

```python
from pathlib import Path

ruta = Path("entrada") / "catalogo.csv"
print(ruta)
```

El operador `/` une partes utilizando las reglas del sistema operativo. Evita concatenar separadores manualmente:

```python
# Evita
ruta = "entrada/" + nombre_archivo
```

## 2.2 Rutas relativas y absolutas

```python
ruta_relativa = Path("entrada/catalogo.csv")
ruta_absoluta = ruta_relativa.resolve()

print(Path.cwd())
print(ruta_absoluta)
```

Una ruta relativa se interpreta desde el directorio de trabajo actual, que no siempre coincide con la carpeta del script.

Si los recursos deben localizarse junto al archivo `.py`:

```python
CARPETA_PROYECTO = Path(__file__).resolve().parent
RUTA_ENTRADA = CARPETA_PROYECTO / "entrada" / "catalogo.csv"
```

En un intérprete interactivo puede no existir `__file__`. Dentro de un script sí.

## 2.3 Inspeccionar una ruta

```python
ruta = Path("entrada/catalogo.csv")

print(ruta.name)
print(ruta.stem)
print(ruta.suffix)
print(ruta.parent)
```

Salida conceptual:

```text
catalogo.csv
catalogo
.csv
entrada
```

Para múltiples extensiones:

```python
ruta = Path("respaldo.tar.gz")
print(ruta.suffix)
print(ruta.suffixes)
```

## 2.4 Comprobar el tipo de destino

```python
if ruta.exists():
    print("La ruta existe")

if ruta.is_file():
    print("Es un archivo")

if ruta.is_dir():
    print("Es una carpeta")
```

`exists()` no sustituye el manejo de errores. El estado puede cambiar antes de abrir o copiar.

## 2.5 Crear carpetas

```python
salida = Path("resultados")
salida.mkdir(parents=True, exist_ok=True)
```

- `parents=True` crea carpetas superiores faltantes.
- `exist_ok=True` evita un error si la carpeta ya existe.

Utiliza `exist_ok=True` solo cuando reutilizar la carpeta sea seguro. Si esperas una carpeta completamente nueva, un error puede revelar una colisión importante.

## 2.6 Buscar archivos

```python
carpeta = Path("entrada")

for ruta_csv in carpeta.glob("*.csv"):
    print(ruta_csv)
```

`glob()` busca según el patrón en la ubicación indicada. `rglob()` incluye subcarpetas:

```python
for ruta_json in carpeta.rglob("*.json"):
    print(ruta_json)
```

Ordena si el orden de procesamiento debe ser reproducible:

```python
archivos = sorted(carpeta.rglob("*.json"))
```

## 2.7 Leer y escribir texto con `Path`

```python
ruta = Path("reporte.txt")

contenido = ruta.read_text(encoding="utf-8")
ruta.write_text("Reporte generado\n", encoding="utf-8")
```

Estos métodos son cómodos para archivos pequeños completos. `write_text()` sobrescribe. Para lectura por líneas, anexar o controlar opciones adicionales, utiliza `ruta.open()`:

```python
with ruta.open("a", encoding="utf-8") as archivo:
    archivo.write("Nueva línea\n")
```

## 2.8 Metadatos básicos

```python
informacion = ruta.stat()

print(informacion.st_size)
print(informacion.st_mtime)
```

- `st_size` contiene el tamaño en bytes.
- `st_mtime` contiene la última modificación como marca temporal.

El tamaño en bytes no equivale necesariamente a la cantidad de caracteres.

## 2.9 Cambiar nombre sin sobrescribir silenciosamente

```python
origen = Path("reporte_temporal.txt")
destino = Path("reporte_final.txt")

if destino.exists():
    print(f"No se renombró: el destino ya existe: {destino}")
else:
    origen.rename(destino)
```

`replace()` puede sobrescribir según el sistema y la situación. No lo utilices si la política exige conservar cualquier archivo existente.

## 2.10 Verificar que una ruta permanezca en el entorno permitido

Si una ruta proviene del usuario y realizarás una operación importante, resuélvela y comprueba su relación con la carpeta esperada:

```python
base = Path("gestor_catalogo").resolve()
destino = (base / "resultados" / "reporte.txt").resolve()

if not destino.is_relative_to(base):
    print("La ruta de destino sale del entorno permitido")
```

`Path.is_relative_to()` comprueba la relación estructural. Comparar cadenas con `startswith()` no es una validación de rutas confiable.

---

# 3. Datos tabulares con CSV

## 3.1 CSV almacena texto tabular

Ejemplo:

```csv
codigo,nombre,precio,existencia
PRD-001,Teclado mecánico,32000,8
PRD-002,Ratón inalámbrico,14500,3
```

CSV no define tipos de Python. Los números se leen como cadenas y deben convertirse después de validar.

## 3.2 Leer filas como listas

```python
import csv
from pathlib import Path

ruta = Path("entrada/catalogo.csv")

with ruta.open("r", encoding="utf-8", newline="") as archivo:
    lector = csv.reader(archivo)

    for fila in lector:
        print(fila)
```

`newline=""` permite que el módulo `csv` gestione correctamente los saltos de línea, especialmente entre sistemas operativos.

## 3.3 Leer filas como diccionarios

```python
with ruta.open("r", encoding="utf-8", newline="") as archivo:
    lector = csv.DictReader(archivo)

    for fila in lector:
        print(fila["codigo"], fila["nombre"])
```

La primera fila se utiliza como encabezado. Cada fila es un diccionario cuyas claves proceden de ese encabezado.

Comprueba los encabezados requeridos:

```python
CAMPOS_REQUERIDOS = {
    "codigo",
    "nombre",
    "categoria",
    "precio",
    "existencia",
}

campos_recibidos = set(lector.fieldnames or [])
campos_faltantes = CAMPOS_REQUERIDOS - campos_recibidos
```

No dependas del orden si accederás por nombre.

## 3.4 Convertir tipos de forma explícita

```python
def convertir_fila(fila):
    codigo = fila["codigo"].strip().upper()
    nombre = " ".join(fila["nombre"].split())
    precio = int(fila["precio"])
    existencia = int(fila["existencia"])

    return {
        "codigo": codigo,
        "nombre": nombre,
        "precio": precio,
        "existencia": existencia,
    }
```

`int()` puede producir `ValueError`. Captura esa excepción cerca de la fila que la provoca para poder reportar su número y conservar el resto:

```python
try:
    precio = int(fila["precio"])
except ValueError:
    problemas.append("El precio debe ser un número entero")
```

No conviertas una cadena vacía a cero sin una regla explícita. Vacío y cero pueden significar cosas distintas.

## 3.5 Campos adicionales y faltantes

`DictReader` puede colocar campos adicionales bajo la clave `None`. También puede asignar `None` a encabezados sin valor. Revisa:

```python
if None in fila:
    problemas.append("La fila contiene columnas adicionales")

for campo in CAMPOS_REQUERIDOS:
    if fila.get(campo) is None:
        problemas.append(f"Falta el campo {campo}")
```

## 3.6 Escribir CSV

```python
campos = ["codigo", "nombre", "precio", "existencia"]

with Path("salida.csv").open(
    "w",
    encoding="utf-8",
    newline="",
) as archivo:
    escritor = csv.DictWriter(archivo, fieldnames=campos)
    escritor.writeheader()
    escritor.writerows(productos)
```

`DictWriter` puede recibir claves adicionales. Define `extrasaction="ignore"` únicamente si descartarlas es una decisión consciente; de lo contrario, el error ayuda a detectar una estructura inesperada.

## 3.7 No construyas CSV manualmente

Evita:

```python
archivo.write(f"{codigo},{nombre},{precio}\n")
```

Un nombre puede contener comas, comillas o saltos de línea. El módulo `csv` aplica el escapado correspondiente.

## 3.8 Delimitadores y dialectos

Algunos archivos utilizan punto y coma:

```python
lector = csv.DictReader(archivo, delimiter=";")
```

No adivines el delimitador dentro de cada fila. Define la especificación de entrada o utiliza herramientas de detección solo después de comprender sus limitaciones.

---

# 4. Datos estructurados con JSON

## 4.1 JSON representa estructuras compatibles

```json
{
  "codigo": "PRD-001",
  "nombre": "Teclado mecánico",
  "precio": 32000,
  "activo": true,
  "etiquetas": ["accesorio", "teclado"],
  "observacion": null
}
```

Correspondencias principales:

| JSON | Python |
|---|---|
| objeto | `dict` |
| arreglo | `list` |
| cadena | `str` |
| número entero | `int` |
| número decimal | `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

Las claves de los objetos JSON son cadenas.

## 4.2 `load()` y `loads()`

`load()` lee desde un archivo abierto:

```python
import json
from pathlib import Path

ruta = Path("configuracion.json")

with ruta.open("r", encoding="utf-8") as archivo:
    configuracion = json.load(archivo)
```

`loads()` interpreta una cadena:

```python
texto_json = '{"simular": true, "limite": 10}'
configuracion = json.loads(texto_json)
```

La letra `s` puede recordarte *string*.

## 4.3 `dump()` y `dumps()`

`dump()` escribe en un archivo abierto:

```python
with Path("catalogo.json").open("w", encoding="utf-8") as archivo:
    json.dump(
        productos,
        archivo,
        ensure_ascii=False,
        indent=2,
    )
```

- `ensure_ascii=False` conserva caracteres como `ñ` y tildes de forma legible.
- `indent=2` produce una estructura fácil de revisar.

`dumps()` devuelve una cadena:

```python
texto = json.dumps(productos, ensure_ascii=False, indent=2)
```

## 4.4 JSON válido no significa datos válidos

Este JSON es sintácticamente correcto:

```json
{"precio": -500, "existencia": "muchas"}
```

El programa aún debe validar las reglas del dominio. El módulo `json` comprueba la sintaxis, no que el precio sea positivo o la existencia sea entera.

## 4.5 JSON mal formado

```python
try:
    with ruta.open("r", encoding="utf-8") as archivo:
        datos = json.load(archivo)
except json.JSONDecodeError as error:
    print(
        f"JSON inválido en línea {error.lineno}, "
        f"columna {error.colno}: {error.msg}"
    )
```

Captura `FileNotFoundError` por separado si también deseas informar un archivo ausente. No mezcles causas diferentes en un mensaje genérico.

## 4.6 Tipos no serializables directamente

Objetos como `Path`, `datetime`, `Decimal` y conjuntos no tienen una representación JSON automática:

```python
datos = {"ruta": Path("catalogo.csv")}
```

Convierte de forma explícita según la regla:

```python
datos = {"ruta": str(Path("catalogo.csv"))}
```

No utilices `default=str` sin analizarlo: puede ocultar conversiones importantes y producir formatos que después no podrás reconstruir de forma confiable.

## 4.7 No escribas directamente sobre una salida importante

Si el proceso falla durante la escritura, el archivo puede quedar incompleto. En proyectos posteriores aprenderás estrategias más completas. Para este módulo:

1. conserva la entrada;
2. evita sobrescribir una salida existente sin confirmación;
3. escribe en una carpeta de resultados;
4. valida los datos antes de abrir el destino con `w`;
5. crea primero el respaldo requerido.

---

# 5. Configuración, copias y operaciones seguras

## 5.1 `os.getenv()` para configuración opcional

```python
import os
from pathlib import Path

valor = os.getenv("COA_CATALOGO_DIR")

if valor:
    carpeta_base = Path(valor)
else:
    carpeta_base = Path(__file__).resolve().parent
```

Una variable de entorno permite cambiar una ruta sin modificar el código. No guardes contraseñas ni datos sensibles en ejemplos, capturas o repositorios.

`os.getenv()` devuelve `None` si la variable no existe, o el valor predeterminado que indiques:

```python
modo = os.getenv("COA_MODO", "simulacion")
```

## 5.2 Información mínima del sistema

```python
print(os.name)
```

`os.name` puede ayudar en diagnósticos muy concretos, pero no debes llenar el código de decisiones por sistema si `pathlib` ya ofrece una operación portable.

## 5.3 `os.path` en código existente

Puedes encontrar:

```python
ruta = os.path.join("entrada", "catalogo.csv")
nombre = os.path.basename(ruta)
```

Es válido, pero en código nuevo de este curso se prefiere:

```python
ruta = Path("entrada") / "catalogo.csv"
nombre = ruta.name
```

No mezcles sin necesidad cadenas y objetos `Path`. Muchas funciones aceptan ambos, pero un estilo consistente reduce conversiones.

## 5.4 Copiar con `shutil`

```python
import shutil

origen = Path("entrada/catalogo.csv")
destino = Path("respaldos/catalogo.csv")

shutil.copy2(origen, destino)
```

- `copy()` copia contenido y permisos básicos.
- `copy2()` intenta conservar también metadatos.
- `copytree()` copia una carpeta completa.

No todos los metadatos pueden conservarse en todos los sistemas.

## 5.5 No sobrescribir respaldos

```python
if destino.exists():
    print(f"No se creó el respaldo porque ya existe: {destino}")
else:
    shutil.copy2(origen, destino)
```

Para nombres únicos por fecha y hora:

```python
from datetime import datetime

marca = datetime.now().strftime("%Y%m%d_%H%M%S")
destino = Path("respaldos") / f"catalogo_respaldo_{marca}.csv"
```

Este uso de `datetime` se limita a nombrar el respaldo. Las fechas, duraciones y zonas horarias se estudiarán en el Módulo 5.

Incluso con segundos puede existir una colisión si se ejecuta dos veces rápidamente. Comprueba siempre `destino.exists()` y crea otra versión o detén la operación.

## 5.6 Copiar carpetas

```python
shutil.copytree(origen_carpeta, destino_carpeta)
```

De forma predeterminada, falla si el destino existe. Esa protección es útil para respaldos. `dirs_exist_ok=True` permite combinar con una carpeta existente, pero puede reemplazar archivos; no lo utilices sin una política explícita.

## 5.7 Mover no es copiar

```python
shutil.move(origen, destino)
```

Mover cambia la ubicación del recurso y puede reemplazar un destino según la plataforma y el tipo de ruta. Antes de mover:

1. resuelve origen y destino;
2. comprueba que el origen exista;
3. comprueba que el destino no exista;
4. muestra la operación;
5. confirma que el destino permanece en el entorno permitido;
6. realiza la operación.

El proyecto principal crea copias y salidas nuevas. No necesita mover ni borrar datos.

## 5.8 Vista previa o *dry run*

```python
def copiar_seguro(origen, destino, simular=True):
    print(f"[COPIAR] {origen} → {destino}")

    if simular:
        return False

    if not origen.is_file():
        print("No se copió: el origen no es un archivo")
        return False

    if destino.exists():
        print("No se copió: el destino ya existe")
        return False

    destino.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(origen, destino)
    return True
```

La simulación no debe crear carpetas ni archivos. Solo debe mostrar lo que se realizaría.

## 5.9 Operaciones destructivas fuera de la práctica

`Path.unlink()`, `Path.rmdir()` y `shutil.rmtree()` eliminan información. No se utilizarán en los ejercicios ni en el proyecto.

Si un proyecto futuro necesita borrar:

- limita la operación a una carpeta concreta;
- resuelve la ruta absoluta;
- rechaza rutas amplias o inesperadas;
- muestra el objetivo exacto;
- utiliza confirmación explícita;
- prefiere una operación recuperable cuando exista.

---

# 6. Lectura de documentación y seguridad

Antes de utilizar una función de archivos, localiza en la documentación:

1. qué acepta como origen y destino;
2. si sobrescribe;
3. qué devuelve;
4. qué excepciones puede producir;
5. si su comportamiento cambia entre sistemas;
6. si conserva metadatos;
7. si opera sobre archivos, carpetas o ambos.

Para operaciones de disco, la documentación no es material opcional: forma parte de la comprobación de seguridad.

---

# 7. Prácticas guiadas

Trabaja únicamente dentro de la carpeta descargable del módulo.

## Práctica guiada 1 — Leer y numerar un archivo

Crea `notas.txt` con líneas vacías, tildes y espacios exteriores. Desarrolla una función que:

- reciba un objeto `Path`;
- compruebe que sea archivo;
- lea con UTF-8 mediante `with`;
- enumere las líneas desde uno;
- retire únicamente `\n` para mostrar;
- conserve los espacios originales;
- muestre con `!r` las líneas vacías o sospechosas.

Prueba un archivo existente y una ruta inexistente.

## Práctica guiada 2 — Inventario de una carpeta

Recorre `entorno_practica` con `rglob("*")` y genera una lista ordenada que muestre:

```text
TIPO      RUTA RELATIVA                         BYTES
archivo   entrada/catalogo.csv                  ...
carpeta   casos_prueba                          -
```

Requisitos:

- muestra rutas relativas a la carpeta base;
- distingue archivos y carpetas;
- consulta `st_size` solo para archivos;
- no sigas rutas fuera del entorno;
- no modifiques nada.

## Práctica guiada 3 — Leer CSV y convertir tipos

Lee `entrada/catalogo.csv` con `DictReader`. Para cada fila:

1. conserva el diccionario original;
2. normaliza código, nombre y categoría;
3. convierte precio y existencia a enteros;
4. registra problemas de conversión;
5. muestra el número de fila real considerando el encabezado;
6. separa filas convertibles y rechazadas.

No escribas todavía archivos de salida.

## Práctica guiada 4 — Recorrido JSON

Construye una colección pequeña y realiza el recorrido:

```text
objeto Python
      ↓ json.dumps()
cadena JSON
      ↓ json.loads()
nuevo objeto Python
```

Comprueba la igualdad entre el objeto inicial y el reconstruido. Después intenta incluir un `Path`, observa el `TypeError` y define una conversión explícita.

Finalmente, intenta leer `casos_prueba/configuracion_invalida.json` y muestra la línea y columna del error.

## Práctica guiada 5 — Copia con simulación

Crea una función que reciba origen, destino y `simular`:

- en simulación, muestra la operación y no crea nada;
- verifica que el origen sea archivo;
- rechaza un destino existente;
- verifica que el destino esté dentro de la carpeta de práctica;
- crea la carpeta padre únicamente en ejecución real;
- utiliza `copy2()`.

Comprueba el estado del sistema antes y después de la simulación para demostrar que no hubo cambios.

---

# 8. Actividades obligatorias

## Actividad 1 — Comparar tres formas de lectura

Utiliza el mismo archivo de texto y compara:

1. `read()`;
2. `readlines()`;
3. iteración directa.

Entrega un ejemplo funcional de cada forma y explica cuál elegirías para:

- un archivo de configuración pequeño;
- un archivo de registro muy grande;
- una tarea que necesita acceder varias veces a todas las líneas.

Incluye cómo se comporta el cursor después de una lectura completa.

## Actividad 2 — Diagnosticar un CSV problemático

Utiliza `casos_prueba/catalogo_campos_faltantes.csv`. Debes:

- identificar encabezados faltantes;
- evitar iniciar el procesamiento normal;
- informar cuáles faltan;
- conservar el archivo intacto;
- demostrar que una fila de CSV continúa produciendo cadenas aunque parezca contener números.

## Actividad 3 — Plan de operación segura

Recibes estas operaciones propuestas:

1. sobrescribir `catalogo.csv` con datos limpios;
2. copiar el original a `respaldos/`;
3. mover el archivo rechazado fuera del proyecto;
4. combinar una carpeta de respaldo con otra existente;
5. borrar toda la carpeta temporal.

Para cada operación indica:

- si debe permitirse en este módulo;
- qué comprobaciones previas requiere;
- si debe aparecer primero en simulación;
- qué alternativa conserva mejor los datos.

No ejecutes las operaciones destructivas.

---

# 9. Proyecto del módulo — Gestor local de catálogo y respaldos

## 9.1. Situación profesional

Una pequeña empresa conserva su catálogo en un archivo CSV. El archivo puede contener espacios innecesarios, diferencias entre mayúsculas y minúsculas, datos inválidos y códigos repetidos. La empresa necesita una herramienta que revise el catálogo, genere resultados claros y cree un respaldo del archivo original.

El programa debe trabajar con cuidado: **nunca debe modificar, mover ni eliminar el CSV original**. Antes de escribir cualquier archivo, debe ofrecer un modo de simulación que muestre exactamente lo que ocurriría.

El proyecto reúne las herramientas centrales del módulo:

- rutas con `pathlib`;
- lectura profesional de CSV;
- validación y conversión de datos;
- escritura de JSON y texto;
- configuración mediante JSON y variables de entorno;
- copias con `shutil`;
- operaciones seguras y modo de simulación.

## 9.2. Producto que debes construir

Desarrolla un programa de consola llamado **Gestor local de catálogo y respaldos**. Al ejecutarse, debe:

1. determinar la carpeta base del entorno;
2. leer la configuración;
3. construir y validar todas las rutas;
4. mostrar un plan de operaciones;
5. procesar `entrada/catalogo.csv`;
6. separar registros aceptados y rechazados;
7. generar dos archivos JSON y un reporte de texto;
8. crear una copia de respaldo del CSV original;
9. preservar en todo momento el archivo de entrada.

El programa tendrá dos modos:

- **Simulación:** anuncia las operaciones, valida lo que pueda validarse y no escribe ni copia archivos.
- **Ejecución:** realiza las operaciones después de superar todas las comprobaciones.

> Ejecuta primero la simulación. La ejecución real solo debe realizarse cuando el plan sea correcto.

## 9.3. Entorno de trabajo

Utiliza el paquete descargable del módulo. Su estructura inicial es:

```text
entorno_practica_modulo_4/
├── entrada/
│   └── catalogo.csv
├── configuracion/
│   └── configuracion.json
├── casos_prueba/
│   ├── catalogo_campos_faltantes.csv
│   ├── configuracion_invalida.json
│   └── notas_utf8.txt
├── respaldos/
│   └── LEEME.md
├── resultados/
│   └── LEEME.md
├── plantilla_proyecto.py
├── GUIA_ARCHIVOS_SEGUROS.md
└── CHECKLIST_PROYECTO.md
```

No cambies manualmente `entrada/catalogo.csv` para hacer que el proyecto funcione. El propósito es que el programa detecte y gestione sus problemas.

## 9.4. Formato del catálogo

El CSV contiene estos encabezados obligatorios:

| Campo | Regla |
|---|---|
| `codigo` | Formato exacto `PRD-` seguido de tres dígitos; no puede repetirse |
| `nombre` | Texto no vacío después de normalizar espacios |
| `categoria` | Texto no vacío; debe guardarse de forma consistente |
| `precio` | Número entero mayor que cero |
| `existencia` | Número entero igual o mayor que cero |

La normalización mínima debe:

- eliminar espacios al inicio y al final;
- convertir el código a mayúsculas;
- reemplazar grupos de espacios internos del nombre por un solo espacio;
- guardar la categoría con una presentación consistente, por ejemplo mediante `title()`;
- convertir `precio` y `existencia` a `int`.

Una fila corregida puede ser aceptada si cumple todas las reglas después de normalizarse. Una fila con uno o más errores debe ir al archivo de rechazados.

## 9.5. Resultados esperados con el archivo principal

El archivo de práctica contiene 12 registros. Si las reglas se implementan correctamente, el resultado debe ser:

| Clasificación | Cantidad |
|---|---:|
| Válidos sin cambios | 4 |
| Corregidos y aceptados | 2 |
| Rechazados | 6 |
| Total leído | 12 |

Por tanto, `catalogo_limpio.json` debe contener **6 productos aceptados**.

Estas cantidades permiten comprobar la lógica, pero no sustituyen la validación. El programa debe calcularlas a partir de los archivos.

## 9.6. Archivos que debe generar

En modo de ejecución, el programa debe crear:

```text
resultados/
├── catalogo_limpio.json
├── registros_rechazados.json
└── reporte.txt

respaldos/
└── catalogo_YYYYMMDD_HHMMSS.csv
```

### `catalogo_limpio.json`

Debe contener únicamente los registros aceptados, ya normalizados y con sus tipos correctos. Ejemplo de un elemento:

```json
{
  "codigo": "PRD-001",
  "nombre": "Teclado mecánico",
  "categoria": "Accesorios",
  "precio": 32000,
  "existencia": 8
}
```

### `registros_rechazados.json`

Debe conservar la información necesaria para corregir cada problema:

```json
{
  "linea": 5,
  "registro_original": {
    "codigo": "PRD-004",
    "nombre": "",
    "categoria": "Accesorios",
    "precio": "18500",
    "existencia": "0"
  },
  "problemas": [
    "El nombre está vacío."
  ]
}
```

El número de línea debe coincidir con la línea real del archivo. Recuerda que el encabezado ocupa la primera línea.

### `reporte.txt`

Debe incluir, como mínimo:

- nombre del archivo procesado;
- fecha y hora del proceso;
- cantidad total de filas;
- cantidad válida sin cambios;
- cantidad corregida y aceptada;
- cantidad rechazada;
- cantidad final aceptada;
- distribución de productos aceptados por categoría;
- lista de problemas encontrados y su frecuencia;
- rutas relativas de los archivos generados;
- confirmación de que el original se conservó.

### Respaldo

La copia debe conservar los metadatos cuando el sistema lo permita, por lo que debes utilizar `shutil.copy2()`. El nombre debe incluir una marca de tiempo para evitar sobrescrituras accidentales.

## 9.7. Configuración

El archivo `configuracion/configuracion.json` define nombres y opciones del proceso. Léelo con `json.load()`; no dupliques esos valores innecesariamente en el código.

La carpeta base puede determinarse así:

1. si existe la variable de entorno `COA_CATALOGO_BASE`, utiliza su valor;
2. en caso contrario, utiliza la carpeta que contiene `plantilla_proyecto.py`.

Ejemplo:

```python
import os
from pathlib import Path


def obtener_carpeta_base() -> Path:
    valor_entorno = os.getenv("COA_CATALOGO_BASE")

    if valor_entorno:
        return Path(valor_entorno).expanduser().resolve()

    return Path(__file__).resolve().parent
```

La variable de entorno es opcional. No debe ser necesario modificar el programa para cambiar la ubicación del entorno.

## 9.8. Arquitectura mínima recomendada

Organiza el programa en funciones con una responsabilidad clara. Esta distribución es una guía:

```python
def obtener_carpeta_base():
    ...


def cargar_configuracion(ruta_configuracion):
    ...


def construir_rutas(carpeta_base, configuracion, marca_tiempo):
    ...


def validar_rutas(carpeta_base, rutas):
    ...


def mostrar_plan(rutas, simular):
    ...


def leer_catalogo(ruta_csv):
    ...


def validar_encabezados(encabezados):
    ...


def normalizar_y_validar_fila(fila, numero_linea, codigos_vistos):
    ...


def procesar_catalogo(filas):
    ...


def crear_resumen(aceptados, rechazados):
    ...


def escribir_json(ruta, contenido):
    ...


def escribir_reporte(ruta, resumen, rutas):
    ...


def crear_respaldo(origen, destino):
    ...


def ejecutar(simular=True):
    ...


def main():
    ...
```

No es obligatorio conservar exactamente estos nombres. Sí es obligatorio evitar una única función extensa que haga todo el trabajo.

## 9.9. Secuencia segura

El flujo general debe ser:

```text
INICIO
  │
  ├─ Determinar carpeta base
  ├─ Leer configuración
  ├─ Construir todas las rutas una sola vez
  ├─ Comprobar entrada, extensión y límites del entorno
  ├─ Comprobar que las salidas no existan
  ├─ Leer y validar el CSV
  ├─ Preparar resultados en memoria
  ├─ Mostrar el plan completo
  │
  ├─ ¿Modo simulación?
  │       ├─ Sí → informar y terminar sin cambios
  │       └─ No
  │
  ├─ Crear carpetas necesarias
  ├─ Escribir resultados
  ├─ Crear respaldo con copy2()
  └─ Mostrar resumen final
```

Primero valida y prepara; después modifica el sistema de archivos. Esta separación reduce el riesgo de dejar un proceso a medias por un error previsible.

## 9.10. Requisitos funcionales obligatorios

El proyecto debe cumplir todos estos requisitos:

1. utilizar `Path` para construir y consultar rutas;
2. utilizar `with` en toda apertura de archivos;
3. declarar `encoding="utf-8"` en archivos de texto y JSON;
4. abrir CSV con `newline=""`;
5. utilizar `csv.DictReader`;
6. validar exactamente los cinco encabezados obligatorios;
7. informar encabezados faltantes y adicionales;
8. conservar el registro original antes de normalizarlo;
9. convertir explícitamente precio y existencia;
10. detectar todos los problemas de una fila, no solo el primero;
11. detectar códigos duplicados;
12. separar válidos sin cambios, corregidos y rechazados;
13. utilizar `json.dump()` con `ensure_ascii=False` e indentación;
14. utilizar `shutil.copy2()` para el respaldo;
15. utilizar `os.getenv()` para la carpeta base opcional;
16. rechazar rutas que salgan de la carpeta base;
17. rechazar salidas ya existentes;
18. mostrar rutas claras y preferiblemente relativas a la carpeta base;
19. implementar `simular=True` sin escrituras, copias ni creación de carpetas;
20. conservar intacto el CSV original.

## 9.11. Reglas de seguridad

- No utilices `unlink()`, `rmdir()`, `remove()`, `rmtree()` ni funciones equivalentes.
- No sobrescribas archivos existentes.
- No utilices `shutil.move()` en este proyecto.
- No ejecutes rutas recibidas sin resolverlas y comprobarlas.
- No aceptes una carpeta de resultados ubicada fuera del entorno.
- No ocultes errores mediante un `except Exception` vacío.
- No uses `default=str` para convertir silenciosamente cualquier objeto a JSON.
- No cambies el archivo de entrada para obtener las cantidades esperadas.

## 9.12. Salida de consola sugerida

```text
GESTOR LOCAL DE CATÁLOGO Y RESPALDOS
Modo: SIMULACIÓN

Entrada: entrada/catalogo.csv
Configuración: configuracion/configuracion.json

Resultado del análisis
  Filas leídas: 12
  Válidas sin cambios: 4
  Corregidas y aceptadas: 2
  Rechazadas: 6
  Total aceptado: 6

Plan de operaciones
  CREAR  resultados/catalogo_limpio.json
  CREAR  resultados/registros_rechazados.json
  CREAR  resultados/reporte.txt
  COPIAR entrada/catalogo.csv
       A respaldos/catalogo_20260802_143000.csv

SIMULACIÓN COMPLETADA: no se modificó ningún archivo.
```

La fecha del ejemplo es ilustrativa. El programa debe generar su propia marca de tiempo.

## 9.13. Pruebas obligatorias

Documenta el resultado de estas pruebas:

| # | Prueba | Resultado esperado |
|---:|---|---|
| 1 | Ejecutar en simulación | No aparecen archivos ni carpetas nuevas |
| 2 | Procesar el catálogo principal | 6 aceptados y 6 rechazados |
| 3 | Revisar tildes y `ñ` en JSON | Se conservan correctamente |
| 4 | Usar CSV con encabezados faltantes | Se informa el problema y no se generan salidas |
| 5 | Usar un archivo inexistente | Mensaje claro; no hay cambios |
| 6 | Usar una extensión distinta de `.csv` | Operación rechazada |
| 7 | Intentar una ruta fuera de la base | Operación rechazada |
| 8 | Ejecutar cuando una salida ya existe | No se sobrescribe nada |
| 9 | Revisar código duplicado y números inválidos | Ambos problemas se registran correctamente |
| 10 | Comparar el CSV antes y después | Contenido original idéntico |

Para la prueba 10 puedes leer el contenido antes y después y comparar ambas cadenas. No necesitas calcular hashes en este módulo.

## 9.14. Entrega

Comprime tu solución en un único archivo `.zip` con esta estructura:

```text
apellido_nombre_modulo_4/
├── gestor_catalogo.py
├── entrada/
│   └── catalogo.csv
├── configuracion/
│   └── configuracion.json
├── resultados/
│   ├── catalogo_limpio.json
│   ├── registros_rechazados.json
│   └── reporte.txt
├── respaldos/
│   └── catalogo_YYYYMMDD_HHMMSS.csv
├── evidencias/
│   ├── simulacion.png
│   └── ejecucion.png
└── README.md
```

El `README.md` debe explicar:

- cómo ejecutar el programa;
- cómo activar la simulación;
- qué archivos genera;
- qué decisiones de seguridad implementaste;
- cuáles pruebas realizaste;
- cualquier limitación conocida.

Realiza **una sola entrega** en el punto indicado para el módulo. No es necesario enviar cada práctica por separado, salvo que la plataforma lo solicite expresamente.

[Entregar el Módulo 4](https://forms.gle/nTx97JRkFkbH5Vfr6)

## 9.15. Condición de aprobación

El proyecto debe ser aprobado antes de continuar al Módulo 5. Si una operación puede sobrescribir el catálogo original, si la simulación modifica archivos o si no se validan las rutas, el proyecto deberá corregirse aunque produzca resultados aparentemente correctos.

---

# 10. Rúbrica de evaluación del proyecto

Puntaje total: **100 puntos**. Puntaje mínimo de aprobación: **70 puntos**.

Además del puntaje, existen tres requisitos críticos:

1. el CSV original permanece intacto;
2. la simulación no modifica el sistema de archivos;
3. ninguna salida puede escapar de la carpeta base ni sobrescribir un archivo existente.

El incumplimiento de cualquiera de ellos requiere corrección antes de aprobar el módulo.

| Criterio | Excelente | Competente | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Funcionalidad | Procesa correctamente todos los casos y genera los cuatro resultados esperados | Cumple el flujo principal con fallos menores | El resultado es parcial o inconsistente | No completa el proceso | 25 |
| Validación de datos | Valida encabezados, tipos, reglas, duplicados y acumula todos los problemas por fila | Valida casi todas las reglas | Omite varias validaciones importantes | Acepta datos inválidos o falla sin explicación | 15 |
| Seguridad de archivos | Simula sin cambios, limita rutas, evita sobrescrituras y conserva el original | Aplica casi todas las medidas | Presenta uno o más riesgos corregibles | Sobrescribe, elimina o permite rutas inseguras | 20 |
| Uso de biblioteca estándar | Usa correctamente `pathlib`, `csv`, `json`, `os` y `shutil` | Usa las herramientas con errores menores | Mezcla soluciones manuales innecesarias | No aplica las herramientas centrales | 10 |
| Organización y calidad | Funciones enfocadas, nombres claros, constantes apropiadas y flujo comprensible | Código comprensible con algunas funciones extensas | Mucha repetición o responsabilidades mezcladas | Código difícil de seguir | 10 |
| Archivos de salida | JSON correcto, reporte completo, UTF-8 y tipos adecuados | Salidas útiles con pequeños detalles faltantes | Salidas incompletas o difíciles de usar | Archivos inválidos o ausentes | 10 |
| Pruebas y documentación | Evidencia las diez pruebas y explica decisiones en README | Evidencia la mayoría de pruebas | Evidencia limitada | No documenta ni prueba | 10 |

## Interpretación del resultado

- **90 a 100:** dominio excelente de los objetivos del módulo.
- **80 a 89:** desempeño sólido con ajustes menores.
- **70 a 79:** desempeño suficiente; pueden solicitarse mejoras puntuales.
- **Menos de 70:** requiere corrección y nueva entrega.
- **Fallo de un requisito crítico:** requiere corrección, independientemente del puntaje.

---

# 11. Evaluación del módulo

Responde sin ejecutar código primero. Después puedes comprobar tus respuestas.

## Pregunta 1

¿Cuál es la principal ventaja de utilizar `with open(...) as archivo`?

A. Convierte automáticamente el contenido a JSON.  
B. Gestiona el cierre del archivo incluso si ocurre un error dentro del bloque.  
C. Impide que el archivo sea leído más de una vez.  
D. Hace que cualquier archivo sea portable.

## Pregunta 2

¿Qué modo abre un archivo exclusivamente para crearlo y produce un error si ya existe?

A. `"w"`  
B. `"a"`  
C. `"x"`  
D. `"r+"`

## Pregunta 3

¿Qué expresión construye una ruta portable con `pathlib`?

A. `base + "\\resultados\\reporte.txt"`  
B. `base / "resultados" / "reporte.txt"`  
C. `base.join("resultados", "reporte.txt")`  
D. `Path("base/resultados/reporte.txt")` en todos los equipos

## Pregunta 4

¿Por qué conviene abrir un archivo CSV con `newline=""`?

A. Para convertir automáticamente todos los valores a números.  
B. Para permitir que el módulo `csv` gestione correctamente los saltos de línea.  
C. Para borrar líneas vacías antes de procesar.  
D. Para validar los encabezados.

## Pregunta 5

Al leer `"32000"` con `csv.DictReader`, ¿qué tipo se obtiene inicialmente?

A. `int`  
B. `float`  
C. `str`  
D. Depende del nombre de la columna

## Pregunta 6

¿Qué combinación conserva caracteres como `á` y genera un JSON legible?

A. `json.dump(datos, archivo)`  
B. `json.dump(datos, archivo, ensure_ascii=False, indent=2)`  
C. `str(datos)`  
D. `json.loads(datos, indent=2)`

## Pregunta 7

¿Cuál es la diferencia más relevante entre `shutil.copy()` y `shutil.copy2()` para este proyecto?

A. `copy2()` intenta conservar también metadatos del archivo.  
B. `copy2()` comprime el archivo.  
C. `copy()` no acepta objetos `Path`.  
D. `copy2()` solo funciona con CSV.

## Pregunta 8

¿Qué debe ocurrir en una simulación segura?

A. Se crean archivos vacíos para reservar los nombres.  
B. Se realiza el proceso y luego se deshacen los cambios.  
C. Se muestra el plan sin escribir, copiar, mover ni crear carpetas.  
D. Se trabaja en la carpeta del sistema operativo.

## Pregunta 9

¿Qué comprobación ayuda a impedir que una salida termine fuera del entorno autorizado?

A. `ruta.exists()`  
B. `ruta.suffix == ".csv"`  
C. `ruta.resolve().is_relative_to(base.resolve())`  
D. `ruta.name.startswith("resultado")`

## Pregunta 10

El archivo `catalogo_limpio.json` ya existe. ¿Cuál es la conducta correcta según el proyecto?

A. Sobrescribirlo porque fue creado por el mismo programa.  
B. Añadir el nuevo JSON al final.  
C. Detener la operación e informar el conflicto.  
D. Borrarlo automáticamente y continuar.

## Aprobación de la evaluación

- Puntaje: 1 punto por respuesta correcta.
- Puntaje mínimo recomendado: **8 de 10**.
- Si obtienes menos de 8, revisa las secciones relacionadas y vuelve a intentarlo.

---

# 12. Soluciones guiadas

Consulta esta sección después de intentar las prácticas y la evaluación.

## Solución de la práctica guiada 1

```python
from pathlib import Path


ruta = Path("casos_prueba/notas_utf8.txt")

with ruta.open("r", encoding="utf-8") as archivo:
    for numero, linea in enumerate(archivo, start=1):
        print(f"{numero:>2}: {linea.rstrip()}")
```

`rstrip()` se usa aquí para retirar el salto de línea que ya posee cada elemento. No es necesario cargar el archivo completo.

## Solución de la práctica guiada 2

```python
from pathlib import Path


base = Path(".").resolve()

for ruta in sorted(base.rglob("*")):
    ruta_resuelta = ruta.resolve()

    if not ruta_resuelta.is_relative_to(base):
        continue

    relativa = ruta_resuelta.relative_to(base)

    if ruta.is_file():
        print(f"ARCHIVO  {relativa}  {ruta.stat().st_size} bytes")
    elif ruta.is_dir():
        print(f"CARPETA  {relativa}")
```

La comprobación del límite debe realizarse con rutas resueltas. `st_size` se consulta únicamente cuando `is_file()` es verdadero.

## Solución de la práctica guiada 3

```python
import csv
from pathlib import Path


ruta = Path("entrada/catalogo.csv")
convertibles = []
rechazadas = []

with ruta.open("r", encoding="utf-8", newline="") as archivo:
    lector = csv.DictReader(archivo)

    for numero_linea, fila in enumerate(lector, start=2):
        original = dict(fila)
        problemas = []

        codigo = (fila.get("codigo") or "").strip().upper()
        nombre = " ".join((fila.get("nombre") or "").split())
        categoria = (fila.get("categoria") or "").strip().title()

        try:
            precio = int((fila.get("precio") or "").strip())
        except ValueError:
            precio = None
            problemas.append("El precio no es un entero.")

        try:
            existencia = int((fila.get("existencia") or "").strip())
        except ValueError:
            existencia = None
            problemas.append("La existencia no es un entero.")

        if problemas:
            rechazadas.append({
                "linea": numero_linea,
                "registro_original": original,
                "problemas": problemas,
            })
        else:
            convertibles.append({
                "codigo": codigo,
                "nombre": nombre,
                "categoria": categoria,
                "precio": precio,
                "existencia": existencia,
            })

print(f"Convertibles: {len(convertibles)}")
print(f"Rechazadas: {len(rechazadas)}")
```

Esta práctica solo revisa conversiones. El proyecto añade las demás reglas del catálogo.

## Solución de la práctica guiada 4

```python
import json
from pathlib import Path


datos = {
    "curso": "Python Práctico",
    "modulo": 4,
    "temas": ["CSV", "JSON", "rutas"],
}

texto_json = json.dumps(datos, ensure_ascii=False, indent=2)
reconstruido = json.loads(texto_json)
print(datos == reconstruido)

datos_con_ruta = {"salida": Path("resultados/reporte.txt")}

try:
    json.dumps(datos_con_ruta)
except TypeError as error:
    print(f"No serializable: {error}")

datos_convertidos = {"salida": str(datos_con_ruta["salida"])}
print(json.dumps(datos_convertidos, indent=2))

ruta_invalida = Path("casos_prueba/configuracion_invalida.json")

try:
    with ruta_invalida.open("r", encoding="utf-8") as archivo:
        json.load(archivo)
except json.JSONDecodeError as error:
    print(f"JSON inválido en línea {error.lineno}, columna {error.colno}")
```

La conversión del `Path` es explícita porque el programa conoce el significado de ese dato.

## Solución de la práctica guiada 5

```python
from pathlib import Path
from shutil import copy2


def copiar_seguro(origen: Path, destino: Path, base: Path, simular=True):
    base = base.resolve()
    origen = origen.resolve()
    destino = destino.resolve()

    if not origen.is_file():
        raise FileNotFoundError(f"No existe el archivo de origen: {origen}")

    if destino.exists():
        raise FileExistsError(f"El destino ya existe: {destino}")

    if not destino.is_relative_to(base):
        raise ValueError("El destino está fuera de la carpeta autorizada.")

    print(f"COPIAR {origen.relative_to(base)} -> {destino.relative_to(base)}")

    if simular:
        print("SIMULACIÓN: no se realizó la copia.")
        return

    destino.parent.mkdir(parents=True, exist_ok=True)
    copy2(origen, destino)
```

La carpeta padre solo se crea después de abandonar el modo de simulación.

## Respuestas de la evaluación

| Pregunta | Respuesta | Explicación breve |
|---:|:---:|---|
| 1 | B | El administrador de contexto gestiona el cierre del archivo. |
| 2 | C | `x` crea exclusivamente y falla si el destino existe. |
| 3 | B | El operador `/` de `Path` construye la ruta sin separadores manuales. |
| 4 | B | `newline=""` permite que `csv` controle correctamente los saltos de línea. |
| 5 | C | `DictReader` entrega cadenas; el programa convierte los tipos. |
| 6 | B | Conserva Unicode y agrega una indentación legible. |
| 7 | A | `copy2()` intenta conservar metadatos además del contenido. |
| 8 | C | Una simulación anuncia y valida sin producir cambios. |
| 9 | C | Comprueba la pertenencia después de resolver ambas rutas. |
| 10 | C | El proyecto prohíbe sobrescribir salidas existentes. |

---

# 13. Retos adicionales

Estos retos son opcionales. Realízalos después de completar el proyecto obligatorio.

## Reto 1 — Filtro por categoría

Permite definir una categoría opcional en `configuracion.json`. Si se indica, el JSON limpio debe contener solo productos aceptados de esa categoría. El reporte debe distinguir entre registros rechazados y registros aceptados pero excluidos por el filtro.

## Reto 2 — Reporte CSV adicional

Genera `resumen_categorias.csv` con las columnas:

```text
categoria,cantidad_productos,valor_total_inventario
```

El valor total por producto es `precio * existencia`. Utiliza `csv.DictWriter`; no construyas las líneas mediante concatenación manual.

## Reto 3 — Comparar respaldos

Busca los respaldos con `glob("catalogo_*.csv")`, ordénalos por fecha de modificación y muestra cuál es el más reciente. No elimines respaldos antiguos.

## Reto 4 — Confirmación mediante archivo de plan

En simulación, permite generar opcionalmente un único archivo `plan_operaciones.json`. Esta excepción debe activarse de forma explícita y el programa debe explicar que la simulación normalmente no escribe. El reto consiste en hacer visible y documentar esa decisión, no en ocultar una escritura.

---

# 14. Videos recomendados

Los videos complementan la práctica; no reemplazan la documentación ni el desarrollo del proyecto.

## Rutas con `pathlib`

[Manejo de rutas y archivos con pathlib — Recursos Python](https://www.youtube.com/watch?v=xZnYIIkIaiw)

Úsalo para reforzar la creación de objetos `Path`, la navegación entre carpetas y las operaciones habituales sobre rutas.

## Archivos CSV

[Leer y escribir archivos CSV con Python — ProCode TV](https://www.youtube.com/watch?v=wmNsecoZ_Go)

Presta especial atención a `reader`, `DictReader`, `writer` y a la diferencia entre el texto recibido y los tipos que necesita el programa.

## Archivos JSON

[Leer y escribir archivos JSON en Python — UskoKruM2010](https://www.youtube.com/watch?v=NHRTC7iN9mI)

Relaciona `load()` y `dump()` con archivos, y `loads()` y `dumps()` con cadenas.

> Si la interfaz, la versión de Python o algún detalle menor del video difiere, conserva como referencia principal la documentación oficial enlazada a continuación.

---

# 15. Documentación y recursos de lectura

## Documentación oficial de Python

- [Entrada y salida: lectura y escritura de archivos](https://docs.python.org/es/3/tutorial/inputoutput.html#reading-and-writing-files)
- [`pathlib`: rutas de sistemas de archivos orientadas a objetos](https://docs.python.org/es/3/library/pathlib.html)
- [`csv`: lectura y escritura de archivos CSV](https://docs.python.org/es/3/library/csv.html)
- [`json`: codificador y decodificador JSON](https://docs.python.org/es/3/library/json.html)
- [`os`: interfaces variadas del sistema operativo](https://docs.python.org/es/3/library/os.html)
- [`shutil`: operaciones de alto nivel con archivos](https://docs.python.org/es/3/library/shutil.html)

Si una página todavía no está traducida por completo, utiliza el selector de idioma o consulta la [versión en inglés de la documentación](https://docs.python.org/3/).

## Lecturas gratuitas complementarias

- [Python `pathlib`: rutas orientadas a objetos — Real Python](https://realpython.com/python-pathlib/)
- [Tutorial oficial de entrada y salida](https://docs.python.org/es/3/tutorial/inputoutput.html)

## Ruta de lectura recomendada

No intentes memorizar cada método. Trabaja así:

1. identifica la operación que necesitas;
2. busca el módulo correspondiente;
3. revisa la firma, los parámetros y las excepciones documentadas;
4. ejecuta el ejemplo mínimo en una carpeta de práctica;
5. adapta la solución y comprueba su efecto;
6. documenta cualquier operación que pueda reemplazar o mover información.

---

# 16. Material descargable

El módulo incluye un paquete de práctica con:

- catálogo principal con casos válidos, corregibles e inválidos;
- configuración JSON funcional;
- CSV con encabezados faltantes;
- JSON deliberadamente inválido;
- texto UTF-8 para comprobar caracteres;
- plantilla organizada del proyecto;
- guía de operaciones seguras;
- lista de comprobación para la entrega;
- carpetas separadas para resultados y respaldos.

Trabaja sobre una copia del paquete si deseas repetir el proyecto desde cero.

## Descarga

[Descargar el entorno de práctica del Módulo 4](/downloads/python-practico/modulo-4/entorno_practica_modulo_4.zip)

---

# 17. Errores comunes y cómo corregirlos

| Error | Consecuencia | Corrección |
|---|---|---|
| Concatenar rutas con `"/"` o `"\\"` | Código dependiente del sistema | Utiliza objetos `Path` y el operador `/` |
| Omitir `encoding` | Caracteres dañados o comportamiento distinto entre equipos | Declara `encoding="utf-8"` |
| Omitir `newline=""` en CSV | Saltos de línea problemáticos, especialmente al escribir | Permite que `csv` gestione las líneas |
| Suponer que CSV convierte tipos | Comparaciones y cálculos incorrectos | Convierte explícitamente y captura `ValueError` |
| Modificar el diccionario original antes de guardarlo | Se pierde evidencia del dato recibido | Copia la fila con `dict(fila)` |
| Validar solo el primer error | El usuario corrige el archivo en múltiples rondas | Acumula todos los problemas de cada fila |
| Usar `write_text()` sin pensar en sobrescritura | Se reemplaza un archivo existente | Comprueba el destino o usa modo `x` cuando corresponda |
| Regenerar la marca de tiempo varias veces | El plan muestra una ruta y la copia usa otra | Calcula la marca una sola vez por ejecución |
| Crear carpetas durante la simulación | El modo deja de ser una vista previa real | Separa validación de modificación |
| Usar `resolve()` sin comprobar límites | Una ruta válida puede apuntar fuera del entorno | Combina `resolve()` con `is_relative_to()` |
| Aplicar `default=str` a todo el JSON | Se ocultan errores de modelado | Convierte de forma explícita los tipos conocidos |
| Capturar `Exception` y continuar | Se esconden fallos y pueden quedar resultados incompletos | Captura errores específicos y detén la operación si la integridad está en riesgo |

---

# 18. Glosario

**Archivo de texto:** archivo cuyo contenido se interpreta como caracteres mediante una codificación.

**Codificación:** regla que relaciona caracteres con bytes. En el curso se utiliza UTF-8.

**Administrador de contexto:** objeto utilizado por `with` para adquirir y liberar un recurso correctamente.

**Ruta absoluta:** ruta completa desde la raíz del sistema de archivos.

**Ruta relativa:** ruta expresada con respecto a otra ubicación.

**Ruta resuelta:** representación normalizada de una ruta después de interpretar elementos como `..` y, según el sistema, enlaces simbólicos.

**CSV:** formato tabular de texto con valores separados por un delimitador.

**Encabezado:** primera fila que identifica las columnas de un CSV.

**JSON:** formato textual para representar objetos, colecciones y valores simples de manera interoperable.

**Serializar:** convertir un objeto a una representación que pueda almacenarse o transmitirse.

**Deserializar:** reconstruir datos a partir de su representación almacenada.

**Metadatos:** información asociada a un archivo, como ciertas fechas y permisos.

**Respaldo:** copia destinada a preservar el estado original de un archivo.

**Sobrescritura:** reemplazo del contenido de un archivo existente.

**Modo de simulación:** ejecución que muestra el plan sin aplicar cambios.

**Variable de entorno:** valor configurado fuera del programa y disponible para el proceso mediante el sistema operativo.

---

# 19. Resumen final

En este módulo aprendiste que trabajar con archivos no consiste únicamente en abrirlos. Un programa profesional debe conocer su ubicación, validar su formato, convertir los datos, preservar los originales y comunicar con claridad qué cambios realizará.

Ahora puedes:

- gestionar archivos con administradores de contexto;
- construir rutas portables mediante `pathlib`;
- leer y escribir texto con una codificación explícita;
- procesar CSV con encabezados y conversiones controladas;
- serializar y reconstruir datos mediante JSON;
- utilizar configuración externa con JSON y `os.getenv()`;
- copiar archivos con `shutil.copy2()`;
- impedir rutas fuera del entorno autorizado;
- evitar sobrescrituras accidentales;
- diseñar un modo de simulación auténtico;
- producir resultados y reportes útiles sin modificar la fuente.

## Lista de comprobación antes de continuar

- [ ] Completé las cinco prácticas guiadas.
- [ ] Entregué las tres actividades obligatorias.
- [ ] Puedo explicar `read()`, `readlines()` e iteración directa.
- [ ] Construyo rutas con `Path` sin separadores manuales.
- [ ] Recuerdo que un CSV entrega texto hasta que convierto sus valores.
- [ ] Puedo distinguir `load`, `loads`, `dump` y `dumps`.
- [ ] Probé el proyecto primero en modo de simulación.
- [ ] Confirmé que la simulación no genera cambios.
- [ ] Confirmé que el CSV original permanece intacto.
- [ ] Obtuve 6 registros aceptados y 6 rechazados con el archivo principal.
- [ ] Generé los tres resultados y el respaldo.
- [ ] Documenté las diez pruebas obligatorias.
- [ ] Obtuve al menos 8 de 10 en la evaluación.
- [ ] El proyecto fue aprobado.

Cuando todos los puntos estén completos, estarás preparado para continuar con el siguiente módulo de **Python Práctico**.
