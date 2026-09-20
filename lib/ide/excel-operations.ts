import type { Field } from './builder'
import type { FileOperation } from './file-builder'

const expr = (key: string, label: string, value: string): Field => ({ key, label, value, kind: 'expression' })
const select = (key: string, label: string, value: string, options: string[]): Field => ({ key, label, value, options })
const quote = (value: string) => JSON.stringify(value)
const operation = (id: string, group: string, title: string, method: string, fields: Field[], body: (v: Record<string, string>) => string, imports = ['from openpyxl import load_workbook'], result?: string): FileOperation => ({
  id: `excel-${id}`, kind: 'Excel', group, title, method, fields, data: fields.some((field) => field.key === 'data'),
  help: 'Genera Python estándar con openpyxl; puedes copiarlo y ejecutarlo fuera de COA.',
  build: (values) => ({ body: body(values), imports, result }),
})
const cell = expr('cell', 'Celda', '"A1"')
const sheet = expr('sheet', 'Nombre de hoja', '"Hoja1"')
const value = expr('data', 'Valor / variable', '"Dato"')
const column = expr('column', 'Columna (número, desde 1)', '2')
const open = (v: Record<string, string>) => `wb = load_workbook(${v.pathExpression})\nws = wb.active`
const save = (v: Record<string, string>) => `\nwb.save(${v.pathExpression})`

