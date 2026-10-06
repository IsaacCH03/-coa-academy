import{describe,expect,it}from'vitest'
import{adminReturnLabel,safeAdminReturnTo}from'./admin-navigation'

describe('navegación administrativa contextual',()=>{
 it('conserva rutas internas con filtros',()=>expect(safeAdminReturnTo('/admin/entregas?view=archived&page=2','/admin')).toBe('/admin/entregas?view=archived&page=2'))
 it('rechaza destinos externos, protocol-relative y ajenos al admin',()=>{expect(safeAdminReturnTo('https://evil.test','/admin')).toBe('/admin');expect(safeAdminReturnTo('//evil.test/x','/admin')).toBe('/admin');expect(safeAdminReturnTo('/proyectos','/admin')).toBe('/admin')})
 it('produce una etiqueta contextual',()=>expect(adminReturnLabel('/admin/grupos')).toBe('Volver a grupos en vivo'))
})
