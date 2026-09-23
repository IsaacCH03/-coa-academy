import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(new URL('./migrations/20260921000000_create_profiles.sql', import.meta.url), 'utf8')

describe('contrato de seguridad de profiles', () => {
  it('mantiene RLS activo y sin acceso anónimo', () => {
    expect(sql).toMatch(/alter table public\.profiles enable row level security/i)
    expect(sql).toMatch(/revoke all on table public\.profiles from anon, authenticated/i)
    expect(sql).not.toMatch(/grant\s+select\s+on\s+table\s+public\.profiles\s+to\s+anon/i)
  })

  it('limita al estudiante a su perfil y únicamente full_name', () => {
    expect(sql).toMatch(/using \(\(select auth\.uid\(\)\) = id\)/i)
    expect(sql).toMatch(/grant update \(full_name\) on table public\.profiles to authenticated/i)
    expect(sql).not.toMatch(/grant\s+update\s+on\s+table\s+public\.profiles\s+to\s+authenticated/i)
  })

  it('fuerza student y protege la función administrativa', () => {
    expect(sql).toMatch(/values \([\s\S]*?'student'[\s\S]*?\)/i)
    expect(sql).toMatch(/security definer\s+set search_path = ''[\s\S]*?public\.profiles/i)
    expect(sql).toMatch(/revoke all on function public\.is_admin\(\) from public/i)
    expect(sql).not.toMatch(/grant execute on function public\.is_admin\(\) to anon/i)
  })
})
