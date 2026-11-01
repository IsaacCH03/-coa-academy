import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20261101000000_fix_activity_configurable_file_size.sql'),
  'utf8',
)
const liveGroups = readFileSync(
  join(process.cwd(), 'supabase/migrations/20261005000000_standalone_public_live_groups.sql'),
  'utf8',
)

describe('limite configurable por archivo en actividades', () => {
  it('reemplaza la igualdad historica de 10 MiB por el rango de 1 a 50 MiB', () => {
    expect(migration).toMatch(/drop constraint if exists activities_max_file_size_bytes_check/i)
    expect(migration).toMatch(/check \(max_file_size_bytes between 1 and 52428800\)/i)
  })

  it('mantiene el techo privado de Storage alineado con el maximo configurable', () => {
    expect(migration).toMatch(/update storage\.buckets[\s\S]*file_size_limit = 52428800[\s\S]*id = 'academic-submissions'/i)
  })

  it('coincide con el rango validado por el RPC de grupos en vivo', () => {
    expect(liveGroups).toMatch(/p_max_file_size_bytes not between 1 and 52428800/i)
  })
})
