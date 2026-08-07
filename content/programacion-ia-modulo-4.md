# Módulo 4. Depuración, diagnóstico y validación de respuestas

**Curso:** Programación Asistida por Inteligencia Artificial  
**Duración estimada:** 2 horas y 30 minutos  
**Modalidad:** Autodidacta  
**Nivel:** Intermedio  
**Mini proyecto:** Laboratorio de diagnóstico  
**Proyecto del módulo:** Rescate de una aplicación defectuosa  
**Lenguaje:** El lenguaje de programación que ya conoces

---

# Introducción

Encontrar un error no consiste en pegar un mensaje en un chat y aceptar la primera respuesta. Una corrección profesional nace de la evidencia.

La Inteligencia Artificial puede explicar un `traceback`, proponer hipótesis, comparar soluciones y sugerir pruebas. También puede confundir el síntoma con la causa, inventar una función, asumir una versión incorrecta o producir un parche que oculta el fallo sin resolverlo.

En este módulo aprenderás a utilizar la IA dentro de un proceso de depuración controlado:

```text
Reproducir
    ↓
Leer la evidencia
    ↓
Reducir el problema
    ↓
Formular hipótesis
    ↓
Consultar a la IA
    ↓
Contrastar la respuesta
    ↓
Aplicar un cambio pequeño
    ↓
Probar y evitar regresiones
```

El objetivo no es conseguir una respuesta rápida. El objetivo es poder demostrar qué fallaba, por qué fallaba y por qué la corrección funciona.

---

# Objetivos de aprendizaje

Al finalizar este módulo podrás:

- diferenciar un síntoma de una causa raíz;
- reproducir un fallo de forma consistente;
- construir un ejemplo mínimo reproducible;
- leer mensajes de error, `tracebacks`, trazas de pila y registros;
- extraer archivo, línea, tipo de error, datos relevantes y llamadas anteriores;
- eliminar secretos y datos personales antes de compartir evidencia;
- redactar prompts de diagnóstico con contexto suficiente;
- declarar el resultado esperado y el resultado real;
- relacionar un fallo con cambios recientes;
- formular y comprobar hipótesis una por una;
- pedir diagnóstico antes de pedir una corrección;
- distinguir una solución de un parche que solamente oculta el problema;
- verificar funciones, parámetros, paquetes y versiones en documentación oficial;
- detectar respuestas inventadas o incompatibles;
- evitar bloques de excepciones que silencian errores;
- comparar varias correcciones mediante criterios técnicos;
- crear una prueba de regresión;
- documentar causa, solución y verificación;
- reconocer cuándo debes abandonar el chat y utilizar el depurador, las pruebas o la documentación.

---

# Conocimientos previos

Antes de comenzar debes poder:

- ejecutar un programa pequeño en el lenguaje que ya conoces;
- leer funciones, condiciones y estructuras de datos;
- modificar código y volver a ejecutarlo;
- diseñar casos normales, límite e inválidos;
- utilizar un asistente conversacional;
- guardar versiones recuperables de un proyecto;
- revisar un cambio antes de aceptarlo.

No necesitas experiencia avanzada en depuración.

---

# Preparación

Necesitas:

- un editor o IDE;
- un lenguaje que puedas ejecutar;
- un asistente conversacional, como ChatGPT, Claude, Gemini o Copilot;
- la documentación oficial de tu lenguaje;
- una carpeta llamada `coa_ia_modulo_4`;
- el paquete de materiales del módulo;
- Git o un método claro para conservar versiones.

El proyecto defectuoso se proporciona en Python, JavaScript, Java, C# y C++. Elige únicamente la versión correspondiente al lenguaje que conoces.

---

# Distribución recomendada del tiempo

| Actividad | Tiempo |
|---|---:|
| Contenido esencial y prácticas guiadas | 45 minutos |
| Ejercicios individuales | 20 minutos |
| Mini proyecto | 25 minutos |
| Proyecto del módulo | 40 minutos |
| Evaluación, revisión y entrega | 20 minutos |
| **Total estimado** | **2 horas y 30 minutos** |

Los videos y las lecturas complementarias son opcionales y no están incluidos en este tiempo.

---

# 1. Depurar no es adivinar

Depurar es investigar una diferencia entre lo que un programa debía hacer y lo que realmente hizo.

```text
Comportamiento esperado ≠ comportamiento real
                         ↓
                    existe un fallo
```

Una investigación válida necesita hechos observables:

- una entrada concreta;
- pasos de reproducción;
- una salida esperada;
- una salida real;
- un entorno conocido;
- evidencia obtenida al ejecutar.

La frase “el programa no funciona” no permite diagnosticar. La siguiente descripción sí:

```text
Al registrar una reserva para 2 personas a las 17:00 durante 1 hora,
el sistema responde "horario inválido".

Resultado esperado: reserva válida, hora final 18:00.
Resultado real: reserva rechazada.
Versión: aplicación 1.0, JavaScript 22.
Frecuencia: ocurre en 3 de 3 ejecuciones.
```

## Regla profesional

No modifiques el código hasta poder mostrar el fallo de forma repetible.

---

# 2. Síntoma, defecto y causa raíz

Estos conceptos no significan lo mismo.

| Concepto | Pregunta | Ejemplo |
|---|---|---|
| Síntoma | ¿Qué observaste? | Una reserva válida fue rechazada. |
| Defecto | ¿Qué parte del código es incorrecta? | La condición utiliza `>= 18`. |
| Causa raíz | ¿Por qué se introdujo o sobrevivió el defecto? | Se interpretó mal el límite y no existía una prueba para la hora exacta. |

Cambiar `>=` por `>` corrige el defecto. Agregar una prueba para el límite evita que el mismo error reaparezca. Documentar que las 18:00 sí son válidas reduce la posibilidad de repetir la interpretación incorrecta.

Una buena corrección atiende los tres niveles:

```text
Síntoma resuelto
+ defecto corregido
+ causa comprendida
+ regresión protegida
```

---

# 3. Reproducir antes de corregir

Una reproducción completa responde seis preguntas:

1. ¿Qué versión del programa utilizaste?
2. ¿Qué pasos ejecutaste?
3. ¿Qué datos ingresaste?
4. ¿Qué esperabas obtener?
5. ¿Qué obtuviste realmente?
6. ¿Ocurre siempre o solamente bajo ciertas condiciones?

## Plantilla breve

```text
Identificador del incidente:
Entorno y versión:
Estado inicial:
Pasos exactos:
Entrada utilizada:
Resultado esperado:
Resultado real:
Frecuencia:
Evidencia adjunta:
```

## Fallos intermitentes

Si el error no ocurre siempre, registra también:

