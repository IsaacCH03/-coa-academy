export function explainCode(code: string): string[] {
  const c = code.trim()
  const result: string[] = []
  const assignment = c.match(/^([\p{L}_][\p{L}\p{N}_]*)\s*=(?!=)/u)
  if (assignment)
    result.push(
      `${assignment[1]} es el nombre de la variable. = guarda el resultado en ella.`,
    )
  if (/\binput\(/.test(c))
    result.push('input(...) solicita información al usuario y devuelve texto.')
  if (/\bint\(/.test(c))
    result.push('int(...) convierte un valor a un número entero.')
  if (/\bfloat\(/.test(c))
    result.push('float(...) convierte un valor a un número decimal.')
  if (/\bprint\(/.test(c))
    result.push('print(...) muestra un valor o mensaje en la consola.')
  if (/^if\b/.test(c))
    result.push(
      'if ejecuta el bloque indentado cuando la condición es verdadera.',
    )
  if (/^for\b/.test(c))
    result.push(
      'for repite el bloque para cada elemento. range() excluye su límite final.',
    )
  if (/^while\b/.test(c))
    result.push(
      'while repite el bloque mientras la condición sea verdadera. Debe existir una forma de terminar.',
    )
  if (/^def\b/.test(c))
    result.push(
      'def define una función. Sus parámetros reciben datos cuando la llamas.',
    )
  if (/^return\b/.test(c))
    result.push('return termina una función y devuelve el resultado indicado.')
  if (/^#/.test(c))
    result.push('Este es un comentario: documenta el código y no se ejecuta.')
  return result.length
    ? result
    : ['Esta estructura todavía no está disponible en el asistente.']
}
export function educationalHints(source: string, error = ''): string[] {
  const hints: string[] = []
  if (/^\s*\d[\p{L}\p{N}_]*\s*=(?!=)/mu.test(source))
    hints.push(
      'Los nombres de variables no pueden comenzar con un número. Prueba un nombre que empiece con una letra o _.',
    )
  if (/^\s*(?:if|elif|while)\s+[^\n]*[^=!<>]=[^=]/m.test(source))
    hints.push(
      'Para comparar valores normalmente necesitas ==; = se utiliza para asignar.',
    )
  if (
    source
      .split('\n')
      .some(
        (l) =>
          /^\s*(if |elif |else\s*$|for |while |def )/.test(l) &&
          !l.split('#')[0].trimEnd().endsWith(':'),
      )
  )
    hints.push('Revisa si falta : al final de una condición, función o ciclo.')
  for (const match of source.matchAll(/^\s*(\w+)\s*=\s*input\(/gm)) {
    if (new RegExp(`\\b${match[1]}\\s*[<>]=?\\s*\\d`).test(source))
      hints.push(
        `input() devuelve texto. Si comparas ${match[1]} con un número, considera int() o float().`,
      )
  }
  const missing = error.match(/NameError: name '([^']+)' is not defined/)
  if (missing)
    hints.push(
      `Python intenta utilizar '${missing[1]}', pero no encuentra ese nombre definido anteriormente.`,
    )
  if (/IndentationError|TabError/.test(error))
    hints.push(
      'Revisa la indentación: utiliza cuatro espacios por nivel y evita mezclar tabulaciones y espacios.',
    )
  if (/ValueError/.test(error))
    hints.push(
      'Revisa el dato recibido. Por ejemplo, int() necesita un texto que represente un entero.',
    )
  if (/TypeError/.test(error))
    hints.push(
      'Revisa los tipos de datos de la operación: texto y números no siempre pueden combinarse directamente.',
    )
  if (/SyntaxError/.test(error))
    hints.push(
      'Revisa la línea indicada por Python: comillas, paréntesis, dos puntos y nombres.',
    )
  if (/^\s*(?:from|import)\s+tkinter\b/m.test(source))
    hints.push(
      'Tkinter necesita un entorno de escritorio y no puede ejecutarse directamente dentro del IDE web de COA.',
    )
  return [...new Set(hints)]
}
