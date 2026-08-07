# Módulo 2. Prompts y conversaciones técnicas para programar

**Curso:** Programación Asistida por Inteligencia Artificial  
**Duración estimada:** 3 horas  
**Modalidad:** Autodidacta  
**Nivel:** Intermedio  
**Proyecto del módulo:** Cotizador de servicios construido mediante conversación estructurada  
**Lenguaje:** El lenguaje de programación que ya conoces

---

# Introducción

Un prompt técnico no es una frase mágica. Es una especificación de trabajo.

Cuando una solicitud solamente dice:

> Crea un programa para una empresa.

la herramienta necesita completar demasiada información por su cuenta. Puede inventar usuarios, reglas, tecnologías, archivos y comportamientos que nunca solicitaste.

Cuando la solicitud contiene un objetivo, contexto suficiente, restricciones y criterios comprobables, la respuesta puede evaluarse con mayor precisión.

```text
Solicitud vaga
      ↓
Suposiciones invisibles
      ↓
Resultado difícil de revisar
```

```text
Problema definido
      ↓
Preguntas de aclaración
      ↓
Plan aprobado
      ↓
Cambio pequeño
      ↓
Prueba
      ↓
Siguiente cambio
```

El mayor valor de este módulo no será aprender a escribir un mensaje largo. Será aprender a sostener una conversación de desarrollo en la que cada etapa tenga un propósito, un alcance y una forma de verificación.

Al finalizar, podrás construir un programa mediante varias decisiones controladas sin pedirlo todo en una sola respuesta.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- transformar una idea general en una tarea técnica;
- escribir prompts con objetivo, contexto, entorno, entradas, salidas y restricciones;
- convertir reglas en criterios de aceptación verificables;
- diferenciar solicitudes de explicación, planificación, implementación, modificación, revisión y pruebas;
- pedir preguntas de aclaración antes de generar código;
- dividir un problema grande en etapas pequeñas;
- controlar el alcance de una conversación;
- proporcionar ejemplos positivos y negativos;
- compartir un fragmento mínimo reproducible;
- pedir cambios mínimos sin reescribir todo el proyecto;
- conservar interfaces y comportamientos existentes;
- recuperar una conversación que se desvió;
- resumir decisiones para iniciar una nueva sesión;
- preparar un paquete de contexto seguro;
- crear plantillas de prompts que puedan adaptarse;
- registrar propuestas aceptadas, corregidas y descartadas.

---

# Conocimientos previos

Antes de comenzar debes poder:

- leer y modificar código en un lenguaje;
- ejecutar un programa sencillo;
- diseñar casos normales, límite e inválidos;
- reconocer información que no debe compartirse;
- aplicar el flujo del Módulo 1:

```text
Analizar → preguntar → leer → ejecutar → probar → decidir
```

---

# Preparación

Necesitas:

- un editor o IDE;
- un asistente conversacional;
- un lenguaje que ya conozcas;
- una carpeta llamada `coa_ia_modulo_2`;
- la plantilla de bitácora del Módulo 1;
- un chat nuevo para el proyecto principal.

Puedes completar todo con una cuenta gratuita. No necesitas utilizar varias herramientas ni comprar una suscripción.

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

Los videos y lecturas complementarias son opcionales y no están incluidos en este cálculo.

---

# 1. Un prompt técnico es un contrato de trabajo provisional

Un prompt técnico describe una tarea que todavía puede necesitar aclaraciones. No reemplaza los requisitos del proyecto, pero permite convertirlos en una interacción controlada.

Compara:

## Petición abierta

```text
Haz un gestor de clientes.
```

No define:

- lenguaje;
- datos;
- acciones permitidas;
- almacenamiento;
- validaciones;
- formato de salida;
- alcance;
- forma de comprobar el resultado.

## Petición técnica

```text
Objetivo
Implementar una función que valide los datos de un cliente nuevo.

Entorno
JavaScript ES2022, sin bibliotecas externas.

Entradas
Un objeto con nombre, correo y edad.

Reglas
- nombre no vacío después de eliminar espacios exteriores;
- correo debe contener una estructura válida según la regla simplificada indicada;
- edad debe ser un entero entre 18 y 120;
- acumular todos los errores, no detenerse en el primero.

Salida
Un objeto con `esValido` y `errores`.

Alcance
No guardar datos, no crear interfaz y no enviar correos.

Criterios de aceptación
- un cliente válido devuelve `esValido: true` y una lista vacía;
- un cliente con tres campos inválidos devuelve tres mensajes;
- la función no modifica el objeto recibido.

Antes de escribir código, enumera cualquier ambigüedad que todavía detectes.
```

La segunda solicitud no garantiza una solución correcta. Sí permite localizar con facilidad aquello que la respuesta cumple o incumple.

---

# 2. Anatomía de un prompt técnico

No todos los prompts necesitan todas las secciones. Utiliza las que reduzcan una ambigüedad real.

## 2.1 Objetivo

Describe una sola meta observable.

```text
Implementar una función que calcule el total de una reserva.
```

Evita mezclar objetivos:

```text
Crea el sistema, optimízalo, documenta todo, agrega seguridad,
haz una interfaz y conviértelo en aplicación móvil.
```

## 2.2 Contexto

Explica lo mínimo que permite comprender la tarea.

```text
La función forma parte de una aplicación existente. El importe base ya fue
validado por otra capa. Esta función únicamente aplica una tarifa de servicio.
```

El contexto útil cambia decisiones. Una historia extensa sobre la empresa normalmente no lo hace.

## 2.3 Entorno

Indica aquello que puede afectar la compatibilidad:

- lenguaje y versión;
- framework o biblioteca relevante;
- sistema operativo, si importa;
- estructura existente;
- restricciones de instalación.

```text
Python 3.12. Solo biblioteca estándar. Las pruebas se ejecutan con unittest.
```

No inventes una versión. Si no la conoces, escribe “versión no confirmada” y compruébala antes de integrar la respuesta.

## 2.4 Entradas y salidas

Una tarea es más fácil de comprobar cuando define su frontera.

```text
Entrada: lista de enteros.
Salida: un nuevo objeto con cantidad, suma y promedio.
La lista original no debe modificarse.
```

## 2.5 Reglas

Las reglas describen el comportamiento.

```text
- una lista vacía es inválida;
- los valores negativos están permitidos;
- los valores no numéricos se rechazan;
- el promedio se redondea a dos decimales.
```

## 2.6 Restricciones

Una restricción limita la forma de resolver.

```text
- no usar bibliotecas externas;
- no modificar el nombre ni los parámetros de la función;
- no realizar entrada o salida por consola;
- no cambiar otros archivos.
```

No escribas únicamente prohibiciones. Cuando sea posible, indica la alternativa esperada:

```text
No ocultes excepciones. Devuelve los errores de validación en la estructura indicada.
```

## 2.7 Ejemplos

Un ejemplo muestra una interpretación concreta.

```text
Entrada: [2, 4, 6]
Salida: {cantidad: 3, suma: 12, promedio: 4.00}
```

Incluye ejemplos negativos cuando una frontera pueda confundirse:

```text
Entrada inválida: []
Resultado: error "La lista no puede estar vacía".
```

Los ejemplos no deben contradecir las reglas. Si existe una contradicción, resuélvela antes de pedir implementación.

## 2.8 Formato de respuesta

Indica qué necesitas recibir en esa etapa.

```text
Devuelve únicamente:
1. preguntas pendientes;
2. supuestos detectados;
3. criterios de aceptación sugeridos.
No escribas código todavía.
```

El formato evita recibir una aplicación completa cuando solo necesitabas aclaraciones.

## 2.9 Criterios de aceptación

Un criterio de aceptación describe una condición observable para considerar terminado el trabajo.

### Regla poco verificable

```text
El código debe ser bueno y profesional.
```

### Criterios verificables

```text
- conserva la firma `calcular_total(items, descuento)`;
- devuelve el mismo resultado para los seis casos existentes;
- rechaza descuentos distintos de 0, 5 y 10;
- no agrega dependencias;
- todas las pruebas anteriores continúan pasando.
```

“Limpio”, “rápido”, “seguro” o “profesional” necesitan una definición aplicable al problema.

---

# 3. La ficha técnica del prompt

Utiliza esta estructura como lista de comprobación, no como texto obligatorio:

