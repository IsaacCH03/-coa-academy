# COA — Cursos Online Avanzados

## Python Práctico

# Módulo 6. Programas robustos, modulares y documentados

**Duración aproximada:** 2 horas  
**Modalidad:** práctica guiada, actividades obligatorias, proyecto y evaluación  
**Nivel:** intermedio  
**Tecnologías:** Python y biblioteca estándar  
**Resultado principal:** una caja de herramientas modular para terminal

---

## Bienvenida

Un programa puede producir el resultado correcto y aun así ser difícil de mantener:

```text
un solo archivo de 500 líneas
        +
capturas que esconden cualquier error
        +
opciones escritas directamente en el código
        +
decenas de print() de diagnóstico
        ↓
programa frágil y difícil de reutilizar
```

En este módulo transformarás soluciones aisladas en programas pequeños que otra persona pueda ejecutar, comprender, corregir y reutilizar.

Aprenderás a:

- distinguir errores que deben corregirse de situaciones que pueden manejarse;
- capturar únicamente las excepciones que realmente comprendes;
- comunicar reglas incumplidas mediante `raise`;
- distribuir responsabilidades entre módulos;
- impedir que el programa se ejecute accidentalmente al importarlo;
- crear una interfaz de terminal con ayuda automática;
- separar los mensajes para el usuario del registro técnico;
- utilizar la documentación como herramienta diaria.

> **Principio del módulo:** robustez no significa ocultar los errores; significa anticipar los casos esperables, comunicarlos y conservar visibles los fallos inesperados.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Diferenciar errores de programación, datos inválidos y situaciones recuperables.
- Limitar un bloque `try` a la operación que puede fallar.
- Capturar excepciones específicas y utilizar múltiples manejadores.
- Aplicar `else` y `finally` con una intención clara.
- Lanzar excepciones integradas mediante `raise`.
- Crear una excepción personalizada sencilla cuando el dominio la justifique.
- Encadenar un error de bajo nivel con un error significativo para la aplicación.
- Crear módulos propios y reutilizar funciones sin copiar y pegar.
- Comprender espacios de nombres, alias y colisiones.
- Evitar importaciones con `*` y efectos secundarios al importar.
- Aplicar el patrón `if __name__ == "__main__":`.
- Separar entrada, lógica, presentación y configuración.
- Crear argumentos posicionales y opcionales con `argparse`.
- Configurar tipos, valores predeterminados, opciones y mensajes de ayuda.
- Diferenciar la salida dirigida al usuario de un registro técnico.
- Elegir entre `DEBUG`, `INFO`, `WARNING`, `ERROR` y `CRITICAL`.
- Registrar contexto útil sin exponer información sensible.
- Explorar objetos mediante `help()`, `dir()` y `.__doc__`.
- Leer firma, retorno, excepciones y disponibilidad por versión.
- Aplicar principios esenciales de PEP 8 y PEP 257.

---

## Conocimientos que utilizarás

Necesitas poder:

- crear funciones y utilizar parámetros;
- importar módulos de la biblioteca estándar;
- trabajar con cadenas, colecciones, fechas y números;
- leer y escribir archivos con `Path`;
- comprender clases básicas para declarar una excepción personalizada;
- ejecutar un archivo `.py` desde la terminal.

No se profundizará en paquetes distribuibles, pruebas automatizadas avanzadas, arquitectura empresarial ni publicación en PyPI. Esos temas pertenecen a una etapa posterior de Desarrollo de Software con Python.

---

## Producto que construirás

Desarrollarás **COA Toolkit**, una caja de herramientas de terminal con tres operaciones:

```text
texto    → normaliza y resume texto
fecha    → calcula y clasifica un vencimiento
números  → produce estadísticas descriptivas
```

La aplicación tendrá:

- argumentos y ayuda mediante `argparse`;
- módulos con responsabilidades distintas;
- excepciones específicas y mensajes comprensibles;
- registro de eventos mediante `logging`;
- salida opcional a un archivo sin sobrescribirlo;
- docstrings e instrucciones de ejecución;
- un punto de entrada que no se activa al importar.

Esta estructura preparará el terreno para el Proyecto Final Integrador, sin resolverlo de antemano.

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Diseño de errores y excepciones | 15 min |
| 2. Módulos, importaciones y espacios de nombres | 8 min |
| 3. Punto de entrada, estructura y documentación | 7 min |
| 4. Interfaz de terminal con `argparse` | 8 min |
| 5. Registro técnico con `logging` | 7 min |
| 6. Prácticas guiadas | 25 min |
| 7. Actividades obligatorias | integradas con las prácticas |
| 8. Proyecto del módulo | 40 min |
| 9. Evaluación y cierre | 10 min |
| **Total** | **2 horas** |

Los retos opcionales requieren tiempo adicional.

---

# 1. Diseño de errores y excepciones

## 1.1. No todos los problemas significan lo mismo

| Situación | Ejemplo | Respuesta adecuada |
|---|---|---|
| Error de programación | Una variable no definida | Corregir el código |
| Dato inválido | Fecha `2026-02-30` | Rechazar el dato con un mensaje claro |
| Situación recuperable | Archivo opcional ausente | Aplicar una alternativa documentada |
| Fallo externo | Permiso denegado al escribir | Informar y detener la operación afectada |
| Regla de negocio incumplida | Muestra mayor que población | Lanzar o devolver un error del dominio |

Capturar una excepción no arregla automáticamente su causa. Antes de escribir `except`, responde:

1. ¿Qué operación puede fallar?
2. ¿Qué excepciones concretas produce?
3. ¿Puede el programa continuar correctamente?
4. ¿Qué necesita saber el usuario?
5. ¿Qué contexto técnico debe registrarse?

## 1.2. La anatomía de `try`, `except`, `else` y `finally`

```python
try:
    numero = int(texto)
except ValueError:
    print("El valor debe ser un número entero.")
else:
    print(f"Conversión correcta: {numero}")
finally:
    print("Intento finalizado.")
```

```text
try      → contiene la operación que puede fallar
except   → responde a un tipo de fallo conocido
else     → se ejecuta si el try terminó sin excepción
finally  → se ejecuta siempre al abandonar la estructura
```

No es obligatorio utilizar las cuatro partes. Agrega cada una únicamente cuando cumple una función real.

## 1.3. Mantener pequeño el bloque `try`

Versión problemática:

```python
try:
    numero = int(texto)
    resultado = procesar(numero)
    guardar(resultado)
    mostrar(resultado)
except ValueError:
    print("Dato inválido.")
```

El `ValueError` podría provenir de la conversión, de `procesar()` o incluso de `guardar()`. El mensaje asume una causa sin saber cuál fue.

Versión más precisa:

```python
try:
    numero = int(texto)
except ValueError:
    print("El valor recibido no es un entero.")
else:
    resultado = procesar(numero)
    guardar(resultado)
    mostrar(resultado)
```

El bloque protegido contiene únicamente la conversión que sabes manejar.

## 1.4. Capturar excepciones específicas

```python
from pathlib import Path


def leer_configuracion(ruta):
    try:
        return Path(ruta).read_text(encoding="utf-8")
    except FileNotFoundError:
        print("No se encontró la configuración.")
    except PermissionError:
        print("No hay permiso para leer la configuración.")
    except UnicodeDecodeError:
        print("La configuración no utiliza UTF-8 válido.")
```

Cada excepción comunica una causa diferente y puede requerir una respuesta diferente.

Evita:

```python
try:
    contenido = realizar_proceso()
except:
    pass
```

Una captura desnuda también intercepta señales como `KeyboardInterrupt` y oculta por completo el fallo.

Capturar `Exception` puede ser apropiado en el límite superior de una aplicación para registrar un fallo inesperado y terminar de forma controlada. No debe utilizarse para fingir que todo salió bien.

## 1.5. Orden de los manejadores

Coloca primero los tipos específicos:

```python
try:
    ejecutar_operacion()
except FileNotFoundError as error:
    print(f"Archivo ausente: {error.filename}")
except OSError as error:
    print(f"Error del sistema de archivos: {error}")
```

`FileNotFoundError` es una subclase de `OSError`. Si `OSError` aparece primero, también capturará el archivo ausente y el manejador específico nunca se ejecutará.

