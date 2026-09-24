import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const sql = readFileSync('supabase/migrations/20260925000000_academic_beta_workflow.sql', 'utf8')

describe('academic beta migration security and data preservation', () => {
  it('normalizes files and migrates the existing Phase 3B metadata', () => {
    expect(sql).toContain('create table if not exists public.submission_files')
    expect(sql).toMatch(/insert into public\.submission_files[\s\S]*from public\.submissions[\s\S]*on conflict \(storage_path\) do nothing/i)
    expect(sql).not.toMatch(/drop\s+(table|column).*submissions/i)
  })

  it('enforces five files and 10 MB combined inside the definer function', () => {
    expect(sql).toContain('max_files smallint not null default 5')
    expect(sql).toContain('max_total_size_bytes integer not null default 10485760')
    expect(sql).toContain('jsonb_array_length(p_files) > v_max_files')
    expect(sql).toContain("sum((f->>'size_bytes')::bigint)")
  })

  it('keeps review state mutually exclusive and admin-controlled', () => {
    expect(sql).toContain("status in ('pending', 'under_review', 'approved', 'correction', 'convalidated')")
    expect(sql).toMatch(/review_student_activity[\s\S]*not public\.is_admin\(\)[\s\S]*admin required/i)
    expect(sql).toContain("p_status = 'correction'")
    expect(sql).toContain('native submission required')
    expect(sql).toMatch(/on conflict \(student_id, activity_id\) do update set submission_id = v_submission, status = 'under_review'/i)
    expect(sql).toContain('activity_review_history')
  })

  it('protects email lookup and notifications', () => {
    expect(sql).toMatch(/get_admin_student_email[\s\S]*security definer set search_path = ''[\s\S]*not public\.is_admin\(\)/i)
    expect(sql).toContain('revoke all on function public.get_admin_student_email(uuid) from public, anon')
    expect(sql).toContain('notifications_own_read')
    expect(sql).toContain('notifications_own_mark_read')
    expect(sql).toContain('grant update (read_at) on public.notifications to authenticated')
    expect(sql.match(/insert into public\.notifications\(user_id,type,title,message,href\)/gi)).toHaveLength(1)
  })

  it('uses private UUID object keys and ownership policies', () => {
    expect(sql).toContain("array_length(storage.foldername(name),1)=3")
    expect(sql).toContain('academic_files_own_or_admin_delete_v2')
    expect(sql).not.toMatch(/service_role/i)
  })
})
