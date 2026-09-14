export type Field = {
  key: string
  label: string
  value: string
  kind?: 'name' | 'number' | 'integer' | 'expression' | 'parameters'
  options?: string[]
  hint?: string
  suggestions?: string[]
}
export type BuilderAction = {
  id: string
  title: string
  category: string
  description: string
  fields: Field[]
  template: string
  generate: (v: Record<string, string>) => string
  level?: 1 | 2
}
export type BuilderClass = {
  name: string
  parameters: string[]
  methods: string[]
  bases: string[]
}
export type BuilderAnalysis = {
  valid: boolean
  variables: { name: string; kind: string }[]
  classes: BuilderClass[]
}
export function fallbackBuilderAnalysis(source: string): BuilderAnalysis {
  const variables: BuilderAnalysis['variables'] = []
  const classes: BuilderClass[] = []
  const seen = new Set<string>()
  let current: BuilderClass | undefined
  for (const line of source.split('\n')) {
    const assignment = line.match(/^\s*([\p{L}_][\p{L}\p{N}_]*)\s*=\s*(.+)$/u)
    if (assignment && !seen.has(assignment[1])) {
      const value = assignment[2].trim()
      const kind = value.startsWith('[') ? 'list' : value.startsWith('{') ? 'dict' : value.startsWith('(') ? 'tuple' : /^['"]/.test(value) ? 'string' : /^-?\d/.test(value) ? 'number' : /\binput\s*\(/.test(value) ? 'input' : 'unknown'
      variables.push({ name: assignment[1], kind })
      seen.add(assignment[1])
    }
    const classMatch = line.match(/^class\s+([\p{L}_][\p{L}\p{N}_]*)(?:\(([^)]*)\))?:/u)
    if (classMatch) {
      current = { name: classMatch[1], parameters: [], methods: [], bases: names(classMatch[2] ?? '') }
      classes.push(current)
      continue
    }
    const method = line.match(/^\s+def\s+([\p{L}_][\p{L}\p{N}_]*)\s*\(([^)]*)\):/u)
    if (current && method) {
      const parameters = names(method[2]).filter((item) => item !== 'self')
      if (method[1] === '__init__') current.parameters = parameters
      else if (!method[1].startsWith('_')) current.methods.push(method[1])
    } else if (line.trim() && !/^\s/.test(line)) current = undefined
  }
  return { valid: variables.length > 0 || classes.length > 0, variables, classes }
}
const keywords = new Set(
  'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(
    ' ',
  ),
)
export function isPythonName(value: string) {
  return /^[\p{L}_][\p{L}\p{N}_]*$/u.test(value) && !keywords.has(value)
}
export const quote = (value: string) => JSON.stringify(value)
const name = (
  key = 'name',
  label = 'Nombre de la variable',
  value = 'nombre',
): Field => ({ key, label, value, kind: 'name' })
const text = (key = 'text', label = 'Texto', value = 'Hola mundo'): Field => ({
  key,
  label,
  value,
})
const number = (key = 'value', label = 'Valor', value = '20'): Field => ({
  key,
  label,
  value,
  kind: 'number',
})
const expression = (key: string, label: string, value: string): Field => ({
  key,
  label,
  value,
  kind: 'expression',
  hint: 'Usa una variable, un número o una expresión Python. Escribe los textos entre comillas.',
})
const op: Field = {
  key: 'op',
  label: 'Operador',
  value: '>=',
  options: ['==', '!=', '>', '<', '>=', '<='],
}
const condition = [
  name('name', 'Variable', 'edad'),
  op,
  expression('value', 'Valor a comparar', '18'),
]
const message = text('text', 'Mensaje si se cumple', 'Es mayor de edad')
const otherwise = text(
  'otherwise',
  'Mensaje si no se cumple',
  'Es menor de edad',
)
const compare = (v: Record<string, string>) => `${v.name} ${v.op} ${v.value}`
export const operatorMeaning: Record<string, string> = {
  '==': 'es igual a',
  '!=': 'es diferente de',
  '>': 'es mayor que',
  '<': 'es menor que',
  '>=': 'es mayor o igual que',
  '<=': 'es menor o igual que',
}
export const actions: BuilderAction[] = [
  {
    id: 'print',
    title: 'Imprimir',
    category: 'Básico',
    description: 'print() muestra un mensaje en la consola.',
    fields: [text()],
    template: 'print("Tu mensaje")',
    generate: (v) => `print(${quote(v.text)})`,
  },
  {
    id: 'text',
    title: 'Variable de texto',
    category: 'Básico',
    description: 'Una variable guarda un valor para utilizarlo después.',
    fields: [name(), text('text', 'Texto', 'Evelio')],
    template: 'variable = "texto"',
    generate: (v) => `${v.name} = ${quote(v.text)}`,
  },
  {
    id: 'number',
    title: 'Variable numérica',
    category: 'Básico',
    description: 'Los números se escriben sin comillas.',
    fields: [name('name', 'Nombre de la variable', 'edad'), number()],
    template: 'numero = 0',
    generate: (v) => `${v.name} = ${v.value}`,
  },
  {
    id: 'input',
    title: 'Pedir dato de texto',
    category: 'Básico',
    description:
      'input() permite que el usuario escriba un dato. El resultado es texto.',
    fields: [name(), text('text', 'Mensaje', 'Digite su nombre: ')],
    template: 'dato = input("Mensaje: ")',
    generate: (v) => `${v.name} = input(${quote(v.text)})`,
  },
  {
    id: 'input-number',
    title: 'Pedir un número',
    category: 'Básico',
    description:
      'int() convierte el dato a entero; float() permite decimales. Se utiliza input() para pedirlo.',
    fields: [
      name('name', 'Variable', 'edad'),
      text('text', 'Mensaje', 'Digite su edad: '),
      { key: 'type', label: 'Tipo', value: 'int', options: ['int', 'float'] },
    ],
    template: 'numero = int(input("Número: "))',
    generate: (v) => `${v.name} = ${v.type}(input(${quote(v.text)}))`,
  },
  {
    id: 'comment',
    title: 'Comentario',
    category: 'Básico',
    description:
      'Python ignora las líneas que comienzan con #. Úsalas para explicar tu intención.',
    fields: [text('text', 'Comentario', 'Aquí comienza mi programa')],
    template: '# Explica tu intención',
    generate: (v) =>
      v.text
        .split('\n')
        .map((l) => '# ' + l)
        .join('\n'),
  },
  {
    id: 'if',
    title: 'Condición if',
    category: 'Condiciones',
    description:
      'La acción se ejecuta solamente cuando se cumple la condición.',
    fields: [...condition, message],
    template: 'if condicion:\n    pass',
    generate: (v) => `if ${compare(v)}:\n    print(${quote(v.text)})`,
  },
  {
    id: 'if-else',
    title: 'if / else',
    category: 'Condiciones',
    description: 'Elige entre dos caminos según una condición.',
    fields: [...condition, message, otherwise],
    template: 'if condicion:\n    pass\nelse:\n    pass',
    generate: (v) =>
      `if ${compare(v)}:\n    print(${quote(v.text)})\nelse:\n    print(${quote(v.otherwise)})`,
  },
  {
    id: 'elif',
    title: 'if / elif / else',
    category: 'Condiciones',
    description:
      'Python comprueba las condiciones en orden y ejecuta el primer camino verdadero.',
    fields: [
      ...condition,
      message,
      expression('second', 'Segunda condición', 'edad >= 13'),
      text('secondText', 'Mensaje del segundo camino', 'Es adolescente'),
      otherwise,
    ],
    template:
      'if condicion:\n    pass\nelif otra_condicion:\n    pass\nelse:\n    pass',
    generate: (v) =>
      `if ${compare(v)}:\n    print(${quote(v.text)})\nelif ${v.second}:\n    print(${quote(v.secondText)})\nelse:\n    print(${quote(v.otherwise)})`,
  },
  {
    id: 'nested',
    title: 'Condición anidada',
    category: 'Condiciones',
    description:
      'La segunda condición se revisa solamente si se cumple la primera.',
    fields: [
      ...condition,
      expression('second', 'Condición interior', 'edad < 65'),
      message,
    ],
    template: 'if condicion:\n    if otra_condicion:\n        pass',
    generate: (v) =>
      `if ${compare(v)}:\n    if ${v.second}:\n        print(${quote(v.text)})`,
  },
  {
    id: 'match',
    title: 'Menú match',
    category: 'Condiciones',
    description:
      'match compara un valor con casos concretos. El caso _ es la alternativa por defecto.',
    fields: [
      name('name', 'Variable del menú', 'opcion'),
      text('case', 'Opción de texto', '1'),
      text(),
      otherwise,
    ],
    template:
      'match opcion:\n    case "1":\n        pass\n    case _:\n        pass',
    generate: (v) =>
      `match ${v.name}:\n    case ${quote(v.case)}:\n        print(${quote(v.text)})\n    case _:\n        print(${quote(v.otherwise)})`,
  },
  {
    id: 'while',
    title: 'Bucle while',
    category: 'Bucles',
    description:
      'Primero se crea el contador; while revisa la condición, print realiza la acción y += actualiza el contador. Revisa que el cambio permita terminar.',
    fields: [
      name('name', 'Contador', 'contador'),
      number('start', 'Valor inicial', '1'),
      { ...op, value: '<=' },
      number('value', 'Límite', '10'),
      number('step', 'Cambio por vuelta (puede ser negativo)', '1'),
    ],
    template: 'while condicion:\n    pass',
    generate: (v) =>
      `${v.name} = ${v.start}\n\nwhile ${compare(v)}:\n    print(${v.name})\n    ${v.name} += ${v.step}`,
  },
  {
    id: 'while-true',
    title: 'while True',
    category: 'Bucles',
    description:
      'Repite hasta que break termine el ciclo. Este ejemplo permite escribir salir.',
    fields: [text('text', 'Pregunta', 'Escribe salir para terminar: ')],
    template: 'while True:\n    # Agrega una condición de salida\n    break',
    generate: (v) =>
      `while True:\n    respuesta = input(${quote(v.text)})\n    if respuesta == "salir":\n        break`,
  },
  {
    id: 'for',
    title: 'for / recorrer lista',
    category: 'Bucles',
    description: 'Recorre los elementos de una lista o de otro iterable.',
    fields: [
      name('name', 'Variable de cada elemento', 'elemento'),
      expression('items', 'Lista o iterable', 'nombres'),
    ],
    template: 'for elemento in lista:\n    pass',
    generate: (v) => `for ${v.name} in ${v.items}:\n    print(${v.name})`,
  },
  {
    id: 'range',
    title: 'for con range()',
    category: 'Bucles',
    description:
      'Python no incluye el último número de range(). Para llegar hasta 10 usamos 11. También puedes usar argumentos libres.',
    fields: [
      name('name', 'Contador', 'i'),
      { ...number('start', 'Desde', '1'), kind: 'integer' },
      { ...number('end', 'Hasta (incluido)', '10'), kind: 'integer' },
      {
        key: 'mode',
        label: 'Modo',
        value: 'inclusivo',
        options: ['inclusivo', 'argumentos libres'],
      },
      expression('args', 'Argumentos en modo libre', '1, 11'),
    ],
    template: 'for i in range(10):\n    pass',
    generate: (v) =>
      `for ${v.name} in range(${v.mode === 'inclusivo' ? `${v.start}, ${Number(v.end) + (Number(v.end) >= Number(v.start) ? 1 : -1)}${Number(v.end) < Number(v.start) ? ', -1' : ''}` : v.args}):\n    print(${v.name})`,
  },
  {
    id: 'list',
    title: 'Crear lista',
    category: 'Estructuras',
    description:
      'Una lista guarda varios elementos. Escribe un texto por línea.',
    fields: [
      name('name', 'Nombre de la lista', 'nombres'),
      text('text', 'Elementos (uno por línea)', 'Ana\nLuis'),
    ],
    template: 'lista = []',
    generate: (v) =>
      `${v.name} = [${v.text.split('\n').filter(Boolean).map(quote).join(', ')}]`,
  },
  {
    id: 'append',
    title: 'Agregar a lista',
    category: 'Estructuras',
    description: 'append() agrega un elemento al final de una lista existente.',
    fields: [
      name('name', 'Lista', 'nombres'),
      text('text', 'Elemento de texto', 'María'),
    ],
    template: 'lista.append(elemento)',
    generate: (v) => `${v.name}.append(${quote(v.text)})`,
  },
  {
    id: 'list-for',
    title: 'Recorrer lista',
    category: 'Estructuras',
    description: 'Usa for para trabajar con cada elemento.',
    fields: [
      name('name', 'Lista', 'nombres'),
      name('item', 'Elemento', 'nombre'),
    ],
    template: 'for elemento in lista:\n    pass',
    generate: (v) => `for ${v.item} in ${v.name}:\n    print(${v.item})`,
  },
  {
    id: 'function',
    title: 'Crear función',
    category: 'Funciones',
    description:
      'def define una tarea reutilizable. Para ejecutarla después, llama a la función por su nombre.',
    fields: [name('name', 'Nombre de la función', 'saludar'), text()],
    template: 'def mi_funcion():\n    pass',
    generate: (v) => `def ${v.name}():\n    print(${quote(v.text)})`,
  },
  {
    id: 'parameters',
    title: 'Función con parámetros',
    category: 'Funciones',
    description:
      'Los parámetros reciben datos. En el mensaje puedes usar {nombre} para incluir un parámetro.',
    fields: [
      name('name', 'Nombre de la función', 'saludar'),
      {
        key: 'params',
        label: 'Parámetros separados por coma',
        value: 'nombre',
        kind: 'parameters',
      },
      text('text', 'Mensaje', 'Hola {nombre}'),
    ],
    template: 'def mi_funcion(parametro):\n    pass',
    generate: (v) => {
      const params = v.params.split(',').map((p) => p.trim())
      const message = v.text
        .replace(/[{}]/g, (brace) => brace + brace)
        .replace(/\{\{([^{}]*)\}\}/g, (all, p) =>
          params.includes(p) ? '{' + p + '}' : all,
        )
      return `def ${v.name}(${params.join(', ')}):\n    print(f${quote(message)})`
    },
  },
  {
    id: 'return',
    title: 'Devolver con return',
    category: 'Funciones',
    description:
      'return devuelve un resultado. Inserta esta línea dentro de una función.',
    fields: [expression('value', 'Resultado o expresión', 'resultado')],
    template: 'return resultado',
    generate: (v) => `return ${v.value}`,
  },
  {
    id: 'class', title: 'Crear clase', category: 'Programación orientada a objetos', level: 2,
    description: 'Crea una clase con constructor, atributos y métodos editables.',
    fields: [
      name('className', 'Nombre de la clase', 'Persona'),
      { key: 'attributes', label: 'Atributos separados por coma', value: 'nombre, edad', kind: 'parameters' },
      { key: 'types', label: 'Tipos en el mismo orden', value: 'Texto, Entero', options: ['Texto, Entero', 'Texto', 'Entero', 'Decimal', 'Booleano', 'Otro'] },
      { key: 'initialization', label: 'Inicialización', value: 'Recibir valores como parámetros', options: ['Recibir valores como parámetros', 'Usar valores iniciales'] },
      { key: 'methods', label: 'Métodos separados por coma (opcional)', value: 'mostrar_datos' },
    ],
    template: 'class Persona:\n    def __init__(self):\n        pass',
    generate: (v) => generateClass(v),
  },
  {
    id: 'object', title: 'Crear objeto', category: 'Programación orientada a objetos', level: 2,
    description: 'Crea una instancia usando el constructor detectado.',
    fields: [name('className', 'Clase', 'Persona'), name('objectName', 'Nombre del objeto', 'persona1'), expression('arguments', 'Valores separados por coma', '"Ana", 20')],
    template: 'objeto = Clase()',
    generate: (v) => `${v.objectName} = ${v.className}(${v.arguments})`,
  },
  {
    id: 'encapsulation', title: 'Encapsulamiento', category: 'Programación orientada a objetos', level: 2,
    description: 'Convierte atributos en privados y agrega getter, setter o ambos sin duplicarlos.', fields: [], template: '# Previsualiza el encapsulamiento', generate: () => '# Previsualiza el encapsulamiento',
  },
  {
    id: 'inheritance', title: 'Crear herencia', category: 'Programación orientada a objetos', level: 2,
    description: 'Crea una clase hija respetando los parámetros del constructor padre.',
    fields: [name('parent', 'Clase padre', 'Persona'), name('className', 'Nueva clase', 'Estudiante'), { key: 'parentParams', label: 'Parámetros heredados', value: 'nombre, edad', kind: 'parameters' }, { key: 'ownAttributes', label: 'Atributos propios (opcional)', value: '' }],
    template: 'class Hija(Padre):\n    pass',
    generate: (v) => inheritanceCode(v),
  },
  {
    id: 'polymorphism', title: 'Crear polimorfismo', category: 'Programación orientada a objetos', level: 2,
    description: 'Sobrescribe un método existente de una clase padre.',
    fields: [name('parent', 'Clase padre', 'Persona'), name('className', 'Nueva clase', 'Estudiante'), name('method', 'Método disponible', 'mostrar_datos')],
    template: 'class Hija(Padre):\n    def metodo(self):\n        pass',
    generate: (v) => `class ${v.className}(${v.parent}):\n    def ${v.method}(self):\n        pass`,
  },
  ...[
    ['layer-presentation-business', 'Presentation → Business', 'Conecta la interfaz con una clase de lógica.'],
    ['layer-business-data', 'Business → Data', 'Conecta la lógica con una clase de acceso a datos.'],
    ['layer-business-domain', 'Business → Domain', 'Crea y utiliza objetos del dominio.'],
    ['layer-object-business', 'Crear objeto de Business', 'Crea un objeto usando una clase real de Business.'],
    ['layer-object-data', 'Crear objeto de Data', 'Crea un objeto usando una clase real de Data.'],
    ['layer-object-domain', 'Crear objeto de Domain', 'Crea un objeto usando una clase real de Domain.'],
    ['layer-call-method', 'Llamar método de otra capa', 'Selecciona una clase, método y sus parámetros.'],
    ['layer-create-method', 'Crear método que reciba parámetros', 'Crea solamente la firma compatible y un cuerpo pass.'],
    ['layer-return', 'Retornar resultado a otra capa', 'Agrega un return sencillo al código actual.'],
    ['layer-review', 'Revisar conexiones', 'Analiza conexiones y dependencias sin modificar archivos.'],
  ].map(([id, title, description]): BuilderAction => ({ id, title, description, category: 'Programación por capas', level: 2, fields: [], template: '# Previsualiza la conexión entre capas', generate: () => '# Previsualiza la conexión entre capas' })),
  ...(['Try / Except', 'Try / Except / Else', 'Try / Except / Finally'] as const).map((title, index): BuilderAction => ({
    id: ['try-except', 'try-else', 'try-finally'][index], title, category: 'Manejo de errores', level: 2,
    description: 'Controla errores previsibles sin detener todo el programa.',
    fields: [{ key: 'exception', label: 'Excepción', value: 'ValueError', options: ['ValueError', 'ZeroDivisionError', 'FileNotFoundError', 'TypeError', 'Exception', 'Otra'] }, expression('customException', 'Otra excepción', 'ValueError')],
    template: `try:\n    pass\nexcept ValueError:\n    pass${index === 1 ? '\nelse:\n    pass' : index === 2 ? '\nfinally:\n    pass' : ''}`,
    generate: (v) => `try:\n    pass\nexcept ${v.exception === 'Otra' ? v.customException : v.exception}:\n    pass${index === 1 ? '\nelse:\n    pass' : index === 2 ? '\nfinally:\n    pass' : ''}`,
  })),
  {
    id: 'dictionary', title: 'Crear diccionario', category: 'Estructuras de datos', level: 2,
    description: 'Crea pares de clave y valor legibles.',
    fields: [name('name', 'Nombre', 'estudiante'), { key: 'pairs', label: 'Campos (clave: valor), uno por línea', value: 'nombre: "Ana"\nedad: 20' }],
    template: 'diccionario = {}',
    generate: (v) => dictionaryCode(v.name, v.pairs),
  },
  {
    id: 'dictionary-list', title: 'Crear lista de diccionarios', category: 'Estructuras de datos', level: 2,
    description: 'Crea varios diccionarios dentro de una lista.',
    fields: [name('name', 'Nombre de lista', 'estudiantes'), { key: 'items', label: 'Elementos separados por una línea en blanco', value: 'nombre: "Ana"\nedad: 20\n\nnombre: "Luis"\nedad: 22' }],
    template: 'lista = [\n    {}\n]',
    generate: (v) => dictionaryListCode(v.name, v.items),
  },
]