## 1.6. `else` separa el éxito del manejo del error

```python
try:
    cantidad = int(texto)
except ValueError:
    print("Cantidad inválida.")
else:
    total = calcular_total(cantidad)
    print(total)
```

El código del `else` no queda cubierto por el `except`. Si `calcular_total()` contiene un error inesperado, será visible en lugar de etiquetarse erróneamente como una conversión inválida.

## 1.7. `finally` garantiza una acción, no un resultado exitoso

```python
def ejecutar_sesion(recurso):
    recurso.abrir()

    try:
        recurso.procesar()
    finally:
        recurso.cerrar()
```

`finally` se ejecuta aunque exista una excepción o un `return`. Es útil para liberar recursos cuando no existe un administrador de contexto apropiado.

Para archivos, prefiere `with`:

```python
with ruta.open("r", encoding="utf-8") as archivo:
    contenido = archivo.read()
```

Evita devolver un valor desde `finally`: puede ocultar una excepción o reemplazar otro retorno, haciendo el flujo difícil de comprender.

## 1.8. Lanzar un error con `raise`

Una función no siempre debe imprimir un mensaje o devolver `None`. Puede comunicar que su contrato fue incumplido:

```python
def calcular_promedio(valores):
    if not valores:
        raise ValueError("Se necesita al menos un valor.")

    return sum(valores) / len(valores)
```

Quien llama decide cómo responder:

```python
try:
    promedio = calcular_promedio([])
except ValueError as error:
    print(f"No se pudo calcular: {error}")
```

Utiliza tipos integrados cuando expresan bien la causa:

- `ValueError`: el tipo es aceptable, pero el valor no;
- `TypeError`: el tipo recibido no es compatible;
- `FileNotFoundError`: falta un archivo requerido;
- `FileExistsError`: una salida protegida ya existe.

## 1.9. Excepciones personalizadas

Una excepción propia merece existir cuando permite expresar y capturar un problema del dominio que no queda claro mediante un tipo integrado.

```python
class MuestraInsuficienteError(Exception):
    """Indica que la población no permite crear la muestra solicitada."""


def validar_muestra(poblacion, cantidad):
    if cantidad > len(poblacion):
        raise MuestraInsuficienteError(
            f"Se solicitaron {cantidad} elementos, pero solo existen {len(poblacion)}."
        )
```

No crees una excepción distinta para cada mensaje. Hazlo cuando el llamador necesite distinguir esa categoría de problema.

Los nombres de excepciones suelen terminar en `Error`.

## 1.10. Encadenar la causa

Puedes traducir un error técnico a uno significativo sin perder la causa original:

```python
from datetime import date


class FechaInvalidaError(ValueError):
    """Indica que una fecha no cumple el contrato de la aplicación."""


def convertir_fecha(texto):
    try:
        return date.fromisoformat(texto)
    except ValueError as error:
        raise FechaInvalidaError(
            f"La fecha debe usar AAAA-MM-DD: {texto!r}."
        ) from error
```

`raise ... from error` preserva la relación entre la causa original y la explicación del dominio.

## 1.11. Registrar o manejar: evita duplicar el mismo error

Si cada capa captura, registra y vuelve a lanzar el mismo error, el archivo de registro se llena de copias.

Una estrategia simple:

- la función de lógica lanza una excepción clara;
- el punto de entrada la captura;
- el punto de entrada muestra un mensaje breve al usuario;
- el punto de entrada registra el contexto técnico una sola vez.

---

# 2. Módulos, importaciones y espacios de nombres

## 2.1. Un archivo `.py` puede ser un módulo

Archivo `calculos.py`:

```python
def promedio(valores):
    if not valores:
        raise ValueError("No hay valores.")

    return sum(valores) / len(valores)
```

Archivo `main.py`:

```python
import calculos


resultado = calculos.promedio([4, 6, 8])
print(resultado)
```

El prefijo `calculos.` comunica el origen de la función y evita colisiones.

## 2.2. Formas de importar

```python
import statistics

resultado = statistics.mean([2, 4, 6])
```

```python
from statistics import mean

resultado = mean([2, 4, 6])
```

```python
import statistics as stats

resultado = stats.mean([2, 4, 6])
```

Elige según claridad:

- `import modulo` hace visible el origen;
- `from modulo import nombre` es claro para unos pocos nombres inequívocos;
- `as` debe crear un alias conocido o realmente legible, no una abreviatura misteriosa.

## 2.3. Evitar `import *`

```python
from modulo_a import *
from modulo_b import *
```

Ahora no es evidente qué módulo definió cada nombre ni cuál reemplazó a otro. Utiliza importaciones explícitas.

## 2.4. Espacios de nombres

Un espacio de nombres relaciona nombres con objetos. Dos módulos pueden definir `validar()` sin colisionar si se importan como módulos:

```python
import fechas
import numeros


fechas.validar("2026-08-15")
numeros.validar("25.4")
```

Nombra módulos según su responsabilidad. Evita nombres que coincidan con la biblioteca estándar, como `random.py`, `logging.py`, `json.py` o `statistics.py`, porque pueden impedir que importes los módulos reales.

## 2.5. Importar ejecuta el nivel superior del módulo

Archivo problemático:

```python
print("Iniciando programa...")
respuesta = input("Escribe un valor: ")


def procesar(valor):
    return valor.strip()
```

Al ejecutar `import modulo`, Python ejecutará el `print()` y solicitará la entrada. Un módulo reutilizable no debería iniciar la interfaz, escribir archivos ni configurar globalmente el registro al importarse.

Conserva en el nivel superior únicamente declaraciones necesarias:

- constantes;
- funciones;
- clases;
- importaciones;
- configuraciones que no produzcan efectos externos innecesarios.

## 2.6. Dependencias en una sola dirección

Una estructura simple puede fluir así:

```text
main.py
  ├─ importa cli.py
  ├─ importa operaciones.py
  ├─ importa reportes.py
  └─ importa configuracion.py

operaciones.py
  └─ importa errores.py
```

Evita que `operaciones.py` importe `main.py` mientras `main.py` importa `operaciones.py`. Las importaciones circulares suelen revelar responsabilidades mezcladas.

---

# 3. Punto de entrada, estructura y documentación

## 3.1. El significado práctico de `__name__`

Cuando ejecutas un archivo directamente:

```text
python main.py
```

su variable `__name__` vale `"__main__"`.

Cuando lo importas:

```python
import main
```

`main.__name__` vale `"main"`.

Por eso se utiliza:

```python
def main():
    print("Aplicación iniciada.")


if __name__ == "__main__":
    main()
```

Importar el archivo define `main()`, pero no la ejecuta.

## 3.2. Código de salida

Una aplicación de terminal puede comunicar éxito o error al sistema operativo:

```python
def main():
    try:
        ejecutar()
    except ValueError as error:
        print(f"Error: {error}")
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Convención habitual:

- `0`: finalización correcta;
- distinto de `0`: ocurrió un problema.

No necesitas diseñar una tabla compleja de códigos. Sí debes distinguir éxito de fallo.

## 3.3. Separar responsabilidades

```text
cli.py            → define y analiza argumentos
operaciones.py    → transforma y calcula
reportes.py       → presenta y guarda resultados
configuracion.py  → configura logging
errores.py        → declara errores del dominio
main.py           → coordina el flujo
```

Una función de lógica no debería llamar a `input()` ni decidir el color de un mensaje. Debe recibir datos y devolver un resultado o lanzar una excepción clara.

## 3.4. Docstrings útiles

```python
def clasificar_vencimiento(fecha_limite, referencia):
    """Clasifica una fecha como vencida, próxima o vigente.

    Args:
        fecha_limite: Fecha que se desea evaluar.
        referencia: Fecha desde la cual se calcula la diferencia.

    Returns:
        Un diccionario con la diferencia en días y la clasificación.

    Raises:
        TypeError: Si los argumentos no son objetos date.
    """
