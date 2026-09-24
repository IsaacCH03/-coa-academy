import { NextResponse } from 'next/server'
import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

async function adminFile(id: string) {
  const account = await getCurrentAccount()
  if (!account || account.profile.role !== 'admin') return { status: 403 as const }
  const supabase = await createClient()
  const { data } = await supabase.from('submission_files').select('id,storage_path,original_filename,file_deleted_at').eq('id', id).maybeSingle<{ id: string; storage_path: string; original_filename: string; file_deleted_at: string | null }>()
  return data && !data.file_deleted_at ? { status: 200 as const, supabase, file: data } : { status: 404 as const }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const result = await adminFile(id)
  if (result.status !== 200) return NextResponse.json({ error: result.status === 403 ? 'No autorizado.' : 'El archivo no está disponible.' }, { status: result.status })
  const { data, error } = await result.supabase.storage.from('academic-submissions').createSignedUrl(result.file.storage_path, 60, { download: result.file.original_filename })
  if (error || !data?.signedUrl) return NextResponse.json({ error: 'No pudimos preparar la descarga.' }, { status: 404 })
  return NextResponse.redirect(data.signedUrl)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const result = await adminFile(id)
  if (result.status !== 200) return NextResponse.json({ error: result.status === 403 ? 'No autorizado.' : 'El archivo no está disponible.' }, { status: result.status })
  const { error } = await result.supabase.storage.from('academic-submissions').remove([result.file.storage_path])
  if (error) return NextResponse.json({ error: 'No pudimos borrar el objeto privado.' }, { status: 400 })
  const { error: metadataError } = await result.supabase.from('submission_files').update({ file_deleted_at: new Date().toISOString() }).eq('id', id)
  if (metadataError) return NextResponse.json({ error: 'El objeto se eliminó, pero no pudimos marcar su metadata.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
