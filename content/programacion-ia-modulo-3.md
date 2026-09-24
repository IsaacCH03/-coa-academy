# Módulo 3. Construcción y modificación de software con Inteligencia Artificial

**Curso:** Programación Asistida por Inteligencia Artificial  
**Duración estimada:** 3 horas  
**Modalidad:** Autodidacta  
**Nivel:** Intermedio  
**Proyecto del módulo:** Gestor de solicitudes de soporte  
**Lenguaje:** El lenguaje de programación que ya conoces

---

# Introducción

En los módulos anteriores aprendiste a proteger el control del trabajo y a dirigir conversaciones técnicas. Ahora utilizarás esas habilidades dentro de la implementación real.

La IA puede producir una función, una clase o una estructura de carpetas rápidamente. El reto profesional comienza después:

- decidir si esa estructura es proporcional al problema;
- comprobar que el código es compatible con tu entorno;
- integrarlo sin romper contratos existentes;
- leer cada cambio;
- ejecutar pruebas;
- conservar solamente aquello que entiendes;
- revertir una propuesta incorrecta.

```text
Especificación
      ↓
Cambio pequeño
      ↓
Lectura del código
      ↓
Integración
      ↓
Pruebas
      ↓
Diff
      ↓
Aceptar, corregir o revertir
```

Este módulo no premia la cantidad de código generado. Premia la capacidad de construir por etapas y mantener el proyecto bajo control.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- preparar una tarea antes de solicitar código;
- escribir contratos claros para funciones;
- diseñar clases proporcionales al problema;
- evitar arquitecturas innecesarias;
- solicitar estructuras mínimas de proyecto;
- exigir compatibilidad con una versión específica;
- integrar código en un proyecto existente;
- comprender un archivo que no escribiste;
- separar propósito, flujo, dependencias y efectos secundarios;
- reconocer cuándo un CRUD aporta valor;
- solicitar documentación útil;
- mejorar nombres y legibilidad;
- refactorizar sin cambiar comportamiento;
- extraer funciones y reducir duplicación;
- comparar implementaciones mediante criterios;
- rechazar dependencias injustificadas;
- utilizar asistencia dentro del editor con alcance controlado;
- leer un diff antes de aceptar cambios;
- crear puntos de recuperación con Git;
- revertir una propuesta incorrecta;
- mantener un ciclo continuo de implementación y prueba.

---

# Conocimientos previos

Antes de comenzar debes poder:

- programar funciones y clases básicas en un lenguaje;
- ejecutar un proyecto pequeño;
- diseñar casos normales, límite e inválidos;
- redactar criterios de aceptación;
- dividir una conversación técnica en etapas;
- proteger credenciales y datos privados;
- utilizar archivos de texto o datos con la biblioteca estándar de tu lenguaje.

No necesitas dominar patrones de diseño ni arquitecturas avanzadas.

---

# Preparación

Necesitas:

- un editor o IDE;
- un asistente conversacional;
- Git instalado para crear puntos de recuperación;
- un lenguaje y versión que puedas ejecutar;
- una carpeta llamada `coa_ia_modulo_3`;
- las plantillas de contexto y bitácora de los módulos anteriores.

Un asistente dentro del editor es opcional. Puedes completar el módulo mediante un chat y cambios manuales.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Contenido esencial y prácticas guiadas | 55 minutos |
| Ejercicios individuales | 25 minutos |
| Mini proyecto | 30 minutos |
| Proyecto del módulo | 50 minutos |
| Evaluación, revisión y entrega | 20 minutos |
| **Total estimado** | **3 horas** |

Los videos y las lecturas complementarias son opcionales y no están incluidos en estas tres horas.

---

# 1. Preparar una tarea antes de solicitar código

La implementación empieza antes de que aparezca la primera línea.

Para una tarea pequeña, prepara cinco elementos:

```text
1. Contrato
2. Casos de aceptación
3. Alcance de archivos
4. Restricciones del entorno
5. Punto de recuperación
```

## Contrato

Define qué recibe, qué devuelve, qué errores controla y qué no debe hacer.

## Casos de aceptación

Convierten las reglas en evidencia futura.

## Alcance de archivos

Indica qué puede leerse y qué puede modificarse.

## Restricciones del entorno

Incluyen versión, dependencias permitidas y convenciones.

## Punto de recuperación

Conserva un estado funcional antes del cambio.

## Lista previa

Antes de pedir implementación, responde:

- ¿Puedo explicar el resultado esperado?
- ¿Conozco la interfaz que debe conservarse?
- ¿Tengo al menos un caso normal, un límite y un inválido?
- ¿Sé qué archivo debe cambiar?
- ¿Puedo volver al estado anterior?

Si alguna respuesta es “no”, resuelve esa incertidumbre primero.

---

# 2. Generar funciones desde contratos claros

Una función pequeña posee una frontera visible.

## Contrato de ejemplo

```text
Nombre: calcular_recargo

Entrada:
- importe numérico mayor o igual que 0;
- nivel: "normal", "prioritario" o "urgente".

Salida:
- monto del recargo redondeado a dos decimales.

Reglas:
- normal: 0 %;
- prioritario: 8 %;
- urgente: 15 %.

Errores:
- importe negativo o no numérico;
- nivel desconocido.

Restricciones:
- no imprimir;
- no modificar datos externos;
- no usar bibliotecas externas.
```

## Solicitud de implementación

```text
Implementa únicamente el contrato adjunto en [LENGUAJE Y VERSIÓN].

Antes del código:
- señala cualquier ambigüedad;
- confirma la firma propuesta.

Después del código:
- explica entradas, salida y rutas de error;
- propone seis pruebas vinculadas con las reglas.

No agregues interfaz, almacenamiento ni dependencias.
No afirmes que las pruebas fueron ejecutadas.
```

## Revisión línea por línea

Después de recibir la función, identifica:

- validación de tipo;
- validación de rango;
- selección del porcentaje;
- cálculo;
- redondeo;
- salida;
- posibles efectos secundarios.

Si no puedes localizar una responsabilidad, no asumas que está presente.

---

# 3. Diseñar clases sin sobrearquitectura

Una clase puede ser útil cuando varios datos y comportamientos pertenecen a un mismo concepto y deben conservar reglas internas.

## Una clase está justificada cuando

- representa una entidad con estado;
- protege invariantes;
- agrupa operaciones estrechamente relacionadas;
- existen varias instancias con sus propios datos;
- mejora la comprensión del dominio.

## Una clase puede ser innecesaria cuando

- contiene una sola función sin estado;
- solo reenvía llamadas;
- existe para cumplir un patrón que el proyecto no necesita;
- obliga a crear fábricas, interfaces y capas sin una segunda implementación real;
- hace más difícil probar una operación sencilla.

## Ejemplo de sobrearquitectura

Para calcular un descuento, una IA podría proponer:

```text
DiscountFactory
    ↓
DiscountStrategyInterface
    ↓
StandardDiscountStrategy
    ↓
DiscountContext
    ↓
DiscountCalculatorService
```

Tal estructura puede tener sentido en un sistema con decenas de políticas intercambiables. Para tres reglas estables, una función o una clase pequeña puede ser suficiente.

## Preguntas para reducir complejidad

```text
- ¿Qué requisito concreto justifica cada clase?
- ¿Existe más de una implementación real?
- ¿Qué cambio futuro comprobable facilita esta estructura?
- ¿Podemos resolverlo con menos piezas sin perder claridad?
- ¿Qué pruebas se vuelven más fáciles o más difíciles?
```

## Solicitud de simplificación

```text
La propuesta contiene cinco clases para tres reglas estables.
Redúcela a la estructura mínima que preserve:
- validación;
- cálculo;
- facilidad de prueba.

No agregues patrones por anticipación. Explica qué responsabilidad conserva
cada pieza restante.
```

---

# 4. Crear una estructura de proyecto proporcional

La estructura debe reflejar responsabilidades reales.

## Proyecto pequeño

```text
proyecto/
├── modelos/
│   └── solicitud.ext
├── logica/
│   └── gestor.ext
├── datos/
│   └── almacenamiento.ext
├── pruebas/
│   └── pruebas_gestor.ext
└── principal.ext
```

Esta separación puede representar:

