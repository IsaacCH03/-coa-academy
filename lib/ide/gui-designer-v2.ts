import { generateGuiCode as generateLegacyGuiCode, type GuiControl, type GuiDesign as LegacyGuiDesign, type GuiImportResult, type ImportedGuiSource } from './gui-designer'
import { compileLayoutForExport, resolvePreviewLayoutDetailed, safeTreeColumnWidth } from './gui-layout'

export type DesignerTarget = 'coa' | 'tkinter' | 'ttkbootstrap'
export type ExportMode = 'simple' | 'functions' | 'class'
export type LayoutManager = 'place' | 'pack' | 'grid'
export type V2WidgetType =
  | 'Label' | 'Entry' | 'Button' | 'Frame' | 'Labelframe'
  | 'Combobox' | 'Checkbutton' | 'Radiobutton' | 'Spinbox' | 'Scale'
  | 'Treeview' | 'Progressbar' | 'Notebook' | 'Separator'
  | 'Canvas' | 'Scrollbar' | 'Text' | 'Image' | 'Listbox'

export type LayoutConfig = {
  manager: LayoutManager
  x: number; y: number; width: number; height: number
  side?: 'top' | 'bottom' | 'left' | 'right'
  fill?: 'none' | 'x' | 'y' | 'both'
  expand?: boolean
  row?: number; column?: number; rowspan?: number; columnspan?: number
  sticky?: string; padx?: number; pady?: number
}

export type WidgetEvent = { event: 'command' | '<KeyRelease>' | '<Return>' | '<<ComboboxSelected>>' | '<<TreeviewSelect>>' | '<Double-1>'; handler: string }
export type TreeColumn = { id: string; heading: string; width: number; anchor: 'w' | 'center' | 'e'; stretch?:boolean }
export type V2Widget = {
  id: string
  type: V2WidgetType
  name: string
  parentId: string | null
  layout: LayoutConfig
  /** Geometría local de autoría. Independiente del gestor Tk de runtime. */
  authoring?: { x:number; y:number; width:number; height:number }
  text?: string
  bootstyle?: string
  state?: 'normal' | 'disabled' | 'readonly'
  values?: string[]
  value?: string | number | boolean
  variableType?: 'StringVar' | 'IntVar' | 'BooleanVar' | 'DoubleVar'
  group?: string
  orient?: 'horizontal' | 'vertical'
  mode?: 'determinate' | 'indeterminate'
  maximum?: number
  columns?: TreeColumn[]
  show?: 'headings' | 'tree' | 'tree headings'
  tabs?: { id: string; text: string }[]
  activeTabId?: string
  parentTabId?: string
  event?: WidgetEvent
  assetPath?: string
  targetId?: string
  rowWeights?: string
  columnWeights?: string
  sourceKey?: string
  fontFamily?: string
  fontSize?: number
  bold?: boolean
  italic?: boolean
  foreground?: string
  background?: string
  anchor?: 'w' | 'center' | 'e'
  showChar?: string
  wrap?: 'none' | 'char' | 'word'
  imageFit?: 'contain' | 'cover' | 'original' | 'stretch'
  tkWidth?: number
  tkHeight?: number
  length?: number
  padding?: number
  editorLocked?: boolean
  editorHidden?: boolean
}

export type ThemeColors = Record<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' | 'bg' | 'fg', string>
export type V2Window = {
  name?: string
  title: string; width: number; height: number
  framework: DesignerTarget
  theme: string
  background: string
  customColors?: Partial<ThemeColors>
  exportMode: ExportMode
  layoutExport?: 'faithful' | 'adaptive'
  resizable?: boolean
  centerOnOpen?: boolean
}
export type DesignerWindow = { id:string; name:string; kind:'root'|'secondary'; window:V2Window; widgets:V2Widget[] }
export type DesignerAsset = { id:string; path:string; name:string; mimeType:string; size:number }
export type V2Design = { schemaVersion: 2; window: V2Window; widgets: V2Widget[]; windows?:DesignerWindow[]; activeWindowId?:string; projectName?:string; assets?:DesignerAsset[]; importedSource?: ImportedGuiSource }

export type WidgetDefinition = {
  type: V2WidgetType
  label: string
  category: 'Básicos' | 'Entrada' | 'Datos' | 'Contenedores' | 'Texto' | 'Multimedia'
  container?: boolean
  coa: boolean
  defaults: Pick<V2Widget, 'layout'> & Partial<V2Widget>
}

const place = (width: number, height: number): LayoutConfig => ({ manager: 'place', x: 20, y: 45, width, height, padx: 4, pady: 4 })
export const WIDGET_REGISTRY: Record<V2WidgetType, WidgetDefinition> = {
  Label: { type: 'Label', label: 'Label', category: 'Básicos', coa: true, defaults: { layout: place(150, 30), text: 'Etiqueta',fontFamily:'Arial',fontSize:13,anchor:'w' } },
  Entry: { type: 'Entry', label: 'Entry', category: 'Básicos', coa: true, defaults: { layout: place(180, 32),fontFamily:'Arial',fontSize:13 } },
  Button: { type: 'Button', label: 'Button', category: 'Básicos', coa: true, defaults: { layout: place(120, 36), text: 'Botón', bootstyle: 'primary',fontFamily:'Arial',fontSize:13 } },
  Frame: { type: 'Frame', label: 'Frame', category: 'Contenedores', container: true, coa: true, defaults: { layout: place(260, 160) } },
  Labelframe: { type: 'Labelframe', label: 'Labelframe', category: 'Contenedores', container: true, coa: false, defaults: { layout: place(260, 160), text: 'Sección' } },
  Combobox: { type: 'Combobox', label: 'Combobox', category: 'Entrada', coa: false, defaults: { layout: place(180, 32), values: ['Opción 1', 'Opción 2'], state: 'readonly' } },
  Checkbutton: { type: 'Checkbutton', label: 'Checkbutton', category: 'Entrada', coa: false, defaults: { layout: place(150, 30), text: 'Activar', variableType: 'BooleanVar', value: false } },
  Radiobutton: { type: 'Radiobutton', label: 'Radiobutton', category: 'Entrada', coa: false, defaults: { layout: place(150, 30), text: 'Opción', variableType: 'StringVar', value: 'opcion', group: 'seleccion' } },
  Spinbox: { type: 'Spinbox', label: 'Spinbox', category: 'Entrada', coa: false, defaults: { layout: place(100, 32), value: 0, maximum: 100 } },
  Scale: { type: 'Scale', label: 'Escala', category: 'Entrada', coa: false, defaults: { layout: place(180, 35), orient: 'horizontal', maximum: 100, value: 50, variableType: 'DoubleVar' } },
  Treeview: { type: 'Treeview', label: 'Tabla', category: 'Datos', coa: false, defaults: { layout: place(320, 180), columns: [{ id: 'producto', heading: 'Producto', width: 140, anchor: 'w' }, { id: 'cantidad', heading: 'Cant.', width: 70, anchor: 'center' }], show: 'headings' } },
  Progressbar: { type: 'Progressbar', label: 'Progreso', category: 'Datos', coa: false, defaults: { layout: place(200, 24), orient: 'horizontal', mode: 'determinate', maximum: 100, value: 40, bootstyle: 'success', variableType: 'DoubleVar' } },
  Notebook: { type: 'Notebook', label: 'Pestañas', category: 'Contenedores', container: true, coa: false, defaults: { layout: place(360, 220), tabs: [{ id: 'tab-1', text: 'Pestaña 1' }], activeTabId: 'tab-1' } },
  Separator: { type: 'Separator', label: 'Separador', category: 'Contenedores', coa: false, defaults: { layout: place(200, 8), orient: 'horizontal' } },
  Canvas: { type: 'Canvas', label: 'Canvas', category: 'Contenedores', container: true, coa: false, defaults: { layout: place(280, 180) } },
  Scrollbar: { type: 'Scrollbar', label: 'Scrollbar', category: 'Contenedores', coa: false, defaults: { layout: place(18, 160), orient: 'vertical' } },
  Text: { type: 'Text', label: 'Texto multilínea', category: 'Texto', coa: false, defaults: { layout: place(260, 120),fontFamily:'Courier New',fontSize:13,wrap:'word' } },
  Image: { type: 'Image', label: 'Imagen', category: 'Multimedia', coa: false, defaults: { layout: place(160, 100), text: 'Imagen', assetPath: 'assets/imagen.png',imageFit:'contain' } },
  Listbox: { type: 'Listbox', label: 'Listbox', category: 'Datos', coa: false, defaults: { layout: place(220, 140), values: ['Elemento 1', 'Elemento 2'], fontFamily:'Arial', fontSize:13 } },
}