- hora aproximada;
- orden de acciones;
- cantidad de datos;
- conexión disponible;
- estado previo;
- semilla aleatoria, si existe;
- diferencias entre la ejecución correcta y la incorrecta.

No inventes una causa para explicar una reproducción incompleta. Registra lo que sabes y lo que todavía desconoces.

---

# 4. Construir un ejemplo mínimo reproducible

Un ejemplo mínimo reproducible conserva el fallo y elimina todo lo que no participa en él.

Supón que una aplicación de 25 archivos calcula mal un descuento. Antes de enviar el proyecto completo a una IA:

1. identifica la función que calcula el descuento;
2. reemplaza archivos, red o base de datos por valores pequeños;
3. conserva la entrada que demuestra el error;
4. elimina interfaz, estilos y componentes no relacionados;
5. vuelve a ejecutar;
6. confirma que el fallo sigue presente.

```text
Proyecto completo
      ↓ eliminar ruido
Módulo relacionado
      ↓ aislar dependencias
Función + entrada + resultado
      ↓ confirmar
Ejemplo mínimo reproducible
```

## Mínimo no significa incompleto

El ejemplo todavía debe incluir:

- imports necesarios;
- datos de entrada;
- código que falla;
- instrucción para ejecutarlo;
- resultado esperado;
- error o resultado real.

Si al reducir desaparece el fallo, alguna parte eliminada era relevante. Agrégala nuevamente de forma controlada.

---

# 5. Leer mensajes de error

Antes de preguntar a una IA, lee el error completo.

Busca:

```text
Tipo de error
Mensaje
Archivo
Línea
Función o método
Cadena de llamadas
Dato involucrado
Causa anterior, si existe
```

## Ejemplo de `traceback`

```text
Traceback (most recent call last):
  File "app.py", line 18, in <module>
    mostrar_reserva(datos)
  File "app.py", line 11, in mostrar_reserva
    total = datos["total"] + " USD"
TypeError: unsupported operand type(s) for +: 'float' and 'str'
```

Lectura:

| Evidencia | Valor |
|---|---|
| Tipo | `TypeError` |
| Mensaje | Se intentaron combinar tipos incompatibles. |
| Archivo | `app.py` |
| Línea donde se manifestó | 11 |
| Llamada anterior | `mostrar_reserva(datos)` en la línea 18 |
| Dato relevante | `datos["total"]` es numérico y `" USD"` es texto. |

La línea señalada indica dónde se manifestó el error, pero no garantiza que allí se originó. El dato incorrecto pudo haberse construido varias llamadas antes.

---

# 6. `Tracebacks`, trazas de pila y registros

Los lenguajes muestran errores con formatos diferentes, pero la investigación es similar.

## Traza de pila

Una traza de pila muestra el camino de llamadas que condujo al fallo.

```text
programa principal
    └── procesar_pedido
          └── calcular_total
                └── convertir_importe  ← error visible
```

Empieza por el mensaje y localiza después los marcos que pertenecen a tu proyecto. Las primeras líneas de una traza no siempre son las más importantes y las últimas no siempre contienen la causa completa. Sigue los datos.

## Registros o logs

Un registro útil describe un evento con contexto suficiente:

```text
2026-08-05T14:32:10Z ERROR pedido=PED-104
operacion=calcular_total cantidad=-1 tipo=normal
mensaje="cantidad fuera de rango"
```

Un registro inútil dice solamente:

```text
Algo salió mal
```

Los logs deben ayudar a investigar sin revelar contraseñas, tokens, documentos de identidad, números de tarjeta ni información privada.

---

# 7. Sanitizar evidencia antes de compartirla

Un error puede contener información sensible. Revisa cada fragmento antes de copiarlo a una herramienta externa.

## Debes reemplazar

```text
API_KEY=sk-real-123      → API_KEY=[ELIMINADA]
correo=ana@empresa.com   → correo=usuario@ejemplo.com
cliente=Ana Pérez        → cliente=CLIENTE_DE_PRUEBA
C:\Users\Ana\Proyecto    → C:\ruta\proyecto
```

## No elimines evidencia técnica necesaria

Conserva:

- tipo de error;
- nombres ficticios pero consistentes;
- estructura del dato;
- archivo y línea relevantes;
- valores límite que reproducen el problema;
- versión de la dependencia.

Sanitizar no es borrar todo. Es sustituir información privada sin destruir el valor diagnóstico.

## Lista de seguridad

- [ ] No hay claves, contraseñas ni tokens.
- [ ] No hay datos personales reales.
- [ ] No hay archivos de configuración privados completos.
- [ ] No hay código confidencial fuera del alcance autorizado.
- [ ] El error continúa siendo comprensible.

---

# 8. Resultado esperado y resultado real

La IA no puede identificar una salida incorrecta si no conoce la salida correcta.

Prompt débil:

```text
¿Por qué esto da 94.5?
```

Prompt útil:

```text
Una reserva premium cuesta 35 por hora. Para una duración exacta de
3 horas debe aplicarse 10 % de descuento.

Entrada: tipo=premium, duración=3.
Esperado: subtotal=105, descuento=10.5, total=94.5.
Real: subtotal=105, descuento=0, total=105.

Analiza la condición del descuento. Primero explica la causa probable;
no propongas todavía código.
```

Expresar ambos resultados transforma una queja vaga en un problema comprobable.

---

# 9. Registrar cambios recientes

Muchos fallos aparecen después de un cambio. Revisa:

- archivos modificados;
- dependencias actualizadas;
- versión del lenguaje;
- nombres de variables o propiedades;
- cambios de configuración;
- nuevas validaciones;
- modificaciones en el orden de las operaciones.

Una diferencia de código o `diff` reduce la búsqueda:

```diff
- if hora_fin > 18:
+ if hora_fin >= 18:
    rechazar_reserva()
```

No concluyas automáticamente que el último cambio es culpable. Úsalo como evidencia para formular una hipótesis.

---

# 10. Formular hipótesis comprobables

Una hipótesis útil produce una predicción.

```text
Hipótesis:
La comparación rechaza incorrectamente el límite exacto de las 18:00.

Evidencia:
17:00 + 1 hora falla; 16:00 + 1 hora funciona.

Predicción:
Si la condición cambia de >= 18 a > 18, el caso que termina exactamente
a las 18:00 será válido y el que termina a las 19:00 seguirá siendo inválido.

Prueba:
Ejecutar ambos casos antes y después del cambio.

Resultado:
Registrar si confirma o refuta la hipótesis.
```

## Una variable a la vez

Evita cambiar simultáneamente la condición, el tipo de dato, la estructura y el manejo de errores. Si todo cambia a la vez, no sabrás qué resolvió el fallo.

```text
Hipótesis A → prueba → confirmar o descartar
Hipótesis B → prueba → confirmar o descartar
Hipótesis C → prueba → confirmar o descartar
```

