# COA — Lógica de Programación

# Módulo 5: Construir, probar y corregir

**Duración obligatoria:** 2 horas y 30 minutos  
**Nivel:** Principiante absoluto  
**Conocimientos previos:** Módulos 1, 2, 3 y 4 aprobados  
**Modalidad:** Práctica, independiente de cualquier lenguaje  
**Materiales:** Papel, lápiz y calculadora sencilla opcional  
**Herramientas opcionales:** PSeInt o un editor de texto

---

## 1. Objetivo del módulo

Construir algoritmos completos a partir de requisitos, comprobarlos con casos de prueba y corregir sus errores mediante un proceso ordenado y basado en evidencia.

Al terminar el módulo, podrá:

- convertir una situación cotidiana en requisitos claros;
- separar entradas, reglas, procesos, salidas y casos inválidos;
- reconocer requisitos incompletos o ambiguos;
- establecer resultados esperados antes de probar;
- diseñar casos normales, límite, inválidos y sin datos;
- comprobar todos los caminos importantes de una decisión;
- probar cero, una y varias iteraciones;
- realizar una prueba de escritorio;
- comparar resultado esperado y resultado obtenido;
- localizar el primer punto donde ambos se separan;
- diferenciar síntoma, causa y corrección;
- reconocer errores de cálculo, condición, límite, actualización y finalización;
- corregir una causa sin ocultar sus síntomas;
- repetir las pruebas después de una corrección;
- documentar qué falló, cómo se corrigió y qué evidencia demuestra el resultado;
- decidir cuándo un algoritmo está suficientemente comprobado para el alcance del problema.

> Este módulo no enseña herramientas de depuración de Python, Java, JavaScript ni otro lenguaje. Enseña el razonamiento necesario para probar y corregir cualquier algoritmo.

---

## 2. Distribución del tiempo

| Sección | Tiempo |
|---|---:|
| Activación y diagnóstico | 5 min |
| Construcción desde requisitos | 15 min |
| Diseño de casos de prueba | 20 min |
| Prueba de escritorio y rastreo | 20 min |
| Diagnóstico y corrección | 20 min |
| Ejemplos, actividad y ejercicios | 25 min |
| Retos | 10 min |
| Mini proyecto | 30 min |
| Evaluación y cierre | 5 min |
| **Total** | **150 min** |

## 3. Mapa del aprendizaje

```text
PROBLEMA
   ↓
REQUISITOS CLAROS
   ↓
RESULTADOS ESPERADOS
   ↓
ALGORITMO
   ↓
CASOS DE PRUEBA
   ↓
PRUEBA DE ESCRITORIO
   ↓
¿ESPERADO = OBTENIDO?
├── Sí → CONSERVAR LA PRUEBA Y CONTINUAR
└── No → LOCALIZAR LA PRIMERA DIFERENCIA
             ↓
          CORREGIR LA CAUSA
             ↓
          REPETIR TODAS LAS PRUEBAS
```

---

# PARTE 1 — ACTIVACIÓN

## 4. Pregunta guía

> Si un algoritmo produce la respuesta correcta una vez, ¿eso demuestra que siempre funciona?

Considere esta regla:

> Las personas de 65 años o más pagan 2 unidades. Las demás pagan 5.

Algoritmo:

```text
SI edad > 65 ENTONCES
    precio ← 2
SINO
    precio ← 5
FIN SI
```

Con `edad ← 70`, el resultado es correcto.

Pero con `edad ← 65`, el algoritmo cobra 5.

Un caso exitoso demuestra únicamente que el algoritmo funcionó para ese caso. No demuestra que:

- los límites sean correctos;
- los datos inválidos estén contemplados;
- todos los caminos funcionen;
- una repetición termine;
- los totales se actualicen correctamente.

---

## 5. Diagnóstico inicial sin calificación

Una tienda aplica estas reglas:

- compras menores que 50 no reciben descuento;
- compras desde 50 hasta menos de 100 reciben 5 %;
- compras de 100 o más reciben 10 %;
- una compra negativa es inválida.

Responda:

1. ¿Qué valores utilizaría para probar el límite de 50?
2. ¿Qué valores utilizaría para probar el límite de 100?
3. ¿Qué valor comprobaría la entrada inválida?
4. ¿Bastaría con probar únicamente 75? ¿Por qué?
5. Para una compra de 100, ¿cuál es el resultado esperado?
6. Si el algoritmo devuelve 5 % para 100, ¿en qué regla comenzaría a investigar?

### Propósito

Probar no consiste en ingresar números al azar. Consiste en elegir datos que permitan confirmar o refutar reglas concretas.

---

# PARTE 2 — CONSTRUIR DESDE REQUISITOS

## 6. Antes del pseudocódigo

Un error frecuente es comenzar a escribir instrucciones antes de comprender el problema.

La construcción debe comenzar con preguntas:

```text
¿Qué debe resolver?
¿Qué datos recibe?
¿Qué resultados debe producir?
¿Qué reglas transforman las entradas?
¿Qué datos no son válidos?
¿Qué ocurre en los límites?
¿Cuándo termina?
```

### Analogía: una receta

Antes de cocinar es necesario conocer:

- qué plato se espera;
- para cuántas personas;
- qué ingredientes existen;
- qué restricciones deben respetarse;
- cómo reconocer que está terminado.

Un algoritmo puede seguir instrucciones perfectamente y aun así resolver el problema equivocado si la solicitud no se entendió.

---

## 7. Requisito

Un requisito es una condición o comportamiento que la solución debe cumplir.

Ejemplo:

> El sistema debe aceptar notas entre 0 y 100, incluidos ambos límites.

De este requisito se obtiene:

```text
dato válido: nota ≥ 0 Y nota ≤ 100
dato inválido: nota < 0 O nota > 100
```

Y también aparecen pruebas:

```text
-1, 0, 1, 99, 100, 101
```

Un requisito claro permite:

- construir;
- probar;
- explicar;
- decidir si el resultado es correcto.

---

## 8. Cinco grupos de información

Antes de escribir el algoritmo, organice el problema.

| Grupo | Pregunta |
|---|---|
| Entradas | ¿Qué información recibe? |
| Reglas | ¿Qué condiciones y operaciones debe aplicar? |
| Salidas | ¿Qué debe mostrar o producir? |
| Casos inválidos | ¿Qué información debe rechazarse? |
| Finalización | ¿Cuándo termina el proceso? |

### Ejemplo: registrar donaciones

Regla:

> Registrar donaciones positivas hasta ingresar 0. Mostrar cantidad, total y promedio.

```text
ENTRADAS
donación

REGLAS
aceptar valores mayores que 0
0 termina
negativos son inválidos

SALIDAS
cantidad
total
promedio o mensaje sin datos

CASOS INVÁLIDOS
valores negativos

FINALIZACIÓN
cuando la entrada sea 0
```

---

## 9. Criterios de éxito

Un criterio de éxito describe algo observable que debe cumplirse.

Para las donaciones:

```text
1. Una donación positiva aumenta la cantidad en 1.
2. Una donación positiva se suma al total.
3. Una donación negativa no se suma ni se cuenta.
4. El valor 0 termina y no se procesa.
5. Si no hay donaciones válidas, no se divide entre cero.
6. El promedio utiliza únicamente donaciones válidas.
```

Estos criterios se convierten después en casos de prueba.

---

## 10. Ambigüedades

Una regla es ambigua cuando permite más de una interpretación razonable.

Ejemplo:

> Las personas menores pagan descuento.

Faltan respuestas:

- ¿menores de qué edad?
- ¿el límite está incluido?
- ¿cuánto descuento?
- ¿qué edades son válidas?
- ¿qué ocurre si la edad es negativa?

No conviene inventar silenciosamente una regla.

### Si no puede preguntar

