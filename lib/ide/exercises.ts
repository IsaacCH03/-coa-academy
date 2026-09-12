export type Exercise = {
  id: string
  title: string
  description: string
  initialCode: string
  steps: string[]
  hints: string[]
  tests: { inputs: string[]; expected: string }[]
}
export const exercises: Exercise[] = [
  {
    id: 'hello',
    title: 'Tu primer saludo',
    description: 'Muestra exactamente Hola COA en la consola.',
    initialCode: '# Muestra tu saludo aquí\n',
    steps: ['Escribir un mensaje con print'],
    hints: [
      'Piensa qué instrucción muestra mensajes.',
      'Los textos en Python se escriben entre comillas.',
    ],
    tests: [{ inputs: [], expected: 'Hola COA' }],
  },
  {
    id: 'sum',
    title: 'Suma dos números',
    description:
      'Pide dos enteros, uno por uno, y muestra únicamente su suma. Puedes escribir mensajes en input().',
    initialCode: '# Pide dos números y muestra su suma\n',
    steps: [
      'Pedir primer número',
      'Pedir segundo número',
      'Sumarlos',
      'Mostrar resultado',
    ],
    hints: [
      'input() devuelve texto. ¿Cómo lo convertirías a un entero?',
      'Guarda cada número en una variable y utiliza el operador de suma.',
    ],
    tests: [
      { inputs: ['3', '5'], expected: '8' },
      { inputs: ['-2', '7'], expected: '5' },
    ],
  },
  {
    id: 'greater',
    title: '¿Cuál es mayor?',
    description:
      'Solicita dos enteros y muestra solamente el mayor. Si son iguales, muestra ese número.',
    initialCode: '# Compara los dos números\n',
    steps: [
      'Pedir primer número',
      'Pedir segundo número',
      'Compararlos',
      'Mostrar resultado',
    ],
    hints: [
      'Piensa qué estructura permite tomar una decisión.',
      'Recuerda considerar qué sucede cuando ambos números son iguales.',
    ],
    tests: [
      { inputs: ['10', '5'], expected: '10' },
      { inputs: ['2', '9'], expected: '9' },
      { inputs: ['4', '4'], expected: '4' },
    ],
  },
]
export const matchesOutput = (output: string, expected: string) =>
  output.replace(/\r\n/g, '\n').trim() === expected.trim()
