-- COA - SQL y Bases de Datos Relacionales
-- Modulo 5: conjunto de datos para el proyecto "Reportes academicos"
-- Ejecuta el archivo completo en una base vacia.
-- Conserva la carga original y escribe tus consultas al final.

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

DROP TABLE IF EXISTS calificaciones;
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS docentes;
DROP TABLE IF EXISTS carreras;

CREATE TABLE carreras (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    sede TEXT NOT NULL
);

CREATE TABLE estudiantes (
    id INTEGER PRIMARY KEY,
    carnet TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    ciudad TEXT,
    estado TEXT NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
    carrera_id INTEGER NOT NULL,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE docentes (
    id INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    especialidad TEXT NOT NULL,
    supervisor_id INTEGER,
    FOREIGN KEY (supervisor_id) REFERENCES docentes(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE cursos (
    id INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos BETWEEN 1 AND 6),
    docente_id INTEGER,
    FOREIGN KEY (docente_id) REFERENCES docentes(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE matriculas (
    id INTEGER PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    periodo TEXT NOT NULL,
    estado TEXT NOT NULL
        CHECK (estado IN ('Activa', 'Finalizada', 'Retirada')),
    fecha_matricula TEXT NOT NULL,
    UNIQUE (estudiante_id, curso_id, periodo),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE calificaciones (
    id INTEGER PRIMARY KEY,
    matricula_id INTEGER NOT NULL UNIQUE,
    nota REAL NOT NULL CHECK (nota BETWEEN 0 AND 100),
    observacion TEXT,
    FOREIGN KEY (matricula_id) REFERENCES matriculas(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO carreras (id, nombre, sede) VALUES
    (1, 'Desarrollo de Software', 'Central'),
    (2, 'Redes y Sistemas', 'Norte'),
    (3, 'Analisis de Datos', 'Central'),
    (4, 'Gestion de Tecnologia', 'Oeste'),
    (5, 'Ciberseguridad', 'Norte'),
    (6, 'Diseno Digital', 'Oeste');

INSERT INTO docentes (
    id, codigo, nombre, correo, especialidad, supervisor_id
) VALUES
    (1, 'DOC-001', 'Laura Campos',  'laura@coa.edu',  'Ingenieria de software', NULL),
    (2, 'DOC-002', 'Miguel Rojas',  'miguel@coa.edu', 'Bases de datos',        1),
    (3, 'DOC-003', 'Sofia Vargas',   'sofia@coa.edu',  'Diseno de experiencia', 1),
    (4, 'DOC-004', 'Andres Mora',    'andres@coa.edu', 'Redes',                2),
    (5, 'DOC-005', 'Valeria Solis',  'valeria@coa.edu','Analitica',            1),
    (6, 'DOC-006', 'Carlos Mendez',  'carlos@coa.edu', 'Seguridad',            2),
    (7, 'DOC-007', 'Elena Castro',   'elena@coa.edu',  'Gestion de proyectos', 1),
    (8, 'DOC-008', 'Tomas Jimenez',  'tomas@coa.edu',  'Computacion en nube',  1);

INSERT INTO cursos (id, codigo, nombre, creditos, docente_id) VALUES
    (1,  'BD-201',  'Bases de Datos Relacionales', 4, 2),
    (2,  'PR-202',  'Programacion II',             4, 1),
    (3,  'RED-110', 'Redes I',                     3, 4),
    (4,  'DAT-120', 'Estadistica Aplicada',        4, 5),
    (5,  'DIS-101', 'Fundamentos de UX',           3, 3),
    (6,  'SEG-200', 'Principios de Seguridad',     4, 6),
    (7,  'SOF-250', 'Ingenieria de Software',      4, 1),
    (8,  'DAT-220', 'Visualizacion de Datos',      3, 5),
    (9,  'GES-210', 'Gestion de Proyectos TI',     3, 7),
    (10, 'NUB-130', 'Fundamentos de Nube',         3, NULL),
    (11, 'AUT-140', 'Automatizacion Basica',       3, 8);

INSERT INTO estudiantes (
    id, carnet, nombre, correo, ciudad, estado, carrera_id
) VALUES
    (1,  'EST-001', 'Ana Solis',       'ana@est.coa.edu',      'San Jose', 'Activo',   1),
    (2,  'EST-002', 'Bruno Mora',      'bruno@est.coa.edu',    'Heredia',  'Activo',   1),
    (3,  'EST-003', 'Carla Rojas',     'carla@est.coa.edu',    'Cartago',  'Activo',   3),
    (4,  'EST-004', 'Diego Vega',      'diego@est.coa.edu',    NULL,       'Activo',   2),
    (5,  'EST-005', 'Elena Castro',    'elena5@est.coa.edu',   'Alajuela', 'Activo',   4),
    (6,  'EST-006', 'Fabian Ruiz',     'fabian@est.coa.edu',   'San Jose', 'Activo',   5),
    (7,  'EST-007', 'Gabriela Leon',   'gabriela@est.coa.edu', 'Heredia',  'Activo',   1),
    (8,  'EST-008', 'Hugo Araya',      'hugo@est.coa.edu',     'Cartago',  'Inactivo', 2),
    (9,  'EST-009', 'Isabel Soto',     'isabel@est.coa.edu',   'Alajuela', 'Activo',   3),
    (10, 'EST-010', 'Javier Campos',   'javier@est.coa.edu',   'San Jose', 'Activo',   5),
    (11, 'EST-011', 'Karla Jimenez',   'karla@est.coa.edu',    NULL,       'Activo',   4),
    (12, 'EST-012', 'Luis Mendez',     'luis@est.coa.edu',     'Heredia',  'Activo',   1),
    (13, 'EST-013', 'Monica Porras',   'monica@est.coa.edu',   'Cartago',  'Activo',   3),
    (14, 'EST-014', 'Nicolas Vargas',  'nicolas@est.coa.edu',  'Alajuela', 'Activo',   2),
    (15, 'EST-015', 'Olga Ramirez',    'olga@est.coa.edu',     'San Jose', 'Activo',   5),
    (16, 'EST-016', 'Pablo Quesada',   'pablo@est.coa.edu',    'Heredia',  'Activo',   4);

INSERT INTO matriculas (
    id, estudiante_id, curso_id, periodo, estado, fecha_matricula
) VALUES
    (1,  1,  1, '2025-II', 'Finalizada', '2025-08-04'),
    (2,  1,  7, '2026-I',  'Activa',     '2026-01-12'),
    (3,  2,  1, '2026-I',  'Activa',     '2026-01-11'),
    (4,  2,  2, '2026-I',  'Activa',     '2026-01-11'),
    (5,  3,  4, '2025-II', 'Finalizada', '2025-08-05'),
    (6,  3,  8, '2026-I',  'Activa',     '2026-01-13'),
    (7,  4,  3, '2026-I',  'Activa',     '2026-01-10'),
    (8,  4,  6, '2026-I',  'Retirada',   '2026-01-10'),
    (9,  5,  9, '2026-I',  'Activa',     '2026-01-14'),
    (10, 6,  6, '2025-II', 'Finalizada', '2025-08-04'),
    (11, 6,  1, '2026-I',  'Activa',     '2026-01-12'),
    (12, 7,  2, '2025-II', 'Finalizada', '2025-08-06'),
    (13, 7,  7, '2026-I',  'Activa',     '2026-01-12'),
    (14, 8,  3, '2025-II', 'Finalizada', '2025-08-07'),
    (15, 9,  4, '2026-I',  'Activa',     '2026-01-13'),
    (16, 9,  8, '2026-I',  'Activa',     '2026-01-13'),
    (17, 10, 6, '2026-I',  'Activa',     '2026-01-10'),
    (18, 10, 1, '2026-I',  'Activa',     '2026-01-10'),
    (19, 11, 9, '2026-I',  'Activa',     '2026-01-14'),
    (20, 12, 2, '2026-I',  'Activa',     '2026-01-11'),
    (21, 12, 7, '2026-I',  'Activa',     '2026-01-11'),
    (22, 13, 4, '2025-II', 'Finalizada', '2025-08-05'),
    (23, 13, 8, '2026-I',  'Activa',     '2026-01-13'),
    (24, 14, 3, '2026-I',  'Activa',     '2026-01-10'),
    (25, 14, 11,'2026-I',  'Activa',     '2026-01-15'),
    (26, 15, 6, '2026-I',  'Activa',     '2026-01-12'),
    (27, 15, 1, '2026-I',  'Retirada',   '2026-01-12');

INSERT INTO calificaciones (id, matricula_id, nota, observacion) VALUES
    (1,  1,  88, NULL),
    (2,  2,  91, 'Avance sobresaliente'),
    (3,  3,  76, NULL),
    (4,  4,  84, NULL),
    (5,  5,  93, 'Proyecto destacado'),
    (6,  6,  89, NULL),
    (7,  7,  72, NULL),
    (8,  9,  81, NULL),
    (9,  10, 95, 'Excelente'),
    (10, 11, 86, NULL),
    (11, 12, 78, NULL),
    (12, 13, 90, NULL),
    (13, 14, 67, 'Debe reforzar'),
    (14, 15, 92, NULL),
    (15, 16, 85, NULL),
    (16, 17, 87, NULL),
    (17, 18, 82, NULL),
    (18, 19, 79, NULL),
    (19, 20, 88, NULL),
    (20, 21, 94, 'Excelente'),
    (21, 22, 90, NULL),
    (22, 23, 96, 'Proyecto destacado'),
    (23, 24, 74, NULL),
    (24, 25, 83, NULL),
    (25, 26, 91, NULL);

COMMIT;

-- Comprobacion de carga. Debe devolver una fila con:
-- 6 carreras, 16 estudiantes, 8 docentes, 11 cursos,
-- 27 matriculas y 25 calificaciones.
SELECT
    (SELECT COUNT(*) FROM carreras) AS carreras,
    (SELECT COUNT(*) FROM estudiantes) AS estudiantes,
    (SELECT COUNT(*) FROM docentes) AS docentes,
    (SELECT COUNT(*) FROM cursos) AS cursos,
    (SELECT COUNT(*) FROM matriculas) AS matriculas,
    (SELECT COUNT(*) FROM calificaciones) AS calificaciones;

-- ================================================================
-- ESCRIBE LAS CONSULTAS DEL PROYECTO DEBAJO DE ESTA LINEA
-- Incluye antes de cada consulta la pregunta que responde.
-- ================================================================
