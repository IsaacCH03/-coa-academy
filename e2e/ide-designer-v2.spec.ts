import { expect, test } from '@playwright/test'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'

test('Designer V2 recovers a persisted cyclic hierarchy without clearing browser data', async ({ page }) => {
  await page.goto('/ide')
  const welcome = page.getByRole('button', { name: 'Comenzar', exact: true })
  if (await welcome.isVisible()) await welcome.click()
  await expect(page.getByRole('button', { name: 'Diseñador', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  await page.locator('.gui-palette').getByRole('button', { name: 'Frame', exact: true }).click()
  await page.getByRole('button', { name: 'Guardar diseño' }).click()
  await page.waitForTimeout(300)
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request=indexedDB.open('coa-python-ide',1);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error) })
    const project = await new Promise<Record<string, unknown>>((resolve, reject) => { const request=db.transaction('workspace').objectStore('workspace').get('project');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error) })
    project.guiDesign = { schemaVersion:2, window:{title:'Corrupto',width:500,height:400,framework:'ttkbootstrap',theme:'darkly',background:'#222222',exportMode:'class'}, widgets:[{id:'a',type:'Frame',name:'a',parentId:'b',layout:{manager:'place',x:0,y:0,width:100,height:100}},{id:'b',type:'Frame',name:'b',parentId:'a',layout:{manager:'place',x:0,y:0,width:100,height:100}}] }
    await new Promise<void>((resolve, reject) => { const transaction=db.transaction('workspace','readwrite');transaction.objectStore('workspace').put(project,'project');transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error) })
    db.close()
  })
  await page.reload()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  await expect(page.getByLabel('Área de diseño')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Limpiar diseño' })).toBeVisible()
  await page.getByRole('button', { name: 'Exportar a ttkbootstrap' }).click()
  await expect(page.getByTestId('gui-code')).toContainText('ttk.Window')
})

test('Designer V2 builds hierarchy, configures widgets and round-trips ttkbootstrap', async ({ page }) => {
  await page.goto('/ide')
  const welcome = page.getByRole('button', { name: 'Comenzar', exact: true })
  if (await welcome.isVisible()) await welcome.click()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  const palette = page.locator('.gui-palette')
  const properties = page.locator('.gui-properties')
  const canvas = page.getByLabel('Área de diseño')

  await palette.getByRole('button', { name: 'Frame', exact: true }).click()
  await properties.getByLabel('Nombre de variable').fill('header')
  await palette.getByText('Entrada', { exact: true }).click()
  await palette.getByRole('button', { name: 'Combobox', exact: true }).click()
  await properties.getByLabel('Nombre de variable').fill('categoria')
  await properties.getByRole('textbox',{name:'Opción 1',exact:true}).fill('Todos'); await properties.getByRole('textbox',{name:'Opción 2',exact:true}).fill('Libros'); await properties.getByRole('button',{name:'+ Agregar opción'}).click(); await properties.getByRole('textbox',{name:'Opción 3',exact:true}).fill('Tecnología')
  await properties.getByLabel('Bootstyle').selectOption('info')
  await expect(palette.getByRole('button', { name: 'Combobox — categoria' })).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Combobox categoria' })).toContainText('Todos')

  await palette.getByText('Datos', { exact: true }).click()
  await palette.getByRole('button', { name: 'Tabla', exact: true }).click()
  await properties.getByLabel('Nombre de variable').fill('productos')
  await properties.getByRole('button',{name:'+ Agregar columna'}).click()
  const columnTitles=properties.getByLabel('Título')
  await columnTitles.nth(0).fill('Producto'); await columnTitles.nth(1).fill('Cant.'); await columnTitles.nth(2).fill('Precio')
  await palette.getByRole('button', { name: 'Ventana — root' }).click()
  await palette.getByRole('button', { name: 'Pestañas', exact: true }).click()
  const tabs=properties.locator('.gui-list-editor input'); await tabs.nth(0).fill('Catálogo')
  await properties.getByRole('button',{name:'+ Agregar pestaña'}).click(); await tabs.nth(1).fill('Carrito')

  await palette.getByRole('button', { name: 'Ventana — root' }).click()
  await palette.getByLabel('Framework').selectOption('ttkbootstrap')
  await palette.getByLabel('Tema').selectOption('cyborg')
  await palette.getByLabel('Estructura').selectOption('class')
  await page.getByRole('button', { name: 'Exportar a ttkbootstrap' }).click()
  const code = page.getByTestId('gui-code')
  await expect(code).toContainText('import ttkbootstrap as ttk')
  await expect(code).toContainText('ttk.Window(themename="cyborg")')
  await expect(code).toContainText('self.categoria = ttk.Combobox(self.header')
  await expect(code).toContainText('self.productos.heading("producto"')
  const generated = await code.textContent()
  await page.getByRole('button', { name: 'Cerrar código generado' }).click()

  await palette.getByRole('button', { name: 'Guardar diseño' }).click()
  await page.reload()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  await expect(page.getByLabel('Área de diseño').getByRole('button', { name: 'Combobox categoria' })).toBeVisible()
  await expect(page.locator('.gui-palette').getByLabel('Tema')).toHaveValue('cyborg')

  await page.getByRole('button', { name: 'Importar código COA GUI / Tkinter' }).click()
  const dialog = page.getByRole('dialog', { name: 'Importar código' })
  await dialog.getByLabel('Código COA GUI').fill(generated ?? '')
  await dialog.getByRole('button', { name: 'Cargar en diseñador' }).click()
  await page.getByRole('dialog', { name: 'Reemplazar diseño actual' }).getByRole('button', { name: 'Importar' }).click()
  await expect(page.getByLabel('Área de diseño').getByRole('button', { name: 'Combobox categoria' })).toBeVisible()
  await page.locator('.gui-palette').getByRole('button', { name: 'Expandir header' }).click()
  await expect(page.locator('.gui-palette').getByRole('button', { name: 'Combobox — categoria' })).toBeVisible()
})

