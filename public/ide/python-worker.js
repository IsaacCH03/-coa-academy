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
const COA_GUI_MODULE = `
_window = None

def _number(value, name):
    if not isinstance(value, (int, float)):
        raise TypeError(f"{name} debe ser un número")
    return round(value)

class Tk:
    def __init__(self):
        global _window
        self._title = "Mi interfaz"
        self._width = 500
        self._height = 400
        self._controls = []
        self._shown = False
        _window = self

    def title(self, text):
        self._title = str(text)

    def geometry(self, value):
        parts = str(value).lower().split("x")
        if len(parts) != 2 or not all(part.isdigit() for part in parts):
            raise ValueError('geometry() espera un valor como "500x400"')
        self._width = max(1, int(parts[0]))
        self._height = max(1, int(parts[1]))

    def mainloop(self):
        self._shown = True

class _Widget:
    def __init__(self, parent, text=None):
        if not isinstance(parent, Tk):
            raise TypeError("El primer argumento debe ser una ventana gui.Tk()")
        self._parent = parent
        self._text = None if text is None else str(text)
        self._place = None
        self._id = len(parent._controls)
        parent._controls.append(self)

    def place(self, *, x, y, width, height):
        self._place = {
            "x": _number(x, "x"), "y": _number(y, "y"),
            "width": max(1, _number(width, "width")),
            "height": max(1, _number(height, "height")),
        }

    def config(self, *, text):
        self._text = str(text)

class Label(_Widget):
    def __init__(self, parent, text=""):
        super().__init__(parent, text)

class Entry(_Widget):
    def __init__(self, parent):
        super().__init__(parent)
        self._value = ""

    def get(self):
        return self._value

    def delete(self, first, last=None):
        if first != 0 or last != "end":
            raise ValueError('delete() solo admite (0, "end") en esta versión')
        self._value = ""

class Button(_Widget):
    def __init__(self, parent, text="", command=None):
        super().__init__(parent, text)
        if command is not None and not callable(command):
            raise TypeError("command debe ser una función")
        self._command = command

class Frame(_Widget):
    def __init__(self, parent):
        super().__init__(parent)

def _coa_snapshot():
    if _window is None or not _window._shown:
        return None
    controls = []
    for widget in _window._controls:
        if widget._place is None:
            continue
        item = {"id": widget._id, "type": widget.__class__.__name__, **widget._place}
        if widget._text is not None:
            item["text"] = widget._text
        if isinstance(widget, Entry):
            item["value"] = widget._value
        if isinstance(widget, Button):
            item["command"] = widget._command is not None
        controls.append(item)
    return {
        "title": _window._title,
        "width": _window._width,
        "height": _window._height,
        "controls": controls,
    }

def _coa_invoke(widget_id, values):
    if _window is None or not _window._shown:
        raise RuntimeError("La ventana COA GUI no está activa")
    for widget in _window._controls:
        if isinstance(widget, Entry):
            widget._value = str(values.get(str(widget._id), ""))
    widget = next((item for item in _window._controls if item._id == widget_id), None)
    if not isinstance(widget, Button):
        raise ValueError("El control seleccionado no es un Button")
    if widget._command is not None:
        widget._command()
    return _coa_snapshot()
`
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
      python.FS.writeFile('/home/pyodide/coa_gui.py', COA_GUI_MODULE)
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
  if (data.type === 'gui-event' && python) {
    try {
      python.globals.set('__coa_widget_id', data.controlId)
      python.globals.set('__coa_values', JSON.stringify(data.values))
      const guiJson = await python.runPythonAsync(`
import coa_gui as __coa_gui, json as __coa_json
__coa_json.dumps(__coa_gui._coa_invoke(__coa_widget_id, __coa_json.loads(__coa_values)))
`)
      flush()
      self.postMessage({ type: 'gui-update', gui: JSON.parse(guiJson) })
    } catch (error) {
      const message = String(error)
      pending += '\n' + message + '\n'
      flush()
      self.postMessage({ type: 'python-error', text: message })
      self.postMessage({ type: 'gui-error', text: message })
    }
    return
  }
  if (data.type === 'analyze-gui' && python) {
    try {
      python.globals.set('__coa_import_source', data.source)
      const result = await python.runPythonAsync(`
import ast as __ast, json as __json

def __coa_range(node):
    lines = __coa_import_source.splitlines(keepends=True)
    def offset(line, column):
        before = ''.join(lines[:line - 1])
        current = lines[line - 1].encode('utf-8')[:column].decode('utf-8')
        return len(before) + len(current)
    return [offset(node.lineno, node.col_offset), offset(node.end_lineno, node.end_col_offset)]

def __coa_literal(node, kind):
    if not isinstance(node, __ast.Constant):
        return None
    if kind == 'text' and isinstance(node.value, str):
        return node.value
    if kind == 'number' and isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
        return round(node.value)
    return None

try:
    tree = __ast.parse(__coa_import_source)
except SyntaxError:
    __coa_result = {'ok': False, 'reason': 'syntax'}
else:
    import_node = None
    for node in tree.body:
        if isinstance(node, __ast.Import) and any(alias.name == 'coa_gui' and alias.asname == 'gui' for alias in node.names):
            import_node = node
            break
    window_node = None
    window_name = None
    for node in tree.body:
        if (isinstance(node, __ast.Assign) and len(node.targets) == 1 and
            isinstance(node.targets[0], __ast.Name) and isinstance(node.value, __ast.Call) and
            isinstance(node.value.func, __ast.Attribute) and node.value.func.attr == 'Tk' and
            isinstance(node.value.func.value, __ast.Name) and node.value.func.value.id == 'gui'):
            window_node = node
            window_name = node.targets[0].id
            break
    if import_node is None or window_node is None:
        __coa_result = {'ok': False, 'reason': 'missing'}
    else:
        title = 'Mi interfaz'
        width, height = 500, 400
        title_range = None
        geometry_range = None
        mainloop_start = len(__coa_import_source)
        creations = {}
        places = {}
        gui_ranges = [__coa_range(window_node.value.func.value)]
        warning = False
        supported = {'Tk', 'Label', 'Entry', 'Button', 'Frame'}
        for call in (item for item in __ast.walk(tree) if isinstance(item, __ast.Call)):
            if isinstance(call.func, __ast.Attribute):
                if isinstance(call.func.value, __ast.Name) and call.func.value.id == 'gui' and call.func.attr not in supported:
                    warning = True
                if call.func.attr in {'pack', 'grid'}:
                    warning = True
        for node in tree.body:
            if isinstance(node, __ast.Expr) and isinstance(node.value, __ast.Call) and isinstance(node.value.func, __ast.Attribute):
                call = node.value
                owner = call.func.value
                if isinstance(owner, __ast.Name) and owner.id == window_name and call.func.attr in {'title', 'geometry', 'mainloop'}:
                    if call.func.attr == 'mainloop':
                        mainloop_start = __coa_range(node)[0]
                    elif len(call.args) == 1:
                        value = __coa_literal(call.args[0], 'text')
                        if value is None:
                            warning = True
                        elif call.func.attr == 'title':
                            title, title_range = value, __coa_range(call.args[0])
                        else:
                            parts = value.lower().split('x')
                            if len(parts) == 2 and all(part.isdigit() for part in parts):
                                width, height = int(parts[0]), int(parts[1])
                                geometry_range = __coa_range(call.args[0])
                            else:
                                warning = True
                elif isinstance(owner, __ast.Name) and call.func.attr == 'place':
                    places[owner.id] = (node, call)
            if (isinstance(node, __ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], __ast.Name) and
                isinstance(node.value, __ast.Call) and isinstance(node.value.func, __ast.Attribute) and
                isinstance(node.value.func.value, __ast.Name) and node.value.func.value.id == 'gui' and
                node.value.func.attr in {'Label', 'Entry', 'Button', 'Frame'}):
                creations[node.targets[0].id] = node
                gui_ranges.append(__coa_range(node.value.func.value))
        controls = []
        sources = {}
        for name, create in creations.items():
            placed = places.get(name)
            if placed is None:
                warning = True
                continue
            place_node, place_call = placed
            place_keywords = {keyword.arg: keyword.value for keyword in place_call.keywords if keyword.arg}
            if not all(key in place_keywords for key in ('x', 'y', 'width', 'height')):
                warning = True
                continue
            values = {key: __coa_literal(place_keywords[key], 'number') for key in ('x', 'y', 'width', 'height')}
            if any(value is None for value in values.values()):
                warning = True
                continue
            keywords = {keyword.arg: keyword.value for keyword in create.value.keywords if keyword.arg}
            unsupported_keywords = set(keywords) - {'text', 'command'}
            if unsupported_keywords:
                warning = True
            text = None
            if 'text' in keywords:
                text = __coa_literal(keywords['text'], 'text')
                if text is None:
                    warning = True
            elif create.value.func.attr in {'Label', 'Button'}:
                text = ''
            command = keywords.get('command')
            command_name = command.id if isinstance(command, __ast.Name) else None
            if command is not None and command_name is None:
                warning = True
            source_key = name
            control = {
                'id': 'import-' + name, 'type': create.value.func.attr, 'variableName': name,
                'x': values['x'], 'y': values['y'], 'width': values['width'], 'height': values['height'],
                'sourceKey': source_key,
            }
            if text is not None:
                control['text'] = text
            if command_name:
                control['commandName'] = command_name
            controls.append(control)
            sources[source_key] = {
                'createRange': __coa_range(create), 'placeRange': __coa_range(place_node),
                'nameRanges': [__coa_range(item) for item in __ast.walk(tree) if isinstance(item, __ast.Name) and item.id == name],
                'constructorEnd': __coa_range(create.value)[1] - 1,
                'xRange': __coa_range(place_keywords['x']), 'yRange': __coa_range(place_keywords['y']),
                'widthRange': __coa_range(place_keywords['width']), 'heightRange': __coa_range(place_keywords['height']),
            }
            if 'text' in keywords:
                sources[source_key]['textRange'] = __coa_range(keywords['text'])
        if not controls and creations:
            warning = True
        __coa_result = {
            'ok': True,
            'warning': warning,
            'design': {
                'window': {'title': title, 'width': width, 'height': height},
                'controls': controls,
                'importedSource': {
                    'source': __coa_import_source, 'importRange': __coa_range(import_node),
                    'guiRanges': gui_ranges, 'titleRange': title_range, 'geometryRange': geometry_range,
                    'mainloopStart': mainloop_start, 'windowName': window_name,
                    'windowCreateEnd': __coa_range(window_node)[1], 'controls': sources,
                    'warning': warning,
                },
            },
        }
__json.dumps(__coa_result)
`)
      self.postMessage({ type: 'analyze-result', result: JSON.parse(result) })
    } catch (error) {
      self.postMessage({ type: 'analyze-error', text: String(error) })
    }
    return
  }
  if (data.type === 'analyze-builder' && python) {
    try {
      python.globals.set('__coa_builder_source', data.source)
      python.globals.set('__coa_builder_offset', data.offset)
      const result = await python.runPythonAsync(`
import ast as __ast, json as __json
try:
    __coa_builder_tree = __ast.parse(__coa_builder_source[:__coa_builder_offset])
except SyntaxError:
    __coa_builder_result = {'valid': False, 'variables': [], 'classes': []}
else:
    __coa_variables = {}
    __coa_classes = []
    def __coa_kind(value):
        if isinstance(value, __ast.List): return 'list'
        if isinstance(value, __ast.Dict): return 'dict'
        if isinstance(value, __ast.Tuple): return 'tuple'
        if isinstance(value, __ast.Set): return 'set'
        if isinstance(value, __ast.Constant):
            if isinstance(value.value, str): return 'string'
            if isinstance(value.value, (int, float)) and not isinstance(value.value, bool): return 'number'
            if isinstance(value.value, bool): return 'boolean'
        if isinstance(value, __ast.Call) and isinstance(value.func, __ast.Name):
            if value.func.id == 'input': return 'input'
            if value.func.id in ('int', 'float'): return 'number'
            if value.func.id in ('list', 'dict', 'tuple', 'set'): return value.func.id
        return 'unknown'
    for __coa_node in __coa_builder_tree.body:
        if isinstance(__coa_node, (__ast.Assign, __ast.AnnAssign)):
            __coa_targets = __coa_node.targets if isinstance(__coa_node, __ast.Assign) else [__coa_node.target]
            for __coa_target in __coa_targets:
                if isinstance(__coa_target, __ast.Name):
                    __coa_variables[__coa_target.id] = __coa_kind(__coa_node.value)
        elif isinstance(__coa_node, (__ast.For, __ast.AsyncFor)) and isinstance(__coa_node.target, __ast.Name):
            __coa_variables[__coa_node.target.id] = 'loop'
        elif isinstance(__coa_node, __ast.ClassDef):
            __coa_params, __coa_methods = [], []
            for __coa_item in __coa_node.body:
                if isinstance(__coa_item, (__ast.FunctionDef, __ast.AsyncFunctionDef)):
                    if __coa_item.name == '__init__':
                        __coa_params = [arg.arg for arg in __coa_item.args.args if arg.arg != 'self']
                    elif not __coa_item.name.startswith('_'):
                        __coa_methods.append(__coa_item.name)
            __coa_classes.append({
                'name': __coa_node.name, 'parameters': __coa_params,
                'methods': __coa_methods,
                'bases': [base.id for base in __coa_node.bases if isinstance(base, __ast.Name)],
            })
    __coa_builder_result = {
        'valid': True,
        'variables': [{'name': name, 'kind': kind} for name, kind in __coa_variables.items()],
        'classes': __coa_classes,
    }
__json.dumps(__coa_builder_result)
`)
      self.postMessage({ type: 'builder-result', result: JSON.parse(result) })
    } catch (error) {
      self.postMessage({ type: 'builder-error', text: String(error) })
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
  let gui
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
__sys.path.insert(0, '/home/pyodide')
__sys.modules.pop('coa_gui', None)
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
    const guiJson = python.runPython(`
import sys as __coa_sys, json as __coa_json
__coa_module = __coa_sys.modules.get('coa_gui')
__coa_json.dumps(__coa_module._coa_snapshot()) if __coa_module else 'null'
`)
    gui = JSON.parse(guiJson)
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
      gui: testing ? undefined : gui,
      entries: testing ? undefined : snapshot(),
    })
  } catch {
    self.postMessage({ type: 'done', ok, output })
  }
}
