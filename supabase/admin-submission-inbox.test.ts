import{readFileSync}from'node:fs'
import{describe,expect,it}from'vitest'

const sql=readFileSync('supabase/migrations/20261011000000_admin_submission_inbox.sql','utf8')
describe('migración de bandeja administrativa',()=>{
 it('agrega archivado nullable sin borrar ni cambiar estados académicos',()=>{expect(sql).toMatch(/add column admin_archived_at timestamptz/i);expect(sql).not.toMatch(/delete from public\.submissions/i);expect(sql).not.toMatch(/update public\.submissions set status/i)})
 it('indexa archivado, orden y filtros reales',()=>{expect(sql).toMatch(/admin_archived_at, submitted_at desc/i);expect(sql).toMatch(/activity_id, submitted_at desc/i);expect(sql).toMatch(/activities\(live_group_id\)/i)})
 it('reactiva una entrega cuando el estudiante vuelve a enviarla',()=>{expect(sql).toMatch(/submitted_at is distinct from old\.submitted_at/i);expect(sql).toMatch(/new\.admin_archived_at := null/i)})
})