test('Designer V2 supports direct resize, numeric drafts and live visual properties',async({page})=>{await page.goto('/ide');const welcome=page.getByRole('button',{name:'Comenzar',exact:true});if(await welcome.isVisible())await welcome.click();await page.getByRole('button',{name:'Diseñador',exact:true}).click();const palette=page.locator('.gui-palette'),properties=page.locator('.gui-properties');await palette.getByRole('button',{name:'Ventana — root'}).click();await palette.getByLabel('Ancho').fill('900');await palette.getByLabel('Ancho').press('Enter');await palette.getByLabel('Framework').selectOption('ttkbootstrap');await palette.getByLabel('Tema').selectOption('superhero');await expect(page.getByLabel('Área de diseño')).toContainText('superhero');await palette.getByRole('button',{name:'Label',exact:true}).click();await properties.getByLabel('Texto',{exact:true}).fill('Título visual');await properties.locator('label').filter({hasText:/^FuenteArial/}).locator('select').selectOption('Arial');await properties.getByLabel('Tamaño de fuente').fill('24');await properties.getByLabel('Tamaño de fuente').press('Enter');await properties.getByText('Negrita').click();const label=page.getByRole('button',{name:/Label label/});await expect(label).toHaveCSS('font-size','24px');const before=await label.boundingBox();const handle=label.locator('.gui-resize.se');const box=await handle.boundingBox();if(!before||!box)throw new Error('No se encontraron handles');await page.mouse.move(box.x+3,box.y+3);await page.mouse.down();await page.mouse.move(box.x+63,box.y+43);await page.mouse.up();const after=await label.boundingBox();expect(after!.width).toBeGreaterThan(before.width+30);await palette.getByText('Entrada',{exact:true}).click();await palette.getByRole('button',{name:'Combobox',exact:true}).click();await properties.getByRole('button',{name:'+ Agregar opción'}).click();await properties.getByRole('textbox',{name:'Opción 3',exact:true}).fill('Pequeño');await expect(page.getByRole('button',{name:/Combobox combo/})).toContainText('Opción 1')})

