"""Plantilla opcional para el proyecto del Módulo 1.

La plantilla define responsabilidades, pero no contiene la solución.
"""

import re

from datos_registros import REGISTROS


def normalizar_espacios(texto):
    """Devuelve el texto con espacios internos normalizados."""
    raise NotImplementedError


def normalizar_codigo(codigo):
    """Devuelve el código con las transformaciones permitidas."""
    raise NotImplementedError


def validar_codigo(codigo):
    """Indica si el código normalizado cumple el patrón requerido."""
    raise NotImplementedError


def normalizar_nombre(nombre):
    """Aplica las reglas documentadas para nombres."""
    raise NotImplementedError


def normalizar_correo(correo):
    """Aplica únicamente las transformaciones permitidas al correo."""
    raise NotImplementedError


def validar_correo(correo):
    """Indica si el correo normalizado cumple las reglas del proyecto."""
    raise NotImplementedError


def normalizar_etiquetas(texto_etiquetas):
    """Devuelve una lista sin etiquetas vacías ni duplicadas."""
    raise NotImplementedError


def procesar_registro(texto_original, codigos_utilizados):
    """Normaliza, valida y clasifica un registro."""
    raise NotImplementedError


def ordenar_resultados(resultados):
    """Devuelve una lista nueva ordenada por estado y código."""
    raise NotImplementedError


def mostrar_reporte(resultados):
    """Muestra tabla, resumen y detalle de problemas."""
    raise NotImplementedError


def main():
    codigos_utilizados = set()
    resultados = []

    for texto_original in REGISTROS:
        resultado = procesar_registro(texto_original, codigos_utilizados)
        resultados.append(resultado)

    resultados_ordenados = ordenar_resultados(resultados)
    mostrar_reporte(resultados_ordenados)


if __name__ == "__main__":
    main()