```

Una docstring describe el contrato. No necesita narrar línea por línea lo que el código ya muestra.

## 3.5. Principios esenciales de estilo

- Utiliza cuatro espacios por nivel de indentación.
- Escribe nombres de funciones y variables en `snake_case`.
- Utiliza `MAYUSCULAS` para constantes.
- Separa las importaciones de la biblioteca estándar de las importaciones propias.
- Mantén líneas y expresiones legibles.
- Deja dos líneas en blanco entre funciones de nivel superior.
- Elige nombres orientados a la intención.
- Evita comentarios que repitan literalmente el código.
- Escribe docstrings para módulos, funciones públicas, clases y excepciones relevantes.

PEP 8 y PEP 257 son guías para mejorar la comunicación, no una razón para sacrificar la claridad del problema.

---

# 4. Interfaz de terminal con `argparse`

## 4.1. Por qué no leer todo con `input()`

Una interfaz con `input()` exige interacción manual. Los argumentos de terminal permiten:

- repetir una ejecución;
- documentar ejemplos exactos;
- combinar la herramienta con otros procesos;
- validar opciones de forma consistente;
- generar ayuda automáticamente.

```text
python main.py fecha 2026-08-22 --referencia 2026-08-15
```

## 4.2. Analizador mínimo

```python
import argparse


def crear_parser():
    parser = argparse.ArgumentParser(
        description="Procesa una operación de COA Toolkit."
    )
    parser.add_argument("operacion", choices=["texto", "fecha", "numeros"])
    parser.add_argument("valores", nargs="+")
    return parser
```

```python
parser = crear_parser()
argumentos = parser.parse_args()

print(argumentos.operacion)
print(argumentos.valores)
```

`nargs="+"` exige uno o más valores.

## 4.3. Argumentos opcionales

```python
from pathlib import Path


