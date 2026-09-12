import type { Monaco } from '@monaco-editor/react'

const configured = new WeakSet<object>()
export function configurePython(monaco: Monaco) {
  if (configured.has(monaco)) return
  configured.add(monaco)
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      return {
        suggestions: [
          ['print', 'print(${1:"Hola"})', 'Muestra un valor en la consola.'],
          [
            'input',
            'input(${1:"Mensaje: "})',
            'Solicita un dato y devuelve texto.',
          ],
          ['int', 'int(${1:valor})', 'Convierte un dato a entero.'],
          ['float', 'float(${1:valor})', 'Convierte un dato a número decimal.'],
          ['str', 'str(${1:valor})', 'Convierte un dato a texto.'],
          [
            'range',
            'range(${1:10})',
            'Produce una secuencia; no incluye el límite final.',
          ],
          ['len', 'len(${1:lista})', 'Cuenta los elementos.'],
          ['sum', 'sum(${1:numeros})', 'Suma los elementos numéricos.'],
          ['max', 'max(${1:numeros})', 'Devuelve el valor mayor.'],
          ['min', 'min(${1:numeros})', 'Devuelve el valor menor.'],
        ].map(([label, insertText, documentation]) => ({
          label,
          insertText,
          documentation,
          detail: 'Python · COA',
          kind: monaco.languages.CompletionItemKind.Function,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        })),
      }
    },
  })
}