export const excelOperations: FileOperation[] = [
  operation('create','Crear / guardar','Crear libro Excel','crear_excel',[],v=>`wb = Workbook()\nws = wb.active${save(v)}`,['from openpyxl import Workbook']),
  operation('create-title','Crear / guardar','Crear libro y cambiar nombre de hoja','crear_excel_con_hoja',[sheet],v=>`wb = Workbook()\nws = wb.active\nws.title = ${v.sheet}${save(v)}`,['from openpyxl import Workbook']),
  operation('save','Crear / guardar','Guardar libro','guardar_excel',[],v=>`wb.save(${v.pathExpression})`,[]),
  operation('save-as','Crear / guardar','Guardar como otro archivo','guardar_como',[expr('target','Nueva ruta','"copia.xlsx"')],v=>`${open(v)}\nwb.save(${v.target})`),
  operation('open','Abrir','Abrir Excel existente','abrir_excel',[],v=>open(v)),
  operation('active','Abrir','Seleccionar hoja activa','hoja_activa',[],v=>`${open(v)}\nprint(ws.title)`),
  operation('select','Abrir','Seleccionar hoja por nombre','seleccionar_hoja',[sheet],v=>`wb = load_workbook(${v.pathExpression})\nws = wb[${v.sheet}]`),
  operation('sheetnames','Abrir','Mostrar nombres de hojas','mostrar_hojas',[],v=>`wb = load_workbook(${v.pathExpression})\nprint(wb.sheetnames)`),
  operation('write-cell','Celdas','Escribir en una celda','escribir_celda',[cell,value],v=>`${open(v)}\nws[${v.cell}] = ${v.data}${save(v)}`),
  operation('read-cell','Celdas','Leer una celda','leer_celda',[cell],v=>`${open(v)}\nvalor = ws[${v.cell}].value`,undefined,'valor'),
  operation('update-cell','Celdas','Actualizar una celda','actualizar_celda',[cell,value],v=>`${open(v)}\nws[${v.cell}] = ${v.data}${save(v)}`),
  operation('rows','Celdas','Recorrer filas','recorrer_filas',[],v=>`${open(v)}\nfor fila in ws.iter_rows(values_only=True):\n    print(fila)`),
  operation('columns','Celdas','Recorrer columnas','recorrer_columnas',[],v=>`${open(v)}\nfor columna in ws.iter_cols(values_only=True):\n    print(columna)`),
  operation('max-row','Celdas','Obtener max_row','obtener_max_fila',[],v=>`${open(v)}\ncantidad = ws.max_row`,undefined,'cantidad'),
  operation('max-column','Celdas','Obtener max_column','obtener_max_columna',[],v=>`${open(v)}\ncantidad = ws.max_column`,undefined,'cantidad'),
  operation('append','Filas / datos','Agregar una fila','agregar_fila',[expr('data','Fila (lista / variable)','["Ana", 95]')],v=>`${open(v)}\nws.append(${v.data})${save(v)}`),
  operation('append-many','Filas / datos','Agregar múltiples filas','agregar_filas',[expr('data','Filas (lista de listas / variable)','[["Ana", 95], ["Luis", 87]]')],v=>`${open(v)}\nfor fila in ${v.data}:\n    ws.append(fila)${save(v)}`),
  operation('read-all','Filas / datos','Leer todas las filas','leer_filas',[],v=>`${open(v)}\nfilas = list(ws.iter_rows(values_only=True))`,undefined,'filas'),
  operation('search','Filas / datos','Buscar un valor','buscar_valor',[value],v=>`${open(v)}\nencontrado = None\nfor fila in ws.iter_rows():\n    for celda in fila:\n        if celda.value == ${v.data}:\n            encontrado = celda.coordinate\n            break\n    if encontrado:\n        break`,undefined,'encontrado'),
  operation('filter','Filas / datos','Filtrar filas por columna','filtrar_filas',[column,value],v=>`${open(v)}\nfilas = []\nfor fila in ws.iter_rows(values_only=True):\n    if len(fila) >= ${v.column} and fila[${v.column} - 1] == ${v.data}:\n        filas.append(fila)`,undefined,'filas'),
  operation('copy','Filas / datos','Copiar datos a otro libro','copiar_datos',[expr('target','Archivo de destino','"copia.xlsx"')],v=>`${open(v)}\nnuevo = Workbook()\ndestino = nuevo.active\nfor fila in ws.iter_rows(values_only=True):\n    destino.append(fila)\nnuevo.save(${v.target})`,['from openpyxl import Workbook','from openpyxl import load_workbook']),
  ...([['sum','Sumar una columna','sum(valores)'],['average','Promedio de una columna','sum(valores) / len(valores)'],['maximum','Valor mayor','max(valores)'],['minimum','Valor menor','min(valores)']] as const).map(([id,title,formula])=>operation(id,'Cálculos',title,{sum:'sumar_columna',average:'promedio_columna',maximum:'mayor_columna',minimum:'menor_columna'}[id],[column],v=>`${open(v)}\nvalores = []\nfor fila in range(2, ws.max_row + 1):\n    valor = ws.cell(fila, ${v.column}).value\n    if isinstance(valor, (int, float)):\n        valores.append(valor)\nresultado = ${formula} if valores else None`,undefined,'resultado')),
  operation('count','Cálculos','Contar registros','contar_registros',[],v=>`${open(v)}\ncantidad = max(ws.max_row - 1, 0)`,undefined,'cantidad'),
  operation('bold','Formato','Negrita con Font','aplicar_negrita',[cell],v=>`${open(v)}\nws[${v.cell}].font = Font(bold=True)${save(v)}`,['from openpyxl import load_workbook','from openpyxl.styles import Font']),
  operation('font-size','Formato','Tamaño de fuente','cambiar_fuente',[cell,expr('size','Tamaño','14')],v=>`${open(v)}\nws[${v.cell}].font = Font(size=${v.size})${save(v)}`,['from openpyxl import load_workbook','from openpyxl.styles import Font']),
  operation('alignment','Formato','Alineación','alinear_celda',[cell,select('alignment','Alineación','center',['left','center','right'])],v=>`${open(v)}\nws[${v.cell}].alignment = Alignment(horizontal=${quote(v.alignment)})${save(v)}`,['from openpyxl import load_workbook','from openpyxl.styles import Alignment']),
  operation('fill','Formato','Color de relleno','rellenar_celda',[cell,expr('color','Color RGB','"FFF2CC"')],v=>`${open(v)}\nws[${v.cell}].fill = PatternFill("solid", fgColor=${v.color})${save(v)}`,['from openpyxl import load_workbook','from openpyxl.styles import PatternFill']),
  operation('border','Formato','Bordes básicos','bordes_celda',[cell],v=>`${open(v)}\nlado = Side(style="thin", color="000000")\nws[${v.cell}].border = Border(left=lado, right=lado, top=lado, bottom=lado)${save(v)}`,['from openpyxl import load_workbook','from openpyxl.styles import Border, Side']),
  operation('width','Formato','Ancho de columna','ancho_columna',[expr('letter','Letra de columna','"A"'),expr('width','Ancho','20')],v=>`${open(v)}\nws.column_dimensions[${v.letter}].width = ${v.width}${save(v)}`),
  operation('number-format','Formato','Formato numérico básico','formato_numerico',[cell,expr('format','Formato','"#,##0.00"')],v=>`${open(v)}\nws[${v.cell}].number_format = ${v.format}${save(v)}`),
  operation('create-sheet','Hojas','Crear hoja','crear_hoja',[sheet],v=>`wb = load_workbook(${v.pathExpression})\nwb.create_sheet(${v.sheet})${save(v)}`),
  operation('rename-sheet','Hojas','Renombrar hoja','renombrar_hoja',[sheet],v=>`${open(v)}\nws.title = ${v.sheet}${save(v)}`),
  operation('remove-sheet','Hojas','Eliminar hoja','eliminar_hoja',[sheet],v=>`wb = load_workbook(${v.pathExpression})\nwb.remove(wb[${v.sheet}])${save(v)}`),
  operation('report','Reportes','Crear reporte Excel simple','crear_reporte',[expr('title','Título','"Reporte"'),expr('data','Filas (lista de listas)','[["Producto", "Total"], ["Mouse", 16000]]')],v=>`wb = Workbook()\nws = wb.active\nws.title = ${v.title}\nfor fila in ${v.data}:\n    ws.append(fila)${save(v)}`,['from openpyxl import Workbook']),
  operation('table','Reportes','Crear tabla encabezado + datos + total','crear_tabla',[expr('headings','Encabezados','["Producto", "Total"]'),expr('data','Datos','[["Mouse", 16000], ["Teclado", 15000]]')],v=>`wb = Workbook()\nws = wb.active\nws.append(${v.headings})\nfor fila in ${v.data}:\n    ws.append(fila)\nws.append(["TOTAL", f"=SUM(B2:B{ws.max_row})"])${save(v)}`,['from openpyxl import Workbook']),
  operation('csv','Reportes','CSV → Excel','csv_a_excel',[expr('source','Archivo CSV','"ventas.csv"'),select('delimiter','Delimitador',';',[';',','])],v=>`wb = Workbook()\nws = wb.active\nwith open(${v.source}, "r", encoding="utf-8", newline="") as archivo:\n    lector = csv.reader(archivo, delimiter=${quote(v.delimiter)})\n    for fila in lector:\n        ws.append(fila)${save(v)}`,['import csv','from openpyxl import Workbook']),
]
