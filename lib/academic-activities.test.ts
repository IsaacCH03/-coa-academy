import { describe, expect, it } from 'vitest'
import { academicActivities, getModuleActivities, normalizeRubricScore } from './academic-activities'

describe('Phase 3A academic activities', () => {
  it('defines exactly the approved 73 stable, unique activities', () => {
    expect(academicActivities).toHaveLength(73)
    expect(new Set(academicActivities.map((item) => item.id)).size).toBe(73)
    expect(academicActivities.every((item) => /^[a-z0-9-]+$/.test(item.id))).toBe(true)
  })

  it('keeps the approved distribution by course', () => {
    const counts = Object.groupBy(academicActivities, (item) => item.courseSlug)
    expect(Object.fromEntries(Object.entries(counts).map(([slug, items]) => [slug, items?.length]))).toEqual({
      'logica-de-programacion': 12,
      'desarrollo-web-moderno': 11,
      'python-practico': 12,
      'sql-bases-datos': 12,
      'desarrollo-web-django': 14,
      'programacion-con-ia': 12,
    })
  })

  it('does not create activities for AI modules 5 or 6', () => {
    expect(academicActivities.filter((item) => item.courseSlug === 'programacion-con-ia').every((item) => item.moduleNumber <= 4)).toBe(true)
    expect(getModuleActivities('programacion-ia-modulo-4')).toHaveLength(3)
  })

  it('preserves 41 existing rubrics and defines the 32 approved new rubrics', () => {
    const existing = academicActivities.filter((item) => item.rubric.origin === 'existing')
    const added = academicActivities.filter((item) => item.rubric.origin === 'new')
    expect(existing).toHaveLength(41)
    expect(added).toHaveLength(32)
    expect(existing.filter((item) => item.rubric.originalMaxPoints === 100)).toHaveLength(25)
    expect(existing.filter((item) => [15, 20, 50].includes(item.rubric.originalMaxPoints))).toHaveLength(16)
  })

  it('makes every new rubric total 100 with valid ordered criteria', () => {
    for (const activity of academicActivities.filter((item) => item.rubric.origin === 'new')) {
      expect(activity.rubric.criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0), activity.id).toBe(100)
      expect(activity.rubric.criteria.every((criterion) => criterion.maxPoints >= 0)).toBe(true)
      expect(activity.rubric.criteria.map((criterion) => criterion.displayOrder)).toEqual(activity.rubric.criteria.map((_, index) => index + 1))
    }
  })

  it('gives every activity a rubric and coherent module order', () => {
    for (const activity of academicActivities) expect(activity.rubric).toBeDefined()
    for (const moduleId of new Set(academicActivities.map((item) => item.moduleId))) {
      expect(getModuleActivities(moduleId).map((item) => item.displayOrder)).toEqual(getModuleActivities(moduleId).map((_, index) => index + 1))
    }
  })

  it('uses the approved Logic module 1 grouping', () => {
    expect(getModuleActivities('logica-programacion-modulo-1').map((item) => item.id)).toEqual([
      'logica-m1-ejercicios-1-4',
      'logica-m1-ejercicios-5-7-retos',
      'logica-m1-mini-proyecto-robot-domestico',
    ])
  })

  it('keeps enrollment forms outside academic activities', () => {
    expect(academicActivities.some((item) => item.legacySubmissionUrl?.includes('2yHe7LbXPfmAdNha9'))).toBe(false)
  })

  it('normalizes historical scores safely and consistently', () => {
    const historical = academicActivities.find((item) => item.rubric.originalMaxPoints === 50)
    expect(historical).toBeDefined()
    expect(normalizeRubricScore(42, historical!.rubric)).toBe(84)
    expect(normalizeRubricScore(-2, historical!.rubric)).toBe(0)
    expect(normalizeRubricScore(80, historical!.rubric)).toBe(100)
    expect(normalizeRubricScore(Number.NaN, historical!.rubric)).toBe(0)
  })
})
