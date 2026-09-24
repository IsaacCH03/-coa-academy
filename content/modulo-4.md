# COA — Lógica de Programación

# Módulo 4: Repeticiones

**Duración obligatoria:** 3 horas  
**Nivel:** Principiante absoluto  
**Conocimientos previos:** Módulos 1, 2 y 3 aprobados  
**Modalidad:** Práctica, independiente de cualquier lenguaje  
**Materiales:** Papel, lápiz y calculadora sencilla opcional  
**Herramientas opcionales:** PSeInt o un editor de texto

---

## 1. Objetivo del módulo

Construir algoritmos que repitan acciones de forma controlada, comprendiendo cuántas veces se ejecutan, por qué terminan y cómo conservan resultados entre una repetición y la siguiente.

Al terminar el módulo, podrá:

- reconocer cuándo un problema necesita una repetición;
- identificar el bloque de instrucciones que debe repetirse;
- explicar qué es una iteración;
- diferenciar repeticiones de cantidad conocida y repeticiones controladas por una condición;
- construir ciclos de tipo `PARA`, `MIENTRAS` y `REPETIR HASTA QUE` en pseudocódigo;
- identificar inicio, condición, cuerpo, actualización y salida;
- utilizar contadores y acumuladores;
- calcular totales, cantidades y promedios mediante repeticiones;
- utilizar un valor centinela para finalizar una entrada de datos;
- validar datos mediante repetición;
- combinar decisiones y repeticiones;
- seguir un ciclo mediante una tabla de rastreo;
- detectar errores de límites;
- reconocer y corregir ciclos infinitos;
- diseñar casos de prueba para cero, una y varias iteraciones.

> Este módulo no enseña los bucles de un lenguaje específico. Las palabras `PARA`, `MIENTRAS` y `REPETIR` se utilizan como pseudocódigo para representar ideas que existen en prácticamente todos los lenguajes.

---

## 2. Distribución del tiempo

| Sección | Tiempo |
|---|---:|
| Activación y video inicial | 10 min |
| Concepto y anatomía de una repetición | 20 min |
| Repeticiones de cantidad conocida | 20 min |
| Repeticiones controladas por condición | 30 min |
| Contadores, acumuladores y centinelas | 25 min |
| Ejemplos, actividad y ejercicios | 35 min |
| Retos | 10 min |
| Mini proyecto | 25 min |
| Evaluación y cierre | 5 min |
| **Total** | **180 min** |

## 3. Mapa del aprendizaje

```text
ACCIÓN QUE SE REPITE
        ↓
¿CUÁNTAS VECES O HASTA CUÁNDO?
        ↓
INICIO → CONDICIÓN → CUERPO → ACTUALIZACIÓN
             ↑                    │
             └────────────────────┘
        ↓ CUANDO LA CONDICIÓN TERMINA
SALIDA DEL CICLO
        ↓
RESULTADO FINAL
```

---

# PARTE 1 — ACTIVACIÓN

## 4. Pregunta guía

> ¿Cómo puede un algoritmo realizar una misma tarea muchas veces sin copiar la misma instrucción una y otra vez?

Imagine que debe mostrar la tabla del número 7.

Una solución repetitiva y difícil de mantener sería:

```text
MOSTRAR 7 * 1
MOSTRAR 7 * 2
MOSTRAR 7 * 3
MOSTRAR 7 * 4
MOSTRAR 7 * 5
MOSTRAR 7 * 6
MOSTRAR 7 * 7
MOSTRAR 7 * 8
MOSTRAR 7 * 9
MOSTRAR 7 * 10
```

Todas las líneas representan la misma acción:

```text
MOSTRAR 7 * multiplicador
```

Lo único que cambia es el valor de `multiplicador`.

Una repetición permite expresar:

```text
Repetir la misma acción usando los valores del 1 al 10.
```

El objetivo no es únicamente escribir menos. Es describir el patrón con claridad y poder cambiarlo sin reescribir muchas instrucciones.

---

## 5. Diagnóstico inicial sin calificación

Una persona guarda dinero hasta reunir 100 unidades monetarias. Realiza estos aportes:

```text
20, 15, 30, 10, 25
```

Responda sin pseudocódigo:

1. ¿Qué acción se repite con cada aporte?
2. ¿Qué cantidad cambia después de cada aporte?
3. ¿Cómo sabe la persona cuándo debe dejar de ahorrar?
4. ¿Cuántos aportes realizó?
5. ¿Qué ocurriría si un aporte fuera negativo?
6. ¿La persona conoce de antemano cuántos aportes necesitará?

### Propósito

En este problema aparecen los elementos centrales del módulo:

- una acción repetida;
- un total que se actualiza;
- una cantidad de aportes;
- una condición de salida;
- un número de repeticiones que no se conoce al comenzar.

---

## 6. Video introductorio obligatorio

