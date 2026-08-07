# COA — Cursos Online Avanzados

## Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial

# Módulo 5. Desarrollo profesional asistido por inteligencia artificial

**Duración aproximada:** 7 horas  
**Modalidad:** práctica guiada, ejercicios, mini proyecto y proyecto de módulo  
**Tecnologías:** React, Next.js, Tailwind CSS, Git, GitHub, Vercel, ChatGPT, Claude y GitHub Copilot cuando esté disponible  
**Resultado principal:** una mejora profesional del portal COA construida con apoyo de IA, comprendida, revisada, probada y documentada por el estudiante

---

## Bienvenida

En los módulos anteriores construiste interfaces con HTML y CSS, agregaste comportamiento con JavaScript, aprendiste a trabajar con React y transformaste el proyecto en un portal de Next.js publicado en Vercel.

Ahora utilizarás inteligencia artificial dentro de ese proceso.

La meta no es entregar el control del proyecto a una herramienta. La meta es desarrollar más rápido sin perder la capacidad de:

- comprender el problema;
- decidir qué debe construirse;
- reconocer una propuesta incorrecta;
- leer el código recibido;
- modificarlo;
- probarlo;
- explicar por qué funciona;
- asumir responsabilidad por el resultado.

Una IA puede producir una respuesta convincente y aun así:

- utilizar una API inexistente;
- mezclar Pages Router con App Router;
- agregar una dependencia innecesaria;
- romper una función que antes servía;
- introducir un problema de accesibilidad;
- ocultar un error en lugar de resolverlo;
- inventar que una prueba pasó;
- exponer información privada;
- crear más código del necesario.

Por eso, el flujo de trabajo de este módulo no será:

```text
Pedir una aplicación completa
              ↓
        Copiar y pegar
              ↓
            Entregar
```

El flujo profesional será:

```text
Comprender
    ↓
Especificar
    ↓
Pedir una propuesta limitada
    ↓
Inspeccionar el cambio
    ↓
Probar
    ↓
Aceptar, modificar o rechazar
    ↓
Documentar
```

La inteligencia artificial será un acelerador. El criterio seguirá siendo humano.

> **Principio del módulo:** ningún fragmento se incorpora al proyecto hasta que puedas explicar qué hace, por qué es necesario y cómo fue verificado.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Explicar qué puede y qué no puede garantizar una herramienta de IA.
- Distinguir entre una respuesta plausible y una solución verificada.
- Elegir entre ChatGPT, Claude y GitHub Copilot según la tarea.
- Preparar contexto útil sin compartir archivos ni datos innecesarios.
- Proteger credenciales, información personal y código privado.
- Convertir una necesidad ambigua en criterios de aceptación comprobables.
- Redactar instrucciones claras para tareas de desarrollo.
- Dividir una función grande en cambios pequeños y revisables.
- Pedir explicaciones, planes, diagnósticos, implementaciones y revisiones por separado.
- Utilizar delimitadores para separar instrucciones, código, errores y datos.
- Solicitar formatos de salida que faciliten la revisión.
- Generar componentes de React y estilos de Tailwind dentro de restricciones concretas.
- Detectar dependencias, archivos y cambios no solicitados.
- Depurar con evidencias en lugar de aplicar correcciones al azar.
- Entregar a la IA el error exacto, el comportamiento esperado y el código mínimo relevante.
- Diferenciar causa, síntoma, hipótesis y comprobación.
- Refactorizar sin alterar el comportamiento observable.
- Solicitar revisiones de código con gravedad, evidencia y solución propuesta.
- Comprobar sugerencias mediante lectura, documentación, ESLint, construcción y pruebas manuales.
- Mantener una bitácora profesional de decisiones asistidas por IA.
- Crear instrucciones de repositorio para GitHub Copilot cuando esté disponible.
- Reconocer cuándo no conviene utilizar IA.
- Corregir o rechazar una propuesta con argumentos técnicos.
- Defender oralmente cada parte del código entregado.

---

## Producto que construirás

Trabajarás sobre el portal COA aprobado en el Módulo 4. El proyecto conservará sus rutas, su catálogo, sus filtros y sus favoritos, pero recibirá una nueva función:

## Comparador de cursos

El usuario podrá seleccionar entre dos y tres cursos y comparar:

- nombre;
- categoría;
- nivel;
- duración;
- descripción breve;
- habilidades principales.

También realizarás una revisión de calidad del portal y corregirás al menos dos problemas reales encontrados durante el proceso.

```text
/cursos
│
├── búsqueda
├── filtros
├── favoritos
├── selección de 2 o 3 cursos
│
└── panel de comparación
    ├── información equivalente
    ├── quitar un curso
    ├── limpiar selección
    └── estados accesibles
```

La evaluación no se concentrará en la cantidad de código generado. Se concentrará en la calidad del proceso:

```text
Necesidad clara
      +
Contexto suficiente
      +
Cambio limitado
      +
Comprensión
      +
Pruebas
      +
Criterio
      =
Uso profesional de IA
```

---

## Ruta de trabajo y distribución del tiempo

| Etapa | Tiempo aproximado |
|---|---:|
| 1. Modelo profesional de colaboración con IA | 35 minutos |
| 2. Herramientas, contexto, privacidad y seguridad | 40 minutos |
| 3. Instrucciones eficaces para desarrollo | 50 minutos |
| 4. Implementación asistida en cambios controlados | 45 minutos |
| 5. Diagnóstico y depuración con evidencias | 40 minutos |
| 6. Revisión, refactorización y optimización | 45 minutos |
| 7. Flujo profesional con Git, documentación e instrucciones | 30 minutos |
| 8. Mini proyecto: rescate de un selector defectuoso | 30 minutos |
| 9. Proyecto del módulo: comparador y mejora profesional de COA | 90 minutos |
| 10. Evaluación y cierre | 15 minutos |
| **Total** | **7 horas** |

Los tiempos son orientativos. No avances solamente porque una respuesta “parece correcta”. Avanza cuando exista evidencia.

---

# 1. Modelo profesional de colaboración con IA

## 1.1 La IA propone; el desarrollador decide

Una herramienta generativa trabaja con patrones. Puede explicar, completar, transformar y proponer código, pero no conoce automáticamente:

- el objetivo real del producto;
- todos los archivos del proyecto;
- las versiones instaladas;
- las decisiones tomadas en módulos anteriores;
- las reglas de la organización;
- el comportamiento que no debe cambiar;
- la información que no puede compartirse;
- las pruebas ejecutadas fuera de la conversación.

Cuando falta contexto, la herramienta completa los espacios con una respuesta probable. Esa capacidad es útil para generar ideas, pero peligrosa cuando se confunde probabilidad con verdad.

Observa la diferencia:

```text
Respuesta plausible:
"Este componente debería funcionar."

Resultado verificado:
"El componente se revisó, ESLint finalizó, la construcción terminó,
se probaron cinco casos y no aparecieron errores en la consola."
```

Solamente el segundo resultado ofrece evidencia.

## 1.2 Responsabilidades

| Responsabilidad | Persona | IA |
|---|---:|---:|
| Definir el problema | Principal | Apoya con preguntas |
| Establecer prioridades | Principal | Puede sugerir alternativas |
| Decidir qué información compartir | Principal | No puede autorizarlo |
| Proponer opciones | Evalúa | Principal |
| Escribir un borrador | Revisa | Puede acelerar |
| Garantizar que el código es correcto | Principal | No puede garantizarlo |
| Ejecutar pruebas reales | Principal | Puede proponerlas |
| Interpretar impacto en usuarios | Principal | Puede ayudar |
| Aceptar el cambio final | Principal | No decide |

Trabajar con IA no reduce la responsabilidad del desarrollador. La aumenta: ahora también debe revisar una propuesta que puede parecer segura aunque sea incorrecta.

## 1.3 Cinco niveles de asistencia

No todas las tareas requieren el mismo grado de intervención.

### Nivel 1. Explicación

La IA explica código existente sin modificarlo.

```text
Explica este componente en el orden en que se ejecuta.
Separa propiedades, estado, valores derivados, eventos y renderizado.
No propongas cambios todavía.
```

Úsalo cuando necesites comprender antes de actuar.

### Nivel 2. Plan

La IA propone pasos y archivos, pero no escribe la implementación.

```text
Propón un plan de máximo seis pasos para agregar comparación de cursos.
Indica qué archivos cambiarían y qué responsabilidad tendría cada uno.
No escribas código.
```

Úsalo cuando el problema todavía necesite diseño.

### Nivel 3. Cambio mínimo

La IA propone una modificación limitada.

```text
Modifica solamente la función toggleCourse.
No cambies nombres, estilos ni estructura del componente.
Devuelve el fragmento reemplazado y explica el motivo.
```

Úsalo cuando conoces el punto exacto del cambio.

### Nivel 4. Implementación acotada

La IA desarrolla una unidad completa con criterios definidos.

```text
Crea el componente ComparisonSummary con las propiedades indicadas.
No instales dependencias y no modifiques otros archivos.
Incluye estados vacío, incompleto y listo.
```

Úsalo después de acordar la responsabilidad del componente.

### Nivel 5. Revisión

La IA actúa como una segunda lectura.

```text
Revisa este cambio sin reescribirlo.
Clasifica hallazgos como crítico, importante o mejora.
Para cada hallazgo incluye evidencia, impacto y corrección mínima.
Si no existe evidencia suficiente, indícalo.
```

Úsalo antes de integrar o publicar.

El error frecuente consiste en saltar directamente al nivel 4 para una necesidad que todavía no se comprende. Si no puedes describir qué debe ocurrir, tampoco puedes evaluar una implementación.

## 1.4 El ciclo COA de trabajo asistido

Durante todo el módulo utilizarás este ciclo:

```text
1. COMPRENDER
   ¿Qué problema existe?
          ↓
2. ESPECIFICAR
   ¿Cómo sabremos que quedó resuelto?
          ↓
3. SOLICITAR
   ¿Qué ayuda concreta necesitamos?
          ↓
4. INSPECCIONAR
   ¿Qué propone cambiar y por qué?
          ↓
5. VERIFICAR
   ¿Qué evidencia demuestra el resultado?
          ↓
6. DECIDIR
   Aceptar, modificar o rechazar
          ↓
7. REGISTRAR
   ¿Qué aprendimos y qué se incorporó?
```

