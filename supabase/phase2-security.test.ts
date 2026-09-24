import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(new URL('./migrations/20260923000000_phase2_courses_enrollments.sql', import.meta.url), 'utf8')
const courseSource = readFileSync(new URL('../lib/courses.ts', import.meta.url), 'utf8')

describe('contrato de seguridad de cursos y matrículas', () => {
  it('activa RLS y no concede matrículas a visitantes', () => {
    expect(sql).toMatch(/alter table public\.courses enable row level security/i)
    expect(sql).toMatch(/alter table public\.enrollments enable row level security/i)
    expect(sql).toMatch(/revoke all on table public\.enrollments from anon, authenticated/i)
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete)[^;]*enrollments[^;]*to anon/i)
  })

  it('limita la creación a la propia identidad, un estudiante y un curso publicado', () => {
    expect(sql).toMatch(/for insert[\s\S]*?\(select auth\.uid\(\)\) = student_id/i)
    expect(sql).toMatch(/public\.profiles[\s\S]*?role = 'student'/i)
    expect(sql).toMatch(/public\.courses[\s\S]*?id = course_id and status = 'published'/i)
    expect(sql).toMatch(/grant insert \(student_id, course_id\) on public\.enrollments to authenticated/i)
  })

  it('impide duplicados y reserva cambios administrativos a is_admin', () => {
    expect(sql).toMatch(/unique \(student_id, course_id\)/i)
    expect(sql).toMatch(/enrollments_read_own_or_admin[\s\S]*?\(select auth\.uid\(\)\) = student_id or \(select public\.is_admin\(\)\)/i)
    expect(sql).toMatch(/enrollments_admin_update[\s\S]*?using \(\(select public\.is_admin\(\)\)\)/i)
    expect(sql).toMatch(/enrollments_admin_delete[\s\S]*?using \(\(select public\.is_admin\(\)\)\)/i)
  })

  it('mantiene privados los datos académicos del perfil', () => {
    expect(sql).toMatch(/grant update \(full_name, identification, country, phone\) on public\.profiles to authenticated/i)
    expect(sql).not.toMatch(/grant\s+select[^;]*profiles[^;]*to anon/i)
  })

  it('siembra exactamente los cursos definidos en el catálogo actual', () => {
    const catalogSlugs = [...courseSource.matchAll(/slug: '([^']+)'/g)].map((match) => match[1]).sort()
    const seedSection = sql.slice(sql.indexOf('insert into public.courses'))
    const seedSlugs = [...seedSection.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)*)',\s*'[^']*',\s*'(?:published|draft)'/g)].map((match) => match[1]).sort()
    expect(seedSlugs).toEqual(catalogSlugs)
  })
})
