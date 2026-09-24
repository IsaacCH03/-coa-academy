import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const sql = readFileSync('supabase/migrations/20260926000000_academic_upload_security.sql', 'utf8')
const ambiguityFix = readFileSync('supabase/migrations/20260927000000_fix_submission_finalize_ambiguity.sql', 'utf8')
const route = readFileSync('app/api/academic/submissions/[activityId]/route.ts', 'utf8')

describe('academic upload security hardening', () => {
  it('revokes both metadata-only submission RPCs from authenticated users', () => {
    expect(sql).toContain('revoke execute on function public.upsert_submission_metadata(text, text, text, text, integer, text) from authenticated')
    expect(sql).toContain('revoke execute on function public.submit_activity_files(text, jsonb) from authenticated')
  })

  it('requires a short-lived upload intent owned by the authenticated user', () => {
    expect(sql).toContain("now()+interval '10 minutes'")
    expect(sql).toMatch(/can_upload_submission_object[\s\S]*i\.storage_path=p_name[\s\S]*i\.user_id=\(select auth\.uid\(\)\)[\s\S]*i\.expires_at>now\(\)/i)
    expect(sql).toContain("select public.can_upload_submission_object(name)")
    expect(sql).toMatch(/prepare_activity_upload[\s\S]*active enrollment required/i)
  })

  it('verifies every object and exact size before creating the academic submission', () => {
    expect(sql).toMatch(/finalize_activity_upload[\s\S]*storage\.objects[\s\S]*metadata->>'size'[\s\S]*uploaded object verification failed/i)
    expect(route).toContain("supabase.rpc('prepare_activity_upload'")
    expect(route).toContain("supabase.rpc('finalize_activity_upload'")
    expect(route).not.toContain("supabase.rpc('submit_activity_files'")
  })

  it('only permits student deletion for pending or already replaced objects', () => {
    expect(sql).toMatch(/can_delete_submission_object[\s\S]*submission_upload_intents[\s\S]*file_deleted_at is not null/i)
    expect(sql).toContain('select public.can_delete_submission_object(name)')
  })

  it('qualifies submission_id inside the nested submission RPC and keeps direct execution revoked', () => {
    expect(ambiguityFix).toContain('update public.submission_files as sf set file_deleted_at = v_time where sf.submission_id = v_submission')
    expect(ambiguityFix).not.toMatch(/where\s+submission_id\s*=\s*v_submission/i)
    expect(ambiguityFix).toContain('revoke all on function public.submit_activity_files(text, jsonb) from public, anon, authenticated')
  })
})
