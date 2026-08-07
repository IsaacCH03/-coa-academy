# COA — Lógica de Programación

# Módulo 3: Lógica y toma de decisiones

**Duración obligatoria:** 2 horas y 30 minutos  
**Nivel:** Principiante absoluto  
**Conocimientos previos:** Módulos 1 y 2 aprobados  
**Modalidad:** Práctica, independiente de cualquier lenguaje  
**Materiales:** Papel, lápiz y acceso opcional a una herramienta de diagramas  
**Herramientas opcionales:** PSeInt o diagrams.net

---

## 1. Objetivo del módulo

Crear algoritmos capaces de elegir caminos diferentes de acuerdo con la información que reciben.

Al terminar el módulo, podrá:

- explicar qué es una condición;
- reconocer que toda condición produce `VERDADERO` o `FALSO`;
- utilizar comparaciones para formular reglas;
- construir decisiones simples y decisiones con dos resultados;
- organizar tres o más alternativas;
- combinar condiciones mediante `Y`, `O` y `NO`;
- trabajar correctamente con rangos y valores límite;
- ordenar condiciones para evitar resultados incorrectos;
- utilizar decisiones anidadas solo cuando sean necesarias;
- detectar casos inválidos, olvidados o no contemplados;
- representar decisiones mediante pseudocódigo, tablas y diagramas de flujo;
- probar todos los caminos importantes de un algoritmo.

> Este módulo no enseña la sintaxis de `if`, `else` o expresiones booleanas de un lenguaje particular. Enseña la lógica común que después podrá expresarse en Python, Java, C#, JavaScript u otros lenguajes.

---

## 2. Distribución del tiempo

| Sección | Tiempo |
|---|---:|
| Activación y diagnóstico | 5 min |
| Comparaciones, condiciones y valores lógicos | 15 min |
| Decisiones simples y dobles | 20 min |
| Operadores `Y`, `O`, `NO` y rangos | 25 min |
| Alternativas, orden y casos no contemplados | 20 min |
| Ejemplos, actividad y ejercicios | 25 min |
| Retos | 10 min |
| Mini proyecto | 25 min |
| Evaluación y cierre | 5 min |
| **Total** | **150 min** |

---

## 3. Mapa del aprendizaje

```text
DATO
  ↓
COMPARACIÓN
  ↓
CONDICIÓN
  ↓
VERDADERO O FALSO
  ↓
ELECCIÓN DE UN CAMINO
  ↓
RESULTADO
  ↓
PRUEBA DE TODOS LOS CAMINOS IMPORTANTES
```

---

# PARTE 1 — ACTIVACIÓN

## 4. Pregunta guía

> Si dos personas proporcionan datos diferentes, ¿cómo puede el mismo algoritmo dar una respuesta distinta a cada una?

Imaginemos una actividad que solo acepta participantes de 12 a 17 años.

- Si llega una persona de 14 años, puede cumplir la regla.
- Si llega una persona de 20 años, no la cumple.

El algoritmo es el mismo. Lo que cambia es la información recibida y, por tanto, el camino que debe seguir.

Pensar lógicamente no consiste en adivinar la respuesta. Consiste en convertir una regla en preguntas precisas que puedan responderse con `VERDADERO` o `FALSO`.

---

## 5. Diagnóstico inicial sin calificación

Una piscina establece estas reglas:

- abre de las 8:00 a las 17:00;
- para ingresar es necesario presentar una entrada válida;
- una persona menor de 12 años debe entrar acompañada.

Responde con palabras cotidianas:

1. ¿Qué preguntas harías antes de permitir el ingreso?
2. ¿En qué orden las harías?
3. ¿Una persona de 10 años con entrada válida puede ingresar sola?
4. ¿Una persona de 15 años sin entrada válida puede ingresar?
5. ¿Qué debería ocurrir exactamente a las 17:00?
6. ¿Hay algún dato que la regla no deje completamente claro?

### Propósito

Usted ya toma decisiones todos los días. El objetivo del módulo es transformar ese razonamiento informal en reglas claras, ordenadas y comprobables.

---

## 6. Video introductorio obligatorio