La palabra más importante del ciclo es **decidir**. Copiar una salida no es decidir.

## 1.5 Cuándo utilizar IA

La IA suele aportar valor para:

- explicar un archivo desconocido;
- convertir requisitos en una lista de casos;
- proponer una estructura inicial;
- generar código repetitivo;
- ofrecer varias alternativas;
- identificar hipótesis para un error;
- explicar un mensaje de compilación;
- proponer casos límite;
- revisar duplicación;
- redactar documentación a partir de hechos verificados;
- detectar inconsistencias visuales o de accesibilidad;
- preparar una lista de comprobación.

## 1.6 Cuándo detenerse y trabajar sin IA

No conviene delegar inmediatamente cuando:

- todavía no entiendes el problema;
- la decisión afecta seguridad, privacidad o permisos;
- vas a compartir una credencial;
- no puedes ejecutar ni probar la propuesta;
- la tarea es tan pequeña que escribirla resulta más claro;
- necesitas practicar deliberadamente una habilidad;
- el proyecto contiene información que no tienes permiso de enviar;
- no conoces el impacto de cambiar una dependencia;
- la herramienta intenta modificar muchos archivos sin justificación;
- vas a aceptar el resultado solamente porque “se ve profesional”.

También debes detenerte cuando la conversación entra en un ciclo:

```text
IA propone corrección A
        ↓
aparece error B
        ↓
IA deshace A y propone C
        ↓
reaparece error original
```

En ese punto vuelve al estado estable, reduce el problema y reúne evidencias.

### Ejercicio 1. Clasificar la asistencia adecuada

Lee cada situación y decide qué nivel de asistencia utilizarías: explicación, plan, cambio mínimo, implementación acotada o revisión.

1. Existe un componente de 180 líneas que no escribiste y debes modificar.
2. El botón “Comparar” agrega el mismo curso dos veces.
3. Quieres decidir si el comparador debe aparecer en un panel o en otra ruta.
4. Terminaste una función y deseas buscar problemas de accesibilidad.
5. Debes crear seis filas con la misma estructura a partir de datos.
6. La IA propone instalar una biblioteca para mostrar una tabla sencilla.

Para cada situación redacta:

- nivel elegido;
- motivo;
- información que entregarías;
- evidencia que exigirías antes de aceptar.

No existe una única herramienta correcta, pero sí debe existir una decisión razonada.

---

# 2. Herramientas, contexto, privacidad y seguridad

## 2.1 Elegir por tarea, no por fama

Las herramientas cambian con frecuencia. Sus planes, modelos, límites y funciones disponibles pueden variar. No bases tu proceso en que un botón concreto siempre estará presente.

Aprende el tipo de interacción:

| Herramienta | Uso práctico en este módulo | Ventaja del contexto | Precaución |
|---|---|---|---|
| ChatGPT | Explicación, planificación, diagnóstico, revisión y alternativas | Conversación, archivos o proyecto cuando la función esté disponible | Verificar versiones, APIs y pruebas |
| Claude | Explicación de conjuntos de archivos, planes, revisión y documentación | Proyectos o archivos cuando estén disponibles | No asumir que conoce todo el repositorio |
| GitHub Copilot | Sugerencias dentro del editor, cambios locales, explicación y tareas repetitivas | Puede utilizar el archivo abierto y contexto del repositorio según la función | Revisar cada sugerencia y evitar aceptar bloques sin leer |

GitHub Copilot es opcional. Algunas funciones pueden requerir una cuenta, un plan compatible o una configuración concreta. Todo el módulo puede completarse con ChatGPT o Claude.

La pregunta correcta no es:

> ¿Cuál IA es la mejor?

La pregunta profesional es:

> ¿Qué herramienta tiene el contexto adecuado para esta tarea y cuál será el costo de revisar su salida?

## 2.2 Contexto relevante

Más contexto no siempre produce una mejor respuesta. Un repositorio completo puede añadir ruido, información privada y archivos que no afectan el problema.

Entrega el contexto mínimo suficiente:

```text
Objetivo
├── comportamiento esperado
├── comportamiento actual
├── criterios de aceptación
├── versiones importantes
├── árbol de archivos relevante
├── fragmento mínimo
├── mensaje de error exacto
└── pruebas ya realizadas
```

Para una tarea de Next.js, el contexto útil puede incluir:

```text
Next.js con App Router
JavaScript, no TypeScript
Tailwind CSS
No agregar dependencias
Archivo afectado: src/components/courses/CourseExplorer.js
Datos: arreglo de objetos con slug único
La compilación funcionaba antes del cambio
```

## 2.3 Contexto inútil o peligroso

No compartas:

- `.env`;
- claves de API;
- tokens de GitHub o Vercel;
- contraseñas;
- cookies;
- encabezados de autorización;
- datos personales de estudiantes o clientes;
- información médica o financiera;
- archivos privados sin permiso;
- código de una organización cuando su política lo prohíbe;
- registros completos si contienen identificadores o secretos.

Utiliza valores de ejemplo:

```text
Incorrecto:
OPENAI_API_KEY=sk-valor-real

Correcto:
OPENAI_API_KEY=<CLAVE_NO_COMPARTIDA>
```

Si un error contiene información sensible, prepara una reproducción mínima y reemplaza los datos:

```text
usuario@empresa.com  →  usuario@ejemplo.com
token real           →  <TOKEN_OCULTO>
identificador real   →  course-01
```

## 2.4 Regla de minimización

Antes de pegar cualquier contenido, responde:

1. ¿Tengo autorización para compartirlo?
2. ¿Es necesario para resolver la tarea?
3. ¿Puedo reducirlo?
4. ¿Puedo reemplazar datos reales?
5. ¿Conozco la política de la herramienta o de la organización?

Si alguna respuesta es “no” o “no sé”, detente.

## 2.5 El paquete de contexto

Para tareas repetidas, crea un bloque breve que puedas actualizar:

```text
PROYECTO
Portal educativo COA.

TECNOLOGÍAS
Next.js App Router, React, JavaScript y Tailwind CSS.

ARQUITECTURA
Páginas de servidor por defecto.
Interacción limitada a componentes con "use client".

REGLAS
- No usar TypeScript.
- No instalar dependencias.
- No usar Pages Router.
- No convertir el portal completo en cliente.
- Conservar accesibilidad y diseño móvil primero.
- Todo cambio debe superar lint y build.

OBJETIVO ACTUAL
Agregar comparación de dos o tres cursos dentro de /cursos.
```

Este bloque no reemplaza el código relevante. Evita repetir restricciones y reduce contradicciones.

## 2.6 Chat largo no significa contexto perfecto

Una conversación puede acumular:

- decisiones antiguas;
- fragmentos que ya cambiaron;
- errores resueltos;
- instrucciones contradictorias;
- suposiciones que nunca se confirmaron.

Cuando una tarea cambia, resume el estado actual:

```text
Ignora las propuestas anteriores que no fueron incorporadas.
Este es el estado verificado:
- build correcto;
- selección guardada como arreglo de slugs;
- máximo de tres cursos;
- falta el botón para limpiar.
Trabaja solamente sobre el fragmento siguiente.
```

No uses “ignora todo” como sustituto de un contexto ordenado. Indica qué estado es válido.

### Ejercicio 2. Preparar un contexto seguro

Imagina que el comparador produce un error al seleccionar el tercer curso. Tienes:

- el componente completo;
- un archivo `.env`;
- una captura de la consola;
- el arreglo de cursos;
- el mensaje de error;
- el repositorio privado de un cliente;
- las versiones de Next.js y React.

Redacta dos listas:

**Información que compartirías**

- incluye solamente lo necesario;
- explica por qué cada elemento ayuda.

**Información que excluirías o reemplazarías**

- identifica el riesgo;
- propone un valor ficticio si hace falta.

Después escribe un paquete de contexto de máximo 140 palabras para solicitar un diagnóstico.

---

# 3. Instrucciones eficaces para desarrollo

## 3.1 No existe un “prompt mágico”

Una instrucción profesional no es una frase secreta. Es una especificación breve y comprobable.

La calidad depende de:

- claridad del objetivo;
- contexto relevante;
- restricciones;
- ejemplos cuando aportan valor;
- formato solicitado;
- posibilidad de iterar;
- criterios para verificar.

Una conversación útil puede comenzar con una pregunta, continuar con un plan y terminar con un cambio pequeño. No es necesario pedir todo en un único mensaje.

## 3.2 Anatomía de una solicitud técnica

Utiliza esta plantilla:

```text
CONTEXTO
[Qué proyecto es, tecnologías, versiones y arquitectura relevante]

OBJETIVO
[Qué resultado se necesita]

ESTADO ACTUAL
[Qué ocurre ahora y qué ya funciona]

CRITERIOS DE ACEPTACIÓN
[Condiciones observables que debe cumplir]

RESTRICCIONES
[Qué no puede cambiarse o agregarse]

MATERIAL RELEVANTE
[Árbol, código, datos o error entre delimitadores]

SALIDA SOLICITADA
[Plan, explicación, fragmento, diff, revisión o casos de prueba]

VERIFICACIÓN
[Qué pruebas deben proponerse o qué evidencia se revisará]
```

No todas las solicitudes necesitan ocho encabezados. Utiliza solamente los que reduzcan ambigüedad.

## 3.3 De una petición vaga a una tarea verificable

### Petición vaga

```text
Haz un comparador bonito con IA.
```

Problemas:

- no define dónde aparece;
- no indica cuántos cursos;
- no describe los datos;
- no establece estados;
- “bonito” no se puede comprobar;
- no limita dependencias;
- no protege funciones existentes.

### Petición mejorada

```text
CONTEXTO
Portal COA con Next.js App Router, JavaScript y Tailwind.
El catálogo ya tiene búsqueda, filtros y favoritos.

OBJETIVO
Diseñar el comportamiento de un comparador dentro de /cursos.

CRITERIOS
- Permitir seleccionar entre 2 y 3 cursos.
- Evitar duplicados.
- Permitir quitar uno o limpiar todos.
- Comparar nombre, nivel, duración y habilidades.
- Funcionar con teclado y desde 320 px.

RESTRICCIONES
- No escribir código todavía.
- No instalar dependencias.
- No crear una ruta nueva.
- No cambiar búsqueda, filtros ni favoritos.

SALIDA
Propón un plan de componentes, estados y casos límite.
Señala decisiones que necesiten confirmación.
```