export const TTK_THEMES = ['cosmo', 'flatly', 'litera', 'minty', 'lumen', 'sandstone', 'yeti', 'pulse', 'united', 'journal', 'morph', 'simplex', 'cerculean', 'darkly', 'superhero', 'solar', 'cyborg', 'vapor'] as const
export const BOOTSTYLES = ['default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'outline-primary', 'outline-success', 'outline-danger'] as const
const reserved = new Set(['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield'])

export function newV2Design(): V2Design {
  const window:V2Window={ name:'principal',title: 'Mi interfaz', width: 500, height: 400, framework: 'ttkbootstrap', theme: 'darkly', background: '#222222', exportMode: 'class', layoutExport:'faithful',resizable:true,centerOnOpen:true }
  return { schemaVersion: 2, projectName:'Mi aplicación',window,widgets:[],windows:[{id:'window-root',name:'principal',kind:'root',window:{...window},widgets:[]}],activeWindowId:'window-root',assets:[] }
}

export function designWindows(design:V2Design):DesignerWindow[]{
  const existing=design.windows?.length?structuredClone(design.windows):[{id:'window-root',name:design.window.name||'principal',kind:'root' as const,window:structuredClone(design.window),widgets:structuredClone(design.widgets)}]
  const active=design.activeWindowId&&existing.some(item=>item.id===design.activeWindowId)?design.activeWindowId:existing[0].id
  return existing.map(item=>item.id===active?{...item,name:design.window.name||item.name,window:structuredClone(design.window),widgets:structuredClone(design.widgets)}:item)
}
export function synchronizeActiveWindow(design:V2Design):V2Design{const windows=designWindows(design),activeWindowId=design.activeWindowId&&windows.some(item=>item.id===design.activeWindowId)?design.activeWindowId:windows[0].id;return{...design,windows,activeWindowId}}
export function activateDesignerWindow(design:V2Design,id:string):V2Design{const windows=designWindows(design),target=windows.find(item=>item.id===id);if(!target)return synchronizeActiveWindow(design);return{...design,windows,activeWindowId:id,window:structuredClone(target.window),widgets:structuredClone(target.widgets)}}
export function addDesignerWindow(design:V2Design,input:{name:string;title:string;width:number;height:number}):V2Design{const synced=synchronizeActiveWindow(design),id=`window-${Date.now()}-${synced.windows!.length+1}`,window:V2Window={...newV2Design().window,name:input.name,title:input.title,width:Math.max(320,Math.min(1200,input.width)),height:Math.max(240,Math.min(900,input.height))},next={...synced,windows:[...synced.windows!,{id,name:input.name,kind:'secondary' as const,window,widgets:[]}],activeWindowId:id,window,widgets:[]};return synchronizeActiveWindow(next)}
export function duplicateDesignerWindow(design:V2Design,id:string):V2Design{const synced=synchronizeActiveWindow(design),source=synced.windows!.find(item=>item.id===id);if(!source)return synced;const nextId=`window-${Date.now()}-${synced.windows!.length+1}`,ids=new Map(source.widgets.map(item=>[item.id,`${item.id}-copy-${nextId}`])),widgets=structuredClone(source.widgets).map(item=>({...item,id:ids.get(item.id)!,parentId:item.parentId?ids.get(item.parentId)??null:null,targetId:item.targetId?ids.get(item.targetId):undefined}));const copy={...source,id:nextId,kind:'secondary' as const,name:`${source.name}_copia`,window:{...source.window,name:`${source.name}_copia`,title:`${source.window.title} (copia)`},widgets};return activateDesignerWindow({...synced,windows:[...synced.windows!,copy]},nextId)}
export function removeDesignerWindow(design:V2Design,id:string):V2Design{const synced=synchronizeActiveWindow(design);if(synced.windows!.length===1)return synced;const windows=synced.windows!.filter(item=>item.id!==id),target=windows[0];return{...synced,windows,activeWindowId:target.id,window:structuredClone(target.window),widgets:structuredClone(target.widgets)}}
export function renameDesignerWindow(design:V2Design,id:string,name:string,title?:string):V2Design{const synced=synchronizeActiveWindow(design),windows=synced.windows!.map(item=>item.id===id?{...item,name,window:{...item.window,name,title:title??item.window.title}}:item),next={...synced,windows};return id===synced.activeWindowId?activateDesignerWindow(next,id):next}

export function duplicateWidgetTree(design:V2Design,id:string):{design:V2Design;selectedId:string|null}{const source=design.widgets.find(item=>item.id===id);if(!source)return{design,selectedId:null};const originals=[source,...descendantsOf(design,id).map(child=>design.widgets.find(item=>item.id===child)!).filter(Boolean)],ids=new Map(originals.map((item,index)=>[item.id,`${item.id}-copy-${Date.now()}-${index}`])),names=new Set(design.widgets.map(item=>item.name));const copies=structuredClone(originals).map((item,index)=>{let name=`${item.name}_copia`,n=2;while(names.has(name))name=`${item.name}_copia${n++}`;names.add(name);return{...item,id:ids.get(item.id)!,name,parentId:item.id===id?item.parentId:(item.parentId?ids.get(item.parentId)??item.parentId:null),targetId:item.targetId?ids.get(item.targetId)??item.targetId:undefined,layout:{...item.layout,x:item.layout.x+(index?0:16),y:item.layout.y+(index?0:16)},authoring:item.authoring?{...item.authoring,x:item.authoring.x+(index?0:16),y:item.authoring.y+(index?0:16)}:undefined}});return{design:{...design,widgets:[...design.widgets,...copies]},selectedId:ids.get(id)!}}

export function prepareDesignForAI(input:V2Design){const design=synchronizeActiveWindow(input),windows=designWindows(design),lines=[`PROYECTO\nNombre: ${design.projectName||'Mi aplicación'}`,`FRAMEWORK RECOMENDADO\n${design.window.framework}`,`VENTANAS\nTotal: ${windows.length}`];for(const page of windows){lines.push(`\nVENTANA\nNombre: ${page.name}\nTipo: ${page.kind==='root'?'principal/root':'secundaria'}\nTítulo: ${page.window.title}\nTamaño: ${page.window.width}x${page.window.height}\nFramework: ${page.window.framework}\nTema: ${page.window.theme}\nFondo: ${page.window.background}\nRedimensionable: ${page.window.resizable===false?'no':'sí'}\nCentrar al abrir: ${page.window.centerOnOpen===false?'no':'sí'}`);for(const widget of page.widgets){const parent=widget.parentId?page.widgets.find(item=>item.id===widget.parentId)?.name:'ventana',visual=widget.authoring??widget.layout;lines.push(`\nCOMPONENTE\nTipo: ${widget.type}\nNombre: ${widget.name}\nContenedor: ${parent||'ventana'}${widget.parentTabId?`\nPestaña: ${widget.parentTabId}`:''}\nPosición: x=${visual.x}, y=${visual.y}\nTamaño: ${visual.width}x${visual.height}${widget.text!==undefined?`\nTexto: ${widget.text}`:''}${widget.fontFamily?`\nFuente: ${widget.fontFamily}, ${widget.fontSize??13}${widget.bold?', negrita':''}${widget.italic?', cursiva':''}`:''}${widget.foreground?`\nColor de texto: ${widget.foreground}`:''}${widget.background?`\nFondo: ${widget.background}`:''}${widget.values?.length?`\nValores: ${widget.values.join(' | ')}`:''}${widget.columns?.length?`\nColumnas: ${widget.columns.map(column=>`${column.id} (${column.heading}, ${column.width}px)`).join(' | ')}`:''}${widget.tabs?.length?`\nPestañas: ${widget.tabs.map(tab=>tab.text).join(' | ')}`:''}${widget.assetPath?`\nRecurso de imagen: ${widget.assetPath}\nAjuste: ${widget.imageFit??'contain'}`:''}`)}}if(design.assets?.length)lines.push(`\nRECURSOS\n${design.assets.map(asset=>`- ${asset.path} (${asset.mimeType}, ${asset.size} bytes)`).join('\n')}`);return lines.join('\n')}
export function aiClipboardText(design:V2Design){return`Utiliza la siguiente especificación creada con COA Designer para construir la interfaz en Python.\n\nRespeta la estructura visual, nombres de componentes, ventanas, jerarquía, posiciones y tamaños. Utiliza Tkinter/ttkbootstrap según la especificación. Separa la interfaz de la lógica de negocio. No inventes funcionalidades que no aparecen en la especificación. Los callbacks pueden implementarse posteriormente.\n\n${prepareDesignForAI(design)}`}

function migratedWidget(control: LegacyGuiDesign['controls'][number]): V2Widget {
  return { id: control.id, type: control.type, name: control.variableName, parentId: null, text: control.text, event: control.commandName ? { event: 'command', handler: control.commandName } : undefined, sourceKey: control.sourceKey, layout: { manager: 'place', x: control.x, y: control.y, width: control.width, height: control.height } }
}

export function restoreV2Design(value: unknown): V2Design {
  if (!value || typeof value !== 'object') return newV2Design()
  const raw = value as Record<string, unknown>
  if (raw.schemaVersion !== 2) {
    const legacy = raw as unknown as Partial<LegacyGuiDesign>
    if (!legacy.window || !Array.isArray(legacy.controls)) return newV2Design()
    return normalizeV2Design({ schemaVersion: 2, window: { name:'principal',title: legacy.window.title, width: legacy.window.width, height: legacy.window.height, framework: 'tkinter', theme: 'flatly', background: '#ffffff', exportMode: 'simple' }, widgets: legacy.controls.map(migratedWidget), importedSource: legacy.importedSource }).design
  }
  return normalizeV2Design(raw).design
}

export function normalizeV2Design(value: unknown): { design: V2Design; issues: string[] } {
  const raw = value && typeof value === 'object' ? value as Partial<V2Design> : {}
  const base = newV2Design(), issues: string[] = [], usedIds = new Set<string>()
  const widgets: V2Widget[] = []
  const source = Array.isArray(raw.widgets) ? raw.widgets : []
  source.forEach((candidate, index) => {
    if (!candidate || typeof candidate !== 'object' || !(candidate.type in WIDGET_REGISTRY)) { issues.push(`Componente ${index + 1} omitido: tipo no reconocido.`); return }
    const defaults = structuredClone(WIDGET_REGISTRY[candidate.type].defaults)
    let id = typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `recovered-${index + 1}`
    if (usedIds.has(id)) { issues.push(`ID duplicado ${id}; se asignó uno nuevo.`); id = `recovered-${index + 1}-${id}` }
    while (usedIds.has(id)) id += '-copy'
    usedIds.add(id)
    const authoring=candidate.authoring&&typeof candidate.authoring==='object'?candidate.authoring:undefined
    widgets.push({ ...defaults, ...candidate, id, name: typeof candidate.name === 'string' ? candidate.name : `${candidate.type.toLowerCase()}${index + 1}`, parentId: typeof candidate.parentId === 'string' ? candidate.parentId : null, layout: { ...defaults.layout, ...(candidate.layout ?? {}) },authoring:authoring?{x:Number(authoring.x)||0,y:Number(authoring.y)||0,width:Math.max(1,Number(authoring.width)||defaults.layout.width),height:Math.max(1,Number(authoring.height)||defaults.layout.height)}:undefined } as V2Widget)
  })
  const ids = new Set(widgets.map(widget => widget.id))
  for (const widget of widgets) {
    if (widget.parentId === widget.id) { issues.push(`${widget.name}: se eliminó una autorreferencia.`); widget.parentId = null }
    else if (widget.parentId && !ids.has(widget.parentId)) { issues.push(`${widget.name}: el contenedor no existe; se movió a la ventana.`); widget.parentId = null }
    if (widget.targetId && !ids.has(widget.targetId)) { issues.push(`${widget.name}: se eliminó una conexión inexistente.`); widget.targetId = undefined }
  }
  const byId = new Map(widgets.map(widget => [widget.id, widget]))
  for (const widget of widgets) {
    const parent=widget.parentId?byId.get(widget.parentId):undefined
    if(parent?.type==='Notebook'){const tabs=parent.tabs??[],fallback=parent.activeTabId??tabs[0]?.id;if(!widget.parentTabId||!tabs.some(tab=>tab.id===widget.parentTabId)){widget.parentTabId=fallback;issues.push(`${widget.name}: se recuperó su pestaña contenedora.`)}}else if(widget.parentTabId)widget.parentTabId=undefined
    const path = new Set<string>([widget.id]); let parentId = widget.parentId
    while (parentId) {
      if (path.has(parentId)) { issues.push(`${widget.name}: se rompió un ciclo de contenedores.`); widget.parentId = null; break }
      path.add(parentId); parentId = byId.get(parentId)?.parentId ?? null
    }
  }
  const activeWindow={ ...base.window, ...raw.window, width: Math.max(320, Math.min(1200, Number(raw.window?.width) || base.window.width)), height: Math.max(240, Math.min(900, Number(raw.window?.height) || base.window.height)),layoutExport:Object.prototype.hasOwnProperty.call(raw.window??{},'layoutExport')?raw.window?.layoutExport:undefined }
  const recoveredWindows=Array.isArray(raw.windows)&&raw.windows.length?raw.windows.flatMap((candidate,index)=>{if(!candidate||typeof candidate!=='object')return[];const page=candidate as DesignerWindow,normalized=normalizeV2Design({schemaVersion:2,window:page.window,widgets:page.widgets});issues.push(...normalized.issues.map(issue=>`${page.name||`Ventana ${index+1}`}: ${issue}`));return[{id:typeof page.id==='string'&&page.id?page.id:`window-${index+1}`,name:typeof page.name==='string'&&page.name?page.name:`ventana_${index+1}`,kind:index===0||page.kind==='root'?'root' as const:'secondary' as const,window:normalized.design.window,widgets:normalized.design.widgets}]}):[{id:'window-root',name:activeWindow.name||'principal',kind:'root' as const,window:structuredClone(activeWindow),widgets:structuredClone(widgets)}]
  const activeWindowId=typeof raw.activeWindowId==='string'&&recoveredWindows.some(page=>page.id===raw.activeWindowId)?raw.activeWindowId:recoveredWindows[0].id
  const synchronizedWindows=recoveredWindows.map(page=>page.id===activeWindowId?{...page,name:activeWindow.name||page.name,window:structuredClone(activeWindow),widgets:structuredClone(widgets)}:page)
  return { design: { schemaVersion: 2, projectName:typeof raw.projectName==='string'?raw.projectName:'Mi aplicación',window:activeWindow,widgets,windows:synchronizedWindows,activeWindowId,assets:Array.isArray(raw.assets)?raw.assets.filter(asset=>asset&&typeof asset.path==='string'):[],importedSource: raw.importedSource }, issues }
}

export function nextV2Widget(type: V2WidgetType, widgets: V2Widget[], parentId: string | null = null): V2Widget {
  const prefix: Record<V2WidgetType, string> = { Label:'label',Entry:'entry',Button:'button',Frame:'frame',Labelframe:'group',Combobox:'combo',Checkbutton:'check',Radiobutton:'radio',Spinbox:'spin',Scale:'scale',Treeview:'tree',Progressbar:'progress',Notebook:'notebook',Separator:'separator',Canvas:'canvas',Scrollbar:'scroll',Text:'text',Image:'image',Listbox:'listbox' }
  let index = 1
  const timestamp = Date.now()
  while (widgets.some((item) => item.name === `${prefix[type]}${index}` || item.id === `${type.toLowerCase()}-${timestamp}-${index}`)) index++
  return { id: `${type.toLowerCase()}-${timestamp}-${index}`, type, name: `${prefix[type]}${index}`, parentId, ...structuredClone(WIDGET_REGISTRY[type].defaults) } as V2Widget
}

export function childrenOf(design: V2Design, parentId: string | null) { return design.widgets.filter((widget) => widget.parentId === parentId) }
export function descendantsOf(design: V2Design, id: string): string[] {
  const result: string[] = [], visited = new Set<string>([id]), pending = [...childrenOf(design, id)]
  while (pending.length) {
    const item = pending.shift()!
    if (visited.has(item.id)) continue
    visited.add(item.id); result.push(item.id); pending.push(...childrenOf(design, item.id))
  }
  return result
}

export function validateV2Design(design: V2Design) {
  const errors: string[] = []
  const names = new Set<string>()
  for (const widget of design.widgets) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(widget.name) || reserved.has(widget.name)) errors.push(`${widget.name || '(sin nombre)'} no es un identificador Python válido.`)
    if (names.has(widget.name)) errors.push(`El nombre ${widget.name} está duplicado.`)
    names.add(widget.name)
    if (widget.parentId === widget.id || descendantsOf(design, widget.id).includes(widget.parentId ?? '')) errors.push(`${widget.name} tiene una jerarquía circular.`)
    if (widget.event?.handler && (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(widget.event.handler) || reserved.has(widget.event.handler))) errors.push(`El método ${widget.event.handler} no es válido.`)
  }
  const parents = new Set<string | null>([null, ...design.widgets.filter((item) => WIDGET_REGISTRY[item.type].container).map((item) => item.id)])
  for (const parentId of parents) {
    const managers = new Set(childrenOf(design, parentId).map((item) => item.layout.manager).filter((manager) => manager !== 'place'))
    if (managers.has('pack') && managers.has('grid')) errors.push('Tkinter no permite mezclar pack y grid dentro del mismo contenedor.')
  }
  return [...new Set(errors)]
}