const initialValues: Record<string, string> = { Texto: '""', Entero: '0', Decimal: '0.0', Booleano: 'False', Otro: 'None' }
function names(value: string) { return value.split(',').map((item) => item.trim()).filter(Boolean) }
function generateClass(v: Record<string, string>) {
  const attributes = names(v.attributes)
  const types = names(v.types)
  const parameters = v.initialization === 'Recibir valores como parámetros'
  const header = `class ${v.className}:\n    def __init__(self${parameters && attributes.length ? ', ' + attributes.join(', ') : ''}):`
  const assignments = attributes.length
    ? attributes.map((attribute, index) => `        self.${attribute} = ${parameters ? attribute : initialValues[types[index] ?? types[0]] ?? 'None'}`).join('\n')
    : '        pass'
  const methods = names(v.methods).map((method) => `\n\n    def ${method}(self):\n        pass`).join('')
  return header + '\n' + assignments + methods
}
function inheritanceCode(v: Record<string, string>) {
  const inherited = names(v.parentParams)
  const own = names(v.ownAttributes)
  const all = [...inherited, ...own]
  const lines = [`class ${v.className}(${v.parent}):`, `    def __init__(self${all.length ? ', ' + all.join(', ') : ''}):`, `        super().__init__(${inherited.join(', ')})`]
  lines.push(...own.map((attribute) => `        self.${attribute} = ${attribute}`))
  return lines.join('\n')
}
function parsedPairs(value: string) {
  return value.split('\n').filter((line) => line.trim()).map((line) => {
    const separator = line.indexOf(':')
    if (separator < 1) throw new Error('Escribe cada campo como clave: valor.')
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
  })
}
function dictionaryBody(value: string, indent: string) {
  return parsedPairs(value).map(([key, item]) => `${indent}${quote(key)}: ${item}`).join(',\n')
}
function dictionaryCode(name: string, pairs: string) { return `${name} = {\n${dictionaryBody(pairs, '    ')}\n}` }
function dictionaryListCode(name: string, items: string) {
  const blocks = items.trim().split(/\n\s*\n/).map((item) => `    {\n${dictionaryBody(item, '        ')}\n    }`)
  return `${name} = [\n${blocks.join(',\n')}\n]`
}

