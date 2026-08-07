-- COA - SQL y Bases de Datos Relacionales
-- Modulo 6: base para el mini proyecto de auditoria
-- La base contiene decisiones que deben ser revisadas por el estudiante.

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

DROP VIEW IF EXISTS vista_seguimiento_paquetes;
DROP TABLE IF EXISTS entregas;
DROP TABLE IF EXISTS paquetes;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS rutas;

CREATE TABLE rutas (
    id INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    region TEXT NOT NULL,
    activa INTEGER NOT NULL DEFAULT 1 CHECK (activa IN (0, 1))
);

CREATE TABLE clientes (
    id INTEGER PRIMARY KEY,
    identificacion TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE
);

CREATE TABLE paquetes (
    id INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    cliente_id INTEGER NOT NULL,
    ruta_id INTEGER NOT NULL,
    fecha_registro TEXT NOT NULL,
    peso_kg REAL NOT NULL,
    costo REAL NOT NULL CHECK (costo > 0),
    estado TEXT NOT NULL
        CHECK (estado IN ('Registrado', 'En ruta', 'Entregado', 'Devuelto')),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE entregas (
    id INTEGER PRIMARY KEY,
    paquete_id INTEGER NOT NULL UNIQUE,
    fecha_entrega TEXT NOT NULL,
    recibido_por TEXT NOT NULL,
    observacion TEXT,
    FOREIGN KEY (paquete_id) REFERENCES paquetes(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO rutas (id, codigo, nombre, region, activa) VALUES
    (1, 'R-NOR', 'Ruta Norte', 'Norte', 1),
    (2, 'R-SUR', 'Ruta Sur', 'Sur', 1),
    (3, 'R-CEN', 'Ruta Central', 'Central', 1),
    (4, 'R-OES', 'Ruta Oeste', 'Oeste', 0),
    (5, 'R-EST', 'Ruta Este', 'Este', 1);

INSERT INTO clientes (id, identificacion, nombre, correo) VALUES
    (1, 'CLI-001', 'Almacen Horizonte', 'horizonte@correo.test'),
    (2, 'CLI-002', 'Libreria Central', 'central@correo.test'),
    (3, 'CLI-003', 'Tecnologia Norte', 'norte@correo.test'),
    (4, 'CLI-004', 'Farmacia Buen Dia', 'buendia@correo.test'),
    (5, 'CLI-005', 'Taller Rivera', 'rivera@correo.test'),
    (6, 'CLI-006', 'Cafeteria Sol', 'sol@correo.test'),
    (7, 'CLI-007', 'Oficina Verde', 'verde@correo.test'),
    (8, 'CLI-008', 'Mercado Este', 'este@correo.test');

INSERT INTO paquetes (
    id, codigo, cliente_id, ruta_id, fecha_registro, peso_kg, costo, estado
) VALUES
    (1,  'PAQ-001', 1, 1, '2026-07-01',  2.4, 12.50, 'Entregado'),
    (2,  'PAQ-002', 2, 3, '2026-07-01',  1.1,  8.75, 'Entregado'),
    (3,  'PAQ-003', 3, 1, '2026-07-02',  5.8, 21.00, 'Entregado'),
    (4,  'PAQ-004', 4, 2, '2026-07-02',  0.9,  7.50, 'Entregado'),
    (5,  'PAQ-005', 5, 4, '2026-07-03',  7.2, 26.00, 'Devuelto'),
    (6,  'PAQ-006', 6, 3, '2026-07-03',  3.3, 15.25, 'Entregado'),
    (7,  'PAQ-007', 7, 5, '2026-07-04',  4.6, 18.00, 'Entregado'),
    (8,  'PAQ-008', 8, 5, '2026-07-04',  2.0, 11.00, 'Entregado'),
    (9,  'PAQ-009', 1, 1, '2026-07-05',  8.5, 29.50, 'Entregado'),
    (10, 'PAQ-010', 2, 3, '2026-07-05',  1.7,  9.25, 'Entregado'),
    (11, 'PAQ-011', 3, 1, '2026-07-06',  6.1, 22.00, 'En ruta'),
    (12, 'PAQ-012', 4, 2, '2026-07-06',  2.2, 12.00, 'Entregado'),
    (13, 'PAQ-013', 5, 3, '2026-07-07', 10.4, 35.00, 'Entregado'),
    (14, 'PAQ-014', 6, 3, '2026-07-07',  3.8, 16.50, 'Entregado'),
    (15, 'PAQ-015', 7, 5, '2026-07-08',  1.4,  8.50, 'En ruta'),
    (16, 'PAQ-016', 8, 5, '2026-07-08',  4.0, 17.25, 'Entregado'),
    (17, 'PAQ-017', 1, 1, '2026-07-09',  2.7, 13.25, 'Entregado'),
    (18, 'PAQ-018', 2, 2, '2026-07-09',  5.2, 20.00, 'Devuelto'),
    (19, 'PAQ-019', 3, 1, '2026-07-10',  7.0, 25.00, 'Entregado'),
    (20, 'PAQ-020', 4, 2, '2026-07-10',  1.2,  8.25, 'Entregado'),
    (21, 'PAQ-021', 5, 3, '2026-07-11',  9.3, 31.00, 'En ruta'),
    (22, 'PAQ-022', 6, 3, '2026-07-11',  3.1, 14.75, 'Entregado'),
    (23, 'PAQ-023', 7, 5, '2026-07-12',  4.9, 18.75, 'Registrado'),
    (24, 'PAQ-024', 8, 5, '2026-07-12',  2.5, 12.25, 'Entregado'),
    (25, 'PAQ-025', 1, 1, '2026-07-13', 11.0, 37.00, 'En ruta'),
    (26, 'PAQ-026', 2, 2, '2026-07-13',  1.8,  9.75, 'Registrado'),
    (27, 'PAQ-027', 3, 1, '2026-07-14',  6.6, 23.50, 'Registrado'),
    (28, 'PAQ-028', 4, 2, '2026-07-14',  2.9, 13.75, 'En ruta'),
    (29, 'PAQ-029', 5, 3, '2026-07-15',  8.8, 30.00, 'Registrado'),
    (30, 'PAQ-030', 6, 5, '2026-07-15',  3.5, 15.50, 'En ruta');

INSERT INTO entregas (
    id, paquete_id, fecha_entrega, recibido_por, observacion
) VALUES
    (1,  1,  '2026-07-02', 'Mario Lopez', NULL),
    (2,  2,  '2026-07-02', 'Lucia Arias', NULL),
    (3,  3,  '2026-07-03', 'Diego Mora', 'Entrega en recepcion'),
    (4,  4,  '2026-07-03', 'Ana Rojas', NULL),
    (5,  6,  '2026-07-04', 'Jose Solis', NULL),
    (6,  7,  '2026-07-05', 'Eva Leon', NULL),
    (7,  8,  '2026-07-05', 'Raul Soto', NULL),
    (8,  9,  '2026-07-06', 'Mario Lopez', NULL),
    (9,  10, '2026-07-06', 'Lucia Arias', NULL),
    (10, 12, '2026-07-07', 'Ana Rojas', 'Entrega prioritaria'),
    (11, 13, '2026-07-08', 'Carlos Vega', NULL),
    (12, 14, '2026-07-08', 'Jose Solis', NULL),
    (13, 16, '2026-07-09', 'Raul Soto', NULL),
    (14, 17, '2026-07-10', 'Mario Lopez', NULL),
    (15, 19, '2026-07-11', 'Diego Mora', NULL),
    (16, 20, '2026-07-11', 'Ana Rojas', NULL),
    (17, 22, '2026-07-12', 'Jose Solis', NULL),
    (18, 24, '2026-07-13', 'Raul Soto', NULL);

-- Este indice duplica el indice automatico creado por UNIQUE(codigo).
-- Forma parte de la auditoria y debe ser identificado como innecesario.
CREATE INDEX idx_paquetes_codigo_repetido ON paquetes(codigo);

COMMIT;

SELECT
    (SELECT COUNT(*) FROM rutas) AS rutas,
    (SELECT COUNT(*) FROM clientes) AS clientes,
    (SELECT COUNT(*) FROM paquetes) AS paquetes,
    (SELECT COUNT(*) FROM entregas) AS entregas;

-- ================================================================
-- ESCRIBE LA AUDITORIA DEBAJO DE ESTA LINEA
-- ================================================================
