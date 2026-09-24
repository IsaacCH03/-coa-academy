# COA — Cursos Online Avanzados

## SQL y Bases de Datos Relacionales

# Módulo 2. Diseño de bases de datos, relaciones e integridad

**Duración estimada:** 4 horas  
**Nivel:** inicial a intermedio  
**Modalidad:** autodidacta y práctica  
**Motor de base de datos:** SQLite  
**Herramienta principal:** DB Browser for SQLite  
**Resultado principal:** una base de datos relacional para administrar pacientes, médicos, especialidades, consultorios y citas de una clínica

---

## Bienvenida

En el módulo anterior aprendiste a crear una tabla, insertar registros y consultar sus columnas. Esa primera tabla permitió organizar información, pero los sistemas reales rara vez pueden representarse correctamente con una sola tabla.

Una clínica necesita pacientes, médicos, especialidades, consultorios y citas. Si toda esa información se guarda en una tabla enorme, los nombres y teléfonos se repetirán, aparecerán contradicciones y cada corrección será más difícil.

En este módulo aprenderás a pensar antes de crear las tablas. Analizarás necesidades, identificarás entidades, definirás relaciones y establecerás reglas que la propia base de datos deberá proteger.

> **Principio del módulo:** una buena base de datos no depende de que todas las personas recuerden las reglas. La estructura debe impedir que los datos lleguen a estados inválidos.

---

## Objetivos de aprendizaje

Al completar el módulo serás capaz de:

- Convertir una situación real en requisitos de información.
- Distinguir entidades, atributos y reglas de negocio.
- Elegir claves primarias adecuadas.
- Diferenciar claves naturales, sustitutas, simples y compuestas.
- Crear claves foráneas que protejan relaciones entre tablas.
- Identificar relaciones uno a uno, uno a muchos y muchos a muchos.
- Representar cardinalidad y opcionalidad en un diagrama entidad-relación.
- Resolver relaciones muchos a muchos mediante tablas intermedias.
- Aplicar `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK` y `DEFAULT`.
- Activar y comprobar la integridad referencial de SQLite.
- Elegir conscientemente entre `RESTRICT`, `CASCADE` y `SET NULL`.
- Detectar redundancia y anomalías en diseños deficientes.
- Aplicar primera, segunda y tercera forma normal en casos prácticos.
- Realizar cambios básicos del esquema mediante `ALTER TABLE`.
- Eliminar tablas de práctica mediante un orden seguro.
- Documentar un modelo mediante diagrama, modelo relacional y diccionario de datos.
- Reconocer diferencias importantes entre SQLite y otros motores.

---

## Producto que construirás

El proyecto principal será la base de datos de una clínica:

```text
clinica.db
├── especialidades
├── medicos
├── medico_especialidad
├── pacientes
├── consultorios
└── citas
```

Las tablas estarán conectadas mediante claves:

```text
especialidades ──< medico_especialidad >── medicos
                                                │
pacientes ───────────────────────────────< citas >── consultorios
```

El proyecto no incluirá una aplicación ni una interfaz gráfica. El objetivo es construir una estructura relacional correcta, comprobar sus reglas y documentar las decisiones.

---

## Ruta de trabajo y distribución del tiempo

| Actividad | Tiempo aproximado |
|---|---:|
| Explicaciones y demostraciones | 50 minutos |
| Prácticas guiadas | 45 minutos |
| Ejercicios individuales, diseño y depuración | 35 minutos |
| Mini proyecto: estructura organizacional de una empresa | 25 minutos |
| Proyecto del módulo: sistema de gestión para una clínica | 70 minutos |
| Evaluación, revisión y preparación de la entrega | 15 minutos |
| **Total** | **4 horas** |

Los tiempos son orientativos. El diseño puede necesitar varias revisiones. Corregir un diagrama antes de construir las tablas forma parte del trabajo profesional.

---

# 1. Del problema real al modelo de datos

## 1.1 No comiences creando tablas

Lee esta solicitud:

> “Necesitamos una base de datos para una clínica.”

Todavía no existe información suficiente para diseñarla. Antes de escribir SQL debes descubrir:

- Qué actividades realizará la clínica.
- Qué información necesita conservar.
- Qué reglas no se pueden incumplir.
- Qué situaciones pueden ocurrir más de una vez.
- Qué datos son obligatorios y cuáles son opcionales.

Crear tablas sin comprender el problema produce estructuras difíciles de corregir.

## 1.2 Tres niveles de diseño

El proceso puede dividirse en tres niveles:

```text
REALIDAD Y REQUISITOS
        │
        ▼
MODELO CONCEPTUAL
Entidades, atributos y relaciones
        │
        ▼
MODELO LÓGICO
Tablas, claves y cardinalidades
        │
        ▼
MODELO FÍSICO
CREATE TABLE y reglas del motor
```

### Modelo conceptual

Describe qué existe en el problema, sin preocuparse todavía por una sintaxis concreta.

### Modelo lógico

Convierte los conceptos en tablas, columnas, claves y relaciones.

### Modelo físico

Implementa el diseño en SQLite mediante tipos, restricciones e instrucciones SQL.

Separar estos niveles evita que una decisión técnica oculte un requisito del negocio.

## 1.3 Entidades

Una **entidad** es algo relevante sobre lo que se necesita conservar información.

En una clínica podrían existir:

- Paciente.
- Médico.
- Especialidad.
- Consultorio.
- Cita.

Una entidad suele convertirse en una tabla.

Una palabra no es automáticamente una entidad. Debe tener importancia propia para el sistema y normalmente varias ocurrencias.

## 1.4 Atributos

Un **atributo** describe una propiedad de una entidad.

```text
Entidad: paciente
├── nombre
├── documento
├── fecha_nacimiento
├── telefono
└── correo
```

Los atributos suelen convertirse en columnas.

### Pregunta útil

> ¿Este elemento tiene propiedades propias y varias ocurrencias, o solamente describe otra cosa?

Ejemplo:

- `paciente` es una entidad.
- `telefono` normalmente es un atributo del paciente.
- `cita` es una entidad porque posee fecha, estado, motivo y relaciones propias.

## 1.5 Reglas de negocio

Una **regla de negocio** describe una condición que debe cumplirse dentro del sistema.

Ejemplos:

- Cada médico posee un número de licencia irrepetible.
- Una cita pertenece a un paciente.
- Una cita es atendida por un médico.
- Un médico puede tener varias especialidades.
- Una especialidad puede corresponder a varios médicos.
- El estado de una cita solo puede ser programada, confirmada, atendida o cancelada.
- Dos médicos diferentes pueden utilizar el mismo consultorio, pero no a la misma hora.

Estas reglas guían el diseño. Algunas se protegerán con restricciones de la base y otras requerirán lógica de aplicación en cursos posteriores.

## 1.6 Hechos, suposiciones y preguntas

No conviertas una suposición en una regla sin reconocerla.

| Tipo | Ejemplo |
|---|---|
| Hecho proporcionado | Cada médico posee un número de licencia |
| Suposición | Todo paciente tiene correo electrónico |
| Pregunta pendiente | ¿Un médico puede tener varias especialidades? |

Cuando falta información, registra la pregunta. En un proyecto real se consultaría con la persona responsable del proceso.

### Práctica guiada 1 — Analizar un centro deportivo

Lee el caso:

> Un centro deportivo ofrece clases. Cada clase pertenece a una disciplina y es impartida por un instructor. Los socios pueden inscribirse en varias clases. Cada clase admite muchos socios. El correo de cada socio debe ser único.

### Paso 1. Identifica entidades

- Socio.
- Clase.
- Disciplina.
- Instructor.
- Inscripción.

### Paso 2. Identifica atributos iniciales

```text
socio: nombre, correo, telefono
clase: nombre, horario, capacidad
disciplina: nombre
instructor: nombre, correo
inscripcion: fecha_inscripcion
```

### Paso 3. Escribe reglas

- Una disciplina puede tener muchas clases.
- Cada clase pertenece a una disciplina.
- Un instructor puede impartir varias clases.
- Cada clase posee un instructor.
- Un socio puede inscribirse en varias clases.
- Una clase puede recibir varios socios.
- Un socio no debe inscribirse dos veces en la misma clase.

Observa que `inscripcion` aparece porque la relación entre socios y clases necesita conservar información propia y evitar duplicados.

---

# 2. Claves: identidad y referencia

## 2.1 Por qué cada registro necesita identidad

Una clínica puede tener dos pacientes llamados Laura Gómez. El nombre no basta para distinguirlos.

```text
Laura Gómez, documento P-104
Laura Gómez, documento P-281
```

Una **clave** permite identificar o relacionar registros sin depender de descripciones ambiguas.

## 2.2 Clave candidata

Una clave candidata es un atributo, o conjunto de atributos, capaz de identificar de manera única cada registro.

En una tabla de pacientes podrían considerarse:

- Documento de identidad.
- Número interno de expediente.

Ambos podrían ser únicos, pero se debe elegir cuál será la clave principal.

