# Guía de decisión para recorridos y transformaciones

| Necesidad | Primera opción que conviene evaluar | Pregunta de control |
|---|---|---|
| Posición y elemento | `enumerate()` | ¿Necesito el índice real o solo numerar? |
| Colecciones paralelas | `zip()` | ¿Las longitudes deben coincidir? |
| Nueva lista transformada | Comprensión de lista | ¿La expresión sigue siendo fácil de leer? |
| Diccionario indexado | Comprensión de diccionario | ¿Las claves son únicas? |
| Valores únicos | Comprensión de conjunto | ¿Necesito conservar el orden de presentación? |
| Consumir resultados una vez | Expresión generadora | ¿Alguna parte intentará recorrerla de nuevo? |
| Aplicar una función existente | `map()` | ¿El nombre de la función expresa mejor la intención? |
| Aplicar un predicado existente | `filter()` | ¿Una comprensión sería más directa? |
| Orden breve | `lambda` como `key` | ¿La regla cabe en una expresión clara? |
| Orden complejo | Función con nombre | ¿Necesito probar o documentar el criterio? |
| Imprimir o modificar objetos | Ciclo normal | ¿Estoy produciendo efectos en vez de una colección? |

## Señales para regresar a un ciclo

- La comprensión contiene más de una decisión importante.
- Se modifican objetos existentes.
- Se deben registrar diferentes problemas.
- Se necesita `continue`, varias etapas o mensajes.
- La expresión requiere un comentario para entenderse.

## Preguntas antes de materializar

1. ¿Necesito recorrer los valores más de una vez?
2. ¿Necesito conocer todos los resultados antes de continuar?
3. ¿Necesito acceder por índice?
4. ¿El conjunto de datos cabe razonablemente en memoria?
5. ¿Una función como `sum()`, `any()` o `all()` puede consumir el generador directamente?