[Ciclo MIENTRAS (WHILE) en PSeInt — Charly Cimino](https://www.youtube.com/watch?v=9Isa3Bfp4cA)

**Duración:** 4 minutos y 58 segundos  
**Tema exacto:** Repetición mientras una condición sea verdadera y prevención de ciclos infinitos  
**Antes de continuar:** Concéntrese en inicio, condición, instrucciones y actualización. No memorice la sintaxis de PSeInt.  

### Pregunta después del video

En un ciclo que cuenta del 1 al 5:

- ¿con qué valor comienza el contador?
- ¿qué condición permite continuar?
- ¿qué instrucción lo acerca al final?

---

# PARTE 2 — COMPRENDER LA REPETICIÓN

## 7. ¿Qué es una repetición?

Una repetición es una estructura que permite ejecutar un bloque de instrucciones varias veces.

También puede llamarse:

- ciclo;
- bucle;
- lazo;
- estructura repetitiva.

Cada ejecución completa del bloque se denomina **iteración**.

Si una acción se realiza cinco veces, el ciclo tiene cinco iteraciones.

### Analogía: dar vueltas a una pista

Cada vuelta contiene las mismas etapas:

```text
salir de la línea
recorrer la pista
volver a la línea
registrar una vuelta
```

Después de cada vuelta se pregunta:

```text
¿Ya completé la cantidad necesaria?
```

Si la respuesta es no, se realiza otra vuelta. Si es sí, se abandona la pista.

---

## 8. ¿Cuándo utilizar una repetición?

Una repetición es apropiada cuando:

- una acción debe realizarse una cantidad conocida de veces;
- una acción debe continuar mientras se cumpla una condición;
- deben procesarse varios datos con las mismas reglas;
- se necesita pedir nuevamente un dato hasta que sea válido;
- se acumula un resultado poco a poco;
- se espera que ocurra una situación de salida.

Ejemplos:

```text
Mostrar los números del 1 al 20.
Procesar las notas de 10 estudiantes.
Pedir una contraseña mientras sea incorrecta.
Registrar ventas hasta que termine el día.
Sumar aportes hasta alcanzar una meta.
```

### Cuándo no utilizarla

No es necesario crear un ciclo si:

- la acción ocurre una sola vez;
- cada paso es diferente y no existe un patrón repetido;
- la repetición no tiene un límite o condición comprensible;
- copiar dos instrucciones diferentes sería más claro que forzar una estructura repetitiva.

---

## 9. Dos preguntas antes de escribir un ciclo

Antes de elegir una estructura, responda:

### Pregunta 1

> ¿Qué instrucciones deben repetirse?

Ese conjunto forma el **cuerpo del ciclo**.

### Pregunta 2

> ¿Cuándo debe terminar la repetición?

La respuesta puede ser:

- después de una cantidad exacta;
- cuando una condición deje de cumplirse;
- cuando se alcance una meta;
- cuando se ingrese un valor especial;
- cuando el dato sea válido.

Si no puede responder la segunda pregunta, el ciclo todavía no está correctamente diseñado.

---

## 10. Anatomía de un ciclo

Una repetición controlada por una variable suele tener cinco elementos.

```text
1. INICIO
2. CONDICIÓN
3. CUERPO
4. ACTUALIZACIÓN
5. SALIDA
```

### Ejemplo: contar del 1 al 3

```text
contador ← 1

MIENTRAS contador ≤ 3 HACER
    MOSTRAR contador
    contador ← contador + 1
FIN MIENTRAS

MOSTRAR "Terminó"
```

| Elemento | En el ejemplo |
|---|---|
| Inicio | `contador ← 1` |
| Condición | `contador ≤ 3` |
| Cuerpo | `MOSTRAR contador` |
| Actualización | `contador ← contador + 1` |
| Salida | Mostrar `"Terminó"` |

### Recorrido

```text
contador = 1 → cumple → muestra 1 → aumenta a 2
contador = 2 → cumple → muestra 2 → aumenta a 3
contador = 3 → cumple → muestra 3 → aumenta a 4
contador = 4 → no cumple → sale del ciclo
```

Salida:

```text
1
2
3
Terminó
```

---

## 11. Tabla de rastreo de una repetición

Una tabla de rastreo registra el estado al comienzo y al final de cada iteración.

| Iteración | Contador al evaluar | `contador ≤ 3` | Valor mostrado | Contador después |
|---:|---:|---|---:|---:|
| 1 | 1 | VERDADERO | 1 | 2 |
| 2 | 2 | VERDADERO | 2 | 3 |
| 3 | 3 | VERDADERO | 3 | 4 |
| Salida | 4 | FALSO | — | 4 |

La fila de salida es importante. Demuestra exactamente qué hizo falsa la condición.

### Método de prueba manual

1. Escriba los valores iniciales.
2. Evalúe la condición.
3. Si es falsa, salga.
4. Si es verdadera, ejecute el cuerpo línea por línea.
5. Registre cada actualización.
6. Regrese a la condición.
7. Continúe hasta demostrar la salida.

---

# PARTE 3 — CANTIDAD CONOCIDA DE REPETICIONES

## 12. Repetir una cantidad exacta

Cuando se conoce de antemano cuántas veces debe ejecutarse una acción, puede utilizarse una repetición de tipo `PARA`.

### Estructura conceptual

```text
PARA contador DESDE inicio HASTA final HACER
    instrucciones
FIN PARA
```

Para este curso, el valor indicado en `HASTA` está incluido.

### Ejemplo: mostrar cinco saludos

```text
PARA numero DESDE 1 HASTA 5 HACER
    MOSTRAR "Hola"
FIN PARA
```

El cuerpo se ejecuta cinco veces.

La variable `numero` toma estos valores:

```text
1, 2, 3, 4, 5
```

Aunque no se muestre, el contador controla la cantidad de iteraciones.

---

## 13. Utilizar el valor del contador

El contador puede formar parte de la acción.

```text
PARA numero DESDE 1 HASTA 5 HACER
    MOSTRAR "Repetición", numero
FIN PARA
```

Salida:

```text
Repetición 1
Repetición 2
Repetición 3
Repetición 4
Repetición 5
```

### Ejemplo: tabla de multiplicar

```text
LEER numero

PARA multiplicador DESDE 1 HASTA 10 HACER
    resultado ← numero * multiplicador
    MOSTRAR numero, " x ", multiplicador, " = ", resultado
FIN PARA
```

El patrón se escribe una vez y se aplica a diez valores.

---

## 14. Contar hacia atrás

Una repetición también puede disminuir.

```text
PARA numero DESDE 5 HASTA 1 CON PASO -1 HACER
    MOSTRAR numero
FIN PARA

MOSTRAR "Despegue"
```

Salida:

```text
5
4
3
2
1
Despegue
```

El paso indica cuánto cambia el contador después de cada iteración.

- `PASO 1`: aumenta uno;
- `PASO 2`: aumenta dos;
- `PASO -1`: disminuye uno.

### Ejemplo con paso de dos

```text
PARA numero DESDE 2 HASTA 10 CON PASO 2 HACER
    MOSTRAR numero
FIN PARA
```

Salida:

```text
2, 4, 6, 8, 10
```

---

## 15. Elegir `PARA`

`PARA` es una buena elección cuando:

- la cantidad de iteraciones se conoce antes de comenzar;
- existe un inicio y un final numérico claros;
- se procesará exactamente una cantidad determinada de datos;
- el contador avanza con un paso regular.

Ejemplos:

```text
Revisar 12 meses.
Pedir las notas de 5 estudiantes.
Mostrar los números del 1 al 100.
Realizar una cuenta regresiva de 10 a 1.
```

No es la opción más natural cuando se desconoce cuántos intentos o aportes serán necesarios.

---

## 16. Error de una iteración

Regla:

> Mostrar los números del 1 al 5.

Incorrecto:

```text
PARA numero DESDE 1 HASTA 4 HACER
    MOSTRAR numero
FIN PARA
```

Falta el 5.

También sería incorrecto comenzar en 0 si el problema solicita del 1 al 5.

Estos errores suelen llamarse **errores de límite** o errores de “uno más/uno menos”.

### Prueba de límites

Antes de aceptar un ciclo `PARA`, escriba:

```text
primer valor
segundo valor
...
penúltimo valor
último valor
```

Después cuente cuántos valores existen realmente.

---

# PARTE 4 — REPETICIONES CONTROLADAS POR UNA CONDICIÓN

## 17. Ciclo `MIENTRAS`

`MIENTRAS` repite un bloque mientras una condición sea verdadera.

```text
MIENTRAS condición HACER
    instrucciones
FIN MIENTRAS
```

La condición se evalúa antes del cuerpo.

Por eso, el cuerpo puede ejecutarse:

- cero veces;
- una vez;
- muchas veces.

### Ejemplo: avanzar hasta llegar a una meta

```text
distancia ← 0

MIENTRAS distancia < 10 HACER
    distancia ← distancia + 2
    MOSTRAR distancia
FIN MIENTRAS
```

Valores mostrados:

```text
2, 4, 6, 8, 10
```

Cuando `distancia` vale 10:

```text
distancia < 10
```

es falso y el ciclo termina.

---

## 18. La condición de continuación

En `MIENTRAS`, la condición expresa cuándo continuar.

Regla cotidiana:

> Seguir pidiendo la contraseña mientras sea incorrecta.

```text
LEER contraseña

MIENTRAS contraseña ≠ contraseña_correcta HACER
    MOSTRAR "Contraseña incorrecta"
    LEER contraseña
FIN MIENTRAS

MOSTRAR "Acceso permitido"
```

La lectura debe aparecer:

- una vez antes del ciclo, para evaluar la primera condición;
- otra vez dentro del ciclo, para permitir que el dato cambie.

Si nunca se leyera una nueva contraseña, la condición conservaría el mismo resultado.

---

## 19. Cero iteraciones

Suponga:

```text
saldo ← 120

MIENTRAS saldo < 100 HACER
    LEER aporte
    saldo ← saldo + aporte
FIN MIENTRAS
```

La primera condición:

```text
120 < 100
```

es falsa.

El cuerpo no se ejecuta porque la meta ya estaba alcanzada.

Esto no es un error. Es el comportamiento correcto de una estructura que comprueba antes de actuar.

---

## 20. Ciclo `REPETIR HASTA QUE`

`REPETIR HASTA QUE` ejecuta el cuerpo primero y comprueba la condición al final.

```text
REPETIR
    instrucciones
HASTA QUE condición_de_salida
```

El cuerpo se ejecuta al menos una vez.

### Ejemplo: pedir una nota válida

```text
REPETIR
    LEER nota

    SI nota < 0 O nota > 100 ENTONCES
        MOSTRAR "Nota inválida"
    FIN SI
HASTA QUE nota ≥ 0 Y nota ≤ 100

MOSTRAR "Nota aceptada"
```

La condición expresa cuándo terminar:

```text
nota ≥ 0 Y nota ≤ 100
```

El ciclo continúa mientras esa condición todavía sea falsa.

---

## 21. `MIENTRAS` y `REPETIR` no preguntan lo mismo

`MIENTRAS` utiliza una condición de continuación:

```text
MIENTRAS dato_es_invalido HACER
    ...
FIN MIENTRAS
```

`REPETIR HASTA QUE` utiliza una condición de salida:

```text
REPETIR
    ...
HASTA QUE dato_es_valido
```

Ambos pueden resolver problemas parecidos, pero la forma de pensar la condición es diferente.

| Característica | `MIENTRAS` | `REPETIR HASTA QUE` |
|---|---|---|
| Momento de comprobar | Antes del cuerpo | Después del cuerpo |
| Mínimo de iteraciones | 0 | 1 |
| La condición indica | Seguir | Terminar |
| Uso común | Continuar mientras falte algo | Pedir hasta obtener algo válido |

---

## 22. Elegir entre `PARA`, `MIENTRAS` y `REPETIR`

Utilice esta guía:

```text
¿Conozco la cantidad exacta de repeticiones?
├── Sí → PARA
└── No
    └── ¿La acción debe ocurrir al menos una vez?
        ├── Sí → REPETIR HASTA QUE
        └── No o puede ser cero → MIENTRAS
```

### Ejemplos

| Problema | Estructura natural | Razón |
|---|---|---|
| Mostrar 10 resultados | `PARA` | Cantidad conocida |
| Ahorrar hasta reunir una meta | `MIENTRAS` | Cantidad desconocida |
| Pedir una opción hasta que sea válida | `REPETIR` | Debe pedirla al menos una vez |
| Procesar exactamente 7 días | `PARA` | Cantidad conocida |
| Intentar mientras queden oportunidades | `MIENTRAS` | Depende de una condición |

Las estructuras pueden sustituirse en algunos problemas. La meta es elegir la que comunique mejor la intención.

---

## 23. Diagrama de flujo de un ciclo

Un ciclo controlado por condición vuelve al rombo.

```text
              ┌────────┐
              │ INICIO │
              └───┬────┘
                  ▼
          ┌───────────────┐
          │ contador ← 1  │
          └───────┬───────┘
                  ▼
            ◇ contador ≤ 3 ◇
              /         \
            Sí           No
            ▼             ▼
     ┌──────────────┐  ┌─────┐
     │MOSTRAR       │  │ FIN │
     │contador      │  └─────┘
     └──────┬───────┘
            ▼
     ┌──────────────────┐
     │contador ←        │
     │contador + 1      │
     └────────┬─────────┘
              │
              └─────── vuelve al rombo
```

La flecha de regreso muestra la repetición. La salida `No` permite abandonar el ciclo.

---

# PARTE 5 — RECORDAR LO OCURRIDO

## 24. Contador

Un contador registra cuántas veces ocurre algo.

Normalmente:

```text
contador ← 0
```

y cuando sucede el evento:

```text
contador ← contador + 1
```

### Ejemplo: contar notas aprobadas

```text
aprobadas ← 0

PARA estudiante DESDE 1 HASTA 5 HACER
    LEER nota

    SI nota ≥ 70 ENTONCES
        aprobadas ← aprobadas + 1
    FIN SI
FIN PARA

MOSTRAR aprobadas
```

El ciclo tiene cinco iteraciones, pero `aprobadas` solo aumenta cuando se cumple la condición.

### Analogía

Una persona coloca una marca en una hoja cada vez que entra un visitante. Al final, la cantidad de marcas es el contador.

---

## 25. Acumulador

Un acumulador guarda una suma que crece con valores diferentes.

Normalmente:

```text
total ← 0
```

y por cada dato:

```text
total ← total + valor
```

### Ejemplo: sumar gastos de siete días

```text
total_gastos ← 0

PARA dia DESDE 1 HASTA 7 HACER
    LEER gasto
    total_gastos ← total_gastos + gasto
FIN PARA

MOSTRAR total_gastos
```

Si los gastos son:

```text
5, 3, 0, 10, 4, 2, 6
```

el acumulador toma estos valores:

```text
5, 8, 8, 18, 22, 24, 30
```

---

## 26. Contador y acumulador no son lo mismo

| Elemento | Pregunta que responde | Actualización típica |
|---|---|---|
| Contador | ¿Cuántos hay? | `contador ← contador + 1` |
| Acumulador | ¿Cuánto suman? | `total ← total + valor` |

Ejemplo con aportes:

```text
cantidad_aportes ← cantidad_aportes + 1
total_ahorrado ← total_ahorrado + aporte
```

Si los aportes son `10`, `25` y `5`:

- el contador termina en `3`;
- el acumulador termina en `40`.

---

## 27. Video obligatorio sobre contadores y acumuladores

[Contadores y Acumuladores | Curso de Programación desde 0 — SEFER educación](https://www.youtube.com/watch?v=ognM2ArrKZo)

**Duración:** 3 minutos y 23 segundos  
**Tema exacto:** Diferencia entre contar sucesos y acumular valores  

### Comprobación rápida

Indique cuál variable es contador y cuál es acumulador:

```text
cantidad_ventas ← cantidad_ventas + 1
ingresos ← ingresos + precio
```

---

## 28. Calcular un promedio

Un promedio necesita:

```text
suma de los valores
cantidad de valores
```

Fórmula:

```text
promedio ← total / cantidad
```

### Ejemplo

```text
total_notas ← 0

PARA estudiante DESDE 1 HASTA 5 HACER
    LEER nota
    total_notas ← total_notas + nota
FIN PARA

promedio ← total_notas / 5
MOSTRAR promedio
```

### Evitar división entre cero

Si la cantidad no es fija, debe comprobarse:

```text
SI cantidad > 0 ENTONCES
    promedio ← total / cantidad
    MOSTRAR promedio
SINO
    MOSTRAR "No hay datos para calcular el promedio"
FIN SI
```

---

## 29. Valor centinela

Un centinela es un valor especial que indica el final de la entrada.

Ejemplo:

> Registrar aportes positivos. Ingresar `0` para terminar.

```text
total ← 0
cantidad ← 0

LEER aporte

MIENTRAS aporte ≠ 0 HACER
    SI aporte > 0 ENTONCES
        total ← total + aporte
        cantidad ← cantidad + 1
    SINO
        MOSTRAR "Aporte inválido"
    FIN SI

    LEER aporte
FIN MIENTRAS

MOSTRAR total
MOSTRAR cantidad
```

El `0`:

- detiene el ciclo;
- no se suma;
- no se cuenta como aporte.

### Elegir un buen centinela

El centinela no debe confundirse con un dato válido.

Si `0` pudiera ser un dato normal, sería necesario utilizar otro valor o formular una pregunta separada como:

```text
¿Desea registrar otro dato?
```

---

## 30. Condición, contador y acumulador trabajando juntos

Problema:

> Registrar ventas hasta ingresar `0`. Contar y sumar únicamente las ventas positivas.

```text
cantidad_ventas ← 0
total_ventas ← 0

LEER venta

MIENTRAS venta ≠ 0 HACER
    SI venta > 0 ENTONCES
        cantidad_ventas ← cantidad_ventas + 1
        total_ventas ← total_ventas + venta
    SINO
        MOSTRAR "Venta inválida"
    FIN SI

    LEER venta
FIN MIENTRAS

SI cantidad_ventas > 0 ENTONCES
    promedio ← total_ventas / cantidad_ventas
    MOSTRAR cantidad_ventas
    MOSTRAR total_ventas
    MOSTRAR promedio
SINO
    MOSTRAR "No se registraron ventas"
FIN SI
```

Este algoritmo combina:

- lectura;
- repetición;
- decisión;
- validación;
- contador;
- acumulador;
- promedio;
- caso sin datos.

---

# PARTE 6 — EJEMPLOS RESUELTOS

## 31. Ejemplo 1: tabla del 6

### Problema

Mostrar la tabla de multiplicar del 6 desde `6 × 1` hasta `6 × 10`.

### Pseudocódigo

```text
numero ← 6

PARA multiplicador DESDE 1 HASTA 10 HACER
    resultado ← numero * multiplicador
    MOSTRAR numero, " x ", multiplicador, " = ", resultado
FIN PARA
```

### Primeras y últimas iteraciones

| Iteración | Multiplicador | Resultado |
|---:|---:|---:|
| 1 | 1 | 6 |
| 2 | 2 | 12 |
| ... | ... | ... |
| 9 | 9 | 54 |
| 10 | 10 | 60 |

No es necesario escribir diez multiplicaciones diferentes.

---

## 32. Ejemplo 2: tres intentos de acceso

### Problema

Permitir como máximo tres intentos para ingresar una clave.

### Pseudocódigo

```text
clave_correcta ← "COA"
intentos ← 0
acceso_concedido ← FALSO

MIENTRAS intentos < 3 Y NO acceso_concedido HACER
    LEER clave_ingresada
    intentos ← intentos + 1

    SI clave_ingresada = clave_correcta ENTONCES
        acceso_concedido ← VERDADERO
    SINO
        MOSTRAR "Clave incorrecta"
    FIN SI
FIN MIENTRAS

SI acceso_concedido ENTONCES
    MOSTRAR "Acceso permitido"
SINO
    MOSTRAR "Intentos agotados"
FIN SI
```

### ¿Por qué termina?

El ciclo termina cuando:

- la clave es correcta; o
- `intentos` llega a 3.

La condición exige simultáneamente:

```text
quedan intentos Y todavía no hay acceso
```

---

## 33. Ejemplo 3: gastos y promedio

### Problema

Registrar los gastos de cinco días, calcular el total y el promedio.

```text
total_gastos ← 0

PARA dia DESDE 1 HASTA 5 HACER
    MOSTRAR "Gasto del día", dia
    LEER gasto
    total_gastos ← total_gastos + gasto
FIN PARA

promedio ← total_gastos / 5

MOSTRAR total_gastos
MOSTRAR promedio
```

### Rastreo con `5, 0, 8, 3, 4`

| Día | Gasto | Total anterior | Total nuevo |
|---:|---:|---:|---:|
| 1 | 5 | 0 | 5 |
| 2 | 0 | 5 | 5 |
| 3 | 8 | 5 | 13 |
| 4 | 3 | 13 | 16 |
| 5 | 4 | 16 | 20 |

Resultado:

```text
total = 20
promedio = 4
```

---

## 34. Ejemplo 4: validar una opción

### Problema

Pedir una opción del 1 al 3. Si el dato está fuera del rango, solicitarlo nuevamente.

```text
REPETIR
    MOSTRAR "1. Consultar"
    MOSTRAR "2. Registrar"
    MOSTRAR "3. Salir"
    LEER opcion

    SI opcion < 1 O opcion > 3 ENTONCES
        MOSTRAR "Opción inválida"
    FIN SI
HASTA QUE opcion ≥ 1 Y opcion ≤ 3

MOSTRAR "Opción aceptada:", opcion
```

Este algoritmo no ejecuta todavía un menú repetitivo. Solo valida una entrada.

> La construcción de aplicaciones completas con menús pertenece a los cursos de programación. Aquí interesa comprender la repetición de la pregunta hasta obtener un dato válido.

---

# PARTE 7 — ERRORES COMUNES

## 35. Olvidar la actualización

```text
contador ← 1

MIENTRAS contador ≤ 5 HACER
    MOSTRAR contador
FIN MIENTRAS
```

`contador` siempre vale 1. La condición siempre es verdadera.

Corrección:

```text
contador ← contador + 1
```

dentro del ciclo.

---

## 36. Actualizar en la dirección equivocada

```text
contador ← 1

MIENTRAS contador ≤ 5 HACER
    MOSTRAR contador
    contador ← contador - 1
FIN MIENTRAS
```

Los valores serían:

```text
1, 0, -1, -2, ...
```

Cada actualización aleja al contador de la salida.

---

## 37. Comenzar con el valor equivocado

Regla:

> Mostrar del 1 al 5.

```text
contador ← 0

MIENTRAS contador ≤ 5 HACER
    MOSTRAR contador
    contador ← contador + 1
FIN MIENTRAS
```

El algoritmo muestra seis valores:

```text
0, 1, 2, 3, 4, 5
```

La condición no es el único elemento que determina la cantidad. El inicio también importa.

---

## 38. Utilizar `<` cuando el límite debe incluirse

```text
contador ← 1

MIENTRAS contador < 5 HACER
    MOSTRAR contador
    contador ← contador + 1
FIN MIENTRAS
```

Muestra:

```text
1, 2, 3, 4
```

Si el 5 debe incluirse:

```text
contador ≤ 5
```

---

## 39. Reiniciar el acumulador dentro del ciclo

Incorrecto:

```text
PARA dia DESDE 1 HASTA 5 HACER
    total ← 0
    LEER gasto
    total ← total + gasto
FIN PARA
```

En cada iteración se borra lo acumulado anteriormente.

Corrección:

```text
total ← 0

PARA dia DESDE 1 HASTA 5 HACER
    LEER gasto
    total ← total + gasto
FIN PARA
```

---

## 40. Contar datos inválidos

Si solo se aceptan aportes positivos, este fragmento es incorrecto:

```text
cantidad ← cantidad + 1

SI aporte > 0 ENTONCES
    total ← total + aporte
FIN SI
```

La cantidad aumenta incluso para aportes inválidos.

Corrección:

```text
SI aporte > 0 ENTONCES
    total ← total + aporte
    cantidad ← cantidad + 1
FIN SI
```

---

## 41. Sumar el centinela

El valor que finaliza la entrada no pertenece al conjunto de datos.

Si `-1` significa terminar, no debe:

- sumarse;
- contarse;
- utilizarse en el promedio.

Por eso se comprueba antes de procesarlo.

---

## 42. Dividir entre cero

Si la primera entrada es el centinela, la cantidad de datos puede ser cero.

Incorrecto:

```text
promedio ← total / cantidad
```

Corrección:

```text
SI cantidad > 0 ENTONCES
    promedio ← total / cantidad
SINO
    MOSTRAR "No hay datos"
FIN SI
```

---

## 43. Ciclo infinito

Un ciclo es infinito cuando nunca alcanza su condición de salida.

Preguntas para detectarlo:

1. ¿Qué variable controla la condición?
2. ¿Esa variable cambia dentro del ciclo?
3. ¿Cambia en la dirección correcta?
4. ¿Existe realmente un valor que vuelva falsa la condición?
5. ¿Depende de una entrada que podría no llegar nunca?

Un ciclo infinito no siempre es accidental en sistemas reales, pero en los problemas de este curso debe existir una salida definida y comprobable.

---

## 44. Elegir una estructura que oculta la intención

Es posible simular una cantidad fija con `MIENTRAS`:

```text
contador ← 1

MIENTRAS contador ≤ 10 HACER
    MOSTRAR contador
    contador ← contador + 1
FIN MIENTRAS
```

Pero:

```text
PARA contador DESDE 1 HASTA 10 HACER
    MOSTRAR contador
FIN PARA
```

comunica directamente que existen diez valores controlados.

No se trata de que la primera forma sea falsa. Se trata de escoger la estructura que hace más clara la intención.

---

# PARTE 8 — ACTIVIDAD SIN COMPUTADORA

## 45. El robot repetidor

### Materiales

- tarjetas con los textos `INICIO`, `CONDICIÓN`, `ACCIÓN`, `ACTUALIZACIÓN` y `SALIDA`;
- cinco fichas numeradas del 1 al 5;
- una hoja para registrar el rastreo.

### Preparación

Coloque las tarjetas en este orden:

```text
INICIO → CONDICIÓN → ACCIÓN → ACTUALIZACIÓN
             ↑                    │
             └────────────────────┘
```

### Regla

```text
contador comienza en 1
mientras contador ≤ 5:
    levantar la ficha del contador
    aumentar contador en 1
```

### Instrucciones

1. Una persona representa al contador.
2. Otra representa la condición.
3. Una tercera ejecuta la acción.
4. La condición dice `VERDADERO` o `FALSO`.
5. Cuando sea verdadero, se levanta la ficha correspondiente.
6. La persona que representa la actualización cambia el contador.
7. Se regresa a la condición.
8. Al llegar a 6, se toma el camino de salida.

### Variaciones

Repita la actividad:

- del 5 al 1;
- del 2 al 10 avanzando de 2 en 2;
- comenzando en 7 con la condición `contador ≤ 5`;
- eliminando deliberadamente la actualización.

### Preguntas

1. ¿Cuántas iteraciones tuvo cada caso?
2. ¿Cuál caso tuvo cero iteraciones?
3. ¿Cuál se volvió infinito?
4. ¿Qué elemento determinó la salida?

### Aprendizaje esperado

El ciclo no es una instrucción mágica. Es un recorrido repetido formado por estado, pregunta, acción y cambio.

---

# PARTE 9 — EJERCICIOS

> Los ejercicios son práctica guiada. No se envían uno por uno. Intente resolverlos antes de abrir sus soluciones.

## 46. Ejercicio 1 — ¿Qué debe repetirse?

Para cada situación:

1. identifique la acción repetida;
2. indique qué cambia en cada iteración;
3. escriba la condición de finalización;
4. decida si la cantidad de repeticiones se conoce antes de comenzar;
5. proponga `PARA`, `MIENTRAS` o `REPETIR HASTA QUE`.

Situaciones:

a. Mostrar los números del 1 al 20.  
b. Pedir una edad hasta que esté entre 0 y 120.  
c. Registrar siete temperaturas diarias.  
d. Recibir aportes hasta alcanzar una meta de ahorro.  
e. Permitir intentos de contraseña mientras queden oportunidades.  
f. Imprimir una etiqueta para cada una de 30 cajas.  
g. Registrar ventas hasta ingresar el valor `0`.

No escriba todavía el pseudocódigo completo. El propósito es elegir correctamente el control de la repetición.

---

## 47. Ejercicio 2 — Cinco etiquetas numeradas

Una bodega necesita imprimir estas etiquetas:

```text
Caja 1
Caja 2
Caja 3
Caja 4
Caja 5
```

Realice:

1. pseudocódigo con una repetición `PARA`;
2. identificación del contador, inicio, final y paso;
3. tabla de rastreo;
4. modificación para imprimir de `Caja 5` a `Caja 1`;
5. modificación para imprimir únicamente `Caja 1`, `Caja 3` y `Caja 5`;
6. explicación de por qué no es necesario escribir cinco instrucciones `MOSTRAR`.

---

## 48. Ejercicio 3 — Tabla de su elección

Diseñe un algoritmo que:

1. lea un número;
2. muestre su tabla de multiplicar desde 1 hasta 10;
3. calcule cada producto dentro del ciclo;
4. muestre cada línea con el formato:

```text
número x multiplicador = resultado
```

Debe entregar:

- entrada, proceso y salida;
- pseudocódigo;
- rastreo de las iteraciones 1, 2, 9 y 10 para el número `7`;
- salida esperada completa para el número `3`;
- explicación de qué cambiaría para mostrar la tabla hasta 12.

---

## 49. Ejercicio 4 — Cuenta regresiva segura

Escriba un algoritmo con `MIENTRAS` que muestre:

```text
10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
Despegue
```

Después:

1. señale el valor inicial;
2. escriba la condición;
3. identifique la actualización;
4. construya una tabla con las primeras tres y las últimas dos iteraciones;
5. indique el valor del contador cuando el algoritmo sale;
6. explique qué ocurriría si utilizara `contador ← contador + 1`;
7. reescriba la solución con `PARA`.

---

## 50. Ejercicio 5 — Acceso con tres intentos

Una aplicación permite un máximo de tres intentos para ingresar la clave `"LOGICA"`.

El algoritmo debe:

- pedir una clave;
- aumentar el contador de intentos;
- terminar inmediatamente cuando la clave sea correcta;
- terminar cuando se utilicen los tres intentos;
- mostrar `"Acceso permitido"` si se acertó;
- mostrar `"Intentos agotados"` si no se acertó.

Realice:

1. diccionario de variables;
2. pseudocódigo con `MIENTRAS`;
3. explicación de la condición compuesta;
4. rastreo para esta secuencia:

```text
CASA, LOGICA
```

5. rastreo para:

```text
UNO, DOS, TRES
```

6. explicación de por qué el segundo caso no solicita un cuarto intento.

---

## 51. Ejercicio 6 — Gastos de una semana

Una persona registra el gasto de cada uno de los siete días.

Diseñe un algoritmo que:

- lea exactamente siete gastos;
- rechace valores negativos mostrando `"Gasto inválido"`;
- sume únicamente los valores válidos;
- cuente cuántos días tuvieron un gasto válido;
- cuente cuántos días tuvieron gasto igual a cero;
- calcule el promedio de los gastos válidos;
- evite dividir entre cero.

Utilice estos datos para la prueba:

```text
5, 0, -3, 8, 2, 0, 6
```

Debe entregar:

1. pseudocódigo;
2. tabla con una fila por día;
3. total válido;
4. cantidad de datos válidos;
5. cantidad de días con gasto cero;
6. promedio;
7. explicación de por qué `-3` no debe sumarse ni contarse como dato válido.

> El algoritmo procesa siete entradas. Un dato inválido muestra un aviso, pero no vuelve a pedir ese mismo día. La validación repetitiva se practica en el ejercicio siguiente.

---

## 52. Ejercicio 7 — Registro hasta el centinela

Una campaña recibe donaciones positivas. Se ingresa `0` para terminar.

El algoritmo debe:

- aceptar donaciones mayores que cero;
- rechazar valores negativos;
- no sumar ni contar el centinela;
- mostrar la cantidad de donaciones válidas;
- mostrar el total;
- calcular el promedio si existe al menos una donación;
- mostrar `"No se registraron donaciones"` si la primera entrada es `0`.

Pruebe con estas dos secuencias:

```text
Secuencia A: 20, -5, 30, 10, 0
Secuencia B: 0
```

Debe entregar:

1. pseudocódigo;
2. tabla de rastreo de la secuencia A;
3. resultados de ambas secuencias;
4. identificación del centinela;
5. explicación de por qué la lectura aparece antes y dentro del ciclo;
6. una propuesta de centinela diferente si la campaña permitiera donaciones de valor cero.

---

# PARTE 10 — RETOS

## 53. Reto 1 — Laboratorio de ciclos infinitos

Analice cada algoritmo sin ejecutarlo.

### Algoritmo A

```text
numero ← 1

MIENTRAS numero ≤ 5 HACER
    MOSTRAR numero
FIN MIENTRAS
```

### Algoritmo B

```text
numero ← 10

MIENTRAS numero ≥ 0 HACER
    MOSTRAR numero
    numero ← numero + 1
FIN MIENTRAS
```

### Algoritmo C

```text
numero ← 1

MIENTRAS numero ≠ 10 HACER
    MOSTRAR numero
    numero ← numero + 2
FIN MIENTRAS
```

Para cada uno:

1. escriba los primeros cinco valores que mostraría;
2. determine si termina;
3. explique la causa;
4. proponga la corrección más pequeña;
5. escriba el valor exacto que vuelve falsa la condición corregida.

---

## 54. Reto 2 — Misma meta, dos formas

Regla:

> Pedir aportes positivos hasta reunir al menos 100 unidades monetarias.

### Versión A

Diseñe una solución con `MIENTRAS`.

### Versión B

Diseñe una solución con `REPETIR HASTA QUE`.

Ambas deben:

- rechazar aportes iguales o menores que cero;
- sumar únicamente aportes válidos;
- contar los aportes válidos;
- mostrar el total final.

Después:

1. pruebe ambas con `40, 30, 30`;
2. pruebe con un total inicial de `120`;
3. explique por qué `MIENTRAS` puede realizar cero iteraciones;
4. explique por qué `REPETIR` realiza al menos una;
5. indique cuál representa mejor el problema si el ahorro inicial siempre es cero;
6. indique cuál representa mejor el problema si puede existir un ahorro inicial superior a la meta.

---



<!-- coa-activity:logica-m4-ejercicios-retos -->

# PARTE 11 — MINI PROYECTO

## 55. Plan de ahorro hasta alcanzar una meta

### Situación

Una persona desea alcanzar una meta de ahorro. No sabe cuántos aportes necesitará. El sistema debe registrar aportes hasta alcanzar o superar la meta y presentar un resumen.

### Datos de entrada

```text
meta
aporte
```

### Variables de seguimiento

```text
total_ahorrado
cantidad_aportes
```

### Reglas

1. La meta debe ser mayor que `0`. Si no lo es, debe pedirse nuevamente.
2. El total comienza en `0`.
3. Mientras el total sea menor que la meta:
   - mostrar cuánto falta;
   - pedir un aporte;
   - si el aporte es menor o igual que `0`, mostrar `"Aporte inválido"`;
   - si es válido, sumarlo al total y aumentar la cantidad de aportes.
4. Al alcanzar o superar la meta:
   - mostrar `"Meta alcanzada"`;
   - mostrar el total ahorrado;
   - mostrar la cantidad de aportes válidos;
   - calcular y mostrar el promedio de los aportes;
   - calcular cuánto se superó la meta.

### Fórmulas

```text
faltante ← meta - total_ahorrado
promedio ← total_ahorrado / cantidad_aportes
excedente ← total_ahorrado - meta
```

### Alcance

- El proyecto procesa una sola meta.
- No utiliza listas ni arreglos.
- No requiere un lenguaje de programación.
- Puede realizarse en papel, en un documento o con PSeInt.
- El diagrama puede dibujarse a mano o en una herramienta digital.

---

## 56. Entregables del mini proyecto

### Parte 1 — Comprensión del problema

Escriba:

- cuál es la acción que se repite;
- cuál es la condición de continuación;
- qué provoca la salida;
- qué datos son entradas;
- qué resultados son salidas.

### Parte 2 — Diccionario de variables

Complete:

| Variable | Significado | Clase de dato | Valor inicial |
|---|---|---|---|
| `meta` |  |  |  |
| `aporte` |  |  |  |
| `total_ahorrado` |  |  |  |
| `cantidad_aportes` |  |  |  |
| `faltante` |  |  |  |
| `promedio` |  |  |  |
| `excedente` |  |  |  |

### Parte 3 — Entrada, proceso y salida

Organice:

```text
ENTRADAS

PROCESO

SALIDAS
```

### Parte 4 — Algoritmo numerado

Explique la solución en lenguaje cotidiano. Debe quedar claro:

- cómo se valida la meta;
- cómo se inicia el seguimiento;
- qué se repite;
- cuándo se acepta un aporte;
- cuándo termina;
- qué se calcula al final.

### Parte 5 — Pseudocódigo

Utilice:

- `REPETIR HASTA QUE` para validar la meta;
- `MIENTRAS` para registrar aportes;
- `SI` para validar cada aporte;
- un contador;
- un acumulador;
- asignaciones con `←`.

### Parte 6 — Diagrama de flujo

Debe incluir:

- inicio;
- validación repetitiva de la meta;
- inicialización del total y contador;
- rombo que controla la meta;
- lectura del aporte;
- decisión de validez;
- actualización del total y contador;
- flecha que regresa a la condición;
- cálculos finales;
- fin.

### Parte 7 — Prueba obligatoria

Utilice:

```text
meta = 100
aportes = 25, -5, 40, 35
```

Complete:

| Entrada | ¿Válida? | Total anterior | Total nuevo | Cantidad válida | Faltante |
|---:|---|---:|---:|---:|---:|
| 25 |  |  |  |  |  |
| -5 |  |  |  |  |  |
| 40 |  |  |  |  |  |
| 35 |  |  |  |  |  |

Después muestre:

- total final;
- cantidad de aportes válidos;
- promedio;
- excedente.

### Parte 8 — Prueba de validación

Pruebe estas metas antes de aceptar `80`:

```text
0, -20, 80
```

Explique cuántas veces se ejecutó el ciclo de validación y cuál valor fue aceptado.

### Parte 9 — Reflexión

Responda en cuatro a seis oraciones:

1. ¿Por qué el aporte `-5` no aumenta el contador?
2. ¿Qué instrucción acerca el ciclo principal a su final?
3. ¿Qué ocurriría si los aportes válidos nunca se sumaran?
4. ¿Por qué se utiliza `MIENTRAS total_ahorrado < meta`?

---

## 57. Lista de verificación antes de entregar

```text
[ ] Identifiqué claramente la acción repetida.
[ ] La meta se valida hasta ser mayor que cero.
[ ] Inicialicé el total y el contador antes del ciclo principal.
[ ] La condición del ciclo utiliza la meta y el total.
[ ] Rechazo aportes iguales o menores que cero.
[ ] Solo los aportes válidos se suman y se cuentan.
[ ] El total cambia dentro del ciclo.
[ ] El algoritmo puede salir cuando alcanza la meta.
[ ] Calculé faltante, promedio y excedente correctamente.
[ ] El diagrama vuelve a la condición después de cada aporte.
[ ] El pseudocódigo y el diagrama representan la misma solución.
[ ] Completé las dos pruebas obligatorias.
[ ] El archivo se puede leer con claridad.
```

---

## 58. Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Comprensión y descomposición del problema | 10 |
| Validación repetitiva de la meta | 10 |
| Condición e inicio del ciclo principal | 15 |
| Contador y acumulador correctamente ubicados | 15 |
| Tratamiento de aportes inválidos | 10 |
| Pseudocódigo completo y finito | 15 |
| Diagrama equivalente al pseudocódigo | 10 |
| Pruebas, rastreo y resultados | 10 |
| Claridad y reflexión | 5 |
| **Total** | **100** |

### Criterios de dominio

| Resultado | Interpretación |
|---:|---|
| 90–100 | Dominio sólido |
| 75–89 | Logro satisfactorio |
| 60–74 | Requiere corregir seguimiento o salida |
| Menos de 60 | Conviene repasar los ciclos antes del Módulo 5 |

---

## 59. Punto de entrega

Se utiliza **un solo punto de entrega para todo el mini proyecto**. Los ejercicios y retos no necesitan formularios separados.

### Archivo

Reúna las nueve partes en un único archivo PDF.

Nombre recomendado:

```text
Modulo4_Nombre_Apellido.pdf
```

Puede incluir:

- texto escrito en computadora;
- tablas;
- pseudocódigo;
- un diagrama digital;
- fotografías o capturas claras del trabajo hecho a mano.

Revise que las imágenes no estén borrosas, giradas, cortadas o demasiado oscuras.

### Indicación para el formulario

Escriba:

```text
Módulo 4 — Plan de ahorro — Nombre y apellido
```

Formulario:

[Entregar el mini proyecto del Módulo 4](https://forms.gle/BayPBDiXAGurWjnL6)

> No envíe cada ejercicio por separado. Envíe únicamente el mini proyecto completo.

---



<!-- coa-activity:logica-m4-mini-proyecto -->

# PARTE 12 — SOLUCIONES EXPLICADAS

## 60. Solución del diagnóstico

1. Con cada aporte se suma una cantidad al ahorro.
2. Cambia el total ahorrado.
3. Debe detenerse cuando el total sea igual o mayor que 100.
4. Realiza cinco aportes.
5. Un aporte negativo debería rechazarse porque reduciría el ahorro y no representa un aporte válido.
6. No conoce necesariamente la cantidad antes de comenzar; depende del valor de cada aporte.

---

## 61. Solución del ejercicio 1

| Situación | Acción repetida | Qué cambia | Final | ¿Cantidad conocida? | Estructura |
|---|---|---|---|---|---|
| a | Mostrar un número | Número | Después de 20 | Sí | `PARA` |
| b | Leer una edad | Edad ingresada | Edad válida | No | `REPETIR` |
| c | Leer temperatura | Día y temperatura | Después de 7 | Sí | `PARA` |
| d | Leer y sumar aporte | Total ahorrado | Total alcanza meta | No | `MIENTRAS` |
| e | Leer contraseña | Intentos y resultado | Acierto o sin intentos | Máximo conocido, salida variable | `MIENTRAS` |
| f | Imprimir etiqueta | Número de caja | Después de 30 | Sí | `PARA` |
| g | Leer y procesar venta | Venta, cantidad y total | Se ingresa 0 | No | `MIENTRAS` |

En algunos casos existe más de una estructura posible. La propuesta se basa en cuál expresa la intención con mayor claridad.

---

## 62. Solución del ejercicio 2

### Orden ascendente

```text
PARA caja DESDE 1 HASTA 5 HACER
    MOSTRAR "Caja", caja
FIN PARA
```

### Orden descendente

```text
PARA caja DESDE 5 HASTA 1 CON PASO -1 HACER
    MOSTRAR "Caja", caja
FIN PARA
```

### Impares

```text
PARA caja DESDE 1 HASTA 5 CON PASO 2 HACER
    MOSTRAR "Caja", caja
FIN PARA
```

| Iteración | Caja |
|---:|---:|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
| 5 | 5 |

El cuerpo contiene el patrón común. El contador aporta el valor que cambia.

---

## 63. Solución del ejercicio 3

### Entrada, proceso y salida

```text
ENTRADA
numero

PROCESO
recorrer multiplicadores del 1 al 10
calcular numero * multiplicador

SALIDA
diez líneas de la tabla
```

### Pseudocódigo

```text
LEER numero

PARA multiplicador DESDE 1 HASTA 10 HACER
    resultado ← numero * multiplicador
    MOSTRAR numero, " x ", multiplicador, " = ", resultado
FIN PARA
```

Para `7`:

| Iteración | Multiplicador | Resultado |
|---:|---:|---:|
| 1 | 1 | 7 |
| 2 | 2 | 14 |
| 9 | 9 | 63 |
| 10 | 10 | 70 |

Para extender hasta 12, se cambia:

```text
HASTA 10
```

por:

```text
HASTA 12
```

---

## 64. Solución del ejercicio 4

```text
contador ← 10

MIENTRAS contador ≥ 0 HACER
    MOSTRAR contador
    contador ← contador - 1
FIN MIENTRAS

MOSTRAR "Despegue"
```

| Iteración | Contador evaluado | ¿`≥ 0`? | Mostrado | Después |
|---:|---:|---|---:|---:|
| 1 | 10 | Sí | 10 | 9 |
| 2 | 9 | Sí | 9 | 8 |
| 3 | 8 | Sí | 8 | 7 |
| 10 | 1 | Sí | 1 | 0 |
| 11 | 0 | Sí | 0 | -1 |
| Salida | -1 | No | — | -1 |

Si aumentara, los valores serían `10, 11, 12...` y el ciclo no terminaría.

Con `PARA`:

```text
PARA contador DESDE 10 HASTA 0 CON PASO -1 HACER
    MOSTRAR contador
FIN PARA

MOSTRAR "Despegue"
```

---

## 65. Solución del ejercicio 5

### Variables

| Variable | Significado | Clase |
|---|---|---|
| `clave_correcta` | Clave esperada | Texto |
| `clave_ingresada` | Clave de cada intento | Texto |
| `intentos` | Cantidad utilizada | Numérico |
| `acceso_concedido` | Indica si se acertó | Lógico |

### Pseudocódigo

```text
clave_correcta ← "LOGICA"
intentos ← 0
acceso_concedido ← FALSO

MIENTRAS intentos < 3 Y NO acceso_concedido HACER
    LEER clave_ingresada
    intentos ← intentos + 1

    SI clave_ingresada = clave_correcta ENTONCES
        acceso_concedido ← VERDADERO
    SINO
        MOSTRAR "Clave incorrecta"
    FIN SI
FIN MIENTRAS

SI acceso_concedido ENTONCES
    MOSTRAR "Acceso permitido"
SINO
    MOSTRAR "Intentos agotados"
FIN SI
```

Secuencia `CASA, LOGICA`:

| Intento | Clave | ¿Correcta? | Acceso |
|---:|---|---|---|
| 1 | CASA | No | FALSO |
| 2 | LOGICA | Sí | VERDADERO |

Secuencia `UNO, DOS, TRES` termina con `intentos = 3`. La condición `intentos < 3` es falsa y no existe un cuarto intento.

---

## 66. Solución del ejercicio 6

```text
total_gastos ← 0
cantidad_validos ← 0
dias_sin_gasto ← 0

PARA dia DESDE 1 HASTA 7 HACER
    LEER gasto

    SI gasto < 0 ENTONCES
        MOSTRAR "Gasto inválido"
    SINO
        total_gastos ← total_gastos + gasto
        cantidad_validos ← cantidad_validos + 1

        SI gasto = 0 ENTONCES
            dias_sin_gasto ← dias_sin_gasto + 1
        FIN SI
    FIN SI
FIN PARA

SI cantidad_validos > 0 ENTONCES
    promedio ← total_gastos / cantidad_validos
    MOSTRAR total_gastos
    MOSTRAR promedio
    MOSTRAR dias_sin_gasto
SINO
    MOSTRAR "No hay gastos válidos"
FIN SI
```

Rastreo:

| Día | Gasto | ¿Válido? | Total | Válidos | Días en cero |
|---:|---:|---|---:|---:|---:|
| 1 | 5 | Sí | 5 | 1 | 0 |
| 2 | 0 | Sí | 5 | 2 | 1 |
| 3 | -3 | No | 5 | 2 | 1 |
| 4 | 8 | Sí | 13 | 3 | 1 |
| 5 | 2 | Sí | 15 | 4 | 1 |
| 6 | 0 | Sí | 15 | 5 | 2 |
| 7 | 6 | Sí | 21 | 6 | 2 |

```text
total = 21
cantidad válida = 6
días con cero = 2
promedio = 21 / 6 = 3.5
```

---

## 67. Solución del ejercicio 7

```text
total ← 0
cantidad ← 0

LEER donacion

MIENTRAS donacion ≠ 0 HACER
    SI donacion > 0 ENTONCES
        total ← total + donacion
        cantidad ← cantidad + 1
    SINO
        MOSTRAR "Donación inválida"
    FIN SI

    LEER donacion
FIN MIENTRAS

SI cantidad > 0 ENTONCES
    promedio ← total / cantidad
    MOSTRAR cantidad
    MOSTRAR total
    MOSTRAR promedio
SINO
    MOSTRAR "No se registraron donaciones"
FIN SI
```

Secuencia A:

| Entrada | Acción | Total | Cantidad |
|---:|---|---:|---:|
| 20 | Sumar y contar | 20 | 1 |
| -5 | Rechazar | 20 | 1 |
| 30 | Sumar y contar | 50 | 2 |
| 10 | Sumar y contar | 60 | 3 |
| 0 | Terminar | 60 | 3 |

```text
promedio = 60 / 3 = 20
```

La secuencia B muestra `"No se registraron donaciones"`.

La lectura inicial permite evaluar la condición por primera vez. La lectura interna proporciona un nuevo dato para la siguiente evaluación.

Si cero fuera una donación válida, podría preguntarse:

```text
¿Desea registrar otra donación?
```

---

## 68. Solución del reto 1

### Algoritmo A

Muestra:

```text
1, 1, 1, 1, 1...
```

No termina porque `numero` nunca cambia.

Corrección:

```text
numero ← numero + 1
```

La condición se vuelve falsa cuando `numero = 6`.

### Algoritmo B

Muestra:

```text
10, 11, 12, 13, 14...
```

No termina porque el número aumenta y siempre continúa siendo mayor o igual que cero.

Corrección:

```text
numero ← numero - 1
```

La condición se vuelve falsa cuando `numero = -1`.

### Algoritmo C

Muestra:

```text
1, 3, 5, 7, 9, 11...
```

Nunca llega exactamente a 10.

Una corrección posible:

```text
MIENTRAS numero < 10 HACER
```

La condición se vuelve falsa cuando `numero = 11`.

Otra solución sería comenzar en `0` si se desea alcanzar exactamente 10 aumentando de dos en dos.

---

## 69. Solución del reto 2

### Versión A

```text
meta ← 100
total ← 0
cantidad ← 0

MIENTRAS total < meta HACER
    LEER aporte

    SI aporte > 0 ENTONCES
        total ← total + aporte
        cantidad ← cantidad + 1
    SINO
        MOSTRAR "Aporte inválido"
    FIN SI
FIN MIENTRAS

MOSTRAR total
MOSTRAR cantidad
```

### Versión B

```text
meta ← 100
total ← 0
cantidad ← 0

REPETIR
    LEER aporte

    SI aporte > 0 ENTONCES
        total ← total + aporte
        cantidad ← cantidad + 1
    SINO
        MOSTRAR "Aporte inválido"
    FIN SI
HASTA QUE total ≥ meta

MOSTRAR total
MOSTRAR cantidad
```

Con `40, 30, 30`, ambas terminan en:

```text
total = 100
cantidad = 3
```

Si el total inicial fuera 120:

- `MIENTRAS` no pediría aportes;
- `REPETIR` pediría uno innecesariamente.

Si el total siempre comienza en cero y la meta es positiva, las dos formas representan correctamente el problema. Si puede existir un ahorro inicial que ya alcance la meta, `MIENTRAS` representa mejor la posibilidad de cero iteraciones.

---

## 70. Solución de referencia del mini proyecto

> Esta es una solución posible. Se acepta cualquier diseño que respete las reglas, termine correctamente y produzca los mismos resultados.

### Comprensión

La acción repetida es leer y procesar un aporte. El ciclo continúa mientras el total sea menor que la meta. Un aporte válido cambia el acumulador y el contador. La salida ocurre cuando el total alcanza o supera la meta.

### Diccionario

| Variable | Significado | Clase | Inicial |
|---|---|---|---:|
| `meta` | Cantidad que se desea alcanzar | Numérico | Entrada |
| `aporte` | Cantidad ingresada en una iteración | Numérico | Entrada |
| `total_ahorrado` | Suma de aportes válidos | Numérico | 0 |
| `cantidad_aportes` | Número de aportes válidos | Numérico entero | 0 |
| `faltante` | Cantidad que falta para la meta | Numérico | Calculado |
| `promedio` | Promedio de aportes válidos | Numérico | Calculado |
| `excedente` | Cantidad por encima de la meta | Numérico | Calculado |

### Entrada, proceso y salida

```text
ENTRADAS
meta
aportes

PROCESO
validar meta
iniciar total y contador
pedir y validar aportes
acumular y contar aportes válidos
repetir hasta alcanzar la meta
calcular promedio y excedente

SALIDAS
avisos de validación
faltante
total
cantidad
promedio
excedente
```

### Algoritmo numerado

1. Pedir la meta.
2. Repetir la lectura hasta recibir una meta mayor que cero.
3. Iniciar el total y la cantidad en cero.
4. Comprobar si el total todavía es menor que la meta.
5. Calcular y mostrar el faltante.
6. Pedir un aporte.
7. Si es inválido, mostrar un aviso.
8. Si es válido, sumarlo y contarlo.
9. Volver a comprobar el total.
10. Al alcanzar la meta, calcular promedio y excedente.
11. Mostrar el resumen.
12. Finalizar.

### Pseudocódigo

```text
INICIO
    REPETIR
        LEER meta

        SI meta ≤ 0 ENTONCES
            MOSTRAR "Meta inválida"
        FIN SI
    HASTA QUE meta > 0

    total_ahorrado ← 0
    cantidad_aportes ← 0

    MIENTRAS total_ahorrado < meta HACER
        faltante ← meta - total_ahorrado
        MOSTRAR "Falta ahorrar:", faltante
        LEER aporte

        SI aporte ≤ 0 ENTONCES
            MOSTRAR "Aporte inválido"
        SINO
            total_ahorrado ← total_ahorrado + aporte
            cantidad_aportes ← cantidad_aportes + 1
        FIN SI
    FIN MIENTRAS

    promedio ← total_ahorrado / cantidad_aportes
    excedente ← total_ahorrado - meta

    MOSTRAR "Meta alcanzada"
    MOSTRAR "Total:", total_ahorrado
    MOSTRAR "Cantidad de aportes:", cantidad_aportes
    MOSTRAR "Promedio:", promedio
    MOSTRAR "Excedente:", excedente
FIN
```

### Diagrama lógico de referencia

```text
INICIO
  ↓
LEER meta ◄───────────────────────────┐
  ↓                                  │
¿meta > 0?                           │
  ├── No → MOSTRAR "Meta inválida" ──┘
  └── Sí
       ↓
total ← 0
cantidad ← 0
       ↓
¿total < meta? ◄─────────────────────────┐
  ├── No → calcular promedio y excedente → resumen → FIN
  └── Sí
       ↓
calcular y mostrar faltante
       ↓
LEER aporte
       ↓
¿aporte > 0?
  ├── No → MOSTRAR "Aporte inválido" ──┐
  └── Sí                                │
       ↓                                │
total ← total + aporte                  │
cantidad ← cantidad + 1                 │
       └────────────────────────────────┤
                                        │
                                        └── volver a ¿total < meta?
```

### Prueba obligatoria

| Entrada | ¿Válida? | Total anterior | Total nuevo | Cantidad válida | Faltante antes |
|---:|---|---:|---:|---:|---:|
| 25 | Sí | 0 | 25 | 1 | 100 |
| -5 | No | 25 | 25 | 1 | 75 |
| 40 | Sí | 25 | 65 | 2 | 75 |
| 35 | Sí | 65 | 100 | 3 | 35 |

Resultados:

```text
total = 100
cantidad = 3
promedio = 100 / 3 = 33.33 aproximadamente
excedente = 0
```

Validación de meta:

```text
0  → inválida
-20 → inválida
80 → aceptada
```

El cuerpo de validación se ejecuta tres veces.

---

# PARTE 13 — EVALUACIÓN

## 71. Evaluación de dominio

### Pregunta 1

¿Qué es una iteración?

a. Una variable de texto  
b. Una ejecución completa del cuerpo de un ciclo  
c. El final de un algoritmo  
d. Una comparación inválida

### Pregunta 2

¿Qué estructura expresa mejor “procesar exactamente 12 meses”?

a. `PARA`  
b. `MIENTRAS` sin condición  
c. Una decisión simple  
d. Ninguna repetición

### Pregunta 3

¿Cuántas veces como mínimo se ejecuta el cuerpo de `REPETIR HASTA QUE`?

a. Cero  
b. Una  
c. Dos  
d. Diez

### Pregunta 4

¿Qué instrucción evita que este ciclo sea infinito?

```text
contador ← 1
MIENTRAS contador ≤ 5 HACER
    MOSTRAR contador
    __________
FIN MIENTRAS
```

a. `contador ← 1`  
b. `contador ← contador + 1`  
c. `MOSTRAR 5`  
d. `contador ← contador - 1`

### Pregunta 5

¿Qué hace un acumulador?

a. Cuenta eventos aumentando siempre uno  
b. Guarda una suma que cambia con cada valor  
c. Finaliza cualquier ciclo  
d. Sustituye la condición

### Pregunta 6

Si `0` es un centinela, ¿debe incluirse en el total y la cantidad?

a. Sí, siempre  
b. Solo en el total  
c. No  
d. Solo en la cantidad

### Pregunta 7

¿Por qué se comprueba `cantidad > 0` antes de calcular un promedio?

a. Para evitar dividir entre cero  
b. Para crear un ciclo infinito  
c. Para reiniciar el total  
d. Para cambiar el centinela

### Pregunta 8

¿Qué casos mínimos conviene probar en un ciclo controlado por condición?

a. Únicamente un caso intermedio  
b. Cero, una y varias iteraciones, además de los límites  
c. Solo el caso que termina  
d. Ninguno si el pseudocódigo se ve correcto

---

## 72. Respuestas de la evaluación

| Pregunta | Respuesta | Explicación |
|---:|---|---|
| 1 | b | Una iteración es una vuelta completa |
| 2 | a | La cantidad se conoce antes de comenzar |
| 3 | b | La condición se comprueba al final |
| 4 | b | Acerca el contador a la salida |
| 5 | b | Conserva y actualiza una suma |
| 6 | c | El centinela solo comunica el final |
| 7 | a | No existe división válida entre cero |
| 8 | b | Esos casos revelan límites y salidas incorrectas |

### Criterio recomendado

- **7 u 8 correctas:** puede avanzar.
- **5 o 6 correctas:** revise anatomía, límites y acumulación.
- **4 o menos:** repita los ejercicios 4, 6 y 7 antes del mini proyecto.

---

## 73. Autoevaluación

| Habilidad | Sí | Todavía practico | No |
|---|:---:|:---:|:---:|
| Identifico qué acción debe repetirse |  |  |  |
| Puedo explicar cuándo termina un ciclo |  |  |  |
| Distingo cantidad conocida y condición de salida |  |  |  |
| Sé elegir entre `PARA`, `MIENTRAS` y `REPETIR` |  |  |  |
| Puedo rastrear cada iteración en una tabla |  |  |  |
| Utilizo correctamente un contador |  |  |  |
| Utilizo correctamente un acumulador |  |  |  |
| Comprendo el uso de un centinela |  |  |  |
| Evito sumar o contar datos inválidos |  |  |  |
| Detecto ciclos infinitos y errores de límite |  |  |  |
| Pruebo cero, una y varias iteraciones |  |  |  |

Si marca “No” en tres o más habilidades, revise las secciones relacionadas antes de continuar.

---

# PARTE 14 — RECURSOS

## 74. Video general opcional

[PSeInt — Ciclos de repetición Mientras, Repetir y Para. Uso de acumuladores y contadores — Profesor Diego Nogueira](https://www.youtube.com/watch?v=9GQBKXmegFM)

**Duración:** 16 minutos y 57 segundos  
**Tema exacto:** Comparación práctica de los tres ciclos y uso de contadores y acumuladores  
**Uso recomendado:** Después de finalizar los ejercicios, si desea ver todas las estructuras ejecutadas en PSeInt

---

## 75. Lecturas y documentación

### Referencia esencial de pseudocódigo

[Documentación oficial de pseudocódigo de PSeInt](https://pseint.sourceforge.net/index.php?page=pseudocodigo.php)

Consulte las secciones:

- Lazos Mientras;
- Lazos Repetir;
- Lazos Para.

La documentación explica cuándo se evalúa cada condición, cuántas veces puede ejecutarse el cuerpo y cómo evitar ciclos infinitos.

### Lectura sobre algoritmos y repetición

[Algoritmos y pseudocódigo — INTEF](https://formacion.intef.es/tutorizados_2013_2019/pluginfile.php/109756/mod_folder/content/0/Programar_03_15_T5_algoritmos.pdf?forcedownload=1)

Utilidad:

- repasar por qué el pseudocódigo es independiente del lenguaje;
- observar una repetición de cantidad fija;
- comparar una solución repetitiva con instrucciones copiadas.

### Ampliación opcional

[Código de bucle — MDN Web Docs](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Loops)

Esta lectura utiliza JavaScript. No es necesario aprender su sintaxis. Concéntrese en:

- la finalidad de los bucles;
- las diferencias entre comprobar antes y después;
- la necesidad de actualizar la variable de control;
- la explicación de los ciclos infinitos.

---

# PARTE 15 — GLOSARIO

## 76. Conceptos del módulo

| Concepto | Explicación sencilla |
|---|---|
| Repetición | Ejecución controlada de un bloque varias veces |
| Ciclo, bucle o lazo | Otros nombres para una repetición |
| Iteración | Una ejecución completa del cuerpo |
| Cuerpo | Instrucciones que se repiten |
| Inicialización | Valor establecido antes de comenzar |
| Condición de continuación | Pregunta que debe seguir siendo verdadera para repetir |
| Condición de salida | Situación que finaliza la repetición |
| Actualización | Cambio que acerca el ciclo a su final |
| `PARA` | Repetición apropiada para una cantidad conocida |
| `MIENTRAS` | Repite mientras una condición sea verdadera |
| `REPETIR HASTA QUE` | Ejecuta primero y termina cuando se cumple la condición |
| Contador | Variable que registra cuántas veces ocurre algo |
| Acumulador | Variable que guarda una suma progresiva |
| Centinela | Valor especial que indica el final de la entrada |
| Rastreo | Seguimiento manual de los valores de cada iteración |
| Error de límite | Inclusión u omisión accidental de una iteración |
| Ciclo infinito | Repetición que nunca alcanza su salida |
| Paso | Cantidad que aumenta o disminuye un contador |

---

# PARTE 16 — CIERRE

## 77. Resumen visual

```text
¿QUÉ SE REPITE?
       ↓
¿CUÁNTAS VECES?
├── CANTIDAD CONOCIDA → PARA
└── CANTIDAD DESCONOCIDA
    ├── COMPROBAR ANTES → MIENTRAS
    └── EJECUTAR AL MENOS UNA VEZ → REPETIR
       ↓
INICIALIZAR
       ↓
COMPROBAR
       ↓
EJECUTAR CUERPO
       ↓
CONTAR / ACUMULAR / ACTUALIZAR
       ↓
VOLVER A COMPROBAR
       ↓
SALIR Y MOSTRAR RESULTADOS
```

### Ocho ideas fundamentales

1. Un ciclo expresa un patrón, no una copia de instrucciones.
2. Cada vuelta completa es una iteración.
3. Toda repetición necesita una salida comprensible.
4. `PARA` comunica una cantidad conocida.
5. `MIENTRAS` puede ejecutarse cero veces.
6. `REPETIR HASTA QUE` se ejecuta al menos una vez.
7. Un contador registra cantidades y un acumulador suma valores.
8. Un ciclo debe probarse con cero, una, varias iteraciones y sus límites.

---

## 78. Habilidades obtenidas

Al completar el módulo, habrá desarrollado:

- reconocimiento de patrones repetitivos;
- diseño de ciclos finitos;
- selección razonada de una estructura repetitiva;
- control de inicio, condición y actualización;
- seguimiento del estado entre iteraciones;
- uso de contadores y acumuladores;
- validación repetitiva de entradas;
- procesamiento de cantidades fijas y desconocidas;
- uso responsable de centinelas;
- combinación de decisiones con repeticiones;
- cálculo de totales, cantidades y promedios;
- detección de errores de límite y ciclos infinitos;
- construcción de pseudocódigo y diagramas con retornos.

---

## 79. Puente hacia el Módulo 5

Ahora puede construir algoritmos que:

- reciben datos;
- toman decisiones;
- repiten acciones;
- conservan resultados.

Pero un algoritmo puede parecer correcto y aun así fallar con:

- un dato límite;
- una entrada inválida;
- cero iteraciones;
- una condición mal ordenada;
- una actualización olvidada.

El Módulo 5 estudiará cómo construir una solución completa, diseñar pruebas, rastrear errores, corregirlos y comprobar que el algoritmo realmente resuelve el problema.

---

# FIN DEL MÓDULO 4

**No avanzar al Módulo 5 hasta que el Módulo 4 sea revisado y aprobado.**