Ahora la salida puede evaluarse.

## 3.4 Criterios de aceptación

Un criterio describe un resultado observable.

| Débil | Comprobable |
|---|---|
| El comparador debe ser bueno | Permite seleccionar máximo tres cursos |
| Debe ser responsive | No produce desplazamiento horizontal a 320 px |
| Debe ser accesible | Cada control funciona con teclado y comunica su estado |
| Debe manejar errores | Si no hay selección, muestra una instrucción útil |
| El código debe estar limpio | No muta estado y separa selección de presentación |

Una fórmula útil:

```text
Dado [estado inicial]
Cuando [acción]
Entonces [resultado observable]
```

Ejemplo:

```text
Dado que ya hay tres cursos seleccionados,
cuando el usuario intenta seleccionar un cuarto,
entonces el sistema conserva los tres originales
y explica que el límite es tres.
```

## 3.5 Delimitadores

Separa instrucciones, datos y código:

````text
Analiza solamente el componente entre <componente> y </componente>.
No modifiques el arreglo de datos.

<componente>
```jsx
// código
```
</componente>
````

Los delimitadores reducen confusión. No convierten contenido peligroso en seguro y no reemplazan la revisión.

## 3.6 Solicitar una salida revisable

“Dame el código” suele producir más trabajo de revisión.

Solicita:

- archivos afectados;
- supuestos;
- plan corto;
- fragmento mínimo;
- cambio antes/después;
- explicación por bloque;
- riesgos;
- casos de prueba;
- documentación que debe consultarse.

Ejemplo:

```text
Antes del código:
1. enumera supuestos;
2. indica los archivos que cambiarían;
3. explica el estado necesario.

Después:
4. devuelve solamente el componente nuevo;
5. agrega cinco pruebas manuales;
6. señala cualquier parte que no puedas verificar.
```

## 3.7 Pedir preguntas antes de implementar

Cuando faltan decisiones importantes:

```text
No implementes todavía.
Haz como máximo cuatro preguntas que cambien la arquitectura,
la experiencia del usuario o los criterios de aceptación.
No preguntes por preferencias que ya están definidas.
```

No conviertas esto en una excusa para una conversación interminable. Si el requisito ya es suficiente, pide un plan.

## 3.8 Dividir tareas

Una mala secuencia:

```text
Crea el comparador, cambia los datos, mejora el diseño,
refactoriza el catálogo, agrega pruebas y publica.
```

Una secuencia revisable:

```text
1. Definir comportamiento y casos límite.
2. Diseñar estado como arreglo de slugs.
3. Crear función para alternar selección.
4. Crear resumen de selección.
5. Crear tabla o tarjetas de comparación.
6. Agregar accesibilidad.
7. Probar regresiones.
8. Refactorizar solamente después.
```

Cada paso debe dejar el proyecto en un estado comprensible.

## 3.9 Plantillas esenciales

### Comprender código

```text
Explica este archivo para una persona que conoce React y Next.js.
Sigue este orden:
1. responsabilidad;
2. entradas;
3. estado;
4. valores derivados;
5. eventos;
6. salida;
7. dependencias con otros archivos.
No propongas cambios todavía.

[código]
```

### Diseñar un plan

```text
Propón un plan de máximo seis pasos.
Para cada paso indica:
- objetivo;
- archivo afectado;
- riesgo;
- comprobación.
No escribas código.

[requisitos y árbol relevante]
```

### Generar un componente

```text
Crea un componente de React llamado ComparisonSummary.
Recibe selectedCourses y onClear.
Muestra cantidad, nombres y un botón para limpiar.

Restricciones:
- JavaScript.
- Sin dependencias.
- Sin estado duplicado.
- HTML semántico.
- Foco visible con Tailwind.
- No modificar otros archivos.

Devuelve:
1. supuestos;
2. código;
3. explicación;
4. casos de prueba.
```

### Crear estilos

```text
Aplica Tailwind CSS al fragmento.
Conserva la estructura semántica.
Utiliza móvil primero, contraste suficiente y foco visible.
No construyas clases con fragmentos dinámicos.
No agregues una biblioteca.
Explica las decisiones adaptables.

[fragmento]
```

### Diagnosticar

```text
No propongas una corrección todavía.
Analiza el error y devuelve:
1. qué significa;
2. tres hipótesis ordenadas;
3. evidencia que apoya cada una;
4. comprobación mínima para distinguirlas;
5. información que falta.

[contexto, error exacto y fragmento]
```

### Refactorizar

```text
Refactoriza sin cambiar el comportamiento observable.
Comportamientos protegidos:
- [lista]

Restricciones:
- no cambiar interfaz pública;
- no agregar dependencias;
- no mezclar refactorización con nuevas funciones.

Primero enumera duplicaciones y riesgos.
Después propone un cambio pequeño.
Incluye pruebas de regresión.
```

### Revisar código

```text
Revisa el cambio como una segunda opinión.
No lo reescribas completo.

Clasifica cada hallazgo:
- crítico;
- importante;
- mejora.

Incluye:
- archivo o fragmento;
- evidencia;
- impacto;
- corrección mínima;
- prueba que lo detectaría.

No inventes problemas para llenar la lista.
```

## 3.10 Respuestas que deben generar sospecha

Revisa con mayor cuidado si la IA:

- afirma “esto funciona” sin haber ejecutado el proyecto;
- inventa resultados de pruebas;
- no menciona supuestos;
- reemplaza un archivo completo para cambiar una función;
- instala una dependencia para algo sencillo;
- mezcla JavaScript y TypeScript;
- usa una API que no aparece en la documentación actual;
- convierte todos los componentes en cliente;
- elimina validaciones;
- agrega `try/catch` que oculta el error;
- propone desactivar ESLint;
- utiliza `any` o comentarios para silenciar problemas;
- cambia nombres y estilos sin relación con la tarea;
- presenta una única opción como inevitable.

### Ejercicio 3. Reparar tres instrucciones

Mejora las siguientes solicitudes:

```text
1. Arregla mi código.
2. Haz una tarjeta moderna.
3. Optimiza todo el proyecto.
```

Cada nueva versión debe incluir:

- contexto;
- objetivo;
- criterios de aceptación;
- restricciones;
- salida solicitada;
- forma de verificación.

Después explica qué ambigüedad eliminaste en cada caso.

### Ejercicio 4. Plan antes del código

Entrega a ChatGPT o Claude el mapa actual del catálogo y solicita un plan para agregar el comparador.

Condiciones:

- máximo seis pasos;
- ningún código;
- archivos afectados;
- estado necesario;
- cinco casos límite;
- riesgos para búsqueda, filtros y favoritos.

Evalúa la respuesta:

1. ¿Propone almacenar cursos completos o identificadores?
2. ¿Duplica datos que ya existen?
3. ¿Introduce una dependencia?
4. ¿Convierte más componentes a cliente?
5. ¿Protege las funciones anteriores?

Reescribe el plan con tus propias decisiones. El plan final pertenece al estudiante, no a la herramienta.

---

# 4. Implementación asistida en cambios controlados

## 4.1 Establecer una línea base

Antes de pedir un cambio:

1. actualiza la rama de trabajo;
2. confirma que no existen cambios desconocidos;
3. ejecuta ESLint;
4. ejecuta la construcción;
5. prueba la función relacionada;
6. crea un commit de estado estable.

```text
Estado estable
├── lint correcto
├── build correcto
├── pruebas manuales correctas
└── commit identificable
```

Si el proyecto ya estaba roto, una propuesta nueva no tendrá una línea clara de comparación.

## 4.2 Una función por vez

Solicita primero la unidad más pequeña con valor.

Para el comparador:

```text
Paso 1: alternar un slug
Paso 2: impedir más de tres
Paso 3: obtener cursos seleccionados
Paso 4: mostrar resumen
Paso 5: representar comparación
Paso 6: mejorar accesibilidad
```

Después de cada paso:

- lee el cambio;
- explica el flujo;
- prueba;
- registra la decisión;
- crea un commit si el estado es estable.

## 4.3 Revisar la propuesta como un diff

No leas solamente el resultado final. Pregunta:

```text
¿Qué archivo cambia?
¿Qué línea o responsabilidad cambia?
¿Por qué?
¿Qué comportamiento se conserva?
¿Qué comportamiento nuevo aparece?
¿Qué riesgo introduce?
¿Cómo se deshace?
```

Una modificación limitada debe producir un cambio limitado.

```text
Solicitud: corregir límite de selección

Cambio razonable:
└── función de selección + mensaje asociado

Cambio sospechoso:
├── reemplazo del catálogo
├── nueva biblioteca de estado
├── nueva ruta
├── cambio de colores
└── renombrado de todos los componentes
```

## 4.4 Comprender antes de aceptar

Utiliza la prueba de explicación:

1. ¿Qué recibe el componente?
2. ¿Qué estado mantiene?
3. ¿Por qué ese estado es necesario?
4. ¿Qué ocurre al seleccionar?
5. ¿Cómo evita duplicados?
6. ¿Cómo aplica el límite?
7. ¿Qué se muestra con cero, uno, dos y tres cursos?
8. ¿Qué ocurriría si cambia el arreglo original?

Si no puedes responder, no integres el código.

## 4.5 No duplicar valores derivados

La IA puede proponer:

```js
const [selectedIds, setSelectedIds] = useState([]);
const [selectedCourses, setSelectedCourses] = useState([]);
```

Esto crea dos fuentes de verdad.

Si los cursos seleccionados pueden obtenerse de los identificadores y los datos:

```js
const selectedCourses = courses.filter((course) =>
  selectedIds.includes(course.slug)
);
```

entonces `selectedCourses` es un valor derivado, no un segundo estado.

```text
courses + selectedIds
          ↓
  selectedCourses
```

Una propuesta más larga no es necesariamente más completa. Puede introducir sincronización innecesaria.

## 4.6 Generar sin inventar arquitectura

Incluye límites:

```text
Trabaja dentro de la arquitectura existente.
No crees nuevas capas, hooks, contextos, rutas o dependencias
si el requisito puede resolverse dentro de CourseExplorer.
Si consideras imprescindible una nueva abstracción, justifícala
antes de escribirla.
```

No prohíbas toda mejora. Exige justificación.

## 4.7 Comprobar el código generado

Utiliza cuatro capas:

### Capa 1. Lectura