- datos y reglas de una solicitud;
- operaciones del gestor;
- lectura y escritura;
- pruebas;
- punto de entrada.

No todos los lenguajes necesitan carpetas idénticas. En un proyecto muy pequeño, varios componentes pueden vivir en menos archivos.

## Señales de una estructura innecesaria

- carpetas vacías;
- una interfaz con una única implementación sin razón;
- clases que solo llaman a otra clase;
- nombres técnicos sin relación con el problema;
- configuración más extensa que la lógica;
- capas que no pueden probarse por separado.

## Prompt para proponer estructura

```text
Propón dos estructuras mínimas para este proyecto de [TAMAÑO].
Debe incluir [RESPONSABILIDADES].

Para cada alternativa indica:
- propósito de cada archivo;
- ventaja;
- costo;
- señal que justificaría crecer a una estructura mayor.

No escribas código ni agregues frameworks.
```

La estructura no debe elegirse por la cantidad de carpetas. Elige la que permita localizar y probar las responsabilidades.

---

# 5. Compatibilidad con el entorno real

Una respuesta puede utilizar sintaxis correcta para otra versión.

## Incluye en el contexto

- lenguaje;
- versión exacta confirmada;
- bibliotecas instaladas;
- herramienta de pruebas;
- sistema operativo si afecta rutas o comandos;
- restricciones de compilación o ejecución.

## Comprueba la versión

Utiliza el comando apropiado para tu lenguaje. Ejemplos:

```text
python --version
node --version
java --version
dotnet --version
```

No copies estos comandos si no corresponden a tu entorno.

## Solicitud compatible

```text
El proyecto se ejecuta con [LENGUAJE] [VERSIÓN CONFIRMADA].
No utilices características incorporadas después de esa versión.
No agregues dependencias.
Si una función estándar no está disponible, detente y propone una alternativa
compatible antes de escribir código.
```

## La IA no confirma compatibilidad por sí sola

Después de la propuesta:

1. revisa importaciones;
2. consulta documentación oficial;
3. ejecuta el compilador o intérprete;
4. corre las pruebas;
5. registra la versión utilizada.

---

# 6. Integrar código en un proyecto existente

Un fragmento aislado puede funcionar y aun así no encajar en el proyecto.

## Revisa antes de integrar

| Área | Pregunta |
|---|---|
| Contrato | ¿Conserva firma y salida? |
| Nombres | ¿Respeta las convenciones existentes? |
| Errores | ¿Utiliza la misma estrategia del proyecto? |
| Dependencias | ¿Introduce paquetes o acoplamientos? |
| Estado | ¿Modifica datos compartidos? |
| Pruebas | ¿Conserva casos anteriores? |
| Estructura | ¿Está en el archivo correcto? |

## Flujo de integración

```text
1. Crear punto de recuperación.
2. Seleccionar el archivo objetivo.
3. Solicitar un cambio pequeño.
4. Revisar el diff.
5. Ejecutar pruebas cercanas.
6. Ejecutar pruebas generales disponibles.
7. Confirmar o revertir.
```

No copies una solución aislada sobre un archivo completo sin comparar lo que se perdió.

---

# 7. Comprender código que no escribiste

La IA puede ayudar a crear un mapa inicial, pero la explicación debe coincidir con el archivo y la ejecución.

## Protocolo de lectura

Analiza en este orden:

1. propósito;
2. entradas;
3. salidas;
4. flujo principal;
5. decisiones y límites;
6. dependencias;
7. efectos secundarios;
8. errores posibles;
9. casos que faltan;
10. preguntas no demostrables.

## Prompt de explicación verificable

```text
Analiza únicamente el archivo adjunto.

Devuelve:
1. propósito en dos frases;
2. entradas y salidas;
3. flujo numerado;
4. dependencias;
5. efectos secundarios;
6. condiciones límite;
7. errores posibles;
8. afirmaciones que no pueden demostrarse sin ver otros archivos.

Cita nombres concretos del código. No propongas cambios todavía.
```

## Mapa de flujo

```text
Entrada
  ↓
Validación
  ├── inválida → error o descarte
  └── válida
         ↓
      transformación
         ↓
      efecto secundario
         ↓
      acumulación
         ↓
Salida
```

## Verificación

Para cada afirmación importante, identifica una de estas evidencias:

- línea o bloque de código;
- prueba ejecutada;
- documentación oficial;
- resultado observable.

Si no existe evidencia, marca la afirmación como hipótesis.

---

# 8. CRUD: cuándo aporta valor

CRUD representa cuatro operaciones frecuentes:

- crear;
- consultar;
- actualizar;
- eliminar.

Un asistente puede generar CRUD con rapidez, pero eso no significa que todas las entidades necesiten las cuatro operaciones.

## Preguntas antes de generar CRUD

- ¿Se puede eliminar realmente o debe archivarse?
- ¿Qué campos pueden actualizarse?
- ¿Qué reglas cambian según el estado?
- ¿Quién puede realizar cada operación?
- ¿Qué ocurre si el identificador no existe?
- ¿Cómo se conserva la información?
- ¿Qué validaciones son compartidas?

## Ejemplo: una solicitud de soporte

Puede permitirse:

- crear una solicitud;
- consultar y filtrar;
- cambiar el estado mediante transiciones;
- cancelar bajo ciertas reglas.

Eliminarla físicamente podría destruir trazabilidad. Por eso el proyecto del módulo no incluirá eliminación definitiva.

## Prompt adecuado

```text
No generes un CRUD genérico.
Analiza las operaciones permitidas para la entidad según estas reglas de estado.
Señala qué operación CRUD no corresponde y por qué.
Después propone funciones públicas mínimas.
```

---

# 9. Documentación útil y comentarios innecesarios

Un comentario debe aportar información que el código no expresa con claridad.

## Comentario obvio

```text
contador = contador + 1  // Incrementa contador en uno
```

Repite la instrucción.

## Comentario útil

```text
// Se conserva el identificador anterior porque aparece en reportes ya emitidos.
```

Explica una decisión y su motivo.

## Documentación útil

- contrato público;
- formato de entrada y salida;
- excepción o error esperado;
- efecto secundario no evidente;
- decisión empresarial;
- ejemplo límite;
- instrucciones reales de ejecución.

## Solicitud de documentación

```text
Documenta únicamente las interfaces públicas y las decisiones no evidentes.
No agregues comentarios que traduzcan cada línea.
No afirmes comportamientos que no estén demostrados en el código o las pruebas.
Devuelve primero una lista de los lugares que realmente necesitan documentación.
```

---

# 10. Mejorar nombres y legibilidad

Un nombre debe comunicar la responsabilidad dentro del dominio.

| Nombre débil | Problema | Alternativa posible |
|---|---|---|
| `x` | No indica contenido | `subtotal` |
| `data` | Demasiado general | `solicitudes` |
| `process` | No expresa acción | `cambiar_estado` |
| `manager2` | No explica diferencia | Nombre según responsabilidad |
| `temp` | Puede sobrevivir más de lo previsto | Nombre del resultado intermedio |

## No renombres por estética

Un nombre público puede ser utilizado por otros archivos. Antes de cambiarlo:

- busca referencias;
- revisa pruebas;
- identifica documentación;
- decide si es una modificación interna o pública;
- aplica el cambio de forma consistente.

## Prompt de revisión de nombres

```text
Señala nombres que oculten una responsabilidad.
Para cada uno indica:
- ubicación;
- interpretación actual;
- alternativa;
- riesgo de cambiarlo;
- referencias que deben revisarse.

No modifiques el código.
```

---

# 11. Refactorizar sin cambiar comportamiento

Refactorizar significa mejorar la estructura interna conservando el comportamiento observable.

No es refactorización si al mismo tiempo:

- cambia una regla;
- agrega una función nueva para el usuario;
- modifica la salida;
- elimina compatibilidad;
- corrige un resultado empresarial.

Esas modificaciones pueden ser válidas, pero deben tratarse como cambios de comportamiento.

## Red de seguridad

Antes de refactorizar:

1. identifica el comportamiento actual;
2. ejecuta las pruebas existentes;
3. agrega pruebas de caracterización si faltan;
4. registra los resultados;
5. cambia una parte;
6. vuelve a ejecutar.

## Prueba de caracterización

