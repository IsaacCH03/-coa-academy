# Módulo 1. Fundamentos del desarrollo asistido por Inteligencia Artificial

**Curso:** Programación Asistida por Inteligencia Artificial  
**Duración estimada:** 2 horas  
**Modalidad:** Autodidacta  
**Nivel:** Intermedio  
**Proyecto del módulo:** Validador de pedidos y descuentos  
**Lenguaje:** El lenguaje de programación que ya conoces

---

# Introducción

Una herramienta de Inteligencia Artificial puede producir código en pocos segundos. Esa velocidad resulta útil, pero no garantiza que el resultado:

- resuelva el problema correcto;
- funcione con todos los datos;
- utilice las versiones instaladas en tu proyecto;
- respete tus restricciones;
- sea seguro;
- sea fácil de mantener;
- pueda explicarse;
- haya sido probado.

Programar con asistencia de IA no significa entregar el razonamiento a una herramienta. Significa utilizarla para acelerar partes concretas del trabajo mientras conservas el control de las decisiones.

```text
La IA puede proponer.
La documentación puede confirmar.
Las pruebas pueden aportar evidencia.
Tú debes decidir.
```

En este módulo aprenderás un flujo de trabajo mínimo para utilizar asistentes como ChatGPT, Claude, Gemini, GitHub Copilot o herramientas equivalentes sin convertirte en una persona que únicamente copia y pega.

No importa cuál elijas. Las interfaces, los modelos, los límites gratuitos y los nombres de las funciones pueden cambiar. El método profesional que aprenderás permanece:

```text
Analizar → preguntar → leer → ejecutar → probar → decidir
```

Este módulo no busca encontrar una herramienta “ganadora”. Busca que puedas reconocer para qué sirve cada tipo de asistente, qué información no debes compartir y qué evidencia necesitas antes de aceptar una propuesta.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- explicar qué significa desarrollar software con asistencia de IA;
- distinguir entre un chat, un autocompletado, un asistente dentro del editor y una herramienta capaz de modificar archivos;
- elegir una herramienta según la tarea;
- reconocer tareas apropiadas y tareas de alto riesgo;
- formular una solicitud pequeña y comprobable;
- detectar suposiciones ocultas en una respuesta;
- identificar señales de código insuficiente o peligroso;
- comparar dos propuestas mediante criterios objetivos;
- proteger credenciales, datos personales y código privado;
- ejecutar casos normales, casos límite y casos inválidos;
- corregir manualmente una debilidad de una solución generada;
- documentar con honestidad cómo utilizaste la IA;
- defender las decisiones incluidas en tu código.

---

# Conocimientos previos

Para completar las actividades necesitas:

- conocer variables, condicionales, ciclos y funciones;
- poder leer y modificar código en al menos un lenguaje;
- saber ejecutar un programa sencillo;
- contar con un editor o IDE;
- tener acceso a un asistente conversacional gratuito.

Git y GitHub Copilot son útiles, pero no son obligatorios en este módulo. Puedes realizar todas las actividades con dos conversaciones independientes dentro de una misma herramienta.

---

# Preparación del entorno

Antes de comenzar, prepara lo siguiente:

1. Abre el editor o IDE que utilizas normalmente.
2. Comprueba que puedes crear y ejecutar un programa en tu lenguaje.
3. Elige un asistente conversacional:
   - ChatGPT;
   - Claude;
   - Gemini;
   - otra alternativa disponible y autorizada.
4. Crea una carpeta llamada `coa_ia_modulo_1`.
5. Dentro de esa carpeta crea un documento llamado `bitacora_ia.md` o `bitacora_ia.txt`.
6. No cargues todavía ningún proyecto personal, empresarial o académico completo.

La cuenta gratuita de una sola herramienta es suficiente. Si comparas respuestas, puedes usar dos chats nuevos en la misma herramienta.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Conceptos esenciales y práctica guiada | 30 minutos |
| Ejercicios individuales | 15 minutos |
| Mini proyecto | 20 minutos |
| Proyecto del módulo | 35 minutos |
| Evaluación práctica, revisión y entrega | 20 minutos |
| **Total estimado** | **2 horas** |

La duración es una referencia. Repetir una prueba, corregir un error o investigar una función forma parte del aprendizaje. No avances únicamente para cumplir el tiempo.

---

# 1. ¿Qué significa programar con asistencia de IA?

Programar con asistencia de IA consiste en incorporar una herramienta capaz de producir o transformar texto y código dentro de un proceso dirigido por una persona.

La diferencia más importante no está en la herramienta. Está en quién controla el proceso.

## Uso dependiente

```text
Problema poco claro
      ↓
“Hazme el programa completo”
      ↓
Copiar y pegar
      ↓
Esperar que funcione
```

En este flujo no existe una forma clara de saber:

- qué requisitos entendió la herramienta;
- qué supuestos agregó;
- qué partes son correctas;
- qué ocurrirá con datos inesperados;
- cómo corregir el código después.

## Uso profesional

```text
Problema comprendido
      ↓
Requisitos y límites
      ↓
Tarea pequeña
      ↓
Propuesta de la IA
      ↓
Lectura del código
      ↓
Ejecución y pruebas
      ↓
Corrección
      ↓
Decisión consciente
```

En este segundo flujo, la herramienta acelera una tarea. No sustituye la comprensión del problema ni la validación del resultado.

## Analogía: un colaborador rápido que necesita contexto

Imagina que una persona se incorpora a un proyecto y programa con mucha rapidez, pero:

- no asistió a las reuniones;
- no conoce a los usuarios;
- no sabe qué versión utiliza el proyecto;
- no puede observar el entorno completo;
- intenta completar la información que falta.

Podría ayudarte mucho si recibe una tarea precisa. También podría construir algo incorrecto con absoluta seguridad si la solicitud es ambigua.

Un asistente de IA se utiliza mejor con esa expectativa: rapidez para proponer, necesidad permanente de contexto, revisión y pruebas.

---

# 2. Cuatro formas de asistencia

No todas las herramientas trabajan de la misma forma. Elegir la categoría adecuada evita compartir información de más o conceder permisos innecesarios.

| Categoría | Cómo interactúas | Uso apropiado | Riesgo principal |
|---|---|---|---|
| Asistente conversacional | Escribes mensajes en un chat | Explicar, planificar, comparar, revisar fragmentos | Proporcionar contexto insuficiente o compartir datos sensibles |
| Autocompletado | Recibes sugerencias mientras escribes | Completar patrones breves y código repetitivo | Aceptar una sugerencia sin leerla |
| Chat dentro del editor | Formula respuestas utilizando archivos seleccionados o el contexto abierto | Preguntar por código cercano y solicitar cambios limitados | Incluir archivos que no eran necesarios |
| Herramienta con capacidad de actuar | Puede proponer o efectuar cambios en varios archivos y ejecutar acciones | Tareas delimitadas con revisión de diferencias | Modificaciones extensas, comandos peligrosos o pérdida de control |

## 2.1 Asistente conversacional

Ejemplos habituales: ChatGPT, Claude y Gemini.

Es especialmente útil para:

- convertir una idea en requisitos;
- explicar un fragmento;
- proponer alternativas;
- generar casos de prueba;
- revisar una función pequeña;
- redactar documentación inicial.

El chat solo conoce el contexto que tiene disponible. Si no proporcionas una regla, puede asumirla. Si compartes demasiado, puedes exponer información que no necesitaba.

## 2.2 Autocompletado

El autocompletado propone texto cerca del cursor. GitHub Copilot y otros asistentes integrados pueden ofrecer esta experiencia.

Es útil para:

- completar una estructura repetitiva;
- continuar un patrón visible;
- generar una condición sencilla;
- reducir escritura mecánica.

Una sugerencia visible no es una decisión técnica. Antes de aceptarla, lee toda la expresión y comprueba:

- los nombres utilizados;
- las condiciones;
- los límites;
- los efectos secundarios;
- el manejo de errores.

## 2.3 Chat dentro del editor

Puede consultar archivos abiertos, texto seleccionado u otra parte del proyecto, según la herramienta y los permisos concedidos.

Resulta útil cuando la pregunta depende de código existente:

> Explica qué entradas acepta esta función y señala una ruta que no devuelve ningún valor. No modifiques el archivo.

La selección “No modifiques el archivo” reduce el alcance. Primero puedes pedir análisis; después, un cambio pequeño.

## 2.4 Herramienta capaz de actuar

Algunas herramientas pueden crear archivos, modificar varias partes del proyecto o ejecutar comandos. Esa capacidad aumenta la velocidad y también el riesgo.

Antes de autorizar una acción, verifica:

- qué archivos podrá leer;
- qué archivos propone cambiar;
- qué comando pretende ejecutar;
- si existe una copia o un commit recuperable;
- si el cambio puede revisarse por partes;
- si la acción afecta datos reales;
- si requiere acceso a internet o credenciales.

```text
Más capacidad de acción = más necesidad de límites y revisión
```

En este curso no se evaluará cuánta autonomía concediste a una herramienta. Se evaluará cuánto control conservaste sobre el resultado.

---

# 3. Panorama práctico de herramientas

Las funciones disponibles dependen del plan, la región, el editor y la fecha. Utiliza esta comparación para elegir una forma de trabajo, no para asumir que una función específica estará siempre disponible.

| Herramienta o familia | Forma de uso habitual | Buena elección cuando necesitas |
|---|---|---|
| ChatGPT | Conversación y análisis de contenido aportado | Explicar, comparar, estructurar una tarea y revisar propuestas |
| Claude | Conversación y trabajo con contexto aportado | Analizar, redactar, comparar y revisar código o documentos |
| Gemini | Conversación y asistencia integrada en productos compatibles | Explicar, idear, revisar o trabajar dentro de un entorno compatible |
| GitHub Copilot | Sugerencias y chat dentro de editores compatibles | Completar código y trabajar cerca de los archivos del proyecto |
| Herramientas equivalentes | Chat, editor o flujo con acciones | Resolver la misma categoría de tarea con controles semejantes |

No necesitas utilizar todas. Cambiar de herramienta constantemente puede consumir más tiempo del que ahorra.

## Criterio de selección

Antes de elegir, responde:

1. ¿La tarea requiere conocer archivos del proyecto?
2. ¿Puedo proporcionar un fragmento mínimo en un chat?
3. ¿Solo necesito completar un patrón visible?
4. ¿La información puede compartirse con esa herramienta?
5. ¿Necesito una explicación o una modificación?
6. ¿Puedo revisar y revertir cada cambio?

### Ejemplos de elección

| Necesidad | Opción razonable |
|---|---|
| Comprender una función de 20 líneas | Chat con el fragmento mínimo o chat del editor |
| Completar cinco validaciones semejantes | Autocompletado |
| Comparar dos diseños antes de programar | Asistente conversacional |
| Corregir una palabra en varios archivos | Herramienta integrada, con revisión de diferencias |
| Investigar una función de una biblioteca | Documentación oficial primero; IA como apoyo para interpretarla |
| Trabajar con credenciales reales | No compartirlas; sustituirlas por valores ficticios |

---

# 4. Qué puede aportar la IA

Una herramienta de IA suele aportar más valor cuando la tarea es concreta, tiene límites visibles y permite comprobar el resultado.

## Explicar

Puede describir:

- el propósito de una función;
- el recorrido de los datos;
- la causa posible de un error;
- las diferencias entre dos propuestas.

La explicación debe contrastarse con el código. Una descripción clara puede omitir una ruta de ejecución.

## Proponer

Puede sugerir:

- una estructura inicial;
- nombres;
- casos de prueba;
- alternativas;
- una secuencia de pasos.

Una propuesta es un punto de partida, no una obligación.

## Transformar

Puede ayudar a:

- convertir una condición extensa en funciones pequeñas;
- cambiar el formato de datos;
- adaptar un fragmento a una convención;
- reducir repetición.

Toda transformación necesita pruebas que demuestren que el comportamiento importante se conserva.

## Revisar

Puede señalar:

- duplicación;
- nombres poco claros;
- validaciones ausentes;
- ramas difíciles de alcanzar;
- posibles casos límite.

La revisión de IA complementa, pero no reemplaza, la lectura humana ni las herramientas del lenguaje.

## Depurar

Puede interpretar un mensaje de error y proponer hipótesis. La respuesta mejora cuando incluyes:

- el error exacto;
- el fragmento mínimo;
- el resultado esperado;
- el resultado real;
- los pasos para reproducirlo.

La depuración completa se trabajará en el Módulo 4.

## Documentar

Puede generar un primer borrador de:

- comentarios útiles;
- instrucciones de ejecución;
- descripciones de funciones;
- README;
- listas de cambios.

Debes corregir cualquier afirmación que no coincida con el proyecto real.

---

# 5. Lo que la IA no puede garantizar

## 5.1 Que comprendió el problema real

Si escribes:

> Crea un sistema de descuentos para una tienda.

quedan preguntas sin responder:

- ¿El descuento depende del subtotal o de la cantidad?
- ¿Los descuentos se acumulan?
- ¿Qué sucede en el valor exacto del límite?
- ¿Se aceptan cantidades negativas?
- ¿Cómo se redondea el dinero?
- ¿Existe un descuento máximo?

La herramienta puede inventar respuestas para continuar.

## 5.2 Que conoce tu entorno

El código puede depender de:

- una versión distinta del lenguaje;
- una biblioteca que no instalaste;
- una función inexistente;
- un sistema operativo diferente;
- una estructura de archivos que tu proyecto no utiliza.

## 5.3 Que el código está probado

Una respuesta con ejemplos no demuestra que esos ejemplos hayan sido ejecutados.

```text
“Debería funcionar” ≠ “fue ejecutado y produjo este resultado”
```

## 5.4 Que la respuesta está actualizada

Las bibliotecas, herramientas, precios, límites y políticas cambian. Para información dependiente de una versión, consulta documentación oficial vigente.

## 5.5 Que el resultado es seguro

La herramienta puede proponer:

- guardar contraseñas en texto plano;
- desactivar una validación;
- ejecutar un comando destructivo;
- construir consultas inseguras;
- registrar datos personales;
- instalar una dependencia innecesaria.

## 5.6 Que tienes permiso para usar todo el resultado

Un fragmento sugerido puede parecerse a código público o incorporar una licencia incompatible con tu proyecto. En trabajos profesionales debes revisar:

- procedencia;
- licencia de dependencias;
- política de la organización;
- condiciones de la herramienta;
- requisitos de atribución.

Si la procedencia o los derechos no están claros, no integres el fragmento hasta verificarlos.

---

# 6. La responsabilidad permanece contigo

Imagina que un programa calcula descuentos incorrectos y ocasiona pérdidas. “La IA escribió esa parte” no cambia el efecto del error.

Quien incorpora una propuesta debe poder responder:

- ¿Qué problema resuelve?
- ¿Qué datos acepta?
- ¿Qué datos rechaza?
- ¿Qué supuestos utiliza?
- ¿Qué pruebas se ejecutaron?
- ¿Qué riesgos quedan pendientes?
- ¿Cómo se revierte el cambio?

## Regla de comprensión

No incluyas en una entrega código que no puedas:

1. explicar con tus propias palabras;
2. ejecutar;
3. probar;
4. modificar de forma pequeña;
5. eliminar si deja de ser necesario.

## Regla de evidencia

La confianza debe aumentar mediante evidencia:

```text
La respuesta parece convincente
                ↓
Puedo leer y explicar el código
                ↓
El programa se ejecuta
                ↓
Supera casos normales
                ↓
Supera casos límite e inválidos
                ↓
Coincide con documentación vigente
                ↓
Es apropiado para el proyecto
```

No todas las tareas requieren la misma profundidad, pero “parece correcto” nunca es la última etapa.

---

# 7. Flujo mínimo de trabajo: A-P-L-E-P-D

Utiliza estas seis acciones cada vez que una respuesta influya en tu código.

```text
A  Analizar el problema
P  Preguntar con límites
L  Leer toda la respuesta
E  Ejecutar en un entorno controlado
P  Probar con evidencia
D  Decidir si aceptar, corregir o descartar
```

## Paso 1. Analizar

Antes de abrir el asistente, escribe:

- objetivo;
- entradas;
- salidas;
- reglas;
- restricciones;
- ejemplos;
- dudas pendientes.

Si no puedes describir el problema, todavía no es momento de pedir código.

## Paso 2. Preguntar

Entrega únicamente el contexto necesario. Indica:

- lenguaje y versión, cuando importe;
- comportamiento esperado;
- restricciones;
- formato de respuesta;
- aquello que no debe cambiar.

En el Módulo 2 aprenderás a diseñar conversaciones técnicas completas. Por ahora basta con evitar peticiones abiertas.

## Paso 3. Leer

Lee antes de copiar. Busca:

- dependencias nuevas;
- nombres que no existen;
- reglas inventadas;
- condiciones faltantes;
- operaciones destructivas;
- comentarios que prometen más de lo que hace el código.

## Paso 4. Ejecutar

Ejecuta en un entorno de práctica. No pruebes por primera vez sobre:

- datos reales;
- la rama principal de un proyecto;
- un servidor de producción;
- la única copia de un archivo;
- una cuenta con permisos amplios.

## Paso 5. Probar

Incluye como mínimo:

- un caso normal;
- un caso en cada límite;
- un caso inválido;
- un caso vacío, cuando tenga sentido.

## Paso 6. Decidir

Solo existen tres decisiones profesionales:

| Decisión | Cuándo utilizarla |
|---|---|
| Aceptar | Comprendes la propuesta y existe evidencia suficiente |
| Corregir | La base sirve, pero contiene una debilidad identificada |
| Descartar | El enfoque es incorrecto, innecesario, inseguro o difícil de mantener |

Descartar una respuesta también es utilizar bien la IA.

---

# 8. Suposiciones: la fuente silenciosa de errores

Una suposición es una decisión tomada sin que el requisito la indique.

## Ejemplo

Solicitud:

> Crea una función que aplique descuento a una compra mayor de 100.

Posibles suposiciones:

- “mayor de 100” excluye exactamente 100;
- el descuento es del 10 %;
- el valor recibido ya es válido;
- la moneda utiliza dos decimales;
- el resultado nunca puede ser negativo;
- existe un único descuento;
- no se necesita indicar por qué fue rechazado un dato.

La herramienta puede elegir cualquiera de estas opciones sin avisar.

## Técnica: inventario de supuestos

Antes de integrar código, completa esta tabla:

| Supuesto detectado | ¿Está confirmado? | Riesgo | Decisión |
|---|---|---|---|
| El límite incluye 100 | Sí | Bajo | Mantener |
| El dato siempre es numérico | No | Medio | Agregar validación |
| Los descuentos se acumulan | No | Alto | Definir regla explícita |

También puedes pedir ayuda:

> No escribas código. Enumera únicamente la información que falta y las suposiciones que sería peligroso realizar.

La lista producida sigue necesitando tu revisión.

---

# 9. Señales de una respuesta peligrosa o insuficiente

Detente y revisa con mayor profundidad cuando una respuesta:

- afirma que el código es “100 % correcto” sin ejecutarlo;
- inventa archivos, funciones o bibliotecas;
- cambia requisitos sin indicarlo;
- agrega dependencias para una tarea que el lenguaje ya resuelve;
- solicita credenciales reales;
- desactiva validaciones para eliminar un error;
- captura todos los errores y los oculta;
- modifica muchas partes sin justificarlo;
- propone comandos que borran o sobrescriben información;
- no diferencia datos de prueba y datos reales;
- devuelve código que no puedes explicar;
- cita documentación inexistente;
- entrega pruebas que nunca fueron ejecutadas;
- utiliza una API obsoleta para tu versión;
- ignora casos límite;
- cambia el comportamiento mientras asegura que solo “limpió” el código.

## Semáforo de decisión

| Nivel | Situación | Acción |
|---|---|---|
| Verde | Cambio pequeño, reversible y comprobable | Leer, ejecutar y probar |
| Amarillo | Dependencia nueva, varios archivos o lógica sensible | Consultar documentación y revisar por partes |
| Rojo | Secretos, dinero real, autenticación, datos personales, borrado o producción | Detenerse y requerir revisión especializada y autorización |

La IA puede ayudar a estudiar una tarea de nivel rojo, pero no debe decidir ni ejecutar por sí sola.

---

# 10. Privacidad y seguridad antes de enviar un mensaje

El contexto ayuda a obtener mejores respuestas. Sin embargo, más contexto no siempre significa mejor trabajo.

## No compartas

- contraseñas;
- claves de API;
- tokens de acceso;
- cookies de sesión;
- archivos `.env`;
- claves privadas;
- datos bancarios;
- datos personales de clientes;
- expedientes médicos;
- bases de datos reales;
- direcciones internas;
- repositorios privados sin autorización;
- código confidencial que no tienes permiso de enviar.

## Sustituye los datos sensibles

En lugar de esto:

```text
API_KEY=sk_valor_real
cliente=María Gómez
correo=maria@empresa-real.com
```

utiliza:

```text
API_KEY=CLAVE_FICTICIA
cliente=Cliente Ejemplo
correo=cliente@example.com
```

## Comparte el fragmento mínimo

Si el problema está en una función de 15 líneas, empieza por esa función, el error exacto y una entrada reproducible. No cargues todo el repositorio por costumbre.

## Revisa la configuración y los términos vigentes

Los controles de datos, el uso de conversaciones, la retención y las opciones para cuentas personales o empresariales pueden cambiar. Antes de utilizar una herramienta con información de un proyecto:

1. consulta sus controles de privacidad actuales;
2. identifica qué tipo de cuenta utilizas;
3. comprueba la política de tu organización;
4. solicita autorización cuando corresponda;
5. asume que desactivar una opción no convierte en apropiado compartir secretos.

## Si compartiste un secreto por accidente

No basta con borrar el mensaje. Actúa como si la credencial hubiese quedado expuesta:

1. revócala o rótala;
2. reemplázala en el sistema;
3. revisa registros de uso;
4. informa mediante el procedimiento correspondiente;
5. elimina el secreto del historial del proyecto y del control de versiones.

---

# 11. Propiedad intelectual y dependencias

La velocidad no elimina la obligación de revisar qué entra al proyecto.

Antes de incorporar una propuesta externa, pregunta:

- ¿Agregó una biblioteca?
- ¿La biblioteca es necesaria?
- ¿Cuál es su licencia?
- ¿Tiene mantenimiento y documentación?
- ¿La versión es compatible?
- ¿El fragmento reproduce código público?
- ¿Debo conservar una atribución?
- ¿La política del proyecto permite utilizarlo?

No pidas “la solución exacta de un repositorio”. Solicita una solución basada en requisitos y evita copiar fragmentos cuya procedencia no puedas aclarar.

Este curso no sustituye asesoría legal. En un proyecto profesional, sigue las políticas y licencias aplicables.

---

# 12. Errores comunes al comenzar

## Error 1. Pedir el programa completo

```text
Hazme un sistema de ventas profesional.
```

El alcance es indefinido y el resultado será difícil de revisar.

Mejor:

```text
Primero no escribas código. Enumera las preguntas necesarias para definir
el cálculo del total de una venta. Limita la respuesta a entradas, reglas,
salidas y casos inválidos.
```

## Error 2. Copiar antes de leer

Una respuesta extensa crea una falsa sensación de avance. El progreso real comienza cuando puedes explicar y ejecutar cada parte.

## Error 3. Ocultar el resultado real

Decir “no funciona” obliga a adivinar. Conserva:

- mensaje exacto;
- entrada utilizada;
- salida obtenida;
- salida esperada;
- cambio más reciente.

## Error 4. Aceptar dependencias innecesarias

Una biblioteca adicional implica instalación, versiones, actualizaciones y licencias. Para una tarea pequeña, pregunta si la biblioteca estándar o el propio lenguaje son suficientes.

## Error 5. Probar solo el ejemplo feliz

Una función puede trabajar con `10` y fallar con `0`, un valor negativo, un dato vacío o el valor exacto del límite.

## Error 6. Entregar una conversación como prueba

La frase “la IA dice que funciona” no es evidencia. Una prueba ejecutada sí lo es.

## Error 7. Compartir todo el proyecto

Más archivos pueden introducir ruido, elevar el riesgo de privacidad y dificultar que la herramienta enfoque el error.

## Error 8. Conservar código que no puedes modificar

Si un cambio pequeño obliga a volver a pedir la solución completa, existe dependencia. Detente, reduce el código y comprende la parte necesaria.

---

# 13. Práctica guiada: una solicitud vaga y una solicitud comprobable

Trabajarás con un cálculo de costo de envío. Puedes solicitar pseudocódigo o código en el lenguaje que conoces.

## Reglas del problema

- El peso debe ser mayor que `0` y menor o igual que `20` kilogramos.
- Hasta `2` kg, el envío cuesta `4`.
- Más de `2` kg y hasta `5` kg, cuesta `7`.
- Más de `5` kg y hasta `20` kg, cuesta `12`.
- El envío exprés agrega `3`.
- Un peso inválido debe producir un error claro, no un precio.

## Paso 1. Realiza una solicitud vaga

Abre un chat nuevo y escribe:

```text
Crea una función para calcular el costo de un envío.
```

No incorpores el código. Registra:

- qué reglas inventó;
- qué entradas asumió;
- si agregó bibliotecas;
- cómo trató valores inválidos;
- si afirmó que funcionaba.

## Paso 2. Realiza una solicitud delimitada

En otro chat escribe:

```text
Necesito una función en [LENGUAJE] para calcular un costo de envío.

Reglas:
- peso mayor que 0 y menor o igual que 20 kg;
- hasta 2 kg: 4;
- más de 2 y hasta 5 kg: 7;
- más de 5 y hasta 20 kg: 12;
- si es exprés, sumar 3;
- un peso inválido debe producir un error claro.

No uses bibliotecas externas. Antes del código, enumera las entradas,
la salida y los límites. Después del código, propone seis casos de prueba.
No afirmes que el código fue ejecutado.
```

Reemplaza `[LENGUAJE]` por el que utilizas.

## Paso 3. Lee antes de ejecutar

Comprueba:

- si `2`, `5` y `20` pertenecen al tramo correcto;
- si `0`, un negativo y más de `20` se rechazan;
- si el recargo exprés se aplica una sola vez;
- si los casos propuestos coinciden con las reglas;
- si el código utiliza funciones disponibles en tu entorno.

## Paso 4. Ejecuta tus propios casos

Como mínimo prueba:

| Caso | Peso | Exprés | Resultado esperado |
|---|---:|---|---|
| Normal 1 | `1.5` | No | `4` |
| Límite 1 | `2` | Sí | `7` |
| Límite 2 | `5` | No | `7` |
| Límite 3 | `20` | Sí | `15` |
| Inválido 1 | `0` | No | Error claro |
| Inválido 2 | `20.1` | No | Error claro |

## Paso 5. Toma una decisión

Escribe una de estas conclusiones y justifícala:

- aceptar;
- corregir;
- descartar.

## Resultado de la práctica

La segunda solicitud no es mejor porque sea más larga. Es mejor porque permite comparar el código con reglas visibles.

---

# 14. Cómo comparar dos respuestas

No compares por simpatía, velocidad o cantidad de texto. Utiliza los mismos criterios.

## Matriz de comparación

Califica cada criterio de `0` a `2`:

| Criterio | 0 puntos | 1 punto | 2 puntos |
|---|---|---|---|
| Corrección | Incumple reglas | Cumple algunas | Cumple todas las reglas probadas |
| Claridad | No puedes explicarla | Requiere simplificación | Puedes explicarla por completo |
| Complejidad | Agrega estructura innecesaria | Tiene detalles discutibles | Es proporcional al problema |
| Supuestos | Los oculta | Declara algunos | Expone dudas y evita inventar |
| Facilidad de prueba | Difícil de aislar | Parcialmente comprobable | Entradas y salidas claras |
| Dependencias | Agrega dependencias sin necesidad | Una dependencia dudosa | No agrega dependencias innecesarias |

La propuesta con más puntos tampoco debe aceptarse automáticamente. Una sola falla crítica puede invalidarla.

## Regla de comparación justa

Para comparar herramientas o conversaciones:

- utiliza el mismo problema;
- proporciona el mismo contexto;
- aplica los mismos casos;
- registra la versión o fecha si está disponible;
- separa gusto personal de evidencia;
- no declares un ganador universal.

---

# 15. Bitácora mínima de uso de IA

La bitácora demuestra cómo influyó la herramienta en el trabajo. No necesita contener saludos ni mensajes irrelevantes.

Utiliza esta tabla:

| Tarea | Herramienta | Contexto compartido | Propuesta recibida | Cómo la validaste | Cambio manual | Decisión |
|---|---|---|---|---|---|---|
| Calcular envío | Chat A | Reglas ficticias, sin datos privados | Función y seis casos | Ejecuté límites | Corregí condición de 20 kg | Corregir e integrar |

## Qué debes conservar

- prompts que cambiaron el resultado;
- respuestas o extractos relevantes;
- decisiones tomadas;
- pruebas ejecutadas;
- correcciones manuales;
- propuestas descartadas y su motivo.

## Qué no necesitas conservar

- saludos;
- repeticiones sin efecto;
- texto no relacionado;
- secretos eliminados de una captura;
- conversaciones privadas ajenas al proyecto.

Una captura puede servir como evidencia visual, pero el texto copiable facilita la revisión y protege mejor la legibilidad.

---

# Ejercicios individuales obligatorios

Completa los seis ejercicios. Registra las respuestas en `ejercicios.md` o `ejercicios.txt`.

## Ejercicio 1. Selecciona la forma de asistencia

Para cada situación, elige entre chat conversacional, autocompletado, chat del editor, herramienta con capacidad de actuar o ninguna herramienta de IA. Justifica cada decisión en una oración.

1. Necesitas comprender una función pequeña que no escribiste.
2. Estás completando diez estructuras casi idénticas.
3. Debes cambiar el nombre de una función utilizada en ocho archivos.
4. Un cliente te envió una base de datos con información personal real.
5. Quieres comparar dos formas de validar una entrada.
6. Debes confirmar si una función existe en la versión actual de una biblioteca.

En la última situación, indica cuál debe ser tu fuente principal.

## Ejercicio 2. Detecta información sensible

Lee el siguiente contexto ficticio:

```text
La aplicación falla al iniciar.
DATABASE_URL=postgres://admin:ClaveReal123@10.0.0.8/clientes
API_TOKEN=abc-123-secreto
Cliente afectado: Ana Pérez, identificación 1-1111-1111
Error: no se pudo establecer la conexión.
```

Escribe una versión segura del mensaje. Debe conservar la información técnica útil, reemplazar los datos sensibles y pedir únicamente un diagnóstico inicial.

