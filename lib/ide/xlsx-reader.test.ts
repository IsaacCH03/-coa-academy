// @vitest-environment jsdom
import { expect, it } from 'vitest'
import JSZip from 'jszip'
import { columnLabel, readXlsx } from './xlsx-reader'

it('reads multiple XLSX sheets, values, booleans, widths and merged cells without evaluating formulas',async()=>{
  const zip=new JSZip()
  zip.file('xl/workbook.xml','<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Ventas" sheetId="1" r:id="rId1"/><sheet name="Resumen" sheetId="2" r:id="rId2"/></sheets></workbook>')
  zip.file('xl/_rels/workbook.xml.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Target="worksheets/sheet2.xml"/></Relationships>')
  zip.file('xl/sharedStrings.xml','<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><si><t>Producto</t></si><si><t>Mouse</t></si></sst>')
  zip.file('xl/worksheets/sheet1.xml','<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="20"/></cols><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="b"><v>1</v></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2"><f>1+1</f><v>2</v></c></row></sheetData><mergeCells><mergeCell ref="A1:A2"/></mergeCells></worksheet>')
  zip.file('xl/worksheets/sheet2.xml','<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Total</t></is></c></row></sheetData></worksheet>')
  const book=await readXlsx(await zip.generateAsync({type:'uint8array'}))
  expect(book.sheets.map(sheet=>sheet.name)).toEqual(['Ventas','Resumen'])
  expect(book.sheets[0].cells.get('A2')?.value).toBe('Mouse')
  expect(book.sheets[0].cells.get('B1')?.value).toBe('VERDADERO')
  expect(book.sheets[0].cells.get('B2')?.value).toBe('2')
  expect(book.sheets[0].cells.get('A1')?.merge).toEqual({columns:1,rows:2})
  expect(book.sheets[0].widths[0]).toBe(140)
  expect(columnLabel(28)).toBe('AB')
})