Describe lo que el sistema hace actualmente, aunque después se decida cambiarlo. Sirve para detectar modificaciones involuntarias.

## Prompt de refactorización

```text
Refactoriza únicamente [FRAGMENTO] para [OBJETIVO ESTRUCTURAL].

Debe conservar:
- firma;
- salida;
- errores;
- efectos secundarios;
- casos CP-01 a CP-10.

No agregues funcionalidad ni dependencias.
Devuelve un diff mínimo y relaciona cada modificación con el objetivo.
```

## Una refactorización puede rechazarse

Si la nueva versión es más abstracta, más extensa o más difícil de explicar sin mejorar una necesidad real, conserva la anterior.

---

# 12. Extraer funciones y responsabilidades

Una función puede extraerse cuando un bloque:

- representa una acción con nombre;
- se repite;
- tiene entradas y salida claras;
- puede probarse por separado;
- reduce la carga de lectura de la función principal.

## No extraigas por cantidad de líneas

Tres líneas pueden representar una regla importante. Quince líneas secuenciales pueden ser más claras juntas. La responsabilidad importa más que el tamaño.

## Preguntas antes de extraer

- ¿Cómo se llamará la nueva responsabilidad?
- ¿Qué datos necesita?
- ¿Qué devuelve?
- ¿Modifica estado externo?
- ¿Quién la utilizará?
- ¿Qué prueba demuestra que el comportamiento se conserva?

## Solicitud

```text
Identifica bloques candidatos a extracción, pero no modifiques el código.
Para cada candidato indica responsabilidad, entradas, salida, efectos secundarios
y beneficio comprobable. Descarta extracciones que solo agreguen indirección.
```

---

# 13. Reducir duplicación con cuidado

Dos fragmentos parecidos no siempre representan la misma regla.

## Duplicación accidental

La misma validación fue copiada en tres lugares y debe cambiar siempre de forma conjunta.

## Similitud intencional

Dos procesos se parecen hoy, pero pertenecen a reglas empresariales distintas y pueden evolucionar por separado.

## Antes de unificar

Pregunta:

- ¿Cambian por la misma razón?
- ¿Comparten exactamente las mismas reglas?
- ¿Una modificación debe afectar siempre a ambos?
- ¿La abstracción tendrá un nombre claro?
- ¿La nueva función necesita demasiados parámetros o banderas?

Una función llena de banderas para cubrir casos distintos puede ser peor que una duplicación pequeña y explícita.

---

# 14. Comparar implementaciones

No elijas por cantidad de líneas.

| Criterio | Pregunta |
|---|---|
| Corrección | ¿Supera los mismos casos? |
| Claridad | ¿Puedes explicar el flujo? |
| Compatibilidad | ¿Funciona en la versión requerida? |
| Dependencias | ¿Agrega paquetes? |
| Efectos | ¿Modifica estado inesperadamente? |
| Pruebas | ¿Es fácil aislarla? |
| Cambio | ¿Cuánto código existente altera? |
| Mantenimiento | ¿Qué regla será más fácil de cambiar? |

## Comparación justa

- mismo contrato;
- mismo entorno;
- mismos casos;
- mismas restricciones;
- resultados ejecutados;
- riesgos documentados.

Si ambas fallan un requisito crítico, descarta ambas aunque una obtenga mayor puntuación.

---

# 15. Revisar dependencias propuestas

Una dependencia puede ahorrar trabajo, pero también introduce:

- instalación;
- versiones;
- actualizaciones;
- licencias;
- vulnerabilidades;
- cambios de API;
- mayor superficie de fallo.

## Lista de decisión

Antes de aceptar una biblioteca propuesta:

1. ¿La biblioteca estándar resuelve la tarea?
2. ¿El proyecto ya utiliza esa dependencia?
3. ¿La función requerida existe en la versión sugerida?
4. ¿La licencia es compatible?
5. ¿Existe documentación oficial?
6. ¿El proyecto mantiene actividad?
7. ¿El costo de incorporar supera el código evitado?
8. ¿Puede probarse sin conexión o servicios externos?

## Prompt de desafío

```text
Justifica la dependencia [NOMBRE] para esta tarea.
Compara:
A. biblioteca estándar;
B. dependencia propuesta.

Evalúa código necesario, mantenimiento, licencia, compatibilidad y pruebas.
No la instales ni modifiques archivos.
```

La recomendación de una IA no confirma que el paquete exista o sea seguro. Consulta el registro y la documentación oficial.

---

# 16. Utilizar asistentes dentro del editor

Un asistente integrado puede observar el archivo abierto, la selección o más contexto, según la herramienta y los permisos.

## Para autocompletado

- escribe nombres descriptivos;
- conserva cerca el contrato relevante;
- acepta por fragmentos;
- lee la sugerencia completa;
- rechaza continuaciones que inventen reglas.

## Para chat del editor

- selecciona el fragmento exacto;
- menciona archivos de referencia;
- limita archivos modificables;
- solicita análisis antes de cambios amplios;
- revisa el diff.

## Para herramientas capaces de actuar

- crea un commit previo;
- limita permisos;
- inspecciona comandos;
- evita datos reales;
- no autorices cambios masivos sin plan;
- detén el proceso si aparece un archivo inesperado.

La facilidad de presionar “Aceptar” no reduce la responsabilidad de leer.

---

# 17. Leer un diff antes de aceptar

Un diff muestra qué se agregó y qué se eliminó.

```diff
- si subtotal > 100:
+ si subtotal >= 100:
```

En este ejemplo, una sola línea cambia el límite.

## Revisión en tres pasadas

### Primera pasada: alcance

- ¿Cambió solo el archivo autorizado?
- ¿Aparecieron archivos nuevos?
- ¿Se modificó configuración?

### Segunda pasada: comportamiento

- ¿Cambió una condición?
- ¿Cambió una salida?
- ¿Se eliminó validación?
- ¿Apareció un efecto secundario?

### Tercera pasada: calidad y riesgo

- ¿Hay duplicación?
- ¿Hay dependencias?
- ¿Los nombres coinciden con el proyecto?
- ¿Las pruebas cubren el cambio?
- ¿Existe información sensible?

## Comandos básicos de lectura

```powershell
git status
git diff
git diff -- ruta/al/archivo
git diff --staged
```

Estos comandos muestran estado y diferencias. No aceptan ni revierten cambios.

---

# 18. Crear puntos de recuperación con Git

Antes de permitir una modificación relevante, conserva un estado funcional.

## Secuencia segura

```powershell
git status
git add ruta/al/archivo1 ruta/al/archivo2
git commit -m "Checkpoint antes de refactorizar solicitudes"
```

Selecciona archivos explícitos. No incluyas `.env`, credenciales, datos personales, dependencias instaladas ni archivos temporales.

Después del cambio:

```powershell
git status
git diff
```

Si el cambio es correcto y las pruebas pasan:

```powershell
git add ruta/al/archivo_modificado ruta/a/pruebas
git commit -m "Refactoriza validación de solicitudes"
```

## Revertir archivos no confirmados

```powershell
git restore -- ruta/al/archivo
```

Este comando descarta cambios locales no confirmados de ese archivo. Antes de utilizarlo:

- verifica la ruta exacta;
- revisa `git diff -- ruta/al/archivo`;
- confirma que no contiene trabajo propio que quieras conservar;
- crea una copia o commit si existe alguna duda.

No utilices comandos destructivos amplios para “limpiar” un proyecto.

## Sin Git

Si todavía no puedes utilizar Git, guarda copias numeradas:

```text
v1_funcional/
v2_propuesta_ia/
v3_validada/
```

Git es la opción recomendada porque conserva cambios y decisiones con mayor precisión.

---

# 19. Ciclo de implementación y prueba

Cada cambio debe atravesar el mismo ciclo:

```text
Contrato
  ↓
Caso que demuestra el objetivo
  ↓
Implementación pequeña
  ↓
Lectura
  ↓
Ejecución
  ↓
Diff
  ↓
Decisión
  ├── aceptar
  ├── corregir
  └── revertir
```

## Regla de una variable

Cuando algo falla, evita cambiar simultáneamente:

- implementación;
- requisitos;
- prueba;
- estructura;
- dependencia.

Cambia un elemento, ejecuta y observa. Así podrás identificar qué produjo el nuevo resultado.