const py = (value: unknown): string => {
  if (value === true) return 'True'
  if (value === false) return 'False'
  if (value === null || value === undefined) return 'None'
  if (Array.isArray(value)) return `[${value.map(py).join(', ')}]`
  return JSON.stringify(value)
}
function parentExpression(widget: V2Widget, mode: ExportMode, byId: Map<string, V2Widget>) {
  if (!widget.parentId) return mode === 'class' ? 'self.root' : 'root'
  const parent = byId.get(widget.parentId)
  const base = mode === 'class' ? `self.${parent?.name}` : parent?.name
  if (parent?.type === 'Notebook' && widget.parentTabId) return mode === 'class' ? `self.${parent.name}_${widget.parentTabId.replace(/[^A-Za-z0-9_]/g, '_')}` : `${parent.name}_${widget.parentTabId.replace(/[^A-Za-z0-9_]/g, '_')}`
  return base ?? (mode === 'class' ? 'self.root' : 'root')
}
function ref(widget: V2Widget, mode: ExportMode) { return mode === 'class' ? `self.${widget.name}` : widget.name }
function variableName(widget: V2Widget) { return widget.type === 'Radiobutton' && widget.group ? `${widget.group.replace(/[^A-Za-z0-9_]/g, '_')}_var` : `${widget.name}_var` }
function widgetClass(widget: V2Widget, target: DesignerTarget) {
  if (target === 'coa') return `gui.${widget.type}`
  if (target === 'tkinter' && ['Label','Entry','Button','Frame','Canvas','Text'].includes(widget.type)) return `tk.${widget.type}`
  if (widget.type === 'Image') return target === 'ttkbootstrap' ? 'ttk.Label' : 'tk.Label'
  if (['Canvas','Text','Listbox'].includes(widget.type)) return `tk.${widget.type}`
  return `ttk.${widget.type}`
}
type ConstructorCapability = 'font' | 'foreground' | 'background'
const TK_CONSTRUCTOR_CAPABILITIES: Partial<Record<V2WidgetType, readonly ConstructorCapability[]>> = { Label:['font','foreground','background'],Entry:['font','foreground','background'],Button:['font','foreground','background'],Frame:['background'],Canvas:['background'],Text:['font','foreground','background'] }
const TTK_CONSTRUCTOR_CAPABILITIES: Partial<Record<V2WidgetType, readonly ConstructorCapability[]>> = {}
export function constructorCapabilities(target:DesignerTarget,widget:V2Widget){if(target==='coa')return new Set<ConstructorCapability>();return new Set(widgetClass(widget,target).startsWith('tk.')?TK_CONSTRUCTOR_CAPABILITIES[widget.type]??[]:TTK_CONSTRUCTOR_CAPABILITIES[widget.type]??[])}
function constructorArgs(widget: V2Widget, target: DesignerTarget, mode: ExportMode) {
  const args: string[] = []
  const capabilities=constructorCapabilities(target,widget)
  if (widget.text !== undefined && !['Entry','Text','Treeview','Combobox'].includes(widget.type)) args.push(`text=${py(widget.text)}`)
  if (widget.values) args.push(`values=${py(widget.values)}`)
  if (widget.state && target !== 'coa') args.push(`state=${py(widget.state)}`)
  if (capabilities.has('font') && (widget.fontFamily || widget.fontSize || widget.bold || widget.italic)) args.push(`font=(${py(widget.fontFamily ?? 'Arial')}, ${widget.fontSize ?? 13}${widget.bold||widget.italic?`, ${py([widget.bold?'bold':'',widget.italic?'italic':''].filter(Boolean).join(' '))}`:''})`)
  if (widget.anchor && target !== 'coa') args.push(`anchor=${py(widget.anchor)}`)
  if (widget.showChar && widget.type === 'Entry') args.push(`show=${py(widget.showChar)}`)
  if (widget.wrap && widget.type === 'Text') args.push(`wrap=${py(widget.wrap)}`)
  if (capabilities.has('foreground') && widget.foreground) args.push(`foreground=${py(widget.foreground)}`)
  if (capabilities.has('background') && widget.background) args.push(`background=${py(widget.background)}`)
  if (widget.orient) args.push(`orient=${py(widget.orient)}`)
  if (widget.mode) args.push(`mode=${py(widget.mode)}`)
  if (widget.tkWidth !== undefined && ['Entry','Combobox','Spinbox','Text'].includes(widget.type)) args.push(`width=${widget.tkWidth}`)
  if (widget.tkHeight !== undefined && ['Text','Treeview'].includes(widget.type)) args.push(`height=${widget.tkHeight}`)
  if (widget.length !== undefined && ['Scale','Progressbar'].includes(widget.type)) args.push(`length=${widget.length}`)
  if (widget.padding !== undefined && ['Frame','Labelframe'].includes(widget.type)) args.push(`padding=${widget.padding}`)
  if (widget.maximum !== undefined && widget.type === 'Progressbar') args.push(`maximum=${widget.maximum}`)
  if (widget.maximum !== undefined && widget.type === 'Scale') args.push(`to=${widget.maximum}`)
  if (widget.maximum !== undefined && widget.type === 'Spinbox') args.push('from_=0', `to=${widget.maximum}`)
  if (widget.columns?.length) args.push(`columns=${py(widget.columns.map((column) => column.id))}`, `show=${py(widget.show ?? 'headings')}`)
  if (target === 'ttkbootstrap' && widget.bootstyle && widget.bootstyle !== 'default' && !['Canvas','Text','Image'].includes(widget.type)) args.push(`bootstyle=${py(widget.bootstyle)}`)
  if (widget.variableType && ['Checkbutton','Radiobutton','Scale','Progressbar'].includes(widget.type)) args.push(`variable=${mode === 'class' ? 'self.' : ''}${variableName(widget)}`)
  if (widget.type === 'Radiobutton') args.push(`value=${py(widget.value ?? widget.name)}`)
  return args.length ? ', ' + args.join(', ') : ''
}
function layoutLine(widget: V2Widget, mode: ExportMode) {
  const item = ref(widget, mode), layout = widget.layout
  if (layout.manager === 'place') return `${item}.place(x=${layout.x}, y=${layout.y}, width=${layout.width}, height=${layout.height})`
  if (layout.manager === 'pack') { const args:string[]=[];if(layout.side&&layout.side!=='top')args.push(`side=${py(layout.side)}`);if(layout.fill&&layout.fill!=='none')args.push(`fill=${py(layout.fill)}`);if(layout.expand)args.push('expand=True');if(layout.padx)args.push(`padx=${layout.padx}`);if(layout.pady)args.push(`pady=${layout.pady}`);return `${item}.pack(${args.join(', ')})` }
  const args=[`row=${layout.row??0}`,`column=${layout.column??0}`];if((layout.rowspan??1)!==1)args.push(`rowspan=${layout.rowspan}`);if((layout.columnspan??1)!==1)args.push(`columnspan=${layout.columnspan}`);if(layout.sticky)args.push(`sticky=${py(layout.sticky)}`);if(layout.padx)args.push(`padx=${layout.padx}`);if(layout.pady)args.push(`pady=${layout.pady}`);return `${item}.grid(${args.join(', ')})`
}