export function actionsWithAnalysis(analysis: BuilderAnalysis): BuilderAction[] {
  const variables = analysis.variables.map((item) => item.name)
  const collections = analysis.variables.filter((item) => ['list', 'dict', 'tuple', 'set'].includes(item.kind)).map((item) => item.name)
  return actions.map((action) => {
    const fields = action.fields.map((field) => {
      if (['if', 'if-else', 'elif', 'nested', 'while'].includes(action.id) && field.key === 'name') return { ...field, suggestions: variables }
      if (action.id === 'while' && field.key === 'value') return { ...field, kind: 'expression' as const, suggestions: variables }
      if (['for', 'list-for', 'append'].includes(action.id) && ['items', 'name'].includes(field.key)) return { ...field, suggestions: collections }
      if (['object', 'inheritance', 'polymorphism'].includes(action.id) && ['className', 'parent'].includes(field.key)) return { ...field, suggestions: analysis.classes.map((item) => item.name) }
      return field
    })
    const selectedClass = analysis.classes[0]
    if (action.id === 'object' && selectedClass) {
      fields.find((field) => field.key === 'className')!.value = selectedClass.name
      fields.find((field) => field.key === 'arguments')!.label = selectedClass.parameters.length ? `Valores: ${selectedClass.parameters.join(', ')}` : 'Valores del constructor'
    }
    if (action.id === 'inheritance' && selectedClass) {
      fields.find((field) => field.key === 'parent')!.value = selectedClass.name
      fields.find((field) => field.key === 'parentParams')!.value = selectedClass.parameters.join(', ')
    }
    if (action.id === 'polymorphism' && selectedClass) {
      fields.find((field) => field.key === 'parent')!.value = selectedClass.name
      const method = fields.find((field) => field.key === 'method')!
      method.value = selectedClass.methods[0] ?? method.value
      method.suggestions = selectedClass.methods
    }
    if (analysis.valid && variables.length && action.id === 'if')
      return { ...action, fields: fields.filter((field) => field.key !== 'text'), generate: (v) => `if ${compare(v)}:\n    pass` }
    if (analysis.valid && variables.length && action.id === 'while')
      return { ...action, fields: fields.filter((field) => !['start', 'step'].includes(field.key)), generate: (v) => `while ${compare(v)}:\n    pass` }
    if (analysis.valid && collections.length && action.id === 'for')
      return {
        ...action,
        fields: [
          name('name', 'Variable de iteración', 'nombre'),
          { ...expression('items', 'Colección', collections[0]), suggestions: collections },
          { key: 'traversal', label: 'Forma de recorrer', value: 'Por elemento', options: ['Por elemento', 'Por índice'] },
        ],
        generate: (v) => v.traversal === 'Por índice'
          ? `for ${v.name} in range(len(${v.items})):\n    pass`
          : `for ${v.name} in ${v.items}:\n    pass`,
      }
    return { ...action, fields }
  })
}
export function generateCode(
  action: BuilderAction,
  values: Record<string, string>,
) {
  for (const field of action.fields) {
    const value = values[field.key] ?? ''
    if (field.kind === 'name' && !isPythonName(value))
      throw new Error(
        `${field.label}: comienza con una letra o _, sin espacios, y evita palabras reservadas como if.`,
      )
    if (
      (field.kind === 'number' || field.kind === 'integer') &&
      (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value) ||
        !Number.isFinite(Number(value)) ||
        (field.kind === 'integer' && !Number.isSafeInteger(Number(value))))
    )
      throw new Error(
        `${field.label}: escribe un número válido con punto para los decimales.`,
      )
    if (field.kind === 'expression' && (!value.trim() || /[\r\n;]/.test(value)))
      throw new Error(
        `${field.label}: escribe una expresión en una sola línea.`,
      )
    if (field.kind === 'parameters') {
      const params = value.split(',').map((p) => p.trim())
      if (!params.every(isPythonName) || new Set(params).size !== params.length)
        throw new Error(
          'Los parámetros deben ser nombres válidos, distintos y separados por comas.',
        )
    }
    if (field.options && !field.options.includes(value))
      throw new Error('Selecciona una opción válida.')
  }
  if (action.id === 'while' && Number(values.step) === 0)
    throw new Error('El cambio no puede ser cero: el contador nunca avanzaría.')
  return action.generate(values)
}
export function detectedVariables(source: string) {
  return [
    ...new Set(
      [...source.matchAll(/^\s*([\p{L}_][\p{L}\p{N}_]*)\s*=(?!=)/gmu)].map(
        (m) => m[1],
      ),
    ),
  ].filter(isPythonName)
}
