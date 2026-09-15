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
function requestDialog(kind, title, message) {
  if (!inputBuffer)
    throw new Error('Los diálogos COA GUI necesitan HTTPS o localhost.')
  const control = new Int32Array(inputBuffer, 0, 2)
  Atomics.store(control, 0, 0)
  self.postMessage({ type: 'gui-dialog', dialog: { kind: String(kind), title: String(title), message: String(message) } })
  Atomics.wait(control, 0, 0)
  const length = Atomics.load(control, 1)
  return decoder.decode(new Uint8Array(inputBuffer, 8, length).slice())
}
self.coaDialogRequest = requestDialog
const COA_GUI_MODULE = `
import json as _json
from js import coaDialogRequest as _coa_dialog_request

_window = None

def _dialog(kind, title, message):
    return _json.loads(str(_coa_dialog_request(kind, str(title), str(message))))

def showinfo(title, message):
    _dialog("showinfo", title, message)

def showwarning(title, message):
    _dialog("showwarning", title, message)

def showerror(title, message):
    _dialog("showerror", title, message)

def askstring(title, message):
    return _dialog("askstring", title, message)

def askinteger(title, message):
    return _dialog("askinteger", title, message)

def askfloat(title, message):
    return _dialog("askfloat", title, message)

def askyesno(title, message):
    return _dialog("askyesno", title, message)

def askokcancel(title, message):
    return _dialog("askokcancel", title, message)

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
  if (data.type === 'analyze-diagnostics' && python) {
    try {
      python.globals.set('__coa_diagnostic_entries', JSON.stringify(data.entries || []))
      const result = await python.runPythonAsync(`
import ast as __ast, builtins as __builtins, json as __json, re as __re

__coa_entries = __json.loads(__coa_diagnostic_entries)
__coa_files = {entry['path']: entry.get('content', '') for entry in __coa_entries if entry.get('kind') == 'file'}
__coa_python = {path: source for path, source in __coa_files.items() if path.endswith('.py')}
__coa_modules = {path[:-3].replace('/', '.'): path for path in __coa_python}
for __coa_path in list(__coa_python):
    __coa_parts = __coa_path[:-3].split('/')
    __coa_layer_at = next((index for index, part in enumerate(__coa_parts) if part in ('presentation', 'business', 'domain', 'data')), None)
    if __coa_layer_at is not None:
        __coa_modules['.'.join(__coa_parts[__coa_layer_at:])] = __coa_path
for __coa_path in list(__coa_python):
    if __coa_path.endswith('/__init__.py'):
        __coa_modules[__coa_path[:-12].replace('/', '.')] = __coa_path
__coa_trees, __coa_exports = {}, {}
__coa_external_uses, __coa_star_modules = set(), set()
for __coa_path, __coa_source in __coa_python.items():
    try:
        __coa_trees[__coa_path] = __ast.parse(__coa_source)
        __coa_exports[__coa_path] = {node.name for node in __coa_trees[__coa_path].body if isinstance(node, (__ast.FunctionDef, __ast.AsyncFunctionDef, __ast.ClassDef))}
        __coa_exports[__coa_path] |= {target.id for node in __coa_trees[__coa_path].body if isinstance(node, (__ast.Assign, __ast.AnnAssign)) for target in (node.targets if isinstance(node, __ast.Assign) else [node.target]) if isinstance(target, __ast.Name)}
    except (SyntaxError, IndentationError, TabError):
        pass
for __coa_importer, __coa_tree in __coa_trees.items():
    for __coa_import in (node for node in __ast.walk(__coa_tree) if isinstance(node, __ast.ImportFrom) and node.module):
        if any(alias.name == '*' for alias in __coa_import.names): __coa_star_modules.add(__coa_import.module)
        for alias in __coa_import.names: __coa_external_uses.add((__coa_import.module, alias.name))