export function generateV2Code(design: V2Design, target = design.window.framework, mode = design.window.exportMode) {
  const errors = validateV2Design(design)
  if (errors.length) throw new Error(errors[0])
  if (design.importedSource && target !== 'ttkbootstrap') {
    const controls = design.widgets.filter((widget) => ['Label','Entry','Button','Frame'].includes(widget.type)).map((widget): GuiControl => ({ id: widget.id, type: widget.type as GuiControl['type'], variableName: widget.name, x: widget.layout.x, y: widget.layout.y, width: widget.layout.width, height: widget.layout.height, text: widget.text, commandName: widget.event?.event === 'command' ? widget.event.handler : undefined, sourceKey: widget.sourceKey }))
    return generateLegacyGuiCode({ title: design.window.title, width: design.window.width, height: design.window.height }, controls, target, design.importedSource)
  }
  if (design.importedSource && target === 'ttkbootstrap') throw new Error('Para conservar la lógica importada, exporta primero a COA GUI o Tkinter. La conversión automática a ttkbootstrap no modifica código arbitrario.')
  if (target === 'coa') {
    const unsupported = design.widgets.filter((widget) => !WIDGET_REGISTRY[widget.type].coa)
    if (unsupported.length) throw new Error(`COA GUI todavía no admite: ${[...new Set(unsupported.map((item) => item.type))].join(', ')}.`)
  }
  if(design.window.layoutExport)design=compileLayoutForExport(design,design.window.layoutExport,target)
  else if(design.widgets.length&&design.widgets.every(widget=>widget.layout.manager==='place'))design=compileLayoutForExport(design,'faithful',target)
  const lines = target === 'coa' ? ['import coa_gui as gui'] : target === 'ttkbootstrap' ? ['import tkinter as tk', 'from pathlib import Path', 'import ttkbootstrap as ttk'] : ['import tkinter as tk', 'from tkinter import ttk', 'from pathlib import Path']
  lines.push('')
  const byId = new Map(design.widgets.map((widget) => [widget.id, widget]))
  const ordered: V2Widget[] = []
  const visited = new Set<string>()
  const visit = (parent: string | null) => childrenOf(design, parent)
    .forEach((item) => { if (visited.has(item.id)) return; visited.add(item.id); ordered.push(item); visit(item.id) })
  visit(null)
  const events = new Map<string, boolean>()
  const declaredVariables = new Set<string>()
  for (const widget of ordered) if (widget.event?.handler) events.set(widget.event.handler, widget.event.event !== 'command')
  const buildWidget = (widget: V2Widget, indent: string) => {
    const out: string[] = []
    if (widget.variableType && !declaredVariables.has(variableName(widget))) { declaredVariables.add(variableName(widget)); out.push(`${indent}${mode === 'class' ? 'self.' : ''}${variableName(widget)} = tk.${widget.variableType}(value=${py(widget.value ?? false)})`) }
    if (widget.type === 'Image') {
      out.push(`${indent}${mode === 'class' ? 'self.' : ''}${widget.name}_image = tk.PhotoImage(file=str(Path(__file__).parent / ${py(widget.assetPath ?? 'assets/imagen.png')}))`)
    }
    const extra = widget.type === 'Image' ? `, image=${mode === 'class' ? 'self.' : ''}${widget.name}_image` : constructorArgs(widget, target, mode)
    out.push(`${indent}${ref(widget, mode)} = ${widgetClass(widget, target)}(${parentExpression(widget, mode, byId)}${extra})`)
    const capabilities=constructorCapabilities(target,widget),styleOptions:string[]=[]
    if(target!=='coa'&&widgetClass(widget,target).startsWith('ttk.')){if(!capabilities.has('font')&&(widget.fontFamily||widget.fontSize||widget.bold||widget.italic))styleOptions.push(`font=(${py(widget.fontFamily??'Arial')}, ${widget.fontSize??13}${widget.bold||widget.italic?`, ${py([widget.bold?'bold':'',widget.italic?'italic':''].filter(Boolean).join(' '))}`:''})`);if(!capabilities.has('foreground')&&widget.foreground)styleOptions.push(`foreground=${py(widget.foreground)}`);if(!capabilities.has('background')&&widget.background)styleOptions.push(`background=${py(widget.background)}`);if(styleOptions.length){const styleName=`_coa_style_${widget.name}`;out.push(`${indent}${styleName} = f"COA.${widget.name}.{${ref(widget,mode)}.cget('style') or ${ref(widget,mode)}.winfo_class()}"`,`${indent}ttk.Style().configure(${styleName}, ${styleOptions.join(', ')})`,`${indent}${ref(widget,mode)}.configure(style=${styleName})`)}}
    if (widget.type === 'Notebook') for (const tab of widget.tabs ?? []) {
      const tabRef = `${ref(widget, mode)}_${tab.id.replace(/[^A-Za-z0-9_]/g, '_')}`
      out.push(`${indent}${tabRef} = ttk.Frame(${ref(widget, mode)})`, `${indent}${ref(widget, mode)}.add(${tabRef}, text=${py(tab.text)})`)
    }
    if (widget.type === 'Treeview') for (const column of widget.columns ?? []) out.push(`${indent}${ref(widget, mode)}.heading(${py(column.id)}, text=${py(column.heading)})`, `${indent}${ref(widget, mode)}.column(${py(column.id)}, width=${target==='coa'?column.width:safeTreeColumnWidth(column,widget.fontSize??13)}, anchor=${py(column.anchor)}, stretch=${column.stretch === false ? 'False' : 'True'})`)
    if (widget.rowWeights) for (const [index, weight] of widget.rowWeights.split(',').map(Number).entries()) if (Number.isFinite(weight)) out.push(`${indent}${ref(widget, mode)}.rowconfigure(${index}, weight=${weight})`)
    if (widget.columnWeights) for (const [index, weight] of widget.columnWeights.split(',').map(Number).entries()) if (Number.isFinite(weight)) out.push(`${indent}${ref(widget, mode)}.columnconfigure(${index}, weight=${weight})`)
    out.push(`${indent}${layoutLine(widget, mode)}`)
    if (widget.event?.handler) {
      const handler = mode === 'class' ? `self.${widget.event.handler}` : widget.event.handler
      if (widget.event.event === 'command') out.push(`${indent}${ref(widget, mode)}.configure(command=${handler})`)
      else out.push(`${indent}${ref(widget, mode)}.bind(${py(widget.event.event)}, ${handler})`)
    }
    if (widget.type === 'Scrollbar' && widget.targetId) {
      const targetWidget = byId.get(widget.targetId)
      if (targetWidget) out.push(`${indent}${ref(widget, mode)}.configure(command=${ref(targetWidget, mode)}.${widget.orient === 'horizontal' ? 'xview' : 'yview'})`, `${indent}${ref(targetWidget, mode)}.configure(${widget.orient === 'horizontal' ? 'xscrollcommand' : 'yscrollcommand'}=${ref(widget, mode)}.set)`)
    }
    return out
  }
  const rootCreate = target === 'ttkbootstrap' ? `ttk.Window(themename=${py(design.window.theme)})` : target === 'coa' ? 'gui.Tk()' : 'tk.Tk()'
  if (mode === 'class') {
    lines.push('class InterfazApp:', '    def __init__(self, root):', '        self.root = root', `        self.root.title(${py(design.window.title)})`, `        self.root.geometry(${py(`${design.window.width}x${design.window.height}`)})`)
    if (target !== 'coa') lines.push(`        self.root.configure(background=${py(design.window.background)})`)
    for (const widget of ordered) lines.push(...buildWidget(widget, '        '))
    for (const [handler, receivesEvent] of events) lines.push('', `    def ${handler}(self${receivesEvent ? ', event' : ''}):`, '        pass')
    lines.push('', `root = ${rootCreate}`, 'app = InterfazApp(root)', 'root.mainloop()', '')
  } else if (mode === 'functions') {
    for (const [handler, receivesEvent] of events) lines.push(`def ${handler}(${receivesEvent ? 'event' : ''}):`, '    pass', '')
    const roots = childrenOf(design, null)
    const subtree = (id: string): V2Widget[] => descendantsOf(design, id).map(childId => byId.get(childId)).filter((widget): widget is V2Widget => Boolean(widget))
    for (const rootWidget of roots) {
      declaredVariables.clear()
      lines.push(`def crear_${rootWidget.name}(root):`)
      for (const widget of [rootWidget, ...subtree(rootWidget.id)]) lines.push(...buildWidget(widget, '    '))
      lines.push(`    return ${rootWidget.name}`, '')
    }
    lines.push(`root = ${rootCreate}`, `root.title(${py(design.window.title)})`, `root.geometry(${py(`${design.window.width}x${design.window.height}`)})`)
    if (target !== 'coa') lines.push(`root.configure(background=${py(design.window.background)})`)
    for (const rootWidget of roots) lines.push(`${rootWidget.name} = crear_${rootWidget.name}(root)`)
    lines.push('root.mainloop()', '')
  } else {
    for (const [handler, receivesEvent] of events) lines.push(`def ${handler}(${receivesEvent ? 'event' : ''}):`, '    pass', '')
    lines.push(`root = ${rootCreate}`, `root.title(${py(design.window.title)})`, `root.geometry(${py(`${design.window.width}x${design.window.height}`)})`)
    if (target !== 'coa') lines.push(`root.configure(background=${py(design.window.background)})`)
    for (const widget of ordered) lines.push('', ...buildWidget(widget, ''))
    lines.push('', 'root.mainloop()', '')
  }
  return lines.join('\n')
}