## Criterio de terminado

Una etapa termina cuando:

- el contrato está implementado;
- los casos acordados fueron ejecutados;
- el diff fue revisado;
- el código puede explicarse;
- la bitácora contiene la decisión;
- existe un punto recuperable.

---

# Práctica guiada 1. Generar una función desde un contrato

## Problema

Construye una función que calcule puntos de fidelidad.

## Contrato

- Entrada: importe de compra y tipo de cliente.
- El importe debe ser numérico y mayor que `0`.
- Tipos permitidos: `nuevo`, `frecuente`, `premium`.
- Puntos:
  - nuevo: 1 punto por cada 10 unidades monetarias completas;
  - frecuente: 2 puntos por cada 10 unidades completas;
  - premium: 3 puntos por cada 10 unidades completas.
- La fracción menor que 10 no produce puntos.
- Salida: entero no negativo.
- No imprimir ni modificar datos externos.
- No utilizar dependencias externas.

## Casos mínimos

| Importe | Tipo | Resultado |
|---:|---|---:|
| `9.99` | nuevo | `0` |
| `10` | nuevo | `1` |
| `25` | frecuente | `4` |
| `100` | premium | `30` |
| `0` | nuevo | Error |
| `50` | desconocido | Error |

## Procedimiento

1. Escribe la firma apropiada para tu lenguaje.
2. Solicita una implementación limitada al contrato.
3. Lee la respuesta línea por línea.
4. Marca cualquier conversión de tipo no solicitada.
5. Ejecuta los seis casos.
6. Agrega un caso con importe negativo.
7. Revisa el diff.
8. Acepta, corrige o revierte.

## Evidencia

Registra:

- prompt;
- código recibido;
- caso que falló, si existe;
- corrección manual;
- resultado final;
- decisión.

---

# Práctica guiada 2. Reducir una clase innecesaria

## Situación

Pide a una IA una propuesta de clases para validar códigos promocionales con estas reglas:

- código `BIENVENIDA`: 5 %;
- código `FRECUENTE`: 10 %;
- cualquier otro código es inválido;
- la operación solo devuelve el porcentaje;
- no existe almacenamiento ni configuración externa.

## Primera solicitud

Pide una propuesta de estructura, no código. Si aparecen múltiples clases, pregunta qué requisito justifica cada una.

## Segunda solicitud

```text
Reduce la propuesta a la estructura mínima que permita:
- validar el código;
- devolver el porcentaje;
- probar ambos códigos y un valor inválido.

No diseñes para reglas futuras que no están confirmadas.
Compara una función y una clase pequeña. No implementes todavía.
```

## Decisión

Elige la alternativa más proporcional y explica:

- por qué satisface el alcance;
- qué complejidad evita;
- qué cambio real justificaría crecer después.

Implementa y ejecuta tres casos únicamente después de elegir.

---

# Ejercicios individuales obligatorios

Completa los ocho ejercicios en `01_ejercicios/ejercicios.md` o `.txt`.

## Ejercicio 1. Completa el contrato

La petición dice:

> Crear una función para normalizar nombres.

Redacta un contrato que defina entrada, salida, espacios, mayúsculas, caracteres vacíos, tipos inválidos, efectos secundarios y cinco criterios de aceptación.

No implementes la función.

## Ejercicio 2. Reduce sobrearquitectura

Una propuesta utiliza ocho clases para calcular tres tarifas fijas. Enumera las preguntas que utilizarías para justificar o eliminar cada capa. Después diseña una alternativa de máximo dos piezas y explica qué requisito cumple cada una.

## Ejercicio 3. Explica antes de cambiar

Selecciona una función de entre 15 y 40 líneas que no contenga información privada. Antes de solicitar una mejora:

1. explica su propósito con tus palabras;
2. pide a la IA un mapa de entradas, salidas, flujo y efectos;
3. marca una afirmación no demostrable o confirma con evidencia cada afirmación;
4. registra una pregunta que todavía necesite otro archivo.

## Ejercicio 4. Separa refactorización y funcionalidad

Clasifica cada cambio:

- renombrar una variable local;
- aceptar un nuevo tipo de descuento;
- extraer una validación conservando resultados;
- cambiar un error por un valor vacío;
- eliminar duplicación sin cambiar salidas;
- agregar persistencia.

Indica cuáles pueden incluirse en una misma refactorización y cuáles requieren criterios nuevos.

## Ejercicio 5. Evalúa una dependencia

Una IA propone instalar una biblioteca externa únicamente para leer y escribir un archivo de texto pequeño.

Compara la biblioteca y la opción estándar de tu lenguaje según:

- código necesario;
- instalación;
- compatibilidad;
- licencia;
- mantenimiento;
- pruebas.

Toma una decisión y explica qué evidencia consultaste.

## Ejercicio 6. Revisa un diff

Analiza este cambio:

```diff
- si cantidad <= 0:
-     devolver error("Cantidad inválida")
+ intentar:
+     cantidad = convertir_a_entero(cantidad)
+ excepto cualquier_error:
+     cantidad = 1
```

Identifica:

- comportamiento eliminado;
- supuesto nuevo;
- error ocultado;
- casos que cambiarían;
- decisión entre aceptar, corregir o revertir.

Después redacta una solicitud de cambio mínimo.

## Ejercicio 7. Mejora documentación

Una IA agregó un comentario para cada línea de una función sencilla. Escribe criterios para conservar solo documentación útil. Propón tres ejemplos de comentarios que deberían eliminarse y dos tipos de explicación que sí podrían conservarse.

## Ejercicio 8. Diseña un punto de recuperación

Describe una secuencia segura para:

1. revisar el estado del repositorio;
2. crear un checkpoint sin incluir secretos;
3. permitir una modificación de dos archivos;
4. revisar el diff;
5. ejecutar pruebas;
6. aceptar o revertir.

Incluye comandos de Git o un sistema de versiones numeradas si todavía no utilizas Git.

---

## Rúbrica de los ejercicios

| Criterio global | Puntos |
|---|---:|
| Completa los ocho ejercicios | 4 |
| Define contratos, alcance y evidencia | 3 |
| Distingue diseño, refactorización y funcionalidad | 3 |
| Revisa dependencias y diffs con criterio | 3 |
| Justifica decisiones y recuperación | 2 |
| **Total** | **15** |

Para aprobar necesitas:

- obtener al menos `80/100`;
- aprobar el proyecto principal;
- entregar todos los archivos obligatorios;
- corregir cualquier fallo crítico;
- demostrar comprensión del código y los diffs;
- registrar con honestidad el uso de IA.

No continúes al Módulo 4 hasta que esta entrega figure como aprobada.

---

<!-- coa-activity:programacion-ia-m3-ejercicios-obligatorios -->

# Reto adicional opcional

Pide dos implementaciones del mismo contrato:

- una orientada a funciones;
- otra orientada a una clase.

Ejecuta los mismos casos y compara:

- claridad;
- cantidad de piezas;
- estado;
- efectos secundarios;
- facilidad de prueba;
- cambio que justificaría cada diseño.

No elijas automáticamente la alternativa con menos líneas.

---

# Mini proyecto. Intérprete técnico de código desconocido

**Tiempo recomendado:** 30 minutos  
**Valor:** 20 puntos

## Objetivo

Analizarás un archivo que no escribiste. Utilizarás IA para construir una explicación inicial, pero tendrás que verificarla mediante lectura y ejecución.

## Selecciona una versión

En los materiales descargables encontrarás el mismo comportamiento en:

- Python;
- JavaScript;
- Java;
- C#;
- C++.

Elige únicamente la versión que puedas ejecutar. No necesitas estudiar los otros lenguajes.

El archivo procesa registros de trabajo. Cada registro contiene:

- identificador;
- estado activo o inactivo;
- cantidad de horas;
- tarifa por hora;
- categoría.

No recibirás una explicación previa del algoritmo. Debes descubrir qué hace realmente.

## Restricción inicial

No solicites una refactorización en el primer mensaje. Primero debes comprender y comprobar el comportamiento actual.

## Fase 1. Lectura propia

Sin utilizar IA, completa en `02_mini_proyecto/lectura_inicial.md`:

- propósito probable;
- entradas;
- salida;
- condiciones que omiten registros;
- cálculos identificados;
- datos que el código modifica;
- cinco dudas.