La IA puede ayudarte a enumerar hipótesis. Tú decides el orden y ejecutas las pruebas.

---

# 11. El prompt de diagnóstico

Un prompt de depuración debe entregar evidencia y limitar la respuesta.

## Plantilla COA-DIAGNÓSTICO

```text
Actúa como asistente de diagnóstico. No reescribas el programa completo.

Contexto:
- lenguaje y versión:
- entorno:
- objetivo de la función:

Comportamiento esperado:

Comportamiento real:

Pasos mínimos para reproducir:

Código mínimo relacionado:

Mensaje o traza completa sanitizada:

Cambios recientes:

Pruebas que ya ejecuté:

Responde en este orden:
1. evidencia observable;
2. hasta tres hipótesis ordenadas;
3. prueba mínima para confirmar o descartar cada hipótesis;
4. causa más probable y nivel de confianza;
5. información que falta.

Todavía no escribas la corrección.
No inventes funciones ni dependencias.
```

## Segunda conversación: solicitar la corrección

Después de confirmar la causa:

```text
La prueba confirmó la hipótesis 1: [causa].

Propón el cambio mínimo que la corrige.
Conserva la interfaz pública.
No agregues dependencias.
Incluye:
- diff propuesto;
- explicación de cada línea modificada;
- prueba que falla antes y pasa después;
- posibles efectos secundarios.
```

Separar diagnóstico y corrección reduce propuestas apresuradas.

---

# 12. Corrección, parche y solución temporal

| Tipo | Qué hace | Riesgo |
|---|---|---|
| Corrección | Elimina el defecto que causa el fallo. | Requiere comprender la causa. |
| Parche superficial | Cambia el síntoma sin resolver el origen. | El fallo reaparece de otra forma. |
| Solución temporal | Reduce el impacto mientras se prepara una corrección. | Puede convertirse por accidente en permanente. |

Ejemplo de parche peligroso:

```text
try:
    ejecutar_operacion()
catch cualquier_error:
    devolver null
```

El programa deja de mostrar el error, pero no funciona correctamente. Además, se pierde la evidencia.

Una solución temporal solamente es aceptable si queda documentada con:

- razón;
- alcance;
- riesgo;
- fecha o condición para retirarla;
- caso pendiente de corrección.

---

# 13. Excepciones: controlar no significa ocultar

Captura una excepción cuando puedas realizar una acción específica y segura.

Ejemplo conceptual:

```text
intentar leer archivo
si el archivo no existe:
    informar qué archivo falta
si el contenido es inválido:
    informar que el formato no se puede interpretar
```

Evita:

```text
capturar cualquier error:
    continuar como si nada
```

Un bloque general puede esconder:

- errores de programación;
- datos corruptos;
- fallos de configuración;
- dependencias incompatibles;
- problemas de permisos.

Si debes capturar un error general en una frontera de la aplicación, registra la evidencia necesaria, devuelve un resultado seguro y conserva una forma de investigar la causa. Nunca muestres secretos en el mensaje.

---

# 14. Validar respuestas de la IA

Una respuesta convincente no es evidencia de que sea correcta.

Verifica cada propuesta en cuatro capas:

| Capa | Pregunta | Evidencia |
|---|---|---|
| Existencia | ¿La función, clase o parámetro existe? | Documentación oficial. |
| Compatibilidad | ¿Existe en mi versión y entorno? | Documentación de versión y ejecución local. |
| Adecuación | ¿Resuelve la causa sin romper requisitos? | Casos de aceptación. |
| Regresión | ¿Conserva lo que ya funcionaba? | Suite de pruebas. |

## Alucinaciones técnicas frecuentes

- función inexistente;
- parámetro inventado;
- nombre incorrecto de paquete;
- ruta de importación falsa;
- comportamiento atribuido a otra versión;
- método válido en otro lenguaje;
- explicación que contradice el código;
- API real utilizada con una firma incorrecta.

## Protocolo de verificación

```text
1. Copia el nombre exacto sugerido.
2. Busca el símbolo en documentación oficial.
3. Confirma versión, firma, retorno y excepciones.
4. Crea una prueba mínima.
5. Ejecuta en tu entorno.
6. Acepta, adapta o rechaza con evidencia.
```

La ausencia de resultados en una búsqueda no demuestra por sí sola que algo no exista. Revisa la ortografía, la versión y la fuente correcta.

---

# 15. Comparar correcciones

Cuando recibas dos alternativas, no elijas la más larga ni la que parece más sofisticada.

Utiliza criterios:

| Criterio | Pregunta |
|---|---|
| Causa | ¿Corrige el origen confirmado? |
| Alcance | ¿Modifica solamente lo necesario? |
| Contrato | ¿Conserva entradas, salidas y errores acordados? |
| Claridad | ¿Puedes explicar el cambio? |
| Compatibilidad | ¿Funciona en la versión utilizada? |
| Seguridad | ¿Evita filtrar datos o silenciar fallos? |
| Pruebas | ¿Incluye un caso que demuestra la corrección? |
| Reversibilidad | ¿Puede revertirse fácilmente? |

## Matriz de decisión

Asigna `0` si no cumple, `1` si cumple parcialmente y `2` si cumple por completo. Justifica los criterios críticos; no uses la suma como sustituto del juicio técnico.

---

# 16. Pruebas de regresión

Una prueba de regresión reproduce el defecto anterior y comprueba que ya no ocurre.

```text
Antes de corregir:
caso límite → falla

Después de corregir:
mismo caso límite → pasa
casos anteriores → continúan pasando
```

Una corrección mínima debe acompañarse de:

1. una prueba que fallaba antes;
2. una prueba que demuestra el resultado corregido;
3. pruebas cercanas al límite;
4. pruebas existentes para detectar efectos secundarios.

Ejemplo:

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Antes del límite | inicio 16, duración 1 | Válido; termina 17. |
| Límite exacto | inicio 17, duración 1 | Válido; termina 18. |
| Fuera del límite | inicio 17, duración 2 | Inválido; termina 19. |

Probar únicamente el caso corregido puede desplazar el error a un valor vecino.

---

# 17. Documentar la causa raíz

Un informe corto debe permitir que otra persona comprenda el incidente sin repetir toda la investigación.

```text
Incidente:
Impacto:
Forma de reproducción:
Evidencia principal:
Causa raíz:
Corrección aplicada:
Alternativas rechazadas:
Prueba de regresión:
Verificación completa:
Riesgos pendientes:
```

Evita frases como “la IA lo arregló”. Registra la decisión técnica:

```text
Se cambió la comparación de >= a > porque la regla permite terminar
exactamente a las 18:00. El caso RD-02 fallaba antes y pasa después.
RD-03 confirma que terminar a las 19:00 continúa siendo inválido.
```

