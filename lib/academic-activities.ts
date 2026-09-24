export type ActivityType =
  | 'exercise'
  | 'assignment'
  | 'challenge'
  | 'mini_project'
  | 'project'
  | 'final_project'

export type RubricCriterion = {
  label: string
  description?: string
  maxPoints: number
  displayOrder: number
}

export type ActivityRubric = {
  origin: 'existing' | 'new'
  originalMaxPoints: number
  normalizedMaxPoints: 100
  criteria: RubricCriterion[]
  source?: string
}

export type AcademicActivity = {
  id: string
  courseSlug: string
  moduleNumber: number
  moduleId: string
  visibleName: string
  activityType: ActivityType
  required: boolean
  displayOrder: number
  instructions: string
  deliverables: string[]
  legacySubmissionUrl?: string
  status: 'active'
  rubric: ActivityRubric
}

const FORM_GENERAL = 'https://forms.gle/nTx97JRkFkbH5Vfr6'
const FORM_PROJECTS = 'https://forms.gle/BayPBDiXAGurWjnL6'

function criteria(entries: Array<[string, number, string?]>): RubricCriterion[] {
  return entries.map(([label, maxPoints, description], index) => ({
    label,
    maxPoints,
    description,
    displayOrder: index + 1,
  }))
}

function fresh(entries: Array<[string, number, string?]>): ActivityRubric {
  return { origin: 'new', originalMaxPoints: 100, normalizedMaxPoints: 100, criteria: criteria(entries) }
}

function existing(originalMaxPoints: number, source: string): ActivityRubric {
  return { origin: 'existing', originalMaxPoints, normalizedMaxPoints: 100, criteria: [], source }
}

type ActivityInput = Omit<AcademicActivity, 'moduleId' | 'required' | 'status'>

function activity(input: ActivityInput): AcademicActivity {
  const modulePrefix = {
    'logica-de-programacion': 'logica-programacion',
    'desarrollo-web-django': 'django',
    'programacion-con-ia': 'programacion-ia',
  }[input.courseSlug] ?? input.courseSlug
  return {
    ...input,
    moduleId: `${modulePrefix}-modulo-${input.moduleNumber}`,
    required: true,
    status: 'active',
  }
}

const logicNewRubrics = {
  m1a: fresh([['Ejercicio 1 — Problema o síntoma', 20], ['Ejercicio 2 — Hechos, suposiciones e información faltante', 25], ['Ejercicio 3 — Ordenar una secuencia', 25], ['Ejercicio 4 — El robot literal', 30]]),
  m1b: fresh([['Ejercicio 5 — Entrada, proceso y salida', 15], ['Ejercicio 6 — Descomposición', 15], ['Ejercicio 7 — Tres representaciones', 20], ['Reto 1 — La instrucción peligrosa', 25], ['Reto 2 — Dos algoritmos, un objetivo', 25]]),
  m2: fresh([['Ejercicios 1–3', 25], ['Ejercicios 4–5', 25], ['Ejercicios 6–7', 20], ['Reto 1 — Intercambiar dos valores', 15], ['Reto 2 — Descubrir el valor inicial', 15]]),
  m3: fresh([['Ejercicios 1–3', 25], ['Ejercicios 4–5', 20], ['Ejercicios 6–7', 25], ['Reto 1 — La condición que casi siempre acepta', 15], ['Reto 2 — Dos diseños para la misma regla', 15]]),
  m4: fresh([['Ejercicios 1–3', 25], ['Ejercicios 4–5', 25], ['Ejercicios 6–7', 20], ['Reto 1 — Laboratorio de ciclos infinitos', 15], ['Reto 2 — Misma meta, dos formas', 15]]),
  m5: fresh([['Ejercicios 1–2 — Requisitos y fronteras', 20], ['Ejercicios 3–4 — Diferencias y caminos', 25], ['Ejercicios 5–7 — Corrección y regresión', 25], ['Reto 1 — Requisito imposible de probar', 15], ['Reto 2 — El menor conjunto que revela todos los errores', 15]]),
}

