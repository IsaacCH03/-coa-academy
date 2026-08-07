"""Datos del proyecto del Módulo 2 de Python Práctico."""

CODIGOS = [
    "PRD-001",
    "PRD-002",
    "PRD-003",
    "PRD-004",
    "PRD-005",
    "PRD-006",
    "PRD-007",
    "PRD-008",
]

NOMBRES = [
    "Teclado mecánico",
    "Ratón inalámbrico",
    "Monitor 24 pulgadas",
    "Base para portátil",
    "Auriculares USB",
    "Cámara web",
    "Memoria USB 64 GB",
    "Cable HDMI",
]

PRECIOS = [32000, 14500, 89000, 18500, 27000, 22500, 8500, 6000]
EXISTENCIAS = [8, 3, 2, 0, 5, 4, 20, 12]

CATEGORIAS = [
    "Accesorios",
    "Accesorios",
    "Pantallas",
    "Accesorios",
    "Audio",
    "Video",
    "Almacenamiento",
    "Cables",
]

PEDIDOS = [
    {
        "id": "PED-001",
        "cliente": "Café Horizonte",
        "prioridad": "normal",
        "lineas": [("PRD-001", 1), ("PRD-008", 2)],
    },
    {
        "id": "PED-002",
        "cliente": "Librería Norte",
        "prioridad": "alta",
        "lineas": [("PRD-002", 5), ("PRD-007", 4)],
    },
    {
        "id": "PED-003",
        "cliente": "Estudio Creativo",
        "prioridad": "urgente",
        "lineas": [("PRD-003", 1), ("PRD-005", 2), ("PRD-006", 1)],
    },
    {
        "id": "PED-004",
        "cliente": "Academia Central",
        "prioridad": "normal",
        "lineas": [("PRD-004", 1), ("PRD-008", 3)],
    },
    {
        "id": "PED-005",
        "cliente": "Clínica del Este",
        "prioridad": "urgente",
        "lineas": [("PRD-999", 2), ("PRD-006", 1)],
    },
    {
        "id": "PED-006",
        "cliente": "Taller Rivera",
        "prioridad": "alta",
        "lineas": [("PRD-007", 0), ("PRD-008", 2)],
    },
    {
        "id": "PED-007",
        "cliente": "Hotel Mirador",
        "prioridad": "normal",
        "lineas": [],
    },
    {
        "id": "PED-008",
        "cliente": "Diseño Sur",
        "prioridad": "alta",
        "lineas": [("PRD-001", 2), ("PRD-002", 1), ("PRD-005", 1)],
    },
]
