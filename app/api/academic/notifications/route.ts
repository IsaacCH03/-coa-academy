import { NextResponse } from 'next/server'
import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const account = await getCurrentAccount()
  if (!account) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const supabase = await createClient()
  const { data, error } = await supabase.from('notifications').select('id, type, title, message, href, read_at, created_at').eq('user_id', account.user.id).order('created_at', { ascending: false }).limit(20)
  if (error) return NextResponse.json({ error: 'No pudimos cargar las notificaciones.' }, { status: 503 })
  return NextResponse.json({ notifications: data, unread: (data ?? []).filter((item) => !item.read_at).length })
}

export async function PATCH(request: Request) {
  const account = await getCurrentAccount()
  if (!account) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const { id } = await request.json() as { id?: string }
  if (!id) return NextResponse.json({ error: 'Notificación inválida.' }, { status: 400 })
  const supabase = await createClient()
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id).eq('user_id', account.user.id)
  if (error) return NextResponse.json({ error: 'No pudimos actualizar la notificación.' }, { status: 400 })
  return NextResponse.json({ ok: true })
}
