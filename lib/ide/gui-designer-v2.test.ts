import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { childrenOf, descendantsOf, generateV2Code, importGeneratedGui, newV2Design, nextV2Widget, normalizeV2Design, restoreV2Design, validateV2Design, WIDGET_REGISTRY } from './gui-designer-v2'

describe('COA Designer V2', () => {
  it('migrates a V1 flat design without losing controls', () => {
    const design = restoreV2Design({ window: { title: 'Anterior', width: 500, height: 400 }, controls: [{ id: 'a', type: 'Button', variableName: 'guardar', text: 'Guardar', x: 10, y: 20, width: 100, height: 30 }] })
    expect(design.schemaVersion).toBe(2)
    expect(design.widgets[0]).toMatchObject({ name: 'guardar', parentId: null, layout: { manager: 'place', x: 10 } })
  })

  it('registers every visible widget with defaults and compatibility metadata', () => {
    expect(Object.keys(WIDGET_REGISTRY)).toHaveLength(18)
    expect(WIDGET_REGISTRY.Labelframe.container).toBe(true)
    expect(WIDGET_REGISTRY.Button.coa).toBe(true)
    expect(WIDGET_REGISTRY.Treeview.coa).toBe(false)
  })

  it('models real parent/child hierarchy and descendants', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1)
    const design = newV2Design(), frame = nextV2Widget('Frame', [], null)
    const button = nextV2Widget('Button', [frame], frame.id)
    design.widgets = [frame, button]
    expect(childrenOf(design, frame.id)).toEqual([button])
    expect(descendantsOf(design, frame.id)).toEqual([button.id])
  })

  it('rejects invalid, reserved, duplicate names and pack/grid siblings', () => {
    const design = newV2Design(), frame = nextV2Widget('Frame', [])
    const one = nextV2Widget('Button', [frame], frame.id), two = nextV2Widget('Entry', [frame, one], frame.id)
    one.name = 'class'; one.layout.manager = 'pack'; two.name = 'class'; two.layout.manager = 'grid'
    design.widgets = [frame, one, two]
    expect(validateV2Design(design).join(' ')).toMatch(/identificador|duplicado/)
    expect(validateV2Design(design).join(' ')).toContain('mezclar pack y grid')
  })

  it('exports ttkbootstrap class, themes, bootstyle, events and variables', () => {
    const design = newV2Design(), frame = nextV2Widget('Frame', []), check = nextV2Widget('Checkbutton', [frame], frame.id)
    frame.name = 'header'; frame.layout.manager = 'pack'; frame.layout.fill = 'x'
    check.name = 'activo'; check.event = { event: 'command', handler: 'guardar' }; check.bootstyle = 'success'
    design.widgets = [frame, check]
    const code = generateV2Code(design, 'ttkbootstrap', 'class')
    expect(code).toContain('ttk.Window(themename="darkly")')
    expect(code).toContain('self.activo_var = tk.BooleanVar')
    expect(code).toContain('bootstyle="success"')
    expect(code).toContain('command=self.guardar')
    expect(code).toContain('def guardar(self):')
  })

  it('exports Treeview columns, Notebook tabs and connected Scrollbar', () => {
    const design = newV2Design(), notebook = nextV2Widget('Notebook', []), tree = nextV2Widget('Treeview', [notebook], notebook.id), scroll = nextV2Widget('Scrollbar', [notebook, tree], notebook.id)
    tree.name = 'tabla'; scroll.name = 'scroll_tabla'; scroll.targetId = tree.id
    design.widgets = [notebook, tree, scroll]
    const code = generateV2Code(design, 'tkinter', 'simple')
    expect(code).toContain('.add(')
    expect(code).toContain('tabla.heading("producto"')
    expect(code).toContain('command=tabla.yview')
    expect(code).toContain('yscrollcommand=scroll_tabla.set')
  })

  it('uses relative Path assets and retains PhotoImage references', () => {
    const design = newV2Design(), image = nextV2Widget('Image', [])
    image.name = 'logo'; image.assetPath = 'assets/logo.png'; design.widgets = [image]
    const code = generateV2Code(design, 'tkinter', 'class')
    expect(code).toContain('self.logo_image = tk.PhotoImage(file=str(Path(__file__).parent / "assets/logo.png"))')
    expect(code).not.toMatch(/[A-Z]:\\/)
  })

  it('exports simple and section-based function modes', () => {
    const design = newV2Design(), header = nextV2Widget('Frame', []), label = nextV2Widget('Label', [header], header.id)
    header.name = 'header'; design.widgets = [header, label]
    expect(generateV2Code(design, 'tkinter', 'simple')).toContain('root = tk.Tk()')
    expect(generateV2Code(design, 'tkinter', 'functions')).toContain('def crear_header(root):')
  })

  it('imports its supported Tkinter/ttkbootstrap subset without executing it', () => {
    const source = 'import ttkbootstrap as ttk\nroot = ttk.Window(themename="darkly")\nroot.title("Demo")\nroot.geometry("640x480")\nframe = ttk.Frame(root)\nframe.pack(fill="x")\nbtn = ttk.Button(frame, text="Guardar", bootstyle="success")\nbtn.grid(row=1, column=2)\nroot.mainloop()\n'
    const restored = importGeneratedGui(source)
    expect(restored?.window).toMatchObject({ framework: 'ttkbootstrap', title: 'Demo', width: 640 })
    expect(restored).not.toBeNull()
    expect(restored!.widgets.find(item => item.name === 'btn')).toMatchObject({ parentId: restored!.widgets[0].id, bootstyle: 'success', layout: { manager: 'grid', row: 1, column: 2 } })
  })

  it('keeps COA GUI safe by refusing unsupported widgets instead of emitting broken code', () => {
    const design = newV2Design(); design.widgets = [nextV2Widget('Treeview', [])]
    expect(() => generateV2Code(design, 'coa')).toThrow(/todavía no admite: Treeview/)
  })

  it('imports the reported multiline ttkbootstrap interface with an acyclic hierarchy', () => {
    const source = readFileSync(new URL('./fixtures/ttkbootstrap-designer-regression.py', import.meta.url), 'utf8')
    const design = importGeneratedGui(source)
    expect(design?.widgets).toHaveLength(11)
    expect(design?.window.theme).toBe('darkly')
    const byName = new Map(design!.widgets.map(widget => [widget.name, widget]))
    expect(byName.get('frame_principal')?.parentId).toBeNull()
    expect(byName.get('titulo')?.parentId).toBe(byName.get('frame_principal')?.id)
    expect(byName.get('titulo')).toMatchObject({fontFamily:'Arial',fontSize:20,bold:true,bootstyle:'primary',layout:{manager:'pack',pady:10}})
    expect(byName.get('frame_principal')?.layout).toMatchObject({manager:'pack',fill:'both',expand:true,padx:20,pady:20})
    expect(byName.get('frame_formulario')?.parentId).toBe(byName.get('frame_principal')?.id)
    expect(byName.get('combo_seccion')?.parentId).toBe(byName.get('frame_formulario')?.id)
    expect(byName.get('btn_eliminar')?.parentId).toBe(byName.get('frame_botones')?.id)
    expect(descendantsOf(design!, byName.get('frame_principal')!.id)).toHaveLength(10)
    expect(() => generateV2Code(design!, 'ttkbootstrap', 'class')).not.toThrow()
    expect(() => restoreV2Design(structuredClone(design))).not.toThrow()
  })

  it('repairs self-parent, cycles, missing parents and duplicate IDs without recursion', () => {
    const base = newV2Design()
    const a = nextV2Widget('Frame', []), b = nextV2Widget('Frame', [a]), missing = nextV2Widget('Button', [a, b])
    a.id = 'a'; a.parentId = 'b'; b.id = 'b'; b.parentId = 'a'; missing.id = 'missing'; missing.parentId = 'does-not-exist'
    const self = nextV2Widget('Frame', [a, b, missing]); self.id = 'self'; self.parentId = 'self'
    const duplicate = nextV2Widget('Label', [a, b, missing, self]); duplicate.id = 'a'
    const recovered = normalizeV2Design({ ...base, widgets: [a, b, missing, self, duplicate] })
    expect(recovered.issues.join(' ')).toMatch(/duplicado|autorreferencia|no existe|ciclo/)
    expect(new Set(recovered.design.widgets.map(widget => widget.id)).size).toBe(5)
    for (const widget of recovered.design.widgets) expect(() => descendantsOf(recovered.design, widget.id)).not.toThrow()
    expect(() => validateV2Design(recovered.design)).not.toThrow()
    expect(() => generateV2Code(recovered.design, 'tkinter', 'simple')).not.toThrow()
  })

  it('round-trips imported theme, typography, bootstyle and grid/pack options',()=>{const source=`import ttkbootstrap as ttk\nfrom ttkbootstrap.constants import *\nroot = ttk.Window(themename="superhero")\nmain = ttk.Frame(root)\nmain.pack(side=LEFT, fill=BOTH, expand=YES, padx=20, pady=10)\ntitulo = ttk.Label(main, text="Gestión", font=("Arial", 22, "bold"), bootstyle="primary")\ntitulo.grid(row=1, column=2, sticky=NSEW, padx=8, pady=9)\n`;const design=importGeneratedGui(source)!;expect(design.window.theme).toBe('superhero');expect(design.widgets[0].layout).toMatchObject({manager:'pack',side:'left',fill:'both',expand:true,padx:20,pady:10});expect(design.widgets[1]).toMatchObject({fontFamily:'Arial',fontSize:22,bold:true,bootstyle:'primary',layout:{manager:'grid',row:1,column:2,sticky:'nsew',padx:8,pady:9}});expect(generateV2Code(design,'ttkbootstrap','simple')).toContain('font=["Arial", 22, "bold"]')})
})
