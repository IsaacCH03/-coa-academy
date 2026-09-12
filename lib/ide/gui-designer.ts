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
}

export type GuiWindow = { title: string; width: number; height: number }

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
) {
  if (!validControls(controls))
    throw new Error('Usa nombres de variable válidos, únicos y no vacíos.')
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