- ¿Reconoces cada API?
- ¿Las variables tienen nombres claros?
- ¿Existe mutación?
- ¿Existe código muerto?
- ¿Se utilizan claves estables?
- ¿Se alteró una interfaz pública?

### Capa 2. Herramientas

```bash
npm run lint
npm run build
```

No pidas a la IA que “confirme” esos resultados. Ejecútalos.

### Capa 3. Pruebas manuales

- caso normal;
- estado vacío;
- límite;
- dato inesperado;
- teclado;
- móvil;
- recarga;
- regresión de funciones anteriores.

### Capa 4. Documentación

Verifica APIs y comportamientos que puedan depender de versión.

## 4.8 Aceptar, modificar o rechazar

Toda propuesta debe terminar en una de estas decisiones:

| Decisión | Significado | Ejemplo |
|---|---|---|
| Aceptar | Cumple y fue verificada | Función mínima, clara y probada |
| Modificar | La idea sirve, pero necesita cambios | Conservas lógica y corriges accesibilidad |
| Rechazar | No conviene al proyecto | Agrega Redux para tres identificadores |

“La IA lo recomendó” no es una justificación.

### Ejercicio 5. Implementar por incrementos

En una rama nueva, crea una prueba pequeña de selección de cursos.

1. Escribe tú mismo los criterios de aceptación.
2. Pide a la IA solamente la función que agrega o elimina un slug.
3. Explica la función línea por línea.
4. Prueba selección y eliminación.
5. Pide una segunda modificación para limitar la selección a tres.
6. Prueba el cuarto intento.
7. Revisa el diff.
8. Registra una decisión: aceptar, modificar o rechazar.

No construyas todavía la presentación completa. El objetivo es practicar control del alcance.

---

# 5. Diagnóstico y depuración con evidencias

## 5.1 Depurar no es pedir una corrección

Depurar significa encontrar la causa de un comportamiento.

```text
Síntoma
  ↓
Evidencia
  ↓
Hipótesis
  ↓
Experimento
  ↓
Causa
  ↓
Corrección
  ↓
Prueba de regresión
```

Si comienzas por “corrige esto”, puedes recibir un parche que oculta el síntoma.

## 5.2 Recolección mínima

Antes de consultar:

- reproduce el error;
- anota los pasos exactos;
- copia el primer mensaje relevante;
- identifica el archivo y la línea;
- comprueba si ocurría antes;
- reduce el fragmento;
- registra qué intentaste;
- elimina datos sensibles.

Plantilla:

```text
ESPERADO
Al seleccionar el tercer curso, debe aparecer en el panel.

ACTUAL
El segundo curso desaparece cuando se agrega el tercero.

PASOS
1. Abrir /cursos.
2. Seleccionar Lógica.
3. Seleccionar React.
4. Seleccionar Next.js.

ERROR
[mensaje exacto, si existe]

CAMBIO RECIENTE
Se reemplazó push por una actualización funcional.

VERSIONES
[versiones relevantes]

CÓDIGO MÍNIMO
[fragmento]
```

## 5.3 Primer error antes que errores derivados

Una compilación puede mostrar varios mensajes. El primero suele generar otros.

```text
Error inicial
    ├── importación fallida
    ├── componente no cargado
    └── ruta sin construir
```

Pide analizar primero el error con mayor evidencia. Después vuelve a ejecutar la construcción.

## 5.4 Hipótesis ordenadas

Una buena respuesta de diagnóstico no debe lanzar diez posibilidades sin orden.

Solicita:

```text
Ordena las hipótesis por probabilidad.
Para cada una incluye:
- evidencia a favor;
- evidencia en contra;
- comprobación mínima;
- resultado que la confirmaría.
```

Ejemplo:

| Hipótesis | Evidencia | Comprobación |
|---|---|---|
| Se muta el arreglo de estado | Se utiliza `push` sobre el estado | Registrar referencias antes y después |
| Se utiliza una clave inestable | La lista usa índice | Quitar un elemento intermedio |
| Existen slugs duplicados | La selección usa slug | Revisar unicidad de datos |

## 5.5 Cambiar una variable por experimento

No apliques tres correcciones simultáneas:

```text
Cambiar estado
+ cambiar key
+ mover componente
+ agregar efecto
= no sabrás qué resolvió la causa
```

Realiza un experimento pequeño:

1. define una hipótesis;
2. cambia una sola variable;
3. reproduce;
4. observa;
5. conserva o revierte;
6. registra.

## 5.6 Evitar “soluciones” peligrosas

Rechaza propuestas como:

```js
try {
  // código
} catch {
  // no hacer nada
}
```

También sospecha de:

- eliminar la validación;
- recargar la página;
- usar un retraso arbitrario;
- desactivar una regla;
- convertir todo a cliente;
- guardar duplicados “por si acaso”;
- instalar una versión diferente sin investigar;
- borrar archivos de configuración;
- afirmar que es un error del framework sin evidencia.

## 5.7 Solicitar una corrección mínima

Después de confirmar la causa:

```text
La hipótesis confirmada es mutación directa del estado.
Propón la corrección mínima.
No cambies la estructura del componente.
Explica por qué React recibirá una nueva referencia.
Incluye una prueba que falle con la versión anterior.
```

## 5.8 Verificación de regresión

Corregir un caso no basta. Prueba:

| Caso | Resultado esperado |
|---|---|
| Seleccionar uno | Aparece una vez |
| Seleccionar segundo | Ambos permanecen |
| Quitar primero | Solo queda el segundo |
| Volver a seleccionar | Aparece una vez |
| Intentar cuarto | No cambia la selección |
| Filtrar catálogo | La selección definida se comporta según el requisito |
| Recargar | Se conserva o reinicia según la decisión documentada |

### Ejercicio 6. Diagnóstico sin corrección inmediata

Provoca de forma controlada un error sencillo en una rama temporal. Puedes:

- escribir mal una importación;
- acceder a una propiedad inexistente;
- mutar un arreglo de estado;
- utilizar una clase de Tailwind construida con fragmentos.

Después:

1. reproduce el síntoma;
2. guarda el mensaje exacto;
3. pide a la IA tres hipótesis sin código;
4. ejecuta una comprobación por hipótesis;
5. confirma la causa;
6. pide una corrección mínima;
7. prueba el caso original y dos regresiones;
8. revierte o conserva el cambio según corresponda.

Entrega la secuencia completa, no solamente la solución.

---

# 6. Revisión, refactorización y optimización

## 6.1 Tres tareas diferentes

No mezcles:

### Revisión

Busca defectos, riesgos e inconsistencias.

### Refactorización

Mejora la estructura sin cambiar el comportamiento observable.

### Optimización

Mejora una medida concreta: tiempo, tamaño, renderizados, claridad del flujo o experiencia.

```text
Revisión       → ¿qué problema existe?
Refactorización → ¿cómo simplifico sin cambiar resultados?
Optimización    → ¿qué medida necesito mejorar y cómo la compararé?
```

“Optimiza el código” es demasiado ambiguo.

## 6.2 Revisión con evidencia

Una IA puede inventar observaciones para cumplir la solicitud. Evita pedir “encuentra diez errores”.

Utiliza:

```text
Reporta solamente hallazgos respaldados por el código.
Si no encuentras un problema en una categoría, escribe "sin hallazgos".
No propongas cambios de estilo como si fueran defectos.
```

Categorías útiles:

- funcionalidad;
- estado y datos derivados;
- accesibilidad;
- separación servidor-cliente;
- compatibilidad con App Router;
- Tailwind;
- seguridad;
- rendimiento;
- mantenibilidad;
- pruebas faltantes.

## 6.3 Gravedad

| Nivel | Significado | Ejemplo |
|---|---|---|
| Crítico | Impide usar, construir o protege mal información | Credencial publicada |
| Importante | Rompe un caso real o introduce riesgo claro | Cuarto curso supera el límite |
| Mejora | Aumenta claridad sin corregir un fallo | Extraer un bloque repetido |

La gravedad debe depender del impacto, no del tono de la respuesta.

## 6.4 Verificar cada hallazgo

Para cada observación:

1. localiza el fragmento;
2. reproduce el problema;
3. comprueba la documentación si aplica;
4. decide la gravedad;
5. elige una corrección mínima;
6. añade una prueba.

No corrijas un problema que no existe.

## 6.5 Refactorización protegida por comportamiento

Antes de refactorizar, escribe los comportamientos que no deben cambiar:

```text
- La búsqueda encuentra por nombre y descripción.
- El filtro limita por categoría.
- Los favoritos persisten.
- La selección evita duplicados.
- El máximo es tres.
- Los detalles siguen enlazando correctamente.
```

Después ejecuta las mismas pruebas antes y después.

```text
Pruebas antes ──► refactorización ──► mismas pruebas después
```

Si también agregas una función, no podrás distinguir una regresión de un nuevo requisito.

## 6.6 Refactorizaciones razonables

La IA puede ayudar a:

- eliminar duplicación evidente;
- extraer una función pura;
- mejorar nombres;
- reducir condiciones anidadas;
- separar un componente con dos responsabilidades claras;
- convertir estado duplicado en valor derivado;
- reunir constantes;
- documentar una decisión no obvia.

No extraigas cada línea en una función. La abstracción también tiene costo.

## 6.7 Optimización basada en una medida

Antes:

```text
¿Qué está lento o costoso?
¿Cómo lo medí?
¿Qué experiencia afecta?
¿Cuál será la comparación?
```

Para un catálogo pequeño, agregar memoización en todas partes puede aumentar complejidad sin beneficio observable.

Evita solicitudes como:

```text
Agrega useMemo y useCallback para optimizar todo.
```

Mejor:

```text
Revisa si existe trabajo repetido medible en este componente.
No agregues memoización por defecto.
Explica qué renderizado o cálculo evitaría, qué costo añade
y cómo comprobaríamos el beneficio.
```

## 6.8 Revisión de accesibilidad asistida

La IA puede preparar una lista, pero debes probar:

- orden de tabulación;
- foco visible;
- nombres accesibles;
- estado `aria-pressed` cuando corresponde;
- contraste;
- lectura sin depender solamente del color;
- zoom;
- ancho de 320 píxeles;
- mensajes comprensibles.

Ejemplo:

```jsx
<button
  type="button"
  aria-pressed={isSelected}
  onClick={() => onToggle(course.slug)}
>
  {isSelected ? "Quitar de comparación" : "Comparar"}
</button>
```