## 2.3 Clave natural

Una clave natural ya existe en el dominio del problema.

Ejemplos:

- Número de licencia médica.
- ISBN de una edición de un libro.
- Código oficial de un país.

Ventaja: posee significado fuera de la base.

Riesgos:

- Puede cambiar.
- Puede ser larga.
- Puede contener errores de captura.
- Su formato puede depender de una institución externa.

## 2.4 Clave sustituta

Una clave sustituta se crea únicamente para identificar registros dentro del sistema.

```sql
id INTEGER PRIMARY KEY
```

No describe al paciente ni al médico. Su función es proporcionar una identidad estable y sencilla.

En este curso se utilizará normalmente una clave sustituta `id`, mientras que las claves naturales importantes se protegerán con `UNIQUE`.

Ejemplo:

```sql
CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY,
    documento TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL
);
```

`id` identifica internamente. `documento` conserva su valor real y no permite duplicados.

## 2.5 Clave primaria

La **clave primaria** identifica de manera única cada fila.

Propiedades prácticas:

- No debe repetirse.
- No debe estar ausente.
- Debe permanecer estable.
- Cada tabla posee una clave primaria, que puede estar formada por una o varias columnas.

Ejemplo simple:

```sql
id INTEGER PRIMARY KEY
```

## 2.6 Clave compuesta

Una clave compuesta utiliza varias columnas.

En una tabla que conecta médicos y especialidades:

```sql
PRIMARY KEY (medico_id, especialidad_id)
```

La combinación no se puede repetir:

| medico_id | especialidad_id | ¿Válido? |
|---:|---:|---|
| 1 | 2 | Sí |
| 1 | 3 | Sí |
| 1 | 2 | No; la combinación ya existe |

## 2.7 Clave foránea

Una **clave foránea** contiene un valor que debe corresponder a una clave de otra tabla.

```text
departamentos
┌────┬──────────────┐
│ id │ nombre       │
├────┼──────────────┤
│ 1  │ Tecnología   │
│ 2  │ Finanzas     │
└────┴──────────────┘

empleados
┌────┬────────────┬─────────────────┐
│ id │ nombre     │ departamento_id │
├────┼────────────┼─────────────────┤
│ 1  │ Ana Mora   │ 1               │
│ 2  │ Luis Vega  │ 2               │
└────┴────────────┴─────────────────┘
```

`empleados.departamento_id` hace referencia a `departamentos.id`.

En SQL:

```sql
FOREIGN KEY (departamento_id)
    REFERENCES departamentos(id)
```

## 2.8 Tabla padre y tabla hija

En la relación anterior:

- `departamentos` es la tabla padre o referenciada.
- `empleados` es la tabla hija o referente.
- La fila hija depende de que exista una fila padre válida.

Una clave foránea evita empleados que señalen departamentos inexistentes.

```text
departamento_id = 2  → válido si departamentos.id = 2 existe
departamento_id = 99 → inválido si no existe el departamento 99
```

### Práctica guiada 2 — Elegir claves

Para cada entidad, selecciona una clave primaria sustituta y una posible clave natural que debería ser única.

| Entidad | Clave primaria | Clave natural única |
|---|---|---|
| Médico | `id` | `numero_licencia` |
| Paciente | `id` | `documento` |
| Consultorio | `id` | `codigo` |
| Curso | `id` | `codigo_curso` |
| Producto | `id` | `codigo_producto` |

La clave natural no reemplaza obligatoriamente a `id`. Ambas pueden cumplir funciones diferentes.

---

# 3. Relaciones, cardinalidad y opcionalidad

## 3.1 Qué expresa una relación

Una relación responde cómo se asocian las ocurrencias de dos entidades.

Ejemplo:

> Un departamento tiene empleados y cada empleado pertenece a un departamento.

No basta con decir que las tablas “están conectadas”. Debes determinar cuántos registros pueden relacionarse y si la relación es obligatoria.

## 3.2 Relación uno a muchos

Un departamento puede tener muchos empleados. Cada empleado pertenece a un departamento.

```text
departamentos 1 ─────────── N empleados
```

La clave foránea se coloca normalmente en el lado “muchos”:

```text
empleados.departamento_id → departamentos.id
```

Ejemplos comunes:

- Una categoría tiene muchos productos.
- Un paciente tiene muchas citas.
- Un curso tiene muchas lecciones.
- Un hotel tiene muchas habitaciones.

## 3.3 Relación uno a uno

Una persona posee como máximo un expediente adicional y cada expediente pertenece a una persona.

```text
personas 1 ─────────── 1 expedientes
```

Una forma de protegerla consiste en utilizar la clave de la tabla principal como clave primaria y foránea de la tabla dependiente:

```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL
);

CREATE TABLE perfiles (
    usuario_id INTEGER PRIMARY KEY,
    biografia TEXT,
    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);
```

Como `usuario_id` es clave primaria, no puede existir más de un perfil para el mismo usuario.

No dividas automáticamente toda entidad en parejas de tablas. Una relación uno a uno debe responder a una necesidad real, como separar información opcional, sensible o con un ciclo de vida diferente.

## 3.4 Relación muchos a muchos

Un médico puede poseer varias especialidades y una especialidad puede corresponder a varios médicos.

```text
medicos N ─────────── N especialidades
```

Una base relacional resuelve esta relación mediante una tabla intermedia:

```text
medicos 1 ──< medico_especialidad >── 1 especialidades
```

```sql
CREATE TABLE medico_especialidad (
    medico_id INTEGER,
    especialidad_id INTEGER,
    PRIMARY KEY (medico_id, especialidad_id),
    FOREIGN KEY (medico_id)
        REFERENCES medicos(id),
    FOREIGN KEY (especialidad_id)
        REFERENCES especialidades(id)
);
```

La tabla intermedia puede contener atributos propios, por ejemplo, la fecha en que se acreditó la especialidad.

## 3.5 Opcionalidad

La cardinalidad indica cuántos. La opcionalidad indica si la relación debe existir.

Ejemplo:

- Un paciente puede no tener ninguna cita todavía.
- Cada cita debe tener exactamente un paciente.

```text
paciente 1 ─────────── 0..N citas
cita     1 ─────────── 1 paciente
```

Una clave foránea con `NOT NULL` hace obligatoria la relación desde la fila hija:

```sql
paciente_id INTEGER NOT NULL
```

Si se permite `NULL`, la relación puede estar ausente, salvo que otra regla lo impida.

## 3.6 Notación de pata de cuervo

Una notación común utiliza símbolos en los extremos:

| Símbolo | Significado |
|---|---|
| `||` | Exactamente uno |
| `o|` | Cero o uno |
| `|{` | Uno o muchos |
| `o{` | Cero o muchos |

Ejemplo:

```text
departamentos ||────────o{ empleados
```

Se interpreta así:

- Cada empleado pertenece a exactamente un departamento.
- Un departamento puede tener cero o muchos empleados.

## 3.7 Diagrama entidad-relación

Un diagrama entidad-relación muestra visualmente:

- Entidades.
- Atributos principales.
- Claves.
- Relaciones.
- Cardinalidad.
- Opcionalidad.

Ejemplo:

```text
┌───────────────────┐            ┌────────────────────┐
│ departamentos     │            │ empleados          │
├───────────────────┤            ├────────────────────┤
│ PK id             │ ||─────o{  │ PK id              │
│ UQ nombre         │            │ nombre             │
│ presupuesto       │            │ correo             │
└───────────────────┘            │ FK departamento_id │
                                 └────────────────────┘
```

Convenciones utilizadas en el curso:

- `PK`: clave primaria.
- `FK`: clave foránea.
- `UQ`: valor único.
- `NN`: valor obligatorio.

## 3.8 Herramientas para diagramar

Puedes dibujar a mano durante el análisis y preparar la versión final con:

