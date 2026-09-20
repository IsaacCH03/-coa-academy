import JSZip from 'jszip'

export type XlsxStyle = { bold?: boolean; color?: string; background?: string; align?: string; border?: boolean; numberFormat?: string }
export type XlsxCell = { value: string; style?: XlsxStyle; merge?: { columns: number; rows: number } }
export type XlsxSheet = { name: string; rows: number; columns: number; widths: number[]; cells: Map<string, XlsxCell> }
export type XlsxBook = { sheets: XlsxSheet[] }
export class XlsxStructureError extends Error { constructor(message: string) { super(message); this.name = 'XlsxStructureError' } }
const parseXml = (text: string, path: string) => { const document = new DOMParser().parseFromString(text, 'application/xml'); if (document.getElementsByTagName('parsererror').length) throw new XlsxStructureError(`El componente ${path} contiene XML no válido.`); return document }
const children = (node: ParentNode | null | undefined, name: string) => node ? Array.from(node.children).filter((item) => item.localName === name) : []
const child = (node: ParentNode | null | undefined, name: string) => children(node, name)[0]
const attribute = (node: Element | undefined, name: string) => node ? Array.from(node.attributes).find((item) => item.localName === name)?.value : undefined
const relationshipId = (node: Element) => Array.from(node.attributes).find((item) => item.localName === 'id' && /\/relationships$/i.test(item.namespaceURI ?? ''))?.value ?? Array.from(node.attributes).find((item) => item.localName === 'id' && item.name !== 'sheetId')?.value
export function columnLabel(index: number) { let value = ''; for (let n=index;n>0;n=Math.floor((n-1)/26)) value=String.fromCharCode(65+(n-1)%26)+value; return value }
function cellPosition(reference: string) { const match=/^([A-Z]+)(\d+)$/i.exec(reference); if(!match) throw new XlsxStructureError(`La referencia de celda "${reference}" no es válida.`); let column=0; for(const letter of match[1].toUpperCase()) column=column*26+letter.charCodeAt(0)-64; return { row:Number(match[2]), column } }
function resolvePath(base: string, target: string) { const normalized=target.replaceAll('\\','/'); if(normalized.startsWith('/')) return normalized.slice(1); if(normalized.startsWith('xl/')) return normalized; const stack=base.split('/'); stack.pop(); for(const part of normalized.split('/')) { if(part==='..') stack.pop(); else if(part&&part!=='.') stack.push(part) } return stack.join('/') }
const indexedColors=['000000','FFFFFF','FF0000','00FF00','0000FF','FFFF00','FF00FF','00FFFF']
function nodeColor(node: Element | undefined, theme: string[]) { if(!node)return undefined; const rgb=attribute(node,'rgb')?.replace(/^FF(?=[0-9A-F]{6}$)/i,''); if(rgb&&/^[0-9A-F]{6}$/i.test(rgb))return rgb; const themeIndex=Number(attribute(node,'theme'));if(Number.isInteger(themeIndex)&&themeIndex>=0)return theme[themeIndex];const indexed=Number(attribute(node,'indexed'));if(Number.isInteger(indexed)&&indexed>=0)return indexedColors[indexed];return undefined }