---

# 18. Cuándo dejar el chat y utilizar otra herramienta

La conversación deja de ser el mejor instrumento cuando necesitas observar el programa en ejecución o confirmar un dato externo.

| Necesidad | Herramienta adecuada |
|---|---|
| Ver el valor de una variable en una línea | Depurador. |
| Avanzar paso a paso | Depurador. |
| Confirmar una función o parámetro | Documentación oficial. |
| Detectar en qué cambio apareció un fallo | Historial Git y comparación de versiones. |
| Repetir casos automáticamente | Pruebas. |
| Medir rendimiento | Perfilador o medición controlada. |
| Observar eventos de una ejecución | Logs sanitizados. |
| Explicar evidencia y proponer hipótesis | IA. |

La IA ayuda a interpretar. El depurador, la documentación y las pruebas producen evidencia que la conversación no puede inventar legítimamente.

---

# 19. Flujo profesional completo

## Fase 1. Contener

- conserva una copia del estado defectuoso;
- evita cambios masivos;
- protege datos y credenciales;
- registra impacto y alcance.

## Fase 2. Reproducir

- define entrada, pasos, esperado y real;
- confirma frecuencia;
- crea un caso pequeño.

## Fase 3. Investigar

- lee error, traza y logs;
- revisa cambios recientes;
- formula hipótesis;
- usa depurador o instrumentación cuando sea necesario.

## Fase 4. Consultar

- comparte contexto sanitizado;
- pide evidencia e hipótesis;
- impide reescrituras prematuras;
- identifica información faltante.

## Fase 5. Corregir

- confirma una hipótesis;
- aplica un cambio pequeño;
- revisa el diff;
- rechaza funciones o dependencias no verificadas.

## Fase 6. Verificar

- ejecuta la reproducción original;
- agrega regresión;
- ejecuta casos vecinos y pruebas anteriores;
- confirma requisitos y seguridad.

## Fase 7. Documentar

- registra causa raíz;
- explica la decisión;
- conserva evidencia;
- anota riesgos pendientes.

---

# Práctica guiada 1. Leer antes de preguntar

Analiza esta evidencia:

```text
Error: Cannot read properties of undefined (reading 'precio')
    at calcularTotal (pedido.js:14:31)
    at confirmarPedido (pedido.js:28:19)
    at main (app.js:7:5)
```

Código relacionado:

```javascript
function calcularTotal(pedido) {
  return pedido.producto.precio * pedido.cantidad;
}
```

Entrada utilizada:

```text
{ cantidad: 2 }
```

## Paso 1. Extrae hechos

- El error se manifiesta al leer `precio`.
- `calcularTotal` fue llamada por `confirmarPedido`.
- La entrada no contiene `producto`.
- Todavía no sabemos si la causa es una validación ausente o un objeto construido incorrectamente antes.

## Paso 2. Formula hipótesis

```text
H1: confirmarPedido permite objetos incompletos.
H2: una transformación anterior elimina producto.
H3: el contrato de calcularTotal no está definido o no se cumple.
```

## Paso 3. Diseña pruebas

- llamar a `calcularTotal` con un pedido completo;
- llamar con `producto` ausente;
- inspeccionar el objeto justo antes de `confirmarPedido`;
- localizar dónde se construye el pedido.

## Paso 4. Pregunta a la IA

Solicita un diagnóstico, no una reescritura. Pide que diferencie hechos e inferencias.

## Paso 5. Decide

La corrección dependerá del contrato:

- si `producto` es obligatorio, valida en la frontera y evita crear pedidos incompletos;
- si puede faltar, define un resultado controlado;
- no agregues `?.` y un valor cero sin confirmar que ese comportamiento sea correcto.

---

# Práctica guiada 2. Comparar dos propuestas

Regla: un arreglo de `n` elementos posee índices válidos desde `0` hasta `n - 1`.

Código defectuoso conceptual:

```text
para indice desde 0 mientras indice <= longitud(elementos):
    procesar elementos[indice]
```

## Propuesta A

```text
intentar procesar elementos[indice]
si ocurre cualquier error:
    terminar el ciclo
```

## Propuesta B

```text
para indice desde 0 mientras indice < longitud(elementos):
    procesar elementos[indice]
```

La propuesta B corrige la condición que permite acceder a un índice inexistente. La propuesta A utiliza una excepción como control de flujo, puede ocultar fallos distintos y no explica la causa.

Pruebas mínimas:

- colección vacía;
- colección con un elemento;
- colección con varios elementos;
- error real dentro de `procesar`, para comprobar que no se silencie.

---

# Errores comunes

## 1. Pegar solamente la última línea

La traza anterior puede contener el recorrido y la causa encadenada.

## 2. Pedir “arréglalo”

La IA puede reescribir demasiado y destruir evidencia.

## 3. Cambiar varias cosas a la vez

Impide saber qué hipótesis era correcta.

## 4. Confundir ausencia de error con funcionamiento correcto

Un `catch` general puede esconder un resultado incorrecto.

## 5. Confiar en una función porque su nombre parece real

Los nombres plausibles también pueden ser inventados.

## 6. Compartir logs completos sin revisión

Pueden contener secretos, rutas privadas y datos personales.

## 7. Probar solamente el caso feliz

Los defectos sobreviven en límites, inválidos y combinaciones.

## 8. No guardar el estado defectuoso

Sin comparación resulta difícil demostrar la corrección.

## 9. Reescribir la aplicación completa

El cambio masivo introduce nuevos riesgos y borra el rastro del defecto.

## 10. No documentar una propuesta rechazada

La misma sugerencia incorrecta puede reaparecer después.

---

# Consejos para trabajar profesionalmente

- Lee la evidencia antes de abrir el chat.
- Conserva el caso que falla.
- Escribe una hipótesis propia antes de solicitar hipótesis externas.
- Pide un máximo pequeño de causas posibles.
- Exige una prueba para cada afirmación.
- Verifica símbolos técnicos en fuentes oficiales.
- Aplica un cambio por causa confirmada.
- Revisa el diff antes de ejecutar.
- Ejecuta regresión después de cada corrección.
- Explica por qué rechazaste una propuesta.
- No compartas información que no compartirías públicamente.
- Si no puedes explicar la solución, todavía no está lista para entregarse.

---

# Ejercicios individuales obligatorios

Completa los ocho ejercicios. Registra prompts, respuestas útiles, decisiones y evidencia de ejecución. No entregues únicamente capturas del chat.

## Ejercicio 1. Separar síntoma, defecto y causa

Una tienda calcula un total de 150 cuando el esperado es 135. La regla indica 10 % de descuento para compras de 150 o más. El código utiliza `total > 150` y no existe una prueba para el límite exacto.

