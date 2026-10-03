import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const publicGroups = readFileSync(new URL('./migrations/20261003000000_public_live_groups.sql', import.meta.url), 'utf8')
const coverFix = readFileSync(new URL('./migrations/20261004000000_fix_public_live_group_cover_read.sql', import.meta.url), 'utf8')
const phase3 = readFileSync(new URL('./migrations/20261007000000_course_demand_and_coa_projects.sql', import.meta.url), 'utf8')
const fix = readFileSync(new URL('./migrations/20261009000000_fix_anonymous_public_discovery.sql', import.meta.url), 'utf8')

describe('descubrimiento público anónimo', () => {
  it('solo permite descubrir grupos públicos activos', () => {
    expect(publicGroups).toMatch(/live_groups_public_read[\s\S]*to anon, authenticated[\s\S]*access_type = 'public' and status = 'active'/i)
    expect(publicGroups).not.toMatch(/live_groups_public_read[\s\S]*access_type = 'private'/i)
  })

  it('limita la portada a grupos públicos activos y visibles', () => {
    expect(coverFix).toMatch(/is_public_live_group_cover[\s\S]*access_type = 'public'[\s\S]*status = 'active'[\s\S]*show_banner or g\.show_catalog/i)
    expect(coverFix).toMatch(/grant execute on function public\.is_public_live_group_cover\(uuid\) to anon, authenticated/i)
  })

  it('separa proyectos publicados de estados privados para anon', () => {
    expect(fix).toMatch(/projects_anon_read[\s\S]*to anon[\s\S]*status = 'published'/i)
    const anonPolicy = fix.match(/create policy projects_anon_read[\s\S]*?;/i)?.[0] ?? ''
    expect(anonPolicy).not.toMatch(/pending|rejected|is_admin/)
    expect(fix).toMatch(/project_images_anon_read[\s\S]*p\.status = 'published'/i)
  })

  it('expone propuestas y opciones abiertas sin exponer interesados', () => {
    expect(fix).toMatch(/proposals_anon_read[\s\S]*status = 'open'/i)
    expect(fix).toMatch(/proposal_options_anon_read[\s\S]*p\.status = 'open'/i)
    expect(phase3).not.toMatch(/grant select on public\.course_requests to anon/i)
  })

  it('elimina llamadas administrativas de las ramas anónimas', () => {
    for (const name of ['proposals_anon_read', 'proposal_options_anon_read', 'projects_anon_read', 'project_images_anon_read']) {
      const policy = fix.match(new RegExp(`create policy ${name}[\\s\\S]*?;`, 'i'))?.[0] ?? ''
      expect(policy).not.toMatch(/is_admin/)
    }
  })

  it('lee avatares públicos mediante helper seguro y conserva el bucket privado', () => {
    expect(fix).toMatch(/function public\.is_public_profile_avatar[\s\S]*security definer/i)
    expect(fix).toMatch(/grant execute on function public\.is_public_profile_avatar\(text\) to anon, authenticated/i)
    expect(fix).toMatch(/drop policy if exists phase3_profile_avatar_read/i)
    expect(phase3).toMatch(/'phase3-media','phase3-media',false/i)
  })
})
