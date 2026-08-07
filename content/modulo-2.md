# COA — Lógica de Programación

# Módulo 2: Datos, variables y operaciones

**Duración obligatoria:** 2 horas y 30 minutos  
**Nivel:** Principiante absoluto  
**Conocimientos previos:** Módulo 1 aprobado  
**Modalidad:** Práctica, independiente de cualquier lenguaje  
**Materiales:** Papel, lápiz y calculadora sencilla opcional  
**Herramientas opcionales:** PSeInt o un editor de texto

---

## 1. Objetivo del módulo

Comprender cómo un algoritmo recibe, guarda, consulta, transforma y muestra información.

Al terminar el módulo, podrá:

- explicar qué es un dato;
- reconocer datos numéricos, textuales y lógicos;
- explicar una variable sin depender de un lenguaje de programación;
- diferenciar el nombre de una variable de su valor;
- asignar y actualizar valores;
- distinguir entre leer, guardar, modificar y mostrar;
- construir expresiones aritméticas sencillas;
- interpretar comparaciones que producen `VERDADERO` o `FALSO`;
- elegir nombres de variables claros;
- seguir los cambios de un algoritmo mediante una tabla;
- diseñar un algoritmo secuencial que transforme entradas en resultados.

> En este módulo no se enseñan decisiones ni repeticiones. Una comparación puede producir `VERDADERO` o `FALSO`, pero el uso de ese resultado para elegir un camino se estudiará en el Módulo 3.

---

## 2. Distribución del tiempo

| Sección | Tiempo |
|---|---:|
| Activación y diagnóstico | 5 min |
| Datos y variables | 20 min |
| Asignación, entrada y salida | 20 min |
| Clases de datos y nombres claros | 15 min |
| Operaciones y comparaciones | 25 min |
| Tablas de seguimiento y práctica | 25 min |
| Retos | 10 min |
| Mini proyecto | 25 min |
| Evaluación y cierre | 5 min |
| **Total** | **150 min** |

---

## 3. Mapa del aprendizaje

```text
DATO
  ↓
SE GUARDA EN UNA VARIABLE
  ↓
SE UTILIZA EN UNA EXPRESIÓN
  ↓
SE OBTIENE UN RESULTADO
  ↓
SE ACTUALIZA EL ESTADO
  ↓
SE MUESTRA UNA SALIDA
  ↓
SE COMPRUEBAN LOS CAMBIOS
```

---

# PARTE 1 — ACTIVACIÓN

## 4. Pregunta guía

> ¿Cómo puede un algoritmo recordar un precio, utilizarlo en un cálculo y conservar el resultado?

Una lista de instrucciones puede decir qué hacer, pero muchos problemas también necesitan recordar información.

Por ejemplo, una caja registradora necesita conocer:

- el precio de cada producto;
- la cantidad comprada;
- el subtotal;
- el descuento;
- el total que debe pagar el cliente.

Los pasos del algoritmo describen las acciones. Los datos describen la información con la que esas acciones trabajan.

---

## 5. Diagnóstico inicial sin calificación

Una caja comienza el día con **30 monedas**. Después ocurren estas operaciones:

1. recibe 20 monedas;
2. entrega 8 monedas;
3. recibe 5 monedas.

Responde sin utilizar pseudocódigo:

1. ¿Cuántas monedas quedan?
2. ¿Qué cantidad fue cambiando durante el proceso?
3. ¿Qué información habría que anotar después de cada operación?
4. ¿Qué ocurriría si se olvidara registrar una de las operaciones?

### Propósito

La cantidad de monedas representa un dato cuyo valor cambia. Ese dato puede modelarse mediante una variable.

No es necesario conocer todavía la palabra “variable” para resolver el cálculo. El módulo dará un nombre formal a una idea que usted ya utiliza en la vida cotidiana.

---

## 6. Video introductorio obligatorio