```text
OBJETIVO
¿Qué cambio o resultado concreto necesito?

CONTEXTO
¿Qué información modifica la decisión?

ENTORNO
¿En qué lenguaje, versión y estructura se trabajará?

ENTRADAS Y SALIDAS
¿Qué recibe y qué debe producir?

REGLAS
¿Qué comportamiento es obligatorio?

RESTRICCIONES
¿Qué debe conservarse o evitarse?

EJEMPLOS
¿Qué casos eliminan ambigüedades?

FORMATO DE RESPUESTA
¿Necesito preguntas, plan, código, diff, pruebas o revisión?

CRITERIOS DE ACEPTACIÓN
¿Cómo comprobaré que terminó correctamente?
```

## Un prompt no debe ser largo por obligación

Esta solicitud puede ser suficiente:

```text
Explica por qué la condición marcada nunca se ejecuta.
Usa únicamente el fragmento adjunto.
No propongas todavía una reescritura.
Devuelve una explicación de máximo cinco puntos.
```

La longitud correcta es la mínima que elimina ambigüedades importantes.

---

# 4. Seis tipos de solicitud técnica

Separar intenciones mejora el control de la conversación.

## 4.1 Solicitar una explicación

Utilízala para comprender antes de modificar.

```text
Explica el recorrido de los datos en esta función.
Identifica entradas, salidas, efectos secundarios y rutas de error.
No modifiques el código y no supongas el contenido de funciones externas.
```

## 4.2 Solicitar un plan

Utilízala cuando la tarea necesita varias etapas.

```text
Propón un plan de implementación de máximo cinco pasos.
En cada paso indica archivos afectados, resultado comprobable y prueba mínima.
No escribas código.
```

## 4.3 Solicitar código

Utilízala cuando los requisitos y la etapa ya están definidos.

```text
Implementa únicamente el paso 1 aprobado.
No crees archivos adicionales.
Conserva la interfaz indicada y agrega las tres pruebas acordadas.
```

## 4.4 Solicitar una modificación

Utilízala sobre código existente.

```text
Modifica únicamente `validar_cliente` para acumular todos los errores.
Conserva el nombre, los parámetros y la estructura de salida.
Devuelve un diff y explica qué prueba existente protege cada comportamiento.
```

## 4.5 Solicitar una revisión

Utilízala para buscar riesgos sin cambiar todavía.

```text
Revisa este fragmento contra los criterios AC-01 a AC-06.
Clasifica cada criterio como cumplido, incumplido o no demostrable.
Cita la parte del código observada. No propongas una reescritura completa.
```

## 4.6 Solicitar pruebas

Utilízala para ampliar evidencia.

```text
Propón casos normales, de límite e inválidos para estas reglas.
Cada caso debe incluir entrada, resultado esperado y regla protegida.
No inventes comportamientos que no estén definidos; marca las dudas.
```

## Una conversación puede utilizar los seis tipos

```text
Explicar → planificar → implementar → probar → revisar → modificar
```

No es necesario utilizarlos siempre ni en ese orden. Elige según el estado real del trabajo.

---

# 5. Pedir preguntas antes de pedir código

Cuando la idea todavía es incompleta, la primera respuesta útil puede ser una lista de preguntas.

## Plantilla

```text
Tengo esta idea:
[IDEA]

No escribas código.
Haz hasta diez preguntas que sean necesarias para definir:
- entradas y salidas;
- reglas;
- límites;
- datos inválidos;
- compatibilidad;
- criterios de aceptación.

Separa las preguntas bloqueantes de las decisiones opcionales.
No completes la información por tu cuenta.
```

## Pregunta bloqueante

Sin la respuesta no puede implementarse un comportamiento correcto.

> ¿El valor exacto de 100 recibe descuento?

## Decisión opcional

Puede posponerse sin impedir la función principal.

> ¿Quieres que los mensajes utilicen un tono formal?

No todas las preguntas generadas serán necesarias. Elimina las que estén fuera del alcance.

---

# 6. Requisitos, restricciones y criterios de aceptación

Estas tres categorías se confunden con facilidad.

| Categoría | Pregunta | Ejemplo |
|---|---|---|
| Requisito | ¿Qué debe hacer? | Aplicar 5 % desde un subtotal de 100 |
| Restricción | ¿Qué límite debe respetar? | No instalar bibliotecas externas |
| Criterio de aceptación | ¿Cómo sabremos que está bien? | Con subtotal 100, el descuento es 5 |

## Técnica: convierte cada regla en evidencia

Regla:

```text
La cantidad debe ser un entero positivo.
```

Criterios:

```text
- cantidad 1 se acepta;
- cantidad 0 se rechaza;
- cantidad -1 se rechaza;
- cantidad 1.5 se rechaza;
- texto "2" se trata según la decisión explícita sobre conversión.
```

Si no puedes diseñar una prueba, posiblemente la regla todavía sea ambigua.

---

# 7. Ejemplos positivos y negativos

Los ejemplos sirven para mostrar fronteras, no para reemplazar reglas.

## Ejemplo positivo

```text
Entrada: {usuario: "ana", activo: true}
Salida: acceso permitido
```

## Ejemplo negativo

```text
Entrada: {usuario: "", activo: true}
Salida: error "El usuario es obligatorio"
```

## Contraejemplo útil

Si una herramienta interpreta “mayor de edad” de forma distinta a tu dominio, agrega:

```text
Una edad exactamente igual a 18 se acepta.
```

## No sobreajustes el prompt

Una lista enorme de ejemplos puede ocultar las reglas. Utiliza ejemplos en:

- límites;
- formatos difíciles;
- salidas estructuradas;
- interpretaciones que ya causaron errores.

---

# 8. Detectar prompts defectuosos

## Prompt vago

```text
Mejora esto.
```

No indica qué significa mejorar ni qué debe conservarse.

## Prompt excesivo

```text
Analiza, rediseña, reescribe, optimiza, prueba, documenta, despliega y explica
todo el proyecto en una sola respuesta.
```

Mezcla etapas y produce demasiado contenido para revisar.

## Prompt contradictorio

```text
No cambies ninguna función, pero reemplaza todas las funciones.
No agregues dependencias, pero usa la biblioteca X que no está instalada.
Devuelve solo código y explica cada decisión detalladamente.
```

## Prompt con autoridad falsa

```text
Actúa como el mejor programador del mundo y garantiza que no existan errores.
```

Asignar un papel puede orientar el enfoque, pero no crea evidencia ni elimina errores.

## Prompt que pide razonamiento interno completo

No necesitas pedir una transcripción extensa del razonamiento privado de la herramienta. Para revisar una decisión, solicita elementos observables:

```text
Enumera supuestos, alternativas consideradas, riesgos y criterios utilizados.
Devuelve una justificación breve vinculada a los requisitos.
```

## Prompt que delega la decisión

```text
Elige cualquier tecnología y toma todas las decisiones por mí.
```

Pide alternativas y riesgos. Conserva la decisión final.

---

# 9. Dividir un problema grande

Una tarea grande contiene varias decisiones y varios puntos de falla.

## Petición demasiado amplia

```text
Crea un sistema de reservas con usuarios, pagos, correos, reportes y base de datos.
```

## División por capacidades

```text
1. Definir reglas de disponibilidad.
2. Diseñar entradas y salidas de una reserva.
3. Validar fecha, horario y capacidad.
4. Calcular el importe.
5. Registrar la reserva.
6. Notificar el resultado.
7. Crear reportes.
```

## División por riesgo

Empieza por lo que reduce incertidumbre:

```text
1. Resolver reglas ambiguas.
2. Construir casos de aceptación.
3. Diseñar la interfaz de la función.
4. Implementar lógica pura.
5. Probar.
6. Integrar almacenamiento.
7. Integrar servicios externos.
```

## Tamaño correcto de una etapa

Una etapa está bien delimitada cuando:

- tiene un resultado observable;
- afecta pocos archivos;
- puede probarse por separado;
- puede revertirse;
- no necesita resolver varias dudas nuevas al mismo tiempo.

---

# 10. Conversaciones por etapas

Utiliza este ciclo:

```text
1. Aclarar
      ↓
2. Proponer
      ↓
3. Elegir
      ↓
4. Implementar una etapa
      ↓
5. Verificar
      ↓
6. Mejorar o continuar
```

## Etapa 1. Aclarar

Objetivo: descubrir información ausente.

