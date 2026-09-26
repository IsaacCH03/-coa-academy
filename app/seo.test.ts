import { describe, expect, it } from 'vitest'
import { certificados } from '@/data/certificados'
import { courses } from '@/lib/courses'
import { academicCoursePaths } from '@/lib/course-access'
import sitemap from './sitemap'
import robots from './robots'
import { metadata as admin } from './admin/layout'
import { metadata as dashboard } from './mi-coa/layout'
import { metadata as account } from './cuenta/layout'
import { metadata as enrollment } from './inscripcion/layout'
import { metadata as logic } from './cursos/logica-de-programacion/curso/layout'
import { metadata as web } from './cursos/desarrollo-web-moderno/curso/layout'
import { metadata as python } from './cursos/python-practico/curso/layout'
import { metadata as sql } from './cursos/sql-bases-datos/curso/layout'
import { metadata as django } from './cursos/desarrollo-web-django/curso/layout'
import { metadata as ai } from './cursos/programacion-con-ia/curso/layout'
import { metadata as home } from './page'
import { metadata as certificates } from './certificados/page'
import { metadata as experience } from './experiencia-profesional/page'
import { metadata as ide } from './ide/page'
import { metadata as terms } from './terminos-y-condiciones/page'
import { generateMetadata as courseMetadata } from './cursos/[slug]/page'

const origin = 'https://www.cursoscoa.com'

describe('public sitemap', () => {
  const entries = sitemap()
  const urls = entries.map(({ url }) => url)

  it('includes the homepage and public utility pages', () => {
    for (const path of ['/', '/experiencia-profesional', '/certificados', '/ide', '/terminos-y-condiciones']) {
      expect(urls).toContain(`${origin}${path}`)
    }
  })

  it('includes exactly the available catalog courses', () => {
    expect(urls.filter((url) => new URL(url).pathname.startsWith('/cursos/')))
      .toEqual(courses.filter((course) => !course.comingSoon).map(({ slug }) => `${origin}/cursos/${slug}`))
    expect(urls).toContain(`${origin}/cursos/python-practico`)
    expect(urls).not.toContain(`${origin}/cursos/programacion-con-ia`)
    expect(urls).not.toContain(`${origin}/cursos/marketing-digital`)
  })

  it('includes only existing public certificates', () => {
    expect(urls.filter((url) => new URL(url).pathname.startsWith('/certificados/')))
      .toEqual(certificados.map(({ codigo }) => `${origin}/certificados/${encodeURIComponent(codigo)}`))
    expect(urls).toContain(`${origin}/certificados/COA-PYB-2026-0001`)
  })

  it('contains only unique canonical URLs without private paths or invented metadata', () => {
    expect(new Set(urls).size).toBe(urls.length)
    for (const entry of entries) {
      const url = new URL(entry.url)
      expect(url.origin).toBe(origin)
      expect(url.hash).toBe('')
      expect(url.search).toBe('')
      expect(url.pathname).not.toMatch(/^\/(admin|mi-coa|cuenta|api|auth|inscripcion|reset|recovery|404)(\/|$)/)
      expect(url.pathname).not.toMatch(/^\/cursos\/[^/]+\/(curso|inscripcion)(\/|$)/)
      expect(Object.keys(entry)).toEqual(['url'])
    }
  })
})

describe('robots rules', () => {
  const config = robots()
  const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules
  const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow ?? '']
  const blocked = (path: string) => disallow.some((pattern) => {
    const expression = pattern.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')
    return new RegExp(`^${expression}`).test(path)
  })

  it('allows all sitemap pages', () => {
    expect(rule.userAgent).toBe('*')
    expect(rule.allow).toBe('/')
    for (const { url } of sitemap()) expect(blocked(new URL(url).pathname)).toBe(false)
  })

  it('blocks private roots and descendants, including academic modules', () => {
    for (const root of ['/admin', '/mi-coa', '/cuenta', '/api', '/auth', '/inscripcion', ...Object.values(academicCoursePaths)]) {
      for (const suffix of ['', '/', '/nested', '?next=example']) expect(blocked(`${root}${suffix}`)).toBe(true)
    }
    expect(blocked('/cursos/python-practico/curso/modulo-2')).toBe(true)
    expect(blocked('/cursos/python-practico/inscripcion')).toBe(true)
  })

  it('declares the production host and sitemap', () => {
    expect(config.host).toBe(origin)
    expect(config.sitemap).toBe(`${origin}/sitemap.xml`)
  })
})

it('sets noindex on the account and academic layouts', () => {
  for (const metadata of [admin, dashboard, account, enrollment, logic, web, python, sql, django, ai]) {
    expect(metadata.robots).toEqual({ index: false, follow: false })
  }
})

describe('public metadata', () => {
  it('uses self-referencing canonicals and complete social metadata', async () => {
    const python = await courseMetadata({ params: Promise.resolve({ slug: 'python-practico' }) })
    const entries = [
      [home, '/'],
      [experience, '/experiencia-profesional'],
      [certificates, '/certificados'],
      [ide, '/ide'],
      [terms, '/terminos-y-condiciones'],
      [python, '/cursos/python-practico'],
    ] as const

    for (const [metadata, path] of entries) {
      expect(metadata.alternates?.canonical).toBe(path)
      expect(metadata.openGraph?.url).toBe(path)
      expect(metadata.openGraph?.title).toBe(metadata.title)
      expect(metadata.openGraph?.description).toBe(metadata.description)
      expect(metadata.openGraph?.images).toBeTruthy()
      expect(metadata.twitter?.title).toBe(metadata.title)
      expect(metadata.twitter?.description).toBe(metadata.description)
      expect(metadata.twitter?.images).toBeTruthy()
    }
  })
})