const webMiniRubrics = [
  fresh([['Estructura semántica HTML', 20], ['Diseño visual y organización CSS', 20], ['Adaptación a 320, 768 y 1024 px', 25], ['Cumplimiento del contenido solicitado', 15], ['Calidad y orden de los archivos', 10], ['Evidencias y verificación final', 10]]),
  fresh([['Estructura semántica y accesible', 20], ['Apertura y cierre de preguntas', 25], ['Delegación de eventos', 20], ['Navegación mediante teclado', 15], ['Presentación responsive', 10], ['Capturas y explicación técnica', 10]]),
  fresh([['Componentes y responsabilidades', 20], ['Estado y flujo de datos', 25], ['Selección y presentación de cursos', 20], ['Comportamiento responsive', 15], ['Claridad del código', 10], ['Árbol de componentes y explicación', 10]]),
  fresh([['Rutas de índice y detalle', 20], ['Ruta dinámica y manejo 404', 20], ['Componentes de servidor correctamente elegidos', 20], ['Navegación y estructura visual', 15], ['Adaptación responsive', 10], ['Mapa, capturas y explicación', 15]]),
  fresh([['Diagnóstico basado en evidencia', 20], ['Identificación de la causa', 20], ['Corrección funcional y acotada', 25], ['Pruebas antes y después', 20], ['Documentación del uso de IA', 10], ['Organización de la entrega', 5]]),
]

const pythonAssignmentRubrics = [
  fresh([['Limpieza controlada de contactos', 40], ['Refactorizar una solución manual', 35], ['Elegir la herramienta adecuada', 25]]),
  fresh([['Reparar una combinación peligrosa', 35], ['Refactorizar transformaciones', 35], ['Comparar tres estilos', 30]]),
  fresh([['Refactorizar un conteo y una agrupación', 35], ['Corregir una cola que invierte urgentes', 35], ['Diagnosticar groupby()', 30]]),
  fresh([['Comparar tres formas de lectura', 30], ['Diagnosticar un CSV problemático', 35], ['Plan de operación segura', 35]]),
  fresh([['Contratos de fecha', 15], ['Clasificador de vencimientos', 20], ['Comparaciones numéricas', 15], ['Informe estadístico responsable', 20], ['Aleatoriedad con intención', 15], ['Política monetaria', 15]]),
  fresh([['Auditoría de manejadores', 15], ['Diseñar una excepción de dominio', 15], ['Modularizar sin copiar', 15], ['Punto de entrada seguro', 15], ['Ayuda de terminal profesional', 15], ['Plan de registros', 15], ['Leer antes de utilizar', 10]]),
]

const sqlMiniRubrics = [
  fresh([['Diseño de la tabla y tipos', 25], ['Restricciones y manejo de NULL', 20], ['Inserciones válidas', 20], ['Consultas solicitadas', 20], ['Orden, claridad y ejecución del script', 15]]),
  fresh([['Identificación de entidades', 20], ['Claves primarias y foráneas', 20], ['Cardinalidades y relaciones', 25], ['Integridad y restricciones', 20], ['Diagrama y documentación', 15]]),
  fresh([['Operaciones CRUD correctas', 20], ['Uso seguro de transacciones', 25], ['Confirmación y reversión', 20], ['Casos inválidos y recuperación', 20], ['Evidencias y explicación', 15]]),
  fresh([['Filtros y ordenación', 20], ['Cálculos y funciones SQL', 25], ['Agrupaciones y agregados', 25], ['Presentación e interpretación de resultados', 15], ['Evidencias de ejecución', 15]]),
  fresh([['Relaciones y uniones correctas', 25], ['Conservación de registros sin coincidencia', 20], ['Agregaciones y subconsultas', 20], ['CTE o construcción por etapas', 20], ['Evidencias y explicación', 15]]),
  fresh([['Vista solicitada', 20], ['Auditoría de índices existentes', 20], ['Índice propuesto y justificación', 20], ['Comparación de planes de ejecución', 20], ['Restricciones, evidencia y conclusiones', 20]]),
]

const djangoMiniRubrics = [
  fresh([['Rutas y navegación', 20], ['Vistas y contexto', 20], ['Templates y presentación', 20], ['Parámetros dinámicos y 404', 15], ['Organización del proyecto', 15], ['Evidencias y ejecución', 10]]),
  fresh([['Herencia de templates', 20], ['Componentes reutilizables', 20], ['Presentación de datos y estados', 20], ['Diseño responsive', 20], ['Accesibilidad básica', 10], ['Evidencias', 10]]),
  fresh([['Modelos y relaciones', 25], ['Migraciones correctas', 15], ['Django Admin funcional', 20], ['Consultas y filtros', 15], ['Integridad de datos', 15], ['Evidencias', 10]]),
  fresh([['Formularios y validaciones', 25], ['CRUD completo', 25], ['Búsqueda, filtros y paginación', 15], ['Manejo accesible de errores', 15], ['Interfaz y usabilidad', 10], ['Evidencias y pruebas', 10]]),
  fresh([['Autenticación', 20], ['Autorización y roles', 25], ['Protección en servidor', 20], ['Propiedad de registros', 15], ['Pruebas negativas de permisos', 10], ['Evidencias y explicación', 10]]),
  fresh([['Reportes y filtros', 20], ['Exportación CSV', 15], ['Exportación Excel', 15], ['Servicios y separación de responsabilidades', 15], ['Consultas y rendimiento', 15], ['Pruebas', 10], ['Evidencias y documentación', 10]]),
  fresh([['Definición del flujo crítico', 15], ['Modelo e integridad mínima', 15], ['Roles y permisos', 15], ['Ejecución del flujo principal', 25], ['Manejo de cancelación/error', 15], ['Pruebas y evidencia', 10], ['Explicación técnica', 5]]),
]

