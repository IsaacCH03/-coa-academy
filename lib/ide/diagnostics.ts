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
  path?: string
  origin?: 'static' | 'runtime'
}
export type RuntimeDiagnostic = {
  title: string
  explanation: string
  line?: number
  column?: number
  path?: string
  technical: string
}

const quoted = (message: string) =>
  message.match(/["']([^"']+)["']/)?.[1] ?? ''

export function explainRuntimeError(technical: string): RuntimeDiagnostic {
  const projectFrames = [...technical.matchAll(/File ["']\/home\/coa\/([^"']+)["'], line (\d+)/g)]
  const frame = projectFrames.at(-1)
  const lineMatches = [...technical.matchAll(/line (\d+)/g)]
  const line = Number(frame?.[2] ?? lineMatches.at(-1)?.[1]) || undefined
  const path = frame?.[1]
  const name = technical.match(/NameError: name ['"]([^'"]+)['"] is not defined/)?.[1]
  if (name)
    return {
      title: `La variable o nombre "${name}" no está definido.`,
      explanation: 'Revisa si lo creaste antes de utilizarlo o si escribiste correctamente su nombre.',
      line,
      technical, path,
    }
  if (/UnboundLocalError:/.test(technical))
    return { title: 'Se usó una variable local antes de asignarle un valor.', explanation: 'Asigna un valor dentro de la función antes de leer la variable.', line, path, technical }
  if (/unsupported operand type\(s\).*['"]int['"].*['"]str['"]|can only concatenate str/.test(technical))
    return { title: 'Estás intentando usar + entre un número y un texto.', explanation: 'Revisa si necesitas convertir alguno de los valores con int(), float() o str().', line, path, technical }
  const missingArgument = technical.match(/missing \d+ required positional argument[s]?: (.+)$/m)?.[1]
  if (missingArgument)
    return { title: 'Faltan argumentos al llamar esta función o método.', explanation: `Revisa los argumentos requeridos: ${missingArgument}.`, line, path, technical }
  if (/takes .* positional arguments? but .* (?:was|were) given/.test(technical))
    return { title: 'Se enviaron más argumentos de los que esta función acepta.', explanation: 'Revisa la definición de la función y la cantidad de valores enviados.', line, path, technical }
  if (/TypeError:/.test(technical))
    return { title: 'Una operación recibió un tipo de dato incompatible.', explanation: 'Revisa los valores y argumentos utilizados en la línea indicada.', line, path, technical }
  const invalidInteger = technical.match(/invalid literal for int\(\) with base 10: ['"]([^'"]*)['"]/)?.[1]
  if (invalidInteger !== undefined)
    return { title: `No se pudo convertir "${invalidInteger}" a un número entero.`, explanation: 'Revisa el valor que estás enviando a int().', line, path, technical }
  if (/ValueError:/.test(technical))
    return { title: 'Python recibió un valor que no puede utilizar en esa operación.', explanation: 'Revisa el contenido y formato del valor indicado.', line, path, technical }
  if (/ZeroDivisionError:/.test(technical))
    return { title: 'No puedes dividir entre cero.', explanation: 'Revisa el valor utilizado como divisor.', line, path, technical }
  if (/IndexError:/.test(technical))
    return { title: 'Intentaste acceder a una posición que no existe.', explanation: 'Revisa el índice y la cantidad de elementos de la lista.', line, path, technical }
  if (/KeyError:/.test(technical)) {
    const key = quoted(technical.split('KeyError:').at(-1) ?? '')
    return { title: key ? `No se encontró la clave "${key}" en el diccionario.` : 'No se encontró esa clave en el diccionario.', explanation: 'Revisa que la clave exista y esté escrita correctamente.', line, path, technical }
  }
  if (/FileNotFoundError:/.test(technical)) {
    const file = technical.match(/No such file or directory: ['"]([^'"]+)['"]/)?.[1]
    return { title: file ? `No se encontró el archivo "${file}".` : 'No se encontró el archivo solicitado.', explanation: 'Revisa el nombre, la extensión y la carpeta donde está guardado.', line, path, technical }
  }
  if (/PermissionError:/.test(technical))
    return { title: 'Python no tiene permiso para acceder a este recurso.', explanation: 'Revisa la ruta y los permisos disponibles en el entorno.', line, path, technical }
  const moduleName = technical.match(/No module named ['"]([^'"]+)['"]/)?.[1]
  if (/ModuleNotFoundError:|ImportError:/.test(technical))
    return { title: moduleName ? `Python no encontró el módulo "${moduleName}".` : 'No se pudo completar el import.', explanation: 'Revisa el nombre de la carpeta, del archivo y la ruta utilizada en el import. Si es externo, este entorno puede requerir cargar el paquete.', line, path, technical }
  const attribute = technical.match(/AttributeError: ['"]([^'"]+)['"] object has no attribute ['"]([^'"]+)['"]/) 
  if (attribute)
    return { title: `El objeto ${attribute[1]} no tiene un atributo o método llamado "${attribute[2]}".`, explanation: 'Revisa la escritura del atributo o los métodos definidos en su clase.', line, path, technical }
  if (/RecursionError:/.test(technical))
    return { title: 'La función se llamó demasiadas veces a sí misma.', explanation: 'Revisa que la recursión tenga una condición que permita terminar.', line, path, technical }
  if (/OverflowError:/.test(technical))
    return { title: 'El resultado numérico es demasiado grande para esta operación.', explanation: 'Revisa los valores y reduce el tamaño del cálculo.', line, path, technical }
  if (/StopIteration(?::|$)/.test(technical))
    return { title: 'Se intentó obtener otro elemento, pero el recorrido ya terminó.', explanation: 'Revisa el uso de next() o del iterador.', line, path, technical }
  if (/AssertionError(?::|$)/.test(technical))
    return { title: 'No se cumplió una condición indicada con assert.', explanation: 'Revisa la condición y los valores que esperaba el programa.', line, path, technical }
  if (/RuntimeError:/.test(technical))
    return { title: 'Python encontró un problema durante la ejecución.', explanation: 'Revisa la operación indicada y el detalle técnico.', line, path, technical }
  if (/IndentationError:|TabError:/.test(technical))
    return { title: 'Hay un problema real con la indentación.', explanation: 'Revisa los espacios o tabs al comienzo de la línea indicada.', line, path, technical }
  if (/SyntaxError:/.test(technical))
    return { title: 'Python encontró un error de sintaxis.', explanation: 'Revisa la estructura y los signos de la línea indicada.', line, path, technical }
  return { title: 'Ocurrió un error de Python que COA todavía no puede explicar completamente.', explanation: 'Revisa la línea indicada y consulta el detalle técnico.', line, path, technical }
}