Cuando un ejercicio no permite consultar a la persona responsable:

1. escriba la ambigüedad;
2. declare una suposición;
3. aplíquela de forma consistente;
4. incluya una prueba que muestre su efecto.

Ejemplo:

```text
SUPOSICIÓN
"Menor" significa edad < 18.
```

---

## 11. Método de construcción en seis pasos

```text
1. COMPRENDER
2. ORGANIZAR
3. PROPONER EJEMPLOS
4. DISEÑAR
5. ESCRIBIR
6. REVISAR
```

### 1. Comprender

Explique el problema con sus propias palabras.

### 2. Organizar

Separe entradas, reglas, salidas, inválidos y final.

### 3. Proponer ejemplos

Calcule manualmente al menos un resultado normal y un límite.

### 4. Diseñar

Decida qué partes son:

- secuenciales;
- decisiones;
- repeticiones.

### 5. Escribir

Construya el algoritmo y el pseudocódigo.

### 6. Revisar

Compruebe que cada requisito aparece y que no agregó reglas inexistentes.

---

# PARTE 3 — DISEÑAR PRUEBAS ÚTILES

## 12. ¿Qué es un caso de prueba?

Un caso de prueba contiene:

- una entrada específica;
- un resultado esperado;
- la regla que se desea comprobar;
- el resultado obtenido;
- la conclusión.

### Plantilla

| ID | Objetivo | Entrada | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| P1 |  |  |  |  |  |

El resultado esperado debe escribirse antes de recorrer el algoritmo. De lo contrario, existe el riesgo de aceptar como correcto cualquier resultado que aparezca.

---

## 13. Resultado esperado y resultado obtenido

```text
RESULTADO ESPERADO
lo que las reglas indican que debe ocurrir

RESULTADO OBTENIDO
lo que el algoritmo realmente produce
```

Si coinciden, el caso pasa.

Si no coinciden, el caso falla y proporciona evidencia de un defecto.

```text
esperado = 10 % de descuento
obtenido = 5 % de descuento
estado = FALLA
```

Una falla no dice todavía cuál línea está mal. Dice que existe una diferencia que debe investigarse.

---

## 14. Caso normal

Un caso normal utiliza un valor claramente dentro de una regla.

Para el rango de notas 0 a 100:

```text
nota = 75
```

Para precio de persona adulta:

```text
edad = 30
```

Los casos normales son necesarios, pero suelen ser los más fáciles. No deben ser los únicos.

---

## 15. Caso límite

Un límite es un punto donde cambia la regla.

Si:

```text
edad < 12 → precio infantil
edad ≥ 12 → precio general
```

pruebe:

```text
11 → justo antes
12 → exactamente en el límite
13 → justo después
```

### Regla de tres valores

Para cada límite numérico:

```text
límite - 1
límite
límite + 1
```

Cuando se usan decimales, elija valores inmediatamente cercanos según la precisión permitida.

---

## 16. Caso inválido

Un caso inválido comprueba que el algoritmo rechace información imposible o prohibida.

Ejemplos:

```text
edad = -3
nota = 120
cantidad = -8
hora = 25
opción = 9 cuando solo existen 1, 2 y 3
```

No basta con que el algoritmo calcule correctamente para datos válidos. También debe proteger las reglas ante datos que no corresponden.

---

## 17. Caso sin datos

Algunos algoritmos permiten terminar antes de procesar información.

Ejemplo:

```text
0 es centinela
primera entrada = 0
```

Debe comprobarse:

- que el ciclo no procese el centinela;
- que los contadores sigan en cero;
- que no exista división entre cero;
- que aparezca un mensaje apropiado.

---

## 18. Casos de repetición

Para una repetición controlada por condición, pruebe:

| Caso | Qué comprueba |
|---|---|
| Cero iteraciones | Salida inmediata |
| Una iteración | Entrada y salida en una vuelta |
| Varias iteraciones | Actualizaciones sucesivas |
| Dato inválido dentro | Rechazo sin dañar el estado |
| Límite de salida | Momento exacto de terminar |

Para un ciclo con máximo tres intentos:

```text
acierto en el primero
acierto en el tercero
tres fallos
```

---

## 19. Familias de casos

No es necesario probar todos los números posibles. Se agrupan valores que deberían seguir la misma regla.

Ejemplo de edades:

| Familia | Comportamiento |
|---|---|
| Menor que 1 | Inválida |
| 1 a 11 | Precio infantil |
| 12 a 64 | Precio general |
| 65 a 120 | Precio de persona mayor |
| Mayor que 120 | Inválida |

Se selecciona al menos:

- un valor normal de cada familia;
- los valores alrededor de sus límites.

Este método reduce pruebas repetidas que no aportan nueva información.

---

## 20. Cobertura práctica

Para este curso, una prueba suficiente debe recorrer:

- cada salida principal;
- cada categoría;
- cada mensaje de error;
- cada límite;
- cero, una y varias iteraciones cuando existan ciclos;
- el final normal.

No se utilizarán porcentajes ni herramientas profesionales de cobertura.

La pregunta será:

> ¿Existe algún camino importante que ninguna prueba haya recorrido?

---

## 21. Video obligatorio sobre prueba de escritorio