parser.add_argument(
    "--referencia",
    default=None,
    help="Fecha de referencia en formato AAAA-MM-DD.",
)
parser.add_argument(
    "--salida",
    type=Path,
    help="Archivo opcional donde se guardará el reporte.",
)
parser.add_argument(
    "--nivel-log",
    choices=["DEBUG", "INFO", "WARNING", "ERROR"],
    default="INFO",
)
```

- `type` convierte un argumento cuando el analizador puede hacerlo claramente.
- `choices` limita valores permitidos.
- `default` define el valor si la opción se omite.
- `required=True` puede exigir una opción, aunque un argumento posicional suele ser más apropiado cuando el dato siempre es necesario.

## 4.4. Ayuda automática

```text
python main.py --help
```

`argparse` construye el uso, la descripción y las opciones. Escribe textos de ayuda que expliquen significado y formato, no solo el nombre del argumento.

Versión débil:

```python
help="Referencia"
```

Versión útil:

```python
help="Fecha desde la cual se calcula el vencimiento, en formato AAAA-MM-DD."
```

## 4.5. Qué debe validar `argparse` y qué debe validar la lógica

`argparse` puede validar:

- presencia de argumentos;
- opciones permitidas;
- conversiones simples como `int`, `float` o `Path`;
- cantidad básica de valores.

La lógica debe validar:

- una fecha posible;
- una regla del dominio;
- coherencia entre varios argumentos;
- permisos y conflictos del sistema de archivos;
- restricciones diferentes según la operación.

No concentres toda la lógica del programa dentro de `crear_parser()`.

## 4.6. `argparse` y `SystemExit`

Cuando la sintaxis es inválida, `argparse` muestra el uso y finaliza normalmente con un código distinto de cero. Ese comportamiento es apropiado para una aplicación de terminal.

No envuelvas `parse_args()` en un `except Exception` para impedirlo. Durante pruebas automatizadas puede capturarse `SystemExit`, pero la aplicación normal debe conservar la ayuda y el código de salida.

---

# 5. Registro técnico con `logging`

## 5.1. `print()` y `logging` tienen públicos diferentes

```text
print()    → resultado o mensaje que necesita la persona usuaria
logging    → evidencia técnica para observar y diagnosticar el programa
```

Ejemplo:

```python
print("Reporte creado correctamente.")
logger.info("Reporte creado en %s", ruta)
```

El usuario recibe una confirmación breve. El registro conserva contexto técnico.

## 5.2. Niveles

| Nivel | Uso |
|---|---|
| `DEBUG` | Detalles para investigar el flujo y los valores no sensibles |
| `INFO` | Inicio, finalización y resultados importantes |
| `WARNING` | Situación inesperada de la que el programa pudo recuperarse |
| `ERROR` | Operación fallida que impide completar una parte del proceso |
| `CRITICAL` | Fallo grave que compromete toda la aplicación o sus recursos |

No conviertas cada línea en `INFO`. Un registro útil permite localizar lo importante.

## 5.3. Configuración básica

```python
import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger(__name__)
logger.info("Aplicación iniciada")
```

En módulos propios utiliza:

```python
logger = logging.getLogger(__name__)
```

La aplicación configura los manejadores una vez, normalmente cerca del punto de entrada. Los módulos solo solicitan su registrador y emiten eventos.

## 5.4. Registro en archivo

```python
logging.basicConfig(
    filename="coa_toolkit.log",
    filemode="a",
    encoding="utf-8",
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
```

`filemode="a"` conserva los eventos anteriores. En una aplicación real deben definirse políticas de tamaño, rotación y conservación; no se profundizará en ellas en este curso.

## 5.5. Parámetros en lugar de f-strings para el registro

```python
logger.debug("Se procesaron %d valores", cantidad)
```

El sistema de registro aplica el formato cuando el evento será emitido. Esta forma también separa el mensaje de sus datos.

## 5.6. Registrar excepciones

Dentro de un `except`, `logger.exception()` incluye el traceback:

```python
try:
    ejecutar_proceso()
except ErrorEsperado as error:
    logger.warning("Entrada rechazada: %s", error)
except Exception:
    logger.exception("Fallo inesperado durante el proceso")
    raise
```

Para un error esperado del usuario puede bastar `warning()` o `error()` sin traceback. Reserva `logger.exception()` para información que realmente ayude a diagnosticar.

## 5.7. No registrar información sensible

Evita registrar:

- contraseñas;
- tokens;
- claves de API;
- números completos de documentos o tarjetas;
- datos personales innecesarios;
- contenido completo de archivos privados.

Registra contexto mínimo:

```python
logger.info(
    "Operación completada: tipo=%s cantidad=%d",
    operacion,
    cantidad,
)
```

## 5.8. Errores comunes de registro

- configurar `basicConfig()` dentro de cada módulo;
- registrar y volver a registrar el mismo error en cada capa;
- utilizar `ERROR` para eventos normales;
- llenar el registro con datos sin utilidad diagnóstica;
- registrar secretos;
- depender del registro como única comunicación al usuario.

---

# 6. Uso profesional de la documentación

## 6.1. Explorar desde Python

```python
import argparse


print(dir(argparse))
help(argparse.ArgumentParser.add_argument)
print(argparse.ArgumentParser.add_argument.__doc__)
```

- `dir(objeto)` muestra nombres disponibles; no explica cómo utilizarlos.
- `help(objeto)` presenta la documentación accesible para el objeto.
- `.__doc__` devuelve su docstring o `None`.

No llames la función cuando deseas consultar su ayuda:

```python
help(len)    # correcto
# help(len())  # intentaría ejecutar len sin argumento
```

## 6.2. Leer una página de referencia

Busca siempre:

1. nombre y propósito;
2. firma;
3. parámetros y valores predeterminados;
4. tipo de retorno;
5. efectos secundarios;
6. excepciones;
7. ejemplos;
8. notas de versión;
9. advertencias de seguridad o portabilidad.

## 6.3. Convertir un ejemplo en una prueba pequeña

Antes de integrar una función nueva:

```python
from pathlib import Path


ruta = Path("demostracion.txt")
print(ruta.suffix)
print(ruta.with_suffix(".log"))
```

Utiliza datos controlados y observa tipos, retornos y modificaciones. Después adapta el ejemplo al programa real.

## 6.4. Confirmar la versión

```python
import sys


print(sys.version)
print(sys.version_info)
```

Si la documentación dice “Nuevo en la versión 3.x”, comprueba que el entorno del curso o del proyecto incluya esa versión. No asumas que todos los equipos ejecutan la misma.

## 6.5. Documentar lo que tú construyes

La documentación mínima del proyecto incluye:

- docstring del módulo;
- docstrings de funciones públicas;
- `--help` útil;
- `README.md` con ejemplos copiables;
- descripción de errores esperados;
- formato de entrada y salida;
- versión mínima de Python;
- decisiones que otra persona no podría deducir solo mirando una línea.

---

# 7. Prácticas guiadas

## Práctica guiada 1 — Reducir una captura demasiado amplia

Parte de este código:

```python
def calcular_costo(cantidad_texto, precio_texto):
    try:
        cantidad = int(cantidad_texto)
        precio = float(precio_texto)
        subtotal = cantidad * precio
        print(f"Subtotal: {subtotal}")
        guardar_resultado(subtotal)
    except Exception:
        print("Algo salió mal.")
```

Reescríbelo de modo que:

1. `int()` y `float()` tengan mensajes distintos;
2. la conversión quede separada de `guardar_resultado()`;
3. cantidades menores que cero produzcan `ValueError` mediante `raise`;
4. un error inesperado de `guardar_resultado()` no se etiquete como dato inválido;
5. la función no oculte el traceback de un fallo que no sabe resolver.

Prueba con:

- cantidad `"3"` y precio `"12.50"`;
- cantidad `"tres"`;
- precio `"doce"`;
- cantidad `"-1"`;
- una función de guardado que produzca `PermissionError`.

## Práctica guiada 2 — `else`, `finally` y causa original

Crea una función `cargar_numero(ruta)` que:

- abra un archivo de texto con UTF-8;
- convierta su contenido a `float`;
- traduzca `ValueError` a una excepción `NumeroInvalidoError` mediante `raise ... from error`;
- utilice `else` para devolver el número cuando la conversión tenga éxito;
- no capture `FileNotFoundError` dentro de la función;
- demuestre con una acción sencilla que `finally` se ejecuta siempre.

Después explica por qué `with` ya gestiona el cierre del archivo y no necesita un `finally` manual para ese recurso.

## Práctica guiada 3 — Separar un programa importable

Recibes un archivo que contiene:

```python
print("Calculadora iniciada")


def sumar(a, b):
    return a + b


primero = float(input("Primer número: "))
segundo = float(input("Segundo número: "))
print(sumar(primero, segundo))
```

Divídelo en:

```text
calculadora.py  → función sumar()
main.py         → entrada y presentación
```

Requisitos:

- `calculadora.py` no debe imprimir ni solicitar datos al importarse;
- `main.py` debe contener una función `main()`;
- el punto de entrada debe estar protegido;
- `python main.py` debe ejecutar el programa;
- `python -c "import calculadora"` no debe producir salida.

## Práctica guiada 4 — Crear una interfaz de terminal

Construye un programa llamado `convertir.py` que reciba:

```text
python convertir.py 1500 --unidad metros
python convertir.py 1.5 --unidad kilometros --decimales 3
```

Debe incluir:

- un argumento posicional numérico;
- `--unidad` con opciones `metros` y `kilometros`;
- `--decimales` de tipo entero, con valor predeterminado 2;
- descripción y textos de ayuda;
- rechazo de decimales negativos mediante una validación de lógica;
- salida 0 en éxito y 2 en un dato de dominio inválido.

Comprueba también `python convertir.py --help`.

## Práctica guiada 5 — Sustituir diagnóstico por registros

Parte de este código:

```python
print("Entrando a procesar")
print("Cantidad de valores:", len(valores))
print("Se omitió un valor vacío")
print("No se pudo guardar")
```

Decide qué mensajes corresponden a:

- `DEBUG`;
- `INFO`;
- `WARNING`;
- `ERROR`;
- salida para el usuario.

Configura un registro con fecha, nivel, nombre del módulo y mensaje. Registra la cantidad de valores, pero no el contenido completo. Después utiliza:

```python
help(logging.basicConfig)
```

Localiza en la documentación los parámetros `level`, `format`, `filename`, `filemode` y `encoding`. Redacta una línea sobre la función de cada uno.

---

# 8. Actividades obligatorias

## Actividad 1 — Auditoría de manejadores

Analiza los siguientes fragmentos:

```python
try:
    ejecutar()
except:
    pass
```

```python
try:
    convertir()
    calcular()
    guardar()
except ValueError:
    print("La entrada no es válida.")
```

```python
try:
    leer_archivo()
except OSError:
    print("Error de archivo")
except FileNotFoundError:
    print("No existe")
```

Para cada uno identifica:

- qué problema presenta;
- qué errores puede ocultar;
- cómo reducir el bloque protegido;
- cuáles excepciones específicas deberían considerarse;
- si la operación puede continuar correctamente.

Entrega una versión corregida de cada fragmento.

## Actividad 2 — Diseñar una excepción de dominio

Una herramienta recibe una cantidad máxima de registros permitidos. Si se solicitan más, la operación debe detenerse.

Crea `LimiteRegistrosError` y una función que:

- valide que límite y cantidad sean enteros positivos;
- use excepciones integradas para tipos o valores generales incorrectos;
- utilice `LimiteRegistrosError` exclusivamente cuando la cantidad supera el límite;
- incluya cantidad solicitada y límite en el mensaje.

Explica por qué el llamador podría necesitar distinguir esta regla de un `ValueError` normal.

## Actividad 3 — Modularizar sin copiar

Toma una solución anterior del curso que tenga al menos cuatro funciones y divídela en tres módulos:

```text
main.py
logica.py
presentacion.py
```

Debes:

- mover las funciones, no duplicarlas;
- utilizar importaciones explícitas;
- impedir ejecución al importar;
- evitar dependencias circulares;
- dibujar el sentido de las importaciones;
- demostrar una función importada desde una sesión distinta.

## Actividad 4 — Punto de entrada seguro

Crea un archivo `demostracion.py` con dos funciones y una `main()`. Demuestra mediante capturas o salidas que:

```text
python demostracion.py
```

ejecuta `main()`, mientras que:

```text
python -c "import demostracion; print('importación terminada')"
```

solo importa las definiciones y muestra el mensaje solicitado por el comando.

## Actividad 5 — Ayuda de terminal profesional

Agrega `argparse` a una herramienta anterior. Debe contener:

- descripción;
- un argumento posicional;
- dos opciones;
- al menos un `type`;
- al menos un `choices`;
- un valor predeterminado;
- ejemplos de uso en el README.

Entrega la salida completa de `--help` y tres ejecuciones: correcta, opción inválida y dato de dominio inválido.

## Actividad 6 — Plan de registros

Clasifica estos eventos por nivel y justifica la respuesta:

1. inicio normal de la aplicación;
2. cantidad de elementos antes de filtrar;
3. fila opcional omitida;
4. archivo obligatorio ausente;
5. fallo inesperado que detiene todo;
6. contraseña recibida;
7. ruta del reporte creado;
8. operación solicitada por el usuario.

La contraseña no debe registrarse en ningún nivel. Después sustituye al menos cuatro `print()` de diagnóstico de un programa propio por eventos de `logging`.

## Actividad 7 — Leer antes de utilizar

Elige una función de la biblioteca estándar que no se haya explicado en detalle en el curso. No elijas una librería externa.

Entrega:

- enlace a la documentación oficial;
- versión de Python consultada;
- firma;
- propósito;
- parámetros principales;
- retorno;
- excepciones documentadas;
- ejemplo mínimo ejecutado;
- una situación donde no la utilizarías.

El objetivo no es copiar toda la página, sino demostrar que puedes convertir documentación en una decisión de programación.

---


<!-- coa-activity:python-practico-m6-actividades-obligatorias -->

# 9. Proyecto del módulo — COA Toolkit

## 9.1. Situación profesional

Durante el curso has creado funciones para limpiar texto, calcular fechas y resumir números. Ahora debes convertir varias de ellas en una aplicación reutilizable.

Una utilidad profesional no debería requerir que otra persona abra el código y cambie variables para utilizarla. Debe ofrecer:

- comandos claros;
- ayuda integrada;
- validación;
- mensajes comprensibles;
- módulos importables;
- registro técnico;
- instrucciones suficientes para repetir los resultados.

## 9.2. Producto que debes construir

Construye una aplicación llamada **COA Toolkit** con estas tres operaciones:

### Operación `texto`

Recibe texto, normaliza espacios y produce:

- texto original representado con `repr()`;
- texto normalizado;
- cantidad de caracteres normalizados;
- cantidad de palabras;
- cantidad de palabras únicas sin distinguir mayúsculas mediante `casefold()`.

### Operación `fecha`

Recibe una fecha límite ISO y una fecha de referencia opcional. Produce:

- fecha límite;
- referencia utilizada;
- diferencia con signo;
- estado `vencida`, `vence_hoy`, `próxima` o `vigente`;
- mensaje humano de atraso o tiempo restante.

Si se omite `--referencia`, puede utilizar `date.today()`. Todas las pruebas de control deben indicar la referencia explícitamente.

### Operación `numeros`

Recibe uno o más números finitos. Produce:

- cantidad;
- suma;
- media;
- mediana;
- mínimo;
- máximo;
- rango;
- desviación estándar poblacional.

Con una sola observación, `pstdev()` devuelve 0. Si no se recibe ningún valor, `argparse` debe impedir la ejecución mediante `nargs="+"`.

## 9.3. Comandos obligatorios

```text
python main.py texto "  Python   PRÁCTICO  "

python main.py fecha 2026-08-22 --referencia 2026-08-15

python main.py numeros 2 3.5 5 8

python main.py numeros 2 valor 8

python main.py texto "registro de prueba" --salida reporte.txt

python main.py fecha 2026-08-22 --referencia 2026-08-15 \
    --archivo-log coa_toolkit.log --nivel-log DEBUG

python main.py --help
```

En PowerShell o Símbolo del sistema, escribe el comando largo en una sola línea. La barra invertida del ejemplo representa continuidad visual.

## 9.4. Interfaz obligatoria

El analizador debe incluir:

| Argumento | Tipo | Regla |
|---|---|---|
| `operacion` | Posicional | `texto`, `fecha` o `numeros` |
| `valores` | Posicional | Uno o más textos mediante `nargs="+"` |
| `--referencia` | Opcional | Fecha ISO utilizada por `fecha` |
| `--salida` | Opcional | Ruta de un archivo nuevo para guardar el reporte |
| `--archivo-log` | Opcional | Ruta donde se agregan registros técnicos |
| `--nivel-log` | Opcional | `DEBUG`, `INFO`, `WARNING` o `ERROR`; predeterminado `INFO` |

`--referencia` solo tiene efecto en la operación `fecha`. Si se utiliza con otra operación, muestra una advertencia técnica o rechaza la combinación; documenta la decisión.

## 9.5. Estructura mínima

```text
coa_toolkit/
├── main.py
├── cli.py
├── operaciones.py
├── reportes.py
├── configuracion.py
├── errores.py
├── README.md
└── evidencia/
```

Responsabilidades:

| Archivo | Responsabilidad |
|---|---|
| `main.py` | Coordinar, manejar el límite de la aplicación y devolver código de salida |
| `cli.py` | Construir el parser; no ejecutar operaciones |
| `operaciones.py` | Normalizar, convertir, calcular y devolver resultados |
| `reportes.py` | Formatear y guardar sin sobrescribir |
| `configuracion.py` | Configurar `logging` una sola vez |
| `errores.py` | Declarar excepciones del dominio |

No copies la misma función en dos archivos.

## 9.6. Excepciones del dominio

El material inicial propone:

```python
class CoaToolkitError(Exception):
    """Error base para situaciones esperables de COA Toolkit."""


class EntradaInvalidaError(CoaToolkitError):
    """Indica que un valor no cumple el contrato de una operación."""


class CombinacionArgumentosError(CoaToolkitError):
    """Indica que varias opciones no pueden utilizarse juntas."""
```

Puedes utilizar además excepciones integradas cuando sean más precisas. No captures `CoaToolkitError` dentro de cada función; deja que alcance el punto de entrada.

## 9.7. Flujo del punto de entrada

```text
parse_args()
     │
     ├─ configurar logging
     ├─ registrar inicio
     ├─ elegir operación
     ├─ ejecutar lógica
     ├─ construir reporte
     ├─ imprimir o guardar
     └─ registrar finalización

CoaToolkitError
     ├─ mensaje breve al usuario
     ├─ registro sin duplicación
     └─ código 2

OSError esperado de salida o log
     ├─ mensaje de archivo
     ├─ registro
     └─ código 3

Fallo inesperado
     ├─ logger.exception()
     ├─ mensaje general
     └─ código 1
```

`argparse` conserva su propio comportamiento para errores de sintaxis y `--help`.

## 9.8. Criterios de las operaciones

### Texto

- Une los elementos de `valores` con un espacio.
- Normaliza grupos de espacios mediante `split()` y `join()`.
- Rechaza un resultado vacío.
- Cuenta palabras únicas con `casefold()`.
- No registra el texto completo.

### Fecha

- Exige exactamente un valor.
- Utiliza `date.fromisoformat()` o un formato ISO explícito.
- Traduce el `ValueError` a `EntradaInvalidaError` con `raise ... from error`.
- Aplica los límites temporales de los módulos anteriores: negativo, 0, 1 a 7, más de 7.

### Números

- Convierte todos los textos a `float`.
- Rechaza `NaN`, `Infinity` y `-Infinity` mediante `math.isfinite()`.
- Informa la posición del valor inválido sin perder su representación.
- Utiliza `statistics`, no fórmulas manuales para media, mediana o desviación.

## 9.9. Salida y protección de archivos

Sin `--salida`, el reporte se imprime.

Con `--salida`:

- utiliza `Path`;
- rechaza una ruta que ya existe;
- crea la carpeta padre si no existe;
- escribe con UTF-8;
- no sobrescribe;
- confirma al usuario la ruta creada;
- registra la ruta, pero no el contenido.

Puedes utilizar modo `"x"` para reforzar la creación exclusiva.

El archivo de log sí puede abrirse en modo de adición para conservar eventos anteriores. Reporte y registro tienen políticas distintas.

## 9.10. Configuración del registro

La configuración debe incluir:

- nivel elegido desde terminal;
- fecha y hora;
- nivel;
- nombre del módulo;
- mensaje;
- salida a consola si no se proporciona archivo;
- salida al archivo indicado si se proporciona `--archivo-log`;
- UTF-8 para el archivo.

Cada módulo obtiene:

```python
logger = logging.getLogger(__name__)
```

No llames `basicConfig()` desde `operaciones.py`, `reportes.py` ni `errores.py`.

## 9.11. Resultados de control

### Texto

Entrada:

```text
python main.py texto "  Python   PRÁCTICO  "
```

Valores esperados:

```text
Normalizado: Python PRÁCTICO
Caracteres: 15
Palabras: 2
Palabras únicas: 2
```

### Fecha

Entrada:

```text
python main.py fecha 2026-08-22 --referencia 2026-08-15
```

Valores esperados:

```text
Diferencia: 7
Estado: próxima
Mensaje: faltan 7 días
```

### Números

Entrada:

```text
python main.py numeros 2 3.5 5 8
```

Valores esperados:

```text
Cantidad: 4
Suma: 18.5
Media: 4.625
Mediana: 4.25
Mínimo: 2.0
Máximo: 8.0
Rango: 6.0
Desviación poblacional: 2.2185 aproximadamente
```

## 9.12. Requisitos funcionales obligatorios

1. Mantener los seis archivos Python de la estructura mínima.
2. Utilizar importaciones explícitas.
3. Evitar `import *`.
4. Evitar dependencias circulares.
5. Proteger el punto de entrada.
6. Demostrar que los módulos pueden importarse sin ejecutar la aplicación.
7. Crear la interfaz mediante `argparse`.
8. Incluir ayuda clara para todos los argumentos.
9. Implementar las tres operaciones.
10. Capturar únicamente errores que puedan manejarse correctamente.
11. Utilizar al menos una excepción personalizada.
12. Utilizar `raise ... from error` en la conversión de fechas o números.
13. Devolver códigos distintos para éxito y error.
14. Configurar `logging` una sola vez.
15. Emitir al menos un evento `DEBUG`, `INFO`, `WARNING` y `ERROR` mediante casos apropiados.
16. No registrar valores sensibles ni textos completos del usuario.
17. Escribir reportes con UTF-8 y sin sobrescribir.
18. Incluir docstrings en módulos y funciones públicas.
19. Incluir un README ejecutable y preciso.
20. Obtener los tres resultados de control.

## 9.13. Pruebas obligatorias

| # | Prueba | Resultado esperado |
|---:|---|---|
| 1 | `--help` | Ayuda completa y código 0 |
| 2 | Operación `texto` de control | 15 caracteres, 2 palabras y 2 únicas |
| 3 | Operación `fecha` de control | Próxima; faltan 7 días |
| 4 | Operación `numeros` de control | Métricas esperadas |
| 5 | Operación inexistente | `argparse` rechaza y devuelve código distinto de 0 |
| 6 | Fecha imposible o mal formada | Mensaje claro, registro y código 2 |
| 7 | Número `valor`, `NaN` e `Infinity` | Rechazos claros sin traceback al usuario |
| 8 | Ruta de salida existente | No se sobrescribe; código de error |
| 9 | Nivel `DEBUG` frente a `ERROR` | El contenido del registro cambia según el umbral |
| 10 | Importar cada módulo | Sin preguntas, reportes ni ejecución automática |
| 11 | Error inesperado simulado | Se registra traceback y el programa devuelve código 1 |
| 12 | Revisión de privacidad | El log no contiene el texto completo recibido |

## 9.14. Entrega

Realiza **una sola entrega**:

```text
apellido_nombre_modulo_6/
├── main.py
├── cli.py
├── operaciones.py
├── reportes.py
├── configuracion.py
├── errores.py
├── README.md
├── pruebas.md
├── resultados_ejemplo/
│   ├── texto.txt
│   ├── fecha.txt
│   └── numeros.txt
├── logs/
│   └── coa_toolkit.log
└── evidencia/
    ├── ayuda.png
    ├── ejecuciones.png
    └── importacion_segura.png
```

No incluyas `__pycache__`, entornos virtuales ni archivos temporales.

El `README.md` debe contener:

- propósito;
- versión mínima de Python;
- estructura y responsabilidad de cada módulo;
- instrucciones de ejecución;
- ejemplos copiables de las tres operaciones;
- explicación de argumentos;
- códigos de salida;
- errores esperados;
- política de archivos y registros;
- decisiones de privacidad;
- limitaciones conocidas.

[Entregar el Módulo 6](https://forms.gle/nTx97JRkFkbH5Vfr6)

## 9.15. Condición de aprobación

El proyecto debe aprobarse antes de iniciar el Proyecto Final Integrador.

Requiere corrección si:

- importar un módulo solicita datos o ejecuta la aplicación;
- la lógica está duplicada;
- existe una captura desnuda o un `except Exception` que finge éxito;
- las operaciones no pueden ejecutarse desde la terminal;
- los mensajes de ayuda no explican los formatos;
- `logging` se configura desde varios módulos;
- el reporte sobrescribe archivos;
- el registro contiene datos sensibles;
- otra persona no puede ejecutar el proyecto siguiendo el README.

---

# 10. Rúbrica de evaluación del proyecto

Puntaje total: **100 puntos**. Puntaje mínimo de aprobación: **70 puntos**.

Existen cuatro requisitos críticos:

1. importar los módulos no ejecuta la aplicación ni produce efectos externos;
2. los errores esperados se manejan específicamente y los inesperados no se ocultan;
3. ningún reporte existente se sobrescribe;
4. los registros no contienen información sensible ni el texto completo del usuario.

El incumplimiento de cualquiera exige corrección independientemente del puntaje.

| Criterio | Excelente | Competente | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Funcionalidad | Las tres operaciones y todos los casos de control funcionan | Flujo principal correcto con detalles menores | Una operación o varios casos fallan | La herramienta no puede utilizarse completa | 20 |
| Excepciones y códigos de salida | Capturas específicas, causas encadenadas, errores de dominio y códigos coherentes | Manejo correcto con pequeñas omisiones | Capturas amplias o mensajes ambiguos | Errores ocultos o éxito falso | 20 |
| Modularidad e importaciones | Responsabilidades claras, sin duplicación, ciclos ni efectos al importar | Estructura correcta con algún módulo mejorable | Separación artificial o dependencias confusas | Todo permanece mezclado o no puede importarse | 20 |
| Interfaz `argparse` | Ayuda completa, opciones validadas y comandos claros | Interfaz funcional con ayudas mejorables | Validación o ayuda incompleta | Requiere editar código para utilizarse | 15 |
| Registro técnico y privacidad | Niveles apropiados, contexto útil, una configuración y datos protegidos | Registro funcional con detalles menores | Niveles poco útiles o configuración repetida | Sin registro o con datos sensibles | 10 |
| Archivos y presentación | Reportes claros, UTF-8 y sin sobrescritura | Salidas correctas con detalle menor | Presentación o protección incompleta | Resultados confusos o sobrescritos | 5 |
| Documentación y pruebas | README reproducible, docstrings y doce pruebas demostradas | Documentación suficiente con pocas omisiones | Instrucciones o evidencia incompletas | Otra persona no puede ejecutar el proyecto | 10 |

## Interpretación del resultado

- **90 a 100:** dominio excelente de la construcción de herramientas pequeñas.
- **80 a 89:** desempeño sólido con ajustes menores.
- **70 a 79:** desempeño suficiente; pueden solicitarse mejoras puntuales.
- **Menos de 70:** requiere corrección y nueva entrega.
- **Fallo crítico:** requiere corrección aunque el puntaje alcance 70.

---


<!-- coa-activity:python-practico-m6-proyecto -->

# 11. Evaluación del módulo

Responde antes de ejecutar código. Después comprueba tus respuestas.

## Pregunta 1

¿Por qué conviene mantener pequeño un bloque `try`?

A. Para que Python ejecute más rápido cualquier programa.  
B. Para saber qué operación produjo la excepción y no clasificar mal otros fallos.  
C. Para evitar escribir `else`.  
D. Para capturar siempre `Exception`.

## Pregunta 2

¿Cuándo se ejecuta la cláusula `else` de un `try`?

A. Siempre.  
B. Solo si un manejador produjo otra excepción.  
C. Cuando el bloque `try` termina sin excepción.  
D. Únicamente después de `finally`.

## Pregunta 3

¿Cuál es una razón válida para crear una excepción personalizada?

A. Cambiar el color del traceback.  
B. Evitar todas las excepciones integradas.  
C. Permitir que el llamador distinga una regla concreta del dominio.  
D. Reemplazar cualquier mensaje de validación.

## Pregunta 4

¿Qué forma de importación dificulta conocer el origen de los nombres y puede producir colisiones?

A. `import statistics`  
B. `from statistics import mean`  
C. `import statistics as stats`  
D. `from statistics import *`

## Pregunta 5

¿Qué garantiza el patrón `if __name__ == "__main__":`?

A. Que el archivo solo pueda importarse una vez.  
B. Que el punto de entrada se ejecute al ejecutar el archivo, pero no simplemente al importarlo.  
C. Que todas las funciones sean privadas.  
D. Que no ocurran excepciones.

## Pregunta 6

¿Qué responsabilidad pertenece a `argparse`?

A. Calcular estadísticas del dominio.  
B. Configurar una base de datos.  
C. Analizar argumentos, comprobar opciones y generar ayuda.  
D. Ocultar cualquier `SystemExit`.

## Pregunta 7

¿Cuál evento corresponde normalmente a `WARNING`?

A. Un detalle interno útil solo para investigar.  
B. Una situación inesperada de la cual el programa se recuperó.  
C. La contraseña recibida.  
D. Cada resultado correcto mostrado al usuario.

## Pregunta 8

¿Dónde debería configurarse normalmente `logging.basicConfig()` en esta aplicación?

A. En cada función.  
B. En todos los módulos importados.  
C. Una sola vez cerca del punto de entrada.  
D. Dentro de la clase de excepción.

## Pregunta 9

¿Qué herramienta muestra la documentación interactiva de una función sin ejecutarla?

A. `help(funcion)`  
B. `help(funcion())`  
C. `dir()` sin objeto siempre  
D. `print(type())`

## Pregunta 10

El archivo de reporte ya existe. ¿Cuál conducta cumple los requisitos del proyecto?

A. Sobrescribirlo porque la ejecución fue solicitada.  
B. Añadir el nuevo reporte al final.  
C. Rechazar la operación con un mensaje y un código de error.  
D. Borrarlo y volver a crearlo.

## Aprobación de la evaluación

- Puntaje: 1 punto por respuesta correcta.
- Puntaje mínimo recomendado: **8 de 10**.
- Si obtienes menos de 8, revisa los temas relacionados y vuelve a intentarlo.

---

# 12. Soluciones guiadas

Consulta esta sección después de intentar las prácticas.

## Solución de la práctica guiada 1

```python
def convertir_cantidad(texto):
    try:
        cantidad = int(texto)
    except ValueError as error:
        raise ValueError("La cantidad debe ser un entero.") from error

    if cantidad < 0:
        raise ValueError("La cantidad no puede ser negativa.")

    return cantidad


def convertir_precio(texto):
    try:
        return float(texto)
    except ValueError as error:
        raise ValueError("El precio debe ser numérico.") from error


def calcular_costo(cantidad_texto, precio_texto):
    cantidad = convertir_cantidad(cantidad_texto)
    precio = convertir_precio(precio_texto)
    subtotal = cantidad * precio

    guardar_resultado(subtotal)
    return subtotal
```

`guardar_resultado()` queda fuera de las capturas de conversión. Si produce `PermissionError`, debe manejarse donde exista información suficiente sobre la ruta y la alternativa posible.

## Solución de la práctica guiada 2

```python
from pathlib import Path


class NumeroInvalidoError(ValueError):
    """Indica que un archivo no contiene un número válido."""


def cargar_numero(ruta):
    intento_finalizado = False

    try:
        with Path(ruta).open("r", encoding="utf-8") as archivo:
            texto = archivo.read().strip()
        numero = float(texto)
    except ValueError as error:
        raise NumeroInvalidoError(
            f"El archivo {ruta!s} no contiene un número válido."
        ) from error
    else:
        return numero
    finally:
        intento_finalizado = True
        print("Intento finalizado:", intento_finalizado)
```

La impresión solo demuestra el comportamiento de `finally`; no es un diseño recomendado para el proyecto. `FileNotFoundError` continúa hacia el llamador porque la función no posee una alternativa válida.

## Solución de la práctica guiada 3

`calculadora.py`:

```python
"""Operaciones reutilizables de cálculo."""


def sumar(a, b):
    """Devuelve la suma de dos valores."""
    return a + b
```

`main.py`:

```python
"""Interfaz de terminal de la calculadora."""

from calculadora import sumar


def main():
    primero = float(input("Primer número: "))
    segundo = float(input("Segundo número: "))
    print(sumar(primero, segundo))


if __name__ == "__main__":
    main()
```

Importar `calculadora` únicamente define `sumar()`.

## Solución de la práctica guiada 4

```python
import argparse


def crear_parser():
    parser = argparse.ArgumentParser(
        description="Convierte una longitud a metros."
    )
    parser.add_argument("valor", type=float, help="Longitud que se convertirá.")
    parser.add_argument(
        "--unidad",
        choices=["metros", "kilometros"],
        required=True,
        help="Unidad del valor recibido.",
    )
    parser.add_argument(
        "--decimales",
        type=int,
        default=2,
        help="Cantidad de decimales de salida; predeterminado: 2.",
    )
    return parser


def main():
    argumentos = crear_parser().parse_args()

    if argumentos.decimales < 0:
        print("Error: los decimales no pueden ser negativos.")
        return 2

    metros = (
        argumentos.valor * 1000
        if argumentos.unidad == "kilometros"
        else argumentos.valor
    )
    print(f"{metros:.{argumentos.decimales}f} m")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## Solución de la práctica guiada 5

```python
import logging


logger = logging.getLogger(__name__)


def procesar(valores):
    logger.debug("Iniciando procesamiento")
    logger.debug("Cantidad recibida: %d", len(valores))

    procesados = []
    for valor in valores:
        if not valor:
            logger.warning("Se omitió un valor vacío")
            continue
        procesados.append(valor)

    logger.info("Procesamiento completado: aceptados=%d", len(procesados))
    return procesados
```

Si el guardado falla y el programa puede comunicarlo, corresponde un `ERROR`. La persona usuaria también necesita un mensaje directo; no debería revisar el archivo de log para descubrir que no existe el resultado.

## Respuestas de la evaluación

| Pregunta | Respuesta | Explicación breve |
|---:|:---:|---|
| 1 | B | Un bloque pequeño identifica con precisión la operación que falló. |
| 2 | C | `else` representa el camino sin excepción del `try`. |
| 3 | C | Un tipo propio permite distinguir una regla del dominio. |
| 4 | D | `import *` oculta el origen y favorece colisiones. |
| 5 | B | El punto de entrada solo se activa en ejecución directa. |
| 6 | C | `argparse` analiza, valida la sintaxis y genera ayuda. |
| 7 | B | `WARNING` representa una situación recuperada que merece atención. |
| 8 | C | La configuración se realiza una sola vez en el límite de la aplicación. |
| 9 | A | Se pasa el objeto función a `help()` sin llamarlo. |
| 10 | C | El proyecto prohíbe sobrescribir reportes existentes. |

---

# 13. Retos adicionales

## Reto 1 — Tipo personalizado para `argparse`

Crea una función que convierta una fecha ISO y lance `argparse.ArgumentTypeError` con un mensaje claro. Compárala con la validación dentro de la lógica y explica cuál ubicación permite reutilizar mejor la conversión fuera de la terminal.

## Reto 2 — Subcomandos sencillos

Reemplaza el argumento `operacion` por subanalizadores de `argparse`: `texto`, `fecha` y `numeros`. Cada subcomando debe mostrar solo las opciones que realmente utiliza. No agregues subcomandos anidados.

## Reto 3 — Dos destinos de registro

Configura un manejador de consola desde `WARNING` y un manejador de archivo desde `DEBUG`. No llames `basicConfig()` y evita duplicar eventos.

## Reto 4 — Rotación de registros

Investiga `logging.handlers.RotatingFileHandler` en la documentación oficial. Crea una prueba con archivos pequeños y explica `maxBytes` y `backupCount`.

## Reto 5 — Ejecutar como módulo

Convierte la carpeta en un paquete sencillo y permite:

```text
python -m coa_toolkit --help
```

Investiga el propósito de `__main__.py`. Este reto sirve como transición hacia proyectos Python más estructurados.

---

# 14. Videos recomendados

Los videos refuerzan temas concretos. Comprueba las firmas y comportamientos actuales en la documentación oficial.

## Excepciones y registro

[Python 07: manejo de excepciones y logging — Feregrino](https://www.youtube.com/watch?v=3OKaJ4UpyRs)

Relaciona sus ejemplos con la separación entre un error esperado, un mensaje para el usuario y el contexto técnico.

## Módulos e importaciones

[Importaciones y uso de módulos en Python — Programación Fácil](https://www.youtube.com/watch?v=UWI_t5s8-wM)

Incluye importación completa, importación parcial, alias, espacios de nombres y flujo de ejecución al importar.

## `argparse`

[Argparse Python 3 en español — IsmaelRR](https://www.youtube.com/watch?v=tirLko5urBo)

Utilízalo para observar la construcción de una interfaz real. Mantén el alcance del proyecto en argumentos y opciones sencillas.

## `logging`

[Módulo logging en Python explicado fácil — LatamCode](https://www.youtube.com/watch?v=8ryJp7oMNU0)

Refuerza `basicConfig()`, niveles, formato, salida a archivo y la diferencia frente a `print()`.

## Exploración con `dir()` y `help()`

[Dir y Help — nicosiored](https://www.youtube.com/watch?v=jO7e6949Tp8)

Utiliza estas herramientas para explorar, pero consulta también la página oficial de la función o módulo antes de integrarlo.

---

# 15. Documentación y recursos de lectura

## Documentación oficial de Python

- [Errores y excepciones](https://docs.python.org/es/3/tutorial/errors.html)
- [Módulos](https://docs.python.org/es/3/tutorial/modules.html)
- [`argparse`: referencia](https://docs.python.org/es/3/library/argparse.html)
- [Tutorial de `argparse`](https://docs.python.org/es/3/howto/argparse.html)
- [`logging`: referencia](https://docs.python.org/es/3/library/logging.html)
- [Guía básica de `logging`](https://docs.python.org/es/3/howto/logging.html)
- [Funciones integradas `dir()` y `help()`](https://docs.python.org/es/3/library/functions.html)
- [`pydoc`: documentación y ayuda interactiva](https://docs.python.org/es/3/library/pydoc.html)

## Guías oficiales de estilo

- [PEP 8: guía de estilo para código Python](https://peps.python.org/pep-0008/)
- [PEP 257: convenciones para docstrings](https://peps.python.org/pep-0257/)

## Ruta de lectura recomendada

### Nivel esencial

1. Secciones `try`, `except`, `else`, `finally` y `raise` del tutorial.
2. Ejecución de módulos como scripts y significado de `__name__`.
3. Introducción del tutorial de `argparse`.
4. niveles y configuración básica de `logging`.

### Nivel de profundización

1. Encadenamiento de excepciones.
2. ruta de búsqueda de módulos.
3. objetos `Logger`, `Handler` y `Formatter`.
4. convenciones de docstrings públicas.

## Método de consulta profesional

```text
necesidad concreta
      ↓
identificar módulo u objeto
      ↓
help() / dir() para exploración rápida
      ↓
documentación oficial y versión
      ↓
prueba mínima controlada
      ↓
integración con manejo de errores
      ↓
documentar la decisión
```

---

# 16. Material descargable

El módulo incluye un proyecto inicial con:

- `main.py` para completar el punto de entrada;
- `cli.py` con la estructura de argumentos;
- `operaciones.py` con contratos y marcadores `TODO`;
- `reportes.py` para presentación y escritura protegida;
- `configuracion.py` para el registro técnico;
- `errores.py` con excepciones del dominio;
- plantilla de `README.md`;
- matriz de doce casos de prueba;
- mapa de arquitectura e importaciones;
- lista de comprobación de entrega;
- un ZIP preparado para entregar al estudiante.

El proyecto inicial no contiene la solución de las operaciones.

## Descarga

[Descargar los materiales del Módulo 6](/downloads/python-practico/modulo-6/materiales_python_practico_modulo_6_estudiante.zip)

---

# 17. Errores comunes y cómo corregirlos

| Error | Consecuencia | Corrección |
|---|---|---|
| `except:` sin tipo | Oculta incluso interrupciones | Captura excepciones específicas |
| `except Exception: pass` | El programa aparenta éxito | Maneja, registra o relanza de forma explícita |
| Bloque `try` demasiado largo | Mensajes atribuidos a la causa equivocada | Protege solo la operación conocida |
| Capturar una clase base antes que su subclase | Manejador específico inalcanzable | Ordena de específico a general |
| Usar `finally` para devolver un valor | Oculta excepciones o retornos | Reserva `finally` para limpieza necesaria |
| Imprimir dentro de toda función de lógica | Código difícil de reutilizar | Devuelve resultados o lanza errores claros |
| Crear una excepción para cada mensaje | Jerarquía innecesaria | Crea tipos cuando el llamador necesita distinguirlos |
| Importar con `*` | Colisiones y origen desconocido | Importaciones explícitas |
| Llamar un archivo `logging.py` o `random.py` | Sombrea la biblioteca estándar | Usa un nombre propio del dominio |
| Ejecutar código al importar | Preguntas, archivos o mensajes inesperados | Protege el punto de entrada |
| Importación circular | Módulos parcialmente inicializados | Diseña dependencias en una dirección |
| Colocar toda la lógica en `main.py` | Difícil de probar y reutilizar | Separa interfaz, lógica y presentación |
| Validar todo dentro de `argparse` | Interfaz acoplada al dominio | Deja reglas reutilizables en la lógica |
| Ocultar `SystemExit` de `argparse` | Ayuda y códigos inconsistentes | Conserva su comportamiento normal |
| Configurar logging en cada módulo | Eventos duplicados | Configura una vez; usa `getLogger(__name__)` |
| Usar `ERROR` para todo | Registro ruidoso e inútil | Selecciona niveles por severidad |
| Registrar texto completo o secretos | Riesgo de privacidad | Registra contexto mínimo |
| Sobrescribir el reporte | Pérdida de resultados previos | Comprueba y crea de forma exclusiva |
| Docstring que repite el código | No explica el contrato | Describe propósito, retorno y errores |
| Copiar un ejemplo sin revisar versión | Función ausente o distinta | Confirma la documentación del entorno |

---

# 18. Glosario

**Excepción:** objeto que comunica una condición anormal durante la ejecución.

**Manejador:** bloque `except` que responde a un tipo de excepción.

**Relanzar:** permitir que una excepción continúe después de realizar una acción parcial.

**Encadenamiento:** relación explícita entre una excepción nueva y su causa original.

**Error de dominio:** problema expresado con el vocabulario y las reglas de la aplicación.

**Módulo:** archivo Python importable que contiene definiciones y código de nivel superior.

**Espacio de nombres:** relación entre nombres y objetos dentro de un ámbito.

**Colisión:** situación en la que dos definiciones compiten por el mismo nombre.

**Efecto secundario al importar:** acción externa no deseada, como imprimir, pedir datos o escribir archivos durante una importación.

**Punto de entrada:** lugar desde el cual comienza la ejecución coordinada de una aplicación.

**Código de salida:** entero que comunica al sistema si una ejecución terminó correctamente.

**Argumento posicional:** valor cuya ubicación en el comando determina su significado.

**Opción:** argumento identificado por un nombre como `--salida`.

**Parser:** componente que interpreta y valida la sintaxis de los argumentos.

**Registro o log:** secuencia de eventos técnicos emitidos por una aplicación.

**Nivel de registro:** severidad asignada a un evento, como `INFO` o `ERROR`.

**Logger:** objeto utilizado para emitir eventos bajo un nombre.

**Handler:** destino y política de entrega de los eventos de registro.

**Docstring:** cadena que documenta un módulo, clase, función o método.

**Firma:** nombre, parámetros y configuración de llamada de una función.

**PEP:** propuesta oficial de mejora de Python; algunas documentan convenciones y estándares.

---

# 19. Resumen final

En este módulo convertiste funciones aisladas en una herramienta pequeña y utilizable. Aprendiste que el manejo de errores, la modularidad, la interfaz, los registros y la documentación no son adornos posteriores: forman parte del comportamiento profesional del programa.

Ahora puedes:

- distinguir fallos esperables de errores de programación;
- limitar el alcance de un `try`;
- utilizar `except`, `else` y `finally` con intención;
- lanzar y encadenar excepciones;
- crear errores sencillos del dominio;
- dividir un programa en módulos reutilizables;
- evitar colisiones, importaciones circulares y efectos secundarios;
- proteger el punto de entrada;
- devolver códigos de salida;
- crear ayuda de terminal con `argparse`;
- separar resultados del usuario y registros técnicos;
- seleccionar niveles de logging;
- proteger información sensible;
- explorar con `help()` y `dir()`;
- consultar documentación oficial por versión;
- escribir docstrings y un README reproducible.

## Lista de comprobación antes del proyecto final

- [ ] Completé las cinco prácticas guiadas.
- [ ] Entregué las siete actividades obligatorias.
- [ ] Puedo explicar cuándo no debo capturar una excepción.
- [ ] Mis bloques `try` contienen solo operaciones relacionadas.
- [ ] Utilicé una excepción personalizada justificada.
- [ ] Puedo explicar `raise ... from error`.
- [ ] Ningún módulo utiliza `import *`.
- [ ] Las dependencias siguen una dirección clara.
- [ ] Importar módulos no ejecuta la aplicación.
- [ ] `--help` explica argumentos y formatos.
- [ ] Las tres operaciones producen los resultados de control.
- [ ] El programa devuelve códigos distintos para éxito y error.
- [ ] `logging` se configura una sola vez.
- [ ] El registro no contiene datos sensibles.
- [ ] Los reportes no sobrescriben archivos.
- [ ] Documenté los doce casos de prueba.
- [ ] Otra persona puede seguir el README sin ayuda adicional.
- [ ] Obtuve al menos 8 de 10 en la evaluación.
- [ ] El proyecto fue aprobado.

Cuando todos los puntos estén completos, estarás preparado para iniciar el **Proyecto Final Integrador de Python Práctico**.