`aria-pressed` comunica el estado de un botón conmutador. No lo agregues a todos los botones.

## 6.9 Revisión de seguridad y privacidad

Busca:

- secretos incluidos en el repositorio;
- datos privados en prompts o bitácoras;
- dependencias desconocidas;
- enlaces inseguros;
- contenido generado representado sin control cuando corresponda;
- instrucciones que solicitan desactivar validaciones;
- cambios amplios fuera del objetivo.

No publiques conversaciones completas si contienen información que no debe formar parte del repositorio. Resume la interacción y conserva solamente el contexto permitido.

### Ejercicio 7. Dos revisiones, una decisión

Entrega el mismo componente a dos conversaciones separadas. Puedes utilizar:

- ChatGPT y Claude;
- dos conversaciones distintas en una sola herramienta;
- una herramienta de conversación y GitHub Copilot.

Solicita una revisión con el mismo formato.

Compara:

| Aspecto | Revisión A | Revisión B | Tu decisión |
|---|---|---|---|
| Hallazgo |  |  |  |
| Evidencia |  |  |  |
| Gravedad |  |  |  |
| Corrección |  |  |  |
| Prueba |  |  |  |

Debes encontrar:

- una coincidencia;
- una diferencia;
- una observación no demostrada;
- una recomendación que aceptarías;
- una que modificarías o rechazarías.

### Ejercicio 8. Refactorización con contrato

Elige una función real del portal que tenga duplicación o condiciones difíciles de leer.

1. Escribe un contrato de al menos cinco comportamientos.
2. Ejecuta los casos antes.
3. Pide un único refactor pequeño.
4. Revisa que no cambie la interfaz pública.
5. Ejecuta los mismos casos.
6. Compara el diff.
7. Explica si el cambio redujo complejidad o solamente movió código.

---

# 7. Flujo profesional con Git, documentación e instrucciones

## 7.1 Una rama para un objetivo

Ejemplo:

```bash
git switch -c feature/course-comparison
```

Mantén el alcance:

```text
feature/course-comparison
├── selección
├── panel
├── accesibilidad
├── pruebas
└── documentación
```

No mezcles una nueva identidad visual, actualización de dependencias y comparador en el mismo cambio.

## 7.2 Commits con intención

```text
feat: add course selection logic
feat: render accessible comparison panel
test: document comparison scenarios
fix: prevent fourth course selection
refactor: derive selected courses from slugs
docs: record AI-assisted decisions
```

Cada commit debe representar un estado comprensible. No crees un commit por cada carácter ni un único commit con todo el módulo.

## 7.3 Bitácora de IA

Crea `docs/AI_LOG.md` o la ubicación indicada.

```markdown
# Bitácora de desarrollo asistido por IA

| ID | Objetivo | Herramienta | Contexto entregado | Propuesta | Decisión | Verificación |
|---|---|---|---|---|---|---|
| IA-01 | Diseñar selección | ChatGPT | Reglas y árbol | Guardar objetos | Modificar: usar slugs | Pruebas 1–5 |
```

La bitácora no debe ser una copia completa de todas las conversaciones. Debe permitir reconstruir decisiones.

Para cada interacción importante registra:

- objetivo;
- herramienta;
- contexto;
- prompt o resumen fiel;
- propuesta;
- decisión;
- modificación realizada;
- pruebas;
- referencia al commit.

Debe existir al menos una propuesta rechazada o modificada.

## 7.4 Registro de pruebas

Crea `docs/TEST_PLAN.md`:

```markdown
| ID | Estado inicial | Acción | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|---|
| CMP-01 | Sin selección | Seleccionar Lógica | Aparece 1/3 | Aprobado | captura o nota |
```

No escribas “todo funciona”. Enumera casos.

## 7.5 Instrucciones para GitHub Copilot

Si utilizas GitHub Copilot y tu entorno admite instrucciones del repositorio, puedes crear:

```text
.github/
└── copilot-instructions.md
```

Contenido inicial:

```markdown
# Instrucciones del repositorio COA

- Utiliza JavaScript, no TypeScript.
- El proyecto usa Next.js con App Router y Tailwind CSS.
- Conserva los componentes como servidor por defecto.
- Agrega "use client" solamente cuando exista interacción de navegador.
- No agregues dependencias sin justificarlo.
- No utilices Pages Router, React Router, Bootstrap ni Redux.
- Conserva HTML semántico, foco visible y diseño móvil primero.
- No construyas clases de Tailwind mediante fragmentos dinámicos.
- Todo cambio debe superar lint y build.
- Propón cambios pequeños y explica los supuestos.
```

Estas instrucciones ayudan a mantener contexto, pero no garantizan cumplimiento. Revisa cada salida.

Si no utilizas Copilot, conserva estas reglas dentro de tu paquete de contexto.

## 7.6 Documentación generada a partir de hechos

La IA puede ayudarte a redactar el README solamente después de entregar datos reales:

```text
Redacta una sección de verificación utilizando exclusivamente
los resultados siguientes. No inventes comandos, pruebas ni cifras.

[resultados reales]
```

Comprueba nombres de rutas, comandos y funciones antes de publicar.

## 7.7 Vista previa antes de producción

Flujo:

```text
Rama
  ↓
Commits
  ↓
Push
  ↓
Vista previa de Vercel
  ↓
Pruebas
  ↓
Correcciones
  ↓
Producción
```

La vista previa permite revisar el cambio sin reemplazar inmediatamente la versión principal.

## 7.8 Defensa técnica

Antes de entregar, prepárate para explicar:

- por qué guardaste slugs y no objetos;
- dónde vive el estado;
- qué valores son derivados;
- cómo se impide un cuarto curso;
- cómo se evita mutar estado;
- qué propuesta de IA rechazaste;
- qué error real diagnosticó la IA;
- qué comprobaste con documentación;
- qué pruebas ejecutaste personalmente;
- qué parte escribirías diferente sin IA.

Si no puedes defender una parte, revísala.

### Ejercicio 9. Crear el sistema de trabajo

En el repositorio del portal:

1. crea la rama del módulo;
2. agrega `docs/AI_LOG.md`;
3. agrega `docs/TEST_PLAN.md`;
4. crea un paquete de contexto del proyecto;
5. si usas Copilot, agrega `.github/copilot-instructions.md`;
6. ejecuta línea base;
7. registra el resultado inicial;
8. crea un commit de preparación.

Todavía no implementes el proyecto completo.

---

# 8. Mini proyecto: rescate de un selector defectuoso

## Objetivo

Diagnosticar y corregir un componente defectuoso utilizando IA en etapas controladas.

El objetivo no es conseguir una respuesta rápida. Debes demostrar:

- análisis propio;
- diagnóstico asistido;
- corrección mínima;
- comprensión;
- verificación;
- registro de una decisión.

## Código inicial

```jsx
"use client";

import { useState } from "react";

export default function BrokenCourseSelector({ courses }) {
  const [selected, setSelected] = useState([]);

  function toggleCourse(course) {
    if (selected.includes(course)) {
      selected.splice(selected.indexOf(course), 1);
      setSelected(selected);
      return;
    }

    selected.push(course);
    setSelected(selected);
  }

  return (
    <section>
      <h2>Selecciona cursos</h2>

      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            <span>{course.title}</span>
            <button onClick={() => toggleCourse(course)}>
              {selected.includes(course) ? "Quitar" : "Comparar"}
            </button>
          </li>
        ))}
      </ul>

      <p>Seleccionados: {selected.length}</p>
    </section>
  );
}
```

## Datos para probar

```js
const courses = [
  {
    slug: "logica-programacion",
    title: "Lógica de Programación",
  },
  {
    slug: "react-next-ia",
    title: "Desarrollo Web Moderno",
  },
  {
    slug: "sql-bases-datos",
    title: "SQL y Bases de Datos",
  },
  {
    slug: "ciberseguridad",
    title: "Ciberseguridad",
  },
];
```

## Problemas que debes investigar

No asumas que la lista siguiente contiene la solución completa:

- la interfaz puede no actualizarse;
- el estado puede estar mutándose;
- la identidad de los elementos puede ser frágil;
- las claves pueden depender de posición;
- no existe un límite de tres;
- el estado del botón no se comunica adecuadamente;
- el componente no explica qué ocurre al alcanzar el límite.

## Fase 1. Análisis propio

Antes de utilizar IA:

1. subraya cada línea sospechosa;
2. escribe al menos cuatro hipótesis;
3. predice qué ocurrirá al seleccionar, quitar y volver a seleccionar;
4. define siete criterios de aceptación.

## Fase 2. Diagnóstico asistido

Utiliza una solicitud como:

```text
Analiza el componente entre delimitadores.
No escribas la versión corregida.

Devuelve una tabla con:
- hallazgo;
- evidencia exacta;
- comportamiento que puede producir;
- experimento mínimo;
- gravedad.

No inventes problemas sin evidencia.

<componente>
[código]
</componente>
```

Compara el diagnóstico con tus hipótesis.

## Fase 3. Plan de corrección

Solicita un plan que:

- guarde identificadores estables;
- no mute el estado;
- utilice claves estables;
- impida seleccionar más de tres;
- permita quitar y volver a agregar;
- comunique estado al usuario;
- no instale dependencias.

No pidas todavía el archivo completo.

## Fase 4. Correcciones pequeñas

Orden recomendado:

1. cambiar la representación del estado;
2. corregir la actualización inmutable;
3. corregir claves y comparación;
4. aplicar límite;
5. mejorar nombres y accesibilidad;
6. agregar mensaje de límite.

Después de cada corrección, prueba.

## Requisitos

El resultado debe:

1. Guardar slugs o identificadores estables.
2. Evitar mutación directa.
3. Utilizar actualización funcional cuando dependa del estado anterior.
4. Utilizar `course.slug` como clave.
5. Impedir duplicados.
6. Limitar a tres cursos.
7. Permitir quitar cualquier curso.
8. Permitir volver a seleccionarlo.
9. Utilizar `type="button"`.
10. Comunicar estado con `aria-pressed`.
11. Mostrar cantidad actual y máxima.
12. Explicar por qué no se agregó el cuarto curso.
13. Conservar el componente sin dependencias.

## Pruebas obligatorias