Salida esperada: preguntas, ambigüedades y supuestos.

## Etapa 2. Proponer

Objetivo: conocer alternativas antes de comprometerse.

Salida esperada: dos o tres opciones con ventajas, riesgos y costo de cambio.

## Etapa 3. Elegir

Tú eliges y registras el motivo.

```text
Elijo la alternativa B porque no agrega dependencias, conserva la interfaz
y permite probar el cálculo sin entrada por consola.
```

## Etapa 4. Implementar

Solicita únicamente el siguiente cambio aprobado.

## Etapa 5. Verificar

Ejecuta los criterios de aceptación. Si algo falla, conserva el resultado exacto.

## Etapa 6. Mejorar o continuar

Corrige una falla o avanza al siguiente paso. No mezcles ambas acciones sin necesidad.

---

# 11. Mantener el contexto sin acumular ruido

Una conversación extensa puede contener decisiones antiguas, alternativas descartadas y reglas contradictorias.

## Contexto útil

- requisitos vigentes;
- decisión elegida;
- interfaz actual;
- estructura relevante;
- pruebas existentes;
- error reproducible;
- tarea siguiente.

## Ruido

- saludos;
- propuestas descartadas sin marcar;
- archivos no relacionados;
- versiones antiguas sin explicación;
- respuestas que ya fueron reemplazadas;
- información empresarial que no cambia la solución.

## Punto de control

Después de una decisión importante, escribe:

```text
Punto de control

Decisiones vigentes:
- [decisión 1]
- [decisión 2]

Interfaces que no deben cambiar:
- [firma o contrato]

Pruebas aprobadas:
- [casos]

Pendiente:
- [una sola tarea siguiente]

Descartado:
- [alternativa y motivo]
```

Pide al asistente que confirme si el resumen coincide con la conversación. Después revísalo tú.

---

# 12. El fragmento mínimo reproducible

Cuando existe un error, no envíes todo el proyecto. Crea un fragmento que permita observarlo.

Debe incluir:

- código mínimo relacionado;
- entrada utilizada;
- resultado esperado;
- resultado real;
- error exacto;
- lenguaje y versión;
- pasos para reproducir.

## Ejemplo

```text
Entorno: Java 21

Objetivo:
La función debe aceptar exactamente 100 como límite de descuento.

Código mínimo:
[FRAGMENTO]

Entrada:
subtotal = 100

Esperado:
descuento = 5

Real:
descuento = 0

Tarea:
Explica la causa. No cambies la firma ni reescribas otras funciones.
Después propone el cambio mínimo y un caso que evite la regresión.
```

No reemplaces valores útiles por descripciones vagas como “da mal”.

---

# 13. Trabajar con archivos sin perder alcance

Antes de compartir archivos, prepara un mapa breve:

```text
proyecto/
├── modelos/
│   └── servicio.ext        # estructura de un servicio
├── logica/
│   └── cotizador.ext       # cálculo que debe modificarse
└── pruebas/
    └── cotizador_test.ext  # pruebas existentes
```

Después indica:

- archivo objetivo;
- archivos solo de referencia;
- archivos que no deben modificarse;
- función exacta;
- interfaz que debe conservarse;
- comandos permitidos, si aplica.

## Alcance de lectura y escritura

```text
Puedes leer:
- logica/cotizador.ext
- pruebas/cotizador_test.ext

Puedes modificar:
- únicamente logica/cotizador.ext

No modifiques:
- nombres públicos;
- estructura de carpetas;
- pruebas existentes.
```

No confíes solo en la instrucción escrita. Si la herramienta puede actuar, revisa los permisos y las diferencias reales.

---

# 14. Solicitar un diff o cambio mínimo

Una reescritura completa oculta modificaciones innecesarias.

## Solicitud adecuada

```text
Corrige únicamente la comparación del límite mínimo.
Conserva la firma, los nombres públicos y los mensajes actuales.
Devuelve:
1. el diff mínimo;
2. una explicación de máximo tres puntos;
3. la prueba de regresión que falta.
No reformatees líneas no relacionadas.
```

## Qué revisar en el diff

- archivos inesperados;
- líneas formateadas sin necesidad;
- cambio de nombres públicos;
- eliminación de validaciones;
- dependencias nuevas;
- comentarios engañosos;
- alcance mayor al solicitado.

Si la herramienta no puede producir un diff, solicita únicamente la función modificada y compara manualmente.

---

# 15. Preservar interfaces y comportamiento

Una modificación puede corregir una regla y romper a quienes utilizan la función.

## Contrato que debe conservarse

- nombre de la función;
- cantidad y orden de parámetros;
- tipo o forma de retorno;
- excepciones o errores esperados;
- efectos secundarios;
- casos existentes aprobados.

## Prompt de preservación

```text
Agrega la validación solicitada sin cambiar:
- nombre `crear_reserva`;
- parámetros `(fecha, hora, personas)`;
- estructura de salida `{valida, errores}`;
- mensajes existentes;
- comportamiento de los casos CP-01 a CP-08.

Si el cambio no puede realizarse sin alterar el contrato, detente y explica
la incompatibilidad antes de escribir código.
```

Esta última condición evita que la herramienta oculte una decisión de diseño dentro de una reescritura.

---

# 16. Solicitar alternativas con ventajas y riesgos

No pidas “la mejor solución” sin criterios.

```text
Propón dos alternativas para representar errores de validación.

Evalúa cada una según:
- claridad para quien llama la función;
- facilidad de prueba;
- compatibilidad con la interfaz actual;
- cantidad de cambios;
- riesgo de ocultar errores.

No elijas por mí. No escribas código.
```

Después registra tu decisión:

| Alternativa | Ventaja | Riesgo | Evidencia | Decisión |
|---|---|---|---|---|
| A |  |  |  |  |
| B |  |  |  |  |

La herramienta puede ampliar opciones. Tú defines los criterios y eliges.

---

# 17. Corregir una conversación que se desvió

No siempre necesitas empezar de cero.

## Señales de desvío

- aparecen funciones no solicitadas;
- regresan requisitos descartados;
- cambia el lenguaje;
- se agregan bibliotecas;
- el asistente intenta resolver etapas futuras;
- la respuesta contradice una decisión vigente.

## Mensaje de recuperación

```text
La última respuesta se salió del alcance.

Estado vigente:
- [decisión 1]
- [decisión 2]

Descarta de la última propuesta:
- [cambio no autorizado]

Tarea actual:
- [un único cambio]

Restricciones:
- [contratos y archivos]

Criterios de aceptación:
- [lista]

Antes de escribir código, confirma en cinco puntos qué conservarás y qué cambiarás.
```

## Cuándo abrir un chat nuevo

Comienza una nueva conversación cuando:

- la tarea cambió por completo;
- existen demasiadas versiones contradictorias;
- ya no puedes distinguir decisiones vigentes;
- necesitas compartir un paquete de contexto más limpio;
- la conversación contiene datos que no deberían seguir utilizándose.

No copies todo el historial. Lleva un resumen revisado.

---

# 18. Resumen de continuidad

Al cerrar una sesión, crea un documento que permita continuar sin reconstruir todo el chat.

```text
PROYECTO
[nombre y propósito]

ENTORNO
[lenguaje, versión y dependencias]

ALCANCE ACTUAL
[qué está incluido y excluido]

DECISIONES VIGENTES
- [decisión y motivo]

INTERFACES ESTABLES
- [firmas, formatos o archivos]

PRUEBAS APROBADAS
- [casos y resultados]

PROBLEMAS PENDIENTES
- [problema con evidencia]

SIGUIENTE TAREA
[un cambio concreto]

ARCHIVOS NECESARIOS
- [ruta y propósito]
```

Revisa el resumen contra el código. El chat puede recordar una decisión que nunca se implementó.

---

# 19. Paquete de contexto para un proyecto

Un paquete de contexto es una selección pequeña de información preparada para una tarea.

## Contenido recomendado

```text
contexto/
├── objetivo.md
├── estructura.md
├── convenciones.md
├── decisiones.md
├── criterios_aceptacion.md
└── tarea_actual.md
```

## Objetivo

Una descripción de dos o tres frases.

## Estructura

Solo carpetas y archivos relevantes.

## Convenciones

Nombres, estilo, manejo de errores y reglas de dependencias.

## Decisiones