[Pruebas de escritorio: clave para entender algoritmos — Charly Cimino](https://www.youtube.com/watch?v=6gAwS0FgzUY)

**Duración:** 6 minutos y 16 segundos  
**Tema exacto:** Seguimiento de variables y detección de resultados inesperados  
**Antes de continuar:** Observe cómo se registra cada cambio. La tabla puede hacerse en papel.  

---

# PARTE 4 — PRUEBA DE ESCRITORIO

## 22. ¿Qué es una prueba de escritorio?

Es la ejecución manual de un algoritmo.

La persona actúa como si fuera la computadora:

1. lee una instrucción;
2. evalúa las expresiones;
3. actualiza las variables;
4. elige el camino correspondiente;
5. registra las salidas;
6. repite hasta finalizar.

No se corrige mientras se rastrea. Primero se registra honestamente lo que el algoritmo hace.

---

## 23. Tabla básica de rastreo

Algoritmo:

```text
LEER cantidad
precio ← 4
subtotal ← cantidad * precio

SI cantidad ≥ 5 ENTONCES
    descuento ← subtotal * 0.10
SINO
    descuento ← 0
FIN SI

total ← subtotal - descuento
MOSTRAR total
```

Caso:

```text
cantidad = 5
```

| Paso | Instrucción o condición | Cantidad | Subtotal | Descuento | Total | Salida |
|---:|---|---:|---:|---:|---:|---|
| 1 | Leer cantidad | 5 | — | — | — | — |
| 2 | `precio ← 4` | 5 | — | — | — | — |
| 3 | Calcular subtotal | 5 | 20 | — | — | — |
| 4 | `cantidad ≥ 5` | 5 | 20 | — | — | VERDADERO |
| 5 | Calcular descuento | 5 | 20 | 2 | — | — |
| 6 | Calcular total | 5 | 20 | 2 | 18 | — |
| 7 | Mostrar | 5 | 20 | 2 | 18 | 18 |

Resultado esperado:

```text
18
```

Resultado obtenido:

```text
18
```

Estado:

```text
PASA
```

---

## 24. Rastreo de decisiones

En cada condición registre:

- la expresión completa;
- el resultado verdadero o falso;
- el camino elegido.

Ejemplo:

```text
edad ≥ 12 Y edad ≤ 17
```

Para `edad ← 18`:

```text
18 ≥ 12 → VERDADERO
18 ≤ 17 → FALSO
VERDADERO Y FALSO → FALSO
camino elegido → SINO
```

Esto ayuda a detectar si el error está:

- en los datos;
- en una comparación;
- en un operador;
- en el orden de los caminos.

---

## 25. Rastreo de ciclos

Registre una fila por iteración.

```text
total ← 0

PARA numero DESDE 1 HASTA 3 HACER
    total ← total + numero
FIN PARA
```

| Iteración | Número | Total anterior | Operación | Total nuevo |
|---:|---:|---:|---|---:|
| 1 | 1 | 0 | `0 + 1` | 1 |
| 2 | 2 | 1 | `1 + 2` | 3 |
| 3 | 3 | 3 | `3 + 3` | 6 |

Si el ciclo es `MIENTRAS`, agregue:

- resultado de la condición;
- valor que provoca la salida.

---

## 26. La primera diferencia

La pista más valiosa es el primer momento donde:

```text
valor esperado ≠ valor obtenido
```

Ejemplo:

```text
total esperado después del segundo dato = 15
total obtenido = 10
```

Si antes de esa instrucción ambos eran 5, la investigación debe comenzar en la actualización del segundo dato.

No conviene comenzar por la última salida si el estado ya era incorrecto desde varias instrucciones antes.

---

## 27. Rastrear solo lo necesario

Una tabla puede incluir:

- variables que cambian;
- condiciones importantes;
- salida producida.

No necesita repetir información que nunca cambia, salvo que ayude a comprender una fórmula.

El objetivo no es llenar una tabla enorme. Es poder responder:

```text
¿qué valor tenía?
¿qué instrucción lo cambió?
¿qué valor obtuvo?
¿era el esperado?
```

---

# PARTE 5 — DIAGNOSTICAR Y CORREGIR

## 28. Error, síntoma y causa

### Síntoma

Lo que se observa.

```text
El total final es demasiado bajo.
```

### Causa

La instrucción o decisión que origina el problema.

```text
El total se reemplaza en vez de acumularse.
```

### Corrección

El cambio que elimina la causa.

```text
total ← total + valor
```

Cambiar solamente el mensaje final no arreglaría el acumulador.

---

## 29. Error de requisito

El algoritmo resuelve una regla distinta de la solicitada.

Requisito:

```text
65 años o más
```

Algoritmo:

```text
edad > 65
```

La lógica ejecuta exactamente lo escrito, pero lo escrito no representa el requisito.

Corrección:

```text
edad ≥ 65
```

---

## 30. Error de condición

Se utiliza una comparación u operador incorrecto.

Requisito:

> Tener inscripción y cupo.

Incorrecto:

```text
inscripcion_confirmada O cupos > 0
```

Corrección:

```text
inscripcion_confirmada Y cupos > 0
```

---

## 31. Error de cálculo

La fórmula no representa la operación correcta.

Incorrecto:

```text
descuento ← subtotal * 10
```

Corrección para 10 %:

```text
descuento ← subtotal * 0.10
```

Una prueba con números fáciles, como 100, ayuda a reconocer el error.

---

## 32. Error de límite

El algoritmo incluye o excluye accidentalmente un valor extremo.

```text
hora ≥ 8 Y hora ≤ 17
```

es incorrecto si el servicio cierra exactamente a las 17.

Corrección:

```text
hora ≥ 8 Y hora < 17
```

---

## 33. Error de estado o actualización

La variable no conserva el valor correcto.

Incorrecto:

```text
total ← valor
```

si se desea acumular.

Correcto:

```text
total ← total + valor
```

Otro ejemplo:

```text
contador ← 0
```

dentro de un ciclo puede borrar todo lo contado.

---

## 34. Error de finalización

El ciclo:

- no actualiza la variable de control;
- cambia en dirección contraria;
- nunca vuelve a leer;
- utiliza una condición imposible de finalizar;
- procesa el centinela como dato.

Estos errores pueden provocar:

- ciclo infinito;
- una iteración adicional;
- salida demasiado temprana;
- datos repetidos.

---

## 35. Método de depuración en siete pasos

```text
1. REPRODUCIR
2. DEFINIR LO ESPERADO
3. REDUCIR
4. RASTREAR
5. FORMULAR UNA CAUSA
6. CORREGIR UNA COSA
7. VOLVER A PROBAR
```

### 1. Reproducir

Conserve una entrada que demuestre la falla.

### 2. Definir lo esperado

Calcule manualmente la respuesta correcta.

### 3. Reducir

Utilice el caso más pequeño que todavía muestre el problema.

### 4. Rastrear

Busque la primera diferencia.

### 5. Formular una causa

Explique por qué esa instrucción genera el resultado.

### 6. Corregir una cosa

Realice un cambio controlado. Varios cambios simultáneos dificultan saber cuál resolvió o creó un problema.

### 7. Volver a probar

Ejecute:

- el caso que falló;
- los casos que ya pasaban;
- los límites relacionados.

---

## 36. Prueba de regresión

Después de una corrección, un caso antiguo podría fallar.

Ejemplo:

- corregir el precio para edad 65;
- volver a probar 11, 12, 64, 65 y 66.

La prueba que se repite después de un cambio se utiliza para comprobar que la corrección no dañó comportamientos anteriores.

En este curso llamaremos **conjunto de regresión** a la lista breve de casos que se vuelve a ejecutar después de cada arreglo.

---

## 37. Registro de errores

| ID | Caso que falla | Síntoma | Primera diferencia | Causa | Corrección | Resultado posterior |
|---|---|---|---|---|---|---|
| E1 | Edad 65 | Precio 5 | Condición de edad | Se utilizó `>` | Cambiar a `≥` | Pasa |

Documentar evita:

- repetir la misma investigación;
- olvidar qué se cambió;
- afirmar que algo está arreglado sin evidencia.

---

## 38. Video obligatorio sobre depuración

[Debugging (Depuración): definición, uso y práctica — Ingeniela](https://www.youtube.com/watch?v=WzT08m4uyuk)

**Duración:** 9 minutos y 46 segundos  
**Tema exacto:** Proceso ordenado para encontrar y corregir errores  
**Antes de continuar:** Relacione sus pasos con reproducir, rastrear, formular una causa y volver a probar.  

---

# PARTE 6 — EJEMPLOS RESUELTOS

## 39. Ejemplo 1: descuento en el límite

### Requisito

- subtotal menor que 50: sin descuento;
- subtotal de 50 o más: 10 %;
- subtotal negativo: inválido.

### Algoritmo defectuoso

```text
LEER subtotal

SI subtotal > 50 ENTONCES
    descuento ← subtotal * 0.10
SINO
    descuento ← 0
FIN SI

total ← subtotal - descuento
MOSTRAR total
```

### Casos

| Entrada | Esperado |
|---:|---|
| -1 | Subtotal inválido |
| 49 | Total 49 |
| 50 | Total 45 |
| 51 | Total 45.9 |

### Diagnóstico

- `-1`: falta validación.
- `50`: `subtotal > 50` es falso; el límite debe incluirse.

### Corrección

```text
LEER subtotal

SI subtotal < 0 ENTONCES
    MOSTRAR "Subtotal inválido"
SINO
    SI subtotal ≥ 50 ENTONCES
        descuento ← subtotal * 0.10
    SINO
        descuento ← 0
    FIN SI

    total ← subtotal - descuento
    MOSTRAR total
FIN SI
```

Después se repiten los cuatro casos.

---

## 40. Ejemplo 2: acumulador que olvida

### Requisito

Sumar tres valores.

### Algoritmo defectuoso

```text
total ← 0

PARA posicion DESDE 1 HASTA 3 HACER
    LEER valor
    total ← valor
FIN PARA

MOSTRAR total
```

Caso:

```text
4, 6, 5
```

Esperado:

```text
15
```

Rastreo:

| Iteración | Valor | Total esperado | Total obtenido |
|---:|---:|---:|---:|
| 1 | 4 | 4 | 4 |
| 2 | 6 | 10 | 6 |
| 3 | 5 | 15 | 5 |

La primera diferencia aparece en la segunda iteración.

Corrección:

```text
total ← total + valor
```

---

## 41. Ejemplo 3: ciclo que no recibe un dato nuevo

### Algoritmo defectuoso

```text
LEER numero

MIENTRAS numero ≠ 0 HACER
    MOSTRAR numero
FIN MIENTRAS
```

Con `numero ← 5`, muestra 5 indefinidamente.

La condición depende de `numero`, pero el cuerpo nunca lo modifica.

Corrección:

```text
LEER numero

MIENTRAS numero ≠ 0 HACER
    MOSTRAR numero
    LEER numero
FIN MIENTRAS
```

Pruebas:

```text
0
5, 0
5, 8, 0
```

---

## 42. Ejemplo 4: construir, probar y corregir

### Requisito

Leer una nota y mostrar:

- inválida si está fuera de 0 a 100;
- excelente desde 90;
- aprobada desde 70;
- necesita mejorar en cualquier otro caso válido.

### Casos antes del algoritmo

| Nota | Esperado |
|---:|---|
| -1 | Inválida |
| 0 | Necesita mejorar |
| 69 | Necesita mejorar |
| 70 | Aprobada |
| 89 | Aprobada |
| 90 | Excelente |
| 100 | Excelente |
| 101 | Inválida |

### Diseño

```text
validar
clasificar de la categoría más alta a la más baja
definir caso restante
```

### Pseudocódigo

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

Los ocho casos recorren todos los caminos y sus límites.

---

# PARTE 7 — ACTIVIDAD SIN COMPUTADORA

## 43. Hospital de algoritmos

### Roles

- **Persona solicitante:** lee los requisitos.
- **Algoritmo:** sigue exactamente las instrucciones.
- **Persona probadora:** entrega casos y resultados esperados.
- **Observadora:** registra el primer punto de diferencia.

### Requisitos

```text
Edad válida: 1 a 120.
Menor de 12: precio 3.
De 12 a 64: precio 5.
Desde 65: precio 2.
```

### Algoritmo con error

```text
SI edad < 12 ENTONCES
    precio ← 3
SINO SI edad > 65 ENTONCES
    precio ← 2
SINO
    precio ← 5
FIN SI
```

### Tarjetas de prueba

```text
-1, 1, 11, 12, 64, 65, 66, 120, 121
```

### Instrucciones

1. La persona probadora escribe el resultado esperado.
2. El algoritmo recorre las instrucciones sin interpretarlas.
3. La observadora registra condición, camino y precio.
4. Se marcan los casos que fallan.
5. El grupo propone una causa.
6. Se realiza un solo cambio.
7. Se repiten todas las tarjetas.

### Aprendizaje esperado

El algoritmo no puede “entender la intención”. Ejecuta las reglas expresadas. Las pruebas conectan la intención con el comportamiento real.

---

# PARTE 8 — EJERCICIOS

> Los ejercicios son práctica guiada. No se envían uno por uno. Intente resolverlos antes de abrir sus soluciones.

## 44. Ejercicio 1 — El interrogatorio de requisitos

Una biblioteca dice:

> Una persona puede llevar libros si es miembro y no tiene demasiados préstamos. Las personas con deuda no pueden retirar.

Antes de construir el algoritmo:

1. identifique las entradas mencionadas;
2. identifique las reglas claras;
3. escriba al menos cinco preguntas necesarias;
4. explique qué significa “demasiados” y por qué no puede adivinarse;
5. proponga una versión completa de los requisitos mediante suposiciones explícitas;
6. separe entradas, reglas, salidas, inválidos y finalización;
7. escriba cuatro criterios de éxito;
8. diseñe cinco casos de prueba con su resultado esperado.

---

## 45. Ejercicio 2 — Fronteras de una entrada

Un museo establece:

- edades válidas de 1 a 120;
- de 1 a 11: precio 3;
- de 12 a 64: precio 5;
- de 65 a 120: precio 2.

Realice:

1. tabla con las familias de valores;
2. selección de un caso normal por familia;
3. casos justo antes, en y después de los límites 1, 12, 65 y 120;
4. resultado esperado de cada caso;
5. conjunto mínimo que recorra todos los precios y los dos inválidos;
6. explicación de por qué probar únicamente 30 es insuficiente.

---

## 46. Ejercicio 3 — Localice la primera diferencia

Requisito:

> Sumar tres importes.

Algoritmo:

```text
total ← 0

PARA posicion DESDE 1 HASTA 3 HACER
    LEER importe
    total ← importe
FIN PARA

MOSTRAR total
```

Utilice:

```text
8, 4, 6
```

Debe:

1. calcular el resultado esperado;
2. construir una tabla por iteración;
3. indicar la primera diferencia;
4. identificar síntoma y causa;
5. escribir la corrección;
6. volver a rastrear;
7. crear dos casos adicionales para el conjunto de regresión.

---

## 47. Ejercicio 4 — Todos los caminos del envío

Una tienda utiliza:

- subtotal negativo: inválido;
- subtotal menor que 40: envío 5;
- subtotal desde 40: envío gratuito;
- si el cliente es miembro y el subtotal es válido, recibe además 10 % de descuento sobre los productos;
- el costo final es subtotal menos descuento más envío.

Realice:

1. entradas, reglas, salidas e inválidos;
2. pseudocódigo;
3. casos para `subtotal = -1, 0, 39, 40 y 41`;
4. para cada subtotal válido, pruebe miembro y no miembro;
5. calcule los resultados esperados;
6. indique qué casos prueban simultáneamente el límite del envío y el descuento;
7. complete una prueba de escritorio para `subtotal = 40` y miembro verdadero.

---

## 48. Ejercicio 5 — Ciclo congelado

Requisito:

> Leer donaciones positivas hasta ingresar 0. Rechazar negativas y mostrar el total.

Algoritmo defectuoso:

```text
total ← 0
LEER donacion

MIENTRAS donacion ≠ 0 HACER
    SI donacion > 0 ENTONCES
        total ← donacion
    SINO
        MOSTRAR "Donación inválida"
    FIN SI
FIN MIENTRAS

MOSTRAR total
```

Realice:

1. prediga qué ocurre con la primera entrada `10`;
2. encuentre todos los errores;
3. separe síntoma y causa para cada uno;
4. corrija el pseudocódigo;
5. pruebe `0`;
6. pruebe `10, 0`;
7. pruebe `10, -4, 5, 0`;
8. explique por qué el dato negativo no modifica el total.

---

## 49. Ejercicio 6 — Construya antes de corregir

Un estacionamiento necesita calcular el pago:

- horas válidas: de 1 a 12;
- primeras 2 horas: 3 unidades en total;
- cada hora adicional cuesta 2;
- una cantidad fuera del rango es inválida.

Ejemplos:

```text
1 hora → 3
2 horas → 3
3 horas → 5
5 horas → 9
```

Realice:

1. entradas, reglas, salidas e inválidos;
2. fórmula de las horas adicionales;
3. pseudocódigo;
4. casos para `0, 1, 2, 3, 11, 12 y 13`;
5. resultados esperados;
6. prueba de escritorio para 3 horas;
7. revisión que relacione cada requisito con una parte del algoritmo.

---

## 50. Ejercicio 7 — Regresión después del arreglo

Un algoritmo clasificaba correctamente edades infantiles y generales, pero cobraba precio general a los 65 años.

Corrección:

```text
Cambiar edad > 65 por edad ≥ 65.
```

Diseñe un conjunto de regresión que incluya:

- edades inválidas;
- todos los precios;
- límites;
- casos que funcionaban antes;
- el caso que reveló el error.

Después:

1. escriba al menos ocho entradas;
2. indique el resultado esperado;
3. explique qué prueba demuestra la corrección;
4. explique cuáles comprueban que no se dañaron las otras categorías;
5. redacte una fila de registro de error con síntoma, causa, cambio y evidencia.

---

# PARTE 9 — RETOS

## 51. Reto 1 — Requisito imposible de probar

Una persona solicita:

> El sistema debe cobrar una tarifa razonable a las personas jóvenes y una tarifa especial a las mayores.

Realice:

1. enumere todas las palabras ambiguas;
2. explique por qué no puede existir todavía un resultado esperado objetivo;
3. redacte seis preguntas de aclaración;
4. proponga requisitos completos y medibles;
5. diseñe casos normales, límites e inválidos;
6. escriba cómo cambiarían las pruebas si “mayor” significara `> 65` en lugar de `≥ 65`.

---

## 52. Reto 2 — El menor conjunto que revela todos los errores

Requisitos:

- valores válidos de 1 a 100;
- menores que 50: categoría `"Baja"`;
- desde 50: categoría `"Alta"`;
- procesar datos hasta ingresar 0;
- contar únicamente datos válidos.

Algoritmo defectuoso:

```text
cantidad ← 0
LEER valor

MIENTRAS valor ≥ 0 HACER
    SI valor > 50 ENTONCES
        MOSTRAR "Alta"
    SINO
        MOSTRAR "Baja"
    FIN SI

    cantidad ← 0
    LEER valor
FIN MIENTRAS

MOSTRAR cantidad
```

Encuentre el conjunto más pequeño de casos de prueba que, en conjunto, revele:

- procesamiento incorrecto del centinela;
- límite incorrecto de 50;
- aceptación de valores mayores que 100;
- contador reiniciado;
- condición de finalización incorrecta para un negativo.

Puede utilizar más de una secuencia si un dato de finalización impide probar los valores posteriores. Debe justificar qué error revela cada entrada. Después escriba la versión corregida y repita los casos.

---

# PARTE 10 — MINI PROYECTO

## 53. Clínica de algoritmos: venta de entradas

### Situación

Un museo registra visitantes uno por uno. Usted recibirá un algoritmo defectuoso y deberá diagnosticarlo, corregirlo y demostrar su funcionamiento.

### Requisitos

1. Se ingresa la edad de cada visitante.
2. El valor `0` termina el registro y no representa una edad.
3. Las edades válidas están entre 1 y 120.
4. Una edad inválida muestra `"Edad inválida"` y no se cuenta.
5. Precios:
   - de 1 a 11 años: `3`;
   - de 12 a 64 años: `5`;
   - de 65 a 120 años: `2`.
6. Cada visitante válido aumenta la cantidad.
7. Cada precio válido se suma al total recaudado.
8. Al finalizar:
   - mostrar cantidad y total;
   - calcular el precio promedio si hubo visitantes;
   - mostrar `"No se registraron visitantes"` si la primera entrada es 0 o no hubo edades válidas.

### Algoritmo defectuoso

```text
cantidad ← 0
total_recaudado ← 0

LEER edad

MIENTRAS edad ≠ 0 HACER
    SI edad < 12 ENTONCES
        precio ← 3
    SINO SI edad > 65 ENTONCES
        precio ← 2
    SINO
        precio ← 5
    FIN SI

    cantidad ← 0
    total_recaudado ← precio
FIN MIENTRAS

promedio ← total_recaudado / cantidad

MOSTRAR cantidad
MOSTRAR total_recaudado
MOSTRAR promedio
```

> No ejecute el algoritmo en una herramienta antes de analizarlo. Comience con requisitos, predicción y rastreo.

---

## 54. Entregables del mini proyecto

### Parte 1 — Matriz de requisitos

Complete:

| ID | Requisito | Entrada relacionada | Salida o efecto esperado |
|---|---|---|---|
| R1 |  |  |  |

Incluya los ocho requisitos.

### Parte 2 — Predicción inicial

Explique qué ocurriría si la primera edad fuera:

```text
10
```

Indique:

- qué mostraría repetidamente;
- qué variables cambiarían;
- si el ciclo terminaría;
- cuál sería la primera causa visible.

### Parte 3 — Registro de errores

Localice al menos siete defectos.

| ID | Requisito afectado | Síntoma | Causa en el pseudocódigo | Corrección |
|---|---|---|---|---|
| E1 |  |  |  |  |

### Parte 4 — Pseudocódigo corregido

La solución debe:

- validar antes de clasificar;
- utilizar correctamente los límites;
- leer una nueva edad;
- contar y acumular;
- proteger el promedio;
- mostrar el caso sin visitantes.

### Parte 5 — Diagrama de flujo corregido

Debe incluir:

- lectura inicial;
- comprobación del centinela;
- validación;
- clasificación de precio;
- actualizaciones;
- nueva lectura;
- regreso a la condición;
- resumen con y sin visitantes;
- final.

### Parte 6 — Plan de pruebas

Complete los resultados esperados:

| Caso | Secuencia de edades | Objetivo | Cantidad | Total | Promedio o mensaje |
|---|---|---|---:|---:|---|
| A | `0` | Sin datos |  |  |  |
| B | `10, 30, 70, 0` | Tres categorías |  |  |  |
| C | `-4, 130, 12, 65, 0` | Inválidos y límites |  |  |  |
| D | `11, 12, 64, 65, 0` | Límites de precios |  |  |  |

### Parte 7 — Prueba de escritorio

Realice el rastreo completo del caso D.

Incluya:

- edad;
- resultado de validación;
- categoría;
- precio;
- cantidad anterior y nueva;
- total anterior y nuevo;
- condición del ciclo.

### Parte 8 — Comparación antes y después

Para cada defecto:

- escriba un caso que lo revele;
- indique qué ocurría antes;
- indique qué ocurre después;
- marque `CORREGIDO` únicamente si el resultado coincide con el esperado.

### Parte 9 — Reflexión

Responda en cuatro a seis oraciones:

1. ¿Cuál defecto impedía observar los demás con facilidad?
2. ¿Por qué no bastaba con agregar la lectura y detener el ciclo infinito?
3. ¿Qué caso considera más importante y por qué?
4. ¿Qué pruebas conservaría si el algoritmo cambiara?

---

## 55. Lista de verificación antes de entregar

```text
[ ] Convertí todos los requisitos en resultados observables.
[ ] Predije el comportamiento antes de corregir.
[ ] Separé síntomas y causas.
[ ] Registré al menos siete defectos.
[ ] La edad 0 termina y no se procesa.
[ ] Rechazo edades menores que 1 y mayores que 120.
[ ] Los límites 11, 12, 64 y 65 producen el precio correcto.
[ ] Leo una nueva edad dentro del ciclo.
[ ] La cantidad aumenta únicamente para visitantes válidos.
[ ] El total acumula todos los precios válidos.
[ ] No divido entre cero.
[ ] Mi pseudocódigo y mi diagrama coinciden.
[ ] Completé los cuatro casos obligatorios.
[ ] Rastreé por completo el caso D.
[ ] Repetí las pruebas después de corregir.
[ ] El archivo se puede leer con claridad.
```

---

## 56. Rúbrica del mini proyecto

| Criterio | Puntos |
|---|---:|
| Comprensión y matriz de requisitos | 10 |
| Predicción del comportamiento defectuoso | 10 |
| Diagnóstico con síntomas, causas y evidencia | 20 |
| Pseudocódigo corregido | 20 |
| Diagrama de flujo equivalente | 10 |
| Plan de pruebas y resultados esperados | 15 |
| Prueba de escritorio | 10 |
| Comparación y reflexión | 5 |
| **Total** | **100** |

### Criterios de dominio

| Resultado | Interpretación |
|---:|---|
| 90–100 | Dominio sólido |
| 75–89 | Logro satisfactorio |
| 60–74 | Requiere mejorar diagnóstico o pruebas |
| Menos de 60 | Conviene repasar antes del proyecto final |

---

## 57. Punto de entrega

Se utiliza **un solo punto de entrega para todo el mini proyecto**. Los ejercicios y retos no necesitan formularios separados.

### Archivo

Reúna las nueve partes en un único archivo PDF.

Nombre recomendado:

```text
Modulo5_Nombre_Apellido.pdf
```

Puede incluir:

- texto;
- tablas;
- pseudocódigo;
- diagrama;
- capturas o fotografías claras del trabajo hecho a mano.

### Indicación para el formulario

Escriba:

```text
Módulo 5 — Clínica de algoritmos — Nombre y apellido
```

Formulario:

[Entregar el mini proyecto del Módulo 5](https://forms.gle/BayPBDiXAGurWjnL6)

> Envíe únicamente el mini proyecto completo.

---

# PARTE 11 — SOLUCIONES EXPLICADAS

## 58. Solución del diagnóstico

Casos recomendados:

```text
49, 50, 51
99, 100, 101
-1
```

- `49, 50, 51` comprueban el primer límite.
- `99, 100, 101` comprueban el segundo.
- `-1` comprueba el dato inválido.
- `75` solo recorre la categoría del 5 %.
- Para `100`, se espera 10 %.
- Si se obtiene 5 %, debe revisarse el orden o el operador del límite 100.

---

## 59. Solución del ejercicio 1

Entradas mencionadas:

- estado de membresía;
- cantidad de préstamos;
- existencia de deuda.

Preguntas necesarias:

1. ¿Cuál es el máximo de préstamos?
2. ¿El máximo está incluido?
3. ¿Qué valores representan membresía activa?
4. ¿Qué ocurre con una cantidad negativa?
5. ¿Qué mensaje se muestra para cada rechazo?

Una posible suposición:

```text
Puede retirar si:
membresía activa
Y préstamos actuales < 3
Y NO tiene deuda.
```

Casos:

| Membresía | Préstamos | Deuda | Esperado |
|---|---:|---|---|
| Activa | 0 | No | Autorizar |
| Activa | 2 | No | Autorizar |
| Activa | 3 | No | Rechazar por límite |
| Inactiva | 0 | No | Rechazar membresía |
| Activa | 0 | Sí | Rechazar deuda |

---

## 60. Solución del ejercicio 2

Familias:

| Familia | Resultado |
|---|---|
| Menor que 1 | Inválida |
| 1–11 | Precio 3 |
| 12–64 | Precio 5 |
| 65–120 | Precio 2 |
| Mayor que 120 | Inválida |

Casos completos de límites:

```text
0, 1, 2
11, 12, 13
64, 65, 66
119, 120, 121
```

Un conjunto reducido que recorre todos los comportamientos:

```text
0, 1, 11, 12, 64, 65, 120, 121
```

El valor 30 solo prueba el precio general.

---

## 61. Solución del ejercicio 3

Esperado:

```text
8 + 4 + 6 = 18
```

| Iteración | Importe | Total esperado | Total obtenido |
|---:|---:|---:|---:|
| 1 | 8 | 8 | 8 |
| 2 | 4 | 12 | 4 |
| 3 | 6 | 18 | 6 |

- Síntoma: la salida es 6.
- Primera diferencia: segunda iteración.
- Causa: `total ← importe` reemplaza el total.
- Corrección:

```text
total ← total + importe
```

Regresión posible:

```text
0, 0, 0 → 0
5, -2, 1 → 4
```

Si los importes negativos no fueran válidos, ese requisito debería añadirse y la segunda prueba cambiaría.

---

## 62. Solución del ejercicio 4

```text
LEER subtotal
LEER es_miembro

SI subtotal < 0 ENTONCES
    MOSTRAR "Subtotal inválido"
SINO
    SI subtotal ≥ 40 ENTONCES
        envio ← 0
    SINO
        envio ← 5
    FIN SI

    SI es_miembro ENTONCES
        descuento ← subtotal * 0.10
    SINO
        descuento ← 0
    FIN SI

    total ← subtotal - descuento + envio
    MOSTRAR total
FIN SI
```

| Subtotal | Miembro | Esperado |
|---:|---|---:|
| -1 | No | Inválido |
| 0 | No | 5 |
| 0 | Sí | 5 |
| 39 | No | 44 |
| 39 | Sí | 40.1 |
| 40 | No | 40 |
| 40 | Sí | 36 |
| 41 | No | 41 |
| 41 | Sí | 36.9 |

El caso `40` con membresía prueba simultáneamente el límite del envío y el descuento.

---

## 63. Solución del ejercicio 5

Errores:

1. Falta una nueva lectura dentro del ciclo.
2. `total ← donacion` reemplaza en vez de acumular.

Corrección:

```text
total ← 0
LEER donacion

MIENTRAS donacion ≠ 0 HACER
    SI donacion > 0 ENTONCES
        total ← total + donacion
    SINO
        MOSTRAR "Donación inválida"
    FIN SI

    LEER donacion
FIN MIENTRAS

MOSTRAR total
```

Resultados:

```text
0 → total 0
10, 0 → total 10
10, -4, 5, 0 → total 15
```

El negativo toma el camino de error y no ejecuta la actualización.

---

## 64. Solución del ejercicio 6

Fórmula:

```text
horas_adicionales ← horas - 2
pago ← 3 + horas_adicionales * 2
```

Pseudocódigo:

```text
LEER horas

SI horas < 1 O horas > 12 ENTONCES
    MOSTRAR "Cantidad de horas inválida"
SINO SI horas ≤ 2 ENTONCES
    pago ← 3
    MOSTRAR pago
SINO
    horas_adicionales ← horas - 2
    pago ← 3 + horas_adicionales * 2
    MOSTRAR pago
FIN SI
```

| Horas | Esperado |
|---:|---|
| 0 | Inválida |
| 1 | 3 |
| 2 | 3 |
| 3 | 5 |
| 11 | 21 |
| 12 | 23 |
| 13 | Inválida |

Para 3:

```text
horas_adicionales = 3 - 2 = 1
pago = 3 + 1 * 2 = 5
```

---

## 65. Solución del ejercicio 7

Conjunto:

| Edad | Esperado |
|---:|---|
| 0 | Inválida |
| 1 | Precio 3 |
| 11 | Precio 3 |
| 12 | Precio 5 |
| 64 | Precio 5 |
| 65 | Precio 2 |
| 66 | Precio 2 |
| 120 | Precio 2 |
| 121 | Inválida |

El caso 65 demuestra la corrección. Los demás demuestran que las categorías vecinas y la validación continúan funcionando.

Registro:

| Síntoma | Causa | Cambio | Evidencia |
|---|---|---|---|
| Edad 65 recibe precio 5 | Se utilizó `>` | Cambiar a `≥` | 65 produce precio 2 y los demás casos pasan |

---

## 66. Solución del reto 1

Palabras ambiguas:

- razonable;
- jóvenes;
- mayores;
- especial.

Preguntas:

1. ¿Qué edades son válidas?
2. ¿Hasta qué edad se considera joven?
3. ¿Desde qué edad se considera mayor?
4. ¿Los límites están incluidos?
5. ¿Cuál es cada tarifa?
6. ¿Qué ocurre con edades inválidas?

Una versión comprobable:

```text
Edades válidas: 1 a 120.
De 1 a 17: tarifa 3.
De 18 a 64: tarifa 5.
De 65 a 120: tarifa 2.
```

Pruebas:

```text
0, 1, 17, 18, 64, 65, 120, 121
```

Si “mayor” fuera `> 65`, la edad 65 pertenecería a la categoría anterior y 66 sería el primer valor especial.

---

## 67. Solución del reto 2

Se necesitan dos casos porque, en la versión correcta, ningún dato situado después del centinela debe procesarse.

**Caso A**

```text
50, 101, 1, 0, -1
```

En el algoritmo defectuoso, este caso aporta la siguiente evidencia:

- `50`: revela `> 50` en vez de `≥ 50`;
- `101`: revela falta de máximo;
- `1`: junto con los anteriores revela que el contador no conserva la cantidad;
- `0`: el ciclo lo procesa como categoría Baja;
- `-1`: finalmente termina, mostrando que la condición utiliza `≥ 0` en vez del centinela exacto.

**Caso B**

```text
-1, 0
```

Este segundo caso permite comprobar el tratamiento de un negativo antes del centinela. El algoritmo defectuoso termina inmediatamente al recibir `-1`, aunque el requisito indica que solo `0` finaliza el proceso.

Versión corregida:

```text
cantidad ← 0
LEER valor

MIENTRAS valor ≠ 0 HACER
    SI valor < 1 O valor > 100 ENTONCES
        MOSTRAR "Valor inválido"
    SINO
        SI valor ≥ 50 ENTONCES
            MOSTRAR "Alta"
        SINO
            MOSTRAR "Baja"
        FIN SI

        cantidad ← cantidad + 1
    FIN SI

    LEER valor
FIN MIENTRAS

MOSTRAR cantidad
```

Al repetir los casos con la versión corregida:

- en el caso A, 50 y 1 son válidos, 101 es inválido y 0 termina el proceso;
- el `-1` situado después de 0 no se lee porque el proceso ya terminó;
- la cantidad final del caso A es 2;
- en el caso B, `-1` se informa como inválido, luego 0 termina y la cantidad final es 0.

---

## 68. Solución de referencia del mini proyecto

### Predicción

Con la primera edad `10`:

- asigna precio 3;
- reinicia cantidad en 0;
- reemplaza total por 3;
- no lee una nueva edad;
- vuelve a evaluar `10 ≠ 0`;
- repite indefinidamente.

### Registro de defectos

| ID | Defecto | Causa | Corrección |
|---|---|---|---|
| E1 | Ciclo infinito | Falta nueva lectura | Leer edad al final del ciclo |
| E2 | Edades inválidas cobran precio | Falta validación | Validar 1 a 120 |
| E3 | Edad 65 cobra 5 | Se utiliza `> 65` | Utilizar `≥ 65` |
| E4 | Cantidad siempre queda en 0 | Se reinicia | `cantidad ← cantidad + 1` |
| E5 | Total conserva solo un precio | Se reemplaza | `total ← total + precio` |
| E6 | División entre cero | Promedio sin comprobación | Calcular solo si cantidad > 0 |
| E7 | Falta caso sin visitantes | Siempre intenta promedio | Mostrar mensaje cuando cantidad = 0 |

### Pseudocódigo corregido

```text
cantidad ← 0
total_recaudado ← 0

LEER edad

MIENTRAS edad ≠ 0 HACER
    SI edad < 1 O edad > 120 ENTONCES
        MOSTRAR "Edad inválida"
    SINO
        SI edad < 12 ENTONCES
            precio ← 3
        SINO SI edad ≥ 65 ENTONCES
            precio ← 2
        SINO
            precio ← 5
        FIN SI

        cantidad ← cantidad + 1
        total_recaudado ← total_recaudado + precio
    FIN SI

    LEER edad
FIN MIENTRAS

SI cantidad > 0 ENTONCES
    promedio ← total_recaudado / cantidad
    MOSTRAR cantidad
    MOSTRAR total_recaudado
    MOSTRAR promedio
SINO
    MOSTRAR "No se registraron visitantes"
FIN SI
```

### Diagrama lógico de referencia

```text
┌────────────┐
│   INICIO   │
└─────┬──────┘
      ▼
┌──────────────────────────────┐
│ cantidad ← 0                │
│ total_recaudado ← 0         │
└──────────────┬───────────────┘
               ▼
        ┌─────────────┐
        │ LEER edad   │◄──────────────────────────────────┐
        └──────┬──────┘                                   │
               ▼                                          │
        ┌─────────────┐                                    │
        │ ¿edad = 0?  │                                    │
        └───┬─────┬───┘                                    │
          Sí│     │No                                      │
            │     ▼                                        │
            │  ┌────────────────────────┐                   │
            │  │ ¿edad < 1 O > 120?     │                   │
            │  └──────┬─────────┬───────┘                   │
            │       Sí│         │No                         │
            │         ▼         ▼                           │
            │  ┌────────────┐  ┌────────────────────────┐   │
            │  │ Mostrar    │  │ Determinar precio     │   │
            │  │ inválida   │  │ según rango de edad   │   │
            │  └─────┬──────┘  └──────────┬─────────────┘   │
            │        │                    ▼                 │
            │        │       ┌──────────────────────────┐   │
            │        │       │ cantidad ← cantidad + 1 │   │
            │        │       │ total ← total + precio  │   │
            │        │       └────────────┬─────────────┘   │
            │        └────────────────────┴─────────────────┘
            ▼
     ┌─────────────────┐
     │ ¿cantidad > 0?  │
     └────┬───────┬────┘
        Sí│       │No
          ▼       ▼
┌───────────────────┐  ┌──────────────────────────────┐
│ Calcular promedio │  │ Mostrar “No se registraron  │
│ y mostrar resumen │  │ visitantes”                 │
└─────────┬─────────┘  └──────────────┬───────────────┘
          └──────────────┬─────────────┘
                         ▼
                  ┌────────────┐
                  │    FIN     │
                  └────────────┘
```

### Resultados esperados

| Caso | Cantidad | Total | Promedio o mensaje |
|---|---:|---:|---|
| A: `0` | 0 | 0 | No se registraron visitantes |
| B: `10, 30, 70, 0` | 3 | 10 | 3.33 aproximadamente |
| C: `-4, 130, 12, 65, 0` | 2 | 7 | 3.5 |
| D: `11, 12, 64, 65, 0` | 4 | 15 | 3.75 |

### Rastreo del caso D

| Edad | Válida | Precio | Cantidad anterior | Cantidad nueva | Total anterior | Total nuevo |
|---:|---|---:|---:|---:|---:|---:|
| 11 | Sí | 3 | 0 | 1 | 0 | 3 |
| 12 | Sí | 5 | 1 | 2 | 3 | 8 |
| 64 | Sí | 5 | 2 | 3 | 8 | 13 |
| 65 | Sí | 2 | 3 | 4 | 13 | 15 |
| 0 | Centinela | — | 4 | 4 | 15 | 15 |

```text
promedio = 15 / 4 = 3.75
```

---

# PARTE 12 — EVALUACIÓN

## 69. Evaluación de dominio

### Pregunta 1

¿Cuándo debe definirse el resultado esperado?

a. Después de observar la salida  
b. Antes de ejecutar el caso  
c. Solo si el caso falla  
d. Nunca

### Pregunta 2

¿Qué valores prueban mejor el límite 50?

a. 10 y 20  
b. 49, 50 y 51  
c. 50 únicamente  
d. 100 y 200

### Pregunta 3

¿Qué es la primera diferencia?

a. La última salida del algoritmo  
b. El primer punto donde el estado obtenido deja de coincidir con el esperado  
c. La primera variable declarada  
d. El primer caso que pasa

### Pregunta 4

Si el total final es incorrecto porque se reemplaza en cada iteración, ¿cuál es la causa?

a. El mensaje final  
b. La actualización `total ← valor`  
c. El nombre de la variable  
d. La cantidad de pruebas

### Pregunta 5

¿Qué debe hacerse después de una corrección?

a. Probar solo el caso que falló  
b. Eliminar las pruebas anteriores  
c. Repetir el caso fallido y el conjunto de regresión  
d. Cambiar otros elementos sin comprobar

### Pregunta 6

¿Qué comprueba un caso con el centinela como primera entrada?

a. Muchas iteraciones  
b. El comportamiento sin datos  
c. La categoría mayor  
d. Una fórmula de descuento

### Pregunta 7

¿Por qué conviene realizar un cambio por vez?

a. Para saber qué cambio produjo el efecto  
b. Porque los algoritmos solo aceptan una línea  
c. Para evitar escribir pruebas  
d. Porque nunca hay más de un error

### Pregunta 8

¿Cuál afirmación es correcta?

a. Un caso exitoso demuestra que todo el algoritmo funciona  
b. Las pruebas aleatorias siempre cubren los límites  
c. Una corrección debe eliminar la causa y comprobarse con evidencia  
d. Los datos inválidos no necesitan pruebas

---

## 70. Respuestas de la evaluación

| Pregunta | Respuesta | Explicación |
|---:|---|---|
| 1 | b | Permite comparar sin adaptar la expectativa |
| 2 | b | Prueban antes, en y después |
| 3 | b | Allí comienza la investigación |
| 4 | b | La asignación borra lo acumulado |
| 5 | c | Se comprueba el arreglo y efectos secundarios |
| 6 | b | El ciclo debe terminar sin procesar datos |
| 7 | a | Aísla la causa del cambio |
| 8 | c | Corregir exige una prueba posterior |

### Criterio recomendado

- **7 u 8 correctas:** puede avanzar al proyecto final.
- **5 o 6 correctas:** revise límites, rastreo y regresión.
- **4 o menos:** repita los ejercicios 3, 5 y el mini proyecto antes de avanzar.

---

## 71. Autoevaluación

| Habilidad | Sí | Todavía practico | No |
|---|:---:|:---:|:---:|
| Puedo extraer requisitos antes de escribir |  |  |  |
| Detecto ambigüedades |  |  |  |
| Defino resultados esperados |  |  |  |
| Diseño casos normales, límite e inválidos |  |  |  |
| Pruebo cero, una y varias iteraciones |  |  |  |
| Realizo una prueba de escritorio |  |  |  |
| Localizo la primera diferencia |  |  |  |
| Distingo síntoma y causa |  |  |  |
| Corrijo una causa a la vez |  |  |  |
| Repito las pruebas después de corregir |  |  |  |
| Documento la evidencia |  |  |  |

---

# PARTE 13 — RECURSOS

## 72. Video opcional con PSeInt

[¿Qué es y cómo se utiliza la prueba de escritorio? | PSeInt — Ingenio Programado](https://www.youtube.com/watch?v=M_7rdGVPmZY)

**Duración:** 4 minutos y 32 segundos  
**Tema exacto:** Uso de la función de prueba de escritorio de PSeInt  
**Uso recomendado:** Después de dominar el rastreo manual

> La herramienta no sustituye la capacidad de predecir y explicar el resultado.

---

## 73. Lecturas y documentación

### Lectura esencial sobre algoritmos

[Algoritmos y pseudocódigo — INTEF](https://formacion.intef.es/tutorizados_2013_2019/pluginfile.php/109756/mod_folder/content/0/Programar_03_15_T5_algoritmos.pdf?forcedownload=1)

Utilidad:

- repasar que un algoritmo debe ser correcto, finito, claro y portable;
- recordar la importancia de pensar antes de programar;
- revisar representaciones independientes del lenguaje.

### Referencia de pseudocódigo

[Documentación oficial de PSeInt](https://pseint.sourceforge.net/index.php?page=pseudocodigo.php)

Utilidad:

- consultar estructuras de control;
- comparar su pseudocódigo con una notación formal;
- ejecutar opcionalmente los casos del módulo.

### Ampliación opcional sobre errores

[¿Qué ha salido mal? Corrigiendo JavaScript — MDN Web Docs](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/What_went_wrong)

La lectura utiliza JavaScript. No aprenda su sintaxis en este curso. Concéntrese en:

- diferencia entre un error que impide ejecutar y un error lógico;
- uso de evidencia;
- investigación ordenada;
- importancia de explicar el problema.

---

# PARTE 14 — GLOSARIO

## 74. Conceptos del módulo

| Concepto | Explicación sencilla |
|---|---|
| Requisito | Comportamiento que la solución debe cumplir |
| Ambigüedad | Regla que admite varias interpretaciones |
| Suposición | Decisión declarada cuando falta información |
| Criterio de éxito | Resultado observable que demuestra un requisito |
| Caso de prueba | Entrada, esperado, obtenido y conclusión |
| Resultado esperado | Respuesta correcta según los requisitos |
| Resultado obtenido | Respuesta que produce el algoritmo |
| Caso normal | Dato claramente dentro de una regla |
| Caso límite | Dato en o cerca de un punto de cambio |
| Caso inválido | Dato que debe rechazarse |
| Caso sin datos | Finalización antes de procesar información válida |
| Familia de casos | Valores que deberían seguir el mismo comportamiento |
| Cobertura práctica | Recorrido de todos los caminos importantes |
| Prueba de escritorio | Ejecución manual y ordenada |
| Primera diferencia | Primer estado que deja de coincidir con el esperado |
| Síntoma | Efecto visible del defecto |
| Causa | Regla o instrucción que origina el defecto |
| Depuración | Proceso de encontrar y corregir una causa |
| Regresión | Repetición de pruebas después de un cambio |
| Registro de errores | Evidencia organizada de falla, causa y corrección |

---

# PARTE 15 — CIERRE

## 75. Resumen visual

```text
COMPRENDER
   ↓
ESCRIBIR REQUISITOS MEDIBLES
   ↓
CALCULAR RESULTADOS ESPERADOS
   ↓
CONSTRUIR EL ALGORITMO
   ↓
PROBAR:
NORMAL + LÍMITE + INVÁLIDO + SIN DATOS
   ↓
RASTREAR CADA CAMBIO
   ↓
LOCALIZAR LA PRIMERA DIFERENCIA
   ↓
CORREGIR LA CAUSA
   ↓
REPETIR TODAS LAS PRUEBAS
   ↓
DOCUMENTAR LA EVIDENCIA
```

### Ocho ideas fundamentales

1. No se puede probar correctamente un requisito ambiguo.
2. El resultado esperado se define antes de ejecutar.
3. Un caso exitoso no demuestra que todos los caminos funcionen.
4. Los límites revelan muchos errores.
5. La prueba de escritorio muestra cómo cambia el estado.
6. La primera diferencia orienta hacia la causa.
7. Se corrige la causa, no se oculta el síntoma.
8. Toda corrección debe volver a probarse.

---

## 76. Habilidades obtenidas

Al completar el módulo, habrá desarrollado:

- análisis de requisitos;
- detección de ambigüedades;
- diseño de resultados verificables;
- selección estratégica de casos;
- pruebas normales, límite, inválidas y sin datos;
- rastreo de secuencias, decisiones y ciclos;
- diagnóstico basado en la primera diferencia;
- distinción entre síntoma y causa;
- corrección controlada;
- comprobación de regresión;
- documentación de evidencia;
- revisión integral de algoritmos.

---

## 77. Puente hacia el Módulo 6

Ahora usted sabe:

- comprender un problema;
- organizar entradas, procesos y salidas;
- utilizar variables;
- tomar decisiones;
- construir repeticiones;
- diseñar pruebas;
- encontrar y corregir errores.

El Módulo 6 será el proyecto final. No introducirá una gran cantidad de teoría nueva. Su objetivo será integrar todo el curso en una solución completa, explicada, representada, probada y corregida.

---

# FIN DEL MÓDULO 5

**No avanzar al Módulo 6 hasta que el Módulo 5 sea revisado y aprobado.**
