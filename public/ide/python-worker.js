/* Dedicated worker: student Python never runs on the COA server or UI thread. */
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
let python
let inputBuffer
let pending = ''
let printed = 0
let lastFlush = 0
let truncated = false
let output = ''
let testing = false
const LIMIT = 200000
const decoder = new TextDecoder()
function flush() {
  if (pending) {
    self.postMessage({ type: 'output', text: pending })
    pending = ''
  }
  lastFlush = Date.now()
}
function write(buffer) {
  const text = decoder.decode(buffer, { stream: true })
  if (printed < LIMIT) {
    const chunk = text.slice(0, LIMIT - printed)
    printed += chunk.length
    output += chunk
    pending += chunk
    if (Date.now() - lastFlush > 60) flush()
  } else if (!truncated) {
    pending +=
      '\n[Salida limitada a 200.000 caracteres. Puedes detener el programa.]\n'
    truncated = true
    flush()
  }
  return buffer.length
}
function removeTree(path) {
  for (const name of python.FS.readdir(path)) {
    if (name === '.' || name === '..') continue
    const child = path + '/' + name
    if (python.FS.isDir(python.FS.stat(child).mode)) {
      removeTree(child)
      python.FS.rmdir(child)
    } else python.FS.unlink(child)
  }
}
function snapshot(
  path = '/home/coa',
  prefix = '',
  result = [],
  budget = { bytes: 0 },
) {
  for (const name of python.FS.readdir(path)) {
    if (
      name === '.' ||
      name === '..' ||
      name === '__pycache__' ||
      result.length >= 300
    )
      continue
    const full = path + '/' + name
    const stat = python.FS.lstat(full)
    const relative = prefix + name
    if (python.FS.isDir(stat.mode)) {
      result.push({ path: relative, kind: 'folder', content: '' })
      snapshot(full, relative + '/', result, budget)
    } else if (
      python.FS.isFile(stat.mode) &&
      /\.(py|txt|csv|json|md)$/i.test(name) &&
      stat.size <= 1048576 &&
      budget.bytes + stat.size <= 8388608
    ) {
      budget.bytes += stat.size
      result.push({
        path: relative,
        kind: 'file',
        content: python.FS.readFile(full, { encoding: 'utf8' }),
      })
    }
  }
  return result
}
self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    try {
      inputBuffer = data.inputBuffer
      importScripts(PYODIDE_URL + 'pyodide.js')
      python = await self.loadPyodide({
        indexURL: PYODIDE_URL,
        stdout: () => {},
        stderr: () => {},
      })
      python.FS.mkdirTree('/home/coa')
      self.postMessage({ type: 'ready' })
    } catch (error) {
      self.postMessage({
        type: 'fatal',
        text:
          'No se pudo cargar Python. Revisa tu conexión e inténtalo de nuevo. ' +
          String(error),
      })
    }
    return
  }
  if (data.type !== 'run' || !python) return
  pending = ''
  output = ''
  printed = 0
  truncated = false
  testing = Array.isArray(data.inputs)
  let ok = true
  try {
    python.FS.chdir('/home/pyodide')
    removeTree('/home/coa')
    for (const entry of data.entries) {
      if (
        !entry.path ||
        entry.path.startsWith('/') ||
        entry.path.split('/').some((p) => !p || p === '..' || p === '.')
      )
        throw new Error('Ruta de archivo inválida')
      const path = '/home/coa/' + entry.path
      if (entry.kind === 'folder') python.FS.mkdirTree(path)
      else {
        python.FS.mkdirTree(path.slice(0, path.lastIndexOf('/')))
        python.FS.writeFile(path, entry.content)
      }
    }
    python.FS.chdir('/home/coa')
    python.setStdout({ write })
    python.setStderr({ write })
    python.setStdin({
      stdin: () => {
        flush()
        if (!inputBuffer)
          throw new Error(
            'input() necesita aislamiento del navegador. Recarga /ide usando HTTPS o localhost.',
          )
        const control = new Int32Array(inputBuffer, 0, 2)
        Atomics.store(control, 0, 0)
        self.postMessage({ type: 'input' })
        Atomics.wait(control, 0, 0)
        const length = Atomics.load(control, 1)
        // TextDecoder requires a non-shared ArrayBuffer view in browsers.
        return new TextDecoder().decode(
          new Uint8Array(inputBuffer, 8, length).slice(),
        )
      },
    })
    python.globals.set('__coa_entry', '/home/coa/' + data.active)
    python.globals.set('__coa_inputs', JSON.stringify(data.inputs ?? null))
    await python.runPythonAsync(`
import sys as __sys, importlib as __importlib, builtins as __builtins, json as __json, os as __os
for __name, __module in list(__sys.modules.items()):
    if str(getattr(__module, '__file__', '')).startswith('/home/coa/'):
        del __sys.modules[__name]
__sys.path[:] = [p for p in __sys.path if not p.startswith('/home/coa')]
__sys.path.insert(0, '/home/coa')
__sys.path.insert(0, __os.path.dirname(__coa_entry))
__importlib.invalidate_caches()
__original_input = __builtins.input
__test_inputs = __json.loads(__coa_inputs)
if __test_inputs is not None:
    __input_iterator = iter(__test_inputs)
    def __test_input(prompt=''):
        try:
            return next(__input_iterator)
        except StopIteration:
            raise EOFError('El ejercicio pidió más entradas de las previstas')
    __builtins.input = __test_input
try:
    with open(__coa_entry, encoding='utf-8') as __source:
        exec(compile(__source.read(), __coa_entry, 'exec'), {'__name__': '__main__', '__file__': __coa_entry})
finally:
    __builtins.input = __original_input
`)
  } catch (error) {
    ok = false
    const message = String(error)
    pending += '\n' + message + '\n'
    self.postMessage({ type: 'python-error', text: message })
  }
  flush()
  try {
    self.postMessage({
      type: 'done',
      ok,
      output,
      entries: testing ? undefined : snapshot(),
    })
  } catch {
    self.postMessage({ type: 'done', ok, output })
  }
}