const aiModuleFourRubrics = {
  exercises: fresh([['Ejercicios 1–2 — Síntoma, causa y reproducción', 25], ['Ejercicios 3–4 — Sanitización y reducción', 25], ['Ejercicios 5–6 — Trazas y APIs inventadas', 25], ['Ejercicios 7–8 — Manejo de errores y regresión', 25]]),
  mini: fresh([['Resolución de los cinco incidentes', 50], ['Separación de síntoma, hipótesis y causa', 15], ['Reproducciones mínimas', 10], ['Pruebas y evidencia', 15], ['Claridad del informe por incidente', 10]]),
}

const result: AcademicActivity[] = []
const add = (input: ActivityInput) => result.push(activity(input))

// Lógica de Programación: 12.
add({ id: 'logica-m1-ejercicios-1-4', courseSlug: 'logica-de-programacion', moduleNumber: 1, visibleName: 'Ejercicios 1–4 — Problemas, algoritmos y secuencias', activityType: 'exercise', displayOrder: 1, instructions: 'Resuelve y reúne los ejercicios 1, 2, 3 y 4 conservando sus enunciados originales.', deliverables: ['Respuestas completas de los ejercicios 1–4', 'Archivo identificado con nombre, curso y módulo'], legacySubmissionUrl: FORM_GENERAL, rubric: logicNewRubrics.m1a })
add({ id: 'logica-m1-ejercicios-5-7-retos', courseSlug: 'logica-de-programacion', moduleNumber: 1, visibleName: 'Ejercicios 5–7 y retos — Representación y precisión de algoritmos', activityType: 'challenge', displayOrder: 2, instructions: 'Reúne los ejercicios 5–7 y los dos retos del módulo.', deliverables: ['Ejercicios 5, 6 y 7', 'Reto 1 y Reto 2', 'Representaciones y explicaciones solicitadas'], legacySubmissionUrl: FORM_GENERAL, rubric: logicNewRubrics.m1b })
add({ id: 'logica-m1-mini-proyecto-robot-domestico', courseSlug: 'logica-de-programacion', moduleNumber: 1, visibleName: 'Mini proyecto — Instrucciones para un robot doméstico', activityType: 'mini_project', displayOrder: 3, instructions: 'Entrega el mini proyecto con EPS, algoritmo, pseudocódigo, diagrama, prueba manual y mejora.', deliverables: ['Las ocho partes del mini proyecto', 'Prueba manual y reflexión'], legacySubmissionUrl: FORM_GENERAL, rubric: existing(100, 'app/cursos/logica-de-programacion/curso/page.tsx#rubrica-mini-proyecto') })