| ID | Acción | Resultado esperado |
|---|---|---|
| MINI-01 | Seleccionar el primer curso | Contador 1/3 y botón activo |
| MINI-02 | Seleccionar segundo y tercero | Contador 3/3 |
| MINI-03 | Intentar seleccionar cuarto | Selección sin cambios y mensaje útil |
| MINI-04 | Quitar el segundo | Contador 2/3 |
| MINI-05 | Agregar el cuarto | Contador 3/3 |
| MINI-06 | Quitar y volver a agregar el mismo | No aparece duplicado |
| MINI-07 | Operar solamente con teclado | Todas las acciones funcionan |
| MINI-08 | Revisar consola | No existen errores |

## Entrega del mini proyecto

Incluye:

- componente inicial;
- análisis propio;
- prompt de diagnóstico;
- resumen de la respuesta;
- plan final;
- componente corregido;
- tabla de pruebas;
- una recomendación aceptada;
- una recomendación modificada o rechazada;
- explicación de 120 a 180 palabras.

La explicación debe responder:

1. ¿Por qué `push` y `splice` eran problemáticos sobre el estado?
2. ¿Por qué un slug es más estable que el índice?
3. ¿Qué parte resolvió la IA?
4. ¿Qué decisión fue tuya?

[Entregar el mini proyecto del Módulo 5](https://forms.gle/BayPBDiXAGurWjnL6)

---

# 9. Proyecto del módulo: sprint profesional asistido por IA para COA

## Descripción

Agrega un comparador de cursos al portal COA aprobado en el Módulo 4 y realiza una revisión de calidad del proyecto.

La IA debe participar en el proceso, pero el resultado debe demostrar control humano.

```text
Portal aprobado
      ↓
Línea base
      ↓
Especificación propia
      ↓
Plan asistido
      ↓
Implementación incremental
      ↓
Diagnóstico de un problema real
      ↓
Revisión asistida
      ↓
Correcciones verificadas
      ↓
Vista previa
      ↓
Producción
```

## Resultado profesional

El portal debe permitir:

- explorar cursos;
- buscar y filtrar;
- conservar favoritos;
- seleccionar hasta tres cursos;
- reconocer visualmente cuáles están seleccionados;
- comparar información equivalente;
- quitar elementos;
- limpiar la comparación;
- entender estados vacíos y límites;
- operar con teclado;
- utilizar el resultado en móvil y escritorio.

## Alcance obligatorio

El proyecto tiene dos partes:

### Parte A. Comparador de cursos

Nueva función visible dentro de `/cursos`.

### Parte B. Revisión de calidad

Revisión asistida del portal y corrección de al menos dos hallazgos reales.

No se aprobará una entrega que solamente cambie el diseño o adjunte conversaciones.

## Requisitos funcionales del comparador

### 1. Selección

- Cada tarjeta ofrece una acción para comparar.
- La acción comunica si el curso está seleccionado.
- Se utilizan slugs o identificadores estables.
- No existen duplicados.
- El máximo es tres.
- El usuario puede quitar cualquier curso.
- La selección de comparación no rompe favoritos.

### 2. Estados

Con cero cursos:

- se muestra una instrucción clara;
- no aparece una tabla vacía sin explicación.

Con un curso:

- se indica que falta al menos uno para comparar;
- se muestra el curso seleccionado.

Con dos o tres:

- aparece la comparación completa.

Al intentar un cuarto:

- la selección no cambia;
- aparece un mensaje comprensible;
- el sistema no falla.

### 3. Información comparada

Cada curso debe incluir:

- nombre;
- categoría;
- nivel;
- duración;
- descripción breve;
- al menos tres habilidades.

Todos los cursos deben mostrar los mismos campos en el mismo orden.

### 4. Acciones

- Quitar un curso individual.
- Limpiar toda la selección.
- Regresar o desplazarse al catálogo de forma comprensible.
- Conservar enlaces a los detalles de cada curso.

### 5. Integración

- Búsqueda continúa funcionando.
- Filtros continúan funcionando.
- Favoritos continúan funcionando.
- Persistencia de favoritos continúa funcionando.
- Las rutas dinámicas continúan funcionando.
- Metadatos y página 404 continúan funcionando.

La selección puede reiniciarse al recargar. Si decides persistirla, documenta la decisión y no dupliques la lógica de favoritos.

### 6. Accesibilidad

- Todos los controles son botones o enlaces reales.
- Los botones tienen `type="button"` cuando corresponde.
- El estado de selección se comunica con texto y `aria-pressed`.
- Existe foco visible.
- La interfaz funciona con teclado.
- Los mensajes no dependen solamente del color.
- Los encabezados describen las filas o secciones.
- El panel mantiene un orden de lectura lógico.

### 7. Diseño

- Se utiliza Tailwind CSS.
- El diseño es móvil primero.
- Funciona desde 320 píxeles.
- No existe desplazamiento horizontal de toda la página.
- La comparación puede usar tarjetas apiladas en móvil.
- La información equivalente se distingue con claridad.
- Se conserva la identidad visual de COA.
- No se agregan clases dinámicas construidas con fragmentos.

## Arquitectura esperada

Una solución posible:

```text
CoursesPage — servidor
└── CourseExplorer — cliente
    ├── CourseFilters
    ├── CourseList
    │   └── CourseCard
    ├── ComparisonSummary
    └── CourseComparison
```

Estado:

```text
selectedSlugs
      │
      ├──► isSelected(slug)
      ├──► toggleComparison(slug)
      └──► courses.filter(...)
                    │
                    ▼
             selectedCourses
```

`selectedCourses` debe derivarse de los datos y los slugs. No lo guardes como segundo estado sin una razón demostrable.

Si eliges otra arquitectura, documenta:

- responsabilidad de cada componente;
- ubicación del estado;
- flujo de propiedades;
- motivo de la diferencia.

## Restricciones técnicas

No utilices:

- TypeScript;
- Pages Router;
- React Router;
- Redux;
- Bootstrap;
- bibliotecas de tablas;
- bibliotecas de componentes;
- una API de IA;
- autenticación;
- base de datos;
- código de agente;
- cambios avanzados de configuración;
- dependencias nuevas sin aprobación;
- código que no puedas explicar.

Este módulo enseña a utilizar herramientas de IA durante el desarrollo. No enseña a incorporar un modelo de IA dentro de la aplicación.

## Fase 1. Línea base

Antes de modificar:

- crea una rama;
- ejecuta `npm run lint`;
- ejecuta `npm run build`;
- prueba rutas;
- prueba búsqueda;
- prueba filtros;
- prueba favoritos;
- revisa consola;
- registra commit estable.

## Fase 2. Especificación humana

Redacta:

- problema;
- objetivo;
- usuarios;
- criterios de aceptación;
- restricciones;
- casos límite;
- definición de terminado.

No solicites a la IA que escriba la primera versión de estos elementos. Puedes pedirle una revisión después.

## Fase 3. Plan asistido

Pide:

- máximo seis pasos;
- archivos afectados;
- estado y valores derivados;
- riesgos;
- pruebas por paso;
- preguntas solamente si cambian la arquitectura.

Revisa y crea tu plan definitivo.

## Fase 4. Implementación incremental

Orden sugerido:

1. estado `selectedSlugs`;
2. función inmutable de selección;
3. límite y mensaje;
4. integración en tarjetas;
5. resumen de selección;
6. presentación comparativa;
7. accesibilidad;
8. responsive;
9. regresiones.

Solicita cambios pequeños. No aceptes el reemplazo completo del portal.

## Fase 5. Diagnóstico real

Registra al menos un problema real encontrado durante el proyecto:

- síntoma;
- pasos;
- evidencia;
- hipótesis de IA;
- experimento;
- causa confirmada;
- corrección;
- prueba de regresión.

Si no aparece un error, utiliza un problema real de calidad, por ejemplo una selección que se pierde en un caso no previsto. No inventes que ocurrió una falla.

## Fase 6. Revisión asistida

Solicita una revisión en estas categorías:

- funcionalidad;
- estado;
- accesibilidad;
- Next.js;
- Tailwind;
- seguridad y privacidad;
- mantenibilidad;
- pruebas.

La revisión debe incluir evidencia. Corrige al menos dos hallazgos reales. Un cambio cosmético no cuenta como corrección funcional o de calidad.

## Fase 7. Verificación

### Pruebas del comparador

| ID | Estado inicial | Acción | Resultado esperado |
|---|---|---|---|
| CMP-01 | Sin selección | Seleccionar un curso | Aparece 1/3 |
| CMP-02 | Un curso | Seleccionar segundo | Aparece comparación |
| CMP-03 | Dos cursos | Seleccionar tercero | Aparecen tres |
| CMP-04 | Tres cursos | Intentar cuarto | Se conserva selección y aparece mensaje |
| CMP-05 | Tres cursos | Quitar el del centro | Quedan dos correctos |
| CMP-06 | Dos cursos | Agregar otro | Regresa a tres sin duplicados |
| CMP-07 | Con selección | Limpiar | Regresa a estado vacío |
| CMP-08 | Dos cursos | Abrir un detalle | Navega al curso correcto |
| CMP-09 | Cualquier estado | Utilizar teclado | Controles operables y foco visible |
| CMP-10 | Cualquier estado | Revisar a 320 px | Sin desbordamiento de página |

### Regresiones

| ID | Función existente | Resultado esperado |
|---|---|---|
| REG-01 | Buscar | Resultados correctos |
| REG-02 | Filtrar | Categoría correcta |
| REG-03 | Marcar favorito | Estado cambia |
| REG-04 | Recargar favorito | Persiste |
| REG-05 | Abrir detalle | Ruta dinámica correcta |
| REG-06 | Slug inexistente | Página 404 |
| REG-07 | Navegación principal | Funciona con teclado |
| REG-08 | Construcción | Finaliza correctamente |

### Calidad

- `npm run lint` finaliza.
- `npm run build` finaliza.
- No existen errores activos en consola.
- No existen secretos en repositorio ni bitácora.
- No se agregaron dependencias.
- El diff corresponde al alcance.

## Fase 8. Publicación

1. Sube la rama a GitHub.
2. Revisa la vista previa de Vercel.
3. Repite casos CMP-01, CMP-04, CMP-09, CMP-10 y REG-08.
4. Corrige cualquier diferencia.
5. Integra el cambio.
6. Verifica producción.

## Uso obligatorio de IA

Registra como mínimo cinco interacciones importantes:

1. **Revisión de especificación o plan.**
2. **Implementación de una unidad acotada.**
3. **Diagnóstico de un problema real.**
4. **Revisión de código.**
5. **Apoyo para documentación basada en resultados reales.**

Además:

- utiliza al menos dos tipos de interacción: conversación y Copilot si está disponible, o dos herramientas de conversación;
- modifica o rechaza al menos una propuesta;
- verifica cada cambio incorporado;
- identifica una limitación de la herramienta;
- no publiques información sensible.

## Bitácora obligatoria

| ID | Objetivo | Herramienta | Contexto | Salida | Decisión | Cambio final | Verificación | Commit |
|---|---|---|---|---|---|---|---|---|
| IA-01 |  |  |  |  |  |  |  |  |
| IA-02 |  |  |  |  |  |  |  |  |
| IA-03 |  |  |  |  |  |  |  |  |
| IA-04 |  |  |  |  |  |  |  |  |
| IA-05 |  |  |  |  |  |  |  |  |

## Historial sugerido

```text
chore: prepare AI-assisted development workflow
docs: define comparison acceptance criteria
feat: add immutable course selection
feat: add comparison summary and limit feedback
feat: render accessible course comparison
style: adapt comparison layout for small screens
fix: resolve verified comparison edge case
fix: apply verified quality review finding
test: document comparison and regression checks
docs: complete AI decision log
```

## Entrega

Incluye:

- nombre completo;
- enlace al repositorio;
- enlace a la vista previa;
- enlace de producción;
- rama o solicitud de cambio utilizada;
- especificación inicial;
- plan final;
- árbol de componentes;
- explicación del flujo de estado;
- captura del estado con cero cursos;
- captura con tres cursos en escritorio;
- captura con dos cursos a 320 píxeles;
- evidencia de navegación por teclado;
- tabla de pruebas;
- resultado de ESLint;
- resultado de construcción;
- `AI_LOG.md`;
- diagnóstico de un problema real;
- dos hallazgos corregidos;
- historial de commits;
- reflexión de 250 a 350 palabras.

La reflexión debe responder:

1. ¿Qué decisión importante tomaste antes de consultar una IA?
2. ¿Qué contexto produjo la respuesta más útil?
3. ¿Qué propuesta modificaste o rechazaste y por qué?
4. ¿Qué error o riesgo no detectó la IA?
5. ¿Cómo comprobaste el código?
6. ¿Qué parte puedes explicar sin consultar la conversación?
7. ¿En qué tarea no utilizarías IA la próxima vez?

[Entregar el proyecto del Módulo 5](https://forms.gle/BayPBDiXAGurWjnL6)

## Lista de comprobación

- [ ] El portal aprobado sigue funcionando.
- [ ] Existe una rama específica.
- [ ] La línea base está registrada.
- [ ] Los criterios de aceptación fueron escritos antes del código.
- [ ] El estado usa identificadores estables.
- [ ] No se muta estado.
- [ ] Los cursos seleccionados son un valor derivado.
- [ ] El máximo es tres.
- [ ] No existen duplicados.
- [ ] El cuarto intento produce un mensaje útil.
- [ ] Se puede quitar un curso.
- [ ] Se puede limpiar la selección.
- [ ] Existen estados para cero, uno, dos y tres.
- [ ] Se comparan los mismos campos.
- [ ] Los botones comunican su estado.
- [ ] El teclado funciona.
- [ ] El foco es visible.
- [ ] El diseño funciona desde 320 píxeles.
- [ ] Búsqueda y filtros funcionan.
- [ ] Favoritos y persistencia funcionan.
- [ ] Las rutas dinámicas funcionan.
- [ ] La página 404 funciona.
- [ ] No se agregaron dependencias innecesarias.
- [ ] No existen secretos en prompts ni repositorio.
- [ ] ESLint finaliza.
- [ ] La construcción finaliza.
- [ ] Existen pruebas del comparador.
- [ ] Existen pruebas de regresión.
- [ ] La vista previa fue verificada.
- [ ] Producción fue verificada.
- [ ] La bitácora contiene cinco interacciones.
- [ ] Existe una propuesta modificada o rechazada.
- [ ] Se documentó un diagnóstico real.
- [ ] Se corrigieron dos hallazgos demostrables.
- [ ] Puedes explicar todo el código entregado.

---

## Rúbrica de evaluación

**Puntuación total:** 100 puntos  
**Puntuación mínima para aprobar:** 70 puntos, sin incumplir un requisito crítico

| Criterio | Excelente | Satisfactorio | En proceso | Insuficiente | Puntos |
|---|---|---|---|---|---:|
| Funcionalidad del comparador | Todos los estados y casos límite funcionan sin regresiones | Función completa con fallos menores | Varios casos incompletos | La función esencial no opera | 20 |
| Comprensión y arquitectura | Estado mínimo, valores derivados y responsabilidades explicados con precisión | Arquitectura correcta con detalles por mejorar | Duplicación o explicación parcial | No puede explicar el código | 15 |
| Calidad de instrucciones y contexto | Solicitudes claras, seguras, acotadas y verificables | Buen contexto con omisiones menores | Instrucciones vagas o excesivas | Copia salidas sin controlar alcance | 15 |
| Calidad del código | Código claro, inmutable, organizado y sin dependencias innecesarias | Código sólido con mejoras menores | Duplicación, nombres débiles o problemas evitables | Código frágil, mutado o construcción fallida | 15 |
| Verificación y pruebas | Evidencia completa, casos límite, regresiones, lint, build y producción | Pruebas principales completas | Evidencia parcial | Afirma resultados sin pruebas | 15 |
| Criterio en el uso de IA | Decisiones justificadas, limitaciones detectadas y al menos un rechazo o modificación | Uso razonado y verificado | Bitácora superficial | Dependencia total o sin bitácora | 10 |
| Diseño y accesibilidad | Experiencia clara, adaptable, accesible y coherente | Buen resultado con detalles menores | Problemas de teclado, foco o móvil | Interfaz inaccesible o rota | 5 |
| Git y documentación | Historial claro, bitácora útil, vista previa y producción verificadas | Entrega completa con detalles menores | Historial o documentos incompletos | Sin trazabilidad o publicación | 5 |
| **Total** |  |  |  |  | **100** |

### Requisitos críticos

El proyecto debe corregirse antes de aprobarse si:

- `npm run build` falla;
- el comparador no permite comparar al menos dos cursos;
- búsqueda, filtros, favoritos o rutas dejaron de funcionar;
- se muta directamente el estado;
- se agregaron dependencias innecesarias;
- se publicaron credenciales o datos sensibles;
- el estudiante no puede explicar el código generado;
- no existe evidencia de pruebas;
- la bitácora presenta resultados inventados;
- no existe al menos una propuesta modificada o rechazada;
- todo el portal fue reemplazado por una salida generada;
- los controles no pueden utilizarse con teclado;
- el diseño falla a 320 píxeles;
- no existen repositorio y publicación verificables;
- el proyecto utiliza una API de IA, autenticación o base de datos fuera del alcance.

El proyecto debe ser aprobado antes de continuar al Módulo 6. Si recibe observaciones, realiza las correcciones y entrega una nueva versión.

---

# 10. Evaluación del módulo

## Pregunta 1

¿Quién es responsable del código incorporado al proyecto?

A. La herramienta que lo generó.  
B. El desarrollador que lo revisa y acepta.  
C. El modelo con más parámetros.  
D. La plataforma de despliegue.

## Pregunta 2

¿Cuál solicitud tiene mejor alcance?

A. “Mejora todo.”  
B. “Hazlo profesional.”  
C. “Corrige solamente `toggleCourse`, sin cambiar estilos ni dependencias, y agrega tres casos de prueba.”  
D. “Usa toda la IA posible.”

## Pregunta 3

¿Qué información no debe enviarse a una herramienta?

A. Un error sin datos privados.  
B. Un arreglo ficticio de cursos.  
C. Una clave real guardada en `.env`.  
D. Las versiones de Next.js y React.

## Pregunta 4

¿Cuál es el mejor primer paso ante un error?

A. Reemplazar el archivo.  
B. Instalar una biblioteca.  
C. Reproducirlo y reunir evidencia.  
D. Desactivar ESLint.

## Pregunta 5

¿Qué debe almacenarse para seleccionar cursos?

A. Dos estados con la misma información.  
B. Identificadores estables y cursos derivados.  
C. Índices de posición como identidad permanente.  
D. Elementos del DOM.

## Pregunta 6

¿Qué significa refactorizar?

A. Agregar nuevas funciones.  
B. Cambiar el comportamiento para hacerlo más moderno.  
C. Mejorar la estructura conservando el comportamiento observable.  
D. Reescribir todo con otra biblioteca.

## Pregunta 7

Una IA afirma que la construcción finalizó. ¿Qué debes hacer?

A. Confiar si la explicación es extensa.  
B. Ejecutar la construcción en el proyecto.  
C. Copiar la afirmación al README.  
D. Publicar inmediatamente.

## Pregunta 8

¿Cuál es una señal de alcance descontrolado?

A. Cambiar una función y proponer su prueba.  
B. Explicar un supuesto.  
C. Instalar estado global y renombrar archivos para corregir un límite.  
D. Solicitar el mensaje de error exacto.

## Pregunta 9

¿Por qué debe existir una propuesta modificada o rechazada en la bitácora?

A. Para demostrar que la IA siempre se equivoca.  
B. Para demostrar que el estudiante evalúa y decide.  
C. Para aumentar la cantidad de texto.  
D. Para evitar ejecutar pruebas.

## Pregunta 10

¿Cuál flujo representa un uso profesional?

A. Pedir, copiar y publicar.  
B. Pedir varias respuestas y elegir la más larga.  
C. Comprender, especificar, solicitar, inspeccionar, verificar, decidir y registrar.  
D. Generar toda la aplicación en una conversación.

## Actividad de explicación

Explica sin leer:

1. por qué una respuesta plausible no equivale a una solución verificada;
2. qué información debe contener un buen contexto;
3. cómo dividirías una función grande en cambios pequeños;
4. cómo diagnosticarías un error con hipótesis;
5. cómo protegerías una refactorización;
6. qué diferencia existe entre aceptar, modificar y rechazar;
7. qué evidencia incluirías en una bitácora;
8. cuándo decidirías no utilizar IA.

La evaluación se aprueba con al menos un 70 % y una explicación clara de los ocho puntos.

---

# Videos recomendados

Los videos complementan la práctica. Las interfaces, nombres de modelos y funciones de las herramientas pueden cambiar. Conserva el método del módulo aunque un botón aparezca en otra ubicación.

| Tema | Video | Canal | Duración aproximada | Motivo |
|---|---|---|---:|---|
| Criterio para programar con IA | [Te explico cómo realmente debes usar la IA para programar](https://www.youtube.com/watch?v=BdWfEZ2aTAw) | aDevSays | 13 min | Defiende el uso de fundamentos y criterio frente a la dependencia del código generado. |
| Instrucciones para programadores | [Guía de ingeniería de prompts para programadores](https://www.youtube.com/watch?v=C-GZ-owYxEA) | Victor Robles WEB | 17 min | Presenta una guía breve orientada específicamente a tareas de programación. |
| Fundamentos de instrucciones | [Aprende Prompt Engineering ahora: curso desde cero](https://www.youtube.com/watch?v=x-iTco25VGI) | HolaMundo | 1 h 49 min | Recurso amplio para consultar técnicas de contexto, delimitadores, ejemplos y salidas estructuradas. Mira solamente los capítulos relacionados con este módulo. |
| GitHub Copilot en el editor | [¿Merece la pena GitHub Copilot en VS Code?](https://www.youtube.com/watch?v=XpQ7uUXuPHg) | MoureDev by Brais Moure | 20 min | Recorre instalación, sugerencias, chat, instrucciones, utilidades y buenas prácticas. |
| Claude Code, extensión opcional | [Te explico cómo realmente usar Claude Code](https://www.youtube.com/watch?v=k8kPLA0FEQE) | aDevSays | 12 min | Muestra un flujo con contexto de proyecto. Es una ampliación opcional; no es requisito instalar una herramienta de terminal. |

## Reproductores de video

[Te explico cómo realmente debes usar la IA para programar](https://www.youtube.com/watch?v=BdWfEZ2aTAw)

[Guía de ingeniería de prompts para programadores](https://www.youtube.com/watch?v=C-GZ-owYxEA)

[Aprende Prompt Engineering ahora: curso desde cero](https://www.youtube.com/watch?v=x-iTco25VGI)

[¿Merece la pena GitHub Copilot en VS Code?](https://www.youtube.com/watch?v=XpQ7uUXuPHg)

[Te explico cómo realmente usar Claude Code](https://www.youtube.com/watch?v=k8kPLA0FEQE)

## Orden recomendado

1. Mira el video sobre criterio antes del Ejercicio 1.
2. Revisa la guía de instrucciones antes de los Ejercicios 3 y 4.
3. Consulta los capítulos necesarios del curso amplio cuando necesites delimitadores o formatos.
4. Mira GitHub Copilot antes del Ejercicio 9 si utilizarás la herramienta.
5. Deja Claude Code como extensión después de completar el flujo principal con ChatGPT o Claude.

> Un video muestra la forma de trabajar de su autor, no una regla universal. Verifica siempre las sugerencias en el proyecto y en la documentación oficial.

---

# Documentación y lecturas

## Nivel esencial: instrucciones y uso responsable

- [Buenas prácticas de ingeniería de prompts para ChatGPT](https://help.openai.com/en/articles/10032626-pompt-engenneering-best-practices-for-chatgpt)
- [Cómo crear una buena instrucción para ChatGPT](https://help.openai.com/en/articles/4936848)
- [Buenas prácticas de prompting](https://help.openai.com/en/articles/6654000-best-practices-for-prompting-chatgpt)
- [Ingeniería de prompts para GitHub Copilot](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [Buenas prácticas para utilizar GitHub Copilot](https://docs.github.com/en/copilot/get-started/best-practices)

## Nivel de aplicación: contexto y flujo

- [Proyectos en ChatGPT](https://openai.com/academy/projects/)
- [Canvas de ChatGPT](https://help.openai.com/en/articles/9930697-what-is-canvas)
- [Crear y administrar proyectos en Claude](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
- [Casos comunes de desarrollo con Claude Code](https://support.claude.com/en/articles/14553517-claude-code-common-developer-use-cases)

Las funciones de proyectos, archivos, Canvas y herramientas de terminal pueden variar según cuenta, plan o plataforma. Son opciones para administrar contexto, no requisitos del módulo.

## Nivel profesional: revisión e instrucciones de repositorio

- [Revisión de código con GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/code-review)
- [Personalizar revisiones mediante instrucciones](https://docs.github.com/en/copilot/tutorials/customize-code-review)
- [Configurar instrucciones de repositorio para GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)

La documentación de GitHub advierte que una revisión generada puede omitir problemas o producir observaciones incorrectas. Trátala como una segunda opinión y valida cada hallazgo.

## Documentación técnica para verificar respuestas

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de GitHub](https://docs.github.com/)

## Cómo utilizar la documentación

Cuando la IA proponga una API o una práctica:

1. identifica el nombre exacto;
2. abre la documentación oficial;
3. confirma que pertenece a la tecnología y versión del proyecto;
4. distingue App Router de Pages Router;
5. reproduce un ejemplo mínimo;
6. adapta solamente lo necesario;
7. ejecuta ESLint y construcción;
8. registra la decisión si fue importante.

La documentación oficial tampoco sustituye las pruebas del comportamiento específico de tu aplicación.

---

# Glosario

**Aceptación:** decisión de incorporar una propuesta después de comprenderla y verificarla.

**Alcance:** límites de una tarea, incluidos archivos, comportamientos y restricciones.

**Alucinación:** salida plausible que contiene datos, APIs, resultados o afirmaciones incorrectas.

**Asistencia:** apoyo que ofrece una herramienta sin transferirle la responsabilidad final.

**Bitácora de IA:** registro de objetivos, contexto, propuestas, decisiones y verificaciones.

**Caso de regresión:** prueba que confirma que una función anterior continúa operando.

**Causa:** origen confirmado de un problema.

**Contexto:** información relevante que permite interpretar una tarea.

**Contrato de comportamiento:** lista de resultados que deben conservarse durante un cambio.

**Criterio de aceptación:** condición observable utilizada para decidir si un requisito se cumplió.

**Delimitador:** marca que separa instrucciones, código, datos u otras secciones de una solicitud.

**Dependencia:** paquete externo que el proyecto necesita para funcionar.

**Diagnóstico:** proceso de identificar la causa mediante evidencias e hipótesis.

**Diff:** representación de líneas agregadas, modificadas y eliminadas.

**Evidencia:** resultado observable que apoya o contradice una afirmación.

**Experimento:** comprobación limitada diseñada para distinguir hipótesis.

**GitHub Copilot:** herramienta de asistencia para desarrollo integrada con GitHub y editores compatibles.

**Hallazgo:** problema o mejora respaldada por evidencia durante una revisión.

**Hipótesis:** explicación posible que todavía debe comprobarse.

**Implementación acotada:** cambio con responsabilidad, archivos y criterios definidos.

**Instrucción de repositorio:** regla persistente que orienta sugerencias dentro de un proyecto compatible.

**IA generativa:** sistema capaz de producir texto, código u otros contenidos a partir de instrucciones y contexto.

**Línea base:** estado conocido y verificado antes de comenzar un cambio.

**Minimización:** práctica de compartir solamente la información necesaria.

**Modificación:** decisión de conservar parte de una propuesta y corregir otra.

**Optimización:** mejora de una medida concreta y comprobable.

**Prompt:** instrucción o mensaje enviado a una herramienta generativa.

**Refactorización:** cambio de estructura que conserva el comportamiento observable.

**Regresión:** fallo introducido en una función que antes operaba.

**Reproducción mínima:** ejemplo reducido que mantiene el problema.

**Revisión de código:** inspección orientada a encontrar defectos, riesgos y mejoras.

**Salida estructurada:** respuesta organizada en un formato solicitado, como tabla o lista.

**Síntoma:** manifestación observable de un problema.

**Supuesto:** condición aceptada provisionalmente cuando no existe información completa.

**Valor derivado:** información calculada a partir de datos o estado existentes.

**Verificación:** proceso de comprobar una afirmación mediante lectura, documentación, herramientas y pruebas.

---

# Resumen final

En este módulo aprendiste que utilizar IA profesionalmente no significa pedir más código. Significa controlar mejor el proceso.

```text
Persona
├── define el objetivo
├── establece restricciones
├── protege la información
├── decide el alcance
├── revisa el cambio
├── ejecuta pruebas
└── acepta la responsabilidad

IA
├── explica
├── pregunta
├── propone
├── genera borradores
├── sugiere hipótesis
└── ofrece una segunda revisión
```

Aplicaste el ciclo:

```text
Comprender
   ↓
Especificar
   ↓
Solicitar
   ↓
Inspeccionar
   ↓
Verificar
   ↓
Decidir
   ↓
Registrar
```

Ahora puedes:

- elegir el nivel de asistencia;
- preparar contexto útil y seguro;
- crear criterios de aceptación;
- redactar instrucciones acotadas;
- dividir una función en pasos;
- pedir cambios mínimos;
- comprender código generado;
- revisar diffs;
- diagnosticar con hipótesis;
- comprobar causas;
- refactorizar con un contrato;
- revisar hallazgos con evidencia;
- rechazar optimizaciones innecesarias;
- documentar decisiones;
- utilizar GitHub Copilot cuando esté disponible;
- mantener trazabilidad con Git;
- verificar vistas previas y producción;
- defender técnicamente el resultado.

El producto más importante del módulo no es el comparador. Es el método que permite construir funciones futuras sin quedar atrapado entre dos extremos:

```text
Ignorar la IA  ◄──────── criterio profesional ────────►  Depender de la IA
```

La posición profesional utiliza conocimiento propio y asistencia automatizada de forma deliberada.

---

# Cierre y requisito de avance

Antes de continuar:

- completa los ejercicios;
- entrega el mini proyecto;
- alcanza al menos un 70 % en la evaluación;
- implementa y publica el comparador;
- conserva las funciones del portal;
- entrega pruebas y regresiones;
- documenta cinco interacciones importantes;
- demuestra al menos una propuesta modificada o rechazada;
- corrige dos hallazgos reales;
- aplica las observaciones del instructor;
- obtiene la aprobación del proyecto.

El Módulo 6 se habilita únicamente después de aprobar este proyecto.
