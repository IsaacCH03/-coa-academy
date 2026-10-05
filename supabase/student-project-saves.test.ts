import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
const sql=readFileSync(new URL('./migrations/20261010000000_student_project_saves.sql',import.meta.url),'utf8')
describe('guardados privados de proyectos',()=>{
 it('mantiene una única relación por usuario y limpia al borrar usuario o proyecto',()=>{expect(sql).toMatch(/primary key \(user_id, project_id\)/i);expect(sql).toMatch(/references public\.profiles\(id\) on delete cascade/i);expect(sql).toMatch(/references public\.student_projects\(id\) on delete cascade/i)})
 it('limita lectura, inserción y borrado al propietario y solo permite published',()=>{expect(sql).toMatch(/student_project_saves_own_read[\s\S]*user_id = \(select auth\.uid\(\)\)/i);expect(sql).toMatch(/student_project_saves_own_insert[\s\S]*p\.status = 'published'/i);expect(sql).toMatch(/student_project_saves_own_delete[\s\S]*user_id = \(select auth\.uid\(\)\)/i);expect(sql).not.toMatch(/to anon/i)})
})