test('imports complete student panel with coherent pack and grid geometry',async({page})=>{const source=readFileSync(join(process.cwd(),'lib/ide/fixtures/panel-estudiantes.py'),'utf8');await page.goto('/ide');const welcome=page.getByRole('button',{name:'Comenzar',exact:true});if(await welcome.isVisible())await welcome.click();await page.getByRole('button',{name:'Diseñador',exact:true}).click();await page.getByRole('button',{name:'Importar código COA GUI / Tkinter'}).click();const dialog=page.getByRole('dialog',{name:'Importar código'});await dialog.getByLabel('Código COA GUI').fill(source);await dialog.getByRole('button',{name:'Cargar en diseñador'}).click();const confirm=page.getByRole('dialog',{name:'Reemplazar diseño actual'});if(await confirm.isVisible())await confirm.getByRole('button',{name:'Importar'}).click();await expect(page.locator('.gui-palette').getByLabel('Tema')).toHaveValue('superhero');const bounds=async(name:string)=>{const box=await page.locator(`.gui-control[aria-label$=" ${name}"]`).boundingBox();if(!box)throw new Error(`Sin bounds: ${name}`);return box},main=await bounds('main'),header=await bounds('header'),title=await bounds('titulo'),newButton=await bounds('btn_nuevo'),form=await bounds('formulario'),entry=await bounds('entry_nombre'),combo=await bounds('combo_seccion'),table=await bounds('panel_tabla'),save=await bounds('btn_guardar'),edit=await bounds('btn_editar'),remove=await bounds('btn_eliminar'),exit=await bounds('btn_salir');expect(header.width).toBeGreaterThan(main.width*.85);expect(title.x).toBeLessThan(newButton.x);expect(form.width).toBeGreaterThan(main.width*.85);expect(entry.width).toBeGreaterThan(180);expect(combo.width).toBeGreaterThan(120);expect(table.width).toBeGreaterThan(main.width*.85);expect(table.height).toBeGreaterThan(130);expect(save.x).toBeLessThan(edit.x);expect(edit.x).toBeLessThan(remove.x);expect(exit.x).toBeGreaterThan(remove.x)})

test('keeps deep Notebook and administrative layouts structurally separated',async({page})=>{await page.goto('/ide');const welcome=page.getByRole('button',{name:'Comenzar',exact:true});if(await welcome.isVisible())await welcome.click();await page.getByRole('button',{name:'Diseñador',exact:true}).click();const load=async(file:string)=>{await page.getByRole('button',{name:'Importar código COA GUI / Tkinter'}).click();const dialog=page.getByRole('dialog',{name:'Importar código'});await dialog.getByLabel('Código COA GUI').fill(readFileSync(join(process.cwd(),'lib/ide/fixtures',file),'utf8'));await dialog.getByRole('button',{name:'Cargar en diseñador'}).click();const confirm=page.getByRole('dialog',{name:'Reemplazar diseño actual'});if(await confirm.isVisible())await confirm.getByRole('button',{name:'Importar'}).click()},bounds=async(name:string)=>{const box=await page.locator(`.gui-control[aria-label$=" ${name}"]`).boundingBox();if(!box)throw new Error(`Sin bounds: ${name}`);return box};await load('sistema-reservas-regression.py');const tabs=await bounds('tabs'),form=await bounds('formulario'),table=await bounds('tabla');expect(form.x).toBeGreaterThanOrEqual(tabs.x);expect(form.y).toBeGreaterThan(tabs.y+25);expect(table.y).toBeGreaterThan(form.y);await expect(page.locator('.gui-control[aria-label$=" preferencias"]')).not.toBeVisible();await load('panel-administrativo-regression.py');const sidebar=await bounds('sidebar'),content=await bounds('contenido'),pending=await bounds('pendientes'),reviews=await bounds('revisiones'),notes=await bounds('text_notas'),footer=await bounds('footer'),exit=await bounds('salir'),scale=await bounds('escala_vertical'),progress=await bounds('progreso_vertical');expect(sidebar.x+sidebar.width).toBeLessThanOrEqual(content.x);expect(pending.x+pending.width).toBeLessThanOrEqual(reviews.x);expect(notes.y).toBeGreaterThan(pending.y);expect(exit.x).toBeGreaterThanOrEqual(footer.x);expect(exit.y).toBeGreaterThanOrEqual(footer.y);expect(scale.height).toBeGreaterThan(scale.width);expect(progress.height).toBeGreaterThan(progress.width)})

