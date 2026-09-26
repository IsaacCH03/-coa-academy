import { createWhatsAppLink } from './site'

export type Course = {
  slug: string
  title: string
  category: string
  level: string
  duration: string
  lessons: number
  modality?: string
  price: string
  billing?: string | null
  image: string
  short: string
  detailShort?: string
  description: string
  learn: string[]
  modules: { title: string; detail: string }[]
  instructor: string
  seoTitle?: string
  seoDescription?: string
  whatsappMessage?: string
  ctaLabel?: string
  ctaHref?: string
  comingSoon?: boolean
}

export const courses: Course[] = [
  {
    slug: 'python-nivel-1',
    title: 'Python Nivel 1',
    category: 'Programación',
    level: 'Básico',
    duration: '8 semanas',
    lessons: 8,
    price: '₡10.000',
    billing: 'por mes',
    image: '/courses/python-nivel-1.svg',
    short:
      'Aprende programación desde cero con Python mediante explicaciones claras, ejercicios prácticos y un proyecto final.',
    detailShort:
      'Aprende los fundamentos de la programación con Python y desarrolla la lógica necesaria para crear tus primeros programas.',
    description:
      'Python Nivel 1 es un curso diseñado para personas que desean comenzar a programar desde cero. Durante ocho semanas aprenderás a utilizar variables, tipos de datos, condicionales, ciclos, listas y funciones mediante explicaciones claras y ejercicios prácticos. Al finalizar, desarrollarás un proyecto integrador en el que aplicarás los conocimientos adquiridos.',
    learn: [
      'Comprender los fundamentos de la programación y escribir tus primeros programas en Python.',
      'Utilizar variables, tipos de datos, operadores, entradas y salidas de información.',
      'Controlar el flujo de un programa mediante condicionales, ciclos y estructuras de datos.',
      'Crear funciones y desarrollar un proyecto final aplicando los conocimientos del curso.',
    ],
    modules: [
      {
        title: 'Fundamentos de Python',
        detail:
          'Variables, tipos de datos, entrada y salida, operadores, cadenas de texto y condicionales.',
      },
      {
        title: 'Control del flujo',
        detail:
          'Ciclos while y for, range, break y combinación de condiciones para controlar la ejecución del programa.',
      },
      {
        title: 'Listas y funciones',
        detail:
          'Creación y recorrido de listas, uso de append, condicionales dentro de ciclos, funciones, parámetros y retorno.',
      },
      {
        title: 'Proyecto final',
        detail:
          'Desarrollo de un proyecto integrador e introducción básica a la programación orientada a objetos.',
      },
    ],
    instructor: 'Evelio Chevez',
    seoTitle: 'Python Nivel 1 | C.O.A.',
    seoDescription:
      'Curso de Python desde cero con clases prácticas, ejercicios y proyecto final. Duración de ocho semanas.',
    whatsappMessage:
      'Hola, me interesa inscribirme en el curso Python Nivel 1 de C.O.A. Quisiera recibir más información.',
  },
  {
    slug: 'logica-de-programacion',
    title: 'Lógica de Programación',
    category: 'Programación',
    level: 'Nivel básico',
    duration: '16 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: 'Gratis',
    billing: null,
    image: '/courses/logica-programacion.svg',
    short:
      'Aprende a pensar como un programador mediante algoritmos, diagramas de flujo, pseudocódigo y resolución de problemas. Construye una base sólida antes de aprender cualquier lenguaje de programación.',
    detailShort:
      'Desarrolla las bases del pensamiento computacional y prepárate para aprender cualquier lenguaje de programación.',
    description:
      'Este curso de Lógica de Programación enseña las bases del pensamiento computacional mediante la resolución ordenada de problemas. Aprenderás a representar soluciones con algoritmos, diagramas de flujo y pseudocódigo, además de comprender variables y conceptos fundamentales. Al finalizar, tendrás una base sólida de lógica aplicada que te preparará para aprender cualquier lenguaje de programación.',
    learn: [
      'Pensamiento computacional',
      'Resolución de problemas',
      'Algoritmos',
      'Diagramas de flujo',
      'Pseudocódigo',
      'Variables y conceptos fundamentales',
      'Lógica aplicada',
      'Preparación para aprender cualquier lenguaje',
    ],
    modules: [
      {
        title: 'Pensar como un programador',
        detail:
          'Comprender problemas, algoritmos y la secuencia lógica de instrucciones.',
      },
      {
        title: 'Datos, variables y operaciones',
        detail:
          'Aprender cómo un algoritmo recibe, almacena y transforma información.',
      },
      {
        title: 'Lógica y toma de decisiones',
        detail:
          'Construir algoritmos utilizando condiciones y operadores lógicos.',
      },
      {
        title: 'Repeticiones',
        detail:
          'Diseñar soluciones que ejecuten tareas repetitivas de forma eficiente.',
      },
      {
        title: 'Construir, probar y corregir algoritmos',
        detail:
          'Aprender a detectar errores, realizar pruebas y mejorar soluciones.',
      },
      {
        title: 'Proyecto final integrador',
        detail:
          'Aplicar todos los conceptos del curso en un proyecto completo.',
      },
    ],
    instructor: 'Evelio Chevez Powell',
    seoTitle: 'Lógica de Programación | C.O.A.',
    seoDescription:
      'Curso gratuito y autodidacta para aprender pensamiento computacional, algoritmos, diagramas de flujo y pseudocódigo.',
    ctaLabel: 'Entrar al curso',
    ctaHref: '/cursos/logica-de-programacion/inscripcion',
  },
  {
    slug: 'desarrollo-web-moderno',
    title:
      'Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial',
    category: 'Programación',
    level: 'Básico–intermedio',
    duration: '40 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: 'Gratis',
    billing: null,
    image: '/courses/desarrollo-web-moderno.png',
    short:
      'Construye aplicaciones web modernas con HTML, CSS, JavaScript, React, Next.js e Inteligencia Artificial mediante proyectos reales.',
    detailShort:
      'Aprende desarrollo web moderno mediante proyectos prácticos y crea aplicaciones con React, Next.js, Tailwind CSS e Inteligencia Artificial.',
    description:
      'Este curso desarrolla una base práctica para construir aplicaciones web modernas. Aprenderá HTML5, CSS3, JavaScript ES6+, React, Next.js y Tailwind CSS, además de organizar proyectos con Git y GitHub, publicarlos en Vercel y utilizar herramientas de Inteligencia Artificial de manera responsable para planificar, explicar, depurar y revisar código.',
    learn: [
      'Construir interfaces web semánticas, accesibles y adaptables.',
      'Agregar interactividad con JavaScript moderno y desarrollar interfaces componentizadas con React.',
      'Crear aplicaciones multipágina con Next.js, App Router y Tailwind CSS.',
      'Organizar proyectos con Git y GitHub y desplegarlos en Vercel.',
      'Utilizar Inteligencia Artificial para planificar, explicar, depurar y revisar código.',
      'Comprender, modificar, probar y corregir el código antes de integrarlo.',
    ],
    modules: [
      {
        title: 'Interfaces web profesionales con HTML y CSS',
        detail:
          'HTML5 semántico, CSS3, accesibilidad, Flexbox, Grid, diseño responsive, Git y GitHub.',
      },
      {
        title: 'JavaScript moderno aplicado al navegador',
        detail:
          'JavaScript ES6+, DOM, eventos, formularios, Fetch API, estados y almacenamiento local.',
      },
      {
        title: 'Interfaces componentizadas con React',
        detail:
          'JSX, componentes, props, estado, formularios controlados, efectos y persistencia.',
      },
      {
        title: 'Aplicaciones modernas con Next.js y Tailwind CSS',
        detail:
          'App Router, rutas dinámicas, componentes de servidor y cliente, Tailwind CSS y despliegue en Vercel.',
      },
      {
        title: 'Desarrollo profesional asistido por Inteligencia Artificial',
        detail:
          'Planificación, generación controlada, depuración, refactorización y revisión responsable con IA.',
      },
      {
        title: 'Proyecto Final Integrador',
        detail:
          'Desarrollo, documentación, comprobación y publicación de una aplicación educativa moderna.',
      },
    ],
    instructor: 'Isaac Chevez',
    seoTitle:
      'Desarrollo Web Moderno con React, Next.js e IA | C.O.A.',
    seoDescription:
      'Curso gratuito y autodidacta de desarrollo web moderno con HTML, CSS, JavaScript, React, Next.js, Tailwind CSS e Inteligencia Artificial.',
    ctaLabel: 'Entrar al curso',
    ctaHref: '/cursos/desarrollo-web-moderno/inscripcion',
  },
  {
    slug: 'python-intermedio',
    title: 'Python Intermedio',
    category: 'Programación',
    level: 'Intermedio',
    duration: '12 semanas',
    lessons: 14,
    price: '₡10.000',
    billing: 'por mes',
    image: '/courses/python-intermedio.svg',
    short:
      'Avanza en Python con programación orientada a objetos, automatización, interfaces gráficas y bases de datos.',
    detailShort:
      'Lleva tus conocimientos de Python al siguiente nivel creando aplicaciones organizadas con interfaces gráficas y almacenamiento de datos.',
    description:
      'Python Intermedio es un curso para estudiantes que ya conocen los fundamentos del lenguaje y desean construir aplicaciones más completas. Durante doce semanas aprenderás programación en capas, programación orientada a objetos, manejo de archivos TXT y CSV, interfaces gráficas con Tkinter y automatización con Excel. Al finalizar, desarrollarás un proyecto completo aplicando todos los conocimientos del curso.',
    learn: [
      'Diseñar programas mediante clases, objetos, encapsulamiento, herencia y polimorfismo.',
      'Automatizar tareas con archivos de texto, carpetas y hojas de cálculo.',
      'Organizar aplicaciones utilizando una arquitectura profesional por capas.',
      'Crear interfaces gráficas con Tkinter y automatizar el procesamiento de información con Excel.',
    ],
    modules: [
      {
        title: 'Programación en capas',
        detail:
          'Separación entre interfaz gráfica, lógica, datos y dominio; flujo completo, validaciones y organización profesional.',
      },
      {
        title: 'Programación Orientada a Objetos',
        detail:
          'Clases, objetos, atributos, métodos, constructores, encapsulamiento, composición, herencia, sobrescritura, polimorfismo y clases abstractas simples.',
      },
      {
        title: 'Manejo de archivos TXT y CSV',
        detail:
          'Lectura, creación y modificación de archivos; procesamiento de datos, movimiento, renombrado y organización de archivos y carpetas.',
      },
      {
        title: 'Tkinter',
        detail:
          'Ventanas, etiquetas, campos de entrada, botones, marcos, tablas, formularios, eventos e integración con la lógica de la aplicación.',
      },
      {
        title: 'Excel y automatización',
        detail:
          'Recorrido de filas, extracción y transformación de datos, generación de reportes y automatización de tareas con hojas de cálculo.',
      },
    ],
    instructor: 'Evelio Chevez',
    seoTitle: 'Python Intermedio | C.O.A.',
    seoDescription:
      'Curso de Python intermedio con programación en capas, orientación a objetos, archivos TXT y CSV, Tkinter, Excel y automatización.',
    whatsappMessage:
      'Hola, me interesa inscribirme en el curso Python Intermedio de C.O.A. Quisiera recibir más información.',
  },
  {
    slug: 'python-practico',
    title: 'Python Práctico',
    category: 'Programación',
    level: 'Intermedio',
    duration: '16 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: 'Gratis',
    billing: null,
    image: '/courses/python-practico.svg',
    short:
      'Domina herramientas nativas de Python para transformar datos, trabajar con archivos y crear programas más claros y confiables.',
    detailShort:
      'Amplía tu caja de herramientas con funciones integradas y módulos esenciales de Python mediante práctica continua y proyectos.',
    description:
      'Python Práctico es un curso intermedio orientado a descubrir y aplicar funciones integradas, métodos, módulos y utilidades de la biblioteca estándar que se utilizan en proyectos reales. Mediante ejercicios, análisis de código y proyectos progresivos aprenderás a transformar datos, trabajar profesionalmente con texto y archivos, procesar fechas, realizar cálculos confiables, organizar programas y controlar errores sin depender de librerías externas.',
    learn: [
      'Limpiar, validar, transformar y presentar texto y colecciones de datos.',
      'Utilizar funciones integradas, comprensiones, collections e itertools con criterio.',
      'Trabajar con archivos TXT, CSV y JSON y manipular rutas de manera segura.',
      'Procesar fechas y cálculos y construir programas modulares con manejo de errores.',
    ],
    modules: [
      {
        title: 'Texto profesional y funciones integradas',
        detail:
          'Limpieza, validación y presentación de texto con métodos de cadenas, funciones integradas, formatos y expresiones regulares sencillas.',
      },
      {
        title: 'Iteración y transformación expresiva',
        detail:
          'enumerate, zip, comprensiones, expresiones generadoras, ordenamiento, lambda, map y filter aplicados con claridad.',
      },
      {
        title: 'Colecciones especializadas e iteradores',
        detail:
          'Counter, defaultdict, deque e itertools para conteos, agrupaciones, colas y combinaciones eficientes.',
      },
      {
        title: 'Archivos y rutas con la biblioteca estándar',
        detail:
          'Lectura y escritura segura de TXT, CSV y JSON; manejo portable de rutas, carpetas, copias y movimientos.',
      },
      {
        title: 'Fechas, cálculos y simulaciones confiables',
        detail:
          'datetime, math, statistics, random y Decimal para resolver operaciones sensibles de manera adecuada.',
      },
      {
        title: 'Programas robustos, modulares y documentados',
        detail:
          'Excepciones, módulos propios, argparse, logging, documentación oficial e integración en programas completos.',
      },
    ],
    instructor: 'Evelio Chevez',
    seoTitle: 'Python Práctico | C.O.A.',
    seoDescription:
      'Curso gratuito y autodidacta de Python práctico: funciones integradas, colecciones, archivos, fechas, cálculos y programas robustos.',
    ctaLabel: 'Entrar al curso',
    ctaHref: '/cursos/python-practico/inscripcion',
  },
  {
    slug: 'sql-bases-datos',
    title: 'SQL y Bases de Datos Relacionales',
    category: 'Tecnología',
    level: 'Inicial a intermedio',
    duration: '24 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: 'Gratis',
    billing: null,
    image: '/courses/sql-bases-datos.svg',
    short:
      'Aprende SQL desde cero y diseña bases de datos relacionales profesionales mediante SQLite y proyectos prácticos.',
    detailShort:
      'Organiza, protege, modifica y consulta información mientras construyes bases de datos relacionales para proyectos reales.',
    description:
      'SQL y Bases de Datos Relacionales es un curso práctico para aprender a organizar, proteger, modificar y consultar información de manera profesional. Comenzarás con los fundamentos del modelo relacional y avanzarás hasta diseñar y construir una base de datos completa. Las prácticas utilizan SQLite, pero los principios y el núcleo de SQL son transferibles a MySQL, PostgreSQL, SQL Server, MariaDB y Oracle.',
    learn: [
      'Comprender el modelo relacional y traducir necesidades reales en entidades, atributos y relaciones.',
      'Crear tablas con claves, tipos de datos y restricciones de integridad apropiadas.',
      'Insertar, actualizar y eliminar información de forma segura mediante transacciones.',
      'Consultar, filtrar, ordenar, agrupar y combinar información de varias tablas.',
      'Utilizar subconsultas, expresiones comunes de tabla, vistas e índices.',
      'Diseñar y documentar una base de datos completa para un proyecto real.',
    ],
    modules: [
      {
        title: 'Fundamentos relacionales y primeros pasos con SQL',
        detail:
          'Comprender la estructura de una base de datos y crear las primeras tablas y consultas.',
      },
      {
        title: 'Diseño de bases de datos, relaciones e integridad',
        detail:
          'Convertir requisitos reales en un esquema relacional correctamente diseñado.',
      },
      {
        title: 'Gestión segura de datos y transacciones',
        detail:
          'Insertar, actualizar y eliminar información sin comprometer su integridad.',
      },
      {
        title: 'Consultas, funciones y análisis de información',
        detail:
          'Obtener respuestas útiles a partir de los datos almacenados.',
      },
      {
        title: 'Consultas multitabla y resolución avanzada con SQL',
        detail:
          'Combinar tablas y resolver consultas de mayor complejidad.',
      },
      {
        title: 'SQL profesional y proyecto final integrador',
        detail:
          'Construir, documentar y optimizar una solución completa.',
      },
    ],
    instructor: 'Juan Carlos Castro',
    seoTitle: 'SQL y Bases de Datos Relacionales | C.O.A.',
    seoDescription:
      'Curso gratuito y autodidacta de SQL y bases de datos relacionales con SQLite, consultas, relaciones, transacciones y proyecto final.',
    ctaLabel: 'Entrar al curso',
    ctaHref: '/cursos/sql-bases-datos/inscripcion',
  },
  {
    slug: 'desarrollo-software-python',
    title: 'Desarrollo de Software con Python',
    category: 'Programación',
    level: 'Avanzado',
    duration: '46 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: '₡4.900',
    billing: null,
    image: '/courses/desarrollo-software-python.svg',
    short:
      'Construye, prueba, documenta y distribuye aplicaciones empresariales completas utilizando Python.',
    detailShort:
      'Desarrolla software empresarial con Python, automatizaciones, Excel, SQLite, interfaces de escritorio, pruebas e Inteligencia Artificial.',
    description:
      'Desarrollo de Software con Python es el nivel avanzado de la Ruta Python de C.O.A. Está dirigido a estudiantes que ya dominan los fundamentos del lenguaje y desean utilizarlos para resolver necesidades empresariales mediante programas organizados, automatizaciones seguras, archivos Excel, bases de datos SQLite, interfaces de escritorio y procesos profesionales de entrega. Durante el curso construirás productos progresivamente más completos y finalizarás con un sistema empresarial preparado como proyecto de portafolio.',
    learn: [
      'Transformar necesidades empresariales en requisitos comprobables y proyectos Python organizados profesionalmente.',
      'Automatizar archivos y procesos de forma segura, reversible, verificable e idempotente.',
      'Leer, validar y generar libros de Excel y reportes empresariales mediante Python.',
      'Integrar SQLite con repositorios, servicios, consultas parametrizadas y transacciones.',
      'Crear aplicaciones empresariales de escritorio con Tkinter, ttk y una arquitectura desacoplada.',
      'Escribir pruebas, documentar, respaldar y distribuir aplicaciones con PyInstaller, Git y GitHub.',
      'Utilizar Inteligencia Artificial para analizar, revisar y depurar código manteniendo el control de cada decisión.',
      'Desarrollar un sistema empresarial completo como proyecto final de portafolio.',
    ],
    modules: [
      {
        title: 'Ingeniería de un proyecto Python profesional',
        detail:
          'Organización por paquetes y módulos, configuración, manejo de errores, logging, pruebas con pytest, Git y refactorización asistida por IA.',
      },
      {
        title: 'Automatización segura de archivos y procesos',
        detail:
          'Procesamiento profesional con pathlib y shutil, simulación, idempotencia, trazabilidad, reversión y pruebas con directorios temporales.',
      },
      {
        title: 'Excel y reportes empresariales automatizados',
        detail:
          'Lectura, validación y generación de libros con openpyxl, indicadores, formatos, reportes de errores y verificación de resultados.',
      },
      {
        title: 'Persistencia empresarial con SQLite y Python',
        detail:
          'Modelado relacional, consultas parametrizadas, operaciones CRUD, transacciones, repositorios, servicios, respaldos y pruebas de integración.',
      },
      {
        title: 'Aplicaciones empresariales de escritorio con arquitectura e IA',
        detail:
          'Interfaces con Tkinter y ttk, controladores, servicios, navegación, validaciones, reportes, respaldos y distribución inicial con PyInstaller.',
      },
      {
        title: 'Proyecto final profesional: COA Taller Pro',
        detail:
          'Construcción, pruebas, documentación, distribución y entrega de un sistema integral para administrar un servicio técnico.',
      },
    ],
    instructor: 'Armando Ruiz',
    seoTitle: 'Desarrollo de Software con Python | C.O.A.',
    seoDescription:
      'Curso autodidacta avanzado de desarrollo de software empresarial con Python, Excel, SQLite, Tkinter, pruebas e Inteligencia Artificial.',
    whatsappMessage:
      'Hola, me interesa inscribirme en el curso Desarrollo de Software con Python de C.O.A. Quisiera recibir más información.',
  },
  {
    slug: 'desarrollo-web-django',
    title: 'Desarrollo de Aplicaciones Web Profesionales con Django',
    category: 'Programación',
    level: 'Avanzado',
    duration: '48 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: 'Gratis',
    billing: null,
    image: '/courses/desarrollo-web-django.svg',
    short:
      'Construye aplicaciones web empresariales profesionales con Django, PostgreSQL, Bootstrap y prácticas de producción.',
    detailShort:
      'Desarrolla, prueba, documenta y despliega aplicaciones empresariales completas con Django 5.2 LTS.',
    description:
      'Desarrollo de Aplicaciones Web Profesionales con Django es el curso final de la Ruta Python de C.O.A. Aprenderás a construir aplicaciones empresariales completas utilizando Django 5.2 LTS, SQLite durante el desarrollo y PostgreSQL en producción. El recorrido integra arquitectura MVT, templates, Bootstrap, modelos, ORM, formularios, operaciones CRUD, autenticación, permisos, transacciones, pruebas, reportes y despliegue profesional.',
    learn: [
      'Crear y organizar proyectos Django mediante aplicaciones, rutas, vistas y templates.',
      'Construir interfaces profesionales y responsive con Django Templates, HTML5 y Bootstrap 5.',
      'Diseñar modelos relacionados, migraciones y consultas mediante el ORM de Django.',
      'Implementar formularios seguros, validaciones y operaciones CRUD completas.',
      'Administrar autenticación, usuarios, roles, permisos y procesos empresariales transaccionales.',
      'Escribir pruebas, optimizar consultas, generar reportes y configurar entornos de producción.',
      'Desplegar y documentar una aplicación empresarial web completa como proyecto de portafolio.',
    ],
    modules: [
      {
        title: 'Django y la arquitectura de una aplicación web',
        detail:
          'Funcionamiento web, proyectos y aplicaciones, arquitectura MVT, rutas, vistas, templates y flujo de solicitudes.',
      },
      {
        title: 'Interfaces profesionales con templates y Bootstrap',
        detail:
          'HTML semántico, herencia de templates, componentes, archivos estáticos, Bootstrap 5, responsive y accesibilidad.',
      },
      {
        title: 'Modelos, relaciones, ORM y administración',
        detail:
          'Diseño relacional, modelos, migraciones, consultas ORM, relaciones, datos de prueba y personalización de Django Admin.',
      },
      {
        title: 'Formularios, validaciones y CRUD profesional',
        detail:
          'Formularios, ModelForm, validaciones, CSRF, vistas funcionales y genéricas, búsqueda, filtros, paginación y archivos.',
      },
      {
        title: 'Autenticación, permisos y operaciones empresariales',
        detail:
          'Usuarios, perfiles, grupos, permisos, roles, transacciones, ventas, inventario, auditoría y seguridad esencial.',
      },
      {
        title: 'Arquitectura, pruebas, reportes y despliegue',
        detail:
          'Separación de responsabilidades, pruebas de Django, optimización ORM, reportes, PostgreSQL y configuración de producción.',
      },
      {
        title: 'Proyecto Final Integrador',
        detail:
          'Desarrollo, prueba, documentación y despliegue de COA Gestión Empresarial Web como proyecto profesional de portafolio.',
      },
    ],
    instructor: 'Armando Ruiz',
    seoTitle: 'Desarrollo de Aplicaciones Web con Django | C.O.A.',
    seoDescription:
      'Curso gratuito y autodidacta de desarrollo web profesional con Django 5.2 LTS, PostgreSQL, Bootstrap, pruebas y despliegue.',
    ctaLabel: 'Entrar al curso',
    ctaHref: '/cursos/desarrollo-web-django/inscripcion',
  },
  {
    slug: 'programacion-con-ia',
    title: 'Programación Asistida por Inteligencia Artificial',
    category: 'Programación',
    level: 'Intermedio',
    duration: '16 horas',
    lessons: 0,
    modality: 'Autodidacta',
    price: 'Gratis',
    billing: null,
    image: '/courses/programacion-con-ia.svg',
    short:
      'Aprende a utilizar Inteligencia Artificial para desarrollar software con mayor productividad, calidad y criterio profesional.',
    detailShort:
      'Utiliza asistentes de IA durante un proceso real de desarrollo sin perder el control del código, las pruebas ni las decisiones técnicas.',
    description:
      'Programación Asistida por Inteligencia Artificial es un curso práctico para personas que ya conocen los fundamentos de al menos un lenguaje de programación. Aprenderás a definir problemas, proporcionar contexto útil, redactar instrucciones técnicas, trabajar mediante iteraciones pequeñas, revisar código generado, depurar con evidencia, crear pruebas y documentar decisiones. Podrás utilizar herramientas como ChatGPT, Claude, Gemini, GitHub Copilot o alternativas equivalentes, manteniendo siempre la responsabilidad sobre el resultado.',
    learn: [
      'Seleccionar la herramienta de IA adecuada para cada tarea y reconocer qué decisiones no debes delegar.',
      'Redactar prompts técnicos con contexto, restricciones, ejemplos y criterios de aceptación claros.',
      'Construir y modificar software mediante iteraciones pequeñas, revisando cada propuesta antes de integrarla.',
      'Depurar errores con evidencia y detectar respuestas plausibles, incompatibles o incorrectas.',
      'Generar pruebas, documentación, README y commits basados en el comportamiento real del proyecto.',
      'Proteger secretos y datos sensibles mientras utilizas asistentes de Inteligencia Artificial.',
      'Completar y defender una solución funcional desarrollada mediante un flujo profesional asistido por IA.',
    ],
    modules: [
      {
        title: 'Fundamentos del desarrollo asistido por IA',
        detail:
          'Herramientas, capacidades, límites, privacidad, seguridad y responsabilidad profesional al incorporar IA al desarrollo.',
      },
      {
        title: 'Prompts y conversaciones técnicas para programar',
        detail:
          'Contexto, restricciones, criterios de aceptación, división de problemas e iteraciones verificables.',
      },
      {
        title: 'Construcción y modificación de software con IA',
        detail:
          'Funciones, clases, estructuras, integración de cambios, comprensión de código y refactorización controlada.',
      },
      {
        title: 'Depuración, diagnóstico y validación de respuestas',
        detail:
          'Reproducción de errores, análisis de causas, verificación de propuestas y correcciones basadas en evidencia.',
      },
      {
        title: 'Automatización, pruebas y modernización de proyectos',
        detail:
          'Pruebas, documentación, control de versiones, conversión de código, seguridad y revisión profesional.',
      },
      {
        title: 'Proyecto Final: desarrollo profesional asistido por IA',
        detail:
          'Construcción de una solución funcional, probada, documentada y comprendida mediante un flujo completo asistido por IA.',
      },
    ],
    instructor: 'Ivan Carvajal',
    seoTitle: 'Programación Asistida por Inteligencia Artificial | C.O.A.',
    seoDescription:
      'Curso gratuito y autodidacta para aprender a desarrollar software con asistencia de IA, prompts técnicos, pruebas y criterio profesional.',
    ctaLabel: 'Entrar al curso',
    ctaHref: '/cursos/programacion-con-ia/inscripcion',
    comingSoon: true,
  },
]

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug)
}

export function usesWhatsAppEnrollment(course: Course) {
  return Boolean(course.whatsappMessage)
}

export function courseEnrollmentHref(course: Course) {
  return course.whatsappMessage
    ? createWhatsAppLink(course.whatsappMessage)
    : `/inscripcion/${course.slug}`
}
