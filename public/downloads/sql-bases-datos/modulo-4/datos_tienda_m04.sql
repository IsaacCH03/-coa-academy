-- COA - SQL y Bases de Datos Relacionales
-- Modulo 4: conjunto de datos para el proyecto "Analisis de operaciones de una tienda"
-- Conserva este bloque sin cambios y escribe tus consultas al final del archivo.

DROP TABLE IF EXISTS operaciones_tienda;

CREATE TABLE operaciones_tienda (
    id INTEGER PRIMARY KEY,
    fecha TEXT NOT NULL,
    codigo_producto TEXT NOT NULL,
    producto TEXT NOT NULL,
    categoria TEXT NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL NOT NULL CHECK (precio_unitario > 0),
    descuento_porcentaje REAL NOT NULL DEFAULT 0
        CHECK (descuento_porcentaje BETWEEN 0 AND 100),
    ciudad TEXT,
    metodo_pago TEXT NOT NULL
        CHECK (metodo_pago IN ('Efectivo', 'Tarjeta', 'Transferencia')),
    estado TEXT NOT NULL
        CHECK (estado IN ('Confirmada', 'Pendiente', 'Cancelada')),
    canal TEXT NOT NULL
        CHECK (canal IN ('Tienda', 'Web', 'Telefono'))
);