[¿QUE es una VARIABLE en PROGRAMACIÓN? | Conceptos Básicos de programación #1 — Retro](https://www.youtube.com/watch?v=kZfuJvkdcHU)

**Duración:** 2 minutos y 35 segundos  
**Tema exacto:** Concepto de variable, utilidad, nombre y clases básicas de valores  

### Pregunta después del video

Si una variable fuera una caja con etiqueta:

- ¿qué representaría la etiqueta?
- ¿qué representaría lo que está dentro?
- ¿puede cambiar el contenido sin cambiar la etiqueta?

---

# PARTE 2 — DATOS Y VARIABLES

## 7. ¿Qué es un dato?

Un dato es un valor que un algoritmo puede recibir, guardar, utilizar o producir.

Ejemplos:

- `25`
- `3.5`
- `"Ana"`
- `"A-104"`
- `VERDADERO`
- `FALSO`

Un dato aislado no siempre comunica suficiente información.

Por ejemplo:

```text
25
```

Ese valor podría representar:

- una edad;
- un precio;
- una temperatura;
- una cantidad de productos;
- una distancia.

Cuando indicamos:

```text
edad = 25
```

el valor adquiere un significado dentro del problema.

### Dato e información

Para este curso utilizaremos esta distinción sencilla:

- **Dato:** valor que puede procesarse.
- **Información:** dato interpretado dentro de un contexto.

El número `12` es un dato.  
“Quedan 12 entradas disponibles” es información.

---

## 8. Entradas, proceso y salidas

El Módulo 1 presentó esta estructura:

```text
ENTRADAS → PROCESO → SALIDAS
```

Ahora podemos observarla con datos.

### Ejemplo: calcular el costo de varias entradas

```text
ENTRADAS
precio de una entrada
cantidad de entradas

PROCESO
multiplicar el precio por la cantidad

SALIDA
costo total
```

Si el precio es 4 y la cantidad es 3:

```text
4 × 3 = 12
```

El resultado `12` es un dato nuevo, obtenido a partir de los datos de entrada.

### Datos de entrada y datos calculados

No todos los datos tienen el mismo origen:

| Clase | Procedencia | Ejemplo |
|---|---|---|
| Entrada | Se recibe desde fuera del algoritmo | cantidad comprada |
| Dato conocido | Se establece antes del cálculo | precio fijo |
| Dato calculado | Se obtiene mediante una operación | subtotal |
| Salida | Se comunica al finalizar o durante el proceso | total mostrado |

Una misma variable puede contener un resultado calculado y después utilizarse para producir una salida.

---

## 9. ¿Qué es una variable?

Una variable es un espacio con nombre que permite conservar un valor.

```text
┌───────────────────────┐
│ nombre: precio        │
│ valor actual: 12.50   │
└───────────────────────┘
```

La variable tiene dos elementos fundamentales:

1. **Nombre:** permite identificarla.
2. **Valor actual:** dato que contiene en este momento.

### Analogía de la caja etiquetada

Imagina una caja con la etiqueta `cantidad`.

```text
┌─────────────────┐
│ CANTIDAD        │
│        3        │
└─────────────────┘
```

La etiqueta permanece, pero el contenido puede cambiar.

```text
Antes: cantidad contiene 3
Después: cantidad contiene 4
```

La analogía es útil, pero tiene un límite: en nuestros algoritmos básicos consideraremos que una variable conserva un valor actual. Cuando se le asigna otro valor, el anterior se reemplaza.

### Otra analogía: el marcador

El nombre `puntos_local` identifica un marcador. Su contenido cambia durante el partido:

```text
0 → 1 → 2 → 3
```

El marcador sigue representando los puntos del mismo equipo, aunque su valor cambie.

---

## 10. Nombre, valor y significado

Observa:

```text
precio ← 10
```

- `precio` es el nombre de la variable.
- `10` es el valor guardado.
- “precio de una unidad” es su significado dentro del problema.

No deben confundirse.

### Variable y valor no son lo mismo

Si escribimos:

```text
edad ← 18
```

`edad` no significa lo mismo que `18`.

- `edad` puede contener valores diferentes para personas diferentes.
- `18` es un valor concreto.

### El estado de una variable

El estado es el valor actual de una variable en un momento determinado.

```text
saldo ← 50
```

Estado actual:

```text
saldo contiene 50
```

Después:

```text
saldo ← 70
```

Nuevo estado:

```text
saldo contiene 70
```

El valor anterior fue reemplazado.

---

## 11. Valor literal, variable y expresión

### Valor literal

Es un dato escrito directamente.

```text
10
3.5
"Luis"
VERDADERO
```

### Variable

Es un nombre que representa un valor guardado.

```text
precio
cantidad
nombre_cliente
inscripcion_activa
```

### Expresión

Es una combinación de valores, variables y operaciones que produce un resultado.

```text
precio × cantidad
subtotal - descuento
(nota_1 + nota_2 + nota_3) ÷ 3
dinero_disponible ≥ total
```

---

# PARTE 3 — ASIGNACIÓN, ENTRADA Y SALIDA

## 12. Asignar un valor

Asignar significa guardar un valor en una variable.

En el pseudocódigo neutral de COA utilizaremos la flecha:

```text
variable ← valor
```

Ejemplo:

```text
precio ← 10
```

Se lee:

> Guardar el valor 10 en la variable precio.

La flecha señala hacia el lugar que recibirá el valor.

```text
precio  ←  10
destino    valor
```

### ¿Por qué no utilizamos `=` para asignar?

Muchos lenguajes usan el signo `=` para asignar. Otros utilizan símbolos diferentes.

En este curso usamos `←` para evitar confundir:

- **asignar un valor**, y
- **comparar si dos valores son iguales**.

La flecha es una convención del curso, no una regla universal.

---

## 13. Actualizar un valor

Actualizar significa calcular y guardar un nuevo valor en una variable que ya existía.

```text
saldo ← 50
saldo ← saldo + 20
```

La segunda línea no es una igualdad matemática.

Debe leerse en este orden:

1. consultar el valor actual de `saldo`;
2. sumarle 20;
3. guardar el resultado nuevamente en `saldo`.

```text
valor anterior: 50
cálculo:        50 + 20
valor nuevo:    70
```

### Esquema de actualización

```text
VALOR ANTERIOR
       ↓
REALIZAR OPERACIÓN
       ↓
GUARDAR VALOR NUEVO
```

Ejemplos:

```text
puntos ← puntos + 1
saldo ← saldo - compra
temperatura ← temperatura + aumento
```

---

## 14. Leer, guardar, modificar y mostrar

Estas acciones no significan lo mismo.

| Acción | Propósito | Ejemplo |
|---|---|---|
| `LEER` | Recibir un dato y almacenarlo | `LEER precio` |
| `←` | Guardar o reemplazar un valor | `subtotal ← precio × cantidad` |
| Actualizar | Calcular un valor nuevo usando el anterior | `saldo ← saldo + deposito` |
| `MOSTRAR` | Comunicar un valor sin modificarlo | `MOSTRAR total` |

### Leer

```text
LEER cantidad
```

Significa:

> Solicitar o recibir una cantidad y guardarla en la variable `cantidad`.

### Guardar un cálculo

```text
subtotal ← precio × cantidad
```

El resultado de la multiplicación queda guardado en `subtotal`.

### Mostrar

```text
MOSTRAR subtotal
```

Comunica el valor actual, pero no lo cambia.

### Ejemplo completo

```text
INICIO

    LEER precio
    LEER cantidad

    subtotal ← precio × cantidad

    MOSTRAR subtotal

FIN
```

### Error frecuente

```text
MOSTRAR precio × cantidad
```

La operación puede mostrarse directamente, pero si el resultado se necesita nuevamente, conviene guardarlo:

```text
subtotal ← precio × cantidad
MOSTRAR subtotal
```

Esto hace que la solución sea más fácil de seguir y comprobar.

---

# PARTE 4 — CLASES DE DATOS Y NOMBRES CLAROS

## 15. Tres clases de datos necesarias

Este curso utilizará tres categorías conceptuales.

### 15.1 Datos numéricos

Representan cantidades con las que pueden realizarse cálculos.

```text
18
3.5
-2
1250
```

Ejemplos:

- edad;
- cantidad;
- temperatura;
- precio;
- distancia.

### 15.2 Datos textuales

Representan nombres, mensajes, códigos o caracteres que se interpretan como texto.

```text
"Ana"
"San José"
"A-104"
"50612345678"
```

Un número escrito como texto no se utiliza automáticamente para calcular.

Por ejemplo, un número telefónico se guarda como texto porque funciona como identificador, no como cantidad para sumar.

### 15.3 Datos lógicos

Solo pueden representar dos estados:

```text
VERDADERO
FALSO
```

Ejemplos:

```text
inscripcion_activa ← VERDADERO
pago_confirmado ← FALSO
```

Las comparaciones también producen valores lógicos:

```text
10 > 5
```

Resultado:

```text
VERDADERO
```

En el Módulo 3 aprenderemos a tomar decisiones utilizando estos resultados.

---

## 16. Elegir nombres claros

Un buen nombre explica qué representa el dato.

| Nombre poco claro | Nombre recomendado |
|---|---|
| `x` | `precio_unitario` |
| `n` | `cantidad_productos` |
| `r` | `total_pagar` |
| `dato` | `nombre_cliente` |
| `valor2` | `descuento_aplicado` |

### Recomendaciones

- Utilizar palabras relacionadas con el problema.
- Evitar nombres que puedan significar varias cosas.
- Diferenciar valores parecidos.
- Mantener el mismo nombre durante todo el algoritmo.
- No reutilizar una variable para representar cosas diferentes.

### Nombres parecidos que deben distinguirse

```text
precio_unitario
subtotal
descuento
total
```

Todos contienen cantidades de dinero, pero cada uno tiene un significado diferente.

### Convención de escritura

Para facilitar la lectura utilizaremos palabras separadas por guion bajo:

```text
precio_unitario
nombre_cliente
cantidad_entradas
```

No es una sintaxis obligatoria. Es una convención clara que después puede adaptarse a cualquier lenguaje.

---

# PARTE 5 — OPERACIONES Y COMPARACIONES

## 17. Operaciones aritméticas básicas

| Operación | Símbolo del curso | Ejemplo | Resultado |
|---|:---:|---:|---:|
| Suma | `+` | `8 + 3` | `11` |
| Resta | `-` | `8 - 3` | `5` |
| Multiplicación | `×` | `8 × 3` | `24` |
| División | `÷` | `8 ÷ 2` | `4` |

Los lenguajes pueden utilizar otros símbolos, especialmente `*` y `/`. La idea matemática es la misma.

### Porcentajes

Para calcular un porcentaje:

```text
parte ← cantidad × porcentaje ÷ 100
```

Ejemplo: calcular el 10 % de 50.

```text
descuento ← 50 × 10 ÷ 100
```

Resultado:

```text
descuento contiene 5
```

---

## 18. Orden de las operaciones

Una expresión puede producir un resultado incorrecto si las operaciones se agrupan mal.

Utilizaremos estas reglas:

1. Resolver primero lo que está entre paréntesis.
2. Resolver multiplicaciones y divisiones.
3. Resolver sumas y restas.
4. Evaluar la comparación después de obtener los valores numéricos.

### Ejemplo

```text
2 + 3 × 4
```

Primero:

```text
3 × 4 = 12
```

Después:

```text
2 + 12 = 14
```

Si se desea sumar primero:

```text
(2 + 3) × 4 = 20
```

### Recomendación práctica

Cuando una fórmula pueda prestarse a confusión, utilizar paréntesis:

```text
promedio ← (nota_1 + nota_2 + nota_3) ÷ 3
```

---

## 19. Comparaciones

Una comparación responde una pregunta cuyo resultado es `VERDADERO` o `FALSO`.

| Comparación | Significado |
|:---:|---|
| `=` | igual a |
| `≠` | diferente de |
| `>` | mayor que |
| `<` | menor que |
| `≥` | mayor o igual que |
| `≤` | menor o igual que |

### Ejemplos

```text
10 > 5
```

Resultado:

```text
VERDADERO
```

```text
precio = 20
```

Si `precio` contiene 15, el resultado es:

```text
FALSO
```

```text
dinero_disponible ≥ total
```

El resultado dependerá de los valores actuales de ambas variables.

### Guardar el resultado de una comparación

```text
dinero_disponible ← 30
total ← 25
puede_pagar ← dinero_disponible ≥ total
```

Estado final:

```text
puede_pagar contiene VERDADERO
```

Todavía no decidimos qué hacer cuando el resultado sea verdadero o falso. Eso pertenece al siguiente módulo.

---

## 20. Video obligatorio de operaciones

[Operadores aritméticos y de comparación | Curso Básico de Programación — LearnFree en Español](https://www.youtube.com/watch?v=YNoBAnrEScI)

**Duración:** 3 minutos y 15 segundos  
**Tema exacto:** Operaciones aritméticas y comparaciones básicas  

---

# PARTE 6 — EJEMPLOS RESUELTOS

## 21. Ejemplo 1: compra sencilla

### Problema

Una persona compra 3 productos con un precio unitario de 10. Se aplica un descuento fijo de 5. Calcular subtotal y total.

### Entradas

```text
precio_unitario = 10
cantidad = 3
descuento = 5
```

### Proceso

```text
subtotal = precio_unitario × cantidad
total = subtotal - descuento
```

### Pseudocódigo

```text
INICIO

    precio_unitario ← 10
    cantidad ← 3

    subtotal ← precio_unitario × cantidad

    descuento ← 5
    total ← subtotal - descuento

    MOSTRAR subtotal
    MOSTRAR total

FIN
```

### Seguimiento

| Paso | precio_unitario | cantidad | subtotal | descuento | total | Salida |
|---:|---:|---:|---:|---:|---:|---|
| Inicial | — | — | — | — | — | — |
| 1 | 10 | — | — | — | — | — |
| 2 | 10 | 3 | — | — | — | — |
| 3 | 10 | 3 | 30 | — | — | — |
| 4 | 10 | 3 | 30 | 5 | — | — |
| 5 | 10 | 3 | 30 | 5 | 25 | — |
| 6 | 10 | 3 | 30 | 5 | 25 | 30 |
| 7 | 10 | 3 | 30 | 5 | 25 | 25 |

### Resultado

```text
Subtotal: 30
Total: 25
```

---

## 22. Ejemplo 2: actualización de un saldo

### Problema

Una cuenta contiene 100. Recibe un depósito de 40 y después se realiza un retiro de 25.

### Pseudocódigo

```text
INICIO

    saldo ← 100

    deposito ← 40
    saldo ← saldo + deposito

    retiro ← 25
    saldo ← saldo - retiro

    MOSTRAR saldo

FIN
```

### Seguimiento resumido

| Operación | Valor anterior de saldo | Cálculo | Valor nuevo |
|---|---:|---:|---:|
| Estado inicial | — | — | 100 |
| Depósito | 100 | `100 + 40` | 140 |
| Retiro | 140 | `140 - 25` | 115 |

### Resultado

```text
Saldo final: 115
```

### Idea importante

En esta instrucción:

```text
saldo ← saldo + deposito
```

el `saldo` de la derecha representa el valor anterior. El `saldo` de la izquierda recibe el valor nuevo.

---

## 23. Ejemplo 3: guardar una comparación

### Problema

Determinar el resultado de comparar el dinero disponible con el total de una compra.

### Pseudocódigo

```text
INICIO

    dinero_disponible ← 30
    total ← 25

    puede_pagar ← dinero_disponible ≥ total

    MOSTRAR puede_pagar

FIN
```

### Seguimiento

```text
30 ≥ 25
```

Resultado:

```text
VERDADERO
```

El algoritmo solamente calcula y muestra la comparación. No toma todavía una decisión.

---

# PARTE 7 — ERRORES COMUNES

## 24. Utilizar una variable antes de darle valor

```text
total ← subtotal - descuento
```

Si `subtotal` o `descuento` todavía no tienen valor, el cálculo no puede completarse correctamente.

### Corrección

```text
subtotal ← 30
descuento ← 5
total ← subtotal - descuento
```

---

## 25. Confundir mostrar con guardar

```text
MOSTRAR precio × cantidad
MOSTRAR subtotal
```

Si nunca se asignó el resultado a `subtotal`, mostrar la multiplicación no llena esa variable.

### Corrección

```text
subtotal ← precio × cantidad
MOSTRAR subtotal
```

---

## 26. Confundir asignación con igualdad

```text
saldo ← saldo + 10
```

No afirma que un número sea igual a sí mismo más 10. Ordena calcular un valor nuevo y guardarlo.

---

## 27. Realizar la operación equivocada

```text
subtotal ← precio + cantidad
```

Si se compran varias unidades, normalmente corresponde:

```text
subtotal ← precio × cantidad
```

La instrucción puede estar bien escrita y aun así contener un error lógico.

---

## 28. Perder un valor por actualizar demasiado pronto

```text
precio ← 10
precio ← precio × cantidad
```

Ahora `precio` ya no contiene el precio unitario. Contiene el subtotal.

Una opción más clara:

```text
precio_unitario ← 10
subtotal ← precio_unitario × cantidad
```

---

## 29. Utilizar nombres sin significado

```text
a ← 10
b ← 3
c ← a × b
```

Puede funcionar, pero obliga a recordar qué representa cada letra.

Versión clara:

```text
precio_unitario ← 10
cantidad ← 3
subtotal ← precio_unitario × cantidad
```

---

## 30. Omitir paréntesis

Versión ambigua o incorrecta:

```text
promedio ← nota_1 + nota_2 + nota_3 ÷ 3
```

Versión clara:

```text
promedio ← (nota_1 + nota_2 + nota_3) ÷ 3
```

---

## 31. Dividir entre cero

```text
promedio ← total ÷ cantidad
```

Si `cantidad` vale cero, la operación no es válida.

En este módulo basta con reconocer el riesgo. En el Módulo 3 se aprenderá a validar el dato antes de dividir.

---

# PARTE 8 — ACTIVIDAD SIN COMPUTADORA

## 32. Tarjetas de memoria

### Materiales

- Cinco tarjetas grandes.
- Papeles pequeños con valores.
- Lápiz.

### Preparación

Escribe en las tarjetas:

```text
precio_unitario
cantidad
subtotal
descuento
total
```

### Instrucciones

1. Coloca el valor `8` sobre `precio_unitario`.
2. Coloca el valor `4` sobre `cantidad`.
3. Calcula `precio_unitario × cantidad`.
4. Coloca el resultado sobre `subtotal`.
5. Coloca `6` sobre `descuento`.
6. Calcula `subtotal - descuento`.
7. Coloca el resultado sobre `total`.
8. Sustituye `cantidad` por `5`.
9. Repite solamente los cálculos que dependen de esa variable.

### Preguntas

1. ¿Qué variables cambiaron cuando cambió `cantidad`?
2. ¿Qué variables conservaron su valor?
3. ¿Por qué fue necesario volver a calcular `subtotal`?
4. ¿Qué ocurriría si se actualizara `cantidad` pero se mostrara el total anterior?

### Aprendizaje esperado

Una variable puede cambiar. Los resultados que dependen de ella no se actualizan por magia: el algoritmo debe volver a ejecutar las operaciones correspondientes.

---

# PARTE 9 — EJERCICIOS

## 33. Ejercicio 1 — La ficha de la biblioteca

**Nivel:** Reconocer  
**Tiempo sugerido:** 4 minutos

Una biblioteca registra estos datos:

```text
nombre_usuario ← "Lucía"
cantidad_prestamos ← 3
deuda ← 0
membresia_activa ← VERDADERO
codigo_estante ← "A-12"
```

Para cada variable:

1. indica si el valor es numérico, textual o lógico;
2. explica qué representa;
3. señala cuál de los valores parece un identificador aunque contenga números;
4. explica por qué `codigo_estante` no debería utilizarse como una cantidad matemática.

---

## 34. Ejercicio 2 — Ponle nombre a los datos

**Nivel:** Reconocer y mejorar  
**Tiempo sugerido:** 4 minutos

Un puesto de batidos utiliza este algoritmo:

```text
a ← 2.50
b ← 4
c ← a × b
d ← "Mango"
```

Sabemos que:

- `a` representa el precio de cada batido;
- `b` representa la cantidad vendida;
- `c` representa el dinero obtenido;
- `d` representa el sabor.

Tareas:

1. reemplaza los cuatro nombres por nombres claros;
2. vuelve a escribir el pseudocódigo;
3. explica por qué el nuevo algoritmo es más fácil de revisar;
4. propone un nombre incorrecto para `c` y explica por qué podría confundir.

---

## 35. Ejercicio 3 — Mostrar no significa modificar

**Nivel:** Seguir  
**Tiempo sugerido:** 4 minutos

Sigue este algoritmo:

```text
INICIO

    entradas_disponibles ← 12
    MOSTRAR entradas_disponibles

    entradas_vendidas ← 3
    entradas_disponibles ← entradas_disponibles - entradas_vendidas

    MOSTRAR entradas_vendidas
    MOSTRAR entradas_disponibles

FIN
```

Responde:

1. ¿Cuáles son las tres salidas y en qué orden aparecen?
2. ¿Qué instrucción modifica `entradas_disponibles`?
3. ¿La primera instrucción `MOSTRAR` cambia algún valor?
4. ¿Cuál es el estado final de cada variable?
5. Construye una tabla de seguimiento.

---

## 36. Ejercicio 4 — La billetera digital

**Nivel:** Seguir y completar  
**Tiempo sugerido:** 5 minutos

```text
INICIO

    saldo ← 50
    recarga ← 20
    saldo ← saldo + recarga

    compra ← 18
    saldo ← saldo - compra

    bonificacion ← 5
    saldo ← saldo + bonificacion

    MOSTRAR saldo

FIN
```

Completa:

| Paso | saldo anterior | Operación | saldo nuevo |
|---:|---:|---|---:|
| Inicial | — | Asignar 50 | |
| Recarga | | | |
| Compra | | | |
| Bonificación | | | |

Después responde:

1. ¿Cuál es la salida?
2. ¿Cuántas veces cambia `saldo`?
3. ¿Qué ocurriría si la compra se restara antes de sumar la recarga?
4. ¿El orden cambiaría el resultado en este caso?
5. Aunque el resultado fuera igual, ¿por qué la tabla mostraría estados intermedios diferentes?

---

## 37. Ejercicio 5 — Algoritmo con tres errores

**Nivel:** Detectar y corregir  
**Tiempo sugerido:** 6 minutos

Este algoritmo debe calcular el total de 3 artículos con precio unitario de 8 y descuento fijo de 4:

```text
INICIO

    precio_unitario ← 8
    cantidad ← 3

    MOSTRAR subtotal
    subtotal ← precio_unitario + cantidad

    total ← subtotal - descuento
    descuento ← 4

    MOSTRAR total

FIN
```

Tareas:

1. encuentra al menos tres errores;
2. explica por qué cada uno produce o puede producir un resultado incorrecto;
3. reordena y corrige el algoritmo;
4. construye una tabla de seguimiento;
5. indica el subtotal y el total correctos.

---

## 38. Ejercicio 6 — Excursión del grupo

**Nivel:** Construir  
**Tiempo sugerido:** 7 minutos

Un grupo de 18 personas contrata un autobús por 270. Además, la alimentación cuesta 6.50 por persona.

Diseña un algoritmo que calcule:

- costo total de la alimentación;
- costo total de la excursión;
- costo por persona.

Debes entregar:

1. entradas, proceso y salidas;
2. una lista de variables con nombres claros;
3. las fórmulas;
4. pseudocódigo;
5. una tabla de seguimiento;
6. los tres resultados.

Todos los datos son válidos. No es necesario construir validaciones ni decisiones.

---

## 39. Ejercicio 7 — Tabla de posiciones

**Nivel:** Construir y justificar  
**Tiempo sugerido:** 7 minutos

En un torneo:

- cada victoria vale 3 puntos;
- cada empate vale 1 punto;
- cada derrota vale 0 puntos.

Diseña un algoritmo que reciba:

- cantidad de victorias;
- cantidad de empates;
- cantidad de derrotas.

Debe calcular y mostrar:

- cantidad total de partidos;
- puntuación total.

Prueba el algoritmo con:

```text
victorias = 5
empates = 2
derrotas = 1
```

Además:

1. escribe la fórmula de partidos jugados;
2. escribe la fórmula de puntos;
3. explica por qué no es necesario multiplicar las derrotas;
4. construye una tabla de seguimiento;
5. cambia el orden de las asignaciones sin utilizar una variable antes de darle valor.

---

# PARTE 10 — RETOS

## 40. Reto 1 — Intercambiar dos valores

**Tiempo sugerido:** 5 minutos

Dos variables contienen:

```text
caja_a ← "rojo"
caja_b ← "azul"
```

Debes conseguir:

```text
caja_a contiene "azul"
caja_b contiene "rojo"
```

No puedes escribir directamente los colores una segunda vez. Solo puedes mover valores entre variables.

Pista: si colocas inmediatamente el valor de `caja_b` dentro de `caja_a`, perderás el valor anterior de `caja_a`. Puede ser necesaria una variable auxiliar.

Entregables:

1. pseudocódigo;
2. tabla de seguimiento;
3. explicación de por qué la variable auxiliar evita perder información.

---

## 41. Reto 2 — Descubrir el valor inicial

**Tiempo sugerido:** 5 minutos

El siguiente algoritmo produce `26`:

```text
INICIO

    base ← valor_desconocido
    doble ← base × 2
    resultado ← doble + 6

    MOSTRAR resultado

FIN
```

Descubre qué valor debe contener `base`.

Después:

1. construye la tabla de seguimiento;
2. explica tu razonamiento desde el resultado hacia la entrada;
3. comprueba la respuesta ejecutando el algoritmo desde el inicio;
4. indica si podría existir más de una respuesta con estas operaciones.

---

# PARTE 11 — MINI PROYECTO

## 42. Calculadora de compra en papel

**Tiempo sugerido:** 25 minutos  
**Modalidad:** Individual  
**Uso de computadora:** Opcional  
**Estructuras permitidas:** Secuencia, variables, operaciones y salida  
**No utilizar:** Condiciones, decisiones, ciclos ni código de un lenguaje

### Situación

Una tienda necesita calcular el total de la compra de un solo producto.

El algoritmo recibirá:

- nombre del producto;
- precio de una unidad;
- cantidad comprada;
- porcentaje de descuento conocido.

El algoritmo calculará:

1. subtotal;
2. valor monetario del descuento;
3. total que debe pagar el cliente.

Finalmente mostrará un comprobante sencillo.

### Fórmulas necesarias

```text
subtotal ← precio_unitario × cantidad

descuento_aplicado ← subtotal × porcentaje_descuento ÷ 100

total_pagar ← subtotal - descuento_aplicado
```

### Alcance

- Se procesa un solo tipo de producto.
- La cantidad es válida y mayor que cero.
- El precio es válido y no es negativo.
- El descuento ya es conocido y se encuentra entre 0 y 100.
- No se calculan impuestos.
- No se calcula envío.
- No se valida la información.
- No se decide si corresponde aplicar el descuento.

Estas suposiciones mantienen el proyecto dentro del contenido del Módulo 2. Las validaciones y decisiones se estudiarán después.

---

## 43. Entregables del mini proyecto

### Parte 1 — Entrada, proceso y salida

Completa:

| Elemento | Datos |
|---|---|
| Entradas | |
| Proceso | |
| Salidas | |

### Parte 2 — Diccionario de variables

Completa una fila por cada variable:

| Variable | Significado | Clase de dato | Origen |
|---|---|---|---|
| | | Numérico, textual o lógico | Entrada o cálculo |

### Parte 3 — Algoritmo numerado

Escribe entre 6 y 10 pasos en lenguaje cotidiano.

Los pasos deben indicar:

- qué datos se reciben;
- qué cálculos se realizan;
- en qué orden;
- qué resultados se muestran.

### Parte 4 — Pseudocódigo

Representa la misma solución utilizando:

```text
INICIO
LEER
←
MOSTRAR
FIN
```

No es necesario seguir la sintaxis de PSeInt ni de otro lenguaje. Debe mantenerse el pseudocódigo neutral del curso.

### Parte 5 — Primera prueba manual

Utiliza obligatoriamente:

```text
producto = "Cuaderno"
precio_unitario = 12.50
cantidad = 4
porcentaje_descuento = 10
```

Resultados esperados:

```text
subtotal = 50
descuento_aplicado = 5
total_pagar = 45
```

Construye una tabla que demuestre cómo se obtienen.

### Parte 6 — Segunda prueba manual

Elige tus propios datos y vuelve a ejecutar el algoritmo.

La segunda prueba debe:

- utilizar un precio diferente;
- utilizar una cantidad diferente;
- utilizar un descuento diferente;
- incluir todos los estados de las variables;
- mostrar el resultado esperado.

Se recomienda utilizar descuento de 0 para comprobar que el total sea igual al subtotal.

### Parte 7 — Comprobante

Diseña una salida similar a:

```text
--------------------------------
        RESUMEN DE COMPRA
--------------------------------
Producto:
Precio unitario:
Cantidad:
Subtotal:
Descuento:
TOTAL:
--------------------------------
```

No se evalúa el diseño gráfico. Se evalúa que la información sea correcta y comprensible.

### Parte 8 — Reflexión

Responde:

1. ¿Qué variable contiene un dato recibido y cuáles contienen datos calculados?
2. ¿Por qué el descuento debe calcularse después del subtotal?
3. ¿Qué error se produciría si se restara directamente el porcentaje al subtotal?
4. ¿Cómo comprobaste que el total era correcto?

---

## 44. Lista de verificación antes de entregar

- [ ] Identifiqué todas las entradas.
- [ ] Utilicé nombres claros.
- [ ] Cada variable tiene un único significado.
- [ ] No utilicé una variable antes de asignarle valor.
- [ ] Calculé el subtotal antes del descuento.
- [ ] Convertí el porcentaje en una cantidad de dinero.
- [ ] Calculé el total después del descuento.
- [ ] Mostré los resultados.
- [ ] Realicé las dos pruebas.
- [ ] Los resultados coinciden con un cálculo manual.
- [ ] No utilicé condiciones ni repeticiones.
- [ ] Mi documento puede leerse con facilidad.

---

## 45. Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Identificación de entradas, proceso y salidas | 10 |
| Diccionario y nombres de variables | 15 |
| Fórmulas y orden de los cálculos | 20 |
| Pseudocódigo claro y completo | 20 |
| Tablas de seguimiento y resultados | 20 |
| Comprobante final | 10 |
| Reflexión | 5 |
| **Total** | **100** |

### Criterios de dominio

| Resultado | Interpretación |
|---:|---|
| 90–100 | Dominio sólido |
| 75–89 | Módulo aprobado |
| 60–74 | Requiere una corrección y nueva entrega |
| Menos de 60 | Conviene repasar y reconstruir el proyecto |

No se le penalizará por utilizar palabras diferentes a las del ejemplo si la lógica es clara y correcta.

---

## 46. Punto de entrega

Los ejercicios de práctica se realizan para aprender y no requieren un formulario independiente.

Realizará **una sola entrega al finalizar el módulo**.

### Archivo

Reunir las ocho partes del mini proyecto en un PDF:

```text
Modulo2_Nombre_Apellido.pdf
```

El documento debe incluir:

1. nombre completo;
2. nombre del curso;
3. Módulo 2;
4. fecha;
5. todas las partes en el orden solicitado.

Las tablas y el pseudocódigo pueden hacerse a mano, siempre que las fotografías sean claras y se integren en un único PDF.

[Entregar el mini proyecto mediante el formulario del curso](https://forms.gle/BayPBDiXAGurWjnL6)

### Indicación para el formulario

En el campo correspondiente al ejercicio o entrega, escribir:

```text
Módulo 2 — Mini proyecto: Calculadora de compra en papel
```

---

# PARTE 12 — SOLUCIONES EXPLICADAS

> Intente todos los ejercicios antes de consultar esta sección.

## 47. Solución del diagnóstico

```text
30 + 20 - 8 + 5 = 47
```

Quedan 47 monedas.

La cantidad que cambia es el saldo de monedas. Para reconstruir el proceso debe anotarse el valor después de cada operación:

```text
30 → 50 → 42 → 47
```

---

## 48. Solución del ejercicio 1

| Variable | Clase | Significado |
|---|---|---|
| `nombre_usuario` | Textual | Nombre de la persona |
| `cantidad_prestamos` | Numérico | Cantidad de libros prestados |
| `deuda` | Numérico | Dinero pendiente |
| `membresia_activa` | Lógico | Indica si la membresía está activa |
| `codigo_estante` | Textual | Identificador del estante |

`"A-12"` es un identificador. Aunque contiene números, no representa una cantidad para sumar, restar, multiplicar o dividir.

---

## 49. Solución del ejercicio 2

Una solución clara:

```text
precio_batido ← 2.50
cantidad_vendida ← 4
dinero_obtenido ← precio_batido × cantidad_vendida
sabor_batido ← "Mango"
```

Los nombres permiten interpretar el algoritmo sin memorizar el significado de cada letra.

Un nombre incorrecto para `dinero_obtenido` sería `cantidad_total`, porque podría confundirse con la cantidad de batidos y no indica que se trata de dinero.

---

## 50. Solución del ejercicio 3

Salidas:

```text
12
3
9
```

La instrucción que cambia las entradas disponibles es:

```text
entradas_disponibles ← entradas_disponibles - entradas_vendidas
```

`MOSTRAR` no modifica valores.

Estado final:

```text
entradas_disponibles = 9
entradas_vendidas = 3
```

| Paso | entradas_disponibles | entradas_vendidas | Salida |
|---:|---:|---:|---|
| 1 | 12 | — | — |
| 2 | 12 | — | 12 |
| 3 | 12 | 3 | 12 |
| 4 | 9 | 3 | 12 |
| 5 | 9 | 3 | 3 |
| 6 | 9 | 3 | 9 |

---

## 51. Solución del ejercicio 4

| Paso | saldo anterior | Operación | saldo nuevo |
|---:|---:|---|---:|
| Inicial | — | Asignar 50 | 50 |
| Recarga | 50 | `50 + 20` | 70 |
| Compra | 70 | `70 - 18` | 52 |
| Bonificación | 52 | `52 + 5` | 57 |

Salida:

```text
57
```

`saldo` recibe cuatro valores: 50, 70, 52 y 57.

Si se resta 18 antes de sumar 20:

```text
50 - 18 + 20 + 5 = 57
```

El resultado final coincide porque solo se suman y restan las mismas cantidades. Sin embargo, los estados intermedios cambian. En un problema real esos estados pueden importar.

---

## 52. Solución del ejercicio 5

Errores:

1. Se muestra `subtotal` antes de calcularlo.
2. Se suma precio y cantidad en vez de multiplicarlos.
3. Se utiliza `descuento` antes de asignarle valor.

Versión corregida:

```text
INICIO

    precio_unitario ← 8
    cantidad ← 3

    subtotal ← precio_unitario × cantidad

    descuento ← 4
    total ← subtotal - descuento

    MOSTRAR subtotal
    MOSTRAR total

FIN
```

Resultados:

```text
subtotal = 24
total = 20
```

---

## 53. Solución del ejercicio 6

### Variables

```text
cantidad_personas
costo_autobus
alimentacion_por_persona
costo_alimentacion
costo_total
costo_por_persona
```

### Pseudocódigo

```text
INICIO

    cantidad_personas ← 18
    costo_autobus ← 270
    alimentacion_por_persona ← 6.50

    costo_alimentacion ← cantidad_personas × alimentacion_por_persona
    costo_total ← costo_autobus + costo_alimentacion
    costo_por_persona ← costo_total ÷ cantidad_personas

    MOSTRAR costo_alimentacion
    MOSTRAR costo_total
    MOSTRAR costo_por_persona

FIN
```

Resultados:

```text
costo_alimentacion = 117
costo_total = 387
costo_por_persona = 21.50
```

---

## 54. Solución del ejercicio 7

### Fórmulas

```text
partidos_jugados ← victorias + empates + derrotas
puntos_totales ← victorias × 3 + empates
```

### Pseudocódigo

```text
INICIO

    LEER victorias
    LEER empates
    LEER derrotas

    partidos_jugados ← victorias + empates + derrotas
    puntos_totales ← victorias × 3 + empates

    MOSTRAR partidos_jugados
    MOSTRAR puntos_totales

FIN
```

Con los datos propuestos:

```text
partidos_jugados = 5 + 2 + 1 = 8
puntos_totales = 5 × 3 + 2 = 17
```

No es necesario multiplicar las derrotas porque aportan cero puntos:

```text
derrotas × 0 = 0
```

---

## 55. Solución del reto 1

```text
INICIO

    caja_a ← "rojo"
    caja_b ← "azul"

    auxiliar ← caja_a
    caja_a ← caja_b
    caja_b ← auxiliar

FIN
```

| Paso | caja_a | caja_b | auxiliar |
|---:|---|---|---|
| Inicial | `"rojo"` | `"azul"` | — |
| 1 | `"rojo"` | `"azul"` | `"rojo"` |
| 2 | `"azul"` | `"azul"` | `"rojo"` |
| 3 | `"azul"` | `"rojo"` | `"rojo"` |

La variable `auxiliar` conserva temporalmente el valor que se habría perdido.

---

## 56. Solución del reto 2

Resultado final:

```text
26
```

Deshacer la suma:

```text
26 - 6 = 20
```

Deshacer la multiplicación:

```text
20 ÷ 2 = 10
```

Por tanto:

```text
base = 10
```

Comprobación:

```text
doble = 10 × 2 = 20
resultado = 20 + 6 = 26
```

Con estas operaciones existe una única respuesta.

---

## 57. Solución de referencia del mini proyecto

Consulte esta solución después de realizar su entrega o cuando decida utilizar la ayuda.

### Entrada, proceso y salida

| Elemento | Datos |
|---|---|
| Entradas | producto, precio unitario, cantidad, porcentaje de descuento |
| Proceso | calcular subtotal, descuento aplicado y total |
| Salidas | datos de la compra y total a pagar |

### Diccionario

| Variable | Significado | Clase | Origen |
|---|---|---|---|
| `producto` | Nombre del producto | Textual | Entrada |
| `precio_unitario` | Precio de una unidad | Numérico | Entrada |
| `cantidad` | Unidades compradas | Numérico | Entrada |
| `porcentaje_descuento` | Porcentaje aplicado | Numérico | Entrada |
| `subtotal` | Precio antes del descuento | Numérico | Cálculo |
| `descuento_aplicado` | Dinero descontado | Numérico | Cálculo |
| `total_pagar` | Importe final | Numérico | Cálculo |

### Algoritmo numerado

1. Recibir el nombre del producto.
2. Recibir el precio de una unidad.
3. Recibir la cantidad comprada.
4. Recibir el porcentaje de descuento.
5. Multiplicar precio por cantidad para obtener el subtotal.
6. Calcular el porcentaje indicado del subtotal.
7. Restar el descuento al subtotal.
8. Mostrar el resumen de la compra.

### Pseudocódigo

```text
INICIO

    LEER producto
    LEER precio_unitario
    LEER cantidad
    LEER porcentaje_descuento

    subtotal ← precio_unitario × cantidad
    descuento_aplicado ← subtotal × porcentaje_descuento ÷ 100
    total_pagar ← subtotal - descuento_aplicado

    MOSTRAR producto
    MOSTRAR precio_unitario
    MOSTRAR cantidad
    MOSTRAR subtotal
    MOSTRAR descuento_aplicado
    MOSTRAR total_pagar

FIN
```

### Prueba obligatoria

| Paso | producto | precio_unitario | cantidad | porcentaje_descuento | subtotal | descuento_aplicado | total_pagar |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | `"Cuaderno"` | — | — | — | — | — | — |
| 2 | `"Cuaderno"` | 12.50 | — | — | — | — | — |
| 3 | `"Cuaderno"` | 12.50 | 4 | — | — | — | — |
| 4 | `"Cuaderno"` | 12.50 | 4 | 10 | — | — | — |
| 5 | `"Cuaderno"` | 12.50 | 4 | 10 | 50 | — | — |
| 6 | `"Cuaderno"` | 12.50 | 4 | 10 | 50 | 5 | — |
| 7 | `"Cuaderno"` | 12.50 | 4 | 10 | 50 | 5 | 45 |

### Comprobante

```text
--------------------------------
        RESUMEN DE COMPRA
--------------------------------
Producto: Cuaderno
Precio unitario: 12.50
Cantidad: 4
Subtotal: 50
Descuento: 5
TOTAL: 45
--------------------------------
```

---

# PARTE 13 — EVALUACIÓN

## 58. Evaluación de dominio

### Pregunta 1

¿Cuál opción describe mejor una variable?

A. Una operación que siempre suma.  
B. Un espacio con nombre que conserva un valor.  
C. Una instrucción que solo muestra mensajes.  
D. Un dato que nunca cambia.

### Pregunta 2

Después de ejecutar:

```text
puntos ← 7
puntos ← puntos + 3
```

¿Cuál es el valor de `puntos`?

A. 3  
B. 7  
C. 10  
D. No puede saberse

### Pregunta 3

¿Qué instrucción recibe un dato y lo almacena?

A. `MOSTRAR precio`  
B. `LEER precio`  
C. `precio > 10`  
D. `FIN`

### Pregunta 4

¿Qué clase de dato es `"50612345678"` cuando representa un teléfono?

A. Numérico  
B. Textual  
C. Lógico  
D. Operación

### Pregunta 5

Si:

```text
precio ← 8
cantidad ← 4
subtotal ← precio × cantidad
```

¿Cuál es el subtotal?

A. 12  
B. 24  
C. 32  
D. 84

### Pregunta 6

¿Cuál expresión calcula correctamente el promedio de tres notas?

A. `nota_1 + nota_2 + nota_3 ÷ 3`  
B. `(nota_1 + nota_2 + nota_3) ÷ 3`  
C. `nota_1 × nota_2 × nota_3`  
D. `3 ÷ nota_1 + nota_2 + nota_3`

### Pregunta 7

Si `total` contiene 25, ¿qué produce `total ≥ 30`?

A. 25  
B. 30  
C. `VERDADERO`  
D. `FALSO`

### Pregunta 8

¿Cuál afirmación es correcta?

A. `MOSTRAR saldo` aumenta el saldo.  
B. Una variable puede utilizarse antes de recibir valor.  
C. Asignar un valor nuevo reemplaza el valor anterior.  
D. Una comparación siempre produce un número.

---

## 59. Respuestas de la evaluación

| Pregunta | Respuesta | Explicación |
|---:|:---:|---|
| 1 | B | Una variable conserva un valor bajo un nombre. |
| 2 | C | Se consulta 7, se suma 3 y se guarda 10. |
| 3 | B | `LEER` recibe y almacena un dato. |
| 4 | B | Se utiliza como identificador, no para calcular. |
| 5 | C | `8 × 4 = 32`. |
| 6 | B | Los paréntesis obligan a sumar antes de dividir. |
| 7 | D | 25 no es mayor ni igual que 30. |
| 8 | C | La nueva asignación reemplaza el contenido anterior. |

### Criterio recomendado

- **7–8 respuestas correctas:** puede continuar.
- **5–6:** revisar errores y repetir los ejercicios relacionados.
- **0–4:** volver a estudiar ejemplos y tablas antes de avanzar.

---

## 60. Autoevaluación

Marca `Sí`, `Con ayuda` o `Todavía no`.

| Puedo… | Sí | Con ayuda | Todavía no |
|---|:---:|:---:|:---:|
| explicar qué es un dato | | | |
| explicar qué es una variable | | | |
| diferenciar nombre y valor | | | |
| asignar y actualizar valores | | | |
| distinguir `LEER`, asignar y `MOSTRAR` | | | |
| reconocer números, textos y valores lógicos | | | |
| construir una expresión aritmética | | | |
| interpretar una comparación | | | |
| seguir variables mediante una tabla | | | |
| diseñar un algoritmo de cálculo sencillo | | | |

Si marcas “Todavía no” en asignación, actualización o seguimiento, repite los ejercicios 3, 4 y 5 antes del Módulo 3.

---

# PARTE 14 — RECURSOS

## 61. Video opcional con PSeInt

[Variables: Escritura, Lectura y Asignación PSeInt — Cátedra Desarrollo de Sistemas UNED](https://www.youtube.com/watch?v=kMxbcbmAZZs)

**Duración:** 4 minutos y 42 segundos  
**Canal:** Cátedra Desarrollo de Sistemas, Universidad Estatal a Distancia de Costa Rica  
**Tema exacto:** Definición, lectura, escritura y asignación de variables  
**Advertencia:** PSeInt utiliza su propia sintaxis. Concéntrese en las ideas, no en memorizar los comandos.  

---

## 62. Lecturas y documentación

### Lectura esencial breve

[Variable — Glosario de MDN](https://developer.mozilla.org/es/docs/Glossary/Variable)

Define una variable como una ubicación nombrada que permite almacenar un valor. Es una lectura breve para reforzar la idea central.

### Consulta de pseudocódigo

[Pseudocódigo, tipos de datos y operadores — Documentación oficial de PSeInt](https://pseint.sourceforge.net/index.php?page=pseudocodigo.php)

Incluye tipos de datos, operadores y jerarquía de operaciones. No es necesario memorizar la sintaxis de PSeInt.

### Ampliación opcional

[Almacenando la información que necesitas: variables — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Variables)

Utiliza JavaScript en sus ejemplos. Debe leerse únicamente para observar que los conceptos de nombre, valor, asignación y actualización también aparecen en un lenguaje real.

### Consulta de operaciones

[Matemáticas básicas: números y operadores — MDN](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Math)

Explica operaciones, asignación y precedencia. Sus símbolos pertenecen a JavaScript, por lo que la lectura es opcional.

---

# PARTE 15 — GLOSARIO

## 63. Conceptos del módulo

**Actualización:** cálculo y almacenamiento de un valor nuevo en una variable que ya contenía otro valor.

**Asignación:** acción de guardar un valor en una variable.

**Comparación:** operación que determina si una relación entre valores es verdadera o falsa.

**Dato:** valor que puede recibirse, almacenarse, procesarse o producirse.

**Dato lógico:** valor que representa `VERDADERO` o `FALSO`.

**Dato numérico:** valor que representa una cantidad y puede participar en cálculos.

**Dato textual:** caracteres que representan nombres, mensajes o identificadores.

**Entrada:** dato que el algoritmo recibe.

**Estado:** conjunto de valores actuales de las variables en un momento determinado.

**Expresión:** combinación de valores, variables y operaciones que produce un resultado.

**Literal:** valor escrito directamente, como `10`, `"Ana"` o `VERDADERO`.

**Nombre de variable:** identificador utilizado para consultar o modificar un dato.

**Operador:** símbolo que representa una operación, como `+`, `×` o `≥`.

**Salida:** dato que el algoritmo comunica.

**Tabla de seguimiento:** registro paso a paso de los valores de las variables y las salidas.

**Valor:** contenido actual de una variable.

**Variable:** espacio con nombre que permite conservar un valor.

---

# PARTE 16 — CIERRE

## 64. Resumen visual

```text
LEER precio
      ↓
precio contiene un dato
      ↓
LEER cantidad
      ↓
subtotal ← precio × cantidad
      ↓
subtotal contiene un dato calculado
      ↓
MOSTRAR subtotal
      ↓
el valor se comunica sin modificarse
```

### Cinco ideas fundamentales

1. Un algoritmo trabaja con datos.
2. Una variable permite recordar un valor mediante un nombre.
3. Asignar reemplaza el valor actual.
4. Una expresión transforma datos y produce un resultado.
5. Una tabla permite comprobar cada cambio.

---

## 65. Habilidades obtenidas

Al completar el módulo, habrá practicado:

- identificación de datos;
- modelado mediante variables;
- asignación;
- actualización del estado;
- entrada y salida;
- cálculo de valores derivados;
- operaciones aritméticas;
- porcentajes sencillos;
- comparaciones;
- nombres claros;
- pseudocódigo secuencial;
- tablas de seguimiento;
- comprobación manual de resultados.

---

## 66. Puente hacia el Módulo 3

En este módulo podemos calcular:

```text
puede_pagar ← dinero_disponible ≥ total
```

El resultado puede ser:

```text
VERDADERO
```

o:

```text
FALSO
```

Pero todavía falta responder:

> ¿Qué debe hacer el algoritmo en cada caso?

El Módulo 3, **Lógica y toma de decisiones**, enseñará a utilizar condiciones para construir caminos diferentes:

```text
SI puede_pagar ENTONCES
    ...
SINO
    ...
FIN SI
```

No avances hasta poder explicar con seguridad cómo cambia el valor de una variable durante una secuencia de instrucciones.