No necesitas acertar todo. Esta lectura permite comparar tu interpretación con evidencia posterior.

## Fase 2. Explicación asistida

Solicita:

```text
Analiza únicamente el archivo adjunto. No lo modifiques.

Devuelve:
1. propósito;
2. entradas y salida;
3. flujo numerado;
4. condiciones límite;
5. efectos secundarios;
6. valores fijos o "mágicos";
7. posibles riesgos;
8. casos necesarios para comprobar la explicación;
9. afirmaciones que no pueden demostrarse solo con este archivo.

Cita nombres concretos del código.
```

Marca cada afirmación como:

- confirmada por el código;
- hipótesis;
- incorrecta;
- pendiente de ejecución.

## Fase 3. Mapa de flujo

Crea un mapa en texto, diagrama o tabla. Debe representar:

- inicio del ciclo;
- registros omitidos;
- cálculo base;
- ajuste por categoría;
- ajuste por horas;
- modificación del registro;
- acumulación;
- cálculo del promedio;
- salida.

Ejemplo de formato:

```text
Registro
   ↓
¿Se procesa?
   ├── No → siguiente registro
   └── Sí
         ↓
      cálculo
         ↓
      ajustes
         ↓
      efecto secundario
         ↓
      acumulación
```

No copies este esquema sin completar las condiciones reales.

## Fase 4. Ejecución

Ejecuta como mínimo estos escenarios:

| ID | Registros |
|---|---|
| CD-01 | Lista vacía |
| CD-02 | Un registro activo, 5 horas, tarifa 20, categoría normal |
| CD-03 | Un registro activo, 10 horas, tarifa 20, categoría normal |
| CD-04 | Un registro activo, 10 horas, tarifa 20, categoría urgente |
| CD-05 | Un registro inactivo válido |
| CD-06 | Un registro activo con 0 horas |
| CD-07 | Un registro activo con tarifa 0 |
| CD-08 | Mezcla de registros válidos, inactivos e inválidos |

Para cada caso registra:

- resultado esperado según tu lectura;
- resultado real;
- cambio observado dentro de los registros;
- conclusión.

## Fase 5. Riesgos

Identifica al menos cinco riesgos. Considera:

- descarte silencioso;
- mutación de entradas;
- orden de ajustes;
- categorías desconocidas;
- redondeo;
- valores fijos;
- datos no numéricos;
- significado de tarifa igual a cero.

No afirmes que algo es un error empresarial si los requisitos no lo confirman. Puedes clasificarlo como decisión no documentada.

## Fase 6. Mejora pequeña

Realiza una refactorización que conserve los resultados de CD-01 a CD-08. Algunas opciones:

- reemplazar porcentajes mágicos por constantes con nombre;
- mejorar nombres internos;
- extraer el cálculo de un registro;
- separar el cálculo del resumen;
- agregar documentación a una decisión no evidente.

No cambies simultáneamente el tratamiento de registros inválidos ni elimines el efecto secundario. Esos cambios alterarían el comportamiento y necesitarían requisitos nuevos.

Revisa el diff y vuelve a ejecutar los ocho casos.

## Entregables

```text
02_mini_proyecto/
├── codigo_original/
├── lectura_inicial.md
├── explicacion_verificada.md
├── mapa_flujo.md
├── casos_ejecutados.md
├── riesgos.md
├── codigo_refactorizado/
└── diff_y_decision.md
```

## Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Lectura propia antes de solicitar cambios | 2 |
| Explicación completa y vinculada al código | 4 |
| Mapa de flujo correcto | 3 |
| Ejecución de CD-01 a CD-08 | 4 |
| Riesgos diferenciados de requisitos no confirmados | 3 |
| Refactorización pequeña con regresión aprobada | 3 |
| Organización y claridad | 1 |
| **Total** | **20** |

---


<!-- coa-activity:programacion-ia-m3-mini-proyecto -->

# Proyecto del módulo. Gestor de solicitudes de soporte

**Tiempo recomendado:** 50 minutos  
**Valor:** 50 puntos

## Contexto

Una empresa necesita registrar solicitudes de soporte, asignar prioridad según impacto y urgencia, controlar cambios de estado y consultar un resumen operativo.

Construirás una aplicación pequeña y organizada. La interfaz puede ser una demostración por consola o un conjunto de casos ejecutables. La lógica no debe depender de la entrada por teclado para poder probarla.

## Modelo de una solicitud

Cada solicitud contiene:

- identificador único;
- nombre de la persona solicitante;
- asunto;
- descripción;
- impacto;
- urgencia;
- prioridad calculada;
- estado;
- fecha y hora de creación.

## Valores permitidos

### Impacto y urgencia

```text
bajo
medio
alto
```

### Prioridad

```text
baja
media
alta
crítica
```

### Estado

```text
abierta
en_progreso
resuelta
cerrada
cancelada
```

## Reglas de validación

1. El nombre de la persona solicitante es obligatorio.
2. El asunto es obligatorio y debe contener entre `5` y `80` caracteres después de eliminar espacios exteriores.
3. La descripción debe contener entre `10` y `500` caracteres.
4. Impacto y urgencia deben pertenecer a los valores permitidos.
5. Los datos inválidos deben rechazarse con mensajes claros.
6. El identificador se genera dentro del gestor y no puede repetirse.
7. Toda solicitud nueva comienza en estado `abierta`.
8. La prioridad no se introduce manualmente: se calcula.

## Matriz de prioridad

| Impacto | Urgencia | Prioridad |
|---|---|---|
| alto | alto | crítica |
| alto | medio o bajo | alta |
| medio o bajo | alto | alta |
| bajo | bajo | baja |
| cualquier otra combinación | cualquier otra combinación | media |

La última fila cubre `medio/medio`, `medio/bajo` y `bajo/medio`.

## Reglas de cambio de estado

```text
abierta
├── en_progreso
└── cancelada

en_progreso
├── resuelta
└── cancelada

resuelta
├── en_progreso
└── cerrada

cerrada
└── sin transiciones

cancelada
└── sin transiciones
```

Reglas adicionales:

- cambiar al mismo estado se rechaza;
- una transición inválida no modifica la solicitud;
- un identificador inexistente produce un error controlado;
- reabrir una solicitud resuelta hacia `en_progreso` está permitido;
- una solicitud cerrada o cancelada es final.

## Operaciones obligatorias

La solución debe permitir:

1. crear una solicitud;
2. consultar una solicitud por identificador;
3. cambiar su estado mediante las reglas;
4. listar todas las solicitudes;
5. filtrar por estado;
6. filtrar por prioridad;
7. buscar texto parcial en asunto o descripción sin distinguir mayúsculas;
8. generar un resumen con:
   - total;
   - cantidad por estado;
   - cantidad por prioridad;
9. guardar las solicitudes;
10. cargar las solicitudes guardadas.

No se requiere eliminar solicitudes.

## Persistencia

Utiliza un archivo local y herramientas disponibles en la biblioteca estándar de tu lenguaje.

- Opción preferida: JSON si tu biblioteca estándar lo admite.
- Alternativa: formato de texto estructurado y documentado.

Debes conservar:

- identificadores;
- estados;
- prioridades;
- fecha de creación;
- siguiente identificador disponible.

Si el archivo todavía no existe, el gestor debe iniciar vacío sin fallar.

Si el archivo contiene datos dañados, debe producir un error controlado. No debe reemplazar silenciosamente el archivo con una lista vacía.

No utilices base de datos, servicio externo ni dependencia de serialización de terceros.

## Diseño mínimo recomendado

Puedes adaptar los nombres a tu lenguaje:

```text
Solicitud
├── datos de una solicitud
└── conversión hacia/desde almacenamiento

GestorSolicitudes
├── crear
├── consultar
├── cambiar estado
├── filtrar
├── buscar
└── resumir

AlmacenamientoArchivo
├── guardar
└── cargar
```

Una organización por funciones o módulos equivalentes también es válida si separa las mismas responsabilidades.

No agregues repositorios genéricos, inyección de dependencias, eventos, fábricas ni capas adicionales sin una necesidad demostrable.

## Casos obligatorios

### Creación y prioridad