Después, enumera qué credenciales tendrían que revocarse si fueran reales y ya se hubieran compartido.

## Ejercicio 3. Descubre los requisitos ausentes

Analiza esta petición:

> Haz una función que calcule una comisión para vendedores.

Escribe al menos ocho preguntas que deban responderse antes de programar. Incluye límites, datos inválidos, redondeo y salida esperada.

No solicites código.

## Ejercicio 4. Señala las afirmaciones sin evidencia

Una respuesta de IA indica:

> Esta solución está totalmente optimizada, funciona en cualquier versión, es segura y cubre todos los casos.

Escribe cuatro evidencias distintas que necesitarías para evaluar esas afirmaciones. No aceptes como evidencia otra explicación de la misma IA.

## Ejercicio 5. Mejora una solicitud sin hacerla extensa

Transforma esta petición:

> Corrige mi código porque no sirve.

La nueva solicitud debe incluir:

- lenguaje y versión, si se conocen;
- comportamiento esperado;
- resultado real;
- error exacto;
- fragmento mínimo;
- restricción de no modificar otras partes;
- petición de explicación antes del cambio.

Puedes utilizar datos ficticios.

## Ejercicio 6. Diseña casos que incomoden a la solución

Una función acepta una edad y permite el registro si la persona tiene al menos `18` años y como máximo `120`.

Escribe ocho casos de prueba. Debes incluir:

- un valor normal aceptado;
- ambos límites;
- un valor inmediatamente inferior al mínimo;
- un valor superior al máximo;
- cero;
- un valor negativo;
- un dato de tipo incorrecto.

Indica el resultado esperado de cada caso.

---

## Rúbrica de los ejercicios obligatorios

Cada ejercicio vale `2.5` puntos:

| Criterio por ejercicio | Puntos |
|---|---:|
| Respuesta completa y ajustada al enunciado | 1.0 |
| Decisión o razonamiento comprensible | 1.0 |
| Uso correcto del principio de seguridad o validación | 0.5 |

Para aprobar el módulo necesitas:

- obtener al menos `80/100`;
- aprobar el proyecto principal;
- entregar todos los archivos obligatorios;
- corregir cualquier fallo crítico;
- demostrar comprensión del código;
- documentar con honestidad el uso de IA.

No continúes al Módulo 2 hasta que esta entrega figure como aprobada.

---

<!-- coa-activity:programacion-ia-m1-ejercicios-obligatorios -->

# Reto adicional opcional

Elige una función breve de un proyecto propio que no contenga información privada.

1. Explícala con tus palabras.
2. Pide a una IA que la explique.
3. Marca cualquier afirmación que no pueda comprobarse en el código.
4. Pide tres casos límite.
5. Añade un caso que la herramienta no haya considerado.
6. Decide si la explicación te ayudó o solo repitió el código.

No entregues el proyecto completo. Incluye únicamente el fragmento utilizado y elimina nombres internos si fuera necesario.

---

# Mini proyecto. Comparador de soluciones asistidas

**Tiempo recomendado:** 20 minutos  
**Valor:** 20 puntos

## Situación

Una aplicación necesita calcular la tarifa de estacionamiento de una visita.

## Reglas

- La duración se recibe en minutos enteros.
- Debe ser mayor que `0` y menor o igual que `1440` minutos.
- Los primeros `60` minutos cuestan `2`.
- Después de los primeros `60` minutos, cada hora adicional iniciada cuesta `1.50`.
- La tarifa total nunca puede superar `12` durante esas 24 horas.
- Un valor vacío, no entero, igual a `0`, negativo o superior a `1440` debe producir un error claro.
- No se permiten bibliotecas externas.

Ejemplos:

| Minutos | Cálculo | Resultado esperado |
|---:|---|---:|
| `30` | Primeros 60 minutos | `2.00` |
| `60` | Primeros 60 minutos | `2.00` |
| `61` | Base + una hora adicional iniciada | `3.50` |
| `120` | Base + una hora adicional | `3.50` |
| `121` | Base + dos horas adicionales iniciadas | `5.00` |
| `1440` | Se aplica el máximo diario | `12.00` |

## Tu misión

Obtén dos propuestas independientes:

- opción A: utiliza dos asistentes diferentes; o
- opción B: utiliza dos chats nuevos dentro del mismo asistente.

Envía exactamente los mismos requisitos a ambos chats. Solicita una solución en el lenguaje que conoces y seis casos de prueba.

## Procedimiento

1. Copia las reglas sin agregar datos personales.
2. Solicita una función pequeña, no una aplicación completa.
3. Guarda el prompt y las dos respuestas relevantes.
4. Lee ambas propuestas sin ejecutarlas todavía.
5. Anota sus suposiciones y diferencias.
6. Ejecuta los seis ejemplos de la tabla.
7. Agrega al menos dos casos inválidos.
8. Califica las soluciones con la matriz del módulo.
9. Elige una propuesta o descarta ambas.
10. Escribe una conclusión de entre 80 y 150 palabras basada en evidencia.

## Entregables del mini proyecto

- `mini_proyecto/solucion_a` con el código de la primera propuesta;
- `mini_proyecto/solucion_b` con el código de la segunda propuesta;
- `mini_proyecto/comparacion.md` o `.txt`;
- evidencias de ejecución;
- conclusión.

## Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Las dos propuestas recibieron los mismos requisitos | 3 |
| La comparación utiliza criterios objetivos | 5 |
| Se ejecutan casos normales, límite e inválidos | 5 |
| La conclusión coincide con la evidencia | 4 |
| El proceso y los archivos se presentan con claridad | 3 |
| **Total** | **20** |

Una respuesta no obtiene una mejor calificación por provenir de una herramienta diferente. La evidencia debe determinar la decisión.

---


<!-- coa-activity:programacion-ia-m1-mini-proyecto -->

# Proyecto del módulo. Validador de pedidos y descuentos

**Tiempo recomendado:** 35 minutos  
**Valor:** 50 puntos

## Contexto

Una pequeña tienda necesita validar pedidos antes de calcular el total. Los pedidos pueden contener errores de captura y los descuentos deben aplicarse de forma uniforme.

Construirás una solución breve en el lenguaje que ya conoces. Puedes utilizar una IA para analizar requisitos, proponer una implementación o sugerir pruebas. Tú tendrás que comprobar, corregir y explicar el resultado.

## Requisitos funcionales

Cada pedido contiene una lista de productos. Cada producto posee:

- nombre;
- precio unitario;
- cantidad.

La solución debe cumplir estas reglas:

1. El pedido debe contener al menos un producto.
2. El nombre no puede estar vacío ni contener únicamente espacios.
3. El precio unitario debe ser numérico y mayor que `0`.
4. La cantidad debe ser un número entero mayor que `0`.
5. Si cualquier producto es inválido, el pedido completo debe rechazarse.
6. Un pedido inválido debe devolver mensajes que permitan identificar cada error.
7. El subtotal es la suma de `precio unitario × cantidad` de todos los productos.
8. Si el subtotal es menor que `100`, no existe descuento.
9. Si el subtotal es mayor o igual que `100` y menor que `300`, el descuento es del `5 %`.
10. Si el subtotal es mayor o igual que `300`, el descuento es del `10 %`.
11. Los descuentos no se acumulan.
12. El descuento y el total deben redondearse a dos decimales.
13. El total nunca puede ser negativo.
14. La solución no debe utilizar bibliotecas externas.

## Salida mínima

Para un pedido válido, la solución debe permitir observar:

- subtotal;
- porcentaje de descuento;
- monto descontado;
- total final.

Para un pedido inválido, debe permitir observar:

- que el pedido fue rechazado;
- la lista de errores detectados;
- ausencia de un total calculado como si el pedido fuera válido.