[PSeInt desde cero 2026 | Condicionales | Simple y doble en PSeInt — Tecno Hobbies](https://www.youtube.com/watch?v=K8N0c62_4Wc)

**Duración:** 4 minutos y 33 segundos  
**Tema exacto:** Condiciones simples y dobles  
**Antes de continuar:** Concéntrese en la pregunta lógica y en los dos caminos. No memorice la forma de escribir de PSeInt.  

### Pregunta después del video

En la siguiente regla, identifica la pregunta y los dos caminos:

> Si la contraseña es correcta, permitir el acceso; de lo contrario, mostrar un aviso.

---

# PARTE 2 — DE LA COMPARACIÓN A LA DECISIÓN

## 7. Recordatorio: una comparación produce un resultado lógico

En el Módulo 2 se estudiaron comparaciones como:

```text
edad ≥ 18
saldo = 0
temperatura < 10
nombre ≠ ""
```

Cada comparación produce uno de dos resultados:

```text
VERDADERO
FALSO
```

Si:

```text
edad ← 20
```

entonces:

```text
edad ≥ 18
```

produce `VERDADERO`.

En cambio:

```text
edad < 18
```

produce `FALSO`.

La comparación no decide por sí sola qué hacer. Solo responde una pregunta. La decisión utiliza esa respuesta para elegir un camino.

---

## 8. Comparar no es asignar

Estas dos acciones son distintas:

```text
edad ← 18
```

Significa: guardar el valor `18` en `edad`.

```text
edad = 18
```

Significa: preguntar si el valor guardado en `edad` es igual a `18`.

Para evitar confusiones durante el curso:

- utilizaremos `←` para asignar;
- utilizaremos `=` para comparar igualdad.

---

## 9. ¿Qué es una condición?

Una condición es una pregunta lógica que puede responderse con `VERDADERO` o `FALSO`.

Ejemplos:

```text
¿La edad es mayor o igual que 18?
¿Quedan cupos disponibles?
¿La contraseña ingresada coincide con la correcta?
¿La persona está inscrita?
```

En pseudocódigo, las preguntas pueden escribirse así:

```text
edad ≥ 18
cupos_disponibles > 0
contraseña_ingresada = contraseña_correcta
inscripcion_confirmada = VERDADERO
```

Cuando una variable ya contiene un valor lógico, puede utilizarse directamente:

```text
inscripcion_confirmada
```

No es obligatorio escribir:

```text
inscripcion_confirmada = VERDADERO
```

Las dos formas expresan la misma pregunta.

---

## 10. De una regla cotidiana a una condición

Regla cotidiana:

> La entrada es gratuita para menores de 6 años.

Dato necesario:

```text
edad
```

Condición:

```text
edad < 6
```

Acción si se cumple:

```text
precio_entrada ← 0
```

Una buena condición debe ser:

- clara;
- comprobable con los datos disponibles;
- precisa en sus límites;
- coherente con la regla original.

### Una palabra puede cambiar la condición

| Regla | Condición |
|---|---|
| Mayor de 18 | `edad > 18` |
| Mayor o igual que 18 | `edad ≥ 18` |
| Menor de 12 | `edad < 12` |
| Como máximo 12 | `edad ≤ 12` |
| Distinto de cero | `cantidad ≠ 0` |

Los símbolos `>` y `≥` no significan lo mismo. El primero excluye el valor límite; el segundo lo incluye.

---

# PARTE 3 — DECISIONES SIMPLES Y DOBLES

## 11. Decisión simple: actuar únicamente si algo se cumple

Una decisión simple tiene una acción especial cuando la condición es verdadera. Si es falsa, el algoritmo continúa sin ejecutar esa acción.

### Estructura

```text
SI condición ENTONCES
    acción
FIN SI
```

### Ejemplo: aplicar envío gratuito

Regla:

> Si el subtotal es de 40 o más, el envío es gratuito.

```text
LEER subtotal
envio ← 4

SI subtotal ≥ 40 ENTONCES
    envio ← 0
FIN SI

MOSTRAR envio
```

Si `subtotal` vale `55`, se ejecuta:

```text
envio ← 0
```

Si `subtotal` vale `25`, esa instrucción se omite y `envio` conserva el valor `4`.

### Diagrama

```text
              ┌─────────────────┐
              │ ¿subtotal ≥ 40? │
              └────────┬────────┘
                  Sí   │   No
             ┌─────────┘    └──────────┐
             ▼                         │
      ┌─────────────┐                  │
      │ envio ← 0   │                  │
      └──────┬──────┘                  │
             └───────────┬─────────────┘
                         ▼
                  ┌──────────────┐
                  │ MOSTRAR envio│
                  └──────────────┘
```

---

## 12. Decisión doble: elegir entre dos caminos

Una decisión doble define qué hacer cuando la condición es verdadera y qué hacer cuando es falsa.

### Estructura

```text
SI condición ENTONCES
    acción del camino verdadero
SINO
    acción del camino falso
FIN SI
```

### Ejemplo: determinar si una persona es mayor de edad

```text
LEER edad

SI edad ≥ 18 ENTONCES
    MOSTRAR "Es mayor de edad"
SINO
    MOSTRAR "Es menor de edad"
FIN SI
```

### Recorrido con dos valores

| Edad | `edad ≥ 18` | Camino | Salida |
|---:|---|---|---|
| 20 | VERDADERO | `SI` | Es mayor de edad |
| 15 | FALSO | `SINO` | Es menor de edad |

Solo se ejecuta uno de los dos caminos.

---

## 13. El rombo de decisión en un diagrama de flujo

En un diagrama de flujo, una condición se representa mediante un rombo.

```text
          ◇
      ¿condición?
       /       \
     Sí         No
```

Reglas básicas:

1. La pregunta debe estar dentro del rombo.
2. Cada salida debe indicar `Sí/No` o `Verdadero/Falso`.
3. Las acciones se colocan en rectángulos.
4. Las flechas deben mostrar claramente el recorrido.
5. Cada camino debe continuar hacia otra acción o hacia el final.

### Ejemplo: entrada con dos precios

```text
                 ┌────────┐
                 │ INICIO │
                 └───┬────┘
                     ▼
               ╱───────────╲
              ╱  LEER edad  ╲
              ╲             ╱
               ╲─────┬─────╱
                     ▼
                ◇ edad < 12 ◇
                  /       \
                Sí         No
                ▼           ▼
        ┌────────────┐ ┌────────────┐
        │ precio ← 3 │ │ precio ← 5 │
        └──────┬─────┘ └─────┬──────┘
               └──────┬──────┘
                      ▼
                ╱────────────╲
               ╱MOSTRAR precio╲
               ╲              ╱
                ╲──────┬─────╱
                       ▼
                   ┌─────┐
                   │ FIN │
                   └─────┘
```

> En diagramas elaborados con una herramienta digital, utilice las figuras convencionales: óvalo para inicio y fin, paralelogramo para entrada y salida, rectángulo para proceso y rombo para decisión.

---

# PARTE 4 — COMBINAR CONDICIONES

## 14. Operador `Y`: todas las condiciones deben cumplirse

La expresión:

```text
condición_A Y condición_B
```

es verdadera únicamente cuando ambas condiciones son verdaderas.

Regla cotidiana:

> Puede participar si tiene al menos 18 años y su inscripción está confirmada.

Condición:

```text
edad ≥ 18 Y inscripcion_confirmada
```

### Tabla de `Y`

| Condición A | Condición B | A `Y` B |
|---|---|---|
| VERDADERO | VERDADERO | VERDADERO |
| VERDADERO | FALSO | FALSO |
| FALSO | VERDADERO | FALSO |
| FALSO | FALSO | FALSO |

### Analogía

Una puerta necesita dos llaves diferentes. Tener solo una no basta.

---

## 15. Operador `O`: basta con que una condición se cumpla

La expresión:

```text
condición_A O condición_B
```

es verdadera cuando una condición, la otra o ambas son verdaderas.

Regla cotidiana:

> Obtiene descuento si es estudiante o persona adulta mayor.

Condición:

```text
es_estudiante O edad ≥ 65
```

### Tabla de `O`

| Condición A | Condición B | A `O` B |
|---|---|---|
| VERDADERO | VERDADERO | VERDADERO |
| VERDADERO | FALSO | VERDADERO |
| FALSO | VERDADERO | VERDADERO |
| FALSO | FALSO | FALSO |

### Analogía

Una puerta puede abrirse con una llave física o con una tarjeta. Cualquiera de las dos opciones es suficiente.

> En este curso, `O` incluye el caso en que ambas condiciones son verdaderas, a menos que la regla diga expresamente “una opción, pero no ambas”.

---

## 16. Operador `NO`: invertir una condición

`NO` cambia el resultado lógico:

```text
NO VERDADERO → FALSO
NO FALSO     → VERDADERO
```

Si:

```text
tiene_deuda ← FALSO
```

entonces:

```text
NO tiene_deuda
```

produce `VERDADERO`.

Regla:

> Puede retirar el libro si no tiene deuda.

```text
SI NO tiene_deuda ENTONCES
    MOSTRAR "Préstamo autorizado"
SINO
    MOSTRAR "Debe cancelar la deuda"
FIN SI
```

### Escribir condiciones afirmativas cuando sea posible

Esta condición es válida:

```text
NO inscripcion_confirmada
```

Pero una expresión con varias negaciones puede resultar difícil:

```text
NO (NO tiene_permiso)
```

Cuando sea posible, formule la regla de una manera directa y fácil de leer.

---

## 17. Video obligatorio sobre operadores lógicos

[Operadores Lógicos o Booleanos | Curso Básico de Programación — LearnFree en Español](https://www.youtube.com/watch?v=aJ-tdYeJTxU)

**Duración:** 2 minutos y 52 segundos  
**Tema exacto:** Operadores `Y`, `O` y `NO`  

### Comprobación rápida

Indica el resultado sin consultar las tablas:

```text
VERDADERO Y FALSO
VERDADERO O FALSO
NO VERDADERO
```

---

## 18. Rangos

Un rango establece un límite inferior y uno superior.

Regla:

> Se acepta a personas de 12 a 17 años, incluidos ambos límites.

Condición:

```text
edad ≥ 12 Y edad ≤ 17
```

También puede expresarse:

```text
12 ≤ edad Y edad ≤ 17
```

La primera forma suele resultar más fácil para principiantes porque repite el nombre de la variable.

### Inclusivo y exclusivo

| Regla | Condición |
|---|---|
| De 12 a 17, incluidos | `edad ≥ 12 Y edad ≤ 17` |
| Mayor de 12 y menor de 17 | `edad > 12 Y edad < 17` |
| Desde las 8:00 y antes de las 17:00 | `hora ≥ 8 Y hora < 17` |
| Fuera del rango de 0 a 100 | `nota < 0 O nota > 100` |

### Error frecuente: utilizar `O` dentro del rango

Incorrecto:

```text
edad ≥ 12 O edad ≤ 17
```

Para una edad de `30`:

- `edad ≥ 12` es verdadero;
- por lo tanto, toda la expresión es verdadera.

Para una edad de `5`:

- `edad ≤ 17` es verdadero;
- por lo tanto, también se acepta.

La condición incorrecta acepta prácticamente cualquier edad. Para estar dentro del rango deben cumplirse los dos límites, por eso se utiliza `Y`.

---

## 19. Paréntesis para mostrar la intención

Regla:

> Puede ingresar si tiene entrada y, además, es mayor de edad o está acompañado.

Condición:

```text
tiene_entrada Y (edad ≥ 18 O esta_acompañado)
```

Los paréntesis indican que primero se estudia:

```text
edad ≥ 18 O esta_acompañado
```

y después se combina el resultado con:

```text
tiene_entrada
```

Sin paréntesis, la regla puede resultar ambigua para quien la lee.

### Método recomendado

Cuando una regla contenga tres o más partes:

1. sepárela en preguntas pequeñas;
2. determine cuáles son obligatorias;
3. determine cuáles son alternativas;
4. agrupe las alternativas con paréntesis;
5. pruebe casos que hagan verdadera y falsa cada parte.

---

# PARTE 5 — VARIAS ALTERNATIVAS

## 20. Decisiones con tres o más caminos

Algunos problemas no tienen solamente dos respuestas.

Ejemplo:

- nota de 90 a 100: excelente;
- nota de 70 a 89: aprobada;
- nota menor de 70: necesita mejorar.

Una forma ordenada de expresarlo es:

```text
SI nota ≥ 90 ENTONCES
    MOSTRAR "Excelente"
SINO SI nota ≥ 70 ENTONCES
    MOSTRAR "Aprobada"
SINO
    MOSTRAR "Necesita mejorar"
FIN SI
```

El algoritmo evalúa de arriba hacia abajo y toma el primer camino cuya condición sea verdadera.

### Seguimiento

Para `nota ← 95`:

```text
nota ≥ 90 → VERDADERO
```

Se muestra `"Excelente"` y ya no se evalúan las alternativas siguientes.

Para `nota ← 82`:

```text
nota ≥ 90 → FALSO
nota ≥ 70 → VERDADERO
```

Se muestra `"Aprobada"`.

---

## 21. El orden de las condiciones importa

Observe este algoritmo:

```text
SI nota ≥ 70 ENTONCES
    MOSTRAR "Aprobada"
SINO SI nota ≥ 90 ENTONCES
    MOSTRAR "Excelente"
SINO
    MOSTRAR "Necesita mejorar"
FIN SI
```

Para una nota de `95`, la primera condición ya es verdadera. El algoritmo muestra `"Aprobada"` y nunca llega a `"Excelente"`.

### Corrección

Cuando varias condiciones se superponen y se revisan de arriba hacia abajo, se suele colocar primero la condición más específica o exigente:

```text
SI nota ≥ 90 ENTONCES
    ...
SINO SI nota ≥ 70 ENTONCES
    ...
```

### Pregunta de control

Antes de aceptar el orden, pregunte:

> Si un valor cumple varias condiciones, ¿cuál de ellas debe ganar?

---

## 22. Validar antes de clasificar

Una nota de `130` no debería clasificarse como excelente. Antes de clasificarla, se debe comprobar si el dato es válido.

```text
SI nota < 0 O nota > 100 ENTONCES
    MOSTRAR "Nota inválida"
SINO SI nota ≥ 90 ENTONCES
    MOSTRAR "Excelente"
SINO SI nota ≥ 70 ENTONCES
    MOSTRAR "Aprobada"
SINO
    MOSTRAR "Necesita mejorar"
FIN SI
```

Orden recomendado:

```text
1. Detectar datos imposibles o inválidos.
2. Evaluar las categorías especiales o más exigentes.
3. Evaluar las categorías restantes.
4. Definir un caso final.
```

---

## 23. El caso final o camino `SINO`

El `SINO` representa todo lo que no cumplió las condiciones anteriores.

```text
SI semaforo = "verde" ENTONCES
    MOSTRAR "Avanzar"
SINO SI semaforo = "amarillo" ENTONCES
    MOSTRAR "Reducir la velocidad"
SINO SI semaforo = "rojo" ENTONCES
    MOSTRAR "Detenerse"
SINO
    MOSTRAR "Estado del semáforo desconocido"
FIN SI
```

Sin el último camino, valores como `"azul"` quedarían sin respuesta.

Un algoritmo profesional no solo piensa en los casos esperados. También define qué ocurrirá cuando la información sea incorrecta, imposible o inesperada.

---

## 24. Decisiones anidadas

Una decisión está anidada cuando aparece dentro de otra.

Ejemplo:

```text
SI tiene_entrada ENTONCES
    SI edad < 12 ENTONCES
        MOSTRAR "Debe entrar con una persona adulta"
    SINO
        MOSTRAR "Ingreso permitido"
    FIN SI
SINO
    MOSTRAR "Debe comprar una entrada"
FIN SI
```

Aquí tiene sentido preguntar por la edad únicamente después de confirmar que existe una entrada.

### Cuándo utilizar una decisión anidada

Utilícela cuando:

- una segunda pregunta solo tenga sentido después de responder la primera;
- quiera mostrar con claridad una dependencia entre reglas;
- cada respuesta de la primera pregunta lleve a preguntas diferentes.

### Cuándo evitarla

Evite anidar si una condición compuesta expresa la misma regla con mayor claridad.

Versión innecesariamente anidada:

```text
SI edad ≥ 18 ENTONCES
    SI inscripcion_confirmada ENTONCES
        MOSTRAR "Puede participar"
    FIN SI
FIN SI
```

Versión más directa:

```text
SI edad ≥ 18 Y inscripcion_confirmada ENTONCES
    MOSTRAR "Puede participar"
FIN SI
```

No existe una regla que obligue a usar siempre una forma. La mejor es la que representa la situación con claridad y sin repetir lógica.

---

## 25. Tabla de decisiones

Una tabla permite revisar combinaciones antes de escribir el pseudocódigo.

Regla:

> Para retirar una bicicleta, la membresía debe estar activa, debe haber una bicicleta disponible y la persona no debe tener una deuda.

| Membresía activa | Bicicleta disponible | Tiene deuda | ¿Autorizar? |
|---|---|---|---|
| Sí | Sí | No | Sí |
| Sí | Sí | Sí | No |
| Sí | No | No | No |
| No | Sí | No | No |

Condición:

```text
membresia_activa Y bicicleta_disponible Y NO tiene_deuda
```

La tabla no reemplaza el algoritmo. Ayuda a descubrir combinaciones y a diseñar pruebas.

---

# PARTE 6 — EJEMPLOS RESUELTOS

## 26. Ejemplo 1: horario de atención

### Problema

Una oficina atiende desde las 8:00 hasta antes de las 17:00.

### Condición

```text
hora ≥ 8 Y hora < 17
```

### Pseudocódigo

```text
LEER hora

SI hora < 0 O hora ≥ 24 ENTONCES
    MOSTRAR "Hora inválida"
SINO SI hora ≥ 8 Y hora < 17 ENTONCES
    MOSTRAR "La oficina está abierta"
SINO
    MOSTRAR "La oficina está cerrada"
FIN SI
```

### Pruebas de límite

| Hora | Resultado esperado |
|---:|---|
| -1 | Hora inválida |
| 7.59 | Cerrada |
| 8 | Abierta |
| 16.59 | Abierta |
| 17 | Cerrada |
| 24 | Hora inválida |

Los valores cercanos a los límites suelen revelar errores que un caso intermedio no muestra.

---

## 27. Ejemplo 2: descuento con dos alternativas

### Problema

Una tienda ofrece 10 % de descuento a estudiantes o personas de 65 años o más.

### Pseudocódigo

```text
LEER subtotal
LEER es_estudiante
LEER edad

SI subtotal < 0 O edad < 0 ENTONCES
    MOSTRAR "Datos inválidos"
SINO SI es_estudiante O edad ≥ 65 ENTONCES
    descuento ← subtotal * 0.10
    total ← subtotal - descuento
    MOSTRAR "Descuento aplicado"
    MOSTRAR total
SINO
    MOSTRAR "No aplica descuento"
    MOSTRAR subtotal
FIN SI
```

### Casos importantes

| Estudiante | Edad | ¿Aplica? |
|---|---:|---|
| Sí | 20 | Sí |
| No | 70 | Sí |
| Sí | 70 | Sí |
| No | 40 | No |

La palabra “o” permite que cualquiera de las condiciones sea suficiente.

---

## 28. Ejemplo 3: acceso con una condición obligatoria y dos alternativas

### Problema

Para ingresar se necesita una entrada válida. Además, la persona debe ser mayor de edad o estar acompañada.

### Descomposición

Condición obligatoria:

```text
tiene_entrada
```

Alternativas:

```text
edad ≥ 18 O esta_acompañado
```

Condición completa:

```text
tiene_entrada Y (edad ≥ 18 O esta_acompañado)
```

### Pseudocódigo

```text
LEER tiene_entrada
LEER edad
LEER esta_acompañado

SI edad < 0 ENTONCES
    MOSTRAR "Edad inválida"
SINO SI tiene_entrada Y (edad ≥ 18 O esta_acompañado) ENTONCES
    MOSTRAR "Ingreso permitido"
SINO
    MOSTRAR "Ingreso rechazado"
FIN SI
```

### Tabla de pruebas

| Entrada | Edad | Acompañada | Resultado |
|---|---:|---|---|
| Sí | 20 | No | Permitido |
| Sí | 15 | Sí | Permitido |
| Sí | 15 | No | Rechazado |
| No | 20 | Sí | Rechazado |

La entrada es obligatoria. Ser mayor o estar acompañado no sustituye ese requisito.

---

# PARTE 7 — ERRORES COMUNES

## 29. Confundir asignación y comparación

Incorrecto para hacer una pregunta:

```text
SI edad ← 18 ENTONCES
```

Corrección:

```text
SI edad = 18 ENTONCES
```

---

## 30. Dejar incompleta una comparación

Incorrecto:

```text
SI edad = 12 O 13 ENTONCES
```

El valor `13` no constituye una condición.

Corrección:

```text
SI edad = 12 O edad = 13 ENTONCES
```

---

## 31. Elegir el operador equivocado

Regla:

> Se requieren inscripción y cupo.

Incorrecto:

```text
inscripcion_confirmada O cupos_disponibles > 0
```

La expresión permitiría participar con inscripción pero sin cupo, o con cupo pero sin inscripción.

Corrección:

```text
inscripcion_confirmada Y cupos_disponibles > 0
```

---

## 32. Crear una condición imposible

```text
edad < 12 Y edad > 17
```

Una misma edad no puede ser menor que `12` y mayor que `17` al mismo tiempo.

Si se busca detectar edades fuera del rango:

```text
edad < 12 O edad > 17
```

---

## 33. Olvidar los valores límite

Regla:

> La actividad acepta desde 12 hasta 17 años, inclusive.

Incorrecto:

```text
edad > 12 Y edad < 17
```

Esta condición rechaza a quienes tienen exactamente `12` o `17`.

Corrección:

```text
edad ≥ 12 Y edad ≤ 17
```

---

## 34. Ordenar mal las alternativas

Incorrecto:

```text
SI compra ≥ 50 ENTONCES
    descuento ← 5
SINO SI compra ≥ 100 ENTONCES
    descuento ← 10
FIN SI
```

Una compra de `120` entra en la primera condición y recibe el descuento menor.

Corrección:

```text
SI compra ≥ 100 ENTONCES
    descuento ← 10
SINO SI compra ≥ 50 ENTONCES
    descuento ← 5
SINO
    descuento ← 0
FIN SI
```

---

## 35. No contemplar datos inválidos

Un algoritmo que clasifica una edad no debería aceptar `-4` como una edad normal.

Antes de aplicar las reglas del problema, pregunte:

- ¿qué valores son imposibles?
- ¿qué campos podrían estar vacíos?
- ¿qué estados no están reconocidos?
- ¿qué respuesta se dará en esos casos?

---

## 36. Anidar demasiado

Muchas decisiones dentro de otras pueden producir un esquema difícil de seguir:

```text
SI A ENTONCES
    SI B ENTONCES
        SI C ENTONCES
            ...
```

Si las tres reglas son requisitos simultáneos, podría escribirse:

```text
SI A Y B Y C ENTONCES
    ...
```

La finalidad no es reducir líneas a toda costa. Es representar correctamente la lógica y permitir que otra persona la entienda.

---

## 37. Cambiar datos aunque la decisión no lo permita

Si un cupo debe descontarse únicamente cuando se aprueba una participación, esta actualización:

```text
cupos_disponibles ← cupos_disponibles - 1
```

debe estar dentro del camino de aprobación.

Incorrecto:

```text
SI puede_participar ENTONCES
    MOSTRAR "Aprobado"
SINO
    MOSTRAR "Rechazado"
FIN SI

cupos_disponibles ← cupos_disponibles - 1
```

La versión incorrecta descuenta un cupo incluso cuando la persona es rechazada.

---

# PARTE 8 — ACTIVIDAD SIN COMPUTADORA

## 38. Cruce de caminos

### Materiales

- tres hojas con las palabras `INICIO`, `ACEPTADO` y `RECHAZADO`;
- tarjetas con preguntas;
- cuatro fichas de participantes;
- cinta adhesiva opcional.

### Preparación

Coloque las hojas en el suelo y prepare estas tarjetas:

```text
¿La edad está entre 12 y 17?
¿La inscripción está confirmada?
¿Hay al menos un cupo?
```

Fichas:

| Persona | Edad | Inscripción | Cupos |
|---|---:|---|---:|
| Ana | 14 | Sí | 3 |
| Luis | 11 | Sí | 3 |
| Marta | 16 | No | 3 |
| José | 15 | Sí | 0 |

### Instrucciones

1. Una persona representa al algoritmo.
2. Otra persona lee los datos de una ficha.
3. El “algoritmo” formula las preguntas en orden.
4. Cada respuesta conduce hacia `ACEPTADO`, `RECHAZADO` o la siguiente pregunta.
5. Repita la actividad con las cuatro fichas.
6. Cambie el orden de dos preguntas y analice si el resultado cambia.
7. Intente representar el recorrido con flechas en una hoja.

### Preguntas de reflexión

1. ¿Todas las personas recorrieron el mismo camino?
2. ¿Qué pregunta detuvo cada caso rechazado?
3. ¿Sería necesario preguntar por el cupo a una persona que no cumple la edad?
4. ¿Qué pasaría si ninguna tarjeta comprobara la inscripción?

### Aprendizaje esperado

Una decisión no es solamente una respuesta final. Es una bifurcación que crea caminos diferentes. Probar el algoritmo significa recorrer esos caminos con datos adecuados.

---

# PARTE 9 — EJERCICIOS

> Los ejercicios son práctica guiada. No se envían uno por uno. Intente resolverlos antes de abrir sus soluciones.

## 39. Ejercicio 1 — Detector de resultados

Una biblioteca utiliza estos datos:

```text
edad ← 16
libros_prestados ← 2
limite_libros ← 3
tiene_deuda ← FALSO
membresia_activa ← VERDADERO
```

Para cada expresión:

1. indique si produce `VERDADERO` o `FALSO`;
2. explique la respuesta en una oración;
3. señale el operador principal.

Expresiones:

```text
a. edad ≥ 18
b. libros_prestados < limite_libros
c. tiene_deuda
d. NO tiene_deuda
e. membresia_activa Y libros_prestados < limite_libros
f. edad ≥ 18 O membresia_activa
g. membresia_activa Y NO tiene_deuda Y libros_prestados < limite_libros
```

Finalmente, responda:

> ¿Cuál de las expresiones podría utilizarse para autorizar un nuevo préstamo si se requieren membresía activa, ausencia de deuda y espacio disponible?

---

## 40. Ejercicio 2 — Traductor de reglas

Convierta cada regla cotidiana en una condición de pseudocódigo. Utilice los nombres de variables proporcionados.

1. La persona puede votar si tiene 18 años o más.  
   Variable: `edad`

2. El envío es gratuito cuando el total es de 40 o más.  
   Variable: `total`

3. La contraseña es incorrecta cuando no coincide con la contraseña guardada.  
   Variables: `contraseña_ingresada`, `contraseña_guardada`

4. El préstamo se autoriza si la membresía está activa y la persona no tiene deuda.  
   Variables: `membresia_activa`, `tiene_deuda`

5. Hay atención desde las 8:00 hasta antes de las 17:00.  
   Variable: `hora`

6. Una nota es inválida si es menor que 0 o mayor que 100.  
   Variable: `nota`

7. La persona recibe descuento si es estudiante o si tiene 65 años o más.  
   Variables: `es_estudiante`, `edad`

8. Se permite el ingreso cuando existe una entrada válida y la persona es mayor de edad o está acompañada.  
   Variables: `entrada_valida`, `edad`, `esta_acompañada`

Después, elija dos condiciones y escriba:

- un caso que las haga verdaderas;
- un caso que las haga falsas.

---

## 41. Ejercicio 3 — Dos caminos para un envío

Una tienda cobra `4` unidades monetarias por envío. Cuando el subtotal es de `40` o más, el envío es gratuito.

Diseñe un algoritmo que:

1. lea el subtotal;
2. rechace un subtotal negativo con el mensaje `"Subtotal inválido"`;
3. asigne el costo del envío correcto;
4. calcule el total;
5. muestre el costo del envío y el total.

Debe entregar:

- entradas, proceso y salidas;
- pseudocódigo;
- una tabla de seguimiento para `subtotal ← 25`;
- una tabla de seguimiento para `subtotal ← 60`;
- el resultado esperado para `subtotal ← -3`.

Restricción:

> Utilice una decisión. No escriba dos algoritmos separados.

---

## 42. Ejercicio 4 — ¿Abierto o cerrado?

Un centro de atención funciona desde las `8:00` hasta antes de las `17:00`. La variable `hora` puede contener decimales, por ejemplo `8.5` para representar las 8:30.

Escriba un algoritmo que muestre:

- `"Hora inválida"` si la hora es menor que 0 o igual o mayor que 24;
- `"Abierto"` si está dentro del horario;
- `"Cerrado"` en cualquier otro caso válido.

Luego complete la tabla:

| Hora | Condición evaluada | Resultado esperado |
|---:|---|---|
| -0.5 |  |  |
| 0 |  |  |
| 7.99 |  |  |
| 8 |  |  |
| 12.5 |  |  |
| 16.99 |  |  |
| 17 |  |  |
| 23.99 |  |  |
| 24 |  |  |

Finalmente, explique por qué `hora ≥ 8 O hora < 17` no representa correctamente el horario.

---

## 43. Ejercicio 5 — El clasificador mal ordenado

Una academia utiliza estas categorías:

- de 90 a 100: `"Excelente"`;
- de 70 a 89: `"Aprobada"`;
- de 0 a 69: `"Necesita mejorar"`;
- cualquier valor menor que 0 o mayor que 100: `"Nota inválida"`.

Observe este ejemplo:

```text
LEER nota

SI nota ≥ 70 ENTONCES
    MOSTRAR "Aprobada"
SINO SI nota ≥ 90 ENTONCES
    MOSTRAR "Excelente"
SINO
    MOSTRAR "Necesita mejorar"
FIN SI
```

Realice estas tareas:

1. Ejecute mentalmente el algoritmo con `95`. ¿Qué muestra?
2. Explique por qué el resultado es incorrecto.
3. Identifique qué casos inválidos fueron olvidados.
4. Reescriba el pseudocódigo completo en el orden correcto.
5. Compruebe su versión con `-1`, `0`, `69`, `70`, `89`, `90`, `100` y `101`.
6. Dibuje un árbol de decisiones sencillo para su solución.

---

## 44. Ejercicio 6 — Entrada al cine

Un cine aplica estas reglas:

- toda persona debe tener una entrada válida;
- una persona de 15 años o más puede ingresar sin acompañante;
- una persona menor de 15 años solo puede ingresar si está acompañada;
- una edad negativa se considera inválida.

Diseñe una única condición compuesta que determine si el ingreso está permitido.

Después:

1. escriba el pseudocódigo completo;
2. incluya una respuesta específica para la edad inválida;
3. complete la tabla;
4. explique por qué tener acompañante no sustituye la entrada.

| Entrada válida | Edad | Acompañada | Resultado |
|---|---:|---|---|
| Sí | 18 | No |  |
| Sí | 12 | Sí |  |
| Sí | 12 | No |  |
| No | 20 | No |  |
| No | 12 | Sí |  |
| Sí | -2 | Sí |  |

---

## 45. Ejercicio 7 — Préstamo de bicicletas

Una estación presta bicicletas únicamente cuando:

- la membresía está activa;
- hay al menos una bicicleta disponible;
- la persona no tiene deuda.

Si no se autoriza el préstamo, el sistema debe mostrar una razón siguiendo este orden:

1. `"Membresía inactiva"`;
2. `"No hay bicicletas disponibles"`;
3. `"Existe una deuda pendiente"`.

Si todo se cumple:

- mostrar `"Préstamo autorizado"`;
- restar una bicicleta disponible.

Realice:

1. un diccionario con las variables necesarias;
2. una tabla de decisiones con al menos cinco combinaciones;
3. pseudocódigo con las condiciones en el orden indicado;
4. un diagrama de flujo;
5. una prueba con membresía activa, `2` bicicletas y sin deuda;
6. una prueba con membresía activa, `0` bicicletas y sin deuda;
7. una explicación de por qué la cantidad de bicicletas solo debe actualizarse en el camino de autorización.

---

# PARTE 10 — RETOS

## 46. Reto 1 — La condición que casi siempre acepta

Una persona quiso comprobar si una hora estaba dentro del horario de 8:00 a 17:00 y escribió:

```text
hora ≥ 8 O hora ≤ 17
```

Sin cambiar todavía el operador:

1. pruebe la condición con `6`, `10`, `20` y `100`;
2. explique por qué todos esos valores producen `VERDADERO`;
3. encuentre un número que haga falsa la expresión completa o demuestre por qué no existe;
4. escriba la condición correcta para incluir las 8:00 y excluir las 17:00;
5. escriba otra condición que detecte las horas fuera de ese horario;
6. explique con sus palabras la relación entre ambas condiciones.

---

## 47. Reto 2 — Dos diseños para la misma regla

Regla:

> Una persona puede participar si tiene 18 años o más, su inscripción está confirmada y hay al menos un cupo.

Diseñe dos versiones:

### Versión A

Utilice decisiones anidadas. Cada pregunta debe aparecer dentro del camino verdadero de la pregunta anterior.

### Versión B

Utilice una sola condición compuesta con el operador `Y`.

Después:

1. pruebe ambas versiones con tres casos;
2. confirme si siempre producen el mismo resultado;
3. indique cuál se entiende con mayor facilidad;
4. explique una ventaja de la versión anidada;
5. explique una ventaja de la condición compuesta.

No existe una respuesta universal para la pregunta 3. La explicación debe relacionarse con la claridad de la regla.

---

# PARTE 11 — MINI PROYECTO

## 48. Sistema de decisiones para una actividad

### Situación

Un centro comunitario organiza un **taller de robótica juvenil**. El sistema debe decidir si una persona puede participar.

### Datos de entrada

```text
edad
inscripcion_confirmada
cupos_disponibles
```

### Reglas y prioridad

Las reglas deben evaluarse en este orden:

1. Si la edad es menor que `0` o mayor que `120`, mostrar `"Edad inválida"`.
2. La actividad acepta personas de `12` a `17` años, incluidos ambos límites. Si no cumple, mostrar `"No cumple el rango de edad"`.
3. Si la inscripción no está confirmada, mostrar `"Inscripción no confirmada"`.
4. Si los cupos disponibles son `0` o menos, mostrar `"Sin cupo: agregar a lista de espera"`.
5. Si supera todas las comprobaciones:
   - mostrar `"Participación aprobada"`;
   - restar un cupo disponible;
   - mostrar la nueva cantidad de cupos.

### Alcance

- El proyecto procesa a una sola persona.
- No utiliza ciclos ni listas.
- No requiere un lenguaje de programación.
- Puede realizarse en papel, en un documento o con PSeInt.
- El diagrama puede dibujarse a mano o en una herramienta digital.

---

## 49. Entregables del mini proyecto

### Parte 1 — Comprensión del problema

Escriba:

- cuál es la decisión principal;
- cuáles son las entradas;
- cuáles son las salidas posibles;
- por qué las reglas tienen un orden.

### Parte 2 — Diccionario de variables

Complete una tabla como esta:

| Variable | Significado | Clase de dato | Ejemplo |
|---|---|---|---|
| `edad` |  |  |  |
| `inscripcion_confirmada` |  |  |  |
| `cupos_disponibles` |  |  |  |

Puede agregar variables si su diseño realmente las necesita.

### Parte 3 — Tabla de reglas

Organice las decisiones:

| Prioridad | Pregunta | Acción si se cumple |
|---:|---|---|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |
| 5 | Caso restante |  |

### Parte 4 — Algoritmo numerado

Explique la solución mediante pasos escritos con lenguaje cotidiano. Los pasos deben ser suficientemente precisos para que otra persona pueda seguirlos sin inventar reglas.

### Parte 5 — Pseudocódigo

Escriba el algoritmo completo utilizando:

- `LEER`;
- `SI`;
- `SINO SI`;
- `SINO`;
- `FIN SI`;
- `MOSTRAR`;
- `←` para la actualización del cupo.

No se exige una sintaxis rígida de un programa particular. Sí se exige que las condiciones, caminos y finales sean claros.

### Parte 6 — Diagrama de flujo

El diagrama debe incluir:

- inicio;
- lectura de las tres entradas;
- rombos para las decisiones;
- etiquetas `Sí` y `No`;
- mensajes de rechazo;
- actualización del cupo únicamente en la aprobación;
- final para todos los caminos.

### Parte 7 — Pruebas obligatorias

Complete la salida y el camino recorrido:

| Caso | Edad | Inscripción | Cupos | Salida esperada | Cupos finales |
|---:|---:|---|---:|---|---:|
| A | 14 | Sí | 3 |  |  |
| B | 11 | Sí | 3 |  |  |
| C | 15 | No | 3 |  |  |
| D | 16 | Sí | 0 |  |  |
| E | -2 | Sí | 3 |  |  |

Para el caso A, agregue una tabla de seguimiento paso a paso.

### Parte 8 — Reflexión

Responda en tres a cinco oraciones:

1. ¿Qué error podría ocurrir si se revisara el cupo después de aprobar a la persona?
2. ¿Por qué el cupo solo se resta en uno de los caminos?
3. ¿Qué caso nuevo agregaría para comprobar el límite superior de edad?

---

## 50. Lista de verificación antes de entregar

Marque cada elemento:

```text
[ ] Identifiqué entradas y salidas.
[ ] Utilicé los límites 12 y 17 de forma inclusiva.
[ ] Detecté edades menores que 0 y mayores que 120.
[ ] Revisé inscripción y cupo.
[ ] Respeté la prioridad de las reglas.
[ ] Cada caso produce un mensaje.
[ ] El cupo solo se resta cuando la participación se aprueba.
[ ] Mi pseudocódigo tiene un cierre claro.
[ ] Mi diagrama indica Sí y No en cada decisión.
[ ] Probé los cinco casos obligatorios.
[ ] El pseudocódigo y el diagrama representan la misma solución.
[ ] El archivo se puede leer con claridad.
```

---

## 51. Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Comprensión del problema y organización de reglas | 15 |
| Condiciones, rangos y operadores correctos | 20 |
| Pseudocódigo completo y coherente | 20 |
| Diagrama de flujo equivalente al pseudocódigo | 15 |
| Orden de decisiones y tratamiento de casos inválidos | 10 |
| Pruebas y cobertura de caminos | 15 |
| Claridad de la presentación y reflexión | 5 |
| **Total** | **100** |

### Criterios de dominio

| Resultado | Interpretación |
|---:|---|
| 90–100 | Dominio sólido |
| 75–89 | Logro satisfactorio |
| 60–74 | Requiere corregir algunos caminos |
| Menos de 60 | Conviene repasar las decisiones antes del Módulo 4 |

---

## 52. Punto de entrega

Se utiliza **un solo punto de entrega para todo el mini proyecto**. Los siete ejercicios y los dos retos sirven para practicar y no necesitan formularios separados.

### Archivo

Reúna las ocho partes del proyecto en un único archivo PDF.

Nombre recomendado:

```text
Modulo3_Nombre_Apellido.pdf
```

El archivo puede contener:

- texto escrito en computadora;
- tablas;
- un diagrama digital;
- fotografías o capturas claras del trabajo hecho a mano.

Revise que las imágenes no estén borrosas, cortadas, giradas o demasiado oscuras.

### Indicación para el formulario

En el campo de título o descripción escriba:

```text
Módulo 3 — Sistema de decisiones — Nombre y apellido
```

Formulario de entrega:

[Entregar el mini proyecto del Módulo 3](https://forms.gle/BayPBDiXAGurWjnL6)

> No envíe un formulario por cada ejercicio. Envíe únicamente el mini proyecto completo cuando esté terminado.

---

# PARTE 12 — SOLUCIONES EXPLICADAS

## 53. Solución del diagnóstico

Preguntas posibles, en un orden razonable:

```text
1. ¿La piscina está abierta?
2. ¿La entrada es válida?
3. Si la persona tiene menos de 12 años, ¿está acompañada?
```

- Una persona de 10 años con entrada válida no puede ingresar sola.
- Una persona de 15 años sin entrada válida no puede ingresar.
- A las 17:00 debería estar cerrada si la regla significa “hasta antes de las 17:00”.
- La frase original “de las 8:00 a las 17:00” puede ser ambigua sobre si las 17:00 están incluidas. Una regla computacional debe aclararlo.

---

## 54. Solución del ejercicio 1

| Expresión | Resultado | Razón | Operador principal |
|---|---|---|---|
| `edad ≥ 18` | FALSO | 16 no es igual ni mayor que 18 | `≥` |
| `libros_prestados < limite_libros` | VERDADERO | 2 es menor que 3 | `<` |
| `tiene_deuda` | FALSO | Ese es el valor guardado | variable lógica |
| `NO tiene_deuda` | VERDADERO | `NO` invierte FALSO | `NO` |
| `membresia_activa Y libros_prestados < limite_libros` | VERDADERO | Ambas partes son verdaderas | `Y` |
| `edad ≥ 18 O membresia_activa` | VERDADERO | La membresía está activa | `O` |
| `membresia_activa Y NO tiene_deuda Y libros_prestados < limite_libros` | VERDADERO | Se cumplen los tres requisitos | `Y` |

La expresión apropiada para autorizar el préstamo es:

```text
membresia_activa Y NO tiene_deuda Y libros_prestados < limite_libros
```

---

## 55. Solución del ejercicio 2

```text
1. edad ≥ 18

2. total ≥ 40

3. contraseña_ingresada ≠ contraseña_guardada

4. membresia_activa Y NO tiene_deuda

5. hora ≥ 8 Y hora < 17

6. nota < 0 O nota > 100

7. es_estudiante O edad ≥ 65

8. entrada_valida Y (edad ≥ 18 O esta_acompañada)
```

Ejemplo de casos para la condición 8:

- Verdadera: entrada válida, edad 16 y acompañada.
- Falsa: entrada inválida, edad 30 y acompañada.

Aunque la persona del segundo caso cumple la edad, la entrada sigue siendo un requisito obligatorio.

---

## 56. Solución del ejercicio 3

### Entrada, proceso y salida

```text
ENTRADA
subtotal

PROCESO
validar el subtotal
determinar el costo de envío
calcular el total

SALIDAS
mensaje de error, o costo de envío y total
```

### Pseudocódigo

```text
LEER subtotal

SI subtotal < 0 ENTONCES
    MOSTRAR "Subtotal inválido"
SINO
    SI subtotal ≥ 40 ENTONCES
        envio ← 0
    SINO
        envio ← 4
    FIN SI

    total ← subtotal + envio
    MOSTRAR envio
    MOSTRAR total
FIN SI
```

### Resultados

| Subtotal | Envío | Total |
|---:|---:|---:|
| 25 | 4 | 29 |
| 60 | 0 | 60 |

Para `-3`, la salida es `"Subtotal inválido"` y no se calcula un total.

---

## 57. Solución del ejercicio 4

```text
LEER hora

SI hora < 0 O hora ≥ 24 ENTONCES
    MOSTRAR "Hora inválida"
SINO SI hora ≥ 8 Y hora < 17 ENTONCES
    MOSTRAR "Abierto"
SINO
    MOSTRAR "Cerrado"
FIN SI
```

| Hora | Resultado esperado |
|---:|---|
| -0.5 | Hora inválida |
| 0 | Cerrado |
| 7.99 | Cerrado |
| 8 | Abierto |
| 12.5 | Abierto |
| 16.99 | Abierto |
| 17 | Cerrado |
| 23.99 | Cerrado |
| 24 | Hora inválida |

`hora ≥ 8 O hora < 17` es incorrecta porque cualquier hora que falle una parte suele cumplir la otra. Para estar dentro del horario deben cumplirse simultáneamente los dos límites.

---

## 58. Solución del ejercicio 5

El algoritmo original muestra `"Aprobada"` para `95` porque la condición `nota ≥ 70` es verdadera y evita que se revise la categoría excelente.

```text
LEER nota

SI nota < 0 O nota > 100 ENTONCES
    MOSTRAR "Nota inválida"
SINO SI nota ≥ 90 ENTONCES
    MOSTRAR "Excelente"
SINO SI nota ≥ 70 ENTONCES
    MOSTRAR "Aprobada"
SINO
    MOSTRAR "Necesita mejorar"
FIN SI
```

| Nota | Resultado |
|---:|---|
| -1 | Nota inválida |
| 0 | Necesita mejorar |
| 69 | Necesita mejorar |
| 70 | Aprobada |
| 89 | Aprobada |
| 90 | Excelente |
| 100 | Excelente |
| 101 | Nota inválida |

Árbol resumido:

```text
¿nota inválida?
├── Sí → Nota inválida
└── No
    └── ¿nota ≥ 90?
        ├── Sí → Excelente
        └── No
            └── ¿nota ≥ 70?
                ├── Sí → Aprobada
                └── No → Necesita mejorar
```

---

## 59. Solución del ejercicio 6

Condición de ingreso:

```text
entrada_valida Y (edad ≥ 15 O esta_acompañada)
```

Pseudocódigo:

```text
LEER entrada_valida
LEER edad
LEER esta_acompañada

SI edad < 0 ENTONCES
    MOSTRAR "Edad inválida"
SINO SI entrada_valida Y (edad ≥ 15 O esta_acompañada) ENTONCES
    MOSTRAR "Ingreso permitido"
SINO
    MOSTRAR "Ingreso rechazado"
FIN SI
```

| Entrada válida | Edad | Acompañada | Resultado |
|---|---:|---|---|
| Sí | 18 | No | Permitido |
| Sí | 12 | Sí | Permitido |
| Sí | 12 | No | Rechazado |
| No | 20 | No | Rechazado |
| No | 12 | Sí | Rechazado |
| Sí | -2 | Sí | Edad inválida |

El acompañamiento es una alternativa a cumplir la edad mínima para ingresar sin acompañante. No es una alternativa a comprar o presentar la entrada.

---

## 60. Solución del ejercicio 7

### Diccionario

| Variable | Significado | Clase |
|---|---|---|
| `membresia_activa` | Indica si la membresía está vigente | Lógico |
| `bicicletas_disponibles` | Cantidad de bicicletas que pueden prestarse | Numérico |
| `tiene_deuda` | Indica si existe deuda pendiente | Lógico |

### Pseudocódigo

```text
LEER membresia_activa
LEER bicicletas_disponibles
LEER tiene_deuda

SI NO membresia_activa ENTONCES
    MOSTRAR "Membresía inactiva"
SINO SI bicicletas_disponibles ≤ 0 ENTONCES
    MOSTRAR "No hay bicicletas disponibles"
SINO SI tiene_deuda ENTONCES
    MOSTRAR "Existe una deuda pendiente"
SINO
    MOSTRAR "Préstamo autorizado"
    bicicletas_disponibles ← bicicletas_disponibles - 1
    MOSTRAR bicicletas_disponibles
FIN SI
```

Pruebas:

- membresía activa, 2 bicicletas y sin deuda: préstamo autorizado; queda 1 bicicleta;
- membresía activa, 0 bicicletas y sin deuda: no hay bicicletas; la cantidad se mantiene en 0.

La actualización debe estar dentro del camino de autorización porque un rechazo no realiza ningún préstamo.

---

## 61. Solución del reto 1

Para:

```text
hora ≥ 8 O hora ≤ 17
```

- `6`: la segunda parte es verdadera;
- `10`: ambas partes son verdaderas;
- `20`: la primera parte es verdadera;
- `100`: la primera parte es verdadera.

No existe un número que sea simultáneamente menor que `8` y mayor que `17`. Por eso la expresión completa nunca es falsa para un valor numérico.

Dentro del horario:

```text
hora ≥ 8 Y hora < 17
```

Fuera del horario:

```text
hora < 8 O hora ≥ 17
```

La segunda condición representa los casos en los que la primera es falsa.

---

## 62. Solución del reto 2

### Versión A — Anidada

```text
SI edad ≥ 18 ENTONCES
    SI inscripcion_confirmada ENTONCES
        SI cupos_disponibles > 0 ENTONCES
            MOSTRAR "Puede participar"
        SINO
            MOSTRAR "No puede participar"
        FIN SI
    SINO
        MOSTRAR "No puede participar"
    FIN SI
SINO
    MOSTRAR "No puede participar"
FIN SI
```

### Versión B — Compuesta

```text
SI edad ≥ 18 Y inscripcion_confirmada Y cupos_disponibles > 0 ENTONCES
    MOSTRAR "Puede participar"
SINO
    MOSTRAR "No puede participar"
FIN SI
```

Las dos versiones producen la misma decisión si se escriben correctamente.

- La versión compuesta es más corta y muestra que los tres requisitos son simultáneos.
- La versión anidada permite dar una razón específica en cada rechazo o evitar preguntas innecesarias después de detectar un incumplimiento.

---

## 63. Solución de referencia del mini proyecto

> Esta es una solución posible. Puede utilizar otra estructura si respeta todas las reglas y produce los mismos resultados.

### Comprensión

La decisión principal es determinar si una persona puede participar. Primero deben descartarse edades inválidas y personas fuera del rango. Después se revisan inscripción y cupo. Solo el camino que supera todas las preguntas aprueba y actualiza la cantidad de cupos.

### Diccionario

| Variable | Significado | Clase de dato | Ejemplo |
|---|---|---|---|
| `edad` | Edad de la persona | Numérico entero | `14` |
| `inscripcion_confirmada` | Indica si completó la inscripción | Lógico | `VERDADERO` |
| `cupos_disponibles` | Lugares libres antes y después de la decisión | Numérico entero | `3` |

### Algoritmo numerado

1. Leer la edad.
2. Leer si la inscripción está confirmada.
3. Leer la cantidad de cupos disponibles.
4. Comprobar si la edad es inválida.
5. Si es válida, comprobar si está entre 12 y 17 años.
6. Si cumple la edad, comprobar la inscripción.
7. Si está inscrita, comprobar que exista al menos un cupo.
8. Si no hay cupo, enviarla a la lista de espera.
9. Si todo se cumple, aprobar la participación.
10. Restar un cupo y mostrar la nueva cantidad.
11. Finalizar.

### Pseudocódigo

```text
INICIO
    LEER edad
    LEER inscripcion_confirmada
    LEER cupos_disponibles

    SI edad < 0 O edad > 120 ENTONCES
        MOSTRAR "Edad inválida"
    SINO SI edad < 12 O edad > 17 ENTONCES
        MOSTRAR "No cumple el rango de edad"
    SINO SI NO inscripcion_confirmada ENTONCES
        MOSTRAR "Inscripción no confirmada"
    SINO SI cupos_disponibles ≤ 0 ENTONCES
        MOSTRAR "Sin cupo: agregar a lista de espera"
    SINO
        MOSTRAR "Participación aprobada"
        cupos_disponibles ← cupos_disponibles - 1
        MOSTRAR cupos_disponibles
    FIN SI
FIN
```

### Diagrama lógico de referencia

```text
INICIO
  ↓
LEER edad, inscripción y cupos
  ↓
¿edad < 0 O edad > 120?
  ├── Sí → MOSTRAR "Edad inválida" → FIN
  └── No
       ↓
¿edad < 12 O edad > 17?
  ├── Sí → MOSTRAR "No cumple el rango de edad" → FIN
  └── No
       ↓
¿NO inscripción confirmada?
  ├── Sí → MOSTRAR "Inscripción no confirmada" → FIN
  └── No
       ↓
¿cupos ≤ 0?
  ├── Sí → MOSTRAR "Sin cupo: lista de espera" → FIN
  └── No
       ↓
MOSTRAR "Participación aprobada"
  ↓
cupos ← cupos - 1
  ↓
MOSTRAR cupos
  ↓
FIN
```

### Pruebas

| Caso | Edad | Inscripción | Cupos | Salida esperada | Cupos finales |
|---:|---:|---|---:|---|---:|
| A | 14 | Sí | 3 | Participación aprobada | 2 |
| B | 11 | Sí | 3 | No cumple el rango de edad | 3 |
| C | 15 | No | 3 | Inscripción no confirmada | 3 |
| D | 16 | Sí | 0 | Sin cupo: agregar a lista de espera | 0 |
| E | -2 | Sí | 3 | Edad inválida | 3 |

### Seguimiento del caso A

| Paso | Comprobación o acción | Resultado |
|---:|---|---|
| 1 | `14 < 0 O 14 > 120` | FALSO |
| 2 | `14 < 12 O 14 > 17` | FALSO |
| 3 | `NO VERDADERO` | FALSO |
| 4 | `3 ≤ 0` | FALSO |
| 5 | Mostrar aprobación | Participación aprobada |
| 6 | `cupos_disponibles ← 3 - 1` | 2 |

Un caso adicional importante es `edad ← 17`, porque comprueba que el límite superior sí está incluido.

---

# PARTE 13 — EVALUACIÓN

## 64. Evaluación de dominio

### Pregunta 1

¿Qué resultado produce una condición?

a. Un número necesariamente  
b. `VERDADERO` o `FALSO`  
c. Una repetición  
d. Un diagrama

### Pregunta 2

¿Cuál condición representa “de 10 a 20, incluidos los límites”?

a. `valor > 10 O valor < 20`  
b. `valor ≥ 10 Y valor ≤ 20`  
c. `valor ≥ 10 O valor ≤ 20`  
d. `valor < 10 Y valor > 20`

### Pregunta 3

Si `A` es verdadero y `B` es falso, ¿qué produce `A Y B`?

a. VERDADERO  
b. FALSO  
c. 1  
d. No puede saberse

### Pregunta 4

Si `A` es verdadero y `B` es falso, ¿qué produce `A O B`?

a. VERDADERO  
b. FALSO  
c. Un error  
d. Ninguna salida

### Pregunta 5

¿Por qué se revisa `nota ≥ 90` antes de `nota ≥ 70`?

a. Porque 90 es un número más fácil  
b. Porque una nota alta cumple ambas condiciones y debe tomar la categoría más específica  
c. Porque el orden nunca importa  
d. Porque elimina la necesidad de validar

### Pregunta 6

¿Cuál es la figura habitual para una decisión en un diagrama de flujo?

a. Rectángulo  
b. Rombo  
c. Óvalo  
d. Círculo

### Pregunta 7

¿Qué error existe en esta condición?

```text
edad = 12 O 13
```

a. Falta comparar nuevamente la edad con 13  
b. Debería utilizar una repetición  
c. No se pueden comparar edades  
d. No existe ningún error

### Pregunta 8

En un sistema de cupos, ¿cuándo debe restarse un cupo?

a. Siempre al comenzar  
b. Tanto al aprobar como al rechazar  
c. Únicamente en el camino que confirma la participación  
d. Después de finalizar el algoritmo

---

## 65. Respuestas de la evaluación

| Pregunta | Respuesta | Explicación breve |
|---:|---|---|
| 1 | b | Una condición responde una pregunta lógica |
| 2 | b | Los dos límites deben cumplirse |
| 3 | b | `Y` exige que ambas partes sean verdaderas |
| 4 | a | `O` necesita al menos una parte verdadera |
| 5 | b | La primera condición verdadera es la que gana |
| 6 | b | El rombo representa una decisión |
| 7 | a | `13` por sí solo no es una condición |
| 8 | c | Solo una aprobación utiliza realmente el cupo |

### Criterio recomendado

- **7 u 8 respuestas correctas:** puede avanzar.
- **5 o 6 respuestas correctas:** revise operadores, rangos y orden.
- **4 o menos:** repita los ejercicios 2, 4 y 5 antes del mini proyecto.

---

## 66. Autoevaluación

Marque la opción que mejor describa su dominio.

| Habilidad | Sí | Todavía practico | No |
|---|:---:|:---:|:---:|
| Puedo convertir una regla en una condición |  |  |  |
| Distingo entre asignar y comparar |  |  |  |
| Sé cuándo utilizar `Y` |  |  |  |
| Sé cuándo utilizar `O` |  |  |  |
| Comprendo cómo funciona `NO` |  |  |  |
| Puedo escribir un rango con sus límites correctos |  |  |  |
| Puedo ordenar tres o más alternativas |  |  |  |
| Detecto datos inválidos y casos olvidados |  |  |  |
| Puedo dibujar un rombo con caminos Sí y No |  |  |  |
| Puedo probar todos los caminos importantes |  |  |  |

Si marca “No” en tres o más habilidades, revise las secciones correspondientes antes de avanzar.

---

# PARTE 14 — RECURSOS

## 67. Video opcional sobre decisiones en diagramas

[Estructuras condicionales (if) (if - else), Diagramas de Flujo — PrograMate](https://www.youtube.com/watch?v=aFQHlKGDEoM)

**Duración:** 4 minutos y 3 segundos  
**Tema exacto:** Condiciones simples y dobles representadas con diagramas de flujo  

---

## 68. Lecturas y documentación

### Lectura esencial breve

[Condicionales — Aula en Abierto, INTEF](https://formacion.intef.es/aulaenabierto/mod/book/tool/print/index.php?id=4120)

Utilidad:

- repasar la idea de elegir instrucciones según una condición;
- reconocer decisiones simples, dobles y con varias alternativas;
- observar ejemplos educativos.

### Consulta de pseudocódigo

[Algoritmos y pseudocódigo — Aula en Abierto, INTEF](https://formacion.intef.es/aulaenabierto/mod/book/tool/print/index.php?chapterid=5348&id=4100)

Utilidad:

- confirmar que el pseudocódigo no tiene una única sintaxis universal;
- repasar la estructura `SI`, `ENTONCES`, `SINO` y `FIN SI`;
- concentrarse en la claridad del algoritmo.

### Referencia de PSeInt

[Documentación de pseudocódigo de PSeInt](https://pseint.sourceforge.net/index.php?page=pseudocodigo.php)

Utilidad:

- consultar cómo escribir condicionales si se decide practicar con PSeInt;
- comprobar operadores y estructuras;
- ejecutar pruebas sin aprender todavía un lenguaje de programación.

### Ampliación opcional

[Tomando decisiones en tu código: condicionales — MDN Web Docs](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Conditionals)

Esta lectura usa JavaScript. No es necesario aprender su sintaxis. Lea únicamente las explicaciones conceptuales sobre decisiones y operadores lógicos si desea ampliar.

### Herramienta opcional para diagramas

[diagrams.net](https://app.diagrams.net/)

Permite construir el diagrama de flujo del proyecto. También se acepta un diagrama claro dibujado a mano.

---

# PARTE 15 — GLOSARIO

## 69. Conceptos del módulo

| Concepto | Explicación sencilla |
|---|---|
| Comparación | Pregunta que relaciona dos valores |
| Condición | Expresión que produce verdadero o falso |
| Valor lógico | Uno de los dos resultados: `VERDADERO` o `FALSO` |
| Decisión simple | Ejecuta una acción solo si la condición se cumple |
| Decisión doble | Elige entre un camino verdadero y uno falso |
| Alternativa | Uno de los caminos posibles |
| `Y` | Exige que todas las condiciones combinadas sean verdaderas |
| `O` | Exige que al menos una condición sea verdadera |
| `NO` | Invierte un valor lógico |
| Rango | Intervalo delimitado por un mínimo y un máximo |
| Límite inclusivo | Valor extremo que sí pertenece al rango |
| Límite exclusivo | Valor extremo que no pertenece al rango |
| Decisión anidada | Decisión colocada dentro de otra |
| Caso inválido | Entrada que no puede aceptarse como dato normal |
| Caso no contemplado | Situación para la cual el algoritmo no definió respuesta |
| Camino | Secuencia de acciones recorrida según los resultados de las condiciones |
| Tabla de decisiones | Tabla que relaciona combinaciones de condiciones con acciones |
| Prueba de límite | Prueba realizada justo antes, en y después de un extremo |

---

# PARTE 16 — CIERRE

## 70. Resumen visual

```text
REGLA COTIDIANA
      ↓
DATOS NECESARIOS
      ↓
COMPARACIONES
      ↓
CONDICIONES COMBINADAS
      ↓
┌───────────────┐
│ ¿VERDADERO?   │
└───────┬───────┘
     Sí │ No
        ↓
CAMINOS DIFERENTES
      ↓
RESPUESTA PARA CADA CASO
      ↓
PRUEBAS NORMALES, LÍMITE E INVÁLIDAS
```

### Siete ideas fundamentales

1. Una condición siempre produce `VERDADERO` o `FALSO`.
2. Una decisión utiliza ese resultado para elegir un camino.
3. `Y` exige todos los requisitos; `O` acepta alternativas; `NO` invierte.
4. Los rangos interiores suelen unir sus límites con `Y`.
5. El orden importa cuando varias condiciones pueden cumplirse.
6. Un buen algoritmo responde también a datos inválidos o inesperados.
7. Una decisión no está terminada hasta probar sus caminos y sus límites.

---

## 71. Habilidades obtenidas

Al completar el módulo, habrá desarrollado:

- razonamiento condicional;
- traducción de reglas cotidianas a expresiones lógicas;
- construcción de decisiones simples, dobles y múltiples;
- manejo práctico de operadores lógicos;
- análisis de rangos y límites;
- priorización de reglas;
- detección de condiciones contradictorias o incompletas;
- representación mediante pseudocódigo, diagramas y tablas;
- diseño de casos de prueba;
- explicación clara de por qué un algoritmo toma una decisión.

---

## 72. Puente hacia el Módulo 4

Hasta ahora, el algoritmo puede tomar una decisión para una situación:

```text
¿La persona cumple los requisitos?
```

Pero ¿qué ocurre si necesitamos aplicar la misma lógica a:

- 30 participantes;
- todos los productos de una compra;
- cada intento de una persona;
- una acción que debe repetirse hasta cumplir una condición?

Reescribir las mismas instrucciones muchas veces no es una buena solución.

El Módulo 4 estudiará cómo expresar repeticiones de forma controlada, comprender cuándo terminan y evitar ciclos que nunca finalizan.

---

# FIN DEL MÓDULO 3

**No avanzar al Módulo 4 hasta que el Módulo 3 sea revisado y aprobado.**