| ID | Situación | Resultado esperado |
|---|---|---|
| GS-01 | Impacto alto, urgencia alta | Prioridad crítica, estado abierta |
| GS-02 | Impacto alto, urgencia baja | Prioridad alta |
| GS-03 | Impacto bajo, urgencia alta | Prioridad alta |
| GS-04 | Impacto bajo, urgencia baja | Prioridad baja |
| GS-05 | Impacto medio, urgencia medio | Prioridad media |
| GS-06 | Asunto de 4 caracteres | Rechazado |
| GS-07 | Descripción de 9 caracteres | Rechazado |
| GS-08 | Impacto desconocido | Rechazado |

### Estados

| ID | Situación | Resultado esperado |
|---|---|---|
| GS-09 | abierta → en_progreso | Aceptado |
| GS-10 | abierta → resuelta | Rechazado, estado sin cambio |
| GS-11 | en_progreso → resuelta → cerrada | Aceptado |
| GS-12 | resuelta → en_progreso | Aceptado |
| GS-13 | cerrada → en_progreso | Rechazado |
| GS-14 | cancelada → abierta | Rechazado |
| GS-15 | identificador inexistente | Error controlado |

### Consulta y persistencia

| ID | Situación | Resultado esperado |
|---|---|---|
| GS-16 | Filtrar por prioridad alta | Solo solicitudes correspondientes |
| GS-17 | Buscar una palabra con mayúsculas distintas | Coincidencia sin distinguir mayúsculas |
| GS-18 | Resumen de una colección conocida | Conteos exactos |
| GS-19 | Guardar y cargar | Datos equivalentes |
| GS-20 | Archivo inexistente | Colección vacía controlada |
| GS-21 | Archivo dañado | Error controlado, archivo no sobrescrito |

## Fase 1. Requisitos y contratos

Crea:

```text
03_proyecto/01_requisitos.md
03_proyecto/02_contratos.md
```

Los contratos deben describir las operaciones públicas sin obligarte a una sintaxis específica antes de elegir el diseño.

Incluye:

- entradas;
- salidas;
- errores;
- efectos secundarios;
- reglas de prioridad;
- transiciones;
- persistencia;
- exclusiones.

## Fase 2. Plan y estructura

Solicita dos estructuras mínimas y compáralas. Elige una según:

- responsabilidades claras;
- facilidad de prueba;
- cantidad de archivos;
- compatibilidad con tu lenguaje;
- facilidad de cambiar el almacenamiento.

Registra una alternativa rechazada.

Antes de implementar, crea un repositorio Git o una carpeta `versiones`.

## Fase 3. Componente manual obligatorio

Implementa manualmente la función que calcula la prioridad.

Puedes utilizar IA para:

- revisar la matriz;
- proponer casos;
- señalar combinaciones faltantes.

No copies una implementación generada. Escribe el código a partir de la tabla y explica cada condición en `03_decision_manual.md`.

Ejecuta GS-01 a GS-05 antes de continuar.

## Fase 4. Modelo y creación

Utiliza IA para proponer el modelo y la validación. Revisa:

- normalización de espacios;
- límites exactos `5`, `80`, `10` y `500`;
- identificadores;
- estado inicial;
- fecha;
- ausencia de campos inventados.

Integra únicamente la propuesta aprobada y ejecuta GS-01 a GS-08.

## Fase 5. Transiciones

Solicita primero una representación de la tabla de transiciones. Después pide el cambio de estado como una tarea separada.

Comprueba que:

- valida antes de modificar;
- no acepta el mismo estado;
- no altera una solicitud cuando falla;
- permite reapertura desde `resuelta`;
- bloquea estados finales.

Ejecuta GS-09 a GS-15.

## Fase 6. Consultas y resumen

Implementa por separado:

- consulta por identificador;
- filtros;
- búsqueda textual;
- resumen.

No generes un CRUD completo. No existe eliminación definitiva.

Ejecuta GS-16 a GS-18.

## Fase 7. Persistencia

Solicita una propuesta compatible con la biblioteca estándar de tu lenguaje. Antes de integrarla, verifica en documentación oficial las funciones utilizadas.

Separa:

- convertir datos;
- escribir archivo;
- leer archivo;
- controlar archivo inexistente;
- controlar contenido dañado.

Ejecuta GS-19 a GS-21 sobre datos ficticios dentro de una carpeta de prueba.

## Fase 8. Refactorización controlada

Elige un único objetivo:

- reducir duplicación de validaciones;
- extraer el cálculo del resumen;
- mejorar nombres internos;
- separar conversión y escritura;
- reducir una función extensa.

Antes de modificar:

1. ejecuta GS-01 a GS-21;
2. crea un commit o copia;
3. solicita un diff mínimo;
4. revisa cada línea;
5. aplica únicamente lo aprobado;
6. vuelve a ejecutar GS-01 a GS-21.

Si cambia un resultado, revierte y analiza la causa.

## Fase 9. Documentación

Incluye:

- propósito del proyecto;
- versión del lenguaje;
- estructura;
- instrucciones de ejecución;
- instrucciones de pruebas;
- formato del archivo de datos;
- decisiones principales;
- limitaciones;
- uso de IA;
- recuperación ante archivo dañado.

No agregues comentarios obvios a cada línea.

## Estructura sugerida de la entrega

```text
03_proyecto/
├── 01_requisitos.md
├── 02_contratos.md
├── 03_decision_manual.md
├── 04_arquitectura.md
├── 05_casos_prueba.md
├── 06_decisiones.md
├── 07_diffs.md
├── 08_bitacora_ia.md
├── codigo/
├── pruebas/
├── datos_prueba/
├── evidencias/
└── README.md
```

## Entregable de Git

Entrega el repositorio dentro del `.zip`. El historial recomendado incluye al menos:

```text
1. Estructura y contratos iniciales
2. Agrega cálculo manual de prioridad
3. Implementa solicitudes y validación
4. Agrega transiciones de estado
5. Agrega consultas y resumen
6. Agrega persistencia local
7. Refactoriza sin cambiar comportamiento
```

No es obligatorio utilizar esos mensajes exactos. Cada commit debe representar un estado coherente.

## Criterios de aceptación

- La solución supera GS-01 a GS-21.
- El código está dividido por responsabilidades reales.
- La prioridad fue implementada manualmente.
- No existe eliminación definitiva.
- Las transiciones protegen estados finales.
- El almacenamiento usa herramientas estándar.
- Un archivo dañado no se sobrescribe silenciosamente.
- Existe evidencia antes y después de la refactorización.
- Los diffs importantes fueron revisados.
- El historial o las versiones permiten recuperar el trabajo.
- No hay credenciales ni datos personales reales.
- Puedes explicar cada componente.

## Fuera del alcance

No agregues:

- interfaz web;
- aplicación móvil;
- base de datos;
- autenticación;
- envío de correos;
- archivos adjuntos;
- panel gráfico;
- API;
- integración con servicios reales;
- biblioteca externa de persistencia;
- eliminación definitiva.

---

# Rúbrica del proyecto del módulo

| Criterio | Evidencia esperada | Puntos |
|---|---|---:|
| Requisitos y contratos | Entradas, salidas, errores, efectos y exclusiones | 5 |
| Diseño proporcional | Responsabilidades claras sin capas injustificadas | 5 |
| Creación y validación | GS-01 a GS-08 | 6 |
| Prioridad manual | Matriz correcta, explicación y pruebas | 5 |
| Transiciones | GS-09 a GS-15 sin mutaciones inválidas | 6 |
| Consultas y resumen | GS-16 a GS-18 | 4 |
| Persistencia segura | GS-19 a GS-21 y formato documentado | 5 |
| Refactorización y regresión | Diff limitado y resultados conservados | 5 |
| Uso de IA y decisiones | Prompts, propuestas aceptadas/rechazadas y bitácora | 4 |
| Git o versiones | Puntos recuperables y cambios comprensibles | 3 |
| Documentación y dominio | README real, organización y código explicable | 2 |
| **Total** |  | **50** |

## Fallos críticos

El proyecto requiere corrección aunque alcance el puntaje mínimo si:

- no puede ejecutarse;
- falta el código fuente;
- una transición inválida modifica el estado;
- la prioridad crítica se calcula incorrectamente;
- se pierden o sobrescriben silenciosamente datos dañados;
- una refactorización rompe casos anteriores;
- se incluye información sensible;
- se presentan pruebas no ejecutadas como evidencia;
- no puedes explicar el componente principal;
- todo el proyecto fue copiado sin integración ni revisión demostrable.

