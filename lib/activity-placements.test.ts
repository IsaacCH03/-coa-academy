import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { academicActivities } from './academic-activities'
import { activityPlacements } from './activity-placements'

const sourceCache = new Map<string, string>()
const source = (path: string) => sourceCache.get(path) ?? (() => { const value = readFileSync(path, 'utf8'); sourceCache.set(path, value); return value })()
const markerFor = (id: string, path: string) => path.endsWith('.md') ? `<!-- coa-activity:${id} -->` : `<ActivityDeliveryPoint activityId="${id}" />`

describe('73 explicit pedagogical activity anchors', () => {
  it('maps all approved activities once with the approved course distribution', () => {
    const activityIds = academicActivities.map((item) => item.id)
    const placementIds = activityPlacements.map((item) => item.activityId)
    expect(activityPlacements).toHaveLength(73)
    expect(new Set(placementIds).size).toBe(73)
    expect(new Set(placementIds)).toEqual(new Set(activityIds))
    expect(Object.fromEntries(Object.entries(Object.groupBy(activityPlacements, (item) => item.courseSlug)).map(([course, items]) => [course, items?.length]))).toEqual({
      'logica-de-programacion': 12, 'desarrollo-web-moderno': 11, 'python-practico': 12,
      'sql-bases-datos': 12, 'desarrollo-web-django': 14, 'programacion-con-ia': 12,
    })
  })

  it('places every known anchor once in its declared course and module source', () => {
    for (const placement of activityPlacements) {
      const activity = academicActivities.find((item) => item.id === placement.activityId)
      expect(activity, placement.activityId).toBeDefined()
      expect(placement.courseSlug, placement.activityId).toBe(activity?.courseSlug)
      expect(placement.moduleId, placement.activityId).toBe(activity?.moduleId)
      expect(source(placement.source).split(markerFor(placement.activityId, placement.source))).toHaveLength(2)
    }
  })

  it('keeps the required before → delivery → after order for all 73 activities', () => {
    for (const placement of activityPlacements) {
      const text = source(placement.source)
      const markerIndex = text.indexOf(markerFor(placement.activityId, placement.source))
      const beforeIndex = text.lastIndexOf(placement.before, markerIndex)
      const afterIndex = text.indexOf(placement.after, markerIndex)
      expect(beforeIndex, `${placement.activityId}: contenido anterior`).toBeGreaterThanOrEqual(0)
      expect(markerIndex, `${placement.activityId}: anchor`).toBeGreaterThan(beforeIndex)
      expect(afterIndex, `${placement.activityId}: contenido posterior`).toBeGreaterThan(markerIndex)
    }
  })

  it.each([
    ['Lógica', 'logica-m2-ejercicios-retos'],
    ['Web Moderno', 'desarrollo-web-m1-mini-proyecto'],
    ['Python Práctico', 'python-practico-m1-actividades-obligatorias'],
    ['SQL', 'sql-m1-proyecto'],
    ['Django', 'django-m7-proyecto-final'],
    ['Programación con IA', 'programacion-ia-m1-mini-proyecto'],
  ])('verifies a representative pedagogical sequence for %s', (_course, activityId) => {
    const placement = activityPlacements.find((item) => item.activityId === activityId)
    expect(placement, activityId).toBeDefined()
    if (!placement) return
    const text = source(placement.source)
    const markerIndex = text.indexOf(markerFor(activityId, placement.source))
    expect(text.lastIndexOf(placement.before, markerIndex)).toBeGreaterThanOrEqual(0)
    expect(text.indexOf(placement.after, markerIndex)).toBeGreaterThan(markerIndex)
  })

  it.each([1, 2, 3])('places the existing IA M%s exercise rubric before its delivery', (moduleNumber) => {
    const activityId = `programacion-ia-m${moduleNumber}-ejercicios-obligatorios`
    const placement = activityPlacements.find((item) => item.activityId === activityId)
    expect(placement, activityId).toBeDefined()
    if (!placement) return
    const text = source(placement.source)
    const markerIndex = text.indexOf(markerFor(activityId, placement.source))
    const rubricIndex = text.lastIndexOf('## Rúbrica de los ejercicios', markerIndex)
    expect(rubricIndex).toBeGreaterThanOrEqual(0)
    expect(markerIndex).toBeGreaterThan(rubricIndex)
  })

  it('contains no unknown or duplicate source anchors', () => {
    const files = [...new Set(activityPlacements.map((item) => item.source))]
    const discovered = files.flatMap((path) => {
      const pattern = path.endsWith('.md') ? /<!-- coa-activity:([a-z0-9-]+) -->/g : /<ActivityDeliveryPoint activityId="([a-z0-9-]+)" \/>/g
      return [...source(path).matchAll(pattern)].map((match) => match[1])
    })
    expect(discovered).toHaveLength(73)
    expect(new Set(discovered).size).toBe(73)
    expect(new Set(discovered)).toEqual(new Set(academicActivities.map((item) => item.id)))
  })

  it('does not render a global activity block at the end of ModuleExperience', () => {
    const experience = source('components/module-experience.tsx')
    expect(experience).not.toContain('ModuleActivities')
    expect(experience).not.toContain('actividades-del-modulo')
  })
})