test('edits one visual rectangle across place, grid and pack with undo and redo',async({page})=>{await page.goto('/ide');const welcome=page.getByRole('button',{name:'Comenzar',exact:true});if(await welcome.isVisible())await welcome.click();await page.getByRole('button',{name:'Diseñador',exact:true}).click();const palette=page.locator('.gui-palette'),properties=page.locator('.gui-properties');await palette.getByRole('button',{name:'Limpiar diseño'}).click();await page.getByRole('dialog',{name:'Limpiar diseño'}).getByRole('button',{name:'Limpiar'}).click();await palette.getByRole('button',{name:'Label',exact:true}).click();const label=page.getByRole('button',{name:/Label label/}),before=await label.boundingBox();if(!before)throw new Error('Label sin geometría');await properties.getByLabel('Gestor Tk').selectOption('grid');await page.mouse.move(before.x+20,before.y+15);await page.mouse.down();await page.mouse.move(before.x+90,before.y+75);await page.mouse.up();const grid=await label.boundingBox();expect(grid!.x).toBeGreaterThan(before.x+20);await properties.getByLabel('Gestor Tk').selectOption('pack');const packedBefore=await label.boundingBox();await page.mouse.move(packedBefore!.x+20,packedBefore!.y+15);await page.mouse.down();await page.mouse.move(packedBefore!.x+70,packedBefore!.y+45);await page.mouse.up();const packed=await label.boundingBox();expect(packed!.x).toBeGreaterThan(packedBefore!.x+20);await properties.getByLabel('Gestor Tk').selectOption('place');const placed=await label.boundingBox();expect(Math.abs(placed!.x-packed!.x)).toBeLessThan(3);await palette.getByRole('button',{name:'Deshacer'}).click();await palette.getByRole('button',{name:'Deshacer'}).click();const undone=await label.boundingBox();expect(undone!.x).toBeLessThan(placed!.x);await palette.getByRole('button',{name:'Rehacer'}).click();await palette.getByRole('button',{name:'Rehacer'}).click();const redone=await label.boundingBox();expect(redone!.x).toBeGreaterThanOrEqual(placed!.x-2)})

test('reparents visually into and out of a Labelframe',async({page})=>{await page.goto('/ide');const welcome=page.getByRole('button',{name:'Comenzar',exact:true});if(await welcome.isVisible())await welcome.click();await page.getByRole('button',{name:'Diseñador',exact:true}).click();const palette=page.locator('.gui-palette'),properties=page.locator('.gui-properties');await palette.getByRole('button',{name:'Limpiar diseño'}).click();await page.getByRole('dialog',{name:'Limpiar diseño'}).getByRole('button',{name:'Limpiar'}).click();await palette.getByRole('button',{name:'Labelframe',exact:true}).click();await properties.getByLabel('Nombre de variable').fill('grupo');await palette.getByRole('button',{name:'Ventana — root'}).click();await palette.getByRole('button',{name:'Label',exact:true}).click();const label=page.getByRole('button',{name:/Label label/}),box=await label.boundingBox();if(!box)throw new Error('Label sin geometría');await page.mouse.move(box.x+20,box.y+15);await page.mouse.down();await page.mouse.move(box.x+60,box.y+60);await page.mouse.up();await expect(properties.getByLabel('Contenedor')).toHaveValue(/.+/);await expect(properties.getByLabel('Contenedor').locator('option:checked')).toHaveText('grupo');const inside=await label.boundingBox();await page.mouse.move(inside!.x+20,inside!.y+15);await page.mouse.down();await page.mouse.move(inside!.x+420,inside!.y+300);await page.mouse.up();await expect(properties.getByLabel('Contenedor')).toHaveValue('')})