const logicModules = [
  ['Datos, variables y operaciones', 'Mini proyecto — Calculadora de compra en papel'],
  ['Lógica y toma de decisiones', 'Mini proyecto — Sistema de decisiones para una actividad'],
  ['Repeticiones y control de ciclos', 'Mini proyecto — Plan de ahorro hasta alcanzar una meta'],
  ['Pruebas, diagnóstico y corrección de algoritmos', 'Mini proyecto — Clínica de algoritmos: venta de entradas'],
] as const
logicModules.forEach(([topic, project], index) => {
  const moduleNumber = index + 2
  add({ id: `logica-m${moduleNumber}-ejercicios-retos`, courseSlug: 'logica-de-programacion', moduleNumber, visibleName: `Ejercicios y retos — ${topic}`, activityType: 'exercise', displayOrder: 1, instructions: 'Entrega juntos los ejercicios y retos obligatorios de este módulo.', deliverables: ['Siete ejercicios completos', 'Dos retos completos', 'Procedimiento y reflexión cuando se soliciten'], legacySubmissionUrl: FORM_PROJECTS, rubric: [logicNewRubrics.m2, logicNewRubrics.m3, logicNewRubrics.m4, logicNewRubrics.m5][index] })
  add({ id: `logica-m${moduleNumber}-mini-proyecto`, courseSlug: 'logica-de-programacion', moduleNumber, visibleName: project, activityType: 'mini_project', displayOrder: 2, instructions: 'Conserva todas las instrucciones, entregables y comprobaciones del mini proyecto.', deliverables: ['Producto completo del mini proyecto', 'Evidencias y reflexión solicitadas'], legacySubmissionUrl: FORM_PROJECTS, rubric: existing(100, `content/modulo-${moduleNumber}.md#rubrica-del-mini-proyecto`) })
})
add({ id: 'logica-m6-proyecto-final-cafeteria', courseSlug: 'logica-de-programacion', moduleNumber: 6, visibleName: 'Proyecto final — Sistema de pedidos para una cafetería', activityType: 'final_project', displayOrder: 1, instructions: 'Entrega el proyecto final completo siguiendo sus requisitos originales.', deliverables: ['Proyecto completo', 'Pseudocódigo, diagrama, pruebas y reflexión'], legacySubmissionUrl: FORM_PROJECTS, rubric: existing(100, 'content/modulo-6.md#rubrica-del-proyecto-final') })

// Desarrollo Web Moderno: 11.
const webNames = [
  ['Mini proyecto — Tarjeta profesional de un curso', 'Proyecto del módulo — Landing page profesional de un curso COA'],
  ['Mini proyecto — Preguntas frecuentes accesibles', 'Proyecto del módulo — Explorador interactivo de cursos COA'],
  ['Mini proyecto — Selector de cursos', 'Proyecto del módulo — Explorador de cursos COA en React'],
  ['Mini proyecto — Directorio de recursos', 'Proyecto del módulo — Portal COA en Next.js'],
  ['Mini proyecto — Rescate de un selector defectuoso', 'Proyecto del módulo — Sprint profesional asistido por IA para COA'],
] as const
webNames.forEach(([mini, project], index) => {
  const moduleNumber = index + 1
  add({ id: `desarrollo-web-m${moduleNumber}-mini-proyecto`, courseSlug: 'desarrollo-web-moderno', moduleNumber, visibleName: mini, activityType: 'mini_project', displayOrder: 1, instructions: 'Completa el mini proyecto y reúne los archivos y evidencias indicados en el módulo.', deliverables: ['Producto del mini proyecto', 'Archivos, capturas y explicación solicitados'], legacySubmissionUrl: FORM_PROJECTS, rubric: webMiniRubrics[index] })
  add({ id: `desarrollo-web-m${moduleNumber}-proyecto`, courseSlug: 'desarrollo-web-moderno', moduleNumber, visibleName: project, activityType: 'project', displayOrder: 2, instructions: 'Conserva los requisitos, pruebas y documentación originales del proyecto.', deliverables: ['Proyecto completo', 'Repositorio o archivos', 'Pruebas, evidencias y reflexión'], legacySubmissionUrl: FORM_PROJECTS, rubric: existing(100, `content/desarrollo-web-moderno-modulo-${moduleNumber}.md#rubrica-de-evaluacion`) })
})
add({ id: 'desarrollo-web-m6-proyecto-final-integrador', courseSlug: 'desarrollo-web-moderno', moduleNumber: 6, visibleName: 'Proyecto Final Integrador', activityType: 'final_project', displayOrder: 1, instructions: 'Entrega el proyecto final, sus enlaces, documentación, pruebas y reflexión.', deliverables: ['Proyecto publicado y repositorio', 'Documentación y evidencias', 'Pruebas y reflexión final'], legacySubmissionUrl: FORM_PROJECTS, rubric: existing(100, 'content/desarrollo-web-moderno-modulo-6.md#rubrica-del-proyecto-final') })