Alternativas ya elegidas o descartadas.

## Criterios de aceptación

Condiciones observables y casos importantes.

## Tarea actual

Un único cambio con alcance de lectura y modificación.

No incluyas credenciales, bases reales, archivos generados, dependencias instaladas ni documentación que no afecte la tarea.

---

# 20. Plantillas reutilizables sin prompts rígidos

Una plantilla útil contiene campos que debes completar. Una plantilla peligrosa invita a copiarla sin pensar.

## Buena plantilla

```text
Objetivo: [resultado observable]
Contexto relevante: [solo lo necesario]
Entorno: [lenguaje y versión]
Alcance: [archivo o función]
Debe conservar: [contratos]
Criterios: [condiciones comprobables]
Formato de respuesta: [plan, diff, pruebas, explicación]
Dudas conocidas: [información no confirmada]
```

## Regla de adaptación

Antes de enviar una plantilla:

1. elimina campos irrelevantes;
2. completa todos los marcadores;
3. verifica que no existan contradicciones;
4. reemplaza datos reales;
5. confirma que la respuesta pedida corresponde a la etapa actual.

No conserves frases como “actúa como experto” si no cambian la tarea, los criterios ni la evidencia.

---

# 21. Registrar prompts y decisiones

No es necesario guardar cada palabra de cada conversación. Registra las interacciones que modificaron el trabajo.

| ID | Etapa | Objetivo | Prompt o referencia | Respuesta útil | Decisión | Evidencia |
|---|---|---|---|---|---|---|
| P-01 | Aclarar | Detectar ambigüedades | Texto completo | Faltaba definir límite | Aceptar pregunta | Requisito actualizado |
| P-02 | Proponer | Comparar estructuras | Texto completo | Dos alternativas | Elegir B | Menos cambios |
| P-03 | Implementar | Crear validación | Texto completo | Código inicial | Corregir | Falló CP-04 |

## Decisiones rechazadas

Conservar una propuesta descartada evita repetirla:

```text
DEC-03 — Rechazada
Propuesta: agregar una biblioteca de validación.
Motivo: el alcance exige biblioteca estándar y las reglas son pequeñas.
Evidencia: la solución puede implementarse con funciones del lenguaje.
```

---

# Práctica guiada 1. Reparar una solicitud ambigua

## Situación

Una aplicación necesita validar una reserva de sala.

Solicitud original:

```text
Crea una función para reservar una sala y que no haya problemas.
```

## Paso 1. No pidas código

Envía:

```text
Analiza esta idea sin escribir código:
"Crear una función para reservar una sala y que no haya problemas".

Devuelve:
1. preguntas bloqueantes;
2. decisiones opcionales;
3. suposiciones peligrosas;
4. posibles límites.

No inventes reglas.
```

## Paso 2. Decide las reglas

Utiliza estas decisiones:

- entrada: hora inicial, duración en minutos y cantidad de personas;
- horario permitido: desde `08:00` hasta `18:00`;
- duración: múltiplos de `30`, entre `30` y `120` minutos;
- capacidad: entre `1` y `8` personas;
- la reserva debe finalizar a más tardar a las `18:00`;
- salida: objeto con `valida`, `horaFin` y `errores`;
- acumular errores;
- no verificar choques con otras reservas todavía;
- no utilizar bibliotecas externas.

## Paso 3. Crea criterios

Solicita criterios de aceptación, no código. Revisa que incluyan:

- inicio exactamente a las `08:00`;
- final exactamente a las `18:00`;
- duración `30` y `120`;
- duración `45` inválida;
- capacidad `1` y `8`;
- una reserva que termine después de las `18:00`;
- varios errores simultáneos.

## Paso 4. Pide un plan

```text
Propón un plan de máximo cuatro pasos para implementar y probar la función.
Cada paso debe producir un resultado ejecutable o verificable.
No escribas código.
```

## Paso 5. Implementa una etapa

Solicita únicamente la validación de duración y capacidad. Ejecuta sus casos antes de continuar con el horario.

## Paso 6. Registra

Conserva:

- la pregunta que reveló una ambigüedad real;
- una sugerencia descartada;
- un criterio corregido manualmente;
- un resultado ejecutado.

---

# Práctica guiada 2. Solicitar un cambio sin reescribir

Supón que la función de la práctica anterior ya supera todos los casos. Ahora la capacidad máxima cambia de `8` a `10`.

## Solicitud incorrecta

```text
Vuelve a hacer la función porque ahora caben 10.
```

## Solicitud controlada

```text
Cambio de requisito:
La capacidad máxima pasa de 8 a 10 personas.

Alcance:
- modifica únicamente la constante o condición relacionada con capacidad;
- conserva firma, salida, horario, duración y mensajes no relacionados;
- no reformatees la función completa.

Devuelve:
1. diff mínimo;
2. pruebas que deben cambiar;
3. una nueva prueba con 10;
4. una prueba que rechace 11.

Si detectas que el cambio requiere modificar otra parte, explica por qué antes
de proponerla.
```

## Verificación

Después del cambio:

1. ejecuta las pruebas anteriores;
2. modifica la prueba que esperaba rechazar `9` si ya no representa la regla;
3. ejecuta los casos `10` y `11`;
4. confirma que horario y duración no cambiaron;
5. registra el diff real, no solo el diff propuesto.

---

# Ejercicios individuales obligatorios

Completa los ocho ejercicios en `01_ejercicios/ejercicios.md` o `.txt`.

## Ejercicio 1. Clasifica la intención

Para cada solicitud, indica si corresponde a explicación, plan, implementación, modificación, revisión o pruebas. Después reescríbela para que tenga una única intención.

1. “Explícame esta función, corrígela y crea todas las pruebas”.
2. “Dime dos formas de organizar la validación sin escribir código”.
3. “Cambia únicamente el mensaje cuando la edad sea inválida”.
4. “Encuentra incumplimientos de AC-01 a AC-05 sin modificar archivos”.

## Ejercicio 2. Convierte adjetivos en criterios

Transforma cada frase en al menos dos condiciones observables:

- “El código debe ser profesional”.
- “La respuesta debe ser rápida”.
- “La función debe ser segura”.
- “El cambio debe ser pequeño”.

Si una condición no puede demostrarse con la información disponible, indícalo.

## Ejercicio 3. Repara contradicciones

Analiza este prompt:

```text
Devuelve únicamente código y explica cada decisión.
No cambies ninguna línea, pero refactoriza toda la función.
No uses bibliotecas, pero usa la biblioteca ValidatorX.
No hagas preguntas y no inventes requisitos faltantes.
```

Identifica cada contradicción. Después escribe dos prompts separados: uno para analizar y otro para realizar un cambio mínimo.

## Ejercicio 4. Formula preguntas bloqueantes

Idea:

> Calcular el precio de entradas para un evento.

Escribe diez preguntas. Marca cada una como:

- bloqueante;
- opcional;
- fuera del alcance.

Incluye edades, cantidades, límites, promociones, redondeo y datos inválidos.

## Ejercicio 5. Divide una tarea grande

Divide esta petición en un máximo de seis etapas verificables:

> Crear una aplicación para registrar productos, calcular ventas, guardar información, generar reportes y administrar usuarios.

Para cada etapa indica:

- resultado;
- dependencia previa;
- prueba mínima;
- razón para no mezclarla con la siguiente.

## Ejercicio 6. Construye un fragmento reproducible

Redacta un mensaje de diagnóstico con datos ficticios para esta situación:

- una función debería aceptar el valor `50`;
- devuelve un error solo en ese límite;
- funciona con `49` y `51`;
- el proyecto utiliza tu lenguaje;
- no quieres modificar la firma.

Incluye los siete elementos de un fragmento mínimo reproducible.

## Ejercicio 7. Controla archivos

Observa esta estructura:

```text
tienda/
├── config.env
├── clientes.csv
├── calculos.ext
├── interfaz.ext
└── pruebas_calculos.ext
```

Necesitas corregir una condición en `calculos.ext` y comprobarla con `pruebas_calculos.ext`.

Escribe:

- archivos que pueden leerse;
- archivo que puede modificarse;
- archivos que no deben compartirse;
- contrato que debe conservarse;
- formato de respuesta solicitado.

## Ejercicio 8. Recupera el contexto

Una conversación comenzó en Python, pero la última respuesta utiliza JavaScript, agregó una interfaz gráfica y eliminó validaciones existentes.

