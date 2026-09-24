# COA — Lógica de Programación

# Módulo 6: Proyecto final — Sistema de pedidos para una cafetería

**Duración obligatoria:** 3 horas y 30 minutos  
**Nivel:** Principiante absoluto  
**Conocimientos previos:** Módulos 1, 2, 3, 4 y 5 aprobados  
**Modalidad:** Proyecto práctico e independiente de cualquier lenguaje  
**Entrega:** Un único archivo con todo el proyecto  
**Materiales:** Papel, lápiz y calculadora sencilla  
**Herramientas opcionales:** Editor de texto, PSeInt y diagrams.net

---

## 1. Objetivo del módulo

Integrar todos los aprendizajes del curso en el diseño, representación, comprobación y explicación de un algoritmo completo.

Al terminar el proyecto, podrá demostrar que sabe:

- comprender una situación antes de intentar resolverla;
- convertir una descripción en requisitos verificables;
- identificar entradas, procesos, decisiones, repeticiones y salidas;
- elegir variables y explicar qué representa cada una;
- realizar cálculos en el orden correcto;
- validar datos;
- tomar decisiones con condiciones simples y combinadas;
- repetir un proceso hasta recibir un centinela;
- utilizar contadores y acumuladores;
- evitar divisiones entre cero;
- expresar una solución mediante pseudocódigo;
- representar la misma solución con un diagrama de flujo;
- diseñar casos normales, límite, inválidos y sin datos;
- realizar una prueba de escritorio;
- localizar y corregir errores;
- demostrar el funcionamiento mediante evidencia;
- comunicar una solución de manera comprensible.

> El proyecto no exige escribir código en Python, Java, JavaScript, C# ni ningún otro lenguaje. Su propósito es comprobar que usted ya sabe pensar y trabajar como programador antes de aprender una sintaxis concreta.

---

## 2. Resultado final

Construirá un sistema lógico para registrar pedidos en la **Cafetería COA**.

El sistema permitirá:

- seleccionar productos;
- ingresar cantidades;
- rechazar datos inválidos;
- calcular importes;
- acumular un pedido;
- aplicar un descuento;
- calcular el costo de entrega;
- producir un resumen final;
- terminar correctamente cuando se ingrese un centinela.

El trabajo final incluirá:

1. análisis del problema;
2. matriz de requisitos;
3. tabla de entradas, procesos y salidas;
4. tabla de variables;
5. ejemplos calculados manualmente;
6. plan de pruebas;
7. pseudocódigo;
8. diagrama de flujo;
9. prueba de escritorio;
10. informe de resultados;
11. correcciones realizadas;
12. reflexión final.

---

## 3. Distribución exacta del tiempo

| Etapa | Producto de la etapa | Tiempo |
|---|---|---:|
| Presentación y comprensión | Resumen del problema | 15 min |
| Requisitos y datos | Matrices completas | 20 min |
| Diseño de ejemplos y pruebas | Resultados esperados | 35 min |
| Construcción del pseudocódigo | Algoritmo completo | 45 min |
| Construcción del diagrama | Representación equivalente | 35 min |
| Prueba de escritorio y corrección | Evidencia de funcionamiento | 30 min |
| Documentación y armado | Archivo final organizado | 20 min |
| Evaluación, reflexión y entrega | Cierre del curso | 10 min |
| **Total** |  | **210 min** |

## 4. Orden recomendado

```text
1. LEER EL PROBLEMA COMPLETO
             ↓
2. SUBRAYAR REGLAS Y LÍMITES
             ↓
3. DEFINIR ENTRADAS Y SALIDAS
             ↓
4. ELEGIR VARIABLES
             ↓
5. CALCULAR EJEMPLOS A MANO
             ↓
6. DISEÑAR CASOS DE PRUEBA
             ↓
7. ESCRIBIR PSEUDOCÓDIGO
             ↓
8. CREAR DIAGRAMA DE FLUJO
             ↓
9. REALIZAR PRUEBA DE ESCRITORIO
             ↓
10. CORREGIR Y REPETIR PRUEBAS
             ↓
11. EXPLICAR Y ENTREGAR
```

No se recomienda comenzar por el diagrama o por el pseudocódigo. Una representación ordenada de una idea incorrecta continúa siendo una solución incorrecta.

---

# PARTE 1 — PREPARACIÓN

## 5. Video de inicio: analizar antes de escribir