Redacta:

1. el síntoma;
2. el defecto;
3. la causa raíz probable;
4. una prueba de regresión;
5. un caso vecino inferior y uno superior.

## Ejercicio 2. Informe de reproducción

Elige un fallo real pequeño de un ejercicio anterior o utiliza este escenario: una lista con un solo elemento produce un error al recorrerla.

Completa la plantilla de reproducción con entorno, pasos, entrada, esperado, real, frecuencia y evidencia. Otra persona debe poder repetir el fallo sin preguntarte nada.

## Ejercicio 3. Sanitizar un registro

Recibes este registro ficticio:

```text
2026-08-05 ERROR usuario=laura@empresa-real.com
API_TOKEN=coa_supersecreto_987
ruta=C:\Users\Laura\clientes\clinica_azul\pagos.json
pedido=PED-908 cantidad=-2
ValueError: cantidad fuera de rango
```

Crea una versión segura para compartir. Explica qué reemplazaste, qué conservaste y por qué el registro todavía sirve para diagnosticar.

## Ejercicio 4. Reducir un problema

Una aplicación con interfaz, persistencia y reportes calcula mal el impuesto. Describe cómo aislarías el cálculo en un ejemplo mínimo reproducible. Incluye los datos mínimos, la instrucción de ejecución y dos elementos que eliminarías.

## Ejercicio 5. Leer una traza

Analiza la traza de la Práctica guiada 1. Identifica tipo o mensaje, archivo, línea, cadena de llamadas, dato ausente, dos hechos y dos inferencias. Indica qué inspeccionarías con el depurador.

## Ejercicio 6. Detectar una API inventada

Una IA recomienda `Money.roundCurrency(total, 2)` sin indicar biblioteca, versión ni documentación.

Redacta un proceso de validación. Debes:

- buscar el símbolo exacto;
- comprobar si pertenece a tu lenguaje o a un paquete;
- confirmar versión y firma;
- diseñar una prueba mínima;
- decidir si aceptas, adaptas o rechazas la propuesta.

No instales una dependencia solamente para justificar la sugerencia.

## Ejercicio 7. Rechazar un bloque general

Una IA propone capturar cualquier excepción y devolver una lista vacía cuando falla la lectura de datos.

Explica tres fallos diferentes que quedarían ocultos. Diseña un manejo específico para archivo inexistente y contenido inválido. Indica qué error debe continuar propagándose o registrarse.

## Ejercicio 8. Diseñar una regresión

Una aplicación rechazaba una reserva que terminaba exactamente a las 18:00. Diseña cuatro casos: antes del límite, límite exacto, fuera del límite y dato inválido. Indica qué prueba debe fallar antes de la corrección y cuáles deben pasar después.

---

# Mini proyecto. Laboratorio de diagnóstico

## Propósito

Resolver cinco incidentes pequeños mediante evidencia, hipótesis y pruebas. El objetivo no es acumular cambios, sino practicar un método repetible.

## Material inicial

Abre `LABORATORIO_INCIDENTES.md` dentro del paquete de materiales. Contiene incidentes de:

1. lógica de descuento;
2. tipos de datos;
3. límite de horario;
4. configuración;
5. manejo de excepciones y seguridad.

## Requisitos

Para cada incidente debes:

1. escribir el resultado esperado y el real;
2. separar síntoma y causa probable;
3. preparar una reproducción mínima;
4. escribir al menos dos hipótesis;
5. pedir a la IA pruebas para confirmar o descartar, sin pedir código primero;
6. ejecutar o simular de forma rigurosa las pruebas;
7. confirmar una causa;
8. proponer el cambio mínimo;
9. crear una prueba de regresión;
10. registrar una afirmación de la IA que verificaste.

## Restricciones

- No envíes los cinco incidentes juntos.
- No aceptes una reescritura completa.
- No elimines validaciones para hacer pasar una prueba.
- No captures todos los errores sin distinguirlos.
- No utilices datos reales.
- Si el pseudocódigo requiere adaptación, conserva la regla observable.

## Informe por incidente

```text
Incidente:
Síntoma:
Esperado:
Real:
Reproducción:
Evidencia:
Hipótesis propias:
Prompt de diagnóstico:
Hipótesis de la IA:
Pruebas realizadas:
Causa confirmada:
Cambio mínimo:
Regresión:
Verificación externa:
Decisión final:
```

## Criterios de finalización

El laboratorio está completo cuando:

- los cinco incidentes poseen una causa sustentada;
- cada corrección tiene una prueba;
- las respuestas de la IA se contrastaron;
- ningún error fue simplemente ocultado;
- la evidencia compartida está sanitizada.

---

# Proyecto del módulo. Rescate de una aplicación defectuosa

## Escenario

Recibes el núcleo de un sistema de reservas para un pequeño negocio. La aplicación calcula el precio de una reserva y valida cliente, cantidad de personas, horario, duración y tipo de servicio.

El programa fue modificado apresuradamente. Ahora contiene varios defectos relacionados y una propuesta de IA incluye una función posiblemente inexistente. Tu trabajo es rescatarlo sin reescribirlo por completo.

## Material inicial

Elige un único archivo:

- `reserva_defectuosa.py`;
- `reserva_defectuosa.js`;
- `ReservaDefectuosa.java`;
- `ReservaDefectuosa.cs`;
- `reserva_defectuosa.cpp`.

También utilizarás:

- `REQUISITOS_RESCATE.md`;
- `MATRIZ_PRUEBAS_RESCATE.md`;
- `PARCHE_SUGERIDO_IA.md`;
- `PLANTILLA_REPRODUCCION.md`;
- `REGISTRO_HIPOTESIS.md`;
- `INFORME_CAUSA_RAIZ.md`.

## Reglas funcionales

La aplicación debe:

1. exigir un nombre de cliente no vacío;
2. aceptar entre 1 y 8 personas;
3. aceptar horas de inicio enteras desde 8 hasta 17;
4. aceptar duraciones enteras de 1 a 3 horas;
5. permitir que una reserva termine exactamente a las 18:00;
6. rechazar una reserva que termine después de las 18:00;
7. aceptar solamente los tipos `normal` y `premium`;
8. cobrar 20 por hora para `normal` y 35 por hora para `premium`;
9. aplicar 10 % de descuento cuando la duración sea exactamente 3 horas;
10. acumular errores de validación cuando sea seguro hacerlo;
11. no devolver un total válido si existen errores;
12. mostrar una causa útil sin revelar datos sensibles.

## Defectos que debes investigar

Sabes que existen problemas en estas categorías, pero debes encontrar la línea y demostrar la causa:

- validación ausente;
- condición imposible o incorrecta;
- error de límite;
- tipo de servicio desconocido tratado como válido;
- descuento que no se aplica;
- manejo general de excepciones que oculta evidencia;
- función incompatible o inexistente sugerida por IA.

Puede haber varias manifestaciones de una misma causa. No cuentes líneas modificadas: documenta incidentes verificables.

## Casos obligatorios

| ID | Entrada resumida | Resultado esperado |
|---|---|---|
| RD-01 | cliente Ana, 2 personas, inicio 8, duración 1, normal | Válida; subtotal 20, descuento 0, total 20, fin 9. |
| RD-02 | cliente Ana, 2 personas, inicio 17, duración 1, normal | Válida; termina exactamente a las 18. |
| RD-03 | cliente Ana, 2 personas, inicio 17, duración 2, normal | Inválida; termina después de las 18. |
| RD-04 | cliente Ana, 0 personas, inicio 10, duración 1, normal | Inválida por cantidad. |
| RD-05 | cliente Ana, 9 personas, inicio 10, duración 1, normal | Inválida por cantidad. |
| RD-06 | cliente vacío, 2 personas, inicio 10, duración 1, normal | Inválida por cliente. |
| RD-07 | cliente Ana, 2 personas, inicio 10, duración 1, vip | Inválida por tipo. |
| RD-08 | cliente Ana, 2 personas, inicio 10, duración 3, premium | Válida; subtotal 105, descuento 10.5, total 94.5, fin 13. |
| RD-09 | cliente Ana, 2 personas, inicio 10, duración 0, normal | Inválida por duración. |
| RD-10 | cliente vacío, 0 personas, inicio 7, duración 4, vip | Inválida; informa todos los errores seguros. |

Agrega al menos dos casos propios: uno normal y otro límite o inválido.

## Fase 1. Conservar y ejecutar el estado defectuoso

1. Copia el archivo sin modificar en `codigo_original`.
2. Crea un punto de recuperación.
3. Ejecuta RD-01 a RD-10.
4. Registra salida real, error y estado.
5. No solicites una solución todavía.

## Fase 2. Diagnóstico propio

Para cada fallo observado:

- escribe el síntoma;
- localiza evidencia;
- formula al menos una hipótesis propia;
- predice qué prueba la confirmaría;
- registra qué dato todavía falta.

Debes identificar y confirmar por tu cuenta al menos una causa antes de consultar a la IA.

## Fase 3. Diagnóstico asistido

Trabaja un incidente por conversación o por sección claramente delimitada. Utiliza la plantilla COA-DIAGNÓSTICO.

Pide a la IA:

- separar hechos de inferencias;
- ordenar un máximo de tres hipótesis;
- proponer una prueba por hipótesis;
- declarar su nivel de confianza;
- evitar código hasta confirmar una causa.

Contrasta cada respuesta con ejecución y código.

## Fase 4. Correcciones pequeñas

Organiza los cambios en grupos coherentes:

```text
1. validación de cliente y personas;
2. límites de horario y duración;
3. tipo, precio y descuento;
4. manejo específico de errores;
5. pruebas de regresión.
```

Después de cada grupo:

1. revisa el diff;
2. ejecuta los casos relacionados;
3. ejecuta también casos que funcionaban;
4. crea un punto de recuperación;
5. registra el resultado.

Conserva la función o método público principal. No agregues paquetes externos.

## Fase 5. Validar la propuesta inventada

Lee `PARCHE_SUGERIDO_IA.md`. No copies el parche directamente.

Debes:

1. identificar sus afirmaciones comprobables;
2. buscar la función propuesta en documentación oficial;
3. confirmar biblioteca, versión, firma y retorno;
4. construir una prueba mínima si el símbolo existe;
5. aceptar, adaptar o rechazar la propuesta;
6. documentar la fuente y la decisión.

Si la función no existe, utiliza una operación estándar documentada en tu lenguaje y conserva la precisión requerida por el proyecto.

## Fase 6. Regresión

Automatiza los casos cuando tu nivel y lenguaje lo permitan. Si no utilizas un framework de pruebas, crea un ejecutor que compare esperado y real claramente.

La evidencia debe mostrar:

- al menos un caso que falla antes y pasa después;
- RD-01 a RD-10 después de la corrección;
- dos casos propios;
- ausencia de errores ocultos;
- resultados repetibles desde una copia limpia.

## Fase 7. Informe de rescate

Entrega un informe con:

- resumen del impacto;
- pasos de reproducción;
- evidencia sanitizada;
- tabla de hipótesis;
- causa raíz por incidente;
- corrección aplicada;
- propuesta de IA aceptada, adaptada o rechazada;
- pruebas de regresión;
- riesgos pendientes;
- reflexión sobre qué aportó la IA y qué decisión dependió de tu razonamiento.

## Restricciones del proyecto

- No reescribas la aplicación completa.
- No cambies requisitos para hacer pasar casos.
- No instales dependencias externas.
- No ocultes errores con un bloque general vacío.
- No entregues código que no puedas explicar.
- No incluyas secretos ni información personal.
- No marques una prueba como aprobada sin ejecutarla.

## Definición de terminado

El proyecto está terminado cuando:

- RD-01 a RD-10 y los dos casos propios tienen evidencia;
- todas las causas están sustentadas;
- la interfaz principal se conserva;
- cada corrección es pequeña y rastreable;
- la función sugerida fue verificada en una fuente oficial;
- existe regresión;
- el informe permite reconstruir la investigación;
- el programa se ejecuta desde la copia final entregada.

---

# Rúbrica del proyecto del módulo

El proyecto representa **50 puntos** de la calificación del módulo.

| Criterio | Puntos | Desempeño esperado |
|---|---:|---|
| Reproducción y evidencia | 8 | Registra entradas, esperado, real, entorno y evidencia sanitizada. |
| Diagnóstico y causa raíz | 10 | Distingue síntomas, hipótesis y causas confirmadas mediante pruebas. |
| Correcciones funcionales | 10 | Cumple RD-01 a RD-10 sin reescritura innecesaria. |
| Validación de respuestas de IA | 7 | Contrasta afirmaciones, verifica el símbolo sugerido y documenta decisiones. |
| Pruebas de regresión | 7 | Conserva un caso que falla antes, automatiza o ejecuta todos los casos y evita regresiones. |
| Calidad y alcance del código | 4 | Mantiene interfaz, claridad, manejo específico de errores y ausencia de dependencias injustificadas. |
| Informe y trazabilidad | 4 | Relaciona incidente, causa, cambio, diff, prueba y resultado. |
| **Total** | **50** | |

## Fallos críticos que requieren corrección

Aunque la suma alcance el mínimo, deberás corregir la entrega si ocurre cualquiera de estas condiciones:

- el programa no se puede ejecutar;
- se reescribió el proyecto sin investigar los defectos;
- se ocultaron errores con un bloque general;
- se afirmó que una función existe sin verificarla;
- faltan pruebas obligatorias;
- la evidencia contiene secretos o datos personales;
- no puedes explicar una corrección;
- los resultados declarados no coinciden con la ejecución.

---

# Evaluación práctica del módulo

La evaluación representa **15 puntos**. Resuélvela sin solicitar a la IA una respuesta completa. Puedes utilizarla para generar hipótesis, pero cada decisión debe estar justificada.

## Incidente

Un proceso recorre una colección y falla solamente al finalizar:

```text
2026-08-05T17:20:11Z ERROR
SERVICE_TOKEN=coa_token_ficticio_123
IndexError: índice fuera de rango
  en procesar_elementos (procesador, línea 22)
  en ejecutar_reporte (reporte, línea 41)

Condición actual:
indice <= longitud(elementos)
```

Dos propuestas llegan desde una IA:

```text
Propuesta A:
Capturar cualquier excepción, devolver null y continuar.

Propuesta B:
Cambiar la condición a indice < longitud(elementos), conservar el error
de procesar_elementos y agregar pruebas para colección vacía, un elemento
y varios elementos.
```

## Tareas

1. Produce una versión sanitizada del registro.
2. Define síntoma, defecto probable y causa raíz que todavía debe confirmarse.
3. Escribe dos hipótesis y una prueba para cada una.
4. Indica qué observarías con el depurador.
5. Compara A y B mediante cuatro criterios.
6. Elige, adapta o rechaza cada propuesta.
7. Diseña tres pruebas de regresión.
8. Explica qué documentación consultarías.
9. Redacta una conclusión de máximo 150 palabras.

## Rúbrica de la evaluación

| Criterio | Puntos |
|---|---:|
| Sanitización correcta | 2 |
| Separación de síntoma, defecto y causa | 3 |
| Hipótesis y pruebas | 3 |
| Comparación de propuestas | 3 |
| Regresión y documentación | 3 |
| Conclusión técnica | 1 |
| **Total** | **15** |

---

# Calificación del módulo

| Componente | Puntos |
|---|---:|
| Ejercicios obligatorios | 15 |
| Mini proyecto | 20 |
| Proyecto del módulo | 50 |
| Evaluación práctica | 15 |
| **Total** | **100** |

Necesitas obtener al menos **80 puntos de 100** y resolver cualquier fallo crítico antes de continuar al Módulo 5.

---

# Videos recomendados

## 1. Excepciones en Python: lectura de `traceback`