---

# Evaluación práctica del módulo

**Tiempo recomendado:** 15 minutos  
**Valor:** 15 puntos

## Situación

Una IA afirma haber realizado “únicamente una refactorización” del cambio de estado:

```diff
- transiciones = {
-   "abierta": ["en_progreso", "cancelada"],
-   "en_progreso": ["resuelta", "cancelada"],
-   "resuelta": ["en_progreso", "cerrada"],
-   "cerrada": [],
-   "cancelada": []
- }
-
- si id no existe:
-     devolver error("Solicitud inexistente")
-
- estado_actual = solicitudes[id].estado
- si nuevo_estado no está en transiciones[estado_actual]:
-     devolver error("Transición inválida")
-
- solicitudes[id].estado = nuevo_estado
- devolver éxito
+ importar PaqueteEstadosInteligentes
+
+ intentar:
+     solicitudes[id].estado = nuevo_estado
+     guardar_todo()
+     devolver solicitudes[id]
+ excepto cualquier_error:
+     devolver nulo
```

## Tareas

1. Decide si es una refactorización o un cambio de comportamiento.
2. Identifica al menos siete riesgos o modificaciones.
3. Señala la dependencia nueva y explica qué evidencia exigirías antes de aceptarla.
4. Enumera los contratos que dejaron de conservarse.
5. Diseña seis pruebas de regresión capaces de revelar los problemas.
6. Escribe una solicitud para recuperar el cambio mínimo sin dependencia.
7. Indica qué revisarías en el diff resultante.
8. Elige entre aceptar, corregir o revertir y justifica con evidencia.

No necesitas implementar el código. Debes demostrar que puedes revisar una propuesta antes de integrarla.

## Rúbrica de la evaluación

| Criterio | Puntos |
|---|---:|
| Distingue refactorización y cambio funcional | 2 |
| Identifica riesgos y contratos rotos | 4 |
| Evalúa la dependencia de forma profesional | 2 |
| Diseña pruebas de regresión relevantes | 3 |
| Solicita una corrección limitada | 2 |
| Decide con base en el diff y la evidencia | 2 |
| **Total** | **15** |

---


<!-- coa-activity:programacion-ia-m3-proyecto -->

# Calificación del módulo

| Evidencia | Valor |
|---|---:|
| Ejercicios obligatorios | 15 puntos |
| Mini proyecto | 20 puntos |
| Proyecto del módulo | 50 puntos |
| Evaluación práctica | 15 puntos |
| **Total** | **100 puntos** |

# Errores frecuentes

## Pedir código antes de definir el contrato

La respuesta puede ser válida para un problema distinto. Define la frontera primero.

## Aceptar una estructura por parecer profesional

Más capas no equivalen a más calidad. Cada pieza debe justificar una responsabilidad.

## Integrar un archivo completo

Reemplazar el archivo puede eliminar validaciones, documentación o cambios propios. Revisa un diff limitado.

## Confundir refactorización y nueva funcionalidad

Si cambia la salida o una regla, necesitas criterios nuevos y pruebas específicas.

## Ejecutar solo las pruebas nuevas

Los casos anteriores detectan regresiones. Ejecútalos después de cualquier modificación.

## Confiar en una dependencia sugerida

Verifica existencia, licencia, versión, mantenimiento y necesidad antes de instalar.

## Ocultar errores

Capturar cualquier error y devolver un valor vacío destruye evidencia. Controla únicamente errores comprendidos.

## Agregar comentarios obvios

La documentación debe explicar contratos o decisiones, no traducir cada línea.

## Revertir sin revisar

Un comando de restauración puede descartar trabajo propio. Examina la ruta y el diff antes de usarlo.

---

# Recomendaciones para completar el módulo

- Confirma la versión del lenguaje antes de pedir código.
- Crea un punto recuperable antes de cada cambio relevante.
- Solicita una función o responsabilidad por vez.
- Lee la respuesta antes de aplicarla.
- Mantén las pruebas cercanas al contrato.
- Separa correcciones, refactorizaciones y nuevas funciones.
- Rechaza patrones que no resuelvan una necesidad actual.
- Consulta documentación oficial antes de aceptar una API o dependencia.
- Revisa el diff en alcance, comportamiento y riesgo.
- Registra también las propuestas descartadas.
- Si una herramienta modifica archivos inesperados, detente y vuelve al último punto funcional.

---

# Videos recomendados

Las funciones y pantallas de los asistentes cambian con frecuencia. Utiliza los videos para observar flujos de trabajo y conserva la revisión manual como regla principal.

## 1. Refactorización con GitHub Copilot Edits y asistentes en VS Code

