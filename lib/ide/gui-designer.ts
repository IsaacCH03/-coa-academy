import { convertCoaGuiToTkinter } from './coa-gui-converter'

export type GuiControlType = 'Label' | 'Entry' | 'Button' | 'Frame'

export type GuiControl = {
  id: string
  type: GuiControlType
  variableName: string
  x: number
  y: number
  width: number
  height: number
  text?: string
  commandName?: string
  sourceKey?: string
}

export type GuiWindow = { title: string; width: number; height: number }
export type SourceRange = [number, number]
export type ImportedControlSource = {
  createRange: SourceRange
  placeRange: SourceRange
  nameRanges: SourceRange[]
  textRange?: SourceRange
  constructorEnd: number
  xRange: SourceRange
  yRange: SourceRange
  widthRange: SourceRange
  heightRange: SourceRange
}
export type ImportedGuiSource = {
  source: string
  importRange: SourceRange
  guiRanges: SourceRange[]
  titleRange?: SourceRange
  geometryRange?: SourceRange
  mainloopStart: number
  windowName: string
  windowCreateEnd: number
  controls: Record<string, ImportedControlSource>
  warning: boolean
}
export type GuiDesign = {
  window: GuiWindow
  controls: GuiControl[]
  importedSource?: ImportedGuiSource
}
export type GuiImportResult =
  | { ok: true; design: GuiDesign; warning: boolean }
  | { ok: false; reason: 'syntax' | 'missing' }

export function newGuiDesign(): GuiDesign {
  return {
    window: { title: 'Mi interfaz', width: 500, height: 400 },
    controls: [],
  }
}

export function restoreGuiDesign(value: unknown): GuiDesign {
  if (!value || typeof value !== 'object') return newGuiDesign()
  const design = value as Partial<GuiDesign>
  if (
    !design.window ||
    typeof design.window.title !== 'string' ||
    !Number.isFinite(design.window.width) ||
    !Number.isFinite(design.window.height) ||
    !Array.isArray(design.controls)
  )
    return newGuiDesign()
  const window = {
    title: design.window.title,
    width: Math.max(240, Math.min(900, Math.round(design.window.width))),
    height: Math.max(200, Math.min(700, Math.round(design.window.height))),
  }
  const controls = design.controls.filter(
    (control): control is GuiControl =>
      !!control &&
      typeof control.id === 'string' &&
      ['Label', 'Entry', 'Button', 'Frame'].includes(control.type) &&
      typeof control.variableName === 'string' &&
      (control.commandName === undefined || typeof control.commandName === 'string') &&
      (control.sourceKey === undefined || typeof control.sourceKey === 'string') &&
      [control.x, control.y, control.width, control.height].every(Number.isFinite) &&
      (control.text === undefined || typeof control.text === 'string'),
  )
  if (new Set(controls.map((control) => control.id)).size !== controls.length)
    return newGuiDesign()
  const importedSource = validImportedSource(design.importedSource)
    ? design.importedSource
    : undefined
  return {
    window,
    controls: controls.map((control) => clampControl(control, window)),
    importedSource,
  }
}

function validRange(value: unknown): value is SourceRange {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((number) => Number.isInteger(number) && number >= 0)
  )
}

function validImportedSource(value: unknown): value is ImportedGuiSource {
  if (!value || typeof value !== 'object') return false
  const source = value as Partial<ImportedGuiSource>
  return (
    typeof source.source === 'string' &&
    validRange(source.importRange) &&
    Array.isArray(source.guiRanges) &&
    source.guiRanges.every(validRange) &&
    Number.isInteger(source.mainloopStart) &&
    !!source.controls &&
    typeof source.controls === 'object'
  )
}

export const controlDefaults: Record<
  GuiControlType,
  Pick<GuiControl, 'width' | 'height' | 'text'>
> = {
  Label: { width: 150, height: 30, text: 'Etiqueta' },
  Entry: { width: 180, height: 32 },
  Button: { width: 120, height: 36, text: 'Botón' },
  Frame: { width: 220, height: 140 },
}

export function clampControl(control: GuiControl, window: GuiWindow): GuiControl {
  const width = Math.max(20, Math.min(window.width, Math.round(control.width)))
  const height = Math.max(20, Math.min(window.height, Math.round(control.height)))
  return {
    ...control,
    width,
    height,
    x: Math.max(0, Math.min(window.width - width, Math.round(control.x))),
    y: Math.max(0, Math.min(window.height - height, Math.round(control.y))),
  }
}

export function nextControl(
  type: GuiControlType,
  controls: GuiControl[],
  x: number,
  y: number,
  window: GuiWindow,
): GuiControl {
  const base = type.toLowerCase()
  let number = 1
  while (controls.some((control) => control.variableName === `${base}${number}`))
    number++
  return clampControl(
    {
      id: `${base}-${Date.now()}-${number}`,
      type,
      variableName: `${base}${number}`,
      x,
      y,
      ...controlDefaults[type],
    },
    window,
  )
}