// Python Práctico: 12.
const pythonTopics = ['Limpieza, refactorización y selección de herramientas de texto', 'Combinación, transformación y comparación de iteraciones', 'Conteos, agrupaciones y colas por prioridad', 'Lectura, diagnóstico y operaciones seguras con archivos', 'Fechas, estadísticas, aleatoriedad y política monetaria', 'Excepciones, modularización, CLI y registros']
const pythonProjects = ['Normalizador y auditor de registros', 'Analizador de inventario y pedidos', 'Centro de análisis y cola de atención', 'Gestor local de catálogo y respaldos', 'Planificador de vencimientos y reporte de métricas', 'COA Toolkit']
pythonTopics.forEach((topic, index) => {
  const moduleNumber = index + 1
  add({ id: `python-practico-m${moduleNumber}-actividades-obligatorias`, courseSlug: 'python-practico', moduleNumber, visibleName: `Actividades obligatorias — ${topic}`, activityType: 'assignment', displayOrder: 1, instructions: 'Incluye todas las actividades enumeradas en la sección “Actividades obligatorias”; conserva sus enunciados completos.', deliverables: pythonAssignmentRubrics[index].criteria.map((item) => item.label), legacySubmissionUrl: FORM_GENERAL, rubric: pythonAssignmentRubrics[index] })
  add({ id: `python-practico-m${moduleNumber}-proyecto`, courseSlug: 'python-practico', moduleNumber, visibleName: `Proyecto del módulo — ${pythonProjects[index]}`, activityType: 'project', displayOrder: 2, instructions: 'Entrega el proyecto completo, sus pruebas, documentación y reflexión.', deliverables: ['Código fuente del proyecto', 'README y plan de pruebas', 'Evidencias y reflexión'], legacySubmissionUrl: FORM_GENERAL, rubric: existing(100, `content/python-practico-modulo-${moduleNumber}.md#rubrica-del-proyecto`) })
})

// SQL: 12.
const sqlMinis = ['Agenda de contactos personales', 'Estructura organizacional de una empresa', 'Caja diaria de una cafetería', 'Estadísticas de un torneo', 'Gestión de un festival y sus entradas', 'Auditoría de una empresa de mensajería']
const sqlProjects = ['Catálogo digital de una biblioteca', 'Sistema de gestión para una clínica', 'Sistema de inventario y movimientos', 'Análisis de operaciones de una tienda', 'Sistema de reportes académicos', 'Sistema de gestión de un hotel']
sqlMinis.forEach((mini, index) => {
  const moduleNumber = index + 1
  add({ id: `sql-m${moduleNumber}-mini-proyecto`, courseSlug: 'sql-bases-datos', moduleNumber, visibleName: `Mini proyecto — ${mini}`, activityType: 'mini_project', displayOrder: 1, instructions: 'Entrega el mini proyecto con el script, base de datos, evidencias y explicación solicitados.', deliverables: ['Script SQL', 'Base de datos o diagrama según corresponda', 'Evidencias y explicación'], legacySubmissionUrl: FORM_GENERAL, rubric: sqlMiniRubrics[index] })
  add({ id: `sql-m${moduleNumber}-${moduleNumber === 6 ? 'proyecto-final' : 'proyecto'}`, courseSlug: 'sql-bases-datos', moduleNumber, visibleName: `${moduleNumber === 6 ? 'Proyecto final integrador' : 'Proyecto del módulo'} — ${sqlProjects[index]}`, activityType: moduleNumber === 6 ? 'final_project' : 'project', displayOrder: 2, instructions: 'Conserva todos los requisitos, pruebas y evidencias del proyecto original.', deliverables: ['Proyecto SQL completo', 'Base de datos', 'Informe y evidencias'], legacySubmissionUrl: FORM_GENERAL, rubric: existing(100, `content/sql-bases-datos-modulo-${moduleNumber}.md#rubrica-del-proyecto`) })
})

// Django: 14.
const djangoMinis = ['Directorio Dinámico de Servicios', 'Catálogo Visual Responsive', 'Biblioteca Administrable', 'Agenda Profesional de Clientes', 'Portal Privado por Roles', 'Centro de Reportes Empresariales', 'Prototipo del flujo crítico']
const djangoProjects = ['Portal de Operaciones COA', 'Sitio Empresarial Reutilizable', 'Núcleo de Inventario Empresarial', 'Gestor Web de Clientes y Productos', 'Sistema Seguro de Ventas e Inventario', 'Versión Candidata del Sistema Empresarial', 'COA Gestión Empresarial Web']
djangoMinis.forEach((mini, index) => {
  const moduleNumber = index + 1
  add({ id: `django-m${moduleNumber}-mini-proyecto`, courseSlug: 'desarrollo-web-django', moduleNumber, visibleName: `Mini proyecto${moduleNumber === 7 ? ' obligatorio' : ''} — ${mini}`, activityType: 'mini_project', displayOrder: 1, instructions: 'Completa el mini proyecto conforme a sus requisitos originales y aporta las evidencias indicadas.', deliverables: ['Mini proyecto funcional', 'Código y evidencias', 'Explicación técnica'], legacySubmissionUrl: FORM_GENERAL, rubric: djangoMiniRubrics[index] })
  add({ id: `django-m${moduleNumber}-${moduleNumber === 7 ? 'proyecto-final' : 'proyecto'}`, courseSlug: 'desarrollo-web-django', moduleNumber, visibleName: `${moduleNumber === 7 ? 'Proyecto Final' : 'Proyecto del módulo'} — ${djangoProjects[index]}`, activityType: moduleNumber === 7 ? 'final_project' : 'project', displayOrder: 2, instructions: 'Entrega el proyecto completo conservando requisitos, condiciones críticas y evidencias.', deliverables: ['Aplicación completa', 'Pruebas y documentación', 'Evidencias y defensa cuando corresponda'], legacySubmissionUrl: FORM_GENERAL, rubric: existing(moduleNumber === 7 ? 100 : 50, `content/django-modulo-${moduleNumber}.md#rubrica-del-proyecto`) })
})