Redacta un mensaje de recuperación que:

- restablezca el lenguaje;
- enumere decisiones vigentes;
- descarte los cambios no autorizados;
- defina una sola tarea;
- solicite confirmación antes de generar código.

---

# Reto adicional opcional

Toma un prompt que hayas utilizado anteriormente para programar.

1. Marca objetivo, contexto, entorno, reglas, restricciones y criterios.
2. Elimina cualquier frase que no cambie la respuesta esperada.
3. Divide las intenciones mezcladas.
4. Agrega un ejemplo límite.
5. Envía la versión original en un chat nuevo.
6. Envía la versión revisada en otro chat.
7. Compara precisión, supuestos y facilidad de verificación.

No evalúes cuál respuesta “suena mejor”. Utiliza criterios visibles.

---

# Mini proyecto. Biblioteca personal de prompts técnicos

**Tiempo recomendado:** 30 minutos  
**Valor:** 20 puntos

## Objetivo

Crearás una biblioteca pequeña de plantillas adaptables para tareas que utilizarás durante el resto del curso.

No debes coleccionar prompts genéricos encontrados en internet. Cada plantilla debe:

- resolver una intención concreta;
- contener campos editables;
- indicar cuándo utilizarse;
- indicar qué información no incluir;
- definir cómo revisar la respuesta;
- poder aplicarse a distintos lenguajes.

## Plantillas obligatorias

Crea una plantilla para cada tarea:

1. explicar código;
2. planificar una función o cambio;
3. modificar comportamiento existente;
4. diagnosticar un error;
5. generar casos de prueba;
6. revisar riesgos de seguridad;
7. documentar un cambio.

## Estructura de cada plantilla

```text
NOMBRE
[nombre descriptivo]

CUÁNDO UTILIZARLA
[situación concreta]

NO UTILIZARLA CUANDO
[situación fuera del alcance]

DATOS QUE DEBES COMPLETAR
- [campo 1]
- [campo 2]

PROMPT ADAPTABLE
[texto con marcadores visibles]

VALIDACIÓN DE LA RESPUESTA
- [comprobación 1]
- [comprobación 2]

RIESGO PRINCIPAL
[error frecuente que debes vigilar]
```

## Requisitos

- Utiliza marcadores como `[LENGUAJE]`, `[OBJETIVO]` o `[ERROR EXACTO]`.
- Ninguna plantilla debe pedir una aplicación completa.
- La plantilla de modificación debe exigir preservar interfaces y devolver un cambio mínimo.
- La plantilla de diagnóstico debe solicitar resultado esperado, resultado real y pasos para reproducir.
- La plantilla de pruebas debe vincular cada caso con una regla.
- La plantilla de seguridad debe pedir hallazgos y evidencia, no una garantía de seguridad.
- La plantilla de documentación debe comprobar el código antes de afirmar cómo funciona.
- Incluye un ejemplo completado de una de las siete plantillas.

## Prueba de utilidad

Elige una plantilla y úsala con un problema ficticio de máximo una función.

Registra:

- prompt completado;
- respuesta relevante;
- campo que más ayudó;
- campo innecesario que eliminaste;
- forma en que comprobaste la respuesta.

## Entregables

```text
02_mini_proyecto/
├── biblioteca_prompts.md
├── ejemplo_completado.md
└── evidencia_validacion.md
```

## Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Incluye las siete intenciones obligatorias | 4 |
| Las plantillas contienen campos adaptables y límites | 4 |
| Cada plantilla explica cuándo usarla y cómo validar | 5 |
| Evita garantías, tareas gigantes y frases de relleno | 2 |
| El ejemplo está completado y fue comprobado | 3 |
| Organización y claridad | 2 |
| **Total** | **20** |

---

# Proyecto del módulo. Cotizador de servicios construido mediante conversación estructurada

**Tiempo recomendado:** 50 minutos  
**Valor:** 50 puntos

## Contexto

Una empresa necesita calcular cotizaciones a partir de un catálogo fijo de servicios. Cada cotización puede aplicar un descuento autorizado y un porcentaje de impuesto configurable.

Desarrollarás la solución en el lenguaje que ya conoces. El resultado técnico es importante, pero el objetivo principal consiste en demostrar una conversación controlada:

```text
Aclarar → planificar → elegir → implementar → probar → cambiar → resumir
```

No puedes pedir el programa completo en un solo mensaje.

## Catálogo inicial

Utiliza estos datos ficticios:

| Código | Servicio | Precio unitario |
|---|---|---:|
| `WEB01` | Página informativa | `450.00` |
| `MANT01` | Hora de mantenimiento | `35.00` |
| `CONS01` | Hora de consultoría | `50.00` |
| `CAPA01` | Sesión de capacitación | `120.00` |

El catálogo puede representarse mediante la estructura apropiada de tu lenguaje. No debe cargarse desde una base de datos ni desde internet.

## Entrada

La operación principal recibe:

- una lista de líneas de cotización;
- un porcentaje de descuento;
- un porcentaje de impuesto.

Cada línea contiene:

- código de servicio;
- cantidad.

## Reglas iniciales

1. La cotización debe contener al menos una línea.
2. El código debe existir en el catálogo.
3. La cantidad debe ser un entero entre `1` y `20`, ambos incluidos.
4. Un código no puede aparecer dos veces en la misma cotización.
5. Los descuentos iniciales permitidos son `0`, `5` y `10` por ciento.
6. El impuesto debe ser numérico y estar entre `0` y `25` por ciento, ambos incluidos.
7. Si cualquier dato es inválido, la cotización completa se rechaza.
8. Deben acumularse todos los errores detectables.
9. El subtotal es la suma de `precio × cantidad` de cada línea.
10. El descuento se calcula sobre el subtotal.
11. La base gravable es `subtotal - descuento`.
12. El impuesto se calcula sobre la base gravable.
13. El total es `base gravable + impuesto`.
14. Los montos visibles se redondean a dos decimales.
15. No se permiten bibliotecas externas.

## Salida para una cotización válida

La estructura debe permitir observar:

- detalle por línea:
  - código;
  - nombre;
  - precio unitario;
  - cantidad;
  - total de línea;
- subtotal;
- porcentaje y monto de descuento;
- base gravable;
- porcentaje y monto de impuesto;
- total final;
- estado válido;
- lista de errores vacía.

## Salida para una cotización inválida

Debe permitir observar:

- estado inválido;
- lista de errores;
- ausencia de un total presentado como válido.

No debe guardar archivos, mostrar una interfaz, enviar correos ni conectarse a una base de datos.

## Casos iniciales obligatorios

| ID | Entrada resumida | Resultado esperado |
|---|---|---|
| CP-01 | `WEB01 × 1`, descuento 0, impuesto 0 | Subtotal y total `450.00` |
| CP-02 | `MANT01 × 2`, descuento 5, impuesto 10 | Subtotal `70.00`, descuento `3.50`, base `66.50`, impuesto `6.65`, total `73.15` |
| CP-03 | `CONS01 × 2` y `CAPA01 × 1`, descuento 10, impuesto 13 | Subtotal `220.00`, descuento `22.00`, base `198.00`, impuesto `25.74`, total `223.74` |
| CP-04 | Lista vacía | Cotización rechazada |
| CP-05 | Código inexistente | Error de código |
| CP-06 | Cantidad `0` | Error de cantidad |
| CP-07 | Cantidad `21` | Error de cantidad |
| CP-08 | Código repetido | Error de duplicado |
| CP-09 | Descuento `7` | Error de descuento |
| CP-10 | Impuesto `-1` | Error de impuesto |
| CP-11 | Impuesto `25` | Aceptado |
| CP-12 | Varias líneas inválidas | Se acumulan los errores relevantes |

## Cambio posterior obligatorio

Después de aprobar la versión inicial, recibirás este cambio:

> Agregar un descuento autorizado del `15 %`, únicamente cuando el subtotal sea mayor o igual que `1000.00`. Si se solicita `15 %` con un subtotal menor, la cotización debe rechazarse. Los descuentos `0`, `5` y `10` conservan su comportamiento.

El cambio debe conservar:

- la operación pública;
- el formato de entrada;
- la estructura de salida;
- el catálogo;
- las reglas de cantidades e impuestos;
- los resultados de los casos anteriores.

Agrega estos casos:

| ID | Entrada resumida | Resultado esperado |
|---|---|---|
| CP-13 | Subtotal `900.00`, descuento 15 | Rechazado |
| CP-14 | Subtotal `1000.00`, descuento 15, impuesto 0 | Descuento `150.00`, total `850.00` |
| CP-15 | Subtotal superior a `1000.00`, descuento 15 | Aceptado |
| CP-16 | Subtotal menor a `1000.00`, descuento 10 | Conserva el comportamiento anterior |

## Fase 1. Documento del problema

Sin utilizar IA, crea `03_proyecto/01_problema.md` con:

- objetivo;
- entradas;
- salidas;
- reglas iniciales;
- exclusiones;
- criterios CP-01 a CP-12;
- preguntas que todavía consideres necesarias.

No copies todavía una implementación.

## Fase 2. Guion de conversación

Crea `03_proyecto/02_guion.md` con las etapas que utilizarás.

| Etapa | Intención | Resultado solicitado | Qué no se permitirá | Evidencia posterior |
|---|---|---|---|---|
| 1 | Aclarar | Preguntas y ambigüedades | Código | Requisitos revisados |
| 2 | Planificar | Plan pequeño | Implementación | Plan elegido |
| 3 | Implementar validación | Código limitado | Cálculo completo | Pruebas de validación |
| 4 | Implementar cálculo | Completar lógica | Funciones extra | Casos numéricos |
| 5 | Revisar | Incumplimientos | Reescritura | Matriz de criterios |
| 6 | Modificar | Descuento 15 % | Cambios no relacionados | Diff y regresión |
| 7 | Resumir | Paquete de continuidad | Historial completo | Resumen verificado |

Puedes ajustar el guion si mantienes al menos estas siete etapas.

## Fase 3. Aclaración

Envía los requisitos y solicita:

- ambigüedades;
- contradicciones;
- supuestos peligrosos;
- preguntas bloqueantes;
- casos faltantes.

Prohíbe escribir código en esta etapa.

Registra:

- preguntas útiles aceptadas;
- preguntas fuera del alcance descartadas;
- cambios realizados al documento del problema;
- decisiones que conservaste.

## Fase 4. Planificación

Solicita dos planes breves. Cada plan debe indicar:

- responsabilidades de cada función;
- orden de implementación;
- pruebas por etapa;
- ventajas;
- riesgos;
- cantidad aproximada de cambios.

Elige uno y escribe el motivo. No pidas código en el mismo mensaje.

## Fase 5. Primera versión: validación

Solicita únicamente:

- representación del catálogo;
- validación de líneas;
- validación de descuento e impuesto;
- estructura de errores.

No solicites el cálculo completo hasta ejecutar los casos inválidos.

Guarda esta versión en:

```text
03_proyecto/versiones/v1_validacion/
```

Ejecuta como mínimo CP-04 a CP-12.

## Fase 6. Segunda versión: cálculo

Cuando la validación funcione, solicita el cálculo respetando la interfaz elegida.

Guarda la versión en:

```text
03_proyecto/versiones/v2_calculo/
```

Ejecuta CP-01 a CP-12. Corrige cualquier diferencia antes de avanzar.

## Fase 7. Revisión por criterios

Solicita una revisión contra los requisitos numerados.

Formato recomendado:

| Requisito | Cumplido | Evidencia en código | Prueba | Duda |
|---|---|---|---|---|

La IA puede señalar una evidencia incorrecta. Verifica cada referencia en el código.

## Fase 8. Cambio mínimo

Entrega el cambio del descuento del `15 %` y solicita:

- archivos o funciones afectadas;
- incompatibilidades posibles;
- diff mínimo;
- nuevos casos;
- confirmación de comportamientos que deben conservarse.

No autorices una reescritura completa.

Guarda la versión final en:

```text
03_proyecto/versiones/v3_descuento_15/
```

Ejecuta CP-01 a CP-16. Los casos anteriores funcionan como pruebas de regresión.

## Fase 9. Corrección manual

Realiza al menos un cambio propio. Puede ser:

- corregir una condición;
- simplificar una validación;
- mejorar un nombre interno;
- eliminar código duplicado;
- corregir un mensaje;
- agregar un caso omitido.

Documenta:

```text
Problema observado:
Propuesta de la IA:
Decisión propia:
Cambio realizado:
Prueba antes:
Prueba después:
```

## Fase 10. Resumen final del contexto

Crea `03_proyecto/06_contexto_final.md` con:

- propósito;
- entorno;
- alcance;
- estructura;
- interfaces estables;
- decisiones vigentes;
- propuesta rechazada y motivo;
- pruebas aprobadas;
- limitaciones;
- siguiente cambio hipotético.

Abre un chat nuevo, pega únicamente ese resumen y solicita:

> Explica en máximo diez puntos qué está construido, qué no está incluido y cuál sería la siguiente tarea. No escribas código.

Corrige el resumen si la respuesta revela una ambigüedad real. No agregues detalles inventados por el nuevo chat.

## Estructura sugerida

```text
03_proyecto/
├── 01_problema.md
├── 02_guion.md
├── 03_historial_prompts.md
├── 04_decisiones.md
├── 05_casos_prueba.md
├── 06_contexto_final.md
├── bitacora_ia.md
├── versiones/
│   ├── v1_validacion/
│   ├── v2_calculo/
│   └── v3_descuento_15/
└── evidencias/
```

## Qué debe mostrar el historial

- una etapa de preguntas sin código;
- una etapa de planificación sin código;
- elección razonada entre alternativas;
- implementación dividida;
- resultado real después de cada versión;
- al menos una corrección de rumbo;
- una solicitud de diff o cambio mínimo;
- una corrección manual;
- un resumen de continuidad.

No necesitas incluir saludos ni respuestas que no influyeron en el proyecto.

## Criterios de aceptación del proyecto

- La solución final cumple CP-01 a CP-16.
- El código puede ejecutarse con instrucciones claras.
- Las tres versiones permiten observar la progresión.
- La conversación no comienza con una solicitud del programa completo.
- Los prompts distinguen aclaración, plan, implementación, revisión y cambio.
- Las decisiones aceptadas y rechazadas están documentadas.
- El cambio del 15 % mantiene el comportamiento anterior.
- No existen dependencias externas.
- No se compartió información sensible.
- Puedes explicar y modificar el código final.

## Fuera del alcance

No agregues:

- interfaz gráfica;
- página web;
- base de datos;
- archivos Excel;
- cuentas de usuario;
- envío de cotizaciones;
- conversión de monedas;
- catálogo editable;
- almacenamiento permanente;
- API;
- librerías externas.

---

# Rúbrica del proyecto del módulo

| Criterio | Evidencia esperada | Puntos |
|---|---|---:|
| Definición del problema | Entradas, salidas, reglas, exclusiones y criterios claros | 5 |
| Guion y separación de etapas | La conversación distingue aclarar, planificar, implementar, revisar y modificar | 6 |
| Calidad de prompts | Contexto suficiente, restricciones, formato y aceptación | 7 |
| Control del alcance | No solicita todo en un mensaje ni acepta cambios no relacionados | 5 |
| Funcionalidad inicial | CP-01 a CP-12 cumplen los resultados esperados | 7 |
| Cambio controlado | CP-13 a CP-16 y regresión de casos anteriores | 5 |
| Versiones y evidencia | V1, V2 y V3 contienen pruebas y resultados reales | 5 |
| Decisiones y corrección manual | Registra alternativas, rechazo y mejora propia | 4 |
| Contexto final | El resumen permite continuar sin arrastrar el historial | 3 |
| Organización y dominio | Archivos claros y código explicable | 3 |
| **Total** |  | **50** |

## Fallos críticos

El proyecto requiere corrección aunque alcance el puntaje mínimo si:

- contiene secretos o datos personales reales;
- falta el código fuente;
- no puede ejecutarse;
- el cálculo final es incorrecto en un caso obligatorio;
- la versión final rompe casos anteriores;
- todo el programa fue solicitado en un único mensaje;
- las evidencias se presentan como ejecutadas sin haberlo sido;
- se oculta el uso material de IA;
- no puedes explicar el código principal.

---

# Evaluación práctica del módulo

**Tiempo recomendado:** 15 minutos  
**Valor:** 15 puntos

## Situación

Recibes esta petición para modificar una función existente:

