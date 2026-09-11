import { afterEach, expect, it, vi } from 'vitest'
import { courses } from '@/lib/courses'
import CourseAvailabilityLayout from './layout'

vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NOT_FOUND') } }))
const course = courses.find(course => course.slug === 'programacion-con-ia')!
const original = course.comingSoon
afterEach(() => { course.comingSoon = original })
it('blocks nested course routes while the course is coming soon', () => {
  course.comingSoon = true
  expect(() => CourseAvailabilityLayout({ children: 'lesson' })).toThrow('NOT_FOUND')
})
it('allows nested course routes when the course is published', () => {
  course.comingSoon = false
  expect(CourseAvailabilityLayout({ children: 'lesson' })).toBe('lesson')
})