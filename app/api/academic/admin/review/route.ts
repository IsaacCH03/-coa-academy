import { NextResponse } from 'next/server'
import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const account = await getCurrentAccount()
  if (!account) return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 })
  if (account.profile.role !== 'admin') return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  const body = await request.json() as { studentId?: string; activityId?: string; status?: string; feedback?: string; convalidationNote?: string; grade?: number }
  if (!body.studentId || !body.activityId || !['approved', 'correction', 'convalidated'].includes(body.status ?? '')) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  if (body.status === 'correction' && !body.feedback?.trim()) return NextResponse.json({ error: 'La retroalimentación es obligatoria para solicitar correcciones.' }, { status: 400 })
  if (body.grade !== undefined && (!Number.isFinite(body.grade) || body.grade < 0 || body.grade > 100)) return NextResponse.json({ error: 'La calificación debe estar entre 0 y 100.' }, { status: 400 })
  const supabase = await createClient()
  const { data: activity } = await supabase.from('activities').select('live_group_id').eq('id', body.activityId).maybeSingle<{ live_group_id: string | null }>()
  const { data, error } = activity?.live_group_id
    ? await supabase.rpc('review_live_group_activity', { p_student_id: body.studentId, p_activity_id: body.activityId, p_status: body.status, p_feedback: body.feedback?.trim() || null, p_grade: body.grade ?? null })
    : await supabase.rpc('review_student_activity', { p_student_id: body.studentId, p_activity_id: body.activityId, p_status: body.status, p_feedback: body.feedback?.trim() || null, p_convalidation_note: body.convalidationNote?.trim() || null })
  if (error) return NextResponse.json({ error: 'No pudimos guardar la revisión solicitada.' }, { status: 400 })
  return NextResponse.json({ record: data })
}