```text
Actúa como el mejor programador del mundo. Rehaz todo mi programa de envíos
y déjalo perfecto, ultrarrápido y 100 % seguro. Solo cambia la función
calcular_envio y también reorganiza todas las carpetas. Puede ser Python o
JavaScript. Usa la mejor biblioteca, pero no agregues dependencias. Devuelve
solo código y explica todo detalladamente. No hagas preguntas. El envío frágil
debe costar más, pero no cambies ningún resultado existente.
```

La información disponible indica:

- el proyecto utiliza Python 3.12;
- la firma pública es `calcular_envio(peso, zona)`;
- existen doce pruebas aprobadas;
- todavía no se ha definido cuánto cuesta el recargo frágil;
- tampoco se ha decidido si se agregará un parámetro o se recibirá otra estructura;
- solo se permite modificar `envios.py` y `test_envios.py`;
- no se permiten dependencias externas.

## Tareas

1. Identifica al menos siete defectos o contradicciones del prompt original.
2. Escribe las preguntas bloqueantes que deben resolverse antes de programar.
3. Redacta un prompt de análisis que prohíba generar código.
4. Supón que se decide agregar el parámetro booleano `fragil` y un recargo fijo de `3.00`. Redacta un prompt de modificación mínima.
5. Incluye restricciones para preservar los resultados cuando `fragil` sea falso.
6. Escribe cinco criterios de aceptación, incluyendo compatibilidad y pruebas de regresión.
7. Solicita un formato de respuesta apropiado para revisar el cambio.
8. Escribe un punto de control de máximo ocho líneas para continuar en otro chat.

No necesitas implementar la función. La evaluación mide tu capacidad para dirigir el cambio con precisión.

## Rúbrica de la evaluación

| Criterio | Puntos |
|---|---:|
| Detecta ambigüedades y contradicciones reales | 3 |
| Formula preguntas bloqueantes | 2 |
| Separa análisis y modificación | 3 |
| Preserva interfaz y comportamiento existente | 2 |
| Crea criterios verificables y regresión | 3 |
| Produce un resumen de continuidad útil | 2 |
| **Total** | **15** |

---

# Calificación del módulo

| Evidencia | Valor |
|---|---:|
| Ejercicios obligatorios | 15 puntos |
| Mini proyecto | 20 puntos |
| Proyecto del módulo | 50 puntos |
| Evaluación práctica | 15 puntos |
| **Total** | **100 puntos** |

## Rúbrica de los ejercicios

| Criterio global | Puntos |
|---|---:|
| Completa los ocho enunciados | 4 |
| Distingue intenciones y etapas | 3 |
| Convierte ambigüedades en preguntas o criterios | 3 |
| Controla contexto, archivos e interfaces | 3 |
| Justifica decisiones con claridad | 2 |
| **Total** | **15** |

Para aprobar necesitas:

- obtener al menos `80/100`;
- aprobar el proyecto principal;
- entregar todas las evidencias obligatorias;
- corregir cualquier fallo crítico;
- poder explicar los prompts, decisiones y código;
- registrar con honestidad el uso de IA.

No continúes al Módulo 3 hasta que esta entrega figure como aprobada.

---

# Errores frecuentes

## Convertir el prompt en un documento interminable

Agrega únicamente contexto que cambie la solución. Un buen prompt puede ser breve si la tarea es pequeña.

## Utilizar una plantilla sin completar marcadores

Enviar `[LENGUAJE]` o `[ERROR]` sin reemplazar obliga a la herramienta a adivinar.

## Pedir preguntas y código en el mismo mensaje

Si el código aparece antes de resolver dudas, puede fijar supuestos que después resultan difíciles de detectar.

## Permitir varias intenciones

“Explica, corrige, optimiza y documenta” produce una respuesta amplia. Separa cada intención y verifica entre etapas.

## Describir restricciones sin criterios

“No rompas nada” no identifica qué comportamientos deben conservarse. Enumera interfaces y casos de regresión.

## Conservar todo el historial

Las conversaciones largas acumulan decisiones descartadas. Usa puntos de control y chats nuevos con resúmenes revisados.

## Solicitar una garantía

Ningún prompt puede garantizar ausencia de errores, seguridad absoluta o funcionamiento en todos los entornos. Pide evidencia verificable.

## Aceptar un diff propuesto sin comparar

La herramienta puede describir un cambio mínimo y producir uno mayor. Revisa las diferencias reales.

## Cambiar las pruebas para ocultar un fallo

Una prueba solo debe cambiar cuando el requisito cambió. No ajustes el resultado esperado para coincidir con código incorrecto.

---

# Recomendaciones para completar el módulo

- Escribe primero el problema en un documento propio.
- Mantén una intención por mensaje siempre que sea posible.
- Pide preguntas antes de código cuando falten reglas.
- Numera requisitos y criterios para poder citarlos.
- Solicita planes breves y elige de forma explícita.
- Ejecuta una versión antes de pedir la siguiente.
- Conserva contratos públicos durante cambios internos.
- Pide diffs pequeños y revisa los archivos reales.
- Resume el estado después de cada decisión importante.
- Abre un chat nuevo cuando el historial contenga demasiado ruido.
- Prefiere un prompt claro y comprobable a uno lleno de palabras técnicas.

---

# Videos recomendados

Los videos son recursos complementarios. Las interfaces mostradas pueden cambiar, pero los principios de claridad, contexto, iteración y revisión continúan siendo aplicables.

## 1. ChatGPT para programadores: creación de código a partir de prompts