export async function readXlsx(bytes: Uint8Array): Promise<XlsxBook> {
  let zip: JSZip
  try { zip=await JSZip.loadAsync(bytes) } catch { throw new XlsxStructureError('El archivo no es un paquete XLSX válido.') }
  const read=async(path:string,required=true)=>{const file=zip.file(path);if(!file){if(required)throw new XlsxStructureError(`El XLSX no contiene ${path}.`);return null}return parseXml(await file.async('text'),path)}
  const workbook=await read('xl/workbook.xml'),relations=await read('xl/_rels/workbook.xml.rels')
  const relationTargets=new Map<string,{target:string;external:boolean}>()
  for(const item of children(relations!.documentElement,'Relationship')) { const id=attribute(item,'Id'),target=attribute(item,'Target');if(id&&target)relationTargets.set(id,{target,external:attribute(item,'TargetMode')==='External'}) }
  const sharedDoc=await read('xl/sharedStrings.xml',false),shared=sharedDoc?children(sharedDoc.documentElement,'si').map((item)=>Array.from(item.getElementsByTagNameNS('*','t')).map((part)=>part.textContent??'').join('')):[]
  const stylesDoc=await read('xl/styles.xml',false),themeDoc=await read('xl/theme/theme1.xml',false)
  const colorScheme=themeDoc?Array.from(themeDoc.getElementsByTagNameNS('*','clrScheme')[0]?.children??[]).map((item)=>attribute(child(item,'srgbClr')??child(item,'sysClr'),'val')??attribute(child(item,'sysClr'),'lastClr')??''):[]
  const fonts=children(child(stylesDoc?.documentElement,'fonts'),'font'),fills=children(child(stylesDoc?.documentElement,'fills'),'fill'),borders=children(child(stylesDoc?.documentElement,'borders'),'border')
  const formats=new Map(children(child(stylesDoc?.documentElement,'numFmts'),'numFmt').flatMap((item)=>{const id=attribute(item,'numFmtId');return id?[[id,attribute(item,'formatCode')??'']]:[]}))
  const xfs=children(child(stylesDoc?.documentElement,'cellXfs'),'xf')
  const styleFor=(index:number):XlsxStyle|undefined=>{const xf=Number.isInteger(index)&&index>=0?xfs[index]:undefined;if(!xf)return undefined;const font=fonts[Number(attribute(xf,'fontId')??0)],fill=fills[Number(attribute(xf,'fillId')??0)],border=borders[Number(attribute(xf,'borderId')??0)],pattern=child(fill,'patternFill');const numFmtId=attribute(xf,'numFmtId')??'',format=formats.get(numFmtId)??({14:'mm-dd-yy',15:'d-mmm-yy',16:'d-mmm',17:'mmm-yy',22:'m/d/yy h:mm'} as Record<string,string>)[numFmtId];return{bold:!!child(font,'b'),color:nodeColor(child(font,'color'),colorScheme),background:nodeColor(child(pattern,'fgColor'),colorScheme),align:attribute(child(xf,'alignment'),'horizontal'),border:!!border&&['left','right','top','bottom'].some((side)=>!!attribute(child(border,side),'style')),numberFormat:format}}
  const sheets:XlsxSheet[]=[]
  for(const sheetNode of Array.from(workbook!.getElementsByTagNameNS('*','sheet'))) {
    const name=attribute(sheetNode,'name')??`Hoja ${sheets.length+1}`,id=relationshipId(sheetNode);if(!id)throw new XlsxStructureError(`La hoja "${name}" no declara su relación OOXML.`)
    const relation=relationTargets.get(id);if(!relation||relation.external)throw new XlsxStructureError(`No se encontró la relación interna ${id} de la hoja "${name}".`)
    const document=await read(resolvePath('xl/workbook.xml',relation.target)),cells=new Map<string,XlsxCell>();let rows=0,columns=0,lastRow=0
    for(const rowNode of Array.from(document!.getElementsByTagNameNS('*','row'))) {const declaredRow=Number(attribute(rowNode,'r')),row=Number.isInteger(declaredRow)&&declaredRow>0?declaredRow:lastRow+1;lastRow=row;rows=Math.max(rows,row);let lastColumn=0;for(const node of children(rowNode,'c')){const declaredReference=attribute(node,'r'),position=declaredReference?cellPosition(declaredReference):{row,column:lastColumn+1};lastColumn=position.column;const reference=declaredReference?.toUpperCase()??`${columnLabel(position.column)}${position.row}`,type=attribute(node,'t'),raw=child(node,'v')?.textContent??'',style=styleFor(Number(attribute(node,'s')??0));let value=type==='s'?shared[Number(raw)]??'':type==='b'?(raw==='1'?'VERDADERO':'FALSO'):type==='inlineStr'?Array.from(node.getElementsByTagNameNS('*','t')).map((part)=>part.textContent??'').join(''):raw;if(type==='n'&&style?.numberFormat&&/[dmy]/i.test(style.numberFormat)&&Number.isFinite(Number(raw)))value=new Date(Date.UTC(1899,11,30+Number(raw))).toISOString().slice(0,10);const formula=child(node,'f')?.textContent;if(formula&&!value)value=`=${formula}`;cells.set(reference,{value,style});rows=Math.max(rows,position.row);columns=Math.max(columns,position.column)}}
    for(const merge of Array.from(document!.getElementsByTagNameNS('*','mergeCell'))) {const reference=attribute(merge,'ref');if(!reference)continue;const[from,to]=reference.split(':');if(!to)continue;const a=cellPosition(from),b=cellPosition(to),current=cells.get(from.toUpperCase())??{value:''};current.merge={columns:b.column-a.column+1,rows:b.row-a.row+1};cells.set(from.toUpperCase(),current);rows=Math.max(rows,b.row);columns=Math.max(columns,b.column)}
    const widths:number[]=[];for(const col of Array.from(document!.getElementsByTagNameNS('*','col'))){const min=Number(attribute(col,'min')),max=Number(attribute(col,'max'));if(!Number.isInteger(min)||!Number.isInteger(max)||min<1||max<min)continue;const declared=Number(attribute(col,'width')),width=Number.isFinite(declared)&&declared>0?Math.min(320,Math.max(64,declared*7)):112;for(let index=min;index<=max;index++)widths[index-1]=width}
    sheets.push({name,rows,columns,widths,cells})
  }
  return {sheets}
}