export function validControls(controls: GuiControl[]) {
  const names = controls.map((control) => control.variableName.trim())
  return (
    names.every((name) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) &&
    new Set(names).size === names.length
  )
}

export function generateGuiCode(
  window: GuiWindow,
  controls: GuiControl[],
  target: 'coa' | 'tkinter',
  importedSource?: ImportedGuiSource,
) {
  if (!validControls(controls))
    throw new Error('Usa nombres de variable válidos, únicos y no vacíos.')
  if (importedSource)
    return generateImportedCode(window, controls, target, importedSource)
  const moduleName = target === 'coa' ? 'coa_gui as gui' : 'tkinter as tk'
  const prefix = target === 'coa' ? 'gui' : 'tk'
  const lines = [
    `import ${moduleName}`,
    '',
    `ventana = ${prefix}.Tk()`,
    `ventana.title(${JSON.stringify(window.title)})`,
    `ventana.geometry(${JSON.stringify(`${window.width}x${window.height}`)})`,
  ]
  const order: Record<GuiControlType, number> = {
    Frame: 0,
    Label: 1,
    Entry: 2,
    Button: 3,
  }
  for (const control of [...controls].sort(
    (left, right) => order[left.type] - order[right.type],
  )) {
    lines.push('')
    const text = control.text === undefined ? '' : `, text=${JSON.stringify(control.text)}`
    lines.push(
      `${control.variableName} = ${prefix}.${control.type}(ventana${text})`,
      `${control.variableName}.place(x=${control.x}, y=${control.y}, width=${control.width}, height=${control.height})`,
    )
  }
  lines.push('', 'ventana.mainloop()', '')
  return lines.join('\n')
}

function generateImportedCode(
  window: GuiWindow,
  controls: GuiControl[],
  target: 'coa' | 'tkinter',
  imported: ImportedGuiSource,
) {
  const replacements: { range: SourceRange; value: string }[] = []
  const mapped = new Map(
    controls.filter((control) => control.sourceKey).map((control) => [control.sourceKey!, control]),
  )
  if (imported.titleRange)
    replacements.push({ range: imported.titleRange, value: JSON.stringify(window.title) })
  else
    replacements.push({
      range: [imported.windowCreateEnd, imported.windowCreateEnd],
      value: `\n${imported.windowName}.title(${JSON.stringify(window.title)})`,
    })
  if (imported.geometryRange)
    replacements.push({
      range: imported.geometryRange,
      value: JSON.stringify(`${window.width}x${window.height}`),
    })
  else
    replacements.push({
      range: [imported.windowCreateEnd, imported.windowCreateEnd],
      value: `\n${imported.windowName}.geometry(${JSON.stringify(`${window.width}x${window.height}`)})`,
    })
  for (const [key, source] of Object.entries(imported.controls)) {
    const control = mapped.get(key)
    if (!control) {
      replacements.push({ range: source.createRange, value: '' })
      replacements.push({ range: source.placeRange, value: '' })
      continue
    }
    for (const range of source.nameRanges)
      replacements.push({ range, value: control.variableName })
    if (control.text !== undefined) {
      if (source.textRange)
        replacements.push({ range: source.textRange, value: JSON.stringify(control.text) })
      else {
        const before = imported.source.slice(0, source.constructorEnd).trimEnd()
        replacements.push({
          range: [source.constructorEnd, source.constructorEnd],
          value: `${before.endsWith(',') ? ' ' : ', '}text=${JSON.stringify(control.text)}`,
        })
      }
    }
    replacements.push(
      { range: source.xRange, value: String(control.x) },
      { range: source.yRange, value: String(control.y) },
      { range: source.widthRange, value: String(control.width) },
      { range: source.heightRange, value: String(control.height) },
    )
  }
  const order: Record<GuiControlType, number> = {
    Frame: 0,
    Label: 1,
    Entry: 2,
    Button: 3,
  }
  const prefix = 'gui'
  const additions = controls
    .filter((item) => !item.sourceKey)
    .sort((left, right) => order[left.type] - order[right.type])
    .map((control) => {
      const text =
        control.text === undefined
          ? ''
          : `, text=${JSON.stringify(control.text)}`
      return `${control.variableName} = ${prefix}.${control.type}(${imported.windowName}${text})\n${control.variableName}.place(x=${control.x}, y=${control.y}, width=${control.width}, height=${control.height})\n`
    })
    .join('\n')
  if (additions)
    replacements.push({
      range: [imported.mainloopStart, imported.mainloopStart],
      value: additions + '\n',
    })
  const coaSource = applySourceChanges(imported.source, replacements)
  return target === 'tkinter' ? convertCoaGuiToTkinter(coaSource) : coaSource
}

function applySourceChanges(
  source: string,
  replacements: { range: SourceRange; value: string }[],
) {
  let result = source
  for (const replacement of replacements.sort(
    (left, right) => right.range[0] - left.range[0],
  ))
    result =
      result.slice(0, replacement.range[0]) +
      replacement.value +
      result.slice(replacement.range[1])
  return result
}