**Canal:** Latino NET Online  
[Potencia tu código: refactoriza y mejora con GitHub Copilot Edits y agentes en VS Code](https://www.youtube.com/watch?v=IWJkPyp47Cg)

Este webinar muestra cambios asistidos dentro del editor. Observa especialmente el alcance de los cambios y compáralo con el ciclo de diff, pruebas y recuperación del módulo.

## 2. Por qué se refactoriza el código

**Canal:** hdeleon.net  
[¿Por qué se refactoriza el código?](https://www.youtube.com/watch?v=RY1yY7nXjt0)

Utilízalo para distinguir mejoras internas de nuevas funcionalidades. Una refactorización debe conservar el comportamiento comprobado.

## 3. Git diff en cinco minutos

**Canal:** OpenWebinars  
[Git diff: aprende a usar diff con Git](https://www.youtube.com/watch?v=xB78eliu1w4)

Aunque la interfaz de una herramienta de IA cambie, `git diff` continúa siendo una forma directa de inspeccionar las líneas modificadas.

---

# Documentación oficial y recursos confiables

## Desarrollo asistido y revisión

- [Procedimientos recomendados para usar GitHub Copilot](https://docs.github.com/es/copilot/using-github-copilot/best-practices-for-using-github-copilot)
- [Uso responsable de las sugerencias de código de GitHub Copilot](https://docs.github.com/es/copilot/responsible-use/copilot-code-completion)
- [Revisión de código con GitHub Copilot](https://docs.github.com/es/copilot/how-tos/use-copilot-agents/request-a-code-review)
- [Mejores prácticas de prompts para ChatGPT](https://help.openai.com/es-419/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

Las características de revisión automática pueden depender del plan y del entorno. No necesitas utilizarlas: puedes pedir una revisión en un chat y comprobar manualmente cada hallazgo.

## Git

- [Documentación oficial de git diff](https://git-scm.com/docs/git-diff)
- [Documentación oficial de git status](https://git-scm.com/docs/git-status)
- [Documentación oficial de git commit](https://git-scm.com/docs/git-commit)
- [Documentación oficial de git restore](https://git-scm.com/docs/git-restore)
- [Hoja de referencia oficial de Git](https://git-scm.com/cheat-sheet.pdf)

Antes de utilizar `git restore`, lee qué cambios descartará y limita el comando a una ruta verificada.

## Lenguaje y biblioteca estándar

Consulta la documentación oficial de tu lenguaje para confirmar:

- serialización disponible;
- lectura y escritura de archivos;
- fecha y hora;
- pruebas;
- versión de cada función utilizada.

- [Python](https://docs.python.org/es/3/)
- [JavaScript — MDN](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [Java](https://docs.oracle.com/en/java/)
- [C#](https://learn.microsoft.com/es-es/dotnet/csharp/)

Si utilizas C++ u otro lenguaje, consulta el sitio oficial o la documentación mantenida por el proyecto.

---

# Material complementario

[Descargar todos los materiales del Módulo 3](/downloads/programacion-ia/modulo-3/programacion-ia-modulo-3-materiales.zip)

[Descargar carpeta codigo_desconocido](/downloads/programacion-ia/modulo-3/codigo_desconocido.zip)

[Descargar MAPA_TECNICO_CODIGO.md](/downloads/programacion-ia/modulo-3/MAPA_TECNICO_CODIGO.md)

[Descargar CHECKLIST_DIFF_DEPENDENCIAS.md](/downloads/programacion-ia/modulo-3/CHECKLIST_DIFF_DEPENDENCIAS.md)

[Descargar MATRIZ_PRUEBAS_GESTOR.md](/downloads/programacion-ia/modulo-3/MATRIZ_PRUEBAS_GESTOR.md)

[Descargar REGISTRO_CAMBIOS_ASISTIDOS.md](/downloads/programacion-ia/modulo-3/REGISTRO_CAMBIOS_ASISTIDOS.md)

Este módulo incluye:

1. cinco versiones del archivo desconocido para el mini proyecto;
2. plantilla de mapa técnico de código;
3. checklist para revisar diffs y dependencias;
4. matriz de pruebas del gestor de solicitudes;
5. plantilla de registro de cambios asistidos.

Los archivos se encuentran en `materiales_programacion_ia_modulo_3`.

No se requiere un PDF adicional.

---

# Glosario

**Contrato:** definición observable de entradas, salidas, errores y efectos de una unidad de código.

**Invariante:** condición que debe mantenerse válida durante la vida de un objeto.

**Sobrearquitectura:** estructura más compleja de lo que justifican los requisitos actuales.

**Integración:** incorporación de un cambio dentro de un proyecto existente.

**Efecto secundario:** modificación de estado externo además del valor devuelto.

**CRUD:** operaciones de crear, consultar, actualizar y eliminar.

**Refactorización:** cambio de estructura interna que conserva el comportamiento observable.

**Prueba de caracterización:** caso que registra el comportamiento actual para detectar modificaciones involuntarias.

**Regresión:** fallo en una capacidad que funcionaba antes de un cambio.

**Extracción de función:** traslado de una responsabilidad a una función con nombre y frontera propios.

**Duplicación accidental:** lógica repetida que representa la misma regla y cambia por la misma razón.

**Dependencia:** componente externo requerido para ejecutar una parte del proyecto.

**Diff:** representación de las líneas agregadas, eliminadas y modificadas.

**Checkpoint:** estado recuperable creado antes de una modificación.

**Commit:** registro de un conjunto coherente de cambios en Git.

**Revertir:** volver a un estado anterior o descartar una propuesta no aceptada.

**Persistencia:** conservación de datos más allá de la ejecución actual.

**Estado final:** estado que no permite transiciones posteriores.

---

# Resumen del módulo

La IA puede acelerar la implementación, pero cada propuesta debe entrar al proyecto mediante un proceso controlado:

```text
Contrato
  ↓
Casos
  ↓
Cambio pequeño
  ↓
Lectura
  ↓
Integración
  ↓
Pruebas
  ↓
Diff
  ↓
Aceptar, corregir o revertir
```

Durante la construcción debes:

- elegir estructuras proporcionales;
- confirmar compatibilidad;
- comprender código desconocido antes de modificarlo;
- separar refactorización y funcionalidad;
- revisar dependencias;
- conservar interfaces;
- ejecutar regresión;
- crear puntos de recuperación;
- documentar decisiones y no líneas obvias.

La velocidad es útil únicamente cuando el resultado sigue siendo comprensible, comprobable y recuperable.

---

# Checklist antes de entregar

## Ejercicios

- [ ] Completé los ocho ejercicios.
- [ ] Diferencié refactorización y cambio funcional.
- [ ] Revisé un diff y una dependencia.

## Mini proyecto

- [ ] Elegí una versión que puedo ejecutar.
- [ ] Realicé una lectura propia antes de solicitar cambios.
- [ ] Verifiqué la explicación con código y ejecución.
- [ ] Ejecuté CD-01 a CD-08.
- [ ] Identifiqué riesgos sin inventar requisitos.
- [ ] Refactoricé una parte pequeña.
- [ ] Las pruebas anteriores continúan pasando.

## Proyecto principal

- [ ] Definí requisitos y contratos.
- [ ] Elegí una estructura proporcional.
- [ ] Implementé manualmente la prioridad.
- [ ] Ejecuté GS-01 a GS-21.
- [ ] Las transiciones inválidas no modifican el estado.
- [ ] El archivo dañado produce un error controlado.
- [ ] Realicé una refactorización con regresión.
- [ ] Revisé los diffs importantes.
- [ ] Conservé un historial Git o versiones recuperables.
- [ ] El README coincide con el código.

## Seguridad y dominio

- [ ] No incluí secretos ni datos personales reales.
- [ ] Puedo explicar cada componente.
- [ ] Diferencié código sugerido, código manual y resultado ejecutado.
- [ ] Registré propuestas rechazadas.

## Evaluación y archivo

- [ ] Resolví la evaluación práctica.
- [ ] El proyecto se ejecuta desde la copia final.
- [ ] El `.zip` abre correctamente.

---

# Entrega de la actividad

Utiliza un único punto de entrega para todo el Módulo 3.

## Qué debes entregar

- ocho ejercicios obligatorios;
- análisis del código desconocido;
- mapa de flujo;
- casos CD-01 a CD-08;
- refactorización y diff del mini proyecto;
- requisitos y contratos del gestor;
- código fuente y pruebas;
- casos GS-01 a GS-21;
- evidencia del componente manual;
- arquitectura;
- persistencia y datos ficticios;
- diffs relevantes;
- historial Git o versiones;
- README;
- bitácora de uso de IA;
- evaluación práctica.

## Estructura recomendada

```text
COA_IA_M3_Nombre_Apellido/
├── 01_ejercicios/
│   └── ejercicios.md
├── 02_mini_proyecto/
│   ├── codigo_original/
│   ├── lectura_inicial.md
│   ├── explicacion_verificada.md
│   ├── mapa_flujo.md
│   ├── casos_ejecutados.md
│   ├── riesgos.md
│   ├── codigo_refactorizado/
│   └── diff_y_decision.md
├── 03_proyecto/
│   ├── 01_requisitos.md
│   ├── 02_contratos.md
│   ├── 03_decision_manual.md
│   ├── 04_arquitectura.md
│   ├── 05_casos_prueba.md
│   ├── 06_decisiones.md
│   ├── 07_diffs.md
│   ├── 08_bitacora_ia.md
│   ├── codigo/
│   ├── pruebas/
│   ├── datos_prueba/
│   ├── evidencias/
│   └── README.md
└── 04_evaluacion/
    └── evaluacion_modulo_3.md
```

## Formato

- Comprime la carpeta en `.zip`.
- Incluye el repositorio `.git` si utilizaste Git y el tamaño es razonable.
- Incluye código fuente, no únicamente capturas.
- Utiliza `.md`, `.txt` o `.pdf` para documentos.
- Utiliza `.png`, `.jpg` o `.pdf` para evidencias.
- No incluyas entornos virtuales, dependencias instaladas, binarios, credenciales ni datos reales.

## Nombre del archivo

```text
COA_IA_M3_Nombre_Apellido.zip
```

Ejemplo:

```text
COA_IA_M3_Lucia_Vargas.zip
```

## Antes de enviar

1. Descomprime una copia.
2. Ejecuta el mini proyecto y el gestor desde esa copia.
3. Ejecuta los casos obligatorios.
4. Comprueba que el archivo de datos incluido es ficticio.
5. Revisa que no existan credenciales.
6. Confirma que los diffs y evidencias son legibles.
7. Envía el archivo mediante el botón **Enviar actividad**.

[Entregar Módulo 3](https://forms.gle/nTx97JRkFkbH5Vfr6)

Si necesitas presentar una corrección, conserva la estructura y agrega la versión:

```text
COA_IA_M3_Nombre_Apellido_v2.zip
```

---

# Habilidades obtenidas

Al aprobar este módulo podrás:

- generar funciones desde contratos;
- diseñar clases y estructuras proporcionales;
- integrar código en proyectos existentes;
- comprender archivos que no escribiste;
- construir operaciones de negocio sin generar CRUD innecesario;
- documentar contratos y decisiones;
- refactorizar sin alterar resultados;
- revisar dependencias;
- utilizar asistentes dentro del editor con límites;
- leer diffs en busca de cambios inesperados;
- crear puntos de recuperación;
- aceptar, corregir o revertir propuestas;
- desarrollar una aplicación pequeña mediante un ciclo continuo de implementación y prueba.

En el siguiente módulo utilizarás esta base para diagnosticar errores, trabajar con tracebacks y validar hipótesis de depuración producidas por IA.
