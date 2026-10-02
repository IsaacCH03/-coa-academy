// @vitest-environment jsdom
import{cleanup,render,screen}from'@testing-library/react'
import{afterEach,beforeAll,expect,it,vi}from'vitest'
import{CoursesSection}from'./courses-section'
beforeAll(()=>vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}}))
afterEach(cleanup)
const group={id:'g',slug:'python-j26',name:'Python J26',startsOn:null,summary:null,showBanner:false,showCatalog:true,image:'/placeholder.svg',course:{slug:'python-nivel-1',title:'Python Nivel 1',category:'Programación'}}
it('organiza cursos por metadata y coloca los grupos públicos en Otros',()=>{render(<CoursesSection publicGroups={[group]}/>);for(const category of ['Fundamentos','Lenguajes de programación','Ruta profesional','Tecnología','Otros'])expect(screen.getByRole('heading',{name:category})).toBeTruthy();expect(screen.getByRole('link',{name:/Inscribirme/}).getAttribute('href')).toBe('/inscripcion/grupo/python-j26');expect(screen.getAllByRole('link').some(link=>link.getAttribute('href')==='/cursos/python-nivel-1')).toBe(true);expect(screen.getAllByText('₡10.000').length).toBeGreaterThan(0);expect(screen.getAllByText('Gratis').length).toBeGreaterThan(0);expect(screen.queryByText('Ver detalles')).toBeNull();expect(screen.getByRole('link',{name:'Ver todos los cursos'}).getAttribute('href')).toBe('#todos-los-cursos')})
it('integra un grupo público sin curso dentro de Otros',()=>{render(<CoursesSection publicGroups={[{...group,id:'standalone',slug:'taller-ia',name:'Taller Python + IA',summary:'Taller independiente',course:null}]}/>);expect(screen.getByRole('heading',{name:'Otros'})).toBeTruthy();expect(screen.getAllByText('Taller independiente').length).toBeGreaterThan(0);expect(screen.getByRole('link',{name:/Inscribirme/}).getAttribute('href')).toBe('/inscripcion/grupo/taller-ia')})
