// @vitest-environment jsdom
import{cleanup,render,screen}from'@testing-library/react'
import{afterEach,expect,it}from'vitest'
import{PublicLiveGroupBanners}from'./public-live-group-banners'
const group={id:'1',slug:'python-j26',name:'Python J26',startsOn:'2026-10-10',summary:'Tres clases en vivo.',showBanner:true,showCatalog:true,image:'/placeholder.svg',course:{slug:'python-nivel-1',title:'Python Nivel 1',category:'Programación'}}
afterEach(cleanup)
it('muestra sólo banners marcados y enlaza al flujo de confirmación',()=>{render(<PublicLiveGroupBanners groups={[group,{...group,id:'2',slug:'oculto',showBanner:false}]}/>);expect(screen.getByRole('heading',{name:'Python J26'})).toBeTruthy();expect(screen.queryByRole('heading',{name:'oculto'})).toBeNull();expect(screen.getByRole('link',{name:/Inscribirme/}).getAttribute('href')).toBe('/inscripcion/grupo/python-j26')})
it('muestra un grupo independiente con sus propios datos',()=>{render(<PublicLiveGroupBanners groups={[{...group,id:'3',slug:'taller-ia',name:'Taller Python + IA',course:null}]}/>);expect(screen.getByRole('heading',{name:'Taller Python + IA'})).toBeTruthy();expect(screen.queryByText('Python Nivel 1')).toBeNull();expect(screen.getByText('Tres clases en vivo.')).toBeTruthy()})