INSERT INTO operaciones_tienda (
    id, fecha, codigo_producto, producto, categoria, cantidad,
    precio_unitario, descuento_porcentaje, ciudad, metodo_pago,
    estado, canal
) VALUES
    (1,  '2026-01-03', 'PAP-001', 'Cuaderno profesional',       'Papeleria',  3,  4.50,  0, 'San Jose', 'Efectivo',       'Confirmada', 'Tienda'),
    (2,  '2026-01-04', 'TEC-001', 'Memoria USB 32 GB',          'Tecnologia', 2,  9.90,  5, 'Heredia',  'Tarjeta',        'Confirmada', 'Web'),
    (3,  '2026-01-06', 'ACC-001', 'Soporte para telefono',      'Accesorios', 1,  7.25,  0, 'Alajuela', 'Transferencia',  'Pendiente',  'Telefono'),
    (4,  '2026-01-08', 'HOG-001', 'Botella termica',            'Hogar',      2, 18.90, 10, 'Cartago',  'Tarjeta',        'Confirmada', 'Tienda'),
    (5,  '2026-01-11', 'PAP-002', 'Marcador permanente',        'Papeleria',  6,  1.80,  0, 'San Jose', 'Efectivo',       'Confirmada', 'Tienda'),
    (6,  '2026-01-12', 'TEC-002', 'Raton inalambrico',          'Tecnologia', 1, 16.50,  0, NULL,       'Tarjeta',        'Cancelada',  'Web'),
    (7,  '2026-01-15', 'ACC-002', 'Cable USB-C',                'Accesorios', 4,  6.75,  5, 'Heredia',  'Transferencia',  'Confirmada', 'Web'),
    (8,  '2026-01-18', 'HOG-002', 'Organizador de escritorio',  'Hogar',      1, 12.40,  0, 'Alajuela', 'Efectivo',       'Confirmada', 'Tienda'),
    (9,  '2026-01-21', 'TEC-003', 'Teclado compacto',           'Tecnologia', 1, 28.00, 15, 'San Jose', 'Tarjeta',        'Confirmada', 'Web'),
    (10, '2026-01-25', 'PAP-001', 'Cuaderno profesional',       'Papeleria',  5,  4.50, 10, 'Cartago',  'Transferencia',  'Pendiente',  'Telefono'),
    (11, '2026-01-27', 'ACC-003', 'Base para computadora',      'Accesorios', 1, 22.75,  0, 'Heredia',  'Tarjeta',        'Confirmada', 'Tienda'),
    (12, '2026-01-30', 'HOG-001', 'Botella termica',            'Hogar',      3, 18.90, 20, NULL,       'Transferencia',  'Confirmada', 'Web'),

    (13, '2026-02-02', 'PAP-003', 'Agenda semanal',             'Papeleria',  2,  8.60,  0, 'Alajuela', 'Efectivo',       'Confirmada', 'Tienda'),
    (14, '2026-02-05', 'TEC-001', 'Memoria USB 32 GB',          'Tecnologia', 5,  9.90, 10, 'San Jose', 'Tarjeta',        'Confirmada', 'Web'),
    (15, '2026-02-07', 'ACC-001', 'Soporte para telefono',      'Accesorios', 3,  7.25,  0, 'Heredia',  'Efectivo',       'Cancelada',  'Tienda'),
    (16, '2026-02-10', 'HOG-002', 'Organizador de escritorio',  'Hogar',      2, 12.40,  5, 'Cartago',  'Transferencia',  'Confirmada', 'Telefono'),
    (17, '2026-02-12', 'PAP-002', 'Marcador permanente',        'Papeleria', 10,  1.80,  0, 'San Jose', 'Efectivo',       'Confirmada', 'Tienda'),
    (18, '2026-02-14', 'TEC-002', 'Raton inalambrico',          'Tecnologia', 2, 16.50, 15, 'Alajuela', 'Tarjeta',        'Confirmada', 'Web'),
    (19, '2026-02-17', 'ACC-002', 'Cable USB-C',                'Accesorios', 2,  6.75,  0, NULL,       'Transferencia',  'Pendiente',  'Web'),
    (20, '2026-02-19', 'HOG-003', 'Lampara de escritorio',      'Hogar',      1, 24.90, 10, 'Heredia',  'Tarjeta',        'Confirmada', 'Tienda'),
    (21, '2026-02-22', 'TEC-003', 'Teclado compacto',           'Tecnologia', 2, 28.00,  5, 'Cartago',  'Transferencia',  'Confirmada', 'Telefono'),
    (22, '2026-02-24', 'PAP-003', 'Agenda semanal',             'Papeleria',  4,  8.60, 10, 'San Jose', 'Tarjeta',        'Confirmada', 'Web'),
    (23, '2026-02-26', 'ACC-003', 'Base para computadora',      'Accesorios', 2, 22.75, 20, 'Alajuela', 'Efectivo',       'Confirmada', 'Tienda'),
    (24, '2026-02-28', 'HOG-001', 'Botella termica',            'Hogar',      1, 18.90,  0, 'Heredia',  'Transferencia',  'Cancelada',  'Web'),

    (25, '2026-03-03', 'PAP-001', 'Cuaderno profesional',       'Papeleria',  8,  4.50,  5, 'Cartago',  'Efectivo',       'Confirmada', 'Tienda'),
    (26, '2026-03-05', 'TEC-001', 'Memoria USB 32 GB',          'Tecnologia', 3,  9.90,  0, 'San Jose', 'Tarjeta',        'Pendiente',  'Web'),
    (27, '2026-03-08', 'ACC-001', 'Soporte para telefono',      'Accesorios', 5,  7.25, 10, 'Heredia',  'Transferencia',  'Confirmada', 'Telefono'),
    (28, '2026-03-10', 'HOG-002', 'Organizador de escritorio',  'Hogar',      3, 12.40,  0, 'Alajuela', 'Tarjeta',        'Confirmada', 'Tienda'),
    (29, '2026-03-13', 'PAP-002', 'Marcador permanente',        'Papeleria', 12,  1.80, 15, NULL,       'Efectivo',       'Confirmada', 'Tienda'),
    (30, '2026-03-15', 'TEC-002', 'Raton inalambrico',          'Tecnologia', 2, 16.50,  5, 'San Jose', 'Transferencia',  'Confirmada', 'Web'),
    (31, '2026-03-18', 'ACC-002', 'Cable USB-C',                'Accesorios', 6,  6.75, 10, 'Cartago',  'Tarjeta',        'Confirmada', 'Web'),
    (32, '2026-03-20', 'HOG-003', 'Lampara de escritorio',      'Hogar',      2, 24.90,  0, 'Heredia',  'Efectivo',       'Pendiente',  'Telefono'),
    (33, '2026-03-22', 'TEC-003', 'Teclado compacto',           'Tecnologia', 1, 28.00, 20, 'Alajuela', 'Tarjeta',        'Confirmada', 'Tienda'),
    (34, '2026-03-25', 'PAP-003', 'Agenda semanal',             'Papeleria',  3,  8.60,  0, 'San Jose', 'Transferencia',  'Confirmada', 'Web'),
    (35, '2026-03-27', 'ACC-003', 'Base para computadora',      'Accesorios', 1, 22.75,  5, 'Cartago',  'Tarjeta',        'Cancelada',  'Tienda'),
    (36, '2026-03-30', 'HOG-001', 'Botella termica',            'Hogar',      4, 18.90, 15, 'Heredia',  'Transferencia',  'Confirmada', 'Web'),

    (37, '2026-04-02', 'PAP-001', 'Cuaderno profesional',       'Papeleria',  4,  4.50,  0, 'Alajuela', 'Efectivo',       'Confirmada', 'Tienda'),
    (38, '2026-04-04', 'TEC-001', 'Memoria USB 32 GB',          'Tecnologia', 4,  9.90, 10, 'San Jose', 'Tarjeta',        'Confirmada', 'Web'),
    (39, '2026-04-07', 'ACC-001', 'Soporte para telefono',      'Accesorios', 2,  7.25,  5, NULL,       'Transferencia',  'Confirmada', 'Telefono'),
    (40, '2026-04-09', 'HOG-002', 'Organizador de escritorio',  'Hogar',      2, 12.40, 20, 'Cartago',  'Tarjeta',        'Confirmada', 'Tienda'),
    (41, '2026-04-12', 'PAP-002', 'Marcador permanente',        'Papeleria',  9,  1.80,  0, 'Heredia',  'Efectivo',       'Pendiente',  'Tienda'),
    (42, '2026-04-15', 'TEC-002', 'Raton inalambrico',          'Tecnologia', 3, 16.50, 10, 'Alajuela', 'Transferencia',  'Confirmada', 'Web'),
    (43, '2026-04-18', 'ACC-002', 'Cable USB-C',                'Accesorios', 5,  6.75,  0, 'San Jose', 'Tarjeta',        'Confirmada', 'Web'),
    (44, '2026-04-20', 'HOG-003', 'Lampara de escritorio',      'Hogar',      1, 24.90,  5, 'Cartago',  'Efectivo',       'Confirmada', 'Telefono'),
    (45, '2026-04-23', 'TEC-003', 'Teclado compacto',           'Tecnologia', 2, 28.00, 10, 'Heredia',  'Tarjeta',        'Confirmada', 'Tienda'),
    (46, '2026-04-25', 'PAP-003', 'Agenda semanal',             'Papeleria',  5,  8.60, 15, 'Alajuela', 'Transferencia',  'Cancelada',  'Web'),
    (47, '2026-04-27', 'ACC-003', 'Base para computadora',      'Accesorios', 2, 22.75,  0, 'San Jose', 'Tarjeta',        'Confirmada', 'Tienda'),
    (48, '2026-04-30', 'HOG-001', 'Botella termica',            'Hogar',      2, 18.90, 10, 'Cartago',  'Transferencia',  'Confirmada', 'Web');

-- Comprobacion de carga: debe devolver 48.
SELECT COUNT(*) AS registros_cargados
FROM operaciones_tienda;

-- ================================================================
-- ESCRIBE LAS CONSULTAS DEL PROYECTO DEBAJO DE ESTA LINEA
-- Incluye antes de cada consulta la pregunta que responde.
-- ================================================================