def __coa_close_name(left, right):
    if abs(len(left) - len(right)) > 2: return False
    differences = [index for index, pair in enumerate(zip(left, right)) if pair[0] != pair[1]]
    if len(left) == len(right) and len(differences) == 2 and differences[1] == differences[0] + 1:
        first, second = differences
        if left[first] == right[second] and left[second] == right[first]: return True
    previous = list(range(len(right) + 1))
    for index, first in enumerate(left, 1):
        current = [index]
        for other, second in enumerate(right, 1):
            current.append(min(current[-1] + 1, previous[other] + 1, previous[other - 1] + (first != second)))
        previous = current
    distance = previous[-1]
    return distance <= 1 or (distance <= 2 and min(len(left), len(right)) >= 6)

def __coa_node_range(node):
    return node.lineno, node.col_offset + 1, getattr(node, 'end_lineno', node.lineno), getattr(node, 'end_col_offset', node.col_offset + 1) + 1

def __coa_item(path, kind, node, message, explanation, severity='error', fix=None):
    line, column, end_line, end_column = __coa_node_range(node)
    item = {'id': f'{path}-{kind}-{line}-{column}', 'path': path, 'origin': 'static', 'severity': severity,
            'line': line, 'column': column, 'endLine': end_line, 'endColumn': end_column,
            'message': message, 'explanation': explanation}
    if fix: item['fix'] = fix
    return item

def __coa_best(value, candidates):
    matches = [candidate for candidate in candidates if __coa_close_name(value, candidate)]
    return matches[0] if len(matches) == 1 else None