// Programación Asistida por IA: 12, solamente módulos 1–4.
const aiMinis = ['Comparador de soluciones asistidas', 'Biblioteca personal de prompts técnicos', 'Intérprete técnico de código desconocido', 'Laboratorio de diagnóstico']
const aiProjects = ['Validador de pedidos y descuentos', 'Cotizador de servicios construido mediante conversación estructurada', 'Gestor de solicitudes de soporte', 'Rescate de una aplicación defectuosa']
const aiTopics = ['Fundamentos del desarrollo asistido por IA', 'Prompts y conversaciones técnicas', 'Construcción y modificación de software con IA', 'Depuración, diagnóstico y validación']
aiTopics.forEach((topic, index) => {
  const moduleNumber = index + 1
  add({ id: `programacion-ia-m${moduleNumber}-ejercicios-obligatorios`, courseSlug: 'programacion-con-ia', moduleNumber, visibleName: `Ejercicios individuales obligatorios — ${topic}`, activityType: 'exercise', displayOrder: 1, instructions: 'Entrega todos los ejercicios obligatorios del módulo y conserva sus enunciados y evidencias.', deliverables: ['Todos los ejercicios obligatorios', 'Razonamiento y evidencias solicitadas'], legacySubmissionUrl: FORM_GENERAL, rubric: moduleNumber === 4 ? aiModuleFourRubrics.exercises : existing(15, `content/programacion-ia-modulo-${moduleNumber}.md#rubrica-de-los-ejercicios`) })
  add({ id: `programacion-ia-m${moduleNumber}-mini-proyecto`, courseSlug: 'programacion-con-ia', moduleNumber, visibleName: `Mini proyecto — ${aiMinis[index]}`, activityType: 'mini_project', displayOrder: 2, instructions: 'Completa el mini proyecto con archivos, comparación, pruebas y conclusión.', deliverables: ['Producto del mini proyecto', 'Evidencias y conclusión'], legacySubmissionUrl: FORM_GENERAL, rubric: moduleNumber === 4 ? aiModuleFourRubrics.mini : existing(20, `content/programacion-ia-modulo-${moduleNumber}.md#rubrica-del-mini-proyecto`) })
  add({ id: `programacion-ia-m${moduleNumber}-proyecto`, courseSlug: 'programacion-con-ia', moduleNumber, visibleName: `Proyecto del módulo — ${aiProjects[index]}`, activityType: 'project', displayOrder: 3, instructions: 'Entrega el proyecto principal, la evaluación práctica y las evidencias de validación indicadas.', deliverables: ['Proyecto principal', 'Pruebas y bitácora de IA', 'Evaluación práctica y evidencias'], legacySubmissionUrl: FORM_GENERAL, rubric: existing(50, `content/programacion-ia-modulo-${moduleNumber}.md#rubrica-del-proyecto`) })
})

export const academicActivities = result

export function getModuleActivities(moduleId: string) {
  return academicActivities
    .filter((item) => item.moduleId === moduleId)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

export function normalizeRubricScore(pointsEarned: number, rubric: ActivityRubric) {
  if (!Number.isFinite(pointsEarned) || rubric.originalMaxPoints <= 0) return 0
  const bounded = Math.min(Math.max(pointsEarned, 0), rubric.originalMaxPoints)
  return Math.round((bounded / rubric.originalMaxPoints) * rubric.normalizedMaxPoints * 100) / 100
}