**Canal:** Coderhouse  
[ChatGPT para programadores: cómo crear código a partir de prompts](https://www.youtube.com/watch?v=qB-zIrX9UcE)

Observa cómo una solicitud influye en el código producido. No copies los ejemplos como plantillas universales: identifica el objetivo, el contexto y la forma de revisión utilizada.

## 2. Prompt Engineering con GitHub Copilot

**Canal:** Microsoft Reactor  
[Prompt Engineering con GitHub Copilot](https://www.youtube.com/watch?v=r0a-_1tEenI)

El video está orientado al trabajo dentro del editor. Relaciona sus ejemplos con el control de contexto, la división de tareas y la iteración explicados en el módulo.

---

# Documentación oficial y recursos confiables

## ChatGPT y OpenAI

- [Mejores prácticas de ingeniería de prompts para ChatGPT](https://help.openai.com/es-419/articles/10032626-prompt-engineering-best-practices-for-chatgpt)
- [Buenas prácticas para la ingeniería de prompts de OpenAI](https://help.openai.com/es-es/articles/6654000-buenas-pr%C3%A1cticas-para-la-ingenier%C3%ADa-de-prompts-con-la-api-de-openai)

La segunda guía contiene ejemplos vinculados con una API. Utiliza únicamente sus principios de claridad, separación del contexto, formato y ejemplos; este curso no requiere programar con una API.

## GitHub Copilot

- [Ingeniería de mensajes para GitHub Copilot Chat](https://docs.github.com/es/copilot/concepts/prompting/prompt-engineering)
- [Uso responsable de GitHub Copilot](https://docs.github.com/es/copilot/responsible-use)

## Claude

- [Descripción general de ingeniería de prompts de Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

## Gemini

- [Estrategias de diseño de prompts de Gemini](https://ai.google.dev/gemini-api/docs/prompting-strategies?hl=es-419)

Las guías de Anthropic y Google pueden contener ejemplos para desarrolladores de sus servicios. No necesitas utilizar APIs, claves ni código de integración. Consulta únicamente las recomendaciones aplicables a conversaciones y tareas de programación.

## Principios que debes contrastar

Al leer recursos de distintas herramientas, busca estos principios comunes:

- claridad y especificidad;
- contexto relevante;
- ejemplos cuando eliminan ambigüedad;
- división de tareas complejas;
- iteración;
- historial relevante;
- verificación del resultado.

No conviertas una recomendación específica de una marca en una regla universal.

---

# Material complementario

[Descargar todos los materiales del Módulo 2](/downloads/programacion-ia/modulo-2/programacion-ia-modulo-2-materiales.zip)

[Descargar FICHA_PROMPT_TECNICO.md](/downloads/programacion-ia/modulo-2/FICHA_PROMPT_TECNICO.md)

[Descargar GUION_CONVERSACION.md](/downloads/programacion-ia/modulo-2/GUION_CONVERSACION.md)

[Descargar PAQUETE_CONTEXTO.md](/downloads/programacion-ia/modulo-2/PAQUETE_CONTEXTO.md)

[Descargar BIBLIOTECA_PROMPTS.md](/downloads/programacion-ia/modulo-2/BIBLIOTECA_PROMPTS.md)

Este módulo incluye cuatro plantillas editables:

1. **Ficha de prompt técnico.**
2. **Guion de conversación por etapas.**
3. **Paquete de contexto y continuidad.**
4. **Biblioteca de prompts técnicos.**

Los archivos se encuentran en `materiales_programacion_ia_modulo_2`. Utilízalos como punto de partida y elimina cualquier campo que no corresponda a la tarea.

No se requiere un PDF adicional.

---

# Glosario

**Prompt técnico:** instrucción que define una tarea de programación con contexto, límites y resultado verificable.

**Objetivo:** resultado concreto que se desea alcanzar en una etapa.

**Contexto:** información relevante que permite interpretar la tarea.

**Entorno:** lenguaje, versión, dependencias y condiciones donde se ejecuta el proyecto.

**Requisito:** comportamiento que la solución debe ofrecer.

**Restricción:** límite que condiciona la solución.

**Criterio de aceptación:** condición observable utilizada para comprobar un requisito.

**Ejemplo positivo:** entrada que representa un comportamiento aceptado.

**Ejemplo negativo:** entrada que debe rechazarse o producir una respuesta controlada.

**Contraejemplo:** caso que demuestra que una interpretación general no siempre es válida.

**Intención:** tipo de resultado solicitado, como explicación, plan, código, revisión o pruebas.

**Pregunta bloqueante:** pregunta cuya respuesta es necesaria antes de implementar correctamente.

**Etapa:** unidad limitada de trabajo con un resultado verificable.

**Fragmento mínimo reproducible:** código y evidencia mínimos necesarios para observar un problema.

**Interfaz pública:** forma en que otras partes utilizan una función, clase o componente.

**Diff:** representación de líneas agregadas, eliminadas y modificadas.

**Prueba de regresión:** prueba que confirma que un comportamiento anterior sigue funcionando después de un cambio.

**Punto de control:** resumen de decisiones vigentes, pruebas y tarea siguiente.

**Paquete de contexto:** selección de documentos y fragmentos necesarios para una tarea.

**Desvío de contexto:** situación en la que una conversación comienza a utilizar decisiones antiguas, requisitos incorrectos o tareas fuera del alcance.

---

# Resumen del módulo

Un prompt útil no depende de palabras mágicas. Depende de una tarea bien definida.

La ficha técnica puede incluir:

```text
Objetivo
Contexto
Entorno
Entradas y salidas
Reglas
Restricciones
Ejemplos
Formato de respuesta
Criterios de aceptación
```

El proceso profesional separa intenciones:

```text
Aclarar → proponer → elegir → implementar → verificar → mejorar
```

Durante una conversación debes:

- resolver preguntas bloqueantes;
- dividir el problema;
- solicitar una sola etapa;
- ejecutar antes de continuar;
- preservar interfaces;
- revisar diferencias;
- registrar decisiones;
- resumir el contexto vigente;
- abrir un chat nuevo cuando el historial deje de ser útil.

El objetivo no es lograr que la IA produzca más código. Es lograr que cada respuesta sea más fácil de comprender, comprobar y corregir.

---

# Checklist antes de entregar

## Ejercicios

- [ ] Completé los ocho ejercicios.
- [ ] Separé intenciones mezcladas.
- [ ] Convertí adjetivos en condiciones observables.
- [ ] Incluí preguntas bloqueantes y criterios.

## Mini proyecto

- [ ] Creé las siete plantillas obligatorias.
- [ ] Cada plantilla indica cuándo usarla y cómo validar.
- [ ] Eliminé promesas de garantías absolutas.
- [ ] Completé y probé un ejemplo.

## Proyecto principal

- [ ] Escribí el problema antes de solicitar código.
- [ ] Preparé un guion con al menos siete etapas.
- [ ] Pedí preguntas sin código.
- [ ] Pedí un plan y elegí una alternativa.
- [ ] Conservé V1, V2 y V3.
- [ ] Ejecuté CP-01 a CP-16.
- [ ] El cambio del 15 % conserva los casos anteriores.
- [ ] Solicité y revisé un cambio mínimo.
- [ ] Registré al menos una propuesta rechazada.
- [ ] Realicé una corrección manual.
- [ ] Preparé el resumen final de contexto.

## Seguridad y evidencia

- [ ] No compartí datos personales, credenciales ni código privado sin autorización.
- [ ] Diferencié respuestas sugeridas y resultados ejecutados.
- [ ] Las capturas no contienen información sensible.
- [ ] Puedo explicar el código y las decisiones.

## Evaluación y archivos

- [ ] Resolví la evaluación práctica.
- [ ] Los archivos tienen nombres claros.
- [ ] El proyecto se ejecuta desde la copia que entregaré.
- [ ] El `.zip` abre correctamente.

---

# Entrega de la actividad

Utiliza un único punto de entrega para todo el Módulo 2.

## Qué debes entregar

- ocho ejercicios obligatorios;
- biblioteca con siete plantillas;
- ejemplo completado y validado;
- documento del problema;
- guion de conversación;
- historial organizado de prompts;
- decisiones aceptadas y rechazadas;
- código de V1, V2 y V3;
- casos CP-01 a CP-16 con resultados;
- evidencias de ejecución;
- corrección manual documentada;
- resumen final de contexto;
- bitácora de uso de IA;
- evaluación práctica.

## Estructura recomendada

```text
COA_IA_M2_Nombre_Apellido/
├── 01_ejercicios/
│   └── ejercicios.md
├── 02_mini_proyecto/
│   ├── biblioteca_prompts.md
│   ├── ejemplo_completado.md
│   └── evidencia_validacion.md
├── 03_proyecto/
│   ├── 01_problema.md
│   ├── 02_guion.md
│   ├── 03_historial_prompts.md
│   ├── 04_decisiones.md
│   ├── 05_casos_prueba.md
│   ├── 06_contexto_final.md
│   ├── bitacora_ia.md
│   ├── versiones/
│   │   ├── v1_validacion/
│   │   ├── v2_calculo/
│   │   └── v3_descuento_15/
│   └── evidencias/
└── 04_evaluacion/
    └── evaluacion_modulo_2.md
```

## Formato

- Comprime la carpeta en `.zip`.
- Incluye archivos fuente, no únicamente capturas.
- Utiliza `.md`, `.txt` o `.pdf` para documentos.
- Utiliza `.png`, `.jpg` o `.pdf` para evidencias visuales.
- No incluyas dependencias instaladas, entornos virtuales, archivos temporales ni credenciales.

## Nombre del archivo

```text
COA_IA_M2_Nombre_Apellido.zip
```

Ejemplo:

```text
COA_IA_M2_Daniel_Mora.zip
```

## Antes de enviar

1. Descomprime una copia.
2. Comprueba que las tres versiones están presentes.
3. Ejecuta V3 desde la copia.
4. Revisa que los resultados CP-01 a CP-16 sean legibles.
5. Confirma que el resumen final coincide con el código.
6. Comprueba que no existe información sensible.
7. Envía el archivo mediante el botón **Enviar actividad**.

[Entregar Módulo 2](https://forms.gle/nTx97JRkFkbH5Vfr6)

Si necesitas presentar una corrección, conserva la estructura y agrega la versión:

```text
COA_IA_M2_Nombre_Apellido_v2.zip
```

---

# Habilidades obtenidas

Al aprobar este módulo podrás:

- redactar prompts técnicos claros y verificables;
- transformar ideas en requisitos y criterios;
- separar preguntas, planificación, código, revisión y pruebas;
- dirigir conversaciones por etapas;
- dividir tareas grandes;
- limitar archivos y cambios;
- conservar interfaces y comportamiento;
- utilizar ejemplos positivos y negativos;
- pedir y revisar diffs pequeños;
- recuperar conversaciones desviadas;
- resumir decisiones para continuar en otra sesión;
- crear plantillas adaptables;
- demostrar con evidencia cómo influyó la IA en el desarrollo.

En el siguiente módulo aplicarás estas conversaciones para construir y modificar funciones, clases, componentes y estructuras de software con asistencia continua de IA.