__coa_diagnostics = []
for __coa_path, __coa_diagnostic_source in __coa_python.items():
  try:
    __coa_tree = __ast.parse(__coa_diagnostic_source)
  except (SyntaxError, IndentationError, TabError) as error:
    line = max(1, error.lineno or 1)
    column = max(1, error.offset or 1)
    lines = __coa_diagnostic_source.splitlines()
    content = lines[line - 1] if line <= len(lines) else ''
    technical = f'{error.__class__.__name__}: {error.msg}'
    message = 'Hay un error de sintaxis en esta línea.'
    explanation = 'Revisa cómo está escrita la instrucción.'
    fix = None
    stripped = content.strip()
    block_words = ('if ', 'elif ', 'else', 'while ', 'for ', 'def ', 'class ', 'try', 'except', 'finally', 'match ', 'case ')
    assignment = __re.search(r'(?<![<>=!:])=(?!=)', content) if stripped.startswith(('if ', 'elif ', 'while ', 'case ')) else None
    if assignment and ('invalid syntax' in error.msg or "maybe you meant '=='" in error.msg):
        column = assignment.start() + 1
        message = 'Dentro de una condición no puedes usar "=" de esta manera.'
        explanation = 'Usa "==" cuando quieras comparar dos valores.'
        fix = {'title': 'Cambiar = por ==', 'startLine': line, 'startColumn': column, 'endLine': line, 'endColumn': column + 1, 'text': '=='}
    elif stripped.startswith(block_words) and not stripped.endswith(':') and ('expected' in error.msg and ':' in error.msg):
        kind = stripped.split()[0]
        message = f'Falta ":" al final del {kind}.'
        explanation = 'Python necesita ":" para indicar que a continuación comienza un bloque de código.'
        end = len(content) + 1
        fix = {'title': 'Agregar ":"', 'startLine': line, 'startColumn': end, 'endLine': line, 'endColumn': end, 'text': ':'}
        column = max(1, len(content))
    elif isinstance(error, TabError):
        message = 'Esta línea mezcla tabs y espacios de forma incompatible.'
        explanation = 'Usa cuatro espacios de manera consistente para cada nivel.'
    elif isinstance(error, IndentationError):
        if 'unexpected indent' in error.msg:
            message = 'Esta línea tiene una indentación inesperada.'
            explanation = 'Elimina la sangría que no pertenece a ningún bloque.'
        elif 'expected an indented block' in error.msg:
            message = 'Esta línea debe estar indentada dentro del bloque anterior.'
            explanation = 'Agrega cuatro espacios al comienzo o escribe pass si el bloque estará vacío.'
        else:
            message = 'La sangría no coincide con los bloques anteriores.'
            explanation = 'Revisa que cada nivel use cuatro espacios.'
        if 'expected an indented block' in error.msg and content and not content[0].isspace():
            fix = {'title': 'Indentar esta línea', 'startLine': line, 'startColumn': 1, 'endLine': line, 'endColumn': 1, 'text': '    '}
    elif 'was never closed' in error.msg or 'unterminated' in error.msg:
        message = 'Hay un paréntesis, corchete, llave o texto sin cerrar.'
        explanation = 'Revisa que cada signo de apertura tenga su cierre correspondiente.'
        pairs = [('(', ')'), ('[', ']'), ('{', '}')]
        missing = [close for opened, close in pairs if content.count(opened) == content.count(close) + 1]
        if len(missing) == 1:
            end = len(content) + 1
            fix = {'title': f'Agregar {missing[0]}', 'startLine': line, 'startColumn': end, 'endLine': line, 'endColumn': end, 'text': missing[0]}
    elif "'return' outside function" in error.msg:
        message, explanation = 'return solo puede usarse dentro de una función.', 'Mueve return al cuerpo de una función definida con def.'
    elif "'break' outside loop" in error.msg:
        message, explanation = 'break solo puede usarse dentro de un bucle.', 'Usa break dentro de for o while.'
    elif "'continue' not properly in loop" in error.msg:
        message, explanation = 'continue solo puede usarse dentro de un bucle.', 'Usa continue dentro de for o while.'
    __coa_diagnostics.append({
        'id': f'{__coa_path}-syntax-{line}-{column}', 'path': __coa_path, 'origin': 'static', 'severity': 'error', 'line': line,
        'column': column, 'endLine': line, 'endColumn': max(column + 1, len(content) + 1),
        'message': message, 'explanation': explanation, 'technical': technical, 'fix': fix,
    })
    continue
  else:
    definitions = {}
    loads = {}
    functions = {}
    classes = {}
    for imported in (item for item in __ast.walk(__coa_tree) if isinstance(item, __ast.ImportFrom) and item.module in __coa_modules):
        target_tree = __coa_trees.get(__coa_modules[imported.module])
        if target_tree:
            target_classes = {item.name: item for item in target_tree.body if isinstance(item, __ast.ClassDef)}
            for alias in imported.names:
                if alias.name in target_classes: classes[alias.asname or alias.name] = target_classes[alias.name]
    instances = {}
    literal_lists, literal_dicts = {}, {}
    imported_names = {}
    for node in __ast.walk(__coa_tree):
        if isinstance(node, __ast.Name) and isinstance(node.ctx, (__ast.Store, __ast.Param)):
            definitions[node.id] = min(definitions.get(node.id, node.lineno), node.lineno)
        elif isinstance(node, __ast.Name) and isinstance(node.ctx, __ast.Load):
            loads[node.id] = loads.get(node.id, 0) + 1
        elif isinstance(node, (__ast.FunctionDef, __ast.AsyncFunctionDef, __ast.ClassDef)):
            definitions[node.name] = node.lineno
            for arg in (node.args.args if hasattr(node, 'args') else []):
                definitions[arg.arg] = 0
            if isinstance(node, (__ast.FunctionDef, __ast.AsyncFunctionDef)):
                functions[node.name] = node
            else:
                classes[node.name] = node
        elif isinstance(node, (__ast.Import, __ast.ImportFrom)):
            for alias in node.names:
                local = alias.asname or alias.name.split('.')[0]
                definitions[local] = node.lineno
                imported_names[local] = node
        if isinstance(node, (__ast.Assign, __ast.AnnAssign)):
            targets = node.targets if isinstance(node, __ast.Assign) else [node.target]
            value = node.value
            for target in targets:
                if not isinstance(target, __ast.Name): continue
                if isinstance(value, __ast.List): literal_lists[target.id] = len(value.elts)
                if isinstance(value, __ast.Dict) and all(isinstance(key, __ast.Constant) for key in value.keys): literal_dicts[target.id] = {key.value for key in value.keys}
                if isinstance(value, __ast.Call) and isinstance(value.func, __ast.Name) and value.func.id in classes: instances[target.id] = value.func.id
    coa_api = {'Tk', 'Label', 'Entry', 'Button', 'Frame', 'showinfo', 'showwarning', 'showerror', 'askstring', 'askinteger', 'askfloat', 'askyesno', 'askokcancel'}
    coa_dialogs = {'showinfo', 'showwarning', 'showerror', 'askstring', 'askinteger', 'askfloat', 'askyesno', 'askokcancel'}
    coa_imported = any(isinstance(node, __ast.Import) and any(alias.name == 'coa_gui' and (alias.asname or alias.name) == 'gui' for alias in node.names) for node in __coa_tree.body)
    coa_calls = [node for node in __ast.walk(__coa_tree) if isinstance(node, __ast.Call) and isinstance(node.func, __ast.Attribute) and isinstance(node.func.value, __ast.Name) and node.func.value.id == 'gui']
    clear_coa_calls = [node for node in coa_calls if node.func.attr in coa_api or __coa_best(node.func.attr, coa_api)]
    coa_missing = bool(clear_coa_calls and not coa_imported and 'gui' not in definitions)
    if coa_missing:
        target = clear_coa_calls[0].func.value
        source_lines = __coa_diagnostic_source.splitlines()
        insert_line = 1
        while insert_line <= len(source_lines) and (not source_lines[insert_line - 1].strip() or source_lines[insert_line - 1].lstrip().startswith('#')):
            insert_line += 1
        body_index = 0
        if (__coa_tree.body and isinstance(__coa_tree.body[0], __ast.Expr) and isinstance(__coa_tree.body[0].value, __ast.Constant) and isinstance(__coa_tree.body[0].value.value, str)):
            insert_line = max(insert_line, __coa_tree.body[0].end_lineno + 1)
            body_index = 1
        for statement in __coa_tree.body[body_index:]:
            if isinstance(statement, (__ast.Import, __ast.ImportFrom)):
                insert_line = max(insert_line, statement.end_lineno + 1)
            else:
                break
        item = __coa_item(__coa_path, 'coa-import', target, 'COA GUI se está utilizando, pero no está importado.', 'Agrega el import oficial antes de utilizar gui.', 'warning')
        item['fix'] = {'title': 'Importar COA GUI', 'startLine': insert_line, 'startColumn': 1, 'endLine': insert_line, 'endColumn': 1, 'text': 'import coa_gui as gui\\n'}
        __coa_diagnostics.append(item)
    if coa_imported:
        for call in coa_calls:
            member = call.func.attr
            if member not in coa_api:
                suggestion = __coa_best(member, coa_api)
                item = __coa_item(__coa_path, 'coa-api', call.func, f'"{member}" no existe en COA GUI.', 'Revisa el nombre de la función o componente de COA GUI.')
                if suggestion:
                    item['explanation'] += f' ¿Querías escribir "{suggestion}"?'
                    item['fix'] = {'title': f'Cambiar a "{suggestion}"', 'startLine': call.func.lineno, 'startColumn': call.func.end_col_offset - len(member) + 1, 'endLine': call.func.end_lineno, 'endColumn': call.func.end_col_offset + 1, 'text': suggestion}
                __coa_diagnostics.append(item)
            elif member in coa_dialogs:
                received = len(call.args) + len(call.keywords)
                if received < 2:
                    message = f'{member} necesita un título y un mensaje.' if received == 0 else 'Falta el mensaje de la ventana emergente.'
                    __coa_diagnostics.append(__coa_item(__coa_path, 'coa-dialog-args', call, message, 'Agrega el título y el mensaje como los dos primeros argumentos.'))
    known = set(dir(__builtins)) | {'__name__', '__file__'}
    reported = set()
    for node in __ast.walk(__coa_tree):
        if not isinstance(node, __ast.Name) or not isinstance(node.ctx, __ast.Load): continue
        if node.id in known or definitions.get(node.id, node.lineno + 1) <= node.lineno or node.id in reported or (node.id == 'gui' and coa_missing): continue
        reported.add(node.id)
        later = node.id in definitions
        suggestion = __coa_best(node.id, [name for name, defined_line in definitions.items() if defined_line <= node.lineno])
        item = __coa_item(__coa_path, 'name', node,
            f'"{node.id}" se utiliza antes de ser definido.' if later else f'La variable "{node.id}" no está definida.',
            'Mueve su definición antes de esta línea.' if later else 'Revisa si la creaste antes de utilizarla o si escribiste correctamente su nombre.',
            'warning')
        if suggestion:
            item['explanation'] += f' ¿Querías escribir "{suggestion}"?'
            item['fix'] = {'title': f'Cambiar por "{suggestion}"', 'startLine': node.lineno, 'startColumn': node.col_offset + 1, 'endLine': node.end_lineno, 'endColumn': node.end_col_offset + 1, 'text': suggestion}
        __coa_diagnostics.append(item)
    module_name = __coa_path[:-3].replace('/', '.')
    if module_name not in __coa_star_modules:
        for node in __coa_tree.body:
            if isinstance(node, (__ast.Assign, __ast.AnnAssign)):
                targets = node.targets if isinstance(node, __ast.Assign) else [node.target]
                for target in targets:
                    if isinstance(target, __ast.Name) and not target.id.startswith('_') and loads.get(target.id, 0) == 0 and (module_name, target.id) not in __coa_external_uses:
                        __coa_diagnostics.append(__coa_item(__coa_path, 'unused', target, f'La variable "{target.id}" se creó pero no se utiliza.', 'Puedes eliminarla si no forma parte del resultado que estás construyendo.', 'warning'))
    for local, node in imported_names.items():
        is_unused_coa_gui = local == 'gui' and isinstance(node, __ast.Import) and any(alias.name == 'coa_gui' for alias in node.names)
        if loads.get(local, 0) == 0 and not is_unused_coa_gui:
            __coa_diagnostics.append(__coa_item(__coa_path, 'unused-import', node, f'El import "{local}" no se utiliza.', 'Elimina este import si no es necesario para el programa.', 'warning'))
    # Simple literal operations whose result is certain without executing code.
    for node in __ast.walk(__coa_tree):
        if isinstance(node, __ast.BinOp) and isinstance(node.op, (__ast.Div, __ast.FloorDiv, __ast.Mod)) and isinstance(node.right, __ast.Constant) and node.right.value == 0:
            __coa_diagnostics.append(__coa_item(__coa_path, 'zero', node.right, 'No puedes dividir entre cero.', 'El divisor literal es cero; usa un valor distinto de cero.'))
        if isinstance(node, __ast.Call) and isinstance(node.func, __ast.Name) and node.func.id == 'int' and len(node.args) == 1 and isinstance(node.args[0], __ast.Constant) and isinstance(node.args[0].value, str):
            try: int(node.args[0].value)
            except ValueError: __coa_diagnostics.append(__coa_item(__coa_path, 'int', node.args[0], f'"{node.args[0].value}" no puede convertirse directamente a un número entero.', 'Usa un texto que represente un número válido.'))
        if isinstance(node, __ast.Subscript) and isinstance(node.value, __ast.Name) and isinstance(node.slice, __ast.Constant):
            name, key = node.value.id, node.slice.value
            if name in literal_lists and isinstance(key, int) and (key >= literal_lists[name] or key < -literal_lists[name]):
                __coa_diagnostics.append(__coa_item(__coa_path, 'index', node.slice, f'La lista tiene {literal_lists[name]} elementos y la posición {key} no existe.', 'Usa un índice dentro del tamaño conocido de esta lista.'))
            if name in literal_dicts and key not in literal_dicts[name]:
                __coa_diagnostics.append(__coa_item(__coa_path, 'key', node.slice, f'La clave "{key}" no existe en este diccionario.', 'Usa una de las claves definidas en el diccionario.'))
        if isinstance(node, __ast.Call) and isinstance(node.func, __ast.Name) and node.func.id in functions:
            fn = functions[node.func.id]
            if not fn.args.vararg and not fn.args.kwarg:
                required = len(fn.args.args) - len(fn.args.defaults)
                received = len(node.args) + len(node.keywords)
                maximum = len(fn.args.args)
                if received < required or received > maximum:
                    __coa_diagnostics.append(__coa_item(__coa_path, 'args', node, f'La función "{node.func.id}" necesita {required if required == maximum else f"entre {required} y {maximum}"} argumentos y recibió {received}.', 'Revisa los parámetros definidos y los valores enviados.'))
        if isinstance(node, __ast.Call) and isinstance(node.func, __ast.Name) and node.func.id == 'range' and (len(node.args) < 1 or len(node.args) > 3):
            __coa_diagnostics.append(__coa_item(__coa_path, 'range', node, f'range() necesita entre 1 y 3 argumentos y recibió {len(node.args)}.', 'Indica el límite, o inicio, límite y paso.'))
        if isinstance(node, __ast.Call) and isinstance(node.func, __ast.Name) and node.func.id in classes:
            initializer = next((item for item in classes[node.func.id].body if isinstance(item, (__ast.FunctionDef, __ast.AsyncFunctionDef)) and item.name == '__init__'), None)
            if initializer and not initializer.args.vararg and not initializer.args.kwarg:
                required = max(0, len(initializer.args.args) - 1 - len(initializer.args.defaults))
                maximum = max(0, len(initializer.args.args) - 1)
                received = len(node.args) + len(node.keywords)
                if received < required or received > maximum:
                    __coa_diagnostics.append(__coa_item(__coa_path, 'constructor-args', node, f'El constructor de "{node.func.id}" necesita {required if required == maximum else f"entre {required} y {maximum}"} argumentos y recibió {received}.', 'self se envía automáticamente; revisa los demás parámetros.'))
        if isinstance(node, __ast.Call) and isinstance(node.func, __ast.Attribute) and isinstance(node.func.value, __ast.Name) and node.func.value.id in instances:
            class_name = instances[node.func.value.id]
            cls = classes[class_name]
            methods = {item.name: item for item in cls.body if isinstance(item, (__ast.FunctionDef, __ast.AsyncFunctionDef))}
            if node.func.attr not in methods:
                suggestion = __coa_best(node.func.attr, methods)
                item = __coa_item(__coa_path, 'method', node.func, f'{class_name} no tiene un método llamado "{node.func.attr}".', 'Revisa los métodos definidos en la clase.')
                if suggestion:
                    item['explanation'] += f' ¿Querías "{suggestion}"?'
                    item['fix'] = {'title': f'Cambiar por "{suggestion}"', 'startLine': node.func.lineno, 'startColumn': node.func.end_col_offset - len(node.func.attr) + 1, 'endLine': node.func.end_lineno, 'endColumn': node.func.end_col_offset + 1, 'text': suggestion}
                __coa_diagnostics.append(item)
            else:
                method = methods[node.func.attr]
                expected = max(0, len(method.args.args) - 1)
                if not method.args.vararg and len(node.args) != expected:
                    __coa_diagnostics.append(__coa_item(__coa_path, 'method-args', node, f'El método "{node.func.attr}" necesita {expected} argumentos y recibió {len(node.args)}.', 'self se envía automáticamente; revisa los demás parámetros.'))
    for class_name, cls in classes.items():
        if cls not in __coa_tree.body: continue
        for base in cls.bases:
            if isinstance(base, __ast.Name) and base.id not in classes and base.id not in definitions and base.id not in known:
                suggestion = __coa_best(base.id, classes)
                if suggestion:
                    item = __coa_item(__coa_path, 'base', base, f'No se encontró la clase base "{base.id}".', f'¿Querías heredar de "{suggestion}"?')
                    item['fix'] = {'title': f'Cambiar por "{suggestion}"', 'startLine': base.lineno, 'startColumn': base.col_offset + 1, 'endLine': base.end_lineno, 'endColumn': base.end_col_offset + 1, 'text': suggestion}
                    __coa_diagnostics.append(item)
        for method in (item for item in cls.body if isinstance(item, (__ast.FunctionDef, __ast.AsyncFunctionDef))):
            if method.name != 'staticmethod' and (not method.args.args or method.args.args[0].arg != 'self') and not any(isinstance(dec, __ast.Name) and dec.id in ('staticmethod', 'classmethod') for dec in method.decorator_list):
                __coa_diagnostics.append(__coa_item(__coa_path, 'self', method, f'El método "{method.name}" debe recibir self como primer parámetro.', 'Los métodos de instancia usan self para acceder al objeto.', 'warning'))
    # Local imports and symbols can be checked against the current project.
    for node in (item for item in __ast.walk(__coa_tree) if isinstance(item, (__ast.Import, __ast.ImportFrom))):
        modules = [(alias.name, alias) for alias in node.names] if isinstance(node, __ast.Import) else [(node.module or '', node)]
        for module, target in modules:
            source_layer = next((part for part in __coa_path.split('/') if part in ('presentation', 'business', 'domain', 'data')), '')
            target_layer = module.split('.')[0]
            unusual = (source_layer == 'presentation' and target_layer == 'data') or (source_layer in ('data', 'domain') and target_layer == 'presentation')
            if unusual:
                __coa_diagnostics.append(__coa_item(__coa_path, 'layer-connection', node, f'{source_layer.capitalize()} está accediendo directamente a {target_layer.capitalize()}.', 'En la arquitectura utilizada por COA normalmente Presentation se comunica con Business, y Business conecta las demás capas.', 'warning'))
            if module in __coa_modules: continue
            root = module.split('.')[0]
            if any(existing == root or existing.startswith(root + '.') for existing in __coa_modules):
                suggestion = __coa_best(module, __coa_modules.keys())
                item = __coa_item(__coa_path, 'import', target, f'No se encontró el módulo local "{module}".', 'Revisa la carpeta y el nombre del archivo.')
                if suggestion:
                    item['explanation'] += f' ¿Querías "{suggestion}"?'
                    start_column = node.col_offset + (6 if isinstance(node, __ast.ImportFrom) else 1)
                    item['fix'] = {'title': f'Cambiar por "{suggestion}"', 'startLine': node.lineno, 'startColumn': start_column, 'endLine': node.lineno, 'endColumn': start_column + len(module), 'text': suggestion}
                __coa_diagnostics.append(item)
            if isinstance(node, __ast.ImportFrom) and module in __coa_modules:
                available = __coa_exports.get(__coa_modules[module], set())
                for alias in node.names:
                    if alias.name != '*' and alias.name not in available:
                        __coa_diagnostics.append(__coa_item(__coa_path, 'import-symbol', alias, f'"{alias.name}" no existe en el módulo local "{module}".', 'Revisa los nombres definidos en ese archivo.'))
    for node in (item for item in __ast.walk(__coa_tree) if isinstance(item, __ast.Call) and isinstance(item.func, __ast.Name) and item.func.id == 'open' and item.args and isinstance(item.args[0], __ast.Constant) and isinstance(item.args[0].value, str)):
        requested = node.args[0].value.replace(chr(92), '/')
        if requested not in __coa_files:
            suggestion = __coa_best(requested, __coa_files.keys())
            if suggestion:
                item = __coa_item(__coa_path, 'file', node.args[0], f'No se encontró el archivo local "{requested}".', f'¿Querías "{suggestion}"?')
                item['fix'] = {'title': f'Cambiar por "{suggestion}"', 'startLine': node.args[0].lineno, 'startColumn': node.args[0].col_offset + 2, 'endLine': node.args[0].end_lineno, 'endColumn': node.args[0].end_col_offset, 'text': suggestion}
                __coa_diagnostics.append(item)
__json.dumps(__coa_diagnostics)
`)
      self.postMessage({ type: 'diagnostics-result', result: JSON.parse(result) })
    } catch (error) {
      self.postMessage({ type: 'diagnostics-error', text: String(error) })
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
    const activeParts = data.active.split('/')
    const layerAt = activeParts.findIndex((part) => ['presentation', 'business', 'domain', 'data'].includes(part))
    python.globals.set('__coa_project_root', '/home/coa/' + (layerAt > 0 ? activeParts.slice(0, layerAt).join('/') : ''))
    python.globals.set('__coa_inputs', JSON.stringify(data.inputs ?? null))
    await python.runPythonAsync(`
import sys as __sys, importlib as __importlib, builtins as __builtins, json as __json, os as __os
for __name, __module in list(__sys.modules.items()):
    if str(getattr(__module, '__file__', '')).startswith('/home/coa/'):
        del __sys.modules[__name]
__sys.path[:] = [p for p in __sys.path if not p.startswith('/home/coa')]
__sys.path.insert(0, '/home/coa')
if __coa_project_root != '/home/coa/': __sys.path.insert(0, __coa_project_root)
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
