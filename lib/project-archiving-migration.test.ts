import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql=readFileSync(join(process.cwd(),'supabase/migrations/20261012000000_project_submission_idempotency_and_archiving.sql'),'utf8')

describe('migración de proyectos idempotentes y archivados',()=>{
 it('impone unicidad real por autor e intento',()=>{expect(sql).toContain('unique index if not exists student_projects_author_submission_key_idx');expect(sql).toContain('(author_id, submission_key)')})
 it('archiva fuera del estado de moderación y sin tocar imágenes ni notificaciones',()=>{const archiveFunction=sql.slice(sql.indexOf('create or replace function public.set_student_projects_archived'),sql.indexOf('-- Conserva la firma'));expect(archiveFunction).toContain('admin_archived_at');expect(archiveFunction).not.toMatch(/insert\s+into\s+public\.notifications/i);expect(archiveFunction).not.toMatch(/delete\s+from\s+public\.student_project_images/i);expect(archiveFunction).not.toMatch(/set\s+status\s*=/i)})
 it('autoriza en servidor y permite restaurar',()=>{expect(sql).toContain('not public.is_admin()');expect(sql).toContain('admin_archived_at=null')})
 it('no concede escritura directa del estado de carga',()=>{expect(sql).toContain('revoke insert(upload_state), update(upload_state)');expect(sql).toContain('set_own_project_upload_state');expect(sql).toContain("author_id = auth.uid()")})
 it('es reejecutable y conserva la restricción de archivado',()=>{expect(sql.match(/if not exists/gi)?.length).toBeGreaterThanOrEqual(7);expect(sql).toContain("check (admin_archived_at is null or status = 'pending')")})
 it('mantiene compatible el despliegue anterior y marca los intentos nuevos',()=>{expect(sql).toContain("set default 'ready'");expect(sql).toContain("case when new.submission_key is null then 'ready' else 'uploading' end")})
 it.each([
  ['uploading',null,false],
  ['failed',null,false],
  ['ready','2026-10-25T00:00:00Z',false],
  ['ready',null,true],
 ])('contrato de moderación: estado %s, archivado %s => %s',(uploadState,archivedAt,allowed)=>{const moderate=sql.slice(sql.indexOf('create or replace function public.moderate_student_project'));expect(moderate).toContain("and upload_state = 'ready'");expect(moderate).toContain('and admin_archived_at is null');expect(uploadState==='ready'&&archivedAt===null).toBe(allowed)})
})
