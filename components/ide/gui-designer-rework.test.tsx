// @vitest-environment jsdom
import{cleanup,fireEvent,render,screen}from'@testing-library/react'
import{afterEach,beforeAll,describe,expect,it,vi}from'vitest'
import{newV2Design}from'@/lib/ide/gui-designer-v2'
import{GuiDesigner}from'./gui-designer'

beforeAll(()=>{HTMLDialogElement.prototype.showModal=vi.fn()})
afterEach(cleanup)
const setup=()=>{const onChange=vi.fn();render(<GuiDesigner design={newV2Design()} entries={[]} onChange={onChange} onSave={async()=>{}} onAnalyze={async()=>({ok:false as const,reason:'missing' as const})}/>);return onChange}

describe('rework de COA Designer',()=>{
  it('prepara localmente una especificación para IA',()=>{setup();fireEvent.click(screen.getByRole('button',{name:'Preparar para IA'}));expect(screen.getByTestId('ai-design-spec').textContent).toContain('VENTANAS');expect(screen.getByRole('button',{name:'Copiar para IA'})).toBeTruthy()})
  it('bloquea exportadores experimentales sin modificar el diseño',()=>{const onChange=setup();fireEvent.click(screen.getByText('Experimental',{selector:'summary'}));fireEvent.click(screen.getByRole('button',{name:'Exportar a Tkinter'}));expect(document.querySelector('dialog[aria-label="Función experimental"]')).toBeTruthy();expect(onChange).not.toHaveBeenCalled()})
  it('crea una segunda ventana desde las pestañas',()=>{const onChange=setup();fireEvent.click(screen.getByRole('button',{name:'Crear ventana'}));const dialog=screen.getByRole('dialog',{name:'Crear ventana'});fireEvent.change(dialog.querySelector('input')!,{target:{value:'login'}});fireEvent.click(screen.getByRole('button',{name:'Crear'}));expect(onChange).toHaveBeenCalled();expect(onChange.mock.calls.at(-1)?.[0].windows).toHaveLength(2)})
  it('el zoom visual no modifica las dimensiones del diseño',()=>{const onChange=setup();fireEvent.click(screen.getByRole('button',{name:'Aumentar zoom'}));expect(screen.getByText('125%')).toBeTruthy();expect(onChange).not.toHaveBeenCalled()})
})
