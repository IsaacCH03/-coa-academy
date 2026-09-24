import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migration = readFileSync('supabase/migrations/20260924000000_phase3b_submissions.sql', 'utf8')

describe('phase 3B migration security', () => {
  it('seeds the complete canonical activity catalogue', () => {
    expect(migration.match(/insert into public\.activities /g)).toHaveLength(73)
    expect(migration).toContain("normalized_max_points = excluded.normalized_max_points")
    expect(migration).toContain("source_kind in ('new', 'existing')")
  })

  it('keeps one submission and one stable private object per student and activity', () => {
    expect(migration).toContain('unique (student_id, activity_id)')
    expect(migration).toContain("max_files = 1")
    expect(migration).toContain("'/submission'")
    expect(migration).toContain("'academic-submissions', 'academic-submissions', false, 10485760")
  })

  it('requires an active enrollment in database and storage authorization', () => {
    expect(migration.match(/e\.status = 'active'/g)?.length).toBeGreaterThanOrEqual(5)
    expect(migration).toContain('active enrollment required')
    expect(migration).toContain('security definer set search_path')
    expect(migration).toContain('revoke all on function public.upsert_submission_metadata')
  })

  it('does not expose student mutation policies for submissions or admin fields', () => {
    expect(migration).not.toMatch(/submissions_student_(insert|update)/)
    expect(migration).toContain('submissions_admin_manage')
    expect(migration).toContain('submissions_own_or_admin_read')
  })
})
