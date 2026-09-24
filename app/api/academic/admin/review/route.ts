import { NextResponse } from 'next/server'
import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const account = await getCurrentAccount()
  if (!account) return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 })
  if (account.profile.role !== 'admin') return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  const body = await request.json() as { studentId?: string; activityId?: string; status?: string; feedback?: string; convalidationNote?: string }
  if (!body.studentId || !body.activityId || !['approved', 'correction', 'convalidated'].includes(body.status ?? '')) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  if (body.status === 'correction' && !body.feedback?.trim()) return NextResponse.json({ error: 'La retroalimentación es obligatoria para solicitar correcciones.' }, { status: 400 })
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('review_student_activity', { p_student_id: body.studentId, p_activity_id: body.activityId, p_status: body.status, p_feedback: body.feedback?.trim() || null, p_convalidation_note: body.convalidationNote?.trim() || null })
  if (error) return NextResponse.json({ error: 'No pudimos guardar la revisión solicitada.' }, { status: 400 })
  return NextResponse.json({ record: data })
}