export function importGeneratedGui(source: string): V2Design | null {
  if (!/^\s*(?:import tkinter|from tkinter|import ttkbootstrap|import coa_gui)/m.test(source)) return null
  const design = newV2Design()
  design.window.layoutExport=undefined
  design.window.framework = source.includes('ttkbootstrap') ? 'ttkbootstrap' : source.includes('coa_gui') ? 'coa' : 'tkinter'
  const importedTheme = source.match(/ttk\.Window\([\s\S]*?themename\s*=\s*(['"])(.*?)\1[\s\S]*?\)/)?.[2]
  if (importedTheme && TTK_THEMES.includes(importedTheme as typeof TTK_THEMES[number])) design.window.theme = importedTheme
  design.window.exportMode = /class\s+\w+/.test(source) ? 'class' : 'simple'
  const title = source.match(/\.title\((['"])(.*?)\1\)/)?.[2]; if (title) design.window.title = title
  const geometry = source.match(/\.geometry\((['"])(\d+)x(\d+)\1\)/); if (geometry) { design.window.width = Number(geometry[2]); design.window.height = Number(geometry[3]) }
  const constructor = /(?:self\.)?(\w+)\s*=\s*(?:tk|ttk|gui)\.(Label|Entry|Button|Frame|Labelframe|Combobox|Checkbutton|Radiobutton|Spinbox|Scale|Treeview|Progressbar|Notebook|Separator|Canvas|Scrollbar|Text)\s*\(/g
  const creates: Array<{ name: string; type: V2WidgetType; args: string }> = []
  for (const match of source.matchAll(constructor)) {
    const open = (match.index ?? 0) + match[0].length - 1
    let depth = 1, quote = '', escaped = false, end = open + 1
    for (; end < source.length && depth > 0; end++) {
      const character = source[end]
      if (quote) { if (escaped) escaped = false; else if (character === '\\') escaped = true; else if (character === quote) quote = ''; continue }
      if (character === '"' || character === "'") quote = character
      else if (character === '(' || character === '[' || character === '{') depth++
      else if (character === ')' || character === ']' || character === '}') depth--
    }
    if (depth === 0) creates.push({ name: match[1], type: match[2] as V2WidgetType, args: source.slice(open + 1, end - 1) })
  }
  const pendingParents = new Map<string, string>()
  for (const create of creates) {
    const type = create.type
    const widget = nextV2Widget(type, design.widgets)
    widget.name = create.name
    pendingParents.set(widget.id, create.args.split(',')[0].trim().replace(/^self\./, ''))
    widget.text = create.args.match(/\btext\s*=\s*(['"])([\s\S]*?)\1/)?.[2] ?? widget.text
    widget.bootstyle = create.args.match(/\bbootstyle\s*=\s*(['"])([\s\S]*?)\1/)?.[2] ?? widget.bootstyle
    const font = create.args.match(/\bfont\s*=\s*[\[(]\s*(['"])(.*?)\1\s*,\s*(\d+)([\s\S]*?)[\])]/)
    if (font) { widget.fontFamily=font[2];widget.fontSize=Number(font[3]);widget.bold=/bold/.test(font[4]);widget.italic=/italic/.test(font[4]) }
    const values = create.args.match(/\bvalues\s*=\s*[\[(]([^\])]*?)[\])]/)?.[1]
    if (values !== undefined) widget.values = [...values.matchAll(/(['"])(.*?)\1/g)].map(value => value[2])
    const state = create.args.match(/\bstate\s*=\s*(['"])([\s\S]*?)\1/)?.[2]
    if (state && ['normal', 'disabled', 'readonly'].includes(state)) widget.state = state as V2Widget['state']
    const orient=create.args.match(/\borient\s*=\s*(?:['"](horizontal|vertical)['"]|(HORIZONTAL|VERTICAL))/);if(orient)widget.orient=(orient[1]??orient[2].toLowerCase()) as 'horizontal'|'vertical'
    const mode=create.args.match(/\bmode\s*=\s*['"](determinate|indeterminate)['"]/);if(mode)widget.mode=mode[1] as V2Widget['mode']
    const show=create.args.match(/\bshow\s*=\s*['"](headings|tree|tree headings)['"]/);if(show&&widget.type==='Treeview')widget.show=show[1] as V2Widget['show']
    const numericValue=create.args.match(/\bvalue\s*=\s*(\d+(?:\.\d+)?)/)?.[1];if(numericValue)widget.value=Number(numericValue)
    const maximum=create.args.match(/\b(?:maximum|to)\s*=\s*(\d+(?:\.\d+)?)/)?.[1];if(maximum)widget.maximum=Number(maximum)
    const tkWidth=create.args.match(/\bwidth\s*=\s*(\d+)/)?.[1];if(tkWidth)widget.tkWidth=Number(tkWidth)
    const tkHeight=create.args.match(/\bheight\s*=\s*(\d+)/)?.[1];if(tkHeight)widget.tkHeight=Number(tkHeight)
    const length=create.args.match(/\blength\s*=\s*(\d+)/)?.[1];if(length)widget.length=Number(length)
    const padding=create.args.match(/\bpadding\s*=\s*(?:\d+|\(([^)]*)\))/)?.[0];if(padding){const values=[...padding.matchAll(/\d+/g)].map(value=>Number(value[0]));widget.padding=Math.max(...values)}
    const layout = source.match(new RegExp(`(?:self\\.)?${widget.name}\\.(place|pack|grid)\\(([^\\n]*)\\)`))
    if (layout) {
      widget.layout.manager = layout[1] as LayoutManager
      for (const key of ['x','y','width','height','row','column','rowspan','columnspan'] as const) { const value = layout[2].match(new RegExp(`${key}\\s*=\\s*(\\d+)`)); if (value) (widget.layout as Record<string, unknown>)[key] = Number(value[1]) }
      for(const key of ['padx','pady'] as const){const value=layout[2].match(new RegExp(`${key}\\s*=\\s*(?:\\d+|\\(([^)]*)\\))`))?.[0];if(value){const values=[...value.matchAll(/\d+/g)].map(item=>Number(item[0]));widget.layout[key]=Math.max(...values)}}
      const side = layout[2].match(/\bside\s*=\s*(?:['"]([^'"]+)['"]|([A-Z]+))/); if (side) widget.layout.side = (side[1] ?? side[2].toLowerCase()) as NonNullable<V2Widget['layout']['side']>
      const fill = layout[2].match(/\bfill\s*=\s*(?:['"]([^'"]+)['"]|([A-Z]+))/); if (fill) widget.layout.fill = (fill[1] ?? fill[2].toLowerCase()) as NonNullable<V2Widget['layout']['fill']>
      const sticky = layout[2].match(/\bsticky\s*=\s*(?:['"]([^'"]+)['"]|([A-Z]+))/); if (sticky) widget.layout.sticky = (sticky[1] ?? sticky[2]).toLowerCase()
      widget.layout.expand = /\bexpand\s*=\s*(?:True|YES|1)/.test(layout[2])
    }
    design.widgets.push(widget)
  }
  const byName = new Map(design.widgets.map(widget => [widget.name, widget]))
  for (const widget of design.widgets) {
    const parentName = pendingParents.get(widget.id)
    if (parentName && !['root', 'ventana', 'window', 'app'].includes(parentName)) widget.parentId = byName.get(parentName)?.id ?? null
    if(widget.type==='Treeview'){
      const headings=[...source.matchAll(new RegExp(`(?:self\\.)?${widget.name}\\.heading\\(\\s*['"]([^'"]+)['"]\\s*,\\s*text\\s*=\\s*['"]([^'"]+)['"]\\s*\\)`,'g'))]
      widget.columns=headings.map(match=>{const line=source.match(new RegExp(`(?:self\\.)?${widget.name}\\.column\\(\\s*['"]${match[1]}['"]([^\\n]*)`))?.[1]??'',width=line.match(/width\s*=\s*(\d+)/)?.[1],anchorMatch=line.match(/anchor\s*=\s*(?:['"](w|center|e)['"]|(W|CENTER|E))/),anchor=(anchorMatch?.[1]??anchorMatch?.[2]?.toLowerCase()) as 'w'|'center'|'e'|undefined;return{id:match[1],heading:match[2],width:Number(width)||100,anchor:anchor??'w',stretch:!(/stretch\s*=\s*(?:False|0)/.test(line))}})
    }
    const rows=[...source.matchAll(new RegExp(`(?:self\\.)?${widget.name}\\.rowconfigure\\(\\s*(\\d+)\\s*,\\s*weight\\s*=\\s*(\\d+)`,'g'))],columns=[...source.matchAll(new RegExp(`(?:self\\.)?${widget.name}\\.columnconfigure\\(\\s*(\\d+)\\s*,\\s*weight\\s*=\\s*(\\d+)`,'g'))]
    const serializeWeights=(matches:RegExpMatchArray[])=>{const result:number[]=[];for(const match of matches)result[Number(match[1])]=Number(match[2]);return result.length?Array.from({length:result.length},(_,index)=>result[index]??0).join(', '):undefined}
    widget.rowWeights=serializeWeights(rows)??widget.rowWeights;widget.columnWeights=serializeWeights(columns)??widget.columnWeights
  }
  const tabFrames=new Set<string>()
  for(const notebook of design.widgets.filter(widget=>widget.type==='Notebook')){const additions=[...source.matchAll(new RegExp(`(?:self\\.)?${notebook.name}\\.add\\(\\s*(?:self\\.)?(\\w+)\\s*,\\s*text\\s*=\\s*['"]([^'"]+)['"]`,'g'))];if(!additions.length)continue;notebook.tabs=additions.map((match,index)=>({id:`tab-${index+1}`,text:match[2]}));notebook.activeTabId=notebook.tabs[0]?.id;for(const [index,addition] of additions.entries()){const tabFrame=byName.get(addition[1]);if(!tabFrame)continue;tabFrames.add(tabFrame.id);for(const child of design.widgets.filter(widget=>widget.parentId===tabFrame.id)){child.parentId=notebook.id;child.parentTabId=notebook.tabs[index].id}}}
  if(tabFrames.size)design.widgets=design.widgets.filter(widget=>!tabFrames.has(widget.id))
  const geometryOrder=(widget:V2Widget)=>{const match=new RegExp(`(?:self\\.)?${widget.name}\\.(?:place|pack|grid)\\s*\\(`).exec(source);return match?.index??Number.MAX_SAFE_INTEGER}
  design.widgets=design.widgets.map((widget,index)=>({widget,index})).sort((left,right)=>geometryOrder(left.widget)-geometryOrder(right.widget)||left.index-right.index).map(item=>item.widget)
  if(!(design.widgets.length||geometry||title))return null
  const normalized=normalizeV2Design(design).design,layout=resolvePreviewLayoutDetailed(normalized)
  normalized.widgets=normalized.widgets.map(widget=>({...widget,authoring:widget.layout.manager==='place'?{x:widget.layout.x,y:widget.layout.y,width:widget.layout.width,height:widget.layout.height}:layout.local.get(widget.id)}))
  return normalized
}

export type { GuiImportResult }
