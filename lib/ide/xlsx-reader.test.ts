// @vitest-environment jsdom
import { expect, it } from 'vitest'
import JSZip from 'jszip'
import { columnLabel, readXlsx, XlsxStructureError } from './xlsx-reader'

const mainNs = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const packageNs = 'http://schemas.openxmlformats.org/package/2006/relationships'
async function workbook(options: { workbook?: string; relationships?: string; sheets?: Record<string, string>; shared?: string; styles?: string; theme?: string }) {
  const zip = new JSZip()
  zip.file('xl/workbook.xml', options.workbook ?? `<workbook xmlns="${mainNs}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Hoja1" sheetId="1" r:id="rId1"/></sheets></workbook>`)
  zip.file('xl/_rels/workbook.xml.rels', options.relationships ?? `<Relationships xmlns="${packageNs}"><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>`)
  for (const [path, xml] of Object.entries(options.sheets ?? {})) zip.file(`xl/worksheets/${path}.xml`, xml)
  if (options.shared) zip.file('xl/sharedStrings.xml', options.shared)
  if (options.styles) zip.file('xl/styles.xml', options.styles)
  if (options.theme) zip.file('xl/theme/theme1.xml', options.theme)
  return readXlsx(await zip.generateAsync({ type: 'uint8array' }))
}

it('reads shared strings, multiple sheets, booleans, formulas, widths and merged cells', async () => {
  const book = await workbook({
    workbook: `<workbook xmlns="${mainNs}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Ventas" sheetId="1" r:id="rId1"/><sheet name="Resumen" sheetId="2" r:id="rId2"/></sheets></workbook>`,
    relationships: `<Relationships xmlns="${packageNs}"><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Target="worksheets/sheet2.xml"/></Relationships>`,
    shared: `<sst xmlns="${mainNs}"><si><t>Producto</t></si><si><r><t>Mou</t></r><r><t>se</t></r></si></sst>`,
    sheets: {
      sheet1: `<worksheet xmlns="${mainNs}"><cols><col min="1" max="1" width="20"/></cols><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="b"><v>1</v></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2"><f>1+1</f><v>2</v></c></row></sheetData><mergeCells><mergeCell ref="A1:A2"/></mergeCells></worksheet>`,
      sheet2: `<worksheet xmlns="${mainNs}"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Total</t></is></c></row></sheetData></worksheet>`,
    },
  })
  expect(book.sheets.map((sheet) => sheet.name)).toEqual(['Ventas', 'Resumen'])
  expect(book.sheets[0].cells.get('A2')?.value).toBe('Mouse')
  expect(book.sheets[0].cells.get('B1')?.value).toBe('VERDADERO')
  expect(book.sheets[0].cells.get('B2')?.value).toBe('2')
  expect(book.sheets[0].cells.get('A1')?.merge).toEqual({ columns: 1, rows: 2 })
  expect(book.sheets[0].widths[0]).toBe(140)
  expect(book.sheets[1].cells.get('A1')?.value).toBe('Total')
  expect(columnLabel(28)).toBe('AB')
})

it('accepts a strict OOXML relationship namespace and an arbitrary prefix', async () => {
  const book = await workbook({
    workbook: `<workbook xmlns="${mainNs}" xmlns:rel="http://purl.oclc.org/ooxml/officeDocument/relationships"><sheets><sheet name="Externo" sheetId="1" rel:id="externalSheet"/></sheets></workbook>`,
    relationships: `<Relationships xmlns="${packageNs}"><Relationship Target="/xl/worksheets/sheet1.xml" Id="externalSheet"/></Relationships>`,
    sheets: { sheet1: `<worksheet xmlns="${mainNs}"><sheetData><row><c t="inlineStr"><is><t>Importado</t></is></c></row></sheetData></worksheet>` },
  })
  expect(book.sheets[0].cells.get('A1')?.value).toBe('Importado')
})

it('uses safe defaults for blank rows, absent styles and optional cell references', async () => {
  const book = await workbook({ sheets: { sheet1: `<worksheet xmlns="${mainNs}"><cols><col min="1" max="2"/></cols><sheetData><row/><row><c t="inlineStr"><is><t>A</t></is></c><c/><c t="inlineStr"><is><t>C</t></is></c></row></sheetData></worksheet>` } })
  expect(book.sheets[0].rows).toBe(2)
  expect(book.sheets[0].columns).toBe(3)
  expect(book.sheets[0].cells.get('A2')?.value).toBe('A')
  expect(book.sheets[0].cells.get('B2')?.value).toBe('')
  expect(book.sheets[0].cells.get('C2')?.value).toBe('C')
  expect(book.sheets[0].widths[0]).toBe(112)
})

it('tolerates partial styles and reads RGB, theme, indexed colors and dates', async () => {
  const book = await workbook({
    theme: '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:srgbClr val="112233"/></a:dk1></a:clrScheme></a:themeElements></a:theme>',
    styles: `<styleSheet xmlns="${mainNs}"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts><fonts count="3"><font/><font><b/><color rgb="FF445566"/></font><font><color theme="0"/></font></fonts><fills count="2"><fill/><fill><patternFill><fgColor indexed="2"/></patternFill></fill></fills><cellXfs count="3"><xf/><xf fontId="1" fillId="1" numFmtId="164"/><xf fontId="2" borderId="99"/></cellXfs></styleSheet>`,
    sheets: { sheet1: `<worksheet xmlns="${mainNs}"><sheetData><row r="1"><c r="A1" s="1" t="n"><v>45292</v></c><c r="B1" s="2"><v>7</v></c><c r="C1" s="999"><v>8</v></c></row></sheetData></worksheet>` },
  })
  expect(book.sheets[0].cells.get('A1')).toMatchObject({ value: '2024-01-01', style: { bold: true, color: '445566', background: 'FF0000' } })
  expect(book.sheets[0].cells.get('B1')?.style?.color).toBe('112233')
  expect(book.sheets[0].cells.get('C1')?.style).toBeUndefined()
})

it('reports missing sheet relationships as a structural XLSX error', async () => {
  await expect(workbook({
    workbook: `<workbook xmlns="${mainNs}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Rota" sheetId="1" r:id="missing"/></sheets></workbook>`,
    relationships: `<Relationships xmlns="${packageNs}"/>`,
  })).rejects.toEqual(expect.objectContaining({ name: 'XlsxStructureError', message: expect.stringContaining('relación interna') }))
  expect(XlsxStructureError.prototype).toBeInstanceOf(Error)
})