[Cómo analizar un problema antes de escribir el algoritmo — Carlos Master Web](https://www.youtube.com/watch?v=TePg7sCJr8E)

**Duración:** 4 minutos y 39 segundos  
**Canal:** Carlos Master Web  
**Tema exacto:** Comprender el problema, reconocer entradas y salidas y planificar antes de escribir el algoritmo  

### Pregunta antes de continuar

Después del video, complete:

> Antes de escribir un algoritmo necesito saber ____________, recibir ____________, aplicar ____________ y producir ____________.

No existe una única redacción correcta. La respuesta debe mencionar:

- qué problema se resuelve;
- qué datos ingresan;
- qué reglas se aplican;
- qué resultados deben mostrarse.

---

## 6. Regla principal del proyecto

> Primero se demuestra que se comprendió el problema. Después se construye la solución.

Puede escribir un pseudocódigo con apariencia correcta y aun así resolver otro problema.

Por ejemplo:

```text
Requisito:
Las compras de 30 o más reciben 10 % de descuento.

Interpretación incorrecta:
Las compras mayores que 30 reciben 10 %.
```

El error parece pequeño, pero cambia el resultado exacto para 30.

El proyecto será evaluado por correspondencia:

```text
REQUISITO ↔ PSEUDOCÓDIGO ↔ DIAGRAMA ↔ PRUEBA
```

Si las cuatro partes no expresan la misma regla, existe una inconsistencia.

---

# PARTE 2 — SITUACIÓN DEL PROYECTO

## 7. Cafetería COA

Una cafetería necesita organizar los pedidos realizados por una persona.

La persona puede agregar varias líneas de productos. En cada línea selecciona un producto e indica una cantidad.

El sistema debe:

- reconocer el producto;
- comprobar la cantidad;
- calcular el importe de la línea;
- acumular los datos válidos;
- permitir agregar más productos;
- terminar cuando se ingrese el código 0;
- aplicar las reglas finales;
- mostrar un resumen.

No se necesitan listas, arreglos, funciones, bases de datos, interfaces gráficas ni un lenguaje de programación.

---

## 8. Catálogo

| Código | Producto | Precio por unidad |
|---:|---|---:|
| 1 | Sándwich | 4 |
| 2 | Bebida | 2 |
| 3 | Postre | 3 |
| 0 | Finalizar pedido | No aplica |

Los precios están expresados en unidades monetarias y se mantienen sin impuestos para concentrar el proyecto en la lógica.

---

## 9. Requisitos completos

### Registro de productos

1. El sistema comienza con todos los contadores y totales en 0.
2. Se solicita un código de producto.
3. El código 0 termina el registro.
4. El código 0 no representa un producto y nunca debe contarse.
5. Los códigos válidos son 1, 2 y 3.
6. Cualquier otro código es inválido.
7. Un código inválido muestra `"Código inválido"`.
8. Cuando el código es inválido, no se solicita cantidad para esa línea.
9. Después de un código inválido, se solicita otro código.

### Cantidades

10. Para un producto válido se solicita una cantidad.
11. Las cantidades válidas están entre 1 y 10, ambos incluidos.
12. Una cantidad menor que 1 o mayor que 10 es inválida.
13. Una cantidad inválida muestra `"Cantidad inválida"`.
14. Una línea con cantidad inválida no aumenta los totales válidos.
15. Después de una cantidad inválida, se solicita un nuevo código.

### Cálculo y acumulación

16. El precio se determina según el código.
17. El importe de una línea válida se calcula así:

```text
importe_linea = precio × cantidad
```

18. Cada línea válida aumenta en 1 la cantidad de líneas válidas.
19. Las unidades compradas se acumulan.
20. El importe de cada línea válida se suma al subtotal.
21. Cada código o cantidad inválidos aumenta en 1 el contador de entradas inválidas.
22. Después de cada línea se solicita un nuevo código.

### Descuento

23. Si no existe ninguna línea válida, se muestra `"No se registraron productos válidos"`.
24. Si no existen líneas válidas, no se calcula promedio ni se solicita tipo de entrega.
25. Un subtotal menor que 30 no recibe descuento.
26. Un subtotal de 30 o más recibe un descuento del 10 %.
27. El descuento se calcula sobre el subtotal.
28. El importe después del descuento se calcula así:

```text
importe_con_descuento = subtotal - descuento
```

### Entrega

29. Si existe al menos una línea válida, se solicita un tipo de entrega.
30. El valor 1 significa `"Recoger en el local"`.
31. El valor 2 significa `"Entrega a domicilio"`.
32. Cualquier otro valor es inválido.
33. Si el tipo de entrega es inválido, se vuelve a solicitar hasta recibir 1 o 2.
34. Recoger en el local cuesta 0.
35. La entrega a domicilio cuesta 3 cuando el importe con descuento es menor que 40.
36. La entrega a domicilio es gratuita cuando el importe con descuento es 40 o más.

### Resumen

37. El total final se calcula así:

```text
total_final = importe_con_descuento + costo_entrega
```

38. El promedio ajustado por unidad se calcula así:

```text
promedio_por_unidad = importe_con_descuento / total_unidades
```

39. El promedio no incluye el costo de entrega.
40. El resumen muestra:
    - líneas válidas;
    - unidades compradas;
    - entradas inválidas;
    - subtotal;
    - descuento;
    - costo de entrega;
    - total final;
    - promedio ajustado por unidad.

---

## 10. Lo que el proyecto no solicita

No agregue:

- nombres de clientes;
- inventario;
- pago con tarjeta;
- impuestos;
- propinas;
- cupones;
- almacenamiento permanente;
- varios pedidos de clientes distintos;
- productos adicionales;
- menús visuales complejos;
- funciones o procedimientos;
- arreglos o listas;
- código de un lenguaje real.

Agregar elementos no solicitados consume tiempo, introduce errores y dificulta comprobar los requisitos.

> Resolver bien un alcance pequeño es mejor que construir parcialmente un sistema enorme.

---

# PARTE 3 — CINCO EJERCICIOS PREPARATORIOS

No entregue por separado los cinco ejercicios siguientes. Incorpore sus respuestas al documento del proyecto.

## 11. Ejercicio 1 — Explique el problema sin copiar

### Enunciado

Imagine que debe explicarle el sistema a una persona que no leyó los requisitos.

Redacte un párrafo de cinco a ocho oraciones que explique:

1. qué información ingresa;
2. cómo termina el registro;
3. qué datos se consideran válidos;
4. qué se acumula;
5. cuándo existe descuento;
6. cómo funciona la entrega;
7. qué resultados aparecen.

### Restricción

No copie literalmente la lista de requisitos.

### Evidencia de comprensión

Una explicación correcta debe dejar claro que:

- un pedido tiene varias líneas;
- 0 finaliza;
- código y cantidad se validan por separado;
- los datos inválidos no modifican subtotal ni unidades;
- primero se calcula el descuento y luego la entrega;
- el promedio no incluye la entrega.

---

## 12. Ejercicio 2 — Organice entradas, procesos y salidas

### Enunciado

Complete la tabla:

| Elemento | Tipo: entrada, proceso o salida | Explicación |
|---|---|---|
| Código de producto |  |  |
| Cantidad |  |  |
| Tipo de entrega |  |  |
| Determinar precio |  |  |
| Calcular importe de línea |  |  |
| Acumular unidades |  |  |
| Calcular descuento |  |  |
| Calcular costo de entrega |  |  |
| Líneas válidas |  |  |
| Total final |  |  |
| Mensaje de error |  |  |
| Promedio por unidad |  |  |

### Preguntas

1. ¿El subtotal es entrada, proceso o salida?
2. ¿Puede un mismo dato participar en un proceso y mostrarse como salida?
3. ¿Por qué el precio no necesita solicitarse?
4. ¿Por qué el código 0 debe comprobarse antes de solicitar cantidad?

---

## 13. Ejercicio 3 — Diseñe las variables

### Enunciado

Complete una tabla de variables antes de escribir pseudocódigo.

| Variable | Qué representa | Valor inicial | Cuándo cambia |
|---|---|---:|---|
| `codigo` |  |  |  |
| `cantidad` |  |  |  |
| `precio` |  |  |  |
| `importe_linea` |  |  |  |
| `lineas_validas` |  |  |  |
| `total_unidades` |  |  |  |
| `entradas_invalidas` |  |  |  |
| `subtotal` |  |  |  |
| `descuento` |  |  |  |
| `importe_con_descuento` |  |  |  |
| `tipo_entrega` |  |  |  |
| `costo_entrega` |  |  |  |
| `total_final` |  |  |  |
| `promedio_por_unidad` |  |  |  |

### Preguntas de razonamiento

1. ¿Qué variables son contadores?
2. ¿Qué variables son acumuladores?
3. ¿Qué variables se reemplazan en cada línea?
4. ¿Qué variables se calculan únicamente al terminar?
5. ¿Por qué `subtotal ← importe_linea` sería incorrecto?
6. ¿Por qué `lineas_validas ← 1` sería incorrecto?

---

## 14. Ejercicio 4 — Calcule un pedido a mano

### Enunciado

Procese manualmente:

```text
Código 1, cantidad 5
Código 2, cantidad 5
Código 0
Tipo de entrega 2
```

Complete:

| Concepto | Cálculo | Resultado |
|---|---|---:|
| Sándwiches |  |  |
| Bebidas |  |  |
| Subtotal |  |  |
| Descuento |  |  |
| Importe con descuento |  |  |
| Costo de entrega |  |  |
| Total final |  |  |
| Total de unidades |  |  |
| Promedio ajustado por unidad |  |  |

### Preguntas

1. ¿Cuántas líneas válidas existen?
2. ¿Cuántas unidades existen?
3. ¿Se aplica descuento exactamente en 30?
4. ¿La entrega es gratuita?
5. ¿Qué cálculo debe hacerse antes de decidir el costo de entrega?

---

## 15. Ejercicio 5 — Prediga antes de construir

### Enunciado

Sin escribir todavía el algoritmo completo, determine qué debe ocurrir con cada secuencia:

### Caso A

```text
Código 0
```

### Caso B

```text
Código 9
Código 1, cantidad 0
Código 3, cantidad 2
Código 0
Tipo de entrega 1
```

### Caso C

```text
Código 2, cantidad 10
Código 1, cantidad 10
Código 0
Tipo de entrega 2
```

Para cada caso indique:

- líneas válidas;
- unidades;
- entradas inválidas;
- subtotal;
- descuento;
- importe con descuento;
- entrega;
- total;
- promedio o mensaje.

### Objetivo

Defina los resultados esperados antes del algoritmo para evitar adaptar la respuesta a lo que produzca su solución.

---

# PARTE 4 — DISEÑO DEL PROYECTO

## 16. Matriz de requisitos

El documento final debe incluir una matriz.

No es necesario copiar las 40 reglas como 40 filas. Se pueden agrupar sin perder información.

Utilice como mínimo estos grupos:

| ID | Grupo | Requisito verificable | Evidencia |
|---|---|---|---|
| R1 | Inicialización | Contadores y totales comienzan en 0 | Primera fila del rastreo |
| R2 | Centinela | 0 termina y no solicita cantidad | Caso sin datos |
| R3 | Códigos | Solo 1, 2 y 3 son válidos | Caso inválido |
| R4 | Cantidades | Solo 1 a 10 son válidas | Casos de límite |
| R5 | Precios | 1→4, 2→2, 3→3 | Tres líneas de ejemplo |
| R6 | Acumulación | Cuenta líneas y suma unidades e importes | Prueba de escritorio |
| R7 | Descuento | Desde subtotal 30 se aplica 10 % | Casos antes y después |
| R8 | Entrega | 1 cuesta 0; 2 cuesta 3 o 0 según 40 | Casos de entrega |
| R9 | Resumen | Calcula total y promedio protegido | Caso válido y caso vacío |

Puede dividir los grupos si desea mayor precisión.

---

## 17. Tabla de decisiones

Antes del pseudocódigo, complete:

### Decisión del producto

| Condición | Acción |
|---|---|
| `codigo = 0` |  |
| `codigo = 1` |  |
| `codigo = 2` |  |
| `codigo = 3` |  |
| Cualquier otro |  |

### Decisión de cantidad

| Condición | Acción |
|---|---|
| `cantidad < 1` |  |
| `1 ≤ cantidad ≤ 10` |  |
| `cantidad > 10` |  |

### Decisión de descuento

| Condición | Descuento |
|---|---:|
| `subtotal < 30` |  |
| `subtotal ≥ 30` |  |

### Decisión de entrega

| Tipo | Importe con descuento | Costo |
|---:|---:|---:|
| 1 | Cualquier importe |  |
| 2 | Menor que 40 |  |
| 2 | 40 o más |  |
| Otro | No aplica |  |

---

## 18. Descomposición

Divida la solución en cinco bloques.

```text
BLOQUE A — PREPARAR
Inicializar contadores y acumuladores.

BLOQUE B — REGISTRAR
Leer códigos hasta recibir 0.

BLOQUE C — VALIDAR Y ACUMULAR
Validar código, leer cantidad, validar cantidad,
determinar precio y actualizar totales.

BLOQUE D — CALCULAR EL CIERRE
Aplicar descuento, validar entrega, calcular total y promedio.

BLOQUE E — MOSTRAR
Presentar mensaje vacío o resumen completo.
```

### Pregunta de control

¿En qué bloque debe aparecer cada acción?

- `subtotal ← 0`
- `LEER codigo`
- `precio ← 3`
- `total_unidades ← total_unidades + cantidad`
- `descuento ← subtotal × 0.10`
- `LEER tipo_entrega`
- `MOSTRAR total_final`

---

## 19. Esqueleto del algoritmo

Antes de completar los detalles, escriba la estructura:

```text
INICIO
    INICIALIZAR

    LEER primer código

    MIENTRAS no sea el centinela
        VALIDAR código

        SI el código es válido
            DETERMINAR precio
            LEER cantidad
            VALIDAR cantidad

            SI la cantidad es válida
                CALCULAR línea
                ACTUALIZAR contadores y subtotal
            SINO
                REGISTRAR entrada inválida
            FIN SI
        SINO
            REGISTRAR entrada inválida
        FIN SI

        LEER nuevo código
    FIN MIENTRAS

    SI existen líneas válidas
        CALCULAR descuento
        VALIDAR tipo de entrega
        CALCULAR entrega
        CALCULAR total y promedio
        MOSTRAR resumen
    SINO
        MOSTRAR mensaje sin productos
    FIN SI
FIN
```

Este esqueleto organiza la lógica, pero no constituye todavía la solución entregable.

---

# PARTE 5 — PSEUDOCÓDIGO

## 20. Reglas de escritura

El pseudocódigo:

- puede redactarse a mano o digitalmente;
- no necesita seguir la sintaxis exacta de un lenguaje;
- debe utilizar sangría;
- debe distinguir lectura, asignación, condición, repetición y salida;
- debe conservar nombres de variables coherentes;
- debe mostrar con claridad dónde termina cada bloque;
- debe poder ser comprendido por otra persona;
- debe corresponder con el diagrama.

### Palabras sugeridas

```text
INICIO
FIN
LEER
MOSTRAR
SI
ENTONCES
SINO
FIN SI
MIENTRAS
HACER
FIN MIENTRAS
REPETIR
HASTA QUE
```

No existe obligación de utilizar exactamente esas palabras si la notación elegida es clara y consistente.

---

## 21. Orden interno recomendado

### Paso 1 — Inicializar

Identifique qué valores deben comenzar en 0.

### Paso 2 — Realizar lectura anticipada

Lea el primer código antes del ciclo.

### Paso 3 — Comprobar centinela

El ciclo continúa mientras el código sea diferente de 0.

### Paso 4 — Validar código

No solicite cantidad si el código es inválido.

### Paso 5 — Determinar precio

Asigne el precio correspondiente a 1, 2 o 3.

### Paso 6 — Validar cantidad

Solo una cantidad entre 1 y 10 permite acumular.

### Paso 7 — Actualizar

Una línea válida debe producir tres actualizaciones:

```text
lineas_validas ← lineas_validas + 1
total_unidades ← total_unidades + cantidad
subtotal ← subtotal + importe_linea
```

### Paso 8 — Renovar la lectura

Lea otro código antes de regresar a la condición del ciclo.

### Paso 9 — Proteger el cierre

Calcule promedio y entrega únicamente si existe al menos una línea válida.

### Paso 10 — Validar entrega

Repita la lectura hasta recibir 1 o 2.

### Paso 11 — Mostrar

Presente todos los datos indicados en los requisitos.

---

## 22. Errores que deben evitarse

### Procesar el centinela

```text
INCORRECTO:
Procesar código
Después comprobar si era 0
```

### Solicitar cantidad para un código inválido

```text
INCORRECTO:
LEER codigo
LEER cantidad
Después validar codigo
```

### Reemplazar el subtotal

```text
INCORRECTO:
subtotal ← importe_linea
```

### Reiniciar el contador

```text
INCORRECTO:
lineas_validas ← 1
```

### Olvidar una nueva lectura

```text
INCORRECTO:
MIENTRAS codigo ≠ 0
    ...
FIN MIENTRAS
```

Si `codigo` no cambia, el ciclo puede no terminar.

### Aplicar descuento a cada línea

El requisito indica un descuento según el subtotal completo. Debe calcularse al final.

### Decidir entrega con el subtotal

La entrega gratuita depende del **importe con descuento**, no del subtotal.

### Dividir sin comprobar

El promedio solo se calcula si existen unidades válidas.

---

# PARTE 6 — DIAGRAMA DE FLUJO

## 23. Video de apoyo

[Resolver un algoritmo mediante pseudocódigo y diagrama de flujo — Ramon Mendoza Ochoa](https://www.youtube.com/watch?v=5NU9SUcdv6o)

**Duración:** 8 minutos y 52 segundos  
**Canal:** Ramon Mendoza Ochoa  
**Tema exacto:** Representar una misma solución mediante pseudocódigo y diagrama de flujo  

---

## 24. Herramientas permitidas

El diagrama puede realizarse:

- a mano;
- en PSeInt;
- en [diagrams.net](https://app.diagrams.net/);
- en otra herramienta de diagramación.

La herramienta no se evalúa. Se evalúa la lógica.

Una fotografía o captura es válida si:

- está enfocada;
- se puede ampliar;
- todos los textos se leen;
- ninguna flecha queda cortada;
- se distingue la dirección del flujo.

---

## 25. Símbolos mínimos

| Símbolo | Uso |
|---|---|
| Óvalo | Inicio o fin |
| Paralelogramo | Leer o mostrar |
| Rectángulo | Asignación o cálculo |
| Rombo | Pregunta o condición |
| Flecha | Dirección del flujo |

### Esquema

```text
   ( INICIO )
       ↓
┌─────────────┐
│   PROCESO   │
└──────┬──────┘
       ↓
   / ENTRADA /
       ↓
    ◇ ¿CONDICIÓN?
   Sí ↙       ↘ No
```

---

## 26. Decisiones que deben aparecer

El diagrama debe mostrar, como mínimo:

1. ¿El código es 0?
2. ¿El código es válido?
3. ¿Qué precio corresponde?
4. ¿La cantidad es válida?
5. ¿Existe alguna línea válida?
6. ¿El subtotal alcanza 30?
7. ¿El tipo de entrega es 1 o 2?
8. Si es domicilio, ¿el importe con descuento alcanza 40?

---

## 27. Regresos que deben aparecer

Debe existir una flecha de regreso:

- desde el final de cada línea hacia la lectura de un nuevo código;
- desde un código inválido hacia la lectura de un nuevo código;
- desde una cantidad inválida hacia la lectura de un nuevo código;
- desde un tipo de entrega inválido hacia la lectura del tipo de entrega.

No conecte el tipo de entrega inválido con la lectura del código. Son etapas diferentes.

---

## 28. Prueba de equivalencia

Utilice esta tabla para comparar pseudocódigo y diagrama:

| Elemento | Pseudocódigo | Diagrama | ¿Coinciden? |
|---|:---:|:---:|:---:|
| Valores iniciales |  |  |  |
| Lectura inicial del código |  |  |  |
| Centinela 0 |  |  |  |
| Validación del código |  |  |  |
| Precios |  |  |  |
| Validación de cantidad |  |  |  |
| Actualizaciones |  |  |  |
| Nueva lectura |  |  |  |
| Caso sin productos |  |  |  |
| Descuento |  |  |  |
| Validación de entrega |  |  |  |
| Costo de entrega |  |  |  |
| Total y promedio |  |  |  |
| Resumen |  |  |  |

Si una regla aparece solo en una representación, el proyecto aún no está listo.

---

# PARTE 7 — PLAN DE PRUEBAS

## 29. Pruebas obligatorias

Calcule primero los resultados esperados.

### Caso A — Sin productos

```text
Código 0
```

Comprueba:

- cero iteraciones;
- centinela como primera entrada;
- protección del promedio;
- ausencia de solicitud de entrega.

### Caso B — Pedido sencillo

```text
Código 1, cantidad 2
Código 0
Tipo de entrega 1
```

Comprueba:

- una iteración;
- producto 1;
- recogida;
- subtotal sin descuento.

### Caso C — Límite de descuento

```text
Código 1, cantidad 5
Código 2, cantidad 5
Código 0
Tipo de entrega 2
```

Comprueba:

- varias iteraciones;
- subtotal exactamente 30;
- descuento del 10 %;
- entrega con costo.

### Caso D — Entrega gratuita

```text
Código 3, cantidad 9
Código 2, cantidad 9
Código 0
Tipo de entrega 2
```

Comprueba:

- cantidad válida cercana al máximo;
- subtotal 45;
- importe con descuento superior a 40;
- domicilio gratuito.

### Caso E — Datos inválidos y recuperación

```text
Código 9
Código 2, cantidad 0
Código 3, cantidad 2
Código 0
Tipo de entrega 1
```

Comprueba:

- código inválido;
- cantidad inválida;
- continuación después de errores;
- acumulación únicamente de una línea válida;
- contador de entradas inválidas.

### Caso F — Cantidades límite

```text
Código 1, cantidad 1
Código 2, cantidad 10
Código 0
Tipo de entrega 1
```

Comprueba:

- cantidad mínima válida;
- cantidad máxima válida;
- más de una línea;
- acumulación de unidades.

### Caso G — Validación de entrega

```text
Código 3, cantidad 1
Código 0
Tipo de entrega 7
Tipo de entrega 2
```

Comprueba:

- rechazo de un tipo inválido;
- nueva solicitud;
- aceptación posterior;
- costo de entrega para un importe menor que 40.

---

## 30. Tabla de resultados

Complete antes de ejecutar:

| Caso | Líneas | Unidades | Inválidas | Subtotal | Descuento | Importe con descuento | Entrega | Total | Promedio o mensaje |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| A |  |  |  |  |  |  |  |  |  |
| B |  |  |  |  |  |  |  |  |  |
| C |  |  |  |  |  |  |  |  |  |
| D |  |  |  |  |  |  |  |  |  |
| E |  |  |  |  |  |  |  |  |  |
| F |  |  |  |  |  |  |  |  |  |
| G |  |  |  |  |  |  |  |  |  |

Para el caso A, escriba el mensaje en la última columna y marque los cálculos que no corresponden como `No aplica`.

---

## 31. Prueba de escritorio obligatoria

Realice el rastreo completo del **caso C**.

Utilice una fila cada vez que:

- se lea un código;
- se lea una cantidad;
- se determine un precio;
- se actualicen contadores;
- se actualice el subtotal;
- se calcule el descuento;
- se seleccione entrega;
- se calcule el resultado final.

### Plantilla

| Paso | Código | Cantidad | Precio | Importe línea | Líneas | Unidades | Inválidas | Subtotal | Acción |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 0 | — | — | — | — | 0 | 0 | 0 | 0 | Inicializar |

Después del ciclo, complete:

| Subtotal | Descuento | Importe con descuento | Tipo entrega | Costo entrega | Total final | Promedio |
|---:|---:|---:|---:|---:|---:|---:|
|  |  |  |  |  |  |  |

---

## 32. Informe de ejecución

Después de probar cada caso, complete:

| Caso | Esperado | Obtenido | Estado | Observación |
|---|---|---|---|---|
| A |  |  | `CORRECTO` o `FALLA` |  |
| B |  |  |  |  |
| C |  |  |  |  |
| D |  |  |  |  |
| E |  |  |  |  |
| F |  |  |  |  |
| G |  |  |  |  |

No escriba `CORRECTO` solo porque el algoritmo terminó. El resultado completo debe coincidir.

---

## 33. Registro de correcciones

Si encuentra errores, utilice:

| ID | Caso que falla | Primera diferencia | Causa | Cambio realizado | Casos repetidos | Resultado |
|---|---|---|---|---|---|---|
| E1 |  |  |  |  |  |  |

### Si no encuentra errores

No invente defectos.

Escriba:

> No se detectaron diferencias en los siete casos obligatorios. Esto no demuestra que el algoritmo sea perfecto, pero aporta evidencia para los requisitos y límites definidos.

---

# PARTE 8 — RETO OPCIONAL

## 34. Producto con la línea de mayor importe

Esta ampliación no es necesaria para aprobar.

Agregue al resumen:

- nombre del producto cuya línea válida tuvo el importe más alto;
- valor de ese importe.

No utilice listas.

### Reglas

1. El máximo comienza en 0.
2. Después de calcular una línea válida, se compara su importe con el máximo.
3. Si el importe es mayor, se guardan:
   - el nuevo máximo;
   - el nombre del producto.
4. En un empate, se conserva la primera línea.

### Pregunta

¿Por qué la condición debe ser `importe_linea > mayor_importe` y no `≥` si se desea conservar la primera?

---

# PARTE 9 — ENTREGABLE FINAL

## 35. Estructura obligatoria del archivo

### Portada

Incluya:

- COA — Cursos Online Avanzados;
- curso Lógica de Programación;
- Módulo 6;
- nombre completo;
- fecha;
- título: `Proyecto final — Cafetería COA`.

### Sección 1 — Comprensión

- Respuesta del ejercicio 1.
- Explicación de lo que se encuentra dentro y fuera del alcance.

### Sección 2 — Requisitos y datos

- Matriz de requisitos.
- Tabla de entradas, procesos y salidas.
- Tabla de decisiones.

### Sección 3 — Variables

- Tabla de variables completa.
- Identificación de contadores y acumuladores.

### Sección 4 — Resultados esperados

- Cálculo manual del ejercicio 4.
- Tabla de los siete casos obligatorios.

### Sección 5 — Solución

- Pseudocódigo completo.
- Diagrama de flujo completo.
- Tabla de equivalencia.

### Sección 6 — Comprobación

- Prueba de escritorio del caso C.
- Informe de ejecución de los siete casos.
- Registro de correcciones o declaración de que no se detectaron diferencias.

### Sección 7 — Reflexión

Responda:

1. ¿Qué parte del problema tuvo que descomponer con mayor cuidado?
2. ¿Qué requisito habría sido fácil olvidar sin la matriz?
3. ¿Qué diferencia existe entre líneas válidas y unidades?
4. ¿Por qué el orden descuento–entrega modifica el resultado?
5. ¿Qué caso de prueba encontró más valioso?
6. ¿Qué error detectó o qué error considera más probable?
7. ¿Qué parte de esta solución podría trasladar a otro lenguaje?
8. ¿Qué aprendió sobre la forma de pensar de un programador?

Cada respuesta debe tener de dos a cuatro oraciones.

---

## 36. Formatos permitidos

El proyecto puede realizarse:

- completamente digital;
- completamente a mano;
- combinando texto digital con fotografías o capturas.

La entrega final debe ser **un único archivo PDF**.

No se evalúa:

- calidad artística;
- tipo de letra;
- herramienta utilizada;
- decoración;
- uso de colores.

Sí se evalúa:

- legibilidad;
- orden;
- correspondencia entre requisitos y solución;
- razonamiento;
- resultados;
- evidencia.

---

## 37. Lista de verificación

```text
[ ] Expliqué el problema con mis propias palabras.
[ ] Respeté el alcance y no agregué funciones innecesarias.
[ ] Organicé entradas, procesos y salidas.
[ ] Completé la matriz de requisitos.
[ ] Completé la tabla de decisiones.
[ ] Definí cada variable antes de utilizarla.
[ ] Inicialicé contadores y acumuladores.
[ ] El código 0 termina sin solicitar cantidad.
[ ] Solo acepto códigos 1, 2 y 3.
[ ] Solo acepto cantidades de 1 a 10.
[ ] Los datos inválidos no modifican subtotal ni unidades.
[ ] El contador de entradas inválidas aumenta correctamente.
[ ] Cada línea válida aumenta líneas y unidades.
[ ] El subtotal acumula todos los importes válidos.
[ ] El descuento se aplica desde 30.
[ ] Calculo el importe con descuento antes de la entrega.
[ ] Valido el tipo de entrega hasta recibir 1 o 2.
[ ] La entrega gratuita depende del importe con descuento.
[ ] Protejo el caso sin productos.
[ ] El promedio no incluye entrega.
[ ] Mi pseudocódigo tiene sangría clara.
[ ] Mi ciclo recibe un nuevo código.
[ ] Mi diagrama tiene flechas legibles.
[ ] Pseudocódigo y diagrama representan la misma solución.
[ ] Calculé los esperados antes de probar.
[ ] Incluí los siete casos obligatorios.
[ ] Rastreé por completo el caso C.
[ ] Comparé esperado y obtenido.
[ ] Documenté correcciones y repetí pruebas.
[ ] Respondí la reflexión final.
[ ] Reuní todo en un único PDF legible.
```

---

## 38. Rúbrica del proyecto final

| Criterio | Puntos |
|---|---:|
| Comprensión y respeto del alcance | 8 |
| Matriz de requisitos | 8 |
| Entradas, procesos, salidas y decisiones | 7 |
| Diseño y uso de variables | 7 |
| Pseudocódigo: secuencia general | 8 |
| Pseudocódigo: validaciones y decisiones | 8 |
| Pseudocódigo: repetición y actualizaciones | 8 |
| Pseudocódigo: cálculos y resumen | 8 |
| Diagrama de flujo equivalente | 12 |
| Plan de pruebas y resultados esperados | 10 |
| Prueba de escritorio | 8 |
| Informe, correcciones y regresión | 4 |
| Reflexión y claridad de la entrega | 4 |
| **Total** | **100** |

### Interpretación formativa

| Puntaje | Interpretación |
|---:|---|
| 90–100 | Dominio sólido de los fundamentos |
| 75–89 | Logro satisfactorio |
| 60–74 | Comprende las bases, pero debe reforzar alguna estructura |
| Menos de 60 | Conviene revisar los módulos relacionados con los errores observados |

### Importante

El certificado es de participación. La rúbrica ayuda a orientar el aprendizaje y no convierte el curso en una certificación profesional.

---

## 39. Mapa de retroalimentación

| Si el problema aparece en… | Repasar |
|---|---|
| Comprensión o descomposición | Módulo 1 |
| Variables, cálculos o acumuladores | Módulo 2 |
| Condiciones, rangos o validaciones | Módulo 3 |
| Ciclos, centinelas o actualizaciones | Módulo 4 |
| Casos, rastreo o correcciones | Módulo 5 |

Utilice esta tabla para identificar qué módulo debe repasar según las dificultades encontradas.

---

## 40. Punto de entrega

Se utiliza **un solo Google Form para todo el proyecto final**:

[Entregar proyecto final del Módulo 6](https://forms.gle/BayPBDiXAGurWjnL6)

### Nombre del archivo

```text
Modulo6_ProyectoFinal_Nombre_Apellido.pdf
```

Ejemplo:

```text
Modulo6_ProyectoFinal_Ana_Rojas.pdf
```

---


<!-- coa-activity:logica-m6-proyecto-final-cafeteria -->

# PARTE 10 — SOLUCIÓN DE REFERENCIA

## 41. Solución del ejercicio 1

Una explicación posible:

> El sistema registra varias líneas de productos para un pedido. En cada línea se ingresa un código y, si el producto existe, una cantidad entre 1 y 10. El código 0 termina el registro sin contar como producto. Los datos inválidos se informan y no modifican los totales. Las líneas correctas permiten acumular unidades y subtotal. Al final se aplica un descuento del 10 % si el subtotal alcanza 30. Después se valida el tipo de entrega y se calcula su costo según el importe ya descontado. Finalmente, se muestran los contadores, los importes y el promedio por unidad, o un mensaje si no hubo productos válidos.

---

## 42. Solución del ejercicio 2

| Elemento | Tipo principal | Explicación |
|---|---|---|
| Código de producto | Entrada | Lo proporciona la persona |
| Cantidad | Entrada | Indica cuántas unidades solicita |
| Tipo de entrega | Entrada | Elige recogida o domicilio |
| Determinar precio | Proceso | Convierte código en precio |
| Calcular importe de línea | Proceso | Multiplica precio por cantidad |
| Acumular unidades | Proceso | Conserva la suma de cantidades |
| Calcular descuento | Proceso | Aplica la regla del subtotal |
| Calcular costo de entrega | Proceso | Aplica tipo y umbral |
| Líneas válidas | Salida | Se muestra en el resumen |
| Total final | Salida | Resultado monetario final |
| Mensaje de error | Salida | Informa un dato rechazado |
| Promedio por unidad | Salida | Resultado calculado y mostrado |

Respuestas:

1. El subtotal se construye mediante un proceso y luego se muestra como salida.
2. Sí. Un dato calculado puede utilizarse en otras operaciones y también mostrarse.
3. El precio se obtiene del catálogo mediante el código.
4. Porque 0 finaliza y no representa una línea con cantidad.

---

## 43. Solución del ejercicio 3

| Variable | Representa | Inicial | Cambia |
|---|---|---:|---|
| `codigo` | Producto o centinela | Primera lectura | En cada nueva línea |
| `cantidad` | Unidades de la línea | No necesita 0 obligatorio | Cuando el código es válido |
| `precio` | Precio unitario actual | No necesita 0 obligatorio | Según código válido |
| `importe_linea` | Valor de la línea actual | No necesita 0 obligatorio | En cada línea válida |
| `lineas_validas` | Cantidad de líneas aceptadas | 0 | Suma 1 por línea válida |
| `total_unidades` | Unidades aceptadas | 0 | Suma cada cantidad válida |
| `entradas_invalidas` | Errores de código o cantidad | 0 | Suma 1 por dato inválido |
| `subtotal` | Suma de importes válidos | 0 | Acumula cada importe |
| `descuento` | Reducción aplicada | 0 | Al finalizar |
| `importe_con_descuento` | Subtotal menos descuento | 0 opcional | Al finalizar |
| `tipo_entrega` | Opción 1 o 2 | No necesita 0 obligatorio | Durante validación |
| `costo_entrega` | Cargo de entrega | 0 | Según reglas finales |
| `total_final` | Importe pagado | 0 opcional | Al finalizar |
| `promedio_por_unidad` | Valor ajustado medio | 0 opcional | Al finalizar |

Contadores:

- `lineas_validas`;
- `entradas_invalidas`.

Acumuladores:

- `total_unidades`;
- `subtotal`.

Se reemplazan en cada línea:

- `codigo`;
- `cantidad`;
- `precio`;
- `importe_linea`.

Se calculan al final:

- `descuento`;
- `importe_con_descuento`;
- `costo_entrega`;
- `total_final`;
- `promedio_por_unidad`.

---

## 44. Solución del ejercicio 4

| Concepto | Cálculo | Resultado |
|---|---|---:|
| Sándwiches | `4 × 5` | 20 |
| Bebidas | `2 × 5` | 10 |
| Subtotal | `20 + 10` | 30 |
| Descuento | `30 × 0.10` | 3 |
| Importe con descuento | `30 - 3` | 27 |
| Costo de entrega | Domicilio y 27 < 40 | 3 |
| Total final | `27 + 3` | 30 |
| Total de unidades | `5 + 5` | 10 |
| Promedio ajustado | `27 / 10` | 2.7 |

Respuestas:

1. Existen 2 líneas válidas.
2. Existen 10 unidades.
3. Sí. La condición es `subtotal ≥ 30`.
4. No. El importe con descuento es menor que 40.
5. Primero debe calcularse el importe con descuento.

---

## 45. Solución del ejercicio 5

### Caso A

```text
Líneas: 0
Unidades: 0
Inválidas: 0
Mensaje: No se registraron productos válidos
```

No se solicita entrega ni se calcula promedio.

### Caso B

```text
Código 9                 → inválido
Código 1, cantidad 0     → cantidad inválida
Código 3, cantidad 2     → 3 × 2 = 6
```

```text
Líneas: 1
Unidades: 2
Inválidas: 2
Subtotal: 6
Descuento: 0
Importe con descuento: 6
Entrega: 0
Total: 6
Promedio: 3
```

### Caso C

```text
Bebidas: 2 × 10 = 20
Sándwiches: 4 × 10 = 40
Subtotal: 60
Descuento: 6
Importe con descuento: 54
Entrega: 0
Total: 54
Unidades: 20
Promedio: 54 / 20 = 2.7
```

---

## 46. Pseudocódigo de referencia

```text
INICIO
    lineas_validas ← 0
    total_unidades ← 0
    entradas_invalidas ← 0
    subtotal ← 0

    LEER codigo

    MIENTRAS codigo ≠ 0 HACER
        SI codigo < 1 O codigo > 3 ENTONCES
            MOSTRAR "Código inválido"
            entradas_invalidas ← entradas_invalidas + 1
        SINO
            SI codigo = 1 ENTONCES
                precio ← 4
            SINO SI codigo = 2 ENTONCES
                precio ← 2
            SINO
                precio ← 3
            FIN SI

            LEER cantidad

            SI cantidad < 1 O cantidad > 10 ENTONCES
                MOSTRAR "Cantidad inválida"
                entradas_invalidas ← entradas_invalidas + 1
            SINO
                importe_linea ← precio × cantidad
                lineas_validas ← lineas_validas + 1
                total_unidades ← total_unidades + cantidad
                subtotal ← subtotal + importe_linea
            FIN SI
        FIN SI

        LEER codigo
    FIN MIENTRAS

    SI lineas_validas = 0 ENTONCES
        MOSTRAR "No se registraron productos válidos"
        MOSTRAR entradas_invalidas
    SINO
        SI subtotal ≥ 30 ENTONCES
            descuento ← subtotal × 0.10
        SINO
            descuento ← 0
        FIN SI

        importe_con_descuento ← subtotal - descuento

        REPETIR
            LEER tipo_entrega

            SI tipo_entrega ≠ 1 Y tipo_entrega ≠ 2 ENTONCES
                MOSTRAR "Tipo de entrega inválido"
            FIN SI
        HASTA QUE tipo_entrega = 1 O tipo_entrega = 2

        SI tipo_entrega = 1 ENTONCES
            costo_entrega ← 0
        SINO
            SI importe_con_descuento ≥ 40 ENTONCES
                costo_entrega ← 0
            SINO
                costo_entrega ← 3
            FIN SI
        FIN SI

        total_final ← importe_con_descuento + costo_entrega
        promedio_por_unidad ← importe_con_descuento / total_unidades

        MOSTRAR lineas_validas
        MOSTRAR total_unidades
        MOSTRAR entradas_invalidas
        MOSTRAR subtotal
        MOSTRAR descuento
        MOSTRAR costo_entrega
        MOSTRAR total_final
        MOSTRAR promedio_por_unidad
    FIN SI
FIN
```

### Observación

También es correcto:

- comprobar códigos con varias condiciones equivalentes;
- utilizar `SEGÚN` para seleccionar el precio;
- validar la entrega con un ciclo `MIENTRAS`;
- mostrar etiquetas descriptivas junto a cada resultado.

La lógica debe conservar los mismos requisitos.

---

## 47. Diagrama lógico de referencia

```text
┌────────────┐
│   INICIO   │
└─────┬──────┘
      ▼
┌──────────────────────────────────┐
│ Inicializar contadores y totales │
└────────────────┬─────────────────┘
                 ▼
          ╱ LEER código ╱◄───────────────────────────────┐
                 │                                       │
                 ▼                                       │
          ◇ ¿código = 0?                                 │
          │Sí        │No                                  │
          │          ▼                                    │
          │    ◇ ¿código válido?                          │
          │     │No          │Sí                          │
          │     ▼            ▼                            │
          │  Mostrar      Determinar                      │
          │  inválido     precio                          │
          │  inválidas++     │                            │
          │     │            ▼                            │
          │     │      ╱ LEER cantidad ╱                  │
          │     │            │                            │
          │     │            ▼                            │
          │     │      ◇ ¿cantidad válida?                │
          │     │       │No          │Sí                  │
          │     │       ▼            ▼                    │
          │     │   Mostrar       Calcular línea          │
          │     │   inválida      líneas++                │
          │     │   inválidas++   unidades += cantidad    │
          │     │                 subtotal += importe     │
          │     │       │            │                    │
          │     └───────┴────────────┴────────────────────┘
          ▼
   ◇ ¿líneas válidas = 0?
   │Sí                  │No
   ▼                    ▼
Mostrar mensaje      ◇ ¿subtotal ≥ 30?
sin productos        │Sí          │No
   │                  ▼            ▼
   │             descuento 10 %  descuento 0
   │                  └──────┬─────┘
   │                         ▼
   │              Calcular importe descontado
   │                         ▼
   │                 ╱ LEER entrega ╱◄────────────┐
   │                         │                     │
   │                         ▼                     │
   │                 ◇ ¿es 1 o 2?                 │
   │                 │No        │Sí                │
   │                 ▼          │                  │
   │              Mostrar       │                  │
   │              inválida ─────┘                  │
   │                            ▼
   │                     ◇ ¿entrega = 1?
   │                     │Sí          │No
   │                     ▼            ▼
   │                  costo 0    ◇ ¿importe ≥ 40?
   │                              │Sí          │No
   │                              ▼            ▼
   │                           costo 0       costo 3
   │                              └─────┬──────┘
   │                                    ▼
   │                         Calcular total y promedio
   │                                    ▼
   │                            Mostrar resumen
   │                                    │
   └───────────────────┬────────────────┘
                       ▼
                ┌────────────┐
                │    FIN     │
                └────────────┘
```

El diagrama de entrega puede dibujarse con otra distribución siempre que mantenga las mismas decisiones y regresos.

---

## 48. Resultados esperados de las pruebas

| Caso | Líneas | Unidades | Inválidas | Subtotal | Descuento | Importe con descuento | Entrega | Total | Promedio o mensaje |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| A | 0 | 0 | 0 | No aplica | No aplica | No aplica | No aplica | No aplica | No se registraron productos válidos |
| B | 1 | 2 | 0 | 8 | 0 | 8 | 0 | 8 | 4 |
| C | 2 | 10 | 0 | 30 | 3 | 27 | 3 | 30 | 2.7 |
| D | 2 | 18 | 0 | 45 | 4.5 | 40.5 | 0 | 40.5 | 2.25 |
| E | 1 | 2 | 2 | 6 | 0 | 6 | 0 | 6 | 3 |
| F | 2 | 11 | 0 | 24 | 0 | 24 | 0 | 24 | 2.18 aproximadamente |
| G | 1 | 1 | 0 | 3 | 0 | 3 | 3 | 6 | 3 |

### Comprobaciones

#### Caso D

```text
Postres: 3 × 9 = 27
Bebidas: 2 × 9 = 18
Subtotal: 45
Descuento: 45 × 0.10 = 4.5
Importe con descuento: 40.5
Entrega a domicilio: gratuita
Total: 40.5
Promedio: 40.5 / 18 = 2.25
```

#### Caso F

```text
Sándwich: 4 × 1 = 4
Bebidas: 2 × 10 = 20
Subtotal: 24
Unidades: 11
Promedio: 24 / 11 = 2.1818...
```

---

## 49. Prueba de escritorio del caso C

| Paso | Código | Cantidad | Precio | Importe línea | Líneas | Unidades | Inválidas | Subtotal | Acción |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 0 | — | — | — | — | 0 | 0 | 0 | 0 | Inicializar |
| 1 | 1 | — | — | — | 0 | 0 | 0 | 0 | Leer código |
| 2 | 1 | 5 | 4 | 20 | 0 | 0 | 0 | 0 | Validar y calcular |
| 3 | 1 | 5 | 4 | 20 | 1 | 5 | 0 | 20 | Actualizar |
| 4 | 2 | — | — | — | 1 | 5 | 0 | 20 | Leer nuevo código |
| 5 | 2 | 5 | 2 | 10 | 1 | 5 | 0 | 20 | Validar y calcular |
| 6 | 2 | 5 | 2 | 10 | 2 | 10 | 0 | 30 | Actualizar |
| 7 | 0 | — | — | — | 2 | 10 | 0 | 30 | Finalizar registro |

| Subtotal | Descuento | Importe con descuento | Tipo entrega | Costo entrega | Total final | Promedio |
|---:|---:|---:|---:|---:|---:|---:|
| 30 | 3 | 27 | 2 | 3 | 30 | 2.7 |

---

## 50. Solución del reto opcional

Variables nuevas:

```text
mayor_importe ← 0
producto_mayor ← ""
```

Después de calcular una línea válida:

```text
SI importe_linea > mayor_importe ENTONCES
    mayor_importe ← importe_linea

    SI codigo = 1 ENTONCES
        producto_mayor ← "Sándwich"
    SINO SI codigo = 2 ENTONCES
        producto_mayor ← "Bebida"
    SINO
        producto_mayor ← "Postre"
    FIN SI
FIN SI
```

Se utiliza `>` porque un empate no debe reemplazar la primera línea guardada.

---

# PARTE 11 — EVALUACIÓN FINAL

## 51. Evaluación breve

### Pregunta 1

¿Qué debe ocurrir cuando el primer código es 0?

a. Solicitar cantidad  
b. Solicitar entrega  
c. Mostrar que no hubo productos válidos  
d. Contar una línea

### Pregunta 2

¿Por qué se valida el código antes de leer la cantidad?

a. Para que el subtotal sea mayor  
b. Porque un código inválido no representa un producto  
c. Para aplicar el descuento  
d. Porque toda cantidad es inválida

### Pregunta 3

¿Cuál actualización acumula correctamente?

a. `subtotal ← importe_linea`  
b. `subtotal ← 0`  
c. `subtotal ← subtotal + importe_linea`  
d. `importe_linea ← subtotal`

### Pregunta 4

Con subtotal 30, ¿qué descuento corresponde?

a. 0  
b. 3  
c. 10  
d. 30

### Pregunta 5

¿Sobre qué valor se decide la entrega gratuita?

a. El subtotal antes de descuento  
b. La cantidad de líneas  
c. El importe con descuento  
d. El total después de entrega

### Pregunta 6

¿Por qué el promedio no se calcula cuando no hay líneas válidas?

a. Porque no existe precio  
b. Porque total_unidades es 0 y no se puede dividir entre 0  
c. Porque el descuento siempre es 0  
d. Porque no existe entrega

### Pregunta 7

¿Qué demuestra la prueba de escritorio?

a. Que el diagrama es bonito  
b. Cómo cambian las variables paso a paso  
c. Qué lenguaje se debe aprender  
d. Que no se necesitan requisitos

### Pregunta 8

Después de corregir un caso fallido, ¿qué debe hacerse?

a. Entregar inmediatamente  
b. Borrar los casos anteriores  
c. Repetir el caso y las demás pruebas relevantes  
d. Cambiar los requisitos

---

## 52. Respuestas

| Pregunta | Respuesta | Motivo |
|---:|:---:|---|
| 1 | c | 0 finaliza y no representa un producto |
| 2 | b | No debe solicitarse cantidad para algo inexistente |
| 3 | c | Conserva el subtotal anterior y suma la línea |
| 4 | b | 30 × 10 % = 3 |
| 5 | c | Así lo define el requisito |
| 6 | b | Evita una división imposible |
| 7 | b | Hace visible el estado interno |
| 8 | c | Comprueba el arreglo y posibles regresiones |

---

## 53. Autoevaluación final

Marque una opción:

| Habilidad | Puedo hacerlo solo | Puedo hacerlo con apoyo | Debo practicar |
|---|:---:|:---:|:---:|
| Comprender una situación |  |  |  |
| Delimitar el problema |  |  |  |
| Descomponerlo |  |  |  |
| Reconocer entradas y salidas |  |  |  |
| Diseñar variables |  |  |  |
| Realizar cálculos |  |  |  |
| Construir decisiones |  |  |  |
| Validar rangos |  |  |  |
| Construir ciclos |  |  |  |
| Utilizar contadores |  |  |  |
| Utilizar acumuladores |  |  |  |
| Escribir pseudocódigo |  |  |  |
| Crear diagramas |  |  |  |
| Diseñar pruebas |  |  |  |
| Realizar un rastreo |  |  |  |
| Corregir con evidencia |  |  |  |
| Explicar mi solución |  |  |  |

---

# PARTE 12 — DOCUMENTACIÓN Y RECURSOS

## 54. Lectura sobre algoritmos

[Algoritmos y pseudocódigo — INTEF](https://formacion.intef.es/tutorizados_2013_2019/pluginfile.php/109756/mod_folder/content/0/Programar_03_15_T5_algoritmos.pdf?forcedownload=1)

Puede utilizarse para repasar:

- características de un algoritmo;
- claridad y finitud;
- resolución de problemas;
- representación mediante pseudocódigo.

---

## 55. Documentación de pseudocódigo

[Documentación oficial de PSeInt](https://pseint.sourceforge.net/index.php?page=pseudocodigo.php)

Puede utilizarse para:

- consultar asignaciones;
- revisar condiciones;
- revisar ciclos;
- comparar una notación más formal;
- ejecutar opcionalmente el algoritmo.

> PSeInt es una herramienta de apoyo. El proyecto continúa siendo independiente de un lenguaje.

---

## 56. Recurso para diagramas

[diagrams.net](https://app.diagrams.net/)

Permite construir el diagrama en el navegador.

No es obligatorio crear una cuenta ni utilizar esta herramienta. Un diagrama dibujado a mano tiene el mismo valor si es correcto y legible.

---

# PARTE 13 — CIERRE DEL CURSO

## 57. Qué integró el proyecto

```text
MÓDULO 1
Comprender, descomponer y ordenar
                 │
                 ▼
MÓDULO 2
Datos, variables, operaciones y acumulación
                 │
                 ▼
MÓDULO 3
Condiciones, rangos y decisiones
                 │
                 ▼
MÓDULO 4
Repeticiones, contadores y centinelas
                 │
                 ▼
MÓDULO 5
Pruebas, rastreo, errores y correcciones
                 │
                 ▼
MÓDULO 6
Una solución completa y demostrable
```

---

## 58. Habilidades obtenidas al finalizar el curso

Durante el curso, ha practicado:

- pensamiento lógico;
- pensamiento computacional;
- análisis de situaciones;
- descomposición;
- abstracción;
- reconocimiento de patrones;
- orden de operaciones;
- diseño de algoritmos;
- manejo conceptual de datos;
- variables y estado;
- decisiones;
- condiciones combinadas;
- validación;
- repetición;
- contadores;
- acumuladores;
- centinelas;
- pseudocódigo;
- diagramas de flujo;
- casos de prueba;
- pruebas de escritorio;
- diagnóstico de errores;
- corrección y regresión;
- documentación;
- explicación de soluciones.

---

## 59. Lo que ya puede hacer

Después del proyecto, no necesita memorizar un lenguaje para demostrar su razonamiento.

Puede recibir un problema y preguntar:

```text
¿Qué se necesita?
¿Qué datos entran?
¿Qué reglas cambian el resultado?
¿Qué se repite?
¿Qué debe recordarse?
¿Cómo termina?
¿Qué puede salir mal?
¿Cómo demostraré que funciona?
```

Estas preguntas son transferibles a Python, Java, C#, JavaScript y otros lenguajes.

---

## 60. Próximo paso recomendado

El curso siguiente puede introducir un lenguaje como Python.

Al llegar a él, encontrará nuevas reglas de escritura:

- sintaxis;
- palabras reservadas;
- tipos propios del lenguaje;
- mensajes de error;
- herramientas de ejecución.

Sin embargo, los conceptos centrales ya serán conocidos:

```text
variable
asignación
operación
condición
repetición
contador
acumulador
entrada
salida
prueba
error lógico
```

El nuevo reto será aprender a expresar una idea conocida en la sintaxis del lenguaje.

---

## 61. Mensaje final

Programar no comienza al escribir código.

Comienza cuando una persona:

1. comprende una situación;
2. separa lo importante de lo accesorio;
3. transforma reglas en pasos;
4. anticipa casos diferentes;
5. comprueba sus decisiones;
6. reconoce un error sin ocultarlo;
7. corrige con evidencia;
8. explica su solución.

El proyecto final no busca una página perfecta ni una sintaxis profesional. Busca demostrar una forma de pensar.

Si puede explicar por qué su algoritmo funciona, en qué casos fue probado y cómo lo corregiría, ya dio un paso real hacia la programación.

---

# FIN DEL MÓDULO 6

**Fin del curso Lógica de Programación — COA**
