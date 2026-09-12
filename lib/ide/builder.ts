export type Field = {
  key: string
  label: string
  value: string
  kind?: 'name' | 'number' | 'integer' | 'expression' | 'parameters'
  options?: string[]
  hint?: string
}
export type BuilderAction = {
  id: string
  title: string
  category: string
  description: string
  fields: Field[]
  template: string
  generate: (v: Record<string, string>) => string
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
]
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
