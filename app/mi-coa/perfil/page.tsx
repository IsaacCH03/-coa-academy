import { AccountShell } from '@/components/account/account-shell'
import { Field, inputClass } from '@/components/phase3-shell'
import { ProfilePhotoPicker } from '@/components/profile-photo-picker'
import { updatePublicProfile } from '@/app/phase3-actions'
import { requireAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; guardado?: string }> }) {
  const { user, profile } = await requireAccount()
  const supabase = await createClient()
  const [{ data: publicProfile }, query] = await Promise.all([
    supabase.from('profiles').select('public_slug,public_bio,occupation,public_location,public_github_url,avatar_path').eq('id', user.id).single(),
    searchParams,
  ])
  const avatarUrl = publicProfile?.avatar_path
    ? (await supabase.storage.from('phase3-media').createSignedUrl(publicProfile.avatar_path, 3600)).data?.signedUrl
    : null

  return <AccountShell eyebrow="Tu cuenta" title="Mi perfil">
    {query.error && <p role="alert" className="mb-4 rounded-xl bg-destructive/10 p-4 text-destructive">{query.error}</p>}
    {query.guardado && <p role="status" className="mb-4 rounded-xl bg-primary/10 p-4 text-primary">Perfil actualizado.</p>}
    <ProfilePhotoPicker currentUrl={avatarUrl??null} fullName={profile.full_name} formId="profile-form"/>
    <p className="mb-6 text-muted-foreground">Completa únicamente la información que quieras mostrar junto a tus proyectos. Nunca publicamos tu correo, teléfono ni identificación.</p>
    <form id="profile-form" action={updatePublicProfile} className="grid max-w-2xl gap-5 rounded-2xl border bg-background p-6">
      <Field label="Identificador público"><input className={inputClass} name="public_slug" defaultValue={publicProfile?.public_slug??''} placeholder="josue-chevez"/></Field>
      <Field label="Ocupación"><input className={inputClass} name="occupation" maxLength={120} defaultValue={publicProfile?.occupation??''}/></Field>
      <Field label="País o región general"><input className={inputClass} name="location" maxLength={120} defaultValue={publicProfile?.public_location??''}/></Field>
      <Field label="Descripción"><textarea className={`${inputClass} min-h-32`} name="bio" maxLength={500} defaultValue={publicProfile?.public_bio??''}/></Field>
      <Field label="GitHub"><input className={inputClass} type="url" name="github" defaultValue={publicProfile?.public_github_url??''}/></Field>
      <button className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">Guardar perfil</button>
    </form>
  </AccountShell>
}
