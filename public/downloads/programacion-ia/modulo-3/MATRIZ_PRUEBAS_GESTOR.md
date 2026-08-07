# Matriz de pruebas — Gestor de solicitudes de soporte

**Lenguaje y versión:**  
**Fecha:**  
**Versión del proyecto:**  

| ID | Área | Preparación | Entrada o acción | Resultado esperado | Resultado real | Estado | Evidencia |
|---|---|---|---|---|---|---|---|
| GS-01 | Prioridad |  | Impacto alto, urgencia alta | Crítica |  |  |  |
| GS-02 | Prioridad |  | Impacto alto, urgencia baja | Alta |  |  |  |
| GS-03 | Prioridad |  | Impacto bajo, urgencia alta | Alta |  |  |  |
| GS-04 | Prioridad |  | Impacto bajo, urgencia baja | Baja |  |  |  |
| GS-05 | Prioridad |  | Impacto medio, urgencia media | Media |  |  |  |
| GS-06 | Validación |  | Asunto de 4 caracteres | Rechazado |  |  |  |
| GS-07 | Validación |  | Descripción de 9 caracteres | Rechazado |  |  |  |
| GS-08 | Validación |  | Impacto desconocido | Rechazado |  |  |  |
| GS-09 | Estado | Abierta | Cambiar a en_progreso | Aceptado |  |  |  |
| GS-10 | Estado | Abierta | Cambiar a resuelta | Rechazado sin cambio |  |  |  |
| GS-11 | Estado | En progreso | Resolver y cerrar | Aceptado |  |  |  |
| GS-12 | Estado | Resuelta | Reabrir a en_progreso | Aceptado |  |  |  |
| GS-13 | Estado | Cerrada | Cambiar a en_progreso | Rechazado |  |  |  |
| GS-14 | Estado | Cancelada | Cambiar a abierta | Rechazado |  |  |  |
| GS-15 | Estado | Colección conocida | ID inexistente | Error controlado |  |  |  |
| GS-16 | Consulta | Varias solicitudes | Filtrar prioridad alta | Coincidencias exactas |  |  |  |
| GS-17 | Búsqueda | Texto mixto | Buscar con otra capitalización | Coincidencia |  |  |  |
| GS-18 | Resumen | Colección conocida | Generar resumen | Conteos exactos |  |  |  |
| GS-19 | Persistencia | Datos ficticios | Guardar y cargar | Datos equivalentes |  |  |  |
| GS-20 | Persistencia | Archivo inexistente | Cargar | Colección vacía |  |  |  |
| GS-21 | Persistencia | Archivo dañado | Cargar | Error; no sobrescribe |  |  |  |

