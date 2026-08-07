# Guía de colecciones especializadas e itertools

## Mapa de decisión

| Necesidad | Herramienta | Advertencia principal |
|---|---|---|
| Contar frecuencias | `Counter` | Normaliza antes de contar. |
| Mostrar los más frecuentes | `most_common()` | Revisa empates si importan. |
| Agrupar en listas | `defaultdict(list)` | Leer con corchetes crea la clave. |
| Acumular números | `defaultdict(int)` | Define qué significa el valor inicial. |
| Eliminar repetidos por grupo | `defaultdict(set)` | Un conjunto no preserva orden de presentación. |
| Cola FIFO | `deque` | Utiliza `append()` y `popleft()`. |
| Historial limitado | `deque(maxlen=n)` | Los elementos antiguos se pierden. |
| Recorrer fuentes seguidas | `chain()` | El iterador se consume. |
| Vista parcial | `islice()` | Avanza el iterador recibido. |
| Parejas únicas | `combinations()` | El orden no crea otra pareja. |
| Órdenes posibles | `permutations()` | La cantidad crece factorialmente. |
| Un elemento de cada grupo | `product()` | La cantidad multiplica los tamaños. |
| Agrupar consecutivos | `groupby()` | Ordena antes por la misma clave. |

## Reglas rápidas

1. No utilices una estructura especializada si no simplifica la operación principal.
2. No dependas de un contador para conservar orden de llegada.
3. No utilices `appendleft()` repetidamente si debes mantener FIFO entre prioridades iguales.
4. Materializa un iterador solo cuando necesites reutilizar, ordenar o acceder por posición.
5. Calcula cuántos resultados puede producir una combinación antes de crear una lista.
6. Materializa cada grupo de `groupby()` una sola vez dentro de su iteración.