[Ver video: Excepciones en Python — Traceback y manejo de errores](https://www.youtube.com/watch?v=y-Wv5fZybhU)

**Canal:** Sergio A. Castaño Giraldo  
**Parte recomendada:** desde 04:32 para la lectura del `traceback`  
**Utilidad:** muestra cómo interpretar el recorrido de un error de ejecución. Aunque utiliza Python, el método de identificar mensaje, línea y llamadas se transfiere a otros lenguajes.

## 2. Depuración paso a paso en Visual Studio Code

[Ver video: Usa VS Code para programar en Python y depurar código](https://www.youtube.com/watch?v=eFThEXvuZaM)

**Canal:** Programación Desde Cero  
**Parte recomendada:** desde 06:31  
**Utilidad:** demuestra el uso básico del depurador para detener la ejecución e inspeccionar el programa. Si utilizas otro lenguaje, aplica el mismo concepto con el adaptador correspondiente.

## 3. Revisión y validación de código generado

[Ver video: Descubriendo GitHub Copilot CLI](https://www.youtube.com/watch?v=3lkcGkG8Vxg)

**Canal:** Microsoft Reactor  
**Parte recomendada:** 15:53 a 18:14  
**Utilidad:** permite observar una revisión de código generado y refuerza la necesidad de validar antes de aceptar. La interfaz mostrada puede cambiar; concéntrate en el proceso de revisión.

Los videos son apoyo. Completar el módulo exige ejecutar, observar y documentar tus propias pruebas.

---

# Documentación oficial y recursos confiables

## Depuración asistida por IA

- [Aprender a depurar con GitHub Copilot](https://docs.github.com/es/get-started/learning-to-code/learning-to-debug-with-github-copilot)
- [Recetario de GitHub Copilot para depurar errores](https://docs.github.com/es/copilot/tutorials/copilot-cookbook/debug-errors)
- [Uso responsable de las sugerencias de código de GitHub Copilot](https://docs.github.com/es/copilot/responsible-use/copilot-code-completion)
- [Mejores prácticas de prompts para ChatGPT](https://help.openai.com/es-419/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

## Depurador y control de cambios

- [Documentación oficial de depuración en Visual Studio Code](https://code.visualstudio.com/docs/debugtest/debugging)
- [Documentación oficial de git diff](https://git-scm.com/docs/git-diff)
- [Documentación oficial de git bisect](https://git-scm.com/docs/git-bisect)

`git bisect` es un recurso opcional. No necesitas dominarlo en este módulo; consulta su propósito si debes localizar el cambio exacto que introdujo un fallo.

## Errores y excepciones por lenguaje

- [Python: errores y excepciones](https://docs.python.org/es/3/tutorial/errors.html)
- [JavaScript: objeto Error en MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Java: excepciones](https://docs.oracle.com/javase/tutorial/essential/exceptions/)
- [C# y .NET: excepciones](https://learn.microsoft.com/es-es/dotnet/standard/exceptions/)

Utiliza la documentación de tu lenguaje para confirmar nombres, firmas, versiones y tipos de error. Una respuesta de IA nunca reemplaza esa comprobación.

---

# Material complementario

[Descargar materiales del Módulo 4](/downloads/programacion-ia/modulo-4/programacion-ia-modulo-4-materiales.zip)

Este módulo incluye un paquete descargable con:

1. laboratorio de cinco incidentes;
2. aplicación de reservas defectuosa en cinco lenguajes;
3. requisitos y matriz de pruebas;
4. propuesta de IA que debe validarse;
5. plantilla de reproducción;
6. registro de hipótesis;
7. plantilla de informe de causa raíz.

Utiliza únicamente la versión del programa que corresponda a tu lenguaje. Los demás archivos no son tareas adicionales.

No se requiere un PDF.

---

# Glosario

**Depuración:** proceso sistemático para localizar, comprender y corregir defectos.

**Síntoma:** comportamiento observable que indica un problema.

**Defecto:** error concreto en código, configuración o datos.

**Causa raíz:** condición fundamental que permitió que el defecto apareciera o permaneciera.

**Reproducción:** conjunto de pasos y datos que hacen aparecer un fallo.

**Ejemplo mínimo reproducible:** versión pequeña que conserva el fallo y elimina elementos irrelevantes.

**Traza de pila:** secuencia de llamadas activas que condujo a un error.

**`Traceback`:** representación de la traza y el error, término habitual en Python.

**Log:** registro de eventos producidos durante la ejecución.

**Sanitización:** sustitución o eliminación de información sensible sin perder valor técnico.

**Hipótesis:** explicación provisional que puede confirmarse o refutarse.

**Parche:** cambio que puede reducir un síntoma sin resolver necesariamente su causa.

**Regresión:** fallo de una capacidad que funcionaba antes de una modificación.

**Prueba de regresión:** caso que impide la reaparición de un defecto conocido.

**Alucinación técnica:** afirmación generada con apariencia válida, pero inexistente o incorrecta.

**Diff:** comparación de líneas agregadas, eliminadas y modificadas.

**Breakpoint:** punto donde el depurador pausa la ejecución.

**Frame o marco:** una llamada individual dentro de una traza de pila.

**Solución temporal:** medida limitada que reduce impacto mientras se prepara una corrección definitiva.

---

# Resumen del módulo

La IA acelera el diagnóstico cuando recibe evidencia clara y participa en un proceso verificable:

```text
Reproducir → leer → reducir → plantear hipótesis
          → consultar → contrastar → corregir
          → probar → documentar
```

Durante la depuración debes:

- diferenciar síntoma, defecto y causa;
- conservar el estado defectuoso;
- leer la traza completa;
- proteger datos antes de compartirlos;
- declarar esperado y real;
- comprobar una hipótesis por vez;
- pedir diagnóstico antes de código;
- verificar funciones y versiones;
- rechazar parches que ocultan errores;
- aplicar cambios pequeños;
- agregar regresión;
- documentar con evidencia.

La IA puede proponer una explicación. La ejecución, las pruebas y la documentación determinan si es verdadera.

---

# Checklist antes de entregar

## Ejercicios

- [ ] Completé los ocho ejercicios.
- [ ] Separé síntomas, defectos y causas.
- [ ] Sanitice la evidencia antes de compartirla.

## Mini proyecto

- [ ] Resolví los cinco incidentes.
- [ ] Formulé hipótesis propias.
- [ ] Pedí diagnóstico antes de pedir código.
- [ ] Confirmé cada causa mediante una prueba.
- [ ] Creé una regresión por incidente.

## Proyecto principal

- [ ] Conservé el archivo original.
- [ ] Ejecuté RD-01 a RD-10 antes y después.
- [ ] Agregué dos casos propios.
- [ ] Confirmé una causa sin IA.
- [ ] Trabajé con cambios pequeños.
- [ ] Revisé los diffs.
- [ ] No cambié la interfaz pública.
- [ ] Verifiqué la función sugerida en documentación oficial.
- [ ] No oculté errores.
- [ ] Preparé el informe de rescate.

## Seguridad y dominio

- [ ] No incluí secretos ni datos reales.
- [ ] Puedo explicar cada corrección.
- [ ] Distinguí hechos, hipótesis y conclusiones.
- [ ] Registré propuestas aceptadas, adaptadas y rechazadas.

## Evaluación y archivo

- [ ] Resolví la evaluación práctica.
- [ ] El programa funciona desde la copia final.
- [ ] El `.zip` abre correctamente.

---

# Entrega de la actividad

Utiliza un único punto de entrega para todo el Módulo 4.

## Qué debes entregar

- ocho ejercicios obligatorios;
- informes de los cinco incidentes del laboratorio;
- código original y corregido del sistema de reservas;
- reproducciones y evidencia sanitizada;
- registro de hipótesis;
- prompts y respuestas relevantes de diagnóstico;
- diffs o historial de cambios;
- validación de la función sugerida;
- RD-01 a RD-10 y dos casos propios;
- pruebas de regresión;
- informe de causa raíz;
- evaluación práctica.

## Estructura recomendada

```text
COA_IA_M4_Nombre_Apellido/
├── 01_ejercicios/
│   └── ejercicios.md
├── 02_mini_proyecto/
│   ├── incidentes_01_a_05.md
│   ├── prompts_y_respuestas.md
│   ├── pruebas/
│   └── evidencias/
├── 03_proyecto_rescate/
│   ├── codigo_original/
│   ├── codigo_corregido/
│   ├── pruebas/
│   ├── 01_reproducciones.md
│   ├── 02_hipotesis.md
│   ├── 03_validacion_api.md
│   ├── 04_diffs.md
│   ├── 05_informe_causa_raiz.md
│   ├── 06_bitacora_ia.md
│   └── evidencias/
└── 04_evaluacion/
    └── evaluacion_modulo_4.md
```

## Formato

- Comprime la carpeta en `.zip`.
- Incluye código fuente, no solamente capturas.
- Utiliza `.md`, `.txt` o `.pdf` para documentos.
- Utiliza `.png`, `.jpg` o `.pdf` para evidencias.
- No incluyas dependencias instaladas, binarios, credenciales ni datos reales.
- Si utilizaste Git y el tamaño es razonable, puedes incluir el historial.

## Nombre del archivo

```text
COA_IA_M4_Nombre_Apellido.zip
```

Ejemplo:

```text
COA_IA_M4_Lucia_Vargas.zip
```

## Antes de enviar

1. Descomprime una copia del archivo.
2. Ejecuta el sistema corregido desde esa copia.
3. Ejecuta RD-01 a RD-10 y los casos propios.
4. Comprueba que la evidencia sea legible.
5. Busca tokens, contraseñas y datos personales.
6. Confirma que cada causa se relacione con una prueba.
7. Envía el archivo mediante el botón **Enviar actividad**.

[Entregar Módulo 4](https://forms.gle/nTx97JRkFkbH5Vfr6)

Si necesitas presentar una corrección, conserva la estructura y agrega la versión:

```text
COA_IA_M4_Nombre_Apellido_v2.zip
```

---

# Habilidades obtenidas

Al aprobar este módulo podrás:

- reproducir fallos con precisión;
- reducir problemas a ejemplos manejables;
- leer errores, trazas y logs;
- proteger información durante el diagnóstico;
- convertir observaciones en hipótesis comprobables;
- trabajar con IA sin delegar la decisión técnica;
- detectar funciones y explicaciones inventadas;
- elegir cambios pequeños y justificables;
- evitar excepciones que ocultan defectos;
- diseñar regresiones;
- documentar incidentes profesionales;
- rescatar una aplicación defectuosa mediante evidencia.

En el siguiente módulo utilizarás estas habilidades para automatizar tareas del desarrollo, generar pruebas y documentación, y modernizar proyectos sin perder control sobre la calidad.
