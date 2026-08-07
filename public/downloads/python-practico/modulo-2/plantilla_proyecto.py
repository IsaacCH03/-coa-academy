"""Plantilla opcional para el analizador de inventario y pedidos."""

from datos_inventario import (
    CATEGORIAS,
    CODIGOS,
    EXISTENCIAS,
    NOMBRES,
    PEDIDOS,
    PRECIOS,
)


ORDEN_ESTADO = {
    "COMPLETO": 0,
    "FALTANTES": 1,
    "INVÁLIDO": 2,
}

ORDEN_PRIORIDAD = {
    "urgente": 0,
    "alta": 1,
    "normal": 2,
}


def columnas_consistentes(*columnas):
    """Indica si todas las columnas tienen la misma longitud."""
    raise NotImplementedError


def codigos_unicos(codigos):
    """Indica si ningún código aparece más de una vez."""
    raise NotImplementedError


def construir_inventario(codigos, nombres, precios, existencias, categorias):
    """Construye un diccionario indexado por código."""
    raise NotImplementedError


def validar_lineas(lineas, inventario):
    """Devuelve los problemas estructurales de las líneas."""
    raise NotImplementedError


def calcular_total(lineas, inventario):
    """Calcula el valor solicitado para líneas calculables."""
    raise NotImplementedError


def buscar_faltantes(lineas, inventario):
    """Devuelve productos cuya cantidad supera la existencia."""
    raise NotImplementedError


def analizar_pedido(pedido, inventario):
    """Devuelve un resultado nuevo sin modificar el pedido."""
    raise NotImplementedError


def clave_orden_pedido(resultado):
    """Devuelve la clave compuesta de ordenamiento."""
    raise NotImplementedError


def crear_resumen(resultados):
    """Calcula totales, extremos y comprobaciones globales."""
    raise NotImplementedError


def mostrar_reporte(resultados, resumen):
    """Muestra la tabla y el resumen del análisis."""
    raise NotImplementedError


def main():
    if not columnas_consistentes(CODIGOS, NOMBRES, PRECIOS, EXISTENCIAS, CATEGORIAS):
        print("No se puede construir el inventario: las columnas no coinciden")
        return

    if not codigos_unicos(CODIGOS):
        print("No se puede construir el inventario: hay códigos duplicados")
        return

    inventario = construir_inventario(
        CODIGOS,
        NOMBRES,
        PRECIOS,
        EXISTENCIAS,
        CATEGORIAS,
    )
    resultados = [analizar_pedido(pedido, inventario) for pedido in PEDIDOS]
    resultados_ordenados = sorted(resultados, key=clave_orden_pedido)
    resumen = crear_resumen(resultados_ordenados)
    mostrar_reporte(resultados_ordenados, resumen)


if __name__ == "__main__":
    main()
