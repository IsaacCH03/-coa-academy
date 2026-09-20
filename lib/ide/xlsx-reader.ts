import JSZip from 'jszip'

export type XlsxStyle = { bold?: boolean; color?: string; background?: string; align?: string; border?: boolean; numberFormat?: string }
export type XlsxCell = { value: string; style?: XlsxStyle; merge?: { columns: number; rows: number } }
export type XlsxSheet = { name: string; rows: number; columns: number; widths: number[]; cells: Map<string, XlsxCell> }
export type XlsxBook = { sheets: XlsxSheet[] }
const xml = (text: string) => new DOMParser().parseFromString(text, 'application/xml')
const children = (node: ParentNode, name: string) => Array.from(node.children).filter((child) => child.localName === name)
const child = (node: ParentNode, name: string) => children(node, name)[0]
const color = (node?: Element) => node?.getAttribute('rgb')?.replace(/^FF(?=[0-9A-F]{6}$)/i, '')
export function columnLabel(index: number) { let value = ''; for (let n=index;n>0;n=Math.floor((n-1)/26)) value=String.fromCharCode(65+(n-1)%26)+value; return value }
function cellPosition(reference: string) { const match=/^([A-Z]+)(\d+)$/.exec(reference)!; let column=0; for(const letter of match[1]) column=column*26+letter.charCodeAt(0)-64; return { row:Number(match[2]), column } }
function resolvePath(base: string, target: string) { if (target.startsWith('/')) return target.slice(1); const stack=base.split('/'); stack.pop(); for(const part of target.split('/')) { if(part==='..') stack.pop(); else if(part!=='.') stack.push(part) } return stack.join('/') }

export async function readXlsx(bytes: Uint8Array): Promise<XlsxBook> {
  const zip = await JSZip.loadAsync(bytes)
  const read = async (path: string) => { const file=zip.file(path); if(!file) throw new Error(`El XLSX no contiene ${path}.`); return xml(await file.async('text')) }
  const workbook = await read('xl/workbook.xml'), relations = await read('xl/_rels/workbook.xml.rels')
  const targets = new Map(children(relations.documentElement,'Relationship').map((item)=>[item.getAttribute('Id'),item.getAttribute('Target')!]))
  const sharedDoc = zip.file('xl/sharedStrings.xml') ? await read('xl/sharedStrings.xml') : null
  const shared = sharedDoc ? children(sharedDoc.documentElement,'si').map((item)=>Array.from(item.getElementsByTagNameNS('*','t')).map((part)=>part.textContent??'').join('')) : []
  const stylesDoc = zip.file('xl/styles.xml') ? await read('xl/styles.xml') : null
  const fonts = stylesDoc ? children(child(stylesDoc.documentElement,'fonts'),'font') : []
  const fills = stylesDoc ? children(child(stylesDoc.documentElement,'fills'),'fill') : []
  const borders = stylesDoc ? children(child(stylesDoc.documentElement,'borders'),'border') : []
  const formats = new Map(stylesDoc ? children(child(stylesDoc.documentElement,'numFmts'),'numFmt').map((item)=>[item.getAttribute('numFmtId'),item.getAttribute('formatCode')??'']) : [])
  const xfs = stylesDoc ? children(child(stylesDoc.documentElement,'cellXfs'),'xf') : []
  const styleFor = (index: number): XlsxStyle | undefined => {
    const xf=xfs[index]; if(!xf) return undefined
    const font=fonts[Number(xf.getAttribute('fontId')??0)], fill=fills[Number(xf.getAttribute('fillId')??0)], border=borders[Number(xf.getAttribute('borderId')??0)]
    const foreground=fill && color(child(child(fill,'patternFill'),'fgColor')); const fontColor=font && color(child(font,'color'))
    const alignment=child(xf,'alignment')?.getAttribute('horizontal')??undefined
    const format=formats.get(xf.getAttribute('numFmtId')) ?? ({14:'mm-dd-yy',15:'d-mmm-yy',16:'d-mmm',17:'mmm-yy',22:'m/d/yy h:mm'} as Record<string,string>)[xf.getAttribute('numFmtId')??'']
    return { bold: !!font?.getElementsByTagNameNS('*','b').length, color: fontColor, background: foreground, align: alignment, border: !!border && ['left','right','top','bottom'].some((side)=>child(border,side)?.hasAttribute('style')), numberFormat: format }
  }
  const sheets: XlsxSheet[]=[]
  for(const sheetNode of Array.from(workbook.getElementsByTagNameNS('*','sheet'))) {
    const id=sheetNode.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id') ?? sheetNode.getAttribute('r:id')!
    const path=resolvePath('xl/workbook.xml',targets.get(id)!)
    const document=await read(path), cells=new Map<string,XlsxCell>(); let rows=0, columns=0
    for(const node of Array.from(document.getElementsByTagNameNS('*','c'))) {
      const reference=node.getAttribute('r')!, position=cellPosition(reference), type=node.getAttribute('t'), raw=child(node,'v')?.textContent??''
      const style=styleFor(Number(node.getAttribute('s')??0))
      let value=type==='s'?shared[Number(raw)]??'':type==='b'?(raw==='1'?'VERDADERO':'FALSO'):type==='inlineStr'?Array.from(node.getElementsByTagNameNS('*','t')).map((part)=>part.textContent??'').join(''):raw
      if(type==='n' && style?.numberFormat && /[dmy]/i.test(style.numberFormat) && Number.isFinite(Number(raw))) value=new Date(Date.UTC(1899,11,30+Number(raw))).toISOString().slice(0,10)
      const formula=child(node,'f')?.textContent; if(formula && !value) value=`=${formula}`
      cells.set(reference,{value,style}); rows=Math.max(rows,position.row); columns=Math.max(columns,position.column)
    }
    for(const merge of Array.from(document.getElementsByTagNameNS('*','mergeCell'))) { const [from,to]=(merge.getAttribute('ref')??'').split(':'); if(!to) continue; const a=cellPosition(from),b=cellPosition(to),current=cells.get(from)??{value:''}; current.merge={columns:b.column-a.column+1,rows:b.row-a.row+1}; cells.set(from,current) }
    const widths:number[]=[]; for(const col of Array.from(document.getElementsByTagNameNS('*','col'))) for(let index=Number(col.getAttribute('min'));index<=Number(col.getAttribute('max'));index++) widths[index-1]=Math.min(320,Math.max(64,Number(col.getAttribute('width')??12)*7))
    sheets.push({name:sheetNode.getAttribute('name')??'Hoja',rows,columns,widths,cells})
  }
  return { sheets }
}
