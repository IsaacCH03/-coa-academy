export type DiagnosticSeverity = 'error' | 'warning' | 'suggestion'
export type DiagnosticFix = {
  title: string
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
  text: string
}
export type CodeDiagnostic = {
  id: string
  severity: DiagnosticSeverity
  line: number
  column: number
  endLine: number
  endColumn: number
  message: string
  explanation: string
  technical?: string
  fix?: DiagnosticFix
}
export type RuntimeDiagnostic = {
  title: string
  explanation: string
  line?: number
  technical: string
}

const quoted = (message: string) =>
  message.match(/["']([^"']+)["']/)?.[1] ?? ''

export function explainRuntimeError(technical: string): RuntimeDiagnostic {
  const lineMatches = [...technical.matchAll(/line (\d+)/g)]
  const line = Number(lineMatches.at(-1)?.[1]) || undefined
  const name = technical.match(/NameError: name ['"]([^'"]+)['"] is not defined/)?.[1]
  if (name)
    return {
      title: `La variable o nombre "${name}" no está definido.`,
      explanation: 'Revisa si lo creaste antes de utilizarlo o si escribiste correctamente su nombre.',
      line,
      technical,
    }
  if (/UnboundLocalError:/.test(technical))
    return { title: 'Se usó una variable local antes de asignarle un valor.', explanation: 'Asigna un valor dentro de la función antes de leer la variable.', line, technical }
  if (/unsupported operand type\(s\).*['"]int['"].*['"]str['"]|can only concatenate str/.test(technical))
    return { title: 'Estás intentando combinar valores de tipos incompatibles.', explanation: 'Uno de los valores es un número y el otro es texto. Revisa si necesitas int(), float() o str().', line, technical }
  if (/TypeError:/.test(technical))
    return { title: 'Una operación recibió un tipo de dato incompatible.', explanation: 'Revisa los valores y argumentos utilizados en la línea indicada.', line, technical }
  const invalidInteger = technical.match(/invalid literal for int\(\) with base 10: ['"]([^'"]*)['"]/)?.[1]
  if (invalidInteger !== undefined)
    return { title: `No se pudo convertir "${invalidInteger}" a un número entero.`, explanation: 'Revisa el valor que estás enviando a int().', line, technical }
  if (/ValueError:/.test(technical))
    return { title: 'Python recibió un valor que no puede utilizar en esa operación.', explanation: 'Revisa el contenido y formato del valor indicado.', line, technical }
  if (/ZeroDivisionError:/.test(technical))
    return { title: 'No puedes dividir entre cero.', explanation: 'Revisa el valor utilizado como divisor.', line, technical }
  if (/IndexError:/.test(technical))
    return { title: 'Intentaste acceder a una posición que no existe.', explanation: 'Revisa el índice y la cantidad de elementos de la lista.', line, technical }
  if (/KeyError:/.test(technical)) {
    const key = quoted(technical.split('KeyError:').at(-1) ?? '')
    return { title: key ? `No se encontró la clave "${key}" en el diccionario.` : 'No se encontró esa clave en el diccionario.', explanation: 'Revisa que la clave exista y esté escrita correctamente.', line, technical }
  }
  if (/FileNotFoundError:/.test(technical))
    return { title: 'No se encontró el archivo solicitado.', explanation: 'Revisa el nombre, la extensión y la carpeta donde está guardado.', line, technical }
  const moduleName = technical.match(/No module named ['"]([^'"]+)['"]/)?.[1]
  if (/ModuleNotFoundError:|ImportError:/.test(technical))
    return { title: moduleName ? `No se pudo encontrar el módulo "${moduleName}".` : 'No se pudo completar el import.', explanation: 'Revisa el nombre de la carpeta, del archivo y la ruta utilizada en el import.', line, technical }
  const attribute = technical.match(/AttributeError: ['"]([^'"]+)['"] object has no attribute ['"]([^'"]+)['"]/) 
  if (attribute)
    return { title: `El objeto ${attribute[1]} no tiene un atributo o método llamado "${attribute[2]}".`, explanation: 'Revisa la escritura del atributo o los métodos definidos en su clase.', line, technical }
  if (/RecursionError:/.test(technical))
    return { title: 'La función se llamó demasiadas veces a sí misma.', explanation: 'Revisa que la recursión tenga una condición que permita terminar.', line, technical }
  if (/IndentationError:|TabError:/.test(technical))
    return { title: 'Hay un problema real con la indentación.', explanation: 'Revisa los espacios o tabs al comienzo de la línea indicada.', line, technical }
  if (/SyntaxError:/.test(technical))
    return { title: 'Python encontró un error de sintaxis.', explanation: 'Revisa la estructura y los signos de la línea indicada.', line, technical }
  return { title: 'Ocurrió un error de Python que COA todavía no puede explicar completamente.', explanation: 'Revisa la línea indicada y consulta el detalle técnico.', line, technical }
}