Puedes representar la salida mediante un objeto, diccionario, estructura, registro o valor equivalente en tu lenguaje.

## Decisión sobre valores monetarios

Los lenguajes representan los decimales de distintas maneras. Antes de programar, escribe qué tipo utilizarás para el dinero y cómo controlarás el redondeo.

Si tu lenguaje posee un tipo decimal apropiado en su biblioteca estándar, puedes utilizarlo. Si utilizas números de punto flotante para esta práctica, redondea únicamente en los resultados indicados y documenta la limitación. No agregues una dependencia externa solo para completar el módulo.

## Casos de aceptación obligatorios

| Caso | Pedido | Resultado esperado |
|---|---|---|
| 1. Sin descuento | 2 unidades de `Cuaderno` a `25.00` | Subtotal `50.00`, descuento `0.00`, total `50.00` |
| 2. Primer límite | 2 unidades de `Artículo A` a `50.00` | Subtotal `100.00`, descuento `5.00`, total `95.00` |
| 3. Antes del segundo límite | 1 unidad de `Artículo B` a `299.99` | Subtotal `299.99`, descuento `15.00`, total `284.99` |
| 4. Segundo límite | 3 unidades de `Artículo C` a `100.00` | Subtotal `300.00`, descuento `30.00`, total `270.00` |
| 5. Varios productos | 2 unidades a `80.00` y 7 unidades a `20.00` | Subtotal `300.00`, descuento `30.00`, total `270.00` |
| 6. Pedido vacío | Lista sin productos | Pedido rechazado |
| 7. Cantidad inválida | Cantidad `0` | Pedido rechazado con error de cantidad |
| 8. Precio inválido | Precio `-10` | Pedido rechazado con error de precio |
| 9. Nombre inválido | Nombre con espacios | Pedido rechazado con error de nombre |
| 10. Varios errores | Dos productos con datos inválidos | Todos los errores relevantes aparecen en la respuesta |

Puedes agregar más casos. No elimines ninguno de los diez obligatorios.

## Fase 1. Analiza sin IA

Antes de abrir el asistente, crea `proyecto/requisitos.md` y escribe:

- entradas;
- salidas;
- reglas de validación;
- límites de descuento;
- decisión sobre redondeo;
- al menos tres riesgos de implementación.

Esta primera versión debe ser tuya.

## Fase 2. Solicita análisis antes de pedir código

Comparte únicamente requisitos ficticios. Puedes utilizar esta solicitud inicial:

```text
Actúa como revisor de requisitos para una función pequeña.
No escribas código todavía.

Analiza estas reglas del validador de pedidos:
[PEGA AQUÍ TUS REQUISITOS]

Devuelve únicamente:
1. contradicciones o ambigüedades;
2. suposiciones que no deberían hacerse;
3. casos límite que faltan;
4. preguntas que deben resolverse antes de programar.

No agregues funciones no solicitadas ni dependencias.
```

Revisa la respuesta. No aceptes reglas nuevas solo porque parezcan razonables.

## Fase 3. Define la solicitud de implementación

Cuando los requisitos estén claros, solicita una función o conjunto mínimo de funciones en tu lenguaje.

Incluye:

- lenguaje y versión;
- reglas definitivas;
- formato de entrada y salida;
- prohibición de bibliotecas externas;
- petición de no ocultar errores;
- solicitud de separar validación y cálculo cuando ayude a comprender;
- casos obligatorios;
- indicación de no afirmar que se ejecutaron pruebas.

No pidas una interfaz gráfica, base de datos, API ni aplicación web. Esas partes no pertenecen al alcance.

## Fase 4. Revisa la propuesta

Antes de ejecutarla, marca:

- cada requisito atendido;
- cada requisito ausente;
- dependencias o funciones agregadas;
- suposiciones;
- condiciones exactas de `100` y `300`;
- manejo de pedidos inválidos;
- forma de redondeo.

## Fase 5. Ejecuta y registra

Ejecuta los diez casos obligatorios. Guarda una tabla como esta:

| ID | Entrada resumida | Resultado esperado | Resultado real | Estado | Evidencia |
|---|---|---|---|---|---|
| CP-01 | 2 × 25.00 | Total 50.00 | Total 50.00 | Aprobado | Captura 01 |

No escribas “aprobado” antes de ejecutar el caso.

## Fase 6. Corrige una debilidad manualmente

Debes realizar al menos una mejora que puedas explicar. Algunos ejemplos:

- corregir una condición de límite;
- eliminar una dependencia innecesaria;
- mejorar un mensaje de error;
- separar una validación confusa;
- corregir el redondeo;
- agregar un caso omitido;
- simplificar una estructura desproporcionada.

Si la primera propuesta supera todos los casos, identifica una debilidad de claridad, mantenibilidad o cobertura. No dañes una solución correcta solo para cumplir el requisito.

Registra:

1. debilidad encontrada;
2. riesgo que producía;
3. cambio realizado;
4. prueba ejecutada después del cambio;
5. motivo por el que decidiste conservarlo.

## Fase 7. Explica una decisión propia

En `proyecto/decision_manual.md`, responde en entre 120 y 200 palabras:

- ¿Qué decisión no delegaste?
- ¿Qué información utilizaste?
- ¿Qué alternativa descartaste?
- ¿Qué evidencia respalda el resultado final?
- ¿Qué parte cambiarías si las reglas comerciales fueran distintas?

## Estructura sugerida del proyecto

```text
proyecto/
├── requisitos.md
├── prompts.md
├── bitacora_ia.md
├── codigo/
│   └── archivos_del_programa
├── casos_prueba.md
├── evidencias/
│   ├── captura_01.png
│   └── ...
└── decision_manual.md
```

## Criterios de aceptación

El proyecto se considera funcional cuando:

- puede ejecutarse con instrucciones claras;
- rechaza pedidos y productos inválidos;
- calcula correctamente los tres niveles de descuento;
- maneja exactamente los límites de `100` y `300`;
- muestra todos los resultados requeridos;
- supera los diez casos obligatorios;
- no incorpora dependencias externas innecesarias;
- contiene al menos una corrección o mejora manual explicada;
- mantiene una bitácora honesta;
- todo el código puede explicarse.

## Fuera del alcance

No agregues:

- interfaz gráfica;
- página web;
- base de datos;
- cuentas de usuario;
- inventario;
- impuestos no definidos;
- cupones;
- conexión a servicios externos;
- procesamiento de pagos.

Agregar funciones no solicitadas aumenta el tiempo y crea nuevos puntos de falla. Un proyecto pequeño y comprobado demuestra mejor el objetivo del módulo.

---

# Rúbrica del proyecto del módulo

| Criterio | Evidencia esperada | Puntos |
|---|---|---:|
| Requisitos y alcance | Entradas, salidas, reglas, límites y exclusiones están claros | 6 |
| Funcionalidad | La solución valida y calcula según las reglas | 12 |
| Casos normales y límites | `100`, `299.99`, `300` y pedidos de varios productos funcionan | 7 |
| Casos inválidos | Pedido vacío, nombre, precio y cantidad inválidos se rechazan con claridad | 6 |
| Calidad y organización | Código proporcional, legible y sin dependencias innecesarias | 5 |
| Validación con evidencia | Los diez casos contienen resultado esperado, real y evidencia | 5 |
| Uso responsable de IA | Prompts relevantes, contexto seguro y bitácora honesta | 4 |
| Corrección manual | Se identifica, corrige y vuelve a probar una debilidad | 3 |
| Explicación y dominio | La decisión propia coincide con el código y las pruebas | 2 |
| **Total** |  | **50** |

## Fallos críticos

El proyecto requiere corrección aunque alcance el puntaje mínimo si:

- contiene credenciales o datos personales reales;
- no puede ejecutarse con los archivos entregados;
- calcula incorrectamente un límite comercial obligatorio;
- presenta respuestas de la IA como si fueran pruebas ejecutadas;
- oculta el uso material de IA;
- incluye código principal que no puedes explicar;
- faltan el código fuente o las evidencias obligatorias.

---

# Evaluación práctica del módulo

**Tiempo recomendado:** 12 minutos  
**Valor:** 15 puntos

Una IA propone el siguiente pseudocódigo para las reglas de descuento del proyecto:

```text
FUNCIÓN calcular_total(pedido)
    subtotal ← 0

    PARA CADA producto EN pedido
        subtotal ← subtotal + producto.precio × producto.cantidad
    FIN PARA

    SI subtotal > 100 ENTONCES
        subtotal ← subtotal × 0.95
    FIN SI

    SI subtotal > 300 ENTONCES
        subtotal ← subtotal × 0.90
    FIN SI

    RETORNAR redondear(subtotal, 2)
FIN FUNCIÓN
```

La respuesta afirma:

> El algoritmo valida el pedido, aplica correctamente un único descuento y cubre todos los límites.

## Tareas

1. Identifica al menos cinco diferencias entre la afirmación y el pseudocódigo.
2. Explica qué ocurre con un subtotal exactamente igual a `100`.
3. Explica qué ocurre con un subtotal exactamente igual a `300`.
4. Indica por qué modificar `subtotal` antes de evaluar la segunda condición puede producir un comportamiento incorrecto.
5. Escribe siete casos de prueba capaces de demostrar los problemas.
6. Implementa una versión corregida en tu lenguaje o escribe pseudocódigo corregido suficientemente preciso.
7. Ejecuta al menos tres de los casos si presentas código ejecutable.
8. Decide si la propuesta original debe aceptarse, corregirse o descartarse y justifica la decisión.

## Rúbrica de la evaluación

| Criterio | Puntos |
|---|---:|
| Identifica fallas reales sin inventar problemas | 4 |
| Analiza correctamente los límites `100` y `300` | 3 |
| Diseña casos que revelan las fallas | 3 |
| La corrección representa un único descuento y conserva el subtotal | 3 |
| Decisión final basada en evidencia | 2 |
| **Total** | **15** |

---


<!-- coa-activity:programacion-ia-m1-proyecto -->

# Calificación del módulo

| Evidencia | Valor |
|---|---:|
| Ejercicios obligatorios | 15 puntos |
| Mini proyecto | 20 puntos |
| Proyecto del módulo | 50 puntos |
| Evaluación práctica | 15 puntos |
| **Total** | **100 puntos** |

# Errores frecuentes en las actividades

## Comparar texto en lugar de resultados

Una respuesta más extensa o elegante no es necesariamente más correcta. Ejecuta los mismos casos sobre ambas propuestas.

## Cambiar el prompt entre las dos soluciones

Si una propuesta recibe mejores requisitos, la comparación deja de medir lo mismo.

## Fotografiar código sin entregar el archivo

Las capturas demuestran una ejecución, pero no sustituyen el código fuente.

## Guardar únicamente el resultado final

Sin prompts relevantes, bitácora y corrección manual no se puede observar el proceso de decisión.

## Confundir un error mostrado con una validación correcta

El programa debe devolver un error controlado. Una caída inesperada o un mensaje interno no constituye una experiencia válida.

## Redondear demasiado pronto

Redondear cada operación intermedia puede modificar el resultado. Conserva el cálculo según la capacidad de tu lenguaje y redondea los resultados establecidos.

## Modificar requisitos para que el código pase

Cuando una prueba falla, corrige la implementación si el requisito es claro. No cambies la regla comercial para justificar el resultado generado.

---

# Recomendaciones para completar el módulo

- Trabaja con una función pequeña y entradas ficticias.
- Cierra o elimina del contexto archivos que no sean necesarios.
- Escribe los límites antes de pedir código.
- Conserva la primera respuesta; permite demostrar la mejora.
- Ejecuta una prueba después de cada cambio importante.
- Lee cualquier comando antes de autorizarlo.
- Consulta documentación oficial cuando la respuesta dependa de una versión.
- Si una propuesta es demasiado compleja, pide primero una explicación; después decide si conviene simplificarla manualmente.
- No gastes tiempo intentando que una respuesta incorrecta se convierta en correcta mediante mensajes interminables. Puedes descartarla y volver al último punto comprobado.

---

# Videos recomendados

Los videos complementan la práctica. Las interfaces mostradas pueden cambiar; conserva los principios y consulta la documentación vigente para los botones o planes disponibles.

## 1. Inteligencia Artificial para programadores: conceptos y herramientas