- [diagrams.net](https://app.diagrams.net/), herramienta gratuita de diagramación.
- [dbdiagram.io](https://dbdiagram.io/), herramienta especializada en esquemas de bases de datos.

La herramienta no corrige automáticamente las reglas del negocio. Un diagrama atractivo puede contener un diseño incorrecto.

## Video recomendado

[Ejemplo de diseño de una base de datos mediante diagrama entidad-relación — Hernando Moreno A.](https://www.youtube.com/watch?v=N3tJgQK51GQ)

**Propósito:** observar cómo una situación se convierte en entidades y relaciones antes de crear las tablas.

### Práctica guiada 3 — Resolver una relación muchos a muchos

Situación:

> Una estudiante puede matricular varios cursos. Un curso puede tener muchos estudiantes. La matrícula debe conservar la fecha y el estado.

Modelo:

```text
estudiantes ||──o{ matriculas }o──|| cursos
```

Tablas necesarias:

```text
estudiantes
cursos
matriculas
```

La tabla `matriculas` contendrá:

- `estudiante_id`.
- `curso_id`.
- `fecha_matricula`.
- `estado`.

La combinación de estudiante y curso puede funcionar como clave primaria compuesta si una persona solo puede tener una matrícula activa por curso dentro del alcance del sistema.

---

# 4. Restricciones: reglas protegidas por la base

## 4.1 Qué es una restricción

Una restricción es una regla declarada dentro del esquema. SQLite comprueba la regla antes de aceptar ciertos datos.

```text
Intento de inserción
        │
        ▼
Comprobación de restricciones
        │
        ├── Cumple → se acepta
        └── Incumple → se rechaza
```

## 4.2 `PRIMARY KEY`

Identifica de manera única cada fila.

```sql
id INTEGER PRIMARY KEY
```

Para una tabla intermedia:

```sql
PRIMARY KEY (empleado_id, proyecto_id)
```

## 4.3 `NOT NULL`

Impide que una columna quede sin valor.

```sql
nombre TEXT NOT NULL
```

Utilízalo cuando la entidad no pueda tener sentido sin ese dato.

No marques todo como obligatorio por costumbre. Un segundo teléfono o una observación pueden ser opcionales.

## 4.4 `UNIQUE`

Impide valores duplicados.

```sql
correo TEXT UNIQUE
```

También puede aplicarse a una combinación:

```sql
UNIQUE (consultorio_id, fecha_hora)
```

La combinación evita reservar el mismo consultorio dos veces en la misma fecha y hora.

## 4.5 `CHECK`

Comprueba una condición.

```sql
salario REAL CHECK (salario > 0)
```

```sql
activo INTEGER CHECK (activo IN (0, 1))
```

```sql
estado TEXT CHECK (
    estado IN ('Planificado', 'En curso', 'Finalizado')
)
```

La expresión `IN` indica que el valor debe pertenecer al conjunto mostrado.

Una restricción `CHECK` protege reglas que dependen de los valores de la misma fila. Las reglas que requieren comparar muchas filas o consultar otras tablas necesitan otras estrategias.

## 4.6 `DEFAULT`

Proporciona un valor cuando la inserción omite una columna.

```sql
activo INTEGER NOT NULL DEFAULT 1
```

```sql
estado TEXT NOT NULL DEFAULT 'Programada'
```

`DEFAULT` no corrige un valor inválido proporcionado explícitamente. Solo se utiliza cuando el valor no se envía.

## 4.7 `FOREIGN KEY`

Protege la existencia de una relación.

```sql
FOREIGN KEY (departamento_id)
    REFERENCES departamentos(id)
```

Una clave foránea no crea automáticamente una nueva fila padre. El departamento debe existir antes de insertar al empleado.

## 4.8 Varias restricciones pueden trabajar juntas

```sql
correo TEXT NOT NULL UNIQUE
```

El correo es obligatorio y no puede repetirse.

```sql
estado TEXT NOT NULL DEFAULT 'Programada'
    CHECK (estado IN ('Programada', 'Confirmada', 'Atendida', 'Cancelada'))
```

El estado es obligatorio, posee un valor inicial y solo acepta opciones válidas.

---

# 5. Implementar relaciones correctamente en SQLite

## 5.1 Activa las claves foráneas

En SQLite la comprobación de claves foráneas debe habilitarse para cada conexión.

Ejecuta al inicio de la sesión o del script:

```sql
PRAGMA foreign_keys = ON;
```

Comprueba el estado:

```sql
PRAGMA foreign_keys;
```

Resultado esperado:

```text
1
```

Si devuelve `0`, la comprobación no está activa.

No asumas que DB Browser la activó por ti. Compruébalo siempre antes de probar relaciones.

## 5.2 Crea primero las tablas padre

Orden recomendado:

```text
1. departamentos
2. empleados
```

La tabla hija hace referencia a la tabla padre, por lo que el script resulta más comprensible si crea primero la estructura referenciada.

## 5.3 Ejemplo completo: departamentos y empleados

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE departamentos (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    presupuesto REAL NOT NULL CHECK (presupuesto >= 0)
);

CREATE TABLE empleados (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    salario REAL NOT NULL CHECK (salario > 0),
    activo INTEGER NOT NULL DEFAULT 1
        CHECK (activo IN (0, 1)),
    departamento_id INTEGER NOT NULL,
    FOREIGN KEY (departamento_id)
        REFERENCES departamentos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

## 5.4 Lee el diseño antes de insertar

### `departamentos`

- Posee un identificador.
- Su nombre es obligatorio y único.
- El presupuesto no puede ser negativo.

### `empleados`

- Nombre, correo, salario y departamento son obligatorios.
- El correo no puede repetirse.
- El salario debe ser mayor que cero.
- `activo` utiliza 1 por defecto y solo admite 0 o 1.
- El departamento debe existir.
- No se puede eliminar un departamento que todavía tenga empleados.

## 5.5 Inserta primero las filas padre

```sql
INSERT INTO departamentos (id, nombre, presupuesto)
VALUES
    (1, 'Tecnología', 85000.00),
    (2, 'Finanzas', 52000.00),
    (3, 'Operaciones', 68000.00);
```

Después inserta las filas hijas:

```sql
INSERT INTO empleados (
    id,
    nombre,
    correo,
    salario,
    departamento_id
) VALUES
    (1, 'Ana Mora', 'ana.mora@empresa.test', 1800.00, 1),
    (2, 'Luis Vega', 'luis.vega@empresa.test', 1650.00, 2),
    (3, 'Marta Solís', 'marta.solis@empresa.test', 1725.00, 1);
```

La columna `activo` se omitió y recibió el valor predeterminado 1.

## 5.6 Comprueba que las reglas funcionen

Ejecuta cada prueba por separado sobre una copia de práctica.

### Departamento inexistente

```sql
INSERT INTO empleados (
    id,
    nombre,
    correo,
    salario,
    departamento_id
) VALUES (
    4,
    'Carlos Rojas',
    'carlos.rojas@empresa.test',
    1500.00,
    99
);
```

Debe fallar porque el departamento 99 no existe.

### Correo duplicado

```sql
INSERT INTO empleados (
    id,
    nombre,
    correo,
    salario,
    departamento_id
) VALUES (
    4,
    'Carlos Rojas',
    'ana.mora@empresa.test',
    1500.00,
    3
);
```

Debe fallar por `UNIQUE`.

### Salario inválido

```sql
INSERT INTO empleados (
    id,
    nombre,
    correo,
    salario,
    departamento_id
) VALUES (
    4,
    'Carlos Rojas',
    'carlos.rojas@empresa.test',
    -100.00,
    3
);
```

Debe fallar por `CHECK`.

### Nombre ausente

```sql
INSERT INTO empleados (
    id,
    nombre,
    correo,
    salario,
    departamento_id
) VALUES (
    4,
    NULL,
    'carlos.rojas@empresa.test',
    1500.00,
    3
);
```

Debe fallar por `NOT NULL`.

Una restricción que nunca se prueba podría estar mal escrita o desactivada.

## 5.7 Revisa todas las claves foráneas

```sql
PRAGMA foreign_key_check;
```

Si la consulta no devuelve filas, no se detectaron violaciones de claves foráneas.

## 5.8 Inspecciona la estructura

```sql
PRAGMA table_info(empleados);
```

Permite revisar columnas, tipos, valores obligatorios y clave primaria.

```sql
PRAGMA foreign_key_list(empleados);
```

Muestra las claves foráneas declaradas para la tabla.

### Práctica guiada 4 — Construir y romper de forma controlada

1. Crea `empresa_practica.db`.
2. Activa claves foráneas.
3. Crea `departamentos` y `empleados`.
4. Inserta los departamentos.
5. Inserta los tres empleados válidos.
6. Comprueba que `activo` recibió el valor 1.
7. Ejecuta cada prueba inválida por separado.
8. Anota qué restricción rechazó cada intento.
9. Ejecuta `PRAGMA foreign_key_check`.
10. Conserva capturas de dos errores distintos.

---

# 6. Acciones referenciales y cambios del esquema

## 6.1 Qué ocurre cuando cambia una fila padre

Supón que un departamento tiene empleados. Si alguien intenta eliminarlo, la base debe decidir qué ocurre con las filas hijas.

Las acciones más importantes son:

| Acción | Comportamiento |
|---|---|
| `RESTRICT` | Impide modificar o eliminar el padre mientras existan filas dependientes |
| `CASCADE` | Propaga el cambio o la eliminación a las filas hijas |
| `SET NULL` | Conserva las filas hijas y coloca `NULL` en su clave foránea |
| `NO ACTION` | No aplica una acción especial; la restricción debe quedar satisfecha |

## 6.2 `ON DELETE RESTRICT`

```sql
FOREIGN KEY (departamento_id)
    REFERENCES departamentos(id)
    ON DELETE RESTRICT
```

Es apropiado cuando eliminar la fila padre dejaría datos sin significado y se prefiere obligar a resolver primero las dependencias.

## 6.3 `ON DELETE CASCADE`

```sql
FOREIGN KEY (medico_id)
    REFERENCES medicos(id)
    ON DELETE CASCADE
```

Si se elimina el médico, también se eliminan sus filas en una tabla intermedia.

Utilízalo cuando la fila hija no tenga sentido sin la fila padre. No lo elijas solo porque resulta cómodo: una cascada puede eliminar muchos registros.

## 6.4 `ON DELETE SET NULL`

```sql
medico_asignado_id INTEGER,
FOREIGN KEY (medico_asignado_id)
    REFERENCES medicos(id)
    ON DELETE SET NULL
```

La fila hija se conserva, pero queda sin médico asignado. La columna debe permitir `NULL`.

## 6.5 `ON UPDATE CASCADE`

```sql
ON UPDATE CASCADE
```

Si cambia la clave referenciada, la actualización se propaga a las claves hijas. Las claves primarias deberían cambiar muy rara vez, pero declarar la acción hace explícita la decisión.

## 6.6 Cómo elegir

Pregunta:

1. ¿La fila hija conserva significado sin el padre?
2. ¿Debe preservarse por historial?
3. ¿La relación puede quedar temporalmente ausente?
4. ¿Eliminar automáticamente sería peligroso?

Ejemplos razonables:

| Relación | Acción posible | Justificación |
|---|---|---|
| Departamento → empleados | `RESTRICT` | No se desea borrar empleados automáticamente |
| Médico → tabla de especialidades | `CASCADE` | La asociación no tiene sentido sin el médico |
| Categoría → productos | `SET NULL` | El producto puede conservarse sin categoría, si la regla lo permite |
| Paciente → citas | `RESTRICT` | Las citas pueden formar parte del historial |

No existe una acción universalmente correcta. La regla depende del negocio.

## 6.7 Añadir una columna con `ALTER TABLE`

```sql
ALTER TABLE empleados
ADD COLUMN telefono TEXT;
```

## 6.8 Cambiar el nombre de una columna

```sql
ALTER TABLE empleados
RENAME COLUMN correo TO correo_institucional;
```

## 6.9 Cambiar el nombre de una tabla

```sql
ALTER TABLE empleados
RENAME TO colaboradores;
```

SQLite admite cambios básicos directamente. Las modificaciones complejas pueden requerir crear una tabla nueva, copiar los datos y reemplazar la estructura. Esa migración debe planificarse y probarse.

## 6.10 Eliminar una tabla

```sql
DROP TABLE empleados;
```

`DROP TABLE` elimina la estructura y sus datos. Utilízalo solamente en bases de práctica o cuando la eliminación forme parte de un cambio autorizado.

Si existen relaciones, elimina primero las tablas hijas y después las tablas padre:

```text
1. empleados
2. departamentos
```

No practiques `DROP TABLE` sobre el único archivo de tu proyecto. Trabaja con una copia que puedas reemplazar.

### Práctica guiada 5 — Elegir acciones referenciales

Decide una acción y justifica la elección:

1. Eliminar una factura que posee líneas de detalle.
2. Eliminar una categoría que tiene productos activos.
3. Eliminar un usuario que posee una configuración personal sin valor histórico.
4. Eliminar un paciente con citas registradas.

No busques una palabra “correcta” sin contexto. Escribe qué debe conservar el negocio y qué pérdida sería aceptable.

---

# 7. Normalización práctica

## 7.1 Por qué se normaliza

La normalización ayuda a reducir repetición innecesaria y prevenir inconsistencias.

Considera:

| cita_id | paciente_nombre | paciente_telefono | medico_nombre | especialidad | fecha |
|---:|---|---|---|---|---|
| 1 | Ana Mora | 8888-1111 | Luis Vega | Pediatría | 2026-08-10 |
| 2 | Ana Mora | 8888-1111 | Marta Solís | Medicina general | 2026-08-18 |
| 3 | Ana Mora | 8999-2222 | Luis Vega | Pediatría | 2026-09-02 |

¿Cuál teléfono es correcto? La repetición permitió una contradicción.

## 7.2 Anomalías

### Anomalía de actualización

Para cambiar el teléfono de una paciente deben modificarse varias filas. Si una queda sin actualizar, aparecen versiones contradictorias.

### Anomalía de inserción

No se puede registrar un médico nuevo hasta que tenga una cita, porque toda la información está mezclada en la misma tabla.

### Anomalía de eliminación

Si se elimina la única cita de un médico, también se pierde su información profesional.

Separar entidades reduce estas anomalías.

## 7.3 Primera forma normal — 1FN

Una tabla en primera forma normal debe evitar grupos repetidos y valores que contengan listas difíciles de consultar.

Diseño problemático:

| paciente_id | nombre | telefonos |
|---:|---|---|
| 1 | Ana Mora | 8888-1111, 2222-3333 |

La columna almacena dos valores dentro de una celda.

Otro diseño problemático:

| paciente_id | nombre | telefono_1 | telefono_2 | telefono_3 |
|---:|---|---|---|---|

La cantidad de columnas depende del número de teléfonos.

Diseño normalizado cuando el sistema necesita varios teléfonos:

```text
pacientes
├── id
└── nombre

telefonos_paciente
├── id
├── paciente_id
├── numero
└── tipo
```

No es necesario crear una tabla separada si el requisito permite exactamente un único teléfono. La estructura debe responder a la realidad del sistema.

## 7.4 Segunda forma normal — 2FN

La segunda forma normal resulta relevante especialmente cuando existe una clave primaria compuesta.

Diseño problemático:

```text
detalle_pedido
PK pedido_id
PK producto_id
cantidad
nombre_producto
fecha_pedido
```

La clave completa es `(pedido_id, producto_id)`, pero:

- `nombre_producto` depende solamente de `producto_id`.
- `fecha_pedido` depende solamente de `pedido_id`.
- `cantidad` depende de la combinación completa.

Diseño mejorado:

```text
pedidos
├── id
└── fecha_pedido

productos
├── id
└── nombre

detalle_pedido
├── pedido_id
├── producto_id
└── cantidad
```

Una tabla con clave simple y que ya cumple 1FN normalmente no presenta una dependencia parcial de la clave.

## 7.5 Tercera forma normal — 3FN

La tercera forma normal evita que una columna no clave dependa de otra columna no clave.

Diseño problemático:

```text
empleados
├── id
├── nombre
├── departamento_id
└── departamento_nombre
```

`departamento_nombre` depende de `departamento_id`, no directamente del empleado.

Diseño mejorado:

```text
departamentos
├── id
└── nombre

empleados
├── id
├── nombre
└── departamento_id
```

## 7.6 No normalices por reflejo

Normalizar no significa convertir cada columna en una tabla.

Diseño innecesario:

```text
personas
nombres_persona
apellidos_persona
ciudades_persona
correos_persona
```

La separación debe resolver repetición, dependencias o reglas reales. Un diseño excesivamente fragmentado puede ser difícil de comprender y utilizar.

## 7.7 Método práctico de revisión

Para cada tabla, pregunta:

1. ¿Qué representa una fila?
2. ¿Existe alguna columna con una lista de valores?
3. ¿Existen columnas numeradas como `telefono_1`, `telefono_2` y `telefono_3`?
4. ¿Se repite información descriptiva de otra entidad?
5. ¿Un cambio obliga a modificar muchas filas?
6. ¿Se perdería información importante al eliminar el último registro de una actividad?
7. ¿Cada columna depende de la identidad completa de la fila?

## Video recomendado

[Normalización de bases de datos: 1FN, 2FN y 3FN — Jesús Domínguez Gutú](https://www.youtube.com/watch?v=QUWrKd9vK28)

**Propósito:** reforzar las tres formas normales mediante ejemplos y reconocer problemas de repetición.

---

# 8. Diccionario de datos y modelo relacional

## 8.1 Modelo relacional escrito

Además del diagrama, documenta cada tabla en una forma compacta:

```text
DEPARTAMENTOS(
    id PK,
    nombre UQ NN,
    presupuesto NN
)

EMPLEADOS(
    id PK,
    nombre NN,
    correo UQ NN,
    salario NN,
    activo NN,
    departamento_id FK → DEPARTAMENTOS.id NN
)
```

## 8.2 Diccionario de datos

Un diccionario de datos explica el propósito y las reglas de cada columna.

| Tabla | Columna | Tipo | Reglas | Descripción |
|---|---|---|---|---|
| departamentos | id | INTEGER | PK | Identificador interno |
| departamentos | nombre | TEXT | NN, UQ | Nombre del departamento |
| departamentos | presupuesto | REAL | NN, `>= 0` | Presupuesto aprobado |
| empleados | departamento_id | INTEGER | FK, NN | Departamento al que pertenece |

Un buen diccionario evita que otra persona tenga que deducir el significado de nombres o códigos.

## 8.3 Orden profesional de la documentación

1. Descripción del problema.
2. Alcance y exclusiones.
3. Reglas de negocio.
4. Diagrama entidad-relación.
5. Modelo relacional.
6. Diccionario de datos.
7. Decisiones de integridad referencial.
8. Evidencias de validación.

---

# 9. Diferencias entre SQLite y otros motores

Los conceptos del modelo relacional se transfieren, pero algunos detalles físicos cambian.

| Tema | SQLite | Otros motores |
|---|---|---|
| Almacenamiento | Base completa en un archivo | Normalmente utilizan un servidor |
| Tipos | Afinidad flexible; tablas `STRICT` opcionales | Tipos generalmente más rígidos |
| Claves foráneas | Se activan por conexión con `PRAGMA foreign_keys = ON` | Normalmente se aplican según la configuración del servidor |
| Identificador automático | `INTEGER PRIMARY KEY` posee comportamiento especial | Puede utilizar `IDENTITY`, `AUTO_INCREMENT` o columnas de identidad |
| Booleanos | Se suelen representar con 0 y 1 | Algunos motores tienen tipo booleano propio |
| Fechas | Pueden almacenarse como texto, real o entero | Suelen existir tipos específicos de fecha y hora |
| `ALTER TABLE` | Operaciones directas más limitadas | Algunos motores permiten más cambios directos |

No memorices todas las variantes. Aprende a reconocer qué parte pertenece al modelo relacional y consulta la documentación del motor cuando cambies de entorno.

---

# 10. Buenas prácticas y errores frecuentes

## 10.1 Crear una tabla para cada palabra del enunciado

No toda palabra es una entidad. `nombre`, `estado` y `telefono` pueden ser atributos.

## 10.2 Utilizar el nombre como clave primaria

Los nombres pueden repetirse, corregirse o cambiar. Prefiere una clave estable y protege las claves naturales importantes con `UNIQUE`.

## 10.3 Colocar la clave foránea en el lado incorrecto

En una relación uno a muchos, la clave foránea suele colocarse en el lado muchos.

```text
departamento 1 ─── N empleados
empleados.departamento_id
```

## 10.4 Escribir una relación muchos a muchos sin tabla intermedia

Evita columnas como:

```text
especialidades = 'Pediatría, Cardiología, Medicina general'
```

Utiliza una tabla intermedia.

## 10.5 Declarar la clave foránea, pero no activarla

En SQLite debes ejecutar y comprobar:

```sql
PRAGMA foreign_keys = ON;
PRAGMA foreign_keys;
```

## 10.6 Utilizar `CASCADE` sin analizar las consecuencias

Una cascada puede eliminar todas las filas relacionadas. Decide primero qué debe conservarse.

## 10.7 Permitir `NULL` en datos obligatorios

Si una cita no puede existir sin paciente, utiliza `NOT NULL` en `paciente_id`.

## 10.8 Utilizar `DEFAULT` como sustituto de un dato obligatorio

Un valor predeterminado no debe inventar información real. No asignes un documento, correo o médico ficticio solo para evitar `NULL`.

## 10.9 Confiar únicamente en el diagrama

El diagrama comunica el diseño. El script implementa y protege las reglas. Ambos deben coincidir.

## 10.10 Probar solamente casos válidos

Una restricción demuestra su valor cuando rechaza un caso inválido. Incluye pruebas controladas.

---

# 11. Ejercicios individuales

Resuelve los ejercicios antes de consultar las soluciones.

## Ejercicio 1 — Entidad o atributo

Un hotel necesita administrar huéspedes, habitaciones, reservas, número de pasaporte, tipo de habitación, fecha de entrada, país y pagos.

Clasifica cada elemento como entidad probable, atributo probable o elemento que necesita más contexto. Justifica las decisiones.

## Ejercicio 2 — Extraer reglas

Lee:

> Cada producto pertenece a una categoría. Una categoría puede existir aunque todavía no tenga productos. El código de cada producto es único. El precio debe ser mayor que cero. La descripción es opcional.

Escribe al menos seis reglas de diseño o integridad derivadas del texto.

## Ejercicio 3 — Elegir claves

Para `vehiculos`, `estudiantes`, `habitaciones` y `empleados`, propone:

1. Una clave primaria sustituta.
2. Una clave natural candidata.
3. Una razón por la que la clave natural podría no ser la clave primaria.

## Ejercicio 4 — Determinar cardinalidad

Clasifica cada relación como 1:1, 1:N o N:M:

1. País y ciudades.
2. Estudiantes y cursos.
3. Usuario y perfil único.
4. Pedido y líneas de detalle.
5. Actores y películas.
6. Habitación y reservas a lo largo del tiempo.

Indica dónde colocarías la clave foránea o si se necesita una tabla intermedia.

## Ejercicio 5 — Corregir una lista en una columna

Se diseñó:

```text
medicos(id, nombre, especialidades)
```

La columna `especialidades` contiene valores como:

```text
'Pediatría, Cardiología'
```

Explica el problema y dibuja un modelo de tres tablas que permita representar la relación correctamente.

## Ejercicio 6 — Seleccionar restricciones

Elige una o más restricciones para cada regla:

1. El correo del usuario no puede repetirse.
2. Una calificación debe estar entre 0 y 100.
3. Una cita se crea como programada si no se indica estado.
4. Todo producto debe tener nombre.
5. Todo empleado debe pertenecer a un departamento existente.
6. La misma persona no puede matricular dos veces el mismo curso.

## Ejercicio 7 — Reparar un esquema

Corrige todos los problemas que encuentres:

```sql
CREATE TABLE categorias (
    id INTEGER,
    nombre TEXT
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    codigo TEXT,
    precio REAL,
    categoria TEXT,
    categoria_id INTEGER,
    FOREIGN KEY (categoria_id)
        REFERENCES categoria(id)
);
```

Requisitos:

- Las categorías tienen identidad.
- El nombre de categoría no se repite.
- Todo producto posee nombre, código, precio y categoría.
- El código es único.
- El precio debe ser positivo.
- No se debe duplicar el nombre de la categoría dentro de `productos`.

## Ejercicio 8 — Predecir errores

Utiliza el ejemplo de departamentos y empleados. Indica qué restricción rechazaría cada caso:

1. Dos departamentos llamados `Tecnología`.
2. Un empleado sin nombre.
3. Un salario de cero.
4. Un empleado con departamento 80 inexistente.
5. Dos empleados con el mismo correo.
6. Un valor de activo igual a 7.

## Ejercicio 9 — Elegir una acción referencial

Propón `RESTRICT`, `CASCADE` o `SET NULL` y justifica:

1. Autor y borradores temporales sin valor histórico.
2. Paciente y citas médicas históricas.
3. Categoría opcional y productos.
4. Pedido y líneas de detalle.
5. Departamento y empleados activos.

## Ejercicio 10 — Aplicar 1FN

Corrige:

| estudiante_id | nombre | telefonos | curso_1 | curso_2 |
|---:|---|---|---|---|
| 1 | Elena Ruiz | 8888-1111, 2222-2222 | SQL | Python |

Identifica todos los grupos repetidos o valores múltiples y propone las tablas necesarias.

## Ejercicio 11 — Aplicar 2FN

La tabla posee clave primaria `(reserva_id, servicio_id)`:

```text
detalle_servicio(
    reserva_id,
    servicio_id,
    fecha_reserva,
    nombre_servicio,
    cantidad,
    precio_aplicado
)
```

Indica qué columnas dependen solo de una parte de la clave y propone una separación adecuada.

## Ejercicio 12 — Aplicar 3FN

Analiza:

```text
empleados(
    id,
    nombre,
    puesto_id,
    puesto_nombre,
    salario_base_puesto
)
```

Explica la dependencia y propone un modelo en tercera forma normal.

---

# 12. Soluciones explicadas de los ejercicios

## Solución del ejercicio 1

Entidades probables:

- Huésped.
- Habitación.
- Reserva.
- Tipo de habitación.
- Pago.

Atributos probables:

- Número de pasaporte, asociado al huésped.
- Fecha de entrada, asociada a la reserva.
- País, que podría ser texto o una entidad si el sistema necesita un catálogo oficial.

`País` necesita contexto: una tabla independiente se justifica si posee código, reglas o relaciones propias.

## Solución del ejercicio 2

1. Debe existir una tabla `categorias`.
2. Debe existir una tabla `productos`.
3. Una categoría puede relacionarse con cero o muchos productos.
4. Cada producto debe relacionarse con exactamente una categoría.
5. `productos.categoria_id` debe ser `NOT NULL` y clave foránea.
6. `codigo` debe ser `UNIQUE` y `NOT NULL`.
7. `precio` debe poseer `CHECK (precio > 0)`.
8. `descripcion` puede permitir `NULL`.

## Solución del ejercicio 3

| Entidad | Sustituta | Natural candidata | Riesgo de la natural |
|---|---|---|---|
| Vehículo | `id` | placa | Puede cambiar o variar por país |
| Estudiante | `id` | código institucional | Puede cambiar entre instituciones |
| Habitación | `id` | número o código | Puede cambiar por remodelación |
| Empleado | `id` | documento | Puede tener formatos externos o correcciones |

## Solución del ejercicio 4

1. País 1:N ciudades; `ciudades.pais_id`.
2. Estudiantes N:M cursos; tabla `matriculas`.
3. Usuario 1:1 perfil; `perfiles.usuario_id` puede ser PK y FK.
4. Pedido 1:N líneas; `lineas_pedido.pedido_id`.
5. Actores N:M películas; tabla `actor_pelicula`.
6. Habitación 1:N reservas a lo largo del tiempo; `reservas.habitacion_id`.

## Solución del ejercicio 5

```text
medicos
├── id
└── nombre

especialidades
├── id
└── nombre

medico_especialidad
├── medico_id
└── especialidad_id
```

La tabla intermedia permite cualquier cantidad de asociaciones sin guardar listas en una celda.

## Solución del ejercicio 6

1. `NOT NULL UNIQUE` para el correo, si es obligatorio.
2. `CHECK (calificacion >= 0 AND calificacion <= 100)`.
3. `DEFAULT 'Programada'`, junto con `NOT NULL` y un `CHECK` de estados válidos.
4. `NOT NULL`.
5. `NOT NULL` y `FOREIGN KEY`.
6. `PRIMARY KEY (estudiante_id, curso_id)` o `UNIQUE` sobre esa combinación.

## Solución del ejercicio 7

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    codigo TEXT NOT NULL UNIQUE,
    precio REAL NOT NULL CHECK (precio > 0),
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

Se eliminó `categoria TEXT` porque repetía información que pertenece a `categorias`.

## Solución del ejercicio 8

1. `UNIQUE` en `departamentos.nombre`.
2. `NOT NULL` en `empleados.nombre`.
3. `CHECK (salario > 0)`.
4. `FOREIGN KEY`.
5. `UNIQUE` en `empleados.correo`.
6. `CHECK (activo IN (0, 1))`.

## Solución orientativa del ejercicio 9

1. `CASCADE` podría ser apropiado si los borradores no tienen sentido sin el autor y su eliminación está autorizada.
2. `RESTRICT` para proteger el historial.
3. `SET NULL` si un producto puede continuar sin categoría.
4. `CASCADE` si una línea de detalle no tiene sentido sin el pedido.
5. `RESTRICT` para impedir eliminar un departamento con empleados activos.

La justificación es más importante que memorizar una respuesta.

## Solución del ejercicio 10

Modelo posible:

```text
estudiantes(id, nombre)
telefonos_estudiante(id, estudiante_id, numero)
cursos(id, nombre)
matriculas(estudiante_id, curso_id)
```

Los teléfonos dejan de formar una lista y los cursos dejan de aparecer como columnas numeradas.

## Solución del ejercicio 11

- `fecha_reserva` depende de `reserva_id`.
- `nombre_servicio` depende de `servicio_id`.
- `cantidad` y `precio_aplicado` pueden depender de la combinación completa.

Modelo:

```text
reservas(id, fecha_reserva)
servicios(id, nombre_servicio)
detalle_servicio(reserva_id, servicio_id, cantidad, precio_aplicado)
```

## Solución del ejercicio 12

`puesto_nombre` y `salario_base_puesto` dependen de `puesto_id`, no directamente del empleado.

```text
puestos(id, nombre, salario_base)
empleados(id, nombre, puesto_id)
```

---

# 13. Mini proyecto — Estructura organizacional de una empresa

## Objetivo

Diseñar e implementar relaciones uno a muchos y muchos a muchos mediante una base pequeña, restricciones verificables y un diagrama entidad-relación.

## Situación

Una empresa necesita registrar departamentos, empleados y proyectos. Cada empleado pertenece a un departamento. Un empleado puede participar en varios proyectos y cada proyecto puede incluir varios empleados.

## Modelo mínimo

```text
departamentos ||──o{ empleados
empleados ||──o{ asignaciones }o──|| proyectos
```

## Requisitos obligatorios

### `departamentos`

- `id` como clave primaria.
- `nombre` obligatorio y único.
- `ubicacion` opcional.

### `empleados`

- `id` como clave primaria.
- `nombre` obligatorio.
- `correo` obligatorio y único.
- `activo` obligatorio, con valor predeterminado 1 y limitado a 0 o 1.
- `departamento_id` obligatorio y válido.

### `proyectos`

- `id` como clave primaria.
- `nombre` obligatorio y único.
- `estado` obligatorio, con opciones `Planificado`, `En curso` y `Finalizado`.

### `asignaciones`

- `empleado_id` como clave foránea.
- `proyecto_id` como clave foránea.
- `rol` obligatorio.
- La combinación de empleado y proyecto no puede repetirse.
- Las asociaciones deben eliminarse mediante `CASCADE` si desaparece el empleado o proyecto en esta base de práctica.

## Datos mínimos

- Tres departamentos.
- Cinco empleados.
- Tres proyectos.
- Seis asignaciones.
- Un departamento sin empleados para demostrar opcionalidad.

## Pruebas obligatorias

1. Intentar repetir un correo.
2. Intentar asignar un empleado a un proyecto inexistente.
3. Intentar repetir la misma asignación.
4. Intentar utilizar un estado no permitido.

Ejecuta las pruebas por separado. Después de observar el error, déjalas comentadas en el script para que la ejecución principal continúe funcionando.

## Entregable interno

Conserva:

- Diagrama.
- Script.
- Base `.db`.
- Dos capturas de restricciones rechazando datos inválidos.

Este mini proyecto se integra en la evidencia de trabajo del módulo. No requiere un formulario independiente.

## Lista de comprobación

- [ ] Las cuatro tablas representan temas claros.
- [ ] Las claves primarias están definidas.
- [ ] Las claves foráneas apuntan a tablas y columnas correctas.
- [ ] La relación N:M utiliza `asignaciones`.
- [ ] `PRAGMA foreign_keys` devuelve 1.
- [ ] Los datos válidos se insertan en el orden correcto.
- [ ] Las cuatro pruebas inválidas son rechazadas.
- [ ] `PRAGMA foreign_key_check` no devuelve violaciones.

---


<!-- coa-activity:sql-m2-mini-proyecto -->

# 14. Proyecto del módulo — Sistema de gestión para una clínica

## Desafío

Una clínica necesita reemplazar documentos separados por una base de datos central. El sistema debe registrar pacientes, médicos, especialidades, consultorios y citas, evitando duplicados y relaciones imposibles.

Tu responsabilidad es analizar el caso, diseñar el modelo, implementarlo en SQLite y demostrar que las reglas de integridad funcionan.

## Alcance

El proyecto administra la estructura y los datos esenciales de las citas. No incluye historiales clínicos, diagnósticos, recetas, facturación, seguros, autenticación ni una aplicación gráfica.

Excluir conscientemente información fuera del objetivo evita diseñar un sistema imposible de completar en este módulo.

## Entidades obligatorias

1. Especialidades.
2. Médicos.
3. Asociación entre médicos y especialidades.
4. Pacientes.
5. Consultorios.
6. Citas.

## Reglas de negocio obligatorias

1. Cada especialidad posee un nombre único.
2. Cada médico posee un número de licencia único.
3. Un médico puede tener varias especialidades.
4. Una especialidad puede corresponder a varios médicos.
5. La misma asociación médico-especialidad no puede repetirse.
6. Cada paciente posee un documento único.
7. Cada consultorio posee un código único.
8. La capacidad de un consultorio debe ser mayor que cero.
9. Cada cita pertenece a un paciente existente.
10. Cada cita es atendida por un médico existente.
11. Cada cita utiliza un consultorio existente.
12. El estado inicial de una cita es `Programada`.
13. Los estados permitidos son `Programada`, `Confirmada`, `Atendida` y `Cancelada`.
14. Un médico no puede tener dos citas en la misma fecha y hora.
15. Un consultorio no puede albergar dos citas en la misma fecha y hora.
16. Pacientes, médicos y consultorios con citas asociadas no deben eliminarse automáticamente.
17. Las filas de la tabla intermedia pueden eliminarse en cascada si desaparece el médico o la especialidad.

## Columnas mínimas

### `especialidades`

- `id`.
- `nombre`.
- `descripcion`, opcional.

### `medicos`

- `id`.
- `nombre`.
- `numero_licencia`.
- `correo`.
- `telefono`.
- `activo`.

### `medico_especialidad`

- `medico_id`.
- `especialidad_id`.
- `fecha_acreditacion`, opcional.

### `pacientes`

- `id`.
- `documento`.
- `nombre`.
- `fecha_nacimiento`.
- `telefono`.
- `correo`, opcional.

### `consultorios`

- `id`.
- `codigo`.
- `piso`.
- `capacidad`.
- `descripcion`, opcional.

### `citas`

- `id`.
- `paciente_id`.
- `medico_id`.
- `consultorio_id`.
- `fecha_hora`.
- `estado`.
- `motivo`.
- `observaciones`, opcional.

## Decisiones que debes tomar y justificar

- Qué columnas son obligatorias.
- Qué columnas deben ser únicas.
- Qué tipos utilizarás.
- Qué columnas permiten `NULL`.
- Qué restricciones `CHECK` aplicarás.
- Qué acciones referenciales utilizarás.
- Cómo evitarás citas duplicadas para médicos y consultorios.
- Qué formato utilizarás para fechas y horas.

Formato recomendado para `fecha_hora` en SQLite:

```text
AAAA-MM-DD HH:MM
```

Ejemplo:

```text
2026-08-15 09:30
```

## Cantidad mínima de datos

- Cuatro especialidades.
- Cinco médicos.
- Seis asociaciones médico-especialidad.
- Ocho pacientes.
- Cuatro consultorios.
- Doce citas.
- Por lo menos un valor `NULL` legítimo en cada tabla que posea campos opcionales.
- Todos los estados permitidos deben aparecer al menos una vez en los datos de prueba.

## Diagrama esperado

El diagrama debe mostrar como mínimo:

```text
especialidades ||──o{ medico_especialidad }o──|| medicos
medicos         ||──o{ citas
pacientes       ||──o{ citas
consultorios    ||──o{ citas
```

Incluye claves primarias, claves foráneas, cardinalidades y opcionalidad.

## Pruebas de integridad obligatorias

Demuestra que la base rechaza:

1. Una especialidad duplicada.
2. Un número de licencia duplicado.
3. Un paciente sin nombre.
4. Un consultorio con capacidad cero o negativa.
5. Una cita con médico inexistente.
6. Una cita con estado no permitido.
7. La misma especialidad asignada dos veces al mismo médico.
8. Dos citas del mismo médico a la misma hora.
9. Dos citas en el mismo consultorio a la misma hora.

Las instrucciones inválidas deben permanecer comentadas al final del script, acompañadas por una explicación del error esperado. No deben impedir reconstruir la base.

## Consultas de comprobación

En este módulo no se requieren `JOIN`. Incluye:

```sql
SELECT * FROM especialidades;
SELECT * FROM medicos;
SELECT * FROM medico_especialidad;
SELECT * FROM pacientes;
SELECT * FROM consultorios;
SELECT * FROM citas;
PRAGMA foreign_key_check;
```

Las consultas multitabla se estudiarán más adelante.

## Orden del script

```text
1. Encabezado
2. PRAGMA foreign_keys = ON
3. Creación de tablas padre
4. Creación de tablas hijas e intermedias
5. Inserción de catálogos y padres
6. Inserción de asociaciones y citas
7. Consultas de comprobación
8. PRAGMA foreign_key_check
9. Pruebas inválidas comentadas
```

## Proceso de construcción

### Fase 1. Reescribe los requisitos

Expresa cada regla con una oración clara. No escribas SQL todavía.

### Fase 2. Identifica entidades y atributos

Completa una lista y elimina cualquier atributo duplicado.

### Fase 3. Determina claves

Selecciona claves primarias, claves naturales únicas y claves compuestas.

### Fase 4. Dibuja relaciones

Marca 1:1, 1:N, N:M y opcionalidad.

### Fase 5. Revisa normalización

Comprueba 1FN, 2FN y 3FN mediante las preguntas del módulo.

### Fase 6. Construye el diccionario

Documenta tabla, columna, tipo, reglas y descripción.

### Fase 7. Escribe `CREATE TABLE`

Trabaja desde las tablas padre hacia las hijas.

### Fase 8. Inserta datos válidos

Respeta el orden de las dependencias.

### Fase 9. Prueba datos inválidos

Ejecuta una prueba por vez y conserva evidencia del mensaje recibido.

### Fase 10. Verifica relaciones

Ejecuta:

```sql
PRAGMA foreign_keys;
PRAGMA foreign_key_check;
```

### Fase 11. Reconstruye desde cero

Crea una base vacía de prueba y ejecuta el script principal completo.

### Fase 12. Documenta y entrega

Comprueba que el diagrama, el modelo relacional, el diccionario y el script describan la misma estructura.

## Restricciones del proyecto

- No utilices Python ni otro lenguaje.
- No agregues historiales clínicos ni facturación.
- No guardes especialidades como una lista dentro de `medicos`.
- No repitas datos del paciente dentro de `citas`.
- No utilices nombres como claves primarias.
- No desactives claves foráneas para conseguir que los datos se inserten.
- No utilices `CASCADE` sin justificarlo.
- No añadas consultas avanzadas que oculten errores del diseño.
- No utilices datos personales reales.

## Lista de comprobación del proyecto

- [ ] El alcance está explicado.
- [ ] Las diecisiete reglas obligatorias están representadas.
- [ ] El diagrama contiene seis tablas.
- [ ] Las cardinalidades son correctas.
- [ ] La relación N:M utiliza una tabla intermedia.
- [ ] Todas las tablas tienen clave primaria.
- [ ] Las claves naturales importantes son únicas.
- [ ] Las claves foráneas están activas.
- [ ] Los campos obligatorios utilizan `NOT NULL`.
- [ ] Los valores controlados utilizan `CHECK`.
- [ ] Los valores iniciales apropiados utilizan `DEFAULT`.
- [ ] Las acciones referenciales están justificadas.
- [ ] El esquema cumple 1FN, 2FN y 3FN.
- [ ] Las cantidades mínimas de datos se cumplen.
- [ ] Las nueve pruebas inválidas son rechazadas.
- [ ] `PRAGMA foreign_key_check` no devuelve filas.
- [ ] El script reconstruye la base desde cero.
- [ ] La documentación y las evidencias están completas.

## Condición de avance

El proyecto debe alcanzar al menos 70 puntos, cumplir los requisitos críticos y ser aprobado. Si recibe observaciones, deberás corregirlas antes de comenzar el Módulo 3.

---

# 15. Rúbrica de evaluación del proyecto

| Criterio | Evidencia esperada | Puntos |
|---|---|---:|
| Análisis y reglas de negocio | Alcance claro, reglas completas y decisiones justificadas | 15 |
| Diagrama y modelo relacional | Entidades, claves, relaciones, cardinalidad y opcionalidad correctas | 20 |
| Estructura SQL | Tablas, tipos y orden de creación correctos | 15 |
| Integridad | PK, FK, NN, UQ, CHECK, DEFAULT y acciones referenciales apropiadas | 25 |
| Normalización | Ausencia de listas, dependencias parciales y dependencias transitivas injustificadas | 10 |
| Datos y validación | Datos suficientes, pruebas inválidas y comprobación de claves foráneas | 10 |
| Organización y documentación | Script legible, diccionario, explicación y evidencias | 5 |
| **Total** |  | **100** |

## Requisitos críticos

El proyecto no puede aprobarse si:

- No se entrega el script SQL.
- El script no reconstruye la base sobre un archivo vacío.
- Las claves foráneas están desactivadas durante las pruebas.
- La relación entre médicos y especialidades no utiliza una tabla intermedia.
- Existen referencias a registros inexistentes.
- Faltan entidades obligatorias.
- El diseño conserva listas dentro de una columna.
- Las restricciones contienen errores que impiden utilizar el proyecto.
- No se entrega el diagrama o no coincide con el script.
- Se presentan datos personales reales o contenido copiado sin comprensión.

---

# 16. Evaluación práctica del módulo

## Situación

Un cine necesita registrar películas, salas y funciones. Cada función corresponde a una película y se realiza en una sala. Una película puede tener muchas funciones y una sala puede utilizarse en muchas funciones en horarios diferentes.

## Tareas

1. Identifica las tres entidades y sus atributos esenciales.
2. Escribe por lo menos seis reglas de negocio.
3. Dibuja las relaciones y cardinalidades.
4. Selecciona las claves primarias.
5. Define una clave natural única para películas y otra para salas.
6. Diseña las claves foráneas de `funciones`.
7. Evita dos funciones en la misma sala y fecha-hora.
8. Limita el estado de una función a `Programada`, `Disponible` o `Cancelada`.
9. Escribe las tres instrucciones `CREATE TABLE`.
10. Inserta una película, una sala y una función válida.
11. Explica qué ocurriría al insertar una función con una sala inexistente.

## Tiempo sugerido

**15 minutos**

## Criterios de dominio

- La clave foránea está en la tabla correcta.
- Las cardinalidades coinciden con el caso.
- Las claves y restricciones protegen las reglas.
- Las tablas se crean en un orden lógico.
- El estudiante puede explicar el propósito de cada restricción.

La evaluación comprueba diseño y razonamiento. No se califica la decoración del diagrama.

---

# 17. Punto de entrega obligatorio

Todo el módulo se entrega mediante un único punto. No se utilizan formularios separados para cada ejercicio o prueba.

## Nombre del archivo

```text
COA_SQL_M02_Apellido_Nombre.zip
```

Ejemplo:

```text
COA_SQL_M02_Cerna_Victor.zip
```

## Contenido obligatorio

```text
COA_SQL_M02_Apellido_Nombre/
├── COA_SQL_M02_Apellido_Nombre.sql
├── clinica.db
├── documentacion_diseno.pdf
└── evidencias/
    ├── 01_diagrama_entidad_relacion.png
    ├── 02_estructura_tablas.png
    ├── 03_foreign_keys_activas.png
    ├── 04_datos_insertados.png
    ├── 05_error_clave_foranea.png
    ├── 06_error_restriccion.png
    ├── 07_foreign_key_check.png
    └── 08_prueba_script_vacio.png
```

## Contenido de `documentacion_diseno.pdf`

1. Descripción y alcance.
2. Reglas de negocio.
3. Diagrama entidad-relación legible.
4. Modelo relacional escrito.
5. Diccionario de datos.
6. Justificación de claves y restricciones.
7. Justificación de acciones referenciales.
8. Explicación de normalización.
9. Resultado de las pruebas inválidas.

Toda la documentación se reúne en un único PDF. No es necesario crear varios documentos separados.

## Evidencias

- La captura de claves foráneas debe mostrar que `PRAGMA foreign_keys` devuelve 1.
- Las capturas de errores deben mostrar intentos diferentes.
- `PRAGMA foreign_key_check` debe ejecutarse sobre la versión final.
- La prueba del script debe realizarse sobre una base vacía.
- Las imágenes deben ser legibles y corresponder al proyecto entregado.

## Antes de enviar

1. Abre el `.zip`.
2. Comprueba los nombres.
3. Ejecuta el script sobre una base vacía.
4. Abre `clinica.db` y revisa las seis tablas.
5. Compara el diagrama con el script.
6. Comprueba las cantidades mínimas de datos.
7. Revisa que las pruebas inválidas estén comentadas.
8. Ejecuta `PRAGMA foreign_key_check` una última vez.

[Entregar el Módulo 2](https://forms.gle/nTx97JRkFkbH5Vfr6)

---


<!-- coa-activity:sql-m2-proyecto -->

# 18. Retos adicionales

## Reto 1 — Relación uno a uno

Agrega a una base de práctica las tablas `usuarios` y `preferencias_usuario`. Garantiza que cada usuario tenga como máximo una fila de preferencias.

## Reto 2 — Catálogo opcional

Diseña productos que puedan conservarse si se elimina su categoría. Implementa y prueba `ON DELETE SET NULL`. Explica por qué la clave foránea debe permitir `NULL`.

## Reto 3 — Comparar acciones

Crea tres copias pequeñas del mismo esquema y prueba `RESTRICT`, `CASCADE` y `SET NULL`. Registra qué filas permanecen después de intentar eliminar la fila padre.

## Reto 4 — Detectar sobrenormalización

Analiza un diseño que separa nombre, apellido, correo y ciudad en cuatro tablas diferentes. Explica qué separaciones aportan valor y cuáles solo aumentan complejidad.

---

# 19. Videos recomendados del módulo

## Video esencial 1

[Ejemplo de diseño de una base de datos mediante diagrama entidad-relación — Hernando Moreno A.](https://www.youtube.com/watch?v=N3tJgQK51GQ)

**Tema exacto:** análisis y construcción de un diagrama entidad-relación.  
**Momento recomendado:** después de estudiar cardinalidades.  
**Objetivo:** observar un proceso completo de diseño antes de escribir SQL.

## Video esencial 2

[Normalización de bases de datos: 1FN, 2FN y 3FN — Jesús Domínguez Gutú](https://www.youtube.com/watch?v=QUWrKd9vK28)

**Tema exacto:** normalización mediante primera, segunda y tercera forma normal.  
**Momento recomendado:** antes de revisar el diseño de la clínica.  
**Objetivo:** reconocer redundancia, dependencias y separación correcta de tablas.

Los videos complementan la práctica. El dominio se demuestra diseñando, implementando y probando las restricciones.

---

# 20. Documentación y recursos de lectura

## Nivel esencial

- [Claves foráneas en SQLite — documentación oficial](https://sqlite.org/foreignkeys.html)
- [`CREATE TABLE` y restricciones — documentación oficial de SQLite](https://sqlite.org/lang_createtable.html)
- [Tipos y afinidad en SQLite — documentación oficial](https://sqlite.org/datatype3.html)

## Cambios del esquema

- [`ALTER TABLE` — documentación oficial de SQLite](https://sqlite.org/lang_altertable.html)
- [`DROP TABLE` — documentación oficial de SQLite](https://sqlite.org/lang_droptable.html)

## Ampliación opcional

- [Tablas `STRICT` — documentación oficial de SQLite](https://sqlite.org/stricttables.html)
- [Modelo entidad-relación: elementos y ejemplo — iLERNA](https://www.ilerna.es/blog/modelo-entidad-relacion-base-datos)
- [diagrams.net — herramienta gratuita de diagramación](https://app.diagrams.net/)

No necesitas memorizar la sintaxis completa de la documentación. Busca la restricción que estás implementando, revisa un ejemplo mínimo y comprueba su comportamiento en una base de práctica.

---

# 21. Glosario

| Término | Significado |
|---|---|
| Acción referencial | Comportamiento definido cuando cambia o se elimina una fila referenciada |
| Anomalía | Problema de inserción, actualización o eliminación provocado por un diseño deficiente |
| Atributo | Propiedad de una entidad; suele convertirse en columna |
| Cardinalidad | Cantidad de ocurrencias que pueden relacionarse |
| Clave candidata | Columna o conjunto que podría identificar cada fila |
| Clave compuesta | Clave formada por más de una columna |
| Clave foránea | Columna que referencia una clave de otra tabla |
| Clave natural | Identificador que ya existe en el dominio real |
| Clave primaria | Identificador elegido para distinguir cada fila |
| Clave sustituta | Identificador creado para uso interno del sistema |
| `CHECK` | Restricción que valida una condición |
| `DEFAULT` | Valor utilizado cuando una inserción omite una columna |
| Diccionario de datos | Documento que explica columnas, tipos, reglas y significado |
| Entidad | Elemento relevante sobre el que se conserva información |
| Integridad referencial | Garantía de que las referencias entre tablas son válidas |
| Modelo conceptual | Representación de entidades y relaciones del problema |
| Modelo físico | Implementación concreta en un motor de base de datos |
| Modelo lógico | Conversión de conceptos en tablas, columnas y claves |
| Normalización | Proceso de organizar tablas para reducir redundancia y anomalías |
| `NOT NULL` | Restricción que impide ausencia de valor |
| Opcionalidad | Indica si una relación o atributo puede estar ausente |
| Regla de negocio | Condición que el sistema debe respetar |
| Tabla hija | Tabla que contiene la clave foránea |
| Tabla intermedia | Tabla que resuelve una relación muchos a muchos |
| Tabla padre | Tabla cuya clave es referenciada |
| `UNIQUE` | Restricción que impide duplicados |

---

# 22. Resumen del módulo

Diseñar una base de datos comienza por comprender el problema. Las entidades representan elementos importantes, los atributos describen sus propiedades y las reglas de negocio determinan qué estructuras y restricciones son necesarias.

```text
Requisitos
   ↓
Entidades y atributos
   ↓
Claves y relaciones
   ↓
Normalización
   ↓
CREATE TABLE y restricciones
   ↓
Pruebas válidas e inválidas
```

Las claves primarias identifican filas. Las claves foráneas conectan tablas y protegen la existencia de las referencias. Las relaciones pueden ser uno a uno, uno a muchos o muchos a muchos; estas últimas necesitan una tabla intermedia.

Las restricciones permiten que la base proteja reglas:

```sql
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
CHECK
DEFAULT
```

En SQLite debes activar las claves foráneas en cada conexión:

```sql
PRAGMA foreign_keys = ON;
```

La normalización práctica evita listas dentro de celdas, dependencias parciales y datos descriptivos repetidos que pertenecen a otras entidades.

## Habilidades obtenidas

Ahora puedes:

- Analizar requisitos antes de crear tablas.
- Dibujar un diagrama entidad-relación.
- Elegir claves primarias y naturales.
- Implementar relaciones mediante claves foráneas.
- Resolver relaciones muchos a muchos.
- Aplicar restricciones de integridad.
- Elegir acciones referenciales.
- Detectar anomalías y normalizar hasta 3FN.
- Documentar el modelo mediante un diccionario de datos.
- Probar que la base acepta casos válidos y rechaza casos inválidos.
- Reconocer particularidades de SQLite y conceptos transferibles.

## Antes de continuar

Comprueba que puedes explicar y demostrar:

- Por qué no se debe comenzar creando tablas sin analizar requisitos.
- Qué diferencia existe entre entidad y atributo.
- Qué diferencia existe entre clave primaria y clave foránea.
- Dónde se coloca la clave foránea en una relación 1:N.
- Cómo se resuelve una relación N:M.
- Qué ocurre si SQLite no tiene las claves foráneas activas.
- Cuándo utilizar `RESTRICT`, `CASCADE` o `SET NULL`.
- Qué problemas corrigen 1FN, 2FN y 3FN.
- Cómo comprobar que no existen referencias inválidas.
- Cómo reconstruir el proyecto completo desde el script.

No continúes con el Módulo 3 hasta que el proyecto de la clínica haya sido aprobado. El siguiente módulo utilizará estas estructuras para insertar, actualizar y eliminar información mediante procedimientos seguros y transacciones.