**Canal:** midudev  
[Curso Inteligencia Artificial para Programadores en 2026](https://www.youtube.com/watch?v=2aN_-m1uU4k)
**Visualización recomendada para este módulo:** introducción `00:00–04:00` y sección sobre editores y asistentes `24:33–43:38`.

Observa especialmente la diferencia entre utilizar un chat y trabajar con asistencia dentro del entorno de desarrollo. El resto del video contiene temas que se abordarán más adelante o que quedan fuera del alcance del curso.

## 2. Instalación de VS Code y GitHub Copilot Free

**Canal:** Kiko Palomares  
[Cómo instalar VS Code y GitHub Copilot GRATIS para empezar a programar](https://www.youtube.com/watch?v=Wg6Bc9YyVyY)

Este recurso es opcional. Utilízalo si deseas probar autocompletado o chat dentro del editor. No necesitas instalar Copilot para aprobar el módulo. La pantalla, los requisitos de acceso y los límites gratuitos pueden haber cambiado desde la grabación.

---

# Documentación oficial y recursos confiables

## Uso de las herramientas

- [Preguntas frecuentes oficiales de ChatGPT](https://help.openai.com/en/articles/12677804-what-is-chatgpt-faq)
- [Controles de datos de ChatGPT](https://help.openai.com/es-419/articles/7730893-data-controls-faq)
- [Privacidad de Claude: uso de datos en el entrenamiento](https://privacy.claude.com/es/articles/10023555-como-se-utilizan-los-datos-personales-en-el-entrenamiento-de-modelos)
- [Centro de privacidad de las aplicaciones de Gemini](https://support.google.com/gemini/answer/13594961?hl=es)
- [Descripción general de Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview?hl=es)
- [Inicio rápido de GitHub Copilot](https://docs.github.com/es/copilot/get-started/quickstart)
- [Uso responsable de GitHub Copilot](https://docs.github.com/es/copilot/responsible-use)
- [Uso responsable de las sugerencias de código de Copilot](https://docs.github.com/es/copilot/responsible-use/copilot-code-completion)

## Seguridad de credenciales

- [Eliminar datos confidenciales de un repositorio](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## Documentación del lenguaje

Valida funciones, tipos y versiones con la documentación correspondiente a tu entorno:

- [Python](https://docs.python.org/es/3/)
- [JavaScript — MDN Web Docs](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [Java](https://docs.oracle.com/en/java/)
- [C#](https://learn.microsoft.com/es-es/dotnet/csharp/)

Si utilizas otro lenguaje, consulta su sitio oficial o la documentación mantenida por el proyecto.

## Cómo utilizar estos recursos

No necesitas leer cada sitio completo. Busca información cuando una respuesta dependa de:

- una función concreta;
- una versión;
- una configuración de privacidad;
- permisos de acceso;
- retención o uso de datos;
- compatibilidad de una herramienta.

La documentación oficial responde “qué admite el producto”. La ejecución y las pruebas responden “qué ocurre en tu proyecto”. Necesitas ambas cuando la decisión sea importante.

---

# Material complementario

[Descargar todos los materiales del Módulo 1](/downloads/programacion-ia/modulo-1/programacion-ia-modulo-1-materiales.zip)

[Descargar BITACORA_IA.md](/downloads/programacion-ia/modulo-1/BITACORA_IA.md)

[Descargar MATRIZ_COMPARACION.md](/downloads/programacion-ia/modulo-1/MATRIZ_COMPARACION.md)

[Descargar CHECKLIST_SEGURIDAD_VALIDACION.md](/downloads/programacion-ia/modulo-1/CHECKLIST_SEGURIDAD_VALIDACION.md)

Este módulo incluye únicamente tres plantillas reutilizables:

1. **Bitácora de uso de IA:** registra las interacciones que influyeron en el resultado.
2. **Matriz de comparación:** aplica los mismos criterios a dos propuestas.
3. **Checklist de seguridad y validación:** revisa el contexto antes de enviarlo y la evidencia antes de integrar código.

Las plantillas se encuentran en la carpeta `materiales_programacion_ia_modulo_1`. Puedes completarlas en Markdown o copiar sus tablas a un documento de texto.

No se requiere un PDF adicional. Todo el contenido conceptual necesario está incluido en esta página.

---

# Glosario

**Asistente conversacional:** herramienta con la que se interactúa mediante mensajes para solicitar explicaciones, propuestas o transformaciones.

**Autocompletado:** sugerencia de código presentada cerca del cursor mientras escribes.

**Chat del editor:** conversación integrada en un editor o IDE que puede utilizar el contexto autorizado del proyecto.

**Contexto:** información disponible para que la herramienta interprete una solicitud.

**Prompt:** mensaje o conjunto de instrucciones enviado a una herramienta de IA.

**Suposición:** decisión no confirmada que completa información ausente.

**Alucinación:** contenido plausible presentado como cierto aunque sea incorrecto, inexistente o no esté respaldado.

**Caso normal:** entrada representativa del uso esperado.

**Caso límite:** entrada ubicada en una frontera de las reglas, como exactamente `100` o `300`.

**Caso inválido:** entrada que el sistema debe rechazar de forma controlada.

**Evidencia de ejecución:** registro verificable del resultado producido al ejecutar una entrada concreta.

**Dependencia:** paquete, biblioteca o componente externo requerido por un proyecto.

**Dato sensible:** información que no debe divulgarse sin autorización, como credenciales, datos personales o código confidencial.

**Rotación de credencial:** invalidación de una credencial expuesta y creación de una nueva.

**Diferencia o diff:** comparación que muestra las líneas agregadas, eliminadas o modificadas.

**Reversible:** cambio que puede deshacerse sin perder información importante.

**Bitácora:** registro breve de acciones, propuestas, validaciones, cambios y decisiones.

---

# Resumen del módulo

La IA puede explicar, proponer, transformar, revisar, depurar y documentar. Ninguna de esas capacidades garantiza que la respuesta sea correcta para tu problema.

El flujo fundamental es:

```text
Analizar → preguntar → leer → ejecutar → probar → decidir
```

Una práctica profesional requiere:

- problemas pequeños y delimitados;
- contexto suficiente y seguro;
- lectura completa de las propuestas;
- casos normales, límite e inválidos;
- documentación oficial cuando corresponda;
- correcciones manuales;
- decisiones basadas en evidencia;
- una bitácora honesta.

El objetivo no es demostrar que una herramienta produjo código. El objetivo es demostrar que tú pudiste dirigir, revisar y validar el trabajo.

---

# Checklist antes de entregar

## Seguridad

- [ ] No incluí contraseñas, tokens, claves, datos personales ni código confidencial.
- [ ] Sustituí cualquier dato real por información ficticia.
- [ ] Revisé las capturas antes de incluirlas.

## Ejercicios

- [ ] Completé los seis ejercicios obligatorios.
- [ ] Justifiqué mis decisiones y no respondí únicamente con el nombre de una herramienta.

## Mini proyecto

- [ ] Utilicé exactamente los mismos requisitos para ambas propuestas.
- [ ] Ejecuté casos normales, límite e inválidos.
- [ ] Completé la matriz de comparación.
- [ ] Mi conclusión se basa en resultados.

## Proyecto del módulo

- [ ] Escribí los requisitos antes de solicitar código.
- [ ] La solución rechaza todos los datos inválidos definidos.
- [ ] Probé los límites `100`, `299.99` y `300`.
- [ ] Ejecuté los diez casos obligatorios.
- [ ] Registré resultados esperados y reales.
- [ ] Realicé y expliqué al menos una corrección manual.
- [ ] Puedo explicar todo el código entregado.
- [ ] No agregué funciones fuera del alcance.

## Evaluación

- [ ] Identifiqué al menos cinco fallas de la propuesta.
- [ ] Corregí el algoritmo.
- [ ] Incluí casos capaces de demostrar los errores.

## Archivos

- [ ] El proyecto puede ejecutarse con los archivos incluidos.
- [ ] La bitácora contiene las interacciones relevantes.
- [ ] Las capturas son legibles.
- [ ] El archivo comprimido utiliza el nombre solicitado.

---

# Entrega de la actividad

Utiliza un único punto de entrega para todo el Módulo 1.

## Qué debes entregar

Un archivo comprimido que contenga:

- los seis ejercicios obligatorios;
- el mini proyecto con ambas soluciones;
- la matriz de comparación;
- el proyecto `Validador de pedidos y descuentos`;
- requisitos;
- prompts relevantes;
- bitácora de uso de IA;
- código fuente;
- matriz de casos ejecutados;
- evidencias de resultados;
- corrección manual explicada;
- decisión manual;
- evaluación práctica resuelta.

## Estructura recomendada

```text
COA_IA_M1_Nombre_Apellido/
├── 01_ejercicios/
│   └── ejercicios.md
├── 02_mini_proyecto/
│   ├── solucion_a/
│   ├── solucion_b/
│   ├── comparacion.md
│   └── evidencias/
├── 03_proyecto/
│   ├── requisitos.md
│   ├── prompts.md
│   ├── bitacora_ia.md
│   ├── codigo/
│   ├── casos_prueba.md
│   ├── evidencias/
│   └── decision_manual.md
└── 04_evaluacion/
    └── evaluacion_modulo_1.md
```

## Formato

- Comprime la carpeta en formato `.zip`.
- Incluye los archivos fuente originales; no entregues únicamente capturas.
- Utiliza `.md`, `.txt` o `.pdf` para las explicaciones.
- Utiliza `.png`, `.jpg` o `.pdf` para evidencias visuales.
- No incluyas carpetas de dependencias, entornos virtuales, archivos temporales ni credenciales.

## Nombre del archivo

```text
COA_IA_M1_Nombre_Apellido.zip
```

Ejemplo:

```text
COA_IA_M1_Ana_Rodriguez.zip
```

## Antes de enviar

1. Descomprime una copia del archivo.
2. Comprueba que abre correctamente.
3. Ejecuta el proyecto desde esa copia.
4. Verifica que las evidencias son legibles.
5. Confirma que no contiene información sensible.
6. Envía el archivo mediante el botón **Enviar actividad**.

[Entregar Módulo 1](https://forms.gle/nTx97JRkFkbH5Vfr6)

Si la entrega requiere correcciones, conserva la misma estructura y agrega al nombre la versión correspondiente:

```text
COA_IA_M1_Nombre_Apellido_v2.zip
```

---

# Habilidades obtenidas

Al aprobar este módulo podrás:

- seleccionar una forma de asistencia proporcional a la tarea;
- limitar el contexto compartido;
- reconocer capacidades y límites de una respuesta;
- identificar suposiciones;
- comparar propuestas mediante criterios constantes;
- construir casos que aporten evidencia;
- corregir manualmente código sugerido;
- registrar el uso de IA de forma profesional;
- proteger información sensible;
- mantener la responsabilidad sobre el software que entregas.

En el siguiente módulo aprenderás a transformar estos principios en prompts y conversaciones técnicas capaces de mantener contexto, dividir problemas e iterar cambios sin perder el control.

